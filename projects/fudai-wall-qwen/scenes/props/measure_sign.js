export function build(opts = {}) {
  const group = new THREE.Group();
  group.name = opts.id || 'measure_sign';

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.6, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.1 })
  );
  board.position.y = 0.06;
  board.name = 'board';
  group.add(board);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.52, 1.72, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.2 })
  );
  frame.position.y = 0.08;
  frame.name = 'frame';
  group.add(frame);

  const lines = [
    { text: '5', y: 0.62, size: 0.5 },
    { text: '4', y: 0.42, size: 0.5 },
    { text: '3', y: 0.22, size: 0.5 },
    { text: '2', y: 0.02, size: 0.5 },
    { text: '1', y: -0.18, size: 0.5 },
    { text: '3,000', y: -0.46, size: 0.42 },
    { text: '$30M', y: -0.72, size: 0.46 },
    { text: '12 years', y: -0.98, size: 0.42 },
    { text: '15.5M', y: -1.24, size: 0.5 },
    { text: '10M', y: -1.5, size: 0.42 }
  ];

  lines.forEach((line, i) => {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.16, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6, metalness: 0.1 })
    );
    plate.position.set(0, line.y, 0.07);
    plate.name = 'line_' + i;
    board.add(plate);

    const ink = new THREE.Mesh(
      new THREE.BoxGeometry(line.size * 0.9, 0.08, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a })
    );
    ink.position.set(0, line.y, 0.095);
    ink.name = 'ink_' + line.text;
    board.add(ink);
  });

  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 2.2, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8, metalness: 0.15 })
  );
  post.position.set(0, -1.1, 0);
  post.name = 'post';
  group.add(post);

  group.updateState = function (state) {
    const height = state.height || 5;
    const money = state.money || 0;
    const years = state.years || 0;
    const wallM = state.wallM || 0;
    const neighbourM = state.neighbourM || 0;

    const boardMesh = group.getObjectByName('board');
    if (boardMesh) {
      boardMesh.visible = true;
    }

    group.children.forEach((child) => {
      if (child.name && child.name.startsWith('ink_')) {
        const label = child.name.slice(4);
        let visible = false;
        if (label === '5' || label === '4' || label === '3' || label === '2' || label === '1') {
          visible = height >= parseInt(label);
        } else if (label === '3,000') {
          visible = money >= 1;
        } else if (label === '$30M') {
          visible = money >= 2;
        } else if (label === '12 years') {
          visible = years >= 1;
        } else if (label === '15.5M') {
          visible = wallM >= 1;
        } else if (label === '10M') {
          visible = neighbourM >= 1;
        }
        child.visible = visible;
        if (child.parent) {
          child.parent.children.forEach((c) => {
            if (c.name && c.name === 'line_' + child.name.slice(5)) {
              c.visible = visible;
            }
          });
        }
      }
    });
  };

  group.updateState({ height: 5, money: 0, years: 0, wallM: 0, neighbourM: 0 });

  return group;
}