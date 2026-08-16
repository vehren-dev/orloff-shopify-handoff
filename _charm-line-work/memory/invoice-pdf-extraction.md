---
name: invoice-pdf-extraction
description: "How to extract the Orloff factory invoice PDF correctly, and the verified reconciliation result"
metadata: 
  node_type: memory
  type: project
  originSessionId: 93aa9589-172f-4741-98db-305298a3568b
  modified: 2026-07-29T16:14:33.194Z
---

For `E:\Orloff Amazon Stock List.pdf` (554-row Zhuhai Rinntin invoice), use **`pdftotext -table`**, never `-layout`.

**Why:** under `-layout` the row-number/model column, the weight+qty column and the price column are three *independent* vertical sequences that only share physical lines by accident. Row-block anchoring on `-layout` output misassigns prices by one row across much of the document, and on some pages (e.g. 37) weight/qty and unit/total sit on different lines from each other too. `-table` emits one clean stanza per record with everything on a single line. Anchor on `Material` labels: there are exactly 554, one per row.

Model numbers are sometimes split across two lines (rows 460, 464, 513–521, 523–524, 531, 532). Reassemble by concatenating the left-column region of every line in the stanza — row 532 prints `OR` on one line and `532  GCB182-2` on the next.

`pdftotext` is already installed via Git for Windows (Xpdf 4.06); poppler is not needed. `pdftoppm` is absent, so the PDF cannot be rasterised for visual checking. Python is not installed (the `python.exe` on PATH is the Microsoft Store stub) — Perl via Git Bash works.

**Verified result (29 Jul 2026):** 554/554 rows, qty sum 7468 and value sum $55,849.61 both exact. Two per-row arithmetic failures are genuine invoice defects, not parse errors: row 247 ORCB183-R (4.44×9=39.96, states 40.00) and row 252 ORCB183-W (4.22×10=42.20, states 42.22), overstating the total by $0.06. Duplicate model numbers: ORCB176 (rows 222/491, known) and **ORSE103 (rows 12/268, newly found)**.

Appendix A of `E:\claude-code-charm-line-handoff.md` was confirmed **exactly correct** — 315 unique SKUs across 316 invoice rows, zero discrepancies either way. GCB108/GCB176/GCB178 are absent from all 554 rows, so they were photographed but never ordered; see [[charm-line-image-folder-structure]]. Outputs and the parser live at `E:\invoice_extracted.csv`, `invoice_appendix_a.csv`, `invoice_reconciliation.txt`, `parse.pl`, `reconcile.pl`.
