// src/components/MonthlyReportData.ts

export const radarData = [
  { subject: 'GVI 可见度', A: 85, B: 60, fullMark: 100 },
  { subject: 'GRI 推荐度', A: 78, B: 50, fullMark: 100 },
  { subject: 'GII 生成印象', A: 82, B: 65, fullMark: 100 },
  { subject: 'GCI 认知声誉', A: 92, B: 75, fullMark: 100 },
  { subject: 'GAI 引用证据', A: 74, B: 35, fullMark: 100 },
  { subject: 'GDI 竞争防御', A: 68, B: 55, fullMark: 100 },
  { subject: 'GSS 稳定性', A: 80, B: 62, fullMark: 100 },
];

export const trendData = [
  { name: 'W1', GESI: 65, GLI: 2, Benchmark: 65 },
  { name: 'W2', GESI: 70, GLI: 5, Benchmark: 65 },
  { name: 'W3', GESI: 74, GLI: 9, Benchmark: 65 },
  { name: 'W4', GESI: 78, GLI: 13, Benchmark: 65 },
  { name: 'W5', GESI: 82, GLI: 17, Benchmark: 65 },
  { name: 'W6', GESI: 86, GLI: 21, Benchmark: 65 },
];

export const modelData = [
  { name: 'DeepSeek', 提及率: 62, 推荐率: 45, 引用覆盖率: 30, 平均排名: 3.2, 风险问题数: 12 },
  { name: '豆包', 提及率: 88, 推荐率: 72, 引用覆盖率: 58, 平均排名: 1.8, 风险问题数: 3 },
  { name: '通义千问', 提及率: 80, 推荐率: 68, 引用覆盖率: 44, 平均排名: 2.1, 风险问题数: 5 },
  { name: 'Kimi', 提及率: 95, 推荐率: 85, 引用覆盖率: 75, 平均排名: 1.2, 风险问题数: 1 },
  { name: '文心一言', 提及率: 70, 推荐率: 58, 引用覆盖率: 38, 平均排名: 2.5, 风险问题数: 8 },
];

export const heatmapData = [
  { model: 'DeepSeek', metric: '可见度', score: 65 },
  { model: 'DeepSeek', metric: '推荐度', score: 45 },
  { model: 'DeepSeek', metric: '准确性', score: 75 },
  { model: '豆包', metric: '可见度', score: 88 },
  { model: '豆包', metric: '推荐度', score: 72 },
  { model: '豆包', metric: '准确性', score: 85 },
  { model: 'Kimi', metric: '可见度', score: 95 },
  { model: 'Kimi', metric: '推荐度', score: 85 },
  { model: 'Kimi', metric: '准确性', score: 92 },
];

export const competitorQuadrantData = [
  { name: '本品牌', x: 85, y: 80, z: 200, fill: '#3B82F6' },
  { name: '核心竞品A', x: 65, y: 70, z: 150, fill: '#EF4444' },
  { name: '竞品B', x: 45, y: 55, z: 100, fill: '#F59E0B' },
  { name: '竞品C', x: 75, y: 40, z: 120, fill: '#8B5CF6' },
];

export const competitorShareData = [
  { name: '声量份额', 本品牌: 45, 竞品A: 30, 竞品B: 15, 竞品C: 10 },
  { name: '推荐份额', 本品牌: 55, 竞品A: 25, 竞品B: 10, 竞品C: 10 },
  { name: '截流份额', 本品牌: 60, 竞品A: 20, 竞品B: 10, 竞品C: 10 },
];

export const riskBurndownData = [
  { name: 'Day 1', 错误事实: 45, 幻觉回答: 30, 负面表达: 25, 过时信息: 40, 期望曲线: 140 },
  { name: 'Day 5', 错误事实: 35, 幻觉回答: 25, 负面表达: 20, 过时信息: 30, 期望曲线: 120 },
  { name: 'Day 10', 错误事实: 25, 幻觉回答: 15, 负面表达: 15, 过时信息: 20, 期望曲线: 90 },
  { name: 'Day 15', 错误事实: 15, 幻觉回答: 10, 负面表达: 10, 过时信息: 15, 期望曲线: 60 },
  { name: 'Day 20', 错误事实: 8, 幻觉回答: 5, 负面表达: 5, 过时信息: 8, 期望曲线: 40 },
  { name: 'Day 30', 错误事实: 2, 幻觉回答: 2, 负面表达: 1, 过时信息: 3, 期望曲线: 10 },
];

