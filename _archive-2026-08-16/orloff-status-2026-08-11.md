# ORLOFF — WEBSITE STATUS, 2026-08-11

Supersedes `orloff-status-2026-07-29.md`.
Everything below was re-verified against the live site and the Admin API today —
not carried forward from the earlier notes.

---

## 1. SITE HEALTH — OK

| Check | Result |
|---|---|
| `https://orloffofdenmark.com/` | **HTTP 200**, 148 KB HTML, served by Cloudflare |
| Live theme | **WEB 15** (`189575168290`), role MAIN |
| Store plan | Basic, USD, Thailand (+07) |
| Products | 421 in `/collections/all` |

No outage, no broken deploy. The site is serving normally.

---

## 2. THEME STATE — WEB 16 HAS BEEN SITTING UNPUBLISHED FOR 7 DAYS

| Theme | ID | Role | Last touched |
|---|---|---|---|
| WEB 15 | 189575168290 | **MAIN (live)** | 4 Aug |
| WEB 16 | 189665575202 | Unpublished | 4 Aug |
| WEB 1–14 | — | Unpublished | 17 Jul – 4 Aug |

**WEB 16 holds finished, verified work that is not reaching customers.** From the
4 Aug audit: native product pages aligned to the configurator look (labels,
option buttons, price, spacing, filled-navy Add to Cart), the "Return To Shop"
cart button repointed from the 421-item `/collections/all` dump to the homepage,
and the last `#b08d57` gold literal in `page.about-diamonds.json`.

Publishing is a human action in Admin → Online Store → Themes. Nothing blocks it
technically.

### Confirmed live on WEB 15 (the July money bugs are genuinely fixed)

Fetched `/products/karin-lab-grown` and the live `ring-configurator.js` directly:

- `-LG`/`-NAT` alias shim — **present**
- `id="rc-carat-group"` — **present** (carat buttons work on halo / side-stone / Selma)
- halo size-value typo `7.5 / 55.7 O / 17.7` — **gone**

---

## 3. KARIN AND KLARA — FIXED 2026-08-11, VERIFIED LIVE

**RESOLVED later the same day. This section is kept for the record; the tables
below describe the state before the fix.**

Applied 11 Aug and confirmed end-to-end on the live storefront:

| Product | Action | SKU | Price |
|---|---|---|---|
| KLARA lab | relabelled 0.40 → 0.30 ct | `KLARA-PT-S-030-LG` | $2,020 |
| KLARA natural | relabelled 0.40 → 0.30 ct | `KLARA-PT-S-030-NAT` | $3,240 |
| KARIN lab | created missing variant | `KARIN-PT-S-030-LG` | $1,980 |
| KARIN natural | created missing variant | `KARIN-PT-S-030-NAT` | $2,940 |

No prices were changed. KLARA's two were already correct for 0.30 ct, and the
KARIN prices are exactly what the configurator was already quoting on the page
($1,980 and $2,940, both read off the live product pages before creating).
KARIN now has 70 variants, matching the rest of the range.

Verified by configuring Platinum · Signature · 0.30 ct on the live site and
adding to cart: KARIN lab returned `KARIN-PT-S-030-LG` at $1,980, KLARA lab
returned `KLARA-PT-S-030-LG` at $2,020. Both match the displayed price. Test
carts cleared.

**One follow-up defect, introduced and fixed the same session:** the two new
KARIN variants were created without a `mediaId`, so they fell back to the
product's featured image — `KARIN_G_1.png`, yellow gold — while every other
platinum variant uses `KARIN_WG_1.png`. Both reassigned to the `_WG_` media and
re-verified in the cart. Note for next time: **platinum deliberately shares the
white gold photography** (confirmed by the user 11 Aug); there is no separate
platinum shot and none is needed.

**STILL OPEN:** the silent `addToCart` fallback was deliberately left in place —
user declined the hardening on 11 Aug. The `k.length ? m[k[0]] : null` pattern
remains in `assets/ring-configurator.js` 8 times, once per configurator family.
If any variant goes missing again, it will silently charge the wrong price
rather than failing loudly.

---

### Original diagnosis (pre-fix, 4 Aug audit)

The 4 Aug audit found six broken configurations. EMILY was fixed then; KARIN and
KLARA were not, and were still live on the morning of 11 Aug.

