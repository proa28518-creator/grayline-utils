# PHASE 35 · CAUSE 9 — SH18 CAMERA RE-JUDGE ON FIXED DATA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `dfd9322` — phase-34 VERDICT: PARKED-ESCALATED (SH18 DATA
FIX, GLM seat, application `7d7b2a1` STANDS on this HEAD): the
measure_wave climb now rides on `h`/`full` (top-level h:0,
full:15; start key {line:16.start, h:15, ease:3.75}; end key
{line:16.end, h:15}; kind untouched). Phase 34's acceptance
census could NOT be judged — it was staged under the BASELINE
camera, which never frames the measure in SH18 (census 0/0/0
there judges the stage, not the data). Phase 34 escalated the
exact remedy, executed here: the census is re-run on the
candidate-camera stage as THIS phase's first fleet measurement.
Tree stands at the last judged state, HEAD `dfd9322`. No
judgement is pending when this fires.

## Delivery
Candidate: the phase-33 Hydrogen candidate VERBATIM, re-applied
unchanged (application record `P33_CAUSE9_SH18_APPLY.md`; seat
output `P27_HYD_SH18_OUT.txt`; Hydrogen, Gemini Neon, Task mode,
session run by Layla 2026-11-23 14:24–14:29 EET). Phase 33 judged
it coded-PASS at every gate / render-FAIL on F1302 because the
engine never built the declared measure (lineY keys unread by
the kind); phase 34 fixed the DATA (GLM seat). The open question
of this round is the render layer alone, census-first.
**NO LOCAL RENDERS. Colab LOCKED. SH26's line is DO-NOT-TOUCH.
F1188 stays parked — its coded reading must stand
byte-identical. F590 + SH11 closed by decision — never reopen.**

## Measured baseline (driver's own audit runs on HEAD `dfd9322`,
2026-11-23, reproducing phase 34 byte-identical)
- F1188 (t=39.60) FAIL — PARKED: sea_sheet_sh17 state FAIL
  pull 0 >= 6. Must stand byte-identical.
- F1257 (t=41.90) PASS: wave_sh18 1833px in frustum (invariant).
- F1302 (t=43.40) FAIL: measure_wave 2082px out of frustum.
- F1335 (t=44.50) FAIL: wave_sh18 2094px out of frustum.
- D1/D2 PASS — ZERO lines.
- Chunk 3: FAIL (5/40 moments) → staging 35/40.

## Candidate (verbatim from P27_HYD_SH18_OUT.txt)
chunk3Shot('SH18','line:16.start','line:16.end','SEA',[[1,.65,5],[1.5,2.2,-20]],[[1.5,.9,4],[1.8,8.8,-20]],[46,50])
World: pos [1,0.65,-39] → [1.5,0.9,-40]; target [1.5,2.2,-64]
→ [1.8,8.8,-64]; fov [46,50] (ramp unchanged). Design: the
tilt-up is moderated (TO target y 16.5 → 8.8, target x centred
1.5→1.8) so both checked base centres stay inside the frame
through fraction 0.917.

Seat's predicted readings (empirical ease; audit governs):
F1257 wave PASS 1607.3px; F1302 measure_wave centre IN
1660.4px ≥ 200px; F1335 wave centre IN 1631.3px ≥ 500px;
D1/D2 stays at ZERO lines; D2-CLEAR 0 hits.

## Order of judgement (per the phase-35 tasking)
1. Staging audit + D1/D2 audit on the applied tree.
2. Fleet re-probe of F1302 FIRST → glow census on the rendered
   still (glow #ffd55c / arrow #ffe476 / plate #fff1a4 — phase 33
   measured 0/0/0 on the broken data):
   - glow > 0 → the phase-34 DATA CAUSE closes on the spot
     (recorded in this phase's verdict); proceed with F1257 +
     F1335 re-probes, pixel measurements, and the driver eye on
     all three stills, then the camera verdict.
   - glow still 0 → the data fix is FALSIFIED: revert BOTH the
     camera candidate and the data fix in the verdict commit,
     restore the `3d0aaa6` state byte-identical, escalate with
     the full evidence. No iteration.
3. The eye remains a real gate for the camera verdict: the
   glowing measure visibly present and climbing in the rendered
   F1302; the wave dominant at F1257/F1335.
