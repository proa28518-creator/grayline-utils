// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(){const g=new THREE.Group(),green=flat('#87964d','#53613c'),stem=part(new THREE.CylinderGeometry(.012,.018,.19,5),flat('#8c7044'),.005);stem.position.y=-.08;stem.rotation.z=.4;g.add(stem);const l=part(new THREE.SphereGeometry(1,10,7),green,.008);l.scale.set(.14,.08,.025);l.rotation.z=.3;g.add(l);return finish(g);}
