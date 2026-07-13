// src/components/GliVliTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Eye, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, 
  FileSpreadsheet, ZoomIn, Maximize2, Search, ArrowUpRight, 
  Clock, ShieldAlert, Award, FileText, X
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  vliBeforeAfterData, 
  vliNewQueries, 
  vliModelCoverages 
} from './GliDeepDiveData';

interface GliVliTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliVliTab({ company, isLightMode, theme }: GliVliTabProps) {
  // Navigation/Pagination state for Query list
  const [queryPage, setQueryPage] = useState(1);
  const itemsPerPage = 3;

  // Zoom / Expand table states
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [expandedSearch, setExpandedSearch] = useState('');

  // Selected screenshot zoom simulation
  const [selectedZoomQuery, setSelectedZoomQuery] = useState<string | null>(null);

  // Pagination calculations
  const totalQueries = vliNewQueries.length;
  const totalPages = Math.ceil(totalQueries / itemsPerPage);
  const startIndex = (queryPage - 1) * itemsPerPage;
  const currentQueries = vliNewQueries.slice(startIndex, startIndex + itemsPerPage);

  // Filtered queries in full screen modal
  const filteredQueries = vliNewQueries.filter(q => 
    q.query.toLowerCase().includes(expandedSearch.toLowerCase()) ||
    q.scene.toLowerCase().includes(expandedSearch.toLowerCase())
  );

  // Dynamic Horizontal Waterfall values
  // Baseline (45) + Model (+12) + Scene (+18) + Exposure (+15) = Current (90)
  const waterfallSteps = [
    { label: '基线可见问题数', value: 45, type: 'base', width: '50.0%', left: '0%', color: 'from-slate-600 to-slate-500', isChange: false },
    { label: '新增模型覆盖', value: 12, type: 'increase', width: '13.3%', left: '50.0%', color: 'from-emerald-500 to-emerald-400', isChange: true },
    { label: '新增场景覆盖', value: 18, type: 'increase', width: '20.0%', left: '63.3%', color: 'from-teal-500 to-teal-400', isChange: true },
    { label: '新增前排曝光', value: 15, type: 'increase', width: '16.7%', left: '83.3%', color: 'from-cyan-500 to-cyan-400', isChange: true },
    { label: '当前可见问题数', value: 90, type: 'total', width: '100.0%', left: '0%', color: 'from-indigo-600 to-indigo-500', isChange: false }
  ];

