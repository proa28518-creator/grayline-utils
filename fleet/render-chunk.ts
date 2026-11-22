// FLEET RENDER CHUNK — renders one frame-range chunk of a heart project on
// GitHub Actions: serves the project dir locally, drives the project's own
// host page (__suite/cartoon.html?mode=render) through its window.suite API
// in headless Chromium, and packs the result as a tar.gz at the --out path.
//
// Mode spec (--frame argument):
//   render:START:END  frames START..END-1 via suite.stills in batches of 10,
//                     t = frame/30. Archive: frames/frame_NNNN.png,
//                     manifest.json, run-info.json, page-console.log.
//   track:START:END   prop-guard data for frames START..END-1 (suite.track
//                     loop range-limited). Archive: proptrack.json,
//                     run-info.json, page-console.log.
//   <plain number>    legacy: render:0:150.
// Project dir comes from env FLEET_PROJECT (default projects/demo-ring).
// Deadline: past 10.5 minutes the driver packages what exists with
// incomplete=true and exits 1. Any null frame also exits 1 (after packaging).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const PROJECT_DIR = path.join(REPO_ROOT, process.env.FLEET_PROJECT || "projects/demo-ring");
const OUT_DIR = path.join(REPO_ROOT, "fleet-out");
const FRAMES_DIR = path.join(OUT_DIR, "frames");

const FPS = 30;
const BATCH = 10;
const TRACK_CHUNK = 20; // frames per page.evaluate call in track mode
const DEADLINE_MS = 165 * 60 * 1000; // job cap is 180 min incl. setup (owner raised the limit 2026-11-19: fleet renders ~31-57s/frame, a 120-frame chunk needs ~2h)
const BOOT_STEP_MS = 180000; // per-step boot allowance: any observed boot progress restarts this clock (Creatorize 0.28.3 rxhost pattern, adopted 2026-11-22)
const BOOT_CEILING_MS = 15 * 60 * 1000; // overall boot ceiling, however much progress is seen (0.28.3: ~3 min per load step, at most ~15 min in all)

type Mode = "render" | "track";
interface ModeSpec {
  mode: Mode;
  start: number;
  end: number; // exclusive
  raw: string;
}

function parseModeSpec(raw: string): ModeSpec {
  const s = raw.trim();
  if (/^\d+$/.test(s)) {
    // Legacy: the workflow used to pass a single frame index; Run 2 treated
    // it as "render the whole test" — keep that as render:0:150.
    return { mode: "render", start: 0, end: 150, raw };
  }
  const m = /^(render|track):(\d+):(\d+)$/.exec(s);
  if (!m) {
    throw new Error(
      `invalid --frame mode spec ${JSON.stringify(raw)}: expected render:START:END, track:START:END, or a plain number`,
    );
  }
  const start = Number(m[2]);
  const end = Number(m[3]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || end <= start) {
    throw new Error(
      `invalid --frame range in ${JSON.stringify(raw)}: END must be greater than START`,
    );
  }
  return { mode: m[1] === "track" ? "track" : "render", start, end, raw };
}

// ---- args (workflow passes --frame "<spec>" --out m1-first-frame.png)
let outPath = path.join(REPO_ROOT, "m1-first-frame.png");
let spec: ModeSpec = { mode: "render", start: 0, end: 150, raw: "0" };
{
  const argv = process.argv.slice(2);
  let frameArg: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out" && i + 1 < argv.length) {
      outPath = path.resolve(REPO_ROOT, argv[++i]!);
    } else if (argv[i]!.startsWith("--out=")) {
      outPath = path.resolve(REPO_ROOT, argv[i]!.slice("--out=".length));
    } else if (argv[i] === "--frame" && i + 1 < argv.length) {
      frameArg = argv[++i]!;
    } else if (argv[i]!.startsWith("--frame=")) {
      frameArg = argv[i]!.slice("--frame=".length);
    }
  }
  if (frameArg !== null) spec = parseModeSpec(frameArg);
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".glb": "model/gltf-binary",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function startServer(): Promise<{ port: number; close: () => Promise<void> }> {
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]!);
      const filePath = path.join(PROJECT_DIR, urlPath);
      if (!filePath.startsWith(PROJECT_DIR) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404); res.end("not found"); return;
      }
      res.writeHead(200, {
        "content-type": MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
        "cache-control": "no-store",
      });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500); res.end(String(err));
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") { reject(new Error("no addr")); return; }
      resolve({
        port: addr.port,
        close: () => new Promise<void>((r) => server.close(() => r())),
      });
    });
  });
}

