(function () {
  const T = window.TOKENS, COMPS = window.COMPONENTS, DEBT = window.TECH_DEBT || [], DOCS = window.COMPONENT_DOCS || {};
  const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "";

  /* ---------- colour data ---------- */
  const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const primitives = { light: {}, dark: {} };
  T.neutral.forEach(([n, hex, , dk]) => { primitives.light[n] = hex; primitives.dark[n] = dk; });
  Object.entries(T.scale).forEach(([hue, d]) => {
    STEPS.forEach((s, i) => {
      primitives.light[`${hue}/${s}`] = "#" + d.steps[i];
      primitives.dark[`${hue}/${s}`] = "#" + ((d.darkOverride && d.darkOverride[s]) || d.steps[9 - i]);
    });
  });
  const resolve = (ref, mode = "light") => (ref[0] === "#" ? ref : primitives[mode][ref]);
  const semDark = name => T.semanticDark[name] || T.semantic[name];
  const toast = (() => { let t; return msg => { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(t); t = setTimeout(() => el.classList.remove("show"), 1200); }; })();
  const copy = v => { (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast("Скопійовано " + v), () => toast(v)); };

  /* ---------- status meta ---------- */
  const CSTAT = { ready: "Готовий", progress: "У роботі", todo: "Не розпочато" };
  const DSTAT = { todo: "У черзі", progress: "В роботі", blocked: "Заблоковано", done: "Закрито" };
  const PRIO = { high: "Високий", medium: "Середній", low: "Низький" };
  const open = DEBT.filter(d => d.status !== "done");
  const archive = DEBT.filter(d => d.status === "done");

  /* ---------- navigation ---------- */
  const NAV = [
    ["", "Огляд"],
    ["group", "Стилі"], ["colors", "Кольори"], ["themes", "Темна тема"], ["typography", "Типографіка"], ["spacing", "Відступи"], ["radius", "Радіуси"], ["shadows", "Тіні"],
    ["group", "Бібліотека"], ["components", "Компоненти", COMPS.length],
    ["group", "Технічний борг"], ["debt", "Активні", open.length], ["archive", "Архів", archive.length]
  ];
  $("#nav").innerHTML = NAV.map(([id, label, n]) => id === "group" ? `<div class="nav-group">${label}</div>`
    : `<a class="nav-link" data-id="${id}" href="#/${id}"><span>${label}</span>${n !== undefined ? `<span class="count">${n}</span>` : ""}</a>`).join("");

  /* ---------- pages ---------- */
  const header = (title, lead) => `<h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}`;

  function home() {
    const cnt = s => COMPS.filter(c => c[2] === s).length;
    return header("Core Design System", "Публічна бібліотека стилів і компонентів із Figma, а також реєстр технічного боргу.") + `
    <div class="grid hero-cards">
      <a class="card" href="#/colors"><div class="stat">${Object.keys(primitives.light).length}</div>кольорових примітивів</a>
      <a class="card" href="#/themes"><div class="stat">2</div>теми · превʼю на екранах</a>
      <a class="card" href="#/typography"><div class="stat">${T.typography.groups.length}</div>груп типографіки</a>
      <a class="card" href="#/components"><div class="stat">${COMPS.length}</div>компонентів · ${cnt("ready")} готово</a>
      <a class="card" href="#/debt"><div class="stat">${open.length}</div>відкритих пунктів техборгу</a>
    </div>
    <h2>Готовність компонентів</h2>${progressBar()}
    <p class="muted" style="margin-top:8px">${cnt("ready")} готові · ${cnt("progress")} у роботі · ${cnt("todo")} не розпочато. Це статуси дороблення в Figma, а не технічний борг.</p>
    <h2>Джерела</h2>
    <p><a href="${window.FIGMA_COMPONENTS_URL}" target="_blank" rel="noopener">Core Components</a> — компоненти · <a href="https://www.figma.com/design/AS33NnplM58ZP2G32M8QJq/Styles" target="_blank" rel="noopener">Styles</a> — стилі й токени</p>`;
  }

  function progressBar() {
    const n = COMPS.length, w = s => (COMPS.filter(c => c[2] === s).length / n * 100).toFixed(1) + "%";
    return `<div class="progress" title="Готовність"><i style="width:${w("ready")};background:var(--green)"></i><i style="width:${w("progress")};background:var(--yellow-600)"></i></div>`;
  }

  let colorMode = "light";
  function colors() {
    const modeBtns = `<div class="seg" id="modeSeg"><button data-m="light" class="${colorMode === "light" ? "on" : ""}">Світла</button><button data-m="dark" class="${colorMode === "dark" ? "on" : ""}">Темна</button></div>`;
    const P = primitives[colorMode], isDark = colorMode === "dark";
    const neutral = T.neutral.map(([n, hex, note]) => {
      return sw(n, isDark ? primitives.dark[n] : hex, note);
    }).join("");
    const scales = Object.entries(T.scale).map(([hue, d]) => `<h3>${hue}</h3>
      <div class="ramp">${STEPS.map(s => { const v = P[`${hue}/${s}`]; return `<button style="background:${v};color:${textOn(v)}" data-copy="${v}" title="${hue}/${s} ${v}">${s}</button>`; }).join("")}</div>
      <div class="ramp-meta">${STEPS.map(s => `<span>${d.notes[s] ? "● " : ""}${v(P[`${hue}/${s}`])}</span>`).join("")}</div>
      ${Object.entries(d.notes).map(([s, n]) => `<div class="muted" style="margin:-12px 0 4px">● ${hue}/${s} — ${esc(n)}</div>`).join("")}`).join("");

    const groups = {};
    Object.entries(T.semantic).forEach(([name, ref]) => { const [cat, sub] = name.split("/"); (groups[`${cat} / ${sub || ""}`] ||= []).push([name, ref]); });
    const cell = (hex, ref) => `<span class="dot" style="background:${hex}"></span><span class="mono" data-copy="${hex}" style="cursor:pointer">${hex.toUpperCase()}</span><div class="muted" style="font-size:12px;margin-left:28px">${esc(ref[0] === "#" ? "—" : ref)}</div>`;
    const tok = Object.entries(groups).map(([g, rows]) => `<div class="tok-group">${esc(g)}</div>
      <table><tr><th style="width:38%">Токен</th><th>Світла тема</th><th>Темна тема</th></tr>${rows.map(([name, ref]) => {
        const dref = semDark(name), changed = T.semanticDark[name] && T.semanticDark[name] !== ref;
        return `<tr><td><code>${esc(name)}</code>${changed ? ` <span class="badge b-progress" title="Аліас у темній темі відрізняється від світлої">змінено</span>` : ""}</td><td>${cell(resolve(ref), ref)}</td><td>${cell(resolve(dref, "dark"), dref)}</td></tr>`; }).join("")}</table>`).join("");

    return header("Кольори", "Примітиви (палітри) та семантичні токени. Клік по кольору копіює значення.") +
      `<div class="toolbar">${modeBtns}<span class="muted">Перемикає відображення примітивів. Семантичні токени нижче показані в обох темах.</span></div>
      <h2 style="margin-top:8px">Превʼю на екранах платформи</h2><p class="muted">Реальні екрани системи у світлій і темній темі. Перемикайте екран і тему, щоб оцінити палітру в контексті.</p>${previewBlock()}
      <h2>Neutral</h2><div class="swatches">${neutral}</div>${scales}
      <h2>Семантичні токени</h2><p class="muted">Позначка «змінено» — токен у темній темі посилається на інший примітив, ніж у світлій. Решта беруть той самий аліас, але з темного набору примітивів. Детальніше — на сторінці <a href="#/themes">Темна тема</a>.</p>${tok}`;
  }
  const v = s => s.slice(1).toUpperCase();
    const sw = (name, hex, note) => `<button class="sw" data-copy="${hex}" title="${esc(note || "")}"><div class="c" style="background:${hex}"></div><div class="t"><b>${esc(name.split("/")[1])}</b><span>${hex}</span></div></button>`;
  function textOn(hex) { const n = parseInt(hex.slice(1, 7), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#202022" : "#fff"; }

  function typography() {
    const ty = T.typography;
    const rows = ty.groups.map(([g, size, lh]) => {
      const ws = ty.available[g] || ["700", "600", "400"];
      return `<div class="type-row"><div class="s"><b style="font-size:20px">${g}</b><span class="muted">${size}px · line-height ${lh}%</span><span class="mono muted">${ws.map(w => `${g}/${w}`).join("<br>")}</span></div>
        <div>${ws.map(w => `<div style="font-weight:${w};font-size:${size}px;line-height:${lh}%;margin-bottom:10px">${g === "Description" || g === "Body" ? "Швидка руда лисиця стрибає через ледачого пса" : "Заголовок " + g}<span class="muted mono" style="font-size:11px;font-weight:400;margin-left:12px">${ty.weights[w]} ${w}</span></div>`).join("")}</div></div>`;
    }).join("");
    const sp = ty.special.map(([n, k]) => `<div style="margin-bottom:8px;${k === "code" ? `font-family:var(--mono)` : k === "italic" ? "font-style:italic" : `text-decoration:${k}`}">${n} — Швидка руда лисиця</div>`).join("");
    return header("Типографіка", `Шрифт <b>${ty.family}</b> (моноширинний — ${ty.mono}). Міжрядковий інтервал задається у відсотках.`) + `
      <h2 style="margin-top:28px">Шрифтова родина</h2>
      <div class="card"><div style="font-size:32px;font-weight:600">${ty.family}</div><div style="font-size:16px;color:var(--n500);word-break:break-all">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&amp;*()</div>
      <div style="margin-top:12px;display:flex;gap:24px;flex-wrap:wrap"><span>Normal 400</span><b style="font-weight:600">Medium 600</b><b>Bold 700</b></div></div>
      <h2>Текстові стилі</h2>${rows}
      <h2>Special <span class="muted" style="font-size:14px;font-weight:400">14px · 160% · 400</span></h2><div class="card">${sp}</div>`;
  }

  function spacing() {
    return header("Відступи", "Токени колекції Spacing (px).") + `<div class="card" style="margin-top:24px">${T.spacing.map(([n, px]) => `<div class="sp-row"><b>${n}</b><span class="mono muted">${px}px</span><div class="sp-bar" style="width:${Math.max(px, 1)}px"></div></div>`).join("")}</div>`;
  }
  function radius() {
    return header("Радіуси", "Токени колекції Radius.") + `<div class="boxes" style="margin-top:24px">${T.radius.map(([n, px, note]) => `<div class="box"><div class="rad" style="border-radius:${Math.min(px, 36)}px"></div><b style="display:block;margin-top:10px">${n} <span class="mono muted">${px === 9999 ? "9999px" : px + "px"}</span></b>${note ? `<div class="muted" style="font-size:12px">${esc(note)}</div>` : ""}</div>`).join("")}</div>`;
  }
  function shadows() {
    return header("Тіні", "Effect styles. Тіні Ant Design (Divider, Theme, Button, Table тощо) видалені із системи й більше не використовуються.") +
      `<div class="shadows" style="margin-top:28px">${T.shadows.map(([n, css, d]) => `<div><div class="shadow-demo" style="box-shadow:${css}"></div><b>${esc(n)}</b><div class="muted">${esc(d)}</div><div class="mono muted" style="cursor:pointer;margin-top:6px;word-break:break-word" data-copy="${esc(css)}">${esc(css)}</div></div>`).join("")}</div><p class="muted" style="margin-top:24px">Значення для темної теми — на сторінці <a href="#/themes">Темна тема</a>.</p>`;
  }

  const compFilter = { q: "", s: "all" };
  function components() {
    const cats = [...new Set(COMPS.map(c => c[3]))];
    const chip = (id, label) => `<button data-s="${id}" class="${compFilter.s === id ? "on" : ""}">${label}</button>`;
    return header("Компоненти", `Статус показує, наскільки компонент допрацьований у Figma. Натисніть на компонент, щоб побачити превʼю та документацію. Файл: <a href="${window.FIGMA_COMPONENTS_URL}" target="_blank" rel="noopener">Core Components</a>.`) + `
      <div class="toolbar"><input type="search" id="q" placeholder="Пошук компонента…" value="${esc(compFilter.q)}">
        <div class="seg" id="sSeg">${chip("all", `Усі ${COMPS.length}`)}${Object.keys(CSTAT).map(s => chip(s, `${CSTAT[s]} ${COMPS.filter(c => c[2] === s).length}`)).join("")}</div></div>
      <div id="compList">${compList(cats)}</div>`;
  }
  function compList(cats) {
    const q = compFilter.q.trim().toLowerCase();
    return cats.map(cat => {
      const items = COMPS.filter(c => c[3] === cat && (compFilter.s === "all" || c[2] === compFilter.s) && c[0].toLowerCase().includes(q));
      if (!items.length) return "";
      return `<h3>${cat}</h3><div class="comp-grid">${items.map(([n, id, s]) => `<a class="card comp" href="#/components/${slugify(n)}"><b>${esc(n)}</b><span class="comp-row"><span class="badge b-${s}">${CSTAT[s]}</span>${DOCS[slugify(n)] ? `<span class="muted" title="Є документація">📄</span>` : ""}</span></a>`).join("")}</div>`;
    }).join("") || `<div class="empty">Нічого не знайдено</div>`;
  }


  const API_TYPES = { VARIANT: "Variant", TEXT: "Текст", BOOLEAN: "Boolean", INSTANCE_SWAP: "Instance (іконка/компонент)" };
  const nl = t => esc(t).replace(/\n/g, "<br>");
  const fig = (w, h, src, cap) => `<figure class="shot"><img loading="lazy" src="${esc(src)}" ${w ? `width="${w}" height="${h}"` : ""} alt="${esc(cap || "")}" data-zoom="${esc(src)}" onerror="this.closest('figure').classList.add('missing')">${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}<div class="missing-note">Зображення ще не синхронізовано</div></figure>`;
  function componentPage(slug) {
    const i = COMPS.findIndex(c => slugify(c[0]) === slug);
    if (i < 0) return `<div class="empty">Компонент не знайдено. <a href="#/components">До списку</a></div>`;
    const [name, nodeId, status, cat] = COMPS[i], doc = DOCS[slug];
    const figUrl = `${window.FIGMA_COMPONENTS_URL}?node-id=${nodeId.replace(":", "-")}`;
    const head = `<div class="crumbs"><a href="#/components">Компоненти</a> / ${esc(cat)}</div>
      <div class="detail-head"><h1>${esc(name)}</h1><span class="badge b-${status}">${CSTAT[status]}</span><a class="btn" href="${figUrl}" target="_blank" rel="noopener">Відкрити у Figma ↗</a></div>`;
    const prev = COMPS[i - 1], next = COMPS[i + 1];
    const pager = `<div class="pager">${prev ? `<a class="card" href="#/components/${slugify(prev[0])}"><span class="muted">← Попередній</span><b>${esc(prev[0])}</b></a>` : "<span></span>"}${next ? `<a class="card" href="#/components/${slugify(next[0])}" style="text-align:right"><span class="muted">Наступний →</span><b>${esc(next[0])}</b></a>` : "<span></span>"}</div>`;
    if (!doc) return head + `<div class="empty" style="margin-top:24px">Документація цього компонента ще не додана${status === "todo" ? " (компонент не розпочато у Figma)" : ""}.<br><a href="${figUrl}" target="_blank" rel="noopener">Дивитись у Figma ↗</a></div>` + pager;
    const toc = []; let body = ""; let first = true; const hero = (doc.variants || [])[0];
    (doc.blocks || []).forEach(b => {
      if (b.k === "i") { body += fig(b.w, b.h, b.src); return; }
      if (b.s >= 30) { const id = "s" + toc.length; toc.push([id, b.t]); body += `<h2 id="${id}">${esc(b.t)}</h2>`; }
      else if ((b.w || 400) >= 600) body += `<h3>${esc(b.t)}</h3>`;
      else if (first) { body += `<p class="lead">${nl(b.t)}</p>`; first = false; }
      else body += `<p>${nl(b.t)}</p>`;
    });
    let variants = "";
    const more = (doc.variants || []).slice(1);
    if (more.length) { toc.push(["variants", "Варіанти"]); variants = `<h2 id="variants">Варіанти</h2><p class="muted">Розміри, типи та стани компонента.</p>${more.map(v => fig(v.w, v.h, v.src, v.name)).join("")}`; }
    let api = "";
    if ((doc.api || []).length) {
      toc.push(["api", "Властивості"]);
      api = `<h2 id="api">Властивості (API)</h2><p class="muted">Параметри компонента у Figma: Variant — перемикач варіанта, Текст — редагований напис.</p>` + doc.api.map(s => `<h3>${esc(s.name)} <span class="muted" style="font-weight:400;font-size:12px">${s.variants} варіантів</span></h3>
        <div class="tbl"><table><tr><th>Властивість</th><th>Тип</th><th>За замовчуванням</th><th>Значення</th></tr>${s.props.map(p => `<tr><td><code>${esc(p.name)}</code></td><td>${API_TYPES[p.type] || esc(p.type)}</td><td>${p.default === undefined || p.default === null ? "—" : `<code>${esc(String(p.default))}</code>`}</td><td>${p.options ? p.options.map(o => `<code class="opt">${esc(o)}</code>`).join(" ") : "—"}</td></tr>`).join("")}</table></div>`).join("");
    }
    let log = "";
    if ((doc.changelog || []).length) { toc.push(["changelog", "Changelog"]); log = `<h2 id="changelog">Changelog</h2><ul>${doc.changelog.map(c => `<li>${nl(c)}</li>`).join("")}</ul>`; }
    return `<div class="detail">${head}<div class="detail-grid"><article>
      ${hero ? `<div class="hero-shot">${fig(hero.w, hero.h, hero.src)}</div>` : ""}
      ${body}${variants}${api}${log}${doc.modified ? `<p class="muted" style="margin-top:32px">Оновлено у Figma: ${esc(doc.modified)}</p>` : ""}${pager}</article>
      <aside class="toc"><b>На цій сторінці</b>${toc.map(([id, t]) => `<a href="#" data-target="${id}">${esc(t)}</a>`).join("")}</aside></div></div>`;
  }

  const debtFilter = { s: "all", p: "all" };
  const fmt = d => d ? new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" }) : "";
  function debtCard(d, archived) {
    const link = safeUrl(d.link);
    return `<div class="card debt-item"><div class="debt-head"><span class="debt-id">${esc(d.id)}</span><span class="badge b-${d.status}">${DSTAT[d.status] || esc(d.status)}</span>${d.priority ? `<span class="badge b-${d.priority}">${PRIO[d.priority] || esc(d.priority)}</span>` : ""}</div>
      <h3>${esc(d.title)}</h3>${d.description ? `<div>${esc(d.description)}</div>` : ""}${archived && d.resolution ? `<div><b>Як закрито:</b> ${esc(d.resolution)}</div>` : ""}
      <div class="debt-meta">${d.area ? `<span>Розділ: <b>${esc(d.area)}</b></span>` : ""}${d.created ? `<span>Створено: ${fmt(d.created)}</span>` : ""}${archived && d.closed ? `<span>Закрито: ${fmt(d.closed)}</span>` : ""}${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">Посилання ↗</a>` : ""}</div></div>`;
  }
  function debt() {
    const order = { high: 0, medium: 1, low: 2 };
    const list = open.filter(d => (debtFilter.s === "all" || d.status === debtFilter.s) && (debtFilter.p === "all" || d.priority === debtFilter.p))
      .sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
    const chip = (k, id, label) => `<button data-k="${k}" data-v="${id}" class="${debtFilter[k] === id ? "on" : ""}">${label}</button>`;
    const total = DEBT.length;
    return header("Технічний борг", "Відомі розбіжності та доробки в системі. Закриті пункти переходять в архів.") + `
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-top:24px">
        ${["todo", "progress", "blocked"].map(s => `<div class="card"><div class="stat">${open.filter(d => d.status === s).length}</div><span class="badge b-${s}">${DSTAT[s]}</span></div>`).join("")}
        <a class="card" href="#/archive" style="color:inherit"><div class="stat">${archive.length}</div><span class="badge b-done">Закрито · архів</span></a></div>
      ${total ? `<div class="progress" style="height:10px"><i style="width:${archive.length / total * 100}%;background:var(--green)"></i></div><div class="muted" style="margin-top:6px">Закрито ${archive.length} із ${total}</div>` : ""}
      <div class="toolbar"><div class="seg">${chip("s", "all", "Усі")}${["todo", "progress", "blocked"].map(s => chip("s", s, DSTAT[s])).join("")}</div>
        <div class="seg">${chip("p", "all", "Будь-який пріоритет")}${Object.keys(PRIO).map(p => chip("p", p, PRIO[p])).join("")}</div></div>
      <div class="debt">${list.length ? list.map(d => debtCard(d, false)).join("") : `<div class="empty">${open.length ? "Немає записів за цими фільтрами." : "Відкритого технічного боргу поки немає."}</div>`}</div>`;
  }
  function archivePage() {
    const list = [...archive].sort((a, b) => String(b.closed || "").localeCompare(String(a.closed || "")));
    return header("Архів техборгу", "Закриті пункти, від найновіших.") + `<div class="debt" style="margin-top:24px">${list.length ? list.map(d => debtCard(d, true)).join("") : `<div class="empty">Архів порожній — закриті пункти зʼявляться тут.</div>`}</div>`;
  }


  /* ---------- темна тема ---------- */
  const themeState = { view: "both", screen: "list" };
  const lumOf = hex => { const n = parseInt(hex.slice(1, 7), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contrast = (a, b) => { const [x, y] = [lumOf(a), lumOf(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const tokHex = (name, mode) => resolve(mode === "dark" ? semDark(name) : T.semantic[name], mode);
  const PAIRS = [
    ["Основний текст на картці", "Text/Neutral/Text", "BG/Neutral/BG-default"], ["Другорядний текст (опис)", "Text/Neutral/Text-description", "BG/Neutral/BG-default"],
    ["Текст на фоні сторінки", "Text/Neutral/Text", "BG/Neutral/BG-grey-light"], ["Плейсхолдер у полі", "Text/Neutral/Text-placeholder", "BG/Input/BG-input"],
    ["Посилання", "Link/Text-link", "BG/Neutral/BG-default"], ["Акцентний текст (Primary)", "Text/Accent/Primary-text", "BG/Neutral/BG-default"],
    ["Danger-текст", "Text/Accent/Danger-text", "BG/Neutral/BG-default"], ["Success-текст", "Text/Accent/Success-text", "BG/Neutral/BG-default"],
    ["Текст на головній кнопці", "Text/Inverse/Default-inverse", "BG/Actions/BG-primary"], ["Текст на вторинній кнопці", "Text/Inverse/Default-inverse", "BG/Actions/BG-secondary"],
    ["Текст у Success-тегу", "Text/Accent/Success-text-bold", "BG/Accent/BG-success"], ["Текст у Danger-тегу", "Text/Accent/Danger-text-bold", "BG/Accent/BG-danger"]
  ];
  const ratio = (fg, bg, mode) => contrast(tokHex(fg, mode), tokHex(bg, mode));
  const SCREENS_META = { list: ["Список з таблицею", 960], contract: ["Договір · Загальна інформація", 960], object: ["Картка об'єкту · Загальна інформація", 960] };
  function previewBlock() {
    const modes = themeState.view === "both" ? ["light", "dark"] : [themeState.view];
    const seg = (id, items, cur) => `<div class="seg" id="${id}">${items.map(([k, l]) => `<button data-v="${k}" class="${cur === k ? "on" : ""}">${l}</button>`).join("")}</div>`;
    const shots = modes.map(m => `<div class="theme-label"><b>${m === "dark" ? "Темна тема" : "Світла тема"}</b><span class="muted mono">data-theme="${m}"</span></div>
      <div class="scr-wrap" data-theme="${m}" data-h="${SCREENS_META[themeState.screen][1]}"><div class="scr-scale">${window.SCREENS[themeState.screen]()}</div></div>`).join("");
    return `<div class="toolbar">${seg("scrSeg", Object.entries(SCREENS_META).map(([k, v]) => [k, v[0]]), themeState.screen)}${seg("viewSeg", [["both", "Поруч"], ["light", "Світла"], ["dark", "Темна"]], themeState.view)}</div>${shots}`;
  }
  function themes() {
    const rows = PAIRS.map(([label, fg, bg]) => { const l = ratio(fg, bg, "light"), d = ratio(fg, bg, "dark"); const c = r => `<span class="${r >= 4.5 ? "ok" : r >= 3 ? "warn" : "bad"}-t">${r.toFixed(1)}</span> <span class="muted" style="font-size:12px">${r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "лише великий текст" : "нижче 3"}</span>`; return `<tr><td>${label}<div class="mono muted">${fg} → ${bg}</div></td><td>${c(l)}</td><td>${c(d)}</td></tr>`; }).join("");
    const sh = T.shadows.map(([n], i) => `<div><div class="shadow-pair"><div class="sh-demo" data-theme="light"><i style="box-shadow:${T.shadows[i][1]}"></i></div><div class="sh-demo" data-theme="dark"><i style="box-shadow:${T.shadowsDark[i]}"></i></div></div><b>${esc(n)}</b></div>`).join("");
    const ovr = Object.keys(T.semanticDark).length, total = Object.keys(T.semantic).length;
    return header("Темна тема", "Токени темної теми згенеровані з існуючої палітри: нових кольорів не додавалось, змінюється лише набір примітивів і ключові поверхні.") + `
    <div class="grid principles">
      <div class="card"><b>1. Примітиви</b><p class="muted">Колекція <code>Colors primitives</code> має режим <em>Dark Mode</em>: кожна шкала (Blue, Orange, Green…) віддзеркалена — 500 у темній ≈ 400 у світлій. Нейтральні мають власні значення.</p></div>
      <div class="card"><b>2. Семантичні токени</b><p class="muted">${total - ovr} із ${total} токенів у темній темі посилаються на той самий аліас, що й у світлій, але на темне значення примітиву. Переозначено ${ovr} (позначка «змінено» на сторінці <a href="#/colors">Кольори</a>).</p></div>
      <div class="card"><b>3. Поверхні</b><p class="muted">Фон сторінки — <code>Neutral/0</code> (#000), картки й панелі — <code>Neutral/25</code> (#343437), поля вводу — на тон темніші за картку. Світліше = ближче до користувача.</p></div>
      <div class="card"><b>4. Стани</b><p class="muted">У темній темі <em>hover</em> світліший за базовий, <em>pressed/focused</em> темніший (у світлій — навпаки). Текст на заповнених кнопках — чорний (<code>Text/Inverse</code>).</p></div>
    </div>
    <h2>Приклади екранів</h2>
    <p class="muted">Екрани зібрані лише з семантичних токенів: змінюється атрибут <code>data-theme</code>, жодних окремих «темних» стилів.</p>
    ${previewBlock()}
    <h2>Контраст (WCAG)</h2><p class="muted">Співвідношення яскравості текст/фон. AA = 4.5 для звичайного тексту, 3 — для великого. Значення світлої теми — як є у Figma.</p>
    <table><tr><th>Пара токенів</th><th>Світла</th><th>Темна</th></tr>${rows}</table>
    <h2>Тіні</h2><p class="muted">На темному фоні тіні майже не видно, тому непрозорість збільшена.</p><div class="shadows">${sh}</div>
    <h2>Підключення</h2>
    <p>Усі токени доступні як CSS-змінні та JSON. Тему вмикає атрибут на будь-якому контейнері:</p>
    <pre class="code">&lt;link rel="stylesheet" href="css/tokens.css"&gt;
&lt;html data-theme="dark"&gt;   &lt;!-- або "light" --&gt;

.card { background: var(--bg-neutral-bg-default); color: var(--text-neutral-text); }</pre>
    <p><a class="btn" style="margin:0" href="css/tokens.css" download>css/tokens.css</a> <a class="btn" style="margin:0 0 0 8px" href="tokens/design-tokens.json" download>design-tokens.json</a></p>`;
  }
  function fitScreens() {
    document.querySelectorAll(".scr-wrap").forEach(w => { const k = w.clientWidth / 1440; const inner = w.firstElementChild; inner.style.transform = `scale(${k})`; w.style.height = (+w.dataset.h * k) + "px"; });
  }

  /* ---------- router ---------- */
  const ROUTES = { "": home, colors, themes, typography, spacing, radius, shadows, components, debt, archive: archivePage };
  function render() {
    const id = (location.hash.replace(/^#\/?/, "") || "").split("?")[0];
    const sub = id.startsWith("components/") ? id.slice(11) : null;
    const page = sub ? "components" : ROUTES[id] ? id : "";
    $("#app").innerHTML = sub ? componentPage(sub) : ROUTES[page]();
    if (sub) { const c = COMPS.find(c => slugify(c[0]) === sub); document.title = (c ? c[0] : "Компонент") + " · Core Design System"; }
    document.querySelectorAll(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.id === page));
    const titles = { "": "Core Design System", debt: "Технічний борг", archive: "Архів техборгу" };
    if (!sub) document.title = (titles[page] || (NAV.find(n => n[0] === page) || [])[1] || "") + (page ? " · Core Design System" : "");
    $("#sidebar").classList.remove("open");
    window.scrollTo(0, 0);
    fitScreens();
  }
  window.addEventListener("hashchange", render);
  window.addEventListener("resize", fitScreens);

  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]"); if (c) { copy(c.dataset.copy); return; }
    const m = e.target.closest("#modeSeg button"); if (m) { colorMode = m.dataset.m; const y = scrollY; render(); scrollTo(0, y); return; }
    const s = e.target.closest("#sSeg button"); if (s) { compFilter.s = s.dataset.s; const q = $("#q").value; compFilter.q = q; $("#app").innerHTML = components(); $("#q").focus(); return; }
    const d = e.target.closest(".toolbar [data-k]"); if (d) { debtFilter[d.dataset.k] = d.dataset.v; $("#app").innerHTML = debt(); return; }
    const ts = e.target.closest("#scrSeg button, #viewSeg button"); if (ts) { themeState[ts.parentElement.id === "scrSeg" ? "screen" : "view"] = ts.dataset.v; const y = scrollY; render(); scrollTo(0, y); return; }
    const z = e.target.closest("[data-zoom]"); if (z) { const lb = $("#lightbox"); lb.querySelector("img").src = z.dataset.zoom; lb.classList.add("on"); return; }
    if (e.target.closest("#lightbox")) { $("#lightbox").classList.remove("on"); return; }
    const tc = e.target.closest(".toc a"); if (tc) { e.preventDefault(); document.getElementById(tc.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (e.target.id === "menuBtn") $("#sidebar").classList.toggle("open");
  });
  document.addEventListener("input", e => {
    if (e.target.id === "q") { compFilter.q = e.target.value; $("#compList").innerHTML = compList([...new Set(COMPS.map(c => c[3]))]); }
  });
  render();
})();
