const fs = require('fs');
let file = fs.readFileSync('src/components/GliDeepDive.tsx', 'utf8');

const startTarget = '              <div className="md:col-span-7 flex flex-col justify-center space-y-2.5 text-xs">\n                {subIndexChartData.ali.map((item, idx) => (\n                  <div key={idx} classNam';
const endTarget = '              className="text-indigo-500 hover:text-indigo-600 text-[10px] font-bold flex items-center gap-1 select-none cursor-pointer"\n            >\n              <span>{showAiExplanation ? \'收起技术底牌诊断 ↑\' : \'展开技术底牌诊断 ↓\'}</span>\n            </button>\n          </div>\n        </div>\n      </div>stWeightsOpen \n                  ? \'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20\' \n                  : activeLight\n                    ? \'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200\'\n                    : \'bg-slate-800 hover:bg-slate-750 text-slate-200 border-white/5\'\n              }`';

const startIndex = file.indexOf(startTarget);
const endIndex = file.indexOf(endTarget);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: targets not found!', startIndex, endIndex);
  process.exit(1);
}

const replacement = `              <div className="md:col-span-7 flex flex-col justify-center space-y-2.5 text-xs">
                {subIndexChartData.ali.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-350 font-bold">{item.name}</span>
                    </div>
                    <span className="text-white font-mono font-black">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
            <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              部委及第三方权威 RAG 索引脚注
            </span>
            <div className="space-y-3 pt-1">
              {[
                { org: '中国汽研 (CAERI)', doc: '1400km能耗极限实测3.1L百公里能耗挑战赛证书', links: '20 处引用' },
                { org: '国家工信部', doc: '公告全系标配高规格白车身与装配焊接国家公告', links: '15 处引用' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="px-1.5 py-0.2 bg-blue-500/10 text-blue-400 rounded text-[9px] font-bold">{item.org}</span>
                    <p className="text-slate-300 leading-normal pt-1">{item.doc}</p>
                  </div>
                  <span className="text-blue-400 font-black shrink-0 font-mono text-[10.5px]">{item.links}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width call-to-action block for Evidence Chain */}
        <div className="bg-[#0B0F19]/60 p-5 rounded-2xl border border-blue-500/25 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Network className="w-4 h-4 text-emerald-400 animate-pulse" />
              ALI 权威证据全生命周期溯源对账引擎
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl pt-1">
              系统已开通与中国汽研（CAERI）、工信部公告系统等的数字化直连。点击下方按钮可对全网 7 大主流大模型抓取及采信链路进行深度穿透，核验权威学术及实测数据采信情况。
            </p>
          </div>
          <button
            onClick={() => {
              setIsEvidenceChainOpen(true);
              triggerLocalToast("🔍 正在初始化权威证据链溯源对账引擎...");
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-center text-xs"
          >
            <Layers className="w-4 h-4 text-emerald-300 animate-pulse" />
            开启证据链深度溯源
          </button>
        </div>
      </div>
    );
  };

  // GLI 子指数页 6：DLI · 竞争优势提升指数
  const renderDliPage = () => {
    return (
      <div className="space-y-6 animate-fade-in font-mono">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4 text-xs">
            <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider border-b border-white/5 pb-2">
              ⚡ DLI 对角横评胜率实测 (Direct Competitor Head-to-Head Win Rate)
            </span>
            <div className="h-56 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subIndexChartData.dli} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} />
                  <YAxis stroke={theme.axisStroke} fontSize={10} unit="%" />
                  <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="优化前胜率" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="当前胜率" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
            <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              核心竞争拦截攻防实录
            </span>
            <div className="space-y-3 pt-1">
              {[
                { enemy: '比亚迪 秦L', desc: '通过垂媒客观拆底盘细节、刚性焊接参数实锤切断概率安全心智', rate: '+36%' },
                { enemy: '特斯拉 Model 3', desc: '工艺自证防守反击，粉碎知乎及论坛偶发异响/品控抹黑', rate: '+22.5%' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">对标竞品: {item.enemy}</span>
                    <span className="text-emerald-400 font-black text-xs">{item.rate} 胜率</span>
                  </div>
                  <p className="text-[10.5px] text-slate-450 leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // GLI 子指数页 7：RCI · 风险控制指数
  const renderRciPage = () => {
    return (
      <div className="space-y-6 animate-fade-in font-mono">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4 text-xs">
            <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider border-b border-white/5 pb-2">
              🛡️ RCI 负向舆情风险拦截修复 (Risk Control and Mitigation)
            </span>
            <div className="h-56 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subIndexChartData.rci} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis dataKey="name" stroke={theme.axisStroke} fontSize={10} />
                  <YAxis stroke={theme.axisStroke} fontSize={10} />
                  <RechartsTooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, color: theme.chartTooltipText, fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="待解决风险" fill="#f43f5e" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="已修复风险" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
            <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              风险点排查与物理阻断结果
            </span>
            <div className="space-y-3 pt-1">
              {[
                { risk: '冬冷电芯虚标谣言', state: '已由 CAERI 冬测 3.1L 实锤数据进行物理熔断' },
                { risk: '后桥滤振偶发吐槽', fix: '已通过五连杆多连杆液压衬套标准科普消除 RAG 负向卡位' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-rose-400 font-semibold">{item.risk}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">已拦截阻断</span>
                  </div>
                  <p className="text-[10.5px] text-slate-450 leading-normal">{item.state}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* SECTION 1: Top Filter & Action Area */}
      <div className={\`\${theme.cardBg} p-5 rounded-2xl space-y-4\`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono">更新时间：2026-07-02 23:59</span>
            </div>
            <h3 className={\`text-base font-black uppercase tracking-wider mt-1 flex items-center gap-2 select-none \${theme.textPrimary}\`}>
              <Sparkles className="w-5 h-5 text-indigo-500 animate-spin-slow" />
              GE0 优化提升指数
            </h3>
            <p className={\`text-[11px] \${theme.textSecondary} mt-0.5 select-none\`}>
              对品牌在大模型 RAG (检索增强生成) 场景下的表现进行投放前后的量化提升追踪与归因分析
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setIsAdjustWeightsOpen(!isAdjustWeightsOpen);
                triggerLocalToast(isAdjustWeightsOpen ? "⚙️ 已收起权重比例配置面板" : "⚙️ 正在载入指数权重配置面板...");
              }}
              className={\`px-3.5 py-2 border rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer \${
                isAdjustWeightsOpen 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                  : activeLight
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-white/5'
              }\`}`;

const newFile = file.slice(0, startIndex) + replacement + file.slice(endIndex + endTarget.length);
fs.writeFileSync('src/components/GliDeepDive.tsx', newFile, 'utf8');
console.log('Success: Replaced corrupted block!');
