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

| 字段 | 含义 | 示例 |
|------|------|------|
| `since` | 相识起始时刻（ISO 8601，建议带时区） | `2022-07-16T00:00:00+08:00` 表示 **北京时间 2022 年 7 月 16 日 0 点** |
| `timer_lead` | 计时器前面那句文案（后面会自动接「x 天 x 时 x 分 x 秒」） | `这是 cv 和 Qing 相识的第` |

改 `since` 会改变「第几天」的计算；改 `timer_lead` 只改句式，不动时间。

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

页面会显示简短提示；计时器仍会使用 `index.html` 里 `section#about` 上的 **`data-since-fallback`** 作为备用起点（与默认 `since` 保持一致即可）。请先对照上一节检查 **`.nojekyll`** 与文件是否已推送。

---

## 相关代码（一般不必改）

| 文件 | 作用 |
|------|------|
| `js/about-loader.js` | 拉取 `content/about.md`、解析 front matter、渲染正文、每秒刷新计时器 |
| `index.html` | `#about` 区块占位；`data-since-fallback` 为备用时间 |
