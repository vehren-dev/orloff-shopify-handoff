# ORLOFF OF DENMARK — FULL THEME CODE AUDIT (WEB 10)
**Date:** July 23, 2026
**Scope:** Complete source review of the live theme "WEB 10" (gid://shopify/OnlineStoreTheme/189298409762), ~390 files pulled via the Shopify Admin API: layout, all key sections/snippets, templates JSON, config, locales, and the custom ring-configurator + Nivoda integrations. Companion to the live-site audit of July 22 (orloff-website-audit-2026-07-22.md) — this confirms most of its findings at source level and pinpoints exactly where each fix lives.

---

## 1. ACTUAL BUGS (broken today, fix first)

### 1.1 Swedish locale ships broken links and embarrassing translations — `locales/sv.json`
The worst code-level finding. Three separate problems:
- **Mangled HTML in translations.** Several `_html` keys were machine-translated *including their Liquid tags*, which got URL-encoded into garbage:
  `"shipping_policy_html": "<a href=\"&lt;span%20class='notranslate'&gt;{{%20link%20}}&lt;/span&gt;\">Frakt</a>..."`
  On Swedish product and cart pages, the "Shipping" and "terms" links render with a literally broken `href`. Affected keys: `shipping_policy_html`, `taxes_and_shipping_policy_at_checkout_html`, `taxes_included_and_shipping_policy_html`, `terms_html`.
- **Wrong-word translations a Swede spots instantly:** checkout button = **"Kolla upp"** ("look into it"; should be "Till kassan"), filter clear = **"Klar"** ("done"; should be "Rensa"), cart = "Vagn" (should be "Varukorg", which *is* used elsewhere — inconsistent), "Snabbbutik", "Utsåld" (→ "Slutsåld"), "affär" lowercase.
- **~25% of keys missing** (8.3KB vs 11.1KB in en.default.json) → those strings silently fall back to English, so /sv/ pages render mixed-language.
**Fix:** either translate properly (human pass over sv.json, restore `{{ link }}` interpolations) or unpublish Swedish until it's ready. Given the July 22 finding that /sv/ is indexed with no hreflang, the fastest clean state is: fix Markets config first, then decide if Swedish is a real market. Note: **no Danish locale exists** despite the brand being "of Denmark".

### 1.2 Missing `| t` filter — `snippets/product-add-to-cart.liquid`
`{{ 'products.product.pickup_availability.unavailable' }}` (in the pickup-availability `<template>`) is missing the translate filter, so the raw key string is output. One-word fix: add `| t`.

### 1.3 Mismatched custom-element tag — `snippets/facets.liquid`
Opens `<facet-filters-form class="facets">` but closes with `</facets-filters-form>` (extra "s"). The element is never properly closed; the browser error-corrects unpredictably. Combined with **theme setting `border_color: #ffffff` on a white background** (invisible input borders), this is almost certainly the "garbled price filter" from the live audit. Fix the closing tag and set a visible border color.

### 1.4 Image alt text leaks variant-set codes — `snippets/responsive-image.liquid`
The theme's image-set convention stores grouping data in alt text (`description#metal_gold`). `responsive-image.liquid` outputs `image.alt` verbatim, so every grouped gallery image gets alt="…#metal_14k-yellow-gold" — junk for screen readers and Google Images. Fix in one place: `alt="{{ image.alt | split: '#' | first | escape }}"` (with fallback to `product.title` when blank).

### 1.5 Hardcoded `/search` action — `snippets/mobile-menu.liquid`
The mobile search form uses `action="/search"` instead of `{{ routes.search_url }}`, so on any non-default locale the search posts to the English locale. Same class of issue: `fetch('/cart/add')` hardcoded throughout `assets/ring-configurator.js` (works today because carts are shared, but locale-unaware), and all configurator UI strings are hardcoded English.

### 1.6 Stale header height mismatch — `sections/header-group.json` custom CSS
Custom CSS forces `.header {height: 130px}` and `.logoimg {width:100px; height:100px}` (forces the logo square) while the CSS variable `--header-height` in `snippets/head-variables.liquid` remains 75px. Anything computed off that variable (sticky offsets, anchor scroll, drawer positioning) is off by 55px. Align the variable or drop the override.

---

## 2. THE JULY 22 PRIORITIES — WHERE THEY ACTUALLY LIVE IN CODE

### 2.1 Sticky mobile add-to-cart: it already exists — for configurator products only
`snippets/ring-configurator.liquid` (and siblings) render a full sticky bottom bar (`.rc-sticky-bar`: name, config summary, price, ATC). One-of-a-kind and standard products (the FUCHSIA CROWN case) get nothing because they don't match the configurator tag gates. **Cheapest correct fix:** extract that bar into a small shared snippet rendered from `sections/main-product.liquid` for non-configurator products, syncing with the existing `product-form` element. The CSS already exists in `assets/ring-configurator.css`.

### 2.2 The "duplicate currency" JS hack has a one-checkbox root cause
`config/settings_data.json` has `currency_code_enabled: false`. Instead of flipping it, someone added an inline script in `main-product.liquid` that DOM-injects the ISO code after the price, plus a second hardcoded `rc-price-display` block in `product-information.liquid` (with untranslated "SKU:") for tagged products. **Fix:** set `currency_code_enabled: true`, delete the injection script, delete or translate the `rc-price-display` block. Also delete the sibling scripts that (a) force the gallery column height to the info column on load (fragile, no resize handling — can crop the gallery) and (b) DOM-relocate the SKU node.

### 2.3 Certification block: zero new code needed
`sections/main-product.liquid` already supports `collapsible_tab`, `side_panel` (Materials / Shipping & Returns / Care Guide with icons), `custom_liquid`, `shipping_estimator`, and `complementary` blocks — **none are used** in `templates/product.json` or `product.exclusive.json`. The entire "Certification & Craft" block from the July 22 audit can be built in the theme editor with existing blocks + metafields. While in there: default template has `product_image_feature: ""` — **no lightbox/zoom on standard product pages**. A jewelry PDP without zoom. Set it to "lightbox" (product.exclusive.json already has it).

### 2.4 Homepage H1s: pure editor settings
`templates/index.json` has four sections with `heading_size: "h1"` (Solar Grown, Engagement, Wedding, One of a Kind). Change three of them to h2 in the editor. Additional homepage code findings:
- The "Fine Jewelry" grid is a raw-HTML `custom-liquid` section: plain `<img>` tags with no srcset/lazy-loading (fixed 2000px-class CDN images), fine alt text, but links point to tag-filter URLs (see section 3).
- Identical `.btn` custom CSS pasted into six sections; `'Cormorant Garamond'` referenced in three places (homepage custom liquid, cart drawer) but the loaded theme font is **Cormorant** — the fallback silently kicks in.
- **No product or featured-collection section exists on the homepage at all** — it's banners end to end. For CRO, at least one product rail (e.g., latest one-of-a-kind pieces) is standard practice.
- One-of-a-kind collection template (`collection.one-of-a-kinds.json`) disables `main-collection-banner`, hiding the real `<h1>` and the collection description (SEO text) in favor of a slideshow heading.

### 2.5 hreflang: the theme never outputs it
`layout/theme.liquid` has canonical + meta description but no hreflang loop, and there's no `{{ localization }}`-driven alternate output anywhere. Combined with the July 22 finding (Shopify isn't auto-emitting it either), the Markets/language publication state is the root cause. Fix in Admin → Settings → Markets/Languages first; if Shopify still doesn't emit hreflang, add the standard loop to theme.liquid head using `localization.available_languages` + `request.origin`.

