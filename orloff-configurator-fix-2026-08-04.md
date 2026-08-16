# Engagement ring configurator — two live bugs, 4 Aug 2026

**STATUS: all three fixed on WEB 15 (unpublished) on 4 Aug 2026, verified.
Not yet on WEB 14 (live) — publishing WEB 15 is the remaining step, and that
is a human action.**

Files changed on WEB 15:

| File | Change |
|---|---|
| `snippets/ring-configurator-halo.liquid` | carat `id`, alias shim, size typo |
| `snippets/ring-configurator-sidestone.liquid` | carat `id`, alias shim |
| `snippets/ring-configurator-selma.liquid` | carat `id`, alias shim |
| `snippets/ring-configurator.liquid` (solitaire) | alias shim |
| `snippets/ring-configurator-threestone.liquid` | alias shim |
| `assets/web11-fixes.css` | mobile image-with-text block |

The alias shim went into the five snippets rather than
`assets/ring-configurator.js`, because it has to run after the inline script
that builds `ORLOFF_VARIANT_MAP` and before the deferred configurator — putting
it in the same inline block guarantees that ordering and avoids rewriting a
100 KB asset. `ring-configurator.js` itself is untouched.

Verified on the WEB 15 preview: carat buttons live on halo, side-stone and
Selma; every style and both origins resolve a real variant id; the ids and
prices match the Admin API on the `-LG` and `-NAT` branches
(`KARIN-PT-P-030-LG` $2,040, `KARIN-14YG-S-050-NAT` $3,100,
`KARIN-18WG-S-100-NAT` $8,060); About Us shows 100% of every image at 375px and
is unchanged at 1280px.

The sections below are the original diagnosis, kept for the record.

---

## Bug 1 — the one you hit: carat buttons dead on HALO and SIDE-STONE

**Symptom.** On every halo and side-stone engagement ring, the Carat Weight
buttons render but do nothing. Clicking them does not change the highlight,
the price or the SKU. Metal, Grade and Origin all work normally.

**Cause.** `assets/ring-configurator.js` builds the carat buttons at runtime:

```js
function buildCaratButtons() {
  const group = document.getElementById("rc-carat-group");
  if (!group) return;        // <-- bails out here
  ...
  btn.addEventListener("click", ...)   // never reached
}
```

The click handlers only exist on buttons this function creates. Three snippets
ship hardcoded carat buttons inside a `<div>` that has **no `id`**, so the
lookup returns null, the function returns early, and nothing is ever wired up.
The buttons you see are inert Liquid markup.

`snippets/ring-configurator.liquid` (solitaire) and
`snippets/ring-configurator-threestone.liquid` have the id and work correctly.

**Affected:** 9 halo + 9 side-stone products, x2 for the natural/lab twins,
plus SELMA which has its own snippet. Solitaire and three-stone are unaffected.

### Fix — one attribute, in three files

In each of:

- `snippets/ring-configurator-halo.liquid`
- `snippets/ring-configurator-sidestone.liquid`
- `snippets/ring-configurator-selma.liquid`

find the block under `<!-- CARAT -->`:

```html
  <div class="rc-group">
    <label class="rc-label">Carat Weight</label>
    <div class="rc-btn-group rc-btn-group--wrap">
      <button class="rc-btn active" data-carat="0.3" type="button">0.30 ct</button>
      ...
    </div>
  </div>
```

and add `id="rc-carat-group"` to the inner div:

```html
    <div class="rc-btn-group rc-btn-group--wrap" id="rc-carat-group">
```

That is the whole fix. Leave the hardcoded buttons where they are — the JS
calls `group.innerHTML = ""` before it rebuilds, so they are wiped and replaced
with the correct list for that specific ring. (If you prefer to match the
solitaire snippet exactly, delete the buttons and leave the div empty. Same
result.)

**Bonus:** this also fixes a second, quieter problem. The hardcoded lists are a
fixed 0.30 / 0.50 / 0.75 / 1.00 / 1.50 for every halo and side-stone ring. The
rebuilt list is read from each ring's own `combo_data`, so a ring will only ever
offer the carat weights it actually has.

### Also in the halo snippet — a typo in the size dropdown

```html
<option value="7.5 / 55.7 O / 17.7">7.5 / 55.7 / O / 17.7</option>
```

The `value` is missing a slash after `55.7`. The label looks right, but that
broken string is what gets written to the order as the Ring Size line-item
property. Change the value to `7.5 / 55.7 / O / 17.7`. Side-stone and Selma are
already correct; halo is the only one with it.

---

## Bug 2 — found while fixing the above. This one is worse.

**Every engagement ring is adding the wrong variant to the cart.**

**Cause.** The 24 Jul SKU de-duplication added `-LG` / `-NAT` suffixes to the
variant SKUs, but the `orloff.combo_data` metafield was never updated to match.
So on every engagement ring page:

- `combo_data` says `KARIN-14YG-S-150`
- the variant map has `KARIN-14YG-S-150-LG`

`updatePrice()` does `variantMap[data.sku]` — that never matches, so
`data-variant-id` on the Add to Cart button is left **empty** on every ring.
I confirmed this: 140 of 140 combo SKUs unmatched on KARIN, and the same on
KATARINA, EMMA, SELMA, ELEANOR and the natural twins. All four styles.

