import * as THREE from 'three';
export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'paper';

  const sheet = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.6, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.6, metalness: 0.1 })
  );
  sheet.position.y = 0.025;
  sheet.name = 'sheet';
  group.add(sheet);

  const border = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 1.7, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.2 })
  );
  border.position.y = 0.035;
  border.name = 'border';
  group.add(border);

  const planLine = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.035, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.1 })
  );
  planLine.position.set(0, 0.3, 0.055);
  planLine.name = 'planLine';
  group.add(planLine);

  const mark = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.16, 0.03),
    new THREE.MeshStandardMaterial({ color: 0xd00000, roughness: 0.6, metalness: 0.1 })
  );
  mark.position.set(0.4, 0.3, 0.065);
  mark.name = 'mark';
  group.add(mark);

  const notes = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.04, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.1 })
  );
  notes.position.set(0, -0.4, 0.055);
  notes.name = 'notes';
  group.add(notes);

  group.updateState = function (state) {
    const visible = state.visible !== false;
    group.visible = visible;
  };

  group.updateState({ visible: true });

  return group;
}
