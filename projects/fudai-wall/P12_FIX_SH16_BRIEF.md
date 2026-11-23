# CODEX SEAT — BRIEF · phase 12 · cause 5: SH16 camera — out of the town hall, villagers framed whole

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4 (faces within ~60°, whole head in frame, never cut by the
edge; camera grammar: sampled fov ∈ [24,50], camera never inside a
solid). **NO LOCAL RENDERS. No fleet dispatch. Iterate against the
audits only** (`tools/audit_staging.mjs`, `tools/audit_d1_d2.mjs` —
their sampled readings are the ground truth; lowCams/autoMove
intervene, so never trust a hand projection the audit does not
reproduce).

## Previous verdict this brief cites (hard-gate requirement)
The phase-12 cause-4 verdict commit (SH13 camera; recorded in
RUN_RECORD phase 12). No judgement is pending when this brief
fires; cite "phase-12 cause 4" in your reply.

## The cause (ONE shot's camera line — SH16, in `scenes/film.js` SHOTS3)
Three readings, one mechanism (the shot's camera line):
1. **D2-CLEAR FAIL**: SH16's camera path intersects the town hall
   solid (audit box x ±4.5, z 9.5..18.5, top 6.4, world). Current
   line (COAST_VILLAGE offsets): pos [3.5,2.2,10.5] → [3.2,2.1,10.2]
   (world z 12.5→12.2, y ≈2.1) — the camera sits INSIDE the box for
   the whole shot.
2. **F1131 (t=37.70) FAIL**: villagers body 428px but corners 2/8 —
   the villagers (at COAST_VILLAGE+[-3,0,0.8]) are half out of
   frame during the quake beat (line 14: «الأرض اتهزت بزلزال عنيف»).
3. **F1155 (t=38.50) FAIL**: villagers face angle 33.4° (inside the
   limit) but the head is OUT of frame (221px) — the group does not
   read whole.
Invariant: **F1137 (t=37.90) PASS must stay PASS** (birds_sh16 in
frustum as they burst). The quake shake in Qwen's design is a
Camera-pass item recorded in RUN_RECORD — NOT part of this cause;
this cause is the static line only.

## Scope — camera only
Change ONLY SH16's camera (the SHOTS3 entry's from/to pos + target,
fov within [24,50]). Do NOT move any cast, prop, or other shot.
The beat: a wide street reads the quake — villagers whole in frame
(body corners + a face), birds bursting above them, the camera
itself standing somewhere physically possible. If no single line
satisfies all three readings, STOP and report the measured conflict
per reading.

## Verify + reply
Run `node --check scenes/film.js`, `node tools/audit_d1_d2.mjs`
(D2-CLEAR must now read PASS — no FAIL lines), and
`node tools/audit_staging.mjs` full. Paste: the new SH16 camera
values, the audit's F1131/F1137/F1155 lines, and a statement that
chunk 2 still reads 19/19 and no other chunk-3 moment changed.
Do NOT commit. Touch no other file.
