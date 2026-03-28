(function () {
  const bgLayer = document.getElementById("bgLayer");
  const navToggle = document.getElementById("navToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const modeSpin = document.getElementById("modeSpin");
  const spinHearts = document.getElementById("spinHearts");
  const brandMark = document.getElementById("brandMark");
  const heroTitleText = document.querySelector(".hero-title__text");
  const footerBrand = document.getElementById("footerBrand");
  const modalDiscover = document.getElementById("modalDiscover");
  const modalAbout = document.getElementById("modalAbout");
  const discoverModalLead = document.getElementById("discoverModalLead");

  const STORAGE_THEME = "onlyguys_theme";

  function applyThemeBackground() {
    if (!bgLayer) return;
    bgLayer.style.removeProperty("background-image");
  }

  function isGirlsTheme() {
    return document.body.classList.contains("theme-girls");
  }

  function refreshDiscoverLead() {
    if (!discoverModalLead) return;
    discoverModalLead.textContent = isGirlsTheme()
      ? "发现当下的暧昧和girl"
      : "发现当下的激情和Guy";
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
    refreshDiscoverLead();
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

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.setAttribute("hidden", "");
  }

  function closeModals() {
    [modalDiscover, modalAbout].forEach(function (el) {
      if (!el) return;
      el.classList.remove("site-modal--visible");
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("modal-open");
  }

  function openModal(el) {
    if (!el) return;
    closeModals();
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(function () {
      el.classList.add("site-modal--visible");
    });
  }

  function openDiscoverModal() {
    refreshDiscoverLead();
    openModal(modalDiscover);
  }

  function openAboutModal() {
    openModal(modalAbout);
  }

  document.querySelectorAll(".nav-modal-trigger[data-open-modal]").forEach(function (node) {
    node.addEventListener("click", function (e) {
      e.preventDefault();
      const which = node.getAttribute("data-open-modal");
      closeDrawer();
      if (which === "discover") openDiscoverModal();
      else if (which === "about") openAboutModal();
    });
  });

  document.addEventListener("click", function (e) {
    const t = e.target;
    if (t && t.closest && t.closest("[data-close-modal]")) {
      closeModals();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModals();
  });

  modeSpin?.addEventListener("click", function () {
    toggleTheme();
  });

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
