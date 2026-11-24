// scenes/props/pocket_watch.js — 1916 brass expedition pocket watch (openable lid via opts.open)
// Origin at the hand grip; dial printed on canvas so it never reads as a blank disc.
import * as THREE from '../../vendor/three.module.js';

function makeDialTex() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f6eedc';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#2a221c';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  // 12 hour ticks
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.lineWidth = i % 3 === 0 ? 7 : 4;
    ctx.beginPath();
    ctx.moveTo(128 + Math.cos(a) * 86, 128 + Math.sin(a) * 86);
    ctx.lineTo(128 + Math.cos(a) * 106, 128 + Math.sin(a) * 106);
    ctx.stroke();
  }

  // Hands showing 5 minutes past (Shackleton's 5-minute sleep beat)
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#1b1714';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(128, 128);
  ctx.lineTo(128, 66);
  ctx.stroke();

  ctx.strokeStyle = '#9a2420';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 128);
  ctx.lineTo(164, 58); // +5 min mark
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function build(opts = {}) {
  const g = new THREE.Group();
  g.name = 'prop_pocket_watch';

  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd9b048, roughness: 0.32, metalness: 0.78 });
  const dialTex = makeDialTex();
  const dialMat = new THREE.MeshBasicMaterial({ map: dialTex, color: dialTex ? 0xffffff : 0xf6eedc });

  // Main brass case
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16), brassMat);
  body.rotation.x = Math.PI / 2;
  g.add(body);

  // Printed white clock face
  const dial = new THREE.Mesh(new THREE.CircleGeometry(0.138, 16), dialMat);
  dial.position.z = 0.028;
  g.add(dial);

  // Top crown & chain ring
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.05, 8), brassMat);
  crown.position.set(0, 0.18, 0);
  g.add(crown);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.012, 6, 12), brassMat);
  ring.position.set(0, 0.22, 0);
  g.add(ring);

  // Hinged brass cover lid (driven by opts.open: 0 = shut, 1 = flipped open)
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.16, 0.026);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.018, 16), brassMat);
  lid.rotation.x = Math.PI / 2;
  lid.position.set(0, -0.16, 0.008);
  lidPivot.add(lid);
  g.add(lidPivot);

  const applyOpen = (val) => {
    const u = Math.max(0, Math.min(1, Number(val ?? 1)));
    lidPivot.rotation.x = -u * Math.PI * 0.78;
  };
  applyOpen(opts.open ?? 1);

  g.userData.set = (k, v) => {
    if (k === 'open') applyOpen(v);
  };
  g.userData.update = (_obj, nextOpts) => {
    if (nextOpts && nextOpts.open != null) applyOpen(nextOpts.open);
  };

  const scale = opts.scale ?? 1.0;
  g.scale.setScalar(scale);
  return g;
}

export default { build };