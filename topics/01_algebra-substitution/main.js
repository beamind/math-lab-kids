const blocks = {
  x: { a: 1, b: 2, c: 0, text: "a + 2b" },
  y: { a: 0, b: 3, c: 1, text: "3b + c" },
};

const builders = {
  first: {
    x: 0,
    y: 0,
    target: { a: 2, b: 13, c: 3 },
    value: 90,
    solved: false,
  },
  second: {
    x: 0,
    y: 0,
    target: { a: 3, b: 9, c: 1 },
    value: 72,
    solved: false,
  },
};

const practices = [
  {
    id: "practice-1",
    mode: "guided",
    title: "练习 1：先拼一拼",
    given: ["4a + 17b + 3c = 72", "a + 8b + 2c = 28"],
    targetFraction: { top: "3b + c", bottom: "a + 2b" },
    xBlock: { a: 1, b: 2, c: 0, text: "a + 2b" },
    yBlock: { a: 0, b: 3, c: 1, text: "3b + c" },
    equations: [
      { x: 4, y: 3, value: 72 },
      { x: 1, y: 2, value: 28 },
    ],
    solution: "设 X = a + 2b，Y = 3b + c。原条件变成 4X + 3Y = 72，X + 2Y = 28。解得 X = 12，Y = 8，所以 Y / X = 2 / 3。",
  },
  {
    id: "practice-2",
    mode: "guided",
    title: "练习 2：再拼一拼",
    given: ["6a + 5b + 2c = 60", "4a + 6b + 4c = 80"],
    targetFraction: { top: "b + c", bottom: "2a + b" },
    xBlock: { a: 2, b: 1, c: 0, text: "2a + b" },
    yBlock: { a: 0, b: 1, c: 1, text: "b + c" },
    equations: [
      { x: 3, y: 2, value: 60 },
      { x: 2, y: 4, value: 80 },
    ],
    solution: "设 X = 2a + b，Y = b + c。原条件变成 3X + 2Y = 60，2X + 4Y = 80。解得 X = 10，Y = 15，所以 Y / X = 3 / 2。",
  },
  {
    id: "practice-3",
    mode: "guided",
    title: "练习 3：换一组整体",
    given: ["5a + 7b + c = 63", "2a + 8b + 3c = 72"],
    targetFraction: { top: "2b + c", bottom: "a + b" },
    xBlock: { a: 1, b: 1, c: 0, text: "a + b" },
    yBlock: { a: 0, b: 2, c: 1, text: "2b + c" },
    equations: [
      { x: 5, y: 1, value: 63 },
      { x: 2, y: 3, value: 72 },
    ],
    solution: "设 X = a + b，Y = 2b + c。原条件变成 5X + Y = 63，2X + 3Y = 72。解得 X = 9，Y = 18，所以 Y / X = 2。",
  },
  {
    id: "practice-4",
    mode: "guided",
    title: "练习 4：继续拼方程",
    given: ["5a + 17b + 2c = 75", "2a + 9b + 3c = 85"],
    targetFraction: { top: "b + c", bottom: "a + 3b" },
    xBlock: { a: 1, b: 3, c: 0, text: "a + 3b" },
    yBlock: { a: 0, b: 1, c: 1, text: "b + c" },
    equations: [
      { x: 5, y: 2, value: 75 },
      { x: 2, y: 3, value: 85 },
    ],
    solution: "设 X = a + 3b，Y = b + c。原条件变成 5X + 2Y = 75，2X + 3Y = 85。解得 X = 5，Y = 25，所以 Y / X = 5。",
  },
  {
    id: "practice-5",
    mode: "guided",
    title: "练习 5：注意 c 的系数",
    given: ["4a + 7b + 2c = 28", "2a + 6b + 6c = 44"],
    targetFraction: { top: "b + 2c", bottom: "2a + 3b" },
    xBlock: { a: 2, b: 3, c: 0, text: "2a + 3b" },
    yBlock: { a: 0, b: 1, c: 2, text: "b + 2c" },
    equations: [
      { x: 2, y: 1, value: 28 },
      { x: 1, y: 3, value: 44 },
    ],
    solution: "设 X = 2a + 3b，Y = b + 2c。原条件变成 2X + Y = 28，X + 3Y = 44。解得 X = 8，Y = 12，所以 Y / X = 3 / 2。",
  },
  {
    id: "practice-6",
    mode: "guided",
    title: "练习 6：整体不一定按顺序出现",
    given: ["5a + 2b + c = 28", "5a + b + 3c = 49"],
    targetFraction: { top: "2a + b", bottom: "a + c" },
    xBlock: { a: 1, b: 0, c: 1, text: "a + c" },
    yBlock: { a: 2, b: 1, c: 0, text: "2a + b" },
    equations: [
      { x: 1, y: 2, value: 28 },
      { x: 3, y: 1, value: 49 },
    ],
    solution: "设 X = a + c，Y = 2a + b。原条件变成 X + 2Y = 28，3X + Y = 49。解得 X = 14，Y = 7，所以 Y / X = 1 / 2。",
  },
  {
    id: "practice-7",
    mode: "guided",
    title: "练习 7：最后一道带提示",
    given: ["13a + 4b + c = 42", "5a + b + 2c = 42"],
    targetFraction: { top: "a + c", bottom: "3a + b" },
    xBlock: { a: 3, b: 1, c: 0, text: "3a + b" },
    yBlock: { a: 1, b: 0, c: 1, text: "a + c" },
    equations: [
      { x: 4, y: 1, value: 42 },
      { x: 1, y: 2, value: 42 },
    ],
    solution: "设 X = 3a + b，Y = a + c。原条件变成 4X + Y = 42，X + 2Y = 42。解得 X = 6，Y = 18，所以 Y / X = 3。",
  },
  {
    id: "practice-8",
    mode: "solo",
    title: "练习 8：用笔独立算",
    given: ["2a + 10b + 9c = 52", "3a + 2b + 7c = 52"],
    targetFraction: { top: "2b + c", bottom: "a + 2c" },
    solution: "设 X = a + 2c，Y = 2b + c。原条件变成 2X + 5Y = 52，3X + Y = 52。解得 X = 16，Y = 4，所以 Y / X = 1 / 4。",
  },
  {
    id: "practice-9",
    mode: "solo",
    title: "练习 9：用笔独立算",
    given: ["7a + 2b + 3c = 55", "4a + 4b + c = 55"],
    targetFraction: { top: "a + 2b", bottom: "2a + c" },
    solution: "设 X = 2a + c，Y = a + 2b。原条件变成 3X + Y = 55，X + 2Y = 55。解得 X = 11，Y = 22，所以 Y / X = 2。",
  },
  {
    id: "practice-10",
    mode: "solo",
    title: "练习 10：用笔独立算",
    given: ["5a + 3b + 2c = 39", "10a + 4b + c = 42"],
    targetFraction: { top: "3a + b", bottom: "a + b + c" },
    solution: "设 X = a + b + c，Y = 3a + b。原条件变成 2X + Y = 39，X + 3Y = 42。解得 X = 15，Y = 9，所以 Y / X = 3 / 5。",
  },
];

