import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const lineY=o.lineY??1,pin=o.pin??0,label=String(o.label??'15.5M'),g=new THREE.Group(),w=3.4,h=2.6,cy=1.7,z=0;
 const board=part(new THREE.BoxGeometry(w,h,.16),flat('#315c83','#1d3f62'),.02);board.position.set(0,cy,z);g.add(board);
 for(const x of [-1.1,1.1]){const leg=part(new THREE.BoxGeometry(.14,1.7,.14),flat('#846241','#5c422f'),.012);leg.position.set(x,.85,0);g.add(leg);}
 const tex=canvasTex(680,520,(c,W,H)=>{c.fillStyle='#174b78';c.fillRect(0,0,W,H);c.strokeStyle='#79a7ca';c.lineWidth=2;for(let x=0;x<W;x+=34){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=34){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}c.strokeStyle='#d4e5dc';c.lineWidth=7;c.strokeRect(90,72,500,380);c.strokeRect(260,270,160,182);});
 const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.12,h-.12),basic('#fff',{map:tex}));face.position.set(0,cy,.086);g.add(face);
 const wallTop=cy+1.0, y=cy-.95+Math.max(0,Math.min(1,lineY))*1.9;
 const line=part(new THREE.BoxGeometry(2.15,.055,.035),basic('#ffe15a'),0);line.position.set(.15,y,.12);g.add(line);
 const palm=part(new THREE.BoxGeometry(.28,.2,.08),flat('#d6a17f','#9c6a51'),.01);palm.position.set(1.42,y,.13);g.add(palm);for(let i=0;i<3;i++){const f=part(new THREE.BoxGeometry(.07,.22,.07),flat('#d6a17f','#9c6a51'),.005);f.position.set(1.54+i*.065,y+.15, .13);f.rotation.z=-.2;g.add(f);}
 if(pin>=1){const ruler=part(new THREE.BoxGeometry(.18,2.05,.07),flat('#eadfbc','#a99a76'),.008);ruler.position.set(1.28,cy,.14);g.add(ruler);for(let i=0;i<10;i++){const tick=part(new THREE.BoxGeometry(.16,.018,.02),basic('#393b3d'),0);tick.position.set(1.17,cy-.9+i*.2,.19);g.add(tick);}const t=canvasTex(280,80,(c,W,H)=>{c.fillStyle='#f1e5c1';c.fillRect(0,0,W,H);c.fillStyle='#302d2b';c.font='bold 48px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(label,W/2,H/2);});const p=part(new THREE.BoxGeometry(.9,.28,.06),flat('#f1e5c1'),.005);p.position.set(1.3,cy+1.12,.14);g.add(p);const m=new THREE.Mesh(new THREE.PlaneGeometry(.84,.23),basic('#fff',{map:t}));m.position.set(1.3,cy+1.12,.176);g.add(m);}
 return finish(g);
}
