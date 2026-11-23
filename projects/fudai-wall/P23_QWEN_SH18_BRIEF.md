# HYDROGEN SEAT — BRIEF · phase 23 (re-addressed phase 25) · cause 9: SH18 camera — hold the wave's base centre through the tilt-up

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). The staging for shots SH13–SH19 of this film
(chunk 3a), including SH18, was authored by the **Qwen** seat — that
authorship credit stands; this cause was re-routed to you (phase-24
dispatcher ruling; see the AMENDMENT section at the end of this
brief). Qwen's own design note for SH18
reads: "extreme low angle (0.65 D) on the drained sand, tilt-up to
the crest: the 17.5 D water wall spans the horizon and overflows the
top; the glowing measure climbs to exactly 15 before the word". You
AUTHOR the fix; the driver applies your values verbatim and judges
them with the project's measured audits. RULES §3: one cause, one
change. §4: faces within 60°, whole head in frame, never cut by the
edge; sampled fov ∈ [24,50]; camera never inside a solid. **NO LOCAL
RENDERS** — you propose numbers only; the audits are the ground
truth (the loader intervenes on authored cameras — lowCams/autoMove
plus an outCubic push ease — so only audit readings count; a hand
projection the audit does not reproduce is worth nothing — work from
the measured readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `21451c4` — phase-22 VERDICT: CLOSED (SH25 camera, corrective
round); the tree stands at the last judged state, HEAD `21451c4`.
Phase-14 dispatcher ruling: SH13–SH19 camera causes belong to the
Qwen browser seat. No judgement is pending on THIS cause; this brief
may fire. (Queue note: this is phase-12 queue item 9 — SH18 camera.)

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (the audit samples the loader's eased
camera; moment fractions below are (t − t0)/(t1 − t0) on the shot
span); fov is a number or [from,to]. Anchor SEA = world [0,0,-44];
world = offset + [0,0,-44] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH18','line:16.start','line:16.end','SEA',[[-1.5,.65,2.5],[0,2.2,-20]],[[-1,.9,1.5],[0,16.5,-20]],[46,50])
World: pos [-1.5,0.65,-41.5] → [-1,0.9,-42.5]; target [0,2.2,-64] → [0,16.5,-64].
Shot span: t 41.06–44.81. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
Both failing checks are prop checks: the prop's centre point must
be IN frustum AND `height(size[1], centre)` ≥ the moment's
threshold (sizes from the audit's table, below). **Read the check
definition carefully: the wave check measures the wave's BASE
CENTRE [0,0,-64] with a 17.5-unit height — not the crest.** The
audit as coded is the judge; satisfy the check as coded.

## The D1/D2 hard constraints (every camera brief carries these since phase 21)
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound; the wall is 18 D). Note the current TO target is world y 16.5 — inside the bound, with 3.0 of headroom.
- Both ends' WORLD targets inside at least one place's bounds (SEA bounds: x ∈ [-60,60], z ∈ [-70,-18]).
- The D1/D2 audit after your change must return **exactly the baseline FAIL (2)** — the two D2-CLEAR lines (SH13 + SH16, other causes) and nothing else; no new D-line of any kind.
- No D2-CLEAR / camera-inside hit on SH18: the sampled camera path must stay clear of every solid at every moment (the audit's solids: town hall, village houses, neighbour houses, the seawall box centre [0,9,-16] size [90,18,1.15], the gateleaf when visible).

## Measured baseline (driver's own audit runs on HEAD 21451c4 — restate these in your reply before proposing)
- F1257 (t=41.90, fraction 0.224) **PASS**: wave_sh18 1833px in frustum. Invariant — must stay PASS.
- F1302 (t=43.40, fraction 0.624) **FAIL**: measure_wave 2082px out of frustum. (Prop check: centre [5,0,-60] must be IN frustum AND height(15, centre) ≥ 200px — the size already reads 2082px; only the centre is out.)
- F1335 (t=44.50, fraction 0.917) **FAIL**: wave_sh18 2094px out of frustum. (Prop check: centre [0,0,-64] must be IN frustum AND height(17.5, centre) ≥ 500px — the size already reads 2094px; only the centre is out.)
- D2-CLEAR: **no hit on SH18** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes).
- The audit's sampled cameras under the current line: F1257 pos [-1.31,1.26,-41.88] target [0.00,7.69,-64.00] fov 47.54; F1302 pos [-1.09,1.26,-42.32] target [0.00,13.87,-64.00] fov 49.26; F1335 pos [-1.01,1.26,-42.47] target [0.00,16.12,-64.00] fov 49.89. (Note: authored pos y 0.65→0.9 samples at 1.26 — lowCams lifts this shot's camera; authored ≠ sampled.)
- No other moment may change (chunk 3 stands at 29/40; chunk 2 untouched).

## Staging geometry (world; camera only — move nothing else)
- wave_sh18: at SEA+[0,0,-20] = [0,0,-64]; size [90,17.5,24] → the check measures a 17.5-unit height at its base centre [0,0,-64]. Its h keys: 2 @line:16.start → 6 @line:16.word:2 → 17.5 @line:16.end (advance 0 → 2) — the water wall grows across the shot, but the checked point does not move.
- measure_wave: at SEA+[5,0,-16] = [5,0,-60]; size [1.5,15,0.2] → a 15-unit height at its centre [5,0,-60]; lineY keys 0 @line:16.start → 15 @line:16.end (the glowing measure climbing the wave face).
- The measured tension: your tilt-up does its dramatic work — the sampled target climbs y 7.69 → 13.87 → 16.12 while the camera stays at y 1.26 — and both checked centres (y 0, at z −60 and −64) fall out of the BOTTOM of the frame: the measure centre by fraction 0.624, the wave's base centre by 0.917. The fix must moderate the tilt (or drop/raise the camera, or narrow the geometry another way) so both base centres stay inside the frame through fraction 0.917 — while F1257's early framing (target y ≈ 7.7, wave 1833px in) stays PASS and the shot still reads as a low camera under a rising wall. The target-y headroom to the D2 bound is 19.5; the binding limit is the frame's bottom edge, not the bound.

