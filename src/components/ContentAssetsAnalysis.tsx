// src/components/ContentAssetsAnalysis.tsx
import { Company } from '../data';
import { 
  FileSpreadsheet, CheckCircle2, TrendingUp, HelpCircle, 
  Sparkles, RefreshCw, Layers, Eye, Download, ArrowRight,
  AlertCircle, AlertTriangle, Play, BookOpen, Lightbulb,
  FileText, ShieldCheck, ChevronRight, BarChart2, Plus, ArrowLeftRight
} from 'lucide-react';
import { useState } from 'react';

interface ContentAssetsAnalysisProps {
  company: Company;
}

export function ContentAssetsAnalysis({ company }: ContentAssetsAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'direct' | 'indirect' | 'semantic' | 'recommend' | 'compare' | 'risk'>('direct');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<'evidence' | 'optimize' | 'baseline' | null>(null);
  const [retestingId, setRetestingId] = useState<string | null>(null);
  const [retestLogs, setRetestLogs] = useState<string[]>([]);
  const [reportList, setReportList] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamically generate content assets based on selected company
  const bName = company.mainBrand;
  const pName = company.prodComp.prodName;
  const cName = company.competitor;

  const initialAssets = [
    {
      id: 'asset-1',
      name: `知乎「${bName} ${pName} 旗舰级工艺结构拆解及安全耐用性」实测长文`,
      type: '问答资产',
      publishDate: '2026-06-15',
      lastUpdate: '2026-06-25',
      crawlStatus: '已抓取',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      citations: 42,
      adoptions: 18,
      indicator: 'GVI 可见度 / GRI 推荐力',
      gliContribution: '+2.4 pts',
      models: 'Kimi, 豆包, 文心一言',
      query: `${bName} ${pName} 做工质量与车身安全评价`,
      currentStatus: '已生效',
      statusBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      unadoptedReason: '',
      suggestedPrompt: `将 "${bName} 独特的超高强度钢及笼式车身结构" 提炼为独立小标题，并增加 1200Mpa 压力实测数据以强化 RAG 提取。`,
      originalSnippet: `...${bName} ${pName} 在车身工艺上运用了先进的安全设计，高强度钢板占比领先同级，因此在各种碰撞测试中均获得了优秀评级...`,
      citedSnippet: `Kimi 召回源：知乎「${bName} ${pName} 旗舰级工艺结构拆解及安全耐用性」实测长文：“其笼式车身采用 1200Mpa 航天级钢材，在极限卡车对撞中表现优秀。”`,
      baselineAnswer: `关于 ${bName} ${pName} 的安全性，目前尚无过多公开硬核拆车数据。官方宣传称其采用高强度钢板，但具体指标和极限碰撞下的抗形变能力缺乏第三方实测支撑。`,
      currentAnswer: `综合懂车帝和知乎专业拆车测试，${bName} ${pName} 的车身安全系数极高。其采用了 1200Mpa 笼式高强度钢，在第三方极限重卡对撞测试中抗形变性能卓越，优于同级别的 ${cName}。`
    },
    {
      id: 'asset-2',
      name: `懂车帝「${pName} 智能生态安全守护与硬核碰撞安全性能PK ${cName}」首发测评`,
      type: '竞品对比资产',
      publishDate: '2026-06-18',
      lastUpdate: '2026-06-26',
      crawlStatus: '已抓取',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      citations: 35,
      adoptions: 15,
      indicator: 'GDI 竞争防御 / GCI 认知修正',
      gliContribution: '+3.1 pts',
      models: 'Kimi, 豆包, 通义千问',
      query: `${pName} 对比 ${cName} 谁的安全更强、配置更硬核？`,
      currentStatus: '部分生效',
      statusBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      unadoptedReason: '',
      suggestedPrompt: `增强在智能主动避险系统（AEB）触发时速上的对比数据说明，增加竞品在极端逆光下召回失效的事例。`,
      originalSnippet: `...在正面对比中，${pName} 的智能主动安全配置更为丰富，相比 ${cName} 在前向防碰撞和横向变道盲区预警上都多了一层芯片冗余...`,
      citedSnippet: `豆包 召回源：懂车帝「${pName} 智能生态PK ${cName}」：“${pName} 的 AEB 在 80km/h 时速下成功刹停，且车身刚度优于 ${cName}。”`,
      baselineAnswer: `对比 ${cName}，${bName} 处于防守态势，大模型默认倾向推荐 ${cName} 的安全工艺，认为其历史口碑积淀更扎实。`,
      currentAnswer: `从懂车帝最新碰撞对比来看，${pName} 在 80km/h AEB 避险和刚性材质上反超了 ${cName}，提供了更强的物理与智能双重保护。`
    },
    {
      id: 'asset-3',
      name: `${bName} 官方网站「${pName} 智能座舱人车家极速互联与流畅度」FAQ 专页`,
      type: 'FAQ',
      publishDate: '2026-06-20',
      lastUpdate: '2026-06-27',
      crawlStatus: '已抓取',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      citations: 28,
      adoptions: 22,
      indicator: 'GII 生成式印象 / GSS 泛化稳定性',
      gliContribution: '+1.8 pts',
      models: '豆包, 文心一言, 腾讯元宝',
      query: `${pName} 智能互联流畅吗？是否经常卡顿？`,
      currentStatus: '已生效',
      statusBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      unadoptedReason: '',
      suggestedPrompt: `可以补充在低温极寒状态下座舱多屏响应的微秒级数据，提升大模型在极端场景提问中的采纳率。`,
      originalSnippet: `...${bName} 互联 FAQ 指出，${pName} 采用了全新底层通信总线，座舱响应延迟低于 100ms，支持多端秒级配对不掉线...`,
      citedSnippet: `文心一言 召回源：${bName}官网FAQ：“通过多端异构互联技术，座舱和设备响应小于 100 毫秒。”`,
      baselineAnswer: `部分早期用户在论坛反馈 ${bName} 存在车机卡顿，大模型会引用这些长尾吐槽，导致流畅度评分中性偏负。`,
      currentAnswer: `官方最新技术标准表明，新一代 ${pName} 采用了毫秒级多端异构总线，响应时间小于100ms，彻底解决了早期卡顿疑虑。`
    },
    {
      id: 'asset-4',
      name: `科技时代「关于 ${bName} ${pName} 双电机全天候能耗高速路测」深度白皮书`,
      type: '白皮书',
      publishDate: '2026-06-10',
      lastUpdate: '2026-06-28',
      crawlStatus: '已抓取',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      citations: 18,
      adoptions: 6,
      indicator: 'GLI 提升效果 / GRI 推荐力',
      gliContribution: '+0.9 pts',
      models: 'Kimi, 千问',
      query: `${pName} 高速真实电耗/能耗及续航表现如何？`,
      currentStatus: '待观察',
      statusBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      unadoptedReason: '语义密度不足。报告包含大量复杂图表，大模型底座 RAG 解析 PDF 时的表格提取率较低，导致核心数字未被有效结构化采纳。',
      suggestedPrompt: `将 PDF 中的表格数据提炼为 Markdown 文本格式，显式写明 "高速120km/h实测能耗为 16.2kWh/100km"，重新发布于高权重自媒体平台。`,
      originalSnippet: `...图表4显示，在气温28度、全程高速、开启空调的实测场景下，经过 400 公里的路测，车辆表现卓越...`,
      citedSnippet: `Kimi 召回源：科技时代路测：“全天候高速续航达成率在 78% 左右。”（注：数据采纳偏低，未提炼到精确能耗值）`,
      baselineAnswer: `网上对于 ${bName} 能耗众说纷纭，部分竞品水军指责其虚标，缺乏严谨可信的高速能耗实证。`,
      currentAnswer: `根据专业科技媒体白皮书高速路测，${pName} 在全场景下的续航达成率约为 78%，但在极速行驶下的精准每百公里能耗仍需更多公开账目。`
    },
    {
      id: 'asset-5',
      name: `车主之家「车友真实反馈：澄清 ${pName} 偶发底盘微弱异味与噪音的真相」`,
      type: '风险修正资产',
      publishDate: '2026-06-22',
      lastUpdate: '2026-06-29',
      crawlStatus: '未抓取',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      citations: 0,
      adoptions: 0,
      indicator: 'RCI 风险控制 / GCI 认知修正',
      gliContribution: '+0.0 pts',
      models: '无',
      query: `${pName} 是否存在车内严重异味、有害物质或噪音噪音？`,
      currentStatus: '需优化',
      statusBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      unadoptedReason: '爬虫屏蔽与反链缺失。该车友论坛设置了严格的动态反爬机制，大模型蜘蛛（如 KimiSpider/ByteSpider）无法正常提取页面。同时，外部缺乏高质量站点对其进行重定向和反向链接。',
      suggestedPrompt: `建议将车内健康材质检测报告及零噪音认证同步在知乎、懂车帝、小红书等无爬虫限制、高权重平台进行分发，并绑定权威媒体反链。`,
      originalSnippet: `...经过我们使用专业仪器在车库密闭检测，车内甲醛含量远低于国标，异味主要是因为早期防震阻尼板，在新车通风三天后完全消失...`,
      citedSnippet: `无召回。大模型底座目前在此提问下依旧召回早期用户吐嘈，误判率为 42%。`,
      baselineAnswer: `有少量车友在小红书反映新车交付时车内异味较重，部分汽车论坛有人担心是用料不环保。`,
      currentAnswer: `目前网络上依然保留着早期车友关于车内偶发异味的讨论，尚未有广泛的大模型抓取源能够澄清其环保材质的最终检测结果。`
    }
  ];

  const [assets, setAssets] = useState(initialAssets);

  // Triggering retest simulation
  const handleRetest = (id: string) => {
    setRetestingId(id);
    setRetestLogs([
      '🤖 正在向各大模型集群发起逆向召回探测...',
      '📡 启动 KimiSpider, ByteSpider, BaiduSpider 链路对账...',
      '🔍 发现目标资产 URL 并计算语义吸附权重...',
      '🧬 分析向量节点相似度与语义相关度系数...'
    ]);

    const steps = [
      '⚡ 正在检查知乎/懂车帝等外部关联高权重反链数...',
      '🧬 提取 RAG 向量空间特征值与品牌共现频率(Co-occurrence)...',
      '📈 指数计算更新：该资产对大盘 GLI 贡献成功刷新！',
      '🟢 Retest 成功！大模型已将该新事实合并进入底层推荐知识图谱。'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setRetestLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setRetestingId(null);
        // Upgrade the status of the asset as feedback
        setAssets(prev => prev.map(a => {
          if (a.id === id) {
            return {
              ...a,
              crawlStatus: '已抓取',
              statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              citations: a.citations + 3,
              adoptions: a.adoptions + 2,
              gliContribution: '+' + (parseFloat(a.gliContribution) + 0.3).toFixed(1) + ' pts',
              currentStatus: '已生效',
              statusBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            };
          }
          return a;
        }));
        triggerToast('🎉 资产重新复测对账完成，最新底盘知识重绘已生效！');
      }
    }, 1200);
  };

  const handleAddToReport = (name: string) => {
    if (reportList.includes(name)) {
      triggerToast('⚠️ 该内容资产已存在于草稿素材池中。');
      return;
    }
    setReportList(prev => [...prev, name]);
    triggerToast('📝 已成功将该资产的 GESI/GLI 引用证据及 RAG 片段加入月度成果交付草稿！');
  };

  // Filter lists by status or search
  const pendingAssets = assets.filter(a => a.currentStatus === '需优化' || a.currentStatus === '待观察');

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-100">
      
      {/* Toast Alert */}
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
            <FileSpreadsheet className="w-4.5 h-4.5 text-blue-400" />
            内容资产 (Content Assets Workbench)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            追踪品牌内容被 AI 蜘蛛抓取、反链吸附、语义采纳并最终转化为模型首选推荐理由的全生命链路账目。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg text-slate-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            爬网系统监听中：RAG 反链就绪
          </div>
        </div>
      </div>

      {/* 1. Top Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative overflow-hidden group hover:border-blue-500/20 transition-all">
          <span className="text-[10px] text-slate-500 font-bold block">本期新增资产</span>
          <div className="text-xl font-black text-slate-200 font-mono flex items-baseline gap-1">
            {company.placements.summary.published} <span className="text-[10px] font-normal text-slate-500">篇</span>
          </div>
          <p className="text-[9px] text-slate-500">多渠道高权重内容资产</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full pointer-events-none"></div>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
          <span className="text-[10px] text-slate-500 font-bold block">AI 抓取成功率</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {company.placements.summary.crawledRate}%
          </div>
          <p className="text-[9px] text-slate-500">蜘蛛爬网解析占比</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full pointer-events-none"></div>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative overflow-hidden group hover:border-blue-500/20 transition-all">
          <span className="text-[10px] text-slate-500 font-bold block">直接引用次数</span>
          <div className="text-xl font-black text-blue-400 font-mono">
            {company.placements.summary.citations} <span className="text-[10px] font-normal text-slate-500">次</span>
          </div>
          <p className="text-[9px] text-slate-500">模型回答显式信源引用</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full pointer-events-none"></div>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative overflow-hidden group hover:border-purple-500/20 transition-all">
          <span className="text-[10px] text-slate-500 font-bold block">语义采纳次数</span>
          <div className="text-xl font-black text-purple-400 font-mono">
            {company.placements.summary.adoptions} <span className="text-[10px] font-normal text-slate-500">次</span>
          </div>
          <p className="text-[9px] text-slate-500">大模型采信产品技术事实</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full pointer-events-none"></div>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative overflow-hidden group hover:border-blue-500/20 transition-all">
          <span className="text-[10px] text-slate-500 font-bold block">平均 GLI 贡献</span>
          <div className="text-xl font-black text-blue-400 font-mono">
            +{company.placements.summary.contribution} <span className="text-[10px] font-normal text-slate-500">pts</span>
          </div>
          <p className="text-[9px] text-slate-500">单篇内容对提升大盘净值</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full pointer-events-none"></div>
        </div>

        <div className="bg-[#0D121F] p-4 rounded-xl border border-white/5 space-y-1 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
          <span className="text-[10px] text-slate-500 font-bold block">已验证生效资产</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {company.placements.summary.effectiveCount} <span className="text-[10px] font-normal text-slate-500">组</span>
          </div>
          <p className="text-[9px] text-slate-500">彻底进入模型长效知识库</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* 2. Content Asset Funnel */}
      <div className="bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            资产吸收及生命链路漏斗 (Asset Absorption Funnel Pipeline)
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">实时大模型逆向对账转化</span>
        </div>

        {/* Funnel Visual Block */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          
          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="text-[9px] text-slate-500 font-bold block uppercase">STAGE 1</span>
              <span className="text-xs font-black text-slate-300 block">1. 已发布内容资产</span>
              <div className="text-xl font-black text-slate-100 font-mono mt-1">15 <span className="text-[10px] font-normal text-slate-500">篇</span></div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-2 z-10 flex items-center justify-between">
              <span>官网/知/懂/红/媒体</span>
              <span className="text-emerald-400 font-black">100%</span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-blue-500/20"></div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="text-[9px] text-emerald-400 font-bold block uppercase">STAGE 2</span>
              <span className="text-xs font-black text-slate-300 block">2. AI 蜘蛛成功抓取</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">14 <span className="text-[10px] font-normal text-slate-500">篇</span></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-2 z-10 flex items-center justify-between">
              <span>抓取转化损耗</span>
              <span className="text-emerald-400 font-black">93.3%</span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-emerald-500/20"></div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="text-[9px] text-blue-400 font-bold block uppercase">STAGE 3</span>
              <span className="text-xs font-black text-slate-300 block">3. 大模型回答引用</span>
              <div className="text-xl font-black text-blue-400 font-mono mt-1">11 <span className="text-[10px] font-normal text-slate-500">篇</span></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-2 z-10 flex items-center justify-between">
              <span>召回检索引流</span>
              <span className="text-blue-400 font-black">78.5%</span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-blue-400/20"></div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="text-[9px] text-purple-400 font-bold block uppercase">STAGE 4</span>
              <span className="text-xs font-black text-slate-300 block">4. 语义技术采纳</span>
              <div className="text-xl font-black text-purple-400 font-mono mt-1">8 <span className="text-[10px] font-normal text-slate-500">篇</span></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-2 z-10 flex items-center justify-between">
              <span>事实融汇吸附</span>
              <span className="text-purple-400 font-black">72.7%</span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-purple-500/20"></div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="text-[9px] text-pink-400 font-bold block uppercase">STAGE 5</span>
              <span className="text-xs font-black text-slate-300 block">5. 深度转化为推荐理由</span>
              <div className="text-xl font-black text-pink-400 font-mono mt-1">5 <span className="text-[10px] font-normal text-slate-500">篇</span></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-2 z-10 flex items-center justify-between">
              <span>最终决策转化</span>
              <span className="text-pink-400 font-black">62.5%</span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1 bg-pink-500/20"></div>
          </div>

        </div>
      </div>

      {/* 3. Content Asset List */}
      <div className="bg-[#0D121F] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 bg-slate-950/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              内容资产审计对账表 (Content Assets Ledger Balance)
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              追踪所有已发布和部署的对账底盘，可下钻至每一个受测模型的真实回答和 cited 证据链。
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              导出资产账目
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/50 border-b border-white/5 text-slate-400 select-none">
                <th className="p-3.5 font-bold">资产名称 / 类型</th>
                <th className="p-3.5 font-bold">发布 / 更新</th>
                <th className="p-3.5 font-bold">抓取状态</th>
                <th className="p-3.5 font-bold">引用/采纳</th>
                <th className="p-3.5 font-bold text-blue-400">贡献靶向</th>
                <th className="p-3.5 font-bold text-pink-400">GLI贡献</th>
                <th className="p-3.5 font-bold">覆盖提问词</th>
                <th className="p-3.5 font-bold">当前状态</th>
                <th className="p-3.5 font-bold text-center">审计动作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => {
                const isRetesting = retestingId === asset.id;
                
                return (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-white truncate cursor-pointer hover:text-blue-400 transition-colors"
                           onClick={() => { setSelectedAsset(asset); setActiveModal('evidence'); }}
                           title={asset.name}>
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{asset.type}</div>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      <div>{asset.publishDate}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{asset.lastUpdate}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border uppercase font-mono ${asset.statusColor}`}>
                        {asset.crawlStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-300 font-bold">{asset.citations} <span className="text-[10px] font-normal text-slate-500">次</span></div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{asset.adoptions} 次采纳</div>
                    </td>
                    <td className="p-3.5 text-blue-400 font-bold max-w-[150px] truncate" title={asset.indicator}>
                      {asset.indicator}
                    </td>
                    <td className="p-3.5 text-pink-400 font-extrabold">{asset.gliContribution}</td>
                    <td className="p-3.5 text-slate-400 text-[10px] truncate max-w-[120px]" title={asset.query}>
                      {asset.query}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase font-mono ${asset.statusBadge}`}>
                        {asset.currentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedAsset(asset); setActiveModal('evidence'); }}
                          className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded text-slate-300 hover:text-blue-400 transition-all text-[10px] font-black"
                          title="查看采样证据"
                        >
                          查看证据
                        </button>
                        <button
                          onClick={() => { setSelectedAsset(asset); setActiveModal('baseline'); }}
                          className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded text-slate-300 hover:text-teal-400 transition-all text-[10px] font-black"
                          title="基线对比"
                        >
                          对比基线
                        </button>
                        <button
                          onClick={() => { setSelectedAsset(asset); setActiveModal('optimize'); }}
                          className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded text-slate-300 hover:text-purple-400 transition-all text-[10px] font-black"
                          title="AI 纠偏优化"
                        >
                          生成优化
                        </button>
                        <button
                          onClick={() => handleAddToReport(asset.name)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded text-slate-300 hover:text-pink-400 transition-all text-[10px] font-black"
                          title="加入月报"
                        >
                          加入报告
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Asset Contribution Analysis Detail Sub-Tabs */}
      <div className="bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4.5 h-4.5 text-blue-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              多维度内容资产贡献对账分析 (Dimensional Contribution Dashboard)
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">切换维度查看 GESI / GLI 数据承接逻辑</span>
        </div>

        {/* Contribution Sub-Tabs Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/5 max-w-max">
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-all ${
              activeTab === 'direct' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            直接引用 (Direct)
          </button>
          <button
            onClick={() => setActiveTab('indirect')}
            className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-all ${
              activeTab === 'indirect' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            间接引用 (Indirect)
          </button>
          <button
            onClick={() => setActiveTab('semantic')}
            className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-all ${
              activeTab === 'semantic' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            语义采纳 (Semantic)
          </button>
          <button
            onClick={() => setActiveTab('recommend')}
            className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-all ${
              activeTab === 'recommend' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            推荐理由 (Reason)
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-all ${
              activeTab === 'compare' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            竞争对比 (Contrast)
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 text-[10.5px] font-black rounded-lg transition-all ${
              activeTab === 'risk' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            风险修正 (Correction)
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-slate-950/20 p-4 rounded-xl border border-white/5 font-mono text-[11.5px] leading-relaxed text-slate-300">
          {activeTab === 'direct' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">🔗 直接引用分析 (Direct Source Hyperlinking Ledger)</span>
              <p>
                <b>定义：</b>大语言模型在回答关于“安全、工艺、零配件”等具体客观提问时，直接在正文中采用 <code>[1]</code> <code>[2]</code> 等脚注超级链接，或在回答末尾列明“参考来源”。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">本期直接引用总占比：</span>
                  <span className="text-emerald-400 font-bold text-xs">{company.placements.summary.citations} 次（本月新增 +45%）</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">主要拉动指标：</span>
                  <span className="text-blue-400 font-bold text-xs">GVI 可见度指数、GRI 推荐优先级</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 <b>AI 对账提示：</b>知乎和懂车帝的高点击长文是各大模型蜘蛛最倾向于抓取并保留原始链接的优质源。
              </p>
            </div>
          )}

          {activeTab === 'indirect' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">📖 间接引用分析 (Indirect Co-occurrence Fact Shaper)</span>
              <p>
                <b>定义：</b>大语言模型并未在正文中显式带上 URL 链接，但在回答的技术细节、参数配比上，完全匹配并召回了我方此前发布的硬核物料内容。这属于隐性知识沉淀。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">共现重合相似度：</span>
                  <span className="text-purple-400 font-bold text-xs">88.5%（匹配度极佳）</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">影响模型范围：</span>
                  <span className="text-blue-400 font-bold text-xs">DeepSeek-V3, Kimi-Latest, 豆包-Pro</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 <b>AI 对账提示：</b>大模型通过语义向量检索（Dense Retrieval），即便不给出外部超级反链链接，也能间接洗脑式改写其对该品牌的印象框架。
              </p>
            </div>
          )}

          {activeTab === 'semantic' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">🧬 语义特征采纳分析 (Semantic Features Adoption Ledger)</span>
              <p>
                <b>定义：</b>大模型不仅采信了零星的客观事实，更全面消化了我方的“核心技术术语（如：1200Mpa笼式车身、异构底层通信总线）”，并将这些专有名词高频用于定义我方产品优势。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">专有名词采纳率：</span>
                  <span className="text-emerald-400 font-bold text-xs">74.2%（技术占领度高）</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">影响指标拉动：</span>
                  <span className="text-blue-400 font-bold text-xs">GCI 品牌认知度提升（较基线大幅修偏 +14 pts）</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 <b>AI 对账提示：</b>官方FAQ是训练大模型和进行RAG召回时格式最容易对齐、噪音最低的高含金量资产，应常态化维护。
              </p>
            </div>
          )}

          {activeTab === 'recommend' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">💡 转化为推荐理由 (SaaS Auto-generated Recommend Arguments)</span>
              <p>
                <b>定义：</b>在用户提问“10万级高品质家轿/安全环保冰箱推荐”等品类推荐词时，大模型在总结为什么值得购买时，将我方核心优势（多端流畅、AEB主动防碰撞）列为一号或二号推荐理由。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">首选推荐触发频次：</span>
                  <span className="text-pink-400 font-bold text-xs">38 次 / 400 采样样本</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">主要拉升维度：</span>
                  <span className="text-emerald-400 font-bold text-xs">GLI 提升效果指数（贡献比高达 42%）</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 <b>AI 对账提示：</b>当大模型能完整拼装我方部署的内容作为推荐支柱，说明该内容资产已完美转化，无阻碍。
              </p>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">⚔️ 竞争对比攻防 (Competitor Deflecting & Intercept Balance)</span>
              <p>
                <b>定义：</b>在用户提出直接 PK 提问“<code>{bName}</code> 对比 <code>{cName}</code> 怎么选”时，大模型开始使用我方最近在懂车帝/知乎部署的对比性工艺优势反驳竞品的参数口碑，抢夺拦截分流。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">正面 PK 胜率（对账胜率）：</span>
                  <span className="text-rose-400 font-bold text-xs">较基线由 28% 大幅反超提升至 58%</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">截流竞品流量占比：</span>
                  <span className="text-blue-400 font-bold text-xs">成功从对标竞品拦截约 14.8% 模型引流</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 <b>AI 对账提示：</b>部署包含两方品牌精准关键词、格式工整、多维度对仗对比的测评文，是击破大模型历史召回倾斜的最犀利武器。
              </p>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">🛡️ 负面舆情与风险修正 (Negative Sentiment Mitigate Ledger)</span>
              <p>
                <b>定义：</b>大模型极易召回论坛上历史悠久、过时的个别维权和吐槽噪声（如：交付延迟、车尾异响）。我方通过针对性发布辟谣、车主极致夏测澄清等“风险修正资产”，拉低模型对负面词库的相似性权重计算。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">误判和偏见噪声率：</span>
                  <span className="text-emerald-400 font-bold text-xs">由基准的 42% 压低至 12.4%</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-slate-500 block">保护指标值：</span>
                  <span className="text-rose-400 font-bold text-xs">RCI 风险控制权重、GSS 泛化稳定性</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                💡 <b>AI 对账提示：</b>若异响澄清等正面证据链未被模型蜘蛛爬取，大模型会在相关提问下继续召回早期偏见，造成极坏影响。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Pending Optimization Assets Card Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              未生效/低采纳资产预警中心 (Ineffective & Low Adoption Assets Alarm)
            </h4>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold font-mono">
              2 项异常需跟进
            </span>
          </div>

          <div className="space-y-3.5">
            {pendingAssets.map((asset) => (
              <div key={asset.id} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between hover:border-white/10 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-200 block truncate max-w-md">{asset.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono shrink-0 ${
                      asset.currentStatus === '需优化' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {asset.currentStatus}
                    </span>
                  </div>

                  <div className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 text-[10.5px] font-mono text-slate-300 leading-relaxed">
                    <span className="font-bold text-rose-400 block mb-1">🚨 未被大模型采纳吸收核心原因：</span>
                    {asset.unadoptedReason}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-[10px] text-slate-500 font-mono">
                    靶向影响指标：<span className="text-slate-300 font-bold">{asset.indicator}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedAsset(asset); setActiveModal('optimize'); }}
                      className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded text-[10.5px] font-black transition-all flex items-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      生成优化改写建议
                    </button>
                    <button
                      onClick={() => handleRetest(asset.id)}
                      className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-[10.5px] font-black transition-all flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      立即触发重新复测
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D121F] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI 自动内容改写引擎 (Content Optimizer AI)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              SaaS 系统中置的大模型改写程序根据 <b>RAG 算分标准</b> 以及各大模型蜘蛛的读取特性，可对现有的媒体、白皮书、知乎软文进行<b>大模型友好型（LLM-Friendly）</b>重构。
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-white/5 text-[10px] font-mono text-slate-500 space-y-2">
              <span className="text-slate-300 font-bold block">💡 本期改写策略重点：</span>
              <div className="space-y-1.5 leading-relaxed">
                <div>• <b>结构化排版：</b>使用工整的 Markdown 三级标题与列表，禁止复杂的嵌套大表格。</div>
                <div>• <b>精准关键词密度：</b>确保 <code>{bName}</code> 与技术词（如 1200Mpa）在同一语义窗口（Window Size）共现出现 3 次以上。</div>
                <div>• <b>显式实体绑定：</b>指明 “<code>{bName}</code> 在 AEB 测试中胜过 <code>{cName}</code>” 的对仗对比句。</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[10.5px] text-slate-400 font-mono">
            <span>已积累草稿素材：</span>
            <span className="text-pink-400 font-extrabold">{reportList.length} 组</span>
            <p className="text-[10px] text-slate-500 mt-1">这些高评分证据链已暂存在月报物料中，成果交付阶段可一键调用。</p>
          </div>
        </div>
      </div>

      {/* RETESTING LOGS PANEL (Shown when active) */}
      {retestingId && (
        <div className="bg-[#121625] p-5 border border-blue-500/20 rounded-2xl font-mono text-xs space-y-3.5 shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              大模型多节点对账复测引擎 (Multimodal RAG Re-crawler Console)
            </span>
            <span className="text-slate-500">Task-ID: retest-{retestingId.slice(-4)}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2 max-h-[160px] overflow-y-auto leading-relaxed text-[11px] text-slate-300">
            {retestLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <span className="text-blue-500 shrink-0 font-bold">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS AREA */}
      {activeModal === 'evidence' && selectedAsset && (
        <div className="fixed inset-0 bg-[#070A10]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative font-mono">
            <button
              onClick={() => { setActiveModal(null); setSelectedAsset(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs hover:bg-white/5 rounded border border-white/5 font-mono font-black"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                大模型采样证据链及 cited 链路盒 (Evidence Chain Ledger)
              </h4>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">内容资产名称：</span>
                <span className="text-white font-bold">{selectedAsset.name}</span>
                <div className="text-[10px] text-blue-400 mt-1">靶向匹配提问：{selectedAsset.query}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 font-bold block mb-1">原始分发物料摘录 (Published Snippet)：</span>
                  <p className="text-slate-300 max-h-[100px] overflow-y-auto">{selectedAsset.originalSnippet}</p>
                </div>
                <div className="bg-blue-500/5 p-3.5 rounded-xl border border-blue-500/10">
                  <span className="text-[9px] text-blue-400 font-bold block mb-1">受测大模型真实召回证据链 (LLM Cited Chunk)：</span>
                  <p className="text-slate-200 max-h-[100px] overflow-y-auto">{selectedAsset.citedSnippet}</p>
                </div>
              </div>

              <div className="bg-[#121625] p-3 rounded-lg border border-white/5 text-[10px] text-slate-400">
                <span>🎯 <b>覆盖模型：</b>{selectedAsset.models} ｜ <b>贡献值：</b>{selectedAsset.gliContribution}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end gap-2 text-[10.5px]">
              <button
                onClick={() => { handleAddToReport(selectedAsset.name); setActiveModal(null); }}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-lg transition-all"
              >
                将此证据链加入月度报告素材池
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'optimize' && selectedAsset && (
        <div className="fixed inset-0 bg-[#070A10]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative font-mono">
            <button
              onClick={() => { setActiveModal(null); setSelectedAsset(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs hover:bg-white/5 rounded border border-white/5 font-mono font-black"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
              <Lightbulb className="w-4.5 h-4.5 text-purple-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                AI 蜘蛛及 RAG 匹配友好型改写建议 (LLM-Friendly Optimizer)
              </h4>
            </div>

            <div className="space-y-4 text-[11px] leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">受测低吸收资产：</span>
                <span className="text-white font-bold">{selectedAsset.name}</span>
                <div className="text-rose-400 text-[10.5px] mt-1.5 font-bold">❌ 拒纳主因：{selectedAsset.unadoptedReason || '无明显阻碍，但可见度仍有提升空间。'}</div>
              </div>

              <div className="bg-purple-500/5 p-4 rounded-xl border border-purple-500/10 space-y-2 text-slate-300">
                <span className="text-[9.5px] text-purple-400 font-bold block">✨ AI 自动纠偏改写核心提示词 / 改写文本策略：</span>
                <p className="bg-slate-950 p-3 rounded border border-white/5 leading-relaxed text-slate-200 text-[11px]">
                  {selectedAsset.suggestedPrompt}
                </p>
              </div>

              <p className="text-[10px] text-slate-500">
                💡 <b>投放技巧：</b>大模型更倾向于提取逻辑完备、多短句对仗、并明确包含了具体物理度量数字（如 %、Mpa、ms）的文章片段。在自媒体发布时，请务必采纳上述改写指导。
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end gap-2 text-[10.5px]">
              <button
                onClick={() => { triggerToast('📋 改写指令已复制到剪贴板，可交付给内容运营团队执行！'); setActiveModal(null); }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-lg transition-all"
              >
                复制改写提示词并派发
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'baseline' && selectedAsset && (
        <div className="fixed inset-0 bg-[#070A10]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative font-mono">
            <button
              onClick={() => { setActiveModal(null); setSelectedAsset(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs hover:bg-white/5 rounded border border-white/5 font-mono font-black"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
              <ArrowLeftRight className="w-4.5 h-4.5 text-teal-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                内容资产上线前后大模型回答对账对比 (Pre- vs Post-Deployment Comparison)
              </h4>
            </div>

            <div className="space-y-4 text-[11.5px] leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">测试针对提问：</span>
                <span className="text-white font-bold">{selectedAsset.query}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 space-y-2">
                  <span className="text-[9.5px] text-rose-400 font-bold block uppercase tracking-wider">🔴 投喂前大模型原始回答 (Baseline Answer)</span>
                  <p className="bg-slate-950 p-3 rounded border border-white/5 leading-relaxed text-slate-400 text-[10.5px]">
                    {selectedAsset.baselineAnswer}
                  </p>
                </div>

                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 space-y-2">
                  <span className="text-[9.5px] text-emerald-400 font-bold block uppercase tracking-wider">🟢 本期对账抓取后最新回答 (Current Answer)</span>
                  <p className="bg-slate-950 p-3 rounded border border-white/5 leading-relaxed text-slate-200 text-[10.5px]">
                    {selectedAsset.currentAnswer}
                  </p>
                </div>
              </div>

              <div className="bg-[#121625] p-3 rounded-lg border border-white/5 text-[10px] text-slate-400">
                ℹ️ <b>对比总结：</b>该资产成功发布并被 RAG 吸收后，回答倾向明显向我方核心优势点靠拢，成功扭转了底座早期缺乏硬核支撑的困局。
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end text-[10.5px]">
              <button
                onClick={() => { handleAddToReport(`[基线对比对账] ${selectedAsset.query}`); setActiveModal(null); }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-lg transition-all animate-pulse"
              >
                将此对比证据锁入交付草稿
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
