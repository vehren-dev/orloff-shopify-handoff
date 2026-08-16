# WHERE WE LEFT OFF — read this first

_Last updated: 2026-07-21 (laptop session)_

## IMPORTANT: which page renders the section

- **/pages/diamonds** — the REAL page. Its template (`nivoda_search` section)
  renders `sections/nivoda-diamond-search.liquid`, i.e. everything we push.
  Preview any unpublished theme with `?preview_theme_id=<id>`.
- **/pages/loose-diamonds** — DELETED 2026-07-21 (Viktor's call). It was an old
  v1 build pasted into the page BODY. Rendered HTML backed up in
  `backups/loose-diamonds-page-live-backup.html`. A URL redirect now sends
  /pages/loose-diamonds -> /pages/diamonds (redirect id 873905979682).

## Nivoda production access — GRANTED 2026-07-21 (Julia, ticket 344135)

Official production API access confirmed for the platform login. Worker
verified working post-grant (86k+ rounds, marked-up prices). Still open on
the Nivoda side: the Pro API application (holds + orders) — chase in the
same ticket. Old notes below.

## (older notes) Nivoda production access (email thread, 2026-07-21)

Julia at Nivoda support asked for the URL of the page showing API data so they
can verify + grant access. Answer: https://orloffofdenmark.com/pages/diamonds
She also recommends creating a dedicated API user (Nivoda User Management) so
the worker's credentials aren't Viktor's personal login. Once created and
access is granted: on the desktop run `wrangler secret put NIVODA_USERNAME` /
`NIVODA_PASSWORD` with the new user's login, then `wrangler deploy`.

## NEW: remote theme pushes work

The Shopify MCP can write `sections/nivoda-diamond-search.liquid` directly to
UNPUBLISHED themes (staged upload -> themeFilesUpsert). WEB numbers are theme
copies; WEB 8 is LIVE (blocked for writes, paste manually), WEB 9+ can be
pushed remotely. Shape icons live on Shopify CDN as orloff-shape-<shape>.jpg.
The worker's price-per-carat sort (sortBy=ppc) still needs a wrangler deploy.

This note travels on the E: drive so any device picks up the thread. Update it
at the end of each session.

## The one thing that matters right now

**The tiered markup is written and tested, but NOT deployed.** The live site
still shows diamonds at cost until someone runs `wrangler deploy`.

- ✅ Markup schedule coded into `worker.js` (Natural + Lab-Grown tiers)
- ✅ Tested against live inventory — prices come out correct
- ⬜ **Deploy it:** run `wrangler deploy` from the machine where wrangler is
  logged into Cloudflare (the desktop). That's the only step left to go live.

After deploying: refresh the storefront and confirm prices went up, then switch
OFF the two Nivoda "data feeds" (they're redundant).

## Key facts we figured out (so we don't re-litigate them)

- Nivoda has TWO systems: the **raw GraphQL API** (returns trade COST — this is
  what our worker uses) and the **Feeds Hub / Connect** managed product (where
  the markup settings on app.nivoda.com live). The API ignores those markup
  settings by design — that's why we apply markup ourselves in `worker.js`.
- Markup now lives in `worker.js` under "Pricing" as `MARKUP_NATURAL` /
  `MARKUP_LABGROWN`. To change margins, edit those tables (or ask Claude).
  Downside: it does NOT auto-sync with Nivoda's dashboard — it's a manual copy.
- Lab-grown is detected per stone via `certificate.labgrown`.
- Live worker URL: https://orloff-nivoda-proxy.orloffofdenmark.workers.dev
- This folder is now a git repo — history is saved. `git log` to see it.

## To run locally (optional, needs Nivoda login)

`cp .dev.vars.example .dev.vars`, fill in Nivoda username/password, then
`wrangler dev`. Deploy does NOT need this file (secrets already on Cloudflare).

## Open question for Viktor

Do you retune markups often, or set-and-forget? If often, consider Nivoda
Connect (auto-syncs settings) instead of the custom build. If set-and-forget,
the current custom path is the right call.

## PRODUCTION LIVE — 2026-07-21

Worker deployed from the laptop (wrangler is logged in here too, not just
the desktop): NIVODA_ENV=production, fresh platform-login secrets, env-scoped
token cache, tiered markup, price-per-carat sort. Verified: 78k real rounds,
unmasked cert numbers, ppc sort working. WEB 9 theme published by Viktor.
The staging-data era is over - stones on the site are real marketplace stock.

## WEB 10 hover-360 rework — 2026-07-21 (desktop session)

Viktor's review found the hover spin zoomed-in (500x500 player overflowing
the ~344px card). Fixed in two steps, both live on WEB 10:
1. Scale fix, then better: request the loupe360 player at the card's own
   size (`/video/344/344`) — fits natively AND downloads smaller frames.
2. Interactive hover per Viktor's spec: pointer-events now reach the player
   (click-drag rotate + loupe360's two slides/arrows on the card), and
   loaded spins STAY mounted (LRU cap 6) so re-hover is instant.
Trade-off: clicking a PLAYING spin belongs to the player, not our popup;
card body still opens detail. Verified with screenshots: native fit, no
zoom; drag-rotate needs a human hand-check (synthetic input can't enter
cross-origin iframes — automated drag bubbled to the page and opened the
popup, which a real mouse won't do).

## WEB 10 — pushed 2026-07-21, awaiting Viktor's review/publish

Left-slide filter drawer, Cut/Polish/Symmetry block with 3EX / EX Cut /
3VG+ / Hearts & Arrows presets, Eye Clean Yes/No, richer media popup
(price + 12-fact spec grid), hover-to-spin 360 on grid cards. Worker
redeployed with polish/symmetry/eyeClean/heartsArrows params and a hard
availability:[AVAILABLE] filter (no more ghost stones). All verified on
the WEB 10 preview against production data.
