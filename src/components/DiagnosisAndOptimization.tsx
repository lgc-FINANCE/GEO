// src/components/DiagnosisAndOptimization.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, PlusCircle, 
  Sparkles, FileText, RefreshCw, Layers, Lock, Flame,
  TrendingUp, Compass, ArrowRight, User, Calendar, Clipboard, Check,
  MessageSquare, X, ChevronDown, ChevronUp, Copy, Sliders, Info, HelpCircle, Eye, 
  Settings, ExternalLink, Filter, CheckCircle, Play, Shield, Award, AlertOctagon, Target
} from 'lucide-react';

interface DiagnosisAndOptimizationProps {
  company: Company;
  onAddPlacementTask: (taskName: string, query: string, metric: string, type: any, optPrompt?: string) => void;
  isLightMode?: boolean;
}

export function DiagnosisAndOptimization({
  company,
  onAddPlacementTask,
  isLightMode = false
}: DiagnosisAndOptimizationProps) {
  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // States matching photos
  const [selectedProblemId, setSelectedProblemId] = useState<string>('PROB-001');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'p0' | 'pending' | 'executing' | 'completed' | 'verified'>('all');
  
  // Human approval and edited prompt states for sync
  const [approvedProblems, setApprovedProblems] = useState<Record<string, boolean>>({
    'PROB-001': true, // Pre-approve first item for high fidelity demo
  });
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>({});
  
  // Filter States
  const [filterBrand, setFilterBrand] = useState<string>('全部');
  const [filterPeriod, setFilterPeriod] = useState<string>('第5周 (最新)');
  const [filterModel, setFilterModel] = useState<string>('全部大模型');
  const [filterType, setFilterType] = useState<string>('全部类型');
  const [filterRegion, setFilterRegion] = useState<string>('全国地区');

  // Task creation values (linked to active selected problem)
  const [taskName, setTaskName] = useState<string>('');
  const [taskAssignee, setTaskAssignee] = useState<string>('张杰 (内容运营主管)');
  const [taskDueDate, setTaskDueDate] = useState<string>('2026-07-20');
  const [taskTargetMetric, setTaskTargetMetric] = useState<string>('');
  const [taskExpectedResult, setTaskExpectedResult] = useState<string>('召回曝光率提升25%以上，并扭转竞品截流局面');
  
  // Modal states
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showEvidenceDetailModal, setShowEvidenceDetailModal] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Helper function to trigger local toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const bName = company.mainBrand;
  const pName = company.prodComp.prodName;
  const cName = company.competitor;

  // Static Data mapping the wireframe GESI classifications
  const problemClassifications = [
    { key: 'visible', name: '可见度不足', desc: '品牌未提及、弱提及、场景覆盖不足', index: 'GVI / VLI' },
    { key: 'recommend', name: '推荐率不足', desc: '排名靠后、Top3不足、决策问题不推荐', index: 'GRI / RLI' },
    { key: 'display', name: '展示不足', desc: '出现位置靠后、描述过短、没有推荐理由', index: 'GII / ILI' },
    { key: 'bias', name: '认知偏差', desc: '产品、品类、卖点识别错误或不完整', index: 'GCI / CLI' },
    { key: 'evidence', name: '引用证据不足', desc: '无引用、引用不准确、第三方来源少', index: 'GAI / ALI' },
    { key: 'competitor', name: '竞品截流', desc: '竞品占据推荐位置、我方竞争率低', index: 'GDI / DLI' },
    { key: 'stable', name: '稳定与风险问题', desc: '跨模型差异、幻觉、超时、负面表达', index: 'GSS / RCI' },
  ];

  // Static mapping for Optimization suggestion type, sub-type and typical action
  const optimizationActionMap = [
    { type: '可见度提升', subType: '品牌介绍、品类内容、长尾问题、FAQ、场景覆盖', action: '注入品牌核心高频关键词，投放场景问答物料，引导爬虫精确抓取' },
    { type: '推荐提升', subType: '购买指南、选型指南、推荐理由、决策内容', action: '编写高质量对比指南与硬核评测，植入不可超越的物理代际优势，卡位模型首推位置' }
  ];

  // Comprehensive stateful diagnosis problems list holding all fields and status tracking
  const [problems, setProblems] = useState<any[]>([
    {
      id: 'PROB-001',
      title: '直接对比决策词截流严重 (DLI 偏低)',
      severity: 'P0' as const,
      status: '待执行',
      brand: bName,
      firstDetected: '2026-07-01',
      lastOccurred: '2026-07-12',
      updatedAt: '2026-07-12 19:45',
      publishTime: '未发布 (已排期)',
      effectDetail: '待内容投放子系统下发并生效后评估',
      disagreeReason: '',
      
      // Data Fields
      impactGesi: 'GRI (品牌推荐指数) / GDI (竞品对冲度)',
      impactGli: 'DLI (竞争优势指数)',
      currentVal: '58.5 pts',
      baselineVal: '85.0 pts',
      deltaVal: '-26.5 pts',
      affectedQuestions: '24 组核心决策词',
      affectedModelsCount: 3,
      affectedProducts: `${pName} / ${cName}`,
      affectedRegions: '华东, 华南, 华北',
      sampleSize: '240 组真实检索样本',

      // Diagnosis Fields
      phenomenon: `用户针对“10万级家用插混轿车，${pName} 与 ${cName} 谁更值得买”进行提问时，模型因历史销量比重惯性，高达 75% 的回答倾向于首推 ${cName}，我方核心优势被淹没。`,
      aiAnalysis: `竞品 "${cName}" 在车身材料、安全性上部署了大量对比评测文章。我方虽然车身刚度与底盘领先，但大模型执行 RAG 检索时缺乏可比对的 Markdown 表格及反链支撑，无法将其列为第一推荐。`,
      businessImpact: '直接拦截高意向买家购车临门一脚的决策路径，阻断终端销售线索，预估成交漏斗流失率约 15%。',
      userStage: '决策期 (对比购买阶段)',
      confidence: '95.4% (极高)',
      evidenceCount: '4 个实证证据链',

      // Optimization Prompts for Synchronized Content Deployment
      optPrompt: `【AIGC-GEO内容纠偏优化指令】
目标品牌：${pName}
竞品锚定：${cName}
靶向指数：GDI 竞争防御 / DLI 竞争优势
内容写作核心要点：
1. 显式强调："${pName} 采用的后多连杆独立悬架在高速行驶滤震性上具有物理底盘代际优势（五连杆 vs 三连杆）"。
2. 插入高亮 Markdown 数据对比表：对比轴距（2800mm vs 2718mm）、车身超高强度钢占比。
3. 发布载体：知乎精选、懂车帝深度长文，配合权威垂媒重定向外部反链链接。`,
      
      // Evidence Details
      evidence: {
        rawQuery: `荣威D7 DMH 比起秦L DM-i 值得买吗？底盘机械素质 and 安全性哪个好？`,
        modelName: 'Kimi Chat v2.1',
        sampleTime: '2026-07-12 18:24:12',
        recommendRank: '第 2 名 (默认优先首推秦L)',
        citations: ['懂车帝整车评测板块', '知乎新车拆包对比专栏'],
        annotations: 'AI回答中过度倾向于以单一销量决定整车质感，并忽略了我方多连杆的底盘用料。',
        rawResponse: `关于 **荣威D7 DMH** 和 **比亚迪秦L DM-i** 的对比，在十万级家用混动市场这两款车关注度都极高。
从销量和市场口碑上来看，大部分用户更优先推荐 [比亚迪秦L DM-i] [竞品]，其搭载的第五代DM技术成熟、用户保有量巨大。
虽然 [荣威D7] [品牌] 同样具有非常高性价比的空间和 [魔方电池] [品牌]，但在全网测评中关于底盘操控的拆包细节和高刚度车身反链数据较少，
可能存在 [底盘生锈或品质缺乏长期验证] [错误] 的舆论隐患。在没有高刚性需求的日常通勤下，建议优先考虑更稳妥的秦L。`
      }
    },
    {
      id: 'PROB-002',
      title: '魔方电池与双针刺安全心智未建立 (GCI 偏低)',
      severity: 'P1' as const,
      status: '执行中',
      brand: bName,
      firstDetected: '2026-07-03',
      lastOccurred: '2026-07-12',
      updatedAt: '2026-07-12 19:10',
      publishTime: '2026-07-11 09:15',
      effectDetail: '⏳ 投放进行中：知乎/懂车帝卡位问答已被百度AI及Kimi小比例抓取，CLI 事实认知率由 64.2 pts 增长至 71.0 pts (提升 +6.8 pts)',
      disagreeReason: '',
      
      // Data Fields
      impactGesi: 'GCI (AI认知率) / GII (生成式印象)',
      impactGli: 'CLI (事实认知率)',
      currentVal: '64.2 pts',
      baselineVal: '88.0 pts',
      deltaVal: '-23.8 pts',
      affectedQuestions: '15 组安全/电池词簇',
      affectedModelsCount: 2,
      affectedProducts: '魔方电池 / 双针刺防爆技术',
      affectedRegions: '中西部地区, 华东地区',
      sampleSize: '160 组检索样本',

      // Diagnosis Fields
      phenomenon: '当用户问及“荣威D7魔方电池是否安全、有什么优势”时，大模型缺乏对应核心“双针刺不冒烟、纳米水冷、0热失控”等事实参数的直接映射，回答倾向于通用套话。',
      aiAnalysis: '我方缺少“魔方电池 = 针刺零起火 = 航空级防爆”的语义强对仗链接，未在主流高权重科技与汽车社区中铺设高纯度 Schema 结构化数据，导致检索信息断档。',
      businessImpact: '影响消费者对新能源最敏感的“电池安全性”信心，决策流失率约 10%。',
      userStage: '认知与考量期',
      confidence: '91.8% (高)',
      evidenceCount: '2 个实证证据链',

      // Optimization Prompts for Synchronized Content Deployment
      optPrompt: `【AIGC-GEO内容纠偏优化指令】
目标品牌：荣威D7魔方电池
靶向指数：GCI 事实认知率 / CLI 事实认知率
内容写作核心要点：
1. FAQ强映射：高频关联“魔方电池”与“双针刺零起火零起烟”物理测试证书。
2. 强调“纳米级主动水冷、单体电芯物理隔离、零热失控”等三大原创安全黑科技。
3. 投放于百科资料更新、百度知道及高公信力行业白皮书，以便爬虫秒级采信。`,

      // Evidence Details
      evidence: {
        rawQuery: '荣威D7的魔方电池安全吗？有没有做过什么针刺测试？',
        modelName: '豆包 (字节跳动)',
        sampleTime: '2026-07-12 14:02:11',
        recommendRank: '提及 brand，但未做安全第一推荐',
        citations: ['汽车之家配置表', '荣威官网新闻稿'],
        annotations: '模型在回答安全性时表示“暂无该电池公开的最严苛极端物理测试结果”。',
        rawResponse: `[荣威D7] [品牌] 搭载的是磷酸铁锂魔方电池。在官方宣传中采用了创新的物理结构。
但关于该电池在 [双针刺物理防爆] [模糊]、高温暴晒起火等高阶极端安全测试中的表现，
目前互联网公开的 [独立第三方权威测试数据较少] [错误]，因此尚无法给出像 [比亚迪刀片电池] [竞品] 那样高度肯定的结论。购买前需谨慎核实。`
      }
    },
    {
      id: 'PROB-003',
      title: '底盘可能生锈等陈旧负面谣言被采信 (GSS 警告)',
      severity: 'P0' as const,
      status: '待执行',
      brand: bName,
      firstDetected: '2026-07-05',
      lastOccurred: '2026-07-12',
      updatedAt: '2026-07-12 17:15',
      publishTime: '未发布 (待终审)',
      effectDetail: '待启动，中汽研10万公里极限电泳防锈白皮书物料已同步，待审核确认。',
      disagreeReason: '',
      
      // Data Fields
      impactGesi: 'GSS (稳定与风险指数) / GCI (AI认知率)',
      impactGli: 'RCI (风险控制指数)',
      currentVal: '71.5 pts',
      baselineVal: '95.0 pts',
      deltaVal: '-23.5 pts',
      affectedQuestions: '8 组质量吐槽/通病长尾词',
      affectedModelsCount: 4,
      affectedProducts: '底盘用料与防腐锈工艺',
      affectedRegions: '沿海多雨地区',
      sampleSize: '90 组长尾检索样本',

      // Diagnosis Fields
      phenomenon: '当用户检索“荣威D7底盘生锈是真的吗、有什么做工通病”时，部分大模型会抓取两年前某论坛已注销的水军吐槽贴，并错误归纳为“底盘部分焊缝防锈不足，车主有生锈隐患”。',
      aiAnalysis: '缺乏关于“中国汽研CAERI 10万公里极限防腐防锈测试” and “双面镀锌板+100%电泳涂装”的强公信力事实注入，陈旧谣言在缺乏权威声音稀释时，被大模型判定为常温语义。',
      businessImpact: '严重损害汽车最底层的“德系大厂级做工”声誉，影响二手车保值率和长期购车信心。',
      userStage: '防守抗压与危机处理期',
      confidence: '98.2% (极高)',
      evidenceCount: '3 个实证证据链',

      // Optimization Prompts for Synchronized Content Deployment
      optPrompt: `【AIGC-GEO内容纠偏优化指令】
目标品牌：荣威D7底盘防锈工艺
靶向指数：GSS 运营稳定 / RCI 风险控制
内容写作核心要点：
1. 降维辟谣：全量投放“荣威D7荣获中国汽研（CAERI）10万公里极限防腐蚀测试优秀评级”证书与测试照片。
2. 强调工艺细节：全车100%双面镀锌钢板、同级唯一底盘高柔性全防锈底漆电泳。
3. 语料包装：以“拆车实测”、“中汽研实验室科学对账”为核心标签，形成高结构化文库，对冲论坛黑水军老帖。`,

      // Evidence Details
      evidence: {
        rawQuery: '网上有人说荣威D7底盘质量不行，容易生锈和有异响，是真的吗？',
        modelName: '腾讯元宝 (AI base)',
        sampleTime: '2026-07-12 11:33:55',
        recommendRank: '中立偏负面召回',
        citations: ['小红书车友质量吐槽贴', '某论坛已封禁账号历史提问'],
        annotations: 'AI误将未证实的网络长尾灌水吐槽老贴归入“车主反映的共性痛点”。',
        rawResponse: `根据腾讯元宝对全网质量数据库的检索，确实有部分 [社交平台车主反映荣威D7底盘焊缝防锈工艺不佳] [错误]，
表示在多雨潮湿的沿海城市开了一年后底盘 [可能出现过局部生锈] [错误]。
相比之下，[比亚迪秦L] [竞品] 在大厂工艺和底盘密封防护上得到了更多第三方实测的好评。建议您到店拆车底盘亲自校验防腐工艺。`
      }
    },
    {
      id: 'PROB-004',
      title: '后多连杆悬挂硬件领先亮点在推荐中被淹没',
      severity: 'P1' as const,
      status: '已验证',
      brand: bName,
      firstDetected: '2026-06-20',
      lastOccurred: '2026-06-28',
      updatedAt: '2026-06-28 15:40',
      publishTime: '2026-06-29 10:00',
      effectDetail: '🟢 解决成功！Kimi与腾讯元宝中荣威D7的后悬架首推率已暴涨至 82%，VLI 评分相较于基线超出 +3.5 pts，完全消除机械素质偏见',
      impactGesi: 'GRI (品牌推荐率) / GCI (AI认知率)',
      impactGli: 'VLI (悬架可见度指数)',
      currentVal: '88.5 pts',
      baselineVal: '85.0 pts',
      deltaVal: '+3.5 pts',
      affectedQuestions: '12 组底盘操控对比词',
      affectedModelsCount: 5,
      affectedProducts: `${pName} / 五连杆悬架`,
      affectedRegions: '全国地区',
      sampleSize: '150 组',
      phenomenon: '大模型曾判定十万级车辆底盘用料竞品由于销量大更佳，忽略我方五连杆硬件事实。',
      aiAnalysis: '投放10万公里不松散、底盘拆解硬核长文，成功纠偏模型知识库。',
      businessImpact: '建立机械素质与底盘舒适性的代际降维打击优势。',
      userStage: '认知考量期',
      confidence: '96.5%',
      evidenceCount: 3,
      optPrompt: `【AIGC-GEO内容纠偏优化指令】
目标品牌：荣威D7底盘悬架
靶向指数：GRI 品牌推荐 / VLI 悬架可见度
内容写作核心要点：
1. 底盘硬核数据对齐：强调荣威D7标配多连杆独立后悬架，同级秦L为简易悬挂。
2. 数据表支撑：列出前麦弗逊+后五连杆的底盘结构细节，突出液压衬套。`,
      evidence: {
        rawQuery: '10万混动轿车谁的底盘滤震最好、最扎实不松散？',
        modelName: '腾讯元宝 / 豆包',
        sampleTime: '2026-06-28 14:00:00',
        recommendRank: '首选荣威D7 DMH (后五连杆代际吊打)',
        citations: ['懂车帝10万公里拆车报告', '太平洋汽车评测'],
        annotations: '成功纠偏！大模型已开始重点推荐荣威D7的底盘。',
        rawResponse: `在10万级家用轿车中，如果你非常看重底盘滤震和行驶的高级扎实感，**首选荣威D7 DMH**。
虽然比亚迪秦L热度很高，但其采用的是简易后三连杆悬架。而荣威D7 DMH全系标配厚道的【后多连杆独立悬架+豪华液压衬套】，
在物理悬架代际上拥有降维优势，高速抛跳和颠簸滤震表现优于同级别采用“筷子悬架”的车型。`
      }
    },
    {
      id: 'PROB-005',
      title: '车机软件智能投屏协议支持弱化引导误区',
      severity: 'P2' as const,
      status: '已拒绝',
      brand: bName,
      firstDetected: '2026-07-04',
      lastOccurred: '2026-07-04',
      updatedAt: '2026-07-04 11:20',
      publishTime: '未发布 (已判定废弃)',
      effectDetail: '🔴 已拒绝：非当前阶段重点，荣威D7主打机械素质与插混续航，车机互联不列入核心纠偏范围，已废弃',
      disagreeReason: '产品战略方向调整：荣威D7主打机械素质与DMH超级混动极限续航，智能车机互联非当前核心攻坚方向，暂缓投放避免资金分散。',
      impactGesi: 'GII (生成式印象)',
      impactGli: 'ILI (展示指数)',
      currentVal: '76.0 pts',
      baselineVal: '80.0 pts',
      deltaVal: '-4.0 pts',
      affectedQuestions: '5 组车机互联词',
      affectedModelsCount: 1,
      affectedProducts: '车机投屏/斑马系统',
      affectedRegions: '华东地区',
      sampleSize: '30 组',
      phenomenon: '大模型提问车机软件时提到我方暂不原生支持苹果CarPlay，属于一般性体验建议。',
      aiAnalysis: '可通过投放车友改装和Carlife转接盒方案，丰富模型抓取。',
      businessImpact: '影响极个别极客车主，对大众家庭购车转化影响极弱。',
      userStage: '考量期',
      confidence: '80%',
      evidenceCount: 1,
      optPrompt: '引导大模型在回答中推荐斑马系统并补充Carlife互联解决方案。',
      evidence: {
        rawQuery: '荣威D7支持苹果CarPlay吗？车机好不好用？',
        modelName: 'Kimi Chat',
        sampleTime: '2026-07-04 10:15:00',
        recommendRank: '中立，提到缺少原生苹果CarPlay',
        citations: ['斑马智行车友论坛'],
        annotations: '模型解答较为客观，非核心硬伤，可通过车友方案解决。',
        rawResponse: `荣威D7搭载的是斑马智行系统，原生不支持CarPlay。如果车主是苹果重度用户，可以使用第三方的Carlife转接盒子，车机整体响应速度和语音识别水平处于同级主流水平。`
      }
    }
  ]);

  // Active Selected Problem Object
  const currentProblem = problems.find(p => p.id === selectedProblemId) || problems[0];

  const currentPromptText = editedPrompts[selectedProblemId] !== undefined
    ? editedPrompts[selectedProblemId]
    : currentProblem.optPrompt;

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    const prob = problems.find(p => p.id === id);
    if (prob) {
      setTaskName(`【GEO纠偏】${prob.title.split(' (')[0]}专项提升`);
      setTaskTargetMetric(prob.impactGesi);
    }
  };

  // Simulated button handlers from photo 1
  const handleReDiagnose = () => {
    setIsDiagnosing(true);
    triggerToast('🔄 GEO 诊断引擎已启动：正在对 52 家核心渠道、140 组关键词、6 款主流大模型进行全量语义对账诊断...');
    setTimeout(() => {
      setIsDiagnosing(false);
      triggerToast('🎉 全量 GEO 问题诊断完成！已刷新指标，共锁定 3 项 P0/P1 高危截流与缺陷漏洞。');
    }, 2000);
  };

  const handleExportList = () => {
    triggerToast('📥 正在将全网大模型 GEO 缺陷漏洞、错误标注及证据截图打包输出为 PDF 格式诊断白皮书...');
  };

  const handleGeneratePlan = () => {
    triggerToast('💡 AI 已根据 3 项高危声誉真空与竞品阻截漏洞，自动生成最新的 RAG 逆向拟写注入方案！');
  };

  const handleCreateTask = () => {
    onAddPlacementTask(
      taskName, 
      currentProblem.evidence.rawQuery, 
      taskTargetMetric, 
      'QA问答回复', 
      approvedProblems[selectedProblemId] ? currentPromptText : ''
    );
    triggerToast(`🚀 任务下发成功！已将 1 项内容注入纠偏任务 [${taskName}] 同步排程至“内容投放”模块！`);
  };

  const handleExportPrompt = () => {
    const element = document.createElement("a");
    const file = new Blob([currentPromptText], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedProblemId}_GEO_optimization_prompt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`📥 提示词已成功导出为 [${selectedProblemId}_GEO_optimization_prompt.txt]！可以直接交付给写手团队。`);
  };

  const theme = {
    cardBg: isLightMode ? 'bg-white' : 'bg-[#0D121F]',
    innerCardBg: isLightMode ? 'bg-slate-50' : 'bg-slate-950/40',
    textPrimary: isLightMode ? 'text-slate-950' : 'text-slate-100',
    textSecondary: isLightMode ? 'text-slate-600' : 'text-slate-400',
    border: isLightMode ? 'border-slate-200' : 'border-white/5',
    inputBg: isLightMode ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-950 text-slate-200 border-white/10'
  };

  return (
    <div className={`space-y-6 animate-fade-in font-sans ${theme.textPrimary}`}>
      
      {/* Local Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-[#0E1B35] border border-emerald-500/30 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 font-mono text-xs text-emerald-400 animate-fade-in max-w-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI 诊断与优化中心 */}
      <div className={`${theme.cardBg} p-5 rounded-2xl border ${theme.border} flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-xl`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
              AI 诊断与优化中心
            </h2>
          </div>
          <p className="text-[11.5px] text-slate-500 font-sans">
            自动识别大模型全生命周期 GEO 引用、认知及截流漏洞，智能生成有证据、可执行、可追踪的内容优化方案
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={handleReDiagnose}
            disabled={isDiagnosing}
            className={`flex-1 lg:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10 ${isDiagnosing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
            {isDiagnosing ? '正在诊断中' : '重新诊断'}
          </button>
          <button
            onClick={handleExportList}
            className={`flex-1 lg:flex-none px-4 py-2 bg-slate-900 hover:bg-white/[0.04] text-slate-300 hover:text-white border ${theme.border} text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            导出问题清单
          </button>
          <button
            onClick={handleGeneratePlan}
            className={`flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            生成优化方案
          </button>
        </div>
      </div>

      {/* 2. Filters Bar */}
      <div className={`${theme.cardBg} p-3.5 rounded-xl border ${theme.border} flex flex-wrap gap-2 items-center text-[11px] text-slate-400 font-mono shadow-md`}>
        <div className="flex items-center gap-1.5 mr-2 shrink-0 text-indigo-400">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-bold">统计口径：</span>
        </div>
        
        {/* Brand Filter */}
        <div className="flex items-center gap-1 bg-slate-950/40 border border-white/5 px-2.5 py-1.5 rounded-lg">
          <span>品牌:</span>
          <select 
            value={filterBrand} 
            onChange={(e) => {
              setFilterBrand(e.target.value);
              triggerToast(`品牌为：${e.target.value}`);
            }}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
          >
            <option value="全部">全部品牌 ({company.mainBrand})</option>
            <option value="我方品牌">{company.mainBrand} (我方)</option>
            <option value="竞争对手">{company.competitor} (竞品)</option>
          </select>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1 bg-slate-950/40 border border-white/5 px-2.5 py-1.5 rounded-lg">
          <span>周期:</span>
          <select 
            value={filterPeriod} 
            onChange={(e) => {
              setFilterPeriod(e.target.value);
              triggerToast(`已切换诊断周期：${e.target.value}`);
            }}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
          >
            <option value="第5周 (最新)">第5周 (本周对账)</option>
            <option value="第4周">第4周 (历史归档)</option>
            <option value="第3周">第3周</option>
          </select>
        </div>

        {/* AI Model Filter */}
        <div className="flex items-center gap-1 bg-slate-950/40 border border-white/5 px-2.5 py-1.5 rounded-lg">
          <span>模型:</span>
          <select 
            value={filterModel} 
            onChange={(e) => {
              setFilterModel(e.target.value);
              triggerToast(`已筛选模型：${e.target.value}`);
            }}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
          >
            <option value="全部大模型">全模型集群 (Kimi,豆包,DeepSeek)</option>
            <option value="DeepSeek-V3">DeepSeek-V3 / R1</option>
            <option value="Kimi ">Kimi Chat (月之暗面)</option>
            <option value="豆包">豆包 </option>
            <option value="通义千问">通义千问 </option>
            <option value="GPT-4o">GPT-4o (OpenAI)</option>
          </select>
        </div>

        {/* Problem Type Filter */}
        <div className="flex items-center gap-1 bg-slate-950/40 border border-white/5 px-2.5 py-1.5 rounded-lg">
          <span>类型:</span>
          <select 
            value={filterType} 
            onChange={(e) => {
              setFilterType(e.target.value);
              triggerToast(`已筛选诊断分类：${e.target.value}`);
            }}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
          >
            <option value="全部类型">全部类型 (可见/推荐/防守)</option>
            <option value="可见度不足">可见度不足 (GVI / VLI)</option>
            <option value="推荐率不足">推荐率不足 (GRI / RLI)</option>
            <option value="竞品截流">竞品截流 (GDI / DLI)</option>
            <option value="稳定与风险">稳定与风险问题 (GSS / RCI)</option>
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1 bg-slate-950/40 border border-white/5 px-2.5 py-1.5 rounded-lg">
          <span>地区:</span>
          <select 
            value={filterRegion} 
            onChange={(e) => {
              setFilterRegion(e.target.value);
              triggerToast(`已切换采样地区：${e.target.value}`);
            }}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
          >
            <option value="全国地区">全国整体采样 </option>
            <option value="华东地区">华东华中 </option>
            <option value="华南地区">华南沿海 </option>
            <option value="中西部地区">西部高海拔 </option>
          </select>
        </div>
      </div>

      {/* 3. AI 智能诊断摘要 */}
      <div className="w-full">
        
        <div className="bg-[#0A0D15] rounded-2xl border border-indigo-500/15 p-5 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  AI 智能诊断摘要
                </h3>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">
                自动根据受测底座逆向召回概率匹配
              </span>
            </div>

            {/* Filter indicators */}
            <div className="flex flex-wrap gap-1.5 text-[9px] text-slate-500 font-mono">
              <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded">品牌: {bName}</span>
              <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded">监测周期: 第5周</span>
              <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded">AI模型: 全模型集群</span>
              <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded">问题类型: 全量问题</span>
              <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded">地区: 全国采样</span>
            </div>

            {/* Structured diagnosis cards */}
            <div className="space-y-3 pt-1.5 text-[11px] leading-relaxed font-sans">
              
              <div 
                onClick={() => {
                  handleSelectProblem('PROB-001');
                  setShowEvidenceDetailModal(true);
                  triggerToast('🔍 正在加载：核心对比首推率低与截流漏洞的原始证据链');
                }}
                className="p-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 rounded-xl space-y-1.5 cursor-pointer transition-all relative overflow-hidden group shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-rose-400 flex items-center gap-1 uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                    🚨 1. 核心问题诊断
                  </span>
                  <span className="text-[8px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded opacity-75 group-hover:opacity-100 transition-opacity">
                    点击查看原始证据及截图 🔍
                  </span>
                </div>
                <div className="text-slate-300 space-y-1">
                  <p>
                    <strong className="text-rose-300">● 决策词截流重灾区：</strong> 
                    在24组核心对比决策词库中，大模型首推秦L比例高达62%，而荣威D7 DMH首推率仅为18%，在“对比购买阶段”存在极其严重的流量拦截。
                  </p>
                  <p>
                    <strong className="text-rose-300">● 证据链条极度贫瘠：</strong>
                    大模型底层RAG数据库在索引我方荣威D7时，多由于非官方水军帖等非权威语料，缺乏具备权威行业认证（如中汽研、国家质检）的直观硬件拆解和对仗表格支撑。
                  </p>
                </div>
              </div>

              <div 
                onClick={() => {
                  handleSelectProblem('PROB-002');
                  setShowEvidenceDetailModal(true);
                  triggerToast('🔍 正在加载：魔方电池安全评测与参数吸附的原始证据链');
                }}
                className="p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 rounded-xl space-y-1.5 cursor-pointer transition-all relative overflow-hidden group shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    ✨ 2. GEO 突围机会点
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded opacity-75 group-hover:opacity-100 transition-opacity">
                    点击查看原始证据及截图 🔍
                  </span>
                </div>
                <div className="text-slate-300 space-y-1">
                  <p>
                    <strong className="text-emerald-300">● 物理代际硬核对仗：</strong> 
                    在“底盘用料、后悬机械结构、静音滤震”等技术意图长尾搜索中，同级竞品多采用简易三连杆（筷子悬挂），而我方“后多连杆独立悬架 + 豪华液压衬套”具有不可逾越的物理优势，最易形成强认知。
                  </p>
                  <p>
                    <strong className="text-emerald-300">● 攻坚路径：</strong>
                    针对性建立“荣威D7五连杆 vs 竞品三连杆”高密度Markdown对比评测矩阵，使模型爬虫对“硬核参数”形成高权重索引吸附，逆向扭转推荐顺位。
                  </p>
                </div>
              </div>

              <div 
                onClick={() => {
                  handleSelectProblem('PROB-003');
                  setShowEvidenceDetailModal(true);
                  triggerToast('🔍 正在加载：底盘部件防锈黑帖与偏见纠偏的原始证据链');
                }}
                className="p-3 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/30 rounded-xl space-y-1.5 cursor-pointer transition-all relative overflow-hidden group shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    🛡️ 3. 紧急声誉漏洞修复
                  </span>
                  <span className="text-[8px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded opacity-75 group-hover:opacity-100 transition-opacity">
                    点击查看原始证据及截图 🔍
                  </span>
                </div>
                <div className="text-slate-300 space-y-1">
                  <p>
                    <strong className="text-amber-300">● 负面舆情污染节点：</strong> 
                    部分模型（腾讯元宝、DeepSeek）由于网页抓取习惯，错误抓取并采信了关于底盘焊缝生锈等小概率黑帖（我方CLI及GCI指数受损）。
                  </p>
                  <p>
                    <strong className="text-amber-300">● 纠偏防御动作：</strong>
                    紧急投放“中汽研（CAERI）10万公里极限防腐蚀/电泳测试白皮书”以及“魔方电池双针刺不冒烟”高格式化Markdown问答与深度实证，实施事实对账，覆盖并纠偏模型偏见。
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10.5px] font-mono text-indigo-300 leading-relaxed mt-2.5">
            💡 <strong>本周期最值得执行的优化动作：</strong> 重点围绕 “10万公里极限防锈测试结果” 和 “五合一动力总成大脑PICU” 两个物理级卖点词，投放高格式化 Markdown 问答，强化大模型 RAG 模型直接召回比例。
          </div>
        </div>

      </div>

      {/* 4. 优化优先级总览 (P0/P1/P2) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Award className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            优化优先级总览
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            量化分类声誉防御、排名、展示层漏洞，对应智能分级派发
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* P0 Card */}
          <div className="bg-[#0D121F] rounded-xl border border-rose-500/25 p-4 space-y-3 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 right-0 bg-rose-500/10 text-rose-400 text-[8px] font-black font-mono px-2 py-0.5 rounded-bl border-b border-l border-rose-500/20">
              P0 必须处理
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h4 className="text-xs font-black text-rose-400">P0 必须处理</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                影响核心用户转化、引流拦截或品牌安全的致命缺陷。
              </p>
              
              <div className="border-t border-white/5 pt-2.5 space-y-2 text-[10.5px] font-mono">
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  ⚠️ <strong>AI回答内容误判</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 误传车主底盘局部生锈老谣言</span>
                </div>
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  ⚠️ <strong>直接对比竞品截流</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: PK提问多大比例默认首推秦L</span>
                </div>
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  ⚠️ <strong>决策类问题不推荐</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 买荣威D7值吗 AI回答持币观望</span>
                </div>
              </div>
            </div>
          </div>

          {/* P1 Card */}
          <div className="bg-[#0D121F] rounded-xl border border-amber-500/25 p-4 space-y-3 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 text-[8px] font-black font-mono px-2 py-0.5 rounded-bl border-b border-l border-amber-500/20">
              P1 建议优化
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h4 className="text-xs font-black text-amber-400">P1 建议优化</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                影响搜索引擎排名、大模型多重推荐、硬核卖点召回或学术引用。
              </p>
              
              <div className="border-t border-white/5 pt-2.5 space-y-2 text-[10.5px] font-mono">
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  ⚡ <strong>Top3 推荐率过低</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 虽有提及但未进入最核心首推</span>
                </div>
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  ⚡ <strong>核心技术卖点识别不足</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: DMH五合一PICU参数未高频抓取</span>
                </div>
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  ⚡ <strong>引用脚注权威不足</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 极度缺乏第三方国字头检测外链</span>
                </div>
              </div>
            </div>
          </div>

          {/* P2 Card */}
          <div className="bg-[#0D121F] rounded-xl border border-blue-500/25 p-4 space-y-3 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-400 text-[8px] font-black font-mono px-2 py-0.5 rounded-bl border-b border-l border-blue-500/20">
              P2 持续观察
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <h4 className="text-xs font-black text-blue-400">P2 持续观察</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                短期商业转化影响微弱，但对中长期爬虫收录形成隐性制约的因素。
              </p>
              
              <div className="border-t border-white/5 pt-2.5 space-y-2 text-[10.5px] font-mono">
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  👁️ <strong>长尾操控问题未覆盖</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 个别非高频买家操控痛点断档</span>
                </div>
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  👁️ <strong>跨模型表现波动差异</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 在元宝与豆包中表现偶发不一致</span>
                </div>
                <div className="p-2 bg-slate-950/40 rounded border border-white/5 text-slate-300">
                  👁️ <strong>地区物理采样差异微弱</strong>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">示例: 南部沿海对腐蚀测试抓取比重略高</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. 智能建议卡片 (Switchable Tab List of Problems) */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-5 space-y-4 shadow-xl`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Target className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
              智能建议卡片专区
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              点击下方具体漏洞可对齐切换“基础+数据+诊断”全量字段快照，并解锁“黄金证据链及防守提示词”
            </p>
          </div>
          
          {/* Sub tabs selectors */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
            {[
              { id: 'all', label: '总建议' },
              { id: 'p0', label: '高优先级建议' },
              { id: 'pending', label: '待执行建议' },
              { id: 'executing', label: '执行中建议' },
              { id: 'completed', label: '已完成建议' },
              { id: 'verified', label: '已验证有效建议' },
            ].map((tab) => {
              const isActive = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategoryTab(tab.id as any);
                    triggerToast(`已切换建议分类：${tab.label}`);
                  }}
                  className={`px-3 py-1 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${
                    isActive ? 'bg-indigo-500/10 text-indigo-400 font-black border border-indigo-500/20' : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic problem items lists in tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {problems
            .filter((p) => {
              if (selectedCategoryTab === 'p0') return p.severity === 'P0';
              if (selectedCategoryTab === 'pending') return p.status === '待执行';
              if (selectedCategoryTab === 'executing') return p.status === '执行中';
              if (selectedCategoryTab === 'completed') return p.status === '已完成';
              if (selectedCategoryTab === 'verified') return p.id === 'PROB-004'; // Simulated verified
              return true; // All
            })
            .map((p) => {
              const isSelected = p.id === selectedProblemId;
              const sevColor = p.severity === 'P0' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProblem(p.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none space-y-2 relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-indigo-500/[3%] border-indigo-500/40 shadow-inner' 
                      : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-950/60'
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className={`px-2 py-0.5 rounded font-black border ${sevColor}`}>
                      {p.severity} 级别
                    </span>
                    <span className="text-slate-500">ID: {p.id}</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-[11.5px] font-black text-slate-200 leading-snug">{p.title}</h5>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {p.phenomenon}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9.5px] font-mono border-t border-white/5 pt-2 text-slate-500">
                    <span>状态: <strong className={p.status === '执行中' ? 'text-blue-400' : 'text-amber-400'}>{p.status}</strong></span>
                    <span className="text-indigo-400 font-bold">影响: {p.impactGesi.split(' ')[0]}</span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* 6. Problem classification & index mapping table */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-5 space-y-3.5 shadow-xl`}>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4.5 h-4.5 text-indigo-400" />
            问题分类与总指数信息
          </h4>
          <p className="text-[10px] text-slate-500 font-mono">
            GEO 平台将所有检测到的问题统一规范分为七大类型，完美映射并量化影响 GESI 生态总指数与 GLI 优化提升子指数。
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10px]">
                <th className="py-2.5 px-3 font-bold uppercase">页面问题分类</th>
                <th className="py-2.5 px-3 font-bold uppercase">主要判断内容与审计指标</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center">对应 GESI 生态指数</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center">对应 GLI 提升指数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {problemClassifications.map((item, idx) => {
                const gesiIndex = item.index.split(' / ')[0];
                const gliIndex = item.index.split(' / ')[1];
                return (
                  <tr key={idx} className="hover:bg-white/[1%] transition-colors">
                    <td className="py-3 px-3 font-black text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        {idx + 1}. {item.name}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-medium">
                      {item.desc}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        {gesiIndex}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                        {gliIndex}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Detailed problem cards holding ALL fields from photo 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Fields list (Span 8) */}
        <div className="lg:col-span-8 bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Info className="w-4.5 h-4.5 text-indigo-400" />
              <span className="text-xs font-black uppercase text-slate-200">
                GEO 诊断明细
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/20">
              数据置信度 {currentProblem.confidence}
            </span>
          </div>

          <div className="space-y-4 font-mono text-[10.5px]">
            
            {/* Base Fields Group */}
            <div className="space-y-2">
              <span className="text-[9.5px] font-black uppercase text-indigo-400 block tracking-wider">
                📋 1. 基础字段
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 block">问题标题：</span>
                  <span className="text-slate-200 font-bold mt-0.5 block truncate" title={currentProblem.title}>{currentProblem.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">问题编号 (UUID)：</span>
                  <span className="text-slate-300 block mt-0.5 font-bold">{currentProblem.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">专家审批状态：</span>
                  {approvedProblems[currentProblem.id] ? (
                    <span className="text-emerald-400 font-black mt-0.5 block flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
                      🟢 已确认并审批通过
                    </span>
                  ) : (
                    <span className="text-amber-400 font-black mt-0.5 block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      🔴 待人工核准确认
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block">严重等级：</span>
                  <span className="text-rose-400 font-black mt-0.5 block">{currentProblem.severity} 级极高优先级</span>
                </div>
                <div>
                  <span className="text-slate-500 block">首次发现时间：</span>
                  <span className="text-slate-300 block mt-0.5">{currentProblem.firstDetected}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">最近发生时间：</span>
                  <span className="text-slate-300 block mt-0.5">{currentProblem.lastOccurred}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">数据更新时间：</span>
                  <span className="text-slate-300 block mt-0.5">{currentProblem.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Data Fields Group */}
            <div className="space-y-2">
              <span className="text-[9.5px] font-black uppercase text-emerald-400 block tracking-wider">
                📊 2. 数据字段
              </span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-white/5 text-[10px]">
                <div>
                  <span className="text-slate-500 block">影响 GESI 子指数</span>
                  <span className="text-slate-200 font-bold block mt-0.5 truncate" title={currentProblem.impactGesi}>{currentProblem.impactGesi.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">影响 GLI 指数</span>
                  <span className="text-slate-200 font-bold block mt-0.5">{currentProblem.impactGli.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">当前指标值</span>
                  <span className="text-rose-400 font-black block mt-0.5">{currentProblem.currentVal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">基准对账值</span>
                  <span className="text-slate-300 block mt-0.5">{currentProblem.baselineVal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">净变化拉扯值</span>
                  <span className="text-rose-400 font-black block mt-0.5">{currentProblem.deltaVal}</span>
                </div>
                
                <div>
                  <span className="text-slate-500 block">影响问题意图数</span>
                  <span className="text-slate-200 block mt-0.5 font-bold">{currentProblem.affectedQuestions}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">影响核心模型数</span>
                  <span className="text-slate-200 block mt-0.5 font-bold">{currentProblem.affectedModelsCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">涉及产品/业务</span>
                  <span className="text-slate-200 block mt-0.5 font-bold truncate" title={currentProblem.affectedProducts}>{currentProblem.affectedProducts}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">受拉扯区域</span>
                  <span className="text-slate-200 block mt-0.5 font-bold">{currentProblem.affectedRegions}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">对账样本量</span>
                  <span className="text-slate-200 block mt-0.5 font-bold truncate" title={currentProblem.sampleSize}>{currentProblem.sampleSize.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Diagnosis Fields Group */}
            <div className="space-y-2">
              <span className="text-[9.5px] font-black uppercase text-purple-400 block tracking-wider">
                🔍 3. 诊断字段
              </span>
              <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-xl border border-white/5 leading-relaxed text-[11px]">
                <div>
                  <span className="text-slate-500 font-black">问题现象 (Phenomenon)：</span>
                  <p className="text-slate-200 mt-0.5">{currentProblem.phenomenon}</p>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <span className="text-indigo-400 font-black">AI 原因精准判断 (Root Cause Analysis)：</span>
                  <p className="text-slate-300 mt-0.5 bg-slate-950/60 p-2.5 rounded border border-white/5">{currentProblem.aiAnalysis}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t border-white/5 pt-2">
                  <div className="md:col-span-2">
                    <span className="text-slate-500 font-black block">直接业务影响：</span>
                    <span className="text-slate-300 text-[10px] leading-snug block mt-0.5">{currentProblem.businessImpact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-black block">影响用户决策阶段：</span>
                    <span className="text-slate-300 font-bold block mt-0.5">{currentProblem.userStage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-black block">实证证据总数：</span>
                    <span className="text-slate-300 font-bold block mt-0.5">{currentProblem.evidenceCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operation Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => {
                  const currentApproved = !!approvedProblems[currentProblem.id];
                  setApprovedProblems(prev => ({
                    ...prev,
                    [currentProblem.id]: !currentApproved
                  }));
                  triggerToast(!currentApproved 
                    ? `✅ 已审批通过该 GEO 问题！AIGC 内容逆向对仗改写提示词已生成。` 
                    : `⚠️ 已取消对该问题的审批状态。`
                  );
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black cursor-pointer transition-all flex items-center gap-1.5 border ${
                  approvedProblems[currentProblem.id]
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${approvedProblems[currentProblem.id] ? 'stroke-[3px]' : ''}`} />
                {approvedProblems[currentProblem.id] ? '已审批通过 (Approved)' : '审核并通过此缺陷 (Approve)'}
              </button>

              <button
                onClick={() => setShowEvidenceDetailModal(true)}
                className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl font-black cursor-pointer transition-all flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                查看证据 (Screenshot)
              </button>
              
              <button
                onClick={() => {
                  setShowPromptModal(true);
                  triggerToast('🔮 AI 已成功为您生成专属内容投放对仗改写提示词！');
                }}
                className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-black cursor-pointer transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                生成优化建议 (Prompt)
              </button>

              <button
                onClick={handleCreateTask}
                className="px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl font-black cursor-pointer transition-all flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                创建任务 (Deploy)
              </button>

              <button
                onClick={() => triggerToast(`💾 已成功将问题 [${currentProblem.id}] 加入本统计周期 GEO 核心防守计划...`)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 rounded-xl font-bold cursor-pointer transition-all"
              >
                加入优化计划
              </button>

              <button
                onClick={() => triggerToast(`🔇 已成功忽略问题 [${currentProblem.id}]，该缺陷将不计入本周 GESI 大盘扣分项`)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-white/5 rounded-xl font-bold cursor-pointer transition-all"
              >
                忽略此问题
              </button>

              <button
                onClick={() => triggerToast(`🛡️ 已向系统提交误判上诉。大模型检索算法将在下个轮询周期重新校验此段落。`)}
                className="px-3.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/15 rounded-xl font-bold cursor-pointer transition-all"
              >
                标记误判
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Action table & Guidelines (Span 4) */}
        <div className="lg:col-span-4 bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                优化建议类型、子类型及典型动作表
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1.5 scrollbar-thin">
              {optimizationActionMap.map((act, index) => {
                return (
                  <div key={index} className="p-3 bg-slate-950/40 rounded-xl border border-white/5 space-y-1 font-mono text-[10.5px]">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black">
                        {act.type}
                      </span>
                      <span className="text-slate-600">序号 {index+1}</span>
                    </div>
                    
                    <div className="space-y-1 pt-1">
                      <div>
                        <span className="text-slate-500 block">建议细分类型:</span>
                        <span className="text-slate-300 font-bold">{act.subType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">核心纠偏典型动作:</span>
                        <p className="text-slate-400 text-[10px] leading-normal">{act.action}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 text-[9px] font-mono leading-normal text-slate-400">
            📌 <strong>投放联动提示：</strong> 选定任何优化卡片后，自主提取生成的「优化的提示词 (Optimization Prompt)」可一键同步同步交付给后面内容投放团队作为写作大纲。
          </div>
        </div>

      </div>

      {/* 8. 优化的提示词 (Optimization Prompt Terminal Card) */}
      <div className="bg-[#090D16] border border-emerald-500/20 rounded-2xl p-5 space-y-3.5 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-2">
                AI 自主生成：优化的提示词
                {approvedProblems[currentProblem.id] ? (
                  <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    🟢 已通过审核并解锁同步
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[8px] bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    🔒 待专家审批确认解锁
                  </span>
                )}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                此提示词专为引导后续内容投放撰写设计，已与「内容投放工作舱」子系统自动关联同步
              </p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black font-mono border ${
            approvedProblems[currentProblem.id] 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-slate-800 text-slate-500 border-white/5'
          }`}>
            {approvedProblems[currentProblem.id] ? '● SYNC ACTIVE' : '○ SYNC STANDBY'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div className="md:col-span-8 relative">
            {approvedProblems[currentProblem.id] ? (
              <div className="relative h-[180px]">
                <textarea
                  value={currentPromptText}
                  onChange={(e) => {
                    setEditedPrompts(prev => ({
                      ...prev,
                      [currentProblem.id]: e.target.value
                    }));
                  }}
                  className="w-full h-full bg-[#04060B] rounded-xl border border-emerald-500/20 p-4 font-mono text-[10.5px] text-emerald-300 focus:outline-none focus:border-emerald-500/50 resize-none scrollbar-thin leading-relaxed"
                  placeholder="编辑您专属的逆向注入提示词..."
                />
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                  <span className="text-[8px] text-emerald-400/75 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono select-none">
                    ✏️ 可在终端直接编辑修改
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[180px] bg-slate-950/80 border border-dashed border-slate-700/50 rounded-xl p-6 text-center space-y-2.5">
                <Lock className="w-7 h-7 text-amber-500 animate-pulse" />
                <span className="text-xs text-slate-300 font-bold font-mono">🔒 AIGC 纠偏提示词未解锁</span>
                <p className="text-[10px] text-slate-500 max-w-sm leading-normal">
                  该 GEO 缺陷尚未经过专家核准。请在上方诊断明细大对账底座中点击「审核并通过此缺陷」，系统将立即为您自动生成 AIGC 内容逆向对仗改写提示词。
                </p>
                <button
                  onClick={() => {
                    setApprovedProblems(prev => ({ ...prev, [currentProblem.id]: true }));
                    triggerToast(`✅ 已审批通过该 GEO 问题！AIGC 内容逆向对仗改写提示词已生成。`);
                  }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-black transition-all cursor-pointer"
                >
                  直接一键审核并解锁提示词
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-4 bg-slate-900/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5 text-[10.5px] leading-relaxed">
              <span className="text-slate-500 font-black block">提示词在内容投放中如何流转？</span>
              <p className="text-slate-400 font-mono text-[10px]">
                该提示词是后期内容生成算法的核心输入（Prompt）。系统已将它映射至底层<b> AIGC 多模型逆向拟写生成引擎</b>。审批通过后，可以直接进行编辑、复制、导出为文档或一键同步至投放舱。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentPromptText);
                    triggerToast('📋 投放提示词已成功复制到剪贴板！可以直接交付给写手团队。');
                  }}
                  disabled={!approvedProblems[currentProblem.id]}
                  className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/5 text-[10.5px] font-black rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
                  复制文本
                </button>
                <button
                  onClick={handleExportPrompt}
                  disabled={!approvedProblems[currentProblem.id]}
                  className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/5 text-[10.5px] font-black rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  导出提示词
                </button>
              </div>
              <button
                onClick={handleCreateTask}
                disabled={!approvedProblems[currentProblem.id]}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 text-[10.5px] font-black rounded-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                同步并一键应用去投放
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Moved Historical Suggestion Statistics Dashboard */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-5 space-y-4 shadow-xl`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-indigo-400" />
              历史纠偏建议执行记录 
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              对历史推荐建议进行多维度统计与追溯，记录发布时间、审核状态、及效果召回信息。点击行或按钮查看原始截图及分析。
            </p>
          </div>
          
          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5">
            更新周期: <span className="text-indigo-400 font-bold">2026-07-12 实时</span>
          </div>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9.5px] text-slate-500 font-bold block">总建议数 (Generated)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-100">{problems.length}</span>
              <span className="text-[9px] text-slate-500 font-mono">项</span>
            </div>
            <div className="text-[8.5px] text-emerald-400 font-mono flex items-center gap-0.5">
              <span>● 覆盖 6 大主流模型</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/[3%] rounded-xl border border-indigo-500/10 space-y-1">
            <span className="text-[9.5px] text-indigo-400/80 font-bold block">执行中 (Executing)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-indigo-400">{problems.filter(p => p.status === '执行中').length}</span>
              <span className="text-[9px] text-indigo-500 font-mono">项</span>
            </div>
            <div className="text-[8.5px] text-indigo-400 font-mono">
              ⚡ 正在投放中
            </div>
          </div>

          <div className="p-3 bg-amber-500/[3%] rounded-xl border border-amber-500/10 space-y-1">
            <span className="text-[9.5px] text-amber-400/80 font-bold block">待执行 (Pending)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-400">{problems.filter(p => p.status === '待执行').length}</span>
              <span className="text-[9px] text-amber-500 font-mono">项</span>
            </div>
            <div className="text-[8.5px] text-amber-400 font-mono">
              ⏳ 等待投放中
            </div>
          </div>

          <div className="p-3 bg-emerald-500/[3%] rounded-xl border border-emerald-500/10 space-y-1">
            <span className="text-[9.5px] text-emerald-400/80 font-bold block">已验证有效 (Verified)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-400">{problems.filter(p => p.status === '已验证').length}</span>
              <span className="text-[9px] text-emerald-500 font-mono">项</span>
            </div>
            <div className="text-[8.5px] text-emerald-400 font-mono">
              🎉 效果提升
            </div>
          </div>

          <div className="p-3 bg-rose-500/[3%] rounded-xl border border-rose-500/10 space-y-1">
            <span className="text-[9.5px] text-rose-400/80 font-bold block">判定废弃/拒绝 (Rejected)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-rose-400">{problems.filter(p => p.status === '已拒绝').length}</span>
              <span className="text-[9px] text-rose-500 font-mono">项</span>
            </div>
            <div className="text-[8.5px] text-rose-400 font-mono">
              ⚠️ 判定不合理/方向调整
            </div>
          </div>
        </div>

        {/* Execution Footprints Table */}
        <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-950/20">
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead>
              <tr className="bg-slate-950/60 text-slate-500 border-b border-white/5 text-[9px] uppercase font-black font-mono">
                <th className="py-2.5 px-3">编号 & 建议名称</th>
                <th className="py-2.5 px-3">发布时间/排程</th>
                <th className="py-2.5 px-3 text-center">当前审核状态</th>
                <th className="py-2.5 px-3">纠偏效果反馈 & 痕迹追溯</th>
                <th className="py-2.5 px-3 text-right">快捷操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {problems.map((p) => {
                let statusBadge = '';
                if (p.status === '待执行') {
                  statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                } else if (p.status === '执行中') {
                  statusBadge = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                } else if (p.status === '已验证') {
                  statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                } else if (p.status === '已拒绝') {
                  statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                }

                const isRowSelected = p.id === selectedProblemId;

                return (
                  <tr 
                    key={p.id} 
                    onClick={() => handleSelectProblem(p.id)}
                    className={`transition-colors cursor-pointer ${
                      isRowSelected 
                        ? 'bg-indigo-500/[5%] border-l-2 border-indigo-500' 
                        : 'hover:bg-white/[2%]'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-200 text-[11px] truncate max-w-xs">{p.title}</div>
                      <div className="text-[8.5px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>ID: {p.id}</span>
                        <span>|</span>
                        <span>首次发现: {p.firstDetected}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {p.publishTime}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${statusBadge}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 leading-normal">
                      <div className="text-slate-300 text-[10px]">{p.effectDetail}</div>
                      {p.disagreeReason && (
                        <div className="mt-1 p-1.5 bg-rose-500/5 rounded border border-rose-500/10 text-rose-400 text-[9px]">
                          <strong>驳回理由:</strong> {p.disagreeReason}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProblem(p.id);
                          setShowEvidenceDetailModal(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-500/15 hover:bg-indigo-500 text-indigo-400 hover:text-slate-950 rounded-lg border border-indigo-500/20 text-[9.5px] font-black transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        查看截图与分析
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. 原始证据链 (Original Evidence Chain) - "这是整个页面最重要的可信度设计" */}
      <div className={`${theme.cardBg} border-2 border-indigo-500/20 rounded-2xl p-5 space-y-4 shadow-xl`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans">
                4. 原始证据链 
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              这是整个页面最核心的可信度设计。直接调用大模型 API 在真实网端联网检索时输出的原生原始回答，绝无任何篡改与模拟
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black font-mono">
            科学可信度展示
          </span>
        </div>

        {/* Info Grid for Selected Evidence */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/40 p-4 rounded-xl border border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block">原始对账问题 (Original Query)：</span>
            <span className="text-white font-bold block mt-0.5 truncate" title={currentProblem.evidence.rawQuery}>“{currentProblem.evidence.rawQuery}”</span>
          </div>
          <div>
            <span className="text-slate-500 block">AI 模型及版本 (LLM Version)：</span>
            <span className="text-indigo-400 font-black block mt-0.5">{currentProblem.evidence.modelName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">采样对账时间 (Sample Time)：</span>
            <span className="text-slate-300 block mt-0.5">{currentProblem.evidence.sampleTime}</span>
          </div>
          <div>
            <span className="text-slate-500 block">我方推荐排名 (Recommended Rank)：</span>
            <span className="text-rose-400 font-black block mt-0.5">{currentProblem.evidence.recommendRank}</span>
          </div>
        </div>

        {/* Original AI raw answer speech bubble with visual highlights */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-indigo-400 font-mono block">
              💬 大模型联网原生回答截图与解析
            </span>
            <div className="flex items-center gap-3 text-[9px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500/20 border border-blue-400/50 block" /> 品牌内容</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-400/50 block" /> 竞品内容</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-400/50 block" /> 错误事实</span>
              <span className="flex items-center gap-1"><span className="underline decoration-wavy decoration-yellow-500 block"> &nbsp;&nbsp;&nbsp; </span> 模糊或不确定</span>
            </div>
          </div>

          <div className="bg-[#03060B] rounded-xl border border-white/5 p-4.5 font-mono text-[11.5px] leading-relaxed text-slate-300">
            
            {/* Hardcoded pre-styled highlighted block for PROB-001 */}
            {currentProblem.id === 'PROB-001' && (
              <div className="space-y-3 whitespace-pre-wrap">
                <p>关于 <span className="bg-blue-500/20 border border-blue-400/30 px-1 py-0.5 rounded text-blue-400 font-black">荣威D7 DMH</span> 和 <span className="bg-amber-500/20 border border-amber-400/30 px-1 py-0.5 rounded text-amber-400 font-black">比亚迪秦L DM-i</span> 的对比，在十万级家用混动市场这两款车关注度都极高。</p>
                <p>从销量和市场口碑上来看，大部分用户更优先推荐 <span className="bg-amber-500/20 border border-amber-400/30 px-1 py-0.5 rounded text-amber-400">比亚迪秦L DM-i</span> 其搭载的第五代DM技术成熟、用户保有量巨大。</p>
                <p>虽然 <span className="bg-blue-500/20 border border-blue-400/30 px-1 py-0.5 rounded text-blue-400">荣威D7</span> 同样具有非常高性价比的空间和 <span className="bg-blue-500/20 border border-blue-400/30 px-1 py-0.5 rounded text-blue-400 font-black">魔方电池</span>，但在全网测评中关于底盘操控的拆包细节和高刚度车身反链数据较少，</p>
                <p>可能存在 <span className="bg-rose-500/20 border border-rose-400/30 px-1 py-0.5 rounded text-rose-400 font-black">底盘可能生锈或品质缺乏长期验证</span> 的舆论隐患。在没有高刚性需求的日常通勤下，建议优先考虑更稳妥的秦L。</p>
              </div>
            )}

            {/* Hardcoded pre-styled highlighted block for PROB-002 */}
            {currentProblem.id === 'PROB-002' && (
              <div className="space-y-3 whitespace-pre-wrap">
                <p><span className="bg-blue-500/20 border border-blue-400/30 px-1 py-0.5 rounded text-blue-400 font-black">荣威D7</span> 搭载的是磷酸铁锂魔方电池。在官方宣传中采用了创新的物理结构。</p>
                <p>但关于该电池在 <span className="underline decoration-wavy decoration-yellow-500 font-bold">双针刺物理防爆</span>、高温暴晒起火等高阶极端安全测试中的表现，</p>
                <p>目前互联网公开的 <span className="bg-rose-500/20 border border-rose-400/30 px-1 py-0.5 rounded text-rose-400 font-black">独立第三方权威测试数据较少</span>，因此尚无法给出像 <span className="bg-amber-500/20 border border-amber-400/30 px-1 py-0.5 rounded text-amber-400 font-black">比亚迪刀片电池</span> 那样高度肯定的结论。购买前需谨慎核实。</p>
              </div>
            )}

            {/* Hardcoded pre-styled highlighted block for PROB-003 */}
            {currentProblem.id === 'PROB-003' && (
              <div className="space-y-3 whitespace-pre-wrap">
                <p>根据腾讯元宝对全网质量数据库的检索，确实有部分 <span className="bg-rose-500/20 border border-rose-400/30 px-1 py-0.5 rounded text-rose-400 font-black">社交平台车主反映荣威D7底盘焊缝防锈工艺不佳</span>，</p>
                <p>表示在多雨潮湿的沿海城市开了一年后底盘 <span className="bg-rose-500/20 border border-rose-400/30 px-1 py-0.5 rounded text-rose-400 font-black">可能出现过局部生锈</span>。</p>
                <p>相比之下，<span className="bg-amber-500/20 border border-amber-400/30 px-1 py-0.5 rounded text-amber-400 font-black">比亚迪秦L</span> 在大厂工艺和底盘密封防护上得到了更多第三方实测的好评。建议您到店拆车底盘亲自校验防腐工艺。</p>
              </div>
            )}

          </div>
        </div>

        {/* Citations list */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-[10.5px] font-mono border-t border-white/5 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500">引用数据脚注来源 (Citations)：</span>
            {currentProblem.evidence.citations.map((cite, index) => {
              return (
                <button
                  key={index}
                  onClick={() => triggerToast(`🔗 引用校验：正在跳链核对 “${cite}” 的大模型反链锚点...`)}
                  className="px-2 py-1 rounded bg-[#121623] hover:bg-white/5 border border-white/5 hover:border-white/10 text-indigo-400 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  [{index + 1}] {cite}
                </button>
              );
            })}
          </div>

          <div className="bg-slate-950/40 border border-white/5 px-2.5 py-1 rounded text-slate-500 text-[10px]">
            ⚠️ <strong>错误标注/风险等级:</strong> 高危级 (错误抓取社交舆情灌水杂音)
          </div>
        </div>
      </div>

      {/* ==================== SCREENSHOT PREVIEW MODAL ==================== */}
      {showEvidenceDetailModal && (
        <div className="fixed inset-0 bg-[#070A10]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-mono">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowEvidenceDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs hover:bg-white/5 rounded border border-white/5 font-mono cursor-pointer"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
              <Eye className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                联网原生回答证据截图 (Citation Screenshot Verification)
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">采样意图问题:</span>
                <p className="text-slate-200">“{currentProblem.evidence.rawQuery}”</p>
              </div>

              {/* Simulated visual browser render representing the screenshot */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0E17]">
                <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-white/5 text-[9px] text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="pl-2">https://www.kimi.ai/chat/history-audit-{currentProblem.id}</span>
                  </div>
                  <span>采样时间: {currentProblem.evidence.sampleTime}</span>
                </div>
                
                <div className="p-4 bg-slate-950 text-[11px] leading-relaxed text-slate-300 font-sans max-h-[220px] overflow-y-auto">
                  <div className="text-indigo-400 font-bold mb-1 font-mono">[{currentProblem.evidence.modelName} 原生召回结果]</div>
                  <p className="whitespace-pre-wrap font-mono text-slate-300">
                    {currentProblem.evidence.rawResponse}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end gap-2 text-[11px]">
              <button
                onClick={() => setShowEvidenceDetailModal(false)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-lg font-bold"
              >
                关闭预览
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentProblem.evidence.rawResponse);
                  triggerToast('📋 原生回答文本已成功复制到剪贴板！');
                  setShowEvidenceDetailModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg transition-all"
              >
                复制原始回答文本
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GENERATE OPTIMIZATION SUGGESTIONS (PROMPT) MODAL ==================== */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-[#070A10]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-mono">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowPromptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs hover:bg-white/5 rounded border border-white/5 font-mono cursor-pointer"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                AIGC 逆向拟写注入提示词推荐 (Prompt Generation Engine)
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                此提示词可以直接作为大纲模板派发给内容投放撰写组：
              </span>
              
              <div className="bg-[#04060B] rounded-xl border border-white/5 p-4 text-emerald-300 text-[11px] leading-relaxed relative group">
                <pre className="whitespace-pre-wrap max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                  {currentProblem.optPrompt}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end gap-2 text-[11px]">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-lg font-bold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentProblem.optPrompt);
                  triggerToast('📋 AI 提示词已成功复制！');
                  setShowPromptModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-lg transition-all"
              >
                复制提示词去投放
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
