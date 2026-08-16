# Claude Code Handoff — Orloff Charm Line A Product Build

## Context

Orloff of Denmark (orloffofdenmark.com) is launching a 925 sterling silver charm and bracelet line. Stock has arrived from Zhuhai Rinntin Jewelry: 7,468 pieces across 554 SKUs on the factory invoice.

We are building the **full charm and bracelet line** in this job.

**Both ORCB and ORGCB charms thread onto the chain.** Confirmed by Viktor from the physical product. ORGCB pieces are dangle charms with a threaded bead core and a pendant hanging beneath, which is the same format Pandora uses for its dangles. They are not clip-ons and they are not a separate system.

There is therefore **one line, not two.** The ORCB / ORGCB distinction is a silhouette difference (bead versus dangle) and nothing more. It may be worth a browsing filter. It is not a compatibility boundary and must not be modelled as one.

Both ORCBB01 and ORGCBB1 are snake chain bases. Every charm in this job fits every bracelet in this job.

Architecture decision already made and not up for revision: **bracelets and charms are fully independent Shopify products.** No configurator, no bundled single-variant product, no JS price picker. A customer buys a bracelet as its own product and each charm as its own product. Charm-adding happens later as a cart-drawer merchandising layer, which is a separate job.

---

## Store facts

- Store ID `961f52-3`
- Theme: North 10.0.0
- CDN base: `https://cdn.shopify.com/s/files/1/0852/4428/1122/files/`
- **Live theme: WEB 13** (`gid://shopify/OnlineStoreTheme/189476995362`), verified 29 Jul 2026.
- **Newest draft: WEB 14** (`gid://shopify/OnlineStoreTheme/189485711650`).
- **Always verify theme roles via `themes(first:20)` before any theme write.** Viktor creates a new WEB version every day or two. Any theme ID written down in a handoff file is stale within roughly 48 hours. Do not trust the two above without re-querying.
- This job should not need theme file writes at all. If you think it does, stop and ask.

## Known Shopify API behaviours (learned the hard way, do not rediscover)

- `productVariantsBulkUpdate`: SKU must be nested under `inventoryItem`, i.e. `{"inventoryItem": {"sku": "NEW-SKU"}}`. Passing `sku` at top level fails silently.
- `files(filenames: [...])` accepts an exact filename array. More reliable than pattern filtering.
- `nodes(ids: [...])` with inline fragment `... on Product { status }` is the most efficient batch status check.
- `bulk-update-product-status` accepts GID string arrays, up to 50 products per call.
- Shopify CSV import uses the **57-column OLD format**: one product row followed by image-only rows. Multiple variant rows on a single-variant product triggers "Default Title already exists". Every charm here is single-variant, so this matters.
- `themeFilesUpsert` is blocked on MAIN themes. Write to an unpublished draft, verify, then hand to Viktor to publish manually.

---

## Source data

Viktor will attach both directly:

1. **`Orloff_Amazon_Stock_List.pdf`** — the full factory invoice, 554 rows. Columns: row number, Model No., picture, material, colour/metal/stone, size, weight, quantity, unit price, total price. The leftmost number is the invoice row position, not a stock number. Ignore it except as a locator.
2. **The HD product image folder.**

### Precedence

- **Appendix A governs scope.** It is the definitive list of which SKUs are in this job. Do not add a SKU to the build because it looked like a charm in the PDF. If something appears to be missing from Appendix A, stop and ask.
- **The PDF governs per-SKU detail.** Read weight, size, material, finish, stone, cost and quantity from the invoice directly. Do not retype from Appendix A, which carries only enough detail to identify each piece.
- Where the two disagree, the PDF wins on detail and Appendix A wins on scope. Report any disagreement rather than resolving it silently.

### Membership by invoice row

