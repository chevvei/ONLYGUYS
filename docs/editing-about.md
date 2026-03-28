# 如何编辑「关于」区块

网页上的 **关于** 文字与计时器起点，都来自仓库里的 **`content/about.md`**。  
平时只要改这个文件并推送到 GitHub，无需打开 `index.html`。

---

## 文件位置

```
content/about.md
```

---

## 文件结构（两段）

### 1. 顶部配置区（YAML，在两条 `---` 之间）

页面上有 **两行计时器**（每秒刷新），对应两套字段：

**第一行（例如「相识」累计）**

| 字段 | 含义 | 示例 |
|------|------|------|
| `since` | 第一行计时起点（ISO 8601，建议带时区） | `2022-07-16T00:00:00+08:00` |
| `timer_lead` | **已过起点**时的引导语（后接「x 天 x 时 x 分 x 秒」） | `这是 cv 和 Qing 相识的第` |
| `timer_lead_wait` | **未到起点**时的引导语（后接还剩的「x 天 x 时 x 分 x 秒」）；一般相识日在过去，可不写 | `距离相识还有` |

**第二行（例如「想靠近你」：未到 `since_near` 为倒计时，之后为累计）**

| 字段 | 含义 | 示例 |
|------|------|------|
| `since_near` | 第二行计时起点 | `2026-10-03T00:00:00+08:00` |
| `timer_lead_near` | **已过起点**时的引导语 | `想靠近你的第` |
| `timer_lead_near_wait` | **未到起点**时的引导语 | `距离想靠近你的起点还有` |

改 `since` / `since_near` 会改变数字；其余字段只改句式。

### 2. 正文（配置区下面的 Markdown）

- **空一行** = 新段落。
- 用一对 `**文字**` 表示**加粗**（不要写 HTML 标签）。
- 段内换行会显示为换行（`<br>`）。

---

## 示例模板

```markdown
---
since: 2022-07-16T00:00:00+08:00
timer_lead: 这是 cv 和 Qing 相识的第
since_near: 2026-10-03T00:00:00+08:00
timer_lead_near: 想靠近你的第
timer_lead_near_wait: 距离想靠近你的起点还有
---

本站由 **cv** 创作，记录关于我和我的女孩的一切。

在这里写甜言蜜语、纪念日、想对 Qing 说的话……
```

---

## 本地预览注意

`about.md` 由浏览器 **fetch** 加载。若你是直接双击打开 `index.html`（`file://`），有时会加载失败。请用静态服务器打开项目根目录，例如：

```bash
npx --yes serve .
```

## GitHub Pages 与 `.nojekyll`

GitHub Pages 默认会用 **Jekyll** 构建站点，可能导致 `content/about.md` **无法按原路径访问**，页面会显示「无法加载」。

本仓库在根目录放了空的 **`.nojekyll`** 文件，用于**关闭 Jekyll**，让 `content/about.md` 作为静态文件被访问。推送时请勿删掉该文件。

部署后若仍失败，确认 **`content/about.md` 已提交** 并等待 Pages 刷新几分钟。

---

## 若加载失败

页面会显示简短提示；两行计时器仍会使用 `index.html` 里 **`#modalAbout`** 上的 **`data-since-fallback`**、**`data-since-near-fallback`** 作为备用起点（与 `content/about.md` 里默认保持一致即可）。请先对照上一节检查 **`.nojekyll`** 与文件是否已推送。

---

## 相关代码（一般不必改）

| 文件 | 作用 |
|------|------|
| `js/about-loader.js` | 拉取 `content/about.md`、解析 front matter、渲染正文、每秒刷新两行计时器 |
| `index.html` | 弹出层 `#modalAbout`；`#aboutTimer` / `#aboutTimerNear`；两行备用时间属性 |
