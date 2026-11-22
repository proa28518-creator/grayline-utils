rt { c as createLucideIcon, u as useApp, j as jsxRuntimeExports, r as reactExports, ae as Clock, af as useStyleKit, ag as useClockTime, ah as usePlaying, d as api, o as on, T as TriangleAlert, S as Spinner, ai as ArrowLeft, aj as Repeat, ak as Gauge, R as React, C as Check, n as Lock, a9 as Square, al as Info, am as Boxes, an as FOLDER_APP, a8 as FolderOpen, ao as Preview, ac as Busy, ap as Pin, X, aq as Pause, aa as Play, a5 as ShieldCheck, A as Asterisk, W as WandSparkles, ar as RefreshCw, w as Save, as as ChevronRight, at as CircleCheck, au as RefsPanel, i as isStandard, a as usePlan, g as isOwnStyle, av as ImagePlus, z as Film, aw as RefButton, ax as Modal, q as Plus, ay as Undo2, p as premiumMsg } from "./index-wX7YC2th.js";
import { C as ClaudePanel, M as Md } from "./ClaudePanel-D3_P-Q-D.js";
import { s as selLabel, S as STYLES_MOVED } from "./Editor-DZrg__Oz.js";
import { s as studioCanBuildOn } from "./stylePackage-BmzKskVp.js";
import { C as CircleDot } from "./circle-dot-Dh2vMULb.js";
import { L as Layers } from "./layers-De66WQdd.js";
import "./libraryNav-De0opIcL.js";
import "./PersonalEditor-Bx92rSWj.js";
import "./skip-forward-C1cpAv53.js";
const __iconData$5 = {
  name: "bot",
  size: 24,
  node: [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }]
  ]
};
__iconData$5.node;
const Bot = createLucideIcon(__iconData$5);
const __iconData$4 = {
  name: "crosshair",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
    ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
    ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
  ]
};
__iconData$4.node;
const Crosshair = createLucideIcon(__iconData$4);
const __iconData$3 = {
  name: "git-compare-arrows",
  size: 24,
  node: [
    ["circle", { cx: "5", cy: "6", r: "3", key: "1qnov2" }],
    ["path", { d: "M12 6h5a2 2 0 0 1 2 2v7", key: "1yj91y" }],
    ["path", { d: "m15 9-3-3 3-3", key: "1lwv8l" }],
    ["circle", { cx: "19", cy: "18", r: "3", key: "1qljk2" }],
    ["path", { d: "M12 18H7a2 2 0 0 1-2-2V9", key: "16sdep" }],
    ["path", { d: "m9 15 3 3-3 3", key: "1m3kbl" }]
  ]
};
__iconData$3.node;
const GitCompareArrows = createLucideIcon(__iconData$3);
const __iconData$2 = {
  name: "scan-eye",
  size: 24,
  node: [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }],
    ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
    [
      "path",
      {
        d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
        key: "11ak4c"
      }
    ]
  ]
};
__iconData$2.node;
const ScanEye = createLucideIcon(__iconData$2);
const __iconData$1 = {
  name: "target",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
  ]
};
__iconData$1.node;
const Target = createLucideIcon(__iconData$1);
const __iconData = {
  name: "user",
  size: 24,
  node: [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ]
};
__iconData.node;
const User = createLucideIcon(__iconData);
const STAGE_NAME = { brief: "Brief", study: "Study", look: "Look", review: "Review", save: "Save", guide: "Style guide", kit: "Kit", sample: "Sample", publish: "Publish" };
const STAGE_HINT = {
  brief: "What you want: the name, the style, the frames, a description and your references.",
  study: "Claude studies your references and writes down what makes them work (colours, motion, type) in numbers.",
  look: "Claude sets the look up on the style's own settings and writes its notes. You see it live on the sample video.",
  review: "The app checks every version; Claude looks at the frames at full size; you pin what looks wrong. Fix until nothing high is open.",
  save: "Save the look: it shows under its style in New project, the Look panel and Routines.",
  guide: "Claude writes the style guide and restyles the engine; the first three hero frames are your first look at the style.",
  kit: "Every element of the style, shown alone: approve or flag each one.",
  sample: "A short sample video built from the kit only, in every frame.",
  publish: "The app runs its checklist; when it is all green the style appears under Your styles everywhere."
};
const IMAGE_COST = 0.013;
function aspectsOf(st) {
  const a = st?.aspects;
  if (a?.length) return a;
  const f = st?.controls.find((c) => c.path === "format")?.options?.map((o) => o.value === "vertical" ? "9:16" : o.value === "landscape" ? "16:9" : null).filter(Boolean);
  return f?.length ? f : ["16:9"];
}
const ACT = (a) => !a ? null : a.replace(/^version (\d+): checks$/, "Checking version $1…").replace(/^version (\d+): video (.+)$/, "Rendering the $2 video of v$1…").replace(/^version (\d+)$/, "Saving version $1…").replace(/^back to v(\d+)$/, "Going back to v$1…").replace(/^study: (\S+) (.+)$/, "Measuring $1: $2…").replace(/^publish: (.+)$/, "Publishing: $1…").replace(/^version (\d+): match$/, "Matching v$1 to the targets…").replace(/^critic v(\d+)$/, "The critic is judging v$1…").replace(/^target: reading the picture$/, "Reading the target picture…").replace(/^target: making (\d+) of (\d+)$/, "Making target frame $1 of $2…");
const LOOP_PHASE = { version: "saving a version", overlays: "matching the targets", critic: "the critic is judging", fix: "Claude is fixing" };
const MATCH_KINDS = [
  ["side", "Side by side", "Target left, render right"],
  ["blend", "Blend", "50/50: shapes in the wrong place show double"],
  ["edges", "Edges", "The target's edges in cyan over the render: where they miss, the framing or perspective differs"],
  ["crops", "Crops", "The same regions zoomed: the centre and where they differ most (target left, render right)"],
  ["colours", "Colours", "The mean colour of 12 regions, target vs render: grade and light errors in numbers"]
];
function RegionTable({ regions }) {
  if (!regions?.length) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small sd-cmp-none", children: "No colour numbers for this version (made before they existed)." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "sd-regions", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Region" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Target" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Render" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { title: "Render minus target luminance (0-255): negative = the render is darker", children: "Light" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { title: "Colour distance 0-100", children: "Off by" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: regions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: r.d >= 12 ? "bad" : r.d >= 6 ? "warn" : "", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: r.target } }),
        r.target
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: r.render } }),
        r.render
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
        r.dL > 0 ? "+" : "",
        r.dL
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.d })
    ] }, r.name)) })
  ] });
}
const fmtT = (t) => `${t.toFixed(1)} s`;
const flat = (o, pre = "") => Object.entries(o ?? {}).flatMap(([k, v]) => v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${pre}${k}.`) : [[`${pre}${k}`, v]]);
function Studio() {
  const { studioId, studioPrefill } = useApp();
  return studioId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Workspace, { projectId: studioId }, studioId) : /* @__PURE__ */ jsxRuntimeExports.jsx(BriefForm, { prefill: studioPrefill ?? { mode: "look", target: null } });
}
function CapInput({ id, value, onChange }) {
  const [s, setS] = reactExports.useState(String(value));
  reactExports.useEffect(() => {
    if (s.trim() === "" || +s !== value) setS(String(value));
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      id,
      className: "input sd-cap",
      type: "number",
      min: 0,
      max: 500,
      value: s,
      onBlur: () => setS(String(value)),
      onChange: (e) => {
        const v = e.target.value;
        setS(v);
        const n = Math.round(+v);
        if (v.trim() !== "" && n >= 0 && n <= 500) onChange(n);
      }
    }
  );
}
function useFlowImages() {
  const [flow, setFlow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    api.imagesStatus().then((s) => setFlow(s?.active === "flow")).catch(() => {
    });
  }, []);
  return flow;
}
const IMG = /\.(png|jpe?g|webp|gif)$/i, VID = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;
function BriefForm({ prefill }) {
  const { toast, go, refreshProjects, openStudio, claude } = useApp();
  const std = isStandard(usePlan());
  const [styles, setStyles] = reactExports.useState([]);
  const [missing, setMissing] = reactExports.useState({});
  const mode = "look";
  const [target, setTarget] = reactExports.useState(prefill.target ?? "");
  const [name, setName] = reactExports.useState(""), [desc, setDesc] = reactExports.useState(""), [cap, setCap] = reactExports.useState(10);
  const [aspects, setAspects] = reactExports.useState([]);
  const [refs, setRefs] = reactExports.useState([]), [over, setOver] = reactExports.useState(false), [busy, setBusy] = reactExports.useState(false);
  const flow = useFlowImages();
  reactExports.useEffect(() => {
    api.styles().then((l) => {
      setStyles(l);
      if (!prefill.target) setTarget(l.find((s) => s.id === "flat")?.id ?? l[0]?.id ?? "");
    }).catch(() => {
    });
  }, []);
  const choices = styles.filter((s) => !s.hidden && !s.legacy && !s.missing && studioCanBuildOn(s));
  const st = styles.find((s) => s.id === target);
  const can = ["16:9", "9:16"].filter((a) => aspectsOf(st).includes(a));
  reactExports.useEffect(() => {
    setAspects(can);
  }, [target, styles.length]);
  const add = (paths) => {
    const ok = paths.filter((p) => IMG.test(p) || VID.test(p));
    if (ok.length < paths.length) toast("Only images and videos can be references here.", "info");
    setRefs((r) => [.../* @__PURE__ */ new Set([...r, ...ok])].slice(0, 40));
  };
  const pick = async () => {
    const fs = await api.pickFiles("Add reference images or videos", [{ name: "Images and videos", extensions: ["png", "jpg", "jpeg", "webp", "gif", "mp4", "mov", "m4v", "webm", "mkv"] }]);
    if (fs?.length) add(fs);
  };
  const start = async () => {
    if (std) {
      toast(premiumMsg("The Style Studio"));
      return;
    }
    const miss = { name: !name.trim(), frames: !aspects.length };
    setMissing(miss);
    if (miss.name || miss.frames) {
      document.getElementById(miss.name ? "sd-name" : "sd-frames")?.focus();
      return;
    }
    if (!claude?.loggedIn) toast("Claude is not connected yet: you can set the workspace up now, and sign in before its first stage.", "info");
    setBusy(true);
    try {
      const r = await api.studioCreate({ mode, name: name.trim(), target, dim: null, aspects, description: desc.trim(), refs, imageCap: cap });
      await refreshProjects();
      openStudio(r.projectId);
    } catch (e) {
      toast(String(e.message), "bad");
      setBusy(false);
    }
  };
  const lookName = "look";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter sd-briefpage", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-head", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn ghost small sd-back", onClick: () => go("presets"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
        "Styles"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "New look" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sub", children: "Same style, your settings, checked on a sample video before you save it." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel pad sd-brief", "aria-label": "Brief", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "help sd-lookonly", children: "Colours, grade, grain, camera, captions, characters and notes for Claude. Nothing new gets drawn; a style with new elements is made with the Style Kit (Styles > Custom)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-row2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-name", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "sd-name", className: `input ${missing.name && !name.trim() ? "invalid" : ""}`, "aria-invalid": missing.name && !name.trim() || void 0, value: name, maxLength: 60, onChange: (e) => setName(e.target.value), placeholder: "e.g. Midnight blueprint" }),
          missing.name && !name.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "help err", children: "Give the look a name." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-target", children: "Look for" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "sd-target", className: "input", value: target, onChange: (e) => setTarget(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "Built-in styles", children: choices.filter((s) => !isOwnStyle(s)).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id)) }),
            choices.some(isOwnStyle) && /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "Your styles", children: choices.filter(isOwnStyle).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Frames" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", id: "sd-frames", tabIndex: -1, style: { gap: 8 }, children: ["16:9", "9:16"].map((a) => {
          const ok = can.includes(a), onA = aspects.includes(a);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `sd-check ${!ok ? "off" : ""}`, title: ok ? void 0 : `${st?.name ?? "This style"} renders ${can.join(" and ")} only`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", disabled: !ok, checked: ok && onA, onChange: () => setAspects((x) => onA ? x.filter((y) => y !== a) : [...x, a]) }),
            a === "16:9" ? "Wide 16:9" : "Vertical 9:16"
          ] }, a);
        }) }),
        missing.frames && !aspects.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "help err", children: "Pick at least one frame." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "help", children: "Every version is rendered and checked in each frame you pick." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-desc", children: "Describe it" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "sd-desc", className: "input", rows: 4, value: desc, onChange: (e) => setDesc(e.target.value), placeholder: "Colours, background, type, how things move… e.g. 'Deep navy backgrounds, cyan line art like a blueprint, white condensed captions, slow pushes.'" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "References ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: "(optional: images or videos; nothing is copied)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `cs-drop ${over ? "over" : ""}`,
            onDragOver: (e) => {
              e.preventDefault();
              setOver(true);
            },
            onDragLeave: () => setOver(false),
            onDrop: (e) => {
              e.preventDefault();
              setOver(false);
              add([...e.dataTransfer.files].map((f) => window.suite.pathForFile(f)).filter(Boolean));
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: pick, disabled: busy, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 16, strokeWidth: 1.7 }),
                "Add images or videos…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "or drop them here. For a long video you pick the seconds that matter in the workspace's References." })
            ]
          }
        ),
        refs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cs-refs", children: refs.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "cs-ref", children: [
          VID.test(r) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis", children: r.split(/[\\/]/).pop() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Remove", onClick: () => setRefs((x) => x.filter((y) => y !== r)), disabled: busy, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
        ] }, r)) })
      ] }),
      !flow && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-cap", children: "Picture cap" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CapInput, { id: "sd-cap", value: cap, onChange: setCap }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
            "pictures at most, about ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              "$",
              (cap * IMAGE_COST).toFixed(2)
            ] }),
            " on your image account. Claude itself runs on your Claude plan (no cap)."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row small", style: { gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }),
          "Setting up the workspace…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => go("presets"), disabled: busy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sd-start", onClick: start, disabled: busy || !target, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 15, strokeWidth: 1.8 }),
          "Start the ",
          lookName,
          std && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-pill", children: "Premium" })
        ] })
      ] })
    ] })
  ] });
}
const NOREQ = { n: 0, notes: "" }, NOFIX = { n: 0, text: "" };
function Workspace({ projectId }) {
  const { toast, go, working, refreshProjects, setNewProject } = useApp();
  const [st, setSt] = reactExports.useState(null), [err, setErr] = reactExports.useState(null);
  const [issues, setIssues] = reactExports.useState([]), [versions, setVersions] = reactExports.useState([]);
  const [styleName, setStyleName] = reactExports.useState("");
  const [host, setHost] = reactExports.useState(null), [base, setBase] = reactExports.useState("");
  const [aspect, setAspect] = reactExports.useState("16:9"), [psettings, setPsettings] = reactExports.useState(null);
  const [reloadKey, setReloadKey] = reactExports.useState(0), [bootError, setBootError] = reactExports.useState(null);
  const [shots, setShots] = reactExports.useState([]);
  const [viewStage, setViewStage] = reactExports.useState(null), [verSel, setVerSel] = reactExports.useState(null);
  const [selection, setSelection] = reactExports.useState([]);
  const [pin, setPin] = reactExports.useState(null), [pinText, setPinText] = reactExports.useState(""), [pinSev, setPinSev] = reactExports.useState("medium");
  const [compare, setCompare] = reactExports.useState(false), [refsOpen, setRefsOpen] = reactExports.useState(false), [taskId, setTaskId] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("open");
  const [busy, setBusy] = reactExports.useState(null);
  const [targets, setTargets] = reactExports.useState([]), [loop, setLoop] = reactExports.useState(null);
  const [centre, setCentre] = reactExports.useState("gallery"), [matchTarget, setMatchTarget] = reactExports.useState(null);
  const clock = reactExports.useMemo(() => new Clock(), [projectId]);
  const kitBtns = useStyleKit();
  const t = useClockTime(clock, 15), playing = usePlaying(clock);
  const preview = reactExports.useRef(null);
  const claudeBusy = working.has(projectId);
  const say = (e) => toast(String(e?.message ?? e), "bad");
  const load = reactExports.useCallback(async () => {
    try {
      const [s, is, vs, tg, lp] = await Promise.all([api.studioState(projectId), api.studioIssues(projectId), api.studioVersions(projectId), api.studioTargets(projectId), api.studioLoop(projectId)]);
      setSt(s);
      setIssues(is);
      setVersions(vs);
      setTargets(tg);
      setLoop(lp);
      setErr(null);
    } catch (e) {
      setErr(String(e.message));
    }
  }, [projectId]);
  reactExports.useEffect(() => {
    load();
    api.openProject(projectId).then((r) => {
      setHost(r.host);
      setBase(r.base);
    }).catch((e) => setErr(e.message));
    api.running().then((r) => {
      const m = r.find((x) => x.projectId === projectId);
      if (m) setTaskId(m.taskId);
    }).catch(() => {
    });
    const offs = [
      on("studio:changed", (e) => {
        if (e?.projectId === projectId) load();
      }),
      on("project:changed", (e) => {
        if (e?.projectId === projectId && e.reload) {
          setReloadKey((k) => k + 1);
        }
      }),
      on("claude:event", (ev) => {
        if (ev.projectId !== projectId) return;
        if (ev.type === "started") setTaskId(ev.taskId);
        if (ev.type === "done") {
          setTaskId(null);
          setReloadKey((k) => k + 1);
          load();
        }
      })
    ];
    return () => {
      offs.forEach((f) => f());
      api.closeProject();
    };
  }, [projectId]);
  reactExports.useEffect(() => {
    if (st && !viewStage) setViewStage(st.studio.stage);
    if (st && !st.studio.aspects.includes(aspect)) setAspect(st.studio.aspects[0]);
  }, [st?.studio.stage, st?.studio.aspects.join()]);
  reactExports.useEffect(() => {
    if (st) api.styles().then((l) => setStyleName(l.find((x) => x.id === st.studio.target)?.name ?? st.studio.target)).catch(() => {
    });
  }, [st?.studio.target]);
  const lookAt = st?.studio.look?.at ?? "";
  reactExports.useEffect(() => {
    if (!st) return;
    api.studioPreviewSettings(projectId, aspect).then((s) => setPsettings(JSON.stringify(s))).catch(() => setPsettings(null));
  }, [projectId, aspect, lookAt, !!st]);
  const hostUrl = host && psettings ? `${host}?settings=${encodeURIComponent(psettings)}` : null;
  const view = st?.studio.view ?? "", v = st?.studio.views[view];
  reactExports.useEffect(() => {
    clock.end = v?.end ?? 0;
    if (clock.t > clock.end) clock.set(0);
  }, [v?.end]);
  reactExports.useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 1e3;
      last = now;
      let n = clock.t + dt;
      if (n >= clock.end) n = 0;
      clock.set(n);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, clock]);
  const onReady = reactExports.useCallback((info) => {
    setShots((info?.shots ?? []).map((s) => ({ t0: +s.t0, t1: +s.t1, name: s.name })));
  }, []);
  const onPick = reactExports.useCallback(async (r) => {
    const item = { kind: r.kind, time: r.time, shot: r.shot, element: r.element, rect: r.rect };
    setSelection([item]);
    const frame = await preview.current?.frame(0.5).catch(() => null) ?? null;
    setPin({ t: +(r.time ?? clock.t), label: selLabel(item), rect: r.rect ?? null, frame });
    setPinText("");
  }, [clock]);
  const snapshot = reactExports.useCallback(async () => {
    const url = await preview.current?.frame(0.5);
    return url ? { frame: url, plain: url } : null;
  }, []);
  if (err && !st) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint warn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "This Style Studio workspace can't be opened" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: err })
    ] })
  ] }) });
  if (!st) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  const S = st.studio, order = st.stages, cur = order.indexOf(S.stage), shown = viewStage && order.includes(viewStage) ? viewStage : S.stage, isCur = shown === S.stage;
  const latest = versions[versions.length - 1] ?? null, ver = versions.find((x) => x.v === verSel) ?? latest;
  const kind = S.mode === "look" ? `Look for ${styleName}` : S.mode === "derived" ? `Style on top of ${styleName}` : `New style · ${(S.dim ?? "2d").toUpperCase()}`;
  const act = ACT(st.activity) ?? (claudeBusy ? "Claude is working…" : busy);
  const open = issues.filter((i) => ["open", "reopened", "fixing"].includes(i.status)), verify = issues.filter((i) => i.status === "verify");
  const looping = !!loop && (loop.status === "running" || loop.status === "stopping"), jobBusy = looping || !!loop?.critic, anyBusy = claudeBusy || jobBusy;
  const scores = versions.filter((x) => x.score).map((x) => ({ v: x.v, value: x.score.value }));
  const stopLoop = () => api.studioLoopStop(projectId).then(load).catch(say);
  const run = async (o = {}) => {
    try {
      await api.studioRun(projectId, { instruction: "", ...o });
    } catch (e) {
      say(e);
    }
  };
  const job = async (what, f, done) => {
    setBusy(what);
    try {
      await f();
      if (done) toast(done);
    } catch (e) {
      say(e);
    } finally {
      setBusy(null);
      load();
    }
  };
  const approve = () => job("Moving on…", async () => {
    const s = await api.studioSetStage(projectId, st.next);
    setSt(s);
    setViewStage(s.studio.stage);
  });
  const reopen = (stage) => job("Going back…", async () => {
    const s = await api.studioSetStage(projectId, stage);
    setSt(s);
    setViewStage(stage);
  });
  const seek = async (i) => {
    const w = i.where ?? {};
    if (w.view && w.view !== view && S.views[w.view]) {
      await api.studioSetView(projectId, w.view).catch(say);
      setReloadKey((k) => k + 1);
    }
    if (w.aspect && w.aspect !== aspect && S.aspects.includes(w.aspect)) setAspect(w.aspect);
    if (typeof w.t === "number") {
      clock.setPlaying(false);
      clock.set(w.t);
    }
    setCentre("preview");
    if (!["brief", "study"].includes(S.stage)) setViewStage(S.stage === "save" || S.stage === "publish" ? "review" : S.stage);
  };
  const setIssue = (id, status) => api.studioIssueUpdate(projectId, id, { status }).then(load).catch(say);
  const addPin = async () => {
    if (!pin || !pinText.trim()) return;
    try {
      await api.studioIssueAdd(projectId, { title: pinText.trim().slice(0, 200), severity: pinSev, where: { view, aspect, t: +pin.t.toFixed(2), element: pin.label, rect: pin.rect ? [pin.rect.x, pin.rect.y, pin.rect.w, pin.rect.h] : null }, thumb: pin.frame });
      setPin(null);
      setPinText("");
      setFilter("open");
      load();
    } catch (e) {
      say(e);
    }
  };
  const viewNames = Object.keys(S.views).filter((n) => !S.views[n].expect && !/^mustfail/i.test(n));
  const frames = (ver?.renders?.[aspect]?.frames ?? []).filter((f) => f.view === view).sort((a, b) => a.t - b.t);
  const checks = ver?.checks;
  const isViewer = !["brief", "study"].includes(shown) && !((shown === "save" || shown === "publish") && isCur);
  const matchable = shown === "review", showMatch = matchable && centre === "match";
  const galleryable = (shown === "guide" || shown === "kit") && S.mode !== "look", showGallery = galleryable && centre !== "preview" && !!latest;
  const seekTarget = (x) => {
    setCentre("preview");
    seek({ where: { view: x.view, aspect: x.aspect, t: x.t } });
  };
  const saveFrames = (latest?.renders?.[S.aspects[0]]?.frames ?? []).filter((f) => f.view === (S.views.sample ? "sample" : view));
  const savePic = saveFrames[Math.floor(saveFrames.length / 2)]?.url ?? null;
  const list = issues.filter((i) => filter === "all" ? true : filter === "open" ? ["open", "reopened", "fixing", "verify"].includes(i.status) : ["fixed", "wontfix"].includes(i.status)).sort((a, b) => (a.status === "verify" ? -1 : 0) - (b.status === "verify" ? -1 : 0) || ["high", "medium", "low"].indexOf(a.severity) - ["high", "medium", "low"].indexOf(b.severity));
  const end = v?.end ?? 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sd-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", "aria-label": "Back to Styles", title: "Back to Styles", onClick: () => go("presets"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 17, strokeWidth: 1.7 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "ellipsis sd-name", title: S.name, children: S.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sd-kind k-${S.mode}`, children: kind }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      act && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-activity", role: "status", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 12 }),
        act
      ] }),
      looping && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-loopchip", role: "status", title: "Run until good: fix round, a version with its checks and overlays, the critic every few passes", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 12 }),
        "Pass ",
        loop.pass,
        "/",
        loop.cap,
        loop.phase ? ` · ${LOOP_PHASE[loop.phase]}` : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn sd-loopchip-stop", onClick: stopLoop, disabled: loop.status === "stopping", children: loop.status === "stopping" ? "Stopping…" : "Stop" })
      ] }),
      scores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-score", title: `The critic's scores (stop at ${loop?.threshold ?? 8}):
