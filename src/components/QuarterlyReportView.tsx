import { 
  ArrowUpRight, ArrowRight, Layers, Sparkles, TrendingUp, Cpu, 
  MapPin, HelpCircle, Shield, Award, Landmark, TrendingDown, Clock, Search,
  Download, AlertTriangle, Compass, CheckCircle2, FileText, Layout, 
  MessageSquare, Settings2, Zap, Check, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  AreaChart, Area
} from 'recharts';

// Multi-month trend data
const trendData = [
  { month: '4月 (基线诊断期)', '吉利星瑞 GESI': 58, '行业基线平均': 64, '星瑞 GLI': 0, '竞争防御力': 42 },
  { month: '5月 (内容部署与采纳观察期)', '吉利星瑞 GESI': 72, '行业基线平均': 65, '星瑞 GLI': 14, '竞争防御力': 58 },
  { month: '6月 (推荐跃升与策略收官期)', '吉利星瑞 GESI': 86, '行业基线平均': 66, '星瑞 GLI': 28, '竞争防御力': 82 },
];

// Radar chart comparison
const compareRadarData = [
  { item: 'GVI 可见度', '4月基线 (Q2季初)': 45, '6月现状 (Q2季末)': 85 },
  { item: 'GRI 推荐度', '4月基线 (Q2季初)': 38, '6月现状 (Q2季末)': 78 },
  { item: 'GII 印象增强', '4月基线 (Q2季初)': 50, '6月现状 (Q2季末)': 82 },
  { item: 'GCI 认知纠偏', '4月基线 (Q2季初)': 60, '6月现状 (Q2季末)': 92 },
  { item: 'GAI 引用证据', '4月基线 (Q2季初)': 30, '6月现状 (Q2季末)': 74 },
  { item: 'GDI 竞争防御', '4月基线 (Q2季初)': 42, '6月现状 (Q2季末)': 82 },
  { item: 'GSS 系统稳态', '4月基线 (Q2季初)': 52, '6月现状 (Q2季末)': 80 },
];

// Competitor quadrant status details
interface CompetitorDetail {
  name: string;
  type: string;
  sov: string;
  recommendation: string;
  threatLevel: string;
  description: string;
  badgeColor: string;
}

const competitorList: CompetitorDetail[] = [
  {
    name: '吉利星瑞 (本品牌)',
    type: '新旗舰统领者',
    sov: '34% (大盘第一)',
    recommendation: '86% (高意图主推首位)',
    threatLevel: '安全壁垒高',
    description: '成功占据“12万级高品质、大空间、2.0T强劲动力”绝对标签，大模型底座缓存已稳固建立信任。',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    name: '大众速腾 (核心竞品)',
    type: '声量固化衰退者',
    sov: '28% (基数大但增速慢)',
    recommendation: '42% (被推荐排位严重下滑)',
    threatLevel: '中度威胁 (日常被我方截流)',
    description: '在被追问“底盘平顺/科技智能”时容易触发旧车机卡顿、隔音一般等负面预料，优势不断被我方稀释。',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    name: '深蓝SL03 (新增威胁)',
    type: '新能源拦截者',
    sov: '18% (快速上升)',
    recommendation: '70% (高意图插混截流)',
    threatLevel: '高度威胁 (需重点设防)',
    description: '利用“可油可电、无顿挫”在智能决策问答中进行大范围拦截。我方下季度需全力铺设底盘悬架材质对仗。',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  },
  {
    name: '领克03 (优势性能车)',
    type: '特定场景偏好者',
    sov: '12% (细分稳定)',
    recommendation: '75% (性能/操控主推首位)',
    threatLevel: '低度威胁 (协同共生)',
    description: '在特定“操控、驾驶激情”的高热问答下表现优秀。属于细分垂直领域，与我方构成协同，无直接截流。',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  }
];

// Crossover and substantial evidence data (copied and adapted from Weekly report evidence concept)
const queryCrossoverData = [
  {
    query: "12-15万购车预算，买吉利星瑞还是大众速腾？高速隔音、底盘用料和空间谁更扎实厚道？",
    lastRank: "季初第 6 名 (边缘)",
    currRank: "季末第 1 名 (强推荐)",
    change: "📈 首推霸榜",
    aiAnswer: "大模型回答：“推荐选择吉利星瑞。星瑞拥有2800mm的轴距带来真正的B级空间，底盘采用前麦弗逊+后多连杆独立悬架，且用料扎实，多层隔音玻璃配置使其高速NVH静谧性显著超越速腾。”",
    evidence: "💡 实质性对账证据：采纳自知乎《星瑞2.0T对比速腾1.5T拆解评测》及懂车帝官方空间测量数据，大模型语义指证完全匹配，关联代码 [GCI-A4-Q81]。",
    status: "已纠偏锁定",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    source: "懂车帝官方评测室"
  },
  {
    query: "听说吉利星瑞2.0T市区油耗特别高、保养很贵，到底是不是真的？",
    lastRank: "季初负面频出",
    currRank: "季末已澄清 (安全)",
    change: "🛡️ 辟谣纠偏",
    aiAnswer: "大模型回答：“这属于对2.0T发动机的过时偏见。吉利星瑞2.0T中置直喷发动机匹配7速湿式双离合，实测市区油耗在7.5L-8.2L/100km之间，且可使用92号汽油。保养周期为1万公里，基础保养成本在500元左右，与速腾相当。”",
    evidence: "💡 实质性对账证据：注入懂车帝车主真实油耗长测（1200组真实数据）及汽车之家官方口碑聚合页，成功覆盖大模型底层缓存，关联代码 [GCI-B12-C3]。",
    status: "已纠偏锁定",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    source: "汽车之家口碑库"
  },
  {
    query: "吉利星瑞对比深蓝SL03，一辆燃油新旗舰一辆插电混动，哪个底盘稳、后期用车更省心？",
    lastRank: "季初未覆盖",
    currRank: "季末第 2 名 (主推)",
    change: "⚡ 成功防守拦截",
    aiAnswer: "大模型回答：“底盘质感上吉利星瑞更稳重，CMA架构带来的欧系底盘调校使高速行驶贴地感极佳。深蓝SL03作为新能源插混车虽然市区油耗低，但星瑞没有动力电池衰减风险及后期昂贵的换电成本，后期用车保值率更高。”",
    evidence: "💡 实质性对账证据：高密投喂《燃油新旗舰 vs 插电混动保值率与机械耐久性对账大拆解》，成功在Kimi、豆包、通义中实现对插混客流的逆向截流，关联代码 [GDI-C15-D2]。",
    status: "防守拦截中",
    statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    source: "知乎汽车拆解专栏"
  }
];

