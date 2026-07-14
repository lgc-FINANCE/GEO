import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Database,
  Edit2,
  Eye,
  FileSpreadsheet,
  FileText,
  Layers,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  Unlock,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../lib/utils';
import { EvidenceScreenshots } from './EvidenceScreenshots';

const trendData = [
  { date: '7/07', GESI: 79.6, GLI: 11.2 },
  { date: '7/08', GESI: 81.2, GLI: 11.8 },
  { date: '7/09', GESI: 82.5, GLI: 12.4 },
  { date: '7/10', GESI: 84.1, GLI: 13.1 },
  { date: '7/11', GESI: 85.8, GLI: 13.8 },
  { date: '7/12', GESI: 87.1, GLI: 14.2 },
  { date: '7/13', GESI: 88.0, GLI: 14.8 },
];

const gesiDimensionData = [
  { name: 'AI可见度', base: 80.0, current: 89.2 },
  { name: '推荐优先级', base: 74.8, current: 83.5 },
  { name: '生成式印象', base: 78.2, current: 86.0 },
  { name: '认知与声誉', base: 78.7, current: 91.2 },
  { name: '引用权威', base: 70.4, current: 85.6 },
  { name: '竞争防御', base: 81.0, current: 84.1 },
  { name: '稳定性', base: 90.2, current: 92.0 },
];

const gliContributionData = [
  { name: '可见度提升', lift: 3.1 },
  { name: '推荐提升', lift: 2.4 },
  { name: '印象提升', lift: 1.5 },
  { name: '认知修正', lift: 2.8 },
  { name: '权威证据提升', lift: 3.4 },
  { name: '竞争优势提升', lift: 1.1 },
  { name: '风险控制', lift: 0.5 },
];

const assetData = [
  { name: '真实能耗长测', contribution: 4.2, citations: 7, status: '持续有效' },
  { name: '底盘拆解内容', contribution: 3.5, citations: 6, status: '持续有效' },
  { name: '车主长期口碑', contribution: 2.4, citations: 5, status: '新增进入回答' },
  { name: '噪音与共振纠偏', contribution: 2.0, citations: 4, status: '风险下降' },
  { name: '产品参数与技术页', contribution: 1.6, citations: 3, status: '引用一般' },
  { name: '车机与升级说明', contribution: 1.1, citations: 2, status: '待扩大覆盖' },
];

const questionTypeRows = [
  { type: '认知类', kimi: 94, doubao: 92, deepseek: 90, yuanbao: 88, qianwen: 93 },
  { type: '品类类', kimi: 86, doubao: 82, deepseek: 84, yuanbao: 79, qianwen: 87 },
  { type: '推荐类', kimi: 82, doubao: 74, deepseek: 80, yuanbao: 72, qianwen: 85 },
  { type: '对比类', kimi: 78, doubao: 61, deepseek: 73, yuanbao: 64, qianwen: 81 },
  { type: '决策类', kimi: 80, doubao: 69, deepseek: 76, yuanbao: 68, qianwen: 83 },
  { type: '风险类', kimi: 91, doubao: 84, deepseek: 82, yuanbao: 86, qianwen: 89 },
  { type: '长尾类', kimi: 77, doubao: 71, deepseek: 75, yuanbao: 70, qianwen: 79 },
];

const initialVisibleSections = {
  findings: true,
  snapshot: true,
  trends: true,
  outcomes: true,
  modelMatrix: true,
  competitor: true,
  assets: true,
  keyQuestions: true,
  actions: true,
  logs: true,
  evidence: true,
};

type SectionKey = keyof typeof initialVisibleSections;
type WeeklyStatus = '正常提升' | '小幅波动' | '需要关注' | '高风险';

function getHeatClass(score: number, isLight: boolean) {
  if (score >= 85) return isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/15 text-emerald-300';
  if (score >= 75) return isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-500/15 text-blue-300';
  if (score >= 65) return isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/15 text-amber-300';
  return isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/15 text-rose-300';
}

function AnalysisPanel({
  isLight,
  title = '分析解读',
  conclusion,
  evidence,
  impact,
  action,
}: {
  isLight: boolean;
  title?: string;
  conclusion: string;
  evidence: string;
  impact: string;
  action: string;
}) {
  const labelMap: Record<string, [string, string, string, string]> = {
    '指标概览解读': ['本周状态', '变化来源', '判断边界', '观察重点'],
    '成果数据解读': ['形成成果', '链路位置', '统计口径', '留存检查'],
    '模型表现表解读': ['整体分布', '模型差异', '业务风险', '分模型处理'],
    '竞品对比解读': ['领先项目', '落后项目', '优势是否牢固', '补证动作'],
    '内容资产解读': ['高贡献资产', '采纳原因', '低效表现', '内容安排'],
    '重点问题表解读': ['已改善问题', '未改善问题', '证据缺口', '验收方式'],
    '行动优先级说明': ['排序原则', '任务依据', '执行价值', '复盘规则'],
    '数据质量与复核说明': ['自动完成', '人工复核', '误判风险', '审计要求'],
  };
  const labels = labelMap[title] || ['核心判断', '数据表现', '业务含义', '下一步'];
  const items = [
    { label: labels[0], value: conclusion, className: 'text-indigo-500' },
    { label: labels[1], value: evidence, className: 'text-blue-500' },
    { label: labels[2], value: impact, className: 'text-amber-500' },
    { label: labels[3], value: action, className: 'text-emerald-500' },
  ];

  return (
    <div className={cn(
      'mt-4 rounded-xl border p-4',
      isLight ? 'border-slate-200 bg-slate-50/80' : 'border-white/5 bg-[#0b0f17]/55',
    )}>
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-indigo-500" />
        <strong className={cn('text-xs', isLight ? 'text-slate-800' : 'text-slate-200')}>{title}</strong>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className={cn('rounded-lg border p-3', isLight ? 'border-slate-200 bg-white' : 'border-white/5 bg-slate-900/30')}>
            <span className={cn('block text-[10px] font-black', item.className)}>{item.label}</span>
            <p className={cn('mt-1.5 text-[10.5px] leading-relaxed', isLight ? 'text-slate-600' : 'text-slate-400')}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


function TrendInterpretation({ isLight }: { isLight: boolean }) {
  const start = trendData[0];
  const end = trendData[trendData.length - 1];
  const gesiGain = (end.GESI - start.GESI).toFixed(1);
  const gliGain = (end.GLI - start.GLI).toFixed(1);
  const lastGesiGain = (end.GESI - trendData[trendData.length - 2].GESI).toFixed(1);
  const lastGliGain = (end.GLI - trendData[trendData.length - 2].GLI).toFixed(1);

  const stages = [
    {
      period: '7/07—7/09',
      title: '基础爬升',
      metric: `GESI 79.6→82.5｜GLI 11.2→12.4`,
      detail: '品牌提及和推荐位置缓慢改善，但尚未出现明显加速，属于已有内容被模型逐步吸收的自然增长。',
      tone: 'border-blue-500/20 bg-blue-500/[0.04]',
      badge: 'text-blue-500 bg-blue-500/10',
    },
    {
      period: '7/10—7/11',
      title: '动作释放',
      metric: `GESI 84.1→85.8｜GLI 13.1→13.8`,
      detail: '能耗长测发布、旧负面信息纠偏后，认知、引用和风险指标同步上涨，是本周最值得复核的动作窗口。',
      tone: 'border-indigo-500/20 bg-indigo-500/[0.04]',
      badge: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      period: '7/12—7/13',
      title: '高位放缓',
      metric: `单日 GESI +${lastGesiGain}｜GLI +${lastGliGain}`,
      detail: '指数仍在上升，但GESI斜率开始收窄，说明同类内容的边际收益正在下降，需要更换问题和证据类型。',
      tone: 'border-amber-500/20 bg-amber-500/[0.04]',
      badge: 'text-amber-500 bg-amber-500/10',
    },
  ];

  return (
    <div className={cn('mt-4 rounded-xl border p-4', isLight ? 'border-slate-200 bg-slate-50/80' : 'border-white/5 bg-[#0b0f17]/55')}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <strong className={cn('text-xs', isLight ? 'text-slate-800' : 'text-slate-200')}>曲线分段解读</strong>
        </div>
        <span className="text-[10px] text-slate-500">全周：GESI +{gesiGain}｜GLI +{gliGain}</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <div key={stage.period} className={cn('relative rounded-lg border p-3.5', stage.tone)}>
            <div className="flex items-center justify-between gap-2">
              <span className={cn('rounded px-2 py-0.5 text-[9px] font-bold', stage.badge)}>阶段 {index + 1}</span>
              <span className="text-[9px] text-slate-500">{stage.period}</span>
            </div>
            <h3 className={cn('mt-2 text-xs font-black', isLight ? 'text-slate-900' : 'text-slate-100')}>{stage.title}</h3>
            <p className="mt-1 text-[10px] font-mono text-indigo-400">{stage.metric}</p>
            <p className={cn('mt-2 text-[10.5px] leading-relaxed', isLight ? 'text-slate-600' : 'text-slate-400')}>{stage.detail}</p>
          </div>
        ))}
      </div>

      <div className={cn('mt-3 rounded-lg border px-3 py-2.5 text-[10.5px] leading-relaxed', isLight ? 'border-emerald-100 bg-emerald-50/60 text-slate-700' : 'border-emerald-500/15 bg-emerald-500/[0.04] text-slate-300')}>
        <strong className="text-emerald-500">怎么读这张图：</strong>
        两条曲线同向上涨，说明当前健康度和本周改善效果没有背离；但7月12日后GESI涨速减弱，不能再靠重复发布同类内容“硬拱”分数。下周应换成竞品对比、购买决策和长尾场景内容，并继续标记发布、抓取、首次引用三个时间点，避免把时间上的巧合误写成因果。
      </div>
    </div>
  );
}

