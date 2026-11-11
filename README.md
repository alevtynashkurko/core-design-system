# Core Design System — публічна бібліотека

Статичний сайт (HTML/CSS/JS, без збірки). Відкривайте `index.html` або розмістіть папку на GitHub Pages / Netlify / Vercel.

## Де що оновлювати
| Файл | Що в ньому |
|---|---|
| `data/components.js` | Каталог компонентів і їхні статуси: `ready` 🟢 · `progress` 🟡 · `todo` ⚪. Змінили статус у Figma — змініть слово тут. Це **не** технічний борг. |
| `data/tech-debt.js` | Технічний борг. Додайте обʼєкт у масив. Статуси: `todo`, `progress`, `blocked`, `done`. Для закриття: `status:"done"`, `closed:"РРРР-ММ-ДД"` (+ `resolution`) — запис автоматично потрапить в **Архів**. |
| `data/tokens.js` | Кольори, відступи, радіуси, типографіка, тіні зі Styles-файлу Figma. |

Figma: [Core Components](https://www.figma.com/design/RH0E6rqrg2JdJVpG0nGZb4/Core-Components) · [Styles](https://www.figma.com/design/AS33NnplM58ZP2G32M8QJq/Styles)
