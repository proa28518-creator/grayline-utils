rt { u as useApp, r as reactExports, j as jsxRuntimeExports, dG as KeyDialog, ax as Modal, av as ImagePlus } from "./index-wX7YC2th.js";
function ImageKeyNotice() {
  const { keyNotice, noticeImageKey, openSettings, toast } = useApp();
  const [adding, setAdding] = reactExports.useState(null);
  if (!keyNotice) return null;
  const close = () => {
    setAdding(null);
    noticeImageKey(null);
  };
  if (adding) return /* @__PURE__ */ jsxRuntimeExports.jsx(
    KeyDialog,
    {
      provider: adding,
      hf: null,
      onClose: () => setAdding(null),
      onSaved: (s) => {
        if (s.hasKey) {
          toast(`${adding === "fal" ? "Fal.ai" : "Higgsfield"} is set up: Claude makes the pictures there. Start again when you're ready.`, "ok");
          close();
        }
      }
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "Set up image generation first", onClose: close, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body col image-key-notice", style: { gap: 12 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 20, strokeWidth: 1.7, style: { flex: "none", marginTop: 2, color: "var(--mint)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, lineHeight: 1.6 }, children: [
        keyNotice,
        " Vox and custom-style videos get their pictures from ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Google Flow" }),
        ", free with your own Flow credits: open it once in Settings and sign in. A ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Higgsfield" }),
        " or ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Fal.ai" }),
        " API key (about a cent per picture) works too."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", style: { margin: 0, fontSize: 13, lineHeight: 1.6 }, children: "Without one, Claude can't make the pictures, and the video would come out with poor stand-ins, so it won't start." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setAdding("fal"), children: "Add Fal.ai key" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setAdding("higgsfield"), children: "Add Higgsfield key" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn primary", onClick: () => {
        close();
        openSettings("image");
      }, children: "Set up Google Flow" })
    ] })
  ] }) });
}
export {
  ImageKeyNotice as default
};
impo