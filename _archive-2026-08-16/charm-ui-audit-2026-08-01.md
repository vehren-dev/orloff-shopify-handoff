# Charm line UI audit, 1 Aug 2026

Audited against the live Shopify data (272 products, 11 collections, WEB 15 theme)
and benchmarked against Pandora, Trollbeads, Thomas Sabo, Soufeel and Chamilia.

Everything below was read off the store, not assumed. Sample sizes are stated
where a full sweep was not run.

---

## 1. Blocks publishing

### 1.1 Internal build notes are live in customer-facing descriptions

Three found in a 25-product sample. This is the most serious finding in the audit.

- **Love Charm, Red Enamel** — "Confirms the handoff's reading: this is the red
  sibling of ORGCB56-B (black) and ORGCB56-L (blue). SKU written in canonical OR
  form though the invoice prints GCB56-R."
- **Fox Charm, Rose Gold** — "Could be a cat."
- **Puzzle Heart Charm, Multicolour** — "Note this reads as the autism awareness
  motif; decide how you want it positioned."

The third is the dangerous one. It is a live product page telling a customer that
the brand noticed an autism-awareness association and has not decided what to do
about it. If that reaches a customer it reads as careless at best.

Found 3 in 25 sampled, so expect roughly 25 to 35 across all 272. Every
description needs a pass before publish. Search for: "handoff", "invoice",
"Note ", "decide", "Could be", "confirms".

### 1.2 The charm line is unreachable from the site navigation

`main-menu` is:

    BROWSE
      ENGAGEMENT RINGS / WEDDING BANDS / FINE JEWELRY
      ETERNITY BANDS / ONE OF A KIND / SILVER
    DIAMONDS
      ABOUT DIAMONDS
    ABOUT US

There is no Charms entry. 272 products and 11 collections with no route in other
than search or a direct URL. This is a five-minute fix in Navigation and it gates
everything else.

Footer menu contains exactly one item, "SEARCH". Category leaders use the footer
as a secondary category index; this is a wasted surface.

### 1.3 Sixteen watermarked images still live on nine products

Unchanged since 31 Jul. Positions 2 to 4, no leads affected.

---

## 2. The biggest conversion gap: one photo per charm

Sampled 75 products across two sort orders. **Every one had exactly one image.**
Only the nine ORGCB products carry three or four, and those extra frames are the
watermarked ones.

This is the single largest gap against every competitor in the category:

| Brand | Images per charm | Includes |
|---|---|---|
| Pandora | 3 to 5 | charm alone, on a bracelet, styled on wrist |
| Trollbeads | 3 to 4 | alone, on bracelet, in a group |
| Thomas Sabo | 3 to 4 | alone, scale shot, lifestyle |
| Soufeel | 4 to 6 | alone, on bracelet, packaging, gift box |
| **Orloff** | **1** | alone, on white |

Why it matters more for charms than for other jewellery: a 12mm object
photographed alone on white gives a customer no sense of scale. The single most
common pre-purchase question in this category is "how big is it actually, and
what does it look like on the bracelet". Pandora answers it before it is asked.

The strongest available fix costs no new photography: **one styled shot of a
loaded bracelet per category**, reused as the second image across every charm in
that category. Eleven photographs, not 272. It gives scale, shows the bracelet,
and cross-sells the gateway product on every charm page.

The `products_hover_image` setting is already `true`, so image 2 becomes the grid
hover state automatically. Right now that setting does nothing for 263 of 272
products because there is no second image to show.

---

## 3. Description quality

The prose descriptions are genuinely good — specific, physical, unhyped. The spec
blocks under them are not.

### 3.1 Data glitches carried through from the invoice

- `Stone: Stone :None` (Carousel Charm) — label duplicated, space before colon
- `Stone: Stone: White+Purple` — "Stone:" duplicated, widespread
- `Stone: Stone: Muti-color` — misspelling, appears on multiple products
- `Finish: Rosegold Plated` — should be "Rose Gold Plated"
- `Stone: Orange+Black+ Blue Enamel` — inconsistent spacing around `+`

