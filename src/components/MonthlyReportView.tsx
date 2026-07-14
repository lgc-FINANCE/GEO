// src/components/MonthlyReportView.tsx
import { useState } from 'react';
import { 
  Layers, Database, ShieldAlert, Award, Globe, 
  RefreshCw, CheckCircle2, ChevronRight, HelpCircle, ArrowUpRight, Activity
} from 'lucide-react';
import { Company } from '../data';
import { EvidenceScreenshots } from './EvidenceScreenshots';
import { GaiInferenceHubModal } from './GaiInferenceHub';
import { trendData } from './MonthlyReportData';
import { cn } from '../lib/utils';

// Modular Component Imports
import { MonthlyOverviewAndCards } from './MonthlyOverviewAndCards';
import { MonthlyModelAndQueryAnalysis } from './MonthlyModelAndQueryAnalysis';
import { MonthlyCompetitorAndRisk } from './MonthlyCompetitorAndRisk';
import { MonthlyEvidenceAndRoadmap } from './MonthlyEvidenceAndRoadmap';
import { MonthlyFlatReportView } from './MonthlyFlatReportView';

// Recharts for the Radar sub-section preserved inside main file for pristine alignment
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend, Tooltip 
} from 'recharts';

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

export function MonthlyReportView({ company, onBack, isLightMode = false }: { company: Company; onBack: () => void; isLightMode?: boolean }) {
  const [activeHubMetric, setActiveHubMetric] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'modular' | 'flat'>('modular');
  
  // Configuration toggles for modular report sections (Edit Mode)
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({
    summary: false,
    cards: false,
    metrics: false,
    trend: false,
    radar: false,
    models: false,
    queries: false,
    competitors: false,
    risks: false,
    evidence: false,
    roadmap: false,
  });

  const handleToggleSection = (sectionKey: string) => {
    setHiddenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleAddCustomSection = (title: string) => {
    setCustomSections(prev => [...prev, title]);
  };

  const handleRemoveCustomSection = (idx: number) => {
    setCustomSections(prev => prev.filter((_, i) => i !== idx));
  };

  // State derived from original design logic
  const gesiScore = company.id === 'meiling' ? 91 : 86;
  const baselineGesi = company.id === 'meiling' ? 82.5 : 65;
  const gesiDiff = (gesiScore - baselineGesi).toFixed(1).replace('.0', '');
  const gliDiff = company.id === 'meiling' ? '8.5' : '21';

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
    <div className="space-y-8 bg-[#0B0F17] p-6 rounded-3xl border border-white/5 font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 text-left">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h1 className="text-xl font-black text-white">{company.name} • 大模型语义健康度对账月报</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {company.id === 'meiling' ? '监控系列' : '品牌车型'}: <span className="text-blue-400 font-bold">{company.mainBrand}</span> | 对标竞品: <span className="text-rose-400 font-bold">{company.competitor}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Layout Tab Switcher */}
          <div className="bg-[#131825] border border-white/5 p-1 rounded-xl flex">
            <button
              onClick={() => setActiveTab('modular')}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTab === 'modular' 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              模块定制排版 (Modular)
            </button>
            <button
              onClick={() => setActiveTab('flat')}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTab === 'flat' 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              扁平11章总账 (Flat Ledger)
            </button>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors border border-white/5 font-bold"
          >
            返回报告列表
          </button>
        </div>
      </div>

      {activeTab === 'modular' ? (
        <>
          {/* 2. TOP TOOLBAR, EXECUTIVE OVERVIEW, THREE CARDS, ACHIEVEMENTS GRID & TREND CHART */}
      <MonthlyOverviewAndCards 
        company={company}
        translateText={translateText}
        gesiScore={gesiScore}
        baselineGesi={baselineGesi}
        gesiDiff={gesiDiff}
        gliDiff={gliDiff}
        onToggleSection={handleToggleSection}
        hiddenSections={hiddenSections}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onAddCustomSection={handleAddCustomSection}
      />

      {/* 3. Seven GESI Sub-Indices Radar Chart (七大子指数雷达图与多维分析) */}
      {!hiddenSections['radar'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10 text-left">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              3. 七大 GESI 子指数生态能力雷达模型
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono font-bold">结构比对</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-emerald-400 mr-1 block sm:inline">📊 能力结构与测算标准:</span>
              雷达网图全面聚合了可见度（GVI）、推荐度（GRI）、印象度（GII）、声誉一致性（GCI）、脚注引证（GAI）、拦截防御（GDI）以及稳定性（GSS）等大模型心智表现的7大绝对维度。
              对比优化前基线，通过三维度深度透视，精准指出哪项已然健康、哪项依然是短板、以及下周期优先做什么。
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Radar chart column (7 columns) */}
              <div className="lg:col-span-7 h-[280px] w-full flex items-center justify-center bg-[#0B0F17]/30 rounded-xl border border-white/5 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dynamicRadarData}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1E293B" fontSize={8} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                    <Radar name="当前实测值" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                    <Radar name="优化前初始基线" dataKey="B" stroke="#64748B" fill="#64748B" fillOpacity={0.08} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Three-column style strategic analysis (5 columns) */}
              <div className="lg:col-span-5 space-y-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-white/5 pb-2">🎯 大模型能力分布透视三部曲</span>
                
                <div className="space-y-3">
                  <div className="bg-[#131825] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      A. 哪些维度已经健康 (Healthy Dimensions)
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {translateText(`GCI 认知声誉 (92分) 与 GVI 可见度 (85分) 表现出顶格强劲。碰撞检测证书、魔方电池实测参数已被模型深度记忆，在面对恶意黑稿时大模型能全自动100%进行物理辟谣澄清。`, company.id)
                        .replace('92分', company.id === 'meiling' ? '94分' : '92分')
                        .replace('85分', company.id === 'meiling' ? '93分' : '85分')}
                    </p>
                  </div>

                  <div className="bg-[#131825] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      B. 哪些维度仍是短板 (Remaining Gaps)
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {translateText(`GDI 竞争拦截 (68分) 仍然是薄弱项。由于竞品秦L的历史保有量极深，在无联网时大模型底层预训练依然倾向于优先推荐竞品。`, company.id)
                        .replace('68分', company.id === 'meiling' ? '87分' : '68分')
                        .replace('秦L', company.competitor)}
                    </p>
                  </div>

                  <div className="bg-[#131825] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      C. 哪些维度下月优先做 (Next Priorities)
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {translateText(`将大批“五连杆对标板悬/电池针刺实测”素材投射进 DeepSeek 及 腾讯元宝 数据库中，强制纠偏其底座排名依赖，切断竞品截流路径。`, company.id)
                        .replace('五连杆', company.id === 'meiling' ? '微纳米控霜' : '五连杆')
                        .replace('板悬', company.id === 'meiling' ? '普通发泡' : '板悬')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI 模型表现对比 & 5. 问题类型表现分析 */}
      <MonthlyModelAndQueryAnalysis 
        company={company}
        translateText={translateText}
        hiddenSections={hiddenSections}
      />

      {/* 7. 竞品位置变化 & 8. 风险与错误修复 */}
      <MonthlyCompetitorAndRisk 
        company={company}
        translateText={translateText}
        hiddenSections={hiddenSections}
      />

      {/* 9. 原始问答证据区 & 10. 下月优化计划 */}
      <MonthlyEvidenceAndRoadmap 
        company={company}
        translateText={translateText}
        hiddenSections={hiddenSections}
      />

      {/* Render Custom User Sections in Edit Mode */}
      {customSections.length > 0 && (
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
            <h3 className="text-sm font-extrabold text-white">➕ 增设自定义对账报告版块 (Custom Sections)</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {customSections.map((secTitle, index) => (
              <div key={index} className="bg-[#0D121F] rounded-2xl overflow-hidden border border-indigo-500/30 p-6 relative group">
                {isEditMode && !isLocked && (
                  <button
                    onClick={() => handleRemoveCustomSection(index)}
                    className="absolute top-4 right-4 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg transition-colors border border-rose-500/20"
                  >
                    删除该自定义版块
                  </button>
                )}
                <h3 className="text-base font-extrabold text-white mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  {secTitle}
                </h3>
                <div className="bg-[#0B0F17]/30 border border-white/5 rounded-xl p-6 text-center text-slate-400 text-xs">
                  <HelpCircle className="w-8 h-8 text-indigo-400/40 mx-auto mb-2" />
                  自定义模块数据已经初始化完毕。
                  <p className="mt-1 text-slate-500">（进入编辑模式后，可自由修改该版块的对账参数、关联指标或插入专家对账结论）</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. Closing Area & Evidence Screenshots Parity Block */}
      <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10 text-left">
        <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            11. 真实问答采样截图与防伪哈希
          </h2>
          <span className="text-[10px] bg-slate-800 text-slate-400 border border-white/5 px-2 py-0.5 rounded font-mono font-bold">哈希证书签发</span>
        </div>
        
        <div className="p-2">
          {/* Render of existing EvidenceScreenshots component to preserve 100% feature parity */}
          <EvidenceScreenshots company={company} isLightMode={false} isStatic={true} />
        </div>

        <div className="p-6 bg-[#131825]/40 border-t border-white/10 flex flex-col items-center justify-center text-center">
          <Database className="w-8 h-8 text-slate-600 mb-2" />
          <span className="text-xs text-slate-400 font-bold mb-1">物理证据文件包 (Audit Evidence Package)</span>
          <p className="text-[10px] text-slate-500">系统已对本周期内的 128 份主流大模型（Kimi, 豆包, DeepSeek）交互回答、抓取日志进行离线防伪哈希打包。</p>
          <div className="mt-3.5 flex gap-2">
            <button 
              onClick={() => {
                alert('物理证据包 (.zip) 正在服务器生成，共包含128份高清截图、24份爬虫日志、及SHA256核验签章。预计大小 14.5MB，稍后将通过系统链接触发导出。');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 transition-all font-bold border border-white/5"
            >
              导出完整离线证据包 (.zip)
            </button>
            <button 
              onClick={() => setActiveHubMetric('GVI')}
              className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-400 rounded-xl text-xs transition-all font-bold border border-indigo-500/20"
            >
              打开高级诊断沙盒 (AI Hub)
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <MonthlyFlatReportView 
      company={company} 
      onOpenHubMetric={(code) => setActiveHubMetric(code)}
    />
  )}

      {/* Advanced GaiInferenceHubModal Drilldown */}
      {activeHubMetric && (
        <GaiInferenceHubModal 
          company={company}
          metricCode={activeHubMetric}
          onClose={() => setActiveHubMetric(null)}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
}
