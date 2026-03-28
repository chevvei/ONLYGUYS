(function () {
  var mount = document.getElementById("giscus-mount");
  if (!mount) return;

  var c = typeof window !== "undefined" ? window.ONLYGUYS_GISCUS : null;
  if (!c || !c.enabled || !c.repoId || !c.categoryId) {
    mount.innerHTML =
      '<p class="giscus-placeholder">评论区尚未启用：请在 <code>giscus-config.js</code> 中填写 Giscus 参数并设 <code>enabled: true</code>。步骤见 <code>docs/operations-manual.md</code>。</p>';
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
  s.setAttribute("data-mapping", c.mapping || "pathname");
  s.setAttribute("data-strict", c.strict || "0");
  s.setAttribute("data-reactions-enabled", c.reactionsEnabled || "1");
  s.setAttribute("data-emit-metadata", c.emitMetadata || "0");
  s.setAttribute("data-input-position", c.inputPosition || "bottom");
  s.setAttribute("data-theme", c.theme || "dark");
  s.setAttribute("data-lang", c.lang || "zh-CN");
  mount.appendChild(s);
})();
