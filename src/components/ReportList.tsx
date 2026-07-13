import { FileText, Eye, Download, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const defaultReports = [
  { id: 'REP-001', name: '7月第二周常态运营周报', type: '周报', brand: '星瑞汽车', period: '2026.07.08-07.14', status: '已生成', time: '10分钟前', creator: '系统自动' },
  { id: 'REP-002', name: '6月平台全域声望月报', type: '月报', brand: '星瑞汽车', period: '2026.06.01-06.30', status: '已确认', time: '1周前', creator: '陈利娜' },
  { id: 'REP-003', name: 'Q2 战略复盘与竞品格局', type: '季报', brand: '星瑞汽车', period: '2026.Q2', status: '老板专审', time: '2周前', creator: '刘总' },
  { id: 'REP-004', name: 'DeepSeek数据偏差监测特报', type: '自定义', brand: '星瑞汽车', period: '2026.07.01-07.10', status: '已生成', time: '刚刚', creator: '系统自动' },
];

export function ReportList({ onNavigate, reports = defaultReports }: { onNavigate: (p: string) => void; reports?: any[] }) {
  const handleViewReport = (type: string) => {
    if (type === '周报') onNavigate('weekly');
    if (type === '月报') onNavigate('monthly');
    if (type === '季报') onNavigate('quarterly');
    if (type === '自定义') onNavigate('generator');
  };

  return (
    <div className="bg-[#131825] border border-white/5 rounded-xl overflow-hidden relative">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-slate-300 font-mono">最近生成报告 (点击行或触角图标即可闪送预览)</h3>
          <p className="text-[10px] text-slate-500 mt-1">支持导出 PDF/PPT、审核审发、及二次文字修补</p>
        </div>
        <button 
          onClick={() => onNavigate('delivery')}
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
        >
          查看全部
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs uppercase bg-[#0B0F17]/50 text-slate-500 border-b border-white/5">
            <tr>
              <th className="px-6 py-3 font-medium">报告名称</th>
              <th className="px-6 py-3 font-medium">类型</th>
              <th className="px-6 py-3 font-medium">监测周期</th>
              <th className="px-6 py-3 font-medium">状态</th>
              <th className="px-6 py-3 font-medium">创建人</th>
              <th className="px-6 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((report) => (
              <tr 
                key={report.id} 
                onClick={() => handleViewReport(report.type)}
                className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                title={`点击查看 ${report.name}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-emerald-500/70 mr-3 flex-shrink-0" />
                    <span className="text-slate-200 font-medium">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium border border-transparent",
                    report.type === '周报' ? "bg-slate-800 text-slate-300 border-slate-700" :
                    report.type === '月报' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    report.type === '季报' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  )}>
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono">{report.period}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-xs">
                    {report.status === '生成中' ? (
                      <Clock className="w-3.5 h-3.5 text-blue-400 mr-1.5 animate-spin" />
                    ) : report.status === '已确认' || report.status === '老板专审' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2.5 ml-1"></div>
                    )}
                    <span className={report.status === '生成中' ? 'text-blue-400' : report.status === '已确认' || report.status === '老板专审' ? 'text-emerald-400' : ''}>
                      {report.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">{report.creator}</td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-3 text-slate-400">
                    <button 
                      onClick={() => handleViewReport(report.type)}
                      className="hover:text-emerald-400 transition-colors" 
                      title="预览"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleViewReport(report.type)}
                      className="hover:text-emerald-400 transition-colors" 
                      title="下载 PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="hover:text-slate-200 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
