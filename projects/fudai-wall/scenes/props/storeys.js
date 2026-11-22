import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
  const h=o.h??17.4,floors=o.floors??5,w=o.w??5.2,d=o.d??2.4,g=new THREE.Group(),fh=h/floors;
  const glass=new THREE.MeshBasicMaterial({color:'#a9d8d2',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false});
  const edge=flat('#b4d8d0','#6f9996'), ink=flat('#eee5c9','#c6b996');
  const add=(geo,mat,x,y,z,iw=.018)=>{const m=part(geo,mat,iw);m.position.set(x,y,z);g.add(m);return m;};
  for(let i=0;i<floors;i++){const y=fh*(i+.5);add(new THREE.BoxGeometry(w,fh-.06,d),glass,0,y,0,0);add(new THREE.BoxGeometry(w+.12,.075,d+.12),edge,0,fh*(i+1),0,.012);}
  for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])add(new THREE.BoxGeometry(.09,h,.09),edge,x,h/2,z,.012);
  const tex=canvasTex(192,512,(c,W,H)=>{c.clearRect(0,0,W,H);c.fillStyle='#efe5c8';c.fillRect(0,0,W,H);c.fillStyle='#302d2b';c.font='bold 74px sans-serif';c.textAlign='center';c.textBaseline='middle';for(let i=0;i<floors;i++)c.fillText(String(i+1),W/2,H-(i+.5)*H/floors);});
  add(new THREE.BoxGeometry(.9,h,.10),ink,w/2+.52,h/2,0,.018);
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(.82,h-.16),new THREE.MeshBasicMaterial({map:tex,transparent:true}));plane.position.set(w/2+.52,h/2,.061);g.add(plane);
  return finish(g);
}
