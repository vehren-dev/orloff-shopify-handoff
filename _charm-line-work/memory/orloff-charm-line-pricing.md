---
name: orloff-charm-line-pricing
description: Approved retail price tiers for the Orloff charm line and the reasoning behind them
metadata: 
  node_type: memory
  type: project
  originSessionId: 93aa9589-172f-4741-98db-305298a3568b
  modified: 2026-07-30T10:35:03.191Z
---

Approved by Viktor 30 Jul 2026. Charms are banded on **invoice unit cost**, not per item:

| Tier | Cost band (USD) | Price THB |
|---|---|---|
| Classic | under $4.50 | 900 |
| Signature | $4.50 to $6.50 | 1,200 |
| Statement | over $6.50 | 1,600 |
| Base | all bracelets | 2,800 |

**Bracelets are one price at every length** (17/19/21cm), Viktor's explicit decision, even though cost runs $22.15 to $26.85 — so the 21cm carries the thinnest margin.

**Why:** Pandora Thailand's standard heart-and-snake-chain bracelet is **฿3,500**, so ฿2,800 is exactly 80% of it, a claim that can be said out loud. Charms land near 64% of Pandora's cheapest visible charm (฿2,500). The bracelet's 2.5x multiple is deliberately thinner than charms at 4.4-4.8x: the bracelet gates every future charm sale, so conversion matters more than its own margin. Prices are round hundreds by choice, no .90 endings.

Working assumptions to revisit: FX **34 THB/USD**, and replacement cost = invoice cost **x 1.4** (silver has risen since the invoice was quoted; the handoff said 30-50%, midpoint taken).

Result across 316 SKUs / 4,302 pieces: **THB 5,538,800 retail value, 76% gross margin.** Applied by `E:\build_master.pl`. See [[storehub-import-schema]] and [[invoice-embedded-images]].
