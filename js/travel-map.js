/**
 * 看世界 · 旅行地图
 * - 中国：雄鸡示意国界（手绘简化折线 + 海南、台湾），平面投影 + 滚轮缩放 / 拖拽平移。
 * - 世界：正射投影球形地球，滚轮缩放「视距」、拖拽旋转视角、双击重置。
 */
(function () {
  var CN_BOUNDS = { minLon: 73, maxLon: 135, minLat: 18, maxLat: 54 };

  function densifyRingClosed(ring) {
    var dense = [];
    var n = ring.length;
    for (var i = 0; i < n - 1; i++) {
      var a = ring[i];
      var b = ring[i + 1];
      dense.push(a);
      dense.push([(a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5]);
    }
    dense.push(ring[n - 1]);
    return dense;
  }

  /**
   * 「雄鸡」示意国界：东北略抬高、山东外凸、东南海岸与西南回国界线闭合（非测绘成果）。
   */
  var CHINA_MAINLAND_LONLAT = [
    [104.2, 21.22],
    [106.6, 21.05],
    [109.8, 21.45],
    [112.8, 22.15],
    [115.6, 22.95],
    [118.2, 24.35],
    [119.5, 26.4],
    [119.85, 28.9],
    [119.45, 31.2],
    [118.75, 33.2],
    [119.1, 35.1],
    [120.6, 36.6],
    [122.45, 37.75],
    [124.35, 37.45],
    [125.35, 35.9],
    [125.15, 33.85],
    [124.55, 32.05],
    [124.05, 30.45],
    [124.95, 29.35],
    [126.35, 30.85],
    [127.55, 33.25],
    [128.55, 36.05],
    [130.05, 39.05],
    [132.05, 42.05],
    [134.25, 45.05],
    [135.85, 48.05],
    [136.35, 50.95],
    [134.75, 53.25],
    [131.45, 54.35],
    [127.65, 54.55],
    [123.55, 54.25],
    [118.95, 53.75],
    [114.25, 52.85],
    [109.75, 51.65],
    [105.65, 50.15],
    [101.85, 48.55],
    [98.45, 46.75],
    [95.65, 44.55],
    [93.35, 42.05],
    [91.35, 39.15],
    [89.85, 36.05],
    [88.75, 32.85],
    [88.05, 29.65],
    [87.65, 26.55],
    [88.15, 24.05],
    [89.85, 22.05],
    [92.45, 21.32],
    [95.85, 21.24],
    [99.35, 21.22],
    [102.25, 21.21],
    [104.2, 21.22],
  ];

  var HAINAN_LONLAT = [
    [108.62, 19.2],
    [109.85, 19.55],
    [110.75, 19.95],
    [111.05, 20.18],
    [110.9, 20.48],
    [110.35, 20.85],
    [109.52, 20.92],
    [108.85, 20.75],
    [108.5, 20.12],
    [108.62, 19.2],
  ];

  var TAIWAN_LONLAT = [
    [120.05, 26.38],
    [121.25, 25.98],
    [121.85, 25.12],
    [122.0, 24.82],
    [121.88, 23.4],
    [121.2, 22.48],
    [120.35, 22.58],
    [119.68, 23.2],
    [119.52, 23.82],
    [119.62, 24.65],
    [120.05, 26.38],
  ];

  var CHINA_MAINLAND_DENSE = densifyRingClosed(densifyRingClosed(CHINA_MAINLAND_LONLAT));
  var HAINAN_DENSE = densifyRingClosed(HAINAN_LONLAT);
  var TAIWAN_DENSE = densifyRingClosed(TAIWAN_LONLAT);

  var CITIES = [
    {
      id: "beijing",
      name: "北京市",
      short: "北京",
      lon: 116.4074,
      lat: 39.9042,
      labelDx: 9,
      labelDy: -11,
    },
    {
      id: "guangzhou",
      name: "广州市",
      short: "广州",
      lon: 113.264385,
      lat: 23.129112,
      labelDx: -36,
      labelDy: 4,
    },
    {
      id: "shenzhen",
      name: "深圳市",
      short: "深圳",
      lon: 114.057868,
      lat: 22.543099,
      labelDx: 10,
      labelDy: 14,
    },
    {
      id: "zhuhai",
      name: "珠海市",
      short: "珠海",
      lon: 113.576726,
      lat: 22.270715,
      labelDx: -34,
      labelDy: -8,
    },
    {
      id: "fogang",
      name: "清远市佛冈县",
      short: "佛冈",
      lon: 113.531219,
      lat: 23.866739,
      labelDx: 10,
      labelDy: -14,
    },
  ];

  function projectChina(lon, lat) {
    var w = 620;
    var h = 360;
    var x = ((lon - CN_BOUNDS.minLon) / (CN_BOUNDS.maxLon - CN_BOUNDS.minLon)) * w;
    var y = ((CN_BOUNDS.maxLat - lat) / (CN_BOUNDS.maxLat - CN_BOUNDS.minLat)) * h;
    return { x: x, y: y };
  }

  /** 正射投影：球心朝向 (λ0,φ0)，可见半球 cos(c)>0 */
  function projectOrthoScreen(lon, lat, centerLonDeg, centerLatDeg, R, cx, cy) {
    var λ = (lon * Math.PI) / 180;
    var φ = (lat * Math.PI) / 180;
    var λ0 = (centerLonDeg * Math.PI) / 180;
    var φ0 = (centerLatDeg * Math.PI) / 180;
    var cosφ = Math.cos(φ);
    var cosC = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * cosφ * Math.cos(λ - λ0);
    if (cosC <= 0.02) return null;
    var x = cosφ * Math.sin(λ - λ0);
    var y = Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * cosφ * Math.cos(λ - λ0);
    return { x: cx + R * x, y: cy - R * y };
  }

  function orthoPathD(ring, λ0, φ0, R, cx, cy) {
    var d = "";
    var pen = false;
    for (var i = 0; i < ring.length; i++) {
      var p = projectOrthoScreen(ring[i][0], ring[i][1], λ0, φ0, R, cx, cy);
      if (p && isFinite(p.x) && isFinite(p.y)) {
        d += (pen ? " L " : "M ") + p.x.toFixed(2) + " " + p.y.toFixed(2);
        pen = true;
      } else {
        pen = false;
      }
    }
    if (pen && d.length > 8) d += " Z";
    return d.length > 8 ? d : "";
  }

  function appendOrthoGraticule(parent, λ0, φ0, R, cx, cy) {
    var g = createSvgEl("g", { class: "travel-map__graticule-globe" });
    var lon;
    var lat;
    for (lon = -180; lon <= 180; lon += 30) {
      var d = "";
      var pen = false;
      for (lat = -86; lat <= 86; lat += 3) {
        var p = projectOrthoScreen(lon, lat, λ0, φ0, R, cx, cy);
        if (p) {
          d += (pen ? " L " : "M ") + p.x.toFixed(1) + " " + p.y.toFixed(1);
          pen = true;
        } else pen = false;
      }
      if (d.length > 10) {
        g.appendChild(
          createSvgEl("path", {
            class: "travel-map__graticule-line",
            d: d,
            fill: "none",
          })
        );
      }
    }
    for (lat = -60; lat <= 60; lat += 20) {
      var d2 = "";
      var pen2 = false;
      for (lon = -180; lon <= 180; lon += 4) {
        var p2 = projectOrthoScreen(lon, lat, λ0, φ0, R, cx, cy);
        if (p2) {
          d2 += (pen2 ? " L " : "M ") + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
          pen2 = true;
        } else pen2 = false;
      }
      if (d2.length > 10) {
        g.appendChild(
          createSvgEl("path", {
            class: "travel-map__graticule-line",
            d: d2,
            fill: "none",
          })
        );
      }
    }
    parent.appendChild(g);
  }

  function buildPathFromLonLat(ring, projector) {
    var d = "";
    for (var i = 0; i < ring.length; i++) {
      var p = projector(ring[i][0], ring[i][1]);
      d += (i === 0 ? "M " : " L ") + p.x.toFixed(2) + " " + p.y.toFixed(2);
    }
    d += " Z";
    return d;
  }

  function createSvgEl(tag, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  function appendIslandPaths(sceneG, pathHainanD, pathTaiwanD) {
    var gh = createSvgEl("path", {
      class: "travel-map__coast-glow travel-map__coast-glow--island",
      d: pathHainanD,
      fill: "none",
    });
    var lh = createSvgEl("path", {
      class: "travel-map__land travel-map__land--island",
      d: pathHainanD,
      fill: "url(#travelMapChinaShade)",
    });
    var sh = createSvgEl("path", {
      class: "travel-map__coast travel-map__coast--island",
      d: pathHainanD,
      fill: "none",
    });
    sceneG.appendChild(gh);
    sceneG.appendChild(lh);
    sceneG.appendChild(sh);

    var gt = createSvgEl("path", {
      class: "travel-map__coast-glow travel-map__coast-glow--island travel-map__coast-glow--tw",
      d: pathTaiwanD,
      fill: "none",
    });
    var lt = createSvgEl("path", {
      class: "travel-map__land travel-map__land--island travel-map__land--tw",
      d: pathTaiwanD,
      fill: "url(#travelMapChinaShade)",
    });
    var st = createSvgEl("path", {
      class: "travel-map__coast travel-map__coast--island",
      d: pathTaiwanD,
      fill: "none",
    });
    sceneG.appendChild(gt);
    sceneG.appendChild(lt);
    sceneG.appendChild(st);
  }

  function renderPinsAndLabels(parent, projector) {
    var g = createSvgEl("g", { class: "travel-map__dots" });
    CITIES.forEach(function (c) {
      var p = projector(c.lon, c.lat);
      var dx = c.labelDx != null ? c.labelDx : 8;
      var dy = c.labelDy != null ? c.labelDy : -10;
      var dotG = createSvgEl("g", {
        class: "travel-map__pin",
        transform: "translate(" + p.x + "," + p.y + ")",
      });
      var halo = createSvgEl("circle", {
        class: "travel-map__halo",
        r: "18",
        cx: "0",
        cy: "0",
      });
      var core = createSvgEl("circle", {
        class: "travel-map__core",
        r: "5",
        cx: "0",
        cy: "0",
      });
      var ring = createSvgEl("circle", {
        class: "travel-map__ring",
        r: "8",
        cx: "0",
        cy: "0",
        fill: "none",
      });
      dotG.appendChild(halo);
      dotG.appendChild(ring);
      dotG.appendChild(core);
      var title = createSvgEl("title");
      title.textContent = c.name;
      dotG.appendChild(title);

      var label = createSvgEl("text", {
        class: "travel-map__label",
        x: String(dx),
        y: String(dy),
        "text-anchor": dx >= 0 ? "start" : "end",
      });
      label.textContent = c.short;
      dotG.appendChild(label);

      g.appendChild(dotG);
    });
    parent.appendChild(g);
  }

  function renderPinsGlobe(parent, λ0, φ0, R, cx, cy) {
    var g = createSvgEl("g", { class: "travel-map__dots" });
    CITIES.forEach(function (c) {
      var p = projectOrthoScreen(c.lon, c.lat, λ0, φ0, R, cx, cy);
      if (!p) return;
      var dx = c.labelDx != null ? c.labelDx : 8;
      var dy = c.labelDy != null ? c.labelDy : -10;
      var dotG = createSvgEl("g", {
        class: "travel-map__pin",
        transform: "translate(" + p.x + "," + p.y + ")",
      });
      dotG.appendChild(
        createSvgEl("circle", { class: "travel-map__halo", r: "18", cx: "0", cy: "0" })
      );
      dotG.appendChild(
        createSvgEl("circle", { class: "travel-map__core", r: "5", cx: "0", cy: "0" })
      );
      dotG.appendChild(
        createSvgEl("circle", {
          class: "travel-map__ring",
          r: "8",
          cx: "0",
          cy: "0",
          fill: "none",
        })
      );
      var title = createSvgEl("title");
      title.textContent = c.name;
      dotG.appendChild(title);
      var label = createSvgEl("text", {
        class: "travel-map__label",
        x: String(dx),
        y: String(dy),
        "text-anchor": dx >= 0 ? "start" : "end",
      });
      label.textContent = c.short;
      dotG.appendChild(label);
      g.appendChild(dotG);
    });
    parent.appendChild(g);
  }

  function appendOrthoLandBundle(dyn, dMain, dH, dT) {
    if (dMain) {
      dyn.appendChild(
        createSvgEl("path", {
          class: "travel-map__coast-glow travel-map__coast-glow--world",
          d: dMain,
          fill: "none",
        })
      );
      dyn.appendChild(
        createSvgEl("path", {
          class: "travel-map__land travel-map__land--world",
          d: dMain,
          fill: "rgba(210, 225, 240, 0.16)",
        })
      );
      dyn.appendChild(
        createSvgEl("path", {
          class: "travel-map__coast travel-map__coast--world",
          d: dMain,
          fill: "none",
        })
      );
    }
    function islandPair(d, landExtraClass) {
      if (!d) return;
      dyn.appendChild(
        createSvgEl("path", {
          class: "travel-map__coast-glow travel-map__coast-glow--world travel-map__coast-glow--island",
          d: d,
          fill: "none",
        })
      );
      dyn.appendChild(
        createSvgEl("path", {
          class:
            "travel-map__land travel-map__land--world travel-map__land--island" +
            (landExtraClass ? " " + landExtraClass : ""),
          d: d,
          fill: "rgba(210, 225, 240, 0.13)",
        })
      );
      dyn.appendChild(
        createSvgEl("path", {
          class: "travel-map__coast travel-map__coast--world travel-map__coast--island",
          d: d,
          fill: "none",
        })
      );
    }
    islandPair(dH, "");
    islandPair(dT, "travel-map__land--tw");
  }

  function attachPanZoom(svg, sceneG, opts) {
    var vbw = opts.vbw;
    var vbh = opts.vbh;
    var maxScale = opts.maxScale != null ? opts.maxScale : 6;
    var state = { tx: 0, ty: 0, s: 1 };
    var drag = null;

    function updateTransform() {
      sceneG.setAttribute(
        "transform",
        "translate(" + state.tx + "," + state.ty + ") scale(" + state.s + ")"
      );
    }

    function clamp() {
      if (state.s < 1) state.s = 1;
      if (state.s > maxScale) state.s = maxScale;
      var minTx = vbw - vbw * state.s;
      var minTy = vbh - vbh * state.s;
      state.tx = Math.min(0, Math.max(minTx, state.tx));
      state.ty = Math.min(0, Math.max(minTy, state.ty));
    }

    function svgPoint(clientX, clientY) {
      var pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      var ctm = svg.getScreenCTM();
      if (!ctm || typeof ctm.inverse !== "function") {
        return { x: vbw * 0.5, y: vbh * 0.5 };
      }
      return pt.matrixTransform(ctm.inverse());
    }

    svg.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var pt = svgPoint(e.clientX, e.clientY);
        var worldX = (pt.x - state.tx) / state.s;
        var worldY = (pt.y - state.ty) / state.s;
        var factor = e.deltaY > 0 ? 0.9 : 1.1;
        var s2 = state.s * factor;
        if (s2 < 1) s2 = 1;
        if (s2 > maxScale) s2 = maxScale;
        state.tx = pt.x - worldX * s2;
        state.ty = pt.y - worldY * s2;
        state.s = s2;
        clamp();
        updateTransform();
      },
      { passive: false }
    );

    svg.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
      svg.setPointerCapture(e.pointerId);
      svg.classList.add("is-dragging");
    });

    svg.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var p1 = svgPoint(drag.x, drag.y);
      var p2 = svgPoint(e.clientX, e.clientY);
      state.tx = drag.tx + (p2.x - p1.x);
      state.ty = drag.ty + (p2.y - p1.y);
      clamp();
      updateTransform();
    });

    function endDrag(e) {
      if (!drag) return;
      drag = null;
      svg.classList.remove("is-dragging");
      try {
        if (e && e.pointerId != null) svg.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    svg.addEventListener("pointerup", endDrag);
    svg.addEventListener("pointercancel", endDrag);

    svg.addEventListener("dblclick", function (e) {
      e.preventDefault();
      state.tx = 0;
      state.ty = 0;
      state.s = 1;
      updateTransform();
    });

    svg.classList.add("travel-map__svg--pannable");
    svg.setAttribute("tabindex", "0");
    updateTransform();
  }

  function attachGlobe(svg, globeState, redraw, cx, cy) {
    var drag = null;
    var R_MIN = 68;
    var R_MAX = 220;

    function svgPoint(clientX, clientY) {
      var pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      var ctm = svg.getScreenCTM();
      if (!ctm || typeof ctm.inverse !== "function") return { x: cx, y: cy };
      return pt.matrixTransform(ctm.inverse());
    }

    svg.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var factor = e.deltaY > 0 ? 0.92 : 1.09;
        var R2 = globeState.R * factor;
        globeState.R = Math.max(R_MIN, Math.min(R_MAX, R2));
        redraw();
      },
      { passive: false }
    );

    svg.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      drag = {
        x: e.clientX,
        y: e.clientY,
        λ0: globeState.λ0,
        φ0: globeState.φ0,
      };
      svg.setPointerCapture(e.pointerId);
      svg.classList.add("is-dragging");
    });

    svg.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var p1 = svgPoint(drag.x, drag.y);
      var p2 = svgPoint(e.clientX, e.clientY);
      var dλ = -(p2.x - p1.x) * 0.16;
      var dφ = (p2.y - p1.y) * 0.14;
      globeState.λ0 = drag.λ0 + dλ;
      while (globeState.λ0 > 180) globeState.λ0 -= 360;
      while (globeState.λ0 < -180) globeState.λ0 += 360;
      globeState.φ0 = Math.max(-82, Math.min(82, drag.φ0 + dφ));
      redraw();
    });

    function endDrag(e) {
      if (!drag) return;
      drag = null;
      svg.classList.remove("is-dragging");
      try {
        if (e && e.pointerId != null) svg.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    svg.addEventListener("pointerup", endDrag);
    svg.addEventListener("pointercancel", endDrag);

    svg.addEventListener("dblclick", function (e) {
      e.preventDefault();
      globeState.λ0 = 103.5;
      globeState.φ0 = 26.5;
      globeState.R = 118;
      redraw();
    });

    svg.classList.add("travel-map__svg--pannable");
    svg.setAttribute("tabindex", "0");
  }

  function initChinaMap(host) {
    var svg = createSvgEl("svg", {
      class: "travel-map__svg-inner",
      viewBox: "0 0 620 360",
      width: "100%",
      height: "100%",
      preserveAspectRatio: "xMidYMid meet",
      role: "application",
      "aria-label": "中国地图，可滚轮缩放与拖拽",
    });
    var defs = createSvgEl("defs");
    var grad = createSvgEl("radialGradient", { id: "travelMapChinaShade" });
    grad.appendChild(
      createSvgEl("stop", { offset: "0%", "stop-color": "rgba(255,255,255,0.14)" })
    );
    grad.appendChild(
      createSvgEl("stop", { offset: "55%", "stop-color": "rgba(255,255,255,0.05)" })
    );
    grad.appendChild(
      createSvgEl("stop", { offset: "100%", "stop-color": "rgba(0,0,0,0.28)" })
    );
    defs.appendChild(grad);
    svg.appendChild(defs);

    var sceneG = createSvgEl("g", { class: "travel-map__scene" });

    var pathD = buildPathFromLonLat(CHINA_MAINLAND_DENSE, projectChina);
    var pathH = buildPathFromLonLat(HAINAN_DENSE, projectChina);
    var pathT = buildPathFromLonLat(TAIWAN_DENSE, projectChina);

    sceneG.appendChild(
      createSvgEl("path", { class: "travel-map__coast-glow", d: pathD, fill: "none" })
    );
    sceneG.appendChild(
      createSvgEl("path", {
        class: "travel-map__land",
        d: pathD,
        fill: "url(#travelMapChinaShade)",
      })
    );
    sceneG.appendChild(
      createSvgEl("path", { class: "travel-map__coast", d: pathD, fill: "none" })
    );

    appendIslandPaths(sceneG, pathH, pathT);
    renderPinsAndLabels(sceneG, projectChina);

    svg.appendChild(sceneG);
    host.appendChild(svg);
    attachPanZoom(svg, sceneG, { vbw: 620, vbh: 360, maxScale: 6 });
  }

  function initWorldMap(host) {
    var CX = 200;
    var CY = 200;
    var CLIP_R = 156;
    var globeState = { λ0: 103.5, φ0: 26.5, R: 118 };

    var svg = createSvgEl("svg", {
      class: "travel-map__svg-inner travel-map__svg-inner--world",
      viewBox: "0 0 400 400",
      width: "100%",
      height: "100%",
      preserveAspectRatio: "xMidYMid meet",
      role: "application",
      "aria-label": "球形地球，拖拽旋转，滚轮缩放，双击重置",
    });

    var defs = createSvgEl("defs");
    var clip = createSvgEl("clipPath", { id: "travelWorldMapClip" });
    clip.appendChild(
      createSvgEl("circle", { cx: String(CX), cy: String(CY), r: String(CLIP_R) })
    );
    defs.appendChild(clip);

    var oceanGrad = createSvgEl("radialGradient", {
      id: "travelGlobeOcean",
      cx: "42%",
      cy: "38%",
      r: "78%",
    });
    oceanGrad.appendChild(
      createSvgEl("stop", { offset: "0%", "stop-color": "rgba(55, 115, 165, 0.55)" })
    );
    oceanGrad.appendChild(
      createSvgEl("stop", { offset: "45%", "stop-color": "rgba(10, 22, 42, 0.94)" })
    );
    oceanGrad.appendChild(
      createSvgEl("stop", { offset: "100%", "stop-color": "rgba(1, 3, 8, 0.99)" })
    );
    defs.appendChild(oceanGrad);

    var rimGrad = createSvgEl("radialGradient", { id: "travelGlobeRim", cx: "48%", cy: "32%", r: "62%" });
    rimGrad.appendChild(
      createSvgEl("stop", { offset: "0%", "stop-color": "rgba(200, 225, 250, 0.2)" })
    );
    rimGrad.appendChild(createSvgEl("stop", { offset: "100%", "stop-color": "rgba(0, 0, 0, 0)" }));
    defs.appendChild(rimGrad);
    svg.appendChild(defs);

    var worldG = createSvgEl("g", { "clip-path": "url(#travelWorldMapClip)" });
    worldG.appendChild(
      createSvgEl("rect", {
        x: "0",
        y: "0",
        width: "400",
        height: "400",
        fill: "#010308",
      })
    );
    worldG.appendChild(
      createSvgEl("circle", {
        class: "travel-map__globe-ocean",
        cx: String(CX),
        cy: String(CY),
        r: "158",
        fill: "url(#travelGlobeOcean)",
      })
    );
    worldG.appendChild(
      createSvgEl("circle", {
        class: "travel-map__globe-atmos",
        cx: String(CX),
        cy: String(CY - 2),
        r: "154",
        fill: "url(#travelGlobeRim)",
      })
    );

    var dyn = createSvgEl("g", { class: "travel-map__globe-dynamic" });
    worldG.appendChild(dyn);
    svg.appendChild(worldG);

    svg.appendChild(
      createSvgEl("circle", {
        class: "travel-map__globe-limb",
        cx: String(CX),
        cy: String(CY),
        r: String(CLIP_R),
        fill: "none",
      })
    );

    function redrawGlobe() {
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      var λ0 = globeState.λ0;
      var φ0 = globeState.φ0;
      var R = globeState.R;
      appendOrthoGraticule(dyn, λ0, φ0, R, CX, CY);
      var dM = orthoPathD(CHINA_MAINLAND_DENSE, λ0, φ0, R, CX, CY);
      var dH = orthoPathD(HAINAN_DENSE, λ0, φ0, R, CX, CY);
      var dT = orthoPathD(TAIWAN_DENSE, λ0, φ0, R, CX, CY);
      appendOrthoLandBundle(dyn, dM, dH, dT);
      renderPinsGlobe(dyn, λ0, φ0, R, CX, CY);
    }

    redrawGlobe();
    attachGlobe(svg, globeState, redrawGlobe, CX, CY);
    host.appendChild(svg);
  }

  function setTravelMapHint(mode) {
    var el = document.getElementById("travelMapHint");
    if (!el) return;
    if (mode === "china") {
      el.textContent = "滚轮缩放 · 拖拽平移 · 双击重置视图";
    } else {
      el.textContent = "拖拽旋转地球 · 滚轮缩放视距 · 双击重置";
    }
  }

  function setLegend(mode) {
    var el = document.getElementById("travelMapLegend");
    if (!el) return;
    var names = CITIES.map(function (c) {
      return c.short;
    }).join(" · ");
    if (mode === "china") {
      el.hidden = false;
      el.removeAttribute("aria-hidden");
      el.textContent = "中国打卡 · 已点亮 " + names;
    } else {
      el.textContent = "";
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
    }
  }

  function setMode(mode) {
    var root = document.getElementById("travelMapRoot");
    var viewport = root && root.querySelector(".travel-map__viewport");
    var chinaHost = document.getElementById("travelMapChinaHost");
    var worldHost = document.getElementById("travelMapWorldHost");
    var tabs = document.querySelectorAll(".travel-map__tab");
    if (!chinaHost || !worldHost) return;

    var isChina = mode === "china";
    if (viewport) {
      viewport.classList.toggle("travel-map__viewport--globe", !isChina);
    }
    chinaHost.hidden = !isChina;
    chinaHost.setAttribute("aria-hidden", isChina ? "false" : "true");
    worldHost.hidden = isChina;
    worldHost.setAttribute("aria-hidden", isChina ? "true" : "false");

    tabs.forEach(function (btn) {
      var m = btn.getAttribute("data-map");
      var on = (m === "china" && isChina) || (m === "world" && !isChina);
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    setLegend(isChina ? "china" : "world");
    setTravelMapHint(isChina ? "china" : "world");
  }

  function init() {
    var chinaHost = document.getElementById("travelMapChinaHost");
    var worldHost = document.getElementById("travelMapWorldHost");
    if (!chinaHost || !worldHost) return;

    initChinaMap(chinaHost);
    initWorldMap(worldHost);
    setMode("china");

    document.querySelectorAll(".travel-map__tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var m = btn.getAttribute("data-map");
        if (m === "china" || m === "world") setMode(m);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
