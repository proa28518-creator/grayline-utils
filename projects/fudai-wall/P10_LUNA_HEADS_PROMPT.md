# LUNA — COMPUTE RE-FIRE · phase 10 · cause: HEAD CROPS (F669/F687 mayor; F219/F241 SH04)

You are Luna, an independent compute/verification seat in Layla's production office for the film "fudai-wall" (chunk 2). This is a RE-FIRE: your first reply said CANNOT COMPUTE because no projection formula and no mayor positions were supplied. BOTH are supplied below, verbatim from the audit source and the scene/timing data. ONE cause family (close-shot head framing). Computed values only — you touch no files. Show all arithmetic; if anything below is still insufficient, say CANNOT COMPUTE and name exactly what is missing.

Standing law (obey, do not re-derive): RULES §3 (one cause, one change), §4 (faces read: within ~60° of camera, big, NEVER cut by the edge), §5 (set bar); critic protocol §7.

## THE PROJECTION FORMULA (verbatim from tools/audit_staging.mjs, makeFrame/screen — this is the audit's own camera model)

```
f = norm(target − pos);  right = norm(cross(f, [0,1,0]));  up = norm(cross(right, f))
v = fov in radians (VERTICAL fov);  h = 2·atan(tan(v/2) · (1080/1920))   // horizontal fov
for point p:  d = p − pos;  z = d·f                       // depth along view axis
  ndc_x = (d·right) / (z · tan(h/2));   ndc_y = (d·up) / (z · tan(v/2))
  screen(p) = [ (ndc_x + 1) · 540,  (1 − ndc_y) · 960 ]   // frame 1080 wide × 1920 tall, y down
projected height of size s at depth z:  2·atan(s / (2z)) / v · 1920  px
projected width  of size s at depth z:  2·atan(s / (2z)) / h · 1080  px
```

## MAYOR POSITIONS (extracted by script from scenes/film.js + audio/clean.json — not from memory)

- Mayor walk: `walk:[{t0:'line:2.start', path:[[0,-9],[0,-2],[0,2]], speed:5.5, gait:'walk'}, ...]` — path points are world [x,z]; head centre = position + [0,1.9,0].
- audio/clean.json: line 2 starts at t=4.56 s; line 3 starts at t=7.06 s.
- Path length = 7 + 4 = 11 D at 5.5 D/s → the walk completes at t = 4.56 + 2.00 = 6.56 s.
- **At F219 (t=7.30) and F241 (t=8.03) the mayor stands at the path end: world [0,0,2], head centre [0,1.9,2].** (Correction to the original brief, which said the walk starts at line:3.start — it starts at line:2.start; the conclusion is unchanged: he is stationary at [0,0,2] for both SH04 frames.)
- Cross-check: the staging audit at F219/F241 (cam pos [-5,3.5,9], target [0,4.8,1], fov 50) reports "mayor face PASS angle 35.5° head in 265px" — verify your formula reproduces ~265px for a 1.0 D head sphere at that depth before using it.

## Sub-cause A — SH09, the mayor's deadpan push-in (F669 t=22.3, F687 t=22.9)

Scene data (verbatim): SH09 camera from pos CAM_SH09_A = COAST_VILLAGE+[.5,1.7,4.4] (world [0.5,1.7,6.4]), target CAM_SH09_T = COAST_VILLAGE+[0,1.55,0] (world [0,1.55,2]), fov 32 → to pos CAM_SH09_B = COAST_VILLAGE+[.3,2.1,4.0] (world [0.3,2.1,6.0]), fov 30. The mayor stands at world [0,0,2]; his head centre is y=1.9. The loader's lowCams/autoMove adjust the authored camera; the staging audit's sampled poses are: F669 pos [0.42,1.86,6.24] target [0,1.55,2] fov 31.18; F687 pos [0.32,2.06,6.04] target [0,1.55,2] fov 30.20. The audit projects the head sphere (r=0.5) fully in frame at both (897px / 828px diameter) — PASS.

