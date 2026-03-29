# OnlyGuys 图库

把要在 **OnlyGuys** 主题下轮播的**图片或视频**放在本文件夹。

支持常见扩展名：`.jpg` `.jpeg` `.png` `.webp`、视频 `.mp4` `.webm`。

编辑 **`js/gallery-manifest.json`** 里的 **`onlyGuysPic`** 数组，按播放顺序列出路径，例如：

```json
"onlyGuysPic": [
  "onlyGuysPic/snapshot.jpg",
  "onlyGuysPic/clip.mp4"
]
```

本文件夹内的 **`cv.jpg`** 为 OnlyGuys **静态底图与标题字纹理**（`css/styles.css` → `--hero-photo`）；轮播层叠在上方。若 **`onlyGuysPic`** 在 manifest 里为 `[]`，则仅有底图、无轮播。

## 体积较大时建议

- 图片：导出为 **WebP** 或适当缩小长边（如 1920px）。
- 视频：用工具压成 **H.264 + AAC**、合理码率；过长文件会每轨最多播放约 2 分钟后自动切下一项（见 `gallery-carousel.js` 内 `VIDEO_MAX_MS`）。
