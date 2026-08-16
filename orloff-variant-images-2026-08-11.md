# ORLOFF — VARIANT IMAGE COLOUR FIX, 2026-08-11

**Problem reported:** on engagement rings, selecting Platinum / White Gold /
Rose Gold puts a **yellow gold** photo in the cart.

**Cause:** variant-level images. A variant with no image of its own falls back to
the product's featured image, which is always the yellow gold shot. Yellow is
therefore never wrong, and every other metal is.

---

## AUDIT — full scope, measured

104 products (all engagement rings + all wedding bands, both lab and natural
twins), 4,956 variants:

| | Count |
|---|---|
| Already correct | 3,644 |
| **No image at all** → falls back to yellow | **772** |
| **Explicitly pointing at the yellow photo** | **540** |
| **Total broken** | **1,312 (26%)** |

By failure: **324 white/platinum showing yellow**, **216 rose showing yellow**,
plus the 772 with nothing assigned.

**54 products affected. 50 were clean** (KARIN, KLARA, EMILY, SELMA, EMMA and
the rest already had all nine images attached and correctly assigned).

## THE PHOTOGRAPHY IS NOT MISSING

Checked the Files library directly. `MIA_WG_*`, `HAZEL_RG_*`, `VINCENT_WG_*`,
`KATARINA_WG_*`, `MARIA_RG_*` etc. **all exist**, in every metal, and for several
rings at every carat size. They were simply **never attached to the products**.

Affected products carry only their three `_G_` (yellow) images. Nothing needs to
be shot.

---

## DONE AND VERIFIED (2026-08-11)

| Product | Variants fixed | Method |
|---|---|---|
| ARIEL lab + natural | 140 | media already attached, assignment only |
| KATARINA lab + natural | 140 | attached 6 media, then assigned |
| VINCENT | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| KARL | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| AXEL | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| ERIK | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| SIMON | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| LEON | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| MARKUS | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| CAESAR | 42 | attached `_WG_1` + `_RG_1`, then assigned |
| MARIA | 21 | attached `_WG_1` + `_RG_1`, then assigned |
| STINA | 21 | attached `_WG_1` + `_RG_1`, then assigned |

| ANDREW lab + natural | 14 | attached `_WG_1` + `_RG1`, then assigned |
| SVEN lab + natural | 14 | attached `_WG_1` + `_RG_1`, then assigned |
| NIELS lab + natural | 14 | attached `_G_1` + `_WG_1` + `_RG_1`, then assigned |
| CHARLES lab + natural | 14 | attached `_G_1` + `_WG_1` + `_RG_1`, then assigned |

| MATILDA lab + natural | 14 | attached all 3 `_WG_` + all 3 `_RG_`, then assigned |
| ELSA lab + natural | 14 | attached all 3 `_WG_` + all 3 `_RG_`, then assigned |

| ALICE · LISA · NINA · ESTELLE · CHERRY (all twins) | 70 | attached all 3 `_WG_` + all 3 `_RG_`, then assigned |

| MIA lab + natural | 84 | carat-specific: attached 8 media, matched metal AND carat |
| MADELINE lab + natural | 84 | carat-specific: attached 8 media, matched metal AND carat |

**980 variants across 40 products. ALL 27 WEDDING BANDS COMPLETE.**
Sweep after the bands finished: **0 missing** store-wide (was 772).

### Carat-specific rings — the working recipe
Variant order per product is **metal → grade → carat**:
`14G P-020, P-050, P-100, S-020, S-050, S-100` then 14WG, 14RG, 18G, 18WG,
18RG, PT. 7 metals x 2 grades x 3 carats = 42.

Attach 8 media per product: `_WG_` and `_RG_` at 0.20/0.50/1.00, plus `_G_` at
0.50 and 1.00 (the 0.20 yellow is already on the product). Then assign by
metal AND carat. PT takes the `_WG_` of the matching carat.

Watch out: the existing yellow shots are often misnamed — `MIAG0.202.png`,
`MADELINEG0.203.png` — so only `_G_0.20_1` is reliably usable; attach the
0.50 and 1.00 yellows fresh.

---

## GALLERY CYCLING — ALREADY WORKS. **DO NOT TOUCH.**

The theme already filters the PDP gallery to the selected metal's 3 shots, and
cycles back to that metal's first image on the 4th press. Confirmed working by
the user 2026-08-14: *"right now it cycles perfectly... dont change"*.

No theme change is needed or wanted here. **Do not edit the product media
snippet.** Platinum correctly draws the white gold set.

This is also why attaching all three `_WG_` / `_RG_` shots per product matters —
the existing gallery logic has a full set to cycle through.

---

## DE-CROWD THE CART LINE ITEM — DONE in WEB 19 (drawer), main cart still to do

