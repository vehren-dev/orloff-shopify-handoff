# Orloff of Denmark — duplicate SKU audit

**Date:** 2026-08-04
**Source:** `https://orloffofdenmark.com/products.json` (all pages), 421 published products, 5,457 variant rows.
**Scope caveat:** the public products feed lists only products **published to the Online Store**. Draft, archived, and
sales-channel-only products are not covered. A full sweep needs the Admin API.

---

## Summary

| | |
|---|---|
| Variant rows scanned | 5,457 |
| Distinct duplicated SKUs | **5** |
| Variant rows affected | 12 |
| Blank SKUs | 8 |

Two independent clusters. The 999 fine silver one is bigger than reported; the ELEANOR one is
**mispricing live orders right now**.

---

## Cluster 1 — `S999-WAVES-1` on four products

Reported as two products. It is **four**. Every product in the 999 fine silver range carries the
same SKU.

| Product | Handle | Product ID | Variant ID | Price | Created |
|---|---|---|---|---|---|
| **WAVES** | `waves-999-fine-silver` | 10104714592546 | 51599197634850 | USD 480 | 2 May 18:14 |
| **FOLD** | `fold-999-fine-silver` | 10104794841378 | 51599299051810 | USD 300 | 2 May 23:28 |
| **LEDGE** | `ledge-999-fine-silver` | 10105403834658 | 51600251846946 | USD 350 | 3 May 12:09 |
| **MOUND** | `ledge-999-fine-silver-copy` | 10107305525538 | 51604591903010 | USD 350 | 5 May 11:07 |

**WAVES is the original.** It was created first and its SKU matches its own name. Each later ring
was duplicated from the one before it and the SKU was never touched — the creation timestamps run
in a clean chain, and MOUND's handle still records that it was cloned from LEDGE, not from FOLD.
So the "third original" suspected behind FOLD is WAVES.

All four are genuinely distinct designs by Viktor Paradorn Ehrenskjöld, each with its own copy and
its own photography. None is a stray duplicate to be deleted — each needs its own SKU.

### Convention

`S999-WAVES-1` is the only pattern in this range, and it exists nowhere else in the catalogue.
Read literally: `S999` (999 fine silver) + design name + `-1`. Applying it:

| Product | Current SKU | Correct SKU |
|---|---|---|
| WAVES | `S999-WAVES-1` | `S999-WAVES-1` — already correct, no change |
| FOLD | `S999-WAVES-1` | `S999-FOLD-1` |
| LEDGE | `S999-WAVES-1` | `S999-LEDGE-1` |
| MOUND | `S999-WAVES-1` | `S999-MOUND-1` |

All four are single-variant (`Default Title`); ring size is carried by the `has-size-selector` tag,
not by variants, so there is no variant-level suffix to preserve.

### Notes, not in scope

- MOUND's three images are unretouched generator output — `nano-banana-2026-05-05T06-08-05.jpg`,
  `image_2.png`, `image_1_02ba4e53-….png` — while WAVES, FOLD and LEDGE all use studio files
  (`W1.jpg`, `FOLD1.jpg`, `WDG1.jpg`). The clone was never finished.
- MOUND's handle `ledge-999-fine-silver-copy` is wrong on both counts: it says "ledge" and it says
  "copy". Changing it breaks the live URL and needs a redirect — held for a decision.

---

## Cluster 2 — ELEANOR platinum, four duplicated SKUs, **charging the wrong price today**

Not in the original brief. Found by the sweep. This one is urgent.

The ELEANOR convention is `{METAL}-ELEANOR-{P|S}-{CARAT}-{LG|NAT}`, where `P` = Prestige (VS1/F)
and `S` = Signature (SI1/H). Every metal carries a full P and S set — **except platinum at 0.50 ct
and 1.00 ct, where the Signature variants were given the Prestige SKU.**

