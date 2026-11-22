# Story 6 «الشوكولاتة اللي ساحت» — BOARD BUILD BRIEF (driver: Neon via desk Antigravity)
Pre-flight checked against standing rules 2026-11-21. Layla supervises + QC's every still with her own eyes; NOTHING renders until the owner approves the complete board.

## Read first (all in projects/story6-microwave/)
`BIBLE.md` (cast/sets/props/look) · `shots.md` (21 shots, frame ranges) · `script_owner_ar.md` (script of record) · `words_owner.txt` (word timings — shot boundaries snap to these) · `camera_angles_owner.txt` (owner's camera plan — follow it).

## Deliverable of this phase: THE BOARD
For each of the 21 shots, ONE still at its hero moment (the frame that sells the shot), 1080×1920, exported to `projects/story6-microwave/out/board/S##.png`, plus a contact sheet `out/board/contact.png` (grid, labelled). Visual-first: board before any full scene-code pass.

## Hard rules
- House engine/style: reuse the heart-studio cartoon engine + cast kit exactly as in story5-elevator (same character rigs/faces, new outfits: white lab coat hero, darker-coat mocker). Fresh leads are fine; do NOT invent a new face style.
- **BLENDER IS A REQUIRED PIPELINE STAGE (owner's direct word 2026-11-21 ~02:13 «لزم blender يدخل المشروع»).** The hero props are MODELED IN BLENDER (~/workspace/tools/blender-4.2.23), exported as GLB, and imported into the engine — not approximated with engine primitives: the radar device with its glowing nozzle/tube, the metal kettle, the iron wave-box, the giant first oven, the showroom scale. Save sources + exports to `projects/story6-microwave/assets/blender/` (`.blend` + `.glb` per prop) and list them in PROGRESS.md. Engine limits still apply inside the engine itself: primitives only — NO THREE.Shape/ExtrudeGeometry, CylinderGeometry has NO theta args.
- Light per BIBLE: warm gold vs blue-violet shadows (never black); "You see" shots S14–S16 go night-blue.
- Camera per shots.md: smooth glides; the still must sit at the shot's hero moment (e.g. S12 = the frozen egg-explosion frame, yolk on the mocker's face; S21 must MATCH S01's framing exactly for the loop).
- The wave device is shown, never named; no text/words inside stills except S19's stat labels (340 KG / $5,000).
- Checkpoint after every 5 stills: append one line to `projects/story6-microwave/out/board/PROGRESS.md` (shot ids done + any blocker). On 429/503: checkpoint and STOP — never switch models on your own.
- NO video render in this phase. Stills only.
