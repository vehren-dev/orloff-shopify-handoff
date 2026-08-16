# Orloff Solar Grown: Retail Partner Program

Status as of 4 August 2026. Read this first.

---

## What is live right now

Two published pages on orloffofdenmark.com. Both were edited through the
Shopify Admin API, both are customer facing, both are current.

| Page | Handle | Shopify ID | Template |
|---|---|---|---|
| RETAIL PARTNERS | `/pages/retail-partners` | 163024044322 | default |
| SOLAR GROWN DIAMONDS | `/pages/solar-grown-diamonds` | 162469806370 | default |

The solar grown page previously used a custom `solar-grown` theme template.
That was changed to the default so both pages share one design system. The
theme's old `sg-*` CSS is now inert. Reverting needs two steps, both written
into `BACKUP-solar-grown-page-body.html`.

Nothing else in the store has been touched. No products, no collections, no
theme files, no settings.

---

## File map

| File | What it is | Matches live? |
|---|---|---|
| `README.md` | This file |  |
| `00-MASTER-COPY.md` | Source of truth for all copy, EN and SV, plus the claims rules and the facts still to confirm | Partly. See drift below |
| `shopify-page-LIVE.html` | Exact body of `/pages/retail-partners` | Yes |
| `shopify-page-SOLAR-GROWN.html` | Exact body of `/pages/solar-grown-diamonds` | Yes |
| `BACKUP-solar-grown-page-body.html` | The original solar grown body and template, before any edits. Restore point | Historical |
| `emails.md` | Four email outreach sequence, EN and SV | Not sent yet |
| `landing-page.html` | Standalone review page with an EN/SV toggle | **No. Out of date** |
| `prospectus.html` / `prospectus-sv.html` | Print sources for the PDFs | **No. Out of date** |
| `Orloff-Solar-Grown-Partner-Prospectus-EN.pdf` | 5 page A4 prospectus | **No. Out of date** |
| `Orloff-Solar-Grown-Partner-Prospectus-SV.pdf` | Swedish version | **No. Out of date** |
| `_archive-draft-with-12-design-grid.html` | Superseded first draft. Kept only because it contains the twelve design grid markup and the placeholder field styling, both of which the live page dropped | Archive |

### Known drift

The landing page and both prospectus PDFs still carry the **old structure**:
they include the Hua Hin section, the twelve design grid, and the single
rhythm layout. The live pages have moved on. Bringing them in line is a
pending job, not a bug.

---

## Decisions taken

| Decision | Detail |
|---|---|
| **Name** | **Solar Grown**, not Sun-Grown. Chosen 4 Aug to match what was already on the site. Do not reintroduce Sun-Grown |
| **Currency** | **USD**, changed from SEK on 4 Aug. Starter Collection is 2 600 USD. Written as `2 600 USD` with a space, never `2,600`, because a comma reads as a decimal separator in Swedish |
| **Hua Hin** | Removed from the live partner page. Still present in the master copy, the landing page and the PDFs |
| **Em dashes** | Removed everywhere, 232 of them. Colons where a dash introduced, full stops between independent clauses, commas for asides. Keep it that way |
| **Palette** | Brand navy `#091B36`, brand gold `#BC973F`, botanical green `#2C5344`, sage `#EDF0EA`. Gold for small text is `#96751F`, the same hue darkened, because `#BC973F` on white is about 2.7:1 and fails at 11px |
| **Spelling** | Unresolved. The site uses American (`vapor`, `color`). The partner material uses British (`vapour`, `colour`, `jewellery`). Pick one and normalise |

---

## Facts: resolved

Two of the original fifteen were answered by the site's own published copy.

- **Certification is IGI**, with full colour and clarity grading. Taken from
  the solar grown page spec table.
- **Solar is "more than 100 acres of solar panels"**, the facility's own
  published claim. Better than a percentage, because it is a physical fact
  rather than an energy-mix calculation someone can dispute.

## Facts: still outstanding

These block the outreach emails, not the live pages. The live pages were
written to omit every unconfirmed claim rather than state it vaguely, so
they are honest as they stand. They just say less than they should.

1. **The margin.** Wholesale to RRP ratio. This is the single most important
   missing number. Email 2 is built entirely around it and cannot be sent
2. **The twelve engagement designs.** Niels selects. Each needs a model name,
   centre stone carat, quality tier and a photograph
3. **Return or exchange terms** on the Starter Collection. The objection that
   decides most 2 600 USD sales. Currently absent from the live FAQ because
   it cannot be answered
4. **Lead times** in days, production and shipping separately
5. **Territory.** Whether Founding Partner carries any exclusivity
6. **Application deadline** for the twenty-five places
7. **Recycled gold standard**, the specific certification or attestation
8. **Beech box**, whether it is FSC certified
9. **Import terms**, DDP or DAP, and who is importer of record
10. **Trademark availability** for "Solar Grown" in the EU and Nordics. The
    whole strategy rests on owning that phrase
11. **"More than 35 years"**, documented from what date
12. **Photography.** Hero ring, the solar array, the beech box, founder and
    workshop, and the twelve designs
13. **The fancy yellow ring photo.** Lab grown or natural? A mined stone
    cannot headline a lab-grown page

---

## Open design question

Both pages currently lean technical: the partner page is built from six
data-display components and uses monospace in six places, which reads as
infographic rather than jeweller. A softer register was proposed on 4 Aug:
cut to two data components, demote monospace to one job, set body copy in
the serif, and remove most hairline borders. Not yet actioned.

The real fix is photography. The components are carrying the page only
because there is nothing to look at.

---

## Claims rules

Non negotiable, and the reason several sentences read the way they do.
Full version in Part 0 of `00-MASTER-COPY.md`.

- **"Solar Grown" is an adjective, never a replacement for "lab-grown."**
  First mention on any asset reads "Solar Grown lab-grown diamonds"
- **No environmental superlatives.** Not "the most", not "one of the most".
  The Empowering Consumers Directive (EU 2024/825) applies from 27 September
  2026, which overlaps this launch, and Konsumentombudsmannen is active on
  green claims in Sweden. Replace every superlative with the number or the
  document behind it
