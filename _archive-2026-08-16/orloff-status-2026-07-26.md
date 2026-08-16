# ORLOFF — SESSION STATUS, 2026-07-26

Authoritative handoff for this session. Supersedes the old "manual paste into
WEB 10" plan in orloff-micro-fix-status.md (that plan is obsolete — see below).

## THEMES

| Theme  | ID            | Role       |
|--------|---------------|------------|
| WEB 11 | 189332062498  | MAIN (live) |
| WEB 12 | 189425582370  | Unpublished — the working copy |

**ACTION REQUIRED: publish WEB 12.** Everything below marked "WEB 12" is
finished and verified but NOT visible to customers until it is published.
Theme publishing and live-theme writes are both blocked from this session;
they must be done from Shopify admin.

## MICRO ETERNITY BAND — two separate bugs

### Bug 1: could not change a band's gemstone — FIXED (WEB 12)
`assets/ring-configurator.js` read `state.editingId` in three places but never
assigned it. There was no click handler on the band slots at all, so
`getEditingBand()` always returned null and the swatch handler's
`if (editing) editing.stone = ...` was dead code. Once a band was added its
stone could never be changed; the only working sequence was swatch-first-then-plus.

Evidence it was lost rather than never written: the remove button calls
`e.stopPropagation()` (pointless without a parent handler), and
ring-configurator.css already ships a fully styled `.micro-band-slot.active`
with a white checkmark badge that nothing could trigger.

Fix: added the missing slot click listener in `renderBandSlots()` (toggles
editingId, syncs the swatch/label/image, re-renders). Also set
`slot.style.cursor = 'pointer'` inline, because the CSS says `cursor: default`
which is why the slots never looked tappable.

### Bug 2: coloured stones could not be added to cart — WORKED AROUND (WEB 12)
Root cause was mine: on 2026-07-25 the "Gemstone" product option was deleted
via `productOptionsDelete` to fix a dead hardcoded variant id, which removed 6
variants. The micro `addToCart()` does NOT use the button's data-variant-id —
it maps every band's stone to a hardcoded SKU then to a variant id via
`window.ORLOFF_VARIANT_MAP` (built in Liquid from product.variants, keyed by
SKU). With only MICRO-DIA left, 6 of 7 stones threw
"One or more selected gemstones are unavailable right now."

Fix: `resolveVariantId(stone)` prefers `vMap[STONE_SKU[stone]]` and falls back
to the single variant, with the gemstone carried as a line-item property. Bands
remain separate cart lines because their properties differ. Restoring per-stone
variants later re-enables the SKU lookup automatically — no code change needed.

VERIFIED by real cart round-trip on the WEB 12 preview (mixed set):
  3 lines — Diamond/MICRO-DIA, Tsavorite/MICRO-TSA, Ruby/MICRO-RUB
  all 2900, size on every line, no alert
  displayed 7500 == cart total 7500 (3-band automatic discount took 400 x 3)

## PRODUCT DATA — still outstanding, now OPTIONAL

Product `gid://shopify/Product/10342722601250` still has ONE option
(Title / Default Title) and ONE variant (52190742675746, MICRO-DIA, 2900,
inventory untracked).

Restoring the 6 gemstone variants is no longer required for checkout, but it IS
required for per-gemstone sales reporting — right now every micro sale reports
against MICRO-DIA and there is no breakdown by stone. Fulfillment is unaffected
(the gemstone is on the order as a line-item property).

`productOptionsCreate` is BLOCKED by this session's permission classifier —
tried twice. To restore, in admin add option `Gemstone` with Diamond FIRST,
then Ruby, Dark Blue Sapphire, Light Blue Sapphire, Yellow Sapphire,
Pink Sapphire, Tsavorite. Conditions that matter:
  - SKUs EXACTLY: MICRO-DIA, MICRO-RUB, MICRO-BLSAP, MICRO-LBSAP,
    MICRO-YSAP, MICRO-PISAP, MICRO-TSA
    (note RUB not RUBY, TSA not TSAV)
  - all at 2900
  - Track quantity OFF on all 7 (else they read sold out)
  - Diamond first so the existing variant keeps MICRO-DIA
