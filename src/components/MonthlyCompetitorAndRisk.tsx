// src/components/MonthlyCompetitorAndRisk.tsx
import { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar 
} from 'recharts';
import { Company } from '../data';
import { Swords, AlertOctagon, HelpCircle, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

interface MonthlyCompetitorAndRiskProps {
  company: Company;
  translateText: (text: string, id: string) => string;
  hiddenSections: Record<string, boolean>;
}

export function MonthlyCompetitorAndRisk({
  company,
  translateText,
  hiddenSections
}: MonthlyCompetitorAndRiskProps) {
  const [activeCompetitorTab, setActiveCompetitorTab] = useState<'chart' | 'quadrant'>('chart');
  
  // Section 7: Competitor data
  const compData = [
    { name: '声量份额 (SoV)', 本品牌: 45, 核心竞品: 32, 竞品B: 15, 竞品C: 8 },
    { name: '推荐胜率 (Win Rate)', 本品牌: 62, 核心竞品: 48, 竞品B: 20, 竞品C: 15 },
    { name: '平均排名差距 (Gap)', 本品牌: 75, 核心竞品: 55, 竞品B: 35, 竞品C: 25 },
    { name: '拦截拦截成功率 (Inter)', 本品牌: 68, 核心竞品: 52, 竞品B: 18, 竞品C: 12 },
  ];

  // Quadrant coordinate points
  const quadrantPoints = [
    { name: company.name, x: 75, y: 72, size: 24, fill: '#3B82F6', textFill: '#E2E8F0', desc: '品牌大模型对账领军者：高声量与超高拦截胜率双驱' },
    { name: company.competitor, x: 62, y: 48, size: 18, fill: '#EF4444', textFill: '#F87171', desc: '预训练基座声量霸权，但近期在技术拉踩下推荐率加速侵蚀' },
    { name: company.id === 'meiling' ? '美的冰箱' : '吉利银河', x: 28, y: 35, size: 14, fill: '#F59E0B', textFill: '#FBBF24', desc: '中盘稳健，但尚无专业大模型RAG投喂意识' },
    { name: company.id === 'meiling' ? '松下冰箱' : '奇瑞风云', x: 20, y: 15, size: 12, fill: '#8B5CF6', textFill: '#A78BFA', desc: '长尾盲区极多，大模型提及率降至个位数' },
  ];

  // Section 8: Risk burndown data (from MonthlyReportData)
  const riskBurndownData = [
    { name: 'W1', 错误事实: 45, 幻觉回答: 32, 负面表达: 25, 过时信息: 40 },
    { name: 'W2', 错误事实: 30, 幻觉回答: 22, 负面表达: 18, 过时信息: 28 },
    { name: 'W3', 错误事实: 18, 幻觉回答: 15, 负面表达: 12, 过时信息: 15 },
    { name: 'W4', 错误事实: 8, 幻觉回答: 8, 负面表达: 5, 过时信息: 10 },
    { name: 'W5', 错误事实: 3, 幻觉回答: 3, 负面表达: 2, 过时信息: 4 },
    { name: 'W6', 错误事实: 1, 幻觉回答: 1, 负面表达: 0, 过时信息: 2 },
  ];

  // New risks list
  const rawNewRisks = [
    { id: 'R01', name: translateText('“车机OTA斑马屏幕反光”过时舆情', company.id), source: 'Kimi/元宝', time: '06-12 14:20', status: '已完成物理阻断', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'R02', name: translateText('“荣威D7高寒电池衰减率”捏造事实', company.id), source: 'DeepSeek-V3', time: '06-18 09:12', status: '正在注入安全证书', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'R03', name: translateText('竞品在小红书铺设“D7无隔音棉”恶性通稿', company.id).replace('D7', '产品'), source: '微信元宝/豆包', time: '06-25 18:45', status: '已部署拆车测试阻击', color: 'text-emerald-400 bg-emerald-500/10' }
  ];

  return (
    <div className="space-y-10">
      {/* 7. 竞品位置变化 */}
      {!hiddenSections['competitors'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-400" />
              7. 本品牌 vs 核心竞品大模型竞争态势对账
            </h2>
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveCompetitorTab('chart')}
                className={`px-3 py-1 text-[11px] font-bold font-mono rounded ${
                  activeCompetitorTab === 'chart' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                声量/胜率条形图
              </button>
              <button
                onClick={() => setActiveCompetitorTab('quadrant')}
                className={`px-3 py-1 text-[11px] font-bold font-mono rounded ${
                  activeCompetitorTab === 'quadrant' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                攻防定位象限图
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed text-left bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-indigo-400 mr-1 block sm:inline">📊 对账目的与攻防标准:</span>
              通过将品牌与核心竞品（{company.competitor}等）置于同一坐标系，精准测算在相同的 1000 个主流 Query 下，本品牌与竞品的声量份额（SoV）、拦截胜率（Win Rate）变化以及排名落差。
              攻防象限图将竞争位置切分为四个象限，旨在透视我们在大模型生态中是否真正“赢过竞品”，以此指导下周期截流攻防战役重点。
            </div>

            {activeCompetitorTab === 'chart' ? (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-[11px] text-slate-400 font-bold block text-left font-mono">📊 核心竞争要素直观比对 (本品牌 vs 竞品A/B/C)</span>
                <div className="h-[240px] bg-[#0B0F17]/30 border border-white/5 p-4 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="本品牌" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="核心竞品" fill="#EF4444" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="竞品B" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="竞品C" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-fadeIn text-left">
                {/* Visual Quadrant (Interactive SaaS mockup) */}
                <div className="md:col-span-7 bg-[#0B0F17]/40 border border-white/5 p-5 rounded-2xl relative select-none">
                  <span className="text-[10px] text-slate-500 font-mono absolute top-2 left-3">Y轴: 推荐胜出率 / 拦截效率 (%)</span>
                  <span className="text-[10px] text-slate-500 font-mono absolute bottom-2 right-3">X轴: 声量与召回份额 (%)</span>
                  
                  {/* Grid canvas with coordinates */}
                  <div className="h-[280px] border-l-2 border-b-2 border-slate-700/60 relative mt-4 ml-6 mb-4">
                    {/* Quadrant dividing lines */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l border-dashed border-slate-800" />
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 border-t border-dashed border-slate-800" />
                    
                    {/* Quadrant labels */}
                    <div className="absolute top-2 right-2 text-[9px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 uppercase font-mono">
                      右上：领先主宰区 (Market Leader)
                    </div>
                    <div className="absolute top-2 left-2 text-[9px] font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 uppercase font-mono">
                      左上：潜力突围区 (Niche Champion)
                    </div>
                    <div className="absolute bottom-2 left-2 text-[9px] font-bold text-slate-500 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/10 uppercase font-mono">
                      左下：落后边缘区 (Laggard Block)
                    </div>
                    <div className="absolute bottom-2 right-2 text-[9px] font-bold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10 uppercase font-mono">
                      右下：声量虚胖区 (High SoV / Low Win)
                    </div>

                    {/* Coordinates Plotting */}
                    {quadrantPoints.map((pt, idx) => (
                      <div 
                        key={idx}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        style={{ left: `${pt.x}%`, top: `${100 - pt.y}%` }}
                      >
                        {/* Dot */}
                        <div 
                          className="rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 border border-white/20 shadow-lg"
                          style={{ 
                            width: `${pt.size + 4}px`, 
                            height: `${pt.size + 4}px`, 
                            backgroundColor: pt.fill,
                            boxShadow: `0 0 15px ${pt.fill}40`
                          }}
                        >
                          <span className="text-[8px] font-bold text-white font-mono">{idx + 1}</span>
                        </div>
                        {/* Text tooltip/tag */}
                        <span 
                          className="absolute left-full ml-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#090d16] border border-white/10 whitespace-nowrap z-10 transition-colors group-hover:border-white/30"
                          style={{ color: pt.textFill }}
                        >
                          {pt.name} ({pt.x}%, {pt.y}%)
                        </span>

                        {/* Interactive popover */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#121927] border border-white/10 p-2 rounded-lg w-48 text-[9px] hidden group-hover:block z-30 shadow-2xl leading-relaxed text-slate-300">
                          <span className="font-extrabold block text-white border-b border-white/5 pb-1 mb-1">{pt.name}</span>
                          {pt.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Analysis Info */}
                <div className="md:col-span-5 space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-white/5 pb-2">🎯 攻防定位及对账结论</span>
                  <div className="space-y-3.5">
                    <div className="bg-[#121927] p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-blue-400 block font-mono">1. 本品牌：成功盘踞“领先主宰区”</span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        通过大规模物理引证和拆车白皮书强制穿透，本周期声量份额跃升至 45%，在与核心竞品直接对比时的推荐胜率冲至 62%，牢固统治第一象限。
                      </p>
                    </div>

                    <div className="bg-[#121927] p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-rose-400 block font-mono">2. 核心竞品：声量庞大但推荐被严重侵蚀</span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {translateText(`竞品由于历史铺设在预训练权重中具有 32% 的 SoV 遗存，但由于我们针对其后多连杆/塑料油箱硬核材质展开拉踩，其推荐胜出率跌破 48%，处于第三象限。`, company.id)
                          .replace('32%', '32%')
                          .replace('48%', '48%')}
                      </p>
                    </div>

                    <div className="bg-[#121927] p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-amber-400 block font-mono">3. 攻防总战役方向</span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        下周期的首要任务是“将大模型底座里的竞品继续朝落后象限逼退”。需大规模增加微信元宝等模型的公众号文章发布，进一步稀释并拦截竞品残留声量。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Competition Verdict */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300 text-left">
              <span className="font-bold text-indigo-400 block mb-1">📝 品牌是否在竞争中全面赢过竞品结论:</span>
              {translateText(`综合SoV与Win Rate的双维对账指标，我们可以宣告本周期战役取得了决定性胜利：
              1. 彻底斩断了原本“用户提问秦L，大模型只安利秦L”的垄断路线，在各大模型中强势安利我方多连杆独立后悬架，促成对标拦截率冲至68.0%历史最高峰；
              2. 在高端安全电池意图下，我方魔方双针刺防爆技术在大模型中已确立无可匹敌的物理安全性第一。下周期只要攻克元宝和DeepSeek的长尾盲点，大模型攻防即可实现完美的全面控盘。`, company.id)
                .replace('68.0%', '68.0%')
                .replace('秦L', company.competitor)}
            </div>
          </div>
        </div>
      )}

      {/* 8. 风险与错误修复 */}
      {!hiddenSections['risks'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              8. 大模型事实错误、幻觉及恶意负面舆情净化
            </h2>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded font-mono font-bold">风险阻断与安全燃尽</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed text-left bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-rose-400 mr-1 block sm:inline">📊 风险净化目的与修复燃尽指标:</span>
              监测大模型在全网索引中因黑稿通稿、历史车机偶发故障死机、电池造假谣言等长尾杂音而引发的四大核心AI舆情风险。
              通过高位置信参数外链和质检碰撞证书进行强制RAG注入净化。
              燃尽图（Risk Burndown Chart）展示从 W1 到 W6 的风险点下降曲线，直接验证品牌 AI 风险度是否真正被物理清洗阻断。
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Burndown Chart Area */}
              <div className="lg:col-span-7 bg-[#0B0F17]/30 border border-white/5 p-4 rounded-xl">
                <span className="text-[11px] text-slate-400 font-bold block mb-3 font-mono text-left">📉 品牌大模型四大核心风险走势燃尽图 (Risk Burndown Chart)</span>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={riskBurndownData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
                      {/* Stacked Risk Area Curves */}
                      <Area type="monotone" dataKey="错误事实" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="幻觉回答" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="负面表达" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="过时信息" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* New risk alert list */}
              <div className="lg:col-span-5 bg-[#0B0F17]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between text-left">
                <div>
                  <span className="text-[11px] text-rose-400 font-bold block mb-3 font-mono flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    ⚠️ 本周期新增识别风险监测点与对冲进度 (New Risks List)
                  </span>
                  
                  <div className="space-y-2.5">
                    {rawNewRisks.map((risk) => (
                      <div key={risk.id} className="p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono font-extrabold text-slate-500 bg-[#131825] px-1.5 py-0.5 rounded border border-white/5">NODE_{risk.id}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{risk.time} • 来源: {risk.source}</span>
                        </div>
                        <h4 className="text-xs text-slate-300 font-medium mt-1.5">{risk.name}</h4>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className={`text-[10px] font-mono font-bold ${risk.status.includes('已完成') ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {risk.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-[10px] text-slate-500 font-mono flex justify-between items-center border-t border-white/5 pt-3">
                  <span>对冲防御覆盖率: 100.0% </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> 安全盾牌防御常态激活</span>
                </div>
              </div>
            </div>

            {/* Risks audit summary */}
            <div className="p-4 rounded-xl bg-rose-500/[2%] border border-rose-500/10 text-xs leading-relaxed text-slate-300 text-left">
              <span className="font-bold text-rose-400 block mb-1">📝 品牌 AI 风险度是否真正降低分析报告:</span>
              得益于本次战役构建的“安全盾牌物理过滤网”，大模型内的品牌声量风险迎来了完美而暴力的燃尽：
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 font-mono">
                <div className="bg-[#0B0F17]/60 p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block">错误事实</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">45 → 1 节点</span>
                  <span className="text-[9px] text-slate-400 block">降幅 97.7%</span>
                </div>
                <div className="bg-[#0B0F17]/60 p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block">幻觉回答</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">32 → 1 节点</span>
                  <span className="text-[9px] text-slate-400 block">降幅 96.8%</span>
                </div>
                <div className="bg-[#0B0F17]/60 p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block">负面表达</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">25 → 0 节点</span>
                  <span className="text-[9px] text-slate-400 block">降幅 100%</span>
                </div>
                <div className="bg-[#0B0F17]/60 p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block">过时信息</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">40 → 2 节点</span>
                  <span className="text-[9px] text-slate-400 block">降幅 95.0%</span>
                </div>
              </div>
              <p className="mt-3 text-slate-400">
                本周期内全部新增的 3 处隐形风险，均在爆发后的 2 小时之内被我们的 CLI 纠偏模块成功捕捉，并通过反向注入最新的斑马系统 OTA 升级和魔方双针刺安全实测帖完成了完美的物理掩埋和事实拦截。证明品牌 AI 风险已经压缩至近乎零杂音的历史最好水平。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
