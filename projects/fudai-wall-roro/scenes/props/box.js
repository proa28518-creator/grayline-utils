// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// Assumption (film.md does not say how THREE reaches build): the engine passes
// THREE via opts.THREE, or exposes it as globalThis.THREE. build(opts) is a pure
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: base centre of the box
// (the grip point when it is carried from below).
// The box of personal things the retiring mayor carries out of town hall
// (line 11). Never a blank slab: the contents are visible — a framed photo,
// a rolled paper, a mug, and his nameplate.
// opts: { open: 0..1 } — 0 = flaps closed flat, 1 = flaps open, contents showing.

function photoTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  // a tiny village scene: sea, wall, sun
  ctx.fillStyle = '#f2c14e';
  ctx.fillRect(0, 0, 256, 192);
  ctx.fillStyle = '#7fb3d5';
  ctx.fillRect(0, 96, 256, 96);
  ctx.fillStyle = '#8a8f96';
  ctx.fillRect(40, 30, 176, 66);
  ctx.fillStyle = '#3a4a5a';
  ctx.fillRect(120, 30, 16, 66);
  ctx.fillStyle = '#c23b2e';
  ctx.beginPath();
  ctx.arc(210, 36, 22, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function nameTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f5efdc';
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, 248, 88);
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1a2a3a';
  ctx.fillText('العمدة', 128, 50);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const THREE = opts.THREE || globalThis.THREE;
  const open = opts.open ?? 1; // 0 = flaps closed, 1 = flaps open

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const W = 1.6; // ~1 m wide
  const Dp = 1.2;
  const H = 1.1;
  const card = new THREE.MeshStandardMaterial({ color: 0xb98a4a, roughness: 0.9 });
  const cardDark = new THREE.MeshStandardMaterial({ color: 0x9a6f33, roughness: 0.9 });

  function panel(w, h, t, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), mat);
    m.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(m.geometry, 30),
      new THREE.LineBasicMaterial({ color: 0x111111 })
    ));
    return m;
  }

  // bottom + four sides
  const bottom = panel(W, 0.08, Dp, cardDark);
  bottom.position.y = 0.04;
  inner.add(bottom);
  const front = panel(W, H, 0.08, card);
  front.position.set(0, H / 2, Dp / 2);
  inner.add(front);
  const back = panel(W, H, 0.08, card);
  back.position.set(0, H / 2, -Dp / 2);
  inner.add(back);
  const left = panel(0.08, H, Dp, card);
  left.position.set(-W / 2, H / 2, 0);
  inner.add(left);
  const right = panel(0.08, H, Dp, card);
  right.position.set(W / 2, H / 2, 0);
  inner.add(right);

  // two flaps, hinged on the front/back top edges; `open` swings them out
  [-1, 1].forEach((side) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, H, (side * Dp) / 2);
    const flap = panel(W, 0.08, Dp / 2, cardDark);
    flap.position.set(0, 0, (side * Dp) / 4);
    pivot.add(flap);
    pivot.rotation.x = side * open * 1.9; // 0 = flat across the top, 1 = out
    inner.add(pivot);
  });

  // contents — visible when the flaps are open
  const contents = new THREE.Group();
  contents.position.y = H;
  // framed photo, leaning on the back edge
  const photo = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.55, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x5e3a17, roughness: 0.7 })
  );
  photo.add(frame);
  const pic = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.43),
    new THREE.MeshBasicMaterial({ map: photoTexture(THREE) })
  );
  pic.position.z = 0.03;
  photo.add(pic);
  photo.position.set(-0.4, 0.35, -0.35);
  photo.rotation.x = -0.25;
  contents.add(photo);
  // rolled paper
  const roll = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.9, 10),
    new THREE.MeshStandardMaterial({ color: 0xf5efdc, roughness: 0.85 })
  );
  roll.rotation.z = Math.PI / 2;
  roll.rotation.y = 0.4;
  roll.position.set(0.35, 0.18, 0.15);
  contents.add(roll);
  // a mug
  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.12, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: 0x2b5d8a, roughness: 0.5 })
  );
  mug.position.set(0.45, 0.15, -0.3);
  contents.add(mug);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.03, 8, 14, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x2b5d8a, roughness: 0.5 })
  );
  handle.position.set(0.59, 0.15, -0.3);
  handle.rotation.z = -Math.PI / 2;
  contents.add(handle);
  // his nameplate on top
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.26),
    new THREE.MeshBasicMaterial({ map: nameTexture(THREE) })
  );
  plate.position.set(0, 0.32, 0.3);
  plate.rotation.x = -0.5;
  contents.add(plate);
  inner.add(contents);

  root.userData = {
    title: "Box — the mayor's things",
    headline: 'العمدة',
    open,
    inner,
  };
  return root;
}
