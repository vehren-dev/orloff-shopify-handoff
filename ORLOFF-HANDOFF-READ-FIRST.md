# ORLOFF: READ THIS BEFORE YOU CHANGE ANYTHING
**Written 2026-08-14. For any other agent/session working on this store.**

Another session spent today fixing live catalogue and theme issues. Some of it is
easy to undo by accident. Read this first.

---

## 1. THEME LAYOUT: WHICH IS WHICH

Theme WEB numbers drift; **resolve by ID or by `role: MAIN`, never by name.**

| Theme | ID | Role |
|---|---|---|
| WEB 18 | `189911695650` | **MAIN / LIVE** |
| WEB 19 | `189939089698` | Unpublished, active working copy |
| WEB 17 | `189847503138` | Unpublished, has the engagement-filter work |

Live theme is **North 11.0.0** (upgraded 14 Aug). All custom files survived the
upgrade; verified by checksum.

**You cannot write to the MAIN theme via the Shopify MCP.** Writes to the live
theme are blocked. Edit WEB 19, the user publishes.

---

## 2. DO NOT TOUCH

- **PDP gallery / product media snippet.** It already filters images to the
  selected metal and cycles back to that metal's first shot. User confirmed
  working 14 Aug: *"it cycles perfectly... dont change"*.
- **`orloff.stone_images`** metafield.
- **`orloff.metal_images`**: NO LONGER a blanket do-not-touch. It drives the
  configurator gallery and it CAN be silently wrong. ELEANOR's pointed at HAZEL
  in all 21 entries and was corrected 16 Aug. Do not rewrite it casually, but do
  audit it. See section 10c.
- **Homepage layout/order**, a reorder was rejected 28 Jul and reverted.
- **Gold eyebrows and CTA hierarchy**, reverted on instruction 29 Jul. The
  2.75:1 contrast on `#bc973f` is a known, accepted risk. Do not "fix" it.
- **Collection SEO**, hand-written, good.
- **Platinum uses the WHITE GOLD photography.** Deliberate. There is no separate
  platinum shot and none is wanted. Never flag it as a bug.

---

## 3. WHAT CHANGED TODAY: CATALOGUE (LIVE IMMEDIATELY)

Variant images are **product data**, shared by every theme. These are live now.

### 3a. Variant metal images: 980 variants across 40 products
Each variant now points at the photo for its own metal (and carat, where the
product has per-carat photography). Mapping:

`14YG/18YG -> _G_` · `14WG/18WG -> _WG_` · `14RG/18RG -> _RG_` · `PT -> _WG_`

**Complete:** all 27 wedding bands, ARIEL, KATARINA, MIA, MADELINE, plus the
~50 products that were already correct.

**ALL FIXED 16 Aug. See section 10.** ELISE, STELLA, SERENA, BIANCA, ELEANOR,
HELENA and HAZEL are done, plus every wedding band, earring, bracelet and
pendant. Store-wide: **0 wrong.** Nothing outstanding.

Full detail, recipe and traps: `E:\orloff-variant-images-2026-08-11.md`.

### 3b. KARIN and KLARA pricing: fixed
- KLARA: two platinum variants relabelled `0.40 ct` -> `0.30 ct`, SKU `-040` ->
  `-030`. **Prices deliberately unchanged.**
- KARIN: two variants **created** (69 -> 70), the missing Platinum · Signature ·
  0.30 ct, at $1,980 lab / $2,940 natural, the prices the configurator was
  already quoting.

Before this, selecting Platinum·Signature·0.30ct displayed one price and charged
a lower one. Verified fixed end-to-end via the live cart.

---

## 4. WHAT CHANGED TODAY: THEME

### 4a. WEB 17: engagement ring collection filters
- `assets/orloff-fixes.css`, new section 3 hides `.orloff-catnav`, the
  duplicate category chips inside the collection banner. **The chip markup lives
  in the COLLECTION DESCRIPTION, not the theme**, it is hidden, not deleted, so
  the live theme was left untouched.
- `templates/collection.engagement-rings.json`, filter bar active state now
  matches both routes: tag-filtered (`/collections/engagement-rings/halo`) and
  standalone (`/collections/engagement-rings-halo`). Checking `current_tags`
  alone left ALL lit everywhere.
- `templates/collection.engagement-rings-halo.json`, enabled the real collection
  banner, disabled a hardcoded "ENGAGEMENT RINGS" block that was overriding it.
- `templates/collection.json`, added the filter bar, guarded to
  `collection.handle contains 'engagement-rings'`, because side-stone and
  three-stone fall through to the default template.

Note: WEB 18 has the CSS but its template files were re-saved through the theme
editor, so the commented Liquid may be gone. Behaviour is correct live.

### 4b. WEB 19: cart line item de-crowded
`snippets/cart-drawer.liquid` (`058f7e45…`, 11998 B).

Configurator rings were printing Metal/Grade/Carat **twice**, once from
`item.options_with_values`, once from the configurator's line-item properties.
Now counts visible (non-`_`) properties and renders the options block **only
when there are none**, so native products (charms, silver, sculpture) still show
their options.

