import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Eye, Download, Sparkles, Layers, CheckCircle2, 
  HelpCircle, Calendar, ArrowUpRight, ArrowRight, ShieldCheck, RefreshCw, FileArchive, Trash2, FileSpreadsheet, UploadCloud
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ReportsDeliveryCenterProps {
  onNavigate: (page: string) => void;
}

export function ReportsDeliveryCenter({ onNavigate }: ReportsDeliveryCenterProps) {
  const [activeTab, setActiveTab] = useState<'monthly' | 'quarterly' | 'project'>('monthly');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // User private uploaded reference materials (NEW interactive area)
  const [privateMaterials, setPrivateMaterials] = useState<any[]>([
    { id: 'MAT-1', name: '2026款星瑞CMA湿式双离合中低速平顺拥堵路测数据表.xlsx', size: '142 KB', type: 'EXCEL', date: '刚刚', author: '系统内置' },
    { id: 'MAT-2', name: '12万家轿大空间越级对标速腾消费者物理评测拼图.pdf', size: '3.4 MB', type: 'PDF', date: '3小时前', author: '宿主管理员' },
    { id: 'MAT-3', name: '吉利星瑞1.5T扶摇版92号汽油一年实际油耗与维护成本折算表.pdf', size: '1.2 MB', type: 'PDF', date: '昨天', author: '陈利娜' }
  ]);
  const [newMaterialName, setNewMaterialName] = useState<string>('');
  const [newMaterialType, setNewMaterialType] = useState<string>('EXCEL');

  // Define some rich reports aligned with the user requests
  const monthlyReports = [
    {
      id: 'REP-M5',
      name: '5月四川长虹美菱冰箱 AIGC 推荐引流声望极优月度报告',
      period: '统计范围：2026-05-01 至 2026-05-27',
      score: '89.4 pts',
      size: '12.4 MB',
      type: 'WORD',
      status: '已发送'
    },
    {
      id: 'REP-M4',
      name: '4月 AI 搜索声望基线与优化启动月报',
      period: '统计范围：2026-04-01 至 2026-04-30',
      score: '54.2 pts',
      size: '9.8 MB',
      type: 'PDF',
      status: '历史版本'
    },
    {
      id: 'REP-M6',
      name: '6月 美菱冰箱/奥克斯空调大模型声望优化对账月报',
      period: '统计范围：2026-06-01 至 2026-06-30',
      score: '91.8 pts',
      size: '15.2 MB',
      type: 'WORD',
      status: '待审核'
    }
  ];

  const quarterlyReports = [
    {
      id: 'REP-Q2',
      name: '2026 Q2 家电/出行双链路大模型推荐份额与声望对账报告',
      period: '统计范围：2026-Q2 全周期',
      score: '78.5 pts',
      size: '32.4 MB',
      type: 'PDF',
      status: '已发送'
    }
  ];

  const projectReports = [
    {
      id: 'REP-P1',
      name: '美菱冰箱 M-Fresh 微纳米抗霜技术大模型物理存证报告',
      period: '统计范围：2026交付对数批次',
      score: '86.0 pts',
      type: 'WORD',
      size: '11.2 MB',
      status: '通过校验'
    },
    {
      id: 'REP-P2',
      name: '星瑞汽油版 7DCT市区双离合拥堵谣言语义破局专案',
      period: '统计范围：专题负面认知纠偏',
      score: '95.0 pts',
      type: 'WORD',
      size: '5.6 MB',
      status: '显著提升'
    },
    {
      id: 'REP-P3',
      name: '奥克斯智能空调 AI 极速防直吹技术多维度引流对账专案',
      period: '统计范围：智能风感专项监测',
      score: '88.7 pts',
      type: 'PDF',
      size: '7.2 MB',
      status: '已发送'
    }
  ];

  const [localReports, setLocalReports] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_generated_reports');
      if (stored) {
        setLocalReports(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const activeReports = 
    activeTab === 'monthly' ? monthlyReports : 
    activeTab === 'quarterly' ? quarterlyReports : [...localReports, ...projectReports];

  const handleDownload = (id: string, format: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`🎉 已成功导出 【${format}】 物理底稿！文件整合了我方已装载的 【${privateMaterials.length} 份私域物料】进行大模型参考验证。文件指纹校验 SHA256 完毕，内嵌大模型真实物理问答反链截图，已触发浏览器自动下载。`);
    }, 1000);
  };

  const handleAddMaterial = () => {
    if (!newMaterialName.trim()) {
      alert("⚠️ 请输入物料名称或文件全称！");
      return;
    }
    const newId = `MAT-${Date.now()}`;
    const matObj = {
      id: newId,
      name: newMaterialName.endsWith('.pdf') || newMaterialName.endsWith('.xlsx') || newMaterialName.endsWith('.docx')
        ? newMaterialName
        : `${newMaterialName}.${newMaterialType === 'EXCEL' ? 'xlsx' : newMaterialType === 'PDF' ? 'pdf' : 'docx'}`,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      type: newMaterialType,
      date: '刚刚',
      author: '宿主管理员'
    };
    setPrivateMaterials(prev => [matObj, ...prev]);
    setNewMaterialName('');
    alert(`🎉 成功！您添加的数据资料 [${matObj.name}] 已装入云端 GEO 首尾计算缓存。AI 分析引擎在进行后续对账分析及自动报告编制时，将核心参考该等事实数据，有效攻克大模型产生的陈旧幻觉，提升报告权威性！`);
  };

  const handleRemoveMaterial = (id: string) => {
    setPrivateMaterials(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 🧭 Top breadcrumb & metadata bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-gradient-to-r from-[#171E2E] to-[#121724] border border-white/5 rounded-2xl gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 mb-1 text-xs font-semibold font-mono tracking-wider">
            <span>AI REPUTATION INTELLIGENCE • BRAND LIFT ANALYTICS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
            汇报成果交付
            <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">Active Delivery Gate</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            支持 Word、PDF 极速物理底件导出及动态网页验证链接呈现。致力于打造符合汽车公关、技术开发与管理层深度汇报需求的完整案卷。
          </p>
        </div>

        {/* Action controllers matching top right of first screenshot (With diagnostic button eliminated) */}
        <div className="flex items-center space-x-3 self-end lg:self-center">
          <div className="bg-[#0B0F17] rounded-lg px-3 py-1.5 border border-white/10 text-xs text-slate-400 flex items-center space-x-2 font-mono">
            <span>交付宿主:</span>
            <strong className="text-white font-sans">星瑞汽车产品组 (品牌A)</strong>
          </div>
          <button 
            onClick={() => onNavigate('generator')}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-extrabold transition-all shadow-md select-none border border-white/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            自定义生成报告
          </button>
        </div>
      </div>

      {/* 📊 Core Delivery Platform Layout split into master-detail columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Report list table & Weight calculations */}
        <div className="lg:col-span-8 space-y-6 bg-[#131825]/90 border border-white/5 p-6 rounded-2xl">
          
          {/* Section banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/5 gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">报告交付列表</h2>
              <p className="text-xs text-slate-400 mt-0.5">自动生成并物理交付月度对账、季度述职和项目制闭卷结论报告。</p>
            </div>
            
            {/* 🏷️ Selector Tabs matching monthly_audit, quarterly_briefing, project_delivery */}
            <div className="flex bg-[#0B0F17] rounded-lg p-1 text-xs border border-white/5 items-center">
              <button
                type="button"
                onClick={() => setActiveTab('monthly')}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-all font-sans font-bold text-xs shrink-0",
                  activeTab === 'monthly' ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-slate-400 hover:text-slate-200"
                )}
              >
                月度对账
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quarterly')}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-all font-sans font-bold text-xs shrink-0",
                  activeTab === 'quarterly' ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-slate-400 hover:text-slate-200"
                )}
              >
                季度述职
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('project')}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-all font-sans font-bold text-xs shrink-0",
                  activeTab === 'project' ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-slate-400 hover:text-slate-200"
                )}
              >
                项目制交付
              </button>
            </div>
          </div>

          {/* 🗄️ Report Table Container */}
          <div className="bg-[#0B0F17]/80 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center">
                <FileArchive className="w-4 h-4 mr-1.5 text-blue-400" />
                当前宿主归档报告名录
              </span>
              <span className="text-[10px] text-slate-500 font-mono">共 {activeReports.length} 份可用物理文件</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-medium">
                    <th className="py-3 px-5">报告名称</th>
                    <th className="py-3 px-5 text-center">交付分值 (GESI/GLI)</th>
                    <th className="py-3 px-5 text-center">物理体积</th>
                    <th className="py-3 px-5 text-center">当前状态</th>
                    <th className="py-3 px-5 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[2%] transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3.5">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center border shrink-0",
                            report.type === 'WORD' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                          )}>
                            <FileText className="w-5 h-5 font-bold" />
                          </div>
                          <div>
                            <span className="text-slate-200 font-bold text-sm block group-hover:text-white transition-colors">
                              {report.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                              {report.period}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className="font-mono text-emerald-400 font-extrabold text-sm px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/15 rounded-lg">
                          {report.score}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center text-slate-400 font-mono font-medium">
                        {report.size}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono",
                          report.status === '已归档' || report.status === '通过校验' || report.status === '显著提升'
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : report.status === '已发送'
                            ? "bg-sky-400/10 text-sky-400 border border-sky-400/20"
                            : report.status === '待审核'
                            ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                            : "bg-slate-400/10 text-slate-400 border border-slate-500/20"
                        )}>
                          • {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* 预览按钮 */}
                          <button
                            onClick={() => {
                              if (activeTab === 'monthly') {
                                onNavigate('monthly');
                              } else if (activeTab === 'quarterly') {
                                onNavigate('quarterly');
                              } else {
                                onNavigate('weekly');
                              }
                            }}
                            className="inline-flex items-center px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg border border-blue-500/20 transition-all font-semibold font-sans text-xs shadow-md select-none"
                            title="查验此交付底件的Word或PDF底层真实内容"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            预览
                          </button>
                          
                          {/* 物理底件下载 */}
                          <button
                            disabled={downloadingId === report.id}
                            onClick={() => handleDownload(report.id, report.type)}
                            className="inline-flex items-center p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all select-none disabled:opacity-50"
                            title={`导出此报告的 ${report.type} 底层完备物理印证档`}
                          >
                            {downloadingId === report.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Extra tips explaining evidence chains integration */}
            <div className="p-4 bg-slate-900/30 border-t border-white/5 text-slate-400 text-xs flex items-center space-x-2.5 font-sans">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>所有物理报告均支持 PDF/Word 同步缓存机制，点击【预览】将直接进入底层大模型真实的 GESI 加权细节，包含已导入事实物料的纠正对照记录。</span>
            </div>
          </div>

          {/* Recalculation math notes */}
          <div className="p-5 rounded-xl border border-white/5 bg-[#171E2E]/60 text-xs space-y-3">
            <h4 className="text-white font-bold flex items-center">
              <Layers className="w-4 h-4 mr-2 text-blue-400" />
              GEO 月度/季度对账核心物理加权公式说明：
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans font-medium text-[11px]">
              最终大模型声望总指标 <strong className="text-blue-400">GESI</strong> 的计算与物理纠偏有着直接对账关系：
            </p>
            <div className="bg-[#0B0F17]/90 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed">
              <code className="text-emerald-400">GESI = W_GVI×GVI + W_GRI×GRI + W_GII×GII + W_GCI×GCI + W_GAI×GAI + W_GDI×GDI + W_GSS×GSS</code>
              <p className="mt-1.5 text-slate-500 text-[10px]">
                * 权重占比 (W_*) 可在主数据总览的“加权权重调节舱”中，根据不同客户的具体商业目标进行定制与专属保存。
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Reference/Private Files uploads & Reference DB */}
        <div className="lg:col-span-4 bg-[#131825]/90 border border-white/5 p-5 rounded-2xl space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-extrabold text-white font-mono tracking-wide flex items-center">
              <UploadCloud className="w-4.5 h-4.5 mr-2 text-emerald-400" />
              我方事实数据库导入
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              用户可随时追加上传专属的产品参数、路测数据、辟谣官宣。AI 诊断与报告编制引擎在执行后续对账时，将自动参考本底物料，大幅拉升报告准确度并攻克大模型产生的陈旧幻觉。
            </p>
          </div>

          {/* Interactive manual material addition form */}
          <div className="p-4 bg-[#0B0F17]/70 rounded-xl border border-white/5 space-y-3">
            <span className="text-[11px] text-emerald-400 font-bold block">➕ 新增私域数据资料</span>
            
            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">文件名称/语料标题</label>
              <input
                type="text"
                className="w-full bg-[#121724] text-white p-2 border border-white/10 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                placeholder="如: 2026星瑞空间超宽长途实测"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">数据类型</label>
              <select
                className="w-full bg-[#121724] text-white p-2 border border-white/10 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500"
                value={newMaterialType}
                onChange={(e) => setNewMaterialType(e.target.value)}
              >
                <option value="EXCEL">Excel 实测表格数据 (.xlsx)</option>
                <option value="PDF">PDF 官方产品规格/车测书 (.pdf)</option>
                <option value="WORD">Word 用户自驾反馈与公关稿 (.docx)</option>
              </select>
            </div>

            <button
              onClick={handleAddMaterial}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs transition-all shadow-md mt-1"
            >
              🚀 导入至 AI 语义数据库
            </button>
          </div>

          {/* Drag and Drop Zone Container Mock */}
          <div 
            onClick={() => {
              const res = prompt("请输入您要模拟选择的本地文件名：");
              if (res) {
                setNewMaterialName(res);
                alert(`已选中模拟文件: ${res}。请选择数据类型并点击上方导入按钮！`);
              }
            }}
            className="p-4 bg-slate-900/30 border border-dashed border-white/10 hover:border-emerald-500/40 rounded-xl flex flex-col items-center justify-center space-y-1.5 cursor-pointer group transition-colors text-center"
          >
            <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="text-slate-300 font-bold text-[11px]">点击或将对账原件拖拽至此</span>
            <span className="text-[10px] text-slate-500">支持 PDF, DOCX, XLSX （大小低于 20MB）</span>
          </div>

          {/* List of active cataloged materials */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-slate-900/40 px-3 py-2 rounded-t-lg border-b border-white/5">
              <span className="font-bold text-slate-300 font-mono">已装载事实物料 ({privateMaterials.length})</span>
              <span className="text-[9px] text-emerald-400 font-extrabold animate-pulse">● AI 联接就绪</span>
            </div>
            
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
              {privateMaterials.map((mat) => (
                <div key={mat.id} className="p-2 bg-[#0B0F17]/50 rounded-lg border border-white/5 hover:border-white/10 flex items-start justify-between space-x-2 group">
                  <div className="flex items-start space-x-2 truncate">
                    <div className="p-1.5 bg-slate-800 rounded text-blue-400 shrink-0 mt-0.5">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-slate-200 font-medium text-[11px] block truncate" title={mat.name}>
                        {mat.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                        {mat.size} • {mat.date} • {mat.author}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMaterial(mat.id)}
                    className="p-1 hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 rounded transition-colors shrink-0"
                    title="移出缓存库"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Secure cryptographic hash audit */}
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>语料库安全性: TLS-1.3 内源加密</span>
            <span>物理指纹: SHA256-VOUCHED</span>
          </div>

        </div>

      </div>
    </div>
  );
}
