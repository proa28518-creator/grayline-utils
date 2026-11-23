# CODEX BRIEF — fudai-wall FIX #2a (phase 8): the staging audit tool

You are the code seat for the `fudai-wall` film (30 fps, 1080×1920). This is fix #2,
a METHOD change ordered by critic round 7 (RULES §3: the same fault twice means
change the method, not the amount). You build the measurement tool; a later brief
re-stages the film against it.

## Required reading (standing method — read these in-session, do not ask for them to be re-taught)
- `~/workspace/fudai-rebuild/studio/AGENTS.md` (authorship + form; where it conflicts
  with the run record's reconciliation, RULES.md + the owner's latest word govern)
- `~/workspace/Production and rules/RULES.md` §3, §4, §5
- `.suite/critic/CRITIC_PROTOCOL.md` §1–§3, §7, §7.1, §7.2
- `.suite/critic/CRITIC_REPORT_round7.md` (the verdict this fix answers)
- `lessons/build.md` (all of it — the loader laws and phase lessons live there)
- `tools/audit_d1_d2.mjs` (the existing driver audit: your tool sits beside it, same
  style: plain node, no deps, exit 0/1, failures printed one per line)
- Loader semantics sources: `lib/film/resolve.js` (resolver, resolveTimes, autoMove),
  `lib/film/end.js` (lowCams), `lib/stage.js` (propOpts + dropAt), `lib/film/props.js`
  (placeProp), `scenes/props/*.js` and `engine/props/sign.js` (prop geometry)

## The one deliverable
`tools/audit_staging.mjs` — a static staging audit. NO rendering. From scene data
alone it computes, for each of the 19 key moments below, whether the beat is actually
staged: (a) every named prop for the beat is inside the camera frustum and
unoccluded, (b) every required face is turned within ~60° of the camera with its
whole head inside the frame, (c) the shot's subjects actually occupy the frame
(not an empty panel). Run: `node tools/audit_staging.mjs` from the project folder.
Exit 0 = all 19 moments PASS; exit 1 = failures printed per moment, one line per
failed check, each naming the measured value (angle / px / corner count).

## Camera model — mirror the loader, do not approximate it away
- Build voice lines from `audio/clean.json` (words carry `line`, `start`, `end`;
  line start = first word's start, line end = last word's end). Resolve all time
  refs with `resolver` + `resolveTimes` imported from `lib/film/resolve.js`.
- Apply the loader's camera pipeline in its order: resolveTimes(shots) → lowCams →
  autoMove (import `autoMove` from resolve.js; dur = 68.08).
- lowCams (end.js) needs stage rests you cannot run; implement its documented rule
  with the calibrated body model below and LOG every raise you apply (shot, floor,
  old y → new y). Subject = standing character nearest the camera target at
  mid-shot; near = standing cast within 3 D of the subject;
  floor = min(max over near of hip + .5·(headTop − hip), subjectHeadTop − .3);
  raise any park pos / push from-to pos with y < floor to floor (skip shots with
  lowCam:true — none in chunk 2, but implement the skip).
- Sample the resolved camera at time t: for a push, u = (t − cam.t0)/(cam.t1 − cam.t0)
  over the RESOLVED (padded) interval, eased with `easeFn(cam.ease ?? 'outCubic')`
  from `engine/ease.js`; pos/target/fov lerp by the eased u. Park-converted shots
  arrive from autoMove already in push form. Ignore camera roll (SH07 rolls ≤5°;
  note it as an assumption in the header comments).

## Body model (calibrated — state it in the header comments with its evidence)
All chunk-2 cast share one build (legLen 1.35 in every cast JSON). Head centre
y = **1.9**, head radius **0.5**, hip y = **1.35**, head top = 2.4. Evidence: the
phase-6 driver measured the true head centre at ≈1.85–1.95 from the engine (the
film's MAYOR_HEAD 1.55 assumption is wrong); fleet frame F0 (target 1.55, dist
≈5.1, fov 34) passes with margin and fleet F687 (dist ≈2.9, fov 30) crops the
head — both are consistent with centre 1.9 / r 0.5 and inconsistent with 1.55.
- Character position at t: cast `at` [x,z]; acts walks move along `path` at
  `speed` (path points are absolute [x,z]); before the walk, at path[0]; after,
  at the last point.
