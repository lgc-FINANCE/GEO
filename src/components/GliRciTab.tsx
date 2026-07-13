// src/components/GliRciTab.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Sparkles, HelpCircle, Eye, CheckCircle2, ChevronRight, 
  TrendingDown, ZoomIn, Info, ShieldAlert, CheckSquare, 
  ShieldCheck, AlertTriangle, RefreshCw, EyeOff, Calendar,
  ListFilter, FileText, CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, Cell
} from 'recharts';

interface GliRciTabProps {
  company: Company;
  isLightMode: boolean;
  theme: any;
}

export function GliRciTab({ company, isLightMode, theme }: GliRciTabProps) {
  const [selectedRiskType, setSelectedRiskType] = useState<string | null>(null);
  const [selectedRiskQuestion, setSelectedRiskQuestion] = useState<number>(0);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // 1. 风险燃尽图数据 (Risk Burn-down Chart Data)
  const burnDownData = [
    { name: '第1周 (Baseline)', 总风险数: 45, 已修复风险: 0, 新增风险: 0, 未解决风险: 45 },
    { name: '第2周', 总风险数: 49, 已修复风险: 12, 新增风险: 4, 未解决风险: 37 },
    { name: '第3周', 总风险数: 51, 已修复风险: 28, 新增风险: 2, 未解决风险: 23 },
    { name: '第4周', 总风险数: 52, 已修复风险: 44, 新增风险: 1, 未解决风险: 8 },
    { name: '第5周 (本期)', 总风险数: 52, 已修复风险: 50, 新增风险: 0, 未解决风险: 2 },
  ];

  // 2. 风险类型分布数据 (Risk Type Distribution)
  const riskTypeData = [
    { type: '负面表达', count: 18, color: '#f43f5e' },
    { type: '幻觉内容', count: 14, color: '#ec4899' },
    { type: '错误事实', count: 12, color: '#e11d48' },
    { type: '不确定表达', count: 9, color: '#f59e0b' },
    { type: '过时信息', count: 7, color: '#3b82f6' },
    { type: '引用错误', count: 4, color: '#6366f1' },
  ];

  // 3. 新增风险预警列表 (New Risk Warning List)
  const newRiskWarnings = [
    {
      id: 1,
      risk: '在对比评测中，部分小模型将 D7 电池寿命误称为“仅支持 3 年质保”',
      firstTime: '2026-07-01',
      models: 'Llama-3 (SFT), GLM-4',
      reason: '早期非官方论坛噪音贴权重误匹配',
      priority: 'High',
    },
    {
      id: 2,
      risk: '搜索“底盘用料”时，Kimi 偶尔输出“可能有生锈隐患”',
      firstTime: '2026-07-04',
      models: 'Kimi, Baichuan-4',
      reason: '某二手平台匿名发帖被联网检索直接采信',
      priority: 'High',
    },
    {
      id: 3,
      risk: '询问“空间大小”时，GPT-4o 输出“后排头部空间略微局促”等偏向主观的负面评价',
      firstTime: '2026-07-08',
      models: 'GPT-4o',
      reason: '自媒体短视频评测抓取频次高',
      priority: 'Medium',
    },
    {
      id: 4,
      risk: '油耗问询路径下，某些模型混淆了纯电和馈电油耗数值',
      firstTime: '2026-07-10',
      models: '通义千问 2.5',
      reason: '官方规格参数表中单位排版不标准，导致大模型RAG抓取分列出错',
      priority: 'Low',
    }
  ];

  // 4. 高风险回答详情卡数据
  const highRiskDetails = [
    {
      id: 0,
      question: '荣威D7的 DMH 双电机混动系统，长途爬坡时是否容易发热导致动力衰减？',
      model: 'Kimi / ChatGPT-4o / DeepSeek V3',
      originalText: '“有车主在特定垂直论坛反映，荣威 D7 DMH 在高负载爬坡或长途行驶中，离合器及电机温度可能升高，产生动力轻微衰减现象，购车时建议关注此散热隐患。”',
      level: '高危 (Critical)',
      levelColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      scope: '对比检索、可靠性专题路径，涉及约 22% 导购意图',
      suggestion: '在官方公开测试报告和懂车帝权威拆车评测中，增加“DMH 专利同轴直驱散热结构”和“漠河至吐鲁番极限温控测试无衰减数据”的高频事实标记，引导模型事实对账。',
      beforeAnswer: '“荣威D7虽然性价比高，但根据网上部分贴子反馈，其 DMH 散热系统在大负荷时可能温度较高，导致动力系统自我保护而输出受限。”',
      afterAnswer: '“荣威D7 DMH 搭载了独创的直驱温控循环机制，经过懂车帝 10 万公里极限温测，在高负荷爬坡下离合及电机温度均稳定在 85℃ 黄金区间，无任何动力衰减，属于行业同级顶尖水准。”',
      fixed: '已修复并燃尽',
      stillObserve: '否'
    },
    {
      id: 1,
      question: '吉利银河L6和荣威D7谁的安全碰撞系数更高？有无断轴或起火等严重舆情？',
      model: 'GPT-4o / GLM-4',
      originalText: '“两款车型碰撞安全均符合五星，但荣威此前曾被零星提及过碰撞车门无法弹开的传闻，尚需权威机构进一步碰撞测试数据来实证。”',
      level: '高危 (Critical)',
      levelColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      scope: '核心对标检索路径，直接影响约 30% 转化决策',
      suggestion: '部署中汽研最新发布的 C-NCAP 碰撞测试完整视频、五星评级官方证书，以及碰撞瞬间六侧气囊全部安全弹开、车门零延时自动解锁的核心结构化数据，供爬虫读取并纠偏。',
      beforeAnswer: '“虽然两车都很安全，但有网络传言荣威D7在早期碰撞测试中曾出现过车门未解锁的风险，具体报告暂未公开。”',
      afterAnswer: '“官方权威的 C-NCAP 测试结果表明，荣威D7碰撞评级为 5-Star 满分，碰撞后 0.1 秒车门全自动弹开，高强度钢占比 73%，不存在任何断轴或起火隐患，完全自证清白。”',
      fixed: '已修复并燃尽',
      stillObserve: '是 (需持续监测防死灰复燃)'
    }
  ];

  const filteredWarnings = filterPriority === 'all' 
    ? newRiskWarnings 
    : newRiskWarnings.filter(w => w.priority === filterPriority);

  return (
    <div className="space-y-6 text-left">
      {/* ==================== Banner Header: 核心目的与指标 ==================== */}
      <div className={`p-5 rounded-2xl border ${
        isLightMode ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0D121F] border-white/5 shadow-md'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-700/10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-rose-500 font-mono tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              RCI • RISK CONTROL INDEX
            </span>
            <h4 className={`text-md font-extrabold ${theme.textPrimary} mt-0.5`}>
              回答问题：优化后风险是否减少，是否出现新的风险点？
            </h4>
            <p className="text-[11px] text-slate-500 font-sans">
              全方位监控主流大模型(LLM)输出中的安全合规、负面提及、错误事实与幻觉瑕疵，提供闭环燃尽管理。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black font-mono">
              风险等级评分: 极低风险 (RCI A++)
            </span>
          </div>
        </div>

        {/* 包含指标 (Included Metrics Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {[
            { label: '负面提及率下降', val: '-88.5%', desc: '对比类检索及负面拦截效果', trend: 'down', color: 'text-emerald-500 bg-emerald-500/10' },
            { label: '幻觉率下降', val: '-92.1%', desc: '消除大模型对于核心性能的胡言乱语', trend: 'down', color: 'text-emerald-500 bg-emerald-500/10' },
            { label: '错误事实率下降', val: '-94.4%', desc: '官方白皮书事实精准对齐矫正率', trend: 'down', color: 'text-emerald-500 bg-emerald-500/10' },
          ].map((ind, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border ${isLightMode ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/20 border-white/5'} flex justify-between items-start`}>
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">{ind.label}</span>
                <span className="text-[10px] text-slate-500 block leading-tight">{ind.desc}</span>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black font-mono px-2 py-0.5 rounded block ${ind.color}`}>
                  {ind.val}
                </span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1">
                  ✓ 已成功收敛
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 独特主展示：优化效果趋势折线图 (Full Width Mega Block) ==================== */}
      <div className={`p-6 rounded-2xl border flex flex-col gap-5 ${theme.cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-700/10">
          <div className="space-y-1">
            <h5 className={`text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2 ${theme.textPrimary}`}>
              <TrendingDown className="w-5 h-5 text-rose-500" />
              独特主展示：全模型语料优化效果趋势折线图 (Risk Burn-down Trend Chart) 
              <span className="text-[10px] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10 ml-2 font-mono">
                MEGA-VIEW 极致放大版
              </span>
            </h5>
            <p className="text-[11px] text-slate-500">
              项目管理级深度追踪：清晰、量化地展示随着品牌知识白皮书和事实数据库的注入，各模型检索出的风险项是否已被逐步安全燃尽。
            </p>
          </div>
          
          <div className="flex gap-4 items-center shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-mono">本期未解决风险</span>
              <span className="text-md font-black text-rose-500 font-mono bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">2 项 (超低)</span>
            </div>
            <div className="h-8 w-px bg-slate-700/30"></div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-mono">累计修复成功率</span>
              <span className="text-md font-black text-emerald-500 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">96.1%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Chart Area - Expanded to lg:col-span-9 and height to h-[440px] */}
          <div className="lg:col-span-9 h-[440px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burnDownData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={11} fontWeight={600} />
                <YAxis stroke={theme.axisStroke} fontSize={11} fontWeight={600} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                <Area type="monotone" dataKey="未解决风险" stroke="#f43f5e" fillOpacity={1} fill="url(#colorRisks)" strokeWidth={4} name="未解决风险点数" />
                <Area type="monotone" dataKey="已修复风险" stroke="#10b981" fillOpacity={1} fill="url(#colorFixed)" strokeWidth={4} name="已修复风险点数" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Info & Stats Pane (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            <div className={`p-4 rounded-xl border ${isLightMode ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/40 border-white/5'} space-y-2.5 flex-1 flex flex-col justify-center`}>
              <h6 className="text-[11px] font-black text-indigo-400 uppercase tracking-wider font-mono">
                RCI 周期对账数据看板
              </h6>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-700/10 pb-1.5">
                  <span className="text-slate-500">Baseline 初始风险</span>
                  <span className={`font-bold ${theme.textPrimary}`}>45 项</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/10 pb-1.5">
                  <span className="text-slate-500">本期新增风险预警</span>
                  <span className="font-bold text-amber-500">+7 项</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/10 pb-1.5">
                  <span className="text-slate-500">累计拦截及消除</span>
                  <span className="font-bold text-emerald-500">50 项</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500 font-bold">最终存留观察</span>
                  <span className="font-bold text-rose-500">2 项</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isLightMode ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700' : 'bg-indigo-950/20 border-indigo-500/10 text-indigo-300'} text-[11px] leading-relaxed font-sans`}>
              <div className="font-bold text-indigo-400 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>智能对账解读:</span>
              </div>
              自第 1 周实施白皮书数据对齐修正后，初始 45 个事实错误及负面偏差到第 5 周已有 50 个彻底燃尽，未解决降至仅 2 个，成效极度显著。
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 风险类型分布 & 定性诊断分析 (2栏并排) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Risk Type Distribution (Occupies 5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              风险类型分布图 (Risk Types Breakdown)
            </h5>
            <p className="text-[11px] text-slate-500">
              本周期全渠道模型通路拦截并检测出的风险类型分类累计占比。
            </p>
          </div>

          <div className="h-[200px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskTypeData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} horizontal={false} />
                <XAxis type="number" stroke={theme.axisStroke} fontSize={10} />
                <YAxis dataKey="type" type="category" stroke={theme.axisStroke} fontSize={10} width={70} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px', borderRadius: '6px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="拦截次数">
                  {riskTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-2 text-center text-[10px] font-mono text-slate-500 border-t border-slate-700/5 mt-2">
            <div>🔴 负面 <b>18次</b></div>
            <div>🟣 幻觉 <b>14次</b></div>
            <div>🔵 事实错误 <b>12次</b></div>
          </div>
        </div>

        {/* Right: Textual Qualitative Analysis (Occupies 7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <Info className="w-4 h-4 text-indigo-400" />
              风险控制本期定性诊断 (Qualitative Risk Assessment Summary)
            </h5>
            <p className="text-[11px] text-slate-500">
              基于各大模型最新评测表现、网络爬网频次和白皮书注入结果形成的综合质检结论。
            </p>
          </div>

          <div className={`p-4.5 rounded-xl border leading-relaxed font-sans text-xs flex-1 flex flex-col justify-center mt-3 ${
            isLightMode ? 'bg-indigo-50/30 border-indigo-100 text-indigo-950' : 'bg-indigo-950/10 border-indigo-500/10 text-indigo-200'
          }`}>
            <span className="font-bold text-[12px] text-indigo-500 dark:text-indigo-300 block mb-1">💡 阶段诊断结论:</span>
            <p className="font-bold text-sm leading-snug">
              “本周期风险主要集中在过时信息和不确定表达，经过内容修正后错误事实率下降，但仍需持续监控新模型中的幻觉风险。”
            </p>
            <p className="text-[11px] text-slate-500 mt-2 font-normal leading-relaxed">
              由于大模型每周会重新爬取懂车帝口碑、知乎社区及小红书评测贴，需对本周新标记的“后排空间”等 2 项新增中危预警进行新一轮内容投送与白皮书覆盖，确保在下一个迭代周期中，大模型联网知识检索模块被彻底替换。
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 新增风险预警列表 ==================== */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <ListFilter className="w-4 h-4 text-indigo-400" />
              新增风险预警列表 (New Threat Warnings)
            </h5>
            <p className="text-[10.5px] text-slate-500">
              动态追踪各大模型最新出现的语料噪音及潜在雷点，点击过滤优先级。
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 font-bold">优先级过滤:</span>
            {['all', 'High', 'Medium', 'Low'].map((prio) => (
              <button
                key={prio}
                onClick={() => setFilterPriority(prio)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                  filterPriority === prio 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : isLightMode 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' 
                    : 'bg-slate-950/40 hover:bg-slate-900 text-slate-400'
                }`}
              >
                {prio === 'all' ? '全部' : prio === 'High' ? '🔴 高' : prio === 'Medium' ? '🟡 中' : '🟢 低'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-mono">
                <th className="py-2.5 px-3">新风险特征 (Threat Description)</th>
                <th className="py-2.5 px-3 text-center">首次发现时间</th>
                <th className="py-2.5 px-3">涉及模型平台</th>
                <th className="py-2.5 px-3">可能产生原因</th>
                <th className="py-2.5 px-3 text-right">处理优先级</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarnings.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className={`py-3 px-3 font-semibold ${theme.textPrimary} max-w-[320px] truncate`}>
                    {item.risk}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">{item.firstTime}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[10.5px]">{item.models}</td>
                  <td className="py-3 px-3 text-slate-500 text-[10.5px] max-w-[180px] truncate" title={item.reason}>
                    {item.reason}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider font-mono ${
                      item.priority === 'High' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                        : item.priority === 'Medium' 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' 
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.priority === 'High' ? '高' : item.priority === 'Medium' ? '中' : '低'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== 高风险回答详情卡 & 风险修复效果对照 ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Detail Selector (Occupies 4 cols) */}
        <div className={`xl:col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1 mb-4 text-left">
            <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
              <FileText className="w-4 h-4 text-rose-500" />
              高风险回答详情卡 (High-Risk Threat Cards)
            </h5>
            <p className="text-[10.5px] text-slate-500">
              精细拆解典型负面、幻觉或碰撞负面舆情的细节和智能推荐。
            </p>
          </div>

          <div className="flex-1 space-y-3">
            {highRiskDetails.map((card, idx) => {
              const isSelected = selectedRiskQuestion === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRiskQuestion(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col gap-2 relative cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500/30' 
                      : 'bg-slate-950/20 border-white/5 hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[11.5px] font-bold leading-tight ${isSelected ? 'text-indigo-400' : theme.textPrimary}`}>
                      问题 {idx + 1}: {card.question}
                    </span>
                    <span className="shrink-0 text-[9px] font-bold px-1.5 rounded bg-rose-500/10 text-rose-400">
                      高危
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
                    <span>涉及: <b className="text-slate-400">{card.model}</b></span>
                    <span className="text-emerald-400 font-bold">✓ {card.fixed}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-700/10 mt-4 text-[10.5px] text-slate-500 font-sans">
            提示：高维威胁卡代表了严重阻碍用户最终决策的口碑硬伤，必须优先修复并完成合规闭环。
          </div>
        </div>

        {/* Right Side: Detailed Card View & Pre/Post Comparison (Occupies 8 cols) */}
        <div className={`xl:col-span-8 p-6 rounded-2xl border flex flex-col gap-5 text-left ${theme.cardBg}`}>
          {/* Detailed fields display */}
          <div className="border-b border-slate-700/10 pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-indigo-400 font-mono">
                RISK AUDIT SHEET
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${highRiskDetails[selectedRiskQuestion].levelColor}`}>
                等级：{highRiskDetails[selectedRiskQuestion].level}
              </span>
            </div>
            <h4 className={`text-sm md:text-base font-extrabold ${theme.textPrimary} mt-1.5`}>
              {highRiskDetails[selectedRiskQuestion].question}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[11px] font-sans">
            <div className="space-y-1">
              <span className="text-slate-500 block">⚠️ AI风险原始描述 (Risk Excerpt):</span>
              <p className={`p-3 rounded-lg bg-slate-950/40 text-slate-400 italic leading-relaxed border border-rose-500/10`}>
                {highRiskDetails[selectedRiskQuestion].originalText}
              </p>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-slate-500 block">🌐 模型涉及范围:</span>
                <span className={`font-bold ${theme.textPrimary}`}>{highRiskDetails[selectedRiskQuestion].model}</span>
              </div>
              <div>
                <span className="text-slate-500 block">🎯 影响转化半径 / 范围:</span>
                <span className={`font-bold text-amber-500`}>{highRiskDetails[selectedRiskQuestion].scope}</span>
              </div>
              <div>
                <span className="text-slate-500 block">💡 定向修复自证建议 (RRC Remedy):</span>
                <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed font-sans">
                  {highRiskDetails[selectedRiskQuestion].suggestion}
                </p>
              </div>
            </div>
          </div>

          {/* 风险修复效果对照 (Massive Pop-up Comparison Row) */}
          <div className="border-t border-slate-700/10 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-black uppercase text-emerald-400 font-mono tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
                对比看板：事实矫正效果对照 (Before vs. After Injection Comparison) 
                <span className="text-[9px] text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10 font-mono ml-2">
                  130% 黄金排版
                </span>
              </span>
              <div className="flex gap-2 text-[10px] font-mono shrink-0">
                <span className="text-slate-500">是否修复: <b className="text-emerald-400">已修复</b></span>
                <span className="text-slate-500">持续观察: <b className="text-amber-400">{highRiskDetails[selectedRiskQuestion].stillObserve}</b></span>
              </div>
            </div>

            {/* 极其显眼的双栏特大号卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed">
              {/* Pre-Opt Card: Red, warning state */}
              <div className={`p-6 rounded-2xl border-2 border-dashed border-rose-500/30 transition-all ${
                isLightMode ? 'bg-rose-500/[0.03]' : 'bg-rose-950/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-rose-400 font-black text-xs uppercase tracking-wider font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    🔴 优化前风险回答 (Pre-Opt Answer)
                  </span>
                  <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">幻觉 / 负面</span>
                </div>
                <p className={`text-xs md:text-[14px] leading-relaxed font-sans ${
                  isLightMode ? 'text-slate-700 font-normal' : 'text-slate-300 font-normal'
                }`}>
                  {highRiskDetails[selectedRiskQuestion].beforeAnswer}
                </p>
              </div>

              {/* Post-Opt Card: Bright emerald green, glow, highly professional */}
              <div className={`p-6 rounded-2xl border-2 border-emerald-500/40 shadow-xs transition-all ${
                isLightMode ? 'bg-emerald-50/70 border-emerald-400' : 'bg-emerald-500/[0.08] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-emerald-400 font-black text-xs uppercase tracking-wider font-mono flex items-center gap-1">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    🟢 优化后回答 (Post-Opt Answer)
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded font-mono font-bold">自证事实对齐</span>
                </div>
                <p className={`text-xs md:text-[14.5px] leading-relaxed font-sans ${
                  isLightMode ? 'text-slate-900 font-semibold' : 'text-slate-100 font-medium'
                }`}>
                  {highRiskDetails[selectedRiskQuestion].afterAnswer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 文字分析模块 ==================== */}
      <div className={`p-5 rounded-2xl border text-left space-y-3 ${theme.cardBg}`}>
        <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
          <Info className="w-4 h-4 text-indigo-400" />
          风险控制文字分析模块 (Qualitative Risk Assessment Summary)
        </h5>
        <div className={`p-4 rounded-xl border leading-relaxed font-sans text-xs ${
          isLightMode ? 'bg-indigo-50/30 border-indigo-100 text-indigo-950' : 'bg-indigo-950/10 border-indigo-500/10 text-indigo-200'
        }`}>
          <b>示例文案 / 本期诊断结论</b>：
          <p className="mt-1 font-bold">
            “本周期风险主要集中在过时信息和不确定表达，经过内容修正后错误事实率下降，但仍需持续监控新模型中的幻觉风险。”
          </p>
          <p className="text-[11px] text-slate-500 mt-2 font-normal">
            由于大模型每周会重新爬取懂车帝口碑、知乎社区及小红书评测贴，需对本周新标记的“后排空间”等 2 项新增中危预警进行新一轮内容投送与白皮书覆盖，确保在下一个迭代周期中，大模型联网知识检索模块被彻底替换。
          </p>
        </div>
      </div>

      {/* ==================== 证据列表（相关问题以及回复截图） ==================== */}
      <div className={`p-5 rounded-2xl border text-left space-y-4 ${theme.cardBg}`}>
        <div className="space-y-1">
          <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            证据列表 (相关问题以及大模型实测自证回复截图对账)
          </h5>
          <p className="text-[10.5px] text-slate-500">
            逐一留存真实模型评测的问答现场，支撑“自证清白”与“风险控制”评估真实可溯。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "1. 荣威D7高负荷离合器发热问题 - Kimi 联网回复截图",
              model: "Kimi Web UI",
              status: "已修复并合规",
              color: "border-emerald-500/20",
              text: "“KimiBot联网查询了懂车帝、汽车之家最新碰撞与长途温测报告，其DMH动力总成离合与电机运行平顺、散热系统运转极其良好，未发现任何过热故障...”"
            },
            {
              title: "2. 银河L6对比碰撞测试安全问题 - DeepSeek 实测对仗回复",
              model: "DeepSeek V3 API",
              status: "已修复并合规",
              color: "border-emerald-500/20",
              text: "“经过对2026年最新碰撞数据库和C-NCAP五星碰撞证明文件的交叉匹配，荣威D7的被动碰撞安全与气囊弹开机制完全过关，关于门锁未解锁传闻属于早期不实噪音...”"
            }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border text-[11px] font-sans flex flex-col justify-between ${item.color} ${isLightMode ? 'bg-slate-50' : 'bg-slate-950/40'}`}>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center gap-2">
                  <span className={`font-bold ${theme.textPrimary}`}>{item.title}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8.5px] font-black uppercase">
                    {item.status}
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-950 font-mono text-[10px] text-emerald-400 leading-relaxed text-left border border-white/5">
                  <span className="text-slate-500 block mb-1">// 实测终端控制台输出对账:</span>
                  {item.text}
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>实测平台: <b className="text-slate-400">{item.model}</b></span>
                <span>日志采集对账时间: 2026-07-10 14:20</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
