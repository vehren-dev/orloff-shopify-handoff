# Charm line theme changes

Last updated **1 Aug 2026, evening**. Replaces the earlier 1 Aug version.

---

## Where things live

| | Theme | Status |
|---|---|---|
| WEB 14 | **MAIN (live)** | an early, thin `product.charm.json` and `collection.charms.json` only |
| WEB 15 | unpublished, id `189575168290` | all the real charm work |

**Nothing described here is live.** It goes live when WEB 15 is published.

Preview by appending `?preview_theme_id=189575168290` to any URL:

    https://orloffofdenmark.com/collections/all-charms?preview_theme_id=189575168290
    https://orloffofdenmark.com/products/snake-chain-bracelet?preview_theme_id=189575168290

---

## 1. Add-a-bracelet pop-up

| File | What it is |
|---|---|
| `snippets/charm-bracelet-prompt.liquid` | markup, styles, behaviour |
| `sections/charm-bracelet-prompt.liquid` | thin wrapper so it can sit in the footer group |
| `sections/footer-group.json` | edited to include it, so it renders on every page |

When a bracelet is added to the cart, a panel offers the charms.

**Changed 1 Aug, by request:**

- **Fires on every bracelet add.** The once-per-session `sessionStorage` guard is
  gone.
- **One button**, "Browse all charms" → `/collections/all-charms`. The
  "Build your bracelet" button was removed because the builder is parked.

Guards still in place and still verified: only `product_type = Bracelet`, and
never on a multi-item add, so the collection tray's own add does not trigger it.

It works by wrapping `fetch` and `XMLHttpRequest`, so it catches the theme's own
add-to-cart path rather than depending on theme internals.

Two robustness fixes went in with the every-time change, both only reachable now
that it can re-fire:

- A re-fire while the panel is closing cancels the pending hide. Without it, the
  old 400ms timeout landed after the new show and hid the panel again.
- Applying the open state no longer depends on a single `requestAnimationFrame`.
  A `wantOpen` flag plus a short timeout backs it up, both idempotent.

Verified live: three consecutive adds, each opened and closed cleanly.

**Copy is a first draft.** Rewrite in house voice before publishing.

---

## 2. Charm collection rail — new

| File | What it is |
|---|---|
| `sections/charm-collection.liquid` | markup, theme-editor settings |
| `assets/charm-collection.js` | loader, colour derivation, filters, tray |
| `assets/charm-collection.css` | styling |
| `templates/collection.charms.json` | edited to use it |

Product grid on the left in the wide column, sticky rail on the right at 320px.
The rail is **Refine** (metal swatches, colour swatches, price chips, clear all)
stacked above **Your selection** (running list, total, one add-to-cart).

Scoped to whatever collection it renders in, so the same section serves **all 11
charm collections** — they all use `templateSuffix: charms`.

### It replaces the native product grid

`main-collection-product-grid` was removed from the template's `order`. That also
removes the 14-page pagination — all 270 load at once and filter in place.

**To put the native grid back**, restore this into `templates/collection.charms.json`
under `sections`, and swap `charm-collection` for it in `order`:

```json
"main-collection-product-grid": {
  "type": "main-collection-product-grid",
  "custom_css": [
    "h3 {font-weight: 500 !important; letter-spacing: 0.1em; font-size: 16.5px; text-transform: uppercase;}",
    "span {font-weight: 400; letter-spacing: 0.1em; font-size: 14.5px;}",
    ".add_to_cart_button {font-weight: 400; text-transform: uppercase; font-size: 15px;}",
    ".badge {background: #ff00; color: #091b36; border-color: #091b36 !important;}",
    "product-card img {object-fit: contain;}"
  ],
  "settings": {
    "collection_product_count": 20,
    "pagination_type": "paginated",
    "collection_layout": "style1",
    "collection_grid_num": 5,
    "enable_filtering": true,
    "enable_sorting": true,
    "show_counts": true
  }
}
```

