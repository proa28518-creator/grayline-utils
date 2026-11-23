// Author: Codex seat · brief: P10_FIX_SIGN_BRIEF.md · date: 2026-11-23 · byte-identical copy of scenes/props/sign.js (film-local kind rename, Opus hunt APPLY WITH FIXES).
import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
  const w=o.w??2.6,h=o.h??1.1,post=o.post??1,leg=o.leg??1.2,bg=o.bg??'#e8dcc0',fg=o.fg??'#302d2b',g=new THREE.Group();
  const boardY=(post?leg:0)+h/2, wood=flat('#8a5935','#593b2c');
  const b=part(new THREE.BoxGeometry(w,h,.12),flat(bg),.025); b.position.y=boardY; g.add(b);
  const t=String(o.text??''); const tex=canvasTex(768,320,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';let size=150;c.font=`bold ${size}px sans-serif`;while(c.measureText(t).width>W*.88&&size>20){size-=4;c.font=`bold ${size}px sans-serif`;}c.fillText(t,W/2,H/2,W*.9);});
  const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.12,h-.12),basic('#ffffff',{map:tex}));face.position.set(0,boardY,.066);g.add(face);
  if(post) for(const x of [-w*.34,w*.34]){const p=part(new THREE.BoxGeometry(.12,leg,.12),wood);p.position.set(x,leg/2,0);g.add(p);}
  return finish(g);
}
