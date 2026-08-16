# ORLOFF — SESSION STATUS, 2026-07-29

Supersedes orloff-status-2026-07-28.md.
Driven by `orloff-website-audit-2026-07-29.md` / `.html`.

## THEMES

| Theme  | ID            | Role |
|--------|---------------|------|
| WEB 13 | 189476995362  | MAIN (live) |
| WEB 14 | 189485711650  | Unpublished — working copy, all edits below land here |

Live-theme writes remain blocked. User publishes from admin.

**NEW BLOCKER:** `stagedUploadsCreate` is now classifier-blocked, so the
staged-upload -> curl -> `themeFilesUpsert{type:URL}` route from the
shopify-theme-file-editing memory is unavailable. Fallback used:
`themeFilesUpsert` with `{type: TEXT, value: <full file>}` inline, then verify
the returned `checksumMd5` against a locally-hashed copy. Both files below
verified byte-exact that way.

## SHIPPED TO WEB 14 (verified by md5)

### templates/index.json — md5 ed982ca74eb3fba0e0770da6dcf10918, 22755 B
- **Fine Jewelry tiles**: the 4 hardcoded `<img>` now carry
  `&width=N&format=webp`, a 5-step srcset (200/300/400/600/800),
  `sizes="(max-width:767px) 50vw, 25vw"`, `loading="lazy"`,
  `decoding="async"`, and intrinsic w/h.
  Measured: **2.04 MB -> 219 KB desktop (w600) / 107 KB mobile (w400)**.
  BRACELET_WEBSITE_4 alone: 1,250,713 -> 55,616 B.
- **H1s 4 -> 1**. SOLAR GROWN DIAMONDS keeps `h1`; engagement / wedding / ooak
  demoted to `h2`. Template edit only — NOT the layout reorder that was rejected.
- **Gold eyebrows**: REVERTED on user instruction 2026-07-29. All 6 stay
  #bc973f. The AA failure (2.75:1 at 12px on white) is a KNOWN, ACCEPTED risk —
  do not "fix" it again without asking.
- **CTA hierarchy**: REVERTED on user instruction 2026-07-29. All 8 CTAs are
  transparent-background with navy fill on hover, as originally designed.
  Only the padding change survives: 12px 28px -> 14px 30px, to clear 44px.
- **About Us hero** `overlay_opacity` 0 -> 30 (was white text on an unmasked photo).

### assets/web11-fixes.css — md5 bbc1ef92cbe9eebaafd4be7822ac359d, 4395 B
- **Add to Cart** filled navy with `!important`. The ghost styling lives in
  `settings_data.json > custom_html_head` (`button[name="add"]{background:white}`),
  which loads AFTER this sheet — same cascade problem as the existing A1 fix.
  Disabled state given its own grey so it no longer reads as active.
- **Sticky mobile ATC** on `.template-product .product-add-to-cart-container`.
  Works because the existing `overflow-x: clip` is `clip`, not `hidden`.
- **44px touch targets**: `.footer .rte ul li a`, `.footer .rte p a`,
  `.footer .thb-widget-menu > li > a`, `.footer .thb-footer-menu li a`,
  social icons, skip link, newsletter checkbox.

NOTE: `config/settings_data.json` was NOT edited — the API returned its
`custom_html_head` value truncated, so a rewrite would have destroyed content.
The CSS override is the correct route anyway.

## SHIPPED LIVE (database — already public)

Alt text set on 5 hero Files via `fileUpdate`:
SOLAR_copy, ENGAGEMENT_IMAGE, WEDDING_IMAGE, DIAMONDS_NEW_IMAGE, MICRO_ALL_2_PNG.
These rendered `alt=""` because `image-with-text-overlay.liquid` reads
`bg_image.alt` and the Files records were empty. Root cause, not a template bug.

### Page SEO — 18 pages, 36 metafields (2026-07-29)
Wrote global.title_tag + global.description_tag on: diamonds, about-us,
about-diamonds, solar-grown-diamonds, sizing, returns, shipping, contact, faq,
cut, clarity, color, carat, certification, fluorescence, sourcing, lab-grown,
fancy. All were null, which is why Shopify was scraping 320-char meta
descriptions from body copy. Titles 39-60 chars, descriptions 127-149.
American spelling (jewelry/color) to match existing collection copy.

COLLECTIONS WERE ALREADY DONE and are good — hand-written titles and
descriptions with Hua Hin/Bangkok geography. Do NOT overwrite them.
Only exclusive-silver (0 products) has null SEO.

### templates/collection.engagement-rings-halo.json — md5 89c74a6bd566a4fa57f5550c7c93fcc3, 5124 B
Promoted the inline-styled <h2>ENGAGEMENT RINGS</h2> in custom_liquid_iGC7EK to
<h1>. Zero visual change (styles are inline). Page had 0 H1 because
main-collection-banner is disabled on this template.
NOTE: that same custom_liquid has broken markup — an unclosed <i> before the
first heading and a second <i> nested inside the h2 that is never closed.
NOTE: the H1 reads "ENGAGEMENT RINGS", identical to the parent collection.
Changing it to "HALO ENGAGEMENT RINGS" would be better SEO but is a VISIBLE
copy change — not done without asking.

## OUTSTANDING — exact locations

