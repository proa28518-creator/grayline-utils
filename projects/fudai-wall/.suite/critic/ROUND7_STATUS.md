# CRITIC ROUND 7 — STATUS: PACK READY, EXECUTION PENDING (browser seat)

## What is ready
- Mix: `.suite/critic/round7_chunk2/pic_01.jpg` … `pic_18.jpg` — 12 ours at the
  round-6 moments (8 fresh fix-#1 stills from `probes/chunk2c/stills/`:
  F219/F241/F288/F345/F414/F537/F570/F621; 4 unchanged shots reused from phase-6
  stills: F474/F687 from `probes/chunk2/stills/`, F798/F870 from
  `probes/chunk2b/stills/`) + 6 Story 4 bar frames (S01/S04/S06/S09/S12/S18).
  Fresh shuffle, seed 23.
- Prompts: `round7_chunk2/prompt_stepA.txt` (blind sort, score only),
  `round7_chunk2/prompt_stepB.txt` (verdict on our frames vs spec, round-6 report
  in hand + fix-#1 note).
- KEY (driver-held, never shown to the critic): `round7_chunk2_KEY.driver.txt`.

## How to run it (browser seat — the phase-7 driver cannot operate the browser)
- Account: the signed-in **nooaar343@gmail.com** (AI Pro), as it stands — owner's
  word «تمم» (2026-11-23 ~01:00).
- Invoke the installed skill **`fudai-wall-critic`** in the session (Customize >
  Skills > Installed). Model: **Neon («تحليل أعمق 4 Neon»)**, deepest analysis.
  Thinking level: **High (مرتفع)**.
- **Step A** (fresh session, skill invoked): send `prompt_stepA.txt` + the 18
  pics; record the reply verbatim to `round7_chunk2/stepA_reply.txt`; key-check
  the sort score against `round7_chunk2_KEY.driver.txt` and record it.
- **Step B** (separate fresh session, skill invoked): send `prompt_stepB.txt` +
  our 12 frames only (F219/F241/F288/F345/F414/F474/F537/F570/F621/F687/F798/F870),
  labelled as the film under review; record the reply verbatim to
  `round7_chunk2/stepB_reply.txt`.
- Task mode: use it where the skill session allows it; if the skill session
  cannot combine with Task mode, run as the skill presents and note that fact in
  the round report.
- **No API fallback:** the Google AI Studio API route is retired by the owner's
  word (2026-11-23 ~01:00). If the browser critic seat fails, STOP and report the
  blocker; do not call `custom.gemini-api`.

## After the verdict
- Write `.suite/critic/CRITIC_REPORT_round7.md` (method, sort score key-checked,
  Step B reply verbatim, what changed vs round 6).
- Take the verdict: fix ONLY its named biggest gap, one change, re-probe those
  frames, one new critic round (round 8). The remaining round-6 items (cast facing,
  SH09 head target, SH05/SH10/SH11 reframes, sign-kind rename, SH12 widening) are
  each one future round's single fix — in the order the critic's own verdicts name
  them, never bundled.
