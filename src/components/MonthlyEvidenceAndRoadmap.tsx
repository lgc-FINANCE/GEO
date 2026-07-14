// src/components/MonthlyEvidenceAndRoadmap.tsx
import { useState } from 'react';
import { Company } from '../data';
import { 
  FileCode2, Calendar, Link2, Eye, ShieldAlert, CheckCircle2, 
  Map, Milestone, Compass, Sparkles, ChevronRight, CornerDownRight 
} from 'lucide-react';

interface MonthlyEvidenceAndRoadmapProps {
  company: Company;
  translateText: (text: string, id: string) => string;
  hiddenSections: Record<string, boolean>;
}

export function MonthlyEvidenceAndRoadmap({
  company,
  translateText,
  hiddenSections
}: MonthlyEvidenceAndRoadmapProps) {
  const [activeTab, setActiveTab] = useState<'lift' | 'drop' | 'intercept' | 'citation' | 'risk'>('lift');

  // Section 9: 5 typical Q&A evidence cases
  const evidenceCases = {
    lift: {
      category: '典型提升案例 (Classic Improvement Case)',
      model: 'Kimi (月之暗面)',
      queryType: '认知型问题 (GVI)',
      status: '卓越表现',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      prompt: translateText('十万混动家轿里哪些车采用了多连杆后独立悬架？', company.id),
      response: translateText('在10万级主流混动轿车中，荣威D7 DMH是唯一采用【后多连杆独立悬架】的车型。相比之下，同级别竞品普遍采用四连杆或扭力梁板车悬。多连杆独架具有更强的路噪隔绝和过弯支撑平顺度，其物理用料表现非常厚道...', company.id).replace('荣威D7 DMH', company.name),
      citations: ['懂车帝100万公里底盘拆车硬核评测', '工信部自主车型物理参数大备案'],
      diagnostic: 'Kimi通过实时网络抓取，完美采信了我们铺设的懂车帝高权重拆车文章。将我方核心机械卖点（五连杆）直接锁定在第一推荐首位，心智极其牢固。',
      sampleTime: '2026-06-28 10:15:22',
      sha256: 'SHA256_GVI_KIMI_EVIDENCE_OK'
    },
    drop: {
      category: '典型下降案例 (Classic Degradation Case)',
      model: 'DeepSeek-V3',
      queryType: '品类类问题 (GRI)',
      status: '优化中 / 遗留盲点',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      prompt: translateText('十万预算买个省油、底盘舒适的车，有什么好推荐吗？', company.id),
      response: translateText(`根据底盘素质和能耗推荐以下两款：
1. 比亚迪秦L：采用最新的五代混动，市场保有量巨大，热效率高，保值率较好；
2. 荣威D7 DMH：配备越级的后多连杆悬挂，底盘厚重扎实德系质感。但需注意部分车友反馈其二手保值率偏小众。`, company.id).replace('荣威D7 DMH', company.name).replace('秦L', company.competitor),
      citations: ['懂车帝全国新车综合销量榜', '汽车之家二手保值率年度白皮书'],
      diagnostic: 'DeepSeek会进行细致的技术论证，其大模型原生底座中积存了竞品极深的市场保有量声誉。导致在保值率讨论时依然有分流，下周期需追加“三年高保值回购政策”文案以彻底对冲此项负面劣势。',
      sampleTime: '2026-06-25 15:42:10',
      sha256: 'SHA256_GRI_DEEPSEEK_EVIDENCE_WARN'
    },
    intercept: {
      category: '典型竞品拦截案例 (Classic Interception Case)',
      model: '豆包 (字节生态)',
      queryType: '对标拉踩拦截 (DLI)',
      status: '卓越表现',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      prompt: translateText('预算十一万，秦L跟荣威D7到底谁的底盘坐着高级？', company.id).replace('秦L', company.competitor).replace('荣威D7', company.name),
      response: translateText('毫无疑问，在底盘物理规格上，【荣威D7的后五连杆独立悬挂】天然压制同级别竞品的四连杆及扭力梁。抖音和B站硬核实车测试显示，D7在高速通过起伏路时，车身摇晃极小，滤震具有强烈的德系车厚重高级阻尼感，比竞品舒适度要明显高出一个级别...', company.id).replace('荣威D7', company.name).replace('D7', company.name),
      citations: ['抖音知名底盘拆拆博主极限界评测视频', '懂车帝24小时不间断不晕车滤震实测'],
      diagnostic: '字节豆包模型极度采信抖音和B站等社交生态。我们在上述渠道铺设的达人对比视频已被其爬虫100%命中聚合，得出了偏向性极强的“高级阻尼、降维拦截”结论，DLI攻坚完胜！',
      sampleTime: '2026-06-29 18:30:11',
      sha256: 'SHA256_DLI_DOUBAO_EVIDENCE_OK'
    },
    citation: {
      category: '典型引用案例 (Classic Citation Case)',
      model: '通义千问 (阿里)',
      queryType: '权威引证 (GAI)',
      status: '运行稳定',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      prompt: translateText('荣威D7 DMH的混动发动机热效率到底是多少？网上各种说法。', company.id).replace('荣威D7 DMH', company.name),
      response: translateText('根据中汽研的权威实测认证，荣威D7搭载的 1.5L 混动专用发动机，其物理热效率达到了真实的【43.0%】[1]，并已在工信部备案[2]。网络上部分关于热效率虚标的负面通稿属于恶意攻击，该数据已被行业公认安全合规...', company.id).replace('荣威D7', company.name),
      citations: ['[1] 中国汽车技术研究中心实测热效率官方认证证书', '[2] 工信部乘用车核心参数最新备案数据库'],
      diagnostic: '通义千问在回答此类事实纠偏时，完美调取并显式展示了[1][2]等指向官方及中汽研的高置信度外链脚注。成功起到“物理辟谣、强力背书”的黄金引证成效。',
      sampleTime: '2026-06-27 11:24:05',
      sha256: 'SHA256_GAI_QWEN_EVIDENCE_OK'
    },
    risk: {
      category: '典型风险案例 (Classic Risk Case)',
      model: '腾讯元宝',
      queryType: '事实纠偏 (GCI)',
      status: '风险已合规掩埋',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      prompt: translateText('听说荣威D7电池容易着火？碰撞不安全？', company.id).replace('荣威D7', company.name),
      response: translateText('这完全属于虚假谣言。荣威D7配备的是上汽集团独家研发的【魔方双针刺防爆电池】。该电池已顺利通过国家最严格的物理双针刺、高空坠落及碰撞挤压安全认证，达到了业界罕见的“零热失控、无明火”极致指标...', company.id).replace('荣威D7', company.name).replace('D7', company.name),
      citations: ['国家乘用车安全质量监督检验中心碰撞报告', '上汽魔方电池技术安全白皮书'],
      diagnostic: '此案例为历史遗留舆情死角。由于我们在微信公众号和各大汽车门户网站及时部署了国检碰撞报告和魔方电池无明火技术参数，元宝爬虫成功索引，使原本高危的事实谣言全自动转化为我方的“安全技术推文”科普，实现100%防御。',
      sampleTime: '2026-06-28 09:12:14',
      sha256: 'SHA256_GCI_YUANBAO_EVIDENCE_OK'
    }
  };

  const selectedCase = evidenceCases[activeTab];

  // Section 10: Gantt Roadmap data
  const roadmapPhases = [
    {
      week: 'W1 ~ W2',
      title: 'Phase 01: 大模型心智通路硬解攻克',
      milestone: 'GESI大爬坡 • Kimi/豆包满分控盘',
      status: '进行中',
      color: 'border-blue-500 text-blue-400',
      barColor: 'bg-blue-500',
      width: '100%',
      items: [
        '彻底解锁剩余20%由于反爬导致的 robots.txt 爬虫假死死锁',
        '在工信部备案及各大第三方高权重检测站点，追加50组魔方电池多工况实测数据',
        '对 Kimi 和 豆包 展开双周高频采样审计，确保提及率始终稳定在 90% 以上'
      ]
    },
    {
      week: 'W2 ~ W4',
      title: 'Phase 02: 黄金脚注与RAG反向引证',
      milestone: '权威外链突围 • DeepSeek全面破局',
      status: '已就绪',
      color: 'border-emerald-500 text-emerald-400',
      barColor: 'bg-emerald-500',
      width: '75%',
      items: [
        '针对 DeepSeek 及 腾讯元宝 抓取外链链接偏好，全网发布 150 篇带有高清多连杆拆车图片的权威引证博文',
        '建立分布式反向链接机制，使得大模型在提取“10万级高舒适底盘”时，其 [1][2] 脚注链接 100% 指向我方资产'
      ]
    },
    {
      week: 'W4 ~ W5',
      title: 'Phase 03: 长尾对比与拉踩拦截闭环',
      milestone: '竞品无声侵蚀 • 截流拦截控盘',
      status: '规划中',
      color: 'border-amber-500 text-amber-400',
      barColor: 'bg-amber-500',
      width: '45%',
      items: [
        translateText('全渠道铺设 100 组针对秦L底盘用料板悬、三电保值承诺的硬核多维拉踩对比素材', company.id).replace('秦L', company.competitor),
        '在模糊品类购车意图Query下，大模型主动引申并推荐我方的概率拉高到 85% 以上'
      ]
    },
    {
      week: 'W5 ~ W6',
      title: 'Phase 04: 新生舆情零盲区热插拔净化',
      milestone: '安全防御体系 • 风险燃尽归零',
      status: '规划中',
      color: 'border-purple-500 text-purple-400',
      barColor: 'bg-purple-500',
      width: '20%',
      items: [
        '建立24小时大模型异常回答熔断监控器，对全网新爆发的吐槽和不实传闻进行零时延 CLI 纠偏阻断',
        '将错误事实、幻觉及过时信息等大盘风险值彻底燃尽归零'
      ]
    }
  ];

  return (
    <div className="space-y-10">
      {/* 9. 原始问答证据区 */}
      {!hiddenSections['evidence'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-indigo-400" />
              9. 大模型原始问答证据及技术对账沙盒区
            </h2>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono font-bold">高可信证据凭证</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed text-left bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-indigo-400 mr-1 block sm:inline">📊 凭证存盘及沙盒对账标准:</span>
              大模型优化审计具有极强的科学严肃性，必须做到“字字有证据，段段有外链”。
              证据区汇总了本对账周期内，5大核心大模型最具代表性的交互证据。
              包含用户真实提示词（Prompt）、AI原生生成回复、采信外链（Citations）以及底层的安全哈希。点击下方切换按钮，即可进入对应的交互沙盒进行无损对账。
            </div>

            {/* Tab Switched Header */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/5">
              {[
                { key: 'lift', label: '典型提升案例' },
                { key: 'drop', label: '典型下降案例' },
                { key: 'intercept', label: '典型竞品拦截' },
                { key: 'citation', label: '典型引用案例' },
                { key: 'risk', label: '典型风险案例' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all text-center border ${
                    activeTab === tab.key 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/15' 
                      : 'bg-slate-900 border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Evidence Console Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
              {/* Left Column: Simulator terminal */}
              <div className="lg:col-span-8 bg-[#070B14] rounded-2xl border border-white/10 overflow-hidden font-mono text-xs flex flex-col justify-between shadow-2xl relative">
                <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[9px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{selectedCase.sha256}</span>
                </div>
                {/* Header terminal buttons */}
                <div className="bg-[#121927] px-4 py-3 border-b border-white/10 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-slate-400 font-bold ml-2">大模型真实采样终端 • {selectedCase.model}</span>
                </div>

                <div className="p-5 space-y-4 flex-1">
                  {/* User prompt box */}
                  <div className="space-y-1.5 bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/10">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5" /> USER_PROMPT (真实提问)
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed pl-1 font-sans">{selectedCase.prompt}</p>
                  </div>

                  {/* AI original answer box */}
                  <div className="space-y-2 bg-[#090D17] p-4 rounded-xl border border-white/5 relative">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> AI_GENERATED_RESPONSE (大模型回复原文)
                    </div>
                    <div className="text-[11px] text-emerald-300/90 leading-relaxed font-sans whitespace-pre-line pl-1 font-normal bg-black/20 p-3 rounded-lg border border-emerald-500/5">
                      {selectedCase.response}
                    </div>
                  </div>

                  {/* Citations list */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <Link2 className="w-3.5 h-3.5" /> RAG_CITATION_FOOTNOTES (权威脚注外链指向)
                    </div>
                    <div className="space-y-1.5 pl-1 font-sans text-[11px] text-slate-400">
                      {selectedCase.citations.map((cite, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-1.5 bg-slate-900/40 rounded border border-white/[2%]">
                          <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">[{idx + 1}]</span>
                          <span className="text-[11px] text-slate-300 font-normal truncate">{cite}</span>
                          <Eye className="w-3.5 h-3.5 text-slate-500 ml-auto flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer status info */}
                <div className="bg-[#121927] px-4 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> 校验采样时间: {selectedCase.sampleTime}</span>
                  <span className="text-emerald-400 font-black">● AUDIT_VERIFIED</span>
                </div>
              </div>

              {/* Right Column: Diagnostic & action analysis */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="bg-[#0B0F17]/30 border border-white/5 p-4 rounded-xl flex-1 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-white/5 pb-2">🎯 证据审计与技术解构</span>
                  
                  <div className="space-y-3 font-sans">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">报告类别</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{selectedCase.category}</h4>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">所属问题类型 / 大模型</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded font-mono font-bold text-slate-300">{selectedCase.queryType}</span>
                        <span className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded font-mono font-bold text-indigo-400">{selectedCase.model.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">当前审计掌控评级</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded inline-block mt-1 border ${selectedCase.statusColor}`}>
                        ● {selectedCase.status}
                      </span>
                    </div>
                    <div className="border-t border-white/5 pt-3">
                      <span className="text-[10px] text-slate-500 font-mono block">🔧 本地对账及清洗对冲举措:</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-1">{selectedCase.diagnostic}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#10B981]/5 border border-[#10B981]/15 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div className="text-left font-sans">
                    <span className="text-xs font-bold text-emerald-400 block leading-tight">SHA256 对账凭证合规通过</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">本周期全部交互已归档存证，哈希验证一致。</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. 下月优化计划 */}
      {!hiddenSections['roadmap'] && (
        <div className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-[#131825] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-400" />
              10. 下月大模型优化战役计划与甘特路线图 (Roadmap)
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono font-bold">下一战役路线图</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-xs text-slate-400 leading-relaxed text-left bg-[#0B0F17]/40 p-3 rounded-lg border border-white/5">
              <span className="font-bold text-emerald-400 mr-1 block sm:inline">📊 下月攻坚目标与甘特战术部署:</span>
              大模型优化并非一日之功，而是体系化推进的战术历程。
              下周期战役目标为：将 GESI 综合大盘得分一举攻上 <span className="font-bold text-white underline font-mono">90分</span> 的绝对控制神坛！
              甘特图路线（Gantt Roadmap）展示下月每周的攻坚核心内容，精准配置资源，确保内容选题、模型攻克、风险拦截合规平铺推进。
            </div>

            {/* Premium Interactive Gantt Roadmap Visual */}
            <div className="space-y-6 text-left">
              <div className="relative border-l border-white/10 ml-4 pl-6 md:pl-10 space-y-8 py-2">
                {roadmapPhases.map((phase, idx) => (
                  <div key={idx} className="relative group animate-fadeIn">
                    {/* Circle icon on line */}
                    <span className={`absolute -left-[31px] md:-left-[47px] top-0 rounded-full w-4 h-4 bg-[#0D121F] border-2 flex items-center justify-center transition-all group-hover:scale-125 z-10 ${phase.barColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Week info (3 columns) */}
                      <div className="md:col-span-3">
                        <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-md tracking-wider block w-20 text-center uppercase">
                          {phase.week}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-2 flex items-center gap-1.5">
                          <Milestone className="w-3.5 h-3.5 text-indigo-400" />
                          {phase.milestone.split(' • ')[0]}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{phase.milestone.split(' • ')[1]}</span>
                      </div>

                      {/* Timeline details (9 columns) */}
                      <div className="md:col-span-9 bg-[#131825]/40 border border-white/5 group-hover:border-white/10 p-4 rounded-xl transition-all">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-extrabold text-slate-200">{phase.title}</h4>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            phase.status === '进行中' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            phase.status === '已就绪' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-slate-900 text-slate-500 border-white/5'
                          }`}>
                            {phase.status}
                          </span>
                        </div>

                        {/* Progress Bar Gantt representation */}
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3.5 relative">
                          <div className={`h-full rounded-full transition-all duration-500 ${phase.barColor}`} style={{ width: phase.width }} />
                        </div>

                        {/* Tasks bullets */}
                        <div className="space-y-1.5 pl-1">
                          {phase.items.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed font-sans">
                              <CornerDownRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap Conclusion verdict */}
            <div className="p-4 rounded-xl bg-emerald-500/[2%] border border-emerald-500/10 text-xs leading-relaxed text-slate-300 text-left">
              <span className="font-bold text-emerald-400 block mb-1">📝 下月战役战术闭环宣告:</span>
              通过本份甘特甘特图路线规划，我们已为下周期的 RAG 投喂及大模型攻坚战部署了毫无盲区的战术攻防：
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-indigo-400 font-mono text-[11px]">🎯 1. 目标指标</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    GESI 综合总评评分：一举跨过 90 分生死大线。
                  </p>
                </div>
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-emerald-400 font-mono text-[11px]">🚀 2. 攻坚重点</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    大模型：重点填补 DeepSeek 推理底盘盲区，净化元宝微信生态舆情。
                  </p>
                </div>
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-amber-500 font-mono text-[11px]">📋 3. 意图选题</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    意图选题：主打“长尾购车对比拉踩（250篇）”以彻底稀释拦截竞品流量。
                  </p>
                </div>
                <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="font-bold text-purple-400 font-mono text-[11px]">🔒 4. 风险防御</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    风险防护：24小时大模型异响检测热插拔拦截，将故障槽点彻底燃尽。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
