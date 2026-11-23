import * as THREE from 'three';

function makeBillTexture() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#5ca36c';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#2d5c38';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 240, 112);
  ctx.fillStyle = '#f2d379';
  ctx.fillRect(102, 0, 52, 128);
  ctx.fillStyle = '#1f3d26';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText('$', 128, 64);
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

  const billMat = new THREE.MeshStandardMaterial({ map: makeBillTexture(), roughness: 0.75 });
  const sideMat = new THREE.MeshStandardMaterial({ color: 0xdbe8d8, roughness: 0.85 });
  const mats = [sideMat, sideMat, billMat, billMat, sideMat, sideMat];

  const bundles = opts.bundles || 6;
  const offsets = [
    [-0.55, 0.14, 0.25, 0.08],
    [0.52, 0.14, 0.22, -0.12],
    [0.0, 0.14, -0.32, 0.04],
    [-0.28, 0.42, 0.05, -0.06],
    [0.32, 0.42, -0.04, 0.14],
    [0.02, 0.70, 0.0, -0.05],
  ];
  for (let i = 0; i < Math.min(bundles, offsets.length); i++) {
    const [x, y, z, ry] = offsets[i];
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.48), mats);
    b.position.set(x, y, z);
    b.rotation.y = ry;
    inner.add(b);
  }

  const coinMat = new THREE.MeshStandardMaterial({ color: 0xf4c44e, metalness: 0.45, roughness: 0.35 });
  for (let i = 0; i < 4; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 14), coinMat);
    coin.position.set(-0.95 + i * 0.22, 0.04 + (i % 2) * 0.04, 0.52);
    inner.add(coin);
  }
  return root;
}