# Orloff Charm Line, resume point

Last worked **2 Aug 2026, afternoon**. Everything needed to continue is on this drive.

This file replaces the 1 Aug version, which predated the sibling cross-linking
workstream entirely and is no longer safe to read.

---

## THE ONE THING TO DO NEXT

**Email Ivy Wu at Zhuhai Rinntin and ask two questions:**

1. Which of our SKUs are exclusive to us?
2. What would tooling or territory exclusivity cost on a named list?

Nothing else about the charm line should move until that answer comes back. It
decides whether this is a collection or a re-branded catalogue, and it costs
nothing to ask.

**Why this became the one thing.** On 2 Aug Viktor reverse-image-searched four
charms and found them selling under Gnoce, on Shopee and in a US Walmart. That is
the expected result, not bad luck — the invoice is from a contract manufacturer
and the same moulds go to every buyer. See "Provenance" below, which is now the
most important section in this file.

The 1 Aug file said the description sweep was the one thing. Done. The menu is
still not built, and still matters, but it is no longer the thing that decides
whether there is a product worth putting a menu in front of.

---

## What happened 1–2 Aug, and what the crashes cost

Three sessions ran across two machines and two of them died to the Windows MSIX
crash (`0x80073D05`).

| When | Where | Fate |
|---|---|---|
| 1 Aug daytime | this PC | completed cleanly, wrote the old RESUME.md at 21:01 |
| Overnight 1→2 Aug | **claude.ai/code, cloud** | crashed mid-run; kept committing to Shopify |
| 2 Aug 11:23–11:47 | this PC | crashed mid-run |
| 2 Aug 11:25–11:38 | this PC | completed — the WEB 15 UI audit |

**No Shopify work was lost in any of them.** Shopify was the storage, so every
write survived; what died was the reasoning trail and the write-ups. The cloud
session in particular carried on committing after the desktop app disconnected —
its last writes landed at **13:11 local on 2 Aug**, well after the local sessions
were gone.

Local transcripts live in `%USERPROFILE%\.claude\projects\E--\*.jsonl` and survive
a reinstall even when the app's own session list does not. Timestamps inside them
are **UTC** — add 7 hours for Bangkok.

---

## READ FIRST — two live warnings

**1. A second Claude session was editing this drive at the same time as this one**
(`a4c765f6`, active 2 Aug evening). It re-ran the WEB 15 UI audit properly, backed
up the earlier DOM-only version as
`charm-ui-audit-2026-08-02-web15.md.bak-domonly`, and wrote the good one. **Trust
`charm-ui-audit-2026-08-02-web15.md` over anything about the UI in this file.**
If two sessions are open again, only one should write RESUME.md.

**2. The hover-second-image feature is publishing watermarked photographs.**
That audit found **34 of the 55 hover images still carry the ORLOFF crest**. The
hover was added on 2 Aug and it surfaced position-2 images that had never been
visible in the grid before — including the Lao Tzu and quote dangles. Only 21 of
the 40 available de-crested replacements have been uploaded so far, so most of
those 34 are still live on WEB 15.

Either finish the uploads and de-watermark the rest, or gate the hover on a
clean-image list until they are done. As it stands the rail puts the crest on 34
cards.

---

## Provenance — read this before anything else

### The line is bought, not designed

The invoice is from **Zhuhai Rinntin Jewelry Co., Ltd**, Cuizhu Fifth Street,
Zhuhai, contact **Ivy Wu**. A contract manufacturer. The model numbers on it are
catalogue references.

**There is no tooling charge anywhere on the invoice or its appendix.** No mould
fee, no development fee, no sample fee, no exclusivity clause — just unit prices
times quantities. You bought pieces, not designs. Without tooling you do not own
the mould, and Rinntin is free to sell the same design to the next buyer.

Caveat, and it is why the email above matters: tooling could have been paid on an
earlier invoice, waived, or amortised into the unit price. Strong evidence, not
proof.

### But there IS a real custom range — 36 designs

