# Story 6 — «الشوكولاتة اللي ساحت» — FINISHING PLAN (music + SFX)

**Film:** 56.20 s · 30 fps · 1,686 frames · 21 shots (S01–S21)
**Voice:** owner's recording (`voice_owner.wav`) — lead, untouched. All cue times below are locked to `words_owner.txt` (his performed timings), cross-checked against `shots.md`.
**Assets:** Creatorize template pack — music in `templates/documentary/music/`, SFX in `templates/lowpoly/library/sfx/<category>/`. Every filename cited below was verified on disk 2026-11-21.

---

## 1. Music bed

**Primary: `kevin-macleod-immersed.mp3`**
**Alternate: `kevin-macleod-scp-x6x-hopes.mp3`**

Why Immersed fits the arc (1945 lab → warm discovery → triumph):

- **Cold open / lab (S01–S05, 0.18–11.16):** Immersed is a gentle, curious, slow-building piano/strings bed. It sits under the freezing-room setup without turning the lab sinister — the story's engine is a puzzle, not a threat. (The pack's darker options were rejected: `kevin-macleod-dark-times.mp3` is Story 4's bed and too ominous for a comedy of curiosity; `kevin-macleod-ossuary-6-air.mp3` is static eerie ambience with no build; `kevin-macleod-sad-trio.mp3` fights the triumphant ending.)
- **Escalation (S06–S13, 11.70–31.74):** the track's steady pulse tolerates heavy ducking — the mock laugh, popcorn barrage and egg blast all punch through cleanly while the bed keeps the scene glued together.
- **"You see" turn (S14–S17, 32.26–42.98):** its flowing, wondering character matches the night-blue explanation dive; no re-edit needed at the turn.
- **Triumph (S18–S21, 43.27–56.20):** the bed's late build carries the showroom reveal and the 200M-kitchens zoom-out, and it resolves warmly into the loop cut.

**Alternate usage:** if the desk wants a brighter, more openly triumphant payoff, swap to `kevin-macleod-scp-x6x-hopes.mp3` at the S18 curtain reveal (43.27) — the exact two-track shape that worked on Story 5 (Immersed → SCP-x6x crossfade at the turn). Default plan stays one track end-to-end for cohesion.

**Mix recipe (desk standard, Story 4/5 proven):**

- Voice lead untouched — never processed, never ducked.
- Music bed at **−18 dB** under the voice, with an **8 dB duck** under speech (sidechain on the voice), recovering in the breath gaps.
- Music may breathe up ~2–3 dB in the two speech-free pockets: the S03 radar-sky glide tail (≈5.9–6.26) and the S20 zoom-out (≈52.4–53.45, under the ding chorus).
- Fades: **1.2 s in** (from 0.00, under the S01 melt shimmer), **2.5 s out** ending exactly at 56.20 so the loop cut is clean.
- SFX bed ducked 4 dB under speech (same as Story 5).
- Final master: loudnorm two-pass to **−16 LUFS / ≤ −1.5 dBTP**. Target voice-to-bed ratio ≈ 13–14 dB (Story 5 measured 13.6 dB).

---

## 2. Beat-mapped SFX cue sheet

Continuous beds (under the cue layer):

- **Lab room tone** — `sfx.server_room.01.ogg`, very low, S01–S13 and S17 (the 1945 device room hums like a machine room).
- **Device hum** — `sfx.crt_hum.02.ogg`, very low, whenever the radar device is on screen (S01–S12, S17); pitch/level constant — it is the unnamed wave source, felt not noticed.
- **Night sky** — `sfx.night_ambience.01.ogg` inside the S03 match-cut (sky insert only, ≈4.5–5.88).

