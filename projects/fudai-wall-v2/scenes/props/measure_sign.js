import * as THREE from 'three';

function makeLabelTexture(title, subtitle, bg, fg, accent) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 236);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 96px sans-serif';
  ctx.fillText(title, 256, subtitle ? 105 : 128);
  if (subtitle) {
    ctx.font = 'bold 42px sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText(subtitle, 256, 190);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const root = new THREE.Group();
  const inner = new THREE.Group();
  inner.name = 'measure_inner';
  root.add(inner);

  if (opts.shown === false) {
    inner.visible = false;
    return root;
  }

  const kind = opts.kind || 'height155';
  const progress = opts.progress ?? 1;

  if (kind === 'storey5') {
    const totalH = 24.8 * Math.max(0.05, Math.min(1, progress));
    const floors = 5;
    const floorH = 24.8 / floors;
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xffe49e, transparent: true, opacity: 0.78 });
    const glassMat = new THREE.MeshBasicMaterial({
      color: 0x8ec8ff, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(6.4, totalH, 0.25), glassMat);
    slab.position.set(0, totalH * 0.5, 0);
    inner.add(slab);

    for (const sx of [-3.2, 3.2]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.18, totalH, 0.28), frameMat);
      col.position.set(sx, totalH * 0.5, 0);
      inner.add(col);
    }
    for (let i = 1; i <= floors; i++) {
      const y = i * floorH;
      if (y > totalH + 0.1) break;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.16, 0.28), frameMat);
      bar.position.set(0, y, 0);
      inner.add(bar);
      const tex = makeLabelTexture(`${i}`, 'FLOOR', '#1a2738', '#ffffff', '#ffd166');
      const badge = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 0.95),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
      );
      badge.position.set(0, y - floorH * 0.5, 0.22);
      inner.add(badge);
    }
    return root;
  }

  if (kind === 'height155' || kind === 'height10' || kind === 'wave15') {
    const isWave = kind === 'wave15';
    const isTen = kind === 'height10';
    const targetH = isTen ? 16.0 : isWave ? 24.0 : 24.8;
    const curH = targetH * Math.max(0.08, Math.min(1, progress));
    const accentHex = isWave ? 0x6ce5ff : isTen ? 0xff9f68 : 0xffd166;
    const title = isTen ? '10M' : isWave ? '15M' : '15.5M';
    const sub = isWave ? 'TSUNAMI' : isTen ? 'NEIGHBORS' : 'FUDAI WALL';

    const rodMat = new THREE.MeshBasicMaterial({ color: accentHex });
    const rod = new THREE.Mesh(new THREE.BoxGeometry(0.24, curH, 0.24), rodMat);
    rod.position.set(0, curH * 0.5, 0);
    inner.add(rod);

    for (const ty of [0.1, curH]) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 0.24), rodMat);
      tick.position.set(0, ty, 0);
      inner.add(tick);
    }

    const tex = makeLabelTexture(title, sub, '#121c29', '#ffffff', isWave ? '#6ce5ff' : isTen ? '#ff9f68' : '#ffd166');
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 2.4),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
    );
    plaque.position.set(0, curH + 1.5, 0.2);
    inner.add(plaque);
    return root;
  }

  if (kind === 'dumb_sign') {
    const plankTex = makeLabelTexture('أغبى مشروع', 'FOOLISH WALL', '#6b4226', '#fff5dc', '#e8b954');
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 2.2, 0.28),
      new THREE.MeshStandardMaterial({ map: plankTex, roughness: 0.85 })
    );
    board.rotation.z = -0.07;
    inner.add(board);

    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc2a06b, roughness: 0.9 });
    for (const rx of [-2.1, 2.1]) {
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), ropeMat);
      rope.position.set(rx, 2.1, 0);
      inner.add(rope);
    }
    return root;
  }

  const isCost = kind === 'cost30m';
  const tex = makeLabelTexture(
    isCost ? '$30M' : '3,000',
    isCost ? '12 YEARS' : 'VILLAGERS',
    '#1b2a3d', '#ffffff', isCost ? '#6ee7b7' : '#ffd166'
  );
  const sign = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.9, 0.2), new THREE.MeshBasicMaterial({ map: tex }));
  sign.position.set(0, 1.0, 0);
  inner.add(sign);
  return root;
}