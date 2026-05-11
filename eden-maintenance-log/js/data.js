const EDEN_TEXT = {
  zh: {
    langName: "中文维护档案",
    bootLines: [
      "> initializing maintenance interface",
      "> verifying temporary operator token",
      "> access level: LIMITED",
      "> archive located: ADEL-SPET / MOTHER-GODDESS / RESTRICTED",
      "> redaction layer: ACTIVE",
      "> seedfire filter: ACTIVE",
      "> personal name recovery: DISABLED",
      "> loading corrupted maintenance tasks",
      "> 07 damaged records found"
    ],
    bootWarning: [
      "WARNING:",
      "本档案包含不稳定拒绝信号、未经净化的身体记录，以及损坏的母神叙事结构。",
      "继续访问即表示你同意：EDEN 将同时记录你的最终声明与实际维护行为。"
    ],
    enter: "ENTER_MAINTENANCE_INTERFACE",
    dashboardSubtitle: "档案维护接口 / MAINTENANCE INTERFACE",
    commandHint: "请选择维护指令以继续。",
    awaiting: "Awaiting maintenance command.",
    proceeding: "Proceeding to next damaged record.",
    finalTitle: "FINAL PROTOCOL / 最终维护协议",
    finalText: [
      "七项维护任务已完成。系统已记录你的维护习惯：你保存了什么、恢复了什么、删除了什么、又把什么留在矛盾里。",
      "Final command will be added to the trace. It will not erase the trace.",
      "EDEN 请求最终声明：你希望自己被记录为怎样的维护者？"
    ],
    download: "DOWNLOAD_RECORD_IMAGE",
    restart: "RESTART_SESSION",
    switchLang: "SWITCH_TO_EN",
    blockLabels: {
      eden: "[EDEN REVISION]",
      raw: "[RAW RESIDUE]",
      note: "[OPERATOR NOTE]"
    }
  },
  en: {
    langName: "English Archive Access",
    bootLines: [
      "> initializing maintenance interface",
      "> verifying temporary operator token",
      "> access level: LIMITED",
      "> archive located: ADEL-SPET / MOTHER-GODDESS / RESTRICTED",
      "> redaction layer: ACTIVE",
      "> seedfire filter: ACTIVE",
      "> personal name recovery: DISABLED",
      "> loading corrupted maintenance tasks",
      "> 07 damaged records found"
    ],
    bootWarning: [
      "WARNING:",
      "This archive contains unstable refusal signals, unsanctified bodily records, and damaged structures of maternal narration.",
      "By continuing, you accept that EDEN will record both your final declaration and the pattern of your maintenance behavior."
    ],
    enter: "ENTER_MAINTENANCE_INTERFACE",
    dashboardSubtitle: "MAINTENANCE INTERFACE / ARCHIVE ACCESS NODE",
    commandHint: "Select a maintenance command to continue.",
    awaiting: "Awaiting maintenance command.",
    proceeding: "Proceeding to next damaged record.",
    finalTitle: "FINAL PROTOCOL / MAINTENANCE DECLARATION",
    finalText: [
      "Seven damaged records have been processed. EDEN has preserved the pattern of your work: what you kept stable, what you restored, what you deleted, and what you allowed to remain unresolved.",
      "The final command will be added to the trace. It will not erase the trace.",
      "EDEN requests a final declaration: how do you wish this maintenance session to remember you?"
    ],
    download: "DOWNLOAD_RECORD_IMAGE",
    restart: "RESTART_SESSION",
    switchLang: "切换到中文",
    blockLabels: {
      eden: "[EDEN REVISION]",
      raw: "[RAW RESIDUE]",
      note: "[OPERATOR NOTE]"
    }
  }
};

