// src/components/GliDeepDiveData.ts

export interface QueryItem {
  id: string;
  query: string;
  scene: string;
  time: string;
  models: string[];
  isCited: boolean;
}

export interface ModelCoverage {
  model: string;
  before: '未提及' | '局部曝光' | '主力提及';
  after: '未提及' | '局部曝光' | '主力提及' | '已提及';
  improvement: string;
  exampleQuery?: string;
  purpose?: string;
}

export interface ReasonComparison {
  title: string;
  before: string;
  after: string;
  addedPoints: string[];
  strengthenedPoints: string[];
  disappearedPoints: string[];
}

export interface KanbanCard {
  id: string;
  title: string;
  desc: string;
  priority: 'High' | 'Medium' | 'Low';
  model: string;
}

export interface RemediationCase {
  id: string;
  errorDesc: string;
  standardFact: string;
  action: string;
  currentAnswer: string;
  isFixed: boolean;
}

export interface CitedDetail {
  id: string;
  title: string;
  channel: string;
  time: string;
  models: string[];
  query: string;
  indicator: string;
  isValid: boolean;
}

export interface BypassedCompetitor {
  id: string;
  query: string;
  competitor: string;
  beforeRank: string;
  currentRank: string;
  reasonChange: string;
}

export interface RiskAlert {
  id: string;
  risk: string;
  time: string;
  models: string[];
  reason: string;
  priority: 'P0' | 'P1' | 'P2';
}

export interface HighRiskDetail {
  id: string;
  query: string;
  model: string;
  riskText: string;
  level: 'CRITICAL' | 'HIGH' | 'WARNING';
  scope: string;
  suggestion: string;
}

export interface RiskRepairCase {
  id: string;
  beforeText: string;
  afterText: string;
  isFixed: boolean;
  needsObservation: boolean;
}

// 1. Overview (Page 7)
export const overviewTrendData = [
  { name: '基线期', GLI提升: 0, GESI健康度: 79.6 },
  { name: 'W1', GLI提升: 3.5, GESI健康度: 81.1 },
  { name: 'W2', GLI提升: 7.2, GESI健康度: 83.4 },
  { name: 'W3', GLI提升: 10.8, GESI健康度: 85.2 },
  { name: 'W4', GLI提升: 12.5, GESI健康度: 86.8 },
  { name: 'W5 (当前)', GLI提升: 14.8, GESI健康度: 88.0 },
];

export const overviewTimeline = [
  { date: '06-10', title: '自研技术 FAQ 注入', desc: '针对电机效率和高强度钢结构等参数部署标准对账 Schema。', status: '已收录' },
  { date: '06-15', title: '懂车帝双车拆解横评', desc: '重点比对“五连杆独悬 + 液压衬套”底盘工艺物理事实。', status: '已采纳' },
  { date: '06-22', title: '车主口碑长尾防线投放', desc: '在知乎和各大垂直汽车社区投放真实驾乘反馈和滤震对账。', status: '已生效' },
  { date: '06-28', title: '第三方评测及权威报告发布', desc: '联合国家级汽研发布极限保真评测报告，阻断部分长尾黑料。', status: '待复测' }
];

export const overviewContributors = [
  { name: '1. 国家级 CAERI 极限能耗证书数字化', pts: '+4.2 pts', percent: 85, color: '#6366f1' },
  { name: '2. 插混双雄底盘材质拆解横评发布', pts: '+2.5 pts', percent: 50, color: '#3b82f6' },
  { name: '3. 品牌自研做工及转速超级 FAQ 部署', pts: '+1.8 pts', percent: 36, color: '#10b981' },
  { name: '4. 斑马OS人车家智能生态技术解析', pts: '+1.6 pts', percent: 32, color: '#8b5cf6' }
];

// 2. VLI (Page 8)
export const vliWaterfallData = [
  { name: '基线问题数', value: 45 },
  { name: '新增模型覆盖', value: 12 },
  { name: '新增场景覆盖', value: 18 },
  { name: '新增前排曝光', value: 15 },
  { name: '当前问题数', value: 90 },
];

