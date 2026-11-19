#!/usr/bin/env python3
"""Fleet orchestrator — produce a full film's frames + prop track on GitHub Actions.

Desk-side driver for the grayline-utils fleet. Given a project (a folder under
projects/ in the repo) and its total frame count, it:
  1. plans render: and track: chunks of --chunk frames,
  2. dispatches one Fleet Render Chunk run per chunk (public repo: parallel,
     free minutes),
  3. waits for every run, downloads its artifact, and unpacks it into
     <out>/<run-id>/unpacked/ (frames/, manifest.json, run-info.json for
     render chunks; proptrack.json for track chunks),
  4. appends "render:S:E\\t<run-id>" / "track:S:E\\t<run-id>" lines to
     <out>/run_map.tsv — the exact layout the finishing scripts
     (assemble + track merge) consume.

Resumable: chunks already in run_map.tsv with an unpacked manifest are
skipped. A failed/incomplete chunk is reported and left out of the map so a
re-run only redoes what is missing.

Usage:
  python3 fleet/orchestrate.py --project demo-ring --frames 1511 \
      --out ~/workspace/heart-studio/projects/demo-ring/out/fleet
"""
import argparse, json, os, subprocess, sys, tarfile, time

REPO = "proa28518-creator/grayline-utils"
WORKFLOW = "fleet-render.yml"

def gh(*args, check=True):
    r = subprocess.run(["gh", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} failed: {r.stderr.strip()[:300]}")
    return r.stdout.strip()

def dispatch(project, spec):
    before = gh("run", "list", "--repo", REPO, "--workflow", WORKFLOW,
                "--limit", "1", "--json", "databaseId",
                "--jq", ".[0].databaseId // 0")
    gh("workflow", "run", WORKFLOW, "--repo", REPO,
       "-f", f"project={project}", "-f", f"spec={spec}")
    for _ in range(30):
        time.sleep(3)
        rid = gh("run", "list", "--repo", REPO, "--workflow", WORKFLOW,
                 "--limit", "1", "--json", "databaseId",
                 "--jq", ".[0].databaseId // 0")
        if rid and rid != before:
            return int(rid)
    raise RuntimeError(f"could not find run id for {spec}")

def wait_run(rid):
    for _ in range(80):  # up to ~20 min per chunk
        out = gh("run", "view", str(rid), "--repo", REPO,
                 "--json", "status,conclusion",
                 "--jq", "[.status, .conclusion] | @tsv")
        status, _, conclusion = out.partition("\t")
        if status == "completed":
            return conclusion == "success"
        time.sleep(15)
    return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--frames", type=int, required=True)
    ap.add_argument("--chunk", type=int, default=120)
    ap.add_argument("--out", required=True)
    ap.add_argument("--modes", default="render,track")
    a = ap.parse_args()

    out = os.path.abspath(os.path.expanduser(a.out))
    os.makedirs(out, exist_ok=True)
    map_path = os.path.join(out, "run_map.tsv")
    done = {}
    if os.path.exists(map_path):
        for line in open(map_path):
            p = line.rstrip("\n").split("\t")
            if len(p) == 2:
                done[p[0]] = p[1]

    specs = []
    for mode in a.modes.split(","):
        for s in range(0, a.frames, a.chunk):
            specs.append(f"{mode}:{s}:{min(s + a.chunk, a.frames)}")

    pending = [s for s in specs if s not in done]
    print(f"plan: {len(specs)} chunks, {len(done)} already done, {len(pending)} to run")
    runs = {}
    for spec in pending:
        rid = dispatch(a.project, spec)
        runs[spec] = rid
        print(f"dispatched {spec} -> run {rid}")

    failures = []
    for spec, rid in runs.items():
        if not wait_run(rid):
            failures.append(spec)
            print(f"FAILED {spec} (run {rid}) — left out of run_map")
            continue
        dl = os.path.join(out, f".dl-{rid}")
        gh("run", "download", str(rid), "--repo", REPO, "-D", dl)
        tars = []
        for root, _, files in os.walk(dl):
            tars += [os.path.join(root, f) for f in files if f.endswith(".tar.gz")]
        if not tars:
            failures.append(spec)
            print(f"NO ARTIFACT for {spec} (run {rid})")
            continue
        dest = os.path.join(out, str(rid), "unpacked")
        os.makedirs(dest, exist_ok=True)
        with tarfile.open(tars[0]) as t:
            t.extractall(dest)
        subprocess.run(["rm", "-rf", dl])
        with open(map_path, "a") as f:
            f.write(f"{spec}\t{rid}\n")
        print(f"done {spec} -> {dest}")

    print(f"complete: {len(specs) - len(failures)}/{len(specs)} chunks in run_map; failures: {failures or 'none'}")
    sys.exit(1 if failures else 0)

if __name__ == "__main__":
    main()
