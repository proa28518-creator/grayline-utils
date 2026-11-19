# TASK — current assignment for the resident driver

State: **ACTIVE** — assigned by Layla, 2026-11-18 ~19:22 EET.

- Film: «ستين ثانية على آخر ترام» (Sixty Seconds to the Last Tram) — STAGE 1 REDO (Build + stills gate only)
- Project: projects/story3-tram/
- Idea / script: the script of record is `projects/story3-tram/script_performed_ar.md` — the owner's own performed wording, 112 words / 13 lines. Beats and staging intent: `projects/story3-tram/story.md`. Do NOT rewrite the script.
- Voice: `projects/story3-tram/audio/clean.wav` (43.87 s, already cleaned) with word timings in `projects/story3-tram/audio/clean.json`. The audio stage is DONE — do not redo it, do not substitute any voice or timing.
- Timing: clean.json (from the owner's own timing file) governs wording AND timing.

## Why this is a redo

A first build of this film (outside this program, reference only: ~/workspace/creatorize-build/foundation_run1/project_story3/ and RUN 15 in its RUN_LOG.md) was REJECTED by the owner. Do not copy its staging. His corrections, which are the law for this build:

1. **THE FINALE IS INSIDE THE TRAM.** From the dive (line 10) to the end, the camera is INSIDE the tram interior: the runner lands inside, the doors close on his coat seen from inside, and the passengers — inside with him — stand and applaud with faces and clapping hands VISIBLE. The standing ovation is the film's payoff and must read clearly at board scale (360×640). The rejected build staged all of this from outside, behind opaque tram glass, so the applause was invisible.
2. **MISSING SETS ARE BUILT IN BLENDER.** The kit has no tram interior — model one with Blender (Blender 4.2.23 at ~/workspace/tools/blender-4.2.23, Python scripting: floor, bench seats, poles/hand straps, windows, sliding doors), export GLB, and bring it into the project as a set piece, per the style's environment-overhaul pattern. The same rule applies to any other set this script needs that the kit does not have. Engine files stay byte-identical; the GLB is a project asset.
3. **THE HURDLE MUST READ.** At line 4 the runner is visibly airborne over the abandoned suitcase, inside the frame. (In the rejected build he was displaced out of frame during the jump.)
4. **KEEP WHAT WAS RIGHT:** the three-tier cake is readable in EVERY shot at board scale and never vanishes or teleports; it stays level through the slide; the station clock's red hand lands exactly on 30 at the word «تلاتين» (dedicated punch-in); faces are expressive and keyed to the words; the run never reads as standing still.
5. **SOUND DESIGNED-IN FROM THE START** (design + cue notes in the build record; the Mix itself is a later stage): clock tick under everything, the marching band as a wall of sound at line 6, slide scrape, door sigh, applause INSIDE the tram at the close, and a music bed from their template pack (Kevin MacLeod, CC BY).

## Owner's frame notes on the rejected build (verbatim intent, added as they arrive)

1. (2026-11-18 ~19:23 EET) In the finale stills the runner's HEAD pokes out of the tram while the tram is closed with him supposedly inside it. In the redo he must be fully INSIDE the interior set — body and head — with the doors closed; nothing of him clips through the tram shell, roof or windows.
2. (2026-11-18 ~19:24 EET) THE PLACE IS WRONG in the rejected build: what is on screen reads as a generic street, not the story's scene. The owner: "imagine the scene — it does not exist in these pictures." In the redo, design the environment FROM the script: an open plaza the crowd fills, the station with its clock, the platform edge where the tram waits — a plaza-and-station world the run crosses in one flow, not street backdrops.

## Deliverable for this task

Build pass complete (Camera → Environment → Post → Shading per DRIVER.md), one still per shot plus a contact sheet saved under the project, a fresh GLM critic verdict on the Build (via `heart critic` or the apinex-heart MCP, production critic form), checkpoint lines after every step in driver/checkpoints.md — then STOP at the stills gate and checkpoint that you are waiting for Layla. NO fleet render in this task.

## STAGE 2 — OWNER GATE PASSED 2026-11-18 21:36 EET (word via Layla)
Stills APPROVED by the owner as they stand (incl. shot_16 reframe). Proceed:
1. FLEET RENDER of the full film (1,325 frames) via the proven frame-zero.yml route: a branch changing ONLY the invoked harness file; ~30-frame chunks. If a NEW workflow file is needed, STOP and checkpoint BLOCKED — never improvise around the token's missing workflow scope.
2. Track guard on the assembled picture (PTS audit, exact frame count).
3. MIX from the BIBLE.md cue sheet (designed-in from the start): clock tick bed, band wall, slide scrape, door sigh, inside-tram applause, Kevin MacLeod music bed; voice = audio/clean.wav untouched; master at −16 LUFS, −1 dBTP ceiling.
4. Checkpoint EVERY step as it lands (no backfill). Deliver the master path in a checkpoint line: step=deliver.
STOP after delivery — Layla QC's the film with her own eyes before the owner sees it.

## STAGE 2 EXCEPTION — OWNER'S WORD 2026-11-19 00:08 EET (via Layla)
GitHub Actions billing/spending limit blocked the 23 gapfill render runs + final track runs (state: 1100/1325 frames, 1075/1325 track). The owner grants a ONE-TIME exception to the fleet-only rule for THIS gap only:
1. Produce the missing ~225 render frames LOCALLY with the project's own harness, in small sequential batches written into the exact layout the assembler expects. Checkpoint progress every batch (frames-on-disk count) so a runtime restart loses nothing.
2. Complete the missing track data locally with the project's track tooling.
3. Then as before: assemble all 1325 frames, track guard (PTS audit + exact count), mux with out/mix_stage/audio/final_mix.wav, checkpoint step=deliver with the master path.
This exception covers ONLY the Story 3 gap. The fleet-only rule stands for everything else.
