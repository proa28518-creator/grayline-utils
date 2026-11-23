# OPUS — HUNT RE-FIRE · phase 10 · cause: SIGN TEXT (foreign template text on every sign)

You are Opus, the build hunter in Layla's production office for the film "fudai-wall" (chunk 2: SH04–SH12). This is a RE-FIRE: your first reply asked for files to be attached. Everything you need is INLINED below as evidence — work from it, do not ask for attachments. ONE cause. Return a SPEC only — you touch no files.

Standing law (inlined, obey): RULES §3 — fix only the biggest gap at its cause, one cause one change; a pass ends only on a fresh critic's VERDICT: YES. §4 — never edit the engine copy (engine/, world/, lib/, specs/); new looks/props go in scenes/; anything in a place is in every shot of it; PROP GUARD. §5 set bar: shot ≥22% detail / ≤80% flat; film median shot ≥28% / ≤78%; ≤40% of shots under.

## The fault (critic rounds 7 AND 8, BLOCKING both times)

Every sign in the film prints the foreign template subtitle **"RED CANYON SHORT LINE"** under its text (frames F241, F288, F474, F870).

## Evidence 1 — the loader's resolution order (lib/film/props.js, verbatim excerpts)

```
// lab/film/props.js: props for films (world space, 1 = head diameter D). `await makeProp(kind, opts)` -> Object3D ...
//   2. engine/props/<kind>.js        (camera umbrella phone book bag ball cup bottle broom fishing_rod flowers letter, + his video's props)
//   3. films/<film>/props/<kind>.js  (opts.film = the film's name; a film's own prop = one new file there)
...
export async function makeProp(kind, o = {}) {
  ...
  // o.propsUrl (the app's page: the film's own props/ folder, e.g. the project's scenes/props/) is looked in before films/<film>/props/
  const places = [new URL(`engine/props/${kind}.js`, ROOT), o.propsUrl ? new URL(`${kind}.js`, o.propsUrl) : null, film && !o.propsUrl ? new URL(`films/${film}/props/${kind}.js`, ROOT) : null].filter(Boolean);
```
So `engine/props/sign.js` resolves FIRST and shadows the film-local `scenes/props/sign.js`.

## Evidence 2 — the film-local build (scenes/props/sign.js, complete)

```js
import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
  const w=o.w??2.6,h=o.h??1.1,post=o.post??1,leg=o.leg??1.2,bg=o.bg??'#e8dcc0',fg=o.fg??'#302d2b',g=new THREE.Group();
  const boardY=(post?leg:0)+h/2, wood=flat('#8a5935','#593b2c');
  const b=part(new THREE.BoxGeometry(w,h,.12),flat(bg),.025); b.position.y=boardY; g.add(b);
  const t=String(o.text??''); const tex=canvasTex(768,320,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';let size=150;c.font=`bold ${size}px sans-serif`;while(c.measureText(t).width>W*.88&&size>20){size-=4;c.font=`bold ${size}px sans-serif`;}c.fillText(t,W/2,H/2,W*.9);});
  const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.12,h-.12),basic('#ffffff',{map:tex}));face.position.set(0,boardY,.066);g.add(face);
  if(post) for(const x of [-w*.34,w*.34]){const p=part(new THREE.BoxGeometry(.12,leg,.12),wood);p.position.set(x,leg/2,0);p.position.set(x,leg/2,0);g.add(p);}
  return finish(g);
}
```
Clean canvas board: text only, NO subtitle. Board centre y = (post ? leg : 0) + h/2; board depth .12; face plane z=.066; posts (when post) at x=±w*.34, height leg. It reads opts: w, h, post, leg, bg, fg, text. (The loader applies entry-level `rot` to the group.)

## Evidence 3 — the engine build (engine/props/sign.js, excerpts)

Header spec: a railroad placard — board about 1.5×.6 D, stick .045 D, board bottom about 1.25 D above the grip; spec opts {kind, w:1.5, h:.6, t:.04, poleR:.022, up:1.25, down:.25, text:'ALL ABOARD!', sub:'RED CANYON SHORT LINE'}. It is a TRACK-DRIVEN character prop (poses from tracks/<char>/props.json, grip point origin). Its canvas face draws title + subtitle:
```js
  const sub = own.sub ?? 'RED CANYON SHORT LINE';
  ... g.fillText(sub, 0, 0);  // at H*.74, under the title
```
It does not know the film opts post/leg/bg/fg (bg/fg equivalents are boardLit/titleColor etc. with different names/defaults).

## Evidence 4 — every reference to the kind (driver's grep, 2026-11-23, scenes/tools/specs/lib)

- scenes/film.js:93 popsign — kind:'sign', text '3,000', w 3.4, h 1.5, post 0, at COAST_VILLAGE+[0,3,-1]
- scenes/film.js:97 moneysign — kind:'sign', text '$30M', w 2.6, h 1.1, post 1, leg 2.2, at COAST_WALL+[0,0,3.4]
- scenes/film.js:101 sticker_a — kind:'sign', text '10M', w 1.7, h .95, post 0, at NEIGHBOR_COAST+[-3,7,2]
- scenes/film.js:102 sticker_b — kind:'sign', text '10M', w 1.7, h .95, post 0, at NEIGHBOR_COAST+[3,7,2]
- scenes/film.js:105 mocksign — kind:'sign', text 'أغبى مشروع', w 4.2, h 2.4, bg '#9a7047', fg '#f5e9d0', post 0, rot [4,0,-2], at COAST_WALL+[-6,12.8,1.8]
- tools/audit_staging.mjs:108 — `if(kind==='sign')B=box(add(a,[0,1.25+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.1],r);` (models the ENGINE geometry: 1.25 offset, depth .1)
- tools/audit_pixels.mjs:102 — `if(kind==='sign'||kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);` (the pixel gate ALREADY models the film-local formula for both kind names)
- scenes/set.js: ZERO references to 'sign' (the set builds no sign-kind props).

## The planned fix (hunt THIS)

Rename the film-local kind: copy scenes/props/sign.js to scenes/props/boardsign.js (byte-identical build), change the five film.js prop entries to kind:'boardsign', and reconcile the staging audit's propBox sign branch (line 108) to the film-local geometry.

## Your hunt — answer each, with evidence from the inlined material

1. Any reference the grep would have missed (dynamic kind strings, specs, LIBRARY.md-style docs that name the kind for future chunks)?
2. Traps in the film-local build: does it honour every opt the five entries pass? Any opt it ignores that matters on screen (the engine kind's defaults it silently replaces)?
3. Geometry delta per prop (post 0 vs post 1): engine board centre (grip + up 1.25 + h/2, depth .04) vs film-local ((post?leg:0)+h/2, depth .12, face z .066). What EXACTLY changes on screen for each of the five signs, and can any audit moment's prop box change enough to flip a currently-passing check (the staging audit moments touching signs: F241 popsign, F288 moneysign, F474 sticker_a/b, F870 mocksign)?
4. The audit reconciliation: the exact replacement line for tools/audit_staging.mjs:108 for kind 'boardsign', derived from the film-local build code. (Note the pixel gate's line 102 as a cross-check — agree or disagree, with reason.)
5. Acceptance checklist for the Codex session that applies this (audits + which fleet frames re-probed + what the eye must see: the five texts with NO subtitle).

## Output form

`VERDICT: APPLY AS PLANNED | APPLY WITH FIXES | DO NOT APPLY` — then findings numbered, each BLOCKING/SERIOUS/MINOR with the evidence, then the corrected spec (exact file changes, in order) if not APPLY AS PLANNED. Plain text only, no tool calls, no simulated execution.
