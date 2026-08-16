# Charm Line A — Phase 1 Inventory Report

Generated 29 Jul 2026. Source: `E:\HD PICTURE` (the only charm image location on the drive).

**Headline: the job cannot proceed to Phase 2 as scoped.** Images exist for 99 of 315 Appendix A SKUs (31%). The entire ORCB bead-charm series, which is the bulk of the line, has no photography at all. Separately, almost nothing in the folder meets the resolution bar the handoff sets.

Two Phase 1 assumptions in the handoff are wrong and are corrected below: the folder is not flat, and it is not the full 554-SKU catalogue.

---

## 1. Structure — the handoff's model is wrong

The handoff assumes a flat folder of files named `ORCB183-A.jpg`, making the mapping "an identity match." It is not that.

`HD PICTURE` is a **folder-per-model tree**, and it has **two tiers**:

| Tier | Path | Model folders |
|---|---|---|
| 1 | `HD PICTURE/<MODEL>/` | 63 |
| 2 | `HD PICTURE/Orloff customized design/<MODEL>/` | 36 |

**99 model folders total, 921 image files** (plus 2 `.mp4`, excluded).

Tier 2 is not a stray folder. It holds the entire ORGCB05–GCB50 dangle series (invoice rows 390–423) plus `CBB01`. It was invisible to a top-level listing, and anything working from the handoff's flat-folder premise would have missed 36 of the 99 covered models.

Inside each folder, filenames are inconsistent: model-named files (`GCB108-1.jpg`), bare camera originals (`IMG_9376.jpg`), and bare numerals (`1.jpg`, `222.jpg`). **Primary-image selection cannot be automated from filenames.** There is no reliable convention marking which file is the hero shot. Two files also carry Chinese-language suffixes (`PA0097-2 拷贝.jpg` = "copy", `01---副本.jpg` = "copy").

---

## 2. Coverage against Appendix A

Appendix A lists **316 entries / 315 unique model numbers**. The one-entry gap is the `ORCB176` duplicate, quantified in §4.

| | SKUs | Status |
|---|---|---|
| **Covered by an image folder** | **99** | 31% |
| **No image at all** | **216** | 69% |

### Missing, by group

| Group | Missing | Of |
|---|---|---|
| ORCB figural/decorative (A2 + A3) | **164** | 165 |
| ORCB183 letters (A4) | **26** | 26 — all |
| ORCB32 zodiac (A5) | **12** | 12 — all |
| ORCB33 birthstone (A6) | **12** | 12 — all |
| ORGCB dangles (A8) | 2 | 72 |
| **Total** | **216** | |

The only ORCB bead charm with any photography is **ORCB214**. Every other one of the 165 figural charms, all 26 letters, all 12 zodiac and all 12 birthstone charms have nothing.

Coverage is essentially inverted from what the handoff anticipated: the ORGCB dangles are 97% covered (70/72), the ORCB beads are 0.6% covered (1/165).

The 2 missing dangles are **ORGCB56-L** and **ORGCB56-R**. Only `GCB56-B` exists.

Full missing list is in §7.

---

## 3. Resolution — this is the second blocker

The handoff asks for ≥2048px on the long edge for Shopify zoom, and flags anything under 1200px. Measured across all 921 files:

| Long edge | Files | Share |
|---|---|---|
| ≥2048px (meets spec) | **6** | 0.7% |
| 1200–2047px | 24 | 2.6% |
| **under 1200px (flagged)** | **891** | **96.7%** |

Dominant sizes: **630 files at 1001×1001**, 152 at 970×600, 47 at 800×800.

Per model folder, taking each folder's best available file:

| Best image in folder | Folders |
|---|---|
| ≥2048px | **6** |
| 1200–2047px | 21 |
| under 1200px | **72** |

The only six models with a spec-compliant image are `GCB21-18K` (3457px), `GCB26-18K` (3259), `GCB28-18K` (3259), `GCB29-18K` (3150), `GCB30-18K` (3063), `GCB25` (2119).

**The folder named "HD PICTURE" does not contain HD pictures.** 1001×1001 is a web-export size, not a master. If original captures exist at full resolution, they are not on this drive. All 12 spacer folders and ORCB214 top out at 800×800.

I checked `3) WEBSITE IMAGES` (including `NEW PRODUCTS`, `CATEGORY`, `OTHERS`) and swept the whole drive for model-numbered image files. No other charm photography exists.

---

