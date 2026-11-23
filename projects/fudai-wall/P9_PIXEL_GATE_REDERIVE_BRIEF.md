# CODEX SEAT — RE-DERIVE BRIEF · phase 9 · the pixel gate (tools/audit_pixels.mjs + tools/pixel_measure.py)

You are the Codex seat (the owner's ChatGPT account) for the film
"fudai-wall", project `~/workspace/fudai-rebuild/studio/projects/fudai-wall/`,
repo `proa28518-creator/grayline-utils`, branch `ui/unified-interface`.
Standing method — read and obey: studio `AGENTS.md` (Codex seat authors
code; 24/30 fps only; voice exactly as-is); `~/workspace/Production and
rules/RULES.md` §3 (one cause, one change), §4, §5 (set bar: a shot needs
≥22% detailed set and ≤80% flat; film median shot ≥28% / ≤78% flat; no more
than 40% of shots under); `.suite/critic/CRITIC_PROTOCOL.md` §7;
`lessons/build.md` (read the "Phase 9 — METHOD CHANGE #3" section first).

## WHY THIS SESSION EXISTS (guard question, 2026-11-23 ~04:46)

The phase-9 driver (a local agent) wrote `tools/audit_pixels.mjs` and
`tools/pixel_measure.py` directly. That violates the standing law (local
agents do not author production code; the Codex seat does). The guard caught
it; the driver owned it. **Your job: re-author both tools from this spec.**
The driver's files are REFERENCE ONLY — read them to understand the method
and the validation table, then write YOUR OWN implementation. When your
version lands, it replaces the driver's; the DRIVER-AUTHORED header is
replaced by a seat-attribution header (author: Codex seat; brief: this file;
date: 2026-11-23).

## THE SPEC — what the gate must do

Input: fleet-probed stills in `probes/chunk2d/stills/frame_NNNN.png`
(1080×1920 PNG, 19 key frames; CLI options `--stills <dir>` and
`--frames N,N` for partial re-probes). Scene data: `scenes/film.js` via the
same loader pipeline the staging audit uses (`lib/film/resolve.js`:
resolver/resolveTimes/autoMove; `lib/film/end.js`: lowCams) — import them,
do not re-implement the loader. Key moments (frame, t, shot):
219/7.30/SH04, 241/8.03/SH04, 288/9.60/SH05, 345/11.50/SH05, 414/13.80/SH05,
474/15.80/SH06, 537/17.90/SH07, 570/19.00/SH07, 590/19.67/SH07B, 621/20.70/SH08,
639/21.30/SH08, 669/22.30/SH09, 687/22.90/SH09, 711/23.70/SH10, 723/24.10/SH10,
768/25.60/SH11, 798/26.60/SH11, 822/27.40/SH11, 870/29.00/SH12.

Three tests, all printed per frame with their evidence:
(a) HEAD CROP — for the required faces (F219/F241: mayor; F537/F570:
mocker_a; F669/F687: mayor; F621/F639: a face pair among mocker_a/mocker_b):
the rendered head disc is MEASURED in the still (skin segmentation ringed by
the characters' dark outline — the driver's reference uses Python PIL +
numpy + scipy, which are installed on this VM; do not add npm deps), matched
to the audit-projected centre/size, and FAILS if the disc is cut by a frame
edge (skin touching an edge, or the expanded disc crossing an edge by
>24 px), if no disc matches, or if the match is ambiguous (two candidates
within tolerance). Calibration (measured on the chunk2d stills): rendered
head radius = 1.04–1.06× the audit r=0.5 sphere for the mayor; ~1.32×
hat-inclusive for villagers/mocker (face-only ~1.10×); rendered centres sit
~340–620 px ABOVE the audit projection on close shots — hence discs are
measured, not projected. Match tolerance: centre distance ≤780 px, disc
size ratio 0.45–2.4 vs the projected diameter, ambiguity = FAIL.
(b) FOREGROUND OCCLUSION — screen-space: a named prop's projected
legibility rect fails if a CLOSER character disc (radius 1.35× the model
sphere) or a closer prop box covers >10% of it. Moments: F345/F414
calendar vs crane_a/crane_b; F711/F723 blueprint vs any cast disc;
F870 mocksign vs any cast disc. Also report a measured-disc overlap (skin
discs vs the prop rect) alongside the geometric overlap.
(c) SET BAR — RULES §5 detail/flat computed on the pixels (32×32 blocks,
grayscale std: flat = std < 5, detail = std ≥ 12), judged per SHOT as §5
writes it (median of the shot's key frames ≥22% detail / ≤78% flat); print
a film-scope line (median shot detail vs the 28% bar; shots under vs 40%).

Output: one line per frame (`F<n> | <shot> | PASS|FAIL | <checks>`) plus
the set-bar line; exit code 1 if any frame fails. Node entry
`tools/audit_pixels.mjs`; the Python measurer `tools/pixel_measure.py`
prints one JSON object per still (flat_pct, detail_pct, discs with skin
bbox / expanded disc bbox / centre / area / dark-adjacency).

## SPEC CORRECTIONS — Astra review (Miora, GPT-6 Astra), 2026-11-23, batches 1+2 — GOVERNING

A review seat (GPT-6 Astra) audited the driver's reference implementation
and found real defects. Your re-derivation must FIX all four; a version
that reproduces the validation table while keeping any of them is a
FAILED delivery.

1. **DEAD EDGE-CROSS CHECK (batch 1).** The reference `pixel_measure.py`
   CLAMPS the expanded disc bounds to the image, so the "disc crosses an
   edge by >24 px" condition in test (a) can NEVER trigger — crop
   verdicts currently rest on the skin-touch test alone. Your version
   must preserve UNCLIPPED expanded bounds through the JSON and evaluate
   the cross condition on them.
2. **PAIR DETECTION MUST MATCH BOTH CHARACTERS (batch 1).** The
   reference passes the F621/F639 face-pair moment on ONE large segmented
   region. Your version passes a pair moment only when BOTH named
   characters' discs are individually matched (each within tolerance of
   its own projection); one region, however large, is not a pair.
3. **OCCLUSION NEEDS A DEPTH TEST (batch 1).** The reference's
   measured-disc overlap fails a prop rect when ANY disc overlaps it,
   including unmatched/background discs — contradicting the spec's
   "closer occluder" requirement. Your version counts a measured disc as
   an occluder only with depth evidence it is closer than the prop
   (e.g. matched to a cast member whose projected depth is nearer than
   the prop's, or demonstrably larger/nearer by the calibrated disc
   model); background or unmatched discs are reported, not counted.
4. **MEASUREMENT GEOMETRY — CLUSTER BOUNDS, SAMPLED STATE (batch 2,
   from the F590 cause).** Wherever a subject's size is measured for an
   occupancy-style judgement, measure the RENDERED CLUSTER'S AGGREGATE
   BOUNDS (the union of its members' bounds), computed from the SAMPLED
   EASED CAMERA and the prop's STATE AT t (e.g. the coins' drop state),
   never the prop's 0.5-unit origin proxy box and never the authored TO
   pose alone. (The same correction is owed to the staging audit's
   occupancy test — a separate seat session, recorded in RUN_RECORD;
   your scope stays the two files below, but do not reintroduce the
   proxy error anywhere in them.) Also verify any reported cluster
   bounds hold meaningful content, not empty spacing between members.

## VALIDATION — the gate must reproduce this table (measured on the chunk2d stills)

PASS: F288, F537, F621, F639, F870.
FAIL: F219 (mayor not identifiable), F241 (mayor not identifiable),
F345/F414 (calendar occluded by crane_b, geometric overlap 100%),
F474 (set 13.7% detail / 85.1% flat), F570 (no rendered disc segments —
the back-of-head does not read as skin), F590 (set 14.5% / 84.4%),
F669/F687 (head disc cut by the top edge), F711/F723 (blueprint occluded
by villager_4 — geometric 46%, measured-disc 74%), F768/F798/F822 (set
~14% / ~81%). Chunk-scope set bar: median shot detail 23.9% (< 28%) —
corrected in phase 10 (an earlier ~26.7% figure did not reproduce).
Run your version on the same stills and report the table. ANY discrepancy
from this table is a measured item to report — do NOT tune the tool to
match the table; if a discrepancy is real, the table (not the tool) is what
gets corrected, with the evidence stated.

## CONSTRAINTS

- Touch ONLY `tools/audit_pixels.mjs` and `tools/pixel_measure.py`
  (replace the driver versions in place). Do not touch `scenes/`, `lib/`,
  `engine/`, or the staging audit.
- Pure in t, no Math.random/Date (RULES §4). No new dependencies.
- Keep the CLI interface (`--stills`, `--frames`) and the output format.
- Head the files with the seat-attribution header above.
- When done, run `node tools/audit_pixels.mjs` in full and paste the
  complete output in your reply, plus the validation table comparison.
