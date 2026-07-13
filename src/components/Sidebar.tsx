import { 
  LayoutDashboard, FileText, Activity, TrendingUp, Sparkles, Database, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ 
  activePage, 
  setActivePage 
}: { 
  activePage: string; 
  setActivePage: (p: string) => void; 
}) {
  // Flat redesigned SaaS navigation menu as requested by user
  const menuItems = [
    { icon: LayoutDashboard, label: '数据总览', page: 'overview' },
    { icon: Activity, label: 'GESI 生态总指数', page: 'gesigli' },
    { icon: TrendingUp, label: 'GE0 优化提升指数', page: 'gli' },
    { icon: Database, label: '内容资产与证据链', page: 'weekly' },
    { icon: Sparkles, label: 'AI 诊断与优化中心', page: 'suggestions' },
    { icon: FileText, label: '成果交付中心', page: 'delivery' },
    { icon: Settings, label: '项目配置 / 监测设置', page: 'config' },
  ];

  return (
    <div className="w-64 bg-[#0F131D] border-r border-[#ffffff0a] flex flex-col h-screen shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-wide font-mono">
          云端GEO
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">大模型声望优化对账平台</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePage === item.page;
          return (
            <button
              key={index}
              onClick={() => setActivePage(item.page)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-xs font-semibold rounded-lg transition-colors border-l-2 text-left space-x-3",
                isActive 
                  ? "bg-[#1A2234] text-white border-emerald-500 font-bold" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-emerald-400" : "text-slate-500")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-[#1A2234]/60 rounded-lg p-3.5 text-[11px] border border-white/5">
          <p className="text-emerald-400 font-bold mb-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse shrink-0"></span>
            系统状态
          </p>
          <div className="text-slate-400 font-mono leading-relaxed">
            AI 监测引擎已全量对接
          </div>
        </div>
      </div>
    </div>
  );
}
