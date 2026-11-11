#!/usr/bin/env node
// Генерує css/tokens.css та tokens/design-tokens.json із data/tokens.js.
// Запуск: node scripts/build-tokens.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "data/tokens.js"), "utf8"), sb);
const T = sb.window.TOKENS;

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const prim = { light: {}, dark: {} };
T.neutral.forEach(([n, l, , d]) => { prim.light[n] = l; prim.dark[n] = d; });
Object.entries(T.scale).forEach(([hue, d]) => STEPS.forEach((s, i) => {
  prim.light[`${hue}/${s}`] = "#" + d.steps[i];
  prim.dark[`${hue}/${s}`] = "#" + ((d.darkOverride && d.darkOverride[s]) || d.steps[9 - i]);
}));
const res = (ref, mode) => (ref[0] === "#" ? ref : prim[mode][ref]);
const cssName = n => "--" + n.toLowerCase().replace(/\//g, "-");

const semantic = { light: {}, dark: {} };
for (const [name, ref] of Object.entries(T.semantic)) {
  semantic.light[name] = res(ref, "light");
  semantic.dark[name] = res(T.semanticDark[name] || ref, "dark");
}
const block = (sel, mode) => {
  const L = [];
  Object.entries(prim[mode]).forEach(([n, v]) => L.push(`  ${cssName("color/" + n)}: ${v};`));
  Object.entries(semantic[mode]).forEach(([n, v]) => L.push(`  ${cssName(n)}: ${v};`));
  (mode === "light" ? T.shadows.map(s => s[1]) : T.shadowsDark).forEach((v, i) => L.push(`  --shadow-${["level-1", "level-2", "input-active", "float-button"][i]}: ${v};`));
  return `${sel} {\n${L.join("\n")}\n}\n`;
};
let css = "/* Згенеровано scripts/build-tokens.mjs з data/tokens.js — не редагуйте вручну. */\n";
css += `:root, [data-theme="light"] {\n  color-scheme: light;\n` + T.spacing.map(([n, v]) => `  --spacing-${n.toLowerCase()}: ${v}px;`).join("\n") + "\n" + T.radius.map(([n, v]) => `  --radius-${n.toLowerCase()}: ${v}px;`).join("\n") + "\n}\n";
css += block(':root, [data-theme="light"]', "light") + block('[data-theme="dark"]', "dark").replace("{\n", "{\n  color-scheme: dark;\n");
fs.writeFileSync(path.join(ROOT, "css/tokens.css"), css);
fs.writeFileSync(path.join(ROOT, "tokens/design-tokens.json"), JSON.stringify({ primitives: prim, semantic, spacing: Object.fromEntries(T.spacing), radius: Object.fromEntries(T.radius.map(r => [r[0], r[1]])) }, null, 1));
console.log("css/tokens.css, tokens/design-tokens.json ·", Object.keys(T.semantic).length, "семантичних токенів");
