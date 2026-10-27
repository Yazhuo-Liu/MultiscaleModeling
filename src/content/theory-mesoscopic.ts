import type { TheorySet } from "./theory";

export const mesoscopicTheory: TheorySet = {
  dd: {
    zh: {
      objectives: [
        "用 Burgers 矢量说明位错携带的滑移量。",
        "从受力平衡推导钉扎位错的弓出形状。",
        "区分单条位错运动与材料整体塑性。",
      ],
      sections: [
        {
          title: "为什么晶体可以逐步滑动？",
          paragraphs: [
            "想象推开一整张地毯和推动地毯上的一道褶皱：后者可以逐步完成位移。晶体中的位错也提供了一种局部推进滑移的机制。刃型位错可直观地看作额外半原子面的边缘，但并非所有位错都有这种形状；螺型和混合型位错同样重要。",
            "围绕理想晶体走一个闭合的晶格回路，再沿同样的步数绕过位错，回路会出现闭合差。Burgers 矢量 b 描述这个差，也刻画位错扫过后留下的晶格滑移。它是晶体学信息，不是位错当前的运动速度或线段长度。",
          ],
          formula: "γ̇ = ρₘ b v̄",
          symbols: [
            {
              symbol: "γ̇",
              meaning: "简单单滑移条件下的塑性剪切应变率，单位 s⁻¹。",
            },
            { symbol: "ρₘ", meaning: "可动位错线总长度除以体积，单位 m⁻²。" },
            { symbol: "b", meaning: "Burgers 矢量的模，单位 m。" },
            { symbol: "v̄", meaning: "可动位错的平均滑移速度，单位 m/s。" },
          ],
        },
        {
          title: "应力推动，线张力拉回",
          paragraphs: [
            "位错在应力场中的单位长度受力由 Peach–Koehler 关系给出。对合适取向的单一滑移系，剪应力 τ 产生的驱动力大小为 τb。弯曲位错同时增加线长，因此线张力 Γ 倾向于拉直位错；曲率越大，回复力通常越大。",
            "在低惯性、阻力控制的近似下，可令速度与合力成正比。对于两端固定、只允许沿 y 方向移动且斜率较小的位错，曲率约为 ∂²y/∂x²，得到一条受恒定载荷的弦方程。这里既忽略非局部弹性相互作用，也不包含位错相交、攀移和成核。",
          ],
          formula: "f_PK = (σ · b) × ξ\nB ∂y/∂t = τb + Γ ∂²y/∂x²",
          symbols: [
            { symbol: "σ", meaning: "应力张量，单位 Pa。" },
            { symbol: "ξ", meaning: "沿位错线的单位切向量。" },
            {
              symbol: "Γ",
              meaning: "线张力，单位 N；可理解为单位线长的能量。",
            },
            {
              symbol: "B",
              meaning:
                "拖曳系数，单位 Pa·s；使 Bv 与单位长度的力具有相同单位。",
            },
          ],
        },
        {
          title: "从边界条件得到弓出曲线",
          paragraphs: [
            "当位错停止移动，时间导数变为零。对 Γy″=−τb 积分两次，并使用 y(0)=y(L)=0，就得到抛物线形的平衡弓出。最大位移出现在中点，随应力线性增加，随钉扎间距的平方增加；这解释了障碍间距为何强烈影响位错运动。",
            "真实的 Frank–Read 源可以在足够应力下继续弯曲并产生位错环。常数线张力的圆弧估计给出临界应力 τc≈2Γ/(bL)，但此时小斜率假设已经失效。本章的抛物线模型适合研究临界前的回复与弓出，不能从持续增大的挠度推断位错环已经形成。",
          ],
          formula: "y(x) = τb x(L−x)/(2Γ)\ny_max = τbL²/(8Γ)",
          symbols: [
            { symbol: "L", meaning: "两钉扎点之间的距离。" },
            {
              symbol: "y_max",
              meaning: "位错中点的最大静态挠度；公式要求小斜率。",
            },
            {
              symbol: "τc",
              meaning:
                "完整圆弧线张力估计中的临界应力，不是此小斜率模型的分岔点。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一段 100 nm 位错会弯出多少？",
        given: "取 L=100 nm、b=0.25 nm、Γ=1 nN，施加 τ=10 MPa，位错两端固定。",
        steps: [
          "统一为 SI 单位：L=10⁻⁷ m，b=2.5×10⁻¹⁰ m，Γ=10⁻⁹ N，τ=10⁷ Pa。",
          "单位长度驱动力 τb=2.5×10⁻³ N/m。代入 y_max=τbL²/(8Γ)。",
          "得到 y_max=3.125×10⁻⁹ m。最大端点斜率为 τbL/(2Γ)=0.125，支持小斜率近似。",
        ],
        result:
          "最大弓出约 3.13 nm。若其他参数不变而钉扎间距加倍，预测挠度增加为四倍；仍需重新检查小斜率条件。",
      },
      pitfalls: [
        "把位错运动等同于每个原子同时平移：位错描述的是局部滑移的传播。",
        "认为线张力模型已经包含长程弹性相互作用、交滑移和位错结：这些都需要额外物理。",
        "将约化时间直接读成秒：必须给定长度、力和拖曳系数的标度才能恢复物理时间。",
      ],
      question: {
        prompt: "保持应力和钉扎距离不变，将线张力加倍，平衡弓出量怎样变化？",
        answer:
          "由 y_max∝1/Γ 可知减半。更大的线张力使同样曲率产生更强回复力，因此在更小弯曲下就能平衡驱动力。",
      },
      diagram: {
        title: "被障碍钉住的位错如何弓出",
        caption:
          "水平线表示初始位错，弯曲线表示受剪应力后的位错。两端是固定障碍，驱动力推动中段，线张力抵抗曲率。示意图不按原子尺度绘制。",
        labels: [
          "钉扎点",
          "初始位错",
          "受力后的位错",
          "驱动力 τb",
          "钉扎间距 L",
          "中点挠度 y_max",
        ],
      },
    },
    en: {
      objectives: [
        "Explain the slip carried by a dislocation using its Burgers vector.",
        "Derive the bowing of a pinned line from force balance.",
        "Distinguish motion of one dislocation from bulk plastic deformation.",
      ],
      sections: [
        {
          title: "Why can a crystal slip one region at a time?",
          paragraphs: [
            "Compare moving an entire carpet with pushing a wrinkle through it: the wrinkle transports displacement progressively. A dislocation provides a related mechanism for localized slip in a crystal. An edge dislocation can be pictured as the edge of an extra half-plane of atoms, but screw and mixed dislocations are equally important and require different pictures.",
            "Draw a closed lattice circuit in a perfect crystal, then follow the same sequence of steps around a dislocation. The resulting closure mismatch defines a Burgers vector b. This vector records crystallographic slip information; it is neither the current velocity of the dislocation nor the length of a line segment.",
          ],
          formula: "γ̇ = ρₘ b v̄",
          symbols: [
            {
              symbol: "γ̇",
              meaning:
                "Plastic shear strain rate for a simple single-slip description, in s⁻¹.",
            },
            {
              symbol: "ρₘ",
              meaning:
                "Mobile dislocation line length per unit volume, in m⁻².",
            },
            { symbol: "b", meaning: "Magnitude of the Burgers vector, in m." },
            {
              symbol: "v̄",
              meaning:
                "Mean glide velocity of the mobile dislocations, in m/s.",
            },
          ],
        },
        {
          title: "Stress drives the line; tension pulls it back",
          paragraphs: [
            "The Peach–Koehler relation gives the force per unit length on a dislocation in a stress field. For a suitably oriented single slip system, a resolved shear stress τ supplies a driving force of magnitude τb. Bending also increases line length, so a line tension Γ tends to straighten the dislocation: stronger curvature produces a stronger restoring contribution.",
            "When inertia is negligible and drag controls the motion, velocity is proportional to the net force. For a line pinned at both ends, moving only in the y direction and having small slopes, its curvature is approximately ∂²y/∂x². This gives the equation of a driven, damped string. Nonlocal elastic interactions, junctions, climb, and nucleation are absent from this approximation.",
          ],
          formula: "f_PK = (σ · b) × ξ\nB ∂y/∂t = τb + Γ ∂²y/∂x²",
          symbols: [
            { symbol: "σ", meaning: "Stress tensor, in Pa." },
            {
              symbol: "ξ",
              meaning: "Unit tangent along the dislocation line.",
            },
            {
              symbol: "Γ",
              meaning:
                "Line tension, in N, equivalent to energy per unit length.",
            },
            {
              symbol: "B",
              meaning:
                "Drag coefficient, in Pa·s; Bv has the units of force per unit length.",
            },
          ],
        },
        {
          title: "Boundary conditions determine the bowed shape",
          paragraphs: [
            "At equilibrium the time derivative vanishes. Integrating Γy″=−τb twice and imposing y(0)=y(L)=0 gives a parabolic profile. The largest displacement occurs at the midpoint. It is proportional to stress and to the square of the pinning distance, showing why obstacle spacing strongly affects dislocation motion.",
            "A real Frank–Read source can keep bowing under sufficient stress and emit a dislocation loop. A circular-arc construction with constant line tension estimates a critical stress τc≈2Γ/(bL), but that geometry lies beyond the small-slope assumption. The parabolic model describes bowing and recovery before this regime; a large computed deflection does not mean that a loop has been created.",
          ],
          formula: "y(x) = τb x(L−x)/(2Γ)\ny_max = τbL²/(8Γ)",
          symbols: [
            {
              symbol: "L",
              meaning: "Distance between the two pinning obstacles.",
            },
            {
              symbol: "y_max",
              meaning:
                "Maximum static displacement at the midpoint; the formula assumes small slopes.",
            },
            {
              symbol: "τc",
              meaning:
                "Critical stress estimated by the full circular-arc line-tension picture, not a bifurcation in this small-slope model.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How far does a 100 nm dislocation segment bow?",
        given:
          "Let L=100 nm, b=0.25 nm, Γ=1 nN, and τ=10 MPa, with both ends pinned.",
        steps: [
          "Convert to SI: L=10⁻⁷ m, b=2.5×10⁻¹⁰ m, Γ=10⁻⁹ N, and τ=10⁷ Pa.",
          "The driving force per unit length is τb=2.5×10⁻³ N/m. Substitute it into y_max=τbL²/(8Γ).",
          "The result is y_max=3.125×10⁻⁹ m. The largest endpoint slope is τbL/(2Γ)=0.125, consistent with a small-slope approximation.",
        ],
        result:
          "The midpoint bows by about 3.13 nm. Doubling the pinning distance at fixed stress and tension predicts four times the displacement; the small-slope condition must then be checked again.",
      },
      pitfalls: [
        "Treating slip as a simultaneous displacement of every atom: a dislocation propagates localized slip.",
        "Assuming a line-tension model already includes long-range elastic interactions, cross-slip, and junction formation: these require additional physics.",
        "Reading reduced time directly as seconds: physical time requires length, force, and drag scales.",
      ],
      question: {
        prompt:
          "At fixed stress and pinning distance, what happens to the equilibrium bowing when line tension doubles?",
        answer:
          "It halves because y_max∝1/Γ. Greater line tension creates a stronger restoring force for the same curvature, so less bowing is needed to balance the drive.",
      },
      diagram: {
        title: "Bowing a dislocation between two obstacles",
        caption:
          "The straight line is the initial dislocation and the curved line its stressed configuration. The ends are fixed obstacles; the drive pushes the middle while line tension opposes curvature. The drawing is schematic, not atomically to scale.",
        labels: [
          "Pinning point",
          "Initial line",
          "Bowed line",
          "Drive τb",
          "Pinning distance L",
          "Midpoint displacement y_max",
        ],
      },
    },
  },
  kmc: {
    zh: {
      objectives: [
        "把热激活能垒转换成具有单位的事件速率。",
        "解释为什么事件选择和时间推进要分别抽样。",
        "理解随机游走、扩散系数与多轨迹平均的关系。",
      ],
      sections: [
        {
          title: "跨过能垒，而不是追踪每次振动",
          paragraphs: [
            "原子在稳定位置附近振动很多次后，才可能获得足够的热涨落跨过迁移能垒。若真正关心的是空位扩散，逐个解析这些振动会把大量计算用于等待。动力学蒙特卡洛把稳定构型看成状态，把构型间的稀有跃迁看成事件。",
            "在状态内能够迅速达到局部平衡、跃迁近似无记忆的前提下，可用一个速率描述每个事件。常见 Arrhenius 形式把尝试频率与跨越能垒的 Boltzmann 因子相乘。温度升高或能垒降低都会指数式加快跃迁，但速率参数必须来自理论、实验或更小尺度的计算。",
          ],
          formula: "rᵢ = νᵢ exp[−Eᵢ/(k_B T)]",
          symbols: [
            { symbol: "rᵢ", meaning: "事件 i 的发生速率，单位 s⁻¹。" },
            { symbol: "νᵢ", meaning: "尝试频率或有效速率前因子，单位 s⁻¹。" },
            { symbol: "Eᵢ", meaning: "相对于当前状态的迁移能垒；本例用 eV。" },
            {
              symbol: "k_B",
              meaning: "Boltzmann 常数，采用 eV 时为 8.61733×10⁻⁵ eV/K。",
            },
            { symbol: "T", meaning: "绝对温度，单位 K。" },
          ],
        },
        {
          title: "两次抽样：哪个事件，等多久？",
          paragraphs: [
            "若当前有多个可能事件，总离开速率为 R=Σrᵢ。系统等待时间的生存概率满足 S(t)=exp(−Rt)，对均匀随机数求逆就得到指数分布的时间增量。等待时间不是固定步长，也不是简单给每一次跳跃加上同样的时间。",
            "再用另一个独立随机数按 rᵢ/R 选择事件：累积速率越宽的区间，被选中的概率越大。执行事件后，构型可能改变，因此相关事件与速率也要重新计算。四个完全等价邻居的空位模型才允许始终等概率选择四个方向。",
          ],
          formula: "R = Σᵢ rᵢ；P(i) = rᵢ/R\nΔt = −ln(u)/R，0 < u < 1",
          symbols: [
            { symbol: "R", meaning: "当前所有可发生事件的总速率，单位 s⁻¹。" },
            { symbol: "u", meaning: "用于抽取等待时间的均匀随机数。" },
            { symbol: "Δt", meaning: "本次事件发生前经过的物理时间。" },
          ],
        },
        {
          title: "从跳跃统计得到扩散",
          paragraphs: [
            "对二维正方晶格的无偏随机游走，若每个方向的速率都为 r、步长为 a，则总跳跃速率是 4r。独立跳跃给出 ⟨|Δx|²⟩=4Dt，同时 D=ra²。这里的 r 是单方向速率；若用总速率 R，则应写成 D=Ra²/4。",
            "一条轨迹的位移平方会忽大忽小，并不是平滑的扩散曲线。要估计扩散系数，需要多个独立轨迹或合适的时间平均，并使用未被周期边界折回的位置。若存在势能差，正反速率应与所需平衡分布相容；遗漏低能垒通道会直接扭曲物理时钟。",
          ],
          formula: "⟨|Δx|²⟩ = 2dDt；二维四邻居模型：D = ra²",
          symbols: [
            { symbol: "d", meaning: "空间维数；本例为 2。" },
            { symbol: "a", meaning: "每次跳跃的距离。" },
            {
              symbol: "D",
              meaning: "扩散系数，若距离用 m、时间用 s，则单位为 m²/s。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一次空位跳跃要等多少纳秒？",
        given:
          "四个等价方向，ν=10¹² s⁻¹、E=0.5 eV、T=600 K，晶格步长 a=0.25 nm。",
        steps: [
          "热能 k_BT≈0.05170 eV，因此单方向速率 r≈10¹² exp(−0.5/0.05170)=6.31×10⁷ s⁻¹。",
          "总速率 R=4r≈2.525×10⁸ s⁻¹，平均等待时间 1/R≈3.96 ns。",
          "若此次抽到 u=0.5，则 Δt=−ln(0.5)/R≈2.75 ns；这一次的等待时间不必等于均值。",
          "扩散系数 D=ra²≈3.95×10⁻¹² m²/s；距离单位需要从 nm 转为 m 后平方。",
        ],
        result:
          "相同模型既给出随机事件序列，也给出由速率标定的物理时间；它不是任意给 Monte Carlo 步数贴上秒的标签。",
      },
      pitfalls: [
        "把单方向速率和总速率混用，会在二维四邻居模型中造成四倍的时间误差。",
        "用单条轨迹的某一次位移平方直接估算可靠扩散系数；涨落和采样长度不可忽略。",
        "认为提高温度一定改变等价方向的跳跃概率；本例中四个方向仍等概率，只是时钟变快。",
      ],
      question: {
        prompt:
          "如果所有事件速率同时乘以 10，事件选择概率与平均等待时间分别怎样变化？",
        answer:
          "概率 rᵢ/R 不变，因此在相同随机数下事件顺序不变；平均等待时间 1/R 缩短为原来的十分之一。",
      },
      diagram: {
        title: "事件速率同时决定选择与时钟",
        caption:
          "累积速率区间用于选择事件，指数等待时间用于推进时钟。这两次独立抽样共同定义连续时间跳跃过程。",
        labels: [
          "可能事件",
          "累计速率",
          "按速率选择",
          "当前时刻",
          "下一事件",
          "随机等待 Δt",
        ],
      },
    },
    en: {
      objectives: [
        "Convert a thermal activation barrier into an event rate with physical units.",
        "Explain why event selection and time advancement use separate random draws.",
        "Connect random walks, diffusivity, and averages over many trajectories.",
      ],
      sections: [
        {
          title: "Cross barriers instead of resolving every vibration",
          paragraphs: [
            "An atom usually vibrates many times around a stable position before a thermal fluctuation carries it across a migration barrier. If vacancy diffusion is the quantity of interest, explicitly resolving every vibration spends most of the computation on waiting. Kinetic Monte Carlo treats stable configurations as states and rare transitions between them as events.",
            "When a state reaches local equilibrium rapidly and escape is approximately memoryless, each event can be assigned a rate. The common Arrhenius form multiplies an attempt frequency by the Boltzmann factor for crossing a barrier. Higher temperature or a lower barrier accelerates events exponentially, but the rates must be supplied by theory, experiments, or calculations at a smaller scale.",
          ],
          formula: "rᵢ = νᵢ exp[−Eᵢ/(k_B T)]",
          symbols: [
            { symbol: "rᵢ", meaning: "Rate of event i, in s⁻¹." },
            {
              symbol: "νᵢ",
              meaning: "Attempt frequency or effective rate prefactor, in s⁻¹.",
            },
            {
              symbol: "Eᵢ",
              meaning:
                "Migration barrier measured from the current state; expressed here in eV.",
            },
            {
              symbol: "k_B",
              meaning:
                "Boltzmann constant, 8.61733×10⁻⁵ eV/K when energies are in eV.",
            },
            { symbol: "T", meaning: "Absolute temperature, in K." },
          ],
        },
        {
          title: "Two draws: which event, and how long to wait?",
          paragraphs: [
            "For several available events, the total escape rate is R=Σrᵢ. The probability of remaining in the state for at least time t is S(t)=exp(−Rt). Inverting this exponential distribution gives a random waiting time. It is neither a fixed integration step nor the same increment attached to every jump.",
            "A second, independent random number selects an event with probability rᵢ/R. An event occupying a wider interval in the cumulative rate distribution is more likely to occur. After the event, the configuration may change, so affected events and rates must be updated. Only the special vacancy model with four equivalent neighbors allows the four directions to remain equally likely at every step.",
          ],
          formula: "R = Σᵢ rᵢ; P(i) = rᵢ/R\nΔt = −ln(u)/R, 0 < u < 1",
          symbols: [
            {
              symbol: "R",
              meaning:
                "Sum of all rates available in the current state, in s⁻¹.",
            },
            {
              symbol: "u",
              meaning: "Uniform random number used to sample the waiting time.",
            },
            {
              symbol: "Δt",
              meaning:
                "Physical time elapsed before the selected event occurs.",
            },
          ],
        },
        {
          title: "From jump statistics to diffusion",
          paragraphs: [
            "For an unbiased random walk on a square lattice, let a be the jump distance and r the rate in each of four directions. The total jump rate is 4r. Independent jumps give ⟨|Δx|²⟩=4Dt with D=ra². Here r is the rate per direction; if the total rate R is used instead, the correct relation is D=Ra²/4.",
            "The squared displacement of a single path fluctuates rather than tracing a smooth diffusion curve. Estimating diffusivity requires an ensemble of independent paths or an appropriate time average, using positions that are not folded back by periodic boundaries. If states differ in energy, forward and reverse rates must be compatible with the intended equilibrium distribution. Missing a low-barrier pathway directly distorts the physical clock.",
          ],
          formula: "⟨|Δx|²⟩ = 2dDt; four-neighbor 2D model: D = ra²",
          symbols: [
            { symbol: "d", meaning: "Spatial dimension; d=2 in this example." },
            { symbol: "a", meaning: "Distance traveled in one lattice jump." },
            {
              symbol: "D",
              meaning:
                "Diffusion coefficient, in m²/s when distances are in m and time in s.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How many nanoseconds until a vacancy jumps?",
        given:
          "Take four equivalent directions, ν=10¹² s⁻¹, E=0.5 eV, T=600 K, and a lattice spacing a=0.25 nm.",
        steps: [
          "The thermal energy is k_BT≈0.05170 eV, so the rate in one direction is r≈10¹² exp(−0.5/0.05170)=6.31×10⁷ s⁻¹.",
          "The total rate is R=4r≈2.525×10⁸ s⁻¹. Its reciprocal gives a mean waiting time of about 3.96 ns.",
          "For a particular random draw u=0.5, Δt=−ln(0.5)/R≈2.75 ns. An individual waiting time need not equal the mean.",
          "The diffusion coefficient is D=ra²≈3.95×10⁻¹² m²/s. Convert nm to m before squaring the jump length.",
        ],
        result:
          "The same model supplies both an event sequence and a physical clock calibrated by rates. This is fundamentally different from assigning an arbitrary duration to equilibrium Monte Carlo steps.",
      },
      pitfalls: [
        "Confusing a per-direction rate with the total rate introduces a factor-of-four error in this four-neighbor model.",
        "Estimating a reliable diffusivity from one squared-displacement observation ignores fluctuations and sampling length.",
        "Assuming higher temperature changes the probabilities of equivalent directions: they remain equally likely here; the clock simply advances faster.",
      ],
      question: {
        prompt:
          "If all event rates are multiplied by 10, how do event probabilities and mean waiting time change?",
        answer:
          "The ratios rᵢ/R are unchanged, so the same random numbers select the same sequence of events. The mean waiting time 1/R becomes ten times shorter.",
      },
      diagram: {
        title: "Rates determine both the event and its clock",
        caption:
          "A cumulative rate interval selects the event; an exponential waiting time advances the clock. The two independent draws define a continuous-time jump process.",
        labels: [
          "Available events",
          "Cumulative rate",
          "Rate-weighted selection",
          "Current time",
          "Next event",
          "Random wait Δt",
        ],
      },
    },
  },
  "phase-field": {
    zh: {
      objectives: [
        "用连续序参量表示相和有限厚度界面。",
        "从自由能的变分导出 Allen–Cahn 方程。",
        "判断一个物理量是否应当守恒，再选择演化方程。",
      ],
      sections: [
        {
          title: "用一个场替代锋利的边界",
          paragraphs: [
            "若直接追踪每一条相界面，界面的合并、断裂和复杂形状都会增加几何处理难度。相场方法让一个连续变量 φ 在空间中变化：φ≈−1 和 φ≈+1 表示两个稳定状态，中间的连续过渡表示界面。φ 可以表示结构或取向的有序程度，不一定等于化学成分。",
            "自由能需要同时表达两件事：材料偏好稳定相，而界面本身有代价。双井局部能 f(φ) 使 ±1 成为能量低谷；梯度能惩罚过于陡峭的变化。二者竞争产生有限厚度界面，而不是随意把边界涂模糊。",
          ],
          formula: "F[φ] = ∫ [W(φ²−1)²/4 + κ|∇φ|²/2] dV",
          symbols: [
            { symbol: "φ", meaning: "无量纲序参量，用于区分两个状态。" },
            {
              symbol: "W",
              meaning: "双井势的能量密度尺度，决定偏离稳定相的代价。",
            },
            {
              symbol: "κ",
              meaning: "梯度能系数；与 W 一起决定界面厚度及能量。",
            },
            {
              symbol: "F",
              meaning: "总自由能；具体单位随空间维度及标度选择而定。",
            },
          ],
        },
        {
          title: "自由能怎样决定演化方向？",
          paragraphs: [
            "普通函数沿负梯度下降，相场则沿自由能泛函的负变分导数演化。对局部能求导得到 W(φ³−φ)；对梯度能进行分部积分，在周期或适当无通量边界下得到 −κ∇²φ。它们合在一起给出改变场值的热力学驱动力 μ。",
            "对不守恒的结构序参量，Allen–Cahn 动力学令 ∂φ/∂t=−Mμ。当 M>0 且没有外部做功时，连续方程满足 dF/dt=−∫Mμ²dV≤0，因此自由能不会上升。显式数值时间步仍需足够小；一个不稳定离散格式不会因为方程本身耗散就自动正确。",
          ],
          formula: "μ = δF/δφ = W(φ³−φ) − κ∇²φ\n∂φ/∂t = −Mμ",
          symbols: [
            {
              symbol: "μ",
              meaning:
                "自由能对序参量的变分导数；此处不必解释为某种原子的化学势。",
            },
            {
              symbol: "M",
              meaning: "正的迁移率，连接热力学驱动力与演化速率。",
            },
            {
              symbol: "∇²φ",
              meaning: "场的 Laplace 算子，描述邻域对局部值的影响。",
            },
          ],
        },
        {
          title: "界面宽度、粗化与守恒的区别",
          paragraphs: [
            "对平直、静止的一维界面，令 μ=0，可以得到 φ(x)=tanh[x/√(2κ/W)]。因此宽度参数 ℓ=√(2κ/W)：提高 κ 会让界面更平缓，提高 W 会把界面压窄。计算时需要足够多的网格点解析这个宽度，不能把网格粗糙造成的变化误判为材料行为。",
            "曲面界面的能量可以通过减少界面面积而降低，小畴因曲率较大往往先消失。但 Allen–Cahn 不保证空间平均 φ 守恒。如果 φ 实际代表封闭体系中的成分，应使用守恒的 Cahn–Hilliard 形式 ∂φ/∂t=∇·(M∇μ)。两种方程描述不同物理约束，不能仅因为图案相似就互换。",
          ],
          formula:
            "φ_eq(x) = tanh(x/ℓ)，ℓ = √(2κ/W)\n守恒情形：∂φ/∂t = ∇ · (M∇μ)",
          symbols: [
            {
              symbol: "ℓ",
              meaning:
                "双曲正切剖面的宽度参数；并非任意阈值定义下的完整界面厚度。",
            },
            { symbol: "φ_eq", meaning: "两端趋向 ±1 的平直平衡界面剖面。" },
            {
              symbol: "∫φ dV",
              meaning:
                "在无通量或周期边界下，Cahn–Hilliard 保持不变而 Allen–Cahn 一般不保持的总量。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一个均匀区域会向哪一相演化？",
        given:
          "采用约化单位 W=M=1，区域内 φ=0.2 且空间均匀，因此 ∇²φ=0。显式步长取 Δt=0.025。",
        steps: [
          "局部驱动力 μ=φ³−φ=0.008−0.2=−0.192。",
          "因此 ∂φ/∂t=−μ=+0.192，场值向 +1 的能量低谷移动。",
          "一次显式更新给出 φ_new=0.2+0.025×0.192=0.2048。",
          "同时，平衡界面的宽度参数在 κ=1 时为 √2；若 κ 增至 4、W 不变，宽度参数变为 2√2。",
        ],
        result:
          "局部势负责把区域推向稳定相，梯度项负责连接不同区域。增大 κ 会拓宽界面；增大 M 主要加快同一自由能景观上的演化。",
      },
      pitfalls: [
        "把任何序参量都当成浓度，并期待 Allen–Cahn 自动守恒总量。",
        "把三维高度图的高度当成表面真实起伏；这里高度只是序参量数值的表示。",
        "改变迁移率后仍用相同的过大显式时间步，可能制造非物理能量增长。",
      ],
      question: {
        prompt:
          "模拟封闭合金的成分分离时，为什么不能直接使用不守恒 Allen–Cahn 方程？",
        answer:
          "封闭体系的溶质总量必须守恒，而 Allen–Cahn 允许每个位置直接改变场值，通常会改变 ∫φdV。对成分场应采用守恒通量形式，例如 Cahn–Hilliard，并设置相应边界条件。",
      },
      diagram: {
        title: "双井势与弥散界面",
        caption:
          "双井局部能选择两个稳定状态，梯度能让它们之间通过有限宽度的平滑界面连接。空间曲线的纵轴是序参量，不是几何高度。",
        labels: [
          "局部自由能 f(φ)",
          "序参量 φ",
          "稳定相 −1",
          "稳定相 +1",
          "空间坐标 x",
          "界面宽度",
        ],
      },
    },
    en: {
      objectives: [
        "Represent phases and a finite-width interface with a continuous order parameter.",
        "Derive the Allen–Cahn equation from a free-energy variation.",
        "Decide whether a physical quantity must be conserved before choosing its evolution law.",
      ],
      sections: [
        {
          title: "Replace a sharp boundary with a continuous field",
          paragraphs: [
            "Explicitly tracking every interface becomes difficult when boundaries merge, split, or develop intricate shapes. Phase-field methods instead use a continuous field φ: values near −1 and +1 represent two stable states, and a smooth transition represents their interface. The field may describe structural or orientational order; it need not be chemical composition.",
            "A free energy must express both a preference for stable bulk phases and a cost for forming interfaces. A double-well local energy f(φ) places minima at ±1, while a gradient term penalizes abrupt spatial changes. Their competition produces a finite interface width, rather than merely blurring an otherwise sharp line for display.",
          ],
          formula: "F[φ] = ∫ [W(φ²−1)²/4 + κ|∇φ|²/2] dV",
          symbols: [
            {
              symbol: "φ",
              meaning:
                "Dimensionless order parameter distinguishing the two states.",
            },
            {
              symbol: "W",
              meaning:
                "Energy-density scale of the double-well potential, controlling the penalty for departing from a stable phase.",
            },
            {
              symbol: "κ",
              meaning:
                "Gradient-energy coefficient; together with W it determines interface width and energy.",
            },
            {
              symbol: "F",
              meaning:
                "Total free energy; its units depend on dimensionality and the chosen scaling.",
            },
          ],
        },
        {
          title: "How does free energy choose an evolution direction?",
          paragraphs: [
            "A scalar function decreases along its negative gradient; a field decreases along the negative variational derivative of its free-energy functional. Differentiating the local energy gives W(φ³−φ). Integration by parts of the gradient contribution gives −κ∇²φ for periodic or appropriate no-flux boundary conditions. Their sum is the thermodynamic driving force μ.",
            "For a nonconserved structural order parameter, Allen–Cahn dynamics sets ∂φ/∂t=−Mμ. With M>0 and no external work, the continuum equation satisfies dF/dt=−∫Mμ²dV≤0, so free energy cannot increase. An explicit numerical scheme still needs a sufficiently small time step: a dissipative differential equation does not make an unstable discretization correct.",
          ],
          formula: "μ = δF/δφ = W(φ³−φ) − κ∇²φ\n∂φ/∂t = −Mμ",
          symbols: [
            {
              symbol: "μ",
              meaning:
                "Variational derivative of free energy with respect to φ; it need not be the chemical potential of an atomic species here.",
            },
            {
              symbol: "M",
              meaning:
                "Positive mobility connecting the thermodynamic drive to the rate of change.",
            },
            {
              symbol: "∇²φ",
              meaning:
                "Laplacian of the field, expressing the influence of neighboring values.",
            },
          ],
        },
        {
          title: "Interface width, coarsening, and conservation",
          paragraphs: [
            "For a stationary planar interface in one dimension, setting μ=0 yields φ(x)=tanh[x/√(2κ/W)]. Its width parameter is therefore ℓ=√(2κ/W): larger κ smooths the interface, while larger W narrows it. A numerical grid needs enough points across this width; grid artifacts should not be mistaken for material behavior.",
            "A curved interface can lower its energy by reducing interfacial area, so small, highly curved domains often disappear first. Allen–Cahn dynamics does not, however, conserve the spatial mean of φ. If φ represents composition in a closed system, a conserved Cahn–Hilliard law, ∂φ/∂t=∇·(M∇μ), is appropriate. Similar-looking patterns do not make these distinct physical constraints interchangeable.",
          ],
          formula:
            "φ_eq(x) = tanh(x/ℓ), ℓ = √(2κ/W)\nConserved case: ∂φ/∂t = ∇ · (M∇μ)",
          symbols: [
            {
              symbol: "ℓ",
              meaning:
                "Width parameter of the hyperbolic-tangent profile, not the full thickness under every possible threshold definition.",
            },
            {
              symbol: "φ_eq",
              meaning:
                "Planar equilibrium profile approaching −1 and +1 on its two sides.",
            },
            {
              symbol: "∫φ dV",
              meaning:
                "Integral conserved by Cahn–Hilliard with periodic or no-flux boundaries, but generally not by Allen–Cahn.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Which phase does a uniform region move toward?",
        given:
          "Use reduced units with W=M=1 and an initially uniform φ=0.2, so ∇²φ=0. Choose an explicit step Δt=0.025.",
        steps: [
          "The local driving force is μ=φ³−φ=0.008−0.2=−0.192.",
          "Thus ∂φ/∂t=−μ=+0.192: the field moves toward the +1 minimum.",
          "One explicit update gives φ_new=0.2+0.025×0.192=0.2048.",
          "Separately, the equilibrium interface width parameter is √2 for κ=1. Increasing κ to 4 at fixed W changes it to 2√2.",
        ],
        result:
          "The local potential drives regions toward stable phases; the gradient term connects neighboring regions. Increasing κ broadens an interface, whereas increasing M mainly accelerates evolution over the same free-energy landscape.",
      },
      pitfalls: [
        "Treating every order parameter as a concentration and expecting Allen–Cahn to conserve its integral.",
        "Reading a three-dimensional height plot as a physically rough surface: its height represents the numerical order parameter here.",
        "Increasing mobility while retaining an excessively large explicit step can produce nonphysical energy growth.",
      ],
      question: {
        prompt:
          "Why is a nonconserved Allen–Cahn equation unsuitable by itself for compositional separation in a closed alloy?",
        answer:
          "The total solute amount must remain fixed. Allen–Cahn allows the field to change locally without a balancing flux and generally changes ∫φdV. A composition field needs a conserved flux law, such as Cahn–Hilliard, with appropriate boundary conditions.",
      },
      diagram: {
        title: "A double well and a diffuse interface",
        caption:
          "The local double-well energy selects two stable states. Gradient energy connects them through a smooth interface of finite width. The vertical axis of the spatial profile is an order parameter, not geometric height.",
        labels: [
          "Local energy f(φ)",
          "Order parameter φ",
          "Stable phase −1",
          "Stable phase +1",
          "Position x",
          "Interface width",
        ],
      },
    },
  },
  "crystal-plasticity": {
    zh: {
      objectives: [
        "把外加应力投影到一个晶体滑移系上。",
        "解释晶粒取向为何改变滑移启动条件。",
        "认识完整晶体塑性模型还需要哪些演化规律。",
      ],
      sections: [
        {
          title: "晶体不会沿任意方向自由滑动",
          paragraphs: [
            "在晶体内，塑性滑移通常沿特定晶面和晶向发生。一个滑移系由滑移面单位法向 n 和面内单位滑移方向 s 定义，二者互相垂直。外部拉力虽然沿试样轴线施加，真正驱动该滑移系的却是投影到滑移方向的剪应力。",
            "令拉伸轴与 n、s 的夹角分别为 φ、λ，先把轴向力投影到滑移方向，再考虑倾斜滑移面的面积，就得到 Schmid 因子 m=cosφ cosλ。它不是任意两个角的独立乘积，因为 n 与 s 必须正交；在单轴应力下 |m|≤1/2。",
          ],
          formula: "τ⁽ᵅ⁾ = s⁽ᵅ⁾ · σ · n⁽ᵅ⁾\n单轴拉伸：τ = σₐ cosφ cosλ = σₐ m",
          symbols: [
            { symbol: "α", meaning: "滑移系编号，不是材料常数。" },
            {
              symbol: "s、n",
              meaning: "滑移方向和滑移面法向的单位向量，满足 s·n=0。",
            },
            { symbol: "σₐ", meaning: "单轴外加拉应力。" },
            { symbol: "τ", meaning: "该滑移系上的分解剪应力。" },
            {
              symbol: "m",
              meaning: "Schmid 因子，单轴情形中绝对值不超过 0.5。",
            },
          ],
        },
        {
          title: "从启动阈值走向滑移速率",
          paragraphs: [
            "最简单的率无关判据是 |τ|≥g，其中 g 是临界分解剪应力。相同材料、不同取向的晶粒具有不同 m，因此即使受到相同轴向应力，也可能在不同载荷下开始滑移。对给定滑移系，启动所需轴向应力为 g/|m|；m=0 时该单轴载荷不驱动此滑移系。",
            "完整晶体塑性不能只标记“已启动”。它需要计算每个滑移系的滑移速率，并描述位错累积造成的硬化。常见平滑幂律用较大的指数 p 使 |τ| 接近 g 时速率迅速增加；硬化规律则让 g 随累计滑移变化。具体函数和参数应由实验或微观机制约束。",
          ],
          formula: "γ̇⁽ᵅ⁾ = γ̇₀ |τ⁽ᵅ⁾/g⁽ᵅ⁾|ᵖ sign(τ⁽ᵅ⁾)\nġ⁽ᵅ⁾ = Σᵦ hᵅᵦ |γ̇⁽ᵦ⁾|",
          symbols: [
            { symbol: "γ̇⁽ᵅ⁾", meaning: "滑移系 α 的剪切速率。" },
            { symbol: "g⁽ᵅ⁾", meaning: "当前滑移阻力或临界分解剪应力。" },
            {
              symbol: "γ̇₀、p",
              meaning:
                "参考滑移速率与速率敏感指数；此处 p 与 Schmid 因子 m 无关。",
            },
            { symbol: "hᵅᵦ", meaning: "滑移系 β 的活动对 α 硬化的影响。" },
          ],
        },
        {
          title: "把许多晶粒装回同一块材料",
          paragraphs: [
            "晶粒取向不同，就会倾向于产生不同的塑性变形。但相邻晶粒粘接在一起，必须满足相容与力平衡，不能各自独立伸长。因而真实多晶中的局部应力通常并不等于外加平均应力。晶体塑性有限元把各晶粒的滑移规律放入连续体求解中，求得相互约束后的局部场。",
            "在小变形下，可以把各滑移系贡献叠加为塑性应变率张量；大变形则需要更新晶格取向并处理弹塑性变形分解。本章的取向网格只比较固定取向、共同外加应力下的 Schmid 启动阈值，没有计算应变相容、硬化或取向旋转，因此不是完整的多晶应力–应变预测。",
          ],
          formula: "ε̇ᵖ = Σᵅ (γ̇⁽ᵅ⁾/2)[s⁽ᵅ⁾⊗n⁽ᵅ⁾ + n⁽ᵅ⁾⊗s⁽ᵅ⁾]",
          symbols: [
            { symbol: "ε̇ᵖ", meaning: "小变形下的塑性应变率张量。" },
            { symbol: "⊗", meaning: "向量外积，把方向信息组合成二阶张量。" },
            { symbol: "Σᵅ", meaning: "对晶体中考虑的所有滑移系求和。" },
          ],
        },
      ],
      workedExample: {
        title: "相同载荷，为什么一个晶粒先滑移？",
        given:
          "轴向应力 σₐ=120 MPa，临界分解剪应力 g=40 MPa。考虑平面单滑移模型：λ=90°−φ。",
        steps: [
          "晶粒 A 取 φ=30°，则 m=cos30°×sin30°≈0.433，τ≈52.0 MPa，大于 40 MPa，达到启动阈值。",
          "晶粒 B 取 φ=10°，则 m≈0.171，τ≈20.5 MPa，尚未达到阈值。",
          "A 的轴向启动应力为 40/0.433≈92.4 MPa。最有利的 φ=45° 取向给出 m=0.5，启动应力为 80 MPa。",
        ],
        result:
          "不同启动顺序来自取向投影，而不是因为每个晶粒必须有不同的材料强度。加入晶粒相互约束后，局部应力还会进一步改变这个排序。",
      },
      pitfalls: [
        "把最大 Schmid 因子写成 1：滑移方向必须位于滑移面内，因此单轴情形最大值为 0.5。",
        "把被标记的启动比例当成塑性应变；阈值判断本身没有积分滑移速率。",
        "用单个平面滑移系替代真实 FCC、BCC 或 HCP 晶体的全部滑移机制，忽略晶粒相互约束。",
      ],
      question: {
        prompt:
          "两晶粒的 Schmid 因子分别为 0.2 和 0.4，临界分解剪应力均为 30 MPa。哪个先启动？",
        answer:
          "m=0.4 的晶粒先启动，其轴向阈值为 30/0.4=75 MPa；m=0.2 的晶粒需要 150 MPa。这是在相同单轴局部应力与单一滑移判据下的结论。",
      },
      diagram: {
        title: "把拉应力投影到滑移系",
        caption:
          "n 是滑移面的法向，s 是面内滑移方向。它们与拉伸轴的夹角决定分解剪应力；同一外加载荷对不同取向的晶粒有不同驱动效果。",
        labels: [
          "拉伸轴",
          "外加应力 σₐ",
          "滑移面",
          "法向 n",
          "滑移方向 s",
          "分解剪应力 τ",
        ],
      },
    },
    en: {
      objectives: [
        "Resolve an applied stress onto a crystal slip system.",
        "Explain why grain orientation changes the onset of slip.",
        "Identify the evolution laws required for a full crystal-plasticity model.",
      ],
      sections: [
        {
          title: "A crystal cannot slip freely in every direction",
          paragraphs: [
            "Plastic slip in a crystal usually occurs on specific planes and along specific directions. A slip system is defined by a unit plane normal n and a unit slip direction s lying in that plane, so the two vectors are perpendicular. Although a tensile load acts along the specimen axis, the shear component resolved along the slip direction is what drives this system.",
            "Let φ and λ be the angles between the loading axis and n and s, respectively. Projecting the axial force along the slip direction and accounting for the area of the inclined plane gives the Schmid factor m=cosφ cosλ. These angles are not arbitrary independent choices because n and s must remain orthogonal; under uniaxial loading, |m|≤1/2.",
          ],
          formula:
            "τ⁽ᵅ⁾ = s⁽ᵅ⁾ · σ · n⁽ᵅ⁾\nUniaxial tension: τ = σₐ cosφ cosλ = σₐ m",
          symbols: [
            {
              symbol: "α",
              meaning: "Slip-system index, not a material constant.",
            },
            {
              symbol: "s, n",
              meaning:
                "Unit slip direction and unit slip-plane normal, with s·n=0.",
            },
            { symbol: "σₐ", meaning: "Applied uniaxial tensile stress." },
            {
              symbol: "τ",
              meaning: "Resolved shear stress on the chosen slip system.",
            },
            {
              symbol: "m",
              meaning:
                "Schmid factor, whose magnitude is at most 0.5 under uniaxial loading.",
            },
          ],
        },
        {
          title: "From an activation threshold to a slip rate",
          paragraphs: [
            "The simplest rate-independent activation criterion is |τ|≥g, where g is the critical resolved shear stress. Grains made of the same material can have different m because their orientations differ. Consequently, they may begin to slip at different applied loads. For one slip system, the required axial stress is g/|m|; a system with m=0 is not driven by this uniaxial load.",
            "A complete crystal-plasticity model must do more than mark a system as active. It calculates the slip rate on every system and represents hardening caused by accumulating dislocations. A common smooth power law uses a large exponent p to make slip rates increase rapidly near |τ|=g. A hardening law then evolves g with accumulated slip. These functions and parameters require experimental or micromechanical justification.",
          ],
          formula: "γ̇⁽ᵅ⁾ = γ̇₀ |τ⁽ᵅ⁾/g⁽ᵅ⁾|ᵖ sign(τ⁽ᵅ⁾)\nġ⁽ᵅ⁾ = Σᵦ hᵅᵦ |γ̇⁽ᵦ⁾|",
          symbols: [
            { symbol: "γ̇⁽ᵅ⁾", meaning: "Shear rate on slip system α." },
            {
              symbol: "g⁽ᵅ⁾",
              meaning:
                "Current slip resistance or critical resolved shear stress.",
            },
            {
              symbol: "γ̇₀, p",
              meaning:
                "Reference slip rate and rate-sensitivity exponent; p is distinct from the Schmid factor m.",
            },
            {
              symbol: "hᵅᵦ",
              meaning: "Hardening of system α induced by activity on system β.",
            },
          ],
        },
        {
          title: "Putting the grains back into one material",
          paragraphs: [
            "Differently oriented grains tend to develop different plastic deformations. Neighboring grains are bonded, however, so they must satisfy compatibility and force balance rather than elongating independently. Local stress in a real polycrystal therefore usually differs from the applied average stress. Crystal-plasticity finite elements embed the slip laws within a continuum solution to determine these mutually constrained local fields.",
            "At small strains, contributions from all slip systems can be added to obtain a plastic strain-rate tensor. Large-deformation models must also update lattice orientation and treat elastic–plastic deformation decomposition. The orientation grid in this lesson compares Schmid activation thresholds at fixed orientations under a shared applied stress. It does not solve compatibility, hardening, or lattice rotation and is not a complete prediction of a polycrystal's stress–strain curve.",
          ],
          formula: "ε̇ᵖ = Σᵅ (γ̇⁽ᵅ⁾/2)[s⁽ᵅ⁾⊗n⁽ᵅ⁾ + n⁽ᵅ⁾⊗s⁽ᵅ⁾]",
          symbols: [
            {
              symbol: "ε̇ᵖ",
              meaning:
                "Plastic strain-rate tensor in a small-deformation description.",
            },
            {
              symbol: "⊗",
              meaning:
                "Vector outer product, combining directions into a second-order tensor.",
            },
            {
              symbol: "Σᵅ",
              meaning:
                "Sum over all slip systems included in the crystal model.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Why does one grain slip first under the same load?",
        given:
          "Take an axial stress σₐ=120 MPa and a critical resolved shear stress g=40 MPa. In a planar single-slip geometry, λ=90°−φ.",
        steps: [
          "For grain A with φ=30°, m=cos30°×sin30°≈0.433 and τ≈52.0 MPa. This exceeds 40 MPa, so the activation criterion is met.",
          "For grain B with φ=10°, m≈0.171 and τ≈20.5 MPa, below the threshold.",
          "Grain A's axial activation stress is 40/0.433≈92.4 MPa. The most favorably oriented case, φ=45°, has m=0.5 and activates at 80 MPa.",
        ],
        result:
          "The different onset loads arise from orientation, without requiring different intrinsic strengths for the grains. Grain interactions can subsequently change the local stresses and the activation order.",
      },
      pitfalls: [
        "Setting the largest Schmid factor to 1 ignores the requirement that the slip direction lies in the slip plane; the uniaxial maximum is 0.5.",
        "Treating the fraction of activated systems as plastic strain: a threshold test does not integrate slip rates.",
        "Replacing the full slip families of FCC, BCC, or HCP crystals with one planar system while ignoring constraints between grains.",
      ],
      question: {
        prompt:
          "Two grains have Schmid factors 0.2 and 0.4 and the same critical shear stress of 30 MPa. Which activates first?",
        answer:
          "The grain with m=0.4 activates at an axial stress of 30/0.4=75 MPa. The grain with m=0.2 needs 150 MPa. This comparison assumes the same uniaxial local stress and a single-slip activation criterion.",
      },
      diagram: {
        title: "Resolving tensile stress onto a slip system",
        caption:
          "n is the slip-plane normal and s the in-plane slip direction. Their angles to the loading axis determine resolved shear stress, so the same applied load drives differently oriented grains by different amounts.",
        labels: [
          "Loading axis",
          "Applied stress σₐ",
          "Slip plane",
          "Normal n",
          "Slip direction s",
          "Resolved shear τ",
        ],
      },
    },
  },
};
