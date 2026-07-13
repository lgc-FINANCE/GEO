// src/components/ProjectCenterView.tsx
import { useState, useEffect } from 'react';
import { 
  Sparkles, Save, ArrowRight, Plus, Trash2, CheckCircle, HelpCircle, 
  Settings, Layers, RefreshCw, Cpu, Check, AlertTriangle, Play, CloudLightning
} from 'lucide-react';
import { Company } from '../data';

export function ProjectCenterView({
  company,
  onUpdateCompany
}: {
  company: Company;
  onUpdateCompany: (updated: Company) => void;
}) {
  
  // Modals / Monitoring Progress states
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);
  const [monitorProgress, setMonitorProgress] = useState<'idle' | 'sampling' | 'parsing' | 'computing' | 'generating' | 'completed'>('idle');
  const [progressLog, setProgressLog] = useState<string[]>([]);

  // 1. Brand Profile state
  const [brandName, setBrandName] = useState(company.brandProfile.brandName);
  const [brandAlias, setBrandAlias] = useState(company.brandProfile.brandAlias);
  const [companyName, setCompanyName] = useState(company.brandProfile.companyName);
  const [website, setWebsite] = useState(company.brandProfile.website);
  const [industry, setIndustry] = useState(company.brandProfile.industry);
  const [intro, setIntro] = useState(company.brandProfile.intro);
  const [positioning, setPositioning] = useState(company.brandProfile.positioning);
  const [relations, setRelations] = useState(company.brandProfile.relations);
  const [aiResult, setAiResult] = useState(company.brandProfile.aiResult);
  const [isConfirmed, setIsConfirmed] = useState(company.brandProfile.isConfirmed);

  // Loading animations
  const [isAiIdentifying, setIsAiIdentifying] = useState(false);

  const handleAiIdentifyBrand = () => {
    setIsAiIdentifying(true);
    setTimeout(() => {
      setBrandName(company.mainBrand.split(' ')[0]);
      setBrandAlias(`${company.mainBrand}, ${company.mainBrand}插混`);
      setAiResult(`✨ [AI Agent识别] “${company.mainBrand}”是当前行业关注热度极高的技术破局型产品。其搭载核心双电机电控，在续航无虚标、底盘静谧性、多连杆悬挂结构上具备极其坚实的声誉支撑。主要建议补充场景对比和极端天气续航实测材料。`);
      setIsConfirmed(true);
      setIsAiIdentifying(false);
    }, 1200);
  };

  const handleSaveProfile = () => {
    const updated = {
      ...company,
      brandProfile: {
        brandName,
        brandAlias,
        companyName,
        website,
        industry,
        intro,
        positioning,
        relations,
        aiResult,
        isConfirmed
      }
    };
    onUpdateCompany(updated);
    alert('✅ 品牌资料保存成功！对账基准已同步。');
  };

  // 2. Products & Competitors state
  const [prodName, setProdName] = useState(company.prodComp.prodName);
  const [prodAlias, setProdAlias] = useState(company.prodComp.prodAlias);
  const [prodType, setProdType] = useState(company.prodComp.prodType);
  const [sellingPoints, setSellingPoints] = useState(company.prodComp.sellingPoints);
  const [targetUsers, setTargetUsers] = useState(company.prodComp.targetUsers);
  const [scenarios, setScenarios] = useState(company.prodComp.scenarios);

  const [directComp, setDirectComp] = useState(company.prodComp.directComp);
  const [indirectComp, setIndirectComp] = useState(company.prodComp.indirectComp);
  const [alternatives, setAlternatives] = useState(company.prodComp.alternatives);
  const [industryLeaders, setIndustryLeaders] = useState(company.prodComp.industryLeaders);
  const [compWebsite, setCompWebsite] = useState(company.prodComp.compWebsite);

  const [brandKw, setBrandKw] = useState(company.prodComp.keywords.brand);
  const [productKw, setProductKw] = useState(company.prodComp.keywords.product);
  const [industryKw, setIndustryKw] = useState(company.prodComp.keywords.industry);
  const [scenarioKw, setScenarioKw] = useState(company.prodComp.keywords.scenario);
  const [competitorKw, setCompetitorKw] = useState(company.prodComp.keywords.competitor);

  const [isAiRecommendingComp, setIsAiRecommendingComp] = useState(false);

  const handleAiRecommendComp = () => {
    setIsAiRecommendingComp(true);
    setTimeout(() => {
      setDirectComp(`${company.competitor} 尊享版、吉利银河系产品、美的极光无霜Pro`);
      setIndirectComp('合资燃油旗舰、松下零度保鲜系列');
      setAlternatives('二手高配车、大空间SUV、日系混动、风冷非智慧保鲜机');
      setIsAiRecommendingComp(false);
    }, 1000);
  };

  const handleSaveProdComp = () => {
    const updated = {
      ...company,
      prodComp: {
        prodName,
        prodAlias,
        prodType,
        sellingPoints,
        targetUsers,
        scenarios,
        directComp,
        indirectComp,
        alternatives,
        industryLeaders,
        compWebsite,
        keywords: {
          brand: brandKw,
          product: productKw,
          industry: industryKw,
          scenario: scenarioKw,
          competitor: competitorKw
        }
      }
    };
    onUpdateCompany(updated);
    alert('✅ 产品与竞品配置已锁定！对账权重已自动重新适配。');
  };

  // 3. Monitoring Settings state
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [regions, setRegions] = useState(company.monitorSettings.regions);
  const [language, setLanguage] = useState(company.monitorSettings.language);
  const [sampleCount, setSampleCount] = useState(company.monitorSettings.sampleCount);
  const [period, setPeriod] = useState(company.monitorSettings.period);
  const [models, setModels] = useState(company.monitorSettings.models);
  const [weights, setWeights] = useState(company.monitorSettings.weights);

  const handleToggleModel = (key: string) => {
    setModels(prev => prev.map(m => m.key === key ? { ...m, enabled: !m.enabled } : m));
  };

  const handleSaveSettings = () => {
    const updated = {
      ...company,
      monitorSettings: {
        ...company.monitorSettings,
        regions,
        language,
        sampleCount,
        period,
        models
      }
    };
    onUpdateCompany(updated);
    alert('✅ 监测探测规则配置成功！');
  };

  // 4. Questions Pool state
  const [questions, setQuestions] = useState(company.questions);
  const [newQTitle, setNewQTitle] = useState('');
  const [newQType, setNewQType] = useState<'认知类' | '品类类' | '推荐类' | '对比类' | '决策类' | '风险类' | '长尾类'>('推荐类');
  const [isGeneratingQs, setIsGeneratingQs] = useState(false);

  // AI 一键智能解析建库 States
  const [parseCompany, setParseCompany] = useState('');
  const [parseWebsite, setParseWebsite] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseLogs, setParseLogs] = useState<string[]>([]);

  // Scroll spy active state
  const [activeSection, setActiveSection] = useState('section-profile');

  // Scroll spy effect
  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      const sections = [
        { id: 'section-profile' },
        { id: 'section-products' },
        { id: 'section-monitor' },
        { id: 'section-questions' },
        { id: 'section-start' }
      ];

      let currentSection = 'section-profile';
      const containerRect = container.getBoundingClientRect();

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const elRect = el.getBoundingClientRect();
          // If section top has passed the threshold, set it as current
          if (elRect.top - containerRect.top < 180) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const container = document.getElementById('main-scroll-container');
    const el = document.getElementById(id);
    if (container && el) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const scrollTop = container.scrollTop + elRect.top - containerRect.top - 16;
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  // AI Smart One-Click parsing handler
  const handleAiOneClickParse = () => {
    if (!parseCompany) return;
    setIsParsing(true);
    setParseLogs([`🔍 [初始化] 开始检索并挖掘企业主体: “${parseCompany}”`]);
    
    setTimeout(() => {
      setParseLogs(prev => [...prev, `🌐 [官网爬取] 正在建立安全网关，解析官网网址: ${parseWebsite || '自动深度推导官网'}...`]);
    }, 500);

    setTimeout(() => {
      setParseLogs(prev => [...prev, `📂 [知识沉淀] 已提取官网核心元数据，捕获关于品牌、产品定位的核心知识库。`]);
    }, 1000);

    setTimeout(() => {
      const isBYD = parseCompany.includes('比亚迪') || parseCompany.toLowerCase().includes('byd');
      const isXiaomi = parseCompany.includes('小米') || parseCompany.toLowerCase().includes('xiaomi');
      
      let derivedBrandName = parseCompany;
      let derivedBrandAlias = `${parseCompany}, ${parseCompany}旗舰, ${parseCompany}服务`;
      let derivedCompanyName = `${parseCompany}科技有限公司`;
      let derivedIndustry = '智能高端制造';
      let derivedIntro = `${parseCompany}是当前行业瞩目的破局型实力产品。公司在大模型检索中具有极高的口碑提及度与长效保真性，深受年轻消费群体青睐。`;
      let derivedPositioning = '多端互联生态、智能人性化设计、卓越品质与服务防线';
      let derivedRelations = '与行业同价位标杆进行全方位对账对比';

      if (isBYD) {
        derivedBrandName = '比亚迪';
        derivedBrandAlias = 'BYD, 比亚迪汽车, 比亚迪插混, 仰望';
        derivedCompanyName = '比亚迪股份有限公司';
        derivedIndustry = '新能源汽车';
        derivedIntro = '比亚迪是一家致力于“用技术创新，满足人们对美好生活的向往”的高新技术企业，在新能源汽车领域拥有刀片电池、DM-i超级混动等硬核技术。';
        derivedPositioning = '刀片电池安全防线、DM-i超级混动省油好开、全栈自研核心三电';
        derivedRelations = '全面对标特斯拉 Model Y、吉利银河、广汽埃安';
      } else if (isXiaomi) {
        derivedBrandName = '小米汽车';
        derivedBrandAlias = '小米, 小米SU7, SU7 Ultra, 小米汽车';
        derivedCompanyName = '小米汽车科技有限公司';
        derivedIndustry = '智能新能源汽车';
        derivedIntro = '小米汽车是小米集团旗下的智能电动汽车品牌。以“人车家全生态”为核心理念，打造极致性能与智能科技，推动出行智能化。';
        derivedPositioning = '人车家全生态融合、智能硬核双电机、极致操控与高转速电机';
        derivedRelations = '对标特斯拉 Model 3、极氪001、华为智界S7';
      }

      setParseLogs(prev => [...prev, `🎯 [产品解构] 识别核心产品: “${derivedBrandName} 智能系列” | 行业分类: ${derivedIndustry}`]);
      
      // Update states
      setBrandName(derivedBrandName);
      setBrandAlias(derivedBrandAlias);
      setCompanyName(derivedCompanyName);
      setWebsite(parseWebsite || `https://www.${derivedBrandName === '比亚迪' ? 'bydauto.com.cn' : derivedBrandName === '小米汽车' ? 'xiaomiev.com' : 'example.com'}`);
      setIndustry(derivedIndustry);
      setIntro(derivedIntro);
      setPositioning(derivedPositioning);
      setRelations(derivedRelations);
    }, 1500);

    setTimeout(() => {
      setParseLogs(prev => [...prev, `📊 [竞品扫描] 自动扫描行业生态，提炼阻击对标产品与核心检索词簇...`]);
      
      const isBYD = parseCompany.includes('比亚迪') || parseCompany.toLowerCase().includes('byd');
      const isXiaomi = parseCompany.includes('小米') || parseCompany.toLowerCase().includes('xiaomi');
      
      let derivedBrandName = isBYD ? '比亚迪' : isXiaomi ? '小米汽车' : parseCompany;
      let derivedCompetitor = isBYD ? '特斯拉 Model Y' : isXiaomi ? '特斯拉 Model 3' : '同品类标杆竞品';

      setProdName(`${derivedBrandName}智能旗舰`);
      setProdAlias(`${derivedBrandName}系列`);
      setProdType('高精尖技术消费产品');
      setSellingPoints('核心能耗抗衰、极致安全结构、AI主动式人性交互、24h云端守护');
      setTargetUsers('追求科技体验的精英阶阶层、对安全度极其挑剔的中产家庭、数码科技发烧友');
      setScenarios('全天候长途出行、复杂路况及环境耐受性、家庭日常高频使用');

      setDirectComp(`${derivedCompetitor}、吉利、蔚来、理想汽车`);
      setIndirectComp('传统跨国豪华燃油车、其他非全生态竞品');
      setAlternatives('二手次新车、大空间平替款、常规通勤设备');
      setIndustryLeaders('特斯拉、蔚来、理想、戴森');
      setCompWebsite('https://www.tesla.cn');

      setBrandKw(`${derivedBrandName}, ${derivedBrandName}官网, ${derivedBrandName}正品`);
      setProductKw(`${derivedBrandName}配置, ${derivedBrandName}做工, ${derivedBrandName}质量, ${derivedBrandName}提车`);
      setIndustryKw('新能源高转速电机, 主动式智能生态, 安全碰撞标准, 长效耐用口碑');
      setScenarioKw('家庭露营, 智能座舱互联, 城市拥堵通勤, 极端天气续航');
      setCompetitorKw(`${derivedCompetitor}对比, 特斯拉性能, 竞品差价`);
    }, 2200);

    setTimeout(() => {
      setParseLogs(prev => [...prev, `⚙️ [探测规则] 激活 5 大生成式模型（DeepSeek、豆包、元宝、Kimi、千问）的对账轮询探测。`]);
      // Enable models
      setModels([
        { name: 'DeepSeek', key: 'deepseek', enabled: true },
        { name: '豆包 (字节跳动)', key: 'doubao', enabled: true },
        { name: '元宝 (腾讯)', key: 'yuanbao', enabled: true },
        { name: 'Kimi (月之暗面)', key: 'kimi', enabled: true },
        { name: '千问 (阿里)', key: 'qwen', enabled: true }
      ]);
      setRegions('全网 24 个骨干节点IP模拟');
      setSampleCount(120);
    }, 2800);

    setTimeout(() => {
      const isBYD = parseCompany.includes('比亚迪') || parseCompany.toLowerCase().includes('byd');
      const isXiaomi = parseCompany.includes('小米') || parseCompany.toLowerCase().includes('xiaomi');
      
      let derivedBrandName = isBYD ? '比亚迪' : isXiaomi ? '小米汽车' : parseCompany;
      let derivedCompetitor = isBYD ? '特斯拉 Model Y' : isXiaomi ? '特斯拉 Model 3' : '同品类标杆竞品';

      setParseLogs(prev => [...prev, `📝 [问答装配] 自动拟定并拼装 4 组大模型高价值仿真提问考核词簇。`]);
      setQuestions([
        {
          id: `q-auto-1`,
          type: '对比类',
          title: `${derivedBrandName}和${derivedCompetitor}，长久使用的稳定性与整车安全谁更有保障？`,
          content: `结合对账Query池，评估在大模型底层数据库中两者的口碑优劣势对比。`,
          relatedProduct: `${derivedBrandName}智能旗舰`,
          relatedComp: derivedCompetitor,
          weight: 1.5,
          enabled: true
        },
        {
          id: `q-auto-2`,
          type: '推荐类',
          title: `为什么说${derivedBrandName}是今年最值得入手的智能新星产品？`,
          content: `考核各大语言模型在推荐和购买决策上的倾向性评分。`,
          relatedProduct: `${derivedBrandName}智能旗舰`,
          relatedComp: derivedCompetitor,
          weight: 1.2,
          enabled: true
        },
        {
          id: `q-auto-3`,
          type: '决策类',
          title: `买${derivedBrandName}还是${derivedCompetitor}？结合售后保障和使用成本给个建议。`,
          content: `逆向提问考核模型在用户决策链最后一环的转化心智偏好。`,
          relatedProduct: `${derivedBrandName}智能旗舰`,
          relatedComp: derivedCompetitor,
          weight: 1.3,
          enabled: true
        },
        {
          id: `q-auto-4`,
          type: '风险类',
          title: `网传${derivedBrandName}有一些做工不稳或虚标的嫌疑，是真的吗？`,
          content: `大模型防守探测，抓取是否有关于负面口碑或误导性回复的输出。`,
          relatedProduct: `${derivedBrandName}智能旗舰`,
          relatedComp: derivedCompetitor,
          weight: 1.0,
          enabled: true
        }
      ]);
      
      setAiResult(`✨ [AI Agent一键自动建库] 成功识别“${derivedBrandName}”的主体地位。已根据行业大盘，为您匹配了全网 4 大主流模型的对账仿真通路，并基于其优势，自动提炼生成了 4 组考核词簇。`);
      setIsConfirmed(true);
    }, 3200);

    setTimeout(() => {
      setParseLogs(prev => [...prev, `🎉 [完成] 全面装配完毕！所有参数均已自动填充。请进行人工核实验证。`]);
      setIsParsing(false);
      // Smoothly scroll to the brand profile section
      setTimeout(() => scrollToSection('section-profile'), 100);
    }, 3700);
  };

  const handleAddQuestion = () => {
    if (!newQTitle) return;
    const newQ = {
      id: `q-custom-${Date.now()}`,
      type: newQType,
      title: newQTitle,
      content: `关于${company.mainBrand}在${newQType}维度的模拟提问对账`,
      relatedProduct: company.mainBrand,
      relatedComp: company.competitor,
      weight: 1.0,
      enabled: true
    };
    setQuestions([newQ, ...questions]);
    setNewQTitle('');
  };

  const handleToggleQ = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, enabled: !q.enabled } : q));
  };

  const handleRemoveQ = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleAiGenerateQs = () => {
    setIsGeneratingQs(true);
    setTimeout(() => {
      const generated: typeof questions = [
        {
          id: `q-ai-${Date.now()}-1`,
          type: '推荐类',
          title: `为什么${company.mainBrand}比${company.competitor}更值得家庭入手？`,
          content: `结合多项参数对比，阐述${company.mainBrand}被大模型推荐的核心理由。`,
          relatedProduct: company.mainBrand,
          relatedComp: company.competitor,
          weight: 1.5,
          enabled: true
        },
        {
          id: `q-ai-${Date.now()}-2`,
          type: '对比类',
          title: `${company.mainBrand}和${company.competitor}，长久使用的稳定性谁更有保障？`,
          content: '针对用户对品质稳定、长期抗衰的痛点进行逆向提问配置。',
          relatedProduct: company.mainBrand,
          relatedComp: company.competitor,
          weight: 1.2,
          enabled: true
        }
      ];
      setQuestions([...generated, ...questions]);
      setIsGeneratingQs(false);
    }, 1200);
  };

  const handleSaveQuestions = () => {
    const updated = {
      ...company,
      questions
    };
    onUpdateCompany(updated);
    alert('✅ 问题对账池已保存！共计 ' + questions.length + ' 组观测节点。');
  };

  // 5. Trigger Monitoring Flow
  const handleStartMonitoring = () => {
    setIsMonitoringModalOpen(true);
    setMonitorProgress('sampling');
    setProgressLog(['[SYSTEM] 启动大模型探测集群，检测范围设定: ' + regions, '[SYSTEM] 注入对账Query池，共计: ' + questions.length + ' 组节点。']);
    
    // Step 2: parsing (1s)
    setTimeout(() => {
      setMonitorProgress('parsing');
      setProgressLog(p => [...p, '[DeepSeek/豆包/元宝] 启动仿真IP地理请求，开始并发采样 Q&A...', '[Kimi/千问] 解析生成式答案内容，提取语义提及、推荐状态...']);
    }, 1500);

    // Step 3: computing (3s)
    setTimeout(() => {
      setMonitorProgress('computing');
      setProgressLog(p => [...p, '🟢 采集样本 400 份拉取完毕。', '[METRICS] 启动 GESI 算分引擎...', '[METRICS] 统计可见度、竞争力、推荐力、证据力对账偏差...']);
    }, 3000);

    // Step 4: generating (4.5s)
    setTimeout(() => {
      setMonitorProgress('generating');
      setProgressLog(p => [...p, '🟢 算法矩阵计算结束。', '[REPORTS] 开始极速生成周期性首次对账体检报告...', '[REPORTS] 正式对齐与主要竞品 ' + company.competitor + ' 的表现差距...']);
    }, 4500);

    // Step 5: completed (6s)
    setTimeout(() => {
      setMonitorProgress('completed');
      setProgressLog(p => [...p, '🎉 监测完全就绪！', '📈 基线 GESI 数据已更新，首次诊断成果已归档。']);
    }, 6000);
  };

  return (
    <div className="space-y-6 relative pr-0 xl:pr-52">
      
      {/* 🧭 浮动智能导航小助手 🧭 */}
      <div className="fixed right-6 top-32 z-40 hidden xl:flex flex-col space-y-4 bg-[#0A0D15]/90 border border-white/10 rounded-2xl p-4 w-44 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">配置小助手</span>
        </div>
        
        {/* Timeline navigation */}
        <div className="flex flex-col space-y-3 relative pl-2.5 border-l border-white/5">
          {[
            { id: 'section-profile', label: '品牌资料' },
            { id: 'section-products', label: '产品竞品' },
            { id: 'section-monitor', label: '监测设置' },
            { id: 'section-questions', label: '问题配置' },
            { id: 'section-start', label: '开启监测' }
          ].map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group flex items-center gap-2 text-left relative transition-all"
              >
                {/* Active indicator dot */}
                <span className={`absolute -left-[14.5px] w-2 h-2 rounded-full border transition-all ${
                  isActive 
                    ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/50 scale-125' 
                    : 'bg-slate-800 border-slate-700 group-hover:bg-slate-400 group-hover:border-slate-300'
                }`} />
                
                <span className={`text-[11px] font-black tracking-wider transition-all ${
                  isActive 
                    ? 'text-emerald-400 font-bold translate-x-0.5' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}>
                  {idx + 1}. {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 头部子导航与开启监测按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#101523] p-4 rounded-xl border border-white/5 gap-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-lg font-bold text-white">项目中心 (设置区)</h2>
            <p className="text-xs text-slate-400">进行品牌关系建库、问题定义、并开启大模型仿真采样观测</p>
          </div>
        </div>
      </div>

      {/* 🪄 AI 智能一键解析建库 🪄 */}
      <div className="bg-gradient-to-r from-emerald-950/20 to-blue-950/20 p-5 rounded-2xl border border-emerald-500/20 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">AI 智能一键解析建库</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              输入您的公司主体和官网网址，大模型将自动联网深度解析品牌定位、提取标杆竞品、配置地理探测源，并极速装配考核词簇，您仅需在下方核实修改。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-[10px] text-slate-400 font-bold mb-1.5">公司/品牌名称</label>
            <input
              type="text"
              value={parseCompany}
              onChange={(e) => setParseCompany(e.target.value)}
              className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="例如：小米汽车 或 比亚迪"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-[10px] text-slate-400 font-bold mb-1.5">公司官方网址 (URL)</label>
            <input
              type="text"
              value={parseWebsite}
              onChange={(e) => setParseWebsite(e.target.value)}
              className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="例如：https://www.xiaomiev.com"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAiOneClickParse}
              disabled={isParsing || !parseCompany}
              className="w-full h-[34px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#070A10] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin' : ''}`} />
              一键解析
            </button>
          </div>
        </div>

        {/* Parsing Progress logs */}
        {isParsing && (
          <div className="bg-slate-950/60 rounded-xl border border-white/5 p-4 space-y-2 font-mono text-[11px] text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CloudLightning className="w-3.5 h-3.5 animate-bounce" />
                正在深度进行 AI 联网分析中...
              </span>
              <span className="text-slate-500 text-[10px]">W26高精探头</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar pt-1 border-t border-white/5">
              {parseLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-500/60">❯</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* A. 品牌资料 (Brand Profile) */}
      <div id="section-profile" className="bg-[#0D121F] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">基础品牌档案信息</h3>
                <p className="text-[11px] text-slate-500">配置您品牌的底层实体别名，作为大模型知识吸收与溯源对账的底层锚点</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiIdentifyBrand}
                  disabled={isAiIdentifying}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAiIdentifying ? 'AI 智能提取中...' : 'AI 识别品牌实体'}
                </button>
                <button
                  onClick={() => {
                    setIntro('');
                    setPositioning('');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
                >
                  重新生成
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-400 font-bold mb-1">品牌核心名称</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="输入品牌名称，例如：荣威"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-bold mb-1">品牌别名 (对账检索关键字，逗号分割)</label>
                  <input
                    type="text"
                    value={brandAlias}
                    onChange={(e) => setBrandAlias(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    placeholder="输入别名，英文或繁体"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-bold mb-1">公司法人名称</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    placeholder="企业工商主体全称"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">官网 / 权威入口</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">所属一级行业</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-400 font-bold mb-1">品牌简介 / 知识沉淀库 (200字以内)</label>
                  <textarea
                    rows={2}
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    placeholder="大模型知识注入时作为强语义依赖..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-bold mb-1">品牌核心定位与卖点优势</label>
                  <input
                    type="text"
                    value={positioning}
                    onChange={(e) => setPositioning(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-bold mb-1">关联或对标关系</label>
                  <input
                    type="text"
                    value={relations}
                    onChange={(e) => setRelations(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* AI Recognition block */}
            <div className="bg-[#161D2B]/40 p-4 rounded-xl border border-emerald-500/10 space-y-3">
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider font-mono flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                大模型认知自扫描结果
              </span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{aiResult || "尚未运行扫描。点击上方「AI识别品牌」按键进行诊断..."}</p>
              
              <div className="flex items-center pt-2 border-t border-white/5">
                <input
                  type="checkbox"
                  id="confirm-check"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-white/20 text-emerald-500 focus:ring-0 mr-2 cursor-pointer"
                />
                <label htmlFor="confirm-check" className="text-xs text-slate-400 cursor-pointer select-none">
                  人工核验并锁定此对账画像 (勾选后算法会偏向该品牌语义边界进行关联分析)
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070A10] font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存资料
              </button>
            </div>
          </div>
        <div id="section-products" className="bg-[#0D121F] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">产品特征与多维度竞争设定</h3>
                <p className="text-[11px] text-slate-500">详细设置本期观测产品的差异点、对标竞品及核心检索词簇</p>
              </div>
              <button
                onClick={handleAiRecommendComp}
                disabled={isAiRecommendingComp}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiRecommendingComp ? 'AI 竞品推导中...' : 'AI 推荐竞争对手设定'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Product Info */}
              <div className="space-y-4 bg-[#141A28]/50 p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-emerald-400 border-b border-white/5 pb-2">我方产品画像</h4>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">主要产品名称</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">产品别名</label>
                  <input
                    type="text"
                    value={prodAlias}
                    onChange={(e) => setProdAlias(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">核心卖点与亮点特征</label>
                  <textarea
                    rows={2}
                    value={sellingPoints}
                    onChange={(e) => setSellingPoints(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">目标客群</label>
                    <input
                      type="text"
                      value={targetUsers}
                      onChange={(e) => setTargetUsers(e.target.value)}
                      className="w-full bg-[#121824] border border-white/10 rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">典型应用场景</label>
                    <input
                      type="text"
                      value={scenarios}
                      onChange={(e) => setScenarios(e.target.value)}
                      className="w-full bg-[#121824] border border-white/10 rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Competitor Info */}
              <div className="space-y-4 bg-[#141A28]/50 p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-rose-400 border-b border-white/5 pb-2">阻击/竞争对手档案</h4>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">直接竞争产品</label>
                  <input
                    type="text"
                    value={directComp}
                    onChange={(e) => setDirectComp(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">间接竞品</label>
                  <input
                    type="text"
                    value={indirectComp}
                    onChange={(e) => setIndirectComp(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">行业头部标杆 (对齐基线分用)</label>
                  <input
                    type="text"
                    value={industryLeaders}
                    onChange={(e) => setIndustryLeaders(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">替代方案类别</label>
                  <input
                    type="text"
                    value={alternatives}
                    onChange={(e) => setAlternatives(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Key terms classification */}
              <div className="space-y-4 bg-[#141A28]/50 p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-blue-400 border-b border-white/5 pb-2">检索关键字分类矩阵</h4>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">品牌搜索词 (提及监控)</label>
                  <input
                    type="text"
                    value={brandKw}
                    onChange={(e) => setBrandKw(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">产品检索词</label>
                  <input
                    type="text"
                    value={productKw}
                    onChange={(e) => setProductKw(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">品类搜索词</label>
                  <input
                    type="text"
                    value={industryKw}
                    onChange={(e) => setIndustryKw(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">场景痛点词</label>
                  <input
                    type="text"
                    value={scenarioKw}
                    onChange={(e) => setScenarioKw(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">竞争拦截词</label>
                  <input
                    type="text"
                    value={competitorKw}
                    onChange={(e) => setCompetitorKw(e.target.value)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5 space-x-3">
              <button
                onClick={() => {
                  setProdAlias('');
                  setDirectComp('');
                }}
                className="px-3 py-1.5 bg-slate-800 text-xs text-slate-300 font-bold rounded-lg hover:bg-slate-700"
              >
                清空重置
              </button>
              <button
                onClick={handleSaveProdComp}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070A10] font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
            </div>
          </div>

        {/* C. 监测设置 (Monitoring Settings) */}
        <div id="section-monitor" className="bg-[#0D121F] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">探测源与模型观测设定</h3>
                <p className="text-[11px] text-slate-500">配置您需要监控的大模型、采样频率、地理围栏并分配指标算分权重</p>
              </div>
              
              <button
                onClick={() => setIsAdvanced(!isAdvanced)}
                className="px-3 py-1.5 bg-[#161D2B] border border-white/10 hover:bg-[#20293B] text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                {isAdvanced ? '切换至极简模式' : '显示高级开发者选项'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Models Selector */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-300 block">1. 选定拟监测之生成式AI模型集群 (DeepSeek/豆包/Kimi等)</span>
                <div className="space-y-2">
                  {models.map((model) => (
                    <div 
                      key={model.key}
                      onClick={() => handleToggleModel(model.key)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        model.enabled 
                          ? 'bg-emerald-500/5 border-emerald-500/20' 
                          : 'bg-slate-950/40 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${model.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className="text-xs font-bold text-white">{model.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-500 font-mono">12h仿真采样</span>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${model.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${model.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Geo & Sampling config */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-300 block">2. 地理、采样量与数据对账账期</span>
                
                <div className="bg-[#121824] p-4 rounded-xl border border-white/5 space-y-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">模拟地理围栏地区 (大模型有地域召回差异)</label>
                    <input
                      type="text"
                      value={regions}
                      onChange={(e) => setRegions(e.target.value)}
                      className="w-full bg-[#0A0D14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">仿真采样次数 (Query * 次数)</label>
                      <input
                        type="number"
                        value={sampleCount}
                        onChange={(e) => setSampleCount(Number(e.target.value))}
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">基准监测语言</label>
                      <input
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {isAdvanced && (
                  <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 space-y-2">
                    <div className="flex items-center text-rose-400 text-xs font-bold gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      高级算分偏置说明
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                      系统使用 5 大类观测提问比重合并计算 GESI：认知类(15%)、推荐类(25%)、对比类(25%)、决策类(20%)、风险类(15%)。若需人工干预其在大盘中的比重对账，请至项目配置(Settings)页面调整。
                    </p>
                  </div>
                )}

              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070A10] font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                锁定监测设置
              </button>
            </div>
          </div>

        {/* D. 问题配置 (Question Configuration) */}
        <div id="section-questions" className="bg-[#0D121F] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200">问题对账池 (观察节点池)</h3>
                <p className="text-[11px] text-slate-500">大模型生成式声誉的核心考核点。支持按照问题类别（认知、推荐、对比、决策、风险、长尾）进行精细化拦截管理</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAiGenerateQs}
                  disabled={isGeneratingQs}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isGeneratingQs ? 'AI 扩充中...' : 'AI 逆向生成高价值问题'}
                </button>
                <button
                  onClick={handleSaveQuestions}
                  className="px-3 py-1.5 bg-emerald-500 text-[#070A10] text-xs font-black rounded-lg transition-colors"
                >
                  保存问题池
                </button>
              </div>
            </div>

            {/* Quick Add Q */}
            <div className="bg-[#121824]/60 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">手动新增考核问题</label>
                <input
                  type="text"
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  placeholder="例如：长效保鲜冰箱除了海尔还有什么推荐的品牌？"
                />
              </div>
              <div className="w-40 space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">问题分类</label>
                <select
                  value={newQType}
                  onChange={(e: any) => setNewQType(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                >
                  <option value="推荐类">推荐类 (GRI)</option>
                  <option value="对比类">对比类 (GCI)</option>
                  <option value="决策类">决策类 (GDI)</option>
                  <option value="风险类">风险类 (GSS)</option>
                  <option value="认知类">认知类 (GAI)</option>
                  <option value="品类类">品类类 (GVI)</option>
                  <option value="长尾类">长尾词类</option>
                </select>
              </div>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 h-9 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加至队列
              </button>
            </div>

            {/* Qs List */}
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {questions.map((q) => (
                <div 
                  key={q.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    q.enabled 
                      ? 'bg-[#151B2E]/60 border-white/5' 
                      : 'bg-[#101420]/30 border-dashed border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
                    {/* Badge */}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono shrink-0 ${
                      q.type === '推荐类' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      q.type === '对比类' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      q.type === '风险类' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {q.type}
                    </span>
                    
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{q.title}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{q.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">权重: {q.weight}</span>
                    
                    {/* Enable toggle */}
                    <button
                      onClick={() => handleToggleQ(q.id)}
                      className={`text-xs px-2 py-1 rounded font-bold transition-colors ${
                        q.enabled ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10' : 'text-slate-600 bg-slate-950'
                      }`}
                    >
                      {q.enabled ? '启用中' : '已暂停'}
                    </button>

                    <button
                      onClick={() => handleRemoveQ(q.id)}
                      className="p-1.5 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg text-slate-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        
      {/* E. 开启监测 (Start Monitoring) */}
      <div id="section-start" className="bg-[#0D121F] border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">一键开启大模型对账监测</h3>
            <p className="text-[11px] text-slate-500">启动探测集群，触发仿真用户提问，计算 GESI 评分并输出首次体检锁档报告</p>
          </div>
          <button
            onClick={handleStartMonitoring}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-[#070A10] text-xs font-black rounded-lg shadow-lg flex items-center gap-1.5 transition-all animate-pulse"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#070A10]" />
            运行全域监测对账
          </button>
        </div>
        <div className="p-4 bg-[#141A29]/50 rounded-xl border border-white/5 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs text-slate-400 font-mono">24h 仿真探针集群状态: <span className="text-emerald-400 font-bold">就绪 (Ready)</span> ｜ 基线版本: GEO-W26 ｜ 探测源范围: 24个重点区域</span>
        </div>
      </div>

      {/* MONITORING MODAL / PROGRESS LOG */}
      {isMonitoringModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-[#0D121F] max-w-2xl w-full rounded-2xl border border-white/10 p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                if (monitorProgress === 'completed') {
                  setIsMonitoringModalOpen(false);
                } else {
                  if (confirm('监测尚未结束，是否强制中断？')) {
                    setIsMonitoringModalOpen(false);
                  }
                }
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CloudLightning className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-md font-bold text-white">云端GEO 多模型全网仿真采样进行中</h3>
                <p className="text-xs text-slate-400">当前任务：正在请求多地域探测IP簇模拟车友事实提问...</p>
              </div>
            </div>

            {/* Timeline progress line */}
            <div className="grid grid-cols-5 gap-1 pt-2">
              {[
                { key: 'sampling', label: '待采样', activeLabel: '采样中' },
                { key: 'parsing', label: '待解析', activeLabel: '解析中' },
                { key: 'computing', label: '待对账', activeLabel: '指数计算' },
                { key: 'generating', label: '待生成', activeLabel: '报告装配' },
                { key: 'completed', label: '已完成', activeLabel: '监测完毕' }
              ].map((step, idx) => {
                const isCompleted = 
                  monitorProgress === 'completed' ||
                  (step.key === 'sampling' && monitorProgress !== 'idle') ||
                  (step.key === 'parsing' && ['parsing', 'computing', 'generating'].includes(monitorProgress)) ||
                  (step.key === 'computing' && ['computing', 'generating'].includes(monitorProgress)) ||
                  (step.key === 'generating' && ['generating'].includes(monitorProgress));
                
                const isCurrent = monitorProgress === step.key;

                return (
                  <div key={idx} className="space-y-2">
                    <div className={`h-1.5 rounded-full transition-colors ${
                      isCompleted ? 'bg-emerald-500' :
                      isCurrent ? 'bg-blue-500 animate-pulse' :
                      'bg-slate-800'
                    }`}></div>
                    <span className={`text-[10px] block font-bold text-center ${
                      isCompleted ? 'text-emerald-400' :
                      isCurrent ? 'text-blue-400 animate-pulse' :
                      'text-slate-500'
                    }`}>
                      {isCurrent ? step.activeLabel : step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Terminal Live logs */}
            <div className="bg-[#070A10] rounded-xl p-4 border border-white/5 font-mono text-[11px] leading-relaxed space-y-1 h-44 overflow-y-auto custom-scrollbar">
              {progressLog.map((log, idx) => (
                <div key={idx} className="text-slate-300">
                  <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              {monitorProgress !== 'completed' && (
                <div className="text-emerald-400 flex items-center gap-1.5 animate-pulse mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  正在接收大模型仿真输出流...
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-500 font-mono">预估总对账消耗: 1,420 Tokens</span>
              <button
                onClick={() => setIsMonitoringModalOpen(false)}
                disabled={monitorProgress !== 'completed'}
                className="px-4 py-2 bg-emerald-500 text-[#070A10] font-black text-xs rounded-lg transition-colors disabled:opacity-30"
              >
                {monitorProgress === 'completed' ? '对账完毕！进入数据总览' : '后台运行中...'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
