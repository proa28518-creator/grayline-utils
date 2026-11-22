// STUDY SHELL — boots Russell's ORIGINAL renderer (app-shell/renderer/, untouched)
// and answers its host contract (window.suite IPC) with honest neutral stubs.
// Reads resolve empty; actions REJECT — this shell must never fake a result.
// Every invoke is logged (study data) when STUDY_LOG=1 or in proof mode.
const { app, BrowserWindow, ipcMain, clipboard, nativeImage } = require("electron");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const STUBS = require("./stub-table");

const RENDERER_DIR = path.join(__dirname, "renderer");
const EVIDENCE_DIR = path.join(__dirname, "..", "orch", "renderer-boot");
const PROOF = process.env.STUDY_PROOF === "1";
const LOGGING = PROOF || process.env.STUDY_LOG === "1" || process.env.STUDY_DEBUG === "1";
app.setPath("userData", "/tmp/heart-study-shell-userdata");
app.disableHardwareAcceleration();

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".json": "application/json",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".ico": "image/x-icon" };

let serverUrl = null;
function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
      const file = path.join(RENDERER_DIR, rel);
      if (!file.startsWith(RENDERER_DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("study shell: not served here");
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => {
      serverUrl = `http://127.0.0.1:${srv.address().port}`;
      resolve(serverUrl);
    });
  });
}

function logInvoke(ch, kind) {
  if (!LOGGING) return;
  try {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    fs.appendFileSync(path.join(EVIDENCE_DIR, "invoke-log.jsonl"),
      JSON.stringify({ t: new Date().toISOString(), ch, kind }) + "\n");
  } catch { /* evidence logging must never break the shell */ }
}

function gitPresent() {
  try { execFileSync("git", ["--version"], { stdio: "ignore" }); return true; } catch { return false; }
}

// The config shape the Settings/App code reads (cfg.* paths extracted in the inventory).
const CONFIG_STUB = {
  ui: { brand: "faceless" },
  lastProjectId: null, lastPersonalProjectId: null,
  claude: { model: null, effort: "medium", permissions: null, autoVerify: false,
            executable: null, maxTurns: null, userMcp: null, faster: false },
  claudePlan: { kind: null, custom: null, hide: false, detected: null },
  bridge: { enabled: false },
  engines: {}, library: {}, skool: {}, sound: {}, tools: {}, updates: {}, video: {},
};

function registerHandlers(win) {
  const specials = {
    "app:info": () => ({ version: "0.28.2", platform: process.platform,
                         server: serverUrl, preview: false, testHooks: false }),
    "app:copy": (_e, text) => { clipboard.writeText(String(text ?? "")); return true; },
    "app:copyImage": (_e, file) => {
      const img = nativeImage.createFromPath(String(file));
      if (img.isEmpty()) throw new Error("study shell: image not readable");
      clipboard.writeImage(img); return true;
    },
    "app:zoom": (e, z) => { e.sender.setZoomFactor(Number(z) || 1); return true; },
    "config:get": () => CONFIG_STUB,
    "health": () => ({ git: gitPresent(), server: serverUrl,
      db: { ok: false, error: "study shell: no suite database behind this build" },
      claude: { loggedIn: false }, executable: false,
      runtime: {}, pinned: {}, install: {}, pyMissing: [] }),
    "stats": () => ({}),
    "claude:status": () => ({ loggedIn: false, method: null }),
    "plan:get": () => ({ kind: null, custom: null, hide: false, detected: null }),
    "update:status": () => ({ state: "none" }),
    "update:beta": () => null,
    // Home's "Coming up" does Object.values(board.cards) — the board object must carry its cards map.
    "channels:board": () => ({ cards: {}, ideas: [] }),
    // Usage view does data.rows.filter(...) and data.projects[id] — shape from its consumer code.
    "usage:summary": () => ({ today: new Date().toISOString().slice(0, 10),
                              rows: [], firstDay: null, projects: {} }),
    // Settings' Images section reads img.flow.chrome / .opened / .resting without chaining.
    // chrome:false is literally true on this machine (no Chrome installed for Flow).
    "images:status": () => ({ flow: { chrome: false, opened: false, resting: false },
                              higgsfield: { hasKey: false, hint: null },
                              fal: { hasKey: false, hint: null },
                              active: "flow", setting: "auto", custom: null,
                              paidFallback: false, paidPrice: {},
                              models: [], higgsfieldModels: [], defaultModel: null }),
  };
  for (const [ch, kind] of Object.entries(STUBS)) {
    if (kind === "special") {
      ipcMain.handle(ch, (e, ...a) => { logInvoke(ch, "special"); return specials[ch](e, ...a); });
    } else if (kind === "list") {
      ipcMain.handle(ch, () => { logInvoke(ch, "list->[]"); return []; });
    } else if (kind === "object") {
      ipcMain.handle(ch, () => { logInvoke(ch, "object->{}"); return {}; });
    } else {
      ipcMain.handle(ch, () => {
        logInvoke(ch, "reject");
        throw new Error(`study shell: "${ch}" is not wired — no backend behind this build`);
      });
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function proofTour(win) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const consoleErrors = [];
  win.webContents.on("console-message", (_e, level, message) => {
    if (level >= 2) consoleErrors.push(String(message).slice(0, 300));
  });
  const report = { electron: process.versions.electron, rendererVersion: "0.28.2 (teardown)",
                   startedAt: new Date().toISOString(), screens: [] };
  const snap = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(EVIDENCE_DIR, `${name}.png`), img.toPNG());
    const text = await win.webContents.executeJavaScript("document.body ? document.body.innerText : ''");
    fs.writeFileSync(path.join(EVIDENCE_DIR, `${name}.txt`), text);
    return text;
  };
  await win.loadURL(serverUrl + "/");
  await sleep(3500);
  const homeText = await snap("boot-home");
  report.screens.push({ screen: "home (boot)", found: true,
    textHead: homeText.slice(0, 400), consoleErrors: [...consoleErrors] });
  consoleErrors.length = 0;
  const labels = ["Projects", "Channels", "YouTube", "Routines", "Berserk",
                  "Library", "Styles", "Memory", "Thumbnails", "Workspace", "Renders",
                  "Settings", "Help", "New project"];
  for (const label of labels) {
    await win.loadURL(serverUrl + "/");
    await sleep(2800);
    const clicked = await win.webContents.executeJavaScript(`(() => {
      const want = ${JSON.stringify(label)}.toLowerCase();
      const els = [...document.querySelectorAll('a,button,[role="button"],div,span')]
        .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().left < 340
          && (el.innerText || '').trim().toLowerCase() === want);
      if (!els.length) return false;
      els.sort((a, b) => a.innerText.length - b.innerText.length);
      (els[0].closest('a,button,[role="button"]') || els[0]).click();
      return true;
    })()`).catch(() => false);
    if (!clicked) { report.screens.push({ screen: label, found: false }); continue; }
    await sleep(2200);
    const slug = "page-" + label.toLowerCase().replace(/\s+/g, "-");
    const text = await snap(slug).catch(() => "");
    report.screens.push({ screen: label, found: true, textHead: text.slice(0, 400),
                          consoleErrors: [...consoleErrors] });
    consoleErrors.length = 0;
  }
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(EVIDENCE_DIR, "tour-report.json"), JSON.stringify(report, null, 2));
  app.quit();
}

