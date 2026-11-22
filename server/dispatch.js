'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const REPO='proa28518-creator/grayline-utils';
function scrub(value) { return String(value).replace(/ghp_[A-Za-z0-9_]+|gho_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+|Bearer \S+/g,'[redacted]'); }
function gh(args, opts={}) { const r=spawnSync('gh',['-R',REPO,...args],{encoding:'utf8',timeout:30000,...opts});return {...r,stdout:scrub(r.stdout||''),stderr:scrub(r.stderr||'')}; }
function json(r) { if(r.status!==0) throw new Error(scrub((r.stderr||r.stdout||'gh failed').trim().slice(0,1000))); try{return JSON.parse(r.stdout||'{}');}catch(e){throw new Error(scrub(e.message));} }
function before(workflow) { return json(gh(['run','list','--workflow',workflow,'--limit','1','--json','databaseId'])).map(x=>String(x.databaseId)); }
function dispatch(workflow, inputs) {
  const pre=before(workflow); const ref=process.env.GITHUB_REF||'main';
  const args=['workflow','run',workflow,'--ref',ref]; for(const [k,v] of Object.entries(inputs)) args.push('-f',`${k}=${v}`);
  const r=gh(args); if(r.status!==0) throw new Error(scrub((r.stderr||r.stdout||'gh workflow run failed').trim()));
  for(let i=0;i<20;i++){const rows=json(gh(['run','list','--workflow',workflow,'--limit','10','--json','databaseId,createdAt'])); const found=rows.filter(x=>!pre.includes(String(x.databaseId))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]; if(found)return String(found.databaseId); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,1000);}
  throw new Error('Dispatched workflow but could not find its run id');
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function dispatchAsync(workflow,inputs){
  const pre=before(workflow),ref=process.env.GITHUB_REF||'main',args=['workflow','run',workflow,'--ref',ref];
  for(const [k,v] of Object.entries(inputs))args.push('-f',`${k}=${v}`);
  const r=gh(args);if(r.status!==0)throw new Error(scrub((r.stderr||r.stdout||'gh workflow run failed').trim()));
  for(let i=0;i<20;i++){const rows=json(gh(['run','list','--workflow',workflow,'--limit','10','--json','databaseId,createdAt']));const found=rows.filter(x=>!pre.includes(String(x.databaseId))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0];if(found)return String(found.databaseId);await sleep(1000);}
  throw new Error('Dispatched workflow but could not find its run id');
}
function child(args, cwd) { return spawn(args[0],args.slice(1),{cwd,stdio:['ignore','pipe','pipe']}); }
async function monitor(job, {runId,projectDir,kind,settingsSent,repoDir}) {
  job.runId=runId; job.log.push({t:Date.now(),stream:'system',text:`GitHub Actions run id: ${runId}`});
  let pollFailures=0;
  while(!job.cancelRequested){
    const r=gh(['run','view',runId,'--json','status,conclusion']);
    if(r.status!==0){pollFailures++;const error=scrub((r.stderr||'gh run view failed').trim());if(pollFailures>=5){job.log.push({t:Date.now(),stream:'err',text:error});job.status='failed';break;}job.log.push({t:Date.now(),stream:'err',text:`poll retry ${pollFailures}/5: ${error}`});await sleep(15000);continue;}
    let data;try{data=JSON.parse(r.stdout);}catch(e){pollFailures++;const error=scrub(e.message);if(pollFailures>=5){job.log.push({t:Date.now(),stream:'err',text:error});job.status='failed';break;}job.log.push({t:Date.now(),stream:'err',text:`poll retry ${pollFailures}/5: ${error}`});await sleep(15000);continue;}pollFailures=0;job.log.push({t:Date.now(),stream:'system',text:scrub(`${data.status}${data.conclusion?' · '+data.conclusion:''} · run ${runId}`)});
    if(data.status==='completed'){
      if(job.cancelRequested){job.status='stopped';job.log.push({t:Date.now(),stream:'system',text:'Stop honored; artifacts were NOT applied'});break;}
      if(data.conclusion!=='success'){job.status='failed';job.log.push({t:Date.now(),stream:'err',text:'Workflow concluded: '+data.conclusion});break;}
      const dest=kind==='stills'?path.join(projectDir,'out','fleet',runId):path.join(projectDir,'out','github-master',runId);fs.mkdirSync(dest,{recursive:true});
      const dl=gh(['run','download',runId,'-D',dest]);if(dl.status!==0){job.status='failed';job.log.push({t:Date.now(),stream:'err',text:scrub((dl.stderr||'artifact download failed').trim())});break;}
      if(job.cancelRequested){job.status='stopped';job.log.push({t:Date.now(),stream:'system',text:'Stop honored; artifacts were NOT applied'});break;}
      for(const f of fs.readdirSync(dest,{recursive:true})){if(String(f).endsWith('.tar.gz')){const ar=path.join(dest,String(f));const u=spawnSync('tar',['--no-same-owner','-xzf',ar,'-C',dest],{encoding:'utf8'});if(u.status!==0)throw new Error('artifact_unpack_failed: '+scrub(u.stderr));}}
      if(kind==='stills'){
        let info=null;for(const f of fs.readdirSync(dest,{recursive:true}))if(String(f)==='run-info.json'){info=JSON.parse(fs.readFileSync(path.join(dest,String(f)),'utf8'));break;}
        if(!info)throw new Error('run-info.json missing from downloaded artifact');const board=path.join(projectDir,'out','board');fs.mkdirSync(board,{recursive:true});for(const f of fs.readdirSync(dest,{recursive:true})){if(/\.(png|jpe?g|webp)$/i.test(String(f))){const src=path.join(dest,String(f));fs.copyFileSync(src,path.join(board,`gh-${runId}-${path.basename(String(f))}`));}}job.verification=`run-info settings: ${JSON.stringify(info.settings||{})}; sent: ${JSON.stringify(settingsSent)}`;
      } else {
        const mp4s=[];for(const f of fs.readdirSync(dest,{recursive:true}))if(String(f).endsWith('.mp4'))mp4s.push(path.join(dest,String(f)));
        const master=mp4s.find(x=>/master/.test(x))||mp4s[0];if(!master)throw new Error('master mp4 missing');
        const probe=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_type','-of','json',master],{encoding:'utf8'});const streams=JSON.parse(probe.stdout||'{}').streams||[];if(probe.status!==0||!streams.length)throw new Error('master ffprobe validation failed');job.verification='master exists; ffprobe streams: '+streams.map(x=>x.codec_type).join(',');
      }
      job.status='done';job.log.push({t:Date.now(),stream:'pass',text:'Artifacts back and verified · '+job.verification});break;
    }
    await sleep(15000);
  }
  if(job.cancelRequested){job.status='stopped';}
  job.ended=true;job.finishedAt=Date.now();
}
module.exports={gh,json,dispatch,dispatchAsync,monitor};
