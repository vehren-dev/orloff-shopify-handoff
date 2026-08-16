# WEB 16 — configurator checkout audit + native PDP alignment

**4 Aug 2026.** WEB 15 is live. WEB 16 is the draft holding the changes below.
Companion to `orloff-configurator-fix-2026-08-04.md`, which covers the three
bugs already published in WEB 15.

---

## 1. Does payment and ordering work on every custom-config product?

**Almost. 111 of 117 are clean. Six are not, and they fail silently.**

Swept every product that renders a configurator — 66 from the collections plus
51 natural twins — across all nine configurator families:

| Family | Flag | Result |
|---|---|---|
| Solitaire / Halo / Side-stone | *(default)* | clean |
| Selma | *(default)* | clean |
| Three-stone | `ORLOFF_IS_THREESTONE` | clean |
| Wedding band, plain | `ORLOFF_IS_WB_PLAIN` | clean |
| Wedding band, diamond | `ORLOFF_IS_WB_DIAMOND` | clean |
| Earrings, Luna | `ORLOFF_IS_EARRING_LUNA` | clean |
| Earrings, simple | `ORLOFF_IS_EARRING_SIMPLE` | clean |
| Pendant | `ORLOFF_IS_PENDANT` | clean |
| Bracelet | `ORLOFF_IS_BRACELET` | clean |
| MICRO eternity | `ORLOFF_IS_MICRO` | clean |

For each I checked that every SKU in `combo_data` resolves to a real variant id,
and spot-checked at runtime that `data-variant-id` is populated and that the
resolved variant's SKU and price match what the page displays.

### The six that fail

One specific configuration on three rings, on both the lab and natural twin:

| Product | Broken configuration | Cause |
|---|---|---|
| **KARIN** (lab + natural) | 950 Platinum · Signature SI1/H · 0.30 ct | variant does not exist — 69 variants where 70 are expected |
| **EMILY** (lab + natural) | 950 Platinum · Signature SI1/H · 0.30 ct | variant exists but is recorded as **0.40 ct** — SKU `EMILY-PT-S-040`, option value "0.40 ct" |
| **KLARA** (lab + natural) | 950 Platinum · Signature SI1/H · 0.30 ct | same — SKU `KLARA-PT-S-040` |

Every other metal on those three rings has a 0.30 ct Signature. Platinum is the
odd one out, which is what makes EMILY and KLARA look like a data-entry slip
rather than a deliberate range decision.

Confirmed live on KARIN: selecting Platinum + Signature + 0.30 ct shows
**$1,980** and SKU `KARIN-PT-S-030`, and `data-variant-id` is **empty**.
`addToCart` then falls back to the first variant in the map and adds
`KARIN-14YG-P-030-LG` at **$1,320**.

**These are Shopify product-data problems, not theme problems, so I have not
touched them.** Three ways to close it, your call:

1. **EMILY and KLARA** — correct the variant: option value 0.40 ct → 0.30 ct and
   SKU `-040` → `-030`. Check the price is right for 0.30 ct first; it is
   currently priced between the 0.30 and 0.50 Prestige stones.
2. **KARIN** — either create the missing `KARIN-PT-S-030` variant, or remove that
   combination from the `combo_data` metafield so the configurator stops
   offering it.
3. **All three, belt and braces** — harden `addToCart` so an unresolved variant
   disables the button instead of guessing. That is the change that stops this
   whole class of bug recurring, and it needs an edit to
   `assets/ring-configurator.js`.

I would do 1 and 2 to fix today's problem and 3 so it cannot come back.

---

## 2. Native product pages aligned to the configurator look

Two PDP systems were drifting:

| | Configurator (117 products) | Native (charms, silver, one-of-a-kind, sculpture) |
|---|---|---|
| Option heading | Inter 12px / 600 / 0.12em / navy | Inter 13px / 400 / no tracking / #151515 |
| Option values | outlined square buttons, navy border | borderless text — only the selected one looked like a control |
| Price | Inter 26px / 600 / navy | Inter 24px / 400 / grey #444 |
| Group rhythm | 20px | 17px |
| Add to Cart | **ghost** white/navy outline | **filled navy** |

Applied in `assets/web11-fixes.css` section 7 on WEB 16. Native now carries the
configurator's label, option-button, price and spacing treatment.

**Add to Cart converged on filled navy in both directions**, per your call —
the configurator's ghost button became filled navy rather than dragging native
back to ghost. That keeps the 29 July audit's conversion change instead of
reverting it.

`assets/productpage.css` declares competing rules under
`.thb-product-detail .product-information .variations .product-form__input` and
loads after this sheet, so the properties it also sets carry `!important`.
Properties it does not set are deliberately left unflagged.

Verified on the WEB 16 preview: heading 12px/600/1.44px/navy, option buttons
12px/500/1.2px with the 0.8px navy border and 10px 14px padding, price
26px/600/navy, group gap 20px, Add to Cart 13px/600/1.56px filled navy on both
systems. Collection cards do not use `.price`, so nothing leaked into the grid.
Single-variant native pages and the configurator's carat buttons and variant
resolution all still behave.

**Not changed:** the option heading still renders with a trailing colon
("Colour:") where the configurator has none. That text comes from
`snippets/product-option.liquid`, not CSS. Say the word and I will strip it.

---

## 3. "Return To Shop" pointed at /collections/all

Fixed in `snippets/cart-empty.liquid` on WEB 16 — now `routes.root_url`.

