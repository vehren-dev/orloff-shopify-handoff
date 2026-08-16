# Invoice Extraction and Reconciliation

Extract all 554 rows from `Orloff_Amazon_Stock_List.pdf` into a verified CSV.

Do not hand-transcribe. Do not eyeball. The whole point of this job is that the output is arithmetically proven, not trusted.

---

## Step 1 — Install poppler

```bash
# macOS
brew install poppler

# Debian/Ubuntu
sudo apt-get install -y poppler-utils
```

Verify: `pdftotext -v`

---

## Step 2 — Extract raw text

```bash
pdftotext -layout Orloff_Amazon_Stock_List.pdf invoice_raw.txt
wc -l invoice_raw.txt
head -120 invoice_raw.txt
```

`-layout` is required. Without it the column structure collapses and the file is useless.

**Read the head output before writing any parser.** The table is multi-line per record: each product spans 4 or more physical lines because Material, Color, Metal, Stone and Size stack vertically inside one logical row. Numeric fields (weight, qty, unit price, total) appear once, vertically centred, which means they land on an arbitrary one of those lines.

Do not assume one line equals one record. That assumption is what corrupts this kind of table.

---

## Step 3 — Build the parser iteratively

Work on the first 3 pages only until the parse is clean, then run the full file.

Target schema:

```
row_no, model_no, material, metal_finish, stone, size, weight_g, qty, unit_price_usd, total_price_usd
```

Anchoring approach that works on this layout:

1. A new record starts where a line begins with an integer 1–554 followed by whitespace and a token matching `^(OR)?[A-Z]{2,5}[0-9]` — the model number.
2. Everything from that line until the next such match is one record block.
3. Within the block, harvest by regex rather than position:
   - weight: `([0-9]+\.?[0-9]*)\s*g\b`
   - qty: `([0-9]+)\s*pcs\b`
   - prices: `(?:US)?\$\s?([0-9,]+\.[0-9]{2})` — first match is unit, second is total
   - size: the line following the literal `Size`
   - material: the line following the literal `Material`
4. Strip thousands separators from prices before casting to float.

Known layout damage to expect: on some rows the word `Color` is split around the numeric block, e.g. `C 2.4g 15pcs US$6.62 US$99.30 olor`. Regex harvesting survives this. Positional slicing does not.

---

## Step 4 — Reconcile. This is the part that matters.

```python
import csv, math

ROWS_EXPECTED   = 554
QTY_EXPECTED    = 7468
TOTAL_EXPECTED  = 55849.61

rows = list(csv.DictReader(open("invoice_extracted.csv")))

failures = []

# 1. Row count
if len(rows) != ROWS_EXPECTED:
    failures.append(f"ROW COUNT: got {len(rows)}, expected {ROWS_EXPECTED}")

# 2. Row numbers present exactly once, 1..554
seen = sorted(int(r["row_no"]) for r in rows)
missing = sorted(set(range(1, ROWS_EXPECTED + 1)) - set(seen))
dupes   = sorted({n for n in seen if seen.count(n) > 1})
if missing: failures.append(f"MISSING ROWS: {missing}")
if dupes:   failures.append(f"DUPLICATE ROWS: {dupes}")

# 3. Per-row arithmetic: unit * qty == total
#    554 independent tests. Any mis-transcribed price or qty breaks its own row.
bad_math = []
for r in rows:
    try:
        unit  = float(r["unit_price_usd"])
        qty   = int(r["qty"])
        total = float(r["total_price_usd"])
    except (ValueError, KeyError):
        bad_math.append((r.get("row_no"), r.get("model_no"), "UNPARSEABLE"))
        continue
    if not math.isclose(unit * qty, total, abs_tol=0.02):
        bad_math.append((r["row_no"], r["model_no"],
                         f"{unit} x {qty} = {round(unit*qty,2)}, stated {total}"))
if bad_math:
    failures.append(f"ROW ARITHMETIC FAILED ({len(bad_math)}):")
    failures += [f"    row {a} {b}: {c}" for a, b, c in bad_math]

# 4. Document totals
qty_sum   = sum(int(r["qty"]) for r in rows)
total_sum = round(sum(float(r["total_price_usd"]) for r in rows), 2)
if qty_sum != QTY_EXPECTED:
    failures.append(f"QTY SUM: got {qty_sum}, invoice states {QTY_EXPECTED}, delta {qty_sum - QTY_EXPECTED}")
if not math.isclose(total_sum, TOTAL_EXPECTED, abs_tol=0.05):
    failures.append(f"VALUE SUM: got {total_sum}, invoice states {TOTAL_EXPECTED}, delta {round(total_sum - TOTAL_EXPECTED, 2)}")

# 5. Model numbers unique (ORCB176 is a known genuine duplicate)
from collections import Counter
mdupes = {m: c for m, c in Counter(r["model_no"] for r in rows).items() if c > 1}
if mdupes:
    failures.append(f"DUPLICATE MODEL NUMBERS: {mdupes}")

print("PASS" if not failures else "FAIL")
for f in failures:
    print(f)
```

### Interpreting results

- **Row arithmetic failures** are the sharpest signal. A single wrong digit in qty, unit price or total breaks that row and nothing else. Investigate each individually against the PDF.
- **Row arithmetic passes but document totals fail** means the error is in a field with no per-row check, or a whole row is missing or duplicated. Check the row-number test first.
- **A handful of 1-cent arithmetic failures** are the factory rounding, not your parse. Tolerance is set to absorb that. Anything larger is real.
- **`ORCB176` appearing twice is expected.** It is a genuine invoice defect, two different products sharing a model number at rows 222 and 491. Any other duplicate is a parse error.

Do not adjust numbers to make totals close. If it fails, report which rows and stop.

---

## Step 5 — Fields with no arithmetic check

`weight_g`, `size`, `material`, `metal_finish`, `stone` cannot be verified this way. They carry no cross-check.

Mark them `unverified` in the output manifest. Spot-check 20 random rows against the PDF by eye and report the hit rate. If it is not 20/20, say so.

`weight_g` matters more than the others: it drives replacement-cost pricing against silver spot, and silver is currently near $59/oz. A weight error becomes a pricing error.

---

## Step 6 — Outputs

- `invoice_extracted.csv` — all 554 rows
- `invoice_reconciliation.txt` — full output of Step 4, pass or fail
- `invoice_appendix_a.csv` — filtered to the 315 in-scope SKUs from Appendix A of `claude-code-charm-line-handoff.md`

Report: rows parsed, reconciliation result, any failing rows, the 20-row spot-check hit rate.

---

## Cross-check against the handoff

Appendix A of the handoff was assembled by hand from the same PDF and has already produced errors. Once this extraction passes reconciliation, **diff the model number list against Appendix A** and report:

- SKUs in Appendix A that do not appear in the extraction
- In-scope SKUs in the extraction missing from Appendix A

`GCB108`, `GCB176` and `GCB178` have image folders but were reported as absent from Appendix A. This diff should settle whether they exist on the invoice at all.

The extraction wins any disagreement. Appendix A is the hand-built copy.
