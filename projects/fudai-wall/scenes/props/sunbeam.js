// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const g=new THREE.Group(),opacity=Math.max(0,Math.min(1,o.opacity??0));const m=new THREE.Mesh(new THREE.ConeGeometry(9,22,12,1,true),new THREE.MeshBasicMaterial({color:'#f5cb78',transparent:true,opacity:.2*opacity,depthWrite:false,side:THREE.DoubleSide}));m.position.y=-11;g.add(m);for(let i=-2;i<=2;i++){const s=new THREE.Mesh(new THREE.CylinderGeometry(.12,.4,18,6,1,true),new THREE.MeshBasicMaterial({color:'#ffe09b',transparent:true,opacity:.12*opacity,depthWrite:false}));s.position.set(i*1.3,-7,0);s.rotation.z=(i-1)*.07;g.add(s);}return finish(g);}