| Group | Model prefix | Invoice rows | Count |
|---|---|---|---|
| Bead charms | ORCB | 85–226, 483–505, 551 | 166 |
| Dangle charms | ORGCB | 390–423, 443–454, 525–550 | 72 |
| Letters | ORCB183-A … Z | 230–255 | 26 |
| Zodiac | ORCB32-* | 455–466 | 12 |
| Birthstone | ORCB33-* | 467–478 | 12 |
| Spacers & clips | ORPA* | 432–442 | 11 |
| Bracelet bases, plain | ORCBB01-17/19/21 | 227–229 | 3 |
| Bracelet bases, enamel accent | ORGCBB1-* | 508–521 | 14 |

**Total: 316 SKUs (299 charms, 17 bracelet bases). The complete list is in Appendix A. Work from Appendix A, not from this summary table.**

Note: ORSB61, ORSB62 and ORSB92–95 are **not** charm bases. They are CZ tennis bracelets with clasps and cannot accept threaded beads. Excluded.

**Excluded from this job:** all ORSE/ORSN/ORSWE/ORSWN/OREQE/ORAPE/ORHAPE/ORGPE/ORGPN/ORGPB (earrings, necklaces, pearl line), ORSMN/ORSMR/ORSWE13 (moissanite), ORGSB/ORGSN (999 silver bangles, ceramic necklaces), ORSB* (CZ tennis bracelets, cannot take threaded beads).

**ORGCB and ORGCBB1 are IN scope.** An earlier draft of this file excluded them. That was an error left over from a superseded two-line model. Appendix A is authoritative.

### Known data anomalies to handle, not silently fix

- Row 526 is listed as `GCB56-R`, missing the `OR` prefix. Sibling of row 525 `ORGCB56-L`. Line B, so out of scope here, but note it if you touch it later.
- Model number `ORCB176` appears twice: row 222 (30pcs, $7.22) and row 491 (20pcs, $7.48). Two different products sharing a model number. **Flag this, do not merge, do not guess.** Needs a decision from Viktor before either gets a SKU.
- Several rows have blank Size fields (most of the ORCB183 letter series). Use the ORCB183-A size of 10.5mm as the series default only if Viktor confirms.

---

## PHASE 1 — Inventory and report. STOP at the end of this phase.

Do not upload anything, do not create products, do not write exports.

**Files are named by model number**, confirmed by Viktor, e.g. `ORCB183-A.jpg`. Mapping to Appendix A is therefore an identity match. Do not attempt visual identification of subjects at this stage.

1. Read the image folder. Produce a count and a list of filenames.
2. Verify the naming convention holds across the whole folder. Report any file that does not parse as a known model number.
3. Report image dimensions and format. Shopify wants at least 2048px on the long edge for zoom. Flag anything under 1200px.
4. Cross-reference against Appendix A. The folder will almost certainly contain the full 554-SKU catalogue, not just Line A. **Filter to Appendix A before anything else.** Report:
   - Model numbers with no matching image
   - Images with no matching model number
   - Model numbers with multiple images (these become the image-only CSV rows)
5. Write findings to `charm-line-inventory-report.md`.

**Then stop and report to Viktor.** Phases 2 onward depend on what Phase 1 finds.

---

## PHASE 2 — Image upload

Only after Viktor confirms Phase 1.

1. Rename images to `{MODEL-NUMBER}.jpg` for the primary and `{MODEL-NUMBER}-2.jpg`, `-3.jpg` for additional angles.
2. Upload to Shopify Files via the Admin API in batches. Do not attempt all 250+ in one call.
3. Capture the returned CDN URL for every file. Verify each resolves under `https://cdn.shopify.com/s/files/1/0852/4428/1122/files/`.
4. Write the model-number-to-URL map into the master spreadsheet (Phase 3). If any upload fails, log it and continue, then report failures as a list at the end.

---

## PHASE 3 — Master spreadsheet

This is the single source of truth. Every platform export generates from this file. Never hand-edit a platform export.

Filename: `orloff-charm-line-a-master.xlsx`

