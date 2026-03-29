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
  var DEFAULT_TIMER_LEAD_WAIT = "距离相识还有";
  var DEFAULT_SINCE_NEAR = "2026-10-03T00:00:00+08:00";
  var DEFAULT_TIMER_LEAD_NEAR = "想靠近你的第";
  var DEFAULT_TIMER_LEAD_NEAR_WAIT = "距离想靠近你的起点还有";

  var bodyEl = document.getElementById("about-body");
  var timerEl = document.getElementById("aboutTimer");
  var timerNearEl = document.getElementById("aboutTimerNear");
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

  /** 去掉 BOM、连续的文首 HTML 注释（如 koroFileHeader 误写入 .md），避免破坏 front matter */
  function stripAboutLeadingNoise(raw) {
    var s = String(raw).replace(/^\uFEFF/, "");
    var prev;
    do {
      prev = s;
      s = s.replace(/^\s*<!--[\s\S]*?-->\s*/, "");
    } while (s !== prev);
    return s.trim();
  }

  function parseFrontMatter(text) {
    var cleaned = stripAboutLeadingNoise(text);
    var m = cleaned.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
    if (!m) {
      return { meta: {}, body: cleaned };
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

  function parseSinceMs(meta, key, fallbackAttr, defaultIso) {
    var raw =
      (meta && meta[key]) ||
      (aboutSection && aboutSection.getAttribute(fallbackAttr)) ||
      defaultIso;
    var t = Date.parse(raw);
    if (Number.isNaN(t)) {
      t = Date.parse(defaultIso);
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

  function tickInto(el, sinceMs, leadElapsed, leadWait) {
    if (!el) return;
    var now = Date.now();
    var ahead = now < sinceMs;
    var diffSec = Math.floor(Math.abs(now - sinceMs) / 1000);
    var d = Math.floor(diffSec / 86400);
    diffSec %= 86400;
    var h = Math.floor(diffSec / 3600);
    diffSec %= 3600;
    var m = Math.floor(diffSec / 60);
    var s = diffSec % 60;
    var lead = ahead ? leadWait : leadElapsed;
    el.innerHTML = buildTimerHtml(lead, d, h, m, s);
  }

  function tickPair(cfg) {
    tickInto(timerEl, cfg.sinceMs, cfg.leadElapsed, cfg.leadWait);
    tickInto(timerNearEl, cfg.sinceNearMs, cfg.leadNearElapsed, cfg.leadNearWait);
  }

  function startTimers(meta) {
    var sinceMs = parseSinceMs(meta, "since", "data-since-fallback", DEFAULT_SINCE);
    var sinceNearMs = parseSinceMs(meta, "since_near", "data-since-near-fallback", DEFAULT_SINCE_NEAR);
    var leadElapsed = (meta && meta.timer_lead) || DEFAULT_TIMER_LEAD;
    var leadWait = (meta && meta.timer_lead_wait) || DEFAULT_TIMER_LEAD_WAIT;
    var leadNearElapsed = (meta && meta.timer_lead_near) || DEFAULT_TIMER_LEAD_NEAR;
    var leadNearWait = (meta && meta.timer_lead_near_wait) || DEFAULT_TIMER_LEAD_NEAR_WAIT;
    var cfg = {
      sinceMs: sinceMs,
      sinceNearMs: sinceNearMs,
      leadElapsed: leadElapsed,
      leadWait: leadWait,
      leadNearElapsed: leadNearElapsed,
      leadNearWait: leadNearWait,
    };
    tickPair(cfg);
    window.setInterval(function () {
      tickPair(cfg);
    }, 1000);
  }

  function showFetchError() {
    if (!bodyEl) return;
    bodyEl.innerHTML =
      "<p class=\"about-fallback\">无法加载 <code>content/about.md</code>，且页面内未提供备用正文。若你是本地预览，请用 <code>npx serve .</code> 启动静态服务；或向 <code>index.html</code> 中的 <code>#about-md-fallback</code> 填入与 <code>content/about.md</code> 相同的内容。</p>" +
      "<p class=\"about-fallback about-fallback--hint\">若已部署到 GitHub Pages：请确认仓库根目录有 <code>content/about.md</code>，且根目录存在 <code>.nojekyll</code> 文件，然后重新推送并等待几分钟。</p>" +
      "<p class=\"about-fallback about-fallback--hint\">编辑说明见 <code>docs/editing-about.md</code>。</p>";
  }

  function getFallbackMarkdown() {
    var el = document.getElementById("about-md-fallback");
    if (!el || !el.textContent) return "";
    return String(el.textContent).replace(/^\uFEFF/, "").trim();
  }

  function applyAboutMarkdown(text) {
    var parsed = parseFrontMatter(text);
    renderBody(parsed.body);
    startTimers(parsed.meta);
  }

  var isFileProtocol = window.location.protocol === "file:";

  if (isFileProtocol) {
    var fbFile = getFallbackMarkdown();
    if (fbFile) {
      applyAboutMarkdown(fbFile);
    } else {
      showFetchError();
      startTimers({});
    }
  } else {
    fetch(ABOUT_URL)
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then(function (text) {
        applyAboutMarkdown(text);
      })
      .catch(function () {
        var fb = getFallbackMarkdown();
        if (fb) {
          applyAboutMarkdown(fb);
        } else {
          showFetchError();
          startTimers({});
        }
      });
  }
})();
