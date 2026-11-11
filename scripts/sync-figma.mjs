#!/usr/bin/env node
// Синхронізація документації компонентів із Figma → data/component-docs.js + assets/components/**.png
//
// Запуск (токен Figma: Settings → Security → Personal access tokens, доступ File content: Read-only):
//   FIGMA_TOKEN=figd_xxx node scripts/sync-figma.mjs            # усі компоненти
//   FIGMA_TOKEN=figd_xxx node scripts/sync-figma.mjs button tag # лише вибрані (slug)
//   додайте --force щоб перезавантажити вже наявні картинки
// Токен лишається на вашому комп'ютері, у репозиторій не потрапляє.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE_KEY = "RH0E6rqrg2JdJVpG0nGZb4";
const API = "https://api.figma.com/v1";
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.filter(a => !a.startsWith("--"));

export const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fileId = id => id.replace(/[:;]/g, "-");

/* ---------- парсинг дерева Figma (чисті функції, без мережі) ---------- */
const y = n => n.absoluteBoundingBox?.y ?? 0;
const x = n => n.absoluteBoundingBox?.x ?? 0;
const byPos = (a, b) => y(a) - y(b) || x(a) - x(b);
export function texts(n, acc = []) {
  if (n.visible === false) return acc;
  if (n.type === "TEXT") acc.push(n);
  (n.children || []).forEach(c => texts(c, acc));
  return acc;
}
const textBlocks = n => texts(n).sort(byPos).map(t => ({ k: "t", s: Math.round(t.style?.fontSize || 14), w: t.style?.fontWeight || 400, t: t.characters }));
// «текстовий» фрейм: усі діти — тексти або фрейми лише з текстів
export const isTextFrame = f => f.type === "FRAME" && (f.children || []).length > 0 &&
  f.children.every(c => c.type === "TEXT" || (c.type === "FRAME" && (c.children || []).length > 0 && c.children.every(g => g.type === "TEXT")));
export function findSets(n, acc = []) {
  if (n.type === "COMPONENT_SET") acc.push(n);
  else (n.children || []).forEach(c => findSets(c, acc));
  return acc;
}

export function parsePage(page, slug) {
  const frames = (page.children || []).filter(n => n.type === "FRAME");
  const docF = frames.find(f => /documentation/i.test(f.name));
  const compF = frames.find(f => f !== docF && /component/i.test(f.name));
  const imgIds = [];
  const addImg = n => { imgIds.push(n.id); return { k: "i", id: n.id, src: `assets/components/${slug}/${fileId(n.id)}.png`, w: Math.round(n.absoluteBoundingBox?.width || 0), h: Math.round(n.absoluteBoundingBox?.height || 0) }; };
  const doc = { title: "", modified: "", blocks: [], changelog: [] };
  if (docF) {
    const kids = (docF.children || []).filter(c => c.visible !== false);
    kids.forEach((sec, i) => {
      if (sec.type === "TEXT") { doc.blocks.push(...textBlocks(sec)); return; }
      const t = textBlocks(sec);
      if (i === 0 && sec.type === "FRAME") {                      // шапка: назва + «Last modified»
        const all = t.map(b => b.t);
        doc.title = all[0] || "";
        const m = all.find(s => /\d{2}\.\d{2}\.\d{4}/.test(s)); doc.modified = m ? m.match(/\d{2}\.\d{2}\.\d{4}/)[0] : "";
        return;
      }
      if (isTextFrame(sec)) { doc.blocks.push(...t); return; }
      (sec.children || []).filter(c => c.visible !== false).forEach(c => {
        if (c.type === "TEXT") doc.blocks.push(...textBlocks(c));
        else if (isTextFrame(c)) doc.blocks.push(...textBlocks(c));
        else doc.blocks.push(addImg(c));
      });
    });
    // Changelog — останній розділ: перетворюємо у список
    const ci = doc.blocks.findIndex(b => b.k === "t" && /^changelog$/i.test(b.t.trim()));
    if (ci >= 0) { doc.changelog = doc.blocks.splice(ci).slice(1).filter(b => b.k === "t").map(b => b.t); }
    // прибираємо рядок-посилання «Документація Ant» та службове
    doc.blocks = doc.blocks.filter(b => !(b.k === "t" && /^(last modified:?|👉|документація\s*ant\s*)$/i.test(b.t.trim())));
  }
  const variants = [];
  if (compF) (compF.children || []).filter(c => c.visible !== false).forEach((c, i) => {
    if (i === 0 && isTextFrame(c)) return;                          // заголовок сторінки
    const a = addImg(c); variants.push({ name: c.name, id: a.id, src: a.src, w: a.w, h: a.h });
  });
  const api = (compF ? findSets(compF) : findSets(page)).map(s => ({
    name: s.name, variants: (s.children || []).length,
    props: Object.entries(s.componentPropertyDefinitions || {}).map(([k, v]) => ({ name: k.split("#")[0], type: v.type, default: v.defaultValue, options: v.variantOptions || null }))
  }));
  return { doc, variants, api, imgIds };
}

