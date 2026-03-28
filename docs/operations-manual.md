# OnlyGuys 操作手册（GitHub Pages + 评论）

面向：**把静态站点放到 GitHub Pages**，并让访客能**留言**。按顺序做即可。

---

## 你应该选哪条路？

| 方案 | 是否需要你自己的服务器 | 适合场景 |
|------|------------------------|----------|
| **A. Giscus（推荐）** | 否 | 站点在 GitHub Pages；访客需有 **GitHub 账号** 才能评论；评论存在仓库 **Discussions**，易备份、易管理。 |
| **B. 第三方表单**（如 Formspree） | 否 | 只要「把留言发到邮箱」，不要公开讨论串；通常无 GitHub 登录。 |
| **C. 笔记本自建 API** | 是（长期开机 + 内网穿透） | 需要完全自定义逻辑；**不推荐**作为对外站点的唯一依赖（关机即挂、安全与运维成本高）。 |

**最佳实践**：优先 **方案 A**。本站已预留 Giscus 挂载点，配置见下文「第四步」。

---

## 第一步：准备 GitHub 仓库

1. 登录 [GitHub](https://github.com)。
2. 新建仓库（例如 `onlyGuys`），可见性选 **Public**（Giscus 对私有仓库有额外限制，新手建议公开站点仓库）。
3. 把本地项目推送到该仓库（网页上传或 Git 均可）。
4. 确认仓库根目录有 `index.html`（本仓库已具备）。

---

## 第二步：开启 GitHub Pages

1. 打开仓库页面 → **Settings**（设置）。
2. 左侧进入 **Pages**。
3. **Build and deployment** → **Source** 选你的分支（如 `main`），文件夹选 **`/ (root)`**。
4. 保存后等待 1～3 分钟，会显示站点地址，形如：  
   `https://<你的用户名>.github.io/<仓库名>/`

**若样式或脚本 404**：检查 `index.html` 里引用路径是否为相对路径（本站使用 `css/`、`js/`、`giscus-config.js`，与根目录部署一致）。

---

## 第三步：开启 Discussions 并安装 Giscus

### 3.1 开启 Discussions

1. 仓库 **Settings** → **General** → 找到 **Features**。
2. 勾选 **Discussions**。
3. 到仓库顶部菜单进入 **Discussions**，可新建一个分类（若没有 **General**，可创建一个 **General** 分类，供评论使用）。

### 3.2 安装 Giscus 的 GitHub App

1. 打开 [Giscus 官网（中文）](https://giscus.app/zh-CN)。
2. 按页面说明安装 **Giscus** 这个 GitHub App，并**只授权给你的站点仓库**（最小权限原则）。
3. 在同一页面配置：
   - 选择仓库；
   - 选择映射方式：建议 **pathname**（按页面路径区分讨论串，适合单页也可先用）；
   - 选择 Discussion 分类：例如 **General**；
   - 主题选 **dark**（与当前皮肤一致）；
   - 语言选 **中文**。
4. 页面底部会生成一段 **`<script>`** 配置，其中你需要的是这些属性的值：
   - `data-repo`
   - `data-repo-id`
   - `data-category`
   - `data-category-id`

---

## 第四步：填写本站 `giscus-config.js`

1. 在本地打开项目根目录的 `giscus-config.js`。
2. 将 Giscus 页面生成的值填入对应字段，并设置：

   ```js
   enabled: true,
   ```

3. 务必核对：
   - `repo` 与 `data-repo` 一致（形如 `用户名/仓库名`）；
   - `repoId`、`categoryId` 与页面生成的一致（不要多空格或引号错误）。
4. 保存后提交并 **push** 到 GitHub，等待 Pages 更新（通常几分钟内）。

刷新站点页面，评论区应出现 Giscus 登录与发帖界面。若仍显示「尚未启用」，说明 `enabled` 未为 `true` 或 ID 未填对。

---

## 第五步：验证与日常维护

1. **自己先测**：隐身窗口打开站点，用另一个 GitHub 账号或当前账号登录 Giscus 发一条测试评论。
2. **管理评论**：在仓库 **Discussions** 里可查看、关闭或删除讨论（具体权限与仓库设置有关）。
3. **moderation（建议）**：在 Giscus 配置中按需开启反应、严格模式等；仓库可设置谁能在 Discussions 发帖。

---

## 可选：不用 Giscus 时（Utterances 等）

- **Utterances**：评论写在 **Issues** 里，嵌入方式类似，适合习惯用 Issues 的团队。  
- 本站当前集成的是 **Giscus**；若改用 Utterances，需要替换 `js/giscus-loader.js` 与配置方式（可另开需求再改代码）。

---

## 进阶：用笔记本当「评论服务器」（仅说明，非推荐默认）

仅当你**必须**让「无 GitHub 账号」的用户留言，且接受运维成本时考虑。

### 思路

1. 在笔记本上跑一个小型 HTTP 服务（例如 Node + Express），提供 `POST /comments` 把内容写入 **SQLite** 或 JSON 文件。
2. GitHub Pages 上的静态页用 `fetch('https://你的公网地址/api/...')` 提交留言；列表页再 `GET` 拉取。
3. 家庭宽带没有固定公网 IP 时，需 **内网穿透**（例如 [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)、ngrok 等），把公网 HTTPS 指到你笔记本的端口。

### 最佳实践（若坚持自建）

- **HTTPS**：浏览器会拦截混合内容；穿透工具应提供 TLS。
- **鉴权与限流**：至少加简单人机验证、频率限制、垃圾内容过滤，否则易被刷爆。
- **可用性**：笔记本睡眠、断网、关机都会导致评论功能不可用；长期运行建议换 **云主机** 或仍用 Giscus。
- **CORS**：API 需对 `https://<用户名>.github.io` 放行 `Access-Control-Allow-Origin`（勿用 `*` 携带 Cookie 的场景）。

**结论**：对个人展示站，**Giscus + Discussions** 通常是最省心、最贴合 GitHub Pages 的做法；笔记本服务端仅作特殊需求下的补充方案。

---

## 故障排查速查

| 现象 | 可能原因 |
|------|----------|
| Pages 打开空白 | 根目录没有 `index.html` 或路径部署错（非 root）。 |
| 无样式 | CSS 路径错误；或用了子路径但未改资源前缀（本站为相对路径，一般无此问题）。 |
| Giscus 不显示 | `enabled` 未 `true`；`repoId`/`categoryId` 错误；未安装 Giscus App；仓库未开 Discussions。 |
| 评论发不出去 | 未登录 GitHub；无仓库讨论权限；分类被删或改名后未更新配置。 |
| 「关于」正文不显示 / 提示无法加载 | 未把 `content/about.md` 推送到仓库；本地用 `file://` 打开（需 `npx serve .`）；或缺少根目录 **`.nojekyll`** 导致 GitHub Pages 的 Jekyll 未按原样提供该文件。 |

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `giscus-config.js` | Giscus 开关与仓库/分类 ID（由你在第四步填写）。 |
| `js/giscus-loader.js` | 按配置动态插入 Giscus 脚本。 |
| `index.html` | 评论区 DOM：`#giscus-mount`；「关于」占位：`#about`。 |
| `content/about.md` | 「关于」正文与计时器配置；维护说明见 **`docs/editing-about.md`**。 |

更偏视觉方向的说明见 `docs/design.md`。
