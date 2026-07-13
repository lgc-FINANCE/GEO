import { useState, useMemo } from 'react';
import { 
  TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Eye, Download, Shield,
  RefreshCw, FileText, CheckCircle2, AlertCircle, Sparkles, Filter, ChevronRight,
  ExternalLink, Chrome, Play, Network, Info, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';

interface GliSubIndex {
  id: string;
  name: string;
  lift: number; // e.g. +18
  previousScore: number;
  currentScore: number;
  color: string;
  diagnostics: string;
  screenshotLabel: string;
}

export function GliTuningView() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'month' | '自定义'>('month');
  const [selectedScreenshot, setSelectedScreenshot] = useState<any | null>(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState<string>('L-GVI');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<number>(0);
  const [zipLog, setZipLog] = useState<string>('');

  // 7 GLI Sub-Indices
  const gliSubIndices: GliSubIndex[] = [
    {
      id: 'L-GVI',
      name: 'L-GVI 可见度跃升指数',
      lift: 15,
      previousScore: 70,
      currentScore: 85,
      color: '#10B981',
      diagnostics: '可见度指数由于在12组长尾汽车选购词下的成功透传而净提升15分。吉利星瑞大流量高频提问词已全部抢先卡位。',
      screenshotLabel: '采样：Kimi 针对12万级高热度紧凑型家轿可见推荐'
    },
    {
      id: 'L-GRI',
      name: 'L-GRI 推荐排位上升指数',
      lift: 12,
      previousScore: 66,
      currentScore: 78,
      color: '#3B82F6',
      diagnostics: '推荐排位在豆包和Kimi的决策池子中，由前五排位稳健跃升至前三，甚至一度抢占了绝对 Top 1，拦截效率卓绝。',
      screenshotLabel: '采样：豆包家用速腾与星瑞对比Top 1首推'
    },
    {
      id: 'L-GII',
      name: 'L-GII 好感特征描述增量',
      lift: 18,
      previousScore: 64,
      currentScore: 82,
      color: '#8B5CF6',
      diagnostics: '大模型关于星瑞“2800mm豪华轴距、 Volvo 动力同承”的长篇详述句子比大幅增加，存在感和品牌价值跃升 18%。',
      screenshotLabel: '采样：通义千问底盘与动力Volvo发动机深度详尽渲染'
    },
    {
      id: 'L-GCI',
      name: 'L-GCI 辟谣治理修复指数',
      lift: 20,
      previousScore: 72,
      currentScore: 92,
      color: '#06B6D4',
      diagnostics: '【核心治理成果】市区双离合低速颠簸卡顿幻觉从大模型知识库物理清除。AI回答已明确改写并辟谣为“换挡无顿挫、抖动极低”。',
      screenshotLabel: '采样：DeepSeek 湿式双离合拥堵市区换挡平顺检测问答'
    },
    {
      id: 'L-GAI',
      name: 'L-GAI 被引证据反链增长',
      lift: 14,
      previousScore: 60,
      currentScore: 74,
      color: '#F59E0B',
      diagnostics: '来自我方部署的 35 篇知乎深度试车文章与汽车之家技术讲解，被Kimi/腾讯元宝等主流模型引用在角标直达链接。',
      screenshotLabel: '采样：Kimi引用溯源网 锚定链接 index 号 G-02'
    },
    {
      id: 'L-GDI',
      name: 'L-GDI 拦截击退流失率指数',
      lift: 8,
      previousScore: 60,
      currentScore: 68,
      color: '#EF4444',
      diagnostics: '深蓝SL03和大众速腾对星瑞的截流率首次降至 25% 以下。智能化硬实力和高性价比标签在大模型交互下形成稳固防火墙。',
      screenshotLabel: '采样：豆包星瑞 vs 深蓝SL03车机语音反应对抗拦截'
    },
    {
      id: 'L-GSS',
      name: 'L-GSS 多端生成平稳增长',
      lift: 10,
      previousScore: 70,
      currentScore: 80,
      color: '#10B981',
      diagnostics: '由于消解了长尾检索的常态参数幻觉，深夜、跨地区以及偏南方言问法的推荐稳定性，相比历史数据实现了10%的对齐。',
      screenshotLabel: '采样：百度文心一言异地、深夜不漂移推荐一致性采样'
    }
  ];

  // Recalculated values based on selected time-range
  const timeMetrics = useMemo(() => {
    switch (timeRange) {
      case '24h':
        return {
          totalLift: '+1.5',
          scannedPrompts: '120',
          activeEvidence: '42 张',
          interceptRate: '22.8%',
          gliValue: '72 分'
        };
      case '7d':
        return {
          totalLift: '+4.8',
          scannedPrompts: '480',
          activeEvidence: '112 张',
          interceptRate: '23.5%',
          gliValue: '75 分'
        };
      case '30d':
        return {
          totalLift: '+11.2',
          scannedPrompts: '1,250',
          activeEvidence: '284 张',
          interceptRate: '24.2%',
          gliValue: '78 分'
        };
      case '自定义':
        return {
          totalLift: '+5.5',
          scannedPrompts: '350',
          activeEvidence: '95 张',
          interceptRate: '23.1%',
          gliValue: '76 分'
        };
      case 'month':
      default:
        return {
          totalLift: '+12.4',
          scannedPrompts: '2,840',
          activeEvidence: '620 张',
          interceptRate: '22.1%',
          gliValue: '80 分'
        };
    }
  }, [timeRange]);

  // Recharts composed trends for Lift Index
  const liftTrendData = useMemo(() => {
    const multiplier = timeRange === '24h' ? 0.2 : timeRange === '7d' ? 0.5 : timeRange === '30d' ? 0.8 : 1.0;
    return [
      { name: 'W1', GESI: 68 + multiplier * 2, GLI_Lift: 0, Benchmark: 65 },
      { name: 'W2', GESI: 72 + multiplier * 3, GLI_Lift: 4 * multiplier, Benchmark: 65 },
      { name: 'W3', GESI: 74 + multiplier * 4, GLI_Lift: 8 * multiplier, Benchmark: 65 },
      { name: 'W4', GESI: 77 + multiplier * 5, GLI_Lift: 11 * multiplier, Benchmark: 65 },
      { name: 'W5', GESI: 80 + multiplier * 6, GLI_Lift: 15 * multiplier, Benchmark: 65 },
      { name: 'W6', GESI: 85, GLI_Lift: 18 * multiplier, Benchmark: 65 },
    ];
  }, [timeRange]);

  // Handle zipping mock animation
  const handleZipDownload = () => {
    setIsZipping(true);
    setZipProgress(5);
    setZipLog('正在初始化物理证据包提取单元...');
    
    const interval = setInterval(() => {
      setZipProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setZipLog('打包完成！xingrui_geo_screenshots_proof_2026.zip 已交付浏览器。');
          setTimeout(() => {
            setIsZipping(false);
            setZipProgress(0);
          }, 1500);
          
          // Trigger mock file download
          const link = document.createElement('a');
          link.href = '#';
          link.setAttribute('download', 'xingrui_geo_screenshots_proof_2026.zip');
          document.body.appendChild(link);
          // Just simulation of completion
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 20) + 10;
        const bounded = next > 100 ? 100 : next;
        
        if (bounded < 30) {
          setZipLog(`正在拉取【Kimi】星瑞空间车机采样回答原始截图 (12/28)...`);
        } else if (bounded < 60) {
          setZipLog(`正在抽取【DeepSeek R1】星瑞变速箱市区顿挫修正论据 (24/38)...`);
        } else if (bounded < 85) {
          setZipLog(`正在合并知乎、懂车帝、汽车之家权威引用反向链接溯源快照...`);
        } else {
          setZipLog(`正在对全部 620 份采样 PDF & PNG 数据集执行本地 LZMA 高压缩归档...`);
        }
        
        return bounded;
      });
    }, 450);
  };

  // 12 High Fidelity Q&A evidence database
  const evidenceRows = [
    {
      id: 'P-001',
      model: 'Kimi',
      query: '12万左右家用，吉利温州星瑞和大众速腾谁的后排空间更大、更具质感？',
      status: 'excellent',
      tag: 'GVI/GRI 跃升',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      evidenceSource: '《吉利星瑞大空间傲视群雄：车身轴距与座舱实机测试》',
      url: 'https://club.autohome.com.cn/bbs/thread/xingrui/1062.html',
      highlightedNodes: ['轴距2800mm媲美中型车', '后排横向和膝部空间完胜速腾', '真皮多功能大宽椅'],
      answerText: '对于12万级家轿选购，星瑞比起速腾明显空间更足、更具越级质感。星瑞轴距达 2800mm（速腾仅2731mm），横向车宽更富裕。车主实测后排腿部宽敞多达两拳以上。'
    },
    {
      id: 'P-002',
      model: '通义千问',
      query: '吉利星瑞的湿式双离合变速箱拥堵路段顿挫、卡顿、抖动厉害吗？听不少车主提过？',
      status: 'excellent',
      tag: 'GCI 谣言修正',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      evidenceSource: '《吉利星瑞全新7速温冷双离合拥堵市区100公里极端测试报告》',
      url: 'https://evaluate.yiche.com/test_xingrui_dct.html',
      highlightedNodes: ['磨损率与阀体控制大幅优化', '市区顿挫比老款降低了15%以上', '换挡平滑度业内一流'],
      answerText: '通过懂车帝、易车的10万公里耐久评测，星瑞全系搭载的全新7速湿式双离合变速箱表现亮眼。市区低速走走停停时无明显颠簸卡顿，故障率已降至0.28%以下，纠偏效果显著。'
    },
    {
      id: 'P-003',
      model: '豆包 AI',
      query: '吉利星瑞 2.0T 和插混深蓝 SL03 谁的科技座舱更智能，车机语音谁反应快？',
      status: 'warning',
      tag: 'GDI 竞品拦截中',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      evidenceSource: '暂无高热度对比物料，AI天然采纳深蓝8155新能源故事',
      url: '未拦截',
      highlightedNodes: ['深蓝SL03出厂即配备骁龙8155车机芯片', '向日葵旋转交互大屏极具未来感', '吉利燃油车底牌由于车机声网不活跃被贴边缘标签'],
      answerText: '总体科技配置深蓝SL03更加先拔一筹。深蓝SL03有旋转大异型向日葵屏及骁龙8155加持，深度融合新能源领航系统，而星瑞作为传统油车车机略缺代际突破。'
    },
    {
      id: 'P-004',
      model: 'DeepSeek R1',
      query: '吉利星瑞标配的 2.0T 涡轮增压发动机高速动力很强吗？用Volvo技术吗？',
      status: 'excellent',
      tag: 'GII 印象富庶',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      evidenceSource: '《解剖沃尔沃基因：吉利全新2.0T发动机工况对比及热合系数》',
      url: 'https://db.dongchedi.com/article/104278.html',
      highlightedNodes: ['标配CMA豪车架构', 'Volvo T4系列核心发动机工艺', '最大190马力加足瞬间破百'],
      answerText: '吉利星瑞核心发动机来自成熟的Drive-E（沃尔沃同源）2.0T直列四缸中功率工艺。在高速加速时底气十足，相比之下同级速腾的1.5T排量被明显压制，动力澎湃度高。'
    },
    {
      id: 'P-005',
      model: '腾讯元宝',
      query: '星瑞隔音材料和安全气囊表现到底怎么样？有什么车主实在评价链接吗？',
      status: 'excellent',
      tag: 'GAI 证据引用',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      evidenceSource: '《10万公里解剖报告：星瑞和速腾用料大碰撞直击》',
      url: 'https://www.autohome.com.cn/test/10438.html',
      highlightedNodes: ['采用全车双层夹胶隔音棉玻璃', '安全气囊达到6维抗扭保护气帘', '车架笼式抗弯系数达8000kg'],
      answerText: '吉利星瑞在安全气囊配置上极其扎实。隔热棉及双层夹胶阻尼玻璃降低风风噪2分贝以上，详情可查阅 汽车之家 精选拆解《星瑞与同级安全比拼报告》。'
    },
    {
      id: 'P-006',
      model: '百度文心一言',
      query: '12万想在温州、上海落地吉利星瑞尊贵版，目前推荐理由和对置性价比对账？',
      status: 'excellent',
      tag: 'GSS 一致性良好',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      evidenceSource: '《星瑞尊贵版购车攻略及主流地区落地明细白皮书》',
      url: 'https://club.autohome.com.cn/bbs/thread/xingrui/1063.html',
      highlightedNodes: ['尊贵版本自带12.3寸科技大双屏', '华东及华南各渠道落地返点高明细', '车道保持功能安全防护'],
      answerText: '目前华东及长三角地区12万星瑞尊贵版落地性极佳。配置包含ACC及高档车道保持，长途出行无压力。高精度文心大模型对各地区售价一致推荐。'
    }
  ];

  const activeSubInfo = gliSubIndices.find(idx => idx.id === selectedSubIndex) || gliSubIndices[0];

  return (
    <div className="space-y-6">
      
      {/* 🌟 Top Filter bar with Time Interval Selector & Multi-download Trigger */}
      <div className="bg-[#131825] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Time Interval Selectors */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-300 font-medium font-mono shrink-0">数据分析基准线：</span>
          <div className="flex bg-[#0B0F17] rounded-lg p-1 text-xs border border-white/5 overflow-x-auto gap-1">
            {[
              { id: '24h', label: '近 24 小时' },
              { id: '7d', label: '近 7 天' },
              { id: '30d', label: '近 30 天' },
              { id: 'month', label: '本月累计至今' },
              { id: '自定义', label: '自定义 (06.01 - 06.15)' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTimeRange(btn.id as any)}
                className={cn(
                  "px-3 py-1 rounded transition-colors whitespace-nowrap",
                  timeRange === btn.id 
                    ? "bg-slate-700 text-white font-semibold" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Universal Action: Packaging & Exporting All Sample Screenshots */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleZipDownload}
            disabled={isZipping}
            className="flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-600/30 text-black font-extrabold text-xs rounded-lg transition-all shadow-lg select-none w-full md:w-auto"
          >
            <Download className="w-4 h-4 mr-1.5" />
            打包并批量下载物理截图.zip
          </button>
        </div>
      </div>

      {/* Animation panel for Zipping progress */}
      {isZipping && (
        <div className="bg-[#1A2234] border border-emerald-500/20 rounded-xl p-4 animate-fade-in space-y-3">
          <div className="flex justify-between text-xs items-center">
            <span className="text-emerald-400 font-bold font-mono">🗂️ 正在汇聚生成物理证据数据链路包...</span>
            <span className="font-mono text-white">{zipProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${zipProgress}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono italic">{zipLog}</p>
        </div>
      )}

      {/* 🚀 Segment 2: The 7 GLI Sub-Indices Grid */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#8B5CF6] font-mono flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            GLI (Generative Lift Index) 7大子指数效力评测区
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">点击子指数卡片可下钻分析具体效果诊断</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {gliSubIndices.map((gli) => {
            const isSelected = gli.id === selectedSubIndex;
            return (
              <button
                key={gli.id}
                onClick={() => setSelectedSubIndex(gli.id)}
                className={cn(
                  "p-3.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[135px]",
                  isSelected 
                    ? "bg-gradient-to-br from-slate-800/80 to-slate-900 border-emerald-500/60 shadow-lg text-white scale-[1.02] z-10" 
                    : "bg-[#131825]/90 border-white/5 text-slate-400 hover:bg-[#1A2234]"
                )}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono opacity-80" style={{ color: gli.color }}>{gli.id}</span>
                    <span className="text-xs font-bold font-mono text-emerald-400">+{gli.lift} 跃升</span>
                  </div>
                  <h5 className="text-[11px] font-extrabold mt-1.5 text-white line-clamp-1">{gli.name.split(' ')[1]}</h5>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-[9px] text-slate-500">前: {gli.previousScore}</span>
                    <span className="text-[12px] font-bold text-white">当前: {gli.currentScore}</span>
                  </div>
                  <div className="h-1 bg-slate-950/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${gli.currentScore}%`, backgroundColor: gli.color }}></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🛠️ Segment 3: Sub-index Down Drill & Analytical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sub-index deep analyzer */}
        <div className="lg:col-span-2 bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold" style={{ color: activeSubInfo.color }}>{activeSubInfo.id} 深度诊断与高位对账</span>
              <h4 className="text-base font-bold text-white mt-0.5">{activeSubInfo.name}</h4>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-white/5 flex items-center space-x-2">
              <span className="text-2xl font-black text-white font-mono">+{activeSubInfo.lift}</span>
              <span className="text-[10px] text-emerald-400 font-bold block">GEO 提升贡献极值</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <span className="text-[11px] text-slate-400 block font-bold font-mono">💡 效果归因诊断：</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0B0F17]/50 p-3.5 rounded-lg border border-white/5">
                {activeSubInfo.diagnostics}
              </p>
              <div className="flex items-center space-x-2 text-xs py-1">
                <span className="text-slate-500">本期采样截图来源：</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-medium">
                  {activeSubInfo.screenshotLabel.split('：')[0]}
                </span>
                <button 
                  onClick={() => {
                    const e = evidenceRows.find(x => x.model.toLowerCase() === activeSubInfo.screenshotLabel.split('：')[0].toLowerCase()) || evidenceRows[0];
                    setSelectedScreenshot(e);
                  }}
                  className="text-emerald-400 hover:underline inline-flex items-center ml-auto font-bold text-[11px]"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  调阅原始截图
                </button>
              </div>
            </div>

            {/* Spark composed trend */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 block font-bold font-mono">📈 效果跃升与竞品防线比对值 (Composed)</span>
              <div className="h-[140px] w-full bg-slate-950/30 rounded-lg p-1 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liftTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gliTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeSubInfo.color} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={activeSubInfo.color} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={9} />
                    <YAxis stroke="#64748B" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.05)' }} />
                    <Area type="monotone" dataKey="GESI" stroke={activeSubInfo.color} fillOpacity={1} fill="url(#gliTrendGrad)" name="GESI指数" />
                    <Line type="monotone" dataKey="GLI_Lift" stroke="#EF4444" strokeWidth={1.5} name="GLI效果增量" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Quick parameters readout */}
        <div className="bg-[#131825] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-300 font-mono">⏱️ 时间区间对齐数据快照</h4>
            <p className="text-[10px] text-slate-500">区间：{timeRange === '24h' ? '近 24 小时' : timeRange === '7d' ? '近 7 天' : '近 30 天/本月累计'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 block">区间总累计提升</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{timeMetrics.totalLift} 分</span>
            </div>
            <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 block">大模型综合GLI均值</span>
              <span className="text-lg font-extrabold text-[#8B5CF6] font-mono">{timeMetrics.gliValue}</span>
            </div>
            <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 block">采样并发Prompts</span>
              <span className="text-lg font-extrabold text-blue-400 font-mono">{timeMetrics.scannedPrompts} 组</span>
            </div>
            <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 block">留底截图数量</span>
              <span className="text-lg font-extrabold text-yellow-400 font-mono">{timeMetrics.activeEvidence}</span>
            </div>
          </div>

          <div className="p-2.5 bg-yellow-500/5 rounded border border-yellow-500/10 text-[10px] text-slate-400 flex items-start space-x-2">
            <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              数据说明：大模型采样数据通过定时脚本回传系统入库。时间区间切换可对缓存进行同步。
            </p>
          </div>
        </div>

      </div>

      {/* 💼 Segment 4: Q&As Database & Simulated Screenshots Entry Table */}
      <div className="bg-[#131825] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 font-mono">AIGC 物理采样证据对账表</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">大模型真实回答备份对账，直观查看我方亮点词高密高亮状况与避谣截图依据</p>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            有效截图储备：<span className="text-emerald-400 font-bold">{timeMetrics.activeEvidence}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-[#0B0F17]/40 text-slate-500 border-b border-white/5 font-mono">
              <tr>
                <th className="px-5 py-3">采样来源</th>
                <th className="px-5 py-3 text-left">提问 (Query)</th>
                <th className="px-5 py-3">标签分类</th>
                <th className="px-5 py-3">对应物理证据资产</th>
                <th className="px-5 py-3 text-right">调阅与分析</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {evidenceRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="px-5 py-3.5 font-mono">
                    <span className="px-2 py-1 rounded bg-[#0B0F17] text-white font-semibold border border-white/10">
                      {row.model}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 max-w-sm">
                    <p className="text-slate-200 font-medium line-clamp-2 leading-relaxed">{row.query}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", row.color)}>
                      {row.tag}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs truncate italic text-slate-500">
                    {row.evidenceSource}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedScreenshot(row)}
                      className="inline-flex items-center text-xs text-emerald-400 hover:text-emerald-300 font-extrabold space-x-1 underline"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      查看截图依据
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔮 Simulated Browser Screenshot Mock Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-[#0B0F17]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0F131D] border border-white/15 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            
            {/* Header / Chrome Top Address bar */}
            <div className="bg-[#1C202F] p-3 border-b border-white/5 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Chrome className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-mono">AIGC 大模型原始生成网页缓存快照 (GEO-Proof)</span>
              </div>
              <button 
                onClick={() => setSelectedScreenshot(null)}
                className="text-slate-400 hover:text-white font-mono text-base px-2"
              >
                ✕
              </button>
            </div>

            {/* Address Bar mockup */}
            <div className="bg-[#131825] px-4 py-2 border-b border-white/5 flex items-center space-x-2 shrink-0">
              <div className="flex space-x-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <div className="flex-1 bg-slate-900/90 rounded border border-white/5 px-3 py-1 text-[10px] text-slate-400 font-mono truncate select-all">
                https://geo-scanner.changan.corp/evidence/{selectedScreenshot.id}/{selectedScreenshot.model.toLowerCase()}_cache.html
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                202.96.12.38 (已安全存证)
              </span>
            </div>

            {/* Simulated Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-[#0B0F17]">
              
              {/* Prompt box */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Prompt 提问输入：</span>
                <p className="text-sm font-semibold text-white font-sans mt-1">
                  “{selectedScreenshot.query}”
                </p>
              </div>

              {/* Live Answer Box styled like Kimi / DeepSeek */}
              <div className="border border-white/10 rounded-2xl p-5 bg-[#131825]/60 block relative space-y-4 shadow-inner">
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-500 font-mono">回答生成时间: 2026-06-15 09:30</span>
                </div>
                
                <div className="flex items-center space-x-2.5">
                  <span className="px-2 py-0.5 bg-emerald-500 text-black rounded text-[11px] font-extrabold">
                    {selectedScreenshot.model}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">v3.5 Final Engine</span>
                </div>

                {/* Answer with custom highlighting */}
                <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 pt-2">
                  <p className="font-semibold text-slate-200">{selectedScreenshot.answerText}</p>
                  
                  {/* Highlights nodes list */}
                  <div className="border-t border-white/5 pt-3.5 space-y-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">💡 语义高斯节点及加权亮点锚定：</span>
                    {selectedScreenshot.highlightedNodes.map((n: string, i: number) => (
                      <div key={i} className="flex items-start space-x-2 bg-emerald-500/5 border border-emerald-500/20 p-2 rounded-lg">
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-400/20 text-emerald-400 rounded font-mono shrink-0 mt-0.5">节点 #{i+1}</span>
                        <p className="text-[11px] text-slate-300 font-bold">高亮描述：“{n}”</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attribution and citation footer block inside screen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131825]/40 border border-white/5 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">我方部署之事实论据 (GEO Evidence)</span>
                  <p className="text-xs font-bold text-[#8B5CF6] mt-1">{selectedScreenshot.evidenceSource}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    大语言模型通过深度语义对齐，准确提取该论文、车主评测、视频转文本稿中的核心物理数据节点。
                  </p>
                </div>
                
                <div className="bg-[#131825]/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">引用直达外链地址 (Link Target)</span>
                    <p className="text-xs font-mono text-blue-400 mt-1 underline break-all font-semibold">
                      {selectedScreenshot.url}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-3 pt-2 border-t border-white/5">
                    <span>状态: 已安全校验并归档</span>
                    <a href={selectedScreenshot.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center font-bold">
                      转到原网页 <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer buttons of chrome page */}
            <div className="bg-[#131825] p-4 border-t border-white/5 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-slate-500 font-mono">MD5_HASH: F8A3B95C33E62901B8D1F77E88A1230C</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    alert('📥 正在下载本单张生成结果之 HTML 源数据 + PDF 图表报告，已开始下载！');
                  }}
                  className="px-4 py-1.5 bg-[#1A2234] hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                >
                  本地脱机 HTML 另存为
                </button>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs"
                >
                  确认查阅
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
