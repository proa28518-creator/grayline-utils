rt { c as createLucideIcon, u as useApp, i as isStandard, a as usePlan, r as reactExports, o as on, j as jsxRuntimeExports, S as Spinner, A as Asterisk, U as UserRound, C as Check, T as TriangleAlert, F as FlaskConical, W as WandSparkles, b as Trash, d as api, p as premiumMsg, e as confirmAsk, f as offeredLook, g as isOwnStyle, R as React, P as PageHead, h as STYLE_PREVIEW, k as Palette, l as STYLE_PREVIEW_TALL, K as KitActions, I as ImportRuns, m as CustomStyleCard, N as NoCustomStyles, L as LOOK_PREVIEW, n as Lock, q as Plus, s as Copy, t as SlidersHorizontal, v as SettingsControls, w as Save, x as setAt, y as getAt } from "./index-wX7YC2th.js";
import { s as studioCanBuildOn, n as noStudioLookText } from "./stylePackage-BmzKskVp.js";
const __iconData = {
  name: "shuffle",
  size: 24,
  node: [
    ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
    ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
    ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
    ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
    ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
  ]
};
__iconData.node;
const Shuffle = createLucideIcon(__iconData);
const SOURCE = { builtin: "Built in", random: "Random", claude: "Designed by Claude" };
function Characters() {
  const { toast, go, claude, refreshProjects } = useApp();
  const std = isStandard(usePlan());
  const [list, setList] = reactExports.useState(null);
  const [sel, setSel] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(null);
  const [desc, setDesc] = reactExports.useState("");
  const [change, setChange] = reactExports.useState(null);
  const [steps, setSteps] = reactExports.useState({});
  const load = (pick) => api.characters().then((l) => {
    setList(l);
    setSel((s) => pick ?? (s && l.some((c2) => c2.id === s) ? s : l[0]?.id ?? null));
  }).catch((e) => toast(e.message, "bad"));
  reactExports.useEffect(() => {
    load();
    const offs = [
      on("characters:changed", (c2) => {
        load();
        if (c2.status === "ready") toast(`${c2.name} is ready in your characters.`, "ok");
        else if (c2.status === "failed") toast(`${c2.name}: ${String(c2.error ?? "not finished").split("\n")[0]}`, "bad");
      }),
      on("characters:progress", (p) => setSteps((x) => ({ ...x, [p.projectId]: p.step })))
    ];
    return () => offs.forEach((f) => f());
  }, []);
  const c = list?.find((x) => x.id === sel) ?? null;
  const random = async () => {
    setBusy("random");
    try {
      const n = await api.randomCharacter();
      await load(n.id);
      toast(`Meet ${n.name}. Make them the default to use them in new videos.`, "ok");
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(null);
    }
  };
  const create = async () => {
    if (std) return toast(premiumMsg("Designing characters with Claude"));
    if (!claude?.loggedIn) {
      toast("Connect Claude first (Settings): Claude designs the character.", "bad");
      return;
    }
    setBusy("create");
    try {
      const r = await api.createCharacter(desc.trim());
      setDesc("");
      await load(r.character.id);
      refreshProjects();
      toast("Claude is designing your character in a character lab (about 5-15 minutes). It appears here when it is done.", "ok", { label: "Watch", run: () => go("editor", r.projectId) });
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(null);
    }
  };
  const makeDefault = async (id) => {
    try {
      setList(await api.setDefaultCharacter(id));
      toast("Default character set: new videos in this style star them.", "ok");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const refine = async () => {
    if (!c) return;
    if (!claude?.loggedIn) {
      toast("Connect Claude first (Settings).", "bad");
      return;
    }
    setBusy("refine");
    try {
      const pid = await api.refineCharacter(c.id, change ?? "");
      setChange(null);
      refreshProjects();
      go("editor", pid);
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(null);
    }
  };
  const del = async (x) => {
    if (!await confirmAsk({ title: `Delete ${x.name}?`, text: "Videos that already use them keep their copy.", ok: "Delete" })) return;
    try {
      await api.deleteCharacter(x.id);
      await load();
      toast("Character deleted.");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  if (!list) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: "Loading your characters…" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chars page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel pad chars-make", "aria-label": "Make a character", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: random, disabled: !!busy, children: [
          busy === "random" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { size: 15, strokeWidth: 1.8 }),
          "Random character"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small dim", children: "or" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input grow",
            style: { minWidth: 260 },
            value: desc,
            onChange: (e) => setDesc(e.target.value),
            maxLength: 600,
            "aria-label": "Describe a character",
            placeholder: "Describe one, e.g. a retired astronaut with a white beard and a patched flight jacket",
            onKeyDown: (e) => e.key === "Enter" && desc.trim().length >= 3 && !busy && create()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: create, disabled: !!busy || desc.trim().length < 3, children: [
          busy === "create" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 15, strokeWidth: 1.8 }),
          "Design with Claude",
          std && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-pill", children: "Premium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "help", title: "A described character is designed by Claude (Opus) in a character lab and checked in every pose.", children: "Random is instant. Described ones are designed by Claude and arrive here when ready." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chars-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-grid", role: "listbox", "aria-label": "Your characters", children: list.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "option", "aria-selected": ch.id === sel, className: `char-card ${ch.id === sel ? "on" : ""}`, onClick: () => {
        setSel(ch.id);
        setChange(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "char-thumb", children: ch.status === "designing" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 22 }) : ch.thumb ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: ch.thumb, alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { size: 30, strokeWidth: 1.4 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", style: { gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "ellipsis", children: ch.name }),
          ch.default && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge mint", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
            "Default"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "muted", children: ch.status === "designing" ? ch.lab && steps[ch.lab] || "Claude is designing…" : ch.status === "failed" ? "Not finished" : SOURCE[ch.source] })
      ] }, ch.id)) }),
      c && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel pad char-detail", "aria-label": c.name, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-stage", children: c.status === "ready" ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: c.view, title: `${c.name}, live preview` }, `${c.id}-${c.updated}`) : c.status === "designing" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "char-wait", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 26 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.lab && steps[c.lab] || "Claude is designing this character…" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "char-wait", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Not finished" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "char-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge gray", children: SOURCE[c.source] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: c.about }),
          c.prompt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small dim", children: [
            "Asked for: “",
            c.prompt,
            "”"
          ] }),
          c.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small err-text", style: { whiteSpace: "pre-wrap" }, children: c.error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 8, flexWrap: "wrap", marginTop: 6 }, children: [
            c.default ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge mint", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
              "Default for new videos"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary small", disabled: c.status !== "ready", onClick: () => makeDefault(c.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
              "Use as default"
            ] }),
            c.lab && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: () => go("editor", c.lab), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { size: 14, strokeWidth: 1.8 }),
              c.status === "designing" ? "Watch Claude design it" : "Open its lab"
            ] }),
            c.id !== "mo" && c.status !== "designing" && change === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: () => setChange(""), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 14, strokeWidth: 1.8 }),
              "Change with Claude"
            ] }),
            c.id !== "mo" && c.status !== "designing" && !c.default && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small danger", onClick: () => del(c), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 14 }),
              "Delete"
            ] })
          ] }),
          change !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { gap: 8, marginTop: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input grow",
                autoFocus: true,
                value: change,
                onChange: (e) => setChange(e.target.value),
                placeholder: "What should change? e.g. give her a red scarf and curly hair",
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !busy) refine();
                  if (e.key === "Escape") setChange(null);
                },
                "aria-label": "What should change"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary small", onClick: refine, disabled: !!busy, children: [
              busy === "refine" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 14 }),
              "Open lab",
              change.trim() ? " and ask" : ""
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const fmtVal = (c, v) => {
  if (v == null || v === "") return c.type === "color" ? "Style default" : null;
  if (typeof v === "object" && typeof v.width === "number" && typeof v.height === "number") {
    const o = c.options?.find((o2) => String(o2.value) === `${v.width}x${v.height}`);
    return o?.label ?? `${v.width}×${v.height}`;
  }
  if (c.type === "toggle") return v ? "On" : "Off";
  if (c.type === "select") return c.options?.find((o) => String(o.value) === String(v))?.label ?? String(v);
  if (c.type === "color") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sd-ro-color", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: String(v) } }),
    String(v)
  ] });
  if (c.type === "range" && typeof v === "number") return c.fmt === "pct" ? `${Math.round(v * 100)}%` : c.fmt === "deg" ? `${v}°` : c.fmt === "s" ? `${v.toFixed(2)} s` : c.fmt === "x" ? `${v.toFixed(1)}×` : c.fmt === "ppm" ? `${v} a minute` : v.toFixed(Math.max(0, -Math.floor(Math.log10(c.step || 1))));
  return typeof v === "object" ? null : String(v);
};
function LookSummary({ controls, settings }) {
  const rows = controls.map((c) => ({ c, v: fmtVal(c, getAt(settings, c.path) ?? (c.type === "range" ? c.default : void 0)) })).filter((r) => r.v != null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "sd-ro-list", children: rows.map(({ c, v }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: c.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: v })
  ] }, c.path)) });
}
function Presets() {
  const { toast, projects, startStudio } = useApp();
  const std = isStandard(usePlan());
  const newLook = (id) => std ? toast(premiumMsg("The Style Studio")) : startStudio({ mode: "look", target: id });
  const [hoverLook, setHoverLook] = reactExports.useState(null);
  const [group, setGroup] = reactExports.useState("builtin");
  const [all, setAll] = reactExports.useState([]);
  const [styles, setStyles] = reactExports.useState([]);
  const [kit, setKit] = reactExports.useState(null);
  const [styleId, setStyleId] = reactExports.useState("pixel-art");
  const [hoverStyle, setHoverStyle] = reactExports.useState(null);
  const [hoverUp, setHoverUp] = reactExports.useState(false);
  const enterCard = (id, el) => {
    const strip = el.closest(".style-strip"), r = el.getBoundingClientRect(), s2 = strip?.getBoundingClientRect();
    setHoverUp(!!s2 && r.bottom > s2.bottom - 20);
    setHoverStyle(id);
  };
  const list = all.filter((p) => (p.style_id || "pixel-art") === styleId && offeredLook(styles.find((x) => x.id === styleId), p));
  const style = styles.find((x) => x.id === styleId && (group === "custom" ? isOwnStyle(x) : !isOwnStyle(x)));
  const customs = styles.filter((s2) => isOwnStyle(s2) && !s2.missing);
  const loadStyles = () => {
    api.styleKitInfo().then(setKit).catch(() => {
    });
    return api.styles().then((l) => {
      setStyles(l);
      return l;
    });
  };
  reactExports.useEffect(() => {
    loadStyles();
    return on("styles:changed", () => {
      loadStyles();
      api.presets().then(setAll).catch(() => {
      });
    });
  }, []);
  const [sel, setSel] = reactExports.useState("crisp");
  const [draft, setDraft] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("looks");
  const load = async (keep) => {
    const l = await api.presets();
    setAll(l);
    const p = l.find((x) => x.id === (keep ?? sel)) ?? l[0];
    if (p) {
      setSel(p.id);
      setDraft(structuredClone(p));
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const set = (path, v) => setDraft((d) => d ? { ...d, settings: setAt(d.settings, path, v) } : d);
  const dup = async () => {
    if (!draft) return;
    const p = await api.savePreset({ name: draft.name + " copy", description: draft.description, settings: draft.settings, styleId });
    toast("Duplicated. Edit your copy.");
    load(p.id);
  };
  const save = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      await api.savePreset({ id: draft.id, name: draft.name, description: draft.description, settings: draft.settings });
      toast("Preset saved. Apply it to a project from the editor’s Look panel.");
      load(draft.id);
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  };
  const del = async () => {
    if (!draft) return;
    try {
      await api.deletePreset(draft.id);
      toast("Look deleted.");
      load(style?.defaultLook ?? "crisp");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  reactExports.useEffect(() => {
    const st = styles.find((x) => x.id === styleId);
    if (st) setGroup(isOwnStyle(st) ? "custom" : "builtin");
  }, [styleId, styles.length]);
  const lastIn = React.useRef({ builtin: "pixel-art", custom: null });
  const mineIn = (g) => (x) => !x.legacy && !x.hidden && !x.missing && (g === "custom" ? isOwnStyle(x) : !isOwnStyle(x));
  const switchGroup = (g) => {
    if (g === group) return;
    const cur = styles.find((x) => x.id === styleId);
    if (cur) lastIn.current[isOwnStyle(cur) ? "custom" : "builtin"] = cur.id;
    setGroup(g);
    const next = styles.find((x) => x.id === lastIn.current[g] && mineIn(g)(x)) ?? styles.find(mineIn(g));
    if (next) pickStyle(next.id);
    else {
      setStyleId("");
      setDraft(null);
    }
  };
  const pickStyle = (id, from = styles, looks = all) => {
    setStyleId(id);
    const st = from.find((x) => x.id === id), p = looks.find((x) => x.id === st?.defaultLook) ?? looks.find((x) => (x.style_id || "pixel-art") === id);
    if (p) {
      setSel(p.id);
      setDraft(structuredClone(p));
    }
  };
  const afterDelete = async (id) => {
    const l = await loadStyles();
    const next = l.find((x) => x.id !== id && mineIn("custom")(x));
    if (next) pickStyle(next.id, l);
    else {
      setStyleId("");
      setDraft(null);
    }
  };
  reactExports.useEffect(() => {
    if (!styles.length || !all.length) return;
    let want = null;
    try {
      want = sessionStorage.getItem("cz-styles-tab");
      sessionStorage.removeItem("cz-styles-tab");
    } catch {
    }
    if (want === "flat:characters") {
      pickStyle("flat");
      setTab("characters");
    } else if (want?.startsWith("custom:")) {
      const id = want.slice(7);
      setGroup("custom");
      if (styles.some((x) => x.id === id)) pickStyle(id);
      else {
        const f = styles.find(mineIn("custom"));
        if (f) pickStyle(f.id);
        else {
          setStyleId("");
          setDraft(null);
        }
      }
    }
  }, [styles.length, all.length]);
  const hasChars = !!style && (style.id === "flat" || style.base === "flat");
  const s = style ? draft?.settings : void 0, ro = !!draft?.builtin;
  const used = projects.filter((p) => p.preset_id === draft?.id && !p.lab).length;
  const looksOf = (st) => all.filter((p) => (p.style_id || "pixel-art") === st.id && offeredLook(st, p)).length;
  const lookable = !!style && !style.legacy && !style.missing, canLook = lookable && studioCanBuildOn(style);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHead, { title: "Styles", actions: canLook && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "btn primary sd-newlook",
        onClick: () => newLook(style.id),
        "aria-label": `New look for ${style.name}`,
        title: `A look = ${style.name} with your own settings (colours, grade, camera, captions). A style with new elements is made with the Style Kit (Custom tab).`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 15 }),
          "New look for ",
          style.name,
          std && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-pill", children: "Premium" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl style-group", role: "tablist", "aria-label": "Which styles", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": group === "builtin", className: group === "builtin" ? "on" : "", onClick: () => switchGroup("builtin"), children: "Built-in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "tab", "aria-selected": group === "custom", className: group === "custom" ? "on" : "", onClick: () => switchGroup("custom"), children: [
        "Custom",
        customs.length ? ` (${customs.length})` : ""
      ] })
    ] }),
    group === "builtin" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "style-strip", role: "tablist", "aria-label": "Styles", children: styles.filter((st) => (!st.legacy || st.id === styleId) && (!st.hidden || st.id === styleId) && !isOwnStyle(st)).map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "sd-cardwrap",
        onMouseEnter: (e) => enterCard(st.id, e.currentTarget),
        onMouseLeave: () => setHoverStyle((h) => h === st.id ? null : h),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            role: "tab",
            "aria-selected": st.id === styleId,
            className: `style-card ${st.id === styleId ? "on" : ""}`,
            onClick: () => pickStyle(st.id),
            onFocus: (e) => enterCard(st.id, e.currentTarget),
            onBlur: () => setHoverStyle((h) => h === st.id ? null : h),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 16, strokeWidth: 1.7 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: st.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "dim", children: ((n) => `${n} look${n === 1 ? "" : "s"}`)(looksOf(st)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "muted", children: st.tagline }),
              hoverStyle === st.id && (STYLE_PREVIEW[st.id] || st.preview) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `style-preview ${STYLE_PREVIEW_TALL.has(st.id) ? "tall" : ""} ${hoverUp ? "up" : ""}`, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: STYLE_PREVIEW[st.id] || st.preview, autoPlay: true, muted: true, loop: true, playsInline: true }) })
            ]
          }
        )
      },
      st.id
    )) }),
    group === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KitActions, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImportRuns, {}),
      customs.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { margin: "4px 0 10px" }, children: "Your styles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sk-grid", role: "list", "aria-label": "Your styles", children: customs.map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "listitem", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomStyleCard,
          {
            st,
            info: kit?.styles.find((x) => x.id === st.id) ?? null,
            on: st.id === styleId,
            looks: looksOf(st),
            onSelect: () => pickStyle(st.id),
            onNewLook: () => newLook(st.id),
            onDeleted: () => afterDelete(st.id)
          }
        ) }, st.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(NoCustomStyles, {})
    ] }),
    style && group === "builtin" && style.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "sd-about", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { children: [
        "About ",
        style.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: style.description })
    ] }, style.id),
    hasChars && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl look-tabs", role: "tablist", "aria-label": `${style.name} sections`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === "looks", className: tab === "looks" ? "on" : "", onClick: () => setTab("looks"), children: "Looks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === "characters", className: tab === "characters" ? "on" : "", onClick: () => setTab("characters"), children: "Characters" })
    ] }),
    hasChars && tab === "characters" && /* @__PURE__ */ jsxRuntimeExports.jsx(Characters, {}),
    style && !(hasChars && tab === "characters") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sec-title", style: { margin: "0 0 10px" }, children: [
        "Looks in ",
        style.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", style: { padding: 8 }, "aria-label": "Looks", children: [
          list.map((p) => {
            const pv = LOOK_PREVIEW[p.id] ?? (style && isOwnStyle(style) && p.id === style.defaultLook && style.poster ? { video: style.preview ?? void 0, poster: style.poster } : p.preview ? { poster: p.preview } : null);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `preset-item ${sel === p.id ? "on" : ""}`,
                onClick: () => {
                  setSel(p.id);
                  setDraft(structuredClone(p));
                },
                onMouseEnter: () => setHoverLook(p.id),
                onMouseLeave: () => setHoverLook((h) => h === p.id ? null : h),
                children: [
                  pv && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `look-thumb ${pv.tall ? "tall" : ""}`, children: hoverLook === p.id && pv.video ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: pv.video, poster: pv.poster, autoPlay: true, muted: true, loop: true, playsInline: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pv.poster, alt: "" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", children: [
                    p.name,
                    p.origin === "studio" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sd-yours", title: "A look you made in the Style Studio", children: "Yours" }) : p.builtin && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12, className: "dim" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "muted", children: p.description })
                ]
              },
              p.id
            );
          }),
          canLook && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "preset-item custom-look", onClick: () => newLook(style.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, strokeWidth: 2 }),
              "New look",
              std && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-pill", children: "Premium" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "muted", children: "Describe the look you want (with reference images or videos): Claude sets it up in the Style Studio, the app checks it, you save it." })
          ] }),
          lookable && !canLook && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-item sd-nolook", role: "note", "data-no-studio-look": true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 14, strokeWidth: 1.8 }),
              "Your own look"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "muted", children: noStudioLookText(style.name, style.base || style.id, true) })
          ] })
        ] }),
        draft && s && ro ? (
          // a look that can't be changed: what it sets, at a glance, and the one thing to do with it (a copy to edit)
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel pad", "aria-label": "Look settings", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row sd-ro-head", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "ellipsis", children: draft.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "muted", children: [
                  draft.origin === "studio" ? "Made in the Style Studio" : isOwnStyle(style) ? "The style's own look" : "Built-in",
                  " · read-only · ",
                  used ? `${used} project${used === 1 ? "" : "s"}` : "no projects yet"
                ] })
              ] }),
              draft.origin === "studio" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn ghost", onClick: async () => {
                if (await confirmAsk({ title: `Delete the look "${draft.name}"?`, text: `Projects using it keep their settings and move to ${style?.name ?? "the style"}'s default look. Its Studio workspace stays.`, ok: "Delete" })) del();
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 15 }),
                "Delete"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: dup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 15 }),
                "Duplicate to edit"
              ] })
            ] }),
            style && /* @__PURE__ */ jsxRuntimeExports.jsx(LookSummary, { controls: style.controls.filter((c) => c.path !== "format" && c.type !== "figures"), settings: s })
          ] })
        ) : draft && s ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel pad", "aria-label": "Look settings", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", style: { marginBottom: 18 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 18, strokeWidth: 1.7 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "ed-title grow", value: draft.name, disabled: ro, onChange: (e) => setDraft({ ...draft, name: e.target.value }), "aria-label": "Look name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
              used,
              " project",
              used === 1 ? "" : "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", disabled: ro, value: draft.description ?? "", onChange: (e) => setDraft({ ...draft, description: e.target.value }) })
          ] }),
          style && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsControls, { controls: style.controls.filter((c) => c.path !== "format"), settings: s, onChange: (p, v) => !ro && set(p, v), disabled: ro }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
            (!ro || draft.origin === "studio") && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn danger", onClick: async () => {
              if (await confirmAsk({ title: `Delete the look "${draft.name}"?`, text: `Projects using it keep their settings and move to ${style?.name ?? "the style"}'s default look.${draft.origin === "studio" ? " Its Studio workspace stays." : ""}`, ok: "Delete" })) del();
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 15 }),
              "Delete"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: dup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 15 }),
              "Duplicate"
            ] }),
            !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: save, disabled: busy, children: [
              busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
              "Save look"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) })
      ] })
    ] })
  ] });
}
export {
  Presets as default
};
impo