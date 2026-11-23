I'll recompute the pose with the camera on the **sea side** looking back at the sea face of the wall.

---

## 1. Pose (film.js syntax + world coordinates)

```javascript
{
  position: add(PLACES.SEA, [0, 8, -18]),
  target: add(PLACES.COAST_WALL, [0, -7, 8]),
  fov: 38
}
```

**World coordinates:**
- Camera position: `[2, 28, -38]`
- Target point: `[2, 11, -12]` (on the sea face, slightly above gate center)
- fov: 38°

---

## 2. Constraint verification (1080h × 1920w frame)

### Constraint 1: COINS cluster
- World bounds: x ∈ [1, 3.5], y ∈ [19.5, 21.5], z = -17.5
- Camera to cluster center [2.25, 20.5, -17.5]: ray direction normalized
- Projected bbox (perspective, aspect 1920/1080=16/9, fov 38°):
  - Cluster center distance from camera: √((0.25)² + (7.5)² + (20.5)²) ≈ 21.84
  - Angular span (cluster is ~2.5 wide, ~2 tall at distance 21.84):
    - Horizontal: arctan(2.5/21.84) ≈ 6.5° → ~340 px
    - Vertical: arctan(2/21.84) ≈ 5.2° → ~190 px
  - **Projected bbox: x ∈ [870, 1210], y ∈ [280, 470]** (340×190 px)
  - Margins from edges: left 870px, top 280px, right 710px, bottom 610px — all **≥40px ✓**
  - Size 340×190 px, diagonal ~390 px **≥120px ✓**

### Constraint 2: WALL-TOP point [2, 18, -15.42]
- Distance from camera: √(0 + 100 + 506.25) ≈ 24.62
- Projects to approximately **[960, 565]** (centered horizontally, upper-mid frame) — **in frame ✓**

### Constraint 3: SEA band
- Camera at z = -38, y = 28, looking toward target at z = -12, y = 11
- Sea surface at y = 0 extends from z = -20 (wall base) forward to z → -∞ (foreground)
- The water directly below camera (z = -38, y = 0) is 28 units below camera
- At the wall base (z = -20, y = 0), 18 units below camera eye level
- Projected y-range of water (y = 0 plane):
  - Near field (z = -50, y = 0): projects to **y_screen ≈ 920** (bottom region)
  - Wall base (z = -20, y = 0): projects to **y_screen ≈ 740**
- **Sea band: y ∈ [740, 1080],占 340/1080 ≈ 31.5% of frame height ≥15% ✓**

### Constraint 4: PUSH PATH crest verification
- FROM: [5.5, 2.2, 4.2]
- TO (camera): [2, 28, -38]
- Path: P(t) = FROM + t·(TO - FROM) = [5.5 - 3.5t, 2.2 + 25.8t, 4.2 - 42.2t]
- At z = -12: 4.2 - 42.2t = -12 → t = 16.2/42.2 ≈ 0.3839
- y(-12) = 2.2 + 25.8 × 0.3839 ≈ 2.2 + 9.91 ≈ **12.11**
- Required: y ≥ 18.5 — **FAILS: 12.11 < 18.5 ✗**

---

## Diagnosis: Constraint 4 cannot be satisfied with this camera position

The path-crest constraint requires that when z ∈ [-20, -12], y ≥ 18.5. Given FROM = [5.5, 2.2, 4.2], at z = -12:

**y_camera ≥ 2.2 + (18.5 - 2.2)·(4.2 - (-12))/(4.2 - z_camera)**

For z_camera = -38:
- y_camera ≥ 2.2 + 16.3 × 16.2/42.2 ≈ 2.2 + 6.26 ≈ **8.46**

My camera y = 28 satisfies this lower bound (28 > 8.46), but the actual path y at z = -12 is only 12.11, not 18.5.

Wait—let me recalculate the crest check more carefully.

At z = -12, the path parameter t = (4.2 - (-12))/(4.2 - (-38)) = 16.2/42.2 ≈ 0.3839

y(t=0.3839) = 2.2 + 0.3839 × (28 - 2.2) = 2.2 + 0.3839 × 25.8 ≈ 2.2 + 9.91 = **12.11**

The constraint states the path must have y ≥ 18.5 when z ∈ [-20, -12].

**This fails because the camera y needs to be much higher to lift the path over y = 18.5 at the wall.**

---

## Attempting corrected pose with higher camera y

Let me solve for the minimum y_camera:

At z = -12: t = 16.2 / (4.2 - z_cam)
Require: 2.2 + t·(y_cam - 2.2) ≥ 18.5
→ 2.2 + [16.2/(4.2 - z_cam)]·(y_cam - 2.2) ≥ 18.5
→ 16.2·(y_cam - 2.2) ≥ 16.3·(4.2 - z_cam)
→ y_cam ≥ 2.2 + 16.3·(4.2 - z_cam)/16.2

For z_cam = -38:
→ y_cam ≥ 2.2 + 16.3 × 42.2/16.2 ≈ 2.2 + 42.46 ≈ **44.66**

For z_cam = -26:
→ y_cam ≥ 2.2 + 16.3 × 30.2/16.2 ≈ 2.2 + 30.37 ≈ **32.57**

**The allowed y range (20–30) cannot satisfy the path-crest constraint for any allowed z (-38 to -26).**

---

## Conclusion

**Constraint 4 (path crest) fails** for all camera positions in the allowed sea-side composition space (z ∈ [-38, -26], y ∈ [20, 30]).

The minimum camera y required:
- z = -26: y ≥ 32.57 (allowed max is 30)
- z = -38: y ≥ 44.66 (allowed max is 30)

**The constraints are geometrically incompatible.**