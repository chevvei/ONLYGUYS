(function () {
  var STORAGE_KEY = "onlyguys_year_todos_v1";
  var REPO_JSON = "data/year-todos.json";

  function uid() {
    return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function currentYearStr() {
    return String(new Date().getFullYear());
  }

  function defaultState() {
    var y = currentYearStr();
    return { version: 1, activeYear: y, lists: {} };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.version === 1 && o.lists && typeof o.lists === "object") {
          if (!o.activeYear || !o.lists[o.activeYear]) {
            var years = Object.keys(o.lists).sort();
            o.activeYear = years.length ? years[years.length - 1] : currentYearStr();
            if (!o.lists[o.activeYear]) o.lists[o.activeYear] = [];
          }
          return o;
        }
      }
    } catch (_) {}
    var s = defaultState();
    s.lists[s.activeYear] = [];
    return s;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      alert("无法写入本地存储（可能已满或隐私模式）：" + (e.message || ""));
    }
  }

  function validatePayload(o) {
    return !!(o && o.version === 1 && o.lists && typeof o.lists === "object");
  }

  /** 仓库 JSON 为准；同一 year+id 的勾选状态尽量从本地合并 */
  function mergeRepoWithLocalDone(remote, local) {
    var doneByKey = {};
    Object.keys(local.lists).forEach(function (y) {
      (local.lists[y] || []).forEach(function (it) {
        if (it && it.id) doneByKey[y + "\0" + it.id] = !!it.done;
      });
    });
    var lists = {};
    Object.keys(remote.lists).forEach(function (y) {
      lists[y] = (remote.lists[y] || []).map(function (it) {
        var id = it && it.id ? String(it.id) : uid();
        var k = y + "\0" + id;
        var done = Object.prototype.hasOwnProperty.call(doneByKey, k) ? doneByKey[k] : !!it.done;
        return { id: id, text: it.text != null ? String(it.text) : "", done: done };
      });
    });
    var years = Object.keys(lists).sort(function (a, b) {
      return parseInt(b, 10) - parseInt(a, 10);
    });
    var ay = String(remote.activeYear || "");
    if (!ay || !lists[ay]) ay = years.length ? years[0] : currentYearStr();
    if (!lists[ay]) lists[ay] = [];
    if (years.length === 0) {
      ay = currentYearStr();
      lists[ay] = [];
    }
    return { version: 1, activeYear: ay, lists: lists };
  }

  var state = loadState();

  var elYearSelect = document.getElementById("yearTodoYearSelect");
  var elNewYear = document.getElementById("yearTodoNewYear");
  var elBtnAddYear = document.getElementById("yearTodoAddYear");
  var elBtnDelYear = document.getElementById("yearTodoDelYear");
  var elList = document.getElementById("yearTodoList");
  var elBtnAddItem = document.getElementById("yearTodoAddItem");
  var elBtnExport = document.getElementById("yearTodoExport");
  var elBtnCopy = document.getElementById("yearTodoCopyJson");
  var elImport = document.getElementById("yearTodoImport");
  var elEmpty = document.getElementById("yearTodoEmpty");
  var elStats = document.getElementById("yearTodoStats");
  var elSourceStatus = document.getElementById("yearTodoSourceStatus");
  var elRefetch = document.getElementById("yearTodoRefetch");

  function setSourceStatus(text, isWarn) {
    if (!elSourceStatus) return;
    elSourceStatus.textContent = text;
    elSourceStatus.classList.toggle("todo-page__source-status--warn", !!isWarn);
  }

  function fetchFromRepo() {
    setSourceStatus("正在从仓库读取…", false);
    fetch(REPO_JSON, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("http");
        return r.json();
      })
      .then(function (remote) {
        if (!validatePayload(remote)) throw new Error("bad");
        var prev = JSON.parse(JSON.stringify(state));
        state = mergeRepoWithLocalDone(remote, prev);
        persist();
        fillYearSelect();
        renderList();
        setSourceStatus("已与仓库 " + REPO_JSON + " 对齐 · 勾选状态保留在本机", false);
      })
      .catch(function () {
        setSourceStatus("未读取到仓库文件，显示浏览器本地缓存", true);
      });
  }

  function sortedYears() {
    return Object.keys(state.lists).sort(function (a, b) {
      return parseInt(b, 10) - parseInt(a, 10);
    });
  }

  function persist() {
    saveState(state);
  }

  function fillYearSelect() {
    if (!elYearSelect) return;
    var y = sortedYears();
    elYearSelect.innerHTML = "";
    y.forEach(function (year) {
      var opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year + " 年";
      if (year === state.activeYear) opt.selected = true;
      elYearSelect.appendChild(opt);
    });
    if (y.length === 0) {
      var o = document.createElement("option");
      o.value = state.activeYear;
      o.textContent = state.activeYear + " 年";
      elYearSelect.appendChild(o);
    }
  }

  function itemsForActive() {
    var list = state.lists[state.activeYear];
    if (!Array.isArray(list)) {
      state.lists[state.activeYear] = [];
      return state.lists[state.activeYear];
    }
    return list;
  }

  function updateStats() {
    if (!elStats) return;
    var items = itemsForActive();
    var done = items.filter(function (x) {
      return x.done;
    }).length;
    elStats.textContent = items.length ? "共 " + items.length + " 条 · 已完成 " + done : "暂无条目，点击下方添加一行";
  }

  function renderList() {
    if (!elList) return;
    elList.innerHTML = "";
    var items = itemsForActive();
    if (elEmpty) elEmpty.hidden = items.length > 0;

    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "todo-notebook__row" + (item.done ? " is-done" : "");
      li.dataset.id = item.id;

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "todo-notebook__check";
      cb.checked = !!item.done;
      cb.setAttribute("aria-label", "标记完成");
      cb.addEventListener("change", function () {
        item.done = cb.checked;
        li.classList.toggle("is-done", item.done);
        persist();
        updateStats();
      });

      var input = document.createElement("input");
      input.type = "text";
      input.className = "todo-notebook__text";
      input.value = item.text || "";
      input.placeholder = "写一件今年要做的事…";
      input.addEventListener("input", function () {
        item.text = input.value;
        persist();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addItemAfter(item.id);
        }
      });

      var del = document.createElement("button");
      del.type = "button";
      del.className = "todo-notebook__del";
      del.setAttribute("aria-label", "删除此行");
      del.textContent = "×";
      del.addEventListener("click", function () {
        var arr = itemsForActive();
        var i = arr.findIndex(function (x) {
          return x.id === item.id;
        });
        if (i >= 0) {
          arr.splice(i, 1);
          persist();
          renderList();
          updateStats();
        }
      });

      li.appendChild(cb);
      li.appendChild(input);
      li.appendChild(del);
      elList.appendChild(li);
    });
    updateStats();
  }

  function addItemAfter(afterId) {
    var arr = itemsForActive();
    var ni = { id: uid(), text: "", done: false };
    if (afterId) {
      var i = arr.findIndex(function (x) {
        return x.id === afterId;
      });
      if (i >= 0) arr.splice(i + 1, 0, ni);
      else arr.push(ni);
    } else arr.push(ni);
    persist();
    renderList();
    var inputs = elList.querySelectorAll(".todo-notebook__text");
    var last = inputs[inputs.length - 1];
    if (last) {
      last.focus();
      last.select();
    }
  }

  function setActiveYear(year) {
    state.activeYear = String(year);
    if (!state.lists[state.activeYear]) state.lists[state.activeYear] = [];
    persist();
    fillYearSelect();
    renderList();
  }

  if (elYearSelect) {
    elYearSelect.addEventListener("change", function () {
      setActiveYear(elYearSelect.value);
    });
  }

  if (elBtnAddYear) {
    elBtnAddYear.addEventListener("click", function () {
    var v = (elNewYear && elNewYear.value.trim()) || "";
    var n = parseInt(v, 10);
    if (!n || n < 1970 || n > 2100) {
      alert("请输入合理年份（1970–2100）");
      return;
    }
    var ys = String(n);
    if (!state.lists[ys]) state.lists[ys] = [];
    state.activeYear = ys;
    if (elNewYear) elNewYear.value = "";
    persist();
    fillYearSelect();
    renderList();
    });
  }

  if (elBtnDelYear) {
    elBtnDelYear.addEventListener("click", function () {
    var y = state.activeYear;
    if (!confirm("确定删除「" + y + " 年」整本清单？该年所有条目将丢失。")) return;
    delete state.lists[y];
    var rest = sortedYears();
    state.activeYear = rest.length ? rest[0] : currentYearStr();
    if (!state.lists[state.activeYear]) state.lists[state.activeYear] = [];
    persist();
    fillYearSelect();
    renderList();
    });
  }

  if (elBtnAddItem) {
    elBtnAddItem.addEventListener("click", function () {
      addItemAfter(null);
    });
  }

  function exportPayload() {
    return JSON.stringify(state, null, 2);
  }

  if (elBtnExport) {
    elBtnExport.addEventListener("click", function () {
    var blob = new Blob([exportPayload()], { type: "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "year-todos-backup-" + state.activeYear + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    });
  }

  if (elBtnCopy) {
    elBtnCopy.addEventListener("click", function () {
    var text = exportPayload();
    function ok() {
      alert("已复制。可粘贴覆盖 data/year-todos.json 后 git push。");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(function () {
        fallbackCopy(text);
      });
    } else fallbackCopy(text);

    function fallbackCopy(t) {
      var ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        ok();
      } catch (_) {
        alert("复制失败，请使用「导出 JSON」下载文件。");
      }
      document.body.removeChild(ta);
    }
    });
  }

  if (elImport) {
    elImport.addEventListener("change", function () {
    var f = elImport.files && elImport.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var o = JSON.parse(reader.result);
        if (!o || o.version !== 1 || !o.lists || typeof o.lists !== "object") {
          throw new Error("格式不正确");
        }
        if (
          !confirm("用文件内容「完全替换」当前浏览器里的清单？此操作不可撤销。")
        ) {
          elImport.value = "";
          return;
        }
        state = {
          version: 1,
          activeYear: String(o.activeYear || currentYearStr()),
          lists: o.lists,
        };
        if (!state.lists[state.activeYear]) state.activeYear = Object.keys(state.lists).sort().pop() || currentYearStr();
        if (!state.lists[state.activeYear]) state.lists[state.activeYear] = [];
        persist();
        fillYearSelect();
        renderList();
      } catch (err) {
        alert("导入失败：" + (err.message || err));
      }
      elImport.value = "";
    };
    reader.readAsText(f, "utf-8");
    });
  }

  if (elRefetch) {
    elRefetch.addEventListener("click", function () {
      fetchFromRepo();
    });
  }

  fillYearSelect();
  renderList();
  fetchFromRepo();
})();
