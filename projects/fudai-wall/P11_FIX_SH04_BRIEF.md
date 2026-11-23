# CODEX SEAT — ESCALATION BRIEF · phase 11 · cause: SH04 COMPOSITION (F219/F241 — MAYOR ABSENT ON RENDER)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`.

## Previous verdict this brief cites (hard-gate requirement)
To be filled by the driver at firing time with the recorded verdict
commit of the cause judged immediately before this one. This brief does
not go out without that citation.

## The cause — a composition fault the staging audit cannot see
SH04 is a STATIC shot (from == to): pos `CAM_SH04_A/B` =
COAST_VILLAGE+[-5,3.5,7] (world [-5,3.5,9]), target `CAM_SQUARE` =
COAST_VILLAGE+[0,4.8,-1] (world [0,4.8,1]), fov 50. Its key frames are
F219 (t=7.30 s) and F241 (t=8.03 s).

- The scene-data staging audit PASSES both moments on its model (mayor
  face PASS 265px at 35.5°, BODY 2/2, popsign 351px at F241).
- The RENDER disagrees (fleet stills, chunk2d + round-8 pack): the
  pixel gate FAILs both frames — "mayor not identifiable" — and the
  driver's + Layla's eyes confirm: at F219 the mayor is NOWHERE in the
  frame; the villagers crowd the bottom-right corner with heads cropped
  by the frame edges; the wall dominates. At F241 the «3,000» popsign
  reads (that cause is CLOSED) but the mayor's face is still not
  identifiable. Critic rounds 7 and 8 both named it BLOCKING.
- Luna's seat verdict on this cause (phase 10): DIFFERENT CAUSE —
  composition, not a one-const head fix. Her computation was REJECTED
  on measured arithmetic errors (she used the 12.71 D target distance
  as the head depth instead of the true ≈8.22 D and slipped a factor
  of 10). The cause is therefore ESCALATED to you, iterating against
  the gates (the phase-8 escalation pattern).

## Calibration facts (phase 9, measured on renders — design against these)
- On close shots the RENDERED head centre sits ~340–620 px ABOVE the
  staging audit's projected centre (the audit's camera model does not
  reproduce the render camera's effective aim at close range). The
  mayor's rendered head radius is ~1.05–1.10× the audit's sphere.
- A subject the audit places at 265px can therefore render out of its
  expected region entirely. Design margins must absorb a ~600 px
  upward shift of rendered discs on close framings: either frame the
  mayor WIDER (smaller disc, more margin on every side) or verify
  against the pixel gate's measured discs after the fleet probe.

## Your method — iterate, then the driver probes
1. Using the pipeline's own sampling (the audits' preamble: resolver,
   lowCams, autoMove — do NOT hand-derive projections from raw consts),
   work out where the mayor and the villager group actually are at
   t=7.30 and t=8.03 (the mayor walks line 2 to [0,2] village coords;
   confirm his position at line 3 from the sampled data, and the
   villagers'/mockers' sampled positions).
2. Choose ONE corrected SH04 framing (pos/target/fov; you may make
   from != to a gentle push if a static frame cannot hold the
   composition, but keep fov within 24–50 and the camera clear of the
   building solids per D2-CLEAR). Targets at BOTH key frames:
   - the mayor's face identifiable and whole in frame with margin
     that survives the calibration shift above (aim: projected head
     ≥230px with ≥150px margin to the top edge AFTER a −600px
     rendered-centre shift is applied — or demonstrate from the
     sampled geometry why a smaller margin is safe at this distance);
   - ≥2 villager/mocker bodies in frame with their heads uncropped;
   - F241: popsign stays ≥60px and legible (do not regress the
     CLOSED sign cause);
   - face angle ≤60°.
3. Apply ONLY the SH04 camera values (CAM_SH04_A/B, CAM_SQUARE and/or
   the SH04 shot entry) to `scenes/film.js`. Run `node --check`,
   `node tools/audit_staging.mjs` (full), `node tools/audit_d1_d2.mjs`;
   paste the complete outputs + your sampled-position evidence + a
   diff summary in your reply. Do NOT commit (the driver commits).
   Touch no other file, no other shot.
The driver then fleet-probes F219/F241 and judges with the pixel gate
+ eye. If your framing fails there, the measured discs come back to
you for round 2 of THIS cause — do not widen the change.

## ASTRA REVIEW INPUT (2026-11-23, batch 2) — GOVERNING

Root cause, in Astra's framing: INVERTED SUBJECT HIERARCHY — the frame
gives the mayor no protected screen area. The correction is a MAYOR-LED
ANNOUNCEMENT COMPOSITION: the mayor's complete head sits in a CLEAR
UPPER-MIDDLE REGION of the frame; the villagers are subordinate (lower,
smaller, at the edges — never competing for the head's region). The
placement method is confirmed and binding: sample the actual camera +
head position per frame; resolve displacement onto the camera's
orthonormal axes; perspective division by FORWARD-AXIS DEPTH (8.222 if
confirmed against the sampled geometry), NEVER the camera-to-target
distance (12.71 — Luna's rejected slip); true 1080×1920 aspect +
vertical fov; check full-head bounds / angle / occlusion; then
reconcile with the measured rendered head (the calibration offsets in
this brief). A composition that passes the model but crowds the mayor's
head region with villager heads fails this brief.

## NVIDIA BAKE-OFF INPUT — Gemma-4-31b-it (2026-11-23, Layla's run) — ONE COMPUTE INPUT, UNVERIFIED

Gemma (the only NVIDIA model that completed a reply in the bake-off)
proposed, in its exact format:
- CAMERA: pos [-1.2, 2.1, 6.5], target [0.0, 1.8, 0.0], FOV 38
- CROWD: villagers to a lower-third arc centred [2.0, 0.0, -2.0], all
  head-tops below y=800px
- CHECK (ASSERTED, not measured): F219 head x[310,650] y[420,760];
  F241 head x[340,680] y[450,790]
Binding rules for this input: (1) treat the camera line as ONE candidate
— run it through YOUR sampler and report its measured table (sampled
camera at t, calibration shift applied) BEFORE adopting or rejecting it;
if the asserted CHECK numbers do not reproduce, reject it on evidence
and say so. Note the coordinate question: state whether you read the
values as world or PLACES-relative, and test the reading you choose.
(2) The CROWD line is OUT OF SCOPE for this camera cause (cast base
positions are shared across shots) — do not apply it; if your sampler
shows the camera alone cannot satisfy the brief, report the crowd move
as a separately-priced option in your reply, do not widen the change.