Verified this morning by fetching each product page and diffing `combo_data`
against the rendered variant map:

| Product | `combo_data` offers PT-S-030 | Variant map resolves it | Verdict |
|---|---|---|---|
| `emily-lab-grown` | yes | **yes** | fixed ✅ |
| `klara-lab-grown` | yes | no — stale `KLARA-PT-S-040-LG` still in map | **broken** |
| `klara-natural` | yes | no — stale `KLARA-PT-S-040-NAT` still in map | **broken** |
| `karin-lab-grown` | yes | no — variant does not exist (69 variants, not 70) | **broken** |
| `karin-natural` | yes | no — variant does not exist (69 variants, not 70) | **broken** |

Admin API confirms the underlying data: KARIN has **69** variants on both twins
with no `KARIN-PT-S-030-*` record at all; KLARA has 70 but variant
`51759150760226` is still `KLARA-PT-S-040-LG` / "0.40 ct" / $2,020 and
`51759153414434` is still `KLARA-PT-S-040-NAT` / "0.40 ct" / $3,240.

**What the customer experiences.** Select 950 Platinum · Signature · 0.30 ct on
any of those four pages. The page displays the platinum price and SKU,
`data-variant-id` is left empty, and `addToCart` silently substitutes the first
variant in the map — 14K Yellow Gold, Prestige, 0.30 ct. Verified on KARIN lab
in the 4 Aug audit: page shows **$1,980**, cart receives `KARIN-14YG-P-030-LG` at
**$1,320**. The order's line-item properties still read "Platinum". KLARA natural
would ship a $3,240-configured ring charged at the $2,800 14K price.

**The silent fallback is still in the live JS.** I pulled
`cdn/shop/t/31/assets/ring-configurator.js` (78 KB) and the
`k.length ? m[k[0]] : null` first-variant fallback appears **8 times** — once per
configurator family. The alias shim cannot save these two rings, because for
KARIN and KLARA there is no correctly-keyed variant to alias *to*.

### Fixes, in order of value

1. **KLARA** — one `productVariantsBulkUpdate` on each twin: option value
   0.40 ct → 0.30 ct, SKU `-040` → `-030`. Prices are already correct for
   0.30 ct (Platinum Prestige 0.30 is $2,080 lab / $3,500 natural; Signature sits
   one fixed step below at $2,020 / $3,240). Identical to the EMILY fix that
   already worked. Say the word and it is done in one call.
2. **KARIN** — needs your decision, not a correction. Either create the missing
   `KARIN-PT-S-030-LG` / `-NAT` variants (~$1,990 lab / $3,000 natural on the
   established pattern), or remove that combination from `combo_data` so the
   configurator stops offering a ring that does not exist.
3. **Harden `addToCart`** so an unresolved variant disables the button instead of
   guessing. This is the change that stops the whole class of bug returning. A
   configurator that refuses to add is a support ticket; one that quietly adds the
   wrong ring at the wrong price is a chargeback.

---

## 4. TRAFFIC AND CONVERSION

### Weekly sessions

| Week of | Sessions |
|---|---|
| 18 May | 167 |
| 25 May | 107 |
| 1 Jun | 360 |
| 8 Jun | 425 |
| 15 Jun | 350 |
| 22 Jun | 358 |
| 29 Jun | 347 |
| 6 Jul | 246 |
| **13 Jul** | **699** |
| 20 Jul | 569 |
| 27 Jul | 367 |
| 3 Aug | 331 |
| 10 Aug | 48 (partial week) |

Traffic is real and reasonably steady — roughly 330–430/week baseline with a
mid-July spike to ~700. Total 4,374 sessions over 12 weeks.

### The funnel, last 30 days

| Stage | Count | Rate |
|---|---|---|
| Sessions | 2,039 | — |
| Sessions with cart additions | 24 | 1.2% |
| Sessions that reached checkout | 6 | 0.3% |
| **Sessions that completed checkout** | **0** | **0.0%** |

**Zero completed checkouts in 30 days.** The store has 3 orders in its entire
history: #1001 ($1.07, paid, Jan 2024 — a test), #1002 (voided, Jan 2024) and
#1003 ($3,000, voided, Jun 2026). There is no record of a real completed
customer order.

