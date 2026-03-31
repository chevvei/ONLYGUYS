// 浮动音乐组件（网易云 / QQ 歌单 iframe）+ 底部滚动歌词条
// 注意：跨域 iframe 无法拿到实时歌词，这里用「当前歌单主题歌词句」做动态滚动体验。
(function () {
  var FAB_ID = "musicFab";
  var FRAME_ID = "musicFabFrame";
  var LYRIC_LINE_ID = "musicLyricLine";
  var PANEL_OPEN_CLASS = "music-fab--open";
  var DRAG_ACTIVE_CLASS = "music-fab--dragging";
  var LYRIC_INTERVAL_MS = 9000;

  // 偏抒情 / 缓慢 / 轻快英文风格（可继续替换为你的网易云/QQ歌单链接）
  var MUSIC_PLAYLISTS = [
    {
      mood: "slow ballads",
      source: "netease",
      url: "https://music.163.com/outchain/player?type=0&id=71385702&auto=1&height=80",
      lines: [
        "Take it slow tonight, let your heartbeat keep the time.",
        "In this quiet light, every breath feels right.",
        "We don't need to run, we can stay in this soft sound."
      ]
    },
    {
      mood: "lyrical english",
      source: "netease",
      url: "https://music.163.com/outchain/player?type=0&id=60198&auto=1&height=80",
      lines: [
        "You and me, drifting where the city lights fade.",
        "Words fall gently, like rain on a midnight window.",
        "Keep the music low, keep the feeling close."
      ]
    },
    {
      mood: "light upbeat",
      source: "netease",
      url: "https://music.163.com/outchain/player?type=0&id=1999071790&auto=1&height=80",
      lines: [
        "Step by step, we turn this day into a melody.",
        "Little sparks of joy, running through the avenue.",
        "Smile in the rhythm, move with the morning breeze."
      ]
    }
  ];

  function pickRandomPlaylist() {
    if (!MUSIC_PLAYLISTS.length) return null;
    var i = Math.floor(Math.random() * MUSIC_PLAYLISTS.length);
    return MUSIC_PLAYLISTS[i];
  }

  function setLyricText(el, text) {
    if (!el) return;
    el.textContent = text;
    // 重启动画，让更换文案立即从右侧进入
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }

  function startLyricTicker(lyricEl, playlist) {
    if (!lyricEl || !playlist || !playlist.lines || !playlist.lines.length) return null;
    var idx = 0;
    function nextLine() {
      var line = playlist.lines[idx % playlist.lines.length];
      setLyricText(
        lyricEl,
        "Now Playing • " + playlist.mood + " • " + line + " • "
      );
      idx += 1;
    }
    nextLine();
    return window.setInterval(nextLine, LYRIC_INTERVAL_MS);
  }

  function init() {
    var fab = document.getElementById(FAB_ID);
    var frame = document.getElementById(FRAME_ID);
    var lyricLine = document.getElementById(LYRIC_LINE_ID);
    if (!fab || !frame) return;

    var picked = pickRandomPlaylist();
    if (picked && picked.url) {
      frame.src = picked.url;
    } else {
      frame.parentNode.setAttribute("hidden", "hidden");
      setLyricText(lyricLine, "Music playlist unavailable.");
    }

    var tickerTimer = startLyricTicker(lyricLine, picked);
    if (!tickerTimer && lyricLine) {
      setLyricText(lyricLine, "Music mood ready. Tap the disc to open player.");
    }

    // 展开 / 收起
    var disc = fab.querySelector(".music-fab__disc");
    var closeBtn = fab.querySelector(".music-fab__close");
    function toggleOpen() {
      fab.classList.toggle(PANEL_OPEN_CLASS);
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

    // 拖拽（限制在视口内）
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
      var lyricBarHeight = 36;
      nextX = Math.min(Math.max(nextX, margin - rect.left + origX), vw - w - margin);
      nextY = Math.min(Math.max(nextY, margin), vh - h - margin - lyricBarHeight);
      fab.style.left = nextX + "px";
      fab.style.top = nextY + "px";
      fab.style.right = "auto";
      fab.style.bottom = "auto";
    }

    function onPointerUp() {
      dragging = false;
      fab.classList.remove(DRAG_ACTIVE_CLASS);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    fab.addEventListener("pointerdown", onPointerDown);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