const practiceBuilderStates = {};
const builderEls = [...document.querySelectorAll("[data-builder]")];
const reducedEquations = document.querySelector("#reducedEquations");
const solveButton = document.querySelector("#solveButton");
const solutionSteps = document.querySelector("#solutionSteps");
const practiceList = document.querySelector("#practiceList");

function addTerms(parts) {
  const terms = [];
  if (parts.a) terms.push(parts.a === 1 ? "a" : `${parts.a}a`);
  if (parts.b) terms.push(parts.b === 1 ? "b" : `${parts.b}b`);
  if (parts.c) terms.push(parts.c === 1 ? "c" : `${parts.c}c`);
  return terms.length ? terms.join(" + ") : "0";
}

function expandWithBlocks(state, xBlock, yBlock) {
  return {
    a: state.x * xBlock.a + state.y * yBlock.a,
    b: state.x * xBlock.b + state.y * yBlock.b,
    c: state.x * xBlock.c + state.y * yBlock.c,
  };
}

function sameParts(left, right) {
  return left.a === right.a && left.b === right.b && left.c === right.c;
}

function blockExpression(state) {
  const parts = [];
  if (state.x) parts.push(`${state.x}X`);
  if (state.y) parts.push(`${state.y}Y`);
  return parts.length ? parts.join(" + ") : "0";
}

