(function () {
  "use strict";

  // ============================================================
  // 决策树（针对 10 个零件，这套方案已用程序验证：20 种缺陷全覆盖，最坏正好 3 次）
  // 每个称量节点带 pans（真实球号，含当砝码的“好球”）和 weigh（给孩子看的说明）。
  // 第三次的子节点要么是 {conclusion}，要么是 null（这种结果不会出现）。
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
  const DISP = { 左: "左沉", 平: "平衡", 右: "右沉" };

  // 给定三次结果（如 "左平右"），顺着决策树查出结论；null 表示这种结果不会出现。
  function conclusionFor(combo) {
    let node = TREE;
    for (let i = 0; i < combo.length; i++) {
      node = node.children[combo[i]];
      if (node == null) return null;
    }
    return node.conclusion || null;
  }

  // 假设次品是 coin 号、偏 sign（"重"/"轻"），预测这次称量哪边沉。
  function predictResult(left, right, coin, sign) {
    if (left.indexOf(coin) !== -1) return sign === "重" ? "左" : "右";
    if (right.indexOf(coin) !== -1) return sign === "重" ? "右" : "左";
    return "平";
  }

  // 练习题：3 的乘方；最少称量次数 = 最小的 k 使 3^k ≥ 情况数(2n)。
  // 题目里选的 n 都避开了边界值（4、13、40…），所以这个简单规则给出的就是真正能做到的最少次数。
  function pow3(k) {
    let p = 1;
    for (let i = 0; i < k; i++) p *= 3;
    return p;
  }
  function minWeighings(n) {
    const cases = 2 * n;
    let k = 1;
    while (pow3(k) < cases) k++;
    return k;
  }
  const PRACTICE_NS = [3, 10, 12, 30, 100, 300, 1000];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      TREE: TREE,
      conclusionFor: conclusionFor,
      predictResult: predictResult,
      ORDER: ORDER,
      pow3: pow3,
      minWeighings: minWeighings,
      PRACTICE_NS: PRACTICE_NS,
    };
  }
  if (typeof document === "undefined") return;

  // ============================================================
  // 完整决策树（递归画出，静态）
  // ============================================================
  function renderNode(node, depth, edge) {
    const edgeHtml = edge ? '<span class="tedge tedge-' + edge + '">' + DISP[edge] + "</span>" : "";

    if (node && node.weigh) {
      let branches = "";
      for (const r of ORDER) branches += renderNode(node.children[r], depth + 1, r);
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
    const leafTxt = isReal ? node.conclusion : "不会出现";
    return (
      '<div class="tnode"><div class="tnode-head">' +
      edgeHtml +
      '<span class="' + leafCls + '">' + leafTxt + "</span>" +
      "</div></div>"
    );
  }

  function renderTree() {
    document.querySelector("#decisionTree").innerHTML = renderNode(TREE, 0, null);
  }

  // ============================================================
  // 27 行对照表（静态）
  // ============================================================
  function buildTable() {
    let html = "";
    for (const a of ORDER) {
      for (const b of ORDER) {
        for (const c of ORDER) {
          const combo = a + b + c;
          const concl = conclusionFor(combo);
          const impossible = concl === null;
          html +=
            '<tr class="' + (impossible ? "impossible" : "") + '">' +
            '<td class="combo-cell">' + combo + "</td>" +
            "<td>" + (impossible ? "—（不会出现）" : concl) + "</td>" +
            "</tr>";
        }
      }
    }
    document.querySelector("#comboTable27 tbody").innerHTML = html;
  }

  // ============================================================
  // 第三部分：练习题
  // ============================================================
  function renderPowers() {
    let html = "";
    for (let k = 1; k <= 8; k++) {
      html += '<tr><td class="combo-cell">' + k + "</td><td>3<sup>" + k + "</sup> = " + pow3(k) + "</td></tr>";
    }
    document.querySelector("#powersTable tbody").innerHTML = html;
  }

  function renderPractices() {
    const html = PRACTICE_NS.map(function (n, i) {
      const cases = 2 * n;
      const k = minWeighings(n);
      const id = "ans-" + (i + 1);
      return (
        '<article class="practice-card">' +
        '<span class="practice-tag">第 ' + (i + 1) + " 题</span>" +
        '<p class="practice-question">' +
        n +
        " 个零件，其中 1 个是次品，不知轻重。至少称几次，才能找出它、并判断它偏重还是偏轻？</p>" +
        '<button type="button" class="ghost-action" data-answer="' + id + '">看答案</button>' +
        '<div class="practice-answer" id="' + id + '" hidden>' +
        "情况数 = " + n + " × 2 = <strong>" + cases + "</strong>。<br>" +
        "查表：3<sup>" + (k - 1) + "</sup> = " + pow3(k - 1) + " 还不够（&lt; " + cases +
        "），3<sup>" + k + "</sup> = " + pow3(k) + " 够了（≥ " + cases + "）。<br>" +
        "所以最少称 <strong>" + k + " 次</strong>。" +
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

  renderTree();
  buildTable();
  renderPowers();
  renderPractices();
})();
