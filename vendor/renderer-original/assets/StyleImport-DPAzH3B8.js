import { c as createLucideIcon, u as useApp, i as isStandard, a as usePlan, r as reactExports, d as api, o as on, j as jsxRuntimeExports, S as Spinner, ai as ArrowLeft, T as TriangleAlert, bR as runName, bS as PackagePlus, bT as baseName, a9 as Square, A as Asterisk, W as WandSparkles, s as Copy, bh as Download, X, at as CircleCheck, bU as errText, p as premiumMsg } from "./index-wX7YC2th.js";
import { C as CircleDot } from "./circle-dot-Dh2vMULb.js";
const __iconData = {
  name: "circle-minus",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M8 12h8", key: "1wcyev" }]
  ],
  aliases: ["minus-circle"]
};
__iconData.node;
const CircleMinus = createLucideIcon(__iconData);
const IC = { wait: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { size: 15, className: "dim" }), running: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }), ok: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }), fail: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 15 }), skip: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { size: 15, className: "dim" }) };
const SEV = [["high", "High", "These stop the style from being added."], ["medium", "Medium", "Worth fixing; they don't block it."], ["low", "Low", "Small things."], ["info", "Notes", ""]];
const whereText = (w) => [w.file ? `${w.file}${w.line ? `:${w.line}` : ""}` : null, w.view ? `view ${w.view}` : null, w.aspect, typeof w.t === "number" ? `${w.t.toFixed(1)} s` : null].filter(Boolean).join(" · ");
function StyleImport() {
  const { importId, go, toast, startNew } = useApp();
  const std = isStandard(usePlan());
  const [run, setRun] = reactExports.useState(void 0), [busy, setBusy] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!importId) {
      setRun(null);
      return;
    }
    api.importState(importId).then(setRun).catch(() => setRun(null));
    return on("styles:importChanged", (r) => {
      if (r?.id === importId) setRun(r.status === "cancelled" ? null : { ...r });
    });
  }, [importId]);
  const toStyles = (styleId) => {
    try {
      sessionStorage.setItem("cz-styles-tab", `custom:${styleId ?? ""}`);
    } catch {
    }
    go("presets");
  };
  const job = async (what, f) => {
    setBusy(what);
    try {
      await f();
    } catch (e) {
      toast(errText(e), "bad");
    } finally {
      setBusy(null);
    }
  };
  if (run === void 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  if (!run) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter sk-imp", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn ghost small sk-back", onClick: () => toStyles(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
      "Styles"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint warn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "This import is gone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "It was cancelled or finished. Import the package again from Styles > Custom > Import style." })
      ] })
    ] })
  ] });
  const checkOnly = !!run.checkOnly, pkg = run.pkg, name = runName(run);
  const live = run.status === "running" || run.status === "fixing", fixing = run.status === "fixing" || !!run.fix?.running;
  const high = run.findings.filter((f) => f.sev === "high"), shown = run.findings, gone = run.status === "installed";
  const canFix = !checkOnly && run.status === "needs-fix" && high.length > 0;
  const lastRound = run.fix?.rounds?.[run.fix.rounds.length - 1] ?? null;
  const frameFor = (w) => {
    if (gone) return null;
    const l = (run.frames ?? []).filter((f) => (!w.view || f.view === w.view) && (!w.aspect || f.aspect === w.aspect));
    if (!w.view && !w.aspect) return null;
    return typeof w.t === "number" ? l.sort((a, b) => Math.abs(a.t - w.t) - Math.abs(b.t - w.t))[0] ?? null : l[0] ?? null;
  };
  const fix = () => std ? toast(premiumMsg("Custom styles")) : job("fix", () => api.importFix(run.id).then(setRun));
  const copyList = () => job("copy", async () => {
    const t = await api.importFixList(run.id);
    await api.copy(t);
    toast("Fix list copied. Paste it into Claude Code in your Style Kit.");
  });
  const cancel = () => job("cancel", async () => {
    await api.importCancel(run.id);
    toast(checkOnly ? "Re-check closed." : "Import cancelled. Your package file is untouched.");
    toStyles(run.checkOnly);
  });
  const add = () => std ? toast(premiumMsg("Custom styles")) : job("add", async () => {
    const r = await api.importInstall(run.id);
    setRun({ ...r });
  });
  const exportPkg = () => job("export", async () => {
    const r = await api.exportPackage(run.checkOnly);
    if (r) toast(`Package saved: ${r.file}`, "ok");
  });
  const kind = checkOnly ? `Re-check${pkg ? ` of v${pkg.prevVersion ?? pkg.version}` : ""}` : pkg?.isUpdate ? `Update: v${pkg.prevVersion} → v${pkg.version}` : pkg ? "New style" : "Style package";
  const head = run.noSample ? { cls: "warn", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }), b: "Made before the Style Kit: nothing to check", p: run.error ?? "" } : run.status === "running" ? { cls: "run", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 16 }), b: "Checking the style…", p: "Every view is loaded and rendered in every format, the way your videos will be. This takes a minute or two; you can leave this page meanwhile." } : run.status === "fixing" ? { cls: "run", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 16 }), b: `Claude is fixing it: round ${Math.max(1, run.round)} of ${run.maxRounds}`, p: run.fix?.activity || "It changes only this style's files; then the app checks everything again." } : run.status === "needs-fix" ? {
    cls: "warn",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }),
    b: `${high.length} problem${high.length === 1 ? "" : "s"} to fix${checkOnly ? "" : " before it can be added"}`,
    p: checkOnly ? "Copy fix list and paste it into Claude Code in your Style Kit, then import the fixed package." : lastRound ? `Claude did ${run.fix.rounds.length} round${run.fix.rounds.length === 1 ? "" : "s"}; what is left needs Claude Code in your Style Kit: Copy fix list.` : "Let Claude fix it here, or Copy fix list and paste it into Claude Code in your Style Kit."
  } : run.status === "ready" ? { cls: "ok", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }), b: checkOnly ? "Everything passed" : "Everything passed", p: checkOnly ? "The style is fine as it is installed." : `Add it to your styles: it shows up in New project, Routines and the Look panel${pkg?.isUpdate ? `, as v${pkg.version}. Videos made with v${pkg.prevVersion} keep it until you update them` : ""}.` } : run.status === "installed" ? { cls: "ok", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }), b: `Added: ${name} v${run.result?.version ?? pkg?.version ?? 1} is in your styles`, p: "Pick it in New project under Custom styles." } : { cls: "bad", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }), b: run.status === "failed" && run.items[0]?.status === "fail" ? "The package was refused" : "The check stopped", p: run.error ?? "Start the import again." };
  const findingsFirst = !live && high.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `page page-enter sk-imp ${findingsFirst ? "sk-ffirst" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn ghost small sk-back", onClick: () => toStyles(run.result?.id ?? run.checkOnly), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
      "Styles"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sk-imp-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sk-imp-ic", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { size: 20, strokeWidth: 1.7 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "ellipsis", title: name, children: name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sk-imp-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sk-chip kind", children: kind }),
          pkg && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Built on ",
            baseName(pkg.base)
          ] }),
          pkg?.aspects?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: pkg.aspects.join(" · ") }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim ellipsis", title: run.source, children: run.source.split(/[\\/]/).filter(Boolean).pop() })
        ] })
      ] })
    ] }),
    pkg?.asNew && !checkOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sk-asnew", role: "note", children: pkg.asNew }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sk-state ${head.cls}`, role: "status", children: [
      head.icon,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: head.b }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: head.p })
      ] }),
      fixing && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sk-stop", onClick: () => job("stop", () => api.importStop(run.id).then(setRun)), disabled: busy === "stop", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 12 }),
        "Stop"
      ] })
    ] }),
    run.status === "installed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sk-done", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sk-use", onClick: () => startNew({ styleId: run.result.id }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 15 }),
        "Use it in a new project"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sk-backstyles", onClick: () => toStyles(run.result?.id), children: "Back to Styles" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sk-bar", children: [
      canFix && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sk-fix", onClick: fix, disabled: !!busy || live, title: "A Claude inside Creatorize fixes it. It can only change this style's files; the app checks everything again after each round (up to 3).", children: [
        busy === "fix" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 15 }),
        "Let Claude fix it",
        std && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-pill", children: "Premium" })
      ] }),
      !live && (high.length > 0 || run.findings.some((f) => f.sev === "medium")) && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `btn ${run.status === "needs-fix" && !canFix ? "primary" : ""} sk-copy`, onClick: copyList, disabled: !!busy, title: "The problems as text, for Claude Code in your Style Kit", children: [
        busy === "copy" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 15 }),
        "Copy fix list"
      ] }),
      checkOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sk-export", onClick: exportPkg, disabled: !!busy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 15 }),
        "Export package"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn ghost sk-cancel", onClick: cancel, disabled: !!busy, children: checkOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Done" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 }),
        "Cancel import"
      ] }) }),
      !checkOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sk-add", onClick: add, disabled: run.status !== "ready" || !!busy, title: run.status === "ready" ? void 0 : "When every check has passed", children: [
        busy === "add" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }),
        "Add to my styles",
        std && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-pill", children: "Premium" })
      ] })
    ] }),
    run.fix?.rounds?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sk-sec", "aria-label": "What Claude changed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "What Claude changed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "sk-rounds", children: run.fix.rounds.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          "Round ",
          r.round
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          r.changed.length ? `Changed ${r.changed.join(", ")}` : "Changed nothing",
          r.highAfter != null ? ` · high problems ${r.highBefore} → ${r.highAfter}` : ""
        ] }),
        r.reasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "dim", children: r.reasons.join(" ") }),
        r.refused.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "dim", children: [
          "Not allowed (left unchanged): ",
          r.refused.join(", ")
        ] })
      ] }, r.round)) })
    ] }) : null,
    !run.noSample && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sk-sec sk-sec-check", "aria-label": "Checklist", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "The checklist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "sk-checklist", children: run.items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `sk-item s-${i.status}`, "data-item": i.id, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sk-item-ic", children: IC[i.status] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow col", style: { gap: 2, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: i.label }),
          i.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "sk-item-detail", children: i.detail })
        ] })
      ] }, i.id)) })
    ] }),
    shown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sk-sec", "aria-label": "Findings", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "What the checks found" }),
      SEV.map(([sev, label, why]) => {
        const l = shown.filter((f) => f.sev === sev);
        if (!l.length) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sk-sevgroup sev-${sev}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sk-sevhead", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sk-sev sev-${sev}`, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small dim", children: [
              l.length,
              " · ",
              why
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "sk-findings", children: l.map((f, n) => {
            const fr = frameFor(f.where), w = whereText(f.where);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `sk-finding sev-${f.sev}`, "data-check": f.id, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow col", style: { gap: 4, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "sk-f-what", children: f.finding }),
                f.meaning && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sk-f-mean", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "What it means:" }),
                  " ",
                  f.meaning
                ] }),
                f.fix && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sk-f-fix", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "How to fix:" }),
                  " ",
                  f.fix
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "sk-f-where", children: [
                  f.id,
                  w ? ` · ${w}` : ""
                ] })
              ] }),
              fr && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: `sk-f-frame ${fr.aspect === "9:16" ? "tall" : ""}`, href: fr.url, target: "_blank", rel: "noreferrer", title: `${fr.view} · ${fr.aspect} · ${fr.t.toFixed(1)} s`, onClick: (e) => e.preventDefault(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: fr.url, alt: "", loading: "lazy" }) })
            ] }, `${f.id}-${n}`);
          }) })
        ] }, sev);
      })
    ] }),
    !gone && run.exports && Object.keys(run.exports).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sk-sec sk-sec-exports", "aria-label": "Sample exports", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "The sample, exported" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim", children: "5 seconds of the sample in each format, made the way your exports are (sound off; turn it on in the player)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sk-exports", children: Object.entries(run.exports).map(([a, url]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: `sk-export-fig ${a === "9:16" ? "tall" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: url, controls: true, muted: true, playsInline: true, preload: "metadata" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("figcaption", { children: a })
      ] }, a)) })
    ] })
  ] });
}
export {
  StyleImport as default
};
