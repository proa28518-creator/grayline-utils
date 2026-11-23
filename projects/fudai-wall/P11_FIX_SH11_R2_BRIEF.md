# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: SH11 FLAT SKY-CYCLE FRAMES, ROUND 2 (F768/F798/F822)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3,
§4, §5; `lessons/build.md` (sampler-validation lesson is binding).

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** Sampler + audits only;
the driver fleet-probes and judges.

## Previous verdict this brief cites (hard-gate requirement)
Commit `a564010`: SH11 lever 1 (GLM's park [-5,14,16], target
[-5,0,-26], fov 34) REJECTED AND REVERTED. Detail improved
(17.6–20.9%) but the render had NO SUN AND NO SKY: from y=14 the
seawall occludes the orbs — the shot's beat (sun→moon over the wall)
died. film.js stands at the phase-9 park: CAM_SH11 =
COAST_VILLAGE+[-5,40,0], CAM_SH11_T = SEA+[-5.5,9,14], fov 50, whose
frames measure ~14% detail / ~81% flat (too much uniform sky).

## Binding facts (measured, do not re-derive wrong)
- The orbs ride near SEA+[-5.5,9,-30] (world ≈ [-5.5,9,-74]); the
  seawall (18 high) stands at z −20..−12. From a camera at z=18, the
  sightline to an orb centre crosses the wall's sea face (z=−20) at
  y = y_cam + 0.413×(9 − y_cam); keeping the centre clear of the crest
  needs **y_cam ≥ ~24.3** (recompute for your z; the staging audit's
  orb-occlusion check is the arbiter — it must read PASS, with the
  orb's projected size ≥60px, at all three moments).
- Astra's governing spec (batch 2): reframe around a FIXED LAYERED
  COASTAL ROOFLINE occupying substantially more of the LOWER frame,
  preserving a clear UPPER CORRIDOR for the sun-to-moon progression;
  existing scene detail only, no added props/noise.
- The set bar: SH11 median ≥22% detail / ≤78% flat on the pixel gate.
  The old park fails it on SKY; lever 1 failed it on the BEAT. Your
  park must satisfy BOTH: orbs visible in the upper corridor AND the
  roofline layering carrying the lower frame.
- Sampler validation: before searching, reproduce the staging audit's
  CAM lines + orb readings for the CURRENT park (F768 sunorb 112px
  PASS, F798 125px PASS, F822 moonorb 86px PASS at the y=40 park;
  sea patch 674–702px). If your sampler cannot reproduce them, STOP
  and report.

## Search space
CAM_SH11 / CAM_SH11_T / fov (24–50). The productive region is a MID
park (y ≈ 25–32) with a downward tilt: high enough for the orb
sightline, low/tilted enough that village rooflines layer across the
lower frame instead of empty sky. SH11 is a static park — one pose
must satisfy all three moments (the orbs move, the camera does not).

## Apply + verify
Apply ONLY the final SH11 values to `scenes/film.js`. Run
`node --check`, `node tools/audit_staging.mjs` (full — the three SH11
lines must read PASS incl. the orbs), `node tools/audit_d1_d2.mjs`.
Paste in your reply: the validation reproduction, the winning values,
the sampled projection table (orb centres + crest clearance at all
three t, roofline layers), the complete audit outputs, and a diff
summary. Do NOT commit. Touch no other file. If no park satisfies
both the orb checks and the layering, apply NOTHING and report the
measured conflict.
