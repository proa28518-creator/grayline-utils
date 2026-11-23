// tools/audit_d1_d2.mjs — Seat 1 driver-side static audits for the Fudai build.
// Codex seat attribution (2026-11-23): P12_FIX_D1_MATCHER_BRIEF.md — match belongings_box by kind.
// D1: film.props schema (ARRAY of {id, kind, in:'world', at:[x,y,z], keys:[{t, at}]},
//     ids unique, keys non-empty; box entry keeps fetch:true when present),
//     purity scan (no Math.random / no Date in scene sources).
// D2: ONE PLACES table exported from scenes/set.js (all 7 places, at + bounds);
//     every prop `at`, cast `at`, and camera target falls inside a declared
//     place's bounds (zone audit); camera targets sane in y (frustum pre-audit —
//     the looked-at zoom frustum check stays Seat 4's, on the probe stills).
// Run: node tools/audit_d1_d2.mjs   (from the project folder)
// Exit 0 = PASS, 1 = FAIL (failures printed, one per line).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const fails = [];
const notes = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };

const filmSrc = readFileSync(join(ROOT, 'scenes/film.js'), 'utf8');
const setSrc = readFileSync(join(ROOT, 'scenes/set.js'), 'utf8');

// ---- purity (RULES §4) across all authored scene sources ----
import { readdirSync } from 'node:fs';
const scan = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) scan(p);
    else if (e.name.endsWith('.js')) {
      const s = readFileSync(p, 'utf8');
      if (/Math\.random/.test(s)) fails.push(`PURITY: Math.random in ${p}`);
      if (/\bDate\s*\(|Date\.now/.test(s)) fails.push(`PURITY: Date in ${p}`);
    }
  }
};
scan(join(ROOT, 'scenes'));

// ---- load the film + the PLACES table ----
const film = (await import(join(ROOT, 'scenes/film.js'))).default;
const setMod = await import(join(ROOT, 'scenes/set.js'));
const PLACES = setMod.PLACES;
ok(PLACES && typeof PLACES === 'object', 'D2: scenes/set.js does not export a PLACES table');
ok(/import\s*\{[^}]*PLACES[^}]*\}\s*from\s*'\.\/set\.js'/.test(filmSrc),
  'D2: film.js does not import PLACES from ./set.js');

const EXPECTED = ['COAST_WALL', 'COAST_VILLAGE', 'SEA', 'NEIGHBOR_COAST', 'FLASHBACK_ROCK', 'ROOM', 'HILL_GRAVE'];
for (const name of EXPECTED) {
  const p = PLACES?.[name];
  ok(p, `D2: PLACES.${name} missing`);
  if (!p) continue;
  ok(Array.isArray(p.at) && p.at.length === 3, `D2: PLACES.${name}.at is not a 3-vector`);
  ok(p.bounds && Array.isArray(p.bounds.x) && Array.isArray(p.bounds.z),
    `D2: PLACES.${name}.bounds missing {x:[..], z:[..]}`);
}
const inBounds = (x, z) => EXPECTED.some(n => {
  const b = PLACES[n]?.bounds; if (!b) return false;
  return x >= b.x[0] && x <= b.x[1] && z >= b.z[0] && z <= b.z[1];
});
const placeOf = (x, z) => EXPECTED.find(n => {
  const b = PLACES[n]?.bounds; if (!b) return false;
  return x >= b.x[0] && x <= b.x[1] && z >= b.z[0] && z <= b.z[1];
});

// ---- D1: props schema ----
ok(Array.isArray(film.props), 'D1: film.props is NOT an array');
if (Array.isArray(film.props)) {
  const ids = new Set();
  for (const p of film.props) {
    ok(p.id && !ids.has(p.id), `D1: prop id missing/duplicated: ${p.id}`);
    ids.add(p.id);
    ok(typeof p.kind === 'string' && /^[a-z][a-z0-9_]*$/.test(p.kind), `D1: prop ${p.id}: bad kind ${p.kind}`);
    ok(p.in === 'world', `D1: prop ${p.id}: in !== 'world' (${p.in})`);
    ok(Array.isArray(p.at) && p.at.length === 3 && p.at.every(v => Number.isFinite(v)),
      `D1: prop ${p.id}: at is not a finite 3-vector`);
    ok(Array.isArray(p.keys) && p.keys.length > 0, `D1: prop ${p.id}: keys empty`);
    if (Array.isArray(p.keys)) {
      const nums = p.keys.map(k => k.t).filter(t => typeof t === 'number');
      ok(nums.every((v, i) => i === 0 || v >= nums[i - 1]), `D1: prop ${p.id}: numeric keys not sorted by t`);
      for (const k of p.keys) if (k.at) ok(Array.isArray(k.at) && k.at.length === 3, `D1: prop ${p.id}: a key's at is not a 3-vector`);
    }
    // D2 zone: prop position inside a declared place
    if (Array.isArray(p.at)) ok(inBounds(p.at[0], p.at[2]),
      `D2: prop ${p.id} at [${p.at}] is outside every place's bounds`);
    else notes.push(`prop ${p.id}: no at to zone-check`);
    if (p.kind === 'belongings_box') ok(p.fetch === true, 'D1: belongings box entry lost fetch: true');
  }
  if (!film.props.some(p => p.kind === 'belongings_box'))
    notes.push('D1: no belongings_box prop is present; fetch:true check has no entry to validate');
}

