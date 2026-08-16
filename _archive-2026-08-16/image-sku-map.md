# HD PICTURE to invoice SKU mapping

You were right that this is annoying, and it is worse than the ORPA0107 case
suggested. Three separate things disagree with each other: folder names, file
names, and which images are actually unique to a product.

Matched against all 554 invoice model numbers, not just Appendix A.

**Outputs**

- `image_sku_map.csv` — every folder, the SKU it resolves to, how it was resolved
- `image_rename_plan.csv` — every file, its target filename, and whether it is safe to upload

---

## Result

| | |
|---|---|
| Folders resolved to a SKU | **101** |
| Unique SKUs covered | **99** of 315 |
| Appendix A SKUs with no image | **216** |
| Folders whose label is wrong | **18** |
| Folders unresolved | 10, all explained below |

Two SKUs live in two folders each: **ORGCB22-P** and **ORGCB30-P** appear in
both the top level and under `Orloff customized design`. You need to pick which
set to use.

---

## Rule applied: the file beats the folder

Your ORPA0107 example is the pattern for the whole ORPA series. Folder `GCB49`
contains `PA0107.jpg`. The folder label is simply wrong, and the file is right.

All eleven spacers and clips are affected:

| Folder | Actually contains | SKU |
|---|---|---|
| GCB39 | PA0010 | ORPA0010 |
| GCB40 | PA0034 | **ORPA034** |
| GCB41 | PA0035 | ORPA0035 |
| GCB42 | PA0094 | ORPA0094 |
| GCB43 | PA0097 | ORPA0097 |
| GCB44 | PA0123 | ORPA0123 |
| GCB45 | PA0132 | ORPA0132 |
| GCB46 | PA0142 | ORPA0142 |
| GCB47 | PA0147 | ORPA0147 |
| GCB48 | PA0149 | ORPA0149 |
| GCB49 | PA0107 | ORPA0107 |

Note `GCB40`: the file says `PA0034`, the invoice says `ORPA034` with three
digits. I matched them by collapsing zero padding. The SKU is written in the
invoice's form. This is the discrepancy flagged in Phase 1, now confirmed from
both sides at once.

A further seven folders drop the finish suffix the SKU carries:

`GCB05` to ORGCB05-P-18, `GCB06` to ORGCB06-P, `GCB09` to ORGCB09-P,
`GCB10` to ORGCB10-P, `GCB11` to ORGCB11-18K, `GCB12` to ORGCB12-18K,
`GCB50` to ORGCB50P

These resolve by prefix and are unambiguous, but note `GCB10` is also a prefix
of `GCB109`. The match only works because the remainder is required not to
start with a digit.

---

## The bigger problem: images shared between different SKUs

**191 files in the tree are byte-identical copies of another file.** In several
places the same photograph sits in folders for different products.

The worst case is the engraved quote tags. Every `GCB182-*` folder contains the
same eight files, and they overlap with `GCB184-*` as well. Each of those SKUs
carries a *different* engraved quote, so a shared photograph cannot be showing
the right one.

Each folder does still hold some images of its own. For the quote tags it is
5 exclusive out of 16.

Also sharing images: `GCB51-P / -WY / -YL / -YP / -YR` (five colour variants,
which by definition must look different) and `GCB46 / GCB47`.

### This breaks filename-based primary selection

There is no filename convention that identifies the good image. The signal
points opposite ways in different folders:

| Folder | Exclusive to that SKU | Shared with other SKUs |
|---|---|---|
| GCB182-1 | `IMG_9512.jpg`, `IMG_95431.jpg` | `05.jpg`, `16-S.jpg`, `5-S.jpg` |
| GCB22-P | `1.jpg`, `2.jpg`, `3.jpg` | `IMG_0060.jpg`, `IMG_2103.jpg` |

In the quote folders the tidy numbered files are the generic ones and the
camera originals are the real product shots. In GCB22-P it is reversed.

So the rename plan ranks by **hash exclusivity**, not by filename. That is the
only thing that separates them reliably.

---

## Also worth knowing: the -R suffix

Files ending `-R` are **always 970x600**, a landscape crop. Files ending `-S`
and bare-numbered files are **always 1001x1001**, square.

`-R` files are banner crops, not product heroes. There are 82 of them in scope.
They should not be a primary image, and probably should not be uploaded at all
as product photos.

---

## Rename plan

`image_rename_plan.csv` gives every file a target name and a rank:

The plan is grouped by **SKU**, not by folder, and deduplicated by hash.

| Rank | Meaning | Files |
|---|---|---|
| 1 | unique to this SKU, square. **Use these.** | 608 |
| 2 | unique, but a landscape crop | 28 |
| 3 | also used by a different SKU, square. **Do not upload.** | 151 |
| 4 | also used by a different SKU, landscape. **Do not upload.** | 54 |

**All 99 SKUs have at least one rank 1 image**, so every covered SKU gets a
legitimate primary. 205 files are rank 3 or 4 and would put the same picture on
two genuinely different products.

Sharing across the sizes of one bracelet is not counted as a problem. CBB01 was
shot once for 17, 19 and 21cm, and each ORGCBB1 colour folder covers all three
lengths. That is expected and is marked as such rather than flagged.

25 SKUs still carry at least one genuinely shared image: the 18 quote tags, the
5 ORGCB51 colour variants, and ORPA0142 / ORPA0147.

Example, the dragonfly:

```
ORPA0107  GCB49  1  PA0107.jpg    -> ORPA0107.jpg     exclusive, square
ORPA0107  GCB49  2  PA0107-2.jpg  -> ORPA0107-2.jpg   exclusive, square
ORPA0107  GCB49  3  PA0107-3.jpg  -> ORPA0107-3.jpg   exclusive, square
```

---

## Unresolved folders (10)

None of these are a problem for Line A:

| Folder | Why |
|---|---|
| GCB108, GCB176, GCB178 | Absent from all 554 invoice rows. Photographed but never ordered. |
| GCB182-1/GCB182, GCB184-1/GCB184 | Sub-subfolders. Which one of the series is not stated. |
| ORGSN178, ORSWE18, ORSWN09-B, GSB106-P | Out of scope, necklaces and earrings |
| Orloff customized design (root) | One stray file, `Bag aronud charms.jpg` |

Two more contain several out-of-scope SKUs each: `GSB114` (bangles) and
`GSN305` (ceramic necklaces).

One oddity: `ORGSN178` contains `GCB178.jpg` and `GCB178-1.jpg`, which belong
to a charm, not a necklace. Cross-contamination between folders.

---

## What I need from you

1. **ORGCB22-P and ORGCB30-P** appear in two folders each, top level and under
   `Orloff customized design`. Most of the contents are byte-identical copies,
   but each folder also holds shots the other does not, and both contain a
   *different* image called `1.jpg`. The plan now merges the two folders per
   SKU and dedupes, so nothing is lost and nothing overwrites, but you should
   confirm both sets are the same physical product and not, say, a re-plate.
2. **The quote tags.** Confirm the 5 exclusive images per folder really show
   that quote. If the photographer shot one tag and reused the rest, all 18
   need reshooting. This is the one I would check first.
3. **GCB51 colour variants** share images across five colours. Same question.
4. Confirm `-R` landscape crops should be excluded from product uploads.

Nothing has been renamed, moved or uploaded.