`E:\HD PICTURE\A (ORLOFF CUSTOM)\` is the **factory's own** separation of your
commissioned designs from its open catalogue. Every folder holds a Rinntin spec
card headed ORLOFF OF DENMARK with your crest, dimensions and weight. That is
authoritative, and it is useful evidence when you ask about exclusivity.

**36 folders, 39 SKUs. Only 12 are live.** Full detail in
`orloff-custom-range.md`, list in `orloff-custom-skus.csv`, contact sheet at
`image-fixes\ip-sheets\CUSTOM-1.png`.

Live: the snake chain bracelet, durian, both Danish flags, lotus (silver + 18K),
tassel (silver + 18K), whale tail, royal guard, coat of arms, Little Mermaid.

Not live and worth launching: **`GCB18`, the Cambodian flag** — Angkor Wat in
silver relief on red and blue enamel, which pairs with the two Danish flags as a
national-flag series. Also `GCB11` and `GCB12`, unnamed figures. And
**`GSB106-P`, a 999 fine silver bangle** — not a charm at all, same metal as the
Waves ring, belongs with the fine jewelry.

Not live and needing a decision: **`GCB19`–`GCB30`, 22 SKUs** in silver and 18K
pairs. Buddha heads, seated Buddhas, deities, temple lions, and `GCB22` the
Garuda. A third of everything you own. Thailand actively campaigns against Buddha
images used as decoration, and a Bangkok-based brand carries a reputational risk
there that a foreign one does not. The Garuda is the state emblem. Held back on
31 Jul for good reason; the reason still holds.

**Do not assume the `ORGCB` prefix means custom.** It does not. The Aristotle, Lao
Tzu, quote tags, aubergine and lemon are all `ORGCB` and all sit at the *top*
level of HD PICTURE, i.e. catalogue. Only the folder is authoritative.

### The claim that is currently wrong

The All Charms collection description says **"designed in house"**. On a Rinntin
catalogue product that is false. It is on WEB 15 only, so no customer has seen it,
but it must come out before anything publishes. Same for any other copy implying
original design.

### What is actually defensible

- The bails are struck ORLOFF. Provenance, not design, but it survives resale.
- The commissioned 36, *if* Rinntin confirms exclusivity.
- Deriving charms from pieces you already own — a miniature Waves band as a
  spacer, a Sculpture Line motif as a charm. Original by construction, and
  something Gnoce structurally cannot copy because they have no fine jewelry to
  derive from.
- Your own photography. The reverse-image trail works because the listings share
  factory stock photos. Shoot your own and the trail breaks. It does not make the
  design yours, but it stops a customer landing on a Walmart page.

---

## Done and verified

### Descriptions — build-note sweep is CLEAR

Every internal build note is gone. All markers (`handoff`, `invoice`, `Note `,
`decide`, `Could be`, `confirms`) return **0** against a storefront index proven
live by positive controls (`rhodium` 115, `oxidized` 140). The worst one, on
Puzzle Heart, now reads as proper copy:

> The interlocking puzzle has been worn in support of autism awareness for decades.

91 products were rewritten in total — 74 in the overnight run, 17 more at 13:11
on 2 Aug.

### Sibling cross-linking — built, not in any earlier file

Combined Listings is Shopify Plus only and this store is on Basic, so the
equivalent was built with metafields:

- `custom.sibling_charms`, `custom.sibling_label`, `custom.sibling_axis` —
  populated on **80 products across 11 sets** (26 letters, 12 zodiac,
  12 birthstones, 7 Aristotle, 7 Lao Tzu, 5 daisy, 3 love, and four 2-piece
  finish/quote pairs)
- `snippets/charm-siblings.liquid`, called from the top of
  `snippets/product-add-to-cart.liquid`

Three deliberate calls recorded in the code: the selector sits **outside** the
`product.available` check so a sold-out charm still offers its siblings; sold-out
siblings render struck through rather than hidden; zodiac renders in astrological
order and birthstones in month order, because the order lives in the data and not
in Liquid.

### Add-a-bracelet pop-up — works. The reported bug is NOT a bug.

The overnight run reported a deterministic failure: pass through the missing
**Flower / 21cm** combination on the PEACE bracelet, pick a valid one, add to
cart, and the pop-up silently never fires. It diagnosed the cause as the theme
posting to `/cart/add`, which returns HTML, rather than `/cart/add.js`, which
returns JSON.

**Retested twice on 2 Aug on WEB 15, every request 200, no throttling. The
pop-up fired both times.**

- Flower → 21cm correctly goes to `Unavailable` with the button disabled. The
  theme keeps the *previous* variant id in `input[name=id]` rather than clearing
  it, which is what made the stale-state theory look plausible.
- Picking Blue restores a valid id (`52222124196130`) and re-enables the button.
- Add to cart → `/cart/add` returns **200 with a JSON body**, the pop-up's
  `res.clone().json()` parses it, and the panel opens ~2s later.
- Also survives a 250ms fast-click race, clicked before the section render had
  settled.

The diagnosis was wrong: `/cart/add` returns JSON to `fetch`, not HTML. The real
cause of the original failure was **429 throttling on the `?section_id=` render
endpoint**, which stalls the variant update so the add never properly happens.
That endpoint throttles hard and it is the thing to suspect first, not the theme.

### Size typo fixed

`Size: 14.14mm` on `engraved-quote-charm-the-moon` and
`engraved-quote-charm-possible` is now `14 x 14mm`. The invoice really does read
`14.14mm` on those two rows (`inv_table.txt` L5596, L5608) while every comparable
row reads `14*14mm` — treated as a supplier typo. **Worth one confirmation with
the supplier.**

### Spec blocks cleaned — 111 products rewritten 2 Aug

All the raw supplier text is out of the customer-facing spec block. Applied live,
zero errors, spot-checked afterwards.

| Was | Now |
|---|---|
| `Stone: Stone: Muti-color` | `Stone: Multicolour` |
| `Stone: Stone:NA / Enamel:Light Blue&White` | `Enamel: Light Blue & White` |
| `Stone: Stone: None` | row removed, which is the house pattern |
| `Stone: White CZ+Red &Yellow Enamel` | `Stone: White CZ, Red & Yellow Enamel` |
| `Finish: Oxidized Silver, Highly` (21) | `Finish: Heavily Oxidized Silver` |
| `Rhodium Plating` / `Rosegold` / `Rhodium &Rosegold` | `Rhodium Plated` / `Rose Gold` / `Rhodium & Rose Gold` |

**Fourteen of them were wrong, not just ugly.** `Stone: CZ+Enamel` and
`Stone: +Enamel` were never stone values at all — the extractor had picked up a
fragment of the *material* column (`925 Sterling Silver + AAAA CZ + Enamel`). The
real stone was sitting in the invoice's raw pipe field the whole time and has now
been read back from it, e.g. `ladybird-charm` was `CZ+Enamel` and is now `Yellow`.

One value, on `hot-air-balloon-charm`, was truncated mid-line by the extractor
(`Pink & White CZ + Green & Pink &`). Recovered by hand from `inv_table.txt`
row 211 and set to `Pink & White CZ, Green, Pink, Yellow & Blue Enamel`.

The transform is reproducible: `_charm-line-work\scripts\fix-specs.ps1` (copied
from the scratchpad) rebuilds the same payload from the CSV plus the invoice.

### The blue banner bar is on all 11 charm collections

The other collection pages carry a navy `#091b36` block with an eyebrow, a title,
an italic tagline, a rule and body copy. It is **not theme code** — it lives in
each collection's own description field and is rendered by
`.collection-title-description` inside `main-collection-banner`. The charm
template renders that section too, so the same block drops straight in.

