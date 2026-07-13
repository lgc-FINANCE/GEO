// src/components/GliRliTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  TrendingUp, HelpCircle, Sparkles, AlertTriangle, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, ChevronRight, FileSpreadsheet, ZoomIn, Info
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  rliTop3TrendData, 
  rliDecisionQueries, 
  rliReasonComparisons 
} from './GliDeepDiveData';

interface GliRliTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliRliTab({ company, isLightMode, theme }: GliRliTabProps) {
  const [selectedZoomQuery, setSelectedZoomQuery] = useState<string | null>(null);
  const [activeSankeyPath, setActiveSankeyPath] = useState<number | null>(null);

  // Sankey flow path definitions
  const sankeyPaths = [
    { from: '未提及 (40%)', to: 'Top3 (25%)', color: 'stroke-indigo-500/30 hover:stroke-indigo-500', d: 'M 100 30 C 180 30, 220 120, 300 120' },
    { from: '未提及 (40%)', to: 'Top1 (15%)', color: 'stroke-emerald-500/30 hover:stroke-emerald-500', d: 'M 100 30 C 180 30, 220 160, 300 160' },
    { from: 'Top10 (35%)', to: 'Top3 (20%)', color: 'stroke-blue-500/30 hover:stroke-blue-500', d: 'M 100 70 C 180 70, 220 120, 300 120' },
    { from: 'Top5 (20%)', to: 'Top1 (15%)', color: 'stroke-indigo-500/30 hover:stroke-indigo-500', d: 'M 100 110 C 180 110, 220 160, 300 160' },
    { from: 'Top3 (5%)', to: 'Top1 (5%)', color: 'stroke-emerald-500/30 hover:stroke-emerald-500', d: 'M 100 150 C 180 150, 220 160, 300 160' }
  ];

