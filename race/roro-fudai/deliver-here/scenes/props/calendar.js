// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// Assumption (film.md does not say how THREE reaches build): the engine passes
// THREE via opts.THREE, or exposes it as globalThis.THREE. build(opts) is a pure
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: centre of the board.
// The flipping calendar: 12 years of building (line 4), then 14 flying years
// (line 13). opts: { year: 12 | 14, flip: 0..1, open: 0..1 }.
// `flip` fans the loose pages out from the top binding; `open` fades the board in.

function pageTexture(THREE, year) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7f1de';
  ctx.fillRect(0, 0, 512, 640);
  // header strip
  ctx.fillStyle = '#c23b2e';
  ctx.fillRect(0, 0, 512, 110);
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('سنة', 256, 55);
  // the big number — the print that says the words
  ctx.font = 'bold 260px sans-serif';
  ctx.fillStyle = '#1a2a3a';
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#111111';
  ctx.strokeText(String(year), 256, 300);
  ctx.fillText(String(year), 256, 300);
  // day grid
  ctx.strokeStyle = '#8a8272';
  ctx.lineWidth = 3;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 7; c++) {
      ctx.strokeRect(36 + c * 63, 470 + r * 36, 55, 28);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const THREE = opts.THREE || globalThis.THREE;
  const year = opts.year ?? 12;
  const flip = opts.flip ?? 0; // 0 = pages flat, 1 = pages fanned out
  const open = opts.open ?? 1; // 0 = hidden, 1 = fully present

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const W = 1.8;
  const H = 2.4;

  // the stack of pages behind the front page
  for (let i = 0; i < 5; i++) {
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(W, H, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xe8dfc4, roughness: 0.9, transparent: true, opacity: open })
    );
    back.position.set(0.03 * i, -0.04 * i, -0.05 - i * 0.04);
    inner.add(back);
  }

  // front page with the year printed on it
  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshBasicMaterial({ map: pageTexture(THREE, year), transparent: true, opacity: open })
  );
  inner.add(front);
  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(W, H)),
    new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: open })
  );
  inner.add(frame);

  // loose pages that fly off the top binding as `flip` grows
  for (let i = 0; i < 3; i++) {
    const pivot = new THREE.Group();
    pivot.position.set(0, H / 2, 0.1 + i * 0.05);
    const page = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.94, H * 0.94),
      new THREE.MeshStandardMaterial({
        color: 0xf7f1de, roughness: 0.9, side: THREE.DoubleSide,
        transparent: true, opacity: open,
      })
    );
    page.position.y = -H * 0.47;
    pivot.add(page);
    pivot.rotation.x = -flip * (0.9 + i * 0.7);
    pivot.position.y += flip * (0.4 + i * 0.35);
    pivot.position.z += flip * (0.5 + i * 0.3);
    inner.add(pivot);
  }

  // binding rings on top
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x6b7c8c, roughness: 0.4, metalness: 0.8 });
  [-0.55, 0, 0.55].forEach((x) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 16), ringMat);
    ring.position.set(x, H / 2 + 0.08, 0.05);
    inner.add(ring);
  });

  root.userData = {
    title: `Calendar — ${year} years`,
    headline: `${year} سنة`,
    open,
    flip,
    inner,
  };
  return root;
}