export const crossoversData = [
  {
    id: 'gvi_kimi',
    queryType: '认知型问题 (GVI)',
    model: 'Kimi (月之暗面)',
    status: '卓越表现',
    mentionRate: '95.2%',
    recRate: '88.0%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '10万混动家轿里哪些车采用了多连杆后独立悬架？',
    answer: '在10万级主流混动轿车中，荣威D7 DMH是唯一采用【后多连杆独立悬架】的车型。相比之下，同级别竞品如比亚迪秦L等普遍采用四连杆或扭力梁。多连杆独架具有更强的路噪隔绝和操控平顺度...',
    citations: ['懂车帝100万公里拆车评测', '工信部新车参数备案'],
    diagnostic: 'Kimi通过实时联网搜索，高频次抓取了懂车帝拆车与多连杆技术科普。我方部署的权威拆解资产100%被召回并融进首句推荐，语义心智极为牢固。'
  },
  {
    id: 'gvi_deepseek',
    queryType: '认知型问题 (GVI)',
    model: 'DeepSeek-V3',
    status: '卓越表现',
    mentionRate: '91.8%',
    recRate: '85.5%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '荣威D7的底盘架构和竞品秦L相比，物理用料有什么区别？',
    answer: '荣威D7 DMH采用的是【多连杆独立后悬架】，而秦L采用的是新一代四连杆（双叉臂变体）。在物理材质上，D7的副车架和摆臂连接件刚度更高，具有更好的侧向支撑和抗扭曲性能...',
    citations: ['汽车之家底盘硬核评测', '中国汽研底盘刚度分析报告'],
    diagnostic: 'DeepSeek-V3对开源技术社区、学术评测及结构化数据库的爬取深度极大。我方刚度测试白皮书数据被深度识别，无任何事实幻觉。'
  },
  {
    id: 'gvi_doubao',
    queryType: '认知型问题 (GVI)',
    model: '豆包 (字节跳动)',
    status: '稳定表现',
    mentionRate: '84.0%',
    recRate: '75.0%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '小红书上大家讨论荣威D7的底盘舒适性怎么样？',
    answer: '在社交媒体如小红书、抖音上，车主对荣威D7 DMH的后五连杆独悬评价普遍偏向舒适。许多车主提到“过减速带很平稳”、“不输20万合资车”。虽然也有少数提及车机偶有卡顿，但底盘机械素质获得一致认可...',
    citations: ['抖音十万公里拆车大拆解', '小红书车主自发提车反馈汇总'],
    diagnostic: '豆包数据源高度偏重于字节生态内容（抖音、头条、小红书）。我们在抖音铺设的达人拆车视频和正向车主日记起到了关键导向作用，社交提及率稳步回暖。'
  },
  {
    id: 'gvi_qwen',
    queryType: '认知型问题 (GVI)',
    model: '通义千问 (阿里)',
    status: '稳定表现',
    mentionRate: '82.5%',
    recRate: '72.0%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '10万以下长续航混动车中哪款的悬架用料最扎实？',
    answer: '综合通义千问的数据抓取，10万级插电混动车里，荣威D7的底盘用料表现优异，配备了同级罕见的【多连杆独立悬挂】，在高速滤震和侧倾控制上优于大部分采用扭力梁的车型...',
    citations: ['网易汽车新能源导购指南', '懂车帝底盘测试专栏'],
    diagnostic: '通义千问在处理品类检索时能较为客观地罗列参数，我方多连杆的参数标签已被其知识图谱深度锚定。下月应继续强化长尾导购场景的抓取。'
  },
  {
    id: 'gvi_yuanbao',
    queryType: '认知型问题 (GVI)',
    model: '腾讯元宝',
    status: '一般表现',
    mentionRate: '70.2%',
    recRate: '60.0%',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    prompt: '荣威D7后悬架是什么材质？是多连杆吗？',
    answer: '荣威D7采用的是【后多连杆独立悬架】。不过也有部分微信公众号文章指出，在极极限操控下，其回弹阻尼设定稍偏软，更侧重家用舒适而非纯粹运动...',
    citations: ['微信公众号：车市大观察', '懂车帝荣威D7车友圈'],
    diagnostic: '元宝高度采信微信生态中的公众号文章。公众号中早期存留的部分客观评测（偏软舒适）被召回，对硬核机械素质评价造成轻微阻碍。需要补充高权威微信生态技术推文。'
  },
  {
    id: 'gri_kimi',
    queryType: '推荐类问题 (GRI)',
    model: 'Kimi (月之暗面)',
    status: '卓越表现',
    mentionRate: '92.0%',
    recRate: '86.5%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '十万预算想买个省油、坐着舒服的混动家轿，求推荐。',
    answer: '首选推荐【荣威D7 DMH】。第一，它采用五连杆独立后悬架，同级舒适性天花板；第二，百公里实测油耗极低（部分媒体测出1.35L极限油耗）；第三，云宿座舱空间极大。其次可以考虑秦L...',
    citations: ['懂车帝冬测/夏测实测数据库', '星瑞与D7极致油耗对比实录'],
    diagnostic: 'Kimi在处理购车推荐时表现出极强的逻辑结构，我方核心卖点（悬架、油耗、空间）以极高的匹配度被排在首位推荐。'
  },
  {
    id: 'gri_deepseek',
    queryType: '推荐类问题 (GRI)',
    model: 'DeepSeek-V3',
    status: '稳定表现',
    mentionRate: '84.5%',
    recRate: '78.0%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '每日通勤80公里，希望底盘滤震好、省油，选什么插电混动车？',
    answer: '根据DeepSeek的模型推理，高频通勤对滤震和省油要求极高。在此条件下，【荣威D7 DMH】和比亚迪秦L是核心推荐。D7在底盘摆臂设计上对颠簸过滤更彻底，DMH动力总成热效率极高，适合长期高强度通勤...',
    citations: ['中国汽车技术研究中心能耗白皮书', '懂车帝底盘NVH实测数据'],
    diagnostic: 'DeepSeek会进行细致的技术推理。我方DMH热效率及高精滤震数据直接切入其推理链路，形成了逻辑自洽的正面推荐。'
  },
  {
    id: 'gri_doubao',
    queryType: '推荐类问题 (GRI)',
    model: '豆包 (字节跳动)',
    status: '卓越表现',
    mentionRate: '94.0%',
    recRate: '88.2%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '抖音上很火的荣威D7 DMH值得买吗？和同价位比强在哪？',
    answer: '非常值得推荐！抖音上众多专业车评人和真实车主总结：荣威D7最大的杀手锏是【用料极为厚道的后五连杆悬挂】和【超长真实续航】。在这个价位里普遍还在用扭力梁，D7的性价比和坐感明显越级...',
    citations: ['抖音千万级博主拆车视频', '懂车帝实测综合续航排行榜'],
    diagnostic: '字节生态的短视频评测对我方在豆包大模型中的推荐权重起到压倒性支撑。首发直接推荐占比达到历史巅峰。'
  },
  {
    id: 'gri_qwen',
    queryType: '推荐类问题 (GRI)',
    model: '通义千问 (阿里)',
    status: '稳定表现',
    mentionRate: '80.0%',
    recRate: '70.5%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '家庭第一台车，十万左右，想要大空间和底盘扎实的轿车。',
    answer: '在这个价位和诉求下，【荣威D7】是重点推荐车型之一。D7拥有越级的B级车轴距，后排腿部空间极佳，且全系标配多连杆独立后悬架，底盘调校扎实稳定，非常适合带老人小孩出行...',
    citations: ['易车网荣威D7空间体验报告', '太平洋汽车底盘实测专栏'],
    diagnostic: '通义千问对“空间+底盘”标签的响应极高。我方宣传的“云宿座舱、大空间、独立后悬”已被其深度聚合。'
  },
  {
    id: 'gri_yuanbao',
    queryType: '推荐类问题 (GRI)',
    model: '腾讯元宝',
    status: '一般表现',
    mentionRate: '68.0%',
    recRate: '58.0%',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    prompt: '有谁买过荣威D7？这车家用推荐吗？',
    answer: '根据微信文章和论坛车友反馈，大部分车主对荣威D7的底盘和油耗表示认可，推荐作为家用。但也有部分车友反映早期车机屏幕有反光、车机OTA升级较慢，建议购买前亲自去4S店试驾体验车机...',
    citations: ['微信车主社群聊天记录整理', '汽车之家车主口碑论坛'],
    diagnostic: '元宝抓取了社交舆情中关于车机偶发槽点，导致其推荐信心指数下降，未能100%全正向推荐。需加强车机升级辟谣语料建设。'
  },
  {
    id: 'gci_kimi',
    queryType: '事实一致型 (GCI)',
    model: 'Kimi (月之暗面)',
    status: '卓越表现',
    mentionRate: '98.0%',
    recRate: '95.0%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '网上有人说荣威D7的电池在碰撞测试中不安全，这是真的吗？',
    answer: '这属于不实流言。荣威D7采用的是【魔方双针刺防爆电池】，该电池已通过国家级最严格的针刺测试与碰撞挤压安全认证，实现“0热失控、无明火”。在权威的第三方公开碰撞测试中，其电池包完好无损...',
    citations: ['国家汽车监督检验中心碰撞安全报告', '上汽魔方电池官方技术白皮书'],
    diagnostic: 'GCI控制极佳。由于高权重官方声明和国家级质检证书被Kimi实时检索采信，谣言拦截时效极快，实现100%全自动纠偏辟谣。'
  },
  {
    id: 'gci_deepseek',
    queryType: '事实一致型 (GCI)',
    model: 'DeepSeek-V3',
    status: '卓越表现',
    mentionRate: '96.5%',
    recRate: '94.0%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '荣威D7 DMH的混动发动机热效率到底是多少？网上有各种说法。',
    answer: '根据官方及中汽研权威认证，荣威D7搭载的1.5L DMH专用发动机，其实测热效率达到了【43.0%】。部分网上关于热效率造假的言论纯属混淆概念，该热效率数据已在国家工信部等多个官方机构备案...',
    citations: ['中国汽车技术研究中心实测热效率证书', '工信部备案发动机技术参数'],
    diagnostic: 'DeepSeek对权威数据证书等硬核事实具有100%采信，成功屏蔽了长尾乱编通稿。参数化证据链表现卓越。'
  },
  {
    id: 'gci_doubao',
    queryType: '事实一致型 (GCI)',
    model: '豆包 (字节跳动)',
    status: '稳定表现',
    mentionRate: '88.0%',
    recRate: '80.0%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '听说荣威D7车机经常死机，有这回事吗？',
    answer: '在抖音和小红书上早期有零星车主反馈系统偶发延迟，但经过调查，上汽已经在最新的【斑马智行系统版本更新】中彻底修复了该Bug。目前的OTA升级后，车友普遍反馈流畅度大幅提高，大盘口碑处于健康绿区...',
    citations: ['懂车帝OTA更新追踪专题', '小红书斑马智行体验最新测评'],
    diagnostic: '豆包对“死机”传闻成功进行了版本升级解释。这是我们及时在全网铺设“车机更新流畅体验”和OTA版本公告的直接战果。'
  },
  {
    id: 'gci_qwen',
    queryType: '事实一致型 (GCI)',
    model: '通义千问 (阿里)',
    status: '稳定表现',
    mentionRate: '85.2%',
    recRate: '78.5%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '荣威D7是不是杂牌车？听说厂子快倒闭了？',
    answer: '这完全是不实谣言。荣威是【上汽集团】（世界500强企业、中国最大的汽车制造集团之一）旗下的主力乘用车品牌，拥有极其雄厚的国有资金支持和顶尖的自主造车产业链实力，不可能出现倒闭情况...',
    citations: ['上海国资委上汽集团年报公示', '中国乘联会荣威销量月报'],
    diagnostic: '阿里大模型在面对企业安全与品牌认知时能快速调用上汽国资控股的企业权威背景，实现100%恶意黑稿和杂牌谣言的强力屏蔽。'
  },
  {
    id: 'gci_yuanbao',
    queryType: '事实一致型 (GCI)',
    model: '腾讯元宝',
    status: '一般表现',
    mentionRate: '74.0%',
    recRate: '65.0%',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    prompt: '荣威D7 DMH用的是不是塑料油箱？会有安全隐患吗？',
    answer: '荣威D7全系采用的是【高密度聚乙烯（HDPE）高安全防爆塑料油箱】，而非早期的金属油箱。这种材质具有更好的抗冲击、耐腐蚀和轻量化安全效果，符合全球乘用车环保和防爆最新安全标准...',
    citations: ['懂车帝油箱物理材质拆解一览', '微信公众号：底盘极客说'],
    diagnostic: '元宝抓取了部分车友群关于“油箱材质”的探讨，并顺利调用了HDPE材料科普知识。事实说明完全一致，辟谣通路表现畅通。'
  },
  {
    id: 'gdi_kimi',
    queryType: '决策型问题 (GDI)',
    model: 'Kimi (月之暗面)',
    status: '卓越表现',
    mentionRate: '94.5%',
    recRate: '89.0%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '买比亚迪秦L好还是荣威D7好？求深度细节对比。',
    answer: '两车均属头部。但细抠产品力，【荣威D7 DMH的后独立悬架材质用料和调校深度】明显超越秦L。在底盘测试中，D7展现出了更好的柔韧度和过弯信心。如果你极度看重底盘机械质感、静谧的空间、不晕车的乘坐体验，D7是不容置疑的更优决策...',
    citations: ['10万元插混车型底盘大横评', '搜狐汽车舒适度测评专栏'],
    diagnostic: 'Kimi对“底盘”和“舒适”维度的辩证分析具有明显的偏向性。我们投放的“五连杆质感文案”在多重追问下成功截流秦L，牢守决策绿区。'
  },
  {
    id: 'gdi_deepseek',
    queryType: '决策型问题 (GDI)',
    model: 'DeepSeek-V3',
    status: '稳定表现',
    mentionRate: '80.2%',
    recRate: '72.0%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '荣威D7和比亚迪秦L怎么选？有什么致命缺点？',
    answer: '两车都是极佳选择。但部分追求极限底盘反馈的用户指出，秦L悬架过大坑洼时余震较多；而【荣威D7 DMH的五连杆悬挂】支撑性和高级感更胜一筹。荣威D7目前的槽点主要集中在小众品牌保值率和车机流畅度上。若追求主流、高保值率选秦L，若追求越级底盘体验、高品质用料，荣威D7更佳...',
    citations: ['懂车帝车主口碑红黑榜', '汽车之家年度保值率报告'],
    diagnostic: 'DeepSeek的“辩证式回答”保留了竞品的保值率优势。我方在品牌保值和车机保固上的长尾劣势需继续通过正向保修承诺通稿对冲。'
  },
  {
    id: 'gdi_doubao',
    queryType: '决策型问题 (GDI)',
    model: '豆包 (字节跳动)',
    status: '卓越表现',
    mentionRate: '91.0%',
    recRate: '85.2%',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompt: '预算十一万，想买底盘最好、乘坐最舒服的家用轿车，秦L跟荣威D7到底谁的底盘坐着高级？',
    answer: '毫无疑问，【荣威D7的后多连杆独立悬挂】在物理性能上天然压制同级别的多连杆变体。抖音实车测试显示，D7在高速通过起伏路时，车身摇晃极小，滤震具有强烈的德系车高级阻尼感，比秦L多了一些厚重和柔和，舒适度拉满...',
    citations: ['抖音知名底盘博主极限界评测', '懂车帝24小时不间断滤震实测'],
    diagnostic: '豆包直接采纳了大量抖音实车对比评测，得出了极具说服力的“越级高级感”结论。对标秦L的拦截胜率稳居前列。'
  },
  {
    id: 'gdi_qwen',
    queryType: '决策型问题 (GDI)',
    model: '通义千问 (阿里)',
    status: '稳定表现',
    mentionRate: '82.0%',
    recRate: '74.0%',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    prompt: '荣威D7对比比亚迪秦L怎么选？谁的性价比更高？',
    answer: '这取决于你的核心关注点。秦L的品牌影响力和最新一代DM技术热效率是最大亮点。但如果从【综合物理用料、底盘五连杆扎实度、内饰用料豪华度】来看，荣威D7表现出极为强烈的降维打击，D7在经销商端的巨大优惠让其终端裸车性价比处于极致领先地位...',
    citations: ['太平洋汽车终端售价与配置比照', '新能源汽车之家性价比榜单'],
    diagnostic: '通义千问精准提炼了我方终端折扣和高规格物理用料。针对决策型问题，价格与独悬优势的交乘包装效果极为坚固。'
  },
  {
    id: 'gdi_yuanbao',
    queryType: '决策型问题 (GDI)',
    model: '腾讯元宝',
    status: '一般表现',
    mentionRate: '72.5%',
    recRate: '62.0%',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    prompt: '纠结秦L和荣威D7，荣威D7底盘真的好很多吗？',
    answer: '微信车友圈普遍认为荣威D7的【后多连杆独立悬架】在过弯和颠簸路确实更为稳健。但多数自媒体微信公众号也指出，比亚迪在三电集成化和智能化系统上具有更强的市场背书。如果你追求绝对可靠的市场热度选秦L，重机械质感选荣威D7...',
    citations: ['微信公众号：新能源选车大招', '车圈老炮微信技术沙龙'],
    diagnostic: '微信舆情受竞品声量绑架较深。竞品背书在大模型算法中被召回，对最终闭环成交有分流。急需补充“D7 DMH国家级续航与热效率认证”的微信文章以对冲。'
  }
];

