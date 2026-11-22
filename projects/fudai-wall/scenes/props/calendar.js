import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const page=o.page??0,years=o.years??12,g=new THREE.Group(),w=2.2,h=2.8,y=1.9,wood=flat('#93613f','#60412f');
 const board=part(new THREE.BoxGeometry(w,h,.13),wood,.02);board.position.set(0,y,0);g.add(board);
 for(const x of [-.82,.82]){const l=part(new THREE.BoxGeometry(.13,1.9,.13),wood,.015);l.position.set(x,.95,0);g.add(l);}
 const tex=canvasTex(440,560,(c,W,H)=>{c.fillStyle='#f3ead3';c.fillRect(0,0,W,H);c.fillStyle='#b74436';c.fillRect(0,0,W,75);c.fillStyle='#302d2b';c.textAlign='center';c.textBaseline='middle';c.font='bold 190px sans-serif';c.fillText(String(page+1),W/2,210);c.font='bold 46px sans-serif';c.fillText('سنة',W/2,330);c.strokeStyle='#958b77';c.lineWidth=3;for(let r=0;r<4;r++)for(let col=0;col<7;col++){c.beginPath();c.arc(48+col*57,405+r*34,5,0,Math.PI*2);c.stroke();}});
 const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.16,h-.16),basic('#fff',{map:tex}));face.position.set(0,y,.071);g.add(face);
 for(const x of [-.42,.42]){const hoop=part(new THREE.TorusGeometry(.28,.035,6,16,Math.PI),wood,.006);hoop.position.set(x,3.34,.08);hoop.rotation.z=Math.PI;g.add(hoop);}
 return finish(g);
}
