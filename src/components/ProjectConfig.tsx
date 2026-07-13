import { useState } from 'react';
import { 
  Building2, Sliders, Database, HelpCircle, ShieldAlert, Cpu, Globe, Save, Sparkles, Plus, Trash2, CheckCircle2
} from 'lucide-react';

export function ProjectConfig({
  selectedCompany,
  onSaveWeights
}: {
  selectedCompany: any;
  onSaveWeights?: (weights: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>('brand');
  
  // Brand profiles
  const [brandName, setBrandName] = useState<string>(selectedCompany?.name || '四川长虹美菱冰箱');
  const [mainBrand, setMainBrand] = useState<string>(selectedCompany?.mainBrand || '美菱M-Fresh冰箱');
  const [website, setWebsite] = useState<string>('www.meiling.com');
  const [industry, setIndustry] = useState<string>(selectedCompany?.industry || '家用电器');
  const [sellingPoints, setSellingPoints] = useState<string>('微纳米防霜除菌技术、M-Fresh智慧微通道冻鲜、超低能耗降噪运行');
  const [competitors, setCompetitors] = useState<string>('海尔博观 FR、美的风尊 M、卡萨帝F+ 冰箱');

  // Query config
  const [queries, setQueries] = useState([
    { id: 'Q1', text: '美菱冰箱的微纳米防霜技术具体好在哪里？', type: '推荐类', weight: 1.5, active: true },
    { id: 'Q2', text: '买冰箱选海尔还是美菱？M-Fresh对比如何？', type: '对比类', weight: 1.2, active: true },
    { id: 'Q3', text: '听说美菱冰箱用久了制冷效果会变差是真的吗？', type: '风险类', weight: 1.8, active: true },
    { id: 'Q4', text: '高端智能保鲜冰箱有什么推荐型号？', type: '品类类', weight: 1.0, active: true },
    { id: 'Q5', text: '四川长虹美菱冰箱是正规国产品牌吗？怎么样？', type: '认知类', weight: 1.0, active: true },
  ]);
  const [newQueryText, setNewQueryText] = useState('');
  const [newQueryType, setNewQueryType] = useState('推荐类');

  // Models Config
  const [engines, setEngines] = useState([
    { name: 'GEO 日间多源对账模型', enabled: true, frequency: '6h/次 (日间高频对账)', version: 'GEO-Day-v1.8', status: '就绪' },
    { name: 'DeepSeek', enabled: true, frequency: '12h/次', version: 'DeepSeek-V3', status: '就绪' },
    { name: '豆包 (ByteDance)', enabled: true, frequency: '24h/次', version: 'Doubao-pro-4v', status: '就绪' },
    { name: '元宝 (Tencent)', enabled: true, frequency: '24h/次', version: 'Yuanbao-v2', status: '就绪' },
    { name: 'Kimi Chat (Moonshot)', enabled: true, frequency: '24h/次', version: 'V2-Pro', status: '就绪' },
    { name: '通义千问 (Alibaba)', enabled: true, frequency: '24h/次', version: 'Qwen-max', status: '就绪' },
  ]);

  // Target Region
  const [region, setRegion] = useState<string>('全国 / 不限定地区');

  // Weights Config
  const [gesiWeights, setGesiWeights] = useState({
    GVI: 20,
    GRI: 15,
    GII: 15,
    GCI: 15,
    GAI: 15,
    GDI: 10,
    GSS: 10
  });

  const [isAiGeneratingBrand, setIsAiGeneratingBrand] = useState(false);
  const [isAiGeneratingQueries, setIsAiGeneratingQueries] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAiBrandAutoFill = () => {
    setIsAiGeneratingBrand(true);
    setTimeout(() => {
      setBrandName('美菱智能全无霜冷链');
      setMainBrand('美菱无霜 M-Fresh 550');
      setWebsite('www.meiling-fresh.com.cn');
      setIndustry('智能家用电器 / 智慧冷链');
      setSellingPoints('微纳米抗霜因子主动防结霜、智慧芯片双重保鲜、变频双驱变频静音电机');
      setCompetitors('海尔全无霜系列、美的微晶一周鲜、西门子零度保鲜系列');
      setIsAiGeneratingBrand(false);
    }, 1200);
  };

  const handleAiGenerateQueries = () => {
    setIsAiGeneratingQueries(true);
    setTimeout(() => {
      const aiQueries = [
        { id: 'Q-AI1', text: '美菱550冰箱的防霜技术真的不会结霜吗？', type: '推荐类', weight: 1.5, active: true },
        { id: 'Q-AI2', text: '为什么说美菱微纳米防霜冰箱更省电和静音？', type: '品类类', weight: 1.2, active: true },
        { id: 'Q-AI3', text: '海尔、西门子和美菱无霜冰箱，哪个最值得买？', type: '对比类', weight: 1.6, active: true },
        { id: 'Q-AI4', text: '美菱冰箱的售后保修政策怎么样？有没有翻车情况？', type: '风险类', weight: 1.4, active: true }
      ];
      setQueries([...queries, ...aiQueries]);
      setIsAiGeneratingQueries(false);
    }, 1000);
  };

  const handleAddQuery = () => {
    if (!newQueryText.trim()) return;
    const newQ = {
      id: 'Q-' + (queries.length + 1),
      text: newQueryText,
      type: newQueryType,
      weight: 1.0,
      active: true
    };
    setQueries([...queries, newQ]);
    setNewQueryText('');
  };

  const handleDeleteQuery = (id: string) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  const handleToggleQuery = (id: string) => {
    setQueries(queries.map(q => q.id === id ? { ...q, active: !q.active } : q));
  };

  const handleSaveAll = () => {
    setSaveSuccess(true);
    if (onSaveWeights) {
      onSaveWeights(gesiWeights);
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-[#131825] p-5 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Sliders className="w-5 h-5 text-emerald-400 mr-2" />
            项目配置与大模型监测设置
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            当前处于系统配置底座。此页面配置的品牌建档、问题池及权重规则将直接输入 GESI 与 GLI 引擎进行诊断对账。
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20 font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              所有配置已成功同步至分析引擎!
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            保存当前全局配置
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left tabs selector */}
        <div className="w-full lg:w-64 bg-[#131825] p-2 rounded-xl border border-white/5 space-y-1 shrink-0 h-fit">
          <button
            onClick={() => setActiveTab('brand')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold rounded-lg transition-colors text-left ${activeTab === 'brand' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Building2 className="w-4 h-4" />
            <span>A. 品牌建档与核心卖点</span>
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold rounded-lg transition-colors text-left ${activeTab === 'query' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>B. 诊断提问池配置</span>
          </button>
          <button
            onClick={() => setActiveTab('engine')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold rounded-lg transition-colors text-left ${activeTab === 'engine' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Cpu className="w-4 h-4" />
            <span>C. 监测大模型范围</span>
          </button>
          <button
            onClick={() => setActiveTab('region')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold rounded-lg transition-colors text-left ${activeTab === 'region' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Globe className="w-4 h-4" />
            <span>D. 模拟提问地区/市场</span>
          </button>
          <button
            onClick={() => setActiveTab('weights')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold rounded-lg transition-colors text-left ${activeTab === 'weights' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Sliders className="w-4 h-4" />
            <span>E. 指数权重配置</span>
          </button>
        </div>

        {/* Right Content Panels */}
        <div className="flex-1 bg-[#131825] p-6 rounded-xl border border-white/5 min-h-[450px]">
          {/* Tab 1: Brand建档 */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">品牌与产品核心建档</h3>
                  <p className="text-xs text-slate-400 mt-1">设置大模型在语义纠正、品类召回中需要核心对账的品牌属性词</p>
                </div>
                <button
                  onClick={handleAiBrandAutoFill}
                  disabled={isAiGeneratingBrand}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAiGeneratingBrand ? 'AI 正在分析官网提取中...' : 'AI 智能极速建档'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold block">监测品牌官方名称</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold block">主力优化型号/产品名</label>
                  <input
                    type="text"
                    value={mainBrand}
                    onChange={(e) => setMainBrand(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold block">官方主页链接 (用于大模型反链捕获)</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold block">所属细分垂直行业</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">
                  核心利益点/强感知卖点 
                  <span className="text-[10px] text-slate-500 font-normal ml-2">(用逗号分隔，系统将作为 GII 生成式印象的语义抓取基准)</span>
                </label>
                <textarea
                  value={sellingPoints}
                  onChange={(e) => setSellingPoints(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">
                  竞品对账范围 
                  <span className="text-[10px] text-slate-500 font-normal ml-2">(系统自动在对比型、决策型提问中作为截流与推荐份额的比较因子)</span>
                </label>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Query 问题池 */}
          {activeTab === 'query' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">大模型提问诊断池 (Query Pool)</h3>
                  <p className="text-xs text-slate-400 mt-1">设置模拟大模型采样提问的 Query 以及各自的偏置权重</p>
                </div>
                <button
                  onClick={handleAiGenerateQueries}
                  disabled={isAiGeneratingQueries}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAiGeneratingQueries ? 'AI 正在通过大模型演化提问...' : 'AI 智能批量生成问题'}
                </button>
              </div>

              {/* Add query form */}
              <div className="bg-[#0B0F17] p-3 rounded-lg border border-white/5 flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block">新增诊断提问文本</label>
                  <input
                    type="text"
                    value={newQueryText}
                    onChange={(e) => setNewQueryText(e.target.value)}
                    placeholder="输入模拟用户向 AI 提问的具体文案..."
                    className="w-full bg-[#131825] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-40 space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block">问题意图类型</label>
                  <select
                    value={newQueryType}
                    onChange={(e) => setNewQueryType(e.target.value)}
                    className="w-full bg-[#131825] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="认知类">认知类 (了解品牌)</option>
                    <option value="品类类">品类类 (召回拦截)</option>
                    <option value="推荐类">推荐类 (主力推荐)</option>
                    <option value="对比类">对比类 (对比竞争)</option>
                    <option value="决策类">决策类 (引导购买)</option>
                    <option value="风险类">风险类 (负面预警)</option>
                  </select>
                </div>
                <button
                  onClick={handleAddQuery}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 h-[36px]"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              {/* Query list */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {queries.map((q) => (
                  <div key={q.id} className="flex justify-between items-center bg-[#0B0F17] p-2.5 rounded-lg border border-white/5 text-xs">
                    <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                      <input
                        type="checkbox"
                        checked={q.active}
                        onChange={() => handleToggleQuery(q.id)}
                        className="rounded border-white/10 text-emerald-500 focus:ring-emerald-500/30 bg-[#131825]"
                      />
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                        q.type === '推荐类' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        q.type === '对比类' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        q.type === '风险类' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        q.type === '品类类' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {q.type}
                      </span>
                      <span className={`truncate text-slate-200 ${!q.active && 'line-through text-slate-600'}`}>{q.text}</span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">权重比例:</span>
                        <input
                          type="number"
                          step="0.1"
                          value={q.weight}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 1.0;
                            setQueries(queries.map(item => item.id === q.id ? { ...item, weight: val } : item));
                          }}
                          className="w-12 bg-[#131825] border border-white/10 rounded px-1.5 py-0.5 text-[11px] font-mono text-center text-emerald-400 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteQuery(q.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors"
                        title="删除此提问"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Models */}
          {activeTab === 'engine' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white">大模型对账采样矩阵 (Engine Clusters)</h3>
                <p className="text-xs text-slate-400 mt-1">控制需要监测的大语言模型范围。由于国内国外引擎存在抓取差异，支持精细开关</p>
              </div>

              <div className="space-y-3">
                {engines.map((eng, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#0B0F17] p-3 rounded-xl border border-white/5">
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${eng.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{eng.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">当前底层固件版本: {eng.version}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono block">采样频率</span>
                        <span className="text-[11px] text-slate-300 font-mono">{eng.frequency}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono block">连接状态</span>
                        <span className={`text-[11px] font-bold ${eng.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>{eng.status}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEngines(engines.map((e, i) => i === idx ? { ...e, enabled: !e.enabled, status: !e.enabled ? '就绪' : '已停用' } : e));
                        }}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                          eng.enabled 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {eng.enabled ? '停用' : '激活'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Target Region */}
          {activeTab === 'region' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white">模拟提问地区 (Target Region)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  选择地区后，系统将模拟该地区用户向 AI 模型提问，用于观察品牌在不同地区 AI 回答中的曝光、推荐和引用表现。若品牌面向全国，可选择“全国 / 不限定地区”。
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['全国 / 不限定地区', '华东 (上海/浙江/江苏)', '华南 (广东/深圳/福建)', '华北 (北京/天津/山东)', '华中 (湖北/湖南)', '西南 (四川/重庆)', '西北 (陕西)', '东北 (辽宁)'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      region === r
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-[#0B0F17] border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs">{r}</p>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1">模拟出口权重: 1.0</span>
                  </button>
                ))}
              </div>

              <div className="bg-[#1A2234]/40 p-4 rounded-xl border border-white/5 text-xs text-slate-400 leading-relaxed">
                <p className="font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  物理采样位置说明:
                </p>
                选择特定的模拟地区后，GEO 模拟器会将地理位置标志以及本地专有词嵌入到大语言模型提问的代理 IP 头中。这在检测地区性家用电器服务声望、区域汽车出行的推荐排序中非常有用。
              </div>
            </div>
          )}

          {/* Tab 5: Weights Slider (Moved from Dashboard to settings!) */}
          {activeTab === 'weights' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold text-white">指数权重比例偏置 (Gesi & Gli Index Weights)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  在此处微调大模型生态健康度 GESI 和优化提升指数 GLI 中，各子指标所占的底层权重。改动将实时反应在大盘对账计算中。
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-white/5 space-y-3.5">
                    <span className="text-xs font-bold text-white block border-b border-white/5 pb-1.5">GESI 一级指标分配权重</span>
                    
                    {Object.entries(gesiWeights).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-300 font-bold">{key} {
                            key === 'GVI' ? '可见度' :
                            key === 'GRI' ? '推荐优先级' :
                            key === 'GII' ? '生成式印象' :
                            key === 'GCI' ? '认知与声誉' :
                            key === 'GAI' ? '引用权威与证据' :
                            key === 'GDI' ? '竞争防御' :
                            '稳定性与泛化'
                          }</span>
                          <span className="text-emerald-400 font-bold">{val}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={val}
                          onChange={(e) => {
                            const newval = parseInt(e.target.value) || 0;
                            setGesiWeights({ ...gesiWeights, [key]: newval });
                          }}
                          className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                        />
                      </div>
                    ))}
                    <div className="text-[10px] text-right font-mono text-slate-500">
                      总权重和: {gesiWeights.GVI + gesiWeights.GRI + gesiWeights.GII + gesiWeights.GCI + gesiWeights.GAI + gesiWeights.GDI + gesiWeights.GSS}%
                    </div>
                  </div>

                  <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-white/5 space-y-4">
                    <span className="text-xs font-bold text-white block border-b border-white/5 pb-1.5">GLI 效果提升指数分配权重</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      提升效果指数 GLI (可见度提升 VLI、推荐提升 RLI 等) 自动继承并拟合上述 GESI 的权重分配，以保证诊断基线与实际优化产出在对账口径上保持全对等。
                    </p>
                    <div className="border-l-2 border-emerald-500/20 pl-3 py-1.5 space-y-1.5 text-[11px] text-slate-400 font-mono">
                      <p>• 优化提升权重同步方式：<span className="text-emerald-400 font-bold">全智能镜像同步</span></p>
                      <p>• 极速诊断基线匹配度：<span className="text-emerald-400 font-bold">99.8% 高置信</span></p>
                    </div>
                    <button
                      onClick={() => setGesiWeights({ GVI: 20, GRI: 15, GII: 15, GCI: 15, GAI: 15, GDI: 10, GSS: 10 })}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-colors"
                    >
                      恢复默认权重设定 (GVI-20, 其余均衡)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