## 4. A10 collision checklist — results

The handoff's five checklist items, resolved against actual files:

| # | Question | Finding |
|---|---|---|
| 1 | `ORCB176` — two products, one filename | **Moot for now. No ORCB176 image exists in either form.** The collision is real in the data but cannot break an upload that has no file. `GCB176` exists but is a different product (a dangle, and not in Appendix A — see §5). **Still needs your decision before the ORCB photography is shot**, or it will recur. |
| 2 | `ORPA034` vs `ORPA0034` | **Resolved: images use `PA0034`, four digits.** Appendix A and the invoice carry the typo, not the folder. Recommend SKU `ORPA0034`, but flagging rather than normalising per instruction. |
| 3 | `ORCB32-Agr` vs `ORCB32-Aqr` | **Cannot resolve. No ORCB32 images exist in any form.** All 12 zodiac charms are unphotographed. |
| 4 | `GCB56-R` vs `ORGCB56-R` | **Neither exists.** The handoff predicted `GCB56-R.jpg` would be present. It is not, and neither is `GCB56-L`. Only `GCB56-B` has a folder. |
| 5 | `ORGCB50P` vs `ORGCB50-P` | **Resolved: folder is `GCB50`, with no suffix at all.** Neither candidate form. Sits in tier 2. |
| 6 | Confirm no out-of-scope images | **Not confirmed — 9 out-of-scope folders present.** See §5. The folder is nowhere near the full 554-SKU catalogue, so the handoff's contamination worry is small, but it is not zero. |

### Folder names that lie about their contents

`GCB39` through `GCB49` are named as dangle charms but **contain ORPA spacer files**:

| Folder | Actual files |
|---|---|
| GCB39 | PA0010 |
| GCB40 | **PA0034** |
| GCB41 | PA0035 |
| GCB42 | PA0094 |
| GCB43 | PA0097 |
| GCB44 | PA0123 |
| GCB45 | PA0132 |
| GCB46 | PA0142 |
| GCB47 | PA0147 |
| GCB48 | PA0149 |
| GCB49 | PA0107 |

This covers all 11 A7 spacers. **Trusting the folder name would have uploaded 11 spacer images under dangle-charm SKUs.** I have mapped these by file contents, not folder name. Note `GCB49` → `PA0107` breaks the otherwise sequential run, matching the invoice's own out-of-order row 442.

### Suffix mismatches, folder vs Appendix A

Seven tier-2 folders drop the finish suffix the SKU carries. Each maps to exactly one Appendix A SKU, so there is no ambiguity, but the normalisation rule in Appendix A does not catch them:

`GCB05`→ORGCB05-P-18, `GCB06`→ORGCB06-P, `GCB09`→ORGCB09-P, `GCB10`→ORGCB10-P, `GCB11`→ORGCB11-18K, `GCB12`→ORGCB12-18K, `GCB50`→ORGCB50P

### Bracelet folders have no size axis

`CBB01` is **one folder for three SKUs** (17/19/21cm). `ORGCBB1-B/G/K/R/W` are **five folders for fourteen SKUs** — colour only, no size.

For ORGCBB1 this is fine and actually confirms the A9 variant architecture: colour is the real image axis, so 5 images serve 14 variants. For `ORCBB01` the three sizes will share one image set unless you want them shot separately.

Consistent with the A9 note, there is no `ORGCBB1-21-G` folder. Nothing fabricated.

---

## 5. Images with no Appendix A entry

Nine folders hold products not in Appendix A. Six are clearly out of scope (earrings, necklaces, bangles) and should simply be excluded:

`GSB114`, `GSN305`, `ORGSN178`, `ORSWE18`, `ORSWN09-B`, `GSB106-P`

**Three need your decision — they look like Line A pieces omitted from Appendix A:**

| Folder | Why it's suspicious |
|---|---|
| `GCB108` | Appendix A has ORGCB109 and ORGCB110 but not 108. Direct sibling, 13 files. |
| `GCB176` | Appendix A has ORGCB175 and ORGCB177 but not 176. Direct sibling, 10 files. |
| `GCB178` | Appendix A has ORGCB177 and ORGCB181 but not 178. 14 files. |

All three sit in the tier-1 dangle group alongside in-scope siblings and are photographed to the same standard. Per the handoff's precedence rule I have not added them. **They are either genuine Appendix A omissions or unordered samples — please confirm which.**

