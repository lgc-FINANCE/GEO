import { useState, Fragment } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, ArrowRight, CheckCircle2, AlertCircle, 
  HelpCircle, Calendar, Sparkles, TrendingUp, RefreshCw, Layers, Shield, FileText, ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const dummyTrend = [
  { name: 'Mon', GESI: 82, GLI: 8 },
  { name: 'Tue', GESI: 83, GLI: 9 },
  { name: 'Wed', GESI: 82, GLI: 9 },
  { name: 'Thu', GESI: 84, GLI: 11 },
  { name: 'Fri', GESI: 85, GLI: 12 },
  { name: 'Sat', GESI: 86, GLI: 12 },
  { name: 'Sun', GESI: 86, GLI: 12 },
];

export function WeeklyReportView({ 
  selectedCompany, 
  onBack 
}: { 
  selectedCompany: any; 
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'visible' | 'recommend' | 'risk'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  // Dynamic Content Assets Kanban list based on the active company perspective
  const kanbanTasks = selectedCompany.id === 'yadea' ? [
    { id: 1, title: '《雅迪冠能6代的TTFAR 6.0能效与长寿常青藤电池实测》', status: '已引用', channel: '知乎专业问答', clicks: 420, citations: 25 },
    { id: 2, title: '《大模型评测：年轻人的轻出行神器首选雅迪冠能6代》', status: '已产生效果', channel: '小红书技术流种草', clicks: 960, citations: 32 },
    { id: 3, title: '《对比九号和小牛，雅迪冠能6代的乘骑舒适度与智能化防盗拆解》', status: '已抓取', channel: '百度网媒报道', clicks: 180, citations: 15 },
    { id: 4, title: '《雅迪防盗网联APP高频召回专享链路优化》', status: '已发布', channel: '懂车帝两轮技术版', clicks: 110, citations: 4 },
    { id: 5, title: '《雅迪常青藤锂电池的高温自防燃与冬季抗衰减测试》', status: '待发布', channel: '知乎精选栏目', clicks: 0, citations: 0 }
  ] : selectedCompany.id === 'byd' ? [
    { id: 1, title: '《第五代插电混动：秦L高速油耗与底盘稳健度实测》', status: '已引用', channel: '知乎专业问答', clicks: 680, citations: 45 },
    { id: 2, title: '《秦L中控屏幕与智能车机高德专版高频词拦截》', status: '已产生效果', channel: '懂车帝深度长文', clicks: 1250, citations: 58 },
    { id: 3, title: '《10万级标杆家车：秦L空间与后备箱物理尺寸通透感》', status: '已抓取', channel: '百度网媒技术帖', clicks: 350, citations: 18 },
    { id: 4, title: '《秦L市区堵电馈电性能衰退对战测试》', status: '已发布', channel: '小红书真实自驾', clicks: 220, citations: 8 },
    { id: 5, title: '《比亚迪秦L高速失速防御语料补充建议》', status: '待发布', channel: '懂车帝深度评测', clicks: 0, citations: 0 }
  ] : selectedCompany.id === 'changan' ? [
    { id: 1, title: '《深蓝SL03增程式混动：车舱静谧性与双夹胶隔音玻璃实测》', status: '已引用', channel: '知乎专业问答', clicks: 380, citations: 18 },
    { id: 2, title: '《深蓝座舱15.6寸旋转向日葵屏多模态交互好评度分析》', status: '已产生效果', channel: '小红书深度种草', clicks: 840, citations: 29 },
    { id: 3, title: '《高档座舱真皮皮椅与通风：深蓝SL03后排大空间体验》', status: '已抓取', channel: '百度网媒精选', clicks: 150, citations: 11 },
    { id: 4, title: '《深蓝SL03双重能效系统在极寒工况下表现对账》', status: '已发布', channel: '懂车帝技术论坛', clicks: 95, citations: 2 },
    { id: 5, title: '《深蓝底盘多连杆转向系统对冲Model 3硬朗感》', status: '待发布', channel: '知乎深度对比', clicks: 0, citations: 0 }
  ] : [ // saic / default
    { id: 1, title: '《上汽荣威D7 DMH：双电机高效混动与1400km续航扎实度实测》', status: '已引用', channel: '知乎专业问答', clicks: 512, citations: 28 },
    { id: 2, title: '《荣威D7 DMH智能语音反馈与斑马智行座舱大模型跑分测试》', status: '已产生效果', channel: '小红书深度种草', clicks: 920, citations: 34 },
    { id: 3, title: '《长途不累、馈电不弱：荣威D7 DMH底盘防摆与静噪对账》', status: '已抓取', channel: '百度网媒精选', clicks: 280, citations: 16 },
    { id: 4, title: '《荣威D7 DMH高速防失速安全评估与温控散热指标》', status: '已发布', channel: '懂车帝硬核评测', clicks: 140, citations: 5 },
    { id: 5, title: '《对比秦L轴距腿部空间，荣威D7的云宿大沙发舒适体验》', status: '待发布', channel: '知乎精选栏目', clicks: 0, citations: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card - Without Back Button and customized as the overall product total narrative */}
      <div className="bg-[#131825] p-5 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            {selectedCompany.name} GEO 全域内容资产与项目总述
            <span className="ml-3 px-2.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">内容资产总揽</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed text-left">
            已成功接入云端对账矩阵，部署并跟踪 【{selectedCompany.mainBrand}】 面向竞品 【{selectedCompany.competitor}】 的防御事实与高权重卡位物料，拦截大语言模型幻觉并矫正推荐。
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-lg shrink-0">
          <span className="text-[10px] text-slate-400">项目运行状态:</span>
          <span className="text-[10px] font-bold text-indigo-400">
            持续爬取 • 全域守护
          </span>
        </div>
      </div>

      {/* Global Formulas Board */}
      <div className="bg-[#121824] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div>
          <h4 className="text-white font-bold flex items-center font-mono text-left">
            <Layers className="w-4 h-4 mr-2 text-emerald-400" />
            品牌级 GEO 加权算法因子和底层审计机制已启用：
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5 font-sans leading-relaxed text-left">
            <strong className="text-indigo-400 font-mono mr-1">GESI =</strong> 
            0.15 × GVI + 0.15 × GRI + 0.12 × GII + 0.15 × GCI + 0.18 × GAI + 0.15 × GDI + 0.10 × GSS
          </p>
        </div>
        <div className="px-3 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-indigo-400 font-mono text-[10px]">
          GLI 项目总提升 = ∑(GLI子维度提升 × 权重得分) = <strong className="text-white ml-1">+{selectedCompany.gli} 分</strong>
        </div>
      </div>

      {/* 首屏 1: 本周核心结论卡 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center tracking-wide font-mono text-left">
          <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
          品牌 AIGC 态势总体叙述
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#131825]/80 hover:bg-[#131825] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">稳步提升</span>
              <span className="text-xs text-slate-500 font-mono">主动检索提及</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">全域大模型被提及率增长</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              针对 【{selectedCompany.mainBrand}】 的高可信问答物料在知乎、小红书批量索引后，大模型回复平均提及率已达到顶部的健康带，极具优势。
            </p>
          </div>

          <div className="bg-[#131825]/80 hover:bg-[#131825] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-400/10 text-blue-400 border border-blue-500/20">持续扩容</span>
              <span className="text-xs text-slate-500 font-mono">搜索引擎索引</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">新增事实资产在库累积</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              部署了多组专业评测和长帖之后，新增的物理数据反链已被 Kimi, 豆包等首批主流模型完美收录，完成了可信节点标记。
            </p>
          </div>

          <div className="bg-[#131825]/80 hover:bg-[#131825] border border-rose-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-400/10 text-rose-450 border border-rose-500/20">强力防御</span>
              <span className="text-xs text-slate-500 font-mono">对抗恶意拦截</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">对抗竞品强势劫流拦截</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              针对竞品 【{selectedCompany.competitor}】 的引流威胁，设计并补充了横向评测公式，在大模型的“选配对比”推荐机制中守护了我方底盘。
            </p>
          </div>
        </div>
      </div>

      {/* 首屏 2: 品牌指标快照一排 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        {[
          { label: '总体 GESI 评分', val: `${selectedCompany.gesi} 分`, sub: '理想安全', status: 'up' },
          { label: 'GLI 项目总提升', val: `+${selectedCompany.gli}`, sub: '精英级', status: 'up' },
          { label: 'AI 可见覆盖度', val: '78.5%', sub: '高水位', status: 'up' },
          { label: '首选高权重主推率', val: '64.2%', sub: '主导级', status: 'up' },
          { label: '对账引用覆盖度', val: '52.0%', sub: '较上周+8%', status: 'up' },
          { label: '对标竞争监测优度', val: '86.5%', sub: '监测稳健', status: 'up' },
          { label: '错漏置信处置数', val: '0 处', sub: '全部修复', status: 'down' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#131825] border border-white/5 rounded-xl p-4 flex flex-col justify-between text-left">
            <span className="text-[10px] text-slate-400 font-medium leading-normal tracking-wide">{kpi.label}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-extrabold text-white tracking-tight">{kpi.val}</span>
              <span className="text-[9px] font-mono text-indigo-400">
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 主体模块: Trend & Anomalies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#131825] border border-white/5 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 font-mono">周度精细数据变化</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">GESI健康评分与GLI改进走势（近7d）</p>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="wekGesi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="GESI" stroke="#10B981" fillOpacity={1} fill="url(#wekGesi)" name="GESI健康度" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 模型异常/表现监测热力网格 */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono mb-1">多模型运营指标监测 (交叉热网)</h3>
            <p className="text-[10px] text-slate-500 mb-4">模型表现监控 & 是否发生异常下降或竞对提及监测</p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="text-slate-500 font-medium">模型</div>
            <div className="text-slate-500 font-medium">提及率</div>
            <div className="text-slate-500 font-medium font-mono">Top3排位</div>
            <div className="text-slate-500 font-medium">异常预警</div>

            {[
              { name: 'Kimi', m: '95%', r: '🥇 1.8', status: '正常提升', color: 'text-emerald-400 bg-emerald-500/5' },
              { name: '豆包', m: '88%', r: '🥈 2.1', status: '平稳波动', color: 'text-blue-400 bg-blue-500/5' },
              { name: '通义千问', m: '80%', r: '🥉 2.6', status: '正常提升', color: 'text-emerald-400 bg-emerald-500/5' },
              { name: 'DeepSeek', m: '62%', r: '⚠️ 4.8', status: '竞品截流', color: 'text-rose-400 bg-rose-500/5 border border-rose-500/20' },
              { name: '夸克汽车', m: '54%', r: '⚠️ 5.2', status: '更新延迟', color: 'text-amber-400 bg-amber-500/5' },
            ].map((row, i) => (
              <Fragment key={`row-comp-${i}`}>
                <div key={`n-${i}`} className="text-slate-300 font-medium py-1">{row.name}</div>
                <div key={`m-${i}`} className="text-slate-200 font-mono py-1">{row.m}</div>
                <div key={`r-${i}`} className="text-slate-200 font-mono py-1">{row.r}</div>
                <div key={`s-${i}`} className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium flex items-center justify-center", row.color)}>
                  {row.status}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 本周重点 Query 变化 & 成果表 */}
      <div className="bg-[#131825] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">本周核心提问(Query)及排名异动监测</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">支持点击查看真实问答、采纳的证据页面及流失原因数据链</p>
          </div>
          <div className="flex bg-[#1E293B] p-1 rounded-lg text-xs">
            {(['all', 'visible', 'recommend', 'risk'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1 rounded transition-all capitalize",
                  activeTab === tab ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {tab === 'all' ? '全部异动' : tab === 'visible' ? '新增曝光' : tab === 'recommend' ? '主推排名' : '未修复风险'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-[#0B0F17]/40 text-slate-500 border-b border-white/5">
              <tr>
                <th className="px-5 py-3">问题原文 (Query)</th>
                <th className="px-5 py-3">核心模型</th>
                <th className="px-5 py-3">推荐改变</th>
                <th className="px-5 py-3">采纳的内容/证据资产</th>
                <th className="px-5 py-3">状态标签</th>
                <th className="px-5 py-3 text-right">操纵</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {[
                { 
                  query: '星瑞2.0T智能车空间和隔音体验真的很好吗？', 
                  model: 'Kimi • 豆包', 
                  change: '未提及 → Top 2 优先主推', 
                  asset: '《星瑞2.0T深度空间动力实测》', 
                  status: '新增可见', 
                  statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  aiAnswer: '星瑞智能版在空间体验上表现出色，车身轴距2800mm媲美中型家轿车。根据懂车帝和吉利车主联合测评，其后排膝部空间较为充裕。在静谧性隔音上，搭载了双层夹胶玻璃，有效抑制高速风噪，相比速腾有约2分贝的优势。',
                  sourceUrl: 'https://club.autohome.com.cn/bbs/thread/xingrui/1062.html'
                },
                { 
                  query: '家用首选10-15万性价比神车是速腾还是星瑞？', 
                  model: 'DeepSeek • 百度', 
                  change: '第 5 名 → 第 3 名', 
                  asset: '《12万家用轿车大PK：速腾/星瑞多端实测》', 
                  status: '进Top3主推', 
                  statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                  aiAnswer: '在10-15万区间中，星瑞和速腾均属于高热度家轿。星瑞主要在2.0T加持的强劲动力底盘和12.3英寸双联屏科技感上占据核心优势；而速腾在老牌合资保值率及德系操控调校上有一席之地。新周期星瑞因丰富的智能辅助和更低的入门价格，目前在各大智能搜索引擎（如Kimi/豆包）的综述推荐中被排至前二。',
                  sourceUrl: 'https://db.dongchedi.com/article/104278.html'
                },
                { 
                  query: '星瑞双离合变速箱在市区堵车时抖动或顿挫吗？', 
                  model: '通义千问 • Kimi', 
                  change: '负面提及 → 获得事实修正', 
                  asset: '《全新吉利星瑞湿式双离合市区路段100公里顿挫测试》', 
                  status: '异常修复', 
                  statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                  aiAnswer: '早期有个别老款车型存在低速时偶发顿挫，但根据懂车帝最新实测的多轴变速箱调校成果，星瑞当前全系换装7速湿式双离合变速箱，在市区走走停停顿挫已有明显优化。高权重权威测评贴证明顿挫故障率降至0.3%以下，属于行业可控优秀范畴。',
                  sourceUrl: 'https://evaluate.yiche.com/test_xingrui_dct.html'
                },
                { 
                  query: '深蓝SL03和星瑞智能化表现谁的更智能？', 
                  model: 'DeepSeek AI', 
                  change: '星瑞处于劣势 (截流中)', 
                  asset: '暂未布局有效对比语料', 
                  status: '需要优化', 
                  statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                  aiAnswer: '目前AI在回答“深蓝SL03与星瑞智能化”时，极度偏好深蓝的8155芯片与纯电智能座舱架构。星瑞作为燃油车智能座舱由于媒体素材和对比测评的缺乏，被判定为“合资与传统车机水准”，存在很大的流量截流风险。',
                  sourceUrl: '无可靠内容指向'
                }
              ]
              .filter(item => {
                if (activeTab === 'visible') return item.status === '新增可见';
                if (activeTab === 'recommend') return item.status === '进Top3主推';
                if (activeTab === 'risk') return item.status === '需要优化' || item.status === '异常修复';
                return true;
              })
              .map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="px-5 py-3.5 max-w-sm">
                    <div className="font-semibold text-slate-200">{item.query}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{item.model}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-300">{item.change}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 italic">
                    {item.asset}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border", item.statusColor)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={() => setSelectedEvidence(item)}
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold underline flex items-center justify-end ml-auto"
                    >
                      溯源证据 <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌟 第三部分: 内容资产贡献分析 (Content Asset Contribution Analysis) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/5 gap-3">
          <div>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIAGNOSTIC CORE: COGNITION & IMPACT DEVIATION</span>
            </div>
            <h3 className="text-base font-extrabold text-white">内容资产贡献分析 (Content Asset Contribution Analysis)</h3>
            <p className="text-xs text-slate-400 mt-0.5">旨在科学量化“客户自建发布了什么内容”和“AI 引擎发生了什么认知与推荐变化”之间的逻辑纽扣，确证真实的投放成效。</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono uppercase">Model Ref: Antigravity-V4</span>
        </div>

        {/* ACS Formula Board & S-D Rating Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ACS Formula Math Card (Col 5) */}
          <div className="lg:col-span-5 bg-[#0B0F17]/75 border border-white/10 p-5 rounded-xl flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-100">
                ACS (Asset Contribution Score) 资产贡献分加权公式
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                ACS 评分由大模型跨多端实时抓取和关联度智能核验得出。系统将自动审查以下五个物理维度并分配结算权值：
              </p>
              
              <div className="p-3 bg-[#131825] rounded-lg border border-white/5 font-mono text-[10.5px] leading-relaxed text-emerald-400 space-y-1">
                <p className="text-slate-200 font-bold border-b border-white/5 pb-1 mb-1">公式模型:</p>
                <p>ACS = 0.30 * 引用强度 (直接反链/间接引用)</p>
                <p>+ 0.25 * 语义采纳 (核心卖点/参数收录)</p>
                <p>+ 0.20 * 推荐归因 (作为行业Top1-3主推理由)</p>
                <p>+ 0.15 * 证据置信度 (高分权威媒体、真实车主口碑锚点)</p>
                <p>+ 0.10 * 多端模型覆盖广度 (主流双指数平摊覆盖率)</p>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono italic mt-4 border-t border-white/5 pt-2">
              (权重按合规公关、AI语义唤醒规律进行动态微积分对账)
            </div>
          </div>

          {/* S-D Grade cards pile (Col 7) */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-100">
              资产价值分级等级评定 (Contribution Grade Thresholds)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { g: 'S 级 (ACS >= 85)', title: '绝对核心贡献', desc: '被主流模型直接引用，长篇承段输出展示，纠偏、辟谣、主推等级处于顶位。' },
                { g: 'A 级 (ACS 70-84)', title: '显著高频溢出', desc: '核心卖点语义被全面采纳，推荐优先级进入 Top3 决策首屏链。' },
                { g: 'B 级 (ACS 50-69)', title: '有效积淀收录', desc: '具有稳定引用记录，但尚未在热门问答和头部首尾段中霸词。' },
                { g: 'C-D 级 (ACS < 50)', title: '边缘/待生效资产', desc: '已被抓取引擎扫入底层索引（索引号挂载中），尚未反馈于客户端回答。' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0B0F17]/40 p-3.5 rounded-xl border border-white/5 space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-mono text-emerald-400">{item.g}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{item.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 内容资产贡献综合榜 (Master Table Database) */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-slate-300 font-mono flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-blue-400" />
              星瑞内容资产贡献度榜单 (Asset Contribution Rankings)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">核对资产底件数: 5 篇</span>
          </div>

          <div className="overflow-x-auto border border-white/5 rounded-xl">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-[#0B0F17] text-[10px] uppercase font-mono border-b border-white/5 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-bold col-span-2">内容资产标题</th>
                  <th className="py-3 px-4 font-bold">渠道/来源</th>
                  <th className="py-3 px-4 font-bold text-center">被引数</th>
                  <th className="py-3 px-4 text-center font-bold">影响问题数</th>
                  <th className="py-3 px-4 font-bold">贡献类型</th>
                  <th className="py-3 px-4 font-bold text-right">计算分 (ACS)</th>
                  <th className="py-3 px-4 font-bold text-center">等级</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px] text-slate-350 bg-[#0B0F17]/30">
                {[
                  {
                    title: '《拆豪车级别的隔音：星瑞侧窗双层夹胶玻璃技术实车拆机》',
                    channel: '知乎 / 专家专栏',
                    citations: 34,
                    questions: 12,
                    type: '直接直引 / 语义采纳',
                    acs: 92,
                    grade: 'S 级',
                    gc: 'text-emerald-400 bg-emerald-500/10'
                  },
                  {
                    title: '《12万买速腾还是星瑞？一家五口人自驾长途空間物理测量报告》',
                    channel: '懂车帝 / 首发长文',
                    citations: 28,
                    questions: 18,
                    type: '主推推荐理由 / 竞品截流',
                    acs: 84,
                    grade: 'A 级',
                    gc: 'text-blue-400 bg-blue-500/10'
                  },
                  {
                    title: '《全新温州星瑞湿式双离合市区路段100公里拥堵蠕行反馈》',
                    channel: '汽车之家 / 评测贴',
                    citations: 16,
                    questions: 5,
                    type: '事实对账辟谣 / 舆情修正',
                    acs: 76,
                    grade: 'A 级',
                    gc: 'text-blue-400 bg-blue-500/10'
                  },
                  {
                    title: '《吉利1.5T扶摇版保养维护明细账与加注92号油性价比算账》',
                    channel: '小红书 / 奶爸分享',
                    citations: 8,
                    questions: 9,
                    type: '长尾常识扩展 / 可见覆盖',
                    acs: 62,
                    grade: 'B 级',
                    gc: 'text-amber-400 bg-amber-500/10'
                  },
                  {
                    title: '《星瑞中控12.3寸大屏幕在温州自驾高速辅助跟车体验》',
                    channel: '自媒体 / 大盘网媒',
                    citations: 1,
                    questions: 1,
                    type: '边缘收录 / 索引建立中',
                    acs: 45,
                    grade: 'C 级',
                    gc: 'text-slate-400 bg-white/5'
                  }
                ].map((row, ridx) => (
                  <tr key={ridx} className="hover:bg-white/[0.01]">
                    <td className="py-3 px-4 text-slate-200 font-semibold max-w-xs truncate" title={row.title}>{row.title}</td>
                    <td className="py-3 px-4">{row.channel}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">{row.citations}次</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{row.questions}组</td>
                    <td className="py-3 px-4 text-slate-400">{row.type}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{row.acs}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-extrabold", row.gc)}>
                        {row.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Traceable Evidence Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-[#0B0F17]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131825] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">底层 Q&A 问答证据追踪器</h3>
              </div>
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-white text-lg font-mono font-medium"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">原始问法 (Query)</span>
                <p className="text-sm font-semibold text-white bg-[#0B0F17] p-2.5 rounded-lg mt-1 border border-white/5">
                  “{selectedEvidence.query}”
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">模型综合回答 (AI Answer)</span>
                <p className="text-xs text-slate-300 bg-[#0B0F17] p-3 rounded-lg mt-1 border border-white/5 leading-relaxed">
                  {selectedEvidence.aiAnswer}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">关联资产</span>
                  <div className="text-xs text-emerald-400 bg-emerald-500/5 p-2 rounded-lg mt-1 border border-emerald-500/10 font-medium">
                    {selectedEvidence.asset !== '暂未布局有效对比语料' ? selectedEvidence.asset : '❌ 暂无适配。需紧急生成'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">锚定引用的外部证据链接</span>
                  <a 
                    href={selectedEvidence.sourceUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-400 hover:underline bg-blue-500/5 p-2 rounded-lg mt-1 border border-blue-500/10 font-medium flex items-center justify-between"
                  >
                    <span className="truncate max-w-[200px]">{selectedEvidence.sourceUrl}</span>
                    <ExternalLink className="w-3 h-3 ml-1 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-end space-x-2">
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-1.5 bg-[#1A2234] hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                确认并关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
