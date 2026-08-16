/**
 * ORLOFF OF DENMARK - Nivoda API Proxy (Cloudflare Worker)
 * ---------------------------------------------------------
 * Nivoda credentials NEVER touch the browser. They live only here, as
 * Cloudflare Worker secrets. The storefront calls this Worker; this Worker
 * calls Nivoda.
 *
 * Endpoints exposed to the storefront:
 *   GET  /api/diamonds          -> search/filter loose diamonds
 *   GET  /api/diamonds/:id      -> single diamond detail
 *   POST /api/holds             -> place a hold (Pro API only; 501 until enabled)
 *   POST /api/orders            -> place an order (Pro API only; 501 until enabled)
 *
 * Required secrets (set via `wrangler secret put <NAME>`):
 *   NIVODA_USERNAME   - Nivoda platform login email (or staging creds from Nivoda)
 *   NIVODA_PASSWORD   - Nivoda platform login password
 *
 * NOTE: There are NO built-in staging fallback credentials. Nivoda shares
 * staging credentials on request only (email tech@nivoda.net). Secrets are
 * required in both environments.
 *
 * Required vars (wrangler.toml [vars]):
 *   NIVODA_ENV        - "staging" or "production"
 *   ALLOWED_ORIGIN    - e.g. "https://orloffofdenmark.com"
 *   PRO_API_ENABLED   - "true" once Nivoda confirms Pro access, else "false"
 *
 * Required binding:
 *   TOKEN_KV          - Cloudflare KV namespace, caches the auth token
 *                       (Nivoda tokens last ~6 hours; we cache for 5.5)
 */

const ENDPOINTS = {
  staging: 'https://intg-customer-staging.nivodaapi.net/api/diamonds',
  production: 'https://integrations.nivoda.net/api/diamonds',
};

// Env-scoped so a cached staging token can never be replayed against
// production (or vice versa) after NIVODA_ENV changes.
const TOKEN_CACHE_KEY_BASE = 'nivoda_auth_token';
const TOKEN_TTL_SECONDS = 5.5 * 60 * 60; // cache 5.5h; Nivoda tokens last ~6h

/* ------------------------------------------------------------------ */
/* Entry                                                               */
/* ------------------------------------------------------------------ */

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Lock down cross-origin browser calls to the storefront only.
    if (origin && origin !== env.ALLOWED_ORIGIN) {
      return json({ error: 'Origin not allowed' }, 403, cors);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');

    try {
      if (request.method === 'GET' && path === '/api/diamonds') {
        return await handleSearch(url, env, cors);
      }

      // One-off schema discovery (e.g. ?type=DiamondQuery) — used to find the
      // fancy-colour filter fields. Safe read-only introspection; remove later.
      if (request.method === 'GET' && path === '/api/introspect') {
        return await handleIntrospect(url, env, cors);
      }

      const detailMatch = path.match(/^\/api\/diamonds\/([^/]+)$/);
      if (request.method === 'GET' && detailMatch) {
        return await handleDetail(decodeURIComponent(detailMatch[1]), env, cors);
      }

      if (request.method === 'POST' && path === '/api/holds') {
        return await handleHold(request, env, cors);
      }

      if (request.method === 'POST' && path === '/api/orders') {
        return await handleOrder(request, env, cors);
      }

      return json({ error: 'Not found' }, 404, cors);
    } catch (err) {
      return json({ error: 'Upstream error', detail: String(err && err.message || err) }, 502, cors);
    }
  },
};

/* ------------------------------------------------------------------ */
/* Auth: token cached in KV                                            */
/* ------------------------------------------------------------------ */

function tokenCacheKey(env) {
  return TOKEN_CACHE_KEY_BASE + '_' + (env.NIVODA_ENV || 'staging');
}

async function getToken(env) {
  const cached = await env.TOKEN_KV.get(tokenCacheKey(env));
  if (cached) return cached;

  const username = env.NIVODA_USERNAME;
  const password = env.NIVODA_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'NIVODA_USERNAME / NIVODA_PASSWORD secrets are not set. ' +
      'Run: wrangler secret put NIVODA_USERNAME && wrangler secret put NIVODA_PASSWORD. ' +
      'Staging credentials must be requested from tech@nivoda.net.'
    );
  }

  const query = `
    query Authenticate($username: String!, $password: String!) {
      authenticate {
        username_and_password(username: $username, password: $password) {
          token
        }
      }
    }
  `;

  const res = await gqlRaw(env, query, { username, password }, /* token */ null);
  const token =
    res && res.data &&
    res.data.authenticate &&
    res.data.authenticate.username_and_password &&
    res.data.authenticate.username_and_password.token;

  if (!token) {
    const msg = res && res.errors ? JSON.stringify(res.errors) : 'no token in response';
    throw new Error('Nivoda authentication failed: ' + msg);
  }

  await env.TOKEN_KV.put(tokenCacheKey(env), token, { expirationTtl: TOKEN_TTL_SECONDS });
  return token;
}

