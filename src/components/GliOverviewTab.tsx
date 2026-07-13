// src/components/GliOverviewTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Award, Calendar, 
  Sparkles, Zap, ChevronRight, Info, RefreshCw, Sliders 
} from 'lucide-react';
import { 
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, 
  Tooltip as RechartsTooltip, Legend, AreaChart, Area 
} from 'recharts';
import { 
  overviewTrendData, 
  overviewTimeline, 
  overviewContributors 
} from './GliDeepDiveData';

interface GliOverviewTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliOverviewTab({ company, isLightMode, theme }: GliOverviewTabProps) {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const finalBaselineGesi = company.kpis.baselineGesi;
  const finalCurrentGesi = company.kpis.currentGesi;
  const finalDelta = finalCurrentGesi - finalBaselineGesi;

  const handleRecalculate = () => {
    setRecalculating(true);
    setSuccessMsg(null);
    setTimeout(() => {
      setRecalculating(false);
      setSuccessMsg('⚙️ 指数重算完成！置信度提升至 99.2%，已重新捕获底层语义向量。');
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* ==================== GLI 综合总分卡片 ==================== */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
        isLightMode
          ? 'bg-gradient-to-br from-blue-50/60 via-white to-emerald-50/40 border-slate-200 shadow-sm'
          : 'bg-gradient-to-br from-slate-950 via-[#0D121F] to-[#0D121F] border-white/5 shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${
                isLightMode ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                GE0 效果提升指数 (GLI)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                isLightMode ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                置信度 98.6%
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/15 text-purple-400 border border-purple-500/20`}>
                等级：优 (Excellent)
              </span>
            </div>
            <h3 className={`text-xl font-black ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              GE0 优化提升大盘
            </h3>
            <p className={`text-xs max-w-2xl leading-relaxed ${theme.textSecondary}`}>
              反映品牌在主流 LLM（Kimi、豆包、DeepSeek、千问、元宝）回答数据库中，核心物理卖点与权威数据的采纳权重累计增量。目前已累计覆盖 6 大主流模型，60+ 核心消费意图提问词，实现声量与质量的全面双向纠偏。
            </p>
            
            <div className="flex items-center gap-2 pt-2">
              <button 
                id="btn-adjust-weights"
                onClick={() => setShowWeightModal(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>调整权重比例</span>
              </button>
              <button 
                id="btn-recalc"
                onClick={handleRecalculate}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-200 font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
                <span>{recalculating ? '重新计算中...' : '重新计算指数'}</span>
              </button>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center min-w-[200px] text-center ${
            isLightMode ? 'bg-white border-slate-200/60 shadow-sm' : 'bg-slate-950/40 border-white/5'
          }`}>
            <span className={`text-[11px] font-bold ${theme.textSecondary}`}>GLI 综合提升分值</span>
            <span className={`text-4xl font-black tracking-tight mt-1 text-indigo-500`}>
              +{finalDelta.toFixed(1)} pts
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">
              GESI 生态健康度: {finalBaselineGesi.toFixed(1)} ➡️ {finalCurrentGesi.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-mono text-xs text-left animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ==================== 优化前后对比卡 ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border text-left ${theme.cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className={`text-[11px] font-bold ${theme.textSecondary}`}>优化前原始状态 (基线 GESI)</span>
          </div>
          <div className="space-y-1">
            <span className={`text-3xl font-black font-mono ${theme.textPrimary}`}>{finalBaselineGesi.toFixed(1)} <span className="text-sm font-normal">pts</span></span>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              主要模型中对“多连杆后独悬、水冷电池”等核心优势提及率低下，且存在风冷过时事实性错误。
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border text-left ${theme.cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`text-[11px] font-bold ${theme.textSecondary}`}>优化后当前状态 (当前 GESI)</span>
          </div>
          <div className="space-y-1">
            <span className={`text-3xl font-black font-mono text-emerald-400`}>{finalCurrentGesi.toFixed(1)} <span className="text-sm font-normal">pts</span></span>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              核心技术被广泛采信收录，纠偏事实错误2起，主流模型推荐占比和前排曝光率明显攀升。
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border text-left ${theme.cardBg} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className={`text-[11px] font-bold ${theme.textSecondary}`}>本周期优化贡献增量 (GLI)</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black font-mono text-indigo-400">+{finalDelta.toFixed(1)} pts</span>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              净值增量表现明显，品牌声量与说服力实现了从弱提到强推的结构性转变。
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 趋势折线图 & 动作贡献榜 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
        {/* 折线图 */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              GE0 优化提升与 GESI 健康度近五周走势
            </h4>
            <p className="text-[10.5px] text-slate-500">
              多周期持续性监测，确保大模型联网检索数据采纳呈稳健爬升态势
            </p>
          </div>

          <div className="h-56 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGesi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} />
                <YAxis stroke={theme.axisStroke} fontSize={10} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="GLI提升" stroke="#6366f1" fillOpacity={1} fill="url(#colorGeo)" strokeWidth={3} name="GLI 优化提升值 (pts)" />
                <Area type="monotone" dataKey="GESI健康度" stroke="#10b981" fillOpacity={1} fill="url(#colorGesi)" strokeWidth={2.5} name="GESI 生态健康度" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 贡献度 */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Award className="w-4 h-4 text-indigo-400" />
              优化动作贡献度排名 (GLI Contribution)
            </h4>
            <p className="text-[10.5px] text-slate-500">
              精准定位各投放资产在大模型中的具体说服力与引用贡献分值
            </p>
          </div>

          <div className="space-y-3 pt-3 flex-1 flex flex-col justify-center">
            {overviewContributors.map((act, i) => (
              <div key={i} className="space-y-1 text-xs font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span className={`font-semibold ${theme.textSecondary}`}>{act.name}</span>
                  <span className="font-bold text-indigo-400 font-mono">{act.pts}</span>
                </div>
                <div className={`w-full h-1.5 rounded-full ${isLightMode ? 'bg-slate-100' : 'bg-slate-950'}`}>
                  <div className="h-full rounded-full" style={{ width: `${act.percent}%`, backgroundColor: act.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 时间轴 与 专家解读 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        {/* 时间线 */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border space-y-4 ${theme.cardBg}`}>
          <div className="space-y-1 border-b pb-2.5" style={{ borderColor: isLightMode ? '#E2E8F0' : 'rgba(255,255,255,0.05)' }}>
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Calendar className="w-4 h-4 text-blue-400" />
              投放复盘与配置审计时间线
            </h4>
            <p className="text-[10.5px] text-slate-500">
              追踪内容发布、大模型重爬、指标回归测算的全生命周期阶段
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-800 ml-3 py-1 space-y-5">
            {overviewTimeline.map((node, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 ${
                  isLightMode ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                }`} />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                  <div className="md:col-span-2 font-black font-mono text-blue-400">
                    {node.date}
                  </div>
                  <div className="md:col-span-8 space-y-0.5">
                    <span className={`font-black text-xs ${theme.textPrimary}`}>{node.title}</span>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                      node.status === '已生效' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 专家诊断 & 趋势波动 */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI 专家诊断 */}
          <div className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
            isLightMode ? 'bg-indigo-50/40 border-indigo-100 shadow-sm' : 'bg-indigo-950/10 border-indigo-500/10'
          }`}>
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI 专家诊断与解读 (Expert AI Insights)
            </h4>
            <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
              本期荣威D7 DMH的 <span className="font-bold text-emerald-400">VLI 可见度</span> 和 <span className="font-bold text-indigo-400">CLI 认知修正</span> 上涨势头最猛，核心源自中国汽研（CAERI）极寒馈电油耗数据与懂车帝底盘多连杆+液压衬套拆机横评大面积被 Kimi、DeepSeek 联网检索索引所致。
            </p>
            <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
              但在腾讯元宝和通义千问里，对比决策场景中仍然由于秦L巨大的历史保有量声量遭遇长尾截流，建议补充长途隔音NVH舒适性的口碑材料。
            </p>
          </div>

          {/* 趋势变化与波动解读 */}
          <div className={`p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Info className="w-4 h-4 text-emerald-400" />
              大盘波动与采信率解读
            </h4>
            <div className="space-y-2 text-[10.5px]">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-500">知识库爬取频率：</span>
                <span className={`font-mono font-bold ${theme.textPrimary}`}>每3-5天/大范围收载</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-500">联网意图召回率：</span>
                <span className={`font-mono font-bold ${theme.textPrimary}`}>从 42% 上升至 68%</span>
              </div>
              <p className="text-slate-500 leading-relaxed pt-1">
                * 本期指数置信度高达 98.6%，说明全套 75 篇投放资产已被深度吸收，未发生严重幻觉。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 提升与下降归因分析 ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* 正向归因 */}
        <div className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${theme.cardBg}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            🟢 提升主因分析 (Positive Attribution)
          </h4>
          <div className="space-y-3 pt-1 text-[11px] leading-relaxed">
            <div className="space-y-1">
              <span className={`font-bold block ${theme.textPrimary}`}>1. 权威实测报告数字化注入</span>
              <p className={theme.textSecondary}>
                数字化中国汽研（CAERI）能耗达成率和针刺安全通告，促使大模型生成带来源的外链和强置信脚注，油耗事实采信度增加2.5倍。
              </p>
            </div>
            <div className="space-y-1">
              <span className={`font-bold block ${theme.textPrimary}`}>2. 底盘工艺硬核拆车爆破</span>
              <p className={theme.textSecondary}>
                针对消费者对比悬架的强意图词，大范围在各媒体部署多连杆、全铝副车架及液压衬套等硬核参数，实现多模型决策推荐反超。
              </p>
            </div>
          </div>
        </div>

        {/* 负向归因 */}
        <div className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${theme.cardBg}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
            🔴 瓶颈与截流防线分析 (Bottlenecks & Threats)
          </h4>
          <div className="space-y-3 pt-1 text-[11px] leading-relaxed">
            <div className="space-y-1">
              <span className={`font-bold block ${theme.textPrimary}`}>1. 竞品巨大历史保有量的心智占领</span>
              <p className={theme.textSecondary}>
                比亚迪秦L由于长达数年的极高曝光度，大模型在无特殊参数要求的前提下，极易默认首推竞品，我方仍属于差异化精准截击。
              </p>
            </div>
            <div className="space-y-1">
              <span className={`font-bold block ${theme.textPrimary}`}>2. 零星智能化卡顿黑料未做拦截</span>
              <p className={theme.textSecondary}>
                论坛偶发对早期斑马车机死机的吐槽，被通义千问在长尾意图“荣威D7车机怎么样”中召回，存在约3.2%的负向负面发酵风险。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weight adjustment Modal Simulation */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border text-left space-y-4 shadow-2xl ${
            isLightMode ? 'bg-white border-slate-200' : 'bg-[#0D121F] border-white/5'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className={`text-sm font-bold ${theme.textPrimary}`}>调整大模型各维度权重比例</h4>
              <button onClick={() => setShowWeightModal(false)} className="text-slate-500 hover:text-white font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-[11px] text-slate-500">调整各评估子指标在 GLI/GESI 综合模型中的加权占比，可立即重新推算综合分值。</p>
            <div className="space-y-3.5 text-xs font-mono">
              {[
                { name: '可见度（VLI）', val: '25%' },
                { name: '推荐力（RLI）', val: '25%' },
                { name: '印象度（ILI）', val: '15%' },
                { name: '认知度（CLI）', val: '15%' },
                { name: '权威度（ALI）', val: '10%' },
                { name: '竞争力（DLI）', val: '10%' },
              ].map((w, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className={theme.textSecondary}>{w.name}</span>
                  <div className="flex items-center gap-2">
                    <input type="range" className="w-24 accent-indigo-500" defaultValue="50" />
                    <span className={`font-bold font-mono ${theme.textPrimary}`}>{w.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowWeightModal(false)} 
                className="px-3 py-1.5 rounded-lg border border-white/5 text-slate-400 hover:bg-white/5 text-[11px] cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setShowWeightModal(false);
                  handleRecalculate();
                }} 
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] cursor-pointer hover:bg-indigo-700"
              >
                保存并重新计算
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
