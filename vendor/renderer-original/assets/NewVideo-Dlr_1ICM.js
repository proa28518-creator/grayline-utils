rt { u as useApp, r as reactExports, bV as startChannel, d as api, j as jsxRuntimeExports, ax as Modal, bW as ChannelField, bX as ChannelLessons, X, av as ImagePlus, S as Spinner } from "./index-wX7YC2th.js";
const IMG = /\.(png|jpe?g|webp)$/i;
function NewVideo({ onClose }) {
  const { go, refreshProjects, toast, newPrefill, channel, listChannel, page, channels } = useApp();
  const prefill = reactExports.useRef(newPrefill).current;
  const [chan, setChan] = reactExports.useState(() => startChannel(prefill, { page, channel, listChannel }));
  const [title, setTitle] = reactExports.useState(prefill?.name ?? "");
  const [idea, setIdea] = reactExports.useState("");
  const [concept, setConcept] = reactExports.useState(prefill?.topic?.trim() ?? "");
  const [thumb, setThumb] = reactExports.useState(null);
  const [over, setOver] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [preview, setPreview] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setPreview(null);
    if (thumb) api.imagePreview(thumb).then(setPreview).catch(() => {
    });
  }, [thumb]);
  const pick = async () => {
    const f = await api.pickFile("Choose a thumbnail image", [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }]);
    if (f) setThumb(f);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (!IMG.test(f.name)) {
      toast("The thumbnail must be a PNG, JPG or WebP image.", "bad");
      return;
    }
    const p = window.suite.pathForFile(f);
    if (p) setThumb(p);
  };
  const create = async () => {
    if (!title.trim()) {
      toast("Give the video a title first.", "bad");
      return;
    }
    setBusy(true);
    try {
      const p = await api.personalCreate({ title, thumbnailIdea: idea, concept, thumbnailFile: thumb, channelId: channels.some((c) => c.id === chan) ? chan : null, ...prefill?.ideaId ? { ideaId: prefill.ideaId } : {} });
      await refreshProjects();
      onClose(true);
      toast(`Planned "${p.name}". Next: drop your footage into the editor.`);
      go("editor", p.id);
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "New video", onClose: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body nv", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "nv-title", children: "Title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "nv-title", className: "input", autoFocus: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. I let Claude edit my videos for a week", onKeyDown: (e) => e.key === "Enter" && !busy && create() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelField, { id: "nv-channel", value: chan, onChange: setChan }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelLessons, { channelId: chan, personal: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "nv-idea", children: "Thumbnail idea" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "nv-idea", className: "input", value: idea, onChange: (e) => setIdea(e.target.value), placeholder: "What the thumbnail shows, e.g. my face, shocked, next to a timeline on fire" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "nv-concept", children: [
        "Core concept ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "nv-concept", className: "input", rows: 3, value: concept, onChange: (e) => setConcept(e.target.value), placeholder: "The one idea the video delivers, the hook, what viewers walk away with." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", style: { marginBottom: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        "Thumbnail image ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: "(optional: you can also make one in Thumbnails)" })
      ] }),
      thumb ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nv-thumb", children: [
        preview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "Thumbnail" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nv-ph" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow ellipsis path", children: thumb }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Remove thumbnail", className: "icon-btn sm", "aria-label": "Remove thumbnail", onClick: () => setThumb(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `drop-zone ${over ? "over" : ""}`, onDragOver: (e) => {
        e.preventDefault();
        setOver(true);
      }, onDragLeave: () => setOver(false), onDrop, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: pick, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 16, strokeWidth: 1.7 }),
          "Choose image…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "or drop it here" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => onClose(), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: create, disabled: busy || !title.trim(), children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 15 }),
        "Plan video"
      ] })
    ] })
  ] }) });
}
export {
  NewVideo as default
};
impo