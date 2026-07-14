// src/components/MonthlyOverviewAndCards.tsx
import { useState, useEffect } from 'react';
import { 
  Download, Edit2, Lock, Unlock, Layers, FileText, CheckCircle2, 
  HelpCircle, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Trash2, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine 
} from 'recharts';
import { Company } from '../data';

interface MonthlyOverviewAndCardsProps {
  company: Company;
  translateText: (text: string, id: string) => string;
  gesiScore: number;
  baselineGesi: number;
  gesiDiff: string;
  gliDiff: string;
  onToggleSection: (sectionKey: string) => void;
  hiddenSections: Record<string, boolean>;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (editing: boolean) => void;
  onAddCustomSection: (title: string) => void;
}

export function MonthlyOverviewAndCards({
  company,
  translateText,
  gesiScore,
  baselineGesi,
  gesiDiff,
  gliDiff,
  onToggleSection,
  hiddenSections,
  isLocked,
  setIsLocked,
  isEditMode,
  setIsEditMode,
  onAddCustomSection
}: MonthlyOverviewAndCardsProps) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'docx' | 'pdf'>('docx');
  const [downloadStep, setDownloadStep] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [editDate, setEditDate] = useState('2026-06-01 至 2026-06-30');
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Dual axis chart data
  const trendData = [
    { name: 'W1', GESI: company.id === 'meiling' ? 82 : 65, GLI: company.id === 'meiling' ? 1.2 : 2.0, Benchmark: 65 },
    { name: 'W2', GESI: company.id === 'meiling' ? 84 : 70, GLI: company.id === 'meiling' ? 2.5 : 5.0, Benchmark: 65 },
    { name: 'W3', GESI: company.id === 'meiling' ? 86 : 74, GLI: company.id === 'meiling' ? 4.0 : 9.0, Benchmark: 65 },
    { name: 'W4', GESI: company.id === 'meiling' ? 88 : 78, GLI: company.id === 'meiling' ? 5.5 : 13.0, Benchmark: 65 },
    { name: 'W5', GESI: company.id === 'meiling' ? 89 : 82, GLI: company.id === 'meiling' ? 7.0 : 17.0, Benchmark: 65 },
    { name: 'W6', GESI: company.id === 'meiling' ? 91 : 86, GLI: company.id === 'meiling' ? 8.5 : 21.0, Benchmark: 65 },
  ];

  const handleDownloadStart = () => {
    setDownloadStep(1);
    setDownloadProgress(10);
  };

  useEffect(() => {
    if (downloadStep > 0 && downloadStep < 5) {
      const timer = setTimeout(() => {
        setDownloadProgress((prev) => Math.min(prev + 25, 100));
        setDownloadStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [downloadStep]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleRefreshData = () => {
    setIsRefreshingData(true);
    setTimeout(() => {
      setIsRefreshingData(false);
      triggerToast('大模型物理对账及语义通道已成功刷新！本次操作计入系统统计。');
    }, 2000);
  };

  const handleApplyCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    onAddCustomSection(newSectionTitle);
    triggerToast(`自定义板块【${newSectionTitle}】添加成功！`);
    setNewSectionTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-emerald-900 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-mono">{showToast}</span>
        </div>
      )}

      {/* Top Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131825] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">报告控制面板 (Report Operations Hub)</h3>
            <div className="flex items-center gap-2 mt-1">
              {isLocked ? (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-mono font-bold">
                  <Lock className="w-3 h-3" /> 报告已锁定 (防篡改)
                </span>
              ) : (
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-mono font-bold">
                  <Unlock className="w-3 h-3" /> 可自由编辑与调整
                </span>
              )}
              {isEditMode && (
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold">
                  🔧 编辑模式开启
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Download Trigger */}
          <button
            onClick={() => {
              setDownloadModalOpen(true);
              setDownloadStep(0);
              setDownloadProgress(0);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all border border-indigo-500/20 shadow-lg shadow-indigo-600/10"
          >
            <Download className="w-3.5 h-3.5" /> 下载报告 (Word/PDF)
          </button>

          {/* Edit Toggle */}
          <button
            disabled={isLocked}
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isEditMode 
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/10' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5'
            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditMode ? '关闭编辑' : '编辑报告'}
          </button>

          {/* Lock Toggle */}
          <button
            onClick={() => {
              setIsLocked(!isLocked);
              if (!isLocked) {
                setIsEditMode(false);
                triggerToast('报告已成功锁定！全部编辑项已隐藏并归档，哈希指纹已重新签发。');
              } else {
                triggerToast('报告已解锁，管理编辑权限已激活。');
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isLocked 
                ? 'bg-rose-950/40 text-rose-400 border-rose-500/20 hover:bg-rose-900/40' 
                : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20 hover:bg-emerald-900/40'
            }`}
          >
            {isLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5" /> 解锁修改
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> 锁定报告
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Controls Panel (Shown only during Edit Mode) */}
      {isEditMode && !isLocked && (
        <div className="bg-[#1A2234] p-5 rounded-2xl border border-indigo-500/20 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-indigo-400">
            <Edit2 className="w-4 h-4" />
            <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider">大模型对账报告高级编辑控制台</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Date adjustment */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                调整数据对账检索周期
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="bg-[#0B0F17] text-white px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono flex-1 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleRefreshData}
                  disabled={isRefreshingData}
                  className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 transition-all flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshingData ? 'animate-spin' : ''}`} />
                  {isRefreshingData ? '刷新中...' : '重算跑数'}
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-yellow-500/[3%] border border-yellow-500/10 text-[10px] text-amber-300 font-sans flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">⚠️ 重新对账需要消耗Token:</span> 重新核对全网数据并调取各AI模型真实RAG状态，预计将消耗 <span className="font-bold underline text-white font-mono">12,500</span> token/次。请确保API密钥额度充沛。
                </div>
              </div>
            </div>

            {/* Right Column: Add section and toggle list */}
            <div className="space-y-3">
              <label className="text-[10px] text-slate-400 font-bold uppercase font-mono flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                增加自定义分析模块
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="如：11. 区域市场大模型声量专报"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="bg-[#0B0F17] text-white px-3 py-1.5 rounded-lg border border-white/10 text-xs flex-1 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleApplyCustomSection}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  添加模块
                </button>
              </div>

              {/* Toggle checklist */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase font-mono">隐藏/显示已配置板块 (Visibility Settings)</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'summary', name: '月度执行摘要' },
                    { key: 'cards', name: '三卡片' },
                    { key: 'metrics', name: '成果数字' },
                    { key: 'trend', name: '双趋势图' },
                    { key: 'radar', name: '七大子指数雷达' },
                    { key: 'models', name: '4. AI模型表现' },
                    { key: 'queries', name: '5. 问题类型表现' },
                    { key: 'competitors', name: '7. 竞品位置变化' },
                    { key: 'risks', name: '8. 风险修复' },
                    { key: 'evidence', name: '9. 原始问答证据区' },
                    { key: 'roadmap', name: '10. 下月计划路线图' }
                  ].map((sec) => (
                    <button
                      key={sec.key}
                      onClick={() => onToggleSection(sec.key)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-mono transition-all font-bold ${
                        hiddenSections[sec.key]
                          ? 'bg-slate-900 text-slate-500 border-white/5 line-through opacity-60'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {hiddenSections[sec.key] ? '🙈' : '👁️'} {sec.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Monthly Execution Summary (月度执行摘要) */}
      {!hiddenSections['summary'] && (
        <div className="bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-transparent p-6 rounded-2xl border border-blue-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-slate-500">对账周期: {editDate}</div>
          <h2 className="text-sm font-black text-blue-400 font-mono mb-4 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            月度执行摘要 (Monthly Executive Overview)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Narration */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#0B0F17]/30 p-4 rounded-xl border border-white/5 space-y-2 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">★ 本月核心结论 (Core Conclusion)</span>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {translateText(`本月度战役围绕“后多连杆独立悬挂”与“魔方双针刺防爆电池”两大核心实测卖点展开大模型深度对账和舆情清洗。
                  通过在懂车帝、知乎、抖音等全网高权重节点常态化铺设 128 篇硬核拆车对比与极寒测试白皮书，大模型底层检索通路彻底打开。
                  本周期 GESI (综合健康度) 提升至 86 分（较基准大涨 +21 分），
                  在 Kimi、豆包等主流模型中的推荐首位占有率突破 82%，成功实现了对核心竞品比亚迪秦L的强力反拦截与流量截流。`, company.id)
                    .replace('86 分', `${gesiScore} 分`)
                    .replace('+21 分', `+${gesiDiff} 分`)
                    .replace('82%', company.id === 'meiling' ? '74%' : '82%')
                    .replace('比亚迪秦L', company.competitor)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#0B0F17]/30 p-3.5 rounded-xl border border-white/5 text-left">
                  <span className="text-[10px] text-blue-400 font-bold font-mono block">内容结构 (Content Structure)</span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    全网黄金垂直矩阵+工信部及第三方拆车检测权威白皮书结合，确保大模型RAG索引全链路打通。
                  </p>
                </div>
                <div className="bg-[#0B0F17]/30 p-3.5 rounded-xl border border-white/5 text-left">
                  <span className="text-[10px] text-emerald-400 font-bold font-mono block">总体表现 (Overall Performance)</span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    大盘呈现出显著的“反弹爬坡”迹象，在5大主流模型中取得高置信，心智稳定性维持在最高绿区。
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Insights Bento */}
            <div className="md:col-span-5 bg-[#0D121F]/80 p-4 rounded-xl border border-white/5 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-white/5 pb-2">🎯 对账价值四大穿透透视图</span>
              
              <div className="space-y-2.5 text-left">
                <div className="flex items-start gap-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">最大提升</span>
                  <p className="text-[11px] text-slate-300 flex-1 leading-relaxed">
                    {translateText('“五连杆独立悬挂”标签的大模型绑定概率拉高了65%，推荐时首句安利成功率大涨。', company.id)}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">最大问题</span>
                  <p className="text-[11px] text-slate-300 flex-1 leading-relaxed">
                    {translateText('在无网络实时搜索的大模型预训练底座中，秦L的高声量依然导致惯性分流。', company.id).replace('秦L', company.competitor)}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">最大机会</span>
                  <p className="text-[11px] text-slate-300 flex-1 leading-relaxed">
                    利用各模型对高权重工信部及质检外链的脚注偏好，继续高频投喂硬核安全证书反击谣言。
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">下月重点</span>
                  <p className="text-[11px] text-slate-300 flex-1 leading-relaxed">
                    攻坚DeepSeek与元宝，强化长尾决策场景词拦截，使整体防御闭环。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Monthly Three Cards (月度三卡片) */}
      {!hiddenSections['cards'] && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3 py-0.5 text-left">
            <h3 className="text-sm font-extrabold text-white">月度核心对账三卡片 (Monthly Audit Cards)</h3>
            <span className="text-[10px] text-slate-500 font-mono">（三卡片对账框架：全方位说明品牌基线、现况与干预证明）</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Baseline Card */}
            <div className="bg-gradient-to-b from-[#131825] to-[#0D121F] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-xl transition-all group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-indigo-400 font-bold font-mono tracking-wider">CARD 01 • BEFORE (使用前)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 border border-white/5 px-2 py-0.5 rounded font-mono font-bold">初始状态基准</span>
                </div>
                <h4 className="text-2xl font-black text-slate-300 mt-3 font-mono">{baselineGesi} <span className="text-xs text-slate-500 font-normal">/ 100</span></h4>
                <div className="text-[11px] text-slate-400 mt-2 space-y-1.5 border-t border-white/5 pt-3 leading-relaxed text-left">
                  <span className="font-bold text-slate-300 block mb-1">📋 投放前 GESI 初始基线评估:</span>
                  <p>在优化干预战役启动前，品牌大模型健康得分仅为 {baselineGesi} 分。在主流模型库检索反馈中呈现“提及率低”、“事实回答错误多”、“推荐位被竞品拦截”等严重边缘化状态。用于说明干预前的冷启动阻断盲区。</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>用途: 说明前品牌状态</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">✓ BASELINE_STABLE</span>
              </div>
            </div>

            {/* Current GESI Card */}
            <div className="bg-gradient-to-b from-[#131825] to-[#0D121F] border border-emerald-500/10 hover:border-emerald-500/20 p-5 rounded-2xl flex flex-col justify-between shadow-xl transition-all group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-wider">CARD 02 • CURRENT (当前实测)</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">● 品牌健康大盘</span>
                </div>
                <h4 className="text-2xl font-black text-emerald-400 mt-3 font-mono">
                  {gesiScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  <span className="text-xs text-emerald-500 ml-2 font-bold">↑ +{gesiDiff}分</span>
                </h4>
                <div className="text-[11px] text-slate-400 mt-2 space-y-1.5 border-t border-white/5 pt-3 leading-relaxed text-left">
                  <span className="font-bold text-emerald-400 block mb-1">📋 优化后 GESI 生态健康度:</span>
                  <p>本周期实测评分锁定在 {gesiScore} 分。大模型原生语义网络关联已经基本稳定，正面标签深度关联我方两大核心机械卖点，不实舆情负面词条已实现极佳的物理性降噪过滤。用于评估大模型对品牌健康度的整体采信水平。</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>用途: 说明现在品牌健康度</span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">✓ ECO_HEALTH_A_CLASS</span>
              </div>
            </div>

            {/* Monthly GLI Card */}
            <div className="bg-gradient-to-b from-[#131825] to-[#0D121F] border border-blue-500/10 hover:border-blue-500/20 p-5 rounded-2xl flex flex-col justify-between shadow-xl transition-all group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-blue-400 font-bold font-mono tracking-wider">CARD 03 • ACTION (本月提升)</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold">干预提升证明</span>
                </div>
                <h4 className="text-2xl font-black text-blue-400 mt-3 font-mono">+{gliDiff} <span className="text-xs text-slate-500 font-normal">点</span></h4>
                <div className="text-[11px] text-slate-400 mt-2 space-y-1.5 border-t border-white/5 pt-3 leading-relaxed text-left">
                  <span className="font-bold text-blue-400 block mb-1">📋 GLI 优化链路干预效果:</span>
                  <p>通过CLI认知纠偏、DLI竞品反拦截、RCI路由畅通等技术对账，本月实现累计 +{gliDiff} 分的纯技术干预收益。直接验证了通过物理投喂脚注与高可信白皮书，可以强制诱导模型改写其首要安利结果。用于向品牌方证明干预的真实增量收益。</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>用途: 说明本月优化效果证明</span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform">✓ LEVERAGE_VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Monthly Accomplishments Metrics (月度成果数字) */}
      {!hiddenSections['metrics'] && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3 py-0.5 text-left">
            <h3 className="text-sm font-extrabold text-white">月度成果数字 (Monthly Achievement Metrics)</h3>
            <span className="text-[10px] text-slate-500 font-mono">（六大对账核心成果指标：展示纯技术清洗及拦截价值）</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: '新增可见问题数', val: '+45 个', desc: '大模型底层新增抓取正面Query', color: 'text-indigo-400 bg-indigo-500/5' },
              { label: '推荐排名提升问题数', val: '+128 个', desc: '在列表推荐中顺位大幅提拉', color: 'text-emerald-400 bg-emerald-500/5' },
              { label: '新增 Top3 问题数', val: '+36 个', desc: '直接打入大模型安利首屏黄金区', color: 'text-blue-400 bg-blue-500/5' },
              { label: '内容资产被引用次数', val: '1,240 次', desc: 'RAG权威脚注抓取与显式展示', color: 'text-purple-400 bg-purple-500/5' },
              { label: '竞品截流网络数', val: '+24 节点', desc: '点名竞品时大模型主动诱导选择', color: 'text-amber-400 bg-amber-500/5' },
              { label: '风险修复数量', val: '15 项', desc: '阻断过时、偏见与恶意虚假传言', color: 'text-rose-400 bg-rose-500/5' }
            ].map((m, idx) => (
              <div key={idx} className={`p-4 rounded-xl border border-white/5 flex flex-col justify-between text-left ${m.color} hover:border-white/10 transition-colors`}>
                <span className="text-[10px] text-slate-400 font-bold block font-sans h-8 leading-tight">{m.label}</span>
                <div className="mt-2">
                  <span className="text-xl font-black font-mono block leading-none">{m.val}</span>
                  <span className="text-[9px] text-slate-500 block mt-1 leading-normal">{m.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Monthly GESI / GLI Double Line Trend Chart (月度 GESI / GLI 趋势图) */}
      {!hiddenSections['trend'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              月度 GESI (健康度) 与 GLI (干预值) 双趋势运行大盘
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono font-bold">双折线走势 (W1 ~ W6)</span>
          </div>

          <div className="p-6">
            <div className="h-[280px] bg-[#0B0F17]/30 rounded-xl border border-white/5 p-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 15, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  
                  {/* Left Y Axis for GESI */}
                  <YAxis yAxisId="left" domain={[50, 100]} stroke="#10b981" fontSize={10} tickLine={false} label={{ value: 'GESI 健康得分', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 9, offset: 10 }} />
                  
                  {/* Right Y Axis for GLI */}
                  <YAxis yAxisId="right" orientation="right" domain={[0, 25]} stroke="#3b82f6" fontSize={10} tickLine={false} label={{ value: 'GLI 提升得分', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 9, offset: 10 }} />
                  
                  <Tooltip contentStyle={{ backgroundColor: '#0F131D', borderColor: 'rgba(255,255,255,0.1)', color: '#F1F5F9', fontSize: 11 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  
                  {/* GESI Curve */}
                  <Line yAxisId="left" type="monotone" dataKey="GESI" name="GESI 综合健康得分 (左轴)" stroke="#10b981" strokeWidth={3.5} activeDot={{ r: 7 }} />
                  
                  {/* GLI Curve */}
                  <Line yAxisId="right" type="monotone" dataKey="GLI" name="GLI 累积干预提拉得分 (右轴)" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="5 5" />
                  
                  <ReferenceLine yAxisId="left" y={baselineGesi} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: `基准线 ${baselineGesi}`, fill: '#94A3B8', fontSize: 8, position: 'insideBottomRight' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#0B0F17]/40 border border-white/5 text-xs text-slate-300 leading-relaxed text-left">
              <span className="font-bold text-emerald-400 block mb-1">📝 双轴对账趋势深入解构:</span>
              通过双折线大盘可以清晰透视 GESI 生态健康度与 GLI 干预得分的协同走势。在 W1 - W2 优化启动期，随着 RCI 路由网关对大模型爬虫解锁，GLI 启动得分温和累积；
              步入 W3 - W4 后，高密度的 128 条核心引用脚注链接全速生效，GLI 斜率达到最高。这直接促成了 GESI 健康评分在 W5 - W6 突破 {gesiScore} 分的最高红利绿区。
              这有力论证了：大模型优化绝非零敲碎打，而是“干预深度（GLI）直接决定心智健康度（GESI）”的高度时间相关复利系统。
            </div>
          </div>
        </div>
      )}

      {/* Downloader Dialog Simulator */}
      {downloadModalOpen && (
        <div className="fixed inset-0 bg-[#0B0F17]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131825] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              导出并打包月度对账白皮书
            </h3>
            <p className="text-xs text-slate-400 mb-4">根据大模型审计标准，将本周期内的 128 份大模型真实交互证据、趋势大盘及物理指纹签发打包导出为标准文档包。</p>

            {downloadStep === 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">选择导出格式 (Export Format)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDownloadFormat('docx')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        downloadFormat === 'docx'
                          ? 'bg-indigo-600/10 border-indigo-500 text-white'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-xs font-bold block">Word 格式 (.docx)</span>
                        <span className="text-[9px] text-slate-500">适合归档、再编辑汇报</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setDownloadFormat('pdf')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        downloadFormat === 'pdf'
                          ? 'bg-indigo-600/10 border-indigo-500 text-white'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                      <div>
                        <span className="text-xs font-bold block">PDF 格式 (.pdf)</span>
                        <span className="text-[9px] text-slate-500">高保真排版、不可篡改</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setDownloadModalOpen(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDownloadStart}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg"
                  >
                    生成文档并下载
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 py-4 text-center">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-white block">
                    {downloadStep === 1 && '1. 正在获取生成式生态数据 (GESI)...'}
                    {downloadStep === 2 && '2. 正在汇编各AI模型深度对账凭证...'}
                    {downloadStep === 3 && '3. 正在执行数据完整性与SHA256哈希校验...'}
                    {downloadStep === 4 && '4. 正在生成 Word/PDF 离线报告文件...'}
                    {downloadStep >= 5 && '✓ 文档生成完毕！'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">Progress: {downloadProgress}%</span>
                </div>

                {downloadStep >= 5 && (
                  <div className="pt-2 animate-fadeIn space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-mono">
                      🔒 SHA256_{downloadFormat.toUpperCase()}_EXPORT_PASSED
                    </div>
                    <button
                      onClick={() => {
                        setDownloadModalOpen(false);
                        triggerToast(`【${company.name}月度对账白皮书.${downloadFormat}】成功保存至本地！`);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-600/10"
                    >
                      点击立即存盘
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
