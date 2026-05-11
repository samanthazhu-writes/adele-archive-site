function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

const FINAL_BOOSTS = {
  preserve: { preserve: 18 },
  recover: { recover: 18 },
  release: { release: 18 },
  erase: { erase: 18 },
  ambiguous: { ambiguous: 18 }
};

const METRIC_LABELS = {
  preserve: "MOTHER NARRATIVE",
  recover: "ADÈLE RESIDUE",
  release: "SEEDFIRE RISK",
  erase: "REDACTION",
  ambiguous: "CONTRADICTION"
};

function getDominantMetric(scores) {
  const entries = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    const tieOrder = ["ambiguous", "recover", "release", "erase", "preserve"];
    return tieOrder.indexOf(a[0]) - tieOrder.indexOf(b[0]);
  });

  const top = entries[0];
  const second = entries[1] || [null, 0];
  return {
    key: top[0],
    value: top[1],
    margin: top[1] - second[1]
  };
}

function applyFinalBoost(metrics, explicitChoiceId) {
  const scores = { ...metrics };
  const boost = FINAL_BOOSTS[explicitChoiceId];

  if (boost) {
    Object.entries(boost).forEach(([key, delta]) => {
      scores[key] = clamp((scores[key] || 0) + delta);
    });
  }

  return scores;
}

function resolveFinalResult(metrics, explicitChoiceId, lang = "zh") {
  const behavioralTrace = getDominantMetric(metrics);
  const finalScores = applyFinalBoost(metrics, explicitChoiceId);
  const finalTrace = getDominantMetric(finalScores);
  const result = EDEN_DATA.finalOptions.find(option => option.id === finalTrace.key) || EDEN_DATA.finalOptions[4];
  const declared = EDEN_DATA.finalOptions.find(option => option.id === explicitChoiceId) || null;

  const conflict = Boolean(
    declared &&
    behavioralTrace.key !== explicitChoiceId &&
    (behavioralTrace.margin >= 8 || finalTrace.key !== explicitChoiceId)
  );

  return {
    result,
    declared,
    behavioralTrace,
    finalTrace,
    finalScores,
    conflict,
    conflictLines: buildConflictLines(conflict, behavioralTrace, declared, finalTrace, lang)
  };
}

function buildConflictLines(conflict, behavioralTrace, declared, finalTrace, lang = "zh") {
  if (!declared) {
    return lang === "en"
      ? [
          "NO FINAL DECLARATION RECORDED.",
          "EDEN resolved the output from maintenance behavior alone."
        ]
      : [
          "NO FINAL DECLARATION RECORDED.",
          "系统没有收到最终声明，因此只读取前七次维护痕迹。"
        ];
  }

  if (!conflict) {
    return lang === "en"
      ? [
          "FINAL DECLARATION ACCEPTED AS CONSISTENT.",
          "The last command reinforced the operator's previous maintenance pattern."
        ]
      : [
          "FINAL DECLARATION ACCEPTED AS CONSISTENT.",
          "最终指令没有洗掉前面的痕迹，只是把它们推向同一个方向。"
        ];
  }

  return lang === "en"
    ? [
        "FINAL COMMAND CONFLICT DETECTED.",
        `Behavioral trace favored ${METRIC_LABELS[behavioralTrace.key]}; final declaration requested ${declared.label}.`,
        "EDEN has retained the behavioral trace as primary evidence.",
        `Resolved output follows ${METRIC_LABELS[finalTrace.key]}.`
      ]
    : [
        "FINAL COMMAND CONFLICT DETECTED.",
        `行为痕迹偏向 ${METRIC_LABELS[behavioralTrace.key]}；最终声明请求 ${declared.label}。`,
        "操作者最后说出的选择，未能完全覆盖此前七次维护行为。",
        "EDEN 没有只相信你的最后一句话。系统也读取了你一路保存、恢复、释放、删除或搁置的方式。",
        `最终输出遵循 ${METRIC_LABELS[finalTrace.key]}。`
      ];
}