**`snippets/cart-drawer.liquid` in WEB 19 (`189939089698`) — DONE 2026-08-14.**
New checksum `058f7e45728c30f24100488498f38aa2`, 11998 B.

Counts visible (non-`_`) properties first, and renders the variant-options block
**only when there are none**. Configurator rings therefore show just the
properties block; charms / silver / sculpture, which post no properties, still
show their options as before. `_Image` is not counted, so an item carrying only
`_Image` still falls back to its options.

**STILL TO DO: the same change in `sections/main-cart.liquid`** (the full /cart
page). Live WEB 18 version is `232c7a86`, 12475 B. Apply the identical
`visible_props` guard around its `options_with_values` loop.

Original problem, for the record:

Each cart line currently prints the same facts twice:

```
Metal: Platinum              <- BLOCK 1: item.options_with_values
Grade: Signature - SI1/H        (the variant's own three options)
Carat: 0.20 ct

Metal: Platinum              <- BLOCK 2: item.properties
Diamond Origin: Lab Grown       (posted by the configurator)
Diamond Grade: Signature - SI1/H
Center Stone: 0.20 ct
Total Carat Weight: 0.50 ct
Ring Size: 7.5 / 55.7 / O / 17.7
SKU: PT-MIA-S-020
```

**User's call: keep BLOCK 2 (Metal down to SKU), delete BLOCK 1.**
The bare "Metal / Grade / Carat" repeat is the one to go.

Fix: drop the `{% for option in item.options_with_values %}` loop in
`snippets/cart-drawer.liquid` **and** `sections/main-cart.liquid`. Guard it so
native products (charms, silver, sculpture) still show their options — those
have no configurator properties, so gate on `item.properties` being present, or
on the product having a configurator template.

NOTE: the WEB 16 work solved this the *other* way round — it hid the properties
that duplicated the options. That is the opposite of what the user wants now.
Do not reuse the WEB 16 snippet verbatim.

Live WEB 18 still runs the pre-WEB-16 `cart-drawer.liquid` (`2c557c44`,
10632 B) and `main-cart.liquid` (`232c7a86`, 12475 B), so neither de-dup exists
in production today.

### Consequence for products already done
The first twelve bands had only `_WG_1` and `_RG_1` attached (one shot per
metal), because at that point the goal was just the cart thumbnail. For the
3-per-metal gallery to work they need `_2` and `_3` topped up:

VINCENT · KARL · AXEL · ERIK · SIMON · LEON · MARKUS · CAESAR · MARIA · STINA ·
ANDREW ×2 · SVEN ×2 · NIELS ×2 · CHARLES ×2

MATILDA and ELSA onward already have all three per metal — **keep doing it that
way.** ARIEL, KATARINA, KARIN, KLARA and the original clean set already have 9.

Gotcha found: **ANDREW's rose primary is `ANDREW_RG1.png`**, not `ANDREW_RG_1.png`.
Filenames are not consistently underscored — check the actual Files listing per
product rather than composing the name from a pattern.

Second gotcha: on the small twin bands, **lab and natural share the same
MediaImage records** for their yellow shots. Attaching new media still has to be
done per product; each call returns its own new ids.

**The entire 42/21-variant wedding band group is COMPLETE** — VINCENT, KARL,
AXEL, ERIK, SIMON, LEON, MARKUS, CAESAR, MARIA, STINA.

Throughput note: batching 2-3 products per API call (GraphQL aliases) rather
than one product per call is roughly 3x faster and is how the last five went.

Media ids created, for reference:
- VINCENT WG `55561041412386` RG `55561041445154` (existing G `55100018393378`)
- KARL WG `55561041477922` RG `55561041510690` (existing G `55100034416930`)
- AXEL WG `55561041543458` RG `55561041576226` (existing G `55100035465506`)
- KATARINA lab WG `55537912840482` RG `55537912938786`
- KATARINA nat WG `55537913037090` RG `55537913135394`

Platinum and White Gold both resolve to the `_WG_` image — confirmed correct
by the user 11 Aug: **platinum deliberately shares the white gold photography.**

---

## METHOD (repeat for each remaining product)

1. `productCreateMedia(productId, media:[{mediaContentType: IMAGE,
   originalSource: "<CDN url of the _WG_ / _RG_ file>"}])` — attaches the
   missing photos. Returns media ids in the order submitted.
2. `productVariantsBulkUpdate(productId, variants:[{id, mediaId}])` — assign.
   Yellow variants usually already have images and can be skipped.

**Metal → image mapping**
- `14YG` / `18YG` → `_G_`
- `14WG` / `18WG` → `_WG_`
- `14RG` / `18RG` → `_RG_`
- `PT` → **`_WG_`** (shares white gold)

**Variant ordering differs by range — do not assume:**
- Engagement rings, KARIN-style: per carat group of 14 →
  `YG-P, YG-S, WG-P, WG-S, RG-P, RG-S` (14K) then the same in 18K, then `PT-P, PT-S`
