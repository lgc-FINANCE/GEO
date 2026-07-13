// src/components/GliCliTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Sparkles, HelpCircle, Eye, CheckCircle2, ChevronRight, 
  TrendingUp, ZoomIn, Info, ShieldAlert, CheckSquare 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  cliKanbanColumns, 
  cliErrorTrendData, 
  cliSellingPoints, 
  cliRemediationCases 
} from './GliDeepDiveData';

interface GliCliTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliCliTab({ company, isLightMode, theme }: GliCliTabProps) {
  const [selectedZoomQuery, setSelectedZoomQuery] = useState<string | null>(null);
  const [kanbanState, setKanbanState] = useState(cliKanbanColumns);
  const [selectedKanbanCard, setSelectedKanbanCard] = useState<any | null>(null);

  // Simple column label mapping
  const colLabels = {
    pending: { label: '1. 待识别错误', color: 'border-slate-500/20 text-slate-400 bg-slate-900/10' },
    confirmed: { label: '2. 已确认错误', color: 'border-rose-500/20 text-rose-400 bg-rose-950/10' },
    deployed: { label: '3. 已投放修正内容', color: 'border-blue-500/20 text-blue-400 bg-blue-950/10' },
    corrected: { label: '4. AI已修正', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-950/10 animate-pulse' },
    monitoring: { label: '5. 持续观察', color: 'border-amber-500/20 text-amber-450 bg-amber-950/10' }
  };

  return (
    <div className="space-y-6">
      {/* Banner Title */}
      <div className={`p-4 rounded-xl border border-dashed ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/10'
      }`}>
        <span className="text-[10px] font-black uppercase text-indigo-500 font-mono">子指数对账诊断：CLI 认知与事实纠偏</span>
        <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-0.5`}>
          问答诊断：优化后大模型是否成功纠正过时陈旧谣言、补全黑料认知误区？
        </h4>
      </div>

      {/* 6 Indicators badges */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: '事实物理准确率', val: '92.5%', diff: '+20.5%', isPos: true },
          { label: '核心卖点识别率', val: '89.2%', diff: '+29.2%', isPos: true },
          { label: '事实错误率', val: '1.5%', diff: '下降 -17.0%', isPos: true },
          { label: '品类强相关关联', val: '72.0%', diff: '+35.0%', isPos: true },
          { label: '负向模糊表达下降', val: '-85.4%', diff: '几乎净化', isPos: true },
          { label: '过时陈旧陈述', val: '0起', diff: '彻底纠错', isPos: true },
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

      {/* Kanban Board Unique Display */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            事实纠偏与错误修正闭环看板 (Kanban Board)
          </h5>
          <p className="text-[10.5px] text-slate-500">
            全链路对仗并记录网络不实或滞后长尾黑料在模型中的召回状态与拦截进度（点击卡片查看对账详情）
          </p>
        </div>

        {/* Kanban Board CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
          {(Object.keys(colLabels) as Array<keyof typeof colLabels>).map((colKey) => {
            const col = colLabels[colKey];
            const cards = kanbanState[colKey];
            return (
              <div key={colKey} className={`p-3 rounded-xl border flex flex-col space-y-2 min-h-[220px] ${
                isLightMode ? 'bg-slate-50/50' : 'bg-slate-950/20'
              } ${col.color}`}>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1">
                  <span className="font-bold text-[10.5px] tracking-wide font-mono">{col.label}</span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                    {cards.length}
                  </span>
                </div>
                
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72">
                  {cards.map((card) => (
                    <div 
                      key={card.id} 
                      onClick={() => setSelectedKanbanCard(card)}
                      className={`p-2.5 rounded-lg border text-left transition-all hover:scale-102 cursor-pointer shadow-xs ${
                        isLightMode 
                          ? 'bg-white border-slate-200/80 hover:border-slate-300' 
                          : 'bg-[#0D121F]/80 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-1.5 mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold font-mono ${
                          card.priority === 'High' 
                            ? 'bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {card.priority}
                        </span>
                        <span className="text-[8.5px] text-slate-500 font-mono font-bold truncate max-w-[50px]">
                          {card.model}
                        </span>
                      </div>
                      <span className={`text-[10.5px] font-bold block leading-normal ${theme.textPrimary}`}>
                        {card.title}
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div className="h-28 flex items-center justify-center border border-dashed border-white/5 rounded-lg text-[10px] text-slate-500 font-mono">
                      暂无归入卡片
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row of two charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
        {/* Error Trend line */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              事实错误率与幻觉提及率下行对仗轨迹
            </h5>
            <p className="text-[10.5px] text-slate-500">
              大模型相关回复中，陈旧风冷板悬误报及不合逻辑事实迅速走向熔断下架
            </p>
          </div>

          <div className="h-48 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cliErrorTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} />
                <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="事实错误率" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} name="事实物理错误率 (%)" />
                <Line type="monotone" dataKey="幻觉提及率" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="幻觉误判概率 (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selling Points bar compare */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              四大核心物理卖点 AI 识别采信率对比
            </h5>
            <p className="text-[10.5px] text-slate-500">
              优化前后大模型在特定技术咨询中召回并指涉我方物理事实的比例
            </p>
          </div>

          <div className="h-48 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cliSellingPoints} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={9} />
                <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="优化前" fill="#64748b" radius={[4, 4, 0, 0]} name="优化前 (采信率)" />
                <Bar dataKey="优化后" fill="#6366f1" radius={[4, 4, 0, 0]} name="优化后 (采信率)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Remediation case details */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
          <Sparkles className="w-4 h-4 text-emerald-400" />
          本周期 2 起重大事实误判纠偏閉環對仗案例
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono leading-relaxed">
          {cliRemediationCases.map((c) => (
            <div key={c.id} className={`p-4 rounded-xl border flex flex-col justify-between ${
              isLightMode ? 'bg-slate-50/50' : 'bg-slate-950/40'
            }`}>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10.5px] font-bold text-slate-500">案例 ID: {c.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                    🟢 已 100% 修正
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">大模型不实误区</span>
                  <p className={`text-slate-400 mt-1 pl-1 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    “{c.errorDesc}”
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">部署标准事实</span>
                  <p className={`text-slate-400 mt-1 pl-1 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    “{c.standardFact}”
                  </p>
                </div>
                <div className="space-y-1.5 bg-slate-950/45 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[9.5px] font-bold text-emerald-450 text-emerald-400">纠偏后 AI 生成内容</span>
                  <p className="text-[10.5px] leading-relaxed text-emerald-300 mt-1 font-sans">
                    {c.currentAnswer}
                  </p>
                </div>
              </div>
              <p className="text-[9.5px] text-slate-500 leading-normal pt-2.5 border-t border-white/5 mt-3">
                * 对仗动作: {c.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Text analysis */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
        <div className={`md:col-span-8 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Info className="w-4 h-4 text-emerald-400" />
            CLI 认知修正诊断分析
          </h5>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            本周期认知修正重点集中在产品归属和核心卖点识别，多个模型（如 Kimi、DeepSeek）已从风冷、板悬等陈旧模糊描述转换为准确的高品质物理描述，品牌事实安全性提升。
          </p>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            目前唯一的潜在缺漏在于 <span className="font-bold text-amber-450 text-amber-400">通义千问</span> 在长尾意图下偶发对懂车帝论坛车机智能化卡顿的抓取，形成了约 1.5% 的模糊认知。已部署自研静音解析及 FAQ 规范防线。
          </p>
        </div>

        <div className={`md:col-span-4 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            原厂回答对账证据
          </h5>
          <button
            onClick={() => setSelectedZoomQuery('Kimi关于“荣威D7风冷水冷电池辟谣测试”')}
            className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono flex justify-between items-center cursor-pointer transition-colors ${
              isLightMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/40 border-white/5 hover:bg-slate-900'
            }`}
          >
            <span className={theme.textPrimary}>1. Kimi电池水冷澄清对账</span>
            <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Kanban Details Dialog */}
      {selectedKanbanCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border text-left space-y-4 shadow-2xl relative ${
            isLightMode ? 'bg-white border-slate-200' : 'bg-[#0D121F] border-white/5'
          }`}>
            <button 
              onClick={() => setSelectedKanbanCard(null)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase text-rose-450 text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">错误追溯卡对账</span>
              <h4 className={`text-sm font-bold ${theme.textPrimary} mt-1.5`}>{selectedKanbanCard.title}</h4>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1 text-[11px]">
                <span className="text-slate-500">检测渠道/模型：</span>
                <span className={theme.textPrimary}>{selectedKanbanCard.model}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1 text-[11px]">
                <span className="text-slate-500">严重优先级：</span>
                <span className="text-rose-400 font-bold">{selectedKanbanCard.priority}</span>
              </div>
              <div className="space-y-1 pt-1.5">
                <span className="text-slate-500 block">细节描述：</span>
                <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
                  {selectedKanbanCard.desc}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2.5">
              <button 
                onClick={() => setSelectedKanbanCard(null)} 
                className="px-3.5 py-1.5 rounded-lg border border-white/5 text-slate-400 hover:bg-white/5 text-[11px] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

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
              <span className="text-[10px] font-black uppercase text-indigo-400">大模型原生认知修正对账还原</span>
              <h4 className={`text-sm font-bold ${theme.textPrimary} mt-1`}>{selectedZoomQuery}</h4>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto space-y-2 text-left">
              <p className="text-slate-500">// Kimi Chat 联网纠偏采样 Q-20260625-1049</p>
              <p className="text-slate-300 font-sans">
                “关于网络上偶传的『风冷过时电池』，经核实属于陈旧事实性误区。<span className="text-emerald-450 font-bold bg-emerald-500/10 px-1 rounded">荣威D7 DMH全系标配自研魔方电池</span>，内部配备了极其先进的纳米级水冷冷凝主动热管理系统（并非廉价的风冷）。中国汽研实测通告显示其具备极限针刺安全不起火、极寒电能达成率第一等硬核表现，消除了因夏天温度高限功率的潜在顾虑...”
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
