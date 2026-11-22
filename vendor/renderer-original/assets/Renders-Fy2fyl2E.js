rt { u as useApp, r as reactExports, j as jsxRuntimeExports, ac as Busy, E as Empty, z as Film, a8 as FolderOpen, d as api, a4 as isMac, D as ago, ad as StatusBadge, aa as Play } from "./index-wX7YC2th.js";
function Renders() {
  const { go, brand, allProjects } = useApp();
  const personal = brand === "personal", kindOf = new Map(allProjects.map((p) => [p.id, p.kind ?? "faceless"]));
  const [list, setList] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let t = 0, live = true;
    const tick = () => api.renders().then((l) => {
      if (!live) return;
      setList(l);
      t = window.setTimeout(tick, l.some((r) => r.status === "running") ? 3e3 : 2e4);
    }).catch(() => {
      if (live) t = window.setTimeout(tick, 2e4);
    });
    tick();
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, []);
  const shown = (list ?? []).filter((r) => (r.kind === "personal" || kindOf.get(r.project_id) === "personal") === personal);
  const groups = [];
  for (const r of shown) {
    const k = r.channel_name ?? null;
    let g = groups.find((x) => x.name === k);
    if (!g) groups.push(g = { name: k, dir: null, rows: [] });
    g.rows.push(r);
    g.dir ??= r.channel_dir ?? null;
  }
  groups.sort((a, b) => (a.name === null ? 1 : 0) - (b.name === null ? 1 : 0));
  const grouped = groups.some((g) => g.name !== null), fm = isMac ? "Finder" : "File Explorer";
  const row = (r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-row", style: { alignItems: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt ellipsis", children: r.path ? r.path.split(/[\\/]/).pop() : r.status === "running" ? "Rendering…" : r.status === "failed" ? "Render failed" : "Render" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta rd-meta", children: [
        (r.kind === "vertical" || r.kind === "trailer" || r.kind === "clip") && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge blue", title: "Made in Export > Vertical 9:16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
          r.kind === "trailer" ? "Trailer 9:16" : r.kind === "clip" ? "Clip 9:16" : "9:16"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.project_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ago(r.created_at) }),
        r.seconds && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          r.seconds.toFixed(1),
          "s"
        ] }),
        r.message && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis", style: { maxWidth: 420 }, children: r.message })
      ] })
    ] }),
    r.status === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
      Math.round((r.progress || 0) * 100),
      "%"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { s: r.status === "done" ? "exported" : r.status }),
    r.exists && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: () => api.open(r.path), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 14 }),
        "Play"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", "aria-label": "Show in folder", title: "Show in folder", onClick: () => api.reveal(r.path), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 16, strokeWidth: 1.7 }) })
    ] })
  ] }, r.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter narrow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-head", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Renders" }),
      !!list?.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sub", children: [
        list.length,
        " ",
        personal ? list.length === 1 ? "render" : "renders" : list.length === 1 ? "export" : "exports",
        ", newest first"
      ] })
    ] }) }),
    list === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Busy, { text: "Loading your exports…" }) }) : !shown.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Empty,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 20, strokeWidth: 1.7 }),
        title: personal ? "No renders yet" : "No exports yet",
        text: personal ? "Renders land here with Play and Show in folder. Open a video and press Sign off & render." : "Exports land here with Play and Show in folder. Open a project and press Export.",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => go("projects"), children: personal ? "Go to videos" : "Go to projects" })
      }
    ) : !grouped ? /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "panel", style: { padding: "4px 22px" }, children: shown.map(row) }) : groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel rd-group", "data-channel": g.name ?? "", style: { padding: "4px 22px", marginBottom: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { alignItems: "center", padding: "12px 0 6px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "grow", style: { fontWeight: 500 }, children: g.name ?? "No channel" }),
        g.dir && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", "data-channel-folder": true, title: `Every export of this channel's videos, in one folder (opens in ${fm})`, onClick: () => api.open(g.dir), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 14 }),
          "Channel folder"
        ] })
      ] }),
      g.rows.map(row)
    ] }, g.name ?? "-"))
  ] });
}
export {
  Renders as default
};
impo