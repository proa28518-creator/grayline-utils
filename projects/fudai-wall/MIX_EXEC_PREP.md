# SEAT 5 — MIX EXECUTION PREP (readied 2026-11-23, phase 8)
Source of law: `~/workspace/fudai-rebuild/audio/ALIGNMENT_AND_MIX_PLAN.md`
(Seat 5, 2026-11-22 — alignment VERIFIED; his timestamps are the timing law).
STATUS: PREP ONLY. Execution is gated on (a) owner board approval and
(b) the Colab final render's picture. Do not run the mix before both.

## Inputs (verify on disk at execution time)
- Voice (law, never edited): `projects/fudai-wall/voice_owner.wav`
  (= the owner's `hady-raie-bhr8740o6_20_tjbf.wav`, 68.08 s, 24 kHz mono;
  measured −17.89 LUFS, TP −1.12 dBTP, LRA 4.8 LU).
- Picture: the Colab final render's master (video only; the mix is laid
  against its exact length — the film is exactly as long as the voice file).
- Word map: `projects/fudai-wall/audio/clean.json` (his words, his times).

## Session setup (ready to run)
1. Work dir: `~/workspace/fudai-rebuild/audio/mix/` (create at execution).
2. Upsample voice 24 kHz → 48 kHz (no time-stretch, no re-pitch, wording
   untouched). Pause tightening: SKIP (plan §2 — no gap > 0.45 s at −50 dB;
   tightening would break the bible's cut points for ≈2–4 s gain).
3. Bed design (music + SFX) laid at −29…−32 dBFS under voice; swells only
   inside measured gaps. Beat windows from the plan/bible:
   quake rumble 00:37.39 · sea recede 00:39.28–00:40.67 · wave rise
   00:41.06–00:44.81 · impact + stop 01:01.56–01:03.69 · grave quiet
   01:05.75–end.

## Voice chain (the numbers are the plan's, verbatim)
- Limiter engaged BEFORE any gain (raw TP −1.12 dBTP is already within
  0.12 dB of the ceiling): ceiling −1.0 dBTP.
- Nominal +1.9 dB toward target; two-pass loudnorm to **−16.0 LUFS
  integrated (±0.5)**, TP ≤ **−1.0 dBTP**.
- No EQ/compression character changes beyond intelligibility.

## Verification (numbers into RUN_RECORD at execution)
- Loudnorm print: integrated LUFS, TP, LRA — must read −16 ±0.5 and
  TP ≤ −1.0.
- Voice-to-bed ratio on voice-active segments ≥ 16 dB.
- Then the RULES fresh-critic pass on the mix (blind; BIGGEST GAP named;
  VERDICT: YES required) before export.

## Output
- `mix/fudai_wall_mix_48k.wav` (48 kHz master mix) + the verification
  prints; muxed with the Colab picture at assembly.
