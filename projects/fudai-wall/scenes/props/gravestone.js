// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const h=o.h??1.5,g=new THREE.Group(),stone=flat('#918d83','#5e625d');const slab=part(new THREE.BoxGeometry(.9,h,.25),stone,.025);slab.position.set(0,h/2,0);g.add(slab);const cap=part(new THREE.SphereGeometry(.45,12,8,0,Math.PI*2,0,Math.PI/2),stone,.02);cap.position.y=h-.02;cap.scale.z=.28;g.add(cap);const pl=part(new THREE.BoxGeometry(1.02,.12,.34),flat('#777970','#50554f'),.02);pl.position.y=.06;g.add(pl);g.rotation.x=-4*Math.PI/180;return finish(g);}
