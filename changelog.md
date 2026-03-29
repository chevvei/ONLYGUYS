# Changelog

## 2026-03-28（第二十次更新）

- **标题字与轮播同步**：新增 CSS 变量 **`--hero-title-photo`**（默认等同 `--hero-photo`），`.hero-title__text` 改用该变量；**`gallery-carousel.js`** 在每张**图片**幻灯片载入后把 `--hero-title-photo` 设为当前图 URL，**视频**段与无轮播时 `removeProperty` 回退主题主图。`.bg-layer` 仍固定 `--hero-photo`，仅轮播层与标题纹理跟图走。

## 2026-03-28（第十九次更新）

- **留言区位置**：`#comments` 从 `main` 内移至 **页脚之后**，首屏以 Hero + 背景图为主；Hero 增加 **`min-height: calc(100svh - 4.75rem)`**（含 `100dvh` 回退），评论区增加顶部分割线与轻渐变区隔。`docs/design.md` 同步。

## 2026-03-28（第十八次更新）

- **主图路径**：`cv.jpg` / `Qing.jpg` 改放在 **`onlyGuysPic/`**、**`onlyGirlsPic/`** 后，更新 **`css/styles.css`** 中 `--hero-photo` 为 `../onlyGuysPic/cv.jpg` 与 `../onlyGirlsPic/Qing.jpg`；修正 **`gallery-manifest.json`**（补逗号并与当前文件夹内文件一致）；README / `docs/gallery-media.md` / `docs/design.md` / 两图库 README 同步说明。

## 2026-03-28（第十七次更新）

- **`js/gallery-manifest.json`**：为 **`onlyGirlsPic`** 写入与文件夹内素材对应的路径（`Qing.jpg`、`child.jpg`、`west_restaurant.jpg`、`douzhi.mp4`），OnlyGirls 主题下与 OnlyGuys 同样轮播。

## 2026-03-28（第十六次更新）

- **主题图库轮播**：新增 **`onlyGirlsPic/`**、**`onlyGuysPic/`**（根目录散落的 `jpg`/`mp4` 已归入 `onlyGuysPic`）；**`cv.jpg` / `Qing.jpg` 仍留根目录**作底图与标题纹理。通过 **`js/gallery-manifest.json`** 分别为两主题配置播放列表；**`js/gallery-carousel.js`** 叠在底图之上轮播，切换陀螺时分发 **`onlyguys-theme`** 切换列表。性能：图片预取下一张、视频 `preload="metadata"`、单 img/video 复用、长视频有上限时长；**`body.has-gallery-slides`** 时略压低静态底图透明度。文档见 **`docs/gallery-media.md`**，文件夹内 **`README.md`** 说明维护方式。

## 2026-03-28（第十五次更新）

- **评论区**：去掉「访客使用 GitHub 账号登录…Giscus…Discussions」说明段，版面更简洁；删除 `.comments-lead` 样式，标题与面板间距由 `.comments-heading` 下边距承担。

## 2026-03-28（第十四次更新）

- **关于页双计时器**：第一行恢复 **相识累计**（`since` + `timer_lead`，默认 2022-07-16）；第二行 **想靠近你**（`since_near` + `timer_lead_near` / `timer_lead_near_wait`，默认 2026-10-03，未到为倒计时）。去掉正文中关于计时规则的说明段；`index.html` 增加 `#aboutTimerNear` 与 **`data-since-near-fallback`**；`about-loader.js` 同一秒刷新两行；样式为两行计时增加间距。

## 2026-03-28（第十三次更新）

- **关于页**：`content/about.md` 计时起点改为 **北京时间 2026-10-03 0 点**（`since`），引导语改为 **「想靠近你的第…天…时…分…秒」**（`timer_lead`）；新增 **`timer_lead_wait`**，在起点之前显示**倒计时**（默认「距离想靠近你的起点还有」）；正文补充说明与结尾煽情句；`index.html` 的 `data-since-fallback` 与 `about-loader.js` 默认配置同步。

## 2026-03-28（第十二次更新）

- 陀螺提示改为 **悬浮胶囊**：绝对定位在按钮 **正下方**，**不参与顶栏 flex 宽度**（`spin-switch-wrap` 固定 44×44）；缩小字与箭头，箭头 **朝上** 指向陀螺；顶栏 `z-index` + `overflow: visible` 避免被主内容盖住。

## 2026-03-28（第十一次更新）

- **Giscus**：`giscus-config.js` 改为与 `giscus-loader.js` 同为 **`defer`**，并紧挨在 loader 之前，保证执行顺序；`giscus-loader.js` 对 `enabled` / `repoId` / `categoryId` 做规范化与 **`trim`**，未启用时在控制台输出 **`[giscus]`** 诊断说明。
- `docs/operations-manual.md`：补充「仍显示评论区尚未启用」排查项。

## 2026-03-28（第十次更新）

- 修复「点击陀螺有惊喜」在窄屏下被 `max-width: 5.2rem` 压成多行、末字单独成行的问题：去掉过窄限制，**整句单行**（`white-space: nowrap` + `word-break: keep-all`），字号用 `clamp` 略随屏宽缩放。

## 2026-03-28（第九次更新）

- 陀螺旁提示：**「点击陀螺有惊喜」** + 箭头；箭头 **横向弹跳 + 缩放**，线条 **描边明暗脉动**，文案 **轻微缩放与透明度脉动**；平板以上横排，小屏竖排省宽。

## 2026-03-28（第八次更新）

- 陀螺左侧增加 **动态箭头**（横向轻移 + 透明度脉动），提示可点击切换主题；`prefers-reduced-motion` 下改为静态偏移。
- Slogan 改为中文逗号：**「连接真实的人，支持你喜欢的创作者。」**；使用 **Noto Serif SC** 衬线字距、后半句 **渐变字** 与缓慢 `background-position` 动效，整体偏杂志/订阅站质感。

## 2026-03-28（第七次更新）

- 修复「关于 / 发现」点击无反应：导航点击增加 **`stopPropagation`**，文档级关闭仅响应 **遮罩** 与 **关闭按钮**，避免误关；打开弹层时同步加上 **`site-modal--visible`** 并显式设置 **`hidden` 属性**。
- 恢复首页 slogan：**「连接真实的人。支持你喜欢的创作者。」**（不含已删免责声明句）。

## 2026-03-28（第六次更新）

- **发现 / 关于** 改为点击导航后弹出的全屏毛玻璃卡片（顶栏强调线 + 圆角面板 + 动效）；首页不再内嵌「关于」区块。
- **发现** 文案随主题切换：OnlyGuys 为「发现当下的激情和Guy」，OnlyGirls 为「发现当下的暧昧和girl」。
- 删除首页原副标题（含「风格灵感来自主流订阅平台界面，仅为外观演示」整句）。

## 2026-03-28（第五次更新）

- **移除「背景融合」面板**：背景仅由主题在 `cv.jpg` / `Qing.jpg` 间切换，避免误解为「访客可改全站背景」；删除上传图、透明度及相关 CSS/JS。
- **修复 GitHub Pages 上「关于」无法加载**：根目录增加 **`.nojekyll`**，禁用 Jekyll，使 `content/about.md` 可作为静态资源被 `fetch`；更新 `about-loader` 错误提示与文档说明。

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
