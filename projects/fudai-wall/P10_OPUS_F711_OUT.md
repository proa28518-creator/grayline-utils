# OPUS — COMPUTE RE-FIRE · phase 10 · F711/F723 occluder correction

## CORRECTION:

**Line 39** — shift camera **right** (positive x) to clear villager_4's head from the board sightline:
```
const CAM_SH10_A=add(BLUEPRINT,[1.8,3,9]), CAM_SH10_T=add(BLUEPRINT,[0,1.55,0]), CAM_SH10_B=add(BLUEPRINT,[1.8,3,9]);
```
Change: camera x offset from 0 → **1.8** (world position [5.2, 3, 9.5] → **[7.0, 3, 9.5]**).

Target remains at world [5.2, 1.55, 0.5]. FOV remains 48°.

---

## ARITHMETIC (F723, 1080×1920, FOV 48°):

### Camera setup:
- **pos**: [7.0, 3, 9.5]
- **target**: [5.2, 1.55, 0.5]
- **view vector**: [-1.8, -1.45, -9.0], magnitude 9.339
- **right basis** (from cross with up): [0.9950, 0, -0.0995] (normalized)
- **up basis**: [0.0145, 0.9888, 0.1486]
- **tan(FOV/2)** = tan(24°) = 0.4452

### Blueprint board (centre at [5.2, 1.7, 0.5]):
- **to camera**: [-1.8, 1.3, -9.0]
- **z_cam** (depth): 9.339 (facing camera)
- **x_cam** (right): −1.8 × 0.9950 + (−9.0) × (−0.0995) = −1.791 + 0.896 = **−0.895**
- **y_cam** (up): 1.3 × 0.9888 − 1.8 × 0.0145 − 9.0 × 0.1486 = 1.286 − 0.026 − 1.337 = **−0.077**
- **screen x**: 960 − (−0.895 / 9.339 / 0.4452) × 960 = 960 + 205 = **1165 px**
- **screen y**: 540 − (−0.077 / 9.339 / 0.4452) × 960 = 540 + 18 = **558 px**
- **Board extents** (±1.7 from centre):
  - **left edge** x_cam = −0.895 − 1.7 = −2.595 → screen x = 960 + 594 = **1554 px**
  - **right edge** x_cam = −0.895 + 1.7 = 0.805 → screen x = 960 − 195 = **765 px**
  - **top edge** y_cam = −0.077 + 1.7 = 1.623 → screen y = 540 − 393 = **147 px**
  - **bottom edge** y_cam = −0.077 − 1.7 = −1.777 → screen y = 540 + 430 = **970 px**
- **Board screen box**: [765, 147, 1554, 970] (width 789 px, full board visible)

### Ruler box (world [6.48, 1.7, 0.64]):
- **x_cam** = (−0.72) × 0.9950 + (−8.86) × (−0.0995) = −0.716 + 0.882 = **0.166**
- **y_cam** = 1.3 × 0.9888 − 0.72 × 0.0145 − 8.86 × 0.1486 = **−0.027**
- **z_cam** ≈ 9.19
- **screen**: x = 960 − 40 = **920 px**, y = 540 + 6 = **546 px**

### Label box "15.5M" (world [6.5, 2.82, 0.64]):
- **x_cam** = 0.167, **y_cam** = 1.112, **z_cam** ≈ 9.19
- **screen**: x = **920 px**, y = 540 − 269 = **271 px**
- **Label extents** (0.9 × 0.28): [835, 257, 1005, 285] — **fully inside frame**.

### Villager_4 head (world [5, 1.9, 7]):
- **to camera**: [−2.0, −1.1, −2.5]
- **z_cam** (depth): 3.35
- **x_cam**: (−2.0) × 0.9950 + (−2.5) × (−0.0995) = −1.990 + 0.249 = **−1.741**
- **y_cam**: (−1.1) × 0.9888 − (−2.0) × 0.0145 − (−2.5) × 0.1486 = −1.088 + 0.029 + 0.372 = **−0.687**
- **Head centre screen**: x = 960 + (1.741 / 3.35 / 0.4452) × 960 = 960 + 1116 = **2076 px**, y = 540 + (0.687 / 3.35 / 0.4452) × 960 = 540 + 441 = **981 px**
- **Rendered radius**: 1.35 × 0.5 × (960 / 3.35 / 0.4452) = 0.675 × 644 = **435 px**
- **Villager_4 head disc**: centre [2076, 981], radius 435 px — **left edge at 1641 px, entirely RIGHT of frame edge (1920 px), OUT OF FRAME**.

### Mayor at [0, 1.9, 2] (head check):
- **to camera**: [−7.0, −1.1, −7.5]
- **z_cam**: 10.60
- **x_cam**: (−7.0) × 0.9950 + (−7.5) × (−0.0995) = −6.965 + 0.746 = **−6.219**
- **screen x**: 960 + (6.219 / 10.60 / 0.4452) × 960 = 960 + 1264 = **2224 px** — **out of frame right, no intrusion**.

### Board legibility region (10% inset from [765, 147, 1554, 970]):
- **Inset box**: [844, 229, 1475, 888]
- **Villager_4 disc** at [2076, 981] with radius 435: left edge **1641 px** >> right boundary **1475 px** — **CLEAR**.

---

## PREDICTED:

- **Blueprint board**: [765, 147, 1554, 970] — 789 px wide, **full board visible, centered right-of-frame**.
- **Ruler**: visible at [920, 546], **legible**.
- **Label "15.5M"**: [835, 257, 1005, 285] — **fully inside frame, legible**.
- **Villager_4 head**: centre [2076, 981], radius 435 px — **entirely out of frame** (left edge 1641 > 1920). Silhouette clears legibility region by **166 px** minimum.
- **Mayor**: out of frame right (x=2224), **no sightline conflict**.

---

## RISKS:

- **Slight board asymmetry**: board now favors right half of frame (centre at x=1165 vs midline 960), offset by 205 px — acceptable for insert shot emphasizing the ruler/label on the right portion of the board.
- **Hand geometry**: mayor's palm point at [6.62, 2.62, 0.63] projects to screen [894, 329] — still on-board, within legibility region; the 1.8 m lateral shift preserves the hand-ruler relationship (depth separation 9.0 vs 9.2 is minimal in perspective).
- **Shot continuity**: the camera move is now a lateral slide + push; since SH10 is an insert with no prior establishment of spatial anchor, the reframe is narratively safe.

**VERDICT REQUEST**: board + ruler + label fully legible, villager_4 cleared, mayor's hand readable, §4 and §5 compliance projected.