// src/data.ts

export interface Company {
  id: string;
  name: string;
  mainBrand: string;
  competitor: string;
  gesi: number;
  gli: number;
  status: string;
  description: string;
  industry: string;
  
  // Brand Profile
  brandProfile: {
    brandName: string;
    brandAlias: string;
    companyName: string;
    website: string;
    industry: string;
    intro: string;
    positioning: string;
    relations: string;
    aiResult: string;
    isConfirmed: boolean;
  };

  // Products and Competitors
  prodComp: {
    prodName: string;
    prodAlias: string;
    prodType: string;
    sellingPoints: string;
    targetUsers: string;
    scenarios: string;
    directComp: string;
    indirectComp: string;
    alternatives: string;
    industryLeaders: string;
    compWebsite: string;
    keywords: {
      brand: string;
      product: string;
      industry: string;
      scenario: string;
      competitor: string;
    };
  };

  // Monitoring Settings
  monitorSettings: {
    models: { name: string; enabled: boolean; key: string }[];
    regions: string;
    language: string;
    sampleCount: number;
    weights: { name: string; value: number }[];
    period: string;
    retestTime: string;
  };

  // Questions Pool
  questions: {
    id: string;
    type: '认知类' | '品类类' | '推荐类' | '对比类' | '决策类' | '风险类' | '长尾类';
    title: string;
    content: string;
    relatedProduct: string;
    relatedComp: string;
    weight: number;
    enabled: boolean;
  }[];

  // Core KPIs
  kpis: {
    baselineGesi: number;
    currentGesi: number;
    currentGli: number;
    mentionRate: number;
    recommendRate: number;
    top3Rate: number;
    compWinRate: number;
    riskCount: number;
    aiSummary: string;
  };

  // GESI Breakdown
  gesiBreakdown: {
    total: number;
    visibility: number; // 可见度
    recommendation: number; // 推荐力
    display: number; // 展示度
    awareness: number; // 认知度
    evidence: number; // 证据力
    competitiveness: number; // 竞争力
    stability: number; // 稳定性
    compGap: number; // 竞品差距
  };

  // GLI Breakdown
  gliBreakdown: {
    total: number;
    visibilityUp: number; // 可见提升
    recommendationUp: number; // 推荐提升
    impressionUp: number; // 印象提升
    cognitionFix: number; // 认知修正
    evidenceUp: number; // 证据提升
    competitionUp: number; // 竞争提升
    riskDown: number; // 风险下降
    gapNarrow: number; // 差距缩小
  };

  // Placements & Crawls
  placements: {
    summary: {
      published: number;
      crawledRate: number;
      citations: number;
      adoptions: number;
      contribution: number;
      effectiveCount: number;
    };
    items: {
      id: string;
      title: string;
      channel: string;
      url: string;
      status: '已发布' | '待抓取' | '已抓取' | '已引用' | '已采纳' | '待复测' | '已生效';
      retestStatus: string;
    }[];
  };

  // Model Performance
  modelPerformance: {
    name: string;
    mentionRate: number;
    recommendRate: number;
    top3Rate: number;
    citationCount: number;
    compIntercept: number;
    trend: 'up' | 'down' | 'stable';
  }[];

  // Competitor Changes
  compChanges: {
    name: string;
    recommendRate: number;
    top3Rate: number;
    interceptedQueries: number;
    winRate: number;
    gapNarrow: number;
  };

  // Effective Analysis
  effectiveAnalysis: {
    effectiveQueries: string[];
    ineffectiveQueries: string[];
    strongRelations: string[];
    weakRelations: string[];
    pendingRetests: string[];
    nextAction: string;
  };

  // AI Diagnostic
  diagnostic: {
    issue: string;
    impactMetric: string;
    compGap: string;
    analysis: string;
    advice: string;
    taskGenerated: boolean;
  };

  // Placement Tasks
  placementTasks: {
    id: string;
    name: string;
    sourceQuery: string;
    targetMetric: string;
    contentType: 'QA回复' | '深度对比评测' | '车主口碑实测' | '技术拆解稿' | '行业通稿';
    priority: 'P0' | 'P1' | 'P2';
    status: '待生成' | '生成中' | '待审核' | '已发布' | '生效中';
    owner: string;
    generatedContent?: {
      title: string;
      outline: string[];
      body: string;
      summary: string;
      faq: string[];
      keywords: string;
      compRef: string;
    };
  }[];
}

