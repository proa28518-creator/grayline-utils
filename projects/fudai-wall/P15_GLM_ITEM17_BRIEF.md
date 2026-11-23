# GLM SEAT — BRIEF · phase 15 · item 17: SH04 option (iii) — crowd arc cast staging facing the mayor

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your lines verbatim and judges them with the project's measured
checkers. RULES §3: one cause, one change. **NO LOCAL RENDERS** —
you return text only; the driver runs the audits and the fleet
probes. Do not invent mechanics: the only levers in this cause are
cast `place` keys and cast `look` keys in `scenes/film.js`'s acts,
in the exact format specified below.

## Previous verdict this brief cites (hard-gate requirement)
Commit `7544fdc` — phase 15 boat ROT restoration CLOSED (the
previous queue item). No judgement is pending; this brief may fire.

## Governing ruling (Layla, phase 15, ruling 1)
The governing checkers for this item are the project's standing
measured checkers — the staging audit (which imports the real
pipeline) + the pixel gate + eye. The Hermes/Mistral input
(`HERMES_SH04_OUT.md`) is tested THROUGH the staging audit: its
candidate values may be used only insofar as the audit's own
readings confirm them; where they disagree, the audit governs and
the disagreement is recorded. Section "THE HERMES TEST" below is
part of your reply, not optional.

## The cause (ONE mechanism: SH04's crowd staging, closure 5 — option (iii))
SH04 (line 3, t 7.06–8.89; judged at F219 t=7.30 and F241 t=8.03)
is the mayor's announcement in the village square. The camera is
FIXED for this cause (cast staging, NOT a camera round — three
camera families are exhausted on this shot): static pos
[-5.00, 3.50, 9.00], target [0.00, 1.50, 1.00], fov 50.
The mayor stands at [0, 2] (x,z) and does NOT move; his head
projects to screen [665, 909], 252px, face angle 35.5° — and he is
not identifiable as the lead, because the crowd staging around
him is a scatter. Spread the crowd into an ARC FACING THE MAYOR
so he is compositionally privileged: his head alone in a clear
upper-middle region, the crowd flanking him lower and to the
sides, every staged member facing him, no foreground face cut by
a frame edge (§4).

