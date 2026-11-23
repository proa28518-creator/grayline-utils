# OPUS — HUNT BRIEF · phase 9 · cause: SIGN TEXT (foreign template text on every sign)

You are Opus, the build hunter in Layla's production office for the film
"fudai-wall" (chunk 2: SH04–SH12). Standing method — read and obey, do not
re-derive: studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3
(one cause, one change; a pass ends only on a fresh critic's VERDICT: YES), §4,
§5; `.suite/critic/CRITIC_PROTOCOL.md` §7/§7.1/§7.2; `lessons/build.md`.
This is ONE cause. Return a SPEC only — you touch no files.

## The fault (critic rounds 7 AND 8, BLOCKING both times)

Every sign in the film prints the foreign template subtitle **"RED CANYON SHORT
LINE"** under its text (frames F241, F288, F474, F870). Cause, proven from
source: the prop loader (`lib/film/props.js`, `makeProp`) resolves a kind in
the order **engine/props/<kind>.js FIRST**, then the film's own props folder.
The film-local kind `sign` (`scenes/props/sign.js` — a clean canvas board: text
only, NO subtitle; board centre at group y = (post ? leg : 0) + h/2) is
therefore SHADOWED by `engine/props/sign.js` (a railroad sign that prints the
subtitle). All five text signs in `scenes/film.js` use `kind:'sign'`:

- popsign — text '3,000', w 3.4, h 1.5, post 0, at COAST_VILLAGE+[0,3,-1]
- moneysign — text '$30M', w 2.6, h 1.1, post 1, leg 2.2, at COAST_WALL+[0,0,3.4]
- sticker_a — text '10M', w 1.7, h .95, post 0, at NEIGHBOR_COAST+[-3,7,2]
- sticker_b — text '10M', w 1.7, h .95, post 0, at NEIGHBOR_COAST+[3,7,2]
- mocksign — text 'أغبى مشروع', w 4.2, h 2.4, post 0, bg '#9a7047', fg '#f5e9d0',
  rot [4,0,-2], at COAST_WALL+[-6,12.8,1.8]

## The planned fix (hunt THIS)

Rename the film-local kind: copy `scenes/props/sign.js` to
`scenes/props/boardsign.js` (byte-identical build), change the five film.js
prop entries to `kind:'boardsign'`, and reconcile the staging audit
(`tools/audit_staging.mjs`, `propBox`): its sign branch currently models
`box(add(a,[0,1.25+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.1],r)` — the ENGINE sign's
geometry. The film-local build's board centre is at (post?leg:0)+h/2 with board
depth .12 — the audit model must match the film-local build after the rename.

## Your hunt — answer each, with evidence

1. Every reference to the kind string 'sign' or the sign props anywhere the
   rename must also reach (tools, scenes, lib, specs, set dressing in
   `scenes/set.js` — does the set itself build any sign-kind props?).
2. Traps in the film-local build itself: does it honour every opt the five
   entries pass (text, w, h, post, leg, bg, fg, rot)? Any opt it ignores that
   the engine kind honoured (e.g. texture size, face plane offset)?
3. Geometry delta: engine board vs film-local board — centre height, depth,
   post positions — per prop (post 0 vs post 1 differ). What EXACTLY changes
   on screen for each of the five signs, and does any audit moment's prop box
   change size/position enough to flip a currently-passing check?
4. The audit reconciliation: the exact replacement box formula for
   `kind:'boardsign'` in propBox, derived from the film-local build code.
5. Acceptance for the Codex session that will apply this: the checklist the
   driver re-judges with (audits + which fleet frames re-probed + what the eye
   must see: the five texts with NO subtitle).

## Output form

`VERDICT: APPLY AS PLANNED | APPLY WITH FIXES | DO NOT APPLY` — then findings
numbered, each BLOCKING/SERIOUS/MINOR with the evidence, then the corrected
spec (exact file changes, in order) if not APPLY AS PLANNED. Plain text only.
