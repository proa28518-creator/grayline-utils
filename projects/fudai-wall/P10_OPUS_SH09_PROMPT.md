# OPUS — COMPUTE BRIEF · phase 10 · cause: SH09 HEAD CROP (F669/F687) — seat escalation

You are Opus, a build seat in Layla's production office for the film "fudai-wall" (chunk 2). ONE cause. Computed values only — you touch no files. Plain text only, no tool calls, no simulated execution.

Standing law: RULES §3 (one cause, one change), §4 (faces: big, NEVER cut by the edge), §5. Frame: 1080 wide × 1920 tall, y down, screen centre (540, 960).

## The shot

SH09, the mayor's deadpan push-in. Mayor stands at world [0,0,2], head centre [0,1.9,2]. Authored cameras: from pos [0.5,1.7,6.4] fov 32 → to pos [0.3,2.1,6.0] fov 30, target CAM_SH09_T = [0,1.55,2] (world). Judged frames: F669 (t=22.3, audit-sampled pos [0.42,1.86,6.24], fov 31.18) and F687 (t=22.9, sampled pos [0.32,2.06,6.04], fov 30.20). The loader's lowCams/autoMove adjust the authored camera before rendering; the staging audit samples the adjusted poses.

## MEASURED DATA — two authored target values, model vs render (this is the whole evidence base; compute from it, not from first principles)

Authored target y = 1.55 (the long-standing value):
- Audit model projection of the head sphere: F669 centre (540, 679), diameter 828px; F687 centre (540, 653), diameter 897px.
- RENDER (fleet-probed stills, pixel-measured): F669 disc centre (540, 103), radius 431 (diameter 862) — crown cut by the top edge; F687 disc centre (553, 30), radius 473 (diameter 946) — crown cut.
- So at this target the rendered disc sits ≈576px (F669) / ≈623px (F687) ABOVE the model centre, radius ratio ≈1.04–1.06.

Authored target y = 0.635 (a previous seat's correction, applied and probed — FALSIFIED):
- Audit model projection: F669 centre (540, −65), diameter 860; F687 centre (540, −136), diameter 935.
- RENDER: the head is FULLY out of frame at the top on both frames (the stills show torso and legs only). 
- Lesson measured, not theorized: LOWERING the target moved the projected centre UP (−718px at F669, −789px at F687 in the model) — pitching the camera down moves frame content up (screen y decreases). The previous seat's correction had the sign of this response backwards.

## Your task

Compute ONE corrected value for CAM_SH09_T (world [0, Y, 2]; only Y changes — camera positions and fovs stay) such that at BOTH frames the RENDERED disc (model centre shifted by the measured family offset: −576px at F669, −623px at F687; radius = 1.06 × model radius) is fully in frame with ≥40px margin on every side. Use the model's measured response slope (px of centre shift per unit of target Y, from the two data points above) and state it. The push-in must be preserved (F669 looser than F687 — it is, via the authored from/to). If the two frames demand different Y, give the single Y that satisfies both with the tightest margin stated, or say CANNOT with the measured reason.

Output: `CORRECTION:` (the exact const change) · `ARITHMETIC:` (slope, predicted model centres, predicted rendered centres/boxes/margins at both frames) · `PREDICTED:` · `RISKS:`. Plain text only.
