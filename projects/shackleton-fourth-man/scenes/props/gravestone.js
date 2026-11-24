// Custom prop: Mayor Wamura's carved stone headstone on hilltop plinth (Scene 4 & Scene 7)
import * as THREE from 'three';

function makeStoneInscription() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8b929a';
  ctx.fillRect(0, 0, 256, 512);
  ctx.strokeStyle = '#596068';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 24, 216, 464);
  ctx.fillStyle = '#2d333a';
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px serif';
  ctx.fillText('MAYOR', 128, 128);
  ctx.font = 'bold 42px serif';
  ctx.fillText('WAMURA', 128, 185);
  ctx.fillStyle = '#474f57';
  ctx.fillRect(58, 220, 140, 5);
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('15.5M', 128, 285);
  ctx.font = '24px serif';
  ctx.fillText('FUDAI', 128, 330);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const baseStone = new THREE.MeshStandardMaterial({ color: 0x767d85, roughness: 0.92 });
  const faceMat = new THREE.MeshStandardMaterial({ map: makeStoneInscription(), roughness: 0.9 });

  const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.34, 1.5), baseStone);
  step1.position.y = 0.17;
  inner.add(step1);

  const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.32, 1.1), baseStone);
  step2.position.y = 0.50;
  inner.add(step2);

  const tabletMats = [baseStone, baseStone, baseStone, baseStone, faceMat, baseStone];
  const tablet = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.35, 0.58), tabletMats);
  tablet.position.y = 1.82;
  inner.add(tablet);

  const vaseMat = new THREE.MeshStandardMaterial({ color: 0x5c636b, roughness: 0.88 });
  for (const sx of [-0.72, 0.72]) {
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.42, 10), vaseMat);
    vase.position.set(sx, 0.55, 0.45);
    inner.add(vase);
  }

  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.14, 0.28), vaseMat);
  tray.position.set(0, 0.41, 0.52);
  inner.add(tray);

  return root;
}