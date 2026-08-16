# Description samples for review, v2

Rewritten shorter. The first pass explained *why* things were made the way they
were and closed on a neat line. Both cut.

Before:

> The letter A in 925 sterling silver, finished in oxidized silver so the shape
> stays legible against a polished chain. An initial is the simplest way to make
> a bracelet specific to one person.

After:

> The letter A in 925 sterling silver with an oxidized finish. Wear a single
> initial, or spell out a name.

One or two short sentences. Say what it is, give one reason to want it, stop.

Six samples: five charms across categories, plus one bracelet because its
template differs. A bracelet cannot say "Fits all Orloff snake chain bracelets".

**Do not proceed to the remaining 90 until these are approved.**

---

## 1. ORCB183-A, Letter A Charm
*Personal — Letters. Invoice row 230.*

```html
<p style="font-family: Inter, sans-serif;">The letter A in 925 sterling silver with an oxidized finish. Wear a single initial, or spell out a name.</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> Oxidized Silver<br>
<strong>Size:</strong> 10.5mm<br>
<strong>Weight:</strong> 1.80g</p>

<p style="font-family: Inter, sans-serif;"><strong>Fits all Orloff snake chain bracelets.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

---

## 2. ORCB32-Leo, Leo Zodiac Charm
*Personal — Zodiac. Invoice row 463.*

```html
<p style="font-family: Inter, sans-serif;">The Leo sign in 925 sterling silver, oxidized and set with blue enamel. One of twelve in the zodiac series.</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> Oxidized Silver<br>
<strong>Stone:</strong> Blue Enamel<br>
<strong>Size:</strong> 11mm<br>
<strong>Weight:</strong> 2.54g</p>

<p style="font-family: Inter, sans-serif;"><strong>Fits all Orloff snake chain bracelets.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

---

## 3. ORCB33-BL, September Birthstone Charm, Sapphire
*Personal — Birthstone. Invoice row 475.*

```html
<p style="font-family: Inter, sans-serif;">A 3mm sapphire set in oxidized 925 sterling silver. September's birthstone, one of twelve in the series.</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> Oxidized Silver<br>
<strong>Stone:</strong> 3mm Sapphire<br>
<strong>Size:</strong> 11mm<br>
<strong>Weight:</strong> 1.56g</p>

<p style="font-family: Inter, sans-serif;"><strong>Fits all Orloff snake chain bracelets.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

---

## 4. ORPA0107, Dragonfly Clip, Blue Enamel
*Spacers & Clips. Invoice row 442. Named and described from the photograph.*

```html
<p style="font-family: Inter, sans-serif;">A silver dragonfly with pale blue enamel wings. Clips grip the chain, so your charms stay where you put them.</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> Oxidized Silver<br>
<strong>Stone:</strong> Blue Enamel<br>
<strong>Size:</strong> 8.2mm x 10.3mm<br>
<strong>Weight:</strong> 1.50g</p>

<p style="font-family: Inter, sans-serif;"><strong>Fits all Orloff snake chain bracelets.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

---

## 5. ORGCB184-1, Lao Tzu Quote Charm
*Category unassigned, see open questions. Invoice row 538.*

```html
<p style="font-family: Inter, sans-serif;">A hanging tag engraved with "The journey of a thousand miles begins with one step.", attributed to Lao Tzu. Rhodium plated with a sand effect finish.</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> Rhodium Plated, sand effect<br>
<strong>Size:</strong> 12mm x 17mm x 2.5mm<br>
<strong>Weight:</strong> 3.1g</p>

<p style="font-family: Inter, sans-serif;"><strong>Fits all Orloff snake chain bracelets.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

---

## 6. ORGCBB1-19-B, Snake Chain Bracelet with Enamel Accent, 19cm, Blue
*Type: Bracelet. Invoice row 516. Note the different closing line.*

```html
<p style="font-family: Inter, sans-serif;">A 19cm sterling silver snake chain with a blue enamel bead at the clasp. Rhodium plated.</p>

<p style="font-family: Inter, sans-serif;"><strong>Material:</strong> 925 Sterling Silver<br>
<strong>Finish:</strong> Rhodium Plated with Enamel<br>
<strong>Length:</strong> 19cm<br>
<strong>Weight:</strong> 16.50g</p>

<p style="font-family: Inter, sans-serif;"><strong>Takes all Orloff charms.</strong></p>

<p style="font-family: Inter, sans-serif;"><strong>ORLOFF OF DENMARK.</strong></p>
```

---

# Decisions still needed before I write the remaining 90

**1. Quote charm product names.** Verbatim as instructed, ORGCB182-7 becomes
"Aristotle Quote Charm, Happiness is the meaning and the purpose of life, the
whole aim and end of human existence." That is 118 characters and an unusable
handle. Options: keep verbatim, shorten to `Aristotle Quote Charm, No. 7` with
the quote in the description only, or truncate to the first clause. Verbatim is
in the spreadsheet for now so nothing is lost.

**2. SKU format.** Phase 3 column table says `ORL-` + model number. Appendix A
says the full model number with the OR prefix "is what goes into Shopify".
That is `ORL-ORCB01` versus `ORCB01`. I used the Appendix A form.

**3. Quote charms have no category.** 18 SKUs. `Milestones & Sentiment` is the
closest fit but not obviously right.

**4. Bracelets have no category.** The taxonomy covers charms only. 17 bases.

**5. ORPA0107 size.** Appendix A says the ORPA two number format is bore x outer
diameter. Here that reads 8.2 x 10.3mm, a 1mm wall. For a clip with a dragonfly
on top, 8.2mm is more likely the ornament height. Written neutrally as
"8.2mm x 10.3mm" rather than labelling either number.

**6. ORCB183 letter sizes.** Every letter except A has a blank Size field.
Weights run 1.10g to 2.20g, a two times spread, so one 10.5mm default across
the series looks unsafe. Sample 1 uses 10.5mm only because A has a real value.

**7. Oxidized versus oxidised.** American spelling used, matching the invoice's
own "Oxidized Silver". Say if you want British spelling in the prose.
