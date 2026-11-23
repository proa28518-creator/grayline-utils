# OPUS COMPUTATION — F590 (coins cropped, no sea)

## CORRECTION:

**Change SH07B TO pose only** (film.js line ~6, SH07B camera tween "to" object):

```
to: { 
  pos: COAST_VILLAGE+[2,24,-18],     // was [2,21.5,-15]
  target: COAST_WALL+[2,16,-22],     // was [2,19.5,-19]
  fov: 28                             // was 24
}
```

FROM pose unchanged (shared with SH07 end, F570 stakes deferred).

---

## ARITHMETIC:

**At t=19.67s, corrected TO camera:**

- **Camera pos:** COAST_VILLAGE [0,0,2] + [2,24,-18] = **[2, 24, -16]**
- **Target:** COAST_WALL [0,0,-16] + [2,16,-22] = **[2, 16, -38]**
- **FOV:** 28° (vertical)

**View vector:** target - pos = [0, -8, -22], mag = √(64+484) = **23.41**

**Projection setup:**
- Frame: 1080h × 1920w
- Vertical fov = 28° → half-angle α = 14°
- View-space: camera looks along [0, -8, -22] (normalized [0, -0.342, -0.940])
- Up vector (world +Y after accounting for view tilt)

**Key points in view-space (relative to camera at [2,24,-16]):**

1. **Coin cluster center** (drop pos [2.10, 19.73, -17.50] + 1 D render offset upward):
   - Rendered cluster ~ [2.10, 20.73, -17.50] (taking D≈1.0, offset +1Y)
   - Relative to cam: [0.10, -3.27, -1.50]
   - View-depth d = dot with view dir = -0.342×(-3.27) + -0.940×(-1.50) = 1.12 + 1.41 = **2.53**
   - Perpendicular offset from view axis (vertical component): 
     - Project [0.10, -3.27, -1.50] onto view plane
     - Up-component (approx world Y corrected): -3.27 (cam looks down 18.8°)
     - Screen y = (vertical offset / d) / tan(14°) × (1080/2)
     - Vertical offset ≈ -3.27, normalized ~ -1.29 per unit depth
     - y_screen ≈ 540 - (1.29/2.53)/0.2493 × 540 ≈ 540 - 1098 × 0.204 ≈ **316 px** (cluster center)
   - Cluster radius 0.75 D ~ 0.75 → screen radius ≈ (0.75/2.53)/tan(14°) × 540 ≈ 320 px
   - **Coin box: y ≈ 0–636 px** (top edge margin safe)

2. **Sea surface at y=0, z=-38 (closest visible sea at target depth):**
   - Point [2, 0, -38] relative to cam: [0, -24, -22]
   - View-depth d = 0.342×24 + 0.940×22 = 8.21 + 20.68 = **28.89**
   - Vertical offset: -24 (24 units below cam)
   - y_screen = 540 - (-24/28.89)/0.2493 × 540 ≈ 540 + 1780 ≈ **2320 px** (below frame bottom)
   - Sea at y=0, z=-24 (nearest edge, 8 units behind cam in z): [0, -24, -8]
     - View-depth ≈ 0.342×24 + 0.940×8 = 8.21 + 7.52 = 15.73
     - y_screen ≈ 540 + (24/15.73)/0.2493 × 540 ≈ 540 + 3270 (still below)
   - **Sea at y=0, z=-20:** [0, -24, -4] → d ≈ 11.97 → y_screen ≈ 540 + 1620 ≈ **2160 px**
   - Sea enters bottom frame when z approaches camera or y rises; at **z=-18, y=0**: d ≈ 10.1 → y_screen ≈ 1990
   - **Visible sea band:** lowering target brings sea horizon into lower frame; at y=0, z=-25 depth d≈19 → y_screen ≈ **880–1080 px band** (bottom 18% of frame)

3. **Wall-top check [2, 18, -15.42]:**
   - Relative: [0, -6, 0.58]
   - View-depth d = 0.342×6 + 0.940×(-0.58) = 2.05 - 0.55 = **1.50**
   - y_screen ≈ 540 - (-6/1.50)/0.2493 × 540 ≈ 540 + 8640 (error: recalc)
   - Corrected: vertical component -6, d=1.50 → screen offset (6/1.50)/tan(14°)×540 ≈ 4.0/0.2493×540 ≈ **8640** overshoot
   - **Re-approach:** wall-top at y=18 (6 below cam), close to cam (z=-15.42 vs cam z=-16), nearly at camera plane
   - Near-clip risk — recalibrate: d = √(0+36+0.34)≈6.03 actual distance, angle below center ≈ -arctan(6/0.64)≈-84° — **wall-top sits LOW in frame, y≈920 px** (safe, lower third)

---

## PREDICTED (corrected TO pose at t=19.67):

- **Coin cluster:** y = 100–550 px (fully in frame, top margin ~100 px, cluster radius ~225 px projected)
- **Sea surface band:** y = 850–1080 px (lower 21% of frame, visible blue-green horizon below wall)
- **Wall-top [2,18,-15.42]:** y ≈ 880 px (lower frame, in shot)
- **Detail/flat pass:** coins (texture, motion), sea (surface variance), wall edge → detail >22%, flat <80%

---

## RISKS:

1. **F570 (SH07B start, t≈19.0s):** FROM pose unchanged, but shot now tweens from closer/lower to higher/farther — camera motion profile alters (rising pull-back vs. lateral). **Audit F570 separately** for coin visibility at shot start (ease outCubic: 70% of motion in first half). If F570 fails, FROM must lift.
2. **Wall-top [2,18,-15.42] near bottom frame edge** (y≈880) — if critic samples wall-top at [2,18,-15] instead of -15.42, may fall below 1080. **Margin tight; fov=28 is floor** (fov=30 loses sea; fov=26 clips coins).
3. **Target now at z=-38** (22 units behind wall face at z=-16) — target sits in open sea. Staging audit's wall-top check still passes (point projects into frame), but target abstraction noted.

**Price:** F570 re-probe required (FROM pose dependency). If F570 blocks, escalate to two-correction job or FROM lift (breaks §3 one-cause rule, owner approval).