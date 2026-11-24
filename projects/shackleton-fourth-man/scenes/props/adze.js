// scenes/props/adze.js — 1916 expedition carpenter's ice-cutting adze (فأس)
// Origin at the hand grip; pure geometry with steel blade, hammer poll, and wood handle.
import * as THREE from '../../vendor/three.module.js';

export function build(opts = {}) {
  const g = new THREE.Group();
  g.name = 'prop_adze';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x7c502b, roughness: 0.84 });
  const wrapMat = new THREE.MeshStandardMaterial({ color: 0x2c221b, roughness: 0.92 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x9aa8b8, roughness: 0.36, metalness: 0.72 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xdce6f0, roughness: 0.22, metalness: 0.85 });

  // Ash wood handle (grip at y = 0, head at y = +0.85 D)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.044, 1.12, 8), woodMat);
  handle.position.y = 0.38;
  g.add(handle);

  // Leather grip wrap around origin
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.24, 8), wrapMat);
  grip.position.y = 0.0;
  g.add(grip);

  // Forged steel eye/socket at top of handle
  const socket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.14), steelMat);
  socket.position.set(0, 0.92, 0);
  g.add(socket);

  // Curved horizontal adze cutting blade protruding forward (+Z)
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.055, 0.36), steelMat);
  blade.position.set(0, 0.88, 0.20);
  blade.rotation.x = 0.34;
  g.add(blade);

  // Gleaming bevelled cutting edge
  const edge = new THREE.Mesh(new THREE.BoxGeometry(0.225, 0.025, 0.08), edgeMat);
  edge.position.set(0, 0.81, 0.36);
  edge.rotation.x = 0.42;
  g.add(edge);

  // Rear hammer poll (-Z)
  const poll = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.14), steelMat);
  poll.position.set(0, 0.92, -0.12);
  g.add(poll);

  const scale = opts.scale ?? 1.0;
  g.scale.setScalar(scale);
  return g;
}

export default { build };