import { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Layers, Sparkles, TrendingUp, Cpu, 
  MapPin, HelpCircle, Shield, Award, Landmark, TrendingDown, Clock, Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  LineChart, Line, AreaChart, Area
} from 'recharts';

const multiMonthData = [
  { month: '4月(基线期)', GESI: 58, GLI: 0, Competitor: 74 },
  { month: '5月(部署阶段)', GESI: 68, GLI: 10, Competitor: 75 },
  { month: '6月(优化采纳期)', GESI: 86, GLI: 28, Competitor: 72 },
];

const compareRadarData = [
  { item: 'GVI可见度', '基线(4月)': 45, '季末(6月)': 85 },
  { item: 'GRI推荐度', '基线(4月)': 38, '季末(6月)': 78 },
  { item: 'GII印象', '基线(4月)': 50, '季末(6月)': 82 },
  { item: 'GCI理解', '基线(4月)': 60, '季末(6月)': 92 },
  { item: 'GAI证据', '基线(4月)': 30, '季末(6月)': 74 },
  { item: 'GDI防守', '基线(4月)': 42, '季末(6月)': 68 },
  { item: 'GSS稳态', '基线(4月)': 52, '季末(6月)': 80 },
];

export function QuarterlyReportView({ onBack }: { onBack: () => void }) {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  const phases = [
    { num: 1, name: '基线诊断期 (Baseline)', date: 'W1-W3', desc: '建立星瑞AI声望大底，挖掘出双离合变速箱幻觉负面词条12项，提及率落后合资车35%。' },
    { num: 2, name: '多端内容投放期 (Deploy)', date: 'W4-W6', desc: '撰写投递高可信度实测、油耗攻略50余篇，在懂车帝、知乎等多端布局引流词。' },
    { num: 3, name: 'AI 采纳与观察期 (Observe)', date: 'W7-W9', desc: '观察到豆包、Kimi开始小范围爬取采纳，局部提及率从 42% 上拉至 58%。' },
    { num: 4, name: '排名推荐改善期 (Escalate)', date: 'W10-W12', desc: '大面积产生推荐排位跃迁，10余个核心决策问法冲进Top3排位，推荐主攻率提升 200%。' },
    { num: 5, name: '策略迭代审计期 (Audit)', date: 'W13', desc: '季度收官审核，锁定DeepSeek进行靶向反击，输出下季度整体战略方案。' }
  ];

  return (
    <div className="space-y-6">
      {/* Strategic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#131825] p-5 rounded-xl border border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 border border-white/5 transition-colors"
          >
            ← 返回交付中心
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              星瑞汽车 2026 Q2 战略级 AIGC 成果复盘季报
              <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AIGC SEO Quarter Strategic</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">决策专送: 首席营销官(CMO) / brand总监 | 代理商: 云端GEO团队</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-3.5 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-white/5 transition-all">
            下载全套印制PDF
          </button>
          <button className="flex items-center px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-all">
            申请续约及增购预算
          </button>
        </div>
      </div>

      {/* Global Formulas Board */}
      <div className="bg-[#121824] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div>
          <h4 className="text-white font-bold flex items-center font-mono">
            <Layers className="w-4 h-4 mr-2 text-emerald-400" />
            本季 GEO 加权算法物理公式对账审计已启用：
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5 font-sans leading-relaxed">
            <strong className="text-emerald-400 font-mono mr-1">GESI =</strong> 
            0.15 × GVI + 0.15 × GRI + 0.12 × GII + 0.15 × GCI + 0.18 × GAI + 0.15 × GDI + 0.10 × GSS
          </p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 font-mono text-[10px]">
          GLI 优化升幅 = ∑(GLI子维度提升 × 权重得分) = <strong className="text-white ml-1">+28 分</strong>
        </div>
      </div>

      {/* 首屏 1: 本季度极其震撼的3大战略结论 */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-slate-800/30 to-blue-500/10 p-6 rounded-2xl border border-emerald-500/15">
        <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center uppercase tracking-wide font-mono">
          <Sparkles className="w-5 h-5 mr-2" />
          本季度核心战略性判断
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs text-slate-300 leading-relaxed font-normal">
          <div className="bg-[#0b0f17]/60 p-4 rounded-xl border border-white/5">
            <span className="font-mono text-emerald-400 font-bold block mb-1">01 • 稳固进入推荐池</span>
            <p>星瑞整体AI声望正式突破 **健康领先 (A+)** 评级，从季度初的“极度被埋没”成功跃迁为 **多模型首选主推家轿** 序列。</p>
          </div>
          <div className="bg-[#0b0f17]/60 p-4 rounded-xl border border-white/5">
            <span className="font-mono text-blue-400 font-bold block mb-1">02 • 内容长效红利释出</span>
            <p>经懂车帝等渠道布局的 **可信自媒体资产** 表现出高达 90d 的长生命周期引用红利，对 GAI 贡献率高达 74%。</p>
          </div>
          <div className="bg-[#0b0f17]/60 p-4 rounded-xl border border-white/5">
            <span className="font-mono text-amber-400 font-bold block mb-1">03 • 竞争空档与红蓝博弈</span>
            <p>深蓝SL03与速腾的优势声量已被星瑞赶超，但我方在 **高阶闭源思维推荐下**（如 DeepSeek R1）的证据丰富度仍有缺口。</p>
          </div>
          <div className="bg-[#0b0f17]/60 p-4 rounded-xl border border-white/5">
            <span className="font-mono text-purple-400 font-bold block mb-1">04 • 下季度追加指引</span>
            <p>建议将月度监测 Query 规模扩容至 **500个**，并在长尾场景 and 智能车机性能两个空档赛道优先部署 200 个防守包围圈。</p>
          </div>
        </div>
      </div>

      {/* 首屏 2: 季度核心指标卡对比 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { l: '季初基线 GESI', v: '58', s: '正常偏弱', c: 'text-slate-400' },
          { l: '季末总分 GESI', v: '86', s: '🏆 A+ 强势主导', c: 'text-emerald-400' },
          { l: '季度平均升幅 GLI', v: '+28', s: 'GEO 优化效果显著', c: 'text-blue-400' },
          { l: '季度累计被提及提问', v: '1,424 个', s: '全网累计曝光', c: 'text-white' },
          { l: '季度内容产出及引用', v: '345 篇', s: '引用采纳率 32%', c: 'text-white' },
          { l: '竞品对比监测胜率', v: '82%', s: '速腾提及被压制', c: 'text-emerald-400' }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#131825] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide leading-none">{item.l}</span>
            <div className="mt-3">
              <span className={cn("text-xl font-extrabold tracking-tight", item.c)}>{item.v}</span>
              <span className="text-[10px] text-slate-500 block mt-1">{item.s}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. 跨季趋势 Area / Line + radar compare */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#131825] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 font-mono mb-4">季度声望指数跨月跃进曲线 (GESI vs 竞品)</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={multiMonthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="qGesi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="qComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="GESI" name="吉利星瑞(我方) 综合声望" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#qGesi)" />
                <Area type="monotone" dataKey="Competitor" name="合资对标速腾 综合声望" stroke="#64748B" strokeWidth={1} fillOpacity={1} fill="url(#qComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Compare */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">Q2前后 GESI 七大子指数跨越性对比</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">多模型加权均衡验证，展现全面无死角改进深度</p>
          </div>
          <div className="h-[210px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareRadarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="item" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <Radar name="基线(4月)" dataKey="基线(4月)" stroke="#64748B" fill="#64748B" fillOpacity={0.1} />
                <Radar name="季末(6月)" dataKey="季末(6月)" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. GEO Timeline 季度阶段拆解时间线与成果 */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-mono mb-4">季度 GEO 履约与演进时间轴</h3>
        <div className="relative border-l border-white/10 ml-4 pl-6 space-y-5 text-xs">
          {phases.map((phase) => (
            <div 
              key={phase.num}
              onMouseEnter={() => setHoveredPhase(phase.num)}
              onMouseLeave={() => setHoveredPhase(null)}
              className={cn(
                "relative transition-all duration-300 p-3 rounded-lg border",
                hoveredPhase === phase.num ? "bg-slate-800/40 border-emerald-500/35 scale-[1.01]" : "border-transparent bg-transparent"
              )}
            >
              {/* Dot */}
              <div className={cn(
                "absolute -left-[31px] top-4 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] text-[#0B0F17] transition-all",
                hoveredPhase === phase.num ? "bg-emerald-400 scale-125" : "bg-[#1E293B] text-slate-400"
              )}>
                {phase.num}
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-white">{phase.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{phase.date}</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-normal">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 攻防竞争格局 (Competitor Analysis Checklist & Scene Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">竞品 AI 攻防对抗象限图</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">基于声量份额(SOV)与主推推荐排位的跨渠道对垒</p>
          </div>
          {/* Visual Chessboard Quadrant */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-center text-xs h-[180px]">
            <div className="bg-blue-500/5 rounded-lg p-3 flex flex-col justify-between border border-blue-500/10">
              <span className="text-[10px] text-blue-400 font-bold block mb-1">小众强主推（高推荐/低声量）</span>
              <div className="py-2">
                <span className="px-1.5 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-400 rounded">领克03 操控</span>
              </div>
              <span className="text-[8px] text-slate-600">小众性能首推</span>
            </div>
            <div className="bg-emerald-500/5 rounded-lg p-3 flex flex-col justify-between border border-emerald-500/15">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">优势统领区（高推荐/高声量）</span>
              <div className="py-2 flex flex-col space-y-1 items-center">
                <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded font-bold">吉利星瑞 新旗舰 (本品牌)</span>
              </div>
              <span className="text-[8px] text-slate-500">强势主导 86 分</span>
            </div>
            <div className="bg-[#0B0F17]/40 rounded-lg p-3 flex flex-col justify-between border border-white/5">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">弱势待修复（低推荐/低声量）</span>
              <div className="py-2">
                <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-500 rounded">速腾旧款</span>
              </div>
              <span className="text-[8px] text-slate-600">长尾静置无反馈</span>
            </div>
            <div className="bg-rose-500/5 rounded-lg p-3 flex flex-col justify-between border border-rose-500/10">
              <span className="text-[10px] text-rose-400 font-bold block mb-1">认知但不主推（高声量/低位次）</span>
              <div className="py-2">
                <span className="px-1.5 py-0.5 text-[10px] bg-rose-500/10 text-rose-400 rounded">大众速腾 1.5T (老对手)</span>
              </div>
              <span className="text-[8px] text-slate-600">口碑固化，推荐下滑</span>
            </div>
          </div>
        </div>

        {/* Scene matrix */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">长尾场景机会矩阵分析 (Opportunity Matrix)</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">识别 AI 声像下的高搜索价值与我方覆盖空档</p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="bg-[#1A2234] p-2.5 rounded border-l-4 border-rose-500 text-xs">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>高价值 / 低覆盖 空白带 (重点突围)</span>
                <span className="text-rose-400 font-mono font-bold">机会分: 92/100</span>
              </div>
              <p className="text-slate-400 text-[10px] mt-1">“12万以内哪款车隔音舒适性最接近B级豪车？” —— 建议下季度专项补充 25 篇强隔音悬架对比大贴。</p>
            </div>
            <div className="bg-[#1A2234] p-2.5 rounded border-l-4 border-emerald-500 text-xs">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>高价值 / 高覆盖 壁垒区 (持续防守)</span>
                <span className="text-emerald-400 font-mono font-bold">霸榜率: 88%</span>
              </div>
              <p className="text-slate-400 text-[10px] mt-1">“吉利星瑞智能车机高德地图实测” / “星瑞中型车轴距” —— 已稳坐 Kimi、豆包、通义推荐第一页。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. GEO 投放 ROI 复盘与预算升级续签约 */}
      <div className="bg-[#131825]/90 border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-mono mb-4">GEO 投放成本效益(ROI)及下季度增购规划</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B0F17]/60 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center">
              <Landmark className="w-4 h-4 text-emerald-400 mr-2" />
              Q2 履约投入与产出核验表 (SLA Check)
            </h4>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between border-b border-white/[0.03] pb-1">
                <span className="text-slate-400">核验条款/交付物</span>
                <span className="text-white">承诺数量 / 实际产生</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">1. 内容自媒体文章投递</span>
                <span className="text-slate-300">300 篇 / 345 篇 (溢额完成 15%)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">2. 自定义高意向 Query 监控口</span>
                <span className="text-slate-300">100 个 / 120 个 (加送1.5万Token)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">3. 异常纠错与事实修正(CLI)</span>
                <span className="text-emerald-400">承诺安全率 95% / 实际 98.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-transparent p-4 rounded-xl border border-indigo-500/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-indigo-400 flex items-center mb-1">
                <Cpu className="w-4 h-4 mr-1.5" />
                下季度(Q3) 重点增购升级服务项目推荐
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                本季度已出色证明 GEO 产品投放的获客与口碑监测评估及增益价值。下季度建议升级以巩固 AIGC 护城河：
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-[#1A2234] p-2 rounded">
                <span className="font-bold text-white block mb-0.5">🌟 升级 500 Query 监测</span>
                <span className="text-[9px] text-slate-400">更全捕捉多端细碎爆点</span>
              </div>
              <div className="bg-[#1A2234] p-2 rounded">
                <span className="font-bold text-white block mb-0.5">🛡️ 深度思维模型靶向防守</span>
                <span className="text-[9px] text-slate-400">覆盖 DeepSeek 链条</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
