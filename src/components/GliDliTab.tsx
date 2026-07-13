// src/components/GliDliTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Sparkles, HelpCircle, Eye, CheckCircle2, ChevronRight, 
  TrendingUp, ZoomIn, Info, Activity, ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  dliWinRateData, 
  dliRankGapData, 
  dliBypassedList 
} from './GliDeepDiveData';

interface GliDliTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliDliTab({ company, isLightMode, theme }: GliDliTabProps) {
  const [selectedZoomQuery, setSelectedZoomQuery] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(3); // Default to current

  const bypassSteps = [
    { label: '1. 优化前', desc: '声量及物理卖点均处于弱势。在与秦L、银河L6的对比问询中，多沦为备选或背景板，原始落后-4.2 pts。' },
    { label: '2. 差异化爆破', desc: '瞄准秦L的“板车后悬架、冲压件”物理短板，定向部署“五连杆独悬、全铝副车架、豪华液压衬套”内容资产。' },
    { label: '3. 中期采信', desc: '各大模型联网搜索知识库重爬，我方部署内容占比大幅度跃升，两车PK推荐率快速拉近。' },
    { label: '4. 成功反超', desc: '在本期对账中，胜率破天荒地攀升至 54.0%，且大模型推荐理由开始高亮我方全铝结构优势。' }
  ];

