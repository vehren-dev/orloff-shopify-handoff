# Orloff of Denmark — Full Site Audit
**Date:** 29 July 2026
**Scope:** orloffofdenmark.com (live production)
**Pages sampled:** 20 · **Products analysed:** 151 / 5,172 variants
**Method:** Rendered DOM, computed styles, Resource Timing, response headers, public products/collections JSON

---

## Scorecard

| Dimension | Grade | Note |
|---|---|---|
| SEO | C+ | Deep pages strong; homepage and tag pages weak |
| Performance | D | 3.58 MB homepage, no responsive images |
| Design | B+ | Confident identity, inconsistent type scale |
| UX | C | Navigation buries the catalogue |
| Accessibility | C | Gold-on-white fails AA; small touch targets |

**Summary:** The brand work is strong and the deep templates (collection + product) are better
optimised than most jewellery stores. Damage is concentrated in three places: the homepage ships
2.26 MB of unresized imagery, the entire 151-product catalogue sits behind a single nav item
labelled "BROWSE", and tag-filtered collections generate duplicate content against themselves.

---

## 1. SEO & Core Web Vitals

### Titles, meta & URL structure

**CRITICAL — Homepage title is the brand name and nothing else.**
`<title>Orloff of Denmark</title>` — 17 chars against ~60 available. No category, no material, no
geography. Meta description is 92 chars and equally generic.
*Fix:* e.g. "Fine Jewellery & Engagement Rings in Gold and Platinum | Orloff of Denmark" (~72 chars).
Extend description toward 155 chars; reuse the Hua Hin / Bangkok geography the collection pages
already use well.

**HIGH — Tag-filtered collections compete with themselves.**
`/collections/wedding-bands/male` and `/female` each canonicalise to *themselves* while sharing an
identical title, meta description and H1. Same pattern across Fine Jewelry tag views. Titles also
leak Shopify's raw separator: `Wedding Bands | Orloff of Denmark – Tag`.
*Fix:* canonicalise tag views to parent, or give each unique title/H1/description. Strip "– Tag"
from the template either way.

**HIGH — Four H1s on the homepage; zero on three key pages.**
Homepage declares H1 four times (SOLAR GROWN DIAMONDS, ENGAGEMENT RINGS, WEDDING BANDS, ONE OF A
KIND) because every hero section reuses the same block. Meanwhile `engagement-rings-halo`,
`/pages/diamonds` and `/pages/about-us` have no H1 at all; `/pages/about-diamonds` has two.