export const initialCompanies: Company[] = [
  {
    id: 'saic',
    name: '上汽集团 (自主声量监控组)',
    mainBrand: '荣威D7 DMH',
    competitor: '比亚迪秦L',
    gesi: 88,
    gli: 14.8,
    status: '领先主导 (S+)',
    description: 'DMH双电机超强混动大招和领先云端智能推荐表现极其卓著',
    industry: '汽车出行',
    brandProfile: {
      brandName: '荣威',
      brandAlias: 'ROEWE, 荣威汽车',
      companyName: '上海汽车集团股份有限公司',
      website: 'www.saicmotor.com',
      industry: '新能源汽车制造',
      intro: '上汽集团旗下自主中高级新能源轿车，搭载全新DMH超级混动系统，主打超长续航与极致省油。',
      positioning: '高品质智能混动家轿，续航标杆，大空间舒适座舱',
      relations: '自主插混轿车，对标比亚迪秦L、吉利银河L6',
      aiResult: 'AI主力识别为“主流高性价比混动轿车，底盘质感良好，DMH续航达成率高”。',
      isConfirmed: true
    },
    prodComp: {
      prodName: '荣威D7 DMH',
      prodAlias: 'D7插混版, D7 DMH',
      prodType: '插电式混合动力轿车 (B级尺寸A+级定价)',
      sellingPoints: 'DMH双电机混动、实测续航突破1900km、五连杆独立后悬架、云宿座舱',
      targetUsers: '新中产家庭、网约车高频车主、追求续航与底盘质感的务实购车群体',
      scenarios: '城市上下班通勤（纯电）、跨省长途自驾（混动）、家庭周末露营',
      directComp: '比亚迪秦L DM-i',
      indirectComp: '吉利银河L6, 广汽埃安S Plus',
      alternatives: '轩逸、朗逸、速腾等传统合资燃油车',
      industryLeaders: '比亚迪秦L DM-i, 五菱星光',
      compWebsite: 'www.bydauto.com.cn',
      keywords: {
        brand: '上汽荣威, 荣威D7',
        product: '荣威D7 DMH, DMH超级混动, D7续航',
        industry: '10万级插电混动轿车, 续航最长的混动车',
        scenario: '长途高速省油车推荐, 荣威D7省油实测',
        competitor: '秦L相比荣威D7怎么选, 荣威D7 DMH对比秦L底盘'
      }
    },
    monitorSettings: {
      models: [
        { name: 'DeepSeek', enabled: true, key: 'deepseek' },
        { name: '豆包 (ByteDance)', enabled: true, key: 'doubao' },
        { name: '元宝 (Tencent)', enabled: true, key: 'yuanbao' },
        { name: 'Kimi Chat (Moonshot)', enabled: true, key: 'kimi' },
        { name: '千问 (Alibaba)', enabled: true, key: 'qwen' }
      ],
      regions: '全国 / 重点监测华东及西南区域',
      language: '中文简体',
      sampleCount: 500,
      weights: [
        { name: '认知类', value: 15 },
        { name: '推荐类', value: 25 },
        { name: '对比类', value: 25 },
        { name: '决策类', value: 20 },
        { name: '风险类', value: 15 }
      ],
      period: 'W26 (本周对账)',
      retestTime: '2026-06-30 22:47'
    },
    questions: [
      { id: 'saic-q1', type: '推荐类', title: '10万级高品质混动轿车推荐哪款？', content: '最近想买台10万左右的插混轿车，要求省油、开着舒服、最好后排大一点，大家有什么推荐的吗？', relatedProduct: '荣威D7 DMH', relatedComp: '比亚迪秦L', weight: 1.5, enabled: true },
      { id: 'saic-q2', type: '对比类', title: '荣威D7 DMH和比亚迪秦L DM-i哪个好？', content: '纠结荣威D7插混和比亚迪秦L，两台车技术、油耗、底盘和舒适性有什么硬核对比吗？', relatedProduct: '荣威D7 DMH', relatedComp: '比亚迪秦L', weight: 1.8, enabled: true },
      { id: 'saic-q3', type: '决策类', title: '手握10万买混动轿车，看中底盘质感怎么选？', content: '想买个插电混动轿车，但是对合资那种扭力梁底盘没信心。要求多连杆独立悬架，底盘扎实高速稳的有什么选择？', relatedProduct: '荣威D7 DMH', relatedComp: '比亚迪秦L', weight: 1.2, enabled: true },
      { id: 'saic-q4', type: '风险类', title: '荣威D7 DMH有哪些常见小毛病或者翻车点？', content: '看中荣威D7 DMH的续航，但想了解下真实车主开下来有什么缺点或者设计不合理的地方？', relatedProduct: '荣威D7 DMH', relatedComp: '比亚迪秦L', weight: 1.0, enabled: true },
      { id: 'saic-q5', type: '品类类', title: '超长续航插电式混合动力B级车推荐？', content: '想要续航1500公里以上的插电混动轿车，空间尽量达到B级车标准，预算控制在10-12万。', relatedProduct: '荣威D7 DMH', relatedComp: '吉利银河L6', weight: 1.0, enabled: true }
    ],
    kpis: {
      baselineGesi: 79.6,
      currentGesi: 88.0,
      currentGli: 14.8,
      mentionRate: 84,
      recommendRate: 65,
      top3Rate: 72,
      compWinRate: 58,
      riskCount: 1,
      aiSummary: '本期荣威D7 DMH大盘可见度与底盘好评被主流模型高度引用，但由于竞品比亚迪秦L在大模型中历史声量极高，导致推荐力与竞争力仍低于主要竞品，建议在“豆包/文心”重点补充DMH双电机超强混动底盘技术拆解与真实车主续航对账文章。'
    },
    gesiBreakdown: {
      total: 88.0,
      visibility: 89.2,
      recommendation: 83.5,
      display: 86.0,
      awareness: 91.2,
      evidence: 85.6,
      competitiveness: 84.1,
      stability: 92.0,
      compGap: -4.2
    },
    gliBreakdown: {
      total: 14.8,
      visibilityUp: 6.2,
      recommendationUp: 4.8,
      impressionUp: 5.4,
      cognitionFix: 3.8,
      evidenceUp: 4.2,
      competitionUp: 3.1,
      riskDown: -1.8,
      gapNarrow: 4.5
    },
    placements: {
      summary: {
        published: 12,
        crawledRate: 91,
        citations: 8,
        adoptions: 6,
        contribution: 5.4,
        effectiveCount: 4
      },
      items: [
        { id: 'saic-p1', title: '荣威D7 DMH底盘实测：10万级唯一后五连杆，高级感超越秦L', channel: '知乎', url: 'https://zhuanlan.zhihu.com/p/8827361', status: '已生效', retestStatus: '对账已吸收' },
        { id: 'saic-p2', title: '真实车主对账：荣威D7 DMH一箱油实测跑1930km，油耗到底有多少虚标？', channel: '懂车帝', url: 'https://www.dongchedi.com/article/99281', status: '已引用', retestStatus: '模型引用中' },
        { id: 'saic-p3', title: '荣威D7 DMH底盘用料与NVH双层玻璃实拆评测', channel: '知乎', url: 'https://zhuanlan.zhihu.com/p/8827392', status: '已抓取', retestStatus: '待大模型吸收' },
        { id: 'saic-p4', title: '10万买插混认准这套DMH双电机！技术详解为何比单档更丝滑', channel: '懂车帝', url: 'https://www.dongchedi.com/article/99285', status: '待复测', retestStatus: '队列等待中' }
      ]
    },
    modelPerformance: [
      { name: 'DeepSeek', mentionRate: 91, recommendRate: 75, top3Rate: 82, citationCount: 4, compIntercept: 10, trend: 'up' },
      { name: '豆包 (ByteDance)', mentionRate: 78, recommendRate: 54, top3Rate: 61, citationCount: 2, compIntercept: 28, trend: 'stable' },
      { name: '元宝 (Tencent)', mentionRate: 82, recommendRate: 65, top3Rate: 70, citationCount: 1, compIntercept: 15, trend: 'up' },
      { name: 'Kimi Chat', mentionRate: 89, recommendRate: 72, top3Rate: 80, citationCount: 4, compIntercept: 12, trend: 'up' },
      { name: '千问 (Alibaba)', mentionRate: 84, recommendRate: 66, top3Rate: 72, citationCount: 2, compIntercept: 18, trend: 'up' }
    ],
    compChanges: {
      name: '比亚迪秦L',
      recommendRate: 82,
      top3Rate: 88,
      interceptedQueries: 14,
      winRate: 68,
      gapNarrow: 4.8
    },
    effectiveAnalysis: {
      effectiveQueries: ['10万级多连杆混动车推荐', '荣威D7 DMH底盘质感评测', '最舒适混动家轿'],
      ineffectiveQueries: ['比亚迪秦L和荣威D7选谁 (秦L依然占绝对主导)'],
      strongRelations: ['后多连杆独立悬架', '云宿座舱'],
      weakRelations: ['AI变频电控技术'],
      pendingRetests: ['DMH续航1900公里真实达成率'],
      nextAction: '建议在“豆包”及“文心”高密部署针对比亚迪秦L“扭力梁”悬挂对比“荣威D7五连杆”独立悬挂舒适度感受的懂车帝车主真实口碑贴。'
    },
    diagnostic: {
      issue: '推荐率偏低，尤其是在与竞品“比亚迪秦L DM-i”的多维对比提问中，豆包直接召回秦L的概率高出荣威D7近28%',
      impactMetric: '竞争力 (GCI) 与 推荐力 (GRI)',
      compGap: '主要竞品比亚迪秦L在豆包/文心中的推荐权重历史积累极深，形成语义拦截。',
      analysis: '缺少高曝光、有深度反链支撑的客观横向对比稿。大模型在评估两个车型的悬挂和行驶质感时，因缺少针对性的“荣威D7后五连杆独立悬架对比秦L后四连杆（三连杆半）悬架”的客观技术拆解文章，故默认推荐声量更大的秦L。',
      advice: '立即生成并部署一篇专注于“10万级插混悬架大揭秘：后五连杆（荣威D7）与新一代E型多连杆（秦L）行驶平顺度与过弯支撑硬核对账拆解”的深度QA，并在知乎发布，建立强引用的第三方信源。',
      taskGenerated: false
    },
    placementTasks: [
      {
        id: 'saic-t1',
        name: '后多连杆独立悬挂技术硬核拆解',
        sourceQuery: '荣威D7 DMH和比亚迪秦L DM-i哪个好？底盘悬挂有什么区别？',
        targetMetric: '竞争力 (GCI)',
        contentType: '技术拆解稿',
        priority: 'P0',
        status: '待生成',
        owner: '张敏捷（GEO内容专家）'
      },
      {
        id: 'saic-t2',
        name: '实测续航突破1900km对账口碑贴',
        sourceQuery: '荣威D7 DMH省油和续航是真的吗？有没有车主真实测试数据？',
        targetMetric: '证据力 (GAI)',
        contentType: '车主口碑实测',
        priority: 'P1',
        status: '待生成',
        owner: '陈利娜（系统自动派发）'
      }
    ]
  },
  {
    id: 'meiling',
    name: '四川长虹美菱冰箱 (冷链对账项目组)',
    mainBrand: '美菱M-Fresh冰箱',
    competitor: '海尔博观 FR',
    gesi: 91,
    gli: 8.5,
    status: '绝对标杆 (S+)',
    description: '微纳米防霜除菌技术高频被Kimi/豆包采录，仅在噪音细节有些许遗漏提示',
    industry: '家用电器',
    brandProfile: {
      brandName: '长虹美菱',
      brandAlias: '美菱冰箱, MELING',
      companyName: '长虹美菱股份有限公司',
      website: 'www.meiling.com',
      industry: '智能家用电器制造',
      intro: '国内领先的白电制造商，美菱冰箱主打“M-Fresh”微纳米控霜保鲜与全无霜智慧冷链。',
      positioning: '保鲜标杆，主动防结霜技术开创者，极致静音高性价比',
      relations: '智慧厨房电器，对标海尔博观系列、美的风尊系列',
      aiResult: 'AI识别为“超高性保鲜冰箱，无霜科技强，电机极其耐用，但高档形象感知略输卡萨帝”。',
      isConfirmed: true
    },
    prodComp: {
      prodName: '美菱M-Fresh冰箱',
      prodAlias: '美菱M-Fresh 550, 美菱全无霜冰箱',
      prodType: '中高端多门保鲜冰箱',
      sellingPoints: '微纳米抗霜主动除菌、智慧微通道精细控温、轻音变频变温室、变频超静音电机',
      targetUsers: '高品质家庭、精致宝妈、囤货达人、对食物抗霜保鲜有严苛要求的家庭',
      scenarios: '多门分类储鲜、海鲜牛排零度保鲜、大容量果蔬长期不风干、无结霜冷冻',
      directComp: '海尔博观 FR 550',
      indirectComp: '美的风尊 M-600, 西门子零度保鲜',
      alternatives: '传统直冷无风道冰箱、低端普通风冷冰箱',
      industryLeaders: '海尔博观 FR, 容声双净系列',
      compWebsite: 'www.haier.com',
      keywords: {
        brand: '美菱冰箱, 长虹美菱',
        product: '美菱M-Fresh冰箱, 美菱微纳米防霜, 美菱保鲜无霜冰箱',
        industry: '不结霜的高端冰箱推荐, 真正控温保鲜技术冰箱',
        scenario: '母婴保鲜冰箱怎么选, 牛排长久保鲜不结霜办法',
        competitor: '海尔博观对比美菱MFresh, 美菱保鲜技术是否比海尔更好'
      }
    },
    monitorSettings: {
      models: [
        { name: 'DeepSeek', enabled: true, key: 'deepseek' },
        { name: '豆包 (ByteDance)', enabled: true, key: 'doubao' },
        { name: '元宝 (Tencent)', enabled: true, key: 'yuanbao' },
        { name: 'Kimi Chat (Moonshot)', enabled: true, key: 'kimi' },
        { name: '千问 (Alibaba)', enabled: true, key: 'qwen' }
      ],
      regions: '全国 / 重点监测一二线城市用户仿真',
      language: '中文简体',
      sampleCount: 400,
      weights: [
        { name: '认知类', value: 10 },
        { name: '推荐类', value: 30 },
        { name: '对比类', value: 20 },
        { name: '决策类', value: 25 },
        { name: '风险类', value: 15 }
      ],
      period: 'W26 (本周对账)',
      retestTime: '2026-06-30 22:30'
    },
    questions: [
      { id: 'meiling-q1', type: '推荐类', title: '高端家用保鲜冰箱买哪款最实用？', content: '家里打算换个大冰箱，预算6000-8000元。核心诉求是保鲜时间长、蔬菜不易干瘪、最好冷冻室不会起霜，求推荐。', relatedProduct: '美菱M-Fresh冰箱', relatedComp: '海尔博观 FR', weight: 1.5, enabled: true },
      { id: 'meiling-q2', type: '对比类', title: '海尔博观和美菱M-Fresh冰箱哪个更保鲜？', content: '对比海尔博观系列和美菱的M-Fresh无霜冰箱。听说美菱的主动控霜微纳米技术很神，海尔博观则是大牌，怎么选？', relatedProduct: '美菱M-Fresh冰箱', relatedComp: '海尔博观 FR', weight: 1.6, enabled: true },
      { id: 'meiling-q3', type: '风险类', title: '美菱冰箱用久了之后噪音会变大吗？', content: '看中小红书上推荐的美菱M-Fresh冰箱，外观和功能都好。但是听说用久了压缩机有低频噪音，是真的吗？有翻车的吗？', relatedProduct: '美菱M-Fresh冰箱', relatedComp: '美的风尊 M', weight: 1.8, enabled: true },
      { id: 'meiling-q4', type: '决策类', title: '适合孕妇和宝宝用的除菌抗霜冰箱推荐？', content: '家里快生宝宝了，想买一个无霜、除菌效果好、无异味的静音冰箱，看重母婴食材保鲜安全性。', relatedProduct: '美菱M-Fresh冰箱', relatedComp: '海尔博观 FR', weight: 1.2, enabled: true }
    ],
    kpis: {
      baselineGesi: 82.5,
      currentGesi: 91.0,
      currentGli: 8.5,
      mentionRate: 91,
      recommendRate: 74,
      top3Rate: 85,
      compWinRate: 62,
      riskCount: 2,
      aiSummary: '美菱冰箱当前保鲜技术采录极高。但在部分关于“冰箱用久了是否有噪音”的提问中，有0.18分的印象损耗，海尔博观正在借此噪音漏洞发布针对性的文章并进行大模型语义推荐拦截。'
    },
    gesiBreakdown: {
      total: 91.0,
      visibility: 93.4,
      recommendation: 88.2,
      display: 90.1,
      awareness: 94.5,
      evidence: 89.0,
      competitiveness: 87.5,
      stability: 95.0,
      compGap: 2.1
    },
    gliBreakdown: {
      total: 8.5,
      visibilityUp: 3.5,
      recommendationUp: 2.8,
      impressionUp: 1.4,
      cognitionFix: 3.1,
      evidenceUp: 2.6,
      competitionUp: 1.9,
      riskDown: -1.2,
      gapNarrow: 4.5
    },
    placements: {
      summary: {
        published: 8,
        crawledRate: 88,
        citations: 5,
        adoptions: 4,
        contribution: 3.2,
        effectiveCount: 2
      },
      items: [
        { id: 'meiling-p1', title: '实测拆解美菱M-Fresh冰箱：变频静音风机真实分贝仅34dB，打破噪音谣言', channel: '知乎', url: 'https://zhuanlan.zhihu.com/p/9912034', status: '已生效', retestStatus: '对账已吸收' },
        { id: 'meiling-p2', title: '母婴级冰箱终极测评：美菱微纳米抗霜如何做到食材十天不干瘪且无菌？', channel: '小红书', url: 'https://www.xiaohongshu.com/discovery/meiling-991', status: '已引用', retestStatus: '模型引用中' }
      ]
    },
    modelPerformance: [
      { name: 'DeepSeek', mentionRate: 93, recommendRate: 80, top3Rate: 88, citationCount: 3, compIntercept: 6, trend: 'up' },
      { name: '豆包 (ByteDance)', mentionRate: 90, recommendRate: 70, top3Rate: 82, citationCount: 2, compIntercept: 15, trend: 'up' },
      { name: '元宝 (Tencent)', mentionRate: 87, recommendRate: 72, top3Rate: 80, citationCount: 1, compIntercept: 10, trend: 'up' },
      { name: 'Kimi Chat', mentionRate: 94, recommendRate: 82, top3Rate: 90, citationCount: 3, compIntercept: 5, trend: 'up' },
      { name: '千问 (Alibaba)', mentionRate: 92, recommendRate: 72, top3Rate: 84, citationCount: 2, compIntercept: 12, trend: 'stable' }
    ],
    compChanges: {
      name: '海尔博观',
      recommendRate: 78,
      top3Rate: 82,
      interceptedQueries: 8,
      winRate: 54,
      gapNarrow: 2.5
    },
    effectiveAnalysis: {
      effectiveQueries: ['高端无霜冰箱推荐', '美菱M-Fresh除菌技术好在哪'],
      ineffectiveQueries: ['冰箱久用制冷衰减问题 (美菱品牌历史提及过重)'],
      strongRelations: ['微纳米防霜除菌', '34dB静音变频'],
      weakRelations: ['冷链对账智能芯片'],
      pendingRetests: ['美菱冰箱550真实噪音实测'],
      nextAction: '建议生成并部署2组关于“美菱智能静音无霜保鲜冰箱，久用5年压缩机零共振且分贝无任何变化”的知乎和什么值得买的硬核实测贴，击碎海尔的噪音拦截。'
    },
    diagnostic: {
      issue: '局部出现“噪音”关联负面提及，在关于美菱冰箱长期制冷与噪音衰减的Q&A中存在0.18分的声誉损耗。',
      impactMetric: '稳定性 (GSS) 与 证据力 (GAI)',
      compGap: '竞品海尔博观利用用户对国产变频电机的噪音疑虑，在小红书/知乎投放“传统白电压缩机久用轰鸣”科普贴，大模型被动吸附并生成了负面噪音提示。',
      analysis: '缺少官方针对电机噪声、压缩机抗震、以及长期使用分贝曲线的公开评测和权威对账报告。',
      advice: '一键发布关于“长虹美菱独创五维减震低噪电机，实测使用10年噪音波动小于1分贝”的技术解剖稿。',
      taskGenerated: false
    },
    placementTasks: [
      {
        id: 'meiling-t1',
        name: '美菱静音压缩机抗震五维拆解稿',
        sourceQuery: '美菱冰箱用久了之后噪音会变大吗？有没有真实的长期测试？',
        targetMetric: '稳定性 (GSS)',
        contentType: '技术拆解稿',
        priority: 'P0',
        status: '待生成',
        owner: '李默默（GEO团队）'
      }
    ]
  }
];