/** Low-level GraphQL POST. Pass token=null for the auth call itself. */
async function gqlRaw(env, query, variables, token) {
  const endpoint = ENDPOINTS[env.NIVODA_ENV] || ENDPOINTS.staging;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error('Nivoda HTTP ' + res.status);
  return res.json();
}

/** Authenticated GraphQL call with one automatic retry on auth failure
 *  (covers the case where a cached token was revoked early). */
async function gql(env, query, variables) {
  let token = await getToken(env);
  let res = await gqlRaw(env, query, variables, token);

  const authError =
    res && res.errors &&
    res.errors.some((e) => /auth|token|unauthor/i.test(e.message || ''));

  if (authError) {
    await env.TOKEN_KV.delete(tokenCacheKey(env));
    token = await getToken(env);
    res = await gqlRaw(env, query, variables, token);
  }

  if (res && res.errors && res.errors.length) {
    throw new Error('Nivoda GraphQL: ' + res.errors.map((e) => e.message).join('; '));
  }
  return res.data;
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

/**
 * Tiered markup — mirrors the Orloff markup schedule set up in Nivoda's Feeds
 * Hub, but applied HERE on the live API so prices stay real-time (the Feeds Hub
 * markups only apply to Nivoda's generated feeds, not the GraphQL API).
 *
 * The band is chosen by the diamond's raw COST (Nivoda's `price`, in USD).
 * Natural and lab-grown have separate schedules. `to` is the inclusive upper
 * bound of each cost band in whole USD, so a stone costing exactly $300 lands in
 * the 0-300 band and $300.01 falls into the next. `mult` = (1 + markup%).
 * Raw Nivoda cost is NEVER included in the response — only the marked price.
 */
const MARKUP_NATURAL = [
  { to: 300, mult: 1.45 }, //  45%
  { to: 500, mult: 1.40 }, //  40%
  { to: 1000, mult: 1.25 }, //  25%
  { to: 2000, mult: 1.20 }, //  20%
  { to: 3000, mult: 1.20 }, //  20%
  { to: 5000, mult: 1.20 }, //  20%
  { to: 10000, mult: 1.18 }, //  18%
  { to: 15000, mult: 1.18 }, //  18%
  { to: 30000, mult: 1.09 }, //   9%
  { to: 100000, mult: 1.09 }, //   9%
  { to: 5000000, mult: 1.09 }, //   9%
];

const MARKUP_LABGROWN = [
  { to: 300, mult: 2.5 }, // 150%
  { to: 500, mult: 2.5 }, // 150%
  { to: 1000, mult: 2.5 }, // 150%
  { to: 2000, mult: 2.0 }, // 100%
  { to: 3000, mult: 1.5 }, //  50%
  { to: 5000, mult: 1.4 }, //  40%
  { to: 10000, mult: 1.4 }, //  40%
  { to: 15000, mult: 1.28 }, //  28%
  { to: 30000, mult: 1.26 }, //  26%
  { to: 100000, mult: 1.25 }, //  25%
  { to: 5000000, mult: 1.25 }, //  25%
];

function markupTable(isLabGrown) {
  return isLabGrown ? MARKUP_LABGROWN : MARKUP_NATURAL;
}

// Multiplier for a raw cost (in USD dollars). Above the top band, hold the last rate.
function markupMultiplier(costDollars, isLabGrown) {
  const table = markupTable(isLabGrown);
  for (const band of table) {
    if (costDollars <= band.to) return band.mult;
  }
  return table[table.length - 1].mult;
}

/**
 * Apply the tiered markup to a raw cost (USD cents) and round the sale price UP
 * to the nearest whole dollar. Returns both cents and a display number.
 */
function markupPrice(rawCents, isLabGrown) {
  if (typeof rawCents !== 'number' || isNaN(rawCents)) return null;
  const mult = markupMultiplier(rawCents / 100, isLabGrown);
  const markedCents = Math.ceil((rawCents * mult) / 100) * 100;
  return {
    price_cents: markedCents,
    price_usd: markedCents / 100,
  };
}

/**
 * Inverse of the markup, for the price-range filter. The storefront slider is in
 * displayed (marked-up) dollars, but Nivoda filters on raw cost, so convert a
 * displayed bound back to a raw-cost bound (cents) by finding the band whose
 * marked-up range contains it. Exact except within the few-dollar overlaps at
 * band boundaries — well inside the slider's $100 step.
 */
function displayedToCostCents(displayedDollars, isLabGrown) {
  const table = markupTable(isLabGrown);
  for (const band of table) {
    const cost = displayedDollars / band.mult;
    if (cost <= band.to) return Math.round(cost * 100);
  }
  const last = table[table.length - 1];
  return Math.round((displayedDollars / last.mult) * 100);
}

/* ------------------------------------------------------------------ */
/* GET /api/diamonds                                                   */
/* ------------------------------------------------------------------ */

const DIAMOND_FIELDS = `
  id
  diamond {
    id
    video
    image
    availability
    supplierStockId
    brown
    green
    milky
    eyeClean
    mine_of_origin
    certificate {
      id
      lab
      shape
      certNumber
      cut
      carats
      clarity
      polish
      symmetry
      color
      width
      length
      depth
      girdle
      floInt
      floCol
      depthPercentage
      table
      labgrown
    }
  }
  price
  discount
`;

// Nivoda's white colour grades (D..Z, with the lower grades grouped). Used as the
// default colour constraint so fancy-colour stones don't leak into the white
// browse. Fancy mode (?fancy=true) opts out of this default.
const WHITE_COLORS = [
  'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'NO', 'PR', 'SZ', 'OP', 'QR', 'ST', 'UV', 'WX', 'XY', 'YZ',
];

// Recognised labs — requiring one strips no-certificate junk listings. Verified
// valid Nivoda enums that together cover every certified stone.
const DEFAULT_LABS = ['GIA', 'IGI', 'HRD', 'GCAL', 'GSI'];

async function handleSearch(url, env, cors) {
  const p = url.searchParams;

  const shapes = splitParam(p.get('shapes')).map((s) => s.toUpperCase());
  const color = splitParam(p.get('color')).map((s) => s.toUpperCase());
  const clarity = splitParam(p.get('clarity')).map((s) => s.toUpperCase());
  const cut = splitParam(p.get('cut')).map((s) => s.toUpperCase());
  const polish = splitParam(p.get('polish')).map((s) => s.toUpperCase());
  const symmetry = splitParam(p.get('symmetry')).map((s) => s.toUpperCase());
  // EyeClean enum is case-sensitive: Yes | No | Borderline
  const eyeClean = splitParam(p.get('eyeClean'))
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .filter((s) => ['Yes', 'No', 'Borderline'].includes(s));
  const heartsArrows = p.get('heartsArrows') === 'true';
  const labs = splitParam(p.get('lab')).map((s) => s.toUpperCase());

  const caratMin = parseFloat(p.get('caratMin') || '0') || 0;
  const caratMax = parseFloat(p.get('caratMax') || '30') || 30;
  const labgrown = p.get('labgrown') === 'true';
  const fancy = p.get('fancy') === 'true';

  const limit = clamp(parseInt(p.get('limit') || '24', 10) || 24, 1, 50);
  const offset = Math.max(parseInt(p.get('offset') || '0', 10) || 0, 0);
  const direction = (p.get('sortDir') || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  // Storefront sort keys -> Nivoda DiamondOrderType enum values.
  const sortByParam = p.get('sortBy');
  const sortType =
    sortByParam === 'carat' ? 'size' : sortByParam === 'ppc' ? 'price_per_carat' : 'price';

  // Price filters arrive in displayed (marked-up) dollars from the storefront and
  // are converted back to raw Nivoda cost cents using the same tiered schedule,
  // so upstream filtering matches what the shopper sees. The schedule differs for
  // natural vs lab-grown, so the inverse uses this search's labgrown flag.
  const priceMin = p.get('priceMin') ? displayedToCostCents(parseFloat(p.get('priceMin')), labgrown) : null;
  const priceMax = p.get('priceMax') ? displayedToCostCents(parseFloat(p.get('priceMax')), labgrown) : null;

  const queryObj = {
    labgrown,
    sizes: [{ from: caratMin, to: caratMax }],
    has_image: true,
    // Only purchasable stones. Without this, stones on hold / memo / sold
    // surface on the storefront but aren't findable or buyable on Nivoda.
    availability: ['AVAILABLE'],
  };
  if (shapes.length) queryObj.shapes = shapes;
  if (polish.length) queryObj.polish = polish;
  if (symmetry.length) queryObj.symmetry = symmetry;
  if (eyeClean.length) queryObj.eyeClean = eyeClean;
  if (heartsArrows) queryObj.hearts_arrows = true;
  // Quality baseline: the default (white) browse is constrained to real white
  // colour grades — which strips fancy-colour junk at the source — and always
  // requires a recognised lab, which strips no-certificate listings. Fancy mode
  // (?fancy=true) shows only fancy-colour stones, optionally narrowed by
  // fancyColor / fancyIntensity / fancyOvertone (Nivoda String filter fields).
  if (!fancy) {
    queryObj.color = color.length ? color : WHITE_COLORS;
  } else {
    queryObj.color = ['FANCY'];
    const fc = p.get('fancyColor');
    const fi = p.get('fancyIntensity');
    const fo = p.get('fancyOvertone');
    if (fc) queryObj.fancyColor = fc;
    if (fi) queryObj.fancyIntensity = fi;
    if (fo) queryObj.fancyOvertone = fo;
  }
  if (clarity.length) queryObj.clarity = clarity;
  if (cut.length) queryObj.cut = cut;
  queryObj.certificate_lab = labs.length ? labs : DEFAULT_LABS;
  if (priceMin !== null || priceMax !== null) {
    queryObj.dollar_value = { from: priceMin || 0, to: priceMax || 100000000 };
  }

  const query = `
    query Search($query: DiamondQuery!, $offset: Int!, $limit: Int!, $direction: OrderDirection!, $sortType: DiamondOrderType!) {
      diamonds_by_query(
        query: $query,
        offset: $offset,
        limit: $limit,
        order: { type: $sortType, direction: $direction }
      ) {
        items { ${DIAMOND_FIELDS} }
      }
    }
  `;

  // The `total_count` field inside diamonds_by_query only reflects the current
  // page size (it echoes `limit`), so it can't drive pagination. The true match
  // count comes from the separate diamonds_by_query_count query. Both run in
  // parallel to avoid adding a serial round-trip.
  const countQuery = `
    query Count($query: DiamondQuery!) {
      diamonds_by_query_count(query: $query)
    }
  `;

  const [data, countData] = await Promise.all([
    gql(env, query, { query: queryObj, offset, limit, direction, sortType }),
    gql(env, countQuery, { query: queryObj }).catch(() => null),
  ]);

  const result = data && data.diamonds_by_query;
  const items = (result && result.items ? result.items : []).map((it) => shapeItem(env, it));
  const total =
    countData && typeof countData.diamonds_by_query_count === 'number'
      ? countData.diamonds_by_query_count
      : items.length;

  return json({ total, offset, limit, items }, 200, cors);
}

/* ------------------------------------------------------------------ */
/* GET /api/diamonds/:id                                               */
/* ------------------------------------------------------------------ */

async function handleDetail(id, env, cors) {
  // The storefront passes the offer id ("DIAMOND/<uuid>"); Nivoda's
  // get_diamond_by_id expects the bare diamond uuid.
  const diamondId = String(id).replace(/^DIAMOND\//i, '');

  const query = `
    query Detail($id: ID!) {
      get_diamond_by_id(diamond_id: $id) { ${DIAMOND_FIELDS} }
    }
  `;

  const data = await gql(env, query, { id: diamondId });
  const item = data && data.get_diamond_by_id;
  if (!item) return json({ error: 'Diamond not found' }, 404, cors);

  return json(shapeItem(env, item), 200, cors);
}

/* ------------------------------------------------------------------ */
/* POST /api/holds  and  POST /api/orders  (Pro API only)              */
/* ------------------------------------------------------------------ */

/**
 * Read-only GraphQL introspection, for discovering filter fields/enums.
 * GET /api/introspect?type=DiamondQuery  -> the input fields of the query type.
 * GET /api/introspect?type=<EnumName>    -> that enum's allowed values.
 */
async function handleIntrospect(url, env, cors) {
  const typeName = url.searchParams.get('type') || 'DiamondQuery';
  const query = `
    query Introspect($name: String!) {
      __type(name: $name) {
        name
        kind
        enumValues { name }
        inputFields {
          name
          type { name kind ofType { name kind ofType { name kind ofType { name kind } } } }
        }
      }
    }
  `;
  const data = await gql(env, query, { name: typeName });
  return json(data, 200, cors);
}

async function handleHold(request, env, cors) {
  if (env.PRO_API_ENABLED !== 'true') {
    return json(
      { error: 'Holds require Nivoda Pro API access. Set PRO_API_ENABLED once Nivoda confirms activation.' },
      501,
      cors
    );
  }

  const body = await request.json().catch(() => ({}));
  if (!body.diamond_id) return json({ error: 'diamond_id is required' }, 400, cors);

  // Nivoda holds are keyed by the bare diamond uuid + product type.
  // Shape per Nivoda's examples/holds; untestable until Pro access is live.
  const productId = String(body.diamond_id).replace(/^DIAMOND\//i, '');
  const mutation = `
    mutation Hold($productId: ID!) {
      create_hold(ProductId: $productId, ProductType: Diamond) {
        id
        denied
        until
      }
    }
  `;

  const data = await gql(env, mutation, { productId });
  return json(data, 200, cors);
}

async function handleOrder(request, env, cors) {
  if (env.PRO_API_ENABLED !== 'true') {
    return json(
      { error: 'Orders require Nivoda Pro API access. Set PRO_API_ENABLED once Nivoda confirms activation.' },
      501,
      cors
    );
  }

  /*
   * SECURITY: this endpoint must only ever be called by a Shopify order
   * webhook AFTER payment is confirmed, never directly from the browser.
   * The webhook handler (with HMAC verification of Shopify's signature)
   * is a separate build step before Pro goes live. Until that exists,
   * this endpoint additionally requires a shared secret header so it
   * cannot be triggered from the open internet.
   */
  const provided = request.headers.get('X-Orloff-Order-Key') || '';
  if (!env.ORDER_SHARED_KEY || provided !== env.ORDER_SHARED_KEY) {
    return json({ error: 'Forbidden' }, 403, cors);
  }

  const body = await request.json().catch(() => ({}));
  if (!body.diamond_id) return json({ error: 'diamond_id is required' }, 400, cors);

  // Shape per Nivoda's examples/orders (OrderItemInput). `offerId` is the full
  // offer id ("DIAMOND/<uuid>"). A real order also needs `destinationId` (a
  // Nivoda shipping-destination id) — pass it through when the caller supplies
  // one. Untestable until Pro access is live.
  const mutation = `
    mutation Order($items: [OrderItemInput!]!) {
      create_order(items: $items)
    }
  `;

  const item = {
    offerId: String(body.diamond_id),
    customer_order_number: body.reference || null,
    customer_comment: body.comment || null,
    return_option: body.return_option === true,
  };
  if (body.destinationId) item.destinationId = body.destinationId;

  const data = await gql(env, mutation, { items: [item] });
  return json(data, 200, cors);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function shapeItem(env, it) {
  const d = it.diamond || {};
  const c = d.certificate || {};
  const isLabGrown = !!c.labgrown;
  const priced = markupPrice(it.price, isLabGrown);

  return {
    id: it.id,
    availability: d.availability || null,
    image: d.image || null,
    // Served for the storefront's click-to-load 360 button. Many loupe360 links
    // are delisted ("Stone not Found") and can't be validated server-side, so
    // the storefront only loads this iframe when a shopper explicitly taps 360.
    video: d.video || null,
    origin: d.mine_of_origin || null,
    eye_clean: d.eyeClean || null,
    tinge: { brown: d.brown || null, green: d.green || null, milky: d.milky || null },
    certificate: {
      lab: c.lab || null,
      labgrown: isLabGrown,
      number: c.certNumber || null,
      shape: c.shape || null,
      carats: c.carats || null,
      color: c.color || null,
      clarity: c.clarity || null,
      cut: c.cut || null,
      polish: c.polish || null,
      symmetry: c.symmetry || null,
      fluorescence: c.floInt || null,
      measurements: { length: c.length || null, width: c.width || null, depth: c.depth || null },
      depth_pct: c.depthPercentage || null,
      table_pct: c.table || null,
      girdle: c.girdle || null,
    },
    ...(priced || { price_cents: null, price_usd: null }),
  };
}

function splitParam(v) {
  return (v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function corsHeaders(env, origin) {
  return {
    'Access-Control-Allow-Origin': origin === env.ALLOWED_ORIGIN ? origin : env.ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Orloff-Order-Key',
    'Access-Control-Max-Age': '86400',
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
