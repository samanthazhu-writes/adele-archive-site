const prefersReducedMotion = Boolean(
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
);

const state = {
  lang: readSavedLang() || "zh",
  currentTaskIndex: 0,
  completed: [],
  selectedCommands: [],
  metrics: { ...EDEN_DATA.initialMetrics },
  finalResult: null,
  finalAnalysis: null,
  metricsExpanded: false,
  contentNoticeExpanded: Boolean(window.matchMedia && window.matchMedia("(min-width: 769px)").matches),
  bootTimer: null
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

function readSavedLang() {
  try {
    const savedLang = localStorage.getItem("eden-lang");
    return savedLang === "zh" || savedLang === "en" ? savedLang : null;
  } catch (error) {
    return null;
  }
}

function saveLangPreference() {
  try {
    localStorage.setItem("eden-lang", state.lang);
  } catch (error) {
    // Local storage is optional; the archive remains usable without it.
  }
}

function syncDocumentLang() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
}

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function selectLanguage(lang) {
  state.lang = lang === "en" ? "en" : "zh";
  saveLangPreference();
  syncDocumentLang();
  applyLanguageChrome();
  showScreen("boot");
  bootSequence();
}

function toggleLanguage() {
  state.lang = state.lang === "zh" ? "en" : "zh";
  saveLangPreference();
  syncDocumentLang();
  applyLanguageChrome();

  if (screens.main.classList.contains("active")) renderAll();
  if (screens.final.classList.contains("active")) showFinalProtocol();
  if (screens.result.classList.contains("active") && state.finalAnalysis) {
    renderResultScreen();
  }
}

function applyLanguageChrome() {
  const text = t();
  const systemSubtitle = document.getElementById("systemSubtitle");
  const commandHint = document.getElementById("commandHint");
  const enterBtn = document.getElementById("enterBtn");
  const langSwitchBtn = document.getElementById("langSwitchBtn");
  const downloadSimpleBtn = document.getElementById("downloadSimpleBtn");
  const downloadArchiveBtn = document.getElementById("downloadArchiveBtn");
  const downloadFullBtn = document.getElementById("downloadFullBtn");
  const copyShareTextBtn = document.getElementById("copyShareTextBtn");
  const restartBtn = document.getElementById("restartBtn");
  const metricsToggleBtn = document.getElementById("metricsToggleBtn");
  const contentNoteToggleBtn = document.getElementById("contentNoteToggleBtn");
  const processedTraceTitle = document.getElementById("processedTraceTitle");
  const resultRestartHint = document.getElementById("resultRestartHint");
  const dossierIntro = document.getElementById("dossierIntro");
  const dossierLink = document.getElementById("dossierLink");

  if (systemSubtitle) systemSubtitle.textContent = text.dashboardSubtitle;
  if (commandHint) commandHint.textContent = text.commandHint;
  if (enterBtn) enterBtn.textContent = `[ ${text.enter} ]`;
  if (langSwitchBtn) langSwitchBtn.textContent = `[ ${text.switchLang} ]`;
  if (downloadSimpleBtn) downloadSimpleBtn.textContent = `[ ${text.downloadSimple} ]`;
  if (downloadArchiveBtn) downloadArchiveBtn.textContent = `[ ${text.downloadArchive} ]`;
  if (downloadFullBtn) downloadFullBtn.textContent = `[ ${text.downloadFull} ]`;
  if (copyShareTextBtn) copyShareTextBtn.textContent = `[ ${text.copyShareText} ]`;
  if (restartBtn) restartBtn.textContent = `[ ${text.restart} ]`;
  if (resultRestartHint) resultRestartHint.textContent = text.restartHint;
  if (dossierIntro) dossierIntro.textContent = text.dossierIntro;
  if (dossierLink) dossierLink.textContent = `[ ${text.dossierComingSoon} ]`;

  if (metricsToggleBtn) {
    metricsToggleBtn.textContent = `[ ${state.metricsExpanded ? text.hideSystemIndices : text.viewSystemIndices} ]`;
    metricsToggleBtn.setAttribute("aria-expanded", String(state.metricsExpanded));
  }

  if (contentNoteToggleBtn) {
    contentNoteToggleBtn.textContent = `[ ${state.contentNoticeExpanded ? text.hideContentNote : text.viewContentNote} ]`;
    contentNoteToggleBtn.setAttribute("aria-expanded", String(state.contentNoticeExpanded));
  }

  if (processedTraceTitle) {
    processedTraceTitle.textContent = `[ ${text.viewMaintenanceTrace} ]`;
  }

  document.querySelectorAll(".language-btn").forEach(button => {
    const active = button.dataset.lang === state.lang;
    button.classList.toggle("is-preferred", active);
    button.setAttribute("aria-pressed", String(active));
  });

  applyMetricsVisibility();
  applyContentNoticeVisibility();
}

