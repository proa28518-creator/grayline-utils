# CRITIC REPORT — fudai-wall — Build (chunk 2: SH04–SH12) — round 5
Method: protocol §7 (owner's ruling 2026-11-23 ~00:00). Critic: Gemini gemini-3.5-flash via the desk custom.gemini-api connector, fresh calls, 2026-11-23.
Step A blind sort: 18 pics (12 ours + 6 Story 4 bar), key-checked against round5_chunk2_KEY.driver.txt: **0·0 — 18/18 correct**; the critic's own header agrees (0·0). Sort = score only.
Step B verdict on 18 labelled chunk stills vs the BIBLE/protocol spec — reply verbatim:

CRITIC ROUND — fudai-wall — Build (chunk 2: SH04–SH12) — round 5
BIGGEST GAP: Extensive use of placeholder graphics and black frames in place of required props and character animations.
BLOCKING: Empty probe frames (241, 570, 590, 639); missing props (cranes, money, calendar, coins, ruler, wooden sign); character back shown (537); cropped head framing (669).
PER SCENE: S2 (village/cost/neighbours beats) — FAIL, Missing village square crowd, cranes, money piles, flipping calendar, and measurement visuals. · S3 (mockery) — FAIL, Incorrect character orientation, black screens during coin toss, cropped head shot, and missing blueprint hand animation. · S4 (time-passes + sign beats only) — FAIL, Environment time cycle absent and wooden wall sign replaced by a blueprint placeholder. · S1, S5–S7 — NOT IN THIS ROUND
LINE COHERENCE: Text timing aligns with line windows, but visual beats fail to match spoken content.
SET BAR: Plain flat backgrounds and persistent blueprint screen overlays lower visual quality (rated 3/7).
VERDICT: NO

Driver's cause analysis (from the probe stills + engine source, recorded in RUN_RECORD phase 6):
- S4's two beats never reach the screen at all: the loader's endFraming rule (lib/film/resolve.js:471) truncated the resolved shot list to SH01–SH10 (kept shot t1→99) because the film's end frame (t≈68 s, in not-yet-authored chunk territory) shows no framed head. SH11/SH12 are deleted at build time — the "blueprint placeholder" the critic saw in S4's windows is SH10's clamped camera. This is the deepest single cause in the round: two whole spec beats absent. FIX (this round's one fix): film.js gains `endFrame:false` (the API's own opt-out for a film whose ending is not yet authored).
- The black/empty probes (241, 570, 590, 639) share one cause: the chunk's camera lines cross the village's building geometry (town hall footprint x −3.6..3.6 × z 11.6..16.4 and the house row) — the camera passes inside buildings. NOT fixed this round (one fix per round); first item for the next round.
- Mocker backs (537, 621): the mockers' cast ry:180 faces them north, away from the southern cameras. Not fixed this round.
- Cropped head (669, 687): SH09's target uses the opening's MAYOR_HEAD y=1.55 while the head sits higher, and the loader's lowCams floor raised the camera — head pushed out of frame. Not fixed this round.
- SH05's site props and SH10's line/ruler fall outside their framings (camera distance/target height). Not fixed this round.
