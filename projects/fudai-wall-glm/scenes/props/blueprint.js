// scenes/props/blueprint.js — the gate blueprint on an A-frame easel.
// Print: title strip, gate outline, dimension arrows, "15.5م", red height line.
// State: { pull: 0..1 } — the red line dragged down; it snaps back when the ruler pins it.
function pickT(opts, THREE) {
  if (opts && opts.Group) return opts;
  if (THREE && THREE.Group) return THREE;
  if (typeof THREE !== 'undefined') return THREE;
  return null;
}
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts, THREE) {
  const T = pickT(opts, THREE);
  const o = opts || {};
  const pull = (typeof o.pull === 'number') ? Math.max(0, Math.min(1, o.pull)) : 0;
  const g = new T.Group();
  const wood = new T.MeshStandardMaterial({ color: 0x8a6a44, roughness: 0.9 });
  // easel legs
  for (const [dx, tilt] of [[-1.1, 0.16], [1.1, -0.16], [0, 0]]) {
    const leg = new T.Mesh(new T.BoxGeometry(0.12, 5.2, 0.12), wood);
    leg.position.set(dx, 2.6, dx === 0 ? -0.5 : 0);
    leg.rotation.x = dx === 0 ? -0.3 : 0; leg.rotation.z = tilt;
    g.add(leg);
  }
  const bar = new T.Mesh(new T.BoxGeometry(2.6, 0.12, 0.14), wood); bar.position.set(0, 4.7, -0.28); g.add(bar);
  // board tilted for reading
  const boardT = cnv(T, 512, 384, (g2) => {
    g2.fillStyle = '#274a72'; g2.fillRect(0, 0, 512, 384);
    g2.strokeStyle = 'rgba(220,235,250,0.25)'; g2.lineWidth = 1;
    for (let i = 0; i < 24; i++) { g2.beginPath(); g2.moveTo(0, i * 16); g2.lineTo(512, i * 16); g2.stroke(); }
    g2.strokeStyle = '#e8f2fa'; g2.lineWidth = 4;
    g2.strokeRect(150, 120, 210, 220);              // wall block
    g2.strokeRect(228, 240, 56, 100);               // gate leaf
    g2.beginPath(); g2.arc(296, 190, 20, 0, 7); g2.stroke(); // wheel circle
    // dimension arrow + label
    g2.strokeStyle = '#ffd98a'; g2.lineWidth = 3;
    g2.beginPath(); g2.moveTo(390, 120); g2.lineTo(390, 340); g2.stroke();
    g2.beginPath(); g2.moveTo(383, 130); g2.lineTo(390, 120); g2.lineTo(397, 130); g2.stroke();
    g2.beginPath(); g2.moveTo(383, 330); g2.lineTo(390, 340); g2.lineTo(397, 330); g2.stroke();
    g2.fillStyle = '#ffd98a'; g2.font = 'bold 30px sans-serif'; g2.textAlign = 'left'; g2.textBaseline = 'middle';
    g2.fillText('15.5م', 400, 232);
    g2.fillStyle = '#e8f2fa'; g2.font = 'bold 26px sans-serif'; g2.textAlign = 'center';
    g2.fillText('مخطط بوابة السور', 256, 48);
    g2.strokeStyle = '#e8f2fa'; g2.lineWidth = 2; g2.beginPath(); g2.moveTo(80, 70); g2.lineTo(432, 70); g2.stroke();
    // small notes
    g2.font = '18px sans-serif'; g2.fillStyle = 'rgba(220,235,250,0.7)';
    g2.fillText('12 سنة · 30M$', 140, 368);
  });
  const board = new T.Mesh(new T.BoxGeometry(3.2, 2.4, 0.08),
    [new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
     new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
     new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
     new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
     new T.MeshStandardMaterial({ map: boardT, roughness: 0.85 }),
     new T.MeshStandardMaterial({ color: 0x6a5c40, roughness: 0.9 })]);
  board.position.set(0, 3.35, 0.18); board.rotation.x = -0.12; g.add(board);
  // red height line overlay (its own plane so pull moves only the line)
  const lineT = cnv(T, 512, 64, (g2) => {
    g2.clearRect(0, 0, 512, 64);
    g2.strokeStyle = '#e05038'; g2.lineWidth = 7;
    g2.beginPath(); g2.moveTo(30, 32); g2.lineTo(482, 32); g2.stroke();
    g2.fillStyle = '#e05038';
    g2.beginPath(); g2.moveTo(30, 20); g2.lineTo(48, 32); g2.lineTo(30, 44); g2.fill();
    g2.beginPath(); g2.moveTo(482, 20); g2.lineTo(464, 32); g2.lineTo(482, 44); g2.fill();
    g2.beginPath(); g2.arc(256, 32, 14, 0, 7); g2.lineWidth = 5; g2.stroke(); // grip dot
  });
  const hline = new T.Mesh(new T.PlaneGeometry(2.6, 0.3), new T.MeshBasicMaterial({ map: lineT, transparent: true, depthWrite: false }));
  hline.position.set(0, 3.35 + 0.42 - pull * 0.55, 0.26); hline.rotation.x = -0.12; g.add(hline);
  return g;
}
