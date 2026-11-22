'use strict';
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createHeartServer } = require('../server/server.js');

const repo = path.resolve(__dirname, '..');
function resolveProject(value) {
  const p = path.resolve(repo, value || 'projects/story6-microwave');
  const projects = path.join(repo, 'projects') + path.sep;
  if (!p.startsWith(projects) && !path.isAbsolute(value || '')) throw new Error('Project must be a project name or path under projects/.');
  if (!fs.statSync(p).isDirectory()) throw new Error(`Project directory not found: ${p}`);
  return p;
}
let server;
async function startServer() {
  const projectDir = resolveProject(process.env.HEART_PROJECT);
  const uiDir = path.join(repo, 'ui');
  const requested = Number(process.env.HEART_PORT || 8903);
  try { return await createHeartServer({ projectDir, uiDir, port: requested }); }
  catch (e) { if (e.code !== 'EADDRINUSE') throw e; return createHeartServer({ projectDir, uiDir, port: 0 }); }
}
ipcMain.handle('heart:pick-file', async (_event, kind) => {
  const filters = kind === 'audio' ? [{ name: 'Audio', extensions: ['wav','mp3','m4a','ogg','flac'] }] : kind === 'text' ? [{ name: 'Text', extensions: ['txt','md','json','srt'] }] : [{ name: 'All files', extensions: ['*'] }];
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters });
  return result.canceled || !result.filePaths.length ? null : result.filePaths[0];
});
app.whenReady().then(async () => {
  const running = await startServer(); server = running.server;
  const win = new BrowserWindow({ width: 1360, height: 900, backgroundColor: '#0d1117', webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js') } });
  win.loadURL(`http://127.0.0.1:${running.port}/app/`);
  win.on('closed', () => { if (server) server.close(); app.quit(); });
}).catch(err => { console.error(err); app.quit(); });
app.on('window-all-closed', () => { if (server) server.close(); app.quit(); });
