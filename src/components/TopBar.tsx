import { Bell, Zap, Settings } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0B0F17] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center text-sm text-slate-400">
        <span>当前任务：</span>
        <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium border border-emerald-500/20">
          成果交付中心
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-[#1A2234] rounded-full px-4 py-1.5 border border-white/5">
          <Zap className="w-4 h-4 text-emerald-400 mr-2" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-medium uppercase leading-none">Tokens Remaining</span>
            <span className="text-sm font-bold text-white leading-tight">91,586</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border border-[#0B0F17]"></span>
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="border-l border-white/10 pl-6 flex items-center">
          <div className="text-right mr-3 hidden sm:block">
            <div className="text-sm font-medium text-white text-right">陈利娜</div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>
              SUPER AUTHORIZATION
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/10">
            陈
          </div>
        </div>
      </div>
    </header>
  );
}
