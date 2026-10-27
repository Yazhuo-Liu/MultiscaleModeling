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
            "连续体模型不再逐个追踪原子，而是在一个足够小、又包含许多微观结构的体积内定义应力、应变和温度。动量平衡规定力的关系，却不能告诉我们同样的变形会让钢、橡胶或黏性液体产生多大应力。这个缺口由本构关系补上。最简单的一维弹性关系是 σ=Eε；它假定当前应力只由当前应变决定。",
            "具有历史依赖的材料需要额外的内部状态 q，例如黏性应变、塑性应变或硬化变量。于是模型分成两部分：由当前应变、状态和温度求应力，再由加载速率更新状态。这里的状态不是一张任意记忆表，而是经过物理假设和实验约束选择的一组变量；变量越多，往往也意味着更多需要标定的参数。",
          ],
          formula: "σ = σ(ε, q, T)\nq̇ = g(ε̇, q, T)",
          symbols: [
            { symbol: "σ", meaning: "应力，单位 Pa；一维拉伸时为轴向应力。" },
            { symbol: "ε", meaning: "应变，无量纲；本章采用小应变。" },
            {
              symbol: "q",
              meaning: "内部状态变量；其分量的单位由具体物理定义决定。",
            },
            { symbol: "T", meaning: "温度；本章松弛实验保持温度不变。" },
          ],
        },
        {
          title: "把弹簧与阻尼器串联起来",
          paragraphs: [
            "弹簧储存可恢复的弹性能，满足 σ=Eεₑ；理想黏性阻尼器满足 σ=ηε̇ᵥ，它的变形速率与应力成正比。串联时，两部分承受相同应力，总应变是 ε=εₑ+εᵥ。对总应变求时间导数，就得到 ε̇=σ̇/E+σ/η。这个推导依赖常数 E、常数 η、小应变和等温条件。",
            "瞬间拉伸至 ε₀ 后保持总长度不变，对后续过程有 ε̇=0。此时阻尼器继续伸长，弹簧逐渐缩短，二者总变形不变，应力却持续下降。解一阶微分方程可得指数衰减；在 t=τ 时应力剩下初值的 1/e，约 36.8%。τ=η/E 比较黏性阻力与弹性刚度，因此具有时间单位。",
          ],
          formula:
            "ε = εₑ + εᵥ,    σ = Eεₑ = ηε̇ᵥ\nσ̇ + σ/τ = Eε̇,    τ = η/E\nε(t>0)=ε₀  ⇒  σ(t)=Eε₀ exp(−t/τ)",
          symbols: [
            { symbol: "E", meaning: "弹性模量，单位 Pa；决定瞬时弹性响应。" },
            { symbol: "η", meaning: "黏度，单位 Pa·s；σ/η 因此是应变速率。" },
            {
              symbol: "τ",
              meaning: "松弛时间，单位 s；不是应力降为零所需的有限时间。",
            },
            {
              symbol: "εₑ, εᵥ",
              meaning: "分别为弹性和黏性应变，两者之和为总应变。",
            },
          ],
        },
        {
          title: "从一个模型走向一类材料规律",
          paragraphs: [
            "松弛实验保持应变，测应力如何变化；蠕变实验保持应力，测应变如何变化。对同一个 Maxwell 模型，恒定应力下会发生线性增长的黏性变形，因此它具有流体式的长期响应。许多固体在长时间后仍有非零松弛模量，需要额外的并联弹簧；具有宽时间谱的材料还需要多个松弛支路。增加结构应以实验需求为依据。",
            "“速率与状态”也常指摩擦学中的 Dieterich–Ruina 关系：摩擦系数同时依赖滑移速度 v 与接触状态 θ，常用老化律 θ̇=1−vθ/Dc。它与 Maxwell 模型都包含状态演化，但物理变量和适用对象不同，不能互相替代。选择任何本构模型后，都应检查量纲、耗散符号、参数识别，以及未参与拟合的加载历史；本章的单支松弛实验仅覆盖线性黏弹性。",
          ],
          formula:
            "恒定 σ₀：ε(t) = σ₀/E + σ₀t/η\n黏性耗散率：D = σε̇ᵥ = σ²/η ≥ 0（η > 0）",
          symbols: [
            { symbol: "D", meaning: "单位体积的机械耗散率，单位 W/m³。" },
            { symbol: "v", meaning: "摩擦速率状态律中的滑移速度，单位 m/s。" },
            {
              symbol: "θ, Dc",
              meaning:
                "常用老化律中 θ 的单位为 s，特征滑移距离 Dc 的单位为 m。",
            },
          ],
        },
      ],
      workedExample: {
        title: "2% 拉伸后，应力多久减半？",
        given:
          "取 E=100 MPa、τ=2 s、ε₀=0.02。理想阶跃施加应变后，保持总长度不变。",
        steps: [
          "初始应力 σ₀=Eε₀=100×0.02=2 MPa。黏度 η=Eτ=200 MPa·s。",
          "经过 2 s，应力 σ=2 exp(−1)≈0.736 MPa，弹性应变 εₑ=σ/E≈0.00736。",
          "此时黏性应变 εᵥ=ε₀−εₑ≈0.01264；两部分应变相加仍为 0.02。",
          "令 σ/σ₀=1/2，可得半衰时间 t₁/₂=τ ln 2≈1.386 s。",
        ],
        result:
          "应力减半需要约 1.39 s；一个松弛时间后保留约 36.8%。保持长度并不意味着内部弹性与黏性变形各自不变。",
      },
      pitfalls: [
        "把应力松弛当作应变不断增加的蠕变；先确认实验控制的是应力还是应变。",
        "增大 E 却同时把 η 与 τ 都当作独立不变的量；三者满足 η=Eτ。",
        "用一个 Maxwell 支路解释所有塑性、损伤或摩擦行为；不同机制需要不同状态变量和验证。",
      ],
      question: {
        prompt:
          "保持 E 与初始应变不变，将黏度增大一倍。初始应力、松弛时间和半衰时间分别如何变化？",
        answer:
          "初始应力 Eε₀ 不变；τ=η/E 增大一倍，t₁/₂=τ ln 2 也增大一倍。材料以相同的初始应力开始，但松弛得更慢。",
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
            "A continuum model replaces individual atoms with stress, strain, and temperature defined over a small volume containing many microscopic constituents. Momentum balance constrains forces, but it cannot determine the stress produced by a given deformation in steel, rubber, or a viscous liquid. A constitutive relation closes that gap. The simplest one-dimensional elastic law is σ=Eε: it assumes that the current stress depends only on the current strain.",
            "A material with memory requires additional internal variables q, such as viscous strain, plastic strain, or a hardening variable. The model then has two parts: evaluate stress from the current strain, state, and temperature; then update the state using its evolution law. These variables are not an arbitrary record of the past. They represent selected physical mechanisms, and introducing more of them generally creates more parameters that must be identified from experiments.",
          ],
          formula: "σ = σ(ε, q, T)\nq̇ = g(ε̇, q, T)",
          symbols: [
            {
              symbol: "σ",
              meaning:
                "Stress, in Pa; axial stress in the one-dimensional example.",
            },
            {
              symbol: "ε",
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
            "A spring stores recoverable elastic energy and obeys σ=Eεₑ. An ideal viscous dashpot obeys σ=ηε̇ᵥ: its deformation rate is proportional to stress. In series, both elements carry the same stress, while their strains add: ε=εₑ+εᵥ. Differentiating this sum gives ε̇=σ̇/E+σ/η. This derivation assumes constant E and η, small strain, and a fixed temperature.",
            "After an ideal instantaneous strain ε₀ is applied and the total length is held fixed, ε̇=0. The dashpot continues to extend while the spring shortens, leaving the total deformation unchanged but reducing the stress. Solving the resulting first-order differential equation gives exponential decay. After t=τ, the stress is 1/e, or about 36.8%, of its initial value. The ratio τ=η/E compares viscous resistance with elastic stiffness and has units of time.",
          ],
          formula:
            "ε = εₑ + εᵥ,    σ = Eεₑ = ηε̇ᵥ\nσ̇ + σ/τ = Eε̇,    τ = η/E\nε(t>0)=ε₀  ⇒  σ(t)=Eε₀ exp(−t/τ)",
          symbols: [
            {
              symbol: "E",
              meaning:
                "Elastic modulus, in Pa; sets the instantaneous elastic response.",
            },
            {
              symbol: "η",
              meaning: "Viscosity, in Pa·s, so σ/η has units of strain rate.",
            },
            {
              symbol: "τ",
              meaning:
                "Relaxation time, in s; it is not a finite time at which stress becomes exactly zero.",
            },
            {
              symbol: "εₑ, εᵥ",
              meaning:
                "Elastic and viscous strain; their sum is the total strain.",
            },
          ],
        },
        {
          title: "From one model to a family of material laws",
          paragraphs: [
            "A relaxation test holds strain and measures changing stress. A creep test holds stress and measures changing strain. Under constant stress, the same Maxwell model accumulates viscous strain linearly, giving it a fluid-like long-time response. Many solids retain a nonzero long-time relaxation modulus and require an additional parallel spring. Materials with broad relaxation spectra may require several branches. Extra model structure should be justified by the experiments to be described.",
            "The phrase 'rate and state' also often refers to Dieterich–Ruina friction laws, where the friction coefficient depends on sliding velocity v and a contact state θ. A common aging law is θ̇=1−vθ/Dc. Both this law and the Maxwell model involve evolving state, but their variables and physical applications differ. They are not interchangeable. Any constitutive model should be checked for consistent units, dissipation, identifiable parameters, and predictions for loading histories excluded from calibration. The single-branch relaxation example covers linear viscoelasticity only.",
          ],
          formula:
            "Constant σ₀: ε(t) = σ₀/E + σ₀t/η\nViscous dissipation rate: D = σε̇ᵥ = σ²/η ≥ 0 (η > 0)",
          symbols: [
            {
              symbol: "D",
              meaning: "Mechanical dissipation rate per unit volume, in W/m³.",
            },
            {
              symbol: "v",
              meaning:
                "Sliding velocity in a friction rate-and-state law, in m/s.",
            },
            {
              symbol: "θ, Dc",
              meaning:
                "In the common aging law, θ is measured in s and the characteristic slip distance Dc in m.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How long does stress take to halve after a 2% stretch?",
        given:
          "Let E=100 MPa, τ=2 s, and ε₀=0.02. Apply an ideal step in strain and hold the total length fixed.",
        steps: [
          "The initial stress is σ₀=Eε₀=100×0.02=2 MPa. The viscosity is η=Eτ=200 MPa·s.",
          "At 2 s, σ=2 exp(−1)≈0.736 MPa, so the elastic strain is εₑ=σ/E≈0.00736.",
          "The viscous strain is εᵥ=ε₀−εₑ≈0.01264. The two strains still add to 0.02.",
          "Setting σ/σ₀=1/2 gives a half-life t₁/₂=τ ln 2≈1.386 s.",
        ],
        result:
          "Stress takes about 1.39 s to halve and retains about 36.8% after one relaxation time. Holding the total length does not hold the elastic and viscous strains individually fixed.",
      },
      pitfalls: [
        "Confusing stress relaxation with creep: first identify whether strain or stress is controlled.",
        "Changing E while treating both η and τ as independently fixed; they are linked by η=Eτ.",
        "Using one Maxwell branch to explain all plasticity, damage, or friction; different mechanisms require different state variables and validation.",
      ],
      question: {
        prompt:
          "Keep E and the initial strain fixed, but double the viscosity. What happens to the initial stress, relaxation time, and half-life?",
        answer:
          "The initial stress Eε₀ is unchanged. Both τ=η/E and t₁/₂=τ ln 2 double. The material starts at the same stress but relaxes more slowly.",
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
            "一根受拉细杆上的每个位置 x 都有轴向位移 u(x)。在小应变条件下，ε=du/dx；采用线弹性材料时，σ=Eε，轴力为 N=Aσ。没有分布载荷时，轴力沿杆保持不变。若左端固定、右端受拉力 F，均匀杆的解析解就是 u(x)=Fx/(EA)。有限元应当能在这个最简单的问题上重现答案。",
            "把杆划成若干单元，只把节点位移作为未知数。对长度 Lₑ 的两节点单元，用直线插值 u≈N₁u₁+N₂u₂，其中 N₁=1−x/Lₑ、N₂=x/Lₑ（此处 x 是单元局部坐标）。节点之间并非没有解，而是由形函数重建。线性插值使单元内应变为常数；真实解若有曲率，就需要更细网格或更高阶插值。",
          ],
          formula: "uₕ(x) = N₁(x)u₁ + N₂(x)u₂\nεₕ = (u₂−u₁)/Lₑ,    σₕ = Eεₕ",
          symbols: [
            {
              symbol: "uₕ",
              meaning: "有限维近似位移，单位 m；下标 h 表示网格尺度。",
            },
            {
              symbol: "N₁, N₂",
              meaning: "无量纲形函数；在自己的节点取 1，在另一节点取 0。",
            },
            {
              symbol: "E, A, Lₑ",
              meaning: "弹性模量 Pa、截面积 m²、单元长度 m。",
            },
          ],
        },
        {
          title: "弱形式让局部单元可以装配",
          paragraphs: [
            "平衡方程可写成 −(EAu′)′=b，其中 b 是单位长度上的轴向载荷。乘上一个满足固定端条件的试函数 v 并积分，再分部积分一次，二阶导数就变成了一阶导数的乘积。所得弱形式表达虚功平衡：内部虚功等于外力虚功。与强形式相比，它降低了近似位移所需的光滑性，使分段线性的位移也能使用。",
            "把形函数代入弱形式，均匀两节点杆单元得到 kₑ=(EA/Lₑ)[[1,−1],[−1,1]]。相邻单元共享一个节点，其作用在这个节点上的力必须相加，因此局部刚度按节点编号累加成整体矩阵 K。这里没有重新发明另一套力学：装配正是在离散层面实施连接关系与节点力平衡。",
          ],
          formula:
            "∫₀ᴸ EA u′v′ dx = Fv(L) + ∫₀ᴸ bv dx\nkₑ = (EA/Lₑ) [[1, −1], [−1, 1]]\nK u = f",
          symbols: [
            { symbol: "v", meaning: "虚位移/试函数，在固定端为零。" },
            { symbol: "b", meaning: "单位长度的轴向分布载荷，单位 N/m。" },
            {
              symbol: "K, f",
              meaning: "整体刚度矩阵和节点力向量，单位分别为 N/m 和 N。",
            },
          ],
        },
        {
          title: "边界条件与验证决定解是否可信",
          paragraphs: [
            "一根没有固定的杆可以整体平移而不产生应变，因此原始刚度矩阵含有刚体运动，无法唯一确定所有位移。施加 u(0)=0 后，可消去已知位移对应的自由度，再求解剩余线性方程。指定端部力是自然边界条件，进入载荷向量；指定端部位移是本质边界条件，约束未知量。两者不能随意互换。",
            "求得位移后，还要恢复应变、应力和支座反力。检查反力是否平衡外力、是否满足位移边界，再逐步细化网格比较关注量。均匀杆承受端部力时，真实位移是直线，所以线性单元可精确表示这一特例；这不意味着一个单元能精确解弯曲、应力集中或非均匀材料问题。本实验的三维杆形只是轴向一维模型的显示，变形经过放大。",
          ],
          formula: "均匀端载杆：u(L)=FL/(EA),    σ=F/A\n左端反力：R₀=−F",
          symbols: [
            {
              symbol: "R₀",
              meaning:
                "固定端轴向反力；正方向取向右时，拉伸端载 F>0 对应 R₀<0。",
            },
            {
              symbol: "h",
              meaning: "单元特征长度；减小 h 是网格收敛检查的一种方式。",
            },
          ],
        },
      ],
      workedExample: {
        title: "用两个单元算一根受拉杆",
        given:
          "L=1 m，A=10⁻⁴ m²，E=100 GPa，F=50 N。左端固定，划为两个长度为 0.5 m 的单元。",
        steps: [
          "每个单元的刚度系数 k₀=EA/Lₑ=2×10⁷ N/m。三个节点的整体矩阵为 k₀[[1,−1,0],[−1,2,−1],[0,−1,1]]。",
          "令 u₀=0，剩余方程为 2u₁−u₂=0 与 −u₁+u₂=F/k₀=2.5×10⁻⁶ m。",
          "得到中点位移 u₁=2.5 μm、端点位移 u₂=5 μm。解析式 FL/(EA) 也给出 5 μm。",
          "两个单元的应变均为 5×10⁻⁶，应力 Eε=0.5 MPa，与 F/A 一致；固定端反力为 −50 N。",
        ],
        result:
          "节点解、单元应力与整体力平衡相互一致。图中的明显拉伸是显示放大，实际端部位移仅为 5 μm。",
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
          "u(L)=FL/(EA) 和 σ=F/A 都增大一倍；外力仍为 F，反力仍为 −F。刚度变化影响变形，不会改变整体静力平衡所需的反力。",
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
            "Every position x along a slender bar has an axial displacement u(x). At small strain, ε=du/dx. A linear elastic material obeys σ=Eε, and the axial force is N=Aσ. With no distributed axial load, that force is constant along the bar. For a uniform bar fixed on the left and pulled by F on the right, the analytical solution is u(x)=Fx/(EA). A finite element model should reproduce this basic answer.",
            "Divide the bar into elements and retain only the nodal displacements as unknowns. In a two-node element of length Lₑ, interpolate with a straight line: u≈N₁u₁+N₂u₂, where N₁=1−x/Lₑ and N₂=x/Lₑ using the element's local coordinate. The solution between nodes is not missing; it is reconstructed by these shape functions. Linear interpolation produces constant strain within an element. A curved true solution requires a finer mesh or a higher-order approximation.",
          ],
          formula: "uₕ(x) = N₁(x)u₁ + N₂(x)u₂\nεₕ = (u₂−u₁)/Lₑ,    σₕ = Eεₕ",
          symbols: [
            {
              symbol: "uₕ",
              meaning:
                "Approximate displacement, in m; h denotes the mesh scale.",
            },
            {
              symbol: "N₁, N₂",
              meaning:
                "Dimensionless shape functions: one at their own node and zero at the other.",
            },
            {
              symbol: "E, A, Lₑ",
              meaning:
                "Elastic modulus in Pa, cross-sectional area in m², and element length in m.",
            },
          ],
        },
        {
          title: "The weak form connects local elements",
          paragraphs: [
            "Axial equilibrium can be written −(EAu′)′=b, where b is an axial load per unit length. Multiply by a test function v that satisfies the fixed-end condition, integrate, and integrate by parts once. The second derivative is replaced by a product of first derivatives. This weak form expresses virtual work: internal virtual work equals external virtual work. It requires less smoothness than the strong differential equation, allowing piecewise-linear displacement fields.",
            "Substituting shape functions into the weak form gives kₑ=(EA/Lₑ)[[1,−1],[−1,1]] for a uniform two-node bar element. Adjacent elements share a node, so their force contributions at that node must be added. Local matrices are therefore accumulated into a global matrix K using node numbering. Assembly is not a separate physical law: it enforces connectivity and nodal force balance in the discrete model.",
          ],
          formula:
            "∫₀ᴸ EA u′v′ dx = Fv(L) + ∫₀ᴸ bv dx\nkₑ = (EA/Lₑ) [[1, −1], [−1, 1]]\nK u = f",
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
              symbol: "K, f",
              meaning:
                "Global stiffness matrix and nodal force vector, in N/m and N respectively.",
            },
          ],
        },
        {
          title: "Boundary conditions and verification make the answer useful",
          paragraphs: [
            "An unconstrained bar can translate as a rigid body without developing strain. Its original stiffness matrix therefore cannot determine a unique set of displacements. After imposing u(0)=0, eliminate the prescribed degree of freedom and solve for the remaining unknowns. A specified end force is a natural boundary condition and enters the load vector. A specified displacement is an essential boundary condition and constrains an unknown. They cannot be swapped casually.",
            "After solving for displacements, recover strains, stresses, and support reactions. Check that reactions balance applied forces and that prescribed displacements are satisfied, then refine the mesh and compare the quantity of interest. The displacement of a uniform bar under an end force is exactly linear, so linear elements represent this special case exactly. This does not imply exact solutions for bending, stress concentrations, or nonuniform materials. The three-dimensional bar view represents a one-dimensional axial model with exaggerated deformation.",
          ],
          formula:
            "Uniform end-loaded bar: u(L)=FL/(EA),    σ=F/A\nLeft support reaction: R₀=−F",
          symbols: [
            {
              symbol: "R₀",
              meaning:
                "Axial support reaction; with rightward positive, a tensile end load F>0 gives R₀<0.",
            },
            {
              symbol: "h",
              meaning:
                "Characteristic element size; reducing h is one way to examine mesh convergence.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Solve a tensile bar using two elements",
        given:
          "L=1 m, A=10⁻⁴ m², E=100 GPa, and F=50 N. Fix the left end and use two elements, each 0.5 m long.",
        steps: [
          "The element stiffness coefficient is k₀=EA/Lₑ=2×10⁷ N/m. The three-node global matrix is k₀[[1,−1,0],[−1,2,−1],[0,−1,1]].",
          "Set u₀=0. The remaining equations are 2u₁−u₂=0 and −u₁+u₂=F/k₀=2.5×10⁻⁶ m.",
          "The midpoint displacement is u₁=2.5 μm and the end displacement is u₂=5 μm, matching FL/(EA).",
          "Both elements have strain 5×10⁻⁶ and stress Eε=0.5 MPa, consistent with F/A. The support reaction is −50 N.",
        ],
        result:
          "Nodal displacements, element stress, and global force balance agree. The visible elongation is magnified; the actual end displacement is only 5 μm.",
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
          "Both u(L)=FL/(EA) and σ=F/A double. The applied force is still F, so the reaction remains −F. A stiffness change affects deformation but does not change the reaction required by global static equilibrium.",
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
            "傅里叶定律 q=−k∇T 表示热流从高温流向低温，其中 k 是热导率。把它代入无内热源的局部能量守恒 ρc∂T/∂t=−∇·q，在材料参数为常数时得到 ∂T/∂t=α∇²T，α=k/(ρc)。这说明扩散率同时反映传热能力与储热能力；热导率和热扩散率不是同一个量。",
            "在间距为 h 的规则网格上，分别对左右邻点作 Taylor 展开并相加，奇数阶项抵消，得到 Tₓₓ≈(Tᵢ₊₁−2Tᵢ+Tᵢ₋₁)/h²。对 y 方向重复相同过程，就得到中心点及四个邻点组成的五点 Laplacian。对于足够光滑的解，这个空间近似具有 O(h²) 截断误差；网格只是在采样场，不是把材料切成互不交流的小块。",
          ],
          formula:
            "α = k/(ρc)\n∇²Tᵢⱼ ≈ (Tᵢ₊₁,ⱼ + Tᵢ₋₁,ⱼ + Tᵢ,ⱼ₊₁ + Tᵢ,ⱼ₋₁ − 4Tᵢⱼ)/h²",
          symbols: [
            { symbol: "k", meaning: "热导率，单位 W/(m·K)。" },
            { symbol: "ρc", meaning: "体积热容量，单位 J/(m³·K)。" },
            { symbol: "α", meaning: "热扩散率，单位 m²/s。" },
            {
              symbol: "h",
              meaning: "相邻格点的空间距离，单位 m；这里两个方向间距相同。",
            },
          ],
        },
        {
          title: "稳定条件来自一次合理的局部平均",
          paragraphs: [
            "用前向 Euler 近似时间导数后，新温度等于旧温度加上扩散带来的增量。把式子重排，可看作中心旧值的权重为 1−4r，每个邻点的权重为 r，其中 r=αΔt/h²。当 0≤r≤1/4 时，这些权重非负且总和为 1；新温度是局部旧温度的加权平均，因此不会凭空产生高于最大值或低于最小值的新极值。",
            "若时间步过大，中心权重变成负数，就可能产生过冲、振荡和发散。对这里的等距二维网格，显式稳定条件是 Δt≤h²/(4α)。网格间距减半，稳定时间步上限要降为四分之一，而二维网格点数约增加四倍：模拟同样的物理时长通常需要约十六倍的更新工作。隐式格式可以放宽稳定性约束，但稳定并不代表时间离散足够准确。",
          ],
          formula:
            "Tᶰ⁺¹ᵢⱼ = (1−4r)Tᶰᵢⱼ + r(Tᶰᵢ₊₁,ⱼ + Tᶰᵢ₋₁,ⱼ + Tᶰᵢ,ⱼ₊₁ + Tᶰᵢ,ⱼ₋₁)\nr = αΔt/h² ≤ 1/4",
          symbols: [
            { symbol: "n", meaning: "时间层编号；tₙ=nΔt。" },
            {
              symbol: "r",
              meaning: "无量纲扩散数，控制一次时间更新的相对强度。",
            },
            {
              symbol: "Δt",
              meaning: "时间步，单位 s；前向 Euler 的时间截断误差为 O(Δt)。",
            },
          ],
        },
        {
          title: "边界是物理问题的一部分",
          paragraphs: [
            "初始条件规定 t=0 时域内温度，例如一个局部高斯热斑。边界条件则持续规定边缘如何与外界交换热量。固定温度是 Dirichlet 条件；给定法向热流是 Neumann 条件，其中零热流对应绝热边界。初始热斑只提供一次初始能量，不能把它误称为持续加热源；持续热源需要在方程右端增加功率项。",
            "本例边界保持零超温，因此热量可以流出，总超温积分随时间下降；这里的零表示相对参考温度的零，不意味着绝对零度。若边界绝热或周期且没有热源，总热量应守恒。验证时先检查边界值、温度最大值和热量趋势，再分别减小 h 与 Δt 比较结果。三维曲面的高度表示温度，不能把温度起伏解释为板材发生了几何弯曲。",
          ],
          formula:
            "T(x,y,0)=T₀(x,y),    T|边界=0\nQ = ∫Ω ρcT dA（单位厚度）\ndQ/dt = −∮∂Ω q·n ds",
          symbols: [
            { symbol: "T₀", meaning: "初始温度/超温分布；与持续热源不同。" },
            {
              symbol: "n",
              meaning: "边界外法向单位向量；此处与时间层下标 n 无关。",
            },
            {
              symbol: "Q",
              meaning:
                "二维板单位厚度的超额热量，单位 J/m；无量纲例子显示对应的温度积分。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一个热节点的一步更新",
        given:
          "α=10⁻⁵ m²/s，h=1 mm，Δt=0.02 s。某内部节点为 80°C，四个邻点均为 20°C，无热源。",
        steps: [
          "先换算单位：h=10⁻³ m，因此 h²=10⁻⁶ m²，r=αΔt/h²=0.2。",
          "稳定上限为 Δt≤h²/(4α)=0.025 s；所选 0.02 s 满足条件。",
          "更新温度 Tⁿ⁺¹=80+0.2×(20+20+20+20−4×80)=32°C。",
          "若误用 Δt=0.03 s，则 r=0.3，单步结果为 8°C，低于所有原有邻点，已经违反应有的局部极值约束。",
        ],
        result:
          "稳定时间步给出 32°C，处于旧温度的 20–80°C 范围内。这个单步例子说明数值稳定条件具有直接的物理解释。",
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
          "时间步上限随 h² 变化，因此降为四分之一。二维节点数约变为四倍，时间步数约变为四倍，总更新工作量约增为十六倍（不计边界和实现细节）。",
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
            "Fourier's law q=−k∇T describes heat flowing from hotter to colder regions, with k the thermal conductivity. Substitution into local energy balance without an internal heat source, ρc∂T/∂t=−∇·q, gives ∂T/∂t=α∇²T for constant material properties, where α=k/(ρc). Diffusivity therefore combines the ability to conduct heat with the ability to store it. Thermal conductivity and thermal diffusivity are different quantities.",
            "On a regular grid of spacing h, expand the left and right temperatures in Taylor series and add them. Odd-order terms cancel, giving Tₓₓ≈(Tᵢ₊₁−2Tᵢ+Tᵢ₋₁)/h². Repeat in y to obtain the five-point Laplacian: the center and its four immediate neighbors. For a sufficiently smooth solution, this spatial approximation has O(h²) truncation error. The grid samples a continuous field; it does not split the material into disconnected pieces.",
          ],
          formula:
            "α = k/(ρc)\n∇²Tᵢⱼ ≈ (Tᵢ₊₁,ⱼ + Tᵢ₋₁,ⱼ + Tᵢ,ⱼ₊₁ + Tᵢ,ⱼ₋₁ − 4Tᵢⱼ)/h²",
          symbols: [
            { symbol: "k", meaning: "Thermal conductivity, in W/(m·K)." },
            { symbol: "ρc", meaning: "Volumetric heat capacity, in J/(m³·K)." },
            { symbol: "α", meaning: "Thermal diffusivity, in m²/s." },
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
            "Forward Euler approximates the time derivative, making the new temperature equal to the old temperature plus a diffusion increment. Rearrange the update and it becomes a weighted average: the center has weight 1−4r and each neighbor has weight r, with r=αΔt/h². When 0≤r≤1/4, all weights are nonnegative and sum to one. A new value therefore cannot create an extremum beyond the local old temperatures.",
            "If the time step is too large, the center weight becomes negative, allowing overshoot, oscillation, and divergence. For this equal-spaced two-dimensional grid, the explicit restriction is Δt≤h²/(4α). Halving the grid spacing reduces the allowable time step by four and increases the number of grid points by roughly four. Simulating the same physical duration then requires about sixteen times as many updates. Implicit methods can relax stability restrictions, but stability alone does not ensure accurate time integration.",
          ],
          formula:
            "Tᶰ⁺¹ᵢⱼ = (1−4r)Tᶰᵢⱼ + r(Tᶰᵢ₊₁,ⱼ + Tᶰᵢ₋₁,ⱼ + Tᶰᵢ,ⱼ₊₁ + Tᶰᵢ,ⱼ₋₁)\nr = αΔt/h² ≤ 1/4",
          symbols: [
            { symbol: "n", meaning: "Time-level index, with tₙ=nΔt." },
            {
              symbol: "r",
              meaning:
                "Dimensionless diffusion number; sets the relative strength of one update.",
            },
            {
              symbol: "Δt",
              meaning:
                "Time step, in s; forward Euler has O(Δt) temporal truncation error.",
            },
          ],
        },
        {
          title: "The boundary is part of the physical problem",
          paragraphs: [
            "The initial condition specifies temperature throughout the domain at t=0, such as a local Gaussian hot spot. Boundary conditions continuously prescribe how the edges exchange heat with their surroundings. A fixed temperature is a Dirichlet condition; a prescribed normal heat flux is a Neumann condition, with zero flux representing insulation. A hot spot supplies initial energy once. Continuous heating would require a source-power term in the equation.",
            "Here, the edges are held at zero excess temperature, so heat may leave and the integrated excess temperature decreases. Zero means the reference temperature, not absolute zero. With insulated or periodic boundaries and no sources, total heat should instead remain constant. Check boundary values, the maximum temperature, and the heat trend before separately refining h and Δt. Height in the three-dimensional temperature surface represents temperature, not geometric bending of a plate.",
          ],
          formula:
            "T(x,y,0)=T₀(x,y),    T|boundary=0\nQ = ∫Ω ρcT dA (per unit thickness)\ndQ/dt = −∮∂Ω q·n ds",
          symbols: [
            {
              symbol: "T₀",
              meaning:
                "Initial temperature or excess-temperature field; distinct from a continuous heat source.",
            },
            {
              symbol: "n",
              meaning:
                "Outward unit normal at the boundary; distinct here from the time-level index.",
            },
            {
              symbol: "Q",
              meaning:
                "Excess heat per unit thickness, in J/m; the dimensionless example displays a corresponding temperature integral.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Advance one hot node by a single step",
        given:
          "Let α=10⁻⁵ m²/s, h=1 mm, and Δt=0.02 s. An interior node is at 80°C and its four neighbors are at 20°C, with no heat source.",
        steps: [
          "Convert units first: h=10⁻³ m, so h²=10⁻⁶ m² and r=αΔt/h²=0.2.",
          "The stability limit is Δt≤h²/(4α)=0.025 s. The selected 0.02 s satisfies it.",
          "Update Tⁿ⁺¹=80+0.2×(20+20+20+20−4×80)=32°C.",
          "If Δt were incorrectly increased to 0.03 s, r would become 0.3 and the update would give 8°C, below every old neighbor and already violating the local extremum bound.",
        ],
        result:
          "The stable step produces 32°C, inside the old 20–80°C range. This single update gives the numerical stability condition a direct physical interpretation.",
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
          "The limit scales with h², so it becomes four times smaller. There are about four times as many grid points and four times as many time steps, giving roughly sixteen times the update work, excluding boundary and implementation overhead.",
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
    },
  },
};