| Product | SKU (wrong) | Variant it is on | Price | Should be |
|---|---|---|---|---|
| `eleanor-lab-grown` | `PT-ELEANOR-P-050-LG` | Signature SI1/H 0.50 ct | 2,600 | `PT-ELEANOR-S-050-LG` |
| `eleanor-lab-grown` | `PT-ELEANOR-P-100-LG` | Signature SI1/H 1.00 ct | 3,730 | `PT-ELEANOR-S-100-LG` |
| `eleanor-natural` | `PT-ELEANOR-P-050-NAT` | Signature SI1/H 0.50 ct | 4,760 | `PT-ELEANOR-S-050-NAT` |
| `eleanor-natural` | `PT-ELEANOR-P-100-NAT` | Signature SI1/H 1.00 ct | 9,170 | `PT-ELEANOR-S-100-NAT` |

The Prestige variants themselves are correctly named — it is only the Signature side that is wrong.
A P/S balance check across every metal and every ring family in the catalogue returns **ELEANOR as
the only mismatch**, so the fault is isolated to these four.

### Why this is live money

ELEANOR is a configurator PDP. Per `orloff-configurator-variant-resolution`, the page builds
`ORLOFF_VARIANT_MAP[sku] = id` from the live variants. With the SKU duplicated, the key is assigned
twice and **the last write wins** — confirmed in the live page source:

```
ORLOFF_VARIANT_MAP['PT-ELEANOR-P-050-LG'] = 51804062548258   // Prestige VS1/F, 2740
ORLOFF_VARIANT_MAP['PT-ELEANOR-P-100-LG'] = 51804062581026   // Prestige VS1/F, 4190
ORLOFF_VARIANT_MAP['PT-ELEANOR-P-050-LG'] = 51804062646562   // Signature SI1/H, 2600  <- wins
ORLOFF_VARIANT_MAP['PT-ELEANOR-P-100-LG'] = 51804062679330   // Signature SI1/H, 3730  <- wins
```

`PT-ELEANOR-S-050-LG` and `PT-ELEANOR-S-100-LG` appear **nowhere** in the page. Same collision on
`eleanor-natural`.

So a customer configuring **Platinum / Prestige VS1/F** at 0.50 or 1.00 ct is added to cart against
the **Signature SI1/H** variant. They are undercharged, and — worse — the order is picked as a
lower diamond grade than they configured, while their line-item properties still read Prestige.

| Configured | Charged | Loss per order | Diamond actually picked |
|---|---|---|---|
| PT Prestige 0.50 LG — 2,740 | 2,600 | **140** | SI1/H instead of VS1/F |
| PT Prestige 1.00 LG — 4,190 | 3,730 | **460** | SI1/H instead of VS1/F |
| PT Prestige 0.50 NAT — 5,160 | 4,760 | **400** | SI1/H instead of VS1/F |
| PT Prestige 1.00 NAT — 11,450 | 9,170 | **2,280** | SI1/H instead of VS1/F |

This is the same silent-mischarge failure mode found on 2026-08-04, in a spot the earlier fix did
not reach.

### Fixing it needs two writes, not one

Renaming the four variant SKUs is only half. `combo_data` is maintained separately and drives the
lookup — if the variant SKUs move to `-S-` and `combo_data` still says `-P-`, the Signature
configuration stops resolving entirely and `addToCart` falls back to the first variant in the map,
which is the current bug in a louder form. **Change the variant SKUs and `combo_data` together, then
verify on the live PDP** that `document.getElementById('rc-add-to-cart').dataset.variantId` is
non-empty and resolves to the right variant for each of the eight platinum P/S configurations.

---

## Blank SKUs — 8 variants

Not duplicates, but they break the same downstream systems.

| Product | Handle | Variants |
|---|---|---|
| **test** | `test` | 1 — a USD 1.00 test product, **live and published** |
| EMERALD CROWN | `emerald-crown` | 1 — USD 2,500 |
| Round Moissanite 6-Prong Ring - 925 Silver | `round-moissanite-6-prong-ring-925-silver` | 6 |

The `test` product being published to the storefront is worth a look on its own.

---

## Recommended order

1. **ELEANOR platinum** — first. It is costing money on every platinum Prestige order.
   Variant SKUs + `combo_data` + live verification, as one coordinated change.
