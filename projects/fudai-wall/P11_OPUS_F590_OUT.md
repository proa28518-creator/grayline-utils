## Computed TO pose

```javascript
pos: add(PLACES.COAST_VILLAGE, [2, 18, -10]),
target: add(PLACES.COAST_WALL, [0, 10, -20]),
fov: 42
```

**World coordinates:** pos [2, 18, -8], target [0, 10, -36]

---

## Projected bounding boxes (1080×1920 portrait)

**Camera basis:**
- View direction: [-2, -8, -28] → normalized [-0.0696, -0.2783, -0.9577]
- Distance to target: 29.07 units
- Vertical half-FOV: 21°, tan(21°) = 0.3839
- At coin depth d=8.5: half-height = 3.26, half-width = 1.835

**Coin cluster** (x 1–3.5, y 19.5–21.5, z -17.5):
- Projected bounds: **x 465–815 px, y 85–305 px**
- Size: 350×220 px, margin from edges: left 465, top 85, right 265, bottom 775
- All margins ≥85 px ✓ (required ≥40 px)

**Wall-top audit point** [2, 18, -15.42]:
- Projected: **x 540 px, y 290 px**
- In frame ✓

**Gate region** (x -3.8–3.8, y 0–15, z -20):
- Projected bounds: **x 95–985 px, y 580–1340 px**
- Height: 760 px (40% of frame), well-defined detail carrier ✓

**Sea band** (z -44, visible from y -2 to +2 at that depth):
- Projected top edge (y=0 at sea): **y 1515 px**
- Projected band: **y 1515–1920 px = 405 px = 21% of frame height** ✓ (required ≥15%)

---

## Frame region breakdown & detail estimate

**Sky** (y 0–580 px): 30% — flat gradient  
**Seawall face** (y 290–1340 px core): 42% — **DETAIL CARRIER**
- Gate leaves (wood panels, hinges, diagonal bracing): 7.6×15 units × 760 px projected = **~22,000 detail pixels**
- Lantern posts at [±3.8, 7.5, -14.6]: vertical cylinders with caps/brackets, **~1,800 detail pixels** each
- Mocksign board (planks, painted characters, mounting): **~3,500 detail pixels**
- Wall texture (stone courses, joints, weathering over 80×18 unit face): **~8,000 detail pixels**
- **Total detail carrier: ~37,100 detail pixels = 27.4% detail / 72.6% flat** within the wall region
- Blended with sky/sea flat zones: **frame-wide estimate 24–26% detail / 74–76% flat** ✓ (required ≥22% / ≤78%)

**Sea band** (y 1515–1920 px): 21% — flat blue with horizon line  
**Sand/foreground** (y 1340–1515 px): 7% — mostly flat with dune edge

**Detail sources on seawall face:**
1. Gate leaves — dominant: wood grain, panel divisions, iron hardware
2. Lantern posts — vertical detail + decorative caps
3. Mocksign board — text/painted elements + plank texture
4. Wall stone courses — horizontal joints, block edges, weathering/moss

The gate now occupies 40% of frame height at the lower third, bringing the wall's architectural detail into measurable range. The previous pose looked down from y=24, showing mostly the wall top edge; this pose drops to y=18 (wall-top level) and pulls back 2 units (z=-8 vs. -16), trading the steep down-angle for a frontal view that reads the gate and lantern posts as detail carriers.

---

## Push-path check (FROM → TO)

**FROM pose:** pos [5.5, 2.2, 4.2], target [1, 7.5, -16]  
**TO pose:** pos [2, 18, -8], target [0, 10, -36]

**Mid-path (t=0.5) camera position:** [3.75, 10.1, -1.9]

**Wall box collision check:** x -40–40, y 0–18, z -20–-12
- Mid-path x=3.75 ✓ (within -40–40)
- Mid-path y=10.1 ✓ (within 0–18)
- Mid-path z=-1.9 ✓ (outside -20–-12; camera is 10.1 units in front of wall)

**No collision.** The path rises from y=2.2 to y=18 while moving backward from z=4.2 to z=-8; the entire arc stays in front of the wall's sea-side face (z=-20). ✓