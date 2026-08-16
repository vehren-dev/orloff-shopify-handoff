# Decisions needed from Viktor

Everything I cannot do myself, ordered by how much it unblocks.
Nothing here is a preference question. Each one stops work.

Already settled by you, not repeated below: v2 short descriptions, shortened
quote names, no ORL- prefix, the taxonomy list, photoless charms kept separate.

---

## TIER 1 — blocks all 316 SKUs

### 1. Retail prices

**316 of 316 rows have no price.** This is the only thing standing between the
catalogue and a sellable Shopify import. Nothing else on this list matters as
much.

You said you would supply a tier table and that I must not derive it from
invoice cost. The proposed structure from your own handoff:

| Tier | Applies to | Count | Price |
|---|---|---|---|
| Classic | letters, birthstone, spacers, plain beads | ~60 | ? |
| Signature | figural bulk | ~180 | ? |
| Statement | large dangles, pave, shell pearl, multi-stone | ~60 | ? |
| Base 17cm | ORCBB01-17 and ORGCBB1-17-* | 6 | ? |
| Base 19cm | ORCBB01-19 and ORGCBB1-19-* | 6 | ? |
| Base 21cm | ORCBB01-21 and ORGCBB1-21-* | 5 | ? |

Total stock at stake: **4,302 pieces, US$27,972 at invoice cost.** Silver has
moved since the invoice was quoted, so this needs to be set off replacement
cost, which is exactly why it is yours and not mine.

**If you give me only one thing, give me this.** 73 SKUs are otherwise
complete and would ship the same day.

---

## TIER 2 — blocks the two non-Shopify channels

### 2. StoreHub product template

I need a blank product export from your StoreHub account so I can map onto its
real columns. Your handoff says do not invent the schema, and I agree. Without
it, that export cannot be built.

### 3. TikTok Shop, two things

- The correct category ID for sterling silver charms in the Thailand marketplace
- Whether your seller account has passed the extra verification TH requires for
  precious metals and jewellery

Both have lead time, so worth starting even while pricing is open.

---

## TIER 3 — photography, blocks 216 SKUs from ever listing

### 4. Do full-resolution masters exist anywhere?

**891 of 921 files in HD PICTURE are under 1200px. Only 6 clear 2048px.** The
dominant size is 1001x1001, which is a web export, not a master. If the
originals exist with Ivy, with the factory, or on another disk, this problem
disappears. If they do not, everything currently photographed is below your own
zoom standard.

Highest-value question after pricing.

### 5. Is the ORCB bead series photographed at all?

216 SKUs have no product photography. That is the entire ORCB bead line plus
all 26 letters, 12 zodiac and 12 birthstone charms. **2,604 pieces, US$13,247
at cost, currently unlistable.** I now know what every one of them looks like
from the invoice photographs, so naming is done, but you cannot sell a charm
without a photo.

### 6. Reshoot needed on shared images?

Some folders reuse the same photograph across genuinely different products:

- **18 quote tags** (ORGCB182-*, 184-*, 186-*, 187-*) share 11 of their 16 files.
  Each carries a *different engraved quote*, so a shared photo shows the wrong
  text. Only 5 images per folder are that SKU's own.
- **5 ORGCB51 daisies** share images across five different colours.
- **ORPA0142 / ORPA0147** share two files.

Confirm whether the exclusive images are genuinely correct, or whether the
photographer shot one and reused the rest.

### 7. ORGCB22-P and ORGCB30-P live in two folders each

Top level and under `Orloff customized design`. Most files are byte-identical
but each folder holds shots the other does not, and both contain a *different*
image called `1.jpg`. My plan merges and dedupes so nothing is lost. Confirm
both sets are the same physical product and not a re-plate or a sample.

### 8. Exclude the -R landscape crops from product uploads?

Files ending `-R` are always 970x600 banner crops, never square product shots.
82 of them in scope. My assumption is they are not product images. Confirm.

### 9. ORCBB01 bracelet photography

One image set currently serves 17, 19 and 21cm. You confirmed bracelets share a
photo across sizes, so this is fine, but say if you want them shot separately.

---

## TIER 4 — naming, blocks 29 SKUs

### 10. The 27 religious and national pieces

