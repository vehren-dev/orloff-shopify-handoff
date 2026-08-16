# ORLOFF OF DENMARK — CRO / UX / SEO AUDIT
**Date:** July 22, 2026
**Auditor:** Claude (live-site audit: homepage, /collections/engagement-rings, /products/kristina-natural, /products/fuchsia-crown, /collections/one-of-a-kind, /pages/about-us, /pages/diamonds, robots.txt, mobile viewport 375px, schema/hreflang inspection, Google index check)

**Overall read:** The bones are genuinely good — restrained copywriting ("When it's gone, it's gone" is excellent luxury voice), clean navigation architecture, solid mobile fundamentals (no horizontal overflow, 16px base font, proper viewport meta). But the site is **under-selling its two strongest assets: certification credibility and the transparent-pricing story**. On a $5,300 sapphire ring, the Lotus certificate is mentioned only in a paragraph of body text, and on the engagement ring PDPs, **the word "GIA" doesn't appear at all**. That's the gap between a nice website and a converting luxury house.

---

## 1. WEB DESIGN & VISUAL LUXURY (UX/UI)

### 🔴 High Priority #1 — The mobile Add-to-Cart is buried ~2,150px below the fold with no sticky bar
On the FUCHSIA CROWN product page at mobile width (375px), the purchase button sits at **2,148px from the top** — roughly three full screens of scrolling — and there is no sticky add-to-cart. For high-ticket mobile shoppers (who browse in multiple short sessions), every re-visit means re-scrolling past the entire gallery to act.

**Fix this week (Shopify):** Add a slim sticky ATC bar on mobile PDPs showing product name, price, and the buy button once the main button scrolls out of view. The theme ("WEB 9") may have this as a toggle; otherwise it's a ~40-line snippet in `product.liquid` + CSS. Keep it minimal — thin, white, no discount badging — so it reads luxury, not Amazon.

### 🔴 High Priority #2 — One-of-a-kind gemstone pieces get "ADD TO CART" treatment instead of rarity treatment
The rarest, highest-margin pieces ($1,450–$5,300 sapphires) are displayed on the collection grid with the same instant "ADD TO CART" button as a commodity product. This actively undercuts the "made once, never repeated" positioning — scarcity should slow the shopper down, not push a cart action from a thumbnail.

**Fix this week:** On the One of a Kind collection, replace the grid-level ADD TO CART with "VIEW PIECE" (or nothing — let the image and name carry it), and add a one-line rarity marker per card (e.g., "2.78 ct Pinkish-Purple Sapphire · Lotus Certified · 1 of 1"). The card should sell the stone, not the checkout.

### Other problems noticed
- **Gemstone color is described, not shown.** The FUCHSIA CROWN copy ("shifts between fuchsia and violet depending on the light") is lovely — but there's no video. Color-shift is precisely what video/360° exists for. Static photos cannot prove a color-change sapphire. Add 5–10 second loop videos on hand, in daylight, for every one-of-a-kind piece.
- **Scale context:** stones photographed only on white risk the classic "looked bigger online" return. Ensure every PDP has at least one on-hand/on-model shot for scale.
- **Homepage heading hierarchy is broken visually and semantically** — four competing H1 sections (Solar Grown Diamonds, Engagement Rings, Wedding Bands, One of a Kind) means the homepage has no single focal message. Pick the hero (Solar Grown is the most differentiated story) and let the rest be secondary.
- **The homepage tells five stories at equal volume** (solar diamonds, engagement, eternity bands, one-of-a-kind, heritage). Luxury houses sequence: one hero narrative, then supporting rooms. Consider ordering by strategic priority and cutting one section.
- **Related-product images leak into the PDP gallery context** — on FUCHSIA CROWN, alt data shows BLUE VEIL / MULBERRY SPARK images loading high in the DOM. Make sure recommendations sit clearly below the fold and never visually compete with the hero gallery.

---

## 2. E-COMMERCE FEATURE ANALYSIS

### 🔴 High Priority #1 — Certification is invisible at the point of decision
This is the single biggest conversion gap on the site. On the KRISTINA engagement ring page ($2,380–$35,630 price range), a full-text scan finds: **no "GIA", no "certificate", no warranty language, no appraisal, no insurance mention**. Diamond quality is expressed only as cryptic variant labels ("Prestige - VS1/F", "Signature - SI1/H") with zero explanation of what those grades mean or who graded them. On FUCHSIA CROWN, the Lotus Gemology certificate — a serious credibility asset among gem collectors — is buried in the last sentence of a paragraph.

