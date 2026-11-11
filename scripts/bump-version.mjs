#!/usr/bin/env node
// Додає/оновлює ?v=<час> до css/js/data у index.html, щоб браузери не показували закешовану стару версію.
// Запускайте перед кожним комітом: node scripts/bump-version.mjs
import fs from "node:fs";
const f = new URL("../index.html", import.meta.url);
const v = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const html = fs.readFileSync(f, "utf8").replace(/((?:href|src)="(?:css|js|data)\/[^"?]+)(?:\?v=\d+)?"/g, `$1?v=${v}"`);
fs.writeFileSync(f, html); console.log("версія", v);
