# RUN RECORD — Fudai «السور اللي وقف الموجة» — REBUILD under the new operating model (2026-11-22, from 21:57 EET)

**Mandate:** Owner's go (21:57 EET): build the Fudai Short based on the extracted file.
Layla is the program; the law is `~/workspace/Production and rules/RULES.md` (read in full
by Seat 1 before anything). A permanent guard agent checks output against RULES.md every
15 min. **This run stops at the BOARD: no full render, no export before the owner's eye
approves the board** (owner's test definition; RULES §1/§3 — the program never declares
success itself).

## Office roster (owner's standing roster, 22:10 EET — mirrors the program's own internals, with bigger external models behind the seats)
- **Seat 1 — production driver (Layla):** passes in order, board assembly, stop at the board.
- **Seat 2 — scene builder:** scene-build pass + the two known defect fixes (below).
- **Seat 3 — internal fresh critic:** owns the board verdict (RULES §3 discipline).
- **Seat 4 — visual verifier:** prop-truth zoom checks + set-detail bar (RULES §5).
- **Seat 5 — audio engineer:** alignment comparison + mix plan/criteria (RULES §7/§8).
- **Seat 6 — styles & library keeper:** style sheet from the owner's bible + project library.
- **Seat 7 — watcher:** fleet/Colab legs, door inventory, Gemini API call counter, run-record completeness.
Each seat files its preparatory sheet in this project folder; Seat 1 collects them here.

## Law in force (citations)
- Passes in order, each ending in a fresh-critic `VERDICT: YES` with no BLOCKING fault — RULES §1, §3.
- Frame 0 = an expressive face; never an empty scene, never a back — RULES §4; Build exit (head ≥300 px on 9:16).
- Pure in t (seeded, no Math.random/Date) — RULES §4. Never edit the engine copy — RULES §4/§9.
- PROP GUARD: a prop that jumps on screen fails the film — RULES §4.
- Set bar: shot ≥22% detail / ≤80% flat; film median ≥28% / ≤78% flat; ≤40% of shots under — RULES §5.
- Voice is law — RULES §7. **Conflict named:** repo AGENTS.md (owner's standing word there) says the
  narration file is used *exactly as-is — no trimming, no cleaning; the film is exactly as long as the
  file*. That word governs over §7's pause-tightening step for this run: `voice_owner.wav` is a
  byte-identical copy of the owner's WAV (verified with `cmp`), film end = 68.08 s = file length.
- Format: cartoon-shorts, fps 30, size [1080, 1920] — RULES §10. (60 fps cancelled by the owner.)
- Critic: NEW agent each round, blind-mixed with bar frames, fixed answer form, fix only the
  BIGGEST GAP at its cause — RULES §3 / skill references/critic.md.
- Routes (owner steering 21:59 EET): **storyboard stills on the GitHub fleet; final render on
  Colab (L4)** — after board approval only. API doors all in use with cross-model verification
  at every gate; Gemini API is free-tier Flash-only, 250 req/day — metered, no retry-burning
  (Seat 7 keeps the counter; a dead key is reported immediately — desk key-watch).

## Recovery (what survived the sweep, what did not)
- Engine + render route recovered from the pushed GitHub history (`proa28518-creator/grayline-utils`,
  branch `ui/unified-interface` @ d503e12) into `~/workspace/fudai-rebuild/studio/` — our own work
  product; no Creatorize program copy resurrected («Production and rules» stays the only one).
- The prior `projects/fudai-wall/` was never committed → its scene code is GONE. What survives in
  history: the prior run record, the ASR-aligned clean.json, the 15-prop list with crop boxes
  (`~/workspace/fudai-rebuild/recovered/`). Scenes are authored NEW from this voice (RULES §4).
- Project chassis: demo-ring's proven plumbing (engine/, lib/, specs/, tracks/, vendor/, __suite/,
  world/) copied fresh; all film content new.

## Pass 0 — Setup + timing (Seat 1, done 22:05 EET)
- Voice: owner's `hady-raie-bhr8740o6_20_tjbf.wav` — PCM 24 kHz mono, 68.08 s — byte-identical in project.
- Script of record: reconstructed VERBATIM from the owner's own word-timestamps file
  (186 words) → `script_owner_ar.md`, 24 lines segmented by his 7-scene bible's line windows.
- `audio/clean.json` built from the OWNER's words on the OWNER's own word timings (his approved
  extraction «بالتوقيت الدقيق كلمة بكلمة»): 186/186 words, monotonic, span 0.10–67.55 s.
- Cross-check vs the prior run's ASR alignment (align fraction 0.957): 47/186 word-text diffs —
  ALL are tokenization/spelling (numbers as digits «3000» vs spelled «تلات آلاف», punctuation,
  «الـ» splits); timing deltas vs ASR align: median −0.05 s, worst 1.18 s in the fast
  «15 متر ونص» cluster. Owner's text governs (his instruction for this run; RULES §7 step 2:
  what is written in the transcript is what the timings contain).