const startedAt = Date.now();
const requested = spec.end - spec.start;
const manifest: {
  frame: number; t: number; bytes: number | null;
}[] = [];
const propTrackData: {
  ids: unknown;
  snaps: unknown;
  frames: Record<string, unknown>;
} = { ids: [], snaps: {}, frames: {} };
let trackedCount = 0;
let trackNoProps = false; // track() returns early with no frames when a film has no props — that is a complete result
const runInfo: Record<string, unknown> = {
  test: "foundation-full-render",
  mode: spec.mode,
  start: spec.start,
  end: spec.end,
  frameSpec: spec.raw,
  fps: FPS,
  requestedFrames: requested,
  size: [1080, 1920],
};
let incomplete = false;

function packageOut(): void {
  runInfo.elapsedSeconds = Math.round((Date.now() - startedAt) / 100) / 10;
  runInfo.incomplete = incomplete;
  if (spec.mode === "render") {
    const got = manifest.filter((m) => m.bytes !== null).length;
    runInfo.framesCaptured = got;
    runInfo.framesNull = manifest.filter((m) => m.bytes === null).length;
    fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  } else {
    runInfo.framesTracked = trackedCount;
    runInfo.trackNoProps = trackNoProps;
    fs.writeFileSync(path.join(OUT_DIR, "proptrack.json"), JSON.stringify(propTrackData));
  }
  fs.writeFileSync(path.join(OUT_DIR, "run-info.json"), JSON.stringify(runInfo, null, 2));
  // The workflow uploads exactly the --out path: hand it a tar.gz of OUT_DIR.
  execFileSync("tar", ["-czf", outPath, "-C", OUT_DIR, "."]);
  console.log(`PACKAGED ${outPath} (${fs.statSync(outPath).size} bytes)`);
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (spec.mode === "render") fs.mkdirSync(FRAMES_DIR, { recursive: true });
  const server = await startServer();
  const url = `http://127.0.0.1:${server.port}/__suite/cartoon.html?mode=render`;
  runInfo.url = url;

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--use-gl=angle", "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader", "--enable-webgl",
      "--ignore-gpu-blocklist", "--disable-dev-shm-usage",
      "--no-sandbox", "--no-proxy-server",
    ],
  });
  const consoleLog: string[] = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    page.on("console", (m) => consoleLog.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => consoleLog.push(`[pageerror] ${e.message}`));

    await page.goto(url, { waitUntil: "load", timeout: BOOT_STEP_MS });
    // Poll from Node: waitForFunction trips the host page CSP (Run 1 finding).
    // Progress-aware boot wait (Creatorize 0.28.3 rxhost pattern, adopted
    // 2026-11-22): the old flat 180 s deadline killed slow-but-alive boots —
    // in the app, a heavy first shot on a slower card took longer than the
    // flat limit and the render page was killed as stuck. Our cartoon host
    // (chost.js) exposes no window.loadProgress — its only sign of life is a
    // parent-posted heartbeat, invisible from Node — so progress here is any
    // change in the page's boot signature (loadProgress if a host ever
    // exposes it, window.E / window.F appearing, the suite error count
    // growing) or new console output captured on the Node side. Each progress
    // change restarts the per-step clock (BOOT_STEP_MS); BOOT_CEILING_MS caps
    // the whole boot however alive it looks.
    {
      const bootStartedAt = Date.now();
      let lastProgressAt = bootStartedAt;
      let lastSignature = "";
      let lastConsoleLen = consoleLog.length;
      let bootProgress: unknown = null;
      for (;;) {
        const st = await page
          .evaluate(() => {
            const w = window as unknown as Record<string, unknown>;
            let suiteErrors = -1;
            try {
              const suite = w.suite as { errors?: () => unknown[] } | undefined;
              if (suite && typeof suite.errors === "function") suiteErrors = suite.errors().length;
            } catch { /* suite not up yet */ }
            return {
              ready: w.ready === true,
              bootError: (w.bootError as string | null) || null,
              loadProgress: (w.loadProgress as unknown) ?? null,
              hasEngine: !!w.E,
              hasFilm: !!w.F,
              suiteErrors,
            };
          })
          .catch(() => null);
        if (st && st.ready) {
          runInfo.bootWaitMs = Date.now() - bootStartedAt;
          runInfo.bootProgress = bootProgress;
          break;
        }
        const now = Date.now();
        const signature = st
          ? JSON.stringify({ lp: st.loadProgress, e: st.hasEngine, f: st.hasFilm, errs: st.suiteErrors })
          : "";
        if ((signature && signature !== lastSignature) || consoleLog.length !== lastConsoleLen) {
          lastProgressAt = now;
          lastSignature = signature;
          lastConsoleLen = consoleLog.length;
          if (st) bootProgress = st.loadProgress ?? { engine: st.hasEngine, film: st.hasFilm, suiteErrors: st.suiteErrors };
        }
        if (now - bootStartedAt > BOOT_CEILING_MS) {
          throw new Error(
            `boot ceiling (${BOOT_CEILING_MS}ms) exceeded: window.ready never set; last progress ${JSON.stringify(bootProgress)}`,
          );
        }
        if (now - lastProgressAt > BOOT_STEP_MS) {
          throw new Error(
            `boot timeout: no boot progress for ${BOOT_STEP_MS}ms (window.ready never set); last progress ${JSON.stringify(bootProgress)}`,
          );
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    runInfo.bootError = await page.evaluate(() => (window as any).bootError || null);
    runInfo.suiteKeys = await page
      .evaluate(() => ((window as any).suite ? Object.keys((window as any).suite) : null))
      .catch(() => null);
    runInfo.suiteInfo = await page
      .evaluate(() => ((window as any).suite ? (window as any).suite.info() : null))
      .catch((e: Error) => `info failed: ${e.message}`);
    runInfo.suiteErrors = await page
      .evaluate(() => (window as any).suite.errors())
      .catch(() => ["errors() failed"]);
    runInfo.layout = await page
      .evaluate(() => (window as any).suite.layout())
      .catch((e: Error) => ({ error: e.message }));
    // The film's grade routing, surfaced flat for the mux/finish step:
    // gradedInFrames=true means the grade is already in the frames; otherwise
    // `grade` is handed back for ffmpeg (see chost.js exportVideo).
    const filmInfo =
      runInfo.suiteInfo && typeof runInfo.suiteInfo === "object"
        ? ((runInfo.suiteInfo as Record<string, unknown>).film as Record<string, unknown> | null) ?? null
        : null;
    runInfo.filmLook = filmInfo?.look ?? null;
    runInfo.filmGradedInFrames = filmInfo?.gradedInFrames ?? null;
    runInfo.filmGrade = filmInfo?.grade ?? null;
    console.log("BOOT_ERROR:", JSON.stringify(runInfo.bootError));
    console.log("SUITE_KEYS:", JSON.stringify(runInfo.suiteKeys));
    console.log("SUITE_ERRORS:", JSON.stringify(runInfo.suiteErrors).slice(0, 1000));
    console.log("MODE:", spec.mode, "RANGE:", spec.start, "..", spec.end, "(exclusive)");

    if (runInfo.bootError) {
      incomplete = true;
    } else if (spec.mode === "render") {
      for (let base = spec.start; base < spec.end; base += BATCH) {
        if (Date.now() - startedAt > DEADLINE_MS) {
          console.log(`DEADLINE hit at frame ${base}; packaging partial result`);
          incomplete = true;
          break;
        }
        const idx = Array.from(
          { length: Math.min(BATCH, spec.end - base) },
          (_, k) => base + k,
        );
        const times = idx.map((i) => i / FPS);
        const stills = (await page.evaluate(
          (ts) => (window as any).suite.stills(ts, 1),
          times,
        )) as (string | null)[];
        idx.forEach((frameIdx, k) => {
          const dataUrl = stills[k];
          if (!dataUrl) {
            manifest.push({ frame: frameIdx, t: times[k]!, bytes: null });
            console.log(`frame ${frameIdx} (t=${times[k]}): NULL`);
            return;
          }
          const buf = Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
          const f = path.join(FRAMES_DIR, `frame_${String(frameIdx).padStart(4, "0")}.png`);
          fs.writeFileSync(f, buf);
          manifest.push({ frame: frameIdx, t: times[k]!, bytes: buf.length });
        });
        console.log(`batch ${base}..${idx[idx.length - 1]} done at ${Math.round((Date.now() - startedAt) / 1000)}s`);
      }
    } else {
      // track mode: their track() code verbatim except for the range — the
      // loop body runs in the page against window.F (chost.js exposes it);
      // it is driven in TRACK_CHUNK-sized evaluate calls only so the Node
      // side can enforce the deadline between chunks.
      const head = (await page.evaluate(() => {
        const F = (window as any).F;
        if (!F) return { ids: [] as unknown[], snaps: {} as Record<string, unknown> };
        return {
          ids: F.propIds ? F.propIds() : [],
          snaps: F.snaps ? F.snaps() : {},
        };
      })) as { ids: unknown[]; snaps: Record<string, unknown> };
      propTrackData.ids = head.ids;
      propTrackData.snaps = head.snaps;
      const ids = Array.isArray(head.ids) ? head.ids : [];
      if (ids.length) {
        for (let base = spec.start; base < spec.end; base += TRACK_CHUNK) {
          if (Date.now() - startedAt > DEADLINE_MS) {
            console.log(`DEADLINE hit at frame ${base}; packaging partial result`);
            incomplete = true;
            break;
          }
          const chunkEnd = Math.min(spec.end, base + TRACK_CHUNK);
          const part = (await page.evaluate(
            async ({ from, to, fps }) => {
              const F = (window as any).F;
              const frames: Record<string, unknown> = {};
              for (let f = from; f < to; f++) {
                await F.frame(f / fps, { caption: undefined });
                frames[f] = F.propTrack();
                if (f % 20 === 19) await new Promise((r) => setTimeout(r, 0));
              }
              return frames;
            },
            { from: base, to: chunkEnd, fps: FPS },
          )) as Record<string, unknown>;
          for (const [k, v] of Object.entries(part)) {
            propTrackData.frames[k] = v;
            trackedCount++;
          }
          console.log(`track ${base}..${chunkEnd - 1} done at ${Math.round((Date.now() - startedAt) / 1000)}s`);
        }
      } else {
        trackNoProps = true;
        console.log("track: no prop ids; proptrack frames empty (as track() returns)");
      }
    }
  } finally {
    fs.writeFileSync(path.join(OUT_DIR, "page-console.log"), consoleLog.join("\n"));
    await browser.close().catch(() => {});
    await server.close().catch(() => {});
  }

  packageOut();

  if (spec.mode === "render") {
    const got = manifest.filter((m) => m.bytes !== null).length;
    const nulls = manifest.filter((m) => m.bytes === null).length;
    console.log(`frames=${got}/${requested} nulls=${nulls} incomplete=${incomplete}`);
    if (incomplete || got !== requested || nulls > 0) process.exit(1);
  } else {
    console.log(`tracked=${trackedCount}/${requested} incomplete=${incomplete}`);
    if (incomplete || (!trackNoProps && trackedCount !== requested)) process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : String(err));
  // Still try to package whatever exists so the always() artifact has the logs.
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    incomplete = true;
    runInfo.fatal = String(err);
    packageOut();
  } catch { /* nothing more to do */ }
  process.exit(1);
});
