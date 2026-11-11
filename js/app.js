(function () {
  const T = window.TOKENS, COMPS = window.COMPONENTS, DEBT = window.TECH_DEBT || [];
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "";

  /* ---------- colour data ---------- */
  const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const primitives = { light: {}, dark: {} };
  T.neutral.forEach(([n, hex]) => (primitives.light[n] = hex));
  Object.entries(T.scale).forEach(([hue, d]) => {
    STEPS.forEach((s, i) => {
      primitives.light[`${hue}/${s}`] = "#" + d.steps[i];
      primitives.dark[`${hue}/${s}`] = "#" + ((d.darkOverride && d.darkOverride[s]) || d.steps[9 - i]);
    });
  });
  const resolve = ref => (ref[0] === "#" ? ref : primitives.light[ref]);
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
    ["group", "Стилі"], ["colors", "Кольори"], ["typography", "Типографіка"], ["spacing", "Відступи"], ["radius", "Радіуси"], ["shadows", "Тіні"],
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
      const v = isDark ? neutralDark(n) : hex;
      return sw(n, v, note);
    }).join("");
    const scales = Object.entries(T.scale).map(([hue, d]) => `<h3>${hue}</h3>
      <div class="ramp">${STEPS.map(s => { const v = P[`${hue}/${s}`]; return `<button style="background:${v};color:${textOn(v)}" data-copy="${v}" title="${hue}/${s} ${v}">${s}</button>`; }).join("")}</div>
      <div class="ramp-meta">${STEPS.map(s => `<span>${d.notes[s] ? "● " : ""}${v(P[`${hue}/${s}`])}</span>`).join("")}</div>
      ${Object.entries(d.notes).map(([s, n]) => `<div class="muted" style="margin:-12px 0 4px">● ${hue}/${s} — ${esc(n)}</div>`).join("")}`).join("");

    const groups = {};
    Object.entries(T.semantic).forEach(([name, ref]) => { const [cat, sub] = name.split("/"); (groups[`${cat} / ${sub || ""}`] ||= []).push([name, ref]); });
    const tok = Object.entries(groups).map(([g, rows]) => `<div class="tok-group">${esc(g)}</div>
      <table><tr><th style="width:42%">Токен</th><th>Значення</th><th>Примітив</th></tr>${rows.map(([name, ref]) => {
        const hex = resolve(ref); const refLabel = ref[0] === "#" ? "—" : ref;
        return `<tr><td><code>${esc(name)}</code></td><td><span class="dot" style="background:${hex}"></span><span class="mono" data-copy="${hex}" style="cursor:pointer">${hex}</span></td><td class="muted">${esc(refLabel)}</td></tr>`; }).join("")}</table>`).join("");

    return header("Кольори", "Примітиви (палітри) та семантичні токени. Клік по кольору копіює значення.") +
      `<div class="toolbar">${modeBtns}${isDark ? `<span class="muted">Показано примітиви темної теми; семантичні токени для темної теми у Figma ще не налаштовані.</span>` : ""}</div>
      <h2 style="margin-top:8px">Neutral</h2><div class="swatches">${neutral}</div>${scales}
      <h2>Семантичні токени <span class="badge b-progress" style="vertical-align:middle">Light mode</span></h2>${tok}`;
  }
  const v = s => s.slice(1).toUpperCase();
  const neutralDark = n => { const l = T.neutral.map(x => x[0]); const hexes = T.neutral.map(x => x[1]); return hexes[l.length - 1 - l.indexOf(n)]; };
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
      `<div class="shadows" style="margin-top:28px">${T.shadows.map(([n, css, d]) => `<div><div class="shadow-demo" style="box-shadow:${css}"></div><b>${esc(n)}</b><div class="muted">${esc(d)}</div><div class="mono muted" style="cursor:pointer;margin-top:6px;word-break:break-word" data-copy="${esc(css)}">${esc(css)}</div></div>`).join("")}</div>`;
  }

  const compFilter = { q: "", s: "all" };
  function components() {
    const cats = [...new Set(COMPS.map(c => c[3]))];
    const chip = (id, label) => `<button data-s="${id}" class="${compFilter.s === id ? "on" : ""}">${label}</button>`;
    return header("Компоненти", `Статус показує, наскільки компонент допрацьований у Figma. Файл: <a href="${window.FIGMA_COMPONENTS_URL}" target="_blank" rel="noopener">Core Components</a>.`) + `
      <div class="toolbar"><input type="search" id="q" placeholder="Пошук компонента…" value="${esc(compFilter.q)}">
        <div class="seg" id="sSeg">${chip("all", `Усі ${COMPS.length}`)}${Object.keys(CSTAT).map(s => chip(s, `${CSTAT[s]} ${COMPS.filter(c => c[2] === s).length}`)).join("")}</div></div>
      <div id="compList">${compList(cats)}</div>`;
  }
  function compList(cats) {
    const q = compFilter.q.trim().toLowerCase();
    return cats.map(cat => {
      const items = COMPS.filter(c => c[3] === cat && (compFilter.s === "all" || c[2] === compFilter.s) && c[0].toLowerCase().includes(q));
      if (!items.length) return "";
      return `<h3>${cat}</h3><div class="comp-grid">${items.map(([n, id, s]) => `<a class="card comp" target="_blank" rel="noopener" href="${window.FIGMA_COMPONENTS_URL}?node-id=${id.replace(":", "-")}"><b>${esc(n)}</b><span class="badge b-${s}">${CSTAT[s]}</span></a>`).join("")}</div>`;
    }).join("") || `<div class="empty">Нічого не знайдено</div>`;
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

  /* ---------- router ---------- */
  const ROUTES = { "": home, colors, typography, spacing, radius, shadows, components, debt, archive: archivePage };
  function render() {
    const id = (location.hash.replace(/^#\/?/, "") || "").split("?")[0];
    const page = ROUTES[id] ? id : "";
    $("#app").innerHTML = ROUTES[page]();
    document.querySelectorAll(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.id === page));
    const titles = { "": "Core Design System", debt: "Технічний борг", archive: "Архів техборгу" };
    document.title = (titles[page] || (NAV.find(n => n[0] === page) || [])[1] || "") + (page ? " · Core Design System" : "");
    $("#sidebar").classList.remove("open");
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);

  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]"); if (c) { copy(c.dataset.copy); return; }
    const m = e.target.closest("#modeSeg button"); if (m) { colorMode = m.dataset.m; const y = scrollY; render(); scrollTo(0, y); return; }
    const s = e.target.closest("#sSeg button"); if (s) { compFilter.s = s.dataset.s; const q = $("#q").value; compFilter.q = q; $("#app").innerHTML = components(); $("#q").focus(); return; }
    const d = e.target.closest(".toolbar [data-k]"); if (d) { debtFilter[d.dataset.k] = d.dataset.v; $("#app").innerHTML = debt(); return; }
    if (e.target.id === "menuBtn") $("#sidebar").classList.toggle("open");
  });
  document.addEventListener("input", e => {
    if (e.target.id === "q") { compFilter.q = e.target.value; $("#compList").innerHTML = compList([...new Set(COMPS.map(c => c[3]))]); }
  });
  render();
})();
