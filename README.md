# OnlyGuys（静态雏形）

纯 HTML / CSS / JavaScript，无构建步骤，适合推送到 **GitHub** 后用 **GitHub Pages** 打开。

## 本地预览

用任意静态服务器打开根目录即可，例如：

```bash
# 若已安装 Node.js
npx --yes serve .

# 或用 Python
python -m http.server 8080
```

在浏览器访问提示的本地地址。

**直接双击 `index.html` 也可以**：「关于」会使用页面内 **`#about-md-fallback`** 的备用正文（与 `content/about.md` 一致）；部署到网站后仍以 **`content/about.md`** 为准，改文案时请两处同步（见 `docs/editing-about.md`）。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，将本仓库内容推送上去。
2. 打开仓库 **Settings → Pages**。
3. **Source** 选择分支（如 `main`），文件夹选 **`/ (root)`**。
4. 保存后等待几分钟，通过 `https://<你的用户名>.github.io/<仓库名>/` 访问（若仓库名为 `username.github.io` 则域名为根域名）。

**无需安装 Node、无需后端。** 若页面空白，检查仓库根目录是否有 `index.html`。

仓库根目录需包含 **`.nojekyll`**（空文件即可），这样 GitHub Pages **不会用 Jekyll 处理站点**，`content/about.md` 才能被正常 `fetch` 到。

## 资源文件

- **主题主图**：**`onlyGuysPic/cv.jpg`**（OnlyGuys）与 **`onlyGirlsPic/Qing.jpg`**（OnlyGirls）作为静态底图与标题字纹理（路径在 `css/styles.css` 的 `--hero-photo`）；请保持这两个文件在上述文件夹内，若改名或移动需同步改 CSS。
- **主题图库轮播**：把更多图片/视频放进 **`onlyGuysPic/`** 或 **`onlyGirlsPic/`**，并在 **`js/gallery-manifest.json`** 里按顺序写好路径；切换陀螺即切换对应列表。说明与性能建议见 **`docs/gallery-media.md`**。

## 功能说明

- 首页超大标题 **OnlyGuys / OnlyGirls**（Bebas Neue），点击左上角**陀螺开关**切换主题；陀螺默认慢旋，切入 Girls 时变红、加速旋转并散发爱心。
- 整体视觉**偏 OnlyFans 系**；全屏背景由 **`onlyGuysPic/cv.jpg` / `onlyGirlsPic/Qing.jpg`** 与 **图库轮播层**（`js/gallery-manifest.json`）叠色融合；访客不能改服务器上的文件。
- **访客评论**：集成 **Giscus**（GitHub Discussions）。需在 `giscus-config.js` 中填写仓库信息并设 `enabled: true`。

## 操作手册（部署与评论，一步一步）

完整步骤见：**[docs/operations-manual.md](docs/operations-manual.md)**（GitHub Pages 开启、Discussions、Giscus 安装与配置、故障排查；另含「笔记本自建服务端」的说明与取舍）。

## 目录结构

```
index.html
.nojekyll           ← 关闭 GitHub Pages 的 Jekyll，保证 about.md 可加载
onlyGuysPic/        ← 含 cv.jpg（Guys 底图 + 可轮播）
onlyGirlsPic/       ← 含 Qing.jpg（Girls 底图 + 可轮播）
creators/           ← 「创作者」弹层头像（cvcv.jpg、QingQing.jpg）
assets/support/     ← 「众筹看世界」微信收款码等（默认 wechat-pay.jpg，见目录内 README）
giscus-config.js    ← Giscus 开关与 ID（按手册填写）
content/about.md    ← 「关于」正文与双行计时器配置（部署后以此为准；请与 index 内 #about-md-fallback 同步）
css/styles.css
js/app.js
js/gallery-manifest.json   ← 两主题轮播文件列表
js/gallery-carousel.js
js/about-loader.js
js/giscus-loader.js
docs/
  design.md
  operations-manual.md
  editing-about.md
  gallery-media.md  ← 图库与 manifest 说明
  support-assets.md ← 众筹收款码目录与扩展说明
changelog.md
```

「关于」维护说明见 **`docs/editing-about.md`**；图库见 **`docs/gallery-media.md`**。设计说明见 `docs/design.md`。
