// STUDY SHELL preload — exposes the exact bridge the original renderer reads:
// window.suite = { invoke, on, pathForFile, platform } and nothing else.
const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("suite", {
  invoke: (ch, ...args) => ipcRenderer.invoke(ch, ...args),
  on: (ch, cb) => {
    const listener = (_event, ...args) => cb(...args);
    ipcRenderer.on(ch, listener);
    return () => ipcRenderer.removeListener(ch, listener);
  },
  pathForFile: (file) => {
    try { return webUtils.getPathForFile(file); } catch { return ""; }
  },
  platform: process.platform,
});