- Engagement rings, KATARINA-style: per carat group of 14 →
  `14YG-P, 14YG-S, 18YG-P, 18YG-S, 14WG-P, 14WG-S, 18WG-P, 18WG-S,
   14RG-P, 14RG-S, 18RG-P, 18RG-S, PT-P, PT-S`
- Wedding bands: SKU is **metal-prefixed**, e.g. `14G-VINCENT-3MM`,
  `14WG-VINCENT-3MM`, `PT-VINCENT-3MM`. 7 metals × 6 widths = 42 variants.

Always read the SKU rather than trusting position.

**File naming is inconsistent — check per product:**
- Standard: `KARIN_G_1.png`, `KARIN_WG_1.png`, `KARIN_RG_1.png`
- ARIEL: no underscores — `ARIELG1_<hash>.png`, `ARIELWG1_<hash>.png`
- Carat-specific: `MIA_WG_0.20_1.png`, `HAZEL_RG_1.00_2.png`,
  `BIANCA_WG_0.30_3.png` — these have a photo per metal **per carat**
- Some strays: `MIAG0.202.png`, `BIANCAG0.203.png`, `KATARINAWG1.png`

---

## REMAINING — 50 products

**Engagement rings, carat-specific photography** (metal *and* carat must match;
`_0.20_`, `_0.30_`, `_0.50_`, `_1.00_` sets exist in Files). Each is 42 variants,
30 of them wrong, both twins:

~~MIA · MADELINE~~ **DONE**

**RESUME HERE →** ELISE · STELLA · SERENA · BIANCA · ELEANOR · HELENA · HAZEL
→ 14 products, 420 variants (of which 420 are assigned, 210 currently wrong)

Note BIANCA has carats `0.20 / 0.30 / 0.50` (not 1.00) — check each ring's
actual carat set before composing filenames.

**Wedding bands, simple `_G_ / _WG_ / _RG_ 1-3` photography.** 42 variants each
(7 metals × 6 widths), all 42 currently unassigned:

~~VINCENT · KARL · AXEL · ERIK · SIMON · LEON · MARKUS · CAESAR · MARIA ·
STINA~~ — **ALL DONE.**

Small wedding bands, 7 variants each, both twins:
~~ANDREW · SVEN · NIELS · CHARLES~~ **DONE**

~~MATILDA · ELSA~~ **DONE**

**RESUME HERE →** ALICE · LISA · NINA · ESTELLE · CHERRY
(10 products, 70 variants). ALICE file URLs already confirmed present in Files:
`ALICE_G_1/2/3`, `ALICE_WG_1/2/3`, `ALICE_RG_1/2/3`.
Same 7-variant shape: SKU order is
`14G, 18G, 14WG, 18WG, 14RG, 18RG, PT` → media `G, G, WG, WG, RG, RG, WG`.
Four products fit comfortably in one attach call and one assign call.

Then the 18 carat-specific engagement rings, then earrings/bracelets/pendants.

### ALSO OUTSTANDING — found 2026-08-14, wider scan of all 421 products
Three categories beyond rings and bands also have unassigned variant images:

| Type | Products | Variants missing |
|---|---|---|
| Fine Jewelry Earrings | 11 | 77 |
| Bracelets | 2 | 70 |
| Pendants | 2 | 28 |

These were never in the original count. Same fix, same method.

These five are the fastest remaining work: identical 42-variant shape, simple
`_G_ / _WG_ / _RG_` filenames, all confirmed present in Files. Per width group of
7 the order is `14G, 18G, 14WG, 18WG, 14RG, 18RG, PT`, so the media pattern is
`G, G, WG, WG, RG, RG, WG` repeated six times.

MARIA · STINA → 21 variants each, all unassigned → 42 variants

**Wedding bands, 7 variants each, all unassigned** (both twins):
ANDREW · SVEN · NIELS · CHARLES · MATILDA · ELSA · ALICE · LISA · NINA ·
ESTELLE · CHERRY
→ 22 products, 154 variants

**Total outstanding: ~1,030 variants across 50 products.**

Product ids already looked up:
- VINCENT `10270670553378` · KARL `10267025178914` · AXEL `10265843597602`

---

## NOTE ON EFFORT

Each product needs its variant ids read, then media attached, then a bulk
assignment written out variant by variant — roughly three large API calls each.
Fifty products is a few hundred calls. It is entirely mechanical and the data is
all present; it is just long. Best done as a scripted batch against the Admin API
with a private app token rather than one product at a time.

## RELATED, SAME DAY
- KARIN / KLARA Platinum·Signature·0.30ct pricing — fixed, see
  `orloff-status-2026-08-11.md` section 3.
- Engagement ring collection filters — fixed in theme
  **WEB 16 - Solar Grown + Retail Partners redesign** (`189847503138`).
