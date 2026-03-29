# 众筹 / 赞助素材说明

## 目录

所有赞助相关**静态图**放在 **`assets/support/`**，与 `creators/`、`onlyGuysPic/` 等并列，避免堆在项目根目录。

详见该目录下的 **[`assets/support/README.md`](../assets/support/README.md)**。

## 页面行为

- 顶栏 **「订阅」右侧** 为 **「众筹看世界」**，与 **发现 / 创作者 / 关于** 一样通过 **`data-open-modal`** 打开弹层。
- 弹层内展示 **`assets/support/wechat-pay.jpg`**。更新收款码：覆盖该文件并推送即可。

## 扩展

在 **`index.html`** 中搜索 **`modalSupport`**，可在此弹层内增加第二收款方式、短文案或外链；大图建议继续放在 **`assets/support/`** 并沿用「语义化文件名」。
