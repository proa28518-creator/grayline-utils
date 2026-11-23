// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const draw=Math.max(0,Math.min(1,o.draw??1)),g=new THREE.Group(),ink=flat('#39322b');const line=part(new THREE.BoxGeometry(1.4*draw,.035,.025),ink,.004);line.position.set(-.7+draw*.7,o.lineY??0,0);g.add(line);const tip=part(new THREE.ConeGeometry(.045,.12,5),flat('#d2a17c'),.004);tip.position.set(-.7+1.4*draw,o.lineY??0,.025);tip.rotation.z=-Math.PI/2;g.add(tip);return finish(g);}
