import type { Locale } from "../i18n";
import type { FoundationId, FoundationLesson } from "./foundations-types";

export const scaleFoundations = {
  "why-multiscale": {
    zh: {
      title: "为什么需要多尺度建模？",
      subtitle: "从一根金属杆的问题，追到原子之间的相互作用",
      lead: "一根金属杆的长度可以是厘米量级，屈服却与晶粒和位错有关，弹性与断键又来自电子成键。多尺度建模把这些描述有条件地连接起来：保留决定问题的机制，把其余细节压缩成可检验的参数和规律。",
      readMinutes: 18,
      objectives: [
        "从预测目标出发选择尺度，而不是先选择最复杂的软件。",
        "解释不同描述保留了什么、舍弃了什么，以及为什么需要闭合关系。",
        "从原子链的能量曲率推导宏观弹性，并指出这一推导的假设。",
      ],
      sections: [
        {
          id: "question-first",
          title: "1 · 先决定要回答什么问题",
          paragraphs: [
            "同一根金属杆可以提出不同问题：给定拉力，末端移动多少？为什么更换合金成分会改变屈服强度？裂纹尖端何时断键？第一个问题可能用线弹性有限元就能回答，后两个则需要把微观机制带进模型。尺度选择由目标量、工况和允许误差共同决定。",
            "多尺度不意味着每个问题都必须同时运行五种模型。若实验已经给出可靠的弹性模量，用它计算小变形位移通常足够；若要预测尚未制备的材料，或解释参数为什么随温度、成分改变，就需要向更小尺度追问。",
          ],
          bullets: [
            "先写目标量：位移、弹性模量、扩散时间、屈服应力，还是裂纹扩展速度。",
            "再写工况：温度、加载速率、成分、缺陷、边界条件和观察时间。",
            "最后选模型：需要哪些机制，现有参数在哪些工况下有证据支持。",
          ],
        },
        {
          id: "cost-and-time",
          title: "2 · 为什么不直接模拟所有电子和原子？",
          paragraphs: [
            String.raw`考虑边长 $L$、原子间距约 $a$ 的三维样品，原子数量量级随 $(L/a)^3$ 增长。若取 $L=1\,\mathrm{mm}$、$a=0.3\,\mathrm{nm}$，简单立方计数就达到约 $3.7\times10^{19}$ 个原子；真实晶格会改变几何因子，但不会改变这个量级困难。`,
            String.raw`经典分子动力学还必须解析最快的相关运动。若时间步为 $1\,\mathrm{fs}$，连续积分 $1\,\mathrm s$ 需要 $10^{15}$ 步。更精确的电子计算通常更昂贵；这些估算甚至尚未包含长程相互作用、存储和统计平均。更重要的是，原子轨迹不是应力—应变曲线，仍需要定义平均和观察量。`,
          ],
          equation: String.raw`N\sim\left(\frac La\right)^3,\qquad N_{\mathrm{steps}}=\frac{t_{\mathrm{obs}}}{\Delta t}`,
          equationNote:
            "这是数量级估算，不是某个软件的性能公式；时间步由所解析的动力学和稳定性决定，不能为了到达长时间而任意增大。",
        },
        {
          id: "representations",
          title: "3 · 换尺度，就是换一组描述变量",
          paragraphs: [
            "电子结构模型追踪波函数、电子密度或轨道占据；原子模型保留原子位置和速度；位错动力学保留线缺陷；相场把微结构表示成连续场；宏观力学使用应力、应变和内部状态。每次转换都压缩了信息，也必须说明被省略的自由度如何影响剩余变量。",
            "这就是闭合关系的作用。平衡方程要求内外力平衡，却不能决定钢和橡胶在同一应变下的应力；本构关系补上这个信息。原子运动方程需要势能函数，位错运动需要迁移率，晶粒演化需要自由能和界面动力学。它们都不是只靠守恒方程自动给出的。",
          ],
          table: {
            headers: ["描述", "保留的变量", "压缩进参数或假设的信息"],
            rows: [
              [
                "电子结构",
                "电子态、密度、原子核位置",
                "电子关联近似、核的处理方式",
              ],
              ["原子", "原子位置、速度或构型", "电子响应写入原子间相互作用"],
              ["介观", "位错线、离散事件与状态", "缺陷核心结构、稀有事件路径"],
              [
                "微结构",
                "序参量、晶粒取向、滑移状态",
                "界面内部细节、许多原子的集体行为",
              ],
              [
                "连续体",
                "应力、应变、温度与内部变量",
                "晶粒与缺陷作用写入本构规律",
              ],
            ],
          },
        },
        {
          id: "connections",
          title: "4 · 尺度之间具体传递什么？",
          paragraphs: [
            "顺序式连接先在小尺度求材料信息，再用于大尺度。例如电子结构给出扩散势垒，动力学 Monte Carlo 用势垒构造跳跃速率，长时间统计再给出扩散系数。传递的通常是参数、自由能、速率或响应规律，而不是把两张图简单叠在一起。",
            "并行耦合则让不同区域同时采用不同描述，例如裂尖附近用原子模型、远处用连续体。此时接口必须传递力、位移、能量和必要的热信息，并检查反射、重复计数和伪力。两种连接都需要明确单位、温度、参考态、边界条件及参数的适用范围。",
          ],
          table: {
            headers: ["连接", "常传递的量", "必须同时传递的条件"],
            rows: [
              [
                "电子结构 → 原子或事件",
                "能量、力、势垒",
                "构型覆盖、参考态、磁性与电荷状态",
              ],
              [
                "原子或位错 → 微结构",
                "界面能、迁移率、滑移规律",
                "温度、应力、取向、时间定义",
              ],
              [
                "微结构 → 连续体",
                "有效刚度、屈服与硬化关系",
                "组织统计、加载历史、代表体积和边界条件",
              ],
            ],
          },
        },
        {
          id: "separation-and-feedback",
          title: "5 · 什么时候可以平均，什么时候必须回到细节？",
          paragraphs: [
            String.raw`若微结构特征长度 $\ell$ 远小于宏观场变化长度 $L$，且选取的体积包含足够多的代表性结构，局部平均往往有效。时间上也需要被省略的变量足够快地松弛，或者把它们的慢演化显式保留为内部状态。$\ell/L\ll1$ 是有用的提示，并非自动保证正确的定理。`,
            "裂尖、局部剪切带、很小的晶粒、强烈非平衡过程可能破坏这种分离。此时可能需要更细模型、非局部或梯度理论、额外状态变量，或让不同尺度相互反馈。好的多尺度链条还应能被数据反向检查：如果宏观预测失败，要追查是哪一段传递关系或哪一项物理假设失效。",
          ],
          equation: String.raw`\underbrace{\text{目标量}}_{\text{需要预测什么}}\longrightarrow\underbrace{\text{关键机制}}_{\text{需要保留什么}}\longrightarrow\underbrace{\text{模型与验证}}_{\text{证据支持到哪里}}`,
        },
      ],
      derivation: {
        title: "从一个原子间弹簧，推到弹性本构",
        intro:
          "先取最简单的零温、一维、最近邻原子链。它不是实际三维金属模型，但能清楚展示微观能量如何成为宏观参数。",
        steps: [
          {
            title: "简单情形 · 平衡键长附近展开能量",
            explanation: String.raw`设每个键的势能为 $\phi(r)$，平衡键长为 $a$。在无初始应力的稳定平衡点，线性项为零，二阶导数给出键的等效弹簧常数。`,
            formula: String.raw`\phi(a+\Delta r)\approx\phi(a)+\frac12 k_b(\Delta r)^2,\qquad \phi'(a)=0,\quad k_b=\phi''(a)>0`,
            note: String.raw`$k_b$ 的单位是 $\mathrm{N/m}$；只有小位移下才可忽略高阶项。`,
          },
          {
            title: "连接尺度 · 用同一个应变描述整条链",
            explanation: String.raw`取 $N$ 个相同键、长度 $L=Na$、约定横截面积 $A$。均匀应变 $\varepsilon$ 使每个键伸长 $a\varepsilon$。将总能量除以体积，就得到应变能密度。`,
            formula: String.raw`\Delta U=\frac N2k_ba^2\varepsilon^2,\qquad W=\frac{\Delta U}{AL}=\frac12\frac{k_ba}{A}\varepsilon^2`,
            note: "一维链本身没有唯一的三维截面积；必须给定 A，才能定义具有 Pa 单位的模量。",
          },
          {
            title: "一般情形 · 从能量得到应力和刚度",
            explanation: String.raw`与连续体的弹性能密度比较，然后对应变求导。也可以把 $N$ 个弹簧串联，检查得到的整杆刚度是否一致。`,
            formula: String.raw`E=\frac{k_ba}{A},\qquad \sigma=\frac{\partial W}{\partial\varepsilon}=E\varepsilon,\qquad k_{\mathrm{rod}}=\frac{EA}{L}=\frac{k_b}{N}`,
            note: "这是微观参数到宏观规律的一次闭合；各向异性、横向收缩、缺陷和温度尚未包含。",
          },
          {
            title: "扩展 · 三维和有限温度需要新的条件",
            explanation:
              "三维小应变下，模量成为四阶刚度张量。等温平衡时应考察自由能密度，而不只是一个静态构型的势能；内部自由度是否允许松弛，也会改变得到的刚度。",
            formula: String.raw`\sigma_{ij}=\frac{\partial f}{\partial\varepsilon_{ij}},\qquad C^{T}_{ijkl}=\left.\frac{\partial^2f}{\partial\varepsilon_{ij}\partial\varepsilon_{kl}}\right|_{T},\qquad W\approx\frac12\varepsilon_{ij}C_{ijkl}\varepsilon_{kl}`,
            note: String.raw`这里采用应力自由参考态、平衡小应变及一致的剪切分量约定。$f$ 为单位参考体积的 Helmholtz 自由能；张量分量一般不能直接等同于单轴实验的 Young 模量。`,
          },
        ],
      },
      example: {
        title: "小尺度传来的模量，怎样变成一个位移？",
        problem: String.raw`假设可靠的均匀化或实验给出 $E=200\,\mathrm{GPa}$。一根均匀细杆长 $L=100\,\mathrm{mm}$，截面积 $A=10\,\mathrm{mm^2}$，承受轴向力 $F=1000\,\mathrm N$。忽略端部效应和自重，假设材料仍处于小应变弹性范围。`,
        solution: [
          String.raw`统一单位：$E=200000\,\mathrm{N/mm^2}$，应力 $\sigma=F/A=100\,\mathrm{MPa}$。`,
          String.raw`应变 $\varepsilon=\sigma/E=5\times10^{-4}$，伸长 $u=L\varepsilon=0.050\,\mathrm{mm}$。`,
          String.raw`整杆刚度 $k=EA/L=20000\,\mathrm{N/mm}$，因此也有 $u=F/k$。`,
          "若应力超过该材料在当前温度和速率下的弹性范围，准确的弹性模量也不能挽救纯弹性模型；需要进一步传递塑性或损伤规律。",
        ],
        result:
          "微观信息可以被压缩为一个对当前问题足够有效的参数。预测是否可靠，取决于参数和宏观模型是否都适用于这次加载。",
      },
      misconceptions: [
        {
          myth: "越小的尺度，答案一定越准确。",
          correction:
            "小尺度模型也有电子关联、势函数、边界条件和采样近似。它只是在不同的自由度上求解问题，并不自动拥有更小的总误差。",
        },
        {
          myth: "多尺度就是把所有方法都运行一遍。",
          correction:
            "只需连接影响目标量的机制；不必要的尺度会增加成本、待标定参数和误差传递路径。",
        },
        {
          myth: "平均一下就能得到宏观规律。",
          correction:
            "平均需要指定体积、时间、边界条件和加载方式，并检查代表性与尺度分离；局部化和记忆效应可能需要额外变量。",
        },
      ],
      questions: [
        {
          question:
            "已知可靠的弹性模量，只求一个低载荷支架的位移，是否必须先做 DFT？",
          answer:
            "通常不必。先检查弹性、小变形及几何边界条件是否适用；若目标变成预测新成分带来的模量变化，电子或原子模型才可能成为必要的上游环节。",
        },
        {
          question: "为什么裂纹尖端常常需要更细的描述？",
          answer:
            "场变化长度可能接近原子或微结构尺度，局部平均和局部本构假设可能失效；断键、塑性屏蔽和晶界作用等机制也可能直接控制扩展。",
        },
        {
          question: "从小尺度传递一个扩散势垒，除了数值还要传什么？",
          answer:
            "至少包括事件定义、初末态、温度与应力适用范围、参考态、速率前因子或其处理方式，以及不确定度。仅一个势垒数字不足以完整定义动力学。",
        },
      ],
      connections: [
        {
          method: "dft",
          reason: "看电子能量与原子受力如何成为材料建模的起点。",
        },
        { method: "md", reason: "看原子间相互作用如何转化为轨迹和统计量。" },
        {
          method: "constitutive",
          reason: "看被压缩的微观机制如何以材料状态和演化律出现。",
        },
        { method: "fem", reason: "用几何、载荷和本构关系求解最终的工程响应。" },
      ],
      references: [
        {
          label: "MIT OCW · Introduction to Modeling and Simulation",
          url: "https://ocw.mit.edu/courses/3-021j-introduction-to-modeling-and-simulation-spring-2012/",
          detail:
            "从量子、原子到连续体描述的开放课程；适合配合本章建立整体路线。",
        },
        {
          label: "LAMMPS · timestep",
          url: "https://docs.lammps.org/timestep.html",
          detail: "时间步的定义与单位；理解原子运动积分为何需要解析快速过程。",
        },
        {
          label: "NIST · PFHub",
          url: "https://pages.nist.gov/pfhub/",
          detail: "相场模型的基准问题与可复现比较，展示不同尺度上的验证实践。",
        },
      ],
    },
    en: {
      title: "Why do we need multiscale modeling?",
      subtitle:
        "Follow the behavior of a metal bar back to interactions between atoms",
      lead: "A bar may be centimeters long, yet yielding involves grains and dislocations, while elastic energy and bond breaking depend on electronic bonding. Multiscale modeling connects these descriptions under stated assumptions, retaining the mechanisms that determine the question and compressing other details into testable parameters and laws.",
      readMinutes: 18,
      objectives: [
        "Choose a scale from the prediction you need, rather than from the most elaborate software available.",
        "Explain which information each description retains or removes, and why closure relations are needed.",
        "Derive an elastic modulus from the curvature of an atomic-chain energy and identify the assumptions.",
      ],
      sections: [
        {
          id: "question-first",
          title: "1 · Start with the question",
          paragraphs: [
            "The same metal bar invites different questions: how far does its end move under a force? Why does changing its composition alter its yield strength? When does a bond break at a crack tip? Linear-elastic finite elements may answer the first question; the others require information about microscopic mechanisms. The observable, loading conditions, and acceptable error together determine the useful scale.",
            "Multiscale modeling does not require five models for every problem. A measured and validated modulus may be enough for a small-displacement calculation. Smaller-scale descriptions become useful when predicting an unmade material or explaining why a parameter changes with temperature or composition.",
          ],
          bullets: [
            "Name the observable: displacement, elastic modulus, diffusion time, yield stress, or crack-growth speed.",
            "Specify the conditions: temperature, loading rate, composition, defects, boundaries, and observation time.",
            "Then choose a model: which mechanisms matter, and where are its parameters supported by evidence?",
          ],
        },
        {
          id: "cost-and-time",
          title: "2 · Why not simulate every electron and atom?",
          paragraphs: [
            String.raw`For a three-dimensional specimen of size $L$ and atomic spacing $a$, atom count scales as $(L/a)^3$. Taking $L=1\,\mathrm{mm}$ and $a=0.3\,\mathrm{nm}$ gives about $3.7\times10^{19}$ atoms in a simple cubic estimate. A real crystal changes the geometric factor, not the scale of the difficulty.`,
            String.raw`Classical molecular dynamics must also resolve the fastest relevant motion. A $1\,\mathrm{fs}$ timestep requires $10^{15}$ steps to integrate $1\,\mathrm s$. Explicit electronic calculations are usually more expensive, and these estimates omit long-range interactions, storage, and statistical averaging. Even a complete trajectory still needs an averaging prescription to become a stress–strain curve.`,
          ],
          equation: String.raw`N\sim\left(\frac La\right)^3,\qquad N_{\mathrm{steps}}=\frac{t_{\mathrm{obs}}}{\Delta t}`,
          equationNote:
            "These are order-of-magnitude estimates, not software performance formulas. The dynamics and numerical stability constrain the timestep; it cannot be increased arbitrarily to reach longer times.",
        },
        {
          id: "representations",
          title: "3 · Changing scale means changing the variables",
          paragraphs: [
            "Electronic models describe wavefunctions, densities, or orbital occupations; atomic models keep positions and velocities; dislocation dynamics follows line defects; phase-field models describe microstructure through continuous fields; continuum mechanics uses stress, strain, and internal state. Each transition removes information and must account for how the omitted degrees of freedom affect what remains.",
            "Closure relations fill this gap. Force balance alone cannot say why steel and rubber develop different stresses at the same strain; a constitutive law supplies the missing information. Atomic equations of motion need an interaction energy, dislocations need a mobility law, and evolving grains need free energies and interface kinetics. Conservation laws alone do not supply these relations.",
          ],
          table: {
            headers: [
              "Description",
              "Retained variables",
              "Information placed in parameters or assumptions",
            ],
            rows: [
              [
                "Electronic",
                "Electronic states, density, nuclear positions",
                "Correlation approximations and treatment of nuclei",
              ],
              [
                "Atomic",
                "Atomic positions, velocities, or configurations",
                "Electronic response encoded in interatomic interactions",
              ],
              [
                "Mesoscopic",
                "Dislocation lines, discrete events and states",
                "Defect cores and rare-event pathways",
              ],
              [
                "Microstructural",
                "Order parameters, grain orientations, slip states",
                "Interface details and collective atomic behavior",
              ],
              [
                "Continuum",
                "Stress, strain, temperature, internal variables",
                "Grain and defect effects encoded in constitutive laws",
              ],
            ],
          },
        },
        {
          id: "connections",
          title: "4 · What actually passes between scales?",
          paragraphs: [
            "Sequential coupling first calculates small-scale information and then uses it in a larger-scale model. Electronic calculations can provide migration barriers, kinetic Monte Carlo can turn those barriers into jump rates, and long-time statistics can provide a diffusion coefficient. The transferred objects are parameters, free energies, rates, or response laws, rather than pictures placed beside each other.",
            "Concurrent coupling uses different descriptions in different regions at the same time, such as atoms near a crack tip and a continuum farther away. Interfaces must transfer forces, displacements, energy, and relevant thermal information while controlling reflection, double counting, and spurious forces. Either approach must state units, temperature, reference states, boundaries, and the range in which transferred parameters apply.",
          ],
          table: {
            headers: [
              "Connection",
              "Commonly transferred quantities",
              "Conditions that must accompany them",
            ],
            rows: [
              [
                "Electronic → atomic or event model",
                "Energies, forces, barriers",
                "Configuration coverage, reference states, magnetism, charge",
              ],
              [
                "Atomic or dislocation → microstructure",
                "Interface energies, mobilities, slip laws",
                "Temperature, stress, orientation, definition of time",
              ],
              [
                "Microstructure → continuum",
                "Effective stiffness, yield and hardening laws",
                "Structure statistics, loading history, representative volume, boundaries",
              ],
            ],
          },
        },
        {
          id: "separation-and-feedback",
          title: "5 · When can we average, and when do details matter?",
          paragraphs: [
            String.raw`Local averaging is often useful when the microstructural length $\ell$ is much smaller than the length $L$ over which macroscopic fields change, and the averaging volume contains representative structures. Omitted variables must also relax quickly enough, or their slow evolution must remain in internal-state variables. $\ell/L\ll1$ is a useful guide, not an automatic proof of validity.`,
            "Crack tips, shear bands, very small grains, and strong nonequilibrium behavior may destroy this separation. A finer model, a nonlocal or gradient theory, additional state variables, or feedback between scales may then be needed. Data should also test the chain in reverse: a failed macroscopic prediction is a reason to investigate both the transfer relations and the physical assumptions.",
          ],
          equation: String.raw`\underbrace{\text{Observable}}_{\text{What to predict}}\longrightarrow\underbrace{\text{Mechanisms}}_{\text{What to retain}}\longrightarrow\underbrace{\text{Model and validation}}_{\text{Where evidence applies}}`,
        },
      ],
      derivation: {
        title: "From an interatomic spring to an elastic constitutive law",
        intro:
          "Begin with a zero-temperature, one-dimensional, nearest-neighbor chain. It is not a quantitative model of a three-dimensional metal, but it makes the transfer from microscopic energy to a macroscopic parameter explicit.",
        steps: [
          {
            title: "Simple case · Expand near the equilibrium bond length",
            explanation: String.raw`Let the energy of a bond be $\phi(r)$ and its equilibrium length be $a$. At a stable, stress-free equilibrium, the linear term vanishes and the second derivative defines an effective bond spring constant.`,
            formula: String.raw`\phi(a+\Delta r)\approx\phi(a)+\frac12 k_b(\Delta r)^2,\qquad \phi'(a)=0,\quad k_b=\phi''(a)>0`,
            note: String.raw`$k_b$ has units of $\mathrm{N/m}$. Higher-order terms can be neglected only for small displacements.`,
          },
          {
            title: "Connect scales · Describe every bond with the same strain",
            explanation: String.raw`Take $N$ identical bonds, length $L=Na$, and an assigned cross-sectional area $A$. A uniform strain $\varepsilon$ extends each bond by $a\varepsilon$. Divide the total energy change by volume to obtain a strain-energy density.`,
            formula: String.raw`\Delta U=\frac N2k_ba^2\varepsilon^2,\qquad W=\frac{\Delta U}{AL}=\frac12\frac{k_ba}{A}\varepsilon^2`,
            note: "A one-dimensional chain has no unique three-dimensional area. Assigning A is necessary before defining a modulus in Pa.",
          },
          {
            title: "Generalize · Obtain stress and stiffness from energy",
            explanation: String.raw`Compare with continuum elastic energy and differentiate with respect to strain. As an independent check, put the $N$ bond springs in series and recover the same bar stiffness.`,
            formula: String.raw`E=\frac{k_ba}{A},\qquad \sigma=\frac{\partial W}{\partial\varepsilon}=E\varepsilon,\qquad k_{\mathrm{rod}}=\frac{EA}{L}=\frac{k_b}{N}`,
            note: "This is a closure from a microscopic parameter to a macroscopic law. Anisotropy, lateral contraction, defects, and temperature are still absent.",
          },
          {
            title: "Extend · Three dimensions and temperature add conditions",
            explanation:
              "In three-dimensional small-strain elasticity, the modulus becomes a fourth-order stiffness tensor. Isothermal equilibrium calls for free-energy density rather than the potential energy of one frozen configuration. Allowing internal degrees of freedom to relax can change the resulting stiffness.",
            formula: String.raw`\sigma_{ij}=\frac{\partial f}{\partial\varepsilon_{ij}},\qquad C^{T}_{ijkl}=\left.\frac{\partial^2f}{\partial\varepsilon_{ij}\partial\varepsilon_{kl}}\right|_{T},\qquad W\approx\frac12\varepsilon_{ij}C_{ijkl}\varepsilon_{kl}`,
            note: String.raw`Assume a stress-free reference state, equilibrated small strains, and consistent shear-component conventions. $f$ is Helmholtz free energy per reference volume. A tensor component is not generally the Young modulus measured in a uniaxial test.`,
          },
        ],
      },
      example: {
        title: "How does a transferred modulus become a displacement?",
        problem: String.raw`Suppose validated homogenization or measurement gives $E=200\,\mathrm{GPa}$. A uniform slender bar has length $L=100\,\mathrm{mm}$, area $A=10\,\mathrm{mm^2}$, and axial force $F=1000\,\mathrm N$. Ignore end effects and self-weight, and assume small-strain elasticity remains valid.`,
        solution: [
          String.raw`Use consistent units: $E=200000\,\mathrm{N/mm^2}$ and $\sigma=F/A=100\,\mathrm{MPa}$.`,
          String.raw`The strain is $\varepsilon=\sigma/E=5\times10^{-4}$ and extension is $u=L\varepsilon=0.050\,\mathrm{mm}$.`,
          String.raw`The bar stiffness is $k=EA/L=20000\,\mathrm{N/mm}$, giving the same result through $u=F/k$.`,
          "If this stress exceeds the elastic range at the relevant temperature and loading rate, an accurate elastic modulus cannot rescue a purely elastic model. Plasticity or damage information must also be transferred.",
        ],
        result:
          "Microscopic information can be compressed into a parameter sufficient for the current question. Reliability requires both that parameter and the macroscopic model to apply to the actual loading.",
      },
      misconceptions: [
        {
          myth: "A smaller scale always gives a more accurate answer.",
          correction:
            "Small-scale models still approximate electronic correlation, interactions, boundaries, and sampling. They solve for different degrees of freedom; they do not automatically have smaller total error.",
        },
        {
          myth: "Multiscale means running every available method.",
          correction:
            "Connect the mechanisms that affect the observable. Unnecessary scales add cost, parameters, and paths along which error can propagate.",
        },
        {
          myth: "Averaging alone produces the macroscopic law.",
          correction:
            "Specify volume, time, boundary conditions, and loading before averaging. Check representativeness and scale separation; localization and memory may require additional variables.",
        },
      ],
      questions: [
        {
          question:
            "You know a reliable modulus and need the displacement of a lightly loaded bracket. Must you first run DFT?",
          answer:
            "Usually not. First check elasticity, small deformation, geometry, and boundary conditions. Electronic or atomic calculations may become necessary if the question changes to predicting how a new composition changes the modulus.",
        },
        {
          question: "Why might a crack tip require a finer description?",
          answer:
            "The field-variation length can approach atomic or microstructural lengths, invalidating local averaging or local constitutive assumptions. Bond breaking, plastic shielding, and grain boundaries may directly control growth.",
        },
        {
          question:
            "What should accompany a migration barrier passed from a smaller-scale model?",
          answer:
            "The event definition, initial and final states, temperature and stress range, reference state, rate prefactor or its treatment, and uncertainty. A barrier value alone does not fully define a kinetic process.",
        },
      ],
      connections: [
        {
          method: "dft",
          reason:
            "See how electronic energies and atomic forces initiate a materials model.",
        },
        {
          method: "md",
          reason:
            "Turn interatomic interactions into trajectories and statistical observables.",
        },
        {
          method: "constitutive",
          reason:
            "Represent compressed microscopic mechanisms through state and evolution laws.",
        },
        {
          method: "fem",
          reason:
            "Combine geometry, loading, and constitutive behavior into an engineering response.",
        },
      ],
      references: [
        {
          label: "MIT OCW · Introduction to Modeling and Simulation",
          url: "https://ocw.mit.edu/courses/3-021j-introduction-to-modeling-and-simulation-spring-2012/",
          detail:
            "An open course connecting quantum, atomic, and continuum descriptions.",
        },
        {
          label: "LAMMPS · timestep",
          url: "https://docs.lammps.org/timestep.html",
          detail:
            "Timestep definitions and units; a starting point for understanding resolved atomic motion.",
        },
        {
          label: "NIST · PFHub",
          url: "https://pages.nist.gov/pfhub/",
          detail:
            "Phase-field benchmarks and reproducible comparisons illustrate validation at another scale.",
        },
      ],
    },
  },
  "scales-and-limits": {
    zh: {
      title: "每个尺度能解释什么，又遗漏什么？",
      subtitle: "方法的边界来自假设，不只是算力",
      lead: "长度—时间图是选方法的导航，不是硬性的适用区域。一个模型能回答哪些问题，由保留的自由度、相互作用、边界条件和采样方式决定。先识别这些条件，再讨论精度和计算成本。",
      readMinutes: 20,
      objectives: [
        "识别五个尺度、十一种方法各自最重要的近似与验证需求。",
        "区分数值收敛、统计采样充分和物理模型有效这三件事。",
        "解释为什么有限元不是本构关系、普通 Monte Carlo 步数不是物理时间。",
      ],
      sections: [
        {
          id: "electronic",
          title: "1 · 电子结构：成键从这里开始，近似也从这里开始",
          paragraphs: [
            "DFT 和 Hartree–Fock 可以研究电子分布、构型能量、成键与原子受力，但仍需指定核的位置、体系的电荷和自旋等。常见计算先采用 Born–Oppenheimer 思路，求给定核构型下的电子态；一张基态能量图并不自动包含核的热运动、电子激发或真实反应时间。",
            "基组、网格、超胞和布里渊区采样不充分会带来数值误差；交换关联泛函或单行列式近似则属于物理描述层面的限制。前者收敛，并不能证明后者适合强关联、磁性变化或断键过程。",
          ],
          table: {
            headers: ["方法", "擅长回答", "主要限制", "优先检查"],
            rows: [
              [
                "DFT",
                "给定结构的能量、力、密度与材料趋势",
                "交换关联近似；常见基态方法不直接给激发谱",
                "基组或截断能、k 点、超胞、磁态、泛函敏感性",
              ],
              [
                "Hartree–Fock",
                "平均场轨道与交换作用",
                "单行列式与电子关联缺失",
                "基组收敛、参考态稳定性、关联是否关键",
              ],
            ],
          },
        },
        {
          id: "atomistic",
          title: "2 · 原子尺度：看得到原子，不代表看到了所有物理",
          paragraphs: [
            "经典原子模型通常把电子响应压缩进势能函数。势函数在训练过的晶体附近表现好，不保证在断键、缺陷、极端温压或新成分下也可靠；固定键拓扑的模型更不能自动描述化学反应。经典核运动还可能遗漏重要的零点运动和隧穿。",
            "有限尺寸和周期边界会让缺陷与其镜像相互作用。短轨迹可能完全看不到稀有事件，长轨迹也可能被困在一个亚稳态。普通平衡 Monte Carlo 的步数是采样计数，其接受率和提议方式不能直接当作真实动力学。",
          ],
          table: {
            headers: ["方法", "擅长回答", "主要限制", "优先检查"],
            rows: [
              [
                "分子动力学",
                "轨迹、振动、输运和非平衡响应",
                "势函数适用范围、时间窗、经典核近似",
                "时间步、守恒量、尺寸、系综、相关时间",
              ],
              [
                "Monte Carlo",
                "给定统计系综的平衡分布",
                "混合慢；常规采样没有物理时钟",
                "详细平衡或平衡分布、平衡化、独立样本数",
              ],
            ],
          },
        },
        {
          id: "mesoscopic",
          title: "3 · 介观尺度：把快细节换成事件和运动规律",
          paragraphs: [
            "位错动力学把核心附近复杂的原子排布压缩为线缺陷、迁移率、反应规则和短程修正。弹性相互作用能有效传播较远处的作用，但位错成核、交滑移、攀移或结点反应仍需要额外模型，不能只靠一条线自动得出。",
            "动力学 Monte Carlo 用一套已知事件和速率推进随机时间。它可以跳过大量无事发生的振动，但前提是状态划分和 Markov 近似合理，并且关键事件没有漏掉。漏掉一个低势垒路径，会使长时间预测出现系统性偏差，即使事件选择算法完全正确。",
          ],
          table: {
            headers: ["方法", "擅长回答", "主要限制", "优先检查"],
            rows: [
              [
                "位错动力学",
                "位错运动、相互作用与部分塑性机制",
                "核心物理、成核、反应与迁移率模型",
                "线段分辨率、边界、反应规则、温度和应力范围",
              ],
              [
                "动力学 Monte Carlo",
                "已定义状态网络中的稀有事件动力学",
                "事件目录、速率和无记忆假设",
                "事件完整性、速率来源、时间统计、可逆过程的一致性",
              ],
            ],
          },
        },
        {
          id: "microstructure",
          title: "4 · 微结构尺度：空间平均需要代表性",
          paragraphs: [
            "相场把清晰或复杂的界面表示为有宽度的过渡区，用自由能和动力学描述形态演变。网格必须解析界面，但可解析不等于物理上已标定；人为加宽界面时，还要检查毛细和动力学效应是否按模型要求得到修正。",
            "晶体塑性把晶粒内许多位错的集体作用压缩成滑移、硬化与取向演化。结果依赖滑移系、参数、晶粒形貌和边界条件。很小的晶粒、晶界滑移或强应变梯度可能超出局部晶体塑性假设；增大晶粒数量也不能替代对代表性组织的检查。",
          ],
          table: {
            headers: ["方法", "擅长回答", "主要限制", "优先检查"],
            rows: [
              [
                "相场",
                "界面、相分离、晶粒与形态演化",
                "自由能和迁移率、界面宽度及守恒选择",
                "网格与时间步、界面参数、质量守恒或能量耗散",
              ],
              [
                "多晶／晶体塑性",
                "晶体滑移、织构与各向异性变形",
                "滑移硬化定律、组织统计、局部平均假设",
                "取向与晶粒代表性、边界条件、加载路径外验证",
              ],
            ],
          },
        },
        {
          id: "continuum",
          title: "5 · 连续体尺度：求解方程，与选择物理是两件事",
          paragraphs: [
            "连续体把物质表示为场。其适用性取决于相关长度和时间上的平均是否有效，而不是某个固定尺寸门槛。本构与状态演化律决定材料如何响应；有限元和有限差分则把选定的方程离散为可计算的问题。它们可以用于力学、传热等不同物理。",
            "网格细化主要减少离散误差，不能补上缺失的塑性、裂纹、非局部效应或错误边界条件。可信预测需要分别做数值验证（是否正确求解所选方程）、物理验证（这些方程在目标工况下是否足够），并独立检查参数与测量的不确定性。",
          ],
          table: {
            headers: ["方法", "擅长回答", "主要限制", "优先检查"],
            rows: [
              [
                "本构／速率与状态",
                "材料响应、记忆与内部状态演化",
                "遗漏机制、参数可识别性、工况外推",
                "量纲、耗散、标定与独立加载路径验证",
              ],
              [
                "有限元",
                "复杂几何上的弱形式边值问题",
                "所选物理、单元质量、锁死或局部化",
                "网格收敛、边界、残差、能量、解析基准",
              ],
              [
                "有限差分",
                "网格上的微分方程与场演化",
                "差分截断、稳定性、边界处理",
                "空间和时间收敛、稳定性条件、守恒与解析解",
              ],
            ],
          },
        },
      ],
      derivation: {
        title: "从网格收敛，走到物理验证",
        intro:
          "以一个目标量 y 为例，分开讨论方程求解误差、物理描述误差和测量误差，避免用一次漂亮的收敛曲线替代验证。",
        steps: [
          {
            title: "简单情形 · 把预测与测量的差拆开",
            explanation: String.raw`令 $y_h$ 为离散计算，$y_0$ 为选定模型及参数的精确解，$y_{\mathrm{phys}}$ 为目标物理量，$y_{\mathrm{obs}}$ 为测量值。加减中间量，就能看到哪些部分可以靠细化网格改善。`,
            formula: String.raw`y_h-y_{\mathrm{obs}}=\underbrace{(y_h-y_0)}_{\text{discretization}}+\underbrace{(y_0-y_{\mathrm{phys}})}_{\text{model and parameters}}+\underbrace{(y_{\mathrm{phys}}-y_{\mathrm{obs}})}_{\text{measurement}}`,
            note: "真实物理量通常不可直接知道；这个恒等式是区分来源的思考工具，不是凭一组数据就能唯一分配误差的方法。",
          },
          {
            title: "一般情形 · 用两个网格估计离散误差",
            explanation: String.raw`若进入渐近收敛区间，并且主导误差满足 $y_h=y_0+Ch^p+o(h^p)$，可消去未知的 $C$，得到 Richardson 外推。保持其他设置一致，并让迭代误差和时间误差足够小。`,
            formula: String.raw`y_0\approx y_{h/2}+\frac{y_{h/2}-y_h}{2^p-1},\qquad p>0`,
            note: "奇异性、网格质量、切换算法或尚未进入渐近区间时，预期阶数可能不适用。相近的两个数也可能只是误差偶然抵消。",
          },
          {
            title: "检查假设 · 用第三个网格观察阶数",
            explanation:
              "如果三个逐次减半的网格满足同一主导误差形式，其差值之比可估计实际阶数。应同时查看结果是否稳定、物理机制是否变化，而不是只报告一个 p。",
            formula: String.raw`p_{\mathrm{obs}}\approx\log_2\left|\frac{y_h-y_{h/2}}{y_{h/2}-y_{h/4}}\right|`,
            note: "差值接近舍入误差、随机噪声占主导或误差不具单项幂律时，这个估计会失去意义。",
          },
          {
            title: "扩展 · 随机采样需要另一种收敛检查",
            explanation: String.raw`在平稳、有限方差且相关衰减足够快的序列中，平均值的标准误差由有效样本数决定。保存了 $n$ 帧不代表得到 $n$ 个独立样本；还需要检查平衡化、相关时间和不同初态。`,
            formula: String.raw`\mathrm{SE}(\bar y)\approx\frac{s_y}{\sqrt{n_{\mathrm{eff}}}},\qquad n_{\mathrm{eff}}\approx\frac{n}{1+2\sum_{j\ge1}\rho_j}`,
            note: "相关和应通过可靠的截断或块平均估计。对某个亚稳态内部的均值收敛，并不能证明已经探索了整个平衡分布。",
          },
        ],
      },
      example: {
        title: "热方程算得越来越精确，为什么答案仍然偏高？",
        problem: String.raw`一维杆两端保持零温度，初温为 $T(x,0)=T_0\sin(\pi x/L)$，扩散率为常数 $\alpha$。计算模型把实际扩散率低估了 20%。考察时刻 $t=0.1L^2/\alpha_{\mathrm{true}}$ 的温度峰值。`,
        solution: [
          String.raw`解析解为 $T(x,t)=T_0e^{-\alpha\pi^2t/L^2}\sin(\pi x/L)$，峰值位于 $x=L/2$。`,
          String.raw`实际峰值与 $T_0$ 的比为 $e^{-0.1\pi^2}\approx0.373$。`,
          String.raw`模型采用 $\alpha_{\mathrm{model}}=0.8\alpha_{\mathrm{true}}$，收敛后给出 $e^{-0.08\pi^2}\approx0.454$。`,
          String.raw`模型／实际峰值之比为 $e^{0.02\pi^2}\approx1.218$，即仍偏高约 21.8%。`,
        ],
        result:
          "空间和时间网格收敛，只能逼近所选扩散率对应的方程解。消除这项偏差需要检查材料参数及物理假设，而不是无限细化网格。",
      },
      misconceptions: [
        {
          myth: "尺度图给出了每种方法不可逾越的长度和时间范围。",
          correction:
            "图中的范围是典型使用情形。算法、近似、问题维度、目标量和算力都会改变范围；方法假设比图上的边界更重要。",
        },
        {
          myth: "两种模拟给出相同答案，就证明答案正确。",
          correction:
            "它们可能共享相同的势函数、错误边界或缺失机制。互相比较有价值，但仍需要解析基准、独立数据及明确的适用范围。",
        },
        {
          myth: "有限元模型足够细，就会自然出现原子断键。",
          correction:
            "离散方式不会自动生成缺失的物理。断裂需要合适的本构、界面、损伤或断裂描述，并检查其长度尺度和能量一致性。",
        },
      ],
      questions: [
        {
          question:
            "一个有限元结果已经网格收敛，但高温下与实验相差很大，应优先检查什么？",
          answer:
            "检查高温下的本构、参数、热膨胀、蠕变等相关机制和实际边界条件，再评估实验与参数不确定性。网格收敛不能证明这些设定正确。",
        },
        {
          question: "为什么普通 Metropolis MC 的一万步不能直接换算成一微秒？",
          answer:
            "提议与接受规则为采样平衡分布而设计，通常不对应真实事件速率。kMC 只有在状态、事件及速率模型成立时才构造具有物理含义的随机时钟。",
        },
        {
          question: "相场界面横跨很多网格点，是否已经验证了界面动力学？",
          answer:
            "这支持空间分辨率足够，但还要检查自由能、迁移率、界面宽度处理和目标物理的标定。数值解析了一个模型，并不代表它与真实界面一致。",
        },
      ],
      connections: [
        { method: "hf", reason: "理解平均场、交换和缺失的电子关联。" },
        { method: "mc", reason: "区分平衡采样、相关时间和真实动力学。" },
        { method: "kmc", reason: "检查事件目录和速率如何决定长时间预测。" },
        {
          method: "phase-field",
          reason: "区分界面分辨率与界面模型的物理有效性。",
        },
        { method: "fdm", reason: "用扩散方程练习稳定性、收敛和解析验证。" },
      ],
      references: [
        {
          label: "MIT OCW · Introduction to Modeling and Simulation",
          url: "https://ocw.mit.edu/courses/3-021j-introduction-to-modeling-and-simulation-spring-2012/",
          detail: "不同描述的基本假设、用途和连接。",
        },
        {
          label: "LAMMPS · timestep",
          url: "https://docs.lammps.org/timestep.html",
          detail:
            "分子动力学时间步与单位的说明；可继续阅读对应积分器和系综文档。",
        },
        {
          label: "NIST · PFHub benchmarks",
          url: "https://pages.nist.gov/pfhub/",
          detail: "相场基准问题与数值比较，帮助区分实现验证和材料预测。",
        },
      ],
    },
    en: {
      title: "What does each scale explain, and what does it omit?",
      subtitle:
        "A method's boundaries come from its assumptions as well as its cost",
      lead: "A length–time map is a guide, not a set of hard operating limits. A model's useful questions are determined by its degrees of freedom, interactions, boundaries, and sampling. Identify those conditions before discussing accuracy or computational expense.",
      readMinutes: 20,
      objectives: [
        "Recognize the main approximations and validation needs of all eleven methods across five scales.",
        "Distinguish numerical convergence, adequate statistical sampling, and physical validity.",
        "Explain why finite elements are not a constitutive law and ordinary Monte Carlo steps are not physical time.",
      ],
      sections: [
        {
          id: "electronic",
          title:
            "1 · Electronic structure: bonding begins here, and so do approximations",
          paragraphs: [
            "DFT and Hartree–Fock address electronic distributions, configuration energies, bonding, and atomic forces, but still require nuclear positions and choices such as charge and spin. Common calculations first adopt a Born–Oppenheimer description and solve for electrons at a given nuclear configuration. A ground-state energy surface does not automatically contain thermal nuclear motion, electronic excitations, or a physical reaction clock.",
            "Incomplete bases, grids, supercells, and Brillouin-zone sampling create numerical errors. An exchange-correlation functional or a single-determinant approximation limits the physical description. Converging the former does not establish that the latter is suitable for strong correlation, changing magnetism, or bond breaking.",
          ],
          table: {
            headers: [
              "Method",
              "Useful questions",
              "Main limitations",
              "Check first",
            ],
            rows: [
              [
                "DFT",
                "Energies, forces, densities, and trends for specified structures",
                "Exchange-correlation approximation; common ground-state methods do not directly give excitation spectra",
                "Basis or cutoff, k points, supercell, magnetic states, functional sensitivity",
              ],
              [
                "Hartree–Fock",
                "Mean-field orbitals and exchange",
                "Single determinant and missing electron correlation",
                "Basis convergence, reference-state stability, importance of correlation",
              ],
            ],
          },
        },
        {
          id: "atomistic",
          title: "2 · Atomic scale: visible atoms do not mean complete physics",
          paragraphs: [
            "Classical atomic models usually compress electronic response into an interaction potential. Success near a training crystal does not guarantee accuracy for bond breaking, defects, extreme conditions, or a new composition. A fixed-topology force field cannot automatically describe chemical reactions. Classical nuclear motion may also omit important zero-point motion or tunneling.",
            "Finite sizes and periodic boundaries can make a defect interact with its images. Short trajectories may miss rare events entirely, while long ones can remain in a metastable basin. Ordinary equilibrium Monte Carlo steps count sampling attempts; proposal and acceptance rules do not generally define physical kinetics.",
          ],
          table: {
            headers: [
              "Method",
              "Useful questions",
              "Main limitations",
              "Check first",
            ],
            rows: [
              [
                "Molecular dynamics",
                "Trajectories, vibrations, transport, nonequilibrium response",
                "Interaction domain, accessible time, classical nuclei",
                "Timestep, conserved quantities, size, ensemble, correlation time",
              ],
              [
                "Monte Carlo",
                "Equilibrium distributions in a chosen ensemble",
                "Slow mixing; conventional sampling has no physical clock",
                "Balance or stationary distribution, equilibration, independent samples",
              ],
            ],
          },
        },
        {
          id: "mesoscopic",
          title:
            "3 · Mesoscopic scale: replace fast detail with events and motion laws",
          paragraphs: [
            "Dislocation dynamics compresses complex atomic core structures into line defects, mobilities, reaction rules, and short-range corrections. Elastic interactions efficiently describe more distant effects, but nucleation, cross-slip, climb, and junction reactions still need additional models. A line representation alone does not generate those mechanisms.",
            "Kinetic Monte Carlo advances a stochastic clock through a specified set of events and rates. It can skip uneventful vibrations if its states and Markov approximation are appropriate and the relevant events are present. Omitting a low-barrier path can systematically bias long-time predictions even when event selection is implemented perfectly.",
          ],
          table: {
            headers: [
              "Method",
              "Useful questions",
              "Main limitations",
              "Check first",
            ],
            rows: [
              [
                "Dislocation dynamics",
                "Line motion, interactions, selected plasticity mechanisms",
                "Core physics, nucleation, reactions, mobility laws",
                "Segment resolution, boundaries, reactions, temperature and stress range",
              ],
              [
                "Kinetic Monte Carlo",
                "Rare-event dynamics in a defined state network",
                "Event catalog, rates, memoryless approximation",
                "Missing events, rate sources, clock statistics, reversible-process consistency",
              ],
            ],
          },
        },
        {
          id: "microstructure",
          title:
            "4 · Microstructure: averaging needs a representative structure",
          paragraphs: [
            "Phase-field models replace sharp or complex interfaces with finite-width transitions and describe their motion through free energy and kinetics. A mesh must resolve the interface, but resolution is not physical calibration. Artificially widened interfaces also require checks that capillary and kinetic effects receive the corrections demanded by the model.",
            "Crystal plasticity compresses collective dislocation behavior into slip, hardening, and orientation evolution. Predictions depend on slip systems, parameters, grain geometry, and boundaries. Very small grains, grain-boundary sliding, or large strain gradients may exceed local crystal-plasticity assumptions. Adding grains does not replace checking whether the modeled microstructure is representative.",
          ],
          table: {
            headers: [
              "Method",
              "Useful questions",
              "Main limitations",
              "Check first",
            ],
            rows: [
              [
                "Phase field",
                "Interfaces, phase separation, grain and shape evolution",
                "Free energy, mobility, interface width, conservation choice",
                "Grid and timestep, interface parameters, mass conservation or dissipation",
              ],
              [
                "Polycrystal / crystal plasticity",
                "Crystal slip, texture, anisotropic deformation",
                "Slip and hardening laws, structure statistics, local averaging",
                "Representative grains and orientations, boundaries, independent loading paths",
              ],
            ],
          },
        },
        {
          id: "continuum",
          title:
            "5 · Continuum scale: choosing physics and solving equations are different tasks",
          paragraphs: [
            "A continuum represents matter through fields. Its validity depends on averaging at the relevant lengths and times, not a universal specimen-size threshold. Constitutive and state-evolution laws determine material response; finite elements and finite differences discretize the chosen equations. Either numerical method can address mechanics, heat transfer, or other physics.",
            "Mesh refinement mainly reduces discretization error. It cannot supply missing plasticity, cracks, nonlocal effects, or correct an inappropriate boundary condition. Reliable prediction separates numerical verification—solving the chosen equations correctly—from physical validation—testing whether those equations are adequate in the intended conditions—and examines parameter and measurement uncertainty.",
          ],
          table: {
            headers: [
              "Method",
              "Useful questions",
              "Main limitations",
              "Check first",
            ],
            rows: [
              [
                "Constitutive / rate and state",
                "Response, memory, internal-state evolution",
                "Missing mechanisms, identifiable parameters, extrapolation",
                "Units, dissipation, calibration, independent loading paths",
              ],
              [
                "Finite elements",
                "Weak-form boundary-value problems in complex geometry",
                "Chosen physics, element quality, locking or localization",
                "Mesh convergence, boundaries, residuals, energy, analytic benchmarks",
              ],
              [
                "Finite differences",
                "Grid-based differential equations and field evolution",
                "Truncation, stability, boundary treatment",
                "Space and time convergence, stability limits, conservation, analytic solutions",
              ],
            ],
          },
        },
      ],
      derivation: {
        title: "From mesh convergence to physical validation",
        intro:
          "Use one observable y to separate equation-solving error, physical-description error, and measurement error. A convincing convergence curve cannot do all three jobs.",
        steps: [
          {
            title:
              "Simple case · Split the difference between prediction and measurement",
            explanation: String.raw`Let $y_h$ be the discrete computation, $y_0$ the exact solution of the chosen model and parameters, $y_{\mathrm{phys}}$ the physical target, and $y_{\mathrm{obs}}$ its measurement. Adding and subtracting intermediate values reveals which part mesh refinement can improve.`,
            formula: String.raw`y_h-y_{\mathrm{obs}}=\underbrace{(y_h-y_0)}_{\text{discretization}}+\underbrace{(y_0-y_{\mathrm{phys}})}_{\text{model and parameters}}+\underbrace{(y_{\mathrm{phys}}-y_{\mathrm{obs}})}_{\text{measurement}}`,
            note: "The physical target is usually not known exactly. This identity distinguishes sources; one dataset cannot generally identify every term uniquely.",
          },
          {
            title: "Generalize · Estimate discretization error with two meshes",
            explanation: String.raw`Within an asymptotic convergence regime, suppose $y_h=y_0+Ch^p+o(h^p)$. Eliminate the unknown $C$ to obtain Richardson extrapolation. Keep other settings consistent and make iteration and time-integration errors sufficiently small.`,
            formula: String.raw`y_0\approx y_{h/2}+\frac{y_{h/2}-y_h}{2^p-1},\qquad p>0`,
            note: "Singularities, mesh quality, changing algorithms, or a non-asymptotic regime can invalidate the assumed order. Similar values on two meshes may also reflect cancellation.",
          },
          {
            title: "Test the assumption · Observe the order with a third mesh",
            explanation:
              "If three successive mesh halvings share the same leading error form, their differences estimate the observed order. Also examine stability and changes in physical behavior instead of reporting p alone.",
            formula: String.raw`p_{\mathrm{obs}}\approx\log_2\left|\frac{y_h-y_{h/2}}{y_{h/2}-y_{h/4}}\right|`,
            note: "This estimate is uninformative when differences approach roundoff, random noise dominates, or the error does not follow a single leading power.",
          },
          {
            title:
              "Extend · Random sampling requires a different convergence check",
            explanation: String.raw`For a stationary finite-variance sequence with sufficiently decaying correlations, the standard error of the mean depends on an effective sample count. Saving $n$ frames does not produce $n$ independent samples. Equilibration, correlation times, and multiple initial conditions still need attention.`,
            formula: String.raw`\mathrm{SE}(\bar y)\approx\frac{s_y}{\sqrt{n_{\mathrm{eff}}}},\qquad n_{\mathrm{eff}}\approx\frac{n}{1+2\sum_{j\ge1}\rho_j}`,
            note: "Estimate the correlation sum through a justified truncation or block-averaging procedure. A converged mean inside one metastable basin does not establish exploration of the full equilibrium distribution.",
          },
        ],
      },
      example: {
        title: "Why can an increasingly precise heat solver remain wrong?",
        problem: String.raw`A one-dimensional bar has zero temperature at both ends, initial temperature $T(x,0)=T_0\sin(\pi x/L)$, and constant diffusivity $\alpha$. The model underestimates the actual diffusivity by 20%. Compare the peak temperature at $t=0.1L^2/\alpha_{\mathrm{true}}$.`,
        solution: [
          String.raw`The analytic solution is $T(x,t)=T_0e^{-\alpha\pi^2t/L^2}\sin(\pi x/L)$, with its peak at $x=L/2$.`,
          String.raw`The true peak divided by $T_0$ is $e^{-0.1\pi^2}\approx0.373$.`,
          String.raw`The model uses $\alpha_{\mathrm{model}}=0.8\alpha_{\mathrm{true}}$, so its converged prediction is $e^{-0.08\pi^2}\approx0.454$.`,
          String.raw`The predicted-to-true peak ratio is $e^{0.02\pi^2}\approx1.218$, still about 21.8% too high.`,
        ],
        result:
          "Converging space and time resolution approaches the equation solution for the selected diffusivity. Removing this bias requires checking parameters and physical assumptions, not endlessly refining the mesh.",
      },
      misconceptions: [
        {
          myth: "The scale map gives absolute length and time limits for every method.",
          correction:
            "It shows typical applications. Algorithms, approximations, dimensionality, observables, and resources change those ranges. Physical assumptions matter more than a drawn boundary.",
        },
        {
          myth: "Agreement between two simulations proves the answer is correct.",
          correction:
            "They may share an interaction model, wrong boundary, or missing mechanism. Cross-comparison is valuable alongside analytic benchmarks, independent data, and a stated domain of validity.",
        },
        {
          myth: "A fine enough finite-element mesh naturally produces atomic bond breaking.",
          correction:
            "Discretization cannot generate absent physics. Fracture needs an appropriate constitutive, interface, damage, or fracture description with checked length scales and energy consistency.",
        },
      ],
      questions: [
        {
          question:
            "A finite-element prediction is mesh-converged but disagrees badly with a high-temperature test. What should you inspect?",
          answer:
            "Check high-temperature constitutive behavior, parameters, relevant expansion or creep mechanisms, and actual boundaries, then assess experimental and parameter uncertainty. Mesh convergence does not establish these choices.",
        },
        {
          question:
            "Why can ten thousand ordinary Metropolis steps not simply become one microsecond?",
          answer:
            "The proposal and acceptance rules usually target an equilibrium distribution rather than physical event rates. Kinetic Monte Carlo constructs a meaningful stochastic clock only when its state, event, and rate models apply.",
        },
        {
          question:
            "A phase-field interface spans many grid points. Have its physical kinetics been validated?",
          answer:
            "That supports spatial resolution, but free energy, mobility, interface-width treatment, and physical calibration still need checking. Resolving a model does not prove it matches an actual interface.",
        },
      ],
      connections: [
        {
          method: "hf",
          reason:
            "Understand mean fields, exchange, and missing electronic correlation.",
        },
        {
          method: "mc",
          reason:
            "Separate equilibrium sampling, correlation time, and physical kinetics.",
        },
        {
          method: "kmc",
          reason:
            "See how the event catalog and rates control long-time predictions.",
        },
        {
          method: "phase-field",
          reason: "Distinguish interface resolution from physical validity.",
        },
        {
          method: "fdm",
          reason:
            "Practice stability, convergence, and analytic verification with diffusion.",
        },
      ],
      references: [
        {
          label: "MIT OCW · Introduction to Modeling and Simulation",
          url: "https://ocw.mit.edu/courses/3-021j-introduction-to-modeling-and-simulation-spring-2012/",
          detail:
            "Assumptions, applications, and connections between model descriptions.",
        },
        {
          label: "LAMMPS · timestep",
          url: "https://docs.lammps.org/timestep.html",
          detail:
            "Molecular-dynamics timestep and unit definitions; read alongside the chosen integrator and ensemble documentation.",
        },
        {
          label: "NIST · PFHub benchmarks",
          url: "https://pages.nist.gov/pfhub/",
          detail:
            "Phase-field benchmarks and numerical comparisons help separate implementation verification from materials prediction.",
        },
      ],
    },
  },
  "error-propagation": {
    zh: {
      title: "误差怎样跨越尺度？",
      subtitle: "从一个不确定的模量，到相关性、非线性和模型偏差",
      lead: "上游参数进入下游模型后，影响可能被放大、减弱或部分抵消。判断它们如何传递，需要同时知道响应的敏感性、参数之间的相关性，以及链条中遗漏了哪些物理。一个误差条不能代替这些问题。",
      readMinutes: 22,
      objectives: [
        "区分数值误差、统计采样、参数不确定性、模型偏差和尺度传递误差。",
        "用导数和协方差传播局部不确定度，识别共享输入产生的相关性。",
        "解释指数速率为何会放大势垒偏差，以及何时应使用非线性传播。",
      ],
      sections: [
        {
          id: "sources",
          title: "1 · 先问误差来自哪里",
          paragraphs: [
            "误差是预测与目标之间的差，通常无法完全知道；不确定度则描述我们对某个量有多大把握。标准差不自动等于实际误差，重复计算的一致性也不能排除共同的系统偏差。报告结果时应说明误差条覆盖哪些来源。",
            "多尺度链条还会引入传递误差，例如把非均匀组织换成一个平均模量、把具有记忆的过程换成无记忆速率，或把一种边界条件下的参数用于另一种加载。这些假设需要单独验证，不能全部混进‘数值噪声’。",
          ],
          table: {
            headers: ["来源", "例子", "如何检查或减少"],
            rows: [
              [
                "离散与求解误差",
                "有限基组、网格、时间步、迭代容差",
                "收敛研究、解析解、残差与守恒检查",
              ],
              [
                "统计采样",
                "有限轨迹、相关样本、稀有事件未充分采样",
                "有效样本数、独立重复、块平均、混合检查",
              ],
              [
                "参数不确定性",
                "模量、势垒、迁移率和边界载荷不确定",
                "实验或标定分布、协方差、敏感性分析",
              ],
              [
                "模型偏差",
                "遗漏电子关联、塑性或温度依赖",
                "独立物理数据、替代模型、适用范围检查",
              ],
              [
                "尺度传递",
                "平均方式、代表体积、闭合及接口近似",
                "改变传递条件、回算与跨尺度对照",
              ],
            ],
          },
        },
        {
          id: "sensitivity",
          title: "2 · 导数告诉我们哪里会放大误差",
          paragraphs: [
            String.raw`设下游目标量为 $y=f(x)$。在参考值附近做 Taylor 展开，导数 $f'(x)$ 把输入的微小变化转成输出变化。多个参数对应一组偏导数，即 Jacobian。敏感性大，表示相同输入变化会产生更大响应；它不意味着这个输入一定最值得改进，还要看该输入本来有多不确定。`,
            String.raw`例如固定力 $F$、长度 $L$ 和面积 $A$ 时，杆的位移 $u=FL/(EA)$ 与弹性模量 $E$ 成反比。局部相对变化满足 $\Delta u/u\approx-\Delta E/E$。因此模量高估会让位移低估；但变化很大时应使用完整的反比关系，而不是无限外推直线。`,
          ],
          equation: String.raw`\Delta\mathbf y\approx J\Delta\mathbf x,\qquad J_{ij}=\left.\frac{\partial f_i}{\partial x_j}\right|_{\mathbf x_0}`,
          equationNote:
            "一阶传播是在给定参考值附近的局部近似；导数的单位取决于输入与输出，比较敏感性时可使用无量纲相对导数。",
        },
        {
          id: "correlations",
          title: "3 · 共享输入会让误差相关",
          paragraphs: [
            String.raw`如果同一个 $E$ 同时用于刚度 $k=EA/L$ 和位移 $u=F/k$，两者不是独立结果。$E$ 偏高时，$k$ 偏高而 $u$ 偏低。把它们当作独立量进行平方和相加，会丢掉这一关联。协方差矩阵的非对角项正是描述这种共同变化的工具。`,
            String.raw`同样，形成能中的总能量和参考能量可能共享计算设置，误差有时会抵消；也可能因不同磁态、成分或方法而不能抵消。相关性必须来自共同的数据或模型结构，不能为了得到更小的误差条而随意假定。`,
          ],
          equation: String.raw`\sigma_y^2\approx\sum_i\left(\frac{\partial f}{\partial x_i}\right)^2\sigma_i^2+2\sum_{i<j}\frac{\partial f}{\partial x_i}\frac{\partial f}{\partial x_j}\operatorname{Cov}(x_i,x_j)`,
          equationNote:
            "只有协方差项可忽略时，才可简化为独立输入的平方和。正相关并不总会放大输出方差：还取决于两个敏感性的符号。",
        },
        {
          id: "nonlinear",
          title: "4 · 小的能量偏差，可能成为大的时间偏差",
          paragraphs: [
            String.raw`热激活速率常写成 $r=\nu\exp[-E_a/(k_{\mathrm B}T)]$。势垒在指数中出现，所以几百分之一电子伏的偏差也可能显著改变低温速率。用对数速率更容易理解这种乘性变化；前因子和温度若也不确定，则还要把它们一并传播。`,
            String.raw`取 $T=300\,\mathrm K$，$k_{\mathrm B}T\approx0.02585\,\mathrm{eV}$。若势垒系统性偏高 $0.05\,\mathrm{eV}$，且前因子和温度正确，预测速率只有实际速率的约 0.145 倍。对单个恒定速率的 Poisson 事件，平均等待时间 $1/r$ 因此约为实际的 6.9 倍；复杂事件网络的总时间还取决于路径竞争。`,
          ],
          equation: String.raw`\frac{r_{\mathrm{pred}}}{r_{\mathrm{true}}}=\exp\!\left(-\frac{\Delta E_a}{k_{\mathrm B}T}\right),\qquad \sigma_{\ln r}=\frac{\sigma_{E_a}}{k_{\mathrm B}T}\quad(\nu,T\ \text{fixed})`,
          equationNote:
            "0.145 是速率比，不是对称的 ±14.5% 误差。固定温度和前因子时，对数速率与势垒严格线性；前一个有限偏差比值是精确关系。",
        },
        {
          id: "validation-loop",
          title: "5 · 传播不确定度，也要验证整条链",
          paragraphs: [
            "当响应强非线性、分布偏斜、靠近失稳或跨越相变时，一阶近似可能失效。可以从有依据的联合输入分布中抽样，沿同一条模型链逐次传播，并报告分位区间和尾部行为。共享参数必须在各环节使用同一个样本，否则会人为破坏相关性。",
            "抽样并不会自动发现漏掉的机制。模型偏差应通过独立工况、替代模型或可解释的残差模型评估；标定数据与验证数据尽可能分开。先判断总预测对哪个环节最敏感、哪个不确定来源最大，再决定把计算预算用于更精细的电子计算、更长采样还是更好的宏观实验。",
          ],
          bullets: [
            "明确目标量、参考工况和每个参数的定义及单位。",
            "记录输入的联合不确定性，以及共享来源产生的相关性。",
            "先做局部敏感性，再用代表性扰动或非线性抽样检查近似。",
            "单列数值误差和模型偏差；只有满足独立等假设时，才合并成一个方差。",
            "用未参与标定的数据验证最终目标量，并报告适用范围。",
          ],
        },
      ],
      derivation: {
        title: "从单输入误差到跨尺度协方差",
        intro:
          "把随机波动与系统偏差分别处理，再用同一根杆的刚度和位移展示：保留相关性可以避免创造出根本不存在的不确定性。",
        steps: [
          {
            title: "简单情形 · 一维 Taylor 展开",
            explanation: String.raw`在 $x_0$ 附近展开光滑函数。对中心化的小随机波动取方差；偏差则保留其符号，而不是自动当作标准差。`,
            formula: String.raw`f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x,\qquad \sigma_y^2\approx[f'(x_0)]^2\sigma_x^2,\qquad b_y\approx f'(x_0)b_x`,
            note: "二阶曲率可以使零均值输入波动产生非零输出均值偏移；一阶近似忽略了这一项。",
          },
          {
            title: "一般情形 · 把所有输入放进协方差矩阵",
            explanation:
              "中心化后，输出波动近似为 Jacobian 乘输入波动。将向量与其转置相乘再取期望，得到矩阵传播式。单独列出模型造成的偏差。",
            formula: String.raw`\Sigma_{\mathbf y}\approx J\Sigma_{\mathbf x}J^{\mathsf T},\qquad \mathbf b_{\mathbf y}\approx J\mathbf b_{\mathbf x}+\mathbf b_{\mathrm{model}}`,
            note: "若额外建立了经过标定的随机模型残差，只有在它与输入独立时，才可直接加上其协方差；相关残差还需要交叉项。系统偏差不能未经论证就装进独立随机噪声。",
          },
          {
            title: "跨尺度 · 同一个模量同时改变刚度与位移",
            explanation: String.raw`固定正的 $F,A,L$，仅让正的 $E$ 有小波动。分别对 $k=EA/L$ 和 $u=FL/(AE)$ 求导，再由共同的输入方差得到协方差。`,
            formula: String.raw`\frac{\partial k}{\partial E}=\frac AL,\qquad \frac{\partial u}{\partial E}=-\frac{FL}{AE^2},\qquad \operatorname{Cov}(k,u)\approx-\frac{F\sigma_E^2}{E^2}`,
            note: "局部线性近似下两者的相关系数为 −1；非线性有限分布的 Pearson 相关系数一般不必精确等于 −1。",
          },
          {
            title: "检查 · 一个精确约束如何使相关误差抵消",
            explanation: String.raw`逐次使用同一个 $E$ 时，$ku=F$ 是精确恒等式。一阶方差传播包含负协方差后也给出零；若丢掉交叉项，就会把一个固定力误算成不确定的量。`,
            formula: String.raw`\operatorname{Var}(ku)\approx u^2\sigma_k^2+k^2\sigma_u^2+2ku\operatorname{Cov}(k,u)=0,\qquad ku\equiv F`,
            note: "零方差只针对这里固定的 F 和这一共同输入结构。若载荷也不确定，乘积应继承载荷的不确定性。",
          },
          {
            title: "扩展 · 非线性传播保留配对和物理约束",
            explanation:
              "若模量分布较宽，给它选择有依据且保持正值的分布。每次抽样把同一个模量送入两个公式，直接计算输出分布；不要分别独立抽取刚度和位移。",
            formula: String.raw`E^{(s)}>0,\qquad k^{(s)}=\frac{AE^{(s)}}L,\qquad u^{(s)}=\frac{FL}{AE^{(s)}},\qquad k^{(s)}u^{(s)}=F`,
            note: "有界或对数正态分布是可能的选择，但应有数据或建模依据。增加抽样次数只减少传播计算的采样误差，不会修正输入分布或物理模型的错误。",
          },
        ],
      },
      example: {
        title: "同一个 5% 的模量不确定度，为什么不能重复相加？",
        problem: String.raw`取参考模量 $E=200\,\mathrm{GPa}$，标准差 $\sigma_E=10\,\mathrm{GPa}$。固定 $F=1000\,\mathrm N$、$A=10\,\mathrm{mm^2}$、$L=100\,\mathrm{mm}$。只传播模量的小波动，不含塑性、模型偏差或载荷误差。`,
        solution: [
          String.raw`参考刚度 $k=20000\,\mathrm{N/mm}$，参考位移 $u=0.050\,\mathrm{mm}$。`,
          String.raw`一阶相对标准差均为 5%，所以 $\sigma_k=1000\,\mathrm{N/mm}$、$\sigma_u=0.0025\,\mathrm{mm}$。这里的位移参考值和一阶结果不声称等于任意非线性分布的精确均值与标准差。`,
          String.raw`协方差 $\operatorname{Cov}(k,u)\approx-F(0.05)^2=-2.5\,\mathrm N$。单位为刚度乘位移的单位，即力。`,
          String.raw`若误当独立量，乘积的相对标准差会被写成 $\sqrt{0.05^2+0.05^2}\approx7.07\%$；保留协方差则得到零，与 $ku=1000\,\mathrm N$ 的精确约束一致。`,
        ],
        result:
          "相关性不是附加修饰，而是模型结构的一部分。先追踪每个输出来自哪些共同输入，再进行不确定度运算。",
      },
      misconceptions: [
        {
          myth: "所有误差都可以开平方相加。",
          correction:
            "平方和需要适用的随机误差模型与可忽略的相关性。系统偏差、强非线性、共同输入和遗漏物理不能未经论证就这样处理。",
        },
        {
          myth: "重复十次结果都很接近，说明预测很准确。",
          correction:
            "这只能支持重复性或采样波动较小。十次运行可以共享同一个错误势函数、缺失机制或错误边界。",
        },
        {
          myth: "更长的跨尺度链条一定更可靠。",
          correction:
            "每个接口都会引入假设和参数。连接更多尺度只有在补充了关键机制，并验证了传递关系后，才可能改善目标预测。",
        },
      ],
      questions: [
        {
          question: "两个能量都带有同一个常数偏差，它们的能量差会怎样？",
          answer:
            "若偏差确实完全相同，做差时它会精确抵消。但真实误差可能随结构、成分、磁态或电荷变化，不能把这一理想例子当作一般保证。",
        },
        {
          question: "势垒偏高 0.05 eV 在更低温度下会更严重还是更轻微？",
          answer: String.raw`在固定前因子、相同事件机制仍适用时，温度越低，$\Delta E_a/(k_{\mathrm B}T)$ 越大，速率低估越严重。若机制改变，必须先更新模型。`,
        },
        {
          question: "为什么沿尺度链抽样时，应复用同一个参数样本？",
          answer:
            "共享物理参数会产生共同变化。逐环节重新独立抽样会破坏这种相关性，可能让误差条虚增、虚减，甚至违反守恒或代数约束。",
        },
      ],
      connections: [
        {
          method: "kmc",
          reason: "观察势垒与速率的不确定性如何影响随机事件时间。",
        },
        {
          method: "constitutive",
          reason: "区分材料参数不确定性与本构模型遗漏的机制。",
        },
        {
          method: "fem",
          reason: "沿材料参数—刚度—位移的链条检查误差和相关性。",
        },
        {
          method: "md",
          reason: "练习相关时间、有效样本数及势函数适用范围的检查。",
        },
      ],
      references: [
        {
          label: "BIPM / JCGM · Guides to uncertainty in measurement",
          url: "https://www.bipm.org/en/committees/jc/jcgm/publications",
          detail:
            "GUM 与补充文件：测量模型、标准不确定度、协方差及 Monte Carlo 传播。",
        },
        {
          label: "NIST TN 1297 · Law of propagation of uncertainty",
          url: "https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-law-propagation-uncertainty",
          detail:
            "式 A-3 从一阶 Taylor 展开给出含协方差的传播律，帮助理解敏感系数与相关项。",
        },
        {
          label: "NIST · PFHub",
          url: "https://pages.nist.gov/pfhub/",
          detail:
            "借助基准比较检查实现和模型设置，避免把计算差异笼统称为随机误差。",
        },
      ],
    },
    en: {
      title: "How does error travel between scales?",
      subtitle:
        "From one uncertain modulus to correlation, nonlinearity, and model bias",
      lead: "An upstream uncertainty can grow, shrink, or partly cancel after entering a downstream model. Understanding that transfer requires response sensitivities, correlations between inputs, and knowledge of missing physics. A single error bar cannot replace those questions.",
      readMinutes: 22,
      objectives: [
        "Distinguish numerical error, sampling, parameter uncertainty, model bias, and scale-transfer error.",
        "Propagate local uncertainty through derivatives and covariance, including shared inputs.",
        "Explain why activated rates amplify barrier bias and when nonlinear propagation is necessary.",
      ],
      sections: [
        {
          id: "sources",
          title: "1 · First identify the sources",
          paragraphs: [
            "Error is the difference between a prediction and its target and is usually not fully known. Uncertainty describes the knowledge we have about a quantity. A standard deviation is not automatically the actual error, and repeatable computations can share a systematic bias. State which sources an error bar includes.",
            "A multiscale chain also introduces transfer approximations: replacing heterogeneous structure with one modulus, replacing a process with memory by memoryless rates, or transferring parameters between different boundaries. These assumptions need separate tests rather than being grouped into numerical noise.",
          ],
          table: {
            headers: ["Source", "Example", "Ways to assess or reduce it"],
            rows: [
              [
                "Discretization and solver error",
                "Finite basis, grid, timestep, solver tolerance",
                "Convergence studies, analytic solutions, residuals, conservation",
              ],
              [
                "Statistical sampling",
                "Finite trajectories, correlated samples, undersampled rare events",
                "Effective samples, independent repeats, block averages, mixing",
              ],
              [
                "Parameter uncertainty",
                "Uncertain moduli, barriers, mobilities, boundary loads",
                "Measured or calibrated distributions, covariance, sensitivity",
              ],
              [
                "Model bias",
                "Missing correlation, plasticity, temperature dependence",
                "Independent physical data, alternative models, validity checks",
              ],
              [
                "Scale transfer",
                "Averaging, representative volumes, closures, interfaces",
                "Vary transfer conditions, reconstruct responses, cross-scale comparison",
              ],
            ],
          },
        },
        {
          id: "sensitivity",
          title: "2 · Derivatives reveal where uncertainty is amplified",
          paragraphs: [
            String.raw`For an observable $y=f(x)$, a Taylor expansion near a reference value turns small input changes into output changes through $f'(x)$. Multiple inputs and outputs give a Jacobian matrix. Large sensitivity means a larger response to the same input change; priorities also depend on how uncertain that input actually is.`,
            String.raw`At fixed force $F$, length $L$, and area $A$, the displacement $u=FL/(EA)$ varies inversely with modulus $E$. Locally, $\Delta u/u\approx-\Delta E/E$, so overestimating stiffness underestimates displacement. For large changes, use the full inverse relationship rather than extending a tangent indefinitely.`,
          ],
          equation: String.raw`\Delta\mathbf y\approx J\Delta\mathbf x,\qquad J_{ij}=\left.\frac{\partial f_i}{\partial x_j}\right|_{\mathbf x_0}`,
          equationNote:
            "First-order propagation is local to the reference values. Derivative units depend on input and output; dimensionless relative derivatives can help compare sensitivities.",
        },
        {
          id: "correlations",
          title: "3 · Shared inputs create correlated outputs",
          paragraphs: [
            String.raw`When the same $E$ determines stiffness $k=EA/L$ and displacement $u=F/k$, those outputs are not independent. A larger $E$ produces a larger $k$ and smaller $u$. Adding their uncertainties as independent squared terms discards this relationship. Off-diagonal entries of a covariance matrix describe their shared variation.`,
            String.raw`Similarly, total and reference energies in a formation energy may share calculation errors that partly cancel. Different magnetic states, compositions, or methods may prevent that cancellation. Correlation must follow from data or model structure, not be assumed simply to obtain a smaller error bar.`,
          ],
          equation: String.raw`\sigma_y^2\approx\sum_i\left(\frac{\partial f}{\partial x_i}\right)^2\sigma_i^2+2\sum_{i<j}\frac{\partial f}{\partial x_i}\frac{\partial f}{\partial x_j}\operatorname{Cov}(x_i,x_j)`,
          equationNote:
            "The independent-input sum of squares is justified only when covariance terms can be neglected. Positive input correlation need not increase output variance: the sensitivity signs also matter.",
        },
        {
          id: "nonlinear",
          title: "4 · A small energy bias can cause a large timing bias",
          paragraphs: [
            String.raw`An activated rate often has the form $r=\nu\exp[-E_a/(k_{\mathrm B}T)]$. The barrier lies in the exponent, so a bias of only a few hundredths of an electronvolt can strongly affect a low-temperature rate. Log rate makes this multiplicative effect easier to interpret. Uncertain prefactors and temperatures must be propagated as well.`,
            String.raw`At $T=300\,\mathrm K$, $k_{\mathrm B}T\approx0.02585\,\mathrm{eV}$. If the barrier is biased upward by $0.05\,\mathrm{eV}$ while temperature and prefactor are correct, the predicted rate is about 0.145 times the actual rate. For one constant-rate Poisson event, the mean waiting time $1/r$ becomes about 6.9 times larger. A network's overall timescale also depends on competing paths.`,
          ],
          equation: String.raw`\frac{r_{\mathrm{pred}}}{r_{\mathrm{true}}}=\exp\!\left(-\frac{\Delta E_a}{k_{\mathrm B}T}\right),\qquad \sigma_{\ln r}=\frac{\sigma_{E_a}}{k_{\mathrm B}T}\quad(\nu,T\ \text{fixed})`,
          equationNote:
            "0.145 is a rate ratio, not a symmetric ±14.5% uncertainty. With fixed temperature and prefactor, log rate is exactly linear in barrier energy; the finite-bias ratio above is exact.",
        },
        {
          id: "validation-loop",
          title: "5 · Propagate uncertainty and validate the whole chain",
          paragraphs: [
            "First-order propagation may fail for strongly nonlinear responses, skewed distributions, instabilities, or phase changes. Draw from a justified joint input distribution, propagate each sample through the full model chain, and examine quantiles and tails. Reuse each shared input sample at every stage; independently resampling it destroys the original correlation.",
            "Sampling does not automatically discover omitted mechanisms. Assess model bias using independent conditions, alternative models, or an interpretable discrepancy model, and separate calibration data from validation data where possible. Identify the largest sensitivity and uncertainty contributions before investing in finer electronic calculations, longer sampling, or better macroscopic experiments.",
          ],
          bullets: [
            "Define the observable, reference conditions, and every parameter's meaning and units.",
            "Record joint input uncertainty and correlations from common sources.",
            "Start with local sensitivity, then check it through representative perturbations or nonlinear sampling.",
            "Keep numerical error and model bias identifiable; combine variances only under justified assumptions.",
            "Validate the final observable against data outside calibration and report the applicable domain.",
          ],
        },
      ],
      derivation: {
        title: "From one uncertain input to covariance across scales",
        intro:
          "Treat random variation and systematic bias separately, then use the stiffness and displacement of the same bar to show how keeping correlation avoids inventing uncertainty.",
        steps: [
          {
            title: "Simple case · A one-variable Taylor expansion",
            explanation: String.raw`Expand a smooth function near $x_0$. Take the variance of small centered fluctuations. A bias retains its sign instead of automatically becoming a standard deviation.`,
            formula: String.raw`f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x,\qquad \sigma_y^2\approx[f'(x_0)]^2\sigma_x^2,\qquad b_y\approx f'(x_0)b_x`,
            note: "Second-order curvature can shift the output mean even for zero-mean input fluctuations. First-order propagation omits that effect.",
          },
          {
            title: "Generalize · Put every input in a covariance matrix",
            explanation:
              "Centered output fluctuations are approximately the Jacobian times input fluctuations. Multiply the vector by its transpose and take expectations to obtain covariance propagation. Keep model bias explicit.",
            formula: String.raw`\Sigma_{\mathbf y}\approx J\Sigma_{\mathbf x}J^{\mathsf T},\qquad \mathbf b_{\mathbf y}\approx J\mathbf b_{\mathbf x}+\mathbf b_{\mathrm{model}}`,
            note: "A calibrated random model discrepancy contributes an additive covariance only if it is independent of the inputs. Correlated discrepancies need cross terms; systematic bias is not automatically independent random noise.",
          },
          {
            title:
              "Across scales · One modulus changes both stiffness and displacement",
            explanation: String.raw`Fix positive $F,A,L$ and allow small fluctuations only in positive $E$. Differentiate $k=EA/L$ and $u=FL/(AE)$, then use their common input variance to obtain covariance.`,
            formula: String.raw`\frac{\partial k}{\partial E}=\frac AL,\qquad \frac{\partial u}{\partial E}=-\frac{FL}{AE^2},\qquad \operatorname{Cov}(k,u)\approx-\frac{F\sigma_E^2}{E^2}`,
            note: "Their correlation coefficient is −1 in the local linear approximation. The Pearson correlation for a finite nonlinear distribution need not be exactly −1.",
          },
          {
            title: "Check · An exact constraint cancels correlated variation",
            explanation: String.raw`Using the same $E$ for both outputs gives the exact identity $ku=F$ in every realization. First-order propagation agrees when it includes the negative covariance. Dropping that cross term incorrectly makes a fixed force uncertain.`,
            formula: String.raw`\operatorname{Var}(ku)\approx u^2\sigma_k^2+k^2\sigma_u^2+2ku\operatorname{Cov}(k,u)=0,\qquad ku\equiv F`,
            note: "Zero variance applies to the fixed F and shared-input structure assumed here. If the force is uncertain, the product inherits that uncertainty.",
          },
          {
            title:
              "Extend · Nonlinear propagation preserves pairing and physical constraints",
            explanation:
              "For a broader modulus distribution, choose a justified distribution with positive support. Feed the same modulus draw into both formulas and calculate their output distributions directly. Do not sample stiffness and displacement independently.",
            formula: String.raw`E^{(s)}>0,\qquad k^{(s)}=\frac{AE^{(s)}}L,\qquad u^{(s)}=\frac{FL}{AE^{(s)}},\qquad k^{(s)}u^{(s)}=F`,
            note: "Bounded or lognormal distributions are possible choices when supported by data or modeling assumptions. More samples reduce propagation sampling error, not errors in the input distribution or physical model.",
          },
        ],
      },
      example: {
        title:
          "Why should the same 5% modulus uncertainty not be counted twice?",
        problem: String.raw`Take reference modulus $E=200\,\mathrm{GPa}$ with standard deviation $\sigma_E=10\,\mathrm{GPa}$. Fix $F=1000\,\mathrm N$, $A=10\,\mathrm{mm^2}$, and $L=100\,\mathrm{mm}$. Propagate only small modulus fluctuations, excluding plasticity, model bias, and load error.`,
        solution: [
          String.raw`Reference stiffness is $k=20000\,\mathrm{N/mm}$ and reference displacement is $u=0.050\,\mathrm{mm}$.`,
          String.raw`Both first-order relative standard deviations are 5%, giving $\sigma_k=1000\,\mathrm{N/mm}$ and $\sigma_u=0.0025\,\mathrm{mm}$. The displacement reference and linearized results are not claimed to be exact moments of an arbitrary nonlinear distribution.`,
          String.raw`The covariance is $\operatorname{Cov}(k,u)\approx-F(0.05)^2=-2.5\,\mathrm N$. Its units are stiffness times displacement, hence force.`,
          String.raw`Incorrectly assuming independence gives a relative standard deviation for the product of $\sqrt{0.05^2+0.05^2}\approx7.07\%$. Including covariance gives zero, consistent with the exact constraint $ku=1000\,\mathrm N$.`,
        ],
        result:
          "Correlation is part of the model structure. Trace which inputs are shared by the outputs before performing uncertainty arithmetic.",
      },
      misconceptions: [
        {
          myth: "All errors can be combined through a root sum of squares.",
          correction:
            "That requires an appropriate random-error model and negligible relevant correlations. Systematic biases, strong nonlinearity, shared inputs, and missing physics need justified treatment.",
        },
        {
          myth: "Ten closely agreeing runs prove the prediction is accurate.",
          correction:
            "They support repeatability or small sampling variation. Every run can still share the same wrong interaction model, omitted mechanism, or incorrect boundary.",
        },
        {
          myth: "A longer multiscale chain is always more reliable.",
          correction:
            "Every interface introduces assumptions and parameters. Adding scales can improve the target prediction when it supplies a necessary mechanism and its transfer relations have been validated.",
        },
      ],
      questions: [
        {
          question:
            "Two energies share exactly the same constant bias. What happens to their difference?",
          answer:
            "That identical bias cancels exactly. Real errors may vary with structure, composition, magnetism, or charge, so this ideal example is not a general guarantee of cancellation.",
        },
        {
          question:
            "Does a +0.05 eV barrier bias become more or less serious at lower temperature?",
          answer: String.raw`With a fixed prefactor and the same applicable mechanism, lower temperature increases $\Delta E_a/(k_{\mathrm B}T)$ and worsens the rate underestimate. A changing mechanism requires updating the model first.`,
        },
        {
          question:
            "Why should a shared parameter sample be reused throughout a scale chain?",
          answer:
            "The shared physical parameter creates coordinated variation. Resampling it independently at each stage destroys that correlation and can inflate or shrink error bars or violate algebraic and conservation constraints.",
        },
      ],
      connections: [
        {
          method: "kmc",
          reason:
            "Follow uncertain barriers and rates into stochastic event times.",
        },
        {
          method: "constitutive",
          reason:
            "Separate parameter uncertainty from mechanisms absent in a constitutive model.",
        },
        {
          method: "fem",
          reason:
            "Trace uncertainty and correlation through parameters, stiffness, and displacement.",
        },
        {
          method: "md",
          reason:
            "Assess correlation times, effective samples, and potential-model validity.",
        },
      ],
      references: [
        {
          label: "BIPM / JCGM · Guides to uncertainty in measurement",
          url: "https://www.bipm.org/en/committees/jc/jcgm/publications",
          detail:
            "The GUM and its supplements cover measurement models, standard uncertainties, covariance, and Monte Carlo propagation.",
        },
        {
          label: "NIST TN 1297 · Law of propagation of uncertainty",
          url: "https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-law-propagation-uncertainty",
          detail:
            "Equation A-3 derives covariance-aware propagation from a first-order Taylor expansion, showing sensitivity coefficients and cross terms.",
        },
        {
          label: "NIST · PFHub",
          url: "https://pages.nist.gov/pfhub/",
          detail:
            "Benchmark comparisons help assess implementations and model settings without treating every discrepancy as random error.",
        },
      ],
    },
  },
} satisfies Partial<Record<FoundationId, Record<Locale, FoundationLesson>>>;
