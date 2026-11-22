import { u as useApp, r as reactExports, j as jsxRuntimeExports, q as Plus, bY as Star, s as Copy, a7 as Pencil, b as Trash, av as ImagePlus, ax as Modal, d as api, e as confirmAsk } from "./index-wX7YC2th.js";
import { L as LayoutHandles, a as LayoutPanel, l as loadBackground, d as drawFrame } from "./PersonalEditor-Bx92rSWj.js";
import "./ClaudePanel-D3_P-Q-D.js";
import "./libraryNav-De0opIcL.js";
function Preview({ settings, w = 480 }) {
  const c = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let alive = true;
    loadBackground(settings.background.image).then((bg) => {
      if (!alive || !c.current) return;
      const d = Math.min(2, devicePixelRatio), W = Math.round(w * d), H = Math.round(W * 9 / 16);
      c.current.width = W;
      c.current.height = H;
      drawFrame(c.current.getContext("2d"), W, H, settings, bg, { mode: "layout", screen: null, cam: null, placeholders: true });
    });
    return () => {
      alive = false;
    };
  }, [settings, w]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: c, className: "ly-canvas", "aria-label": "Layout preview" });
}
function Layouts() {
  const { toast } = useApp();
  const [list, setList] = reactExports.useState([]);
  const [bgs, setBgs] = reactExports.useState([]);
  const [edit, setEdit] = reactExports.useState(null);
  const reload = () => {
    api.layouts().then(setList).catch((e) => toast(e.message, "bad"));
    api.backgrounds().then(setBgs).catch(() => {
    });
  };
  reactExports.useEffect(reload, []);
  const makeDefault = async (p) => {
    await api.setDefaultLayout(p.id);
    reload();
    toast(`New videos start with "${p.name}".`);
  };
  const remove = async (p) => {
    if (!await confirmAsk({ title: `Delete the layout "${p.name}"?`, text: "Videos already using it keep their look.", ok: "Delete" })) return;
    try {
      await api.deleteLayoutPreset(p.id);
      reload();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const save = async () => {
    if (!edit || !edit.name.trim()) return;
    try {
      await api.saveLayoutPreset({ id: edit.id, name: edit.name.trim(), settings: edit.settings });
      setEdit(null);
      reload();
      toast(`Saved "${edit.name.trim()}".`);
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const addBg = async () => {
    const f = await api.pickFile("Add a background image", [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp"] }]);
    if (!f) return;
    try {
      await api.addBackground(f);
      reload();
      toast("Background added. Pick it in any layout.");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const fresh = () => {
    const d = list.find((p) => p.is_default) ?? list[0];
    if (d) setEdit({ id: null, name: "", settings: structuredClone(d.settings) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Layouts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sub", children: "How your Personal Brand videos are framed. The starred one is used for every new video; each video can still change its own in the editor." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: fresh, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
        "New layout"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ly-grid", children: list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ly-card ${p.is_default ? "default" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ly-pic", onClick: () => setEdit({ id: p.builtin ? null : p.id, name: p.builtin ? `${p.name} (mine)` : p.name, settings: structuredClone(p.settings) }), title: p.builtin ? "Copy and change" : "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Preview, { settings: p.settings }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ly-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "ellipsis", children: p.name }),
        p.builtin ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ly-tag", children: "Built-in" }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        p.is_default ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ly-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, fill: "currentColor" }),
          "Default"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => makeDefault(p), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12 }),
          "Make default"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ly-acts", children: p.builtin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny ghost", onClick: () => setEdit({ id: null, name: `${p.name} (mine)`, settings: structuredClone(p.settings) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 12 }),
        "Copy and change"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny ghost", onClick: () => setEdit({ id: p.id, name: p.name, settings: structuredClone(p.settings) }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12 }),
          "Edit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny ghost", onClick: () => remove(p), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 12 }),
          "Delete"
        ] })
      ] }) })
    ] }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { marginTop: 34 }, children: "Backgrounds" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ly-bgs", children: [
      bgs.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(BgTile, { id: b.id, name: b.name, builtin: b.builtin }, b.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "ly-bg add", onClick: addBg, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 18, strokeWidth: 1.6 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add your own" })
      ] })
    ] }),
    edit && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: edit.id ? "Edit layout" : "New layout", onClose: () => setEdit(null), wide: true, className: "ly-modal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ly-edit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ly-edit-stage", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ly-stage", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Preview, { settings: edit.settings, w: 760 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutHandles, { layout: edit.settings, onChange: (s) => setEdit((e) => e && { ...e, settings: s }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", style: { marginTop: 14 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ly-name", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "ly-name", className: "input", value: edit.name, onChange: (e) => setEdit({ ...edit, name: e.target.value }), placeholder: "e.g. Tutorial, big cam", autoFocus: true, onKeyDown: (e) => e.key === "Enter" && save() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ly-edit-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutPanel, { layout: edit.settings, onChange: (s) => setEdit((e) => e && { ...e, settings: s }), hidePresets: true }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setEdit(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn primary", onClick: save, disabled: !edit.name.trim(), children: "Save layout" })
      ] })
    ] }) })
  ] });
}
function BgTile({ id, name, builtin }) {
  const [src, setSrc] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api.backgroundData(id).then(setSrc).catch(() => {
    });
  }, [id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ly-bg", title: name, children: [
    src ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: name }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      name,
      builtin ? "" : " · yours"
    ] })
  ] });
}
export {
  Layouts as default
};
