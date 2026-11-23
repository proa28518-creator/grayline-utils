# FIX #2b — RE-STAGE chunk 2 (SH04–SH12) against the staging audit

The method change (fix #2) in one line: staging is no longer hand-tweaked against
renders — you re-stage `scenes/film.js` until the COMPUTED audit passes every key
moment. Required reading (standing method — briefs carry the delta only): studio
`AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3/§4/§5;
`.suite/critic/CRITIC_PROTOCOL.md` §1–3, §7, §7.1, §7.2;
`.suite/critic/CRITIC_REPORT_round7.md` (the faults being fixed); `lessons/build.md`;
`tools/audit_staging.mjs` + `tools/audit_d1_d2.mjs` (your gates);
`lib/stage.js propOpts` (the key-driven-opt trap, below); `scenes/BIBLE.md`.

## Scope — hard limits
- Edit ONLY `scenes/film.js`. (One exception: you may extend
  `tools/audit_staging.mjs` PRINTOUT ONLY — every FAILed check must say which
  sub-condition failed: centre-out / occluded-by-<name> / px / corners / state.
  No change to any check's logic or threshold.)
- SH01–SH03 shot entries stay byte-identical (the opening is critic-passed).
- No engine / lib / set.js / cast-spec / script / audio changes. Positions stay
  PLACES-derived `add(...)` expressions (D2). Cast `at`/`ry`, acts/look keys,
  camera consts, prop `at`/`keys` and prop entry fields in film.js are yours to
  re-stage.
- The film-local `sign` kind rename is NOT this round — the foreign
  "RED CANYON SHORT LINE" subtitle is a known fault with its own future round.
- Iterate: `node tools/audit_staging.mjs` must exit 0 (19/19) AND
  `node tools/audit_d1_d2.mjs` must still PASS. Both, not either.

## The prop-opts trap (why the beat props never moved)
`lib/stage.js propOpts`: a key-driven numeric build opt takes effect only if the
field is ALSO declared in the prop entry's top level; otherwise the build default
renders forever. Unlock, by declaring the initial value in the entry top level:
calendar `page`, measure `h`, gateleaf `lift`, blueprint `lineY` + `pin`,
sunorb/moonorb `cx` + `cy`. The keys already carry the motion (calendar to 12,
measure h to 18, gate lift to 1, blueprint lineY to 1 + pin 1, orbs traversing) —
declaration is what has been missing. Audit state checks (effPage / effH /
effLift / effPin) verify each unlock.

## Per-shot staging deltas (from the corrected audit + round-7 BLOCKING)
- SH04 (F219/F241): mayor face already passes. Frame the popsign at F241
  (>=60px, in frame — it hangs high at [0,8.5,-2] while the shot targets y1.6)
  and >=2 villager/mocker bodies at both moments, without losing the mayor's
  face. Re-aim, pull back, or move the sign/crowd — the audit decides.
- SH05 (F288/F345/F414): money + moneysign and the calendar are OCCLUDED by
  named village houses from the gliding camera line; clear the sight lines
  (camera line/targets and/or prop placement). Unlock calendar page (effPage
  >=5 at F345, >=10 at F414), measure h (effH >=17 at F414, its label plate in
  frame >=40px), gateleaf lift (effLift >=.9 at F414). Keep the seawall gate
  panel >=200px at F345 and a crane framed at F288.
- SH06 (F474): centre the neighbour coast — BOTH stickers pass (centres in,
  >=60px) and >=1 neighbour house framed; the low wall already passes.
- SH07 (F537/F570/F590): mocker_a's FACE to camera at F537 (angle <=60°, head
  fully in, >=200px) — his facing comes from cast ry + the look key toward the
  wall top; re-stage so the mockery reads face-on. At F570 his head centre is
  in frame AND the wall-top point is in frame. At F590 the falling coins
  (drop start 19.50s, position ~[2.1,19.7,-17.5]) are framed >=24px AND the
  wall-top point is in frame AND occupancy clears (a passing subject >=230px —
  the coins at >=230px is the reliable route: end the pull-back close enough
  to the wall top).
- SH08 (F621/F639): >=2 faces framed AND facing <=60° at BOTH moments, plus
  occupancy. The mockers currently face 118–179° away (cast ry 180/165/195 +
  look at the mayor). The natural staging: they laugh AT the mayor — put the
  camera on the mayor's side looking back at the group, and/or turn the group.
- SH09 (F687): the push ends too close — the mayor's head (1183px) overflows
  the top. End farther back / re-aim so the whole head is in at F687 with the
  face >=230px (occupancy), keeping F669 >=250px.
- SH10 (F711/F723): the board passes (overflow). Bring the dragged-line point
  and the palm point into frame at F711 (they ride at board-local y
  .75+lineY*1.9 once lineY is unlocked), and at F723 the ruler (unlock pin)
  >=60px and the label plate >=40px in frame.
- SH11 (F768/F798/F822): the camera sits over the sea looking back at the wall,
  so both orbs are BEHIND it. Re-stage from the village side looking seaward:
  seawall framed >=300px, the sea patch framed, and the sun/moon orb (unlock
  cx/cy) in frame and unoccluded at all three moments.
- SH12 (F870): the sign passes; frame >=2 of {mocker_b, mocker_c, villager_1,
  villager_3} passing below it — the cast currently stands ~15 D behind the
  camera. Widen/pull back or reposition the shot's geography (cast `at` moves
  must keep SH04/SH08 moments passing — all 19 moments are one system).

## Method discipline
- Any lesson you learn the hard way goes into `lessons/build.md` in this same
  session (append, dated 2026-11-23, phase 8) — the next seat starts from the
  accumulated method, not from zero.
- If a moment seems impossible under the audit's stated checks, say so in your
  summary with the measured conflict — do not weaken a check, do not touch the
  audit's logic, do not hand-wave.

## When done, print
1. Both tools' full final outputs (staging 19/19 PASS + D1/D2 PASS expected).
2. A per-shot list of what you changed in film.js (cameras / targets / fovs /
   cast ry or at / look keys / prop declarations, at, keys).
3. Any lesson lines you appended to lessons/build.md.
4. `git diff --stat` for the repo.