### Columns

| Column | Notes |
|---|---|
| `model_no` | From invoice. Primary key. |
| `sku` | `ORL-` + model_no, uppercase, hyphenated |
| `handle` | Shopify handle, lowercase, hyphenated, derived from product_name |
| `product_name` | Generated. See naming rules below. |
| `line` | Always `A` in this job |
| `type` | `Charm` or `Bracelet` |
| `category` | One value only. See taxonomy below. |
| `price_tier` | `Classic`, `Signature`, or `Statement`. Bracelets use `Base`. |
| `retail_thb` | From the pricing table Viktor supplies. Do not invent. |
| `cost_usd` | Invoice unit price |
| `weight_g` | Invoice weight |
| `size_mm` | Invoice size |
| `material` | Invoice material |
| `metal_finish` | Invoice metal, e.g. Oxidized Silver, Rhodium Plated, Rose Gold Plated |
| `stone` | Invoice stone, blank if none |
| `stock_qty` | Invoice quantity |
| `description_html` | Generated. See description rules below. |
| `image_url_1` … `image_url_n` | CDN URLs from Phase 2 |
| `seo_title` | |
| `seo_description` | |

### Taxonomy — CONFIRM WITH VIKTOR BEFORE TAGGING

Viktor's most recent instruction reads as: **Animals, Nature, Personal (which will split into several).** This reverses an earlier decision to merge Animals into Nature. Working assumption below. **Do not tag 250 SKUs until Viktor confirms this list.**

- `Animals` — elephants, rabbits, dogs, cats, horses, unicorns, pandas, flamingos, giraffes, turtles, cows, owls
- `Nature` — flowers, trees of life, palm trees, clovers, planets, celestial, weather
- `Personal — Letters` — ORCB183-A through Z
- `Personal — Zodiac` — ORCB32 series
- `Personal — Birthstone` — ORCB33 series
- `Milestones & Sentiment` — birthday, love, family, graduation, Mom, wedding
- `Travel & Lifestyle` — suitcases, cameras, coffee, cocktails, casino, music, sport
- `Sparkle & Classic` — non-figural pavé beads, plain hearts, plain stars
- `Spacers & Clips` — ORPA series

Rule: **exactly one primary category per SKU**, decided by dominant visual subject. Where a piece could sit in two, pick the one a customer would browse for. A flower-shaped heart is Nature if the flower dominates, Milestones if the heart does.

### Pricing — PARAMETER, SUPPLIED BY VIKTOR

Do not calculate retail prices. Do not use invoice cost × a multiple. Viktor supplies a tier table. Proposed structure pending his confirmation:

| Tier | Applies to | Price |
|---|---|---|
| Classic | letters, birthstone, spacers, plain beads | TBC |
| Signature | figural bulk | TBC |
| Statement | large dangles, pavé, shell pearl, multi-stone | TBC |
| Base 17cm | ORCBB01-17 | TBC |
| Base 19cm | ORCBB01-19 | TBC |
| Base 21cm | ORCBB01-21 | TBC |

Note for context, not for use in calculation: silver has risen substantially since this invoice was quoted, so invoice cost understates replacement cost by roughly 30 to 50 percent depending on weight. Pricing must be set off replacement cost, which is why Viktor supplies it rather than you deriving it.

---

## Naming rules

Format: `{Descriptive Name} Charm` or for bases `{Descriptive Name} Bracelet`.

- Plain English, no invented collection names, no marketing adjectives stacked up
- Describe what the object actually is: `Elephant Charm`, `Carousel Charm`, `Four Leaf Clover Charm`
- Where finish differentiates two otherwise identical SKUs, append it: `Daisy Charm, Rose Gold`
- Letters: `Letter A Charm` through `Letter Z Charm`
- Zodiac: `Aries Zodiac Charm`, etc. Full sign name, not the abbreviation from the invoice
- Birthstone: `January Birthstone Charm, Garnet` through `December Birthstone Charm, Turquoise`
- Spacers: `{Description} Spacer` e.g. `Polished Dome Spacer`
- Bases: `Snake Chain Bracelet, 17cm`
- Title case. No ALL CAPS in product names.

