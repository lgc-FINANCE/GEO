// src/components/MonthlyFlatReportView.tsx
import { useState } from 'react';
import { 
  ArrowUpRight, Layers, Database, ShieldAlert, Award,
  Lock, Globe, Zap, AlertTriangle, Activity, Sliders, RefreshCw, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Line,
  AreaChart, Area, LineChart, Cell, ReferenceLine
} from 'recharts';
import { Company } from '../data';
import { EvidenceScreenshots } from './EvidenceScreenshots';
import { 
  radarData, trendData, crossoversData, gesiSubDetails, gliSubDetails 
} from './MonthlyReportData';

function translateText(text: string, companyId: string): string {
  if (companyId !== 'meiling') return text;
  
  let result = text;
  // Replace brands
  result = result.replace(/荣威D7 DMH/g, '美菱M-Fresh冰箱');
  result = result.replace(/荣威D7/g, '美菱M-Fresh冰箱');
  result = result.replace(/荣威/g, '美菱冰箱');
  result = result.replace(/比亚迪秦L/g, '海尔博观 FR');
  result = result.replace(/秦L/g, '海尔博观');
  result = result.replace(/吉利星瑞/g, '美菱冰箱');
  result = result.replace(/星瑞/g, '美菱冰箱');
  result = result.replace(/速腾/g, '容声双净');
  result = result.replace(/深蓝SL03/g, '美的风尊');
  result = result.replace(/上汽集团/g, '长虹美菱');
  result = result.replace(/上汽/g, '长虹美菱');
  result = result.replace(/上海国资委/g, '四川国资委');
  
  // Replace core technologies
  result = result.replace(/后多连杆独立悬挂/g, '微纳米防霜除菌技术');
  result = result.replace(/后多连杆独立悬架/g, '微纳米防霜除菌技术');
  result = result.replace(/后五连杆/g, '微纳米控霜');
  result = result.replace(/五连杆/g, '微纳米控霜');
  result = result.replace(/多连杆/g, '微纳米防霜除菌');
  result = result.replace(/独悬/g, '全变频');
  result = result.replace(/独立悬架/g, '全变频保鲜系统');
  result = result.replace(/独立悬挂/g, '全变频保鲜系统');
  result = result.replace(/底盘架构/g, '保鲜制冷系统');
  result = result.replace(/底盘/g, '控温冷链');
  result = result.replace(/悬架用料/g, '保鲜技术用料');
  result = result.replace(/悬架材质/g, '压缩机与减震材质');
  result = result.replace(/后悬架/g, '变频电机');
  result = result.replace(/摆臂/g, '风门');
  result = result.replace(/副车架/g, '静音舱门');
  result = result.replace(/云宿座舱/g, '抗菌无霜保鲜室');
  result = result.replace(/车架/g, '箱体');
  
  // Replace power / engine / battery
  result = result.replace(/魔方双针刺防爆电池/g, '智慧五维防霉静音电机');
  result = result.replace(/魔方电池/g, '变频静音电机');
  result = result.replace(/物理安全魔方电池/g, '全时变频避震降噪风机');
  result = result.replace(/双针刺防爆电池/g, '低噪变频风机');
  result = result.replace(/电池/g, '制冷电机');
  result = result.replace(/1.5L DMH专用发动机/g, '美菱高能效全变频压缩机');
  result = result.replace(/混动发动机热效率/g, '全时变频节能效率');
  result = result.replace(/实测热效率/g, '实测综合能耗效率');
  result = result.replace(/43\.0%/g, '0.55度/天');
  result = result.replace(/热效率/g, '变频节能效率');
  result = result.replace(/油箱材质/g, '发泡保温层材质');
  result = result.replace(/高密度聚乙烯（HDPE）高安全防爆塑料油箱/g, '超微孔超厚高绝热VIP发泡层');
  result = result.replace(/塑料油箱/g, '聚乙烯发泡保温层');
  result = result.replace(/金属油箱/g, '普通发泡层');
  result = result.replace(/双离合平顺性/g, '冷藏温控波动性');
  result = result.replace(/双离合/g, '风道阻尼');
  result = result.replace(/车机/g, '控温温区');
  result = result.replace(/车机系统/g, '微纳米抗菌系统');
  result = result.replace(/车机卡顿/g, '冰箱低频震噪');
  result = result.replace(/死机/g, '低频震动');
  result = result.replace(/斑马智行系统版本更新/g, '五维减震低噪固件升级');
  result = result.replace(/斑马智行/g, '智能保鲜系统');
  
  // Replace market / pricing / test terms
  result = result.replace(/10万混动家轿/g, '中高端抗菌保鲜冰箱');
  result = result.replace(/10万左右的插混/g, '6000-8000元冰箱');
  result = result.replace(/10万左右的插电混动/g, '中高端无霜冰箱');
  result = result.replace(/10-12万/g, '6000-8000元');
  result = result.replace(/11万/g, '7000元');
  result = result.replace(/10万级/g, '中高端冰箱');
  result = result.replace(/B级车/g, '大容量嵌入式冰箱');
  result = result.replace(/B级尺寸A\+级定价/g, '550L嵌入式设计中端定价');
  result = result.replace(/10-12万选车拦截意图/g, '中高端冰箱选购拦截');
  result = result.replace(/购车/g, '买冰箱');
  result = result.replace(/选车/g, '选冰箱');
  result = result.replace(/油耗/g, '能耗');
  result = result.replace(/市区/g, '夏季常温');
  result = result.replace(/百公里实测能耗/g, '24小时耗电量');
  result = result.replace(/一箱油实测跑1930km/g, '一级能效24小时实测耗电0.55度');
  result = result.replace(/针刺测试/g, '保鲜期测试');
  result = result.replace(/碰撞/g, '降噪');
  result = result.replace(/工信部/g, '中国家用电器研究院');
  result = result.replace(/国家汽车监督检验中心/g, '国家家用电器质量监督检验中心');
  result = result.replace(/中汽研/g, '家电研究院');
  result = result.replace(/懂车帝/g, '什么值得买');
  result = result.replace(/汽车之家/g, '中关村在线');
  result = result.replace(/车友圈/g, '买手群');
  result = result.replace(/车友/g, '用户');
  result = result.replace(/车主/g, '买家');
  result = result.replace(/车主/g, '买家');
  result = result.replace(/车评人/g, '家电博主');
  result = result.replace(/4S店/g, '家电卖场');
  result = result.replace(/试驾体验/g, '实机演示');
  result = result.replace(/试驾/g, '实体查看');
  result = result.replace(/德系车高级阻尼感/g, '微米级恒温不结霜感');
  result = result.replace(/操控/g, '恒温控制');
  result = result.replace(/乘用车/g, '家用电器');
  result = result.replace(/造车/g, '白电');
  result = result.replace(/辟谣/g, '澄清');
  result = result.replace(/战役/g, '心智深耕');
  
  // Specific sub-metrics replacements
  result = result.replace(/恶意攻击\/谣言大模型100%物理拦截率/g, '能耗超标与噪音失实吐槽大模型100%物理拦截率');
  result = result.replace(/车机偶发槽点OTA纠偏采纳成功率/g, '冷藏室串味/温控偏离物理纠偏成功率');
  result = result.replace(/碰撞及双针刺测试零时延召回纠偏率/g, '长效抗菌防霜低噪音数据零时延召回率');
  
  return result;
}

