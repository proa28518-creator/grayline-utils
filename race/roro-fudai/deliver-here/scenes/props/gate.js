// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// THREE is imported by this file (repair round 2026-11-23, office): the host does
// not pass THREE to props, so the file imports it itself, like Neon's props.
// function of opts; state (`open`) is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: base centre of the gate,
// ground level, middle of the gate — so it plants on the wall deck.
// The steel gate in the giant wall: 15.5 m = 24.8 D tall, ~8 m = 12.8 D wide.
// Bible lines 1, 4, 8, 20, 22. Place A.

import * as THREE from 'three';

function label(THREE, text, { w = 2, h = 1, fg = '#111111', bg = '#f5efdc' } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.max(64, Math.round(512 * h / w));
  const ctx = canvas.getContext('2d');
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = Math.round(canvas.height * 0.06);
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  ctx.font = `bold ${Math.round(canvas.height * 0.55)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.round(canvas.height * 0.07);
  ctx.strokeStyle = '#111111';
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = fg;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  return mesh;
}

function ink(THREE, mesh, color = 0x111111) {
  const edges = new THREE.EdgesGeometry(mesh.geometry, 30);
  mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color })));
  return mesh;
}

export function build(opts = {}) {
  const open = opts.open ?? 0; // 0 = gate closed, 1 = both leaves swung open
  const H = 24.8; // 15.5 m
  const W = 12.8; // ~8 m
  const T = 0.6; // leaf thickness
  const leafW = W / 2;

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const steel = new THREE.MeshStandardMaterial({ color: 0x3a4a5a, roughness: 0.55, metalness: 0.6 });
  const steelDark = new THREE.MeshStandardMaterial({ color: 0x2b3947, roughness: 0.6, metalness: 0.6 });
  const rivetMat = new THREE.MeshStandardMaterial({ color: 0x6b7c8c, roughness: 0.4, metalness: 0.8 });
  const hazard = new THREE.MeshStandardMaterial({ color: 0xf2c200, roughness: 0.7 });

  // One leaf: plate + ribs + beams + rivets, pivoted at its outer hinge.
  function leaf(side) { // side: -1 left, +1 right
    const pivot = new THREE.Group();
    pivot.position.set(side * leafW, 0, 0);
    const g = new THREE.Group();
    g.position.set(-side * leafW / 2, 0, 0);
    const plate = ink(THREE, new THREE.Mesh(new THREE.BoxGeometry(leafW, H, T), steel));
    plate.position.y = H / 2;
    g.add(plate);
    // vertical ribs
    for (let i = 1; i < 5; i++) {
      const rib = ink(THREE, new THREE.Mesh(new THREE.BoxGeometry(0.35, H, 0.25), steelDark));
      rib.position.set(-leafW / 2 + (leafW * i) / 5, H / 2, T / 2 + 0.1);
      g.add(rib);
    }
    // horizontal beams
    [0.12, 0.5, 0.88].forEach((f) => {
      const beam = ink(THREE, new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.9, 0.3), steelDark));
      beam.position.set(0, H * f, T / 2 + 0.12);
      g.add(beam);
    });
    // rivet rows along the beams
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 9; c++) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), rivetMat);
        rivet.position.set(-leafW / 2 + 0.6 + c * (leafW - 1.2) / 8, H * [0.12, 0.5, 0.88][r], T / 2 + 0.3);
        g.add(rivet);
      }
    }
    pivot.add(g);
    pivot.rotation.y = -side * open * 1.75; // swings open, ~100 degrees
    return pivot;
  }

  inner.add(leaf(-1));
  inner.add(leaf(1));

  // centre seam post (stays when the leaves swing)
  const seam = ink(THREE, new THREE.Mesh(new THREE.BoxGeometry(0.5, H, 0.9), steelDark));
  seam.position.set(0, H / 2, 0);
  inner.add(seam);

  // hazard chevron strip at the base
  const strip = new THREE.Mesh(new THREE.BoxGeometry(W, 0.9, 0.75), hazard);
  strip.position.set(0, 0.45, 0);
  inner.add(ink(THREE, strip));

  // beacon light on top — a visible practical
  const beaconPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8), steelDark);
  beaconPole.position.set(0, H + 0.6, 0);
  inner.add(beaconPole);
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xff9500, emissiveIntensity: 1.6, roughness: 0.3 })
  );
  beacon.position.set(0, H + 1.5, 0);
  inner.add(beacon);

  // print: the riveted height plate — never a blank slab
  const plate = label(THREE, '15.5M', { w: 3.2, h: 1.1, fg: '#1a2a3a', bg: '#f5efdc' });
  plate.position.set(0, H * 0.62, T / 2 + 0.45);
  inner.add(plate);

  root.userData = {
    title: 'Steel gate — 15.5 m',
    headline: '15.5M',
    open,
    inner,
  };
  return root;
}