---

## 3. SEO & STRUCTURED DATA (code level)

- **Product JSON-LD exists** (`{{ product | structured_data }}` in main-product.liquid) — good.
- **Organization JSON-LD** (header.liquid): `sameAs` emits `null` entries for every unset social network (only Facebook/Instagram are set); `url` is set to the *current page*, not the homepage. Minor cleanups.
- **No BreadcrumbList JSON-LD** — `snippets/breadcrumbs.liquid` is presentation-only, and its trail is thin: on product pages the collection only appears if the visitor arrived via a `/collections/...` URL.
- **No ItemList/CollectionPage schema** on collection pages (confirms July 22).
- **og:image** uses `http:` prefix variant (legacy but harmless); social-meta-tags otherwise fine.
- **Footer + homepage internal links point to tag-filter URLs** (`/collections/fine-jewelry/rings`, `/collections/fine-jewelry/necklaces+pendants`). These canonicalize to the parent collection, so the site's most repeated internal links pass no signal to a dedicated Rings/Earrings page (none exists). Create real sub-collections and point the links there.
- Title tag logic in theme.liquid is fine — the title problems from July 22 are content (product titles/handles), not template.
- robots: no robots.txt.liquid override (Shopify default — fine).

## 4. PERFORMANCE (code level)

1. **`vendor.min.js` (223KB) loads synchronously in `<head>`** (`layout/theme.liquid`) — the single biggest render-blocker, and it's also `<link rel="preload">`ed, doubling down on priority. Move to `defer`.
2. `product.min.js` (36KB), `nouislider.min.js` (89KB — collection pages), `facets.min.js`, `collapsible-row.min.js`, `header.min.js`, `app.min.js`, `quantity-input.min.js` — all synchronous `script_tag`s. Everything except maybe app.min.js can defer.
3. **All images depend on lazysizes** (`data-src`/`data-srcset`, no `<noscript>`), and the eager/LCP image ships `src` = 20px placeholder with a srcset but **no valid `sizes` attribute** (`data-sizes="auto"` only works after lazysizes runs) → browser over-downloads at 100vw assumptions.
4. `assets/ring-configurator.js` is 101KB **unminified** and contains ~6 near-duplicate configurator implementations. Dedupe into one parameterized module or at least minify (defer already present — good).
5. Homepage custom-liquid `<img>` tags: no srcset/lazy-loading/dimensions → CLS + oversized downloads.
6. Google Fonts loaded externally inside `sections/nivoda-diamond-search.liquid` (also a GDPR consideration for EU visitors) while the rest of the site uses Shopify-hosted fonts.