## Description rules

House style, applied consistently across all 250. Deviating is worse than being plain.

- Prose with selective bold on key specifications
- **No em dashes anywhere.** Use commas, full stops, or restructure the sentence.
- Tone: human, professional, grounded. Not editorial, not breathless, not obviously AI-written.
- Wrap in `<p style="font-family: Inter, sans-serif;">`
- Technical details use bold-label format with `<strong>`
- Close with `ORLOFF OF DENMARK.` on its own bold line
- Platinum, where it appears anywhere in the catalogue, is always written `950 Platinum`
- Two to three sentences of description, then the spec block. Do not pad.

Structure:

```html
<p style="font-family: Inter, sans-serif;">[Two or three sentences describing the piece, what it depicts, how it is finished, and what it might mean to someone wearing it. Grounded, not florid.]</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> [metal_finish]<br>
<strong>Stone:</strong> [stone, omit line entirely if none]<br>
<strong>Size:</strong> [size_mm]<br>
<strong>Weight:</strong> [weight_g]</p>

<p style="font-family: Inter, sans-serif;"><strong>Fits all Orloff snake chain bracelets.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

**Generate five samples across different categories and show Viktor before writing all 250.** Voice drift across a large batch is the main failure mode here.

---

## PHASE 4 — Platform exports

Generate all three from the master spreadsheet. Never author them independently.

### Shopify

Use the CSV import path, not the API, for the initial bulk load.

- 57-column OLD format
- One product row per SKU, then image-only rows for additional images
- **Single variant per product.** Do not emit multiple variant rows. That triggers "Default Title already exists".
- `Variant Inventory Tracker`: `shopify`. **Inventory tracking ON for the entire charm line.** These are finite purchased stock with real counts from the invoice, not made-to-order. This differs from the rings, where tracking is off.
- `Variant Inventory Qty`: from `stock_qty`
- `Variant Inventory Policy`: `deny`
- `Status`: `draft`. Everything imports as draft. Viktor publishes after review.
- `Product Category` and `Type`: `Jewelry > Charms` / `Charm`
- Tags: category value plus `Line A`, `Charm Bracelet`, `925 Silver`

Output: `shopify-charm-line-a.csv`

### StoreHub

**Do not invent the schema.** Ask Viktor to export a blank product template from his StoreHub account first, then map the master spreadsheet onto its actual columns. If the template is not available, stop and say so rather than guessing at column names.

Output: `storehub-charm-line-a.csv`

### TikTok Shop

**Do not invent the schema.** TikTok uses category-specific templates with numeric category IDs, and images must be uploaded to TikTok rather than referenced by URL. Two things to confirm with Viktor before building:

1. The correct TikTok category ID for sterling silver charms in the Thailand marketplace
2. Whether his seller account has passed the additional verification that precious metals and jewelry listings require in TH

Ask for the official template download, then map onto it.

Output: `tiktok-charm-line-a.csv`

---

## Rules of engagement

- Stop at every phase gate. Do not run ahead.
- Flag anomalies with exact detail: model number, invoice row, and what specifically is wrong. Do not silently correct.
- If a decision is missing, ask. Do not fill the gap with a plausible default.
- Everything imports as **draft status**. Nothing goes live from this job.
- Report at the end with: counts written, failures, unresolved decisions.

---

# APPENDIX A — Canonical Line A SKU list

**SKU is the full model number including the `OR` prefix.** That is what goes into Shopify.

**Image filenames may omit the `OR` prefix.** Confirmed by Viktor: the dangle charm files appear as `GCB…` rather than `ORGCB…`. Assume the folder is mixed and that either form may appear.

### Matching rule

Normalise both sides before comparing:

```
normalise(s):
  strip file extension
  uppercase
  remove spaces and underscores
  strip a leading "OR" if present