**Fix this week:** Build one reusable "Certification & Craft" block (metafields + a theme section) on every PDP:
- GIA / IGI / Lotus logo badge row directly under the price
- A scan/photo of the actual certificate in the product gallery for one-of-a-kind pieces
- A 2-line explainer on the diamond grade tiers ("Prestige VS1/F — near-colorless, no visible inclusions...")
- Metal specs (14k/18k/950 Pt), stone weight, and country of crafting in a consistent spec table

### 🔴 High Priority #2 — "Transparent Luxury" doesn't exist on the website
Transparent pricing is a core brand value — yet across the homepage, About page, Diamonds page, and PDPs, **the concept appears nowhere**. The About page tells a genuinely strong heritage story (1995, GIA gemologist founder, East Africa sourcing, father-to-son succession) but never makes the pricing argument. Meanwhile "From $600" engagement rings sit next to $35,630 configurations with no framing, which without a transparency narrative can read as *cheap* rather than *honest*.

**Fix this week:** Create a "Why Our Prices Look Different" page (and a 3-line PDP module linking to it): traditional retail markup vs. yours, why a workshop-direct model in Hua Hin + GIA-certified in-house gemology removes middlemen, what the customer is and isn't paying for. This converts pricing from a doubt ("why is this cheaper than Tiffany?") into the #1 closing argument. Pair it with the sourcing story already told on About.

### Other problems noticed
- **No reviews/social proof anywhere** — no Judge.me/Okendo/Loox widget detected, no testimonials, no press logos. For $2k+ purchases this is a major trust hole. Even 15 seeded reviews from past clients changes the math.
- **No financing** — no Affirm/Klarna/Shop Pay Installments detected. On $1,000–$6,000 items, installment messaging near the price reliably lifts conversion; Shop Pay Installments is a checkbox in Shopify Payments (US market).
- **No made-to-order / lead time / warranty clarity on the PDP** — shipping and returns exist somewhere, but production timelines for made-to-order engagement rings must be stated at the point of purchase.
- **Ring size guide exists (good)** but consider adding a free ring sizer offer — the standard high-ticket objection killer.
- **Collection architecture is solid** (Engagement → Solitaire/Halo/Side-stone/Three-stone; Bands → His/Hers) — but the price filter widget is rendering broken text ("Price $ $ Price: $0.00 — $35630.00" appears duplicated/garbled in the DOM). Check the filter drawer markup.
- **No virtual consultation booking.** A "Book a video consultation with our GIA gemologist" CTA is the single most effective high-ticket jewelry conversion feature — and the gemologist actually exists in-house. Calendly embed = one afternoon of work.
- **One-of-a-kind pieces lack urgency mechanics** — no "1 available" indicator from actual inventory, no sold archive. A "Sold Pieces" gallery both proves demand and creates FOMO.

---

## 3. JEWELRY-SPECIFIC SEO AUDIT

### 🔴 High Priority #1 — The best long-tail keywords are being thrown away in titles, slugs, and H1s
The evidence, side by side:
- New one-of-a-kind pieces: URL `/products/fuchsia-crown`, title tag `FUCHSIA CROWN – Orloff of Denmark`, H1 `FUCHSIA CROWN`. **Zero searchable keywords** — nobody searches "fuchsia crown"; people search "purple sapphire platinum ring" or "Lotus certified sapphire ring."
- Older indexed products prove the right pattern was used before: `/products/kilimanjaro-pink-mahenge-spinel-sculpture-ring` and `/products/neptune-blue-sapphire-sculpture-ring` are exactly the long-tail LSI pattern that ranks. The new naming convention is an SEO regression.
- Homepage title is just `Orloff of Denmark` with 4 H1s and a thin meta description.

**Fix this week:** Keep the poetic name, append the keywords. Pattern: **"FUCHSIA CROWN — 2.78ct Purple Sapphire & Diamond Platinum Ring | Lotus Certified"** for the title tag, and H1 as "FUCHSIA CROWN" with an immediate keyword-rich subheading. For new products, return to descriptive slugs (`/products/fuchsia-crown-purple-sapphire-platinum-ring`). Don't change existing slugs without redirects — Shopify auto-redirects if the "create URL redirect" checkbox is used. Homepage title: "Orloff of Denmark | Handcrafted Fine Jewelry, GIA-Certified Diamonds & Rare Gemstones — Since 1995".

