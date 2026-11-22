import { u as useApp, r as reactExports, cf as useMoveToChannel, cg as fold, j as jsxRuntimeExports, q as Plus, ch as I, M as Search, ci as ChannelFilter, E as Empty, cj as Video, ck as VideoCard, a8 as FolderOpen, d as api, b as Trash, cl as ChannelChip, ax as Modal, a4 as isMac } from "./index-wX7YC2th.js";
const TRASH = isMac ? "Trash" : "Recycle Bin";
function Videos() {
  const { projects, refreshProjects, go, setNewProject, toast, projectId, channels, listChannel: channel, setListChannel: setChannel } = useApp();
  const [qy, setQ] = reactExports.useState("");
  const [del, setDel] = reactExports.useState(null);
  const mv = useMoveToChannel();
  reactExports.useEffect(() => {
    refreshProjects();
  }, []);
  const byId = reactExports.useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels]);
  const sel = channels.length && (channel === "none" || byId.has(channel)) ? channel : "all";
  const chOf = (p) => p.channel_id && byId.has(p.channel_id) ? p.channel_id : null;
  const counts = reactExports.useMemo(() => {
    const c = { all: projects.length, none: 0 };
    for (const p of projects) {
      const k = chOf(p) ?? "none";
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [projects, byId]);
  const list = reactExports.useMemo(() => projects.filter((p) => fold(p.name).includes(fold(qy.trim())) && (sel === "all" || (sel === "none" ? !chOf(p) : chOf(p) === sel))), [projects, qy, sel, byId]);
  const remove = async (p, files) => {
    try {
      await api.deleteProject(p.id, files);
      setDel(null);
      if (projectId === p.id) go("projects", null);
      await refreshProjects();
      toast(files ? `Moved to the ${TRASH}. Your footage was not touched.` : "Removed from the Suite. Files kept.");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Videos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sub", children: "Every video you planned: title, thumbnail and edit." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "actions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: () => setNewProject(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { ...I }),
        "New video"
      ] }) })
    ] }),
    projects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "search", style: { maxWidth: 360 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { ...I }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Search videos", value: qy, onChange: (e) => setQ(e.target.value), "aria-label": "Search videos" })
      ] }),
      channels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelFilter, { id: "pv-channel", value: sel, onChange: setChannel, counts })
    ] }),
    !projects.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 28, strokeWidth: 1.7 }), title: "No videos yet", text: "Plan one: the title and thumbnail idea first, your footage next.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: () => setNewProject(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { ...I }),
      "New video"
    ] }) }) : !list.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: sel !== "all" && !qy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      sel === "none" ? "Every video is in a channel." : `No videos in ${byId.get(sel)?.name} yet.`,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link", onClick: () => setChannel("all"), children: "Show every channel" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "No videos match.",
      sel !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn link", onClick: () => setChannel("all"), children: "Look in every channel" })
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "video-grid", children: list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "vc-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCard, { p, onOpen: () => go("editor", p.id) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "vc-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", "aria-label": "Show folder", title: "Show folder", onClick: () => api.open(p.path), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 15, strokeWidth: 1.7 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", "aria-label": "Delete video", title: "Delete", onClick: () => setDel(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 15, strokeWidth: 1.7 }) })
      ] }),
      channels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "vc-ch", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelChip, { c: byId.get(chOf(p) ?? "") ?? null, onClick: (e) => mv.open(e.currentTarget, [p.id], chOf(p), e.detail) }) })
    ] }, p.id)) }),
    mv.ui,
    del && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: `Delete "${del.name}"?`, onClose: () => setDel(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: "Remove the video from Creatorize Suite. Your footage is never deleted: it stays where it is." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setDel(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => remove(del, false), children: "Remove, keep folder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn danger", onClick: () => remove(del, true), children: [
          "Move project to ",
          TRASH
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Videos as default
};