## Defect register (from the prior run — must be impossible this time)
- **D1 (boot):** `(film.props || []).find is not a function` — builder wrote props as an object
  map. Our engine's format (proven: demo-ring/story6 film.js) takes `props` as an ARRAY of
  `{id, kind, in:'world', at:[x,y,z], keys:[{t, at}]}`. Fix owner: Seat 2. Also preserve the
  box entry's `fetch: true` fix (prior annotation fix-1795371591203).
- **D2 (empty probes):** set zones placed at x=800/1200/1600 while cameras aimed at the old
  positions → 16/16 prop-truth failures on empty frames. Fix owner: Seat 2 + Seat 4 — ONE
  coordinate source of truth (place constants shared by set, props, cameras), and no probe is
  declared until a zoom crop per prop has been LOOKED at.

## Standing reconciliations (Seat 4 flag, 22:13 EET)
- The recovered studio tree's `AGENTS.md` still carries the OLD control law ("the interface is
  the ONLY door", "no free-roaming external model session") — that law predates and is superseded
  by the owner's 2026-11-22 ruling (Layla is the program; work runs from her browser/APIs under
  RULES.md). **No seat follows the dead law: seats follow their briefs + RULES.md + the owner's
  latest word where they differ.** The parts of AGENTS.md that agree with the new law stand:
  Codex seat authors code; Opus + GLM hunts on every delivery; 24/30 fps only; voice exactly as-is.
- Probe rendering / executing the recovered tree is Seat 1's step (Seat 4 works eyes-only on
  rendered probes). Seat 4's `PROP_CHECKLIST.md` is filed: **51 props** from the owner's bible
  (4 global + 47 scene props), all PENDING; board assembles only when all 51 PASS + set bar (§5).

## Provenance (Seat 3 flag 1 — verified by Seat 1, 22:14 EET)
Recovered tree verified against the remote BEFORE execution: worktree HEAD
`d503e123405b1d787ee396eae68b8546319a38ac` == `git ls-remote origin ui/unified-interface`;
**0 modified tracked files** (`git status --porcelain`); engine/lib/server/bin identical to the
pushed history. It is our own code from our own repo — executing it is inside the owner's
ordered build scope. New files appear only under `projects/fudai-wall/` (untracked, ours).

## Seat filings collected
- **Seat 7** — `~/workspace/fudai-rebuild/WATCH_LOG.md`: routes watched (stills → fleet; render →
  Colab L4 LOCKED until owner board approval); doors inventoried; Gemini counter opened at 0
  generation calls (Seat 1 reported 1 pre-watch metadata call, HTTP 200).
