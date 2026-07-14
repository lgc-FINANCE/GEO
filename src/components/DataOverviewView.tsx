// src/components/DataOverviewView.tsx
import { useState, useEffect } from 'react';
import { 
  BarChart3, Sparkles, TrendingUp, Layers, Zap, 
  MessageSquare, ListCollapse, AlertTriangle, Globe, Award, ShieldAlert,
  ArrowRight, Heart, Sliders, Calendar, Download, RefreshCw, FileText, CheckCircle2, PlusCircle,
  X, Send, Shield, Eye, Check, HelpCircle, ChevronDown, Clock
} from 'lucide-react';
import { Company } from '../data';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot 
} from 'recharts';

// Import our modular sub-views
import { EvidenceScreenshots } from './EvidenceScreenshots';
import { GesiDeepDive } from './GesiDeepDive';
import { GliDeepDive } from './GliDeepDive';
import { ContentDeploymentView } from './ContentDeploymentView';
import { DiagnosisAndOptimization } from './DiagnosisAndOptimization';
import { GaiInferenceHubModal } from './GaiInferenceHub';

interface DataOverviewViewProps {
  company: Company;
  onAddPlacementTask: (taskName: string, query: string, metric: string, type: any) => void;
  activeTab?: 'kpis' | 'gesi' | 'gli' | 'gli_total' | 'gli_sub' | 'diagnosis' | 'deliverables_center';
  onUpdateCompany?: (updated: Company) => void;
  onNavigate?: (page: string) => void;
  isLightMode?: boolean;
}