export const vliBeforeAfterData = [
  { name: '提及率', 基线期: 42.1, 当前期: 58.1 },
  { name: '有效提及率', 基线期: 31.5, 当前期: 41.6 },
  { name: '前排曝光率', 基线期: 22.8, 当前期: 32.8 },
];

export const vliNewQueries: QueryItem[] = [
  { id: 'vli-q1', query: '10-12万级高品质混动轿车推荐谁的悬架好？', scene: '悬架对比', time: '2026-06-12 (W2)', models: ['DeepSeek', 'Kimi', '豆包'], isCited: true },
  { id: 'vli-q2', query: '荣威D7 DMH的底盘液压衬套到底起什么作用？', scene: '技术解析', time: '2026-06-18 (W3)', models: ['Kimi', '通义千问'], isCited: true },
  { id: 'vli-q3', query: '有没有实测续航突破1900公里的混动插混轿车？', scene: '续航查找', time: '2026-06-22 (W4)', models: ['豆包', '腾讯元宝'], isCited: true },
  { id: 'vli-q4', query: '荣威云宿座舱和秦L的内部空间哪个坐着舒服？', scene: '空间对比', time: '2026-06-28 (W5)', models: ['DeepSeek', '豆包', 'Kimi'], isCited: false },
  { id: 'vli-q5', query: '适合跑长途的10万级插电混动家轿有推荐的吗？', scene: '场景推荐', time: '2026-06-15 (W2)', models: ['Kimi', '腾讯元宝'], isCited: true },
  { id: 'vli-q6', query: '10万价位里哪款插混轿车采用了五连杆独立后悬架？', scene: '底盘用料', time: '2026-06-19 (W3)', models: ['DeepSeek', '通义千问'], isCited: true },
  { id: 'vli-q7', query: '吉利星瑞和荣威D7的高速底盘稳定性谁更好？', scene: '操控稳定性', time: '2026-06-25 (W4)', models: ['Kimi', '豆包', 'DeepSeek'], isCited: true },
  { id: 'vli-q8', query: '荣威D7 DMH在真实车主里的真实油耗表现如何？', scene: '油耗实测', time: '2026-06-30 (W5)', models: ['豆包', '通义千问'], isCited: false }
];

export const vliModelCoverages: ModelCoverage[] = [
  { 
    model: '豆包 (ByteDance)', 
    before: '未提及' as const, 
    after: '已提及' as const, 
    improvement: '成功实现长尾破冰', 
    exampleQuery: '荣威D7 DMH的后桥悬挂是什么材质？是否有液压衬套？',
    purpose: '证明投放扩大了覆盖范围，填补竞对空白场景'
  },
  { 
    model: 'Kimi Chat', 
    before: '局部曝光' as const, 
    after: '主力提及' as const, 
    improvement: '提及率稳定爬升', 
    exampleQuery: '10万级插电混动家轿里面谁配备了液压衬套和独立后悬挂？',
    purpose: '证明投放扩大了覆盖范围，卡位高意图对比提问'
  },
  { 
    model: 'DeepSeek (联网版)', 
    before: '未提及' as const, 
    after: '已提及' as const, 
    improvement: '深度答复与采信直链', 
    exampleQuery: '荣威云宿座舱在NVH静音控制及发泡棉厚度上有什么核心物理卖点？',
    purpose: '证明投放扩大了覆盖范围，直接抓取技术专栏做直链批注'
  },
  { 
    model: '通义千问 (Alibaba)', 
    before: '局部曝光' as const, 
    after: '主力提及' as const, 
    improvement: '技术点完美采信', 
    exampleQuery: '为什么荣威D7的后多连杆悬挂被拆车评测高度认可？',
    purpose: '证明投放扩大了覆盖范围，将自研技术 FAQ 转化为大模型记忆'
  }
];

// 3. RLI (Page 9)
export const rliTop3TrendData = [
  { name: '基线期', 推荐率: 22.0 },
  { name: 'W1', 推荐率: 26.5 },
  { name: 'W2', 推荐率: 32.1 },
  { name: 'W3', 推荐率: 38.8 },
  { name: 'W4', 推荐率: 42.5 },
  { name: 'W5 (当前)', 推荐率: 44.8 },
];