| # | Time (s) | Shot | Sound | Source file |
|---|---|---|---|---|
| 1 | 0.18–1.35 | S01 | **Chocolate melt shimmer** — slow liquid drip + soft glossy ooze as the bar slumps in the pocket; one faint sparkle on «ساحت» (0.84) | SYNTH/RECORD (drip/ooze — no melt sound in pack); sweetener `sfx.chime.01.ogg` at −20 dB under |
| 2 | 1.35–2.71 | S02 | Dolly-out air whoosh as the giant device is revealed; low warning-glow hum swells in | `sfx.whoosh.02.ogg`; hum = device bed (above) |
| 3 | 3.04–5.88 | S03 | **Radar sweep blips** — one blip per sweep pass across the screen (≈3.4, ≈4.3, ≈5.2), rotating variants; distant plane drone pass inside the sky match-cut | `sfx.blip.01.ogg` / `sfx.blip.02.ogg` / `sfx.blip.03.ogg`; plane pass `sfx.whoosh.06.ogg` low |
| 4 | 6.26–9.20 | S04 | **Cold room tone** — thin icy air hush under the whole shot; engineer's visible breath vapour puff at ≈7.2 («بالساعات») | `sfx.wind.01.ogg` at −22 dB; `sfx.breath.01.ogg` |
| 5 | 10.88 | S05 | Single soft "?" ping on «تسيح؟» as he turns to the device | `sfx.blip.03.ogg` (short, low) |
| 6 | 11.70–14.82 | S06 | **Mock laugh track, beat 1** — the Mocker's full-mouth laugh bursts in on the HARD CUT (11.70), rolls under his quoted line «يا عم ده جهاز بيصطاد طيارات، مش فرن بيطبخ» (12.53–14.82); dismissive hand-wave swish at ≈13.6 | SYNTH/RECORD (solo laugh — pack has crowd cheer/applause only, no solo laugh); swish `sfx.swish.02.ogg` |
| 7 | 15.41–16.91 | S07 | **Deadpan near-silence** — music and room tone dip hard; a low tension thread under the Engineer's silence; one clock-like tick at ≈16.5 to sharpen the pause | `sfx.tension_drone.01.ogg` at −24 dB; `sfx.tick.02.ogg` |
| 8 | 17.34–19.51 | S08 | Corn-kernel bag rustle as he carries it in; soft heavy set-down thud on the floor by the nozzle at «جنب الجهاز» (19.10); background colleagues' smirking snickers, low | `sfx.paper.02.ogg` (bag rustle); `sfx.thud.03.ogg`; snickers SYNTH/RECORD |
| 9 | 19.78–23.17 | S09 | **Popcorn pops building** — first single pop exactly on «فرقعت» (20.50), sparse pops 20.5–21.1, then a full barrage 21.15–22.19 («فشار طار في كل حتة») with pops panned wide toward camera; barrage tails off by 23.0 | `sfx.pop.01.ogg`–`sfx.pop.05.ogg` layered/rotated, density-ramped (≈25–35 hits) |
| 10 | 22.41–23.17 | S09 | **Mock laugh track, beat 2** — belly laugh, bigger than beat 1, on «والضحك زاد أكتر» | SYNTH/RECORD (same laugh voice as cue 6, longer take) |
| 11 | 23.63–25.45 | S10 | Egg placed into the metal kettle — ceramic/metal clink at «جوه براد» (24.36); kettle slid across the table to the nozzle, metal scrape landing at 25.45 | `sfx.metal.02.ogg`; `sfx.metal.03.ogg` |
| 12 | 25.85–27.97 | S11 | **Kettle whistle rising** — faint kettle tremble/rattle from 25.85, thin whistle entering ≈26.8 and rising in pitch under «عشان يشوف إيه اللي بيحصل» (27.10–27.97), cut dead at the shot end | Whistle SYNTH/RECORD (no whistle in pack); rattle `sfx.metal.03.ogg` looped short; rise shaped with `sfx.riser.01.ogg` at −18 dB |
| 13 | 28.40–29.99 | S12 | **Egg explosion + splat** — total audio cut for the 0.15 s freeze (≈28.40–28.55), then the blast lands on «انفجرت» (29.15): compact cartoon boom + wet yolk splat spreading on «في وشه» (29.60–29.99), one drip after | `sfx.boom.02.ogg` + `sfx.explosion.02.ogg` (short layer); splat `sfx.splash.01.ogg` |
| 14 | 30.36–31.74 | S13 | Lightbulb moment — warm chime exactly on «فهم» (31.18); notebook picked up, pencil scratch follows to 31.74 | `sfx.chime.02.ogg`; `sfx.paper.01.ogg` + pencil SYNTH/RECORD (or `sfx.scratch.02.ogg` very low) |
| 15 | 32.26–36.16 | S14 | **Molecule vibration hum** — deep electronic hum + fast shimmering vibration as the camera dives into the food; intensity ramps with «بتهز جزيئات الماية… بسرعة رهيبة» (33.98–36.16); orange heat-spark crackles sprinkled on top | `sfx.crt_hum.01.ogg` (pitched up, layered ×2); crackle `sfx.glitch.01.ogg` |
| 16 | 36.46–37.71 | S15 | **Hands rubbing** — fast dry friction rubs, accelerating slightly, with a warm glow shimmer as the hands heat up on «فتسخن» (37.43) | SYNTH/RECORD (palm friction — no rub sound in pack); shimmer `sfx.chime.04.ogg` at −22 dB |
| 17 | 38.24–40.14 | S16 | **Waves-in-box hum** — the S14 hum returns, now contained/muffled (low-passed) inside the food cross-section; soft steam wisps rise from the core. Deliberately NO fire sound under the crossed-out flame icon — the absence is the joke | `sfx.crt_hum.02.ogg` low-passed; steam SYNTH/RECORD (soft) |
| 18 | 40.61–42.98 | S17 | **Box build time-lapse ticks** — rapid clock ticks driving the time-lapse; welding sizzle bursts + golden-spark crackle; iron panel clanks as the box assembles (≈41.10 «صندوق حديد», ≈41.72); door swings shut and locks, trapping the hum, on «جواه» (42.70) | Ticks `sfx.tick.01.ogg` (rate-ramped); clanks `sfx.metal.01.ogg` / `sfx.metal.02.ogg`; welding sizzle SYNTH/RECORD (or `sfx.fire.01.ogg` in short bursts); lock `sfx.metal.03.ogg` + hum tail from cue 17 |
| 19 | 43.27–45.69 | S18 | **Showroom reveal swell** — curtain whoosh/drape fall at «الشركة نزلت» (43.86–44.26); rising swell into «أول فرن بالموجات» (44.69–45.12); spotlight-on shimmer as the giant oven towers; crowd murmur underneath | `sfx.whoosh.05.ogg`; swell `sfx.riser.02.ogg`; shimmer `sfx.win.01.ogg` at −16 dB; murmur SYNTH/RECORD |
| 20 | 46.14–49.89 | S19 | **Stat ticks** — tilt-up air; the oven drops onto the scale with a heavy boom + needle slam at «340» (47.56); "340 KG" label pop at «كيلو» (48.20); $5,000 tag swings toward camera with a swish and a cash-register-ish chime at «5000 دولار» (49.05–49.59); crowd shocked gasp | Boom `sfx.boom.03.ogg`; needle `sfx.metal.01.ogg`; label `sfx.pop.02.ogg`; tag `sfx.swish.03.ogg` + `sfx.chime.03.ogg`; gasp SYNTH/RECORD |
| 21 | 50.34–53.04 | S20 | **Many-microwaves ding chorus** — morph whoosh as the giant shrinks to a countertop microwave (50.79); then dings multiply with the exponential zoom-out: 1 ding ≈51.3, 3 dings ≈51.9, a staggered chorus of 8–12 dings by 52.8 («في بيوتنا كلنا»), each generation slightly wider/higher | Morph `sfx.whoosh.07.ogg`; dings `sfx.beep.01.ogg` / `sfx.beep.02.ogg` / `sfx.beep.03.ogg` layered & staggered |
| 22 | 53.45–56.20 | S21 | **Loop ding** — one single clean ding on «شوكولاتة» (54.47) answering S01's melt shimmer (same chime family as cue 1's sweetener), then near-silence: just room tone and the slow drip from cue 1, cut exactly at 56.20 so the file loops seamlessly into S01 | `sfx.beep.01.ogg` (short tail, trimmed); drip SYNTH/RECORD (match cue 1) |

