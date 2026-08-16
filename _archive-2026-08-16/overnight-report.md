# Overnight run, 30 Jul 2026

Your four answers are applied: v2 descriptions, shortened quote names, no ORL
prefix, taxonomy confirmed. Photoless charms are a separate sheet.

## The big unlock: the invoice has pictures

I extracted **533 embedded product photographs** from the PDF and mapped each one
to its invoice row. `pdfimages` is not installed, but every picture is a plain
JPEG inside the file, so I carved them directly and read the PDF page structure
to work out which image sits beside which row.

That took one wrong turn worth recording. This document's pages flip the y axis,
so the image highest on the page has the *largest* y, not the smallest. My first
mapping was upside down and produced letters in the order I, H, G, F. Sorting the
other way fixed it.

**Validated on three independent groups before I trusted it:**

- page 26 reads bracelet, A, B, C for rows 229 to 232
- the twelve birthstone beads have the month engraved on them, and all twelve
  land on the right row
- the letters A to Z land in order

Images are on E: in `invoice-images\`, with `invoice_row_images.tsv` giving the
row to image map for all 554 rows.

## A product defect you will want to see

**The August birthstone charm is engraved "Augest".** Not a data error, the
misspelling is on the metal. I checked all twelve months; the other eleven are
correct. 20 pieces in stock. Flagged in the spreadsheet against ORCB33-G.

## What is in the spreadsheet now

`orloff-charm-line-a-master.xlsx`, two sheets, 316 rows, 24 columns.

| Sheet | Rows | Named | Held |
|---|---|---|---|
| A, has photography | 99 | 64 | 35 |
| B, no photography | 217 | 51 | 166 |

**115 SKUs now have names and full descriptions**, up from 96 this morning. The
51 named in sheet B are the letters, zodiac and birthstones, which are nameable
from data alone and only lack pictures.

No duplicate handles, no duplicate SKUs, no em dashes in any description.

## What I identified from the invoice photographs

The dangle charms turn out to be **Orloff's own designs**, not factory stock. The
bail is engraved ORLOFF on every one. The line is Danish and Thai icons together:

Danish: the Dannebrog in pave and in red enamel, a Royal Guard in his red tunic
and bearskin, the Little Mermaid on her rock, a heraldic coat of arms.
Thai and regional: a durian, a lotus, a temple flag roundel.
Plus a whale tail, a tassel, an acorn, a flamingo, a daisy, and four Chinese
character tags reading fortune, longevity, luck and love.

Full list with confidence levels in `dangle-identifications.tsv`.

## What I deliberately did NOT name

**29 SKUs are religious or national iconography and I have left them unnamed.**

Buddha heads, seated crowned figures, a Garuda, a temple lion, a figure riding an
elephant, a shrine. Your handoff says careless naming here is a reputational risk
in your home market, and I agree. I can describe the form but I cannot reliably
tell you which specific figure each one depicts, and guessing is the one thing
that would actually cause the harm.

They sit in sheet A with a HOLD note. They need someone who knows the iconography,
not someone who knows jewellery.

Three more are held for ordinary reasons: `ORGCB18` reads as Angkor Wat on the
Cambodian flag, which would be an odd thing to mislabel; `ORGCB27` is a coat of
arms I cannot attribute; and `ORGCB22` is the Garuda, which is the Thai state
emblem and may not be usable commercially at all.

## Still to do

- 8 dangle designs not yet viewed: ORGCB54-L, ORGCB58-LVR, ORGCB110, ORGCB175,
  ORGCB177, ORGCB181, ORGCB185-14K, and the four ORGCB51 daisy colours. I held
  the daisies rather than ship four products called "Daisy Charm", which would
  have collided on handle.
- The 166 unnamed charms in sheet B. Every one has an invoice photograph now, so
  this is a matter of working through them, not a blocker.
- Pricing, and the ORCB176 collision, both still yours.

## Files on E:

```
orloff-charm-line-a-master.xlsx     two sheets, the deliverable
orloff-charm-line-a-ready.csv       sheet A
orloff-charm-line-a-no-photo.csv    sheet B
dangle-identifications.tsv          what I identified, with confidence
invoice-images\                     533 photographs from the invoice
invoice_row_images.tsv              row to image map, all 554 rows
image_sku_map.csv                   HD PICTURE folder to SKU
image_rename_plan.csv               per-file upload plan
```

Nothing uploaded, nothing renamed, nothing published.
