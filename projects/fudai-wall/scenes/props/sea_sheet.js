// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const g=new THREE.Group(),water=part(new THREE.PlaneGeometry(120,80),flat('#4e91aa','#28647f'),.005);water.rotation.x=-Math.PI/2;water.position.y=.02;water.position.z=-28;g.add(water);const foam=part(new THREE.BoxGeometry(120,.035,.16),flat('#d8e5df'),.003);foam.position.set(0,.06,12-(o.pull??0));g.add(foam);return finish(g);}
