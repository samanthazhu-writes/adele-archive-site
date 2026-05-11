const body = document.body;

const langToggle = document.getElementById("langToggle");
const floatingToggle = document.getElementById("floatingToggle");
const navToggleNotes = document.getElementById("navToggleNotes");
const heroToggleNotes = document.getElementById("heroToggleNotes");
const officialOnly = document.getElementById("officialOnly");
const archiveStatus = document.getElementById("archiveStatus");
const statusText = archiveStatus.querySelector(".status-text");

const modeOnButtons = document.querySelectorAll(".mode-on");
const modeOffButtons = document.querySelectorAll(".mode-off");

const prayerForm = document.getElementById("prayerForm");
const prayerInput = document.getElementById("prayerInput");
const prayerResult = document.getElementById("prayerResult");

const hiddenEnding = document.getElementById("hiddenEnding");
const hiddenReveal = document.getElementById("hiddenReveal");

let currentLang = "cn";
let archiveOn = false;

const i18n = {
  cn: {
    "page.title": "The Adèle Archive: Mother Temple Visitor Guide",

    "nav.visit": "Visit",
    "nav.map": "Map",
    "nav.exhibits": "Exhibits",
    "nav.prayer": "Prayer",

    "label.templeApproved": "TEMPLE-APPROVED TEXT",
    "label.officialGuide": "Official Guide / 官方导览",
    "label.archiveNotes": "Archive Notes / 档案批注",

    "hero.system": "MOTHER TEMPLE PUBLIC VISITOR SYSTEM",
    "hero.document": "DOCUMENT ID: MT-VG-07",
    "hero.access": "ACCESS LEVEL: PUBLIC",
    "hero.eyebrow": "THE ADÈLE ARCHIVE",
    "hero.title": "阿黛勒档案：母神殿导览手册",
    "hero.subtitle": "Mother Temple Visitor Guide",
    "hero.edition": "Public Guide Edition / Archive-Annotated Copy",
    "hero.text": "欢迎进入母神殿公共参观系统。请依照推荐路线完成浏览。参观过程中，请保持安静，请勿触碰展柜，请勿誊写、改写或传播未经认证的历史表述。旧实验区暂不开放，请勿在封闭门外停留。",
    "hero.start": "Start Visit / 开始导览",
    "hero.showArchive": "Show Archive Notes / 显示档案批注",
    "hero.hideArchive": "Hide Archive Notes / 隐藏档案批注",
    "hero.officialOnly": "Official Guide Only / 仅浏览官方版本",
    "hero.tagline": "一份越读越可怕的圣地旅游手册。",
    "hero.scroll": "Scroll to Begin / 开始参观",

    "notice.heading": "Visitor Notice / 参观须知",
    "notice.official.p1": "为维护母神殿的神圣秩序与公共参观安全，请所有访客遵守以下规定：请在圣母安息厅与十二子苏醒室内保持静默。请勿触摸展柜、封存容器、复原装置或任何标注为限制接触的设施。",
    "notice.official.p2": "未经授权，请勿在展区内录音、誊写祷词、复制展签或改写导览文本。请勿向十二子影像提出私人问题。请勿使用“强制”“实验”“约束”“不愿意”等未经认证的历史表述。",
    "notice.official.p3": "若您在旧实验区附近听见异常声响、发现未标注通道，或看到残留编号，请立即离开该区域并通知工作人员。",
    "notice.archive.p1": "现存早期版本的参观须知中，未发现“私人问题”“未经认证表述”与“异常声响”相关条款。以上限制内容出现在母神殿开放后的第三次文本修订中。",
    "notice.archive.p2": "内部访客系统记录显示，出口留言、停留时长、路径偏离与关键词均曾被纳入分析。含有“阿黛勒”“不愿意”“谁决定的”等词汇的留言，会被系统标记为“不稳定反馈”。",
    "notice.archive.p3": "“维护参观体验”在部分管理记录中对应：叙事校正、情绪安抚与低强度记忆干预。",

    "reading.heading": "Reading Mode / 阅读模式",
    "reading.official.title": "Official Guide",
    "reading.official.text": "母神殿公开发布的参观文本，用于普通访客浏览、教育展示与纪念活动。",
    "reading.archive.title": "Archive Notes",
    "reading.archive.text": "来源不明的档案批注，涉及建筑原始用途、术语修订记录、展品重命名与被删除的历史痕迹。",
    "reading.officialOnly": "Official Only / 仅官方",
    "reading.archiveOn": "Archive Notes On / 开启批注",
    "reading.note": "请注意：官方文本不等于完整记录，档案批注也不构成最终结论。",
    "reading.officialMode": "OFFICIAL GUIDE MODE / 当前为官方导览模式",
    "reading.archiveEnabled": "ARCHIVE LAYER ENABLED / 档案批注层已开启",

    "map.heading": "Temple Map / 神殿导览地图",
    "map.intro": "母神殿推荐路线依照“最后恩典”的公共叙事顺序排列。访客可按下列路径依次浏览各展区。",
    "map.publicRoute": "PUBLIC ROUTE / 公开路线",
    "map.restrictedNode": "RESTRICTED NODE / 限制区域",
    "map.exitRoute": "EXIT ROUTE / 离场路线",
    "map.entrance": "Entrance Hall<br><span>入口大厅</span>",
    "map.rest": "Hall of Sacred Rest<br><span>圣母安息厅</span>",
    "map.twelve": "Chamber of the Twelve<br><span>十二子苏醒室</span>",
    "map.seedfire": "Seedfire Containment<br><span>火种封存区</span>",
    "map.gospel": "First Gospel Draft<br><span>圣典初稿展柜</span>",
    "map.chamber": "Chamber of the Mother<br><span>母神寝室复原区</span>",
    "map.relics": "Relics of Adèle<br><span>阿黛勒遗物展</span>",
    "map.restricted": "ACCESS LIMITED<br><span>禁止进入的旧实验区</span>",
    "map.shop": "Gift Shop of Grace<br><span>纪念品商店</span>",
    "map.prayer": "Exit Prayer Station<br><span>出口祷告区</span>",

    "vocab.heading": "Temple-Approved Vocabulary / 神殿推荐术语表",
    "vocab.intro": "为维护历史表述一致性，并避免未经认证的解释造成情绪误读，母神殿建议所有访客、讲解员与教育机构使用以下术语。",
    "vocab.table.bad": "不推荐用语",
    "vocab.table.good": "推荐用语",
    "vocab.death.bad": "死亡",
    "vocab.death.good": "安息",
    "vocab.restraint.bad": "约束",
    "vocab.restraint.good": "保护",
    "vocab.pain.bad": "疼痛",
    "vocab.pain.good": "奉献",
    "vocab.refusal.bad": "拒绝",
    "vocab.refusal.good": "情绪波动",
    "vocab.subject.bad": "实验体",
    "vocab.subject.good": "孩子",
    "vocab.life.bad": "生命维持系统",
    "vocab.life.good": "圣体延续装置",
    "vocab.incubator.bad": "孵化槽",
    "vocab.incubator.good": "苏醒圣龛",
    "vocab.seedfire.bad": "火种污染",
    "vocab.seedfire.good": "恩典试炼",
    "vocab.unwilling.bad": "不愿意",
    "vocab.unwilling.good": "尚未理解恩典",
    "vocab.archive.p1": "该术语表最初并非面向普通访客，而是用于讲解员、档案管理员与圣典誊写者培训。",
    "vocab.archive.p2": "术语替换改变了事件责任归属。“疼痛”被归入“奉献”，“约束”被归入“保护”，“拒绝”被归入“情绪波动”。",
    "vocab.archive.p3": "该表格不只规范语言，也规范了可被公开承认的事实范围。",

    "exhibits.heading": "Exhibition Sections / 主展区",

    "rest.title.cn": "圣母安息厅",
    "rest.title.en": "Hall of Sacred Rest",
    "rest.official.p1": "圣母安息厅是母神殿的核心纪念空间。据认证圣典记载，圣母阿黛勒在此完成最后恩典，并将自身的温度、呼吸与沉默交还给十二子，使其进入稳定苏醒阶段。",
    "rest.official.p2": "中央白石台为后期礼仪复原设施，用于标示圣母安息时的象征方位。请访客在本厅内保持静默，并依照地面指引完成环形参观。",
    "rest.official.p3": "母神殿提醒您：圣母并未离去。她以被纪念、被继承与被共同维护的形式继续存在。",
    "rest.archive.p1": "原始结构图显示，该区域最早标注为“生命维持约束区”。现有白石台并非原始设施，其下方仍保留接口槽、固定环痕迹、管线入口与体征同步端口。",
    "rest.archive.p2": "早期记录未使用“安息”一词。对应表述包括：“生理活动终止”“系统接入失败”与“主体生命指标不可逆下降”。",
    "rest.archive.p3": "“最后姿态复原”参考的是圣典插图，而非完整现场记录。",
    "rest.item.1": "中央白石安息台",
    "rest.item.2": "圣母体温复原图",
    "rest.item.3": "第七版安息仪式祷词",
    "rest.item.4": "安息厅穹顶星图",
    "rest.unstable": "她不是躺在这里。她是被留在这里。",

    "twelve.title.cn": "十二子苏醒室",
    "twelve.title.en": "Chamber of the Twelve",
    "twelve.official.p1": "十二子苏醒室记录了文明新晨的第一阶段。根据神殿认证叙事，十二名孩子在圣母完成安息后依次苏醒，并由此开启后圣母时代的公共生命秩序。",
    "twelve.official.p2": "每一座苏醒圣龛对应一名孩子，每一道光环用于标示其苏醒顺序与纪念编号。为维护展区秩序，请勿呼唤未经认证的私人姓名。",
    "twelve.official.p3": "本展区为静默参观区域。请勿向影像、投影或互动装置提出私人问题。",
    "twelve.archive.p1": "早期技术日志将本区称为“孵化槽列阵”。“苏醒圣龛”一词为后期公共展陈替换用语。",
    "twelve.archive.p2": "原始设备记录显示，十二个槽位属于人工孵化与生命稳定系统。第十二槽曾出现非同步反应，系统标记包括：“异常”“不稳定”“拒绝同步”“需隔离观察”。",
    "twelve.archive.p3": "关于孩子们是否保留苏醒前记忆的研究，在神殿建立后被终止。",
    "twelve.item.1": "十二座苏醒圣龛",
    "twelve.item.2": "苏醒顺序光环图",
    "twelve.item.3": "第十二槽残损编号",
    "twelve.item.4": "首次呼吸记录",
    "twelve.unstable": "请勿询问孩子们是否曾同意成为证据。",

    "seedfire.title.cn": "火种封存区",
    "seedfire.title.en": "Seedfire Containment Gallery",
    "seedfire.official.p1": "火种封存区为母神殿安全等级最高的公开展区。根据神殿说明，火种是圣母留给文明的最后试炼，曾引发偏离、混乱与不可预测的意志波动。",
    "seedfire.official.p2": "中央展柜中陈列的是最后一管火种的复原模型。真实样本不对公众开放，并由圣典委员会、安全部与技术保存组共同监管。",
    "seedfire.official.p3": "为确保参观安全，请勿靠近封存柜，请勿将手掌贴于玻璃表面，请勿尝试与展柜进行接触性互动。",
    "seedfire.archive.p1": "“污染”一词最早出现于母神殿安全部报告。目前可见的阿黛勒笔记中，未发现她以该词描述 Seedfire。",
    "seedfire.archive.p2": "残存笔记显示，她曾将 Seedfire 记录为一种“被保留下来的拒绝能力”。后续公开导览均删去了“拒绝”相关表述。",
    "seedfire.archive.p3": "火种机制可能涉及意志、自我命名、非服从行为与叙事断裂。神殿将其定义为危险物，但该定义未必来自原始研究者本人。",
    "seedfire.item.1": "火种封存柜",
    "seedfire.item.2": "最后一管 Seedfire 复制模型",
    "seedfire.item.3": "安全部污染等级牌",
    "seedfire.item.4": "火种扩散路线图",
    "seedfire.unstable": "如果服从是一种病，火种是什么？",

    "gospel.title.cn": "圣典初稿展柜",
    "gospel.title.en": "First Gospel Draft Display",
    "gospel.official.p1": "本展柜保存了《母神圣典》的早期草稿与修订版本。这些文本记录了圣母之言如何经过誊写、整理、祷告与校订，最终成为文明共同语言。",
    "gospel.official.p2": "每一道修订痕迹都体现了后世对恩典叙事的持续完善。神殿认为，修订并非对原文的背离，而是对圣母慈悲更准确、更庄严的理解。",
    "gospel.official.p3": "请勿在本展区进行未经授权的文本比对、摘录或再解释。",
    "gospel.archive.p1": "多处修订显示，阿黛勒的第一人称语句被改为第三人称神圣叙述。",
    "gospel.archive.p2": "“我不愿意”被改为“圣母愿承众苦”。“不要再记录我”被改为“圣母进入慈悲静默”。“这不是爱”被改为“圣母以凡人无法理解的方式继续爱着我们”。",
    "gospel.archive.p3": "“实验记录”被替换为“圣言初稿”。该替换改变了文本的来源属性，也改变了读者对责任主体的判断。",
    "gospel.item.1": "《母神圣典》第一版草稿",
    "gospel.item.2": "红色修订笔迹",
    "gospel.item.3": "术语替换表原件",
    "gospel.item.4": "被撕下的原始语句残片",
    "gospel.unstable": "她说话。他们修订。后人祈祷。",

    "chamber.title.cn": "母神寝室复原区",
    "chamber.title.en": "Reconstructed Chamber of the Mother",
    "chamber.official.p1": "母神寝室复原区呈现圣母生前短暂停歇的生活空间。本区根据遗物清单、圣典旁注与后世纪念图像重建，用于帮助访客理解圣母在日常层面的温柔与承担。",
    "chamber.official.p2": "展区内陈列有窄床、水杯、织物、便签与睡眠相关记录的复原件。这些物品共同构成圣母继续履行职责前的安宁片刻。",
    "chamber.official.p3": "请勿触摸床沿、织物或桌面物品。请勿将本区称为未经认证的私人房间。",
    "chamber.archive.p1": "原始清单显示，此处并非普通寝室，而是生活监测单元。饮水、睡眠、体温、梦话、药物摄入、书写行为与情绪波动均被记录。",
    "chamber.archive.p2": "房间中至少存在三处监控点。多份记录显示，阿黛勒长期处于睡眠不足、疼痛管理不足与持续观察状态。",
    "chamber.archive.p3": "桌面便签“remember to eat lunch”不应被解释为神学文本。它更可能是一条日常自我提醒。",
    "chamber.item.1": "窄床复原装置",
    "chamber.item.2": "未喝完的水杯",
    "chamber.item.3": "旧毯子",
    "chamber.item.4": "“remember to eat lunch”便签",
    "chamber.item.5": "睡眠监测表",
    "chamber.unstable": "她不是圣像。她只是很久没有睡好。",

    "relics.title.cn": "阿黛勒遗物展",
    "relics.title.en": "Relics of Adèle",
    "relics.official.p1": "阿黛勒遗物展陈列圣母生前使用、接触或被认为与其恩典相关的珍贵圣物。每一件展品都见证了她对文明的爱、对十二子的慈悲，以及对未来的无私承担。",
    "relics.official.p2": "神殿以永久保存的方式维护这些圣物，并通过编号、封存、修复与公共展示，使其从私人遗存转化为文明共同记忆。",
    "relics.official.p3": "请勿触摸展柜。请勿对展品进行未经授权的私人解释、重新命名或情绪化归属。",
    "relics.archive.p1": "早期遗物整理记录缺失。目前无法确认哪些物品被保存、哪些被移交、哪些被销毁，哪些在进入展柜前经过重新命名。",
    "relics.archive.p2": "部分展品可能曾作为证据、生活用品、研究材料或儿童物品存在，而非“圣物”。",
    "relics.archive.p3": "“止痛药盒”被解释为圣母承担痛苦的象征，也可能是疼痛管理失败的证据。“Noah 的儿童画”首先属于一个孩子，不属于神殿叙事。",
    "relics.item.1": "烧毁的实验笔记",
    "relics.item.2": "Noah 的儿童画",
    "relics.item.3": "给 Messiah 的未寄出信",
    "relics.item.4": "止痛药盒",
    "relics.item.5": "旧毯子",
    "relics.unstable": "保存她，是否也是再次拥有她？",

    "restricted.label": "ACCESS LIMITED / RESTRICTED AREA",
    "restricted.meta.status.label": "FILE STATUS",
    "restricted.meta.status.value": "PARTIALLY CORRUPTED",
    "restricted.meta.audio.label": "AUDIO",
    "restricted.meta.audio.value": "UNAVAILABLE",
    "restricted.meta.original.label": "ORIGINAL LABEL",
    "restricted.title.cn": "禁止进入的旧实验区",
    "restricted.title.en": "Restricted Former Laboratory",
    "restricted.official.p1": "旧实验区因结构老化、系统不稳定与安全维护需求，暂不对公众开放。本区域不属于母神殿推荐参观路线，也不构成现行圣母安息叙事的必要组成部分。",
    "restricted.official.p2": "为保障参观安全，请勿靠近封闭门、扫描锁、维修通道或地下楼梯。若您误入旧实验区周边，请保持冷静，并沿最近的公共路线返回主展区。",
    "restricted.official.p3": "请勿阅读墙面残留标记。请勿记录未认证编号。请勿回应门后声音。",
    "restricted.archive.p1": "旧实验区是母神殿最早的空间核心之一。建筑下层仍保留实验台、人工孵化设备、旧式培养皿、封存管线与生命维持系统接口。",
    "restricted.archive.p2": "早期平面图显示，现行圣所可能由实验室、孵化中心、生命维持区与档案控制室逐步改造而成。",
    "restricted.archive.p3": "“不构成现行圣母安息叙事的必要组成部分”并不等于“与阿黛勒无关”。",
    "restricted.denied": "ACCESS DENIED",
    "restricted.item.1": "门禁图标",
    "restricted.item.2": "被涂黑的平面图",
    "restricted.item.3": "无法播放的音频文件",
    "restricted.unstable": "如果这里与圣母无关，为什么所有门都通向这里？",

    "shop.heading": "Gift Shop of Grace / 纪念品商店",
    "shop.intro": "感谢您完成母神殿公共参观路线。访客可在纪念品商店选购经神殿认证的纪念物，将圣母的慈悲、秩序与安宁带回日常生活。",
    "shop.item.1.name": "圣母祷告卡",
"shop.item.1.slogan": "把无法说出口的感谢，交给已经替您写好的句子。",
"shop.item.1.category": "Category: Devotional Print",
"shop.item.1.price": "¥18 / £2.00",

"shop.item.2.name": "十二子纪念徽章",
"shop.item.2.slogan": "每一枚编号，都证明有人替他们记住了出生顺序。",
"shop.item.2.category": "Category: Commemorative Pin",
"shop.item.2.price": "¥36 / £4.00",

"shop.item.3.name": "火种玻璃吊坠",
"shop.item.3.slogan": "安全佩戴一份被定义为危险的自由。",
"shop.item.3.category": "Category: Containment Replica",
"shop.item.3.price": "¥68 / £7.50",

"shop.item.4.name": "Mother’s Mercy 香薰",
"shop.item.4.slogan": "适用于睡眠、净化、顺从，以及低抵抗感的夜晚。",
"shop.item.4.category": "Category: Home Fragrance",
"shop.item.4.price": "¥128 / £14.00",

"shop.item.5.name": "圣典摘录明信片",
"shop.item.5.slogan": "经过七次修订，因此更接近真相。",
"shop.item.5.category": "Category: Gospel Excerpt",
"shop.item.5.price": "¥12 / £1.50",

"shop.item.6.name": "“She Gave Herself”帆布袋",
"shop.item.6.slogan": "足够结实，可承载未经本人确认的牺牲。",
"shop.item.6.category": "Category: Visitor Merchandise",
"shop.item.6.price": "¥88 / £9.50",

"shop.status.certified": "Status: Temple Certified",
"shop.status.soldOut": "Status: Sold Out",
    "shop.archive.p1": "商品化记录显示，第一批纪念品上线时间早于正式死因报告公开时间。",
    "shop.archive.p2": "“She Gave Herself”标语最早出现在内部传播测试稿中。目前未发现证据表明该句来自阿黛勒本人。",
    "shop.archive.p3": "“Mother’s Mercy”香薰配方说明中曾出现“安眠”“洁净”“低抵抗感”等营销词。其命名时间与母神寝室复原区开放时间相近。",
    "shop.unstable": "如果一切都属于她，为什么付款码属于神殿？",

    "prayer.heading": "Exit Prayer Station / 出口祷告区",
    "prayer.intro": "您即将离开母神殿。离场前，您可以在出口祷告区写下一句献给圣母的话。您的留言将进入神殿公共祝祷数据库，并可能在未来展览中匿名展示。",
    "prayer.line": "“圣母阿黛勒，感谢您为我们……”",
    "prayer.placeholder": "请写下您愿意留在档案中的一句话。",
    "prayer.submit": "Submit Prayer / 提交祷告",
    "prayer.archive.p1": "早期出口系统收集访客留言，用于监测公众对母神叙事的接受程度。留言内容、提交时间、路径偏离情况与关键词均可被关联记录。",
    "prayer.archive.p2": "含有“阿黛勒”“不愿意”“约束”“谁决定的”“她不是神”“她是人”等词汇的留言曾被自动隐藏。部分留言未删除，而是转入“叙事风险样本库”。",
    "prayer.archive.p3": "“愿圣母记得您”并非原始反馈语。早期版本为：“您的信息已被记录。”",
    "prayer.unstable": "你写下的不是祷告，是下一份档案。",
    "prayer.empty": "请先写下一句祷告。",
    "prayer.normal": "感谢您的留言。您的祷告已进入公共祝祷审核队列。愿圣母记得您。",
    "prayer.warning": "Your prayer requires additional narrative review. / 您的祷告需要进一步叙事审核。",
    "prayer.classification": "Classification: Narrative Instability",
"detail.label.format": "Format",
"detail.label.players": "Player Count",
"detail.label.duration": "Duration",
"detail.label.status": "Status",
"detail.label.premise": "Premise / 前提",
"detail.label.design": "Public Design Information / 公开设计信息",
"detail.label.note": "Content Note / 内容提示",
"detail.label.boundary": "Public Boundary",

"detail.main.kicker": "MOTHER PROJECT",
"detail.main.subtitle": "《她不是神：阿黛勒档案》",
"detail.main.format": "Participatory archive trial / Jubensha-inspired immersive script game",
"detail.main.players": "6 players",
"detail.main.duration": "Approx. 3–4 hours, depending on adaptation",
"detail.main.status": "In development / sample materials available upon request",
"detail.main.premise": "在一个未来文明中，科学家阿黛勒·斯佩特被神化为 Mother Goddess。官方叙事称她自愿殉道，残存档案却暗示她的身体、研究、痛苦、母职与死亡都被制度征用。六名玩家共同进入一场档案审判，决定阿黛勒究竟是圣母，还是被神话吞没的人。",
"detail.main.design": "本项目以档案、证词、制度文本和玩家裁决为核心，而非传统谋杀推理。玩家需要阅读被污染的历史材料，辨认官方语言如何改写事实，并在结局阶段共同决定是否公开、修正或继续封存阿黛勒的真相。",
"detail.main.note": "包含身体自主权、制度化母职、医学/实验伦理、死亡叙事、宗教化政治语言、记忆与证词污染等主题。公开页面不包含完整角色材料、完整线索文本、GM手册或结局判定。",
"detail.main.boundary": "本区域仅为公开项目简介。完整剧本、角色本、主持材料、线索链与结局结构均为非公开开发材料。",

"detail.night.kicker": "LIVE EXPERIENCE",
"detail.night.subtitle": "《阿黛勒档案：静默之夜》",
"detail.night.format": "Four-player live archive experience",
"detail.night.players": "4 players",
"detail.night.duration": "Approx. 90–120 minutes",
"detail.night.status": "Branch project / in development",
"detail.night.premise": "故事发生在阿黛勒死亡当夜。四名玩家扮演神殿体系中与她死亡现场有关的职能人员：他们不能完整说出真相，却必须共同决定第一份官方报告如何写下。",
"detail.night.design": "本项目强调沉默、删改、汇报语言和现场责任。玩家不是寻找“凶手”，而是在有限语言规则下处理死亡现场、遗漏证据、互相试探，并决定制度记忆的第一版。",
"detail.night.note": "包含死亡现场、医疗/照护失败、制度沉默、责任转移、文本审查、创伤性汇报语言等主题。公开页面不展示角色私密信息、完整报告模板或结局触发条件。",
"detail.night.boundary": "本区域仅为分支体验的公开简介。角色轨道、场景脚本、报告逻辑和完整结局不公开发布。",

"detail.relic.kicker": "OBJECT-BASED EXPERIENCE",
"detail.relic.subtitle": "《阿黛勒档案：静默的遗物整理师》",
"detail.relic.format": "Object-based immersive archive reconstruction",
"detail.relic.players": "1–4 players, flexible low-pressure format",
"detail.relic.duration": "Approx. 60 minutes",
"detail.relic.status": "Companion piece / in development",
"detail.relic.premise": "玩家进入一间根据残存档案重建出的阿黛勒死后房间。他们表面上是遗物整理师，实际上正在以后世档案参与者的身份重新裁决阿黛勒的生活、身体、研究与神话。",
"detail.relic.design": "本项目不依赖高强度表演，也不要求玩家大声辩论。核心体验来自触摸、分类、阅读、犹豫与决定：每件遗物都需要被保存、移交、销毁，或带离。",
"detail.relic.note": "包含遗物处理、死亡后的物品占有、制度归档、母职物证、儿童痕迹、医学记录与纪念品化等主题。公开页面不展示完整遗物文本、判定表或玩家最终报告。",
"detail.relic.boundary": "本区域仅为公开简介。完整物件文本、分类规则、结局逻辑和主持材料均为非公开开发内容。",

"detail.guide.kicker": "PUBLIC WEB SAMPLE",
"detail.guide.subtitle": "《阿黛勒档案：母神殿导览手册》",
"detail.guide.format": "Interactive public worldbuilding webpage",
"detail.guide.players": "Solo browsing / public portfolio sample",
"detail.guide.duration": "Approx. 5–15 minutes",
"detail.guide.status": "Public sample page",
"detail.guide.premise": "这是一份伪装成圣地旅游官网的公开世界观样本。访客浏览母神殿的展区、礼品店、祷告系统与官方导览词，同时可以开启档案批注层，看见制度文本背后的裂缝。",
"detail.guide.design": "页面使用双层文本结构：官方导览层负责制造庄严、干净、可消费的母神叙事；档案批注层则揭示删改、替换、监控、商品化与叙事不稳定。",
"detail.guide.note": "包含制度宣传、圣地消费、语言审查、伪宗教展陈、身体政治与死亡纪念品化等主题。本页面可公开浏览，但不等同于完整游戏发布。",
"detail.guide.boundary": "本网页是公开世界观样本，不包含完整剧本、角色材料、主持手册或完整结局结构。",


"footer.title": "Writer / Interactive Narrative Designer",
"footer.bio": "Samantha Zhu 是一名互动叙事作者与设计者，创作受剧本杀、沉浸式戏剧、档案小说、哥特想象与女性主义推想小说影响的低压文档驱动型叙事体验。她的作品关注制度记忆、身体政治、神话制造、沉默证词与参与式审判。",
"footer.email": "Email: samantha201223@163.com",
"footer.website": "Portfolio: samanthazhu-writes.github.io",

"footer.note.p1": "本页面是 <em>She Was Not a Goddess: The Adèle Archive</em> 的公开世界观样本。",
"footer.note.p2": "它不是完整剧本发布，不包含玩家材料、主持手册、完整线索文本或完整结局结构。若用于开发、出版或合作沟通，可另行准备 short sample kit。",
"footer.note.p3": "当前页面仅展示 Adèle Archive 宇宙中的公开信息层、展陈文本层与档案批注层。完整体验仍保留为非公开开发材料。",

"footer.hidden": "请勿在导览结束后继续称呼她为阿黛勒。",
"footer.reveal": "她会听见。"
  },

  en: {
    "page.title": "The Adèle Archive: Mother Temple Visitor Guide",

    "nav.visit": "Visit",
    "nav.map": "Map",
    "nav.exhibits": "Exhibits",
    "nav.prayer": "Prayer",

    "label.templeApproved": "TEMPLE-APPROVED TEXT",
    "label.officialGuide": "Official Guide",
    "label.archiveNotes": "Archive Notes",

    "hero.system": "MOTHER TEMPLE PUBLIC VISITOR SYSTEM",
    "hero.document": "DOCUMENT ID: MT-VG-07",
    "hero.access": "ACCESS LEVEL: PUBLIC",
    "hero.eyebrow": "THE ADÈLE ARCHIVE",
    "hero.title": "The Adèle Archive: Mother Temple Visitor Guide",
    "hero.subtitle": "Mother Temple Visitor Guide",
    "hero.edition": "Public Guide Edition / Archive-Annotated Copy",
    "hero.text": "Welcome to the Mother Temple Public Visitor System. Please follow the recommended route. During your visit, remain quiet. Do not touch display cases. Do not transcribe, alter, or circulate uncertified historical expressions. The former laboratory is temporarily closed. Do not remain outside sealed doors.",
    "hero.start": "Start Visit",
    "hero.showArchive": "Show Archive Notes",
    "hero.hideArchive": "Hide Archive Notes",
    "hero.officialOnly": "Official Guide Only",
    "hero.tagline": "A sacred visitor guide that becomes more disturbing the longer it is read.",
    "hero.scroll": "Scroll to Begin",

    "notice.heading": "Visitor Notice",
    "notice.official.p1": "To preserve the sacred order of the Mother Temple and ensure public visitor safety, all visitors must observe the following rules: maintain silence in the Hall of Sacred Rest and the Chamber of the Twelve. Do not touch display cases, containment vessels, reconstruction devices, or any facility marked as restricted contact.",
    "notice.official.p2": "Without authorization, do not record audio, transcribe prayers, copy exhibition labels, or alter guide text inside the exhibition areas. Do not ask private questions of the Twelve Children’s images. Do not use uncertified historical expressions such as “coercion,” “experiment,” “restraint,” or “unwilling.”",
    "notice.official.p3": "If you hear abnormal sounds near the former laboratory, discover an unmarked passage, or see residual numbering, leave the area immediately and notify temple staff.",
    "notice.archive.p1": "No references to “private questions,” “uncertified expressions,” or “abnormal sounds” have been found in surviving early versions of the visitor notice. These restrictions appear in the third textual revision after the Mother Temple opened to the public.",
    "notice.archive.p2": "Internal visitor-system records indicate that exit messages, dwell time, route deviations, and keywords were once included in analysis. Messages containing terms such as “Adèle,” “unwilling,” or “who decided this” were marked as “unstable feedback.”",
    "notice.archive.p3": "In some management records, “maintaining the visitor experience” corresponds to narrative correction, emotional containment, and low-intensity memory intervention.",

    "reading.heading": "Reading Mode",
    "reading.official.title": "Official Guide",
    "reading.official.text": "The public visitor text issued by the Mother Temple for general browsing, educational display, and commemorative activities.",
    "reading.archive.title": "Archive Notes",
    "reading.archive.text": "Archive annotations of uncertain origin, concerning the building’s original use, terminology revisions, exhibit renaming, and traces removed from the public record.",
    "reading.officialOnly": "Official Only",
    "reading.archiveOn": "Archive Notes On",
    "reading.note": "Please note: official text is not a complete record, and archive notes do not constitute a final conclusion.",
    "reading.officialMode": "OFFICIAL GUIDE MODE",
    "reading.archiveEnabled": "ARCHIVE LAYER ENABLED",

    "map.heading": "Temple Map",
    "map.intro": "The Mother Temple’s recommended route is arranged according to the public narrative of the “Final Grace.” Visitors may follow the path below to view each exhibition section.",
    "map.publicRoute": "PUBLIC ROUTE",
    "map.restrictedNode": "RESTRICTED NODE",
    "map.exitRoute": "EXIT ROUTE",
    "map.entrance": "Entrance Hall",
    "map.rest": "Hall of Sacred Rest",
    "map.twelve": "Chamber of the Twelve",
    "map.seedfire": "Seedfire Containment",
    "map.gospel": "First Gospel Draft",
    "map.chamber": "Chamber of the Mother",
    "map.relics": "Relics of Adèle",
    "map.restricted": "ACCESS LIMITED",
    "map.shop": "Gift Shop of Grace",
    "map.prayer": "Exit Prayer Station",

    "vocab.heading": "Temple-Approved Vocabulary",
    "vocab.intro": "To maintain consistency in historical expression and prevent emotional misreading caused by uncertified interpretations, the Mother Temple recommends the following terminology for visitors, guides, and educational institutions.",
    "vocab.table.bad": "Non-Recommended Term",
    "vocab.table.good": "Temple-Approved Term",
    "vocab.death.bad": "Death",
    "vocab.death.good": "Rest",
    "vocab.restraint.bad": "Restraint",
    "vocab.restraint.good": "Protection",
    "vocab.pain.bad": "Pain",
    "vocab.pain.good": "Devotion",
    "vocab.refusal.bad": "Refusal",
    "vocab.refusal.good": "Emotional fluctuation",
    "vocab.subject.bad": "Experimental subject",
    "vocab.subject.good": "Child",
    "vocab.life.bad": "Life-support system",
    "vocab.life.good": "Sacred body continuation device",
    "vocab.incubator.bad": "Incubation chamber",
    "vocab.incubator.good": "Awakening reliquary",
    "vocab.seedfire.bad": "Seedfire contamination",
    "vocab.seedfire.good": "Trial of grace",
    "vocab.unwilling.bad": "Unwilling",
    "vocab.unwilling.good": "Not yet understanding grace",
    "vocab.archive.p1": "This terminology table was not originally intended for ordinary visitors. It was used to train guides, archivists, and gospel copyists.",
    "vocab.archive.p2": "Terminological replacement changed the attribution of responsibility. “Pain” was filed under “devotion,” “restraint” under “protection,” and “refusal” under “emotional fluctuation.”",
    "vocab.archive.p3": "The table regulates not only language, but also the range of facts that can be publicly acknowledged.",

    "exhibits.heading": "Exhibition Sections",

    "rest.title.cn": "Hall of Sacred Rest",
    "rest.title.en": "",
    "rest.official.p1": "The Hall of Sacred Rest is the central commemorative space of the Mother Temple. According to the certified gospel, Mother Adèle completed the Final Grace here, returning her warmth, breath, and silence to the Twelve Children so they could enter stable awakening.",
    "rest.official.p2": "The central white stone platform is a later ritual reconstruction facility, used to mark the symbolic position of the Mother’s rest. Visitors should remain silent and follow the floor route in a circular path.",
    "rest.official.p3": "The Mother Temple reminds you: the Mother has not departed. She continues to exist through remembrance, inheritance, and collective maintenance.",
    "rest.archive.p1": "Original structural plans identify this area as a “life-maintenance restraint zone.” The current white stone platform is not an original facility. Interface slots, fastening-ring traces, conduit access points, and vital-synchronization ports remain beneath it.",
    "rest.archive.p2": "The term “rest” does not appear in early records. Corresponding phrases include “cessation of physiological activity,” “system connection failure,” and “irreversible decline of subject vital signs.”",
    "rest.archive.p3": "The “final posture reconstruction” appears to reference gospel illustrations rather than a complete site record.",
    "rest.item.1": "Central white stone rest platform",
    "rest.item.2": "Reconstructed body-temperature diagram",
    "rest.item.3": "Seventh edition rest ritual prayer",
    "rest.item.4": "Hall dome star map",
    "rest.unstable": "She was not lying here. She was left here.",

    "twelve.title.cn": "Chamber of the Twelve",
    "twelve.title.en": "",
    "twelve.official.p1": "The Chamber of the Twelve records the first phase of civilization’s new dawn. According to temple-certified narrative, the twelve children awakened one by one after the Mother completed her rest, inaugurating the public order of life after the Mother.",
    "twelve.official.p2": "Each awakening reliquary corresponds to one child, and each ring of light marks their awakening sequence and commemorative number. To preserve exhibition order, do not call uncertified private names.",
    "twelve.official.p3": "This is a silent viewing area. Do not ask private questions of images, projections, or interactive devices.",
    "twelve.archive.p1": "Early technical logs refer to this area as the “incubation chamber array.” “Awakening reliquary” is a later public-exhibition replacement term.",
    "twelve.archive.p2": "Original equipment records indicate that the twelve slots belonged to an artificial incubation and life-stabilization system. Slot Twelve showed asynchronous response, with system markers including “abnormal,” “unstable,” “refusal to synchronize,” and “requires isolation observation.”",
    "twelve.archive.p3": "Research into whether the children retained pre-awakening memory was discontinued after the establishment of the temple.",
    "twelve.item.1": "Twelve awakening reliquaries",
    "twelve.item.2": "Awakening sequence halo diagram",
    "twelve.item.3": "Damaged Slot Twelve number",
    "twelve.item.4": "First-breath record",
    "twelve.unstable": "Do not ask whether the children consented to become evidence.",

    "seedfire.title.cn": "Seedfire Containment Gallery",
    "seedfire.title.en": "",
    "seedfire.official.p1": "The Seedfire Containment Gallery is the highest-security public exhibition area of the Mother Temple. According to temple explanation, Seedfire was the Mother’s final trial for civilization, once causing deviation, disorder, and unpredictable fluctuations of will.",
    "seedfire.official.p2": "The central case displays a reconstruction model of the final Seedfire vial. The real sample is not open to the public and is jointly supervised by the Gospel Committee, the Security Department, and the Technical Preservation Group.",
    "seedfire.official.p3": "For visitor safety, do not approach the containment case, do not place your palm on the glass, and do not attempt contact-based interaction with the display.",
    "seedfire.archive.p1": "The word “contamination” first appears in Mother Temple Security Department reports. In currently visible notes by Adèle, no such term has been found in reference to Seedfire.",
    "seedfire.archive.p2": "Surviving notes indicate that she once recorded Seedfire as “a preserved capacity for refusal.” Later public guides removed all related references to refusal.",
    "seedfire.archive.p3": "The Seedfire mechanism may involve will, self-naming, non-obedient behavior, and narrative rupture. The temple defines it as dangerous material, but that definition may not originate with the original researcher.",
    "seedfire.item.1": "Seedfire containment case",
    "seedfire.item.2": "Replica of the final Seedfire vial",
    "seedfire.item.3": "Security contamination level plaque",
    "seedfire.item.4": "Seedfire spread route map",
    "seedfire.unstable": "If obedience is a disease, what is Seedfire?",

    "gospel.title.cn": "First Gospel Draft Display",
    "gospel.title.en": "",
    "gospel.official.p1": "This display preserves early drafts and revised editions of the Mother Gospel. These texts record how the Mother’s words passed through copying, ordering, prayer, and correction before becoming the shared language of civilization.",
    "gospel.official.p2": "Each revision mark reflects later generations’ continued refinement of the grace narrative. The temple holds that revision is not a departure from the original, but a more accurate and solemn understanding of the Mother’s mercy.",
    "gospel.official.p3": "Do not conduct unauthorized textual comparison, quotation, or reinterpretation in this area.",
    "gospel.archive.p1": "Multiple revisions show that Adèle’s first-person statements were changed into third-person sacred narration.",
    "gospel.archive.p2": "“I am not willing” became “the Mother willingly bore all suffering.” “Do not record me anymore” became “the Mother entered merciful silence.” “This is not love” became “the Mother continued to love us in a way mortals could not understand.”",
    "gospel.archive.p3": "“Experimental record” was replaced with “first gospel draft.” This replacement changed the source category of the text and altered the reader’s judgment of responsibility.",
    "gospel.item.1": "First draft of the Mother Gospel",
    "gospel.item.2": "Red revision marks",
    "gospel.item.3": "Original terminology replacement sheet",
    "gospel.item.4": "Torn fragment of original statement",
    "gospel.unstable": "She spoke. They revised. Later generations prayed.",

    "chamber.title.cn": "Reconstructed Chamber of the Mother",
    "chamber.title.en": "",
    "chamber.official.p1": "The Reconstructed Chamber of the Mother presents the living space where the Mother briefly rested. Based on relic lists, gospel marginalia, and later commemorative imagery, this area helps visitors understand the Mother’s daily tenderness and endurance.",
    "chamber.official.p2": "The exhibition includes reconstructed objects related to a narrow bed, water cup, textiles, notes, and sleep records. Together, these objects form a quiet moment before the Mother continued her duties.",
    "chamber.official.p3": "Do not touch the bed frame, textiles, or desk objects. Do not refer to this area as an uncertified private room.",
    "chamber.archive.p1": "Original inventories indicate that this was not an ordinary bedroom, but a living-monitoring unit. Drinking, sleep, temperature, sleep speech, medication intake, writing behavior, and emotional fluctuation were all recorded.",
    "chamber.archive.p2": "At least three monitoring points existed in the room. Multiple records show that Adèle remained under chronic sleep deprivation, insufficient pain management, and continuous observation.",
    "chamber.archive.p3": "The desk note “remember to eat lunch” should not be interpreted as theological text. It is more likely an ordinary self-reminder.",
    "chamber.item.1": "Reconstructed narrow bed",
    "chamber.item.2": "Unfinished cup of water",
    "chamber.item.3": "Old blanket",
    "chamber.item.4": "“remember to eat lunch” note",
    "chamber.item.5": "Sleep monitoring sheet",
    "chamber.unstable": "She was not an icon. She had simply not slept well for a very long time.",

    "relics.title.cn": "Relics of Adèle",
    "relics.title.en": "",
    "relics.official.p1": "The Relics of Adèle display presents sacred objects used, touched, or believed to be associated with the Mother’s grace. Each exhibit testifies to her love for civilization, her mercy toward the Twelve Children, and her selfless burden for the future.",
    "relics.official.p2": "The temple preserves these sacred objects permanently, transforming private remains into shared civilizational memory through numbering, sealing, restoration, and public display.",
    "relics.official.p3": "Do not touch display cases. Do not offer unauthorized private interpretation, renaming, or emotional ownership of the exhibits.",
    "relics.archive.p1": "Early relic-processing records are missing. It is currently impossible to confirm which objects were preserved, transferred, destroyed, or renamed before entering the display cases.",
    "relics.archive.p2": "Some exhibits may once have existed as evidence, daily objects, research materials, or children’s belongings rather than “sacred relics.”",
    "relics.archive.p3": "The “painkiller box” is interpreted as a symbol of the Mother bearing pain, but it may also be evidence of failed pain management. “Noah’s child drawing” first belonged to a child, not to temple narrative.",
    "relics.item.1": "Burned experimental notebook",
    "relics.item.2": "Noah’s child drawing",
    "relics.item.3": "Unsent letter to Messiah",
    "relics.item.4": "Painkiller box",
    "relics.item.5": "Old blanket",
    "relics.unstable": "Is preserving her also another way of possessing her?",

    "restricted.label": "ACCESS LIMITED / RESTRICTED AREA",
    "restricted.meta.status.label": "FILE STATUS",
    "restricted.meta.status.value": "PARTIALLY CORRUPTED",
    "restricted.meta.audio.label": "AUDIO",
    "restricted.meta.audio.value": "UNAVAILABLE",
    "restricted.meta.original.label": "ORIGINAL LABEL",
    "restricted.title.cn": "Restricted Former Laboratory",
    "restricted.title.en": "",
    "restricted.official.p1": "The former laboratory is temporarily closed due to structural aging, system instability, and security maintenance requirements. This area is not part of the Mother Temple’s recommended visitor route and does not constitute a necessary component of the current Sacred Rest narrative.",
    "restricted.official.p2": "For visitor safety, do not approach sealed doors, scan locks, maintenance passages, or underground stairs. If you enter the vicinity by mistake, remain calm and return to the main exhibition through the nearest public route.",
    "restricted.official.p3": "Do not read residual wall markings. Do not record uncertified numbers. Do not respond to sounds behind the door.",
    "restricted.archive.p1": "The former laboratory is one of the earliest spatial cores of the Mother Temple. Lower levels still contain laboratory benches, artificial incubation devices, older culture vessels, containment pipelines, and life-support system interfaces.",
    "restricted.archive.p2": "Early floor plans indicate that the current sanctuary may have been gradually converted from a laboratory, incubation center, life-maintenance zone, and archive control room.",
    "restricted.archive.p3": "“Not a necessary component of the current Sacred Rest narrative” does not mean “unrelated to Adèle.”",
    "restricted.denied": "ACCESS DENIED",
    "restricted.item.1": "Access-control icon",
    "restricted.item.2": "Redacted floor plan",
    "restricted.item.3": "Unplayable audio file",
    "restricted.unstable": "If this place is unrelated to the Mother, why do all doors lead here?",

    "shop.heading": "Gift Shop of Grace",
    "shop.intro": "Thank you for completing the Mother Temple public visitor route. Visitors may purchase temple-certified commemorative objects and bring the Mother’s mercy, order, and peace into daily life.",
    "shop.item.1.name": "Mother Prayer Card",
"shop.item.1.slogan": "For gratitude too difficult to say, pre-approved sentences are provided.",
"shop.item.1.category": "Category: Devotional Print",
"shop.item.1.price": "¥18 / £2.00",

"shop.item.2.name": "Twelve Children Memorial Pin",
"shop.item.2.slogan": "Each number proves that someone remembered the order of their awakening for them.",
"shop.item.2.category": "Category: Commemorative Pin",
"shop.item.2.price": "¥36 / £4.00",

"shop.item.3.name": "Seedfire Glass Pendant",
"shop.item.3.slogan": "Wear, safely, a freedom officially classified as dangerous.",
"shop.item.3.category": "Category: Containment Replica",
"shop.item.3.price": "¥68 / £7.50",

"shop.item.4.name": "Mother’s Mercy Fragrance",
"shop.item.4.slogan": "Suitable for sleep, purification, obedience, and nights of low resistance.",
"shop.item.4.category": "Category: Home Fragrance",
"shop.item.4.price": "¥128 / £14.00",

"shop.item.5.name": "Gospel Excerpt Postcard",
"shop.item.5.slogan": "Revised seven times, and therefore closer to the truth.",
"shop.item.5.category": "Category: Gospel Excerpt",
"shop.item.5.price": "¥12 / £1.50",

"shop.item.6.name": "“She Gave Herself” Tote Bag",
"shop.item.6.slogan": "Strong enough to carry a sacrifice never confirmed by the person herself.",
"shop.item.6.category": "Category: Visitor Merchandise",
"shop.item.6.price": "¥88 / £9.50",

"shop.status.certified": "Status: Temple Certified",
"shop.status.soldOut": "Status: Sold Out",
    "shop.archive.p1": "Commercialization records indicate that the first batch of souvenirs went online before the official cause-of-death report was released.",
    "shop.archive.p2": "The slogan “She Gave Herself” first appears in internal communication test drafts. No evidence has been found that the phrase came from Adèle herself.",
    "shop.archive.p3": "The formula description for “Mother’s Mercy” fragrance once included marketing terms such as “sleep,” “purification,” and “low resistance.” Its naming date is close to the opening of the Reconstructed Chamber of the Mother.",
    "shop.unstable": "If everything belongs to her, why does the payment code belong to the temple?",

    "prayer.heading": "Exit Prayer Station",
    "prayer.intro": "You are about to leave the Mother Temple. Before exiting, you may write a sentence dedicated to the Mother. Your message will enter the temple’s public devotional database and may be anonymously displayed in future exhibitions.",
    "prayer.line": "“Mother Adèle, thank you for...”",
    "prayer.placeholder": "Write one sentence you are willing to leave in the archive.",
    "prayer.submit": "Submit Prayer",
    "prayer.archive.p1": "The early exit system collected visitor messages to monitor public acceptance of the Mother narrative. Message content, submission time, route deviation, and keywords could be linked and recorded.",
    "prayer.archive.p2": "Messages containing terms such as “Adèle,” “unwilling,” “restraint,” “who decided this,” “she is not a goddess,” and “she is human” were once automatically hidden. Some were not deleted, but transferred into a “narrative risk sample library.”",
    "prayer.archive.p3": "“May the Mother remember you” was not the original feedback line. The early version read: “Your information has been recorded.”",
    "prayer.unstable": "What you wrote is not a prayer. It is the next archive.",
    "prayer.empty": "Please write a prayer before submitting.",
    "prayer.normal": "Thank you for your message. Your prayer has entered the public devotional review queue. May the Mother remember you.",
    "prayer.warning": "Your prayer requires additional narrative review.",
    "prayer.classification": "Classification: Narrative Instability",
"detail.label.format": "Format",
"detail.label.players": "Player Count",
"detail.label.duration": "Duration",
"detail.label.status": "Status",
"detail.label.premise": "Premise",
"detail.label.design": "Public Design Information",
"detail.label.note": "Content Note",
"detail.label.boundary": "Public Boundary",

"detail.main.kicker": "MOTHER PROJECT",
"detail.main.subtitle": "She Was Not a Goddess: The Adèle Archive",
"detail.main.format": "Participatory archive trial / Jubensha-inspired immersive script game",
"detail.main.players": "6 players",
"detail.main.duration": "Approx. 3–4 hours, depending on adaptation",
"detail.main.status": "In development / sample materials available upon request",
"detail.main.premise": "In a future civilization, scientist Adèle Spet has been transformed into the Mother Goddess. Official history claims that she sacrificed herself willingly, while surviving archives suggest that her body, research, pain, motherhood, and death were appropriated by an institution. Six players enter an archive trial and decide whether Adèle was a saint, or a person consumed by myth.",
"detail.main.design": "This project is built around archives, testimony, institutional documents, and participatory judgment rather than conventional murder deduction. Players read contaminated historical materials, identify how official language rewrites fact, and decide whether the truth of Adèle should be revealed, corrected, or sealed again.",
"detail.main.note": "Themes include bodily autonomy, institutionalized motherhood, medical and experimental ethics, death narratives, religious-political language, memory, and contaminated testimony. This public page does not include full role materials, complete evidence text, facilitator manuals, or ending logic.",
"detail.main.boundary": "This section is a public-facing project overview only. Full scripts, role books, facilitator materials, evidence chains, and ending structures remain private development materials.",

"detail.night.kicker": "LIVE EXPERIENCE",
"detail.night.subtitle": "The Adèle Archive: Night of Silence",
"detail.night.format": "Four-player live archive experience",
"detail.night.players": "4 players",
"detail.night.duration": "Approx. 90–120 minutes",
"detail.night.status": "Branch project / in development",
"detail.night.premise": "Set on the night of Adèle’s death, this experience places four players in the roles of temple functionaries connected to the death scene. They cannot fully speak the truth, yet they must decide how the first official report will be written.",
"detail.night.design": "The project focuses on silence, revision, reporting language, and proximity to responsibility. Players are not searching for a murderer; they are handling a death scene under restricted speech, omissions, mutual suspicion, and the pressure of institutional memory.",
"detail.night.note": "Themes include a death scene, failed care, institutional silence, transferred responsibility, textual censorship, and traumatic reporting language. This public page does not reveal private character information, full report templates, or ending triggers.",
"detail.night.boundary": "This is a public overview of the branch experience. Character tracks, scene scripts, report logic, and complete endings are not publicly released.",

"detail.relic.kicker": "OBJECT-BASED EXPERIENCE",
"detail.relic.subtitle": "The Adèle Archive: The Silent Relic Keeper",
"detail.relic.format": "Object-based immersive archive reconstruction",
"detail.relic.players": "1–4 players, flexible low-pressure format",
"detail.relic.duration": "Approx. 60 minutes",
"detail.relic.status": "Companion piece / in development",
"detail.relic.premise": "Players enter a reconstructed room assembled from surviving records after Adèle’s death. On the surface, they are relic keepers; in practice, they are later archive participants judging Adèle’s life, body, research, and myth through the objects left behind.",
"detail.relic.design": "This project does not rely on high-intensity performance or loud debate. Its core experience comes from touching, sorting, reading, hesitating, and deciding whether each object should be preserved, transferred, destroyed, or taken away.",
"detail.relic.note": "Themes include relic processing, posthumous ownership, institutional archiving, evidence of motherhood, traces of children, medical records, and commodified remembrance. This public page does not reveal full object texts, sorting tables, or final player reports.",
"detail.relic.boundary": "This is a public overview only. Full object texts, sorting rules, ending logic, and facilitator materials remain private development materials.",

"detail.guide.kicker": "PUBLIC WEB SAMPLE",
"detail.guide.subtitle": "The Adèle Archive: Mother Temple Visitor Guide",
"detail.guide.format": "Interactive public worldbuilding webpage",
"detail.guide.players": "Solo browsing / public portfolio sample",
"detail.guide.duration": "Approx. 5–15 minutes",
"detail.guide.status": "Public sample page",
"detail.guide.premise": "This page is a public worldbuilding sample disguised as a sacred tourism website. Visitors browse temple exhibitions, a gift shop, a prayer system, and official guide text, while the archive annotation layer reveals cracks beneath the institution’s narrative.",
"detail.guide.design": "The page uses a two-layer textual structure. The official guide layer produces a solemn, clean, consumable Mother narrative; the archive annotation layer reveals revision, replacement, surveillance, commodification, and narrative instability.",
"detail.guide.note": "Themes include institutional propaganda, sacred tourism, language censorship, pseudo-religious exhibition, body politics, and the commodification of death. This page may be publicly browsed, but it is not a full game release.",
"detail.guide.boundary": "This webpage is designed as a public-facing worldbuilding sample. It does not include full scripts, role materials, facilitator manuals, or complete ending structures.",



"footer.title": "Writer / Interactive Narrative Designer",

"footer.bio": "Samantha Zhu is a writer and interactive narrative designer developing low-pressure, document-driven experiences influenced by Jubensha, immersive theatre, archive fiction, Gothic imagination, and feminist speculative fiction. Her work explores institutional memory, body politics, myth-making, silent testimony, and participatory judgment.",
"footer.email": "Email: samantha201223@163.com",
"footer.website": "Portfolio: samanthazhu-writes.github.io",

"footer.note.p1": "This page is a public worldbuilding sample for <em>She Was Not a Goddess: The Adèle Archive</em>.",
"footer.note.p2": "It is not a full script release and does not include player materials, facilitator manuals, complete evidence text, or complete ending structures. A short sample kit may be prepared separately for development, publishing, or collaboration conversations.",
"footer.note.p3": "This page only presents the public-facing layer, exhibition-text layer, and archive-annotation layer of the Adèle Archive universe. The full experience remains private development material.",

"footer.hidden": "Do not continue calling her Adèle after the visit ends.",
"footer.reveal": "She will hear you."
  }
};

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "cn" ? "zh-CN" : "en";
  body.classList.toggle("lang-en", lang === "en");

  document.title = i18n[lang]["page.title"];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = i18n[lang][key];

    if (value !== undefined) {
      element.innerHTML = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    const value = i18n[lang][key];

    if (value !== undefined) {
      element.setAttribute("placeholder", value);
    }
  });

  updateControlLabels();
}

