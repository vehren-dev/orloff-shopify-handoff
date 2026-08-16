# WEB 19 width fix, local backup

Written 16 August 2026. These two files are the full-width work for the
SOLAR GROWN DIAMONDS and RETAIL PARTNERS pages. They live only in theme
**WEB 19** (`gid://shopify/OnlineStoreTheme/189939089698`), which is
**unpublished**, so this folder is the only copy outside Shopify.

## Files

| File | Goes to | Checksum at time of writing | Size |
|---|---|---|---|
| `og-wide.css` | `assets/og-wide.css` | `caea5a1d4acc46871613b22a57dd87ce` | 4087 B |
| `og-styles.liquid` | `snippets/og-styles.liquid` | `cf68be36e3a7902b8ac308f01f457d3c` | 1158 B |

`og-styles.liquid` already existed. The only change is the second
`stylesheet_tag` line at the bottom, plus a comment explaining why the
order matters.

## What it does

`og-brand.css` sets `--og-max: 1180px` on `.og-section` and centres every
`.og-wrap`. On a 1920 monitor that left roughly 740px of dead margin, which
is why both pages read as narrow columns floating in space.

`og-wide.css` re-declares `--og-max` at 1720px with a larger gutter, and
above 1300px uses `:has()` to move each section head into its own left-hand
column. Applied to `.og-cards`, `.og-products` and `.og-accordion`.
`og-process` is deliberately excluded so one full-width horizontal band
survives between the hero and the card grids.

## The one trap

**Load order.** `og-wide.css` overrides `og-brand.css` at the same
specificity and wins only by being declared later. There is no `!important`
anywhere in it, on purpose. Swap the two `stylesheet_tag` lines in
`og-styles.liquid` and both pages silently revert to 1180px.

## Verified

Measured by direct page load against `?preview_theme_id=189939089698`,
not by fetch:

- 1920: content span 1547px, against 1100px before. Accordion 1073px,
  against its old 860px cap. Card grid is a 388px head plus three 320px
  columns. No horizontal overflow.
- 1440: wrap fills 1425px, cards 3 x 264px.
- 375: single column, 20px gutter, no grid, no sticky, zero overflow.

Body copy is still bounded by `--og-measure` (68ch, 720px), so line length
did not change. Only the layout widened.

## To restore

Upsert both files to the target theme with `themeFilesUpsert`. They are
plain text and self-contained. Nothing else in the theme needs touching.
