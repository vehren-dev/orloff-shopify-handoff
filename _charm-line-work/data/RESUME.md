# Orloff Charm Line, resume point

Last worked 31 Jul 2026. Everything needed to continue is on this drive.

---

## THE ONE THING TO DO NEXT

**Drag `E:\shopify-upload-v2\` (376 files) into Shopify admin, Settings > Files.**

Then say "the v2 images are uploaded" and the Shopify CSV is finished. Nothing
else is blocking.

### Why a second upload

The first upload of 485 files is live and correct for the 213 invoice-sourced
products. But for the 99 SKUs that came from `HD PICTURE`, the lead image was
chosen by which file was unique to that folder, which took no account of what
the picture actually showed. **86 of those 99 led with an INFORMATION spec sheet
or a model shot instead of the product.**

They have been re-picked as plain white-background product shots, preferring
square crops, and renamed `-a` `-b` `-c` `-d` so they cannot collide with the
files already uploaded. The old files are untouched; delete them later if you
want a tidy Files list, or leave them.

`shopify-charm-line-a.csv` already points at the new `-a` names, so it is
correct the moment those files land.

---

## State of play

| Piece | Status |
|---|---|
| Invoice extraction | Done, reconciled exactly. 554 rows, 7,468 pcs, $55,849.61 |
| Naming | 287 of 316 SKUs named, categorised, described |
| Pricing | Done. Shopify USD 29/39/49/89, StoreHub THB 900/1200/1600/2800 |
| Shopify CSV | Built, 456 rows, 272 products, images wired. **Waiting on v2 upload** |
| StoreHub CSV | **Ready to import today.** No dependencies |
| Collections | 11 created live, rule-based, with SEO |
| TikTok | Blocked, needs category ID + seller verification |

---

## Files on this drive

**Ready to use**
- `shopify-charm-line-a.csv` — import after the v2 upload
- `storehub-charm-line-a.csv` — importable now
- `orloff-charm-line-a-master.xlsx` — two sheets, the source of truth
- `shopify-upload-v2\` — 376 corrected images, needs uploading
- `shopify-upload\` — the original 485, already uploaded
- `invoice-images\` — 533 photos carved out of the invoice PDF
- `invoice-images-clean\` — 50 with the red 925 stamp painted out

**Reference**
- `decisions-needed.md` — everything still awaiting a call from you
- `shopify-collections.md` — the 11 collections and suggested menu
- `image-sku-map.md` — how HD PICTURE maps to SKUs, and its traps
- `charm-identifications.tsv`, `dangle-identifications.tsv` — every ID with confidence
- `invoice_reconciliation.txt` — the arithmetic proof
- `storehub-template.csv` — Viktor's blank template

**`_charm-line-work\`** — scripts, intermediates and a copy of the assistant's
memory notes. Copied here because they normally live in Windows Temp and in the
user profile, neither of which travels with the drive.

---

## Rebuilding from scratch

From `_charm-line-work\scripts`, in order:

    carve.pl        pull 533 JPEGs out of the invoice PDF
    pdfmap.pl       map images to PDF page placements
    join_rows.pl    join placements to invoice rows
    parse.pl        parse the invoice (pdftotext -table, never -layout)
    reconcile.pl    prove the arithmetic
    map_images.pl   map HD PICTURE folders to SKUs
    build_master.pl build the master spreadsheet
    build_exports.pl generate the Shopify and StoreHub CSVs

Needs Perl (Git Bash has it) and `pdftotext` (Git for Windows ships it).
Python is not installed and is not required.

---

## Traps that cost time, do not rediscover

- **`pdftotext -layout` corrupts this invoice.** Row numbers, weights and prices
  are three independent columns that only share lines by accident. Use `-table`.
- **The PDF page y-axis is flipped.** Larger y is further down. Sorting the
  obvious way silently gives letters in the order I, H, G, F.
- **HD PICTURE folder names lie.** `GCB49` contains `PA0107`. The file wins.
- **Shopify CDN URLs work without the `?v=` cache-buster**, so they can be
  built rather than paginated out of the Files API.
- **PowerShell variables are case-insensitive**, so `$repl` silently clobbers
  `$REPL`. Cost one round of nonsense pricing.
- **A naive CSV splitter eats escaped quotes**, turning `style="..."` into
  `style=...` and shipping broken HTML to 287 products.

---

## Still needs Viktor

Full detail in `decisions-needed.md`. The ones that matter:

1. **26 religious and national pieces, unnamed.** Buddha heads, a Garuda, a
   temple lion. Needs someone who knows the iconography. ORGCB22, the Garuda,
   is the Thai state emblem and may not be commercially usable at all.
2. **ORCB33-G is engraved "Augest".** Misspelled on the metal, 20 pieces.
3. **ORCB180 and ORCB182** are close to the Superman shield and the Rubik's
   Cube. Named neutrally, but take advice.
4. **ORCB176** is one product, not two. Rows 222 and 491 are the same tree of
   life bead. Recommend merging to 50 pcs at a blended $7.32. SKU is blank on
   both rows until decided.
5. **ORGCB175** is very likely Hans Christian Andersen. Confirm before naming.
6. **TikTok** category ID and seller verification status.

---

## Loose end worth picking up

The ORGCBB1 bracelet clasps carry **enamel motifs, not plain beads**. The blue
one is a peace symbol engraved ORLOFF OF DENMARK. The descriptions currently
say "enamel bead at the clasp", which undersells them. Worth checking each
colour and rewriting those 14 descriptions.