## Measured baseline (driver's own probe of the audit's math on HEAD 7544fdc — reproduce the key lines in your reply)
At both F219 and F241 (camera static; readings identical):
- mayor: pos [0, 2], head screen [665, 909], head 252px, face angle 35.5°, body corners 8/8.
- villager_1: base [-1, 4], ry 0 — head screen [773, 1037], head 335px, corners 8/8 (whole, larger than the mayor, close beside him).
- villager_2: base [1, 4], ry 0 — head screen [1201, 967], head 289px, corners 2/8 — **head centre OFF the right frame edge: this is the §4 edge-cut foreground face.**
- villager_3: base [-2, 6], ry 20 — head screen [989, 1293], head 501px, corners 3/8, face angle 65.0° — **a huge turned-away foreground head dwarfing the mayor.**
- mocker_a: base [4, 0], ry 0 — head screen [1013, 794], head 176px, corners 7/8.
- mocker_b: base [4, -1], ry 180 — head screen [901, 777], head 165px, corners 8/8, face angle 138.0° — **back to camera.**
- mocker_c: base [6, 0.5], ry 180 — head screen [1299, 781], head 168px, corners 0/8 — head off the right edge; back to camera (127.7°).
- villager_4 [5, 7], villager_5 [-8, 5], villager_6 [10, 6]: fully out of frame at both moments (0/8, centres out) — **DO NOT TOUCH them.**
- Audit verdicts now: F219 PASS (mayor face PASS; BODY PASS 3/2), F241 PASS (mayor face PASS; popsign PASS 359px corners 8/8; BODY PASS 3/2). Chunk 2 audit total 17/19 (two documented model gaps, judged closed by gate+eye in phase 11 — not this cause's business); chunk 3 19/40; D1/D2 FAIL (2) (SH13 + SH16 D2-CLEAR only).

## What you author (the ONLY changes; all inside `acts` in scenes/film.js)
For EACH of villager_1, villager_2, villager_3, mocker_a, mocker_b,
mocker_c:
1. A `place` array (create it if the member has none; PREPEND to
   the existing array if he has one — mocker_a/b/c have line:24
   entries, mocker_c also has line:8 entries; every existing entry
   stays byte-identical):
   - `{t:'line:3.start',at:[X,Z]}` — his arc position (see below).
   - `{t:'line:3.end',at:[baseX,baseZ]}` — his exact base from the
     table above (the window closes; bases restored exactly).
2. A `look` array (same create/prepend rule; existing entries
   byte-identical):
   - `{t:'line:3.start',at:[0,1.9,2]}` — he faces the mayor's head.
   - `{t:'line:3.end',at:[RX,1.9,RZ]}` — restore: a point 5 units
     from his restored base along his own cast ry, i.e.
     [baseX + 5·sin(ry), 1.9, baseZ + 5·cos(ry)] with ry in degrees
     from the table (villager_1 ry 0 → [-1,1.9,9]; villager_2 ry 0
     → [1,1.9,9]; villager_3 ry 20 → [-0.29,1.9,10.70];
     mocker_a ry 0 → [4,1.9,5]; mocker_b ry 180 → [4,1.9,-6];
     mocker_c ry 180 → [6,1.9,-4.5]).
Format notes: `place` `at` is a 2-element [x,z] array of plain
numbers (the item-15 pattern: `{t:'line:8.word:5',at:[4.4,-2.0]}`);
`look` `at` is a 3-element [x,y,z] array of plain numbers. Round
to at most 2 decimals. Nothing else in any acts entry changes:
face/clips/walk arrays stay byte-identical, members not listed
stay untouched, the mayor stays untouched, no camera/prop/set
line moves.

## Current acts lines (verbatim; your reply returns each line whole, with ONLY the place/look arrays changed as specified)
```
 mocker_a:{place:[{t:'line:24.start',at:[p('HILL_GRAVE',[-.95,0,-.60])[0],p('HILL_GRAVE',[-.95,0,-.60])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:6.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:7.end',eyes:'open',brow:'up',mouth:'smile'}],clips:[{clip:'point',at:'line:6.word:3',params:{dir:[3,18,-16]}},{clip:'point',at:'line:6.word:8',params:{dir:[3,19,-40]}}],look:[{t:'line:6.word:3',at:WALLTOP},{t:'line:6.word:8',at:[2,19.5,-17.5]},{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
 mocker_b:{place:[{t:'line:24.start',at:[p('HILL_GRAVE',[.95,0,-.60])[0],p('HILL_GRAVE',[.95,0,-.60])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-5,-6],[-5,-8],[-5,-8]],speed:5}],look:[{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
 mocker_c:{place:[{t:'line:8.word:5',at:[4.4,-2.0]},{t:'line:8.end',at:[6,.5]},{t:'line:24.start',at:[p('HILL_GRAVE',[0,0,-1.30])[0],p('HILL_GRAVE',[0,0,-1.30])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-4,-6],[-4,-8],[-4,-8]],speed:5}],look:[{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
 villager_1:{walk:[{t0:'line:9.start',path:[[-6,-5],[-6,-7],[-6,-7]],speed:5}]},
 villager_2:{face:[{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:7.end',eyes:'open',brow:'up',mouth:'smile'}]},
 villager_3:{walk:[{t0:'line:9.start',path:[[-3,-6],[-3,-8],[-3,-8]],speed:5}]},
```
Array order in your returned lines: put `place` FIRST and `look` LAST in each entry (the file's existing convention for mocker_a/b/c); for villager_1/3 the order is place, walk, look; for villager_2: place, face, look. The two new entries go at the FRONT of each place/look array (before the existing entries).

## The arc (your design, inside these measured constraints)
- Centre: the mayor at [0, 2]. Radius 4.2–5.8 for every member.
- All members on the camera side: z ≥ 2.5.
- The camera→mayor sightline runs from [-5, 9] to [0, 2]; no
  member within 1.2 units of that segment (the arc's middle stays
  empty — the mayor reads alone in the centre).
- Members spread ≥ 2.0 units apart from each other.
- Every member's head FULLY in frame under the standing camera
  (the driver's probe re-measures your values before application):
  head screen x within [170, 910], head-top screen y ≥ 40, and no
  member's head larger than 460px (villager_3's current 501px
  foreground dominance must not recur).
- No member inside the mayor's screen column unless clearly below
  him: if a member's head screen x is within 200px of the mayor's
  665, his head-top y must be ≥ 942 (150px below the mayor's
  head-top 792).
- Stay clear of the set solids (automatic at this radius: town
  hall z ≥ 9.5, nearest house ≥ 8 away — do not exceed radius 5.8).

## THE HERMES TEST (reply section, mandatory)
Hermes/Mistral's input proposed, for its own camera round:
CROWD arc centred [0, 0, -5] (village-relative; world [0, -3]),
villager head-tops below y=600px, and a CHECK of the mayor's head
at x[370,710] y[650,1000]. State, per value, AGREE or DISAGREE
with one measured reason each, from the baseline above and the
standing camera (NOT Hermes' camera). Known bearings: an arc
centred at world [0, -3] sits BEHIND the mayor (wall side) —
members there face the mayor with their backs to this camera
(the mocker_b 138° fault); head-tops below 600px would sit ABOVE
the mayor's own head-top (792) in this frame. Your authored arc
is governed by the audit, not by Hermes; this section records the
test, it does not bind your values.

## Expected readings after your change (the driver verifies)
- Audit: F219 + F241 mayor face PASS, BODY PASS (count ≥ 3),
  popsign PASS at F241; EVERY other audit line's verdict
  unchanged (chunk 2 17/19, chunk 3 19/40, D1/D2 FAIL (2)).
- Driver probe of your values (before application): all six
  staged heads satisfy the frame constraints above.

## Reply format (exact)
1. BASELINE RESTATED: the mayor's line + the three fault lines (villager_2, villager_3, mocker_b), in your own words.
2. ACTS LINES: for each of the six members, the member's complete replacement acts entry (the whole `id:{...}` line as it should stand in film.js), verbatim, pasteable. If the member's current entry is one line, return one line.
3. ARC TABLE: per member — arc [x,z], radius from [0,2], and your projected head screen + head px under the standing camera (show the projection inputs you used).
4. HERMES TEST: the three values, AGREE/DISAGREE + reason each.
5. PREDICTED READINGS: F219, F241, chunk totals, D1/D2.
Nothing else. Do not claim you ran anything.
