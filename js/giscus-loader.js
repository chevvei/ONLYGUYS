(function () {
  var mount = document.getElementById("giscus-mount");
  if (!mount) return;

  var raw = typeof window !== "undefined" ? window.ONLYGUYS_GISCUS : null;
  var c = raw
    ? {
        enabled: raw.enabled === true || raw.enabled === "true",
        repo: raw.repo,
        repoId: String(raw.repoId || "").trim(),
        category: raw.category || "General",
        categoryId: String(raw.categoryId || "").trim(),
        mapping: raw.mapping || "pathname",
        strict: raw.strict || "0",
        reactionsEnabled: raw.reactionsEnabled || "1",
        emitMetadata: raw.emitMetadata || "0",
        inputPosition: raw.inputPosition || "bottom",
        theme: raw.theme || "dark",
        lang: raw.lang || "zh-CN",
      }
    : null;

  if (!c || !c.enabled || !c.repoId || !c.categoryId) {
    mount.innerHTML =
      '<p class="giscus-placeholder">评论区尚未启用：请在 <code>giscus-config.js</code> 中填写 Giscus 参数并设 <code>enabled: true</code>。步骤见 <code>docs/operations-manual.md</code>。</p>';
    if (typeof console !== "undefined" && console.warn) {
      if (!raw) {
        console.warn(
          "[giscus] 未读取到 window.ONLYGUYS_GISCUS。请确认 giscus-config.js 已成功加载（浏览器开发者工具 → Network 里应为 200），并已推送到 GitHub Pages。"
        );
      } else if (!c.enabled) {
        console.warn("[giscus] giscus-config.js 里 enabled 不为 true。");
      } else if (!c.repoId || !c.categoryId) {
        console.warn("[giscus] repoId 或 categoryId 为空，请检查 giscus-config.js。");
      }
    }
    return;
  }

  mount.innerHTML = "";
  var box = document.createElement("div");
  box.className = "giscus";
  mount.appendChild(box);

  var s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-repo", c.repo);
  s.setAttribute("data-repo-id", c.repoId);
  s.setAttribute("data-category", c.category);
  s.setAttribute("data-category-id", c.categoryId);
  s.setAttribute("data-mapping", c.mapping);
  s.setAttribute("data-strict", c.strict);
  s.setAttribute("data-reactions-enabled", c.reactionsEnabled);
  s.setAttribute("data-emit-metadata", c.emitMetadata);
  s.setAttribute("data-input-position", c.inputPosition);
  s.setAttribute("data-theme", c.theme);
  s.setAttribute("data-lang", c.lang);
  mount.appendChild(s);
})();