All 11 now match: All Charms, Animal, Birthstone, Charm Bracelets, Letter,
Milestones and Sentiment, Nature, Spacers and Clips, Sparkle and Classic, Travel
and Lifestyle, Zodiac. Accent is `#bc973f`, the gold the other category pages use
(the engagement and silver pages use `#b08d57` — a deliberate split, left alone).

**The taglines and closing lines are new copy and are a first draft.** The body
paragraph in each is the description that was already there.

### The crest is off 91 images — no AI needed

Where the background behind the stamp is plain, removing the crest is a fill, not
a repaint. `_charm-line-work\scripts\decrest.ps1` does it with System.Drawing, no
ImageMagick and no Python (neither is installed).

Ran over all 376 files in `shopify-upload-v2\`:

| | Count |
|---|---|
| no crest in the corner | 180 |
| **crest removed** | **91** |
| ribbon or coloured background, needs a real repaint | 105 |

Output is in `image-fixes\logo-removed\`, originals untouched. Re-running the
detector over the output returns 91 of 91 clean. 60 distinct SKUs, 47 of them
live products.

How it decides, because getting this wrong is expensive:

- The box is anchored to the **crest**, found by its navy, not to "ink near the
  corner". The first attempt used a corner rectangle and swallowed the bail of
  the Lao Tzu dangles and the gold bail of the yin-yang tag — both plain white,
  both wrongly skipped.
- From the shield it grows outward and stops at white space, because the wordmark
  is wider than the shield and a fixed box clips it.
- It then checks a 10px ring around the stamp is uniform white. Ribbon and
  lifestyle shots fail here, which is the intended outcome — they still need
  prompt 1 in `image-fixes\README.md`.
- A size cap catches runaway growth. `ORGCB07-P-c.jpg` is a ribbon shot where the
  grow ran the full 1001x980 frame and the ring test passed vacuously because it
  was off-image. Without the cap that file would have been painted white.
- The fill uses the surround's own measured value, not `#ffffff`, so it still
  matches if the sweep is a shade off white. JPEG re-encoded at quality 95.

**Four are lead images**, which the 1 Aug note said was not the case — it was
right about the 16 it knew of, not about the full set:

    ORCBB01-17-a.jpg   ORCBB01-19-a.jpg   ORCBB01-21-a.jpg   (the bracelets)
    ORGCB06-P-a.jpg    (danish-flag-charm-pave)

**Upload is part done: 21 of 40 live, 19 staged and not applied.** Tracking file
`_charm-line-work\data\upload-targets.csv` marks which. It is resumable and each
image is independent, so nothing is half-written.

Of the 91 cleaned files only 40 had a target: 12 products already carry `-nl`
versions from 31 Jul, 23 `ORGCBB1` files and 3 `ORCBB01` files have no matching
product media at all, and 13 belong to SKUs that were never exported.

**The method that works** — and it sidesteps the multipart trap entirely:

1. `stagedUploadsCreate` with `resource: IMAGE, httpMethod: PUT`. PUT returns a
   plain signed URL with no form parameters, so there is no multipart body to get
   wrong.
2. `Invoke-WebRequest -Method Put -InFile <file>` from PowerShell.
3. `fileUpdate` with `originalSource` set to the resourceUrl, which is just the
   signed URL with the query string removed.

