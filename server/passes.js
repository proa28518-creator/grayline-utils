'use strict';
const fs=require('fs'),path=require('path');
const passes=[
 {id:'build',label:'Build',scope:'Own the scene structure and authored source needed to realize the approved story.',allowedPaths:['scenes/','src/','engine.js','models.js','props.json'],checks:[['scenes/BIBLE.md','nonempty'],['scenes/film.js','shots']]},
 {id:'camera',label:'Camera angles',scope:'Own camera placement, framing, and shot specifications.',allowedPaths:['scenes/','specs/','props.json'],checks:[['scenes/film.js','camera']]},
 {id:'environment',label:'Environment overhaul',scope:'Own world layout, backgrounds, and environmental assets.',allowedPaths:['scenes/','world/','assets/','props.json'],checks:[['scenes/set.js','nonempty']]},
 {id:'post',label:'Post-processing',scope:'Own finishing intent and post-processing source/specifications.',allowedPaths:['finishing_plan.md','specs/','src/','scenes/','props.json'],checks:[['scenes/post.js','makePost'],['scenes/set.js','post']]},
 {id:'shading',label:'Shading',scope:'Own material and lighting specifications and library assets.',allowedPaths:['scenes/','specs/','lib/','props.json'],checks:[['scenes/shade.js','makeShade'],['scenes/set.js','shade']]}
].map(x=>({...x,invariants:'Acting, props, voice and timings from earlier layers stay unchanged.'}));
function stateFile(project,id){return path.join(project,'out','passes',id,'state.json')}
function getState(project,id){const f=stateFile(project,id);try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch(_){return{pass:id,state:'not_started',rounds:0,updatedAt:null,history:[]}}}
module.exports={passes,getState,stateFile};
