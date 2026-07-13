// src/App.tsx
import { useState } from 'react';
import { 
  Bell, Settings, Zap, Building2, Sparkles, RefreshCw, CheckCircle2, 
  Database, TrendingUp, HelpCircle, Activity, FileText, ChevronDown, 
  Globe, Sliders, Shield, Menu, ArrowRight, UserCheck, Calendar, Info, Clock, AlertTriangle, Play,
  Sun, Moon
} from 'lucide-react';

// Import our structured data and types
import { initialCompanies, Company } from './data';

// Import our newly created modular components
import { ProjectCenterView } from './components/ProjectCenterView';
import { DataOverviewView } from './components/DataOverviewView';
import { ContentDeploymentView } from './components/ContentDeploymentView';
import { DeliverablesView } from './components/DeliverablesView';

export default function App() {
  // Theme state: light mode (daytime mode) or dark mode
  const [isLightMode, setIsLightMode] = useState<boolean>(true);

  // Top navigation page state: 'project_center' | 'data_overview' | 'content_placement' | 'deliverables'
  const [activePage, setActivePage] = useState<string>('data_overview');

  // Shared state of all companies
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('saic');

  // Find currently active company
  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  // Helper to update specific company's data in global state
  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
  };

  // State for quick-action feedback in the sidebar
  const [isReTesting, setIsReTesting] = useState(false);
  const [reTestResult, setReTestResult] = useState<string | null>(null);

  // Trigger global retest & update KPIs slightly to reflect changes
  const handleGlobalReTest = () => {
    setIsReTesting(true);
    setReTestResult(null);
    setTimeout(() => {
      setIsReTesting(false);
      
      const updated = {
        ...selectedCompany,
        gesi: Math.min(selectedCompany.gesi + 1.2, 100),
        kpis: {
          ...selectedCompany.kpis,
          currentGesi: Math.min(selectedCompany.kpis.currentGesi + 1.2, 100),
          currentGli: parseFloat((selectedCompany.kpis.currentGli + 0.8).toFixed(1)),
          recommendRate: Math.min(selectedCompany.kpis.recommendRate + 2, 100)
        }
      };

      handleUpdateCompany(updated);
      setReTestResult("🟢 复测对账完毕！本周大盘 GESI 成功上涨 +1.2 分，部分拦截节点已被纠偏清洗！");
      setTimeout(() => setReTestResult(null), 4500);
    }, 1500);
  };

  // Callback to automatically add a placement task from the AI diagnostic center
  const handleAddPlacementTask = (taskName: string, query: string, metric: string, type: any) => {
    const newTask = {
      id: `task-ai-${Date.now()}`,
      name: taskName,
      sourceQuery: query,
      targetMetric: metric,
      contentType: type,
      priority: 'P0' as const,
      status: '待生成' as const,
      owner: '系统自动派发'
    };

    const updated = {
      ...selectedCompany,
      placementTasks: [newTask, ...selectedCompany.placementTasks]
    };
    handleUpdateCompany(updated);
  };

  // Primary Navigation Configuration - EXACTLY 4 TABS specified in PRD
  const navigationTabs = [
    { label: '项目中心', key: 'project_center' },
    { label: '数据总览', key: 'data_overview' },
    { label: '内容投放', key: 'content_placement' },
    { label: '成果交付', key: 'deliverables' }
  ];

  return (
    <div className={`min-h-screen ${isLightMode ? 'light-mode bg-[#F8FAFC]' : 'bg-[#070A10]'} flex flex-col font-sans text-slate-200 overflow-hidden h-screen`}>
      
      {/* 1. 顶部全局栏：云端GEO｜项目切换｜数据周期｜通知｜账号 */}
      <header className="h-14 border-b border-[#ffffff0a] bg-[#0A0D14] flex items-center justify-between px-6 shrink-0 z-10">
        
        {/* Left Brand Area */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Globe className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-extrabold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent tracking-wider font-mono">
              云端GEO
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Reputation Optimizing Platform</p>
          </div>
        </div>

        {/* Middle Area: Global Project Selector and Data Cycle */}
        <div className="flex items-center space-x-6">
          {/* Global company selector - Simplified to just show company name as requested */}
          <div className={`flex items-center border rounded-lg px-3 py-1 transition-colors ${
            isLightMode 
              ? 'bg-white border-slate-200' 
              : 'bg-[#121724] border-white/5'
          }`}>
            <select 
              value={selectedCompanyId} 
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className={`bg-transparent text-xs focus:outline-none cursor-pointer font-black pr-1 font-mono transition-colors ${
                isLightMode ? 'text-slate-800' : 'text-emerald-400'
              }`}
            >
              {companies.map(c => (
                <option 
                  key={c.id} 
                  value={c.id} 
                  className={isLightMode ? 'bg-white text-slate-800 text-xs' : 'bg-[#121724] text-white text-xs'}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Area: Admin avatar / Tokens */}
        <div className="flex items-center space-x-5">
          <div className="hidden sm:flex items-center bg-[#161D2E] rounded-full px-3 py-1 border border-white/5">
            <Zap className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <span className="text-[10px] text-slate-400 font-mono font-medium">剩余额度: 91,586 Tokens</span>
          </div>

          {/* Daytime/Nighttime Theme Switcher */}
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className="text-slate-400 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/5 flex items-center justify-center gap-1 cursor-pointer"
            title={isLightMode ? "切换至夜间模式" : "切换至日间模式"}
          >
            {isLightMode ? (
              <Moon className="w-4.5 h-4.5 text-indigo-400" />
            ) : (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            )}
            <span className="text-[10px] font-bold font-mono tracking-wide hidden md:inline">
              {isLightMode ? "夜间模式" : "日间模式"}
            </span>
          </button>

          <button className="text-slate-400 hover:text-white transition-colors relative p-1.5 rounded-lg hover:bg-white/5">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0A0D14]"></span>
          </button>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-white/10">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-white leading-none">陈利娜</div>
              <div className="text-[9px] text-emerald-400 font-mono font-bold mt-1 tracking-wider">超级管理员</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/10 ring-2 ring-white/10 shrink-0">
              陈
            </div>
          </div>
          
          <button 
            onClick={() => setActivePage('project_center')}
            className={`text-slate-400 hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 ${activePage === 'project_center' ? 'text-emerald-400 bg-emerald-500/10' : ''}`}
            title="项目配置"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* 2. 顶部主导航：EXACTLY 6 TABS */}
      <nav className="h-11 bg-[#101523] border-b border-[#ffffff0a] px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center space-x-1.5 h-full">
          {navigationTabs.map((tab) => {
            const isTabActive = activePage === tab.key;
            return (
              <button
                key={tab.key}
                id={`global-nav-tab-${tab.key}`}
                onClick={() => {
                  setActivePage(tab.key);
                }}
                className={`h-full px-5 text-xs font-black transition-all flex items-center relative gap-1.5 border-b-2 tracking-wider ${
                  isTabActive 
                    ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5 font-black' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 select-none">
          <Clock className="w-3 h-3 text-emerald-500" />
          实时对账服务于 2026-06-30 22:47 已同步完毕
        </div>
      </nav>

      {/* 4. 下方三栏式布局 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Center Main Work Area */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0B0F17] relative">
          
          {activePage === 'project_center' && (
            <ProjectCenterView 
              company={selectedCompany} 
              onUpdateCompany={handleUpdateCompany} 
            />
          )}

          {activePage === 'data_overview' && (
            <DataOverviewView 
              company={selectedCompany} 
              onAddPlacementTask={handleAddPlacementTask}
              onUpdateCompany={handleUpdateCompany}
              onNavigate={(page) => setActivePage(page)}
              isLightMode={isLightMode}
            />
          )}

          {activePage === 'content_placement' && (
            <ContentDeploymentView 
              company={selectedCompany} 
              onUpdateCompany={handleUpdateCompany} 
            />
          )}

          {activePage === 'deliverables' && (
            <DeliverablesView 
              company={selectedCompany} 
            />
          )}

        </main>

      </div>

    </div>
  );
}
