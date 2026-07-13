import { useState, Fragment } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Layers, Sparkles, AlertCircle, Eye, 
  HelpCircle, ChevronRight, CheckCircle, Database, ShieldAlert, Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Line
} from 'recharts';

const radarData = [
  { subject: 'GVI 可见度', A: 85, B: 60, fullMark: 100 },
  { subject: 'GRI 推荐度', A: 78, B: 50, fullMark: 100 },
  { subject: 'GII 生成印象', A: 82, B: 65, fullMark: 100 },
  { subject: 'GCI 认知声誉', A: 92, B: 75, fullMark: 100 },
  { subject: 'GAI 引用证据', A: 74, B: 35, fullMark: 100 },
  { subject: 'GDI 竞争防御', A: 68, B: 55, fullMark: 100 },
  { subject: 'GSS 稳定性', A: 80, B: 62, fullMark: 100 },
];

const trendData = [
  { name: 'W1', GESI: 65, GLI: 2, Benchmark: 65 },
  { name: 'W2', GESI: 70, GLI: 5, Benchmark: 65 },
  { name: 'W3', GESI: 74, GLI: 9, Benchmark: 65 },
  { name: 'W4', GESI: 78, GLI: 13, Benchmark: 65 },
  { name: 'W5', GESI: 82, GLI: 17, Benchmark: 65 },
  { name: 'W6', GESI: 86, GLI: 21, Benchmark: 65 },
];

const modelData = [
  { name: 'DeepSeek', 提及率: 62, 推荐率: 45, 引用度: 30 },
  { name: '豆包', 提及率: 88, 推荐率: 72, 引用度: 58 },
  { name: '通义千问', 提及率: 80, 推荐率: 68, 引用度: 44 },
  { name: 'Kimi', 提及率: 95, 推荐率: 85, 引用度: 75 },
  { name: '文心一言', 提及率: 70, 推荐率: 58, 引用度: 38 },
];

