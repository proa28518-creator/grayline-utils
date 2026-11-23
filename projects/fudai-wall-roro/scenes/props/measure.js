// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// Assumption (film.md does not say how THREE reaches build): the engine passes
// THREE via opts.THREE, or exposes it as globalThis.THREE. build(opts) is a pure
// function of opts; state (`open`) is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6).
// The measure graphics: the 5-storey overlay (1-2-3-4-5), the glowing height marks
// (15.5M / 10M / 15M) and the floating "3,000" sign. Bible lines 1, 3, 4, 5, 16, 21.
// Variants via opts.variant: 'storeys' | 'mark15_5' | 'mark10' | 'mark15' | 'sign3000'.
// Origin: base centre of the measure line (ground) for the mark/storey variants;
// centre of the board for 'sign3000'.

function label(THREE, text, { w = 2, h = 1, fg = '#ffd34d', bg = null, glow = true } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.max(64, Math.round(512 * h / w));
  const ctx = canvas.getContext('2d');
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.font = `bold ${Math.round(canvas.height * 0.58)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.round(canvas.height * 0.09);
  ctx.strokeStyle = '#111111';
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = fg;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  if (glow) mat.toneMapped = false;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
}

export function build(opts = {}) {
  const THREE = opts.THREE || globalThis.THREE;
  const variant = opts.variant || 'mark15_5';
  const open = opts.open ?? 1; // 0 = hidden, 1 = fully lit
  const heights = { mark15_5: 24.8, mark10: 16, mark15: 24, storeys: 24.8 };
  const labels = { mark15_5: '15.5M', mark10: '10M', mark15: '15M', storeys: '5 أدوار' };

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd34d, transparent: true, opacity: open });
  glowMat.toneMapped = false;

  if (variant === 'sign3000') {
    // floating board above the village
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 2.0, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xf5efdc, roughness: 0.8 })
    );
    board.material.transparent = true;
    board.material.opacity = open;
    inner.add(board);
    const edges = new THREE.EdgesGeometry(board.geometry, 30);
    inner.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x111111 })));
    const text = label(THREE, '3,000', { w: 5.6, h: 1.5, fg: '#1a2a3a', glow: false });
    text.position.z = 0.2;
    text.material.opacity = open;
    inner.add(text);
    root.userData = { title: 'Sign — 3,000 people', headline: '3,000', open, inner };
    return root;
  }

  const H = heights[variant];

  if (variant === 'storeys') {
    // translucent 5-storey building silhouette beside the wall
    const sil = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, H),
      new THREE.MeshBasicMaterial({ color: 0x9fc4e8, transparent: true, opacity: 0.28 * open, side: THREE.DoubleSide })
    );
    sil.position.set(0, H / 2, 0);
    inner.add(sil);
    // 5 floor lines + numbers 1-5
    for (let i = 1; i <= 5; i++) {
      const y = (H * i) / 5;
      const line = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.18, 0.05), glowMat);
      line.position.set(0, y, 0.05);
      inner.add(line);
      const num = label(THREE, String(i), { w: 1.1, h: 1.1, fg: '#ffffff' });
      num.position.set(-4.4, y - H / 10, 0.1);
      num.material.opacity = open;
      inner.add(num);
    }
    const cap = label(THREE, labels.storeys, { w: 4.4, h: 1.4, fg: '#ffd34d' });
    cap.position.set(0, H + 1.2, 0.1);
    cap.material.opacity = open;
    inner.add(cap);
    root.userData = { title: 'Measure — 5 storeys', headline: '5 أدوار', open, inner };
    return root;
  }

  // glowing vertical measure line with arrowhead + label
  const line = new THREE.Mesh(new THREE.BoxGeometry(0.22, H, 0.05), glowMat);
  line.position.set(0, H / 2, 0);
  inner.add(line);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.6, 4), glowMat);
  head.position.set(0, H + 0.8, 0);
  head.rotation.y = Math.PI / 4;
  inner.add(head);
  // tick marks every 1/5 of the height
  for (let i = 1; i < 5; i++) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.05), glowMat);
    tick.position.set(0, (H * i) / 5, 0);
    inner.add(tick);
  }
  const tag = label(THREE, labels[variant], { w: 4.2, h: 1.5, fg: '#ffd34d' });
  tag.position.set(2.9, H * 0.82, 0.1);
  tag.material.opacity = open;
  inner.add(tag);

  root.userData = { title: `Measure — ${labels[variant]}`, headline: labels[variant], open, inner };
  return root;
}