These are mechanical and scriptable. They are also exactly the kind of detail that
signals "drop-shipper" to a customer comparing against Pandora.

### 3.2 Prose contradicts the spec block

- **Elephant Charm** — prose says "Polished silver", spec says
  "Finish: Oxidized Silver"
- **Turtle Charm** — prose says "Yellow enamel shell with blue spots, black enamel
  feet", spec says "Orange+Black+ Blue Enamel"
- **Fox Charm** — prose says "Rose gold plated with a white enamel face", spec says
  "Finish: Rosegold Plated" and "Stone: White Enamel"

The prose was written from the photographs, the spec from the invoice. Where they
disagree, the photograph is almost certainly right.

### 3.3 Inline styles on every paragraph

Every description paragraph carries `style="font-family: Inter, sans-serif;"`.
This hardcodes a font into product data, overrides the theme, and will not follow
if the brand typography ever changes. It is also what made the CSV quote-escaping
bug possible. Strip it and let the theme style the description.

---

## 4. Merchandising and browse

### 4.1 No filters on a 270-product collection

`enable_filtering` is on in the theme, but storefront filters come from Search &
Discovery and nothing is configured. A customer landing on All Charms gets 270
products, 20 per page, sorted alphabetically. Fourteen pages.

Every competitor filters by at least theme, colour, and price. For this catalogue
the high-value facets are:

- **Price** — three clean bands already exist at $29 / $39 / $49
- **Colour** — the enamel colour is in nearly every description and could be a tag
- **Material or finish** — oxidized, rhodium, rose gold, 18K
- **Occasion** — birthday, wedding, new baby, graduation

Colour is the one to build first. "Show me the pink ones" is how charms are
actually shopped, and the data to support it already exists in the descriptions.

### 4.2 Alphabetical sort is wrong in three collections

Still `ALPHA_ASC` everywhere. It is actively wrong for:

- **Zodiac** — reads Aquarius, Aries, Cancer, Capricorn, Gemini. Should run Aries
  to Pisces.
- **Birthstone** — reads April, August, December, February. Should run January to
  December.

Both need converting to manual collections to fix. Letters are fine alphabetically.

### 4.3 Fifty near-identical items dominate the default browse

Letters (26), Zodiac (12) and Birthstone (12) are 50 of the 270 in All Charms, and
alphabetically they clump — every "Letter X Charm" lands together. A customer
browsing All Charms hits a wall of near-identical silver initials on pages 8 and 9.

Pandora solves this by keeping personalised ranges out of the main charm browse and
routing them through their own landing pages. Consider excluding Letters, Zodiac
and Birthstone from All Charms and letting the category row carry them.

---

## 5. Product data

### 5.1 Bracelet titles

    SPARKLE - SNAKE CHAIN
    PEACE - SNAKE CHAIN

Two problems. They are the only CAPS titles among 272 Title Case products, which
shows up in cart, checkout, order emails and Google results where CSS cannot fix
it. And neither contains the word "bracelet" — nobody searches "sparkle snake
chain". These are the two most important products in the line: the bracelet gates
every charm sale.

Suggested: `Snake Chain Bracelet, Pave Clasp` and `Snake Chain Bracelet, Enamel
Clasp`.

### 5.2 Bracelet variant structure

`PEACE - SNAKE CHAIN` has option "Colour" with values White, Red, Black, Blue,
**Flower**. Flower is not a colour. Per the 31 Jul note these clasps are enamel
motifs, not plain colours — the blue one is a peace symbol engraved ORLOFF OF
DENMARK. The option should be named "Clasp" and the values should describe the
motif.

Also: 5 colours x 3 sizes = 15 combinations, but only **14 variants exist**.
Flower / 21cm is missing.

### 5.3 No compare-at price anywhere