// ---- D2: cast + cameras inside places ----
for (const [id, c] of Object.entries(film.cast || {})) {
  ok(Array.isArray(c.at) && c.at.length === 2, `D2: cast ${id}: at is not [x, z]`);
  if (Array.isArray(c.at)) ok(inBounds(c.at[0], c.at[1]),
    `D2: cast ${id} at [${c.at}] is outside every place's bounds`);
}
ok(Array.isArray(film.shots) && film.shots.length > 0, 'D2: film.shots empty');
for (const [i, s] of (film.shots || []).entries()) {
  const ends = s.camera?.move === 'park' ? [s.camera] : [s.camera?.from, s.camera?.to];
  for (const e of ends) {
    if (!e) { fails.push(`D2: shot ${i + 1}: missing camera from/to`); continue; }
    ok(Array.isArray(e.target) && e.target.length === 3, `D2: shot ${i + 1}: target not a 3-vector`);
    if (Array.isArray(e.target)) {
      ok(inBounds(e.target[0], e.target[2]),
        `D2: shot ${i + 1}: target [${e.target}] outside every place's bounds`);
      ok(e.target[1] >= 0 && e.target[1] <= 19.5,
        `D2: shot ${i + 1}: target y ${e.target[1]} outside sane 0..19.5 (wall is 18 D)`);
    }
    ok(Array.isArray(e.pos) && e.pos.length === 3, `D2: shot ${i + 1}: pos not a 3-vector`);
  }
}

// ---- D2-CLEAR: camera paths vs building solids (phase-7 extension) ----
// Conservative solids from set.js buildWorld at MAXIMUM dimensions (village house
// w<=4.9 -> hx 2.45, d<=4.1 -> hz 2.05, h<=4.65 + roof cone 1.25 -> top 6.0; town hall
// box + cone r4.5 -> x +-4.5, z 9.5..18.5, top 6.4; neighbour houses h 4.2 + roof -> 5.6).
// A path clearing these boxes clears the real buildings. Wall/storeys are NOT solids.
const SOLIDS = [{ name: 'town hall', min: [-4.5, 0, 9.5], max: [4.5, 6.4, 18.5] }];
for (const [hx, hz] of [[-16, -3], [-10, -4], [-20, 3], [-14, 7], [-8, 11], [8, -4], [14, -2], [20, 3], [14, 10], [6, 12]])
  SOLIDS.push({ name: `village house @${hx},${hz}`, min: [hx - 2.45, 0, hz - 2.05], max: [hx + 2.45, 6.0, hz + 2.05] });
for (const hx of [585, 590, 595, 600, 605, 610, 615])
  SOLIDS.push({ name: `neighbour house @${hx}`, min: [hx - 2.45, 0, -2 - 2.05], max: [hx + 2.45, 5.6, -2 + 2.05] });
function segHitsBox(p0, p1, b) {
  let t0 = 0, t1 = 1;
  for (let i = 0; i < 3; i++) {
    const d = p1[i] - p0[i];
    if (Math.abs(d) < 1e-9) { if (p0[i] < b.min[i] || p0[i] > b.max[i]) return false; }
    else {
      let ta = (b.min[i] - p0[i]) / d, tb = (b.max[i] - p0[i]) / d;
      if (ta > tb) { const t = ta; ta = tb; tb = t; }
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
      if (t0 > t1) return false;
    }
  }
  return true;
}
// Scope: chunk-2 shots (index >= 3, SH04+). SH01-SH03 are frozen and critic-passed;
// their paths were fleet-probe-verified in phases 1-3, and the max-dim box overstates
// the town-hall cone (round cross-section), so the opening is exempt from this check.
for (const [i, s] of (film.shots || []).entries()) {
  if (i < 3) continue;
  const ends = s.camera?.move === 'park' ? [s.camera] : [s.camera?.from, s.camera?.to];
  const p0 = ends[0]?.pos, p1 = ends[ends.length - 1]?.pos;
  if (!Array.isArray(p0) || !Array.isArray(p1)) continue;
  for (const b of SOLIDS)
    ok(!segHitsBox(p0, p1, b), `D2-CLEAR: shot ${i + 1} (${s.id || '?'}) camera path intersects ${b.name}`);
}
notes.push(`D2-CLEAR: ${SOLIDS.length} building solids checked per shot`);

// ---- format locks ----
ok(film.fps === 30, `FORMAT: fps !== 30 (${film.fps})`);
ok(JSON.stringify(film.size) === '[1080,1920]', `FORMAT: size !== [1080,1920] (${film.size})`);
ok(film.voice?.file === 'voice_owner.wav', `FORMAT: voice.file !== voice_owner.wav (${film.voice?.file})`);
ok(Array.isArray(film.voice?.lines) && film.voice.lines.length === 24,
  `FORMAT: voice.lines !== 24 (${film.voice?.lines?.length})`);

console.log('— D1/D2 AUDIT —');
for (const n of notes) console.log('note:', n);
if (fails.length) { console.log(`FAIL (${fails.length}):`); for (const f of fails) console.log('  ✗', f); process.exit(1); }
console.log('PASS: D1 schema + purity, D2 zones/frustum pre-audit, format locks.');
console.log('places:', EXPECTED.map(n => `${n}@${PLACES[n].at}`).join(' · '));