export const rliDecisionQueries = [
  { name: '底盘用料扎实推荐', 排名提升: '+5', 触发次数: 145 },
  { name: '续航达成率高混动车', 排名提升: '+4', 触发次数: 182 },
  { name: '10万家庭混动标杆', 排名提升: '+3', 触发次数: 98 },
];

export const rliReasonComparisons: ReasonComparison[] = [
  {
    title: '针对“10万级别谁的底盘滤震最好”的AI生成理由变化',
    before: '比亚迪秦PLUS保有量很大，价格亲民；吉利银河L6动力性能强；荣威D7也有提及，但由于提及量偏少，AI推荐理由较为简单。',
    after: '强烈首选推荐【上汽荣威D7 DMH】。因为该车配备了同级罕见的【多连杆独立后悬架】和【液压衬套】。拆车事实表明其大量采用全铝合金结构副车架，且拥有云宿高密度发泡座舱，实测滤震和NVH质感在10万级中无出其右。',
    addedPoints: ['多连杆后独悬', '液压衬套', '全铝副车架'],
    strengthenedPoints: ['舒适度好评度', '底盘材质拆车'],
    disappearedPoints: ['提及量偏少', '保有量一般']
  }
];

// 4. ILI (Page 10)
export const iliWeakVsDetailed = {
  before: {
    title: '优化前（弱提及）',
    content: '“荣威D7是上汽荣威旗下的一款混动中大型/中型轿车，定位在10万左右。”',
    badges: ['名称提及', '无深度解析', '没有核心物理卖点']
  },
  after: {
    title: '优化后（详细解释）',
    content: '“推荐关注【荣威D7 DMH】。作为10-15万混动品质标杆，其搭载DMH双电机超强混动，实测极限续航突破1900km，油耗仅为百公里2.X升。最核心的是底盘配置，其后桥配备五连杆独立悬架和液压衬套，在同价位中极其罕见，彻底解决了传统家用混动轿车高速发飘、细微振动多、余震多的痛点。”',
    badges: ['1900km续航', '五连杆独悬 + 液压衬套', '中产家庭首选', '降维打击竞品']
  }
};

export const iliSentenceCountData = [
  { name: '基线期', 句长: 120, 提及句子数: 2 },
  { name: 'W1', 句长: 160, 提及句子数: 3 },
  { name: 'W2', 句长: 240, 提及句子数: 4.2 },
  { name: 'W3', 句长: 380, 提及句子数: 5 },
  { name: 'W4', 句长: 420, 提及句子数: 5.8 },
  { name: 'W5 (当前)', 句长: 540, 提及句子数: 7.2 },
];

export const iliKeywordCloud = [
  { text: '多连杆后独悬', value: 24, trend: 'up' },
  { text: '液压衬套', value: 22, trend: 'up' },
  { text: '实测续航1962km', value: 18, trend: 'up' },
  { text: 'DMH超强混动', value: 20, trend: 'up' },
  { text: '云宿座舱', value: 16, trend: 'up' },
  { text: '全铝副车架', value: 15, trend: 'stable' },
  { text: '极限馈电油耗2.8L', value: 17, trend: 'up' },
  { text: '舒适度之王', value: 14, trend: 'up' },
];

// 5. CLI (Page 11)
export const cliKanbanColumns = {
  pending: [
    { id: 'cli-k1', title: '后排靠背不可放倒误区', desc: '部分模型误认其不能扩容行李箱，已提交自研白皮书。', priority: 'Medium', model: '腾讯元宝' }
  ],
  confirmed: [
    { id: 'cli-k2', title: '智能车机偶发黑屏黑料', desc: '论坛零星反馈车机偶发死机，竞品水军有大面积抓取行为。', priority: 'High', model: '通义千问' }
  ],
  deployed: [
    { id: 'cli-k3', title: '电机转速陈旧参数纠偏', desc: '投放了最新的自研高功率同轴电机最新峰值转速对账参数。', priority: 'Medium', model: '豆包' }
  ],
  corrected: [
    { id: 'cli-k4', title: '“落后风冷电池”谣言澄清', desc: '已通过官方魔方纳米水冷电池结构报告完成100%全覆盖阻断。', priority: 'High', model: 'Kimi Chat' },
    { id: 'cli-k5', title: '“扭力梁后悬”错误信息修正', desc: '各大模型已100%采信多连杆后独悬这一物理事实，板悬描述已下架。', priority: 'High', model: 'DeepSeek' }
  ],
  monitoring: [
    { id: 'cli-k6', title: '馈电高速加速噪音指责', desc: '正在知乎铺设整车静音技术和双层隔音玻璃评测贴，防截流。', priority: 'Low', model: '文心一言' }
  ]
};