app.whenReady().then(async () => {
  await startServer();
  const win = new BrowserWindow({
    width: 1440, height: 950,
    webPreferences: { preload: path.join(__dirname, "preload.js"), sandbox: false },
  });
  registerHandlers(win);
  if (process.env.STUDY_DEBUG === "1" || process.env.STUDY_DEBUG === "2") {
    const found = [];
    try {
      win.webContents.debugger.attach("1.3");
      win.webContents.debugger.on("message", async (_e, method, params) => {
        if (method === "Runtime.exceptionThrown") {
          const d = params.exceptionDetails;
          found.push((d.exception && d.exception.description) || d.text);
        }
        if (method === "Debugger.paused" && params.reason === "exception") {
          const frames = (params.callFrames || []).slice(0, 4).map((f) =>
            `${f.functionName || "(anon)"} @${(f.url || "").split("/").pop()}:${(f.location ? f.location.lineNumber : "?")}`);
          const val = params.data && params.data.description ? params.data.description.split("\n")[0] : "";
          found.push(`THROW ${val} :: ${frames.join(" <- ")}`);
          try { await win.webContents.debugger.sendCommand("Debugger.resume"); } catch { /* gone */ }
        }
      });
      win.webContents.debugger.sendCommand("Runtime.enable");
      if (process.env.STUDY_DEBUG === "2") {
        await win.webContents.debugger.sendCommand("Debugger.enable");
        await win.webContents.debugger.sendCommand("Debugger.setPauseOnExceptions", { state: "all" });
      }
    } catch (err) { found.push("debugger attach failed: " + err.message); }
    await win.loadURL(serverUrl + "/");
    await sleep(5000);
    if (process.env.STUDY_DEBUG === "2") {
      await win.webContents.executeJavaScript(`(() => {
        const els = [...document.querySelectorAll('a,button,[role="button"],div,span')]
          .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().left < 340
            && (el.innerText || '').trim().toLowerCase() === 'settings');
        if (els.length) { els.sort((a, b) => a.innerText.length - b.innerText.length); (els[0].closest('a,button,[role="button"]') || els[0]).click(); return true; }
        return false;
      })()`).catch(() => false);
      await sleep(6000);
    }
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    fs.writeFileSync(path.join(EVIDENCE_DIR, "debug-exceptions.json"), JSON.stringify(found, null, 2));
    app.quit();
    return;
  }
  if (PROOF) { proofTour(win); }
  else { win.loadURL(serverUrl + "/"); }
});
app.on("window-all-closed", () => app.quit());