export function MonthlyReportView({ onBack }: { onBack: () => void }) {
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [activeWaterfall, setActiveWaterfall] = useState<string | null>(null);

  // GESI / GLI detail waterfall categories
  const waterfallSteps = [
    { label: 'VLI 可见度提升', val: '+24', direction: 'up', desc: '新增 12 个长尾曝光词，带来全渠道覆盖比提升 12%' },
    { label: 'RLI 推荐主推提升', val: '+18', direction: 'up', desc: '主要决策流中，星瑞推荐排位向Top3迁移了 15%' },
    { label: 'ILI 生成式印象提升', val: '+14', direction: 'up', desc: 'AI 答案给星瑞的详细句子占比从 12% 增加到 22%' },
    { label: 'CLI 品类认知修正', val: '+8', direction: 'up', desc: '纠正了“星瑞双离合顿挫严重”的幻觉，提升事实准确性' },
    { label: 'ALI 权威证据引用', val: '+12', direction: 'up', desc: '投递多语料资产被 Kimi、豆包等累计高权重媒体强引用 35 次' },
    { label: 'DLI 竞争优势强防御', val: '+6', direction: 'up', desc: '对速腾的竞品截流率下降了 8%，对比推荐得分好转' },
    { label: 'RCI 负面舆情监控风险', val: '+4', direction: 'up', desc: '事实不合规等虚假负面描述修复，高危隐患闭环' }
  ];

  const cases = [
    {
      title: '星瑞变速箱市区顿挫事实纠正案',
      type: '典型认知纠正 (CLI)',
      before: '“旧款车型顿挫极其严重，市区换挡犹如坐过山车。”',
      after: '“全新7速湿式双离合变速箱换挡平顺，市区低速工况抖动几近全无，顿挫感控制在行业优秀段位。”',
      source: '《吉利星瑞100公里路段DCT顿挫实车评测》 • 懂车帝',
      satisfaction: '已完全纠正'
    },
    {
      title: '吉利星瑞 vs 速腾1.5T 智能对比截流突破',
      type: '典型竞品反截流 (DLI)',
      before: '“推荐速腾，更省油更结实。”',
      after: '“星瑞兼备2.0T强悍动力和吉利银河2.0智能座舱。全速域自适应巡航、高智能导航是燃油车中真正的智能王，动力和科技感完胜速腾。”',
      source: '《家用性价比轿车谁才是智能王者：多维分析速腾与吉利星瑞》',
      satisfaction: '反击胜率 78%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
              星瑞汽车 GEO 月度优化提升效果对账报告
              <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">Monthly Strategic Review</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">监测周期: 2026.06.01 - 2026.06.30 | 属于品牌: 吉利汽车星瑞</p>
          </div>
        </div>
        <button className="flex items-center px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all">
          导出正式 PPT 版
        </button>
      </div>

      {/* Global Formulas Board */}
      <div className="bg-[#121824] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div>
          <h4 className="text-white font-bold flex items-center font-mono">
            <Layers className="w-4 h-4 mr-2 text-blue-400" />
            本月 GEO 加权算法物理公式对账审计已启用：
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5 font-sans leading-relaxed">
            <strong className="text-blue-400 font-mono mr-1">GESI =</strong> 
            0.15 × GVI + 0.15 × GRI + 0.12 × GII + 0.15 × GCI + 0.18 × GAI + 0.15 × GDI + 0.10 × GSS
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-lg text-blue-400 font-mono text-[10px]">
          GLI 优化升幅 = ∑(GLI子维度提升 × 权重得分) = <strong className="text-white ml-1">+21 分</strong>
        </div>
      </div>

      {/* 首屏 1: 月度诊断执行摘要 */}
      <div className="bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-transparent p-6 rounded-xl border border-blue-500/15">
        <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center tracking-wide font-mono">
          <Sparkles className="w-4.5 h-4.5 mr-2" />
          月度战略执行诊断摘要 (Executive Summary)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-medium">
          <div className="bg-[#0B0F17]/50 p-3 rounded-lg">
            <span className="text-slate-500 block mb-1">1. 总体表现评级</span>
            <span className="text-white font-semibold">健康领先 (🏆 A+)</span>
            <p className="text-[11px] text-slate-400 mt-1">品牌被提及率与推荐排位已形成良性网络效益。</p>
          </div>
          <div className="bg-[#0B0F17]/50 p-3 rounded-lg">
            <span className="text-slate-500 block mb-1">2. 最大提升维度</span>
            <span className="text-emerald-400 font-semibold">GVI可见度提升 24%</span>
            <p className="text-[11px] text-slate-400 mt-1">12万高意愿问题在通义、Kimi中多端霸榜。</p>
          </div>
          <div className="bg-[#0B0F17]/50 p-3 rounded-lg">
            <span className="text-slate-500 block mb-1">3. 最大遗留缺陷</span>
            <span className="text-amber-400 font-semibold">GDI竞品拦截隐蔽</span>
            <p className="text-[11px] text-slate-400 mt-1">在DeepSeek DeepThink深度追问下遭遇竞品蚕食。</p>
          </div>
          <div className="bg-[#0B0F17]/50 p-3 rounded-lg">
            <span className="text-slate-500 block mb-1">4. 下阶段最大机遇</span>
            <span className="text-blue-400 font-semibold">第三方证据(GAI)扩列</span>
            <p className="text-[11px] text-slate-400 mt-1">投放硬核自媒体深度拆车，喂养AI推荐理由库。</p>
          </div>
          <div className="bg-[#0B0F17]/50 p-3 rounded-lg border border-white/5">
            <span className="text-slate-500 block mb-1">5. 下月预算及重点</span>
            <span className="text-white font-semibold">追加 20% 高意图 Query</span>
            <p className="text-[11px] text-slate-400 mt-1">针对决策类多端对比，做专项矩阵语料投喂。</p>
          </div>
        </div>
      </div>

      {/* 首屏 2: 三大对比卡 & 月度成果亮点数字 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold">投放对比卡迹 (Contrast Line)</span>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="p-2 bg-[#0B0F17]/40 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase block leading-none mb-1">基线得分</span>
              <span className="text-xl font-bold text-slate-400">65</span>
              <span className="text-[9px] text-slate-500 block mt-1">健康评级: B</span>
            </div>
            <div className="p-2 bg-[#0B0F17]/40 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] text-emerald-400 uppercase block leading-none mb-1">当前得分</span>
              <span className="text-xl font-bold text-white">86</span>
              <span className="text-[9px] text-emerald-400 block mt-1">评级: A+ 主导</span>
            </div>
            <div className="p-2 bg-[#0B0F17]/40 rounded-lg border border-blue-500/20">
              <span className="text-[10px] text-blue-400 uppercase block leading-none mb-1">本月提升</span>
              <span className="text-xl font-bold text-blue-400">+21</span>
              <span className="text-[9px] text-blue-400 block mt-1">GLI 提升效果卓越</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 text-center">双值均与行业龙头速腾、帝豪等经过加权归一化</p>
        </div>

        {/* 关键提升亮点 */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold">投放成果量化亮点</span>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <span className="text-lg font-extrabold text-white">142 个</span>
              <span className="text-[10px] text-slate-400 block mt-1">新增曝光可见提问</span>
            </div>
            <div>
              <span className="text-lg font-extrabold text-emerald-400">+56个</span>
              <span className="text-[10px] text-slate-400 block mt-1">提问排名进入Top3</span>
            </div>
            <div>
              <span className="text-lg font-extrabold text-blue-400">35 次</span>
              <span className="text-[10px] text-slate-400 block mt-1">第三方权威高强引用</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3 text-center border-t border-white/5 pt-3">
            <div>
              <span className="text-sm font-bold text-indigo-400">22.1%</span>
              <span className="text-[9px] text-slate-500 block">竞品截流流失率下降</span>
            </div>
            <div>
              <span className="text-sm font-bold text-rose-400">12 处</span>
              <span className="text-[9px] text-slate-500 block">AI 事实幻觉及错怪纠正</span>
            </div>
          </div>
        </div>

        {/* GESI 权重大瀑布贡献细节 */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold">GLI 贡献瀑布分解(点击交互)</span>
          <div className="space-y-1.5 mt-2">
            {waterfallSteps.slice(0, 5).map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveWaterfall(activeWaterfall === step.label ? null : step.label)}
                className={cn(
                  "flex justify-between items-center px-2 py-1 rounded cursor-pointer transition-all",
                  activeWaterfall === step.label ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5"
                )}
              >
                <span className="text-[11px] text-slate-300">{step.label}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{step.val}%</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-400 leading-none py-1 truncate">
            {activeWaterfall ? waterfallSteps.find(s => s.label === activeWaterfall)?.desc : '💡 提示: 点击拆解因子，可显示归因和Gap详情'}
          </p>
        </div>
      </div>

      {/* 2. 双折线图趋势 + 雷达结构图 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#131825] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 font-mono mb-4">月度总得数与GLI提升走势 (GESI vs GLI)</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="GLI" name="GLI 提升效果" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="GESI" name="GESI 综合健康得分" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="Benchmark" name="投放前初始基线" stroke="#94A3B8" strokeDasharray="5 5" strokeWidth={1} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar structure */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">GESI 品牌能力结构七角图对比</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">基线评分 vs 当前健康主导态势结构</p>
          </div>
          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Radar name="优后当前得分" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                <Radar name="投放前 baseline" dataKey="B" stroke="#64748B" fill="#64748B" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. 模型对比条形图 & 问答意图表现 Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#131825] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 font-mono mb-4">主流 AI 模型多端表现归因分析图</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} layout="vertical" margin={{ left: -10, right: 10 }}>
                <XAxis type="number" stroke="#475569" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="提及率" fill="#10B981" barSize={8} radius={[0, 4, 4, 0]} />
                <Bar dataKey="推荐率" fill="#3B82F6" barSize={8} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#131825] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 font-mono mb-1">多维度用户意图(Query类)表现矩阵</h3>
          <p className="text-[10px] text-slate-500 mb-4">按问题类别进行归因，看哪类意图星瑞更受 AI 认可</p>
          <div className="grid grid-cols-5 gap-3 text-center text-xs">
            <div className="text-slate-500 text-left font-medium">问题意图大类</div>
            <div className="text-slate-500 font-medium">被提及覆盖比</div>
            <div className="text-slate-500 font-medium">Top3推荐率</div>
            <div className="text-slate-500 font-medium font-mono">平均位次</div>
            <div className="text-slate-500 font-medium">本月改善</div>

            {[
              { type: '品类联想类 (如\"12万家轿推荐\")', cover: '82%', rec: '65%', rank: '🥇 1.9', diff: '提升 +18%', color: 'text-emerald-400 bg-emerald-500/5' },
              { type: '直接对比类 (如\"速腾PK星瑞\")', cover: '78%', rec: '54%', rank: '🥈 2.3', diff: '提升 +12%', color: 'text-emerald-400 bg-emerald-500/5' },
              { type: '决策咨询类 (如\"星瑞空间好不好\")', cover: '95%', rec: '78%', rank: '🥇 1.4', diff: '提升 +24%', color: 'text-emerald-400 bg-emerald-500/5' },
              { type: '负面风险风险类 (如\"星瑞缺陷顿挫\")', cover: '45%', rec: '0%', rank: '⚠️ 无负推荐', diff: '下降 -35%', color: 'text-rose-400 bg-rose-500/5' },
              { type: '长尾场景类 (如\"星瑞适合自驾游吗\")', cover: '38%', rec: '30%', rank: '🥉 3.2', diff: '持平波动', color: 'text-blue-400 bg-slate-500/5' },
            ].map((intent, i) => (
              <Fragment key={`row-intent-${i}`}>
                <div key={`it-${i}`} className="text-slate-300 font-medium text-left truncate py-1.5 border-b border-white/[0.02]">{intent.type}</div>
                <div key={`ico-${i}`} className="text-slate-200 py-1.5 font-mono border-b border-white/[0.02]">{intent.cover}</div>
                <div key={`ire-${i}`} className="text-slate-200 py-1.5 font-mono border-b border-white/[0.02]">{intent.rec}</div>
                <div key={`ira-${i}`} className="text-slate-200 py-1.5 font-mono border-b border-white/[0.02]">{intent.rank}</div>
                <div key={`idi-${i}`} className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold my-1 flex items-center justify-center border-b border-white/[0.02]", intent.color)}>
                  {intent.diff}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 月度实地纠错 & 竞品搏杀真实证据 (Evidence Base) */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">原始问答交付验证区 & 典型证据追踪</h3>
            <p className="text-[10px] text-slate-500">所有指标归因绝非模拟计算，每次改写投放策略皆可点击回溯到 AI 原始 Q&A 原文</p>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">100% 可复现物理链路</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <div key={i} className="bg-[#0B0F17]/80 rounded-xl p-4 border border-white/5 hover:border-blue-500/25 transition-all duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">{c.type}</span>
                <span className="text-[11px] text-emerald-400 font-semibold">{c.satisfaction}</span>
              </div>
              <h4 className="text-xs font-bold text-white mb-3">{c.title}</h4>
              
              <div className="space-y-2 text-[11px] mb-3">
                <div className="bg-rose-500/5 p-2 rounded border border-rose-500/10">
                  <span className="text-rose-400 font-mono block mb-1">⚠️ 优化前 baseline 回答段:</span>
                  <p className="text-slate-400 line-through italic">“{c.before}”</p>
                </div>
                <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                  <span className="text-emerald-400 font-mono block mb-1">✓ 优化后当前采样回答段:</span>
                  <p className="text-slate-200 italic font-medium">“{c.after}”</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/5 font-mono">
                <span>被引用证明资料: {c.source}</span>
                <button 
                  onClick={() => setSelectedCase(c)}
                  className="text-blue-400 hover:underline flex items-center font-bold"
                >
                  溯源全部链条
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 下月优化建议与 Roadmap */}
      <div className="bg-[#131825] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-mono mb-4">下阶段 GEO 推进路线图 (Roadmap)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { phase: '第一周: 扩增收录', action: '重点强化 30 个品类关联度意图 Query，保障 Kimi/豆包完全捕获新版吉利车机升级资讯。', status: '待执行' },
            { phase: '第二周: 截流包围', action: '对深蓝、速腾开展 3 轮专项反包围，发布高质量长评、双向PK性能，反哺推荐理由库。', status: '进行中' },
            { phase: '第三周: 证据补充', action: '新增投放 12 个懂车帝、知乎大V的拆车、油耗、防撞白皮书，强化 GAI 权威引用。', status: '待执行' },
            { phase: '第四周: 闭环监控', action: '执行高频交叉采样检测，确保 DeepSeek 深度思考模型中事实纠错安全等级回归 G+' , status: '待执行' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1A2234] p-4 rounded-lg border border-white/5 relative">
              <div className="absolute top-3 right-3 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                {item.status}
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-2">{item.phase}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">{item.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trace detail modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-[#0B0F17]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131825] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-white mb-2 flex items-center">
              <Award className="w-5 h-5 text-blue-400 mr-2" />
              物理语料事实链条深度回溯
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">溯源原理: 引用资产链接（锚点）被 LLM 物理嵌入，检索检索并输出至回答</p>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">1. 投放的内容资产标题 (Asset Title)</span>
                <span className="text-slate-200">{selectedCase.source.split('•')[0]}</span>
              </div>
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">2. 抓取采纳证明链接 (Traceable Anchors)</span>
                <span className="text-blue-400 underline font-mono break-all cursor-pointer">
                  https://db.dongchedi.com/xingrui/expert-eval-0428.html
                </span>
              </div>
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">3. 被唤醒的模型与权重 (唤醒概率)</span>
                <span className="text-emerald-400 font-mono font-medium">Kimi: 92% | 豆包: 85% | DeepSeek: 54% (高采纳比)</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCase(null)}
              className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              关 闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