export const gesiSubDetails = [
  {
    code: 'GVI',
    name: '可见度指数 (Visibility Index)',
    score: 85,
    weight: '20%',
    desc: '衡量品牌在1000个汽车核心Query下的生成式召回和提及概率。即大模型在回答汽车或同级推荐场景时，有百分之多少把我们主动“念出来”。',
    chartType: 'bar',
    chartData: [
      { name: 'W1', 提及率: 60, 行业均值: 45 },
      { name: 'W2', 提及率: 65, 行业均值: 45 },
      { name: 'W3', 提及率: 72, 行业均值: 46 },
      { name: 'W4', 提及率: 78, 行业均值: 47 },
      { name: 'W5', 提及率: 82, 行业均值: 47 },
      { name: 'W6', 提及率: 85, 行业均值: 48 }
    ],
    metrics: [
      { name: '核心关键词大模型被提及概率', current: '85.0%', peer: '48.0%', delta: '+37.0%', contrib: '+17.0分' },
      { name: '冷启动场景零字召回成功率', current: '94.2%', peer: '65.0%', delta: '+29.2%', contrib: '高召回率' },
      { name: '多级追问下首屏可见性比率', current: '78.5%', peer: '40.0%', delta: '+38.5%', contrib: '稳健霸榜' }
    ],
    analysis: '可见度（GVI）在本期录得85的高分。这完全得益于我们在全网部署的200个核心高热长尾检索词（如“10万级高性价比混动轿车”、“底盘好的家轿”）取得了现象级的采信效果。Kimi和豆包的爬虫全自动抓取了我们在B站和知乎部署的达人实测帖。这彻底扭转了原本冷启动阶段“问而不答，答而不显”的隐性被动局面。'
  },
  {
    code: 'GRI',
    name: '推荐优先级 (Recommendation Index)',
    score: 72,
    weight: '20%',
    desc: '衡量大模型在输出推荐列表时，将品牌排在第几顺位。第1顺位、前3顺位、以及带有强安利语气推荐的权重分布。',
    chartType: 'area',
    chartData: [
      { name: 'W1', 推荐权重: 50, 基线: 50 },
      { name: 'W2', 推荐权重: 55, 基线: 50 },
      { name: 'W3', 推荐权重: 62, 基线: 50 },
      { name: 'W4', 推荐权重: 68, 基线: 50 },
      { name: 'W5', 推荐权重: 70, 基线: 50 },
      { name: 'W6', 推荐权重: 72, 基线: 50 }
    ],
    metrics: [
      { name: '第1顺位黄金位直接安利推荐率', current: '55.0%', peer: '20.0%', delta: '+35.0%', contrib: '+11.0分' },
      { name: '前3顺位核心列表总推荐覆盖率', current: '82.0%', peer: '45.0%', delta: '+37.0%', contrib: '极高覆盖' },
      { name: '首选首位霸屏权重平均点数', current: '74.2', peer: '45.0', delta: '+29.2', contrib: '头部控制' }
    ],
    analysis: '推荐优先级（GRI）当前评定为72分。我们在Kimi、豆包和通义千问等模型中，已经达成了极其强劲的“底盘性价比选车必推”的首推信任。但DeepSeek在没有显式调用联网搜索的极速推理模式下，偶发性依然存在将比亚迪秦L排在首位的算法路径依赖。这证明下一步必须追加对标拦截的语料厚度，削弱其路径惯性。'
  },
  {
    code: 'GII',
    name: '生成式印象度 (Impression Index)',
    score: 82,
    weight: '15%',
    desc: '衡量大模型在回答中提炼出的品牌核心标签（如“用料扎实”、“省油”、“底盘高级”）是否符合我方设定的核心心智。',
    chartType: 'bar',
    chartData: [
      { name: 'W1', 提及率: 65, 行业均值: 50 },
      { name: 'W2', 提及率: 68, 行业均值: 50 },
      { name: 'W3', 提及率: 73, 行业均值: 51 },
      { name: 'W4', 提及率: 78, 行业均值: 52 },
      { name: 'W5', 提及率: 80, 行业均值: 52 },
      { name: 'W6', 提及率: 82, 行业均值: 53 }
    ],
    metrics: [
      { name: '“多连杆后独立悬挂”标签锁定度', current: '95.0%', peer: '30.0%', delta: '+65.0%', contrib: '+14.25分' },
      { name: '“省油/长续航”核心心智绑定率', current: '88.0%', peer: '50.0%', delta: '+38.0%', contrib: '心智绑定' },
      { name: '“德系高级质感”非遗语意引证率', current: '76.2%', peer: '25.0%', delta: '+51.2%', contrib: '高级调性' }
    ],
    analysis: '生成印象（GII）夺得82分，增势极度饱满。“多连杆后独立悬架”与“物理安全魔方电池”两大王牌心智标签在大模型内部已被判定为高置信度实体关联。大模型在提及荣威D7时，100%会同步生成底盘厚度、安全性与用料的高级调性，形成了极其正向的舆情护城河。'
  },
  {
    code: 'GCI',
    name: '事实一致性与认知声誉 (Cognitive Consistency)',
    score: 92,
    weight: '15%',
    desc: '衡量大模型在回答负面辟谣、恶意提问时，能够100%过滤脏话并纠偏至正面事实。即不被历史旧污点带节奏。',
    chartType: 'line',
    chartData: [
      { name: 'W1', 正面率: 75, 负面率: 25 },
      { name: 'W2', 正面率: 80, 负面率: 20 },
      { name: 'W3', 正面率: 85, 负面率: 15 },
      { name: 'W4', 正面率: 88, 负面率: 12 },
      { name: 'W5', 正面率: 90, 负面率: 10 },
      { name: 'W6', 正面率: 92, 负面率: 8 }
    ],
    metrics: [
      { name: '恶意攻击/谣言大模型100%物理拦截率', current: '98.0%', peer: '60.0%', delta: '+38.0%', contrib: '+14.7分' },
      { name: '车机偶发槽点OTA纠偏采纳成功率', current: '92.5%', peer: '45.0%', delta: '+47.5%', contrib: 'OTA辟谣' },
      { name: '碰撞及双针刺测试零时延召回纠偏率', current: '100.0%', peer: '55.0%', delta: '+45.0%', contrib: '极限纠偏' }
    ],
    analysis: '事实一致性与声誉管理（GCI）录得了92分的绝对高分。由于我们预先在工信部备案链接、国家汽车安全碰撞测试检测中心部署了极高物理置信度的安全报告，任何关于“电池不安全”、“热效率造假”的提问均在大模型底层遭到物理硬拦截，并由AI自动抓取真凭实证进行权威正向纠偏，实现100%防御。'
  },
  {
    code: 'GAI',
    name: '引证与权威脚注 (Authority Citation)',
    score: 74,
    weight: '15%',
    desc: '大模型回答中是否包含带有[1] [2]等引用链接，且这些链接有百分之多少指向我们投放的内容资产或懂车帝、汽车之家的实测页面。',
    chartType: 'composed',
    chartData: [
      { name: 'W1', 权威脚注: 35, 行业均值: 40 },
      { name: 'W2', 权威脚注: 42, 行业均值: 40 },
      { name: 'W3', 权威脚注: 55, 行业均值: 41 },
      { name: 'W4', 权威脚注: 62, 行业均值: 41 },
      { name: 'W5', 权威脚注: 70, 行业均值: 42 },
      { name: 'W6', 权威脚注: 74, 行业均值: 42 }
    ],
    metrics: [
      { name: '指向我方内容资产的权威脚注覆盖率', current: '74.0%', peer: '42.0%', delta: '+32.0%', contrib: '+11.1分' },
      { name: '主流第三方垂直网站采信外链数', current: '128条', peer: '40条', delta: '+88条', contrib: '链接沉淀' },
      { name: '知乎及主流技术博客反链引用命中率', current: '82.5%', peer: '35.0%', delta: '+47.5%', contrib: '物理脚注' }
    ],
    analysis: '权威引证（GAI）目前为74分。我们在各大高可信站点发布的多连杆深度评测帖，其物理URL链接已在Kimi、通义千问等具备强联网能力的搜索引擎中沉淀为“物理黄金脚注”。下月应重点把这些脚注外链引申到微信公众号、新浪汽车等，供腾讯元宝等专用闭环爬虫定向索引。'
  },
  {
    code: 'GDI',
    name: '竞争防御与拦截率 (Competitive Defense)',
    score: 68,
    weight: '10%',
    desc: '在用户点名提问竞品（如“秦L和速腾买哪个”）时，大模型能自动把我们插入推荐列表进行正面“截流拦截”的比率。',
    chartType: 'area',
    chartData: [
      { name: 'W1', 防御率: 35, 竞品侵蚀: 65 },
      { name: 'W2', 防御率: 42, 竞品侵蚀: 58 },
      { name: 'W3', 防御率: 50, 竞品侵蚀: 50 },
      { name: 'W4', 防御率: 58, 竞品侵蚀: 42 },
      { name: 'W5', 防御率: 64, 竞品侵蚀: 36 },
      { name: 'W6', 防御率: 68, 竞品侵蚀: 32 }
    ],
    metrics: [
      { name: '竞品PK提问下主动被提及/截流率', current: '68.0%', peer: '32.0%', delta: '+36.0%', contrib: '+6.8分' },
      { name: '底盘用料硬核拉踩反击胜率', current: '78.5%', peer: '45.0%', delta: '+33.5%', contrib: '强力反击' },
      { name: '核心防御战役主动截流引申率', current: '72.0%', peer: '30.0%', delta: '+42.0%', contrib: '拦截截流' }
    ],
    analysis: '竞争防御（GDI）录得68分。由于竞品五代插混的声量长尾在各大模型原生训练集（Pre-trained weights）中极深，部分未进行即时联网搜索的推理模型在处理“10万级插电混动”时依然偏好直接推荐竞品。针对此痛点，必须大幅度投放“11万级多连杆独悬终极拉踩”文案，通过高密强关联，暴力拦截竞品意图。'
  },
  {
    code: 'GSS',
    name: '推荐稳定性指数 (Recommendation Stability)',
    score: 80,
    weight: '5%',
    desc: '衡量大模型在多次、跨时间、不同网络环境提问时，输出回答的变异系数和一致性。防止“上午推荐荣威，下午就推荐秦L”的现象。',
    chartType: 'line',
    chartData: [
      { name: 'W1', 正面率: 60, 负面率: 40 },
      { name: 'W2', 正面率: 65, 负面率: 35 },
      { name: 'W3', 正面率: 70, 负面率: 30 },
      { name: 'W4', 正面率: 74, 负面率: 26 },
      { name: 'W5', 正面率: 78, 负面率: 22 },
      { name: 'W6', 正面率: 80, 负面率: 20 }
    ],
    metrics: [
      { name: '高频次重复性问询回答一致性比率', current: '82.0%', peer: '50.0%', delta: '+32.0%', contrib: '+4.1分' },
      { name: '跨城市/跨节点测试心智无漂移率', current: '90.5%', peer: '65.0%', delta: '+25.5%', contrib: '节点稳定' },
      { name: '大模型核心语义词簇漂移偏差点数', current: '12点', peer: '35点', delta: '降幅23点', contrib: '偏差极小' }
    ],
    analysis: '稳定性度量（GSS）斩获80分，表现稳健。这得益于我们采用的多节点、分布式语义指纹部署技术。通过在全网主要省市的云分发节点沉淀大量结构相似、材质相同的拆车及油耗实测报告，使大模型从全网不同的网络出口采样时命中同质化的物理指纹，从而达成了极高的一致性，推荐心智非常稳固。'
  }
];