**Not yet done:** the same guard in `sections/main-cart.liquid`.

---

## 5. KNOWN-OPEN, NOT REGRESSIONS

- **`/collections/charms` is a dead link, not a broken page.** No collection has
  that handle at all; see section 8. Previously recorded as: fails to load, pre-existing, failed the same way
  before the 11.0.0 upgrade.
- **Silent `addToCart` fallback** still in `assets/ring-configurator.js`, the
  `k.length ? m[k[0]] : null` pattern, 8 occurrences. If a variant fails to
  resolve it silently adds the FIRST variant instead of failing. User declined
  hardening on 11 Aug. This is how the KARIN/KLARA mischarge happened.
- **Privacy policy is empty**, live, linked from checkout, zero characters.
- **Terms of service** still contains `[LINK TO REFUND POLICY]` /
  `[LINK TO PRIVACY POLICY]` placeholders and a stray `.co.th` URL.
- **Four info pages serve the wrong article**, CERTIFICATION, FLUORESCENCE,
  SOURCING and LAB-GROWN all render the COLOR page's copy.
- **A product titled "test"** and **six zero-inventory diamond listings** are
  ACTIVE and public.
- **0 completed checkouts in 30 days** on ~2,000 sessions. Never tested end to
  end.
- ~~**ELEANOR may show HELENA's ring.**~~ **SOLVED 16 Aug, and the diagnosis
  above was wrong.** It was not a mislabel at export and the ring was HAZEL, not
  HELENA. ELEANOR's `orloff.metal_images` metafield pointed at HAZEL files in
  all 21 entries. Fixed on both twins. See section 10c.

---

## 6. IF YOU ARE DOING A SITE EVALUATION

Evaluate against **live WEB 18**. Be aware that:
- Several fixes exist only in unpublished WEB 17 / WEB 19 and will not appear.
- Variant metal images are DONE as of 16 Aug, store-wide, 0 wrong. Do not open
  findings for them. See section 10.
- Do not open findings for anything in section 2 (DO NOT TOUCH).

**If you intend to change anything, say so first**, another session is actively
editing WEB 19 and the catalogue. Concurrent edits to the same theme file will
silently overwrite each other; `themeFilesUpsert` has no conflict detection.

---

## 7. WEB 19: ACCESSIBILITY PASS (added 14 Aug, second session)

Triggered by a third-party UI/accessibility review of the live site. Only findings
that were reproduced by measurement were acted on. **No product-page Liquid and no
`ring-configurator.js` were touched.** `snippets/cart-drawer.liquid` was never
opened, verified still `058f7e45...`, 11998 B.

Files changed, all in WEB 19:

- **`assets/orloff-fixes.css`**, appended sections 4-6. Sections 1-3 (including
  the `.orloff-catnav` hiding) reproduced verbatim; re-verified live that catnav is
  still `display:none` and the engagement filter bar still lights the right route.
  - S4 `.orloff-sr-only` clip-rect utility.
  - S5 Collection `<h1>` was `display:none`, which removes it from the
    accessibility tree, collection pages shipped with **no h1 at all**. Now
    clip-hidden instead. **Visually identical**; the deliberate no-duplicate-title
    intent is preserved.
  - S6 Collection banner height. Engagement 775->535px, wedding bands 739->577px.
    The editorial block pasted into each collection description carries 80px of its
    own padding; that is what was trimmed. Copy untouched.
- **`assets/orloff-fixes.js`**, new section 3: `aria-pressed` on `.rc-btn`, group
  names on `.rc-btn-group`, and an accessible name for the size `<select>`.
  Centralised because `ring-configurator.js` builds the carat buttons at runtime
  and twelve snippets share the markup. **Attributes only, no listeners, no class
  changes**, so the configurator keeps sole ownership of selection and add-to-cart.
  Verified on KATARINA and VINCENT: prices, config string and variant IDs all still
  correct across metal/grade/carat changes.
- **`snippets/header-secondary.liquid`**, `aria-label` on the icon-variant search
  button (it was an SVG with no accessible name).
- **`snippets/search-drawer.liquid`**, real `<label>` + id for the search field.
- **`snippets/email-signup-form.liquid`**, real `<label>` for `#contact_email`.
- **`sections/charm-bracelet-prompt.liquid`**, emits `window.ORLOFF_A11Y_STRINGS`
  so the JS-applied names stay translatable.

Result: unnamed interactive controls on the homepage went 5 -> **0** of 114.

**Deliberately NOT done:** heading levels. The H4 eyebrows come from
`rich-text.liquid`'s `heading_size` setting, which is a visual size picker, not a
semantic level, changing it hits every rich-text section store-wide. Heading-level
sequence is a best practice, not a WCAG failure. The gold eyebrows in section 2
were not touched.

**Still open:** ~5 `image-with-text-overlay` hero images have empty alt and need a
content decision. The six marquee images in the `scrolling_text` section are
correctly decorative, do not "fix" those.

### 7a. Engagement filter chips repointed to standalone collections (14 Aug)

The five `.er-filter-bar` chips linked to the **tag-filtered** routes
(`/collections/engagement-rings/halo`). They now link to the **standalone**
collections (`/collections/engagement-rings-halo`), matching the Browse menu.

