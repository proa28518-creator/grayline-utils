import * as THREE from 'three';
export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'gravestone';

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.14, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9, metalness: 0.2 })
  );
  base.position.y = 0.07;
  base.name = 'base';
  group.add(base);

  const stone = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1.4, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.85, metalness: 0.15 })
  );
  stone.position.y = 0.84;
  stone.name = 'stone';
  group.add(stone);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.1, 0.38),
    new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.9, metalness: 0.2 })
  );
  top.position.y = 1.62;
  top.name = 'top';
  group.add(top);

  const namePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.14, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 })
  );
  namePlate.position.set(0, 1.58, 0.19);
  namePlate.name = 'namePlate';
  group.add(namePlate);

  const nameInk = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.07, 0.01),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  nameInk.position.set(0, 1.58, 0.196);
  nameInk.name = 'nameInk';
  group.add(nameInk);

  const datePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.1, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 })
  );
  datePlate.position.set(0, 1.44, 0.19);
  datePlate.name = 'datePlate';
  group.add(datePlate);

  const dateInk = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.05, 0.01),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  dateInk.position.set(0, 1.44, 0.196);
  dateInk.name = 'dateInk';
  group.add(dateInk);

  const flowers = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.18, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xd00000, roughness: 0.7, metalness: 0.1 })
  );
  flowers.position.set(0, 0.16, 0.28);
  flowers.name = 'flowers';
  group.add(flowers);

  group.updateState = function (state) {
    const thanked = state.thanked !== false;
    const visible = state.visible !== false;

    group.visible = visible;

    const flowersMesh = group.getObjectByName('flowers');
    if (flowersMesh) flowersMesh.visible = thanked && visible;

    const namePlateMesh = group.getObjectByName('namePlate');
    if (namePlateMesh) namePlateMesh.visible = visible;

    const nameInkMesh = group.getObjectByName('nameInk');
    if (nameInkMesh) nameInkMesh.visible = visible;

    const datePlateMesh = group.getObjectByName('datePlate');
    if (datePlateMesh) datePlateMesh.visible = visible;

    const dateInkMesh = group.getObjectByName('dateInk');
    if (dateInkMesh) dateInkMesh.visible = visible;
  };

  group.updateState({ thanked: true, visible: true });

  return group;
}