function equationTarget(practice, equation) {
  return expandWithBlocks(equation, practice.xBlock, practice.yBlock);
}

function renderBuilder(name, root) {
  const builder = builders[name];
  const expanded = expandWithBlocks(builder, blocks.x, blocks.y);
  const isMatch = sameParts(expanded, builder.target);
  builder.solved = isMatch;

  root.querySelector('[data-count="x"]').textContent = builder.x;
  root.querySelector('[data-count="y"]').textContent = builder.y;
  root.querySelector("[data-expanded]").innerHTML = `
    <strong>${blockExpression(builder)}</strong>
    <br>
    = ${builder.x}(${blocks.x.text}) + ${builder.y}(${blocks.y.text})
    <br>
    = <strong>${addTerms(expanded)}</strong>
  `;

  const status = root.querySelector("[data-status]");
  status.classList.remove("success", "warning");
  if (isMatch) {
    status.textContent = `拼对了：${blockExpression(builder)} = ${builder.value}`;
    status.classList.add("success");
  } else if (builder.x === 0 && builder.y === 0) {
    status.textContent = "先试着加几个 X 或 Y。";
  } else {
    status.textContent = `还没拼到目标，现在是 ${addTerms(expanded)}。`;
    status.classList.add("warning");
  }
}

function renderReducedEquations() {
  const firstReady = builders.first.solved;
  const secondReady = builders.second.solved;
  solveButton.disabled = !(firstReady && secondReady);

  if (!firstReady || !secondReady) {
    reducedEquations.textContent = "先把两条线索都拼出来。";
    solutionSteps.innerHTML = "";
    return;
  }

  reducedEquations.innerHTML = `
    <div>第一条线索：2X + 3Y = 90</div>
    <div>第二条线索：3X + Y = 72</div>
    <div>现在题目变成：解这个二元一次方程组，再求 Y / X。</div>
  `;
}

function renderAll() {
  builderEls.forEach((root) => renderBuilder(root.dataset.builder, root));
  renderReducedEquations();
}

function fractionHtml(top, bottom) {
  return `<span class="fraction"><span>${top}</span><span>${bottom}</span></span>`;
}

function renderPracticeCard(practice, index) {
  const isGuided = practice.mode === "guided";
  const givenText = `已知 ${practice.given[0]}，${practice.given[1]}，求`;
  const hint = isGuided
    ? `<p class="practice-hint">设 X = ${practice.xBlock.text}，Y = ${practice.yBlock.text}。</p>`
    : "";

  return `
    <article class="practice-card ${isGuided ? "practice-card-guided" : ""}" data-practice="${practice.id}">
      <div class="practice-main">
        <h2>${practice.title}</h2>
        <p>${givenText}</p>
        <p class="practice-target">${fractionHtml(practice.targetFraction.top, practice.targetFraction.bottom)}</p>
        ${hint}
      </div>
      ${isGuided ? renderPracticeBuilders(practice) : ""}
      <button type="button" data-toggle-answer="${practice.id}">看答案</button>
      <div id="${practice.id}" class="practice-answer" hidden>${practice.solution}</div>
    </article>
  `;
}

function renderPracticeBuilders(practice) {
  const buildersHtml = practice.equations
    .map((equation, index) => {
      const id = `${practice.id}-${index + 1}`;
      practiceBuilderStates[id] = { x: 0, y: 0 };
      const target = equationTarget(practice, equation);
      return `
        <div class="mini-builder" data-practice-builder="${id}">
          <p class="mini-target">目标：${addTerms(target)} = ${equation.value}</p>
          <div class="mini-controls">
            <button type="button" data-action="minus-x">- X</button>
            <span><span data-count="x">0</span>X</span>
            <button type="button" data-action="plus-x">+ X</button>
            <button type="button" data-action="minus-y">- Y</button>
            <span><span data-count="y">0</span>Y</span>
            <button type="button" data-action="plus-y">+ Y</button>
          </div>
          <div class="mini-expanded" data-expanded></div>
          <div class="mini-status" data-status></div>
        </div>
      `;
    })
    .join("");

  return `<div class="practice-builders">${buildersHtml}</div>`;
}

