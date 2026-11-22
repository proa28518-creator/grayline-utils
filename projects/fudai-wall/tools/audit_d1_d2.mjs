// tools/audit_d1_d2.mjs — Seat 1 driver-side static audits for the Fudai build.
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
    if (p.id === 'box' || p.kind === 'box') ok(p.fetch === true, 'D1: belongings box entry lost fetch: true');
  }
  if (!film.props.some(p => p.id === 'box' || p.kind === 'box'))
    notes.push('D1: no belongings-box prop yet (expected at opening stage; fetch:true check arms when it lands)');
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