2. **999 fine silver** — FOLD, LEDGE, MOUND. Three variant SKU edits, no configurator involved,
   no dependencies.
3. **MOUND handle** — needs a 301 from `/products/ledge-999-fine-silver-copy`. Decision pending.
4. **Blank SKUs** and the published `test` product — separate cleanup.

---

# APPLIED — 2026-08-04

All duplicate SKUs are resolved. **Store-wide re-sweep: 0 duplicate SKUs across 5,457 variants.**
No prices, titles, descriptions, images or handles were touched.

## ELEANOR platinum — done first, as the live-money fix

`combo_data` turned out to carry the **same error independently**: the Platinum/Signature entries at
0.5 and 1.0 ct also pointed at the `-P-` SKU, on both products. So the fix was two-sided, and
renaming only the variants would have left the configurator worse, not better.

**Variant SKUs** (4):

| Variant ID | Was | Now |
|---|---|---|
| 51804062646562 | `PT-ELEANOR-P-050-LG` | `PT-ELEANOR-S-050-LG` |
| 51804062679330 | `PT-ELEANOR-P-100-LG` | `PT-ELEANOR-S-100-LG` |
| 51804074541346 | `PT-ELEANOR-P-050-NAT` | `PT-ELEANOR-S-050-NAT` |
| 51804074574114 | `PT-ELEANOR-P-100-NAT` | `PT-ELEANOR-S-100-NAT` |

**`combo_data`** (metafields 54210593456418 and 54210544042274, updated in place — same IDs, no new
metafields): `Platinum|Signature - SI1/H|0.5` → `PT-ELEANOR-S-050` and
`Platinum|Signature - SI1/H|1` → `PT-ELEANOR-S-100`, in both the `natural` and `lab` branches of
each. **Every price left exactly as it was.**

Variants were written **before** `combo_data` deliberately. The reverse order would have left a
window where Signature lookups missed entirely and `addToCart` fell back to the first variant in the
map — the arbitrary-variant failure mode, far worse than the brief overcharge the chosen order risks.

## 999 fine silver — done second

| Product | Variant ID | Was | Now |
|---|---|---|---|
| FOLD | 51599299051810 | `S999-WAVES-1` | `S999-FOLD-1` |
| LEDGE | 51600251846946 | `S999-WAVES-1` | `S999-LEDGE-1` |
| MOUND | 51604591903010 | `S999-WAVES-1` | `S999-MOUND-1` |
| WAVES | 51599197634850 | `S999-WAVES-1` | unchanged — it was already correct |

## Verification

- **Pre-write:** the proposed `combo_data` was validated against the live variant list — all 42
  entries resolve to a real variant at a matching price in both lab and natural, and all 42 live
  variants are referenced. Bidirectional, so neither a typo nor an omission could pass.
- **Post-write:** full store re-sweep, 421 products / 5,457 variants → **0 duplicate SKUs**.
- **Live configurator**, both PDPs, in a real browser: 42 combinations → **42 distinct variant ids,
  0 unresolved, 0 collisions**. `rc-add-to-cart` carries a non-empty variant id on both.
  Platinum now resolves as: Prestige 0.5 → 2,740 and Signature 0.5 → 2,600 (lab);
  Prestige 1.0 → 11,450 and Signature 1.0 → 9,170 (natural). Each to its own variant.

> **Verification gotcha.** Shopify serves PDPs from a server-side page cache. After the write,
> `Invoke-WebRequest` kept returning byte-identical pre-change HTML with the old variant map — it
> reads exactly like the fix failed. `products.json` and the Admin API update immediately; the
> browser showed the correct fresh state. A `?cb=…` cache-buster does not help, the edge rejects
> unknown query params on product URLs. Verify in the browser.

## Still open

- **MOUND handle** `ledge-999-fine-silver-copy` — left alone, no preference given. Needs a 301 from
  the old URL when it is changed.
- **MOUND's placeholder images** — still unretouched generator output.
- **8 blank SKUs**, including the published USD 1.00 `test` product.
- **`E:\__writeprobe.txt`** — a leftover write-permission probe of mine. Deleting it was blocked at
  my end; safe to remove.
