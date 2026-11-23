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
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.strokeRect(110, 120, 292, 310);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(110, 120); ctx.lineTo(402, 430);
  ctx.moveTo(402, 120); ctx.lineTo(110, 430);
  ctx.stroke();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(40, 120); ctx.lineTo(472, 120); ctx.stroke();
  ctx.strokeStyle = '#ff9f68';
  ctx.setLineDash([12, 10]);
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(40, 240); ctx.lineTo(472, 240); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText('15.5M LOCKED', 115, 92);
  ctx.fillStyle = '#ff9f68';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('10M', 48, 228);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('FUDAI FLOODGATE PLAN', 95, 472);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  if (opts.shown === false) {
    inner.visible = false;
    return root;
  }

  const locked = opts.locked ?? 1;
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

  const ruler = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.06, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xd9a74a, metalness: 0.35, roughness: 0.4 })
  );
  ruler.position.set(0, 0.13, THREE.MathUtils.lerp(0.12, -0.44, Math.max(0, Math.min(1, locked))));
  inner.add(ruler);

  const weight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.1, 14),
    new THREE.MeshStandardMaterial({ color: 0x3a4756, metalness: 0.5, roughness: 0.4 })
  );
  weight.position.set(-0.92, 0.14, 0.62);
  inner.add(weight);

  return root;
}