const state = {
  lang: "zh",
  currentTaskIndex: 0,
  completed: [],
  selectedCommands: [],
  metrics: { ...EDEN_DATA.initialMetrics },
  finalResult: null,
  finalAnalysis: null
};

const screens = {
  language: document.getElementById("languageScreen"),
  boot: document.getElementById("bootScreen"),
  main: document.getElementById("mainScreen"),
  final: document.getElementById("finalScreen"),
  result: document.getElementById("resultScreen")
};

function t() {
  return EDEN_TEXT[state.lang] || EDEN_TEXT.zh;
}

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function selectLanguage(lang) {
  state.lang = lang === "en" ? "en" : "zh";
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
  applyLanguageChrome();
  showScreen("boot");
  bootSequence();
}

function toggleLanguage() {
  state.lang = state.lang === "zh" ? "en" : "zh";
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
  applyLanguageChrome();
  if (screens.main.classList.contains("active")) renderAll();
  if (screens.final.classList.contains("active")) showFinalProtocol();
  if (screens.result.classList.contains("active") && state.finalAnalysis) {
    renderReceipt(state.finalAnalysis, state.metrics, state.lang);
  }
}

function applyLanguageChrome() {
  const text = t();
  const systemSubtitle = document.getElementById("systemSubtitle");
  const commandHint = document.getElementById("commandHint");
  const enterBtn = document.getElementById("enterBtn");
  const langSwitchBtn = document.getElementById("langSwitchBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const restartBtn = document.getElementById("restartBtn");

  if (systemSubtitle) systemSubtitle.textContent = text.dashboardSubtitle;
  if (commandHint) commandHint.textContent = text.commandHint;
  if (enterBtn) enterBtn.textContent = `[ ${text.enter} ]`;
  if (langSwitchBtn) langSwitchBtn.textContent = `[ ${text.switchLang} ]`;
  if (downloadBtn) downloadBtn.textContent = `[ ${text.download} ]`;
  if (restartBtn) restartBtn.textContent = `[ ${text.restart} ]`;
}

function bootSequence() {
  const bootText = document.getElementById("bootText");
  const warning = document.getElementById("bootWarning");
  const enterBtn = document.getElementById("enterBtn");
  const text = t();
  let index = 0;

  bootText.textContent = "";
  warning.classList.add("hidden");
  enterBtn.classList.add("hidden");
  warning.innerHTML = text.bootWarning.map(line => `<p>${escapeHtml(line)}</p>`).join("");

  const timer = setInterval(() => {
    bootText.textContent += text.bootLines[index] + "\n";
    index += 1;
    if (index >= text.bootLines.length) {
      clearInterval(timer);
      setTimeout(() => {
        warning.classList.remove("hidden");
        enterBtn.classList.remove("hidden");
      }, 350);
    }
  }, 260);
}

function startMaintenance() {
  showScreen("main");
  renderAll();
}

function renderAll() {
  renderTaskList();
  renderCurrentTask();
  renderMetrics("metrics", state.metrics);
  applyLanguageChrome();
}

function renderTaskList() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = EDEN_DATA.tasks.map((task, index) => {
    const completed = state.completed.find(item => item.id === task.id);
    const isActive = index === state.currentTaskIndex;
    let cls = "task-item";
    let status = "LOCKED";

    if (completed) {
      cls += completed.command.includes("DELETE") || completed.command.includes("REDACT") ? " erased" : " repaired";
      status = completed.command.includes("DELETE") || completed.command.includes("REDACT") ? "ERASED" : "REPAIRED";
    } else if (isActive) {
      cls += " active";
      status = "ACTIVE";
    } else if (index < state.currentTaskIndex) {
      status = "REPAIRED";
    }

    return `
      <div class="${cls}">
        <span class="task-cursor">${isActive ? ">" : " "}</span>
        <span>[${task.index}] ${task.shortName}</span>
        <span class="task-status">${status}</span>
      </div>
    `;
  }).join("");
}

function getTaskText(task) {
  return task.text[state.lang] || task.text.zh;
}

function renderCurrentTask() {
  const task = EDEN_DATA.tasks[state.currentTaskIndex];
  if (!task) {
    showFinalProtocol();
    return;
  }

  const taskText = getTaskText(task);
  const labels = t().blockLabels;

  document.getElementById("fileHeader").innerHTML = `
    <div class="file-header-grid">
      <div>FILE ID: ${task.fileId}</div>
      <div>CATEGORY: ${task.category}</div>
      <div>TYPE: ${task.type}</div>
      <div>STATUS: ${task.status}</div>
      <div>INTEGRITY: ${task.integrity}</div>
      <div>LAST MODIFIED: ${task.modified}</div>
      <div>LANGUAGE PROFILE: ${t().langName}</div>
    </div>
  `;

  document.getElementById("logContent").innerHTML = `
    <section class="log-block">
      <div class="block-label">${labels.eden}</div>
      <div class="eden-revision">${escapeHtml(taskText.eden)}</div>
    </section>
    <section class="log-block">
      <div class="block-label">${labels.raw}</div>
      <div class="raw-residue">${escapeHtml(taskText.raw)}</div>
    </section>
    <section class="log-block">
      <div class="block-label">${labels.note}</div>
      <div class="operator-note">${escapeHtml(taskText.note)}</div>
    </section>
  `;

  const commandButtons = document.getElementById("commandButtons");
  commandButtons.innerHTML = task.options.map((option, index) => {
    const mode = option.label.includes("DELETE") || option.label.includes("REDACT") || option.label.includes("CONTAIN") ? "danger" : option.label.includes("RESTORE") || option.label.includes("RELEASE") ? "success" : option.label.includes("KEEP") || option.label.includes("UNKNOWN") ? "warning" : "";
    return `<button class="command-btn ${mode}" type="button" data-option-index="${index}">[ ${option.label} ]</button>`;
  }).join("");
}