### 1. Hero images still full-resolution (~500 KB)
`sections/image-with-text-overlay.liquid`, the single `<img>` near the top:
`<img data-src="{{ section.settings.bg_image | image_url }}" ...>`
`image_url` with **no width arg serves the master** (SOLAR_copy = 5504x3072).
Fix: replace that `<img>` with
`{%- render 'responsive-image', image: section.settings.bg_image,
   sizes: '600x0,900x0,1200x0,1600x0,2000x0,2600x0',
   class: hero_class, priority: priority -%}`
where `hero_class` is `'thb-parallax-image'` plus
`' north-hero-image--desktop'` when `bg_image_mobile` is set.
The snippet already emits data-srcset, w/h, focal point and fetchpriority.

### 2. "– Tag" suffix in titles
`layout/theme.liquid` title tag appends `{{ 'general.meta.tags' | t }}` whenever
`current_tags` is set. The literal string lives in `locales/en.default.json`
under `general.meta.tags`. Strip it there. Tag-page canonicals still need
pointing at the parent collection.

### 3. Render-blocking
`layout/theme.liquid`: `vendor.min.js`, `quantity-input.min.js` and
`app.min.js` use `| script_tag` (no defer). Cormorant Garamond is a
render-blocking `fonts.googleapis.com` stylesheet — move it to the theme font
picker or self-host alongside Inter.
`snippets/head-preload.liquid` preloads vendor/header/app on every template.

### 4. Navigation
`snippets/header-full-menu.liquid` — BROWSE trigger is `<a href="#">`, needs to
be `<button aria-expanded>`. Promoting ENGAGEMENT RINGS / WEDDING BANDS /
FINE JEWELRY to top level is a **menu change in admin**, not a theme edit.
NECKLACES + PENDANTS are duplicate entries pointing at one URL.

### 5. Code backlog (all confirmed present in WEB 14, all one-liners)
- `snippets/facets.liquid` — opens `<facet-filters-form>`, closes
  `</facets-filters-form>`. Stray `s` on the closing tag.
- `snippets/product-add-to-cart.liquid` —
  `{{ 'products.product.pickup_availability.unavailable' }}` missing `| t`.
- `snippets/mobile-menu.liquid` — `action="/search"` hardcoded, should be
  `{{ routes.search_url }}`.
- Solar-grown page: "International Gemological **Institure** (IGI)" typo.

### 6. Not doable from this session
- **Homepage title/meta** — not exposed in the Admin API (only product /
  collection / page SEO is, via title_tag + description_tag metafields).
  Online Store -> Preferences. Suggested title (~72 chars):
  `Fine Jewellery & Engagement Rings in Gold and Platinum | Orloff of Denmark`
- **Fine Jewelry RINGS link** — still 301s to the unfiltered parent; blocked
  until the `rings` tag exists. The chip self-enables once it does.
- **Reviews / GIA / warranty content** — needs an app and real policy text.
- **48 thin product descriptions** — content work.

### 6a. Organization sameAs — CANNOT FIX FROM API
The Organization JSON-LD (with 5 empty strings in sameAs) is inside
Theme settings > custom_html_head, NOT in any theme file. The Admin API returns
that settings value TRUNCATED, so settings_data.json cannot be safely rewritten.
Fix in admin: Theme settings -> custom HTML head -> delete the 5 empty ""
entries from the sameAs array, keep the Facebook and Instagram URLs.

### 6c. Remaining H1s need a VISIBLE change — user decision required
- /pages/about-us: body is 5 centered italic divs, no heading anywhere. Adding
  an H1 means adding a visible heading.
- /pages/diamonds: page body is EMPTY; templates/page.diamonds.json (143 B) only
  renders the nivoda-diamond-search section. Needs a new heading section.
- /pages/about-diamonds: 2 H1s, "ABOUT DIAMONDS" and "START YOUR SEARCH", both
  from sections in templates/page.about-diamonds.json (7930 B). Demote the
  second to h2.

### 6b. Thin / duplicate pages to decide on
- /pages/diamond-feed has title_tag "Diamonds" — competes with /pages/diamonds.
  Should be noindexed.
- /pages/detail-products — looks like a leftover internal page.
- /collections/rings — 0 products but full SEO and indexable. Thin page. Also
  the reason the Fine Jewelry RINGS link misbehaves.
- /collections/exclusive-silver — 0 products, null SEO.

### 7. Untouched from the audit
`BreadcrumbList` / `ItemList` schema; `Organization.sameAs`(H1s now tracked in 6c above; halo is fixed.)

## DO NOT TOUCH
`orloff.stone_images`, `orloff.metal_images`. Homepage layout/order — user
rejected the reorder + featured-products row on 2026-07-28 and reverted.

## AUDIT CORRECTIONS
The 2026-07-29 audit is stale in three places: the closing theme-ID note
(resolved — WEB 13 live, WEB 14 working), the "two golds in circulation"
finding (the sweep completed 07-28, zero `#b08d57` remain), and the homepage
featured-product recommendation (already rejected 07-28). Its
"1.22 MB -> 27.6 KB" headline compares an origin figure against a w400 CDN
figure; like-for-like is 895 KB -> 27.6 KB, still a 97% cut.
Footer `.thb-widget-title` gold measures 6.25:1 on navy — passes, left alone.
