(function () {
  "use strict";

  // ============================================================
  // 决策树（10 个零件，已验证：20 种缺陷全覆盖，最坏正好 3 次）
  // ============================================================
  const TREE = {
    weigh: "1 2 3 ⚖ 4 5 6",
    pans: { left: [1, 2, 3], right: [4, 5, 6] },
    children: {
      左: {
        weigh: "1 4 ⚖ 2 5",
        pans: { left: [1, 4], right: [2, 5] },
        children: {
          左: { weigh: "1 号 ⚖ 一个好球", pans: { left: [1], right: [7] }, children: { 左: { conclusion: "1 号偏重" }, 平: { conclusion: "5 号偏轻" }, 右: null } },
          平: { weigh: "3 号 ⚖ 一个好球", pans: { left: [3], right: [7] }, children: { 左: { conclusion: "3 号偏重" }, 平: { conclusion: "6 号偏轻" }, 右: null } },
          右: { weigh: "2 号 ⚖ 一个好球", pans: { left: [2], right: [7] }, children: { 左: { conclusion: "2 号偏重" }, 平: { conclusion: "4 号偏轻" }, 右: null } },
        },
      },
      平: {
        weigh: "7 8 ⚖ 9 ＋一个好球",
        pans: { left: [7, 8], right: [9, 1] },
        children: {
          左: { weigh: "7 号 ⚖ 8 号", pans: { left: [7], right: [8] }, children: { 左: { conclusion: "7 号偏重" }, 平: { conclusion: "9 号偏轻" }, 右: { conclusion: "8 号偏重" } } },
          平: { weigh: "10 号 ⚖ 一个好球", pans: { left: [10], right: [1] }, children: { 左: { conclusion: "10 号偏重" }, 平: null, 右: { conclusion: "10 号偏轻" } } },
          右: { weigh: "7 号 ⚖ 8 号", pans: { left: [7], right: [8] }, children: { 左: { conclusion: "8 号偏轻" }, 平: { conclusion: "9 号偏重" }, 右: { conclusion: "7 号偏轻" } } },
        },
      },
      右: {
        weigh: "1 4 ⚖ 2 5",
        pans: { left: [1, 4], right: [2, 5] },
        children: {
          左: { weigh: "4 号 ⚖ 一个好球", pans: { left: [4], right: [7] }, children: { 左: { conclusion: "4 号偏重" }, 平: { conclusion: "2 号偏轻" }, 右: null } },
          平: { weigh: "6 号 ⚖ 一个好球", pans: { left: [6], right: [7] }, children: { 左: { conclusion: "6 号偏重" }, 平: { conclusion: "3 号偏轻" }, 右: null } },
          右: { weigh: "5 号 ⚖ 一个好球", pans: { left: [5], right: [7] }, children: { 左: { conclusion: "5 号偏重" }, 平: { conclusion: "1 号偏轻" }, 右: null } },
        },
      },
    },
  };

  const ORDER = ["左", "平", "右"];

  // 给定三次结果（如 "左平右"），顺着决策树查结论；null 表示不会出现。
  function conclusionFor(combo) {
    let node = TREE;
    for (let i = 0; i < combo.length; i++) {
      node = node.children[combo[i]];
      if (node == null) return null;
    }
    return node.conclusion || null;
  }

  // 只保留零件号，去掉“偏重/偏轻”。
  function coinOnly(conclusion) {
    return conclusion.replace(/偏[重轻]/, "");
  }

  // 预测一次称量哪边沉（coin 号、偏 sign："重"/"轻"）。
  function predictResult(left, right, coin, sign) {
    if (left.indexOf(coin) !== -1) return sign === "重" ? "左" : "右";
    if (right.indexOf(coin) !== -1) return sign === "重" ? "右" : "左";
    return "平";
  }

  // 速查/练习用：3 的乘方，以及 k 次最多能搞定多少个零件。
  function pow3(k) {
    let p = 1;
    for (let i = 0; i < k; i++) p *= 3;
    return p;
  }
  function findMax(k) {
    return (pow3(k) - 1) / 2; // 只找出（不分轻重）
  }
  function fullMax(k) {
    return (pow3(k) - 3) / 2; // 要分轻重
  }
  function minWeigh(n, mustDir) {
    let k = 1;
    while ((mustDir ? fullMax(k) : findMax(k)) < n) k++;
    return k;
  }

  // 练习题（混合两种类型）。dir=true 表示要分轻重。
  const PRACTICES = [
    { n: 10, dir: true },
    { n: 10, dir: false },
    { n: 13, dir: true },
    { n: 13, dir: false },
    { n: 4, dir: true },
    { n: 4, dir: false },
    { n: 40, dir: false },
    { n: 100, dir: true },
    { n: 1000, dir: false },
  ];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      TREE: TREE,
      ORDER: ORDER,
      conclusionFor: conclusionFor,
      coinOnly: coinOnly,
      predictResult: predictResult,
      pow3: pow3,
      findMax: findMax,
      fullMax: fullMax,
      minWeigh: minWeigh,
      PRACTICES: PRACTICES,
    };
  }
  if (typeof document === "undefined") return;

  // ============================================================
  // 完整决策树（递归画出，静态）；findOnly=true 时叶子只显示零件号
  // ============================================================
  function renderNode(node, depth, edge, findOnly) {
    const edgeHtml = edge ? '<span class="tedge tedge-' + edge + '">' + ({ 左: "左沉", 平: "平衡", 右: "右沉" })[edge] + "</span>" : "";

    if (node && node.weigh) {
      let branches = "";
      for (const r of ORDER) branches += renderNode(node.children[r], depth + 1, r, findOnly);
      return (
        '<div class="tnode">' +
        '<div class="tnode-head">' +
        edgeHtml +
        '<span class="tweigh">第 ' + (depth + 1) + " 次：" + node.weigh + "</span>" +
        "</div>" +
        '<div class="tbranches">' + branches + "</div>" +
        "</div>"
      );
    }

    const isReal = node && node.conclusion;
    const leafCls = isReal ? "tleaf" : "tleaf timpossible";
    const leafTxt = isReal ? (findOnly ? coinOnly(node.conclusion) : node.conclusion) : "不会出现";
    return '<div class="tnode"><div class="tnode-head">' + edgeHtml + '<span class="' + leafCls + '">' + leafTxt + "</span></div></div>";
  }

  function renderTree(selector, findOnly) {
    document.querySelector(selector).innerHTML = renderNode(TREE, 0, null, findOnly);
  }

  // 27 行对照表；findOnly=true 时只显示零件号
  function buildTable(tbodySelector, findOnly) {
    let html = "";
    for (const a of ORDER) {
      for (const b of ORDER) {
        for (const c of ORDER) {
          const combo = a + b + c;
          const concl = conclusionFor(combo);
          const impossible = concl === null;
          const text = impossible ? "—（不会出现）" : findOnly ? coinOnly(concl) : concl;
          html += '<tr class="' + (impossible ? "impossible" : "") + '"><td class="combo-cell">' + combo + "</td><td>" + text + "</td></tr>";
        }
      }
    }
    document.querySelector(tbodySelector).innerHTML = html;
  }

  // ============================================================
  // 第四部分：速查表 + 练习题
  // ============================================================
  function renderRefTable() {
    let html = "";
    for (let k = 1; k <= 8; k++) {
      html += "<tr><td class=\"combo-cell\">" + k + "</td><td>" + pow3(k) + "</td><td>" + findMax(k) + "</td><td>" + fullMax(k) + "</td></tr>";
    }
    document.querySelector("#refTable tbody").innerHTML = html;
  }

  function renderPractices() {
    const html = PRACTICES.map(function (p, i) {
      const k = minWeigh(p.n, p.dir);
      const maxK = p.dir ? fullMax(k) : findMax(k);
      const maxPrev = p.dir ? fullMax(k - 1) : findMax(k - 1);
      const col = p.dir ? "要分轻重" : "只找出";
      const id = "ans-" + (i + 1);
      const ask = p.dir
        ? "至少称几次，才能找出它、并判断它偏重还是偏轻？"
        : "至少称几次，才能找出它（不用管轻重）？";
      return (
        '<article class="practice-card">' +
        '<span class="practice-type ' + (p.dir ? "dir" : "find") + '">' + col + "</span>" +
        '<span class="practice-tag">第 ' + (i + 1) + " 题</span>" +
        '<p class="practice-question">' + p.n + " 个零件，其中 1 个是次品，不知轻重。" + ask + "</p>" +
        '<button type="button" class="ghost-action" data-answer="' + id + '">看答案</button>' +
        '<div class="practice-answer" id="' + id + '" hidden>' +
        "查“" + col + "·最多”那列：" + (k - 1) + " 次最多 " + maxPrev + " 个（不够），" + k + " 次最多 " + maxK +
        " 个（" + p.n + " ≤ " + maxK + "，够）。<br>所以最少称 <strong>" + k + " 次</strong>。" +
        "</div></article>"
      );
    }).join("");
    document.querySelector("#practiceList").innerHTML = html;
  }

  document.querySelector("#practiceList").addEventListener("click", function (event) {
    const btn = event.target.closest("[data-answer]");
    if (!btn) return;
    const ans = document.getElementById(btn.dataset.answer);
    const show = ans.hidden;
    ans.hidden = !show;
    btn.textContent = show ? "收起答案" : "看答案";
  });

  // ---- 启动 ----
  renderTree("#decisionTree", false);
  buildTable("#comboTable27 tbody", false);
  renderTree("#decisionTreeFind", true);
  buildTable("#comboTableFind tbody", true);
  renderRefTable();
  renderPractices();
})();