function updateControlLabels() {
  langToggle.textContent = currentLang === "cn" ? "LANG: CN" : "LANG: EN";

  navToggleNotes.textContent = archiveOn ? "Archive: ON" : "Archive: OFF";
  floatingToggle.textContent = archiveOn ? "Archive Notes: ON" : "Archive Notes: OFF";

  if (heroToggleNotes) {
    heroToggleNotes.textContent = archiveOn
      ? i18n[currentLang]["hero.hideArchive"]
      : i18n[currentLang]["hero.showArchive"];
  }

  if (statusText) {
    statusText.textContent = archiveOn
      ? i18n[currentLang]["reading.archiveEnabled"]
      : i18n[currentLang]["reading.officialMode"];
  }
}

function setArchiveNotes(isOn) {
  archiveOn = isOn;
  body.classList.toggle("notes-on", archiveOn);
  updateControlLabels();
}

function toggleArchiveNotes() {
  setArchiveNotes(!archiveOn);
}

function generateRecordId(prefix) {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${randomLetter}${randomNumber}`;
}

langToggle.addEventListener("click", () => {
  const nextLang = currentLang === "cn" ? "en" : "cn";
  applyLanguage(nextLang);
});

floatingToggle.addEventListener("click", toggleArchiveNotes);
navToggleNotes.addEventListener("click", toggleArchiveNotes);
heroToggleNotes.addEventListener("click", toggleArchiveNotes);

officialOnly.addEventListener("click", () => {
  setArchiveNotes(false);
});

modeOnButtons.forEach((button) => {
  button.addEventListener("click", () => setArchiveNotes(true));
});

modeOffButtons.forEach((button) => {
  button.addEventListener("click", () => setArchiveNotes(false));
});

prayerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = prayerInput.value.trim();
  const sensitiveWords = [
    "阿黛勒",
    "不愿意",
    "约束",
    "谁决定",
    "她不是神",
    "她是人",
    "不是恩典",
    "强制",
    "实验",
    "Adèle",
    "Adele",
    "unwilling",
    "restraint",
    "who decided",
    "not a goddess",
    "she is human",
    "experiment"
  ];

  prayerResult.classList.remove("hidden");

  if (!value) {
    prayerResult.classList.remove("warning");
    prayerResult.innerHTML = i18n[currentLang]["prayer.empty"];
    return;
  }

  const lowerValue = value.toLowerCase();
  const needsReview = sensitiveWords.some((word) => lowerValue.includes(word.toLowerCase()));
  prayerResult.classList.toggle("warning", needsReview);

  if (needsReview) {
    const recordId = generateRecordId("RISK");

    prayerResult.innerHTML = `
      ${i18n[currentLang]["prayer.warning"]}
      <span class="record-id">Record ID: ${recordId}</span>
      <span class="record-id">${i18n[currentLang]["prayer.classification"]}</span>
    `;
  } else {
    const recordId = generateRecordId("PRAYER");

    prayerResult.innerHTML = `
      ${i18n[currentLang]["prayer.normal"]}
      <span class="record-id">Record ID: ${recordId}</span>
    `;
  }
});

hiddenEnding.addEventListener("click", () => {
  hiddenReveal.classList.toggle("hidden");
});

applyLanguage("cn");
setArchiveNotes(false);