I will not name these and I want to be clear why. Buddha heads, seated crowned
figures, a Garuda, a temple lion, a shrine, a many-armed deity, a figure riding
an elephant. I can describe the form but I cannot reliably tell you which
specific figure each one depicts. Your own handoff calls careless naming here a
reputational risk in your home market, and guessing is precisely what would
cause that harm.

These need someone who knows the iconography, not someone who knows jewellery.

Full list with my form descriptions is in `dangle-identifications.tsv`, filter
on HOLD.

### 11. ORGCB22, the Garuda, separately

The Garuda is the **state emblem of Thailand**. Its commercial use is
restricted. This may not be listable at all, regardless of naming. Worth a
specific check before it goes anywhere near a storefront.

### 12. ORCB04

I looked at it twice. A small dimpled sphere on a thin neck joined to a larger
dimpled sphere, two legs, oval base with scrollwork. White and red enamel,
11.5mm. Sheep, swan or poodle. I will not guess. Invoice row 88, image
`invoice-images/img_0080.jpg`.

### 13. ORGCB175, is it Hans Christian Andersen?

A top-hatted profile with stars around the band. Given the rest of the Danish
set (Little Mermaid, Dannebrog, Royal Guard) it almost certainly is, and he
wrote The Little Mermaid which is ORGCB25. But I will not put a real person's
name on a product without you confirming. Image `img_0507.jpg`.

### 14. ORCB176, merge or not

**Resolved the factual question:** rows 222 and 491 show the *same* tree of life
bead. Same 2.6g, same 11mm, same subject. Your handoff assumed two different
products; it is one product ordered twice at different unit prices.

| Row | Qty | Unit | Total |
|---|---|---|---|
| 222 | 30 | $7.22 | $216.60 |
| 491 | 20 | $7.48 | $149.60 |

Recommend **one SKU, 50 pieces, blended cost $7.32.** SKU is currently blank on
both rows so the import cannot break. Your call because it changes stock and
cost figures.

---

## TIER 5 — commercial and legal risk

### 15. Trademark exposure on two SKUs

- **ORCB180** is a pave S inside a diamond shield under a crown. Very close to
  the Superman emblem, which DC Comics protects.
- **ORCB182** is a cube faced with green, white and orange enamel squares.
  Very close to the Rubik's Cube, which is protected.

I named both neutrally on purpose (`Crowned Shield Charm`, `Puzzle Cube Charm`),
which lowers the risk, but the products are what they are. Take advice before
listing. This is not a naming problem.

### 16. ORCB33-G is engraved "Augest"

The August birthstone charm has the month **misspelled on the metal.** Not a
data error. I checked all twelve; the other eleven are correct. 20 pieces in
stock.

Options: sell as is, sell discounted with the flaw disclosed, hold, or return to
the factory. Commercial call, but it should not go live unnoticed.

### 17. ORCB113 positioning

The multicolour puzzle heart reads as the autism awareness motif. Not a problem,
but how you position it is a decision rather than a naming one.

---

## TIER 6 — small data confirmations

### 18. ORPA034 or ORPA0034?

The invoice prints `ORPA034` at row 433, three digits, against four digits
everywhere else in the series. The image file is named `PA0034`. Both readings
confirmed from their own source. Which goes into Shopify?

### 19. ORCB183 letter sizes

Every letter except A has a blank Size field on the invoice. Weights run 1.10g
(Y) to 2.20g (Z), a two times spread, so applying A's 10.5mm across the series
looks unsafe. Either measure them or leave the field empty.

### 20. ORGCB56-L has no photograph

The blue Love charm. Its siblings in black and red both have images. Named from
the pattern, but confirm the product exists as expected.

### 21. Confirm GCB108, GCB176, GCB178 are excluded

All three have image folders but are **absent from all 554 invoice rows**.
Photographed but never ordered. My conclusion is exclude. Confirm.

---

## Summary: the shortest path to selling something

1. **Prices.** 73 SKUs go live immediately.
2. **Masters, or a reshoot plan.** Decides whether the other 214 photographed
   SKUs launch at 1001px or wait.
3. **Everything else** can trail behind without holding up revenue.

The 27 religious pieces, the two trademark items and the Augest defect are the
three things I would not let slip through unreviewed, regardless of timing.
