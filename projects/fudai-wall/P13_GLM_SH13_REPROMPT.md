# GLM SEAT — CORRECTIVE RE-PROMPT · phase 13 · cause 4 (SH13 camera)

Your candidate was NOT applied: its supporting arithmetic is falsified in three named places. Correct them and propose again.

1. **Anchor dropped.** The from-target offset [-0.4,2.2,-10.6] is world [-0.4,2.2,-8.6] (anchor [0,0,2] added), not world z=-10.6. Every forward vector you derived used the wrong target.
2. **Direction contradiction.** With the corrected target, the FROM-end camera at world [7.2,3.6,-5.8] looks toward world [-0.4,2.2,-8.6] — toward NEGATIVE z. All three checked points sit at z ∈ [-1, 4.3] (hand [4,1.2,-1], box ≈[-5.4,1.15,3.8], mayor ≈[-5.75,1.68,4.3]) — behind/beside that view direction. Your own numbers prove it: your view-unit to the box [-0.79,-0.15,0.60] against your forward [-0.87,-0.16,-0.54] has dot ≈ 0.39 (≈67° off-axis), not 15.0 — you multiplied unnormalized vectors and read the product as an angle test.
3. Your F933 remark ("moving the start slightly deeper") describes a different line than the candidate you actually gave.

## What the measurements say the working family is
The near-miss that passed 3 of 4 sat on the SEAWARD side (world z ≈ -6, east x ≈ +4.8, y 5) looking VILLAGE-WARD (+z) across the square, fov 50, target sweeping from world [4,2,-1] to [-4.6,1.9,4.2]. It lost ONLY the hand tip at t=31.10 (shot fraction ≈ 0.07 — the camera is still within 7% of its FROM pose there). The hand [4,1.2,-1] and the box ≈[-5.4,1.15,3.8] are ≈9.5 apart laterally; both must sit inside the early frustum at once, and by F969 (fraction ≈ 0.47) the frame must centre the mayor ≈[-5.75,1.68,4.3] with his face within 60° of camera (he faces [-2,1.5,11]) and his whole head in frame.

## Reply again in the same exact format
1. BASELINE RESTATED (unchanged measurements).
2. CANDIDATE: one full replacement chunk3Shot line.
3. PREDICTED READINGS with CORRECT arithmetic: for each checked point, give the camera pos + target AT that moment (interpolate the push: F933 at fraction 0.07, F942 at 0.17, F969 at 0.47), the forward unit vector, the point's off-axis angle in degrees (from normalized vectors), and for the mayor the face angle. World coordinates throughout — add the anchor to EVERY offset, positions and targets alike.
