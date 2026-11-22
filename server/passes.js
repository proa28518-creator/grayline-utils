'use strict';
const fs=require('fs'),path=require('path');
const passes=[
 {id:'build',label:'Build',scope:'Own the scene structure and authored source needed to realize the approved story.',allowedPaths:['scenes/','src/','engine.js','models.js']},
 {id:'camera',label:'Camera angles',scope:'Own camera placement, framing, and shot specifications.',allowedPaths:['scenes/','specs/']},
 {id:'environment',label:'Environment overhaul',scope:'Own world layout, backgrounds, and environmental assets.',allowedPaths:['scenes/','world/','assets/']},
 {id:'post',label:'Post-processing',scope:'Own finishing intent and post-processing source/specifications.',allowedPaths:['finishing_plan.md','specs/','src/']},
 {id:'shading',label:'Shading',scope:'Own material and lighting specifications and library assets.',allowedPaths:['scenes/','specs/','lib/']}
].map(x=>({...x,invariants:'Acting, props, voice and timings from earlier layers stay unchanged.'}));
function stateFile(project,id){return path.join(project,'out','passes',id,'state.json')}
function getState(project,id){const f=stateFile(project,id);try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch(_){return{pass:id,state:'not_started',rounds:0,updatedAt:null,history:[]}}}
module.exports={passes,getState,stateFile};
