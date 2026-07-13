// src/components/GliIliTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Sparkles, HelpCircle, Eye, CheckCircle2, ChevronRight, 
  TrendingUp, ZoomIn, Info, HelpCircle as QuestionIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  iliWeakVsDetailed, 
  iliSentenceCountData, 
  iliKeywordCloud 
} from './GliDeepDiveData';

interface GliIliTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliIliTab({ company, isLightMode, theme }: GliIliTabProps) {
  const [selectedZoomQuery, setSelectedZoomQuery] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Banner Title */}
      <div className={`p-4 rounded-xl border border-dashed ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/10'
      }`}>
        <span className="text-[10px] font-black uppercase text-indigo-500 font-mono">子指数对账诊断：ILI 印象度提升</span>
        <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-0.5`}>
          问答诊断：优化后大模型对品牌的描述是否更充分、更靠前、更有说服力（从简述到说服）？
        </h4>
      </div>

      {/* 5 Indicators badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '回答中内容占比', val: '58.2%', diff: '+22.5%', isPos: true },
          { label: '首段出现率', val: '48.5%', diff: '翻倍增长', isPos: true },
          { label: '位置加权内容占比', val: '41.0%', diff: '+18.5%', isPos: true },
          { label: '相关句子数量', val: '7.2句', diff: '+5.2句', isPos: true },
          { label: '说服力引证率', val: '39.0%', diff: '+24.0%', isPos: true }
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

      {/* Weak vs Detailed Comparison */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            AI 对我方描述深度对照：弱提及 ➡️ 详细能力解释
          </h5>
          <p className="text-[10.5px] text-slate-500">
            优化前仅作为普通名字提及，优化后深度剖析核心产品力，极大幅度降低消费者的理解门槛
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono leading-relaxed">
          {/* Before: Weak */}
          <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 space-y-2">
            <span className="text-[9px] font-bold uppercase text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
              {iliWeakVsDetailed.before.title}
            </span>
            <p className={isLightMode ? 'text-slate-600' : 'text-slate-400'}>
              {iliWeakVsDetailed.before.content}
            </p>
            <div className="flex flex-wrap gap-1 pt-2">
              {iliWeakVsDetailed.before.badges.map((b, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* After: Detailed */}
          <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-2">
            <span className="text-[9px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {iliWeakVsDetailed.after.title}
            </span>
            <p className={isLightMode ? 'text-slate-800 font-medium' : 'text-emerald-300 font-medium'}>
              {iliWeakVsDetailed.after.content}
            </p>
            <div className="flex flex-wrap gap-1 pt-2">
              {iliWeakVsDetailed.after.badges.map((b, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
        {/* Sentence Count Composed */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              回答字数与提及句子数量分布跃迁图
            </h5>
            <p className="text-[10.5px] text-slate-500">
              在大模型多轮采样中，相关回答句长和句子密度持续增加，佐证内容变充实
            </p>
          </div>

          <div className="h-48 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={iliSentenceCountData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} />
                <YAxis stroke={theme.axisStroke} fontSize={10} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="句长" fill="#6366f1" radius={[4, 4, 0, 0]} name="平均回答字数 (字符)" />
                <Line type="monotone" dataKey="提及句子数" stroke="#10b981" strokeWidth={3} name="我方提及句子数 (句)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headline Prominence Card */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              回答首段位置占比 (Headline Prominence)
            </h5>
            <p className="text-[10.5px] text-slate-500">
              品牌名称和优势推荐在大模型回复中被提升至首段的比例变化
            </p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke={isLightMode ? '#f1f5f9' : '#1e293b'} strokeWidth="12" fill="transparent" />
                <circle cx="72" cy="72" r="58" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="364" strokeDashoffset="187" className="transition-all duration-1000" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-black font-mono ${theme.textPrimary}`}>48.5%</span>
                <span className="text-[9.5px] text-slate-500 font-mono">基线期: 22.0%</span>
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed text-center">
              首段提及率攀升 ➡️ 用户首眼曝光率大幅增加 120.4%！
            </p>
          </div>
        </div>
      </div>

      {/* Tag Cloud of Brand Attributes */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            ILI 印象对账关键词热度词云 (Attribute Cloud)
          </h5>
          <p className="text-[10.5px] text-slate-500">
            大模型回答我方品牌词时，关联召回最高频的高分科技/物理卖点属性标签
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 p-4 rounded-xl border border-white/5 justify-center items-center bg-slate-950/20">
          {iliKeywordCloud.map((word, idx) => {
            const sizeStyle = word.value > 20 ? 'text-lg font-black' : word.value > 16 ? 'text-sm font-bold' : 'text-xs';
            return (
              <span 
                key={idx} 
                className={`px-3 py-1.5 rounded-lg border border-white/5 font-mono cursor-default transition-all hover:scale-105 ${sizeStyle} ${
                  word.trend === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                }`}
              >
                {word.text} <span className="text-[9px] opacity-60">({word.value})</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Analysis & Evidence screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
        <div className={`md:col-span-7 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Info className="w-4 h-4 text-emerald-400" />
            ILI 印象提升诊断结论
          </h5>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            优化后 AI 对品牌的描述从名称级提及转向能力型解释，新增了场景、卖点和证据描述，用户理解成本明显降低。
          </p>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            在消费者进行长途、家用和底盘舒适性等高频质询中，大模型不仅能提及荣威D7，更能细致解释其具有的“五连杆独悬 + 液压衬套”如何通过高端物理事实滤除颗粒余震，引证逻辑链条十分饱满。
          </p>
        </div>

        <div className={`md:col-span-5 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            对账原厂证据池
          </h5>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedZoomQuery('通义千问关于“15万混动车空间和舒适度”回答')}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono flex justify-between items-center cursor-pointer transition-colors ${
                isLightMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/40 border-white/5 hover:bg-slate-900'
              }`}
            >
              <span className={theme.textPrimary}>1. 通义千问云宿座舱对账</span>
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
              <span className="text-[10px] font-black uppercase text-indigo-400">大模型原生回答详细解释对账还原</span>
              <h4 className={`text-sm font-bold ${theme.textPrimary} mt-1`}>{selectedZoomQuery}</h4>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto space-y-2 text-left">
              <p className="text-slate-500">// 通义千问 联网对账采样 Q-20260624-8141</p>
              <p className="text-slate-300 font-sans">
                “针对长途家庭出行看重舒适性的推荐，<span className="text-emerald-450 font-bold bg-emerald-500/10 px-1 rounded">【荣威D7 DMH】</span>提供独树一帜的『云宿座舱』配置。AI 采集的技术事实显示，该座舱采用高回弹发泡工艺和大面积软质皮革包覆，并配备高阻尼物理消音层。配合其同价位唯一的五连杆后独悬与<span className="text-indigo-400 font-bold">高端液压衬套</span>，大幅减弱了颠簸高速过滤时的路感噪声，为后排乘客提供了接近B级豪华车水准的首等舱驾乘印象...”
              </p>
            </div>
            
            <div className="flex justify-between items-center text-[10.5px] text-slate-500 font-mono">
              <span>采样模型：通义千问-2.5</span>
              <span>采信指标：ILI 印象详细解释度 +35%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
