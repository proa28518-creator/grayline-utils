import { c as createLucideIcon, u as useApp, r as reactExports, d as api, j as jsxRuntimeExports, S as Spinner, A as Asterisk, G as Globe, z as Film, k as Palette, q as Plus, E as Empty, B as Brain, D as ago, C as Check, H as Toggle, b as Trash, e as confirmAsk } from "./index-wX7YC2th.js";
const __iconData = {
  name: "tv",
  size: 24,
  node: [
    ["path", { d: "m17 2-5 5-5-5", key: "16satq" }],
    ["rect", { width: "20", height: "15", x: "2", y: "7", rx: "2", key: "1e6viu" }]
  ]
};
__iconData.node;
const Tv = createLucideIcon(__iconData);
function Memory() {
  const { toast, projects, setSuggestions } = useApp();
  const [rules, setRules] = reactExports.useState([]);
  const [text, setText] = reactExports.useState("");
  const [scope, setScope] = reactExports.useState("global");
  const [pid, setPid] = reactExports.useState("");
  const [styles, setStyles] = reactExports.useState([]);
  const [channels, setChannels] = reactExports.useState([]);
  const [target, setTarget] = reactExports.useState("");
  reactExports.useEffect(() => {
    api.styles().then((s) => setStyles(s.filter((x) => !x.hidden))).catch(() => {
    });
    api.channels().then(setChannels).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    setTarget(scope === "style" ? styles[0]?.id ?? "" : scope === "channel" ? channels[0]?.id ?? "" : "");
  }, [scope, styles, channels]);
  const targetName = (r) => r.scope === "style" ? styles.find((s) => s.id === r.target)?.name ?? r.target : channels.find((c) => c.id === r.target)?.name ?? "deleted channel";
  const [tab, setTab] = reactExports.useState("all");
  const [learning, setLearning] = reactExports.useState(false);
  const [why, setWhy] = reactExports.useState({});
  const learn = async () => {
    setLearning(true);
    try {
      const r = await api.learnRules();
      setWhy((w) => ({ ...w, ...Object.fromEntries(r.added.map((a) => [a.id, a.because])) }));
      await load();
      setTab("suggested");
      toast(r.added.length ? `Claude read ${r.analysed} edits and suggests ${r.added.length} rule${r.added.length === 1 ? "" : "s"}.` : `Claude read ${r.analysed} edits and found no clear new preference yet.`, r.added.length ? "ok" : "info");
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setLearning(false);
    }
  };
  const load = async () => {
    const r = await api.rules();
    setRules(r);
    setSuggestions(r.filter((x) => x.status === "suggested").length);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  reactExports.useEffect(() => {
    if (!pid && projects[0]) setPid(projects[0].id);
  }, [projects]);
  const add = async () => {
    try {
      await api.addRule({ scope, projectId: pid, target, text });
      setText("");
      load();
      toast("Rule saved. Every new Claude session follows it.");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const list = rules.filter((r) => tab === "all" ? true : tab === "suggested" ? r.status === "suggested" : (tab === "project" ? r.scope !== "global" : r.scope === tab) && r.status === "active");
  const nSug = rules.filter((r) => r.status === "suggested").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page page-enter narrow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Memory" }),
        rules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sub", children: [
          ((n) => `${n} ${n === 1 ? "rule" : "rules"} Claude follows`)(rules.filter((r) => r.status === "active" && r.enabled).length),
          nSug ? ` · ${nSug} suggested` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "actions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: learn, disabled: learning, title: "Claude reads your recent edit requests and proposes rules for what you keep asking for", children: [
        learning ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 15 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Asterisk, { size: 16, strokeWidth: 1.7 }),
        "Learn from my edits"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel pad", style: { marginBottom: 25 }, "aria-label": "Add a rule", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", style: { marginBottom: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rule-text", children: "New rule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "rule-text", className: "input", rows: 2, value: text, onChange: (e) => setText(e.target.value), placeholder: "e.g. Never place the camera behind the character being talked about; frame their face or a 3/4 view." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabs sm", role: "radiogroup", "aria-label": "Scope", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: scope === "global" ? "active" : "", onClick: () => setScope("global"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 13 }),
            "All videos"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: scope === "project" ? "active" : "", onClick: () => setScope("project"), disabled: !projects.length, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 13 }),
            "One project"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: scope === "style" ? "active" : "", onClick: () => setScope("style"), disabled: !styles.length, title: "Every project made in one style follows it", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 }),
            "One style"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: scope === "channel" ? "active" : "", onClick: () => setScope("channel"), disabled: !channels.length, title: "Every project on one channel follows it", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { size: 13 }),
            "One channel"
          ] })
        ] }),
        scope === "project" && /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", style: { width: 240 }, value: pid, onChange: (e) => setPid(e.target.value), "aria-label": "Project", children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id)) }),
        scope === "style" && /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", style: { width: 240 }, value: target, onChange: (e) => setTarget(e.target.value), "aria-label": "Style", children: styles.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id)) }),
        scope === "channel" && /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input compact", style: { width: 240 }, value: target, onChange: (e) => setTarget(e.target.value), "aria-label": "Channel", children: channels.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary small", onClick: add, disabled: !text.trim(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
          "Add rule"
        ] })
      ] })
    ] }),
    rules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toolbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabs", role: "tablist", children: ["all", "global", "project", "suggested"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === t, className: tab === t ? "active" : "", onClick: () => setTab(t), children: t === "suggested" ? `Suggested${nSug ? ` (${nSug})` : ""}` : t[0].toUpperCase() + t.slice(1) }, t)) }) }),
    !list.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Empty,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 20, strokeWidth: 1.7 }),
        title: tab === "suggested" ? "No suggestions waiting" : "No rules yet",
        text: rules.length ? void 0 : "Short preferences Claude follows in every session, like camera framing or text placement."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "panel", style: { padding: "4px 22px" }, children: list.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rule-row ${!r.enabled ? "off" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt", children: r.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", children: [
          r.scope === "global" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 12 }),
            "All videos"
          ] }) : r.scope === "style" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 12 }),
            "Style: ",
            targetName(r)
          ] }) : r.scope === "channel" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { size: 12 }),
            "Channel: ",
            targetName(r)
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 12 }),
            r.project_name ?? "deleted project"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ago(r.created_at) }),
          r.status === "suggested" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            "Suggested by Claude"
          ] })
        ] }),
        why[r.id] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", style: { marginTop: 4 }, children: [
          "Because: ",
          why[r.id]
        ] })
      ] }),
      r.status === "suggested" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: async () => {
          await api.updateRule(r.id, { status: "active" });
          load();
          toast("Rule kept.");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
          "Keep"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small ghost", onClick: async () => {
          await api.deleteRule(r.id);
          load();
        }, children: "Dismiss" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Rule enabled", on: !!r.enabled, onChange: async (v) => {
          await api.updateRule(r.id, { enabled: v });
          load();
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", "aria-label": "Delete rule", title: "Delete this rule", onClick: async () => {
          if (!await confirmAsk({ title: "Delete this rule?", text: `Claude stops following it: "${String(r.text ?? "").slice(0, 140)}"`, ok: "Delete" })) return;
          await api.deleteRule(r.id);
          load();
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 16, strokeWidth: 1.7 }) })
      ] })
    ] }, r.id)) })
  ] });
}
export {
  Memory as default
};
