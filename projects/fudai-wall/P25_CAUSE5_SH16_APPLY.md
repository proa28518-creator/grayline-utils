# PHASE 25 · CAUSE 5 CORRECTIVE — SH16 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `186ee97` — phase-24 VERDICT: SH16 camera PARKED (Hydrogen
candidate 1 failed the D1/D2 gate on village house @-8,11, a solid
the brief never carried; application `d32c5c7` reverted in that
commit, film.js restored to the last judged state). No judgement is
pending when this fires. Phase 24 escalated with priced option (A):
corrective re-brief to the Hydrogen seat with the FULL 18-solid
D2-CLEAR set stated as a hard constraint — Layla took option (A).

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), corrective session run by Layla 2026-11-23
13:16–13:24 EET. Verbatim seat output: `P24_HYD_SH16_OUT2.txt`
(same folder). The driver applies the candidate VERBATIM — no
iteration, no hand-authored correction. **NO LOCAL RENDERS. Colab
LOCKED. SH26's line is DO-NOT-TOUCH. F1188 stays parked — its
reading must stand untouched. F590 + SH11 closed by decision —
never reopen.**

## The cause (standing)
SH16's camera path passes INSIDE the town hall solid; the framing
checks fail from that lane (body corners clipped, head out of
frame). Candidate 1 (phase 24) fixed the staging but its west
ground lane sat inside village house @-8,11 — the corrective brief
carried the complete solid set (audit_d1_d2.mjs: town hall + ten
village houses + seven neighbour houses, 18 solids).

Measured baseline (driver's own audit runs on HEAD `186ee97`,
reproducing phase 24 byte-identical):
- F1131 (t=37.70) FAIL: villagers body 428px, corners 2/8.
- F1137 (t=37.90) PASS: birds_sh16 130px in frustum (invariant).
- F1155 (t=38.50) FAIL: villagers face angle 33.4° (fine), head
  OUT 221px.
- F1188 (SH17) FAIL sea_sheet pull 0 >= 6 — PARKED, untouched.
- D1/D2 FAIL (2): D2-CLEAR shot 14 (SH13) + shot 17 (SH16), both
  "camera path intersects town hall".
- Chunk 3 staging 29/40 PASS (FAIL 11/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH16','line:14.start','line:14.end','COAST_VILLAGE',[[3.5,2.2,10.5],[0,1.4,0]],[[3.2,2.1,10.2],[0,1.3,0]],46)

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH16','line:14.start','line:14.end','COAST_VILLAGE',[[-5.4,7.6,9.8],[-1.1,2.5,0.9]],[[-5.2,7.5,9.5],[-1.1,2.4,0.9]],49)
World: pos [-5.4,7.6,11.8] → [-5.2,7.5,11.5]; target
[-1.1,2.5,2.9] → [-1.1,2.4,2.9]; fov 49. Design: ABOVE-THE-ROOFTOPS
lane — sampled y ∈ [7.5,7.6] clears every village-area solid
(house tops 6.0 by +1.5m; town hall top 6.4 by +1.1m) at any x/z;
x also threads between the west house flank (x_max -5.55) and the
hall (x_min -4.5).

Seat's predicted readings (its own arithmetic):
- D2-CLEAR: PASS against the full 18-solid set; D1/D2 → FAIL (1)
  (SH13 only). Target bound PASS (world target y 2.5 / 2.4).
- F1131 body: PASS — 386.8px; corners 8/8 (min edge margin
  +90.1px).
- F1137 birds: PASS — in frustum, min margin +72.7px; 104.2px at
  the audit's size 0.5 (baseline read 130px at the same size
  convention).
- F1155 head: PASS — face 34.67°; head sphere fully in (min
  margin +82.7px); 215.7px ≥ 80px.

## Judgement plan (hard gate, in order)
1. Staging audit on the applied tree — F1131/F1155 must PASS,
   F1137 must stay PASS, F1188's line must stand byte-identical;
   no other moment may change.
2. D1/D2 audit on the applied tree — must read exactly FAIL (1)
   (SH13 only): SH16's D2-CLEAR line gone, no new line of any kind.
3. Fleet re-probes of F1131/F1137/F1155 → pixel measurements +
   driver eye.
4. Verdict committed. A failed candidate parks per precedent —
   application reverted in the verdict commit, no self-iteration.