**Cue count:** 22 placed cues + 3 continuous beds. **SYNTH/RECORD items to source before mix day (6):** chocolate drip/ooze, solo mock laugh (2 takes), colleagues' snickers, kettle whistle, palm-rub friction, welding sizzle, crowd murmur + gasp, pencil scratch (or use the scratch fallback).

---

## 3. Risks / notes

- **Popcorn visibility unverified:** in the board stills the S09 popcorn burst was not clearly readable at board scale. The cue-9 barrage must therefore *sell* the explosion on its own — density and wide panning carry the beat even if individual kernels read small on screen. If the render shows kernels clearly, pull the barrage back ~3 dB so picture and sound match.
- **All cues are locked to the owner's performed beats** (`words_owner.txt`), not to the written script's paragraph timing — e.g. the egg blast lands on his «انفجرت» at 29.15, the label pop on «كيلو» at 48.20. Do not re-time cues to shot boundaries; shot starts and word hits differ by up to ~0.5 s (S12 starts 28.40, blast at 29.15).
- **The 0.15 s S12 freeze needs the audio cut** (cue 13): muting everything for those ~4–5 frames before the boom is what makes the impact read. Keep the boom cartoon-compact (`boom` + `splash`), never a realistic explosion — the joke is yolk on a face, not destruction.
- **Four pack gaps are real:** there is no solo laugh, no kettle whistle, no hand-rub friction, and no welding sizzle anywhere in `lowpoly/library/sfx/` (verified by full listing). These must be recorded/synthed before the mix session; everything else in the sheet is on-disk.
- **Same-track fatigue:** `kevin-macleod-immersed.mp3` was also Story 5's lead bed. Two consecutive uploads on one bed is acceptable (different stories, heavy ducking), but if the desk wants separation, the S18 swap to `kevin-macleod-scp-x6x-hopes.mp3` (Section 1) is the prepared escape hatch.
- **Loop integrity:** the film loops S21 → S01 by design. Cue 22's ding must be a short-tail beep, trimmed so nothing rings past 56.20, and cue 1's drip should be the same recording as cue 22's closing drip so the seam is inaudible.
- **The device is never named** — in narration, captions, or sound design notes. The hum beds (cues "device hum", 15, 17) are the wave source's voice; keep them abstract electronics, never a labelled "magnetron" sound.
