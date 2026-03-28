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

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，将本仓库内容推送上去。
2. 打开仓库 **Settings → Pages**。
3. **Source** 选择分支（如 `main`），文件夹选 **`/ (root)`**。
4. 保存后等待几分钟，通过 `https://<你的用户名>.github.io/<仓库名>/` 访问（若仓库名为 `username.github.io` 则域名为根域名）。

**无需安装 Node、无需后端。** 若页面空白，检查仓库根目录是否有 `index.html`。

## 资源文件

请将 **`cv.jpg`**（OnlyGuys 主题）与 **`Qing.jpg`**（OnlyGirls 主题）放在仓库**根目录**（与 `index.html` 同级），以便 `css/styles.css` 中的 `url("../cv.jpg")` 等路径在 GitHub Pages 上正确加载。

## 功能说明

- 首页超大标题 **OnlyGuys / OnlyGirls**（Bebas Neue），点击左上角**陀螺开关**切换主题；陀螺默认慢旋，切入 Girls 时变红、加速旋转并散发爱心。
- 整体视觉**偏 OnlyFans 系**；全屏摄影背景与标题字通过同一图源 + 叠色融合。
- **上传背景图**：仅在本机浏览器中通过 `FileReader` 预览；**透明度**滑块控制整层背景不透明度（透明度可写入 `localStorage`，大图不持久化）。
- **访客评论**：集成 **Giscus**（GitHub Discussions）。需在 `giscus-config.js` 中填写仓库信息并设 `enabled: true`。

## 操作手册（部署与评论，一步一步）

完整步骤见：**[docs/operations-manual.md](docs/operations-manual.md)**（GitHub Pages 开启、Discussions、Giscus 安装与配置、故障排查；另含「笔记本自建服务端」的说明与取舍）。

## 目录结构

```
index.html
giscus-config.js    ← Giscus 开关与 ID（按手册填写）
content/about.md    ← 「关于」正文与计时器配置（日常只改这个即可）
css/styles.css
js/app.js
js/about-loader.js
js/giscus-loader.js
docs/
  design.md
  operations-manual.md
  editing-about.md  ← 如何编辑 content/about.md
changelog.md
```

「关于」维护说明见 **`docs/editing-about.md`**。设计说明见 `docs/design.md`。
