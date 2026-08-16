---
name: charm-line-image-folder-structure
description: E:\HD PICTURE layout gotchas and the Phase 1 blockers for the Orloff charm line build
metadata: 
  node_type: memory
  type: project
  originSessionId: 93aa9589-172f-4741-98db-305298a3568b
  modified: 2026-07-29T15:40:56.832Z
---

`E:\HD PICTURE` is a two-tier **folder-per-model** tree, not a flat file list. Tier 1 is `HD PICTURE/<MODEL>/` (63 folders); tier 2 is `HD PICTURE/Orloff customized design/<MODEL>/` (36 folders) and holds the whole ORGCB05–GCB50 dangle series plus CBB01. 99 model folders, 921 images.

Three traps:
- Folders `GCB39`–`GCB49` are **misnamed**; they contain the ORPA spacer files (GCB40 holds PA0034, etc.). Map by file contents, never by folder name.
- Despite the name, it is not HD: 630 files are 1001x1001 and only 6 of 921 clear 2048px.
- Files inside a folder mix model-named, `IMG_*` camera originals, and bare numerals, so the primary/hero image cannot be picked automatically.

Phase 1 of the charm line build (29 Jul 2026) found images for only 99 of 315 Appendix A SKUs. The entire ORCB bead series, all 26 letters, all 12 zodiac and all 12 birthstone charms are unphotographed. Full detail in `E:\charm-line-inventory-report.md`; the source brief is `E:\claude-code-charm-line-handoff.md`, which contains two stale self-contradictions (a "230 SKUs" total and a line excluding ORGCB from scope) that the report documents.

Note: the Write tool cannot create files directly at `E:\` root (EPERM on mkdir) — write to the scratchpad and copy across with Bash.