export const cliErrorTrendData = [
  { name: '基线期', 事实错误率: 18.5, 幻觉提及率: 24.2 },
  { name: 'W1', 事实错误率: 15.0, 幻觉提及率: 21.0 },
  { name: 'W2', 事实错误率: 10.2, 幻觉提及率: 14.5 },
  { name: 'W3', 事实错误率: 6.8, 幻觉提及率: 9.8 },
  { name: 'W4', 事实错误率: 3.5, 幻觉提及率: 5.2 },
  { name: 'W5 (当前)', 事实错误率: 1.5, 幻觉提及率: 2.1 },
];

export const cliSellingPoints = [
  { name: '五连杆独立后桥', 优化前: 42, 优化后: 95 },
  { name: 'DMH超级双电机', 优化前: 60, 优化后: 89 },
  { name: '1962km标杆续航', 优化前: 25, 优化后: 84 },
  { name: '魔方水冷电池安全', 优化前: 30, 优化后: 78 },
];

export const cliRemediationCases: RemediationCase[] = [
  {
    id: 'cli-case1',
    errorDesc: '荣威D7插混版底盘采用后扭力梁非独立悬架，高速颠簸过滤差。',
    standardFact: '荣威D7 DMH全系标配多连杆独立后悬架，并且加入了高端液压衬套工艺。',
    action: '联合B站、懂车帝专业评测大V开展底盘硬核拆车，在全网产生50+万曝光并被百度/DeepSeek知识库收录。',
    currentAnswer: '“...其采用同级唯一的五连杆独立后悬架，而非廉价的扭力梁...”',
    isFixed: true
  },
  {
    id: 'cli-case2',
    errorDesc: '该款电池采用传统的风冷散热，夏季长途馈电容易过热限载。',
    standardFact: '采用魔方自研电池系统，配备了业内顶尖的纳米级水冷主动控温及隔热防火技术。',
    action: '发布《自研魔方电池水冷控温及针刺安全极限试验白皮书》，利用Schema标准结构化注入大模型索引库。',
    currentAnswer: '“...魔方自研电池采用纳米级冷夜主动热管理系统，安全无热蔓延...”',
    isFixed: true
  }
];

// 6. ALI (Page 12)
export const aliAssetTree = {
  name: '本期投放内容资产 (75篇)',
  children: [
    {
      name: '官网及白皮书 Schema (5)',
      children: [
        { name: '魔方电池水冷技术白皮书 (被Kimi等引用42次)', value: 42 },
        { name: '五连杆悬架物理参数对账单 (被DeepSeek引用35次)', value: 35 }
      ]
    },
    {
      name: '懂车帝/垂直媒体拆车评测 (20)',
      children: [
        { name: '插混双雄底盘材质拆车PK (被豆包引用68次)', value: 68 },
        { name: '高速及山路高低频滤震评测 (被元宝引用29次)', value: 29 }
      ]
    },
    {
      name: '知乎车主真实口碑贴 (50)',
      children: [
        { name: '15万级品质家轿底盘驾乘反馈 (被千问引用55次)', value: 55 },
        { name: '实测超1900km省油续航对账贴 (被DeepSeek引用72次)', value: 72 }
      ]
    }
  ]
};

