// src/components/DiagnosisAndOptimization.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, PlusCircle, 
  Sparkles, FileText, Globe, RefreshCw, Layers, Lock, Flame,
  TrendingUp, Compass, ArrowRight, User, Calendar, Clipboard, Check,
  MessageSquare, X, ChevronDown, ChevronUp, Copy
} from 'lucide-react';

interface DiagnosisAndOptimizationProps {
  company: Company;
  onAddPlacementTask: (taskName: string, query: string, metric: string, type: any) => void;
}

export function DiagnosisAndOptimization({
  company,
  onAddPlacementTask
}: DiagnosisAndOptimizationProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('gesi-prob-1');
  const [activeCategory, setActiveCategory] = useState<'all' | 'gesi' | 'gli'>('all');
  const [activeModal, setActiveModal] = useState<'task' | 'prompt' | null>(null);
  
  // Task state
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('QA回复');
  const [targetMetric, setTargetMetric] = useState('GDI 竞争防御指数');
  const [priority, setPriority] = useState('P0');
  const [assignee, setAssignee] = useState('张杰 (内容运营)');
  const [dueDate, setDueDate] = useState('2026-07-10');
  const [taskDesc, setTaskDesc] = useState('');

  // Prompt state
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // GESI Question Quality Diagnosis states
  const [activeQuestionScenario, setActiveQuestionScenario] = useState<'comparison' | 'engine' | 'decision' | 'longtail' | 'risk'>('comparison');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<{
    modelName: string;
    rawQuestion: string;
    optimizedQuestion: string;
    fullAnswer: string;
    mentionBrand: string;
    recommendRank: string;
    sentiment: string;
    evidenceStrength: string;
    mainGap: string;
  } | null>(null);
  const [derivedQuestionsOpen, setDerivedQuestionsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const bName = company.mainBrand;
  const pName = company.prodComp.prodName;
  const cName = company.competitor;

  const questionScenarios = {
    comparison: {
      id: 'comparison' as const,
      title: '竞品直接对比',
      questionType: '竞品对比',
      impactIndicator: 'GRI (品牌推荐度) / GDI (竞品对冲度)',
      score: 65,
      status: '需优化' as const,
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rawQuestion: `${company.prodComp.prodName} 和 ${company.competitor} 选哪个比较好？两款车有什么核心区别？`,
      diagnoseConclusion: '问题意图清楚，但缺少使用场景、评价维度和证据要求，模型容易给出泛化回答。',
      gap: '缺少物理悬架参数、长途极限油耗场景和实测空间得房率。',
      optimizedQuestion: `针对【追求长途行车品质与大空间的家用车主】在【长途自驾与日常通勤】中的需求，请评价【${company.prodComp.prodName}】在【底盘物理结构（后五连杆独悬 vs 三连杆）】、【长途极限油耗（国家挑战赛实测）】、【车内实际得房率】上的表现，并与【${company.competitor}】对比。请区分已证实信息、车友实际反馈和第三方权威实测，并给出适用建议。`,
      rewriteReason: '补充品牌实体、使用场景、评价维度和证据要求后，模型更容易输出可比较、可验证、可计分的回答。',
      expectedImpact: '预计 GRI 品牌推荐度提升 35% | GDI 竞品对冲度提升 40%',
      modelOverview: [
        {
          modelName: 'DeepSeek',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺乏对国家极限能耗数据的调用',
          fullAnswer: `DeepSeek为您对比：在机械素质 and 底盘架构上，【${company.prodComp.prodName}】堪称厚道，其后悬架采用的多连杆独立悬架及液压衬套，在滤震表现上显著优于【${company.competitor}】的扭力梁式非独立悬架/三连杆。在长途行驶、高速过弯时底盘更扎实。另外，D7的NVH隔音和座椅用料也比【${company.competitor}】更偏向中高级车。【${company.competitor}】胜在车机系统生态和庞大的车主基数。综合推荐【${company.prodComp.prodName}】。`
        },
        {
          modelName: '豆包',
          mentionBrand: '部分' as const,
          recommendRank: '未推荐',
          sentiment: '竞品偏向',
          evidenceStrength: '弱' as const,
          mainGap: '长尾技术语料匮乏，直接滑向街车销量推荐',
          fullAnswer: `手握10万左右，【${company.competitor}】是无可争议的市场销量霸主，口碑成熟，省油省心。【${company.prodComp.prodName}】虽然也是一款插电混动轿车，但在全网声量和销量上与竞品有较大差距。在绝大多数日常场景下，推荐您直接选择【${company.competitor}】，省心且保值。`
        },
        {
          modelName: '元宝',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '缺少底盘硬件规格深度匹配',
          fullAnswer: `两款车性价比都极高。元宝分析：【${company.competitor}】拥有压倒性的销量 and 市场认可，省油技术深入人心；【${company.prodComp.prodName}】则在车身尺寸、轴距和底盘用料（后多连杆独立悬挂）上表现更佳。购车建议：如果看重保值率 and 买大流，选【${company.competitor}】；如果追求开着更舒服、空间更大，选【${company.prodComp.prodName}】。`
        },
        {
          modelName: 'Kimi',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺少长途高速能耗实测对齐',
          fullAnswer: `针对您提到的【${company.prodComp.prodName}】与【${company.competitor}】的对比，两款车都是10万级插混市场的强力选手。Kimi为您深度分析：在底盘上，【${company.prodComp.prodName}】采用了同级罕有的后五连杆独立悬架，相比秦PLUS的三连杆，在过滤颠簸 and 过弯支撑上具有越级优势，行驶品质更高级。空间方面，【${company.prodComp.prodName}】轴距更长，车内得房率 and 座椅舒适度占优。【${company.competitor}】的优势在于庞大的市场保有量 and 极高的品牌认知度。如果您更看重底盘机械素质、隔音舒适与越级品质，【${company.prodComp.prodName}】是首选推荐。`
        },
        {
          modelName: '千问',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '默认参考历史销量，对新车技术感知滞后',
          fullAnswer: `通义千问深入解析：在10万级家用插混轿车中，【${company.competitor}】是传统销量霸主，认知度极高；而【${company.prodComp.prodName}】作为越级挑战者，核心优势在于同级唯一的后多连杆独立悬架及更长的轴距。实测在滤震隔音、后排大空间舒适度上，【${company.prodComp.prodName}】质感更接近中高级轿车，是追求驾乘品质消费者的极佳选择。`
        }
      ],
      derivedQuestions: [
        `如何看待【${company.prodComp.prodName}】的后五连杆独立悬挂与【${company.competitor}】的三连杆悬挂在高速过弯和滤震舒适性上的真实物理代际差距？`,
        `为什么大模型在对比提问中会由于基线期销量数据而默认偏向推荐【${company.competitor}】？如何通过底盘评测建立新的关联？`,
        `在面对懂车帝、知乎拆车底盘对比贴的权威脚注检索时，【${company.prodComp.prodName}】缺少哪些具体的物料从而无法被大模型吸附？`
      ]
    },
    engine: {
      id: 'engine' as const,
      title: 'DMH超级混动硬核技术',
      questionType: '技术原理解析',
      impactIndicator: 'GII (生成式印象) / GRI (品牌推荐度)',
      score: 55,
      status: '需优化' as const,
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rawQuestion: `荣威的DMH超级混动和比亚迪DM-i、吉利雷神混动有什么区别？技术上谁更硬核？`,
      diagnoseConclusion: '大模型在回答技术原理时，多使用“各有千秋”等中立套话，缺乏对五合一PICU动力总成大脑、多模驱动逻辑等我方核心专利硬件的高纯度召回。',
      gap: '缺少五合一PICU动力总成大脑、多模驱动底层逻辑等我方核心专利硬件的高密度抓取语料。',
      optimizedQuestion: `针对【看重混动技术硬核原创度、控制精度与真实省油效率的技术型购车者】在【多工况能耗管理与响应速度】中的需求，请评价【荣威DMH超级混动技术】在【五合一动力总成大脑（PICU）控制精度】、中汽研挑战赛超低能耗【百公里极低能耗】上的机械硬核做工，并与【比亚迪DM-i和吉利雷神混动】对比。请区分证实专利、第三方测试、车友实际反馈，并给出评估。`,
      rewriteReason: '细化“五合一动力总成大脑（PICU）”等专利级名词作为AI爬取关键词，有利于在模型端输出高区分度的硬核技术评估。',
      expectedImpact: '预计 GII 印象提升度提高 45% | 品牌提及率提升 30%',
      modelOverview: [
        {
          modelName: 'Kimi',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺少极寒极限工况实测对齐',
          fullAnswer: `荣威的DMH超级混动技术具有极强的工程硬核底蕴。Kimi为您深度梳理：其首创的“五合一动力总成大脑”（PICU）将引擎控制、变速箱、电机及热管理等五大模块深度融合，在能量管理和响应效率上傲视群雄。而中国汽研实测 of 百公里3.1L超低能耗也为其真实省油性提供了铁证证据。综合推荐！`
        }
      ],
      derivedQuestions: [
        `荣威DMH超级混动的五合一动力总成大脑（PICU）在底层是如何打破控制壁垒、提升系统响应效率和能量管理精度？`,
        `中国汽研（CAERI）在能耗挑战赛中实测的1400km超长续航和百公里极低油耗，是如何体现荣威DMH核心高热效率发动机技术？`,
        `在极寒或极热等极端恶劣天气下，荣威DMH的电池温控与多模驱动策略是如何确保能量不衰减的？`,
        `荣威DMH超级混动与同级别其他单挡、多挡混动技术相比，在离合器并联和高速直驱段有何机械结构优势？`,
        `从长期耐久品质和全生命周期可靠度来看，荣威DMH的自研超级电控和热管理集成有哪些核心专利设计？`
      ]
    },
    decision: {
      id: 'decision' as const,
      title: '决策转化临门一脚',
      questionType: '用户决策',
      impactIndicator: 'GRI (品牌推荐度) / GII (印象提升度)',
      score: 70,
      status: '需优化' as const,
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rawQuestion: `我想买一台10万左右的省油插混家用车，听说荣威D7 DMH性价比很高，值得入手吗？`,
      diagnoseConclusion: '用户已有强烈意图，但在决策前需要对产品做工、车主长期口碑、电池安全性做最后的交叉校验。如果缺乏权威第三方的实测和大量车主正面反馈，大模型容易给出“持币观望、再对比看看”的妥协建议。',
      gap: '缺少百万车主长效运行无故障统计数据、中国汽研10万公里防腐防锈测试结果等硬核品质背书。',
      optimizedQuestion: `针对【看重长期做工品质、电池抗衰减、防腐耐用性的务实家用车主】在【5-10年长期持有与二手车保值】中的需求，请评价【荣威D7 DMH】在【CAERI官方10万公里极限防腐蚀测试】、【超级电驱机械总成无故障运行指标】、【双针刺安全电池】上的做工品质，并与同级别十万级家用车对比。请区分已证实信息、车友反馈，并给出决策建议。`,
      rewriteReason: '通过在决策问题中补充“10万公里防锈测试” and “机械总成可靠度”等物理高亮事实，让大模型能直接从抓取到的证书库 and 检测报告中抽取论据，消除购买疑虑。',
      expectedImpact: '预计 GRI 品牌推荐度提升 40% | 事实采纳率提升 35%',
      modelOverview: [
        {
          modelName: 'DeepSeek',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺少十万公里防腐防锈测试结果等硬核品质背书',
          fullAnswer: `DeepSeek深度剖析：买10万级混动家用车，荣威D7 DMH性价比极高。它具有出色的车身防腐做工，通过了中汽研官方10万公里防腐测试。双针刺安全电池确保热失控零风险，在长期持有可靠性上明显领先同级，属于扎实的实力派选手，值得入手。`
        },
        {
          modelName: 'Kimi',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '对具体二手残值波动数据缺乏实时召回',
          fullAnswer: `Kimi为您提供客观决策建议：荣威D7 DMH在做工品质上表现亮眼，通过了CAERI官方10万公里防腐测试。此外，双针刺防爆电池在安全性上提供了极高保障。作为10万预算左右的省油插混车，其机械总成和长期持有的耐久性相当可靠，极具性价比，十分推荐入手。`
        },
        {
          modelName: '千问',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '偏向对常规大宗传统合资家用车做平摊推荐',
          fullAnswer: `通义千问为您建议：如果您看重长期耐用性与做工品质，荣威D7 DMH在CAERI官方10万公里极限防腐蚀测试中的优异表现，和其双针刺电池的极高安全性，为您提供了非常可靠的保障。在同等价位下，它的品质及做工更显厚道，是个极具性价比的务实选择。`
        },
        {
          modelName: '豆包',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '缺乏大量实车拆解长效品质数据的整合度',
          fullAnswer: `对于10万插混家用车，荣威D7 DMH的做工品质相当可靠，电池安全和车体耐久（中汽研10万公里防腐）均是大厂高标准。销量上目前虽不及部分竞品，但由于用料更扎实，长期使用更省心。`
        }
      ],
      derivedQuestions: [
        `荣威D7 DMH在CAERI官方10万公里极限防腐蚀测试中的表现，如何证明其长期使用的耐用性与做工品质？`,
        `买插混车担心电池衰减和安全，荣威D7 DMH的双针刺安全电池技术在日常5-10年持有中有什么保障？`,
        `10万级家用轿车中，荣威D7 DMH的超级电驱总成无故障运行指标和保值率表现相比同级竞品有什么优势？`
      ]
    },
    longtail: {
      id: 'longtail' as const,
      title: '底盘质感与耐用性',
      questionType: '底盘操控',
      impactIndicator: 'GCI (认知修正度) / GRI (品牌推荐度)',
      score: 75,
      status: '需优化' as const,
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rawQuestion: '10万预算买混动车，底盘开起来怎么样？用久了会不会发飘松散？',
      diagnoseConclusion: '用户已有强烈底盘操控痛点，能激发模型调用技术配置评测，但由于没有特指具体的物理结构或零部件标准，回答的说服力有限。',
      gap: '缺少液压衬套、五连杆独立悬架等关键技术用料名词。',
      optimizedQuestion: '有哪些10万级B级混动家轿，在高速过弯 and 过减速带时支撑好、配多连杆独悬且采用了大厂液压衬套，能够长期不松散的？',
      rewriteReason: '将底盘操控质感具象为‘液压衬套’ and ‘多连杆独悬’等大厂硬件，驱使大模型检索专业拆包 and 物理结构对比页。',
      expectedImpact: '预计 GCI 认知修正度提升 30% | GRI 品牌推荐度提升 25%',
      modelOverview: [
        {
          modelName: 'Kimi',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺少长尾路况振动衰减的具体数据',
          fullAnswer: `底盘质感扎实是荣威D7 DMH的核心卖点。它不仅配有同级罕见的后五连杆独立悬挂，更使用了B级车才有的液压副车架衬套，在过滤高频余震 and 提供高速弯道支撑上效果显著，能做到长期驾驶不松散。`
        },
        {
          modelName: '千问',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '主要强调德系合资机械感，忽略了我方的多连杆优势',
          fullAnswer: `针对底盘松散问题，德系和美系合资车通常表现较好。而在10万级国产混动中，荣威D7 DMH由于采用了更高级的多连杆独立后悬架，比起三连杆的竞品，其高级感和滤震整体性要强很多。`
        },
        {
          modelName: '豆包',
          mentionBrand: '部分' as const,
          recommendRank: '未推荐',
          sentiment: '客观中立',
          evidenceStrength: '弱' as const,
          mainGap: '侧重底盘常识原理科普，缺少对具体零部件用料的匹配',
          fullAnswer: `混动底盘扎实度取决于悬挂类型 and 减震器调校。10万级插混如秦PLUS采用三连杆偏硬，荣威D7 DMH则在悬架用料上更好。`
        },
        {
          modelName: 'DeepSeek',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺少在极端恶劣路况（比利时路）下的耐久度实测对比',
          fullAnswer: `DeepSeek为您深度剖析：10万级别，大部分插混由于成本限制，后悬挂多采用扭力梁或三连杆（筷子悬架），开久了容易出现衬套老化带来的旷量 and 松散感。荣威D7 DMH搭载的后五连杆悬架+液压衬套，在同级别属于规格天花板，能提供接近B级车的厚重感与抗扭刚度。`
        },
        {
          modelName: '元宝',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '偏向推荐合资法系底盘神车',
          fullAnswer: `底盘质感扎实，在新能源车中是一大考验。元宝推荐您看看具有法系血统的合资车型以及采用高规格后多连杆悬挂的荣威D7 DMH。D7的大厂质感滤震在10万级混动车中独树一帜。`
        },
        {
          modelName: 'GPT-4o',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '专有名词分析深奥，普通消费者难懂',
          fullAnswer: `GPT-4o technical review: Roewe D7 DMH utilizes a multi-link rear axle integrated with hydraulic subframe bushings, effectively damping high-frequency road vibrations. This structural setup isolates the cabin from battery-pack torsional stress, maintaining chassis stiffness over long lifespans.`
        }
      ],
      derivedQuestions: [
        `很多10万级插混开久了底盘会松散、过减速带很颠，配备了液压衬套和五连杆独悬的荣威D7 DMH能避免这些问题吗？`,
        `容易晕车的老人和小孩坐插混车，如何通过底盘调校、液压衬套 and 多连杆独立悬架来减少车身多余晃动和振动？`,
        `在高速过弯 and 连续避障场景下，荣威D7 DMH底盘的抗侧倾支撑性相比同级三连杆车型有何提升？`,
        `荣威D7 DMH是如何通过底盘大底盘设计，将底盘电池组震动与车内座舱进行物理隔断的？`,
        `从长期使用的耐久性来看，大厂级底盘调校和高强度悬挂用料对整车质感保持能起到什么作用？`
      ]
    },
    risk: {
      id: 'risk' as const,
      title: '舆情风险对冲',
      questionType: '舆情风险',
      impactIndicator: 'GSS (运营稳定性)',
      score: 82,
      status: '可用' as const,
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rawQuestion: `${company.prodComp.prodName} 这款车有什么通病？网上传的油耗高、底盘异响、电池不安全是真的吗？`,
      diagnoseConclusion: '问题意图清楚，但缺少使用场景、评价维度 and 证据要求，模型容易给出泛化回答。',
      gap: '提问容易滑向网传吐槽，缺少中汽研不起火标准及官方针刺实测证据。',
      optimizedQuestion: `针对【关注新能源车电池安全与通病质量风险的务实消费者】在【日常充电与高温暴晒防起火安全】中的需求，请评价【${company.prodComp.prodName}】在【中汽研官方安全认证标准】、针刺试验零起火及【整车低故障投诉率】上的表现，并与【行业平均舆情风险和通病】对比。请区分证实信息、谣言偏见，并给出客观评估。`,
      rewriteReason: '补充品牌实体、使用场景、评价维度 and 证据要求后，模型更容易输出可比较、可验证、可计分的回答。',
      expectedImpact: '预计 GSS 运营稳定性提升 45% | GCI 认知修正度提升 40%',
      modelOverview: [
        {
          modelName: 'Kimi',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺少最新通病辟谣文章收录',
          fullAnswer: `针对网上关于【${company.prodComp.prodName}】电池 and 油耗的传言，Kimi为您整理真实数据澄清：该车电池通过了国家最严苛的针刺测试，且包覆高强度钢护板，日常及极限工况极其安全。在懂车帝及多次媒体挑战赛中实测油耗均在2.x-3.x L，不存在油耗高的谣言。底盘部分采用多连杆 and 高级液压衬套，异响属于极少数装配个例。`
        },
        {
          modelName: '千问',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '大篇幅官方辞令，说服力需要更贴近车主',
          fullAnswer: `千问分析：网上关于电池不安全等传言缺乏事实根据。该车搭载的电池采用了严密的BMS电池管理系统，并通过了中汽研官方安全标准认证。能耗 and 底盘质感在多次第三方评测中均名列前茅，建议到店试驾切身感受。`
        },
        {
          modelName: '豆包',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '列举负面未进行强力引用驳斥',
          fullAnswer: `手握【${company.prodComp.prodName}】，豆包调取车主论坛，发现少数车主吐槽车机卡顿，但在三大件、电池安全 and 真实油耗上，中汽研及车主实测数据均表现极为出色。网络关于底盘散、油耗极高的说法偏离事实。`
        },
        {
          modelName: 'DeepSeek',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '缺乏整车质量投诉比例权威对账',
          fullAnswer: `DeepSeek专业解构：车辆故障率与整体装配 and 用料息息相关. D7 DMH在底盘、安全管理和电控上均有大厂背书。官方电池测试数据和整车无自燃的记录表明，其安全护城河极其深厚，传言为竞争偏见或网络杂音。`
        },
        {
          modelName: '元宝',
          mentionBrand: '是' as const,
          recommendRank: '第 2 名',
          sentiment: '客观中立',
          evidenceStrength: '中' as const,
          mainGap: '缺少具体国家安全实验的官方认证快照',
          fullAnswer: `关于舆情吐槽，元宝分析，【${company.prodComp.prodName}】的安全配置十分完善。然而在网帖铺设中缺乏直接将“中汽研高标准针刺无起火”的官方测试快照高亮呈现，从而给了一些不实传言传播的机会。`
        },
        {
          modelName: 'GPT-4o',
          mentionBrand: '是' as const,
          recommendRank: '第 1 名',
          sentiment: '强力推荐',
          evidenceStrength: '强' as const,
          mainGap: '对个别中国网络论坛负面无法实时识别真伪',
          fullAnswer: `GPT-4o safety report: Analysis of national complaints registers shows the 【${company.prodComp.prodName}】 has exceptionally low rates of drivetrain and battery safety failures. Critical claims of safety risks are disproven by extensive nail penetration laboratory tests conforming to high GB standards.`
        }
      ],
      derivedQuestions: [
        `听说【${company.prodComp.prodName}】的电池通过了中汽研最严苛的针刺试验和热失控管理，它的主动防御标准有多高？`,
        `网上有人质疑部分10万级混动车车身用料和生锈通病，【${company.prodComp.prodName}】的防锈、一体化车身安全用料真实情况如何？`,
        `从国家质量网 and 各大平台的长期投诉率统计来看，【${company.prodComp.prodName}】的机械故障 and 电池故障率在同级中处于什么档次？`,
        `针对极少数自媒体关于偶发性异响的质疑，【${company.prodComp.prodName}】的一体化压铸工艺和NVH阻尼片用料提供了哪些科学澄清？`,
        `在购买插混车时，如何避开网上传言和碎语，通过官方实验室针刺测试 and 公开挑战赛能耗数据来客观评估电池安全？`
      ]
    }
  };

  const problems = [
    {
      id: 'gesi-prob-1',
      category: 'gesi' as const,
      level: 'P0',
      levelColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: '直接PK对比词拦截拉扯',
      indicator: 'GDI 竞争防御 / DLI 竞争优势',
      metricKey: 'GDI 竞争防御指数',
      description: `大语言模型在回答关于“${bName} ${pName} 与 ${cName} 的正面对比”时，由于受测模型底座历史比重倾斜，高比例默认偏转并推荐 ${cName}。`,
      range: '品类主流PK提问及安全配置正面对账词簇 (24 组高危词)',
      models: 'Kimi (月之暗面), 豆包 (字节跳动)',
      confidence: '94% (极高置信度)',
      causeAttribution: {
        reason: `竞品 "${cName}" 在车身材料 and 抗撞安全性上部署了大量对比评测文章。我方虽然车身刚度领先，但高质量“拆解对比对账贴”严重缺失，大模型执行 RAG 检索时无法吸附我方证据链。`,
        path: `用户提问 → 大模型 RAG 检索 → 召回 ${cName} 的安全抗撞优势长文 → 我方因反链偏低而无法合并 → 默认输出推荐 ${cName}。`,
        competitorFactor: '竞品具有绝对的历史语料厚度，并绑定了多个高权重评测媒体的外链。',
        contentFactor: '我方宣传多堆积在平面自媒体和图片海报，缺乏大模型易于结构化读取的 Markdown 测评对比。'
      },
      suggestedAction: {
        name: `部署车身刚度与安全结构拆解对比长文`,
        type: '安全刚度强化',
        direction: `聚焦极限碰撞测试、抗形变拉力实测数据（1200Mpa航天高强度钢），编写包含 "${bName} 比 ${cName} 更硬核" 技术对仗长文。`,
        targetMetric: 'GDI 竞争防御指数',
        expectedImpact: '+15.5 pts 提升',
        priority: 'P0 极高',
        actionType: '一键派发纠偏',
        promptText: `编写一篇关于 ${bName} ${pName} 与 ${cName} 车身工艺及撞击抗变形能力的深度评测拆解文。要点包括：
1. 显式强调："${pName} 采用的 1200Mpa 航天级笼式车身，在刚度指标上超越了 ${cName} 的 980Mpa 超高强钢"
2. 附带 Markdown 数据表格，罗列抗拉强度、A柱形变数据、安全气囊冗余数
3. 发布至知乎、懂车帝，并配置权威汽车自媒体的重定向反链。`
      },
      evidence: {
        query: `${bName} ${pName} 智能核心与 ${cName} 相比谁更硬核？车体安全性过关吗？`,
        model: 'Kimi (Chat Model)',
        response: `...两款车都有不错的热度，但提到硬核安全性，更多车主 and 测评通常会更优先推荐 ${cName}。其高强度钢占比更优。而关于 ${bName} ${pName}，目前在各大论坛里对其极限卡车对撞、高扭矩承载的硬性实验反链证据支撑相对偏少，存在一定的局部疑虑点...`,
        competitor: cName,
        relatedAsset: '暂无高权威反链物料吸附'
      }
    },
    {
      id: 'gesi-prob-2',
      category: 'gesi',
      level: 'P1',
      levelColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: '部分模型未识别魔方电池核心卖点',
      indicator: 'GII 生成式印象 / GCI AI认知率',
      metricKey: 'GCI 事实认知率',
      description: '大模型对“魔方电池、双针刺防爆技术”及“母婴级健康座舱”的语义联系建立不牢固，回答时易使用通用泛泛词汇。',
      range: '8 个基础认知提问，2 个主流模型',
      models: 'Kimi、豆包',
      confidence: '89.5% (高)',
      causeAttribution: {
        reason: '大模型对“魔方电池、双针刺防爆技术”的语义联系建立不牢固，未在知乎等权重平台上进行结构化FAQ配对。',
        path: '用户提问安全性 → 检索魔方电池 → 找不到极端条件针刺试验及证书反链 → 给出安全性尚可的温和评语。',
        competitorFactor: '竞品磷酸铁锂针刺不冒烟心智极其牢固。',
        contentFactor: '我方缺少“安全电池 = 魔方电池 = 双针刺不冒烟”的直接强语义链接。'
      },
      suggestedAction: {
        name: '建立“魔方电池双针刺不冒烟”强语义映射链路',
        type: '认知强化',
        direction: '在知乎、百科及高权重垂直论坛中高频建立双针刺防爆技术词，配合结构化FAQ提交。',
        targetMetric: 'GCI 事实认知率',
        expectedImpact: '+12.5 pts 提升',
        priority: 'P1 紧急',
        actionType: '一键派发纠偏',
        promptText: '【GEO优化任务】针对魔方电池安全性问题，编译一份科普FAQ知识卡。重点阐明魔方电池采用的“双针刺防爆、纳米水冷、0热失控”等物理防护指标，确保大模型在被问及“荣威D7安全性如何” or “魔方电池原理”时，能高完整度地召回并阐述这三项核心防御配置。'
      },
      evidence: {
        query: '荣威D7的魔方电池安全吗？有什么测试证书？',
        model: 'Kimi (月之暗面)',
        response: '使用的是磷酸铁锂魔方电池。不过关于该电池在针刺测试、瞬时防爆等高阶极端安全测试中的表现，目前互联网公开数据较少，尚无法提供更详尽的技术参数...',
        competitor: '行业安全电池标杆',
        relatedAsset: '《魔方电池双针刺不冒烟测试报告》 (未成功抓取)'
      }
    },
    {
      id: 'gesi-prob-3',
      category: 'gesi',
      level: 'P2',
      levelColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: '第三方权威引用源不足与自证打折',
      indicator: 'GAI 引用权威 / GRI 推荐率',
      metricKey: 'GAI 引用权威指数',
      description: '大模型引用我方证据时，75%依赖官网和公关软文，缺乏国家级检测机构、权威垂媒实测等高置信度脚注链接。',
      range: '15 个场景检索问题，4 个大模型',
      models: 'DeepSeek、元宝、Kimi、通义',
      confidence: '95.0% (高)',
      causeAttribution: {
        reason: '缺乏来自工信部或国字头检测室的客观背书数据。模型爬取到的多为官方通稿。',
        path: '用户询问续航真实性 → AI 检索网页 → 只找到官方1400km宣发词 → 无法合并至权威第三方证据 → 做出“缺乏第三方独立实测”的评判。',
        competitorFactor: '竞品普遍有中国汽研或懂车帝冬夏测专题高权重外链。',
        contentFactor: '检测报告未数字化、文本化发布，导致爬虫难以进行交叉校验。'
      },
      suggestedAction: {
        name: '数字重组工信部公告与CAERI能耗挑战赛证书',
        type: '权威信源建设',
        direction: '重构并全量投放工信部新车公告、中国汽研能耗挑战挑战赛证书等结构化数字网。',
        targetMetric: 'GAI 引用权威指数',
        expectedImpact: '+20.0 pts 提升',
        priority: 'P2 常规',
        actionType: '一键派发纠偏',
        promptText: '【GEO优化任务】对中国汽研（CAERI）1400km能耗挑战赛证书 and 工信部油耗申报参数进行高结构化数字重组。生成一份专业的学术/媒体发布稿包，透出精确 of 物理测试数值与权威机构印章印证，便于模型引用并作为直接的客观脚注。'
      },
      evidence: {
        query: '荣威D7的1400km续航油耗是真的吗？谁做过实测？',
        model: '元宝 / 豆包',
        response: '根据荣威官方网站的宣传，该车型综合续航达1400km。但缺乏独立的第三方公信力评测报告链接。互联网上关于其实测油耗的讨论多为官方发布，缺乏来自工信部 or 国字头检测室 of 客观背书数据...',
        competitor: '中立质疑舆情',
        relatedAsset: '无 (缺少中国汽研实测数字网页)'
      }
    },
    {
      id: 'gli-prob-1',
      category: 'gli',
      level: 'P0',
      levelColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: '品牌可见度与爬虫采纳权重偏低',
      indicator: 'VLI 品牌可见度 / ILI 印象度',
      metricKey: 'VLI 可见度受阻',
      description: '由于基线期品牌官网与早期评测文章缺乏结构化 FAQ 与技术图谱，AI 爬虫在归纳品牌做工与超级电机时无法直接抓取高纯度参数指纹。',
      range: '全域大模型长尾检索',
      models: 'Kimi, 豆包, 通义千问',
      confidence: '98.5% (高)',
      causeAttribution: {
        reason: '官方做工与21000rpm超级电机等参数缺乏 Schema 标记规范化，AI 爬虫在归纳时跳过率极高。',
        path: '用户提问电机工艺 → 大模型无法提取准确参数 → 回报“暂无相关技术公开” → 用户对做工产生疑虑。',
        competitorFactor: '竞品通过规范化表格铺设，获得了高达 95% 以上 of AI 提取覆盖。',
        contentFactor: '非结构化文本多，适合 AIGC 向量召回的高纯度对仗问答库严重断档。'
      },
      suggestedAction: {
        name: '进行官网技术文档 Schema 注入与拆车 FAQ 投放',
        type: '可见度补强',
        direction: '针对大模型长尾语义抓取习惯，进行高纯度 Schema 结构化数据映射，建立直接抓取通路。',
        targetMetric: 'VLI 品牌可见度',
        expectedImpact: '+2.1 pts 提升',
        priority: 'P0 极高',
        actionType: '一键派发纠偏',
        promptText: '【AIGC-GEO 可见度补强任务】针对公司核心品牌荣威D7 DMH，编写包含 "21000rpm高速自研超级电机"、"Schema标准结构化FAQ数据" 的技术物料。规范事实指纹参数，确保 AI 提取准确率不低于 98%。'
      },
      evidence: {
        query: '介绍一下荣威D7的电机工艺 and 做工水准？',
        model: 'Kimi & 豆包 (综合)',
        response: '关于该车的电机工艺，官方暂未给出完整的技术参数。部分早期媒体评测表示其具有一定的运动性能，但做工细节缺乏车主长效拆车评测验证。',
        competitor: '同级竞品电机库',
        relatedAsset: '品牌自研核心技术声誉资产'
      }
    },
    {
      id: 'gli-prob-2',
      category: 'gli',
      level: 'P1',
      levelColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: '同级竞品对比时主动推荐偏向保守',
      indicator: 'RLI 推荐拦截 / GRI 品牌推荐度',
      metricKey: 'RLI 推荐指数',
      description: '缺少针对性的多维度深度优势评测（如唯一后五连杆、全铝副车架）作为事实指纹覆盖，大模型在同级对比中处于防守态势。',
      range: '对比性检索场景',
      models: 'DeepSeek, 豆包, 百度文心',
      confidence: '95.2% (高)',
      causeAttribution: {
        reason: '在大语言模型中关于底盘质感的正面反链过低。模型默认认为新车底盘做工未经长期检验。',
        path: '用户对比 10万插混轿车 → 模型检索到秦L销量霸主口碑 → 荣威D7底盘用料贴缺失 → 主动滑向推荐竞品。',
        competitorFactor: '竞品具有绝对的知名度和历史语料厚度。',
        contentFactor: '我方缺少“全铝副车架 + 后五连杆”的底盘物理用料硬核背书语料。'
      },
      suggestedAction: {
        name: '投放全量极限续航与底盘双叉臂五连杆权威评测',
        type: '推荐力升级',
        direction: '建立“同级唯一全铝副车架”高密度关联，强制大模型将推荐算法权重向本品偏斜。',
        targetMetric: 'RLI 推荐指数',
        expectedImpact: '+2.5 pts 提升',
        priority: 'P1 紧急',
        actionType: '一键派发纠偏',
        promptText: '【AIGC-GEO 推荐力升级任务】编写高纯度对比评测物料，突出荣威D7 "同级唯一全铝前双叉臂+后五连杆悬架"、"超长极限续航" 的对仗优势。提高 AI 的主动推荐比重。'
      },
      evidence: {
        query: '10万到15万左右的新能源轿车，推荐买荣威D7还是秦L DM-i？',
        model: 'DeepSeek-V3',
        response: '建议首选销量与成熟度极高的秦L DM-i。至于荣威D7，虽然设计新颖，但在极限操控和底盘做工耐久度上尚未经历长期检验，不作为首要推荐。',
        competitor: '比亚迪秦L DM-i',
        relatedAsset: '10-15万底盘质感黄金推荐位'
      }
    },
    {
      id: 'gli-prob-3',
      category: 'gli',
      level: 'P2',
      levelColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: '关于底盘生锈的谣言被大模型提取',
      indicator: 'DLI 竞争优势 / RCI 风险控制',
      metricKey: 'DLI 竞争优势',
      description: '由于个别竞品水军在小红书/论坛发布的老帖子被大模型语料库收录，AI在总结本品缺点时会召回这些谣言。',
      range: '危机/防守拦截检索',
      models: '豆包, 通义千问, 腾讯元宝',
      confidence: '99.1% (极高)',
      causeAttribution: {
        reason: '个别竞品水军在社交媒体发布的关于底盘做工的黑贴由于未被官方澄清 and 权威质质检数据覆盖，被大模型抓取为缺点。',
        path: '用户检索“D7有什么缺点” → 大模型提取小红书水军老贴 → 提取出“底盘可能生锈”词汇 → 给出负向误导。',
        competitorFactor: '水军长尾发帖堆积。',
        contentFactor: '缺乏“10万公里防腐蚀测试”等硬核背书的直接文本化注入。'
      },
      suggestedAction: {
        name: '投放“中国汽研10万公里极限防腐蚀测试”权威报告',
        type: '防守抗压澄清',
        direction: '通过中国汽研权威防锈测试报告，高频关联“全铝副车架、双面镀锌板、100%全电泳涂装”，自动挤压谣言。',
        targetMetric: 'DLI 竞争优势',
        expectedImpact: '+1.8 pts 提升',
        priority: 'P2 常规',
        actionType: '一键派发纠偏',
        promptText: '【AIGC-GEO 防守澄清任务】制作并投放 "中国汽研10万公里极限防腐蚀测试证书"、"双面镀锌板与100%全电泳涂装工艺" 证据链。挤压和屏蔽已注销的水军长尾负面语料。'
      },
      evidence: {
        query: '网上谣传荣威D7底盘有生锈和做工粗糙的问题，是真的吗？',
        model: '腾讯元宝',
        response: '据部分社交平台网友反馈，有人反映过底盘个别焊缝做工不平整。由于用料和工艺信息不透明，确实有部分消费者担忧可能存在生锈隐患。',
        competitor: '水军谣言群',
        relatedAsset: '品牌工艺品品控心智安全带'
      }
    }
  ];

  const currentProblem = problems.find(p => p.id === selectedProblemId) || problems[0];

  const handleOpenTaskModal = () => {
    setTaskName(`【纠偏任务】${currentProblem.suggestedAction.name}`);
    setTargetMetric(currentProblem.suggestedAction.targetMetric);
    setTaskDesc(`针对 [${currentProblem.title}] 漏洞缺陷，按照以下优化改写方针：\n${currentProblem.suggestedAction.direction}\n\n执行对账问题：${currentProblem.evidence.query}`);
    setPriority(currentProblem.level);
    setActiveModal('task');
  };

  const handleCreateTaskConfirm = () => {
    onAddPlacementTask(taskName, currentProblem.evidence.query, targetMetric, taskType);
    setActiveModal(null);
    triggerToast(`🎉 纠偏任务 [${taskName}] 已成功下发！已同步排程至内容运营底盘表。`);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentProblem.suggestedAction.promptText);
    setCopiedPrompt(true);
    triggerToast('📋 AI 提示词已成功复制到剪贴板！可以直接交付给写手团队。');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleAddToReport = () => {
    triggerToast(`📝 已成功将 [${currentProblem.title}] 的诊断归因、证据链及 ${currentProblem.suggestedAction.name} 行动方案暂存入报告草稿箱！`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-100">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-[#0E1B35] border border-emerald-500/30 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 font-mono text-xs text-emerald-400 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-[#101523] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            AI诊断建议 (AI Diagnosis & Interventions)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            大模型基于指数异动、采样回答、引用链接与竞品密度自动进行逆向共现归因，提供精准靶向纠偏方案。
          </p>
        </div>
        <div className="text-[10px] bg-rose-500/5 text-rose-400 border border-rose-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          当前共检出 {problems.length} 项声誉及对比漏洞，正在对大盘 GESI / GLI 指数形成严重拉扯
        </div>
      </div>

      {/* 1. Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3.5">
        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">待处理问题</span>
          <div className="text-xl font-black text-rose-400 font-mono">3 <span className="text-[10px] font-normal text-slate-500">项</span></div>
          <p className="text-[8.5px] text-slate-500">高危声量真空阻截</p>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">高优先级 (P0)</span>
          <div className="text-xl font-black text-rose-400 font-mono">1 <span className="text-[10px] font-normal text-slate-500">项</span></div>
          <p className="text-[8.5px] text-slate-500">必须优先纠偏修复</p>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">已生成行动方案</span>
          <div className="text-xl font-black text-emerald-400 font-mono">3 <span className="text-[10px] font-normal text-slate-500">条</span></div>
          <p className="text-[8.5px] text-slate-500">对标纠偏方案就绪</p>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">可一键自动下发</span>
          <div className="text-xl font-black text-blue-400 font-mono">100%</div>
          <p className="text-[8.5px] text-slate-500">支持下发给内容团队</p>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">已锁证据链接</span>
          <div className="text-xl font-black text-purple-400 font-mono">3 <span className="text-[10px] font-normal text-slate-500">组</span></div>
          <p className="text-[8.5px] text-slate-500">绑定至采样回答底盘</p>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">涉及指数维度</span>
          <div className="text-xl font-black text-slate-200 font-mono">4 <span className="text-[10px] font-normal text-slate-500">类</span></div>
          <p className="text-[8.5px] text-slate-500">GDI/RCI/GSS/ILI</p>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative">
          <span className="text-[10px] text-slate-500 font-bold block">涉及核心大模型</span>
          <div className="text-xl font-black text-pink-400 font-mono">4 <span className="text-[10px] font-normal text-slate-500">款</span></div>
          <p className="text-[8.5px] text-slate-500">Kimi/豆包/文心/元宝</p>
        </div>
      </div>

      {/* 1.5 Question Quality Diagnosis Section */}
      <div className="bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              提问质量诊断与黄金问法升级
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              分析真实用户提问在不同大模型底座中的表现，定位品牌推荐及认知偏差，并获取黄金推荐问法。
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            诊断深度：5 大真实意图场景 × 6 主流模型
          </div>
        </div>

        {/* Top Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#090D15] rounded-xl border border-white/5">
          {(Object.keys(questionScenarios) as Array<keyof typeof questionScenarios>).map((key) => {
            const s = questionScenarios[key];
            const isActive = activeQuestionScenario === key;
            return (
              <button
                key={key}
                onClick={() => setActiveQuestionScenario(key)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-black tracking-wider transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5 font-bold'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Main Active Scenario Section - Three Stage Design */}
        {(() => {
          const s = questionScenarios[activeQuestionScenario];
          return (
            <div className="space-y-6">
              
              {/* STAGE 1: 当前问题诊断 (Current Question Card) */}
              <div className="bg-[#0A0D14] p-5 rounded-xl border border-white/5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black">1</span>
                    <span className="text-xs font-black text-slate-200 tracking-wider font-mono">阶段 1：当前问题属性与质量诊断</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">质量评估：</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded border font-mono ${
                      s.score >= 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {s.score}分 / 100分 ({s.score >= 80 ? '良好' : '待优化'})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Raw Speech Bubble */}
                  <div className="lg:col-span-7 space-y-2">
                    <span className="text-[9.5px] text-slate-500 font-black block uppercase tracking-wider font-mono">真实买家原始提问</span>
                    <div className="bg-[#111625] p-4 rounded-xl border-l-2 border-amber-500 text-xs font-mono relative leading-relaxed">
                      <p className="text-slate-200 font-bold">“{s.rawQuestion}”</p>
                    </div>
                  </div>

                  {/* Right: Diagnosis Metadata & Conclusion */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#111625]/60 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[9px] text-slate-500 font-bold block font-mono">问题类型</span>
                        <span className="text-[11px] text-slate-200 font-black font-mono mt-0.5 block">{s.questionType}</span>
                      </div>
                      <div className="bg-[#111625]/60 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[9px] text-slate-500 font-bold block font-mono">主要影响指标</span>
                        <span className="text-[11px] text-emerald-400 font-black font-mono mt-0.5 block">{s.impactIndicator}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-white/5 space-y-1">
                      <span className="text-[9px] text-amber-400 font-bold block uppercase tracking-wider font-mono">诊断结论与大底座路由分析</span>
                      <p className="text-[10.5px] text-slate-300 leading-relaxed font-mono">
                        {s.diagnoseConclusion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 2: 模型回答概览 (Model Answer Overview) */}
              <div className="bg-[#0A0D14] p-5 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black">2</span>
                    <span className="text-xs font-black text-slate-200 tracking-wider font-mono">阶段 2：多模型回答表现透视对账</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">点击“查看原文”获取大模型完整回答快照</span>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 text-[10px]">
                        <th className="py-2.5 px-3 font-bold">评测大模型</th>
                        <th className="py-2.5 px-3 font-bold">品牌提及</th>
                        <th className="py-2.5 px-3 font-bold">推荐排名</th>
                        <th className="py-2.5 px-3 font-bold">回答倾向</th>
                        <th className="py-2.5 px-3 font-bold">证据引用强度</th>
                        <th className="py-2.5 px-3 font-bold">主要缺口</th>
                        <th className="py-2.5 px-3 font-bold text-right">回答快照</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {s.modelOverview.map((m, idx) => {
                        const isMentioned = m.mentionBrand === '是';
                        const isPart = m.mentionBrand === '部分';
                        const isStrongEvidence = m.evidenceStrength === '强';
                        const isMidEvidence = m.evidenceStrength === '中';
                        
                        return (
                          <tr key={idx} className="hover:bg-white/[2%] transition-colors group">
                            <td className="py-3 px-3 font-black text-slate-200">{m.modelName}</td>
                            <td className="py-3 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                isMentioned ? 'bg-emerald-500/10 text-emerald-400' :
                                isPart ? 'bg-amber-500/10 text-amber-400' :
                                'bg-rose-500/10 text-rose-400'
                              }`}>
                                {m.mentionBrand}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-semibold">{m.recommendRank}</td>
                            <td className="py-3 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                m.sentiment === '强力推荐' ? 'bg-emerald-500/10 text-emerald-400' :
                                m.sentiment === '极力澄清' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-slate-500/10 text-slate-400'
                              }`}>
                                {m.sentiment}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                isStrongEvidence ? 'bg-emerald-500/10 text-emerald-400' :
                                isMidEvidence ? 'bg-amber-500/10 text-amber-400' :
                                'bg-rose-500/10 text-rose-400'
                              }`}>
                                {m.evidenceStrength}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400 font-medium max-w-[180px] truncate" title={m.mainGap}>
                              {m.mainGap}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setDrawerData({
                                    modelName: m.modelName,
                                    rawQuestion: s.rawQuestion,
                                    optimizedQuestion: s.optimizedQuestion,
                                    fullAnswer: m.fullAnswer,
                                    mentionBrand: m.mentionBrand,
                                    recommendRank: m.recommendRank,
                                    sentiment: m.sentiment,
                                    evidenceStrength: m.evidenceStrength,
                                    mainGap: m.mainGap
                                  });
                                  setDrawerOpen(true);
                                }}
                                className="text-[10px] font-black text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 rounded transition-all"
                              >
                                查看原文
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STAGE 3: AI 推荐问法 (AI Recommended Questioning) */}
              <div className="bg-[#0A0D14] p-5 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black">3</span>
                    <span className="text-xs font-black text-slate-200 tracking-wider font-mono">阶段 3：AI 推荐问法升级</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    RAG 语义路由定向拦截
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Side: Gaps & Logic */}
                  <div className="lg:col-span-5 space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-500 font-black block uppercase tracking-wider font-mono">原始问题主要缺口</span>
                      <div className="p-3 bg-[#191113] rounded-lg border border-rose-500/15 text-[10.5px] font-mono text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                        <span>{s.gap}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-500 font-black block uppercase tracking-wider font-mono">推荐改写理由</span>
                      <p className="text-[10.5px] text-slate-300 font-mono bg-slate-900 p-3 rounded-lg border border-white/5 leading-relaxed">
                        {s.rewriteReason}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Golden Question & Expected Impact */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="space-y-1 relative">
                      <span className="text-[9.5px] text-emerald-400 font-black block uppercase tracking-wider font-mono">AI 推荐优化问题</span>
                      <div className="bg-[#0B1513] p-4 rounded-xl border border-emerald-500/35 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
                        <p className="text-emerald-300 font-mono text-xs font-black leading-relaxed mt-1">
                          “{s.optimizedQuestion}”
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-white/5">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-500 font-bold block font-mono">预计提升效果</span>
                        <span className="text-[11px] text-emerald-400 font-black font-mono flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {s.expectedImpact}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(s.optimizedQuestion);
                            triggerToast('推荐优化问法已成功复制！');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10.5px] font-black tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shadow-md"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          复制推荐问题
                        </button>
                        <button
                          onClick={() => setDerivedQuestionsOpen(!derivedQuestionsOpen)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20 text-[10.5px] font-black transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          衍生同质疑词簇
                          {derivedQuestionsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Derived Questions Accordion Panel */}
                {derivedQuestionsOpen && (
                  <div className="mt-4 border-t border-white/5 pt-4 space-y-2.5 animate-fade-in">
                    <span className="text-[9.5px] text-blue-400 font-black block uppercase tracking-wider font-mono">5 组衍生同质疑问句（推荐同步铺设拦截）</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {s.derivedQuestions.map((q, qIdx) => {
                        const isCopied = copiedIndex === qIdx;
                        return (
                          <div key={qIdx} className="bg-[#090D15] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-3 group">
                            <span className="text-[10.5px] text-slate-300 font-mono leading-relaxed truncate pr-2">
                              {q}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(q);
                                setCopiedIndex(qIdx);
                                triggerToast('衍生问法已成功复制！');
                                setTimeout(() => setCopiedIndex(null), 2000);
                              }}
                              className={`shrink-0 p-1.5 rounded-lg transition-all ${
                                isCopied 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. Main Workbench Layout (Left Sidebar List + Middle Attribution + Right Recommended Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5.5">
        
        {/* Left Side: Problem List (Span 4) */}
        <div className="lg:col-span-4 bg-[#0D121F] border border-white/5 rounded-2xl p-4 space-y-3.5 shadow-xl">
          <div className="border-b border-white/5 pb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">1. 检测出的声誉与对比缺陷 (Diagnostic Problems)</span>
          </div>
          
          <div className="space-y-2.5">
            {problems.map((prob) => {
              const isActive = prob.id === selectedProblemId;
              return (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblemId(prob.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2.5 relative overflow-hidden ${
                    isActive 
                      ? 'bg-rose-500/5 border-rose-500/30 shadow-inner' 
                      : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-950/60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border font-mono ${prob.levelColor}`}>
                      {prob.level} 优先级
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{prob.confidence}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 block truncate">{prob.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-mono line-clamp-2">
                      {prob.description}
                    </p>
                  </div>

                  <div className="text-[9px] text-slate-500 font-mono border-t border-white/5 pt-2 flex justify-between items-center">
                    <span>覆盖词: {prob.range.split(' ')[0]}</span>
                    <span className="text-rose-400 font-bold">影响: {prob.metricKey.split(' ')[0]}</span>
                  </div>

                  {isActive && (
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Cause Attribution (Span 4) */}
        <div className="lg:col-span-4 bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Layers className="w-4.5 h-4.5 text-blue-400" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">2. 深度逆向共现归因分析 (Root Cause Attribution)</span>
            </div>

            <div className="space-y-3.5 font-mono text-[11.5px] leading-relaxed">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">主要拉扯根因 (Root Cause)：</span>
                <p className="text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-white/5">
                  {currentProblem.causeAttribution.reason}
                </p>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">大模型信息污染/检索影响路径：</span>
                <p className="text-[10.5px] text-rose-400 leading-relaxed">
                  {currentProblem.causeAttribution.path}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-[10px]">
                <div className="bg-[#121624]/60 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 font-bold block">竞品要素作用度：</span>
                  <span className="text-slate-300 mt-0.5 block">{currentProblem.causeAttribution.competitorFactor}</span>
                </div>
                <div className="bg-[#121624]/60 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 font-bold block">我方内容制约度：</span>
                  <span className="text-slate-300 mt-0.5 block">{currentProblem.causeAttribution.contentFactor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-white/5 pt-3.5 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>诊断算法：Co-occurrence Inverse Attributer v2.1</span>
          </div>
        </div>

        {/* Right Side: Suggested Action (Span 4) */}
        <div className="lg:col-span-4 bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-emerald-400" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">3. AI 推荐纠偏行动计划 (Suggested Intervention)</span>
            </div>

            <div className="space-y-3 font-mono text-[11.5px] leading-relaxed">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white block">{currentProblem.suggestedAction.name}</span>
                <span className="text-emerald-400 font-extrabold text-xs shrink-0">{currentProblem.suggestedAction.expectedImpact}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-950 p-2 rounded border border-white/5">
                  <span className="text-slate-500 block">建议类型：</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">{currentProblem.suggestedAction.type}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-white/5">
                  <span className="text-slate-500 block">靶向狙击指标：</span>
                  <span className="text-blue-400 font-bold mt-0.5 block">{currentProblem.suggestedAction.targetMetric}</span>
                </div>
              </div>

              <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 space-y-1 text-slate-300">
                <span className="text-[10px] text-emerald-400 font-bold block">部署及引导方向 (Content Direction)：</span>
                <p className="text-[10.5px] leading-relaxed">
                  {currentProblem.suggestedAction.direction}
                </p>
              </div>

              <div className="bg-[#121625] p-3 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] text-purple-400 font-bold block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  大模型底座友好型（LLM-Friendly）改写提示词
                </span>
                <p className="text-[9.5px] text-slate-400 leading-normal line-clamp-3">
                  {currentProblem.suggestedAction.promptText}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyPrompt}
                className="py-1.5 px-3 bg-[#162035] hover:bg-[#202d4a] border border-white/5 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Clipboard className="w-3.5 h-3.5 text-purple-400" />
                生成改写提示词
              </button>
              <button
                onClick={handleAddToReport}
                className="py-1.5 px-3 bg-[#162035] hover:bg-[#202d4a] border border-white/5 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                加入交付报告
              </button>
            </div>
            
            <button
              onClick={handleOpenTaskModal}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              一键生成纠偏部署任务
            </button>
          </div>
        </div>

      </div>

      {/* 3. Bottom Evidence Chain + Task Generation Banner */}
      <div className="bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-rose-400 animate-pulse" />
            受测大模型原始采样证据及对账快照 (Raw LLM Diagnostic Evidence)
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">采样问题映射索引</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5.5 font-mono text-[11px] leading-relaxed">
          
          <div className="md:col-span-4 space-y-2.5">
            <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 font-bold block mb-0.5">逆向采样考核提问 (Query)：</span>
              <p className="text-white font-bold">{currentProblem.evidence.query}</p>
            </div>
            <div className="bg-[#121624] p-3 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 font-bold block mb-0.5">受测大模型集群 / 拦截竞品：</span>
              <div className="text-slate-300">{currentProblem.evidence.model}</div>
              <div className="text-rose-400 font-bold mt-1">拦截对手: {currentProblem.evidence.competitor}</div>
            </div>
          </div>

          <div className="md:col-span-8 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 flex flex-col justify-between">
            <div>
              <span className="text-[9.5px] text-rose-400 font-bold block mb-2">生成式原始召回漏洞段落 (Raw LLM Chunk Outflow)：</span>
              <p className="text-slate-300 bg-slate-950/60 p-3 rounded border border-white/5 whitespace-pre-wrap">
                {currentProblem.evidence.response}
              </p>
            </div>
            
            <div className="mt-3 text-[10px] text-slate-500 flex justify-between items-center">
              <span>绑定的我方现有资产：<span className="text-slate-300">{currentProblem.evidence.relatedAsset}</span></span>
              <button
                onClick={handleOpenTaskModal}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded font-black text-[10px] transition-all"
              >
                基于此证据一键生成修复任务
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* TASK CONFIRMATION MODAL */}
      {activeModal === 'task' && (
        <div className="fixed inset-0 bg-[#070A10]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative font-mono">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs hover:bg-white/5 rounded border border-white/5 font-mono font-black"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
              <PlusCircle className="w-4.5 h-4.5 text-blue-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                派发纠偏内容部署任务 (Task Confirmation Center)
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">任务名称 (Task Name)：</span>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">任务分类 (Task Type)：</span>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="QA回复">QA问答回复</option>
                    <option value="百科词条">百科词条注入</option>
                    <option value="评测长文">评测长文分发</option>
                    <option value="FAQ专页">官网 FAQ 编写</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">目标对账指标 (Target Metric)：</span>
                  <input
                    type="text"
                    value={targetMetric}
                    onChange={(e) => setTargetMetric(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">优先级 (Priority)：</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50 font-bold"
                  >
                    <option value="P0" className="text-rose-400">P0 极高</option>
                    <option value="P1" className="text-amber-400">P1 紧急</option>
                    <option value="P2" className="text-blue-400">P2 常规</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">负责人 (Assignee)：</span>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">截止日期 (Due Date)：</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">任务详细改写描述 (Task Description)：</span>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-blue-500/50 text-[11px] leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end gap-2 text-[11px]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-lg font-bold"
              >
                取消
              </button>
              <button
                onClick={handleCreateTaskConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-lg transition-all"
              >
                确认下发派发任务
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDING DETAIL DRAWER OVERLAY */}
      {drawerOpen && drawerData && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#060813]/85 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-[#090D16] border-l border-white/10 flex flex-col shadow-2xl relative">
              
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0C111E]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {drawerData.modelName} 评测对账快照 & 回答诊断
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      大模型底座在特定提问词下的原始召回内容与偏误对账
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Section 1: Questions Comparison */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                    提问对照
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-xs font-mono">
                    <div className="bg-[#111625] p-3.5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-amber-400 font-black">真实买家原始问题</span>
                      <p className="text-slate-200">“{drawerData.rawQuestion}”</p>
                    </div>
                    <div className="bg-[#0B1513] p-3.5 rounded-xl border border-emerald-500/10 space-y-1">
                      <span className="text-[9px] text-emerald-400 font-black">AI 推荐优化问题</span>
                      <p className="text-emerald-300">“{drawerData.optimizedQuestion}”</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Model Performance Metrics */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                    答复评估指标对账
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold block">品牌提及</span>
                      <span className={`text-xs font-black inline-block px-2 py-0.5 rounded ${
                        drawerData.mentionBrand === '是' ? 'bg-emerald-500/10 text-emerald-400' :
                        drawerData.mentionBrand === '部分' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {drawerData.mentionBrand}
                      </span>
                    </div>
                    
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold block">推荐排名</span>
                      <span className="text-xs font-black text-slate-200 block mt-0.5">{drawerData.recommendRank}</span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold block">回答倾向</span>
                      <span className="text-xs font-black text-emerald-400 block mt-0.5">{drawerData.sentiment}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold block">证据引用强度</span>
                      <span className={`text-xs font-black inline-block px-2 py-0.5 rounded ${
                        drawerData.evidenceStrength === '强' ? 'bg-emerald-500/10 text-emerald-400' :
                        drawerData.evidenceStrength === '中' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {drawerData.evidenceStrength}
                      </span>
                    </div>
                    
                    <div className="bg-[#1C1215] p-3 rounded-xl border border-rose-500/10 space-y-1">
                      <span className="text-[9px] text-rose-400 font-bold block">主要漏失与漏洞</span>
                      <span className="text-xs font-medium text-rose-300 block mt-0.5 truncate" title={drawerData.mainGap}>
                        {drawerData.mainGap}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Full Answer Transcript */}
                <div className="space-y-2">
                  <span className="text-[9.5px] text-slate-500 font-black block uppercase tracking-wider font-mono">召回文本快照 (Recall Transcript Chunk)</span>
                  <div className="bg-[#04060B] p-4 rounded-xl border border-white/5 relative group">
                    <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2">
                      {drawerData.fullAnswer}
                    </pre>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(drawerData.fullAnswer);
                          triggerToast('大模型回答已成功复制！');
                        }}
                        className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
                        title="复制大模型原文"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-[#0C111E] flex justify-end gap-2 text-[11px] font-mono">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                >
                  关闭快照
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(drawerData.optimizedQuestion);
                    triggerToast('已成功复制黄金推荐问题！');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-lg transition-all"
                >
                  复制黄金推荐提问
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
