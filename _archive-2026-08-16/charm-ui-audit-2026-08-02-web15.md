# UI check — WEB 15 (North 10.0.0), Orloff of Denmark

**2 Aug 2026, second pass.** This supersedes the earlier DOM-only run of the same
day and folds its findings in. Every item from that pass was re-tested and its
current status is recorded below, so nothing is lost by reading only this file.

The difference between the two runs is that this one had **a rendered browser**.
The earlier pass never got a displayed pane, so it could measure layout but could
not see anything. Roughly half of what follows is invisible to DOM measurement.

Tested against `?preview_theme_id=189575168290` at 1440px, 768px and 375px.
Theme confirmed live as `WEB 15 / North 10.0.0 / unpublished` from
`Shopify.theme`. Cart was exercised with a real add of five charms and restored
afterwards to the single PEACE bracelet it started with.

---

## Critical

### 1. The hover second image is publishing watermarked photographs

The feature itself **works and should ship**. On hover, `imgA` fades to 0 with
`scale(1.08)` and `imgB` to 1, cross-faded in the same square. On the Aristotle
and Lao Tzu cards the detail shot makes the engraved quote genuinely readable at
grid size, which was the whole point of building it. That question is now closed.

The problem is what it puts on screen. All 55 second images were scanned on
canvas using the project's own navy/gold detection, against the *displayed*
`?width=320` rendition:

> **34 of the 55 hover images carry the ORLOFF crest watermark.**

The scan validates itself against known data: all eight products that received
de-watermarked `-nl` files come back clean, and `danish-flag-charm-pave` — the
one product of the nine that never got an `-nl` file — is correctly flagged.

This is a **different and larger set** than the 16 images already tracked. Those
sit at position 2–4 on a product page. These are one hover away on the main charm
rail, which is the primary browse surface for 269 products.

Two of them matter especially: `lotus-flower-charm-18k-gold` and
`tassel-charm-18k-gold` are watermarked while their plain siblings
`lotus-flower-charm` and `tassel-charm` are clean. The gold variants were missed
in the de-watermarking pass.

**The 34 watermarked:**

    acorn-charm                       lao-tzu-quote-charm-calm
    aristotle-quote-charm-discipline  lao-tzu-quote-charm-freedom
    aristotle-quote-charm-education   lao-tzu-quote-charm-love
    aristotle-quote-charm-friendship  lao-tzu-quote-charm-silence
    aristotle-quote-charm-happiness   lao-tzu-quote-charm-the-flame
    aristotle-quote-charm-knowledge   lao-tzu-quote-charm-the-journey
    aristotle-quote-charm-purpose     lao-tzu-quote-charm-the-traveller
    aristotle-quote-charm-wisdom      lemon-charm-14k-gold
    daisy-charm-blue                  longevity-charm-blue-enamel
    daisy-charm-purple                lotus-flower-charm-18k-gold
    daisy-charm-red                   love-charm-black-enamel
    daisy-charm-white-and-yellow      prosperity-charm-blue-enamel
    daisy-dangle-pink                 starry-night-spacer-blue-enamel
    danish-flag-charm-pave            tassel-charm-18k-gold
    engraved-quote-charm-a-smile
    engraved-quote-charm-the-mirror
    engraved-quote-charm-the-moon

**The 21 clean:** butterfly-clip-red-stone, butterfly-spacer-clear-stones,
coat-of-arms-charm, danish-flag-charm-red-enamel, dragonfly-clip-blue-enamel,
durian-charm, engraved-quote-charm-possible, flamingo-charm,
fluted-clip-clear-stone, lilac-daisy-spacer, little-mermaid-charm,
lotus-flower-charm, pink-enamel-spacer, polished-dome-spacer,
polished-spacer-pink-stone, royal-guard-charm, scroll-spacer-oxidized-silver,
tassel-charm, top-hat-portrait-charm, tulip-spacer-pink-stone, whale-tail-charm.

Either de-watermark the 34, or gate the hover on a clean-image list until they
are done. Shipping the rail as it stands puts the crest on 34 cards.

### 2. Homepage heroes still ship 12.84 MB with no `srcset`

Unchanged since the first pass. Re-measured by `HEAD` request:

