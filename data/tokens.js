// Дані зі Styles (Figma: AS33NnplM58ZP2G32M8QJq). Оновлюйте при зміні стилів у Figma.
window.TOKENS = {
  // [назва, світла тема, опис, темна тема]
  neutral: [
    ["Neutral/1000","#000000","","#ffffff"],["Neutral/900","#202022","Основний текст на білому тлі","#fafafa"],["Neutral/800","#343437","","#f2f2f3"],
    ["Neutral/700","#48484c","","#e4e5e7"],["Neutral/600","#5c5c61","","#caccce"],["Neutral/500","#6e7077","Вторинний текст","#b0b2b6"],
    ["Neutral/400","#84868c","","#9a9ca1"],["Neutral/300","#9a9ca1","","#84868c"],["Neutral/200","#b0b2b6","Disabled текст","#6e7077"],
    ["Neutral/100","#d7d9da","","#5c5c61"],["Neutral/50","#f1f2f3","","#48484c"],["Neutral/25","#fafafa","Disabled фон","#343437"],["Neutral/0","#ffffff","","#000000"]
  ],
  // Світла тема, ступені 50…900. Темна тема = дзеркальний порядок (див. app.js), крім overrides.
  scale: {
    Purple: { steps:["fdf5ff","f7eafb","edd9f1","d99ceb","b439d8","a108ce","8305a9","510467","30023e","100115"], notes:{500:"Основні / активні / вибрані елементи",600:"Hover"}, darkOverride:{50:"1a0222"} },
    Blue:   { steps:["e5efff","ccdeff","b2ceff","98beff","7eaeff","649eff","5081d2","3c63a4","284576","142748"], notes:{500:"Основні / активні / вибрані елементи",600:"Hover"} },
    Orange: { steps:["fff9f5","fff0e5","ffdecc","ffae80","ff995e","ff843c","c15515","532b13","331a0c","190d06"], notes:{500:"Вторинні елементи",600:"Hover"} },
    Green:  { steps:["f5fffa","eafbf3","d6f5e6","5cd39a","2ec47c","00b55e","00964d","006635","00361c","001209"], notes:{500:"Success"} },
    Yellow: { steps:["fffcf5","fff8e5","fff1cc","ffde86","ffd567","ffcc48","d2a638","806624","4c3d16","191407"], notes:{500:"Warning"} },
    Red:    { steps:["fef7f6","fceae8","f9d5d2","ed7d74","e54034","e33326","bb281f","721a13","440f0b","170504"], notes:{500:"Danger"} }
  },
  // Семантичні токени (Light mode). Dark mode у Figma ще не налаштований.
  semantic: {
    "Text/Neutral/Text":"Neutral/900","Text/Neutral/Text-subtitle":"Neutral/800","Text/Neutral/Text-description":"Neutral/500",
    "Text/Neutral/Text-placeholder":"Neutral/200","Text/Neutral/Text-disabled":"Neutral/200","Text/Neutral/Text-disabled-filled":"Neutral/400",
    "Text/Accent/Primary-text":"Blue/500","Text/Accent/Primary-text-hover":"Blue/400","Text/Accent/Primary-text-focused":"Blue/600",
    "Text/Accent/Secondary-text":"Orange/500","Text/Accent/Secondary-text-hover":"Orange/400","Text/Accent/Secondary-text-focused":"Orange/600","Text/Accent/Secondary-text-bold":"Orange/800",
    "Text/Accent/Success-text":"Green/500","Text/Accent/Success-text-bold":"Green/800","Text/Accent/Warning-text":"Yellow/600","Text/Accent/Warning-text-bold":"Yellow/800",
    "Text/Accent/Danger-text":"Red/500","Text/Accent/Danger-text-hover":"Red/400","Text/Accent/Danger-text-focused":"Red/600","Text/Accent/Danger-text-bold":"Red/800",
    "Text/Accent/Info-text":"Blue/500","Text/Accent/Info-text-bold":"Blue/800",
    "Text/Inverse/Default-inverse":"Neutral/0","Text/Inverse/Warning-inverse":"Yellow/800",
    "Link/Text-link":"Blue/500","Link/Text-link-hover":"Blue/400","Link/Text-link-pressed":"Blue/600",
    "Icon/Neutral/Icon":"Neutral/900","Icon/Neutral/Icon-subtitle":"Neutral/400","Icon/Neutral/Icon-placeholder":"Neutral/200","Icon/Neutral/Icon-disabled":"Neutral/200",
    "Icon/Accent/Primary-icon":"Blue/500","Icon/Accent/Primary-icon-hover":"Blue/400","Icon/Accent/Primary-icon-focused":"Blue/600",
    "Icon/Accent/Secondary-icon":"Orange/500","Icon/Accent/Secondary-icon-hover":"Orange/400","Icon/Accent/Secondary-icon-focused":"Orange/600",
    "Icon/Accent/Success-icon":"Green/500","Icon/Accent/Warning-icon":"Yellow/500",
    "Icon/Accent/Danger-icon":"Red/500","Icon/Accent/Danger-icon-hover":"Red/400","Icon/Accent/Danger-icon-focused":"Red/600","Icon/Accent/Info-icon":"Blue/500",
    "Icon/Inverse/Inverse-icon":"Neutral/0","Icon/Inverse/Warning-inverse-icon":"Neutral/900",
    "BG/Neutral/BG-default":"Neutral/0","BG/Neutral/BG-grey-light":"Neutral/50","BG/Neutral/BG-grey-default":"Neutral/200","BG/Neutral/BG-grey-bold":"Neutral/400",
    "BG/Input/BG-input":"Neutral/0","BG/Input/BG-input-disabled":"Neutral/25","BG/Input/BG-input-hover":"Blue/50","BG/Input/BG-input-selected":"Blue/100",
    "BG/Actions/BG-primary":"Orange/500","BG/Actions/BG-primary-hover":"Orange/400","BG/Actions/BG-primary-focused":"Orange/600",
    "BG/Actions/BG-secondary":"Blue/500","BG/Actions/BG-secondary-hover":"Blue/400","BG/Actions/BG-secondary-focused":"Blue/600",
    "BG/Actions/BG-tertiary":"Orange/100","BG/Actions/BG-danger":"Red/100",
    "BG/Actions/BG-danger-bold":"Red/500","BG/Actions/BG-danger-bold-hover":"Red/400","BG/Actions/BG-danger-bold-focused":"Red/600",
    "BG/Accent/BG-success":"Green/100","BG/Accent/BG-success-hover":"Green/200","BG/Accent/BG-success-bold":"Green/500",
    "BG/Accent/BG-warning":"Yellow/100","BG/Accent/BG-warning-hover":"Yellow/200","BG/Accent/BG-warning-bold":"Yellow/500",
    "BG/Accent/BG-danger":"Red/100","BG/Accent/BG-danger-bold":"Red/500","BG/Accent/BG-danger-bold-hover":"Red/400","BG/Accent/BG-danger-bold-focused":"Red/600",
    "BG/Accent/BG-info":"Blue/50","BG/Accent/BG-info-hover":"Blue/200","BG/Accent/BG-info-pressed":"Blue/100","BG/Accent/BG-info-bold":"Blue/500",
    "BG/Inverse/BG-inverse":"Neutral/900","BG/Overlay/BG-overlay":"#00000040","BG/Overlay/BG-tooltip":"#000000bf",
    "Border/Neutral/Border-default":"Neutral/100","Border/Neutral/Border-light":"Neutral/50","Border/Neutral/Border-bold":"Neutral/400",
    "Border/Neutral/Border-input":"Neutral/100","Border/Neutral/Border-active":"Blue/500","Border/Neutral/Border-selected":"Blue/500","Border/Neutral/Border-disabled":"Neutral/100",
    "Border/Accent/Primary-border":"Orange/500","Border/Accent/Primary-border-hover":"Orange/400","Border/Accent/Primary-border-focused":"Orange/600",
    "Border/Accent/Secondary-border":"Blue/500","Border/Accent/Secondary-border-hover":"Blue/400","Border/Accent/Secondary-border-focused":"Blue/600",
    "Border/Accent/Success-border":"Green/500","Border/Accent/Warning-border":"Yellow/500",
    "Border/Accent/Danger-border":"Red/500","Border/Accent/Danger-border-hover":"Red/400","Border/Accent/Danger-border-focused":"Red/600","Border/Accent/Info-border":"Blue/500",
    "Border/Inverse/Border-inverse":"Neutral/25"
  },
  // Темна тема: токени, що НЕ повторюють світлий аліас. Усі інші беруть той самий аліас, але з темного набору примітивів (Colors primitives → Dark Mode).
  // Логіка: поверхні — Neutral/0 (фон сторінки) і Neutral/25 (картки); hover світліший, pressed/focused темніший; danger-текст світліший для контрасту ≥ 4.5.
  semanticDark: {
    "BG/Accent/BG-danger-bold-focused":"Red/400",
    "BG/Accent/BG-info-bold":"Blue/300",
    "BG/Accent/BG-danger-bold-hover":"Red/600",
    "BG/Actions/BG-danger-bold-focused":"Red/400",
    "BG/Actions/BG-danger-bold-hover":"Red/600",
    "BG/Actions/BG-primary-focused":"Orange/400",
    "BG/Actions/BG-primary-hover":"Orange/600",
    "BG/Actions/BG-secondary-focused":"Blue/400",
    "BG/Actions/BG-secondary-hover":"Blue/600",
    "BG/Neutral/BG-default":"Neutral/25",
    "BG/Neutral/BG-grey-light":"Neutral/0",
    "BG/Overlay/BG-overlay":"#000000a6",
    "BG/Overlay/BG-tooltip":"#fafafabf",
    "Border/Accent/Danger-border-focused":"Red/400",
    "Border/Accent/Danger-border-hover":"Red/600",
    "Border/Accent/Primary-border-focused":"Orange/400",
    "Border/Accent/Primary-border-hover":"Orange/600",
    "Border/Accent/Secondary-border-focused":"Blue/400",
    "Border/Accent/Secondary-border-hover":"Blue/600",
    "Icon/Accent/Danger-icon":"Red/600",
    "Icon/Accent/Danger-icon-focused":"Red/500",
    "Icon/Accent/Danger-icon-hover":"Red/700",
    "Icon/Accent/Primary-icon-focused":"Blue/400",
    "Icon/Accent/Primary-icon-hover":"Blue/600",
    "Icon/Accent/Secondary-icon-focused":"Orange/400",
    "Icon/Accent/Secondary-icon-hover":"Orange/600",
    "Link/Text-link-hover":"Blue/600",
    "Link/Text-link-pressed":"Blue/400",
    "Text/Accent/Danger-text":"Red/600",
    "Text/Accent/Danger-text-focused":"Red/500",
    "Text/Accent/Danger-text-hover":"Red/700",
    "Text/Accent/Primary-text-focused":"Blue/400",
    "Text/Accent/Primary-text-hover":"Blue/600",
    "Text/Accent/Secondary-text-focused":"Orange/400",
    "Text/Accent/Secondary-text-hover":"Orange/600"
  },
  spacing: [["None",0],["3XS",2],["2XS",4],["XS",6],["S",8],["M",12],["L",16],["XL",20],["2XL",24],["3XL",32],["4XL",48],["5XL",56],["6XL",64],["7XL",72],["8XL",80],["9XL",96]],
  radius: [["None",0,""],["XS",2,""],["S",4,"Buttons, Inputs, Modals, Menus, Status, Scroll, Tags, Date picker"],["M",6,""],["L",8,""],["XL",12,""],["2XL",16,""],["3XL",24,""],["99XL",9999,"Повне заокруглення (pill / circle)"]],
  typography: {
    family: "Source Sans Pro", mono: "Source Code Pro",
    // [група, розмір px, line-height %]
    groups: [["H1",38,120],["H2",30,134],["H3",24,134],["H4",20,142],["H5",16,152],["Body",14,160],["Description",12,150]],
    weights: { "700":"Bold","600":"SemiBold","400":"Regular" },
    // які ваги є в групі
    available: { Description:["600","400"] },
    special: [["Underline","underline"],["Strikethrough","line-through"],["Italic","italic"],["Code","code"]]
  },
  shadows: [
    ["Shadow - Level 1","0 6px 20px 0 rgba(0,0,0,.1), 0 1px 6px 0 rgba(0,0,0,.1)","Тінь елемента, наприклад Cookie banner."],
    ["Shadow - Level 2","0 8px 16px 0 rgba(0,0,0,.15), 0 2px 8px 0 rgba(0,0,0,.15)","Найінтенсивніша тінь: Float button, Dropdown, Cascader Menu тощо."],
    ["Input - Active","0 0 0 3px rgba(116,174,255,.2)","Активний стан інпутів."],
    ["Shadow - Float button","0 9px 28px 8px rgba(0,0,0,.05), 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)","Float button."]
  ],
  // Темна тема: тіні майже невидимі на темному тлі, тому непрозорість збільшена.
  shadowsDark: [
    "0 6px 20px 0 rgba(0,0,0,.45), 0 1px 6px 0 rgba(0,0,0,.45)",
    "0 8px 16px 0 rgba(0,0,0,.6), 0 2px 8px 0 rgba(0,0,0,.6)",
    "0 0 0 3px rgba(126,174,255,.3)",
    "0 9px 28px 8px rgba(0,0,0,.25), 0 3px 6px -4px rgba(0,0,0,.5), 0 6px 16px 0 rgba(0,0,0,.4)"
  ]
};
