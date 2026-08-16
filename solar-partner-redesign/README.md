# Solar Grown + Retail Partners redesign

Built 11 August 2026. Nothing is published. Both live pages are untouched.

## Preview

| Page | Preview URL |
|---|---|
| Solar Grown Diamonds | `https://orloffofdenmark.com/pages/solar-grown-diamonds?preview_theme_id=189847503138&view=solar-grown-v2` |
| Retail Partners | `https://orloffofdenmark.com/pages/retail-partners?preview_theme_id=189847503138&view=retail-partners-v2` |

Theme: **WEB 16 - Solar Grown + Retail Partners redesign (PREVIEW)**, id `189847503138`,
an unpublished duplicate of WEB 15. WEB 15 was not modified. The Shopify MCP
tooling refuses writes to the live theme, so this was the only route anyway.

Drop the `preview_theme_id` on a later visit and the cookie keeps you in the
preview theme. Add `?view=` to see the redesign; leave it off and you get the
current published page, which is how the scoping was verified.

## 11 August update: the new Orloff offer

Rebuilt from `Orloff_Sun_Grown_Retail_Partner_Offer.pdf`. The Retail Partners
page went from 11 sections to 15. **WEB 16 is now the source of truth for both
templates; the copies in `templates/` here are behind and need a resync.**

Superseded:

| Was | Now |
|---|---|
| 2 600 USD | **3 195 USD** |
| Three rings, unspecified | **1.00 ct, 2.00 ct, 3.00 ct, 6.00 ct total** |
| Quality unstated | **D colour, VVS2, round brilliant, ideal cut** |
| IGI | **IGI or GIA** |
| 18K gold from certified recycled sources | **Recycled 18K gold** |
| Three decades | **More than 35 years** |
| One founder | **Two gemologists, father and son** |

New sections: complete traceability (diamond, laser inscription, certificate,
ring), "Show it. Sell it. Replace it. Repeat.", two generations, and the Hua Hin
invitation. New facts: the report number is laser-inscribed on the girdle, the
ring is marked with the same number, three customer boxes are included so
samples are sellable, luxury three-ring display, no large diamond inventory
required.

### Decisions that need confirming

1. **The name.** The PDF says **Sun-Grown** throughout. The site, this build and
   the 4 August decision log all say **Solar Grown**, and the log says in terms:
   "Do not reintroduce Sun-Grown." Kept as Solar Grown. Switching would also
   break `/pages/solar-grown-diamonds`.
2. **Dropped: "twenty-five founding retail partners across the Nordic
   countries."** The new offer sets no territory and no partner count, and
   invites people to Thailand. Keeping a Nordic-only limit looked more likely to
   be wrong than right. Easy to restore.
3. **Dropped: "Three decades in fine jewellery and coloured stones."** Replaced
   by the PDF's "more than 35 years", now attributed to the two gemologists
   rather than to one founder.
4. **Dropped from the inclusions list: "retail sales training."** The PDF's list
   does not include it. Everything else in the old list survives.
5. **Kept, though the PDF does not repeat them:** "more than 100 acres of solar
   panels", chain-of-custody documentation on request, no exclusivity, and the
   import duty and VAT answer. None are contradicted.
6. **Name spellings.** The PDF reads "Nils Orloff Ehrenskjold" and "Victor
   Ehrenskjold". The live page reads "Niels Orloff Ehrenskjöld". Kept the live
   spelling for both, on the assumption the PDF dropped the diacritics.
7. **Price format.** Written `3 195 USD`, following the 4 August rule that a
   comma reads as a decimal separator in Swedish. The PDF writes `$3,195`.

## Why it cannot leak

The redesign lives entirely in new `og-*` files that nothing else references.
Confirmed empirically: loading `/pages/retail-partners` inside the preview theme
*without* `?view=` renders the old markup and loads zero `og-brand.css`.