Why: both routes serve the same nine products, but only the standalone
collections carry their own H1, hero copy and page title. The tag route rendered
the generic ENGAGEMENT RINGS banner while the chip claimed a category, and both
URLs self-canonicalised - so the bespoke SOLITAIRE / HALO / SIDE-STONE /
THREE-STONE pages were orphaned, unreachable from the filter bar, while the
weaker "- Tag" pages took the clicks.

Changed (WEB 19), 4 hrefs each, nothing else:
- `templates/collection.engagement-rings.json`  (also serves engagement-rings-solitaire + tag routes)
- `templates/collection.engagement-rings-halo.json`
- `templates/collection.json`                   (guarded bar; serves sidestone + threestone)

**The dual active-state matching was deliberately kept.** The tag URLs still
resolve and are still linked externally, so `er_tags contains 'halo'` stays
alongside the handle check. Verified: all 7 routes return 200 with exactly one
correct active chip, correct product counts, old tag URLs still highlight.

**Collection handles are consistent** (`engagement-rings-solitaire`, `-halo`,
`-sidestone`, `-threestone`). Only the template FILENAMES are inconsistent.

**Two orphaned templates - do not assume they are live:**
`templates/collection.engagement-ring-sidestone.json` (singular "ring") and
`templates/collection.engagement-rings-three.json` match no collection handle and
are unused. Both still contain an OLD filter bar: pre-redesign white/navy
styling, tag-route links, the old `{% unless current_tags %}` active logic, and
different labels ("Sidestone", "Three Stone"). Left untouched as dead code.
Recommend deleting them - if anyone assigns one from the theme editor they get
the old broken bar back.

Still duplicated: the bar markup is hand-synced across three templates. Worth
extracting to `snippets/er-filter-bar.liquid` so the hrefs live in one place.

### 7b. Straight hyphens in Cormorant headings (14 Aug)

Cormorant draws its hyphen on a slant (a genuine Garamond trait). In uppercase
settings - SIDE-STONE, THREE-STONE - it reads as a tilted mark. Inter's hyphen is
straight, so body copy was never affected; headings only.

`assets/orloff-fixes.css` section 7 redeclares the SAME family names
('Cormorant Garamond' and 'Cormorant') with `unicode-range: U+002D, U+2010-2015`.
Last-declared wins per codepoint, so only the dash is substituted and no
font-family declaration anywhere needs changing - which matters because the
collection descriptions set font-family inline and could not be overridden
without `!important`.

**Two traps, both found by measurement, do not "tidy" these away:**

1. `font-weight` MUST be a single value. A range (`font-weight: 100 900`) is an
   exact match at every weight, so the browser selects that face as the family's
   best match, finds no letters in its unicode-range, and drops out of the family
   entirely. Measured on Inter: letters shifted 238.78 -> 233.4px, i.e. the real
   font stopped rendering. This was written that way first and caught in testing.
2. One rule PER WEIGHT. A face at 400 does not cover a heading set in 500 - that
   weight keeps the slanted hyphen. 400/500/600 normal and 400/500 italic are
   declared to match what the Google request actually loads, for both family names.

Verified in-browser: Cormorant letters 205.6px (real font, not the 233.4 fallback),
Cormorant dash 74.81px (Georgia's straight dash, vs Cormorant's own 64.6), Inter
byte-identical to the live baseline at all three probes.

src prefers installed serifs (Georgia / Times / Noto / Liberation / DejaVu) because
a serif hyphen matches Cormorant's proportions; Inter is the guaranteed last
resort. If that hashed CDN URL rotates, the rule fails and the original slanted
hyphen returns - degraded, never broken.

NOTE: the in-app browser pane does not fetch fonts.gstatic.com reliably, so
Cormorant sometimes falls back to serif there. That is an artefact of the pane,
not the site - check dashes in a real browser.

### 7c. Side-stone / three-stone rebuilt to match halo (14 Aug)

**Correction to 7a.** It claimed all seven engagement routes were verified with
standalone chips. That was wrong for sidestone and threestone - the check was made
through a same-origin `fetch()` that returned a fallback render. A direct page load
showed they were still on the OLD bar. Verify template changes by loading the page,
not by fetching it.

The two collections do NOT fall through to the default template. Both carry
`templateSuffix: engagement-ring-sidestone` (singular "ring") - the file previously
dismissed as orphaned is live, and threestone points at the *sidestone* template.

Before: no collection banner at all (the section was disabled in favour of a
hardcoded "ENGAGEMENT RINGS" block), no h1, transparent chip bar with tag-route
links, old labels ("Sidestone", "Three Stone"), and ALL incorrectly active on every
category page. Each collection's own bespoke hero copy existed but was never shown.

`templates/collection.engagement-ring-sidestone.json` was rebuilt as a mirror of
the halo template: real collection banner, navy filter bar with standalone chips
and the dual active logic, product grid at 12 / paginated / 5 columns. The two
disabled leftover sections were dropped - they rendered nothing and contained
malformed HTML (an unclosed <i>, an <h1> inside a heading block).

