// scenes/props/milk_carton.js — Frozen Floating Milk Carton (readable mid-air cue for frozen time)
import { THREE, flat, part, finish, canvasTex } from '../../engine/props/_kit.js';

export const free = true;

function milkTex() {
  return canvasTex(256, 384, (g, W, H) => {
    g.fillStyle = '#f5f9fc';
    g.fillRect(0, 0, W, H);
    // Bright cyan-blue dairy stripe
    g.fillStyle = '#2c82c9';
    g.fillRect(0, 0, W, H * 0.32);
    g.fillRect(0, H * 0.78, W, H * 0.22);
    // White milk drop emblem
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(W / 2, H * 0.54, 52, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#1f5c94';
    g.lineWidth = 8;
    g.stroke();
    g.fillStyle = '#1f5c94';
    g.font = '900 42px Arial Black, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('MILK', W / 2, H * 0.54);
    g.fillStyle = '#ffffff';
    g.font = '800 30px Arial, sans-serif';
    g.fillText('FRESH', W / 2, H * 0.17);
  });
}

export function build() {
  const g = new THREE.Group();
  g.name = 'prop.milk_carton';
  const tex = milkTex();
  const faceMat = new THREE.MeshBasicMaterial({ map: tex });
  const sideMat = flat('#eef6fb', '#bdd4e6');
  const blueTop = flat('#2c82c9', '#1d5d96');

  const body = part(new THREE.BoxGeometry(0.24, 0.42, 0.24), [faceMat, faceMat, sideMat, sideMat, faceMat, faceMat], 0.020);
  body.position.y = 0.0;
  g.add(body);

  // Gable roof peak
  const roof = part(new THREE.ConeGeometry(0.17, 0.16, 4), blueTop, 0.018);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 0.28;
  g.add(roof);

  // Top crimp ridge
  const ridge = part(new THREE.BoxGeometry(0.24, 0.05, 0.035), sideMat, 0.014);
  ridge.position.y = 0.35;
  g.add(ridge);

  // Little frozen floating milk splash droplets right beside the spout!
  const dropMat = flat('#ffffff', '#cce2f2');
  for (const [dx, dy, dz, r] of [[0.18, 0.22, 0.08, 0.042], [0.26, 0.14, -0.05, 0.032], [0.15, 0.32, 0.02, 0.026]]) {
    const d = part(new THREE.SphereGeometry(r, 10, 8), dropMat, 0.012);
    d.position.set(dx, dy, dz);
    g.add(d);
  }

  return finish(g, { centre: [0, 0.05, 0] });
}
