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

const CANVAS_FONT =
  '"Noto Sans SC", "Noto Sans", "Microsoft YaHei", "PingFang SC", "DejaVu Sans", Consolas, monospace';

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

function getResultTitle(result, lang = "zh", bilingual = true) {
  if (lang === "zh" && bilingual) return `${result.title}\n${result.cnTitle}`;
  if (lang === "zh") return result.cnTitle;
  return result.title;
}

function getFinalLine(result, lang = "zh") {
  return typeof result.shortLine === "string" ? result.shortLine : (result.shortLine[lang] || result.shortLine.zh);
}

function metricRows(metrics) {
  return [
    ["Mother Narrative", metrics.preserve],
    ["Adèle Residue", metrics.recover],
    ["Seedfire Risk", metrics.release],
    ["Redaction", metrics.erase],
    ["Contradiction", metrics.ambiguous]
  ];
}

function buildReceiptText(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  const finalScores = analysis.finalScores || metrics;
  const declaredLine = analysis.declared ? analysis.declared.label : "NO_EXPLICIT_DECLARATION";
  const behaviorLine = analysis.behavioralTrace
    ? `${METRIC_LABELS[analysis.behavioralTrace.key]} / ${clamp(analysis.behavioralTrace.value)}%`
    : "UNAVAILABLE";

  const finalLine = getFinalLine(result, lang);
  const resultDisplayTitle = getResultTitle(result, lang, true);
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

function wrapCanvasText(ctx, text, maxWidth) {
  const lines = [];
  String(text || "").split("\n").forEach(paragraph => {
    if (!paragraph) {
      lines.push("");
      return;
    }

    let current = "";
    const tokens = paragraph.match(/[\u3400-\u9fff]|[^\s\u3400-\u9fff]+|\s+/gu) || [];

    tokens.forEach(token => {
      if (/^\s+$/.test(token) && !current) return;

      const test = current + token;
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
        return;
      }

      if (current) {
        lines.push(current.trimEnd());
        current = token.trimStart();
      }

      if (ctx.measureText(current).width > maxWidth) {
        let fragment = "";
        Array.from(current).forEach(char => {
          const charTest = fragment + char;
          if (ctx.measureText(charTest).width > maxWidth && fragment) {
            lines.push(fragment.trimEnd());
            fragment = char.trimStart();
          } else {
            fragment = charTest;
          }
        });
        current = fragment;
      }
    });

    if (current) lines.push(current.trimEnd());
  });

  return lines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapCanvasText(ctx, text, maxWidth);
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

function drawMetricBar(ctx, label, value, x, y, width) {
  const safeValue = clamp(value);
  const barWidth = width;
  const fillWidth = Math.round(barWidth * safeValue / 100);
  const barY = y + 44;

  ctx.fillStyle = "#B8BCC6";
  ctx.font = `26px ${CANVAS_FONT}`;
  ctx.fillText(label.toUpperCase(), x, y);
  ctx.textAlign = "right";
  ctx.fillText(`${safeValue}%`, x + width, y);
  ctx.textAlign = "left";

  ctx.fillStyle = "#11151B";
  ctx.fillRect(x, barY, barWidth, 14);
  ctx.fillStyle = "#AABBD0";
  ctx.fillRect(x, barY, fillWidth, 14);
  ctx.strokeStyle = "#2B3038";
  ctx.strokeRect(x, barY, barWidth, 14);

  return y + 86;
}

function drawFooter(ctx, y, lang = "zh") {
  ctx.fillStyle = "#747B86";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("The Adèle Archive", 72, y);
  ctx.fillText("EDEN Maintenance Logs", 72, y + 34);
  ctx.fillText("© 2026 Samantha Zhu", 72, y + 68);
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function createArchiveCanvas(width, height) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = "#050607";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#2B3038";
  ctx.lineWidth = 2;
  ctx.strokeRect(44, 44, width - 88, height - 88);
  ctx.strokeStyle = "#1A1E25";
  ctx.strokeRect(58, 58, width - 116, height - 116);
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  return { canvas, ctx };
}

function downloadSimpleCard(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  const finalScores = analysis.finalScores || metrics;
  const { canvas, ctx } = createArchiveCanvas(1080, 1350);
  let y = 104;

  ctx.fillStyle = "#AABBD0";
  ctx.font = `32px ${CANVAS_FONT}`;
  ctx.fillText("EDEN FINAL RECORD", 72, y);
  y += 128;

  ctx.fillStyle = "#F2F2F2";
  ctx.font = `58px ${CANVAS_FONT}`;
  y = drawWrappedText(ctx, result.title, 72, y, 936, 72);

  if (lang === "zh") {
    ctx.fillStyle = "#B8BCC6";
    ctx.font = `42px ${CANVAS_FONT}`;
    y = drawWrappedText(ctx, result.cnTitle, 72, y + 18, 936, 56);
  }

  ctx.fillStyle = "#C8B27A";
  ctx.font = `34px ${CANVAS_FONT}`;
  y = drawWrappedText(ctx, getFinalLine(result, lang), 72, y + 56, 936, 48);
  y += 70;

  metricRows(finalScores).forEach(([label, value]) => {
    y = drawMetricBar(ctx, label, value, 72, y, 720) + 14;
  });

  drawFooter(ctx, 1154, lang);
  downloadCanvas(canvas, `eden-simple-card-${safeFileSlug(result.title)}.png`);
}

function downloadArchiveCard(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  const finalScores = analysis.finalScores || metrics;
  const declaredLine = analysis.declared ? analysis.declared.label : "NO_EXPLICIT_DECLARATION";
  const behaviorLine = analysis.behavioralTrace
    ? `${METRIC_LABELS[analysis.behavioralTrace.key]} / ${clamp(analysis.behavioralTrace.value)}%`
    : "UNAVAILABLE";
  const { canvas, ctx } = createArchiveCanvas(1080, 1920);
  let y = 92;

  ctx.fillStyle = "#AABBD0";
  ctx.font = `32px ${CANVAS_FONT}`;
  ctx.fillText("FINAL MAINTENANCE RECEIPT", 72, y);
  y += 46;
  ctx.fillStyle = "#747B86";
  ctx.font = `25px ${CANVAS_FONT}`;
  ctx.fillText("CASE FILE: ADEL-SPET / RESTRICTED", 72, y);
  y += 94;

  ctx.fillStyle = "#7F94B3";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("OUTPUT:", 72, y);
  y += 40;
  ctx.fillStyle = "#F2F2F2";
  ctx.font = `48px ${CANVAS_FONT}`;
  y = drawWrappedText(ctx, getResultTitle(result, lang, true), 72, y, 936, 60) + 42;

  ctx.fillStyle = "#7F94B3";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("DECLARED COMMAND:", 72, y);
  y += 38;
  ctx.fillStyle = "#B8BCC6";
  ctx.font = `30px ${CANVAS_FONT}`;
  y = drawWrappedText(ctx, declaredLine, 72, y, 936, 42) + 42;

  ctx.fillStyle = "#7F94B3";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("BEHAVIORAL TRACE:", 72, y);
  y += 38;
  ctx.fillStyle = "#C8B27A";
  ctx.font = `30px ${CANVAS_FONT}`;
  y = drawWrappedText(ctx, behaviorLine, 72, y, 936, 42) + 42;

  ctx.fillStyle = "#7F94B3";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("TRACE ANALYSIS:", 72, y);
  y += 38;
  ctx.fillStyle = "#B8BCC6";
  ctx.font = `27px ${CANVAS_FONT}`;
  y = drawWrappedText(ctx, (analysis.conflictLines || []).join("\n"), 72, y, 936, 38) + 46;

  ctx.fillStyle = "#7F94B3";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("SYSTEM INDICES:", 72, y);
  y += 52;
  metricRows(finalScores).forEach(([label, value]) => {
    y = drawMetricBar(ctx, label, value, 72, y, 720) + 8;
  });

  y += 24;
  ctx.fillStyle = "#7F94B3";
  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.fillText("FINAL LINE:", 72, y);
  y += 40;
  ctx.fillStyle = "#F2F2F2";
  ctx.font = `30px ${CANVAS_FONT}`;
  drawWrappedText(ctx, getFinalLine(result, lang), 72, y, 936, 42);

  drawFooter(ctx, 1728, lang);
  downloadCanvas(canvas, `eden-archive-card-${safeFileSlug(result.title)}.png`);
}

function downloadFullReceipt(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  const text = buildReceiptText(analysis, metrics, lang);
  const width = 1080;
  const padding = 72;
  const lineHeight = 34;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  measureCtx.font = `24px ${CANVAS_FONT}`;
  const wrappedLines = text.split("\n").flatMap(line => wrapCanvasText(measureCtx, line, width - padding * 2));
  const height = Math.max(1350, padding * 2 + wrappedLines.length * lineHeight + 36);
  const { canvas, ctx } = createArchiveCanvas(width, height);

  ctx.font = `24px ${CANVAS_FONT}`;
  ctx.textBaseline = "top";
  wrappedLines.forEach((line, index) => {
    if (line === "EDEN CENTRAL ARCHIVE SYSTEM" || line === result.title || line === "FINAL COMMAND CONFLICT DETECTED.") {
      ctx.fillStyle = "#AABBD0";
    } else if (line === result.cnTitle || line === getFinalLine(result, lang) || line.includes("未能完全覆盖")) {
      ctx.fillStyle = "#F2F2F2";
    } else {
      ctx.fillStyle = "#B8BCC6";
    }
    ctx.fillText(line, padding, padding + index * lineHeight);
  });

  downloadCanvas(canvas, `eden-full-receipt-${safeFileSlug(result.title)}.png`);
}

function buildShareText(analysis, metrics, lang = "zh") {
  const result = analysis.result || analysis;
  if (lang === "en") {
    return `I completed an EDEN maintenance session.

Final record:
“${result.title}”

EDEN did not only read my final command.
It also read how I maintained the archive.

The Adèle Archive: EDEN Maintenance Logs`;
  }

  return `我完成了一次 EDEN 维护会话。

最终记录：
「${result.cnTitle}」

EDEN 不只读取我的最后一句话。
它也读取我一路如何维护这份档案。

The Adèle Archive: EDEN Maintenance Logs`;
}

async function copyShareText(analysis, metrics, lang = "zh") {
  const text = buildShareText(analysis, metrics, lang);

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Fall through to the legacy copy path.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch (error) {
    return false;
  }
}

function safeFileSlug(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "eden-record";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