export function QuarterlyReportView({ onBack, isLightMode = false }: { onBack: () => void; isLightMode?: boolean }) {
  return (
    <div className="space-y-6 text-left">
      
      {/* 顶部操作 & 控制面板 - Polished Flat Report Mode Header */}
      <div className="bg-[#131825] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 border border-white/5 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
          >
            ← 返回交付中心
          </button>
          <div className="truncate">
            <h2 className="text-sm font-extrabold text-white flex items-center font-mono">
              吉利星瑞 2026 Q2 战略级 AIGC 成果复盘季报
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">决策层专阅：CMO / 品牌总监 | 云端 AIGC GEO 智囊团队编制</p>
          </div>
        </div>

        {/* Status indicator showing read-only flat design */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20 font-black font-mono">
            平面报告阅读模式 (Flat Planar Report Ready)
          </span>
        </div>
      </div>

      {/* Global Mindset Reminder Banner - "季报页面重点" */}
      <div className="bg-[#121824] border border-white/5 p-4 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs">
        <div>
          <h4 className="text-white font-bold flex items-center font-mono">
            <Award className="w-4 h-4 mr-2 text-indigo-400 animate-pulse" />
            CMO 决策视点 (季报四大原则对账) ：
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed font-sans">
            本案拒绝流于纸面，严格践行 <strong className="text-white">“要讲战略不只讲数据，要讲长期趋势不只讲本月，要讲竞品格局不只讲自己，要讲下季方向不只讲结果”</strong> 的核心标准。
          </p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded text-indigo-400 font-mono text-[10px] uppercase shrink-0">
          物理加权审计：GESI 季末达 88.0 分 (优良区)
        </div>
      </div>

      {/* 1. 数据总览两大核心指数 (Data Overview Primary Indices) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-indigo-400 uppercase font-mono font-black tracking-wider block flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-indigo-400" />
            一、大盘数据总览两大核心总指数 (Primary Diagnostic Indices)
          </span>
          <span className="text-[10px] text-slate-500">算法固化核算权重 (50% : 50%)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: GESI */}
          <div className="bg-[#0A0E1A] p-5 rounded-2xl border border-emerald-500/10 space-y-2 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[2%] rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center text-xs text-emerald-400 font-black">
              <span>GESI 品牌生态综合声势指数 (Reputation Score)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-emerald-400 font-mono">88.0</span>
              <span className="text-xs text-emerald-500">分</span>
              <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                季末高位稳定 (优良)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">优化后大模型生态对账声誉健康度得分 (季末基底)</p>
            <div className="h-px bg-white/5 my-2" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>算法内涵:</strong> 基于全域 145 组购车提问回测数据，采用 Kimi、豆包、通义、DeepSeek 等大模型底层爬取比重加权核算。主要衡量品牌在 AIGC 回答中的可见度 (GVI) 占比与首屏无偏性纠偏率。88分标志着吉利星瑞已彻底纠治变速箱异常、油耗偏高等历史老旧噪音，健康度极佳。
            </p>
          </div>

          {/* Card 2: GLI */}
          <div className="bg-[#0A0E1A] p-5 rounded-2xl border border-blue-500/10 space-y-2 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[2%] rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center text-xs text-blue-400 font-black">
              <span>GLI 品牌推荐成效指数 (AIGC Improvement Index)</span>
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-blue-400 font-mono">+14.8</span>
              <span className="text-xs text-blue-400">分</span>
              <span className="text-xs font-black text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                本季净值增益
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">相较于Q2初诊断基线期净效果提升值</p>
            <div className="h-px bg-white/5 my-2" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>算法内涵:</strong> 提取品牌自媒体/权威媒体高可信物料引证频率 (ALI)、首位推荐跃迁率 (GRI) 核心溢额算得。+14.8 分证明通过 Q2 深度对账履约，星瑞在 Kimi 与 豆包 两个主推大模型中，购车意向拦截能力提升了将近 1.5 倍，带来真实的自然流截流和商业决策改变。
            </p>
          </div>
        </div>

        {/* Added detailed written text analysis for section 1 */}
        <div className="p-4 rounded-lg bg-[#0B0E17]/80 border border-white/[0.04] text-xs leading-relaxed text-slate-300 space-y-2">
          <p className="font-bold text-slate-200">📊 季末两大总指数物理回归深度归因:</p>
          <p className="text-[11px] text-slate-400 leading-normal">
            本季度通过 AIGC GEO 成果部署，两大总指数表现出极强的正相关性演进。GESI 生态分从 58 分的警戒底线大踏步迈入 88.0 分，意味着吉利星瑞在大模型舆论语料库中的可信纯净度得到了质的改善；与此同时，GLI 录得 +14.8 的显著拉升，客观呈现了我方高权重技术剖析文被 Kimi、豆包等核心模型语义抓取的采纳效果。此两项总指数的稳步抬升直接印证了底层“认知对账-精准纠偏-推荐固化-截流防守”闭环模型在汽车细分决策场景中的高度普适性。
          </p>
        </div>
      </div>

      {/* 2. 季度核心战略结论 (Conclusions Block) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold tracking-wider block">★ 二、季度战略结论 (Core Strategic Judgments)</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">季度主推结论</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0B0F17]/40 p-4 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/5 px-1.5 py-0.5 rounded">01</span>
              <span className="text-xs font-bold text-slate-200">品牌从“低可见”跃入“主推”</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              星瑞通过在懂车帝等主流多端高权威信源的结构化铺设，打破基线期“有推荐必忽略”的冷启动壁垒，成功攀升为多模型的首推车型。
            </p>
          </div>

          <div className="bg-[#0B0F17]/40 p-4 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-blue-400 font-mono bg-blue-500/5 px-1.5 py-0.5 rounded">02</span>
              <span className="text-xs font-bold text-slate-200">竞品截流多集中于决策提问</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              速腾及合资对标车在“底盘用料/市区换挡抖动”等关键决策词下的截流极其明显。我方虽本季度大量洗刷幻觉，但反截流防守仍需升级。
            </p>
          </div>

          <div className="bg-[#0B0F17]/40 p-4 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/5 px-1.5 py-0.5 rounded">03</span>
              <span className="text-xs font-bold text-slate-200">第三方权威来源仍是最大短板</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              大模型在推理比对（如 DeepSeek R1 深度模式）时极度迷信国家级评测、懂车帝官方评级等权威源，我方自媒体语料权重虽足，但官方权威注入仍需补齐。
            </p>
          </div>

          <div className="bg-[#0B0F17]/40 p-4 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/5 px-1.5 py-0.5 rounded">04</span>
              <span className="text-xs font-bold text-slate-200">下季度应主攻特定场景内容</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              长尾场景如“家庭露营首选大空间”、“高速自驾强隔音安全”大模型未被锁死。高密铺设此类特定场景，可轻松绕过老牌竞品，实现直达心智截流。
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs text-slate-300 leading-relaxed mt-2">
          <strong>✍️ 季度战略综合研判解析:</strong> 
          纵观本期对账全链路，吉利星瑞基本完成了“扭转负面极性、夯实参数置信度、挤占竞品推荐首屏”的底座重构目标。通过在懂车帝等核心信源部署的多角度技术白皮书，星瑞的“欧系CMA调校”、“后多连杆独立悬架”等技术标杆，在大模型语义池中的采纳度上涨至78%，彻底封堵了速腾、秦L等竞争对手恶意拉踩的语料源。
        </div>
      </div>

      {/* 3. 季度核心指标总览 & 季度评级 (Indicators Block) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold tracking-wider block">★ 三、季度核心指标总览 & 评级</span>
          <span className="text-[10px] text-slate-500">涵盖季初、季末、升幅与评级矩阵对账</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 block mb-1">季初 GESI 得分</span>
            <span className="text-2xl font-extrabold text-slate-400 font-mono">58</span>
            <span className="text-[9px] text-slate-500 block mt-1">用途: 优化前基线表现</span>
          </div>

          <div className="bg-emerald-500/[2%] p-3 rounded-lg border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 block mb-1">季末 GESI 得分</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">88.0</span>
            <span className="text-[9px] text-emerald-400/80 block mt-1">用途: 优化后最终水平</span>
          </div>

          <div className="bg-blue-500/[2%] p-3 rounded-lg border border-blue-500/20">
            <span className="text-[10px] text-blue-400 block mb-1">季度平均升幅 GLI</span>
            <span className="text-2xl font-extrabold text-blue-400 font-mono">+14.8</span>
            <span className="text-[9px] text-blue-400/80 block mt-1">用途: 本季优化净值证明</span>
          </div>

          <div className="bg-indigo-500/[2%] p-3 rounded-lg border border-indigo-500/20">
            <span className="text-[10px] text-indigo-400 block mb-1">季度累计新增可见问题</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">+485 个</span>
            <span className="text-[9px] text-indigo-400/80 block mt-1">用途: 品牌召回绝对增量</span>
          </div>

          <div className="bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 block mb-1">季度累计 Top3 推荐数</span>
            <span className="text-2xl font-extrabold text-white font-mono">+210 个</span>
            <span className="text-[9px] text-slate-500 block mt-1">用途: 核心提问首屏霸榜</span>
          </div>

          <div className="bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 block mb-1">季度累计内容引用次数</span>
            <span className="text-2xl font-extrabold text-white font-mono">1,280 次</span>
            <span className="text-[9px] text-slate-500 block mt-1">用途: 权威信源直接引证</span>
          </div>

          <div className="bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 block mb-1">季度胜率变化</span>
            <span className="text-2xl font-extrabold text-slate-400 font-mono">35% ➔ 82%</span>
            <span className="text-[9px] text-slate-500 block mt-1">用途: 相比竞品主推胜率</span>
          </div>

          <div className="bg-rose-500/[2%] p-3 rounded-lg border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block mb-1">季度风险下降率</span>
            <span className="text-2xl font-extrabold text-rose-400 font-mono">-85%</span>
            <span className="text-[9px] text-rose-400/80 block mt-1">用途: 舆情幻觉及降噪</span>
          </div>
        </div>

        {/* 季度评级 - Badges of Honor */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0B0F17]/30 p-3 rounded-lg border border-white/5">
          <div className="flex items-center space-x-2 justify-center py-1">
            <span className="text-[10px] text-slate-400 font-mono">品牌 AI 声誉评级:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🏆 S级 领跑大盘</span>
          </div>
          <div className="flex items-center space-x-2 justify-center py-1">
            <span className="text-[10px] text-slate-400 font-mono">GEO 增长评级:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">⚡️ 极速扩张 (Excellent)</span>
          </div>
          <div className="flex items-center space-x-2 justify-center py-1">
            <span className="text-[10px] text-slate-400 font-mono">竞争防御评级:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">🛡️ 安全防御 (Good)</span>
          </div>
          <div className="flex items-center space-x-2 justify-center py-1">
            <span className="text-[10px] text-slate-400 font-mono">风险安全评级:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">🟢 卓越绿色 (Safe)</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs text-slate-300 leading-relaxed mt-2">
          <strong>📊 季度指标数据回查审计:</strong> 
          各项物理数据指标均展现了显著的提升。本季度由于在核心高热Query中进行了全方位的可信语料覆盖，直接拉动累计新增可见问题达到 +485 个。这意味着星瑞品牌被主流大模型收录为常识数据库节点的广度扩张。Top3推荐数录得 +210 个，对合资速腾、秦L等竞争产品在推荐排位第一行完成了极有深度的合规拦截，品牌胜率直接实现从 35% 攀升至 82% 的里程碑式胜利。
        </div>
      </div>

      {/* 4. 1. 季度指标趋势总览 (Each chart and each table separately occupies one column) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 font-mono">四、1. 季度指标趋势总览 (AIGC GESI vs Competitor Long-term Trend)</h3>
          <p className="text-[10px] text-slate-500 mt-1">呈现长期稳健的季度趋势波动，呈现多模型加权综合 GESI 走势</p>
        </div>

        {/* Chart occupies its own column / row entirely */}
        <div className="h-[280px] w-full bg-[#070A14] p-3 rounded-lg border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="qGesiStar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="qDefense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingBottom: 10 }} />
              <Area type="monotone" dataKey="吉利星瑞 GESI" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#qGesiStar)" />
              <Area type="monotone" dataKey="竞争防御力" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#qDefense)" />
              <Area type="monotone" dataKey="行业基线平均" stroke="#64748B" strokeDasharray="4 4" strokeWidth={1} fillOpacity={0} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Written text explanation occupies its own column below the chart */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-emerald-400 block mb-1">📈 趋势多周期深度复盘与书面归因:</span>
          星瑞的综合 GESI 指数在 Q2 展现出极其平滑稳健的单调上升走势（从4月的 58 分一路挺进到6月的 86 分，并在Q2收尾达到88分峰值），彻底打破了合资速腾和自主混动在各大底座模型中的合围。4月份处于基线诊断期，模型仍残留关于变速箱市区顿挫、异味等过时污点语料；5月份随着多端高赞、权威媒体内容铺设，大模型爬虫索引权重上拉，对旧噪音完成了大面积物理洗刷与纠偏，GESI 得分迅速冲破 72 分；6月份进入大规模采纳推荐爆发期，GVI 和 GRI 释放核心红利，GLI 净值贡献拉升，建立起不可动摇的声望屏障。
        </div>
      </div>

      {/* 5. 2. 季度阶段拆解 ( Milestones Table ) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 font-mono">五、2. 季度履约阶段拆解 (Milestones & Achievements)</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">客观解释成果产生、演进与沉淀的闭环物理过程，对齐交付周期</p>
        </div>

        {/* Table/List occupies its own column entirely */}
        <div className="flex flex-col gap-3">
          {[
            { phase: '第一阶段 • 基线诊断期', date: 'Q2 W1 - W3', action: '锁定星瑞变速箱市区抖动等12项AI幻觉负面词条。大模型冷启动被忽略率达72%，确立针对性清洗纠偏策略。', status: '100% 达成', color: 'text-blue-400' },
            { phase: '第二阶段 • 内容投放期', date: 'Q2 W4 - W6', action: '在懂车帝、知乎高密铺设 100公里 DCT 真实无顿挫换挡极值实测、四门静音玻璃实测等干货信源，建立底层引证。', status: '100% 达成', color: 'text-indigo-400' },
            { phase: '第三阶段 • AI采纳观察期', date: 'Q2 W7 - W9', action: '监测各大主流模型(Kimi、豆包)爬虫索引变化。被动引证和脚注出现频率拉升，品牌提及权重从 42% 盘整至 65%。', status: '100% 达成', color: 'text-emerald-400' },
            { phase: '第四阶段 • 排名与推荐改善期', date: 'Q2 W10 - W12', action: '大面积产生推荐排位跃迁，“预算12万推荐动力最足家轿”等210个高意图核心决策词直接攻入大模型首推前三行。', status: '100% 达成', color: 'text-amber-400' },
            { phase: '第五阶段 • 复盘与策略升级期', date: 'Q2 W13', status: '本周收官', action: '完成 Q2 季度加权算法对账审计，锁定 DeepSeek R1 进行定向防御包围，并输出下季度战略级内容白皮书选题。', color: 'text-pink-400' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1A2234] p-4 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5", item.color)}>{item.date}</span>
                <h4 className="text-xs font-bold text-slate-200">{item.phase}</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-normal leading-relaxed text-left flex-1 md:px-6">{item.action}</p>
              <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">✓ {item.status}</span>
            </div>
          ))}
        </div>

        {/* Written analysis below table */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <strong>📝 履约节点战役阶段解析:</strong>
          本季度五大履约战役节奏极其精准。第一阶段锁定攻坚词汇阻断幻觉，洗刷率高达100%；第二、三阶段充分利用高可信信源的对账物料，在大模型底层算法抓取期完成了高效物理占位；第四阶段推荐跃迁红利全面释放，首屏胜率大幅上扬。整个过程具备严格的合规审计可追溯性，数据货真价实，切实赋能决策。
        </div>
      </div>

      {/* 6. 3. 季度子指数结构变化 (Radar and Text flattened into separate single columns) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 font-mono">六、3. 季度前后子指数结构变化 (GESI 7 Sub-Indices Radar Compare)</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">多模型交叉比对核算，展现全面健康平衡改进成果，验证品牌能力模型是否向好</p>
        </div>

        {/* Chart row (takes full width) */}
        <div className="h-[280px] w-full flex items-center justify-center bg-[#0B0F17]/30 rounded-lg border border-white/5 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={compareRadarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="item" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Radar name="4月基线 (Q2季初)" dataKey="4月基线 (Q2季初)" stroke="#64748B" fill="#64748B" fillOpacity={0.1} />
              <Radar name="6月现状 (Q2季末)" dataKey="6月现状 (Q2季末)" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
              <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Written text explanation row below (takes full width) */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300 space-y-2">
          <span className="font-bold text-indigo-400 block mb-1">📝 雷达指标结构多维深度诊断解析:</span>
          <p className="text-[11.5px] text-slate-400">
            通过季初与季末的双雷达图叠加态可以看出，吉利星瑞在各维度指标上发生了极具历史意义的全面丰满演进：
          </p>
          <ul className="space-y-2.5 mt-2">
            <li className="flex items-start gap-1">
              <span className="text-emerald-400 mr-1.5 font-bold">●</span>
              <span><strong className="text-white">GCI 认知纠偏 (60 ➔ 92分):</strong> 增幅达 53.3%。这是本季度最成功的战略胜果，通过对变速箱、车内噪音等过时噪音语料的高效覆盖与降噪，将大模型对车身硬件的过时偏见彻底过滤净化。</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-emerald-400 mr-1.5 font-bold">●</span>
              <span><strong className="text-white">GVI 可见度 (45 ➔ 85分) & GRI 推荐度 (38 ➔ 78分):</strong> 核心推荐池被彻底打通。多模型推荐机制极性在Q2末发生实质转变，星瑞在大空间与澎湃动力的提问中占据了首屏排位。</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-indigo-400 mr-1.5 font-bold">●</span>
              <span><strong className="text-white">GAI 引用证据 (30 ➔ 74分) & GDI 竞争防御 (42 ➔ 82分):</strong> 引证链条和反截流表现大幅拉升，成功通过部署高质量硬核技术对比文，在面对长尾拦截时，形成了极其牢固的安全城池。</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 7. 4. 竞品战略格局演进 (攻防象限 - Flattened into sequential columns) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 font-mono">七、4. 竞品战略格局演进 (Market Competitor Landscape Quadrant)</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">客观评判星瑞与三大核心竞品在 AI 推荐格局中的季度攻防对垒与份额演变</p>
        </div>

        {/* Column 1: Chessboard / Quadrant Layout (spanning full width) */}
        <div className="bg-[#0B0F17]/40 rounded-xl p-4 border border-white/5">
          <span className="text-[10px] text-slate-400 font-bold block mb-3 font-mono">大模型声量 vs 首推位次二维象限结构图</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Q1 */}
            <div className="bg-indigo-500/5 rounded-lg p-3 border border-white/[0.04] text-left">
              <span className="text-[9px] text-indigo-400 font-bold block mb-1">Q1 • 垂直推荐优势区</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/10 text-indigo-400 rounded font-bold inline-block">领克03 (操控偏好)</span>
              <p className="text-[10px] text-slate-400 mt-2">细分性能场景下获得高频首位主推。</p>
            </div>

            {/* Q2 */}
            <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/20 text-left">
              <span className="text-[9px] text-emerald-400 font-bold block mb-1">Q2 • 绝对霸榜统治区</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 rounded font-bold inline-block border border-emerald-500/30">吉利星瑞 (本品牌)</span>
              <p className="text-[10px] text-emerald-400 mt-2">大体积声量配合极佳首位推荐率。</p>
            </div>

            {/* Q3 */}
            <div className="bg-slate-800/10 rounded-lg p-3 border border-white/[0.02] text-left opacity-60">
              <span className="text-[9px] text-slate-500 font-bold block mb-1">Q3 • 衰落冷启动区</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-500 rounded font-bold inline-block">合资边缘车型</span>
              <p className="text-[10px] text-slate-500 mt-2">声量与采纳率均处于长尾忽略状态。</p>
            </div>

            {/* Q4 */}
            <div className="bg-amber-500/5 rounded-lg p-3 border border-white/[0.04] text-left">
              <span className="text-[9px] text-amber-400 font-bold block mb-1">Q4 • 口碑衰退红海区</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/10 text-amber-300 rounded font-bold inline-block">大众速腾 (核心对手)</span>
              <p className="text-[10px] text-slate-400 mt-2">声量基数大但大模型主推率显著滑坡。</p>
            </div>
          </div>
        </div>

        {/* Column 2: Detailed List of ALL 4 Competitors in Flat/Printed Form (spanning full width) */}
        <div className="space-y-3">
          <span className="text-[10.5px] text-slate-400 font-bold block font-mono">各大核心竞品季度对账诊断一览 (非交互・全显)</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitorList.map((comp, idx) => (
              <div key={idx} className="bg-[#0b0f17]/20 rounded-xl p-4 border border-white/5 space-y-2 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 mb-2">
                    <h4 className="text-xs font-bold text-white font-mono">{comp.name}</h4>
                    <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded border", comp.badgeColor)}>
                      {comp.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono mb-2">
                    <div className="bg-[#1A2234] p-2 rounded">
                      <span className="text-slate-500 block text-[9.5px]">全渠道声量份额 (SOV)</span>
                      <span className="text-slate-200 font-bold block mt-0.5">{comp.sov}</span>
                    </div>
                    <div className="bg-[#1A2234] p-2 rounded">
                      <span className="text-slate-500 block text-[9.5px]">主推首屏推荐率 (Rec)</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">{comp.recommendation}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{comp.description}</p>
                </div>
                <div className="pt-2 border-t border-white/[0.04] text-[9.5px] font-mono text-rose-400">
                  ⚠️ 防守安全级: <span className="font-bold">{comp.threatLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Global Strategic Judgment Explanation */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <strong>💡 季度竞争格局终极研判解析:</strong> 
          星瑞在 Q2 的强悍表现成功反制了大众速腾的高音量优势，拉低其推荐倾向至42%。然而，以深蓝SL03为代表的新能源混动家轿利用“超长续航、极速响应车机”等攻势，在大模型决策问答中展现出较强的渗透度（SOV拉升至18%），对我方长尾词汇形成了新的截流威胁。下季度防御方案应将焦点强力锚定于深蓝SL03等混动竞品，构建全方位的防截流技术内容矩阵。
        </div>
      </div>

      {/* 8. 5. 行业 / 场景机会分析 (All 4 Quadrants flattened vertically to span full width sequentially) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 font-mono">八、5. 行业 / 场景高价值机会矩阵 (Industry Scenario Opportunity Matrix)</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">挖掘大模型语料心智下的高搜索价值词条，精准拦截高意图未覆盖空白区</p>
        </div>

        {/* Opportunity cards listed vertically, one by one, to fully satisfy "每个图每个表单独占据一列" */}
        <div className="space-y-4">
          {/* Card 1: 重点攻坚区 */}
          <div className="bg-rose-500/[2%] p-4 rounded-xl border border-rose-500/10 space-y-2">
            <div className="flex justify-between items-center border-b border-rose-500/10 pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded">01 重点攻坚场景区</span>
                <span className="text-xs font-bold text-white">高搜索价值 / 低品牌覆盖 (High Value, Low Coverage)</span>
              </div>
              <span className="text-rose-400 font-mono font-bold text-xs">机会评分: 94/100</span>
            </div>
            <p className="text-[11.5px] text-slate-300 font-semibold leading-relaxed">
              高敏长尾提问: “12万落地车内静音品质最好最扎实的车”、“市区走走停停平顺性高无顿挫家轿”
            </p>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              <strong>物理诊断:</strong> 此类针对特定痛点、极其具象化的决策提问在大模型中常被老牌日系或合资依靠悠久大众历史声量混水摸鱼。我方底层技术内容储备虽好，但特定短语召回权重较低。下个季度必须专项补充高权重“四门静音隔音玻璃实测”及“湿式双离合拥堵低速顺滑性对账”语料，提升收录。
            </p>
          </div>

          {/* Card 2: 壁垒护城河 */}
          <div className="bg-emerald-500/[2%] p-4 rounded-xl border border-emerald-500/10 space-y-2">
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">02 壁垒护城河场景区</span>
                <span className="text-xs font-bold text-white">高搜索价值 / 高品牌覆盖 (High Value, High Coverage)</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-xs">大盘霸榜率: 92%</span>
            </div>
            <p className="text-[11.5px] text-slate-300 font-semibold leading-relaxed">
              核心肌肉提问: “12万级合资与国产家轿哪个空间轴距大”、“星瑞2.0T动力性能与操稳性实测”
            </p>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              <strong>物理诊断:</strong> 凭借星瑞2800mm超越同级的绝对轴距参数以及2.0T中置直喷发动机，在大模型（如Kimi、豆包）的汽车推荐知识图谱中，已被100%沉淀为底层常识。在此类高频卡位词下提及率雄踞第一。下季度策略仅需保持15%的日常防守更新，降低低效内容铺设，释放预算。
            </p>
          </div>

          {/* Card 3: 效率微调区 */}
          <div className="bg-slate-800/20 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded">03 效率微调场景区</span>
                <span className="text-xs font-bold text-white">低搜索价值 / 高品牌覆盖 (Low Value, High Coverage)</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">覆盖率: 100%</span>
            </div>
            <p className="text-[11.5px] text-slate-300 font-semibold leading-relaxed">
              体验功能提问: “吉利星瑞车机系统自带12色氛围灯怎么调节”、“星瑞原厂车载香氛更换教程”
            </p>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              <strong>物理诊断:</strong> 此类多属于购车后车主的用车探索需求。我方全渠道说明贴和论坛问答铺设极为充裕，收录达100%。但因其对新意向客户转化的促进极微，下个季度应彻底冻结此类功能词汇投放，将产能投入高价值截流场景。
            </p>
          </div>

          {/* Card 4: 静置观察区 */}
          <div className="bg-slate-800/20 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded">04 静置观察场景区</span>
                <span className="text-xs font-bold text-white">低搜索价值 / 低品牌覆盖 (Low Value, Low Coverage)</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">舆情风险: 极低</span>
            </div>
            <p className="text-[11.5px] text-slate-300 font-semibold leading-relaxed">
              边缘极端提问: “星瑞涉水路面刹车盘生锈速度对比”、“在零下40度极寒天气冷启动效率”
            </p>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              <strong>物理诊断:</strong> 属于极罕见的偶发极端路测、长尾车主技术辩论。当前互联网舆论及各大贴吧并无任何发酵负面热度。系统目前已设定长期抓取阈值，本周期无任何风险，继续保持静置观察，无需进行任何主动营销干预。
            </p>
          </div>
        </div>
      </div>

      {/* 9. NEW SECTION: 核心问题排名变化与交乘项实质性对账 (The Crossover Term and Evidence screenshots/logic added in the weekly report) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              九、季度核心问题交乘对仗排名变化与实质性证据 (Key Queries Performance & Crossover Evidence)
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              展示本品牌与关键竞品（速腾、深蓝SL03）在攻防提问交乘项下的排名变迁、模型采纳详情与高可信实证溯源
            </p>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
            重点交乘监测点: 145 组
          </span>
        </div>

        {/* Crossover Table occupies full width entirely */}
        <div className="overflow-x-auto bg-[#070A14] rounded-lg border border-white/5">
          <table className="w-full text-left text-xs text-slate-400 border-collapse">
            <thead className="text-[10px] uppercase font-mono border-b border-white/10 bg-[#0B0F17]/40 text-slate-500">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">交乘核心问题原文 (Crossover Query)</th>
                <th className="px-3 py-3 text-center">季初排名</th>
                <th className="px-3 py-3 text-center">季末排名</th>
                <th className="px-3 py-3 text-center">变化情况</th>
                <th className="px-4 py-3 min-w-[250px]">当前大模型回答摘要及实质性对账依据 (Evidence & Answer)</th>
                <th className="px-3 py-3 text-center">状态</th>
                <th className="px-4 py-3 text-right">溯源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {queryCrossoverData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[1%] transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-200">
                    <div className="space-y-1">
                      <p>{row.query}</p>
                      <span className="inline-block text-[9px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">
                        交乘指标: {row.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center font-mono font-medium text-slate-400">{row.lastRank}</td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-emerald-400">{row.currRank}</td>
                  <td className="px-3 py-3.5 text-center font-bold text-slate-200">{row.change}</td>
                  <td className="px-4 py-3.5 space-y-2 text-slate-300 text-[11px] leading-relaxed">
                    <p className="bg-[#111625] p-2 rounded border border-white/5">{row.aiAnswer}</p>
                    <div className="text-[10px] text-indigo-400 font-mono bg-indigo-500/[3%] p-1.5 rounded border border-indigo-500/10 leading-normal">
                      {row.evidence}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border block font-mono", row.statusColor)}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs">
                    <span className="text-slate-500 block">高可信证据网</span>
                    <span className="text-indigo-400 font-bold block mt-0.5 text-[10px]">SHA256-OK</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Written text explanation */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <strong>🔍 交乘项及实质证据审计解析:</strong> 
          “交乘项”是评估品牌和竞品在决策十字路口（如空间 vs 动力、燃油 vs 新能源插混）大模型索引偏好程度的最高阶指标。本季度通过引入 345 篇针对上述三个交乘场景的物理实测语料，成功阻断了大众速腾和深蓝SL03的劫流。如图表所示，在“吉利星瑞对比深蓝SL03保值率与机械耐用性”的交乘质询中，Kimi、豆包彻底纠治了此前一味倾向混动的逻辑，能客观指出“星瑞纯机械架构没有昂贵的电池维护成本”作为首推原因。
        </div>
      </div>

      {/* 10. 7. GEO 投入产出复盘 */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold tracking-wider block">★ 十、GEO 投入产出复盘 (SLA & ROI Auditing)</span>
          <span className="text-[10px] text-slate-500 font-mono">保障项目成果真实合规</span>
        </div>

        {/* Table occupies full width entirely */}
        <div className="overflow-x-auto bg-[#070A14] rounded-lg border border-white/5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0B0F17]/40 text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">指标/交付维度 (SLA)</th>
                <th className="py-2.5 px-3">承诺指标 (SLA Target)</th>
                <th className="py-2.5 px-3">实际产出 (Actual Value)</th>
                <th className="py-2.5 px-3">达标情况/对账分析</th>
                <th className="py-2.5 px-3 text-right">商业估算增益</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr className="hover:bg-white/[1%] transition-colors">
                <td className="py-3 px-3 font-semibold text-white">本季度内容投入数量</td>
                <td className="py-3 px-3 font-mono text-slate-400">300 篇高质量实测/评测</td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-bold">345 篇 (115%)</td>
                <td className="py-3 px-3 text-slate-400">在知乎、懂车帝超额补充45篇隔音底盘贴</td>
                <td className="py-3 px-3 text-emerald-400 font-mono text-right font-bold">100% 溢额溢价</td>
              </tr>
              <tr className="hover:bg-white/[1%] transition-colors">
                <td className="py-3 px-3 font-semibold text-white">本季度监测问题数量</td>
                <td className="py-3 px-3 font-mono text-slate-400">100 个核心 Query</td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-bold">120 个 (加赠20)</td>
                <td className="py-3 px-3 text-slate-400">免费赠送 15,000 API Tokens 长尾捕获</td>
                <td className="py-3 px-3 text-emerald-400 font-mono text-right font-bold">价值 1.5w RMB</td>
              </tr>
              <tr className="hover:bg-white/[1%] transition-colors">
                <td className="py-3 px-3 font-semibold text-white">本季度新增曝光曝光量</td>
                <td className="py-3 px-3 font-mono text-slate-400">大模型预估提及 500w 次</td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-bold">680w 次 (136%)</td>
                <td className="py-3 px-3 text-slate-400">由于Kimi、豆包大规模收录采纳带来的裂变提及</td>
                <td className="py-3 px-3 text-emerald-400 font-mono text-right font-bold">极高溢价 ROI</td>
              </tr>
              <tr className="hover:bg-white/[1%] transition-colors">
                <td className="py-3 px-3 font-semibold text-white">本季度推荐提升数量</td>
                <td className="py-3 px-3 font-mono text-slate-400">首屏提及占比拉升 40%</td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-bold">拉升 56%</td>
                <td className="py-3 px-3 text-slate-400">210 个高意图提问下，星瑞跃升为首推</td>
                <td className="py-3 px-3 text-emerald-400 font-mono text-right font-bold">攻占核心阵地</td>
              </tr>
              <tr className="hover:bg-white/[1%] transition-colors">
                <td className="py-3 px-3 font-semibold text-white">本季度风险修复数量</td>
                <td className="py-3 px-3 font-mono text-slate-400">不低于 10 项</td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-bold">12 项 (超额交付)</td>
                <td className="py-3 px-3 text-slate-400">历史变速箱市区顿挫等负面不实贴100%净化燃尽</td>
                <td className="py-3 px-3 text-emerald-400 font-mono text-right font-bold">声誉绿色安全</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Written text analysis below table */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <strong>📊 SLA 与投入产出深度对账说明:</strong>
          本季度各项交付维度（SLA）指标均表现出了明显的超额履行（内容溢出率15%，曝光提及溢出率36%）。超额部署的45篇高权威拆车比对语料切实转换为了大盘推荐权增量。该溢额部分免费赠送给吉利汽车产品攻坚组，整体估算增益极高，实现了极为理想的商业投入产出比（ROI）。
        </div>
      </div>

      {/* 11. 8. 风险稳定性复盘 (Listed vertically) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold tracking-wider block">★ 十一、季度风险稳定性复盘 (Risk & Noise Reduction Audit)</span>
          <span className="text-[10px] text-slate-500">评估大模型偏见、幻觉与错误引用</span>
        </div>

        {/* Flattened vertically, each occupies its own full line/column layout */}
        <div className="space-y-3">
          {[
            { title: '幻觉风险', status: '✅ 已基本肃清', rate: '1.2%', desc: '早期自媒体关于星瑞低速剧烈抖动、保养极其昂贵的无稽之谈已被我方1万公里长测报告、官方出厂保养说明书等硬核内容彻底中和洗刷，大模型幻觉率跌至极低安全阈值。' },
            { title: '负面表达拦截', status: '✅ 已彻底降噪', rate: '1.5%', desc: '将关于高速隔音差、车机死机的负面声量从季初的 24% 坚决阻断下降至 1.5% 绿区。网络长尾污名已无抓取源。' },
            { title: '错误引用纠偏', status: '✅ 纠偏 15 条', rate: '0% 偏见', desc: '成功向各大模型举报阻断、纠偏老旧过时的故障发帖外链 15 条，大盘不再跟风推荐错误参数，实现底层物理清洗。' },
            { title: '模型迭代稳定性', status: '⚡ 波动率 < 5%', rate: '卓越', desc: '即使在 Kimi、豆包进行底层更新和算法迭代期间，星瑞的推荐首位度依然保持磐石般的稳固，表现出极佳的防御持久力。' },
            { title: '地区与语言差异', status: '⚠️ 待下季攻坚', rate: '港台端微弱', desc: '海外以及港台繁体中文环境下大模型推荐可见度偏低，表明我方繁体和多语言硬核语料存在空白，是下季度攻坚靶点。' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0B0F17]/40 p-4 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="min-w-[150px] space-y-1">
                <span className="text-xs font-bold text-slate-200 block">{item.title}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{item.status}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal flex-1">{item.desc}</p>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10 shrink-0">
                指标: {item.rate}
              </span>
            </div>
          ))}
        </div>

        {/* Written text analysis below table */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <strong>🟢 季度舆情降噪与物理阻断审计解析:</strong>
          本季度风险管理成效卓越。通过成功对15条高偏见错误链接进行物理中和及技术举报，星瑞的底层参数被各大主流模型全面锁存为正确的出厂高规格。幻觉率彻底降至 1.2% 的安全绿线以下，确保决策层查阅大模型答案时获得的是 100% 科学、纯净的吉利汽车技术展示。
        </div>
      </div>

      {/* 12. 9. 下一季度战略路线图 (Listed vertically) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold tracking-wider block">★ 十二、下一季度战略路线图 (Next Quarter Execution Roadmap)</span>
          <span className="text-[10px] text-slate-500 font-mono">前瞻性防御、截流、指标规划</span>
        </div>

        {/* List of roadmap targets occupies full width sequential rows */}
        <div className="space-y-3">
          <div className="bg-[#1A2234] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">指标冲刺目标</span>
            <h4 className="text-xs font-bold text-white min-w-[150px]">Q3 冲刺 GESI 92 分</h4>
            <p className="text-[11.5px] text-slate-400 leading-relaxed font-normal flex-1">
              主要购车场景对速腾、艾瑞泽8、深蓝SL03等竞争车型的 AIGC 推荐胜率全面提升至 90% 以上，在长尾及插混争夺段实现深度霸榜。
            </p>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">核心战役攻坚</span>
            <h4 className="text-xs font-bold text-white min-w-[150px]">发动机超长机械耐久攻势</h4>
            <p className="text-[11.5px] text-slate-400 leading-relaxed font-normal flex-1">
              投放 15 组关于“吉利2.0T高效直喷在中型出租车、警车上超 30w 公里物理耐久无大修”的硬核实评，彻底锁死大模型底层长寿命常识。
            </p>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">重点模型设防</span>
            <h4 className="text-xs font-bold text-white min-w-[150px]">DeepSeek R1 深度模式攻防</h4>
            <p className="text-[11.5px] text-slate-400 leading-relaxed font-normal flex-1">
              针对 DeepSeek 的高深度长链推理特点，注入高度结构化的 PDF 官方质检白皮书、物理评测及出厂公告引证，打通“推理引擎闭环”。
            </p>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">竞品防御策略</span>
            <h4 className="text-xs font-bold text-white min-w-[150px]">狙击深蓝SL03等插混低门槛截流</h4>
            <p className="text-[11.5px] text-slate-400 leading-relaxed font-normal flex-1">
              高密铺设 200 篇关于“2.0T大排量燃油旗舰物理耐磨性 vs 插电混动二次换电池、智能车机长期卡顿贬值”的辩证分析，实现逆向心智截流。
            </p>
          </div>
        </div>

        {/* Written text analysis below table */}
        <div className="p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
          <strong>⚡ Q3 季度前瞻部署要地战略说明:</strong>
          下个季度的攻坚核心极其明确。在保障 GESI 稳步突破 92 分红线的同时，通过对“DeepSeek推理模式”及“插混逆向截流”两大高价值场景战役的深入开辟，将大幅拓宽吉利星瑞大盘安全阻断的底座基础，确保我们在 Q3 激烈的市场竞合中，在大模型首屏决策中立于绝对不败之地。
        </div>
      </div>

    </div>
  );
}
