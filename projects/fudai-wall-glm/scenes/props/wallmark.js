import * as THREE from 'three';

// scenes/props/wallmark.js — the fresh pencil height-mark above the kid's head, with the
// little measure scrawl beside it. The wall's faint old marks are set geometry; this is the
// one new line drawn on screen. Fetch on the cut at the analogy line.
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const g = new T.Group();
  const markT = cnv(T, 256, 128, (g2) => {
    g2.clearRect(0, 0, 256, 128);
    // the fresh line — slightly wobbly pencil stroke
    g2.strokeStyle = 'rgba(58,48,38,0.92)'; g2.lineWidth = 9; g2.lineCap = 'round';
    g2.beginPath(); g2.moveTo(14, 44); g2.bezierCurveTo(80, 40, 170, 47, 242, 43); g2.stroke();
    // the scrawled measure beside it
    g2.strokeStyle = 'rgba(58,48,38,0.8)'; g2.lineWidth = 5;
    g2.beginPath(); g2.moveTo(30, 78); g2.bezierCurveTo(46, 62, 60, 92, 78, 74); g2.stroke();
    g2.beginPath(); g2.moveTo(88, 70); g2.lineTo(128, 70); g2.stroke();
    g2.beginPath(); g2.moveTo(88, 70); g2.lineTo(88, 96); g2.stroke();
    g2.beginPath(); g2.moveTo(138, 88); g2.bezierCurveTo(152, 66, 166, 98, 182, 76); g2.stroke();
    g2.beginPath(); g2.moveTo(192, 80); g2.lineTo(216, 78); g2.stroke();
  });
  const mark = new T.Mesh(new T.PlaneGeometry(1.7, 0.85), new T.MeshBasicMaterial({ map: markT, transparent: true, depthWrite: false }));
  mark.position.set(0, 2.72, 0.02); g.add(mark);
  return g;
}
