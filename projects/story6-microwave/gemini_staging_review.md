# Gemini (browser, "Gemini Hydrogen" picker label) — staging review, 2026-11-21 ~04:39
# Source: gemini.google.com conversation "Microwave Staging and Layout Review"
# https://gemini.google.com/app/7e977049a51a0bb6
# Role: staging reviewer for the Story 6 rebuild (per-shot rules + grading checklist + risks).

(A) Concrete Staging Rules Per Problem Shot

S01 (0.2s–1.4s: Chocolate melts in pocket — 1.2s / 36 frames)
• Scale & Anchor: chocolate bar scaled to ~0.35 units tall (~12% of hero's 2.9 height), parented directly inside his coat pocket at y ≈ 1.45, at hero home (-5, -1.55), never floating.
• Start Frame & Dolly Math: Start camera at z = 0.2 (1.75 units from pocket), angled 20° down onto the pocket seam with melted chocolate oozing onto the fabric. Dolly straight back in Z to z = 2.8 over the 36 frames (ease-out on frame 28) to reveal his torso up to his chin (y = 0.8 to 2.9) and the glowing radar horn (x = -5, z = -8) in soft-focus background.
• Silhouette Separation: Keep hero's left arm pulled back (rotation.x < -15°) so the forearm does not occlude the pocket during the dolly.

S05 (9.8s–11.7s: Shock realization face — 1.9s / 57 frames)
• Clear the Foreground Occluder: The kettle bench (z = -4, y = 1.6) sits between camera and hero (z = -1.55). Either move hero forward to z = -1.2 and place camera at (z = 1.8) looking at (-5, 2.2, -1.2), or offset camera to x = -6.8, z = 1.2 to shoot past the bench's left edge.
• Framing Floor: Frame from mid-chest (y = 1.65) to crown (y = 3.05) at ~3.0 units distance (fov = 34°). Both shoulders, collar, and raised hands visible in the lower third so the head is grounded to the torso.
• Background Anchor: Keep the radar cabinet's glowing horn (x = -5, z = -8) visible over his left shoulder.

S09 (19.8s–23.6s: Popcorn erupts — 3.8s / 114 frames)
• Rim & Scale Contrast: Kernels scaled 0.12–0.18 units (3× realistic), bright warm white (#FFF8E7), strong rim light against the dark lab.
• Camera Angle & Container: Camera at (-2.2, 2.5, -1.8) looking down 25° into the open kettle/bag at (-3, 1.6, -4) so the viewer sees inside the container before the burst.
• Vertical Trajectory: 80% of kernels within a tight 1.2 × 2.2 unit vertical plume (x = -3.6 to -2.4, y = 1.6 to 3.8) filling the 9:16 center column.

S10 (23.6s–25.9s: Egg in kettle, mocker leans in — 2.3s / 69 frames)
• Z-Compression Over X-Spread: Kettle (-3, 1.6, -4), mocker (2, -0.8) — 5-unit X-spread forces a wide shot where the egg disappears. Camera over the mocker's right shoulder at (3.2, 2.3, 0.8) looking diagonally toward (-3, 1.6, -4).
• Foreground/Background Lock: Mocker occupies right 40% of frame (profile/3/4 back); kettle + oversized white egg (0.30 units) in left-center 50% at z = -4.
• Lean Vector: Mocker leans along the camera-to-kettle diagonal (toward (-1.5, 1.8, -3.2)) so his head grows without blocking the egg.

S12 (28.4s–30.4s: Egg explodes in mocker's face — 2.0s / 60 frames)
• Tight Two-Beat Framing: NOT a wide two-shot. Camera at (-1.8, 2.1, -3.5) looking at mocker's face at (0.5, 2.1, -2.2) (distance ~2.6, fov = 34°), smoking kettle lip in bottom-left foreground.
• Directional Splatter: Yolk/shell blast cone along the vector from (-3, 1.6, -4) to the mocker's face; impact reads in 6 frames, then 0.3s hold on his yolk-covered face and wide eyes.
• Percy Exclusion: Hero out of S12 entirely; cut to him in S13.

S16 (38.2s–40.6s: Waves in/out of open box — 2.4s / 72 frames)
• Prop Proportions & Bench Grounding: Wave box on bench (5, 1.3, -5) scaled 1.1 wide × 0.85 tall × 0.9 deep (~35% of hero height), bench top (y = 1.3) clearly visible beneath it.
• 3/4 Cutaway Angle: Camera at (3.6, 2.2, -2.4) looking at (5.0, 1.75, -5.0) (distance ~3.0) so open front cavity + top/side walls read as a hollow 3D box.
• Wave Readability: 3–4 thick glowing cyan/magenta sinusoidal ribbons (tube radius 0.04) entering the open front, bouncing twice off interior walls, spilling back out.

S17 (40.6s–43.3s: He builds the metal box — 2.7s / 81 frames)
• Unified Blocking: Hero moves to (3.7, -1.55) beside the bench (5, 1.3, -5). Box keeps the exact S16 scale.
• Distance Check: Δx = 1.3 (total bounding ~2.4). Camera at z = 2.2 (distance 7.2 → horizontal width 2.47) so hero's torso/arms (left) and the full box (right) sit inside the 9:16 safe zone. (Gemini self-corrected its first 4.5-distance figure as too tight.)
• Action Clarity: Hero welds/rivets the front door frame onto the box (y = 1.7), sealing the S16 leak.

S20 (50.3s–53.5s: Zoom out, a microwave in every home — 3.2s / 96 frames)
• Start on a Hero Kitchen: First 0.8s tight on one warm kitchen counter (window, tile backsplash, mug, glowing microwave) at distance 2.5.
• Architectural Grid Framing: Exponential pull-back (z = 2.5 → 45 over 72 frames) reveals a cutaway apartment building / house facade with roofs, windows, warm lights, family silhouettes — never floating cubes.
• Grid Density Cap: Final grid capped at 5 × 9 (45 homes) so each kitchen/microwave stays legible at 1080×1920.

(B) 10-Point Grading Checklist
1. Frustum math: two-subject shots place camera at distance ≥ Δx / (2 × tan(fov/2) × 0.56) × 1.15 (15% margin).
2. Scale consistency vs hero (2.9): chocolate ≤ 0.35, egg ~0.30, wave box ~1.1×0.85×0.9, Radarange ~2.6 tall. No prop changes size between shots.
3. Zero unintended foreground occluders in reaction shots (S02, S05, S07, S13).
4. S01: chocolate physically inside pocket (y ≈ 1.45), dolly-out completes within 36 frames, no coat/arm clipping.
5. Particle legibility: popcorn, yolk, waves oversized (≥0.12), rim-lit, dark backgrounds.
6. Diagonal Z-staging for two-shots (S10, S12), not flat side-by-side X.
7. Screen-direction lock: hero screen-left, mocker screen-right across S01–S13; hero crosses to x=3.7 only in S17.
8. Beat discipline: each shot's primary read resolves within the first 60% of its duration.
9. World-jump anchoring: x=400/800/1200 transitions open on a clear central focal point; S20 starts inside a recognizable room.
10. S21 loop: ends on S01's exact camera/focal/pocket framing.

(C) 3 Biggest Staging Risks
1. The z=-4 bench occlusion trap: never shoot along the straight Z-axis; use ±25–35° X-offsets or camera y ≥ 2.4 looking down 15–25°.
2. The 9:16 horizontal squeeze on the 12.3-unit-wide lab: abandon wide master shots; connect landmarks via over-the-shoulder diagonals and Z depth stacking.
3. Extreme scale jumps across the four worlds (0/400/800/1200) within 18s: put a 2.9-unit human silhouette next to the giant oven in S18–S19; start S20 tight on one kitchen.