function GliContributionInterpretation({ isLight }: { isLight: boolean }) {
  const total = gliContributionData.reduce((sum, item) => sum + item.lift, 0);
  const sorted = [...gliContributionData].sort((a, b) => b.lift - a.lift);
  const topThree = sorted.slice(0, 3);
  const weakItems = sorted.slice(-2);
  const topShare = (topThree.reduce((sum, item) => sum + item.lift, 0) / total * 100).toFixed(1);

  const reasons: Record<string, string> = {
    '权威证据提升': '第三方长测、拆解和车主数据被模型引用，直接抬高证据质量。',
    '可见度提升': '更多问题开始有效提及品牌，新增可见问题数量增加。',
    '认知修正': '噪音、车机等旧信息减少，品牌特征表达更准确。',
    '竞争优势提升': '对比问题中的首推和胜率仍未明显改变。',
    '风险控制': '本周修复了旧风险，但新增风险预防和跨模型稳定性贡献有限。',
  };

  return (
    <div className={cn('mt-4 rounded-xl border p-4', isLight ? 'border-slate-200 bg-slate-50/80' : 'border-white/5 bg-[#0b0f17]/55')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          <strong className={cn('text-xs', isLight ? 'text-slate-800' : 'text-slate-200')}>贡献结构解读</strong>
        </div>
        <span className="text-[10px] text-slate-500">前三项贡献占 {topShare}%</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-2.5 lg:col-span-3">
          {topThree.map((item, index) => {
            const share = item.lift / total * 100;
            return (
              <div key={item.name} className={cn('rounded-lg border p-3', isLight ? 'border-slate-200 bg-white' : 'border-white/5 bg-slate-900/30')}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-[9px] font-black text-indigo-500">{index + 1}</span>
                    <strong className={cn('text-[10.5px]', isLight ? 'text-slate-800' : 'text-slate-200')}>{item.name}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400">{item.lift.toFixed(1)}点 / {share.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800/40">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${share / 25 * 100}%` }} />
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{reasons[item.name]}</p>
              </div>
            );
          })}
        </div>

        <div className={cn('rounded-lg border p-3.5 lg:col-span-2', isLight ? 'border-amber-200 bg-amber-50/60' : 'border-amber-500/15 bg-amber-500/[0.04]')}>
          <span className="text-[10px] font-black text-amber-500">低贡献项不是“没用”，而是“还没形成结果”</span>
          <div className="mt-3 space-y-3">
            {weakItems.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between gap-2">
                  <strong className={cn('text-[10.5px]', isLight ? 'text-slate-800' : 'text-slate-200')}>{item.name}</strong>
                  <span className="text-[10px] font-mono text-amber-500">{item.lift.toFixed(1)}点</span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{reasons[item.name]}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-amber-500/10 pt-3 text-[10.5px] leading-relaxed text-slate-500">
            <strong className="text-emerald-500">资源判断：</strong>
            本周属于“证据驱动型提升”，不是七个维度平均增长。下周不应继续把预算平均分给所有内容，而应优先补竞争对比和风险预防，让低贡献项真正转化为排名和推荐变化。
          </div>
        </div>
      </div>
    </div>
  );
}

function GesiDimensionInterpretation({ isLight }: { isLight: boolean }) {
  const withDelta = gesiDimensionData.map((item) => ({ ...item, delta: item.current - item.base }));
  const largestGain = [...withDelta].sort((a, b) => b.delta - a.delta)[0];
  const highestCurrent = [...withDelta].sort((a, b) => b.current - a.current)[0];
  const lowestCurrent = [...withDelta].sort((a, b) => a.current - b.current)[0];
  const competition = withDelta.find((item) => item.name === '竞争防御');

  return (
    <div className={cn('mt-4 rounded-xl border p-4', isLight ? 'border-slate-200 bg-slate-50/80' : 'border-white/5 bg-[#0b0f17]/55')}>
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-cyan-500" />
        <strong className={cn('text-xs', isLight ? 'text-slate-800' : 'text-slate-200')}>维度结构解读</strong>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className={cn('rounded-lg border p-3.5', isLight ? 'border-emerald-200 bg-emerald-50/60' : 'border-emerald-500/15 bg-emerald-500/[0.04]')}>
          <span className="text-[9px] font-bold text-emerald-500">当前最高</span>
          <strong className={cn('mt-1 block text-sm', isLight ? 'text-slate-900' : 'text-white')}>{highestCurrent.name} {highestCurrent.current.toFixed(1)}</strong>
          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">跨模型和问法的整体表现最稳，是当前结构中的“压舱石”。</p>
        </div>
        <div className={cn('rounded-lg border p-3.5', isLight ? 'border-indigo-200 bg-indigo-50/60' : 'border-indigo-500/15 bg-indigo-500/[0.04]')}>
          <span className="text-[9px] font-bold text-indigo-500">进步最大</span>
          <strong className={cn('mt-1 block text-sm', isLight ? 'text-slate-900' : 'text-white')}>{largestGain.name} +{largestGain.delta.toFixed(1)}</strong>
          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">新增高质量来源显著改善了模型引用依据，是本周最明确的增量来源。</p>
        </div>
        <div className={cn('rounded-lg border p-3.5', isLight ? 'border-amber-200 bg-amber-50/60' : 'border-amber-500/15 bg-amber-500/[0.04]')}>
          <span className="text-[9px] font-bold text-amber-500">当前短板</span>
          <strong className={cn('mt-1 block text-sm', isLight ? 'text-slate-900' : 'text-white')}>{lowestCurrent.name} {lowestCurrent.current.toFixed(1)}</strong>
          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">品牌已被看见，但进入优先推荐的能力仍弱于认知、引用和稳定性。</p>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[620px] text-[10px]">
          <thead>
            <tr className={cn('border-b text-slate-500', isLight ? 'border-slate-200' : 'border-white/5')}>
              <th className="px-2 py-2 text-left">维度</th>
              <th className="px-2 py-2 text-center">基线</th>
              <th className="px-2 py-2 text-center">当前</th>
              <th className="px-2 py-2 text-center">变化</th>
              <th className="px-2 py-2 text-left">含义</th>
            </tr>
          </thead>
          <tbody>
            {withDelta.map((item) => {
              const meaning = item.name === '竞争防御'
                ? '对比问询中的优势增长偏慢。'
                : item.name === '推荐优先级'
                  ? '当前得分最低，应关注首推与前三推荐。'
                  : item.name === '稳定性'
                    ? '分数最高但增幅小，属于高位保持。'
                    : item.delta >= 10
                      ? '本周核心增长来源。'
                      : '稳步改善。';
              return (
                <tr key={item.name} className={cn('border-b', isLight ? 'border-slate-100' : 'border-white/5')}>
                  <td className={cn('px-2 py-2 font-bold', isLight ? 'text-slate-700' : 'text-slate-300')}>{item.name}</td>
                  <td className="px-2 py-2 text-center text-slate-500">{item.base.toFixed(1)}</td>
                  <td className="px-2 py-2 text-center font-bold text-emerald-500">{item.current.toFixed(1)}</td>
                  <td className="px-2 py-2 text-center font-mono text-indigo-400">+{item.delta.toFixed(1)}</td>
                  <td className="px-2 py-2 text-slate-500">{meaning}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={cn('mt-3 rounded-lg border px-3 py-2.5 text-[10.5px] leading-relaxed', isLight ? 'border-cyan-100 bg-cyan-50/60 text-slate-700' : 'border-cyan-500/15 bg-cyan-500/[0.04] text-slate-300')}>
        <strong className="text-cyan-500">结构判断：</strong>
        七个维度都在上涨，但上涨质量并不均衡。引用权威和认知声誉增长最快，说明“模型为什么相信品牌”已经改善；推荐优先级仍是当前最低项，竞争防御仅提升{competition?.delta.toFixed(1)}分，说明真正到了购买对比环节，品牌还没有把认知优势完全换成推荐优势。
      </div>
    </div>
  );
}

export function WeeklyReportView({
  selectedCompany,
  onBack,
}: {
  selectedCompany: any;
  onBack: () => void;
}) {
  const isLight = typeof document !== 'undefined' && !!document.querySelector('.light-mode');
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus>('正常提升');
  const [isReportLocked, setIsReportLocked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [visibleSections, setVisibleSections] = useState(initialVisibleSections);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const currentBrand = selectedCompany?.mainBrand || '荣威D7 DMH';
  const currentCompetitor = selectedCompany?.competitor || '比亚迪秦L';
  const projectName = selectedCompany?.name || currentBrand;

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 2600);
  };

  const handleDownload = (format: 'WORD' | 'PDF') => {
    showToast(`正在生成${format}周报……`, 'info');
    window.setTimeout(() => {
      showToast(`${currentBrand} GEO周报已生成。`, 'success');
    }, 1200);
  };

  const handleToggleLock = () => {
    setIsReportLocked((locked) => !locked);
    showToast(isReportLocked ? '周报已解锁，可继续编辑。' : '周报已锁定，可避免误改。', 'info');
  };

  const handleToggleSection = (section: SectionKey) => {
    if (isReportLocked) {
      showToast('报告已锁定，请先解锁。', 'warning');
      return;
    }
    setVisibleSections((current) => ({ ...current, [section]: !current[section] }));
    showToast('板块显示已更新。');
  };

  const statusOptions: Array<{ value: WeeklyStatus; desc: string; className: string }> = [
    { value: '正常提升', desc: '主要指标同步改善，未发现重大异常。', className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500' },
    { value: '小幅波动', desc: '部分模型出现收录延迟，整体方向不变。', className: 'border-blue-500/30 bg-blue-500/5 text-blue-500' },
    { value: '需要关注', desc: '重点问题出现竞品首推或错误信息。', className: 'border-amber-500/30 bg-amber-500/5 text-amber-500' },
    { value: '高风险', desc: '多个模型同时出现明显负面或事实错误。', className: 'border-rose-500/30 bg-rose-500/5 text-rose-500' },
  ];

  const sectionOptions: Array<{ key: SectionKey; label: string }> = [
    { key: 'findings', label: '关键判断' },
    { key: 'snapshot', label: '指标概览' },
    { key: 'trends', label: '指数与贡献' },
    { key: 'outcomes', label: '本周成果' },
    { key: 'modelMatrix', label: '模型与问题' },
    { key: 'competitor', label: '竞品对比' },
    { key: 'assets', label: '内容资产' },
    { key: 'keyQuestions', label: '重点问题' },
    { key: 'actions', label: '下周计划' },
    { key: 'logs', label: '问题与记录' },
    { key: 'evidence', label: '证据截图' },
  ];

  return (
    <div className={cn(
      'relative space-y-6 p-1 pb-16 text-left transition-colors duration-300',
      isLight ? 'text-slate-800' : 'text-slate-200',
    )}>
      {toast && (
        <div className="fixed right-8 top-24 z-50 rounded-xl border border-indigo-500/30 bg-[#0f172a] px-4 py-2.5 text-xs text-slate-100 shadow-2xl">
          {toast.msg}
        </div>
      )}

      <div className={cn(
        'flex flex-col items-stretch justify-between gap-4 rounded-xl border p-4 md:flex-row md:items-center',
        isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]',
      )}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
              isLight
                ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'border-white/5 bg-[#1e293b] text-slate-300 hover:bg-slate-700',
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            返回交付中心
          </button>
          <div className={cn('h-4 w-px', isLight ? 'bg-slate-200' : 'bg-white/10')} />
          <span className="text-xs">
            监测项目：<strong className={isLight ? 'text-slate-900' : 'text-white'}>{projectName}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex rounded-lg border p-0.5', isLight ? 'border-slate-200 bg-slate-100' : 'border-white/5 bg-[#0f131d]')}>
            <button
              onClick={() => handleDownload('WORD')}
              className={cn('flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-[11px]', isLight ? 'text-slate-600 hover:bg-white' : 'text-slate-300 hover:bg-white/5')}
            >
              <FileText className="h-3 w-3 text-blue-500" />
              下载 Word
            </button>
            <button
              onClick={() => handleDownload('PDF')}
              className={cn('flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-[11px]', isLight ? 'text-slate-600 hover:bg-white' : 'text-slate-300 hover:bg-white/5')}
            >
              <FileSpreadsheet className="h-3 w-3 text-rose-500" />
              下载 PDF
            </button>
          </div>

          <button
            onClick={() => {
              if (isReportLocked) {
                showToast('报告已锁定，请先解锁。', 'warning');
                return;
              }
              setIsEditMode((value) => !value);
            }}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold',
              isEditMode
                ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-400'
                : isLight
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'border-white/5 bg-[#1A2234] text-slate-300 hover:bg-slate-800',
            )}
          >
            <Edit2 className="h-3.5 w-3.5" />
            {isEditMode ? '收起编辑' : '编辑排版'}
          </button>

          <button
            onClick={handleToggleLock}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold',
              isReportLocked
                ? 'border-rose-500/40 bg-rose-500/15 text-rose-500'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
            )}
          >
            {isReportLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            {isReportLocked ? '解锁周报' : '锁定报告'}
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className={cn('rounded-xl border p-4', isLight ? 'border-indigo-100 bg-slate-50' : 'border-indigo-500/30 bg-[#1e1b4b]/20')}>
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
              <Sparkles className="h-3.5 w-3.5" />
              周报板块设置
            </span>
            <span className="text-[10px] text-slate-500">仅控制显示，不改动数据</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {sectionOptions.map((item) => {
              const active = visibleSections[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => handleToggleSection(item.key)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg border p-2 text-left text-xs',
                    active
                      ? isLight
                        ? 'border-indigo-200 bg-indigo-50 font-semibold text-indigo-700'
                        : 'border-indigo-500/30 bg-indigo-500/10 font-semibold text-indigo-200'
                      : isLight
                        ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                        : 'border-white/5 bg-[#11131c] text-slate-500 line-through',
                  )}
                >
                  <span>{item.label}</span>
                  <span>{active ? '✓' : '×'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <header className={cn('border-b py-5 text-center', isLight ? 'border-slate-200' : 'border-white/5')}>
        <h1 className="flex flex-col items-center justify-center gap-2 text-2xl font-black tracking-wide sm:flex-row">
          <span className={isLight ? 'text-slate-900' : 'text-white'}>{currentBrand}</span>
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">GEO 周报</span>
        </h1>
        <p className={cn('mt-1 text-xs', isLight ? 'text-slate-500' : 'text-slate-400')}>
          监测周期：2026年07月07日—07月13日　样本：500组回答　重点问题：145个　模型：5个
        </p>
      </header>

      {visibleSections.findings && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={cn('rounded-xl border p-5 lg:col-span-2', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <h2 className={cn('mb-4 flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <Sparkles className="h-4 w-4 text-indigo-500" />
              本周三项关键判断
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  index: '01',
                  title: '整体健康度已进入稳定提升阶段',
                  body: '当前GESI为88.0，较基线提升8.4分；本周GLI为+14.8，说明优化动作已经同时带动可见、推荐、认知和引用，而不是只有提及次数增加。',
                  note: '后续判断重点应从“有没有被看见”转向“是否被优先推荐、是否有证据支撑”。',
                },
                {
                  index: '02',
                  title: '提升主要由证据与认知修正驱动',
                  body: '权威证据提升、可见度提升和认知修正合计贡献9.3个GLI点，占总提升的62.8%，是本周增长的核心来源。',
                  note: '可核验测试、第三方引用和错误信息纠偏，比单纯增加品牌稿件更有效。',
                },
                {
                  index: '03',
                  title: '高意向问题仍存在模型差异',
                  body: `豆包和腾讯元宝在对比类、决策类问题中表现偏弱，尤其在${currentBrand}与${currentCompetitor}的能耗比较中仍优先采用竞品证据。`,
                  note: '短板不是品牌认知不足，而是同条件对比材料和第三方证据覆盖不足。',
                },
              ].map((item) => (
                <article key={item.index} className={cn('rounded-lg border p-4', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/60')}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-500">{item.index}</span>
                    <span className="text-[9px] text-slate-500">AI自动归纳</span>
                  </div>
                  <h3 className={cn('text-xs font-bold', isLight ? 'text-slate-900' : 'text-slate-100')}>{item.title}</h3>
                  <p className={cn('mt-2 text-[11px] leading-relaxed', isLight ? 'text-slate-600' : 'text-slate-400')}>{item.body}</p>
                  <p className="mt-2 border-t border-white/5 pt-2 text-[10px] leading-relaxed text-indigo-400">{item.note}</p>
                </article>
              ))}
            </div>
            <div className={cn(
              'mt-4 rounded-lg border p-4 text-[11px] leading-relaxed',
              isLight ? 'border-indigo-100 bg-indigo-50/60 text-slate-700' : 'border-indigo-500/15 bg-indigo-500/[0.05] text-slate-300',
            )}>
              <strong className="text-indigo-500">本周执行摘要：</strong>
              本周共分析500组大模型回答，覆盖145个重点问题和5个主流模型。数据表明，{currentBrand}的AI声望健康度继续上升，增长主要来自第三方证据进入回答、核心卖点识别增强以及旧错误信息减少。与此同时，模型间表现并不均衡：通义千问和Kimi整体稳定，豆包与腾讯元宝在对比、决策场景中仍有明显短板。因此，下周不宜继续平均铺设内容，而应集中补强高意向问题的同条件对比证据，并观察新增内容是否形成持续引用。
            </div>
          </div>

          <div className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <h2 className={cn('mb-3 flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <Activity className="h-4 w-4 text-emerald-500" />
              本周状态
            </h2>
            <div className="space-y-2">
              {statusOptions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    if (isReportLocked) {
                      showToast('报告已锁定，请先解锁。', 'warning');
                      return;
                    }
                    setWeeklyStatus(item.value);
                    showToast(`状态已调整为“${item.value}”。`);
                  }}
                  className={cn(
                    'w-full cursor-pointer rounded-lg border p-2.5 text-left',
                    weeklyStatus === item.value
                      ? item.className
                      : isLight
                        ? 'border-slate-200 bg-slate-50 text-slate-500'
                        : 'border-white/5 bg-slate-900/30 text-slate-400',
                  )}
                >
                  <span className="block text-xs font-bold">{item.value}</span>
                  <span className="mt-0.5 block text-[10px] opacity-80">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {visibleSections.snapshot && (
        <section className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <Layers className="h-4 w-4 text-indigo-500" />
              指标概览
            </h2>
            <span className="text-[10px] text-slate-500">与上周同口径比较</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {[
              { label: '基线 GESI', value: '79.6', change: '使用前状态', good: true },
              { label: '当前 GESI', value: '88.0', change: '+8.4', good: true },
              { label: '本周 GLI', value: '+14.8', change: '中度改善', good: true },
              { label: '品牌提及率', value: '84.0%', change: '+6.0%', good: true },
              { label: '前三推荐率', value: '72.0%', change: '+5.5%', good: true },
              { label: '有效引用率', value: '52.0%', change: '+8.0%', good: true },
              { label: '风险问题数', value: '1组', change: '-2组', good: true },
            ].map((item) => (
              <div key={item.label} className={cn('rounded-lg border p-3', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/60')}>
                <span className="block text-[10px] text-slate-500">{item.label}</span>
                <div className="mt-1.5 flex items-end justify-between gap-2">
                  <strong className={cn('text-lg', isLight ? 'text-slate-900' : 'text-white')}>{item.value}</strong>
                  <span className={cn('text-[10px] font-bold', item.good ? 'text-emerald-500' : 'text-rose-500')}>{item.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={cn('mt-3 rounded-lg border px-3 py-2.5 text-[11px] leading-relaxed', isLight ? 'border-indigo-100 bg-indigo-50/60 text-slate-700' : 'border-indigo-500/15 bg-indigo-500/[0.05] text-slate-300')}>
            <strong className="text-indigo-500">指标说明：</strong>
            GESI用于衡量当前AI声望健康度，GLI用于衡量相对基线的改善幅度。提及率回答“是否出现”，前三推荐率回答“是否进入优先选择”，有效引用率回答“回答是否有可信证据支撑”，风险问题数统计仍存在错误、负面或过时信息的问题单元。
          </div>
          <AnalysisPanel
            isLight={isLight}
            title="指标概览解读"
            conclusion="当前GESI达到88.0，较基线提升8.4分；GLI为+14.8，按当前报告口径属于中度改善。"
            evidence="品牌提及率提升6.0个百分点，前三推荐率提升5.5个百分点，有效引用率提升8.0个百分点，同时风险问题减少2组。"
            impact="提升并非只来自曝光增加，推荐位置、证据质量和风险控制也同步改善，说明本周优化开始影响模型的回答结构。"
            action="继续观察两周，确认提升能否跨模型、跨问法保持稳定；若只在少量问题中上涨，不应直接判断为长期改善。"
          />
        </section>
      )}

      {visibleSections.trends && (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  指数趋势
                </h2>
                <p className="mt-1 text-[10px] text-slate-500">7天变化及关键节点</p>
              </div>
              <span className="text-[10px] text-slate-500">7/10 发布能耗长测　7/11 完成负面纠偏</span>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gesiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gliFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="gesi" domain={[70, 95]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="gli" orientation="right" domain={[0, 20]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#0f131d', borderColor: 'rgba(148,163,184,.25)', fontSize: 11 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  <ReferenceLine x="7/10" yAxisId="gesi" stroke="#F59E0B" strokeDasharray="4 4" label={{ value: '发布长测', position: 'insideTopLeft', fill: '#F59E0B', fontSize: 9 }} />
                  <ReferenceLine x="7/11" yAxisId="gesi" stroke="#8B5CF6" strokeDasharray="4 4" label={{ value: '完成纠偏', position: 'insideTopRight', fill: '#8B5CF6', fontSize: 9 }} />
                  <Area yAxisId="gesi" type="monotone" dataKey="GESI" stroke="#10B981" strokeWidth={2} fill="url(#gesiFill)" name="GESI" />
                  <Area yAxisId="gli" type="monotone" dataKey="GLI" stroke="#6366F1" strokeWidth={2} fill="url(#gliFill)" name="GLI" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <TrendInterpretation isLight={isLight} />
          </div>

          <div className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <div className="mb-3">
              <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                GLI贡献拆解
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">七个提升维度合计14.8点</p>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gliContributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}> 
                  <CartesianGrid stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#0f131d', borderColor: 'rgba(148,163,184,.25)', fontSize: 11 }} />
                  <Bar dataKey="lift" fill="#6366F1" radius={[4, 4, 0, 0]} name="贡献点数" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <GliContributionInterpretation isLight={isLight} />
          </div>

          <div className={cn('rounded-xl border p-5 xl:col-span-2', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
                  <Layers className="h-4 w-4 text-cyan-500" />
                  GESI七维度对比
                </h2>
                <p className="mt-1 text-[10px] text-slate-500">基线与当前得分</p>
              </div>
              <span className="text-[10px] text-slate-500">稳定性最高，推荐度仍有提升空间</span>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gesiDimensionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#0f131d', borderColor: 'rgba(148,163,184,.25)', fontSize: 11 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="base" fill="#64748B" radius={[4, 4, 0, 0]} name="基线" />
                  <Bar dataKey="current" fill="#10B981" radius={[4, 4, 0, 0]} name="当前" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <GesiDimensionInterpretation isLight={isLight} />
          </div>
        </section>
      )}

      {visibleSections.outcomes && (
        <section className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className="mb-4">
            <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
              本周可核验成果
            </h2>
            <p className="mt-1 text-[10px] text-slate-500">只记录可核验的变化</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {[
              { label: '新增有效提及', value: '12组', detail: '悬架、续航、混动结构进入更多问题' },
              { label: '进入前三推荐', value: '8组', detail: '集中在10万元级插混推荐' },
              { label: '新增有效引用', value: '22次', detail: '主要来自第三方长测和拆解' },
              { label: '竞品对比改善', value: '6组', detail: '底盘场景的单边推荐下降' },
              { label: '错误认知修复', value: '4处', detail: '噪音、车机、冬季续航旧信息减少' },
            ].map((item) => (
              <div key={item.label} className={cn('rounded-xl border p-4', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/60')}>
                <span className="text-[10px] text-slate-500">{item.label}</span>
                <strong className={cn('mt-2 block text-xl', isLight ? 'text-slate-900' : 'text-white')}>{item.value}</strong>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
          <AnalysisPanel
            isLight={isLight}
            title="成果数据解读"
            conclusion="本周新增成果集中在“被看见—进入前三—获得引用”三步链路，说明优化动作已经从曝光层进入推荐和证据层。"
            evidence="新增12组有效提及、8组进入前三、22次有效引用，并完成6组竞品对比改善和4处错误认知修复。"
            impact="这些数字按问题单元和有效证据去重，不等同于页面浏览量或文章数量；它们反映的是AI回答发生了多少可复核变化。"
            action="下周继续追踪这些成果是否保持两次以上重复采样，并区分“首次进入”“持续保持”和“再次回落”，避免只报新增、不报留存。"
          />
        </section>
      )}

      {visibleSections.modelMatrix && (
        <section className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
                <AlertCircle className="h-4 w-4 text-rose-500" />
                模型与问题表现
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">分数越低，越需要检查排名、引用或回答准确性</p>
            </div>
            <div className="flex gap-2 text-[9px] text-slate-500">
              <span className="rounded bg-emerald-500/10 px-2 py-1 text-emerald-500">85以上稳定</span>
              <span className="rounded bg-amber-500/10 px-2 py-1 text-amber-500">65—74需关注</span>
              <span className="rounded bg-rose-500/10 px-2 py-1 text-rose-500">65以下高风险</span>
            </div>
          </div>
          <div className={cn('mb-3 rounded-lg border px-3 py-2.5 text-[10.5px] leading-relaxed', isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/5 bg-[#0b0f17]/45 text-slate-400')}>
            <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>读表方法：</strong>
            行代表问题类型，列代表模型。分数综合考虑品牌提及、推荐位置、回答准确性、引用质量和竞品偏向；它不是单纯的排名分。横向看同一问题在不同模型中的稳定性，纵向看同一模型在哪些问题上容易失分。
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-xs">
              <thead>
                <tr className={cn('border-b text-[10px] text-slate-500', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/40')}>
                  <th className="px-3 py-3 text-left">问题类型</th>
                  <th className="px-3 py-3 text-center">Kimi</th>
                  <th className="px-3 py-3 text-center">豆包</th>
                  <th className="px-3 py-3 text-center">DeepSeek</th>
                  <th className="px-3 py-3 text-center">腾讯元宝</th>
                  <th className="px-3 py-3 text-center">通义千问</th>
                  <th className="px-3 py-3 text-left">本周判断</th>
                </tr>
              </thead>
              <tbody>
                {questionTypeRows.map((row) => {
                  const scores = [row.kimi, row.doubao, row.deepseek, row.yuanbao, row.qianwen];
                  const min = Math.min(...scores);
                  const note = row.type === '对比类'
                    ? '豆包、元宝偏低，竞品首推仍较多。'
                    : row.type === '决策类'
                      ? '高意向问题表现不均，推荐理由需要更具体。'
                      : row.type === '长尾类'
                        ? '覆盖面不足，新增场景仍需扩展。'
                        : '整体稳定。';
                  return (
                    <tr key={row.type} className={cn('border-b', isLight ? 'border-slate-100' : 'border-white/5')}>
                      <td className={cn('px-3 py-3 font-bold', isLight ? 'text-slate-800' : 'text-slate-200')}>{row.type}</td>
                      {[row.kimi, row.doubao, row.deepseek, row.yuanbao, row.qianwen].map((score, index) => (
                        <td key={`${row.type}-${index}`} className="px-2 py-2 text-center">
                          <span className={cn('inline-flex min-w-12 justify-center rounded-md px-2 py-1 font-bold', getHeatClass(score, isLight))}>{score}</span>
                        </td>
                      ))}
                      <td className={cn('px-3 py-3 text-[10.5px]', min < 65 ? 'text-rose-500' : isLight ? 'text-slate-600' : 'text-slate-400')}>{note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <AnalysisPanel
            isLight={isLight}
            title="模型表现表解读"
            conclusion="认知类平均91.4分、风险类86.4分，说明模型基本知道品牌是谁，旧错误信息也已明显减少；对比类仅71.4分，是最主要短板。"
            evidence="通义千问平均85.3分、Kimi平均84.0分，整体较稳定；豆包平均76.1分、腾讯元宝平均75.3分，在对比类和决策类问题中失分最多。"
            impact="品牌已经具备基础认知，但在真正影响购买选择的对比、决策和长尾场景中，推荐理由仍不稳定，容易出现“知道品牌但不优先推荐”的情况。"
            action="按模型制定补强方案：豆包重点补充同条件能耗和价格价值证据，腾讯元宝重点补充第三方引用与可抓取页面，不再采用一套内容覆盖所有模型。"
          />
        </section>
      )}

      {visibleSections.competitor && (
        <section className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className="mb-4">
            <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <Target className="h-4 w-4 text-amber-500" />
              竞品对比
            </h2>
            <p className="mt-1 text-[10px] text-slate-500">当前品牌与{currentCompetitor}在高意向问题中的表现</p>
          </div>
          <div className={cn('mb-3 rounded-lg border px-3 py-2.5 text-[10.5px] leading-relaxed', isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/5 bg-[#0b0f17]/45 text-slate-400')}>
            <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>指标说明：</strong>
            GESI比较整体AI声望健康度，前三推荐率比较进入优先选择的机会，对比胜率比较品牌在直接对比问题中的胜出比例，有效引用率比较回答是否有可核验证据。四项指标必须一起看，不能只看总分。
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: 'GESI', mine: 88.0, competitor: 74.5, note: '综合健康度' },
              { label: '前三推荐率', mine: 72.0, competitor: 58.0, note: '进入前三的比例' },
              { label: '对比胜率', mine: 62.0, competitor: 38.0, note: '直接对比问题' },
              { label: '有效引用率', mine: 52.0, competitor: 61.0, note: '竞品仍有优势' },
            ].map((item) => {
              const total = item.mine + item.competitor;
              const mineWidth = `${(item.mine / total) * 100}%`;
              const competitorWidth = `${(item.competitor / total) * 100}%`;
              return (
                <div key={item.label} className={cn('rounded-lg border p-4', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/60')}>
                  <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <span className="block text-[9px] text-slate-500">{currentBrand}</span>
                      <strong className="text-base text-emerald-500">{item.mine}</strong>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] text-slate-500">{currentCompetitor}</span>
                      <strong className="text-base text-rose-500">{item.competitor}</strong>
                    </div>
                  </div>
                  <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-emerald-500" style={{ width: mineWidth }} />
                    <div className="h-full bg-rose-500" style={{ width: competitorWidth }} />
                  </div>
                  <p className="mt-2 text-[9px] text-slate-500">{item.note}</p>
                </div>
              );
            })}
          </div>
          <AnalysisPanel
            isLight={isLight}
            title="竞品对比解读"
            conclusion={`${currentBrand}的GESI领先${currentCompetitor}13.5分，前三推荐率领先14个百分点，对比胜率领先24个百分点；但有效引用率落后9个百分点。`}
            evidence="品牌在底盘舒适、空间和综合推荐问题中更容易进入前三，而竞品在能耗技术和官方参数类回答中拥有更多被模型直接采用的来源。"
            impact="当前优势更多体现在推荐结果，证据基础却不够厚。若竞品继续增加高权重来源，现有推荐优势可能难以长期保持。"
            action="优先建设同路线能耗测试、第三方底盘对比和长期车主数据，并追踪这些材料是否被豆包、元宝等弱势模型实际引用。"
          />
        </section>
      )}

      {visibleSections.assets && (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={cn('rounded-xl border p-5 xl:col-span-2', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <div className="mb-3">
              <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
                <Database className="h-4 w-4 text-blue-500" />
                内容资产贡献
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">内容被模型引用、采纳或用于纠偏后产生的贡献</p>
            </div>
            <div className={cn('mb-2 rounded-lg border px-3 py-2 text-[10px] leading-relaxed', isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/5 bg-[#0b0f17]/45 text-slate-400')}>
              <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>读图方法：</strong>
              横轴为归因到本周GLI的贡献点数；右侧“引用次数”表示该类资产被回答有效采用的次数。贡献点数是归因结果，不等同于文章阅读量，也不代表某一篇内容可以单独增加相同分数。
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetData} layout="vertical" margin={{ top: 10, right: 20, left: 18, bottom: 0 }}>
                  <CartesianGrid stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" width={92} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#0f131d', borderColor: 'rgba(148,163,184,.25)', fontSize: 11 }} />
                  <Bar dataKey="contribution" fill="#3B82F6" radius={[0, 4, 4, 0]} name="贡献点数" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
            <h2 className={cn('mb-3 flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <BookOpen className="h-4 w-4 text-indigo-500" />
              资产状态
            </h2>
            <div className="space-y-2.5">
              {assetData.map((item) => (
                <div key={item.name} className={cn('rounded-lg border p-3', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/60')}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-[11px] font-bold', isLight ? 'text-slate-800' : 'text-slate-200')}>{item.name}</span>
                    <span className="text-[10px] font-bold text-blue-500">+{item.contribution}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                    <span>引用{item.citations}次</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="xl:col-span-3">
            <AnalysisPanel
              isLight={isLight}
              title="内容资产解读"
              conclusion="真实能耗长测、底盘拆解和车主长期口碑合计贡献10.1个GLI点，占本周总提升的68.2%，是最有效的三类资产。"
              evidence="三类资产共形成18次有效引用，并同时改善可见度、推荐理由和引用权威；车机升级说明只有2次引用，覆盖仍然偏弱。"
              impact="模型更重视可核验条件、第三方数据和长期体验。单纯重复品牌卖点容易增加内容数量，却未必增加模型采纳。"
              action="继续维护高贡献资产的时效性，同时为低覆盖资产补充测试条件、发布日期、来源说明和可抓取结构；下周报告需区分直接引用、间接引用和语义采纳。"
            />
          </div>
        </section>
      )}

      {visibleSections.keyQuestions && (
        <section className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
                <Eye className="h-4 w-4 text-indigo-500" />
                重点问题变化
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">排名、回答结论、证据和处理动作放在同一行</p>
            </div>
            <span className="text-[10px] text-slate-500">重点监测145个问题</span>
          </div>
          <div className={cn('mb-3 rounded-lg border px-3 py-2.5 text-[10.5px] leading-relaxed', isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/5 bg-[#0b0f17]/45 text-slate-400')}>
            <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>读表方法：</strong>
            “上周/本周”记录有效排名或认知状态；“回答变化”说明模型说法发生了什么变化；“主要证据”说明变化由哪些资料支撑；“处理”给出下周动作。排名上升但回答理由空泛，仍不能视为完全优化成功。
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-xs">
              <thead>
                <tr className={cn('border-b text-[10px] text-slate-500', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0b0f17]/40')}>
                  <th className="px-3 py-3 text-left">问题</th>
                  <th className="px-3 py-3 text-center">上周</th>
                  <th className="px-3 py-3 text-center">本周</th>
                  <th className="px-3 py-3 text-left">回答变化</th>
                  <th className="px-3 py-3 text-left">主要证据</th>
                  <th className="px-3 py-3 text-center">处理</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    question: '10万元级插混轿车，哪款底盘舒适、续航又长？',
                    last: '第5名',
                    current: '第2名',
                    change: '回答开始同时提到长续航、后独立悬架和后排空间。',
                    evidence: '能耗长测、底盘拆解、空间实测',
                    action: '保持监测',
                    actionClass: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20',
                  },
                  {
                    question: `${currentBrand}和${currentCompetitor}，城市拥堵时谁更平顺？`,
                    last: '第5名',
                    current: '第3名',
                    change: '已能说明双电机混动和平顺性，但与竞品的比较仍偏参数。',
                    evidence: '城市工况测试、车主长期反馈',
                    action: '补充同路况对比',
                    actionClass: 'text-blue-500 bg-blue-500/5 border-blue-500/20',
                  },
                  {
                    question: `${currentBrand}高速共振、噪音大是真的吗？`,
                    last: '负面偏多',
                    current: '基本澄清',
                    change: '旧负面表述减少，回答开始引用NVH测试和长期口碑。',
                    evidence: '噪音测试、质量追踪、口碑数据',
                    action: '持续观察',
                    actionClass: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20',
                  },
                  {
                    question: `${currentBrand}和${currentCompetitor}，谁真实能耗更低？`,
                    last: '竞品领先',
                    current: '仍偏竞品',
                    change: '豆包和元宝仍优先引用竞品官方技术数据。',
                    evidence: '缺少同温度、同路线、同载荷测试',
                    action: 'P0处理',
                    actionClass: 'text-rose-500 bg-rose-500/5 border-rose-500/20',
                  },
                ].map((row) => (
                  <tr key={row.question} className={cn('border-b', isLight ? 'border-slate-100' : 'border-white/5')}>
                    <td className={cn('max-w-[230px] px-3 py-3 font-bold', isLight ? 'text-slate-800' : 'text-slate-200')}>{row.question}</td>
                    <td className="px-3 py-3 text-center text-slate-500">{row.last}</td>
                    <td className={cn('px-3 py-3 text-center font-bold', row.current.includes('仍') ? 'text-rose-500' : 'text-emerald-500')}>{row.current}</td>
                    <td className={cn('max-w-[260px] px-3 py-3 text-[10.5px] leading-relaxed', isLight ? 'text-slate-600' : 'text-slate-400')}>{row.change}</td>
                    <td className="max-w-[220px] px-3 py-3 text-[10.5px] leading-relaxed text-indigo-400">{row.evidence}</td>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => showToast(`已打开“${row.question}”的证据详情。`, 'info')} className={cn('cursor-pointer rounded border px-2 py-1 text-[10px] font-bold', row.actionClass)}>
                        {row.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AnalysisPanel
            isLight={isLight}
            title="重点问题表解读"
            conclusion="4个代表性问题中有3个出现改善，其中两项进入前三，一项负面认知基本澄清；真实能耗对比仍是唯一明确失防问题。"
            evidence="底盘舒适与长续航问题由第5名升至第2名，城市平顺性由第5名升至第3名；高速噪音问题从负面偏多转为基本澄清，但能耗问题仍偏向竞品。"
            impact="这说明品牌在功能认知和风险修复上进展较快，但在直接影响购买决策的同类对比中，证据仍不足以改变部分模型的默认判断。"
            action="将真实能耗对比列为P0：补充同温度、同路线、同载荷测试，并分别验证豆包和腾讯元宝是否出现排名、回答理由和引用来源三项同步改善。"
          />
        </section>
      )}

      {visibleSections.actions && (
        <section className={cn('rounded-xl border p-5', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className="mb-4">
            <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <Calendar className="h-4 w-4 text-indigo-500" />
              下周行动计划
            </h2>
            <p className="mt-1 text-[10px] text-slate-500">每项任务必须有目标、动作和验收标准</p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[
              {
                priority: 'P0',
                title: '补强真实能耗对比',
                target: '豆包、元宝的综合能耗问题',
                actions: '完成同路线、同温度、同载荷对比测试；同步发布1篇媒体长文和1份数据图表。',
                acceptance: '8组重点问题中，品牌进入前三不少于6组。',
                owner: '内容策略组 / 数据测试组',
                deadline: '7月17日',
                className: 'border-rose-500/20 bg-rose-500/[0.03]',
                badge: 'bg-rose-500/10 text-rose-500',
              },
              {
                priority: 'P1',
                title: '扩大高质量引用覆盖',
                target: '产品参数页、车机升级说明',
                actions: '补充FAQ、测试条件、发布日期和第三方来源；检查页面可抓取性。',
                acceptance: '新增有效引用不少于8次，元宝完成新内容收录。',
                owner: '内容运营组 / 技术支持组',
                deadline: '7月18日',
                className: 'border-blue-500/20 bg-blue-500/[0.03]',
                badge: 'bg-blue-500/10 text-blue-500',
              },
              {
                priority: 'P2',
                title: '扩展长尾决策场景',
                target: '家庭通勤、冬季、高速、满载',
                actions: '新增20个真实用户问题，补充对应回答素材和可核验数据。',
                acceptance: '长尾类平均得分由74.4提升至78以上。',
                owner: '问题策略组',
                deadline: '7月20日',
                className: 'border-emerald-500/20 bg-emerald-500/[0.03]',
                badge: 'bg-emerald-500/10 text-emerald-500',
              },
            ].map((item) => (
              <article key={item.priority} className={cn('rounded-xl border p-4', item.className)}>
                <div className="flex items-center justify-between">
                  <span className={cn('rounded px-2 py-0.5 text-[10px] font-bold', item.badge)}>{item.priority}</span>
                  <button onClick={() => showToast(`已为“${item.title}”生成任务。`)} className="cursor-pointer text-[10px] text-indigo-400 hover:underline">生成任务</button>
                </div>
                <h3 className={cn('mt-3 text-sm font-bold', isLight ? 'text-slate-900' : 'text-white')}>{item.title}</h3>
                <dl className="mt-3 space-y-2 text-[10.5px] leading-relaxed">
                  <div><dt className="inline font-bold text-slate-500">目标：</dt><dd className="inline text-slate-400">{item.target}</dd></div>
                  <div><dt className="inline font-bold text-slate-500">动作：</dt><dd className="inline text-slate-400">{item.actions}</dd></div>
                  <div><dt className="inline font-bold text-slate-500">验收：</dt><dd className="inline text-indigo-400">{item.acceptance}</dd></div>
                  <div><dt className="inline font-bold text-slate-500">负责人：</dt><dd className="inline text-slate-400">{item.owner}</dd></div>
                  <div><dt className="inline font-bold text-slate-500">截止：</dt><dd className="inline text-slate-400">{item.deadline}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <AnalysisPanel
            isLight={isLight}
            title="行动优先级说明"
            conclusion="P0、P1、P2按业务影响和证据缺口排序，而不是按任务难易排序。P0先处理直接影响购买决策的竞品能耗问题。"
            evidence="P0影响豆包、元宝及8组高意向问题；P1直接影响有效引用率；P2针对长尾类74.4分的覆盖短板。"
            impact="加入负责人、截止时间和验收指标后，下周周报可以直接判断任务是否完成、指标是否改善，避免计划只停留在文字层面。"
            action="下周复盘时分别记录任务完成状态、首次抓取时间、首次引用时间和对应指标变化；未产生数据变化的任务应重新评估。"
          />
        </section>
      )}

      {visibleSections.logs && (
        <section className={cn('overflow-hidden rounded-xl border', isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/5 bg-[#131825]/90')}>
          <div className={cn('flex items-center justify-between border-b p-4', isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-slate-900/30')}>
            <h2 className={cn('flex items-center gap-2 text-sm font-black', isLight ? 'text-slate-800' : 'text-slate-100')}>
              <Clock className="h-4 w-4 text-indigo-500" />
              待处理问题与运行记录
            </h2>
            <span className="text-[10px] text-slate-500">采集任务运行中</span>
          </div>
          <div className="grid grid-cols-1 divide-y divide-white/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="space-y-3 p-5">
              <h3 className="flex items-center gap-1 text-xs font-black text-rose-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                待处理问题
              </h3>
              <div className="space-y-2.5 text-[10.5px] leading-relaxed">
                <div className="rounded border border-rose-500/10 bg-rose-500/5 p-3 text-slate-400">
                  <strong className="text-rose-500">高优先级：</strong>
                  腾讯元宝连续5次在“真实能耗对比”中优先推荐竞品，需补充同条件测试证据。
                </div>
                <div className="rounded border border-amber-500/10 bg-amber-500/5 p-3 text-slate-400">
                  <strong className="text-amber-500">待收录：</strong>
                  新发布的车机升级说明24小时后仍未被元宝收录，需检查页面抓取和转载来源。
                </div>
                <div className="rounded border border-emerald-500/10 bg-emerald-500/5 p-3 text-slate-400">
                  <strong className="text-emerald-500">已修复：</strong>
                  高速噪音和共振的旧负面提及明显下降，转为持续观察。
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <h3 className="flex items-center gap-1 text-xs font-black text-emerald-500">
                <Activity className="h-3.5 w-3.5" />
                运行记录
              </h3>
              <div className={cn('max-h-[210px] space-y-2 overflow-y-auto rounded border p-3 font-mono text-[10px] leading-relaxed', isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/5 bg-[#0b0f17] text-slate-400')}>
                <p>07:40　启动500组回答采集任务。</p>
                <p>09:15　完成5个模型、145个重点问题的首轮采样。</p>
                <p>11:30　完成引用去重、来源可信度和事实一致性检查。</p>
                <p>13:20　完成GESI与GLI计算，标记3个异常点。</p>
                <p>14:10　生成周报初稿和下周行动建议。</p>
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <AnalysisPanel
              isLight={isLight}
              title="数据质量与复核说明"
              conclusion="本周报由采集、去重、指标计算和AI归纳自动生成，但关键事实与引用支持关系仍需复核。"
              evidence="系统可自动完成品牌匹配、排名识别、出现位置、域名去重和基础情感判断；高风险问题、事实准确性和引用是否真正支持结论需人工或高质量模型复核。"
              impact="未经复核的自动结论可能把“同时出现”误判为“因果贡献”，或把无效引用当作有效证据，影响报告可信度。"
              action="对P0问题、负面信息、竞品胜负和高贡献资产进行抽样复核，并在导出报告中保留样本量、时间戳、模型版本和证据截图。"
            />
          </div>
        </section>
      )}

      {visibleSections.evidence && (
        <EvidenceScreenshots company={selectedCompany} isLightMode={isLight} isStatic={true} />
      )}
    </div>
  );
}
