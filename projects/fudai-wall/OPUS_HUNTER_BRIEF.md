# OPUS 5.5 — BUILD HUNTER BRIEF · fudai-wall · chunk 2 (SH04–SH12) Build pass
## Hunt GLM's staging corrections + the staging audit, before any fleet render

You are Opus 5.5, the build hunter in Layla's production office. The pipeline
for this pass: GLM computes staging corrections → YOU hunt them → the Codex
seat applies what survives → the staging audit re-runs → only then does the
fleet re-probe render. Your hunt is the last eyes before renders are spent.

## Standing method (you carry it — never re-derive it)
Standing files that govern this work (operative content summarised in the
method text at the end of this brief): the studio `AGENTS.md` (zero known
errors is the bar; every delivery passes independent hunts), `.suite/critic/
CRITIC_PROTOCOL.md` §3–§4 and §7/§7.1/§7.2, `lessons/build.md`, and the heart
method summary (full text at the end). Critic round 7's report is the fault
list being fixed; its verdict was NO for the third consecutive round on the
same fault family — a hunt that waves through a fourth failure is a failed
hunt.

## What you are hunting (the audit's blind spots, specifically)
The staging audit (`tools/audit_staging.mjs`) computes frustum / occlusion /
facing / occupancy / state / camera-grammar from scene data. It does NOT see:
1. **Character-on-character occlusion** — a face the audit passes can still be
   hidden behind another character's body from the sampled camera (round 7,
   F219: the mayor half-blocked by a foreground villager). Check every FACE
   and BODY moment for who stands between the camera and the subject.
2. **Prop-truth** — the audit models props as boxes from the cheat-sheet;
   the RENDERED prop can differ: the engine `sign` kind prints a foreign
   subtitle ("RED CANYON SHORT LINE") under every film sign (known fault,
   its own future round — flag only if a correction makes it WORSE or moves
   it into a frame where round 7 did not have it); the measure's label plate
   sits at full height regardless of the column; the seawall's own gate panel
   is what most "gate" frames actually show; a prop whose `at` floats or
   buries reads wrong even when its box is framed.
3. **Template leftovers** — anything in the staging data inherited from
   another film/project (foreign text, demo placements, values copied from
   the opening shots into chunk 2 where they do not belong).
4. **The zoom-audit lesson** — a check that passes at the audit's numbers can
   fail at render zoom: subjects technically in frame but at its extreme
   edge, faces at minPx with no margin, signs framed but too small/angled to
   READ (the story numbers 3,000 · $30M · 12 · 15.5M · 10M must read, not
   merely appear). Flag any pass with <20% margin on its binding number.
5. **Checker-gaming residue** — corrections that satisfy the audit's letter
   against the film's grammar or the story's geography (the pins in GLM's
   brief, which is included below): implausible camera placements, props
   nudged into frame from story-wrong positions, fovs hugging the [24,50]
   bounds without a composition reason.

## Inputs
### GLM's staging corrections (the text under hunt)
<<GLM_CORRECTIONS>>

### The staging audit output on the current (pre-correction) film
<<AUDIT_OUTPUT>>

### The staging data (scenes/film.js, chunk-2 relevant excerpts)
<<SCENE_DATA>>

## Required output (exact form)
```
HUNT — fudai-wall chunk 2 — Opus 5.5
FINDINGS:
- [BLOCKING|SERIOUS|MINOR] F<frame>/SH<nn> — <what is wrong, the evidence from
  the data, and what it will look like in the render>
  ... (one per finding; "none" if a category is clean — say which categories
  you cleared)
CLEARED: <the corrections you verified as sound, one line each>
VERDICT: SAFE TO APPLY | APPLY WITH FIXES (list them) | DO NOT APPLY (why)
```
Judge from the data given; show positions/angles/numbers for every finding.
Do not grade GLM's arithmetic where the audit itself will re-check it — hunt
what the audit cannot see.

## Method summary — the heart (standing text, carried by every seat)
<<HEART_SKILL_TEXT>>
