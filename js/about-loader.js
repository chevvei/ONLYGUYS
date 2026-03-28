(function () {
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

  var ABOUT_URL = window.location.origin + contentBasePath() + "content/about.md";
  var DEFAULT_SINCE = "2022-07-16T00:00:00+08:00";
  var DEFAULT_TIMER_LEAD = "这是 cv 和 Qing 相识的第";

  var bodyEl = document.getElementById("about-body");
  var timerEl = document.getElementById("aboutTimer");
  var aboutSection = document.getElementById("modalAbout");

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatInline(s) {
    var parts = String(s).split("**");
    return parts
      .map(function (chunk, i) {
        return i % 2 === 1 ? "<strong>" + escapeHtml(chunk) + "</strong>" : escapeHtml(chunk);
      })
      .join("");
  }

  function formatParagraph(p) {
    return p
      .split(/\r?\n/)
      .map(function (line) {
        return formatInline(line);
      })
      .join("<br>");
  }

  function parseFrontMatter(text) {
    var m = String(text).match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
    if (!m) {
      return { meta: {}, body: String(text).trim() };
    }
    var meta = {};
    m[1].split(/\r?\n/).forEach(function (line) {
      var kv = line.match(/^([a-zA-Z0-9_]+):\s*(.+)$/);
      if (kv) {
        var v = kv[2].trim().replace(/^["']|["']$/g, "");
        meta[kv[1]] = v;
      }
    });
    return { meta: meta, body: m[2].trim() };
  }

  function renderBody(mdBody) {
    if (!bodyEl) return;
    var paras = mdBody.split(/\r?\n\r?\n/).filter(function (p) {
      return p.trim().length > 0;
    });
    bodyEl.innerHTML = paras
      .map(function (p) {
        return "<p>" + formatParagraph(p.trim()) + "</p>";
      })
      .join("");
  }

  function parseSince(meta) {
    var raw = (meta && meta.since) || (aboutSection && aboutSection.getAttribute("data-since-fallback")) || DEFAULT_SINCE;
    var t = Date.parse(raw);
    if (Number.isNaN(t)) {
      t = Date.parse(DEFAULT_SINCE);
    }
    return t;
  }

  function buildTimerHtml(leadText, d, h, m, s) {
    return (
      '<span class="about-timer__lead">' +
      escapeHtml(leadText) +
      "</span>" +
      '<span class="about-timer__nums"> ' +
      '<span class="about-timer__num">' +
      d +
      "</span> 天 " +
      '<span class="about-timer__num">' +
      h +
      "</span> 时 " +
      '<span class="about-timer__num">' +
      m +
      "</span> 分 " +
      '<span class="about-timer__num">' +
      s +
      "</span> 秒" +
      "</span>"
    );
  }

  function tick(sinceMs, leadText) {
    if (!timerEl) return;
    var now = Date.now();
    var diffSec = Math.max(0, Math.floor((now - sinceMs) / 1000));
    var d = Math.floor(diffSec / 86400);
    diffSec %= 86400;
    var h = Math.floor(diffSec / 3600);
    diffSec %= 3600;
    var m = Math.floor(diffSec / 60);
    var s = diffSec % 60;
    timerEl.innerHTML = buildTimerHtml(leadText, d, h, m, s);
  }

  function startTimer(sinceMs, meta) {
    var lead = (meta && meta.timer_lead) || DEFAULT_TIMER_LEAD;
    tick(sinceMs, lead);
    window.setInterval(function () {
      tick(sinceMs, lead);
    }, 1000);
  }

  function showFetchError() {
    if (!bodyEl) return;
    bodyEl.innerHTML =
      "<p class=\"about-fallback\">无法加载 <code>content/about.md</code>。若你是本地双击打开的页面，请用 <code>npx serve .</code> 启动静态服务后再试。</p>" +
      "<p class=\"about-fallback about-fallback--hint\">若已部署到 GitHub Pages：请确认仓库根目录有 <code>content/about.md</code>，且根目录存在 <code>.nojekyll</code> 文件（避免 Jekyll 吞掉该文件），然后重新推送并等待几分钟。</p>" +
      "<p class=\"about-fallback about-fallback--hint\">编辑正文：仓库内 <code>content/about.md</code>，说明见 <code>docs/editing-about.md</code>。</p>";
  }

  fetch(ABOUT_URL)
    .then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.text();
    })
    .then(function (text) {
      var parsed = parseFrontMatter(text);
      renderBody(parsed.body);
      var sinceMs = parseSince(parsed.meta);
      startTimer(sinceMs, parsed.meta);
    })
    .catch(function () {
      showFetchError();
      var sinceMs = parseSince({});
      startTimer(sinceMs, {});
    });
})();
