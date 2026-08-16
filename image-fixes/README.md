# Charm image fixes, 1 Aug 2026

Open **`review.html`** in a browser first. It shows every image grouped by folder.
Verify the sorting before running anything — if something is in the wrong folder,
move the file on disk and it is fixed.

## Folders

| Folder | Files | Prompt | What it is |
|---|---|---|---|
| `1-logo` | 77 | 1 | ORLOFF crest burned into the top-left corner |
| `2-pink-surface` | 2 | 2 | Strongly pink background surface |
| `3-pink-ribbon` | 64 | 3 | Pale surface with a pink ribbon arc behind the piece |
| `4-bad-ratio` | 204 | 4 | Not square. Ratios from 1.01 up to 1.96 |
| `5-model-lifestyle` | 31 | — | On-model shots. **Not one of your four. Read the note below.** |

384 distinct files need at least one fix. Some appear in two folders — a file can
carry the crest *and* be the wrong shape. Order matters: **run prompt 1 first**,
then the background prompts, and **prompt 4 last**, because outpainting a square
should happen after the background is its final colour.

## How detection worked, and how far to trust it

**Logo — trust it.** Detected by sampling the crest region at full resolution and
counting navy and gold pixels. Calibrated against the 16 known watermarked files
(they score navy 153-160, gold 33-42) and the 12 already-cleaned ones (0, 0).
Clean separation, no ambiguity. The count of 77 matches the 78 recorded on 31 Jul.

**Ratio — trust it completely.** Pure arithmetic on width and height.

**Pink and model — check these.** Judged from the colour of the outer border ring
of each image. Border sampling was necessary because measuring the whole frame
made every charm with a pink stone look like a pink background, and every rose
gold plated charm look like skin. The split between `2-pink-surface` and
`3-pink-ribbon` is a threshold on how much of the border is pink, which is a
guess at your intent — the two in `2-pink-surface` may belong in `3`.

## The fifth folder, which you did not ask for

`5-model-lifestyle` holds 31 photographs of a person wearing the jewellery. They
surfaced because skin reads as pink to a colour detector, and they are worth your
attention for two reasons:

1. **The pink in them is clothing, not a background.** Recolouring a model's
   blouse to #a3b8db is a different instruction from recolouring a backdrop, and
   probably not what you want at all. Do not run prompt 2 on these.
2. **Several are necklace shots, not bracelet shots.** `ORGCB185-14K-3`,
   `ORGCB181-4` and `ORGCB175-4` show the piece hanging from a chain as a pendant.
   If those SKUs are being sold as bracelet charms, the photography contradicts
   the product.

Most of them also carry the crest, so they already appear in `1-logo`.

---

# The four prompts

Paste the image, then the prompt. Every prompt leads with a preservation clause
because ChatGPT regenerates rather than edits, and its failure mode is quietly
redrawing the jewellery — changing stone counts, engraving or the bail. Compare
each result against the original before accepting it.

---

## Prompt 1 — remove the crest

```
Edit this product photograph. Remove ONLY the ORLOFF OF DENMARK logo watermark
(a navy and gold heraldic crest) from the upper-left corner of the image.

Reconstruct whatever was behind the watermark so it matches the surrounding area
seamlessly — continue the existing background texture, gradient, lighting and
shadow exactly as they appear around it.

CRITICAL — do not alter anything else:
- Do not redraw, move, resize, rotate or restyle the jewellery in any way
- Preserve every stone, engraving, enamel colour, surface reflection and the bail
  exactly as they are
- Do not change the background colour, lighting, shadows or reflections
- Do not sharpen, denoise, recolour or restyle the photograph
- Do not add any text, logo, watermark or border

Output the full image at its original framing and aspect ratio, 1024x1024.
```

## Prompt 2 — pink surface to #a3b8db

```
Edit this product photograph. Change ONLY the background colour: the pink surface
the jewellery is resting on must become the solid colour #a3b8db (a muted
blue-grey). Replace the pink across the entire background, including any pink
seen in the soft out-of-focus areas.

Keep the existing lighting direction, softness, depth of field and the shadow the
piece casts — the new colour should read as the same photograph shot on a
blue-grey surface, not as a flat colour fill.

CRITICAL — do not alter anything else:
- Do not redraw, move, resize or restyle the jewellery or the bracelet chain
- Preserve every stone, engraving, letter form, enamel detail and metal reflection
  exactly as they are
- Do not change the framing, crop, camera angle or focus
- Do not add any text, logo, watermark, prop or border

Output at 1024x1024.
```

## Prompt 3 — ribbon to #091b36, surface to #a3b8db

```
Edit this product photograph. Make exactly two colour changes:

1. The pink ribbon becomes deep navy #091b36. Keep the ribbon's exact shape,
   folds, curl, edges and the way it sits behind the jewellery. Keep its satin
   sheen — the highlights along the folds should stay visible as lighter navy,
   not flatten out.
2. The remaining pink background surface becomes muted blue-grey #a3b8db.

Keep the existing lighting, depth of field and the shadows the ribbon and
jewellery cast.

CRITICAL — do not alter anything else:
- Do not redraw, move, resize or restyle the jewellery
- Preserve every stone, engraving, enamel detail and metal reflection exactly
- Do not change the ribbon's shape, position or how it drapes — only its colour
- Do not change framing, crop or camera angle
- Do not add any text, logo, watermark or border

Output at 1024x1024.
```

Note: in this shoot the ribbon is often soft and out of focus behind the piece,
and the surface picks up pink reflections. Tell the model to change the
reflections too if it leaves pink glow on the silver.

## Prompt 4 — outpaint to 1:1

```
Extend this product photograph to a perfect 1:1 square, 1024x1024.

Do this by OUTPAINTING — generate additional background on the short sides to
fill out the square. Do not crop, do not zoom, and do not stretch or squash the
image. Every part of the original photograph, and the whole of the jewellery
piece, must remain fully visible.

The generated background must continue the existing background seamlessly:
match its colour, gradient, texture, vignetting and lighting falloff exactly, so
the join is invisible.

Keep the jewellery centred in the new square frame.

CRITICAL:
- Do not redraw, move, resize or restyle the jewellery in any way
- Preserve every stone, engraving, enamel detail and metal reflection exactly
- Do not change the existing lighting or the shadow the piece casts
- Do not add any text, logo, watermark, prop or border

Output at 1024x1024.
```

Of the 204: 57 are within 5% of square already (a light touch), 31 are 1.05-1.20,
52 are 1.20-1.50, and 64 are 1.50 or worse where roughly 40% of the square is
invented. On plain white this is near-foolproof. On the wide `ORGCB184` and
`ORGCB186` dangle shots at about 1300x730, check each one individually.

## After the edits

Keep the original filenames. Put the finished files in a single folder and I can
match them back to products by name and swap them in through the API, the same
way the 12 de-watermarked images were handled on 31 Jul.

Do not re-import `shopify-charm-line-a.csv` after this — it points at the old
image URLs and would undo the swap.
