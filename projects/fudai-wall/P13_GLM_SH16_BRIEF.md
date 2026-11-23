# GLM SEAT — BRIEF · phase 13 · cause 5: SH16 camera — out of the town hall, villagers framed whole

You are the GLM build seat for the film "fudai-wall". You AUTHOR the
fix; the driver applies your values verbatim and judges them with the
project's measured audits. RULES §3: one cause, one change. §4: faces
within 60°, whole head in frame, never cut by the edge; sampled fov
∈ [24,50]; camera never inside a solid. **NO LOCAL RENDERS** — you
propose numbers only; the audits are the ground truth (the loader
intervenes on authored cameras, so only audit readings count).

## Previous verdict this brief cites (hard-gate requirement)
Commit `822a4e4` — phase-13 cause 4 parked-escalated (recorded,
committed). No judgement is pending on THIS cause; this brief may fire.

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
linearly from→to across the shot (moment fraction = (t − t0)/(t1 − t0));
fov is a number or [from,to]. Anchor COAST_VILLAGE = world [0,0,2];
world = offset + [0,0,2] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH16','line:14.start','line:14.end','COAST_VILLAGE',[[3.5,2.2,10.5],[0,1.4,0]],[[3.2,2.1,10.2],[0,1.3,0]],46)
World: pos [3.5,2.2,12.5] → [3.2,2.1,12.2]; target [0,1.4,2] → [0,1.3,2].
Shot span: t 37.39–38.71. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920).

## Measured baseline (driver's audit runs on HEAD 73d4b6e — restate these in your reply before proposing)
- D2-CLEAR **FAIL**: SH16's camera path intersects the town hall solid (world box x ∈ [-4.5,4.5], y ∈ [0,6.4], z ∈ [9.5,18.5]). The current path sits inside it (z ≈ 12.2–12.5, y ≈ 2.1–2.2, x ≈ 3.2–3.5).
- F1131 (t=37.70, fraction 0.23) **FAIL**: villagers body 428px but corners 2/8 — the body box is mostly out of frame. (Pass needs corners 8/8; size already ≥ 230px.)
- F1137 (t=37.90, fraction 0.39) **PASS**: birds_sh16 130px in frustum (needs ≥ 25px). Invariant — must stay PASS.
- F1155 (t=38.50, fraction 0.84) **FAIL**: villagers face angle 33.4° (limit 60° — fine) but head out 221px — the head sphere is cut by the frame edge. (Pass needs the head sphere FULLY in frame and head height ≥ 80px.)
- No other moment may change.

## Staging geometry (world; camera only — move nothing else)
- villagers (one rig): base [-3,0,2.8]; body box x ∈ [-3.4,-2.6], y ∈ [0,1.9], z ∈ [2.4,3.2]; head centre [-3,1.9,2.8], head sphere r 0.5. His face angle reads 33.4° from the current southern camera — he faces substantially toward +z (south). A camera north of him (z < 2.8) will see his back: the face angle will exceed 60°. Keep the camera SOUTH of z = 2.8.
- birds_sh16: point ≈ [1.5,4.6,3] (a burst point; the audit checks it in frustum, ≥ 25px).
- Legal camera region (outside the hall box, with margin): z ≤ 9.0 (north of the hall), OR y ≥ 6.9 (above it), OR |x| ≥ 5.0 while in its z-range. The whole path segment must stay legal.

## Your task
Propose ONE new SH16 camera line (COAST_VILLAGE offsets, fov ∈ [24,50]) satisfying ALL FOUR readings: D2-CLEAR clear; F1131 body corners 8/8; F1137 birds still in frustum; F1155 head sphere fully in frame with face angle ≤ 60°. The current failure is a framing failure from inside the hall: the natural family is a legal position south of the villagers (2.8 < z ≤ 9.0), closer than the current ≈11.7 distance, aimed at the villagers with the birds point kept inside the same frustum.

## Reply format (exact)
1. BASELINE RESTATED: the four readings above, in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: a table per moment (F1131 / F1137 / F1155 + D2-CLEAR) giving: interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), and for F1155 the face angle and the head sphere's angular margin to the nearest frame edge.
Nothing else. Do not claim you ran anything.
