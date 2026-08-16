# ORLOFF — SESSION STATUS, 2026-07-28

Supersedes orloff-status-2026-07-26.md.

## THEMES

| Theme  | ID            | Role |
|--------|---------------|------|
| WEB 13 | 189476995362  | MAIN (live) |
| WEB 14 | 189485711650  | Unpublished — working copy, branched from WEB 13 |

WEB 12 was published, then WEB 13. Theme publishing and live-theme writes remain
blocked from this session — the user publishes from admin.

NOTE: an earlier WEB 14 (189481845026) was created and deleted. The current WEB 14 is
a different theme; use the ID above.

## SHIPPED TO LIVE (WEB 13 + database)

### Brand gold sweep #b08d57 -> #bc973f — COMPLETE
Zero occurrences remain anywhere. Final tally, after the old status file's map turned
out to be incomplete:
  templates/index.json                    6  (homepage eyebrows + Fine Jewelry block)
  sections/nivoda-diamond-search.liquid   2  (incl. --orloff-gold, drives diamonds page)
  templates/page.solar-grown.json         1  (--gold)
  sections/footer.liquid                  1  (was a DEAD rule, overridden by
                                             footer-group.json's ID-scoped rule)
  collection descriptionHtml              7  (eternity-bands, wedding-bands, fine-jewelry,
                                             earrings, bracelets, necklaces-pendants, rings)
  page solar-grown-diamonds body          2  (SVG strokes)

`E:\Nivoda\nivoda-diamond-search.liquid` was byte-identical to the theme file and was
edited in place as the upload source — so the next Nivoda deploy won't revert the gold.

### Micro eternity band — RESOLVED
All 7 gemstone variants restored in admin by the user. Verified:
  - option `Gemstone`, 7 values, SKUs MICRO-DIA/RUB/BLSAP/LBSAP/YSAP/PISAP/TSA
  - all 2900, all `tracked: false`, all `availableForSale: true`
  - `ORLOFF_VARIANT_MAP` renders all 7 entries
  - mixed-set cart round-trip: 3 lines, 3 DISTINCT variant ids, correct SKUs
  - per-gemstone sales reporting now works. Zero micro orders existed before the
    fix, so no historical data was lost.

The duplicate `Gemstone:` cart label was fixed by deleting `'Gemstone': band.stone,`
from `addToCart()` — the variant now carries the gemstone natively.

Diamond swatch replaced with round_diamond_transparent.svg (uploaded to Files,
2.1 MB — oversized for a 42x42px swatch; other coloured swatches are ~1.2 MB each).

### Filter bars
- `collection.fine-jewelry.json` and `collection.wedding-bands.json` restyled to match
  the engagement-rings bar (navy #091b36 bar, gold #bc973f active/hover).
- Wedding Bands bar KEPT its two-row combination logic (`female+pave` etc.) — it is
  more capable than the engagement bar. Do not "simplify" it.
- Fine Jewelry `Rings` chip renders CONDITIONALLY on the `rings` tag existing.
  Reason: Shopify silently returns ALL products for a nonexistent tag rather than
  empty, so the chip would lie. It self-enables once products are tagged.
- Removed the duplicate `.orloff-catnav` from all Fine Jewelry-family collection
  descriptions. It appeared because `custom_liquid_fjtagbanner` swaps in the
  *other* collection's description when a tag is active.
- Homepage Fine Jewelry cards now point at `/collections/fine-jewelry/<tag>`.

Tag URL status: earrings(6) bracelets(1) necklaces+pendants(1) all correct.
`rings` and `necklaces` tags DO NOT EXIST yet — user will add them later.

## IN WEB 14, NOT PUBLISHED

`assets/app.min.js` — scroll animation stagger rewritten.
  Was: delay by element TYPE (image 0 / .rte 0.45 / else 0.15), so headings and
  buttons fired simultaneously and text arrived last.
  Now: `assignOrder()` assigns delay by DOM order within each `.shopify-section`,
  resetting only on `.image-side-holder` so each image row restarts its cascade.
  Verified in a real browser: every homepage hero is h1=0.00 -> text=0.15 -> btn=0.30;
  About page rows are image=0.00 -> heading=0.15 -> caption=0.30.
  17,499 -> 18,195 bytes. File is NOT actually minified despite the name.

## OUTSTANDING

### Audit backlog — still untouched since July 22/23
  snippets/facets.liquid            closes with `</facets-filters-form>` (stray 's');
                                    mismatched open/close on collection pages
  snippets/product-add-to-cart.liquid  `{{ 'products.product.pickup_availability.unavailable' }}`
                                    missing `| t`, renders the raw key
  snippets/mobile-menu.liquid       hardcoded `action="/search"` (1 occurrence in this
                                    file; a 2nd on the page comes from elsewhere)
  snippets/responsive-image.liquid  `alt="{{ image.alt | escape }}"` unguarded.
                                    LOW PRIORITY — swept product media and Files and
                                    found no `#metal_` codes actually leaking. The
                                    July 23 note may describe a condition that no
                                    longer exists.

### Homepage
User rejected a proposed reorder + featured-products row and reverted.
**Homepage layout is to be left as is** unless they raise it again.

Known issues if it ever comes up: 4x `<h1>`; zero product links/prices on the page;
About Us hero has `overlay_opacity: 0` (white text on unmasked photo); the trust
marquee has 4 blocks of which 2 are disabled and the other 2 are the same GIA image,
so it scrolls "GIA GIA"; no reviews/testimonials anywhere.

### Content
- Solar-grown page specs table reads "International Gemological **Institure** (IGI)" —
  typo, live page content, not yet fixed.
- `orloff.combo_data` metafield still references the DELETED pre-restore variant ids
  and price 2200. Confirmed dead code, but now doubly stale.

## DO NOT TOUCH
`orloff.stone_images` (product photos, not swatches), `orloff.metal_images`.

## TECHNIQUES
See memory files under
`C:\Users\Niels.v\.claude\projects\C--Users-Niels-v--claude\memory\` —
theme-file editing (md5-verify -> staged upload -> ETag check) and the
size-metadata trap are documented there.