function bootSequence() {
  const bootText = document.getElementById("bootText");
  const warning = document.getElementById("bootWarning");
  const enterBtn = document.getElementById("enterBtn");
  const text = t();
  let index = 0;

  if (state.bootTimer) window.clearInterval(state.bootTimer);

  bootText.textContent = "";
  warning.classList.add("hidden");
  enterBtn.classList.add("hidden");
  warning.innerHTML = text.bootWarning.map(line => `<p>${escapeHtml(line)}</p>`).join("");

  if (prefersReducedMotion) {
    bootText.textContent = `${text.bootLines.join("\n")}\n`;
    warning.classList.remove("hidden");
    enterBtn.classList.remove("hidden");
    return;
  }

  state.bootTimer = window.setInterval(() => {
    bootText.textContent += text.bootLines[index] + "\n";
    index += 1;
    if (index >= text.bootLines.length) {
      window.clearInterval(state.bootTimer);
      state.bootTimer = null;
      window.setTimeout(() => {
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
  renderMobileProgress();
  applyLanguageChrome();
}

function getDisplayName(task) {
  return task.displayName ? (task.displayName[state.lang] || task.displayName.en || task.shortName) : task.shortName;
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
        <span>[${task.index}] ${escapeHtml(getDisplayName(task))} / ${escapeHtml(task.shortName)}</span>
        <span class="task-status">${status}</span>
      </div>
    `;
  }).join("");
}

function renderMobileProgress() {
  const mobileProgress = document.getElementById("mobileProgress");
  if (!mobileProgress) return;

  const total = EDEN_DATA.tasks.length;
  const current = Math.min(state.currentTaskIndex + 1, total);
  const chips = EDEN_DATA.tasks.map((task, index) => {
    const cls = [
      "progress-chip",
      index === state.currentTaskIndex ? "active" : "",
      index < state.currentTaskIndex ? "complete" : ""
    ].filter(Boolean).join(" ");

    return `<span class="${cls}">${task.index}</span>`;
  }).join("");

  mobileProgress.innerHTML = `
    <div class="mobile-progress-line">
      <span>RECORD ${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
      <span>${escapeHtml(EDEN_DATA.tasks.map(getDisplayName).join(" · "))}</span>
    </div>
    <div class="progress-chips">${chips}</div>
  `;
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

  document.getElementById("sessionStatus").textContent = `RECORD ${task.index} / 07`;
  document.getElementById("fileHeader").innerHTML = `
    <div class="current-record-name">${task.index} ${escapeHtml(getDisplayName(task))} / ${escapeHtml(task.shortName)}</div>
    <div class="file-header-grid">
      <div>FILE ID: ${escapeHtml(task.fileId)}</div>
      <div>CATEGORY: ${escapeHtml(task.category)}</div>
      <div>TYPE: ${escapeHtml(task.type)}</div>
      <div>STATUS: ${escapeHtml(task.status)}</div>
      <div>INTEGRITY: ${escapeHtml(task.integrity)}</div>
      <div>LAST MODIFIED: ${escapeHtml(task.modified)}</div>
      <div>LANGUAGE PROFILE: ${escapeHtml(t().langName)}</div>
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
    const mode = option.label.includes("DELETE") || option.label.includes("REDACT") || option.label.includes("CONTAIN")
      ? "danger"
      : option.label.includes("RESTORE") || option.label.includes("RELEASE")
        ? "success"
        : option.label.includes("KEEP") || option.label.includes("UNKNOWN")
          ? "warning"
          : "";
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
  state.selectedCommands.push({
    taskId: task.id,
    index: task.index,
    shortName: task.shortName,
    displayName: { ...task.displayName },
    command: option.label
  });

  const message = typeof option.message === "string"
    ? option.message
    : (option.message[state.lang] || option.message.en || option.message.zh);
  document.getElementById("systemMessage").innerHTML = `<p>> ${escapeHtml(message)}</p><p>> ${escapeHtml(t().proceeding)}</p>`;

  state.currentTaskIndex += 1;
  if (state.currentTaskIndex >= EDEN_DATA.tasks.length) {
    renderMobileProgress();
    window.setTimeout(showFinalProtocol, 450);
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

function applyMetricsVisibility() {
  const outputPanel = document.querySelector(".output-panel");
  if (!outputPanel) return;
  outputPanel.classList.toggle("is-collapsed", !state.metricsExpanded);
}

function applyContentNoticeVisibility() {
  const contentNotice = document.querySelector(".content-notice");
  const fullNotice = document.getElementById("contentNoticeFull");
  if (!contentNotice || !fullNotice) return;
  contentNotice.classList.toggle("is-collapsed", !state.contentNoticeExpanded);
  fullNotice.hidden = !state.contentNoticeExpanded;
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
      <span>${state.lang === "zh" ? escapeHtml(option.cnTitle) : escapeHtml(option.title)}</span>
    </button>
  `).join("");
}

function completeFinalProtocol(finalId) {
  state.finalAnalysis = resolveFinalResult(state.metrics, finalId, state.lang);
  state.finalResult = state.finalAnalysis.result;
  renderResultScreen();
  showScreen("result");
  applyLanguageChrome();
}

function renderResultScreen() {
  renderReceipt(state.finalAnalysis, state.metrics, state.lang);
  renderResultExplanation();
  renderProcessedTrace();
}

function renderResultExplanation() {
  const resultExplanation = document.getElementById("resultExplanation");
  const resultRestartHint = document.getElementById("resultRestartHint");
  if (resultExplanation) {
    resultExplanation.innerHTML = t().resultExplanation.map(line => `<p>${escapeHtml(line)}</p>`).join("");
  }
  if (resultRestartHint) {
    resultRestartHint.textContent = t().restartHint;
  }
}

function renderProcessedTrace() {
  const processedTrace = document.getElementById("processedTrace");
  const processedTraceList = document.getElementById("processedTraceList");
  if (!processedTrace || !processedTraceList) return;

  processedTrace.open = Boolean(window.matchMedia && window.matchMedia("(min-width: 769px)").matches);
  processedTraceList.innerHTML = state.selectedCommands.map(item => {
    const displayName = item.displayName ? (item.displayName[state.lang] || item.displayName.en || item.shortName) : item.shortName;
    return `<div class="trace-row"><span>${item.index} ${escapeHtml(displayName)}</span><span>${escapeHtml(item.command)}</span></div>`;
  }).join("");
}

function restart() {
  state.currentTaskIndex = 0;
  state.completed = [];
  state.selectedCommands = [];
  state.metrics = { ...EDEN_DATA.initialMetrics };
  state.finalResult = null;
  state.finalAnalysis = null;
  state.metricsExpanded = false;
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
  }
});

document.getElementById("enterBtn").addEventListener("click", startMaintenance);
document.getElementById("downloadSimpleBtn").addEventListener("click", () => {
  if (state.finalAnalysis) downloadSimpleCard(state.finalAnalysis, state.metrics, state.lang);
});
document.getElementById("downloadArchiveBtn").addEventListener("click", () => {
  if (state.finalAnalysis) downloadArchiveCard(state.finalAnalysis, state.metrics, state.lang);
});
document.getElementById("downloadFullBtn").addEventListener("click", () => {
  if (state.finalAnalysis) downloadFullReceipt(state.finalAnalysis, state.metrics, state.lang);
});
document.getElementById("copyShareTextBtn").addEventListener("click", async () => {
  if (!state.finalAnalysis) return;
  const shareStatus = document.getElementById("shareStatus");
  const copied = await copyShareText(state.finalAnalysis, state.metrics, state.lang);
  shareStatus.textContent = copied ? t().copied : t().copyFailed;
});
document.getElementById("restartBtn").addEventListener("click", restart);
document.getElementById("langSwitchBtn").addEventListener("click", toggleLanguage);
document.getElementById("metricsToggleBtn").addEventListener("click", () => {
  state.metricsExpanded = !state.metricsExpanded;
  applyLanguageChrome();
});
document.getElementById("contentNoteToggleBtn").addEventListener("click", () => {
  state.contentNoticeExpanded = !state.contentNoticeExpanded;
  applyLanguageChrome();
});

syncDocumentLang();
applyLanguageChrome();
