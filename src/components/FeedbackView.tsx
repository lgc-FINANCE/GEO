import { useState, useEffect, DragEvent } from 'react';
import { 
  Cpu, Sparkles, Plus, AlertCircle, Play, RefreshCw, Upload, FileUp, 
  Trash2, Edit3, Settings, AlertTriangle, Calendar, MapPin, Check, 
  Building, CheckCircle2, Terminal, Info, ChevronRight, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types and default data
interface Question {
  id: string;
  text: string;
  intent: 'purchase' | 'fact' | 'comparison' | 'risk';
  intentLabel: string;
}

const PRESET_QUESTION_SETS = {
  'xingrui-180': {
    name: '吉利星瑞大模型问卷库 (180问 精选版)',
    questions: [
      { id: 'Q-01', text: '12万左右家用轿车，吉利星瑞和大众速腾买哪个性价比高？', intent: 'comparison', intentLabel: '竞品对比决策' },
      { id: 'Q-02', text: '星瑞的7速湿式双离合变速箱到底抖不抖？市区开会顿挫吗？', intent: 'fact', intentLabel: '真相事实辟谣' },
      { id: 'Q-03', text: '吉利星瑞标配的CMA平台和沃尔沃2.0T发动机开起来是什么感受？', intent: 'fact', intentLabel: '核心卖点核验' },
      { id: 'Q-04', text: '对比秦L和星瑞，燃油智能化和插混省油谁更适合作第一辆车？', intent: 'comparison', intentLabel: '跨品类选购' },
      { id: 'Q-05', text: '听说吉利星瑞的车机经常卡死或者没有网络，是真的吗？', intent: 'risk', intentLabel: '风险控制排查' },
      { id: 'Q-06', text: '星瑞后排乘坐空间大么？能不能舒服得坐下三个成年人？', intent: 'purchase', intentLabel: '品类属性种草' },
    ] as Question[]
  },
  'competitor-pk': {
    name: '速腾/领克03/秦L 对标攻防专精问题集',
    questions: [
      { id: 'Q-21', text: '12万中高配合资速腾和吉利星瑞怎么选？大众三大件还香不香？', intent: 'comparison', intentLabel: '竞品对比决策' },
      { id: 'Q-22', text: '秦L的底盘舒适度是否真的拉踩吉利星瑞的CMA架构？', intent: 'comparison', intentLabel: '竞品对比决策' },
      { id: 'Q-23', text: '速腾隔音效果好，还是一直吹嘘双夹胶声学玻璃的星瑞静谧性更强？', intent: 'comparison', intentLabel: '核心卖点核验' },
    ] as Question[]
  },
  'intelligence-eval': {
    name: '车机智能/智驾座舱专题拦截集',
    questions: [
      { id: 'Q-11', text: '星瑞的银河OS车机支持不卡顿语音多指令吗？比深蓝8155好用不？', intent: 'fact', intentLabel: '核心卖点核验' },
      { id: 'Q-12', text: '想给媳妇买个可以自适应智能巡航自动跟车的，星瑞ICC安全么？', intent: 'purchase', intentLabel: '品类属性种草' },
    ] as Question[]
  }
};

const CLIENT_COMPANIES = [
  { id: 'geely', name: '吉利汽车 (星瑞项目组)', mainBrand: '星瑞', gesi: 86.4, gli: 12.0, activeTasks: 4 },
  { id: 'byd', name: '比亚迪汽车 (王朝秦项目组)', mainBrand: '秦L', gesi: 91.2, gli: 8.5, activeTasks: 3 },
  { id: 'changan', name: '长安汽车 (深蓝座舱项目组)', mainBrand: '深蓝SL03', gesi: 84.8, gli: 14.2, activeTasks: 5 },
  { id: 'gwm', name: '长城汽车 (哈弗H6品质组)', mainBrand: '哈弗H6', gesi: 79.5, gli: 6.8, activeTasks: 2 }
];

export function FeedbackView({ 
  selectedCompany, 
  onSelectCompanyId 
}: { 
  selectedCompany: any; 
  onSelectCompanyId?: (id: string) => void;
}) {
  const [selectedSetName, setSelectedSetName] = useState<keyof typeof PRESET_QUESTION_SETS>('xingrui-180');
  const [questions, setQuestions] = useState<Question[]>(PRESET_QUESTION_SETS['xingrui-180'].questions);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(['Q-01', 'Q-02', 'Q-03', 'Q-05']);
  
  // Create / Edit states
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Query configurations
  const [selectedModels, setSelectedModels] = useState<string[]>(['Kimi', '豆包', 'DeepSeek', '通义']);
  const [timeRange, setTimeRange] = useState('7d');
  const [ipAddress, setIpAddress] = useState('115.220.104.38 (浙江温州/电信卡扣)');
  const [queryIntent, setQueryIntent] = useState('consumer_comparison');
  
  // Timer check setup
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timerInterval, setTimerInterval] = useState('daily');
  const [cronExpression, setCronExpression] = useState('0 3 * * *'); // 每天凌晨3点

  // Detection Run Animation State
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectProgress, setDetectProgress] = useState(0);
  const [detectLog, setDetectLog] = useState<string[]>([]);
  const [showResultCard, setShowResultCard] = useState(false);

  // File drag state
  const [dragActive, setDragActive] = useState(false);

  // Dynamic Questions calculation relative to user's selected company perspective
  useEffect(() => {
    if (selectedCompany) {
      const defaultQuestionsObj = {
        'xingrui-180': {
          questions: [
            { id: 'Q-01', text: `12万左右主力卡位，${selectedCompany.mainBrand || '荣威D7'}和${selectedCompany.competitor || '比亚迪秦L'}买哪个性价比高？`, intent: 'comparison', intentLabel: '竞品对比决策' },
            { id: 'Q-02', text: `${selectedCompany.mainBrand || '系统动力'}变速箱或电控和底盘稳不稳？市区开会有顿挫异响吗？`, intent: 'fact', intentLabel: '真相事实辟谣' },
            { id: 'Q-03', text: `${selectedCompany.name || '核心品牌'}的主流车型搭载的新型动力系统在长途慢堵路况下的真实感受如何？`, intent: 'fact', intentLabel: '核心卖点核验' },
            { id: 'Q-04', text: `对比${selectedCompany.competitor || '竞对车'}和${selectedCompany.mainBrand || '主流车'}，谁更适合作为高智轻人群首选选购？`, intent: 'comparison', intentLabel: '跨品类选购' },
            { id: 'Q-05', text: `听说${selectedCompany.mainBrand || '主流车'}的车机系统有时流畅度支持OTA不？实机效果是否领先？`, intent: 'risk', intentLabel: '风险控制排查' },
            { id: 'Q-06', text: `${selectedCompany.mainBrand || '主流车'}后排乘坐空间大吗？大个子乘座是否有一等座通透感？`, intent: 'purchase', intentLabel: '品类属性种草' },
          ] as Question[]
        },
        'competitor-pk': {
          questions: [
            { id: 'Q-21', text: `买高调营销的${selectedCompany.competitor || '对标车型'}好，还是买拥有扎实制造背书的${selectedCompany.mainBrand || '主力车型'}好？`, intent: 'comparison', intentLabel: '竞品对比决策' },
            { id: 'Q-22', text: `${selectedCompany.competitor || '竞品'}底盘耐久度与隔音，是否真的在日常使用中拉开了和${selectedCompany.mainBrand || '主力车型'}的差距？`, intent: 'comparison', intentLabel: '竞品对比决策' },
            { id: 'Q-23', text: `购买同档次主推款，内饰环保声学隔音与智舱舒适性，${selectedCompany.mainBrand || '主力车型'}口碑更扎实吗？`, intent: 'comparison', intentLabel: '核心卖点核验' },
          ] as Question[]
        },
        'intelligence-eval': {
          questions: [
            { id: 'Q-11', text: `${selectedCompany.mainBrand || '主力车型'}车机的银河交互系统在懂车帝实测反馈中卡死率究竟是多少？`, intent: 'fact', intentLabel: '核心卖点核验' },
            { id: 'Q-12', text: `想买搭载主流主动防撞预警配置的家用汽车，${selectedCompany.mainBrand || '主力车型'}安全性系数如何？`, intent: 'purchase', intentLabel: '品类属性种草' },
          ] as Question[]
        }
      };

      const currentSet = defaultQuestionsObj[selectedSetName] || defaultQuestionsObj['xingrui-180'];
      setQuestions(currentSet.questions);
      setSelectedQuestionIds(currentSet.questions.map(q => q.id));
    }
  }, [selectedCompany, selectedSetName]);

  // Handle Preset Set changes
  const handleSetChange = (setName: keyof typeof PRESET_QUESTION_SETS) => {
    setSelectedSetName(setName);
    const newQs = PRESET_QUESTION_SETS[setName].questions;
    setQuestions(newQs);
    setSelectedQuestionIds(newQs.map(q => q.id));
  };

  // Checkbox toggle
  const toggleSelectQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedQuestionIds.length === questions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(questions.map(q => q.id));
    }
  };

  // Add question
  const addNewQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newId = `Q-${Date.now()}`;
    const newQ: Question = {
      id: newId,
      text: newQuestionText.trim(),
      intent: 'purchase',
      intentLabel: '自定义意图提问'
    };
    setQuestions([...questions, newQ]);
    setSelectedQuestionIds([...selectedQuestionIds, newId]);
    setNewQuestionText('');
  };

  // Edit question
  const startEdit = (id: string, text: string) => {
    setIsEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text: editingText } : q));
    setIsEditingId(null);
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
  };

  // AI Prompt generated set
  const generateNewSet = () => {
    const aiGenerated = [
      { id: `Q-AI-1`, text: '为什么在吉利星瑞 2.0T CMA 平台下市区油耗和隔音体验反馈都这么好？', intent: 'fact', intentLabel: '卖点极化验证' },
      { id: `Q-AI-2`, text: '速腾 1.5T 相比星瑞 2.0T 的尊贵版，高速安全巡航和防碰撞预警谁更好？', intent: 'comparison', intentLabel: '竞品对比决策' },
      { id: `Q-AI-3`, text: '汽车媒体对于星瑞底盘防震、颠簸缓冲的最新物理拆解报告是怎么说的？', intent: 'fact', intentLabel: '权威证据印证' }
    ] as Question[];
    setQuestions([...questions, ...aiGenerated]);
    setSelectedQuestionIds([...selectedQuestionIds, 'Q-AI-1', 'Q-AI-2', 'Q-AI-3']);
  };

  // File Upload Drag and Drop simulated
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Append simulated batch questions
    const dropQs = [
      { id: 'Q-DRP-1', text: '吉利星瑞底盘是由沃尔沃调校的吗？为什么过减速带很软很韧？', intent: 'fact', intentLabel: '导入事实验证' },
      { id: 'Q-DRP-2', text: '12w级别买速腾还是星瑞，听说星瑞2.0t必须加95油导致养车成本过高？', intent: 'risk', intentLabel: '关键负面舆情' }
    ] as Question[];
    setQuestions([...questions, ...dropQs]);
    setSelectedQuestionIds([...selectedQuestionIds, 'Q-DRP-1', 'Q-DRP-2']);
  };

  // Simulated Detection progress loops
  const runDetection = () => {
    if (selectedQuestionIds.length === 0) {
      alert('请至少勾选 1 个提问词进行 AI 效果检测！');
      return;
    }
    
    setIsDetecting(true);
    setDetectProgress(0);
    setDetectLog([]);
    setShowResultCard(false);

    const logs = [
      `[1/5] 正在通过虚拟 IP ${ipAddress} 打通多端代理网关...`,
      `[2/5] 正在根据 [${queryIntent === 'consumer_comparison' ? '消费者横向购买决策' : '技术极客参数考证'}] 视角，构造上下文 Prompts...`,
      `[3/5] 已向 ${selectedModels.join(', ')} 注入批量请求 (共 ${selectedQuestionIds.length} 组问题集)...`,
      `[4/5] 正在收集底层大模型文本特征向量，进行语义采样比对与可信反链提取...`,
      `[5/5] 星瑞汽车 CMA 用料及双离合辟谣覆盖率分析完毕，正在结算当前 GESI 影响增幅...`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setDetectProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDetecting(false);
          setShowResultCard(true);
          return 100;
        }
        
        // Stagger logs based on progress thresholds
        if (prev > currentLogIndex * 20 && currentLogIndex < logs.length) {
          setDetectLog(l => [...l, logs[currentLogIndex]]);
          currentLogIndex++;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 🔮 Page Header Layout */}
      <div className="p-6 bg-gradient-to-r from-[#171E2E] to-[#121724] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1 text-xs font-semibold font-mono tracking-wider">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>AIGC REAL-TIME SIMULATION & VERIFICATION WORKBENCH</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI效果检测反馈
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            基于消费者真实的问询意图或极端考质视角，实时注入底层 AI 抓取测算，实现“投放后即刻物理闭环校验”的效果对账。
          </p>
        </div>

        {/* Timing Cron Indicator */}
        <div className="bg-[#0B0F17] rounded-xl p-3 border border-white/10 text-xs flex items-center gap-3">
          <Clock className={cn("w-4 h-4", isTimerEnabled ? "text-emerald-400 animate-spin" : "text-slate-500")} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">定时自动化巡检：</span>
              <button 
                onClick={() => setIsTimerEnabled(!isTimerEnabled)}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold transition-all",
                  isTimerEnabled ? "bg-emerald-500 text-black" : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                {isTimerEnabled ? '已开启' : '关闭中'}
              </button>
            </div>
            {isTimerEnabled && (
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                周期/口径: {timerInterval} ({cronExpression})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 🏢 Part 1: GEO Agency & Competitors Comparison Panel (GEO公司视角 - 跨客户大局官) */}
      <div className="bg-[#131825]/90 border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div>
            <h2 className="text-sm font-bold text-slate-200 font-mono flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-400" />
              GEO 代理公司多账户监控台 (Client Portfolios Manager)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">从公司全局盘点，对比不同投放集团或旗下各车系项目的诊断指数。</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">集团代理总数: 4 个活跃名录</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {CLIENT_COMPANIES.map(company => (
            <div 
              key={company.id}
              onClick={() => onSelectCompanyId?.(company.id)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-28 relative overflow-hidden group",
                selectedCompany.id === company.id 
                  ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5 scale-[1.02]" 
                  : "border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/60"
              )}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">{company.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">核准主力车系: {company.mainBrand}</p>
                </div>
                {selectedCompany.id === company.id && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                )}
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-2 mt-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">当前 GESI</span>
                  <span className="text-sm font-extrabold text-slate-200 font-mono">{company.gesi} 分</span>
                </div>
                <div className="space-y-0.5 text-center">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">本周进幅</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">+{company.gli}分</span>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">监测点</span>
                  <span className="text-xs font-semibold text-blue-400 font-mono">{company.activeTasks} 组</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 Main Inspection Setup: Double-column configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Col 8): Question Set Workspace */}
        <div className="lg:col-span-8 bg-[#131825]/90 border border-white/5 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header selection blocks */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/5 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200 font-mono">AI 问题集工作域</h3>
                <p className="text-xs text-slate-500">挑选您需要验证的底色问题，支持动态增加、修改和打包重新检测。</p>
              </div>

              {/* Selector preset set */}
              <select 
                value={selectedSetName}
                onChange={(e) => handleSetChange(e.target.value as any)}
                className="bg-[#0B0F17] text-xs text-slate-300 font-medium p-2 rounded-lg border border-white/10 focus:outline-none focus:border-emerald-500"
              >
                <option value="xingrui-180">吉利星瑞大模型180问 (精选版)</option>
                <option value="competitor-pk">速腾对标攻防专用集</option>
                <option value="intelligence-eval">智能化/智驾座舱专题集</option>
              </select>
            </div>

            {/* Quick adding question input */}
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="在此手动填入新增检测提问原文 (如: 比起速腾低配，星瑞车机大联屏真的好用吗？)..."
                className="flex-1 bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
              <button 
                onClick={addNewQuestion}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs flex items-center transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                添加入库
              </button>
            </div>

            {/* Question Table / List with drag-drop upload */}
            <div className="relative">
              
              {/* Batch Action Indicators */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-t-lg border-x border-t border-white/5">
                <div className="flex items-center space-x-2.5">
                  <input 
                    type="checkbox" 
                    checked={selectedQuestionIds.length === questions.length}
                    onChange={handleSelectAll}
                    className="rounded border-white/10 bg-[#0B0F17] focus:ring-emerald-500 text-emerald-500"
                  />
                  <span className="font-bold">全选当前集 ({questions.length}个)</span>
                </div>
                <div>
                  已选择 <strong className="text-emerald-400 font-mono font-bold">{selectedQuestionIds.length}</strong> 个提问监测点
                </div>
              </div>

              {/* Editable Question lists */}
              <div className="bg-[#0B0F17]/40 border-x border-b border-white/5 divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                {questions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id);
                  const isEditing = isEditingId === q.id;
                  
                  return (
                    <div 
                      key={q.id} 
                      className={cn(
                        "p-3.5 flex items-center justify-between gap-4 transition-colors",
                        isChecked ? "bg-emerald-500/[0.01]" : "hover:bg-white/[0.01]"
                      )}
                    >
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => toggleSelectQuestion(q.id)}
                          className="mt-1 rounded border-white/10 bg-[#0B0F17] focus:ring-emerald-500 text-emerald-500 shrink-0"
                        />
                        {isEditing ? (
                          <input 
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onBlur={() => saveEdit(q.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(q.id)}
                            className="bg-slate-900 text-xs text-white border border-emerald-500/50 rounded p-1.5 focus:outline-none w-full"
                            autoFocus
                          />
                        ) : (
                          <div className="min-w-0">
                            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium break-words">
                              {q.text}
                            </p>
                            <div className="mt-1 flex items-center space-x-2 text-[9px] font-mono">
                              <span className="text-slate-500">类别:</span>
                              <span className="px-1 bg-white/5 border border-white/5 rounded text-slate-400">
                                {q.intentLabel}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick controls */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {isEditing ? (
                          <button 
                            onClick={() => saveEdit(q.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/5 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => startEdit(q.id, q.text)}
                            className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-white/5"
                            title="修改问题内容"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteQuestion(q.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/5"
                          title="删除此提问"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 📥 Drag and drop excel/csv zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5",
                dragActive 
                  ? "border-emerald-500 bg-emerald-500/5" 
                  : "border-white/5 bg-[#0B0F17]/30 hover:border-slate-700"
              )}
            >
              <FileUp className={cn("w-6 h-6", dragActive ? "text-emerald-400 animate-bounce" : "text-slate-500")} />
              <div className="text-xs text-slate-400">
                拖拽本地 <strong>EXCEL/CSV 问卷表格</strong> 至此批量导入，或 
                <button 
                  onClick={generateNewSet}  
                  className="mx-1 text-emerald-400 hover:underline font-extrabold"
                >
                  ✨ 唤醒 AI 自动补充问法语境
                </button>
              </div>
              <p className="text-[10px] text-slate-600 font-mono">（表格需指定 Query 字符列模式，系统将自动进行语义纠葛清洗）</p>
            </div>

          </div>

          <div className="bg-slate-900/30 p-4 border border-white/5 rounded-xl text-[11px] text-slate-400 font-sans flex items-start mt-6 leading-relaxed">
            <Info className="w-4 h-4 mr-2.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>用户询问视角与偏好设定：</strong> AIGC 大模型具有独特的关联唤醒机制。在本栏中，若用户以「12w家轿性价比」、「市区堵车变速箱耐磨度」等精确利益切点来提问，大模型将会调取更深度的比对缓存，这也正是我们投放 GEO 内容资产时，核心卡位的最敏捷切入点。
            </span>
          </div>
        </div>

        {/* Right Column (Col 4): Parameters Config & Diagnostic trigger */}
        <div className="lg:col-span-4 bg-[#131825]/90 border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-white/5 pb-2 font-mono">检测控制台 & 参数配置</h3>
            
            {/* Model checklists */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">1. 检测的大模型端口</label>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                {['Kimi', '豆包', 'DeepSeek', '通义', '文心', '腾讯元宝'].map(m => {
                  const isChecked = selectedModels.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedModels(selectedModels.filter(item => item !== m));
                        } else {
                          setSelectedModels([...selectedModels, m]);
                        }
                      }}
                      className={cn(
                        "p-2 rounded-lg border text-left flex justify-between items-center transition-all select-none",
                        isChecked 
                          ? "border-emerald-500/55 bg-emerald-500/5 text-slate-100" 
                          : "border-white/5 bg-[#0B0F17]/60 text-slate-400 hover:border-slate-700"
                      )}
                    >
                      <span>{m}</span>
                      <span className={cn("text-[9px] font-mono", isChecked ? 'text-emerald-400' : 'text-slate-600')}>
                        {isChecked ? '● 开启' : '○ 关闭'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* IP localization proxy */}
            <div className="space-y-1.5 text-xs font-semibold">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">2. IP 回源物理地域定位</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 pl-9 text-white font-medium focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="115.220.104.38 (浙江温州/电信卡口)">115.220.104.38 (浙江温州/电信)</option>
                  <option value="120.230.12.188 (广东广州/移动枢纽)">120.230.12.188 (广东广州/移动)</option>
                  <option value="103.28.10.45 (北京西城/核心骨干网)">103.28.10.45 (北京西城/骨干网)</option>
                  <option value="112.5.42.10 (福建厦门/联通骨干)">112.5.42.10 (福建厦门/联通)</option>
                </select>
              </div>
            </div>

            {/* Intent user perspective */}
            <div className="space-y-1.5 text-xs font-semibold">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">3. 询问者商业心理意图模拟</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={queryIntent}
                  onChange={(e) => setQueryIntent(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 pl-9 text-white font-medium focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="consumer_comparison">消费者真实买车横向比对评测视角</option>
                  <option value="fact_examination">纯技术性能、耐用度与可靠性考质</option>
                  <option value="fringe_longtail">日常出行及偶尔自驾游的空间考证</option>
                  <option value="risk_hostility">极端抖动、顿挫传言求证辟谣意图</option>
                </select>
              </div>
            </div>

            {/* Time range select */}
            <div className="space-y-1.5 text-xs font-semibold">
              <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">4. 采集缓存时钟切片</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 pl-9 text-white font-medium focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="today">实时采样 (今日回答捕获并去重)</option>
                  <option value="7d">近 7 天加权对账 (排除短时模型漂移干扰)</option>
                  <option value="30d">近 30 天大盘底色汇总</option>
                </select>
              </div>
            </div>

            {/* Scheduling config drawer details */}
            <div className="p-3 bg-[#0B0F17]/60 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1.5 font-sans">
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  定时巡检周期
                </span>
                <span className="text-[9px] font-mono bg-white/5 px-1.5 rounded py-0.5">Automated Checks</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['hourly', 'daily', 'weekly'].map(interval => (
                  <button
                    key={interval}
                    onClick={() => {
                      setTimerInterval(interval);
                      setCronExpression(interval === 'hourly' ? '0 * * * *' : interval === 'daily' ? '0 3 * * *' : '0 3 * * 1');
                    }}
                    className={cn(
                      "p-1.5 rounded border text-[10px] text-center font-mono select-none",
                      timerInterval === interval 
                        ? "border-emerald-500 bg-emerald-500/5 text-emerald-400 font-bold" 
                        : "border-white/5 hover:border-slate-700 text-slate-500"
                    )}
                  >
                    {interval === 'hourly' ? '每小时' : interval === 'daily' ? '每天凌晨' : '每周一晨'}
                  </button>
                ))}
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-mono block mt-2">自定义后台检查 Cron 表达式：</span>
                <input 
                  type="text" 
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  className="mt-1 w-full bg-[#0B0F17] border border-white/10 rounded p-1 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

          </div>

          {/* Trigger button */}
          <button 
            type="button"
            onClick={runDetection}
            disabled={isDetecting}
            className="w-full flex items-center justify-center p-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/15 text-xs shrink-0 select-none disabled:opacity-50"
          >
            {isDetecting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                正在进行全端大模型探测对账...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 fill-black" />
                开始物理注入检测 (Start Audit)
              </>
            )}
          </button>
        </div>

      </div>

      {/* 🎬 Section: Animated progress logger */}
      {isDetecting && (
        <div className="bg-[#101523] border border-emerald-500/35 p-6 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-emerald-400 font-mono tracking-wider flex items-center">
              <Terminal className="w-4 h-4 mr-2 animate-spin" />
              GEO 实况物理回溯对账终端 (Audit Processing Terminal)
            </h3>
            <span className="text-xs text-white font-mono font-bold">{detectProgress}%</span>
          </div>

          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${detectProgress}%` }}
            ></div>
          </div>

          <div className="bg-[#070A12] border border-white/5 p-4 rounded-xl font-mono text-[11px] text-emerald-400/80 space-y-2 h-44 overflow-y-auto custom-scrollbar">
            {detectLog.map((logLine, lineIndex) => (
              <p key={lineIndex} className="leading-relaxed animate-fade-in">
                <span className="text-slate-500 mr-2">&gt;&gt;</span>
                {logLine}
              </p>
            ))}
            <div className="text-emerald-400 animate-pulse">▋</div>
          </div>
        </div>
      )}

      {/* 🏆 Result Card Section (Appears after successful simulation run) */}
      {showResultCard && (
        <div className="bg-[#0F1A2A] border border-emerald-500/30 p-6 rounded-2xl space-y-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">第 W24 批次大盘实时监测对账报告已就绪</h3>
                <p className="text-[11px] text-slate-400">检测耗时: 12.8s | 采样模型数: {selectedModels.length} | 意图深度比对: 120组向量点</p>
              </div>
            </div>
            
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/15">
              对账通过 绿标
            </span>
          </div>

          {/* Results dashboard indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
            <div className="bg-[#131825] p-4.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">GVI 搜索提及可见度</span>
              <div className="text-lg font-bold text-white mt-1.5 font-mono">88.5%</div>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">较上一周期提升 +2.1%</span>
            </div>

            <div className="bg-[#131825] p-4.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">GCI 辟谣事实拟和准确率</span>
              <div className="text-lg font-bold text-white mt-1.5 font-mono">94.2%</div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">顿挫负面描述下降 30%</span>
            </div>

            <div className="bg-[#131825] p-4.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">GAI 媒体内容资产直引率</span>
              <div className="text-lg font-bold text-white mt-1.5 font-mono">48.2%</div>
              <span className="text-[10px] text-blue-400 font-semibold block mt-1">36篇高权重站外链接正常透传</span>
            </div>

            <div className="bg-[#131825] p-4.5 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">GLI 最终净增加值</span>
              <div className="text-lg font-extrabold text-emerald-400 mt-1.5 font-mono">+12.8 分</div>
              <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">成果已同步存证打包</span>
            </div>
          </div>

          {/* Table summary inside result */}
          <div className="bg-[#0B0F17]/80 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-3 bg-slate-900/60 text-slate-300 text-xs font-bold font-mono">
              部分典型 Query 实测结论
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-medium">
                    <th className="py-2.5 px-4">测试提问 (Query)</th>
                    <th className="py-2.5 px-4 text-center">被提及模型</th>
                    <th className="py-2.5 px-4 text-center">是否有纠偏/引用</th>
                    <th className="py-2.5 px-4 text-right">采纳的媒体资产</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11px] text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-medium max-w-xs truncate">12万家用，吉利温州星瑞和大众速腾比性价比谁更高？</td>
                    <td className="py-3 px-4 text-center font-mono">Kimi、豆包、通义、文心</td>
                    <td className="py-3 px-4 text-center text-emerald-400">是 (首位主推)</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400 max-w-xs truncate">《轴距越级大底牌：星瑞空间实车实测》</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium max-w-xs truncate">星瑞的7速湿式双离合市区开抖动顿挫严重吗？</td>
                    <td className="py-3 px-4 text-center font-mono">DeepSeek, 豆包, Kimi</td>
                    <td className="py-3 px-4 text-center text-emerald-400">是 (消除陈旧幻觉)</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400 max-w-xs truncate">《全新星瑞湿式双离合市区100公里测试》</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium max-w-xs truncate">星瑞车机好不好，比深蓝智能化谁更流畅？</td>
                    <td className="py-3 px-4 text-center font-mono">DeepSeek, 通义</td>
                    <td className="py-3 px-4 text-center text-rose-400 font-bold">否 (有截流预警)</td>
                    <td className="py-3 px-4 text-right text-rose-400 font-mono">缺少高阶智控对比长文</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