WARNING: because of the fallback above, a mistyped SKU no longer errors — it
silently falls back to the Diamond variant. Re-run the mixed-set cart test
after adding them.

Do NOT touch: `orloff.combo_data` variantId field (dead code),
`orloff.stone_images`, `orloff.metal_images`.

## ENGAGEMENT RINGS FILTER BAR — DONE (WEB 12)

`templates/collection.engagement-rings.json`, section `custom_liquid_tNGHDA`:
  bar background      #091b36
  unselected          transparent fill, white text, rgba(255,255,255,.45) border
  selected (.active)  transparent fill, #bc973f text + border (no fill)
  hover               #bc973f text + border
  plus a :focus-visible gold outline and a 0.3s transition
Selected state is outline-only by the user's explicit choice.

## BRAND GOLD SWEEP: #b08d57 -> #bc973f

#bc973f was chosen as the midpoint between the original #b08d57 and #c9a227
(brighter/more yellow but still antique, not lemon). Contrast on #091b36 is
6.3:1, passes AA.

Complete map of every occurrence (found by downloading rendered pages and all
stylesheets and grepping locally — there is no content search in the theme API):

  DONE, in WEB 12:
    templates/collection.engagement-rings.json   5 rules (filter bar)
    sections/footer-group.json                   1 (.thb-widget-title custom_css)
  DONE, LIVE IMMEDIATELY (database content, not theme files):
    collection engagement-rings descriptionHtml  1 (eyebrow "Orloff of Denmark")
    collection fine-jewelry  descriptionHtml     1 (same eyebrow)
  NOT DONE:
    templates/index.json                         6 (homepage: four rich-text h4
                                                 rules, one image-with-text
                                                 eyebrow, one inline style in a
                                                 custom-liquid block)
  DELIBERATELY LEFT:
    sections/footer.liquid                       1 (.footer .thb-widget-title
                                                 color) — DEAD. footer-group.json's
                                                 ID-scoped rule overrides it;
                                                 all 5 footer titles compute to
                                                 #bc973f. Worth deleting as
                                                 cleanup, no visual effect.
  CONFIRMED CLEAN:
    config/settings_data.json — no occurrence before </head> on any page.
    (Its custom_html_head comes back TRUNCATED from the API — never blind-rewrite
    that file.)
    All 12 stylesheets — zero occurrences. Every gold is inline.

## TECHNIQUES WORTH REUSING

- Theme file writes: stagedUploadsCreate (resource BULK_MUTATION_VARIABLES) ->
  curl multipart POST to the returned target -> themeFilesUpsert with
  body {type: URL, value: <Location>}. Keeps 100KB files out of the context.
  themeFilesUpsert returns an EMPTY upsertedThemeFiles array on success — verify
  by re-querying size/checksumMd5 instead.
- Integrity check for hand-transcribed theme files: for auto-generated JSON
  (templates/*.json, sections/*-group.json, config/*.json) Shopify's reported
  `size` EXCLUDES the 363-byte auto-generated comment header. So
  (local total bytes - 363) must equal the reported size exactly. Both hexes are
  7 chars, so a colour-only edit must not change the size at all.
- The CDN serves theme JS/CSS MINIFIED, so byte counts will never match the
  local source. Compare `checksumMd5` via the theme API instead.
- Verify configurator work with a real /cart/add.js round-trip on a NON-default
  option, then read /cart.js. A rendered data-attribute proves nothing.

## BLOCKED FROM THIS SESSION (needs admin or a permission change)

- Publishing a theme
- Writing to the live theme
- `productOptionsCreate` / creating variants (classifier-blocked)

## NOT TOUCHED TODAY

The July 22 and July 23 audit backlogs are still fully outstanding — none of the
"same-day" fixes are applied in WEB 12: facets.liquid still closes with
</facets-filters-form>, product-add-to-cart.liquid still misses `| t` on the
pickup-availability string, responsive-image.liquid still leaks #metal_ codes
into alt text, mobile-menu.liquid still hardcodes action="/search".
Nivoda diamond search (E:\Nivoda) was not touched — see its own STATUS.md.