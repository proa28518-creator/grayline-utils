# HYDROGEN SEAT — BRIEF · phase 43 · cause 10: SH19 camera, CORRECTIVE ROUND 2 — stations outside the wave's BUILT body

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). The staging for shots SH13–SH19 of this film
(chunk 3a), including SH19, was authored by the **Qwen** seat — that
authorship credit stands; this cause was re-routed to you (phase-24
dispatcher ruling). SH19 is the flashback: the young mayor on the
rock, the old wave behind him. Your round-1 candidate for this cause
was judged in phase 37 and re-diagnosed in phase 38; this is the
corrective round, and it starts from the diagnosis, not from zero.
You AUTHOR the fix; the driver applies your values verbatim and
judges them with the project's measured audits. RULES §3: one cause,
one change. §4: faces within 60°, whole head in frame, never cut by
the edge; sampled fov ∈ [24,50]; camera never inside a solid — and,
since phase 42, never inside a wave's BUILT body (a coded FAIL, see
below). **NO LOCAL RENDERS** — you propose numbers only; the audits
are the ground truth (the loader intervenes on authored cameras —
lowCams/autoMove plus an outCubic push ease — so only audit readings
count; a hand projection the audit does not reproduce is worth
nothing — work from the measured readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `ce1c8d2` — phase-42 RECORD: the audit-model correction
(Hydrogen seat) verified + APPLIED (application `14f6722`); the
audit-model cause is CLOSED; causes 9+10 stay PARKED-ESCALATED
pending their own rounds. This brief IS cause 10's round. The chain
behind it: phase-37 verdict `4b17534` (your round-1 candidate
PARKED-ESCALATED, application reverted) and phase-38's diagnosis
record `244f3d1`. The tree stands at the last judged state, HEAD
`ce1c8d2`; chunk 3 staging **34/40** under the CORRECTED audit;
**D1/D2 PASS — zero lines**. No judgement is pending on any other
cause when this fires. Cause 9 (SH18) is NOT touched by this brief —
its moments (F1302, F1335) must not change. F1188 stays parked —
its coded reading must stand byte-identical. SH26's line is
DO-NOT-TOUCH. F590 + SH11 are closed by decision — never reopen.

## The cause (ONE cause only: SH19's camera)
Under the baseline camera the push carries the mayor's head OUT of
frame at F1410 and the wave's centre finishes BEHIND the camera at
F1428. Your round-1 candidate (far-west station, line below) cured
both faults in the audit's arithmetic — exactly — and then failed
the EYE: the mayor was absent from all three rendered frames.
Phase 38 named the mechanism from the engine's own track data: **the
cameras sit inside wave_old_sh19's BUILT body** (the wave kind
builds its body offset from its entry point; the old audit modelled
the wave centred at the entry, never tested camera containment, and
did not count waves as face occluders). Phase 42 then landed the
audit-model correction: the standing audit now (i) floors cameras on
the ENGINE's rests, (ii) measures every wave on its BUILT body,
(iii) FAILs any chunk-3 sampled camera strictly inside a built wave
body, and (iv) counts built wave bodies as face occluders. On the
corrected audit the baseline reads: **F1367 face PASS but
containment FAIL** (the baseline camera itself is inside the body at
F1367), **F1410 FAIL**, **F1428 FAIL** — and your round-1 candidate
tree gains the containment FAIL at **all three frames**. Your
arithmetic was exact against an incomplete model; the model is now
complete at this shot. Design stations provably outside the built
body (its exact box is computed for you below).

