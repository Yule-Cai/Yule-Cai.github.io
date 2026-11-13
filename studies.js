// Curated reading notes for the published works. The numbers are taken from the linked publications.
// Explanations are concise editorial paraphrases, not quotations of journal abstracts.
window.YULE_STUDIES = {
  shap: {
    question: {
      en:'Can an aircraft-engine remaining-useful-life (RUL) estimate be accurate enough for maintenance planning while also revealing which sensor signals drive it?',
      zh:'飞机发动机的剩余使用寿命（RUL）预测，能否在提供可用预测结果的同时，解释模型究竟依赖哪些传感器信号？'
    },
    context: {
      en:'Using NASA C-MAPSS turbofan degradation data, this study benchmarks eight machine-learning algorithms and then explains the strongest model with SHAP. The work emphasizes both prediction error and the interpretation of individual features.',
      zh:'研究基于 NASA C-MAPSS 涡扇发动机退化数据，对八种机器学习算法进行对比，再利用 SHAP 解释表现最好的模型。评价既关注预测误差，也关注各特征对预测的贡献。'
    },
    metrics:[
      {value:'36.68',label:{en:'RMSE · LightGBM',zh:'均方根误差 · LightGBM'},detail:{en:'RUL prediction error',zh:'剩余寿命预测误差'}},
      {value:'26.53',label:{en:'MAE · LightGBM',zh:'平均绝对误差 · LightGBM'},detail:{en:'Across the evaluation set',zh:'测试集评估'}},
      {value:'0.713',label:{en:'R² · LightGBM',zh:'决定系数 R² · LightGBM'},detail:{en:'Best of eight models compared',zh:'八种算法中的最佳模型'}}
    ],
    stages:[
      {name:{en:'Prepare the sensor data',zh:'处理传感器数据'},desc:{en:'Clean and transform operational cycles and sensor measurements from the C-MAPSS engine runs.',zh:'对 C-MAPSS 的运行周期与传感器测量值进行清洗和特征处理。'}},
      {name:{en:'Compare predictive models',zh:'比较预测模型'},desc:{en:'Evaluate eight algorithms on RUL regression; LightGBM offers the strongest reported overall metrics.',zh:'对八种算法进行 RUL 回归评估，LightGBM 在报告的综合指标中表现最好。'}},
      {name:{en:'Explain the fitted predictor',zh:'解释已训练模型'},desc:{en:'Analyze global importance, SHAP contributions and feature interactions rather than presenting a prediction alone.',zh:'利用特征重要性、SHAP 贡献和交互关系进行解释，而不只报告预测值。'}}
    ],
    findings:[
      {name:{en:'Key predictive signals',zh:'主要预测信号'},detail:{en:'Operational cycles, sensor 11 and sensor 15 have the largest modeled contributions to the RUL estimates.',zh:'运行周期、传感器 11 和传感器 15 对预测结果的贡献最突出。'}},
      {name:{en:'Nonlinear behavior',zh:'非线性特征关系'},detail:{en:'SHAP dependence analyses reveal nonlinear effects and interactions, including changes around certain normalized sensor values.',zh:'SHAP 依赖图揭示非线性影响与特征交互，部分归一化传感器值附近存在明显变化。'}},
      {name:{en:'A usable interpretation layer',zh:'可读的解释层'},detail:{en:'The results identify which measurements deserve closer attention in a predictive-maintenance dashboard.',zh:'分析指出了预测性维护看板中值得重点关注的测量项。'}}
    ],
    limitations:{en:'These explanations describe associations learned by LightGBM; SHAP does not establish physical causation. Evaluation uses benchmark engine data rather than a live maintenance deployment.',zh:'SHAP 解释的是 LightGBM 学到的统计关联，并不能证明物理因果关系。实验基于基准发动机数据，而非线上维护系统部署。'},
    figures:[
      {number:'Fig. 5',label:{en:'SHAP feature contributions',zh:'SHAP 特征贡献图'},url:'https://media.springernature.com/m312/springer-static/image/art%3A10.1007%2Fs13042-026-03246-7/MediaObjects/13042_2026_3246_Fig5_HTML.png',caption:{en:'Original SHAP summary plot from the published article. Color indicates feature value and horizontal position indicates contribution to predicted RUL.',zh:'正式论文中的 SHAP 汇总图：颜色表示特征取值，横轴反映其对 RUL 预测的贡献。'}},
      {number:'Fig. 2',label:{en:'Predicted vs. actual RUL',zh:'预测值与真实值'},url:'https://media.springernature.com/m312/springer-static/image/art%3A10.1007%2Fs13042-026-03246-7/MediaObjects/13042_2026_3246_Fig2_HTML.png',caption:{en:'Published visual comparison of the LightGBM RUL predictions and the corresponding reference values.',zh:'正式论文中 LightGBM 的 RUL 预测与参考真值对比。'}},
      {number:'Fig. 6',label:{en:'SHAP dependence',zh:'SHAP 依赖关系'},url:'https://media.springernature.com/m312/springer-static/image/art%3A10.1007%2Fs13042-026-03246-7/MediaObjects/13042_2026_3246_Fig6_HTML.png',caption:{en:'Original dependence plot for sensor 11, showing how SHAP effects vary with sensor readings and operating cycles.',zh:'传感器 11 的原始 SHAP 依赖图，反映贡献如何随传感器数值及运行周期而变化。'}}
    ]
  },
  edge: {
    question:{en:'How can a low-power robot escape a non-convex obstacle trap without constantly running an expensive language model?',zh:'低功耗机器人如何在不持续调用语言模型的情况下，逃离非凸障碍形成的局部陷阱？'},
    context:{en:'A stateless PPO policy handles frequent motion decisions while a local language model is called only when a physical-displacement detector finds that the agent is stuck. Spatial observations are serialized as compact ASCII topology.',zh:'系统使用无状态 PPO 策略执行高频动作，仅当物理位移检测器判断机器人停滞时调用本地语言模型，并将空间观察编码为紧凑的 ASCII 拓扑表示。'},
    metrics:[
      {value:'95%',label:{en:'Average success rate',zh:'平均成功率'},detail:{en:'Five simulation levels',zh:'五个仿真难度级别'}},
      {value:'72%',label:{en:'Pure PPO baseline',zh:'纯 PPO 对照'},detail:{en:'Same evaluation suite',zh:'相同评测设置'}},
      {value:'90%',label:{en:'Edge test success',zh:'端侧测试成功率'},detail:{en:'Hardest map · Orange Pi',zh:'最难地图 · Orange Pi'}}
    ],
    stages:[
      {name:{en:'Reactive control',zh:'反应式控制'},desc:{en:'PPO handles the ordinary navigation loop without the overhead of invoking an LLM at every step.',zh:'日常导航由 PPO 完成，不需要每一步都调用 LLM。'}},
      {name:{en:'Detect actual stagnation',zh:'检测真实停滞'},desc:{en:'A sliding-window displacement test recognizes deadlock even when a policy remains overconfident.',zh:'滑动窗口位移检测识别僵局，即便策略仍然高度自信。'}},
      {name:{en:'Reason, verify, recover',zh:'推理、核验、恢复'},desc:{en:'An LLM proposes a topological subgoal, while lower-level checks reject or recover from unsafe suggestions.',zh:'LLM 提出拓扑子目标，底层校验与回退机制处理不合理建议。'}}
    ],
    findings:[
      {name:{en:'Deadlock recovery matters',zh:'解除死锁是关键'},detail:{en:'The RL–LLM combination achieves 95% average success, compared with 72% for pure PPO over five levels.',zh:'五个难度级别平均成功率由纯 PPO 的 72% 提升至 RL–LLM 的 95%。'}},
      {name:{en:'Cognitive calls are gated',zh:'按需调用推理层'},detail:{en:'The robot invokes high-level reasoning on physically detected failure rather than using it continuously.',zh:'仅在出现真实的物理停滞时调用高层推理，不做常态化调用。'}},
      {name:{en:'On-device check',zh:'端侧验证'},detail:{en:'An Orange Pi test with a 1.2B model reports 90% success on the hardest map and 37.82 seconds per LLM call.',zh:'使用 1.2B 模型在 Orange Pi 上进行端侧测试，最难地图成功率 90%，单次 LLM 调用平均约 37.82 秒。'}}
    ],
    limitations:{en:'The central evaluation isolates a 2-D grid-level cognitive planning problem. The 37.82-second edge inference latency remains a substantial obstacle for time-critical replanning.',zh:'主要实验聚焦二维栅格中的认知规划层。端侧推理单次约 37.82 秒的延迟，仍限制实时重规划的应用。'},
    figures:[]
  },
  causal: {
    question:{en:'How can a robot distinguish the causes of disturbances rather than merely fitting correlations in sensor and control traces?',zh:'机器人如何识别扰动背后的原因，而不只是拟合传感器与控制轨迹中的相关性？'},
    context:{en:'This survey organizes research on causal representation learning, interventional discovery, counterfactual reasoning and causal-aware feedback control into a unified perspective for embodied systems.',zh:'这篇综述围绕因果表征学习、干预式因果发现、反事实推理与因果感知反馈控制，建立面向具身系统的统一研究视角。'},
    metrics:[
      {value:'4',label:{en:'Research pillars',zh:'研究支柱'},detail:{en:'Unified causal taxonomy',zh:'统一因果研究分类'}},
      {value:'C-MDP',label:{en:'Decision framing',zh:'决策建模'},detail:{en:'Causal Markov processes',zh:'因果马尔可夫过程'}},
      {value:'OOD',label:{en:'Robustness lens',zh:'鲁棒性视角'},detail:{en:'Physical distribution shifts',zh:'物理分布变化'}}
    ],
    stages:[
      {name:{en:'Causal representation',zh:'因果表征'},desc:{en:'Recover invariant mechanisms from high-dimensional streams instead of relying only on correlated features.',zh:'从高维传感器数据中挖掘相对不变的机制，而不只依赖相关特征。'}},
      {name:{en:'Active discovery',zh:'主动发现'},desc:{en:'Study interventions and causal hypothesis testing under limited observation.',zh:'研究在不完全观察条件下通过干预和假设检验发现因果关系。'}},
      {name:{en:'Counterfactual recovery',zh:'反事实恢复'},desc:{en:'Connect abduction, hypothetical action and predicted consequences to recovery decisions.',zh:'将溯因、假设行动与后果预测连接到机器人恢复决策。'}},
      {name:{en:'Causal-aware control',zh:'因果感知控制'},desc:{en:'Consider robust closed-loop control and introspection in embodied policies.',zh:'讨论具身策略中的鲁棒闭环控制与内省能力。'}}
    ],
    findings:[
      {name:{en:'A taxonomy, not a new benchmark',zh:'以综述框架为核心'},detail:{en:'The contribution is a structured synthesis of prior methods, their assumptions, and where they may fail.',zh:'主要贡献是系统梳理既有方法、适用假设与失效条件，而非引入新的实验基准。'}},
      {name:{en:'Physical confounding',zh:'物理混杂因素'},detail:{en:'Shifts in dynamics can invalidate the shortcut relationships exploited by purely correlational policies.',zh:'动力学变化可能让仅依赖统计相关性的策略失去可靠性。'}},
      {name:{en:'From theory to robots',zh:'从理论到机器人'},detail:{en:'The synthesis links causal modeling to quadrupedal motion and dexterous manipulation case studies.',zh:'讨论将因果建模扩展到四足机器人运动与灵巧操作的案例。'}}
    ],
    limitations:{en:'As a review, its taxonomy and research directions are interpretive synthesis; they should not be read as a new empirically validated causal robot controller.',zh:'作为综述，研究分类和未来方向属于文献综合，不应被当作已经实验验证的新机器人因果控制器。'},
    figures:[]
  },
  iho: {
    question:{en:'Can a swarm optimizer produce short, collision-free paths that a differential-drive robot can actually follow?',zh:'群智能优化器能否规划出短且无碰撞、并能被差速移动机器人真实执行的路径？'},
    context:{en:'KA-IHO combines feasible-solution initialization, a hierarchical elite–scout search, stagnation recovery and late-stage path ironing. Tests span five grid maps and hardware tracking.',zh:'KA-IHO 结合可行路径初始化、分层精英—侦察搜索、停滞恢复和后期路径平滑，并在五张栅格地图和实际硬件上验证。'},
    metrics:[
      {value:'4 / 5',label:{en:'Maps with 100% success',zh:'达到 100% 成功率的地图'},detail:{en:'Static grid benchmarks',zh:'静态栅格评测'}},
      {value:'±4 cm',label:{en:'Tracking error',zh:'轨迹跟踪误差'},detail:{en:'Differential-drive experiments',zh:'差速机器人硬件实验'}},
      {value:'20',label:{en:'Runs per map',zh:'每张地图独立运行次数'},detail:{en:'Compared with six baselines',zh:'与六种基线算法比较'}}
    ],
    stages:[
      {name:{en:'Feasible initialization',zh:'可行初始化'},desc:{en:'An elite safety pool improves the odds of finding usable candidate paths in dense obstacle fields.',zh:'通过精英安全池，提升复杂障碍环境下生成可行候选路径的概率。'}},
      {name:{en:'Explore without stagnating',zh:'搜索与防停滞'},desc:{en:'Elite–scout updates, population restarts and radial micro-search help escape difficult local configurations.',zh:'通过精英—侦察更新、种群重启与径向微搜索避免陷入局部最优。'}},
      {name:{en:'Smooth for execution',zh:'面向执行的平滑'},desc:{en:'A late-stage Laplacian line-of-sight operator removes redundant bends and checks collision safety.',zh:'在后期利用 Laplacian 视线平滑算子消除冗余拐点并检查碰撞安全。'}}
    ],
    findings:[
      {name:{en:'Strong benchmark feasibility',zh:'较高的可行率'},detail:{en:'Full success is achieved on four of five reported maps; the hardest constrained configuration remains more difficult.',zh:'在五张基准地图中的四张达到完全成功，第 3 张极端狭窄地图仍有失败情况。'}},
      {name:{en:'Hardware verification',zh:'硬件验证'},detail:{en:'Differential-drive trials report trajectory-tracking errors within approximately ±4 cm.',zh:'差速机器人闭环试验报告的轨迹跟踪误差控制在约 ±4 cm。'}},
      {name:{en:'Smoothness with constraints',zh:'考虑运动约束的平滑'},detail:{en:'The objective and ironing stage favor feasible trajectories over merely short geometric curves.',zh:'目标函数与后期平滑阶段优先考虑真实可执行轨迹，而非仅追求几何最短路。'}}
    ],
    limitations:{en:'The 3,000-candidate initialization adds considerable computation. Fixed waypoint count and static-map testing limit straightforward use in larger, rapidly changing scenes.',zh:'需评估约 3,000 条初始候选路径，计算开销较大。固定航点数和静态地图实验也限制其直接用于更大、更动态的场景。'},
    figures:[]
  }
};