The filename stays wrong on purpose. Renaming it means editing `templateSuffix`,
which is collection data and goes live the instant it is saved. Nothing in the file
is category-specific - the banner renders each collection's own description - so
one shared file correctly serves both pages.

Verified by direct page load, all four identical:

| Page | hero | first product | cols | active chip | own hero copy |
|---|---|---|---|---|---|
| Halo (reference) | 456px | 809px | 5 | Halo | HALO / A centerstone, amplified. |
| Solitaire | 456px | 809px | 5 | Solitaire | SOLITAIRE / One stone. Nothing else needed. |
| Side-stone | 456px | 809px | 5 | Side-stone | SIDE-STONE / Support, without distraction. |
| Three-stone | 456px | 809px | 5 | Three-stone | THREE-STONE / Past, present, and future. |

Solitaire needed no change - it shares `collection.engagement-rings` with the parent
and already matched. ONE latent difference remains: that template is
`pagination_type: infinite` where halo is `paginated`. Invisible at 9 products with
a page size of 12, but solitaire would infinite-scroll while its siblings paginate
if it ever exceeds 12. Not changed, because that template also serves the 36-product
parent, where infinite scroll is likely deliberate.

### 7d. Numerals fix applied; policy rewrites drafted but NOT applied (14 Aug)

**APPLIED: theme WEB 19.** New file `assets/orloff-numerals.css`, loaded from
`sections/charm-bracelet-prompt.liquid` alongside orloff-fixes.css.

Cormorant defaults to OLDSTYLE figures - numerals that vary in height and drop
below the baseline. In tracked uppercase they read as a mistake. Exactly one place
on the site shows a Cormorant numeral: the homepage heading "SINCE 1995" at 34px.
Every other number (prices, carats, 14K/18K) is already Inter.

Fix is one declaration, `font-variant-numeric: lining-nums`, on headings plus the
inline-styled collection description blocks. Verified: the heading now computes
lining-nums and "1995" measures 181.41px against 167.11px before, at 100px - the
glyphs genuinely changed. No font migration needed or done.

Kept as a SEPARATE FILE, not an 8th section of orloff-fixes.css, because that file
is 13.7KB and both sessions were writing to it the same hour. Do not merge them.

Deliberately NOT `font-feature-settings: 'lnum'` - that low-level property replaces
the whole feature list and would switch off ligatures and kerning.

**DRAFTED, NOT APPLIED - all five policies.** The `shopPolicyUpdate` mutation was
denied by the permission classifier, so nothing was written to the live store.
Policies are all still in their original broken state:

- PRIVACY POLICY is still EMPTY. Full replacement drafted (Thai PDPA + EU/UK GDPR,
  covering the marketing-consent split and the Thailand-only promo segmentation).
- TERMS OF SERVICE still has both `[LINK TO ...]` placeholders and the single
  `orloffofdenmark.co.th` link. Three precise replacements identified; the .co.th
  one should become the RELATIVE `/policies/refund-policy` so it cannot rot again.
- REFUND POLICY still excludes "flowers, beauty products, flammable gases", still
  has the split mailto (a stray "s" linking to info@, twice), and is still missing
  the EU/UK statutory 14-day withdrawal right. Note: goods made to customer
  specification are EXEMPT from that right, which covers most of the configurator
  catalogue - but only if the policy says so.
- SHIPPING POLICY still four lines. Draft adds origin (all orders ship from Hua Hin),
  duties/import VAT, and a refusal to under-declare or mark as gift.

Full drafts: https://claude.ai/code/artifact/f2f66fb1-09c7-4d71-a34a-9ce0a5444ccc
Local copy: `E:\orloff-compliance-pack.html`

**CORRECTION - do not remove the Google Fonts link yet.** An earlier draft of that
pack said self-hosting was free because Shopify already serves Cormorant. Wrong.
Shopify hosts exactly ONE face: `cormorant_n5.woff2`, weight 500 upright, family
name `Cormorant`. The headings use `Cormorant Garamond` at 400/500/600 plus
italics - all five from Google. Dropping the link today loses four of five faces
and silently falls back to a system serif. Proper fix is to download the five
woff2 files, upload as theme assets, declare @font-face against asset_url, THEN
remove the Google link.

**COOKIE BANNER - needs admin, not code.** The theme banner is accept-only and
never calls `Shopify.customerPrivacy`; the API is not even loaded, so it gates
nothing. Do not rebuild it in the theme. Enable Settings > Customer privacy >
Cookie banner (native, wired to the consent API, region-aware), then delete
`snippets/cookie-notice.liquid`. This must happen BEFORE any pixel is installed -
web pixels are gated by the consent API only if something is actually setting
consent.

**Open questions blocking the refund/shipping policies:** are configured rings
returnable (legal right to exclude, but commercial choice); dispatch/production
lead time; delivery windows per shipping tier; whether parcels are insured to full
value. Deliberately left blank rather than invented.

---

## 8. SESSION 16 AUG: VERIFICATION, WIDTH WORK, AND A HARD BLOCKER