Abandoned checkouts total 3, the most recent on **12 July**: a MICRO TSAVORITE at
$2,200 and a KATARINA 14K White Gold 1 ct at $2,750 — both real, high-intent
configurations that did not convert.

Payments are not obviously misconfigured — Apple Pay and Google Pay are both
enabled and USD is the only presentment currency. The numbers are also small
enough that 0-of-6 is not statistically damning on its own. But **6 people
reached the payment step in a month and none finished**, and that has never been
tested end-to-end from the customer side. I would place a real test order through
the full checkout before assuming the path works.

That test is a live transaction against your own payment provider, so it is
yours to run, not mine.

---

## 5. PUBLIC CLUTTER — SEVEN PRODUCTS THAT SHOULD NOT BE INDEXED

Still ACTIVE and public, unchanged since 4 Aug:

- **A product literally titled "test"** at `/products/test` — ACTIVE, no product
  type, no inventory, in site search and in `/collections/all`.
- **Six loose diamond listings** — product type `diamond`, **zero inventory**, all
  ACTIVE. Titles begin with digits so they sort to the very top of
  `/collections/all`:
  `1.50ct Oval F VVS2`, `1.50ct Round F VVS2 EX`, `1.50ct Round E VVS1 EX`,
  `1.50ct Round E VVS2 EX`, `0.80ct Oval F VS2`, `0.70ct Emerald G VS1 VG`.

They are leftovers from the Nivoda work — the live diamond search at
`/pages/diamonds` runs off the Nivoda feed, not these records. One of them also
turns up as a $0.00 abandoned checkout, so shoppers are reaching them.

Archiving all seven is a single bulk status change and materially improves the
first impression of `/collections/all`. I have not done it — it is a visible
catalogue change and yours to approve.

---

## 6. CARRIED-OVER BACKLOG (unchanged, from the 29 Jul and 4 Aug audits)

**Needs Admin access, not API:**
- Homepage title / meta description — Online Store → Preferences. Suggested:
  `Fine Jewellery & Engagement Rings in Gold and Platinum | Orloff of Denmark`
- `Organization.sameAs` JSON-LD has 5 empty strings — lives in Theme settings →
  custom HTML head. The Admin API returns that field truncated, so it cannot be
  safely rewritten programmatically.

**Needs a decision from you:**
- "Shop" breadcrumb still points at the 421-item `/collections/all`, on every
  collection and product page. Not a URL swap — either drop the crumb or make it
  the real parent (Home / Engagement Rings / Halo).
- Missing H1s on `/pages/about-us` (no heading at all) and `/pages/diamonds`
  (empty body); `/pages/about-diamonds` has two H1s. All need visible copy
  changes.
- Option headings on native PDPs render a trailing colon ("Colour:") where the
  configurator has none — `snippets/product-option.liquid`, one-line strip.

**Theme one-liners, still present:**
- `snippets/facets.liquid` — `<facet-filters-form>` closed as `</facets-filters-form>`
- `snippets/product-add-to-cart.liquid` — missing `| t` on a translation key
- `snippets/mobile-menu.liquid` — hardcoded `action="/search"`
- Solar-grown page — "International Gemological **Institure** (IGI)" typo

**Performance:**
- Hero images still served at master resolution (~500 KB) via `image_url` with no
  width arg in `sections/image-with-text-overlay.liquid`
- `vendor.min.js`, `quantity-input.min.js`, `app.min.js` render-blocking via
  `| script_tag`; Cormorant Garamond loads render-blocking from Google Fonts

---

## THE THREE THINGS THAT MATTER THIS WEEK

1. ~~Fix KLARA and decide on KARIN.~~ **DONE 11 Aug** — all four corrected and
   verified in the cart. See section 3.
2. **Publish WEB 16.** A week of finished, verified work is sitting in a draft.
3. **Place one real test order end to end.** 2,039 sessions and 0 completed
   checkouts in 30 days is either a funnel problem or a checkout problem, and
   nobody has confirmed which.

## DO NOT TOUCH
`orloff.stone_images`, `orloff.metal_images`. Homepage layout/order (reorder and
featured-products row rejected 28 Jul). Gold eyebrows and CTA hierarchy — both
reverted on instruction 29 Jul; the 2.75:1 contrast on `#bc973f` is a known,
accepted risk. Collection SEO — hand-written and good.