`compareAtPriceRange` is null on every product. No anchoring, and no mechanism for
a sale. Worth noting that the pricing memo anchors the bracelet against Pandora's
฿3,500 — that argument is made nowhere on the site.

### 5.4 Alt text is present but thin

Every image has alt text, which is better than most stores. But it duplicates the
product title exactly — "Corgi Charm" for both. Alt text that describes the object
("Sterling silver corgi charm with enamel face and bow tie") earns image search
traffic; a duplicate title does not.

---

## 6. What competitors do that Orloff has no answer to

### 6.1 The bracelet builder

Pandora, Trollbeads and Soufeel all run a guided "build your bracelet" flow: pick
the chain, add charms, see it assembled, one add-to-cart. It is the single highest
-AOV feature in the category, because charm buying is inherently a multi-item
purchase and the default flow makes it a series of single-item purchases.

Orloff has 270 charms, 2 bracelets, and no bundling of any kind. Even a static
"Start with the bracelet" block on every charm page would help. The charm template
already has room for it.

### 6.2 Volume offers

Pandora runs 3-for-2 on charms near-permanently. Soufeel runs buy-3-get-1. Neither
is a discount strategy so much as a basket-size strategy — the offer is what turns
one charm into three.

At 76% gross margin there is room. A 3-for-2 on $39 charms still clears well above
cost, and it converts the browse problem in section 4.3 into an advantage: 270
options is overwhelming when buying one, and appealing when buying three.

### 6.3 Compatibility positioning

This is the strategic one, and it is Viktor's call, not mine.

Every description says "Fits all Orloff snake chain bracelets" — a closed
ecosystem. Soufeel, Chamilia and most of the third-party market instead lead with
Pandora compatibility, because "charms that fit Pandora bracelets" is where the
search volume is. These beads are built on the standard 4.5mm core; they
physically fit.

Stating that is legally possible under nominative fair use in most markets but
Pandora defends its marks aggressively, and Thailand is not a market where a small
brand wants that fight. The upside is real and so is the risk. Worth proper advice
before anyone writes it on a page.

### 6.4 Social proof

`show_products_rating` is false and no reviews app is installed. Pandora shows
review counts on charm cards in the grid. For an unknown brand at $29 to $49
against a $50 Pandora charm, reviews do more work than they do for Pandora itself.

---

## 7. What is already good

Worth saying, because most of this line is in better shape than a first-year store.

- **Collection copy and SEO are excellent.** Every one of the 11 has a hand-written
  intro in house voice, an SEO title under 60 characters and a description under
  160. "Spacers give charms room to sit. Clips grip the chain so a group stays
  exactly where you place it" is better than what Pandora writes.
- **Product SEO is complete** — all 272 have title and description set.
- **Alt text exists on every image**, which most stores skip entirely.
- **Inventory is tracked with real quantities**, 9 to 30 per charm.
- **Pricing is coherent** — three clean bands, round numbers, defensible against
  the Pandora anchor.
- **The category row now matches the house design language** and uses the same
  animated underline as the fine jewelry section.

---

## 8. Recommended order

**Before publishing anything**

1. Sweep all 272 descriptions for internal notes. Non-negotiable.
2. Add Charms to the main menu.
3. Clear or detach the 16 watermarked images.
4. Rename the two bracelets.

**Before spending on traffic**

5. One styled bracelet shot per category, reused as image 2 across that category.
6. Fix the spec-block glitches and the prose/spec contradictions.
7. Configure colour and price filters in Search & Discovery.
8. Fix Zodiac and Birthstone sort order.

**To raise basket size**

9. A "start with the bracelet" block on the charm template.
10. A volume offer, 3-for-2 or equivalent.
11. Reviews.

**Strategic, needs a decision**

12. Compatibility positioning.
13. The 26 unnamed religious and national pieces.
14. Whether Letters, Zodiac and Birthstone belong in All Charms.
