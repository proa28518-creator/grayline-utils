import * as THREE from 'three';
export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'money_stack';

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.08, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9, metalness: 0.2 })
  );
  base.position.y = 0.04;
  base.name = 'base';
  group.add(base);

  const bills = [
    { y: 0.14, color: 0x7ad35a },
    { y: 0.26, color: 0x7ad35a },
    { y: 0.38, color: 0x7ad35a },
    { y: 0.5, color: 0x7ad35a },
    { y: 0.62, color: 0x7ad35a },
    { y: 0.74, color: 0x7ad35a },
    { y: 0.86, color: 0x7ad35a }
  ];

  bills.forEach((bill, i) => {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.06, 0.42),
      new THREE.MeshStandardMaterial({ color: bill.color, roughness: 0.6, metalness: 0.1 })
    );
    plate.position.set(0, bill.y, 0.05);
    plate.name = 'bill_' + i;
    group.add(plate);

    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.02, 0.46),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.2 })
    );
    band.position.set(0, bill.y - 0.03, 0.052);
    band.name = 'band_' + i;
    group.add(band);
  });

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.04, 0.44),
    new THREE.MeshStandardMaterial({ color: 0xf0e68c, roughness: 0.5, metalness: 0.1 })
  );
  top.position.set(0, 0.92, 0.05);
  top.name = 'top';
  group.add(top);

  const label = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.08, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 })
  );
  label.position.set(0, 0.98, 0.06);
  label.name = 'label';
  group.add(label);

  group.updateState = function (state) {
    const count = state.count || 7;
    const visible = state.visible !== false;

    group.visible = visible;

    group.children.forEach((child) => {
      if (child.name && child.name.startsWith('bill_')) {
        const index = parseInt(child.name.slice(5));
        child.visible = index < count;
      }
      if (child.name && child.name.startsWith('band_')) {
        const index = parseInt(child.name.slice(6));
        child.visible = index < count;
      }
    });

    const topMesh = group.getObjectByName('top');
    if (topMesh) topMesh.visible = visible;

    const labelMesh = group.getObjectByName('label');
    if (labelMesh) labelMesh.visible = visible;

    const baseMesh = group.getObjectByName('base');
    if (baseMesh) baseMesh.visible = visible;
  };

  group.updateState({ count: 7, visible: true });

  return group;
}
