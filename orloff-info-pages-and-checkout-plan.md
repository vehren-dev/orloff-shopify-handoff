# Diamond info pages + checkout — findings and plan

**4 Aug 2026.** WEB 15 live, WEB 16 draft. Cart drawer padding already fixed on
WEB 16 (section 3 below). The rest of this is a plan, not applied work.

---

## 1. The eight info pages — what is actually wrong

All eight tiles on `/pages/about-diamonds` point at pages that **exist and are
published**. Nothing 404s. The problem is what is on them.

| Page | Content | Design |
|---|---|---|
| CUT | its own | old sections |
| COLOR | its own | old sections |
| CLARITY | its own | old sections |
| CARAT | its own | old sections |
| **CERTIFICATION** | **COLOR's text** | old sections |
| **FLUORESCENCE** | **COLOR's text** | old sections |
| **SOURCING** | **COLOR's text** | old sections |
| **LAB-GROWN** | **COLOR's text** | old sections |
| FANCY | its own | old sections |

### 1a. Four pages serve the wrong article

CERTIFICATION, FLUORESCENCE, SOURCING and LAB-GROWN all render a section headed
**"Diamond Color Grading"**, containing the D-to-Z colour scale copy — the COLOR
page's content, verbatim. All four reuse the same section block id
`rich_text_WDwDFp`, which is COLOR's block, evidently duplicated when the pages
were created and never rewritten.

LAB-GROWN gives the game away in its own markup: its second `<h1>` reads
**"COLOR"**.

This is the serious one. A jeweller's *Sourcing and ethics* page explaining
colour grading, and a *Certification* page that never mentions GIA or IGI, reads
as neglect at exactly the moment a customer is deciding whether to trust a
five-figure purchase. It is also four pages of duplicate content pointed at by
internal links, which search engines treat accordingly.

### 1b. Every one of the nine has three H1s

Each renders its title twice (`main-page` heading plus the overlay block) and
then a third from the "START YOUR SEARCH" banner. The 29 Jul audit fixed H1
counts elsewhere; these pages were missed.

### 1c. Two design languages on the same journey

ABOUT DIAMONDS and SOLAR GROWN DIAMONDS use the newer editorial system — full
width navy hero, gold eyebrow, `var(--gold)`, tile grid, specs table, signoff.
The nine children use the theme's stock `image-with-text-overlay` + `rich-text`
blocks with none of it. Clicking a tile takes you from a designed page to a
generic one.

### 1d. An orphaned template

`templates/page.cut.json` (1,466 bytes) is unused — the CUT page points at
`cut1`. Dead weight, and a trap for whoever edits "the cut template" next.

---

## 2. Plan for the info pages

Sequenced so the damaging problems go first and the cosmetic ones last. Each
step is independently shippable.

### Step 1 — Write the four missing articles *(highest value, needs you)*

CERTIFICATION, FLUORESCENCE, SOURCING, LAB-GROWN need real copy. I can draft all
four, but two of them make claims only you can stand behind:

- **SOURCING** — the About Diamonds tile already promises "every stone traced to
  ethical, conflict-free origins before it reaches our bench." That is a
  specific claim. I need to know what is actually true: Kimberley Process,
  supplier declarations, named partners, Nivoda's own sourcing terms.
- **CERTIFICATION** — which labs, for which ranges. The store shows GIA and IGI
  on products and GSI appears in the diamond feed. Worth stating plainly which
  you use and from what carat.
- **FLUORESCENCE** and **LAB-GROWN** are general gemmology; I can draft those
  from scratch and you correct the house view. LAB-GROWN should also point at
  the Solar Grown page rather than repeat it.

Give me the sourcing and certification facts and I will write all four.

### Step 2 — Rebuild the nine on the About Diamonds design system

Port each to the same structure the parent uses: navy hero with gold eyebrow,
intro with lede, the illustration slot, a body section, the specs table, the
signoff, the START YOUR SEARCH banner. One shared pattern, nine instances.

