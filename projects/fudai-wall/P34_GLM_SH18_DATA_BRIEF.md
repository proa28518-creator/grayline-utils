# GLM SEAT — BRIEF · phase 34 · SH18 DATA FIX: measure_wave's climb must ride on `h`/`full`, not `lineY`

You are the GLM build seat for the film "fudai-wall" (project
`projects/fudai-wall/`, branch `ui/unified-interface`). You AUTHOR the fix; the
driver applies your output verbatim and judges it with measured fleet evidence.
ONE cause, ONE change. Output ONLY the one replacement prop line, verbatim,
ready to paste — nothing else.

## The mechanism (measured, phase 33 + engine code read in phase 34)

The `measure` kind (`scenes/props/measure.js`) builds from `h` and `full` ONLY:
`h = o.h ?? .8`, `full = o.full ?? 18`; the glow is a box of height
`min(h, full)` in `#ffd55c`, the arrow cone `#ffe476` sits at `min(h, full)`,
the label plate `#fff1a4` sits at `y = full`, and the track spans `full`. The
kind NEVER reads `lineY` (that field belongs to blueprint/pencil_mark).

Build opts over time (`lib/stage.js`, propOpts): a key's numeric fields other
than t/in/owner/rot/at/ease/drop/optsOnly are the prop's BUILD OPTS. A field
takes effect AT its key (snap), UNLESS the key carries `ease: s` — then it
ramps from the previous value over s seconds (smoothstep) STARTING at that
key's time; the previous value for the first key is the entry's top-level
field. Working precedent in the same film (chunk-2 wall measure, film.js
line 161): top-level `h:.8, full:18`, rise key
`{t:'line:4.word:10',h:18,ease:1.2}` — a fleet/eye-verified glowing climb.

The `measure_wave` entry's keys carry `lineY` — invisible to the kind — so `h`
stays at the 0.8 default for the whole film: the engine builds a 0.8-unit glow
sliver on an 18-unit track where the declared design (Qwen chunk-3a spec;
staging audit CHUNK3_SIZE [1.5,15,.2]) is a measure whose glow CLIMBS 0 → 15
across line 16. Phase 33's fleet colour census of the rendered F1302:
glow `#ffd55c` 0 px, arrow `#ffe476` 0 px, plate `#fff1a4` 0 px — the glowing
measure does not render at all. This is a DATA divergence, not a camera fault.

## The exact current entry (film.js line 74, extracted verbatim)

```js
 {id:'measure_wave',kind:'measure',in:'world',at:p('SEA',[5,0,-16]),lineY:0,keys:[{t:'line:16.start',lineY:0},{t:'line:16.end',lineY:15}]},
```

Verified facts (against the film's own data, phase 34): SEA anchor =
[0,0,-44], so `at` = world [5,0,-60] (the audit's declared centre). Line 16
(owner's word timings, `audio/clean.json`): start 41.06 s, end 44.81 s —
duration 3.75 s; words «ورجع بموجة عملاقة ارتفاعها 15 متر بالظبط».

## The single required change (dispatcher ruling: option A — entry-local)

Rewrite ONLY the fields named here; every other character of the line stays
byte-identical (id, kind, in, at):

- Top level: `lineY:0` → `h:0,full:15` (the climb starts at 0; `full` = 15 so
  the glow can reach 15 and the track/plate match the declared 15-unit design).
- Start key: `{t:'line:16.start',lineY:0}` → `{t:'line:16.start',h:15,ease:3.75}`
  (the rise is anchored at the line start and eases from the top-level h:0 to
  15 across the line's full 3.75 s — the stage.js propOpts idiom, exactly the
  wall measure's pattern).
- End key: `{t:'line:16.end',lineY:15}` → `{t:'line:16.end',h:15}` (holds 15
  at and after the line end).

No other key, no camera, no wave_sh18 change, no other prop, no other line.
The `measure` KIND is NOT touched (option B declined); chunk-2's wall measure
entry (line 161) is NOT touched.

Predicted result (driver-computed from the propOpts formula, smoothstep):
h(F1257, t=41.90) ≈ 1.9 · h(F1302, t=43.40) ≈ 10.2 · h(F1335, t=44.50) ≈ 14.7
— the glowing measure present and rising across the three judged frames.

## Acceptance (written into this brief; the driver measures it on the fleet)

1. Fleet stills F1257/F1302/F1335 on the applied tree (standing baseline
   camera — the camera candidate is a separate later phase, NOT applied
   here): colour census of F1302 finds glow `#ffd55c` > 0 px, arrow `#ffe476`
   > 0 px, plate `#fff1a4` > 0 px (phase 33 measured 0/0/0); driver eye: the
   glowing measure visibly present and rising across the three stills.
2. D1/D2 audit stays at ZERO lines; staging-audit readings byte-identical to
   baseline (the audit models the declared size and is blind to this class —
   its readings stand for the record; F1188's parked line included).
3. The film.js diff is the measure_wave line only.

## Reply format (exact)

Output the one complete replacement line for film.js line 74, verbatim,
inside one code block. Nothing else — no explanation, no restated baseline,
no claims about running anything.