## Your task
Propose ONE new SH18 camera line (SEA offsets, fov ∈ [24,50]) satisfying ALL of: F1257 wave still PASS; F1302 measure_wave centre IN frustum with height ≥ 200px; F1335 wave centre IN frustum with height ≥ 500px; both D1/D2 target constraints above with D1/D2 returning exactly FAIL (2); no D2-CLEAR / camera-inside hit; no other moment changed. If you judge the three moments unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1257, F1302, F1335, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F1257 / F1302 / F1335 + the two D1/D2 target constraints at both ends + D2-CLEAR): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), and its projected size in px by the audit's height formula.
Nothing else. Do not claim you ran anything.

## AMENDMENT — phase 25 (2026-11-23): re-route to Hydrogen + COMPLETE D2-CLEAR SOLID SET + D1/D2 constraints in current form

**Seat (supersedes the phase-14 seat lines in the body):** this brief is
addressed to the **Hydrogen** browser seat (Gemini Neon, Task mode) per
Layla's phase-24 dispatcher ruling (recorded verbatim in RUN_RECORD
phase 24 — the Qwen seat stalled measurably on cause 5, ~90 minutes
with zero output; the remaining chunk-3 camera causes and item 17
moved to Hydrogen). The underlying staging (chunk 3a, SH13–SH19) was
authored by the Qwen seat; that credit stands — only the repair seat
changes.

**D1/D2 hard constraints — current form (binding; restates and
confirms the body's section):**
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound;
  the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds.
- The D1/D2 audit after the change must return **exactly the baseline
  stated in the body, with NO new lines** of any kind. (The body's
  baseline is stated on HEAD `21451c4`; causes judged after this brief
  was written may have moved it — the driver re-states the live
  baseline in the session when this brief fires; the no-new-lines rule
  is what binds.)

**COMPLETE D2-CLEAR SOLID SET (the desk fix — read this before
proposing any camera):** extracted verbatim from
`tools/audit_d1_d2.mjs`, the audit that runs the D2-CLEAR check. The
audit tests **every shot from SH04 on** against **all 18 solids**, as
the straight world segment from the camera's FROM pos to its TO pos
(segment-vs-box; a segment touching a box fails). These 18 boxes are
the COMPLETE set — the seawall and the storeys are **not** D2-CLEAR
solids (they appear only as occluders in the staging audit, a
different check), and there is no gateleaf in this list. Where the
body above names a partial solids list, THIS section governs.

| # | solid | min [x, y, z] | max [x, y, z] |
|---|-------|---------------|----------------|
| 1 | town hall | [-4.5, 0, 9.5] | [4.5, 6.4, 18.5] |
| 2 | village house @-16,-3 | [-18.45, 0, -5.05] | [-13.55, 6, -0.95] |
| 3 | village house @-10,-4 | [-12.45, 0, -6.05] | [-7.55, 6, -1.95] |
| 4 | village house @-20,3 | [-22.45, 0, 0.95] | [-17.55, 6, 5.05] |
| 5 | village house @-14,7 | [-16.45, 0, 4.95] | [-11.55, 6, 9.05] |
| 6 | village house @-8,11 | [-10.45, 0, 8.95] | [-5.55, 6, 13.05] |
| 7 | village house @8,-4 | [5.55, 0, -6.05] | [10.45, 6, -1.95] |
| 8 | village house @14,-2 | [11.55, 0, -4.05] | [16.45, 6, 0.05] |
| 9 | village house @20,3 | [17.55, 0, 0.95] | [22.45, 6, 5.05] |
| 10 | village house @14,10 | [11.55, 0, 7.95] | [16.45, 6, 12.05] |
| 11 | village house @6,12 | [3.55, 0, 9.95] | [8.45, 6, 14.05] |
| 12 | neighbour house @585 | [582.55, 0, -4.05] | [587.45, 5.6, 0.05] |
| 13 | neighbour house @590 | [587.55, 0, -4.05] | [592.45, 5.6, 0.05] |
| 14 | neighbour house @595 | [592.55, 0, -4.05] | [597.45, 5.6, 0.05] |
| 15 | neighbour house @600 | [597.55, 0, -4.05] | [602.45, 5.6, 0.05] |
| 16 | neighbour house @605 | [602.55, 0, -4.05] | [607.45, 5.6, 0.05] |
| 17 | neighbour house @610 | [607.55, 0, -4.05] | [612.45, 5.6, 0.05] |
| 18 | neighbour house @615 | [612.55, 0, -4.05] | [617.45, 5.6, 0.05] |

(Generating rule in the source, for verification: the town hall is
fixed as above; each village house centre [hx, hz] → min
[hx−2.45, 0, hz−2.05], max [hx+2.45, 6.0, hz+2.05]; each neighbour
house at x=hx, z centre −2 → min [hx−2.45, 0, −4.05], max
[hx+2.45, 5.6, 0.05]. The boxes are the audit's conservative
maximum-dimension solids from set.js buildWorld.)

**For THIS shot (SH18, SEA):** NONE of the 18 stands in this shot's
place (SEA, world z ∈ [-70,-18]) — the town hall and village houses
(#1–#11) stand on the coast at world z ≥ -6.05, north of the sea
place, and the neighbour houses (#12–#18) stand ~600 units east. The
audit still tests the segment against all 18; a camera segment inside
the SEA place cannot reach any of them. D2-CLEAR has never hit on SH18.