## Files added

    assets/og-brand.css              the whole design system, scoped to .og-section
    snippets/og-styles.liquid        loads the stylesheet
    snippets/og-label.liquid         section label
    snippets/og-button.liquid        primary navy / secondary gold-outline
    snippets/og-image.liquid         responsive image or labelled empty slot
    snippets/og-icon.liquid          16 line icons
    snippets/og-product-card.liquid  real product, or labelled replaceable slot
    sections/og-split-hero.liquid
    sections/og-stats-bar.liquid
    sections/og-process.liquid       navy / grey-green / warm white
    sections/og-card-grid.liquid     spec cards, inclusions, comparison
    sections/og-feature.liquid       image + text, image side is a setting
    sections/og-product-grid.liquid
    sections/og-accordion.liquid     native <details>, no JavaScript
    sections/og-cta-banner.liquid
    templates/page.solar-grown-v2.json
    templates/page.retail-partners-v2.json

Every section is a theme-editor section with editable text, links, images and
blocks. No JavaScript was added. No external libraries. No new font requests:
the theme already serves Cormorant Garamond and Inter.

## Type rule

Cormorant Garamond is allowed in exactly six places, all of them editorial
headings or names:

    .og-h1            page heading
    .og-h2            section heading
    .og-claim         the large heading on navy
    .og-lede          the introduction under the H1
    .og-signoff       "Solar Grown. Orloff of Denmark."
    .og-product__name ring model name
    .og-contact__name the founder's name

Everything else is Inter: prices, statistics, specifications, all labels,
buttons, accordion questions, contact links and form controls.

Two traps worth knowing, both of which caught this build:

