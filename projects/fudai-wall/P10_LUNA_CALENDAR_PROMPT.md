# LUNA — COMPUTE ITERATION · phase 10 · cause: F345/F414 (calendar occluded by crane_b)

You are Luna, an independent compute/verification seat in Layla's production office for the film "fudai-wall" (chunk 2). This is the ONE quality iteration on your own phase-9 correction for this cause. Computed values only — you touch no files. Plain text only, no tool calls, no simulated execution.

Standing law (obey): RULES §3 (one cause, one change), §4 (PROP GUARD — a prop in a place is in every shot of that place; nothing deleted or teleported), §5.

## Exact scene data (verbatim from scenes/film.js; COAST_WALL = [0,0,-16])

- crane_a: at COAST_WALL+[2,0,2] = world [2,0,-14], rot [0,15,0]
- crane_b: at COAST_WALL+[13,0,3] = world [13,0,-13], rot [0,-20,0]
- calendar: at COAST_WALL+[13,0,2] = world [13,0,-14], page keys advance 0→11 across line 4
- measure: at COAST_WALL+[16,0,2] = world [16,0,-14], h keys .8 → 18 at line:4.word:10, label '15.5M'
- money: at COAST_WALL+[0,0,3]; moneysign at COAST_WALL+[0,0,3.4]

## Your phase-9 correction (for the record)

Move crane_b to world [16,0,-13], yaw −20° → 0°. Your arithmetic predicted the tower clears the calendar's screen strip by ~40–80 px at F345 and ~20–40 px at F414.

## The driver's measured after-state (pixel gate's geometric model — why this iteration exists)

1. **Overlap still over threshold.** Modelling your after-state with the FULL crane box (tower + jib sweep at height ~16, not the tower alone), the crane_b box still covers **14–35%** of the calendar's legibility rect across F345/F414. The gate threshold is **≤10%**. Your strip-clearance arithmetic treated the tower only; the jib and the box's vertical extent still cover the calendar's rect.
2. **Measure sightline risk at x=16.** crane_b at world [16,0,-13] stands at the SAME x as the measure (world [16,0,-14]) and 1 D in front of it (z −13 vs −14, cameras are village-side). At F414 the measure must read rising to its '15.5M' label — a tower 1 D in front of it on the same x is inside the measure's sightline from the F414 camera (pos ≈ [17.63,16.50,18]).

## Your task

Compute ONE revised single change (crane_b position/yaw and/or the calendar's position — the cause is the crane/calendar collision; either lever, or both as one staging change, is in scope; nothing else moves) such that, with FULL projected boxes (tower + jib) at BOTH F345 and F414:
- crane_b's box covers **≤10%** of the calendar's legibility rect;
- the measure's plate + rising line at F414 is unobstructed (no crane geometry inside its screen box);
- crane_a's F288 framing is untouched (crane_a does not move);
- the calendar's page digit stays fully legible at both frames (its screen box fully in frame).

Show the projection arithmetic with the same convention you used before (forward = normalize(target − pos), right = forward × up, scale = d/(960·tan(fov/2)) — or the audit's screen() formula if you prefer; state which). Cameras: F345 pos [4.22,16.50,18] fov 44.10; F414 pos [17.63,16.50,18] fov 35.52 (audit-sampled poses). Calendar box half-size [1.1, 1.75, 0.1] at [13,0,-14]. Crane_b: tower 1.2 wide, ground to y=16, jib from tower top along its yaw direction.

## Output form

`CORRECTION:` the exact film.js change · `ARITHMETIC:` before/after boxes at both frames, incl. the overlap % and the measure check · `PREDICTED:` · `RISKS:`. If no single change satisfies all four constraints, say so plainly and give the closest option with its measured shortfall.