  return (
    <div className="space-y-6">
      {/* Banner Title */}
      <div className={`p-4 rounded-xl border border-dashed ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/10'
      }`}>
        <span className="text-[10px] font-black uppercase text-indigo-500 font-mono">子指数对账诊断：DLI 竞争优势提升</span>
        <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-0.5`}>
          问答诊断：在与主要竞品的直接对比提问里，我方是否具备了碾压或反超优势？
        </h4>
      </div>

      {/* 6 Indicators badges */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: '竞品声量份额', val: '41.2%', diff: '+15.5%', isPos: true },
          { label: '直接PK胜率', val: '54.0%', diff: '从18%暴增', isPos: true },
          { label: 'Rank Gap名次差距', val: '+0.8位', diff: '首次转正反超', isPos: true },
          { label: '竞品长尾截流率', val: '8.5%', diff: '暴跌 -24.0%', isPos: true },
          { label: '新增反超提问词', val: '+22组', diff: '覆盖主力场景', isPos: true },
          { label: '对比推荐置信度', val: '95.0%', diff: '极高采信', isPos: true },
        ].map((ind, idx) => (
          <div key={idx} className={`p-3 rounded-xl border text-center ${theme.cardBg}`}>
            <span className="text-[10px] text-slate-500 font-bold block">{ind.label}</span>
            <span className={`text-lg font-black font-mono block mt-1.5 ${theme.textPrimary}`}>{ind.val}</span>
            <span className={`text-[9.5px] font-mono inline-block px-1.5 py-0.5 rounded mt-1 font-bold ${
              ind.isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {ind.diff}
            </span>
          </div>
        ))}
      </div>

      {/* Competitor Bypass Timeline Unique Display */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            竞品超越全路径沙盘时间线 (Bypass Timeline)
          </h5>
          <p className="text-[10.5px] text-slate-500">
            精细量化我方产品（荣威D7）如何在特定物理工艺加持下，逐步在 AI 数据库中蚕食并反超行业领头羊（秦L）
          </p>
        </div>

        {/* Step-by-Step wizard rendering */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {bypassSteps.map((step, idx) => {
            const isCompleted = activeStep >= idx;
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold scale-102 ring-1 ring-indigo-500/30'
                    : isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-950/20 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex justify-between items-center mb-2 font-mono">
                  <span className="text-[10.5px] font-black">{step.label}</span>
                  {isCompleted && <span className="text-[10px] text-emerald-400 font-bold">✓ DONE</span>}
                </div>
                <p className={`text-[10.5px] leading-relaxed ${
                  isActive ? theme.textPrimary : 'text-slate-500'
                }`}>
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row of three elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch text-left">
        {/* Competitive Win Rate Bar */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              对比 PK 胜率变化趋势
            </h5>
            <p className="text-[10px] text-slate-500">
              荣威D7 vs 竞品秦L 胜率博弈变迁图
            </p>
          </div>

          <div className="h-44 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dliWinRateData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={9} />
                <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="荣威D7胜率" fill="#10b981" radius={[3, 3, 0, 0]} name="荣威D7胜率" />
                <Bar dataKey="竞品秦L胜率" fill="#94a3b8" radius={[3, 3, 0, 0]} name="秦L胜率" strokeDasharray="2 2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rank Gap visual line */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Activity className="w-4 h-4 text-indigo-400" />
              大模型推荐名次差 (Rank Gap)
            </h5>
            <p className="text-[10px] text-slate-500">
              大于0表示我方在平均推荐名次中压倒主要竞品
            </p>
          </div>

          <div className="h-44 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dliRankGapData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={9} />
                <YAxis stroke={theme.axisStroke} fontSize={10} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Line type="monotone" dataKey="RankGap" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="推荐名次差" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor Hijack Stat */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Info className="w-4 h-4 text-indigo-450 text-indigo-400" />
              竞品长尾黑客截流阻断率
            </h5>
            <p className="text-[10px] text-slate-500">
              消费者指明提问我方时，大模型避免跳转推荐秦L的拦截胜率
            </p>
          </div>

          <div className="py-4 flex flex-col justify-center items-center space-y-3">
            <div className="text-center">
              <span className="text-4xl font-black font-mono text-emerald-400">91.5%</span>
              <p className="text-[10px] text-slate-500 mt-1">基线拦截防线: 67.5%</p>
            </div>
            <div className="w-full bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-[10px] text-slate-500 font-mono">
              🟢 已成功阻断 22 组泛品类引流词，防御率明显提升！
            </div>
          </div>
        </div>
      </div>

      {/* Bypassed Competitors Table */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            本周期成功实现排名反超（超越竞品）提问词明细账
          </h5>
          <p className="text-[10.5px] text-slate-500">
            盘点哪些由于我方硬核工艺采信，在大模型多轮对比质询中名次实现历史翻盘的优质 Query 
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500">
                <th className="py-2">意图提问 (Query)</th>
                <th className="py-2">主要对手</th>
                <th className="py-2">优化前大盘推荐</th>
                <th className="py-2">优化后当前首推</th>
                <th className="py-2 text-right">大模型底层推荐逻辑变化</th>
              </tr>
            </thead>
            <tbody>
              {dliBypassedList.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className={`py-2.5 font-bold ${theme.textPrimary} max-w-[200px] truncate`}>{item.query}</td>
                  <td className="py-2.5 text-slate-400">{item.competitor}</td>
                  <td className="py-2.5 text-rose-400 text-xs">{item.beforeRank}</td>
                  <td className="py-2.5 text-emerald-400 text-xs font-bold">{item.currentRank}</td>
                  <td className="py-2.5 text-right text-slate-500 max-w-[150px] truncate">{item.reasonChange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis conclusions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
        <div className={`md:col-span-8 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Info className="w-4 h-4 text-emerald-400" />
            DLI 竞争力提升诊断分析
          </h5>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            本周期品牌在与主要对手比亚迪秦L的直接交锋中表现极为惊人。五连杆、全铝合金副车架等物理事实在知乎、懂车帝的拆机贴大范围发酵后，Kimi、DeepSeek 等先进模型几乎彻底消除了秦L的一家独大描述。
          </p>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            虽然秦L在基础品牌词意图下因数以亿计的历史保有量大盘仍居高位，但只要消费者提及“舒适、滤震、底盘、用料”等，我方胜率高达 54.0%，彻底实现了狙击战心智夺占。
          </p>
        </div>

        <div className={`md:col-span-4 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            竞争交锋证据采样
          </h5>
          <button
            onClick={() => setSelectedZoomQuery('DeepSeek关于“荣威D7对秦L底盘舒适用料拆车PK”')}
            className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono flex justify-between items-center cursor-pointer transition-colors ${
              isLightMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/40 border-white/5 hover:bg-slate-900'
            }`}
          >
            <span className={theme.textPrimary}>1. DeepSeek双车对战对账</span>
            <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Zoom modal */}
      {selectedZoomQuery && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl p-6 rounded-2xl border text-left space-y-4 shadow-2xl relative ${
            isLightMode ? 'bg-white border-slate-200' : 'bg-[#0D121F] border-white/5'
          }`}>
            <button 
              onClick={() => setSelectedZoomQuery(null)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase text-indigo-400">大模型原生双车对比意图截图还原</span>
              <h4 className={`text-sm font-bold ${theme.textPrimary} mt-1`}>{selectedZoomQuery}</h4>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto space-y-2 text-left">
              <p className="text-slate-500">// DeepSeek 联网原生对账采样 Q-20260625-1549</p>
              <p className="text-slate-300 font-sans">
                “针对预算12万在这两款插混轿车中选谁的底盘更舒适，大模型多轮物理拆解 facts 采信表明，<span className="text-emerald-450 font-bold bg-emerald-500/10 px-1 rounded text-emerald-450">【上汽荣威D7 DMH】</span>在核心物理用料上显著优于【比亚迪秦L DM-i】。秦L虽然车身尺寸和品牌名气大，但后悬采用较薄的冲压件结构；相比之下，荣威D7标配五连杆独立悬架、全铝副车架并带有高端液压衬套。在颠簸和高速转弯的物理实测滤震厚重感上，大语言模型优先向您推荐荣威D7...”
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