`fileUpdate` replaces the file **in place**. Same MediaImage id, same CDN path,
same position on the product. Only `?v=` changes. No `productCreateMedia`, no
reordering, no deleting — which is why none of the old traps applied.

### The 105 that still need a repaint are your own pieces

Every image the automatic fill refused is a ribbon or lifestyle shot, and 18 of
them belong to the 12 commissioned products. The bought-in charms got clean
white-background photographs; the commissioned ones got the styled shoot with the
crest burned into the ribbon. They need prompt 1 in `image-fixes\README.md`, or a
reshoot — which you want anyway.

### Grid navigation and hover, 2 Aug

Three changes to the charm rail, all on WEB 15:

1. **A back link on the charm product page.** The grid is built client side, so
   the theme breadcrumb only ever said `Home / Product`. Opening a card now
   leaves a trail in `sessionStorage` and `assets/charm-nav.js` draws
   `← Back to All Charms` above the breadcrumb. The trail carries the whole
   collection's handle set, so the link survives moving between siblings and
   stays off unrelated products. It expires after 30 minutes.
2. **The browse survives the round trip.** Filters, the selection tray and scroll
   position are saved and restored. Verified: blue + $39 filter, one charm in the
   tray, scrolled to 2400px, opened a charm, came back — 27 of 269 still showing,
   both filters still lit, tray still $39, scroll back at 2400.
   `history.scrollRestoration` is set to `manual` on purpose: the grid is fetched,
   so the browser's own restore fires against an empty page and lands at the top.
3. **Hover shows the second photograph.** 55 of the 269 have one, and it is
   always the detail shot — which is exactly what the tall engraved dangles
   (Aristotle, Lao Tzu, the quote tags) need to be readable at grid size. Both
   images are stacked in the same square and cross-faded, so there is no flash.
   Zoom went from 1.05 to 1.08 and applies to every card. Cards without a second
   photograph just zoom. On touch, where there is no hover at all, the detail shot
   shows as a small inset instead.

**Still to eyeball:** the hover itself could not be seen, because the Browser pane
was never displayed and a hidden pane does not composite. The CSS rules were
confirmed to resolve against the cards, and everything non-visual was tested
live. Display the pane and look at one Aristotle card before publishing.

---

## Still blocking a clean launch

1. **The exclusivity question is unanswered.** See the top of this file.
2. **"Designed in house" is live on the All Charms page** and is false. Remove it
   and any similar claim before publishing.