Doing this also removes the duplicate H1s, because the new pattern has one
heading. Cheapest to do as one template per page, mirroring
`page.about-diamonds.json`, rather than trying to restyle the stock sections.

**Note the maintenance cost first:** that design currently lives as a `<style>`
block inside each template's `custom_liquid`, which is why the old gold survived
in exactly one of them and why I had to hand-edit an 8 KB auto-generated JSON
file to change one hex. Before cloning it nine more times, the shared CSS should
move into a real asset — `assets/editorial.css` — with the templates carrying
only markup. That turns the next brand change from eleven fiddly edits into one.
I would do this as step 2a, before any porting.

### Step 3 — Cross-linking

Each child page currently dead-ends into the START YOUR SEARCH banner. They
should carry a "next" link along the Four Cs, and a route back to About
Diamonds. Cheap, and it keeps people moving toward the diamond search.

### Step 4 — Housekeeping

Delete `templates/page.cut.json`. Check FANCY is still wanted — it is not one of
the eight tiles, so it is currently reachable only by direct link.

---

## 3. Cart drawer padding — DONE on WEB 16

`.side-panel-content` shipped `padding: 30px 30px 0` — 30px on three sides and
nothing at the bottom. Measured with an item in the cart, View cart and Checkout
both ended at exactly **720px on a 720px viewport**: button bottom, drawer bottom
and screen bottom all on the same pixel.

Added to `assets/orloff-fixes.css`:

```css
.cart-drawer .side-panel-content {
  padding-bottom: 30px;
  padding-bottom: max(30px, env(safe-area-inset-bottom, 0px));
}
```

Scoped to `.cart-drawer` so the search and menu side panels are untouched. The
`env()` line keeps the buttons clear of the iOS home indicator. Verified: buttons
now end at 690px with an even 30px gutter, padding uniform on all four sides.

---

## 4. Checkout — what is and is not possible

**The Checkout Branding API is Plus-only.** The API said so directly: *"the shop
must be on a Plus plan or a Development store plan."* Orloff is on **Basic**.
`checkout.liquid` is gone for everyone, and checkout UI extensions need Plus too.
So I cannot change the checkout programmatically, and neither can any theme file.

### What the checkout looks like today

Loaded it with a real cart. It is running Shopify's stock defaults:

| | Checkout now | Storefront brand |
|---|---|---|
| Font | `-apple-system` | Cormorant Garamond headings, Inter body |
| Link / accent colour | `rgb(0, 91, 209)` — Shopify default blue | navy `#091b36`, gold `#bc973f` |
| Logo | present, 61px wide | — |
| Corner radius | 0 | 0 (already matches) |

Default blue links on a navy-and-gold brand, in system font, at the moment of
highest purchase anxiety on a store selling five-figure rings.

### What you can change, in Settings → Checkout → Customize

Available on Basic, manual, roughly ten minutes:

1. **Accent colour** → `#091b36`. This drives links, the active field outline and
   the primary button.
2. **Typography** → Cormorant Garamond for headings, Inter for body. Both are in
   Shopify's font library.
3. **Logo** → size up from 61px, and set alignment to match the storefront header.
4. **Corner radius** → confirm 0 so buttons and fields stay square like the rest
   of the site.
5. **Banner image** → optional, but a single restrained brand image at the top
   does more for confidence here than anywhere else on the site.

### What I can still do for checkout without Plus

- **Checkout wording** via the translations API — the strings at checkout are
  translatable, so anything reading generically can be reworded in brand voice.
- **Everything upstream**: the cart drawer, the line-item properties the
  configurators pass through (Metal, Diamond Origin, Grade, Carat, Ring Size,
  SKU — these all carry into the order and read well), and the policy pages
  linked from the checkout footer.
- **Worth checking:** no express or wallet buttons were present on the checkout I
  loaded. Shop Pay, Apple Pay and Google Pay are toggled in Settings → Payments,
  and on a high-value jewellery cart the accelerated buttons are usually worth
  having. Confirm that is a deliberate choice rather than an unticked box.