Sections 1 to 7 were re-checked against the live store. Theme IDs and roles,
the WEB 19 checksums (cart-drawer.liquid still 058f7e45..., 11998 B), all five
policy bodies, KARIN at 70 variants, the "test" product, the six zero-inventory
diamonds and zero orders in 30 days: all confirmed still true. Two items were
wrong and are corrected in place above.

### 8a. The variant figure was 210. It is 420.

Section 3a contradicted itself: 210 is seven products' worth, but "both twins
each" is fourteen products. Each has 42 variants (7 metals x 2 grades x 3
carats), of which 30 are non-yellow. 14 x 30 = 420. Verified live on ELISE,
STELLA and HAZEL, both twins of each. Every variant still points at the
`_G_0.20_` yellow file.

### 8b. /collections/charms does not exist

Section 5 called it "fails to load", which sends the next session debugging a
template that was never there. No collection has the handle `charms`. The real
handles are `all-charms` (270 products), `charm-bracelets`, `animal-charms`,
`nature-charms` and seven more. Whatever links to /collections/charms should
point at all-charms.

### 8c. POLICIES CANNOT BE WRITTEN FROM HERE. Missing scope, not a prompt.

Section 7d recorded the `shopPolicyUpdate` failure as "denied by the permission
classifier". That was wrong. Shopify itself returns:

    Access denied for shopPolicyUpdate field.
    Required access: `write_legal_policies` access scope.

The connected app does not hold that scope. No retry will ever succeed and no
local permission rule changes it. Do not spend another session retrying it.

Two routes only: paste by hand from the compliance pack, or reauthorise the app
with `write_legal_policies`.

### 8d. WEB 19: solar-grown and retail-partners are now full width

NEW FILE `assets/og-wide.css`, loaded from `snippets/og-styles.liquid`
immediately after og-brand.css.

`og-brand.css` sets `--og-max: 1180px` on `.og-section` with
`.og-wrap { margin-inline: auto }`. On a 1920 monitor that left roughly 740px of
dead margin. og-wide.css re-declares `--og-max: 1720px` and a larger gutter.

**ORDER MATTERS.** og-wide.css wins only by being declared later at the same
specificity. Swap the two stylesheet tags in og-styles.liquid and both pages snap
back to 1180px. There is no !important anywhere in it and there should not be.

Above 1300px, `:has()` turns three section types into a two-column editorial
layout: section head into a left column, content into the right. Applied to
`.og-cards`, `.og-products` and `.og-accordion`. `og-process` is deliberately
EXCLUDED, so one full-width horizontal band survives between the hero and the
card grids. Without it the page settles into a single repeated rhythm.

Measured after the change at viewport 1920: content span 1547px (179 to 1726)
against 1100px before; accordion 1073px against its old 860px cap; card grid a
388px head plus three 320px columns. At 1440 the wrap fills 1425 and cards are
3 x 264. At 375 it is a single column, 20px gutter, no grid, no sticky, zero
horizontal overflow.

Verified by direct page load against `?preview_theme_id=189939089698`. Not by
fetch, per the warning in 7c.

Body copy is still bounded by `--og-measure` (68ch, 720px), so line length did
not change. Only the layout widened.

