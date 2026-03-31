// 浮动音乐组件（网易云 / QQ 歌单 iframe）+ 底部滚动展板
// 说明：跨域 iframe 无法读取实时歌词，因此底部展示 data/scroll-board.json 的可配置文案。
(function () {
  var FAB_ID = "musicFab";
  var FRAME_ID = "musicFabFrame";
  var LYRIC_LINE_ID = "musicLyricLine";
  var BOARD_CONFIG_URL = "data/scroll-board.json";
  var PANEL_OPEN_CLASS = "music-fab--open";
  var DRAG_ACTIVE_CLASS = "music-fab--dragging";
  var PANEL_LEFT_CLASS = "music-fab--panel-left";
  var PANEL_UP_CLASS = "music-fab--panel-up";
  var LYRIC_INTERVAL_MS = 16000;

  var MUSIC_PLAYLISTS = [
    {
      mood: "邓紫棋 · 唯一",
      url: "https://music.163.com/outchain/player?type=2&id=2083785152&auto=1&height=66"
    },
    {
      mood: "李荣浩 · 恋人",
      url: "https://music.163.com/outchain/player?type=2&id=2600493765&auto=1&height=66"
    },
    {
      mood: "老狼/王婧 · 想把我唱给你听",
      url: "https://music.163.com/outchain/player?type=2&id=108103&auto=1&height=66"
    },
    {
      mood: "郭顶 · 我们俩",
      url: "https://music.163.com/outchain/player?type=2&id=85571&auto=1&height=66"
    },
    {
      mood: "苏打绿 · 小情歌",
      url: "https://music.163.com/outchain/player?type=2&id=68450&auto=1&height=66"
    }
  ];

  function pickRandomPlaylist() {
    if (!MUSIC_PLAYLISTS.length) return null;
    var i = Math.floor(Math.random() * MUSIC_PLAYLISTS.length);
    return MUSIC_PLAYLISTS[i];
  }

  function setLineText(el, text) {
    if (!el) return;
    el.textContent = text;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }

  function startBoardTicker(lineEl, lines, randomMode) {
    if (!lineEl || !lines || !lines.length) return null;
    var idx = 0;
    var pool = lines.slice();
    function pickRandomNoRepeat() {
      if (!pool.length) pool = lines.slice();
      var i = Math.floor(Math.random() * pool.length);
      var text = pool[i];
      pool.splice(i, 1);
      return text;
    }
    function next() {
      var text = randomMode ? pickRandomNoRepeat() : lines[idx % lines.length];
      setLineText(lineEl, text);
      idx += 1;
    }
    next();
    return window.setInterval(next, LYRIC_INTERVAL_MS);
  }

  function loadBoardConfig() {
    var url = BOARD_CONFIG_URL;
    try {
      url = new URL(BOARD_CONFIG_URL, location.href).href;
    } catch (_) {}
    return fetch(url, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then(function (cfg) {
        var speedSec = Number(cfg && cfg.speedSec);
        if (!isFinite(speedSec) || speedSec < 12) speedSec = 42;
        var lines = Array.isArray(cfg && cfg.lines)
          ? cfg.lines.map(function (x) {
              return String(x || "").trim();
            }).filter(Boolean)
          : [];
        return {
          speedSec: speedSec,
          randomMode: !!(cfg && cfg.randomMode),
          lines: lines
        };
      })
      .catch(function () {
        return {
          speedSec: 42,
          randomMode: true,
          lines: [
            "欢迎来到我的主页，这里会持续记录我的计划、作品和日常片段。",
            "2026 目标：顺利毕业、找到理想工作、认真生活、保持热爱。",
            "愿每一次靠近，都算数；愿每一次努力，都被看见。"
          ]
        };
      });
  }

  function init() {
    var fab = document.getElementById(FAB_ID);
    var frame = document.getElementById(FRAME_ID);
    var lineEl = document.getElementById(LYRIC_LINE_ID);
    if (!fab || !frame) return;

    var picked = pickRandomPlaylist();
    if (picked && picked.url) {
      frame.src = picked.url;
    } else {
      frame.parentNode.setAttribute("hidden", "hidden");
    }

    loadBoardConfig().then(function (cfg) {
      if (lineEl) {
        lineEl.style.setProperty("--board-speed-sec", String(cfg.speedSec) + "s");
      }
      var lines = cfg.lines && cfg.lines.length ? cfg.lines : ["请在 data/scroll-board.json 配置滚动文案。"];
      startBoardTicker(lineEl, lines, cfg.randomMode);
    });

    var disc = fab.querySelector(".music-fab__disc");
    var panel = fab.querySelector(".music-fab__panel");
    var closeBtn = fab.querySelector(".music-fab__close");

    function adjustPanelPlacement() {
      if (!disc || !panel) return;
      fab.classList.remove(PANEL_LEFT_CLASS);
      fab.classList.remove(PANEL_UP_CLASS);
      var discRect = disc.getBoundingClientRect();
      var panelWidth = panel.offsetWidth || 320;
      var panelHeight = panel.offsetHeight || 170;
      var gap = 10;
      // 默认为右对齐（面板往左展开）。若左侧会被裁切，则改为左对齐（往右展开）。
      var leftIfDefault = discRect.right - panelWidth;
      if (leftIfDefault < gap) {
        fab.classList.add(PANEL_LEFT_CLASS);
      }
      if (discRect.bottom + panelHeight > window.innerHeight - 40) {
        fab.classList.add(PANEL_UP_CLASS);
      }
    }

    function toggleOpen() {
      fab.classList.toggle(PANEL_OPEN_CLASS);
      if (fab.classList.contains(PANEL_OPEN_CLASS)) {
        adjustPanelPlacement();
      }
    }

    if (disc) {
      disc.addEventListener("click", function () {
        toggleOpen();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        fab.classList.remove(PANEL_OPEN_CLASS);
      });
    }

    var dragging = false;
    var startX = 0;
    var startY = 0;
    var origX = 0;
    var origY = 0;

    function getFabRect() {
      return fab.getBoundingClientRect();
    }

    function onPointerDown(ev) {
      if (!ev.target.closest(".music-fab__disc")) return;
      dragging = true;
      fab.classList.add(DRAG_ACTIVE_CLASS);
      var rect = getFabRect();
      startX = ev.clientX;
      startY = ev.clientY;
      origX = rect.left;
      origY = rect.top;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(ev) {
      if (!dragging) return;
      var dx = ev.clientX - startX;
      var dy = ev.clientY - startY;
      var nextX = origX + dx;
      var nextY = origY + dy;
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var rect = getFabRect();
      var w = rect.width;
      var h = rect.height;
      var margin = 12;
      var boardHeight = 40;
      nextX = Math.min(Math.max(nextX, margin - rect.left + origX), vw - w - margin);
      nextY = Math.min(Math.max(nextY, margin), vh - h - margin - boardHeight);
      fab.style.left = nextX + "px";
      fab.style.top = nextY + "px";
      fab.style.right = "auto";
      fab.style.bottom = "auto";
      if (fab.classList.contains(PANEL_OPEN_CLASS)) adjustPanelPlacement();
    }

    function onPointerUp() {
      dragging = false;
      fab.classList.remove(DRAG_ACTIVE_CLASS);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    fab.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", function () {
      if (fab.classList.contains(PANEL_OPEN_CLASS)) adjustPanelPlacement();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

