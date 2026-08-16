# MICRO Eternity Band fix — SUPERSEDED

**This file is obsolete. See `orloff-status-2026-07-26.md` on this drive.**

The old plan here ("manual paste into WEB 10", live theme still broken) is wrong:
- WEB 11 was published and is now live; WEB 10 is irrelevant.
- The hardcoded variant id was NOT the real bug. The micro add-to-cart resolves
  every band by SKU via `window.ORLOFF_VARIANT_MAP` and ignores the button's
  data-variant-id entirely.
- Deleting the Gemstone option (done 2026-07-25) broke 6 of 7 gemstones. Fixed
  in WEB 12 via a single-variant fallback, verified with a real cart round-trip.
- A second, unrelated bug — band slots had no click handler, so a band's stone
  could never be changed — is also fixed in WEB 12.

**Still required: publish WEB 12.**