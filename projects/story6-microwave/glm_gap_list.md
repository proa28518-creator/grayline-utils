# Story 6 — Camera Gap List (current buildShots vs accepted Gemini staging standards)

- **Produced by:** GLM (`free/glm-5.3-flashx` via APInex) as outside verifier, 2026-11-21.
- **Inputs:** `gemini_staging_review.md` (accepted standards + 10-point checklist), current cameras extracted from `scenes/film.js` `buildShots()`, staging positions from `scenes/motion.js`.
- **Caveat:** GLM returned bare checklist numbers without the one-line reasons requested, and several flags are mis-mapped. Its verbatim output is preserved below; the desk verification annex that follows is desk-made and labeled as such.

## GLM verdicts (verbatim)

```
S01: violates #4
S05: violates #3, #4
S09: violates #3, #9
S10: violates #6
S11: violates #3
S12: violates #6
S16: violates #16 does not exist; no relevant listed violation among requested checklist points
S17: violates #9
S20: violates #9
```

## Desk verification annex (desk-made, 2026-11-21 — evidence from film.js/motion.js)

- **S01 — #4 confirmed, worst-tier.** Camera sits ~4.3 units from the hero at fov 24, target (−4.80, 1.82, −1.30) beside the hero's chest. Standard demands an extreme pocket close-up starting at z = 0.2 (≈1.75 units) dollying OUT to z = 2.8. The hook's pocket read never happens.
- **S05 — #4 flag is a mis-map** (#4 is S01-specific). Real gaps vs the per-shot standard: camera on the straight Z axis ~8.0→5.0 units out at fov 26→24 (standard: ~3.0 units, fov 34, mid-chest-to-crown framing) — the shock face is far smaller than specified; the horn-over-shoulder background anchor is not framed.
- **S09 — #3/#9 flags are mis-maps** (#3 covers S02/S05/S07/S13; #9 covers world jumps). Real gaps: camera is level at kettle height ~13 units away — no 25° look-down into the container (standard: (−2.2, 2.5, −1.8)), so the eruption's source is not visible before the burst (#5 legibility risk), and the path abandons the popcorn mid-shot to orbit the laughing mocker (#8: primary read does not hold).
- **S10 — #6 confirmed.** Camera pushes toward an empty midpoint (−0.6, 1.9, −3.0) from ~12 units off the kettle; not the over-the-shoulder diagonal from (3.2, 2.3, 0.8). Mocker stands at (2, −1.55) and does not lean during this shot (motion.js), so the egg beat has no second subject in frame.
- **S11 — #3 flag is a mis-map.** Real gap: target is locked on the kettle alone at fov 26→24; the leaning mocker at (0.5, −0.8) sits ~3.5 units right of the kettle, outside the tight frame — the "tight two-shot" is a one-shot.
- **S12 — #6 confirmed, worst-tier.** Camera targets the midpoint (−0.7, 1.9, −3.0) from ~8.6 units away from the mocker at fov 32→31. Standard demands a tight face shot (dist ~2.6, fov 34, hero excluded). The explosion payoff — yolk on the mocker's face — is small in frame, and the hero shares the depth plane.
- **S16 — GLM missed this one; it is the worst violation in the film.** The actual camera targets (−2.3, 1.75, −3.7), near the kettle. The wave box at (5, 1.3, −5) is ~7 units off-axis and not photographed at all during the "waves in/out of the open box" beat (standard: camera (3.6, 2.2, −2.4) → target (5.0, 1.75, −5.0), box at 1.1×0.85×0.9 on the bench). Note the film.js comment header for S16 describes the intended box camera; the code does not match the comment.
- **S17 — #9 flag is a mis-map.** Real gaps: camera pulls BACK (z 5.2→6.4) while fov widens 30→31, ending ~10.7 units from the box (standard: dist 7.2 at z = 2.2); hero welds at (3.6, −2.2) vs the standard's (3.7, −1.55). Framing is looser than the #1 frustum spec for the hero+box pair.
- **S20 — #9 confirmed.** Path starts 9 units out at fov 32 (standard: tight inside one kitchen at dist 2.5), ends at z = 30 (standard: exponential pull-back to z = 45), with near-linear keys — no room-interior anchor and no exponential reveal.

## Summary of confirmed violations by shot

| Shot | Confirmed violations |
|---|---|
| S01 | #4 (no pocket close-up, no dolly-out) |
| S05 | Per-shot standard missed (distance/fov/framing floor) |
| S09 | #5 risk + #8 (level distant camera; abandons subject mid-shot) |
| S10 | #6 (no diagonal over-shoulder staging) |
| S11 | Two-shot framing fails (mocker out of frame) |
| S12 | #6 + payoff framing missed (wide midpoint, not tight face) |
| S16 | Subject not in frame at all (camera on kettle, not wave box) |
| S17 | #1 looseness (excess distance, pull-back + widening fov) |
| S20 | #9 (no kitchen anchor, no exponential pull-back) |
