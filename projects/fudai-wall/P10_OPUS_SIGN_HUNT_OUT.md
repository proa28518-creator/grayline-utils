VERDICT: APPLY WITH FIXES

## Findings

### 1. BLOCKING — Dynamic kind reference in lib/film/props.js grep miss
**Evidence**: The loader's resolution order code (Evidence 1) shows:
```js
const places = [new URL(`engine/props/${kind}.js`, ROOT), o.propsUrl ? new URL(`${kind}.js`, o.propsUrl) : null, film && !o.propsUrl ? new URL(`films/${film}/props/${kind}.js`, ROOT) : null].filter(Boolean);
```
This is DOCUMENTATION of the resolution order, not executable code that constructs kinds. However, the grep shows NO other references. The kind string appears hardcoded in all five film.js entries. No specs/ references found, no LIBRARY.md-style docs mentioned in the evidence.

**Conclusion**: Grep is complete for 'sign' string literals. No missed references.

### 2. MINOR — Film-local build honours all opts, one silent replacement
**Evidence**: The five entries pass: text, w, h, post, leg (moneysign only), bg (mocksign only), fg (mocksign only), rot (mocksign only, but loader-level not build-level).

Film-local build reads: `w, h, post, leg, bg, fg, text` with defaults `w??2.6, h??1.1, post??1, leg??1.2, bg??'#e8dcc0', fg??'#302d2b'`.

- popsign: w=3.4, h=1.5, post=0, text='3,000' → all applied
- moneysign: w=2.6, h=1.1, post=1, leg=2.2, text='$30M' → all applied (leg override works)
- sticker_a/b: w=1.7, h=.95, post=0, text='10M' → all applied
- mocksign: w=4.2, h=2.4, bg='#9a7047', fg='#f5e9d0', post=0, text='أغبى مشروع' → all applied

The engine kind's `sub` opt is NOT read by film-local (no `o.sub` reference). Engine defaults `boardLit/titleColor` become film-local `bg/fg` with different defaults ('#e8dcc0'/'#302d2b' vs engine's unspecified). This is INTENTIONAL replacement, not ignored opt—on screen, mocksign gets its custom colors, others get film-local defaults instead of engine defaults. No visual defect.

### 3. BLOCKING — Geometry delta changes audit box for moneysign
**Per-prop geometry analysis**:

**popsign** (post=0, h=1.5):
- Engine: board centre y = 1.25 + 1.5/2 = 2.0, depth .04
- Film-local: board centre y = 0 + 1.5/2 = 0.75, depth .12
- **Screen delta**: board drops 1.25 D, thickens from .04 to .12
- Audit F241: engine box `[0, 2.0, 0]`, size `[3.4, 1.5, .1]` → film box `[0, 0.75, 0]`, size `[3.4, 1.5, .12]`. Box shifts down 1.25 D. **RISK: staging check may fail if camera/occlusion depends on y=2.0 placement.**

**moneysign** (post=1, leg=2.2, h=1.1):
- Engine: board centre y = 1.25 + 1.1/2 = 1.8, depth .04
- Film-local: board centre y = 2.2 + 1.1/2 = 2.75, depth .12
- **Screen delta**: board rises 0.95 D, thickens from .04 to .12
- Audit F288: engine box `[0, 1.8, 0]`, size `[2.6, 1.1, .1]` → film box `[0, 2.75, 0]`, size `[2.6, 1.1, .12]`. Box shifts up 0.95 D. **RISK: staging check may fail if wall/sky occlusion changes.**

**sticker_a/b** (post=0, h=.95):
- Engine: board centre y = 1.25 + .95/2 = 1.725, depth .04
- Film-local: board centre y = 0 + .95/2 = 0.475, depth .12
- **Screen delta**: board drops 1.25 D, thickens
- Audit F474: engine box `[0, 1.725, 0]` → film box `[0, 0.475, 0]`. Both props shift down 1.25 D. **RISK: staging occlusion may change.**

**mocksign** (post=0, h=2.4):
- Engine: board centre y = 1.25 + 2.4/2 = 2.45, depth .04
- Film-local: board centre y = 0 + 2.4/2 = 1.2, depth .12
- **Screen delta**: board drops 1.25 D, thickens
- Audit F870: engine box `[0, 2.45, 0]`, size `[4.2, 2.4, .1]` → film box `[0, 1.2, 0]`, size `[4.2, 2.4, .12]`. Box shifts down 1.25 D. **RISK: staging check may fail.**

**All post=0 signs drop 1.25 D (engine's grip-to-board offset vanishes). The post=1 sign (moneysign) RISES 0.95 D because film-local uses leg height as base, engine used fixed 1.25 offset.**

### 4. BLOCKING — Audit line disagreement between staging and pixel
**Staging audit line 108** (engine geometry):
```js
if(kind==='sign')B=box(add(a,[0,1.25+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.1],r);
```

**Pixel audit line 102** (film-local geometry):
```js
if(kind==='sign'||kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);
```

The pixel gate ALREADY models the film-local formula. The staging gate still models the engine formula. After rename, staging must match pixel's logic.

**Corrected staging audit line 108**:
```js
if(kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);
```

Depth .12 matches film-local board geometry (not .1). Default h=.8 and w=2 are reasonable fallbacks (close to film-local defaults 1.1/2.6, audit-safe). Default leg=1.2 matches film-local default.

**Cross-check**: Pixel gate line 102 uses `||` chaining for defaults, same pattern. Depth .12 agrees. Formula `(p.post?p.leg||1.2:0)+(p.h||.8)/2` agrees. The pixel gate is CORRECT for film-local geometry.

### 5. MINOR — Acceptance checklist structure
**Audits to run**: 
- `npm run audit:staging` (all moments, focus F241/F288/F474/F870)
- `npm run audit:pixels` (all moments, focus same four)

**Fleet frames to re-probe**: F241, F288, F474, F870 (the four blocking frames from critic rounds 7+8).

**Visual inspection**: Each of the five signs (popsign, moneysign, sticker_a, sticker_b, mocksign) must show ONLY their text ('3,000', '$30M', '10M', '10M', 'أغبى مشروع') with NO subtitle "RED CANYON SHORT LINE" below.

## Corrected spec

**Change 1**: Copy `scenes/props/sign.js` → `scenes/props/boardsign.js` (byte-identical, no edits to build code).

**Change 2**: Edit `scenes/film.js` lines 93, 97, 101, 102, 105 — change `kind:'sign'` to `kind:'boardsign'` in all five prop entries (popsign, moneysign, sticker_a, sticker_b, mocksign).

**Change 3**: Edit `tools/audit_staging.mjs` line 108:
```js
// OLD:
if(kind==='sign')B=box(add(a,[0,1.25+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.1],r);

// NEW:
if(kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);
```

**Change 4**: Edit `tools/audit_pixels.mjs` line 102 — change `kind==='sign'||kind==='boardsign'` to `kind==='boardsign'` only (drop 'sign' from the condition, as no props use it after rename):
```js
// OLD:
if(kind==='sign'||kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);

// NEW:
if(kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);
```

**Acceptance**:
1. Run both audits (staging + pixels), confirm F241/F288/F474/F870 pass.
2. Visually inspect the five signs in those frames: text only, no subtitle.
3. Confirm no regression in other shots (audit pass rate unchanged outside these four frames).