## Corrected camera facts (phase 38 — carried VERBATIM; every future brief carries these)
- (C1) Engine lowCams floors: standing adult subject → **1.96** (not the audit's 1.61); dipped/walking subject → pose-head − 0.3 on ENGINE rests (hipY 1.610, headY 2.310, hh 0.700; audit rests 1.256/1.956). A camera authored below the engine floor resolves +0.354 above the audit's prediction near adult subjects; child/worker rigs are unmeasured — treat audit floors as lower bounds only.
- (C2) Wave built body: centre = at + (0, h/2, −12+advance), size (w, h, 24), h/advance read from the entry's keys at the judged time; the audit's entry-centred box misplaces waves by Δtop +1.0..+4.0 and Δcentre-z −12+advance. Camera stations must be containment-checked against the BUILT body — the audit does not test this.
- (C3) Waves are not face occluders in the audit: a subject behind a built wave body passes its occlusion test; sightlines crossing a built wave body must be checked by hand in the brief.
- (C4) Audit sampled cameras are trustworthy in x/z always, and in y whenever the shot is unfloored; seat arithmetic against them stands.
- (C5) Set-geometry occlusion (Finding 5) is unverified — do not stage relying on it either way until a probe settles it.

**Status note (phase 42, driver's — the facts above stand as the
record; what changed is where they are enforced):** the correction
is APPLIED, so C2's containment test and C3's wave occluders are now
CODED in the audit (a station inside the body prints `camera inside
wave_old_sh19 built body FAIL`; a sightline crossing it prints
`occluded by wave_old_sh19`), and the audit's rests now equal the
engine's — this shot's floor reads 1.96 in the audit itself, so
C1's "+0.354 above the audit's prediction" no longer applies to the
corrected tool; the floor VALUE (1.96, chest-bound on the standing
mayor_young) still binds every authored camera on this shot. C5 is
unchanged: the FLASHBACK_ROCK dodecahedron (r9 at [1200,5,−5]) is
in NO audit occluder list and its rendered occlusion is unverified
in both directions — do not stage relying on it either way.

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (moment fraction = (t − t0)/(t1 − t0),
linear fraction quoted below; the audit samples the loader's eased
camera); fov is a number or [from,to]. Anchor FLASHBACK_ROCK = world
[1200,0,0]; world = offset + [1200,0,0] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH19','line:17.start','line:17.end','FLASHBACK_ROCK',[[-2.5,.9,-21],[-2,1,-4]],[[-1,1.3,-16],[-4,1.2,-4]],46)
World: pos [1197.5,0.9,-21] → [1199,1.3,-16]; target [1198,1,-4] → [1196,1.2,-4].
Shot span: t 45.45–47.79. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
Check semantics under the CORRECTED audit: F1367/F1410 are face
checks (PASS iff the angle between mayor_young's face direction —
from his look keys — and the direction head→camera is ≤ 60°, the
head sphere r 0.5 is FULLY in frame, no occluder — built wave bodies
now included — crosses the segment, and height(1, head) ≥ the
moment's threshold: 45px at F1367, 55px at F1410). F1428 is a wave
check measured on the BUILT body (built-body centre in frustum AND
height(built size[1] = 5, centre) ≥ 120px). The containment test is
STRICT: sampled pos with min < pos < max on every axis of a built
wave body prints the FAIL line; it runs at every chunk-3 moment
frame. This shot's camera is FLOORED at y 1.96 (lowCams, chest-bound
on the standing mayor_young, engine rests): authored pos y below
1.96 does not survive sampling — the baseline authors y 0.9→1.3 and
samples at y 1.96 at all three frames (targets are not floored).

## wave_old_sh19 — the built body at the judged frames (computed from the film's own data)
Entry (film.js line 76, verbatim):
`{id:'wave_old_sh19',kind:'wave',in:'world',at:p('FLASHBACK_ROCK',[-9,-1.5,-17]),h:5,advance:0,w:14,keys:[{t:'line:17.start',h:5,advance:0},{t:'line:17.end',h:8,advance:4.5}]}`
So: at = [1191,−1.5,−17], w = 14, NO crestY anywhere on the entry
(buildH = min(17.5, h)), and the keys carry NO `ease` — the audit's
(and the engine's) field semantics are a STEP at the key: a key's
values govern from its own t until the next key. Resolved key times:
line:17.start = 45.45, line:17.end = 47.79. All three judged frames
(45.57 / 47.00 / 47.60) precede the second key, so **h(t) = 5 and
advance(t) = 0 at every judged frame**, and the built body is the
SAME box at all three (computed with the corrected audit's own
`waveBody()` over the project's resolver, driver's run on HEAD
`ce1c8d2`):

| frame | t | h(t) | advance(t) | built centre | built size | built min | built max |
|-------|---|------|-----------|--------------|-----------|-----------|-----------|
| F1367 | 45.57 | 5 | 0 | [1191, 1.0, −29] | [14, 5, 24] | [1184, −1.5, −41] | [1198, 3.5, −17] |
| F1410 | 47.00 | 5 | 0 | [1191, 1.0, −29] | [14, 5, 24] | [1184, −1.5, −41] | [1198, 3.5, −17] |
| F1428 | 47.60 | 5 | 0 | [1191, 1.0, −29] | [14, 5, 24] | [1184, −1.5, −41] | [1198, 3.5, −17] |

A sampled station is OUTSIDE the body iff it clears at least one
axis: x ≤ 1184 or x ≥ 1198, or y ≥ 3.5 (y ≤ −1.5 is underground —
not a station), or z ≥ −17 or z ≤ −41. Note the end state for the
path's tail (no moment judges past F1428, fraction 0.919, but do not
design a TO pose inside it either): at t = 47.79 the entry steps to
h = 8, advance = 4.5 → centre [1191, 2.5, −24.5], size [14, 8, 24],
min [1184, −1.5, −36.5], max [1198, 6.5, −12.5].

## Measured baseline (driver's own runs of the CORRECTED audit on HEAD ce1c8d2 — restate these in your reply before proposing)
- F1367 (t=45.57, fraction 0.051) **FAIL**: `camera inside wave_old_sh19 built body FAIL; mayor_young face PASS angle 8.1° head in 106px`. The face reading is an invariant — it must stay PASS; the containment line must GO.
- F1410 (t=47.00, fraction 0.662) **FAIL**: `mayor_young face FAIL angle 10.3° head out 131px`. (The angle is fine; the head sphere is not FULLY in frame — §4's whole-head rule is the failing half. No containment line at baseline here — the station is already outside, x by 0.76 and z by 0.22.)
- F1428 (t=47.60, fraction 0.919) **FAIL**: `wave_old_sh19 FAIL n/a px out of frustum` — the BUILT-BODY centre [1191,1.0,−29] is out of frustum under the baseline camera (the old 6216px figure was the entry-centred model; it is retired). No containment line at baseline here either.
- The audit's sampled cameras under the current line (corrected rests — y floored to 1.96): F1367 pos [1197.65,1.96,−20.51] target [1197.80,1.02,−4.00] fov 46 — pos is INSIDE the built box (x short of the 1198 face by 0.35; y and z mid-box); F1410 pos [1198.76,1.96,−16.78] target [1196.31,1.17,−4.00] fov 46; F1428 pos [1198.96,1.96,−16.13] target [1196.05,1.19,−4.00] fov 46. (Authored ≠ sampled: authored pos y 0.9→1.3 samples at 1.96 — the floor.)
- D1/D2: **PASS — zero lines** (see the hard constraints below; this must remain exactly so).
- No other moment may change: the full-audit diff of any application of your line must be the three SH19 lines + the chunk-3 total, nothing else (chunk 3 stands at 34/40; chunk 2 untouched at FAIL 2/19).

## Your round-1 candidate — falsified BY CONTAINMENT (the starting point of this round)
Verbatim (P27_HYD_SH19_OUT.txt):
chunk3Shot('SH19','line:17.start','line:17.end','FLASHBACK_ROCK',[[-12,2.8,-29.5],[-2,1.4,-2]],[[-13,2.8,-28],[-7,0.2,-12]],46)
World: pos [1188,2.8,−29.5] → [1198,1.4,−2]; target [1187,2.8,−28] → [1193,0.2,−12]; fov 46.
Phase-37 judgement: coded FULL PASS with your arithmetic exact
(F1367 71px vs your 71.2; F1410 73px vs your 73.3; F1428 1511px vs
your 1512.6 — all against the incomplete model), fleet 3/3 SUCCESS,
eye FAIL — the mayor absent from all three renders. Phase-42
candidate-tree anchor on the corrected audit: **F1367, F1410 and
F1428 EACH gain `camera inside wave_old_sh19 built body FAIL`** —
the FROM station [1188,2.8,−29.5] sits mid-body (x 1188 ∈
[1184,1198], y 2.8 ∈ [−1.5,3.5], z −29.5 ∈ [−41,−17]) and the push
never leaves the box at the judged fractions. The far-west family
is not forbidden — but any station west of the mayor must clear the
box on at least one axis at EVERY judged frame (e.g. y ≥ 3.5, or
x ≤ 1184, or z ≤ −41), with the floor and the sightline rules below
also satisfied. Do not re-submit this line or a near-copy that stays
inside the box.

## The D1/D2 hard constraints (current form — binding on this brief)
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound; the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds (FLASHBACK_ROCK bounds: x ∈ [1160,1240], z ∈ [−30,20]).
- The D1/D2 audit after your change must return **exactly the current baseline: PASS — zero lines**, with NO new D-line of any kind.
- No D2-CLEAR hit: the sampled camera path must stay clear of every solid in the complete set below at every moment (the audit tests the straight world segment FROM pos → TO pos of every shot from SH04 on against all 18 solids; a segment touching a box fails).

**COMPLETE D2-CLEAR SOLID SET (extracted verbatim from
`tools/audit_d1_d2.mjs`, the audit that runs the check — these 18
boxes are the COMPLETE set; the seawall and the storeys are NOT
D2-CLEAR solids, and there is no gateleaf in this list):**

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
[hx+2.45, 5.6, 0.05]. **For THIS shot:** NONE of the 18 stands in
FLASHBACK_ROCK (world x ≈ 1200) — the nearest solids are ~580+
units away in either direction; the audit still tests the segment
against all 18. D2-CLEAR has never hit on SH19.)

## Staging geometry (world; camera only — move nothing else; his keys are yours verbatim and stay)
- mayor_young: during line 17 he stands at his base [1200, 2] (x,z) — his place key lands at line:18.start (SH20), not in this shot. Head centre: [1200,1.9,2].
- His look keys: @line:17.start → [1196.5,−1,−12] (he looks west-north, down toward the shore); the next look key is @line:18.start — so at both F1367 and F1410 his face direction runs from his head toward [1196.5,−1,−12]. The face angle reads 8.1°/10.3° under the baseline — the direction is NOT the problem; the head sphere's frame position is, and any new station changes the angle too (recompute it — a station far south/east of him turns his face away from the camera).
- wave_old_sh19: the built body above is the checked object now — its CENTRE [1191,1.0,−29] is F1428's point, its built height 5 is the measured size, and the body itself is a face occluder: a sightline from your station to the mayor's head [1200,1.9,2] that crosses the box fails the face check (`occluded by wave_old_sh19`) even when the station is outside.
- The measured tension: the mayor's head at [1200,1.9,2] and the wave's built centre at [1191,1.0,−29] sit ~32 units apart across the camera's ground, with the built body (x [1184,1198], y [−1.5,3.5], z [−41,−17]) standing between the western approaches and the mayor. The fix must hold the mayor's whole head sphere in frame at fractions 0.051 AND 0.662, keep every sampled station outside the built box at all three fractions, keep the head sightline clear of the box, AND finish with the built centre in front of the camera and in frame at 0.919 — one continuous push, no solid entered, nothing else moved.

## Your task
Propose ONE new SH19 camera line (FLASHBACK_ROCK offsets, fov ∈ [24,50]) satisfying ALL of the acceptance below — the acceptance is written inside this brief and the driver judges exactly it:
- F1367: mayor_young face PASS — angle ≤ 60°, head sphere FULLY in frame, height(1, head) ≥ 45px, no occluder on the sightline — AND NO containment line.
- F1410: mayor_young face PASS — angle ≤ 60°, head sphere FULLY in frame, height(1, head) ≥ 55px, no occluder on the sightline — AND NO containment line.
- F1428: wave_old_sh19 PASS on the BUILT body — centre [1191,1.0,−29] IN frustum AND height(5, centre) ≥ 120px — AND NO containment line.
- D1/D2 returns exactly PASS — zero lines (both target constraints above hold at both ends; D2-CLEAR 0 hits).
- No other moment changes (full-audit diff = the three SH19 lines + the chunk-3 total only).
Judgement after your reply (so you know what your numbers must survive): the driver applies your line verbatim → corrected staging audit + D1/D2 → fleet re-probes of F1367/F1410/F1428 → pixel measurements + the driver's eye on the rendered stills — **the eye is the decisive layer** (phases 29/32/33/37: a coded PASS whose subject is absent from the render FAILS). If you judge the moments unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1367 incl. its containment line, F1410, F1428, D1/D2), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste — ONE line only.
3. PREDICTED READINGS: per check (F1367 / F1410 / F1428 + the two D1/D2 target constraints at both ends + D2-CLEAR): the interpolated camera pos + target AT that fraction (post-ease, post-floor — show the floor's effect if your authored y is below 1.96), the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), its projected size in px by the audit's height formula, for F1367/F1410 the face angle against his look direction and the head sphere's angular margin to the nearest frame edge — AND, at each of the three frames, your CONTAINMENT ARITHMETIC: the sampled pos against the built box [1184,−1.5,−41]–[1198,3.5,−17], axis by axis, naming the axis (or axes) on which the station clears the box and by how much; plus the head-sightline check against the same box (crosses / clears, with the segment's closest approach or the crossing point).
Nothing else. Do not claim you ran anything.
