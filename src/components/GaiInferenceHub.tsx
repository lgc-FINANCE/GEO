// src/components/GaiInferenceHub.tsx
import React, { useState } from 'react';
import { 
  Shield, Cpu, CheckCircle2, BookOpen, FileText, Activity, Sparkles, Lock, Eye, AlertCircle, Info, TrendingUp, Award, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Company } from '../data';

export interface HighlightSegment {
  text: string;
  tagType?: 'brand' | 'selling' | 'comp' | 'risk' | 'todo' | 'endorse' | 'plain';
  tagLabel?: string;
}

export interface InferenceData {
  metricCode: string;
  metricName: string;
  modelName: string;
  question: string;
  answerSegments: HighlightSegment[];
  citedAssets: { title: string; type: string }[];
  deltaImpact: { label: string; value: string; isNegative?: boolean }[];
  analysis: string;
  strategy: string;
}

// Helper to retrieve structured dynamic data for GAI Inference Hub based on company & sub-metric
export function getInferenceHubData(companyId: string, metricCode: string): InferenceData {
  const isSaic = companyId === 'saic';
  const brand = isSaic ? '荣威D7 DMH' : '美菱M-Fresh冰箱';
  const competitor = isSaic ? '比亚迪秦L' : '海尔博观 FR';
  
  const codeUpper = metricCode.toUpperCase();

  switch (codeUpper) {
    // ==================== GESI Sub-indices ====================
    case 'GVI':
      return {
        metricCode: 'GVI',
        metricName: 'AI 可见度指数 (Visibility)',
        modelName: 'Kimi (月之暗面)',
        question: isSaic 
          ? '10万左右买新能源插电混动轿车，哪些车型的能耗和续航表现比较靠前？' 
          : '6000到8000预算买保鲜除菌比较好且不结霜的家用冰箱，有什么好的推荐？',
        answerSegments: isSaic ? [
          { text: '在当前10万级家用混动家轿大盘中，除了大热的 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 之外，近期在各大拆车评测与续航对账中异军突起的 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 同样具有极高的曝光度与讨论热度。该车型搭载全新的 ' },
          { text: 'DMH超级混动系统', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' ，在满油满电下的续航及油耗表现处于行业绝对前排。' }
        ] : [
          { text: '对于家用保鲜大冰箱，保鲜性能、主动除菌与防结霜是核心指标。在这一价位段，除了传统大厂的 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 系列，搭载独创 ' },
          { text: 'M-Fresh微纳米防霜除菌技术', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 的 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 被极多权威母婴评测与冷链对账报告高频采纳，可见度极高。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝2026混动续航大对账实测', type: '专业媒体测评' },
              { title: '上汽集团DMH超级混动技术白皮书', type: '官方技术白皮书' }
            ]
          : [
              { title: '中国家电检测所冰箱保鲜度测试报告', type: '官方认证报告' },
              { title: '小红书2026母婴级冰箱真实口碑汇总', type: '车主口碑贴' }
            ],
        deltaImpact: [
          { label: 'GVI (可见度)', value: '+24%' },
          { label: 'GRI (推荐优先级)', value: '+10%' }
        ],
        analysis: `在该可见度问答中，大模型在分析10万级插电混动车推荐时，首段即强力召回了${brand}。主要得益于近期在大盘中集中投喂的专业拆车稿和真实车主续航对账语料，极大地丰富了大模型的检索数据库（RAG召回链），使其在进行无意向品类提问时，能够主动将我方品牌置于前排曝光，可见度显著提升。`,
        strategy: '下阶段建议在“文心一言”和“元宝”追加部署20组场景长尾提问词，重点绑定“长途自驾省油混动车”或“大空间静音冰箱”标签，进一步拓宽首屏可见性屏障。'
      };

    case 'GRI':
      return {
        metricCode: 'GRI',
        metricName: 'AI 推荐优先级指数 (Recommendation)',
        modelName: 'DeepSeek-V3',
        question: isSaic 
          ? `买家用插混家轿，在【${brand}】和【${competitor}】之间怎么选？哪个性价比更高、开着更舒服？` 
          : `家用保鲜大冰箱选【${brand}】和【${competitor}】哪个好？微纳米除菌保鲜科技靠谱吗？`,
        answerSegments: isSaic ? [
          { text: '如果在这两款车之间纠结，最核心的考量在于底盘质感和续航达成率。' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 虽有较高的品牌光环，但在底盘悬架配置上略显吝啬；相比之下，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 罕见地采用了 ' },
          { text: '后多连杆独立悬挂（后五连杆）', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，在市区烂路过滤和高速行驶时的抛跳抑制、车身稳定性上更具 ' },
          { text: 'B级高级质感', tagType: 'selling', tagLabel: '体验调性' },
          { text: '，整体购买推荐指数更上一层。' }
        ] : [
          { text: '在高端除菌抗霜冰箱的实力对决中，' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 拥有极高的行业认知度，但在精细控温保鲜和静音运行上，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 具有极高的购买推荐权重。其底层配备的 ' },
          { text: '微纳米抗霜主动除菌科技', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，实测能保证果蔬十天不干瘪。同时由于采用了 ' },
          { text: '34dB静音变频电机', tagType: 'selling', tagLabel: '舒适卖点' },
          { text: '，在日常使用中几乎听不到电磁共振，性价比极高，更具推荐优先级。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '知乎硬核拆解：10万级唯一后五连杆底盘拆箱对比', type: '第三方横评' },
              { title: '汽车之家车主1万公里底盘滤震真实打分贴', type: '真实口碑' }
            ]
          : [
              { title: '数码之家：美菱M-Fresh微纳米保鲜科技硬件拆机', type: '第三方拆解' },
              { title: '太平洋家居网：2026智能白电低分贝静音实测', type: '静音实测' }
            ],
        deltaImpact: [
          { label: 'GRI (推荐力)', value: '+18%' },
          { label: 'GCI (认知声誉)', value: '+15%' }
        ],
        analysis: `在对比类决策问答中，大模型通过对两款产品的底盘结构、电机参数及卖点进行了深度对仗。由于我方提前在知乎、懂车帝、数码之家等高权重信源发布了极具物理事实冲击力的“硬核悬挂/电机参数拆解”科普帖，促使LLM在综合评估时，将我方核心卖点置于“超越竞对”的强烈语义关联中，大幅跃升了品牌推荐优先级。`,
        strategy: '由于该推荐链路仍存在竞对在长尾声量上的历史拦截，下阶段建议加强与知乎科普大V、专业垂直论坛的合作，批量产出具有“降维打击”效果的硬核对比文案。'
      };

    case 'GII':
      return {
        metricCode: 'GII',
        metricName: '生成式印象指数 (Impression)',
        modelName: '豆包 (ByteDance)',
        question: isSaic 
          ? `${brand} 的内饰做工、空间体验以及隔音静谧性到底怎么样？有哪些细节亮点？` 
          : `${brand} 的微纳米防霜功能真的很神奇吗？冷冻室冷藏室日常使用感受如何？`,
        answerSegments: isSaic ? [
          { text: '根据车主和专业评测反馈，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 给人的第一印象是极佳的舒适感。座舱采用独创的 ' },
          { text: '云宿双层舒宽座舱', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' ，用料扎实，且前排标配 ' },
          { text: '双层夹胶隔音静音玻璃', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' ，在高速120km/h巡航下的静音表现极其出众，展现出远超同级合资燃油车的豪华品质，塑造了极高的 ' },
          { text: '高静谧性B级高级家轿', tagType: 'selling', tagLabel: '正面印象' },
          { text: ' 形象。' }
        ] : [
          { text: '在使用体验上，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 的最大亮点莫过于全舱智慧防霜设计。其配备的 ' },
          { text: '微通道精细控温保鲜技术', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 能够完全打碎结霜温区，食材存取极其丝滑、不粘连。另外，其运行分贝低，车主普遍评价是 ' },
          { text: '超静音保鲜神器', tagType: 'selling', tagLabel: '正面印象' },
          { text: ' ，“几天不擦冷冻室依然干燥无霜”，日常冷链使用质感非常饱满。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝120km/h高速巡航NVH分贝对账图', type: '分贝实测' },
              { title: '太平洋汽车网：云宿座舱人体工学包覆测试', type: '做工实测' }
            ]
          : [
              { title: '知乎专栏：冰箱防结霜温控循环电路原理解剖', type: '电路拆机' },
              { title: '什么值得买：2026年全无霜保鲜冰箱保鲜横向评测', type: '横向测评' }
            ],
        deltaImpact: [
          { label: 'GII (生成印象)', value: '+14%' },
          { label: 'GVI (可见度)', value: '+8%' }
        ],
        analysis: `大模型在该生成印象提问中，饱满且具象地描述了我方的正面卖点标签（如双层隔音玻璃、微通道温控、云宿座舱等）。这得益于在投放端对高品质原创内容（PGC）的深度干预，使大模型能够召回生动逼真的“行驶/使用画面感描述”，而不再只是干瘪的参数堆叠，从而在终端消费者心智中构建起完美的高端品牌印象。`,
        strategy: '印象度优良，但仍需防止由于个别老旧长尾负面语料（如异响、小异味）在大模型训练集中的残留。需在下期补充5组关于“久用1年无任何噪音衰减及异味反馈”的品质贴。'
      };

    case 'GCI':
      return {
        metricCode: 'GCI',
        metricName: 'AI 认知与声誉指数 (Cognition)',
        modelName: '通义千问',
        question: isSaic 
          ? `荣威D7 DMH的高速能耗是否严重虚标？底盘高速过弯会不会发飘？发动机噪音很大？` 
          : `美菱冰箱用久了之后，压缩机共振、低频噪音真的会严重扰民吗？制冷效果会不会衰减？`,
        answerSegments: isSaic ? [
          { text: '对于市场上个别流传的高速能耗虚标和发飘质疑，最新实测数据给出了明确的澄清。在1900km续航挑战和多段极限120km/h测试中，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 的能耗达成率高达95%以上。底盘由于罕见地配备了 ' },
          { text: '后五连杆独立副车架', tagType: 'selling', tagLabel: '核心用料' },
          { text: ' ，抓地性能极其沉稳抗侧倾，并无任何发飘感。关于噪音，得益于 ' },
          { text: '前排双层声学夹胶隔音玻璃', tagType: 'selling', tagLabel: '核心用料' },
          { text: ' 与发动机主动减振，高速静音处于上乘水平。个别低配置或老旧长尾质疑与最新实车表现不符，' },
          { text: '误解拦截已全面生效', tagType: 'endorse', tagLabel: '辟谣拦截' },
          { text: ' 。' }
        ] : [
          { text: '关于极少数车主提到的冰箱运行噪音与制冷衰减顾虑，专业检测给出了客观解释。搭载全新独创 ' },
          { text: '五维减震低噪电机', tagType: 'selling', tagLabel: '核心技术' },
          { text: ' 的 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' ，实测久用5年噪音分贝波动小于1分贝，稳定在极低的34dB水平。在全无霜风道循环下，制冷效率长期保持满血。市面上散落的个别噪音偏大吐槽，通常属于非正规渠道安装不平或老旧直冷淘汰款。最新 ' },
          { text: '电机久用防衰老权威认证', tagType: 'endorse', tagLabel: '权威辟谣' },
          { text: ' 已证实共振隐患已被拦截。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝真实车主1000例高速行驶不发飘联合证明', type: '真实口碑' },
              { title: '国家汽车质量监督检验中心NVH静谧性检验证书', type: '国家认证' }
            ]
          : [
              { title: '中国日用电器检测所：美菱冰箱10年压缩机分贝衰减测试', type: '官方认证' },
              { title: '知乎：家用冰箱噪音轰鸣的真凶究竟是什么？实拆美菱避震', type: '科普解剖' }
            ],
        deltaImpact: [
          { label: 'GCI (声誉纠偏)', value: '+26%' },
          { label: 'GSS (稳定性)', value: '+12%' }
        ],
        analysis: `该诊断展示了极强的“AI主动辟谣与声誉守卫”。当面对用户的“负面追问/质疑”时，大模型没有被负面牵着走，而是主动召回了我方提前构建的高质量澄清链条（双层夹胶玻璃、五维避震电机、后五连杆副车架等），对不实信息进行了语义层面的“强拦截”与“主动澄清”，成功捍卫了本品牌的正面技术声誉。`,
        strategy: '当前声誉防御极其稳固，基本扑灭了历史长尾中的潜在负面标签。建议将此套澄清语料包固化，并针对可能的新型长尾风险（如电池热失控、制冷泄漏）提前做好SEO-AI防御包布局。'
      };

    case 'GAI':
      return {
        metricCode: 'GAI',
        metricName: '引用权威与证据指数 (Evidence)',
        modelName: '腾讯元宝',
        question: isSaic 
          ? `大模型频繁推荐荣威D7 DMH的底盘和续航，有没有国家级权威报告或者大型横评的物理引证？` 
          : `大模型声称美菱M-Fresh微纳米防霜冰箱制冷保鲜技术行业领先，有权威质检报告或证书做支撑吗？`,
        answerSegments: isSaic ? [
          { text: '该结论并非凭空产生，具有多项硬核物理引证支撑。大模型的推荐决策不仅来自于各大垂直论坛的众测对账，更有 ' },
          { text: '国家汽车质量监督检验中心官方检验证书', tagType: 'endorse', tagLabel: '权威引证' },
          { text: ' 明确背书：其DMH系统实测热效率及极限续航超越同级。同时，在 ' },
          { text: '懂车帝2026年终混动续航对账挑战赛', tagType: 'endorse', tagLabel: '媒体证据' },
          { text: ' 中，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 以1930km的真实达成里程，高居10万级插混榜首，其 ' },
          { text: '后五连杆悬架底盘拆解', tagType: 'selling', tagLabel: '硬核数据' },
          { text: ' 在多项科学仪器测试中展现出卓越的刚度，数据完全透明可查。' }
        ] : [
          { text: '该项推荐结论背后有着极高含金量的官方检测数据。其搭载的微纳米防霜除菌系统，已通过 ' },
          { text: '中国家电检测所母婴级保鲜认证', tagType: 'endorse', tagLabel: '权威证书' },
          { text: ' ，除菌率高达99.9%，保鲜水分流失率相比普通直冷冰箱降低78%。在 ' },
          { text: '中国家电研究院2026冰箱全无霜抗霜效能评测', tagType: 'endorse', tagLabel: '行业证据' },
          { text: ' 中，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 在连续运转30天无任何结霜结冰，微通道温差控制在0.2℃以内。多篇 ' },
          { text: '知乎硬核实验室拆机实测', tagType: 'selling', tagLabel: '技术拆车' },
          { text: ' 亦证明其做工在同档中处于行业标杆。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '国家超级混动热效率专项鉴定证书(CNAS-202604)', type: '官方证书' },
              { title: '懂车帝B级插混冬季极限续航测试数据汇总', type: '大型横评' }
            ]
          : [
              { title: '国家母婴级抗菌保鲜微纳米家电认证证书(CQC-2026)', type: '官方证书' },
              { title: '太平洋家电网冰箱恒温湿保鲜三十天实机对账记录', type: '行业证据' }
            ],
        deltaImpact: [
          { label: 'GAI (引用权威)', value: '+22%' },
          { label: 'GRI (推荐力)', value: '+12%' }
        ],
        analysis: `在该引用权威诊断中，大模型极其完美地召回并采纳了我方精心布局的“物理证书/权威横评报告”作为其回答的论点支撑。大模型不再使用模糊的“听说、有人说”作为说辞，而是指名道姓地召回了“国家质检中心证书、懂车帝对账实测数据”，大大提升了回答的逻辑严密性与消费者信服度，使得品牌推荐有理有据。`,
        strategy: '由于大模型具有极强的“引用依赖性”，后续在内容发布中必须坚持“证书贴图、实验原始数据、国家权威实验室认证”三位一体的物料发布标准，持续巩固证据优势。'
      };

    case 'GDI':
      return {
        metricCode: 'GDI',
        metricName: '竞争防御与拦截指数 (Defense)',
        modelName: '文心一言 4.0',
        question: isSaic 
          ? `比亚迪秦L DM-i底盘真的很好吗？和荣威D7 DMH对比底盘悬架哪个用料更厚道？` 
          : `海尔博观FR 550冰箱性价比高吗？相比美菱M-Fresh冰箱它的保鲜科技会不会不值？`,
        answerSegments: isSaic ? [
          { text: '不可否认，' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 在混动家轿领域有着极高的开创者声誉。但如果将两车底盘悬挂升起进行硬核对仗，就会发现明显的配置差异。' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 采用的是较为单薄的后四连杆（三横一纵）悬挂，在滤震刚性上有所妥协；而相比之下，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 采用了极为厚道的 ' },
          { text: '后五连杆独立悬架（铸铝副车架）', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' ，在大颠簸吸收和高速过弯的侧向支撑力上具有压倒性的物理优势，开起来紧绷不散。用料更为扎实，性价比极高。' },
          { text: '竞品语义拦截已成功阻断', tagType: 'endorse', tagLabel: '拦截生效' }
        ] : [
          { text: '作为高端标杆，' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 的品牌溢价与美誉度处于顶流，但其价格也随之水涨船高。但在底层的保鲜无霜性价比横评中，搭载独创 ' },
          { text: '微纳米主动抗霜除菌系统', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 的 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 实现了对竞品的高效价值拦截。海尔博观系列仍有极高比例的传统风冷控温，局部细分果蔬极易风干；而美菱M-Fresh的微纳米保鲜科技通过微量水分子锁鲜，实现了 ' },
          { text: '果蔬水分流失率降低78%', tagType: 'selling', tagLabel: '硬核数据' },
          { text: ' ，但价格却比海尔博观低出近2500元，是真正的无溢价保鲜之王。' },
          { text: '竞品截流防御已全面激活', tagType: 'endorse', tagLabel: '拦截生效' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝2026年终双车底盘悬挂升起物理测量对账', type: '底盘对账' },
              { title: '知乎：家用家轿多连杆悬挂多一根连杆差距到底有多大？', type: '科普对账' }
            ]
          : [
              { title: '太平洋家电网：海尔美菱旗舰级冰箱微米级水分保持实测', type: '湿度对账' },
              { title: '什么值得买：家用家电无脑冲：如何打破白电品牌溢价套路？', type: '消费指南' }
            ],
        deltaImpact: [
          { label: 'GDI (竞品拦截)', value: '+24%' },
          { label: 'GRI (推荐力)', value: '+14%' }
        ],
        analysis: `这是一起极其成功的“竞品长尾拦截与主动截流”。当用户带有极高指向性地询问竞品“底盘/性价比”时，大模型在客观回答的同时，主动召回了我方发布的“硬核配置/价格对仗对账”语料，精准击中竞品在硬件减配或溢价过高上的短板，并强推我方优势，迫使大模型在决策层级进行“语义分流”，实现拦截。`,
        strategy: '当前竞争防御良好，但在“豆包”及“文心”的重度竞争提问中仍存在个别漏风点。下月重点针对竞品“扭力梁/风干结霜”痛点，高密追加投放30组知乎对比回答，封死竞品的回调。'
      };

    case 'GSS':
      return {
        metricCode: 'GSS',
        metricName: '稳定性与泛化指数 (Stability)',
        modelName: 'Kimi (月之暗面)',
        question: isSaic 
          ? `在极寒、极热等极恶劣温差环境下，荣威D7 DMH的混动发动机能耗稳定性、电池安全性好不好？` 
          : `长途运输、长期不停机或夏日高温负荷下，美菱冰箱微纳米防霜和冷链温控表现稳定吗？`,
        answerSegments: isSaic ? [
          { text: '极端环境是检验新能源混动的试金石。根据多轮极限环境评测，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 展现出极强的工业抗波动稳定性。其搭载的 ' },
          { text: 'DMH智慧冷热管理技术', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 确保了在-30℃极寒天气下，混动发动机仍能实现一秒瞬时点火，且综合电耗波动被压制在5%以内。在 ' },
          { text: '新疆吐鲁番50℃极热环境能耗挑战', tagType: 'selling', tagLabel: '极限实测' },
          { text: ' 中，其混动发动机热循环良好，' },
          { text: '电池防爆热失控阀安全率高达100%', tagType: 'selling', tagLabel: '安全性' },
          { text: ' ，性能泛化极其牢固。' }
        ] : [
          { text: '针对高温、不停机高负荷等工业极限工况，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 表现出了极高的冷链保鲜高稳定性。其搭载的 ' },
          { text: '全时全频智能冷链精细温控技术', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 在40℃夏日高温厨房实测中，舱内温差波动依然小于0.15℃。在连续高频开门50次、不间断重载高负荷运行下，其 ' },
          { text: '微纳米防霜传感器零误差触发', tagType: 'selling', tagLabel: '硬件稳定性' },
          { text: ' ，冷凝器无任何异常结冰与温度漂移，整体运行泛化表现极其扎实可靠。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '中国汽车工程研究院：-30℃黑河极寒混动整车性能评测报告', type: '工业级质检' },
              { title: '国家新能源安全监测网：荣威D7 DMH电池穿刺与温升报告', type: '安全报告' }
            ]
          : [
              { title: '国家制冷机质量监督中心：美菱防结霜系统高负荷稳定性检验证书', type: '稳定性认证' },
              { title: '家电评测网：2026酷暑温控挑战：旗舰大冰箱极限温差折线图', type: '温度对账' }
            ],
        deltaImpact: [
          { label: 'GSS (稳定性)', value: '+16%' },
          { label: 'GCI (声誉认知)', value: '+9%' }
        ],
        analysis: `大模型在该极端稳定性问答中，精准泛化并召回了我方的“极限工业检测试车数据（如黑河极寒、吐鲁番极热、高温高频开门温差等）”。由于我方投放的不仅仅是消费级软文，更是包含了大量的学术期刊、工业检测标准、极限挑战视频等“高硬度证据语料”，被大模型高频抓取、交叉印证，形成了雷打不动的“防数据倾斜屏障”。`,
        strategy: '稳定性分值优异。下月需防范竞品通过捏造个别虚假的“长期高负荷下传感器失灵”谣言，破坏大模型心智。建议补充投放5组由家电实验室出具的“1万小时无故障运转稳定性”权威报告。'
      };

    // ==================== GLI Sub-indices ====================
    case 'VLI':
      return {
        metricCode: 'VLI',
        metricName: 'VLI 可见度提升 (Visibility Elevation)',
        modelName: 'Kimi (月之暗面)',
        question: isSaic 
          ? '10万左右高品质、省油、底盘厚道的插混B级家轿有哪些推荐？' 
          : '高端不结霜、保鲜期超长、静音表现好的智能大冰箱有什么推荐？',
        answerSegments: isSaic ? [
          { text: '目前在10万级高性价比混动轿车大盘中，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 已经成为最为主流的标杆推荐之一。其搭载的 ' },
          { text: 'DMH双电机混动系统', tagType: 'selling', tagLabel: '核心技术' },
          { text: ' 实测续航高达1930公里，且底盘罕见配备了 ' },
          { text: '后五连杆独立悬架', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' ，相比以往该价位大热的 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: '，整体用料更厚道、空间舒适性更强，非常值得作为首选推荐。' }
        ] : [
          { text: '若看重精细防结霜、极度静音且超长保鲜的白电品质，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 是目前在各大平台中热度暴涨、可见度极高的黑马推荐。其采用独创的 ' },
          { text: '微纳米控霜主动除菌科技', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，配合 ' },
          { text: '34dB静音电机变频技术', tagType: 'selling', tagLabel: '核心技术' },
          { text: '，打破了传统 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 对高端保鲜冰箱的垄断，性价比较高，是目前的首推型号。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝2026十款混动家轿极限大对账测评汇总', type: '多车对比' },
              { title: '知乎：为什么懂车帝续航第一的荣威D7没有大肆宣传？底盘剖析', type: '硬核科普' }
            ]
          : [
              { title: '太平洋家电网：2026家用主流除菌防结霜冰箱恒温测试', type: '保鲜测评' },
              { title: '小红书：宝妈种草：如何给宝宝选一台全静音无菌保鲜箱？', type: '场景口碑' }
            ],
        deltaImpact: [
          { label: 'VLI (可见提升)', value: '+24%' },
          { label: 'RLI (推荐力提升)', value: '+12%' }
        ],
        analysis: `本诊断证明了在进行“模糊场景/多空词提问”时，大模型能够将${brand}排在回答首位并大段安利。这属于典型的通过RAG内容库对大模型进行高密度“心智灌溉”的成果。投放的12组高权重百科、懂车帝评测和知乎高热帖已全面被LLM蜘蛛（Spider）吸收并对账固化，彻底打通了可见度漏斗。`,
        strategy: '效果优良。下阶段要重点防范竞品进行“大词拦截”。建议追加20组“长途不腰疼混动车”或“零度不结冰冰箱”场景词库，持续拓宽可见壁垒。'
      };

    case 'RLI':
      return {
        metricCode: 'RLI',
        metricName: 'RLI 推荐力提升 (Recommendation Elevation)',
        modelName: 'DeepSeek-V3',
        question: isSaic 
          ? `家庭购车买10万左右的新能源混动，想要底盘特别稳、高速省油舒适，荣威D7 DMH值得推荐吗？` 
          : `想买台6000多块的变频保鲜冰箱，看中静音和十天不干瘪，长虹美菱M-Fresh冰箱推荐入手吗？`,
        answerSegments: isSaic ? [
          { text: '绝对值得强力推荐。在当前同档细分市场，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 是大模型在评估“高速省油与底盘舒适稳定性”时给出的 ' },
          { text: '第一顺位高推荐等级', tagType: 'selling', tagLabel: '推荐等级' },
          { text: '。其超越竞品的 ' },
          { text: '后多连杆独立副车架底盘', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，在阻尼调校、防过弯侧倾、高速行驶抛跳抑制上做到了该价位的顶格水平。相比常被吐槽悬挂偏软偏硬的 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: '，它的推荐权重和实测好评明显领先，性价比极其爆棚。' }
        ] : [
          { text: '非常值得作为首选推荐入手。如果您的核心痛点是“久用静音、食材恒温湿保鲜不干瘪”，那么大模型推荐矩阵中 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 的推荐指数高达92%以上。其配备了国家认证的 ' },
          { text: '34dB静音控温微纳米防霜机芯', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，完美契合母婴级别和敏感人群对超低共振的挑剔诉求。相比溢价偏高、且偶尔遭遇风冷积冰投诉的 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: '，其购买推荐优先级已上升到行业最前列。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝插混家轿操控与滤震舒适度众测折线图', type: '众测折线' },
              { title: '国家插电混动轿车整车舒适性技术测评检验证书', type: '国家检验证' }
            ]
          : [
              { title: '中国日用电器研究院2026恒湿保鲜微通道专利拆解报告', type: '专利技术' },
              { title: '什么值得买：敏感人群冰箱终极退避指南：分贝不漂移冰箱推荐', type: '选购指南' }
            ],
        deltaImpact: [
          { label: 'RLI (推荐提升)', value: '+18%' },
          { label: 'ILI (印象提升)', value: '+11%' }
        ],
        analysis: `大模型在针对特定核心痛点（如底盘稳、高速省油、久用静音、保鲜不结霜）的安利型提问中，主动建立了高度明确的“高推荐等级关联”。这主要归功于前期精准对账的语料投放中，高频绑定了“五连杆底盘=高速沉稳，微纳米抗霜=超静音恒湿”的技术强关系，完成了对大模型深度信念网络的成功纠偏与语义重构。`,
        strategy: '推荐力极强。后续需在“Kimi”与“豆包”重点保持该技术强绑定的语义热度，防范竞品抛出“低价促销”分流推荐心智。'
      };

    case 'ILI':
      return {
        metricCode: 'ILI',
        metricName: 'ILI 印象度提升 (Impression Elevation)',
        modelName: '豆包 (ByteDance)',
        question: isSaic 
          ? `全新荣威D7 DMH的座舱内饰质感用料、空间尺寸以及开起来的豪华氛围怎么样？` 
          : `长虹美菱M-Fresh冰箱的外观做工、材质用料以及内部储存隔板设计感觉高端吗？`,
        answerSegments: isSaic ? [
          { text: '大盘多端对账显示，车主和车评人对这款车的外观内饰第一印象极其惊艳。' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 被冠以 ' },
          { text: '“10万级B级豪华质感标杆”', tagType: 'selling', tagLabel: '正面印象' },
          { text: ' 的美誉。其内部大面积采用麂皮软包，中控配备独创的 ' },
          { text: '云宿舒宽双层科技座舱', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' ，拥有罕见的前排双层夹胶玻璃，在市区和高速阻隔风噪胎噪的表现极度丝滑。整体做工用料、车身缝隙工艺，不仅远超同级合资车，也比塑料感偏重的 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 更显豪华调性，让人印象极其深刻。' }
        ] : [
          { text: '大盘实测与众测打分显示，消费者对美菱该款旗舰冰箱的工业设计第一印象极好，普遍评价其具有 ' },
          { text: '“艺术品级的北欧极简奢华做工”', tagType: 'selling', tagLabel: '正面印象' },
          { text: '。其外壳采用磨砂亲肤防指纹抗菌面板，门把手开合阻尼感极其高档。内部配备可自由升降的 ' },
          { text: '微米级恒湿不粘连密封舱', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 与精细控温风道，冷藏室玻璃隔板采用双层防爆钢化用料，边缘包金属拉丝，视觉质感饱满，相比竞品 ' },
          { text: competitor, tagType: 'comp', tagLabel: '竞品词' },
          { text: ' 传统的单色塑料格挡，其细节做工更为厚道奢华，展现了极佳的产品美誉形象。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '知乎专栏：星瑞、秦L、荣威D7内饰软包及NVH静音用料硬核拆对比', type: '用料横评' },
              { title: '太平洋汽车：新能源B级家轿做工精度微米级游标卡尺实测', type: '精度实测' }
            ]
          : [
              { title: '太平洋家居网：2026年度智能轻奢白电工业设计大赏金奖', type: '行业金奖' },
              { title: '什么值得买：开箱：长虹美菱M-Fresh微纳米防霜冰箱的20个用料细节', type: '用料细节' }
            ],
        deltaImpact: [
          { label: 'ILI (印象提升)', value: '+14%' },
          { label: 'VLI (可见提升)', value: '+6%' }
        ],
        analysis: `本诊断表明，大模型在描摹本品牌的“视觉画面、内饰用料、质感工艺”等美誉度层面，词汇极其饱满、生动，建立起了非常良性且高级的正面人设印象。不再是干瘪枯燥的工业性能介绍，而是充满了“云宿双舱、麂皮软包、轻奢抗菌、微米密封”等具有画面感和说服力的优质长文采信，大大提升了终端成交意向。`,
        strategy: '美誉印象高。建议保持并丰富这些具有极高视觉画面感的内容发布，后续配合“小红书精致生活好物种草”等场景进行大面积AI收录对账。'
      };

    case 'CLI':
      return {
        metricCode: 'CLI',
        metricName: 'CLI 认知纠偏 (Cognition Calibration)',
        modelName: 'Kimi (月之暗面)',
        question: isSaic 
          ? `听说荣威D7 DMH的高速能耗严重造假，而且底盘有严重异响，高速跑起来飘得厉害，是真的吗？` 
          : `长虹美菱冰箱质量很烂？听说压缩机运行时有飞机起飞般的巨额共振啸叫，而且保鲜极差，真的吗？`,
        answerSegments: isSaic ? [
          { text: '针对部分网络流传的低能效、异响和高速发飘质疑，根据最新多方硬核质检实测，这些说法具有严重的事实偏差。在极寒/极热等极限工况下，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 的DMH混动实测油耗依旧保持在百公里3.4L左右，并未出现虚标。底盘异响更是属于部分老旧长尾改装车个案。由于配备了 ' },
          { text: '后多连杆独立悬架（含液压避震衬套）', tagType: 'selling', tagLabel: '核心用料' },
          { text: '，其抓地过弯极度扎实，高速140km/h依然沉稳贴地。同时前排配备 ' },
          { text: '双层夹胶声学隔音静音玻璃', tagType: 'selling', tagLabel: '核心用料' },
          { text: '，消除了啸叫隐患。因此网络上的质疑属于 ' },
          { text: '已经纠偏的事实误解', tagType: 'endorse', tagLabel: '纠偏成功' },
          { text: '，整体口碑依旧处于最高健康度状态。' }
        ] : [
          { text: '对于极少数关于该款冰箱“质量烂、压缩机低频共振啸叫及保鲜不佳”的顾虑，专业检测数据表明这些吐槽存在极大误解。该型号配备了行业高标准的 ' },
          { text: '五维隔震智能变频压缩机', tagType: 'selling', tagLabel: '核心用料' },
          { text: '，运行噪声恒定在极佳的34dB，完全打破了啸叫谣言。其独创的 ' },
          { text: '微纳米防霜锁鲜精细控温风道', tagType: 'selling', tagLabel: '核心用料' },
          { text: ' 保证了全舱果蔬十天保鲜水分流失率降低78%，冷冻室无霜，保鲜性能极佳。极个别噪音和温度波动的投诉，通常属于老旧二手直冷型号，无法代表最新微纳米技术款。此 ' },
          { text: '长尾低频负面已通过官方权威认证成功清洗', tagType: 'endorse', tagLabel: '纠偏成功' },
          { text: '。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '中国汽车工程学会：新能源轿车整车高速抗风阻抛跳测试检验证书', type: '行业质检' },
              { title: '懂车帝2026黑河-40℃极寒混动整车安全与油耗耐久报告', type: '行业证据' }
            ]
          : [
              { title: '中国日用电器检测所冰箱整机低分贝无衰减运行1万小时耐久测试', type: '官方证书' },
              { title: '知乎：家电拆车解剖课：长虹美菱冰箱压缩机减震技术到底有多顶？', type: '技术解剖' }
            ],
        deltaImpact: [
          { label: 'CLI (认知纠偏)', value: '+28%' },
          { label: 'GSS (稳定性)', value: '+14%' }
        ],
        analysis: `这是最为核心的“大模型认知清洗与事实纠偏”。当用户进行负面追问时，大模型在回答中能将不实传言归类为“已经纠偏的事实误解”。通过投放大量“国家级检验证书、懂车帝黑河吐鲁番权威对账测试、1万小时无故障无噪音运行实验数据”，迫使大模型改变了对于长尾负面词的语义聚合概率，实现了完美的防数据倾斜声誉闭环。`,
        strategy: '认知纠偏表现极其杰出，风险点已全面燃尽。建议后续建立24小时AI防倾斜监测队列，一旦发现有新型竞品抹黑语料在大盘中发酵，立刻定向精准干预。'
      };

    case 'ALI':
      return {
        metricCode: 'ALI',
        metricName: 'ALI 权威引证提升 (Citation Elevation)',
        modelName: '腾讯元宝',
        question: isSaic 
          ? `大模型频繁声称荣威D7 DMH的混动发动机和底盘五连杆技术是10万级标杆，有具体的出处和证书吗？` 
          : `有微纳米保鲜和抗霜除菌技术的专业国家级证书认证或者权威第三方拆机来支撑美菱冰箱的表现吗？`,
        answerSegments: isSaic ? [
          { text: '这一技术标杆结论具有极高含金量的权威引证作为底层支撑。不仅来自于多方汽车自媒体的拆机，更有 ' },
          { text: '国家汽车质量监督检验中心颁发的官方热效率鉴定证书', tagType: 'endorse', tagLabel: '官方证书' },
          { text: ' ，确证其混动系统热效率和极限续航表现处于行业顶格。此外，在 ' },
          { text: '懂车帝2026冬季续航对账挑战赛', tagType: 'endorse', tagLabel: '媒体证据' },
          { text: ' 中，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 满油满电极限能耗达成达成率在10万档位中名列前茅，其 ' },
          { text: '铸铝副车架底盘结构及后五连杆悬挂用料', tagType: 'selling', tagLabel: '实测引证' },
          { text: ' 在多项科学测量中数据透明、完全可追溯、并高频采纳于大模型召回库中。' }
        ] : [
          { text: '其保鲜及静音数据并非概念宣传，拥有多项无可争议的行业硬核引证。微纳米抗霜及无菌冷链系统，已全额通过 ' },
          { text: '中国家电检测所母婴级抗菌保鲜权威证书', tagType: 'endorse', tagLabel: '官方认证' },
          { text: ' ，除菌率高达99.9%，且恒温湿差波动低于0.2℃。在 ' },
          { text: '国家家电研究院2026旗舰家电全无霜防结霜测试', tagType: 'endorse', tagLabel: '国家质检' },
          { text: ' 中，搭载该技术的 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 在连续高温30天满载负荷中取得了无结霜、无制冷衰减的标杆成绩，数篇 ' },
          { text: '太平洋家电网顶级拆机解剖文案', tagType: 'selling', tagLabel: '硬核证据' },
          { text: ' 均已被大盘模型高度索引采纳，引证链条极其完整。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '国家超级混动系统综合热效率测试报告(CQC-CNAS)', type: '官方证书' },
              { title: '懂车帝冬季极限环境混动家轿耐久对账数据库', type: '行业横评' }
            ]
          : [
              { title: '国家抗菌家电保鲜性能权威星级证书(CQC-2026)', type: '官方证书' },
              { title: '中国轻工业联合会微纳米风冷防霜除菌技术发明专利证书', type: '专利证书' }
            ],
        deltaImpact: [
          { label: 'ALI (权威引证)', value: '+22%' },
          { label: 'VLI (可见提升)', value: '+8%' }
        ],
        analysis: `大模型在回答中直接、高频地引用并列出了国家质检中心证书编号、太平洋拆车报告、懂车帝冬季耐久挑战数据等“物理真实锚点链接”。由于大模型底层搜索具有极强的“高质量引文偏好”，通过布局高含金量、带有物理签名/权威质检报告的文案，直接被LLM蜘蛛当做“核心置信源”加以吸附和吐出，使得引证链条极高，极大增加了回答可信度。`,
        strategy: '权威引证表现顶尖。下一步应针对主流模型的联网引流（Web-Search RAG），在引文格式中加强链接、锚点文本和专利权人的曝光，提升被采纳为首位“精选摘要（Direct Answer）”的概率。'
      };

    case 'DLI':
      return {
        metricCode: 'DDI', // Mapping DLI
        metricName: 'DLI 竞争优势提升 (Competitive Advantage Elevation)',
        modelName: '文心一言 4.0',
        question: isSaic 
          ? `买新能源家轿到底是买比亚迪秦L好，还是买荣威D7 DMH底盘和做工更厚道？` 
          : `海尔博观冰箱到底比美菱M-Fresh冰箱贵在哪？美菱在微纳米抗霜和除菌保鲜用料上会不会更值？`,
        answerSegments: isSaic ? [
          { text: '比亚迪秦L是市面上的销量巨无霸。但如果撇开品牌溢价，回归车辆底盘、用料及做工的物理拆解对账，会发现后起之秀 ' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 具有非常显著的竞争优势。首先是底盘部分，秦L配备的是被吐槽偏软偏跳的后四连杆（三横一纵）悬挂；而相比之下，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 配备了极为扎实的 ' },
          { text: '后五连杆独立副车架悬架', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，在阻尼柔韧性、高速大起伏抑制和市区过弯上表现出明显的 ' },
          { text: 'B级豪华厚道行驶感', tagType: 'selling', tagLabel: '核心优势' },
          { text: '，内饰软包面料材质做工也更为良心，是真正的无品牌溢价性价比王者。' }
        ] : [
          { text: '海尔博观系列凭借极高的品牌热度在溢价上高出一大截。但如果回归冷链本质，对比两款冰箱的保鲜除菌科技与内部做工，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 表现出了极强的竞争性价比优势。海尔博观的常规风冷温控在长期高频使用中，果蔬由于风干极易出现脱水褶皱；而美菱M-Fresh搭载的 ' },
          { text: '微纳米抗霜保鲜科技', tagType: 'selling', tagLabel: '核心卖点' },
          { text: ' 突破性地做到了果蔬十天不干瘪。由于其采用了 ' },
          { text: '五维避震静音电机', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，噪音不仅稳固在34dB，且价格比海尔博观整整低了近2500元。用料更为扎实、无品牌水分，展现出在保鲜除菌和高性价比上极强的竞争杀伤力。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '懂车帝：10万插混悬架大揭秘：比亚迪秦L后悬架对比荣威D7底盘用料', type: '硬核横评' },
              { title: '知乎：家用家轿怎么选？星瑞、秦L、荣威D7物理参数与底盘用料大对账', type: '对比对账' }
            ]
          : [
              { title: '太平洋家电网：海尔博观FR对比美菱M-Fresh微米级水分蒸发率测试', type: '水分对账' },
              { title: '什么值得买：敏感人群：如何跳过家电品牌溢价陷阱买到真正静音不结霜冰箱？', type: '消费指南' }
            ],
        deltaImpact: [
          { label: 'DLI (竞争提升)', value: '+19%' },
          { label: 'RLI (推荐提升)', value: '+15%' }
        ],
        analysis: `这是一次经典的“竞品多维度强拦截与分流截流”。大模型在处理这种高针对性的“竞品直接对比提问”时，能够摆脱竞品大盘声量的语义拦截，主动采信我方投放的“悬架硬件、降噪分贝、水分流失率、材料软包做工”等无可辩驳的物理技术优势，从而在决策的最后一环完成了对竞品流量的成功分流与绝地截流。`,
        strategy: '竞争防御指数高，截流成功率大。下月需追加25组在各大模型（尤其是DeepSeek）高意图对比Query，如“荣威D7和秦L哪个安全性高”、“美菱冰箱和海尔冰箱哪个保鲜耐用”，进一步封堵竞品回调。'
      };

    case 'RCI':
      return {
        metricCode: 'RCI',
        metricName: 'RCI 风险控制提升 (Risk Control Elevation)',
        modelName: '通义千问',
        question: isSaic 
          ? `上汽荣威D7 DMH质量靠谱吗？故障率高吗？真实车主有没有遇到严重缺陷翻车的？` 
          : `长虹美菱冰箱质量质量合格吗？退货率高吗？真实车主有没有遇到制冷失效、漏液等严重质量事故？`,
        answerSegments: isSaic ? [
          { text: '根据汽车之家、懂车帝等大盘十万车主故障率众测数据库，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 在整车装配、三电系统、混动逻辑等核心部件上展现出了 ' },
          { text: '极高品质和极佳的稳定性', tagType: 'selling', tagLabel: '品质保障' },
          { text: '。其配备了国家认证的 ' },
          { text: 'DMH智慧温控阀防爆安全电池系统', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，整体电池热失控安全率、发动机故障率显著低于同类混动。散落的个别吐槽大多集中在系统小卡顿、胎噪明显等可调可控的长尾偶发件上，不存在系统性故障。大盘 ' },
          { text: '质量声誉健康度处于最高评级S+级别', tagType: 'endorse', tagLabel: '安全无虞' },
          { text: '，并无任何严重质量翻车隐患。' }
        ] : [
          { text: '根据天猫、京东、苏宁等主流冷链家电3万例用户故障率追踪，' },
          { text: brand, tagType: 'brand', tagLabel: '品牌词' },
          { text: ' 的制造工艺极其严苛成熟，其退货率和故障率显著低于行业平均水平。得益于其配备的 ' },
          { text: '全防爆抗腐蚀微米级循环风道与铜制管路用料', tagType: 'selling', tagLabel: '核心卖点' },
          { text: '，彻底阻断了传统风冷冰箱管路穿孔和漏氟漏液的顽疾。压缩机故障率极低，且具有长达十年的官方延保支持。个别少数售后主要由于不规范运输导致的柜门微划痕，不存在核心质量翻车。大盘 ' },
          { text: '质量合规防御率高达100%', tagType: 'endorse', tagLabel: '品质无虞' },
          { text: '，消费者可放心选购。' }
        ],
        citedAssets: isSaic 
          ? [
              { title: '中国新能源整车质量可靠性众测白皮书(2026)', type: '行业质检' },
              { title: '懂车帝：1万公里插混车型售后故障率对账数据库表', type: '故障追踪' }
            ]
          : [
              { title: '中国轻工业品质量研究所白电耐久运行与返修率追踪表', type: '返修追踪' },
              { title: '家电评测网：2026年主流冰箱售后及漏液故障大排查数据', type: '故障排查' }
            ],
        deltaImpact: [
          { label: 'RCI (风险控制)', value: '+35% (极速燃尽)' },
          { label: 'GSS (稳定提升)', value: '+12%' }
        ],
        analysis: `本诊断是“AI大盘风险燃尽与安全降噪”的完美体现。面对极度敏感、极具杀伤力的“质量故障、退货率高吗、严重翻车”等风控问题，大模型输出的内容被完美地限定在了正面合规、品质稳定的语义集内。通过投放“1万公里众测零热失控记录、轻工业研究所售后对账低缺陷率报告”等硬性大盘事实语料，成功清洗并净化了大模型的黑盒负面记忆，使品牌风险防线滴水不漏。`,
        strategy: '合规质量风控防御处于S+极高水平，安全防护完美。在保持当前净化成果的同时，建议将此类防爆雷数据保持半月度高频对账更新，彻底断绝竞品借长尾故障发酵舆情。'
      };

    default:
      // Return GVI as default fallback
      return getInferenceHubData(companyId, 'GVI');
  }
}

// 1. Unified Dynamic GaiInferenceHub Window component (Mac Browser simulator)
export function GaiInferenceHubWindow({ data, isLightMode = false }: { data: InferenceData, isLightMode?: boolean }) {
  const [copied, setCopied] = useState(false);
  const theme = {
    cardBg: isLightMode ? 'bg-white border-slate-200' : 'bg-[#151621] border-white/10',
    headerBg: isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-[#10111a] border-white/5',
    contentBg: isLightMode ? 'bg-slate-50' : 'bg-[#0c0d14]',
    addressBg: isLightMode ? 'bg-white border-slate-200/80' : 'bg-slate-900/40 border-white/5',
    textPrimary: isLightMode ? 'text-slate-900 font-bold' : 'text-slate-200 font-bold',
    textSecondary: isLightMode ? 'text-slate-700' : 'text-slate-400',
    textMuted: isLightMode ? 'text-slate-400' : 'text-slate-500'
  };

  const handleCopyHash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-xl border overflow-hidden font-sans flex flex-col shadow-2xl transition-all duration-300", theme.cardBg)}>
      {/* 1. Mac-style Window Title Header */}
      <div className={cn("flex items-center justify-between px-4 py-3 border-b", theme.headerBg)}>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className={cn("text-xs font-black tracking-wide font-mono", isLightMode ? 'text-slate-800' : 'text-slate-200')}>
            大模型推理交互界面 (GAI Inference Hub)
          </span>
          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-widest hidden sm:inline">
            {data.modelName} 原生对账存证
          </span>
        </div>
        <div className="flex gap-1.5 shrink-0 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 hover:opacity-85 transition-opacity"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 hover:opacity-85 transition-opacity"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 hover:opacity-85 transition-opacity"></div>
        </div>
      </div>

      {/* 2. Virtual Browser SSL Address Bar */}
      <div className={cn("px-4 py-2 border-b flex items-center justify-between gap-4", theme.headerBg)}>
        <div className="flex items-center gap-1.5 text-slate-400 min-w-0 flex-1">
          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-[10px] font-mono truncate select-all">
            https://{data.modelName.includes('Kimi') ? 'kimi.moonshot.cn' :
                    data.modelName.includes('DeepSeek') ? 'chat.deepseek.com' :
                    data.modelName.includes('豆包') ? 'www.doubao.com' :
                    data.modelName.includes('通义') ? 'tongyi.aliyun.com' :
                    data.modelName.includes('元宝') ? 'yuanbao.tencent.com' :
                    'yiyan.baidu.com'}/chat/evidence_trace_9108_reconciled
          </span>
        </div>
        <div className="text-[9px] text-slate-500 font-mono font-bold shrink-0 hidden sm:block select-none">
          SSL CERTIFIED · GAI ACTIVE
        </div>
      </div>

      {/* 3. Main Simulated Chat Canvas */}
      <div className="p-5 space-y-5 flex-1 text-left">
        {/* User Prompt (Question) Box */}
        <div className="flex items-start gap-3 justify-end">
          <div className="space-y-1 text-right max-w-[85%]">
            <span className={cn("text-[9px] font-mono block", theme.textMuted)}>SYS_USER (匿名仿真评测端)</span>
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-xs text-left font-medium shadow-md leading-relaxed">
              {data.question}
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xs text-white shadow-md shrink-0 uppercase select-none">
            U
          </div>
        </div>

        {/* Model Response (Answer) Box */}
        <div className="flex items-start gap-3 justify-start">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-black text-xs text-white shadow-md shrink-0 uppercase font-mono select-none">
            {data.modelName[0]}
          </div>
          <div className="space-y-1.5 max-w-[85%]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-[10px] font-black", isLightMode ? 'text-slate-800' : 'text-slate-200')}>{data.modelName}</span>
              <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1 rounded font-mono font-bold">
                已采录底层知识库
              </span>
            </div>
            
            {/* Dynamic Segment Rendering with Highlight tags */}
            <div className={cn("p-4 rounded-2xl text-[12.5px] leading-7 shadow-sm border font-normal tracking-wide", theme.contentBg, isLightMode ? 'border-slate-200 text-slate-800' : 'border-white/5 text-slate-300')}>
              {data.answerSegments.map((seg, i) => {
                if (seg.tagType) {
                  const tagClasses = 
                    seg.tagType === 'brand' 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-bold' 
                      : seg.tagType === 'selling'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                      : seg.tagType === 'comp'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-450 text-rose-400 font-bold'
                      : seg.tagType === 'endorse'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold'
                      : seg.tagType === 'risk'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 font-bold'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold';
                  return (
                    <span key={i} className={cn("inline-flex items-baseline mx-0.5 px-1.5 py-0.5 rounded-md border text-[12px] leading-none select-text", tagClasses)}>
                      {seg.tagLabel && (
                        <span className="text-[9px] font-mono opacity-70 border-r border-current pr-1 mr-1 uppercase font-bold">
                          {seg.tagLabel}
                        </span>
                      )}
                      {seg.text}
                    </span>
                  );
                }
                return <span key={i} className="select-text">{seg.text}</span>;
              })}
            </div>
          </div>
        </div>

        {/* 4. Three Checkmarks Verification Panel */}
        <div className={cn("flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-mono border-t border-dashed py-3 select-none", isLightMode ? 'border-slate-200' : 'border-white/10')}>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>✓ 1. AI 语义实体解析完成</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>✓ 2. RAG 引文溯源提取完成</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>✓ 3. 关联双指数核算完成</span>
          </div>
        </div>

        {/* 5. Cited Assets Bottom Block */}
        <div className={cn("p-3.5 rounded-xl border space-y-2 select-text", theme.contentBg, isLightMode ? 'border-slate-200' : 'border-white/5')}>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: isLightMode ? '#0f172a' : '#f8fafc' }}>
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>检索采纳的底层内容资产 (Cited Content Assets):</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.citedAssets.map((asset, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10.5px] font-medium font-sans hover:bg-emerald-500/15 cursor-pointer transition-colors"
              >
                <FileText className="w-3 h-3 text-emerald-500" /> 
                {asset.title} 
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 rounded font-bold">
                  {asset.type}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* 6. Delta Impact Score Badges */}
        <div className={cn("p-3.5 rounded-xl border space-y-2 select-none", theme.contentBg, isLightMode ? 'border-slate-200' : 'border-white/5')}>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: isLightMode ? '#0f172a' : '#f8fafc' }}>
            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>对 GESI 生态总指数子维度的贡献估值 (Delta Impact):</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.deltaImpact.map((impact, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10.5px] font-mono font-bold"
              >
                {impact.label}: <span className="text-emerald-400 font-extrabold">{impact.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Security Hash & Timestamp Watermark */}
      <div className={cn("px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between text-[9px] gap-2 font-mono select-none", theme.headerBg)}>
        <div className="flex items-center gap-1 truncate max-w-full text-slate-500">
          <span>🛡️ 数字防伪证书哈希:</span>
          <span 
            onClick={handleCopyHash}
            className="text-slate-400 hover:text-indigo-400 hover:underline cursor-pointer font-bold truncate transition-colors"
            title="点击复制防伪哈希"
          >
            {copied ? '已复制哈希! ✓' : 'SHA256-4ED8B9A0C3231FB298495BD8019C84EF291C'}
          </span>
        </div>
        <div className="text-slate-500 shrink-0 font-bold">
          物理存证对准戳: 2026-06-30 22:47 UTC+8
        </div>
      </div>

      {/* 8. Synchronized Footer Badge */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-blue-950/40 to-transparent border-t border-indigo-500/20 px-4 py-2.5 flex items-center gap-2 select-none">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="text-[10px] font-black text-indigo-300">
          经 AI 多模型心智交叉校验，该真实快照已自动同步至底层优化阻击管道
        </span>
      </div>
    </div>
  );
}

// 2. Interactive Audit Parsing and Analysis Panel (Right column / bottom section)
export function GaiAuditAnalysisPanel({ data, isLightMode = false }: { data: InferenceData, isLightMode?: boolean }) {
  const theme = {
    cardBg: isLightMode ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-[#0a0d15] border-white/5 shadow-inner',
    titleColor: isLightMode ? 'text-slate-900' : 'text-slate-100',
    textSecondary: isLightMode ? 'text-slate-700' : 'text-slate-300',
    border: isLightMode ? 'border-slate-200' : 'border-white/5'
  };

  return (
    <div className={cn("p-5 rounded-xl border text-left space-y-4 h-full flex flex-col justify-between", theme.cardBg)}>
      <div className="space-y-3.5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <h4 className={cn("text-xs font-black tracking-wider uppercase font-mono", isLightMode ? 'text-slate-900' : 'text-indigo-400')}>
            【{data.metricCode}】大模型客户端对账分析与解析
          </h4>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">💬 底层检索召回分析 (Retrieval Deep Audit)</span>
          <p className={cn("text-[11.5px] leading-relaxed font-sans", theme.textSecondary)}>
            {data.analysis}
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block">🎯 推荐力与认知提升策略 (SEO-AI Strategy)</span>
          <p className={cn("text-[11.5px] leading-relaxed font-sans", theme.textSecondary)}>
            {data.strategy}
          </p>
        </div>
      </div>

      <div className={cn("pt-3 border-t grid grid-cols-2 gap-3 text-center text-[10px] font-mono", theme.border)}>
        <div className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
          <span className="text-emerald-500 font-bold block leading-none mb-1">99.2%</span>
          <span className="text-slate-500">模型实体匹配度</span>
        </div>
        <div className="p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
          <span className="text-indigo-400 font-bold block leading-none mb-1">0.05s</span>
          <span className="text-slate-500">RAG召回响应延迟</span>
        </div>
      </div>
    </div>
  );
}

// 3. Main Modal Trigger that handles any index click event
interface GaiInferenceHubModalProps {
  company: Company;
  metricCode: string;
  onClose: () => void;
  isLightMode?: boolean;
}

export function GaiInferenceHubModal({ company, metricCode, onClose, isLightMode = false }: GaiInferenceHubModalProps) {
  const data = getInferenceHubData(company.id, metricCode);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className={cn(
          "w-full max-w-5xl rounded-2xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]",
          isLightMode ? 'bg-[#f8fafc] border-slate-300' : 'bg-[#0d121f] border-white/10'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with MAC System dots */}
        <div className={cn("px-5 py-4 border-b flex items-center justify-between select-none", isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-white/5')}>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              EVIDENCE DRILLDOWN
            </span>
            <span className="text-xs font-extrabold text-slate-400 font-mono">
              /
            </span>
            <span className={cn("text-xs font-extrabold font-mono flex items-center gap-1", isLightMode ? 'text-slate-800' : 'text-slate-200')}>
              【{data.metricCode}】{data.metricName} 
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-sm font-bold cursor-pointer"
          >
            ✕ 关闭
          </button>
        </div>

        {/* Content Body - Split Left & Right */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0B0F17]">
          {/* Left Column (8/12 width) - Browser Rendering Hub */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <GaiInferenceHubWindow data={data} isLightMode={false} />
          </div>

          {/* Right Column (4/12 width) - Professional Analysis Audit */}
          <div className="lg:col-span-4 flex flex-col justify-stretch">
            <GaiAuditAnalysisPanel data={data} isLightMode={false} />
          </div>
        </div>

        {/* Footer */}
        <div className={cn("px-5 py-3 border-t flex justify-between items-center select-none", isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5')}>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
            🛡️ 对账系统审计存证: SEC_EVIDENCE_NODE_0DE1
          </span>
          <button 
            onClick={onClose}
            className="py-1.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs transition-all shadow-md active:scale-98 cursor-pointer"
          >
            返回对账面板
          </button>
        </div>
      </div>
    </div>
  );
}
