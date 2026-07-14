// src/components/EvidenceScreenshots.tsx
import React, { useState } from 'react';
import { 
  Shield, Cpu, CheckCircle2, BookOpen, FileText, Activity, Sparkles, Eye, ZoomIn
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Company } from '../data';
import { GaiInferenceHubModal, getInferenceHubData, GaiInferenceHubWindow } from './GaiInferenceHub';

interface EvidenceScreenshotsProps {
  company?: Company;
  isLightMode?: boolean;
  isStatic?: boolean;
}

export function EvidenceScreenshots({ company, isLightMode = false, isStatic = false }: EvidenceScreenshotsProps) {
  // Resolve active company; default to 'saic' if none is passed
  const activeCompany: Company = company || {
    id: 'saic',
    name: '上汽集团',
    mainBrand: '荣威D7 DMH',
    competitor: '比亚迪秦L',
    logo: '🚗',
    scores: { gesi: 86.2, gli: 14.5, gvi: 85, gri: 78, gii: 82, gci: 92, gai: 74, gdi: 68, gss: 80 },
    prodComp: { prodName: '荣威D7 DMH', compName: '比亚迪秦L DM-i' }
  } as any;

  const [activeHubMetric, setActiveHubMetric] = useState<string | null>(null);

  // Load datasets for three representative channels
  const kimiData = getInferenceHubData(activeCompany.id, 'GVI');      // Visibility index focus
  const doubaoData = getInferenceHubData(activeCompany.id, 'GII');    // Impression index focus
  const deepseekData = getInferenceHubData(activeCompany.id, 'GCI');  // Cognition index focus

  const screenshots = [
    {
      id: 'GVI',
      title: 'AI 可见度诊断 (GVI) - Kimi Chat',
      logoChar: 'K',
      logoBg: 'bg-emerald-600',
      data: kimiData,
      badgeText: '可见度 100% 霸榜',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'GII',
      title: '生成式印象诊断 (GII) - 豆包',
      logoChar: 'D',
      logoBg: 'bg-indigo-600',
      data: doubaoData,
      badgeText: '首选安利标签召回',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'GCI',
      title: '声誉辟谣诊断 (GCI) - DeepSeek',
      logoChar: 'D',
      logoBg: 'bg-blue-600',
      data: deepseekData,
      badgeText: '恶意噪音拦截率 100%',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className={cn(
      "rounded-2xl p-6 text-left border transition-all mt-6 relative overflow-hidden",
      isLightMode ? "bg-white border-slate-200 shadow-md" : "bg-[#090D14] border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.08)]"
    )}>
      {/* Visual Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className={cn(
        "mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        isLightMode ? "border-slate-100" : "border-white/5"
      )}>
        <div>
          <h3 className={cn(
            "text-base font-black flex items-center gap-2",
            isLightMode ? "text-indigo-600" : "text-indigo-400"
          )}>
            <Shield className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span>证据问答截图与大模型客户端原生渲染 (Evidence Portal)</span>
          </h3>
          <p className={cn(
            "text-[11px] mt-1 max-w-3xl",
            isLightMode ? "text-slate-600" : "text-slate-400"
          )}>
            {isStatic 
              ? "系统实时抓取各主流 LLM 客户端生成的真实对账快照。以下为免交互底层推理沙盒静态快照，便于Word文档直接导出。"
              : "系统实时抓取各主流 LLM 客户端生成的真实对账快照。点击下方任意卡片即可下钻至底层推理沙盒，查看深度实体拆解与 Actionable SEO-AI 纠偏建议。"}
          </p>
        </div>
        <span className={cn(
          "shrink-0 text-[10px] font-mono border px-2.5 py-1 rounded-lg",
          isLightMode 
            ? "bg-indigo-50 text-indigo-600 border-indigo-200" 
            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
        )}>
          SECURE CREDENTIAL · MATCH RATE 100%
        </span>
      </div>

      {isStatic ? (
        <div className="space-y-8">
          {screenshots.map((s) => (
            <div key={s.id} className="space-y-3">
              <div className={cn(
                "flex items-center justify-between border-b border-dashed pb-2",
                isLightMode ? "border-slate-200" : "border-white/10"
              )}>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-black px-2.5 py-1 rounded-md text-white font-sans",
                    s.logoBg
                  )}>
                    {s.title}
                  </span>
                  <span className={cn("px-2 py-0.5 rounded border font-bold text-[9.5px]", s.badgeColor)}>
                    {s.badgeText}
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-widest select-none">
                  EVIDENCE SNAPSHOT · CH-{s.id}
                </span>
              </div>
              <GaiInferenceHubWindow data={s.data} isLightMode={isLightMode} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {screenshots.map((s) => (
            <div 
              key={s.id}
              onClick={() => setActiveHubMetric(s.id)}
              className={cn(
                "rounded-xl overflow-hidden font-sans flex flex-col hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] cursor-pointer group transition-all duration-300 border",
                isLightMode 
                  ? "bg-slate-50 border-slate-200 hover:border-indigo-500/40" 
                  : "bg-[#131522] border-white/10 hover:border-indigo-500/40"
              )}
            >
              {/* Header */}
              <div className={cn(
                "flex items-center justify-between px-4 py-3 border-b select-none",
                isLightMode ? "bg-slate-100/85 border-slate-200" : "bg-[#0e101b] border-white/5"
              )}>
                <div className="flex items-center gap-2">
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white font-extrabold shadow-sm font-mono", s.logoBg)}>
                    {s.logoChar}
                  </span>
                  <span className={cn(
                    "text-xs font-bold transition-colors",
                    isLightMode ? "text-slate-700 group-hover:text-slate-900" : "text-slate-200 group-hover:text-white"
                  )}>{s.title}</span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                {/* Highlighted Text Panel Preview */}
                <div className={cn(
                  "rounded-lg p-3.5 text-[11.5px] leading-relaxed tracking-wide flex-1 border",
                  isLightMode 
                    ? "bg-white border-slate-100 text-slate-600" 
                    : "bg-[#0b0c13] border-white/5 text-slate-400"
                )}>
                  <div className={cn(
                    "mb-2 font-bold font-sans line-clamp-2",
                    isLightMode ? "text-slate-800" : "text-slate-300"
                  )}>
                    Q: {s.data.question}
                  </div>
                  <div className={cn(
                    "h-px my-2",
                    isLightMode ? "bg-slate-100" : "bg-white/5"
                  )}></div>
                  <p className={cn(
                    "italic line-clamp-4 leading-relaxed text-[11.5px] select-none",
                    isLightMode ? "text-slate-500" : "text-slate-400"
                  )}>
                    A: ...{s.data.answerSegments.map(seg => seg.text).join('').slice(0, 160)}...
                  </p>
                </div>
                
                {/* Stats & Checkmarks */}
                <div className={cn(
                  "flex justify-between items-center text-[10px] font-mono border-t pt-3 select-none",
                  isLightMode ? "border-slate-150 text-slate-500" : "border-white/5 text-slate-500"
                )}>
                  <span className={cn("px-2 py-0.5 rounded border font-bold text-[9.5px]", s.badgeColor)}>
                    {s.badgeText}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1 font-bold group-hover:underline",
                    isLightMode ? "text-indigo-650 text-indigo-650" : "text-indigo-400"
                  )}>
                    <ZoomIn className="w-3.5 h-3.5 animate-pulse" />
                    点击进入推理沙盒
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Hub Modal Injection */}
      {!isStatic && activeHubMetric && (
        <GaiInferenceHubModal 
          company={activeCompany}
          metricCode={activeHubMetric}
          onClose={() => setActiveHubMetric(null)}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
}
