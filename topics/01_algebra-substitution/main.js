const blocks = {
  x: { a: 1, b: 2, c: 0, label: "X", text: "a + 2b" },
  y: { a: 0, b: 3, c: 1, label: "Y", text: "3b + c" },
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

const practiceBuilders = {
  "practice-1-a": {
    x: 0,
    y: 0,
    xBlock: { a: 1, b: 2, c: 0, text: "a + 2b" },
    yBlock: { a: 0, b: 3, c: 1, text: "3b + c" },
    target: { a: 4, b: 17, c: 3 },
    expected: { x: 4, y: 3 },
    value: 72,
  },
  "practice-1-b": {
    x: 0,
    y: 0,
    xBlock: { a: 1, b: 2, c: 0, text: "a + 2b" },
    yBlock: { a: 0, b: 3, c: 1, text: "3b + c" },
    target: { a: 1, b: 8, c: 2 },
    expected: { x: 1, y: 2 },
    value: 28,
  },
  "practice-2-a": {
    x: 0,
    y: 0,
    xBlock: { a: 2, b: 1, c: 0, text: "2a + b" },
    yBlock: { a: 0, b: 1, c: 1, text: "b + c" },
    target: { a: 6, b: 5, c: 2 },
    expected: { x: 3, y: 2 },
    value: 60,
  },
  "practice-2-b": {
    x: 0,
    y: 0,
    xBlock: { a: 2, b: 1, c: 0, text: "2a + b" },
    yBlock: { a: 0, b: 1, c: 1, text: "b + c" },
    target: { a: 4, b: 6, c: 4 },
    expected: { x: 2, y: 4 },
    value: 80,
  },
};

const builderEls = [...document.querySelectorAll("[data-builder]")];
const practiceBuilderEls = [...document.querySelectorAll("[data-practice-builder]")];
const reducedEquations = document.querySelector("#reducedEquations");
const solveButton = document.querySelector("#solveButton");
const solutionSteps = document.querySelector("#solutionSteps");

function addTerms(parts) {
  const terms = [];
  if (parts.a) terms.push(parts.a === 1 ? "a" : `${parts.a}a`);
  if (parts.b) terms.push(parts.b === 1 ? "b" : `${parts.b}b`);
  if (parts.c) terms.push(parts.c === 1 ? "c" : `${parts.c}c`);
  return terms.length ? terms.join(" + ") : "0";
}

function expand(builder) {
  return {
    a: builder.x * blocks.x.a + builder.y * blocks.y.a,
    b: builder.x * blocks.x.b + builder.y * blocks.y.b,
    c: builder.x * blocks.x.c + builder.y * blocks.y.c,
  };
}

function sameParts(left, right) {
  return left.a === right.a && left.b === right.b && left.c === right.c;
}

function blockExpression(builder) {
  const parts = [];
  if (builder.x) parts.push(`${builder.x}X`);
  if (builder.y) parts.push(`${builder.y}Y`);
  return parts.length ? parts.join(" + ") : "0";
}

function renderBuilder(name, root) {
  const builder = builders[name];
  const expanded = expand(builder);
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

function expandPractice(builder) {
  return {
    a: builder.x * builder.xBlock.a + builder.y * builder.yBlock.a,
    b: builder.x * builder.xBlock.b + builder.y * builder.yBlock.b,
    c: builder.x * builder.xBlock.c + builder.y * builder.yBlock.c,
  };
}

function renderPracticeBuilder(id, root) {
  const builder = practiceBuilders[id];
  const expanded = expandPractice(builder);
  const isMatch = sameParts(expanded, builder.target);

  root.querySelector('[data-count="x"]').textContent = builder.x;
  root.querySelector('[data-count="y"]').textContent = builder.y;
  root.querySelector("[data-expanded]").innerHTML = `
    ${blockExpression(builder)}
    = ${builder.x}(${builder.xBlock.text}) + ${builder.y}(${builder.yBlock.text})
    = <strong>${addTerms(expanded)}</strong>
  `;

  const status = root.querySelector("[data-status]");
  status.classList.toggle("success", isMatch);
  if (isMatch) {
    status.textContent = `拼对了：${blockExpression(builder)} = ${builder.value}`;
  } else if (builder.x === 0 && builder.y === 0) {
    status.textContent = "先试着加几个 X 或 Y。";
  } else {
    status.textContent = `还没拼到目标，现在是 ${addTerms(expanded)}。`;
  }
}

function renderAllPracticeBuilders() {
  practiceBuilderEls.forEach((root) => {
    renderPracticeBuilder(root.dataset.practiceBuilder, root);
  });
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

practiceBuilderEls.forEach((root) => {
  root.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const builder = practiceBuilders[root.dataset.practiceBuilder];
    if (action === "plus-x") builder.x = Math.min(builder.x + 1, 9);
    if (action === "minus-x") builder.x = Math.max(builder.x - 1, 0);
    if (action === "plus-y") builder.y = Math.min(builder.y + 1, 9);
    if (action === "minus-y") builder.y = Math.max(builder.y - 1, 0);
    renderAllPracticeBuilders();
  });
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

document.querySelectorAll("[data-toggle-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = document.querySelector(`#${button.dataset.toggleAnswer}`);
    const nextHidden = !answer.hidden;
    answer.hidden = nextHidden;
    button.textContent = nextHidden ? "看答案" : "收起答案";
  });
});

renderAll();
renderAllPracticeBuilders();