- **Seat 4** — `PROP_CHECKLIST.md`: 51 props, all PENDING (see reconciliation note above).
- **Seat 3** — `.suite/critic/CRITIC_PROTOCOL.md`: freshness/blindness per RULES §3; standing
  BLOCKING checks (empty probe, missing prop at zoom, gutted scene, frame 0 not an expressive
  face); per-scene checklists; 15-window voice/visual coherence table (story numbers 15.5/10/15,
  3,000, $30M, 12 yrs, 14 yrs must read exactly — wrong/missing number is BLOCKING). No board yet
  → no verdict; Seat 3 needs from Seat 1: the blind-mixed still set + `film_check {kind:'set'}`
  numbers. **AGENTS.md checkpoint-chain wording vs RULES §3: §3 governs** (same reconciliation
  as Seat 4's flag).
- **Seat 6** — `STYLE_SHEET.md` + `LIBRARY.md`: cartoon-shorts, 30 fps, 1080×1920, 68.08 s;
  character construction per the extracted skill (2.5D flat, snap faces, ink outline); 5-state
  lighting set (CALM / MELANCHOLY / STORM / SEPIA / GOLDEN CLOSE) with per-scene colour script;
  one numeral system (Latin digits: 3,000 · $30M · 12 · 15.5M · 10M · 15M · 14).

## Seat 1 rulings on Seat 6 flags (22:15 EET)
1. **Frame 0 (RULES §4 vs bible S1): the RULE governs — adapt, no exception.** Frame 0 = tight
   on the Mayor's expressive face at ground level beside the wall (low angle, head ≥300 px);
   the bible's vertical tilt-up follows inside the same opening shot. The bible's intent
   (small mayor → giant wall) is preserved; the law's first-frame face is not negotiable.
2. **Aging ladder:** ONE character in three cast entries sharing the body spec —
   `mayor` (grey, S1–S3/S5-era), `mayor_old` (white, S4), `mayor_young` (black, S6).
3. **Sepia locked to S6 beats 1–2 only.**
4. **S6 child:** one-appearance extra, kid build (limbs shortened, head never scaled).
5. **S7 mourners ARE S3's mockers** — same cast entries, hats and colours (identity = PROP GUARD).
6. **Set-bar risk (§5) on the wide shots** (S1 pull-back, S5 coastline glide, S7 aerial):
   Seat 2 builds wide-scale set density from the start; Seat 4 measures every shot.

## Render-route proof (Seat 1, 22:14 EET)
Recovered tree renders: `bin/heart still projects/story6-microwave 12` produced a 2.6 MB
1080×1920 still — viewed by Seat 1: the radio on the table with caption «زميله ضحك», the exact
t=12 frame of the delivered Story 6. Route alive end-to-end (server + Chromium + suite.stills).
Local cost ≈ 5 min/still on this VM → probes batch in ONE boot; the board batch goes to the
GitHub fleet per the owner's route (Seat 7 watches for the dispatch).

## Pass status
- Pass 0 setup+timing: DONE (above).
- Build pass: IN PROGRESS — `scenes/BIBLE.md` DONE (Seat 1, 22:16 EET; 24 lines, PLACES,
  cast, colour script, staging rulings). `BUILD_CALL.md` issued to Seat 2 (22:17 EET) with the
  format contract, 26-shot plan, D1/D2 gates sequenced, opening-first order. Seat 2 executes.
- Board: not yet. Render: FORBIDDEN before owner approval.
- Compute home: THE FLEET (owner's correction 22:43 EET — see Fleet move below).

## Fleet move — owner's correction (2026-11-22 ~22:43 EET)
- **The drift, named:** the rebuild had drifted LOCAL onto the desk VM (recovered tree, the
  22:14 local proof still, the build starting locally). In the 22:41 call the desk wrongly
  confirmed «كله على GitHub» unverified; the owner ordered «اتأكدي»; the check proved it
  false (last fleet runs = Story 6, 11:34 EET; WATCH_LOG: no Fudai dispatch). The desk owned it.
- **Owner's correction (~22:43):** the weak local machine was REPLACED by the fleet precisely
  because local takes too long — «هم عشرين جهاز هناك». Settled doctrine restated (his word
  2026-11-19): ALL production work runs on the GitHub fleet; the desk VM is controller +
  QC eyes only. **From this entry on, the build's compute home is THE FLEET. Local renders
  are QC spot-checks only (a single proof still to verify a route), never batch work.**
- **Project pushed:** commit `f971ce5c229ad6b5d26557e4ee94e6bdd77fad9d` on
  `ui/unified-interface` (repo proa28518-creator/grayline-utils) — the whole
  `projects/fudai-wall/` as it stands: 1,119 files (Pass 0, BIBLE, BUILD_CALL, seat prep
  filings, full project chassis; `out/` and `.heart-git/` excluded by .gitignore).
  Verified: `git ls-remote origin ui/unified-interface` == local HEAD; project present on
  the remote branch (23 top-level entries).
- **Scene code state (plain): NONE EXISTS YET.** `scenes/` holds only `BIBLE.md` — no
  film.js, no cast JSONs, no props code. Seat 2 has not landed code. **No fleet dispatch
  was fired in this move** — there is nothing to render yet.
- **Dispatch path — proven ready (dry validation, no run fired):** workflow
  `fleet-render.yml` ("Fleet Render Chunk", id 423348197) is ACTIVE; its definition on
  `ui/unified-interface` takes exactly `project` / `spec` / `settings` — `project=fudai-wall`
  works AS-IS, no workflow adaptation needed. `fleet/render-chunk.ts` renders frames
  START..END-1 at 30 fps, 1080×1920 (the film's exact format) via suite.stills; a run exits 1
  on any null/missing frame, so green = every requested frame captured; each artifact carries
  `run-info.json` (bootError, suiteErrors, incomplete flag) — the fleet-side boot evidence
  for the D1 gate.
- **The wired dispatch (Seat 1 fires when Seat 2's code lands + is pushed):**
  - Probe still at frame F (t = F/30 s):
    `gh workflow run fleet-render.yml --repo proa28518-creator/grayline-utils --ref ui/unified-interface -f project=fudai-wall -f spec=render:F:F+1 -f settings='{}'`
  - Board batch = one such dispatch per probe frame, ALL fired in parallel (public repo,
    ~20 machines). Probe frames = film.js shot t0 frames + per-beat frames (BUILD_CALL §4:
    one still per shot + per major beat); provisional anchors = the 24 line starts in
    `audio/clean.json`.
  - Prop-guard track for a range: same command with `-f spec=track:S:E` → `proptrack.json`.
  - Collect: `gh run download <run-id> --repo proa28518-creator/grayline-utils --name fleet-chunk-fudai-wall-<run-id> -D <dir>` → untar `fleet-result.tar.gz` →
    `frames/frame_FFFF.png` + `manifest.json` + `run-info.json` + `page-console.log`.
    Seat 4 zooms the PNGs; Seat 3 gets the blind-mixed set + set-bar numbers as before.
  - Full-frame legs (later passes) use `fleet/orchestrate.py --project fudai-wall`
    (render+track chunk planner, resumable via run_map.tsv).
- **Unchanged locks:** board gate LOCKED until the owner's eye approves; final render =
  Colab L4 after board approval only. The 22:14 local still stands as ROUTE PROOF only —
  its "probes batch in one local boot" plan is SUPERSEDED by this fleet wiring.
