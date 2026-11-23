# CODEX SEAT — BRIEF · phase 12 · cause 6: SH14 camera — the distant wall enters the frame

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4 (camera grammar: sampled fov ∈ [24,50], camera never
inside a solid). **NO LOCAL RENDERS. No fleet dispatch. Iterate
against the audits only** (`tools/audit_staging.mjs` — its sampled
readings are the ground truth; lowCams/autoMove intervene, so never
trust a hand projection the audit does not reproduce).

## Previous verdict this brief cites (hard-gate requirement)
The phase-12 cause-5 verdict commit (SH16 camera; recorded in
RUN_RECORD phase 12). No judgement is pending when this brief
fires; cite "phase-12 cause 5" in your reply.

## The cause (ONE moment — SH14's F1056, in `scenes/film.js` SHOTS3)
**F1056 (t=35.20) FAIL**: `wall_distant_sh14` out of frustum (357px
— large enough, but its centre is outside the frame). The beat
(line 12: «بعد موته بـ 14 سنة»): at the hill grave, the eye lifts
from the gravestone to the horizon, where the seawall he built
stands distant — the silhouette at HILL_GRAVE+[0,0,-140] is SETTLED
staging (Layla accepted Qwen's 140 D horizon silhouette; causes 2
closed the bounds question). It simply never enters SH14's frame:
the current line runs from HILL_GRAVE+[2.6,0.9,5.2] (target
[0,1,0]) to [2.2,3.4,6.4] (target [0,1.2,-2]).
Invariants: **F993 (gravestone 692px) and F1026 (leaf 75px) PASS
must stay PASS** — the shot opens on the grave; only its later aim
may change.

## Scope — camera only
Change ONLY SH14's camera (the SHOTS3 entry's from/to pos + target,
fov within [24,50]). Do NOT move the silhouette, the gravestone,
the leaf, any cast, or any other shot. If no line holds the grave
early AND the horizon centre late, STOP and report the measured
conflict — do not move the settled silhouette to force it.

## Verify + reply
Run `node --check scenes/film.js` and `node tools/audit_staging.mjs`
full. Paste: the new SH14 camera values, the audit's
F993/F1026/F1056 lines, and a statement that chunk 2's lines are
unchanged and no other chunk-3 moment changed. Do NOT commit.
Touch no other file.
