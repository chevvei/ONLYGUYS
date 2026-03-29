/* 年度清单页：与首页共用主题偏好（localStorage） */
(function () {
  var STORAGE_THEME = "onlyguys_theme";

  function applyTheme(girls) {
    document.body.classList.toggle("theme-girls", girls);
    document.body.classList.toggle("theme-guys", !girls);
    var spin = document.getElementById("modeSpin");
    if (spin) {
      spin.setAttribute("aria-pressed", girls ? "true" : "false");
      spin.setAttribute(
        "aria-label",
        girls ? "切换到 OnlyGuys 主题" : "切换到 OnlyGirls 主题"
      );
    }
    var brand = document.getElementById("todoPageBrand");
    if (brand) brand.textContent = girls ? "OnlyGirls" : "OnlyGuys";
    var foot = document.getElementById("footerBrandLink");
    if (foot) foot.textContent = girls ? "OnlyGirls" : "OnlyGuys";
    document.title = (girls ? "OnlyGirls" : "OnlyGuys") + " · 年度清单";
  }

  function loadSavedTheme() {
    try {
      var t = localStorage.getItem(STORAGE_THEME);
      if (t === "girls") {
        applyTheme(true);
        return;
      }
    } catch (_) {}
    applyTheme(false);
  }

  var modeSpin = document.getElementById("modeSpin");
  if (modeSpin) {
    modeSpin.addEventListener("click", function () {
    var girls = !document.body.classList.contains("theme-girls");
    applyTheme(girls);
    try {
      localStorage.setItem(STORAGE_THEME, girls ? "girls" : "guys");
    } catch (_) {}
    document.dispatchEvent(new CustomEvent("onlyguys-theme", { detail: { girls: girls } }));
    });
  }

  loadSavedTheme();

  var navToggle = document.getElementById("navToggle");
  var mobileDrawer = document.getElementById("mobileDrawer");
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener("click", function () {
    if (!mobileDrawer) return;
    if (mobileDrawer.hasAttribute("hidden")) {
      mobileDrawer.removeAttribute("hidden");
    } else {
      mobileDrawer.setAttribute("hidden", "");
    }
    });
  }
})();

