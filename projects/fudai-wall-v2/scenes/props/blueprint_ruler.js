// Custom prop: technical floodgate blueprint + brass drafting ruler (Scene 3 tight insert)
// Header "15.5M LOCKED" sits cleanly in top margin above the datum line so the yellow ruler never obscures it.
import * as THREE from 'three';

function makeBlueprintTexture() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#154375';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(180,220,255,0.22)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
  }
  ctx.strokeStyle = '#e2f1ff';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, 476, 476);

  // Top banner clearly above the 15.5M datum & ruler travel zone
  ctx.fillStyle = '#0e2d52';
  ctx.fillRect(30, 30, 452, 74);
  ctx.fillStyle = '#ffd166';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 46px sans-serif';
  ctx.fillText('15.5M LOCKED', 256, 68);

  // Floodgate schematic below header
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.strokeRect(110, 150, 292, 285);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(110, 150); ctx.lineTo(402, 435);
  ctx.moveTo(402, 150); ctx.lineTo(110, 435);
  ctx.stroke();

  // 15.5M bold gold datum line at y = 150
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(38, 150); ctx.lineTo(474, 150); ctx.stroke();

  // 10M dashed comparison line at y = 275
  ctx.strokeStyle = '#ff9f68';
  ctx.setLineDash([12, 10]);
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(38, 275); ctx.lineTo(474, 275); ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ff9f68';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('10M', 44, 260);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('FUDAI FLOODGATE PLAN', 256, 468);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const locked = opts.locked ?? (opts.opts && opts.opts.locked) ?? 1;

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.14, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x7c5334, roughness: 0.78 })
  );
  inner.add(desk);

  const sheet = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.03, 1.75),
    new THREE.MeshStandardMaterial({ map: makeBlueprintTexture(), roughness: 0.6 })
  );
  sheet.position.y = 0.085;
  inner.add(sheet);

  // Brass ruler sits below the 15.5M datum line (z = -0.26 when locked, +0.20 when pulled down),
  // leaving the top "15.5M LOCKED" header (z = -0.70..-0.52) 100% unobstructed.
  const ruler = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.05, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xd9a74a, metalness: 0.35, roughness: 0.4 })
  );
  const rulerZ = THREE.MathUtils.lerp(0.20, -0.26, Math.max(0, Math.min(1, locked)));
  ruler.position.set(0, 0.125, rulerZ);
  inner.add(ruler);

  const weight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.13, 0.1, 14),
    new THREE.MeshStandardMaterial({ color: 0x3a4756, metalness: 0.5, roughness: 0.4 })
  );
  weight.position.set(-0.92, 0.14, 0.62);
  inner.add(weight);

  return root;
}