// Приклади екранів для демонстрації тем. Усі кольори — лише семантичні токени (css/tokens.css).
// Макети відтворені за екранами з Figma («Процес продажу»): Список, Договір → Загальна інформація, Картка об'єкту страхування.
window.SCREENS = (function () {
  const P = {
    menu: "M3 6h18M3 12h18M3 18h18", down: "M6 9l6 6 6-6", up: "M6 15l6-6 6 6", search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5",
    filter: "M3 5h18l-7 8v6l-4-2v-4z", download: "M12 4v11M7 11l5 5 5-5M5 20h14", gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 8.500 4 8l-1 3 2 1v1l-2 1 1 3 2-.5L7.500 18l-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.500-1.500 2 .5 1-3-2-1z",
    left: "M15 5l-7 7 7 7", right: "M9 5l7 7-7 7", dleft: "M12 5l-7 7 7 7M19 5l-7 7 7 7", dright: "M12 5l7 7-7 7M5 5l7 7-7 7", cal: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
    user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 3.500-7 8-7s8 3 8 7", doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7", save: "M5 4h12l3 3v13H5zM8 4v6h8V4M8 20v-6h8v6",
    list: "M9 6h12M9 12h12M9 18h12M4 6h1M4 12h1M4 18h1", money: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.500 9h-4a1.500 1.500 0 0 0 0 3h3a1.500 1.500 0 0 1 0 3h-4M12 7v10",
    car: "M5 16V11l2-5h10l2 5v5zM3 16h18v3H3zM7.500 13h.01M16.500 13h.01", box: "M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5", star: "M12 3l2.800 5.700 6.200.9-4.500 4.400 1 6.200L12 17.200 6.500 20.200l1-6.200L3 9.600l6.200-.9z"
  };
  const ic = (n, s = 16, fill) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${fill ? 0 : 1.8}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;
  const tag = (t, k) => `<span class="s-tag s-tag-${k}">${t}</span>`;
  const inp = (v, o = {}) => `<div class="s-in${o.dis ? " dis" : ""}${v ? "" : " ph"}"><span>${v || o.ph || "Не обрано"}</span>${o.i ? ic(o.i, 14) : ""}</div>`;
  const field = (l, v, o = {}) => `<div class="s-f"><div class="s-l">${o.req ? '<b class="req">*</b> ' : ""}${l}</div>${inp(v, o)}</div>`;

  const header = user => `<div class="s-header"><div class="s-nav-btn">${ic("menu", 20)}</div><div class="s-logo"><i></i>LOGO</div>
    ${["Продажі ▾", "Контакти ▾", "Довідники ▾", "Фінмоніторинг ▾", "Задачі", "Звіти", "Адмін панель інтернет магазину ▾"].map(t => `<div class="s-nav">${t}</div>`).join("")}
    <div class="s-grow"></div><div class="s-avatar">АШ<i></i></div><div class="s-user">User name<small>Online</small></div></div>`;
  const collapse = side => `<div class="s-collapse">${ic(side === "r" ? "dright" : "dleft", 16)}</div>`;

  function list() {
    const rows = [["Назва ПП", "00610681", 1], ["КАСКО Класік_Базова", "00610930", 1], ["Зелена карта", "09710002", 1], ["Порше Лізинг Комплекс багаторічний", "00010197"], ["ОСЦПВ_Базова", "05900002"], ["ДСЦПВ_Базова", "01200001"], ["ДМС_ARXiMED", "00610683"]];
    return `<div class="scr">${header()}<div class="s-pagehead"><b>Програми продажів</b></div>
    <div class="s-grid"><aside class="s-sider"><div class="s-sider-h">${ic("filter")}<b>Фільтр</b></div>
      <div class="s-sider-t"><div class="s-ibtn">${ic("save")}</div>${inp("", { ph: "Оберіть фільтр", i: "down" })}</div>
      <div class="s-sider-c">${field("Назва", "", { i: "search" })}${field("Код", "", { i: "search" })}${field("Страховий продукт", "", { i: "down" })}${field("Страхова програма", "", { i: "down" })}</div>${collapse()}</aside>
      <section class="s-content"><div class="s-card"><div class="s-tabs"><span class="on">Всі</span><span>Додані до обраних</span></div>
        <div class="s-pad"><div class="s-toolbar"><div class="s-ibtn">${ic("download")}</div><div class="s-ibtn">${ic("gear")}</div></div>
        <table class="s-table"><tr><th style="width:48px"></th><th>Назва</th><th>Код</th></tr>${rows.map(r => `<tr><td class="star${r[2] ? " on" : ""}">${ic("star", 16, r[2])}</td><td class="lnk">${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table>
        <div class="s-pager"><div class="s-pg dis">${ic("left", 14)}</div><div class="s-pg cur">1</div><div class="s-pg">2</div><div class="s-pg">${ic("right", 14)}</div><div class="s-pgsel">7/стор ${ic("down", 12)}</div></div></div></div></section></div></div>`;
  }

  const ctxCard = (icon, title, count, body, add) => `<div class="s-ctx"><div class="s-ctx-h">${ic(icon, 18)}<b>${title}</b>${count ? `<span class="s-count">${count}</span>` : ""}<i class="s-grow"></i>${add ? `<span class="s-add">+ Додати</span>` : ""}${ic("up", 16)}</div>${body}</div>`;
  const ctxItem = (icon, name, status, kind, rows) => `<div class="s-item"><div class="s-item-h"><i class="s-item-i">${ic(icon, 12)}</i><span class="lnk">${name}</span><span class="s-grow"></span><span>···</span></div>${status ? `<div class="s-item-s">${tag(status, kind)}</div>` : ""}${rows.map(r => `<div class="s-kv"><span>${r[0]}</span><span>${r[1]}</span></div>`).join("")}</div>`;

  function contract() {
    const rowsC = [["Компанія:", "Страхова компанія “ARX”", 0, 1], ["Дата створення:", "28.10.2025", "cal", 1], ["Індивідуальні умови:", "", "down"], ["Номер андеррайтерського погодження:", ""], ["Назва попередньої СК:", "", "down"],
      ["Комісія попереднього договору:", ""], ["Класифікатор клієнта:", "", "down", 0, 1], ["Тип залучення:", "Новий бізнес", "down", 1, 1], ["Канал продажів 1 рівень:", "Інші посередники", 0, 1, 1]];
    return `<div class="scr">${header()}
    <div class="s-pagehead"><span class="s-crumb">Договори страхування / <b>Договір №0237564а5к</b></span><div class="s-grow"></div><div class="s-btn">Копіювати</div><div class="s-btn">Вислати на e-mail</div><div class="s-btn">Друк</div></div>
    <div class="s-grid"><aside class="s-sider s-sider-wide"><div class="s-sum"><div class="s-big-i">${ic("doc", 28)}</div><b>Договір №0237564а5к</b><div class="s-status">Статус: ${tag("Підписаний", "ok")}</div></div>
      <div class="s-sec"><b>Загальна інформація</b>${ic("down", 14)}</div>
      <div class="s-sider-c" style="gap:12px">${field("Дата створення", "28.10.2025", { dis: 1, i: "cal" })}${field("Номер договору", "0237564а5к", { dis: 1 })}${field("Формат договору", "Страхування", { dis: 1, i: "down" })}${field("Програма продажу", "КАСКО - Все включено - Баз…", { dis: 1 })}${field("Дата початку дії договору", "15.10.2025", { req: 1, dis: 1, i: "cal" })}</div>${collapse()}</aside>
      <section class="s-content"><div class="s-tabs s-tabs-bar"><span class="on">Деталі</span><span>Об'єкт страхування</span><span>Фінансова інформація</span><span>Файли</span><span>Нотатки</span><span>Активність</span><span>Версії договору</span></div>
        <div class="s-pad2"><div class="s-card"><div class="s-card-h"><b>Загальна інформація</b>${ic("up", 16)}</div>
          <div class="s-form">${rowsC.map(r => `<div class="s-row"><div class="s-rl">${r[4] ? '<b class="req">*</b> ' : ""}${r[0]}</div>${inp(r[1], { dis: r[3] === 1 || !r[1], i: r[2] || "" })}</div>`).join("")}</div></div></div></section>
      <aside class="s-ctxcol"><div class="s-ctx-title">${ic("list", 16)}<b>Контекст</b></div>
        ${ctxCard("user", "Страхувальник", 0, ctxItem("user", "Мельник Микола Миколайович", "", "", [["Ідентифікатор:", "2548025319"]]))}
        ${ctxCard("doc", "Пропозиції", 0, ctxItem("doc", "ПР25/0239781", "Підписана", "gray", [["Дата створення:", "04.11.2025"], ["Премія:", "15 205.00"]]))}
        ${ctxCard("car", "Огляд ТЗ", 0, ctxItem("car", "Огляд №АВ/в00100100", "Пройдено успішно", "ok", [["Номер авто:", "АА0152АК"], ["Відповідальний:", "Хоменко Андрій"]]))}</aside></div></div>`;
  }

  function object() {
    return `<div class="scr">${header()}
    <div class="s-pagehead"><span class="s-crumb">Фізичні особи / <b>Мельник Микола Миколайович</b></span><div class="s-grow"></div><div class="s-btn">Переглянути чергу експорту</div></div>
    <div class="s-grid"><aside class="s-sider"><div class="s-sum"><div class="s-big-i round">${ic("user", 30)}</div><b>Мельник Микола Миколайович</b></div>
      <div class="s-sec"><b>Загальна інформація</b>${ic("down", 14)}</div>
      <div class="s-sider-c" style="gap:12px">${field("Прізвище", "Мельник", { req: 1, dis: 1 })}${field("Ім'я", "Микола Миколайович", { req: 1, dis: 1 })}${field("По-батькові", "Миколайович", { req: 1, dis: 1 })}${field("Дата народження", "14.03.1998", { req: 1, dis: 1, i: "cal" })}${field("Стать", "Чоловік", { req: 1, dis: 1, i: "down" })}</div>${collapse()}</aside>
      <section class="s-content"><div class="s-tabs s-tabs-bar"><span class="on">Комунікації</span><span>Нотатки</span><span>Файли</span><span>Файли НПК</span><span>Додаткове</span><span>Фінмоніторинг</span></div>
        <div class="s-pad2"><div class="s-card"><div class="s-card-h"><b>Комунікації</b></div><div class="s-empty">${ic("box", 56)}<span>Комунікацій немає.</span></div></div></div></section>
      <aside class="s-ctxcol"><div class="s-ctx-title">${ic("list", 16)}<b>Контекст</b></div>
        ${ctxCard("doc", "Договори", 1, ctxItem("doc", "№0522275t5т", "Підписаний", "ok", [["Дата початку дії:", "15.10.2025"], ["Премія:", "750.00"]]))}
        ${ctxCard("doc", "Пропозиції в роботі", 0, `<div class="s-empty sm">${ic("box", 40)}<span>Пропозиції, пов'язані з персоною</span></div>`)}
        ${ctxCard("money", "Рахунки", 1, ctxItem("money", "NV001-481-644", "Оплачений", "ok", [["Дата:", "28.10.2025"], ["Сума:", "750.0"]]))}</aside></div></div>`;
  }
  return { list, contract, object };
})();