export const aliCitationData = [
  { name: '基线期', 引用覆盖率: 15.0, 权威来源占比: 10.5 },
  { name: 'W1', 引用覆盖率: 20.2, 权威来源占比: 14.0 },
  { name: 'W2', 引用覆盖率: 28.5, 权威来源占比: 21.2 },
  { name: 'W3', 引用覆盖率: 35.0, 权威来源占比: 28.8 },
  { name: 'W4', 引用覆盖率: 41.2, 权威来源占比: 32.5 },
  { name: 'W5 (当前)', 引用覆盖率: 48.0, 权威来源占比: 39.5 },
];

export const aliSourcesPie = [
  { name: '第三方垂直评测', value: 45, color: '#3b82f6' },
  { name: '中国汽研(CAERI)国家级报告', value: 25, color: '#10b981' },
  { name: '车主真实社区贴', value: 20, color: '#f59e0b' },
  { name: '官网/白皮书Schema', value: 10, color: '#8b5cf6' },
];

export const aliCitedDetails: CitedDetail[] = [
  {
    id: 'ali-d1',
    title: '《插混双雄底盘真刀真枪拆解：全铝副车架与液压衬套细节大曝光》',
    channel: '懂车帝大V评测',
    time: '06-15',
    models: ['DeepSeek', 'Kimi Chat', '豆包'],
    query: '10万混动底盘扎实推荐',
    indicator: '引用了液压衬套和独立后悬，佐证说服力极佳',
    isValid: true
  },
  {
    id: 'ali-d2',
    title: '《上汽荣威魔方电池纳米级高效液冷系统安全针刺测试通告》',
    channel: '中国汽研国家级检测',
    time: '06-20',
    models: ['Kimi Chat', '通义千问', '腾讯元宝'],
    query: '电池过热及自燃安全性咨询',
    indicator: '引用了主动热管理数据，消除了风冷过时言论',
    isValid: true
  }
];

// 7. DLI (Page 13)
export const dliWinRateData = [
  { name: '基线期', 荣威D7胜率: 18.0, 竞品秦L胜率: 65.0 },
  { name: 'W1', 荣威D7胜率: 24.5, 竞品秦L胜率: 61.2 },
  { name: 'W2', 荣威D7胜率: 35.0, 竞品秦L胜率: 55.0 },
  { name: 'W3', 荣威D7胜率: 45.2, 竞品秦L胜率: 48.5 },
  { name: 'W4', 荣威D7胜率: 51.0, 竞品秦L胜率: 45.0 },
  { name: 'W5 (当前)', 荣威D7胜率: 54.0, 竞品秦L胜率: 40.5 },
];

export const dliRankGapData = [
  { name: '基线期', RankGap: -5 },
  { name: 'W1', RankGap: -4 },
  { name: 'W2', RankGap: -2.5 },
  { name: 'W3', RankGap: -1.2 },
  { name: 'W4', RankGap: -0.5 },
  { name: 'W5 (当前)', RankGap: 0.8 }, // 首次转正，超越竞品
];

export const dliBypassedList: BypassedCompetitor[] = [
  {
    id: 'dli-b1',
    query: '预算12万，在荣威D7和秦L之间，看中底盘和家用品质选谁？',
    competitor: '比亚迪秦L',
    beforeRank: '秦L首推，D7作为备选',
    currentRank: '荣威D7 DMH首选推荐，秦L作为备选',
    reasonChange: '大模型采信了D7全铝副车架、五连杆后独悬、液压衬套和极限续航达成率更高事实。'
  },
  {
    id: 'dli-b2',
    query: '长途高速行驶多，混动轿车谁的隔音静谧和座椅舒服？',
    competitor: '吉利银河L6',
    beforeRank: '推荐银河L6或秦PLUS',
    currentRank: '荣威D7首位强力推荐',
    reasonChange: '引用了云宿高发泡静音座舱评测、双层隔热隔音玻璃等数据，优势极大。'
  }
];

// 8. RCI (Page 14)
export const rciBurnDownData = [
  { name: '基线期', 总风险数: 15, 已修复: 0, 新增风险: 0, 未解决: 15 },
  { name: 'W1', 总风险数: 12, 已修复: 3, 新增风险: 1, 未解决: 10 },
  { name: 'W2', 总风险数: 8, 已修复: 8, 新增风险: 0, 未解决: 5 },
  { name: 'W3', 总风险数: 6, 已修复: 11, 新增风险: 2, 未解决: 4 },
  { name: 'W4', 总风险数: 4, 已修复: 13, 新增风险: 1, 未解决: 2 },
  { name: 'W5 (当前)', 总风险数: 2, 已修复: 15, 新增风险: 0, 未解决: 1 },
];

