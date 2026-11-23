## CORRECTION:

```
CAM_SH09_T = [0, 2.47, 2]
```

Change target y from 1.55 to 2.47 (Δy = +0.92).

---

## ARITHMETIC:

**Measured response slope** (model centre y-shift per unit target y):

- Target y = 1.55 → model centres: F669 (540, 679), F687 (540, 653)
- Target y = 0.635 → model centres: F669 (540, −65), F687 (540, −136)
- Δ target y = 0.635 − 1.55 = −0.915
- Δ model y: F669 = −65 − 679 = −744 px; F687 = −136 − 653 = −789 px
- Slope: F669 = −744 / −0.915 = **813 px/unit**; F687 = −789 / −0.915 = **862 px/unit**

**Predicted model centres at target y = 2.47:**

- Δy from baseline (1.55) = 2.47 − 1.55 = +0.92
- F669: 679 + (813 × 0.92) = 679 + 748 = **1427 px**
- F687: 653 + (862 × 0.92) = 653 + 793 = **1446 px**

**Predicted model disc specs:**

- F669: centre (540, 1427), diameter 828 → radius 414
- F687: centre (540, 1446), diameter 897 → radius 448.5

**Predicted rendered disc (apply measured family offset and radius scaling):**

- Render offset: F669 −576px, F687 −623px; radius scale 1.06

F669 render:
- Centre: (540, 1427 − 576) = **(540, 851)**
- Radius: 414 × 1.06 = **439 px**
- Bounding box: x [101, 979], y [412, 1290]
- Margins: left 101, right 101, top 412, bottom 630 — **all ≥40px ✓**

F687 render:
- Centre: (540, 1446 − 623) = **(540, 823)**
- Radius: 448.5 × 1.06 = **475 px**
- Bounding box: x [65, 1015], y [348, 1298]
- Margins: left 65, right 65, top 348, bottom 622 — **all ≥40px ✓**

**Tightest margin:** 65px (F687 left/right).

---

## PREDICTED:

At target y = 2.47, both F669 and F687 render the mayor's head fully in frame with the head larger and lower in screen space than the original. F669 disc centred at (540, 851) radius 439; F687 disc centred at (540, 823) radius 475. Push-in preserved: F687 is tighter (larger disc, 475 vs 439) and climbs slightly in frame (823 vs 851). Minimum margin 65px at F687 sides. The head occupies roughly the upper half of frame at F669, upper 55% at F687.

---

## RISKS:

1. **Nonlinear camera adjustment**: The measured slopes differ (813 vs 862 px/unit) across a 0.915-unit span; extrapolating +0.92 beyond the measurement range assumes linearity. The lowCams/autoMove rig may exhibit pitch or distance nonlinearity at target y = 2.47 (1.6σ above the high data point).

2. **Render offset family variance**: The two data points show render-vs-model offset drift (−576 → −623 px, +47 over 0.6s / 18 frames). If the offset continues drifting, F687's actual render centre may sit lower than predicted, tightening the top margin.

3. **Tight side margins at F687**: 65px is 1.6× the §4 minimum but only 6% of frame width. Any unexpected lateral drift (the x-centres were stable in measurements, but target y may couple to x via the rig) risks edge crop.

4. **Aspect/composition**: Raising target y = 2.47 tips the camera upward; depending on the mayor's torso/shoulder geometry and background elements at world y < 1.5, the lower frame may gain unwanted staging (desk edge, floor seam). Not measurable from head data alone.

5. **§4 face rule confidence**: Predicted discs are large (diameter 878–950px, 46–49% of frame height) and well-centered vertically (y = 823–851, within middle third). Crown/chin should clear edges comfortably, but §4 forbids *any* face cut — the 65px margin at F687 leaves 14% buffer on a 475px radius (0.14 × 475 ≈ 66px), so a 2px model error or 1px render shift touches the limit.

**Recommendation**: If fleet re-probe is cheap, verify F687 at target y = 2.47 before final commit. If the left/right margin falls below 50px, consider target y = 2.42 (trades 40px top margin at F669 for +25px side margin at F687 via reduced disc size).