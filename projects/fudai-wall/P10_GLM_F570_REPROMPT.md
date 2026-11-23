# GLM — CORRECTIVE RE-PROMPT · phase 10 · cause: F570 (SH07)

You are GLM, a build seat in Layla's production office for the film "fudai-wall". ONE cause. Computed values only — you touch no files. Plain text only, no tool calls, no simulated execution. Standing law: RULES §3 (one cause, one change), §4 (faces read within ~60° of camera, big, never cut by the edge), §5.

## Your phase-9 correction was applied and MEASURED — it fails on a sign error in your own arithmetic

You proposed SH07 TO pose: pos [3.6,2.6,-2.6], target [1,7.5,-16], fov 50. Applied exactly, the staging audit samples F570 (t=19.00, the shot's end pose) at exactly that camera and reports: **mocker_a head FAIL — centre BEHIND camera frustum; wall top FAIL — point out of frustum.**

The measured geometry: head centre [4,1.9,0]; rel = head − pos = [0.4,−0.7,2.6]; forward f = norm(target − pos) = norm([−2.6,4.9,−13.4]) ≈ [−0.18,0.34,−0.92]. Depth = rel·f = −0.07 −0.24 −2.39 = **−2.70 (negative: the head is BEHIND your camera)**. In your phase-9 arithmetic you computed the same three products (−.11, −.32, −2.21) and wrote the sum as +2.64. The camera you proposed stands seaward of the mocker (z=−2.6 < his z=0) looking further seaward — he is behind it. Your correction is rejected on this measured evidence.

## The actual fault (pixel truth, fleet-probed still F570)

The CURRENT staging (SH07 to-pose pos [5.5,2.2,4.2], target COAST_WALL+[1,7.5,0] = [1,7.5,-16], fov 50) PASSES the staging audit geometrically (head sphere in frame, wall-top point in frame). On the RENDER, mocker_a reads as an illegible BACK-OF-HEAD: his look key at line:6.word:8 aims his face at [2,19.5,-17.5] (the wall top, north-up), away from the village-side camera; and the blueprint board (centre [5.2,1.7,0.5], 3.4×3.4) fills the frame's lower half directly behind his silhouette, so the dark head merges with the board's grid. The pixel gate segments NO skin disc at F570.

## Constraints

- The word:8 look target [2,19.5,-17.5] is a deliberate story point (he looks up at the wall top where the coins drop at F590, SH07B) — set in a prior audited fix. If your correction touches it, you must show the F590 coin beat still reads (SH07B: from = SH07's to-pose; to pos COAST_VILLAGE+[2,21.5,-15], target COAST_WALL+[2,19.5,-19], fov 24; coins PASS 333px in the audit).
- F537 (SH07's from pose: pos [4,2.5,-5] offset COAST_VILLAGE → world [4,2.5,-3]... authored from CAM_SH07_A=COAST_VILLAGE+[4,2.5,-7], target CAM_SH07_TA=COAST_VILLAGE+[4,1.9,-2]) currently renders a full laughing face (480px) and must not regress: SH07's FROM pose is not part of this cause; only the TO pose (and SH07B's duplicated FROM copy) may change.
- Camera grammar: fov ∈ [24,50]; the camera never inside a solid; the wall-top point [3,18,-15.42] must stay in frame at F570 (audit check); mocker_a's head must project ≥230px AND his FACE must read — face angle (between his look direction and the head→camera direction) ≤ 60°, aim ≤ 35°; and his head disc must not sit against the blueprint board's screen box (the board must not be the head's backdrop).

## Your task

Compute ONE corrected SH07 TO pose (pos/target/fov, world values AND as COAST_VILLAGE/COAST_WALL offsets) such that at F570: head depth > 0 (show the dot product with signs written out), head ≥230px, face angle ≤60° (show it), wall-top in frame, and the blueprint board's projected box does NOT contain the head disc's centre. If a camera-only correction cannot satisfy all five, say so plainly and name the smallest second lever (with its price on F590).

Output: `CORRECTION:` · `ARITHMETIC:` (every dot product expanded) · `PREDICTED:` · `RISKS:`. Plain text only.