### Interaction

**Card click goes to the product page.** A separate `+` button in the corner adds
to the tray. The builder hijacks the primary click, which is right for a builder
and wrong for a collection page where people expect a link.

The tray adds everything in one `/cart/add.js` call with an `items` array, then
redirects to `/cart`.

### Verified live on /collections/all-charms

- 270 cards render, no console errors
- Pink 42, Blue 40, Pink+Blue 99 — OR within colour
- Oxidized 140, Oxidized + $29 = 75 — AND across colour and price
- Clear all returns to 270
- Tray add, untoggle, remove and running total all correct
- Real add-to-cart: 2 charms, $88, landed correctly, cart then cleared
- Layout measured at 1280px: grid left at 802px, rail right at 320px

---

## 3. Bracelet builder — parked, not deleted

`/pages/charm-builder`. Still on WEB 15, still working, not linked from anywhere.
The Shopify page exists and is published; on WEB 14 it renders as an empty default
page, so nobody will find it before WEB 15 goes live.

Files: `sections/charm-builder.liquid`, `assets/charm-builder.js`,
`assets/charm-builder.css`, `templates/page.charm-builder.json`.

Pick a chain, pick a clasp and length, click charms to thread them on, one
add-to-cart. Verified 1 Aug against live data: all 270 charms load, Zodiac filter
returns 12, and `PEACE / Flower / 21cm` is correctly disabled because that variant
does not exist.

---

## Colour has no tags behind it

**No product carries a colour tag.** The filter works anyway — colour is derived
client-side in `charm-collection.js` from each product's title, description and
tags, using keyword rules documented at the top of that file.

That was the deliberate trade: it works today with zero product writes. When real
tags are written the rules can be swapped for a straight tag read and the markup
does not change. Real tags would also drive Shopify's native
`/collections/all-charms/colour-pink` URLs, which the derivation cannot.

**Check before this drives paid traffic:**

1. **The pink bucket looks large** — 42 live, against 21 from the 31 Jul scan of
   `orloff-charm-line-a-master.csv`. Different corpora and slightly different
   rules, but a 2x gap deserves a spot check.
2. **The heuristic over-matches by design.** "Silver heart with a red ribbon"
   tags as both Silver and Red.

Swatches shown: Silver, Oxidized, Rose gold, Gold, Pink, Red, Blue, Green,
Purple, Yellow, White, Black, Multicolour.

**Orange is hidden** (4 products). **Navy was dropped** entirely — it matched
nothing, and it is folded into the Blue rule.

Change this in the theme editor: the section has a **"Swatches to hide"** setting
taking a comma-separated list of keys. A swatch also hides itself automatically
when nothing in that collection matches it, so narrow collections stay tidy
without configuration.

---

## Still outstanding from the 1 Aug audit

Unchanged by this work, and all of it still blocks a clean launch:

1. **Internal build notes are live on public product pages.** Roughly 25–35
   expected across 272. Confirmed still present on `love-charm-red-enamel` and
   `fox-charm-rose-gold`.
2. **Charms is not in the main menu.** Nothing here fixes that, and it gates
   everything else.
3. The 16 watermarked images on 9 products.
4. **Both bracelets still titled in CAPS** — `SPARKLE - SNAKE CHAIN` and
   `PEACE - SNAKE CHAIN`, confirmed today. The SEO title reads correctly, but the
   product title is what appears in cart, checkout and order emails.
5. One photo per charm on 263 of 270.
6. Zodiac and Birthstone still sorted alphabetically.

---

## Note for whoever tests this next

Do not measure UI timing in a browser whose window is not displayed. Timers clamp
by roughly 7x and `requestAnimationFrame` may not fire at all, so a working modal
reads as broken. A 150ms `setTimeout` measured ~1000ms on 1 Aug and produced three
rounds of false failures on a pop-up that was working the whole time. Trace state
across a window rather than sampling once.
