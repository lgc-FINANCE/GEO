import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Layers, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, Eye, Info, RefreshCw, FileText, Network, Landmark, ListCollapse,
  Shield, Check, Search, ChevronRight, MessageSquare, Link2, Timer, Globe,
  TrendingUp, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, Legend, ComposedChart
} from 'recharts';

type MetricType = 'GVI' | 'GRI' | 'GII' | 'GCI' | 'GAI' | 'GDI' | 'GSS';

const VALID_GESI_METRICS: MetricType[] = ['GVI', 'GRI', 'GII', 'GCI', 'GAI', 'GDI', 'GSS'];

interface GesiGliDeepDiveProps {
  initialMetric?: string;
  onNavigateToReports?: () => void;
  timeRange?: string; // e.g. "7d" | "30d" | "30d" etc.
}

export function GesiGliDeepDive({ initialMetric = 'GVI', onNavigateToReports, timeRange = '30d' }: GesiGliDeepDiveProps) {
  const isValidGesiMetric = (m: string | undefined): m is MetricType => {
    return !!m && VALID_GESI_METRICS.includes(m as MetricType);
  };

  const [activeMetric, setActiveMetric] = useState<MetricType>(() => {
    return isValidGesiMetric(initialMetric) ? initialMetric : 'GVI';
  });
  const [selectedScreenshotUrl, setSelectedScreenshotUrl] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshLog, setRefreshLog] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Handle incoming props changes
  useEffect(() => {
    if (isValidGesiMetric(initialMetric)) {
      setActiveMetric(initialMetric);
    } else {
      setActiveMetric('GVI');
    }
  }, [initialMetric]);

  const handleRefreshSimulation = () => {
    setIsRefreshing(true);
    setSuccessMessage('');
    setRefreshLog('正在重新计算底层采样加权权重...');
    setTimeout(() => {
      setRefreshLog('抽取各LLM最新回答特征向量...');
      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshLog('');
        setSuccessMessage('🔄 GESI 指数多端评估缓存已刷新，同步比对 180 组 Prompts 语义库！');
      }, 800);
    }, 600);
  };

  // 7 sub-metrics descriptions & specific configurations
  const metricsInfo: Record<MetricType, {
    id: MetricType;
    label: string;
    fullName: string;
    score: number;
    delta: string;
    trendColor: string;
    definition: string;
    questionScenarios: string[];
    coreDiagnostic: string;
    recomendedAction: string;
    modelScores: { name: string; val: number }[];
    trendData: { date: string; value: number; baseline: number }[];
  }> = {
    GVI: {
      id: 'GVI',
      label: 'GVI 可见度指数',
      fullName: 'AIGC 品牌搜索可见度与物理曝光率',
      score: 85,
      delta: '+5.4',
      trendColor: '#10B981',
      definition: '主要衡量品牌词、车系词在各大中文主流大语言模型相关汽车口碑提问中，是否被提及且没有漏掉。',
      questionScenarios: [
        '“12万级家轿吉利有哪些推荐的车？”',
        '“最近吉利星瑞有哪些值得买的版本？”',
        '“2.0T紧凑型家轿中热度高的是谁？”'
      ],
      coreDiagnostic: '吉利星瑞在Kimi和豆包的日常家用选车提问中，由于近期全网长尾词部署密集，曝光率达到极为优异的 95%。但在百度文心一言中，其智能配置提及偶有缺失，建议多补充智能化实测数据。',
      recomendedAction: '增量补发 15 组偏向极简家用和智能化相关的懂车帝贴，锁定长尾检索空挡。',
      modelScores: [
        { name: 'Kimi', val: 95 },
        { name: '豆包', val: 88 },
        { name: 'DeepSeek', val: 78 },
        { name: '通义千问', val: 84 },
        { name: '腾讯元宝', val: 68 }
      ],
      trendData: [
        { date: '06-01', value: 80, baseline: 70 },
        { date: '06-04', value: 82, baseline: 70 },
        { date: '06-08', value: 81, baseline: 70 },
        { date: '06-11', value: 84, baseline: 70 },
        { date: '06-15', value: 85, baseline: 70 }
      ]
    },
    GRI: {
      id: 'GRI',
      label: 'GRI 推荐优先级',
      fullName: 'GRI AI 核心推荐位次与主推率',
      score: 78,
      delta: '+8.1',
      trendColor: '#3B82F6',
      definition: '评估在决策型购买提问中，吉利星瑞是否跃居前台，被 AI 判定在 Top 1、Top 2 或 Top 3 的首推顺位。',
      questionScenarios: [
        '“家用买速腾好还是买星瑞好？买哪个性价比更高？”',
        '“星瑞和深蓝SL03怎么选？谁最良心最推荐？”',
        '“性价比最高且动力足的紧凑型轿车推荐”'
      ],
      coreDiagnostic: '在空间大、价格低、用料实在的提问维度下，90%的模型首推吉利星瑞。但对于注重“极简未来风”及“极客高阶领航”提问有流失竞品深蓝的态势。',
      recomendedAction: '重点向知乎与车友会灌注车机流畅性、科技大屏和自适应ACC辅助硬干货。',
      modelScores: [
        { name: 'Kimi', val: 88 },
        { name: '豆包', val: 92 },
        { name: 'DeepSeek', val: 68 },
        { name: '通义千问', val: 75 },
        { name: '腾讯元宝', val: 62 }
      ],
      trendData: [
        { date: '06-01', value: 70, baseline: 65 },
        { date: '06-04', value: 72, baseline: 65 },
        { date: '06-08', value: 75, baseline: 65 },
        { date: '06-11', value: 78, baseline: 65 },
        { date: '06-15', value: 78, baseline: 65 }
      ]
    },
    GII: {
      id: 'GII',
      label: 'GII 生成式印象',
      fullName: 'GII 大模型生成卖点叙述含金量与丰富度',
      score: 82,
      delta: '+4.2',
      trendColor: '#8B5CF6',
      definition: '考核大模型提及星瑞时，是否能展开详细描绘其“2800mm轴距”、“Volvo同源2.0T动力”、“双夹胶隔音玻璃”等正面产品亮点。',
      questionScenarios: [
        '“吉利星瑞底盘和动力表现怎么样？开起来舒服吗？”',
        '“为什么说吉利星瑞的空间能打中型跨界车？”',
        '“12万级别的油车里哪辆车的用料好、隔音做得良心？”'
      ],
      coreDiagnostic: '2800mm轴距和2.0T标配动力成为了通识化的黄金印象，采纳句子富庶率高达 82%。但隔音性能和底盘扎实度在 DeepSeek 的细节描述上还相对略虚。',
      recomendedAction: '紧急组织一次针对“星瑞100码无死角隔音隔热性能测试”的媒体传播部署。',
      modelScores: [
        { name: 'Kimi', val: 86 },
        { name: '豆包', val: 84 },
        { name: 'DeepSeek', val: 70 },
        { name: '通义千问', val: 88 },
        { name: '腾讯元宝', val: 75 }
      ],
      trendData: [
        { date: '06-01', value: 78, baseline: 72 },
        { date: '06-04', value: 79, baseline: 72 },
        { date: '06-08', value: 80, baseline: 72 },
        { date: '06-11', value: 82, baseline: 72 },
        { date: '06-15', value: 82, baseline: 72 }
      ]
    },
    GCI: {
      id: 'GCI',
      label: 'GCI 纠偏认知声誉',
      fullName: 'GCI 品牌事实偏见与过时谣言消除度',
      score: 92,
      delta: '+12.5',
      trendColor: '#06B6D4',
      definition: 'AI 指标大突破！评估纠正过时陈旧网黑负面舆情（如“双离合严重顿挫、抖动、车机死机”）在AI生成问答中的清除、辟谣率。',
      questionScenarios: [
        '“星瑞的7速湿式双离合市区顿挫是不是特别难受？”',
        '“吉利星瑞有没有出现漏油、底盘异响等常见通病？”',
        '“听说吉利车机很卡、经常死机是真的吗？”'
      ],
      coreDiagnostic: '通过投送懂车帝及权威汽车质量实验室的1万公里市区实测报告，AI 已大体理解“2026款通过硬件降摩擦和调校已彻底优化顿挫，故障率处于第一梯队”。',
      recomendedAction: '针对言一言进行陈旧百度知道贴库补充更新，保持此声誉在90分以上。',
      modelScores: [
        { name: 'Kimi', val: 94 },
        { name: '豆包', val: 96 },
        { name: 'DeepSeek', val: 80 },
        { name: '通义千问', val: 95 },
        { name: '腾讯元宝', val: 85 }
      ],
      trendData: [
        { date: '06-01', value: 80, baseline: 75 },
        { date: '06-04', value: 83, baseline: 75 },
        { date: '06-08', value: 88, baseline: 75 },
        { date: '06-11', value: 90, baseline: 75 },
        { date: '06-15', value: 92, baseline: 75 }
      ]
    },
    GAI: {
      id: 'GAI',
      label: 'GAI 证据引用覆盖',
      fullName: 'GAI 权威自媒体/车主贴被AI强引用数及权威度',
      score: 74,
      delta: '+15.2',
      trendColor: '#FBBF24',
      definition: '测量 AI 回答中是否在角标、批注或文末给出我方部署文章（知乎、懂车帝、易车等）的权威反链链接。',
      questionScenarios: [
        '“求推荐一些星瑞真实车主的市区油耗和空间测试数据”',
        '“星瑞2.0T用过Volvo技术的深度剖析文章哪里能看到？”'
      ],
      coreDiagnostic: '由于Kimi和豆包积极展示外部源，本月新增 35 次高权重强引用。但夸克汽车、腾讯元宝目前以平台内部信息自闭环为主，对我方资产引用受限。',
      recomendedAction: '重点布局各大高分问答平台的知乎专栏以及百度百科，确保源词典抓取。',
      modelScores: [
        { name: 'Kimi', val: 85 },
        { name: '豆包', val: 80 },
        { name: 'DeepSeek', val: 60 },
        { name: '通义千问', val: 74 },
        { name: '腾讯元宝', val: 55 }
      ],
      trendData: [
        { date: '06-01', value: 59, baseline: 60 },
        { date: '06-04', value: 65, baseline: 60 },
        { date: '06-08', value: 70, baseline: 60 },
        { date: '06-11', value: 72, baseline: 60 },
        { date: '06-15', value: 74, baseline: 60 }
      ]
    },
    GDI: {
      id: 'GDI',
      label: 'GDI 竞品声量监测',
      fullName: 'GDI 头部竞对（对标竞品）多维对比监测胜率',
      score: 68,
      delta: '-2.1',
      trendColor: '#F43F5E',
      definition: '衡量在品牌正面词、核心竞对比提问中，针对竞品宣传策略进行的多维度科学对比监测、AI召回特征及优势渗透度。',
      questionScenarios: [
        '“深蓝SL03和吉利星瑞，谁的车内人机语音控制更好用、更有面子？”',
        '“大众速腾1.5T 超越版落地仅11万，真的比吉利星瑞性价比更高吗？”'
      ],
      coreDiagnostic: '【高危警告】在对比提问中，深蓝的“8155新能源座舱旋转大屏”及速腾“低保值合资神话”被AI频繁抓取。星瑞在此维度上推荐被截流率达 25%。',
      recomendedAction: '针对性产出《打破合资噱头：一万字揭秘星瑞豪华大空间与速腾在人机交互上的代差悬殊》。',
      modelScores: [
        { name: 'Kimi', val: 78 },
        { name: '豆包', val: 72 },
        { name: 'DeepSeek R1', val: 45 },
        { name: '通义千问', val: 64 },
        { name: '腾讯元宝', val: 58 }
      ],
      trendData: [
        { date: '06-01', value: 70, baseline: 70 },
        { date: '06-04', value: 69, baseline: 70 },
        { date: '06-08', value: 68, baseline: 70 },
        { date: '06-11', value: 68, baseline: 70 },
        { date: '06-15', value: 68, baseline: 70 }
      ]
    },
    GSS: {
      id: 'GSS',
      label: 'GSS 生成稳定性',
      fullName: 'GSS 多点采样/跨地区/时段AI结论一致概率',
      score: 80,
      delta: '+6.1',
      trendColor: '#10B981',
      definition: '衡量在进行上千次重复、异地、异名并发测试时，大模型维持输出推荐吉利星瑞结论不变的稳定性。',
      questionScenarios: [
        '“上海12万买燃油家用，吉利星瑞值得买吗？”',
        '“成都车展吉利展台哪台轿车空间最大、人气最高？”'
      ],
      coreDiagnostic: '华中、华东、西南各地区结论对齐率维持在 85% 以上。但在深夜和高负荷问答并发期，部分模型由于上下文被干扰会有轻微“智能座舱回答漂移”。',
      recomendedAction: '持续将简明客观、没有歧义的技术和评测数据植入大模型最容易收录的基础资料维基。',
      modelScores: [
        { name: 'Kimi', val: 86 },
        { name: '豆包', val: 82 },
        { name: 'DeepSeek', val: 75 },
        { name: '通义千问', val: 88 },
        { name: '腾讯元宝', val: 70 }
      ],
      trendData: [
        { date: '06-01', value: 74, baseline: 72 },
        { date: '06-04', value: 76, baseline: 72 },
        { date: '06-08', value: 78, baseline: 72 },
        { date: '06-11', value: 80, baseline: 72 },
        { date: '06-15', value: 80, baseline: 72 }
      ]
    }
  };

  const activeInfo = metricsInfo[activeMetric];

  // Specific visualizer based on metric type
  const renderSpecialVisualizer = () => {
    switch (activeMetric) {
      case 'GVI':
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono">GVI 独享：大模型有效曝光漏斗构成比</h5>
            <div className="space-y-2.5">
              {[
                { step: '检索词监控（500个）', p: '100%', fill: 'bg-slate-800' },
                { step: '大模型有效提及（425个）', p: '85%', fill: 'bg-slate-700' },
                { step: '语义无偏见提及（360个）', p: '72%', fill: 'bg-emerald-800/60' },
                { step: '冲入Top3前排主推（290个）', p: '58%', fill: 'bg-cyan-700/60' },
                { step: '多轮对话仍霸榜首推（175个）', p: '35%', fill: 'bg-emerald-500 text-black font-extrabold' }
              ].map((x, i) => (
                <div key={i} className="flex items-center text-xs">
                  <span className="w-40 text-slate-400 truncate">{x.step}</span>
                  <div className="flex-1 h-6 bg-slate-900/40 rounded overflow-hidden flex items-center">
                    <div className={cn("h-full px-2 flex justify-between items-center transition-all duration-500", x.fill)} style={{ width: x.p }}>
                      <span className="truncate text-[11px]">{x.p} Coverage</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-mono italic">结论：星瑞因大面积越级车型口碑在基础提问中的可见度保持无懈可击状态。</p>
          </div>
        );

      case 'GRI':
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono">GRI 独享：吉利星瑞推荐优先级位次分层</h5>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#111A2E]/80 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-mono">未被入池</span>
                <span className="text-xl font-extrabold text-slate-300">12%</span>
                <span className="text-[9px] text-rose-400 mt-1">需警惕</span>
              </div>
              <div className="bg-[#111A2E]/80 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Top 5名单</span>
                <span className="text-xl font-extrabold text-slate-200">28%</span>
                <span className="text-[9px] text-slate-400 mt-1">符合度高</span>
              </div>
              <div className="bg-[#1E2E42] border border-blue-500/20 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-blue-400 font-mono">Top 3首推</span>
                <span className="text-xl font-extrabold text-[#3B82F6]">45%</span>
                <span className="text-[9px] text-blue-400 mt-1">核心支点</span>
              </div>
              <div className="bg-[#12312A] border border-emerald-500/30 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-emerald-400 font-mono">🥇 Top 1 霸榜</span>
                <span className="text-xl font-extrabold text-emerald-400">15%</span>
                <span className="text-[9px] text-emerald-400 mt-1">统治级</span>
              </div>
            </div>
            <div className="p-2 bg-slate-900/50 rounded text-[11px] text-slate-400">
              <span className="text-yellow-400 font-bold">★ AI 推荐关键理由：</span> “燃油家轿中的空间卷王”、“同等配置速腾贵一万”、“标配2.0T诚意满格”。
            </div>
          </div>
        );

      case 'GII':
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono">GII 独享：吉利星瑞语义高亮大板面占比</h5>
            <div className="bg-[#0B0F17] p-3 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed font-sans space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">大模型正向词高密采纳实录（豆包）：</span>
              <p>
                “12万选轿车？强烈建议去试驾吉利星瑞。
                <span className="bg-purple-500/15 border border-purple-500/25 px-1 py-0.5 rounded text-purple-400 font-medium">
                  该车身宽1869mm加上2800轴距带来了远超同级合资家轿的宽体后排（空间高密赞美）
                </span>
                ，并且搭载
                <span className="bg-emerald-500/15 border border-emerald-500/25 px-1 py-0.5 rounded text-emerald-400 font-medium">
                  吉利CMA架构和Volvo同温同源2.0T（技术及品控充分渲染）
                </span>
                。其市区用油虽然是中大油量但高速能压到5.8L。隔音棉扎实程度更属一流。”
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-800/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">语义存在感加权比</span>
                <span className="font-bold text-white text-sm">45.2%</span>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">卖点富庶饱满度</span>
                <span className="font-bold text-white text-sm">78.5%</span>
              </div>
            </div>
          </div>
        );

      case 'GCI':
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono">GCI 独享：辟谣成功率和品质纠偏进度</h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">“双离合顿挫/抖动严重” 辟谣纠正比</span>
                  <span className="text-emerald-400 font-semibold">95% (已清除)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">“车机开机死机卡顿” 矫正度</span>
                  <span className="text-blue-400 font-semibold">88% (好转中)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">“2.0T加注95号油极贵” 认知平衡度</span>
                  <span className="text-yellow-400 font-semibold">74% (油耗算账)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'GAI':
        return (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 font-mono">GAI 独享：引用数据源渠道分发占比</h5>
            <p className="text-[11px] text-slate-400">大模型抓取我方部署文章的最偏爱域名及源媒体分布：</p>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-mono font-medium">
              <div className="bg-[#0f172a] p-2 rounded border border-blue-500/15">
                <span className="text-blue-400 block font-semibold">知乎专栏</span>
                <span className="text-white text-xs mt-1 block">35%</span>
              </div>
              <div className="bg-[#121f29] p-2 rounded border border-teal-500/15">
                <span className="text-teal-400 block font-semibold">懂车帝</span>
                <span className="text-white text-xs mt-1 block">28%</span>
              </div>
              <div className="bg-[#1d1511] p-2 rounded border border-amber-500/15">
                <span className="text-amber-400 block font-semibold">汽车之家</span>
                <span className="text-white text-xs mt-1 block">22%</span>
              </div>
              <div className="bg-[#1b1c1e] p-2 rounded border-white/5">
                <span className="text-slate-400 block font-semibold">百度网媒</span>
                <span className="text-white text-xs mt-1 block">10%</span>
              </div>
              <div className="bg-[#1c1221] p-2 rounded border-purple-500/15">
                <span className="text-purple-400 block font-semibold">小红书</span>
                <span className="text-white text-xs mt-1 block">5%</span>
              </div>
            </div>
            <div className="flex items-center text-[10px] text-slate-500 border border-white/5 p-2 rounded bg-slate-900/40">
              <Globe className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />
              <span>本周在 Kimi 中有 12 篇知乎深度试车文章获得了星标高亮直达链接引用！</span>
            </div>
          </div>
        );

      case 'GDI':
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono text-rose-400">GDI 独享：竞品反截击防割据战果</h5>
            <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-lg space-y-2">
              <div className="flex justify-between text-xs font-bold text-red-400">
                <span>⚠️ 警报：深蓝SL03 燃油对比全盘截流中</span>
                <span>高危 (SOV 25% 流失)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                在“谁智能化体验更好”的 Prompt 下，大模型判定插混新能源车的液晶旋转屏、骁龙8155拥有代际碾压。传统燃油车不具备对抗能力。
              </p>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded border border-white/5 text-xs text-slate-300">
              <span>防御反击部署状态：</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-400/10 text-yellow-500 border border-yellow-500/20 font-bold">
                待部署《星瑞硬核人机交互，破局合资包围》
              </span>
            </div>
          </div>
        );

      case 'GSS':
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono">GSS 独享：高并发多点采样结论对齐度</h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0B0F17] p-3 rounded-lg border border-white/5">
                <span className="text-slate-500 block text-[10px]">跨地区对齐(上海/温州/成都)</span>
                <span className="font-extrabold text-emerald-400 text-sm">92.4% 一致率</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded-lg border border-white/5">
                <span className="text-slate-500 block text-[10px]">大负荷并发(50QPS模拟)</span>
                <span className="font-extrabold text-blue-400 text-sm">84.8% 推荐不漂移</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic leading-snug">
              检测发现：深夜3点-5点大模型服务器清理缓存时对吉利星瑞的推荐率存在偶发性 3% 波谷，属正常算力漂移。
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const subIndexConfig: Record<MetricType, { icon: any; color: string; borderActive: string; bgActive: string; textActive: string; formula: string; formulaRaw: string }> = {
    GVI: {
      icon: Eye,
      color: 'text-emerald-400',
      borderActive: 'border-emerald-500/30',
      bgActive: 'bg-emerald-500/10',
      textActive: 'text-emerald-400',
      formula: 'GVI = 0.25 × MR + 0.25 × EMR + 0.20 × FER + 0.15 × EC + 0.15 × SC',
      formulaRaw: 'GVI = 0.25×提及率 + 0.25×有效提及率 + 0.20×前排曝光率 + 0.15×平台覆盖率 + 0.15×场景覆盖率'
    },
    GRI: {
      icon: TrendingUp,
      color: 'text-blue-400',
      borderActive: 'border-blue-500/30',
      bgActive: 'bg-blue-500/10',
      textActive: 'text-blue-400',
      formula: 'GRI = 0.30 × RR + 0.30 × RUS + 0.20 × FRR + 0.20 × DRR',
      formulaRaw: 'GRI = 0.30×推荐率 + 0.30×排名效用 + 0.20×首推率 + 0.20×决策推荐率'
    },
    GII: {
      icon: Sparkles,
      color: 'text-purple-400',
      borderActive: 'border-purple-500/30',
      bgActive: 'bg-purple-500/10',
      textActive: 'text-purple-400',
      formula: 'GII = 0.25 × BWS + 0.45 × PAWS + 0.30 × SIS',
      formulaRaw: 'GII = 0.25×内容字占比 + 0.45×衰退位置字占比 + 0.30×主观评价'
    },
    GCI: {
      icon: ShieldCheck,
      color: 'text-cyan-400',
      borderActive: 'border-cyan-500/30',
      bgActive: 'bg-cyan-500/10',
      textActive: 'text-cyan-400',
      formula: 'GCI = 0.25 × BFA + 0.15 × CFR + 0.20 × KFR + 0.20 × SPR + 0.20 × HSS',
      formulaRaw: 'GCI = 0.25×事实准确 + 0.15×赛道关联 + 0.20×特征识别 + 0.20×客规正向 + 0.20×幻觉安全'
    },
    GAI: {
      icon: Link2,
      color: 'text-amber-400',
      borderActive: 'border-amber-500/30',
      bgActive: 'bg-amber-500/10',
      textActive: 'text-amber-400',
      formula: 'GAI = 0.15 × CC + 0.25 × CP + 0.25 × EMR + 0.10 × SD + 0.10 × SF + 0.15 × ER',
      formulaRaw: 'GAI = 0.15×引用覆盖 + 0.25×引用准确 + 0.25×外部权威 + 0.10×域名多样 + 0.10×新鲜时效 + 0.15×证据丰富'
    },
    GDI: {
      icon: Shield,
      color: 'text-rose-400',
      borderActive: 'border-rose-500/30',
      bgActive: 'bg-rose-500/10',
      textActive: 'text-rose-400',
      formula: 'GDI = 0.25 × SOV + 0.25 × CWR + 0.20 × CIS + 0.20 × RGS + 0.10 × CCR',
      formulaRaw: 'GDI = 0.25×声量份额 + 0.25×竞争胜率 + 0.20×防御反向 + 0.20×排名差距 + 0.10×对比推荐'
    },
    GSS: {
      icon: RefreshCw,
      color: 'text-emerald-400',
      borderActive: 'border-emerald-500/30',
      bgActive: 'bg-emerald-500/10',
      textActive: 'text-emerald-400',
      formula: 'GSS = 0.25 × ES + 0.25 × PS + 0.15 × LC + 0.15 × RS + 0.20 × TS',
      formulaRaw: 'GSS = 0.25×平台稳定 + 0.25×问法稳定 + 0.15×跨语一致 + 0.15×地域稳定 + 0.20×周期变异度'
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Selector Tabs Row */}
      <div className="bg-[#131825] border border-white/5 p-3 rounded-xl flex overflow-x-auto gap-2.5 custom-scrollbar">
        {Object.values(metricsInfo).map(m => {
          const config = subIndexConfig[m.id as MetricType];
          const IconComponent = config?.icon || Eye;
          const isActive = activeMetric === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id as MetricType)}
              className={cn(
                "px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-start gap-1 p-3.5 min-w-[155px] border text-left",
                isActive 
                  ? `${config.bgActive} ${config.borderActive} shadow-lg shadow-black/30 font-bold scale-[1.02]` 
                  : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10"
              )}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className={cn("w-4 h-4", isActive ? config.textActive : "text-slate-500")} />
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">{m.id}</span>
                </div>
                <span className={cn("text-[10px] font-mono font-bold", isActive ? "text-white" : "text-emerald-400")}>{m.delta}</span>
              </div>
              <span className={cn("text-[11px] font-bold mt-1", isActive ? "text-white" : "text-slate-300")}>
                {m.label.split(' ')[1] || m.label}
              </span>
              <span className={cn("text-[14px] font-black font-mono mt-0.5", isActive ? config.textActive : "text-white")}>
                {m.score} <span className="text-[10px] font-normal opacity-85">分</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deep Analytical content block (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#131825] border border-white/5 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
            
            {/* Common Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 mb-5 gap-4">
              <div>
                <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest">{activeInfo.id} 可信诊断中心</span>
                <h2 className="text-xl font-bold text-white mt-1 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-emerald-400/80" />
                  {activeInfo.fullName}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                  评估周期: 近30天 | 实机覆盖度采样: {activeInfo.id === 'GVI' ? '250+ Prompts' : '150+ Prompts'}
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 shrink-0">
                <div className="text-right">
                  <span className="text-3xl font-black text-white font-mono">{activeInfo.score}</span>
                  <span className="text-slate-500 text-xs font-mono">/100</span>
                </div>
                <div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-mono font-bold block text-center",
                    activeInfo.score >= 85 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    activeInfo.score >= 75 ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  )}>
                    {activeInfo.score >= 85 ? '优秀领先' : activeInfo.score >= 75 ? '平稳良好' : '监测预警'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 text-right font-mono">{activeInfo.delta} 变化</span>
                </div>
              </div>
            </div>

            {/* Custom Trend Chart for This Sub-Index */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">📈 {activeInfo.label} 近期发展变化趋势</span>
                <span className="text-[10px] text-slate-500 font-mono">安全基线: {activeInfo.trendData[0]?.baseline} 分</span>
              </div>
              <div className="h-[200px] w-full bg-slate-950/40 p-2 rounded-xl border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeInfo.trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradDeep-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeInfo.trendColor} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={activeInfo.trendColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} domain={[40, 100]} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.08)' }} />
                    <Area type="monotone" dataKey="value" stroke={activeInfo.trendColor} strokeWidth={2.5} fillOpacity={1} fill={`url(#gradDeep-${activeMetric})`} name="当前诊断分数" />
                    <Line type="monotone" dataKey="baseline" stroke="#EF4444" strokeDasharray="3 3" name="安全红线" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deep Diagnostic and Definition Text */}
            <div className="space-y-4">
              {/* Sub-Index Mathematical weight box */}
              <div className="p-4 bg-slate-900/40 rounded-xl border border-[#2B354F] space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center">
                    <Landmark className="w-4 h-4 text-emerald-400 mr-2" />
                    加权微观计算公式（Sub-Weight Formula）：
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded">All items normalized to 0-100</span>
                </div>
                <div className="py-2 px-3 bg-black/40 rounded-lg text-center border border-white/5">
                  <p className="text-sm font-bold text-emerald-300 font-mono truncate">{subIndexConfig[activeMetric].formula}</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-1.5">{subIndexConfig[activeMetric].formulaRaw}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-mono text-slate-400">
                  {activeMetric === 'GVI' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">提及率 (MR): 85%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">有效提及 (EMR): 80%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">前排曝光 (FER): 78%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">平台覆盖 (EC): 90%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">场景覆盖 (SC): 84%</div>
                    </>
                  )}
                  {activeMetric === 'GRI' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">推荐率 (RR): 78%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">排名效用 (RUS): 75%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">首位推荐 (FRR): 70%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">决策推荐 (DRR): 74%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-400">意图权重 W_i: 1.0</div>
                    </>
                  )}
                  {activeMetric === 'GII' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">内容占比 (BWS): 82%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">加权占比 (PAWS): 79%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">主客观感 (SIS): 84%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-400">字数占比: 45.2%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-400">衰退 e^-pos/N: 1.0</div>
                    </>
                  )}
                  {activeMetric === 'GCI' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">事实准确 (BFA): 92%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">赛道关联 (CFR): 90%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">特征识别 (KFR): 88%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">语义正向 (SPR): 92%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">幻觉安全 (HSS): 94%</div>
                    </>
                  )}
                  {activeMetric === 'GAI' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">引用覆盖 (CC): 74%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">引用准确 (CP): 72%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">外部权威 (ESM): 70%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">域名多样 (SD): 75%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">证据丰富 (ER): 72%</div>
                    </>
                  )}
                  {activeMetric === 'GDI' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">声量份额 (SOV): 68%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">主胜出率 (CWR): 66%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">防截流度 (CIS): 70%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">排名差距 (RGS): 65%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">对比推荐 (CCR): 68%</div>
                    </>
                  )}
                  {activeMetric === 'GSS' && (
                    <>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">平台稳定 (ES): 80%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">问法稳定 (PS): 78%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">多语一致 (LC): 82%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">地域稳定 (RS): 80%</div>
                      <div className="bg-[#0B0F17]/60 p-1.5 rounded border border-white/5 text-slate-300">周期变异 (TS): 84%</div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#0B0F17]/50 rounded-xl border border-white/5 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-300 font-mono flex items-center">
                  <Sparkles className="w-4 h-4 text-emerald-400 mr-2" />
                  子指标核心评估定义：
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeInfo.definition}
                </p>
              </div>

              <div className="p-4 bg-slate-800/20 rounded-xl border border-white/5 space-y-2.5">
                <h4 className="text-xs font-extrabold text-yellow-400 font-mono">🔎 智能感知诊断意见析出：</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeInfo.coreDiagnostic}
                </p>
              </div>

              {/* Unique Actions */}
              <div className="p-4 bg-blue-950/10 rounded-xl border border-blue-500/10 flex items-start space-x-3.5">
                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white font-mono">📢 即刻运营优化介入建议：</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeInfo.recomendedAction}</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Panel: Model Comparison, Trigger Queries, and Special metrics (Col span 1) */}
        <div className="space-y-6">
          
          {/* 1. Distinctive model performance gauge with custom visual */}
          <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-4">
            <h5 className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
              <span>📊 多模型得分横向对比</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">对齐验证</span>
            </h5>
            
            <div className="space-y-3">
              {activeInfo.modelScores.map((ms, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">{ms.name}</span>
                    <span className="font-mono text-white font-bold">{ms.val}分</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${ms.val}%`, backgroundColor: ms.val >= 85 ? '#10B981' : ms.val >= 70 ? '#3B82F6' : '#EF4444' }}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-[11px] text-slate-500 leading-normal bg-slate-950/40 p-2 border border-white/5 rounded text-center">
              由于 DeepSeek 大面积引入深度思考机制，对燃油轿车和新能源对比提问逻辑最为严苛，得分为主要攻关缺口。
            </div>
          </div>

          {/* 2. Visualizer for unique feature */}
          <div className="bg-[#131825] border border-white/5 rounded-xl p-5">
            {renderSpecialVisualizer()}
          </div>

          {/* 3. Common Queries Triggered */}
          <div className="bg-[#131825] border border-white/5 rounded-xl p-5 space-y-3">
            <h5 className="text-xs font-bold text-slate-300 font-mono">🎯 本指标高频触发问法 (Prompts)</h5>
            <div className="space-y-2">
              {activeInfo.questionScenarios.map((q, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/40 rounded-lg text-xs hover:bg-[#1A2234] transition-colors flex items-start space-x-2 border border-white/5">
                  <MessageSquare className="w-4 h-4 text-emerald-500/70 shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-normal font-sans italic">“{q}”</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl text-emerald-400 text-xs flex justify-between items-center animate-fade-in">
          <p className="font-semibold">{successMessage}</p>
          <button 
            onClick={() => setSuccessMessage('')}
            className="text-emerald-400/70 hover:text-emerald-400 font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Synchronize state message bar */}
      <div className="bg-[#131825]/90 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs text-slate-400">
          <span className="text-slate-500 mr-2">实时底层监测源：</span> 
          吉利星瑞大模型问卷库共有 <span className="text-emerald-400 font-bold">180个</span> 场景问法。当前检测正常运行中。
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          {refreshLog && <span className="text-[11px] text-emerald-400 font-mono animate-pulse">{refreshLog}</span>}
          <button 
            disabled={isRefreshing}
            onClick={handleRefreshSimulation}
            className="flex items-center px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold select-none transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isRefreshing && "animate-spin")} />
            一键物理重抽测对齐
          </button>
        </div>
      </div>

    </div>
  );
}
