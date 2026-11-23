# GLM SEAT — BRIEF · phase 14 · item 15: F711/F723 option (B) — move the OCCLUDER (mocker_c's place keys inside the SH10 window only)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your text verbatim and judges it by fleet re-probe → pixel gate →
the driver's eye (the eye is decisive on this cause). RULES §3:
one cause, one change. **NO LOCAL RENDERS** — you return text
only. This is Layla's closure of the parked F711/F723 cause:
option (B), move the occluder — NOT a camera change, NOT a board
change, NOT a kind change.

## Previous verdict this brief cites (hard-gate requirement)
Commit `17635c4` — phase 14 cause 7 CLOSED. No judgement is
pending; this brief may fire.

## The fault (measured on the current fleet stills, driver's eye)
SH10's camera is static: pos [7,3,9.5], target [5.2,1.55,0.5],
fov 48. The blueprint board stands at [5.2,0,0.5] (3.4 wide ×
3.4 high). Its label plate (top-right of the board) renders at
screen box **[847,622]–[975,682]** (1080×1920). mocker_c stands
STATIC at his base [6, 0, 0.5] (x,z) behind the board's right
side for the whole shot; his rendered head measures
**[605,557]–[847,810]** — its right edge exactly covers the
plate's left portion, so the plate reads **"5M"** instead of
"15.5M" at both F711 (t=23.7) and F723 (t=24.1). Two critic
rounds called this BLOCKING. The staging audit reads F711/F723
PASS (831px, corners 8/8; ruler + label checks pass) — the audit
has no head-vs-plate test; the pixel gate's geometric overlap of
his model disc vs the board's legibility rect reads **17%**; the
render + eye govern.

## The window (exact)
SH10 spans t0 `line:8.word:5` (= 23.18, also SH09's last frame
boundary) → t1 `line:8.end` (= 24.52). mocker_c's current acts
line in `scenes/film.js` (verbatim — the ONLY line you may touch):
```
 mocker_c:{place:[{t:'line:24.start',at:[p('HILL_GRAVE',[0,0,-1.30])[0],p('HILL_GRAVE',[0,0,-1.30])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-4,-6],[-4,-8],[-4,-8]],speed:5}],look:[{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
```
His SH08 appearances (F621/F639, t 20.7/21.3) are BEFORE the
window and must not change; his walk (line:9.start) and his SH26
place (line:24.start) are AFTER it and must not change.

## The authored change (form fixed; position chosen from the measured table)
Add TWO place keys to mocker_c's `place` array, in chronological
order before the existing line:24.start entry:
1. `{t:'line:8.word:5',at:[X,Z]}` — his SH10 staging position.
2. `{t:'line:8.end',at:[6,.5]}` — restore his exact base at the
   window's end (base MOCK_C = [6,0,0.5]; place `at` is [x,z]).
Place keys are snaps; no other field of the line changes.

## Measured candidate table (driver-computed with the audit's own projection + the render's measured head calibration: model x exact, model y shifted −200px, disc = head diameter at range)
Rendered plate box: [847,622]–[975,682]. Current head: [605,557]–[847,810] (covers the plate's left).
- **[4.4,-2.0]** → head ≈ [389,526]–[583,720]: in frame, plate overlap 0, x-clearance 264px, clear of the glowing line (≈y800). Stands behind the board in the mockers' cluster (mocker_a [4,0], mocker_b [4,-1] in (x,z)) — no collision (≥0.9 D from both).
- [3.2,-0.5] → head ≈ [73,538]–[289,754]: in frame, overlap 0, x-clearance 558px; beside the board's left edge.
- [3.8,-1.0] → REJECTED by the driver: coincides with mocker_b's base [4,-1].
- Any +x move → his head exits the frame's right edge (measured). Any −z-only move from x=6 → his head rises further over the plate (measured). Do not propose outside this evidence without full projection arithmetic the driver can reproduce.

## Acceptance (the driver verifies, in order)
Staging audit: F711/F723 lines unchanged PASS; every other
moment in both chunks unchanged; D1/D2 unchanged FAIL (2).
Fleet re-probe F711 + F723 SUCCESS. Pixel gate: blueprint
geometric occlusion by mocker_c 0% (was 17%); set-bar readings
stay PASS-class (were F711 36.9%/59.3%, F723 38.2%/57.9%).
Eye (decisive): the plate reads "15.5M" WHOLE at both frames;
his head fully in frame, covering neither ruler, line nor palm.

## Reply format (exact)
1. BASELINE RESTATED: the fault readings above (plate box, head box, 17%, the window times).
2. CHOICE: the [X,Z] you choose from the table + its table readings restated.
3. REPLACEMENT TEXT: mocker_c's complete `place:[...]` array segment, verbatim, pasteable (existing entry preserved byte-identical, your two keys inserted before it).
Nothing else. Do not claim you ran anything.
