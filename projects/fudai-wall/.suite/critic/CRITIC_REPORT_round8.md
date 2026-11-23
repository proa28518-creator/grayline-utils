# CRITIC REPORT — fudai-wall — Build (chunk 2: SH04–SH12) — round 8

Method: protocol §7 (owner's ruling 2026-11-23 ~00:00) + §7.1 (critic seat) +
§7.2 (pack completeness) + the owner's precision clause (2026-11-23 ~03:22).
Critic: **Gemini Neon via the installed `fudai-wall-critic` skill**, run by Layla's
browser seat on the owner's signed-in account (nooaar343@gmail.com, AI Pro — run on
the account as it stands per his «تمم»). Skill session as it presents (Chat-mode
skill session per the owner's ~01:18 ruling), thinking level **High**. The
`@fudai-wall-critic` mention led both steps; the skill was active in both
conversations. No API was used (the Google AI Studio API route is retired, §7.1 —
no fallback). Round 8 is the first round run under the §7.2 pack rule and the
precision clause.

## Step A — blind sort (score only)

25 pics (19 ours from the fleet re-probe of commit `0ccb5d0` + 6 Story 4 bar
frames S01/S04/S06/S09/S12/S18), fresh shuffle (seed 41). Uploads in three
batches (10/10/5 — web cap). Reply verbatim: `round8_chunk2/stepA_reply.txt`.

**Key-checked score (driver, line by line against `round8_chunk2_KEY.driver.txt`):
bar taken for ours: 0 · ours taken for bar: 0 — 25/25 correct.** The key's bar set
is pic_04, pic_08, pic_09, pic_12, pic_16, pic_21 — exactly the critic's bar calls;
every "ours" call also matches its keyed frame (e.g. pic_14 = F669, pic_25 = F687,
both described by the critic as mayor shots with the head cropped at the top edge).
The critic's own header (0·0) agrees with its lines — verified, not trusted. This
is the fourth consecutive 0·0 sort under §7 (rounds 4, 6, 7, 8; round 5 also 0·0).
The sort is a score only; it played no part in the verdict (§7).

## Step B — verdict (verbatim; full text in `round8_chunk2/stepB_reply.txt`)

> CRITIC ROUND — fudai-wall — Build (chunk 2: SH04–SH12) — round 8
> BIGGEST GAP: Repeat round-7 faults—cropped heads, occluded key props, missing subjects, and foreign template text—persist across the frames, proving the computed staging audit did not fix actual camera framing or blocking, so the staging method itself must change.
> BLOCKING: Foreign template text ("RED CANYON SHORT LINE") on signs in F241, F288, F474, and F870; cropped heads/faces in F219, F241, F570, F669, F687, F711, and F723; missing or occluded subjects and props—mayor absent in F219–F241, calendar blocked by crane with no legible 12-year count in F345–F414, no coastal houses/low wall and clipped "10M" sign in F474, mocker hidden behind blueprint in F570, no sea under coins in F590, and blueprint/"15.5M" ruler blurred and occluded to "5M" by a foreground villager in F711–F723.
> PER SCENE: S2 — FAIL · S3 — FAIL · S4 — FAIL (one-line reasons in the verbatim reply)
> LINE COHERENCE: key windows mismatch (F219, F570, F590, F711–F723); other windows match topically but lose readability to occlusion and cropping.
> SET BAR: below bar — flattest frames F590, F474, F768, F798, F822, F621–F639.
> **VERDICT: NO**

## Precision-clause check (owner's addendum, 2026-11-23 ~03:22)

- (a) Step A blind sort key-checked with **0 errors** — YES (25/25, above).
- (b) Step B judged **only on frames the pack supplied** — YES. The pack supplied
  exactly the 19 frames its spec text names (§7.2), and every frame the verdict
  cites (219, 241, 288, 345, 414, 474, 570, 590, 621, 639, 669, 687, 711, 723,
  768, 798, 822, 870) is among them. No unsupplied frame is cited — the round-7
  mismatch does not recur.
- (c) Fixed verdict form — YES, verbatim structure.

**Round 8 is a VALID precision round. Its NO counts.** It does not satisfy
condition (1) of the owner's delegation (which requires a YES), so no board
approval in his name arises from it; the board gate stays as it stands.

## Layla's eye adjudication (her own reading of the stills — recorded verbatim in substance)

Layla read the disputed stills herself. **The critic is UPHELD on the disputed
frames:**

- **F219:** no mayor in frame; the villagers are corner-cropped; the wall
  dominates. (The driver's earlier eye note called F219 "weak — crowd
  corner-cropped against a large blank wall"; the critic's stronger reading —
  mayor absent — is the correct one: the mayor does not read in this frame.)
- **F723:** a foreground villager's head fills ~2/3 of the frame; the blueprint
  is occluded behind him; the ruler label reads only **"5M"**. This **corrects
  the driver's earlier eye-verdict** ("ruler + 15.5M label present at 723") —
  the label is present in the scene data but does NOT read in the render.
- **F687:** the mayor's head is cropped at the top edge — as the driver also
  recorded (FAIL by eye).

Where the driver and the critic differed, the rendered pixels side with the
critic. This adjudication is the direct evidence for method change #3 (below):
the scene-data staging audit passed these frames 19/19 while the renders fail —
its model is not the rendered image.

## Deltas vs round 7 (what the fix-#2 arc actually cured — and what it did not)

Cured since round 7 (critic no longer faults them): the black/empty probes are
gone (no frame is an empty interior); F537 and F621/F639 show laughing FACES
(round 7: backs); F241's 3,000 sign, F288's cranes/$30M, F414's measure reaching
the 15.5M label, F870's faced passers-by, and the SH11 sun/moon cycle all read.
Persisting (second consecutive round → RULES §3 method change, not another
tweak): head crops (F669/F687, and by the critic's eye F219/F241/F570/F711/F723);
the foreign template text on every engine `sign` (F241/F288/F474/F870 — the
film-local sign-kind rename, queued since phase 6, is now a two-round BLOCKING
repeat); prop occlusion by foreground geometry/characters (calendar behind the
crane F345/F414; blueprint + ruler behind a foreground villager F711/F723;
mocker behind the blueprint F570); missing sea under the coins (F590); the flat
neighbour slab (F474); SH11 flatness / daytime-blue moon sky (F768–F822).

## Driver disposition

**VERDICT OF RECORD: NO. S2 FAIL · S3 FAIL · S4 FAIL. Chunk 2 remains
critic-NO.** The critic's demand is explicit and matches §3: the staging method
itself must change. Phase 9 answers with **method change #3 — the pixel-verified
loop**: a pixel gate (`tools/audit_pixels.mjs`) that judges the fleet-probed
STILLS themselves (calibrated rendered-head crop test, foreground-occlusion test,
§5 detail/flat measured on the pixels). No frame is called staged until the pixel
gate passes on its probed still; the scene-data audit remains a pre-check only.
The eight open causes are then worked one model per problem (owner's doctrine,
2026-11-23 ~04:18), proposals in parallel, application serial, one cause per
Codex session, re-judged between. Round 9 runs when every cause closes.
