# Core Design System — публічна бібліотека

Статичний сайт (HTML/CSS/JS, без збірки). Відкривайте `index.html` або розмістіть папку на GitHub Pages / Netlify / Vercel.

## Де що оновлювати
| Файл | Що в ньому |
|---|---|
| `data/components.js` | Каталог компонентів і їхні статуси: `ready` 🟢 · `progress` 🟡 · `todo` ⚪. Змінили статус у Figma — змініть слово тут. Це **не** технічний борг. |
| `data/tech-debt.js` | Технічний борг. Додайте обʼєкт у масив. Статуси: `todo`, `progress`, `blocked`, `done`. Для закриття: `status:"done"`, `closed:"РРРР-ММ-ДД"` (+ `resolution`) — запис автоматично потрапить в **Архів**. |
| `data/tokens.js` | Кольори, відступи, радіуси, типографіка, тіні зі Styles-файлу Figma. |

Figma: [Core Components](https://www.figma.com/design/RH0E6rqrg2JdJVpG0nGZb4/Core-Components) · [Styles](https://www.figma.com/design/AS33NnplM58ZP2G32M8QJq/Styles)

## Превʼю та документація компонентів
Сторінки компонентів (`#/components/<назва>`) генеруються зі Figma скриптом — тексти документації, зображення (превʼю, варіанти, анатомія, Do & Don't) і таблиця властивостей.

1. Створіть токен у Figma: Settings → Security → Personal access tokens (доступ **File content: Read-only**).
2. Запустіть (потрібен Node 18+):
```bash
FIGMA_TOKEN=figd_xxx node scripts/sync-figma.mjs            # усі компоненти
FIGMA_TOKEN=figd_xxx node scripts/sync-figma.mjs button tag # лише вибрані
```
3. Закомітьте `data/component-docs.js` і папку `assets/`. Токен нікуди не потрапляє.

Запускайте скрипт щоразу, коли оновили компонент або його документацію у Figma.

## Теми (світла / темна)
- `data/tokens.js` — єдине джерело токенів. Темна тема: `neutral[..][3]` і `scale.*.darkOverride` (примітиви), `semanticDark` (лише переозначені семантичні токени), `shadowsDark`.
- `node scripts/build-tokens.mjs` — генерує `css/tokens.css` (змінні для `data-theme="light|dark"`) і `tokens/design-tokens.json`.
- Екрани-приклади для сторінки «Темна тема»: `js/screens.js` + `css/screens.css`.