```

So `GCB56-R.jpg`, `ORGCB56-R.jpg` and `orgcb56-r.JPG` all normalise to `GCB56-R` and map to SKU `ORGCB56-R`.

Stripping `OR` creates no collisions across this catalogue. The remaining stems are `CB`, `GCB`, `CBB`, `GCBB`, `PA`, all distinct.

**Write the SKU in canonical `OR…` form regardless of what the file is called.** Never let the filename dictate the SKU.

Additional angles: whatever the primary is called, plus `-2`, `-3`.

**230 SKUs total: 227 charms, 3 bracelet bases.**

## A1. Bracelet bases (3)

| SKU | Invoice row | Size | Cost USD | Stock |
|---|---|---|---|---|
| ORCBB01-17 | 227 | 17cm | 22.15 | 44 |
| ORCBB01-19 | 228 | 19cm | 23.95 | 44 |
| ORCBB01-21 | 229 | 21cm | 26.85 | 46 |

## A2. Figural and decorative charms, rows 85–226 (142)

ORCB01, ORCB02, ORCB03, ORCB04, ORCB05, ORCB06, ORCB07, ORCB08, ORCB09, ORCB10,
ORCB11, ORCB12, ORCB13, ORCB14, ORCB15, ORCB16, ORCB17, ORCB18, ORCB20, ORCB21,
ORCB22, ORCB23, ORCB25, ORCB26, ORCB27, ORCB28, ORCB29, ORCB30, ORCB34, ORCB35,
ORCB36, ORCB37, ORCB38, ORCB39, ORCB40, ORCB41, ORCB42, ORCB43, ORCB44, ORCB45,
ORCB46, ORCB47, ORCB48, ORCB49, ORCB50, ORCB51, ORCB52, ORCB53, ORCB54, ORCB55,
ORCB56, ORCB58, ORCB59, ORCB60, ORCB61, ORCB62, ORCB63, ORCB64, ORCB65, ORCB66,
ORCB67, ORCB70, ORCB71, ORCB73, ORCB74, ORCB76, ORCB77, ORCB78, ORCB79, ORCB80,
ORCB81, ORCB82, ORCB83, ORCB84, ORCB85, ORCB86, ORCB88, ORCB89, ORCB100, ORCB101,
ORCB102, ORCB103, ORCB104, ORCB106, ORCB107, ORCB108, ORCB110, ORCB111, ORCB113, ORCB114,
ORCB115, ORCB116, ORCB117, ORCB118, ORCB119, ORCB120, ORCB122, ORCB123, ORCB124, ORCB125,
ORCB126, ORCB127, ORCB128, ORCB129, ORCB135, ORCB136, ORCB137, ORCB138, ORCB139, ORCB140,
ORCB142, ORCB144, ORCB146, ORCB149, ORCB150, ORCB151, ORCB152, ORCB153, ORCB154, ORCB155,
ORCB156, ORCB157, ORCB159, ORCB160, ORCB161, ORCB162, ORCB163, ORCB164, ORCB165, ORCB166,
ORCB168, ORCB169, ORCB170, ORCB171, ORCB173, ORCB174, ORCB175, ORCB176, ORCB177, ORCB179,
ORCB180, ORCB182

Note the gaps in the sequence. ORCB19, 24, 31, 33, 57, 68, 69, 72, 75, 87, 90–99, 105, 109, 112, 121, 130–134, 141, 143, 147, 148, 158, 167, 172, 178, 181, 183–198 were not ordered. Absence is expected, not an error.

## A3. Figural and decorative charms, rows 483–505 and 551 (24)

ORCB199, ORCB200, ORCB201, ORCB202, ORCB203, ORCB204, ORCB205, ORCB206, ORCB176, ORCB208,
ORCB209, ORCB210, ORCB211, ORCB212, ORCB213, ORCB214, ORCB215, ORCB216, ORCB217, ORCB218,
ORCB219, ORCB220, ORCB221, ORCB145

**ORCB176 appears twice: row 222 and row 491.** Two physically different products sharing one model number, at different costs ($7.22 vs $7.48) and quantities (30 vs 20). Ivy's image folder can only hold one file called `ORCB176.jpg`. **This will break the import. Resolve before Phase 2.** Suggested resolution: `ORCB176-A` (row 222) and `ORCB176-B` (row 491), but Viktor decides.

## A4. Letters, rows 230–255 (26)

ORCB183-A, ORCB183-B, ORCB183-C, ORCB183-D, ORCB183-E, ORCB183-F, ORCB183-G, ORCB183-H,
ORCB183-I, ORCB183-J, ORCB183-K, ORCB183-L, ORCB183-M, ORCB183-N, ORCB183-O, ORCB183-P,
ORCB183-Q, ORCB183-R, ORCB183-S, ORCB183-T, ORCB183-U, ORCB183-V, ORCB183-W, ORCB183-X,
ORCB183-Y, ORCB183-Z

Product name: `Letter {X} Charm`. Category: `Personal — Letters`. Size field is blank on all except ORCB183-A (10.5mm); confirm with Viktor before applying the series default.

## A5. Zodiac, rows 455–466 (12)

| SKU | Sign | Cost USD | Stock |
|---|---|---|---|
| ORCB32-Ari | Aries | 4.26 | 15 |
| ORCB32-Tau | Taurus | 4.42 | 16 |
| ORCB32-Gem | Gemini | 4.31 | 16 |
| ORCB32-Cnc | Cancer | 4.26 | 16 |
| ORCB32-Leo | Leo | 4.31 | 16 |
| ORCB32-Vir | Virgo | 4.31 | 16 |
| ORCB32-Lib | Libra | 4.35 | 15 |
| ORCB32-Sco | Scorpio | 4.31 | 11 |
| ORCB32-Sgr | Sagittarius | 4.31 | 16 |
| ORCB32-Cap | Capricorn | 4.42 | 13 |
| ORCB32-Agr | Aquarius | 4.47 | 13 |
| ORCB32-Psc | Pisces | 4.17 | 15 |

All 2.54g, 11mm, oxidized silver with blue enamel. Product name: `{Sign} Zodiac Charm`. Category: `Personal — Zodiac`.

`ORCB32-Agr` is the invoice's spelling for Aquarius. Standard abbreviation would be `Aqr`. **Keep the invoice spelling as the SKU** so it matches the image filename, but the product name is Aquarius.

## A6. Birthstone, rows 467–478 (12)

| SKU | Month | Stone | Cost USD | Stock |
|---|---|---|---|---|
| ORCB33-R | January | Garnet | 3.50 | 20 |
| ORCB33-P | February | Amethyst | 3.50 | 20 |
| ORCB33-Q | March | Aquamarine | 3.50 | 20 |
| ORCB33-W | April | White | 3.50 | 20 |
| ORCB33-LV | May | Emerald | 3.50 | 20 |
| ORCB33-PL | June | Alexandrite | 3.50 | 20 |
| ORCB33-M | July | Ruby | 3.50 | 19 |
| ORCB33-G | August | Peridot | 3.50 | 20 |
| ORCB33-BL | September | Sapphire | 3.50 | 20 |
| ORCB33-F | October | Tourmaline | 3.50 | 20 |
| ORCB33-X | November | Yellow Topaz | 3.50 | 20 |
| ORCB33-L | December | Turquoise | 3.50 | 20 |

All 1.56g, 11mm, oxidized silver, 3mm stone. Product name: `{Month} Birthstone Charm, {Stone}`. Category: `Personal — Birthstone`.

The invoice misspells several stones (Garent, Amethyest, Emerlad, Alexendirte). **Use the corrected spellings in the table above for product names.** Keep the SKU letter codes as-is to match image filenames. Note the invoice stone codes do not follow an obvious logic (R for garnet, W for April white, X for topaz); do not attempt to derive them, use this table.

## A7. Spacers and clips, rows 432–442 (11)

| SKU | Invoice row | Size | Cost USD | Stock |
|---|---|---|---|---|
| ORPA0010 | 432 | 4.4×10.2mm | 5.92 | 10 |
| ORPA034 | 433 | 3.3×8.6mm | 4.66 | 10 |
| ORPA0035 | 434 | 3.6×9.8mm | 5.35 | 9 |
| ORPA0094 | 435 | 3.6×10.5mm | 4.79 | 10 |
| ORPA0097 | 436 | 5.1×10.2mm | 5.57 | 10 |
| ORPA0107 | 442 | 8.2×10.3mm | 5.50 | 10 |
| ORPA0123 | 437 | 4.1×9.8mm | 4.39 | 10 |
| ORPA0132 | 438 | 3.8×11.1mm | 5.46 | 10 |
| ORPA0142 | 439 | 3.5×9.2mm | 3.77 | 10 |
| ORPA0147 | 440 | 3.5×9.2mm | 3.75 | 10 |
| ORPA0149 | 441 | 3.5×9.2mm | 3.62 | 10 |

**`ORPA034` is inconsistent with the rest of the series, which uses four digits.** Likely should be `ORPA0034`. Do not normalise it. Match whatever Ivy's image filename says, and flag the discrepancy in the Phase 1 report.

The two-number size format on this series (e.g. 3.5×9.2mm) is bore diameter × outer diameter, which is the signature of a threaded bead. This is the evidence these belong to Line A.

## A8. Dangle charms, ORGCB (72)

Threaded bead core with a pendant beneath. Same fit as all ORCB beads.

**Rows 390–423 (34):**
ORGCB05-P-18, ORGCB06-P, ORGCB50P, ORGCB07-18K, ORGCB07-P, ORGCB08-P, ORGCB08-18K, ORGCB09-P,
ORGCB10-P, ORGCB11-18K, ORGCB12-18K, ORGCB18, ORGCB19-18K, ORGCB19-P, ORGCB20-18K, ORGCB20-P,
ORGCB21-18K, ORGCB21-P, ORGCB22-18K, ORGCB22-P, ORGCB23-18K, ORGCB23-P, ORGCB24-18K, ORGCB24-P,
ORGCB25, ORGCB26-18K, ORGCB26-P, ORGCB27, ORGCB28-18K, ORGCB28-P, ORGCB29-18K, ORGCB29-P,
ORGCB30-18K, ORGCB30-P

**Rows 443–454 (12):**
ORGCB51-WY, ORGCB51-YL, ORGCB51-YP, ORGCB51-YR, ORGCB51-P, ORGCB52-L, ORGCB53-L, ORGCB54-L,
ORGCB55-L, ORGCB56-B, ORGCB57-Z, ORGCB58-LVR

**Rows 525–550 (26):**
ORGCB56-L, GCB56-R, ORGCB177, ORGCB175, ORGCB109, ORGCB110, ORGCB182-1, ORGCB182-2,
ORGCB182-3, ORGCB182-5, ORGCB182-6, ORGCB182-7, ORGCB182-8, ORGCB184-1, ORGCB184-2, ORGCB184-3,
ORGCB184-4, ORGCB184-5, ORGCB184-6, ORGCB184-7, ORGCB185-14K, ORGCB186-1, ORGCB186-2, ORGCB181,
ORGCB187-14K-1, ORGCB187-14K-2

Notes on this group:

- **`GCB56-R` (row 526) is almost certainly not a typo.** Image filenames omit the `OR` prefix, so the factory appears to have written the filename into the model column. The product is the red enamel sibling of `ORGCB56-L` (blue) and `ORGCB56-B`. **Use SKU `ORGCB56-R`.** Confirm the image exists as `GCB56-R.jpg` and flag if not.
- `ORGCB50P` (row 392) breaks the series convention, which is `-P` suffixed with a hyphen. Likely should be `ORGCB50-P`. Same handling.
- Many ORGCB pieces come as `-18K` gold-plated and `-P` rhodium pairs at identical weight and size. These are **separate products, not variants of one product.** Do not merge them. Differentiate in the product name by finish.
- `ORGCB182-4` was not ordered. The series runs 1, 2, 3, 5, 6, 7, 8. Absence is expected.
- `ORGCB182-*` and `ORGCB184-*` are engraved quote tags (Aristotle and Lao Tzu respectively). `ORGCB186-*` and `ORGCB187-*` are also quote pieces. **The quote text is in the invoice's colour column.** Use it verbatim in the product name and description. Do not paraphrase, do not correct the attribution.
- `ORGCB19` through `ORGCB30` are Thai and Buddhist figural subjects. Handle the naming with care and check with Viktor before publishing. Religious iconography named carelessly is a reputational risk in his home market.

## A9. Enamel accent bracelet bases, ORGCBB1 (14)

Snake chain with an enamel accent bead at the clasp. Same fit as ORCBB01.

| SKU | Size | Colour | Cost USD | Stock |
|---|---|---|---|---|
| ORGCBB1-17-W | 17cm | White | 22.15 | 8 |
| ORGCBB1-17-R | 17cm | Red | 22.15 | 5 |
| ORGCBB1-17-K | 17cm | Black | 22.15 | 6 |
| ORGCBB1-17-B | 17cm | Blue | 22.15 | 6 |
| ORGCBB1-17-G | 17cm | Flower | 22.15 | 8 |
| ORGCBB1-19-W | 19cm | White | 23.95 | 8 |
| ORGCBB1-19-R | 19cm | Red | 23.95 | 8 |
| ORGCBB1-19-K | 19cm | Black | 23.95 | 7 |
| ORGCBB1-19-B | 19cm | Blue | 23.95 | 8 |
| ORGCBB1-19-G | 19cm | Flower | 23.95 | 8 |
| ORGCBB1-21-W | 21cm | White | 26.85 | 5 |
| ORGCBB1-21-R | 21cm | Red | 26.85 | 8 |
| ORGCBB1-21-K | 21cm | Black | 26.85 | 8 |
| ORGCBB1-21-B | 21cm | Blue | 26.85 | 8 |

**There is no 21cm Flower.** The grid is incomplete: 5 colours × 3 sizes would be 15, only 14 were ordered. Do not fabricate the missing SKU.

**Architecture note:** unlike the charms, these 14 *should* be modelled as real Shopify variants of fewer parent products, since colour and size are genuine variant axes on one product. Options: `Colour` (5 values) and `Size` (3 values), one parent product, 14 real variants with correct differentiated pricing and unique SKUs. This follows the NOVA pattern. **Do not use a single variant with a JS picker.** That pattern caused the MICRO Eternity Band checkout pricing bug and is a known anti-pattern in this store.

The `-G` colour code means Flower, not Green. Confirm against the image before writing product copy.

## A10. Filename collision checklist for Phase 1

Verify these specifically before any upload:

1. `ORCB176` — two products, one filename. Must be resolved.
2. `ORPA034` vs `ORPA0034` — confirm which the image uses.
3. `ORCB32-Agr` vs `ORCB32-Aqr` — confirm which the image uses.
4. `GCB56-R` vs `ORGCB56-R` — confirm which the image uses.
5. `ORGCB50P` vs `ORGCB50-P` — confirm which the image uses.
6. Confirm no image exists for a model number outside Appendix A. The folder is the full 554-SKU catalogue. **Filter to Appendix A before uploading anything.** Uploading earring or necklace images into this batch will contaminate the product data.