**Local backup: `E:\orloff-web19-width-fix\`.** Both files plus a README with the
checksums and the restore procedure. WEB 19 is unpublished, so that folder is the
only copy of this work outside Shopify. og-wide.css there matches the deployed
file at `caea5a1d4acc46871613b22a57dd87ce`.

### 8e. Compliance pack rebuilt

`E:\orloff-compliance-pack.html`, now full width with a sticky section rail.
All four policies are written out IN FULL with copy-to-clipboard buttons, because
8c means they have to be pasted by hand. Previously only privacy and shipping had
complete text; refund and terms were described but never written out.

The refund draft takes a position on the open question: configured rings are
written as NOT returnable, which is the legally available choice and the usual
one for made-to-order. The pack says exactly which lines to delete to flip it.

The status table's Google Fonts row used to claim "Shopify already hosts the same
font on your own domain", which the same page then retracted further down. The
row now carries the correct version. Do not reintroduce the cheap version.

### 8f. USER PREFERENCES, HARD RULES

- **No em dashes.** Anywhere. Chat, files, code comments, customer copy. Asked
  for forcefully on 16 Aug. Use commas, colons, or separate sentences.
- **Desktop pages fill the viewport.** The solar and partners pages were named
  as looking like "squished ai made pages". Do not build narrow centered
  columns. Constrain the TEXT BLOCK inside a wide layout, never the page shell.

### 8g. Still open, unchanged

Publishing WEB 19 is the single biggest pending item: the accessibility pass,
the engagement filter chips, the rebuilt sidestone template, the hyphen fix, the
numerals fix and now the width work are all invisible until it goes live.
The cookie banner is an admin task and must precede any pixel. The four shipping
and refund answers (dispatch time, delivery windows, insurance value, and
whether configured rings are returnable) are still unanswered.
---

## 9. SESSION 16 AUG, CONTINUED: POLICIES DONE, CONTENT, FONTS, CONSENT

### 9a. ALL FIVE POLICIES ARE NOW LIVE. Nothing outstanding.

Privacy, refund, shipping, terms of service and contact information are all
correct on the live store. Pasted by the user by hand, per 8c. Verified by
reading the bodies back from the API.

Terms carries all three link fixes and the new phone number. Section 20 also
now contains the full contact block, which is harmless and arguably better.

Still empty, and both optional: LEGAL_NOTICE and TERMS_OF_SALE. A legal notice
(Impressum) is required if selling to Germany or Austria. Draft text is in the
compliance pack; it needs the company registration number and tax ID, which the
user has not supplied. Terms of sale should stay empty: the ToS already covers
the purchase contract and a second contract document invites contradictions.

### 9b. Phone number changed everywhere

Old `+66-658355613` is gone from the store. New number is `+66 81 163 2666`.

The theme already used the correct number in `tel:` links; only the DISPLAY
string was malformed as `+66 (0)-811-6326-66 (TH)`, which is a mangled hybrid
(the leading 0 is the domestic trunk prefix, dropped when dialling +66). Fixed
in `sections/footer-group.json` and `templates/page.contact.json` to
`+66 81 163 2666 (TH)`. The US number `+1 (302) 544 7594` was left in place and
only its spacing corrected. The user did not confirm whether it should go.

### 9c. WORK PERMIT: Niels must not be described as working. LEGAL.

The user is Viktor Ehrenskjold, head of the company. Niels Orloff Ehrenskjold is
the FOUNDER ONLY. He does not work in the business. A foreigner working in
Thailand without a permit is illegal, so any copy describing him performing an
operational function is a real exposure, not a style problem.

Fixed in WEB 19, `templates/page.about.json`:
- "still personally oversees the quality control of our most valued pieces" is
  GONE. The user asked to keep it; it cannot be kept in any paraphrase, because
  softening it to "still casts an eye over" is the same claim in quieter words.
  What survives: "Though his smithing days are over, the standard Niels Orloff
  set at that bench is still the one every piece is measured against." plus the
  whole original second half. Roughly 70 percent of the sentence.
- "has been making trips like this one" became "made trips like this one for
  years before Orloff of Denmark had its name."
- "leads the company alongside him" became "It passed to his son, Viktor
  Ehrenskjold, who heads the company today."

Dated captions (Ratnapura 1998, the workbench 2006) were LEFT. They are
past-dated biography and defensible.

Fixed LIVE in the retail-partners PAGE BODY (page data, not theme, so it applied
immediately): signature is now Viktor Ehrenskjold, Head of Orloff of Denmark.
"The founder, directly" and "You deal with the founder" both became "the head of
the company".

Fixed in WEB 19, `templates/page.retail-partners-v2.json`. The CTA contact block
was only part of it; FIVE other passages described him working:
- "Meet father and son, sit down with two gemologists" -> "Sit down with a gemologist"
- "Two gemologists who select and examine the stones themselves" -> "A gemologist who..."
- "the two gemologists who select the stones" -> "the gemologist who selects the stones"
- "Two gemologists with more than 35 years" -> "A house with more than 35 years"
- "a father-and-son jewellery business" -> "founded in 1995 and today run by the founder's son"
CTA block: k1 is Viktor (Head, AIGS-trained Gemologist, with the email), k2 is
Niels ("Founder, 1995") with NO role and NO email.

Note this softens the father-and-son pitch, which was a genuine selling point.
That is a commercial consequence of an accuracy fix, and the user has seen it.

Also: the name was spelled "Victor" on that page and "Viktor" everywhere else.
Now consistently Viktor.

### 9d. The five diamond information pages are written

Section 5 listed four pages serving the COLOR page's copy. It was FIVE, and the
causes differed:

| Page | Was | Now |
|---|---|---|
| CERTIFICATION | COLOR's body | Reading a Diamond Certificate |
| FLUORESCENCE | COLOR's body | What Fluorescence Actually Does |
| SOURCING | COLOR's body | Where Our Stones Come From |
| LAB-GROWN | COLOR's body, and its hero title was literally the word "COLOR" | How a Lab-Grown Diamond Is Made |
| CARAT | never written at all: heading was "." and body was "<p>.</p>" | Understanding Carat Weight |

COLOR itself was always correct and was not touched.

SOURCING is the one to re-read before publishing. It describes two chains
separately, on the user's own account: diamonds come from suppliers who WARRANT
Kimberley Process compliance, and it says plainly that this is a warranty-based
system resting on documents passed hand to hand, not a forensic one, and that
"we have not stood at the pit head of every diamond we sell". Coloured stones
are bought in person, often directly from miners. That candour is deliberate and
is what makes the coloured-stone claim believable. Do not sand it off.

LAB-GROWN respects the Solar Grown rules: the mark describes production energy,
never replaces "lab-grown", no green superlatives. It also states that lab-grown
sells for less and that resale markets treat the origins differently.

### 9e. Google Fonts removed. Cormorant now served by Shopify.

NEW `snippets/orloff-fonts.liquid`, rendered from `layout/theme.liquid` where the
Google Fonts <link> used to be.

An earlier note in this session claimed Shopify only hosts one Cormorant face and
that self-hosting was an hour of work. BOTH WRONG. `font_modify` returns five
variants from Shopify's own CDN: 400, 500, 600 upright and 400, 500 italic.
`snippets/head-variables.liquid` was simply only asking for one of them.

The snippet emits the missing weights, then declares them A SECOND TIME under the
family name `Cormorant Garamond`. That alias is load-bearing: the collection
descriptions and several page templates set `font-family: 'Cormorant Garamond'`
INLINE, and those are content rather than theme, so they cannot be rewritten from
the theme side. Without the alias they drop to a system serif.

Verified at 1280px: zero requests to gstatic or googleapis, Cormorant renders at
205.6px against a 233.4px serif fallback, italic renders at 195.2px against
222.18px. Real font, real italic, both from orloffofdenmark.com.

Every rule is guarded with `{%- if -%}` so a missing variant is skipped rather
than emitting a broken url().

### 9f. Consent banner: native one is on, theme one is still there too

`assets/orloff-consent.css` (NEW, loaded from charm-bracelet-prompt.liquid)
compacts Shopify's native banner. It measured 202px at 1280px: 32px padding each
side, a stacked wrapper, and an <h2> reading "Cookie consent" costing 25px plus
margin to repeat what the paragraph says. The CSS pulls the padding in, lays the
wrapper out as a row on desktop, and CLIPS the h2 rather than display:none, so it
stays in the accessibility tree.

Shopify renders that banner into the LIGHT DOM with stable `shopify-pc__` classes.
Not a shadow root, not an iframe. Fully styleable.

**STILL TO DO: the theme banner is not removed.** `layout/theme.liquid` still has
`{% render 'cookie-notice' %}`, so once WEB 19 publishes there will be TWO
banners. Remove that render line (leave the snippet file, deleting it while the
render tag exists throws a Liquid error). This was left undone because at the
time the native banner had no regions enabled and removing the theme one would
have left zero banners.

### 9g. TWO TRAPS THAT COST TIME. Read these.

**1. `fetch()` inherits the preview_theme_id cookie.**
Previewing a theme sets a cookie. Any same-origin `fetch('/...')` afterwards is
served the PREVIEW theme even with no preview parameter in the URL. This produced
a false "the live site already has my CSS" reading, and separately a false "all
seven engagement routes are fixed" in 7a. Verify live state by loading the page
directly, or in a session that has never previewed.

**2. `product.media` only lists images ATTACHED to a product.**
Checking `product.media` on ELISE, STELLA, SERENA, BIANCA, ELEANOR, HELENA and
HAZEL returns three `_G_` yellow files each, which led to the conclusion that the
white gold and rose gold photography does not exist. THAT IS WRONG. The user
produced `ELISE_WG_1.00_1.png` from Shopify Files. The images exist; they are
simply not attached to the products.

So the 420 variants were a TWO-STEP job, not a remapping: attach the Files to
each product as media, then point the variants at them. The filename carries
carat as well as metal (`_WG_1.00_`), so the mapping is metal AND carat.

**This was completed on 16 Aug, see section 10.** The trap above still stands as
a general lesson: `product.media` tells you what is attached, never what exists.
Always check Shopify Files before concluding photography is missing. That
mistake was made three times in this project and was wrong every time. See 10b
for the third, where a file simply was not named with a `_G_` token.

### 9h. DO NOT TOUCH, added

- **Product/variant images and cart thumbnails.** That work is now FINISHED,
  16 Aug. See section 10. No longer claimed by anyone; nothing to avoid.

### 9i. State at handoff

WEB 18 is still MAIN. WEB 19 is NOT published. Everything in sections 7, 8d and 9
except the policies and the retail-partners page body is invisible until it is.

Smoke tested on WEB 19, all 200 with no Liquid errors: home, collection, category,
product, cart, search, about, retail partners, sourcing, solar grown.

Open and unclaimed: remove the `cookie-notice` render before publishing; alt text
on about five hero images; `/collections/charms` is a dead link and should point
at `all-charms`; canonicals on the tag routes; `main-cart.liquid` still lacks the
de-crowding guard; `/pages/about-us` has no h1 at all because its page section is
disabled.

Needs the user: publish WEB 19; a real test checkout (still zero orders since
14 July); registration number and tax ID for the legal notice; whether the US
phone number stays.

### 9j. E: root cleaned

56 superseded files moved to `E:\_archive-2026-08-16\`, not deleted, since E: is
FAT32 removable with no dependable recycle bin. Superseded status reports and
audits, plus the whole charm-line extraction pipeline. Final outputs kept
(`orloff-charm-line-a-master.xlsx`, `shopify-charm-line-a.csv`,
`storehub-charm-line-a.csv`), as was anything this document references. Root went
from 78 loose files to 27. Folders were left alone.

---

## 10. SESSION 16 AUG: VARIANT IMAGES FINISHED

The cart used to show a yellow gold ring whenever a customer picked platinum,
white gold or rose gold. That is fixed store-wide. Sections 3a, 5, 6, 9g and 9h
above were corrected in place to match.

### 10a. Final state, verified against the live storefront

| Group | Products | Variants | Result |
|---|---|---|---|
| Wedding bands | 27 | 336 | all correct |
| Engagement rings, flat photography | ARIEL, KATARINA | 280 | all correct |
| Engagement rings, carat-specific | MIA, MADELINE, ELISE, STELLA, SERENA, BIANCA, ELEANOR, HELENA, HAZEL (both twins) | 756 | all correct |
| Fine Jewelry Earrings | 11 | 77 | all correct |
| Bracelets (CHRISTINE) | 2 | 70 | all correct |
| Pendants (GLOW) | 2 | 28 | all correct, see 10b |

Last full sweep: **0 wrong** store-wide. Every product with metal options now
shows the metal the customer selected.

Mapping used throughout:
`14YG/18YG -> _G_`, `14WG/18WG -> _WG_`, `14RG/18RG -> _RG_`, `PT -> _WG_`.
Where per-carat photography exists, metal AND carat are matched.

### 10b. GLOW pendants are CORRECT. Nothing to do.

An earlier draft of this section claimed 8 GLOW variants had missing
photography. **That was wrong and is retracted.**

GLOW's yellow gold shots are simply not named with a `_G_` token. They are
`001.13.png`, `001.14.png`, `001.15.png`, and `001.13` is the product's featured
image. The four yellow variants per twin carry no explicit variant image, so
they fall back to the featured image, which IS the yellow gold render. The
customer sees yellow gold for yellow gold. Correct.

Rose and white/platinum were assigned explicitly from `GLOW_RG_1.0_1` and
`GLOW_WG_1.0_1`. The 1.0 ct shot serves both 0.50 and 1.00 weights, since only
one weight was rendered.

**Lesson: a missing `_G_` filename does not mean missing photography.** Check
what the featured image actually depicts before concluding a render is absent.

### 10c. ELEANOR's metal_images pointed at HAZEL

The configurator gallery reads `orloff.metal_images`, NOT product media. On both
ELEANOR twins every one of the 21 entries pointed at `HAZEL_*` files, so the
page showed the wrong ring while the product media and combo_data were both
correct ELEANOR.

Rewritten with ELEANOR URLs on both twins and read back to confirm.

**HELENA and HAZEL were checked and are correct.** The other 12 configurator
families are UNAUDITED.

**Critical: a storefront HTML sweep does NOT detect this.** The metafield is
applied client-side, so the served HTML shows only the product's own media and
looks clean. All 15 rings passed that sweep while ELEANOR was serving HAZEL.
The metafield must be read directly, per product, per twin.

### 10d. Method, if any of this needs repeating

Two API calls per product, batched 2 to 6 products per call with GraphQL aliases:

1. `productCreateMedia(productId, media: [{mediaContentType: IMAGE,
   originalSource: "<CDN url from Files>"}])`, returns media ids in submitted
   order.
2. `productVariantsBulkUpdate(productId, variants: [{id, mediaId}])`.

Variant ordering differs by range and must be read from the SKU, never assumed:
- Engagement rings, KARIN style: per carat group of 14, `YG-P, YG-S, WG-P, WG-S,
  RG-P, RG-S` in 14K, then the same in 18K, then `PT-P, PT-S`.
- Engagement rings, KATARINA style: `14YG-P, 14YG-S, 18YG-P, 18YG-S, 14WG-P,
  14WG-S, 18WG-P, 18WG-S, 14RG-P, 14RG-S, 18RG-P, 18RG-S, PT-P, PT-S`.
- Carat-specific rings: metal, then grade, then carat.
- Wedding bands and earrings: metal-prefixed SKU, e.g. `14WG-VINCENT-3MM`.
- CHRISTINE bracelets: 7 metals x 5 weights (100/200/500/800/900 meaning
  1.00 to 9.00 ct).

Filenames are NOT consistent. Check the Files listing per product rather than
composing a name from a pattern. Known oddities: `ANDREW_RG1.png` (no second
underscore), `ARIELG1_<hash>.png` (no underscores at all), `MIAG0.202.png` and
`BIANCAG0.203.png` (mangled), `GLOW_RG_1.0_1.png` (one decimal, not two).
BIANCA runs 0.20/0.30/0.50, not 1.00.

Twin products often SHARE the same MediaImage records for their yellow shots,
but new media must still be attached per product.

### 10e. Also done this session

- **KARIN and KLARA pricing**, see 3b. Verified end to end by adding to the live
  cart: KARIN lab Platinum/Signature/0.30ct now resolves to `KARIN-PT-S-030-LG`
  at $1,980, matching the displayed price.
- **`snippets/cart-drawer.liquid` in WEB 19** de-crowded, see 4b. Counts visible
  non-underscore properties and shows the variant options block only when there
  are none, so configurator rings stop printing Metal/Grade/Carat twice while
  charms and silver keep their options.

### 10f. Still open from this session

- **12 configurator families' `metal_images` unaudited** (MIA, MADELINE, ELISE,
  STELLA, SERENA, BIANCA, KARIN, KLARA, EMILY, SELMA, KATARINA, ARIEL).
- **`sections/main-cart.liquid`** still lacks the de-crowding guard that
  `cart-drawer.liquid` now has.
