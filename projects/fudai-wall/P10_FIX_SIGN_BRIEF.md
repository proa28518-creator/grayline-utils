# CODEX SEAT — APPLY BRIEF · phase 10 · cause: SIGN TEXT (boardsign rename)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, repo
`proa28518-creator/grayline-utils`, branch `ui/unified-interface`.
Standing method: studio `AGENTS.md`; RULES.md §3 (one cause, one change),
§4, §5; `lessons/build.md`. This session applies ONE cause: the film-local
sign kind is shadowed by the engine kind, so every sign renders the foreign
subtitle "RED CANYON SHORT LINE". The fix was hunted by the Opus seat:
VERDICT APPLY WITH FIXES (`P10_OPUS_SIGN_HUNT_OUT.md`). Apply its corrected
spec EXACTLY:

1. Copy `scenes/props/sign.js` → `scenes/props/boardsign.js` (byte-identical;
   no edits to the build code). Head the copy with a seat-attribution comment
   line at the very top: `// Author: Codex seat · brief: P10_FIX_SIGN_BRIEF.md · date: 2026-11-23 · byte-identical copy of scenes/props/sign.js (film-local kind rename, Opus hunt APPLY WITH FIXES).`
2. `scenes/film.js`: change `kind:'sign'` → `kind:'boardsign'` in exactly the
   five prop entries: popsign (line ~93), moneysign (~97), sticker_a (~101),
   sticker_b (~102), mocksign (~105). Nothing else in film.js.
3. `tools/audit_staging.mjs` line ~108: replace
   `if(kind==='sign')B=box(add(a,[0,1.25+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.1],r);`
   with
   `if(kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);`
4. `tools/audit_pixels.mjs` line ~102: change
   `if(kind==='sign'||kind==='boardsign')` → `if(kind==='boardsign')`.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
