# FIX #2a-2 — CORRECT tools/audit_staging.mjs (one file only)

You wrote `tools/audit_staging.mjs` in the previous session. The driver verified it
against rendered fleet stills (ground truth) and found systematic defects. Fix the
TOOL only — still no scene/engine/lib/set edits. Required reading (standing method,
do not re-derive): studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md`
§3/§4/§5; `.suite/critic/CRITIC_PROTOCOL.md` §7/§7.1/§7.2; `lessons/build.md`;
`lib/film/resolve.js` (`autoMove`), `lib/film/end.js` (`lowCams`), `lib/stage.js`
(`shotFn`, `propOpts`), `engine/camera_moves.js` (`push`/`park`).

## Defect 1 (proven, primary) — frustum plane normals are wrong
Your `makeFrame` builds each side plane's "normal" as `norm(f + axis·tan(ang))` —
that is the frustum EDGE-RAY direction, not the plane normal. Testing
`dot(d, n) >= 0` against it accepts a cone far wider than the real frustum, so the
tool passes subjects the renderer crops. Correct construction: each side plane
passes through the camera position; its inward normal is perpendicular to the
edge ray, in the plane spanned by `f` and the axis — e.g. for the right plane,
`n = norm(cross(edgeDir, up))` with the sign chosen so `dot(n, f) > 0`
(edgeDir = norm(f + right·tan(h/2))); analogously for left/top/bottom. Point test:
`dot(p - pos, n) >= 0` for all four planes plus near/far along `f`. Sphere test:
`dot(c - pos, n) >= r` for all four planes plus near/far.

## Defect 2 — replicate the loader pipeline by IMPORTING it, not by summary
- Camera interval/easing: the renderer samples the RESOLVED shots. Apply the real
  `autoMove` (imported from `lib/film/resolve.js`) to the shot list before
  sampling — it pads push intervals (outCubic: end-pad only, to overshoots by
  1/(kb−ka)) and converts parks to inOutSine drifts. Your unpadded sampling put
  cameras measurably behind the renderer's.
- `lowCams`: import `lowCams` from `lib/film/end.js` and call it with the resolved
  shots, the film's characters, and rests built from the cast spec proportions
  (hip = spec hip height, head = hip + hh(rest) per `engine/clips.js`) — do not
  re-implement the formula from prose. Keep printing every raise it makes.
- Sampling itself follows `engine/camera_moves.js` `push`/`park` semantics on the
  padded camera objects (lerp of pos/target/fov with the shot's ease).

## Defect 3 — occlusion verdicts must name the occluder
Every "occluded" result prints WHICH box blocks the centre ray (e.g.
`occluded by seawall`). The subject's own box never counts as its occluder.

## Defect 4 — disc subjects (orbs) and degenerate projections
Test orbs as centre point + radius via the sphere test (not as a box). A subject
behind the camera reports `behind camera`. Projected height is only printed when
depth > 0.

## Defect 5 — F590 coins diagnostics
Print the resolved drop-start time (from the coins entry's drop key) and the
coin's computed position at the moment, so the visibility verdict can be checked
against `audio/clean.json` by hand.

## Regression anchors — on the CURRENT (unmodified) film the corrected tool MUST
reproduce these rendered facts (fleet stills in `~/workspace/fudai-rebuild/probes/`):
- F241: popsign FAIL (out of frame, above the top plane); BODY framed count < 2 →
  FAIL; mayor face PASS.
- F474: sticker_a FAIL and sticker_b FAIL (corners < 4/8 in frame); neighbour
  houses FAIL.
- F570: mocker_a head centre FAIL (out of frame, below the bottom plane).
- F687: mayor face FAIL (head sphere not fully inside the frame).
- F537: mocker_a face FAIL with angle ≈ 180° (already correct — must stay).
- F345/F414: calendar effPage 0 FAIL, measure effH 0.8 FAIL, gateleaf effLift 0
  FAIL (already correct — must stay).
- F219/F669/F711/F870 may keep their current verdicts if the corrected geometry
  still supports them; if any flips, say so explicitly in your summary and why.

## Output
Same table format as before, plus the LOWCAMS raise log and the new diagnostics.
Exit 0 only if all 19 moments pass (they will not yet — exit 1 with the corrected
BEFORE table is the expected result of THIS session).

## When done, print
1. What you changed in the tool, defect by defect.
2. The anchor check: each anchor above, reproduced or not.
3. The tool's full corrected output on the current film.