${scores.map((s) => `v${s.v}: ${s.value}`).join("\n")}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { size: 12 }),
        "Score",
        scores.slice(-4).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-score-arrow", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: s.value >= (loop?.threshold ?? 8) ? "ok" : "", children: s.value })
        ] }, s.v))
      ] }),
      versions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact sd-ver", "aria-label": "Version", value: ver?.v ?? "", onChange: (e) => setVerSel(+e.target.value), children: [...versions].reverse().map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: x.v, children: [
        "v",
        x.v,
        " · ",
        x.label,
        x.v === latest?.v ? " (latest)" : ""
      ] }, x.v)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-compare", disabled: versions.length < 2, onClick: () => setCompare(true), title: versions.length < 2 ? "Two versions are needed to compare" : "Two versions side by side, or as a slider; go back to one", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GitCompareArrows, { size: 14 }),
        "Compare"
      ] }),
      S.aspects.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl sd-aspect", role: "radiogroup", "aria-label": "Frame", children: S.aspects.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": aspect === a, className: aspect === a ? "on" : "", onClick: () => setAspect(a), children: a }, a)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "sd-rail", "aria-label": "Stages", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", children: "Stages" }),
      order.map((id, i) => {
        const s = S.stages[id]?.status, locked = i > cur, current = id === S.stage;
        const state = current ? s === "running" ? "running" : "current" : s === "stale" ? "stale" : s === "approved" || i < cur && s !== "idle" ? "approved" : s === "done" ? "done" : locked ? "locked" : "idle";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `sd-stage st-${state} ${shown === id ? "on" : ""}`, disabled: locked, onClick: () => setViewStage(id), "aria-current": current ? "step" : void 0, title: STAGE_HINT[id], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-stage-ic", children: state === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 12 }) : state === "approved" || state === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13 }) : state === "locked" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12 }) : state === "stale" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { size: 13 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              i + 1,
              ". ",
              STAGE_NAME[id] ?? id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: state === "current" && id === "save" && S.saved ? "saved" : state === "current" && id === "publish" && S.published ? `published v${S.published.version}` : state === "current" ? "now" : state === "stale" ? "needs a new look" : state === "locked" ? "later" : state === "approved" ? "approved" : state === "running" ? "Claude is on it" : "" })
          ] })
        ] }, id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-rail-foot", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "small", children: [
          open.length,
          " open issue",
          open.length === 1 ? "" : "s",
          st.issues.openHigh ? ` · ${st.issues.openHigh} high` : ""
        ] }),
        claudeBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small danger block sd-stop", onClick: () => taskId && api.studioStop(taskId).catch(say), disabled: !taskId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 12 }),
          "Stop Claude"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sd-center", "aria-label": STAGE_NAME[shown], children: [
      S.mode !== "look" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sk-moved", role: "note", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 16, strokeWidth: 1.8 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Making whole styles moved to the Style Kit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This workspace still opens and Claude can still work in it, but it can't publish. Build styles in Claude Code with the Style Kit, then import them in Styles > Custom." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sk-moved-kit", onClick: kitBtns.getKit, disabled: kitBtns.kitBusy, children: [
          kitBtns.kitBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 12 }),
          kitBtns.kitBusy ? "Writing the kit…" : "Get the Style Kit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny ghost sk-moved-folder", onClick: () => api.open(st.dir).catch(say), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 12 }),
          "Show in ",
          FOLDER_APP
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-stagehead", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: STAGE_NAME[shown] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: STAGE_HINT[shown] }),
        !isCur && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-past", children: order.indexOf(shown) < cur ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "An earlier stage. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link", onClick: () => reopen(shown), disabled: anyBusy, children: "Go back to it" }),
          " (the stages after it need a new look)"
        ] }) : "Not reached yet." })
      ] }),
      shown === "brief" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BriefSummary, { st, styleName, projectId, onRefs: () => setRefsOpen(true), onSaved: load }) }),
      shown === "study" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StudyPanel,
        {
          projectId,
          st,
          isCur,
          busy: anyBusy || !!busy,
          onRefs: () => setRefsOpen(true),
          onMeasure: () => job("Measuring the references…", () => api.studioStudy(projectId), "The references are measured.")
        }
      ),
      isViewer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-viewer", children: [
        (viewNames.length > 1 || matchable || galleryable) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-viewrow", children: [
          viewNames.length > 1 && !showGallery && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-views", role: "tablist", "aria-label": "Views", children: viewNames.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              role: "tab",
              "aria-selected": n === view,
              className: `btn tiny ${n === view ? "active" : ""}`,
              onClick: () => api.studioSetView(projectId, n).then(() => {
                setReloadKey((k) => k + 1);
                load();
              }).catch(say),
              children: n[0].toUpperCase() + n.slice(1).replace(/_/g, " ")
            },
            n
          )) }),
          galleryable && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl tiny sd-centre-mode sd-gallery-mode", role: "radiogroup", "aria-label": "Show in the middle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  role: "radio",
                  "aria-checked": showGallery,
                  className: showGallery ? "on" : "",
                  disabled: !latest,
                  title: !latest ? "Claude's first turn of this stage makes a version" : void 0,
                  onClick: () => {
                    setCentre("gallery");
                    const k = shown === "guide" ? "hero" : "kit";
                    if (S.views[k] && view !== k) api.studioSetView(projectId, k).then(() => {
                      setReloadKey((x) => x + 1);
                      load();
                    }).catch(say);
                  },
                  children: shown === "guide" ? "Hero frames" : "Kit gallery"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": !showGallery, className: !showGallery ? "on" : "", onClick: () => setCentre("preview"), children: "Live preview" })
            ] })
          ] }),
          matchable && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl tiny sd-centre-mode", role: "radiogroup", "aria-label": "Show in the middle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": !showMatch, className: !showMatch ? "on" : "", onClick: () => setCentre("preview"), children: "Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "radio", "aria-checked": showMatch, className: showMatch ? "on" : "", onClick: () => setCentre("match"), title: "The version's frames over your target frames", children: [
                "Match",
                ver?.match?.targets.length ? ` (${ver.match.targets.length})` : ""
              ] })
            ] })
          ] })
        ] }),
        showMatch ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          MatchView,
          {
            ver,
            sel: matchTarget,
            setSel: setMatchTarget,
            hasTargets: targets.length > 0,
            busy: anyBusy || !!st.activity,
            onMatchNow: () => job("Matching…", () => api.studioMatchNow(projectId))
          }
        ) : showGallery && shown === "guide" ? /* @__PURE__ */ jsxRuntimeExports.jsx(HeroFrames, { st, ver: latest, aspect, projectId, issues, onChanged: load, onShow: (t2, a) => {
          if (a !== aspect) setAspect(a);
          seek({ where: { view: "hero", aspect: a, t: t2 } });
        } }) : showGallery ? /* @__PURE__ */ jsxRuntimeExports.jsx(KitGallery, { st, aspect, projectId, busy: anyBusy, onChanged: load, onShow: (el) => seek({ where: { view: el.view, aspect, t: el.t } }) }) : hostUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Preview,
          {
            ref: preview,
            host: hostUrl,
            reloadKey,
            clock,
            selection,
            onPick,
            onReady,
            onLog: () => {
            },
            onBootError: setBootError,
            bootError,
            label: selLabel,
            aspect: aspect === "9:16" ? 9 / 16 : 16 / 9
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stage-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Busy, { text: "Loading the sample…", size: 18, kind: "orbit" }) }),
        pin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-pin", role: "dialog", "aria-label": "Pin an issue", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { size: 14, className: "sd-pin-ic" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow col", style: { gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
              "At ",
              fmtT(pin.t),
              " on ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: pin.label }),
              " · ",
              view,
              " · ",
              aspect
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "sd-pin-text", className: "input compact grow", autoFocus: true, value: pinText, maxLength: 200, placeholder: "What's wrong here? e.g. the label is cut at the edge", onChange: (e) => setPinText(e.target.value), onKeyDown: (e) => {
                if (e.key === "Enter") addPin();
                if (e.key === "Escape") setPin(null);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input compact", "aria-label": "Severity", value: pinSev, onChange: (e) => setPinSev(e.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small primary sd-pin-add", onClick: addPin, disabled: !pinText.trim(), children: "Pin issue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Cancel", className: "icon-btn sm", "aria-label": "Cancel", onClick: () => setPin(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] })
          ] })
        ] }),
        !showGallery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-scrub", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", "aria-label": playing ? "Pause" : "Play", onClick: () => clock.setPlaying(!playing), children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 17, strokeWidth: 1.7 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 17, strokeWidth: 1.7 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "timecode", children: [
            t.toFixed(2),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "/ ",
              end.toFixed(1)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-track", children: [
            shots.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "sd-tick", style: { left: `${s.t0 / end * 100}%` }, title: `Shot ${i + 1}${s.name ? `: ${s.name.replace(/^\d+[a-z]?:\s*/i, "")}` : ""}` }, i)),
            issues.filter((i) => ["open", "reopened", "fixing", "verify"].includes(i.status) && i.where?.view === view && typeof i.where.t === "number" && (!i.where.aspect || i.where.aspect === aspect)).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `sd-imark sev-${i.severity}`, style: { left: `${i.where.t / end * 100}%` }, title: i.title, "aria-label": `Issue at ${fmtT(i.where.t)}: ${i.title}`, onClick: () => seek(i) }, i.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "sd-fill", style: { width: `${Math.min(t, end) / end * 100}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "sd-head", style: { left: `${Math.min(t, end) / end * 100}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0, max: end, step: 0.01, value: Math.min(t, end), "aria-label": "Time", onChange: (e) => {
              clock.setPlaying(false);
              clock.set(+e.target.value);
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small sd-pinhint", children: "Click the picture to pin an issue" })
        ] }),
        frames.length > 0 && !showGallery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-strip", "aria-label": `Frames of v${ver?.v}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-strip-h", children: [
            "v",
            ver?.v,
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: aspect })
          ] }),
          frames.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `sd-frame ${aspect === "9:16" ? "tall" : ""} ${Math.abs(f.t - t) < 0.05 ? "on" : ""}`, onClick: () => {
            clock.setPlaying(false);
            clock.set(f.t);
          }, title: `${fmtT(f.t)}${f.shot != null ? ` · shot ${f.shot + 1}` : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: f.url, alt: "", loading: "lazy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: f.t.toFixed(1) })
          ] }, f.file))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-checks", "aria-label": "Checks", children: [
          !ver ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-chip", children: "No version yet: Claude's first turn makes one" }) : !checks?.ran ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip", children: [
            "Checks not run on v",
            ver.v
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `sd-chip ${checks.found ? "warn" : "ok"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12 }),
              "v",
              ver.v,
              ": ",
              checks.pairs.length,
              " view × frame checks",
              checks.found ? `, ${checks.found} finding${checks.found === 1 ? "" : "s"}` : ", all clean"
            ] }),
            Object.entries(checks.byCheck).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip warn", children: [
              k.toUpperCase(),
              " ",
              n
            ] }, k))
          ] }),
          S.mode === "look" && S.look && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip look", title: flat(S.look.settings).map(([k, x]) => `${k}: ${JSON.stringify(x)}`).join("\n"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 12 }),
            flat(S.look.settings).length,
            " look setting",
            flat(S.look.settings).length === 1 ? "" : "s"
          ] })
        ] }),
        matchable && isCur && /* @__PURE__ */ jsxRuntimeExports.jsx(
          MatchBar,
          {
            projectId,
            st,
            targets,
            loop,
            view,
            aspect,
            getTime: () => clock.t,
            claudeBusy,
            onChanged: load,
            onSeek: seekTarget,
            onShow: (id) => {
              setMatchTarget(id);
              setCentre("match");
            }
          }
        )
      ] }),
      shown === "publish" && isCur && /* @__PURE__ */ jsxRuntimeExports.jsx(PublishPanel, { st, projectId, busy: anyBusy || !!busy, onDone: () => {
        load();
        refreshProjects();
      }, onNewProject: () => setNewProject(true), onStyles: () => go("presets"), onIssues: () => setViewStage("review") }),
      shown === "save" && isCur && /* @__PURE__ */ jsxRuntimeExports.jsx(SavePanel, { st, projectId, styleName, pic: savePic, tall: S.aspects[0] === "9:16", onSaved: () => {
        load();
        refreshProjects();
      }, onNewProject: () => setNewProject(true), onStyles: () => go("presets") }),
      isCur && shown !== "save" && shown !== "publish" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-actions", children: [
        !st.gate.ok && st.next && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-gate small", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13 }),
          "To approve: ",
          st.gate.missing.join("; "),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        ["study", "look", "guide", "kit", "sample"].includes(shown) && !(shown === "study" && st.gate.ok) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn small sd-run",
            onClick: () => run({}),
            disabled: anyBusy || shown === "study" && !!st.activity,
            title: shown === "study" ? "The app measures your references (if it hasn't yet), then Claude writes the analysis from the numbers and the sheets" : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 14 }),
              shown === "study" ? "Study the references" : "Run stage"
            ]
          }
        ),
        shown === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-review", onClick: () => run({ review: true }), disabled: anyBusy, title: "Claude looks at every view at full size and files what it finds as issues (it changes nothing)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 14 }),
          "Run review"
        ] }),
        shown === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-fixall", onClick: () => run({ fix: true }), disabled: anyBusy || !open.length, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 14 }),
          "Fix all open",
          open.length ? ` (${open.length})` : ""
        ] }),
        shown !== "brief" && shown !== "study" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-checksbtn", onClick: () => job("Checking…", () => api.studioChecks(projectId), "Checks done."), disabled: anyBusy || !!st.activity, title: "Run the app's checks on the workspace as it is now", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
          "Run checks"
        ] }),
        shown !== "brief" && shown !== "study" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-next", onClick: () => job("Saving a version…", () => api.studioNewVersion(projectId, "Next version"), "New version saved."), disabled: anyBusy || !!st.activity, title: "Save the workspace as it is now as a version, with its frames, checks and a short video", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
          "Next version"
        ] }),
        st.next && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small primary sd-approve", onClick: approve, disabled: !st.gate.ok || anyBusy || !!busy, children: [
          "Approve",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sd-right", "aria-label": "Issues and Claude", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-issues", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-issues-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            open.length,
            " open",
            verify.length ? ` · ${verify.length} to check` : "",
            " · ",
            issues.filter((i) => i.status === "fixed").length,
            " fixed"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl tiny", role: "radiogroup", "aria-label": "Show issues", children: ["open", "done", "all"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": filter === f, className: filter === f ? "on" : "", onClick: () => setFilter(f), children: f === "open" ? "Open" : f === "done" ? "Done" : "All" }, f)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-issue-list", children: [
          !list.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20, strokeWidth: 1.6 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: filter === "open" ? "Nothing open" : "None yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: filter === "open" ? "Checks, Claude's review and your pins land here. Click the picture to pin one." : "Fixed and dismissed issues show here." })
          ] }),
          list.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(IssueRow, { i, base, busy: anyBusy, onSeek: () => seek(i), onFix: () => run({ fix: true, issues: [i.id] }), onStatus: (s) => setIssue(i.id, s) }, i.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ClaudePanel,
        {
          projectId,
          selection,
          setSelection,
          label: selLabel,
          snapshot,
          onEditDone: () => load(),
          buildRequest: NOREQ,
          fixRequest: NOFIX,
          onSeek: (x) => {
            clock.setPlaying(false);
            clock.set(x);
          },
          getTime: () => clock.t,
          lockedModel: "Opus 5.5"
        }
      )
    ] }),
    compare && versions.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(CompareDialog, { versions, aspects: S.aspects, aspect, view, projectId, busy: anyBusy || !!st.activity, onClose: () => setCompare(false), onBack: () => {
      setCompare(false);
      setVerSel(null);
      load();
      setReloadKey((k) => k + 1);
    } }),
    refsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(RefsPanel, { projectId, onClose: () => setRefsOpen(false) })
  ] });
}
const pct = (v) => v == null ? "–" : `${Math.round(v * 100)}%`;
const secs = (v) => v == null ? "–" : `${v} s`;
function Swatches({ list, label }) {
  if (!list.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-sw-row", "aria-label": label, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-sw-h small", children: label }),
    list.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-sw", title: `${s.hex}: ${pct(s.share)} of the frames`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: s.hex } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: s.hex }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: pct(s.share) })
    ] }, s.hex))
  ] });
}
function StudyPanel({ projectId, st, isCur, busy, onMeasure, onRefs }) {
  const [view, setView] = reactExports.useState(null), [sel, setSel] = reactExports.useState(0);
  const [big, setBig] = reactExports.useState(null);
  const studying = /^study:/.test(st.activity ?? "");
  reactExports.useEffect(() => {
    api.studioStudyView(projectId).then(setView).catch(() => {
    });
  }, [projectId, st.activity, st.gate.missing.join("|"), st.versions]);
  if (!view) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  const S = view.stats, items = (S?.refs ?? []).flatMap((r) => r.image ? [{ key: r.id, tag: r.tag, ref: r, range: null, name: `${r.tag} · picture` }] : r.ranges?.length ? r.ranges.map((x, k) => ({ key: `${r.id}-${k}`, tag: r.tag, ref: r, range: x, name: `${r.tag} · ${fmtClock(x.start)}–${fmtClock(x.end)}` })) : [{ key: r.id, tag: r.tag, ref: r, range: null, name: `${r.tag} · not measured` }]);
  const it = items[Math.min(sel, items.length - 1)], R = it?.range, img = it?.ref.image;
  const p = view.progress;
  if (!view.refs) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel pad sd-note", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: st.gate.ok && isCur ? "Nothing to study: this workspace has no references. Approve to go on, or add references in the Brief first." : "Add references in the Brief: the app measures them, then Claude writes the analysis." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link", onClick: onRefs, children: "Open References" }) })
  ] }) });
  const rows = R ? [
    ["Shots", `${R.shots.length} in ${R.len} s`],
    ["Cuts per minute", String(R.cuts.perMin)],
    ["Shot length", /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "median ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: secs(R.shotLen.median) }),
      " · mean ",
      secs(R.shotLen.mean),
      " · p10 ",
      secs(R.shotLen.p10),
      " · p90 ",
      secs(R.shotLen.p90)
    ] })],
    ["Light", `mean ${pct(R.light.luma)} · dark ${pct(R.light.dark)} of the frame`],
    ["Loudness", R.audio ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      R.audio.lufs ?? "–",
      " LUFS · range ",
      R.audio.lra ?? "–",
      " LU · peak ",
      R.audio.tp ?? "–",
      " dBFS"
    ] }) : "no sound"],
    ["Pauses", R.audio ? `${R.audio.pauses.count} (${R.audio.pauses.perMin} per min, median ${secs(R.audio.pauses.median)})` : "–"],
    ["Words per minute", R.speech ? `${R.speech.wpm} (${R.speech.talkWpm} while talking)` : "not measured", R.speech ? `Transcribed with ${R.speech.by}` : "Needs a transcriber on this computer"],
    ["Cuts on a word start", R.speech?.cutsOnWords != null ? `${pct(R.speech.cutsOnWords)} (chance ${pct(R.speech.chance)})` : "–", "Cuts within 0.15 s of a spoken word's start, and what random cuts would give"]
  ] : img ? [["Size", `${img.width} × ${img.height}`], ["Light", `mean ${pct(img.light.luma)} · dark ${pct(img.light.dark)} of the frame`]] : [];
  const notes = [...S?.notes ?? [], ...it?.ref.error ? [`${it.tag} could not be measured: ${it.ref.error}`] : [], ...it?.ref.notes ?? [], ...R?.notes ?? []];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-scroll sd-study", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel pad sd-study-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "What the app measured" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: S ? `${S.summary.videos} video${S.summary.videos === 1 ? "" : "s"}, ${S.summary.images} picture${S.summary.images === 1 ? "" : "s"} · ${S.summary.shots} shots in ${S.summary.seconds} s${S.summary.cutsPerMin != null ? ` · ${S.summary.cutsPerMin} cuts/min` : ""} · measured in ${Math.max(1, Math.round(S.ms / 1e3))} s` : view.measurable ? 'Not measured yet: "Study the references" measures them first, or Measure only.' : "None of the references is a picture or a video." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        view.measurable > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-measure", onClick: onMeasure, disabled: busy || studying, title: "Cuts, shot lengths, contact sheets, colours, loudness, pauses and (with a transcriber) words: no Claude", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13 }),
          S ? view.stale ? "Measure again (references changed)" : "Measure again" : "Measure only"
        ] })
      ] }),
      studying && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-study-prog", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": p?.total || 1, "aria-valuenow": p?.done ?? 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: p?.total ? `${p.done / p.total * 100}%` : "35%" }, className: p?.total ? "" : "ind" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: p ? `${p.what}${p.total ? ` ${p.done}/${p.total}` : ""}` : "Starting…" })
      ] }),
      notes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "sd-study-notes small", children: notes.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
        n
      ] }, i)) }),
      S && S.summary.palette.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Swatches, { list: S.summary.palette, label: "All references" })
    ] }),
    items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl tiny sd-study-tabs", role: "tablist", "aria-label": "References", children: items.map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": x === it, className: x === it ? "on" : "", onClick: () => setSel(i), children: x.name }, x.key)) }),
    it && (R || img) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-study-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "sd-study-stats", "aria-label": `Numbers of ${it.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map(([k, v, t]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { title: t, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: v })
      ] }, k)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-study-cols", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Swatches, { list: (R ?? img).palette, label: "Palette" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Swatches, { list: (R ?? img).accents, label: "Accents" }),
        img?.url && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sd-study-img", onClick: () => setBig({ url: img.url, title: it.name }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img.url, alt: "" }) })
      ] })
    ] }),
    R && R.sheets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sd-study-sec", "aria-label": "Contact sheets", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
        "Contact sheets ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "one frame per shot, 24 to a sheet: click to enlarge" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-sheets", children: R.sheets.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "sd-sheet", onClick: () => s.url && setBig({ url: s.url, title: `${it.name}: shots ${s.from}-${s.to}` }), children: [
        s.url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.url, alt: `Shots ${s.from} to ${s.to}`, loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
          "Shots ",
          s.from,
          "–",
          s.to
        ] })
      ] }, s.file)) })
    ] }),
    R && R.shots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sd-study-sec", "aria-label": "Shots", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
        "Shots ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "click one for its frame and its motion (12 frames a second)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-shots", children: R.shots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `sd-shot ${R.height > R.width ? "tall" : ""}`,
          title: `Shot ${s.i + 1} at ${fmtClock(s.start)}, ${s.len} s`,
          onClick: () => s.url && setBig({ url: s.url, title: `${it.name}: shot ${s.i + 1} at ${fmtClock(s.start)} (${s.len} s)`, motion: s.motionUrl }),
          children: [
            s.url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.url, alt: "", loading: "lazy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: s.hex } }),
              s.len.toFixed(1),
              " s"
            ] })
          ]
        },
        s.i
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sd-study-sec sd-analysis", "aria-label": "The analysis", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
        "reference/ANALYSIS.md ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: st.gate.ok ? "filled in" : "Claude writes it from these numbers and sheets" })
      ] }),
      view.analysis ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Md, { text: view.analysis }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "Not written yet." })
    ] }),
    big && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: big.title, onClose: () => setBig(null), wide: true, className: "sd-big", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-big-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "sd-big-img", src: big.url, alt: "" }),
      big.motion && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "small sd-big-cap", children: "Its first second, 12 frames a second" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "sd-big-img", src: big.motion, alt: "Motion strip" })
      ] })
    ] }) })
  ] });
}
const fmtClock = (s) => {
  const m = Math.floor(s / 60), x = s - m * 60;
  return `${m}:${x < 10 ? "0" : ""}${x.toFixed(1)}`;
};
function IssueRow({ i, base, busy, onSeek, onFix, onStatus }) {
  const w = i.where ?? {}, where = [w.view, w.aspect, typeof w.t === "number" ? fmtT(w.t) : null, w.element].filter(Boolean).join(" · ");
  const SRC = { check: ["Check", ShieldCheck], opus: ["Claude", Bot], user: ["You", User], critic: ["Critic", ScanEye] }, [srcName, SrcIc] = SRC[i.source] ?? SRC.check;
  const rejected = i.source === "critic" && i.status === "wontfix" && !!i.lesson;
  const isOpenI = ["open", "reopened"].includes(i.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sd-issue sev-${i.severity} st-${i.status}`, "data-issue": i.id, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "sd-issue-main", onClick: onSeek, title: "Show it in the preview", children: [
      i.thumb && base ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "sd-issue-thumb", src: `${base}${i.thumb}`, alt: "", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-issue-thumb none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SrcIc, { size: 15 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow sd-issue-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-issue-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `sd-src s-${i.source}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SrcIc, { size: 11 }),
            srcName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sd-sev sev-${i.severity}`, children: i.severity }),
          i.status === "fixing" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-stat", children: "Fixing…" }),
          i.status === "verify" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-stat v", children: "Fixed? Check it" }),
          i.status === "reopened" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-stat r", children: "Back" }),
          i.status === "fixed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-stat ok", children: [
            "fixed",
            i.fixedIn ? ` in ${i.fixedIn}` : ""
          ] }),
          i.status === "wontfix" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-stat", children: rejected ? "rejected by Claude" : "not an issue" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "sd-issue-title", children: i.title }),
        where && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "sd-where", children: where }),
        i.meaning && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "sd-meaning", children: [
          i.source === "critic" ? /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Evidence: " }) : null,
          i.meaning
        ] }),
        i.fix && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "sd-fix", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Fix:" }),
          " ",
          i.fix
        ] }),
        i.lesson && i.status !== "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "sd-fix", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: rejected ? "Why Claude rejects it:" : "Lesson:" }),
          " ",
          i.lesson
        ] })
      ] })
    ] }),
    (isOpenI || i.status === "verify" || i.status === "fixed" || i.status === "wontfix") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-issue-actions", children: [
      isOpenI && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny primary", onClick: onFix, disabled: busy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 11 }),
        "Fix it"
      ] }),
      isOpenI && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny", onClick: () => onStatus("wontfix"), children: "Not an issue" }),
      i.status === "verify" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny primary", onClick: () => onStatus("fixed"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
        "OK"
      ] }),
      i.status === "verify" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny", onClick: () => onStatus("reopened"), children: "Not fixed" }),
      (i.status === "fixed" || i.status === "wontfix") && i.source !== "check" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny ghost", onClick: () => onStatus("reopened"), children: rejected ? "Reopen (fix it anyway)" : "Reopen" })
    ] })
  ] });
}
function BriefSummary({ st, styleName, projectId, onRefs, onSaved }) {
  const { toast } = useApp();
  const S = st.studio;
  const [desc, setDesc] = reactExports.useState(S.description), [cap, setCap] = reactExports.useState(S.imageCap);
  const flow = useFlowImages();
  const dirty = desc !== S.description || cap !== S.imageCap;
  const save = () => api.studioSetBrief(projectId, { description: desc, imageCap: cap }).then(() => {
    onSaved();
    toast("Brief saved.");
  }).catch((e) => toast(e.message, "bad"));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel pad sd-brief", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "sd-facts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: S.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: S.mode === "look" ? "Look for" : S.mode === "derived" ? "On top of" : "Starts from" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: S.mode === "scratch" ? `The plain starter engine (${(S.dim ?? "2d").toUpperCase()})` : styleName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Frames" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: S.aspects.join(" and ") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-brief-desc", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "sd-brief-desc", className: "input", rows: 4, value: desc, onChange: (e) => setDesc(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "References" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefButton, { projectId, onClick: onRefs }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "Images and videos (for a video, Pick parts chooses the seconds Claude studies). Mention one in the chat as @vid1." })
      ] })
    ] }),
    !flow && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-brief-cap", children: "Picture cap" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CapInput, { id: "sd-brief-cap", value: cap, onChange: setCap }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
          "at most, about ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
            "$",
            (cap * IMAGE_COST).toFixed(2)
          ] }),
          " on your image account."
        ] })
      ] })
    ] }),
    dirty && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: () => {
        setDesc(S.description);
        setCap(S.imageCap);
      }, children: "Undo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small primary", onClick: save, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13 }),
        "Save brief"
      ] })
    ] })
  ] });
}
function SavePanel({ st, projectId, styleName, pic, tall, onSaved, onNewProject, onStyles }) {
  const { toast } = useApp();
  const S = st.studio;
  const [name, setName] = reactExports.useState(S.saved?.name ?? S.name), [desc, setDesc] = reactExports.useState(S.description), [busy, setBusy] = reactExports.useState(false);
  const save = async () => {
    setBusy(true);
    try {
      const r = await api.studioSaveLook(projectId, { name: name.trim(), description: desc.trim() });
      toast(`Saved "${r.name}" as a look for ${r.styleName}.`);
      onSaved();
    } catch (e) {
      toast(String(e.message), "bad");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel pad sd-brief sd-save", children: [
    S.saved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-saved", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          'Saved as "',
          S.saved.name,
          '" for ',
          styleName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small", children: "It is in New project, the editor's Look panel and Routines, marked as yours. Saving again replaces it with what the workspace has now." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 8, marginTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: onNewProject, children: "New project with it" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: onStyles, children: "See it in Styles" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sd-save-grid ${tall ? "tall" : ""}`, children: [
      pic ? /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "sd-save-pic", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pic, alt: "The look's preview picture" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("figcaption", { className: "small", children: "Its preview picture (from the latest version)" })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-look-name", children: "Look name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "sd-look-name", className: "input", value: name, maxLength: 60, onChange: (e) => setName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-look-desc", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "sd-look-desc", className: "input", rows: 3, value: desc, onChange: (e) => setDesc(e.target.value) })
        ] }),
        S.look && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-look-settings", "aria-label": "What the look changes", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "What it changes" }),
          flat(S.look.settings).map(([k, x]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip look", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: k }),
            " ",
            JSON.stringify(x)
          ] }, k))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small", children: [
      "The app checks the settings against ",
      styleName,
      " before saving. Its notes (skill/LOOK.md) and the lessons of every fixed issue go with it, so Claude follows them in every video of this look."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sd-savelook", onClick: save, disabled: busy || !name.trim(), children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
        S.saved ? "Save again" : "Save look"
      ] })
    ] })
  ] }) });
}
const midOf = (s) => s.t0 + (s.t1 - s.t0) / 2;
const SEV_ORDER = ["high", "medium", "low"];
function HeroFrames({ st, ver, aspect, projectId, issues, onChanged, onShow }) {
  const { toast } = useApp();
  const S = st.studio, r = ver.renders?.[aspect], tall = aspect === "9:16";
  const views = Object.keys(S.views).filter((n) => /^hero/i.test(n) && !S.views[n].expect);
  const cards = views.flatMap((view) => {
    const shots = r?.shots?.[view] ?? [], fr = (r?.frames ?? []).filter((f) => f.view === view);
    const ks = shots.length ? shots.map((_, k) => k) : [...new Set(fr.map((f) => f.shot ?? 0))];
    return ks.map((k) => {
      const s = shots[k], m = s ? midOf(s) : null, f = fr.filter((x) => x.shot === k).sort((a, b) => m == null ? a.t - b.t : Math.abs(a.t - m) - Math.abs(b.t - m))[0];
      return { view, k, name: (s?.name ?? "").replace(/^(?:(?:kit|hero|sample)\s*)?\d+[a-z]?\s*[:.-]\s*/i, "").replace(/^Shot \d+$/, ""), f };
    }).filter((x) => x.f);
  });
  const [note, setNote] = reactExports.useState(null);
  const comment = async (c) => {
    if (!note?.text.trim()) return;
    try {
      await api.studioIssueAdd(projectId, { title: note.text.trim().slice(0, 200), severity: "medium", where: { view: c.view, aspect, t: c.f.t, shot: c.k, element: c.name || `hero ${c.k + 1}` }, thumb: c.f.file });
      setNote(null);
      onChanged();
      toast("Your comment is an issue now: Claude fixes it in its next turn (or press Fix it).");
    } catch (e) {
      toast(String(e.message), "bad");
    }
  };
  if (!cards.length) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-matchview empty", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 22, strokeWidth: 1.5 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
      "No hero frames in v",
      ver.v,
      " (",
      aspect,
      ")"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Run the stage: Claude writes the style guide and scenes/hero.js; the app renders its three shots in every frame." })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-gallery sd-hero", "aria-label": "Hero frames", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-gallery-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        "Your first look at ",
        S.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
        "v",
        ver.v,
        " · ",
        aspect,
        " · ",
        cards.length,
        " hero frame",
        cards.length === 1 ? "" : "s",
        ". Approve the direction below, or comment on a frame: it becomes an issue Claude fixes."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sd-hero-grid ${tall ? "tall" : ""}`, children: cards.map((c) => {
      const key = `${c.view}#${c.k}`, on2 = issues.filter((i) => ["open", "reopened", "fixing", "verify"].includes(i.status) && i.where?.view === c.view && i.where.shot === c.k && (!i.where.aspect || i.where.aspect === aspect));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "sd-hero-card", "data-hero": c.k, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sd-hero-img", onClick: () => onShow(c.f.t, aspect), title: "Show this moment in the live preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.f.url, alt: `Hero frame ${c.k + 1}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", style: { gap: 6, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "ellipsis", children: [
              c.k + 1,
              ". ",
              c.name || `Hero frame ${c.k + 1}`
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
            on2.length ? on2.sort((a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity)).slice(0, 2).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sd-chip ${i.severity === "high" ? "bad" : "warn"}`, title: i.title, children: i.check ? i.check.toUpperCase() : i.source === "user" ? "YOU" : "ISSUE" }, i.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip ok", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }),
              "Clean"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-hero-comment", onClick: () => setNote(note?.key === key ? null : { key, text: "" }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { size: 11 }),
              "Comment"
            ] })
          ] }),
          note?.key === key && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row sd-hero-note", style: { gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input compact grow", autoFocus: true, "aria-label": "Your comment on this frame", value: note.text, maxLength: 200, placeholder: "What should change? e.g. the title type is too thin", onChange: (e) => setNote({ key, text: e.target.value }), onKeyDown: (e) => {
              if (e.key === "Enter") comment(c);
              if (e.key === "Escape") setNote(null);
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny primary", onClick: () => comment(c), disabled: !note.text.trim(), children: "Add" })
          ] })
        ] })
      ] }, key);
    }) })
  ] });
}
function KitGallery({ st, aspect, projectId, busy, onChanged, onShow }) {
  const { toast } = useApp();
  const els = st.kit ?? [], tall = aspect === "9:16", ok = els.filter((e) => e.mark?.status === "approved").length;
  const [flag, setFlag] = reactExports.useState(null), [working, setWorking] = reactExports.useState(false);
  const say = (e) => toast(String(e?.message ?? e), "bad");
  const mark = async (el, status, note) => {
    try {
      await api.studioKitMark(projectId, el.key, status, note);
      setFlag(null);
      onChanged();
    } catch (e) {
      say(e);
    }
  };
  const clean = els.filter((e) => !e.issues.length && e.mark?.status !== "approved" && e.mark?.status !== "flagged");
  const approveClean = async () => {
    setWorking(true);
    try {
      for (const e of clean) await api.studioKitMark(projectId, e.key, "approved");
      onChanged();
    } catch (e) {
      say(e);
    } finally {
      setWorking(false);
    }
  };
  if (!els.length) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-matchview empty", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 22, strokeWidth: 1.5 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "No kit elements yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Run the stage: Claude builds every element of the style and shows each one alone in scenes/kit*.js (one shot per element). They show here to approve." })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-gallery sd-kit", "aria-label": "Kit gallery", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-gallery-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        ok,
        " of ",
        els.length,
        " approved"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
        "Each element alone, at the middle of its kit shot (",
        aspect,
        "). Approve it, or Flag what is wrong: the flag is an issue Claude fixes."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      clean.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-kit-approveclean", onClick: approveClean, disabled: working || busy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
        "Approve the ",
        clean.length,
        " clean one",
        clean.length === 1 ? "" : "s"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sd-kit-grid ${tall ? "tall" : ""}`, children: els.map((el) => {
      const f = el.frames[aspect], m = el.mark?.status;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: `sd-kit-card ${m ? `m-${m}` : ""}`, "data-kit": el.key, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sd-kit-img", onClick: () => onShow(el), title: "Show it in the live preview", children: f ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: f.url, alt: el.name, loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
          "no frame in ",
          aspect
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", style: { gap: 6, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "ellipsis", title: el.name, children: el.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
            m === "approved" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip ok", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
              "Approved"
            ] }) : m === "flagged" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip bad", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 11 }),
              "Flagged"
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-kit-checks", children: el.issues.length ? el.issues.slice(0, 3).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sd-chip ${i.severity === "high" ? "bad" : "warn"}`, title: i.title, children: i.check ? i.check.toUpperCase() : i.source === "user" ? "Your flag" : "Issue" }, i.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-chip ok", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }),
            "Checks clean"
          ] }) }),
          flag?.key === el.key ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input compact grow", autoFocus: true, "aria-label": `What is wrong with ${el.name}`, value: flag.text, maxLength: 200, placeholder: "What is wrong? e.g. the outline is too thin", onChange: (e) => setFlag({ key: el.key, text: e.target.value }), onKeyDown: (e) => {
              if (e.key === "Enter") mark(el, "flagged", flag.text);
              if (e.key === "Escape") setFlag(null);
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny danger sd-kit-flaggo", onClick: () => mark(el, "flagged", flag.text), children: "Flag" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row sd-kit-actions", style: { gap: 6 }, children: [
            m !== "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny primary sd-kit-approve", onClick: () => mark(el, "approved"), disabled: busy, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
              "Approve"
            ] }),
            m !== "flagged" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-kit-flag", onClick: () => setFlag({ key: el.key, text: "" }), disabled: busy, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 11 }),
              "Flag…"
            ] }),
            m && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny ghost sd-kit-undo", onClick: () => mark(el, null), disabled: busy, children: "Undo" })
          ] })
        ] })
      ] }, el.key);
    }) })
  ] });
}
function PublishPanel({ st, projectId, busy, onDone, onNewProject, onStyles, onIssues }) {
  const { toast } = useApp();
  const S = st.studio, run = st.publish ?? null, running = run?.status === "running";
  const [going, setGoing] = reactExports.useState(false);
  const publish = async () => {
    setGoing(true);
    try {
      const r = await api.studioPublish(projectId);
      if (r.status === "done") toast(`Published "${r.result?.name}" v${r.result?.version}: it is in Your styles everywhere.`);
      else toast(r.error ?? "Not published: see the checklist.", "bad");
      onDone();
    } catch (e) {
      toast(String(e.message), "bad");
    } finally {
      setGoing(false);
    }
  };
  const IC = { wait: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { size: 15, className: "dim" }), running: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }), ok: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }), fail: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 15 }), skip: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { size: 15, className: "dim" }) };
  const failed = run?.items.filter((i) => i.status === "fail") ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel pad sd-brief sd-pub", "aria-label": "Publish", children: [
    S.published && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-saved", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          'Published as "',
          S.published.name,
          '" v',
          S.published.version
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small", children: [
          "It is under Your styles in New project, Routines and the Styles page. Publishing again from this workspace updates it (v",
          S.published.version + 1,
          ") and projects in it are offered Update engine.",
          run?.harvest === "queued" || run?.harvest === "running" ? " The Library is learning from it in the background." : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 8, marginTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: onNewProject, children: "New project with it" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: onStyles, children: "See it in Styles" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10, marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "The publish checklist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: running ? "Running…" : run ? `${run.status === "done" ? "All green" : `${failed.length} to fix`} · ${new Date(run.at).toLocaleString()} · ${Math.max(1, Math.round(run.ms / 1e3))} s` : "Not run yet: Publish runs it." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "sd-pub-list", children: [
      (run?.items ?? []).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `sd-pub-item s-${i.status}`, "data-item": i.id, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-pub-ic", children: IC[i.status] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow col", style: { gap: 2, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: i.label }),
          i.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "sd-pub-detail", children: i.detail }),
          i.status === "fail" && i.fix && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "sd-fix", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "How to fix:" }),
            " ",
            i.fix
          ] })
        ] })
      ] }, i.id)),
      !run && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "sd-pub-item s-wait", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-pub-ic", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { size: 15, className: "dim" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow small", children: "Every earlier stage again, style.json, the engine's exports and banned calls, each frame loading and exporting 5 s, no high issue open, the must-fail scenes, the looks, the preview video." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      failed.some((i) => i.id === "issues" || i.id.startsWith("aspect:")) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: onIssues, children: "Open Review" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small dim sd-publish-why", children: STYLES_MOVED }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sd-publish", onClick: publish, disabled: true, title: STYLES_MOVED, children: [
        going || running ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 15 }),
        S.published ? `Publish again (v${S.published.version + 1})` : "Publish"
      ] })
    ] })
  ] }) });
}
function MatchView({ ver, sel, setSel, hasTargets, busy, onMatchNow }) {
  const [kind, setKind] = reactExports.useState("side");
  const list = ver?.match?.targets ?? [], cur = list.find((x) => x.id === sel) ?? list[0];
  if (!ver || !cur) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-matchview empty", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 22, strokeWidth: 1.5 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: !hasTargets ? "No target frames yet" : ver ? `v${ver.v} has no overlays yet` : "No version yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: !hasTargets ? "Add the frames the style must match below (from your references, an image, or made from the notes). Every version is then laid over them." : "Every new version is matched to the targets. Match this one now:" }),
    hasTargets && ver && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small sd-matchnow", onClick: onMatchNow, disabled: busy, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13 }),
      "Match v",
      ver.v,
      " now"
    ] }),
    !!ver?.match?.errors.length && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "sd-match-err", children: ver.match.errors.join(" · ") })
  ] });
  const tall = cur.aspect === "9:16";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-matchview", "aria-label": `Overlays of ${cur.id} in v${ver.v}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-matchview-bar", children: [
      list.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl tiny", role: "radiogroup", "aria-label": "Target", children: list.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": x.id === cur.id, className: x.id === cur.id ? "on" : "", onClick: () => setSel(x.id), children: x.id }, x.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl tiny sd-matchkind", role: "radiogroup", "aria-label": "Overlay", children: MATCH_KINDS.map(([k, l, tip]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": kind === k, className: kind === k ? "on" : "", title: tip, onClick: () => setKind(k), children: l }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
        "v",
        ver.v,
        " · ",
        cur.view,
        " · ",
        cur.aspect,
        " · ",
        cur.t.toFixed(1),
        " s · ",
        Math.round(cur.diff * 100),
        "% different",
        ver.score ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · score ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: ver.score.value })
        ] }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sd-matchview-img ${kind === "crops" ? "crops" : ""} ${kind === "colours" ? "colours" : ""} ${tall ? "tall" : ""}`, children: kind === "colours" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RegionTable, { regions: cur.regions }) : kind === "crops" ? cur.crops.map((c, k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.url, alt: `Crop ${k + 1}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { children: [
        c.why === "centre" ? "The centre" : "Where they differ most",
        " · target | render"
      ] })
    ] }, c.file)) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cur.urls[kind], alt: MATCH_KINDS.find((m) => m[0] === kind)?.[2] }) }),
    (ver.score?.summary || !!ver.match?.errors.length) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-matchview-foot small", children: [
      ver.score?.summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanEye, { size: 12 }),
        " ",
        ver.score.summary
      ] }),
      !!ver.match?.errors.length && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-match-err", children: ver.match.errors.join(" · ") })
    ] })
  ] });
}
function NumIn({ value, min, max, step = 1, label, onCommit, disabled }) {
  const [s, setS] = reactExports.useState(String(value));
  reactExports.useEffect(() => {
    setS(String(value));
  }, [value]);
  const commit = () => {
    const n = +s;
    if (s.trim() !== "" && isFinite(n) && n >= min && n <= max && n !== value) onCommit(n);
    else setS(String(value));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      className: "input compact sd-num",
      type: "number",
      "aria-label": label,
      min,
      max,
      step,
      value: s,
      disabled,
      onChange: (e) => setS(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
        if (e.key === "Enter") e.target.blur();
      }
    }
  );
}
const LOOP_IDLE = "The critic (a fresh Claude that only looks) scores the latest version against your targets and notes and files what is off; the loop lets Claude fix, re-checks, and asks it again.";
function loopText(l) {
  if (!l) return LOOP_IDLE;
  const last = (l.lastScore != null ? ` Last score ${l.lastScore} (v${l.lastScoreV}).` : "") + ((l.scores?.length ?? 0) > 1 && ["running", "done", "stopped", "interrupted", "failed"].includes(l.status) ? ` This run: ${l.scores.join(" → ")}.` : "");
  switch (l.status) {
    case "running":
      return `Pass ${l.pass} of ${l.cap}: ${l.phase ? LOOP_PHASE[l.phase] : "starting"}…${last}`;
    case "stopping":
      return "Stopping…";
    case "done":
      return `${l.reason}${last}`;
    case "stopped":
      return `Stopped after pass ${l.pass}.${last}`;
    case "interrupted":
      return `Interrupted at pass ${l.pass} (the app was closed). Resume carries on.${last}`;
    case "failed":
      return `${l.reason}${last}`;
    default:
      return l.lastScore != null ? `Last score ${l.lastScore} (v${l.lastScoreV}). ${LOOP_IDLE}` : LOOP_IDLE;
  }
}
const TARGET_EXT = ["png", "jpg", "jpeg", "webp", "gif", "bmp", "mp4", "mov", "m4v", "webm", "mkv"];
function MatchBar({ projectId, st, targets, loop, view, aspect, getTime, claudeBusy, onChanged, onSeek, onShow }) {
  const { toast } = useApp();
  const S = st.studio, say = (e) => toast(String(e?.message ?? e), "bad");
  const [sel, setSel] = reactExports.useState(null), [refs, setRefs] = reactExports.useState(null), [refT, setRefT] = reactExports.useState({});
  const [gen, setGen] = reactExports.useState(false), [working, setWorking] = reactExports.useState(null);
  const running = !!loop && (loop.status === "running" || loop.status === "stopping"), jobBusy = running || !!loop?.critic, full = targets.length >= 8;
  const canResume = !!loop && ["stopped", "interrupted", "failed"].includes(loop.status) && loop.pass > 0 && loop.pass < loop.cap;
  const viewNames = Object.keys(S.views).filter((n) => !S.views[n].expect && !/^mustfail/i.test(n));
  const cur = targets.find((x) => x.id === sel) ?? null;
  const act = async (what, f, done) => {
    setWorking(what);
    try {
      await f();
      if (done) ;
    } catch (e) {
      say(e);
    } finally {
      setWorking(null);
      onChanged();
    }
  };
  const addFile = () => act("Reading the picture…", async () => {
    const fs = await api.pickFiles("Pick a target frame (an image, or a video: its first frame)", [{ name: "Images and videos", extensions: TARGET_EXT }]);
    for (const f of fs ?? []) {
      const x = await api.studioTargetAdd(projectId, { path: f });
      setSel(x.id);
    }
  });
  const toggleRefs = async () => {
    if (refs) {
      setRefs(null);
      return;
    }
    try {
      setRefs((await api.refsList(projectId)).filter((r) => r.exists && (r.kind === "image" || r.kind === "video")));
    } catch (e) {
      say(e);
    }
  };
  const addRef = (r) => act("Reading the picture…", async () => {
    const t = r.kind === "video" ? +(refT[r.id] ?? r.ranges?.[0]?.start ?? 0) : void 0;
    const x = await api.studioTargetAdd(projectId, { refId: r.id, t });
    setSel(x.id);
    setRefs(null);
  });
  const patch = (id, p) => api.studioTargetUpdate(projectId, id, p).then(onChanged).catch(say);
  const remove = (id) => api.studioTargetRemove(projectId, id).then(() => {
    if (sel === id) setSel(null);
    onChanged();
  }).catch(say);
  const setting = (p) => api.studioMatchSettings(projectId, p).then(onChanged).catch(say);
  const start = (resume) => api.studioLoopStart(projectId, { resume }).then(onChanged).catch(say);
  const stop = () => api.studioLoopStop(projectId).then(onChanged).catch(say);
  const critic = () => act("The critic is judging…", () => api.studioCritic(projectId).then((r) => toast(`The critic scored v${r.v}: ${r.value} (${r.opened} new issue${r.opened === 1 ? "" : "s"}).`)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-match", "aria-label": "Match loop", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-match-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-match-h", title: "The frames the style must match: each one is compared with the version's frame at its view, frame and moment", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 13 }),
        "Targets"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-tg-list", children: [
        targets.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `sd-tg ${x.aspect === "9:16" ? "tall" : ""} ${sel === x.id ? "on" : ""}`,
            "data-target": x.id,
            onClick: () => setSel(sel === x.id ? null : x.id),
            title: `${x.label}
${x.view} · ${x.aspect} · ${x.t.toFixed(1)} s`,
            children: [
              x.url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: x.url, alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-tg-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                x.id,
                " · ",
                x.t.toFixed(1),
                "s"
              ] })
            ]
          },
          x.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-tg-add", onClick: addFile, disabled: !!working || full, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
          "Image…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `btn tiny sd-tg-ref ${refs ? "active" : ""}`, onClick: toggleRefs, disabled: !!working || full, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 11 }),
          "From a reference"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-tg-gen", onClick: () => setGen(true), disabled: !!working || full, title: "Drawn on your image account from the brief and the style's notes (counts against the picture cap)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 11 }),
          "Make some…"
        ] }),
        working && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small row", style: { gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 12 }),
          working
        ] })
      ] })
    ] }),
    refs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-tg-refs", "aria-label": "References", children: [
      !refs.length && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "No image or video references in this workspace yet: add them in the Brief (References)." }),
      refs.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-tg-refrow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-tg-tag", children: r.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis small grow", title: r.path, children: r.label || r.name }),
        r.kind === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "small row", style: { gap: 4 }, children: [
          "at ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input compact sd-num",
              type: "number",
              min: 0,
              step: 0.1,
              "aria-label": `Second of ${r.tag}`,
              value: refT[r.id] ?? String(r.ranges?.[0]?.start ?? 0),
              onChange: (e) => setRefT((m) => ({ ...m, [r.id]: e.target.value }))
            }
          ),
          " s"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => addRef(r), disabled: !!working, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
          "Add"
        ] })
      ] }, r.id))
    ] }),
    cur && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-tg-edit", "aria-label": `Target ${cur.id}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: cur.id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis small sd-tg-label", title: cur.label, children: cur.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", "aria-label": "View", value: cur.view, onChange: (e) => patch(cur.id, { view: e.target.value }), children: viewNames.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n, children: n }, n)) }),
      S.aspects.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", "aria-label": "Frame", value: cur.aspect, onChange: (e) => patch(cur.id, { aspect: e.target.value }), children: S.aspects.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a, children: a }, a)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NumIn, { label: "Seconds", value: cur.t, min: 0, max: S.views[cur.view]?.end ?? 600, step: 0.1, onCommit: (n) => patch(cur.id, { t: n }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "s" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-tg-here", onClick: () => patch(cur.id, { view, aspect, t: +getTime().toFixed(2) }), title: "Match it to the moment the preview shows now", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 11 }),
        "Here (",
        view,
        " ",
        getTime().toFixed(1),
        " s)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny", onClick: () => onSeek(cur), children: "Show" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny", onClick: () => onShow(cur.id), children: "Overlays" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", "aria-label": `Remove ${cur.id}`, title: "Remove this target", onClick: () => remove(cur.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-match-row sd-loop", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-match-h", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 13 }),
        "Run until good"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "small sd-loop-set", children: [
        "score ≥ ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(NumIn, { label: "Score to reach", value: loop?.threshold ?? 8, min: 1, max: 10, step: 0.5, onCommit: (n) => setting({ threshold: n }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "small sd-loop-set", children: [
        "critic every ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(NumIn, { label: "Critic every N passes", value: loop?.every ?? 3, min: 1, max: 20, onCommit: (n) => setting({ every: n }) }),
        " passes"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "small sd-loop-set", children: [
        "at most ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(NumIn, { label: "Pass cap", value: loop?.cap ?? 12, min: 1, max: 60, onCommit: (n) => setting({ cap: n }) }),
        " passes"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "small sd-loop-set", title: "Stop when this many critics in a row score within ±0.5 of each other (more passes rarely help then). 0 = never.", children: [
        "plateau after ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(NumIn, { label: "Plateau: critics in a row within half a point", value: loop?.plateau ?? 3, min: 0, max: 6, onCommit: (n) => setting({ plateau: n }) }),
        " critics"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-critic", onClick: critic, disabled: claudeBusy || jobBusy || !!working, title: "One critic round on the latest version, without the loop", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanEye, { size: 11 }),
        "Run critic"
      ] }),
      running ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny danger sd-loop-stop", onClick: stop, disabled: loop.status === "stopping", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 10 }),
        loop.status === "stopping" ? "Stopping…" : "Stop"
      ] }) : loop?.critic ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny danger sd-loop-stop", onClick: stop, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 10 }),
        "Stop the critic"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        canResume && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny sd-loop-resume", onClick: () => start(true), disabled: claudeBusy, children: [
          "Resume (pass ",
          loop.pass + 1,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny primary sd-loop-start", onClick: () => start(false), disabled: claudeBusy || !!working, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 11 }),
          canResume ? "Start over" : "Run until good"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sd-loop-status small ${loop?.status === "failed" ? "bad" : loop?.status === "done" ? "ok" : ""}`, role: "status", children: loopText(loop) }),
    gen && /* @__PURE__ */ jsxRuntimeExports.jsx(GenerateTargets, { projectId, onClose: () => setGen(false), onDone: onChanged })
  ] });
}
function GenerateTargets({ projectId, onClose, onDone }) {
  const { toast } = useApp();
  const [n, setN] = reactExports.useState(2), [q, setQ] = reactExports.useState(null), [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    api.studioTargetsQuote(projectId, n).then(setQ).catch(() => setQ(null));
  }, [n]);
  const go = async () => {
    setBusy(true);
    try {
      const r = await api.studioTargetsGenerate(projectId, n);
      toast(`Made ${r.length} target frame${r.length === 1 ? "" : "s"}.`);
      onDone();
      onClose();
    } catch (e) {
      toast(String(e?.message ?? e), "bad");
      setBusy(false);
      onDone();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "Make target frames", onClose, className: "sd-gen-modal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body col", style: { gap: 12 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small", children: "The app draws them on your image account from the brief's description and the style's notes, one per shot of the main view. They are ideal frames, not one consistent camera: frames from your own references are better targets when you have them." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sd-gen-n", children: "How many" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "sd-gen-n", className: "input compact", value: n, onChange: (e) => setN(+e.target.value), disabled: busy, children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k, children: k }, k)) })
    ] }),
    q && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sd-quote", children: [
      q.count,
      " picture",
      q.count === 1 ? "" : "s",
      ", about ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        "$",
        q.cost.toFixed(2)
      ] }),
      " on your image account. The picture cap has ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: q.left }),
      " of ",
      q.cap,
      " left."
    ] }),
    q && !q.provider && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sd-gen-warn small", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13 }),
      "No image account is set up: add a Higgsfield or Fal.ai key in Settings > Media > Image generation."
    ] }),
    q && q.provider && !q.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sd-gen-warn small", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13 }),
      "There is nothing to draw them from yet: write the description in the Brief, or fill the style's notes first."
    ] }),
    q && q.provider && q.notes && !q.fits && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sd-gen-warn small", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13 }),
      q.room < q.count ? `Only ${q.room} more target${q.room === 1 ? "" : "s"} fit (8 at most).` : "That is more than the picture cap leaves: raise the cap in the Brief."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onClose, disabled: busy, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary sd-gen-go", onClick: go, disabled: !q || !q.fits || !q.provider || !q.notes || busy, children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 15 }),
        "Make ",
        n,
        " for about $",
        (q?.cost ?? 0).toFixed(2)
      ] })
    ] })
  ] }) });
}
function CompareDialog({ versions, aspects, aspect: a0, view, projectId, busy, onClose, onBack }) {
  const { toast } = useApp();
  const [a, setA] = reactExports.useState(versions[versions.length - 2].v), [b, setB] = reactExports.useState(versions[versions.length - 1].v), [aspect, setAspect] = reactExports.useState(a0);
  const [k, setK] = reactExports.useState(50), [n, setN] = reactExports.useState(0), [sure, setSure] = reactExports.useState(false), [going, setGoing] = reactExports.useState(false);
  const A = versions.find((x) => x.v === a), B = versions.find((x) => x.v === b);
  const fa = A?.renders?.[aspect]?.frames ?? [], fb = B?.renders?.[aspect]?.frames ?? [];
  const pairs = reactExports.useMemo(() => fb.map((f) => ({ b: f, a: fa.find((x) => x.view === f.view && Math.abs(x.t - f.t) < 0.02) })).filter((p2) => p2.a).sort((x, y) => (x.b.view === view ? 0 : 1) - (y.b.view === view ? 0 : 1) || x.b.view.localeCompare(y.b.view) || x.b.t - y.b.t), [a, b, aspect]);
  const p = pairs[Math.min(n, pairs.length - 1)];
  reactExports.useEffect(() => {
    setN(0);
  }, [a, b, aspect]);
  const hasMatch = versions.some((x) => x.match?.targets.length);
  const [tab, setTab] = reactExports.useState("frames"), [mk, setMk] = reactExports.useState("side"), [mt, setMt] = reactExports.useState(null);
  const ma = A?.match?.targets ?? [], mb = B?.match?.targets ?? [], mids = [...new Set([...mb, ...ma].map((x) => x.id))], mid = mt && mids.includes(mt) ? mt : mids[0];
  const scored = versions.filter((x) => x.score);
  const back = async () => {
    if (!sure) {
      setSure(true);
      return;
    }
    setGoing(true);
    try {
      await api.studioRollback(projectId, a);
      toast(`Back to v${a}: its files are restored as a new version. Lessons are kept.`);
      onBack();
    } catch (e) {
      toast(String(e.message), "bad");
      setGoing(false);
      setSure(false);
    }
  };
  const vsel = (val, set, label) => /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", "aria-label": label, value: val, onChange: (e) => set(+e.target.value), children: [...versions].reverse().map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: x.v, children: [
    "v",
    x.v,
    " · ",
    x.label
  ] }, x.v)) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "Compare versions", wide: true, onClose, className: "sd-cmp-modal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body col", style: { gap: 12 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row wrap", style: { gap: 8 }, children: [
      vsel(a, setA, "Before"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: "→" }),
      vsel(b, setB, "After"),
      aspects.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl", role: "radiogroup", "aria-label": "Frame", children: aspects.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": aspect === x, className: aspect === x ? "on" : "", onClick: () => setAspect(x), children: x }, x)) }),
      hasMatch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl sd-cmp-tab", role: "radiogroup", "aria-label": "Compare what", children: ["frames", "match"].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": tab === x, className: tab === x ? "on" : "", onClick: () => setTab(x), children: x === "frames" ? "Frames" : "Match" }, x)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
        "v",
        a,
        ": ",
        A?.open ?? 0,
        " open",
        A?.score ? ` · score ${A.score.value}` : "",
        " · v",
        b,
        ": ",
        B?.open ?? 0,
        " open",
        B?.score ? ` · score ${B.score.value}` : ""
      ] })
    ] }),
    tab === "match" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-cmp-match", "aria-label": "Match", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row wrap", style: { gap: 8 }, children: [
        mids.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl tiny", role: "radiogroup", "aria-label": "Target", children: mids.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": x === mid, className: x === mid ? "on" : "", onClick: () => setMt(x), children: x }, x)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg-ctl tiny", role: "radiogroup", "aria-label": "Overlay", children: MATCH_KINDS.map(([k2, l, tip]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": mk === k2, className: mk === k2 ? "on" : "", title: tip, onClick: () => setMk(k2), children: l }, k2)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-cmp-mcols", children: [[A, a, ma], [B, b, mb]].map(([V, vn, l]) => {
        const x = l.find((y) => y.id === mid);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: x?.aspect === "9:16" ? "tall" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { children: [
            "v",
            vn,
            V?.score ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · score ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: V.score.value })
            ] }) : " · not scored",
            x ? ` · ${Math.round(x.diff * 100)}% different` : ""
          ] }),
          !x ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small sd-cmp-none", children: [
            "No overlays of ",
            mid,
            " in v",
            vn,
            "."
          ] }) : mk === "colours" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RegionTable, { regions: x.regions }) : mk === "crops" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-cmp-crops", children: x.crops.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.url, alt: "", loading: "lazy" }, c.file)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: x.urls[mk], alt: "" })
        ] }, `${vn}-${V?.v}`);
      }) }),
      scored.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-score-hist", "aria-label": "Score history", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "The critic's scores:" }),
        scored.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `sd-chip ${x.v === a || x.v === b ? "look" : ""}`, title: x.score.summary, children: [
          "v",
          x.v,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: x.score.value })
        ] }, x.v))
      ] })
    ] }) : p ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `compare sd-cmp ${aspect === "9:16" ? "tall" : ""}`, "aria-label": "Before and after", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.b.url, alt: `v${b}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.a.url, alt: `v${a}`, style: { clipPath: `inset(0 ${100 - k}% 0 0)` } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { left: `${k}%` } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "l", children: [
          "v",
          a
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "r", children: [
          "v",
          b
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0, max: 100, value: k, onChange: (e) => setK(+e.target.value), "aria-label": "Slide between the two versions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sd-cmp-pairs", children: pairs.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `sd-cmp-pair ${i === n ? "on" : ""} ${aspect === "9:16" ? "tall" : ""}`, onClick: () => setN(i), title: `${q.b.view} at ${fmtT(q.b.t)}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: q.a.url, alt: "", loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: q.b.url, alt: "", loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
          q.b.view,
          " ",
          q.b.t.toFixed(1)
        ] })
      ] }, q.b.file)) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "muted", children: [
      "These two versions have no frames of the same moment in ",
      aspect,
      "."
    ] }),
    A?.renders?.[aspect]?.mp4Url && B?.renders?.[aspect]?.mp4Url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sd-cmp-videos", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: A.renders[aspect].mp4Url, controls: true, muted: true, playsInline: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: B.renders[aspect].mp4Url, controls: true, muted: true, playsInline: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small grow", children: sure ? `The files go back to v${a} (as a new version). Issues fixed after it open again; lessons are kept.` : "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `btn ${sure ? "danger" : ""} sd-rollback`, onClick: back, disabled: busy || going, children: [
        going ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { size: 15 }),
        sure ? `Yes, go back to v${a}` : `Go back to v${a}`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn primary", onClick: onClose, children: "Done" })
    ] })
  ] }) });
}
export {
  aspectsOf,
  Studio as default
};
impo