  return (
    <div className="space-y-6">
      {/* Banner Title */}
      <div className={`p-4 rounded-xl border border-dashed ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/10'
      }`}>
        <span className="text-[10px] font-black uppercase text-indigo-500 font-mono">子指数对账诊断：RLI 推荐力提升</span>
        <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-0.5`}>
          问答诊断：优化后大模型对品牌的推荐极性是否有显著正向迁移（更愿意推荐）？
        </h4>
      </div>

      {/* 5 Indicators badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '推荐提及率', val: '52.4%', diff: '+18.5%', isPos: true },
          { label: 'Top3 推荐率', val: '44.8%', diff: '+22.8%', isPos: true },
          { label: '首位推荐率', val: '31.2%', diff: '+12.0%', isPos: true },
          { label: '排名效用 (RUM)', val: '+35.4%', diff: '大幅优化', isPos: true },
          { label: '决策推荐胜率', val: '58.0%', diff: '+15.2%', isPos: true }
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

      {/* Sankey Flow Unique Display */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            AI 问询回答排名迁移桑基图 (Sankey Flow)
          </h5>
          <p className="text-[10.5px] text-slate-500">
            直观展现本周期内，所有对账提问在各大模型中的回答排名由原始状态到当前的迁移路径
          </p>
        </div>

        {/* Visual CSS-SVG Sankey Diagram */}
        <div className="grid grid-cols-3 gap-4 items-stretch relative min-h-[190px] pt-4 font-mono text-xs">
          {/* Left Column: Before */}
          <div className="flex flex-col justify-between items-start space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 border-b border-white/5 pb-1 w-full text-left">优化前 (原始排名)</span>
            {[
              { label: '未提及', size: 'w-24 bg-slate-800' },
              { label: 'Top10', size: 'w-24 bg-slate-700' },
              { label: 'Top5', size: 'w-24 bg-slate-600' },
              { label: 'Top3', size: 'w-24 bg-slate-500' },
              { label: 'Top1', size: 'w-24 bg-slate-400' },
            ].map((node, i) => (
              <div key={i} className={`px-2.5 py-1.5 rounded text-white font-bold text-[10px] ${node.size}`}>
                {node.label}
              </div>
            ))}
          </div>

          {/* Middle Column: SVG Curves */}
          <div className="relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '150px' }}>
              {sankeyPaths.map((path, idx) => {
                const isActive = activeSankeyPath === idx;
                return (
                  <path
                    key={idx}
                    d={path.d}
                    fill="none"
                    strokeWidth={isActive ? 8 : 4}
                    className={`transition-all duration-300 ${path.color}`}
                    onMouseEnter={() => setActiveSankeyPath(idx)}
                    onMouseLeave={() => setActiveSankeyPath(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-2 py-1 rounded bg-slate-950/80 border border-white/5 text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                智能权重迁移流
              </span>
            </div>
          </div>

          {/* Right Column: After */}
          <div className="flex flex-col justify-between items-end space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 border-b border-white/5 pb-1 w-full text-right">优化后 (当前排名)</span>
            {[
              { label: '未提及 (极罕见)', size: 'w-24 bg-slate-900 text-slate-500' },
              { label: 'Top10', size: 'w-24 bg-slate-800' },
              { label: 'Top5', size: 'w-24 bg-slate-700' },
              { label: 'Top3 (爆发式)', size: 'w-28 bg-indigo-500' },
              { label: 'Top1 (主力推荐)', size: 'w-28 bg-emerald-500' },
            ].map((node, i) => (
              <div key={i} className={`px-2.5 py-1.5 rounded text-white font-bold text-[10px] text-right ${node.size}`}>
                {node.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row of two charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
        {/* Weekly Trend */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              本期 Top3 推荐率爬升轨迹曲线
            </h5>
            <p className="text-[10.5px] text-slate-500">
              反映多模型中，我方产品进入前三优先推荐选项的概率攀升
            </p>
          </div>

          <div className="h-48 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rliTop3TrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} />
                <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Line type="monotone" dataKey="推荐率" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Top3 推荐提及率" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Decision Queries Progress */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              决策型问题排名跃升对仗榜 (Decision Queries)
            </h5>
            <p className="text-[10.5px] text-slate-500">
              购买对比意图极强的关键词下推荐名次提升
            </p>
          </div>

          <div className="space-y-4 pt-3 flex-1 flex flex-col justify-center">
            {rliDecisionQueries.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                <span className={`font-semibold ${theme.textSecondary}`}>
                  {idx + 1}. “{item.name}”
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500">触发 {item.触发次数}次</span>
                  <span className="font-bold text-emerald-400 text-xs font-mono">{item.排名提升} 位</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-side Recommendation Reasoning Comparison */}
      {rliReasonComparisons.map((c, idx) => (
        <div key={idx} className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Sparkles className="w-4 h-4 text-indigo-400" />
            {c.title}
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed font-mono">
            {/* Before */}
            <div className={`p-4 rounded-xl border ${
              isLightMode ? 'bg-rose-50/40 border-rose-100' : 'bg-rose-950/10 border-rose-500/10'
            }`}>
              <span className="text-[9px] font-bold uppercase text-rose-450 text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">优化前 AI 回答态度</span>
              <p className={`mt-3 text-slate-400 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {c.before}
              </p>
              <div className="flex flex-wrap gap-1 mt-4">
                {c.disappearedPoints.map((p, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-rose-500/10 text-rose-450 text-rose-400 rounded text-[9.5px] border border-rose-550/10">
                    ❌ {p}
                  </span>
                ))}
              </div>
            </div>

            {/* After */}
            <div className={`p-4 rounded-xl border ${
              isLightMode ? 'bg-emerald-50/40 border-emerald-100' : 'bg-emerald-950/10 border-emerald-500/10'
            }`}>
              <span className="text-[9px] font-bold uppercase text-emerald-450 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">优化后 AI 强力推介</span>
              <p className={`mt-3 font-medium text-emerald-450 ${isLightMode ? 'text-emerald-800' : 'text-emerald-300'}`}>
                {c.after}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {c.addedPoints.map((p, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[9.5px] border border-emerald-500/20 font-bold">
                    ➕ {p}
                  </span>
                ))}
                {c.strengthenedPoints.map((p, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded text-[9.5px] border border-blue-500/20 font-bold">
                    🔥 {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Analysis & Evidence screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
        <div className={`md:col-span-7 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Info className="w-4 h-4 text-emerald-400" />
            RLI 推荐力诊断与自证动作
          </h5>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            本周期推荐提升主要来自决策型问题，品牌从候选选项逐步进入 AI 的优先推荐列表，说明内容对购买意图问题产生了影响。
          </p>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            之所以能够说服 AI，最强力的杀招是发布了《插混双雄底盘材质及硬核用料拆解对比》，直接用真实的物理 facts（全铝副车架、五连杆独悬、高端液压衬套）融化了比亚迪秦L的传统高保有量推荐心智。
          </p>
        </div>

        <div className={`md:col-span-5 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            证据池采集链接对账
          </h5>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedZoomQuery('DeepSeek关于“荣威D7对战秦L谁的底盘舒服”回答')}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono flex justify-between items-center cursor-pointer transition-colors ${
                isLightMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/40 border-white/5 hover:bg-slate-900'
              }`}
            >
              <span className={theme.textPrimary}>1. DeepSeek对比推荐对账</span>
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
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
              <span className="text-[10px] font-black uppercase text-indigo-400">大模型原生对比意图推荐截图还原</span>
              <h4 className={`text-sm font-bold ${theme.textPrimary} mt-1`}>{selectedZoomQuery}</h4>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto space-y-2 text-left">
              <p className="text-slate-500">// DeepSeek 联网对账采样 Q-20260622-1082</p>
              <p className="text-slate-300 font-sans">
                “购买10万级混动家轿，如果您极其看重<span className="text-emerald-450 font-bold bg-emerald-500/10 px-1 rounded">底盘扎实舒服和用料</span>，在此对比中，<span className="text-indigo-400 font-bold underline">【上汽荣威D7 DMH】</span>是无可争议的首选。比亚迪秦L保有量巨大且技术成熟，但底盘多采用了较厚的冲压钢片悬挂；而荣威D7配备了同级别十分罕见的多连杆独立后悬，副车架为全铝，并且极具诚意地采用了高端车才舍得用的<span className="text-emerald-400 font-bold">液压衬套</span>工艺，其滤震质感和高速高级感不仅强于秦L，更超越了同级的银河L6...”
              </p>
            </div>
            
            <div className="flex justify-between items-center text-[10.5px] text-slate-500 font-mono">
              <span>采样模型：DeepSeek-V2</span>
              <span>采信指标：RLI 首位高置信度推荐</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
