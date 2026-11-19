// scenes/props/red_cart.js — Hero Prop: Saturated Crimson Supermarket Shopping Cart (1.55 D x 0.95 D x 1.60 D)
// Origin at [0, 0, 0] (ground contact center). Front faces +Z; push-handle at z = -0.78, y = 1.56; step-bar at z = -0.76, y = 0.34.
// Front-right iron wheel (wheel_fr) is visibly canted 14 deg outward and wobbles when opts.wobble > 0.
import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';

export const free = true;

function makeLogoTex() {
  return canvasTex(256, 128, (g, W, H) => {
    g.fillStyle = '#f21b1b';
    g.fillRect(0, 0, W, H);
    g.strokeStyle = '#fff5d6';
    g.lineWidth = 10;
    g.strokeRect(8, 8, W - 16, H - 16);
    g.fillStyle = '#ffd633';
    g.beginPath();
    g.arc(46, H / 2, 26, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#2b161b';
    g.lineWidth = 5;
    g.stroke();
    g.fillStyle = '#fffaf0';
    g.font = '900 34px Arial Black, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('MARKET', W * 0.61, H * 0.52);
  });
}

export function build(o = {}) {
  const g = new THREE.Group();
  g.name = 'prop.red_cart';

  // Super-saturated crimson red so the cart is ALWAYS the biggest saturated visual anchor in frame!
  const redBright = flat('#f51d1d', '#b50e0e');
  const redDeep   = flat('#d91414', '#8e0a0a');
  const redPlastic = flat('#ff2b2b', '#c21212');
  const chrome    = flat('#d4dde6', '#8d9aa8');
  const steel     = flat('#4a525e', '#262b33');
  const rubber    = flat('#25272e', '#14161a');
  const sparkMat  = basic('#ffae2b');

  const addP = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, w = 0.022, parent = g) => {
    const m = part(geo, mat, w);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    parent.add(m);
    return m;
  };

  // --- LOWER CHASSIS FRAME (y = 0.28..0.34, z = -0.76..+0.72) ---
  // Left & right lower side rails
  for (const s of [-1, 1]) {
    addP(new THREE.BoxGeometry(0.065, 0.065, 1.48), chrome, s * 0.44, 0.30, -0.02, 0, s * 0.04, 0, 0.020);
    // Diagonal red chassis struts from bottom frame up to basket
    addP(new THREE.BoxGeometry(0.065, 0.92, 0.065), redDeep, s * 0.45, 0.78, -0.58, 0.24, 0, 0, 0.022);
    addP(new THREE.BoxGeometry(0.065, 0.52, 0.065), redDeep, s * 0.40, 0.52, 0.50, -0.22, 0, 0, 0.020);
  }
  // Bottom wire shelf tray (gives weighty solid silhouette)
  addP(new THREE.BoxGeometry(0.84, 0.04, 1.24), redDeep, 0, 0.31, -0.02, 0, 0, 0, 0.020);
  // Front red bumper bar
  addP(new THREE.BoxGeometry(0.86, 0.085, 0.09), redPlastic, 0, 0.33, 0.72, 0, 0, 0, 0.024);

  // REAR STEP-BAR (where clerk plants his feet at y = 0.34 D!)
  addP(new THREE.CylinderGeometry(0.036, 0.036, 0.96, 12), chrome, 0, 0.34, -0.76, 0, 0, Math.PI / 2, 0.022);

  // --- MAIN TAPERED RED BASKET (y = 0.72..1.48, z = -0.66..+0.78, W: 0.96 rear -> 0.80 front) ---
  const basket = new THREE.Group();
  g.add(basket);

  // Solid bright-red basket bottom pan (anchors saturation!)
  addP(new THREE.BoxGeometry(0.88, 0.055, 1.38), redBright, 0, 0.74, 0.05, 0, 0, 0, 0.024, basket);

  // Bold corner bumpers & rim beams (upper rim y = 1.46, mid belt y = 1.10)
  for (const yBar of [0.80, 1.04, 1.26, 1.46]) {
    const thick = yBar > 1.4 ? 0.072 : 0.038;
    // Left & right tapered side rails
    for (const s of [-1, 1]) {
      const m = addP(new THREE.BoxGeometry(thick, thick, 1.46), yBar > 1.4 ? redPlastic : redBright,
        s * 0.44, yBar, 0.06, 0, -s * 0.055, 0, yBar > 1.4 ? 0.025 : 0.016, basket);
      m.name = 'cart_rail';
    }
    // Front crossbar
    addP(new THREE.BoxGeometry(0.82, thick, thick), yBar > 1.4 ? redPlastic : redBright, 0, yBar, 0.77, 0, 0, 0, 0.022, basket);
    // Rear crossbar
    addP(new THREE.BoxGeometry(0.94, thick, thick), yBar > 1.4 ? redPlastic : redBright, 0, yBar, -0.65, 0, 0, 0, 0.022, basket);
  }

  // Thick vertical basket ribs along left, right, front, and back (super crisp comic grid, reads at 360x640!)
  for (let i = 0; i < 6; i++) {
    const z = -0.58 + i * 0.265;
    const xOff = 0.47 - (i / 5) * 0.07;
    for (const s of [-1, 1]) {
      addP(new THREE.BoxGeometry(0.034, 0.72, 0.034), redBright, s * xOff, 1.11, z, 0, 0, 0, 0.015, basket);
    }
  }
  for (let i = -2; i <= 2; i++) {
    addP(new THREE.BoxGeometry(0.034, 0.72, 0.034), redBright, i * 0.17, 1.11, 0.77, 0, 0, 0, 0.015, basket);
    addP(new THREE.BoxGeometry(0.034, 0.72, 0.034), redBright, i * 0.19, 1.11, -0.65, 0, 0, 0, 0.015, basket);
  }

  // Solid red side accent panels (lower third of basket walls so the cart reads as a BIG BOLD SATURATED RED SHAPE!)
  for (const s of [-1, 1]) {
    addP(new THREE.BoxGeometry(0.03, 0.34, 1.42), redBright, s * 0.435, 0.91, 0.06, 0, -s * 0.055, 0, 0.020, basket);
  }
  addP(new THREE.BoxGeometry(0.80, 0.34, 0.03), redBright, 0, 0.91, 0.76, 0, 0, 0, 0.020, basket);

  // Front yellow-and-red Supermarket Crest Plaque on the cart nose!
  const logoMat = new THREE.MeshBasicMaterial({ map: makeLogoTex() });
  const plaque = part(new THREE.BoxGeometry(0.56, 0.28, 0.04), [redDeep, redDeep, redDeep, redDeep, logoMat, redDeep], 0.018);
  plaque.position.set(0, 1.24, 0.79);
  basket.add(plaque);

  // Corner bumper caps on top front
  for (const s of [-1, 1]) {
    addP(new THREE.BoxGeometry(0.11, 0.11, 0.11), redPlastic, s * 0.41, 1.46, 0.77, 0, 0, 0, 0.024, basket);
  }

  // Child seat red flap at rear
  addP(new THREE.BoxGeometry(0.86, 0.32, 0.04), redPlastic, 0, 1.28, -0.44, 0.18, 0, 0, 0.018, basket);

  // --- PUSH HANDLE BAR (y = 1.56 D, z = -0.78 D) ---
  for (const s of [-1, 1]) {
    addP(new THREE.BoxGeometry(0.055, 0.22, 0.055), chrome, s * 0.46, 1.48, -0.72, -0.45, 0, 0, 0.020);
  }
  // Chunky saturated red handlebar tube
  addP(new THREE.CylinderGeometry(0.048, 0.048, 0.98, 14), redPlastic, 0, 1.56, -0.78, 0, 0, Math.PI / 2, 0.026);
  // Black grip end caps
  for (const s of [-1, 1]) {
    addP(new THREE.CylinderGeometry(0.054, 0.054, 0.07, 12), rubber, s * 0.49, 1.56, -0.78, 0, 0, Math.PI / 2, 0.020);
  }

  // --- FOUR IRON CASTER WHEELS (r = 0.11 D, front-right visibly bent 14 deg!) ---
  const wheelMeshes = [];
  let wheelFRPivot = null;
  const wheelDefs = [
    { id: 'rl', x: -0.42, z: -0.64, broken: false },
    { id: 'rr', x:  0.42, z: -0.64, broken: false },
    { id: 'fl', x: -0.37, z:  0.60, broken: false },
    { id: 'fr', x:  0.37, z:  0.60, broken: true  },
  ];
  for (const wd of wheelDefs) {
    const piv = new THREE.Group();
    piv.position.set(wd.x, 0.115, wd.z);
    if (wd.broken) {
      // Visually unmistakable broken front-right iron wheel: canted 14 deg + turned out + glowing red bracket!
      piv.rotation.z = -14 * Math.PI / 180;
      piv.rotation.y = 22 * Math.PI / 180;
      wheelFRPivot = piv;
    }
    g.add(piv);
    // Caster fork
    addP(new THREE.BoxGeometry(0.09, 0.16, 0.07), wd.broken ? redBright : chrome, 0, 0.11, 0, 0, 0, 0, 0.018, piv);
    // Wheel drum (rotates around X)
    const wSpin = new THREE.Group();
    piv.add(wSpin);
    const tire = addP(new THREE.CylinderGeometry(0.115, 0.115, 0.075, 16), steel, 0, 0, 0, 0, 0, Math.PI / 2, 0.022, wSpin);
    tire.name = 'wheel_' + wd.id;
    // Hubcap + spoke bar so spin reads clearly
    addP(new THREE.CylinderGeometry(0.055, 0.055, 0.088, 12), wd.broken ? redPlastic : chrome, 0, 0, 0, 0, 0, Math.PI / 2, 0.014, wSpin);
    addP(new THREE.BoxGeometry(0.092, 0.18, 0.026), rubber, 0, 0, 0, 0, 0, 0, 0.010, wSpin);
    wheelMeshes.push(wSpin);
  }

  // Sleek tapered radial spark burst attached behind wheel_fr (toggled via opts.sparks)
  const sparkGrp = new THREE.Group();
  sparkGrp.position.set(0.39, 0.10, 0.52);
  const sparkCoreMat = basic('#fff7c2');
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), sparkCoreMat);
  sparkGrp.add(core);
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 1.15 - 0.25;
    const len = 0.26 + (i % 3) * 0.16;
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.026, len, 4), i % 2 === 0 ? sparkMat : sparkCoreMat);
    sp.position.set(Math.sin(ang) * 0.14 + (i % 2) * 0.05, 0.06 + (i % 4) * 0.08, -0.14 - (i % 3) * 0.12);
    sp.rotation.set(-Math.PI * 0.42 + (i % 3) * 0.18, 0, (i - 4.5) * 0.18);
    sparkGrp.add(sp);
  }
  sparkGrp.visible = !!(o.sparks && o.sparks > 0.1);
  g.add(sparkGrp);

  // Support in-place numeric opt updates (spin, wobble, sparks)
  g.userData.set = (k, v) => {
    if (k === 'spin') {
      for (const w of wheelMeshes) w.rotation.x = v;
    } else if (k === 'wobble' && wheelFRPivot) {
      wheelFRPivot.rotation.y = (22 + Math.sin(v * 14) * 18) * Math.PI / 180;
      wheelFRPivot.rotation.z = (-14 + Math.cos(v * 11) * 6) * Math.PI / 180;
    } else if (k === 'sparks') {
      sparkGrp.visible = v > 0.1;
      sparkGrp.scale.setScalar(0.6 + Math.min(1.4, v));
      sparkGrp.rotation.y = Math.sin(v * 23) * 0.25;
    }
  };

  return finish(g, {
    handle: [0, 1.56, -0.78],
    stepBar: [0, 0.34, -0.76],
    nose: [0, 1.15, 0.79],
    wheelFR: [0.37, 0.115, 0.60],
  });
}