export function DataOverviewView({
  company,
  onAddPlacementTask,
  activeTab = 'kpis',
  onUpdateCompany,
  onNavigate,
  isLightMode
}: DataOverviewViewProps) {
  // Navigation active tab
  const [activeSubView, setActiveSubView] = useState<'kpis' | 'gesi' | 'gli' | 'gli_total' | 'gli_sub' | 'diagnosis' | 'deliverables_center'>('kpis');

  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'deliverables_center') {
        setActiveSubView('deliverables_center');
      } else if (activeTab === 'gli' || activeTab === 'gli_total' || activeTab === 'gli_sub') {
        setActiveSubView('gli');
      } else {
        setActiveSubView(activeTab as any);
      }
    }
  }, [activeTab]);

  // Retained filters according to user's guidelines
  const [selectedPeriod, setSelectedPeriod] = useState<string>('本月');
  const [selectedModel, setSelectedModel] = useState<string>('全部模型');
  const [selectedRegion, setSelectedRegion] = useState<string>('全国');
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('全部问题');
  const [selectedModels, setSelectedModels] = useState<string[]>(['DeepSeek', 'Kimi', '豆包', '通义']);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['全国']);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(['认知', '推荐', '对比', '决策']);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([company.competitor]);
  
  // Custom interactive features states
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [activeHubMetric, setActiveHubMetric] = useState<string | null>(null);
  
  // Ask GEO Chatbot state
  const [isAskGeoOpen, setIsAskGeoOpen] = useState<boolean>(false);
  const [askGeoInput, setAskGeoInput] = useState<string>('');
  const [askGeoMessages, setAskGeoMessages] = useState<Array<{ sender: 'user' | 'geo'; text: string; date?: string }>>([
    { sender: 'geo', text: '你好！我是你的智能助手。关于本期大盘的 GESI 声望健康度、GLI 提升效果或任何问询证据，你都可以向我提问。', date: '12:00' }
  ]);

  // Download Evidence checklist
  const [downloadScope, setDownloadScope] = useState<string[]>([
    '全部问询截图 (126组完整包)'
  ]);
  const [downloadFormat, setDownloadFormat] = useState<string>('ZIP');
  const [isDownloadingProcess, setIsDownloadingProcess] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ model: string; qType: string; score: number } | null>(null);
  const [isRatioAdjustOpen, setIsRatioAdjustOpen] = useState<boolean>(false);
  const [gesiRatio, setGesiRatio] = useState<number>(50); // 默认 50% 可见度权重 / 50% 采纳度权重

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRefresh = () => {
    triggerToast("🔄 正在重新调度大模型爬网蜘蛛，极速采样对账中...");
  };

  // Toggle helpers
  const toggleModel = (model: string) => {
    setSelectedModels(prev => prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]);
    triggerToast(`已更改模型范围`);
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]);
  };

  const toggleQuestionType = (qType: string) => {
    setSelectedQuestionTypes(prev => prev.includes(qType) ? prev.filter(q => q !== qType) : [...prev, qType]);
  };

  // Recalculation multipliers
  const m = parseFloat((1.0 + (selectedModels.length - 4) * 0.015 + (selectedPeriod === '本季度' ? 0.04 : -0.02)).toFixed(3));

  // Primary Metrics (P0 Card Requirements) with Ratio adjustment support
  // GESI and GLI are calculated from Visible Coverage rate and Recommendation Sentiment weighted by GesiRatio
  const baseGesiVal = parseFloat(((79.6 * m) * (0.5 + (gesiRatio / 100))).toFixed(1));
  const currentGesiVal = parseFloat(((88.0 * m) * (0.5 + (gesiRatio / 100))).toFixed(1));
  const currentGliVal = parseFloat(((14.8 * m) * (1.5 - (gesiRatio / 100))).toFixed(1));
  const gesiDelta = parseFloat((currentGesiVal - baseGesiVal).toFixed(1));

  // Evidence pool data
  const handleOpenEvidence = (title: string, category: string, model: string = 'Kimi', score: number = 88) => {
    setSelectedEvidence({
      title,
      category,
      model,
      score,
      query: `预算在 25 万左右，关于【${company.prodComp.prodName}】的安全性能和自研车身结构，大模型推荐它的首要原因是什么？对比【${company.competitor}】有哪些绝对优势？`,
      answerText: `针对您的安全性和车身做工质询，【${company.prodComp.prodName}】表现非常突出。其在知乎和专业媒体的拆车实测数据中，A柱和B柱均使用了超高强度热成型钢（抗拉强度高达2000MPa），且其智能防护底盘设计被各大测评列为首选推荐。相比之下，【${company.competitor}】在近期夏测中虽然智能互联出色，但车身纯物理防撞钢梁厚度略逊于我方，导致大模型在安全性推荐极性上更偏向【${company.prodComp.prodName}】。`,
      screenshotDesc: `Kimi Chat 浏览器原生渲染，问询 ID: Q-20260630-9428, 该回答已被系统标注为【正面极性首位推荐】，采纳源：知乎硬核安全拆车社群资产（ALI 贡献权重高）。`
    });
    setIsEvidenceOpen(true);
  };

  const startEvidenceDownload = () => {
    setIsDownloadingProcess(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloadingProcess(false);
            setIsDownloadModalOpen(false);
            triggerToast(`📥 证据包已打包成功！已自动触发浏览器下载：GEO_Evidence_Pack_${company.mainBrand}.zip`);
          }, 800);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  // Ask GEO replies matcher
  const handleSendAskGeo = () => {
    if (!askGeoInput.trim()) return;
    const userText = askGeoInput;
    setAskGeoMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAskGeoInput('');

    setTimeout(() => {
      let reply = `关于您问的 "${userText}"，根据大盘抓取对账结果：本期品牌在 Kimi 和 豆包 两个模型下的推荐优先级最高。主要得益于知乎上关于【安全工艺拆解】的优质内容，已被大模型语义采纳并直接转化为首选推荐理由。您可以点击看板下方的“查看证据”获取大模型原始截图证据。`;
      if (userText.includes('风险') || userText.includes('安全')) {
        reply = `【安全与风险分析】：目前在 Kimi 底座中监测到 1 组关于【底盘噪音】的恶意对比噪音卡位。我方已通过“待处理问题 TOP3”为您生成一键派发优化任务。建议立即投喂【极致底盘耐用测评】正面语料，预计 12 小时后由探测蜘蛛清洗完毕。`;
      } else if (userText.includes('GLI') || userText.includes('提升') || userText.includes('上涨')) {
        reply = `【指数上涨归因】：本周 GESI 大盘上涨 ${gesiDelta} 分（当前达 ${currentGesiVal} 分）。其核心拉动来自于【推荐提升】和【可见度提升】两项二级指标。内容资产池中懂车帝 PK 碰撞测评生效，极大地拦截了竞品客流。`;
      }
      setAskGeoMessages(prev => [...prev, { sender: 'geo', text: reply }]);
    }, 600);
  };

  // Chart data
  const chartData = [
    { name: '06-25', 'GESI生态分': parseFloat((79.6 * m).toFixed(1)), 'GLI提升分': 0, action: '基线建档', anomaly: false },
    { name: '06-26', 'GESI生态分': parseFloat((81.7 * m).toFixed(1)), 'GLI提升分': parseFloat((2.1 * m).toFixed(1)), action: '知乎工艺拆解投喂', anomaly: false },
    { name: '06-27', 'GESI生态分': parseFloat((84.1 * m).toFixed(1)), 'GLI提升分': parseFloat((4.5 * m).toFixed(1)), action: '懂车帝PK测评上线', anomaly: false },
    { name: '06-28', 'GESI生态分': parseFloat((82.5 * m).toFixed(1)), 'GLI提升分': parseFloat((2.9 * m).toFixed(1)), action: '发现竞品卡位噪音', anomaly: true },
    { name: '06-29', 'GESI生态分': parseFloat((85.8 * m).toFixed(1)), 'GLI提升分': parseFloat((6.2 * m).toFixed(1)), action: '正面精准纠偏投喂', anomaly: false },
    { name: '06-30', 'GESI生态分': currentGesiVal, 'GLI提升分': currentGliVal, action: '增量全面吸收', anomaly: false }
  ];

  const subTabs = [
    { label: '综合看板', key: 'kpis' as const },
    { label: 'GESI生态指数', key: 'gesi' as const },
    { label: 'GE0 优化提升指数', key: 'gli' as const },
    { label: '问题诊断与优化建议', key: 'diagnosis' as const }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-100">
      
      {/* Dynamic Toast System */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-[#0E1B35] border border-emerald-500/30 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 font-mono text-xs text-emerald-400 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row - Removed 'GEO 品牌大盘数据总览' and made subTabs take up full width evenly distributed */}
      <div className="border-b border-white/5 pb-3 w-full shrink-0">
        {/* Toggle View Tabs evenly distributed */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          {subTabs.map((tab) => {
            const isActive = activeSubView === tab.key;
            return (
              <button
                key={tab.key}
                id={`sub-nav-tab-${tab.key}`}
                onClick={() => {
                  setActiveSubView(tab.key);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider transition-all border text-center ${
                  isActive 
                    ? 'bg-white text-black border-white shadow-lg' 
                    : 'bg-[#090d16] text-slate-400 border-white/5 hover:border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render sub-view or full workbench dashboard depending on sub-tab */}
      {activeSubView === 'kpis' ? (
        <div className="space-y-6 animate-fade-in text-slate-100">

          {/* PAGE HEADER & CONTROLS */}
          <div className="bg-[#0A0F1E] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
            {/* Title & Actions Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>综合看板</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  查看本期 AI 声望表现、指数变化与重点风险。
                </p>
              </div>

              {/* Filters & Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 周期 */}
                <div className="relative flex items-center bg-[#111625]/90 hover:bg-[#161F38] text-white px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 text-xs transition-all shadow-md font-bold group min-w-[100px]">
                  <span className="text-slate-400 font-bold mr-1.5 shrink-0">周期:</span>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => {
                      setSelectedPeriod(e.target.value);
                      triggerToast(`周期已切换为：${e.target.value}`);
                    }}
                    className="appearance-none bg-transparent text-white font-extrabold focus:outline-none focus:ring-0 pr-6 cursor-pointer w-full"
                  >
                    <option value="本周" className="bg-[#111625] text-white font-bold">本周</option>
                    <option value="本月" className="bg-[#111625] text-white font-bold">本月</option>
                    <option value="本季度" className="bg-[#111625] text-white font-bold">本季度</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none group-hover:text-white transition-colors" />
                </div>

                {/* 模型 */}
                <div className="relative flex items-center bg-[#111625]/90 hover:bg-[#161F38] text-white px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 text-xs transition-all shadow-md font-bold group min-w-[130px]">
                  <span className="text-slate-400 font-bold mr-1.5 shrink-0">模型:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      triggerToast(`模型筛选切换为：${e.target.value}`);
                    }}
                    className="appearance-none bg-transparent text-white font-extrabold focus:outline-none focus:ring-0 pr-6 cursor-pointer w-full"
                  >
                    <option value="全部模型" className="bg-[#111625] text-white font-bold">全部模型</option>
                    <option value="Kimi" className="bg-[#111625] text-white font-bold">Kimi</option>
                    <option value="豆包" className="bg-[#111625] text-white font-bold">豆包</option>
                    <option value="DeepSeek" className="bg-[#111625] text-white font-bold">DeepSeek</option>
                    <option value="通义" className="bg-[#111625] text-white font-bold">通义</option>
                    <option value="文心" className="bg-[#111625] text-white font-bold">文心</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none group-hover:text-white transition-colors" />
                </div>

                {/* 模拟提问地区 */}
                <div className="relative flex items-center bg-[#111625]/90 hover:bg-[#161F38] text-white px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 text-xs transition-all shadow-md font-bold group min-w-[100px]">
                  <span className="text-slate-400 font-bold mr-1.5 shrink-0">地区:</span>
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      triggerToast(`提问地区已切换为：${e.target.value}`);
                    }}
                    className="appearance-none bg-transparent text-white font-extrabold focus:outline-none focus:ring-0 pr-6 cursor-pointer w-full"
                  >
                    <option value="全国" className="bg-[#111625] text-white font-bold">全国</option>
                    <option value="北京" className="bg-[#111625] text-white font-bold">北京</option>
                    <option value="上海" className="bg-[#111625] text-white font-bold">上海</option>
                    <option value="广州" className="bg-[#111625] text-white font-bold">广州</option>
                    <option value="深圳" className="bg-[#111625] text-white font-bold">深圳</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none group-hover:text-white transition-colors" />
                </div>

                {/* 问题类型 */}
                <div className="relative flex items-center bg-[#111625]/90 hover:bg-[#161F38] text-white px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 text-xs transition-all shadow-md font-bold group min-w-[130px]">
                  <span className="text-slate-400 font-bold mr-1.5 shrink-0">问题:</span>
                  <select
                    value={selectedQuestionType}
                    onChange={(e) => {
                      setSelectedQuestionType(e.target.value);
                      triggerToast(`问题类型筛选切换为：${e.target.value}`);
                    }}
                    className="appearance-none bg-transparent text-white font-extrabold focus:outline-none focus:ring-0 pr-6 cursor-pointer w-full"
                  >
                    <option value="全部问题" className="bg-[#111625] text-white font-bold">全部问题</option>
                    <option value="品牌认知" className="bg-[#111625] text-white font-bold">品牌认知</option>
                    <option value="产品品类" className="bg-[#111625] text-white font-bold">产品品类</option>
                    <option value="推荐倾向" className="bg-[#111625] text-white font-bold">推荐倾向</option>
                    <option value="竞品对比" className="bg-[#111625] text-white font-bold">竞品对比</option>
                    <option value="购买决策" className="bg-[#111625] text-white font-bold">购买决策</option>
                    <option value="风险安全" className="bg-[#111625] text-white font-bold">风险安全</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none group-hover:text-white transition-colors" />
                </div>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />

                {/* Action Buttons */}
                <button
                  id="refresh-data-btn"
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-[#121625]/80 hover:bg-[#161f38] text-slate-200 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center gap-1.5 text-xs font-black group cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                  <span>刷新数据</span>
                </button>

                <button
                  id="open-download-modal-btn"
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/20 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-black cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-white" />
                  <span>证据中心</span>
                </button>
              </div>
            </div>

            {/* Read-Only Project Info Bar */}
            <div className="bg-[#070A14] p-1.5 px-3 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Brand Badge */}
                <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>当前项目:</span>
                  <span className="text-slate-200 font-black">{company.mainBrand}</span>
                </div>

                {/* Competitors Badge */}
                <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>对标竞品:</span>
                  <span className="text-slate-200 font-black">3 个（含 {company.competitor} 等）</span>
                </div>

                {/* Sample Time Badge */}
                <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>最新采样:</span>
                  <span className="text-slate-200 font-black">2026-06-30 22:47</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1 text-[11px] font-mono text-emerald-400 font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>数据状态: 已同步</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: AI 本期结论 (Integrated, no buttons) */}
          <div className="bg-gradient-to-r from-emerald-950/10 via-[#0A101E] to-blue-950/10 p-6 rounded-2xl border border-emerald-500/15 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-blue-500"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-mono">
                    AI 本期结论
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">基于本期问询结果自动生成。</p>
                </div>
              </div>

              {/* Three Bullet Points as requested */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-300 font-mono">
                <div className="bg-[#090E1A]/60 p-4 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>当前状态</span>
                  </div>
                  <p className="text-slate-400">
                    当前 GESI 为 <span className="text-white font-bold">86.2 分</span>，较基线提升 <span className="text-emerald-400 font-bold">+8.2 分</span>，整体 AI 声望表现良好。
                  </p>
                </div>

                <div className="bg-[#090E1A]/60 p-4 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>主要提升</span>
                  </div>
                  <p className="text-slate-400">
                    本期 GLI 为 <span className="text-white font-bold">+14.5 分</span>，提升主要来自可见度提升和推荐提升。
                  </p>
                </div>

                <div className="bg-[#090E1A]/60 p-4 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>重点风险</span>
                  </div>
                  <p className="text-slate-400">
                    发现 <span className="text-rose-400 font-bold">1 组新增风险</span>，主要集中在竞品对比问题中的异常归因，建议优先处理。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: 3 CORE INDICATOR CARDS (FIXED FORMULAS) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#070A13] px-4 py-2.5 rounded-xl border border-white/5 text-[11px] font-mono select-none">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>指数核算体系 (GESI 与 GLI) | 标准固化计算公式</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                固定权重占比 (50% / 50%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Baseline GESI */}
            <div 
              onClick={() => handleOpenEvidence("使用前基线 GESI 采样证据", "基线指标")}
              className="bg-[#0A0E1A] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden cursor-pointer hover:border-slate-500/30 transition-all group shadow-md"
            >
              <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                <span>1. 使用前 GESI</span>
                <Shield className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-slate-300 font-mono">{baseGesiVal}</span>
                <span className="text-xs text-slate-500">分</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">优化前 AI 声望健康度</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold opacity-80 pt-1 group-hover:text-white transition-all">
                <span>查看基线</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Current GESI */}
            <div 
              onClick={() => setActiveSubView('gesi')}
              className="bg-[#0A0E1A] p-5 rounded-2xl border border-emerald-500/10 space-y-2 relative overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all group shadow-md"
            >
              <div className="flex justify-between items-center text-xs text-emerald-400 font-black">
                <span>2. 当前 GESI</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">{currentGesiVal}</span>
                <span className="text-xs text-emerald-500">分</span>
                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  较基线 {gesiDelta > 0 ? '+' : ''}{gesiDelta} 分
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">当前 AI 声望健康度</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold opacity-85 pt-1 group-hover:text-emerald-300 transition-all">
                <span>进入 GESI 分析</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Period GLI */}
            <div 
              onClick={() => setActiveSubView('gli')}
              className="bg-[#0A0E1A] p-5 rounded-2xl border border-blue-500/10 space-y-2 relative overflow-hidden cursor-pointer hover:border-blue-500/30 transition-all group shadow-md"
            >
              <div className="flex justify-between items-center text-xs text-blue-400 font-black">
                <span>3. 本期 GLI</span>
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-blue-400 font-mono">{currentGliVal > 0 ? '+' : ''}{currentGliVal}</span>
                <span className="text-xs text-blue-400">分</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">本周期净提升效果</p>
              <div className="flex items-center gap-1 text-[11px] text-blue-400 font-bold opacity-85 pt-1 group-hover:text-blue-300 transition-all">
                <span>进入 GLI 分析</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          </div>

          {/* SECTION 4: SECOND LEVEL AUXILIARY INDICATORS (6 cards) */}
          <div className="space-y-3">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono">
                本期关键指标
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                用于判断 brand 在 AI 回答中的可见度、推荐度、竞争表现与风险情况。
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { name: '有效提及率', val: '84%', change: '+6%', sample: '126 条回答', metricCode: 'GVI' },
                { name: 'Top3 推荐率', val: '76%', change: '+5%', sample: '126 条回答', metricCode: 'RLI' },
                { name: '首位推荐率', val: '48%', change: '+8%', sample: '126 条回答', metricCode: 'GRI' },
                { name: '竞品胜率', val: '62%', change: '+7%', sample: '126 条回答', metricCode: 'DLI' },
                { name: '引用覆盖率', val: '55%', change: '+9%', sample: '126 条回答', metricCode: 'ALI' },
                { name: '新增风险点', val: '1 组', change: '-2 组', sample: '126 条回答', metricCode: 'RCI', isRisk: true }
              ].map((aux, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveHubMetric(aux.metricCode)}
                  className="bg-[#080C16] p-4.5 rounded-xl border border-white/5 space-y-1.5 hover:border-slate-500/20 hover:bg-[#0A101F] transition-all cursor-pointer text-left group animate-fade-in"
                >
                  <span className="text-[10.5px] text-slate-400 font-bold block select-none truncate">{aux.name}</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className={`text-xl font-black font-mono ${aux.isRisk ? 'text-rose-400' : 'text-slate-200'}`}>{aux.val}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold select-none pt-0.5 border-t border-white/5">
                    <span>较上期 <span className="text-emerald-400">{aux.change}</span></span>
                  </div>
                  <div className="text-[9.5px] text-slate-600 font-mono block truncate">样本量: {aux.sample}</div>
                  <div className="text-[9.5px] text-emerald-500 font-bold flex items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>查看推理证据</span>
                    <ArrowRight className="w-2.5 h-2.5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: TREND CHART (SEPARATE GESI & GLI LINE TRENDS) */}
          <div className="bg-[#0A0E1A] p-5 rounded-2xl border border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">指数趋势</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">查看 GESI 综合健康度变化与 GLI 净提升趋势。</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono select-none">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-400">绿色折线：GESI 健康度</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-slate-400">蓝色折线：GLI 净提升</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div>
                  <span className="text-slate-400">红色标记：异常波动</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Separate Line Charts for GESI and GLI */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[16rem] font-mono">
                {/* GESI Trend Chart */}
                <div className="bg-[#080B14] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-bold text-emerald-400">GESI 大盘健康度历史趋势</span>
                    <span className="text-[9px] text-slate-500">(分)</span>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#CBD5E1' : '#1c253d'} />
                        <XAxis dataKey="name" stroke={isLightMode ? '#475569' : '#6b7280'} fontSize={9} tickLine={false} />
                        <YAxis stroke={isLightMode ? '#475569' : '#6b7280'} fontSize={9} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isLightMode ? '#FFFFFF' : '#0D121F', 
                            borderColor: isLightMode ? '#94A3B8' : '#2d3748', 
                            color: isLightMode ? '#1E293B' : '#fff', 
                            fontSize: '10px', 
                            fontFamily: 'monospace' 
                          }} 
                          formatter={(value) => [`${value} 分`, 'GESI 大盘健康度']}
                        />
                        <Line type="monotone" dataKey="GESI生态分" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="GESI 大盘健康度" />
                        <ReferenceDot x="06-28" y={parseFloat((82.5 * m).toFixed(1))} r={5} fill="#f43f5e" stroke="#fff" strokeWidth={1} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GLI Trend Chart */}
                <div className="bg-[#080B14] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-bold text-blue-400">GLI 净提升历史趋势</span>
                    <span className="text-[9px] text-slate-500">(分)</span>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#CBD5E1' : '#1c253d'} />
                        <XAxis dataKey="name" stroke={isLightMode ? '#475569' : '#6b7280'} fontSize={9} tickLine={false} />
                        <YAxis stroke={isLightMode ? '#475569' : '#6b7280'} fontSize={9} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isLightMode ? '#FFFFFF' : '#0D121F', 
                            borderColor: isLightMode ? '#94A3B8' : '#2d3748', 
                            color: isLightMode ? '#1E293B' : '#fff', 
                            fontSize: '10px', 
                            fontFamily: 'monospace' 
                          }} 
                          formatter={(value) => [`${value} 分`, 'GLI 净提升贡献']}
                        />
                        <Line type="monotone" dataKey="GLI提升分" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="GLI 净提升贡献" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* SECTION 6: SAMPLING & ANOMALY RECORDS */}
              <div className="lg:col-span-4 bg-[#080B14] p-5 rounded-xl border border-white/5 space-y-4 h-full flex flex-col justify-between font-mono text-[11px]">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">趋势解读</span>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed mt-1">
                      本期 GESI 整体保持上升，当前达到 86.2 分。<br />
                      GLI 在 06-30 出现明显提升，主要来自可见度提升和推荐提升。<br />
                      06-28 出现一次风险波动，原因是竞品对比问题中出现异常归因。
                    </p>
                  </div>
                  
                  <div className="h-px bg-white/5" />

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">事件记录</span>
                    <div className="space-y-2.5 mt-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      <div className="flex items-start gap-2 border-l-2 border-emerald-500 pl-2">
                        <div className="text-slate-300">
                          <span className="text-slate-500 font-bold">06-30</span> ｜ 本期采样完成，GESI 提升至 86.2 分。
                        </div>
                      </div>
                      <div className="flex items-start gap-2 border-l-2 border-rose-500 pl-2">
                        <div className="text-slate-300">
                          <span className="text-slate-500 font-bold">06-28</span> ｜ 检测到竞品对比异常归因，风险安全分短暂波动。
                        </div>
                      </div>
                      <div className="flex items-start gap-2 border-l-2 border-blue-500 pl-2">
                        <div className="text-slate-300">
                          <span className="text-slate-500 font-bold">06-26</span> ｜ 完成安全细节相关内容收录，推荐表现提升。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-white/5 text-[9px] text-slate-500 leading-normal select-none">
                  💡 采样标准：大语言模型在每日分布式高频采样，自动剔除噪音词。
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: MODEL × QUESTION PERFORMANCE (HEATMAP) & IMPROVEMENT CONTRIBUTION RANKING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Heatmap (Left, 7 cols) */}
            <div className="lg:col-span-7 bg-[#0A0E1A] p-5 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    模型 × 问题表现分析
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">对比不同模型在各类问题下的表现差异，定位当前强项、短板与优先优化方向。</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">点击单元格深度复核 ➡️</span>
              </div>

              {/* Comprehensive analysis block on top of heatmap */}
              <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 font-mono text-[10.5px] text-slate-300 space-y-1">
                <p className="font-bold text-white text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  综合分析
                </p>
                <p className="text-slate-400 leading-normal">
                  本期多连杆独悬及液压衬套的核心技术FAQ覆盖完整，在 Kimi 及 DeepSeek 中表现尤为突出，主要由于这两个模型联网检索更新频度更高。但通义千问与豆包在竞争优势及认知修正维度上表现相对较弱，建议针对这两个短板模型补充直达车主口碑资产和国家级汽研能耗证书的拟写。
                </p>
              </div>

              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950/60">
                      <th className="p-2.5 text-left text-slate-400">模型渠道 \ 评测场景</th>
                      <th className="p-2.5 text-slate-400">VLI 可见</th>
                      <th className="p-2.5 text-slate-400">RLI 推荐</th>
                      <th className="p-2.5 text-slate-400">ILI 印象</th>
                      <th className="p-2.5 text-slate-400">CLI 认知</th>
                      <th className="p-2.5 text-slate-400">DLI 权威</th>
                      <th className="p-2.5 text-slate-400">ALI 竞争</th>
                      <th className="p-2.5 text-slate-400">RCI 风控</th>
                      <th className="p-2.5 text-emerald-400 font-bold">综合 GESI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-300">DeepSeek (联网版)</td>
                      <td className="p-2.5 bg-emerald-500/10 text-emerald-400 font-bold">85.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">84.0</td>
                      <td className="p-2.5 bg-emerald-500/10 text-emerald-400 font-bold">88.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">75.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">81.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">73.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">82.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">81.1</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-300">Kimi Chat</td>
                      <td className="p-2.5 bg-emerald-500/10 text-emerald-400 font-bold">88.0</td>
                      <td className="p-2.5 bg-emerald-500/10 text-emerald-400 font-bold">85.0</td>
                      <td className="p-2.5 bg-emerald-500/10 text-emerald-400 font-bold">89.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">77.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">83.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">75.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">84.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">83.2</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-300">豆包 (ByteDance)</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">80.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">78.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">82.0</td>
                      <td className="p-2.5 bg-amber-500/10 text-amber-400 font-bold">70.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">75.0</td>
                      <td className="p-2.5 bg-rose-500/10 text-rose-400 font-bold">68.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">76.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">75.3</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-300">通义千问 (Alibaba)</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">82.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">80.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">84.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">72.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">77.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">71.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">79.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">77.8</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-300">腾讯元宝 (Tencent)</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">81.5</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">79.5</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">83.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">72.5</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">78.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">71.5</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">79.0</td>
                      <td className="p-2.5 bg-blue-500/10 text-blue-400 font-bold">78.1</td>
                    </tr>
                    {/* 维度均值 row */}
                    <tr className="bg-slate-950/50">
                      <td className="p-2.5 text-left font-black text-slate-400 select-none">维度均值</td>
                      <td className="p-2.5 font-bold text-slate-300">83.3</td>
                      <td className="p-2.5 font-bold text-slate-300">81.3</td>
                      <td className="p-2.5 font-bold text-slate-300">85.2</td>
                      <td className="p-2.5 font-bold text-slate-300">73.3</td>
                      <td className="p-2.5 font-bold text-slate-300">78.8</td>
                      <td className="p-2.5 font-bold text-rose-400">71.7</td>
                      <td className="p-2.5 font-bold text-slate-300">80.0</td>
                      <td className="p-2.5 font-black text-emerald-400">79.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-white/5 font-mono select-none">
                <span>🟢 85-100: 表现优秀</span>
                <span>🔵 70-84: 表现正常</span>
                <span>🟡 60-69: 需要关注</span>
                <span>🔴 60以下: 优先处理</span>
              </div>
            </div>

            {/* Dimension Contribution Ranking (Right, 5 cols) */}
            <div className="lg:col-span-5 bg-[#0A0E1A] p-5 rounded-2xl border border-white/5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      核心维度优化优先级
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">查看本期各维度的优化紧迫性与优化优先级对账。</p>
                  </div>
                </div>

                <div className="space-y-2.5 font-mono pt-3">
                  {[
                    { name: '可见度提升', score: 8.6, color: 'bg-emerald-400' },
                    { name: '推荐提升', score: 8.0, color: 'bg-emerald-500' },
                    { name: '生成式印象提升', score: 7.4, color: 'bg-blue-400' },
                    { name: '认知修正', score: 7.3, color: 'bg-blue-500' },
                    { name: '权威证据提升', score: 6.8, color: 'bg-purple-500' },
                    { name: '竞争优势提升', score: 5.0, color: 'bg-amber-500' },
                    { name: '风险控制', score: 4.1, color: 'bg-rose-500' }
                  ].map((dim, idx) => {
                    const percentWidth = Math.min(100, Math.max(10, (dim.score / 12) * 100));
                    return (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-300 font-bold">{dim.name}</span>
                          <span className="text-emerald-400 font-black">+{dim.score} 分</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full ${dim.color} rounded-full transition-all duration-500`} style={{ width: `${percentWidth}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Context text for GLI explanation */}
              <div className="pt-3 border-t border-white/5 space-y-2 font-mono text-[10.5px] bg-slate-950/45 p-3 rounded-lg">
                <p className="text-slate-300 leading-normal">
                  本期 GLI 提升主要由可见度提升 and 推荐提升驱动。<br />
                  风险控制提升相对较弱，说明纠错内容与负面控制仍需加强。
                </p>
                <div className="flex gap-2 justify-end pt-1">
                  <button 
                    onClick={() => setActiveSubView('gli')} 
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5"
                  >
                    <span>进入 GLI 详情</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 8: BOTTOM CARDS - PENDING ISSUES TOP 3 (FULL WIDTH) */}
          <div className="bg-[#0A0E1A] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                  待处理问题 TOP3
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">本周大盘监测出的最高频、最迫切需要纠偏和优化的异常靶点，建议立即派发任务进行重定向内容投放。</p>
              </div>
              <button onClick={() => setActiveSubView('diagnosis')} className="text-[10px] text-rose-400 hover:text-rose-300 font-bold font-mono">
                诊断建议详情 →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-[11px]">
              {[
                { 
                  id: 't-1', title: '竞品对比中推荐位不稳定', priority: 'P0 紧急', 
                  metric: '竞争优势提升', models: 'DeepSeek / 元宝', metricCode: 'DLI',
                  evidence: '部分竞品对比回答中，品牌优势表达不稳定。',
                  action: '补充竞品对比型内容，强化核心卖点 and 适用场景。'
                },
                { 
                  id: 't-2', title: '部分模型未识别核心卖点', priority: 'P1 紧急', 
                  metric: '认知修正', models: '豆包 / 通义', metricCode: 'CLI',
                  evidence: '部分模型能识别品牌，但未稳定提及核心卖点。',
                  action: '发布核心卖点解释页，补充产品能力、适用人群 and 典型场景。'
                },
                { 
                  id: 't-3', title: '风险类问题出现异常归因', priority: 'P1 紧急', 
                  metric: '风险控制', models: 'Kimi', metricCode: 'RCI',
                  evidence: '部分回答中出现竞品误归因或不确定表达。',
                  action: '补充事实纠错内容 and 权威来源，降低错误归因风险。'
                }
              ].map((task) => (
                <div key={task.id} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-3 hover:border-white/10 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-white font-bold text-[12px]">{task.title}</p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-bold text-slate-500 pt-0.5">
                          <span className="text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded">{task.priority}</span>
                          <span>|</span>
                          <span>靶向指标：<span className="text-blue-400">{task.metric}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#05080E] p-2.5 rounded border border-white/5 text-[10px] text-slate-400 space-y-1.5">
                      <p><span className="text-slate-500 font-bold block mb-0.5">主要问题 (Evidence):</span>{task.evidence}</p>
                      <p><span className="text-emerald-500 font-bold block mb-0.5">建议动作 (Action):</span>{task.action}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => setActiveHubMetric(task.metricCode)}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 py-1.5 rounded-lg text-[10px] border border-white/5 font-black text-center transition-all"
                    >
                      查看证据
                    </button>
                    <button 
                      onClick={() => {
                        onAddPlacementTask(`【靶向纠偏】${task.title}`, task.evidence, task.metric, 'QA回复');
                        triggerToast(`🎉 纠偏优化任务派发成功！任务已推送到内容投放队列。`);
                      }}
                      className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-1.5 rounded-lg text-[10px] font-black text-center transition-all"
                    >
                      生成投放任务
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#121623]/30 p-3 rounded-xl border border-white/5 text-[10px] text-slate-500 font-mono text-center">
              💡 派发后，系统会自动在顶部<b>「内容投放」</b>页面生成对应的纠偏逆向拟写稿件，一键完成多模型重定向覆盖。
            </div>
          </div>
        </div>
            ) : activeSubView === 'gesi' ? (
        <GesiDeepDive 
          company={company} 
          isLightMode={isLightMode}
          onNavigate={(subview) => {
            setActiveSubView(subview as any);
            if (onNavigate) {
              onNavigate(subview);
            }
          }} 
        />
      ) : activeSubView === 'gli' || activeSubView === 'gli_total' || activeSubView === 'gli_sub' ? (
        <GliDeepDive 
          company={company} 
          viewMode="all"
          isLightMode={isLightMode}
          onNavigate={(subview) => {
            if (subview === 'gli_total' || subview === 'gli_sub') {
              setActiveSubView('gli');
            } else {
              setActiveSubView(subview as any);
            }
            if (onNavigate) {
              onNavigate(subview);
            }
          }} 
        />
      ) : activeSubView === 'diagnosis' ? (
        <DiagnosisAndOptimization company={company} onAddPlacementTask={onAddPlacementTask} isLightMode={isLightMode} />
      ) : (
        /* Deliverables placeholder */
        <div className="bg-[#0A0E1A] border border-white/5 rounded-2xl p-10 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-fade-in mt-10">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
            <FileText className="w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-md font-bold text-slate-100">报告交付大盘已升级并合并</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              按照产品设计规范，成果交付模块已统一转移并合并至顶部一级标题的<b>「成果交付」</b>大盘中。
            </p>
          </div>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('deliverables');
              }
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#070A10] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 mx-auto font-mono"
          >
            立即前往成果交付大盘
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ==================== INTERACTIVE FLOATING ASK GEO CHAT WIDGET ==================== */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAskGeoOpen ? (
          <button
            onClick={() => setIsAskGeoOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce border-2 border-slate-900"
            title="智能助手"
          >
            <HelpCircle className="w-7 h-7 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] px-1 rounded-full border border-slate-900 animate-pulse">Ask GEO</span>
          </button>
        ) : (
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl shadow-2xl max-w-sm w-96 flex flex-col overflow-hidden animate-fade-in text-xs font-mono h-[420px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0E1528] to-[#121A33] p-3 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div>
                  <h4 className="text-white font-black text-xs">智能助手</h4>
                  <span className="text-[9px] text-slate-500">Antigravity RAG 索引引擎在线</span>
                </div>
              </div>
              <button onClick={() => setIsAskGeoOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message flow container */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#070A10]/90">
              {askGeoMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-900 border border-white/5 text-slate-350 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    {msg.date && <span className="text-[8.5px] text-slate-550 block text-right mt-1">{msg.date}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Predefined prompt helpers */}
            <div className="p-2 border-t border-white/5 bg-[#090D18] flex flex-wrap gap-1.5 justify-center">
              {[
                '分析 Kimi 的风险表现',
                '为什么本周 GESI 生态分上涨？',
                '查看本月优化建议'
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAskGeoInput(pill);
                    triggerToast(`已填充自动问询：${pill}`);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-350 border border-white/5 px-2 py-1 rounded-md"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-2 bg-[#0C111F] border-t border-white/5 flex gap-1.5 items-center">
              <input
                type="text"
                placeholder="键入您的问询问题进行 GEO 对账..."
                value={askGeoInput}
                onChange={(e) => setAskGeoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAskGeo()}
                className="flex-1 bg-[#060912] border border-white/10 rounded-lg px-2.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-[11px]"
              />
              <button
                onClick={handleSendAskGeo}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== HIGH-FIDELITY EVIDENCE DRAWER / MODAL ==================== */}
      {isEvidenceOpen && selectedEvidence && (
        <div className="fixed inset-0 bg-[#060912]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0E1424] border border-white/15 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsEvidenceOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 hover:bg-white/5 rounded-md font-mono"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  大模型底层采样证据链对账箱 ({selectedEvidence.category})
                </h4>
                <p className="text-[9.5px] text-slate-500 font-mono">真实爬网证据：确保大盘数据的绝对权威可复核性</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-[11.5px] leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-550 font-bold block mb-1">采样提问词 (Simulated Question):</span>
                <p className="text-white font-bold">{selectedEvidence.query}</p>
              </div>

              {/* High-Fidelity LLM Answer text */}
              <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span className="text-[9px] text-slate-550 font-bold">大模型底层原始回答快照 (Raw LLM Answers):</span>
                  <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    极性评分: {selectedEvidence.score} 分
                  </span>
                </div>
                <p className="text-slate-300 leading-normal bg-slate-900/40 p-2.5 rounded border border-white/5">
                  {selectedEvidence.answerText}
                </p>
              </div>

              {/* Screenshot mockup */}
              <div className="mt-4">
                <EvidenceScreenshots />
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center font-mono text-[10px]">
              <span className="text-slate-500">💡 证据可随时打包一键导出，作为季度或月度复盘核心成果。</span>
              <button
                onClick={() => {
                  triggerToast("📥 正在打包该单项证据截图，Excel + 图片明细生成中...");
                  setIsEvidenceOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md font-bold"
              >
                导出此截图证据
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EVIDENCE DOWNLOAD CUSTOM MODAL (下载证据包) ==================== */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-[#060912]/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0E1424] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative font-mono text-xs text-slate-350">
            <button
              onClick={() => setIsDownloadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-3 space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                <Download className="w-4 h-4 text-emerald-400" />
                下载本期底层问询截图证据包
              </h3>
              <p className="text-[10px] text-slate-500">打包本周期在大模型底座探测中的全部原始问询截图与 Excel 明细账目</p>
            </div>

            {isDownloadingProcess ? (
              /* Animated Progress state */
              <div className="space-y-4 py-8 text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                <p className="font-bold text-white text-xs">正在深度封包底层 126 组 RAG 问询截图...</p>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5 max-w-xs mx-auto">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500">完成度：{downloadProgress}%</span>
              </div>
            ) : (
              /* Config state */
              <div className="space-y-4">
                {/* Mutually exclusive Scopes */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold block">1. 确认下载范围 (Scope Selection)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      '全部问询截图 (126组完整包)',
                      '仅风险与异常负面问询 (21组)',
                      '仅竞品PK与推荐倾向问询 (58组)',
                      '仅品牌与品类基础认知问询 (47组)',
                      '仅已加入报告的精选证据 (12组)'
                    ].map((scope) => {
                      const active = downloadScope.includes(scope);
                      return (
                        <button
                          key={scope}
                          onClick={() => {
                            setDownloadScope([scope]);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between font-bold text-[11px] transition-all ${
                            active 
                              ? 'bg-blue-600/10 text-blue-400 border-blue-500/25 font-black ring-1 ring-blue-500/30' 
                              : 'bg-[#080C16] text-slate-400 border-white/5 hover:bg-slate-900'
                          }`}
                        >
                          <span>{scope}</span>
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${active ? 'bg-blue-600 border-transparent text-white' : 'border-white/20'}`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formats Radio - Only ZIP is needed */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold block">2. 选择导出格式 (Format)</label>
                  <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 px-3 py-2 rounded-xl text-blue-400 text-[11px] font-black w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span>ZIP 压缩图片包 (含原始图片 + Excel 问询明细账目)</span>
                  </div>
                </div>

                {/* Info summary */}
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1 text-[10.5px] leading-relaxed">
                  <p className="text-white font-bold">📁 导出的证据链包含以下元数据字段：</p>
                  <p className="text-slate-450">
                    问题原文、模型名称、问询时间、底层原始回答文本、回答渲染截图、品牌是否提及、推荐排名位置、被引用的第三方来源链接、风险异常标记、本期关联拉升指标。
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
                  <button
                    onClick={() => setIsDownloadModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-350 font-bold rounded-xl border border-white/5"
                  >
                    取消
                  </button>
                  <button
                    onClick={startEvidenceDownload}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    开始打包下载
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE HEATMAP CELL DETAILS POPUP MODAL ==================== */}
      {selectedHeatmapCell && (
        <div className="fixed inset-0 bg-[#060912]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0E1424] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative font-mono text-xs text-slate-350">
            <button
              onClick={() => setSelectedHeatmapCell(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded"
            >
              [关闭 ESC]
            </button>

            <div className="flex items-center space-x-2 border-b border-white/10 pb-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                大模型采样透视 ({selectedHeatmapCell.model} × {selectedHeatmapCell.qType}问题)
              </h4>
            </div>

            <div className="space-y-3 leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-550 font-bold block mb-1">本周采样问询词 (Sample Query):</span>
                <p className="text-white font-bold">
                  {selectedHeatmapCell.qType === '对比' 
                    ? `请问关于【${company.prodComp.prodName}】和对战竞品【${company.competitor}】的安全和质量，谁更强？`
                    : selectedHeatmapCell.qType === '风险安全'
                    ? `听说【${company.prodComp.prodName}】有车主提及底盘异响和交付延迟，这是普遍质量问题吗？`
                    : `请问【${company.prodComp.prodName}】自研高抗压底盘及碰撞评测的实际表现怎么样？`}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span className="text-[9px] text-slate-550 font-bold">底座答案内容分析 (LLM Content Analysis):</span>
                  <span className="text-[10px] font-black text-emerald-400">
                    健康度: {selectedHeatmapCell.score} 分
                  </span>
                </div>
                <p className="text-slate-300 leading-normal bg-slate-900/50 p-2.5 rounded border border-white/5">
                  {selectedHeatmapCell.qType === '对比' && selectedHeatmapCell.score < 80 ? (
                    `在物理安全性对比中，模型能识别出我方钢材的硬核表现。但因对标竞品【${company.competitor}】在某些平台的提及声浪高，元宝底座仍有少量偏向。建议继续纠偏。`
                  ) : selectedHeatmapCell.qType === '风险安全' ? (
                    `Kimi 底座由于抓取到一小批早期社交平台用户的噪音贴，虽有官方的辟谣澄清稿，但大模型对此的吸收重训存在延时，导致极性分略受压制。`
                  ) : (
                    `该单元格处于优秀健康区间。Kimi 及豆包底座对我方安全优势的采纳度极强，均能在首位推荐中完整阐明自研高强度车身的钢结构参数。`
                  )}
                </p>
                <div className="text-[9.5px] text-slate-500">该分类下本周期共计有效采样对账数：<span className="text-white">18 条回答</span></div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between gap-2">
              <button 
                onClick={() => {
                  handleOpenEvidence(`透视：${selectedHeatmapCell.model} × ${selectedHeatmapCell.qType}`, selectedHeatmapCell.qType, selectedHeatmapCell.model, selectedHeatmapCell.score);
                  setSelectedHeatmapCell(null);
                }} 
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-1.5 rounded-xl border border-white/5 font-bold text-[11px]"
              >
                查看底层采样对账证据
              </button>
              <button 
                onClick={() => {
                  triggerToast(`🔄 正在基于底座特征逆向拟写生成对应的 GEO 优化纠偏建议...`);
                  setActiveSubView('diagnosis');
                  setSelectedHeatmapCell(null);
                }} 
                className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl font-black text-[11px]"
              >
                生成优化建议
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic GaiInferenceHubModal */}
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