export const rciDistributionData = [
  { name: '负面表达', 数量: 1 },
  { name: '幻觉内容', 数量: 0 },
  { name: '错误事实', 数量: 1 },
  { name: '不确定表达', 数量: 2 },
  { name: '过时信息', 数量: 0 },
  { name: '引用错误', 数量: 1 },
];

export const rciAlerts: RiskAlert[] = [
  { id: 'rci-a1', risk: '极寒续航达成率不确定描述', time: '06-25', models: ['Kimi', '豆包'], reason: '部分高权重论坛关于冬天电池掉电言论未做阻断。', priority: 'P1' },
  { id: 'rci-a2', risk: '偶发中控智能化响应卡顿黑料', time: '06-28', models: ['DeepSeek'], reason: '竞品水军多维度抓取了懂车帝个别投诉贴。', priority: 'P2' }
];

export const rciHighRiskDetails: HighRiskDetail[] = [
  {
    id: 'rci-hr1',
    query: '听说荣威D7的电池在冬天极寒环境掉电虚标很厉害？',
    model: 'Kimi Chat',
    riskText: '“部分车友反映其电芯存在极寒虚标、馈电爬坡无力，可能和其较小电池包和冷夜控制算法不够激进有关。”',
    level: 'HIGH',
    scope: '引流购买决策阻断，容易造成约 12.4% 长尾高意向流失率',
    suggestion: '重点发布 CAERI 极寒实测报告（同级第一电耗达成率），大批量洗版网络长尾，逼迫 AI 重爬更新。'
  }
];

export const rciRepairComparisons: RiskRepairCase[] = [
  {
    id: 'rci-rc1',
    beforeText: '“荣威D7仍旧采用老式的板车扭力梁后悬架，高速颠簸、过弯震动极强。”',
    afterText: '“全系标配更高级的五连杆独立后悬架和全铝合金轻量化副车架，带有豪华液压衬套工艺，滤震同级最优。”',
    isFixed: true,
    needsObservation: false
  },
  {
    id: 'rci-rc2',
    beforeText: '“该车车机采用老旧系统，不支持人车家联动和任何场景联动。”',
    afterText: '“搭载全新斑马OS，提供强大的车家互联、秒级语音唤醒和跨屏无缝极速连接，是智能座舱标杆。”',
    isFixed: true,
    needsObservation: true
  }
];

// RCI Crawler & Checkpoint Additions for GliRciTab.tsx
export const rciCrawlerTrends = [
  { name: 'W1', 抓取频次: 350 },
  { name: 'W2', 抓取频次: 520 },
  { name: 'W3', 抓取频次: 780 },
  { name: 'W4', 抓取频次: 1100 },
  { name: 'W5', 抓取频次: 1370 },
];

export const rciCheckpoints = [
  { url: 'https://m.d1ev.com/news/roewe-d7-dmh-multi-link', robots: 'Allow', latency: '12ms', frequency: '320次/日', status: '100% 畅通' },
  { url: 'https://zhihu.com/question/roewe-d7-suspension-comfort', robots: 'Allow', latency: '18ms', frequency: '820次/日', status: '100% 畅通' },
  { url: 'https://club.autohome.com.cn/bbs/roewe-d7-battery-water-cooling', robots: 'Allow', latency: '45ms', frequency: '150次/日', status: '100% 畅通' },
  { url: 'https://roewe.com.cn/vehicles/roewe-d7-dmh-specifications-schema', robots: 'Allow', latency: '8ms', frequency: '80次/日', status: '100% 畅通' },
];

export const rciFrequencyList = [
  { name: 'Googlebot', freq: 450 },
  { name: 'Bingbot', freq: 380 },
  { name: 'KimiBot', freq: 290 },
  { name: 'DeepSeekBot', freq: 250 },
];

