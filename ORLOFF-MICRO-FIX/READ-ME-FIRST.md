# MICRO Eternity Band — real per-stone SKUs, fixed

## What's in this folder
- `ring-configurator.js` — the corrected file. This is EXACTLY what's now live on
  the WEB 11 draft theme, verified byte-for-byte (MD5-diffed line by line, all
  differences confirmed cosmetic-only: comment spacing and equivalent Unicode
  escapes, zero functional difference).

## What changed
1. **Shopify data**: MICRO ETERNITY BAND now has 7 real variants — one per
   gemstone (Diamond/Ruby/Dark Blue Sapphire/Light Blue Sapphire/Yellow
   Sapphire/Pink Sapphire/Tsavorite), each its own SKU (MICRO-DIA / MICRO-RUB /
   MICRO-BLSAP / MICRO-LBSAP / MICRO-YSAP / MICRO-PISAP / MICRO-TSA), all priced
   $2900 (the per-band multi-buy discount is applied automatically at checkout
   by the two existing "MICRO - 2 Bands" / "MICRO - 3 Bands" Shopify discounts —
   confirmed those target the whole product, not a specific variant, so they
   still work with the new SKUs).
2. **This JS file**: the `addToCart` function for MICRO now looks up the correct
   real variant ID for EACH band based on which gemstone was picked (via a
   STONE_SKU map + the theme's existing ORLOFF_VARIANT_MAP), instead of
   silently reusing one hardcoded variant for every band regardless of stone.
   If a customer stacks 3 different-colored bands, each now checks out as its
   own correct line item with the correct SKU.

## Still needed — one manual step
This file is live on **WEB 11 (draft theme)** only. The **WEB 10 (live)** theme
still has the old broken version, because this session's tools are blocked from
writing to the published/live theme (by design, as a safety guard).

**To finish the fix on the live site:**
1. Shopify Admin → Online Store → Themes → **WEB 10** → Edit code
2. Open `assets/ring-configurator.js`
3. Select all, delete, and paste in the entire contents of `ring-configurator.js`
   from this folder
4. Save
5. Test on the live product page: pick 2-3 different gemstones, stack them,
   select a ring size, click Add to cart — confirm each band shows the right
   gemstone and the cart total reflects the discount tier correctly.

## Also confirmed fine while reviewing this file (no action needed)
Every other configurator in this file (NOVA-style rings, CHRISTINE bracelet,
GLOW pendant, wedding bands, earrings, threestone rings) already resolves
variant IDs correctly via a live `ORLOFF_VARIANT_MAP` lookup keyed by SKU — MICRO
was the only one hardcoding a variant ID as a literal string.
