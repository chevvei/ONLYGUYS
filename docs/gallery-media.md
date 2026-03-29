# 主题图库轮播（OnlyGuys / OnlyGirls）

全站底图与标题字纹理使用 **`onlyGuysPic/cv.jpg`**（Guys）与 **`onlyGirlsPic/Qing.jpg`**（Girls），由 `css/styles.css` 中 **`--hero-photo`** 指向。  
同一文件夹内其他素材由 **`js/gallery-manifest.json`** 列出后**循环轮播**叠在底图之上（图片约 6.5s / 张，视频播完或最长约 2 分钟后切下一项）。主图通常也写在 manifest 第一项，与底图同源。

**标题字纹理**：`OnlyGuys` / `OnlyGirls` 大标题的 `background-clip` 使用 CSS 变量 **`--hero-title-photo`**。有轮播且当前张为**图片**时，由 `gallery-carousel.js` 将其设为当前幻灯片地址，与轮播同步；当前张为**视频**或未开轮播时，回退为与 **`--hero-photo`** 相同（即 `onlyGuysPic/cv.jpg` / `onlyGirlsPic/Qing.jpg`）。全屏底层 `.bg-layer` 始终只用 `--hero-photo`，不因轮播改图。

## 目录

| 文件夹 | 主题 | 支持格式 |
|--------|------|----------|
| `onlyGuysPic/` | `OnlyGuys` | 图片 + `.mp4` / `.webm` |
| `onlyGirlsPic/` | `OnlyGirls` | 图片为主（也可写视频路径） |

## 配置步骤

1. 将文件放入对应文件夹。  
2. 编辑 **`js/gallery-manifest.json`**，在 `onlyGuysPic` 或 `onlyGirlsPic` 数组中**按播放顺序**写入相对站点根的路径，例如 `"onlyGuysPic/foo.jpg"`。  
3. 某主题数组为 **`[]`** 时，该主题不显示轮播层，仅保留静态底图。

## 加载与性能（大文件）

- **不预加载整段视频**：当前项为视频时仅用 `preload="metadata"`；下一项图片用 `Image()` 在后台预取。  
- **单图单视频节点复用**：避免一次创建多个 `<video>` 占内存。  
- **系统开启「减少动态效果」** 时，切换动画几乎关闭，图片停留略延长。  
- 建议：大图转 **WebP**、视频压 **H.264** 并控制分辨率与码率，以减轻 GitHub Pages 首次加载时间。

## 相关文件

| 文件 | 作用 |
|------|------|
| `js/gallery-manifest.json` | 两套主题的文件列表 |
| `js/gallery-carousel.js` | 拉取清单、按主题轮播、响应 `onlyguys-theme` 事件 |
| `js/app.js` | 切换主题时分发 `onlyguys-theme` |
| `css/styles.css` | `.gallery-carousel`、`body.has-gallery-slides` |
