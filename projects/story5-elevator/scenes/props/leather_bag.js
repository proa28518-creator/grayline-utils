// scenes/props/leather_bag.js — Hero Prop: Heavy Vintage Cognac Leather Suitcase (0.86 D x 0.60 D x 0.28 D)
// Origin at [0, 0, 0] = top center of the leather carry handle grip (matches engine/props/bag.js convention).
// Bottom of suitcase rests at y = -0.75 D (socket.bottom), so world y = +0.75 D sets the suitcase flush on floor y = 0.
import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';

export const free = true;

function makeSuitcaseFaceTex() {
  return canvasTex(512, 384, (g, W, H) => {
    // Rich cognac vintage leather base with subtle worn edge shading
    const grad = g.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#9a5428');
    grad.addColorStop(0.55, '#82421c');
    grad.addColorStop(1, '#633012');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);

    // Stitched border seam
    g.strokeStyle = '#d4a36a';
    g.lineWidth = 4;
    g.setLineDash([12, 8]);
    g.strokeRect(26, 26, W - 52, H - 52);
    g.setLineDash([]);

    // Vintage circular Cairo hotel sticker (top-left)
    g.save();
    g.translate(128, 128);
    g.rotate(-0.16);
    g.fillStyle = '#f2e4c4';
    g.beginPath(); g.arc(0, 0, 56, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#2b1810'; g.lineWidth = 5; g.stroke();
    g.fillStyle = '#c4372d';
    g.beginPath(); g.arc(0, 0, 42, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f6d167';
    g.font = '900 22px Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('GRAND', 0, -10);
    g.font = '700 18px Georgia, serif';
    g.fillText('HOTEL', 0, 14);
    g.restore();

    // Vintage teal diamond travel sticker (bottom-right)
    g.save();
    g.translate(384, 250);
    g.rotate(0.18);
    g.fillStyle = '#1f6c78';
    g.fillRect(-52, -34, 104, 68);
    g.strokeStyle = '#f4e6c6'; g.lineWidth = 5;
    g.strokeRect(-46, -28, 92, 56);
    g.strokeStyle = '#24140d'; g.lineWidth = 4;
    g.strokeRect(-52, -34, 104, 68);
    g.fillStyle = '#fae08a';
    g.font = '900 22px sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('★ 1934', 0, 2);
    g.restore();
  });
}

export function build(o = {}) {
  const g = new THREE.Group();
  g.name = 'prop.leather_bag';

  const W = o.w ?? 0.86;
  const H = o.h ?? 0.60;
  const D = o.d ?? 0.28;

  const leather  = flat(o.color ?? '#8b4922', '#572a10');
  const strapMat = flat('#4a2410', '#2b1408');
  const brass    = flat('#e4b84a', '#9c751e');
  const tagMat   = flat('#f4ebd3', '#cbbd9c');
  const faceTex  = makeSuitcaseFaceTex();
  const faceMat  = new THREE.MeshBasicMaterial({ map: faceTex });

  const bag = new THREE.Group();
  // Grip at top of handle loop (y = 0); bag center sits below it
  const bagCenterY = -(H / 2 + 0.15);
  bag.position.set(0, bagCenterY, 0);
  g.add(bag);

  // Main suitcase body with bold cartoon outline
  const body = part(new THREE.BoxGeometry(W, H, D), leather, 0.026);
  bag.add(body);

  // Front & back textured sticker panels
  for (const s of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.92, H * 0.88), faceMat);
    panel.position.set(0, 0, s * (D / 2 + 0.004));
    if (s < 0) panel.rotation.y = Math.PI;
    bag.add(panel);
  }

  // Two vertical espresso leather straps wrapping around the suitcase + gleaming brass buckles
  for (const sx of [-W * 0.27, W * 0.27]) {
    const strap = part(new THREE.BoxGeometry(0.085, H + 0.032, D + 0.032), strapMat, 0.014);
    strap.position.set(sx, 0, 0);
    bag.add(strap);
    for (const sz of [-1, 1]) {
      const buckle = part(new THREE.BoxGeometry(0.105, 0.085, 0.028), brass, 0.012);
      buckle.position.set(sx, 0.04, sz * (D / 2 + 0.022));
      bag.add(buckle);
    }
  }

  // 8 riveted brass corner protectors (reads weighty and ornate!)
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const corner = part(new THREE.BoxGeometry(0.11, 0.11, 0.09), brass, 0.012);
        corner.position.set(sx * (W / 2 - 0.035), sy * (H / 2 - 0.035), sz * (D / 2 - 0.025));
        bag.add(corner);
      }
    }
  }

  // Top twin brass clasp locks
  for (const sx of [-0.18, 0.18]) {
    const clasp = part(new THREE.BoxGeometry(0.08, 0.055, 0.06), brass, 0.010);
    clasp.position.set(sx, H / 2 + 0.025, D * 0.30);
    bag.add(clasp);
  }

  // Top leather arch handle + brass D-rings (origin [0,0,0] = top center grip!)
  const handle = part(new THREE.TorusGeometry(0.135, 0.028, 10, 20, Math.PI), strapMat, 0.018);
  handle.position.set(0, H / 2 + 0.015, 0);
  bag.add(handle);
  for (const sx of [-0.135, 0.135]) {
    const ring = part(new THREE.CylinderGeometry(0.032, 0.032, 0.04, 10), brass, 0.010);
    ring.rotation.z = Math.PI / 2;
    ring.position.set(sx, H / 2 + 0.025, 0);
    bag.add(ring);
  }

  // Dangling vintage ivory hotel luggage tag on right handle mount
  const tag = part(new THREE.BoxGeometry(0.095, 0.15, 0.016), tagMat, 0.010);
  tag.position.set(0.19, H / 2 - 0.07, D / 2 + 0.025);
  tag.rotation.z = 0.24;
  bag.add(tag);
  const tagStripe = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.02), basic('#c4372d'));
  tagStripe.position.set(0, 0.02, 0.010);
  tag.add(tagStripe);

  return finish(g, {
    grip: [0, 0, 0],
    bottom: [0, bagCenterY - H / 2, 0], // -0.75 D
  });
}