| File | Size | `srcset` | `fetchpriority` |
|---|---|---|---|
| `WEDDING_IMAGE.png` | **5,554 KB** | none | `false` |
| `ENGAGEMENT_IMAGE.png` | **5,205 KB** | none | `false` |
| `DIAMONDS_NEW_IMAGE.png` | **1,425 KB** | none | `false` |
| `SOLAR_copy.jpg` (LCP) | 290 KB | none | `high` |
| `IMG_2034_copy_2.jpg` | 273 KB | none | `false` |
| `MICRO_ALL_2_PNG.jpg` | 239 KB | none | `auto` |
| `IMG_0224.jpg` | 159 KB | none | `false` |

The three PNGs are 12.2 MB of the 12.84 and are photographs saved as PNG. The
four Fine Jewelry category tiles on the same page already do `srcset` correctly —
copy that pattern.

`fetchpriority="false"` is not a valid value (`high` / `low` / `auto`). Five
images carry it.

### 3. Mobile sticky add-to-cart bar still collapses at 375px

On `product/katarina-lab-grown`. Partially improved since the first pass —
`.rc-sticky-bar__config` now has `text-overflow: ellipsis` where it previously
hard-clipped mid-word. It is still unusable:

- `.rc-sticky-bar__config` — 54px wide, needs 322px. Ellipsis on 54px shows about
  four characters of
  `14K Yellow Gold · Signature SI1/H · 0.5 ct · Lab Grown`.
- `.rc-sticky-bar__name` — 54px wide, needs 76px, `overflow: visible`, so
  "KATARINA" still spills out of its box.

Price (102px) and button (140px) take the space. Fine at 768px and up.

---

## Should fix

### 4. No scrim behind any hero text

Every one of the six overlay heroes measures **zero** semi-transparent overlay
elements. White type sits directly on the photograph, so legibility is entirely
at the mercy of whatever is behind it.

- **Loose Diamonds** is the worst — white text over bright faceted diamonds. The
  subtitle is close to unreadable.
- **Solar Grown Diamonds**, the LCP hero, is marginal on pale wood.
- **About Us** is a composition fault rather than contrast: the words "ABOUT US"
  land directly on top of the engraved "ORLOFF OF DENMARK" on the ring, so two
  sets of type overlap.
- Engagement Rings, Wedding Bands and One of a Kind are acceptable.

A consistent scrim, or a text shadow, fixes all six at once.

### 5. The BROWSE mega-menu has an empty column

"ETERNITY BANDS" renders as a column heading with no items beneath it, sitting
between two populated columns. `/collections/eternity-bands` itself resolves 200.

### 6. NECKLACES and PENDANTS are two menu items with one destination

Both point at `/collections/necklaces-pendants`. The same duplicate pair appears
in the mobile drawer's link list.

### 7. Two menu links silently drop their filter

Unchanged. Both still resolve 200 to the wrong place:

- `/collections/fine-jewelry/rings` → `/collections/fine-jewelry`. No `rings`
  tag exists. **This link is in the footer as well as the menu** — the first pass
  only caught the menu.
- `/collections/fine-jewelry/necklaces+pendants` → `/collections/fine-jewelry/pendants`.

### 8. Footer problems

- A large dead zone. SIGNUP sits in column one while roughly three-quarters of
  the footer width below the link lists is empty navy.
- **"SEARCH" renders as an orphaned bare word** under the language and currency
  selects. This is the one-item footer menu showing through.
- The column headed **"FREQUENTLY ASKED QUESTIONS"** contains Sizing, Returns,
  Shipping, Privacy Policy and Terms of Service. Those are policies, not FAQs.
- No Charms link anywhere in the footer.

### 9. Three templates still have no `<h1>`

`/pages/about-us`, `/pages/diamonds` and the 404 page. Every other page has
exactly one.

### 10. Missing alt text, unchanged

8 of 19 homepage images and 7 of 9 on `/pages/about-us`. The homepage eight are
the six GIA marquee logos plus the One of a Kind and About Us heroes, both of
which carry `alt=""` while holding real content.

### 11. Filters and the selection tray scroll away on mobile

`.ccol__rail` is `position: sticky; top: 24px` on desktop, so REFINE and YOUR
SELECTION follow you down the grid correctly. On mobile it computes to `static`.

The mobile charm page is **38,080px tall**. The filters sit at 1,504px and the
grid starts at 2,171px, so past the first screen and a half there is no way to
filter, and no visible running total, until you scroll all the way back up. The
fixed back-to-top button is the only mitigation.

### 12. Cart quantity cannot be changed from the drawer

`.mini-quantity` is a `<span>`, not an input. A line can be removed but not
adjusted without going to the full cart page.

---

## Copy

