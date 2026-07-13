import { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle2, ChevronRight, Settings, Sliders, Cpu, 
  Layers, FileText, Calendar, Sparkles, AlertCircle, Share2, Download, Copy
} from 'lucide-react';
import { cn } from '../lib/utils';

export function ReportGenerator({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'周报' | '月报' | '季报' | '自定义报告'>('周报');
  const [brand, setBrand] = useState('吉利星瑞汽车');
  const [models, setModels] = useState(['Kimi', '豆包', '通义千问']);
  const [template, setTemplate] = useState('标准运营执行版');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [selectedSections, setSelectedSections] = useState<string[]>([
    'gvi', 'gri', 'gii', 'gci', 'gai', 'gdi', 'acs'
  ]);

  const toggleSection = (sec: string) => {
    if (selectedSections.includes(sec)) {
      setSelectedSections(selectedSections.filter(i => i !== sec));
    } else {
      setSelectedSections([...selectedSections, sec]);
    }
  };

  // Editable confirmation states (Step 5)
  const [editedTitle, setEditedTitle] = useState('吉利星瑞 AIGC 成果运营跟踪评测报告');
  const [editedSummary, setEditedSummary] = useState(
    '本周期品牌整体 AI 声貌综合指数稳步往健优级（A+）迁移。主要驱动力来自于推荐排位提升和权威媒体内容资产的高引用覆盖。但我方在 DeepSeek DeepThink 等闭源模型的竞品对比中仍有流失风险。'
  );
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Model toggler helper
  const toggleModel = (m: string) => {
    if (models.includes(m)) {
      setModels(models.filter(item => item !== m));
    } else {
      setModels([...models, m]);
    }
  };

  // Run simulated AIGC loader
  useEffect(() => {
    let timer: any;
    if (loading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setLoading(false);
            setStep(5); // Go to Step 5: Edit & Confirm
            return 100;
          }
          return prev + 12;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleStartGeneration = () => {
    setLoading(true);
    setStep(4);
  };

  return (
    <div className="bg-[#131825] border border-white/5 rounded-xl p-6 max-w-4xl mx-auto space-y-6">
      {/* Wizard Steps indicator */}
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {[
          { s: 1, text: '选择类型' },
          { s: 2, text: '配置范围' },
          { s: 3, text: '选择模板' },
          { s: 4, text: 'AI 生成' },
          { s: 5, text: '编辑审发' }
        ].map(item => (
          <div key={item.s} className="flex items-center space-x-1.5 shrink-0">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all",
              step === item.s 
                ? "bg-emerald-500 text-black scale-110 shadow-lg shadow-emerald-500/20" 
                : step > item.s 
                  ? "bg-slate-700 text-emerald-400" 
                  : "bg-slate-800 text-slate-500 border border-white/5"
            )}>
              {item.s}
            </span>
            <span className={cn(
              "text-xs font-semibold hidden sm:inline",
              step === item.s ? "text-slate-100" : "text-slate-500"
            )}>
              {item.text}
            </span>
            {item.s < 5 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />}
          </div>
        ))}
      </div>

      <hr className="border-white/5" />

      {/* STEP 1: SELECT REPORT TYPE */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-350 font-mono text-slate-200">第一步: 请选择你想要生成的 GEO 周期报告类型</h3>
            <p className="text-xs text-slate-500 mt-1">云端GEO交付中心提供涵盖长、短生命周期全场景的合规追踪与决策复盘</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {[
              { id: '周报', label: '常态运营周报', desc: '核心回答“这一周发生了什么”，专注异变、新曝光、行动清单', style: 'border-slate-800 hover:border-emerald-500/40 bg-slate-800/40' },
              { id: '月报', label: '月度效果复盘', desc: '用于向市场、品牌高层汇报投放产生的 GLI 指数提升及归因', style: 'border-slate-800 hover:border-blue-500/40 bg-slate-800/40' },
              { id: '季报', label: '长期战略季报', desc: '看 GEO 动作是否为品牌积淀长期资产红利，评估竞品格局', style: 'border-slate-800 hover:border-indigo-500/40 bg-slate-800/40' },
              { id: '自定义报告', label: '定制化事件专报', desc: '自拟时间、品牌和特定竞品进行突发攻防诊断包围', style: 'border-slate-800 hover:border-slate-500/40 bg-slate-800/40' }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setType(item.id as any);
                  setEditedTitle(`吉利星瑞 AIGC 成果运营跟踪${item.id} (W24-0715)`);
                }}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-36",
                  type === item.id 
                    ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/5 scale-[1.02]" 
                    : item.style
                )}
              >
                <div>
                  <h4 className="text-xs font-bold text-white mb-2">{item.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-2 flex justify-between items-center border-t border-white/5 pt-2">
                  <span>交付对象: 运营/高管</span>
                  <span className="text-emerald-400 font-bold">»</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all"
            >
              下一步：配置范围 <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SCOPE FILTER */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-200 font-mono">第二步: 请配置当前周期报告的数据捕获范围</h3>
            <p className="text-xs text-slate-500 mt-1">所有指标分和底层 Q&A 事实链均会按此条件开展跨模型抓取及综合分析</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Left inputs */}
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-400 uppercase font-mono block mb-2">监测品牌对象</label>
                <input 
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase font-mono block mb-2">时间周期跨度</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[10px] text-slate-500 font-mono">PRESET</span>
                  <select className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 pl-16 text-white font-medium focus:outline-none focus:border-emerald-500">
                    <option>2026.07.08 - 2026.07.14 (本周)</option>
                    <option>2026.07.01 - 2026.07.07 (上周)</option>
                    <option>过去 30 天</option>
                    <option>自定义时间...</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-mono block mb-2">核心竞品对比组</label>
                  <select className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-white font-medium focus:outline-none">
                    <option>大众速腾 1.5T / 领克03</option>
                    <option>深蓝SL03 / 秦L</option>
                    <option>全部竞品</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 uppercase font-mono block mb-2">地域语言环境</label>
                  <select className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-white font-medium focus:outline-none">
                    <option>全国 / 简体中文</option>
                    <option>全国 / 广东话环境</option>
                    <option>海外 / 英文版环境</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right checkpoints: AI Models & Functional Sections */}
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-400 uppercase font-mono block mb-1.5">勾选多端覆盖的模型 (多选)</label>
                <div className="grid grid-cols-2 gap-2.5 bg-[#0B0F17]/60 p-3.5 rounded-xl border border-white/5">
                  {['Kimi智能助理', '豆包AI', '通义千问', 'DeepSeek-R1', '文心一言', '腾讯元宝'].map(m => {
                    const val = m.replace('智能助理', '').replace('AI', '');
                    const isChecked = models.includes(val);
                    return (
                      <div 
                        key={m}
                        onClick={() => toggleModel(val)}
                        className={cn(
                          "p-2 rounded border cursor-pointer flex items-center justify-between transition-all text-[11px]",
                          isChecked ? "border-emerald-500 bg-emerald-500/5 text-slate-100 font-bold" : "border-white/5 text-slate-405 hover:bg-white/5"
                        )}
                      >
                        <span>{m}</span>
                        <span className={cn("text-[9px] font-mono", isChecked ? 'text-emerald-400 font-extrabold' : 'text-slate-600')}>
                          {isChecked ? '✓ 已选' : '+ 点击'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-slate-400 uppercase font-mono block mb-1.5">勾选需要固定的分析版块 (多选)</label>
                <div className="grid grid-cols-2 gap-2 bg-[#0B0F17]/60 p-3.5 rounded-xl border border-white/5">
                  {[
                    { id: 'gvi', label: 'GVI 品牌可见度诊断' },
                    { id: 'gri', label: 'GRI 推荐优先级追踪' },
                    { id: 'gii', label: 'GII 生成式印象特写' },
                    { id: 'gci', label: 'GCI 实体认知事实整顿' },
                    { id: 'gai', label: 'GAI 证据网络反链反查' },
                    { id: 'gdi', label: 'GDI 竞品拦截能力阻击' },
                    { id: 'acs', label: 'ACS 内容资产贡献评估' }
                  ].map(sec => {
                    const isChecked = selectedSections.includes(sec.id);
                    return (
                      <div 
                        key={sec.id}
                        onClick={() => toggleSection(sec.id)}
                        className={cn(
                          "p-2 rounded border cursor-pointer flex items-center justify-between transition-all text-[11px]",
                          isChecked ? "border-emerald-500 bg-emerald-500/5 text-slate-100 font-bold" : "border-white/5 text-slate-405 hover:bg-white/5"
                        )}
                      >
                        <span className="truncate pr-1" title={sec.label}>{sec.label}</span>
                        <span className={cn("text-[9px] font-mono", isChecked ? 'text-emerald-400 font-extrabold' : 'text-slate-600')}>
                          {isChecked ? '✓ 包含' : '○ 排除'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold transition-all"
            >
              ← 上一步
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all"
            >
              下一步：选择模板 <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TEMPLATE RANGE */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-200 font-mono">第三步: 请选择配套周报/月报导出的可视化模板</h3>
            <p className="text-xs text-slate-500 mt-1">模板决定了排版配图以及 AI 智能文字总结的汇报视角结构</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            {[
              { name: '标准运营执行版', desc: '偏重漏斗图、排名变化、缺陷列表与具体下周待执行任务清单。适配运营团队。', tag: '主推' },
              { name: '管理层决策专报', desc: '高度提炼战略结论，突出 GESI/GLI 跨月跨季度双指数变好趋势，弱化细节明细。', tag: '高管专送' },
              { name: '商业汇报与复约版', desc: '突出品牌与速腾等竞品攻防，量化投入产出ROI比（如新增引流、修复数词），促成复购续约。', tag: '商业/CS' }
            ].map(temp => (
              <div
                key={temp.name}
                onClick={() => setTemplate(temp.name)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-40",
                  template === temp.name 
                    ? "border-emerald-500 bg-emerald-500/5 scale-[1.02]" 
                    : "border-slate-800 hover:border-slate-600 bg-slate-800/40"
                )}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold text-white">{temp.name}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-[#1A2234] text-emerald-400">
                      {temp.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{temp.desc}</p>
                </div>
                <span className="text-[10px] text-slate-600 text-right block mt-2">点击挑选 »</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold transition-all"
            >
              ← 上一步
            </button>
            <button
              onClick={handleStartGeneration}
              className="flex items-center px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/20"
            >
              🚀 正式发起 AI 智能生成
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI GENERATIVE PROCESSING LOADER */}
      {step === 4 && (
        <div className="py-12 space-y-6 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto -animate-pulse shrink-0">
            <Cpu className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center justify-center">
              AIGC 智能生成中，请不要关闭浏览器
              <span className="ml-1.5 text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 animate-pulse">Running</span>
            </h3>
            <p className="text-xs text-slate-500">正在调取 GESI计算引擎、提取本周异动提问、自动执行Gap分析和可信源归因...</p>
          </div>

          {/* Glowing bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>状态码: 200 OK</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: MANUAL EDITING CONFIRMATION & EXPORT */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mr-3">
              🎉
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-emerald-400">AI 周期报告已极速生成就绪！</h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                按照合规和审发流程，建议你进行标题与关键结论的二次人工审阅修改确认。审核完毕后一键分发或导出。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title field */}
            <div className="text-xs font-semibold">
              <label className="text-slate-400 uppercase font-mono block mb-1.5">1. 审核修改报告标题 (User Editable Title)</label>
              <input 
                type="text" 
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-slate-100 font-medium focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Rich Area field */}
            <div className="text-xs font-semibold">
              <label className="text-slate-400 uppercase font-mono block mb-1.5">
                2. AI 抓取出的周期摘要，支持人工修改增加口径 (Summary Review)
              </label>
              <textarea 
                rows={4}
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-3 text-slate-200 font-medium leading-relaxed focus:outline-none focus:border-emerald-500 text-xs text-justify"
              ></textarea>
            </div>

            {/* Check filters triggers */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div className="bg-[#0B0F17]/50 p-3 rounded-lg border border-white/5 space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">报告已附带证据链路</span>
                <div className="flex items-center text-emerald-400 font-semibold gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>34 处 问答物理原文引用溯源</span>
                </div>
              </div>
              <div className="bg-[#0B0F17]/50 p-3 rounded-lg border border-white/5 space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">本配置拦截阻击报告</span>
                <div className="flex items-center text-blue-400 font-semibold gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>含 2 项对标速腾竞争拦截战绩</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Quick exporter actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold transition-all"
            >
              ← 重新配置
            </button>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  const newReport = {
                    id: `REP-CUSTOM-${Date.now()}`,
                    name: editedTitle,
                    period: `2026.07.08-07.14`,
                    score: '92.5 pts',
                    size: '14.5 MB',
                    type: 'PDF',
                    status: '已生成',
                    creator: '系统自动'
                  };
                  const existing = JSON.parse(localStorage.getItem('custom_generated_reports') || '[]');
                  existing.unshift(newReport);
                  localStorage.setItem('custom_generated_reports', JSON.stringify(existing));
                  
                  setShowExportSuccess(true);
                  setTimeout(() => {
                    setShowExportSuccess(false);
                    onComplete();
                  }, 1500);
                }}
                className="flex items-center px-4 py-2 bg-[#1A2234] hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-white/5"
              >
                <Download className="w-4 h-4 mr-1.5" />
                导出 PDF & 存盘交付
              </button>
              <button 
                onClick={() => {
                  const newReport = {
                    id: `REP-CUSTOM-${Date.now()}`,
                    name: editedTitle,
                    period: `2026.07.08-07.14`,
                    score: '92.5 pts',
                    size: '18.2 MB',
                    type: 'PPT',
                    status: '已生成',
                    creator: '系统自动'
                  };
                  const existing = JSON.parse(localStorage.getItem('custom_generated_reports') || '[]');
                  existing.unshift(newReport);
                  localStorage.setItem('custom_generated_reports', JSON.stringify(existing));
                  
                  setShowExportSuccess(true);
                  setTimeout(() => {
                    setShowExportSuccess(false);
                    onComplete();
                  }, 1500);
                }}
                className="flex items-center px-4 py-2 bg-[#1A2234] hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-white/5"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                下载 PPT & 存盘交付
              </button>
              <button 
                onClick={() => {
                  const newReport = {
                    id: `REP-CUSTOM-${Date.now()}`,
                    name: editedTitle,
                    period: `2026.Q2 汇总`,
                    score: '94.8 pts',
                    size: '15.5 MB',
                    type: '自定义',
                    status: '已确认',
                    creator: '陈利娜'
                  };
                  const existing = JSON.parse(localStorage.getItem('custom_generated_reports') || '[]');
                  existing.unshift(newReport);
                  localStorage.setItem('custom_generated_reports', JSON.stringify(existing));

                  setShowExportSuccess(true);
                  setTimeout(() => {
                    setShowExportSuccess(false);
                    onComplete();
                  }, 1500);
                }}
                className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold transition-all shadow-lg"
              >
                <Share2 className="w-4 h-4 mr-1.5" />
                分发共享并上线归档
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global notify panel */}
      {showExportSuccess && (
        <div className="fixed bottom-6 right-6 bg-[#1A2234] border border-emerald-500/30 text-emerald-400 p-4 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center space-x-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <p className="text-white">导出与分享操作成功！</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">链接已自动同步至企微/飞书分享中台</p>
          </div>
        </div>
      )}
    </div>
  );
}