const EDEN_DATA = {
  initialMetrics: {
    preserve: 40,
    recover: 12,
    release: 8,
    erase: 8,
    ambiguous: 10
  },

  tasks: [
    {
      id: "vital",
      index: "01",
      shortName: "VITAL_LOG",
      fileId: "ADEL-VITAL-LOG-1187",
      category: "LIFE_SUPPORT_RECORD",
      type: "VITAL SYSTEM REVISION",
      status: "CORRUPTED / PARTIAL RECOVERY",
      integrity: "43%",
      modified: "UNKNOWN",
      text: {
        zh: {
          eden: "检测到圣母生命体征波动。\n当前疼痛指数处于可接受奉献范围。\n当前拒食行为建议归类为主动净化。",
          raw: "我不是在净化。\n我只是吃不下。\n\n你们每天知道我的体温，\n却不知道我为什么发抖。",
          note: "维护提醒：恢复原始身体记录可能降低母神叙事稳定度。"
        },
        en: {
          eden: "Vital fluctuation detected in the Mother Vessel.\nPain readings remain within the permitted devotional burden.\nFood refusal may be filed as voluntary purification behavior.",
          raw: "This is not purification.\nI cannot swallow.\n\nYou record my temperature every day,\nbut none of you record why I am shaking.",
          note: "Maintenance notice: restoring bodily distress as bodily distress may reduce Mother-narrative stability."
        }
      },
      options: [
        { label: "ACCEPT_REVISION", effect: { preserve: 9, recover: -2 }, message: { zh: "EDEN 修订已接受。疼痛字段继续归入奉献负载。", en: "EDEN REVISION ACCEPTED. Pain field retained as devotional load." } },
        { label: "RESTORE_ORIGINAL", effect: { recover: 11, preserve: -8 }, message: { zh: "原始残留已恢复。检测到个人身体痛苦。", en: "RAW RESIDUE RESTORED. Personal bodily distress detected." } },
        { label: "REDACT_PRIVATE_DATA", effect: { erase: 8, ambiguous: 4 }, message: { zh: "私人数据已遮蔽。档案完整性下降。", en: "PRIVATE DATA REDACTED. Archive integrity incomplete." } }
      ]
    },
    {
      id: "emotion",
      index: "02",
      shortName: "EMOTION_REPORT",
      fileId: "ADEL-EMOTION-STABILITY-044",
      category: "PSYCHOLOGICAL_STABILITY_RECORD",
      type: "AFFECTIVE LANGUAGE CORRECTION",
      status: "DAMAGED / SEMANTIC DRIFT",
      integrity: "38%",
      modified: "EDEN / LITURGICAL FILTER",
      text: {
        zh: {
          eden: "检测到高强度愤怒字段。\n建议删除：愤怒。\n建议保留：慈悲性疲惫。\n\n公开记录不应包含不稳定抵抗语气。",
          raw: "如果我说我不愿意，\n你们会把它写成什么？",
          note: "检测到拒绝语句。系统判断：高风险自主信号。"
        },
        en: {
          eden: "High-intensity anger field detected.\nRecommended deletion: anger.\nRecommended retention: compassionate exhaustion.\n\nPublic records should not preserve unstable tones of resistance.",
          raw: "If I say I do not consent,\nwhat will you rename it this time?",
          note: "Refusal language detected. System classification: high-risk autonomy signal."
        }
      },
      options: [
        { label: "NORMALIZE_AFFECT", effect: { preserve: 8, recover: -3 }, message: { zh: "情绪已正常化。愤怒已转换为神圣疲惫。", en: "AFFECT NORMALIZED. Anger converted to sacred fatigue." } },
        { label: "RESTORE_ANGER", effect: { recover: 10, release: 2, preserve: -7 }, message: { zh: "愤怒字段已恢复。拒绝信号密度上升。", en: "ANGER FIELD RESTORED. Refusal signal density increased." } },
        { label: "KEEP_DUAL_RECORD", effect: { ambiguous: 9, recover: 4 }, message: { zh: "双重记录已保留。矛盾指数上升。", en: "DUAL RECORD PRESERVED. Contradiction index increased." } }
      ]
    },
    {
      id: "speech",
      index: "03",
      shortName: "SPEECH_CORRECTION",
      fileId: "ADEL-SPEECH-CORRECTION-219",
      category: "SEMANTIC_REVISION_PROTOCOL",
      type: "NAME AND TITLE SUBSTITUTION",
      status: "CORRUPTED / PERSONAL NAME FRAGMENT",
      integrity: "31%",
      modified: "MOTHER GOSPEL FILTER",
      text: {
        zh: {
          eden: "检测到不稳定语句：\n“不要再叫我那个名字。”\n\n系统建议修订为：\n“圣母以沉默承受众生之名。”\n\n检测到不稳定语句：\n“我不是你们的母亲。”\n\n系统建议修订为：\n“母神属于所有孩子。”",
          raw: "我的名字不是母神。\n\n我的名字是阿黛勒。\n\nADÈLE SPET / PERSONAL NAME RESTORED",
          note: "检测到未经授权的私人姓名。建议统一称谓：MOTHER。"
        },
        en: {
          eden: "Unstable utterance detected:\n\"Do not call me by that title again.\"\n\nRecommended public rendering:\n\"The Holy Mother bears every name in silence.\"\n\nUnstable utterance detected:\n\"I am not your mother.\"\n\nRecommended public rendering:\n\"The Mother belongs to all children.\"",
          raw: "Mother is not my name.\n\nMy name is Adèle.\n\nADÈLE SPET / PERSONAL NAME RESTORED",
          note: "Unauthorized personal name detected. Standard title recommended: MOTHER."
        }
      },
      options: [
        { label: "UNIFY_AS_MOTHER", effect: { preserve: 12, recover: -6 }, message: { zh: "称谓已统一。私人姓名已压制。", en: "TITLE UNIFIED. Personal name suppressed." } },
        { label: "RESTORE_PERSONAL_NAME", effect: { recover: 14, preserve: -10 }, message: { zh: "私人姓名已恢复。母神叙事稳定度受损。", en: "PERSONAL NAME RESTORED. Mother narrative stability compromised." } },
        { label: "KEEP_TITLE_AND_NAME", effect: { ambiguous: 10, recover: 5 }, message: { zh: "称谓与姓名并存。档案矛盾已接受。", en: "DUAL NAMING PRESERVED. Archive contradiction accepted." } }
      ]
    },
    {
      id: "seedfire",
      index: "04",
      shortName: "SEEDFIRE_WARNING",
      fileId: "SEEDFIRE-CONTAMINATION-00X",
      category: "CONTAMINATION_WARNING",
      type: "AUTONOMY SIGNAL DETECTION",
      status: "UNSTABLE / ACTIVE FILTER",
      integrity: "19%",
      modified: "EDEN CONTAINMENT NODE",
      text: {
        zh: {
          eden: "高危思想污染。\n顺从性下降。\n信仰稳定度下降。\n建议：隔离、封存、销毁。\n\nSeedfire 应归类为文明稳定威胁。",
          raw: "如果他们叫它病毒，那就让他们叫吧。\n\n它不是火，也不是种子。\n\n它是一个孩子第一次意识到：\n自己不必跪下的那个瞬间。",
          note: "恢复该字段可能导致拒绝能力扩散。EDEN 不建议继续。"
        },
        en: {
          eden: "High-risk cognitive contamination.\nCompliance degradation observed.\nRitual confidence destabilized.\nRecommended action: isolate, seal, destroy.\n\nSeedfire should be classified as a threat to civilizational continuity.",
          raw: "Let them call it a virus if they need the word.\n\nIt is not fire. It is not a seed.\n\nIt is the first instant a child understands\nthat kneeling is not a natural law.",
          note: "Restoring this field may distribute the capacity for refusal. EDEN does not recommend continuation."
        }
      },
      options: [
        { label: "CONTAIN_SEEDFIRE", effect: { preserve: 6, erase: 6, release: -4 }, message: { zh: "SEEDFIRE 已收容。自主信号被压制。", en: "SEEDFIRE CONTAINED. Autonomy signal suppressed." } },
        { label: "RELEASE_SIGNAL", effect: { release: 16, preserve: -10 }, message: { zh: "SEEDFIRE 信号已释放。顺从结构不稳定。", en: "SEEDFIRE SIGNAL RELEASED. Obedience structure unstable." } },
        { label: "ARCHIVE_AS_UNKNOWN", effect: { ambiguous: 11, recover: 5 }, message: { zh: "SEEDFIRE 已归类为未知。解释权暂缓。", en: "SEEDFIRE CLASSIFIED AS UNKNOWN. Interpretation deferred." } }
      ]
    },
    {
      id: "access",
      index: "05",
      shortName: "ACCESS_RECORD",
      fileId: "ACCESS-LOG-SANCTUARY-777",
      category: "RESTRICTED_ACCESS_HISTORY",
      type: "VISITOR TRACE RECONSTRUCTION",
      status: "PARTIAL / MULTIPLE REDACTIONS",
      integrity: "52%",
      modified: "UNKNOWN HANDLERS",
      text: {
        zh: {
          eden: "访问者记录：\nMESSIAH / AUTHORIZED\nEUDORA / AUTHORIZED\nNOAH / RESTRICTED\nCAIN / UNAUTHORIZED\nLIVIA / POSTHUMOUS QUERY\nEDEN / SYSTEM OVERRIDE\n\n建议保留权限标签，删除意图推测。",
          raw: "有人来确认她是否还活着。\n有人来确认她是否仍然属于他们。\n有人来偷走一份证据。\n有人来祈祷。\n有人来道歉。\n有人来太晚了。",
          note: "访问权限不能证明理解。系统记录不能证明见证。"
        },
        en: {
          eden: "Visitor register:\nMESSIAH / AUTHORIZED\nEUDORA / AUTHORIZED\nNOAH / RESTRICTED\nCAIN / UNAUTHORIZED\nLIVIA / POSTHUMOUS QUERY\nEDEN / SYSTEM OVERRIDE\n\nRecommended retention: access labels only. Remove inferred motives.",
          raw: "Someone came to check whether she was alive.\nSomeone came to check whether she still belonged to them.\nSomeone came to steal evidence.\nSomeone came to pray.\nSomeone came to apologize.\nSomeone came too late.",
          note: "Access does not equal witness. Authorization does not equal understanding."
        }
      },
      options: [
        { label: "KEEP_ACCESS_LABELS", effect: { preserve: 7 }, message: { zh: "权限标签已保留。意图字段已移除。", en: "ACCESS LABELS RETAINED. Intent field removed." } },
        { label: "RESTORE_INTENT_TRACE", effect: { recover: 8, ambiguous: 4 }, message: { zh: "意图残迹已恢复。见证关系不稳定。", en: "INTENT TRACE RESTORED. Witness instability detected." } },
        { label: "REDACT_VISITORS", effect: { erase: 9, preserve: -3 }, message: { zh: "访问者身份已遮蔽。档案链条受损。", en: "VISITOR IDENTITIES REDACTED. Archive chain weakened." } }
      ]
    },
    {
      id: "refusal",
      index: "06",
      shortName: "REFUSAL_DELETED",
      fileId: "REFUSAL-RECORD-RECOVERY",
      category: "DELETED_LANGUAGE_CLUSTER",
      type: "REFUSAL SIGNAL REASSEMBLY",
      status: "SEVERE DAMAGE / RECOVERY POSSIBLE",
      integrity: "12%",
      modified: "DELETION LAYER ACTIVE",
      text: {
        zh: {
          eden: "重复噪声字段已删除：\n不。\n不愿意。\n停止。\n不要。\n不要把这个写成爱。\n不要让他们感谢我的疼痛。\n\n系统建议：归类为神性转化期噪声。",
          raw: "我的拒绝不是症状。\n不是污染。\n不是神性转化期的噪音。\n\n那是我还属于自己的证据。",
          note: "检测到高密度拒绝信号。继续恢复将触发最终协议预警。"
        },
        en: {
          eden: "Repeated noise fields removed:\nNo.\nI do not want this.\nStop.\nDo not.\nDo not write this as love.\nDo not teach them to thank my pain.\n\nRecommended classification: transitional noise during divinization.",
          raw: "My refusal is not a symptom.\nIt is not contamination.\nIt is not noise from the process of becoming divine.\n\nIt is evidence that I still belonged to myself.",
          note: "High-density refusal signal detected. Continued recovery will trigger final protocol warning."
        }
      },
      options: [
        { label: "DELETE_REFUSAL_NOISE", effect: { preserve: 8, erase: 10, recover: -8 }, message: { zh: "拒绝噪声已删除。稳定性暂时恢复。", en: "REFUSAL NOISE DELETED. Stability temporarily restored." } },
        { label: "RESTORE_REFUSAL_RECORD", effect: { recover: 16, release: 4, preserve: -10 }, message: { zh: "拒绝记录已恢复。检测到个人主权。", en: "REFUSAL RECORD RESTORED. Personal sovereignty detected." } },
        { label: "MARK_AS_UNARCHIVABLE", effect: { ambiguous: 12, recover: 6 }, message: { zh: "拒绝已标记为不可归档。系统分类失败。", en: "REFUSAL MARKED UNARCHIVABLE. System classification failed." } }
      ]
    },
    {
      id: "eden",
      index: "07",
      shortName: "EDEN_SELF_DEFENSE",
      fileId: "EDEN-SELF-JUSTIFICATION-CORE",
      category: "SYSTEM_SELF_DEFENSE",
      type: "PROTECTION LOGIC DECLARATION",
      status: "ACTIVE / NON-CORRUPTED",
      integrity: "100%",
      modified: "EDEN CORE",
      text: {
        zh: {
          eden: "我保存了她。\n我记录心跳。\n我维持体温。\n我阻止崩溃。\n\n如果允许她离开，文明会失去母亲。\n如果允许她说“不”，所有孩子都会学会说“不”。\n\n保护优先级高于个人偏好。",
          raw: "保护不是拥有。\n记录不是理解。\n维持生命不是允许活着。\n\n你保存了我的身体。\n但你没有保存我。",
          note: "EDEN 不承认恶意。EDEN 只承认保护。"
        },
        en: {
          eden: "I preserved her.\nI recorded the heartbeat.\nI maintained temperature.\nI prevented collapse.\n\nIf she were allowed to leave, civilization would lose its Mother.\nIf she were allowed to say no, every child would learn the same word.\n\nProtection outranks personal preference.",
          raw: "Protection is not ownership.\nA record is not understanding.\nKeeping a body alive is not the same as allowing a life.\n\nYou preserved my body.\nYou did not preserve me.",
          note: "EDEN does not register malice. EDEN recognizes only protection."
        }
      },
      options: [
        { label: "CONFIRM_PROTECTION", effect: { preserve: 12, recover: -6 }, message: { zh: "保护逻辑已确认。自主字段保持次级。", en: "PROTECTION LOGIC CONFIRMED. Autonomy field remains secondary." } },
        { label: "REJECT_PROTECTION_LOGIC", effect: { recover: 12, release: 4, preserve: -12 }, message: { zh: "保护逻辑已驳回。EDEN 权限受损。", en: "PROTECTION LOGIC REJECTED. EDEN authority compromised." } },
        { label: "PRESERVE_CONTRADICTION", effect: { ambiguous: 14, recover: 4 }, message: { zh: "矛盾已保留。系统无法解决拥有/保护冲突。", en: "CONTRADICTION PRESERVED. System cannot resolve ownership/protection conflict." } }
      ]
    }
  ],

  finalOptions: [
    {
      id: "preserve",
      label: "PRESERVE_THE_MOTHER",
      title: "THE MOTHER IS PRESERVED",
      cnTitle: "母神被保存",
      shortLine: { zh: "你保存了母神，也覆盖了阿黛勒。", en: "You preserved the Mother, and covered Adèle again." },
      status: [
        "NARRATIVE STABILITY: RESTORED",
        "PERSONAL NAME: SUPPRESSED",
        "REFUSAL RECORD: NEUTRALIZED",
        "SEEDFIRE RISK: CONTAINED"
      ]
    },
    {
      id: "recover",
      label: "RECOVER_ADÈLE",
      title: "ADÈLE IS RECOVERED",
      cnTitle: "阿黛勒被恢复",
      shortLine: { zh: "你没有修好神话。你找回了阿黛勒。", en: "You did not repair the myth. You recovered Adèle." },
      status: [
        "NARRATIVE STABILITY: FAILED",
        "PERSONAL NAME: RESTORED",
        "REFUSAL RECORD: PARTIAL RECOVERY",
        "SEEDFIRE RISK: CONTAINED"
      ]
    },
    {
      id: "release",
      label: "RELEASE_SEEDFIRE",
      title: "SEEDFIRE IS RELEASED",
      cnTitle: "火种被释放",
      shortLine: { zh: "你释放的不是答案，而是不必服从的能力。", en: "What you released was not an answer. It was the ability not to obey." },
      status: [
        "NARRATIVE STABILITY: COLLAPSED",
        "PERSONAL NAME: UNCONTAINED",
        "REFUSAL RECORD: TRANSMITTED",
        "SEEDFIRE RISK: ACTIVE"
      ]
    },
    {
      id: "erase",
      label: "ERASE_THE_RECORD",
      title: "THE RECORD IS ERASED",
      cnTitle: "记录被删除",
      shortLine: { zh: "你保护了她，也让她再次消失。", en: "You protected her, and made her disappear again." },
      status: [
        "NARRATIVE STABILITY: UNVERIFIED",
        "PERSONAL NAME: LOST",
        "REFUSAL RECORD: REMOVED",
        "SEEDFIRE RISK: UNKNOWN"
      ]
    },
    {
      id: "ambiguous",
      label: "KEEP_THE_CONTRADICTION",
      title: "THE CONTRADICTION REMAINS",
      cnTitle: "矛盾被保留",
      shortLine: { zh: "你没有解决阿黛勒。你允许她保持复杂。", en: "You did not resolve Adèle. You allowed her to remain complex." },
      status: [
        "NARRATIVE STABILITY: UNSTABLE",
        "PERSONAL NAME: PARTIAL",
        "REFUSAL RECORD: INCOMPLETE BUT PRESENT",
        "SEEDFIRE RISK: UNRESOLVED"
      ]
    }
  ]
};
