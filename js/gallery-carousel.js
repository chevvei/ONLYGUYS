(function () {
  var IMAGE_HOLD_MS = 6500;
  var IMAGE_HOLD_REDUCED_MS = 9500;
  var VIDEO_MAX_MS = 120000;

  function contentBasePath() {
    var p = window.location.pathname;
    if (p.endsWith("/")) return p;
    var i = p.lastIndexOf("/");
    var last = i < 0 ? p : p.slice(i + 1);
    if (last.indexOf(".") >= 0) {
      return p.slice(0, i + 1);
    }
    return p + "/";
  }

  var root = contentBasePath();
  var manifestUrl = window.location.origin + root + "js/gallery-manifest.json";

  var carousel = document.getElementById("galleryCarousel");
  var imgEl = document.getElementById("galleryCarouselImg");
  var videoEl = document.getElementById("galleryCarouselVideo");
  if (!carousel || !imgEl || !videoEl) return;

  var manifest = { onlyGuysPic: [], onlyGirlsPic: [] };
  var list = [];
  var index = 0;
  var timerId = null;
  var videoCapTimer = null;
  var slideGen = 0;

  var reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function absUrl(path) {
    var clean = String(path).replace(/^\//, "");
    return window.location.origin + root + clean;
  }

  function isVideoPath(path) {
    return /\.(mp4|webm|ogg)$/i.test(path);
  }

  function girlsTheme() {
    return document.body.classList.contains("theme-girls");
  }

  function activeList() {
    return girlsTheme() ? manifest.onlyGirlsPic || [] : manifest.onlyGuysPic || [];
  }

  function clearTimers() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    if (videoCapTimer) {
      clearTimeout(videoCapTimer);
      videoCapTimer = null;
    }
    videoEl.pause();
    videoEl.onended = null;
    videoEl.onerror = null;
    videoEl.onloadeddata = null;
  }

  function setGalleryActive(on) {
    document.body.classList.toggle("has-gallery-slides", on);
  }

  /** 标题字纹理与轮播当前图同步（底图 .bg-layer 仍用 CSS 的 --hero-photo） */
  function resetHeroTitlePhoto() {
    if (document.body) {
      document.body.style.removeProperty("--hero-title-photo");
    }
  }

  function setHeroTitlePhotoFromUrl(fullUrl) {
    if (!document.body || !fullUrl) return;
    document.body.style.setProperty(
      "--hero-title-photo",
      "url(" + JSON.stringify(String(fullUrl)) + ")"
    );
  }

  function preloadAt(i) {
    if (!list.length) return;
    var next = list[i % list.length];
    if (!next || isVideoPath(next)) return;
    var im = new Image();
    im.decoding = "async";
    im.src = absUrl(next);
  }

  function hideCarousel() {
    clearTimers();
    slideGen++;
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
    imgEl.removeAttribute("src");
    imgEl.classList.remove("is-visible");
    videoEl.classList.remove("is-visible");
    carousel.hidden = true;
    carousel.setAttribute("aria-hidden", "true");
    setGalleryActive(false);
    resetHeroTitlePhoto();
  }

  function showSlide(i) {
    clearTimers();
    var gen = ++slideGen;
    if (!list.length) {
      hideCarousel();
      return;
    }
    index = ((i % list.length) + list.length) % list.length;
    var url = list[index];
    var full = absUrl(url);
    var isVid = isVideoPath(url);

    preloadAt(index + 1);

    if (isVid) {
      resetHeroTitlePhoto();
      imgEl.classList.remove("is-visible");
      imgEl.removeAttribute("src");
      videoEl.classList.remove("is-visible");
      videoEl.preload = "metadata";
      videoEl.src = full;
      videoEl.load();

      videoEl.onloadeddata = function () {
        if (gen !== slideGen) return;
        videoEl.classList.add("is-visible");
      };

      videoEl.onended = function () {
        if (gen !== slideGen) return;
        showSlide(index + 1);
      };
      videoEl.onerror = function () {
        if (gen !== slideGen) return;
        showSlide(index + 1);
      };

      var playPromise = videoEl.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          if (gen !== slideGen) return;
          showSlide(index + 1);
        });
      }

      videoCapTimer = window.setTimeout(function () {
        if (gen !== slideGen) return;
        videoEl.pause();
        showSlide(index + 1);
      }, VIDEO_MAX_MS);
    } else {
      videoEl.classList.remove("is-visible");
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
      videoEl.preload = "none";

      var hold = reducedMotion ? IMAGE_HOLD_REDUCED_MS : IMAGE_HOLD_MS;

      imgEl.classList.remove("is-visible");
      imgEl.onload = function () {
        if (gen !== slideGen) return;
        imgEl.onload = null;
        imgEl.onerror = null;
        setHeroTitlePhotoFromUrl(full);
        imgEl.classList.add("is-visible");
        timerId = window.setTimeout(function () {
          if (gen !== slideGen) return;
          showSlide(index + 1);
        }, hold);
      };
      imgEl.onerror = function () {
        if (gen !== slideGen) return;
        imgEl.onload = null;
        imgEl.onerror = null;
        showSlide(index + 1);
      };
      imgEl.src = full;

      if (imgEl.complete && imgEl.naturalWidth > 0) {
        imgEl.onload = null;
        imgEl.onerror = null;
        setHeroTitlePhotoFromUrl(full);
        imgEl.classList.add("is-visible");
        timerId = window.setTimeout(function () {
          if (gen !== slideGen) return;
          showSlide(index + 1);
        }, hold);
      }
    }
  }

  function restart() {
    list = activeList().filter(function (x) {
      return String(x || "").trim().length > 0;
    });
    if (!list.length) {
      hideCarousel();
      return;
    }
    carousel.hidden = false;
    carousel.setAttribute("aria-hidden", "true");
    setGalleryActive(true);
    showSlide(0);
  }

  document.addEventListener("onlyguys-theme", function () {
    restart();
  });

  fetch(manifestUrl)
    .then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then(function (data) {
      manifest = data || manifest;
      if (!Array.isArray(manifest.onlyGuysPic)) manifest.onlyGuysPic = [];
      if (!Array.isArray(manifest.onlyGirlsPic)) manifest.onlyGirlsPic = [];
      restart();
    })
    .catch(function () {
      hideCarousel();
    });
})();