Then `addToCart` swallows it:

```js
function addToCart(variantId, sku, btn) {
  variantId = variantId || (function () {
    var m = window.ORLOFF_VARIANT_MAP || {}, k = Object.keys(m);
    return k.length ? m[k[0]] : null;      // <-- silently grabs the FIRST variant
  })();
```

So instead of failing, it adds **the first variant in the map** — always
14K Yellow Gold / Prestige / smallest carat — while the line-item properties
still say what the customer picked.

**What this costs.** Configure a KARIN in 950 Platinum, Prestige, 1.50 ct.
Page shows `KARIN-PT-P-150`, **$5,730**. What lands in the cart is
`KARIN-14YG-P-030-LG`, **$1,320**. Both figures verified against the Admin API.
The order will read like a platinum 1.5 ct ring and be paid for at the
14K 0.30 ct price. This is live now, on all four styles, and has been since the
24 Jul SKU change.

**Check your orders since 24 July** for engagement rings where the line-item
properties do not match the variant that was charged.

### Fix — 7 lines at the top of `assets/ring-configurator.js`

The metafields are the real problem, but fixing them means rewriting
`combo_data` on ~72 products. This does the same job in one file, and is safe
because a lab product's map only ever contains `-LG` keys and a natural
product's only `-NAT`, so there is nothing to collide with:

```js
/* combo_data SKUs predate the -LG/-NAT suffix added to variant SKUs on
   2026-07-24. Alias the suffixed keys back to their base SKU so
   variantMap[data.sku] resolves. */
(function () {
  var m = window.ORLOFF_VARIANT_MAP;
  if (!m) return;
  Object.keys(m).forEach(function (k) {
    var base = k.replace(/-(LG|NAT)$/, '');
    if (base !== k && !(base in m)) m[base] = m[k];
  });
})();
```

Put it at the very top of the file, before the first IIFE. The script is
`defer`red, so the snippet has already built `ORLOFF_VARIANT_MAP` by then.

Verified live on KARIN with both patches applied: Add to Cart resolved
`51757425230114` = `KARIN-PT-P-150-LG` @ $5,730 for the platinum 1.5 ct
Prestige configuration, and tracked every subsequent metal / grade / carat
change correctly.

### Worth doing as well, not urgent

Replace the `variantId || firstVariantInMap` fallback with a hard failure. A
configurator that refuses to add to cart is a support ticket. One that quietly
adds the wrong ring at the wrong price is a chargeback. It appears in each
configurator's `addToCart`.

---

## Bug 3 — About Us, half the image on mobile

Whoever reported this was precise. It is **49% of the image width**, measured.

All seven image-with-text sections on `/pages/about-us` are set to the
**Large** height mode. From `assets/image-with-text.css`:

```css
.section-image-with-text.section-image-with-text-large .image-side-holder { height: 430px; }
@media only screen and (min-width: 768px) {
  .section-image-with-text.section-image-with-text-large .image-side-holder { height: 550px; }
}
.section-image-with-text .image-side-holder img { height: 100%; width: 100%; object-fit: cover; }
```

The height is fixed but the width is not. On a 375px phone the box is
375x430 — portrait. The photos are landscape 16:9 (`ORLOFF_GEM_DEAL.jpg` is
1334x750). `object-fit: cover` scales the image to fill 430px of height, which
makes it 765px wide, and crops the overflow. 375 of 765 is 49%. You get the
middle half of every photo. On desktop the box is wide enough that the crop is
barely noticeable, which is why it only shows up on phones.

### Fix — mobile-only override in `assets/web11-fixes.css`

That file is already loaded on the live theme, so this needs no template edit:

```css
/* About Us and any image-with-text band: fixed heights crop landscape photos
   to ~half their width on phones. Let the box follow the image instead. */
@media only screen and (max-width: 767px) {
  .section-image-with-text .image-side-holder {
    height: auto !important;
    aspect-ratio: 16 / 9;
  }
}
```

Verified in the browser at 375px: the box becomes 375x211 and 100% of the image
is visible, width and height, on all seven sections. Desktop is untouched.

If you would rather not touch CSS at all, the alternative is to open each of the
seven sections in the theme customizer and switch **Height** from *Large* to
*Adapt*. The theme already ships that mode (`height: auto`) and it does the same
job — but it changes desktop as well as mobile, and desktop currently looks
right, so the CSS override is the safer of the two.

Worth checking the same on any other page using image-with-text bands with
landscape photos, since the cause is the theme's CSS and not the About Us page.

---

## Order of work

1. Bug 2 patch on `assets/ring-configurator.js`. Money is leaking today.
2. Audit engagement ring orders since 24 Jul.
3. Bug 1 — the `id="rc-carat-group"` attribute in the three snippets.
4. Bug 3 — the mobile CSS block in `web11-fixes.css`.
5. The halo size-value typo.
6. Later: rewrite `combo_data` with the correct suffixed SKUs and drop the
   alias shim; harden the `addToCart` fallback.

Apply to WEB 15, or paste straight into WEB 14 via
Shopify Admin -> Online Store -> Themes -> Edit code.