- The theme's `head-variables.liquid` sets `h1..h6 { font-family: <heading
  font> }`. Any heading of ours that does not name a font inherits Cormorant.
  That is how the uppercase step labels ("APPLY", "THE METHOD") ended up in the
  serif. There is now a `:where(h1,...,h6)` default to Inter, which carries no
  specificity, so the six serif classes above still win with a plain class.
- Form controls do not inherit `font-family` at all. They are pinned to Inter
  pre-emptively, since neither page has a form yet.

Audited by walking every text node on both pages and reporting anything
computing to Cormorant. Only the classes listed above came back.

The site footer was checked too: its links already render in Inter, and there
is no Cormorant anywhere in it. It is a global theme section, outside these
two pages, so nothing there was changed.

## Numbers are always Inter

Headings are Cormorant Garamond, but every numeral on both pages is Inter, per
the brand system. Two mechanisms:

1. Wholly numeric components set Inter directly: the statistics bar values, the
   hero price figure, the process step numbers, product prices. Their type
   scale is pulled back a little, because Inter runs wider and heavier than
   Cormorant at the same size.
2. Digits sitting inside a serif heading, like "10 on the Mohs scale" or
   "2 600 USD is three rings", are caught by **OG Numerals**, a digits-only
   `@font-face` declared in `snippets/og-styles.liquid`. It has a
   `unicode-range` of `U+0030-0039, U+002B, U+00A0` and points at the Inter
   file the theme has already fetched, so it costs no extra download. Listed
   first in `--og-serif`, it takes the digits and lets everything else fall
   through to Cormorant.

Verified by measuring rendered text at 100px: digits through the serif stack
measure 568.85px, identical to pure Inter, against 430.2px for Cormorant. The
word "Diamond" measures 366.8px through the same stack, identical to pure
Cormorant. So digits switch and letters do not.

If `font_modify` ever returns nothing, the rules are skipped and digits simply
fall back to the serif. Nothing breaks.

If you add a component that displays a figure, use `var(--og-sans)`. If you add
a serif heading, `var(--og-serif)` already handles its digits.

## Measured against the brief

| Target | Desktop | Mobile |
|---|---|---|
| H1 56-64 / 38-42 | 64px | 38px |
| Body 17-18 | 18px | 17px |
| Content width 1160-1200 | 1180px | - |
| Section spacing 96 / 56-64 | 96px | 56px |
| Line length 600-720 | 720px | - |
| Horizontal overflow | none | none |

Dead space under the header: was 130px, now 48px, and the first section owns it.
Cause was `main-page.liquid`'s title wrapper still reserving room for an `<h1>`
that `templates/page.json` hides with `h1 {display:none}`. These templates do
not use that section.

Contrast, measured in the browser: body 6.5-7.2, headings and buttons 16-17,
smallest gold and grey labels 5.0-5.3. Everything clears AA.

## Two bugs found and fixed during the build

1. `.og-section a { color: inherit }` (0,1,1) outranked `.og-btn--primary`
   (0,1,0), so the hero's solid button rendered navy text on navy. Button rules
   are now written `a.og-btn--*`. If you add a button variant, keep that shape.
2. `og-section--first` was on the outer wrapper but the padding is on the inner
   one, so the hero kept its full 96px top space. The class now goes on the
   padded element.

## Content: what changed, and what did not

All factual content from both live pages is present. Nothing was dropped.

Reorganised rather than removed:

- **Eight partner inclusions became six cards.** Photography and the social
  video merged into one card; sales training and digital support merged into
  another. All eight facts survive in the card text.
- **The 5-row ring specification** has no slot in the requested order for the
  Retail Partners page. Rather than drop it, it sits after the Starter
  Collection as a card grid. Includes the Hua Hin dispatch line, which is
  currently live.
- **The 7-question "What partners ask first" FAQ** likewise has no slot in the
  requested order. It is kept as a second accordion after the six questions.
- **Ledger facts** (no annual target, price list on application) moved into the
  Starter Collection footnote.

Written for this build, from facts already on the pages:

- Solar Grown collection intro: "Finished pieces set with Solar Grown lab-grown
  diamonds in 18K gold."
- The three partner process steps, whose titles the brief specified. Supporting
  text recombines existing facts only.
- Counter display card text: "Point-of-sale material for your counter."

One spelling change: the Solar Grown page says "vapor" throughout, so the FAQ
borrowed from the Retail Partners page uses "vapor" there and keeps "vapour" on
the Retail Partners page. Site-wide spelling is still unresolved.

## Accordion focus ring

Chrome matches `:focus-visible` on a `<summary>` for a plain mouse click, not
only for keyboard. A generic ring on the summary therefore drew a full-width
gold box round the question every time anyone opened one, which read as a
broken input field. The ring is now on the question text instead: tight,
square, obvious to a keyboard user, unremarkable to a mouse user.

The ring colour is `--og-gold-ink` (#856825), not brand gold. #bc973f is only
2.7:1 against warm white and fails the 3:1 that WCAG 2.2 requires of a focus
indicator. #856825 is 5.0:1. Brand gold is now decorative only: hairlines,
icons, the accordion plus-minus.

**Not yet verified in a browser.** The Browser pane was not displayed during
this build, so the document never took system focus and `:focus-visible` could
never be exercised. The rules are correct and present in the stylesheet, but
somebody should tab through both accordions and confirm the indicator appears
on the question text before this goes live.

## Still needed before this can go live

**Photography.** Five labelled image slots are empty, three on Retail Partners
and two on Solar Grown, plus six product cards. They render as bordered slots
saying what belongs there. Nothing was faked.

**The three Starter Collection rings.** They are not named anywhere in the live
copy, and the twelve designs are still unselected, so the product cards are
empty by design. The store already holds 18 real `-lab-grown` engagement rings
with photography (KATARINA, ARIEL, SELMA, NOVA and others). Pick three in the
theme editor and each card fills in its own name, photograph, link and price.
Nothing about a product is written into the template.

## Going live, when you are ready

1. Fill the image slots and pick the three rings in the preview theme.
2. Copy the 17 files into the live theme.
3. Set each page's template suffix: `solar-grown-v2` and `retail-partners-v2`.
4. URLs do not change. The old page bodies stay in place as a rollback: clear
   the template suffix and the current pages return exactly as they are now.
