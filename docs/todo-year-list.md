# 年度清单（`todo.html`）说明与「远端同步」方案

## 推荐用法：只改仓库里的一个文件（对照网页）

1. 在本地用编辑器打开 **`data/year-todos.json`**（已纳入仓库，部署后可通过 URL 访问）。
2. 按 **`version` / `activeYear` / `lists`** 结构增删改条目；每条保留稳定 **`id`**（字符串），便于浏览器记住你在网页上勾选的「已完成」状态。
3. 保存后执行 **`git add data/year-todos.json`** → **`git commit`** → **`git push`**。
4. 打开线上 **`todo.html`**：页面加载时会自动 **`fetch`** 该文件；也可随时点 **「从仓库同步」** 拉最新正文。
5. **勾选「已完成」** 只写入本机 **`localStorage`**，不会自动写回 GitHub；同步仓库 JSON 时，会按 **同年同 `id`** 尽量保留你已勾选状态。

公开仓库时请勿把隐私写进该 JSON。

## 页面做什么（界面与数据）

- **视觉**：与全站一致的 **夜间深色**、玻璃拟态面板、细横线格、左侧主题色竖条；**思源宋 + Inter**，偏简洁阅读感。
- **按年管理**：下拉选择年份；可 **新增年度**、**删除当前年度**（需确认）。
- **条目**：**添加一行**、**勾选完成**（灰字 + 删除线）、**删除单行**；在浏览器里的修改会进 **localStorage**，与仓库文件 **双向独立**，以你 **push 的 `data/year-todos.json`** 为正文权威来源（同步时合并勾选）。
- **本地备份**：仍可用 **导出 / 复制 / 导入 JSON**（例如换电脑前备份整份状态）。

## 和 GitHub Pages 的关系

**GitHub Pages 只托管静态文件**，没有私人数据库。把清单「推送到远端」= **把 JSON 提交进仓库并由 Pages 提供下载**；无需服务器。

下面补充其它可选方案（多设备云同步、自建 API 等）。

---

### 方案 A（零服务器，与当前实现一致）：维护 `data/year-todos.json` + `git push`

见上文 **推荐用法**。若暂时无法访问仓库文件（例如本地用 `file://` 打开页面），`fetch` 会失败，此时仍可使用 **localStorage** 或 **导入 JSON**。

---

### 方案 B（推荐若要多设备实时同步）：Supabase 或 Firebase 等 BaaS

**适合**：手机 / 多台电脑同步、愿意注册免费云服务、能阅读简单文档配置密钥。

- 用 **Supabase**（PostgreSQL）或 **Firebase**（Firestore）存 `lists` / `activeYear` 等字段。
- 前端用官方 JS SDK，匿名登录或邮箱登录均可。
- **不要把管理员密钥写进公开仓库**；使用 **anon 公钥 + 行级安全策略（RLS）** 限制读写范围。

这是 **个人项目里性价比最高的「真云端」**，仍可与 GitHub Pages 静态托管并存。

---

### 方案 C：Cloudflare Workers + D1 / KV

**适合**：已用 Cloudflare、希望接口完全在自己账号下、数据量小。

- Worker 提供 `GET/PUT` JSON；D1 或 KV 存数据。
- Pages 与 Worker 同账号绑定路由即可。

运维比 BaaS 略重，但无冷启动数据库厂商锁定问题（相对）。

---

### 方案 D：自建小 API（笔记本 / VPS）

**适合**：你已有长期在线的服务器。

- Node、Python 等任意栈，数据库 SQLite 即可。
- 前端 `fetch('https://你的域名/api/todos')`。

**不推荐**仅依赖家里笔记本：睡眠、断网、关机都会导致站点「能打开但清单同步失败」；若坚持，需内网穿透 + 长期插电，见 **`docs/operations-manual.md`** 里对「笔记本当服务器」的说明。

---

### 方案 E（一般不建议）：在浏览器里用 GitHub Personal Access Token 调 Contents API

技术上可以 `PUT` 更新仓库文件，但 **Token 落在浏览器 = 泄露即仓库被改写**。仅建议在 **私有插件 / 本地 Electron** 等可信环境使用，不要塞进公开的 GitHub Pages 页面。

---

## 数据格式（与导出文件一致）

```json
{
  "version": 1,
  "activeYear": "2026",
  "lists": {
    "2026": [{ "id": "唯一id", "text": "文案", "done": false }]
  }
}
```

线上正文默认读 **`data/year-todos.json`**；**`data/year-todos.sample.json`** 仅为格式示例副本。

## 小结

| 需求           | 建议                         |
| -------------- | ---------------------------- |
| 单机记录、备份 | 当前页面 + **导出/导入 JSON** |
| 公开站展示默认 | **A** + 可选 `fetch` 默认 JSON |
| 多设备云同步   | **B** Supabase / Firebase    |
| 全栈自控       | **C** 或 **D**               |

当前仓库选择 **localStorage + 导出/导入**，是为了在 **无后端、无构建** 的前提下功能完整；要「一键上云」时，优先考虑 **方案 B**。
