# GLM SEAT — BRIEF · phase 31 · SH17 DATA FIX: rot keys must carry the settled `at`

You are the GLM build seat for the film "fudai-wall" (project
`projects/fudai-wall/`, branch `ui/unified-interface`). You AUTHOR the fix; the
driver applies your output verbatim and judges it with measured fleet evidence.
ONE cause, ONE change. Output ONLY the two replacement prop lines, verbatim,
ready to paste — nothing else.

## The mechanism (measured, phase 30 — fleet track run 45177077929 + engine code)

The engine's placement (`lib/stage.js` + `lib/film/props.js` `placeProp`) resolves
a prop from its GOVERNING KEY WHOLESALE: placement keys are the keys carrying any
of `in/owner/at/rot/drop`; the governing key at t is the last such key ≤ t, and
when a key governs, ONLY that key's fields are passed (base = {}), so the world
branch reads `at = P.at || [0,0,0]`. **A key that carries `rot` but no `at`
therefore resets the prop's position to the world origin [0,0,0]** (blended over
±0.1 s around the key). Measured on the fleet track: boat_b slides to [0,0,0]
across its rot key at t=39.95 and sits there from F1202 (t=40.07) through F1215
and beyond; boat_a does the same across its rot key at t=40.10, at [0,0,0] from
F1206 (t=40.20). The staging audit cannot see this class (it merges key fields
independently); the fleet track + stills are the judges.

## The exact current entries (film.js lines 71–72, extracted verbatim)

```js
 {id:'boat_sh17_a',kind:'boat',in:'world',at:p('SEA',[-3.5,.15,4]),rot:[0,0,0],keys:[{t:'line:15.start',at:p('SEA',[-3.5,.15,4]),rot:[0,0,0]},{t:39.90,at:p('SEA',[-3.5,.02,4])},{t:40.10,rot:[0,0,14]}]},
 {id:'boat_sh17_b',kind:'boat',in:'world',at:p('SEA',[2.5,.15,7]),rot:[0,0,0],keys:[{t:'line:15.start',at:p('SEA',[2.5,.15,7]),rot:[0,0,0]},{t:39.70,at:p('SEA',[2.5,.02,7])},{t:39.95,rot:[0,0,-11]}]},
```

Verified world positions (SEA anchor = [0,0,-44]): boat_a settles at
[-3.5, 0.02, -40] (its 39.90 key: SEA+[-3.5,.02,4]); boat_b settles at
[2.5, 0.02, -37] (its 39.70 key: SEA+[2.5,.02,7]).

## The single required change

Each boat's rot-only key gains the SAME `at` value as that boat's settle key —
nothing else moves:

- boat_a: `{t:40.10,rot:[0,0,14]}` → `{t:40.10,at:p('SEA',[-3.5,.02,4]),rot:[0,0,14]}`
- boat_b: `{t:39.95,rot:[0,0,-11]}` → `{t:39.95,at:p('SEA',[2.5,.02,7]),rot:[0,0,-11]}`

No other key, no camera, no sea_sheet change, no other prop, no other line.
Every other character of the two lines must stay byte-identical (ids, kinds,
entry-level `at`/`rot`, the start keys, the settle keys, times, rot values).

## Acceptance (written into this brief; the driver measures it on the fleet)

1. Fleet track over SH17 (spec `track:1178:1222`): boat_b holds [2.5, 0.02, -37]
   and boat_a holds [-3.5, 0.02, -40] at every frame from their rot keys through
   F1215 — neither prop visits [0,0,0] at any frame.
2. Fleet stills F1197/F1215: both boats present at their settled positions in the
   rendered frames (pixel/eye evidence).
3. Staging audit + D1/D2 for the record: D1/D2 stays at ZERO lines; the SH17
   staging readings are unchanged from baseline except as engine-truth now
   matches them; F1188's line byte-identical (parked, untouched).

## Reply format (exact)

Output the two complete replacement lines for film.js lines 71–72, verbatim,
one per line, inside one code block. Nothing else — no explanation, no restated
baseline, no claims about running anything.