If checkout branding matters enough, the honest note is that it is one of the
things Plus actually buys — but the five settings above close most of the visual
gap on Basic.

---

## 5. Checkout, second pass (4 Aug) — the real problems are not visual

Confirmed both directions of the branding API are closed: `checkoutBranding`
(read) and `checkoutBrandingUpsert` (write) both return *"the shop must be on a
Plus plan or a Development store plan."* Nothing programmatic is possible.

So I audited what checkout actually depends on instead, and the visual gap turns
out to be the least of it.

### 5a. The privacy policy is empty. Live, linked, and blank.

`/policies/privacy-policy` returns **HTTP 200 with zero characters of content**.
The policy record exists with an empty body.

It is linked from the checkout footer, the site footer, and the cookie notice.
A customer in the EU clicking "Privacy Policy" during checkout on a store that
bills in USD, ships internationally and operates from Thailand gets a blank page.
That is a GDPR/CCPA/PDPA exposure, not a design nit, and it sits at the exact
moment a stranger is deciding whether to hand over a card for a five-figure ring.

**This is the single highest-value checkout fix available.** Two routes:

1. Shopify Admin → Settings → Policies → Privacy policy → **"Insert default
   template"**, then edit. Shopify's generator is jurisdiction-aware and is the
   safer starting point for a legal document.
2. I draft one against the actual data practices (Shopify, Nivoda feed, Inbox
   chat, any analytics/pixels) and you review before it publishes.

Say which and I will run with it.

### 5b. Terms of Service still has Shopify's placeholders in it

Three defects in the live Terms:

| Where | Current | Should be |
|---|---|---|
| Section 5 | `[LINK TO REFUND POLICY]` | link to `/policies/refund-policy` |
| Section 10 | `[LINK TO PRIVACY POLICY]` | link to `/policies/privacy-policy` |
| Section 6 | `https://orloffofdenmark.co.th/policies/refund-policy` | `/policies/refund-policy` |

The first two are unreplaced boilerplate from Shopify's template. The third
points at the **.co.th domain** from the .com store — the same stray cross-domain
link that also sits in the About Diamonds template's "Choose Your Own Diamond"
button.

**I have deliberately not rewritten this myself.** `shopPolicyUpdate` replaces
the whole body, and the Terms run to roughly 20,000 characters of legal text.
Retyping all of it to correct three references means a transcription slip becomes
a legally operative error in a document you are bound by. Not a good trade for
three strings. Do it in Admin → Settings → Policies → Terms of service with
find-and-replace; it is a sixty-second edit and the risk stays at zero.

### 5c. Correction: the wallet buttons are fine

I said earlier that no express or wallet buttons appeared at checkout and
suggested confirming that was deliberate. That was wrong, and the cause was my
own browser.

`paymentSettings.supportedDigitalWallets` returns **`["APPLE_PAY",
"GOOGLE_PAY"]`** — both are enabled on the account. Wallet buttons only render
on a device and browser that can actually offer them, which the automation
browser cannot. Nothing to fix. Apologies for the false alarm.

### 5d. The rest of the policies

- **Refund policy** — solid. 30 days, condition requirements, damages, exchanges,
  refund timing, return address. Reads properly.
- **Shipping policy** — thin. Three price lines and a tracking sentence. For
  made-to-order engagement rings the omission that matters is **production lead
  time**, which the 22 Jul audit also flagged as missing from the PDP. A customer
  spending $5,730 wants to know when it arrives before they pay, not after.
- **Contact information** — complete and correct.

### 5e. Revised order of work for checkout

1. Privacy policy — write it. Everything else here is cosmetic by comparison.
2. Terms — three find-and-replace fixes in Admin.
3. Shipping policy — add made-to-order lead times.
4. The five branding settings in Settings → Checkout → Customize.
