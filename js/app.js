(function () {
  const bgLayer = document.getElementById("bgLayer");
  const bgUpload = document.getElementById("bgUpload");
  const bgOpacity = document.getElementById("bgOpacity");
  const opacityOut = document.getElementById("opacityOut");
  const clearBg = document.getElementById("clearBg");
  const navToggle = document.getElementById("navToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const modeSpin = document.getElementById("modeSpin");
  const spinHearts = document.getElementById("spinHearts");
  const brandMark = document.getElementById("brandMark");
  const heroTitleText = document.querySelector(".hero-title__text");
  const footerBrand = document.getElementById("footerBrand");

  const STORAGE_OPACITY = "onlyguys_bg_opacity";
  const STORAGE_THEME = "onlyguys_theme";

  let customBgOverride = false;

  function setOpacityPercent(percent) {
    const p = Math.max(0, Math.min(100, Number(percent)));
    const dec = p / 100;
    document.documentElement.style.setProperty("--hero-opacity", String(dec));
    if (opacityOut) opacityOut.textContent = `${Math.round(p)}%`;
    if (bgOpacity) bgOpacity.value = String(Math.round(p));
    try {
      localStorage.setItem(STORAGE_OPACITY, String(Math.round(p)));
    } catch (_) {}
  }

  function applySavedOpacity() {
    try {
      const saved = localStorage.getItem(STORAGE_OPACITY);
      if (saved != null && !Number.isNaN(Number(saved))) {
        setOpacityPercent(saved);
        return;
      }
    } catch (_) {}
    setOpacityPercent(bgOpacity ? bgOpacity.value : 38);
  }

  function applyThemeBackground() {
    if (!bgLayer || customBgOverride) return;
    bgLayer.style.removeProperty("background-image");
  }

  function isGirlsTheme() {
    return document.body.classList.contains("theme-girls");
  }

  function setUiTexts(girls) {
    const label = girls ? "OnlyGirls" : "OnlyGuys";
    if (heroTitleText) heroTitleText.textContent = label;
    if (brandMark) brandMark.textContent = label;
    if (footerBrand) footerBrand.textContent = label;
    document.title = label;
    if (modeSpin) {
      modeSpin.setAttribute("aria-pressed", girls ? "true" : "false");
      modeSpin.setAttribute(
        "aria-label",
        girls ? "切换到 OnlyGuys 主题" : "切换到 OnlyGirls 主题"
      );
    }
  }

  function burstHearts() {
    if (!spinHearts) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "heart-particle";
      el.textContent = "\u2764";
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
      const dist = 40 + Math.random() * 36;
      el.style.setProperty("--hx", `${Math.cos(angle) * dist}px`);
      el.style.setProperty("--hy", `${Math.sin(angle) * dist}px`);
      el.style.animationDuration = `${0.85 + Math.random() * 0.45}s`;
      spinHearts.appendChild(el);
      window.setTimeout(function () {
        el.remove();
      }, 1400);
    }
  }

  function pulseSpin() {
    if (!modeSpin) return;
    modeSpin.classList.add("is-pulse");
    window.setTimeout(function () {
      modeSpin.classList.remove("is-pulse");
    }, 900);
  }

  function applyTheme(girls, opts) {
    const burst = opts && opts.burstHearts;
    document.body.classList.toggle("theme-girls", girls);
    document.body.classList.toggle("theme-guys", !girls);
    setUiTexts(girls);
    applyThemeBackground();
    try {
      localStorage.setItem(STORAGE_THEME, girls ? "girls" : "guys");
    } catch (_) {}
    if (burst) {
      burstHearts();
      pulseSpin();
    }
  }

  function toggleTheme() {
    const next = !isGirlsTheme();
    applyTheme(next, { burstHearts: next });
  }

  function loadSavedTheme() {
    try {
      const t = localStorage.getItem(STORAGE_THEME);
      if (t === "girls") {
        applyTheme(true, { burstHearts: false });
        return;
      }
    } catch (_) {}
    applyTheme(false, { burstHearts: false });
  }

  bgUpload?.addEventListener("change", function () {
    const file = this.files && this.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = function () {
      const url = reader.result;
      if (typeof url === "string" && bgLayer) {
        customBgOverride = true;
        bgLayer.style.backgroundImage = `url(${JSON.stringify(url)})`;
      }
    };
    reader.readAsDataURL(file);
  });

  clearBg?.addEventListener("click", function () {
    customBgOverride = false;
    if (bgUpload) bgUpload.value = "";
    applyThemeBackground();
  });

  bgOpacity?.addEventListener("input", function () {
    setOpacityPercent(this.value);
  });

  modeSpin?.addEventListener("click", function () {
    toggleTheme();
  });

  applySavedOpacity();
  loadSavedTheme();

  navToggle?.addEventListener("click", function () {
    if (!mobileDrawer) return;
    const open = mobileDrawer.hasAttribute("hidden");
    if (open) {
      mobileDrawer.removeAttribute("hidden");
    } else {
      mobileDrawer.setAttribute("hidden", "");
    }
  });
})();
