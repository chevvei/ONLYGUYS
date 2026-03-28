# Changelog

## 2026-03-28（第四次更新）

- 新增 **关于** 区块（`#about`），导航与抽屉中增加「关于」链接。
- 正文与计时器配置来自 **`content/about.md`**（YAML front matter：`since`、`timer_lead`）；正文支持段落与 `**加粗**`，由 `js/about-loader.js` 拉取并渲染。
- 计时器从 **`since`**（默认 `2022-07-16T00:00:00+08:00`）起算，展示「第 x 天 x 时 x 分 x 秒」；`index.html` 上 `data-since-fallback` 作加载失败时的备用。
- 新增维护文档 **`docs/editing-about.md`**。

## 2026-03-28（第三次更新）

- 左上角 **陀螺形主题开关**：默认慢旋；切换到 **OnlyGirls** 时按钮变红、加速旋转并向外散发爱心粒子。
- 双主题背景：`cv.jpg`（OnlyGuys）与 `Qing.jpg`（OnlyGirls），通过 `body` 上 CSS 变量驱动 `#bgLayer` 与标题字 `background-clip` 同源叠色，并增加 **scrim / vignette** 叠层提升融合感。
- 主题持久化：`localStorage` 键 `onlyguys_theme`；自定义上传仍覆盖背景，「清除」后恢复当前主题默认图。
- 顶栏左侧组合：陀螺 + 品牌字；背景面板文案更新。

## 2026-03-28（第二次更新）

- 视觉调整为**偏 OnlyFans**：青蓝主色（约 `#00AFF0`）、顶栏/页脚弱化橙色条、标题渐变与按钮统一色系。
- 新增 **Giscus** 评论区：`giscus-config.js`、`js/giscus-loader.js`，`index.html` 增加留言区块；未配置时显示占位说明。
- 新增 **[docs/operations-manual.md](docs/operations-manual.md)**：GitHub Pages 部署、Discussions、Giscus 分步配置、故障排查；可选方案（表单、笔记本自建 API）与最佳实践说明。
- 布局：`main` 拆为 `.page-main` + `.hero`，评论区独立于 Hero 垂直居中区域。

## 2026-03-28（初次）

- 初始化静态站点雏形：`index.html`、`css/styles.css`、`js/app.js`。
- 首页大号 OnlyGuys 标题；背景图上传 + 透明度；响应式导航。
- 补充 `README.md`、`docs/design.md` 与本文档。
