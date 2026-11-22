import { c as createLucideIcon, u as useApp, r as reactExports, d as api, o as on, j as jsxRuntimeExports, S as Spinner, J as Sprout, b as Trash, D as ago, C as Check, X, M as Search, E as Empty, O as Library$1, Q as ListChecks, T as TriangleAlert, V as Lightbulb, Y as Clapperboard, Z as PersonStanding, _ as Activity, $ as AudioLines, a0 as Type, a1 as Image, a2 as Grid3x3, k as Palette, a3 as Box, a4 as isMac, s as Copy, a5 as ShieldCheck, a6 as Flag, a7 as Pencil, a8 as FolderOpen, a9 as Square, aa as Play, ab as ExternalLink } from "./index-wX7YC2th.js";
import { t as takeLibraryInbox } from "./libraryNav-De0opIcL.js";
const __iconData$5 = {
  name: "aperture",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m14.31 8 5.74 9.94", key: "1y6ab4" }],
    ["path", { d: "M9.69 8h11.48", key: "1wxppr" }],
    ["path", { d: "m7.38 12 5.74-9.94", key: "1grp0k" }],
    ["path", { d: "M9.69 16 3.95 6.06", key: "libnyf" }],
    ["path", { d: "M14.31 16H2.83", key: "x5fava" }],
    ["path", { d: "m16.62 12-5.74 9.94", key: "1vwawt" }]
  ]
};
__iconData$5.node;
const Aperture = createLucideIcon(__iconData$5);
const __iconData$4 = {
  name: "archive-restore",
  size: 24,
  node: [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h2", key: "tvwodi" }],
    ["path", { d: "M20 8v11a2 2 0 0 1-2 2h-2", key: "1gkqxj" }],
    ["path", { d: "m9 15 3-3 3 3", key: "1pd0qc" }],
    ["path", { d: "M12 12v9", key: "192myk" }]
  ]
};
__iconData$4.node;
const ArchiveRestore = createLucideIcon(__iconData$4);
const __iconData$3 = {
  name: "archive",
  size: 24,
  node: [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
    ["path", { d: "M10 12h4", key: "a56b0p" }]
  ]
};
__iconData$3.node;
const Archive = createLucideIcon(__iconData$3);
const __iconData$2 = {
  name: "file-code",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M10 12.5 8 15l2 2.5", key: "1tg20x" }],
    ["path", { d: "m14 12.5 2 2.5-2 2.5", key: "yinavb" }]
  ]
};
__iconData$2.node;
const FileCode = createLucideIcon(__iconData$2);
const __iconData$1 = {
  name: "inbox",
  size: 24,
  node: [
    ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
    [
      "path",
      {
        d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        key: "oot6mr"
      }
    ]
  ]
};
__iconData$1.node;
const Inbox = createLucideIcon(__iconData$1);
const __iconData = {
  name: "ship",
  size: 24,
  node: [
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 9.189V13", key: "yp40p3" }],
    ["path", { d: "M19 12V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6", key: "1wcigf" }],
    [
      "path",
      {
        d: "M19.38 19A11.6 11.6 0 0021 13l-8.188-3.639a2 2 0 00-1.624 0L3 13.001a11.6 11.6 0 002.81 7.76",
        key: "1kdp0u"
      }
    ],
    [
      "path",
      {
        d: "M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        key: "1l8w7g"
      }
    ]
  ]
};
__iconData.node;
const Ship = createLucideIcon(__iconData);
const FOLDER_APP = isMac ? "Finder" : "Explorer";
const TRASH = isMac ? "Trash" : "Recycle Bin";
const KIND = {
  model: ["3D model", Box],
  module: ["Code module", FileCode],
  material: ["Material", Palette],
  texture: ["Texture", Grid3x3],
  image: ["Picture", Image],
  sprite: ["Sprite", PersonStanding],
  font: ["Font", Type],
  sound: ["Sound", AudioLines],
  anim: ["Animation", Activity],
  pose: ["Pose", PersonStanding],
  recipe: ["Scene recipe", Clapperboard],
  look: ["Look", Aperture],
  solution: ["Solution", Lightbulb],
  pitfall: ["Pitfall", TriangleAlert],
  check: ["Check", ListChecks]
};
const SOURCE = { ws: "Mine", seed: "Built-in", lowpoly: "Low poly assets", sfx: "Sounds", char: "Characters", sprite: "Sprites", fig: "3D figures", img: "Pictures" };
const SOURCE_ORDER = ["ws", "seed", "lowpoly", "sfx", "char", "sprite", "fig", "img"];
const STATUS = { proposed: ["Proposed", ""], accepted: ["Accepted", "gray"], verified: ["Verified", "blue"], proven: ["Proven", "mint"], flagged: ["Flagged", "red"], retired: ["Retired", "gray"] };
const STATUS_ORDER = ["proposed", "accepted", "verified", "proven", "flagged", "retired"];
const BASE_NAMES = { any: "Any style", recon: "3D reconstruction", lowpoly: "Low poly shorts", flat: "Flat explainer", collage: "Vox", stickman: "MS Paint stick figures", "pixel-art": "Pixel art", starter: "Starter" };
const TABS = [["all", "All"], ["assets", "Assets"], ["scenes", "Scenes"], ["knowhow", "Know-how"]];
const FED_NOTE = {
  lowpoly: "Part of the low poly asset library: Claude places it in low poly and 3D reconstruction videos by its id.",
  sfx: "Part of your sound effects: the sound design picks it by its category (Settings > Media > Sound effects library).",
  char: "One of your Flat explainer characters (Characters in Styles): new Flat videos can star it.",
  sprite: "Stick-figure sprites drawn for an earlier video: later videos reuse them for free.",
  fig: "A rigged person model for 3D reconstruction videos (Look > Characters copies it into a video).",
  img: "A picture Claude made for one of your videos. When another video asks for the same picture (same look and prompt), it is copied from there for free."
};
const SCOPE_LETTER = { G: "Every style", R: "This style only", I: "One video only" };
const PAGE = 120;
const StatusBadge = ({ s }) => {
  const [t, c] = STATUS[s] ?? [s, "gray"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `badge ${c} lby-status`, "data-status": s, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
    t
  ] });
};
function KindBadge({ k }) {
  const [t, Ic] = KIND[k] ?? [k, Box];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge gray lby-kind", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Ic, { size: 11, strokeWidth: 1.8 }),
    t
  ] });
}
let audio = null;
function Library() {
  const { toast, allProjects, setLibProposed } = useApp();
  const [query, setQuery] = reactExports.useState(""), [q, setQ] = reactExports.useState("");
  const [tab, setTab] = reactExports.useState("all");
  const [f, setF] = reactExports.useState({});
  const [data, setData] = reactExports.useState(null), [limit, setLimit] = reactExports.useState(PAGE), [loading, setLoading] = reactExports.useState(false);
  const [openId, setOpenId] = reactExports.useState(null);
  const [styleNames, setStyleNames] = reactExports.useState({});
  const [trash, setTrash] = reactExports.useState(0);
  const [lastH, setLastH] = reactExports.useState(null), [hvBusy, setHvBusy] = reactExports.useState({});
  const harvestable = reactExports.useMemo(() => [...allProjects].filter((p) => p.kind !== "personal" && p.exists !== false && p.labKind !== "character").sort((a, b) => String(b.opened_at || b.updated_at || "").localeCompare(String(a.opened_at || a.updated_at || ""))), [allProjects]);
  const [hvProject, setHvProject] = reactExports.useState("");
  const hvPick = hvProject && harvestable.some((p) => p.id === hvProject) ? hvProject : harvestable[0]?.id ?? "";
  const loadLastH = () => api.libraryLastHarvest().then(setLastH).catch(() => {
  });
  reactExports.useEffect(() => {
    loadLastH();
    api.libraryHarvestState().then((s) => setHvBusy(Object.fromEntries([...(s?.queued ?? []).map((id) => [id, "queued"]), ...(s?.running ?? []).map((id) => [id, "running"])]))).catch(() => {
    });
    return on("library:harvest", (ev) => {
      setHvBusy((b) => {
        const n = { ...b };
        if (ev.type === "queued" || ev.type === "started") n[ev.projectId] = ev.type === "queued" ? "queued" : "running";
        else delete n[ev.projectId];
        return n;
      });
      if (ev.type === "done") {
        loadLastH();
        const name = allProjectsRef.current.find((p) => p.id === ev.projectId)?.name ?? "the project";
        toast(ev.status === "done" ? `Harvest of ${name} done: ${ev.proposed?.length ?? 0} new proposed${ev.accepted?.length ? ` (${ev.accepted.length} accepted: they passed the checks)` : ""}${ev.merged?.length ? `, ${ev.merged.length} already here` : ""}.` : `The harvest of ${name} stopped (${ev.status}).`, ev.status === "done" ? "ok" : "info");
      }
      if (ev.type === "skipped") toast(`No harvest: ${ev.reason}`, "info");
    });
  }, []);
  const allProjectsRef = reactExports.useRef(allProjects);
  allProjectsRef.current = allProjects;
  const harvestNow = async (pid) => {
    try {
      const r = await api.libraryHarvestNow(pid);
      const name = allProjects.find((p) => p.id === pid)?.name ?? "the project";
      if (r.state === "queued") toast(`Claude looks back over ${name} for things to reuse. It waits until Claude is not working on that project.`);
      else if (r.state === "running") toast(`Claude is already harvesting ${name}.`, "info");
      else toast(r.reason ?? "No harvest.", "info");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const decide = async (id, accept) => {
    try {
      if (accept) await api.libraryUpdate(id, { status: "accepted" });
      else await api.libraryDelete(id);
      toast(accept ? "Accepted: Claude reuses it from now on." : `Rejected: it waits in the library's deleted items until you move them to the ${TRASH}.`);
      loadLastH();
      load();
      loadTrash();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const seq = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const t = window.setTimeout(() => setQ(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);
  const load = reactExports.useCallback(async () => {
    const n = ++seq.current;
    setLoading(true);
    try {
      const o = { query: q || void 0, tab: tab === "all" ? null : tab, ...f, limit };
      const d = await api.libraryBrowse(o);
      if (n !== seq.current) return;
      setData(d);
      setLibProposed(d.proposed);
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      if (n === seq.current) setLoading(false);
    }
  }, [q, tab, f, limit]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const loadRef = reactExports.useRef(load);
  loadRef.current = load;
  const loadTrash = () => api.libraryTrash().then((t) => setTrash(t.count)).catch(() => {
  });
  reactExports.useEffect(() => {
    loadTrash();
    api.styles().then((l) => setStyleNames(Object.fromEntries(l.map((s) => [s.id, s.name])))).catch(() => {
    });
    return on("library:changed", () => {
      loadRef.current();
      loadTrash();
    });
  }, []);
  reactExports.useEffect(() => setLimit(PAGE), [q, tab, f]);
  reactExports.useEffect(() => {
    if (takeLibraryInbox()) {
      setTab("all");
      setF({ status: "proposed" });
    }
  }, []);
  const baseName = (b) => BASE_NAMES[b] ?? styleNames[b] ?? b;
  const scopeName = (s) => {
    const [k, v] = s.split(":");
    if (k === "global") return "Everywhere";
    if (k === "project") return `Only in ${allProjects.find((p) => p.id === v)?.name ?? "one video"}`;
    return `Only ${baseName(v)}`;
  };
  const pick = (k, v) => setF((x) => ({ ...x, [k]: x[k] === v ? null : v }));
  const anyFilter = Object.values(f).some(Boolean);
  const showInbox = () => {
    setTab("all");
    setF({ status: "proposed" });
    setQuery("");
  };
  const emptyTrash = async () => {
    try {
      const r = await api.libraryEmptyTrash();
      setTrash(r.count);
      toast(`${r.moved} deleted ${r.moved === 1 ? "entry" : "entries"} moved to the ${TRASH}.`);
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const facet = (k, title, order, label) => {
    const c = data?.counts[k] ?? {}, vals = Object.keys(c).filter((v) => c[v] > 0 || f[k] === v);
    if (f[k] && !vals.includes(f[k])) vals.push(f[k]);
    const sorted = order ? [...order.filter((v) => vals.includes(v)), ...vals.filter((v) => !order.includes(v)).sort()] : vals.sort((a, b) => (c[b] ?? 0) - (c[a] ?? 0) || label(a).localeCompare(label(b)));
    if (!sorted.length) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-facet", "data-facet": k, role: "group", "aria-label": title, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: title }),
      sorted.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: f[k] === v ? "on" : "", "aria-pressed": f[k] === v, "data-value": v, onClick: () => pick(k, v), title: label(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis", children: label(v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: c[v] ?? 0 })
      ] }, v))
    ] });
  };
  const rows = data?.rows ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter lby", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Library" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sub", children: "Models, code, materials, recipes and fixes Claude reuses." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
        harvestable.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-harvest", title: "Claude takes a short read-only look back over a video and proposes what later videos can reuse. It also runs after every build (Settings > AI engines).", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", "aria-label": "Project to harvest", value: hvPick, onChange: (e) => setHvProject(e.target.value), children: harvestable.slice(0, 40).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", disabled: !hvPick || !!hvBusy[hvPick], onClick: () => harvestNow(hvPick), children: [
            hvBusy[hvPick] ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { size: 14 }),
            hvBusy[hvPick] === "running" ? "Looking it over…" : hvBusy[hvPick] === "queued" ? "Waiting…" : "Grow from this video"
          ] })
        ] }),
        trash > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small ghost", onClick: emptyTrash, title: `Entries you deleted wait in the library's own deleted items. This moves them to the ${TRASH}.`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 14 }),
          "Move ",
          trash,
          " deleted to the ",
          TRASH
        ] })
      ] })
    ] }),
    lastH && (lastH.proposed ?? []).some((x) => x.status === "proposed") && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-hv panel", "aria-label": "From the last harvest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-hv-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { size: 16, strokeWidth: 1.7 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "From the last harvest" }),
          " of ",
          lastH.projectName || "a video",
          lastH.at ? ` (${ago(lastH.at)})` : "",
          ": Claude proposes ",
          (lastH.proposed ?? []).filter((x) => x.status === "proposed").length,
          " ",
          (lastH.proposed ?? []).filter((x) => x.status === "proposed").length === 1 ? "entry" : "entries",
          ".",
          lastH.reused ? ` That video reused ${lastH.reused}.` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: (lastH.proposed ?? []).filter((x) => x.status === "proposed").map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": x.id, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KindBadge, { k: x.kind }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link grow ellipsis", onClick: () => setOpenId(x.id), title: x.summary || x.title, children: x.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny primary", onClick: () => decide(x.id, true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
          "Accept"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => decide(x.id, false), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
          "Reject"
        ] })
      ] }, x.id)) })
    ] }),
    !!data?.proposed && f.status !== "proposed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-inbox", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { size: 17, strokeWidth: 1.7 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          data.proposed,
          " proposed ",
          data.proposed === 1 ? "entry waits" : "entries wait",
          " for you."
        ] }),
        " Claude added ",
        data.proposed === 1 ? "it" : "them",
        " while building. Accept what is worth keeping; Claude only reuses accepted entries."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: showInbox, children: "Review" })
    ] }),
    f.status === "proposed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-inbox on", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { size: 17, strokeWidth: 1.7 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow", children: "Showing the proposed entries. Open one to accept or delete it." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small ghost", onClick: () => setF((x) => ({ ...x, status: null })), children: "Show everything" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar lby-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, strokeWidth: 1.7 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "lby-search",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search the library: glow, brick wall, flicker, chair…",
            "aria-label": "Search the library",
            onKeyDown: (e) => {
              if (e.key === "Escape") setQuery("");
            }
          }
        ),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabs", role: "tablist", "aria-label": "Library sections", children: TABS.map(([t, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "tab", "data-tab": t, "aria-selected": tab === t, className: tab === t ? "active" : "", onClick: () => setTab(t), children: [
        l,
        t !== "all" && data ? /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "lby-tabn", children: data.tabs[t] }) : null
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lby-filters", "aria-label": "Filters", children: [
        anyFilter && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link lby-clear", onClick: () => setF({}), children: "Clear filters" }),
        facet("source", "Source", SOURCE_ORDER, (v) => SOURCE[v] ?? v),
        facet("kind", "Kind", Object.keys(KIND), (v) => KIND[v]?.[0] ?? v),
        facet("base", "Style", null, baseName),
        facet("scope", "Where it applies", null, scopeName),
        facet("status", "Status", STATUS_ORDER, (v) => STATUS[v]?.[0] ?? v)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-count small dim", children: [
          data ? `${data.total} ${data.total === 1 ? "entry" : "entries"}${q ? ` for “${q}”` : ""}` : "",
          data && !data.fts ? " (simple search on this computer)" : ""
        ] }),
        !data ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "Loading the library…" })
        ] }) : !rows.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Empty,
          {
            className: "lby-empty",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Library$1, { size: 20, strokeWidth: 1.7 }),
            title: q ? `Nothing for “${q}”` : "Nothing here yet",
            text: q ? "Try another word, another tab, or clear the filters." : "Claude adds what it builds and the fixes it finds while it makes your videos.",
            children: (anyFilter || tab !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: () => {
              setF({});
              setTab("all");
            }, children: "Show everything" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-grid", role: "list", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { r, baseName, on: openId === r.id, open: () => setOpenId(r.id) }, r.id)) }),
        data && data.total > rows.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-more", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: () => setLimit((l) => l + PAGE), children: [
          "Show more (",
          data.total - rows.length,
          " left)"
        ] }) })
      ] })
    ] }),
    openId && /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer, { id: openId, dev: !!data?.dev, baseName, scopeName, onOpen: setOpenId, onClose: () => setOpenId(null), onChanged: () => {
      load();
      loadTrash();
    } }, openId)
  ] });
}
function Card({ r, on: on2, open, baseName }) {
  const [bad, setBad] = reactExports.useState(false);
  const [, Ic] = KIND[r.kind] ?? ["", Box], pic = !!r.thumb && !bad;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "listitem", className: `lby-card ${on2 ? "on" : ""} ${r.status === "proposed" ? "proposed" : ""}`, "data-id": r.id, onClick: open, title: r.summary || r.title, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `lby-thumb ${pic ? "" : "txt"}`, children: [
      pic ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.thumb, alt: "", loading: "lazy", onError: () => setBad(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ic, { size: 18, strokeWidth: 1.5 }),
        r.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lby-snip", children: r.summary })
      ] }),
      r.source !== "seed" && r.source !== "ws" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lby-src", children: SOURCE[r.source] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "lby-title", children: r.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "lby-badges", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KindBadge, { k: r.kind }),
      r.status !== "accepted" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { s: r.status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "lby-chips", children: [
      r.bases.slice(0, 3).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lby-chip", children: baseName(b) }, b)),
      r.bases.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "lby-chip", children: [
        "+",
        r.bases.length - 3
      ] })
    ] }),
    (r.uses > 0 || r.wins > 0 || r.fails > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "lby-uses", children: [
      "Used ",
      r.uses,
      "×",
      r.wins ? ` · worked ${r.wins}` : "",
      r.fails ? ` · failed ${r.fails}` : ""
    ] })
  ] });
}
function Drawer({ id, dev, onClose, onOpen, onChanged, baseName, scopeName }) {
  const { toast, allProjects, openProject } = useApp();
  const [d, setD] = reactExports.useState(null), [err, setErr] = reactExports.useState(null);
  const [file, setFile] = reactExports.useState(null), [code, setCode] = reactExports.useState(null), [codeErr, setCodeErr] = reactExports.useState(null);
  const [edit, setEdit] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false), [playing, setPlaying] = reactExports.useState(false);
  const reload = () => api.libraryDetail(id).then((x) => {
    setD(x);
    setErr(null);
    return x;
  }).catch((e2) => {
    setErr(e2.message);
    return null;
  });
  reactExports.useEffect(() => {
    reload().then((x) => {
      if (!x) return;
      const e2 = x.entry, first = e2?.entry && x.files.includes(e2.entry) ? e2.entry : x.files.find((f) => /\.(m?js|json|md|txt|glsl)$/i.test(f)) ?? x.files[0] ?? null;
      setFile(first);
    });
    const key = (ev) => {
      if (ev.key === "Escape" && !document.querySelector('[aria-modal="true"]')) onClose();
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      audio?.pause();
      audio = null;
    };
  }, [id]);
  const isImg = (f) => /\.(png|jpe?g|webp|svg|gif)$/i.test(f);
  reactExports.useEffect(() => {
    setCode(null);
    setCodeErr(null);
    if (!file || isImg(file)) return;
    api.libraryFile(id, file).then((c) => setCode(c)).catch((e2) => setCodeErr(e2.message));
  }, [file]);
  const e = d?.entry ?? null, row = d?.row;
  const run = async (what, fn, done) => {
    setBusy(true);
    try {
      await fn();
      if (done) toast(done);
      await reload();
      onChanged();
    } catch (x) {
      toast(x.message, "bad");
    } finally {
      setBusy(false);
    }
  };
  const setStatus = (s, done) => run(s, () => api.libraryUpdate(id, { status: s }), done);
  const del = async () => {
    setBusy(true);
    try {
      const r = await api.libraryDelete(id);
      onChanged();
      onClose();
      toast(`Deleted “${row?.title ?? id}”. It waits in the library's deleted items until you move them to the ${TRASH}.`, "ok", { label: "Undo", run: async () => {
        try {
          await api.libraryRestore(r.name);
          onChanged();
          toast("Brought back.");
        } catch (x) {
          toast(x.message, "bad");
        }
      } });
    } catch (x) {
      toast(x.message, "bad");
      setBusy(false);
    }
  };
  const save = async () => {
    if (!edit) return;
    await run("edit", () => api.libraryUpdate(id, { title: edit.title, summary: edit.summary, tags: edit.tags.split(/[,\n]/).map((t) => t.trim()).filter(Boolean), scope: edit.scope }), "Saved.");
    setEdit(null);
  };
  const ship = async () => {
    setBusy(true);
    try {
      const r = await api.libraryShip(id);
      onChanged();
      onClose();
      toast(`Copied into the app's built-in library (${r.to}). It ships with the next release; your own copy is in the deleted items.`);
    } catch (x) {
      toast(x.message, "bad");
      setBusy(false);
    }
  };
  const play = async () => {
    if (playing) {
      audio?.pause();
      audio = null;
      setPlaying(false);
      return;
    }
    try {
      const r = await api.sfxAudio(id.slice(4));
      audio = new Audio(URL.createObjectURL(new Blob([r.bytes], { type: r.mime })));
      audio.onended = () => setPlaying(false);
      setPlaying(true);
      await audio.play();
    } catch (x) {
      setPlaying(false);
      toast(x.message, "bad");
    }
  };
  const projectOf = (p) => allProjects.find((x) => p?.projectId && x.id === p.projectId || p?.project && x.name === p.project || p?.project && x.path?.replace(/\\/g, "/").endsWith("/" + p.project));
  const own = row?.source === "seed" || row?.source === "ws";
  const usage = e?.usage ? typeof e.usage === "string" ? e.usage : [e.usage.import, e.usage.example].filter(Boolean).join("\n\n") : "";
  const scopes = reactExports.useMemo(() => {
    const b = (row?.bases ?? "").split(/\s+/).filter((x) => x && x !== "any");
    const l = ["global", ...b.map((x) => `base:${x}`)];
    if (row?.scope && !l.includes(row.scope)) l.push(row.scope);
    return l;
  }, [row?.bases, row?.scope]);
  const params = e?.doc?.params && typeof e.doc.params === "object" ? Object.entries(e.doc.params) : [];
  const prov = e?.provenance ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-scrim", onClick: onClose }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lby-drawer", role: "dialog", "aria-label": row?.title ?? id, "data-id": id, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-dhead", children: [
        d?.thumb && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", className: "lby-dthumb", src: d.thumb, alt: "", onError: (ev) => ev.currentTarget.style.display = "none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: row?.title ?? id }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-badges", children: [
            row && /* @__PURE__ */ jsxRuntimeExports.jsx(KindBadge, { k: row.kind }),
            row && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { s: row.status }),
            row && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge gray", children: SOURCE[row.source] ?? row.source }),
            own && row && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge gray", children: [
              "v",
              row.version
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "lby-id mono", title: "Copy the id (Claude finds it by this)", onClick: () => api.copy(id).then(() => toast("Id copied.")), children: [
              id,
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Close", className: "icon-btn", "aria-label": "Close", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18, strokeWidth: 1.7 }) })
      ] }),
      err ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "err-text small", children: err }) : !d ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-dbody", children: [
        row?.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lby-summary", children: row.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-actions", children: [
          d.editable && row?.status === "proposed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small primary", disabled: busy, onClick: () => setStatus("accepted", "Accepted: Claude reuses it from now on."), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
            "Accept"
          ] }),
          d.editable && (row?.status === "accepted" || row?.status === "flagged") && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", disabled: busy, onClick: () => setStatus("verified", "Marked as verified."), title: "It worked in a real video", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }),
            "Verify"
          ] }),
          d.editable && row?.status !== "flagged" && row?.status !== "retired" && row?.status !== "proposed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", disabled: busy, onClick: () => setStatus("flagged", "Flagged: Claude skips it unless you search for flagged entries."), title: "Something is wrong with it: Claude stops reusing it", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { size: 14 }),
            "Flag"
          ] }),
          d.editable && !edit && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", disabled: busy, onClick: () => setEdit({ title: row.title, summary: row.summary ?? "", tags: (e?.tags ?? []).join(", "), scope: row.scope }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 }),
            "Edit"
          ] }),
          d.editable && row?.status !== "retired" && row?.status !== "proposed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", disabled: busy, onClick: () => setStatus("retired", "Retired: kept, but Claude no longer uses it."), title: "Keep it, but Claude no longer uses it", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { size: 14 }),
            "Retire"
          ] }),
          d.editable && row?.status === "retired" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", disabled: busy, onClick: () => setStatus("accepted", "Back in use."), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { size: 14 }),
            "Bring back"
          ] }),
          d.editable && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small danger", disabled: busy, onClick: del, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 14 }),
            "Delete"
          ] }),
          d.canReveal && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small ghost", onClick: () => api.libraryReveal(id).catch((x) => toast(x.message, "bad")), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 14 }),
            "Show in ",
            FOLDER_APP
          ] }),
          row?.source === "sfx" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small ghost", onClick: play, children: [
            playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 14 }),
            playing ? "Stop" : "Play"
          ] }),
          dev && d.editable && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small ghost lby-ship", disabled: busy, onClick: ship, title: "Developer build only: copies this entry into templates/library, so it comes with the app", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ship, { size: 14 }),
            "Ship with the app"
          ] })
        ] }),
        row?.source === "seed" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim lby-note", children: "Built in: comes with the app and stays read-only. Claude copies it into a video when it uses it." }),
        row && !own && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim lby-note", children: FED_NOTE[row.source] ?? "Indexed where it lives; read-only here." }),
        edit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-edit panel pad", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lby-title", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "lby-title", className: "input", value: edit.title, maxLength: 120, onChange: (x) => setEdit({ ...edit, title: x.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lby-summary", children: "Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "lby-summary", className: "input", rows: 3, maxLength: 400, value: edit.summary, onChange: (x) => setEdit({ ...edit, summary: x.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "lby-tags", children: [
              "Tags ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: "(comma separated: the words Claude searches with)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "lby-tags", className: "input", value: edit.tags, onChange: (x) => setEdit({ ...edit, tags: x.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lby-scope", children: "Where Claude may use it" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "lby-scope", className: "input", value: edit.scope, onChange: (x) => setEdit({ ...edit, scope: x.target.value }), children: scopes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: scopeName(s) }, s)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 8, justifyContent: "flex-end" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small ghost", onClick: () => setEdit(null), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small primary", disabled: busy || !edit.title.trim(), onClick: save, children: "Save" })
          ] })
        ] }),
        e?.problem && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "The problem and the fix" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "lby-table lby-problem", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            e.problem.symptom && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "What you see" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.problem.symptom })
            ] }),
            e.problem.cause && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Why" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.problem.cause })
            ] }),
            e.problem.fix && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Fix" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.problem.fix })
            ] }),
            e.problem.detect && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "How to spot it" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.problem.detect })
            ] }),
            e.problem.scopeLetter && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Applies to" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: SCOPE_LETTER[e.problem.scopeLetter] ?? e.problem.scopeLetter })
            ] })
          ] }) })
        ] }),
        (e?.doc?.when || e?.doc?.avoid || e?.doc?.gotchas?.length || params.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "How to use it" }),
          e?.doc?.when && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "When:" }),
            " ",
            e.doc.when
          ] }),
          e?.doc?.avoid && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Not for:" }),
            " ",
            e.doc.avoid
          ] }),
          !!e?.doc?.gotchas?.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "small", children: "Watch out" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "lby-gotchas", children: e.doc.gotchas.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: g }, i)) })
          ] }),
          params.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "lby-table", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: params.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "mono", children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: typeof v === "string" ? v : JSON.stringify(v) })
          ] }, k)) }) })
        ] }),
        usage && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "What Claude writes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "lby-code small-code", children: usage })
        ] }),
        own && d.files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            "Files ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim small", children: "(read-only)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-files", role: "tablist", children: d.files.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": file === x, className: file === x ? "on" : "", onClick: () => setFile(x), children: x }, x)) }),
          file && isImg(file) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-imgview", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: d.fileBase + file.split("/").map(encodeURIComponent).join("/"), alt: file }) }) : codeErr ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim", children: codeErr }) : code ? /* @__PURE__ */ jsxRuntimeExports.jsx(CodeView, { text: code.text, truncated: code.truncated }) : file ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) }) : null
        ] }),
        d.fed && (d.fed.facts.length > 0 || d.fed.file) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "lby-facts", children: [
            d.fed.file && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "mono", children: d.fed.file }),
            d.fed.facts.map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: x }, i))
          ] })
        ] }),
        d.engines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Needs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small", children: [
            d.engines.join(", "),
            " (older videos get “Update engine” first)"
          ] })
        ] }),
        row && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Styles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-chips", children: (row.bases ?? "").split(/\s+/).filter(Boolean).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lby-chip", children: baseName(b) }, b)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim", style: { marginTop: 6 }, children: scopeName(row.scope) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec lby-used", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Used in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small dim", children: [
            "Found ",
            d.uses.hits,
            "× in searches · used ",
            d.uses.uses,
            "× · worked ",
            d.uses.wins,
            "× · failed ",
            d.uses.fails,
            "×"
          ] }),
          d.usedIn.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-links", children: d.usedIn.map((pid) => {
            const p = allProjects.find((x) => x.id === pid);
            return p ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link", onClick: () => openProject(p), children: p.name }, pid) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small dim", children: "a deleted video" }, pid);
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim", children: "Not used in a video yet." })
        ] }),
        prov.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Where it comes from" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "lby-prov", children: prov.slice(0, 12).map((p, i) => {
            const pr = projectOf(p);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: p.project ?? "a project" }),
                p.file ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mono", children: [
                  " ",
                  p.file,
                  p.lines ? `:${p.lines}` : ""
                ] }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dim", children: [
                  " ",
                  [p.at, p.by].filter(Boolean).join(" · ")
                ] })
              ] }),
              pr && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small ghost", onClick: () => openProject(pr), children: "Open" })
            ] }, i);
          }) })
        ] }),
        (e?.licence || d.fed?.licence || row?.licence) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Licence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small", children: [
            licenceText(e?.licence?.id ?? d.fed?.licence ?? row?.licence ?? "own"),
            e?.licence?.author || d.fed?.author ? ` · by ${e?.licence?.author || d.fed?.author}` : ""
          ] }),
          (e?.licence?.credit_text || d.fed?.credit) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small dim", children: [
            "Credit: ",
            e?.licence?.credit_text || d.fed?.credit
          ] }),
          (e?.licence?.source_url || d.fed?.source_url) && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-btn link small", onClick: () => api.external(String(e?.licence?.source_url || d.fed?.source_url)), children: [
            "Source ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 })
          ] })
        ] }),
        d.related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lby-sec", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Related" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lby-related", children: d.related.map((r) => r.exists ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "lby-rel", onClick: () => onOpen(r.id), title: r.id, children: [
            r.kind && /* @__PURE__ */ jsxRuntimeExports.jsx(KindBadge, { k: r.kind }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis", children: r.title })
          ] }, r.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lby-rel missing mono", title: "Not in this library", children: r.id }, r.id)) })
        ] })
      ] })
    ] })
  ] });
}
function licenceText(id) {
  return { own: "Made here (yours to use)", "CC0-1.0": "CC0 (public domain, no credit needed)", "CC-BY-4.0": "CC BY 4.0 (credit the author)", "CC-BY-3.0": "CC BY 3.0 (credit the author)", PD: "Public domain" }[id] ?? id;
}
function CodeView({ text, truncated }) {
  const lines = reactExports.useMemo(() => text.replace(/\r\n/g, "\n").split("\n"), [text]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lby-codeview", role: "region", "aria-label": "File contents (read-only)", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: lines.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ln", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: i + 1 }),
      l || " "
    ] }, i)) }) }),
    truncated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small dim", style: { padding: "6px 10px" }, children: "Only the first part of this long file is shown." })
  ] });
}
export {
  Library as default
};