**MEDIUM — Auto-generated meta descriptions on content pages.**
About Us, Solar Grown Diamonds and About Diamonds carry 320–324 char descriptions scraped verbatim
from body copy (one begins "Sunlight in, diamond out The Process A diamond is carbon, pressure,
an…"). These truncate mid-sentence at ~160 chars.

#### Measured page data

| Page | Title | Len | H1s | Meta |
|---|---|---|---|---|
| Homepage | Orloff of Denmark | **17** | **4** | 92 |
| /collections/engagement-rings | Engagement Rings \| Orloff of Denmark | 36 | 1 | 145 |
| /products/katarina-lab-grown | KATARINA - Solitaire Engagement Ring \| … | 56 | 1 | 123 |
| /collections/engagement-rings-halo | Halo Engagement Rings \| Orloff of Denmark | 41 | **0** | 107 |
| /collections/wedding-bands/male | Wedding Bands \| Orloff of Denmark – Tag | 45 | 1 | 126 |
| /collections/wedding-bands/female | *(identical to above)* | 45 | 1 | **dup** |
| /pages/diamonds | Diamonds – Orloff of Denmark | 34 | **0** | **0** |
| /pages/sizing | SIZING – Orloff of Denmark | 32 | 1 | **0** |
| /pages/about-diamonds | ABOUT DIAMONDS – Orloff of Denmark | 40 | **2** | **324** |
| /pages/about-us | ABOUT ORLOFF OF DENMARK – Orloff of Denmark | 49 | **0** | **320** |

### Structured data

**WORKING WELL — Product schema is correct.** Product pages emit valid `ProductGroup` with 70
`hasVariant` entries, each a full `Product` with SKU, price, currency, availability and canonical
variant URL. Brand set. Better than most competitors.

**MEDIUM — Missing breadcrumb, ItemList and review markup.** Breadcrumbs render visually on product
pages but emit no `BreadcrumbList` schema. Collection pages carry only `Organization` — no
`ItemList`. No review system anywhere, so no `aggregateRating` (the most visible SERP enhancement in
jewellery retail). Minor: the `Organization` `sameAs` array contains five empty strings alongside
the two real social URLs.

**MEDIUM — Thin product copy.** 48 of 151 products carry <150 chars of description; catalogue
average is 307. Competitors publish 600–1,000 words on cut, setting and certification. Largest
untapped organic-content opportunity on the site.

### Core Web Vitals & performance blocks

**CRITICAL — Full-resolution masters served into thumbnail slots.**
Homepage transfers **3.58 MB across 159 requests**, of which **2.26 MB is imagery**. Four Fine
Jewelry source files at 4096×4096 / 3760×3760 / 3568×3532 render into **279×279** tiles on desktop
and **164×164** on mobile.

`BRACELET_WEBSITE_4.jpg` is **1,250,713 bytes (1.22 MB) at origin**. Requested via Shopify's own CDN
as `?width=400&format=webp` the identical image is **27,600 bytes (27.6 KB)** — a **97.8%
reduction**, available today, no new tooling, no re-uploading.

| Image | Intrinsic | Displayed | Oversize | Transferred |
|---|---|---|---|---|
| BRACELET_WEBSITE_4.jpg | 4096×4096 | 279×279 | **14.7×** | **895 KB** |
| RING_WEBSITE_2.jpg | 4096×4096 | 279×279 | **14.7×** | 238 KB |
| EARRINGS_WEBSITE_2.jpg | 3760×3760 | 279×279 | **13.5×** | **339 KB** |
| PENDANT_WEBSITE_3.jpg | 3568×3532 | 279×279 | **12.8×** | 293 KB |
| SOLAR_copy.jpg (hero) | 5504×3072 | 1265×800 | 4.4× | 291 KB |
| ENGAGEMENT_IMAGE.png | 2496×1728 | 1265×650 | 2.0× | 205 KB |

**HIGH — No responsive images, almost no lazy-loading on the homepage.**
Of 19 homepage images, **1** has `srcset` and **0** use `<picture>`. Every file is JPG or PNG — no
WebP/AVIF anywhere on the page. Only 2 of 19 are `loading="lazy"`; the other 17 are eager, so the
browser fetches every below-the-fold section image before first paint. Collection and product
templates *do* use `srcset` correctly — this is a homepage-specific regression.

**HIGH — Render-blocking scripts and duplicated font strategy.**
Five theme scripts load with neither `async` nor `defer`: `vendor.min.js`, `header.min.js`,
`predictive-search.min.js`, `quantity-input.min.js`, `app.min.js`.
Fonts load twice over: Inter self-hosts four WOFF2 files (~157 KB) while Cormorant Garamond comes
from `fonts.googleapis.com` — a render-blocking third-party stylesheet on the critical path.
Separately ~500 KB of Shopify checkout bundles (`hydrate.js` 207 KB,
`useShopPayExternalAppContext` 102 KB, `OnePage` 71 KB) are preloaded on a homepage with no cart.

**MEDIUM — Layout-shift risk.** Four homepage images carry no `width`/`height`. Both header logo
`<img>` elements report intrinsic size **0×0** (never decode) while occupying a 100×100 slot. On
mobile the Engagement Rings collection banner has intrinsic size 375×195 but paints at 375×890 —
visibly upscaled and soft.

**WORKING WELL — Delivery layer.** Brotli active on HTML, CDN assets `max-age=31557600`, HSTS and a
sensible CSP present, server render time 27 ms, TTFB 430 ms from Bangkok edge. Infrastructure is not
the problem — the payload is.

---

## 2. Design & Visual Hierarchy

Identity is the strongest asset: navy `#091b36`, warm gold accent, Cormorant Garamond against Inter,
square-cornered buttons, generous full-bleed photography. Coherent and genuinely premium. Problems
are consistency and emphasis, not taste.

**HIGH — Type scale has drifted into 27 variants on one page.**
The homepage renders **27 distinct combinations** of element/family/weight/size/letter-spacing.
Inter appears at four weights (300/400/500/600) across nine sizes (11, 12, 13, 13.6, 14, 15, 16, 18,
20 px). H2 is set at 30px with three *different* letter-spacings (−0.15px, −0.3px, normal) and once
at 32px/400/+1.6px.
*Fix:* collapse to a six-step scale (12/14/16/20/30/42), two weights per face, defined once as CSS
custom properties.

**MEDIUM — Two golds in circulation.** Computed accent on the live site is `#bc973f`; the brand
standard recorded for this theme is `#b08d57`. Both appear. Drive one from a single token.

**HIGH — Every CTA has identical visual weight.**
All eight homepage CTAs (READ, SHOP NOW ×3, SEARCH DIAMONDS, READ) use the same outline treatment:
transparent background, 1px border, 0px radius, 13.6px letter-spaced caps. Nothing is styled as
*the* action, so an editorial "READ" and a commercial "SHOP NOW" read as equals.
*Fix:* filled navy primary for commercial actions; outline reserved for secondary/editorial. One
primary per viewport.

**MEDIUM — Long, evenly-weighted editorial rhythm with no product in it.**
Homepage runs **6,600 px desktop / 7,345 px mobile** across 13 sections alternating almost
metronomically between full-bleed image-with-overlay and centred rich text. Every section is roughly
the same size and shape, so nothing reads as more important, and the visitor never encounters a
product card, a price, or social proof. Footer alone is 883 px (13% of the page).

**WORKING WELL — Restraint in colour, generous whitespace.** Disciplined palette (navy, gold, white,
near-black), no decorative gradients or competing hues. Square corners and uppercase letter-spaced
labels applied consistently — a recognisable signature.

---

## 3. UX & User Journey

**CRITICAL — The whole catalogue is hidden behind one word: "BROWSE".**
Desktop header offers exactly three top-level items: BROWSE, DIAMONDS, ABOUT US. All 151 products
across 19 collections sit inside the BROWSE mega-menu — which is itself an `<a href="#">`.
Costs on three fronts: commercially (no shopping entry point without hovering a generic verb), SEO
(the most valuable internal anchor text is demoted a level), accessibility (an empty-fragment link
is not a reliable keyboard/screen-reader control).
*Fix:* promote ENGAGEMENT RINGS, WEDDING BANDS, FINE JEWELRY to top-level items; rebuild the trigger
as a `<button>` with `aria-expanded`.

**HIGH — Two navigation links silently deliver the wrong page.**
Fine Jewelry → **RINGS** points to `/collections/fine-jewelry/rings`, which 301s to the *unfiltered*
parent — the visitor asks for rings and receives all 24 fine jewellery products with no indication
anything was ignored. **NECKLACES** and **PENDANTS** are two separate menu entries pointing at the
identical URL; the `necklaces+pendants` variant redirects onward to a 3-product tag page.

**HIGH — Add to Cart is the quietest element on the product page.**
On `/products/katarina-lab-grown` the ATC control renders with a **white background and navy text** —
visually a secondary/ghost button. It's the most valuable interaction on the site and is styled to
recede. No sticky ATC on mobile, so on a page this long the button scrolls away permanently.

**HIGH — Seventy variants, no guidance, no proof.**
Each engagement ring exposes **70 variants** across five axes (Diamond Origin, Metal, Diamond Grade,
Carat Weight, Size) on a page carrying ~2,100 chars of total text. Five consequential decisions on a
$1,000–$35,000 purchase with no explanation of what "Prestige VS1/F" means in that flow.
Compounding it: **no reviews, no ratings, no GIA/certification content, no warranty or guarantee
statement** — despite the collection meta description promising "GIA-certified diamonds".

**MEDIUM — Published $0.00 product with no images.**
`/products/micro` is live and indexable at **$0.00**, zero images, no SKU. It is **NOT purchasable**
— the variant is `available: false`, so there is no checkout exposure. But it is a thin empty page in
the index, and it drags the Engagement Rings price filter to read **"$0.00 — $35,630.00"**, which
undermines price framing on a luxury collection page. Appears to be a legacy duplicate of MICRO
ETERNITY BAND. *Fix:* archive or unpublish.

### Journey friction, entry to conversion

| Stage | What happens now | Friction |
|---|---|---|
| Land | Full-bleed editorial hero, no product or price above the fold | High |
| Orient | Must hover a generic "BROWSE" to discover any category | High |
| Browse | Collection pages clean and well-built; filters and sort present | Low |
| Evaluate | 70 variants, ~2,100 chars of copy, no reviews, no certification | High |
| Add to cart | Ghost-styled button; no sticky CTA on mobile | High |
| Reassure | Shipping/returns reachable but only from the 883px footer | Medium |

---

## 4. Mobile Responsiveness & Accessibility

**WORKING WELL — Layout integrity at 375px is sound.** No horizontal overflow: `scrollWidth` equals
the 375px viewport exactly, and off-canvas panels are correctly parked off-screen rather than
leaking. Viewport meta properly formed, permits zoom to 5×. Zero overlapping tap-target pairs.

**CRITICAL — Gold accent fails WCAG AA everywhere it is used as a label.**
Gold `#bc973f` on white measures **2.75:1** against a required **4.5:1** — used at 12px, the size
most in need of contrast. Affects every homepage section eyebrow: Solar Grown, Philosophy, Eternity,
Craftsmanship, Rarity, Heritage.
*Fix:* darken label gold to ~`#7a6129` (≈4.6:1) for small text; keep brighter gold for large display
type and non-text ornament only.

**HIGH — 32 touch targets below the 44×44 minimum** (measured at 375px).
Footer is the main offender — every link there (Sizing, Returns, Shipping, Privacy Policy, Terms,
both email addresses, both phone numbers) is **20px tall**. Social icons are **18×18**, cart link
39×50, newsletter consent checkbox 13×13, skip link 24px. Hero CTAs sit exactly on the 44px line —
passes, but no margin.
*Fix:* add vertical padding to footer anchors to reach a 44px hit area; visual type size need not
change.

**HIGH — Thirteen homepage images carry an empty alt attribute.**
No image is missing `alt` outright, but 13 of 19 are `alt=""`, declaring them purely decorative.
Several are the hero and section images carrying the actual editorial meaning of the page. A
screen-reader user gets the headline and nothing else. Product and collection templates have genuine
descriptive alt text ("Katarina Engagement Ring") — again a homepage-specific gap.

**MEDIUM — Unlabelled controls and long mobile scroll.** Two icon-only buttons expose no accessible
name; two links resolve to `href="#"`. Body copy is Inter 300 at 16px — passes contrast at ~8:1 but
thinner than ideal for extended phone reading. Six text runs fall below 14px. Homepage is
**7,345 px** of mobile scroll before the footer.

---

## 5. Priority Action Plan

Ranked by impact per hour. First three are SEO/Performance; last two are UX/Design. All five are
achievable inside a single sprint on the draft theme.

### 1. Resize and re-format every homepage image through the Shopify CDN
**SEO / Performance · ~2 hours**
Append `width` and `format=webp` params, emit `srcset` for tile and hero sections, set
`loading="lazy"` on the 17 currently-eager images. The collection template already does this
correctly — lift the markup directly.
**Expected result:** homepage payload falls from 3.58 MB toward ~0.9 MB. Worst asset drops from
1.22 MB to 27.6 KB. Largest available Core Web Vitals gain on the site by a wide margin.

### 2. Write a real homepage title and fix the H1 structure
**SEO · ~30 minutes**
Replace the 17-char brand-only title with a keyword-bearing one, extend meta description to ~155
chars, promote a single hero to H1 and demote the other three to H2. While in the template, add an
H1 to Halo collection, Diamonds and About Us pages, and remove the duplicate on About Diamonds.
**Expected result:** homepage becomes eligible to rank for category terms it currently cannot
compete for at all. Highest impact-to-effort ratio in this list.

### 3. Resolve tag-page duplicate content and strip the "– Tag" suffix
**SEO · ~1 hour**
Point tag-filtered collection views at the parent canonical, or give each a unique title/H1/
description. Remove the literal "– Tag" string from the title template. Then archive the published
$0.00 `/products/micro` page, which also repairs the "$0.00 — $35,630.00" price filter on Engagement
Rings.
**Expected result:** consolidated ranking signals on wedding-band and fine-jewellery terms, cleaner
SERP snippets.

### 4. Surface the catalogue in navigation and fix broken category links
**UX · ~3 hours**
Promote ENGAGEMENT RINGS, WEDDING BANDS, FINE JEWELRY to top-level header items instead of hiding
all 151 products behind "BROWSE". Rebuild the mega-menu trigger as a `<button>` with `aria-expanded`
rather than `href="#"`. Repoint the Fine Jewelry **RINGS** link so it stops redirecting to the
unfiltered parent, and merge the duplicate NECKLACES / PENDANTS entries.
**Expected result:** shorter path to product for every visitor, stronger internal anchor text,
keyboard-accessible menu.

### 5. Establish a CTA hierarchy and fix the gold contrast
**Design / Accessibility · ~2 hours**
Make Add to Cart a filled navy button (currently ghost-styled) and add a sticky mobile variant.
Introduce one filled primary per viewport on the homepage; leave the rest outline. Same pass: darken
small-text gold from `#bc973f` (2.75:1, failing) to ~`#7a6129`, and pad footer links to a 44px hit
area.
**Expected result:** clear visual path to conversion, plus WCAG AA compliance on the two most
widespread accessibility failures.

---

## Note before applying any of this

The live theme reported by the server is **`189476995362`**, which is **not** the WEB 11 draft
(`189332062498`) recorded in earlier working notes — a newer theme has been published since. Confirm
which copy is current before editing, so these fixes don't land on a theme that has already been
superseded.

---

*Evidence gathered from rendered DOM, computed styles, Resource Timing, response headers and the
public products/collections JSON endpoints. Contrast ratios calculated per WCAG 2.1 relative
luminance; touch targets measured at a 375×812 viewport; payload figures from a cold load at a
1280×800 viewport. Screenshots were unavailable in this session — design assessment is built from
computed styles and measured geometry rather than visual inspection.*
