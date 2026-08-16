---
name: shopify-file-uploads
description: How to get CDN URLs for bulk-uploaded Shopify files without paginating the Files API
metadata: 
  node_type: memory
  type: reference
  originSessionId: 93aa9589-172f-4741-98db-305298a3568b
  modified: 2026-07-30T15:40:08.662Z
---

Orloff's Shopify CDN base is `https://cdn.shopify.com/s/files/1/0852/4428/1122/files/` (store `orloffofdenmark.com`, **currency USD**, Basic plan, Thailand).

**Files in the Files API report URLs with a `?v=<timestamp>` cache-buster, but the bare URL without it resolves fine (HTTP 200).** So after a bulk upload you can construct every URL as `<base>/<filename>` instead of paginating `files(first:…)` — verified across 485 files, all 200. That turned ~49 paginated API calls into one `curl` sweep. Verify with a parallel HEAD sweep rather than assuming.

**Bulk uploading via the API does not scale here.** Each file needs its own `stagedUploadsCreate` ticket carrying ~2KB of signed policy, which has to pass through the model twice (once received, once written into the `curl -F` POST). The three-step flow works — `stagedUploadsCreate` → multipart POST → `fileCreate` — but for hundreds of files, drag-and-drop into Settings → Files is the right tool, then read the URLs back.

Beware: the MCP `graphql_query` tool caps page size via its own top-level `first` argument, not the GraphQL variable. Passing `first` only inside `variables` silently gives 10 rows per page.

See [[orloff-charm-line-pricing]] for the USD vs THB split between Shopify and StoreHub.
