# OnlyGirls 图库

把要在 **OnlyGirls** 主题下轮播的图片放在本文件夹（建议 `.jpg` / `.webp` / `.png`）。

然后在仓库根目录编辑 **`js/gallery-manifest.json`**，在 **`onlyGirlsPic`** 数组里按顺序写上路径，例如：

```json
"onlyGirlsPic": [
  "onlyGirlsPic/photo1.jpg",
  "onlyGirlsPic/photo2.webp"
]
```

本文件夹内的 **`Qing.jpg`** 为 OnlyGirls **静态底图与标题字纹理**。若 manifest 里 **`onlyGirlsPic`** 为 `[]`，则该主题不显示轮播层，仅有底图；填入路径后即循环轮播。
