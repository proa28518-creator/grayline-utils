export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'wall';

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(24.8, 24.8, 2),
    new THREE.MeshStandardMaterial({ color: 0x7a7268, roughness: 0.8 })
  );
  wall.position.set(0, 12.4, 0);
  wall.name = 'wall';
  group.add(wall);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(26, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x6a6258, roughness: 0.85 })
  );
  base.position.set(0, 0, 0);
  base.name = 'base';
  group.add(base);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(26.4, 1, 2.4),
    new THREE.MeshStandardMaterial({ color: 0x5a544a, roughness: 0.9 })
  );
  cap.position.set(0, 25.4, 0);
  cap.name = 'cap';
  group.add(cap);

  const crack = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.6, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x4a443a, roughness: 0.9 })
  );
  crack.position.set(-4, 13, 1.01);
  crack.name = 'crack';
  group.add(crack);

  group.updateState = function (state) {
    const visible = state.visible !== false;
    group.visible = visible;
    const capMesh = group.getObjectByName('cap');
    if (capMesh) capMesh.visible = visible;
    const crackMesh = group.getObjectByName('crack');
    if (crackMesh) crackMesh.visible = visible;
  };

  group.updateState({ visible: true });

  return group;
}