## 5. THEME HYGIENE / MAINTAINABILITY

- **Dead files to delete:** 12+ `*-hulkapps-backup.*` files, `snippets/earring-configurator.liquid` (0 bytes but still rendered in product-information.liquid — remove the render too), 6 demo homepage templates (`index.books/greige/juice/north/pagefold/primrose`, ~90KB), `sections/cart-bubble-hulkapps-backup.liquid`, redundant OOAK collection templates (4 variants: `one-of-a-kind-2`, `one-of-a-kind-silver`, `one-of-a-kinds`, `oneofakind`), `collection.eternity-2/-3`, `collection.earrings-2`.
- **`settings_data.json → custom_html_head` is a global CSS dump zone** including `h2 { width: 70%; margin: auto; text-align: center; }` — a site-wide h2 override that squeezes every heading on every page (collection cards, footer, drawers). Move intentional rules into app.css/section CSS with proper scoping; kill the global h2 rule.
- **Styling by hardcoded hex everywhere** (#091b36, #b08d57 duplicated across footer.liquid inline styles, cart-drawer.liquid 200-line style block, six homepage custom_css copies) instead of the theme's CSS variables. Works, but every rebrand tweak now requires hunting ~10 files.
- Announcement bar holds stale "website under reconstruction" text (disabled, but delete it).
- `product-badge.liquid` hardcodes inline `position:absolute; top:4px; left:4px`, making the `badge_position` theme setting a no-op.
- Body font weight is `inter_n3` (300) — very light for long text; readability/contrast check worth doing, especially at 12–13px sizes used in footer/cart CSS.
- Configurator architecture notes: tag-based routing (`engagement-ring` + `solitaire` etc.) across 15 snippets rendered on every PDP — functional (each is gated), but brittle; sibling products linked by handle string-replace (`-natural` ↔ `-lab-grown`); ring-size `<select>` uses `<optgroup label="────">` as visual separators (screen-reader noise); validation uses `alert()` (crude for the brand, English-only); size table duplicated between `ring-configurator.liquid` and `size-selector.liquid`.
- Footer brand copy says "designed and crafted in Denmark since 1995" while the About story centers the Hua Hin workshop — decide one narrative.

## 6. SECURITY / ARCHITECTURE — GOOD NEWS

- **Nivoda diamond search calls a Cloudflare Worker proxy** (`orloff-nivoda-proxy.orloffofdenmark.workers.dev`) — no API credentials in the theme, no client-side price math. Correct design. (Verify the Worker itself rate-limits and doesn't echo the upstream key, but the theme side is clean.)
- Cart, forms, and localization forms use standard Shopify patterns; nothing dangerous found in custom code.
- Placeholder images for diamonds come from `placehold.co` — external runtime dependency; consider a self-hosted placeholder.

---

## PRIORITIZED ACTION PLAN

**Same-day (bugs, minutes each):**
1. Fix `</facets-filters-form>` typo + set visible `border_color` (fixes the broken-looking filter).
2. Add `| t` to the pickup-availability string.
3. Alt-text fix in `responsive-image.liquid` (`split: '#' | first`, fallback to product title).
4. `routes.search_url` in mobile-menu; set 3 of 4 homepage headings to h2.
5. Enable `currency_code_enabled`, delete the three inline DOM-hack scripts in main-product.liquid + the rc-price-display duplicate.
6. Delete backup/demo/dead files and the stale announcement text.

**This week (high-value, small effort):**
7. Generalize the existing `rc-sticky-bar` into a sticky ATC for non-configurator PDPs (mobile especially).
8. Turn on `product_image_feature: "lightbox"` in product.json; add certification/shipping/care blocks (side_panel + collapsible_tab + metafields) per July 22 plan.
9. Defer `vendor.min.js` and the other sync scripts; measure with Lighthouse before/after.
10. Swedish: fix Markets/hreflang first, then either properly translate sv.json (restore `{{ link }}` in the four broken `_html` keys, fix "Kolla upp" → "Till kassan" etc.) or unpublish SV. Add Danish if Denmark is a real market.
11. Re-enable the collection banner (real H1 + description) on the one-of-a-kind template, or move the H1 into the slideshow properly.

**This month (structural):**
12. Create real sub-collections (Rings/Earrings/Necklaces/Bracelets under Fine Jewelry) and repoint footer + homepage links away from tag-filter URLs.
13. Consolidate the 6 duplicated configurator implementations in ring-configurator.js; minify; replace alert() validation with inline messages; translate configurator strings via locale keys.
14. Migrate the custom_html_head CSS dump and per-section custom_css into the stylesheet with scoped selectors; remove the global h2 rule.
15. Add BreadcrumbList + ItemList JSON-LD; clean Organization sameAs nulls.
16. Rebuild the homepage "Fine Jewelry" custom-liquid section as a proper section with responsive images, and add at least one product rail to the homepage.