- Facing at t: if walking, the current segment's heading; else if an acts `look`
  key governs (last key ≤ t), the horizontal direction from the head to that
  key's `at`; else the cast entry's `ry`. Facing vector for ry: [sin(ry°), 0, cos(ry°)].
- Head sphere: centre [x, 1.9, z], r 0.5. Body box (for "in frame" extras):
  centre [x, 1.0, z], size [0.9, 2.0, 0.5].

## Prop state at t — mirror the renderer (lib/stage.js propOpts), including its trap
- Visibility/position: from the resolved prop keys — visible iff the last key ≤ t
  carrying `in` says 'world' (entry default 'world'); position = last `at` ≤ t
  (else the entry `at`); rotation = last `rot` ≤ t (else entry `rot`).
- **Effective build opts (the trap, proven from stage.js):** a key-driven numeric
  field (calendar `page`, measure `h`, gateleaf `lift`, blueprint `lineY`/`pin`,
  orb `cx`/`cy`) only takes effect on screen if the field is ALSO declared in the
  prop entry's top level. If absent from the top level, the rendered value is the
  kind's build default forever (page 0, h .8, lift 0, lineY 1, pin 0, cx 0, cy 12),
  whatever the keys say. When declared, the effective value follows the keys:
  snap at the key, or with `ease: s` a smoothstep from the previous value over s
  seconds (stage.js's rule; values quantize to 1/40 — ignore the quantization).
  Your audit MUST use these effective values. (This is why the calendar reads "1"
  and the measure never climbs: the keys were authored but never declared.)
- Coins: model stage.js `dropAt` closed form (from/v0/g/ground; hidden after
  landing, hide:true).

## Prop boxes (local geometry from the kind files; origin at the entry `at`)
- `sign` — NOTE: kind 'sign' renders via `engine/props/sign.js` (engine resolution
  order shadows scenes/props/sign.js). Board: centre at + [0, 1.25 + h/2, 0]
  (the engine's `up` default 1.25; entries pass no `up`), size [w, h, .1], front
  +z, yaw = rot[1] if any.
- `calendar`: centre at + [0, 1.9, 0], size [2.2, 3.5, .2].
- `measure`: glow column centre at + [0, effH/2, 0] size [.15, effH, .15]; label
  plate centre at + [.32, full, 0] size [1.35, .42, .1] (full = entry `full` ?? 18);
  arrow tip at + [0, effH, 0].
- `crane`: box centre at + Ry(rot)·[2, 8, 0], size [11.5, 16.8, 1.2] (rotate the
  box by the entry yaw); hook point at + Ry(rot)·[8.8, 11.9, 0].
- `money`: centre at + [0, .55, 0], size [3.7, 1.15, 2.1].
- `gateleaf`: centre at + [0, 17.88·(effLift − .5), 0], size [7, 17.88, .36].
- `seawall`: centre at + [0, 9, 0], size [90, 18, 1.15]; gate panel centre
  at + [0, 8.94, .62], size [7, 17.88, .55].
- `blueprint`: board centre at + [0, 1.7, 0], size [3.4, 3.4, .2]; glowing line
  point at + [.15, .75 + effLineY·1.9, .12]; palm point at + [1.42, .75 + effLineY·1.9, .13];
  ruler (only exists when effPin ≥ 1): centre at + [1.28, 1.7, .14], size [.18, 2.05, .07];
  label plate at + [1.3, 2.82, .14], size [.9, .28, .06].
- `orb`: disc centre = at + [effCx, effCy, 0], sphere r = entry `r`.
- `coins`: box size .5 at the dropAt position (only while visible).
- Set pieces as subjects: neighbour low wall = box centre [600, 6, −10], size
  [24, 12, .8] (set.js NEIGHBOR_COAST stone box); neighbour houses = boxes at
  [580|600|620, 2.1, 8], size [4, 4.2, 3.5]; sea patch = box centre [0, 0, −30],
  size [30, .1, 20].

## Frustum + occlusion math
- Frame 1080×1920. Vertical fov from the sampled camera; horizontal half-angle =
  atan(tan(v/2) · 1080/1920). Build the 4 side planes + near/far from pos/target/fov.
- Point in frustum: inside all planes. Box: count corners inside (use the box's
  world AABB after yaw rotation). Sphere fully inside: distance from centre to
  every plane ≥ r. Projected px height of a box/sphere: angular height ÷ vertical
  fov × 1920 (use the centre distance).
- Occluders: the D2-CLEAR building solids (copy the list from
  tools/audit_d1_d2.mjs, cite it) + the seawall box + the gateleaf box (effective
  lift). A subject point is occluded if the segment camera→point crosses an
  occluder (other than the subject's own prop) strictly before reaching it.
- Checks per subject kind:
  - PROP: centre in frustum AND ≥4/8 corners in frustum AND centre unoccluded
    AND projected height ≥ the moment's minPx.
  - FACE: facing-to-camera angle ≤ 60° AND head sphere fully in frustum AND
    head centre unoccluded AND (where the moment names a size) projected head
    height ≥ minPx.
  - BODY (extras in frame): body-box centre in frustum AND ≥4/8 corners in.
  - POINT (wall top, line, palm, hook): in frustum AND unoccluded.
  - OCCUPANCY per moment: at least one required subject with projected height
    ≥ 12% of 1920 px, else FAIL "subjects do not occupy the frame".

## The 19 moments (frame, t = frame/30, shot, requirements)
- F219 t7.30 SH04: FACE mayor. BODY ≥2 of {villager_1..6, mocker_a/b/c}.
- F241 t8.03 SH04: FACE mayor. PROP popsign (minPx 60). BODY ≥2 villagers/mockers.
- F288 t9.60 SH05: PROP crane_a or crane_b (minPx 120). PROP money (minPx 60).
  PROP moneysign (minPx 60).
- F345 t11.50 SH05: PROP calendar (minPx 120) AND calendar effPage ≥ 5 (report
  the effective page). PROP seawall gate panel (minPx 200).
- F414 t13.80 SH05: PROP measure label plate (minPx 40) AND measure effH ≥ 17.
  PROP calendar (minPx 120) AND effPage ≥ 10. gateleaf effLift ≥ .9 (report it).
- F474 t15.80 SH06: PROP neighbour low wall (minPx 150). PROP sticker_a (minPx 60).
  PROP sticker_b (minPx 60). BODY/SET ≥1 neighbour house in frame (box rule).
- F537 t17.90 SH07: FACE mocker_a (minPx 200 — it is a big close-up).
- F570 t19.00 SH07: head of mocker_a in frustum (sphere intersects, centre in
  frustum). POINT wall top [3, 18, −16] in frustum.
- F590 t19.65 SH07: PROP coins (minPx 24). POINT wall top [2, 18, −16] in frustum.
- F621 t20.70 SH08: FACE ≥2 of {mocker_a, mocker_b, mocker_c, villager_2, villager_4}.
- F639 t21.30 SH08: FACE ≥2 of the same set.
- F669 t22.30 SH09: FACE mayor (minPx 250).
- F687 t22.90 SH09: FACE mayor (minPx 200).
- F711 t23.70 SH10: PROP blueprint board (minPx 150). POINT blueprint line point.
  POINT blueprint palm point.
- F723 t24.10 SH10: PROP blueprint board (minPx 150). PROP blueprint ruler
  (minPx 60; fails if effPin < 1 — the ruler does not exist). PROP blueprint
  label plate (minPx 40).
- F768 t25.60 SH11: PROP seawall (minPx 300). PROP sea patch (box rule, minPx 40).
  ORB sunorb in frustum + unoccluded.
- F798 t26.60 SH11: same as F768 (sunorb at its dusk keys).
- F822 t27.40 SH11: PROP seawall. PROP sea patch. ORB moonorb in frustum + unoccluded.
- F870 t29.00 SH12: PROP mocksign (minPx 80). BODY ≥2 of {mocker_b, mocker_c,
  villager_1, villager_3} (the passers-by).

## Hard limits
- You write ONLY `tools/audit_staging.mjs`. No scene, engine, lib, or set changes.
- Pure node (node: imports only), deterministic, no rendering, no network.
- The tool must be honest: where the loader's real behaviour cannot be mirrored
  exactly (lowCams rests, roll, face-limit clamping), say so in the header
  comments as named assumptions — never silently.
- Finish with a short summary: the tool's path, how to run it, and its full
  output on the CURRENT film (paste the per-moment table you got).
