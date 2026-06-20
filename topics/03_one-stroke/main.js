(function () {
  "use strict";

  // ============================================================
  // 图数据：半个篮球场示意图（viewBox 0 0 400 480）
  // ============================================================
  const V = {
    A: [60, 40], B: [340, 40], C: [340, 440], D: [60, 440], // 外框四角
    P1: [110, 40], P2: [165, 40], P3: [235, 40], P4: [290, 40], // 上方两条弧的脚
    I: [150, 440], J: [250, 440], // 罚球区在底线上的两脚
    G: [150, 300], H: [250, 300], // 罚球线两端
  };

  // 每条“实线”边：a,b 端点；kind=line/arc；arc 带 r 和 sweep；stroke=属于第几笔
  const EDGES = [
    { id: "e1", a: "A", b: "P1", kind: "line", stroke: 1 },
    { id: "e2", a: "P1", b: "P2", kind: "line", stroke: 2 },
    { id: "e3", a: "P2", b: "P3", kind: "line", stroke: 2 },
    { id: "e4", a: "P3", b: "P4", kind: "line", stroke: 2 },
    { id: "e5", a: "P4", b: "B", kind: "line", stroke: 1 },
    { id: "e6", a: "P1", b: "P2", kind: "arc", r: 27.5, sweep: 0, stroke: 1 }, // 左上弧
    { id: "e7", a: "P3", b: "P4", kind: "arc", r: 27.5, sweep: 0, stroke: 1 }, // 右上弧
    { id: "e8", a: "B", b: "C", kind: "line", stroke: 1 },
    { id: "e9", a: "C", b: "J", kind: "line", stroke: 1 },
    { id: "e10", a: "J", b: "I", kind: "line", stroke: 1 },
    { id: "e11", a: "I", b: "D", kind: "line", stroke: 1 },
    { id: "e12", a: "D", b: "A", kind: "line", stroke: 1 },
    { id: "e13", a: "I", b: "G", kind: "line", stroke: 3 }, // 罚球区左竖线
    { id: "e14", a: "J", b: "H", kind: "line", stroke: 4 }, // 罚球区右竖线
    { id: "e15", a: "G", b: "H", kind: "line", stroke: 3 }, // 罚球线
    { id: "e16", a: "G", b: "H", kind: "arc", r: 50, sweep: 1, stroke: 4 }, // 罚球圈外弧
  ];

  // 被忽略的虚线（罚球圈靠篮筐的半圆）
  const DASHED = { a: "G", b: "H", kind: "arc", r: 50, sweep: 0 };

  // 4 笔：每一笔是一串边，按顺序首尾相接构成一条 trail（不重复用边）
  const STROKES = [
    ["e6", "e1", "e12", "e11", "e10", "e9", "e8", "e5", "e7"], // 第1笔：左弧→外框一大圈→右弧
    ["e2", "e3", "e4"], // 第2笔：上边中间三小段
    ["e13", "e15"], // 第3笔：左竖线 + 罚球线
    ["e14", "e16"], // 第4笔：右竖线 + 罚球圈外弧
  ];

  const ODD = ["P1", "P2", "P3", "P4", "I", "J", "G", "H"]; // 8 个奇点
  const STROKE_COLORS = ["#d1495b", "#2e7d32", "#1f6feb", "#c97a1f"]; // 红 绿 蓝 橙
  const STROKE_DESC = [
    "四笔合在一起，正好不重不漏地画完整张图。每种颜色一笔。",
    "第 1 笔（红）：从一个奇点起笔，先画左上弧，再沿外框绕一大圈，最后画右上弧。",
    "第 2 笔（绿）：上边中间的三小段。",
    "第 3 笔（蓝）：罚球区左边竖线 + 罚球线。",
    "第 4 笔（橙）：罚球区右边竖线 + 罚球圈外面那条弧。",
  ];

  const byId = {};
  EDGES.forEach(function (e) { byId[e.id] = e; });

  // ---- 纯逻辑（可被测试导入）----
  function degreeMap(pairs) {
    const d = {};
    pairs.forEach(function (p) {
      d[p[0]] = (d[p[0]] || 0) + 1;
      d[p[1]] = (d[p[1]] || 0) + 1;
    });
    return d;
  }
  function oddOf(pairs) {
    const d = degreeMap(pairs);
    return Object.keys(d).filter(function (k) { return d[k] % 2 === 1; }).sort();
  }
  function strokesNeeded(oddCount) {
    return oddCount === 0 ? 1 : oddCount / 2;
  }
  // 把一串边按首尾相接走一遍，返回 [起点,终点]；走不通返回 null
  function trailEndpoints(edgeIds) {
    const segs = edgeIds.map(function (id) { return [byId[id].a, byId[id].b]; });
    if (segs.length === 1) return segs[0].slice();
    let cur, start;
    const s0 = segs[0], s1 = segs[1];
    if (s0[0] === s1[0] || s0[0] === s1[1]) { start = s0[1]; cur = s0[0]; }
    else if (s0[1] === s1[0] || s0[1] === s1[1]) { start = s0[0]; cur = s0[1]; }
    else return null;
    for (let i = 1; i < segs.length; i++) {
      const s = segs[i];
      if (s[0] === cur) cur = s[1];
      else if (s[1] === cur) cur = s[0];
      else return null;
    }
    return [start, cur];
  }
  function verify() {
    const courtPairs = EDGES.map(function (e) { return [e.a, e.b]; });
    const odd = oddOf(courtPairs);
    const all = EDGES.map(function (e) { return e.id; }).sort();
    const used = [].concat.apply([], STROKES).sort();
    const coverOK = all.length === used.length && new Set(used).size === used.length && all.every(function (id, i) { return id === used[i]; });
    const oddSet = new Set(odd);
    let trailsOK = true, endpointsOdd = true;
    STROKES.forEach(function (st) {
      const ep = trailEndpoints(st);
      if (!ep) { trailsOK = false; return; }
      if (!oddSet.has(ep[0]) || !oddSet.has(ep[1])) endpointsOdd = false;
    });
    let colorConsistent = true;
    STROKES.forEach(function (st, i) {
      st.forEach(function (id) { if (byId[id].stroke !== i + 1) colorConsistent = false; });
    });
    return { odd: odd, oddCount: odd.length, strokeCount: STROKES.length, coverOK: coverOK, trailsOK: trailsOK, endpointsOdd: endpointsOdd, colorConsistent: colorConsistent };
  }

  // 一般性结论的小例子（三角形 / “日” / “田”）
  const EXAMPLES = [
    {
      name: "三角形", box: 120,
      V: { a: [20, 96], b: [100, 96], c: [60, 20] },
      E: [["a", "b"], ["b", "c"], ["c", "a"]],
    },
    {
      name: "“日”字", box: 120,
      V: { tl: [30, 14], tr: [90, 14], ml: [30, 60], mr: [90, 60], bl: [30, 106], br: [90, 106] },
      E: [["tl", "tr"], ["tl", "ml"], ["ml", "bl"], ["tr", "mr"], ["mr", "br"], ["ml", "mr"], ["bl", "br"]],
    },
    {
      name: "“田”字", box: 120,
      V: { tl: [20, 20], tr: [100, 20], bl: [20, 100], br: [100, 100], mt: [60, 20], mb: [60, 100], mlt: [20, 60], mrt: [100, 60], ct: [60, 60] },
      E: [["tl", "mt"], ["mt", "tr"], ["tr", "mrt"], ["mrt", "br"], ["br", "mb"], ["mb", "bl"], ["bl", "mlt"], ["mlt", "tl"], ["mt", "ct"], ["ct", "mb"], ["mlt", "ct"], ["ct", "mrt"]],
    },
  ];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { V: V, EDGES: EDGES, DASHED: DASHED, STROKES: STROKES, ODD: ODD, STROKE_COLORS: STROKE_COLORS, oddOf: oddOf, strokesNeeded: strokesNeeded, trailEndpoints: trailEndpoints, verify: verify, EXAMPLES: EXAMPLES };
  }

  // ============================================================
  // SVG 渲染
  // ============================================================
  function edgePath(e) {
    const p1 = V[e.a], p2 = V[e.b];
    if (e.kind === "line") return "M " + p1[0] + " " + p1[1] + " L " + p2[0] + " " + p2[1];
    return "M " + p1[0] + " " + p1[1] + " A " + e.r + " " + e.r + " 0 0 " + e.sweep + " " + p2[0] + " " + p2[1];
  }

  // 起点/终点高亮标记（只在画单独一笔时用）
  function endpointMark(v, kind, label) {
    const x = V[v][0], y = V[v][1];
    return '<g class="endpt ' + kind + '"><circle cx="' + x + '" cy="' + y + '" r="11"/>' +
      '<text x="' + x + '" y="' + y + '">' + label + "</text></g>";
  }

  function buildCourtSVG(opts) {
    opts = opts || {};
    let s = '<svg viewBox="0 0 400 480" class="court" role="img" aria-label="半个篮球场">';
    if (opts.showDashed !== false) {
      s += '<path d="' + edgePath(DASHED) + '" class="dashed-arc"/>';
    }
    EDGES.forEach(function (e) {
      let style = "";
      if (opts.colored) {
        if (opts.active && e.stroke !== opts.active) style = "stroke:#cfdad6;";
        else style = "stroke:" + STROKE_COLORS[e.stroke - 1] + ";";
      }
      s += '<path d="' + edgePath(e) + '" class="court-edge" style="' + style + '"/>';
    });
    if (opts.showOdd) {
      const active = opts.active || 0;
      let sv = null, ev = null;
      if (active > 0) { const ep = trailEndpoints(STROKES[active - 1]); sv = ep[0]; ev = ep[1]; }
      ODD.forEach(function (v) {
        if (active > 0 && (v === sv || v === ev)) return; // 起终点单独高亮，下面画
        s += '<circle cx="' + V[v][0] + '" cy="' + V[v][1] + '" r="7.5" class="odd-dot' + (active > 0 ? " dim" : "") + '"/>';
      });
      if (active > 0) {
        s += endpointMark(sv, "start", "起");
        s += endpointMark(ev, "end", "终");
      }
    }
    s += "</svg>";
    return s;
  }

  // ============================================================
  // 一般性结论的小例子
  // ============================================================
  function buildMiniSVG(ex) {
    let s = '<svg viewBox="0 0 ' + ex.box + " " + ex.box + '" class="mini" role="img" aria-label="' + ex.name + '">';
    ex.E.forEach(function (pr) {
      const p1 = ex.V[pr[0]], p2 = ex.V[pr[1]];
      s += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '" class="mini-edge"/>';
    });
    const odd = oddOf(ex.E);
    odd.forEach(function (v) {
      s += '<circle cx="' + ex.V[v][0] + '" cy="' + ex.V[v][1] + '" r="5.5" class="mini-odd"/>';
    });
    return { svg: s, odd: odd.length, strokes: strokesNeeded(odd.length) };
  }

  if (typeof document === "undefined") return;

  // ---- 渲染三张图 ----
  document.querySelector("#svgProblem").innerHTML = buildCourtSVG({ colored: false, showOdd: false, showDashed: true });
  document.querySelector("#svgOdd").innerHTML = buildCourtSVG({ colored: false, showOdd: true, showDashed: true });

  const strokesHost = document.querySelector("#svgStrokes");
  function renderStrokes(active) {
    strokesHost.innerHTML = buildCourtSVG({ colored: true, active: active, showOdd: true, showDashed: true });
    document.querySelector("#strokeDesc").textContent = STROKE_DESC[active];
  }
  renderStrokes(0);

  // 图例
  document.querySelector("#strokeLegend").innerHTML = STROKE_COLORS.map(function (c, i) {
    return '<span class="legend-item"><span class="legend-swatch" style="background:' + c + '"></span>第 ' + (i + 1) + " 笔</span>";
  }).join("");

  // 逐笔切换按钮
  const controls = document.querySelector("#strokeControls");
  controls.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-stroke]");
    if (!btn) return;
    controls.querySelectorAll(".stroke-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    renderStrokes(parseInt(btn.dataset.stroke, 10));
  });

  // ---- 例子 ----
  document.querySelector("#examples").innerHTML = EXAMPLES.map(function (ex) {
    const m = buildMiniSVG(ex);
    return (
      '<figure class="example-card">' +
      m.svg +
      '<figcaption><strong>' + ex.name + "</strong><br>" +
      "奇点 " + m.odd + " 个 → <strong>" + m.strokes + " 笔</strong></figcaption>" +
      "</figure>"
    );
  }).join("") +
    '<figure class="example-card highlight">' +
    buildCourtSVG({ colored: true, active: 0, showOdd: true, showDashed: true }).replace('class="court"', 'class="court mini-court"') +
    '<figcaption><strong>半个篮球场</strong><br>奇点 8 个 → <strong>4 笔</strong></figcaption></figure>';
})();