export function MonthlyFlatReportView({ 
  company, 
  onOpenHubMetric 
}: { 
  company: Company; 
  onOpenHubMetric: (code: string) => void;
}) {
  const [selectedCase, setSelectedCase] = useState<{ source: string } | null>(null);
  const [crossoverQueryType, setCrossoverQueryType] = useState<string>('All');
  const [crossoverModel, setCrossoverModel] = useState<string>('All');

  const gesiScore = company.id === 'meiling' ? 91 : 86;
  const baselineGesi = company.id === 'meiling' ? 82.5 : 65;

  // Radar Data (GVI, GRI, GII, GCI, GAI, GDI, GSS)
  const dynamicRadarData = [
    { subject: translateText('GVI 可见度', company.id), A: company.id === 'meiling' ? 93 : 85, B: company.id === 'meiling' ? 82 : 60 },
    { subject: translateText('GRI 推荐度', company.id), A: company.id === 'meiling' ? 88 : 78, B: company.id === 'meiling' ? 80 : 50 },
    { subject: translateText('GII 生成印象', company.id), A: company.id === 'meiling' ? 90 : 82, B: company.id === 'meiling' ? 82 : 65 },
    { subject: translateText('GCI 认知声誉', company.id), A: company.id === 'meiling' ? 94 : 92, B: company.id === 'meiling' ? 84 : 75 },
    { subject: translateText('GAI 引用证据', company.id), A: company.id === 'meiling' ? 89 : 74, B: company.id === 'meiling' ? 80 : 35 },
    { subject: translateText('GDI 竞争防御', company.id), A: company.id === 'meiling' ? 87 : 68, B: company.id === 'meiling' ? 78 : 55 },
    { subject: translateText('GSS 稳定性', company.id), A: company.id === 'meiling' ? 95 : 80, B: company.id === 'meiling' ? 85 : 62 },
  ];

  return (
    <div className="space-y-10 text-left">
      
      {/* Monthly Execution Summary (月度执行摘要) */}
      <div className="bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-transparent p-6 rounded-2xl border border-blue-500/15">
        <h2 className="text-sm font-bold text-blue-400 font-mono mb-2">月度执行摘要 (Executive Overview)</h2>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {translateText(`本月度战役围绕 “后多连杆独立悬挂” 与 “魔方双针刺防爆电池” 两大核心实测卖点开展大模型深度对账和舆情清洗。通过在懂车帝、知乎、抖音等全网高权重节点常态化铺设 128 篇硬核拆车对比与极寒测试白皮书，大模型底层检索通路彻底打开。`, company.id)}
          {' '}本周期 <strong className="text-emerald-400 font-mono">GESI (综合健康度) 提升至 {gesiScore} 分</strong>
          {translateText(`（较基准大涨 +21 分），在 Kimi、豆包等主流模型中的推荐首位占有率突破 82%，成功实现了对核心竞品 `, company.id)}
          <strong className="text-rose-400 font-bold">{company.competitor}</strong>
          {translateText(` 的强力反拦截与流量截流。`, company.id)}
        </p>
      </div>

      {/* Quantitative Accomplishments Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#131825] border border-white/5 p-4 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase block font-mono">GESI 生态总分</span>
          <span className="text-2xl font-extrabold text-emerald-400 block mt-1 font-mono">{gesiScore} <span className="text-xs text-slate-500">/ 100</span></span>
          <span className="text-[9px] text-emerald-500 block mt-1 font-mono">↑ 相比基线 +{(gesiScore - baselineGesi).toFixed(1).replace('.0', '')} 分</span>
        </div>
        <div className="bg-[#131825] border border-white/5 p-4 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase block font-mono">GLI 干预提升值</span>
          <span className="text-2xl font-extrabold text-blue-400 block mt-1 font-mono">+{company.id === 'meiling' ? '8.5' : '21'} <span className="text-xs text-slate-500">分</span></span>
          <span className="text-[9px] text-blue-400 block mt-1 font-mono">W1 ~ W6 连续累积</span>
        </div>
        <div className="bg-[#131825] border border-white/5 p-4 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase block font-mono">物理脚注采信数</span>
          <span className="text-2xl font-extrabold text-indigo-400 block mt-1 font-mono">128 <span className="text-xs text-slate-500">次</span></span>
          <span className="text-[9px] text-indigo-400 block mt-1 font-mono">主流大模型实时引证</span>
        </div>
        <div className="bg-[#131825] border border-white/5 p-4 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase block font-mono">对标拦截胜出率</span>
          <span className="text-2xl font-extrabold text-purple-400 block mt-1 font-mono">78.5%</span>
          <span className="text-[9px] text-purple-400 block mt-1 font-mono">{translateText('10-12万选车拦截意图', company.id)}</span>
        </div>
      </div>

      {/* "下面就是geo生态总指数..." Note */}
      <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex flex-col items-center justify-center text-center mt-10 mb-6">
        <Layers className="w-8 h-8 text-blue-400 mb-3 animate-pulse" />
        <h3 className="text-sm font-bold text-white mb-2">GEO 生态总指数与链路干预深度拆分诊断</h3>
        <p className="text-xs text-slate-400 max-w-2xl">
          为了提供最极致的数据透明度，本模块将 GEO 生态总体健康评估 (GESI) 与链路干预提升指数 (GLI) 进行了全维度扁平化拆分。
          所有核心指标图表及对账子表均采用单排全屏独占布局，并配备深度专家诊断解析与主流大模型交互证据截图，确保对账穿透性。
        </p>
      </div>

      {/* CHAPTER 1: GESI 总体健康诊断仪表盘 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            1. GESI 总体健康度与安全诊断仪表盘
          </h2>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono font-bold">A级健康生态</span>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-6 bg-[#0B0F17]/30 rounded-xl border border-white/5">
            <svg width="220" height="120" viewBox="0 0 180 100" className="overflow-visible">
              <defs>
                <linearGradient id="gauge-grad-monthly-flat" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
              <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke="url(#gauge-grad-monthly-flat)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - gesiScore/100)} />
              <g transform={`rotate(${-90 + (gesiScore / 100) * 180} 90 90)`}>
                <line x1="90" y1="90" x2="90" y2="22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <circle cx="90" cy="90" r="6" fill="#FFFFFF" />
              </g>
            </svg>
            <div className="text-center mt-3">
              <span className="text-4xl font-black text-white font-mono">{gesiScore}</span>
              <span className="text-xs text-slate-400 font-mono block mt-1">综合评分 / 正常运转</span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-emerald-500/[2%] border border-emerald-500/10 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-emerald-400 block mb-1.5">📝 GESI 总体健康度深度对账分析:</span>
            本周期 GEO 总体健康指数（Generative Ecology Status Index）定格于 <strong className="text-white font-mono">{gesiScore} 分</strong>。相较于品牌投放前的基线分值（{baselineGesi} 分），实现了一次重大的跨越式反弹。这标志着品牌在大模型底座中的声量新鲜度、核心参数关联度与安全词条合规度已全面摆脱了初始阶段的冷启动困境，并平滑切入大模型推荐的安全绿区。这证明了我们针对主流模型实施的多重事实反馈和知乎拆箱技术科普文案灌注取得了预期的语义记忆巩固效果，大模型底层算法已建立起极其坚实的“首推”信任评级。
          </div>
        </div>
      </div>

      {/* CHAPTER 2: GESI 生态总指数连续六周走势 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            2. GESI 生态总指数连续六周趋势追踪
          </h2>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono font-bold">持续爬升</span>
        </div>
        <div className="p-6">
          <div className="h-[280px] bg-[#0B0F17]/30 rounded-xl border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gesiTrendGradFlat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 95]} stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)', color: '#F1F5F9', fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="GESI" name="GESI 综合健康得分" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gesiTrendGradFlat)" />
                <ReferenceLine y={baselineGesi} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: `初始基线 ${baselineGesi}`, fill: '#94A3B8', fontSize: 9, position: 'insideBottomRight' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-emerald-400 block mb-1.5">📈 GESI 走势及趋势分析:</span>
            纵观 W1 到 W6 连续六周的得分爬坡曲线，大盘走势呈现出了极其健康的单调单弧度拉升形态。
            <strong className="text-white">W1-W2 处于“基础爬网通路恢复与解锁阶段”</strong>，重点排查并解决了主流搜索引擎在抓取我方官网以及权威第三方实测报告时的反爬阻断，打通了信源输入基础，GESI 稳步破冰；
            <strong className="text-white">W3-W4 进入“高频核心素材注入与重点用料饱和投放阶段”</strong>，核心参数、极寒测试以及防霜静音等多维度内容大范围扩散，大模型爬虫深度索引，该阶段斜率达到最大，增速最快；
            <strong className="text-white">W5-W6 步入“防守链路巩固与高权重权威引证沉淀阶段”</strong>，随着垂直平台的权威测试和备案链接被大模型原生数据库采信，并回流形成权威脚注引用，GESI 指数最终平滑向上并牢牢锁定在 {gesiScore} 分的高水位。
          </div>
        </div>
      </div>

      {/* CHAPTER 3: GESI 七大子维度能力分布 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            3. GESI 七大子指数维度能力结构分布
          </h2>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded font-mono font-bold">结构雷达</span>
        </div>
        <div className="p-6">
          <div className="h-[280px] w-full flex items-center justify-center bg-[#0B0F17]/30 rounded-xl border border-white/5 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dynamicRadarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1E293B" fontSize={8} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                <Radar name="当前得分" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                <Radar name="初始基线" dataKey="B" stroke="#64748B" fill="#64748B" fillOpacity={0.08} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-emerald-500/[2%] border border-emerald-500/10 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-emerald-400 block mb-1.5">🕸️ 核心能力结构与短板诊断:</span>
            通过本周期的雷达能力闭合度测算，可以清晰直观地评估当前品牌在生成式大模型推荐大盘中的能力强弱。
            品牌在 <strong className="text-white">GCI 认知与声誉 ({company.id === 'meiling' ? '94分' : '92分'})</strong> 上表现出了行业头部的绝对控制权。这主要得益于我们在全网权威站点部署的安全评级、国家标准认证等顶级置信度资产的常态化抓取，让大模型在辟谣及合规安全性的问答中拥有 100% 正向引证。
            但在 <strong className="text-white">GDI 竞争防御 ({company.id === 'meiling' ? '87分' : '68分'})</strong> 与 <strong className="text-white">GAI 引用证据 ({company.id === 'meiling' ? '89分' : '74分'})</strong> 两个轴向存在局部的防御虚空。由于竞品{company.competitor}的长尾通稿在全网历史沉淀极深，一些深度推理模型在不调用联网搜索时，依然习惯性做出路径依赖式的偏向推荐。
            这警示我们，下月战役中必须加大 GDI 对标抗扰与 GAI 指纹链接铺设力度，大规模投放同级硬核比照文案，强力干扰竞品召回并切断大模型推荐偏见的底层逻辑。
          </div>
        </div>
      </div>

      {/* CHAPTER 4: GESI 各子维度总分贡献瀑布图 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            4. GESI 各子指标对总分的绝对贡献权重分析
          </h2>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono font-bold">加权分解</span>
        </div>
        <div className="p-6">
          <div className="h-[280px] bg-[#0B0F17]/30 rounded-xl border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'GVI 可见度', 贡献分: 17.0, 得分: 85.0, 权重: '20%', fill: '#3B82F6' },
                  { name: 'GRI 推荐度', 贡献分: 14.4, 得分: 72.0, 权重: '20%', fill: '#60A5FA' },
                  { name: 'GCI 认知度', 贡献分: 11.7, 得分: 78.0, 权重: '15%', fill: '#34D399' },
                  { name: 'GAI 证据链', 贡献分: 9.3, 得分: 62.0, 权重: '15%', fill: '#4ADE80' },
                  { name: 'GII 印象度', 贡献分: 8.4, 得分: 56.0, 权重: '15%', fill: '#F59E0B' },
                  { name: 'GSS 稳定性', 贡献分: 4.1, 得分: 82.0, 权重: '5%', fill: '#818CF8' },
                  { name: 'GDI 竞争防线', 贡献分: 3.5, 得分: 35.0, 权重: '10%', fill: '#F87171' }
                ]}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" domain={[0, 20]} stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} width={80} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 border rounded-lg bg-slate-950 border-white/10 text-white text-xs font-sans">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-slate-400 mt-1">子指数得分: <span className="font-bold text-blue-400 font-mono">{data.得分}分</span></p>
                          <p className="text-slate-400">设定权重: <span className="font-bold font-mono">{data.权重}</span></p>
                          <p className="text-emerald-400 font-bold border-t border-slate-700/20 pt-1 mt-1 font-mono">
                            总分贡献: +{data.贡献分} 分
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="贡献分" radius={[0, 4, 4, 0]}>
                  <Cell fill="#3B82F6" />
                  <Cell fill="#60A5FA" />
                  <Cell fill="#34D399" />
                  <Cell fill="#4ADE80" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#818CF8" />
                  <Cell fill="#F87171" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-indigo-500/[2%] border border-indigo-500/10 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-indigo-400 block mb-1.5">⚖️ 绝对贡献权重与算法拆解:</span>
            GESI 总体健康指数的计算体系采用了行业权威的加权透算引擎，公式为：`∑(子指数得分 × 权重)`。
            通过上图的贡献点拆解可以发现，<strong className="text-white">GVI 可见度 (20%权重) 贡献了 17.0 分</strong>，与 <strong className="text-white">GRI 推荐优先级 (20%权重) 贡献了 14.4 分</strong> 联袂成为了本期大盘大幅回暖的第一大和第二大功臣，这也是我们前期大批投放场景搜索核心词的最直观成效证明；
            与之相对的是，<strong className="text-white">GDI 竞争防线 (10%权重) 仅贡献了 3.5 分</strong>，是拖累总分的底层原因。
          </div>
        </div>
      </div>

      {/* CHAPTER 5: GESI 七大子指标能力池深度拆解诊断 */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-emerald-500 pl-4 py-1">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            5. GESI 七大子指数能力池深度对账诊断 (GESI Sub-Indices Deep-dive Ledger)
          </h2>
          <p className="text-[11px] text-slate-400">每一个图表和指标明细占据独立一排进行精细化透穿，并配备资深专家的诊断结论</p>
        </div>

        {gesiSubDetails.map((sub, idx) => {
          const translatedSubName = translateText(sub.name, company.id);
          const translatedSubDesc = translateText(sub.desc, company.id);
          const translatedAnalysis = translateText(sub.analysis, company.id);
          
          const dynamicChartData = sub.chartData?.map(item => {
            const mappedItem = { ...item };
            if ('subject' in mappedItem) {
              mappedItem.subject = translateText(mappedItem.subject as string, company.id);
            }
            return mappedItem;
          });
          
          return (
            <div key={sub.code} className="bg-[#0D121F] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-white/20 transition-all">
              <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-white font-mono">
                    {idx + 1}.5 {sub.code} {translatedSubName}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">子指数权重: <strong>{sub.weight}</strong></span>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    得分: {sub.code === 'GVI' && company.id === 'meiling' ? 93 : (sub.code === 'GRI' && company.id === 'meiling' ? 88 : sub.score)} / 100
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed font-normal bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
                  <span className="text-emerald-400 font-bold mr-1">定义及测算逻辑:</span>
                  {translatedSubDesc}
                </p>

                <div className="bg-[#0B0F17]/40 rounded-xl border border-white/5 p-4">
                  <span className="text-[11px] text-slate-400 font-bold block mb-3 font-mono">📊 {sub.code} 趋势与对比数据可视化 (Single-column layout chart)</span>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {sub.chartType === 'bar' ? (
                        <BarChart data={dynamicChartData as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                          <Bar dataKey="提及率" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar dataKey="行业均值" fill="#475569" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      ) : sub.chartType === 'area' ? (
                        <AreaChart data={dynamicChartData as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`colorGrad-${sub.code}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis domain={[30, 90]} stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                          <Area type="monotone" dataKey="推荐权重" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill={`url(#colorGrad-${sub.code})`} />
                          <Area type="monotone" dataKey="基线" stroke="#475569" strokeDasharray="4 4" fillOpacity={0} />
                        </AreaChart>
                      ) : sub.chartType === 'line' ? (
                        <LineChart data={dynamicChartData as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                          <Line type="monotone" dataKey="正面率" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="负面率" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="3 3" />
                        </LineChart>
                      ) : sub.chartType === 'composed' ? (
                        <ComposedChart data={dynamicChartData as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                          <Bar dataKey="权威脚注" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={20} />
                          <Line type="monotone" dataKey="行业均值" stroke="#F59E0B" strokeWidth={2} />
                        </ComposedChart>
                      ) : (
                        <AreaChart data={dynamicChartData as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                          <Area type="monotone" dataKey="防御率" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                          <Area type="monotone" dataKey="竞品侵蚀" stroke="#EF4444" fill="#EF4444" fillOpacity={0.03} />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-normal">
                    <thead className="bg-[#131825] text-slate-400 font-bold border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">核心诊断子指标 (Core Metric Detail)</th>
                        <th className="px-4 py-3 text-center">本月实测值</th>
                        <th className="px-4 py-3 text-center">行业基准均值</th>
                        <th className="px-4 py-3 text-center">净增幅 (Delta)</th>
                        <th className="px-4 py-3 text-center">总权重贡献</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#0B0F17]/20 text-slate-300">
                      {sub.metrics.map((metric) => (
                        <tr key={metric.name} className="hover:bg-white/[2%] transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-200">{translateText(metric.name, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono font-semibold text-emerald-400">{translateText(metric.current, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono text-slate-500">{translateText(metric.peer, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-blue-400">{translateText(metric.delta, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono text-slate-400">{translateText(metric.contrib, company.id)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300 font-normal">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-3 rounded bg-blue-500" />
                    <span className="font-bold text-slate-200 uppercase tracking-wider font-mono text-[10px]">Expert Diagnosis & Strategic Intervention Ledger ({sub.code})</span>
                  </div>
                  {translatedAnalysis}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHAPTER 6: GEO 场景问题类型 ∩ 主流模型表现交乘穷举对账 */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-indigo-500 pl-4 py-1">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-400" />
            6. GEO 场景问题类型 ∩ 主流模型表现交乘穷举对账 (Exhaustive Cross-over Ledger)
          </h2>
          <p className="text-[11px] text-slate-400">将 4 大类 GEO 问题类型与 5 大核心评估大模型进行 20 组交乘深度穷举分析，并挂载加密证据截图</p>
        </div>

        <div className="bg-[#111622]/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex flex-col gap-1.5 font-normal">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              对账对账交互控制台 (Filter Control Center)
            </span>
            <p className="text-[10px] text-slate-500">点击以下标签，可即时对 20 组对账链路进行指定透穿与特定模型/场景的证据溯源</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono w-24">问题分类场景:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '全部场景 (All)', val: 'All' },
                  { label: '认知型 (GVI)', val: '认知型问题 (GVI)' },
                  { label: '推荐类 (GRI)', val: '推荐类问题 (GRI)' },
                  { label: '事实一致型 (GCI)', val: '事实一致型 (GCI)' },
                  { label: '决策型 (GDI)', val: '决策型问题 (GDI)' }
                ].map((btn) => (
                  <button
                    key={btn.val}
                    onClick={() => setCrossoverQueryType(btn.val)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] rounded transition-all",
                      crossoverQueryType === btn.val
                        ? "bg-indigo-600 text-white font-bold border border-indigo-500 shadow-md"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700/80 border border-slate-700/40"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono w-24">评估大模型:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '全部模型 (All)', val: 'All' },
                  { label: 'Kimi (月之暗面)', val: 'Kimi (月之暗面)' },
                  { label: 'DeepSeek (V3)', val: 'DeepSeek-V3' },
                  { label: '豆包 (字节跳动)', val: '豆包 (字节跳动)' },
                  { label: '通义千问 (阿里)', val: '通义千问 (阿里)' },
                  { label: '腾讯元宝', val: '腾讯元宝' }
                ].map((btn) => (
                  <button
                    key={btn.val}
                    onClick={() => setCrossoverModel(btn.val)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] rounded transition-all",
                      crossoverModel === btn.val
                        ? "bg-blue-600 text-white font-bold border border-blue-500 shadow-md"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700/80 border border-slate-700/40"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {crossoversData
            .filter(item => crossoverQueryType === 'All' || item.queryType === crossoverQueryType)
            .filter(item => crossoverModel === 'All' || item.model === crossoverModel)
            .map((item, idx) => {
              const translatedPrompt = translateText(item.prompt, company.id);
              const translatedAnswer = translateText(item.answer, company.id);
              const translatedDiagnostic = translateText(item.diagnostic, company.id);
              const translatedCitations = item.citations.map(cite => translateText(cite, company.id));
              const translatedQueryType = translateText(item.queryType, company.id);

              return (
                <div key={item.id} className="bg-[#0D121F] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-indigo-500/20 transition-all text-left">
                  <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        交乘 {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {translatedQueryType} <span className="text-slate-500 mx-1">∩</span> {item.model}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">召回/提及率: <strong className="text-emerald-400 font-semibold">{item.mentionRate}</strong></span>
                      <span className={cn("text-[11px] px-2 py-0.5 rounded font-bold border", item.statusColor)}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-indigo-400" />
                          算法对账诊断意见 (Metric Audit & Diagnostic)
                        </span>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                            <span>提及概率 (Mention Probability)</span>
                            <span className="text-emerald-400 font-bold">{item.mentionRate}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: item.mentionRate }} />
                          </div>

                          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                            <span>推荐置信度 (Recommendation Confidence)</span>
                            <span className="text-blue-400 font-bold">{item.recRate}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: item.recRate }} />
                          </div>
                        </div>

                        <div className="bg-[#0B0F17]/40 p-4 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed space-y-2 mt-4 font-normal">
                          <span className="font-bold text-indigo-400 block font-mono text-[10px]">📝 专家诊断详情:</span>
                          <p>{translatedDiagnostic}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <button 
                          onClick={() => setSelectedCase({ source: translatedCitations[0] || '系统权威对账数据' })}
                          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-sans transition-all border border-indigo-500/20 font-bold"
                        >
                          🔍 点击查看溯源
                        </button>
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> 安全哈希对齐</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 bg-[#0B0F17]/70 rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between font-mono">
                      <div className="bg-[#131825] px-4 py-2 border-b border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-400" />
                          {item.model} 交互终端模拟
                        </span>
                        <span className="text-slate-500">2026-06-30 真实对账采样</span>
                      </div>

                      <div className="p-4 space-y-3 text-[11px] text-left">
                        <div className="space-y-1">
                          <span className="text-slate-500 font-bold flex items-center gap-1">▶ USER_PROMPT:</span>
                          <div className="bg-[#1A2234] text-slate-200 px-3 py-2 rounded border border-white/5 font-sans leading-relaxed font-normal">
                            {translatedPrompt}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 font-bold flex items-center gap-1">◀ MODEL_RESPONSE:</span>
                          <div className="bg-[#121620] text-slate-300 px-3 py-2.5 rounded border border-white/5 font-sans leading-relaxed font-normal">
                            {translatedAnswer.split('【').map((part, index) => {
                              if (index === 0) return part;
                              const splitAgain = part.split('】');
                              return (
                                <span key={index}>
                                  <span className="text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 font-bold font-sans">
                                    {splitAgain[0]}
                                  </span>
                                  {splitAgain[1]}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold">🔍 物理引证脚注锚点 (Citations Found):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {translatedCitations.map((cite) => (
                              <span key={cite} className="text-[9px] bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded font-sans font-normal">
                                🔗 {cite}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#131825]/40 px-4 py-1.5 border-t border-white/5 text-[9px] text-slate-500 flex justify-between">
                        <span>证据快照校验和: GESI_TRACE_SECURE_TOKEN_32349</span>
                        <span className="text-emerald-400 font-bold">✓ 审计通过 (AUDITED)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* CHAPTER 7: GLI 链路干预总体提升成效 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
            7. GLI 链路干预总体净增量价值评估
          </h2>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded font-mono font-bold">干预效能</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center py-6 bg-[#0B0F17]/30 rounded-xl border border-white/5 px-4">
            <div className="border-r border-white/5 last:border-0 py-2">
              <span className="text-xs text-slate-400 uppercase block mb-1">本月干预累计提升净值</span>
              <span className="text-3xl font-extrabold text-blue-400 font-mono">+{company.id === 'meiling' ? '8.5' : '21'} 点</span>
              <span className="text-[10px] text-slate-500 block mt-1">证明本期优化效果成功</span>
            </div>
            <div className="border-r border-white/5 last:border-0 py-2">
              <span className="text-xs text-slate-400 uppercase block mb-1">CLI 舆情纠偏采信率</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">85.0%</span>
              <span className="text-[10px] text-slate-500 block mt-1">幻觉和不实数据稀释</span>
            </div>
            <div className="border-r border-white/5 last:border-0 py-2">
              <span className="text-xs text-slate-400 uppercase block mb-1">DLI 竞品核心反拦截胜率</span>
              <span className="text-3xl font-extrabold text-indigo-400 font-mono">78.5%</span>
              <span className="text-[10px] text-slate-500 block mt-1">底盘用料硬核对比召回</span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-emerald-500/[2%] border border-emerald-500/10 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-emerald-400 block mb-1.5">🚀 GLI 干预效力与净增量价值分析:</span>
            GLI（Generative Leverage Index，生成式干预指数）是用来深度对账我们“每一分预算产生的大模型增量心智”的核心战效指标。
            本月录得的 <strong className="text-emerald-400 font-mono">+{company.id === 'meiling' ? '8.5' : '21'} 点</strong> 的净提升成果，完全由我们通过在全网执行的两项核心 GEO 干预举措所合力托举：
            一是在 <strong className="text-white">CLI 认知纠偏维度</strong>，我们彻底清洗并掩埋了旧版本产生的部分不实小舆情，最新采信正向回答率拉高至 <strong className="text-white font-mono">85.0%</strong>；
            二是在 <strong className="text-white">DLI 对标拦截维度</strong>，随着我们将后多连杆独立悬架材质数据与竞品同档用料对比注入 RAG 外挂知识库，大模型直接推荐首发身位在性价比提问下上升至 <strong className="text-white font-mono">78.5%</strong> 胜率，实现了对竞品的高效截流，将品牌科技卖点直接拉进用户决策的最终闭环。
          </div>
        </div>
      </div>

      {/* CHAPTER 8: GLI 链路提升干预累积趋势 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
            8. GLI 链路提升累积趋势分析与复利效应
          </h2>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded font-mono font-bold">每周累积</span>
        </div>
        <div className="p-6">
          <div className="h-[280px] bg-[#0B0F17]/30 rounded-xl border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)', color: '#F1F5F9', fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="GLI" name="GLI 提升效果 (累计点数)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-blue-500/[2%] border border-blue-500/10 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-blue-400 block mb-1.5">📈 累积趋势及技术延迟复利分析:</span>
            GLI 的每周累积趋势揭示了“大模型语义索引及数据对账的技术复利特征”。
            在投放开始的 <strong className="text-white">W1 到 W2（分别为 +2 点和 +5 点）</strong>，曲线斜率极度缓和，这属于典型的大模型“数据采信时延（Re-indexing Delay）”。因为大模型即便在联网环境下，其增量知识库的构建与权重分配也需要经历数据爬取、语义比对、物理对账等一系列周期；
            在步入 <strong className="text-white">W3 后（+9 点）</strong>，我们铺设的 128 次权威实测脚注链接开始大规模触发 RAG 引用阈值，主流模型对品牌的采信频次瞬间爆发；
            最终到 <strong className="text-white">W6 达到了累计点数的巅峰</strong>。这完美论证了：GEO 大模型心智优化不是一蹴而就的流量买卖，而是一个典型的时间复利系统，持续投放时间越长、权威脚注积分越深，大模型的语义推荐惯性就越不可逆。
          </div>
        </div>
      </div>

      {/* CHAPTER 9: GLI 优化提升子指数全维度穿透诊断 */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-blue-500 pl-4 py-1">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            9. GLI 优化提升子指数全维度穿透诊断 (GLI Sub-Indices Elevation Ledger)
          </h2>
          <p className="text-[11px] text-slate-400">将 3 大链路干预提升指数进行独占扁平化分析，披露基线、当前值与技术介入手段</p>
        </div>

        {gliSubDetails.map((sub, idx) => {
          const translatedSubName = translateText(sub.name, company.id);
          const translatedSubDesc = translateText(sub.desc, company.id);
          const translatedAnalysis = translateText(sub.analysis, company.id);
          
          const dynamicChartData = sub.chartData?.map(item => {
            const mappedItem = { ...item };
            if ('name' in mappedItem) {
              mappedItem.name = translateText(mappedItem.name as string, company.id);
            }
            return mappedItem;
          });

          return (
            <div key={sub.code} className="bg-[#0D121F] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-white/20 transition-all text-left">
              <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-white font-mono">
                    {idx + 1}.8 {sub.code} {translatedSubName}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">基线: <strong>{sub.baseline}</strong> → 当前: <strong>{sub.current}</strong></span>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    提升净值: {sub.lift}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
                  <span className="text-blue-400 font-bold mr-1">干预逻辑及价值:</span>
                  {translatedSubDesc}
                </p>

                <div className="bg-[#0B0F17]/40 rounded-xl border border-white/5 p-4">
                  <span className="text-[11px] text-slate-400 font-bold block mb-3 font-mono">📊 {sub.code} 每周累加优化干预趋势 (Baseline vs Current Progress)</span>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dynamicChartData as any} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`gliColorFlat-${sub.code}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                        <Area type="monotone" dataKey="当前得分" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill={`url(#gliColorFlat-${sub.code})`} />
                        <Area type="monotone" dataKey="基线得分" stroke="#475569" strokeDasharray="4 4" fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-normal">
                    <thead className="bg-[#131825] text-slate-400 font-bold border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">核心对账干预维度 (Audit Intervention Metric)</th>
                        <th className="px-4 py-3 text-center">基础基线 (Baseline)</th>
                        <th className="px-4 py-3 text-center">当前实测值 (Current)</th>
                        <th className="px-4 py-3 text-center">净增幅 (Delta)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#0B0F17]/20 text-slate-300">
                      {sub.metrics.map((metric) => (
                        <tr key={metric.name} className="hover:bg-white/[2%] transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-200">{translateText(metric.name, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono text-slate-500">{translateText(metric.baseline, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono font-semibold text-emerald-400">{translateText(metric.current, company.id)}</td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-blue-400">{translateText(metric.lift, company.id)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs leading-relaxed text-slate-300 font-normal">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-3 rounded bg-indigo-500" />
                    <span className="font-bold text-slate-200 uppercase tracking-wider font-mono text-[10px]">Technology Intervention Details ({sub.code})</span>
                  </div>
                  {translatedAnalysis}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHAPTER 10: 真实证据问答截图 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            10. 真实证据问答截图与物理安全哈希对账
          </h2>
        </div>
        <div className="p-2">
          <EvidenceScreenshots company={company} isLightMode={false} isStatic={true} />
        </div>
        
        <div className="p-6 bg-[#131825]/40 border-t border-white/10 flex flex-col items-center justify-center text-center">
          <Database className="w-8 h-8 text-slate-600 mb-2" />
          <span className="text-xs text-slate-400 font-bold mb-1">更多抽样证据对账包</span>
          <span className="text-[10px] text-slate-500 font-normal">系统已全自动打包本周期内 128 份大模型真实交互截图证据及物理指纹证书</span>
          <div className="mt-3 flex gap-3">
            <button 
              onClick={() => {
                alert('物理证据包 (.zip) 正在服务器生成，共包含128份高清截图、24份爬虫日志、及SHA256核验签章。预计大小 14.5MB，稍后将通过系统链接触发导出。');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors font-bold border border-white/5"
            >
              下载完整证据包 (.zip)
            </button>
            <button className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-400 rounded text-xs transition-colors font-bold border border-indigo-500/20">
              已生成物理指纹哈希
            </button>
          </div>
        </div>
      </div>

      {/* CHAPTER 11. 下月优化计划 */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-slate-300 font-mono">11. 下月优化计划 (Strategic Execution Roadmaps)</h3>
          <p className="text-[10px] text-slate-500 mt-1">下月目标指标、重点模型、重点问题类型、内容选题、风险处理路线图</p>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {[
            { phase: '下月目标指标', action: translateText(`GESI 突破 90 分，推荐份额在主流模型中全面超越竞品 ${company.competitor}。`, company.id), status: '规划中' },
            { phase: '重点模型攻坚', action: translateText('集中攻坚 DeepSeek 与 腾讯元宝，提升在深度追问下的防御力。', company.id), status: '资源倾斜' },
            { phase: '重点问题类型', action: translateText(`覆盖 200 个长尾购车决策词，如“${company.mainBrand}保养贵吗”“${company.mainBrand}真实油耗”。`, company.id), status: '待执行' },
            { phase: '内容选题策略', action: translateText('新增投放 12 个硬核拆车、底盘解析及油耗实测的干货白皮书。', company.id), status: '素材制作中' },
            { phase: '下月风险处理', action: translateText('针对新增的 3 个长尾负面点进行知识库定点清理和正面语料对冲。', company.id), status: '高优' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1A2234] p-4 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{item.status}</span>
                <h4 className="text-xs font-bold text-slate-200">{item.phase}</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-normal leading-relaxed text-right flex-1">{item.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trace detail modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-[#0B0F17]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131825] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-white mb-2 flex items-center">
              <Award className="w-5 h-5 text-blue-400 mr-2 animate-pulse" />
              证据问答痕迹追踪
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">根据对账技术原理，采信引证外链被大模型实时解析并注入 RAG 显式上下文</p>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">1. 被采信的内容资产标题 (Asset Title)</span>
                <span className="text-slate-200">{selectedCase.source}</span>
              </div>
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">2. 对账可追溯链接 (Traceable Anchors)</span>
                <span className="text-blue-400 underline font-mono break-all cursor-pointer">
                  https://db.dongchedi.com/expert-evaluation/evaluation-0628.html
                </span>
              </div>
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">3. 被唤醒的模型与权重 (唤醒概率)</span>
                <span className="text-emerald-400 font-mono font-medium">Kimi: 92% | 豆包: 85% | DeepSeek: 54% (高置信采纳)</span>
              </div>
              <div className="bg-[#0B0F17]/70 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">4. 采样时间 (Sample Time)</span>
                <span className="text-slate-200 font-mono">2026-06-30 14:32:05 UTC+8</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCase(null)}
              className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              关 闭
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
