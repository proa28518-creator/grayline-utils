# CODEX SEAT — BRIEF · phase 12 · cause 4: SH13 camera — clear of the town hall, box + mayor_old framed

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4 (faces within ~60°, whole head in frame, never cut by the
edge; camera grammar: sampled fov ∈ [24,50], camera never inside a
solid). **NO LOCAL RENDERS. No fleet dispatch. Iterate against the
audits only** (`tools/audit_staging.mjs`, `tools/audit_d1_d2.mjs` —
their sampled CAM readings are the ground truth; the loader's
lowCams/autoMove intervene, so never trust a hand projection that the
audit does not reproduce).

## Previous verdict this brief cites (hard-gate requirement)
The phase-12 cause-3 verdict commit (cast place keys restored;
recorded in RUN_RECORD phase 12). No judgement is pending when this
brief fires; the driver records the exact hash in RUN_RECORD — cite
"phase-12 cause 3" in your reply.

## The cause (ONE shot's camera line — SH13, in `scenes/film.js` SHOTS3)
Three readings, one mechanism (the shot's camera line):
1. **D2-CLEAR FAIL**: SH13's camera path intersects the town hall
   solid (audit box x ±4.5, z 9.5..18.5, top 6.4, world). Current
   line (COAST_VILLAGE offsets): from pos [-5.4,1.62,8.2] →
   to pos [-2,1.62,8.2] at world z 10.2, y 1.62 — inside the box's
   z-range at low height as x crosses ±4.5.
2. **F942 (t=31.40) FAIL**: `box_sh13` out of frustum (195px) — the
   belongings box the beat is about (mocker_b hands it over at
   line:11.start; mayor_old carries it off) is not framed early in
   the shot.
3. **F969 (t=32.30) FAIL**: mayor_old face angle 61.5° (> 60°) and
   head out (343px) — the receiving mayor does not read at the
   shot's later moment.
Invariant: **F933 (t=31.10) PASS must stay PASS** (mocker_b hand tip
in frustum at the hand-over).

## Scope — camera only
Change ONLY SH13's camera (the SHOTS3 entry's from/to pos + target,
and fov within [24,50]). Do NOT move: the box's keys, mayor_old's
walk/look/face, mocker_b, any cast or prop, any other shot. The
story staging is Qwen's and is not this cause's to revise: the
hand-over at the village square, the mayor walking off with the box.
Work the line until all three readings pass together (a lane that
clears the hall — south of its z-range, above its top, or around
its x-extent — while holding the box early and the mayor's face
late); if the audit proves no single line satisfies all three,
STOP and report the measured conflict per reading — do not trade
one reading against another silently.

## Verify + reply
Run `node --check scenes/film.js`, `node tools/audit_d1_d2.mjs`
(SH13's D2-CLEAR line gone; SH16's remains — a later cause), and
`node tools/audit_staging.mjs` full. Paste: the new SH13 camera
values, the audit's F933/F942/F969 lines, and a statement that
chunk 2 still reads 19/19 and no other chunk-3 moment changed.
Do NOT commit. Touch no other file.