Also note: `GCB176` sharing a numeral with the contested `ORCB176` is coincidence. Different series, different product.

---

## 6. Two contradictions inside the handoff itself

Flagging rather than resolving, per the rules of engagement.

**a) SKU total.** Three figures disagree:

- Membership table (line 66): "**316 SKUs** (299 charms, 17 bracelet bases)"
- Appendix A header (line 296): "**230 SKUs total: 227 charms, 3 bracelet bases**"
- Appendix A sections A1–A9, counted: **316 entries, 315 unique**

Since Appendix A governs scope and its own sections sum to 316, I have worked to **315 unique model numbers**. The "230" line appears to predate the decision to fold ORGCB into Line A: 315 minus the 72 ORGCB dangles minus the 14 ORGCBB1 bases is 229, within rounding of 230. The line is stale and should be deleted.

**b) ORGCB scope.** Line 70 states: "Excluded from this job: all ORGCB and ORGCBB1 (Line B)." This directly contradicts the Context section ("one line, not two", ORGCB explicitly in scope) and Appendix A sections A8 and A9, which list them. Line 70 is a leftover from the two-line model. I treated ORGCB and ORGCBB1 as **in scope**.

This matters more than it looks: ORGCB is 86 of the 99 SKUs that actually have images. Reading line 70 literally would have left the job with 13 usable SKUs.

---

## 7. Complete missing-image list (216)

**ORCB figural and decorative (164):**
ORCB01–ORCB18, ORCB20–ORCB23, ORCB25–ORCB30, ORCB34–ORCB56, ORCB58–ORCB67, ORCB70, ORCB71, ORCB73, ORCB74, ORCB76–ORCB86, ORCB88, ORCB89, ORCB100–ORCB104, ORCB106–ORCB108, ORCB110, ORCB111, ORCB113–ORCB120, ORCB122–ORCB129, ORCB135–ORCB140, ORCB142, ORCB144, ORCB145, ORCB146, ORCB149–ORCB157, ORCB159–ORCB166, ORCB168–ORCB171, ORCB173–ORCB177, ORCB179, ORCB180, ORCB182, ORCB199–ORCB206, ORCB208–ORCB213, ORCB215–ORCB221

*(the full sequence excluding ORCB214, the sole covered bead charm; gaps listed at handoff line 324 are expected and not counted as missing)*

**ORCB183 letters (26):** ORCB183-A through ORCB183-Z, all of them

**ORCB32 zodiac (12):** Ari, Tau, Gem, Cnc, Leo, Vir, Lib, Sco, Sgr, Cap, Agr, Psc

**ORCB33 birthstone (12):** R, P, Q, W, LV, PL, M, G, BL, F, X, L

**ORGCB dangles (2):** ORGCB56-L, ORGCB56-R

---

## 8. Where this leaves Phase 2

Phase 2 as written cannot run. Two independent blockers:

**Blocker 1 — 216 SKUs have no image.** Not a data-cleanup problem. This is a photography job covering the entire ORCB bead line, all letters, all zodiac, all birthstone.

**Blocker 2 — resolution.** Even for the 99 covered SKUs, 72 have nothing above 1200px. Uploading 1001×1001 files disables Shopify's zoom and will look poor against the existing fine-jewelry catalogue.

### Decisions needed from you

1. **Do full-resolution masters exist anywhere off this drive** — with Ivy, with the factory, on another disk? If the 1001×1001 files are downsampled exports, the originals would clear Blocker 2 immediately. This is the single highest-value question.
2. **Is the ORCB series photographed at all?** If not, that is the critical path for the whole line.
3. **`GCB108`, `GCB176`, `GCB178`** — in scope or not?
4. **`ORCB176` duplicate** — `ORCB176-A` / `ORCB176-B`, or something else? Needed before photography, not after.
5. **`ORPA034` vs `ORPA0034`** — images say `PA0034`. Confirm the SKU form.
6. **Handoff corrections** — confirm 315 unique SKUs, and confirm line 70 is stale.
7. **`ORCBB01` sizes** — one shared image set across 17/19/21cm, or shoot separately?

### What could proceed now

If you want movement while photography is sorted, the **86 ORGCB dangles + 14 ORGCBB1 bases** are image-complete apart from ORGCB56-L/R. That subset could go through Phases 2–4 as a first tranche, accepting current resolution, with the ORCB line following. Your call — the handoff says stop at the gate, so I have.

Nothing has been uploaded, renamed, or written to Shopify.
