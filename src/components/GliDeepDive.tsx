// src/components/GliDeepDive.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, Layers, Eye, TrendingUp, 
  Award, CheckCircle2, Shield, ShieldAlert, ArrowUpRight, 
  Activity, Info, Scale, RotateCcw, Calendar, Zap, 
  ThumbsUp, ThumbsDown, ArrowRight, MessageSquare,
  ChevronDown, ChevronUp, Sliders, Lock, Unlock
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, LineChart, Line, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

import { GliVliTab } from './GliVliTab';
import { GliRliTab } from './GliRliTab';
import { GliIliTab } from './GliIliTab';
import { GliCliTab } from './GliCliTab';
import { EvidenceScreenshots } from './EvidenceScreenshots';
import { GliAliTab } from './GliAliTab';
import { GliDliTab } from './GliDliTab';
import { GliRciTab } from './GliRciTab';
import { overviewTrendData } from './GliDeepDiveData';
import { GaiInferenceHubModal } from './GaiInferenceHub';

interface GliDeepDiveProps {
  company: Company;
  isLightMode?: boolean;
  onNavigate?: (subview: any) => void;
  viewMode?: string;
  isStatic?: boolean;
}

export function GliDeepDive({ company, isLightMode = false, isStatic = false }: GliDeepDiveProps) {
  // 7 sub-indices active states
  const [gliTab, setGliTab] = useState<'vli' | 'rli' | 'ili' | 'cli' | 'ali' | 'dli' | 'rci'>('vli');
  const [localToast, setLocalToast] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load initial weights from localStorage if exists
  const getInitialWeights = () => {
    try {
      const saved = localStorage.getItem('gli_custom_weights');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'vli' in parsed) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      vli: 20, // VLI 可见度提升
      rli: 20, // RLI 推荐力提升
      ili: 15, // ILI 印象度提升
      cli: 15, // CLI 认知纠偏
      ali: 15, // ALI 权威引证
      dli: 10, // DLI 竞争优势
      rci: 5   // RCI 通路保障
    };
  };

  const [weights, setWeights] = useState(getInitialWeights);
  const [tempWeights, setTempWeights] = useState({ ...weights });
  const [lockedWeights, setLockedWeights] = useState({
    vli: false,
    rli: false,
    ili: false,
    cli: false,
    ali: false,
    dli: false,
    rci: false
  });
  const [selectedDetailTab, setSelectedDetailTab] = useState<'vli' | 'rli' | 'ili' | 'cli' | 'ali' | 'dli' | 'rci'>('vli');
  const [activeHubMetric, setActiveHubMetric] = useState<string | null>(null);
  
  const [isWeightPanelOpen, setIsWeightPanelOpen] = useState(false);

  const triggerLocalToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  const theme = {
    cardBg: isLightMode ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0D121F] border-white/5 shadow-md',
    textPrimary: isLightMode ? 'text-slate-900' : 'text-white',
    textSecondary: isLightMode ? 'text-slate-600' : 'text-slate-400',
    textMuted: isLightMode ? 'text-slate-400' : 'text-slate-500',
    chartGrid: isLightMode ? '#f1f5f9' : 'rgba(255,255,255,0.02)',
    axisStroke: isLightMode ? '#94a3b8' : '#475569',
    chartTooltipBg: isLightMode ? '#ffffff' : '#090d16',
    chartTooltipBorder: isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
    chartTooltipText: isLightMode ? '#1e293b' : '#ffffff'
  };

  // Base Sub-indices Scores (Baseline raw values)
  const baselineSubScores = {
    vli: 72.0,
    rli: 64.0,
    ili: 70.0,
    cli: 75.0,
    ali: 60.0,
    dli: 70.0,
    rci: 74.0
  };

  // Current Sub-indices Scores (Post-optimization raw values)
  const currentSubScores = {
    vli: 85.0,
    rli: 78.0,
    ili: 82.0,
    cli: 92.0,
    ali: 74.0,
    dli: 68.0,
    rci: 80.0
  };

  // Helper to compute dynamically weighted health index
  const computeWeightedScore = (subScores: typeof baselineSubScores, currentWeights: typeof weights) => {
    const totalW = currentWeights.vli + currentWeights.rli + currentWeights.ili + currentWeights.cli + currentWeights.ali + currentWeights.dli + currentWeights.rci;
    if (totalW === 0) return 0;
    const weightedSum = 
      subScores.vli * currentWeights.vli +
      subScores.rli * currentWeights.rli +
      subScores.ili * currentWeights.ili +
      subScores.cli * currentWeights.cli +
      subScores.ali * currentWeights.ali +
      subScores.dli * currentWeights.dli +
      subScores.rci * currentWeights.rci;
    return weightedSum / totalW;
  };

  // Real-time computed GESI values based on weight configuration
  const computedBaselineGesi = computeWeightedScore(baselineSubScores, weights);
  const computedCurrentGesi = computeWeightedScore(currentSubScores, weights);
  const computedGesiDelta = computedCurrentGesi - computedBaselineGesi;

  // GLI (GEO Optimization & Elevation Index): Standard scaled 100-point effectiveness indicator matching GESI delta growth
  // Standard default yields ~14.8 points delta. Let's scale GLI index as (computedGesiDelta * 5.65) matching wireframe's GLI 72.
  const computedGliIndex = Math.min(100, Math.round(computedGesiDelta * 5.65));

  // Temp GESI calculations for real-time weights adjustment preview
  const tempTotalWeight = tempWeights.vli + tempWeights.rli + tempWeights.ili + tempWeights.cli + tempWeights.ali + tempWeights.dli + tempWeights.rci;
  const tempBaselineGesi = computeWeightedScore(baselineSubScores, tempWeights);
  const tempCurrentGesi = computeWeightedScore(currentSubScores, tempWeights);
  const tempGesiDelta = tempCurrentGesi - tempBaselineGesi;

  const handleResetWeights = () => {
    const defaultWeights = {
      vli: 20,
      rli: 20,
      ili: 15,
      cli: 15,
      ali: 15,
      dli: 10,
      rci: 5
    };
    setWeights(defaultWeights);
    setTempWeights(defaultWeights);
    setLockedWeights({
      vli: false,
      rli: false,
      ili: false,
      cli: false,
      ali: false,
      dli: false,
      rci: false
    });
    try {
      localStorage.removeItem('gli_custom_weights');
    } catch (e) {
      console.error(e);
    }
    triggerLocalToast('已成功重置各项提升指数权重');
  };

  const handleWeightChange = (changedKey: keyof typeof weights, targetVal: number) => {
    const newVal = Math.max(0, Math.min(100, targetVal));
    if (lockedWeights[changedKey]) return;

    const otherKeys = (Object.keys(tempWeights) as Array<'vli' | 'rli' | 'ili' | 'cli' | 'ali' | 'dli' | 'rci'>).filter(k => k !== changedKey);
    const unlockedOtherKeys = otherKeys.filter(k => !lockedWeights[k]);

    if (unlockedOtherKeys.length === 0) {
      return; // Can't adjust this key because all others are locked!
    }

    const oldVal = tempWeights[changedKey];
    const diff = newVal - oldVal;
    if (diff === 0) return;

    let newWeights = { ...tempWeights };
    newWeights[changedKey] = newVal;

    let remainingToDistribute = -diff;
    const step = remainingToDistribute > 0 ? 1 : -1;
    let iterations = 0;
    const maxIterations = 200;

    while (remainingToDistribute !== 0 && iterations < maxIterations) {
      iterations++;
      const activeKeys = unlockedOtherKeys.filter(k => {
        if (step > 0) return newWeights[k] < 100;
        return newWeights[k] > 0;
      });

      if (activeKeys.length === 0) {
        break;
      }

      for (const k of activeKeys) {
        if (remainingToDistribute === 0) break;
        newWeights[k] += step;
        remainingToDistribute -= step;
      }
    }

    const finalSum = (Object.keys(newWeights) as Array<'vli' | 'rli' | 'ili' | 'cli' | 'ali' | 'dli' | 'rci'>).reduce((sum, k) => sum + newWeights[k], 0);
    if (finalSum === 100) {
      setTempWeights(newWeights);
    }
  };

  const indexDetailsList = {
    vli: {
      fullName: 'VLI (Generative Visibility Index) - AI 可见度提升',
      definition: '衡量本品牌及其核心产品在主流大语言模型（如 DeepSeek, Kimi, 豆包等）问询结果中的自然出场率、提及频次与排位深度。',
      calculation: '公式：VLI = ∑ (LLM[i] 提及概率 × 排位权重系数) × 100% 。排位第一权重为 1.0，前三为 0.8，前五为 0.5。',
      optimization: '优化手段：在优质信源库（科技媒体、垂直论坛、高质量百科等）中增补结构化评测、深度拆解以及参数对比文案。',
      value: '战略价值：可见度是 GEO 的地基。如果 AI 底座根本搜索不到你的品牌，后续的推荐 and 转化就无从谈起。'
    },
    rli: {
      fullName: 'RLI (Generative Recommendation Index) - AI 推荐力提升',
      definition: '评估当用户向大模型输入具有高购买意向的导购或决策性词汇时，AI 首选推荐我方产品的意愿度与极性。',
      calculation: '公式：RLI = (AI 首选推荐次数 + 0.5 × AI 次选推荐次数) / 总测试样本数 × 100% 。',
      optimization: '优化手段：逆向解析 AI 采纳的决策因子，提炼出具有鲜明独特竞争力的“推荐标签”，并一键生成精准对账对齐的 GEO 纠偏内容。',
      value: '战略价值：直接对标最终销售转化率。高 RLI 意味着 AI 会在消费意向最强的节点为用户疯狂“安利”你的品牌。'
    },
    ili: {
      fullName: 'ILI (Generative Impression Index) - 生成式印象/情感提升',
      definition: '分析 AI 提及品牌时所展现的词汇极性、情感倾向（正面、中性、负面）以及对品牌美誉度、技术含量的定性评价。',
      calculation: '公式：ILI = (正面提及数 - 负面提及数) / 总提及数 × 100% ，结果会经过标准高阶归一化。',
      optimization: '优化手段：定向纠偏清洗 AI 抓取到的网络历史脏数据、早期噪音舆情或黑稿，补充积极的官方辟谣以及最新正面里程碑。',
      value: '战略价值：决定用户看到 AI 答案后的直观观感。即使推荐率高，如果情感偏负面或有疑虑词，也会毁灭用户信任。'
    },
    cli: {
      fullName: 'CLI (Generative Cognition Index) - AI 认知一致性与纠偏',
      definition: '评估大模型对品牌核心标签、自主技术实力（如“自研高抗压安全底盘”、“超高续航电池”）的认知精度与广度，看 AI 生成的解释是否契合品牌官方的定位。',
      calculation: '公式：CLI = 实测 AI 回答中所包含的核心技术标签重合度 / 品牌设定标准标签集 × 100% 。',
      optimization: '优化手段：通过强化在技术拆解贴、专利公示、权威机构碰撞测试或实验室报告中的关键词词频，引导 AI 固化该品牌心智。',
      value: '战略价值：品牌定位的雷达。CLI 低说明 AI 对你的认知“跑偏”或“流于表面”，无法准确传达你的硬核技术优势。'
    },
    ali: {
      fullName: 'ALI (Generative Authority Index) - 引用权威与证据可信度',
      definition: '大模型在回答中为佐证关于本品牌的陈述，而主动引用、列举、附带超链接或引证的第三方媒体、论坛、报告或百科的权威性与数量。',
      calculation: '公式：ALI = (高权重引证媒体数 × 2.0 + 基础引证数 × 1.0) / 平均引证样本数 × 100% 。',
      optimization: '优化手段：在具有极高 SEO / 权重评级的权威新闻源（如人民网、新浪科技、懂车帝等）部署带有权威引证格式的技术总结与通稿。',
      value: '战略价值：防止大模型“幻觉”并建立公信力。有高权威引证的 AI 答案，更易说服专业或高客单价买家。'
    },
    dli: {
      fullName: 'DLI (Generative Defense Index) - 竞争防御与拦截指数',
      definition: '在竞品对比搜索、竞品导购问询、甚至是带有负面倾向的挑衅问询中，本品牌能否被 AI 成功带出，以及能否成功实现负面拦截、中立纠偏或逆向防御。',
      calculation: '公式：GDI = 成功拦截并透出本品牌的样本数 / 竞品问询及挑衅词总数 × 100% 。',
      optimization: '优化手段：在对比搜索的高频阵地（论坛车主对标、媒体对比横评）部署均衡客观的优劣势拆解，帮助 AI 建立客观对比框架。',
      value: '战略价值：护城河指标。确保即使用户搜竞品，AI 也会主动提示：“对比而言，本品牌的XX性能更具优势”，完成高效截流。'
    },
    rci: {
      fullName: 'RCI (Risk Control Index) - 风险控制指数',
      definition: '评估优化后品牌风险是否减少，是否出现新的舆情风险点。主要跟踪并消减负面提及、事实幻觉及不准确陈述等重大AI生成瑕疵。',
      calculation: '包含指标：负面提及率下降、幻觉率下降、错误事实率下降。通过周期性的实测占比拟合得出控制分值。',
      optimization: '优化手段：分析高风险幻觉与不确定表达，定向推送合规精准事实，引导大模型进行心智纠偏与风险燃尽。',
      value: '战略价值：安全与防爆雷核心。确保AI不向用户推荐或生成负面瑕疵内容，建立完美的品牌口碑壁垒。'
    }
  };

  // 7 core sub-indices configuration matching GESI (Health) and GLI (Elevation) dimensions
  const tabList = [
    { key: 'vli' as const, label: 'VLI 可见度提升', icon: Eye, desc: 'AI是否看见我方品牌' },
    { key: 'rli' as const, label: 'RLI 推荐力提升', icon: TrendingUp, desc: 'AI是否主动置顶推荐' },
    { key: 'ili' as const, label: 'ILI 印象度提升', icon: Sparkles, desc: 'AI卖点描述是否饱满' },
    { key: 'cli' as const, label: 'CLI 认知纠偏', icon: CheckCircle2, desc: '辟谣及事实错误校准' },
    { key: 'ali' as const, label: 'ALI 权威引证', icon: Award, desc: '抓取权威外链可信度' },
    { key: 'dli' as const, label: 'DLI 竞争优势', icon: Shield, desc: '对标竞对多维胜出率' },
    { key: 'rci' as const, label: 'RCI 风险控制', icon: ShieldAlert, desc: '优化后风险减少与合规燃尽' }
  ];

  return (
    <div className="space-y-6">
      {/* ==================== 1. GLI 总分 提升指数卡片 (Top Header Card) ==================== */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isLightMode ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-[#0D121F] border-white/5 shadow-xl'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                GEO ELEVATION
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-bold font-mono">本统计周期：第5周 </span>
            </div>
            
            <h2 className={`text-lg font-black tracking-tight ${theme.textPrimary} flex items-center gap-2`}>
              <Layers className="w-5 h-5 text-indigo-500" />
              GLI 优化提升指数 
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              量化考核我方针对大模型(LLM)内容注入、白皮书投送及认知纠偏后的净收益提升效果。
            </p>
          </div>

          {/* Right Action buttons: 配置权重 */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            <button 
              id="btn-adjust-weights"
              onClick={() => {
                // Ensure temp state is synced with committed state when toggled on
                if (!isWeightPanelOpen) {
                  setTempWeights({ ...weights });
                }
                setIsWeightPanelOpen(!isWeightPanelOpen);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl transition-all cursor-pointer text-xs font-sans ${
                isWeightPanelOpen 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                  : isLightMode
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200'
                    : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>配置权重</span>
              {isWeightPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 权重调整与指数详情面板 */}
        {isWeightPanelOpen && (
          <div id="gli-weights-panel" className={`mt-4 p-5 rounded-2xl shadow-xl border ${
            isLightMode 
              ? 'bg-slate-50 border-slate-200' 
              : 'bg-[#090D16] border-indigo-500/20'
          } animate-in fade-in slide-in-from-top-4 duration-300 space-y-5`}>
            
            {/* Top Info Header and Presets */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/20 pb-3">
              <div>
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider font-sans">
                  <Sliders className="w-4 h-4" />
                  GLI 指数权重分配
                </h4>
                <p className={`text-[11px] ${isLightMode ? 'text-slate-600' : 'text-slate-400'} mt-1 font-sans`}>
                  自定义七大维度的计算权重比例。系统将自动保持<span className="text-emerald-500 font-bold">总和为 100%</span>。
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className={`text-[10px] ${isLightMode ? 'text-slate-600' : 'text-slate-400'} font-mono bg-slate-500/5 border ${isLightMode ? 'border-slate-200' : 'border-white/5'} px-2.5 py-1 rounded-lg flex items-center gap-1`}>
                  权重总和: <span className={tempTotalWeight === 100 ? "text-emerald-500 font-black" : "text-amber-500 font-black"}>{tempTotalWeight}%</span>
                  {tempTotalWeight !== 100 && <span className="text-amber-500 text-[9px] font-bold"></span>}
                </span>
                
                <button 
                  onClick={() => {
                    setTempWeights({ vli: 20, rli: 20, ili: 15, cli: 15, ali: 15, dli: 10, rci: 5 });
                    setLockedWeights({ vli: false, rli: false, ili: false, cli: false, ali: false, dli: false, rci: false });
                    triggerLocalToast("已应用“默认均衡权重”预设 (20:20:15:15:15:10:5)");
                  }}
                  className={`px-2.5 py-1 text-[10px] ${isLightMode ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900/40 hover:bg-white/[0.04] border-white/5 text-slate-400'} border rounded-lg transition-all cursor-pointer font-sans font-bold`}
                >
                  默认权重
                </button>
                
                <button 
                  onClick={() => {
                    setTempWeights({ vli: 40, rli: 20, ili: 10, cli: 10, ali: 10, dli: 5, rci: 5 });
                    setLockedWeights({ vli: false, rli: false, ili: false, cli: false, ali: false, dli: false, rci: false });
                    triggerLocalToast("已应用“曝光优先”权重预设 (40:20:10:10:10:5:5)");
                  }}
                  className="px-2.5 py-1 text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 rounded-lg transition-all cursor-pointer font-sans font-bold"
                >
                  曝光优先
                </button>

                <button 
                  onClick={() => {
                    setTempWeights({ vli: 10, rli: 40, ili: 20, cli: 10, ali: 10, dli: 5, rci: 5 });
                    setLockedWeights({ vli: false, rli: false, ili: false, cli: false, ali: false, dli: false, rci: false });
                    triggerLocalToast("已应用“推荐转化优先”权重预设 (10:40:20:10:10:5:5)");
                  }}
                  className="px-2.5 py-1 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/10 rounded-lg transition-all cursor-pointer font-sans font-bold"
                >
                  推荐转化优先
                </button>

                <button 
                  onClick={() => {
                    setTempWeights({ vli: 15, rli: 15, ili: 10, cli: 15, ali: 15, dli: 25, rci: 5 });
                    setLockedWeights({ vli: false, rli: false, ili: false, cli: false, ali: false, dli: false, rci: false });
                    triggerLocalToast("已应用“竞争防御优先”权重预设 (15:15:10:15:15:25:5)");
                  }}
                  className="px-2.5 py-1 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/10 rounded-lg transition-all cursor-pointer font-sans font-bold"
                >
                  竞争防御优先 
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {[
                { id: 'vli', name: 'VLI 可见度提升', color: 'bg-emerald-500', text: 'text-emerald-500', score: currentSubScores.vli },
                { id: 'rli', name: 'RLI 推荐力提升', color: 'bg-blue-500', text: 'text-blue-500', score: currentSubScores.rli },
                { id: 'ili', name: 'ILI 印象度提升', color: 'bg-purple-500', text: 'text-purple-500', score: currentSubScores.ili },
                { id: 'cli', name: 'CLI 认知度纠偏', color: 'bg-cyan-500', text: 'text-cyan-500', score: currentSubScores.cli },
                { id: 'ali', name: 'ALI 权威引证力', color: 'bg-amber-500', text: 'text-amber-500', score: currentSubScores.ali },
                { id: 'dli', name: 'DLI 竞争优势度', color: 'bg-rose-500', text: 'text-rose-500', score: currentSubScores.dli },
                { id: 'rci', name: 'RCI 风险控制力', color: 'bg-pink-500', text: 'text-pink-500', score: currentSubScores.rci },
              ].map((idx) => {
                const currentVal = tempWeights[idx.id as keyof typeof weights];
                const isLocked = lockedWeights[idx.id as keyof typeof weights];
                const isSelectedDetail = selectedDetailTab === idx.id;

                return (
                  <div 
                    key={idx.id} 
                    className={`border rounded-xl p-3 flex flex-col justify-between transition-all ${
                      isSelectedDetail 
                        ? isLightMode ? 'bg-indigo-55/50 border-indigo-400 ring-1 ring-indigo-400 bg-indigo-50/50' : 'bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/30'
                        : isLightMode
                          ? 'bg-white border-slate-200 hover:bg-slate-50'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <button
                        onClick={() => setSelectedDetailTab(idx.id as keyof typeof weights)}
                        className={`text-[11px] font-extrabold text-left hover:text-indigo-400 transition-colors cursor-pointer truncate flex-1 ${theme.textPrimary}`}
                        title="点击查看此指数详情"
                      >
                        {idx.name}
                      </button>
                      <span className={`text-[10px] font-mono ${idx.text} font-bold shrink-0`}>{idx.score}分</span>
                    </div>
                    
                    {/* Slider & Value Controls */}
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        {/* Minus Button */}
                        <button 
                          disabled={isLocked}
                          onClick={() => handleWeightChange(idx.id as keyof typeof weights, currentVal - 1)}
                          className={`w-5 h-5 flex items-center justify-center rounded cursor-pointer select-none text-[10px] font-bold ${
                            isLocked 
                              ? 'bg-slate-800/10 text-slate-600 cursor-not-allowed' 
                              : isLightMode 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          -
                        </button>
                        
                        {/* Custom Input Percentage */}
                        <span className={`text-xs font-black font-mono text-center flex-1 ${isLocked ? theme.textMuted : theme.textPrimary}`}>
                          {currentVal}%
                        </span>
                        
                        {/* Plus Button */}
                        <button 
                          disabled={isLocked}
                          onClick={() => handleWeightChange(idx.id as keyof typeof weights, currentVal + 1)}
                          className={`w-5 h-5 flex items-center justify-center rounded cursor-pointer select-none text-[10px] font-bold ${
                            isLocked 
                              ? 'bg-slate-800/10 text-slate-600 cursor-not-allowed' 
                              : isLightMode 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="1"
                          disabled={isLocked}
                          value={currentVal}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            handleWeightChange(idx.id as keyof typeof weights, val);
                          }}
                          className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-indigo-500 ${
                            isLocked ? 'bg-slate-800 opacity-40 cursor-not-allowed' : 'bg-slate-700/50'
                          }`}
                        />
                        
                        {/* Lock Button */}
                        <button
                          onClick={() => {
                            setLockedWeights(prev => ({
                              ...prev,
                              [idx.id]: !prev[idx.id as keyof typeof weights]
                            }));
                            triggerLocalToast(isLocked ? `已解锁 ${idx.name}` : `已锁定 ${idx.name}，分配其它权重时其百分比将保持不变`);
                          }}
                          className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                            isLocked 
                              ? 'bg-indigo-500/25 text-indigo-400 hover:bg-indigo-500/40' 
                              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }`}
                          title={isLocked ? "解锁权重" : "锁定权重 "}
                        >
                          {isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-indigo-400" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className={`text-[9px] ${theme.textMuted} text-center mt-2.5 font-mono border-t ${isLightMode ? 'border-slate-200' : 'border-white/5'} pt-1 tracking-wider`}>
                      贡献分值: {((idx.score * currentVal) / (tempTotalWeight || 1)).toFixed(1)}分
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Index Details Card */}
            <div className={`border rounded-xl p-4 ${isLightMode ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/40 border-white/5'} flex flex-col md:flex-row gap-5`}>
              {/* Quick selectors for details card */}
              <div className="flex md:flex-col flex-wrap gap-1 md:w-44 shrink-0 border-b md:border-b-0 md:border-r border-slate-700/20 pb-3 md:pb-0 md:pr-3">
                <span className="text-[10px] font-black uppercase tracking-wider mb-1.5 block w-full text-indigo-400 font-sans">
                   指数详情说明
                </span>
                {[
                  { id: 'vli', name: 'VLI 可见度提升' },
                  { id: 'rli', name: 'RLI 推荐力提升' },
                  { id: 'ili', name: 'ILI 印象度提升' },
                  { id: 'cli', name: 'CLI 认知度纠偏' },
                  { id: 'ali', name: 'ALI 权威引证力' },
                  { id: 'dli', name: 'DLI 竞争优势度' },
                  { id: 'rci', name: 'RCI 风险控制指数' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDetailTab(item.id as keyof typeof weights)}
                    className={`text-left text-[11px] px-2.5 py-1.5 rounded transition-all cursor-pointer font-bold ${
                      selectedDetailTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isLightMode 
                          ? 'text-slate-600 hover:bg-slate-100' 
                          : 'text-slate-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Explanations Area */}
              <div className="flex-1 space-y-3.5 leading-relaxed">
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    {indexDetailsList[selectedDetailTab].fullName}
                  </h4>
                  <p className={`text-[11px] ${theme.textPrimary} mt-2.5 bg-indigo-50/50 p-3 rounded-lg border border-indigo-500/10 leading-relaxed font-medium`}>
                    <strong className="text-indigo-400 block mb-1">指标定义：</strong>
                    {indexDetailsList[selectedDetailTab].definition}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10.5px]">
                  <div className={`p-2.5 rounded-lg border ${isLightMode ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-white/[0.02]'}`}>
                    <span className="text-[10px] font-black text-amber-500 block mb-1">计算公式：</span>
                    <span className={theme.textSecondary}>{indexDetailsList[selectedDetailTab].calculation}</span>
                  </div>
                  
                  <div className={`p-2.5 rounded-lg border ${isLightMode ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-white/[0.02]'}`}>
                    <span className="text-[10px] font-black text-emerald-500 block mb-1">优化手段：</span>
                    <span className={theme.textSecondary}>{indexDetailsList[selectedDetailTab].optimization}</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border ${isLightMode ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-white/[0.02]'}`}>
                    <span className="text-[10px] font-black text-purple-500 block mb-1">战略价值：</span>
                    <span className={theme.textSecondary}>{indexDetailsList[selectedDetailTab].value}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer with Save Button */}
            <div className={`flex flex-wrap items-center justify-between gap-4 border-t ${isLightMode ? 'border-slate-200' : 'border-white/5'} pt-3.5`}>
              <div className="text-[10.5px] text-slate-500 font-mono leading-relaxed max-w-xl">
                <span></span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Draft Score Preview */}
                <div className="text-[11.5px] font-mono mr-2 flex flex-col items-end leading-tight">
                  <span className={isLightMode ? 'text-slate-600 font-bold' : 'text-slate-400 font-bold'}>
                    实时权重:
                  </span>
                  <span className="text-[10.5px] text-slate-500 mt-0.5">
                    拟合提升 GESI: <strong className="text-emerald-400 font-mono">+{tempGesiDelta.toFixed(1)} pts</strong>
                  </span>
                </div>
                
                <button
                  disabled={tempTotalWeight !== 100}
                  onClick={() => {
                    setWeights(tempWeights);
                    try {
                      localStorage.setItem('gli_custom_weights', JSON.stringify(tempWeights));
                    } catch (e) {
                      console.error(e);
                    }
                    setIsWeightPanelOpen(false);
                    triggerLocalToast("💾 GLI 提升指数自定义权重已锁定成功！");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    tempTotalWeight === 100
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  保存生效 (Save Weights)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Score Display HUD Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-black uppercase font-mono tracking-wider">
              本周期优化提升分
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black font-mono tracking-tight text-indigo-400">
                +{computedGesiDelta.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 font-sans">pts (GESI 提升)</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              本周期优化内容部署后，在大模型召回中所产生的<b>增长值</b>。
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-black uppercase font-mono tracking-wider">
              GLI 效果提升等级
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                显著有效
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-400 font-mono">
                HIGH EFFECT
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              根据主流大模型引用、召回、及推荐排名位次变化的综合评估算法评定。
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-black uppercase font-mono tracking-wider">
              大模型问答校验置信度
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-blue-400 font-mono tracking-tight">
                98%
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-500/10 text-blue-400 font-mono">
                高置信度
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              通过跨地域、跨时段 180 组 RAG 场景测试用例交叉对账校验，偏差率仅 2%。
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. 优化前后对比卡 (三段式比对卡) ==================== */}
      <div className={`p-5 rounded-2xl border ${theme.cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4.5 h-4.5 text-emerald-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
            ⚖️ 优化前后对比卡
          </h3>
          <span className="text-[10px] text-slate-500"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Baseline GESI */}
          <div className="p-4 rounded-xl bg-slate-950/15 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black block font-mono">基线 GESI 生态健康指数</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">未进行 GEO 优化前的原始自然状态</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono tracking-tight text-slate-400">
                {computedBaselineGesi.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">分</span>
            </div>
          </div>

          {/* Current GESI */}
          <div className="p-4 rounded-xl bg-slate-950/15 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black block font-mono">当前 GESI 生态健康指数</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">内容部署及反向纠偏后的最新诊断状态</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono tracking-tight text-emerald-400">
                {computedCurrentGesi.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">分</span>
            </div>
          </div>

          {/* GLI Elevation */}
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-400 font-black block font-mono">GLI 优化提升分</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">本周期投放产生的确定性净增长值</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono tracking-tight text-indigo-400">
                +{computedGesiDelta.toFixed(1)}
              </span>
              <span className="text-[10px] text-indigo-500 block">pts 提升</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 3. 趋势图 / 动作贡献榜 / AI专家解读 (Row 1 Grid) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: 优化效果趋势折线图 */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
                📈 优化效果趋势折线图
              </h3>
            </div>
            <p className="text-[10px] text-slate-500">
              横轴：采样时间轴 / 纵轴：GLI提升量与健康度大盘
            </p>
          </div>

          {/* Trend Chart */}
          <div className="h-[180px] w-full my-4 bg-slate-950/20 rounded-xl p-2 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewTrendData} margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="optGesiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="optGliGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
                <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={9} tickLine={false} />
                <YAxis stroke={theme.axisStroke} fontSize={9} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                <Area type="monotone" dataKey="GESI健康度" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#optGesiGrad)" name="GESI生态健康" />
                <Area type="monotone" dataKey="GLI提升" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#optGliGrad)" name="GLI效果值" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10.5px] text-slate-500 leading-relaxed bg-slate-950/20 p-2.5 rounded-lg border border-white/5 font-mono">
          </div>
        </div>

        {/* Center: 优化动作贡献榜 */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
                🏆 优化动作贡献榜
              </h3>
            </div>
            <p className="text-[10px] text-slate-500">
              精准追踪哪些资源和平台产生了最高转换价值
            </p>
          </div>

          <div className="space-y-3 my-4 font-mono">
            {/* Rank 1: 最多引用内容 */}
            <div className="p-2.5 bg-slate-950/30 border border-white/5 rounded-xl text-xs space-y-1 hover:bg-[#151D2F] transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-indigo-400 font-bold">1. 被引用最多内容资产</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 rounded font-black">知乎专栏</span>
              </div>
              <p className="text-slate-300 text-[11px] truncate">《星瑞豪华大空间与速腾在人机交互代差悬殊》</p>
              <p className="text-[10px] text-slate-500">累计强引用：142 次 | 爬虫采信率 96%</p>
            </div>

            {/* Rank 2: 提升最大平台 */}
            <div className="p-2.5 bg-slate-950/30 border border-white/5 rounded-xl text-xs space-y-1 hover:bg-[#151D2F] transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold">2. 提升效果最大 AI 平台</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded font-black">Kimi & 豆包</span>
              </div>
              <p className="text-slate-300 text-[11px]">Kimi 净增长值：+15.2 分 | 豆包：+12.5 分</p>
              <p className="text-[10px] text-slate-500">核心卖点召回饱和，极低流失率</p>
            </div>

            {/* Rank 3: 改善最多问题 */}
            <div className="p-2.5 bg-slate-950/30 border border-white/5 rounded-xl text-xs space-y-1 hover:bg-[#151D2F] transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 font-bold">3. 改善最为明显提问类别</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 rounded font-black">认知纠偏与辟谣</span>
              </div>
              <p className="text-slate-300 text-[11px]">历史谣言提及率下降：95% | 错误清除率 92%</p>
              <p className="text-[10px] text-slate-500">市区顿挫、车机卡顿负面彻底出池</p>
            </div>

            {/* Rank 4: 竞品被超过数 */}
            <div className="p-2.5 bg-slate-950/30 border border-white/5 rounded-xl text-xs space-y-1 hover:bg-[#151D2F] transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">4. 推荐位被压制/越级超过竞对</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 rounded font-black">3个主力竞对</span>
              </div>
              <p className="text-slate-300 text-[11px]">成功在Top 1推荐位超越速腾、深蓝SL03、星途</p>
              <p className="text-[10px] text-slate-500">对比购买检索被截流率从 25% 缩减至 8%</p>
            </div>
          </div>

          <div className="text-[10.5px] text-slate-500 leading-normal font-sans text-center">
            💡 帮助品牌和市场团队一眼看清：钱花在哪里最产生真实成效。
          </div>
        </div>

        {/* Right: AI专家诊断与解读 */}
        <div className={`lg:col-span-3 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
                 AI 专家诊断与解读
              </h3>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              SYSTEM EXPERT DIAGNOSIS
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/35 border border-white/5 my-4 space-y-3 font-sans leading-relaxed text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <p>
                <b>核心心智被高密采纳：</b> 品牌在主流大模型(Kimi、豆包、通义千问)中的『2.0T CMA动力架构』和『2800mm中级车轴距』等核心卖点提及率首次突破 <b>90%</b>。
              </p>
            </div>
            
            <div className="flex items-start gap-2 text-slate-300">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <p>
                <b>事实纠偏表现杰出：</b> 百度知道及懂车帝的多组长效车主实测报告彻底对齐，模型不再编造“严重抖动顿挫”过时负面，GCI认知声誉分处于历史极高点。
              </p>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <p>
                <b>下一步主攻盲区：</b> 建议下阶段重点布局<b>极寒天气电控表现</b>及<b>高阶辅助驾驶</b>长尾检索干货，截击深蓝SL03等竞品在该智能化维度的领先声量。
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] text-center font-bold">
            🔥 GEO 防御壁垒：已构筑行业极优AI声誉护城河
          </div>
        </div>

      </div>

      {/* ==================== 4. 复盘时间线 / 趋势解读 (Row 2 Grid) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: 投放复盘时间线 */}
        <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
                🕒 投放复盘
              </h3>
            </div>
            <p className="text-[10px] text-slate-500">
            </p>
          </div>

          {/* Timeline Process */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 my-6 relative font-mono">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-950/20 border border-white/5 relative flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black">第1周 (W1)</span>
                <strong className="text-xs block text-slate-200 mt-1.5">1. 内容发布</strong>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                官网、自媒体、车友会同步下发 25 组精标参数白皮书，打透搜索长尾词。
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-950/20 border border-white/5 relative flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div>
                <span className="text-[9px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded font-black">第2周 (W2)</span>
                <strong className="text-xs block text-indigo-400 mt-1.5">2. 收录观察</strong>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                打通 Kimi, Bingbot, Baiduspider 白名单。爬网爬虫更新率飞升至 92%。
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-950/20 border border-white/5 relative flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div>
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-black">第3周 (W3)</span>
                <strong className="text-xs block text-emerald-400 mt-1.5">3. AI回答变化</strong>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                各大 LLM 召回词向量改变，星瑞 CMA 动力卖点采纳提及度上涨 35%。
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-950/20 border border-white/5 relative flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div>
                <span className="text-[9px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded font-black">第4周 (W4)</span>
                <strong className="text-xs block text-cyan-400 mt-1.5">4. 指标飙升</strong>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                Top 3 首推率攀升至 58%，整体 GESI 生态健康指数跃升突破安全基线。
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-slate-950/20 border border-white/5 relative flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div>
                <span className="text-[9px] bg-pink-500/15 text-pink-400 px-1.5 py-0.5 rounded font-black">第5周 (W5)</span>
                <strong className="text-xs block text-pink-400 mt-1.5">5. 风险防守</strong>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                负面谣言完全出池，防黑闭环通路牢固筑成。进入持续稳定的良性防守期。
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/25 text-[10.5px] text-slate-400 rounded-lg border border-white/5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>让企业决策层一清二楚：<b>“花出去的每一笔内容投放钱，是如何演变为 AI 模型里的品牌资产并促成指数飙升的。”</b></span>
          </div>
        </div>

        {/* Right: 趋势变化与波动解读 */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
                📊 趋势变化与波动解读
              </h3>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              TREND ANALYSIS & NOISE INTERPRETATION
            </p>
          </div>

          <div className="bg-slate-950/30 border border-white/5 p-4 rounded-xl space-y-3 text-xs leading-relaxed my-4 font-sans text-slate-300">
            <p>
              📈 <b>确定性趋势：</b> 在本周期的 W1-W5 走势中，GLI 提升得分和 GESI 大盘展现出了完美的<b>单调上升态势</b>。由于全网高质量结构化 RAG 语料的密集投放，底层大模型已被迫形成强制记忆。
            </p>
            <p>
              ⚠️ <b>正常统计噪音：</b> 大模型在高并发、高负载和临时的多智能体(Multi-Agent)并发对齐期，回答会有 ±1.5 分的随机扰动（如 DeepSeek 在深夜回答稳定性偶尔浮动）。这属于正常的大模型不确定性噪音，无需过度惊慌，长期趋势已被牢固占领。
            </p>
          </div>

          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] text-center font-bold">
            💡 诊断：本周期呈强向上爆发曲线，优化极具确定性。
          </div>
        </div>

      </div>

      {/* ==================== 5. 提升与下降归因分析 (正负因素双栏卡片) ==================== */}
      <div className={`p-5 rounded-2xl border ${theme.cardBg}`}>
        <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
              📊 提升与下降归因分析 
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">归纳本周期大模型相关评估特征的核心加分点与存在问题</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Positive Factors (加分正向因素) */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/10 pb-2">
              <ThumbsUp className="w-4 h-4" />
              <strong className="text-xs uppercase font-black tracking-wider">🟢 本期加分正向因素 (Positive Attribution)</strong>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2 bg-slate-950/25 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-400 font-black block">🟢 1. 新增权威引用覆盖 (+18% 增量)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  高密度铺设知乎、懂车帝车主真实用车长尾帖，被 Kimi、豆包等大模型在批注反链中高频强引用 35 次，建立强证据基础。
                </p>
              </div>

              <div className="p-2 bg-slate-950/25 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-400 font-black block">🟢 2. 核心推荐排名位次提升 (Top 3 突破)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  12万油车决策型购买推荐提问下，星瑞被 AI 主动列入 Top 1 或 Top 2 的概率由 35% 大幅增至 58%，首推顺位稳固。
                </p>
              </div>

              <div className="p-2 bg-slate-950/25 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-400 font-black block">🟢 3. 事实偏见错误减少 (顿挫谣言清除率 95%)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  CMA湿式双离合顿挫/抖动等过时且失实的网黑偏见表达，在大模型最新计算输出中被成功清除，实现声誉全纠偏。
                </p>
              </div>

              <div className="p-2 bg-slate-950/25 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-400 font-black block">🟢 4. 竞品截流率大幅下降 (-17% 流失缩减)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  在速腾、星瑞对比选车提问下，竞品在 AI 端由于“陈旧机械配置”被模型降权，我方截流防守壁垒牢固建立。
                </p>
              </div>
            </div>
          </div>

          {/* Negative Factors (扣分负向因素) */}
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-3.5">
            <div className="flex items-center gap-2 text-rose-400 border-b border-rose-500/10 pb-2">
              <ThumbsDown className="w-4 h-4" />
              <strong className="text-xs uppercase font-black tracking-wider">🔴 本期扣分负向因素 (Negative Attribution)</strong>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2 bg-slate-950/25 rounded-lg border border-rose-500/10 hover:border-rose-500/30 transition-colors">
                <span className="text-rose-400 font-black block">🔴 1. 某前沿思考模型排名下降 (DeepSeek 偶然抖动)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  由于 DeepSeek R1 深度思考决策链路较长，对纯燃油车在极端极客智能科技维度的评判标准偏高，偶尔会将首推位偏向混动竞品。
                </p>
              </div>

              <div className="p-2 bg-slate-950/25 rounded-lg border border-rose-500/10 hover:border-rose-500/30 transition-colors">
                <span className="text-rose-400 font-black block">🔴 2. 局部长尾极速场景未覆盖 (智能化极寒盲区)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  “智能化大屏在极寒极速状态下的表现”等细分新能源偏好长尾提问中，由于语料库缺乏精标准确资料，存在 AI 采纳死角。
                </p>
              </div>

              <div className="p-2 bg-slate-950/25 rounded-lg border border-rose-500/10 hover:border-rose-500/30 transition-colors">
                <span className="text-rose-400 font-black block">🔴 3. 新增长尾负面噪音表达 (车主个别油耗夸大)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  部分二级论坛出现夸大市区拥堵高油耗（13L+）的长尾贴未被覆盖拦截，偶尔被小语种小爬虫爬取，带来舆情噪音。
                </p>
              </div>

              <div className="p-2 bg-slate-950/25 rounded-lg border border-rose-500/10 hover:border-rose-500/30 transition-colors">
                <span className="text-rose-400 font-black block">🔴 4. 懂车帝个别匿名贴未成功引用 (爬网反爬)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  懂车帝平台部署的 2 个匿名精标车主帖由于格式异常被平台封锁，爬虫爬取受阻，未能实现强证据链引用。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 6 & 7. GEO 子指数微观诊断：侧边导航与详情切换 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
        
        {/* Left Sidebar: Vertical Navigation */}
        {!isSidebarCollapsed ? (
          <div className={`lg:col-span-3 p-5 rounded-2xl border flex flex-col gap-4 transition-all duration-300 transform translate-x-0 ${
            isLightMode ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0D121F] border-white/5 shadow-md'
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-black uppercase text-indigo-400 font-mono block">
                  MICROSCOPIC DIAGNOSIS
                </span>
                <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${theme.textPrimary}`}>
                  <Activity className="w-4 h-4 text-indigo-400" />
                  GEO 7维子指数对账诊断
                </h4>
              </div>
              
              <button
                onClick={() => {
                  setIsSidebarCollapsed(true);
                  triggerLocalToast('已收起侧边导航栏');
                }}
                className={`p-1.5 rounded-lg border cursor-pointer hover:bg-indigo-500/10 transition-colors ${
                  isLightMode ? 'border-slate-200 text-slate-500 hover:text-slate-800' : 'border-white/5 text-slate-400 hover:text-white'
                }`}
                title="收起导航栏"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 font-sans -mt-2 text-left">
              点击下方列表，可对齐切换子指数详情内容。
            </p>

            {/* Vertical Navigation Tabs */}
            <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
              {tabList.map((subTab) => {
                const isActive = gliTab === subTab.key;
                const Icon = subTab.icon;
                const beforeVal = baselineSubScores[subTab.key];
                const afterVal = currentSubScores[subTab.key];
                const diff = afterVal - beforeVal;
                const isPositive = diff >= 0;

                return (
                  <button
                    key={subTab.key}
                    id={`tab-gli-${subTab.key}`}
                    onClick={() => {
                      setGliTab(subTab.key);
                      triggerLocalToast(`已切换至子指数详情页面：${subTab.label}`);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                      isActive
                        ? isLightMode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                          : 'bg-[#6366f1]/15 text-[#818cf8] border-[#6366f1]/40 shadow-md font-bold'
                        : isLightMode
                        ? 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100/85'
                        : 'bg-slate-950/20 hover:bg-slate-900/60 text-slate-400 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? (isLightMode ? 'bg-white/20' : 'bg-indigo-500/20') : 'bg-slate-900/40 border border-white/5'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? (isLightMode ? 'text-white' : 'text-[#818cf8]') : 'text-slate-400'}`} />
                      </div>
                      <div className="text-left min-w-0">
                        <span className={`text-[11.5px] font-bold block truncate leading-tight ${isActive ? 'text-white' : (isLightMode ? 'text-slate-800' : 'text-slate-200')}`}>
                          {subTab.label}
                        </span>
                        <span className={`text-[9px] block leading-none mt-0.5 truncate ${isActive ? (isLightMode ? 'text-indigo-100' : 'text-indigo-300/80') : 'text-slate-500'}`}>
                          {subTab.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 font-mono text-[10px] pl-1">
                      <div className="flex items-center gap-1 leading-none">
                        <span className={isActive ? 'text-white' : 'text-slate-500'}>{beforeVal}</span>
                        <span className="text-[8px] text-slate-500">➡️</span>
                        <span className={`font-black ${isActive ? 'text-white' : isPositive ? 'text-[#10b981]' : 'text-rose-450 text-rose-400'}`}>{afterVal}</span>
                      </div>
                      <span className={`text-[8.5px] font-black mt-1 inline-block px-1 rounded leading-normal ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : isPositive 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isPositive ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mini Collapsed Sidebar */
          <div className={`lg:col-span-1 p-3 rounded-2xl border flex flex-col items-center gap-4 transition-all duration-300 animate-in fade-in slide-in-from-left-4 ${
            isLightMode ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0D121F] border-white/5 shadow-md'
          }`}>
            <button
              onClick={() => {
                setIsSidebarCollapsed(false);
                triggerLocalToast('已展开侧边导航栏');
              }}
              className={`p-1.5 rounded-lg border cursor-pointer hover:bg-indigo-500/10 transition-colors ${
                isLightMode ? 'border-slate-200 text-indigo-600' : 'border-white/5 text-indigo-400'
              }`}
              title="展开导航栏"
            >
              <ChevronRight className="w-4 h-4 animate-pulse" />
            </button>
            
            <div className="w-full border-t border-slate-700/20 my-1" />

            <div className="flex flex-col gap-3">
              {tabList.map((subTab) => {
                const isActive = gliTab === subTab.key;
                const Icon = subTab.icon;
                const afterVal = currentSubScores[subTab.key];

                return (
                  <button
                    key={subTab.key}
                    onClick={() => {
                      setGliTab(subTab.key);
                      triggerLocalToast(`已切换至：${subTab.label}`);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                      isActive
                        ? isLightMode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-[#6366f1]/25 text-[#818cf8] border-[#6366f1]/50 shadow-md'
                        : isLightMode
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200/60'
                        : 'bg-slate-950/20 hover:bg-slate-900/60 text-slate-400 border-white/5'
                    }`}
                    title={subTab.label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[8px] font-mono font-bold mt-1 block">
                      {afterVal}
                    </span>
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-950 text-white text-[10px] font-bold whitespace-nowrap hidden group-hover:block z-30 shadow-lg border border-white/10">
                      {subTab.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Content Panel: Selected Sub-Index Details */}
        <div className={isSidebarCollapsed ? "lg:col-span-11 flex flex-col justify-start" : "lg:col-span-9 flex flex-col justify-start"}>
          {/* Click to Drilldown Banner */}
          <div 
            onClick={() => setActiveHubMetric(gliTab === 'dli' ? 'DLI' : gliTab.toUpperCase())}
            className="mb-4 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 p-3 rounded-xl flex items-center justify-between text-xs text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer shadow-sm group select-none"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold">【{gliTab === 'dli' ? 'DLI' : gliTab.toUpperCase()}】维度大模型原生客户端交互存证已就绪</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shrink-0">
              ⚡ 穿透底层推理证据与深度审计分析 (Drilldown) →
            </span>
          </div>

          <div className="transition-all duration-300 h-full">
            {gliTab === 'vli' && (
              <GliVliTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
            {gliTab === 'rli' && (
              <GliRliTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
            {gliTab === 'ili' && (
              <GliIliTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
            {gliTab === 'cli' && (
              <GliCliTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
            {gliTab === 'ali' && (
              <GliAliTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
            {gliTab === 'dli' && (
              <GliDliTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
            {gliTab === 'rci' && (
              <GliRciTab company={company} isLightMode={isLightMode} theme={theme} />
            )}
          </div>
        </div>
      {!isStatic && (
        <div className="mt-8 mb-4 lg:col-span-12 col-span-1">
          <EvidenceScreenshots company={company} isLightMode={isLightMode} />
        </div>
      )}
      </div>

      {/* Dynamic Hub Modal Injection */}
      {activeHubMetric && (
        <GaiInferenceHubModal 
          company={company}
          metricCode={activeHubMetric}
          onClose={() => setActiveHubMetric(null)}
          isLightMode={isLightMode}
        />
      )}

      {/* Auxiliary Global Defense Pipeline footer */}
      <div className={`p-4 rounded-xl border text-left space-y-2.5 ${theme.cardBg}`}>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5" style={{ color: isLightMode ? '#1e293b' : '#ffffff' }}>
          🔒 GE0 全生命周期链路
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] leading-relaxed font-mono">
          <div className="p-2.5 bg-slate-950/20 border border-white/5 rounded-lg">
            <strong className="text-indigo-400 block mb-0.5">1. RAG 知识元重组</strong>
            <p className="text-slate-500">将事实标准进行 Schema 化注入，确保机器人极速抓取。</p>
          </div>
          <div className="p-2.5 bg-slate-950/20 border border-white/5 rounded-lg">
            <strong className="text-indigo-400 block mb-0.5">2. 链路白名单保障</strong>
            <p className="text-slate-500">消除第三方CC拦截，保障主流爬虫极速更新收录。</p>
          </div>
          <div className="p-2.5 bg-slate-950/20 border border-white/5 rounded-lg">
            <strong className="text-indigo-400 block mb-0.5">3. 多模型召回对仗</strong>
            <p className="text-slate-500">Kimi, DeepSeek 等模型联网检索，采纳品牌优势。</p>
          </div>
          <div className="p-2.5 bg-slate-950/20 border border-white/5 rounded-lg">
            <strong className="text-indigo-400 block mb-0.5">4. 首推防守闭环</strong>
            <p className="text-slate-500">在决策对比问答中实现胜率上升，阻断长尾负面。</p>
          </div>
        </div>
      </div>

      {/* Dynamic Slide-up Toast */}
      {localToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0D121F] border border-blue-500/30 text-slate-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-slide-up max-w-sm">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex-1 leading-relaxed">{localToast}</div>
          <button 
            onClick={() => setLocalToast(null)} 
            className="text-slate-500 hover:text-white p-0.5 bg-slate-950 rounded border border-white/5 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
