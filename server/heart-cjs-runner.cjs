'use strict';
// The repo root is currently marked ESM for the TypeScript fleet scripts,
// while bin/heart is legacy CommonJS. Evaluate that unchanged CLI in a CommonJS
// wrapper so UI actions still go through the real heart command implementation.
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const cli = path.resolve(__dirname, '..', 'bin', 'heart');
const source = fs.readFileSync(cli, 'utf8').replace(/^#![^\n]*\n/, '');
const localRequire = createRequire(cli);
const execute = new Function('require', 'module', 'exports', '__filename', '__dirname', source);
execute(localRequire, module, module.exports, cli, path.dirname(cli));
