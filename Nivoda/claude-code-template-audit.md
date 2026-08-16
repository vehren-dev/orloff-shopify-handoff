# Instructions for Claude Code — Diamond Page Template Consolidation

## Background

The Shopify Admin API shows this store has FOUR diamond-related pages,
and they don't all use the same template:

| Page title      | Handle            | Template            |
|-----------------|--------------------|----------------------|
| Diamonds        | diamonds           | `diamonds` (custom)  |
| Detail Products | detail-products     | `nivoda-detail` (custom) |
| Diamond Feed    | diamond-feed        | `feed` (custom)      |
| Loose Diamonds  | loose-diamonds      | none — default page template |

We (Viktor + Claude) have been actively working on **/pages/loose-diamonds**,
which is using Shopify's generic default page template. This is likely
why CSS/styling from diamond-page-complete.html hasn't been rendering
correctly — a default page template may not support the custom
section/template structure we assumed.

Meanwhile, `diamonds` and `nivoda-detail` are CUSTOM templates that
already existed in this store before this session. We don't know what's
in them — they could be an earlier, more complete build of this same
feature, or old/unused files.

## What to do, in order

1. **Read the template files** for:
   - `templates/page.diamonds.json` (or `.liquid`, check both)
   - `templates/page.nivoda-detail.json` (or `.liquid`)
   - `templates/page.feed.json` (or `.liquid`)
   - Any associated sections referenced by those templates
     (check `sections/` for files with "diamond" or "nivoda" in the name)

2. **Report back before changing anything**: summarize what each of
   those three templates currently contains — is there existing diamond
   search/filter/grid markup? Does it reference the Nivoda Worker or any
   API? Is it more complete, less complete, or unrelated to what we've
   built on loose-diamonds today?

3. **Do not merge or delete anything yet.** Wait for Viktor to decide,
   based on your report, whether to:
   - (a) continue building on `loose-diamonds` and ignore the other pages,
   - (b) move the diamond-page-complete.html work onto the `diamonds`
     page instead, since it already has a real template, or
   - (c) something else, once we see what's actually in those files.

4. Once a direction is confirmed, apply diamond-page-complete.html
   (the CSS + dual-handle sliders + shape icons) to whichever page/template
   is the final decision, and wire it to the Nivoda Worker's
   `/api/diamonds` endpoint as previously instructed.

## Do not

- Don't delete or overwrite `diamonds`, `nivoda-detail`, or `feed`
  templates without explicit confirmation.
- Don't assume `loose-diamonds` is the right page just because that's
  where recent work happened — confirm first.
