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

  const signType = opts.signType || (opts.opts && opts.opts.signType) || 'pop3000';
  const progress = opts.progress ?? (opts.opts && opts.opts.progress) ?? 1;

  if (signType === 'storey5') {
    const totalH = 24.8 * Math.max(0.05, Math.min(1, progress));
    const floors = 5;
    const floorH = 24.8 / floors;
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xffe49e, transparent: true, opacity: 0.85 });
    const glassMat = new THREE.MeshBasicMaterial({
      color: 0x8ec8ff, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.6, totalH, 0.25), glassMat);
    slab.position.set(0, totalH * 0.5, 0);
    inner.add(slab);

    for (const sx of [-2.8, 2.8]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.22, totalH, 0.3), frameMat);
      col.position.set(sx, totalH * 0.5, 0);
      inner.add(col);
    }
    for (let i = 1; i <= floors; i++) {
      const y = i * floorH;
      if (y > totalH + 0.1) break;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.18, 0.3), frameMat);
      bar.position.set(0, y, 0);
      inner.add(bar);
      const tex = makeLabelTexture(`${i}`, 'FLOOR', '#1a2738', '#ffffff', '#ffd166');
      const badge = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.1),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
      );
      badge.position.set(0, y - floorH * 0.5, 0.24);
      inner.add(badge);
    }
    return root;
  }

  if (signType === 'height155' || signType === 'height10' || signType === 'wave15') {
    const isWave = signType === 'wave15';
    const isTen = signType === 'height10';
    const targetH = isTen ? 16.0 : isWave ? 24.0 : 24.8;
    const curH = targetH * Math.max(0.1, Math.min(1, progress));
    const accentHex = isWave ? 0x6ce5ff : isTen ? 0xff9f68 : 0xffd166;
    const title = isTen ? '10M' : isWave ? '15M' : '15.5M';
    const sub = isWave ? 'TSUNAMI' : isTen ? 'NEIGHBORS' : 'FUDAI WALL';

    const rodMat = new THREE.MeshBasicMaterial({ color: accentHex });
    const rod = new THREE.Mesh(new THREE.BoxGeometry(0.32, curH, 0.32), rodMat);
    rod.position.set(0, curH * 0.5, 0);
    inner.add(rod);

    for (const ty of [0.15, curH]) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.28, 0.32), rodMat);
      tick.position.set(0, ty, 0);
      inner.add(tick);
    }

    const tex = makeLabelTexture(title, sub, '#121c29', '#ffffff', isWave ? '#6ce5ff' : isTen ? '#ff9f68' : '#ffd166');
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 2.8),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
    );
    plaque.position.set(0, curH + 1.8, 0.25);
    inner.add(plaque);
    return root;
  }

  if (signType === 'dumb_sign') {
    const plankTex = makeLabelTexture('أغبى مشروع', 'FOOLISH WALL', '#6b4226', '#fff5dc', '#e8b954');
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 1.8, 0.24),
      new THREE.MeshStandardMaterial({ map: plankTex, roughness: 0.85 })
    );
    board.rotation.z = -0.06;
    inner.add(board);

    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc2a06b, roughness: 0.9 });
    for (const rx of [-1.7, 1.7]) {
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), ropeMat);
      rope.position.set(rx, 1.9, 0);
      inner.add(rope);
    }
    return root;
  }

  if (signType === 'cost30m') {
    const tex = makeLabelTexture('$30M', '12 YEARS', '#1b2a3d', '#ffffff', '#6ee7b7');
    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.3, 0.16), new THREE.MeshBasicMaterial({ map: tex }));
    sign.position.set(0, 0.65, 0);
    inner.add(sign);
    return root;
  }

  const tex = makeLabelTexture('3,000', 'VILLAGERS', '#1b2a3d', '#ffffff', '#ffd166');
  const sign = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 0.18), new THREE.MeshBasicMaterial({ map: tex }));
  sign.position.set(0, 0.8, 0);
  inner.add(sign);
  return root;
}