It was `routes.all_products_collection_url`, Shopify's automatic catch-all
collection: **421 products in alphabetical order**, no banner, an H1 of just
"Products", and the first six entries are loose diamond listings. The homepage
is the curated entry point to every category.

Affects both places the snippet renders — the cart page and the cart drawer.

### Same target, still unfixed: the "Shop" breadcrumb

`snippets/breadcrumbs.liquid` uses the same
`routes.all_products_collection_url` for the "Shop" crumb, so **Home / Shop /
ENGAGEMENT RINGS** sends people to the same 421-item dump — and that one is on
every collection and product page, so it is seen far more often.

I did not change it, because unlike the cart button the fix is not a URL swap:
pointing "Shop" at the homepage would make the crumb a duplicate of "Home". The
options are to drop the crumb, or make it the real parent (Home / Engagement
Rings / Halo). That is a navigation decision rather than a bug fix.

---

## 3b. EMILY fixed — DONE, live

Applied via `productVariantsBulkUpdate` on both twins. Variant IDs unchanged, so
nothing else could break:

| Variant | Before | After |
|---|---|---|
| `51759138537762` (lab) | `EMILY-PT-S-040-LG`, 0.40 ct, $1,640 | `EMILY-PT-S-030-LG`, **0.30 ct**, $1,640 |
| `51759141355810` (natural) | `EMILY-PT-S-040-NAT`, 0.40 ct, $2,800 | `EMILY-PT-S-030-NAT`, **0.30 ct**, $2,800 |

**Prices deliberately unchanged, because they were already correct for 0.30 ct.**
On EMILY the Signature grade sits below Prestige by a fixed step at each weight:
lab 14K is $1,120 P / $1,060 S, and Platinum Prestige 0.30 is $1,690 — so
Platinum Signature 0.30 should be about $1,640, which is exactly what the
variant was already priced at. Natural checks out the same way: 14K White is
$2,470 P / $2,230 S, Platinum Prestige 0.30 is $3,050, so Signature 0.30 lands
near $2,800 — again exactly the existing price. A genuine 0.40 ct stone would
have been priced around $1,730 / $2,950. Only the label and SKU were ever wrong.

Shopify removed the now-unused "0.40 ct" option value automatically. Verified
live: Platinum + Signature + 0.30 ct resolves to variant `51759138537762` at
$1,640, and no `-040` SKU remains in the variant map.

**Still open — KLARA and KARIN.** I did not touch these; you named EMILY only.

- **KLARA** is character-for-character the same fault: `KLARA-PT-S-040-LG` at
  $2,020 and `-NAT` at $3,240, where Platinum Prestige 0.30 is $2,080 / $3,500.
  Same one-line fix, say the word.
- **KARIN** is different and needs a decision, not a correction. There is no
  0.40 ct variant hiding under a wrong label — the Platinum Signature 0.30 ct
  ring simply has no variant record at all. KARIN has 69 variants where the
  other rings have 70. So either it gets created (at roughly $1,990 lab /
  $3,000 natural, following the same Prestige-minus-a-step pattern), or that
  combination comes out of `combo_data` so the configurator stops offering it.

---

## 3c. #b08d57 -> #bc973f — DONE, one instance

Swept every page, every collection and product template type, and all 50 CSS and
JS assets the storefront loads.

**There was exactly one instance left in the whole theme**, in
`templates/page.about-diamonds.json`:

```css
:root {
  --navy: #091b36;
  --gold: #b08d57;   /* -> #bc973f */
}
```

Everything else on that page referenced it as `var(--gold)`, which is why only a
single literal ever appeared in the rendered HTML — one definition feeding about
a dozen rules. Changed on WEB 16 and verified: `--gold` now computes to
`#bc973f`, the hero eyebrow renders `rgb(188, 151, 63)`, all sections and all
eight tiles still present, no Liquid errors, and a normalised diff against WEB 15
shows the page is otherwise character-identical.

**The About page had none.** I read `templates/page.about.json` end to end — its
only colours are `#000000`, `#091b36`, `#ffffff` and `#fafad2`. The gold you see
on that page is already `#bc973f`, arriving from a global stylesheet, not from
the page template.

Every other page — solar grown, cut, clarity, color, carat, certification,
fluorescence, sourcing, lab-grown, fancy, contact, sizing, diamonds, charm
builder — was already on `#bc973f` before I started. Final sweep: **zero
`#b08d57`, 50 occurrences of `#bc973f`.**

### One place I could not check

`config/settings_data.json` holds a `custom_html_head` setting containing a large
inline `<style>` block, and **the Admin API returns that value truncated** —
"the rest of the value has been truncated to save space". I can neither read the
tail of it nor safely rewrite the file without risking dropping the part I
cannot see. Nothing it emits on any page I rendered contains the old gold, so it
is very likely clean, but if you want certainty, search that one field in
Shopify Admin -> Online Store -> Themes -> Edit code -> `config/settings_data.json`.

---

## 4. Two things worth a look, found in passing

- **A product literally titled "test" is ACTIVE and public** at
  `/products/test`. No product type, no inventory. It is in `/collections/all`
  and in site search.
- **Six loose diamond products are ACTIVE and public** — product type `diamond`,
  zero inventory, handles like
  `1-50ct-round-natural-diamond-colour-e-clarity-vvs1-cut-ex-gia-certified`.
  They sort to the top of `/collections/all` because the titles start with
  digits. They look like leftovers from the Nivoda work; the live diamond search
  at `/pages/diamonds` is driven by the Nivoda feed, not by these.

Archiving all seven would also make `/collections/all` considerably less bad,
whatever you decide about the breadcrumb.