/* ---------- мережа ---------- */
async function figma(p) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(API + p, { headers: { "X-Figma-Token": process.env.FIGMA_TOKEN } });
    if (r.status === 429) { await new Promise(s => setTimeout(s, 5000 * (attempt + 1))); continue; }
    if (!r.ok) throw new Error(`${r.status} ${p}: ${(await r.text()).slice(0, 200)}`);
    return r.json();
  }
  throw new Error("rate limit: " + p);
}
async function download(url, file) {
  const r = await fetch(url); if (!r.ok) throw new Error("download " + r.status);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}

async function main() {
  if (!process.env.FIGMA_TOKEN) { console.error("Задайте FIGMA_TOKEN (див. коментар на початку файлу)."); process.exit(1); }
  const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "data/components.js"), "utf8"), sandbox);
  const list = sandbox.window.COMPONENTS.map(([name, id, status]) => ({ name, id, status, slug: slugify(name) })).filter(c => !ONLY.length || ONLY.includes(c.slug));
  const outFile = path.join(ROOT, "data/component-docs.js");
  let docs = {};
  if (fs.existsSync(outFile)) { try { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(outFile, "utf8"), c); docs = c.window.COMPONENT_DOCS || {}; } catch {} }

  for (const c of list) {
    process.stdout.write(`• ${c.name} … `);
    try {
      const res = await figma(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(c.id)}&depth=9`);
      const node = res.nodes[c.id]?.document;
      if (!node) { console.log("сторінку не знайдено"); continue; }
      const { doc, variants, api, imgIds } = parsePage(node, c.slug);
      // картинки пачками
      const need = imgIds.filter(id => FORCE || !fs.existsSync(path.join(ROOT, `assets/components/${c.slug}/${fileId(id)}.png`)));
      for (let i = 0; i < need.length; i += 40) {
        const chunk = need.slice(i, i + 40);
        const im = await figma(`/images/${FILE_KEY}?ids=${encodeURIComponent(chunk.join(","))}&format=png&scale=1`);
        await Promise.all(chunk.map(id => im.images[id] ? download(im.images[id], path.join(ROOT, `assets/components/${c.slug}/${fileId(id)}.png`)).catch(e => console.warn("\n  ! " + id + " " + e.message)) : null));
      }
      docs[c.slug] = { name: c.name, figmaId: c.id, ...doc, variants, api };
      console.log(`${doc.blocks.length} блоків, ${variants.length} варіантів, ${imgIds.length} зображень`);
    } catch (e) { console.log("помилка: " + e.message); }
  }
  fs.writeFileSync(outFile, "// Згенеровано scripts/sync-figma.mjs — не редагуйте вручну.\nwindow.COMPONENT_DOCS = " + JSON.stringify(docs, null, 1) + ";\n");
  console.log("Готово →", path.relative(ROOT, outFile));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