PIXEL MEASUREMENTS on the fleet-probed stills (1080×1920) — the render disagrees with the audit:
- F687: the mayor's rendered head disc measures centre ≈ (553, 30) px, radius ≈ 473 px; the crown is cut by the top edge (visible chin at y≈503). The audit projects centre ≈ (540, 653), radius 448. → the rendered disc sits ≈ 620 px HIGHER than projected; radius ratio ≈ 1.06.
- F669: rendered disc centre ≈ (540, 103) px, radius ≈ 431 px (crown cut; chin y≈534). Audit projects radius 414 (ratio ≈ 1.04), centre ≈ (540, 679). → rendered ≈ 576 px higher than projected.
So for SH09 the effective render camera pitches/aims ≈ 10° differently from the audit's sampled camera (the audit's lowCams rest is an approximation and renderer face-clamping is unmodelled — recorded in lessons/build.md). Treat the −590 ± 30 px vertical offset at the head's depth as a measured constant of THIS shot's camera family for your computation, and state that the fix will be verified on a fleet re-probe by a pixel gate (disc fully in frame, ≥ 40 px margin on every side).

TASK A: compute corrected SH09 values (target y and/or camera pos y / fov, within fov grammar [24,50], push-in preserved: F669 looser than F687) such that the rendered disc — centre = projected centre + (0, −590) px, radius = 1.06 × projected radius — is fully in frame with ≥ 40 px margin at BOTH frames. Prefer changing the target/cameras at the const level (CAM_SH09_T / CAM_SH09_A / CAM_SH09_B) — the same target const family is SH01's MAYOR_HEAD ([*,1.55,*]); check whether changing CAM_SH09_T alone suffices. Show the projected centres/radii before and after.

## Sub-cause B — SH04 (F219 t=7.3, F241 t=8.03): is it the same cause?

Scene data: SH04 camera is STATIC: pos CAM_SH04_A = CAM_SH04_B = COAST_VILLAGE+[-5,3.5,7] (world [-5,3.5,9]), target CAM_SQUARE = COAST_VILLAGE+[0,4.8,-1] (world [0,4.8,1]), fov 50. The mayor stands at [0,0,2] for both frames (see MAYOR POSITIONS above). Audit: mayor face PASS at both frames (angle 35.5°, head 265px). Pixel/critic truth (round 8, BLOCKING): at F219 the mayor does not read at all — villagers are corner-cropped in the foreground and the wall dominates; at F241 the mayor is centred but the critic counts cropped heads among the surrounding villagers; Layla's eye adjudication upholds the critic on F219 (no mayor in frame that reads).

TASK B: state, with arithmetic, whether sub-cause B is the same cause as A (a close-shot aim error) or a different one (a wide-shot composition error: camera height/target/fov for a square scene). If different, compute the SH04 correction as its own single cause: a camera (pos/target/fov, static or a from/to pair) under which at t=7.3 and t=8.03 the mayor's disc (projected + the SH04-family offset if you can derive one — if you cannot, say so and use the raw projection with the 1.06 radius and a ≥ 60 px safety margin) is fully in frame and ≥ 300 px, and at least two villagers are fully in frame (discs not edge-cut). Villager positions (world): villager_1 [-1,0,6], villager_2 [1,0,6], villager_3 [-2,0,8], villager_4 [5,0,7], villager_5 [-8,0,7], villager_6 [10,0,8] (COAST_VILLAGE [0,0,2] + their offsets); head centres y=1.9, rendered radius ≈ 1.32× the 0.5 sphere (hat-inclusive) for crop checks.

## Output form

Per sub-cause: `VERDICT: SAME CAUSE | DIFFERENT CAUSE` (B only) · `CORRECTION:` exact const-level changes · `ARITHMETIC:` projections before/after · `PREDICTED:` disc boxes at the judged frames · `RISKS:`. Plain text only, no tool calls, no simulated execution.