function applyOption(optionIndex) {
  const task = EDEN_DATA.tasks[state.currentTaskIndex];
  const option = task.options[optionIndex];

  Object.entries(option.effect).forEach(([key, delta]) => {
    state.metrics[key] = clamp((state.metrics[key] || 0) + delta);
  });

  state.completed.push({ id: task.id, command: option.label });
  state.selectedCommands.push({ taskId: task.id, command: option.label });
  const message = typeof option.message === "string" ? option.message : (option.message[state.lang] || option.message.en || option.message.zh);
  document.getElementById("systemMessage").innerHTML = `<p>> ${escapeHtml(message)}</p><p>> ${escapeHtml(t().proceeding)}</p>`;

  state.currentTaskIndex += 1;
  if (state.currentTaskIndex >= EDEN_DATA.tasks.length) {
    setTimeout(showFinalProtocol, 450);
  } else {
    renderAll();
  }
}

function renderMetrics(containerId, metrics) {
  const container = document.getElementById(containerId);
  const rows = [
    ["MOTHER NARRATIVE", metrics.preserve, "blue"],
    ["ADÈLE RESIDUE", metrics.recover, "green"],
    ["SEEDFIRE RISK", metrics.release, "amber"],
    ["REDACTION", metrics.erase, "red"],
    ["CONTRADICTION", metrics.ambiguous, "blue"]
  ];

  container.innerHTML = rows.map(([label, value, color]) => {
    const safeValue = clamp(value);
    const filled = Math.round(safeValue / 10);
    const bar = "█".repeat(filled) + "░".repeat(10 - filled);
    return `
      <div class="metric">
        <div class="metric-line"><span>${label}</span><span>${safeValue}%</span></div>
        <div class="metric-bar"><span class="metric-fill ${color}">${bar.slice(0, filled)}</span>${bar.slice(filled)}</div>
      </div>
    `;
  }).join("");
}

function showFinalProtocol() {
  showScreen("final");
  applyLanguageChrome();
  document.getElementById("finalTitle").textContent = t().finalTitle;
  document.getElementById("finalIntro").innerHTML = t().finalText.map(line => `<p>${escapeHtml(line)}</p>`).join("");
  renderMetrics("finalMetrics", state.metrics);
  const finalOptions = document.getElementById("finalOptions");
  finalOptions.innerHTML = EDEN_DATA.finalOptions.map(option => `
    <button class="command-btn" type="button" data-final-id="${option.id}">
      [ ${option.label} ]<br />
      <span>${state.lang === "zh" ? option.cnTitle : option.title}</span>
    </button>
  `).join("");
}

function completeFinalProtocol(finalId) {
  state.finalAnalysis = resolveFinalResult(state.metrics, finalId, state.lang);
  state.finalResult = state.finalAnalysis.result;
  renderReceipt(state.finalAnalysis, state.metrics, state.lang);
  showScreen("result");
  applyLanguageChrome();
}

function restart() {
  state.currentTaskIndex = 0;
  state.completed = [];
  state.selectedCommands = [];
  state.metrics = { ...EDEN_DATA.initialMetrics };
  state.finalResult = null;
  state.finalAnalysis = null;
  document.getElementById("systemMessage").innerHTML = `<p>> ${escapeHtml(t().awaiting)}</p>`;
  showScreen("main");
  renderAll();
}

document.addEventListener("click", event => {
  const langBtn = event.target.closest("[data-lang]");
  if (langBtn) {
    selectLanguage(langBtn.dataset.lang);
    return;
  }

  const optionBtn = event.target.closest("[data-option-index]");
  if (optionBtn) {
    applyOption(Number(optionBtn.dataset.optionIndex));
    return;
  }

  const finalBtn = event.target.closest("[data-final-id]");
  if (finalBtn) {
    completeFinalProtocol(finalBtn.dataset.finalId);
    return;
  }
});

document.getElementById("enterBtn").addEventListener("click", startMaintenance);
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (state.finalAnalysis) downloadReceiptImage(state.finalAnalysis, state.metrics, state.lang);
});
document.getElementById("restartBtn").addEventListener("click", restart);
document.getElementById("langSwitchBtn").addEventListener("click", toggleLanguage);

applyLanguageChrome();
