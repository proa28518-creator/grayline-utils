'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('heartApp', { pickFile: kind => ipcRenderer.invoke('heart:pick-file', kind) });
