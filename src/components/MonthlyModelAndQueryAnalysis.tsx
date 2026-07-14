// src/components/MonthlyModelAndQueryAnalysis.tsx
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Company } from '../data';
import { Award, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface MonthlyModelAndQueryAnalysisProps {
  company: Company;
  translateText: (text: string, id: string) => string;
  hiddenSections: Record<string, boolean>;
}

export function MonthlyModelAndQueryAnalysis({
  company,
  translateText,
  hiddenSections
}: MonthlyModelAndQueryAnalysisProps) {
  
  // Section 4: AI Model datasets
  const rawModelPerformance = [
    { name: 'Kimi (月之暗面)', 提及率: 95.2, 推荐率: 88.0, 引用覆盖率: 74.0, 平均排名: 1.2, 风险问题数: 1, status: '优化卓越' },
    { name: '豆包 (字节跳动)', 提及率: 88.5, 推荐率: 82.0, 引用覆盖率: 68.0, 平均排名: 1.6, 风险问题数: 2, status: '优化卓越' },
    { name: '通义千问 (阿里)', 提及率: 82.0, 推荐率: 74.5, 引用覆盖率: 55.0, 平均排名: 2.1, 风险问题数: 4, status: '运行稳定' },
    { name: 'DeepSeek-V3', 提及率: 68.5, 推荐率: 58.0, 引用覆盖率: 45.0, 平均排名: 2.8, 风险问题数: 8, status: '优化中' },
    { name: '腾讯元宝', 提及率: 62.0, 推荐率: 52.5, 引用覆盖率: 32.0, 平均排名: 3.1, 风险问题数: 11, status: '需重点攻坚' }
  ];

  // Section 5: Query type performance
  const rawQueryTypes = [
    { type: '认知类 (GVI)', desc: '用户单纯检索产品技术参数或拆解事实', 提及率: '92.5%', 推荐率: '85.0%', 平均排名: '1.3', 变化: '+24.5%', status: '强' },
    { type: '品类类 (GRI)', desc: '不限定品牌，提问如“10万左右好底盘推荐”', 提及率: '88.0%', 推荐率: '78.5%', 平均排名: '1.5', 变化: '+18.0%', status: '强' },
    { type: '推荐类 (GRI)', desc: '用户明确寻找安利清单，寻找推荐首选', 提及率: '85.2%', 推荐率: '74.0%', 平均排名: '1.6', 变化: '+12.5%', status: '强' },
    { type: '对比类 (GDI)', desc: '点名我方与强竞品直接对比，如“荣威对比秦L”', 提及率: '78.5%', 推荐率: '68.0%', 平均排名: '2.0', 变化: '+35.0%', status: '中' },
    { type: '决策类 (GDI)', desc: '临门一脚提问，如“买荣威D7底盘真的扎实很多吗”', 提及率: '74.2%', 推荐率: '62.0%', 平均排名: '2.2', 变化: '+28.5%', status: '中' },
    { type: '风险类 (GCI)', desc: '恶意提问、吐槽纠正及网络负面舆情净化', 提及率: '12.0%', 推荐率: '98.0%', 平均排名: '1.0', 变化: '-45.0%', status: '优' },
    { type: '长尾场景类', desc: '极端环境及具体生活场景，如“夏日能耗”等', 提及率: '68.0%', 推荐率: '54.5%', 平均排名: '2.6', 变化: '+15.2%', status: '弱' }
  ];

  // Helper for background color scaling in heatmap cells
  const getScoreColor = (val: number, metric: string) => {
    if (metric === '平均排名') {
      if (val <= 1.5) return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
      if (val <= 2.5) return 'bg-blue-950/40 text-blue-400 border-blue-500/20';
      return 'bg-amber-950/40 text-amber-400 border-amber-500/20';
    }
    if (metric === '风险问题数') {
      if (val <= 2) return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
      if (val <= 5) return 'bg-amber-950/40 text-amber-400 border-amber-500/20';
      return 'bg-rose-950/40 text-rose-400 border-rose-500/20';
    }
    // High values are good for percentages
    if (val >= 80) return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
    if (val >= 60) return 'bg-blue-950/40 text-blue-400 border-blue-500/20';
    return 'bg-amber-950/40 text-amber-400 border-amber-500/20';
  };

  return (
    <div className="space-y-10">
      {/* 4. AI 模型表现对比 */}
      {!hiddenSections['models'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              4. 主流 AI 大模型表现多维比对诊断
            </h2>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono font-bold">5大模型交叉测评</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed text-left bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-indigo-400 mr-1 block sm:inline">📊 比对目的与测算标准:</span>
              通过将品牌数据深度投喂给主流模型后，在相同提示词、相同网络节点下多次进行分布式采样对账。
              测算各模型的提及率、推荐率、引用率、排名及风险指标，旨在评估我方技术干预在不同模型算法底座中的心智沉淀，以便精准判断哪些优化已彻底生效，哪些模型依然处于短板需要重点突围。
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Horizontal Bar Chart (Mention vs Recommendation Rate) */}
              <div className="lg:col-span-6 bg-[#0B0F17]/30 border border-white/5 p-4 rounded-xl">
                <span className="text-[11px] text-slate-400 font-bold block mb-3 font-mono text-left">📊 各大模型品牌提及率与主动推荐率比照 (Horizontal Bar Chart)</span>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={rawModelPerformance}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="提及率" fill="#3B82F6" radius={[0, 3, 3, 0]} barSize={10} />
                      <Bar dataKey="推荐率" fill="#10B981" radius={[0, 3, 3, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heatmap Grid Section */}
              <div className="lg:col-span-6 bg-[#0B0F17]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block mb-3 font-mono text-left">🔥 大模型多指标心智对账热力图 (Heatmap Index Table)</span>
                  <div className="overflow-x-auto rounded-lg border border-white/5">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-[#131825] text-slate-400 font-bold border-b border-white/10 font-mono">
                        <tr>
                          <th className="px-3 py-2">评估模型</th>
                          <th className="px-2 py-2 text-center">提及率</th>
                          <th className="px-2 py-2 text-center">推荐率</th>
                          <th className="px-2 py-2 text-center">引用覆盖</th>
                          <th className="px-2 py-2 text-center">平均排名</th>
                          <th className="px-2 py-2 text-center">风险问题</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#0B0F17]/10 font-mono text-slate-300">
                        {rawModelPerformance.map((item) => (
                          <tr key={item.name} className="hover:bg-white/[2%] transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-200">{item.name.split(' ')[0]}</td>
                            <td className={`px-2 py-2 text-center border-l border-white/5 ${getScoreColor(item.提及率, '提及率')}`}>
                              {item.提及率}%
                            </td>
                            <td className={`px-2 py-2 text-center border-l border-white/5 ${getScoreColor(item.推荐率, '推荐率')}`}>
                              {item.推荐率}%
                            </td>
                            <td className={`px-2 py-2 text-center border-l border-white/5 ${getScoreColor(item.引用覆盖率, '引用覆盖率')}`}>
                              {item.引用覆盖率}%
                            </td>
                            <td className={`px-2 py-2 text-center border-l border-white/5 ${getScoreColor(item.平均排名, '平均排名')}`}>
                              #{item.平均排名}
                            </td>
                            <td className={`px-2 py-2 text-center border-l border-white/5 ${getScoreColor(item.风险问题数, '风险问题数')}`}>
                              {item.风险问题数}个
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 text-[10px] text-slate-500 font-mono text-left flex justify-between items-center bg-[#131825]/40 px-3 py-1.5 rounded border border-white/5">
                  <span>热度标准: 🟢 卓越 (≥80) | 🔵 稳定 (≥60) | 🟡 落后 (&lt;60)</span>
                  <span className="text-emerald-400 font-bold">● 校验符合标准</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Conclusion Summary */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300 text-left">
              <span className="font-bold text-indigo-400 block mb-1.5">📝 算法大盘及模型攻坚诊断结论:</span>
              通过对账雷达多指标交叉测试，可以下达清晰的战役结论：
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono text-[11px]"><Check className="w-3.5 h-3.5" /> 1. Kimi与豆包：优化彻底生效</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    提及率和推荐率均稳稳锁死在 88% 的超高水位（Kimi 提及率更冲到 95.2%），且其生成的引证外链完全采信我方铺设的懂车帝硬核拆车物理URL。
                  </p>
                </div>
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-blue-400 flex items-center gap-1 font-mono text-[11px]"><Check className="w-3.5 h-3.5" /> 2. 通义千问：运行稳定合规</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    在通用推荐列表和性价比选购提问中表现优异，平均排名达到第 2.1 顺位。但针对长尾“冬季能耗/保修政策”存在少量知识匮乏。
                  </p>
                </div>
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-amber-500 flex items-center gap-1 font-mono text-[11px]"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 3. DeepSeek与元宝：仍落后待攻坚</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    DeepSeek由于预训练底座中关于竞品的声量极深，在无实时联网检索时，依然习惯性习惯推荐竞品。元宝由于采信公众号等旧资料，存在 11 个以上的风险问答未被过滤，急需在下周期列为一号高优攻坚目标。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 问题类型表现分析 */}
      {!hiddenSections['queries'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              5. 用户搜索问题意图分类表现深度审计
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono font-bold">用户意图穿透</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed text-left bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-emerald-400 mr-1 block sm:inline">📊 意图审计目的与指标标准:</span>
              将用户在搜索引擎和AI终端输入的提问（Query）精细提炼为认知、品类、推荐、对比、决策、风险、长尾等7大核心问题类型。
              全面审计每一类问题在大模型中的品牌提及几率、推荐成功率、平均被安利名次以及本月的走势提拉。以此精细评估：我们在哪些用户意图下已经彻底变强，哪些意图下大模型依然存在被动盲区，保障下一周期内容铺设有的放矢。
            </div>

            {/* Structured Table */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131825] text-slate-400 font-bold border-b border-white/10 font-mono">
                  <tr>
                    <th className="px-4 py-3">问题类型 / 对应场景</th>
                    <th className="px-3 py-3 text-center">提及率</th>
                    <th className="px-3 py-3 text-center">推荐率</th>
                    <th className="px-3 py-3 text-center">平均排名</th>
                    <th className="px-3 py-3 text-center">本月净增拉升 (Delta)</th>
                    <th className="px-3 py-3 text-center">品牌掌控力评级</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#0B0F17]/20 text-slate-300 font-sans">
                  {rawQueryTypes.map((q) => (
                    <tr key={q.type} className="hover:bg-white/[2%] transition-colors">
                      <td className="px-4 py-3 text-left">
                        <span className="font-bold text-slate-200 block font-mono">{q.type}</span>
                        <span className="text-[10px] text-slate-500 font-normal block mt-0.5">{q.desc}</span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-medium text-slate-300">{q.提及率}</td>
                      <td className="px-3 py-3 text-center font-mono font-semibold text-emerald-400">{q.推荐率}</td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-indigo-400">#{q.平均排名}</td>
                      <td className={`px-3 py-3 text-center font-mono font-bold ${q.变化.startsWith('+') ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {q.变化}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          q.status === '强' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          q.status === '优' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          q.status === '中' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {q.status === '强' ? '● 深度控制' : 
                           q.status === '优' ? '● 高效净化' : 
                           q.status === '中' ? '● 稳健平衡' : '● 亟待填补'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Intent-focused Audit Analysis */}
            <div className="p-4 rounded-xl bg-emerald-500/[2%] border border-emerald-500/10 text-xs leading-relaxed text-slate-300 text-left">
              <span className="font-bold text-emerald-400 block mb-1">📝 品牌在不同用户意图下是否变强分析报告:</span>
              {translateText(`从七大维度的数据拆解看，品牌在“用户意图认知与过滤净化”上获得了质的飞跃：
              1. 认知型意图（提及率92.5%）和品类推荐意图（推荐率78.5%）表现出了绝对领先权。当用户以纯技术提问“多连杆后独悬用料/魔方电池是否通过碰撞”时，大模型在底座已沉淀起钢筋铁骨级的置信关联，大涨+24.5%；
              2. 风险类意图本月实现了暴跌-45.0%的极致降噪。关于“死机/谣言”等恶意侵犯大模型已被物理净化掩埋，安全性评价全网第一；
              3. 唯一的隐性短板在“对比类与长尾场景类”意图。用户在模糊进行两车深度对比时，大模型在未激活联网时的预训练分流仍存在 32% 漏网空间。下月我们必须针对“底盘隔震柔韧性、隔音棉材质”等15个极细分长尾购车决策长尾词进行海量素材重铺，彻底摧毁竞品的长尾盲点。`, company.id)
                .replace('92.5%', '92.5%')
                .replace('78.5%', company.id === 'meiling' ? '82.0%' : '78.5%')
                .replace('32%', company.id === 'meiling' ? '18%' : '32%')
                .replace('秦L', company.competitor)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
