# Orloff - Nivoda API Proxy

A Cloudflare Worker that sits between the Shopify storefront and Nivoda's
GraphQL diamond API. Your Nivoda login never touches the browser. It lives
only as a Worker secret on Cloudflare's servers.

## Why this exists

Nivoda's API authenticates with your platform username and password. If
that lived in `ring-configurator.js` or any theme file, anyone could open
View Source and read your login, then scrape your supplier feed or place
orders on your account. This Worker is the only thing that talks to Nivoda.

## What's built

- `GET /api/diamonds` - search/filter loose diamonds (shape, carat, color,
  clarity, cut, lab-grown, cert lab, price range). Returns marked-up
  prices only; raw Nivoda cost never leaves the Worker.
- `GET /api/diamonds/:id` - full detail for a single diamond
- `POST /api/holds` - places a hold (**disabled until Pro API confirmed**,
  returns 501 until then)
- `POST /api/orders` - places an order (**same, plus a shared-key header
  requirement so it can never be triggered from the open internet**)

## IMPORTANT CORRECTION vs. the earlier version

The earlier build claimed Nivoda publishes public staging test
credentials. That is wrong. Per Nivoda's current docs, staging
credentials are **shared on request only**. So:

- To test on staging: email tech@nivoda.net and ask for staging
  credentials, then set them as secrets.
- Or skip staging: once your account manager activates API access on your
  account, your normal Nivoda platform login works against production.

Either way, `wrangler dev` will return a clear error until secrets exist.

## One-time setup

You need a free Cloudflare account and the wrangler CLI:

```bash
npm install -g wrangler
wrangler login
```

Create the KV namespace (caches the auth token; Nivoda tokens last about
6 hours, we cache for 5.5):

```bash
wrangler kv namespace create TOKEN_KV
```

This prints an `id`. Paste it into `wrangler.toml` where it says
`REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.

## Configure wrangler.toml

- `MARKUP_PERCENT` - your real markup, e.g. `"35"`. **Currently `"0"` on
  purpose. Do not deploy to production at 0 or diamonds show at cost.**
- `ALLOWED_ORIGIN` - already `https://orloffofdenmark.com`, confirm exact.
- `NIVODA_ENV` - `"staging"` or `"production"`.

## Set credentials

```bash
wrangler secret put NIVODA_USERNAME
wrangler secret put NIVODA_PASSWORD
```

Use staging credentials from Nivoda if testing staging, or your platform
login for production (after API access is activated on your account).

## Test locally

```bash
wrangler dev
```

Then:

```bash
curl "http://localhost:8787/api/diamonds?shapes=ROUND&caratMin=0.5&caratMax=1.5&color=D,E,F&clarity=VS1,VS2&limit=5"
```

You should get JSON with marked-up prices. Staging data can be incomplete
or inconsistent (Nivoda's own disclaimer); the point is confirming the
chain: auth -> query -> markup -> response.

## Field-name caveat

The GraphQL field names in `worker.js` (`diamonds_by_query`,
`diamond_by_id`, `certificate_lab`, `dollar_value`, hold/order mutation
shapes) match Nivoda's documented examples but should be verified once
against your GraphiQL explorer before going live:
https://integrations.nivoda.net/api/diamonds-graphiql
(GraphiQL page login: nivoda-api-docs / nivoda-graphiql). If any field
errors, the Worker surfaces Nivoda's exact error message in the response,
so mismatches are loud, not silent.

## Going to production

1. Ask your account manager / tech@nivoda.net to activate API access.
2. Set your real credentials as secrets (never in wrangler.toml).
3. Change `NIVODA_ENV = "production"`.
4. `wrangler deploy`
5. You get a URL like
   `https://orloff-nivoda-proxy.<your-subdomain>.workers.dev`. That is
   what the storefront JS calls, never Nivoda directly.

## When Pro API is approved

Set `PRO_API_ENABLED = "true"`, set the order key secret
(`wrangler secret put ORDER_SHARED_KEY`), redeploy. `/api/holds` starts
working immediately.

**Before Pro goes live:** `/api/orders` must only ever be called by a
Shopify order webhook after payment is confirmed, never from the browser.
The shared-key header is an interim guard; the real webhook handler with
Shopify HMAC verification is the next build step once Pro is confirmed.

## Not built yet (next steps, in order)

1. Storefront search/filter UI (navy #091b36, Cormorant Garamond / Inter)
2. Wiring the search UI into the ring configurator so a customer can pick
   a loose stone
3. Shopify payment webhook -> /api/orders handler (Pro only)
