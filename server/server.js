'use strict';
/* Heart Studio — zero-dependency local server.
 * Serves the control UI (/), the project host page + files (/project/...),
 * and a small JSON API over <project>/panel_state.json.
 * State writes are serialized and atomic (tmp file + rename). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dispatchLayer = require('./dispatch');
const appDir = path.join(__dirname, '..', 'app', 'renderer');
const passModule = require('./passes');

const STEPS = ['write', 'add', 'run', 'build', 'mix', 'export'];
const SUBSTEPS = ['camera', 'environment', 'post', 'shading'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.mp4': 'video/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.css': 'text/css', '.txt': 'text/plain',
  '.md': 'text/plain', '.bin': 'application/octet-stream'
};

function defaultState(projectDir) {
  let title = 'مشروع جديد';
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(projectDir, 'project.json'), 'utf8'));
    if (pj && pj.title) title = pj.title;
  } catch (e) { /* no project.json — fine */ }
  let script = '';
  try { script = fs.readFileSync(path.join(projectDir, 'script.txt'), 'utf8'); } catch (e) { /* none */ }
  return {
    title, idea: '', script, scriptVersion: 1, voice: null,
    steps: { write: 'idle', add: 'idle', run: 'idle', build: 'idle', mix: 'idle', export: 'idle' },
    stepTimes: {},
    substeps: { camera: 'idle', environment: 'idle', post: 'idle', shading: 'idle' },
    approvals: [], finalFilm: null,
    log: [{ t: Date.now(), actor: 'system', text: 'تم إنشاء المشروع' }]
  };
}

