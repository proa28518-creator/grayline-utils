# CODEX BRIEF — fix #2 close-out 4: spread the stacked mockers (Opus hunt BLOCKING)

Required in-session reading first (standing method): studio `AGENTS.md`, `.suite/critic/CRITIC_PROTOCOL.md` §3/§4/§7, `lessons/build.md`, `tools/audit_staging.mjs` header. Task delta only below. RUN THIS ONLY AFTER the split session's 19/19 lands (the driver fires you then).

## The fault (one cause)
mocker_a [4,0.5,0], mocker_b [4,0,0], mocker_c [4.5,0,0] stand stacked — heads 0.5 D apart with radius 0.5: merged in any render, and from SH07's village-side F570 camera their heads sit on the sightline to mocker_a's head (Opus hunt #1, BLOCKING; the audit cannot model character-on-character occlusion). This is a cast-placement fix in `scenes/film.js` only.

## Deliverable (exact)
- mocker_b -> [4,0,-2] (2 D toward the wall: stays dead ahead of SH08's camera [4,3,-4] target [4,1.9,0], keeping the F621/F639 face pair a+b).
- mocker_c -> [6,0,0.5] (out of the F570 sightline by ~1.8 D; already a non-counting candidate at SH08).
- mocker_a unchanged. No other cast/prop/shot changes. If the audit disagrees with these targets, adjust minimally and report the values that pass.

## Acceptance check (exact)
1. `node tools/audit_staging.mjs` still prints **19/19 PASS** (esp. F537/F570/F590 and F621/F639 faces 2/2). 2. Diff: `scenes/film.js` cast placements only (+ lessons). 3. Summary: old -> new positions + the SH07/SH08 audit lines after. 4. Lesson appended: stacked cast at one point is a render fault the staging audit cannot see — cast spreads are checked by the hunter + fleet stills.
