rt { u as useApp, r as reactExports, d as api, o as on, j as jsxRuntimeExports, q as Plus, D as ago, S as Spinner, b as Trash, Y as Clapperboard, dq as Flame, aR as FasterBuilds, ac as Busy, X, dr as Paperclip, ds as ModelPicker, bv as Picker, k as Palette, a9 as Square, e as confirmAsk, dt as CircleAlert, aa as Play, z as Film, a8 as FolderOpen, Q as ListChecks, C as Check, a1 as Image, du as File } from "./index-wX7YC2th.js";
import { S as SendHorizontal, M as Md, T as ToolGroup, F as FileHeadphone } from "./ClaudePanel-D3_P-Q-D.js";
import "./libraryNav-De0opIcL.js";
const fileKindOf = (p) => /\.(png|jpe?g|webp|gif|bmp|tiff?|avif|heic)$/i.test(p) ? "img" : /\.(mp4|mov|webm|mkv|avi|m4v|wmv|mpe?g)$/i.test(p) ? "vid" : /\.(wav|mp3|m4a|aac|flac|ogg|opus|aiff?|wma)$/i.test(p) ? "audio" : "file";
function fileTags(paths) {
  const out = /* @__PURE__ */ new Map(), n = { img: 0, vid: 0, audio: 0, file: 0 };
  for (const p of paths) {
    if (out.has(p)) continue;
    const k = fileKindOf(p);
    out.set(p, `@${k}${++n[k]}`);
  }
  return out;
}
let lastOpen = null;
const drafts = /* @__PURE__ */ new Map();
let draftWho = { model: "", effort: "medium", precise: false, style: "" };
const PRECISE_TIP = "On: before the build, Berserk plans the whole video second by second (every shot, camera move and on-screen element on the narration's words) and the builder follows that plan exactly. Takes a few minutes more. A change counts from your next message; before a conversation starts, the switch is kept for your next new conversation.";
const EXAMPLES = [
  "Make me a 1 minute 3D cartoon short from this audio, and use this track as music",
  "Write and make a 2 minute flat explainer about why cats purr",
  "Look at my last video, tell me what you would fix, then fix it"
];
const FileKindIcon = ({ f }) => {
  const k = fileKindOf(f);
  return k === "audio" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FileHeadphone, { size: 12 }) : k === "img" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 12 }) : k === "vid" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(File, { size: 12 });
};
const Thumb = ({ p }) => {
  const [u, setU] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let live = true;
    api.berserkThumb(p).then((x) => {
      if (live) setU(x);
    }).catch(() => {
    });
    return () => {
      live = false;
    };
  }, [p]);
  return u ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileKindIcon, { f: p });
};
const Tag = ({ f, tags }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(FileKindIcon, { f }),
  tags.get(f) ?? "@file"
] });
function ItemView({ it, onOpen, tags, onContinue, busy }) {
  if (it.k === "cutoff") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-cutoff", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "bz-cutoff-ic" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow", children: it.text }),
    !it.used && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm primary", disabled: busy, onClick: onContinue, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 12 }),
      "Continue"
    ] })
  ] });
  if (it.k === "user") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg user", children: [
    it.text,
    it.files?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-files", children: it.files.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", title: f, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { f, tags }) }, f)) }) : null
  ] });
  if (it.k === "assistant") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg assistant md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Md, { text: it.text }) });
  if (it.k === "tools") return /* @__PURE__ */ jsxRuntimeExports.jsx(ToolGroup, { list: it.list });
  if (it.k === "note") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bz-note ${it.warn ? "warn" : ""}`, children: it.text });
  if (it.k === "error") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg err", children: it.text });
  if (it.k === "frames") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-frames", children: it.frames.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: f.url, alt: f.time != null ? `Frame at ${f.time} seconds` : "A frame of the video" }),
    f.time != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { children: [
      f.time,
      "s"
    ] })
  ] }, i)) });
  if (it.k === "video") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-video", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 15, className: "bz-video-ic" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow ellipsis", title: it.path, children: it.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => onOpen(it.projectId), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { size: 12 }),
      "Open in editor"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => api.reveal(it.path), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 12 }),
      "Show in folder"
    ] })
  ] });
  if (it.k === "passes") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-passes", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-passes-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { size: 13 }),
      it.title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: it.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: r.done ? "done" : "open", children: [
      r.done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: r.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.words })
    ] }, r.label)) })
  ] });
  return null;
}
function Berserk() {
  const { openProject, refreshProjects, toast } = useApp();
  const showProject = async (id) => {
    const all = await refreshProjects();
    if (all && !all.some((p) => p.id === id)) {
      toast("That video is not in Projects any more.");
      return;
    }
    openProject({ id, kind: "faceless" });
  };
  const [list, setList] = reactExports.useState([]);
  const [draft, setDraft] = reactExports.useState(draftWho), [global, setGlobal] = reactExports.useState({ model: null, effort: "medium" });
  const [conv, setConv] = reactExports.useState(null);
  const draftKey = reactExports.useRef(lastOpen ?? "");
  const [text, setText] = reactExports.useState(() => drafts.get(draftKey.current)?.text ?? ""), [files, setFiles] = reactExports.useState(() => drafts.get(draftKey.current)?.files ?? []), [stream, setStream] = reactExports.useState(""), [err, setErr] = reactExports.useState(""), [drag, setDrag] = reactExports.useState(false);
  const scroller = reactExports.useRef(null), field = reactExports.useRef(null), stick = reactExports.useRef(true);
  const openId = conv?.id ?? null;
  const refresh = reactExports.useCallback(() => api.berserkList().then(setList).catch(() => {
  }), []);
  reactExports.useEffect(() => {
    if (text || files.length) drafts.set(draftKey.current, { text, files });
    else drafts.delete(draftKey.current);
  }, [text, files]);
  const open = reactExports.useCallback(async (id) => {
    lastOpen = id;
    if (draftKey.current !== (id ?? "")) {
      draftKey.current = id ?? "";
      const d = drafts.get(draftKey.current);
      setText(d?.text ?? "");
      setFiles(d?.files ?? []);
    }
    setStream("");
    stick.current = true;
    setConv(id ? await api.berserkGet(id).catch(() => null) : null);
  }, []);
  reactExports.useEffect(() => {
    refresh().then(() => {
      if (lastOpen) open(lastOpen);
    });
    api.config().then((c) => setGlobal({ model: c?.claude?.model || null, effort: c?.claude?.effort || "medium" })).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    const off1 = on("berserk:list", () => {
      refresh();
    });
    const off2 = on("berserk:event", (ev) => {
      if (ev.convId !== lastOpen) return;
      if (ev.type === "delta") {
        setStream((s) => s + ev.text);
        return;
      }
      if (ev.type === "delta-end") {
        setStream("");
        return;
      }
      setConv((c) => {
        if (!c || c.id !== ev.convId) return c;
        if (ev.type === "item") {
          const at2 = c.items.findIndex((x) => x.id === ev.item.id), items = [...c.items];
          if (at2 >= 0) items[at2] = ev.item;
          else items.push(ev.item);
          return { ...c, items };
        }
        if (ev.type === "state") return { ...c, busy: ev.busy, turn: ev.turn, job: ev.job };
        if (ev.type === "project") return { ...c, project: ev.project };
        if (ev.type === "title") return { ...c, title: ev.title };
        return c;
      });
    });
    return () => {
      off1();
      off2();
    };
  }, [refresh]);
  reactExports.useEffect(() => {
    const s = scroller.current;
    if (s && stick.current) s.scrollTop = s.scrollHeight;
  }, [conv?.items, stream, conv?.job?.latest]);
  reactExports.useEffect(() => {
    const f = field.current;
    if (f) {
      f.style.height = "auto";
      f.style.height = `${Math.min(f.scrollHeight, 240)}px`;
    }
  }, [text]);
  const go = async () => {
    const t = text.trim();
    if (!t && !files.length) return;
    setErr("");
    try {
      const c = conv ?? await api.berserkNew(draft);
      if (!conv) {
        lastOpen = c.id;
        drafts.delete("");
        draftKey.current = c.id;
        setConv(c);
      }
      setText("");
      setFiles([]);
      stick.current = true;
      await api.berserkSend(c.id, t, files);
      refresh();
    } catch (e) {
      setErr(String(e?.message ?? e));
    }
  };
  const addFiles = (paths) => setFiles((fs) => [.../* @__PURE__ */ new Set([...fs, ...paths.filter(Boolean)])]);
  const pick = async () => {
    const got = await api.pickFiles("Files for Berserk");
    if (got) addFiles(got);
  };
  const dragOff = reactExports.useRef(null);
  const hasFiles = (e) => [...e.dataTransfer.types].includes("Files");
  const dragOver = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!drag) setDrag(true);
    if (dragOff.current) clearTimeout(dragOff.current);
    dragOff.current = setTimeout(() => setDrag(false), 250);
  };
  const takeFiles = async (list2) => {
    const got = [];
    for (const f of list2) {
      let p = "";
      try {
        p = window.suite.pathForFile(f);
      } catch {
        p = "";
      }
      if (!p) {
        try {
          p = await api.berserkAttach(f.name || `pasted.${(f.type.split("/")[1] || "png").replace("jpeg", "jpg")}`, new Uint8Array(await f.arrayBuffer()));
        } catch (e) {
          setErr(String(e?.message ?? e));
        }
      }
      if (p) got.push(p);
    }
    if (got.length) {
      addFiles(got);
      field.current?.focus();
    }
  };
  const drop = (e) => {
    e.preventDefault();
    if (dragOff.current) clearTimeout(dragOff.current);
    setDrag(false);
    void takeFiles([...e.dataTransfer.files]);
  };
  const paste = async (e) => {
    const cd = e.clipboardData, list2 = [...cd.files], text2 = cd.getData("text/plain"), types = [...cd.types];
    if (list2.length) {
      e.preventDefault();
      await takeFiles(list2);
      return;
    }
    if (text2 && !types.includes("Files")) return;
    if (types.includes("Files") || types.some((t) => t.startsWith("image/")) || !text2) {
      e.preventDefault();
      const got = await api.berserkClipboard().catch(() => []);
      if (got.length) {
        addFiles(got);
        return;
      }
      if (types.includes("Files") || types.some((t) => t.startsWith("image/"))) setErr("Nothing on the clipboard could be added. Copy the file or the picture again, or drag it in.");
    }
  };
  const [at, setAt] = reactExports.useState(null), [atIdx, setAtIdx] = reactExports.useState(0);
  const atOf = (el) => {
    const c = el.selectionStart ?? 0, m = /(^|\s)@(\w*)$/.exec(el.value.slice(0, c));
    return m ? { start: c - m[2].length - 1, q: m[2].toLowerCase() } : null;
  };
  const pickAt = (tag) => {
    const el = field.current;
    if (!el || !at) return;
    const end = el.selectionStart ?? at.start, next = text.slice(0, at.start) + tag + " " + text.slice(end), pos = at.start + tag.length + 1;
    setText(next);
    setAt(null);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };
  const tags = reactExports.useMemo(() => fileTags([...(conv?.items ?? []).flatMap((it) => it.k === "user" ? it.files ?? [] : []), ...files]), [conv?.items, files]);
  const atList = reactExports.useMemo(() => at ? [...tags].filter(([, t]) => t.slice(1).toLowerCase().startsWith(at.q)).slice(0, 12) : [], [at, tags]);
  const remove = async (id, title) => {
    if (!await confirmAsk({ title: "Delete this conversation?", text: `"${title}" goes away. The videos it made stay in Projects.`, ok: "Delete", danger: true })) return;
    try {
      await api.berserkDelete(id);
      if (id === openId) open(null);
      refresh();
    } catch (e) {
      setErr(String(e?.message ?? e));
    }
  };
  const pickWho = async (v) => {
    const patch = { ...v.model !== void 0 ? { model: v.model ?? "" } : {}, ...v.effort !== void 0 ? { effort: v.effort ?? "" } : {} };
    if (conv) {
      const got = await api.berserkSet(conv.id, patch);
      setConv((c) => c && c.id === got.id ? { ...c, model: got.model, effort: got.effort } : c);
    } else {
      draftWho = { ...draftWho, ...patch };
      setDraft(draftWho);
    }
  };
  const pickPrecise = async (on2) => {
    try {
      if (conv) {
        const got = await api.berserkSet(conv.id, { precise: on2 });
        setConv((c) => c && c.id === got.id ? { ...c, precise: got.precise } : c);
      } else {
        draftWho = { ...draftWho, precise: on2 };
        setDraft(draftWho);
      }
    } catch (e) {
      setErr(String(e?.message ?? e));
    }
  };
  const [styleList, setStyleList] = reactExports.useState([]);
  reactExports.useEffect(() => {
    api.styles().then(setStyleList).catch(() => {
    });
  }, []);
  const styleOpts = reactExports.useMemo(() => [
    { value: "", label: "Automatic", hint: "Berserk picks the style from what you write" },
    ...styleList.filter((s) => !s.hidden && !s.engineOf && !s.legacy && !s.missing).map((s) => ({ value: s.id, label: s.name, hint: s.tagline, group: s.mine ? "Your styles" : "Built-in" }))
  ], [styleList]);
  const pickStyle = async (id) => {
    try {
      if (conv) {
        const got = await api.berserkSet(conv.id, { style: id });
        setConv((c) => c && c.id === got.id ? { ...c, style: got.style } : c);
      } else {
        draftWho = { ...draftWho, style: id };
        setDraft(draftWho);
      }
    } catch (e) {
      setErr(String(e?.message ?? e));
    }
  };
  const who = conv ?? draft;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bz-side", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn bz-new", onClick: () => {
        open(null);
        field.current?.focus();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
        "New conversation"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-list", role: "list", children: list.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          role: "listitem",
          tabIndex: 0,
          className: `bz-row ${c.id === openId ? "on" : ""}`,
          onClick: () => {
            open(c.id);
            field.current?.focus();
          },
          onKeyDown: (e) => {
            if (e.target === e.currentTarget && e.key === "Enter") {
              open(c.id);
              field.current?.focus();
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow bz-row-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis", title: c.title, children: c.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: ago(c.updatedAt) })
            ] }),
            c.busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm bz-del", "aria-label": `Delete ${c.title}`, title: "Delete", onClick: (e) => {
              e.stopPropagation();
              remove(c.id, c.title);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 13 }) })
          ]
        },
        c.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `bz-main ${drag ? "drag" : ""}`, onDragEnter: dragOver, onDragOver: dragOver, onDrop: drop, children: [
      !!conv?.items.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bz-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis grow", title: conv.title, children: conv.title }),
        conv.project && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => showProject(conv.project.id), title: conv.project.name, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { size: 12 }),
          "Open in editor"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-scroll", ref: scroller, onScroll: (e) => {
        const s = e.currentTarget;
        stick.current = s.scrollHeight - s.scrollTop - s.clientHeight < 80;
      }, children: !conv?.items.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 30, strokeWidth: 1.5 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Berserk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Say what video you want and add your audio, music or references. It sets up the project, directs the Claude that builds the video, checks the frames, mixes the sound and exports. It uses more of your Claude plan than a normal build, because a second Claude is directing." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-mode", "data-bz-mode": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FasterBuilds, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-examples", children: EXAMPLES.map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => {
          setText(x);
          field.current?.focus();
        }, children: x }, x)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-chat", children: [
        conv.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ItemView,
          {
            it,
            onOpen: showProject,
            tags,
            busy: !!conv.busy,
            onContinue: () => {
              setErr("");
              api.berserkContinue(conv.id).catch((e) => setErr(String(e?.message ?? e)));
            }
          },
          it.id
        )),
        stream && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg assistant streaming", children: stream }),
        conv.turn && !stream && !conv.job && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-working", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Busy, { text: "Thinking", size: 12, kind: "orbit" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-composer", children: [
        conv?.job && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-job", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Busy, { text: conv.job.label, since: conv.job.startedAt, size: 12, kind: "orbit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis grow", title: conv.job.latest, children: conv.job.latest })
        ] }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg err", children: err }),
        files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-files", children: files.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chip", title: f, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { f, tags }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": `Remove ${tags.get(f) ?? "this file"}`, onClick: () => setFiles((x) => x.filter((y) => y !== f)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 }) })
        ] }, f)) }),
        at && atList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bz-at", role: "listbox", "aria-label": "Your files", children: atList.map(([p, t], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": i === atIdx,
            className: `bz-at-row ${i === atIdx ? "on" : ""}`,
            title: p,
            onMouseDown: (e) => {
              e.preventDefault();
              pickAt(t);
            },
            onMouseEnter: () => setAtIdx(i),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bz-at-thumb", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { p }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: t }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: fileKindOf(p) === "img" ? "Picture" : fileKindOf(p) === "vid" ? "Video" : fileKindOf(p) === "audio" ? "Audio" : "File" })
            ]
          },
          p
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: field,
            rows: 2,
            value: text,
            "aria-label": "Message to Berserk",
            placeholder: conv?.busy ? "Tell it something while it works" : conv?.items.length ? "What next?" : "What are we making?",
            onChange: (e) => {
              setText(e.target.value);
              setAt(atOf(e.target));
              setAtIdx(0);
            },
            onPaste: paste,
            onBlur: () => setAt(null),
            onKeyUp: (e) => {
              if (!["ArrowUp", "ArrowDown", "Enter", "Tab", "Escape"].includes(e.key)) setAt(atOf(e.currentTarget));
            },
            onClick: (e) => setAt(atOf(e.currentTarget)),
            onKeyDown: (e) => {
              if (at && atList.length) {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setAtIdx((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + atList.length) % atList.length);
                  return;
                }
                if ((e.key === "Enter" || e.key === "Tab") && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  pickAt(atList[Math.min(atIdx, atList.length - 1)][1]);
                  return;
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setAt(null);
                  return;
                }
              }
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                go();
              }
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bz-tools", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", "aria-label": "Add files", title: "Add audio, music or pictures (or drop them here)", onClick: pick, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 15 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ModelPicker,
            {
              model: who.model || null,
              effort: who.effort || null,
              globalModel: global.model,
              globalEffort: global.effort,
              effectiveModel: who.model || global.model,
              effectiveEffort: who.effort || global.effort,
              google: null,
              codex: null,
              onPick: pickWho,
              label: "Berserk's model and effort",
              title: "The model and effort of Berserk itself, the one directing. A change counts from its next message. To choose who builds the video, say it in your message."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "switch", "aria-checked": !!who.precise, className: `bz-precise ${who.precise ? "on" : ""}`, title: PRECISE_TIP, onClick: () => pickPrecise(!who.precise), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `toggle ${who.precise ? "on" : ""}`, "aria-hidden": "true" }),
            "Exact shot plan"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Picker,
            {
              id: "bz-style",
              className: "bz-style",
              value: who.style || "",
              options: styleOpts,
              onChange: pickStyle,
              menuWidth: 300,
              ariaLabel: "Style of the video",
              trigger: (o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bz-style-t", title: "The style Berserk makes the video in. Automatic: it picks from what you write. A style: it always uses that one.", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 }),
                o && o.value ? o.label : "Style: Automatic"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
          conv?.busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: () => api.berserkStop(conv.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 13 }),
            "Stop"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small primary", disabled: !text.trim() && !files.length, onClick: go, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { size: 14 }),
            "Send"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Berserk as default
};
impo