### 🔴 High Priority #2 — International SEO is misconfigured: a Swedish locale is live and indexed with no hreflang
Google is indexing `/sv/` URLs (e.g., the Swedish CELESTIAL DUET page appears in search results), but there are **zero hreflang alternate tags** on the homepage or product pages, and the Shopify market default resolves to `country: TH, currency: USD`. Consequences: Google can't tell which version to serve to whom, EN and SV pages compete as near-duplicates, and Danish/US shoppers get Thailand-market defaults. For a brand whose story spans Denmark, the US, and Thailand, this is the priority technical fix.

**Fix this week (Shopify Markets):** Audit Markets setup — decide which locales are real (is Swedish intentional? Where's Danish?). Shopify emits hreflang automatically *when languages are published through Markets correctly*; the absence suggests the SV locale was added outside that flow or the theme's `<head>` is missing the `localization` block. Verify with a Screaming Frog crawl or view-source. Set a sensible primary market (likely US or International/USD, not TH), and add Google Business Profiles for the Hua Hin and Bangkok showrooms to own local "fine jewelry Hua Hin" searches — the collection meta descriptions already target those phrases, but without GBP listings that's half a strategy.

### Other problems noticed
- **Schema markup is minimal**: homepage has Organization + WebSite (good); product pages have Shopify's ProductGroup but **no rating markup (naturally — no reviews), no FAQ schema, no BreadcrumbList detected**. Collection pages carry Organization only — add `ItemList`/`CollectionPage`. Once reviews exist, `aggregateRating` unlocks star rich snippets — the highest-CTR SEO win available.
- **Alt text: 13 of 19 homepage images have no alt at all**, and product gallery alts are the lazy default "KRISTINA Engagement Ring" repeated across every image. Jewelry photography deserves descriptive alts: "Bezel-set 1ct lab grown diamond solitaire in 18k yellow gold, side profile." This also feeds Google Images — a massive discovery channel for jewelry.
- **The blog exists but is empty** (`/blogs/news` — zero articles). A founder with 30 years of gem-buying stories in East Africa plus a Lotus/GIA knowledge base is a content goldmine sitting unused. Even 2 posts/month targeting "unheated Ceylon sapphire meaning," "lab grown vs natural diamond price," "what is Lotus Gemology certification" would build topical authority no competitor in the niche has.
- **Meta descriptions get cut off** — FUCHSIA CROWN's is a 300+ character paragraph dump that truncates mid-sentence in SERPs. Write purposeful 150–160 char descriptions with the keyword + a hook.
- **"Solar Grown Diamonds" is a brandable term with zero search volume** — great for brand, but the page must also target "sustainable lab grown diamonds" / "eco-friendly lab diamonds" in its title/H2s or it will rank for nothing.
- **Broad keyword reliance confirmed**: category pages target "Engagement Rings," "One of a Kind Jewelry" — fine as heads, but there are no supporting long-tail landing pages (no "colored gemstone engagement rings," no per-gemstone hub pages beyond a Zircon collection). Build gemstone-type collections (Sapphire, Spinel, Zircon, Tourmaline) with 200-word expert intros — the existing Zircon collection is the template.

---

## If you only do four things this week
1. **Certification block on every PDP** (GIA/Lotus badges + cert scans + grade explainers) — biggest conversion lever.
2. **Sticky mobile add-to-cart** — cheapest fix, immediate mobile revenue impact.
3. **Rewrite title tags/slugs for one-of-a-kind pieces** to the long-tail pattern the older products already prove works.
4. **Fix Shopify Markets/hreflang** so the Swedish locale stops competing with the English pages and the three-country story becomes an SEO asset instead of a liability.

---

## Raw audit data (for reference)
- Homepage: 4× H1, 13/19 images missing alt, schema = Organization + WebSite only, no hreflang, title = "Orloff of Denmark", theme = "WEB 9"
- /collections/engagement-rings: schema = Organization only, collection description 122 chars, filters/sort present, price filter text garbled
- /products/kristina-natural: schema = ProductGroup, no GIA/cert/warranty/financing/transparency mentions, variant tiers "Prestige VS1/F / Signature SI1/H" unexplained, no review widget, no sticky ATC
- /products/fuchsia-crown (mobile 375px): ATC at 2,148px depth, no horizontal overflow, base font 16px, Lotus cert mentioned in body text only
- /blogs/news: exists, zero articles
- Google index: /sv/ Swedish URLs indexed; older products use keyword-rich slugs, new ones don't
- Shopify locale state: locale=en, country=TH, currency=USD; hreflang tags absent
