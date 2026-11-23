// scenes/props/measure.js — the member's on-screen measure graphics, one kind, four modes:
//   stores  : transparent 5-storey overlay, digits 1–5 (scene 1 tilt-up)
//   arrow   : glowing climbing arrow + "15.5M" plate (construction datum)
//   sticker : white plate "10M" on the neighbours' low walls
//   line    : glow line + "15M بالظبط" on the wave face
// Motion is opts-driven only: { climb: 0..1 }, { sway }, { vis }. Origin at the base/grip.
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
  const mode = o.mode || 'arrow';
  const climb = (typeof o.climb === 'number') ? Math.max(0, Math.min(1, o.climb)) : 1;
  const g = new T.Group();

  if (mode === 'stores') {
    const storeH = 4.96; // 24.8 D over 5 storeys
    const barM = new T.MeshBasicMaterial({ color: 0x9adcf0, transparent: true, opacity: 0.28, depthWrite: false, side: T.DoubleSide });
    const lineM = new T.MeshBasicMaterial({ color: 0xd8f4fc, transparent: true, opacity: 0.85, depthWrite: false });
    const back = new T.Mesh(new T.PlaneGeometry(7, storeH * 5), barM);
    back.position.set(0, storeH * 2.5 + 0.4, 0); g.add(back);
    for (let i = 0; i < 5; i++) {
      const y = storeH * (i + 1) + 0.4;
      const l = new T.Mesh(new T.PlaneGeometry(7, 0.09), lineM); l.position.set(0, y, 0.02); g.add(l);
      const dg = new T.Mesh(new T.PlaneGeometry(1.5, 1.5), new T.MeshBasicMaterial({
        map: cnv(T, 96, 96, (g2) => {
          g2.clearRect(0, 0, 96, 96);
          g2.fillStyle = '#eafcff'; g2.font = 'bold 64px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
          g2.strokeStyle = '#5fb8d4'; g2.lineWidth = 6; g2.beginPath(); g2.arc(48, 48, 40, 0, 7); g2.stroke();
          g2.fillText(String(i + 1), 48, 52);
        }), transparent: true, depthWrite: false, side: T.DoubleSide,
      }));
      dg.position.set(4.6, y + 1.1, 0.05); g.add(dg);
    }
    return g;
  }

  if (mode === 'arrow') {
    const H = 24.8;
    const shaftM = new T.MeshBasicMaterial({ color: 0xffc85a, transparent: true, opacity: 0.92, depthWrite: false, side: T.DoubleSide });
    const h = Math.max(0.4, H * climb);
    const shaft = new T.Mesh(new T.PlaneGeometry(0.34, h), shaftM);
    shaft.position.set(0, h / 2, 0); g.add(shaft);
    const head = new T.Mesh(new T.ConeGeometry(0.62, 1.3, 3), new T.MeshBasicMaterial({ color: 0xffc85a, transparent: true, opacity: 0.95, depthWrite: false }));
    head.rotation.x = Math.PI; head.position.set(0, h + 0.6, 0); g.add(head);
    const plate = new T.Mesh(new T.PlaneGeometry(3.4, 1.3), new T.MeshBasicMaterial({
      map: cnv(T, 320, 120, (g2) => {
        g2.fillStyle = 'rgba(30,26,12,0.8)'; g2.fillRect(0, 0, 320, 120);
        g2.strokeStyle = '#ffc85a'; g2.lineWidth = 5; g2.strokeRect(6, 6, 308, 108);
        g2.fillStyle = '#ffe9a8'; g2.font = 'bold 66px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
        g2.fillText('15.5M', 160, 62);
      }), transparent: true, depthWrite: false, side: T.DoubleSide,
    }));
    plate.position.set(0, h + 2.1, 0.12); g.add(plate);
    return g;
  }

  if (mode === 'sticker') {
    const plate = new T.Mesh(new T.PlaneGeometry(2.4, 1.5), new T.MeshBasicMaterial({
      map: cnv(T, 240, 150, (g2) => {
        g2.fillStyle = '#f4f2ea'; g2.fillRect(0, 0, 240, 150);
        g2.fillStyle = '#2a2f36'; g2.font = 'bold 78px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
        g2.fillText('10M', 120, 80);
        g2.strokeStyle = '#c8442e'; g2.lineWidth = 8; g2.strokeRect(8, 8, 224, 134);
      }),
    }));
    plate.position.set(0, 10.4, 0.06); plate.rotation.z = -0.05;
    const nail = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.1, 8), new T.MeshStandardMaterial({ color: 0x777d82, roughness: 0.5, metalness: 0.5 }));
    nail.rotation.x = Math.PI / 2; nail.position.set(0, 11.4, 0.05); g.add(nail);
    g.add(plate);
    return g;
  }

  // mode === 'line' — the 15M measure on the wave face
  const my = 24 * Math.max(0.15, climb);
  const lineM = new T.MeshBasicMaterial({ color: 0xffe07a, transparent: true, opacity: 0.95, depthWrite: false, side: T.DoubleSide });
  const band = new T.Mesh(new T.PlaneGeometry(9, 0.42), lineM);
  band.position.set(0, my, 0); band.rotation.x = -0.1; g.add(band);
  const plate = new T.Mesh(new T.PlaneGeometry(3.6, 1.4), new T.MeshBasicMaterial({
    map: cnv(T, 320, 120, (g2) => {
      g2.fillStyle = 'rgba(20,30,40,0.78)'; g2.fillRect(0, 0, 320, 120);
      g2.fillStyle = '#ffe07a'; g2.font = 'bold 58px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('15M', 116, 62); g2.font = 'bold 38px sans-serif'; g2.fillText('بالظبط', 228, 64);
    }), transparent: true, depthWrite: false, side: T.DoubleSide,
  }));
  plate.position.set(0, my + 1.6, 0.3); g.add(plate);
  return g;
}