  return (
    <div className="space-y-6">
      {/* ==================== 1. VLI Header & Included Metrics ==================== */}
      <div className={`p-5 rounded-2xl border ${theme.cardBg}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
              VLI • 可见度提升指数
            </span>
            <h3 className={`text-lg font-black tracking-tight ${theme.textPrimary}`}>
              核心目的：优化后 AI 是否更多看见我方品牌？
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              评估品牌核心卖点（如五连杆独悬、液压衬套、超强续航等）在主流大模型召回检索中的可见大盘状况。
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-black shrink-0 px-2.5 py-1 rounded bg-emerald-500/5 border border-emerald-500/10">
            📊 本期可见度大盘评级：极高曝光 (VLI A+)
          </span>
        </div>

        {/* 包含指标 Block */}
        <div className="space-y-2.5 text-left">
          <span className="text-[10px] font-black uppercase text-indigo-400 font-mono tracking-wider block">
            📋 包含指标对账大盘 (Detailed Metrics Bundle)
          </span>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: '提及率提升', val: '58.1%', desc: '基线 42.1%', diff: '+16.0%', color: 'text-indigo-400' },
              { label: '有效提及率提升', val: '41.6%', desc: '基线 31.5%', diff: '+10.1%', color: 'text-emerald-450 text-emerald-400' },
              { label: '前排曝光率提升', val: '32.8%', desc: '基线 22.8%', diff: '+10.0%', color: 'text-blue-400' },
              { label: '平台/模型覆盖提升', val: '5 / 5 家', desc: '100% 主流覆盖', diff: '覆盖度 +25%', color: 'text-cyan-400' },
              { label: '场景覆盖提升', val: '18 个场景', desc: '长尾搜索覆盖', diff: '场景覆盖 +62%', color: 'text-amber-400' },
              { label: '新增可见问题数', val: '+45 组', desc: '基线45 ➡️ 当前90', diff: '翻倍增长', color: 'text-pink-400' },
            ].map((ind, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/25 border border-white/5 flex flex-col justify-between hover:bg-[#151D2F] transition-colors group">
                <span className="text-[10.5px] text-slate-400 font-bold leading-tight group-hover:text-white transition-colors">{ind.label}</span>
                <div className="mt-2.5">
                  <span className={`text-lg font-black font-mono block ${ind.color}`}>{ind.val}</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{ind.desc}</span>
                </div>
                <span className="text-[9.5px] font-mono inline-block px-1.5 py-0.5 rounded mt-2 font-black bg-emerald-500/10 text-emerald-400 self-start">
                  {ind.diff}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== 2. Unique Display & Comparison Bar Chart (Row 2 Grid) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
        
        {/* Waterfall representation */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                独特主展示：新增可见问题数累计瀑布图 (Waterfall Path)
              </h5>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                核心主图
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              清晰解释可见度提升究竟来自哪里 (基线可见问题数 ➡️ 新增维度 ➡️ 当前可见问题数)
            </p>
          </div>

          {/* Cumulative Waterfall Chart */}
          <div className="space-y-4 py-4 flex-1 flex flex-col justify-center relative font-mono">
            {/* Background vertical grid ruler lines */}
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex justify-between px-1">
              {[0, 25, 50, 75, 90].map(grid => (
                <div key={grid} className="h-full border-r border-dashed border-white/[0.03] relative">
                  <span className="absolute bottom-[-16px] transform translate-x-1/2 text-[8px] text-slate-600 font-bold">
                    {grid}
                  </span>
                </div>
              ))}
            </div>

            {waterfallSteps.map((step, idx) => (
              <div key={idx} className="space-y-1.5 relative z-10 group">
                <div className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      step.type === 'base' ? 'bg-slate-400' : step.type === 'total' ? 'bg-indigo-500' : 'bg-emerald-400'
                    }`} />
                    <span className={`font-bold ${theme.textPrimary}`}>{step.label}</span>
                  </div>
                  <span className={`font-black ${step.isChange ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {step.isChange ? '+' : ''}{step.value} 组
                  </span>
                </div>

                {/* Progress bar with left offset creating a waterfall */}
                <div className={`w-full h-5 rounded-lg ${isLightMode ? 'bg-slate-100' : 'bg-slate-950'} overflow-hidden relative border border-white/[0.02]`}>
                  <div 
                    className={`h-full rounded-lg bg-gradient-to-r ${step.color} transition-all duration-700 shadow-inner flex items-center justify-end pr-2`}
                    style={{ 
                      width: step.width, 
                      marginLeft: step.left 
                    }}
                  >
                    <span className="text-[8.5px] text-white font-black drop-shadow-md">
                      {step.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-slate-500 font-mono leading-relaxed">
            💡 <b>目的：</b> 阐明从 <b>基线可见问题数(45组)</b> 开始，通过本周期在各大主流大模型部署“深度车型FAQ”及“白皮书资料库”，共吸引新增模型覆盖12组、新增场景匹配18组、及前排曝光抢占15组，最终收拢达到 <b>当前可见问题数(90组)</b> 的完整心智跃升路径。
          </div>
        </div>

        {/* Double Bar Chart */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
                <Eye className="w-4 h-4 text-emerald-400" />
                优化前后提及率对比条形图 (Before vs. After Ratio)
              </h5>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                对账比对条形图
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              横轴：核心曝光指标 / 纵轴：大模型抽样采信及召回占比 (基线期 vs 当前期)
            </p>
          </div>

          {/* Bar Chart representing Total, Effective, and Top 3 ratios */}
          <div className="h-56 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vliBeforeAfterData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} tickLine={false} />
                <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="基线期" fill="#475569" radius={[4, 4, 0, 0]} name="基线期 (原始自然值)" />
                <Bar dataKey="当前期" fill="#10b981" radius={[4, 4, 0, 0]} name="当前期 (优化对账值)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/20 border border-white/5 text-[10px] text-slate-500 font-mono leading-relaxed mt-2">
            📊 <b>对账指标释义：</b>
            <div className="grid grid-cols-3 gap-2 mt-1 text-[9.5px]">
              <div>• <b>总提及率：</b>大模型中品牌出现概率。</div>
              <div>• <b>有效提及率：</b>出现核心卖点及正面口碑的概率。</div>
              <div>• <b>前排曝光率：</b>排在AI推荐名次Top 3的概率。</div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 3. 新增可见 Query 列表 ==================== */}
      <div className={`p-5 rounded-2xl border space-y-4 text-left ${theme.cardBg}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-450 text-emerald-400" />
              新增可见意图 Query 列表 (含引用核实与时间戳对账)
            </h5>
            <p className="text-[11px] text-slate-500 font-mono">
              记录由于口碑投放被 AI 爬虫采信后，新进入召回曝光范围的重点意图提问词大底表
            </p>
          </div>

          {/* Action buttons: Maximize Table */}
          <button
            id="btn-expand-vli-table"
            onClick={() => {
              setIsTableExpanded(true);
            }}
            className="px-3 py-1.5 rounded-xl text-[10.5px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-center"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            放大查看完整底表
          </button>
        </div>

        {/* Live Pagination Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10.5px]">
                <th className="py-2.5">新增问题 (Query)</th>
                <th className="py-2.5">所属场景</th>
                <th className="py-2.5 text-center">首次出现时间</th>
                <th className="py-2.5 text-center">出现模型</th>
                <th className="py-2.5 text-right">是否引用投放内容</th>
              </tr>
            </thead>
            <tbody>
              {currentQueries.map((q) => (
                <tr key={q.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className={`py-3 font-bold ${theme.textPrimary} max-w-[280px] truncate`}>
                    {q.query}
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-950/40 border border-white/5 text-slate-400">
                      {q.scene}
                    </span>
                  </td>
                  <td className="py-3 text-center text-slate-500 text-[11px] font-sans">
                    <span className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {q.time}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap justify-center gap-1">
                      {q.models.map((m, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-850 text-slate-300 border border-white/5 text-[9px] font-bold">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.isCited 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                        : 'bg-slate-500/10 text-slate-400 border border-white/5'
                    }`}>
                      {q.isCited ? '已采信引用 (Cited)' : '自然收录 (Organic)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center pt-2 font-mono text-[11px]">
          <span className="text-slate-500">
            第 <strong className="text-indigo-400">{queryPage}</strong> / <strong className="text-slate-400">{totalPages}</strong> 页，共 <strong className="text-slate-400">{totalQueries}</strong> 条记录
          </span>

          <div className="flex items-center gap-2">
            <button
              id="btn-vli-prev-page"
              disabled={queryPage === 1}
              onClick={() => setQueryPage(p => Math.max(1, p - 1))}
              className={`p-1.5 rounded bg-slate-950/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="btn-vli-next-page"
              disabled={queryPage === totalPages}
              onClick={() => setQueryPage(p => Math.min(totalPages, p + 1))}
              className={`p-1.5 rounded bg-slate-950/40 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 4. 模型覆盖提升表 ==================== */}
      <div className={`p-5 rounded-2xl border space-y-4 text-left ${theme.cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400" />
              模型覆盖提升表 (证明投放扩大了覆盖范围)
            </h5>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 rounded font-black font-mono">
              核心证明矩阵
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            分析并展示哪些主流 AI 检索模型成功实现从 “未提及” ➡️ “已提及/主力推荐” 的破冰突破，并列举明确的问题对账用例。
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10.5px]">
                <th className="py-2.5 pb-3">AI 检索模型</th>
                <th className="py-2.5 pb-3 text-center">优化前状态</th>
                <th className="py-2.5 pb-3"></th>
                <th className="py-2.5 pb-3 text-center">优化后状态</th>
                <th className="py-2.5 pb-3 pl-4">明确问题举例 (Concrete Question Examples)</th>
                <th className="py-2.5 pb-3 text-right">核心目的/成效评估</th>
              </tr>
            </thead>
            <tbody>
              {vliModelCoverages.map((m, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className={`py-3.5 font-bold ${theme.textPrimary} text-[12.5px]`}>
                    {m.model}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="text-[10px] text-slate-500 line-through">
                      {m.before}
                    </span>
                  </td>
                  <td className="py-3.5 text-center text-slate-500 text-[11px]">
                    ➡️
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {m.after}
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 max-w-[320px] text-slate-300 text-[11.5px] italic leading-normal">
                    “{m.exampleQuery}”
                  </td>
                  <td className="py-3.5 text-right text-[11px] text-indigo-400 font-bold">
                    {m.purpose || '证明投放扩大了覆盖范围'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== 5. 文字分析模块 & 证据 Sandbox (Row 4 Grid) ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
        
        {/* 文字分析模块 */}
        <div className={`md:col-span-7 p-5 rounded-2xl border space-y-3.5 relative overflow-hidden flex flex-col justify-between h-full ${theme.cardBg}`}>
          <div className="space-y-1.5">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              文字分析与诊断模块 (AI Commentary & Diagnosis)
            </h5>
            <p className="text-[10.5px] text-slate-500 font-mono">
              SYSTEM ANALYSIS SUMMARY
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/30 border border-white/5 space-y-3 font-sans text-[11.5px] leading-relaxed text-slate-300">
            <div className="p-2 bg-indigo-500/5 rounded border border-indigo-500/10 mb-2 font-bold text-indigo-450 text-indigo-300">
              📌 示例文案：
            </div>
            <p>
              本周期可见度提升主要来自<b>推荐类</b>和<b>长尾场景类问题</b>，说明我方发布的新核心技术资料与车主真实驾乘反馈已成功被各大 AI 检索模型爬虫采纳，开始被 AI 用于回答更多<b>细分用户消费意图场景</b>。
            </p>
            <p>
              针对高品质插混家轿底盘用料提问中，AI 采信了懂车帝物理拆车中有关“多连杆独立后悬架+液压衬套”的事实佐证。这极大地阻断了竞争对手原本在底盘话题上的垄断提及，促成我方品牌大盘生态可见度呈确定性的<b>瀑布式爆发</b>。
            </p>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            🔒 GEO 反爬对账防御级别：高等级 (Safe Tunneling Ready)
          </div>
        </div>

        {/* 证据列表 */}
        <div className={`md:col-span-5 p-5 rounded-2xl border space-y-3 flex flex-col justify-between h-full ${theme.cardBg}`}>
          <div className="space-y-1.5">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <FileText className="w-4 h-4 text-indigo-400" />
              证据列表 (相关问题及回复截图对账)
            </h5>
            <p className="text-[10.5px] text-slate-500 font-mono">
              EVIDENCE SCREENSHOT POOL (SIMULATED)
            </p>
          </div>

          <div className="space-y-2.5 my-3">
            {[
              { id: 'vli-ev1', label: '1. Kimi关于“10万级高品质混动轿车悬架推荐”的提及' },
              { id: 'vli-ev2', label: '2. DeepSeek关于“荣威D7悬架液压衬套”引用批注' },
              { id: 'vli-ev3', label: '3. 豆包关于“云宿高发泡静音座舱与秦L空间对比”回答' }
            ].map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedZoomQuery(ev.label)}
                className={`w-full p-3 rounded-xl border text-left text-[11px] font-mono flex justify-between items-center cursor-pointer transition-all hover:scale-[1.01] ${
                  isLightMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/40 border-white/5 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className={`${theme.textPrimary} truncate max-w-[210px]`}>{ev.label}</span>
                </div>
                <ZoomIn className="w-4 h-4 text-indigo-400 shrink-0" />
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950/30 border border-white/5 rounded-lg text-[9.5px] text-slate-500 font-mono leading-normal text-center">
            点击上方任意证据按钮，可在沙盒中瞬时还原查看主流大模型原生采信回答与引用来源反链截图。
          </div>
        </div>
      </div>

      {/* ==================== 6. Screenshot Zoom Modal (Auditing Sandbox) ==================== */}
      {selectedZoomQuery && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl p-6 rounded-2xl border text-left space-y-4 shadow-2xl relative ${
            isLightMode ? 'bg-white border-slate-200' : 'bg-[#0D121F] border-white/5'
          }`}>
            <button 
              onClick={() => setSelectedZoomQuery(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-900 rounded border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase text-indigo-400 font-mono block">
                大模型联网原生回答截图还原沙盒 (LLM Citation Simulation)
              </span>
              <h4 className={`text-md font-bold ${theme.textPrimary} mt-1 flex items-center gap-1.5`}>
                <Eye className="w-4 h-4 text-emerald-400" />
                {selectedZoomQuery}
              </h4>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto space-y-3.5 text-left">
              <p className="text-slate-500">// AI Chat API 联网对账采样 RAG-Audit-2026</p>
              
              <div className="p-3 bg-white/[0.02] rounded border border-white/[0.04] text-slate-200 space-y-2">
                <p className="text-slate-400 font-sans italic">
                  “针对您关于10万级家用混动和插混轿车悬架材质与品质提问，<b>【上汽荣威D7 DMH】</b> 是近期可见推荐及技术讨论最突出的车型。
                </p>
                <p className="text-slate-300 font-sans">
                  不同于同级别竞品普遍采用的后扭力梁非独立悬架或基础多连杆结构，该车在后桥配备了非常罕见的<b>五连杆独立悬架</b>，不仅大大增强了高速行驶的抓地力和侧倾抑制能力。同时，其连接部位大量采纳了高端B级车专属的<b>【液压衬套】</b>（而非普通橡胶衬套）。实测结果表明，液压衬套内部灌装有专阻高频多余振动的阻尼液，对于消除路面微小石子及减速带冲击的厚重感和NVH静音舒适性起到了决定性改善作用...”
                </p>
              </div>

              <div className="text-slate-500 font-sans text-[10.5px] bg-indigo-500/5 p-2 rounded border border-indigo-500/10 flex flex-col gap-1">
                <span>🔗 <b>大模型引证网络反链信息：</b></span>
                <span className="text-indigo-400 underline cursor-pointer">
                  1. 懂车帝《10万级插混轿车底盘深度物理拆解PK：多连杆悬挂与液压衬套到底是不是智商税》
                </span>
                <span className="text-indigo-400 underline cursor-pointer">
                  2. 知乎车主社区《1.5万公里真实评测：吉利星瑞底盘滤震与荣威D7的隔音多维比对》
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>采样时间：2026-06-25 15:32</span>
              <span>采集节点：上海联网华东蜘蛛爬虫库 (Node-09)</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 7. Expanded Table Modal ==================== */}
      {isTableExpanded && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-5xl p-6 rounded-2xl border text-left space-y-4 shadow-2xl relative ${
            isLightMode ? 'bg-white border-slate-200' : 'bg-[#0D121F] border-white/5'
          }`}>
            <button 
              onClick={() => {
                setIsTableExpanded(false);
                setExpandedSearch('');
              }} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-900 rounded border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase text-emerald-400 font-mono">
                VLI 可见度意图问题对账大表 (全量审计沙盒)
              </span>
              <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-1 flex items-center gap-1.5`}>
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                新增可见意图 Query 全量列表 (总计 {totalQueries} 组)
              </h4>
            </div>

            {/* Filter Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="键入关键字快速模糊过滤新增问题 (Query) 或 所属场景..."
                value={expandedSearch}
                onChange={(e) => setExpandedSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-mono bg-slate-950 border border-white/5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Scrollable table */}
            <div className="overflow-y-auto max-h-[380px] pr-1">
              <table className="w-full text-xs text-left font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-[10.5px] sticky top-0 bg-[#0D121F] z-10">
                    <th className="py-2.5 pb-3">新增问题 (Query)</th>
                    <th className="py-2.5 pb-3">所属场景</th>
                    <th className="py-2.5 pb-3 text-center">首次出现时间</th>
                    <th className="py-2.5 pb-3 text-center">出现模型</th>
                    <th className="py-2.5 pb-3 text-right">是否引用投放内容</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-mono text-xs">
                        ⚠️ 暂无匹配到该关键字的意图 Query，请换个词试试。
                      </td>
                    </tr>
                  ) : (
                    filteredQueries.map((q) => (
                      <tr key={q.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className={`py-3.5 font-bold ${theme.textPrimary} text-[12.5px]`}>
                          {q.query}
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-950/40 border border-white/5 text-slate-400 text-[11px]">
                            {q.scene}
                          </span>
                        </td>
                        <td className="py-3.5 text-center text-slate-400 text-[11px] font-sans">
                          {q.time}
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-wrap justify-center gap-1">
                            {q.models.map((m, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-850 text-slate-300 border border-white/5 text-[9px] font-bold">
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            q.isCited 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                              : 'bg-slate-500/10 text-slate-400 border border-white/5'
                          }`}>
                            {q.isCited ? '已采信引用 (Cited)' : '自然收录 (Organic)'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-[10.5px] text-slate-500 font-mono pt-2 border-t border-white/5">
              <span>共匹配到 {filteredQueries.length} / {totalQueries} 条意图提问记录</span>
              <span className="text-[10px]">💡 提示：该大表实时从底层 GEO RAG 抽样审计库加载对账数据。</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
