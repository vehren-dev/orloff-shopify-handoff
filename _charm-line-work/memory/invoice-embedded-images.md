---
name: invoice-embedded-images
description: The Orloff invoice PDF contains 533 product photos; how to extract and map them to rows
metadata: 
  node_type: memory
  type: project
  originSessionId: 93aa9589-172f-4741-98db-305298a3568b
  modified: 2026-07-29T19:43:04.878Z
---

`E:\Orloff Amazon Stock List.pdf` embeds **533 product photographs**, one per invoice row. This is the fallback source of truth for identifying charms that have no HD PICTURE folder.

`pdfimages` is not installed, but every picture is a DCTDecode stream, i.e. a plain JPEG, so they can be carved by scanning for `FFD8FF … FFD9`. Mapping them to rows needs the PDF page structure: inflate each page's content stream, take the `cm` matrix before every `… Do`, and use the y translate.

**Critical gotcha: this document's page CTM flips the y axis** (text matrices carry a negative *d*). Larger y means *further down* the page, so placements must be sorted **ascending** to get row order. Sorting descending yields letters in the order I, H, G, F and looks plausible enough to miss.

Other quirks: one photo often serves several consecutive rows (bracelet sizes share an image, confirmed by Viktor); an image whose row straddles a page break is drawn on both pages, which is harmless when zipping rows to images from the top; and a surplus image at y < 50 is a carry-over that must be dropped. `img_0001` is the Rinntin letterhead logo, not a product.

Verified against three independent ground truths: page 26 reads bracelet/A/B/C, all 26 letters land in order, and all 12 birthstone beads (which have the month engraved) land on the right row.

**Finding worth remembering: the August birthstone charm ORCB33-G is engraved "Augest".** The misspelling is on the physical metal, not in the data. The other eleven months are correct.

Scripts live at `E:\carve.pl`, `E:\pdfmap.pl`, `E:\join_rows.pl`; output at `E:\invoice-images\` and `E:\invoice_row_images.tsv`. See [[invoice-pdf-extraction]] and [[charm-line-image-folder-structure]].
