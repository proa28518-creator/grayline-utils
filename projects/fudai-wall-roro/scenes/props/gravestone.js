// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// THREE is imported by this file (repair round 2026-11-23, office): the host does
// not pass THREE to props, so the file imports it itself, like Neon's props.
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: base centre (ground).
// The simple gravestone on the hill (lines 12, 24). The carved horizontal line on
// its face echoes the old mark cut into the rock (line 18).
// opts: { open: 0..1 } — 0 = bare stone, 1 = the engraving filled with gold
// (tended, after the thanks of line 24).

import * as THREE from 'three';

function engraveTexture(THREE, gold) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 384);
  ctx.strokeStyle = gold ? '#d9a441' : '#3a3f42';
  ctx.fillStyle = gold ? '#d9a441' : '#3a3f42';
  ctx.lineWidth = 10;
  // the carved horizontal line — the mark
  ctx.beginPath();
  ctx.moveTo(48, 120);
  ctx.lineTo(208, 120);
  ctx.stroke();
  // the name beneath it
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('وامورا', 128, 210);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const open = opts.open ?? 0; // 0 = bare stone, 1 = gold-filled engraving

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const W = 1.5; // ~1 m wide
  const H = 2.4; // ~1.5 m tall
  const D = 0.28;

  const stone = new THREE.MeshStandardMaterial({ color: 0x9aa0a3, roughness: 0.9 });
  const stoneDark = new THREE.MeshStandardMaterial({ color: 0x7d8387, roughness: 0.9 });

  // rounded-top slab: rectangle + semicircle, extruded
  const shape = new THREE.Shape();
  shape.moveTo(-W / 2, 0);
  shape.lineTo(-W / 2, H - W / 2);
  shape.absarc(0, H - W / 2, W / 2, Math.PI, 0, true);
  shape.lineTo(W / 2, 0);
  shape.lineTo(-W / 2, 0);
  const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false });
  const slab = new THREE.Mesh(slabGeo, stone);
  slab.position.z = -D / 2;
  inner.add(slab);
  const slabEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(slabGeo, 30),
    new THREE.LineBasicMaterial({ color: 0x111111 })
  );
  slabEdge.position.z = -D / 2;
  inner.add(slabEdge);

  // base plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(W + 0.5, 0.4, D + 0.5), stoneDark);
  plinth.position.set(0, 0.2, 0);
  inner.add(plinth);
  inner.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(plinth.geometry, 30),
    new THREE.LineBasicMaterial({ color: 0x111111 })
  ));

  // engraving on the face: carved dark line, gold fill fading in with `open`
  const carved = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 0.9, H * 0.62),
    new THREE.MeshBasicMaterial({ map: engraveTexture(THREE, false), transparent: true })
  );
  carved.position.set(0, H * 0.58, D / 2 + 0.01);
  inner.add(carved);
  const gold = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 0.9, H * 0.62),
    new THREE.MeshBasicMaterial({
      map: engraveTexture(THREE, true), transparent: true, opacity: open,
    })
  );
  gold.position.set(0, H * 0.58, D / 2 + 0.02);
  inner.add(gold);

  // a small offering stone at the base
  const offering = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.9 })
  );
  offering.scale.y = 0.7;
  offering.position.set(0.5, 0.45, 0.35);
  inner.add(offering);

  root.userData = {
    title: 'Gravestone — Mayor Wamura',
    headline: 'وامورا',
    open,
    inner,
  };
  return root;
}
