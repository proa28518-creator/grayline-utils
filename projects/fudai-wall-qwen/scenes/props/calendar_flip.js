export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'calendar_flip';

  const block = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.8, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 })
  );
  block.position.y = 0.09;
  block.name = 'block';
  group.add(block);

  const binding = new THREE.Mesh(
    new THREE.BoxGeometry(1.52, 1.92, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9, metalness: 0.2 })
  );
  binding.position.y = 0.12;
  binding.name = 'binding';
  group.add(binding);

  const page = new THREE.Mesh(
    new THREE.BoxGeometry(1.32, 1.72, 0.03),
    new THREE.MeshStandardMaterial({ color: 0xf5efe0, roughness: 0.7, metalness: 0.05 })
  );
  page.position.set(0, 0.095, 0.075);
  page.name = 'page';
  group.add(page);

  const digits = [
    { text: '12', y: 0.42, size: 0.42 },
    { text: 'years', y: 0.06, size: 0.22 },
    { text: '14', y: -0.34, size: 0.42 },
    { text: 'years', y: -0.7, size: 0.22 }
  ];

  digits.forEach((d, i) => {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.05, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.1 })
    );
    plate.position.set(0, d.y, 0.085);
    plate.name = 'digits_' + i;
    page.add(plate);
  });

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.6, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.8, metalness: 0.15 })
  );
  stand.position.set(0, -0.38, 0);
  stand.name = 'stand';
  group.add(stand);

  group.updateState = function (state) {
    const year = state.year || 12;
    const flipped = state.flipped !== false;
    const visible = state.visible !== false;

    group.visible = visible;

    const pageMesh = group.getObjectByName('page');
    if (pageMesh) pageMesh.visible = visible;

    const bindingMesh = group.getObjectByName('binding');
    if (bindingMesh) bindingMesh.visible = visible;

    page.children.forEach((child) => {
      if (child.name && child.name.startsWith('digits_')) {
        const index = parseInt(child.name.slice(7));
        if (year === 12) {
          child.visible = index < 2;
        } else if (year === 14) {
          child.visible = index >= 2;
        } else {
          child.visible = false;
        }
      }
    });

    group.rotation.z = flipped ? 0 : 0.04;
  };

  group.updateState({ year: 12, flipped: true, visible: true });

  return group;
}