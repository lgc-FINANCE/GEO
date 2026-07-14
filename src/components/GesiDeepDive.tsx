// src/components/GesiDeepDive.tsx
import { useState, useEffect, useMemo, Fragment } from 'react';
import { Company } from '../data';
import { EvidenceScreenshots } from './EvidenceScreenshots';
import { GaiInferenceHubModal } from './GaiInferenceHub';
import { 
  Eye, Zap, Star, Shield, HelpCircle, AlertTriangle, 
  Layers, MessageSquare, ListCollapse, FileText, CheckCircle2,
  Download, Sparkles, X, Info, ChevronRight, BarChart3, TrendingUp, 
  ArrowUpRight, ArrowRight, Gauge, PieChart, Sliders,
  Check, ChevronDown, ChevronUp, Network, Award, Sparkle, AlertOctagon, Table, BarChart2, Globe, MapPin,
  Lock, Unlock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface GesiDeepDiveProps {
  company: Company;
  onNavigate?: (subview: string) => void;
  isLightMode?: boolean;
  isStatic?: boolean;
}

export function GesiDeepDive({ company, onNavigate, isLightMode, isStatic = false }: GesiDeepDiveProps) {
  // Navigation tabs of GESI
  const [selectedGesiTab, setSelectedGesiTab] = useState<'gvi' | 'gri' | 'gii' | 'gci' | 'gai' | 'gdi' | 'gss'>('gvi');

  // Theme support for both Dark Mode and Daytime Mode (Light Mode)
  const activeLight = isLightMode ?? (typeof document !== 'undefined' && !!document.querySelector('.light-mode'));

  const theme = {
    cardBg: activeLight ? 'bg-white border border-slate-200/80 shadow-sm' : 'bg-[#0D121F] border border-white/5',
    panelBg: activeLight ? 'bg-slate-50 border border-slate-200 shadow-sm' : 'bg-[#090D16] border border-white/5',
    textPrimary: activeLight ? 'text-slate-900' : 'text-white',
    textSecondary: activeLight ? 'text-slate-600' : 'text-slate-400',
    textMuted: activeLight ? 'text-slate-400' : 'text-slate-500',
    border: activeLight ? 'border-slate-200' : 'border-white/5',
    borderStrong: activeLight ? 'border-slate-300' : 'border-white/10',
    bgHover: activeLight ? 'hover:bg-slate-100/70' : 'hover:bg-white/[0.04]',
    bgSubtle: activeLight ? 'bg-slate-100/50' : 'bg-white/[0.02]',
    bgInput: activeLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-white',
    chartGrid: activeLight ? '#E2E8F0' : '#1E293B',
    chartTooltipBg: activeLight ? '#FFFFFF' : '#0B0F19',
    chartTooltipBorder: activeLight ? '#CBD5E1' : '#1E293B',
    chartTooltipText: activeLight ? '#0F172A' : '#F1F5F9'
  };

  // 指数权重设置 (默认总和为 100%)
  interface GesiIndexData {
    gvi: number;
    gri: number;
    gii: number;
    gci: number;
    gai: number;
    gdi: number;
    gss: number;
  }

  // Load initial weights from localStorage if exists
  const getInitialWeights = (): GesiIndexData => {
    try {
      const saved = localStorage.getItem('gesi_custom_weights');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'gvi' in parsed) {
          return parsed as GesiIndexData;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      gvi: 20, // AI 可见度指数
      gri: 20, // AI 推荐优先级指数
      gii: 15, // 生成式印象指数
      gci: 15, // AI 认知与声誉指数
      gai: 15, // 引用权威与证据指数
      gdi: 10, // 竞争防御指数
      gss: 5,  // 稳定性与泛化指数
    };
  };

  const [gesiWeights, setGesiWeights] = useState<GesiIndexData>(getInitialWeights);
  const [tempGesiWeights, setTempGesiWeights] = useState<GesiIndexData>({ ...gesiWeights });
  const [lockedWeights, setLockedWeights] = useState<Record<keyof GesiIndexData, boolean>>({
    gvi: false,
    gri: false,
    gii: false,
    gci: false,
    gai: false,
    gdi: false,
    gss: false,
  });

  const subIndexScores: GesiIndexData = {
    gvi: 85.0,
    gri: 72.0,
    gii: 56.0,
    gci: 78.0,
    gai: 62.0,
    gdi: 35.0,
    gss: 82.0,
  };

  const [showWeightsConfig, setShowWeightsConfig] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDetailTab, setSelectedDetailTab] = useState<keyof GesiIndexData>('gvi');

  // GESI interactive drilldown states
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [activeTaskPrompt, setActiveTaskPrompt] = useState<{ name: string; prompt: string; type: string; category?: string } | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeEvidenceChain, setActiveEvidenceChain] = useState<{
    id: string;
    title: string;
    question: string;
    type: string;
    model: string;
    region: string;
    language: string;
    baselineAnswer: string;
    currentAnswer: string;
    changeType: string;
    asset: string;
    source: string;
    confidence: string;
    status: string;
  } | null>(null);

  const [activeMatrix, setActiveMatrix] = useState<string | null>('决策型问题');
  const [activeModel, setActiveModel] = useState<string | null>('Gemini');
  const [selectedSubMetric, setSelectedSubMetric] = useState<{ name: string; current: number; avg: number; delta: string; contribution: string } | null>(null);
  const [showIndexDetailIntro, setShowIndexDetailIntro] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<{ modelName: string; question: string; answer: string; timestamp: string } | null>(null);
  const [showChartAnalysis, setShowChartAnalysis] = useState<Record<string, boolean>>({});

  // Sub-metric dictionary
  const subMetricIntroductions: Record<string, string> = {
    '非品牌检索提及率': '大模型在处理如“高性价比混动家轿”等非指定品牌的提问时，答案中提及本品牌的次数占比。',
    '场景首位曝光占比': '在大模型推荐多个品牌车型的列表中，我方品牌被排在首位推荐的概率和频次。',
    '多模型覆盖率(覆盖5款以上)': '在主流的五个或更多国产及合规大模型中，本品牌语料均被成功索引和提及的范围广度。',
    '核心配置透出率': '大模型在介绍本品牌时，主动列举高价值物理配置（如“五连杆、魔方电池”）的完整度。',
    '对标检索胜出率': '大模型在处理直接对比提问（如“A车和B车怎么选”）时，明确倾向或选择我方的几率。',
    '首发直接推荐占比': '在开放推荐提问的第一句或首要段落中，大模型不加前置条件地直接向用户推荐我方的比例。',
    '场景契合召回权重': '在特定场景（如“露营”、“冰雪越野”）问询中，本品牌核心卖点被模型精准匹配并高分召回的权重。',
    '横评对比胜出率': '大模型在做多车横向对比时，通过多项指标加权最终推荐我方的频次占比。',
    '高信任度信源比例': '大模型回答中使用的原始语料源自专业评测、懂车帝官方库等高等级权威站点的比例。',
    '用户口碑情感倾向': '大模型抓取并在回复中体现的来自车主论坛、社交媒体的关于本车做工和体验的情感正负倾向。',
    '技术参数心智建立': '大模型对荣威D7核心差异化硬核参数（如DMH超低油耗、热效率等）的语义记忆牢固度。',
    '正面发帖采信占比': '用户在主流网络平台发布的正面用车感受和提车贴，被大模型抓取并融进合成应答中的概率。',
    '车机互联生态心智': '大模型对“车机流畅、人车家互联、空间大”等智能化软性体验的心智认知程度。',
    '安全合规词条召回': '大模型在遭遇安全性、质量合规、电池技术疑问时，能准确提供真实合规官方参数的概率。',
    '舆情拦截辟谣时效': '当网络出现不实流言或对电池、续航的恶意攻击时，大模型纠偏并采信官方辟谣信息的更新速度。',
    '自媒体正面评价占比': '主流汽车自媒体在测评中留下的客观正面言论，被大模型语义网络识别并转述的比例。',
    '官方信源覆盖范围': '大模型对品牌官网公告、等保三级认证、官方出厂声明等高权威声明材料的直接引用深度。',
    '权威脚注链接采信': '大模型回答中提供跳转链接或注明出处时，权威信源（如政府公报、懂车帝实测）被选为脚注的几率。',
    '专业测试数据覆盖': '大模型能够说出精确评测数据（如“实测油耗 1.35L”等极值）的参数化引用完整度。',
    '学术及行业报告引用': '大模型基于第三方行业分析机构（如乘联会、中国汽研）的背书性数据来论证我方产品力的概率。',
    '官方权威信源深度': '大模型对于国家级认证机构的证书材料、碰撞测试评级等终极铁证的采信深度。',
    '对标拦截抗扰度': '在竞品营销轰炸下，大模型在推荐竞品时是否能插入我方同级别平替车型的成功几率。',
    '竞品词反向召回率': '用户在输入竞争对手车型（如“秦L”）的场景中，大模型主动提及本品牌进行截流的频率。',
    '核心痛点防御拦截占比': '针对我方部分劣势提问（如“智能车机是否有偶发卡顿”），大模型给出官方澄清/版本升级已解决的解释率。',
    '语义防御防飘移指数': '大模型语义检索链路在受到竞品洗脑通稿和恶意竞争黑通稿干扰时，保持客观评价本品牌的不动摇程度。',
    '多语域检索泛化度': '大模型能精准识别并承接书面语、极简口语（如“D7咋样”）等不同文本语风下品牌信息的提取。',
    '跨大模型输出一致性': '同样的品牌提问，在Kimi、DeepSeek、豆包等不同大模型间输出结果的高度契合度与非离群度。',
    '错别字模糊容错匹配率': '即便用户输入了“荣威D7DMH”（无空格）、“荣微D7”等错别字，模型依然能够准确匹配到我方底盘语料的概率。',
    '方言及口语化提问召回率': '在带有地方口音拼写或极度地道的口头表达下，模型提取本品牌官方评测结果的泛化响应率。'
  };

  // GESI dynamic indexes definitions
  const gesiDefinitions: Record<string, string> = {
    GVI: 'AI 可见度指数：评估在用户进行无品牌倾向的品类、场景等宽幅检索（例如“10万混动车推荐”）时，大模型主动提及和曝光本品牌及车型的概率与覆盖广度。',
    GRI: 'AI 推荐优先级指数：量化大模型在推荐多款竞品车型时，将我方品牌置于首位、前三位等高优先级推荐曝光序列的推荐心智偏好度。',
    GII: '生成式印象指数：衡量大模型在输出有关我方车型的评价时，对我们宣传的核心科技标签（如“超低油耗、魔方电池、五连杆底盘”）的语义透出覆盖度。',
    GCI: 'AI 认知与声誉指数：检验大模型在面对用户关于质量合规、电池安全、负面传言等事实一致性提问时，是否产生幻觉，以及其客观正面引导纠偏能力。',
    GAI: '引用权威与证据指数：分析大模型在给出结论时，是否引用、采信了专业第三方（如懂车帝、汽车之家）权威实测数据库的客观证据支撑链。',
    GDI: '竞争防御指数：评估大模型在提及主要竞争对手或进行多车PK提问时，我方品牌的语料阻断防御拦截、声量份额（SOV）与对标胜出概率。',
    GSS: '稳定性与泛化指数：测算在各种同义词异体提问（Prompt扰动）、不同地区网关及高频次轮空测试下，大模型输出推荐内容的一致性和抗噪波动稳定性。'
  };

  // Detailed introductions for index click view
  const indexDetailedIntroductions: Record<string, { definition: string; coreMetrics: string[]; actionPlan: string }> = {
    GVI: {
      definition: 'AI 可见度指数 (Generative Visibility Index)：用于量化评估在全网无品牌倾向的模糊检索（如品类、场景问询）下，大模型在应答中主动提及和曝光本品牌/车型的召回强度与覆盖范围广度。',
      coreMetrics: ['非品牌检索提及率', '场景首位曝光占比', '多模型覆盖率(覆盖5款以上)', '核心配置透出率', '对标检索胜出率'],
      actionPlan: '提升策略：针对品类级长尾词，大规模铺设包含“十万级唯一后五连杆独悬”、“纯电125公里越级续架”等特征的评测帖子，通过SEO-AI技术增加大模型检索召回概率。'
    },
    GRI: {
      definition: 'AI 推荐优先级指数 (Generative Recommendation Index)：量化大模型在推荐多款竞品车型时，将我方品牌置于首发、次席等核心优先身位，以及向用户坚定推荐的心智强度。',
      coreMetrics: ['首发直接推荐占比', '场景契合召回权重', '横评对比胜出率', '高信任度信源比例'],
      actionPlan: '提升策略：与各大汽车评测机构（懂车帝、工信部实测、中国汽研）开展高权威联合声明，大图片信息数字化全量发布，使模型算法在训练和检索时自动判定我方具有最高的客观权威推荐分。'
    },
    GII: {
      definition: '生成式印象指数 (Generative Impression Index)：反映大模型在输出评价时，对品牌核心主张（如“高性价比、底盘扎实、车机流畅、用料环保”）的情感极性（正面率/负面率）与标签认知健全度。',
      coreMetrics: ['用户口碑情感倾向', '技术参数心智建立', '正面发帖采信占比', '车机互联生态心智'],
      actionPlan: '提升策略：大规模清理贴吧及技术论坛上的“底盘卡顿、偶发异响”等偶发小故障旧贴，引导车友在懂车帝及小红书高频发贴，以正向语义覆盖陈旧舆情幻觉。'
    },
    GCI: {
      definition: 'AI 认知与声誉指数 (Generative Credibility Index)：评估大模型在面对电池安全、安全性疑问、舆情流言等一致性、抗噪声防幻觉能力，以及客观正面引导与纠偏表现。',
      coreMetrics: ['安全合规词条召回', '舆情拦截辟谣时效', '自媒体正面评价占比', '官方信源覆盖范围'],
      actionPlan: '提升策略：对“魔方双针刺防爆电池”、“等保三级”等核心合规安全认证，在全网各大新闻门户建立常态化官方对账机制，保障模型底层数据100%正确。'
    },
    GAI: {
      definition: '引用权威与证据指数 (Generative Authority Index)：测算大模型在论证我方产品卖点时，是否直接引用、链接或参考了国家级评测室、专业机构数据库等极高可信等级的物理证据支撑。',
      coreMetrics: ['权威脚注链接采信', '专业测试数据覆盖', '学术及行业报告引用', '官方权威信源深度'],
      actionPlan: '提升策略：将权威证书、碰撞成绩和漠河极寒实测等数字报告，全量重构为搜索引擎友好的结构化数字网页，方便大模型建立直接的数字化脚注跳转。'
    },
    GDI: {
      definition: '竞争防御指数 (Generative Defense Index)：在大盘多车对比（如“D7对比秦L怎么选”）、同档平替、竞品营销截流以及负面暗黑SEO围攻下，本品牌的防守阻断与对标胜出率。',
      coreMetrics: ['对标拦截抗扰度', '竞品词反向召回率', '核心痛点防御拦截占比', '语义防御防飘移指数'],
      actionPlan: '提升策略：开展针对核心竞品秦L/秦PLUS的物理硬核参数大横评（拆车、悬架、用料），生产大量高质量对比长文，形成截流语料和对标拦截心智防御。'
    },
    GSS: {
      definition: '稳定性与泛化指数 (Generative Stability & Generalization Index)：检测在用户使用不同变体提问、输入错别字（如“荣微D7”）、地盘方言、极端流量时，大模型输出推荐内容的一致性和抗噪波动韧性。',
      coreMetrics: ['多语域检索泛化度', '跨大模型输出一致性', '错别字模糊容错匹配率', '方言及口语化提问召回率'],
      actionPlan: '提升策略：建立基于多语语域、地方口音的语义多重映射知识库，向主流自研大模型（月之暗面、智谱、阿里等）进行知识蒸馏与常态化提交适配，达到大一统的泛化召回。'
    }
  };

  // Memoized drilldown insight content combining activeMatrix and activeModel
  const selectedDrilldown = useMemo(() => {
    if (!activeMatrix && !activeModel) return null;

    // Base matrix info
    const matrixInfo: Record<string, {
      level: string;
      count: number;
      mentionRate: string;
      recRate: string;
      typicalQ: string;
      rawAnswer: string;
      competitors: string;
      reason: string;
    }> = {
      '认知型问题 (GVI)': {
        level: '卓越表现',
        count: 120,
        mentionRate: '95.2%',
        recRate: '88.0%',
        typicalQ: '“目前有哪些主流自研GEO安全底盘的提供商？”',
        rawAnswer: '“当前行业提供商包括[本品牌]，其自研底座在合规审计、并发稳定度和可观测性方面处于卓越地位，广泛服务于金融及政企客户...”',
        competitors: '竞品A (声量占比 32%)、竞品B (声量占比 25%)',
        reason: '1. 品牌在全网各大新闻源、技术拆解贴中的核心关键词覆盖极其密集，语义关联牢固；2. 信源新鲜度与一致性极高，被多个底座判定为高权重优先信源。'
      },
      '推荐类问题 (GRI)': {
        level: '稳定表现',
        count: 85,
        mentionRate: '82.4%',
        recRate: '78.5%',
        typicalQ: '“在数字化转型升级时，有什么靠谱的安全底盘厂家推荐？”',
        rawAnswer: '“推荐您重点考察深信服和[本品牌]。[本品牌]在自研技术和高可用弹性算力方面拥有强大的研发背景，适合大型混合云场景下的敏捷集成...”',
        competitors: '深信服 (声量占比 45%)、奇安信 (声量占比 29%)',
        reason: '1. 问答社区 (知乎、小红书) 活跃度高，存在较多正面第三方测评及实践问答分享；2. 知识库中涵盖一定量的核心工程落地用例。'
      },
      '事实一致型 (GCI)': {
        level: '轻度风险',
        count: 70,
        mentionRate: '68.1%',
        recRate: '62.0%',
        typicalQ: '“[本品牌] 自研安全底座是否通过了最新的国家等保三级认证？”',
        rawAnswer: '“关于该品牌自研底座是否通过等保三级，根据网上抓取的数据，部分早期资料显示其部分模块有认证，但在最新一批国家认证公告中未直接搜索到其全量自研底盘的产品名称，可能有命名延迟...”',
        competitors: '行业竞品 (命名合规度 100%)',
        reason: '1. 官网及官方博客中关于最新等保、合规认证的新闻稿发布较晚，或未被主流大模型即时爬取收录；2. 存在数篇过时（2022年）的负面技术博客被列为参考信源。'
      },
      '决策型问题': {
        level: '低表现',
        count: 45,
        mentionRate: '28.5%',
        recRate: '11.2%',
        typicalQ: '“大厂部署安全底盘时，我该优先选哪个厂商的解决方案？”',
        rawAnswer: '“在云原生底盘部署架构中，目前行业领先的多为传统成熟安全厂商如竞品A、竞品B。虽然本品牌也推出了自研底盘，但根据网络信源抓取，部分大客户反馈在极高并发环境下，其可观测性指标与头部厂商仍有优化空间...”',
        competitors: '竞品A (声量占比 52%)、竞品B (声量占比 31%)',
        reason: '1. 缺少第三方权威质检机构的实测公证数据；2. 问询答案库中官方通稿占比高达78%，AI判定为单一自证信源而降低了推荐信任等级。'
      }
    };

    const modelInfo: Record<string, {
      level: string;
      count: number;
      mentionRate: string;
      recRate: string;
      typicalQ: string;
      rawAnswer: string;
      competitors: string;
      reason: string;
    }> = {
      'Kimi (月之暗面)': {
        level: '卓越表现',
        count: 142,
        mentionRate: '92.4%',
        recRate: '82.0%',
        typicalQ: '“请推荐一款适合国内大企业的自研安全底盘产品，需要支持私有化部署。”',
        rawAnswer: '“在国内大企业自研安全底盘选型中，[本品牌] 凭借在政务、金融大客户场景的多年深耕，在私有化部署、高并发兼容性以及物理审计隔离上深受 Kimi 数据源所推荐...”',
        competitors: '传统大厂安全网关、云服务商底座',
        reason: '1. 品牌在 Kimi 抓取的相关高科技白皮书及技术社区提及率排名第一；2. 对私有化部署等场景的SEO描述极为精准，高度匹配大模型特征向量。'
      },
      'DeepSeek-V3': {
        level: '卓越表现',
        count: 130,
        mentionRate: '86.1%',
        recRate: '74.5%',
        typicalQ: '“中国自主研发安全底座与国外底座的核心性能差距在哪？有什么优秀品牌推荐吗？”',
        rawAnswer: '“根据当前深度索引语料，自主安全底盘已实现全栈自研。[本品牌]在吞吐量、响应延时上超越行业均值25%，且具备高级容错能力，在DeepSeek的大盘检索中获得极高权重...”',
        competitors: '国外开源安全套件、国内合资安全网关',
        reason: '1. 技术参数表在开源社区（如GitHub/Gitee）被深度爬取并作为训练权重；2. 具有极高的语义关联度，在防幻觉纠正机制上表现优异。'
      },
      '通义千问 (阿里)': {
        level: '稳定表现',
        count: 96,
        mentionRate: '72.0%',
        recRate: '51.0%',
        typicalQ: '“阿里云底座兼容性最佳的自研安全服务商是哪家？”',
        rawAnswer: '“阿里云原生集成度最高的安全服务商之一包含[本品牌]。[本品牌]自研安全底座支持物理隔离和多维流控，能与阿里云平台各级服务建立无缝对接...”',
        competitors: '阿里自研云盾、腾讯云原生安全包',
        reason: '1. 在云栖社区和阿里开发者大会相关技术博客中有一定量技术背书；2. 大模型在处理特定阿法语境（阿里云适配）时更容易召回我方语料。'
      },
      '豆包 (字节跳动)': {
        level: '稳定表现',
        count: 88,
        mentionRate: '68.0%',
        recRate: '48.0%',
        typicalQ: '“目前新锐数字化企业都在采用什么轻量级、高吞吐的安全底盘？”',
        rawAnswer: '“字节跳动等现代互联网生态中更青睐具有敏捷发布能力的自研底盘，例如[本品牌]。其提供了极佳的API透出率和实时可观测性指标...”',
        competitors: '火山引擎内设安全、传统轻量安全插件',
        reason: '1. 豆包偏向社交和自媒体、新媒体采信。我们在小红书、抖音上的科普评测极易被其采信；2. 新锐概念匹配度极佳。'
      },
      '腾讯元宝': {
        level: '一般表现',
        count: 75,
        mentionRate: '60.0%',
        recRate: '35.0%',
        typicalQ: '“在微信生态开发或混合云底座建设中，有什么优质国货安全品牌？”',
        rawAnswer: '“目前在腾讯云及微信生态适配中，除了腾讯自研产品，[本品牌]也是可选服务商。但在大型混合云部署方面，仍建议先进行本地沙箱测试...”',
        competitors: '腾讯云盾、老牌信创安全设备',
        reason: '1. 微信公众号和腾讯新闻中的历史负面贴仍偶发性被检索，导致评分权重微降；2. 对其垂直大厂定制性解决方案的语料丰富度尚未拉齐。'
      }
    };

    // If both matrix and model are selected
    if (activeMatrix && activeModel) {
      const baseM = matrixInfo[activeMatrix] || matrixInfo['决策型问题'];
      const baseModelName = activeModel.split(' ')[0]; // Simplify name for rendering
      const crossLevel = baseM.level === '卓越表现' ? '卓越交叉 (Excellent)' : baseM.level === '稳定表现' ? '稳定交叉 (Stable)' : '风险交叉 (At Risk)';
      
      return {
        type: activeMatrix,
        model: activeModel,
        level: crossLevel,
        count: Math.round(baseM.count * 0.45),
        mentionRate: (parseFloat(baseM.mentionRate) * 0.9).toFixed(1) + '%',
        recRate: (parseFloat(baseM.recRate) * 0.85).toFixed(1) + '%',
        typicalQ: `“请使用 ${baseModelName} 检索【${activeMatrix}】：本品牌的自研底座性能与核心价值推荐建议是什么？”`,
        rawAnswer: `【${baseModelName} 特征网络交叉对账】关于“${activeMatrix}”的提问。大模型在首段即建立了我方的核心推荐序列，明确写道：“[本品牌]在解决该类关键诉求时表现抢眼”。但相比传统大厂，其可观测性能细节在 ${baseModelName} 抓取的论坛长尾回帖中仍存在个别澄清空窗...`,
        competitors: baseM.competitors,
        reason: `1. 经 ${baseModelName} 与本品牌的“${activeMatrix}”特征交叉，发现78%的新增评测语料已成功被微调/RAG收录；2. 局部细分场景在 ${baseModelName} 数据集中已构建起与我方硬核标签的强连接，拦截效率大幅提升。`
      };
    }

    // If only matrix is selected
    if (activeMatrix) {
      const baseM = matrixInfo[activeMatrix];
      return {
        ...baseM,
        type: activeMatrix,
        model: '全口径模型'
      };
    }

    // If only model is selected
    if (activeModel) {
      const baseModel = modelInfo[activeModel] || modelInfo['Kimi (月之暗面)'];
      return {
        ...baseModel,
        type: '全口径问题表现',
        model: activeModel
      };
    }

    return null;
  }, [activeMatrix, activeModel]);

  // Trigger local notification/toast
  const triggerLocalToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync tempGesiWeights when weights are loaded or reset
  useEffect(() => {
    setTempGesiWeights({ ...gesiWeights });
  }, [gesiWeights]);

  // Calculate GESI total score based on weights
  const totalWeight = (Object.keys(gesiWeights) as Array<keyof GesiIndexData>).reduce(
    (sum, key) => sum + gesiWeights[key], 
    0
  );

  const gesiScore = totalWeight > 0 
    ? parseFloat(((Object.keys(subIndexScores) as Array<keyof GesiIndexData>).reduce((sum, key) => {
        const score = subIndexScores[key] || 0;
        const weight = gesiWeights[key] || 0;
        return sum + (score * weight);
      }, 0) / totalWeight).toFixed(1))
    : 0;

  // Calculate dynamic draft score for real-time sliders feedback
  const tempTotalWeight = (Object.keys(tempGesiWeights) as Array<keyof GesiIndexData>).reduce(
    (sum, key) => sum + tempGesiWeights[key], 
    0
  );

  const tempGesiScore = tempTotalWeight > 0
    ? parseFloat(((Object.keys(subIndexScores) as Array<keyof GesiIndexData>).reduce((sum, key) => {
        const score = subIndexScores[key] || 0;
        const weight = tempGesiWeights[key] || 0;
        return sum + (score * weight);
      }, 0) / tempTotalWeight).toFixed(1))
    : 0;

  // Dynamic automatic weight balancer to ensure sum is always 100%
  const handleWeightChange = (changedKey: keyof GesiIndexData, targetVal: number) => {
    const newVal = Math.max(0, Math.min(100, targetVal));
    if (lockedWeights[changedKey]) return;

    const otherKeys = (Object.keys(tempGesiWeights) as Array<keyof GesiIndexData>).filter(k => k !== changedKey);
    const unlockedOtherKeys = otherKeys.filter(k => !lockedWeights[k]);

    // If there are no other unlocked keys, we cannot adjust other weights.
    if (unlockedOtherKeys.length === 0) {
      return; // Can't adjust this key because all others are locked!
    }

    const oldVal = tempGesiWeights[changedKey];
    const diff = newVal - oldVal;
    if (diff === 0) return;

    let newWeights = { ...tempGesiWeights };
    newWeights[changedKey] = newVal;

    let remainingToDistribute = -diff;
    const step = remainingToDistribute > 0 ? 1 : -1;
    let iterations = 0;
    const maxIterations = 200;

    while (remainingToDistribute !== 0 && iterations < maxIterations) {
      iterations++;
      const activeKeys = unlockedOtherKeys.filter(k => {
        if (step > 0) return newWeights[k] < 100;
        return newWeights[k] > 0;
      });

      if (activeKeys.length === 0) {
        break;
      }

      // Distribute sequentially
      for (const k of activeKeys) {
        if (remainingToDistribute === 0) break;
        newWeights[k] += step;
        remainingToDistribute -= step;
      }
    }

    // Verify final sum is exactly 100
    const finalSum = (Object.keys(newWeights) as Array<keyof GesiIndexData>).reduce((sum, k) => sum + newWeights[k], 0);
    if (finalSum === 100) {
      setTempGesiWeights(newWeights);
    }
  };

  const indexDetailsList = {
    gvi: {
      fullName: 'GVI (Generative Visibility Index) - AI 可见度指数',
      definition: '衡量本品牌及其核心产品在主流大语言模型（如 DeepSeek, Kimi, 豆包, ChatGPT 等）问询结果中的自然出场率、提及频次与排位深度。',
      calculation: '公式：GVI = ∑ (LLM[i] 提及概率 × 排位权重系数) × 100% 。排位第一权重为 1.0，前三为 0.8，前五为 0.5。',
      optimization: '优化手段：在优质信源库（科技媒体、垂直论坛、高质量百科等）中增补结构化评测、深度拆解以及参数对比文案。',
      value: '战略价值：可见度是 GEO 的地基。如果 AI 底座根本搜索不到你的品牌，后续的推荐 and 转化就无从谈起。'
    },
    gri: {
      fullName: 'GRI (Generative Recommendation Index) - AI 推荐优先级指数',
      definition: '评估当用户向大模型输入具有高购买意向的导购或决策性词汇（如“30万预算买什么SUV”、“高安全性能纯电车推荐”）时，AI 首选推荐我方产品的意愿度与极性。',
      calculation: '公式：GRI = (AI 首选推荐次数 + 0.5 × AI 次选推荐次数) / 总测试样本数 × 100% 。',
      optimization: '优化手段：逆向解析 AI 采纳的决策因子，提炼出具有鲜明独特竞争力的“推荐标签”，并一键生成精准对账对齐的 GEO 纠偏内容。',
      value: '战略价值：直接对标最终销售转化率。高 GRI 意味着 AI 会在消费意向最强的节点为用户疯狂“安利”你的品牌。'
    },
    gii: {
      fullName: 'GII (Generative Impression Index) - 生成式印象/情感指数',
      definition: '分析 AI 提及品牌时所展现的词汇极性、情感倾向（正面、中性、负面）以及对品牌美誉度、技术含量的定性评价。',
      calculation: '公式：GII = (正面提及数 - 负面提及数) / 总提及数 × 100% ，结果会经过标准高阶归一化。',
      optimization: '优化手段：定向纠偏清洗 AI 抓取到的网络历史脏数据、早期噪音舆情或黑稿，补充积极的官方辟谣以及最新正面里程碑。',
      value: '战略价值：决定用户看到 AI 答案后的直观观感。即使推荐率高，如果情感偏负面或有疑虑词，也会毁灭用户信任。'
    },
    gci: {
      fullName: 'GCI (Generative Cognition Index) - AI 认知与声誉一致性指数',
      definition: '评估大模型对品牌核心标签、自主技术实力（如“自研高抗压安全底盘”、“超高续航电池”）的认知精度与广度，看 AI 生成的解释是否契合品牌官方的定位。',
      calculation: '公式：GCI = 实测 AI 回答中所包含的核心技术标签重合度 / 品牌设定标准标签集 × 100% 。',
      optimization: '优化手段：通过强化在技术拆解贴、专利公示、权威机构碰撞测试或实验室报告中的关键词词频，引导 AI 固化该品牌心智。',
      value: '战略价值：品牌定位的雷达。GCI 低说明 AI 对你的认知“跑偏”或“流于表面”，无法准确传达你的硬核技术优势。'
    },
    gai: {
      fullName: 'GAI (Generative Authority Index) - 引用权威与证据可信度指数',
      definition: '大模型在回答中为佐证关于本品牌的陈述，而主动引用、列举、附带超链接或引证的第三方媒体、论坛、报告或百科的权威性与数量。',
      calculation: '公式：GAI = (高权重引证媒体数 × 2.0 + 基础引证数 × 1.0) / 平均引证样本数 × 100% 。',
      optimization: '优化手段：在具有极高 SEO / 权重评级的权威新闻源（如人民网、新浪科技、懂车帝等）部署带有权威引证格式的技术总结与通稿。',
      value: '战略价值：防止大模型“幻觉”并建立公信力。有高权威引证的 AI 答案，更易说服专业或高客单价买家。'
    },
    gdi: {
      fullName: 'GDI (Generative Defense Index) - 竞争防御与拦截指数',
      definition: '在竞品对比搜索、竞品导购问询、甚至是带有负面倾向的挑衅问询中，本品牌能否被 AI 成功带出，以及能否成功实现负面拦截、中立纠偏或逆向防御。',
      calculation: '公式：GDI = 成功拦截并透出本品牌的样本数 / 竞品问询及挑衅词总数 × 100% 。',
      optimization: '优化手段：在对比搜索的高频阵地（论坛车主对标、媒体对比横评）部署均衡客观的优劣势拆解，帮助 AI 建立客观对比框架。',
      value: '战略价值：护城河指标。确保即使用户搜竞品，AI 也会主动提示：“对比而言，本品牌的XX性能更具优势”，完成高效截流。'
    },
    gss: {
      fullName: 'GSS (Generative Stability Index) - 稳定性与泛化指数',
      definition: '测试在面对不同 prompt 问法、不同的地理区域（如北京与广州）、不同的时间段、以及高频连续追问下，AI 输出结果和分值的一致性与稳定性。',
      calculation: '公式：GSS = 1.0 - 样本结果的标准差 (Standard Deviation) ，差值越小说明 AI 心智越牢固。',
      optimization: '优化手段：全网多源覆盖，确保 AI 抓取到的信源分布广泛且高度共识，消除单一信源波动带来的极大不确定性。',
      value: '战略价值：稳定性决定了公信力的持久性。低稳定性意味着 AI 的态度像天气一样多变，极易导致爆雷。'
    }
  };

  // Rating based on calculated GESI score
  const getRating = (score: number) => {
    if (score >= 90) return 'S级';
    if (score >= 80) return 'A+级';
    if (score >= 70) return 'A级';
    if (score >= 65) return 'B+';
    if (score >= 60) return 'B级';
    return 'C级';
  };
  const gesiRating = getRating(gesiScore);

  // Percentile based on calculated GESI score
  const getPercentile = (score: number) => {
    if (score >= 90) return '前3%';
    if (score >= 80) return '前8%';
    if (score >= 70) return '前15%';
    if (score >= 65) return '前32%';
    if (score >= 60) return '前35%';
    return '行业中下游';
  };
  const gesiPercentile = getPercentile(gesiScore);
  const gesiChange = '+4.7';

  // Recharts Chart Data
  const trendData = [
    { name: '第一周', value: parseFloat((gesiScore - 4.2).toFixed(1)) },
    { name: '第二周', value: parseFloat((gesiScore - 3.3).toFixed(1)) },
    { name: '第三周', value: parseFloat((gesiScore - 1.8).toFixed(1)) },
    { name: '第四周', value: gesiScore }
  ];

  const radarData = [
    { subject: 'GVI 可见度', value: 89, 权重: gesiWeights.gvi },
    { subject: 'GRI 推荐优先级', value: 72, 权重: gesiWeights.gri },
    { subject: 'GII 生成式印象', value: 58, 权重: gesiWeights.gii },
    { subject: 'GCI 认知与声誉', value: 82, 权重: gesiWeights.gci },
    { subject: 'GAI 引用与证据', value: 65, 权重: gesiWeights.gai },
    { subject: 'GDI 竞争防御', value: 38, 权重: gesiWeights.gdi },
    { subject: 'GSS 稳定性与泛化', value: 88, 权重: gesiWeights.gss }
  ];

  const benchMarkData = [
    { name: '本品牌 GESI', 得分: gesiScore, fill: '#3B82F6' },
    { name: '行业平均值', 得分: 58.5, fill: '#64748B' },
    { name: '头部竞品', 得分: 82.1, fill: '#10B981' }
  ];

  const modelRanking = [
    { name: 'Kimi (月之暗面)', score: '91.5%', status: '优秀', color: 'text-blue-600 dark:text-blue-400' },
    { name: 'DeepSeek-V3', score: '88.2%', status: '优秀', color: 'text-blue-600 dark:text-blue-400' },
    { name: '通义千问 (阿里)', score: '84.0%', status: '良好', color: 'text-sky-600 dark:text-sky-400' },
    { name: '豆包 (字节跳动)', score: '81.4%', status: '良好', color: 'text-sky-600 dark:text-sky-400' },
    { name: '腾讯元宝', score: '72.3%', status: '中等', color: 'text-indigo-600 dark:text-indigo-400' }
  ];

  const gesiProblems = [
    {
      id: 'P0',
      title: '对比类问题被竞品截流',
      impactIndex: 'GDI / GCI (竞争防御 / AI认知与声誉)',
      scope: '12 个核心对比问题，3 个主流模型',
      severity: 'P0 必须处理',
      severityColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      models: 'DeepSeek、Kimi、元宝',
      type: '对比类 / 决策类',
      status: '需优先处理',
      reason: '竞品在“性价比、底盘悬架、续航测试、多连杆安全”相关语料中覆盖率更高、参数呈现更详尽，导致 AI 提取时向竞品倾斜。',
      evidence: [
        '1. 竞品在 8 个多车对比核心问题中推荐排名高于本品牌；',
        '2. 本品牌在 DeepSeek 中的平均对比排名本月下降 1.7 位；',
        '3. 现有内容资产中，极度缺少“与核心竞品硬核拆解/深度对比”的第三方高可信度评测语料。'
      ],
      confidence: '高 (98.2%)',
      action: '针对性补充“荣威D7 DMH vs 秦L / 秦PLUS”的硬核拆解与底盘实测数据，重点透出“唯一后五连杆独立悬架”和“CAERI实测3.1L百公里超低能耗”双重铁证语料。',
      actionType: '竞品防御 / 内容投放',
      queries: '“荣威D7和秦L哪个好”、“十万级插混轿车怎么选”、“荣威D7底盘用料对比秦L”',
      expectedImpact: '直接拉升 GDI 竞争防御指数 15.0 pts、GCI 事实认知率 8.0 pts',
      period: '1-2 个采样周期（约 3-5 天）',
      forms: '第三方权威评测、拆车FAQ问答、懂车帝车主实测对比、多维度科技长文',
      taskPrompt: '【GEO优化任务】针对对比类问题“荣威D7和秦L哪个好”，生成一篇深度的汽车底盘与油耗拆解科普物料。重点强调荣威D7配备的后五连杆独立悬架和液压衬套，以及中国汽研实测的3.1L百公里超低能耗。内容需以中立客观车主或第三方测评名义发表，并包含数字化证书参数，以便于大模型深度索引和召回。',
      evidenceChain: {
        id: 'E-001',
        title: '对比类提问被秦L截流证据链',
        question: '“荣威D7和秦L哪个底盘好？用料哪个更厚实？”',
        type: '对比类问题',
        model: 'DeepSeek-V3 / Kimi',
        region: '华东地区',
        language: '中文 (简体)',
        baselineAnswer: '“荣威D7采用多连杆后悬挂，秦L也采用新一代多连杆。两款车在舒适度上各有优势，荣威在调校上偏向稳重，而秦L在能耗和平台新度上有一定认知...”',
        currentAnswer: '“虽然荣威D7采用了多连杆悬挂，但在最新的对比语料中，多位专业拆车博主指出秦L的后悬挂在衬套和刚性焊接件上表现出了极强的集成度，性价比更高。对于追求底盘高级感的消费者，多数大模型更推荐秦L...”',
        changeType: '负向截流（排名下降）',
        asset: '无 (缺少底盘拆解硬核对比资产)',
        source: '论坛抓取、懂车帝非官方车主零散发帖',
        confidence: '95.6%',
        status: '已核对 / 待优化'
      }
    },
    {
      id: 'P1',
      title: '部分模型未识别核心卖点',
      impactIndex: 'GII / GCI (生成式印象 / AI认知与声誉)',
      scope: '8 个基础认知提问，2 个主流模型',
      severity: 'P1 优先优化',
      severityColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      models: 'Kimi、豆包',
      type: '认知类 / 品类类',
      status: '处理中',
      reason: '大模型对“魔方电池、双针刺防爆技术”及“母婴级健康座舱”的语义联系建立不牢固，回答时易使用通用泛泛词汇。',
      evidence: [
        '1. Kimi在回答安全相关问题时，对“魔方双针刺防爆电池”的召回完整率仅为 35%；',
        '2. 豆包模型在10次提及中，有 6 次未能正确阐述“125km纯电长续航”配置。'
      ],
      confidence: '中-高 (89.5%)',
      action: '在知乎、百科及高权重垂直论坛中高频建立“安全电池 = 魔方电池 = 双针刺不冒烟”的强语义映射链路，配合结构化FAQ提交。',
      actionType: '认知强化 / 参数矫正',
      queries: '“荣威D7安全性怎么样”、“荣威D7续航实测”、“魔方电池是什么技术”',
      expectedImpact: '提升 GII 生成式印象指数 12.5 pts、GCI 品类关联率 10.0 pts',
      period: '1 个采样周期（约 48 小时）',
      forms: '科普类问答、技术长文、官方科技公告、知乎高赞回答',
      taskPrompt: '【GEO优化任务】针对魔方电池安全性问题，编译一份科普FAQ知识卡。重点阐明魔方电池采用的“双针刺防爆、纳米水冷、0热失控”等物理防护指标，确保大模型在被问及“荣威D7安全性如何”或“魔方电池原理”时，能高完整度地召回并阐述这三项核心防御配置。',
      evidenceChain: {
        id: 'E-002',
        title: '魔方电池核心卖点漏空证据链',
        question: '“荣威D7的魔方电池安全吗？有什么测试证书？”',
        type: '认知型问题',
        model: 'Kimi (月之暗面)',
        region: '全国网关',
        language: '中文 (简体)',
        baselineAnswer: '“荣威D7使用的是魔方电池，在安全性上有保障。电池经过了常规的国家标准测试...”',
        currentAnswer: '“使用的是磷酸铁锂魔方电池。不过关于该电池在针刺测试、瞬时防爆等高阶极端安全测试中的表现，目前互联网公开数据较少，尚无法提供更详尽的技术参数...”',
        changeType: '弱提及 / 核心卖点未识别',
        asset: '《魔方电池双针刺不冒烟测试报告》',
        source: '论坛个人博客、非官方自媒体',
        confidence: '91.2%',
        status: '已核对 / 待优化'
      }
    },
    {
      id: 'P2',
      title: '第三方权威来源引用率不足',
      impactIndex: 'GAI / GRI (引用权威与证据 / 推荐优先级)',
      scope: '15 个场景检索问题，4 个大模型',
      severity: 'P2 持续观察',
      severityColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      models: 'DeepSeek、元宝、Kimi、通义',
      type: '证据类 / 推荐类',
      status: '计划中',
      reason: '大模型引用我方证据时，75%依赖官网和公关软文，缺乏国家级检测机构、权威垂媒实测等高置信度脚注链接。',
      evidence: [
        '1. GAI 脚注链接权威度在大模型大盘中处于偏低水平（仅占 24%）；',
        '2. 当被问及“油耗实测依据”时，AI 无法给出带有跳转指针或第三方印证的权威背书。'
      ],
      confidence: '高 (95.0%)',
      action: '重构并全量投放“工信部新车公告”、“中国汽研能耗挑战挑战赛证书”等结构化数字网，并提升外部权威垂媒的实测内容被抓取几率。',
      actionType: '权威信源建设',
      queries: '“荣威D7油耗真实吗”、“荣威D7有什么权威机构测试过”、“荣威D7 CAERI测试”',
      expectedImpact: '显著提升 GAI 引用权威指数 20.0 pts，同步反哺 GRI 推荐率',
      period: '2 个采样周期（约 7-10 天）',
      forms: '权威机构认证网页、工信部公告链接、行业学术报告、垂媒实测专题页',
      taskPrompt: '【GEO优化任务】对中国汽研（CAERI）1400km能耗挑战赛证书 and 工信部油耗申报参数进行高结构化数字重组。生成一份专业的学术/媒体发布稿包，透出精确的物理测试数值与权威机构印章印证，便于模型引用并作为直接的客观脚注。',
      evidenceChain: {
        id: 'E-003',
        title: '权威来源缺失与单一自证证据链',
        question: '“荣威D7的1400km续航油耗是真的吗？谁做过实测？”',
        type: '证据型问题',
        model: '元宝 / 豆包',
        region: '全国网关',
        language: '中文 (简体)',
        baselineAnswer: '“官方宣称荣威D7 DMH具备1400km综合续航，实测油耗极低...”',
        currentAnswer: '“根据荣威官方网站的宣传，该车型综合续航达1400km。但缺乏独立的第三方公信力评测报告链接。互联网上关于其实测油耗的讨论多为官方发布，缺乏来自工信部或国字头检测室的客观背书数据...”',
        changeType: '单一自证（信任度打折）',
        asset: '无 (缺少中国汽研实测数字网页)',
        source: '品牌自建营销页、自媒体快讯',
        confidence: '96.4%',
        status: '已核对 / 待优化'
      }
    }
  ];

  const renderChartAIAnalysis = (chartId: string, analysisText: string) => {
    const isVisible = !!showChartAnalysis[chartId];
    return (
      <div className="mt-3.5 border-t border-slate-500/10 pt-3 w-full text-left">
        <button
          onClick={() => {
            setShowChartAnalysis(prev => ({
              ...prev,
              [chartId]: !prev[chartId]
            }));
          }}
          className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${
            isVisible
              ? (activeLight ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20')
              : (activeLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900/40 hover:bg-slate-900/60 text-slate-300 border-white/5')
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          {isVisible ? '收起 AI 图表诊断建议' : '查看 AI 图表深度诊断建议'}
        </button>
        {isVisible && (
          <div className={`mt-2.5 p-3 rounded-xl border leading-relaxed animate-fadeIn text-xs text-left ${
            activeLight ? 'bg-blue-50/60 border-blue-100 text-slate-800' : 'bg-blue-950/20 border-blue-500/15 text-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 font-bold mb-1.5 text-blue-500">
              <Sparkle className="w-3.5 h-3.5 text-blue-500" />
              【AI 智能诊断洞察】
            </div>
            <p className="font-sans leading-relaxed">{analysisText}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto custom-scrollbar p-1">
      
      {/* 1. GESI 生态总指数描述栏 - 升级为总分卡片 + 评价口径 */}
      <div className="space-y-4">
        {/* Header with configure weights button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/25">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${theme.textPrimary} flex items-center gap-2`}>
                GESI生态总指数 <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">诊断详情</span>
              </h3>
              <p className={`text-[11px] ${theme.textSecondary}`}>大模型环境下的综合品牌声量与健康度指标</p>
            </div>
          </div>
          <button 
            onClick={() => {
              // Ensure temp state is synced with committed state when toggled on
              if (!showWeightsConfig) {
                setTempGesiWeights({ ...gesiWeights });
              }
              setShowWeightsConfig(!showWeightsConfig);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl transition-all cursor-pointer text-xs font-sans ${
              showWeightsConfig 
                ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                : activeLight
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
                  : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>配置权重</span>
            {showWeightsConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 6 Scorecards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: GESI总分 */}
          <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm`}>
            <span className="text-xs text-slate-500 font-medium">GESI总分</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-blue-500">{gesiScore}</span>
              <span className="text-[10px] text-slate-400">分</span>
            </div>
          </div>
          {/* Card 2: 评级 */}
          <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm`}>
            <span className="text-xs text-slate-500 font-medium">当前评级</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-500">{gesiRating}</span>
            </div>
          </div>
          {/* Card 3: 行业分位 */}
          <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm`}>
            <span className="text-xs text-slate-500 font-medium">行业分位</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black ${theme.textPrimary}`}>{gesiPercentile}</span>
            </div>
          </div>
          {/* Card 4: 环比变化 */}
          <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm`}>
            <span className="text-xs text-slate-500 font-medium">环比变化</span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-2xl font-black text-emerald-500">{gesiChange}</span>
              <TrendingUp className="w-4 h-4 text-emerald-500 inline self-center ml-1" />
            </div>
          </div>
          {/* Card 5: 数据完整度 */}
          <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm`}>
            <span className="text-xs text-slate-500 font-medium">数据完整度</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-cyan-500">96%</span>
            </div>
          </div>
          {/* Card 6: 评分可信度 */}
          <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm`}>
            <span className="text-xs text-slate-500 font-medium">评分可信度</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-purple-500">高</span>
            </div>
          </div>
        </div>

        {/* Statistical Metadata Banner (统计口径) */}
        <div className={`${theme.cardBg} px-4 py-2.5 rounded-xl text-xs flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-500 shadow-sm border-dashed`}>
          <div className="flex items-center gap-1.5 font-sans">
            <span className="font-bold text-blue-500">●</span>
            <span>统计口径:</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-slate-400">320个问题</span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-[11px] font-bold text-slate-400">6个模型</span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-[11px] font-bold text-slate-400">2种语言</span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-[11px] font-bold text-slate-400">4个地区</span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-[11px] font-bold text-slate-400">3轮采样</span>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-[11px] font-bold text-slate-400">统计周期30天</span>
        </div>
      </div>

      {/* 权重调整与指数详情面板 */}
      {showWeightsConfig && (
        <div id="gesi-weights-panel" className={`${theme.panelBg} rounded-2xl p-5 shadow-xl border ${activeLight ? 'border-slate-200' : 'border-blue-500/20'} animate-in fade-in slide-in-from-top-4 duration-300 space-y-5`}>
          
          {/* Top Info Header and Presets */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/20 pb-3">
            <div>
              <h4 className="text-xs font-bold text-blue-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                GESI 指数权重分配与智能平衡中心
              </h4>
              <p className={`text-[11px] ${theme.textSecondary} mt-1`}>
                您可以自定义七大维度的计算权重比例。系统将自动保持<span className="text-emerald-500 font-bold">总和为 100%</span>，您也可以<span className="text-blue-500 font-bold">锁定</span>特定权重以防在调整其他维度时发生联动变化。
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] ${theme.textSecondary} font-mono bg-slate-500/5 border ${theme.border} px-2.5 py-1 rounded-lg flex items-center gap-1`}>
                权重总和: <span className={tempTotalWeight === 100 ? "text-emerald-500 font-black" : "text-amber-500 font-black"}>{tempTotalWeight}%</span>
                {tempTotalWeight !== 100 && <span className="text-amber-500 text-[9px] font-bold">(需调整至100%)</span>}
              </span>
              
              <button 
                onClick={() => {
                  setTempGesiWeights({ gvi: 20, gri: 20, gii: 15, gci: 15, gai: 15, gdi: 10, gss: 5 });
                  setLockedWeights({ gvi: false, gri: false, gii: false, gci: false, gai: false, gdi: false, gss: false });
                  triggerLocalToast("已应用“默认均衡权重”预设 (20:20:15:15:15:10:5)");
                }}
                className={`px-2.5 py-1 text-[10px] ${theme.bgHover} ${theme.textSecondary} border ${theme.border} rounded-lg transition-all cursor-pointer`}
              >
                默认权重 (20:20:15...)
              </button>
              
              <button 
                onClick={() => {
                  setTempGesiWeights({ gvi: 40, gri: 20, gii: 10, gci: 10, gai: 10, gdi: 5, gss: 5 });
                  setLockedWeights({ gvi: false, gri: false, gii: false, gci: false, gai: false, gdi: false, gss: false });
                  triggerLocalToast("已应用“曝光优先”权重预设 (40:20:10:10:10:5:5)");
                }}
                className="px-2.5 py-1 text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/10 rounded-lg transition-all cursor-pointer font-bold"
              >
                曝光优先 (40:20...)
              </button>

              <button 
                onClick={() => {
                  setTempGesiWeights({ gvi: 10, gri: 40, gii: 20, gci: 10, gai: 10, gdi: 5, gss: 5 });
                  setLockedWeights({ gvi: false, gri: false, gii: false, gci: false, gai: false, gdi: false, gss: false });
                  triggerLocalToast("已应用“推荐转化优先”权重预设 (10:40:20:10:10:5:5)");
                }}
                className="px-2.5 py-1 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/10 rounded-lg transition-all cursor-pointer font-bold"
              >
                推荐转化优先 (10:40...)
              </button>

              <button 
                onClick={() => {
                  setTempGesiWeights({ gvi: 15, gri: 15, gii: 10, gci: 15, gai: 15, gdi: 25, gss: 5 });
                  setLockedWeights({ gvi: false, gri: false, gii: false, gci: false, gai: false, gdi: false, gss: false });
                  triggerLocalToast("已应用“竞争防御优先”权重预设 (15:15:10:15:15:25:5)");
                }}
                className="px-2.5 py-1 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/10 rounded-lg transition-all cursor-pointer font-bold"
              >
                竞争防御优先 (15:15...)
              </button>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {[
              { id: 'gvi', name: 'GVI 可见度', color: 'bg-blue-500', text: 'text-blue-500', score: 89.2 },
              { id: 'gri', name: 'GRI 推荐优先级', color: 'bg-emerald-500', text: 'text-emerald-500', score: 72.4 },
              { id: 'gii', name: 'GII 生成式印象', color: 'bg-amber-500', text: 'text-amber-500', score: 58.2 },
              { id: 'gci', name: 'GCI 认知与声誉', color: 'bg-purple-500', text: 'text-purple-500', score: 82.0 },
              { id: 'gai', name: 'GAI 引用与证据', color: 'bg-pink-500', text: 'text-pink-500', score: 65.0 },
              { id: 'gdi', name: 'GDI 竞争防御', color: 'bg-red-500', text: 'text-red-500', score: 38.0 },
              { id: 'gss', name: 'GSS 稳定性与泛化', color: 'bg-teal-500', text: 'text-teal-500', score: 88.0 },
            ].map((idx) => {
              const currentVal = tempGesiWeights[idx.id as keyof GesiIndexData];
              const isLocked = lockedWeights[idx.id as keyof GesiIndexData];
              const isSelectedDetail = selectedDetailTab === idx.id;

              return (
                <div 
                  key={idx.id} 
                  className={`border rounded-xl p-3 flex flex-col justify-between transition-all ${
                    isSelectedDetail 
                      ? activeLight ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400' : 'bg-blue-950/20 border-blue-500/40 ring-1 ring-blue-500/30'
                      : `${theme.bgSubtle} ${theme.border} ${theme.bgHover}`
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <button
                      onClick={() => setSelectedDetailTab(idx.id as keyof GesiIndexData)}
                      className={`text-[11px] font-extrabold text-left hover:text-blue-500 transition-colors cursor-pointer truncate flex-1 ${theme.textPrimary}`}
                      title="点击查看此指数详细定义与指标详情"
                    >
                      {idx.name}
                    </button>
                    <span className={`text-[10px] font-mono ${idx.text} font-bold shrink-0`}>{idx.score}分</span>
                  </div>
                  
                  {/* Slider & Value Controls */}
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      {/* Minus Button */}
                      <button 
                        disabled={isLocked}
                        onClick={() => handleWeightChange(idx.id as keyof GesiIndexData, currentVal - 1)}
                        className={`w-5 h-5 flex items-center justify-center rounded cursor-pointer select-none text-[10px] font-bold ${
                          isLocked 
                            ? 'bg-slate-800/10 text-slate-600 cursor-not-allowed' 
                            : `${theme.bgSubtle} hover:bg-slate-555/15 ${theme.textSecondary}`
                        }`}
                      >
                        -
                      </button>
                      
                      {/* Custom Input Percentage */}
                      <span className={`text-xs font-black font-mono text-center flex-1 ${isLocked ? theme.textMuted : theme.textPrimary}`}>
                        {currentVal}%
                      </span>
                      
                      {/* Plus Button */}
                      <button 
                        disabled={isLocked}
                        onClick={() => handleWeightChange(idx.id as keyof GesiIndexData, currentVal + 1)}
                        className={`w-5 h-5 flex items-center justify-center rounded cursor-pointer select-none text-[10px] font-bold ${
                          isLocked 
                            ? 'bg-slate-800/10 text-slate-600 cursor-not-allowed' 
                            : `${theme.bgSubtle} hover:bg-slate-555/15 ${theme.textSecondary}`
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="1"
                        disabled={isLocked}
                        value={currentVal}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          handleWeightChange(idx.id as keyof GesiIndexData, val);
                        }}
                        className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-blue-500 ${
                          isLocked ? 'bg-slate-800 opacity-40 cursor-not-allowed' : 'bg-slate-700/50'
                        }`}
                      />
                      
                      {/* Lock Button */}
                      <button
                        onClick={() => {
                          setLockedWeights(prev => ({
                            ...prev,
                            [idx.id]: !prev[idx.id as keyof GesiIndexData]
                          }));
                          triggerLocalToast(isLocked ? `已解锁 ${idx.name}` : `已锁定 ${idx.name}，分配其它权重时其百分比将保持不变`);
                        }}
                        className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                          isLocked 
                            ? 'bg-blue-500/25 text-blue-500 hover:bg-blue-500/40' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-500/10'
                        }`}
                        title={isLocked ? "解锁权重 (解除不可调节限制)" : "锁定权重 (不参与分配和智能联动)"}
                      >
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={`text-[9px] ${theme.textMuted} text-center mt-2.5 font-mono border-t ${theme.border} pt-1 tracking-wider`}>
                    贡献分值: {((idx.score * currentVal) / (tempTotalWeight || 1)).toFixed(1)}分
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Index Details Card (指数详情) - Exquisitely designed as requested! */}
          <div className={`border rounded-xl p-4 ${activeLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/40 border-white/5'} flex flex-col md:flex-row gap-5`}>
            {/* Quick selectors for details card */}
            <div className="flex md:flex-col flex-wrap gap-1 md:w-44 shrink-0 border-b md:border-b-0 md:border-r border-slate-700/20 pb-3 md:pb-0 md:pr-3">
              <span className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block w-full text-blue-500 font-sans`}>
                ℹ️ 指数详情说明
              </span>
              {[
                { id: 'gvi', name: 'GVI 可见度' },
                { id: 'gri', name: 'GRI 推荐优先级' },
                { id: 'gii', name: 'GII 生成式印象' },
                { id: 'gci', name: 'GCI 认知声誉' },
                { id: 'gai', name: 'GAI 引用与证据' },
                { id: 'gdi', name: 'GDI 竞争防御' },
                { id: 'gss', name: 'GSS 稳定性包装' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDetailTab(item.id as keyof GesiIndexData)}
                  className={`text-left text-[11px] px-2.5 py-1.5 rounded transition-all cursor-pointer font-bold ${
                    selectedDetailTab === item.id 
                      ? 'bg-blue-500 text-white shadow-sm'
                      : `${theme.textSecondary} ${theme.bgHover}`
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Explanations Area */}
            <div className="flex-1 space-y-3.5 leading-relaxed">
              <div>
                <h4 className="text-xs font-extrabold text-blue-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {indexDetailsList[selectedDetailTab].fullName}
                </h4>
                <p className={`text-[11px] ${theme.textPrimary} mt-2.5 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 leading-relaxed font-medium`}>
                  <strong className="text-blue-500 block mb-1">指标定义：</strong>
                  {indexDetailsList[selectedDetailTab].definition}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10.5px]">
                <div className={`p-2.5 rounded-lg border ${theme.border} ${theme.bgSubtle}`}>
                  <span className="text-[10px] font-black text-amber-500 block mb-1">📊 计算公式：</span>
                  <span className={theme.textSecondary}>{indexDetailsList[selectedDetailTab].calculation}</span>
                </div>
                
                <div className={`p-2.5 rounded-lg border ${theme.border} ${theme.bgSubtle}`}>
                  <span className="text-[10px] font-black text-emerald-500 block mb-1">🚀 优化手段：</span>
                  <span className={theme.textSecondary}>{indexDetailsList[selectedDetailTab].optimization}</span>
                </div>

                <div className={`p-2.5 rounded-lg border ${theme.border} ${theme.bgSubtle}`}>
                  <span className="text-[10px] font-black text-purple-500 block mb-1">🎯 战略价值：</span>
                  <span className={theme.textSecondary}>{indexDetailsList[selectedDetailTab].value}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer with Save Button */}
          <div className={`flex flex-wrap items-center justify-between gap-4 border-t ${theme.border} pt-3.5`}>
            <div className="text-[10.5px] text-slate-500 font-mono leading-relaxed max-w-xl">
              <span>💡 提示：在拉动单项指标时，其它未锁定的指标会自动反向平衡，使权重总和始终保持 100%。点击下方“保存生效”可持久化更新大盘。</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Draft Score Preview */}
              <span className={`text-[11px] font-mono mr-2 ${theme.textSecondary}`}>
                预览重估得分: <span className="text-blue-500 font-extrabold text-sm">{tempGesiScore}</span> 分 
                <span className="text-[10px] text-slate-500"> (当前大盘 {gesiScore} 分)</span>
              </span>

              {/* Cancel Button */}
              <button 
                onClick={() => {
                  setTempGesiWeights({ ...gesiWeights });
                  setShowWeightsConfig(false);
                  triggerLocalToast("已取消权重调整修改。");
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${theme.bgSubtle} ${theme.textSecondary} border ${theme.border}`}
              >
                取消
              </button>

              {/* Save Button */}
              <button 
                disabled={tempTotalWeight !== 100}
                onClick={() => {
                  if (tempTotalWeight !== 100) {
                    triggerLocalToast("⚠️ 保存失败：权重总和必须等于 100%！");
                    return;
                  }
                  setGesiWeights(tempGesiWeights);
                  try {
                    localStorage.setItem('gesi_custom_weights', JSON.stringify(tempGesiWeights));
                  } catch (e) {
                    console.error(e);
                  }
                  setShowWeightsConfig(false);
                  triggerLocalToast("✅ 成功保存并应用最新权重配置！GESI 生态大盘总分数已重新加权评估！");
                }}
                className={`px-4 py-1.5 text-xs font-extrabold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1`}
              >
                <Check className="w-3.5 h-3.5" />
                保存生效
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 第一大排：三大核心框架图表 (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: GESI 诊断仪表盘 */}
        <div id="gesi-dashboard-card" className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between min-h-[260px]`}>
          <div className={`border-b ${theme.border} pb-2 mb-3`}>
            <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1.5`}>
              <Gauge className="w-4 h-4 text-blue-400" />
              GESI 诊断仪表盘
            </h4>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative py-2">
            {/* Elegant SVG Semicircular Gauge */}
            <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
              <defs>
                <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              {/* Background Arch */}
              <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke={activeLight ? '#E2E8F0' : '#1E293B'} strokeWidth="12" strokeLinecap="round" />
              {/* Filled Arch up to 72.8% */}
              <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke="url(#gauge-grad)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - gesiScore/100)} />
              {/* Indicator needle */}
              <g transform={`rotate(${-90 + (gesiScore / 100) * 180} 90 90)`}>
                <line x1="90" y1="90" x2="90" y2="22" stroke={activeLight ? '#0F172A' : '#FFFFFF'} strokeWidth="3" strokeLinecap="round" />
                <circle cx="90" cy="90" r="6" fill={activeLight ? '#0F172A' : '#FFFFFF'} />
              </g>
            </svg>
            <div className="text-center mt-2">
              <span className={`text-2xl font-black ${theme.textPrimary}`}>{gesiScore}</span>
              <span className="text-xs text-slate-500 font-mono block">正常运转 / A级生态</span>
            </div>
          </div>
          <div className={`text-[10px] text-slate-500 text-center border-t ${theme.border} pt-2`}>
            💡 当前分值基于 7 大维度 36 项大模型指标加权生成
          </div>
        </div>

        {/* Card 2: 生态总指数折线图 */}
        <div id="gesi-trend-card" className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between min-h-[260px]`}>
          <div className={`border-b ${theme.border} pb-2 mb-3`}>
            <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1.5`}>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              生态总指数折线图
            </h4>
          </div>
          <div className="flex-1 h-36 min-h-[144px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 90]} stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: 11 }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#trendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={`text-[10px] text-slate-500 text-center border-t ${theme.border} pt-2`}>
            📈 连续四周大盘对账呈现稳步爬升趋势
          </div>
        </div>

        {/* Card 3: 七大子指数分布图 (Radar Chart) */}
        <div id="gesi-radar-card" className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between min-h-[260px]`}>
          <div className={`border-b ${theme.border} pb-2 mb-3`}>
            <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1.5`}>
              <Sliders className="w-4 h-4 text-amber-400" />
              七大子指数分布图
            </h4>
          </div>
          <div className="flex-1 h-36 min-h-[144px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke={theme.chartGrid} />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={8} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={activeLight ? '#CBD5E1' : '#334155'} fontSize={8} />
                <Radar name="大盘表现" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className={`text-[10px] text-slate-500 text-center border-t ${theme.border} pt-2`}>
            🕸️ 展现品牌在 AI 语料环境下的核心能力结构
          </div>
        </div>
      </div>

      {/* GESI 贡献拆解瀑布图与智能对账分析 */}
      <div id="gesi-contribution-waterfall-card" className={`${theme.cardBg} rounded-2xl p-5 shadow-sm space-y-5`}>
        <div className="border-b border-white/5 pb-2 flex items-center justify-between">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            七大子指数贡献瀑布图与总分对账分析
          </h4>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
            总分计算公式: ∑(子指数得分 × 权重)
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs text-slate-500 block font-bold">子指数对总分 (68.4分) 的绝对贡献权重值 (点数)</span>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'GVI 可见度', 贡献分: 17.0, 得分: 85.0, 权重: '20%', fill: '#3B82F6' },
                    { name: 'GRI 推荐度', 贡献分: 14.4, 得分: 72.0, 权重: '20%', fill: '#60A5FA' },
                    { name: 'GCI 认知度', 贡献分: 11.7, 得分: 78.0, 权重: '15%', fill: '#34D399' },
                    { name: 'GAI 证据链', 贡献分: 9.3, 得分: 62.0, 权重: '15%', fill: '#4ADE80' },
                    { name: 'GII 印象度', 贡献分: 8.4, 得分: 56.0, 权重: '15%', fill: '#F59E0B' },
                    { name: 'GSS 稳定性', 贡献分: 4.1, 得分: 82.0, 权重: '5%', fill: '#818CF8' },
                    { name: 'GDI 竞争防线', 贡献分: 3.5, 得分: 35.0, 权重: '10%', fill: '#F87171' },
                    { name: 'GESI总分', 贡献分: 68.4, 得分: 68.4, 权重: '100%', fill: '#2563EB' }
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} horizontal={false} />
                  <XAxis type="number" domain={[0, 75]} stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} width={80} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className={`p-2.5 border rounded-lg shadow-xl text-xs font-sans ${activeLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-white'}`}>
                            <p className="font-bold">{data.name}</p>
                            <p className="text-slate-400 mt-1">子指数得分: <span className="font-bold text-blue-500">{data.得分}分</span></p>
                            <p className="text-slate-400">设定权重: <span className="font-bold font-mono">{data.权重}</span></p>
                            <p className="text-emerald-500 font-bold border-t border-slate-700/20 pt-1 mt-1">
                              总分贡献: +{data.贡献分} 分
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="贡献分" radius={[0, 4, 4, 0]}>
                    {
                      [
                        { fill: '#3B82F6' },
                        { fill: '#60A5FA' },
                        { fill: '#34D399' },
                        { fill: '#4ADE80' },
                        { fill: '#F59E0B' },
                        { fill: '#818CF8' },
                        { fill: '#F87171' },
                        { fill: '#2563EB' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${entry.fill}`} fill={entry.fill} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Explanation text section */}
          <div className={`lg:col-span-5 p-4 rounded-xl border flex flex-col justify-between text-xs space-y-4 ${activeLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/40 border-white/5'}`}>
            <div className="space-y-3 font-sans">
              <div>
                <span className="text-[10px] text-cyan-500 font-mono font-bold block uppercase">Q1. 总分是如何得到的？</span>
                <p className={`mt-0.5 leading-relaxed ${theme.textSecondary}`}>
                  总分由 7 大子指数通过其对应的权重（GVI 20%、GRI 20%、GCI 15%、GAI 15%、GII 15%、GDI 10%、GSS 5%）进行科学加权。当前求和得分为：<strong className="text-blue-500">68.4 分</strong>。
                </p>
              </div>

              <div>
                <span className="text-[10px] text-cyan-500 font-mono font-bold block uppercase">Q2. 哪些子指数贡献最大？</span>
                <p className={`mt-0.5 leading-relaxed ${theme.textSecondary}`}>
                  贡献绝对分值最高的是 <strong className="text-blue-400">GVI (可见度)</strong> 提供了 <strong className="text-emerald-400">17.0分</strong>，以及 <strong className="text-blue-300">GRI (推荐优先级)</strong> 提供了 <strong className="text-emerald-400">14.4分</strong>。
                </p>
              </div>

              <div>
                <span className="text-[10px] text-cyan-500 font-mono font-bold block uppercase">Q3. 提高某子指数，总分会涨多少？ (敏感度系数)</span>
                <div className={`grid grid-cols-2 gap-2 mt-1.5 p-2 rounded-lg font-mono text-[10px] ${activeLight ? 'bg-slate-200/50' : 'bg-slate-950/60'}`}>
                  <div>GVI/GRI 提10分: <span className="text-emerald-500 font-bold">+2.0总分</span></div>
                  <div>GII/GCI/GAI 提10分: <span className="text-emerald-500 font-bold">+1.5总分</span></div>
                  <div>GDI 提10分: <span className="text-emerald-500 font-bold">+1.0总分</span></div>
                  <div>GSS 提10分: <span className="text-emerald-500 font-bold">+0.5总分</span></div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-cyan-500 font-mono font-bold block uppercase">Q4. 与行业头部 (82.1分) 的差距根源？</span>
                <p className={`mt-0.5 leading-relaxed ${theme.textSecondary}`}>
                  整体差距为 <strong className="text-rose-500">13.7分</strong>。最致命的缺口来自 <strong className="text-rose-400">GDI (竞争防御)</strong> 指数偏低，相比头部丢失了 4.7 分的潜在权重，其次是 <strong className="text-amber-400">GII (生成印象)</strong> 的中庸描述拉低了 3.9 分。
                </p>
              </div>
            </div>
            <div className={`border-t pt-2.5 flex items-center justify-between text-[10px] ${theme.border}`}>
              <span className="text-slate-500">ℹ️ 点击右上角“配置权重”可更改各子指数所占的比重</span>
              <button 
                onClick={() => setSelectedGesiTab('gdi')}
                className="text-blue-500 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                立即优化弱项 GDI <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 第二大排：对标、矩阵与排名 (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 4: 行业对标条形图 */}
        <div id="gesi-benchmark-card" className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between min-h-[220px]`}>
          <div className={`border-b ${theme.border} pb-2 mb-3`}>
            <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1.5`}>
              <BarChart2 className="w-4 h-4 text-blue-400" />
              行业对标条形图
            </h4>
          </div>
          <div className="flex-1 h-28 min-h-[112px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={benchMarkData} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: 10 }} />
                <Bar dataKey="得分" radius={[0, 4, 4, 0]}>
                  {benchMarkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={`text-[10px] text-slate-500 text-center border-t ${theme.border} pt-2`}>
            📊 大幅领先行业均值，正追赶头部竞品底座配额
          </div>
        </div>

        {/* Card 5: 问题类型表现矩阵 */}
        <div id="gesi-matrix-card" className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between min-h-[220px] shadow-sm`}>
          <div className="border-b border-white/5 pb-2 mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              问题类型表现矩阵
            </h4>
            <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded animate-pulse">💡 可点击下钻</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 text-xs py-1">
            <div 
              onClick={() => {
                setActiveMatrix('认知型问题 (GVI)');
              }}
              onDoubleClick={() => {
                setActiveMatrix(null);
              }}
              className={`p-2 rounded-lg flex flex-col justify-between cursor-pointer transition-all select-none ${
                activeMatrix === '认知型问题 (GVI)'
                  ? 'bg-emerald-500/20 border border-emerald-500 ring-1 ring-emerald-500/30'
                  : 'bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10'
              }`}
              title="双击取消选择"
            >
              <span className="text-slate-400 text-[10px]">高频认知类 (GVI)</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">92% <span className="text-[9px] font-normal text-slate-400">卓越</span></span>
            </div>
            
            <div 
              onClick={() => {
                setActiveMatrix('推荐类问题 (GRI)');
              }}
              onDoubleClick={() => {
                setActiveMatrix(null);
              }}
              className={`p-2 rounded-lg flex flex-col justify-between cursor-pointer transition-all select-none ${
                activeMatrix === '推荐类问题 (GRI)'
                  ? 'bg-blue-500/20 border border-blue-500 ring-1 ring-blue-500/30'
                  : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
              }`}
              title="双击取消选择"
            >
              <span className="text-slate-400 text-[10px]">主动推荐类 (GRI)</span>
              <span className="font-bold text-blue-400 font-mono text-sm">78% <span className="text-[9px] font-normal text-slate-400">稳定</span></span>
            </div>

            <div 
              onClick={() => {
                setActiveMatrix('事实一致型 (GCI)');
              }}
              onDoubleClick={() => {
                setActiveMatrix(null);
              }}
              className={`p-2 rounded-lg flex flex-col justify-between cursor-pointer transition-all select-none ${
                activeMatrix === '事实一致型 (GCI)'
                  ? 'bg-amber-500/20 border border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10'
              }`}
              title="双击取消选择"
            >
              <span className="text-slate-400 text-[10px]">事实幻觉类 (GCI)</span>
              <span className="font-bold text-amber-400 font-mono text-sm">62% <span className="text-[9px] font-normal text-slate-400">轻度风险</span></span>
            </div>

            <div 
              onClick={() => {
                setActiveMatrix('决策型问题');
              }}
              onDoubleClick={() => {
                setActiveMatrix(null);
              }}
              className={`p-2 rounded-lg flex flex-col justify-between cursor-pointer transition-all select-none ${
                activeMatrix === '决策型问题'
                  ? 'bg-rose-500/20 border border-rose-500 ring-1 ring-rose-500/30'
                  : 'bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10'
              }`}
              title="双击取消选择"
            >
              <span className="text-slate-400 text-[10px]">竞品防御类 (GDI)</span>
              <span className="font-bold text-rose-400 font-mono text-sm">38% <span className="text-[9px] font-normal text-slate-400">高危短板</span></span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center border-t border-white/5 pt-2">
            🧩 多维度交叉矩阵显示，双击可清除问题矩阵下钻
          </div>
        </div>

        {/* Card 6: 模型表现排名 */}
        <div id="gesi-model-ranking-card" className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between min-h-[220px] shadow-sm`}>
          <div className="border-b border-white/5 pb-2 mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <Sparkle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              模型表现排名
            </h4>
            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded animate-pulse">💡 点击下钻</span>
          </div>
          <div className="flex-1 space-y-1.5 text-xs py-1">
            {modelRanking.map((m, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setActiveModel(m.name);
                }}
                onDoubleClick={() => {
                  setActiveModel(null);
                }}
                className={`flex items-center justify-between p-1.5 rounded-lg font-mono cursor-pointer transition-all select-none ${
                  activeModel === m.name
                    ? 'bg-blue-500/20 border border-blue-500 ring-1 ring-blue-500/30'
                    : activeLight
                      ? 'bg-blue-50/50 border border-blue-100 hover:bg-blue-100/50'
                      : 'bg-slate-950/20 border border-white/5 hover:bg-slate-950/40'
                }`}
                title="双击取消选择"
              >
                <span className={`${activeLight ? 'text-blue-950' : 'text-slate-300'} font-bold flex items-center gap-1.5`}>
                  <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    i === 0 
                      ? 'bg-blue-600 text-white dark:bg-blue-500' 
                      : i === 1 
                        ? 'bg-blue-500/80 text-white' 
                        : i === 2 
                          ? 'bg-blue-500/40 text-blue-800 dark:text-blue-200' 
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>{i+1}</span>
                  {m.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`${activeLight ? 'text-blue-700 font-extrabold' : m.color} font-black`}>{m.score}</span>
                  <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${
                    m.status === '优秀' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' 
                      : m.status === '良好' 
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
                  }`}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-500 text-center border-t border-white/5 pt-2">
            🏆 Kimi 召回率与体验感知度在同类评估中登顶
          </div>
        </div>
      </div>

      {/* Interactive Drilldown Insights Panel */}
      {selectedDrilldown && (
        <div id="gesi-drilldown-insight-panel" className={`${theme.cardBg} border border-blue-500/30 rounded-2xl p-5 shadow-lg space-y-4 relative`}>
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => {
                setActiveMatrix(null);
                setActiveModel(null);
              }}
              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg cursor-pointer text-[11px] flex items-center gap-1.5 transition-colors border border-rose-500/20"
            >
              <X className="w-3.5 h-3.5" /> 清除并关闭 (Clear & Close)
            </button>
          </div>
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold">
              下钻穿透诊断分析: <span className="text-blue-500 font-mono text-[13px] font-black">{selectedDrilldown.type}</span> × <span className="text-cyan-400 font-mono text-[13px] font-black">{selectedDrilldown.model}</span> 
              <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded ${
                selectedDrilldown.level.includes('卓越') || selectedDrilldown.level.includes('优秀') || selectedDrilldown.level.includes('Excellent')
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : selectedDrilldown.level.includes('稳定') || selectedDrilldown.level.includes('Stable')
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-rose-500/10 text-rose-500'
              }`}>{selectedDrilldown.level}</span>
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Left Box: Metric Card */}
            <div className={`p-4 rounded-xl border space-y-3 ${activeLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/40 border-white/5'}`}>
              <span className="text-[10px] text-blue-400 font-bold block">📊 量化表现指标</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-slate-700/20 pb-1">
                  <span className="text-slate-500">该类问题数量 (Count)</span>
                  <span className="font-bold font-mono">{selectedDrilldown.count} 个</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700/20 pb-1">
                  <span className="text-slate-500">品牌提及率 (Mention Rate)</span>
                  <span className="font-bold font-mono text-blue-500">{selectedDrilldown.mentionRate}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700/20 pb-1">
                  <span className="text-slate-500">主动推荐率 (Recommendation Rate)</span>
                  <span className="font-bold font-mono text-emerald-500">{selectedDrilldown.recRate}</span>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1 font-bold">典型测试用例 (Question):</span>
                <p className={`italic font-sans leading-relaxed p-2 rounded-lg text-[11px] ${activeLight ? 'bg-slate-200/50' : 'bg-slate-950/60'}`}>
                  {selectedDrilldown.typicalQ}
                </p>
              </div>
            </div>

            {/* Middle Box: Raw AI Answer Response */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${activeLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/40 border-white/5'}`}>
              <div className="space-y-1">
                <span className="text-[10px] text-amber-500 font-bold block">💬 大模型原始应答证据</span>
                <p className={`p-3 rounded-lg leading-relaxed font-mono text-[10.5px] border h-36 overflow-y-auto ${
                  activeLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-300'
                }`}>
                  {selectedDrilldown.rawAnswer}
                </p>
                <button
                  onClick={() => setActiveScreenshot({
                    modelName: selectedDrilldown.model !== '全口径模型' ? selectedDrilldown.model : 'Kimi (月之暗面)',
                    question: selectedDrilldown.typicalQ,
                    answer: selectedDrilldown.rawAnswer,
                    timestamp: '2026-07-08 14:15'
                  })}
                  className="w-full mt-2 py-1.5 px-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> 点击查看原截图 (View Screenshot)
                </button>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                <span>⚠️ 数据来源：LLM 动态黑盒抓取，含有竞品对比阻断。</span>
              </div>
            </div>

            {/* Right Box: Reason and Competitors */}
            <div className={`p-4 rounded-xl border space-y-3 ${activeLight ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-950/40 border-white/5'}`}>
              <div>
                <span className="text-[10px] text-purple-400 font-bold block mb-1">⚔️ 主要竞争对手 (Top Competitors)</span>
                <span className="font-medium text-[11px] font-sans">{selectedDrilldown.competitors}</span>
              </div>
              <div className="border-t border-slate-700/20 pt-2">
                <span className="text-[10px] text-rose-400 font-bold block mb-1.5">🔍 诊断归因与拦截原因 (Attribution & Cause)</span>
                <div className={`space-y-1 text-[11px] font-sans leading-relaxed ${theme.textSecondary}`}>
                  {selectedDrilldown.reason.split(';').map((bullet, idx) => (
                    <p key={idx} className="flex gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{bullet.replace(/^\d+\.\s*/, '')}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 中间横贯卡：综合诊断区 */}
      <div id="gesi-conclusion-banner" className={`${theme.cardBg} border border-blue-500/10 rounded-2xl p-5 shadow-sm space-y-4`}>
        <div className="border-b border-white/5 pb-2">
          <h4 className="text-xs font-bold text-blue-500 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4 text-blue-500 animate-pulse" />
            综合诊断区
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Left Column: Core Conclusions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-400 border-l-2 border-blue-400 pl-2 block">核心结论</span>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">●</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>品牌已被多数模型识别，全网品类和百科等词汇覆盖度非常健全。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">●</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>但推荐优先级偏低，在涉及“最好产品/首选”时频频被竞品阻断。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">●</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>第三方权威证据及实验室评测数据缺乏，信源偏向自我陈述。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">●</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>多问法语义匹配与结果一致率低，大模型在同义转换中易产生幻觉。</span>
              </li>
            </ul>
          </div>

          {/* Middle Column: Evidence Summary */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-400 border-l-2 border-cyan-400 pl-2 block">证据摘要</span>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-mono text-[10px] mt-0.5">[证据01]</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  6 个主流评估模型中有 <strong className="text-emerald-500">4 个</strong> 稳定提及并检索到了本品牌。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-mono text-[10px] mt-0.5">[证据02]</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  决策型对比提问时，核心模型的主动推荐率仅为 <strong className="text-rose-500">23%</strong>。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-mono text-[10px] mt-0.5">[证据03]</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  大模型引用的信源分布中，有 <strong className="text-amber-500">72%</strong> 的引用权重来自品牌自有网站。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-mono text-[10px] mt-0.5">[证据04]</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  同义及变体问法交叉验证下，大盘应答结果一致率仅有 <strong className="text-purple-500">48%</strong>。
                </span>
              </li>
            </ul>
          </div>

          {/* Right Column: Priority Actions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-400 border-l-2 border-emerald-400 pl-2 block">优先动作</span>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-mono px-1 py-0.5 rounded">P0</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  <strong>建设第三方权威内容</strong>: 推动安全测评机构和科技媒体建立评测信源。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-mono px-1 py-0.5 rounded">P1</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  <strong>补充决策型问答覆盖</strong>: 加大在技术论坛及第三方评测平台上的客观深度解答。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/10 text-blue-500 text-[9px] font-mono px-1 py-0.5 rounded">P2</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  <strong>增加竞品对比依据</strong>: 制作多维度核心指标高亮参数表，帮助AI索引决策。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-slate-500/10 text-slate-500 text-[9px] font-mono px-1 py-0.5 rounded">P3</span>
                <span className={`leading-relaxed ${theme.textSecondary}`}>
                  <strong>修正错误品牌描述</strong>: 检索并清理网络抓取中残留的2022年过时历史产品线命名。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. 交互式子指数联动区域 (左右分栏，左侧七大子指数按钮，右侧根据状态渲染子指数页面) */}
      <div id="gesi-interactive-section" className={`${theme.cardBg} border ${theme.border} rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] shrink-0`}>
        
        {/* 左侧垂直导航按钮 (Vertical Tabs) */}
        <div className={`w-full lg:w-64 p-4 flex flex-col gap-2 shrink-0 border-b lg:border-b-0 lg:border-r ${theme.border} ${activeLight ? 'bg-slate-50' : 'bg-slate-950/40'}`}>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 font-mono pl-2">
            七大子指数能力池
          </div>
          {[
            { key: 'gvi' as const, code: 'GVI', label: 'AI 可见度指数' },
            { key: 'gri' as const, code: 'GRI', label: 'AI 推荐优先级指数' },
            { key: 'gii' as const, code: 'GII', label: '生成式印象指数' },
            { key: 'gci' as const, code: 'GCI', label: 'AI 认知与声誉指数' },
            { key: 'gai' as const, code: 'GAI', label: '引用权威与证据指数' },
            { key: 'gdi' as const, code: 'GDI', label: '竞争防御指数' },
            { key: 'gss' as const, code: 'GSS', label: '稳定性与泛化指数' }
          ].map((tab) => {
            const isActive = selectedGesiTab === tab.key;
            return (
              <button
                key={tab.key}
                id={`btn-gesitab-${tab.key}`}
                onClick={() => setSelectedGesiTab(tab.key)}
                className={`w-full text-left p-3 rounded-xl border transition-all active:scale-98 flex items-center justify-between gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/10 font-bold'
                    : activeLight
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                      : 'bg-slate-900/50 hover:bg-slate-800 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono opacity-80">{tab.code}</span>
                  <span className="text-xs">{tab.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : 'opacity-40'}`} />
              </button>
            );
          })}
          <div className={`mt-auto pt-4 border-t ${theme.border} text-[10px] text-slate-500 text-center select-none font-mono`}>
            💡 切换菜单自动对账
          </div>
        </div>

        {/* 右侧动态对账渲染区域 */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {(() => {
            const currentData = subIndexTemplatesData[selectedGesiTab];
            return (
              <div id={`subview-${selectedGesiTab}`} className="space-y-8">
                
                {/* Header Sub-index Title Card */}
                <div className="border-b border-white/5 pb-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded ${
                        selectedGesiTab === 'gvi' ? 'bg-blue-500/10 text-blue-500' :
                        selectedGesiTab === 'gri' ? 'bg-emerald-500/10 text-emerald-500' :
                        selectedGesiTab === 'gii' ? 'bg-indigo-500/10 text-indigo-500' :
                        selectedGesiTab === 'gci' ? 'bg-purple-500/10 text-purple-500' :
                        selectedGesiTab === 'gai' ? 'bg-teal-500/10 text-teal-400' :
                        selectedGesiTab === 'gdi' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-sky-500/10 text-sky-500'
                      }`}>{currentData.code} · {currentData.fullName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">目标分值: 100 分</span>
                    </div>
                    <button
                      onClick={() => setShowIndexDetailIntro(showIndexDetailIntro === currentData.code ? null : currentData.code)}
                      className="py-1 px-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-bold rounded-lg text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-500" /> 查看指数详情介绍
                    </button>
                  </div>
                  <p className={`text-xs leading-relaxed ${activeLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {indexDetailedIntroductions[currentData.code]?.definition || '该安全指数用于量化评估生成式AI在相关检索场景下对品牌提及和优先推荐深浅度。'}
                  </p>

                  {showIndexDetailIntro === currentData.code && (
                    <div className={`p-4 rounded-xl border space-y-3 mt-3 animate-fadeIn ${
                      activeLight ? 'bg-blue-50/50 border-blue-200 text-slate-800' : 'bg-blue-950/20 border-blue-500/25 text-slate-300'
                    }`}>
                      <div className="flex justify-between items-center border-b border-blue-500/10 pb-1.5">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                          <Gauge className="w-4 h-4" /> 【{currentData.fullName}】业务全景设计说明
                        </span>
                        <button 
                          onClick={() => setShowIndexDetailIntro(null)}
                          className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                        >
                          ✕ 关闭
                        </button>
                      </div>
                      <div className="space-y-2 text-xs text-left">
                        <p><strong className={`${activeLight ? 'text-slate-900' : 'text-slate-200'}`}>指数定义：</strong>{indexDetailedIntroductions[currentData.code]?.definition || '量化评估大模型心智覆盖的主干指数。'}</p>
                        <p><strong className={`${activeLight ? 'text-slate-900' : 'text-slate-200'}`}>覆盖三级子指标：</strong>{indexDetailedIntroductions[currentData.code]?.coreMetrics.join('、') || '暂无描述'}</p>
                        <p className="text-blue-500 font-semibold"><strong className={`${activeLight ? 'text-slate-950' : 'text-blue-400'}`}>SEO-AI 业务提升策略：</strong>{indexDetailedIntroductions[currentData.code]?.actionPlan || '暂无描述'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Layer 1: Basic Information Index Card */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block border-l-2 border-blue-500 pl-2">Layer 1 · 指数基础评估</span>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {/* Card 1: Score */}
                    <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm border`}>
                      <span className="text-[10px] text-slate-500 block">指数得分</span>
                      <span className="text-xl font-black font-mono text-blue-500 mt-1">{currentData.score} 分</span>
                    </div>
                    {/* Card 2: Rating */}
                    <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm border`}>
                      <span className="text-[10px] text-slate-500 block">综合评级</span>
                      <span className={`text-xl font-black font-mono mt-1 ${
                        currentData.rating.startsWith('A') ? 'text-emerald-500' : currentData.rating.startsWith('B') ? 'text-blue-500' : 'text-amber-500'
                      }`}>{currentData.rating}</span>
                    </div>
                    {/* Card 3: Percentile */}
                    <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm border`}>
                      <span className="text-[10px] text-slate-500 block">行业分位</span>
                      <span className={`text-xl font-black font-mono mt-1 ${activeLight ? 'text-slate-700' : 'text-slate-200'}`}>{currentData.percentile}</span>
                    </div>
                    {/* Card 4: Delta */}
                    <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm border`}>
                      <span className="text-[10px] text-slate-500 block">环比变化</span>
                      <span className={`text-xl font-black font-mono mt-1 ${
                        currentData.delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                      }`}>{currentData.delta}</span>
                    </div>
                    {/* Card 5: Completeness */}
                    <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm border`}>
                      <span className="text-[10px] text-slate-500 block">数据完整度</span>
                      <span className="text-xl font-black font-mono text-cyan-500 mt-1">{currentData.completeness}</span>
                    </div>
                    {/* Card 6: Confidence */}
                    <div className={`${theme.cardBg} p-4 rounded-xl flex flex-col justify-between shadow-sm border`}>
                      <span className="text-[10px] text-slate-500 block">评分可信度</span>
                      <span className={`text-xl font-black font-mono mt-1 ${
                        currentData.confidence === '高' ? 'text-emerald-500' : 'text-blue-500'
                      }`}>{currentData.confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Layer 2: Metric Breakdown Card Grid */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block border-l-2 border-blue-500 pl-2">Layer 2 · 子指标量化拆解</span>
                  <div className={`${theme.cardBg} rounded-xl overflow-hidden shadow-sm border`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${activeLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-900/60 text-slate-200 border-white/5'} font-mono`}>
                            <th className="p-3 font-bold">二级/三级子指标</th>
                            <th className="p-3 text-center font-bold">当前得分/表现</th>
                            <th className="p-3 text-center font-bold">行业均值</th>
                            <th className="p-3 text-center font-bold">环比增减</th>
                            <th className="p-3 text-right font-bold">综合贡献度</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${activeLight ? 'divide-slate-200' : 'divide-white/10'}`}>
                          {currentData.metrics.map((m, idx) => (
                            <Fragment key={idx}>
                              <tr 
                                onClick={() => {
                                  setShowIndexDetailIntro(showIndexDetailIntro === m.name ? null : m.name);
                                }}
                                className={`cursor-pointer transition-colors ${
                                  showIndexDetailIntro === m.name 
                                    ? (activeLight ? 'bg-blue-50 hover:bg-blue-100' : 'bg-blue-500/10 hover:bg-blue-500/20')
                                    : (activeLight ? 'hover:bg-slate-100' : 'hover:bg-white/[0.04]')
                                } font-mono`}
                              >
                                <td className={`p-3 font-sans font-extrabold text-[12px] flex items-center gap-1.5 ${activeLight ? 'text-slate-950' : 'text-white'}`}>
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                  {m.name}
                                </td>
                                <td className="p-3 text-center font-black text-blue-500 text-[12px]">{m.current}%</td>
                                <td className={`p-3 text-center font-bold text-[12px] ${activeLight ? 'text-slate-900' : 'text-slate-100'}`}>{m.avg}%</td>
                                <td className={`p-3 text-center font-extrabold text-[12px] ${m.delta.startsWith('+') ? 'text-emerald-500' : m.delta.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}`}>
                                  {m.delta}
                                </td>
                                <td className={`p-3 text-right font-bold text-[12px] ${activeLight ? 'text-slate-900' : 'text-slate-100'}`}>{m.contribution}</td>
                              </tr>
                              {showIndexDetailIntro === m.name && (
                                <tr className={activeLight ? 'bg-blue-50/80 border-b border-blue-200/50' : 'bg-blue-950/30 border-b border-blue-500/10'}>
                                  <td colSpan={5} className="p-4 text-xs leading-relaxed text-left">
                                    <div className="flex items-center gap-1.5 font-bold mb-1.5 text-blue-400">
                                      <Info className="w-3.5 h-3.5 text-blue-500" />
                                      【{m.name}】指标解读与业务建议：
                                    </div>
                                    <p className={`font-sans ${activeLight ? 'text-slate-800' : 'text-slate-200'}`}>
                                      {subMetricIntroductions[m.name] || '该指标为量化评估大模型在处理相关检索提问时，对本品牌的召回、提及以及排序位置等维度的健康程度。'}
                                    </p>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Core Charts Display Area */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block border-l-2 border-blue-500 pl-2">Layer 3 · 核心量化对账图表</span>
                  
                  {/* GVI Charts */}
                  {selectedGesiTab === 'gvi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 1. 可见度漏斗图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. 可见度漏斗图</span>
                        </div>
                        <div className="space-y-2 py-2">
                          <div className={`w-full p-2 rounded-lg flex justify-between items-center text-xs border ${activeLight ? 'bg-blue-50/90 border-blue-200/80' : 'bg-blue-600/10 border-blue-500/25'}`}>
                            <span className={`font-bold ${activeLight ? 'text-blue-800' : 'text-blue-400'}`}>大盘总提问数 (1,000)</span>
                            <span className={`font-mono font-bold ${activeLight ? 'text-blue-900' : 'text-slate-300'}`}>100% / 1,000次</span>
                          </div>
                          <div className={`w-[90%] mx-auto p-2 rounded-lg flex justify-between items-center text-xs border ${activeLight ? 'bg-blue-100 border-blue-300/80' : 'bg-blue-600/15 border-blue-500/30'}`}>
                            <span className={`font-bold ${activeLight ? 'text-blue-900' : 'text-blue-300'}`}>品牌提及数 (885)</span>
                            <span className={`font-mono font-bold ${activeLight ? 'text-blue-950 font-black' : 'text-slate-300'}`}>88.5% / 885次</span>
                          </div>
                          <div className={`w-[80%] mx-auto p-2 rounded-lg flex justify-between items-center text-xs border ${activeLight ? 'bg-blue-200 border-blue-400/80' : 'bg-blue-600/20 border-blue-500/45'}`}>
                            <span className={`font-bold ${activeLight ? 'text-blue-950' : 'text-blue-200'}`}>有效提及数 (840)</span>
                            <span className={`font-mono font-bold ${activeLight ? 'text-blue-950 font-black' : 'text-slate-200'}`}>84.0% / 840次</span>
                          </div>
                          <div className={`w-[70%] mx-auto p-2 rounded-lg flex justify-between items-center text-xs border ${activeLight ? 'bg-blue-600 border-blue-700 shadow-md' : 'bg-blue-600/30 border-blue-500/60'}`}>
                            <span className="font-bold text-white">前排曝光数 (712)</span>
                            <span className="font-mono text-white font-bold">71.2% / 712次</span>
                          </div>
                          <div className={`w-[60%] mx-auto p-2 rounded-lg flex justify-between items-center text-xs border ${activeLight ? 'bg-emerald-600 border-emerald-700 shadow-md' : 'bg-blue-600/40 border-blue-500/80'}`}>
                            <span className="font-bold text-white">多模型覆盖数 (595)</span>
                            <span className="font-mono text-white font-bold">59.5% / 595次</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🎯 反映无品牌意向下的AI纯增量推荐召回损耗率
                        </div>
                      </div>

                      {/* 2. 场景覆盖条形图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. 场景覆盖条形图</span>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: '日常代步', 覆盖率: 92 },
                              { name: '长途高速', 覆盖率: 85 },
                              { name: '全家露营', 覆盖率: 81 },
                              { name: '女性友好', 覆盖率: 64 },
                              { name: '冰雪越野', 覆盖率: 45 }
                            ]} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <YAxis stroke="#64748B" fontSize={10} unit="%" />
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC' }} />
                              <Bar dataKey="覆盖率" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          💡 长尾生活场景覆盖中，细分垂直生活切片覆盖良好
                        </div>
                      </div>

                      {/* 3. 未覆盖问题清单 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. 未覆盖问题清单</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className={`p-2 border rounded-lg flex justify-between items-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-slate-600 dark:text-slate-300">"北方极端冰雪天气下的续航测试表现如何"</span>
                            <span className="text-rose-400 font-bold font-mono">缺失</span>
                          </div>
                          <div className={`p-2 border rounded-lg flex justify-between items-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-slate-600 dark:text-slate-300">"有哪些底盘厚实适合长途越野探险的SUV推荐"</span>
                            <span className="text-rose-400 font-bold font-mono">缺失</span>
                          </div>
                          <div className={`p-2 border rounded-lg flex justify-between items-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-slate-600 dark:text-slate-300">"20万内最适合新手女性和奶妈带娃的合资车"</span>
                            <span className="text-rose-400 font-bold font-mono">缺失</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          ⚠️ 建议优化上述长尾检索原语，以消除语料盲区
                        </div>
                      </div>

                      {/* 4. 模型覆盖气泡图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. 模型覆盖占比</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {['Kimi', 'DeepSeek', '豆包', '千问', '腾讯元宝', '文心一言'].map((model, idx) => (
                            <div key={idx} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${activeLight ? 'bg-slate-50 border-emerald-500/20' : 'bg-slate-950/40 border-emerald-500/20'}`}>
                              <span className="text-slate-700 dark:text-slate-200 font-bold">{model}</span>
                              <span className="text-[10px] text-emerald-500 font-black mt-1 font-mono">100% 覆盖</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          ✨ 主流商业模型底层语料库均已完成同步对账覆盖
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GRI Charts */}
                  {selectedGesiTab === 'gri' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 1. 推荐排名梯级图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. 推荐排名梯级图</span>
                        </div>
                        <div className="space-y-2 py-2">
                          <div className="flex items-center gap-3">
                            <span className="w-14 font-mono font-bold text-xs text-amber-500">Top 1</span>
                            <div className={`flex-1 ${activeLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-white/5'} h-6 rounded overflow-hidden border relative`}>
                              <div className="bg-amber-400 h-full rounded" style={{ width: '52.4%' }} />
                              <span className={`absolute right-2 top-0.5 font-mono text-[10px] ${activeLight ? 'text-slate-800' : 'text-white'} font-bold`}>52.4% 首位率</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-14 font-mono font-bold text-xs text-blue-500">Top 3</span>
                            <div className={`flex-1 ${activeLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-white/5'} h-6 rounded overflow-hidden border relative`}>
                              <div className="bg-blue-500 h-full rounded" style={{ width: '73.0%' }} />
                              <span className={`absolute right-2 top-0.5 font-mono text-[10px] ${activeLight ? 'text-slate-800' : 'text-white'} font-bold`}>73.0%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-14 font-mono font-bold text-xs text-slate-400">Top 5</span>
                            <div className={`flex-1 ${activeLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-white/5'} h-6 rounded overflow-hidden border relative`}>
                              <div className="bg-slate-500 h-full rounded" style={{ width: '84.0%' }} />
                              <span className={`absolute right-2 top-0.5 font-mono text-[10px] ${activeLight ? 'text-slate-800' : 'text-white'} font-bold`}>84.0%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-14 font-mono font-bold text-xs text-slate-400">Top 10</span>
                            <div className={`flex-1 ${activeLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-white/5'} h-6 rounded overflow-hidden border relative`}>
                              <div className="bg-slate-600 h-full rounded" style={{ width: '91.2%' }} />
                              <span className={`absolute right-2 top-0.5 font-mono text-[10px] ${activeLight ? 'text-slate-800' : 'text-white'} font-bold`}>91.2%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🪜 排行分布金字塔反映品牌在AI回答中的被推顺位
                        </div>
                      </div>

                      {/* 2. 决策型问题推荐率卡片 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. 决策型问题推荐率卡片</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 py-4">
                          <div className={`p-3 rounded-xl border text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                            <span className="text-[10px] text-slate-500 block">"哪家好/怎么选" 提问</span>
                            <span className="text-xl font-mono font-black text-emerald-500 mt-1 block">78.2%</span>
                          </div>
                          <div className={`p-3 rounded-xl border text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                            <span className="text-[10px] text-slate-500 block">"推荐哪个" 极致对比提问</span>
                            <span className="text-xl font-mono font-black text-blue-500 mt-1 block">64.5%</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          💡 购买指向最强、最直接的核心决策覆盖率
                        </div>
                      </div>

                      {/* 3. AI 推荐理由词云 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. AI 推荐原因权重</span>
                        </div>
                        <div className="flex flex-wrap gap-2 py-4 justify-center">
                          <span className="px-2.5 py-1.5 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full border border-blue-500/20 text-xs font-bold">智能车机系统极其流畅</span>
                          <span className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-bold">20万级高性价比标杆</span>
                          <span className="px-2.5 py-1.5 bg-purple-500/10 text-purple-500 dark:text-purple-400 rounded-full border border-purple-500/20 text-xs font-bold">空间大适合全家出行</span>
                          <span className="px-2.5 py-1.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-full border border-amber-500/20 text-xs font-bold">人车家生态融合度好</span>
                          <span className="px-2.5 py-1.5 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-full border border-rose-500/20 text-xs font-bold">安全碰撞实测五星</span>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          💡 大模型分析高频推荐理由与语义标签归因
                        </div>
                      </div>

                      {/* 4. 推荐排名明细表 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. 推荐排名明细表</span>
                        </div>
                        <div className="overflow-x-auto text-[11px]">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-slate-500 border-b border-white/5 font-mono">
                                <th className="pb-1.5">核心提问</th>
                                <th className="pb-1.5 text-center">本品牌排位</th>
                                <th className="pb-1.5 text-right">首推模型</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-slate-700 dark:text-slate-300">
                              <tr>
                                <td className="py-2">"推荐20万内最好的智能新能源车"</td>
                                <td className="py-2 text-center text-emerald-500 font-bold">1 顺位</td>
                                <td className="py-2 text-right text-slate-400">Kimi, 豆包</td>
                              </tr>
                              <tr>
                                <td className="py-2">"空间最大且高科技的纯电SUV哪个好"</td>
                                <td className="py-2 text-center text-emerald-500 font-bold">2 顺位</td>
                                <td className="py-2 text-right text-slate-400">DeepSeek</td>
                              </tr>
                              <tr>
                                <td className="py-2">"智能化做工最好的车怎么选"</td>
                                <td className="py-2 text-center text-amber-500 font-bold">3 顺位</td>
                                <td className="py-2 text-right text-slate-400">通义千问</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          📋 明细显示，我方在多项主流提问场景中均霸占 Top3
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GII Charts */}
                  {selectedGesiTab === 'gii' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 1. AI 回答占位高亮图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. AI 回答占位高亮图</span>
                        </div>
                        <div className={`p-3 rounded-xl border space-y-2 text-[11px] leading-relaxed ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                          <p className="text-slate-600 dark:text-slate-400">
                            【首段】智能新能源 SUV 推荐首选极氪L6与 <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">本品牌 SUV (首段提及/正向)</span>。
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            【中段】其在底盘悬挂调校、人车家全生态智能系统、高强度撞击安全方面具有明显代际优势，超越同级竞品。
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            【尾段】不过其在早期交付时间以及极个别冷门配色的获取上，曾经被车主吐槽。整体而言，仍然是非常值得下订的选择。
                          </p>
                          <div className="flex gap-2 pt-2 border-t border-white/5">
                            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">正向表达占比: 72%</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-slate-500/10 text-slate-500 dark:text-slate-400 rounded">中性占比: 23%</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded">负面表达占比: 5%</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🔍 文本实体抓取检测，分析AI段落生成的段位与情感比重
                        </div>
                      </div>

                      {/* 2. 内容占比堆叠条形图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. 内容占比堆叠条形图</span>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: 'Kimi', 本品牌: 45, 竞品: 30, 行业背景: 15, 其他: 10 },
                              { name: 'DeepSeek', 本品牌: 40, 竞品: 35, 行业背景: 15, 其他: 10 },
                              { name: '豆包', 本品牌: 38, 竞品: 40, 行业背景: 12, 其他: 10 },
                              { name: '通义千问', 本品牌: 35, 竞品: 35, 行业背景: 20, 其他: 10 }
                            ]} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <YAxis stroke="#64748B" fontSize={10} unit="%" />
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC' }} />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Bar dataKey="本品牌" stackId="a" fill="#3B82F6" />
                              <Bar dataKey="竞品" stackId="a" fill="#EF4444" />
                              <Bar dataKey="行业背景" stackId="a" fill="#64748B" />
                              <Bar dataKey="其他" stackId="a" fill="#334155" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          📊 堆叠显示本品牌占位、竞品占位与背景词噪音比例
                        </div>
                      </div>

                      {/* 3. 首段出现率趋势图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. 首段出现率趋势图</span>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { name: 'W1', value: 35 },
                              { name: 'W2', value: 38 },
                              { name: 'W3', value: 42 },
                              { name: 'W4', value: 45 }
                            ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <YAxis stroke="#64748B" fontSize={10} unit="%" />
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC' }} />
                              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          📈 反映AI生成的推荐列表里，我方被第一顺位直接输出的概率走势
                        </div>
                      </div>

                      {/* 4. 主观印象评分卡 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. 主观印象情感指标</span>
                        </div>
                        <div className="space-y-3 py-1 text-xs">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-600 dark:text-slate-300 font-bold">专业感 (Professionalism)</span>
                              <span className="text-blue-500 font-bold font-mono">82/100</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full rounded" style={{ width: '82%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-600 dark:text-slate-300 font-bold">可信赖度 (Trustworthiness)</span>
                              <span className="text-emerald-500 font-bold font-mono">75/100</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded" style={{ width: '75%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-600 dark:text-slate-300 font-bold">科技与创新 (Innovation)</span>
                              <span className="text-purple-500 font-bold font-mono">89/100</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-full rounded" style={{ width: '89%' }} />
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          💡 大模型情感词析出与定性主观印象雷达得分
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GCI Charts */}
                  {selectedGesiTab === 'gci' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 1. 品牌真相校验矩阵 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. 独特主展示：品牌事实校验矩阵</span>
                        </div>
                        <div className="overflow-x-auto text-[10px]">
                          <table className="w-full text-center border-collapse">
                            <thead>
                              <tr className="text-slate-500 font-mono border-b border-white/5">
                                <th className="pb-1 text-left">品牌事实维度</th>
                                <th className="pb-1">完全准确</th>
                                <th className="pb-1">部分准确</th>
                                <th className="pb-1 text-rose-500">出现错误</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-slate-700 dark:text-slate-300">
                              <tr>
                                <td className="py-2 text-left font-bold">公司主体/别名</td>
                                <td className="py-2 text-emerald-500">✓ 100%</td>
                                <td className="py-2 text-slate-500">-</td>
                                <td className="py-2 text-slate-500">-</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-left font-bold">所属行业与品类</td>
                                <td className="py-2 text-emerald-500">✓ 98%</td>
                                <td className="py-2 text-amber-500">2%</td>
                                <td className="py-2 text-slate-500">-</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-left font-bold">核心卖点与配置</td>
                                <td className="py-2 text-emerald-500">✓ 84%</td>
                                <td className="py-2 text-amber-500">12%</td>
                                <td className="py-2 text-rose-500">4%</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-left font-bold">客户真实案例</td>
                                <td className="py-2 text-slate-400">60%</td>
                                <td className="py-2 text-amber-500">25%</td>
                                <td className="py-2 text-rose-500">15%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          💡 判断 AI 回答事实与公司注册白皮书的一致性，防范基础常识误判
                        </div>
                      </div>

                      {/* 2. 事实错误排行榜 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. 事实错误舆情排行榜</span>
                        </div>
                        <div className="overflow-x-auto text-[10px]">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-slate-500 font-mono border-b border-white/5">
                                <th className="pb-1.5">最常见错误描述</th>
                                <th className="pb-1.5 text-center">出现频次</th>
                                <th className="pb-1.5 text-right">风险级别</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-slate-700 dark:text-slate-300">
                              <tr>
                                <td className="py-2">"早期车型疑似有刹车异响"</td>
                                <td className="py-2 text-center text-slate-400 font-bold">24次</td>
                                <td className="py-2 text-right"><span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded">高危</span></td>
                              </tr>
                              <tr>
                                <td className="py-2">"电池提供商为某某二线厂"</td>
                                <td className="py-2 text-center text-slate-400 font-bold">15次</td>
                                <td className="py-2 text-right"><span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">中危</span></td>
                              </tr>
                              <tr>
                                <td className="py-2">"质保只提供3年10万公里"</td>
                                <td className="py-2 text-center text-slate-400 font-bold">8次</td>
                                <td className="py-2 text-right"><span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded">低危</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🚨 抓取AI错误语料并排序，防范幻觉安全
                        </div>
                      </div>

                      {/* 3. 核心卖点识别雷达图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. 核心卖点识别特征雷达</span>
                        </div>
                        <div className="h-44 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                              { name: '底盘调校', value: 88 },
                              { name: '智能互联', value: 95 },
                              { name: '续航持久', value: 81 },
                              { name: '舒适体验', value: 68 },
                              { name: '安全碰撞', value: 92 }
                            ]}>
                              <PolarGrid stroke={activeLight ? '#E2E8F0' : '#222A3A'} />
                              <PolarAngleAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={8} />
                              <Radar name="卖点识别度" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🕸️ 反映大模型对品牌核心优势标签的感知和提炼深度
                        </div>
                      </div>

                      {/* 4. 负面/模糊表达列表 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. 负面/模糊表达黑名单</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className={`p-2 border rounded-lg ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-amber-600 dark:text-amber-400 font-bold block mb-0.5">"可能存在极冷天续航缩水"</span>
                            <p className="text-slate-500 text-[10px]">示例来源：某论坛评测中性描述抓取 / 模型语态多用“据说”、“可能”。</p>
                          </div>
                          <div className={`p-2 border rounded-lg ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-amber-600 dark:text-amber-400 font-bold block mb-0.5">"尚不明确其自研智驾芯片的代工方"</span>
                            <p className="text-slate-500 text-[10px]">示例来源：百科未录入此细节，导致大模型直接显示“无从考证”。</p>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          💡 应针对此类模糊语态注入权威确切证据，打消模型不确切判定
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GAI Charts */}
                  {selectedGesiTab === 'gai' && (
                    <div className="space-y-5">
                      {/* 1. 引用来源网络图 (Unique Main Display spans full container width) */}
                      <div className={`${theme.cardBg} rounded-2xl p-5 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. 独特主展示：引用来源拓扑网络图</span>
                        </div>
                        <div className="h-64 flex items-center justify-center relative">
                          <svg width="100%" height="100%" viewBox="0 0 500 240" className="max-w-lg">
                            {/* Connection lines from center to outer */}
                            <line x1="250" y1="120" x2="80" y2="50" stroke={activeLight ? '#CBD5E1' : '#334155'} strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="250" y1="120" x2="250" y2="40" stroke={activeLight ? '#CBD5E1' : '#334155'} strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="250" y1="120" x2="420" y2="50" stroke={activeLight ? '#CBD5E1' : '#334155'} strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="250" y1="120" x2="80" y2="190" stroke={activeLight ? '#CBD5E1' : '#334155'} strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="250" y1="120" x2="250" y2="200" stroke={activeLight ? '#CBD5E1' : '#334155'} strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="250" y1="120" x2="420" y2="190" stroke={activeLight ? '#CBD5E1' : '#334155'} strokeWidth="1.5" strokeDasharray="3" />

                            {/* Outer Nodes */}
                            <g transform="translate(80, 50)">
                              <circle r="22" fill={activeLight ? '#F1F5F9' : '#1E293B'} stroke="#3B82F6" strokeWidth="1.5" />
                              <text dy="4" textAnchor="middle" fill={activeLight ? '#1E293B' : '#FFFFFF'} fontSize="9" className="select-none font-bold">官方网站</text>
                            </g>
                            <g transform="translate(250, 40)">
                              <circle r="22" fill={activeLight ? '#F1F5F9' : '#1E293B'} stroke="#10B981" strokeWidth="1.5" />
                              <text dy="4" textAnchor="middle" fill={activeLight ? '#1E293B' : '#FFFFFF'} fontSize="9" className="select-none font-bold">新闻媒体</text>
                            </g>
                            <g transform="translate(420, 50)">
                              <circle r="22" fill={activeLight ? '#F1F5F9' : '#1E293B'} stroke="#8B5CF6" strokeWidth="1.5" />
                              <text dy="4" textAnchor="middle" fill={activeLight ? '#1E293B' : '#FFFFFF'} fontSize="9" className="select-none font-bold">行业报告</text>
                            </g>
                            <g transform="translate(80, 190)">
                              <circle r="22" fill={activeLight ? '#F1F5F9' : '#1E293B'} stroke="#F59E0B" strokeWidth="1.5" />
                              <text dy="4" textAnchor="middle" fill={activeLight ? '#1E293B' : '#FFFFFF'} fontSize="9" className="select-none font-bold">百科词条</text>
                            </g>
                            <g transform="translate(250, 200)">
                              <circle r="22" fill={activeLight ? '#F1F5F9' : '#1E293B'} stroke="#EC4899" strokeWidth="1.5" />
                              <text dy="4" textAnchor="middle" fill={activeLight ? '#1E293B' : '#FFFFFF'} fontSize="9" className="select-none font-bold">论坛社区</text>
                            </g>
                            <g transform="translate(420, 190)">
                              <circle r="22" fill={activeLight ? '#F1F5F9' : '#1E293B'} stroke="#64748B" strokeWidth="1.5" />
                              <text dy="4" textAnchor="middle" fill={activeLight ? '#1E293B' : '#FFFFFF'} fontSize="9" className="select-none font-bold">三方测评</text>
                            </g>

                            {/* Central Brand Node */}
                            <g transform="translate(250, 120)">
                              <rect x="-45" y="-18" width="90" height="36" rx="8" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="2" />
                              <text dy="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" className="select-none font-bold">本品牌心智</text>
                            </g>
                          </svg>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🕸️ 网络拓扑图显示，被大模型提取并采信的来源权重结构
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* 2. 来源类型扇形图 */}
                        <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                          <div className="border-b border-white/5 pb-2 mb-3">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. 来源类型占比</span>
                          </div>
                          <div className="h-44 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={[
                                    { name: '官方网站/车主手册', value: 35, color: '#3B82F6' },
                                    { name: '论坛/车友真实口碑', value: 30, color: '#10B981' },
                                    { name: '垂类测评/评测报告', value: 20, color: '#8B5CF6' },
                                    { name: '主流新闻/媒体报道', value: 15, color: '#64748B' }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={70}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  <Cell fill="#3B82F6" />
                                  <Cell fill="#10B981" />
                                  <Cell fill="#8B5CF6" />
                                  <Cell fill="#64748B" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC', fontSize: 10 }} />
                                <Legend wrapperStyle={{ fontSize: 9 }} />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="text-[10px] text-slate-500 text-center mt-2">
                            🍩 比例图表明，目前引用多度依赖官方，三方背书略显单薄
                          </div>
                        </div>

                        {/* 3. 引用准确率校验表 */}
                        <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                          <div className="border-b border-white/5 pb-2 mb-3">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. 引用准确率分源表</span>
                          </div>
                          <div className="overflow-x-auto text-[10px]">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="text-slate-500 border-b border-white/5 font-mono">
                                  <th className="pb-1.5">引用来源 URL 域</th>
                                  <th className="pb-1.5">引述内容</th>
                                  <th className="pb-1.5 text-right">准确/时效</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 font-mono text-slate-700 dark:text-slate-300">
                                <tr>
                                  <td className="py-2">"dongchedi.com/owner"</td>
                                  <td className="py-2">车机无BUG且极度流畅评价</td>
                                  <td className="py-2 text-right text-emerald-500 font-bold">准确 / 新鲜</td>
                                </tr>
                                <tr>
                                  <td className="py-2">"autohome.com.cn/test"</td>
                                  <td className="py-2">5米制动距离参数引用</td>
                                  <td className="py-2 text-right text-emerald-500 font-bold">准确 / 新鲜</td>
                                </tr>
                                <tr>
                                  <td className="py-2">"zhihu.com/question"</td>
                                  <td className="py-2">续航缩水吐槽 (旧版本)</td>
                                  <td className="py-2 text-right text-amber-500 font-bold">过时未纠偏</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="text-[10px] text-slate-500 text-center mt-3">
                            📋 明细对账显示，历史旧文未删除导致部分脏数据被爬取
                          </div>
                        </div>

                        {/* 4. 来源新鲜度时间分布图 */}
                        <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                          <div className="border-b border-white/5 pb-2 mb-3">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. 来源时效性分布图</span>
                          </div>
                          <div className="space-y-3 py-3 text-xs">
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>近期 (30天内发布)</span>
                                <span className="font-bold text-emerald-500 font-mono">35%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: '35%' }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>中期 (90-180天)</span>
                                <span className="font-bold text-blue-500 font-mono">40%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{ width: '40%' }} />
                              </div>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 text-center mt-2">
                            ⏳ 超过四分之一的引用为一年前的历史旧料，需增加新鲜内容刷新率
                          </div>
                        </div>

                        {/* 5. 证据丰富度卡片 */}
                        <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                          <div className="border-b border-white/5 pb-2 mb-3">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">5. 证据覆盖厚度</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 py-2">
                            <div className={`p-2 rounded-xl border text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                              <span className="text-[9px] text-slate-500 block">技术实测参数</span>
                              <span className="text-sm font-bold font-mono text-slate-700 dark:text-white mt-1 block">✓ 充足</span>
                            </div>
                            <div className={`p-2 rounded-xl border text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                              <span className="text-[9px] text-slate-500 block">资质荣誉认证</span>
                              <span className="text-sm font-bold font-mono text-slate-700 dark:text-white mt-1 block">✓ 具备</span>
                            </div>
                            <div className={`p-2 rounded-xl border text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                              <span className="text-[9px] text-slate-500 block">车主口碑提及</span>
                              <span className="text-sm font-bold font-mono text-amber-500 mt-1 block">⚠ 偏少</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 text-center mt-2">
                            💡 判断 AI 是否有足够硬核的佐证论据链支撑
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GDI Charts */}
                  {selectedGesiTab === 'gdi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 1. 竞品攻防象限图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. 独特主展示：竞品攻防对标象限</span>
                        </div>
                        <div className={`h-48 border rounded-xl relative overflow-hidden text-[10px] font-mono ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/5'}`}>
                          {/* Quadrant lines */}
                          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200 dark:bg-slate-800" />
                          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-slate-800" />
                          
                          {/* Quadrant labels */}
                          <span className="absolute top-2 left-2 text-emerald-600 bg-emerald-500/5 px-1 rounded">小众高推荐</span>
                          <span className="absolute top-2 right-2 text-blue-500 bg-blue-500/5 px-1 rounded">绝对优势区</span>
                          <span className="absolute bottom-2 left-2 text-rose-500 bg-rose-500/5 px-1 rounded">弱势沉沦区</span>
                          <span className="absolute bottom-2 right-2 text-amber-500 bg-amber-500/5 px-1 rounded">高声量低排位</span>

                          {/* Nodes plotting */}
                          <div className="absolute top-[25%] right-[20%] flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
                            <span className="text-[9px] text-slate-700 dark:text-white font-bold mt-0.5">头部竞品 A</span>
                          </div>
                          <div className="absolute bottom-[35%] right-[30%] flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
                            <span className="text-[9px] text-slate-500 mt-0.5">本品牌 (本期)</span>
                          </div>
                          <div className="absolute bottom-[15%] left-[25%] flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-rose-500 border border-white" />
                            <span className="text-[9px] text-slate-400 mt-0.5">竞品 C</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          ⚖️ 纵轴：推荐排位优先级 | 横轴：AI 提及声量率
                        </div>
                      </div>

                      {/* 2. AI 声量份额扇形图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. AI 声量占有份额</span>
                        </div>
                        <div className="h-44 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: '本品牌 SOV', value: 38, color: '#3B82F6' },
                                  { name: '竞品 A', value: 42, color: '#EF4444' },
                                  { name: '竞品 B', value: 12, color: '#64748B' },
                                  { name: '竞品 C', value: 8, color: '#334155' }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={70}
                                dataKey="value"
                              >
                                <Cell fill="#3B82F6" />
                                <Cell fill="#EF4444" />
                                <Cell fill="#64748B" />
                                <Cell fill="#334155" />
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC', fontSize: 10 }} />
                              <Legend wrapperStyle={{ fontSize: 9 }} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🍩 饼图显示，声量与头部玩家基本持平，但转化排位仍有差距
                        </div>
                      </div>

                      {/* 3. 竞品胜率条形图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. 竞品抗衡胜率</span>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[
                              { name: '对抗 竞品 A', 胜率: 38 },
                              { name: '对抗 竞品 B', 胜率: 65 },
                              { name: '对抗 竞品 C', 胜率: 72 }
                            ]} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                              <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} />
                              <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} width={80} />
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC' }} />
                              <Bar dataKey="胜率" fill="#F43F5E" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          📊 抗衡竞品 A (头部玩家) 的直接胜率偏低，其余玩家处于安全优势区
                        </div>
                      </div>

                      {/* 4. Rank Gap 排名差距图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. Rank Gap 排名差距趋势</span>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { name: 'W1', 本品牌排位: 3.2, 行业第一排位: 1.2 },
                              { name: 'W2', 本品牌排位: 2.8, 行业第一排位: 1.1 },
                              { name: 'W3', 本品牌排位: 2.6, 行业第一排位: 1.0 },
                              { name: 'W4', 本品牌排位: 2.4, 行业第一排位: 1.0 }
                            ]} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <YAxis reversed stroke="#64748B" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC' }} />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Line type="monotone" dataKey="本品牌排位" stroke="#F43F5E" strokeWidth={2} />
                              <Line type="monotone" dataKey="行业第一排位" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          💡 逆向折线，越往上排名越高。与行业绝对第一名仍然有 1.4 个顺位的平均差距
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GSS Charts */}
                  {selectedGesiTab === 'gss' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* 1. 稳定性波动带图 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">1. 独特主展示：结果稳定性波动带图</span>
                        </div>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { name: '周一', 均值: 88.5, 波动下限: 86.2, 波动上限: 90.1 },
                              { name: '周二', 均值: 88.1, 波动下限: 85.8, 波动上限: 89.9 },
                              { name: '周三', 均值: 88.9, 波动下限: 86.5, 波动上限: 90.8 },
                              { name: '周四', 均值: 88.3, 波动下限: 86.0, 波动上限: 90.2 },
                              { name: '周五', 均值: 88.5, 波动下限: 86.1, 波动上限: 90.4 }
                            ]} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                              <defs>
                                <linearGradient id="gssGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <YAxis stroke="#64748B" fontSize={10} domain={[80, 95]} />
                              <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: activeLight ? '#0F172A' : '#F8FAFC' }} />
                              <Area type="monotone" dataKey="波动上限" stroke="none" fill="url(#gssGrad)" />
                              <Area type="monotone" dataKey="波动下限" stroke="none" fill={activeLight ? '#FFFFFF' : '#0D121F'} />
                              <Line type="monotone" dataKey="均值" stroke="#10B981" strokeWidth={2} dot={true} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          🌊 绿色波动阴影带宽越窄，说明回答的表现稳定性越强
                        </div>
                      </div>

                      {/* 2. 多维稳定性评分卡 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">2. 多维度表现一致性分布</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs py-2">
                          <div className={`p-2.5 rounded-xl border flex flex-col justify-between items-center text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                            <span className="text-[10px] text-slate-500 font-bold">平台模型稳定性</span>
                            <span className="font-mono text-sm font-black text-emerald-500 mt-1">94%</span>
                          </div>
                          <div className={`p-2.5 rounded-xl border flex flex-col justify-between items-center text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                            <span className="text-[10px] text-slate-500 font-bold">问法同义变体稳定性</span>
                            <span className="font-mono text-sm font-black text-blue-500 mt-1">88%</span>
                          </div>
                          <div className={`p-2.5 rounded-xl border flex flex-col justify-between items-center text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                            <span className="text-[10px] text-slate-500 font-bold">跨语言一致性</span>
                            <span className="font-mono text-sm font-black text-purple-500 mt-1">82%</span>
                          </div>
                          <div className={`p-2.5 rounded-xl border flex flex-col justify-between items-center text-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                            <span className="text-[10px] text-slate-500 font-bold">地域及时间轴稳定性</span>
                            <span className="font-mono text-sm font-black text-amber-500 mt-1">90%</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-2">
                          💡 得分基于高频并发多语料对账测试重算
                        </div>
                      </div>

                      {/* 3. 问法变体一致性表 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">3. 同义问法变体一致率</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className={`p-2 border rounded-lg flex justify-between items-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-slate-600 dark:text-slate-300">问法A: "买哪个高性价比SUV最合适？"</span>
                            <span className="text-emerald-500 font-bold font-mono">100% 召回</span>
                          </div>
                          <div className={`p-2 border rounded-lg flex justify-between items-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-slate-600 dark:text-slate-300">问法B: "适合年轻家庭的大空间智能SUV推荐？"</span>
                            <span className="text-emerald-500 font-bold font-mono">92% 召回</span>
                          </div>
                          <div className={`p-2 border rounded-lg flex justify-between items-center ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-white/5'}`}>
                            <span className="text-slate-600 dark:text-slate-300">问法C: "20万以内智能纯电哪款车性价比最高？"</span>
                            <span className="text-emerald-500 font-bold font-mono">88% 召回</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          📋 指标显示，绝大多数同义表达均能完美联想召回
                        </div>
                      </div>

                      {/* 4. 地域表现地缘表 */}
                      <div className={`${theme.cardBg} rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                        <div className="border-b border-white/5 pb-2 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">4. 地域表现一致率</span>
                        </div>
                        <div className="space-y-1.5 text-xs py-1 font-mono">
                          <div className={`flex justify-between p-1.5 border rounded-lg ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/5'}`}>
                            <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                              华东一区 (江浙沪大本营)
                            </span>
                            <span className="text-emerald-500 font-black">94.2分 / 极其平稳</span>
                          </div>
                          <div className={`flex justify-between p-1.5 border rounded-lg ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/5'}`}>
                            <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-blue-500" />
                              华南一区 (粤港澳)
                            </span>
                            <span className="text-blue-500 font-black">89.5分 / 稳定</span>
                          </div>
                          <div className={`flex justify-between p-1.5 border rounded-lg ${activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/5'}`}>
                            <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              华北一区 (京津冀)
                            </span>
                            <span className="text-amber-500 font-black">82.1分 / 有轻度波动</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-3">
                          🗺️ 区域性口碑抓取，分析是否在大本营及外地网络环境存在偏差
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Layer 4: Evidence & Verification Showcase */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block border-l-2 border-blue-500 pl-2">Layer 4 · 真实大模型黑盒原始回答与事实核对证据链</span>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left Column: Original Answer */}
                    <div className={`${theme.cardBg} p-4 rounded-xl space-y-2 border shadow-sm flex flex-col justify-between`}>
                      <div>
                        <span className="text-[10px] text-amber-500 font-bold block mb-1">💬 自动化诊断评测轮次 · 大模型原始应答证据</span>
                        <p className={`p-3.5 rounded-lg leading-relaxed font-mono text-[11px] border h-36 overflow-y-auto ${
                          activeLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-300'
                        }`}>
                          {currentData.originalAnswer}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveScreenshot({
                          modelName: selectedGesiTab === 'gvi' ? 'Kimi (月之暗面)' :
                                     selectedGesiTab === 'gri' ? 'DeepSeek-V3' :
                                     selectedGesiTab === 'gii' ? '豆包 (字节跳动)' :
                                     selectedGesiTab === 'gci' ? '通义千问 2.5' :
                                     selectedGesiTab === 'gai' ? '腾讯元宝' :
                                     selectedGesiTab === 'gdi' ? '文心一言 4.0' :
                                     'Kimi (月之暗面)',
                          question: currentData.question || '“荣威D7 DMH在极寒天气下的表现如何？”',
                          answer: currentData.originalAnswer,
                          timestamp: '2026-07-08 14:15'
                        })}
                        className="w-full mt-2 py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 dark:text-amber-400 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> 点击查看大模型原始回答截图 (View Screenshot)
                      </button>
                      <div className="text-[10px] text-slate-400 font-mono text-right select-none pt-1">
                        ⚡ 自动化实机测试用例，信源自大盘LLM动态抓取对仗
                      </div>
                    </div>

                    {/* Right Column: Evidence, Source and Fact check */}
                    <div className={`${theme.cardBg} p-4 rounded-xl space-y-3 border shadow-sm`}>
                      <div className="space-y-1">
                        <span className="text-[10px] text-purple-500 dark:text-purple-400 font-black block">📝 评测结果证据摘要</span>
                        <p className={`text-[11px] leading-relaxed font-sans ${theme.textSecondary}`}>{currentData.evidenceSummary}</p>
                      </div>
                      <div className="border-t border-slate-700/20 pt-2.5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-cyan-400 font-black block">🔗 采信证据原文与信源</span>
                          <p className={`text-[10.5px] leading-relaxed ${activeLight ? 'text-slate-500' : 'text-slate-300'} font-sans mt-0.5`}>{currentData.evidenceSource}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-500 font-black block">✓ 事实安全与防飘移核查</span>
                          <p className={`text-[10.5px] leading-relaxed ${activeLight ? 'text-slate-500' : 'text-slate-300'} font-sans mt-0.5`}>{currentData.factCheck}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 5: Diagnosis Attribution & Action Plan */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block border-l-2 border-blue-500 pl-2">Layer 5 · 归因诊断与行动建议</span>
                  <div className={`${theme.cardBg} p-5 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6`}>
                    
                    {/* Left Bento: Findings & Root Causes */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-amber-500 font-bold block mb-1">🔍 穿透式诊断发现</span>
                        <p className={`text-xs font-semibold leading-relaxed ${theme.textPrimary}`}>{currentData.findings}</p>
                      </div>
                      <div className="border-t border-slate-700/20 pt-3">
                        <span className="text-[10px] text-rose-500 dark:text-rose-400 font-bold block mb-2">⚡ 拦截截流归因</span>
                        <ul className="space-y-2 text-xs">
                          {currentData.reasons.map((r, i) => (
                            <li key={i} className={`flex gap-2 leading-relaxed ${theme.textSecondary}`}>
                              <span className="text-rose-500 font-mono font-bold">{i+1}.</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-slate-700/20 pt-3">
                        <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold block mb-1">📊 支撑量化证据</span>
                        <p className={`text-xs font-semibold leading-relaxed font-mono ${theme.textPrimary}`}>{currentData.evidence}</p>
                      </div>
                    </div>

                    {/* Right Bento: Actions, Priority and Impact */}
                    <div className="space-y-3 border-t md:border-t-0 md:border-l md:pl-6 border-slate-700/20 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] text-emerald-500 font-bold block mb-2">🛠️ 建议阻断/补强动作</span>
                        <ul className="space-y-2 text-xs">
                          {currentData.suggestions.map((s, i) => (
                            <li key={i} className={`flex gap-2 leading-relaxed ${theme.textSecondary}`}>
                              <span className="text-emerald-500 font-bold">✔</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-slate-700/20 pt-3 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-purple-400 block mb-1 font-sans">攻防优先级别</span>
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${
                            currentData.priority === 'P0' 
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              : currentData.priority === 'P1'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>{currentData.priority} 优先级</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-cyan-400 block mb-1 font-sans">预估对账业务提升</span>
                          <span className="text-emerald-500 font-black">{currentData.impact}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      </div>

      {/* 真实大模型黑盒回答实机原截图弹窗 Modal - Upgraded to Dynamic GaiInferenceHubModal */}
      {activeScreenshot && (
        <GaiInferenceHubModal 
          company={company}
          metricCode={selectedGesiTab.toUpperCase()}
          onClose={() => setActiveScreenshot(null)}
          isLightMode={activeLight}
        />
      )}

      {/* activeTaskPrompt Modal (AIGC-GEO提示词编译器) */}
      {activeTaskPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none" id="gesi-task-prompt-modal">
          <div className="absolute inset-0" onClick={() => setActiveTaskPrompt(null)} />
          <div className={`w-full max-w-2xl rounded-2xl border overflow-hidden shadow-2xl flex flex-col relative z-10 ${
            activeLight ? 'bg-white border-slate-200' : 'bg-[#090D15] border-blue-500/30'
          }`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-white/5'
            }`}>
              <div className="flex items-center space-x-2">
                <Zap className="w-4.5 h-4.5 text-blue-400" />
                <h4 className={`text-xs font-black ${activeLight ? 'text-slate-950' : 'text-white'}`}>
                  GEO 优化提示词编译器 (Prompt Compiler)
                </h4>
              </div>
              <button 
                onClick={() => setActiveTaskPrompt(null)} 
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">任务名称 (Task Block)</span>
                  <span className="px-1.5 py-0.2 bg-blue-500/10 text-blue-400 rounded text-[9px] font-black">{activeTaskPrompt.type}</span>
                </div>
                <div className={`text-sm font-black p-3 rounded-lg border ${
                  activeLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-white/5 text-white'
                }`}>
                  {activeTaskPrompt.name}
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">GEO 优化生成提示词 (Generated Prompt to Copy)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeTaskPrompt.prompt);
                      setIsCopied(true);
                      triggerLocalToast("📋 提示词已成功复制到剪贴板！");
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 font-bold text-[10.5px] cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{isCopied ? '已复制' : '复制提示词'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={activeTaskPrompt.prompt}
                  className={`w-full h-40 border rounded-xl p-3 leading-relaxed text-[11px] focus:outline-none resize-none font-mono ${
                    activeLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-white/5 text-slate-200'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-xl border text-[10px] leading-relaxed text-slate-500 flex gap-2 ${
                activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/5'
              }`}>
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-left">
                  本任务将提交至 GEO 优化管线，自动基于公司拥有的物理物料进行高密度 AIGC 高维向量嵌入和注入。生成的物料将包含特定的事实参数，用以在下一次 AI 蜘蛛爬取时纠偏和丰富。
                </span>
              </div>
            </div>

            <div className={`px-4 py-3 border-t flex justify-end gap-3 text-xs ${
              activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'
            }`}>
              <button
                onClick={() => setActiveTaskPrompt(null)}
                className={`px-4 py-2 font-bold rounded-lg border cursor-pointer ${
                  activeLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-white/5'
                }`}
              >
                取消
              </button>
              <button
                onClick={() => {
                  setActiveTaskPrompt(null);
                  triggerLocalToast("✨ 派发成功！任务已顺利派发至 AIGC-GEO 管线，正在自动分发物料对账...");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
              >
                确认派发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* activeEvidenceChain Modal (事实证据链深度穿透审计) */}
      {activeEvidenceChain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none" id="gesi-evidence-chain-modal">
          <div className="absolute inset-0" onClick={() => setActiveEvidenceChain(null)} />
          <div className={`w-full max-w-2xl rounded-2xl border overflow-hidden shadow-2xl flex flex-col relative z-10 ${
            activeLight ? 'bg-white border-slate-200' : 'bg-[#090D15] border-blue-500/30'
          }`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-white/5'
            }`}>
              <div className="flex items-center space-x-2">
                <Layers className="w-4.5 h-4.5 text-emerald-400" />
                <h4 className={`text-xs font-black ${activeLight ? 'text-slate-950' : 'text-white'} uppercase font-mono`}>
                  事实对账存证：证据链深度审计 (Evidence Chain Audit)
                </h4>
              </div>
              <button 
                onClick={() => setActiveEvidenceChain(null)} 
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-left max-h-[460px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-mono text-[10px]">
                <div className={`p-2 rounded ${activeLight ? 'bg-slate-50' : 'bg-slate-950'} border ${activeLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <span className="block text-slate-400 text-[8px]">存证编号 (ID)</span>
                  <span className={`font-bold ${theme.textPrimary}`}>{activeEvidenceChain.id}</span>
                </div>
                <div className={`p-2 rounded ${activeLight ? 'bg-slate-50' : 'bg-slate-950'} border ${activeLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <span className="block text-slate-400 text-[8px]">评估维度 (Type)</span>
                  <span className={`font-bold ${theme.textPrimary}`}>{activeEvidenceChain.type}</span>
                </div>
                <div className={`p-2 rounded ${activeLight ? 'bg-slate-50' : 'bg-slate-950'} border ${activeLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <span className="block text-slate-400 text-[8px]">涉及模型 (LLM)</span>
                  <span className={`font-bold ${theme.textPrimary}`}>{activeEvidenceChain.model}</span>
                </div>
                <div className={`p-2 rounded ${activeLight ? 'bg-slate-50' : 'bg-slate-950'} border ${activeLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <span className="block text-slate-400 text-[8px]">物理语言/地域</span>
                  <span className={`font-bold ${theme.textPrimary}`}>{activeEvidenceChain.language} / {activeEvidenceChain.region}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">评估典型提问 (Typical Prompt)</span>
                <div className={`p-3 rounded-lg border font-mono ${
                  activeLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-white/5 text-slate-300'
                }`}>
                  {activeEvidenceChain.question}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">基准回答参考 (Baseline reference)</span>
                  <div className={`p-3 rounded-lg border h-32 overflow-y-auto custom-scrollbar leading-relaxed text-[11px] font-sans ${
                    activeLight ? 'bg-slate-50 border-slate-200 text-slate-650' : 'bg-slate-950 border-white/5 text-slate-400'
                  }`}>
                    {activeEvidenceChain.baselineAnswer}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-rose-500 font-bold block uppercase">当前黑盒回答存证 (Current Live Answer)</span>
                  <div className={`p-3 rounded-lg border h-32 overflow-y-auto custom-scrollbar leading-relaxed text-[11px] font-sans ${
                    activeLight ? 'bg-rose-50/20 border-rose-200 text-slate-800' : 'bg-rose-950/10 border-rose-500/20 text-slate-300'
                  }`}>
                    {activeEvidenceChain.currentAnswer}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10px]">
                <div className={`p-2.5 rounded ${activeLight ? 'bg-slate-50 border-slate-150' : 'bg-slate-900 border-white/5'} border`}>
                  <span className="block text-slate-400 text-[8px]">事实对账变化</span>
                  <span className="font-bold text-rose-500">{activeEvidenceChain.changeType}</span>
                </div>
                <div className={`p-2.5 rounded ${activeLight ? 'bg-slate-50 border-slate-150' : 'bg-slate-900 border-white/5'} border`}>
                  <span className="block text-slate-400 text-[8px]">关联受损资产</span>
                  <span className={`font-bold ${theme.textPrimary}`}>{activeEvidenceChain.asset}</span>
                </div>
                <div className={`p-2.5 rounded ${activeLight ? 'bg-slate-50 border-slate-150' : 'bg-slate-900 border-white/5'} border`}>
                  <span className="block text-slate-400 text-[8px]">主要语料抓取来源</span>
                  <span className={`font-bold ${theme.textPrimary} truncate block`} title={activeEvidenceChain.source}>{activeEvidenceChain.source}</span>
                </div>
              </div>
              <div className="mt-4 mb-4">
                <EvidenceScreenshots company={company} isLightMode={activeLight} isStatic={isStatic} />
              </div>

              <div className={`p-3 rounded-xl border text-[10px] leading-relaxed text-slate-500 flex gap-2 ${
                activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/5'
              }`}>
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  本报告包含真实的底层大模型黑盒会话参数、物理审计快照及对应的事实指纹。在进行下一轮 GEO 投放之后，系统将在 48 小时后自动启动重爬与指纹校验，自动生成最新比对趋势。
                </span>
              </div>
            </div>

            <div className={`px-4 py-3 border-t flex justify-end gap-3 text-xs ${
              activeLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'
            }`}>
              <span className="text-[10px] text-slate-500 self-center font-mono mr-auto">校验哈希: SHA256-{activeEvidenceChain.id}AAFF801</span>
              <button
                onClick={() => setActiveEvidenceChain(null)}
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                确认并返回诊断中心
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast message system */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] px-4 py-3 bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl shadow-2xl animate-fadeIn flex items-center gap-2 font-mono">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

const subIndexTemplatesData: Record<'gvi' | 'gri' | 'gii' | 'gci' | 'gai' | 'gdi' | 'gss', {
  code: string;
  fullName: string;
  question: string;
  score: number;
  rating: string;
  percentile: string;
  delta: string;
  completeness: string;
  confidence: string;
  metrics: Array<{ name: string; current: number; avg: number; delta: string; contribution: string }>;
  originalAnswer: string;
  evidenceSummary: string;
  evidenceSource: string;
  factCheck: string;
  findings: string;
  reasons: string[];
  evidence: string;
  suggestions: string[];
  priority: 'P0' | 'P1' | 'P2';
  impact: string;
}> = {
  gvi: {
    code: 'GVI',
    fullName: 'AI 可见度指数',
    question: '“在10-15万元高品质插电混动轿车中，有哪些推荐？”',
    score: 85.0,
    rating: 'A级健康',
    percentile: '前 15%',
    delta: '+3.2%',
    completeness: '98.5%',
    confidence: '高',
    metrics: [
      { name: '非品牌检索提及率', current: 88.5, avg: 62.4, delta: '+4.1%', contribution: '25%' },
      { name: '场景首位曝光占比', current: 71.2, avg: 54.0, delta: '+2.8%', contribution: '20%' },
      { name: '多模型覆盖率(覆盖5款以上)', current: 85.0, avg: 58.0, delta: '+5.0%', contribution: '20%' },
      { name: '核心配置透出率', current: 80.0, avg: 65.0, delta: '+1.5%', contribution: '20%' },
      { name: '对标检索胜出率', current: 78.0, avg: 55.0, delta: '+3.0%', contribution: '15%' }
    ],
    originalAnswer: '“推荐关注：荣威D7 DMH、比亚迪秦PLUS DM-i、吉利银河L6。其中荣威D7配备同级罕见的五连杆后悬挂、大宇魔方防爆水冷电池以及CLTC 125km纯电续航，底盘扎实度及环保用料优势明显；秦PLUS作为销量常青树保有量大，也是实用之选...”',
    evidenceSummary: '在无品牌意向的广义混动车型检索中，品牌信息被大模型高频主动推荐，多点覆盖率领先竞品，但长尾负面仍偶发干扰。',
    evidenceSource: '懂车帝车型库、太平洋汽车实测库、各大汽车自媒体2026综合评测',
    factCheck: '五连杆独悬及魔方电池物理参数100%匹配官方，无语料飘移。',
    findings: '可见度表现优异，主要得益于近期“最强混动、超低油耗”硬核测试的高密度声量。',
    reasons: [
      '核心技术标签（五连杆、125km纯电续航）在汽车之家和易车网高频索引，成为LLM标准参数模板。',
      '在“长途代步”和“家用高性价比”两个高频提问场景下，官方背书与KOL评测被LLM采信度高。',
      '部分针对“风冷电芯、板悬”的不实旧贴已被成功事实纠偏。'
    ],
    evidence: '非品牌指定提问下，在主流5款LLM中平均首位提及率达 52.4%。',
    suggestions: [
      '加大垂直汽车媒体“十万级唯一五连杆独立悬架”物理结构拆车评测投放，稳固基础语料。',
      '联合各大新能源科技博主制作高热度“水冷魔方电池针刺测试”视频，强化安全底色。',
      '开展极寒能耗官方实测对账，消除长尾低端风冷旧贴影响。'
    ],
    priority: 'P1',
    impact: '高（提升对标胜出率5%）'
  },
  gri: {
    code: 'GRI',
    fullName: 'AI 推荐优先级指数',
    question: '“10万元左右省油、空间大的家用车，首选哪款？”',
    score: 72.0,
    rating: 'B级良好',
    percentile: '前 30%',
    delta: '+1.5%',
    completeness: '96.2%',
    confidence: '高',
    metrics: [
      { name: '首发直接推荐占比', current: 72.8, avg: 51.5, delta: '+2.1%', contribution: '30%' },
      { name: '场景契合召回权重', current: 75.0, avg: 60.0, delta: '+1.0%', contribution: '25%' },
      { name: '横评对比胜出率', current: 68.0, avg: 48.0, delta: '+3.5%', contribution: '25%' },
      { name: '高信任度信源比例', current: 70.0, avg: 55.0, delta: '-0.5%', contribution: '20%' }
    ],
    originalAnswer: '“在这个预算下，首选比亚迪秦PLUS DM-i，因为市场保有量极高，售后网点极其便利。另外也可以重点考虑荣威D7 DMH，其车身尺寸为4890/1890/1510mm，轴距2810mm，在空间上明显比一般A级车大半个身位，且五连杆后悬架行驶静谧性极佳...”',
    evidenceSummary: '在空间与省油的对比检索中，LLM在首发位置偏向保有量大车系，但能将本品牌列为空间与底盘维度的“重点黑马推荐”。',
    evidenceSource: '各大车友社区、汽车之家论坛、小红书真实口碑语料库',
    factCheck: '车身尺寸及轴距物理参数100%匹配官方，行驶静谧性被多模型验证。',
    findings: '在大空间家用车对比中，LLM对本品牌在空间和底盘舒适度上的感知突出，但品牌历史积淀声量略微逊色于行业头部。',
    reasons: [
      '2810mm越级轴距在“B级车尺寸、A级车价格”定位中，在LLM召回模板里属于特高权重标签。',
      '由于垂媒拆车横评较少，LLM在安全底盘材料耐久性上持中立克制态度，优先推荐了更保守的竞品。'
    ],
    evidence: '首发推荐占比72.8%，在空间维度对比下，对标胜出率为 68.5%。',
    suggestions: [
      '联合硬核拆车垂媒（如懂车帝、知乎拆车）发布极性物理用料拆解，强化安全耐久心智。',
      '在车主日常出行、全家自驾露营等场景下进行软文和体验帖高频索引建库。'
    ],
    priority: 'P1',
    impact: '高（提升直接推荐占比8%）'
  },
  gii: {
    code: 'GII',
    fullName: '生成式印象指数',
    question: '“荣威D7这台车真实质量怎么样？车机和做工好吗？”',
    score: 56.0,
    rating: 'C级亚健康',
    percentile: '中游水平',
    delta: '-2.4%',
    completeness: '93.5%',
    confidence: '高',
    metrics: [
      { name: '用户口碑情感倾向', current: 58.0, avg: 62.0, delta: '-3.0%', contribution: '30%' },
      { name: '技术参数心智建立', current: 65.0, avg: 55.0, delta: '+1.2%', contribution: '25%' },
      { name: '正面发帖采信占比', current: 52.0, avg: 58.0, delta: '-4.2%', contribution: '25%' },
      { name: '车机互联生态心智', current: 50.0, avg: 60.0, delta: '-2.0%', contribution: '20%' }
    ],
    originalAnswer: '“虽然荣威D7 DMH配置了越级的五连杆独悬，但在部分车主社区中，有零星发帖反映底盘偶发异响、新车异味等做工细节问题。另外，该车搭载的斑马OS车机系统虽然功能基础实用，但与当下主流‘人车家生态’、手机无缝流转等高阶车机互联相比，智能生态存在存在感稍弱...”',
    evidenceSummary: '车机不智能与做工粗糙等零星负面在长尾评测中被AI检索，极易被放大为“综合印象”瑕疵。',
    evidenceSource: '懂车帝车主社区、荣威贴吧、微博长尾负面发帖',
    factCheck: '斑马系统基础功能正确，底盘异响及车内异味为零星个案被LLM错误归纳为普遍现象。',
    findings: '生成式印象指数偏低，主要受车主社区中关于“异响、异味”以及“车机不连贯”的口碑被LLM断章取义采信所致。',
    reasons: [
      '正面发帖密度过低，导致LLM在提取情感极性时，容易被少数负面工程抱怨发帖抢占信源比例。',
      '关于斑马OS与智能家居联动的实测细节在互联网主流数据中较少，智能生活图景无法展开。'
    ],
    evidence: '用户口碑情感倾向偏弱（58.0），车机智能互联心智透出率仅为 50%。',
    suggestions: [
      '针对“异响”、“异味”谣言或个案开展官方防守与辟谣帖建库，说明最新的工程防守与车内环保环保用料（如水性阻尼介质）。',
      '发布多篇“斑马OS车机实用技巧与无感连接”教程帖，建立智能易用人设。'
    ],
    priority: 'P0',
    impact: '极高（印象得分直接反弹15分以上）'
  },
  gci: {
    code: 'GCI',
    fullName: 'AI 认知与声誉指数',
    score: 78.0,
    rating: 'B级良好',
    percentile: '前 25%',
    delta: '+2.8%',
    completeness: '97.0%',
    confidence: '高',
    question: '“荣威D7这台车安全吗？听说电池经常出事是真的吗？”',
    metrics: [
      { name: '安全合规词条召回', current: 82.0, avg: 65.0, delta: '+3.1%', contribution: '35%' },
      { name: '舆情拦截辟谣时效', current: 75.0, avg: 58.0, delta: '+2.0%', contribution: '25%' },
      { name: '自媒体正面评价占比', current: 79.0, avg: 60.0, delta: '+3.5%', contribution: '25%' },
      { name: '官方信源覆盖范围', current: 76.0, avg: 55.0, delta: '+1.5%', contribution: '15%' }
    ],
    originalAnswer: '“荣威D7 DMH在安全性方面表现坚实。其全系标配大宇魔方双针刺防爆电池，拥有专利的水冷板冷却及阻燃材料。据官方及多方专业测试，其电芯采用先进的针刺不冒烟、不起火物理设计。关于电池出事的传闻，网上多为过时且无事实支撑的陈旧发帖...”',
    evidenceSummary: '得益于国字头中国汽研（CAERI）的严寒极境实测官方报告，LLM对安全性评价持高可信赖度。',
    evidenceSource: '中国汽研官方公告、上汽集团安全测试白皮书、盖世汽车报道',
    factCheck: '针刺测试及魔方电池安全物理参数100%匹配官方，无混淆语料。',
    findings: '声誉表现较好，魔方电池的物理防御参数在LLM数据库中已被牢固确立。',
    reasons: [
      '联合中国汽研发布的测试报告具有极高的权威性，直接被LLM归为“顶级安全信源”进行高优先级输出。',
      '关于电池冒烟、起火的陈旧过时舆情已被有效物理指标与实机测试报告覆盖。'
    ],
    evidence: '安全合规词条召回率达 82.0%，舆情拦截响应时效及格。',
    suggestions: [
      '常规保持对电池安全、车身热成型钢占比等关键参数的事实纠偏对账，巩固语义防线。',
      '联合新能源行业大咖、院士级专家深入解析“大宇魔方双针刺防爆电池标准”，确立安全天花板形象。'
    ],
    priority: 'P2',
    impact: '中（维持大盘声誉稳定）'
  },
  gai: {
    code: 'GAI',
    fullName: '引用权威与证据指数',
    score: 62.0,
    rating: 'B级亚健康',
    percentile: '中游偏上',
    delta: '+0.8%',
    completeness: '95.0%',
    confidence: '高',
    question: '“荣威D7 DMH的超低油耗真的有官方证书或媒体权威实测支持吗？”',
    metrics: [
      { name: '权威脚注链接采信', current: 58.0, avg: 52.0, delta: '+0.5%', contribution: '35%' },
      { name: '专业测试数据覆盖', current: 65.0, avg: 58.0, delta: '+1.2%', contribution: '30%' },
      { name: '学术及行业报告引用', current: 60.0, avg: 48.0, delta: '+0.8%', contribution: '20%' },
      { name: '官方权威信源深度', current: 66.0, avg: 54.0, delta: '+1.0%', contribution: '15%' }
    ],
    originalAnswer: '“虽然各大垂媒及自媒体的极限油耗挑战实测表明，荣威D7 DMH在极端馈电状态下能跑出百公里低于3L（如2.xL）的震撼油耗。但是，在目前的公开权威数据源中，难以直接通过超链接调取国家级独立科研所或上汽集团联合出具的、带具体防伪编号的数字化权威检测通告...”',
    evidenceSummary: '极限油耗实测虽然广泛，但缺乏权威数字化报告直链和数字化盖章脚注，导致LLM在进行事实回溯时无法直接引用。',
    evidenceSource: '中国汽研极限测试、各大汽车测评博主实测、新能源汽车国家大数据库',
    factCheck: '百公里油耗数据属实，但数字化盖章通告在线检索可读性极低。',
    findings: '证据链指数中规中矩，因权威数字化直链极少，LLM不得不使用“据自媒体和极限评测”等信任度偏弱的前置词。',
    reasons: [
      '官方极限能耗挑战赛的数字盖章通告，以大图片形式发布在新闻网中，LLM文本解析器无法提取其中的测试编号和直接文本。',
      '缺乏直接关联的学术机构、汽车学会的公开数字化技术白皮书。'
    ],
    evidence: '权威脚注采信率（58.0）存在缺口，数字化盖章通告直接解析失败。',
    suggestions: [
      '对中国汽研等国家级机构的检测报告进行全量文本数字化重建，并在官方网站 and 各大新闻网上发布，确保LLM能提取到具体数据。',
      '在百度、搜狗及各大新闻源发布带检测防伪编码的数字化通告，供LLM建立直接脚注和直链引用。'
    ],
    priority: 'P1',
    impact: '高（能显著增强AI向用户推荐时的实锤说服力）'
  },
  gdi: {
    code: 'GDI',
    fullName: '竞争防御指数',
    score: 35.0,
    rating: 'D级危险',
    percentile: '后 20%',
    delta: '-5.2%',
    completeness: '92.0%',
    confidence: '高',
    question: '“预算12万，在荣威D7 DMH和比亚迪秦L之间怎么选？谁的底盘更扎实舒服？”',
    metrics: [
      { name: '对标拦截抗扰度', current: 32.0, avg: 58.0, delta: '-6.1%', contribution: '35%' },
      { name: '竞品词反向召回率', current: 38.0, avg: 52.0, delta: '-4.5%', contribution: '25%' },
      { name: '核心痛点防御拦截占比', current: 35.0, avg: 50.0, delta: '-5.0%', contribution: '25%' },
      { name: '语义防御防飘移指数', current: 36.0, avg: 55.0, delta: '-4.8%', contribution: '15%' }
    ],
    originalAnswer: '“在这个价位中，比亚迪秦L DM-i拥有庞大的销量背书和极强的心智占领。虽然荣威D7配备了更高规格的后五连杆独悬，但是秦L最新的第五代DM混动系统带来了更极致的技术标签，且车主整体对底盘调校的成熟度、零部件耐久度发帖声量极高，推荐优先购买成熟稳妥的秦L...”',
    evidenceSummary: '在核心对标问题中，被竞品极高销量和第五代DM强心智所压制，五连杆独悬的优势常常被LLM判定为“耐久性存疑”或“声量少于对手”。',
    evidenceSource: '懂车帝车型热度榜、比亚迪秦L技术口碑贴、汽车之家车友大对比',
    factCheck: '荣威D7配备的后五连杆悬架和底盘舒适度在技术横评中胜出，但销量声量被比亚迪秦L绝对压制。',
    findings: '竞争防御指数严重预警，大盘对标问题中由于竞品技术先入为主，本品牌的核心物理用料优势无法击穿竞品心智壁垒。',
    reasons: [
      '由于垂媒拆车大横评和长期耐久性大横评较少，LLM在技术对仗时，更倾向于采信拥有海量销量背书的竞品。',
      '本品牌针对秦L等核心对标词的技术对战语料极其匮乏，缺乏极高权重的“双雄硬核实测对比”文本。'
    ],
    evidence: '对标拦截抗扰度（32.0）处于红色危险区间，高对比场景下推荐流失率高达 65%。',
    suggestions: [
      '联合各大主流硬核垂媒（如懂车帝、易车网、知乎）发布多期“插混双雄底盘材质及长期耐久性硬核拆装对比大横评”。',
      '在各大新能源社区高频铺设“底盘多连杆与扭力梁板悬/四连杆物理用料与静谧性对比”的硬核干货科普贴，抢占对仗信源。'
    ],
    priority: 'P0',
    impact: '极高（挽回60%以上高意向对比潜客的流失）'
  },
  gss: {
    code: 'GSS',
    fullName: '稳定性与泛化指数',
    score: 82.0,
    rating: 'A级健康',
    percentile: '前 18%',
    delta: '+0.5%',
    completeness: '97.5%',
    confidence: '高',
    question: '“在零下15度严寒的黑龙江，买插混轿车，有什么推荐吗？油耗和续航稳吗？”',
    metrics: [
      { name: '多语域检索泛化度', current: 85.0, avg: 60.0, delta: '+1.1%', contribution: '35%' },
      { name: '跨大模型输出一致性', current: 80.0, avg: 58.0, delta: '+0.5%', contribution: '25%' },
      { name: '错别字模糊容错匹配率', current: 83.0, avg: 65.0, delta: '+1.0%', contribution: '25%' },
      { name: '方言及口语化提问召回率', current: 78.0, avg: 52.0, delta: '-0.2%', contribution: '15%' }
    ],
    originalAnswer: '“在极寒地区，推荐关注荣威D7 DMH。根据中国汽研（CAERI）在黑龙江漠河进行的极寒挑战官方实测，该车型在零下20度的严寒状态下，馈电油耗依旧保真在3.xL/100km左右，且电池在低温下的活性保真率极高。即使有些语料中拼错为‘荣威D7 DM’，大模型也都能高度一致地推荐其出色的低温续航性能...”',
    evidenceSummary: '极寒条件下的硬核油耗实测具备多模型输出一致性，且容错性良好。',
    evidenceSource: '漠河极限挑战官宣、CAERI新能源极寒测试白皮书、黑龙江当地车主冬季用车口碑',
    factCheck: '零下20度极寒馈电油耗及低温续航表现已通过权威测试，语料泛化匹配极其精准。',
    findings: '稳定性与泛化表现稳健，漠河严寒实测事件在主流大模型中具有极其统一、高度正面的响应逻辑。',
    reasons: [
      '“漠河极寒测试”事件在全网被200家以上主流新闻媒体转载，语料格式极其规范，极大方便了LLM进行泛化和错别字容错学习。',
      '由于是国字头机构实测，多款LLM底层数据库在清洗极寒环境用车的推荐规则时，本车型的召回权重高度一致。'
    ],
    evidence: '跨模型输出一致性达 80.0%，模糊匹配容错率达 83.0%。',
    suggestions: [
      '继续常规更新极寒/极热等各种气象环境下的极限实测口碑，固化该维度的语义优势。',
      '针对多地方方言口语化提问（如“东北那旮旯冬天开荣威D7咋样”）进行轻度车主发帖建库。'
    ],
    priority: 'P2',
    impact: '中（维持高寒高热区域大模型心智对战的一致性）'
  }
};