# PHASE 26 · CAUSE 4 CORRECTIVE ROUND 2 — SH13 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `a62382b` — phase-25 VERDICT: cause 5 (SH16 camera,
corrective round) CLOSED (application `4ed3aad` stands); desk fix
committed separately as `f551174`. Tree stands at the last judged
state, HEAD `a62382b`. No judgement is pending when this fires.
Phase 24 re-routed this cause to the Hydrogen seat (Qwen seat
stalled measurably on cause 5; RUN_RECORD phase 24 ruling recorded
verbatim). The judgement this round corrects: phase 16, commit
`2cc52dc` — Qwen candidate #1 for SH13 judged and PARKED.

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23 13:35–13:48
EET. Verbatim seat output: `P25_HYD_SH13R2_OUT.txt` (same folder).
Brief: `P23_QWEN_SH13R2_BRIEF.md` as amended in phase 25 (complete
18-solid D2-CLEAR set) + Layla's live-baseline update (D1/D2 must
return ZERO lines). The driver applies the candidate VERBATIM —
no iteration, no hand-authored correction. **NO LOCAL RENDERS.
Colab LOCKED. SH26's line is DO-NOT-TOUCH. F1188 stays parked —
its reading must stand untouched. F590 + SH11 closed by decision —
never reopen.**

## The cause (standing)
SH13's original camera (lane A) sits inside the town hall solid
(D2-CLEAR hit) and fails F942 (box out) + F969 (face 61.5°, head
out). Lane B (phase-12 near-miss, Codex seat) cleared D2-CLEAR and
passed F942/F969 but lost F933's hand tip; lane C (Qwen #1, deeper
pullback) lost all three. Measured law: face angles across authored
world pos z are 10.2 → 61.5°, −6 → 47.9°, −14 → 66.3° —
non-monotonic in pullback; the loader's re-lane is not a linear
function of z. The binding unsolved point across every southern
lane is F933's hand tip at [4,1.2,-1].

Measured baseline (driver's own audit runs on HEAD `a62382b`):
- F933 (t=31.10) PASS: mocker_b hand tip in frustum (lane-A
  invariant — the point every southern lane has lost).
- F942 (t=31.40) FAIL: box_sh13 195px out of frustum.
- F969 (t=32.30) FAIL: mayor_old face angle 61.5°, head out 343px.
- F1188 (SH17) FAIL sea_sheet pull 0 >= 6 — PARKED, untouched.
- D1/D2 FAIL (1): D2-CLEAR shot 14 (SH13) "camera path intersects
  town hall" — the ONLY line; closing this cause clears it
  entirely (ZERO lines required).
- Chunk 3 staging 31/40 PASS (FAIL 9/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[-5.4,1.62,8.2],[-6,1.55,1.6]],[[-2,1.62,8.2],[-2.6,1.5,2.9]],40)

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[13,5,-9.5],[12,1.5,-6]],[[4.8,5,-8.2],[-4.6,1.9,2.2]],50)
World: FROM pos [13,5,-7.5] target [12,1.5,-4]; TO pos [4.8,5,-6.2]
target [-4.6,1.9,4.2]; fov 50. Design: a MOVING camera starting far
east (hand side) so F933's hand tip is in frame early in the eased
push, drifting west to land 0.2 units from lane B's proven TO state
so F942/F969 keep lane B's measured behaviour. Segment stays at
z ∈ [-7.5,-6.2], south of all 11 village solids (closest clearance
0.266 units to house @8,-4).

Seat's predicted readings (its own arithmetic, checked under BOTH
outCubic and the lane-A empirical ease):
- D2-CLEAR: PASS, 0 hits on all 18 solids; D1/D2 → ZERO lines;
  target bounds PASS both ends (FROM target y 1.5, TO y 1.9, both
  inside COAST_VILLAGE bounds).
- F933 hand tip: PASS — off-axis 19.05° (horizontal margin +3.82°)
  under outCubic; 8.60° under empirical ease.
- F942 box: PASS — 70.8px ≥ 60px (66.8px under empirical ease).
- F969: PASS — head 144.3px ≥ 120px, sphere margin +9.83°; face
  angle anchored to lane B's measured 47.9° (the seat showed the
  raw geometric dot is 105.5° on BOTH its candidate and lane B —
  the audit's face measure is the keyed-look definition, cf.
  phase 25's SH16 note: audit 14.2° vs raw-facing 34.67°).

## Judgement plan (hard gate, in order)
1. Staging audit on the applied tree — F933 must stay PASS,
   F942 + F969 must PASS, F1188's line must stand byte-identical;
   no other moment may change.
2. D1/D2 audit on the applied tree — must read ZERO lines (PASS):
   SH13's town-hall line gone, no new line of any kind.
3. Fleet re-probes of F933/F942/F969 → pixel measurements +
   driver eye.
4. Verdict committed. A failed candidate parks per precedent —
   application reverted in the verdict commit, no self-iteration.
