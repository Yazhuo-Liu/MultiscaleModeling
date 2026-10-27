import type { TheorySet } from "./theory";

export const continuumTheory: TheorySet = {
  constitutive: {
    zh: {
      objectives: [
        "区分平衡方程、本构关系与状态演化方程各自回答的问题。",
        "从串联弹簧与阻尼器推导 Maxwell 方程，并解释松弛时间。",
        "用应力松弛实验检查参数、量纲与模型的适用范围。",
      ],
      sections: [
        {
          title: "先问材料记住了什么",
          paragraphs: [
            "连续体模型不再逐个追踪原子，而是在一个足够小、又包含许多微观结构的体积内定义应力、应变和温度。动量平衡规定力的关系，却不能告诉我们同样的变形会让钢、橡胶或黏性液体产生多大应力。这个缺口由本构关系补上。最简单的一维弹性关系是 $\\sigma=E\\varepsilon$；它假定当前应力只由当前应变决定。",
            "具有历史依赖的材料需要额外的内部状态 $q$，例如黏性应变、塑性应变或硬化变量。于是模型分成两部分：由当前应变、状态和温度求应力，再由加载速率更新状态。这里的状态不是一张任意记忆表，而是经过物理假设和实验约束选择的一组变量；变量越多，往往也意味着更多需要标定的参数。",
          ],
          formula:
            "\\begin{aligned}\\sigma&=\\sigma(\\varepsilon,q,T)\\\\\\dot q&=g(\\dot\\varepsilon,q,T)\\end{aligned}",
          symbols: [
            {
              symbol: "\\sigma",
              meaning: "应力，单位 Pa；一维拉伸时为轴向应力。",
            },
            {
              symbol: "\\varepsilon",
              meaning: "应变，无量纲；本章采用小应变。",
            },
            {
              symbol: "q",
              meaning: "内部状态变量；其分量的单位由具体物理定义决定。",
            },
            {
              symbol: "T",
              meaning: "温度；本章松弛实验保持温度不变。",
            },
          ],
        },
        {
          title: "把弹簧与阻尼器串联起来",
          paragraphs: [
            "弹簧储存可恢复的弹性能，满足 $\\sigma=E\\varepsilon_e$；理想黏性阻尼器满足 $\\sigma=\\eta\\dot{\\varepsilon}_v$，它的变形速率与应力成正比。串联时，两部分承受相同应力，总应变是 $\\varepsilon=\\varepsilon_e+\\varepsilon_v$。对总应变求时间导数，就得到 $\\dot{\\varepsilon}=\\dot{\\sigma}/E+\\sigma/\\eta$。这个推导依赖常数 $E$、常数 $\\eta$、小应变和等温条件。",
            "瞬间拉伸至 $\\varepsilon_0$ 后保持总长度不变，对后续过程有 $\\dot{\\varepsilon}=0$。此时阻尼器继续伸长，弹簧逐渐缩短，二者总变形不变，应力却持续下降。解一阶微分方程可得指数衰减；在 $t=\\tau$ 时应力剩下初值的 $1/e$，约 36.8%。$\\tau=\\eta/E$ 比较黏性阻力与弹性刚度，因此具有时间单位。",
          ],
          formula:
            "\\begin{aligned}\\varepsilon&=\\varepsilon_e+\\varepsilon_v,&\\sigma&=E\\varepsilon_e=\\eta\\dot\\varepsilon_v\\\\\\dot\\sigma+\\frac\\sigma\\tau&=E\\dot\\varepsilon,&\\tau&=\\frac\\eta E\\\\\\varepsilon(t>0)&=\\varepsilon_0&\\Longrightarrow\\quad\\sigma(t)&=E\\varepsilon_0e^{-t/\\tau}\\end{aligned}",
          symbols: [
            {
              symbol: "E",
              meaning: "弹性模量，单位 Pa；决定瞬时弹性响应。",
            },
            {
              symbol: "\\eta",
              meaning:
                "黏度，单位 $\\mathrm{Pa\\,s}$；$\\sigma/\\eta$ 因此是应变速率。",
            },
            {
              symbol: "\\tau",
              meaning: "松弛时间，单位 s；不是应力降为零所需的有限时间。",
            },
            {
              symbol: "\\varepsilon_e,\\;\\varepsilon_v",
              meaning: "分别为弹性和黏性应变，两者之和为总应变。",
            },
          ],
        },
        {
          title: "从一个模型走向一类材料规律",
          paragraphs: [
            "松弛实验保持应变，测应力如何变化；蠕变实验保持应力，测应变如何变化。对同一个 Maxwell 模型，恒定应力下会发生线性增长的黏性变形，因此它具有流体式的长期响应。许多固体在长时间后仍有非零松弛模量，需要额外的并联弹簧；具有宽时间谱的材料还需要多个松弛支路。增加结构应以实验需求为依据。",
            "“速率与状态”也常指摩擦学中的 Dieterich–Ruina 关系：摩擦系数同时依赖滑移速度 $v$ 与接触状态 $\\theta$，常用老化律 $\\dot{\\theta}=1-v\\theta/D_c$。它与 Maxwell 模型都包含状态演化，但物理变量和适用对象不同，不能互相替代。选择任何本构模型后，都应检查量纲、耗散符号、参数识别，以及未参与拟合的加载历史；本章的单支松弛实验仅覆盖线性黏弹性。",
          ],
          formula:
            "\\begin{aligned}\\sigma=\\sigma_0&\\quad\\Longrightarrow\\quad\\varepsilon(t)=\\frac{\\sigma_0}{E}+\\frac{\\sigma_0t}{\\eta}\\\\D&=\\sigma\\dot\\varepsilon_v=\\frac{\\sigma^2}{\\eta}\\ge0\\qquad(\\eta>0)\\end{aligned}",
          symbols: [
            {
              symbol: "D",
              meaning: "单位体积的机械耗散率，单位 $\\mathrm W/\\mathrm m^3$。",
            },
            {
              symbol: "v",
              meaning: "摩擦速率状态律中的滑移速度，单位 m/s。",
            },
            {
              symbol: "\\theta,\\;D_c",
              meaning:
                "常用老化律中 $\\theta$ 的单位为 s，特征滑移距离 $D_c$ 的单位为 m。",
            },
          ],
        },
      ],
      workedExample: {
        title: "2% 拉伸后，应力多久减半？",
        given:
          "取 $E=100\\,\\mathrm{MPa}$、$\\tau=2\\,\\mathrm{s}$、$\\varepsilon_0=0.02$。理想阶跃施加应变后，保持总长度不变。",
        steps: [
          "初始应力 $\\sigma_0=E\\varepsilon_0=100\\times0.02=2\\,\\mathrm{MPa}$。黏度 $\\eta=E\\tau=200\\,\\mathrm{MPa\\,s}$。",
          "经过 2 s，应力 $\\sigma=2\\exp(-1)\\approx0.736\\,\\mathrm{MPa}$，弹性应变 $\\varepsilon_e=\\sigma/E\\approx0.00736$。",
          "此时黏性应变 $\\varepsilon_v=\\varepsilon_0-\\varepsilon_e\\approx0.01264$；两部分应变相加仍为 0.02。",
          "令 $\\sigma/\\sigma_0=1/2$，可得半衰时间 $t_{1/2}=\\tau\\ln2\\approx1.386\\,\\mathrm{s}$。",
        ],
        result:
          "应力减半需要约 1.39 s；一个松弛时间后保留约 36.8%。保持长度并不意味着内部弹性与黏性变形各自不变。",
      },
      pitfalls: [
        "把应力松弛当作应变不断增加的蠕变；先确认实验控制的是应力还是应变。",
        "增大 $E$ 却同时把 $\\eta$ 与 $\\tau$ 都当作独立不变的量；三者满足 $\\eta=E\\tau$。",
        "用一个 Maxwell 支路解释所有塑性、损伤或摩擦行为；不同机制需要不同状态变量和验证。",
      ],
      question: {
        prompt:
          "保持 $E$ 与初始应变不变，将黏度增大一倍。初始应力、松弛时间和半衰时间分别如何变化？",
        answer:
          "初始应力 $E\\varepsilon_0$ 不变；$\\tau=\\eta/E$ 增大一倍，$t_{1/2}=\\tau\\ln2$ 也增大一倍。材料以相同的初始应力开始，但松弛得更慢。",
      },
      diagram: {
        title: "串联元件如何产生应力松弛",
        caption:
          "弹簧与阻尼器承受同一应力，总应变由两部分相加。固定总应变后，黏性应变增长，弹性应变减小，应力随之衰减。示意图不代表材料内部存在真实机械元件。",
        labels: [
          "弹簧 E",
          "阻尼器 η",
          "相同应力 σ",
          "ε = εₑ + εᵥ",
          "保持总应变",
          "τ 时剩余 1/e",
        ],
      },
      derivation: {
        title: "从一个弹簧出发，推到材料的记忆核",
        introduction:
          "先解决保持应变这一最简单的实验，再允许任意加载历史，最后把多个松弛机制组合起来。每次扩展都保留同一个状态演化思路，而不是重新猜一条曲线。",
        stages: [
          {
            level: "simple",
            title: "简单情形：阶跃应变后的松弛",
            assumptions: [
              "一维小应变、等温；$E>0$ 与 $\\eta>0$ 为常数。",
              "初始无应力，在 $t=0$ 理想瞬间拉伸至 $\\varepsilon_0>0$，此后保持总应变。",
            ],
            steps: [
              {
                explanation:
                  "串联意味着两元件承受相同应力，而总应变等于两部分之和。先写约束和各元件本构式。",
                formula:
                  "\\varepsilon=\\varepsilon_e+\\varepsilon_v,\\qquad\\sigma=E\\varepsilon_e,\\qquad\\sigma=\\eta\\dot\\varepsilon_v",
              },
              {
                explanation:
                  "对总应变求导。弹簧的应变率由应力变化给出，阻尼器的应变率由当前应力给出；整理后出现特征时间。",
                formula:
                  "\\dot\\varepsilon=\\frac{\\dot\\sigma}{E}+\\frac\\sigma\\eta\\quad\\Longrightarrow\\quad\\dot\\sigma+\\frac\\sigma\\tau=E\\dot\\varepsilon,\\qquad\\tau=\\frac\\eta E",
              },
              {
                explanation:
                  "保持总应变后右端为零。分离变量并从初始应力积分到当前应力，得到指数而不是线性衰减。",
                formula:
                  "\\int_{\\sigma(0^+)}^{\\sigma(t)}\\frac{d\\sigma}{\\sigma}=-\\int_0^t\\frac{ds}{\\tau}\\quad\\Longrightarrow\\quad\\sigma(t)=\\sigma(0^+)e^{-t/\\tau}=E\\varepsilon_0e^{-t/\\tau}",
              },
            ],
            conclusion:
              "由串联约束可直接推出松弛规律。$\\tau$ 控制衰减速度，$E\\varepsilon_0$ 控制初始高度；改变两个量的物理作用不同。",
          },
          {
            level: "general",
            title: "复杂情形：材料经历任意加载历史",
            assumptions: [
              "$E$ 与 $\\tau$ 仍为常数，已知初始应力 $\\sigma(0)$。",
              "$t>0$ 的应变历史可微；额外阶跃可分段处理。",
            ],
            steps: [
              {
                explanation:
                  "不再令应变率为零。把它视为驱动项，保留完整的一阶线性方程。",
                formula:
                  "\\dot\\sigma(t)+\\frac{\\sigma(t)}\\tau=E\\dot\\varepsilon(t)",
              },
              {
                explanation:
                  "两边乘以积分因子。利用乘积求导法则，左侧变为一个完整导数。",
                formula:
                  "e^{t/\\tau}\\left(\\dot\\sigma+\\frac\\sigma\\tau\\right)=\\frac{d}{dt}\\left(e^{t/\\tau}\\sigma\\right)=Ee^{t/\\tau}\\dot\\varepsilon",
              },
              {
                explanation:
                  "对时间积分，再乘回衰减因子。过去每一次应变增量都贡献应力，但越久远的贡献衰减越多。",
                formula:
                  "\\sigma(t)=\\sigma(0)e^{-t/\\tau}+\\int_0^t E e^{-(t-s)/\\tau}\\dot\\varepsilon(s)\\,ds",
              },
              {
                explanation:
                  "用恒定应变率检验通式：积分可以直接算出，长期应力趋向黏度乘以加载速率。",
                formula:
                  "\\dot\\varepsilon(s)=\\dot\\varepsilon_c\\quad\\Longrightarrow\\quad\\sigma(t)=\\sigma(0)e^{-t/\\tau}+E\\tau\\dot\\varepsilon_c(1-e^{-t/\\tau})\\xrightarrow[t\\to\\infty]{}\\eta\\dot\\varepsilon_c",
              },
            ],
            conclusion:
              "所谓“记忆”在这里是一个可计算的卷积核 $E e^{-(t-s)/\\tau}$。它来自状态方程的解，并不是额外指定的经验叙述。",
          },
          {
            level: "extension",
            title: "扩展：多个松弛时间与固体的长期刚度",
            assumptions: [
              "仍采用线性小应变模型；各支路并联，共享同一应变。",
              "$E_\\infty\\ge0$、$E_j>0$、$\\eta_j>0$，每个 Maxwell 支路初始松弛。",
            ],
            steps: [
              {
                explanation:
                  "增加一根平衡弹簧，并把多个 Maxwell 支路并联。并联连接要求应力相加，不是应变相加。",
                formula:
                  "\\sigma=E_\\infty\\varepsilon+\\sum_{j=1}^{m}\\sigma_j",
              },
              {
                explanation:
                  "每个支路沿用刚才推导的状态方程，但具有自己的模量和松弛时间。",
                formula:
                  "\\dot\\sigma_j+\\frac{\\sigma_j}{\\tau_j}=E_j\\dot\\varepsilon,\\qquad\\tau_j=\\frac{\\eta_j}{E_j}",
              },
              {
                explanation:
                  "施加相同阶跃应变，将各支路指数响应相加，得到松弛模量。长期残余刚度来自平衡弹簧。",
                formula:
                  "\\sigma(t)=\\varepsilon_0G(t),\\qquad G(t)=E_\\infty+\\sum_{j=1}^{m}E_j e^{-t/\\tau_j},\\qquad G(\\infty)=E_\\infty",
              },
              {
                explanation:
                  "再检查耗散：每个阻尼器都产生非负耗散。正参数既有物理意义，也限制了拟合可以采用的范围。",
                formula:
                  "D=\\sum_{j=1}^{m}\\sigma_j\\dot\\varepsilon_{v,j}=\\sum_{j=1}^{m}\\frac{\\sigma_j^2}{\\eta_j}\\ge0",
              },
            ],
            conclusion:
              "这是从一个时间尺度扩展到松弛谱的过程。它仍不自动包含屈服、损伤、有限变形或摩擦；引入这些机制时必须另写状态变量及演化规律。",
          },
        ],
      },
    },
    en: {
      objectives: [
        "Distinguish balance equations, constitutive relations, and state evolution laws.",
        "Derive the Maxwell equation from a spring and dashpot in series and interpret its relaxation time.",
        "Use a stress-relaxation experiment to check parameters, units, and the model's scope.",
      ],
      sections: [
        {
          title: "What does a material remember?",
          paragraphs: [
            "A continuum model replaces individual atoms with stress, strain, and temperature defined over a small volume containing many microscopic constituents. Momentum balance constrains forces, but it cannot determine the stress produced by a given deformation in steel, rubber, or a viscous liquid. A constitutive relation closes that gap. The simplest one-dimensional elastic law is $\\sigma=E\\varepsilon$: it assumes that the current stress depends only on the current strain.",
            "A material with memory requires additional internal variables $q$, such as viscous strain, plastic strain, or a hardening variable. The model then has two parts: evaluate stress from the current strain, state, and temperature; then update the state using its evolution law. These variables are not an arbitrary record of the past. They represent selected physical mechanisms, and introducing more of them generally creates more parameters that must be identified from experiments.",
          ],
          formula:
            "\\begin{aligned}\\sigma&=\\sigma(\\varepsilon,q,T)\\\\\\dot q&=g(\\dot\\varepsilon,q,T)\\end{aligned}",
          symbols: [
            {
              symbol: "\\sigma",
              meaning:
                "Stress, in Pa; axial stress in the one-dimensional example.",
            },
            {
              symbol: "\\varepsilon",
              meaning: "Dimensionless strain; this chapter uses small strain.",
            },
            {
              symbol: "q",
              meaning:
                "Internal state variables; their units depend on their physical definitions.",
            },
            {
              symbol: "T",
              meaning:
                "Temperature, held constant in the relaxation experiment.",
            },
          ],
        },
        {
          title: "Connect a spring and a dashpot in series",
          paragraphs: [
            "A spring stores recoverable elastic energy and obeys $\\sigma=E\\varepsilon_e$. An ideal viscous dashpot obeys $\\sigma=\\eta\\dot{\\varepsilon}_v$: its deformation rate is proportional to stress. In series, both elements carry the same stress, while their strains add: $\\varepsilon=\\varepsilon_e+\\varepsilon_v$. Differentiating this sum gives $\\dot{\\varepsilon}=\\dot{\\sigma}/E+\\sigma/\\eta$. This derivation assumes constant $E$ and $\\eta$, small strain, and a fixed temperature.",
            "After an ideal instantaneous strain $\\varepsilon_0$ is applied and the total length is held fixed, $\\dot{\\varepsilon}=0$. The dashpot continues to extend while the spring shortens, leaving the total deformation unchanged but reducing the stress. Solving the resulting first-order differential equation gives exponential decay. After $t=\\tau$, the stress is $1/e$, or about 36.8%, of its initial value. The ratio $\\tau=\\eta/E$ compares viscous resistance with elastic stiffness and has units of time.",
          ],
          formula:
            "\\begin{aligned}\\varepsilon&=\\varepsilon_e+\\varepsilon_v,&\\sigma&=E\\varepsilon_e=\\eta\\dot\\varepsilon_v\\\\\\dot\\sigma+\\frac\\sigma\\tau&=E\\dot\\varepsilon,&\\tau&=\\frac\\eta E\\\\\\varepsilon(t>0)&=\\varepsilon_0&\\Longrightarrow\\quad\\sigma(t)&=E\\varepsilon_0e^{-t/\\tau}\\end{aligned}",
          symbols: [
            {
              symbol: "E",
              meaning:
                "Elastic modulus, in Pa; sets the instantaneous elastic response.",
            },
            {
              symbol: "\\eta",
              meaning:
                "Viscosity, in $\\mathrm{Pa\\,s}$, so $\\sigma/\\eta$ has units of strain rate.",
            },
            {
              symbol: "\\tau",
              meaning:
                "Relaxation time, in s; it is not a finite time at which stress becomes exactly zero.",
            },
            {
              symbol: "\\varepsilon_e,\\;\\varepsilon_v",
              meaning:
                "Elastic and viscous strain; their sum is the total strain.",
            },
          ],
        },
        {
          title: "From one model to a family of material laws",
          paragraphs: [
            "A relaxation test holds strain and measures changing stress. A creep test holds stress and measures changing strain. Under constant stress, the same Maxwell model accumulates viscous strain linearly, giving it a fluid-like long-time response. Many solids retain a nonzero long-time relaxation modulus and require an additional parallel spring. Materials with broad relaxation spectra may require several branches. Extra model structure should be justified by the experiments to be described.",
            "The phrase 'rate and state' also often refers to Dieterich–Ruina friction laws, where the friction coefficient depends on sliding velocity $v$ and a contact state $\\theta$. A common aging law is $\\dot{\\theta}=1-v\\theta/D_c$. Both this law and the Maxwell model involve evolving state, but their variables and physical applications differ. They are not interchangeable. Any constitutive model should be checked for consistent units, dissipation, identifiable parameters, and predictions for loading histories excluded from calibration. The single-branch relaxation example covers linear viscoelasticity only.",
          ],
          formula:
            "\\begin{aligned}\\sigma=\\sigma_0&\\quad\\Longrightarrow\\quad\\varepsilon(t)=\\frac{\\sigma_0}{E}+\\frac{\\sigma_0t}{\\eta}\\\\D&=\\sigma\\dot\\varepsilon_v=\\frac{\\sigma^2}{\\eta}\\ge0\\qquad(\\eta>0)\\end{aligned}",
          symbols: [
            {
              symbol: "D",
              meaning:
                "Mechanical dissipation rate per unit volume, in $\\mathrm W/\\mathrm m^3$.",
            },
            {
              symbol: "v",
              meaning:
                "Sliding velocity in a friction rate-and-state law, in m/s.",
            },
            {
              symbol: "\\theta,\\;D_c",
              meaning:
                "In the common aging law, $\\theta$ is measured in s and the characteristic slip distance $D_c$ in m.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How long does stress take to halve after a 2% stretch?",
        given:
          "Let $E=100\\,\\mathrm{MPa}$, $\\tau=2\\,\\mathrm{s}$, and $\\varepsilon_0=0.02$. Apply an ideal step in strain and hold the total length fixed.",
        steps: [
          "The initial stress is $\\sigma_0=E\\varepsilon_0=100\\times0.02=2\\,\\mathrm{MPa}$. The viscosity is $\\eta=E\\tau=200\\,\\mathrm{MPa\\,s}$.",
          "At 2 s, $\\sigma=2\\exp(-1)\\approx0.736\\,\\mathrm{MPa}$, so the elastic strain is $\\varepsilon_e=\\sigma/E\\approx0.00736$.",
          "The viscous strain is $\\varepsilon_v=\\varepsilon_0-\\varepsilon_e\\approx0.01264$. The two strains still add to 0.02.",
          "Setting $\\sigma/\\sigma_0=1/2$ gives a half-life $t_{1/2}=\\tau\\ln2\\approx1.386\\,\\mathrm{s}$.",
        ],
        result:
          "Stress takes about 1.39 s to halve and retains about 36.8% after one relaxation time. Holding the total length does not hold the elastic and viscous strains individually fixed.",
      },
      pitfalls: [
        "Confusing stress relaxation with creep: first identify whether strain or stress is controlled.",
        "Changing $E$ while treating both $\\eta$ and $\\tau$ as independently fixed; they are linked by $\\eta=E\\tau$.",
        "Using one Maxwell branch to explain all plasticity, damage, or friction; different mechanisms require different state variables and validation.",
      ],
      question: {
        prompt:
          "Keep $E$ and the initial strain fixed, but double the viscosity. What happens to the initial stress, relaxation time, and half-life?",
        answer:
          "The initial stress $E\\varepsilon_0$ is unchanged. Both $\\tau=\\eta/E$ and $t_{1/2}=\\tau\\ln2$ double. The material starts at the same stress but relaxes more slowly.",
      },
      diagram: {
        title: "How elements in series produce stress relaxation",
        caption:
          "The spring and dashpot carry the same stress and their strains add. At fixed total strain, viscous strain grows while elastic strain falls, reducing the stress. These are mechanical analogies, not literal components inside the material.",
        labels: [
          "Spring E",
          "Dashpot η",
          "Same stress σ",
          "ε = εₑ + εᵥ",
          "Hold total strain",
          "1/e remains at τ",
        ],
      },
      derivation: {
        title: "From one spring to a material memory kernel",
        introduction:
          "Start with a held-strain experiment, then allow an arbitrary loading history, and finally combine several relaxation mechanisms. Each extension follows the same state-evolution logic rather than guessing another curve.",
        stages: [
          {
            level: "simple",
            title: "Simple case: relaxation after a strain step",
            assumptions: [
              "One-dimensional small strain at fixed temperature; $E>0$ and $\\eta>0$ are constant.",
              "Initially stress free; an ideal step at $t=0$ imposes $\\varepsilon_0>0$, followed by a fixed total strain.",
            ],
            steps: [
              {
                explanation:
                  "Elements in series carry the same stress and their strains add. Write those constraints and the individual material laws first.",
                formula:
                  "\\varepsilon=\\varepsilon_e+\\varepsilon_v,\\qquad\\sigma=E\\varepsilon_e,\\qquad\\sigma=\\eta\\dot\\varepsilon_v",
              },
              {
                explanation:
                  "Differentiate total strain. The spring rate follows stress change, while the dashpot rate follows current stress. Rearranging introduces the characteristic time.",
                formula:
                  "\\dot\\varepsilon=\\frac{\\dot\\sigma}{E}+\\frac\\sigma\\eta\\quad\\Longrightarrow\\quad\\dot\\sigma+\\frac\\sigma\\tau=E\\dot\\varepsilon,\\qquad\\tau=\\frac\\eta E",
              },
              {
                explanation:
                  "Once strain is held, the right-hand side vanishes. Separate variables and integrate from the initial stress to the current stress to obtain exponential, not linear, decay.",
                formula:
                  "\\int_{\\sigma(0^+)}^{\\sigma(t)}\\frac{d\\sigma}{\\sigma}=-\\int_0^t\\frac{ds}{\\tau}\\quad\\Longrightarrow\\quad\\sigma(t)=\\sigma(0^+)e^{-t/\\tau}=E\\varepsilon_0e^{-t/\\tau}",
              },
            ],
            conclusion:
              "The series constraints determine the relaxation law. The decay rate is controlled by $\\tau$, while $E\\varepsilon_0$ sets the initial stress; these parameters play different roles.",
          },
          {
            level: "general",
            title: "General case: an arbitrary loading history",
            assumptions: [
              "$E$ and $\\tau$ remain constant and the initial stress $\\sigma(0)$ is known.",
              "The strain history is differentiable for $t>0$; additional jumps can be handled piecewise.",
            ],
            steps: [
              {
                explanation:
                  "Do not set the strain rate to zero. Treat it as a driving term and retain the complete first-order linear equation.",
                formula:
                  "\\dot\\sigma(t)+\\frac{\\sigma(t)}\\tau=E\\dot\\varepsilon(t)",
              },
              {
                explanation:
                  "Multiply by an integrating factor. The product rule turns the left-hand side into a single derivative.",
                formula:
                  "e^{t/\\tau}\\left(\\dot\\sigma+\\frac\\sigma\\tau\\right)=\\frac{d}{dt}\\left(e^{t/\\tau}\\sigma\\right)=Ee^{t/\\tau}\\dot\\varepsilon",
              },
              {
                explanation:
                  "Integrate over time and multiply by the decaying factor. Each past strain increment contributes stress, with older contributions weighted less.",
                formula:
                  "\\sigma(t)=\\sigma(0)e^{-t/\\tau}+\\int_0^t E e^{-(t-s)/\\tau}\\dot\\varepsilon(s)\\,ds",
              },
              {
                explanation:
                  "Check the formula using a constant strain rate: the integral is explicit, and long-time stress approaches viscosity times the loading rate.",
                formula:
                  "\\dot\\varepsilon(s)=\\dot\\varepsilon_c\\quad\\Longrightarrow\\quad\\sigma(t)=\\sigma(0)e^{-t/\\tau}+E\\tau\\dot\\varepsilon_c(1-e^{-t/\\tau})\\xrightarrow[t\\to\\infty]{}\\eta\\dot\\varepsilon_c",
              },
            ],
            conclusion:
              "Memory is now a computable convolution kernel, $E e^{-(t-s)/\\tau}$. It follows from solving the state equation rather than being an additional narrative assumption.",
          },
          {
            level: "extension",
            title:
              "Extension: multiple relaxation times and solid equilibrium stiffness",
            assumptions: [
              "The model remains linear and at small strain; parallel branches share the same strain.",
              "$E_\\infty\\ge0$, $E_j>0$, and $\\eta_j>0$; every Maxwell branch is initially relaxed.",
            ],
            steps: [
              {
                explanation:
                  "Add an equilibrium spring and connect several Maxwell branches in parallel. Parallel stresses add, rather than strains.",
                formula:
                  "\\sigma=E_\\infty\\varepsilon+\\sum_{j=1}^{m}\\sigma_j",
              },
              {
                explanation:
                  "Each branch obeys the state equation already derived, with its own modulus and relaxation time.",
                formula:
                  "\\dot\\sigma_j+\\frac{\\sigma_j}{\\tau_j}=E_j\\dot\\varepsilon,\\qquad\\tau_j=\\frac{\\eta_j}{E_j}",
              },
              {
                explanation:
                  "Apply the same strain step and add the branch exponentials to obtain the relaxation modulus. The equilibrium spring supplies the long-time stiffness.",
                formula:
                  "\\sigma(t)=\\varepsilon_0G(t),\\qquad G(t)=E_\\infty+\\sum_{j=1}^{m}E_j e^{-t/\\tau_j},\\qquad G(\\infty)=E_\\infty",
              },
              {
                explanation:
                  "Check dissipation next: every dashpot contributes nonnegative dissipation. Positive parameters have physical meaning and constrain admissible fits.",
                formula:
                  "D=\\sum_{j=1}^{m}\\sigma_j\\dot\\varepsilon_{v,j}=\\sum_{j=1}^{m}\\frac{\\sigma_j^2}{\\eta_j}\\ge0",
              },
            ],
            conclusion:
              "This extends a single time scale to a relaxation spectrum. It still does not automatically describe yield, damage, finite deformation, or friction; those mechanisms need additional state variables and evolution laws.",
          },
        ],
      },
    },
  },
  fem: {
    zh: {
      objectives: [
        "把杆的位移场、应变和应力联系起来，理解节点未知量代表什么。",
        "从弱形式得到两节点杆单元刚度，并说明装配和边界条件的作用。",
        "用解析解、反力和平衡检查有限元结果，而不只观察变形图。",
      ],
      sections: [
        {
          title: "用少量节点近似一个连续位移场",
          paragraphs: [
            "一根受拉细杆上的每个位置 $x$ 都有轴向位移 $u(x)$。在小应变条件下，$\\varepsilon=du/dx$；采用线弹性材料时，$\\sigma=E\\varepsilon$，轴力为 $N=A\\sigma$。没有分布载荷时，轴力沿杆保持不变。若左端固定、右端受拉力 $F$，均匀杆的解析解就是 $u(x)=Fx/(EA)$。有限元应当能在这个最简单的问题上重现答案。",
            "把杆划成若干单元，只把节点位移作为未知数。对长度 $L_e$ 的两节点单元，用直线插值 $u\\approx N_1u_1+N_2u_2$，其中 $N_1=1-x/L_e$、$N_2=x/L_e$（此处 $x$ 是单元局部坐标）。节点之间并非没有解，而是由形函数重建。线性插值使单元内应变为常数；真实解若有曲率，就需要更细网格或更高阶插值。",
          ],
          formula:
            "\\begin{aligned}u_h(x)&=N_1(x)u_1+N_2(x)u_2\\\\\\varepsilon_h&=\\frac{u_2-u_1}{L_e},\\qquad\\sigma_h=E\\varepsilon_h\\end{aligned}",
          symbols: [
            {
              symbol: "u_h",
              meaning: "有限维近似位移，单位 m；下标 $h$ 表示网格尺度。",
            },
            {
              symbol: "N_1,\\;N_2",
              meaning: "无量纲形函数；在自己的节点取 1，在另一节点取 0。",
            },
            {
              symbol: "E,\\;A,\\;L_e",
              meaning: "弹性模量 Pa、截面积 $\\mathrm m^2$、单元长度 m。",
            },
          ],
        },
        {
          title: "弱形式让局部单元可以装配",
          paragraphs: [
            "平衡方程可写成 $-(EAu^{\\prime})^{\\prime}=b$，其中 $b$ 是单位长度上的轴向载荷。乘上一个满足固定端条件的试函数 $v$ 并积分，再分部积分一次，二阶导数就变成了一阶导数的乘积。所得弱形式表达虚功平衡：内部虚功等于外力虚功。与强形式相比，它降低了近似位移所需的光滑性，使分段线性的位移也能使用。",
            "把形函数代入弱形式，均匀两节点杆单元得到 $\\mathbf k_e=\\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}$。相邻单元共享一个节点，其作用在这个节点上的力必须相加，因此局部刚度按节点编号累加成整体矩阵 $K$。这里没有重新发明另一套力学：装配正是在离散层面实施连接关系与节点力平衡。",
          ],
          formula:
            "\\begin{aligned}\\int_0^L EA\\,u^{\\prime}v^{\\prime}\\,dx&=Fv(L)+\\int_0^L bv\\,dx\\\\\\mathbf k_e&=\\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}\\\\\\mathbf K\\mathbf u&=\\mathbf f\\end{aligned}",
          symbols: [
            {
              symbol: "v",
              meaning: "虚位移/试函数，在固定端为零。",
            },
            {
              symbol: "b",
              meaning: "单位长度的轴向分布载荷，单位 N/m。",
            },
            {
              symbol: "\\mathbf K,\\;\\mathbf f",
              meaning: "整体刚度矩阵和节点力向量，单位分别为 N/m 和 N。",
            },
          ],
        },
        {
          title: "边界条件与验证决定解是否可信",
          paragraphs: [
            "一根没有固定的杆可以整体平移而不产生应变，因此原始刚度矩阵含有刚体运动，无法唯一确定所有位移。施加 $u(0)=0$ 后，可消去已知位移对应的自由度，再求解剩余线性方程。指定端部力是自然边界条件，进入载荷向量；指定端部位移是本质边界条件，约束未知量。两者不能随意互换。",
            "求得位移后，还要恢复应变、应力和支座反力。检查反力是否平衡外力、是否满足位移边界，再逐步细化网格比较关注量。均匀杆承受端部力时，真实位移是直线，所以线性单元可精确表示这一特例；这不意味着一个单元能精确解弯曲、应力集中或非均匀材料问题。本实验的三维杆形只是轴向一维模型的显示，变形经过放大。",
          ],
          formula:
            "\\begin{aligned}u(L)&=\\frac{FL}{EA},&\\sigma&=\\frac FA\\\\R_0&=-F\\end{aligned}",
          symbols: [
            {
              symbol: "R_0",
              meaning:
                "固定端轴向反力；正方向取向右时，拉伸端载 $F>0$ 对应 $R_0<0$。",
            },
            {
              symbol: "h",
              meaning: "单元特征长度；减小 $h$ 是网格收敛检查的一种方式。",
            },
          ],
        },
      ],
      workedExample: {
        title: "用两个单元算一根受拉杆",
        given:
          "$L=1\\,\\mathrm{m}$，$A=10^{-4}\\,\\mathrm{m}^2$，$E=100\\,\\mathrm{GPa}$，$F=50\\,\\mathrm{N}$。左端固定，划为两个长度为 $0.5\\,\\mathrm m$ 的单元。",
        steps: [
          "每个单元的刚度系数 $k_0=EA/L_e=2\\times10^7\\,\\mathrm{N/m}$。三个节点的整体矩阵为 $k_0\\begin{bmatrix}1&-1&0\\\\-1&2&-1\\\\0&-1&1\\end{bmatrix}$。",
          "令 $u_0=0$，剩余方程为 $2u_1-u_2=0$ 与 $-u_1+u_2=F/k_0=2.5\\times10^{-6}\\,\\mathrm{m}$。",
          "得到中点位移 $u_1=2.5\\,\\mu\\mathrm{m}$、端点位移 $u_2=5\\,\\mu\\mathrm{m}$。解析式 $FL/(EA)$ 也给出 $5\\,\\mu\\mathrm m$。",
          "两个单元的应变均为 $5\\times10^{-6}$，应力 $E\\varepsilon=0.5\\,\\mathrm{MPa}$，与 $F/A$ 一致；固定端反力为 $-50\\,\\mathrm N$。",
        ],
        result:
          "节点解、单元应力与整体力平衡相互一致。图中的明显拉伸是显示放大，实际端部位移仅为 $5\\,\\mu\\mathrm m$。",
      },
      pitfalls: [
        "把画面上的放大变形当作真实位移；应以数值读数和量纲为准。",
        "只增加单元数，却不检查载荷、边界条件、本构或收敛量。",
        "由均匀拉杆的精确结果推断一般应力场也能被线性单元精确表示。",
      ],
      question: {
        prompt:
          "均匀杆的截面积减半，其他条件保持不变。端部位移、应力和固定端反力分别如何变化？",
        answer:
          "$u(L)=FL/(EA)$ 和 $\\sigma=F/A$ 都增大一倍；外力仍为 $F$，反力仍为 $-F$。刚度变化影响变形，不会改变整体静力平衡所需的反力。",
      },
      diagram: {
        title: "从连续杆到整体方程",
        caption:
          "把均匀杆划为两个单元，共享中间节点。单元刚度在共享节点相加，固定左端后求剩余两个位移。图中长度与位移仅作示意。",
        labels: [
          "固定端 u₀=0",
          "节点 1",
          "节点 2",
          "单元 1",
          "单元 2",
          "端部拉力 F",
        ],
      },
      derivation: {
        title: "从一根弹性杆推到多维有限元",
        introduction:
          "先在一个单元上看清形函数、应变和能量的关系，再装配两个单元，最后把一维导数推广为多维应变算子。这样能看到矩阵的每一项来自哪条力学关系。",
        stages: [
          {
            level: "simple",
            title: "简单情形：一个两节点杆单元",
            assumptions: [
              "直杆、轴向位移、小应变、线弹性，$E$ 和 $A$ 在单元内为常数。",
              "局部坐标 $0\\le x\\le L_e$；先考虑无分布载荷的情形。",
            ],
            steps: [
              {
                explanation:
                  "要求插值在两个节点分别等于节点位移，即可得到两条线性形函数。",
                formula:
                  "u_h=N_1u_1+N_2u_2,\\qquad N_1=1-\\frac{x}{L_e},\\quad N_2=\\frac{x}{L_e}",
              },
              {
                explanation:
                  "对插值求导。应变是节点位移差除以长度，可写成应变矩阵与节点向量的乘积。",
                formula:
                  "\\varepsilon_h=\\frac{du_h}{dx}=\\mathbf B\\mathbf d_e,\\qquad\\mathbf B=\\begin{bmatrix}-1/L_e&1/L_e\\end{bmatrix},\\quad\\mathbf d_e=\\begin{bmatrix}u_1\\\\u_2\\end{bmatrix}",
              },
              {
                explanation:
                  "把应变代入弹性储能，再对节点位移求导得到内力。二次能量的系数正是单元刚度。",
                formula:
                  "\\begin{aligned}U_e&=\\frac12\\int_0^{L_e}EA(\\mathbf B\\mathbf d_e)^2\\,dx=\\frac12\\mathbf d_e^{T}\\mathbf k_e\\mathbf d_e\\\\\\mathbf k_e&=\\int_0^{L_e}\\mathbf B^TEA\\mathbf B\\,dx=\\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}\\end{aligned}",
              },
              {
                explanation:
                  "固定左端后，右端只剩一个自由度。对总势能取驻值，得到熟悉的杆伸长公式。",
                formula:
                  "u_1=0,\\qquad\\Pi(u_2)=\\frac12\\frac{EA}{L_e}u_2^2-Fu_2,\\qquad\\frac{d\\Pi}{du_2}=0\\Longrightarrow u_2=\\frac{FL_e}{EA}",
              },
            ],
            conclusion:
              "形函数不是装饰：它决定应变算子和刚度。这个单元对均匀端载杆精确，是因为真实位移恰好为线性函数。",
          },
          {
            level: "general",
            title: "复杂情形：装配、约束与分布载荷",
            assumptions: [
              "把长度 $L$ 的均匀杆划为两个等长单元，节点编号为 $0,1,2$。",
              "左端位移为零，右端力为 $F$；分布载荷 $b$ 的单位为力/长度。",
            ],
            steps: [
              {
                explanation:
                  "每个局部矩阵按相连的全局节点编号放入整体矩阵。中间节点同时接收两个单元的贡献。",
                formula:
                  "k_0=\\frac{EA}{L/2},\\qquad\\mathbf K=k_0\\begin{bmatrix}1&-1&0\\\\-1&2&-1\\\\0&-1&1\\end{bmatrix}",
              },
              {
                explanation:
                  "没有分布载荷时，先施加固定端约束，再解两个剩余方程。固定端反力在求解后从完整矩阵恢复。",
                formula:
                  "\\begin{aligned}u_0&=0,&k_0\\begin{bmatrix}2&-1\\\\-1&1\\end{bmatrix}\\begin{bmatrix}u_1\\\\u_2\\end{bmatrix}&=\\begin{bmatrix}0\\\\F\\end{bmatrix}\\\\u_1&=F/k_0,&u_2&=2F/k_0=FL/(EA),\\qquad R_0=-F\\end{aligned}",
              },
              {
                explanation:
                  "加入均匀分布载荷时，要求其虚功与节点等效载荷的虚功相同。积分形函数给出一致载荷向量，再按相同规则装配。",
                formula:
                  "\\mathbf f_e^{(b)}=\\int_0^{L_e}\\begin{bmatrix}N_1\\\\N_2\\end{bmatrix}b\\,dx=\\frac{bL_e}{2}\\begin{bmatrix}1\\\\1\\end{bmatrix}",
              },
              {
                explanation:
                  "对一般已知位移，不是简单删除方程就结束；已知自由度还会对未知自由度产生等效右端项。",
                formula:
                  "\\begin{bmatrix}\\mathbf K_{ff}&\\mathbf K_{fc}\\\\\\mathbf K_{cf}&\\mathbf K_{cc}\\end{bmatrix}\\begin{bmatrix}\\mathbf u_f\\\\\\mathbf u_c\\end{bmatrix}=\\begin{bmatrix}\\mathbf f_f\\\\\\mathbf f_c\\end{bmatrix}\\quad\\Longrightarrow\\quad\\mathbf K_{ff}\\mathbf u_f=\\mathbf f_f-\\mathbf K_{fc}\\mathbf u_c",
              },
            ],
            conclusion:
              "更复杂的网格没有改变力学，只增加了连接关系和未知量。始终检查固定端约束、载荷单位，以及支座反力与全部外载荷的平衡。",
          },
          {
            level: "extension",
            title: "扩展：多维弹性与非线性材料",
            assumptions: [
              "先保持小应变，在区域 $\\Omega$ 内使用位移向量与对称应变张量。",
              "位移边界上的试函数为零；给定牵引和体力满足所选单位体系。",
            ],
            steps: [
              {
                explanation:
                  "把杆的标量导数替换为对称梯度，并写出内外虚功相等的多维弱形式。这里 $\\mathbf b$ 是单位体积的力，$\\bar{\\mathbf t}$ 是单位面积的边界牵引。",
                formula:
                  "\\boldsymbol\\varepsilon(\\mathbf u)=\\tfrac12(\\nabla\\mathbf u+\\nabla\\mathbf u^T),\\qquad\\int_\\Omega\\boldsymbol\\varepsilon(\\mathbf v):\\boldsymbol\\sigma\\,dV=\\int_\\Omega\\mathbf v\\cdot\\mathbf b\\,dV+\\int_{\\Gamma_t}\\mathbf v\\cdot\\bar{\\mathbf t}\\,dS",
              },
              {
                explanation:
                  "插值位移向量后仍有应变矩阵。在线弹性情况下，原来的标量模量变为材料矩阵，面积积分变为体积分。",
                formula:
                  "\\mathbf u_h=\\mathbf N\\mathbf d_e,\\qquad\\boldsymbol\\varepsilon_h=\\mathbf B\\mathbf d_e,\\qquad\\mathbf k_e=\\int_{\\Omega_e}\\mathbf B^T\\mathbf C\\mathbf B\\,dV",
              },
              {
                explanation:
                  "非线性材料不能只解一次固定刚度方程。先形成力残差，再用材料一致切线线性化，迭代到平衡。此式仍假定小应变；有限变形还需要几何项。",
                formula:
                  "\\begin{aligned}\\mathbf R(\\mathbf d)&=\\mathbf f_{\\rm int}(\\mathbf d)-\\mathbf f_{\\rm ext},\\qquad\\mathbf f_{{\\rm int},e}=\\int_{\\Omega_e}\\mathbf B^T\\boldsymbol\\sigma\\,dV\\\\\\mathbf K_T&=\\int_\\Omega\\mathbf B^T\\mathbf C_{\\rm alg}\\mathbf B\\,dV,\\qquad\\mathbf K_T\\Delta\\mathbf d=-\\mathbf R,\\quad\\mathbf d^{(k+1)}=\\mathbf d^{(k)}+\\Delta\\mathbf d\\end{aligned}",
              },
            ],
            conclusion:
              "形函数、弱形式、装配和约束这条主线保持不变。扩展到多维或非线性后，积分精度、单元稳定性和本构更新需要各自验证。",
          },
        ],
      },
    },
    en: {
      objectives: [
        "Connect displacement, strain, and stress in a bar and understand what nodal unknowns represent.",
        "Obtain the two-node bar stiffness from a weak form and explain assembly and boundary conditions.",
        "Check finite element results using an analytical solution, reactions, and force balance.",
      ],
      sections: [
        {
          title: "Approximate a continuous field with a few nodal values",
          paragraphs: [
            "Every position $x$ along a slender bar has an axial displacement $u(x)$. At small strain, $\\varepsilon=du/dx$. A linear elastic material obeys $\\sigma=E\\varepsilon$, and the axial force is $N=A\\sigma$. With no distributed axial load, that force is constant along the bar. For a uniform bar fixed on the left and pulled by $F$ on the right, the analytical solution is $u(x)=Fx/(EA)$. A finite element model should reproduce this basic answer.",
            "Divide the bar into elements and retain only the nodal displacements as unknowns. In a two-node element of length $L_e$, interpolate with a straight line: $u\\approx N_1u_1+N_2u_2$, where $N_1=1-x/L_e$ and $N_2=x/L_e$ using the element's local coordinate. The solution between nodes is not missing; it is reconstructed by these shape functions. Linear interpolation produces constant strain within an element. A curved true solution requires a finer mesh or a higher-order approximation.",
          ],
          formula:
            "\\begin{aligned}u_h(x)&=N_1(x)u_1+N_2(x)u_2\\\\\\varepsilon_h&=\\frac{u_2-u_1}{L_e},\\qquad\\sigma_h=E\\varepsilon_h\\end{aligned}",
          symbols: [
            {
              symbol: "u_h",
              meaning:
                "Approximate displacement, in m; $h$ denotes the mesh scale.",
            },
            {
              symbol: "N_1,\\;N_2",
              meaning:
                "Dimensionless shape functions: one at their own node and zero at the other.",
            },
            {
              symbol: "E,\\;A,\\;L_e",
              meaning:
                "Elastic modulus in Pa, cross-sectional area in $\\mathrm m^2$, and element length in m.",
            },
          ],
        },
        {
          title: "The weak form connects local elements",
          paragraphs: [
            "Axial equilibrium can be written $-(EAu^{\\prime})^{\\prime}=b$, where $b$ is an axial load per unit length. Multiply by a test function $v$ that satisfies the fixed-end condition, integrate, and integrate by parts once. The second derivative is replaced by a product of first derivatives. This weak form expresses virtual work: internal virtual work equals external virtual work. It requires less smoothness than the strong differential equation, allowing piecewise-linear displacement fields.",
            "Substituting shape functions into the weak form gives $\\mathbf k_e=\\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}$ for a uniform two-node bar element. Adjacent elements share a node, so their force contributions at that node must be added. Local matrices are therefore accumulated into a global matrix $K$ using node numbering. Assembly is not a separate physical law: it enforces connectivity and nodal force balance in the discrete model.",
          ],
          formula:
            "\\begin{aligned}\\int_0^L EA\\,u^{\\prime}v^{\\prime}\\,dx&=Fv(L)+\\int_0^L bv\\,dx\\\\\\mathbf k_e&=\\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}\\\\\\mathbf K\\mathbf u&=\\mathbf f\\end{aligned}",
          symbols: [
            {
              symbol: "v",
              meaning:
                "Virtual displacement or test function, zero at the fixed end.",
            },
            {
              symbol: "b",
              meaning: "Distributed axial load per unit length, in N/m.",
            },
            {
              symbol: "\\mathbf K,\\;\\mathbf f",
              meaning:
                "Global stiffness matrix and nodal force vector, in N/m and N respectively.",
            },
          ],
        },
        {
          title: "Boundary conditions and verification make the answer useful",
          paragraphs: [
            "An unconstrained bar can translate as a rigid body without developing strain. Its original stiffness matrix therefore cannot determine a unique set of displacements. After imposing $u(0)=0$, eliminate the prescribed degree of freedom and solve for the remaining unknowns. A specified end force is a natural boundary condition and enters the load vector. A specified displacement is an essential boundary condition and constrains an unknown. They cannot be swapped casually.",
            "After solving for displacements, recover strains, stresses, and support reactions. Check that reactions balance applied forces and that prescribed displacements are satisfied, then refine the mesh and compare the quantity of interest. The displacement of a uniform bar under an end force is exactly linear, so linear elements represent this special case exactly. This does not imply exact solutions for bending, stress concentrations, or nonuniform materials. The three-dimensional bar view represents a one-dimensional axial model with exaggerated deformation.",
          ],
          formula:
            "\\begin{aligned}u(L)&=\\frac{FL}{EA},&\\sigma&=\\frac FA\\\\R_0&=-F\\end{aligned}",
          symbols: [
            {
              symbol: "R_0",
              meaning:
                "Axial support reaction; with rightward positive, a tensile end load $F>0$ gives $R_0<0$.",
            },
            {
              symbol: "h",
              meaning:
                "Characteristic element size; reducing $h$ is one way to examine mesh convergence.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Solve a tensile bar using two elements",
        given:
          "$L=1\\,\\mathrm{m}$, $A=10^{-4}\\,\\mathrm{m}^2$, $E=100\\,\\mathrm{GPa}$, and $F=50\\,\\mathrm{N}$. Fix the left end and use two elements, each $0.5\\,\\mathrm m$ long.",
        steps: [
          "The element stiffness coefficient is $k_0=EA/L_e=2\\times10^7\\,\\mathrm{N/m}$. The three-node global matrix is $k_0\\begin{bmatrix}1&-1&0\\\\-1&2&-1\\\\0&-1&1\\end{bmatrix}$.",
          "Set $u_0=0$. The remaining equations are $2u_1-u_2=0$ and $-u_1+u_2=F/k_0=2.5\\times10^{-6}\\,\\mathrm{m}$.",
          "The midpoint displacement is $u_1=2.5\\,\\mu\\mathrm{m}$ and the end displacement is $u_2=5\\,\\mu\\mathrm{m}$, matching $FL/(EA)$.",
          "Both elements have strain $5\\times10^{-6}$ and stress $E\\varepsilon=0.5\\,\\mathrm{MPa}$, consistent with $F/A$. The support reaction is $-50\\,\\mathrm N$.",
        ],
        result:
          "Nodal displacements, element stress, and global force balance agree. The visible elongation is magnified; the actual end displacement is only $5\\,\\mu\\mathrm m$.",
      },
      pitfalls: [
        "Reading an exaggerated deformation plot as a true displacement scale; use the numerical values and units.",
        "Adding elements without checking loads, boundary conditions, material laws, or a convergence quantity.",
        "Assuming that exactness for a uniform tensile bar implies exactness for arbitrary stress fields.",
      ],
      question: {
        prompt:
          "Halve the area of the uniform bar while keeping all other data fixed. What happens to the end displacement, stress, and support reaction?",
        answer:
          "Both $u(L)=FL/(EA)$ and $\\sigma=F/A$ double. The applied force is still $F$, so the reaction remains $-F$. A stiffness change affects deformation but does not change the reaction required by global static equilibrium.",
      },
      diagram: {
        title: "From a continuous bar to a global system",
        caption:
          "Two elements share a middle node. Their stiffness contributions add at that node; fixing the left end leaves two displacement unknowns. Lengths and displacements are schematic.",
        labels: [
          "Fixed: u₀=0",
          "Node 1",
          "Node 2",
          "Element 1",
          "Element 2",
          "End load F",
        ],
      },
      derivation: {
        title: "From an elastic bar to multidimensional finite elements",
        introduction:
          "First connect interpolation, strain, and energy within one element. Then assemble two elements and finally replace the one-dimensional derivative by a multidimensional strain operator. This reveals the mechanics behind each matrix entry.",
        stages: [
          {
            level: "simple",
            title: "Simple case: one two-node bar element",
            assumptions: [
              "A straight bar with axial displacement, small strain, and linear elasticity; $E$ and $A$ are constant in the element.",
              "Use a local coordinate $0\\le x\\le L_e$ and begin without distributed loading.",
            ],
            steps: [
              {
                explanation:
                  "Require the interpolated displacement to equal its nodal value at each endpoint. This determines the two linear shape functions.",
                formula:
                  "u_h=N_1u_1+N_2u_2,\\qquad N_1=1-\\frac{x}{L_e},\\quad N_2=\\frac{x}{L_e}",
              },
              {
                explanation:
                  "Differentiate the interpolation. Strain is displacement difference divided by length, written as a strain matrix times the nodal vector.",
                formula:
                  "\\varepsilon_h=\\frac{du_h}{dx}=\\mathbf B\\mathbf d_e,\\qquad\\mathbf B=\\begin{bmatrix}-1/L_e&1/L_e\\end{bmatrix},\\quad\\mathbf d_e=\\begin{bmatrix}u_1\\\\u_2\\end{bmatrix}",
              },
              {
                explanation:
                  "Insert strain into the elastic energy and differentiate with respect to nodal displacements to obtain internal force. The quadratic energy coefficient is the element stiffness.",
                formula:
                  "\\begin{aligned}U_e&=\\frac12\\int_0^{L_e}EA(\\mathbf B\\mathbf d_e)^2\\,dx=\\frac12\\mathbf d_e^{T}\\mathbf k_e\\mathbf d_e\\\\\\mathbf k_e&=\\int_0^{L_e}\\mathbf B^TEA\\mathbf B\\,dx=\\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}\\end{aligned}",
              },
              {
                explanation:
                  "Fixing the left end leaves one degree of freedom. Stationarity of total potential energy recovers the familiar bar-extension formula.",
                formula:
                  "u_1=0,\\qquad\\Pi(u_2)=\\frac12\\frac{EA}{L_e}u_2^2-Fu_2,\\qquad\\frac{d\\Pi}{du_2}=0\\Longrightarrow u_2=\\frac{FL_e}{EA}",
              },
            ],
            conclusion:
              "Shape functions determine the strain operator and stiffness. This element is exact for a uniform end-loaded bar because the true displacement is linear.",
          },
          {
            level: "general",
            title:
              "General case: assembly, constraints, and distributed loading",
            assumptions: [
              "Split a uniform bar of length $L$ into two equal elements with nodes numbered $0,1,2$.",
              "The left displacement is zero and the right-end force is $F$; distributed load $b$ is force per unit length.",
            ],
            steps: [
              {
                explanation:
                  "Place each local matrix at its connected global node indices. The middle node receives contributions from both elements.",
                formula:
                  "k_0=\\frac{EA}{L/2},\\qquad\\mathbf K=k_0\\begin{bmatrix}1&-1&0\\\\-1&2&-1\\\\0&-1&1\\end{bmatrix}",
              },
              {
                explanation:
                  "With no distributed load, impose the support constraint before solving the remaining two equations. Recover the support reaction afterward from the full system.",
                formula:
                  "\\begin{aligned}u_0&=0,&k_0\\begin{bmatrix}2&-1\\\\-1&1\\end{bmatrix}\\begin{bmatrix}u_1\\\\u_2\\end{bmatrix}&=\\begin{bmatrix}0\\\\F\\end{bmatrix}\\\\u_1&=F/k_0,&u_2&=2F/k_0=FL/(EA),\\qquad R_0=-F\\end{aligned}",
              },
              {
                explanation:
                  "For uniform distributed loading, equate distributed virtual work to equivalent nodal virtual work. Integrating the shape functions gives a consistent load vector, assembled using the same connectivity.",
                formula:
                  "\\mathbf f_e^{(b)}=\\int_0^{L_e}\\begin{bmatrix}N_1\\\\N_2\\end{bmatrix}b\\,dx=\\frac{bL_e}{2}\\begin{bmatrix}1\\\\1\\end{bmatrix}",
              },
              {
                explanation:
                  "For general prescribed displacements, deleting equations is not enough: known degrees of freedom also contribute a right-hand-side term to the unknown equations.",
                formula:
                  "\\begin{bmatrix}\\mathbf K_{ff}&\\mathbf K_{fc}\\\\\\mathbf K_{cf}&\\mathbf K_{cc}\\end{bmatrix}\\begin{bmatrix}\\mathbf u_f\\\\\\mathbf u_c\\end{bmatrix}=\\begin{bmatrix}\\mathbf f_f\\\\\\mathbf f_c\\end{bmatrix}\\quad\\Longrightarrow\\quad\\mathbf K_{ff}\\mathbf u_f=\\mathbf f_f-\\mathbf K_{fc}\\mathbf u_c",
              },
            ],
            conclusion:
              "A more complex mesh adds connectivity and unknowns without changing the mechanics. Always check constraints, load units, and equilibrium between reactions and all applied loads.",
          },
          {
            level: "extension",
            title:
              "Extension: multidimensional elasticity and nonlinear materials",
            assumptions: [
              "Initially retain small strain, with vector displacement and symmetric strain in a domain $\\Omega$.",
              "Test functions vanish on prescribed-displacement boundaries; tractions and body forces use consistent units.",
            ],
            steps: [
              {
                explanation:
                  "Replace the scalar bar derivative by the symmetric gradient and express equality of internal and external virtual work. Here $\\mathbf b$ is force per unit volume and $\\bar{\\mathbf t}$ is boundary traction per unit area.",
                formula:
                  "\\boldsymbol\\varepsilon(\\mathbf u)=\\tfrac12(\\nabla\\mathbf u+\\nabla\\mathbf u^T),\\qquad\\int_\\Omega\\boldsymbol\\varepsilon(\\mathbf v):\\boldsymbol\\sigma\\,dV=\\int_\\Omega\\mathbf v\\cdot\\mathbf b\\,dV+\\int_{\\Gamma_t}\\mathbf v\\cdot\\bar{\\mathbf t}\\,dS",
              },
              {
                explanation:
                  "Interpolating vector displacement still produces a strain matrix. In linear elasticity, the scalar modulus becomes a material matrix and the integral extends over volume.",
                formula:
                  "\\mathbf u_h=\\mathbf N\\mathbf d_e,\\qquad\\boldsymbol\\varepsilon_h=\\mathbf B\\mathbf d_e,\\qquad\\mathbf k_e=\\int_{\\Omega_e}\\mathbf B^T\\mathbf C\\mathbf B\\,dV",
              },
              {
                explanation:
                  "A nonlinear material cannot be handled by one fixed-stiffness solve. Form the force residual, linearize with a consistent material tangent, and iterate to equilibrium. This expression still assumes small strain; finite deformation adds geometric terms.",
                formula:
                  "\\begin{aligned}\\mathbf R(\\mathbf d)&=\\mathbf f_{\\rm int}(\\mathbf d)-\\mathbf f_{\\rm ext},\\qquad\\mathbf f_{{\\rm int},e}=\\int_{\\Omega_e}\\mathbf B^T\\boldsymbol\\sigma\\,dV\\\\\\mathbf K_T&=\\int_\\Omega\\mathbf B^T\\mathbf C_{\\rm alg}\\mathbf B\\,dV,\\qquad\\mathbf K_T\\Delta\\mathbf d=-\\mathbf R,\\quad\\mathbf d^{(k+1)}=\\mathbf d^{(k)}+\\Delta\\mathbf d\\end{aligned}",
              },
            ],
            conclusion:
              "Interpolation, weak form, assembly, and constraints remain the organizing ideas. Multidimensional and nonlinear extensions require additional checks of integration accuracy, element stability, and material updates.",
          },
        ],
      },
    },
  },
  fdm: {
    zh: {
      objectives: [
        "由热流与能量守恒理解热方程，再用邻点差值近似空间导数。",
        "推导二维显式五点格式，并理解稳定条件为什么限制时间步。",
        "区分初始条件和边界条件，判断温度极值与总热量应如何变化。",
      ],
      sections: [
        {
          title: "从热流走到网格上的二阶导数",
          paragraphs: [
            "傅里叶定律 $\\mathbf q=-k\\nabla T$ 表示热流从高温流向低温，其中 k 是热导率。把它代入无内热源的局部能量守恒 $\\rho c\\,\\partial_t T=-\\nabla\\cdot\\mathbf q$，在材料参数为常数时得到 $\\partial_t T=\\alpha\\nabla^2T$，$\\alpha=k/(\\rho c)$。这说明扩散率同时反映传热能力与储热能力；热导率和热扩散率不是同一个量。",
            "在间距为 $h$ 的规则网格上，分别对左右邻点作 Taylor 展开并相加，奇数阶项抵消，得到 $T_{xx}\\approx(T_{i+1}-2T_i+T_{i-1})/h^2$。对 $y$ 方向重复相同过程，就得到中心点及四个邻点组成的五点 Laplacian。对于足够光滑的解，这个空间近似具有 $\\mathcal O(h^2)$ 截断误差；网格只是在采样场，不是把材料切成互不交流的小块。",
          ],
          formula:
            "\\begin{aligned}\\alpha&=\\frac{k}{\\rho c}\\\\(\\nabla^2T)_{i,j}&\\approx\\frac{T_{i+1,j}+T_{i-1,j}+T_{i,j+1}+T_{i,j-1}-4T_{i,j}}{h^2}\\end{aligned}",
          symbols: [
            {
              symbol: "k",
              meaning: "热导率，单位 $\\mathrm W/(\\mathrm m\\,\\mathrm K)$。",
            },
            {
              symbol: "\\rho c",
              meaning:
                "体积热容量，单位 $\\mathrm J/(\\mathrm m^3\\,\\mathrm K)$。",
            },
            {
              symbol: "\\alpha",
              meaning: "热扩散率，单位 $\\mathrm m^2/\\mathrm s$。",
            },
            {
              symbol: "h",
              meaning: "相邻格点的空间距离，单位 m；这里两个方向间距相同。",
            },
          ],
        },
        {
          title: "稳定条件来自一次合理的局部平均",
          paragraphs: [
            "用前向 Euler 近似时间导数后，新温度等于旧温度加上扩散带来的增量。把式子重排，可看作中心旧值的权重为 $1-4r$，每个邻点的权重为 $r$，其中 $r=\\alpha\\Delta t/h^2$。当 $0\\le r\\le1/4$ 时，这些权重非负且总和为 1；新温度是局部旧温度的加权平均，因此不会凭空产生高于最大值或低于最小值的新极值。",
            "若时间步过大，中心权重变成负数，就可能产生过冲、振荡和发散。对这里的等距二维网格，显式稳定条件是 $\\Delta t\\le h^2/(4\\alpha)$。网格间距减半，稳定时间步上限要降为四分之一，而二维网格点数约增加四倍：模拟同样的物理时长通常需要约十六倍的更新工作。隐式格式可以放宽稳定性约束，但稳定并不代表时间离散足够准确。",
          ],
          formula:
            "\\begin{aligned}T_{i,j}^{n+1}&=(1-4r)T_{i,j}^n+r\\left(T_{i+1,j}^n+T_{i-1,j}^n+T_{i,j+1}^n+T_{i,j-1}^n\\right)\\\\r&=\\frac{\\alpha\\Delta t}{h^2}\\le\\frac14\\end{aligned}",
          symbols: [
            {
              symbol: "n",
              meaning: "时间层编号；$t_n=n\\Delta t$。",
            },
            {
              symbol: "r",
              meaning: "无量纲扩散数，控制一次时间更新的相对强度。",
            },
            {
              symbol: "\\Delta t",
              meaning:
                "时间步，单位 s；前向 Euler 的时间截断误差为 $\\mathcal O(\\Delta t)$。",
            },
          ],
        },
        {
          title: "边界是物理问题的一部分",
          paragraphs: [
            "初始条件规定 $t=0$ 时域内温度，例如一个局部高斯热斑。边界条件则持续规定边缘如何与外界交换热量。固定温度是 Dirichlet 条件；给定法向热流是 Neumann 条件，其中零热流对应绝热边界。初始热斑只提供一次初始能量，不能把它误称为持续加热源；持续热源需要在方程右端增加功率项。",
            "本例边界保持零超温，因此热量可以流出，总超温积分随时间下降；这里的零表示相对参考温度的零，不意味着绝对零度。若边界绝热或周期且没有热源，总热量应守恒。验证时先检查边界值、温度最大值和热量趋势，再分别减小 $h$ 与 $\\Delta t$ 比较结果。三维曲面的高度表示温度，不能把温度起伏解释为板材发生了几何弯曲。",
          ],
          formula:
            "\\begin{aligned}T(x,y,0)&=T_0(x,y),&T|_{\\partial\\Omega}&=0\\\\Q&=\\int_\\Omega\\rho cT\\,dA,&\\frac{dQ}{dt}&=-\\oint_{\\partial\\Omega}\\mathbf q\\cdot\\mathbf n\\,ds\\end{aligned}",
          symbols: [
            {
              symbol: "T_0",
              meaning: "初始温度/超温分布；与持续热源不同。",
            },
            {
              symbol: "\\mathbf n",
              meaning: "边界外法向单位向量；此处与时间层下标 n 无关。",
            },
            {
              symbol: "Q",
              meaning:
                "二维板单位厚度的超额热量，单位 $\\mathrm J/\\mathrm m$；无量纲例子显示对应的温度积分。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一个热节点的一步更新",
        given:
          "$\\alpha=10^{-5}\\,\\mathrm{m}^2/\\mathrm{s}$，$h=1\\,\\mathrm{mm}$，$\\Delta t=0.02\\,\\mathrm{s}$。某内部节点为 $80\\,{}^\\circ\\mathrm C$，四个邻点均为 $20\\,{}^\\circ\\mathrm C$，无热源。",
        steps: [
          "先换算单位：$h=10^{-3}\\,\\mathrm{m}$，因此 $h^2=10^{-6}\\,\\mathrm{m}^2$，$r=\\alpha\\Delta t/h^2=0.2$。",
          "稳定上限为 $\\Delta t\\le h^2/(4\\alpha)=0.025\\,\\mathrm{s}$；所选 0.02 s 满足条件。",
          "更新温度 $T^{n+1}=80+0.2(20+20+20+20-4\\times80)=32\\,{}^\\circ\\mathrm C$。",
          "若误用 $\\Delta t=0.03\\,\\mathrm{s}$，则 $r=0.3$，单步结果为 $8\\,{}^\\circ\\mathrm C$，低于所有原有邻点，已经违反应有的局部极值约束。",
        ],
        result:
          "稳定时间步给出 $32\\,{}^\\circ\\mathrm C$，处于旧温度的 $20\\text{–}80\\,{}^\\circ\\mathrm C$ 范围内。这个单步例子说明数值稳定条件具有直接的物理解释。",
      },
      pitfalls: [
        "混用 mm 和 m 计算扩散数；长度在公式中要平方，单位错误会被放大。",
        "认为热量在所有边界条件下都守恒；固定冷边界允许热量流出。",
        "把稳定当作精确，或把一次初始热斑当作持续热源；都需要单独检查。",
      ],
      question: {
        prompt:
          "保持材料和模拟总时长不变，把二维网格间距减半。显式稳定时间步上限如何变化？总更新工作量大约如何变化？",
        answer:
          "时间步上限随 $h^2$ 变化，因此降为四分之一。二维节点数约变为四倍，时间步数约变为四倍，总更新工作量约增为十六倍（不计边界和实现细节）。",
      },
      diagram: {
        title: "五点差分：中心格点与四个邻居",
        caption:
          "用东西南北四个邻点估计 Laplacian。显式推进从同一旧时间层读取所有数值，再统一写入新时间层；固定温度边界另行施加。",
        labels: [
          "中心 Tᵢⱼ",
          "东 Tᵢ₊₁,ⱼ",
          "西 Tᵢ₋₁,ⱼ",
          "北 Tᵢ,ⱼ₊₁",
          "南 Tᵢ,ⱼ₋₁",
          "网格间距 h",
        ],
      },
      derivation: {
        title: "从一维热流推到二维和隐式差分",
        introduction:
          "把连续守恒定律、空间近似和时间近似分开推导。这样可以明确：改变网格或时间格式时，究竟改动了哪一步，以及稳定性约束来自哪里。",
        stages: [
          {
            level: "simple",
            title: "简单情形：一维均匀材料的热扩散",
            assumptions: [
              "无内热源，$k$、$\\rho$、$c$ 为正常数；网格间距为 $h$。",
              "温度场足够光滑；所有节点均从同一个旧时间层更新。",
            ],
            steps: [
              {
                explanation:
                  "对一小段材料写能量守恒，净流入热流等于储热率。代入傅里叶定律，得到扩散方程。",
                formula:
                  "\\rho c\\,\\partial_t T=-\\partial_x q,\\qquad q=-k\\partial_xT\\quad\\Longrightarrow\\quad\\partial_tT=\\alpha\\partial_{xx}T,\\qquad\\alpha=\\frac{k}{\\rho c}",
              },
              {
                explanation:
                  "分别展开左右邻点。相加会消去奇数阶导数，使二阶导数可以用三个温度值近似。",
                formula:
                  "\\begin{aligned}T(x_i\\pm h)&=T_i\\pm hT_i^{\\prime}+\\frac{h^2}{2}T_i^{\\prime\\prime}\\pm\\frac{h^3}{6}T_i^{\\prime\\prime\\prime}+\\mathcal O(h^4)\\\\T_i^{\\prime\\prime}&=\\frac{T_{i+1}-2T_i+T_{i-1}}{h^2}+\\mathcal O(h^2)\\end{aligned}",
              },
              {
                explanation:
                  "再用前向差商近似时间导数。把更新写成权重形式，立即能看到何时会产生负权重。",
                formula:
                  "\\frac{T_i^{n+1}-T_i^n}{\\Delta t}=\\alpha\\frac{T_{i+1}^n-2T_i^n+T_{i-1}^n}{h^2}\\quad\\Longrightarrow\\quad T_i^{n+1}=(1-2r)T_i^n+rT_{i-1}^n+rT_{i+1}^n,\\quad r=\\frac{\\alpha\\Delta t}{h^2}",
              },
              {
                explanation:
                  "要使新值始终是旧值的非负加权平均，就要求中心权重非负。这给出一维显式格式的稳定步长界。",
                formula:
                  "0\\le r\\le\\frac12\\quad\\Longleftrightarrow\\quad\\Delta t\\le\\frac{h^2}{2\\alpha}",
              },
            ],
            conclusion:
              "这个格式对时间一阶、对空间二阶：截断误差为 $\\mathcal O(\\Delta t)+\\mathcal O(h^2)$。稳定性和收敛精度是不同检查。",
          },
          {
            level: "general",
            title: "复杂情形：二维网格与不同方向的扩散",
            assumptions: [
              "材料各向同性且参数恒定；允许 $\\Delta x\\ne\\Delta y$。",
              "边界值在各时间层按物理条件施加；以下更新用于内部节点。",
            ],
            steps: [
              {
                explanation:
                  "二维 Laplacian 是两个方向二阶导数之和。分别重复一维推导，两个方向贡献在中心点相加。",
                formula:
                  "(\\nabla^2T)_{i,j}\\approx\\frac{T_{i+1,j}-2T_{i,j}+T_{i-1,j}}{\\Delta x^2}+\\frac{T_{i,j+1}-2T_{i,j}+T_{i,j-1}}{\\Delta y^2}",
              },
              {
                explanation:
                  "定义两个扩散数后，中心权重因两个方向的传热而同时减少。",
                formula:
                  "\\begin{aligned}r_x&=\\frac{\\alpha\\Delta t}{\\Delta x^2},\\qquad r_y=\\frac{\\alpha\\Delta t}{\\Delta y^2}\\\\T_{i,j}^{n+1}&=(1-2r_x-2r_y)T_{i,j}^{n}+r_x(T_{i+1,j}^{n}+T_{i-1,j}^{n})+r_y(T_{i,j+1}^{n}+T_{i,j-1}^{n})\\end{aligned}",
              },
              {
                explanation:
                  "非负权重要求两个扩散数之和不超过一半。等距网格上两个数相同，因此二维允许步长只有一维的一半。",
                formula:
                  "r_x+r_y\\le\\frac12\\quad\\Longrightarrow\\quad\\Delta t\\le\\frac{1}{2\\alpha(\\Delta x^{-2}+\\Delta y^{-2})};\\qquad\\Delta x=\\Delta y=h:\\quad\\Delta t\\le\\frac{h^2}{4\\alpha}",
              },
              {
                explanation:
                  "还可以用一个 Fourier 模式检查：把模式代入更新式得到放大因子；所有波数的幅度不增长给出同一条件。这里的分析针对无限或周期均匀网格。",
                formula:
                  "T_{i,j}^n=\\widehat T^n e^{\\mathrm i(i\\theta_x+j\\theta_y)},\\qquad g=1-4r_x\\sin^2\\frac{\\theta_x}{2}-4r_y\\sin^2\\frac{\\theta_y}{2},\\qquad |g|\\le1",
              },
            ],
            conclusion:
              "五点格式不是新的物理定律，而是两个一维近似的叠加。网格各方向不等距时，不能继续机械套用单个 $r\\le1/4$。",
          },
          {
            level: "extension",
            title: "扩展：隐式时间推进与非均匀热导率",
            assumptions: [
              "先考虑恒定扩散率与固定温度、绝热或周期边界；$\\mathbf L_h$ 为离散 Laplacian。",
              "随后允许热导率随位置变化，并在面上定义热流；界面不含额外接触热阻。",
            ],
            steps: [
              {
                explanation:
                  "把扩散项改在新时间层计算，整理后每一步都需要求解线性方程。边界与热源贡献收集为已知向量。此处 $\\mathbf s$ 的单位是温度/时间。",
                formula:
                  "\\frac{\\mathbf T^{n+1}-\\mathbf T^n}{\\Delta t}=\\alpha\\mathbf L_h\\mathbf T^{n+1}+\\mathbf s^{n+1}\\quad\\Longrightarrow\\quad(\\mathbf I-\\alpha\\Delta t\\mathbf L_h)\\mathbf T^{n+1}=\\mathbf T^n+\\Delta t\\mathbf s^{n+1}",
              },
              {
                explanation:
                  "对离散扩散算子的一个非正特征值，后向 Euler 的放大因子总在零与一之间。因此此线性扩散问题不再需要显式稳定步长界，但大步长仍会损失时间精度。",
                formula:
                  "\\mathbf L_h\\mathbf w=\\lambda\\mathbf w,\\quad\\lambda\\le0\\quad\\Longrightarrow\\quad g_{\\rm BE}=\\frac{1}{1-\\alpha\\Delta t\\lambda},\\qquad0<g_{\\rm BE}\\le1",
              },
              {
                explanation:
                  "热导率不均匀时，应先离散面通量再取散度，保证相邻控制体交换同一份热量；直接把常数扩散率替换为节点值通常会漏掉一项。$Q_i$ 表示单位体积的产热功率，单位 $\\mathrm{W/m^3}$。",
                formula:
                  "\\begin{aligned}q_{i+1/2}&=-k_{i+1/2}\\frac{T_{i+1}-T_i}{h}\\\\(\\rho c)_i\\frac{dT_i}{dt}&=-\\frac{q_{i+1/2}-q_{i-1/2}}{h}+Q_i\\\\\\partial_x(k\\partial_xT)&=k\\partial_{xx}T+(\\partial_xk)(\\partial_xT)\\end{aligned}",
              },
              {
                explanation:
                  "若两个相邻节点之间各有半个网格长度属于一种均匀材料，把两段热阻串联可得到面热导率的调和平均。它来自通量连续，而不是任意选取的平均方式。",
                formula:
                  "\\frac{h}{k_{i+1/2}}=\\frac{h}{2k_i}+\\frac{h}{2k_{i+1}}\\quad\\Longrightarrow\\quad k_{i+1/2}=\\frac{2k_i k_{i+1}}{k_i+k_{i+1}}",
              },
            ],
            conclusion:
              "隐式推进改变求解过程；非均匀导热改变空间物理模型。两类扩展需要分别检查时间误差、界面通量和全局热平衡。",
          },
        ],
      },
    },
    en: {
      objectives: [
        "Connect heat flux and energy balance to the heat equation, then approximate spatial derivatives with neighboring values.",
        "Derive the explicit two-dimensional five-point scheme and understand its time-step restriction.",
        "Distinguish initial and boundary conditions and predict changes in temperature extrema and total heat.",
      ],
      sections: [
        {
          title: "From heat flux to a second derivative on a grid",
          paragraphs: [
            "Fourier's law $\\mathbf q=-k\\nabla T$ describes heat flowing from hotter to colder regions, with k the thermal conductivity. Substitution into local energy balance without an internal heat source, $\\rho c\\,\\partial_t T=-\\nabla\\cdot\\mathbf q$, gives $\\partial_t T=\\alpha\\nabla^2T$ for constant material properties, where $\\alpha=k/(\\rho c)$. Diffusivity therefore combines the ability to conduct heat with the ability to store it. Thermal conductivity and thermal diffusivity are different quantities.",
            "On a regular grid of spacing $h$, expand the left and right temperatures in Taylor series and add them. Odd-order terms cancel, giving $T_{xx}\\approx(T_{i+1}-2T_i+T_{i-1})/h^2$. Repeat in $y$ to obtain the five-point Laplacian: the center and its four immediate neighbors. For a sufficiently smooth solution, this spatial approximation has $\\mathcal O(h^2)$ truncation error. The grid samples a continuous field; it does not split the material into disconnected pieces.",
          ],
          formula:
            "\\begin{aligned}\\alpha&=\\frac{k}{\\rho c}\\\\(\\nabla^2T)_{i,j}&\\approx\\frac{T_{i+1,j}+T_{i-1,j}+T_{i,j+1}+T_{i,j-1}-4T_{i,j}}{h^2}\\end{aligned}",
          symbols: [
            {
              symbol: "k",
              meaning:
                "Thermal conductivity, in $\\mathrm W/(\\mathrm m\\,\\mathrm K)$.",
            },
            {
              symbol: "\\rho c",
              meaning:
                "Volumetric heat capacity, in $\\mathrm J/(\\mathrm m^3\\,\\mathrm K)$.",
            },
            {
              symbol: "\\alpha",
              meaning: "Thermal diffusivity, in $\\mathrm m^2/\\mathrm s$.",
            },
            {
              symbol: "h",
              meaning:
                "Distance between grid points, in m; equal spacing is used in both directions.",
            },
          ],
        },
        {
          title: "Stability follows from a sensible local average",
          paragraphs: [
            "Forward Euler approximates the time derivative, making the new temperature equal to the old temperature plus a diffusion increment. Rearrange the update and it becomes a weighted average: the center has weight $1-4r$ and each neighbor has weight $r$, with $r=\\alpha\\Delta t/h^2$. When $0\\le r\\le1/4$, all weights are nonnegative and sum to one. A new value therefore cannot create an extremum beyond the local old temperatures.",
            "If the time step is too large, the center weight becomes negative, allowing overshoot, oscillation, and divergence. For this equal-spaced two-dimensional grid, the explicit restriction is $\\Delta t\\le h^2/(4\\alpha)$. Halving the grid spacing reduces the allowable time step by four and increases the number of grid points by roughly four. Simulating the same physical duration then requires about sixteen times as many updates. Implicit methods can relax stability restrictions, but stability alone does not ensure accurate time integration.",
          ],
          formula:
            "\\begin{aligned}T_{i,j}^{n+1}&=(1-4r)T_{i,j}^n+r\\left(T_{i+1,j}^n+T_{i-1,j}^n+T_{i,j+1}^n+T_{i,j-1}^n\\right)\\\\r&=\\frac{\\alpha\\Delta t}{h^2}\\le\\frac14\\end{aligned}",
          symbols: [
            {
              symbol: "n",
              meaning: "Time-level index, with $t_n=n\\Delta t$.",
            },
            {
              symbol: "r",
              meaning:
                "Dimensionless diffusion number; sets the relative strength of one update.",
            },
            {
              symbol: "\\Delta t",
              meaning:
                "Time step, in s; forward Euler has $\\mathcal O(\\Delta t)$ temporal truncation error.",
            },
          ],
        },
        {
          title: "The boundary is part of the physical problem",
          paragraphs: [
            "The initial condition specifies temperature throughout the domain at $t=0$, such as a local Gaussian hot spot. Boundary conditions continuously prescribe how the edges exchange heat with their surroundings. A fixed temperature is a Dirichlet condition; a prescribed normal heat flux is a Neumann condition, with zero flux representing insulation. A hot spot supplies initial energy once. Continuous heating would require a source-power term in the equation.",
            "Here, the edges are held at zero excess temperature, so heat may leave and the integrated excess temperature decreases. Zero means the reference temperature, not absolute zero. With insulated or periodic boundaries and no sources, total heat should instead remain constant. Check boundary values, the maximum temperature, and the heat trend before separately refining $h$ and $\\Delta t$. Height in the three-dimensional temperature surface represents temperature, not geometric bending of a plate.",
          ],
          formula:
            "\\begin{aligned}T(x,y,0)&=T_0(x,y),&T|_{\\partial\\Omega}&=0\\\\Q&=\\int_\\Omega\\rho cT\\,dA,&\\frac{dQ}{dt}&=-\\oint_{\\partial\\Omega}\\mathbf q\\cdot\\mathbf n\\,ds\\end{aligned}",
          symbols: [
            {
              symbol: "T_0",
              meaning:
                "Initial temperature or excess-temperature field; distinct from a continuous heat source.",
            },
            {
              symbol: "\\mathbf n",
              meaning:
                "Outward unit normal at the boundary; distinct here from the time-level index.",
            },
            {
              symbol: "Q",
              meaning:
                "Excess heat per unit thickness, in $\\mathrm J/\\mathrm m$; the dimensionless example displays a corresponding temperature integral.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Advance one hot node by a single step",
        given:
          "Let $\\alpha=10^{-5}\\,\\mathrm{m}^2/\\mathrm{s}$, $h=1\\,\\mathrm{mm}$, and $\\Delta t=0.02\\,\\mathrm{s}$. An interior node is at $80\\,{}^\\circ\\mathrm C$ and its four neighbors are at $20\\,{}^\\circ\\mathrm C$, with no heat source.",
        steps: [
          "Convert units first: $h=10^{-3}\\,\\mathrm{m}$, so $h^2=10^{-6}\\,\\mathrm{m}^2$ and $r=\\alpha\\Delta t/h^2=0.2$.",
          "The stability limit is $\\Delta t\\le h^2/(4\\alpha)=0.025\\,\\mathrm{s}$. The selected 0.02 s satisfies it.",
          "Update $T^{n+1}=80+0.2(20+20+20+20-4\\times80)=32\\,{}^\\circ\\mathrm C$.",
          "If $\\Delta t$ were incorrectly increased to 0.03 s, $r$ would become 0.3 and the update would give $8\\,{}^\\circ\\mathrm C$, below every old neighbor and already violating the local extremum bound.",
        ],
        result:
          "The stable step produces $32\\,{}^\\circ\\mathrm C$, inside the old $20\\text{–}80\\,{}^\\circ\\mathrm C$ range. This single update gives the numerical stability condition a direct physical interpretation.",
      },
      pitfalls: [
        "Mixing mm and m when calculating the diffusion number; length is squared, magnifying unit mistakes.",
        "Expecting total heat to be conserved for every boundary condition; a fixed cold boundary allows heat to leave.",
        "Equating stability with accuracy, or an initial hot spot with ongoing heating; each requires a separate check.",
      ],
      question: {
        prompt:
          "Keep the material and total simulation duration fixed, but halve the two-dimensional grid spacing. How do the explicit time-step limit and approximate total work change?",
        answer:
          "The limit scales with $h^2$, so it becomes four times smaller. There are about four times as many grid points and four times as many time steps, giving roughly sixteen times the update work, excluding boundary and implementation overhead.",
      },
      diagram: {
        title: "The five-point stencil: one center and four neighbors",
        caption:
          "East, west, north, and south values approximate the Laplacian. An explicit step reads all values from the same old time level and writes the next time level together; fixed-temperature boundary values are imposed separately.",
        labels: [
          "Center Tᵢⱼ",
          "East Tᵢ₊₁,ⱼ",
          "West Tᵢ₋₁,ⱼ",
          "North Tᵢ,ⱼ₊₁",
          "South Tᵢ,ⱼ₋₁",
          "Grid spacing h",
        ],
      },
      derivation: {
        title:
          "From one-dimensional heat flow to two dimensions and implicit stepping",
        introduction:
          "Derive the conservation law, spatial approximation, and time approximation separately. This makes clear which step changes when the grid or time integrator changes, and where the stability restriction originates.",
        stages: [
          {
            level: "simple",
            title:
              "Simple case: diffusion in a uniform one-dimensional material",
            assumptions: [
              "No internal heat source; $k$, $\\rho$, and $c$ are positive constants, and grid spacing is $h$.",
              "The temperature field is sufficiently smooth; every node is updated from the same old time level.",
            ],
            steps: [
              {
                explanation:
                  "Write energy conservation for a small segment: net incoming flux equals the rate of stored heat. Substituting Fourier’s law gives diffusion.",
                formula:
                  "\\rho c\\,\\partial_t T=-\\partial_x q,\\qquad q=-k\\partial_xT\\quad\\Longrightarrow\\quad\\partial_tT=\\alpha\\partial_{xx}T,\\qquad\\alpha=\\frac{k}{\\rho c}",
              },
              {
                explanation:
                  "Expand the two neighboring values. Adding cancels the odd derivatives, allowing a three-temperature approximation to the second derivative.",
                formula:
                  "\\begin{aligned}T(x_i\\pm h)&=T_i\\pm hT_i^{\\prime}+\\frac{h^2}{2}T_i^{\\prime\\prime}\\pm\\frac{h^3}{6}T_i^{\\prime\\prime\\prime}+\\mathcal O(h^4)\\\\T_i^{\\prime\\prime}&=\\frac{T_{i+1}-2T_i+T_{i-1}}{h^2}+\\mathcal O(h^2)\\end{aligned}",
              },
              {
                explanation:
                  "Use a forward difference for the time derivative. Writing the update as weights reveals when negative weights appear.",
                formula:
                  "\\frac{T_i^{n+1}-T_i^n}{\\Delta t}=\\alpha\\frac{T_{i+1}^n-2T_i^n+T_{i-1}^n}{h^2}\\quad\\Longrightarrow\\quad T_i^{n+1}=(1-2r)T_i^n+rT_{i-1}^n+rT_{i+1}^n,\\quad r=\\frac{\\alpha\\Delta t}{h^2}",
              },
              {
                explanation:
                  "For the new value to remain a nonnegative weighted average, the center weight must be nonnegative. This yields the one-dimensional explicit time-step bound.",
                formula:
                  "0\\le r\\le\\frac12\\quad\\Longleftrightarrow\\quad\\Delta t\\le\\frac{h^2}{2\\alpha}",
              },
            ],
            conclusion:
              "The scheme is first order in time and second order in space, with truncation error $\\mathcal O(\\Delta t)+\\mathcal O(h^2)$. Stability and convergence accuracy are separate checks.",
          },
          {
            level: "general",
            title:
              "General case: a two-dimensional grid and directional contributions",
            assumptions: [
              "The material is isotropic with constant properties; unequal spacings $\\Delta x\\ne\\Delta y$ are allowed.",
              "Boundary values are imposed at each time level according to the physical conditions; the update below applies to interior nodes.",
            ],
            steps: [
              {
                explanation:
                  "The two-dimensional Laplacian is the sum of directional second derivatives. Repeat the one-dimensional derivation in each direction and add the contributions.",
                formula:
                  "(\\nabla^2T)_{i,j}\\approx\\frac{T_{i+1,j}-2T_{i,j}+T_{i-1,j}}{\\Delta x^2}+\\frac{T_{i,j+1}-2T_{i,j}+T_{i,j-1}}{\\Delta y^2}",
              },
              {
                explanation:
                  "After defining two diffusion numbers, the center weight decreases due to heat transfer in both directions.",
                formula:
                  "\\begin{aligned}r_x&=\\frac{\\alpha\\Delta t}{\\Delta x^2},\\qquad r_y=\\frac{\\alpha\\Delta t}{\\Delta y^2}\\\\T_{i,j}^{n+1}&=(1-2r_x-2r_y)T_{i,j}^{n}+r_x(T_{i+1,j}^{n}+T_{i-1,j}^{n})+r_y(T_{i,j+1}^{n}+T_{i,j-1}^{n})\\end{aligned}",
              },
              {
                explanation:
                  "Nonnegative weights require the two diffusion numbers to sum to at most one half. On an equal-spaced grid they are identical, making the two-dimensional bound half the one-dimensional one.",
                formula:
                  "r_x+r_y\\le\\frac12\\quad\\Longrightarrow\\quad\\Delta t\\le\\frac{1}{2\\alpha(\\Delta x^{-2}+\\Delta y^{-2})};\\qquad\\Delta x=\\Delta y=h:\\quad\\Delta t\\le\\frac{h^2}{4\\alpha}",
              },
              {
                explanation:
                  "A Fourier mode provides a second check. Substitution gives an amplification factor; requiring no growth for every wave number yields the same bound. This analysis assumes an infinite or periodic uniform grid.",
                formula:
                  "T_{i,j}^n=\\widehat T^n e^{\\mathrm i(i\\theta_x+j\\theta_y)},\\qquad g=1-4r_x\\sin^2\\frac{\\theta_x}{2}-4r_y\\sin^2\\frac{\\theta_y}{2},\\qquad |g|\\le1",
              },
            ],
            conclusion:
              "The five-point scheme combines two one-dimensional approximations rather than introducing a new physical law. With unequal spacings, do not apply a single $r\\le1/4$ mechanically.",
          },
          {
            level: "extension",
            title: "Extension: implicit stepping and nonuniform conductivity",
            assumptions: [
              "Begin with constant diffusivity and fixed-temperature, insulated, or periodic boundaries; $\\mathbf L_h$ denotes the discrete Laplacian.",
              "Then allow spatially varying conductivity and define flux at cell faces; interfaces have no additional contact resistance.",
            ],
            steps: [
              {
                explanation:
                  "Evaluate diffusion at the new time level. Rearrangement produces a linear system at every step, with boundary and source contributions collected into a known vector. Here $\\mathbf s$ has units of temperature per time.",
                formula:
                  "\\frac{\\mathbf T^{n+1}-\\mathbf T^n}{\\Delta t}=\\alpha\\mathbf L_h\\mathbf T^{n+1}+\\mathbf s^{n+1}\\quad\\Longrightarrow\\quad(\\mathbf I-\\alpha\\Delta t\\mathbf L_h)\\mathbf T^{n+1}=\\mathbf T^n+\\Delta t\\mathbf s^{n+1}",
              },
              {
                explanation:
                  "For a nonpositive diffusion eigenvalue, the backward-Euler amplification factor lies between zero and one. This linear diffusion problem therefore has no explicit stability time-step bound, although large steps still lose temporal accuracy.",
                formula:
                  "\\mathbf L_h\\mathbf w=\\lambda\\mathbf w,\\quad\\lambda\\le0\\quad\\Longrightarrow\\quad g_{\\rm BE}=\\frac{1}{1-\\alpha\\Delta t\\lambda},\\qquad0<g_{\\rm BE}\\le1",
              },
              {
                explanation:
                  "For nonuniform conductivity, discretize face fluxes before taking their divergence so neighboring control volumes exchange the same heat. Simply replacing constant diffusivity by a nodal value generally omits a term. $Q_i$ denotes heat generation per unit volume, in $\\mathrm{W/m^3}$.",
                formula:
                  "\\begin{aligned}q_{i+1/2}&=-k_{i+1/2}\\frac{T_{i+1}-T_i}{h}\\\\(\\rho c)_i\\frac{dT_i}{dt}&=-\\frac{q_{i+1/2}-q_{i-1/2}}{h}+Q_i\\\\\\partial_x(k\\partial_xT)&=k\\partial_{xx}T+(\\partial_xk)(\\partial_xT)\\end{aligned}",
              },
              {
                explanation:
                  "If each neighboring material occupies half the node-to-node interval, adding their thermal resistances in series gives a harmonic face conductivity. It follows from flux continuity, not an arbitrary averaging choice.",
                formula:
                  "\\frac{h}{k_{i+1/2}}=\\frac{h}{2k_i}+\\frac{h}{2k_{i+1}}\\quad\\Longrightarrow\\quad k_{i+1/2}=\\frac{2k_i k_{i+1}}{k_i+k_{i+1}}",
              },
            ],
            conclusion:
              "Implicit stepping changes the solution procedure; nonuniform conduction changes the spatial physical model. Check temporal error, interface fluxes, and global heat balance separately.",
          },
        ],
      },
    },
  },
};