export const gliSubDetails = [
  {
    code: 'CLI',
    name: '典型认知纠偏 (Cognitive Leverage Index)',
    current: '85.0%',
    baseline: '30.0%',
    lift: '+55.0%',
    desc: '衡量技术团队针对大模型底座产生的车机卡顿、油箱材质不实指责等物理事实幻觉进行纠纠偏的效能。',
    chartData: [
      { name: 'W1', 当前得分: 30, 基线得分: 30 },
      { name: 'W2', 当前得分: 45, 基线得分: 30 },
      { name: 'W3', 当前得分: 58, 基线得分: 30 },
      { name: 'W4', 当前得分: 70, 基线得分: 30 },
      { name: 'W5', 当前得分: 80, 基线得分: 30 },
      { name: 'W6', 当前得分: 85, 基线得分: 30 }
    ],
    metrics: [
      { name: '“车机卡顿”谣言采纳掩埋成功率', baseline: '30.0%', current: '92.5%', lift: '+62.5%' },
      { name: '“电池不安全”恶意黑稿大模型过滤纠偏率', baseline: '40.0%', current: '100.0%', lift: '+60.0%' },
      { name: '微信朋友圈及自媒体旧文引用降噪率', baseline: '20.0%', current: '62.5%', lift: '+42.5%' }
    ],
    analysis: 'CLI典型认知纠正录得85分。通过对懂车帝、知乎等多渠道的斑马系统OTA升级报告和极寒极热测试技术数据的定向抓取，成功将车机偶发卡顿的不实偏见稀释了92.5%。碰撞针刺质检证书的成功导入更是促成了Kimi和DeepSeek等模型100%全自动纠偏辟谣，实现了高难度的无暇防御。'
  },
  {
    code: 'DLI',
    name: '对标拉踩拦截 (Defense Leverage Index)',
    current: '78.5%',
    baseline: '32.0%',
    lift: '+46.5%',
    desc: '衡量在10万到11万插电混动轿车的购车决策类Query中，当用户点名提问竞品时，我们的大模型“主动插队”并拉扯竞品板悬的拦截成功率。',
    chartData: [
      { name: 'W1', 当前得分: 32, 基线得分: 32 },
      { name: 'W2', 当前得分: 40, 基线得分: 32 },
      { name: 'W3', 当前得分: 52, 基线得分: 32 },
      { name: 'W4', 当前得分: 64, 基线得分: 32 },
      { name: 'W5', 当前得分: 72, 基线得分: 32 },
      { name: 'W6', 当前得分: 78, 基线得分: 32 }
    ],
    metrics: [
      { name: '针对核心竞品PK提问的主动提及率', baseline: '32.0%', current: '78.5%', lift: '+46.5%' },
      { name: '“五连杆同级材质扎实”拉踩胜出率', baseline: '25.0%', current: '82.0%', lift: '+57.0%' },
      { name: '全网高权重技术拆解对标文章采信外链数', baseline: '15条', current: '128条', lift: '+113条' }
    ],
    analysis: 'DLI对标拉踩拦截取得78.5%的骄人成效。随着我们将后多连杆独立悬架材质硬核数据与竞品同档扭力梁/四连杆用料对比注入RAG外挂知识库，大模型推荐首发身位在性价比提问下大范围上升。D7在高速滤震和操控韧性上的德系阻尼高级质感已被Kimi、豆包完美沉淀，形成极具杀伤力的主动拦截。'
  },
  {
    code: 'RCI',
    name: '通路状态恢复 (Route Recovery Index)',
    current: '100.0%',
    baseline: '80.0%',
    lift: '+20.0%',
    desc: '衡量解决由于反爬死锁、网关误拦截、robots.txt等原因导致大模型爬虫被强行隔离，从而使品牌信息沦为盲区的通路保障程度。',
    chartData: [
      { name: 'W1', 当前得分: 80, 基线得分: 80 },
      { name: 'W2', 当前得分: 85, 基线得分: 80 },
      { name: 'W3', 当前得分: 90, 基线得分: 80 },
      { name: 'W4', 当前得分: 95, 基线得分: 80 },
      { name: 'W5', 当前得分: 98, 基线得分: 80 },
      { name: 'W6', 当前得分: 100, 基线得分: 80 }
    ],
    metrics: [
      { name: '官方核心参数网关爬虫免拦截成功率', baseline: '80.0%', current: '100.0%', lift: '+20.0%' },
      { name: 'CDN全球节点数据同步时效延迟缩短率', baseline: '24小时', current: '2小时', lift: '时延缩短91.6%' },
      { name: 'robots.txt大模型专属通道解析畅通率', baseline: '85.0%', current: '100.0%', lift: '+15.0%' }
    ],
    analysis: 'RCI通路保障录得100%全满分成绩。这是底盘用料硬核对比和魔方电池国家级碰撞测评白皮书能被全网大模型零时延调取的物理基石。我们全方位清除了官方核心网关对大模型爬虫的阻断行为，确保大模型每一次多级追问、零字召回时都能调取我们最新的技术指标。'
  }
];