function buildReceiptText(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  const finalScores = analysis.finalScores || metrics;
  const declaredLine = analysis.declared ? analysis.declared.label : "NO_EXPLICIT_DECLARATION";
  const behaviorLine = analysis.behavioralTrace
    ? `${METRIC_LABELS[analysis.behavioralTrace.key]} / ${clamp(analysis.behavioralTrace.value)}%`
    : "UNAVAILABLE";

  const finalLine = typeof result.shortLine === "string" ? result.shortLine : (result.shortLine[lang] || result.shortLine.zh);
  const resultDisplayTitle = lang === "zh" ? `${result.title}
${result.cnTitle}` : result.title;
  const receiptHeader = lang === "zh" ? "FINAL RECORD EXPORT" : "FINAL MAINTENANCE RECEIPT";
  const finalLineLabel = lang === "zh" ? "FINAL LINE:" : "FINAL LINE / OPERATOR CONSEQUENCE:";

  return `EDEN CENTRAL ARCHIVE SYSTEM
${receiptHeader}

ARCHIVE: ADEL-SPET / MOTHER-GODDESS / RESTRICTED
OPERATOR: TEMP-MAINT-07
SESSION: 7F-03-ADEL

OUTPUT:
${resultDisplayTitle}

STATUS:
${result.status.join("\n")}

OPERATOR DECLARATION:
${declaredLine}

BEHAVIORAL TRACE:
${behaviorLine}

TRACE ANALYSIS:
${(analysis.conflictLines || []).join("\n")}

SYSTEM INDICES BEFORE FINAL PROTOCOL:
MOTHER NARRATIVE STABILITY: ${clamp(metrics.preserve)}%
ADÈLE RESIDUE LEVEL: ${clamp(metrics.recover)}%
SEEDFIRE CONTAMINATION RISK: ${clamp(metrics.release)}%
REDACTION COMPLETION: ${clamp(metrics.erase)}%
CONTRADICTION INDEX: ${clamp(metrics.ambiguous)}%

SYSTEM INDICES AFTER FINAL PROTOCOL:
MOTHER NARRATIVE STABILITY: ${clamp(finalScores.preserve)}%
ADÈLE RESIDUE LEVEL: ${clamp(finalScores.recover)}%
SEEDFIRE CONTAMINATION RISK: ${clamp(finalScores.release)}%
REDACTION COMPLETION: ${clamp(finalScores.erase)}%
CONTRADICTION INDEX: ${clamp(finalScores.ambiguous)}%

${finalLineLabel}
${finalLine}

EXPORT COMPLETE.
© 2026 Samantha Zhu. All rights reserved.`;
}

function renderReceipt(analysis, metrics, lang = "zh") {
  const receipt = document.getElementById("receipt");
  receipt.innerHTML = `<pre>${escapeHtml(buildReceiptText(analysis, metrics, lang))}</pre>`;
}

function downloadReceiptImage(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  const text = buildReceiptText(analysis, metrics, lang);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = 2;
  const width = 960;
  const padding = 48;
  const lineHeight = 25;
  const lines = text.split("\n");
  const height = padding * 2 + lines.length * lineHeight;

  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#050607";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#2B3038";
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  ctx.font = "14px Consolas, monospace";
  ctx.textBaseline = "top";

  lines.forEach((line, index) => {
    if (index === 0 || line === result.title || line === "FINAL COMMAND CONFLICT DETECTED.") {
      ctx.fillStyle = "#AABBD0";
    } else if (line === result.cnTitle || line === (typeof result.shortLine === "string" ? result.shortLine : (result.shortLine[lang] || result.shortLine.zh)) || line.includes("未能完全覆盖")) {
      ctx.fillStyle = "#F2F2F2";
    } else {
      ctx.fillStyle = "#B8BCC6";
    }
    ctx.fillText(line, padding, padding + index * lineHeight);
  });

  const link = document.createElement("a");
  const fileSafeTitle = result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  link.download = `eden-final-record-${fileSafeTitle}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
