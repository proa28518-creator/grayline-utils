# GLM SEAT — BRIEF · phase 15 · pixel-gate place-key fix: mirror the staging audit's posAt place semantics into tools/audit_pixels.mjs (TOOLING FIX)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your text verbatim and judges it with the hard acceptance test
below. RULES §3: one cause, one change. **NO LOCAL RENDERS** —
you return text only. This is a surgical mirror completion, not a
redesign: the gate's own header declares its geometry preamble a
mirror of `tools/audit_staging.mjs`; one function was left
unmirrored. You complete the mirror — nothing else.

## Previous verdict this brief cites (hard-gate requirement)
Commit `1a9173e` — phase 15 item 17 PARKED-ESCALATED (its verdict
commit; nothing applied). The last application verdict is
`7544fdc` (boat ROT CLOSED). No judgement is pending; this brief
may fire.

## The defect (measured, recorded at phase 14 item 15)
The gate measures cast at BASE positions, not keyed posAt(t): its
`posAt` considers ONLY walk events and has no place-event branch.
The staging audit received place semantics in phase 12 (cause 3);
the gate never did. On item 15's judged tree (mocker_c place-keyed
to [4.4,-2.0] inside the SH10 window), the gate prints a FALSE
geometric overlap of 17% by mocker_c on F711/F723 — while its own
measured-disc overlap reads 0% and the eye reads the plate whole.
The false line fails both frames in the gate's table.

## The current function (tools/audit_pixels.mjs, verbatim — the ONLY function you replace)
```js
function posAt(id, t) {
  const c = cast[id], base = c.at, walks = (acts[id]?.walk || []).filter(w => t >= w.t0).sort((a,b)=>a.t0-b.t0);
  if (!walks.length) return [base[0], 0, base[1]];
  const w = walks.at(-1), path = w.path, speed = w.speed || 1;
  let remain = Math.max(0, t - w.t0) * speed;
  for (let i=1;i<path.length;i++) {
    const a=path[i-1], b=path[i], d=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if (remain <= d) { const u=d ? remain/d:1; return [a[0]+(b[0]-a[0])*u,0,a[1]+(b[1]-a[1])*u]; }
    remain -= d;
  }
  const p=path.at(-1); return [p[0],0,p[1]];
}
```

## The replacement (the staging audit's posAt, verbatim — this exact text)
```js
function posAt(id, t) {
  const c = cast[id], base = c.at, a = acts[id] || {};
  const events = [
    ...(a.place || []).filter(k => t >= k.t).map(k => ({ ...k, kind: 'place', order: 0 })),
    ...(a.walk || []).filter(w => t >= w.t0).map(w => ({ ...w, t: w.t0, kind: 'walk', order: 1 }))
  ].sort((x,y) => x.t-y.t || x.order-y.order);
  const event = events.at(-1);
  if (!event) return [base[0], 0, base[1]];
  if (event.kind === 'place') return [event.at[0], event.y ?? 0, event.at[1]];
  const w = event, path = w.path, speed = w.speed || 1;
  let remain = Math.max(0, t - w.t0) * speed;
  for (let i=1;i<path.length;i++) {
    const a=path[i-1], b=path[i], d=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if (remain <= d) { const u=d ? remain/d:1; return [a[0]+(b[0]-a[0])*u,0,a[1]+(b[1]-a[1])*u]; }
    remain -= d;
  }
  const p=path.at(-1); return [p[0],0,p[1]];
}
```
The gate's `acts` is resolved identically to the staging audit's
(`resolveTimes` per member), so this is a drop-in mirror. Do not
adapt it, rename its variables, or "improve" it.

## The header line (seat attribution — author exactly this one comment line, inserted into the file's top comment block, after the AUTHORSHIP line)
`// Phase-15 P15_GLM_GATEFIX_BRIEF.md (GLM seat): posAt place-key semantics mirrored from tools/audit_staging.mjs — the gate now measures cast at keyed posAt(t), not base positions.`

## Hard acceptance test (the driver runs it; your reply predicts it)
Gate run: `node tools/audit_pixels.mjs --stills probes/chunk2e/stills --frames 219,241,288,345,414,474,537,570,590,669,687,711,723,768,822,870`
Baseline on the current judged tree (driver-measured — reproduce the F711/F723 lines in your reply):
- F711: `blueprint occlusion PIXEL FAIL (geometric overlap 17% by mocker_c disc; measured-disc overlap 0%)`, frame verdict FAIL on that line (SET PASS 38.4%/58.6%).
- F723: `blueprint occlusion PIXEL FAIL (geometric overlap 17% by mocker_c disc; measured-disc overlap 0%)`, frame verdict FAIL on that line (SET PASS 39.6%/57.3%).
- Every other line of the table stands as the phase-11 validation table (F219/F241 FAIL ambiguous disc; F288/F345/F414/F669/F687/F870 PASS; F474/F537/F570/F590/F768/F822 FAIL on their standing SET/face readings; gate total FAIL (10 frames)).
After your change, REQUIRED:
- F711 and F723 geometric overlap reads **0%** and their occlusion lines read PIXEL PASS (matching measured-disc 0% and the eye verdict that closed item 15); both frames' verdicts become PASS.
- EVERY other line of the table reproduces byte-identical (same readings, same verdicts); gate total becomes FAIL (8 frames) on the two SH04 ambiguous-disc lines and the standing SET/face FAILs alone.
Why only F711/F723 move: inside the judged chunk-2 windows, the only place keys are mocker_c's line:8 entries (SH10); the mockers' line:24 entries sit in SH26, which this gate run does not judge; every walk/base reading is computed identically by the mirrored function.

## Explicitly NOT in this cause
No other function, threshold, requirement table (FACE_REQ /
PAIR_REQ / OCC_REQ), or line of either tool file changes.
`tools/pixel_measure.py` is not touched. No film file is touched.

## Reply format (exact)
1. BASELINE RESTATED: the F711 + F723 baseline lines above, in your own words.
2. REPLACEMENT FUNCTION: the posAt function, verbatim as specified.
3. HEADER LINE: the comment line, verbatim as specified.
4. PREDICTED TABLE: F711 line, F723 line, both frames' verdicts, the gate total, and a statement that every other line reproduces unchanged.
Nothing else. Do not claim you ran anything.
