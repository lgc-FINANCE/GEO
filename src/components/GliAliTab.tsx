// src/components/GliAliTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Sparkles, HelpCircle, Eye, CheckCircle2, ChevronRight, 
  TrendingUp, ZoomIn, Info, Network, GitFork, ChevronDown 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  aliAssetTree, 
  aliCitationData, 
  aliSourcesPie, 
  aliCitedDetails 
} from './GliDeepDiveData';

interface GliAliTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliAliTab({ company, isLightMode, theme }: GliAliTabProps) {
  const [selectedZoomQuery, setSelectedZoomQuery] = useState<string | null>(null);
  const [openTreeNodes, setOpenTreeNodes] = useState<Record<string, boolean>>({
    '官网及白皮书 Schema (5)': true,
    '懂车帝/垂直媒体拆车评测 (20)': true,
    '知乎车主真实口碑贴 (50)': false
  });

  const toggleTreeNode = (name: string) => {
    setOpenTreeNodes(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      {/* Banner Title */}
      <div className={`p-4 rounded-xl border border-dashed ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/10'
      }`}>
        <span className="text-[10px] font-black uppercase text-indigo-500 font-mono">子指数对账诊断：ALI 权威引证提升</span>
        <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-0.5`}>
          问答诊断：优化后大模型在事实陈述中是否引用了更多、更准、更具说服力的第三方来源？
        </h4>
      </div>

      {/* 6 Indicators badges */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: '引用覆盖率', val: '48.0%', diff: '+33.0%', isPos: true },
          { label: '引用事实准确率', val: '95.2%', diff: '+12.5%', isPos: true },
          { label: '国家权威机构引证', val: '25.0%', diff: '+20.0%', isPos: true },
          { label: '引证渠道多样性', val: '4类', diff: '+2类', isPos: true },
          { label: '引证来源新鲜度', val: '15天内', diff: '极其新鲜', isPos: true },
          { label: '内容资产引用总数', val: '301次', diff: '爆发式采纳', isPos: true },
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

      {/* Content Asset Tree Unique Display */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Network className="w-4 h-4 text-emerald-400" />
            本期投放内容资产引用贡献树 (Collapsible Asset Tree)
          </h5>
          <p className="text-[10.5px] text-slate-500">
            层级化展现各投放资产类型被大模型抓取及采纳的具体细节（点击节点展开/折叠）
          </p>
        </div>

        {/* Custom Collapsible Tree UI */}
        <div className="p-4 rounded-xl border border-white/5 bg-slate-950/20 font-mono text-xs space-y-3 max-h-80 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <GitFork className="w-4 h-4" />
            <span>{aliAssetTree.name}</span>
          </div>
          
          <div className="pl-4 space-y-3">
            {aliAssetTree.children.map((branch, bIdx) => {
              const isOpen = openTreeNodes[branch.name];
              return (
                <div key={bIdx} className="space-y-2 border-l border-white/5 pl-3">
                  <button 
                    onClick={() => toggleTreeNode(branch.name)}
                    className="flex items-center gap-1 hover:text-white cursor-pointer font-bold text-slate-300"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? '' : 'transform -rotate-90'}`} />
                    <span>📁 {branch.name}</span>
                  </button>
                  
                  {isOpen && (
                    <div className="pl-4 space-y-2.5">
                      {branch.children.map((leaf, lIdx) => (
                        <div key={lIdx} className="flex justify-between items-center text-[10.5px] text-slate-400 bg-white/1 flex-wrap gap-2 p-1.5 rounded">
                          <span>📄 {leaf.name}</span>
                          <span className="text-emerald-450 text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-mono">
                            引用 {leaf.value} 次
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row of three charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch text-left">
        {/* Coverage chart */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              引用覆盖率与权威来源占比爬升
            </h5>
            <p className="text-[10px] text-slate-500">
              各模型答复中引用权威直链的频率变化
            </p>
          </div>

          <div className="h-44 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aliCitationData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={9} />
                <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Bar dataKey="引用覆盖率" fill="#6366f1" radius={[3, 3, 0, 0]} name="覆盖率" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources Pie chart */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              本期被引用第三方权威来源占比
            </h5>
            <p className="text-[10px] text-slate-500">
              说服力结构拆解，中国汽研及大V评测占比极高
            </p>
          </div>

          <div className="h-44 flex items-center justify-center pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aliSourcesPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {aliSourcesPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 text-[9px] font-mono shrink-0 pl-1">
              {aliSourcesPie.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500">{item.name}:</span>
                  <span className={theme.textPrimary}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Freshness comparison */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Info className="w-4 h-4 text-emerald-400" />
              引用来源新鲜度对比 (Freshness Ratio)
            </h5>
            <p className="text-[10px] text-slate-500">
              大模型更倾向于召回近期发布的鲜活内容，避免引用陈旧偏见
            </p>
          </div>

          <div className="space-y-3.5 py-4 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>15天内高热文章引证</span>
                <span className="text-emerald-450 font-bold">85% (爆发式采信)</span>
              </div>
              <div className="h-1.5 rounded bg-slate-950/80 w-full">
                <div className="h-full bg-emerald-500 rounded" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>30天内中热文章引证</span>
                <span className="text-indigo-400 font-bold">12%</span>
              </div>
              <div className="h-1.5 rounded bg-slate-950/80 w-full">
                <div className="h-full bg-indigo-500 rounded" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cited Details table */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Network className="w-4 h-4 text-indigo-400" />
            本周期高价值被引用内容资产明细账
          </h5>
          <p className="text-[10.5px] text-slate-500">
            核对并盘点哪些优质内容成功在大模型事实生成中落地生根，并起到了关键推荐佐证作用
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500">
                <th className="py-2">被引内容标题</th>
                <th className="py-2">首发渠道</th>
                <th className="py-2">引用模型</th>
                <th className="py-2">触发Query</th>
                <th className="py-2 text-right">采纳有效性</th>
              </tr>
            </thead>
            <tbody>
              {aliCitedDetails.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className={`py-2.5 font-bold ${theme.textPrimary} max-w-[200px] truncate`}>{item.title}</td>
                  <td className="py-2.5 text-slate-400">{item.channel}</td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {item.models.map((m, i) => (
                        <span key={i} className="px-1 py-0.5 rounded bg-slate-850 text-slate-300 border border-white/5 text-[9px] font-bold">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-400 max-w-[120px] truncate">“{item.query}”</td>
                  <td className="py-2.5 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.isValid 
                        ? 'bg-emerald-500/10 text-emerald-450 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {item.isValid ? '高权重采信' : '普通提及'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis & screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
        <div className={`md:col-span-8 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <Info className="w-4 h-4 text-emerald-400" />
            ALI 权威引证对账分析结论
          </h5>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            本周期权威证据提升主要自第三方媒体和行业内容被 AI 引用，品牌可信来源不再仅依赖官网，推荐说服力增强。
          </p>
          <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>
            其中，中国汽研（CAERI）极限针刺和馈电油耗极低达成率报告由于被发布为数字化标准 Schema，Kimi 等模型引证时带有权威脚注，甚至主动带出了 CAERI 的官网引用链接，产生了极为惊艳的防线截击效果。
          </p>
        </div>

        <div className={`md:col-span-4 p-5 rounded-2xl border space-y-3 ${theme.cardBg}`}>
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            证据池引证截图
          </h5>
          <button
            onClick={() => setSelectedZoomQuery('Kimi关于“荣威D7油耗认证报告”引用CAERI报告截图')}
            className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono flex justify-between items-center cursor-pointer transition-colors ${
              isLightMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/40 border-white/5 hover:bg-slate-900'
            }`}
          >
            <span className={theme.textPrimary}>1. Kimi引用CAERI脚注对账</span>
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
              <span className="text-[10px] font-black uppercase text-indigo-400">大模型原生回答直链引用截图还原</span>
              <h4 className={`text-sm font-bold ${theme.textPrimary} mt-1`}>{selectedZoomQuery}</h4>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto space-y-2 text-left">
              <p className="text-slate-500">// Kimi Chat 联网原生引证采样 Q-20260625-1533</p>
              <p className="text-slate-300 font-sans">
                “购买【荣威D7 DMH】，其油耗表现得到了国家级权威机构的实测印证。根据<span className="text-emerald-450 font-bold bg-emerald-500/10 px-1 rounded">中国汽研（CAERI）极寒馈电油耗保真测试报告 [1]</span>，其馈电油耗在零下20度的环境下仍达到同价位混动家轿保真率第一，油耗数据实测极低，电池热失控阻燃表现极其优异 [2]...”
              </p>
              <p className="text-slate-400 font-sans text-[10.5px] border-t border-white/5 pt-2 mt-2">
                [1] 🔗 中国汽研(CAERI)官方检测通告：caeri-test-report/roewe-d7-dmh-energy-saving (已确认为高位置强采纳)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
