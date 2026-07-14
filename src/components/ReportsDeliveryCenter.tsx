import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Eye, Download, Sparkles, Layers, CheckCircle2, 
  HelpCircle, Calendar, ArrowUpRight, ArrowRight, ShieldCheck, RefreshCw, 
  FileArchive, Trash2, FileSpreadsheet, UploadCloud, Lock, Unlock, Edit2, 
  Copy, Share2, History, ChevronLeft, ChevronRight, Image as ImageIcon, Check, Info, FileText as WordIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ReportsDeliveryCenterProps {
  onNavigate: (page: string) => void;
}

export function ReportsDeliveryCenter({ onNavigate }: ReportsDeliveryCenterProps) {
  // 1. Subnavigation state: 'all' | 'weekly' | 'monthly' | 'quarterly' | 'custom'
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'weekly' | 'monthly' | 'quarterly' | 'custom'>('all');
  
  // 2. Flow status filter state: 'all' | 'archived' | 'pending' | 'draft'
  const [flowFilter, setFlowFilter] = useState<'all' | 'archived' | 'pending' | 'draft'>('all');

  // 3. Current active pagination page
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 4. Selected active report for version and AI parsing panel
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-W1');

  // 5. Active report version tab state: 'draft' | 'client_confirmed' | 'final' | 'comparison' | 'edit_logs'
  const [activeVersionTab, setActiveVersionTab] = useState<'draft' | 'client_confirmed' | 'final' | 'comparison' | 'edit_logs'>('final');

  // 6. Seed for "每一次的数据是不一样的" (fluctuating random numbers/insights)
  const [randomSeed, setRandomSeed] = useState<number>(1);
  const [isAiParsing, setIsAiParsing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 7. Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 8. User private uploaded reference materials (Fact Database)
  const [privateMaterials, setPrivateMaterials] = useState<any[]>([
    { id: 'MAT-1', name: '2026款星瑞CMA湿式双离合中低速平顺拥堵路测数据表.xlsx', size: '142 KB', type: 'EXCEL', date: '刚刚', author: '系统内置' },
    { id: 'MAT-2', name: '12万家轿大空间越级对标速腾消费者物理评测拼图.pdf', size: '3.4 MB', type: 'PDF', date: '3小时前', author: '宿主管理员' },
    { id: 'MAT-3', name: '吉利星瑞1.5T扶摇版92号汽油一年实际油耗与维护成本折算表.pdf', size: '1.2 MB', type: 'PDF', date: '昨天', author: '陈利娜' }
  ]);
  const [newMaterialName, setNewMaterialName] = useState<string>('');
  const [newMaterialType, setNewMaterialType] = useState<string>('EXCEL');

  // Modal control for active report reconciliation operations
  const [isOpsModalOpen, setIsOpsModalOpen] = useState<boolean>(false);

  // Historical versions list state with interactive status tags
  const [reportVersions, setReportVersions] = useState<Record<string, any[]>>({
    'REP-W1': [
      { id: 'ver-1', code: 'v1.0.0-Draft', label: 'AI初稿', time: '2026-07-06 18:00', creator: '系统AI', status: '已生成', note: '抓取到1.2k条评测数据并自动纠偏拟合。' },
      { id: 'ver-2', code: 'v1.1.0-Review', label: '内部评审版', time: '2026-07-09 11:20', creator: '陈利娜', status: '已确认', note: '分析师根据导入路测Excel纠偏双离合中低速平顺性偏见。' },
      { id: 'ver-3', code: 'v1.2.0-Final', label: '官方交付版', time: '2026-07-13 08:30', creator: '系统内置', status: '待会签', note: '提报至吉利星瑞品牌组，待负责人会签签署归档。' }
    ],
    'REP-M1': [
      { id: 'ver-4', code: 'v1.0.0', label: 'AI初稿', time: '2026-05-28 14:00', creator: 'AI分析师', status: '已生成', note: '提取冰箱全网声望对账自动生成。' },
      { id: 'ver-5', code: 'v2.0.0-Final', label: '官方交付版', time: '2026-06-01 10:15', creator: 'AI分析师', status: '已归档', note: '三方签署完成，物理成果包完成封签并归档。' }
    ],
    'REP-M2': [
      { id: 'ver-6', code: 'v1.0.0', label: 'AI初稿', time: '2026-06-25 09:30', creator: '系统AI', status: '已生成', note: '美菱冰箱与奥克斯空调首次拟合对账底稿。' },
      { id: 'ver-7', code: 'v1.1.0-Final', label: '内部评审版', time: '2026-07-01 14:20', creator: '陈利娜', status: '待会签', note: '提交公关总监复审，核准大模型召回声望对比表格。' }
    ]
  });

  const [newVersionCode, setNewVersionCode] = useState<string>('v1.3.0');
  const [newVersionLabel, setNewVersionLabel] = useState<string>('最终交付版');
  const [newVersionStatus, setNewVersionStatus] = useState<string>('待会签');
  const [newVersionNote, setNewVersionNote] = useState<string>('');

  const getVersionsForReport = (reportId: string) => {
    if (reportVersions[reportId]) {
      return reportVersions[reportId];
    }
    // Lazy fallback generator for other reports
    const reportItem = reports.find(r => r.id === reportId);
    return [
      { id: 'ver-def1', code: 'v1.0.0', label: 'AI初稿', time: reportItem ? reportItem.time : '2026-07-13 01:00', creator: '系统AI', status: '草稿', note: '抓取本期监测物料，拟合首次对账底案。' },
      { id: 'ver-def2', code: 'v1.1.0-Final', label: '官方交付版', time: reportItem ? reportItem.time : '2026-07-13 02:00', creator: reportItem ? reportItem.creator : '管理员', status: '已归档', note: '交付对账完成，归档为最终版。' }
    ];
  };

  const handleAddVersion = () => {
    if (!newVersionCode.trim()) {
      showToast("⚠️ 请输入版本代号！", "warning");
      return;
    }
    const currentActiveId = activeReport?.id || 'REP-W1';
    const nVer = {
      id: `ver-${Date.now()}`,
      code: newVersionCode.trim(),
      label: newVersionLabel,
      time: '2026-07-13 刚刚',
      creator: '宿主管理员',
      status: newVersionStatus,
      note: newVersionNote.trim() || '本期增量优化纠偏对账。'
    };
    
    setReportVersions(prev => {
      const existing = prev[currentActiveId] || getVersionsForReport(currentActiveId);
      return {
        ...prev,
        [currentActiveId]: [...existing, nVer]
      };
    });
    setNewVersionCode(`v1.${(reportVersions[currentActiveId]?.length || 2) + 1}.0`);
    setNewVersionNote('');
    showToast(`✅ 新对账版本【${nVer.code}】固化成功，已自动追加至历史版本 ledger！`, "success");
  };

  const handleUpdateVersionStatus = (versionId: string, newStatus: string) => {
    const currentActiveId = activeReport?.id || 'REP-W1';
    setReportVersions(prev => {
      const existing = prev[currentActiveId] || getVersionsForReport(currentActiveId);
      const updated = existing.map(v => v.id === versionId ? { ...v, status: newStatus } : v);
      return {
        ...prev,
        [currentActiveId]: updated
      };
    });
    showToast(`📝 已将版本状态成功标记为 【${newStatus}】`, "success");
  };

  // AI Adjustment Prompt per version
  const [aiPromptInputs, setAiPromptInputs] = useState<Record<string, string>>({});
  const [adjustingVersionId, setAdjustingVersionId] = useState<string | null>(null);
  const [showPromptForVerId, setShowPromptForVerId] = useState<string | null>(null);

  const handleAiAdjustVersion = (versionId: string) => {
    const promptText = aiPromptInputs[versionId]?.trim();
    if (!promptText) {
      showToast("⚠️ 请输入AI微调提示词！", "warning");
      return;
    }

    setAdjustingVersionId(versionId);
    showToast("🤖 AI 正在根据提示词微调对账底稿数据并生成新历史版本...", "info");

    setTimeout(() => {
      const currentActiveId = activeReport?.id || 'REP-W1';
      // Find the base version to increment from
      const versions = reportVersions[currentActiveId] || getVersionsForReport(currentActiveId);
      const baseVer = versions.find(v => v.id === versionId) || versions[versions.length - 1];
      
      // Compute new code
      const baseCode = baseVer.code.split('-')[0] || 'v1.0.0';
      const parts = baseCode.replace('v', '').split('.');
      const major = parts[0] || '1';
      const minor = parts[1] || '0';
      const patch = parseInt(parts[2] || '0', 10) + 1;
      const newCode = `v${major}.${minor}.${patch}-AI`;

      const newVer = {
        id: `ver-ai-${Date.now()}`,
        code: newCode,
        label: 'AI微调版',
        time: '2026-07-13 刚刚',
        creator: 'AI Agent',
        status: '已生成',
        note: `AI根据提示词【${promptText}】重组对账，调优部分物理参数引流可信度。`
      };

      setReportVersions(prev => {
        const existing = prev[currentActiveId] || getVersionsForReport(currentActiveId);
        return {
          ...prev,
          [currentActiveId]: [...existing, newVer]
        };
      });

      // Clear input and state
      setAiPromptInputs(prev => ({ ...prev, [versionId]: '' }));
      setAdjustingVersionId(null);
      setShowPromptForVerId(null);
      
      // Update report score slightly to demonstrate AI change!
      setReports(prev => prev.map(r => r.id === currentActiveId ? {
        ...r,
        baseScore: Math.min(100, r.baseScore + 0.5)
      } : r));

      showToast(`✨ 新历史版本【${newCode}】生成成功！已根据提示词完成物理纠偏与对账对齐！`, "success");
    }, 1200);
  };

  const handleApproveVersion = (versionId: string) => {
    const currentActiveId = activeReport?.id || 'REP-W1';
    setReportVersions(prev => {
      const existing = prev[currentActiveId] || getVersionsForReport(currentActiveId);
      return {
        ...prev,
        [currentActiveId]: existing.map(v => v.id === versionId ? { ...v, status: '已确认' } : v)
      };
    });
    showToast("✅ 该对账版本已被审核通过，进入官方交付链状态！", "success");
  };

  const handleClientSignOff = () => {
    const reportId = activeReport?.id;
    if (!reportId) return;
    
    // Update sign-off status
    setSignOffStatus(prev => ({
      ...prev,
      [reportId]: {
        analyst: true,
        manager: true,
        client: true
      }
    }));

    // Update reports state to '已归档' and lock it
    setReports(prev => prev.map(r => r.id === reportId ? { 
      ...r, 
      status: '已归档', 
      flowStatus: 'archived',
      isLocked: true 
    } : r));

    // Also update current selected report's corresponding last version note in table to reflect signature
    setReportVersions(prev => {
      const existing = prev[reportId] || getVersionsForReport(reportId);
      const updated = existing.map((v, i) => {
        if (i === existing.length - 1) {
          return {
            ...v,
            status: '已归档',
            note: `三方会签归档成功。电子指纹已锁存，品牌方代表已完成会签。`
          };
        }
        return v;
      });
      return {
        ...prev,
        [reportId]: updated
      };
    });

    showToast(`✨ 品牌会签签署成功！本期报告【${activeReport?.name}】已被官方归档锁定，防止篡改！`, "success");
  };

  // 9. Core Delivery Reports State
  const [reports, setReports] = useState<any[]>([
    {
      id: 'REP-W1',
      name: '星瑞双离合平顺性周报 (W28)',
      type: '周报',
      brand: '吉利星瑞',
      period: '2026-07-06 ~ 2026-07-12',
      time: '2026-07-13 08:30',
      status: '已生成', // 生成中 | 待确认 | 已生成 | 已分享 | 已归档 | 生成失败
      creator: '系统内置',
      category: 'weekly',
      flowStatus: 'archived', // archived | pending | draft
      isLocked: false,
      baseScore: 91.2,
      chartData: [72, 78, 83, 85, 89, 90, 91.2]
    },
    {
      id: 'REP-M1',
      name: '5月四川长虹美菱冰箱 AIGC 推荐引流声望极优月度报告',
      type: '月报',
      brand: '长虹美菱',
      period: '2026-05-01 ~ 2026-05-31',
      time: '2026-06-01 10:15',
      status: '已归档',
      creator: 'AI分析师',
      category: 'monthly',
      flowStatus: 'archived',
      isLocked: true,
      baseScore: 89.4,
      chartData: [81, 84, 87, 89.4]
    },
    {
      id: 'REP-M2',
      name: '6月 美菱冰箱/奥克斯空调大模型声望优化对账月报',
      type: '月报',
      brand: '长虹美菱/奥克斯',
      period: '2026-06-01 ~ 2026-06-30',
      time: '2026-07-01 14:20',
      status: '待确认',
      creator: '陈利娜',
      category: 'monthly',
      flowStatus: 'pending',
      isLocked: false,
      baseScore: 91.8,
      chartData: [82, 85, 88, 91.8]
    },
    {
      id: 'REP-Q1',
      name: '2026 Q2 家电/出行双链路大模型推荐份额与声望对账报告',
      type: '季报',
      brand: '吉利/美菱',
      period: '2026-04-01 ~ 2026-06-30',
      time: '2026-07-02 09:00',
      status: '已分享',
      creator: '系统内置',
      category: 'quarterly',
      flowStatus: 'archived',
      isLocked: false,
      baseScore: 85.2,
      chartData: [74, 78, 85.2]
    },
    {
      id: 'REP-C1',
      name: '星瑞市区双离合拥堵谣言语义破局专案草稿',
      type: '自定义周期',
      brand: '吉利星瑞',
      period: '2026-07-10 ~ 2026-07-13',
      time: '2026-07-13 11:00',
      status: '生成中',
      creator: '宿主管理员',
      category: 'custom',
      flowStatus: 'draft',
      isLocked: false,
      baseScore: 78.4,
      chartData: [45, 62, 78.4]
    }
  ]);

  // 10. Digital Sign-Off Status for each report
  const [signOffStatus, setSignOffStatus] = useState<Record<string, { analyst: boolean; manager: boolean; client: boolean }>>({
    'REP-W1': { analyst: true, manager: true, client: false },   // Client pending for sign-off
    'REP-M1': { analyst: true, manager: true, client: true },    // Fully signed-off & locked
    'REP-M2': { analyst: true, manager: false, client: false },  // Manager pending
    'REP-C1': { analyst: false, manager: false, client: false }, // Brand new draft
  });

  // Handler for adding database fact files
  const handleAddMaterial = () => {
    if (!newMaterialName.trim()) {
      showToast("⚠️ 请输入物料名称或文件全称！", "warning");
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
    showToast(`🎉 成功导入 [${matObj.name}] 至云端对账数据库！已触发AI同步对齐。`, "success");
  };

  const handleRemoveMaterial = (id: string) => {
    setPrivateMaterials(prev => prev.filter(m => m.id !== id));
    showToast("🧹 已移出缓存事实数据库", "info");
  };

  // Toggle report lock
  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReports(prev => prev.map(r => r.id === id ? { ...r, isLocked: !r.isLocked } : r));
    const target = reports.find(r => r.id === id);
    if (target) {
      showToast(target.isLocked ? `🔓 报告【${target.name}】已成功解锁` : `🔒 报告【${target.name}】已成功锁定，防止编辑修改`, "info");
    }
  };

  // Inline edit report name
  const handleEditReportName = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = reports.find(r => r.id === id);
    if (target?.isLocked) {
      showToast("⚠️ 该报告已被锁定，请解锁后再进行修改", "warning");
      return;
    }
    const newName = prompt("请修改报告交付名称：", target?.name);
    if (newName && newName.trim()) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, name: newName.trim(), time: '刚刚修改' } : r));
      showToast("📝 报告交付名称已更新！", "success");
    }
  };

  // Audit pass state change
  const handleAuditApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: '已归档', flowStatus: 'archived' } : r));
    showToast("✅ 报告通过最终审核提报，已流转至‘已归档发布成果报告’", "success");
  };

  // Copy report as new
  const handleCopyAsNew = (report: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `REP-${Date.now()}`;
    const newReport = {
      ...report,
      id: newId,
      name: `${report.name} (复制新版)`,
      time: '2026-07-13 刚刚',
      status: '已生成',
      flowStatus: 'draft',
      isLocked: false
    };
    setReports(prev => [newReport, ...prev]);
    setSelectedReportId(newId);
    showToast("📋 已复制为本期新草稿报告！", "success");
  };

  // Delete a report from state
  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = reports.find(r => r.id === id);
    if (target?.isLocked) {
      showToast("⚠️ 该报告已被锁定，请先解锁后再进行删除操作", "warning");
      return;
    }
    if (window.confirm(`确定要删除报告【${target?.name}】吗？此操作将立即从交付中心移除。`)) {
      setReports(prev => prev.filter(r => r.id !== id));
      if (selectedReportId === id) {
        const remaining = reports.filter(r => r.id !== id);
        if (remaining.length > 0) {
          setSelectedReportId(remaining[0].id);
        }
      }
      showToast("🗑️ 报告已成功删除", "success");
    }
  };

  // Triggering dynamic AI update to verify "每一次的数据是不一样的"
  const triggerAiReAnalysis = () => {
    setIsAiParsing(true);
    showToast("🤖 AI 正在基于我方最新事实数据库进行变频深度解析并绘制矢量云图...", "info");
    setTimeout(() => {
      setRandomSeed(prev => prev + 1);
      setIsAiParsing(false);
      showToast("✨ AI 趋势对账与可视化排版渲染完成！已重新抓取非平衡因子。", "success");
    }, 1200);
  };

  // Helper selectors
  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Filtering reports based on Sub Tab & Flow status tab & Search query
  const filteredReports = reports.filter(r => {
    const categoryMatch = activeSubTab === 'all' || r.category === activeSubTab;
    const flowMatch = flowFilter === 'all' || r.flowStatus === flowFilter;
    const searchMatch = !searchQuery.trim() || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && flowMatch && searchMatch;
  });

  // Simple Pagination slicing
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const displayedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate slightly dynamic score for the selected report to demonstrate live recalculation
  const getDynamicScore = (base: number) => {
    const variance = (Math.sin(randomSeed + base) * 2.8);
    return (base + variance).toFixed(1);
  };

  // Generate dynamic chart points based on randomSeed to guarantee dynamic images
  const getDynamicChartPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const variance = (Math.cos(randomSeed + idx) * 3.2);
      return Math.min(100, Math.max(15, Math.round(val + variance)));
    });
  };

  // AI Description Text Variation based on current Seed and Version
  const getDynamicDescription = () => {
    const reportName = activeReport?.name || '选定报告';
    const numFiles = privateMaterials.length;
    
    // Core insights that swap depending on randomSeed
    const insights = [
      "大模型首提占比呈现多维增益，CMA事实物理硬仗已有效吸附，成功压制了由于陈旧评测产生的幻觉。总体推荐满意度达历史最高位。",
      "得益于我方导入的产品参数存证，AI在对比测试中能够精准回答各项物理对仗，并有效矫正了百度、Gemini、Claude中对市区顿挫的固有偏见。",
      "物理链路核验顺利。对账中发现负面语义反链已降至3.1%以下，数据链真实有效，内嵌真实的物理问答反链截图指纹。",
      "多轮次自动化回测显示，通过针对性纠偏词注入，目标主流大模型的召回完整度拉升明显，决策引流精准到达率稳步上扬。"
    ];

    const currentInsight = insights[randomSeed % insights.length];
    const secondaryInsight = insights[(randomSeed + 2) % insights.length];

    switch (activeVersionTab) {
      case 'draft':
        return `【初稿版本】 AI 解析发现：${currentInsight} 当前正基于 ${numFiles} 份我方事实对账原件进行极速拟合。参数正在多维度微调中。`;
      case 'client_confirmed':
        return `【客户确认版】 宿主审核通过。AI 物理诊断提示：${secondaryInsight} 报告指纹 SHA256 加密通过，数据流已固化，可以执行最终导出交付。`;
      case 'final':
        return `【最终交付版】 权威发布对账完毕。AI 精准回显：${currentInsight} ${secondaryInsight} 覆盖6大主流前沿模型，已锁定为对外官方述职底档。`;
      case 'comparison':
        return `【历史版本对比】 相对上期基线，本期 GESI 生态综合提升率达到 +12.4%。事实语义覆盖率同比增长 22.8%。大模型幻觉干扰率从 41.5% 骤降至 6.2%。`;
      case 'edit_logs':
        return `【修改记录日志】 最近一次修改时间: ${activeReport?.time}。修改人: ${activeReport?.creator}。主要记录：根据我方导入的湿式双离合拥堵对账数据表，重构了大模型物理问答对照表格，攻克了由于长尾垃圾文导致的评测偏见。`;
      default:
        return "";
    }
  };

  // Preset quick counts
  const archivedCount = reports.filter(r => r.flowStatus === 'archived').length;
  const pendingCount = reports.filter(r => r.flowStatus === 'pending').length;
  const draftCount = reports.filter(r => r.flowStatus === 'draft').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 🧭 Top Panel / Navigation breadcrumbs matching layout */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-[#111622]/90 border border-white/5 rounded-2xl gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1 text-[11px] font-bold font-mono tracking-widest">
            <span>CLOUDGEO PORTAL • DELIVERABLES DELIVERY CENTER</span>
          </div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight flex items-center">
            成果交付
            <span className="ml-3 px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">交付网关</span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-1 max-w-3xl">
            重新规划并高度整合的报告交付中心。支持周报、月报、季报等多周期报告一键审核、锁定与多版本物理底件（PDF、PPT、数据）导出。
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-end lg:self-center">
          <div className="bg-[#090d16] rounded-lg px-2.5 py-1 border border-white/5 text-[10px] text-slate-400 flex items-center space-x-2 font-mono">
            <span>交付宿主:</span>
            <strong className="text-slate-100 font-sans">星瑞汽车产品组 (品牌A)</strong>
          </div>
          <button 
            onClick={() => onNavigate('generator')}
            className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md select-none border border-white/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            新建自定义汇报
          </button>
        </div>
      </div>

      {/* 📊 Core Delivery Platform Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Report Workspace & Filters */}
        <div className="lg:col-span-9 space-y-6">

          {/* 1. Subnavigation Row (Wireframe: 成果交付, 周报, 月报, 季报, 自定义周期) */}
          <div className="bg-[#111622]/90 border border-white/5 rounded-2xl p-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-black text-slate-300 font-mono tracking-wider px-3 border-r border-white/10 mr-1 flex items-center gap-1">
              <FileArchive className="w-3.5 h-3.5 text-indigo-400" />
              成果交付归档
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: '全部成果' },
                { id: 'weekly', label: '周报' },
                { id: 'monthly', label: '月报' },
                { id: 'quarterly', label: '季报' },
                { id: 'custom', label: '自定义周期' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer",
                    activeSubTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[2%]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Status counts / filter cards row (Wireframe: 已归档发布成果报告, 待审核提报报告, 本期草稿状态) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <button
              onClick={() => {
                setFlowFilter(flowFilter === 'archived' ? 'all' : 'archived');
                setCurrentPage(1);
              }}
              className={cn(
                "p-4 rounded-xl border transition-all text-left relative overflow-hidden group shadow-lg",
                flowFilter === 'archived'
                  ? "bg-emerald-500/[4%] border-emerald-500/30 ring-1 ring-emerald-500/20"
                  : "bg-[#111622]/60 border-white/5 hover:border-white/10 hover:bg-[#111622]/90"
              )}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <span className="text-[10px] text-slate-400 font-bold block mb-1">已归档发布成果报告</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-100">{archivedCount}</span>
                <span className="text-[9px] text-emerald-400 font-mono">份已固化</span>
              </div>
              <div className="text-[9px] text-emerald-500 mt-2 flex items-center gap-1 font-mono">
                <span>● 点击快速过滤</span>
              </div>
            </button>

            <button
              onClick={() => {
                setFlowFilter(flowFilter === 'pending' ? 'all' : 'pending');
                setCurrentPage(1);
              }}
              className={cn(
                "p-4 rounded-xl border transition-all text-left relative overflow-hidden group shadow-lg",
                flowFilter === 'pending'
                  ? "bg-amber-500/[4%] border-amber-500/30 ring-1 ring-amber-500/20"
                  : "bg-[#111622]/60 border-white/5 hover:border-white/10 hover:bg-[#111622]/90"
              )}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <span className="text-[10px] text-slate-400 font-bold block mb-1">待审核提报报告</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-100">{pendingCount}</span>
                <span className="text-[9px] text-amber-400 font-mono">份待审核</span>
              </div>
              <div className="text-[9px] text-amber-500 mt-2 flex items-center gap-1 font-mono">
                <span>⏳ 点击快速过滤</span>
              </div>
            </button>

            <button
              onClick={() => {
                setFlowFilter(flowFilter === 'draft' ? 'all' : 'draft');
                setCurrentPage(1);
              }}
              className={cn(
                "p-4 rounded-xl border transition-all text-left relative overflow-hidden group shadow-lg",
                flowFilter === 'draft'
                  ? "bg-indigo-500/[4%] border-indigo-500/30 ring-1 ring-indigo-500/20"
                  : "bg-[#111622]/60 border-white/5 hover:border-white/10 hover:bg-[#111622]/90"
              )}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <span className="text-[10px] text-slate-400 font-bold block mb-1">本期草稿状态</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-100">{draftCount}</span>
                <span className="text-[9px] text-indigo-400 font-mono">份草稿编制中</span>
              </div>
              <div className="text-[9px] text-indigo-400 mt-2 flex items-center gap-1 font-mono">
                <span>⚡ 点击快速过滤</span>
              </div>
            </button>

          </div>

          {/* 3. Report List Container (Wireframe: 报告列表) */}
          <div className="bg-[#111622]/90 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-900/50 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <span className="text-xs font-black text-slate-300 font-mono flex items-center gap-1.5 shrink-0">
                <FileArchive className="w-4 h-4 text-indigo-400" />
                宿主交付报告列表
              </span>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                {/* Search Bar Input */}
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="🔍 输入关键词搜索报告名/品牌/类型..."
                    className="w-full bg-[#090d16] border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-[9px] text-slate-400 hover:text-white transition-colors"
                    >
                      清除
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 font-mono text-right shrink-0">
                  筛选结果: <span className="text-indigo-400 font-bold">{filteredReports.length}</span> 份报告
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-950/20 text-slate-500 border-b border-white/5 text-[9.5px] uppercase font-bold font-mono">
                    <th className="py-2.5 px-4">报告名称</th>
                    <th className="py-2.5 px-4 text-center">类型</th>
                    <th className="py-2.5 px-4 text-center">所属品牌</th>
                    <th className="py-2.5 px-4">监测周期</th>
                    <th className="py-2.5 px-4">生成时间</th>
                    <th className="py-2.5 px-4 text-center">生成状态</th>
                    <th className="py-2.5 px-4 text-center">创建人</th>
                    <th className="py-2.5 px-4 text-right">操作/快速功能</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedReports.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 text-[11px] font-mono">
                        ⚠️ 没有找到符合该筛选条件的报告档案
                      </td>
                    </tr>
                  ) : (
                    displayedReports.map((report) => {
                      const isSelected = report.id === selectedReportId;
                      
                      // Match status badge style
                      let statusBadge = "";
                      switch (report.status) {
                        case '已归档':
                          statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                          break;
                        case '待确认':
                          statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                          break;
                        case '已生成':
                        case '已分享':
                          statusBadge = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                          break;
                        case '生成中':
                          statusBadge = "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse";
                          break;
                        case '生成失败':
                          statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                          break;
                        default:
                          statusBadge = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                      }

                      return (
                        <tr 
                          key={report.id} 
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setIsOpsModalOpen(true);
                          }}
                          className={cn(
                            "transition-all cursor-pointer group text-[11px]",
                            isSelected 
                              ? "bg-indigo-500/[4%] border-l-2 border-indigo-500" 
                              : "hover:bg-white/[1.5%]"
                          )}
                        >
                          <td className="py-3 px-4 max-w-xs">
                            <div className="flex items-start gap-2">
                              <span className={cn(
                                "p-1 rounded mt-0.5 shrink-0",
                                isSelected ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-400"
                              )}>
                                <FileText className="w-3.5 h-3.5" />
                              </span>
                              <div className="truncate">
                                <span className={cn(
                                  "font-bold block truncate",
                                  isSelected ? "text-indigo-300" : "text-slate-200 group-hover:text-slate-100"
                                )} title={report.name}>
                                  {report.name}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                                  ID: {report.id} {report.isLocked ? "• 🔒 已锁定" : ""}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-400">
                            {report.type}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-300">
                            {report.brand}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {report.period}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono">
                            {report.time}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold border", statusBadge)}>
                              ● {report.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-slate-400">
                            {report.creator}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>

                              {/* 1. Toggle Lock Action */}
                              <button
                                onClick={(e) => handleToggleLock(report.id, e)}
                                className={cn(
                                  "p-1 rounded transition-colors",
                                  report.isLocked 
                                    ? "text-rose-400 hover:bg-rose-500/10" 
                                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                                )}
                                title={report.isLocked ? "解锁报告" : "锁定报告"}
                              >
                                {report.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>

                              {/* 2. Delete Action */}
                              <button
                                onClick={(e) => handleDeleteReport(report.id, e)}
                                className={cn(
                                  "p-1 rounded transition-colors",
                                  report.isLocked
                                    ? "text-slate-600 cursor-not-allowed"
                                    : "text-rose-500/70 hover:bg-rose-500/15 hover:text-rose-400"
                                )}
                                title={report.isLocked ? "已锁定防止误删" : "删除报告"}
                                disabled={report.isLocked}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Direct Reconciliation Ops Modal Trigger */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReportId(report.id);
                                  setIsOpsModalOpen(true);
                                }}
                                className="px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-400 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                                title="编辑报告内容与对账配置"
                              >
                                <Edit2 className="w-3 h-3" />
                                编辑
                              </button>

                              {/* 3. Audit approve */}
                              {report.flowStatus === 'pending' && (
                                <button
                                  onClick={(e) => handleAuditApprove(report.id, e)}
                                  className="px-1.5 py-0.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-400 rounded text-[9.5px] font-black transition-all"
                                  title="一键审核通过"
                                >
                                  审核通过
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls (Wireframe: 下一页 页码) */}
            <div className="p-4 bg-slate-900/30 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(filteredReports.length, currentPage * itemsPerPage)} 项 / 共 {filteredReports.length} 项
              </span>

              <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  上一页
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "w-6 py-1 rounded text-center font-bold transition-colors",
                      currentPage === p 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    )}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center"
                >
                  下一页
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Action buttons bar underneath list (Turned into Compact Selection & Trigger Bar) */}
          <div className="bg-gradient-to-r from-slate-900/90 to-[#111622]/90 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-indigo-400 font-mono font-bold uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  CURRENT SELECTION
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  ID: {activeReport?.id}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-200">
                当前对账操作项: <span className="text-white hover:underline cursor-pointer" onClick={() => setIsOpsModalOpen(true)}>{activeReport?.name}</span>
              </h4>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="text-[9.5px] text-slate-500 font-mono block">综合得分 GESI:</span>
                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {getDynamicScore(activeReport?.baseScore || 90.0)}
                </span>
              </div>
              
              <button
                onClick={() => setIsOpsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition-all shadow-md border border-white/10 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] animate-pulse-subtle"
              >
                <Layers className="w-3.5 h-3.5" />
                🎯 对账操作弹窗
              </button>
            </div>
          </div>

          {/* 5. Report Version Management & Status Reconciliation List Panel has been transferred directly to the Interactive Reconciliation modal */}

        </div>

        {/* RIGHT COLUMN: Retained Our Fact Database Import Section (我方事实数据库导入) */}
        <div className="lg:col-span-3 bg-[#111622]/90 border border-white/5 p-5 rounded-2xl space-y-5 text-xs shadow-xl">
          <div>
            <div className="flex items-center space-x-1.5 mb-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono">
                我方事实数据库导入
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              用户可随时追加并向 AI 算网注入我方的评测数据、实测表格及官方规格。报告编制引擎及纠偏对账模型在后续运算时，将自动参考本底物料，大幅拉升数据报告可信度。
            </p>
          </div>

          {/* Interactive Material Input Form */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 space-y-3">
            <span className="text-[10px] text-emerald-400 font-black block font-mono uppercase tracking-wider">
              ➕ 新增私域事实数据
            </span>
            
            <div className="space-y-1.5">
              <label className="block text-slate-500 font-bold text-[9.5px]">文件名称/事实主题</label>
              <input
                type="text"
                className="w-full bg-[#090d16] text-white p-2 border border-white/10 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                placeholder="如: 2026星瑞CMA拥堵路测数据"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-500 font-bold text-[9.5px]">文件类型</label>
              <select
                className="w-full bg-[#090d16] text-white p-1.5 border border-white/10 rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-500"
                value={newMaterialType}
                onChange={(e) => setNewMaterialType(e.target.value)}
              >
                <option value="EXCEL">Excel 物理表格 (.xlsx)</option>
                <option value="PDF">PDF 官方产品规格书 (.pdf)</option>
                <option value="WORD">Word 用户口碑及评测文 (.docx)</option>
              </select>
            </div>

            <button
              onClick={handleAddMaterial}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-lg text-xs transition-all shadow-md cursor-pointer"
            >
              🚀 导入至本期 AI 缓存数据库
            </button>
          </div>

          {/* Drag & Drop Simulation Panel */}
          <div 
            onClick={() => {
              const res = prompt("【模拟文件选择】请输入您想要导入的文件名：");
              if (res) {
                setNewMaterialName(res);
                showToast(`已选中本地文件: "${res}"。请修改类型并点击上方导入。`, "info");
              }
            }}
            className="p-4 bg-slate-950/20 border border-dashed border-white/10 hover:border-emerald-500/30 rounded-xl flex flex-col items-center justify-center space-y-1.5 cursor-pointer group transition-colors text-center shadow-inner"
          >
            <UploadCloud className="w-7 h-7 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="text-slate-300 font-bold text-[10.5px]">点击或拖拽新文件至此</span>
            <span className="text-[9px] text-slate-500 font-mono">支持 XLSX, PDF, DOCX (最大 20MB)</span>
          </div>

          {/* List of Cataloged Fact Files */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-slate-950/30 px-3 py-2 rounded-t-lg border-b border-white/5 text-[10px] font-mono">
              <span className="font-bold text-slate-300">事实物料存储库 ({privateMaterials.length})</span>
              <span className="text-[9px] text-emerald-400 font-extrabold animate-pulse">● 已连线挂载</span>
            </div>
            
            <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar">
              {privateMaterials.map((mat) => (
                <div key={mat.id} className="p-2 bg-[#090d16]/60 rounded-lg border border-white/5 hover:border-white/10 flex items-start justify-between space-x-2 group">
                  <div className="flex items-start space-x-2 truncate">
                    <div className="p-1.5 bg-slate-800 rounded text-blue-400 shrink-0 mt-0.5">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-slate-200 font-medium text-[10.5px] block truncate" title={mat.name}>
                        {mat.name}
                      </span>
                      <span className="text-[8.5px] text-slate-500 font-mono block mt-0.5">
                        {mat.size} • {mat.date} • {mat.author}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMaterial(mat.id)}
                    className="p-1 hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 rounded transition-colors shrink-0 cursor-pointer"
                    title="移出事实库"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Secure cryptographic hash audit */}
          <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>存储状态: TLS-1.3 闭环加密</span>
            <span>指纹校验: SHA256-OK</span>
          </div>

        </div>

      </div>

      {/* 🎯 Interactive Reconciliation Operations Popup Modal */}
      {isOpsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e121d] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#141824] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <Layers className="w-5 h-5" />
                <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                  🎯 当前对账操作中心 (Interactive Reconciliation Portal)
                </h3>
              </div>
              <button 
                onClick={() => setIsOpsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-lg font-bold font-mono px-2"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs">
              {/* Selected Report Metadata Summary */}
              <div className="bg-[#070a10] border border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-indigo-400 font-mono font-bold block uppercase tracking-wider">SELECTED TARGET REPORT</span>
                    <h4 className="text-xs font-black text-slate-100 font-sans leading-tight">
                      {activeReport?.name}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    {activeReport?.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[10px] font-mono text-slate-400 border-t border-white/5">
                  <div>
                    <span className="text-slate-500 block">监测周期:</span>
                    <span className="text-slate-300 font-bold">{activeReport?.period}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">所属品牌:</span>
                    <span className="text-slate-300 font-bold">{activeReport?.brand}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">生成时间:</span>
                    <span className="text-slate-300 font-bold">{activeReport?.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">交付得分 (GESI):</span>
                    <span className="text-emerald-400 font-bold">{getDynamicScore(activeReport?.baseScore || 90.0)}%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic AI Status Panel */}
              <div className="p-3 bg-[#111622] border border-white/5 rounded-lg space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-indigo-300 font-bold font-mono">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                  <span>AI ENGINE DIAGNOSTICS & TELEMETRY</span>
                </div>
                <p className="text-slate-300 text-[10px] leading-relaxed">
                  该报告已经过我方 <span className="text-emerald-400">{privateMaterials.length}</span> 份私域事实对账文件（包括双离合路测、空间越级数据等）的自适应比对及纠偏，语义可信度达 <strong>98.4%</strong>，可立即交付。
                </p>
              </div>

              {/* Action Button Grid */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-black tracking-wider block">
                  🚀 执行物理操作与多格式导出
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. 预览网页 */}
                  <button
                    onClick={() => {
                      setIsOpsModalOpen(false);
                      if (activeReport?.category === 'monthly') {
                        onNavigate('monthly');
                      } else if (activeReport?.category === 'quarterly') {
                        onNavigate('quarterly');
                      } else {
                        onNavigate('weekly');
                      }
                      showToast("👁️ 正在加载网页版交付底稿渲染图层", "info");
                    }}
                    className="p-3 bg-[#111622] hover:bg-indigo-600 border border-white/5 hover:border-indigo-500 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <Eye className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">预览网页版交付图层</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        高保真 HTML 画布，可查看精细指标、声望趋势、归因和证据快照。
                      </span>
                    </div>
                  </button>

                  {/* 2. 编辑名称 */}
                  <button
                    onClick={(e) => {
                      setIsOpsModalOpen(false);
                      handleEditReportName(activeReport?.id, e);
                    }}
                    className="p-3 bg-[#111622] hover:bg-slate-800 border border-white/5 hover:border-white/20 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mt-0.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">重命名对账报告</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        一键修改报告标题或调整周期归档标识。
                      </span>
                    </div>
                  </button>

                  {/* 3. 重新生成AI解析 */}
                  <button
                    onClick={() => {
                      triggerAiReAnalysis();
                      setIsOpsModalOpen(false);
                    }}
                    disabled={isAiParsing}
                    className="p-3 bg-[#111622] hover:bg-blue-600 border border-white/5 hover:border-blue-500 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white disabled:opacity-45"
                  >
                    <RefreshCw className={cn("w-4 h-4 mt-0.5 shrink-0 text-blue-400 group-hover:scale-110 transition-transform", isAiParsing ? "animate-spin" : "")} />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">重新生成AI解析与对账</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        强制触发布局与数值微调，生成全新对账趋势文字及矢量配图。
                      </span>
                    </div>
                  </button>

                  {/* 4. 复制为新报告 */}
                  <button
                    onClick={(e) => {
                      setIsOpsModalOpen(false);
                      handleCopyAsNew(activeReport, e);
                    }}
                    className="p-3 bg-[#111622] hover:bg-emerald-600 border border-white/5 hover:border-emerald-500 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <Copy className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">克隆/复制为新报告</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        以当前对账状态为蓝本，克隆出一份全新周期的交付报告草稿。
                      </span>
                    </div>
                  </button>

                  {/* 5. 下载 PDF */}
                  <button
                    onClick={() => {
                      showToast(`📥 PDF底稿导出成功！指纹: SHA-PDF-${activeReport?.id}`, "success");
                      setIsOpsModalOpen(false);
                    }}
                    className="p-3 bg-[#111622] hover:bg-slate-800 border border-white/5 hover:border-white/20 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <Download className="w-4 h-4 mt-0.5 shrink-0 text-red-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">导出为交付级 PDF 底稿</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        标准排版A4双栏设计，直接附带我方事实引用和AI对比表格。
                      </span>
                    </div>
                  </button>

                  {/* 6. 下载 PPT */}
                  <button
                    onClick={() => {
                      showToast(`📥 PPT幻灯片版本汇编完成，已触发浏览器自动下载！`, "success");
                      setIsOpsModalOpen(false);
                    }}
                    className="p-3 bg-[#111622] hover:bg-slate-800 border border-white/5 hover:border-white/20 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <Download className="w-4 h-4 mt-0.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">导出为汇报版 PPT 幻灯片</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        适合投影及高管述职，包含精简大纲及数据大字报板式。
                      </span>
                    </div>
                  </button>

                  {/* 7. 下载原始数据 */}
                  <button
                    onClick={() => {
                      showToast(`📥 已导出 .xlsx 物理明细对账表单`, "success");
                      setIsOpsModalOpen(false);
                    }}
                    className="p-3 bg-[#111622] hover:bg-slate-800 border border-white/5 hover:border-white/20 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <FileSpreadsheet className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">导出原始 Excel 对账明细</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        导出包含全部底层事实句和模型对比的完整原始对账透视表。
                      </span>
                    </div>
                  </button>

                  {/* 8. 分享链接 */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://ais-pre.cloudgeo.run/report/${activeReport?.id}`);
                      showToast("🔗 网页对账快照快链已拷贝至剪贴板，可供外部公关及客户直接核对！", "success");
                      setIsOpsModalOpen(false);
                    }}
                    className="p-3 bg-[#111622] hover:bg-slate-800 border border-white/5 hover:border-white/20 rounded-xl transition-all text-left flex items-start gap-2.5 group text-slate-300 hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div className="space-y-0.5">
                      <span className="font-bold block text-[11px]">获取对外分享极速快链接</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-white/80 block leading-normal">
                        生成免登录直接查看网页版交付页面的专属安全哈希短链。
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Transferred Audit Trail & Version Status Ledger */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-black block font-mono uppercase tracking-wider flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    报告版本管理与状态对账清单 (Audit Trail & Version Status Ledger)
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    直接集成于编辑面板 • 实时修订纠偏
                  </span>
                </div>

                <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-950/20">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-500 border-b border-white/5 text-[9px] uppercase font-bold font-mono">
                        <th className="py-2 px-3">版本代号</th>
                        <th className="py-2 px-3">版本类型</th>
                        <th className="py-2 px-3 text-center">状态</th>
                        <th className="py-2 px-3">更新时间</th>
                        <th className="py-2 px-3">修正说明与审计日志</th>
                        <th className="py-2 px-3 text-right">对账交付操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[10px]">
                      {getVersionsForReport(activeReport?.id).map((ver) => {
                        const isExpanded = showPromptForVerId === ver.id;
                        return (
                          <React.Fragment key={ver.id}>
                            <tr className="hover:bg-white/[1.5%] transition-colors">
                              <td className="py-2 px-3 font-mono font-bold text-indigo-400">
                                {ver.code}
                              </td>
                              <td className="py-2 px-3">
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[8.5px] font-bold font-sans",
                                  ver.label === '官方交付版' ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" :
                                  ver.label === '内部评审版' ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" :
                                  "bg-slate-800 text-slate-400 border border-slate-700"
                                )}>
                                  {ver.label}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[8px] font-bold border",
                                  ver.status === '已归档' || ver.status === '已交付' || ver.status === '已确认' ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" :
                                  ver.status === '待会签' || ver.status === '待确认' ? "text-amber-400 border-amber-500/30 bg-amber-500/5 animate-pulse" :
                                  "text-slate-400 border-white/10 bg-white/5"
                                )}>
                                  ● {ver.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-500 text-[9px]">
                                {ver.time}
                              </td>
                              <td className="py-2 px-3 text-slate-300 leading-normal max-w-[150px] truncate" title={ver.note}>
                                {ver.note}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* 审核按钮 */}
                                  {ver.status !== '已确认' && ver.status !== '已归档' && (
                                    <button
                                      onClick={() => handleApproveVersion(ver.id)}
                                      className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold transition-all"
                                      title="审核通过该版本"
                                    >
                                      审核
                                    </button>
                                  )}
                                  
                                  {/* AI微调按钮 */}
                                  <button
                                    onClick={() => setShowPromptForVerId(isExpanded ? null : ver.id)}
                                    className={cn(
                                      "px-1.5 py-0.5 rounded text-[9px] font-bold transition-all flex items-center gap-0.5",
                                      isExpanded 
                                        ? "bg-amber-600 text-white" 
                                        : "bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-400"
                                    )}
                                    title="输入提示词让AI微调本版"
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    AI微调
                                  </button>

                                  <button
                                    onClick={() => showToast(`📂 已切换至历史版本【${ver.code}】进行对账渲染基线对照`, "info")}
                                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold transition-all"
                                    title="载入基线对照"
                                  >
                                    载入
                                  </button>
                                  <button
                                    onClick={() => showToast(`📥 触发版本【${ver.code}】的物理底稿包下载`, "success")}
                                    className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded text-[9px] transition-all"
                                    title="下载此版"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expanded AI prompt panel */}
                            {isExpanded && (
                              <tr className="bg-indigo-500/[2%] border-l-2 border-indigo-500">
                                <td colSpan={6} className="p-3 bg-[#111422]/70 text-left">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9.5px] font-bold text-indigo-300 flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                        <span>大语言模型底稿自适应重构 (AI Prompt-Based Revision)</span>
                                      </span>
                                      <span className="text-[8.5px] text-slate-500 font-mono">基准版本: {ver.code}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={aiPromptInputs[ver.id] || ""}
                                        onChange={(e) => setAiPromptInputs(prev => ({ ...prev, [ver.id]: e.target.value }))}
                                        placeholder="输入您想调整的提示词（如: '淡化中低速拥堵顿挫描述'，'重构舒适性评分使其符合我方最新评测'）"
                                        className="flex-1 bg-[#090d16] text-white px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500"
                                      />
                                      <button
                                        onClick={() => handleAiAdjustVersion(ver.id)}
                                        disabled={adjustingVersionId === ver.id}
                                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                      >
                                        {adjustingVersionId === ver.id ? (
                                          <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            <span>调整中...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                                            <span>确定调整</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#0e121d] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>当前报告安全校验指纹: SHA256-{activeReport?.id}</span>
              <button 
                onClick={() => setIsOpsModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all font-bold font-sans hover:text-white"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 Aesthetic Custom Toast notifications */}
      {toast && (
        <div className={cn(
          "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl border flex items-center space-x-2.5 z-50 animate-fade-in text-xs max-w-sm",
          toast.type === 'success' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
          toast.type === 'info' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" :
          "bg-amber-500/10 border-amber-500/30 text-amber-300"
        )}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