function createHeartServer({ projectDir, uiDir, port = 8903 }) {
  const repoDir = path.resolve(__dirname, '..');
  const projectsDir = path.join(repoDir, 'projects');
  let activeDir = projectDir;
  let stateFile = path.join(activeDir, 'panel_state.json');
  let state;
  try {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const d = defaultState(activeDir);
    state = Object.assign(d, state);
    state.steps = Object.assign(d.steps, state.steps || {});
    state.substeps = Object.assign(d.substeps, state.substeps || {});
  } catch (e) { state = defaultState(projectDir); }

  let chain = Promise.resolve();
  function persist() {
    const snapshot = JSON.stringify(state, null, 1);
    chain = chain.then(async () => {
      const tmp = stateFile + '.tmp.' + process.pid;
      await fs.promises.writeFile(tmp, snapshot);
      await fs.promises.rename(tmp, stateFile);
    }).catch(() => {});
    return chain;
  }
  function log(actor, text) { state.log.push({ t: Date.now(), actor, text }); }

  const jobs = new Map();
  let connectionCache = null;
  const connectionNames = ['GPT','Gemini','Opus','GLM'];
  const connectionEmpty = () => connectionNames.map(name => ({name,probed:false,status:'unprobed',checkedAt:null}));
  const timed = () => new Date().toISOString();
  function safeRun(bin,args,options={}) { return new Promise(resolve=>{ const p=spawn(bin,args,{...options,stdio:['ignore','pipe','pipe']}); let out='',err='';p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);p.on('error',e=>resolve({code:1,out,err:e.message}));p.on('close',code=>resolve({code,out,err}));}); }
  function nodeSpawnEnv(extra) { return { ...process.env, ...(extra || {}), ELECTRON_RUN_AS_NODE: '1' }; }
  function runNode(args, opts={}) { return safeRun(process.execPath, args, { ...opts, env: nodeSpawnEnv(opts.env) }); }
  function runCaptured(bin,args,options={},timeout=0,onData=()=>{},onSpawn=()=>{}) { return new Promise(resolve=>{ let out='',err='',timedOut=false,settled=false;const p=spawn(bin,args,{...options,stdio:['pipe','pipe','pipe']});onSpawn(p);const finish=r=>{if(settled)return;settled=true;if(timer)clearTimeout(timer);resolve({...r,out,err,timedOut});};const timer=timeout?setTimeout(()=>{timedOut=true;p.kill('SIGTERM');setTimeout(()=>{if(!settled)p.kill('SIGKILL');},3000).unref();},timeout):null;p.stdout.on('data',x=>{out+=x;onData('out',x)});p.stderr.on('data',x=>{err+=x;onData('err',x)});p.on('error',e=>{err+=e.message;finish({code:1})});p.on('close',code=>finish({code:code??1})); }); }
  async function probeConnections() {
    const results=[];
    const home=process.env.HOME||'';
    // Codex CLI output is inspected without returning auth material.
    let codex=process.env.CODEX_BIN; if(!codex||!fs.existsSync(codex)) codex=['/usr/lib/chatgpt/resources/codex',path.join(home,'workspace/tools/chatgpt-app/extracted/usr/lib/chatgpt/resources/codex')].find(fs.existsSync);
    let gpt={name:'GPT',probed:true,checkedAt:timed(),status:'dead',reason:'codex binary not found',authMetadata:null};
    try { if(codex) { const r=await safeRun(codex,['login','status'],{timeout:15000}); const signed=r.code===0&&/logged in|chatgpt|openai account/i.test(r.out+'\n'+r.err);gpt.status=signed?'connected':'dead';gpt.reason=signed?undefined:(r.code!==0?'Codex login status command failed':'Codex output did not indicate a ChatGPT login'); }
      const a=JSON.parse(fs.readFileSync(path.join(home,'.codex/auth.json'),'utf8'));gpt.authMetadata={auth_mode:a.auth_mode||null,last_refresh:a.last_refresh||null,has_tokens:Object.prototype.hasOwnProperty.call(a,'tokens')};
    } catch(e){gpt.metadataError='auth metadata unavailable';}
    results.push(gpt);
    let gem={name:'Gemini',probed:true,checkedAt:timed(),status:'unknown'};
    try {
      const db=path.join(home,'.config/gemini-desktop/Cookies');if(!fs.existsSync(db))throw new Error('Gemini Cookies database not found');
      const os=require('os'),{spawnSync}=require('child_process');
      const query="SELECT name FROM cookies WHERE host_key LIKE '%google.%' OR host_key LIKE '%.google.com';";
      const readNames=file=>spawnSync('sqlite3',[`file:${file}?immutable=1`,query],{encoding:'utf8',timeout:10000});
      let r=readNames(db);
      if(r.status!==0){
        const dir=fs.mkdtempSync(path.join(os.tmpdir(),'heart-gem-'));
        try { const copy=path.join(dir,'Cookies');fs.copyFileSync(db,copy);r=spawnSync('sqlite3',[copy,query],{encoding:'utf8',timeout:10000}); }
        finally { fs.rmSync(dir,{recursive:true,force:true}); }
      }
      if(r.status!==0)throw new Error(r.stderr||'sqlite read failed');
      const names=r.stdout.split(/\r?\n/);const found=names.some(n=>['__Secure-1PSID','__Secure-3PSID','SID'].includes(n));gem.status=found?'connected':'dead';gem.state=found?'connected':'awaiting_owner_signin';if(!found)gem.reason='سجّل دخول المالك في تطبيق Gemini desktop على هذا الجهاز';
    }
    catch(e){gem.status='unknown';gem.reason='تعذر قراءة قاعدة جلسة Gemini: '+String(e.message).slice(0,180);}results.push(gem);
    let opus={name:'Opus',probed:true,checkedAt:timed(),status:'dead'};
    try { const helper=path.join(home,'workspace/tools/opus_call.py'), envFile=path.join(home,'workspace/user/files/llmsrelay.env');let key='';const contents=fs.readFileSync(envFile,'utf8');const m=contents.match(/^\s*LLMSRELAY_API_KEY\s*=\s*(.*?)\s*$/m);if(m)key=m[1].replace(/^['"]|['"]$/g,'');if(!key)throw new Error('LLMSRELAY_API_KEY is missing');const dir=fs.mkdtempSync(path.join(require('os').tmpdir(),'heart-opus-probe-'));const prompt=path.join(dir,'prompt.txt'),out=path.join(dir,'out.txt');fs.writeFileSync(prompt,'Reply with exactly: OK');const r=await safeRun('python3',[helper,prompt,out,'32'],{env:{...process.env,LLMS_KEY:key},timeout:45000});const answer=fs.existsSync(out)?fs.readFileSync(out,'utf8'):r.out;opus.status=r.code===0&&answer.startsWith('OK')?'connected':'dead';if(opus.status==='dead')opus.reason='Opus ping did not return OK';fs.rmSync(dir,{recursive:true,force:true}); }
    catch(e){opus.reason='Opus probe failed: '+String(e.message).slice(0,180);}results.push(opus);
    let glm={name:'GLM',probed:true,checkedAt:timed(),status:'dead',model:'free/glm-5.3-flashx'};
    try {const r=await runNode([path.join(repoDir,'bin','heart'),'models']);const has=r.code===0&&(/free\/glm-5\.3\s+متاح:\s+نعم/i.test(r.out)||/has_glm_free["']?\s*:\s*true/i.test(r.out));glm.status=has?'connected':'dead';if(glm.status==='dead')glm.reason='APInex catalog did not report has_glm_free';}
    catch(e){glm.reason='APInex catalog probe failed: '+String(e.message).slice(0,180);}results.push(glm);
    connectionCache={checkedAt:timed(),connections:results};return connectionCache;
  }
  function safeProject(name) {
    if (!/^[a-zA-Z0-9_-]+$/.test(String(name || ''))) return null;
    const dir = path.join(projectsDir, String(name));
    try { if (fs.statSync(dir).isDirectory()) return dir; } catch (_) {}
    return null;
  }
  function inventory(dir, includeMetadata = false) {
    const exists = rel => fs.existsSync(path.join(dir, rel));
    const boardDir = path.join(dir, 'out', 'board');
    let board = [];
    try { board = fs.readdirSync(boardDir).filter(n => /\.(png|jpe?g|webp)$/i.test(n)); } catch (_) {}
    const script = ['script_owner_ar.md', 'script.txt', 'script.md'].find(exists) || null;
    const voice = ['voice_owner.wav', 'voice_ar.wav', 'audio/source.wav'].find(exists) || null;
    const timing = ['words_owner.txt', 'audio/clean.json', 'timings.json'].find(exists) || null;
    const master = ['out/story6_full.mp4', 'out/master.mp4', 'out/final.mp4'].find(exists) || null;
    let runInfo = null;
    for (const p of ['out/run-info.json', 'out/fleet/run-info.json']) try { runInfo = JSON.parse(fs.readFileSync(path.join(dir, p), 'utf8')); break; } catch (_) {}
    let baseSettings = {};
    try { baseSettings = JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8')).settings || {}; } catch (_) {}
    const captionsSetting = baseSettings.captions;
    const settings = { ...baseSettings, captions: { on: typeof captionsSetting === 'object' ? captionsSetting.on !== false : captionsSetting !== false }, fps: Number(baseSettings.fps) === 24 ? 24 : 30 };
    let masterMetadata = null;
    if (master && includeMetadata) {
      const r = require('child_process').spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate,width,height', '-of', 'json', path.join(dir, master)], { encoding: 'utf8', timeout: 5000 });
      try { const stream = JSON.parse(r.stdout).streams[0]; masterMetadata = { fps: stream.r_frame_rate, width: stream.width, height: stream.height }; } catch (_) {}
    }
    return { name: path.basename(dir), title: (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8')).title || path.basename(dir); } catch (_) { return path.basename(dir); } })(), script, voice, timing, boardCount: board.length, board: board.slice(0, 24), master, masterMetadata, baseSettings, settings, runInfo };
  }
  function projectGitDir(dir) {
    if (fs.existsSync(path.join(dir, '.git'))) return '.git';
    if (fs.existsSync(path.join(dir, '.heart-git'))) return '.heart-git';
    return null;
  }
  function gitInProject(dir, args) {
    const gd = projectGitDir(dir);
    if (!gd) return { status: 1, stderr: 'no project git repo', stdout: '' };
    return require('child_process').spawnSync('git', ['--git-dir', path.join(dir, gd), '--work-tree', dir, ...args], { encoding: 'utf8', cwd: dir });
  }
  function projectGit(dir) {
    if (!projectGitDir(dir)) return [];
    const r = gitInProject(dir, ['log', '-8', '--date=iso-strict', '--pretty=format:%H%x09%h%x09%ad%x09%s']);
    return r.status === 0 ? r.stdout.split('\n').filter(Boolean).map(line => { const [hash, short, date, ...msg] = line.split('\t'); return { hash, short, date, message: msg.join('\t') }; }) : [];
  }
  function artifactChecks(dir) {
    const inv = inventory(dir);
    let timingValid = false;
    for (const timingFile of ['audio/clean.json', 'timings.json']) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(dir, timingFile), 'utf8'));
        timingValid = Array.isArray(t) && t.length > 0 && t.every(x => Number.isFinite(Number(x.start)) && Number.isFinite(Number(x.end)) && Number(x.end) >= Number(x.start));
        if (timingValid) break;
      } catch (_) {}
    }
    if (!timingValid) {
      try {
        const text = fs.readFileSync(path.join(dir, 'words_owner.txt'), 'utf8');
        const rows = [...text.matchAll(/^\[(\d{2}):(\d{2}\.\d+)\s+-\s+(\d{2}):(\d{2}\.\d+)\]\s+\S+/gm)];
        timingValid = rows.length > 0 && rows.every((m, i) => {
          const start = Number(m[1]) * 60 + Number(m[2]), end = Number(m[3]) * 60 + Number(m[4]);
          const prevEnd = i ? Number(rows[i - 1][3]) * 60 + Number(rows[i - 1][4]) : -1;
          return end >= start && start >= prevEnd;
        });
      } catch (_) {}
    }
    const mix = ['out/mix_stage/audio/final_mix.wav', 'out/final_mix.wav', 'out/story6_mix.wav', 'out/mix.wav'].find(p => fs.existsSync(path.join(dir, p))) || null;
    const gates = [
      { id: 'script', label: 'النص موجود', pass: !!inv.script, evidence: inv.script || '—' },
      { id: 'voice', label: 'ملف الصوت الأصلي موجود كما هو', pass: !!inv.voice, evidence: inv.voice || '—' },
      { id: 'timing', label: 'ملف التوقيت موجود وقابل للقراءة', pass: timingValid, evidence: inv.timing || '—' },
      { id: 'board', label: 'لوحة اللقطات تحتوي صوراً', pass: inv.boardCount > 0, evidence: inv.boardCount + ' صورة' },
      { id: 'mix', label: 'ملف المكس النهائي موجود', pass: !!mix, evidence: mix || 'لا يوجد ملف معروف' },
      { id: 'master', label: 'ملف الماستر موجود', pass: !!inv.master, evidence: inv.master || '—' }
    ];
    return { checks: gates, pass: gates.every(x => x.pass), frameEvidence: inv.board, runInfo: inv.runInfo };
  }
  function donePredicate(key, kind) {
    if (kind === 'sub') return inventory(activeDir).boardCount > 0;
    const gates = artifactChecks(activeDir).checks;
    const map = { write: 'script', add: 'voice', run: 'timing', build: 'board', mix: 'mix', export: 'master' };
    const gateId = map[key];
    const gate = gates.find(x => x.id === gateId);
    if (!gate || !gate.pass) return false;
    if (key === 'export' && !artifactChecks(activeDir).pass) return false;
    return true;
  }
  function runCommand(id, dir, args, cwd = repoDir, env = {}) {
    if (jobs.has(id) && !jobs.get(id).ended) throw new Error('هناك عملية تعمل بالفعل');
    const job = { id, projectDir: dir, status: 'running', log: [], startedAt: Date.now(), ended: false, child: null };
    jobs.set(id, job);
    const child = spawn(args[0], args.slice(1), { cwd, env: { ...process.env, HEART_HOME: repoDir, HEART_PROJECT: dir, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    job.child = child;
    const add = (stream, chunk) => { const lines = String(chunk).split(/\r?\n/).filter(Boolean); for (const line of lines) job.log.push({ t: Date.now(), stream, text: line }); if (job.log.length > 500) job.log.splice(0, job.log.length - 500); };
    child.stdout.on('data', c => add('out', c)); child.stderr.on('data', c => add('err', c));
    child.on('error', e => { add('err', e.message); job.status = 'failed'; job.ended = true; job.exitCode = 1; });
      child.on('close', code => {
      job.exitCode = code;
      if (code !== 0) job.status = 'failed';
      else if (job.outputArtifact) {
        try { const stat=fs.statSync(job.outputArtifact);let ok=stat.isFile()&&stat.size>0;const fresh=stat.mtimeMs>=job.startedAt-2000;if(!fresh){ok=false;job.verification='artifact freshness failed: mtime predates job start';}if(['timing','mix'].includes(job.action)&&ok){const report=JSON.parse(fs.readFileSync(job.outputArtifact,'utf8'));ok=report.ok===true;job.verification=ok?`${job.action} report ok`:`${job.action} report failed: ${(report.failures||[]).map(x=>x.name).join(', ')||'ok was not true'}`;} else if(fresh)job.verification=ok?'artifact exists and is non-empty':'artifact predicate failed'; job.status = ok ? 'done' : 'failed'; }
        catch (_) { job.status = 'failed'; job.verification = 'artifact predicate failed'; }
      } else job.status = 'done';
      job.ended = true; job.finishedAt = Date.now();
    });
    return job;
  }

  function scriptSaved(newScript) {
    if (newScript === state.script) return;
    state.script = newScript;
    state.scriptVersion += 1;
    const later = ['run', 'build', 'mix', 'export'];
    const dirty = later.some(s => state.steps[s] !== 'idle') ||
      SUBSTEPS.some(s => state.substeps[s] !== 'idle') || state.approvals.length || state.finalFilm;
    if (dirty) {
      later.forEach(s => { state.steps[s] = 'idle'; delete state.stepTimes[s]; });
      SUBSTEPS.forEach(s => { state.substeps[s] = 'idle'; delete state.stepTimes['sub:' + s]; });
      state.approvals = []; state.finalFilm = null;
      log('system', 'أُعيد حفظ النص (الإصدار ' + state.scriptVersion + ') — أُعيد تعيين «تشغيل ومعالجة الصوت» وكل ما بعده');
    } else {
      log('owner', 'حفظ نص الفيلم — الإصدار ' + state.scriptVersion);
    }
  }

  function maybeCompleteBuild() {
    if (SUBSTEPS.every(s => state.substeps[s] === 'done') && state.steps.build !== 'done') {
      state.steps.build = 'done';
      state.stepTimes.build = state.stepTimes.build || {};
      state.stepTimes.build.end = Date.now();
      log('system', 'اكتملت مرحلة «بناء المشاهد» — كل الممرات الأربعة تمت');
    }
  }

  function setStepStatus(kind, key, status) {
    const map = kind === 'sub' ? state.substeps : state.steps;
    map[key] = status;
    const tk = kind === 'sub' ? 'sub:' + key : key;
    state.stepTimes[tk] = state.stepTimes[tk] || {};
    if (status === 'running') state.stepTimes[tk].start = Date.now();
    if (status === 'done' || status === 'failed') state.stepTimes[tk].end = Date.now();
    if (kind === 'sub') maybeCompleteBuild();
  }

  function sendJson(res, code, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(body);
  }
  function readBody(req) {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', c => { data += c; if (data.length > 8 * 1024 * 1024) req.destroy(); });
      req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
      req.on('error', reject);
    });
  }
  function serveFile(res, root, urlPath) {
    const p = path.normalize(path.join(root, decodeURIComponent(urlPath)));
    const normalizedRoot = path.normalize(root);
    if (p !== normalizedRoot && !p.startsWith(normalizedRoot + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(p, (err, data) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  }

  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    const pn = u.pathname;
    try {
      if (pn === '/api/projects' && req.method === 'GET') {
        const names = fs.readdirSync(projectsDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => inventory(path.join(projectsDir, e.name)));
        return sendJson(res, 200, names);
      }
      if (pn === '/api/projects/new' && req.method === 'POST') {
        const b=await readBody(req); if(!/^[a-zA-Z0-9_-]+$/.test(String(b.name||'')))return sendJson(res,400,{error:'invalid project name'});
        const dest=path.join(projectsDir,b.name);if(fs.existsSync(dest))return sendJson(res,409,{error:'project already exists'});
        if(typeof b.audioPath!=='string'||!fs.existsSync(b.audioPath)||!fs.statSync(b.audioPath).isFile())return sendJson(res,400,{error:'audioPath must be an existing file'});
        const created=await runNode([path.join(repoDir,'bin','heart'),'new',b.name,b.template||'demo-ring'],{cwd:repoDir});if(created.code!==0)return sendJson(res,500,{error:created.err||created.out||'heart new failed'});
        fs.copyFileSync(b.audioPath,path.join(dest,'voice_owner.wav'));if(b.timingsPath){if(!fs.existsSync(b.timingsPath)||!fs.statSync(b.timingsPath).isFile())return sendJson(res,400,{error:'timingsPath must be an existing file'});fs.copyFileSync(b.timingsPath,path.join(dest,'words_owner.txt'));}
        const cleanFile=path.join(dest,'audio','clean.json');
        if(b.timingsPath){
          const timingText=fs.readFileSync(path.join(dest,'words_owner.txt'),'utf8');
          const timingPattern=/^\[(\d{2}):(\d{2}\.\d+)\s+-\s+(\d{2}):(\d{2}\.\d+)\]\s+(.+)$/;
          const entries=[];
          for(const line of timingText.split(/\r?\n/)){
            const match=line.match(timingPattern);if(!match)continue;
            entries.push({start:Number(match[1])*60+Number(match[2]),end:Number(match[3])*60+Number(match[4]),line:entries.length+1,who:null,word:match[5]});
          }
          if(entries.length){fs.mkdirSync(path.dirname(cleanFile),{recursive:true});fs.writeFileSync(cleanFile,JSON.stringify(entries,null,2)+'\n');}
          else if(fs.existsSync(cleanFile))fs.unlinkSync(cleanFile);
        }
        fs.writeFileSync(path.join(dest,'brief.md'),String(b.idea||''));fs.writeFileSync(path.join(dest,'script.txt'),String(b.idea||''));
        const pf=path.join(dest,'project.json'),pj=JSON.parse(fs.readFileSync(pf,'utf8'));pj.settings={fps:30,captions:{on:true},...(pj.settings||{})};if(![24,30].includes(Number(pj.settings.fps)))pj.settings.fps=30;fs.writeFileSync(pf,JSON.stringify(pj,null,2)+'\n');
        const git=(args,cwd=repoDir)=>require('child_process').spawnSync('git',['-C',cwd,...args],{encoding:'utf8'});
        git(['add','-A'],dest);const pc=git(['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m','snapshot: brief + voice attached'],dest);if(pc.status!==0)return sendJson(res,500,{error:'project snapshot failed: '+pc.stderr});
        fs.renameSync(path.join(dest,'.git'),path.join(dest,'.heart-git'));
        let pushed=false,pushError;const add=git(['add','projects/'+b.name]);const commit=add.status===0?git(['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m',`project: ${b.name} created via interface`]):add;
        if(commit.status!==0){pushError=(commit.stderr||commit.stdout||'repo commit failed').trim();}else{const branch=git(['branch','--show-current']);const push=branch.status===0?git(['push','origin',branch.stdout.trim()]):branch; pushed=push.status===0;if(!pushed)pushError=(push.stderr||push.stdout||'push failed').trim();}
        return sendJson(res,200,{ok:true,project:inventory(dest),pushed,historyMode:'heart-git',...(pushError?{pushError}: {})});
      }
      if (pn === '/api/projects/slice' && req.method === 'POST') {
        const b=await readBody(req),dir=safeProject(b.project),seconds=Number(b.seconds);if(!dir)return sendJson(res,400,{error:'project invalid or missing'});if(!(seconds>0&&seconds<=600))return sendJson(res,400,{error:'seconds must be > 0 and <= 600'});
        const out=path.join(dir,'out',`slice-${seconds}s`),r=await runNode([path.join(repoDir,'bin','heart'),'slice',dir,String(seconds),out],{cwd:repoDir});if(r.code!==0)return sendJson(res,500,{error:(r.err||r.out).trim()});
        const files={voice:path.relative(repoDir,path.join(out,'voice_slice.wav')),words:fs.existsSync(path.join(out,'words_slice.txt'))?path.relative(repoDir,path.join(out,'words_slice.txt')):null,clean:fs.existsSync(path.join(out,'clean_slice.json'))?path.relative(repoDir,path.join(out,'clean_slice.json')):null};return sendJson(res,200,{ok:true,dir:path.relative(repoDir,out),files});
      }
      if(pn==='/app'||pn.startsWith('/app/'))return serveFile(res,appDir,(pn==='/app'||pn==='/app/')?'/index.html':pn.slice(4));
      if (pn === '/api/connections' && req.method === 'GET') return sendJson(res,200,connectionCache||{checkedAt:null,connections:connectionEmpty()});
      if(pn==='/api/passes'&&req.method==='GET')return sendJson(res,200,passModule.passes.map(p=>({...p,...passModule.getState(activeDir,p.id)})));
      if(pn==='/api/steer'&&req.method==='POST'){const b=await readBody(req),j=jobs.get(b.id);if(!j||j.ended)return sendJson(res,409,{error:'job missing or ended'});j.steering=j.steering||[];const item={t:Date.now(),text:String(b.text||'')};j.steering.push(item);j.log.push({...item,stream:'steer'});return sendJson(res,200,{ok:true});}
      if(pn==='/api/passes/run'&&req.method==='POST'){
        const activeRun=Array.from(jobs.values()).find(job=>job.kind==='run'&&!job.ended&&job.projectDir===activeDir);if(activeRun)return sendJson(res,409,{error:`توجد عملية تشغيل جارية: ${activeRun.id}`});
        const b=await readBody(req),def=passModule.passes.find(x=>x.id===b.pass);if(!def)return sendJson(res,400,{error:'unknown pass'});
        const ix=passModule.passes.indexOf(def);if(passModule.passes.slice(0,ix).some(p=>passModule.getState(activeDir,p.id).state!=='checkpointed'))return sendJson(res,409,{error:'earlier pass is not checkpointed'});
        const id='pass-'+Date.now(),j={id,kind:'pass',projectDir:activeDir,status:'running',startedAt:Date.now(),ended:false,log:[],steering:[]};jobs.set(id,j);const sf=passModule.stateFile(activeDir,def.id);fs.mkdirSync(path.dirname(sf),{recursive:true});const ps=passModule.getState(activeDir,def.id);ps.state='running';ps.updatedAt=new Date().toISOString();ps.history.push({t:Date.now(),event:'started',detail:'Builder dispatched'});fs.writeFileSync(sf,JSON.stringify(ps,null,2)+'\n');
        (async()=>{const save=()=>{ps.updatedAt=new Date().toISOString();fs.writeFileSync(sf,JSON.stringify(ps,null,2)+'\n');};const log=(stream,text)=>j.log.push({t:Date.now(),stream,text:String(text)});const tail=s=>String(s||'').trim().split(/\r?\n/).slice(-30).join('\n')||'(no output)';let failure='';try{
          if(!projectGitDir(activeDir)){const gd=path.join(activeDir,'.heart-git'),init=require('child_process').spawnSync('git',['--git-dir',gd,'--work-tree',activeDir,'init'],{encoding:'utf8',cwd:activeDir});if(init.status!==0)throw new Error('project git init failed: '+(init.stderr||init.stdout));let baseline=gitInProject(activeDir,['add','-A']);if(baseline.status!==0)throw new Error('baseline git add failed: '+baseline.stderr);baseline=gitInProject(activeDir,['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m','snapshot: pass baseline']);if(baseline.status!==0)throw new Error('baseline snapshot failed: '+(baseline.stderr||baseline.stdout));log('git','Initialized .heart-git and committed snapshot: pass baseline');}
          if(projectGitDir(activeDir)){const gitignore=path.join(activeDir,'.gitignore'),existing=fs.existsSync(gitignore)?fs.readFileSync(gitignore,'utf8'):'',lines=existing.split(/\r?\n/);let updated=existing;for(const entry of ['out/','.heart-git/'])if(!lines.includes(entry)){if(updated&&!updated.endsWith('\n'))updated+='\n';updated+=entry+'\n';}if(updated!==existing)fs.writeFileSync(gitignore,updated);}
          const passBaselineStatus=gitInProject(activeDir,['status','--porcelain']);if(passBaselineStatus.status!==0)throw new Error('project status failed: '+passBaselineStatus.stderr);if(passBaselineStatus.stdout.trim()){let baseline=gitInProject(activeDir,['add','-A']);if(baseline.status!==0)throw new Error('baseline git add failed: '+(baseline.stderr||baseline.stdout));baseline=gitInProject(activeDir,['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m','snapshot: pass baseline']);if(baseline.status!==0)throw new Error('baseline snapshot failed: '+(baseline.stderr||baseline.stdout));log('git','snapshot: pass baseline');ps.history.push({t:Date.now(),event:'baseline',detail:'snapshot: pass baseline'});save();}
          const projectStatus=()=>gitInProject(activeDir,['status','--porcelain']);const projectBeforeResult=projectStatus();if(projectBeforeResult.status!==0)throw new Error('project status failed: '+projectBeforeResult.stderr);const projectBefore=new Set(projectBeforeResult.stdout.split(/\r?\n/).filter(Boolean));
          const repoStatus=()=>require('child_process').spawnSync('git',['-C',repoDir,'status','--porcelain'],{encoding:'utf8'});const repoBeforeResult=repoStatus();if(repoBeforeResult.status!==0)throw new Error('repo status failed: '+repoBeforeResult.stderr);const repoBefore=new Set(repoBeforeResult.stdout.split(/\r?\n/).filter(Boolean));
          const enforceScope=stage=>{const violations=[];const status=projectStatus();if(status.status!==0)throw new Error(`scope check ${stage}: git status failed: ${status.stderr}`);for(const line of status.stdout.split(/\r?\n/).filter(Boolean)){if(projectBefore.has(line))continue;let p=line.slice(3);if(p.includes(' -> '))p=p.split(' -> ').pop();p=p.replace(/^"|"$/g,'');if(!def.allowedPaths.some(a=>p.startsWith(a)))violations.push(`project:${p}`);}const outside=repoStatus();if(outside.status!==0)throw new Error(`scope check ${stage}: repo status failed: ${outside.stderr}`);for(const line of outside.stdout.split(/\r?\n/).filter(Boolean)){if(repoBefore.has(line))continue;let p=line.slice(3);if(p.includes(' -> '))p=p.split(' -> ').pop();p=p.replace(/^"|"$/g,'');if(!p.startsWith(`projects/${path.basename(activeDir)}/`))violations.push(`repo:${p}`);}if(violations.length){const message=`scope violation after ${stage}: ${violations.join(', ')}`;ps.history.push({t:Date.now(),event:'scope_violation',detail:message});log('fail',message);throw new Error(message);}};
          const dir=path.dirname(sf),briefFile=path.join(dir,'brief.md');const brief=`Work ONLY inside projects/${path.basename(activeDir)}/ and only on these paths: ${def.allowedPaths.join(', ')}.\nPass: ${def.label}\nScope: ${def.scope}\nAllowed paths: ${def.allowedPaths.join(', ')}\nInvariants: ${def.invariants}\nProject brief/script: ${fs.existsSync(path.join(activeDir,'brief.md'))?fs.readFileSync(path.join(activeDir,'brief.md'),'utf8'):fs.readFileSync(path.join(activeDir,'script.txt'),'utf8')}\nAnnotations: ${JSON.stringify(state.annotations||[])}\nEnd with a summary of changes.`;fs.writeFileSync(briefFile,brief);save();
          const home=process.env.HOME||'',codex=process.env.CODEX_BIN&&fs.existsSync(process.env.CODEX_BIN)?process.env.CODEX_BIN:['/usr/lib/chatgpt/resources/codex',path.join(home,'workspace/tools/chatgpt-app/extracted/usr/lib/chatgpt/resources/codex')].find(fs.existsSync);if(!codex)throw new Error('Codex binary not found (CODEX_BIN, /usr/lib/chatgpt/resources/codex, or extracted workspace binary)');
          const builder=async prompt=>{log('builder','Starting bounded Codex builder');const r=await runCaptured(codex,['exec','-m','gpt-6-luna','-s','workspace-write','-C',repoDir],{cwd:repoDir},1200000,(s,c)=>log('builder',`${s}: ${String(c).trim()}`),p=>{j.child=p;p.stdin.end(prompt)});j.child=null;if(r.timedOut||r.code!==0)throw new Error(`builder failed${r.timedOut?' (20-minute timeout)':''}: ${tail(r.err+'\n'+r.out)}`);return tail(r.out);};
          const checks=async()=>{let pj={};try{pj=JSON.parse(fs.readFileSync(path.join(activeDir,'project.json'),'utf8'))}catch(_){}let duration=Number.isFinite(pj.end)?pj.end:null;const voice=inventory(activeDir).voice;if(!(duration>0)&&voice){const q=await safeRun('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path.join(activeDir,voice)]);duration=q.code===0?Number(q.out):null;}if(!(duration>0))duration=10;const results=[];for(const [i,ratio]of[.1,.5,.9].entries()){const name=`probe-${i+1}.png`,out=path.join(dir,name),sec=duration*ratio;fs.mkdirSync(dir,{recursive:true});const r=await runNode([path.join(repoDir,'bin','heart'),'still',activeDir,String(sec),out],{cwd:repoDir});let ok=r.code===0&&fs.existsSync(out),reason=ok?'file exists':'still command/file failed';if(ok){const q=await safeRun('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',out]);try{const s=JSON.parse(q.out).streams[0];ok=q.code===0&&s.width===1080&&s.height===1920;reason=ok?'1080x1920':'expected 1080x1920';}catch(_){ok=false;reason='ffprobe could not read dimensions';}}results.push({name,ok,reason});log('check',`${name}: ${ok?'PASS':'FAIL'} — ${reason}`);}return results;};
          const criticChangeRecord=()=>{const cap=(s,n)=>String(s||'').slice(0,n),allowed=def.allowedPaths,sections=[];try{const stat=gitInProject(activeDir,['diff','HEAD','--stat','--',...allowed]);sections.push(`git diff HEAD --stat:\n${stat.status===0?cap(stat.stdout,2000):`ERROR (exit ${stat.status}): ${stat.stderr||stat.stdout}`}`);const diff=gitInProject(activeDir,['diff','HEAD','--',...allowed]);sections.push(`git diff HEAD:\n${diff.status===0?cap(diff.stdout,7000)+(diff.stdout.length>7000?'\n[diff truncated at 7000 characters]':''):`ERROR (exit ${diff.status}): ${diff.stderr||diff.stdout}`}`);const status=gitInProject(activeDir,['status','--porcelain','--untracked-files=all']);if(status.status!==0){sections.push(`Untracked files: ERROR (exit ${status.status}): ${status.stderr||status.stdout}`);}else{const paths=status.stdout.split(/\r?\n/).filter(Boolean).map(line=>({p:line.slice(3).replace(/^"|"$/g,''),untracked:line.startsWith('?? ')}));const untracked=paths.filter(x=>x.untracked&&x.p&&allowed.some(a=>x.p===a||x.p.startsWith(a.endsWith('/')?a:`${a}/`))).map(x=>x.p);const entries=[];let remaining=4000;for(const p of untracked){let entry=`${p}\n`;try{const full=path.join(activeDir,p),buf=fs.readFileSync(full);if(buf.includes(0)){entry+='[binary file; contents omitted]\n';}else if(remaining>0){const body=buf.toString('utf8'),part=body.slice(0,Math.min(4000,remaining));entry+=part+(body.length>part.length?'\n[file content truncated]':'')+'\n';remaining-=part.length;}else entry+='[contents omitted; total untracked content cap reached]\n';}catch(e){entry+=`[could not read: ${e.message}]\n`;}entries.push(entry);}sections.push(`Untracked files under allowedPaths:\n${untracked.length?entries.join('\n'):'(none)'}`);}}catch(e){sections.push(`Evidence gathering error: ${e.message}`);}return sections.join('\n\n');};
          const criticApprovedDirection=()=>{for(const name of ['brief.md','script.txt']){try{const value=fs.readFileSync(path.join(activeDir,name),'utf8');return `Project's approved brief/direction (the work is judged against this): ${value.slice(0,3000)}${value.length>3000?'\n[approved direction truncated at 3000 characters]':''}`;}catch(e){if(e.code!=='ENOENT')return `Project's approved brief/direction: [could not read ${name}: ${e.message}]`;}}return "Project's approved brief/direction: [no brief.md or script.txt found]";};
          const criticEvidence=(header,summary,result)=>{const evidence=criticChangeRecord(),prompt=`${criticApprovedDirection()}\n\n${header}\nBuilder summary tail:\n${summary}\nChecks:\n${JSON.stringify(result,null,2)}\nProbe files: ${result.map(x=>x.name).join(', ')}\nThe probe stills were rendered and verified programmatically by the program itself; their dimensions are recorded in the checks. Judge the change record and checks against the project's approved brief/direction above. You must answer VERDICT: YES or VERDICT: NO with reasons.\n\nActual pass change record:\n${evidence}`;return prompt.length<=18000?prompt:prompt.slice(0,17950)+'\n[Evidence pack truncated at 18000 characters]';};
          const critic1=async(summary,result,round)=>{const ev=path.join(dir,`evidence1${round?'-'+round:''}.txt`),prompt=criticEvidence(`Pass: ${def.label}\nScope: ${def.scope}`,summary,result);fs.writeFileSync(ev,prompt);const r=await safeRun('python3',[path.join(home,'workspace/tools/apinex2_chat.py'),'chat','free/glm-5.3-flashx',ev,'1200'],{cwd:repoDir});const answer=r.out+'\n'+r.err,m=answer.match(/VERDICT:\s*(YES|NO)/i);if(r.code!==0||!m)throw new Error('GLM critic dead door: '+(r.code!==0?tail(answer):'unparseable verdict'));log('critic',`GLM verdict ${m[1]}: ${tail(answer)}`);return{yes:m[1].toUpperCase()==='YES',findings:answer};};
          let summary=await builder(fs.readFileSync(briefFile,'utf8'));enforceScope('builder');let result=await checks(),verdict=await critic1(summary,result,0),rounds=0,maxRounds=b.mode==='faster'?1:2;while(!verdict.yes&&rounds<maxRounds){rounds++;ps.rounds=(ps.rounds||0)+1;save();const steer=j.steering.map(x=>x.text).join('\n'),fix=`${fs.readFileSync(briefFile,'utf8')}\n\nCritic findings:\n${verdict.findings}\n\nNew steering:\n${steer}`;if(steer)log('steer',`Steering appended to fix prompt: ${steer}`);log('fix',`Fix round ${rounds}`);summary=await builder(fix);enforceScope(`fix round ${rounds}`);result=await checks();verdict=await critic1(summary,result,rounds);}
          const ev2=path.join(dir,'evidence2.txt'),prompt2=criticEvidence(`Fresh second critic review for ${def.label}. Scope: ${def.scope}`,summary,result);fs.writeFileSync(ev2,prompt2);let key='';const envText=fs.readFileSync(path.join(home,'workspace/user/files/llmsrelay.env'),'utf8'),km=envText.match(/^\s*LLMSRELAY_API_KEY\s*=\s*(.*?)\s*$/m);if(km)key=km[1].replace(/^['"]|['"]$/g,'');if(!key)throw new Error('Opus critic dead door: LLMSRELAY_API_KEY missing');const out2=path.join(dir,'opus-reply.txt'),op=await safeRun('python3',[path.join(home,'workspace/tools/opus_call.py'),ev2,out2,'1200'],{cwd:repoDir,env:{...process.env,LLMS_KEY:key}});const answer2=fs.existsSync(out2)?fs.readFileSync(out2,'utf8'):op.out,m2=answer2.match(/VERDICT:\s*(YES|NO)/i);if(op.code!==0||!m2)throw new Error('Opus critic dead door: '+(op.code!==0?tail(answer2):'unparseable verdict'));log('critic',`Fresh Opus verdict ${m2[1]}: ${tail(answer2)}`);const failedChecks=result.filter(x=>!x.ok);if(failedChecks.length||m2[1].toUpperCase()!=='YES')throw new Error(`handoff rejected: ${failedChecks.map(x=>x.name+': '+x.reason).join('; ')} ${m2[1]==='NO'?tail(answer2):''}`);
          log('handoff','Checks and fresh critic passed; creating checkpoint');let gr=gitInProject(activeDir,['add','-A']);if(gr.status!==0)throw new Error('git add failed: '+gr.stderr);gr=gitInProject(activeDir,['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m',`checkpoint: ${def.id} pass`]);if(gr.status!==0)throw new Error('checkpoint commit failed: '+(gr.stderr||gr.stdout));ps.state='checkpointed';ps.history.push({t:Date.now(),event:'checkpointed',detail:`checkpoint: ${def.id} pass`});save();j.status='done';j.waitingOn='لا شيء';
        }catch(e){failure=e.message;ps.state='failed';ps.history.push({t:Date.now(),event:'failed',detail:failure});save();j.status='failed';j.waitingOn=failure;log('fail',failure);}finally{j.ended=true;j.finishedAt=Date.now();}})();return sendJson(res,202,{id,status:j.status});
      }
      if(pn==='/api/passes/rollback'&&req.method==='POST'){const b=await readBody(req),target=passModule.passes.findIndex(p=>p.id===b.pass);if(target<0)return sendJson(res,400,{error:'unknown pass'});if(!projectGitDir(activeDir))return sendJson(res,409,{error:'project has no git repo'});const git=args=>gitInProject(activeDir,args),status=git(['status','--porcelain']);if(status.status!==0)return sendJson(res,409,{error:status.stderr||'git status failed'});if(status.stdout.trim()){const add=git(['add','-A']);if(add.status!==0)return sendJson(res,409,{error:add.stderr||'safety git add failed'});const c=git(['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m','pre-rollback safety']);if(c.status!==0)return sendJson(res,409,{error:c.stderr||'safety commit failed'});}let targetCommit=null;for(let i=target-1;i>=0&&!targetCommit;i--){if(passModule.getState(activeDir,passModule.passes[i].id).state==='checkpointed'){const r=git(['log','-1','--format=%H','--grep',`^checkpoint: ${passModule.passes[i].id} pass`]);if(r.status===0&&r.stdout.trim())targetCommit=r.stdout.trim();}}if(!targetCommit){const r=git(['log','--all','--format=%H','--grep','^snapshot: project created']);if(r.status===0)targetCommit=r.stdout.trim().split(/\r?\n/)[0];}if(!targetCommit)return sendJson(res,409,{error:'no earlier checkpoint or project snapshot commit'});let r=git(['checkout',targetCommit,'--','.']);if(r.status!==0)return sendJson(res,409,{error:r.stderr||'checkout failed'});r=git(['add','-A']);if(r.status!==0)return sendJson(res,409,{error:r.stderr||'git add failed'});r=git(['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m',`rollback: ${b.pass} rolled back`]);if(r.status!==0)return sendJson(res,409,{error:r.stderr||'rollback commit failed'});for(const p of passModule.passes.slice(target)){const ps=passModule.getState(activeDir,p.id);ps.state='not_started';ps.rounds=0;ps.updatedAt=new Date().toISOString();ps.history.push({t:Date.now(),event:'rolled_back',detail:`rolled back ${b.pass}`});fs.mkdirSync(path.dirname(passModule.stateFile(activeDir,p.id)),{recursive:true});fs.writeFileSync(passModule.stateFile(activeDir,p.id),JSON.stringify(ps,null,2)+'\n');}return sendJson(res,200,{ok:true,target:targetCommit});}
      if (pn === '/api/connections/probe' && req.method === 'POST') return sendJson(res,200,await probeConnections());
      if (pn === '/api/project' && req.method === 'GET') return sendJson(res, 200, { ...inventory(activeDir, true), path: path.relative(repoDir, activeDir), gates: artifactChecks(activeDir), history: projectGit(activeDir) });
      if (pn === '/api/select' && req.method === 'POST') {
        const b = await readBody(req);
        if (!/^[a-zA-Z0-9_-]+$/.test(String(b.name || ''))) return sendJson(res, 400, { error: 'اسم مشروع غير صالح' });
        const next = path.join(projectsDir, b.name);
        try { if (!fs.statSync(next).isDirectory()) throw new Error(); } catch (_) { return sendJson(res, 404, { error: 'المشروع غير موجود' }); }
        activeDir = next; stateFile = path.join(activeDir, 'panel_state.json');
        try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch (_) { state = defaultState(activeDir); }
        return sendJson(res, 200, { ...inventory(activeDir, true), path: path.relative(repoDir, activeDir), gates: artifactChecks(activeDir), history: projectGit(activeDir) });
      }
      if (pn === '/api/settings' && req.method === 'POST') {
        const b = await readBody(req);
        if (typeof b.captions !== 'boolean' || ![24, 30].includes(Number(b.fps))) return sendJson(res, 400, { error: 'الإعدادات المقبولة: captions و24/30 fps' });
        const file = path.join(activeDir, 'project.json'), pj = JSON.parse(fs.readFileSync(file, 'utf8'));
        pj.settings = { ...(pj.settings || {}), captions: { ...(typeof pj.settings?.captions === 'object' ? pj.settings.captions : {}), on: b.captions }, fps: Number(b.fps) };
        fs.writeFileSync(file, JSON.stringify(pj, null, 2) + '\n');
        return sendJson(res, 200, { ok: true, settings: pj.settings, note: 'الإعدادات محفوظة في project.json وسيتم تمريرها إلى heart still وGitHub Actions.' });
      }
      if (pn === '/api/history' && req.method === 'GET') return sendJson(res, 200, { available: projectGitDir(activeDir)!==null, commits: projectGit(activeDir) });
      if (pn === '/api/history/revert' && req.method === 'POST') {
        const b = await readBody(req), commits = projectGit(activeDir);
        if (!projectGitDir(activeDir)) return sendJson(res, 409, { error: 'لا يوجد مستودع Git لهذا المشروع' });
        if (!commits.some(c => c.hash === b.hash)) return sendJson(res, 400, { error: 'اللقطة ليست ضمن سجل هذا المشروع' });
        const r = gitInProject(activeDir, ['revert', '--no-edit', b.hash]);
        if (r.status !== 0) return sendJson(res, 409, { error: (r.stderr || r.stdout || 'تعذر التراجع').slice(0, 500) });
        return sendJson(res, 200, { ok: true, commits: projectGit(activeDir) });
      }
      if (pn === '/api/qc' && req.method === 'GET') return sendJson(res, 200, artifactChecks(activeDir));
      if (pn === '/api/annotations' && req.method === 'GET') return sendJson(res, 200, state.annotations || []);
      if (pn === '/api/annotations' && req.method === 'POST') {
        const b = await readBody(req);
        if (typeof b.frame !== 'string' || typeof b.change !== 'string' || !b.change.trim()) return sendJson(res, 400, { error: 'تحتاج الملاحظة إلى إطار ووصف تغيير' });
        const a = { id: 'fix-' + Date.now(), project: path.basename(activeDir), frame: b.frame, change: b.change.trim(), status: 'captured_unwired', t: Date.now() };
        state.annotations = state.annotations || []; state.annotations.push(a);
        await persist();
        return sendJson(res, 201, { ...a, note: 'حُفظت ملاحظة مرتبطة بالإطار؛ إعادتها إلى worker الإصلاح غير موصول بعد.' });
      }
      if (pn === '/api/job' && req.method === 'GET') {
        const j = jobs.get(u.searchParams.get('id'));
        if (!j) return sendJson(res, 404, { error: 'العملية غير موجودة' });
        return sendJson(res, 200, { id: j.id, project: path.basename(j.projectDir), status: j.status, startedAt: j.startedAt, finishedAt: j.finishedAt, exitCode: j.exitCode, log: j.log, steering:j.steering||[], waitingOn: j.waitingOn || 'لا شيء', runSettings: j.runSettings || null, verification: j.verification || null, runId:j.runId||null,legs:j.runSettings?.legs||null });
      }
      if (pn === '/api/stop' && req.method === 'POST') {
        const b = await readBody(req), j = jobs.get(b.id);
        if (!j || j.ended) return sendJson(res, 409, { error: 'لا توجد عملية تعمل' });
        if(j.runId){j.cancelRequested=true;dispatchLayer.gh(['run','cancel',j.runId]);return sendJson(res,200,{ok:true});}
        if(!j.child)return sendJson(res,409,{error:'لا توجد عملية تعمل'});
        j.status = 'stopping'; j.child.kill('SIGTERM'); setTimeout(() => { if (!j.ended) j.child.kill('SIGKILL'); }, 3000).unref();
        return sendJson(res, 200, { ok: true });
      }
      if (pn === '/api/action' && req.method === 'POST') {
        const b = await readBody(req), id = 'job-' + Date.now();
        if (b.action === 'preview') {
          const out = path.join(activeDir, 'out', 'board', 'ui-preview-' + Date.now() + '.png');
          fs.mkdirSync(path.dirname(out), { recursive: true });
          const seconds = Math.max(0, Math.min(55, Number(b.seconds) || 0));
          const j = runCommand(id, activeDir, [process.execPath, path.join(repoDir, 'bin', 'heart'), 'still', activeDir, String(seconds), out], repoDir, { ELECTRON_RUN_AS_NODE: '1' });
          j.outputArtifact = out;
          j.action='preview'; const effective=inventory(activeDir).settings;
          return sendJson(res, 202, { id, status: j.status, output: path.relative(repoDir, out), settingsStatus: 'موصول', settings:effective });
        }
        if (['timing','sound','mix'].includes(b.action)) {const artifact=b.action==='timing'?path.join(activeDir,'out/timing_report.json'):b.action==='mix'?path.join(activeDir,'out/mix_report.json'):path.join(activeDir,'audio/sfx_bed.wav');const j=runCommand(id,activeDir,[process.execPath,path.join(repoDir,'bin','heart'),b.action,activeDir],repoDir,{ELECTRON_RUN_AS_NODE:'1'});j.action=b.action;j.outputArtifact=artifact;return sendJson(res,202,{id,status:j.status,output:path.relative(repoDir,artifact)});}
        if (b.action === 'models') return sendJson(res, 202, { id, status: runCommand(id, activeDir, [process.execPath, path.join(repoDir, 'bin', 'heart'), 'models'], repoDir, { ELECTRON_RUN_AS_NODE: '1' }).status });
        return sendJson(res, 501, { error: 'هذا المنفذ غير موجود: غير موصول بعد' });
      }
      if(pn==='/api/dispatch/runs'&&req.method==='GET'){
        const r=dispatchLayer.gh(['run','list','--limit','50','--json','databaseId,workflowName,status,conclusion,createdAt,displayTitle']);if(r.status!==0)return sendJson(res,502,{error:(r.stderr||'gh run list failed').slice(0,500)});
        const rows=JSON.parse(r.stdout||'[]'),projectName=u.searchParams.get('project');const selected=[];
        for(const row of rows){if(!/Fleet Render Chunk|fleet-render/i.test(row.workflowName||''))continue;if(projectName){const ar=dispatchLayer.gh(['api',`repos/${'proa28518-creator/grayline-utils'}/actions/runs/${row.databaseId}/artifacts`]);if(ar.status!==0)continue;const artifacts=JSON.parse(ar.stdout||'{}').artifacts||[];if(!artifacts.some(a=>a.name.startsWith('fleet-chunk-'+projectName+'-')))continue;}selected.push(row);}
        return sendJson(res,200,selected);
      }
      if(pn==='/api/colab-queue'&&req.method==='GET'){
        const file=path.join(activeDir,'out','colab_queue.json');try{return sendJson(res,200,{entries:JSON.parse(fs.readFileSync(file,'utf8'))});}catch(e){if(e.code==='ENOENT')return sendJson(res,200,{entries:[]});return sendJson(res,200,{entries:[],error:'تعذر قراءة colab_queue.json: '+e.message});}
      }
      if(pn==='/api/dispatch/stills'&&req.method==='POST'){
        const b=await readBody(req),dir=b.project?safeProject(b.project):activeDir;if(!dir)return sendJson(res,400,{error:'project غير صالح أو غير موجود'});const settings=b.settings||inventory(dir).settings;if(![24,30].includes(Number(settings.fps)))return sendJson(res,400,{error:'fps يجب أن يكون 24 أو 30'});const job={id:'dispatch-'+Date.now(),projectDir:dir,status:'queued',startedAt:Date.now(),ended:false,log:[],runSettings:{settings,spec:b.spec||'render:0:30'}};jobs.set(job.id,job);(async()=>{try{job.status='dispatched';const runId=await dispatchLayer.dispatchAsync('fleet-render.yml',{project:path.basename(dir),spec:b.spec||'render:0:30',settings:JSON.stringify(settings)});await dispatchLayer.monitor(job,{runId,projectDir:dir,kind:'stills',settingsSent:settings,repoDir});}catch(e){job.status='failed';job.ended=true;job.finishedAt=Date.now();job.log.push({t:Date.now(),stream:'err',text:e.message});}})();return sendJson(res,202,{id:job.id,status:job.status});
      }
      if(pn==='/api/dispatch/assembly'&&req.method==='POST'){
        const b=await readBody(req);if(!b.framesRunId&&!b.framesArtifact)return sendJson(res,400,{error:'مطلوب framesRunId أو framesArtifact كمصدر إطارات'});const dir=b.project?safeProject(b.project):activeDir;if(!dir)return sendJson(res,400,{error:'project غير صالح أو غير موجود'});if(![24,30].includes(Number(b.fps)))return sendJson(res,400,{error:'fps يجب أن يكون 24 أو 30'});const job={id:'assembly-'+Date.now(),projectDir:dir,status:'queued',startedAt:Date.now(),ended:false,log:[]};jobs.set(job.id,job);(async()=>{try{job.status='dispatched';const inputs={project:path.basename(dir),frames_artifact:b.framesArtifact||'',frames_run_id:b.framesRunId||'',fps:String(b.fps),mix_rel:b.mixRel||'',mode:'assemble'};const runId=await dispatchLayer.dispatchAsync('fleet-assembly.yml',inputs);await dispatchLayer.monitor(job,{runId,projectDir:dir,kind:'assembly',repoDir});}catch(e){job.status='failed';job.ended=true;job.finishedAt=Date.now();job.log.push({t:Date.now(),stream:'err',text:e.message});}})();return sendJson(res,202,{id:job.id,status:job.status});
      }
      if (pn === '/api/run' && req.method === 'POST') {
        const activePass=Array.from(jobs.values()).find(job=>job.kind==='pass'&&!job.ended&&job.projectDir===activeDir);if(activePass)return sendJson(res,409,{error:`توجد مرحلة جارية: ${activePass.id}`});
        const activeRun=Array.from(jobs.values()).find(job=>job.kind==='run'&&!job.ended&&job.projectDir===activeDir);
        if(activeRun)return sendJson(res,409,{error:`توجد عملية تشغيل جارية: ${activeRun.id}`});
        const b = await readBody(req), id = 'run-' + Date.now();
        const j = { id, kind: 'run', projectDir: activeDir, status: 'running', startedAt: Date.now(), ended: false, log: [], waitingOn: 'لا شيء' };
        jobs.set(id, j);
        j.runSettings={mode:b.mode==='faster'?'faster':'quality',model:b.model||'free/glm-5.3-flashx',effort:b.effort||'standard',settings:inventory(activeDir).settings,legs:[]};
        j.steerLogged=0;const leg=(id,state,detail)=>{while(j.steerLogged<(j.steering||[]).length){const s=j.steering[j.steerLogged++];j.log.push({t:Date.now(),stream:'steer',text:'steering received: '+s.text});}const x={id,state,detail};j.runSettings.legs.push(x);j.log.push({t:Date.now(),stream:state==='failed'?'fail':state==='blocked'?'handoff':'pass',text:`${id}: ${state} — ${detail}`});return x;};
        const exists=p=>fs.existsSync(path.join(activeDir,p));
        (async()=>{
          const script=inventory(activeDir).script,voice=inventory(activeDir).voice;
          if(!script){leg('script','blocked','ملف النص غير موجود');j.status='blocked';j.waitingOn='script: ملف النص غير موجود';}
          else leg('script','verified',script+' موجود');
          if(j.status==='running'){if(!voice){leg('voice','blocked','ملف الصوت غير موجود؛ يُستخدم كما هو');j.status='blocked';j.waitingOn='voice: ملف narration الأصلي غير موجود';}else leg('voice','verified',voice+' موجود ويُستخدم كما هو');}
          if(j.status==='running'){
            const timing=runCommand(id+'-timing',activeDir,[process.execPath,path.join(repoDir,'bin','heart'),'timing',activeDir],repoDir,{ELECTRON_RUN_AS_NODE:'1'});j.child=timing.child;const rp=path.join(activeDir,'out/timing_report.json');timing.outputArtifact=rp;timing.action='timing';await new Promise(resolve=>{const check=()=>timing.ended?resolve():setTimeout(check,100);check();});j.child=null;
            if(timing.status!=='done'){leg('timing','failed',timing.verification||'heart timing failed');j.status='failed';j.waitingOn='timing: '+(timing.verification||'فشل التحقق');}else leg('timing','executed',timing.verification);
          }
          if(j.status==='running'){
            let inv=inventory(activeDir);if(inv.boardCount){leg('board','verified',inv.boardCount+' صورة موجودة');}
            else if(b.dispatchStills){j.waitingOn='board: جاري إرسال اللقطات وانتظار GitHub Actions';try{const settings=inventory(activeDir).settings,remote={id:id+'-stills',projectDir:activeDir,status:'dispatched',startedAt:Date.now(),ended:false,log:[]};jobs.set(remote.id,remote);const rid=await dispatchLayer.dispatchAsync('fleet-render.yml',{project:path.basename(activeDir),spec:b.spec||'render:0:30',settings:JSON.stringify(settings)});remote.runId=rid;j.runId=rid;j.framesRunId=rid;await dispatchLayer.monitor(remote,{runId:rid,projectDir:activeDir,kind:'stills',settingsSent:settings,repoDir});if(remote.status==='done'&&inventory(activeDir).boardCount>0)leg('board','executed',`GitHub Actions run ${rid}; ${inventory(activeDir).boardCount} downloaded stills verified`);else{leg('board','failed',`GitHub Actions run ${rid}: ${remote.verification||remote.status}`);j.status='failed';j.waitingOn='board: فشل dispatch أو لم تجتز اللقطات تحقق الملفات';}}catch(e){leg('board','failed','GitHub stills dispatch failed: '+e.message);j.status='failed';j.waitingOn='board: '+e.message;}}
            else{leg('board','blocked','اللوحة فارغة ولم يُطلب dispatchStills');j.status='blocked';j.waitingOn='board: اللوحة فارغة وطلب إرسال اللقطات غير موجود';}
          }
          if(j.status==='running'){
            const inputs=['audio/events.json','audio/beds.json','audio/timeline.json'],missing=inputs.filter(p=>!exists(p)),mixOut=path.join(activeDir,'out/mix_report.json'),finalMix=path.join(activeDir,'out/mix_stage/audio/final_mix.wav');const execute=async(action)=>{const child=runCommand(id+'-'+action,activeDir,[process.execPath,path.join(repoDir,'bin','heart'),action,activeDir],repoDir,{ELECTRON_RUN_AS_NODE:'1'});j.child=child.child;child.outputArtifact=action==='mix'?mixOut:path.join(activeDir,'audio/sfx_bed.wav');child.action=action;await new Promise(resolve=>{const poll=()=>child.ended?resolve():setTimeout(poll,100);poll();});j.child=null;return child;};
            if(missing.length&&exists(finalMix)&&!exists('audio/sfx_bed.wav')){let verified=false;try{const report=JSON.parse(fs.readFileSync(mixOut,'utf8'));verified=report.ok===true;}catch(_){}if(!verified){const q=await safeRun('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',finalMix]);verified=q.code===0&&Number(q.out)>0;}if(verified)leg('sound','verified','existing mix verified');else{leg('sound','failed','existing final_mix.wav failed mix report and ffprobe verification');j.status='failed';j.waitingOn='sound: existing mix verification failed';}}
            else{if(missing.length)j.log.push({t:Date.now(),stream:'info',text:'sound: no sound-design lanes — bed skipped'});else{const sound=await execute('sound');if(sound.status!=='done'){leg('sound','failed',sound.verification||'heart sound failed');j.status='failed';j.waitingOn='sound: '+(sound.verification||'heart sound failed');}}if(j.status==='running'){const mixed=await execute('mix');if(mixed.status==='done'&&JSON.parse(fs.readFileSync(mixOut,'utf8')).ok===true)leg('sound',missing.length?'executed':'executed','mix verified'+(missing.length?' (bed skipped)':''));else{leg('sound','failed',mixed.verification||'mix report ok was not true');j.status='failed';j.waitingOn='sound: mix failed — '+(mixed.verification||'mix report ok was not true');}}}
          }
          if(j.status==='running'){const checks=artifactChecks(activeDir),gates=checks.checks.filter(c=>c.id!=='master');checks.checks.filter(c=>c.id==='master').forEach(c=>j.log.push({t:Date.now(),stream:'info',text:'master — pending export'}));gates.forEach(c=>j.log.push({t:Date.now(),stream:c.pass?'pass':'fail',text:`${c.pass?'PASS':'FAIL'} ${c.id} — ${c.evidence}`}));if(gates.some(c=>!c.pass)){const bad=gates.filter(c=>!c.pass).map(c=>c.id);leg('gates','failed',bad.join(', '));j.status='failed';j.waitingOn='gates: '+bad.join(', ');}else leg('gates','verified','all non-master artifact checks passed');}
          if(j.status==='running'){const master=inventory(activeDir).master;if(master)leg('export','verified',master+' موجود');else if(!j.framesRunId){leg('export','blocked','master missing and no framesRunId');j.status='blocked';j.waitingOn='export: master missing and no framesRunId';}else{try{const git=(args)=>require('child_process').spawnSync('git',['-C',repoDir,...args],{encoding:'utf8'});let gr=git(['add','projects/'+path.basename(activeDir)+'/audio/final_mix.wav','projects/'+path.basename(activeDir)+'/project.json']);if(gr.status!==0)throw new Error('git add: '+(gr.stderr||gr.stdout));gr=git(['diff','--cached','--quiet']);if(gr.status===1){gr=git(['-c','user.name=Heart Studio','-c','user.email=heart@localhost','commit','-m','run: mix for assembly']);if(gr.status!==0)throw new Error('git commit: '+(gr.stderr||gr.stdout));}else if(gr.status!==0)throw new Error('git diff --cached failed');const br=git(['branch','--show-current']);if(br.status!==0||!br.stdout.trim())throw new Error('could not resolve current branch');gr=git(['push','origin',br.stdout.trim()]);if(gr.status!==0)throw new Error('git push failed: '+(gr.stderr||gr.stdout));const assembly={id:id+'-assembly',kind:'assembly',projectDir:activeDir,status:'dispatched',startedAt:Date.now(),ended:false,log:[]};jobs.set(assembly.id,assembly);const arid=await dispatchLayer.dispatchAsync('fleet-assembly.yml',{project:path.basename(activeDir),frames_run_id:j.framesRunId,fps:String(inventory(activeDir).settings.fps),mix_rel:'audio/final_mix.wav',mode:'assemble'});await dispatchLayer.monitor(assembly,{runId:arid,projectDir:activeDir,kind:'assembly',repoDir});assembly.log.forEach(x=>j.log.push({...x,text:'assembly: '+x.text}));if(assembly.status!=='done')throw new Error(`assembly run ${arid} failed: ${assembly.log.slice(-1)[0]?.text||assembly.status}`);const root=path.join(activeDir,'out','github-master',arid),files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,ent.name);if(ent.isDirectory())walk(f);else if(ent.name==='master.mp4')files.push(f);}};if(fs.existsSync(root))walk(root);if(!files.length)throw new Error(`assembly run ${arid}: master.mp4 missing`);const dest=path.join(activeDir,'out/master.mp4');fs.copyFileSync(files[0],dest);const probe=await safeRun('ffprobe',['-v','error','-show_entries','stream=codec_type','-of','json',dest]);const streams=probe.code===0?JSON.parse(probe.out).streams||[]:[];if(!streams.some(x=>x.codec_type==='video')||!streams.some(x=>x.codec_type==='audio'))throw new Error(`assembly run ${arid}: master requires video and audio streams`);leg('export','executed',`assembly run ${arid}; master video/audio verified`);}catch(e){leg('export','failed',e.message);j.status='failed';j.waitingOn='export: '+e.message;}}}
          if(j.status==='running'){j.status='done';j.waitingOn=null;}j.ended=true;j.finishedAt=Date.now();if(!j.waitingOn)j.waitingOn='لا شيء';
        })().catch(e=>{j.status='failed';j.ended=true;j.finishedAt=Date.now();j.waitingOn=e.message;j.log.push({t:Date.now(),stream:'fail',text:e.message});});
        return sendJson(res, 202, { id, status: j.status, waitingOn: j.waitingOn });
      }
      if (pn === '/api/state' && req.method === 'GET') return sendJson(res, 200, state);
      if (pn === '/api/state' && req.method === 'POST') {
        const b = await readBody(req);
        if (typeof b.title === 'string') state.title = b.title;
        if (typeof b.idea === 'string') state.idea = b.idea;
        if (typeof b.script === 'string') scriptSaved(b.script);
        if ('voice' in b) state.voice = b.voice;
        if (b.steps) for (const k of STEPS) if (b.steps[k] && b.steps[k] !== 'done') setStepStatus('step', k, b.steps[k]);
        if (b.substeps) for (const k of SUBSTEPS) if (b.substeps[k] && b.substeps[k] !== 'done') setStepStatus('sub', k, b.substeps[k]);
        if ('finalFilm' in b) state.finalFilm = b.finalFilm;
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/log' && req.method === 'POST') {
        const b = await readBody(req);
        log(b.actor || 'agent', String(b.text || ''));
        await persist();
        return sendJson(res, 200, { ok: true });
      }
      if (pn === '/api/step' && req.method === 'POST') {           // owner's order
        return sendJson(res, 501, { error: 'لا يوجد منفذ لتنفيذ المحطات منفردة بعد؛ لا يتم تسجيل طلب وهمي.' });
      }
      if (pn === '/api/setstep' && req.method === 'POST') {        // agent write-back
        const b = await readBody(req);
        if (b.status === 'done' && !donePredicate(b.substep || b.step, b.substep ? 'sub' : 'step'))
          return sendJson(res, 409, { error: 'لا يمكن اعتماد done: شرط الأثر على القرص لم يمر' });
        if (b.substep && SUBSTEPS.includes(b.substep)) setStepStatus('sub', b.substep, b.status);
        else if (b.step && STEPS.includes(b.step)) setStepStatus('step', b.step, b.status);
        else return sendJson(res, 400, { error: 'step/substep غير معروف' });
        log('agent', 'حالة ' + (b.substep || b.step) + ' ← ' + b.status);
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/batch' && req.method === 'POST') {          // agent posts stills
        const b = await readBody(req);
        if (!SUBSTEPS.includes(b.substep) || !Array.isArray(b.frames))
          return sendJson(res, 400, { error: 'batch يحتاج substep و frames[]' });
        const fixRounds = state.approvals.filter(a => a.substep === b.substep && a.status === 'rejected').length;
        const batch = {
          id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 999),
          substep: b.substep, frames: b.frames, status: 'pending', reason: '', fixRounds, t: Date.now()
        };
        state.approvals.push(batch);
        setStepStatus('sub', b.substep, 'waiting_approval');
        log('agent', 'وصلت دفعة لقطات لمراجعة: ' + b.substep + ' (' + b.frames.length + ' لقطات)');
        await persist();
        return sendJson(res, 200, batch);
      }
      if (pn === '/api/approve' && req.method === 'POST') {
        const b = await readBody(req);
        const batch = state.approvals.find(a => a.id === b.id);
        if (!batch) return sendJson(res, 404, { error: 'الدفعة غير موجودة' });
        if (!donePredicate(batch.substep, 'sub')) return sendJson(res, 409, { error: 'لا يمكن اعتماد اللقطات: لا توجد صور board على القرص' });
        batch.status = 'approved'; batch.tDecision = Date.now();
        setStepStatus('sub', batch.substep, 'done');
        log('owner', 'وافق على لقطات: ' + batch.substep);
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/reject' && req.method === 'POST') {
        const b = await readBody(req);
        const batch = state.approvals.find(a => a.id === b.id);
        if (!batch) return sendJson(res, 404, { error: 'الدفعة غير موجودة' });
        batch.status = 'rejected'; batch.reason = String(b.reason || ''); batch.tDecision = Date.now();
        batch.fixRounds += 1;
        setStepStatus('sub', batch.substep, 'running');
        log('owner', 'رفض لقطات ' + batch.substep + (batch.reason ? ' — السبب: ' + batch.reason : '') + ' (جولة إصلاح ' + batch.fixRounds + ')');
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/voice' && req.method === 'POST') {
        const b = await readBody(req);
        state.voice = b.voice || null;
        log('agent', state.voice ? 'تم إرفاق ملف الصوت: ' + state.voice.name : 'أُزيل ملف الصوت');
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/film' && req.method === 'POST') {
        const b = await readBody(req);
        state.finalFilm = { url: b.url || '', duration: b.duration || 0, size: b.size || 0 };
        log('agent', 'الفيلم النهائي جاهز');
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/' ) return serveFile(res, uiDir, '/index.html');
      if (pn.startsWith('/ui/')) return serveFile(res, uiDir, pn.slice(3));
      if (pn.startsWith('/project/')) return serveFile(res, activeDir, pn.slice(8));
      res.writeHead(404); res.end('not found');
    } catch (e) {
      sendJson(res, 500, { error: String(e && e.message || e) });
    }
  });

  return new Promise(resolve => {
    server.listen(port, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

module.exports = { createHeartServer, STEPS, SUBSTEPS };
if (require.main === module) {
  const projectDir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'projects', 'demo-ring'));
  const uiDir = path.join(__dirname, '..', 'ui');
  const port = Number(process.argv[3] || 8903);
  createHeartServer({ projectDir, uiDir, port }).then(({ port: p }) => {
    console.log('Heart Studio server: http://127.0.0.1:' + p + '/  (project: ' + projectDir + ')');
  });
}