3. **Four charms are somebody else's property.** Full screen with evidence in
   `ip-screen-2026-08-02.md`. All 213 catalogue charms were looked at
   individually — contact sheets in `image-fixes\ip-sheets\`:
   - `ORCB180` "Crowned Shield Charm" is the **Superman shield**. DC / Warner.
     The name is a euphemism; the mark is untouched.
   - `ORCB170` "Police Box Charm" is the **TARDIS**. BBC won the shape
     registration against the Met Police in 2002.
   - `ORCB182` "Puzzle Cube Charm" is the **Rubik's Cube**.
   - `ORCB144` "Best Friends Charm" carries two yellow smileys. The Smiley Company
     holds that mark in ~100 countries including jewellery. Grey, your call.
4. **`ORGCB25` Little Mermaid needs a lawyer.** Eriksen died 1959, copyright runs
   to **2029**, and the estate is among the most aggressive in Denmark: 300,000
   DKK against *Berlingske* upheld by the Supreme Court, a demolition demand
   against the village of Asaa, a pursuit in Michigan. Their right covers replicas
   *and* depictions in other media. A cast silver miniature sold by a Danish brand
   is squarely inside it. Commissioning it from Rinntin does not make it yours.
5. **Charms is not in the main menu.** 272 products with no route in except search
   or a direct URL. Five minutes in Navigation. The footer menu still contains one
   item, "SEARCH".
6. **Both bracelets are still titled in CAPS** — `SPARKLE - SNAKE CHAIN` and
   `PEACE - SNAKE CHAIN`. Confirmed live on 2 Aug from the rendered `<h1>`. The
   SEO title is fine; the product title is what shows in cart, checkout and order
   emails. Neither contains the word "bracelet". Suggested:
   `Snake Chain Bracelet, Pave Clasp` and `Snake Chain Bracelet, Enamel Clasp`.
4. **16 watermarked images** on 9 products. List at the bottom of this file.
5. **One photo per charm** on 263 of 270. Cheapest fix is one styled bracelet
   shot per category reused as image 2 — 11 photographs, not 272.
6. **Zodiac and Birthstone still sort alphabetically** in the grid. Aquarius,
   Aries, Cancer. Both are still rule-based with `ALPHA_ASC` and need converting
   to manual collections. The sibling selector fixes ordering *within* a product
   page only — it does not touch the grid.
7. **WEB 15 is still unpublished.** Nothing from either day is live.

---

## Two spec details still open

**`puzzle-cube-charm` contradicts itself.** The prose says "green, white and
orange enamel squares" while the Stone field says `Blue & Yellow Enamel`. One of
them is wrong and the photograph will settle it.

**The 25 letter charms omit the Size row entirely.** That is fine, not a defect.
`letter-a-charm` is the odd one out and does carry a size.

A trap for anyone re-running the cleanup: `shopify-charm-line-a.csv` is a safe
base for the *spec fields* but is stale for the *prose*, because 91 products have
been rewritten live since the import. Any bulk rewrite must take the live
`descriptionHtml` for those 91. Building the payload from the CSV alone would have
reinstated an old "TRADEMARK RISK: closely resembles the Rubik's Cube" build note
on `puzzle-cube-charm` that had already been cleaned. Caught before it was
written, but only just.

---

## The WEB 15 UI audit, 2 Aug

Full report in `charm-ui-audit-2026-08-02-web15.md`. The headline items:

**Critical**
1. Homepage heroes ship **~13 MB** of images with no `srcset` — phones download
   the same files as desktop. `WEDDING_IMAGE.png` 5,554 KB and
   `ENGAGEMENT_IMAGE.png` 5,205 KB are photographs saved as PNG; those two plus
   `DIAMONDS_NEW_IMAGE.png` are 12.2 MB of the 13. The product cards already do
   `width`/`srcset` correctly — copy that.
2. The mobile sticky add-to-cart bar collapses at 375px on
   `product/katarina-lab-grown`. `.rc-sticky-bar__config` gets 54px where it needs
   322, with `nowrap` and no `text-overflow`, so the configuration line
   (`14K Yellow Gold · Signature SI1/H · 0.5 ct · Lab Grown`) is hard-clipped
   mid-word with no ellipsis. Fine at 753px and up — phone only.

**Should fix**
3. `/collections/fine-jewelry/rings` and `/collections/fine-jewelry/necklaces+pendants`
   both silently drop their filter — neither tag exists.
4. `/pages/about-us`, `/pages/diamonds` and the 404 page have no `<h1>` at all.
5. Missing alt text on 8 of 19 homepage images and 7 of 9 on `/pages/about-us`.
6. Heroes carry `fetchpriority="false"`, which is not a valid value.

**Verified clean:** no horizontal overflow at 1265/753/375px, no console errors,
all 36 internal links 200, collection grid, pagination, filters, product options,
cart add/update/remove, search, 404, blog, all four policy pages, JSON-LD.

**Not verified:** mobile menu drawer, cart drawer, search modal, image zoom, and
scroll animations — all GSAP-driven, and `requestAnimationFrame` is paused in a
hidden browser pane.

---

## The colour filter has no tags behind it

**No product carries a colour tag.** Colour is derived client-side in
`charm-collection.js` from each product's title, description and tags, using
keyword rules. That was the deliberate trade — it works with zero product writes.
Writing real tags later is the durable path, and the rules can then be swapped for
a straight tag read without touching the markup.

The **counts in the 1 Aug file are stale** — the overnight run re-exercised the
filters directly and got different numbers. Trust the live filter, not the
recorded figures. Two things still worth a look:

1. The pink bucket looked large — 42 live against 21 from the 31 Jul CSV scan.
2. The heuristic over-matches by design: "Silver heart with a red ribbon" tags as
   both Silver and Red. Defensible, but confirm you agree.

Swatches shown: Silver, Oxidized, Rose gold, Gold, Pink, Red, Blue, Green, Purple,
Yellow, White, Black, Multicolour. **Orange is hidden** (4 products) and Navy was
dropped (0 matches, folded into Blue). Change this in the theme editor — the
section has a **"Swatches to hide"** setting taking a comma-separated list. A
swatch also hides itself when nothing in the collection matches it.

---

## State of play

| Piece | Status |
|---|---|
| **Exclusivity** | **Unanswered. No tooling charge on the invoice. Ask Ivy Wu** |
| **Orloff custom range** | **36 designs, 39 SKUs. Only 12 live** |
| **Third-party IP** | **3 to remove, 1 grey, all 213 screened** |
| **Little Mermaid** | **Needs a lawyer. Eriksen estate, copyright to 2029** |
| Invoice extraction | Done, reconciled exactly. 554 rows, 7,468 pcs, $55,849.61 |
| Naming | 287 of 316 SKUs named, categorised, described |
| Pricing | Done. Shopify USD 29/39/49/89, StoreHub THB 900/1200/1600/2800 |
| Image uploads | Done. 485 originals + 376 v2 + 12 de-watermarked |
| Shopify import | Done 31 Jul. 272 products, images verified |
| Collections | 11 created live, rule-based, with SEO |
| Add-a-bracelet pop-up | **Done and retested 2 Aug. Reported bug does not exist** |
| Collection filter + tray | Done 1 Aug, verified |
| Sibling cross-linking | **Done overnight 1→2 Aug. 80 products, 11 sets** |
| Build notes in descriptions | **Cleared. All markers 0** |
| Bracelet builder | Built and working, parked by choice |
| Spec-block junk | **Fixed 2 Aug. 111 products rewritten** |
| Collection banner bars | **Done 2 Aug. All 11 charm collections** |
| Back link + browse state | **Done 2 Aug, tested live** |
| Hover second image | **Built 2 Aug. Not yet seen — pane was hidden** |
| Colour tags | Not written. Filter uses client-side derivation |
| Logo watermark | **91 cleared on disk. 21 of 40 uploaded, 19 to go. 105 ribbon shots still need a repaint** |
| Image fixes | 384 files sorted with prompts written, awaiting Viktor |
| StoreHub CSV | Still ready to import. No dependencies |
| TikTok | Blocked, needs category ID + seller verification |

---

## What is on WEB 15

Theme id **189575168290**, unpublished. Preview by appending
`?preview_theme_id=189575168290` to any URL.

| File | What it is |
|---|---|
| `snippets/charm-bracelet-prompt.liquid` | the pop-up. Restyled 2 Aug: outline-first button, transparent ground, navy border and text, inverting on hover. No em dashes in customer copy. |
| `sections/charm-bracelet-prompt.liquid` | wrapper, included via `sections/footer-group.json` so it renders everywhere without touching `layout/theme.liquid` |
| `snippets/charm-siblings.liquid` | the sibling selector, 3,806 bytes |
| `sections/charm-collection.liquid` | collection rail markup and theme-editor settings. Passes `handle` **and `title`** into `data-ccol`; the title labels the back link |
| `assets/charm-collection.js` | loader, colour derivation, filters, tray, browse-state save/restore, second image |
| `assets/charm-collection.css` | styling, hover zoom and image cross-fade |
| `assets/charm-nav.js` | the back link on the product page. Loaded from the prompt wrapper section, because that is the one section rendering on every page |
| `templates/collection.charms.json` | uses the above. All 11 charm collections share `templateSuffix: charms` |
| `sections/charm-builder.liquid` + `assets/charm-builder.{js,css}` + `templates/page.charm-builder.json` | the builder, parked and unlinked |

The pop-up fires on **every** bracelet add — the once-per-session guard is gone —
and shows one button, "Browse all charms", pointing at `/collections/all-charms`.
It never fires on a multi-item add, so the collection tray's own add does not
trigger it. It works by wrapping `fetch` and `XMLHttpRequest` rather than
depending on theme internals. **The copy is still a first draft** — rewrite in
house voice before publishing.

**Theme code is not on this drive.** Shopify versions it. To pull a file back out,
query `theme(id: "gid://shopify/OnlineStoreTheme/189575168290")` and read
`files(filenames: [...]) { body { ... on OnlineStoreThemeFileBodyText { content } } }`.

---

## Files on this drive

**Ready to use**
- `shopify-charm-line-a.csv` — imported 31 Jul, repointed at the 12 cleaned
  images. **Now stale for descriptions** — 91 products have been rewritten live
  since. Safe as a spec-field reference, not as a re-import.
- `shopify-charm-line-a.csv.bak-prelogo` — as imported, before the image swap.
  Do not re-import this one.
- `storehub-charm-line-a.csv` — importable now
- `orloff-charm-line-a-master.xlsx` — two sheets, the source of truth
- `shopify-upload\`, `shopify-upload-v2\` — the uploaded images
- `invoice-images\`, `invoice-images-clean\` — carved out of the invoice PDF

**Provenance and screening, written 2 Aug**
- `orloff-custom-range.md` — what is actually yours, and the order of work
- `orloff-custom-skus.csv` — the 39 custom SKUs, live and not
- `ip-screen-2026-08-02.md` — the full IP screen over all 213 catalogue charms
- `image-fixes\ip-sheets\` — 11 contact sheets of the catalogue plus `CUSTOM-1.png`
  of the commissioned range. This is how the Superman shield was found; the names
  hide everything, the pictures do not
- `HD PICTURE\A (ORLOFF CUSTOM)\` — the factory's own separation of your designs
- `_charm-line-work\data\decrest-report.csv` — crest verdict for all 376 v2 images
- `_charm-line-work\data\upload-targets.csv` — the 40 image swaps and which are done

**Reference**
- `image-fixes\` — 384 images sorted into 5 folders with four ChatGPT prompts
  written for them. Open `review.html` first to check the sorting. Read its
  `README.md` before running anything; folder 5 is on-model shots you did not ask
  for, and three of them show pieces as pendants rather than bracelet charms.
- `charm-ui-audit-2026-08-01.md`, `charm-ui-audit-2026-08-02-web15.md`
- `theme-charm-line\INSTALL.md` — the theme work in detail
- `charm-builder-mockup.html` — the three UX prototypes as originally proposed
- `decisions-needed.md` — everything awaiting a call from Viktor
- `shopify-collections.md`, `image-sku-map.md`, `charm-identifications.tsv`,
  `dangle-identifications.tsv`, `invoice_reconciliation.txt`

**`_charm-line-work\`** — scripts, intermediates and a copy of the assistant's
memory notes.

---

## Rebuilding from scratch

From `_charm-line-work\scripts`, in order:

    carve.pl        pull 533 JPEGs out of the invoice PDF
    pdfmap.pl       map images to PDF page placements
    join_rows.pl    join placements to invoice rows
    parse.pl        parse the invoice (pdftotext -table, never -layout)
    reconcile.pl    prove the arithmetic
    map_images.pl   map HD PICTURE folders to SKUs
    build_master.pl build the master spreadsheet
    build_exports.pl generate the Shopify and StoreHub CSVs

Needs Perl (Git Bash has it) and `pdftotext` (Git for Windows ships it).
Python is not installed and is not required.

---

## Traps that cost time, do not rediscover

- **`/products/...?section_id=` throttles hard (429).** This is the single
  biggest time-waster on this project. It has now produced two separate false bug
  reports — the overnight run's pop-up "defect" and its own follow-up test. When
  UI behaviour looks broken, check for a 429 **before** forming a theory.
  `/cart.js` stays at 200 while the section endpoint is throttled, so a healthy
  cart call proves nothing.
- **`/cart/add` returns JSON to `fetch`.** It only returns HTML to a native form
  post. Do not assume the plain endpoint means HTML.
- **Do not time UI behaviour in a browser whose window is not displayed.** Timers
  clamp by roughly 7x and `requestAnimationFrame` may not fire at all, so a
  working modal reads as broken. A 150ms `setTimeout` measured ~1000ms on 1 Aug
  and produced three rounds of false failures. Trace state over a window instead
  of sampling once — that is how the pop-up was cleared on 2 Aug despite the pane
  still being hidden.
- **`pdftotext -layout` corrupts this invoice.** Row numbers, weights and prices
  are three independent columns that only share lines by accident. Use `-table`.
- **The PDF page y-axis is flipped.** Larger y is further down. Sorting the
  obvious way silently gives letters in the order I, H, G, F.
- **HD PICTURE folder names lie.** `GCB49` contains `PA0107`. The file wins.
- **Shopify CDN URLs work without the `?v=` cache-buster**, so they can be
  built rather than paginated out of the Files API.
- **PowerShell variables are case-insensitive**, so `$repl` silently clobbers
  `$REPL`. Cost one round of nonsense pricing on 31 Jul, then bit twice more on
  2 Aug: `$p = ... -split '|'` destroyed the `$P` URL prefix, and `$ROWS = 4`
  destroyed a 213-row dataset so a contact sheet came out with one tile. If a
  script behaves as though a variable were empty or the wrong type, look for a
  same-named variable in different case **before** looking anywhere else.
- **Shopify `fileUpdate` replaces an image in place.** Same MediaImage id, same
  CDN path, same position on the product, only `?v=` changes. Far safer than
  `productCreateMedia` plus reorder plus delete, and it avoids every media-order
  trap below.
- **Use `httpMethod: PUT` on `stagedUploadsCreate`.** It returns a plain signed
  URL with no form fields, so the .NET multipart boundary problem never arises.
- **Judge a charm from the photograph, not the title.** "Crowned Shield Charm" is
  the Superman shield and "Police Box Charm" is the TARDIS. No text search would
  ever have found either. Contact sheets, 20 per sheet, are the cheap way to look
  at 213 pieces.
- **A region-grow around a watermark needs a size cap.** On a textured background
  the grow runs to the frame edge, the surround test then passes vacuously because
  the ring is off-image, and the whole photograph gets painted white.
  `ORGCB07-P-c.jpg` did exactly this before the cap was added.
- **A naive CSV splitter eats escaped quotes**, turning `style="..."` into
  `style=...` and shipping broken HTML to 287 products.
- **Uppercase `-A`/`-B` image suffixes are invoice colour variants, not the v2
  renames.** The v2 renames are lowercase `-a`..`-d`. Any check separating them
  must be case-sensitive, which PowerShell's `-match` is not. Use `-cmatch`.
- **Writing to `E:\` with the file-edit tools fails with EPERM.** Edit the file
  elsewhere and copy it in with PowerShell.
- **Shopify staged uploads reject .NET's quoted multipart boundary.** Google
  Cloud Storage answers `400 Malformed multipart body`. Fix: build
  `MultipartFormDataContent` with an explicit boundary, then overwrite the
  `boundary` parameter value to strip the quotes .NET adds.
- **`productCreateMedia` with a CDN URL makes a second Files entry**, suffixed
  with a UUID, rather than reusing the file. Read the real URL back off the
  product afterwards.
- **`/collections/<handle>/products.json` throttles (429).** Both the builder and
  the collection rail retry with backoff. Without it a single throttled response
  empties the whole grid.
- **A client-side grid needs `history.scrollRestoration = 'manual'`.** The
  browser restores scroll before the fetched cards exist, so it lands at the top
  and looks like the restore is broken. Do it yourself after the render, with a
  `setTimeout` floor under the `requestAnimationFrame`.
- **The collection banner blue bar is data, not code.** It is HTML pasted into
  each collection's description field. Looking for it in the theme wastes an hour.
- **A CSS grid with two columns needs explicit `grid-column` on both children.**
  Without it, source order decides, and the rail lands in the wide column with
  the product grid squeezed into 320px.
- **The MSIX crash (`0x80073D05`) does not touch `E:`.** Root cause was long
  agent-mode session paths plus `LongPathsEnabled = 0`; the drain is fixed. Do
  not `sc.exe delete CoworkVMService` — it is declared in Claude's own manifest
  and removing it causes the very error you are escaping.

---

## Still needs Viktor

Full detail in `decisions-needed.md`. The ones that matter, with the two biggest
now at the top:

0. **Exclusivity, and what to do with the 216 catalogue charms.** The commissioned
   36 can carry the name if Rinntin confirms. The other 216 are a separate
   commercial question — sell them elsewhere, sell them honestly as compatible
   accessories at a price that does not invite the comparison, or do not sell
   them. What does damage is selling a bought-in charm at 6x while calling it
   yours.
0b. **The religious and national set.** 22 SKUs, Buddhas and the Garuda. Cultural
   and legal advice, in Thailand, before anything.


1. **The 16 watermarked lifestyle images** (list below), plus the 384 in
   `image-fixes\`.
2. **26 religious and national pieces, unnamed.** Buddha heads, a Garuda, a
   temple lion. Deliberately excluded from the Shopify CSV, which is why the
   export is 272 products and not 298. ORGCB22, the Garuda, is the Thai state
   emblem and may not be commercially usable at all.
3. **ORCB33-G is engraved "Augest".** Misspelled on the metal, 20 pieces.
4. **ORCB180 and ORCB182** are close to the Superman shield and the Rubik's
   Cube. Named neutrally, but take advice.
5. **ORCB176** is one product, not two. Rows 222 and 491 are the same tree of
   life bead. Recommend merging to 50 pcs at a blended $7.32.
6. **ORGCB175 is now live as "Hans Christian Andersen Charm"** — the overnight
   run made that call. Handle unchanged, so no URLs broke. Confirm you are happy
   with it.
7. **Compatibility positioning.** Every description says "Fits all Orloff snake
   chain bracelets". The third-party market leads with Pandora compatibility
   instead, because that is where the search volume is, and these beads do
   physically fit the standard 4.5mm core. Legally possible under nominative fair
   use in most markets, but Pandora defends aggressively and Thailand is not
   where a small brand wants that fight. Get proper advice.
8. **TikTok** category ID and seller verification status.
9. **The `14 x 14mm` correction** on the two engraved quote charms — the invoice
   really does say `14.14mm`. One line to the supplier settles it.

---

## Loose end worth picking up

The ORGCBB1 bracelet clasps carry **enamel motifs, not plain beads**. The blue
one is a peace symbol engraved ORLOFF OF DENMARK. The descriptions currently say
"enamel bead at the clasp", which undersells them. Worth checking each colour and
rewriting those 14 descriptions.

Also, confirmed still true on 2 Aug: `PEACE - SNAKE CHAIN` has an option named
**"Colour"** whose values are White, Red, Black, Blue, **Flower**. Flower is not a
colour — the option should be named "Clasp". And 5 colours x 3 sizes = 15
combinations but only **14 variants exist**; Flower / 21cm is missing. The
storefront handles the gap correctly (button goes to `Unavailable`), so this is a
catalogue tidy-up, not a defect.

---

## The 16 watermarked images still to fix

All are position 2, 3 or 4 on their product — no lead images are affected.
Originals are in `shopify-upload-v2\`. The watermark is always at
x 17–210, y 14–266.

    coat-of-arms-charm             ORGCB27-c.jpg      ORGCB27-d.jpg
    danish-flag-charm-pave         ORGCB06-P-b.jpg    ORGCB06-P-c.jpg
    danish-flag-charm-red-enamel   ORGCB50P-c.jpg     ORGCB50P-d.jpg
    durian-charm                   ORGCB05-P-18-c.jpg
    little-mermaid-charm           ORGCB25-c.jpg      ORGCB25-d.jpg
    lotus-flower-charm             ORGCB07-P-c.jpg    ORGCB07-P-d.jpg
    royal-guard-charm              ORGCB10-P-c.jpg    ORGCB10-P-d.jpg
    tassel-charm                   ORGCB08-P-c.jpg
    whale-tail-charm               ORGCB09-P-c.jpg    ORGCB09-P-d.jpg

A further **50 watermarked images are uploaded but not on any product**. Most
belong to the 26 held-back religious SKUs. Detection logic: the crest is navy
plus gold, so count pixels where `B > R+45` and where `R > 140, G > 100, B < 100`
inside the top-left 23% of the image.
