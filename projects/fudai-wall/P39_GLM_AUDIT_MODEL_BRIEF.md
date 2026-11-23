# BRIEF — Phase 39: correct the staging audit's model to the engine's measured model (GLM seat)

You are the GLM seat (free/glm-5.3-flashx) authoring ONE change to ONE file:
`tools/audit_staging.mjs` in the Fudai Wall project (a static staging audit; pure Node).
The driver operates and verifies; you author. Output: ONE unified diff for that file, nothing else.

## Why (RUN_RECORD phase 38, measured on fleet tracks reading the engine's own pv)

The audit models a state the engine does not hold, in three named seams:

1. **Rests seam.** Both pipelines run the same `lowCams` (lib/film/end.js), but the engine
   feeds it STAGE-MEASURED rests while the audit reconstructs rests from the cast spec JSON
   (hipY = legLen*.93 = 1.256, headY = hipY + neckHeight + neckToHead = 1.956). The engine
   rests are a UNIFORM +0.354 offset: hipY 1.610 / headY 2.310 (hip-to-head span 0.700,
   identical in both models). Two-point exact fit: with engine rests, lowCams reproduces
   the engine's measured camera floors EXACTLY — SH18 floor 1.617 (head-bound on the
   walking villagers_shore), SH19 floor 1.960 (chest-bound on the standing mayor_young).
   The audit currently floors those shots at 1.263 / 1.606.
2. **Wave built geometry.** The wave kind (scenes/props/wave.js) builds its body as a box
   of size (w, h, 24) positioned at (0, h/2, -12+advance) relative to the entry origin, so
   the BUILT body centre = at + (0, h/2, -12+advance), where the build height is
   h = min(17.5, crestY ?? h ?? 17.5) and w = w ?? width ?? 70, with h / crestY / advance
   resolved from the entry's keys at the sampled time. The audit instead models each wave
   as a box CENTRED AT THE ENTRY POINT with a fixed declared size (CHUNK3_SIZE), never
   tests whether the camera is inside a prop body, and waves are absent from its
   face-occluder list. Measured consequence (phase 37/38): at SH19 the sampled cameras
   sit INSIDE wave_old_sh19's built body (entry at [1191,-1.5,-17], w 14, h 5->8,
   advance 0->4.5; built centre [1191, 1.0..2.5, -29..-24.5]) — the render shows the
   wave body's inner wall, and the audit passed the staging.
3. Phase 38's engine-pv verdicts that must NOT flip on the baseline tree: SH19 F1367
   mayor head IN (face PASS), F1410 head OUT (FAIL), F1428 OUT (FAIL); SH18 F1302
   measure centre OUT (FAIL stands).

## The four changes (confined to tools/audit_staging.mjs)

### Change 1 — engine rests
In the character reconstruction (the `characters` map), the reconstructed rest must carry
the engine's stage-measured offset: hipY becomes legLen*.93 + .354 and headY follows from
it (headY is computed as hipY + neckHeight + neckToHead, so the +0.354 flows through and
the span stays 0.700). Add a comment at that spot citing RUN_RECORD phase 38 (engine rests
hipY 1.610 / headY 2.310 = spec reconstruction + 0.354, two-point exact fit on the SH18 /
SH19 floors). Also update the header comment's "Named assumptions" sentence, which today
says stage-dependent lowCams rests are unavailable — they are now measured constants.

### Change 2 — wave built-body helper
Add a helper `waveBody(p, t)` near `propState`. It returns null unless p.kind === 'wave'
and the wave is VISIBLE at t. Visibility: the last key at-or-before t that carries a
`hidden` field governs; if no such key, the entry-level `hidden ?? false` governs; hidden
=> null. Resolve keyed numeric fields with the SAME step semantics as propState's inner
`val()` (last key at-or-before t carrying the field wins; entry top-level is the default;
an `ease` on the governing key ramps smoothstep from the previous keyed value over `ease`
seconds — reuse that logic, do not invent a second resolver). Fields: h (default from
entry), crestY (may be absent => null), advance (default 0). buildH = Math.min(17.5,
crestY ?? h ?? 17.5). w = p.w ?? p.width ?? 70 (top-level only in this film). The position
`at` comes from propState(p, t).at. Return the existing box() AABB:
box([at[0], at[1] + buildH/2, at[2] - 12 + advance], [w, buildH, 24]) — i.e. an object with
center/min/max/size like box() returns.

### Change 3 — waves as occluders
In `occs(t)`, after the gateleaf block, append every wave entry's built body when
waveBody(p, t) is non-null: out.push({ name: p.id, ...body }). (occluder() and the
chunk-2 camera-inside check read occs(), so this one addition makes waves face occluders
and containment solids everywhere occs() is consulted.)

### Change 4 — chunk-3 loop: built-body wave checks + camera-inside-wave FAIL test
(a) In the chunk-3 moments loop, retain the sampled camera (today the loop builds
`fr` from camAt(shot, t) without keeping the camera object). Immediately after the
missing-shot handling, for every chunk-3 moment: test whether the sampled camera
position lies inside any visible wave built body (strict AABB containment on all three
axes, NO margin). If inside, push a check line of the form
`camera inside <propId> built body FAIL` (it must contain the word FAIL so the moment
fails, and name the body). Push it into the moment's checks BEFORE the type branches
run, so every branch (including the early-pushing occupancy/cast branch) carries it.
(b) In the generic prop branch (type 'prop'/'state'/'occupancy'/'crest'), when
p.kind === 'wave' and waveBody(p, t) is non-null, the check must use the BUILT body:
center = body.center, size = body.size — instead of center = s.at and
size = CHUNK3_SIZE[id]. When waveBody is null, keep today's behaviour exactly.

### Header attribution (required)
Add one line to the file's header comment block, following the existing phase-header
pattern:
`// Phase-39 P39_GLM_AUDIT_MODEL_BRIEF.md (GLM seat): audit model corrected to the engine's measured model per RUN_RECORD phase 38 — engine rests (+0.354), wave built-geometry bodies, camera-inside-wave FAIL test, waves as face occluders.`

## Acceptance anchors (the driver will verify these on the baseline tree)
- The LOWCAMS log shows SH18's shot (subject villagers_shore) raised to y 1.62 and
  SH19's shot (subject mayor_young) raised to y 1.96.
- Baseline verdicts unchanged: F1367 face PASS; F1410 FAIL; F1428 FAIL; F1302 FAIL.
- Baseline containment: F1367 gains a `camera inside wave_old_sh19 built body FAIL`
  line; F1410 and F1428 gain NO containment line.
- On the phase-37 candidate tree (a different film.js, applied later by the driver),
  F1367, F1410 and F1428 must EACH gain the containment FAIL line for wave_old_sh19.

## Output format
Reply with ONLY a unified diff (git format, --- a/tools/audit_staging.mjs,
+++ b/tools/audit_staging.mjs) that applies cleanly to the file below. No prose.

## The current file, verbatim:
```js
