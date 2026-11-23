export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'gate';

  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(6, 12, 1),
    new THREE.MeshStandardMaterial({ color: 0x4a443a, roughness: 0.7 })
  );
  gate.position.set(0, 6, 0);
  gate.name = 'gate';
  group.add(gate);

  const bar1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 11.2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x3a342e, roughness: 0.9 })
  );
  bar1.position.set(-1.6, 0, 0.51);
  bar1.name = 'bar1';
  group.add(bar1);

  const bar2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 11.2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x3a342e, roughness: 0.9 })
  );
  bar2.position.set(1.6, 0, 0.51);
  bar2.name = 'bar2';
  group.add(bar2);

  const bar3 = new THREE.Mesh(
    new THREE.BoxGeometry(5.76, 0.12, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x3a342e, roughness: 0.9 })
  );
  bar3.position.set(0, 5.2, 0.51);
  bar3.name = 'bar3';
  group.add(bar3);

  const bar4 = new THREE.Mesh(
    new THREE.BoxGeometry(5.76, 0.12, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x3a342e, roughness: 0.9 })
  );
  bar4.position.set(0, -5.2, 0.51);
  bar4.name = 'bar4';
  group.add(bar4);

  group.updateState = function (state) {
    const visible = state.visible !== false;
    group.visible = visible;
  };

  group.updateState({ visible: true });

  return group;
}