- **"World's most environment friendly diamonds."** — homepage hero. Needs an
  article, and "environmentally friendly" or "environment-friendly".
- **"I AGREE TO RECEIVING MARKETING EMAILS AND SPECIAL DEALS"** — newsletter
  consent. Should be "agree to receive".
- **"© 2026 Orloff of Denmark, All rights reserved."** — comma splice.

---

## Accessibility

- `button.mobile-toggle` is a correct 44×44 but has **no `aria-label` and no
  `aria-expanded`**, so the menu button is unnamed and its state is not exposed.
- Cookie banner at 375px: "I Accept" is 48×12 and "privacy policy" 79×15, both
  well under the 44×44 guideline.
- Cart quantity has no `aria-label`; sort, currency and language selects rely on
  `.visually-hidden` labels not wired via `for`.

---

## SEO

- Homepage `<title>` is 17 characters, "Orloff of Denmark".
- `/collections/all` has **no meta description**.
- Every other page checked has a good title and description.

---

## Catalogue

Confirmed live, all previously recorded and all still open:

- **Birthstone charms sort alphabetically** — April, August, December, February,
  January, July, June, March, May, November… This reads as broken to a shopper
  more than the zodiac case does.
- **Zodiac charms sort alphabetically** — Aquarius, Aries, Cancer, Capricorn.
- **Both bracelets are still titled in caps**, `PEACE - SNAKE CHAIN` and
  `SPARKLE - SNAKE CHAIN`, and neither contains the word "bracelet". Note that
  the cart drawer applies `text-transform: uppercase` to every line, so the caps
  are invisible there — the damage shows at checkout and in order emails.

---

## Verified working

Seen rendered for the first time, all correct:

- **Search modal** — correctly centred, has an × close as well as the Esc hint,
  predictive results with suggestion chips.
- **Cart drawer** — opens, populates, and with six items grows a scroll container
  while CHECKOUT stays pinned flush to the bottom. An earlier suspicion that it
  would overflow unreachably was tested directly and is wrong.
- **Charm rail** — 269 cards, 5-up desktop and 2-up at 375px, no horizontal
  overflow at any width, REFINE panel (4 metal, 10 colour, 3 price), CLEAR ALL,
  YOUR SELECTION tray with disabled ADD TO CART at zero. Filters render above the
  grid on mobile.
- **Sibling selector** — renders 12 signs in true astrological order, current
  item marked `aria-current="true"`, heading spans separated by an 8px margin.
- **Collection banner bars** — all 11 charm collections carry the block, all on
  navy `#091b36` with accent `#bc973f`.
- **Category rail** — all tiles equal height, no clipping.
- Mobile menu drawer's closed state is a correct `translateX(-337.5px)` with
  `visibility: hidden`.

---

## Not verified

**The mobile menu drawer open state.** Chrome was maximised and would not resize
below 1536px, so the hamburger never rendered there; in the secondary pane the
toggle ignores synthetic `click()` and dispatched pointer sequences, and GSAP is
rAF-throttled while the window is not composited. It needs one real click at
phone width in a visible window.

Scroll-triggered animations were likewise not timed. The header background
transition was observed taking over a second to settle, but the window reported
`visibilityState: hidden` throughout, which throttles `requestAnimationFrame`, so
that number is an artefact and not a defect. **Do not record animation timings
taken in this environment.**

---

## Addendum, carried forward — the add-a-bracelet pop-up

Retained verbatim in substance from the earlier pass, still true.

The overnight run reported a deterministic failure on the PEACE bracelet: pass
through the missing Flower / 21cm combination, pick a valid one, add to cart, and
the pop-up never fires.

**Retested twice on WEB 15, every request 200, no throttling. The pop-up fired
both times**, including on a 250ms fast-click race before the section render had
settled. `/cart/add` returns **JSON** to `fetch` — the "returns HTML" diagnosis
was wrong. The original failure was 429 throttling on the `?section_id=` render
endpoint, which stalls the variant update.

Not a defect. See `RESUME.md` for the full trace.

---

## Note for whoever reads RESUME.md next

Two statements in `RESUME.md` are now out of date and will cost time:

1. **"THE ONE THING TO DO NEXT: put Charms in the main menu."** Charms is already
   in the main menu, under SILVER → `/collections/all-charms`. Verified live.
2. **"Hover second image — built, not yet seen."** It has now been seen and it
   works. What it needs is not a look but the watermark fix in item 1 above.

The watermark list at the bottom of `RESUME.md` covers 16 images on 9 products.
The 34 above are additional to it.
