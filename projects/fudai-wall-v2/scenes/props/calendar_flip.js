import * as THREE from 'three';

function makeCalendarTexture(label, sub) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 320;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f8f5ec';
  ctx.fillRect(0, 0, 256, 320);
  ctx.fillStyle = '#c83e3b';
  ctx.fillRect(0, 0, 256, 78);
  ctx.fillStyle = '#2b2b2b';
  ctx.beginPath(); ctx.arc(64, 34, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(192, 34, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(sub, 128, 60);
  ctx.fillStyle = '#1d2430';
  ctx.font = 'bold 110px sans-serif';
  ctx.fillText(label, 128, 205);
  ctx.fillStyle = '#6c7a89';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('YEARS', 128, 278);

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

  const years = opts.years || '12';
  const flip = opts.flip ?? 0;

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.9, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x2e3540, roughness: 0.7 })
  );
  inner.add(back);

  const sheetTex = makeCalendarTexture(String(years), years === '14' ? 'AFTER' : 'BUILD');
  const front = new THREE.Mesh(
    new THREE.BoxGeometry(1.38, 1.76, 0.04),
    new THREE.MeshStandardMaterial({ map: sheetTex, roughness: 0.6 })
  );
  front.position.z = 0.08;
  inner.add(front);

  const pagePivot = new THREE.Group();
  pagePivot.position.set(0, 0.78, 0.11);
  pagePivot.rotation.x = -Math.abs(Math.sin(flip * Math.PI * 6)) * 1.45;
  const leaf = new THREE.Mesh(
    new THREE.BoxGeometry(1.34, 1.66, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xfaf7ee, roughness: 0.7 })
  );
  leaf.position.y = -0.83;
  pagePivot.add(leaf);
  inner.add(pagePivot);

  return root;
}