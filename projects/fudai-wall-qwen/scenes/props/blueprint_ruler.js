export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'blueprint_ruler';

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

  const wallLine = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.035, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.1 })
  );
  wallLine.position.set(0, 0.28, 0.055);
  wallLine.name = 'wallLine';
  group.add(wallLine);

  const mark155 = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.18, 0.03),
    new THREE.MeshStandardMaterial({ color: 0xd00000, roughness: 0.6, metalness: 0.1 })
  );
  mark155.position.set(0.42, 0.28, 0.065);
  mark155.name = 'mark155';
  group.add(mark155);

  const gateBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.7, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.1 })
  );
  gateBox.position.set(0, -0.28, 0.055);
  gateBox.name = 'gateBox';
  group.add(gateBox);

  const ruler = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 1.4, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5, metalness: 0.1 })
  );
  ruler.position.set(0.72, 0.06, 0.07);
  ruler.name = 'ruler';
  group.add(ruler);

  const rulerTicks = [];
  for (let i = 0; i <= 15; i++) {
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.03, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 })
    );
    tick.position.set(0.72, -0.62 + i * 0.086, 0.09);
    tick.name = 'tick_' + i;
    group.add(tick);
    rulerTicks.push(tick);
  }

  group.updateState = function (state) {
    const locked = state.locked !== false;
    const visible = state.visible !== false;

    group.visible = visible;

    const mark = group.getObjectByName('mark155');
    if (mark) mark.visible = locked && visible;

    const rulerMesh = group.getObjectByName('ruler');
    if (rulerMesh) rulerMesh.visible = visible;

    rulerTicks.forEach((tick, i) => {
      if (tick) tick.visible = visible && i <= 15;
    });

    const sheetMesh = group.getObjectByName('sheet');
    if (sheetMesh) sheetMesh.visible = visible;

    const borderMesh = group.getObjectByName('border');
    if (borderMesh) borderMesh.visible = visible;
  };

  group.updateState({ locked: true, visible: true });

  return group;
}