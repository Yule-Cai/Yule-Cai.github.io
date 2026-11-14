// Content is kept separate from presentation for easy review.
// Facts and paper links are adapted from the owner's existing GitHub Pages portfolio.
window.YULE_DATA = {
  profile: {
    name: 'Yule Cai', zhName: '蔡雨乐',
    role: 'Undergraduate Researcher · Embodied AI & Robotics',
    roleZh: '本科研究者 · 具身智能与机器人',
    institution: 'Universiti Utara Malaysia',
    email: 'caiyule0911@163.com',
    scholar: 'https://scholar.google.com/citations?hl=en&user=W8lwxUYAAAAJ',
    github: 'https://github.com/Yule-Cai',
    portrait: 'assets/profile-900.webp',
    portraitSources: ['assets/profile-900.webp','profile.png'],
    orcid: 'https://orcid.org/0009-0007-2692-0031',
    lines: ['Robot navigation & reinforcement learning', 'LLM-guided planning and task recovery', 'Embodied intelligence under uncertainty'],
    linesZh: ['机器人导航与强化学习', '大语言模型辅助规划与任务恢复', '不确定环境中的具身智能']
  },
  about: {
    en: [
      'I am an Information Technology undergraduate at Universiti Utara Malaysia. My research focuses on how robots plan, navigate, and recover when instructions or the environment change.',
      'I work at the intersection of reinforcement learning, language-model reasoning, and autonomous systems, with particular interest in practical evaluation and resource-constrained deployment. I also contribute to journal peer review.'
    ],
    zh: [
      '我目前就读于马来西亚北方大学信息技术本科。研究主要关注机器人在任务指令变化、部分可观测与环境扰动条件下的规划、导航和恢复能力。',
      '我重点探索强化学习、语言模型推理与自主系统的结合，关注可复现的实验评估和资源受限环境中的部署，也参与学术期刊同行评审。'
    ]
  },
  focus: [
    {id:'nav', key:'01', title:'Autonomous Navigation', zh:'自主导航', desc:'Robust route planning, partial observability, and multi-robot coordination.', descZh:'鲁棒路径规划、部分可观测与多机器人协作。', shape:'path'},
    {id:'rl', key:'02', title:'Reinforcement Learning', zh:'强化学习', desc:'Policy learning, task recovery, and agent adaptation.', descZh:'策略学习、任务恢复与智能体适应。', shape:'policy'},
    {id:'llm', key:'03', title:'Language-Grounded Robotics', zh:'语言驱动的机器人', desc:'Connecting natural-language goals to verifiable robot behavior.', descZh:'把自然语言任务目标连接到可验证的机器人行为。', shape:'graph'}
  ],
  news: [
    {date:'2026.06', en:'Developed an LLM Task Recovery prototype to study language-guided navigation recovery.', zh:'开展 LLM Task Recovery 原型研究，探索导航智能体的语言引导恢复。', url:'', type:'Research'},
    {date:'2026.05', en:'Our first-author survey on causal inference and introspective robotics was accepted by Nonlinear Dynamics.', zh:'关于因果推断与机器人内省决策的一作综述被 Nonlinear Dynamics 接收。', url:'https://doi.org/10.1007/s11071-026-12695-2', type:'Journal'},
    {date:'2026.05', en:'Our first-author work on edge-intelligent RL–LLM navigation was accepted by JKSUCIS.', zh:'关于边缘智能 RL–LLM 机器人导航的一作研究被 JKSUCIS 接收。', url:'https://doi.org/10.1007/s44443-026-00870-9', type:'Journal'},
    {date:'2026.04', en:'KA-IHO, our co-authored research on kinematic-aware mobile robot path planning, appeared in Sensors.', zh:'参与的运动学约束机器人路径规划研究 KA-IHO 发表于 Sensors。', url:'https://doi.org/10.3390/s26082416', type:'Journal'}
  ],
  publications: [
    {id:'causal', featured:true, year:2026, venue:'Nonlinear Dynamics', kind:'Journal', title:'Beyond correlation: a survey on causal inference for dynamics-aware perception and introspective decision-making in robotics', authors:'Y. Cai, X. Zhang, S. Liu, J. Lou, C. Yuan', role:'First author', doi:'https://doi.org/10.1007/s11071-026-12695-2', tags:['Causal inference','Robot perception','Introspection'], cover:'https://media.springernature.com/m312/springer-static/image/art%3A10.1007%2Fs11071-026-12695-2/MediaObjects/11071_2026_12695_Fig1_HTML.png',figure:'Fig. 1',figureSource:'Publisher figure · Nonlinear Dynamics', figureOriginal:true,figureLink:'https://doi.org/10.1007/s11071-026-12695-2', abstract:'A survey examining how causal reasoning can support dynamics-aware robotic perception and introspective decision-making beyond statistical correlation.', takeaway:'From correlations to causal reasoning in robotics.', method:['Survey causal inference methods for robotic perception','Connect dynamics awareness with decision-making','Discuss introspection and future research needs'], bib:'@article{cai2026beyond,\n  title={Beyond correlation: a survey on causal inference for dynamics-aware perception and introspective decision-making in robotics},\n  author={Cai, Yule and Zhang, Xiang and Liu, Shengrui and Lou, J. and Yuan, Chunhong},\n  journal={Nonlinear Dynamics},\n  year={2026},\n  doi={10.1007/s11071-026-12695-2}\n}'},
    {id:'edge',featured:true, year:2026,venue:'Journal of King Saud University – Computer and Information Sciences',kind:'Journal',title:'Toward edge-intelligent consumer robots: a decoupled RL–LLM architecture for robust navigation under partial observability', authors:'Y. Cai, W. Tan, Y. Wang, X. Du, T. Sun, Q. Ai, S. Bourouis, S. Alalmaei, W. Shao, C. Yuan', role:'First author', doi:'https://doi.org/10.1007/s44443-026-00870-9',tags:['RL–LLM','Edge robotics','Navigation'],cover:'https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs44443-026-00870-9/MediaObjects/44443_2026_870_Fig2_HTML.png',figure:'Fig. 2',figureSource:'Publisher figure · JKSUCIS',figureOriginal:true,figureLink:'https://doi.org/10.1007/s44443-026-00870-9',abstract:'A decoupled robot navigation architecture combining reinforcement-learning control with language-model guidance to handle partially observable operating conditions.',takeaway:'Separating fast control from high-level reasoning.',method:['Use reinforcement learning for low-level navigation','Use language-based reasoning for task-level adaptation','Evaluate under partial observability and deployment constraints'],bib:'@article{cai2026edge,\n  title={Toward edge-intelligent consumer robots: a decoupled RL--LLM architecture for robust navigation under partial observability},\n  author={Cai, Yule and Tan, Wang and Wang, Yichen and others},\n  journal={Journal of King Saud University - Computer and Information Sciences},\n  year={2026},\n  doi={10.1007/s44443-026-00870-9}\n}'},
    {id:'iho', year:2026, venue:'Sensors', kind:'Journal', title:'KA-IHO: A Kinematic-Aware Improved Hippo Optimization Algorithm for Collision-Free Mobile Robot Path Planning in Complex Grid Environments', authors:'C. Yuan, Y. Cai, H. Que, Y. Pei, X. Zhang, J. Xie, Q. Zhang, L. Mu, F. Qiao',role:'Co-first author',doi:'https://doi.org/10.3390/s26082416',tags:['Path planning','Optimization'],cover:'https://mdpi-res.com/sensors/sensors-26-02416/article_deploy/html/images/sensors-26-02416-g001-550.jpg',localCover:'paper-iho.webp',backupCover:'paper-pending-iho.svg',figure:'Fig. 1',figureSource:'Publisher figure · Sensors (MDPI)',figureOriginal:true,figureLink:'https://www.mdpi.com/1424-8220/26/8/2416',abstract:'A motion-planning optimization study combining heuristic search with kinematic awareness in complex grid environments.',takeaway:'Accounting for kinematic feasibility in path planning.',method:['Incorporate robot motion constraints','Optimize collision-free paths','Evaluate in grid-world environments'],bib:'@article{yuan2026kaiho,\n  title={KA-IHO: A Kinematic-Aware Improved Hippo Optimization Algorithm for Collision-Free Mobile Robot Path Planning in Complex Grid Environments},\n  author={Yuan, Chunhong and Cai, Yule and others},\n  journal={Sensors},\n  year={2026},\n  doi={10.3390/s26082416}\n}'},
    {id:'shap',year:2026,venue:'International Journal of Machine Learning and Cybernetics',kind:'Journal',title:'Application of SHAP-Based Explainable Machine Learning in Remaining Useful Life Prediction for Aircraft Engine Systems',authors:'C. Yuan, Y. Cai, Z. Zhang',role:'Co-first author',doi:'https://doi.org/10.1007/s13042-026-03246-7',tags:['Explainable AI','Predictive maintenance'],cover:'https://media.springernature.com/m312/springer-static/image/art%3A10.1007%2Fs13042-026-03246-7/MediaObjects/13042_2026_3246_Fig5_HTML.png',backupCover:'paper-pending-shap.svg',figure:'Fig. 5',figureSource:'Original SHAP summary plot · Int. J. Mach. Learn. Cybern.',figureOriginal:true,figureLink:'https://doi.org/10.1007/s13042-026-03246-7',abstract:'An explainable machine-learning approach for estimating remaining useful life in aircraft engine systems.',takeaway:'Making prognostic predictions more interpretable.',method:['Predict remaining useful life','Use SHAP explanations','Interpret contributing factors'],bib:'@article{yuan2026shap,\n  title={Application of SHAP-Based Explainable Machine Learning in Remaining Useful Life Prediction for Aircraft Engine Systems},\n  author={Yuan, Chunhong and Cai, Yule and Zhang, Zixin},\n  journal={International Journal of Machine Learning and Cybernetics},\n  year={2026},\n  doi={10.1007/s13042-026-03246-7}\n}'},
  ],
  researchArc: [
    {num:'01',state:{en:'PUBLISHED WORK',zh:'已发表研究'},status:'verified',title:{en:'Plan with constraints',zh:'面向运动约束规划'},detail:{en:'Find collision-free paths that remain feasible for a moving robot.',zh:'不仅寻找无碰撞路径，也要满足机器人实际运动约束。'},link:'papers/iho.html',linkLabel:{en:'KA-IHO · Sensors ↗',zh:'KA-IHO · Sensors ↗'}},
    {num:'02',state:{en:'PUBLISHED WORK',zh:'已发表研究'},status:'verified',title:{en:'Notice when progress stops',zh:'识别导航进度停滞'},detail:{en:'Use execution feedback to request higher-level guidance when local navigation fails to make progress.',zh:'在局部导航停滞时，通过执行反馈触发高层规划调整。'},link:'papers/edge.html',linkLabel:{en:'RL–LLM navigation · JKSUCIS ↗',zh:'RL–LLM 导航 · JKSUCIS ↗'}},
    {num:'03',state:{en:'IN EXPLORATION',zh:'探索阶段'},status:'exploring',title:{en:'Recover together',zh:'协作中恢复任务'},detail:{en:'Investigate when robot teams should wait, yield or reconsider a shared plan.',zh:'研究多机器人何时等待、让行或重新考虑共同计划。'},link:'research.html',linkLabel:{en:'Research questions ↗',zh:'研究问题 ↗'}}
  ],
  ongoing: [
    {num:'01',title:{en:'Rule-aware execution',zh:'规则感知执行'},text:{en:'How should a robot respond when task constraints change during execution?',zh:'当任务约束在执行中变化时，机器人应如何响应？'}},
    {num:'02',title:{en:'Multi-robot negotiation',zh:'多机器人协商'},text:{en:'When should one robot wait or yield, and how should the team decide?',zh:'何时应等待或让行？团队如何做出决定？'}},
    {num:'03',title:{en:'Communication-aware learning',zh:'通信感知学习'},text:{en:'What should teammates communicate to coordinate under limited information?',zh:'信息受限时，队友应该交换什么内容来协作？'}}
  ],
  researchExperience: [
    {period:'2026',role:{en:'Research internship · SenseLab',zh:'科研实习 · SenseLab'},org:{en:'Department of Electronic Engineering, Tsinghua University',zh:'清华大学电子工程系 · SenseLab'},desc:{en:'Contributed to the KA-IHO mobile-robot path-planning research, with published work in Sensors (2026). Internship dates and additional responsibilities are not listed.',zh:'参与 KA-IHO 移动机器人路径规划研究，相关成果发表于 Sensors（2026）。不列出尚未核实的实习起止时间或额外职责。'},link:'https://doi.org/10.3390/s26082416'}
  ],
  projects: [
    {name:'LLM Task Recovery',category:'RL × LLM',description:'Language-guided runtime recovery for navigation agents facing blocked paths, invalid goals, and unexpected changes.', zh:'语言模型辅助的任务运行时恢复，处理路径阻塞、目标失效与环境突变。',url:'', cover:'project-recovery.svg',public:false,fallbackCover:'project-recovery.svg',evidence:'',evidenceEn:'Concept illustration; research files are not public',evidenceZh:'概念示意图；研究仓库暂未公开',evidenceTag:'Concept only',n:'01'},
    {name:'Decoupled Dual-Brain Navigation',category:'ROBOT NAVIGATION',description:'Research prototype separating high-level task decisions from low-level control in an autonomous navigation pipeline.',zh:'将高层任务决策与底层运动控制解耦的自主导航研究原型。',url:'https://github.com/Yule-Cai/Decoupled-Dual-Brain-Nav',cover:'project-navigation.webp',remoteCover:'https://raw.githubusercontent.com/Yule-Cai/Decoupled-Dual-Brain-Nav/main/docs/fig4_benchmark_panel.png',fallbackCover:'project-navigation.svg',evidence:'https://github.com/Yule-Cai/Decoupled-Dual-Brain-Nav/blob/main/docs/fig4_benchmark_panel.png',evidenceEn:'Navigation benchmark comparison',evidenceZh:'导航基准比较',evidenceTag:'Benchmarks',n:'02'},
    {name:'Kinematic-Aware IHO',category:'PATH PLANNING',description:'Kinematic-aware optimization for feasible, collision-free robot trajectories in complex grid environments.',zh:'面向复杂栅格环境的运动学约束路径优化。',url:'https://github.com/Yule-Cai/Kinematic-Aware-IHO',cover:'project-optimization.webp',remoteCover:'https://raw.githubusercontent.com/Yule-Cai/Kinematic-Aware-IHO/main/results/planned_paths/Path_Map4.png',fallbackCover:'project-optimization.svg',evidence:'https://github.com/Yule-Cai/Kinematic-Aware-IHO/blob/main/results/planned_paths/Path_Map4.png',evidenceEn:'Planned path on Map 4',evidenceZh:'地图 4 的规划路径',evidenceTag:'Planned route',n:'03'},
    {name:'Shadow Hand ASL',category:'ROBOT MANIPULATION',description:'A computer-vision-to-robot pipeline for recognizing and reproducing ASL gestures using the Shadow Dexterous Hand.',zh:'基于 Shadow Dexterous Hand 的视觉识别与手势复现系统。',url:'',cover:'project-hand.svg',public:false,fallbackCover:'project-hand.svg',evidence:'',evidenceEn:'Concept illustration; research files are not public',evidenceZh:'概念示意图；研究仓库暂未公开',evidenceTag:'Concept only',n:'04'}
  ],
  summerSchools: [
    {
      period: 'Aug 4–8, 2025', periodZh: '2025 年 8 月 4–8 日',
      name: {en:'Data Science Summer School 2025', zh:'2025 数据科学暑期学校'},
      org: {en:'Hertie School Data Science Lab', zh:'Hertie School Data Science Lab'},
      desc: {en:'Participated in the online Data Science Summer School, directed by Prof. Simon Munzert.', zh:'参加由 Simon Munzert 教授指导的线上数据科学暑期学校。'},
      link: 'https://www.hertie-school.org/en/sustainability/news/detail/content/data-democracy-from-zero-to-ai-agent-in-five-days'
    }
  ],
  service: [{title:'Peer reviewer',org:'Springer Nature journals',period:'2026 — Present', en:'Selected reviewing venues: Scientific Reports, Discover Artificial Intelligence, Artificial Intelligence Review, Discover Robotics, and The Journal of Supercomputing. Individual confidential manuscript details are not published.',zh:'审稿期刊包括 Scientific Reports、Discover Artificial Intelligence、Artificial Intelligence Review、Discover Robotics 与 The Journal of Supercomputing。未公开受审稿件的保密细节。'}],
  education:[{degree:'B.Sc. in Information Technology',degreeZh:'信息技术理学学士（在读）',school:'Universiti Utara Malaysia',period:'2025 — Present'}]
};