function renderPractices() {
  practiceList.innerHTML = practices.map(renderPracticeCard).join("");
}

function renderPracticeBuilder(root) {
  const id = root.dataset.practiceBuilder;
  const [practiceId, equationNumber] = id.match(/^(practice-\d+)-(\d+)$/).slice(1);
  const practice = practices.find((item) => item.id === practiceId);
  const equation = practice.equations[Number(equationNumber) - 1];
  const state = practiceBuilderStates[id];
  const expanded = expandWithBlocks(state, practice.xBlock, practice.yBlock);
  const target = equationTarget(practice, equation);
  const isMatch = sameParts(expanded, target);

  root.querySelector('[data-count="x"]').textContent = state.x;
  root.querySelector('[data-count="y"]').textContent = state.y;
  root.querySelector("[data-expanded]").innerHTML = `
    ${blockExpression(state)}
    = ${state.x}(${practice.xBlock.text}) + ${state.y}(${practice.yBlock.text})
    = <strong>${addTerms(expanded)}</strong>
  `;

  const status = root.querySelector("[data-status]");
  status.classList.toggle("success", isMatch);
  if (isMatch) {
    status.textContent = `拼对了：${blockExpression(state)} = ${equation.value}`;
  } else if (state.x === 0 && state.y === 0) {
    status.textContent = "先试着加几个 X 或 Y。";
  } else {
    status.textContent = `还没拼到目标，现在是 ${addTerms(expanded)}。`;
  }
}

function renderAllPracticeBuilders() {
  document.querySelectorAll("[data-practice-builder]").forEach(renderPracticeBuilder);
}

builderEls.forEach((root) => {
  root.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const builder = builders[root.dataset.builder];
    if (action === "plus-x") builder.x = Math.min(builder.x + 1, 9);
    if (action === "minus-x") builder.x = Math.max(builder.x - 1, 0);
    if (action === "plus-y") builder.y = Math.min(builder.y + 1, 9);
    if (action === "minus-y") builder.y = Math.max(builder.y - 1, 0);
    renderAll();
  });
});

practiceList.addEventListener("click", (event) => {
  const answerId = event.target.dataset.toggleAnswer;
  if (answerId) {
    const answer = document.querySelector(`#${answerId}`);
    const nextHidden = !answer.hidden;
    answer.hidden = nextHidden;
    event.target.textContent = nextHidden ? "看答案" : "收起答案";
    return;
  }

  const action = event.target.dataset.action;
  const builderRoot = event.target.closest("[data-practice-builder]");
  if (!action || !builderRoot) return;

  const state = practiceBuilderStates[builderRoot.dataset.practiceBuilder];
  if (action === "plus-x") state.x = Math.min(state.x + 1, 9);
  if (action === "minus-x") state.x = Math.max(state.x - 1, 0);
  if (action === "plus-y") state.y = Math.min(state.y + 1, 9);
  if (action === "minus-y") state.y = Math.max(state.y - 1, 0);
  renderPracticeBuilder(builderRoot);
});

solveButton.addEventListener("click", () => {
  solutionSteps.innerHTML = `
    <div class="solution-line">方程组：2X + 3Y = 90，3X + Y = 72</div>
    <div class="solution-line">把第二个方程乘以 3：9X + 3Y = 216</div>
    <div class="solution-line">再减去第一个方程：7X = 126，所以 X = 18</div>
    <div class="solution-line">把 X = 18 代回 3X + Y = 72：54 + Y = 72，所以 Y = 18</div>
    <div class="answer-line">因此 Y / X = 18 / 18 = 1</div>
  `;
});

renderPractices();
renderAll();
renderAllPracticeBuilders();

