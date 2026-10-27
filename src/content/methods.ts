import type { Method } from "../types";

// Chinese beginner curriculum. Python snippets are independent teaching examples, not browser source.
export const methods: Method[] = [
  {
    id: "dft",
    scale: "electronic",
    title: "密度泛函理论",
    english: "Density Functional Theory",
    short: "DFT",
    tagline: "从电子密度，读懂材料的能量。",
    description:
      "用空间中的电子密度代替高维多电子波函数，求解原子结合、结构稳定性和材料性质。",
    length: "Å – nm",
    time: "通常为基态；动力学可至 fs",
    difficulty: "进阶起点",
    prerequisites: ["能量最小化", "波函数与概率", "导数"],
    intuition:
      "想象原子核周围是一团可以调整形状的电子云。电子云太紧会增加动能，太松又失去原子核的吸引。DFT 寻找使总能量最低的密度分布；关键不是给每个电子画一条轨迹。",
    concepts: [
      {
        title: "01 · 从粒子到密度",
        body: "电子密度 n(r) 表示单位体积内电子的平均数。它积分后等于总电子数 N。Hohenberg–Kohn 定理建立了基态密度与基态性质之间的联系，但并未直接给出可计算的精确能量泛函。",
      },
      {
        title: "02 · Kohn–Sham 辅助系统",
        body: "以一组虚构的非相互作用轨道重建真实电子密度，动能主要由轨道计算，剩余多体效应进入交换关联泛函。实际运算要反复求轨道、更新密度，直到自洽。",
      },
      {
        title: "03 · 近似决定预测能力",
        body: "LDA、GGA、杂化泛函是不同精度和代价的近似。平面波截断、k 点、赝势、结构优化和自洽容差都需要收敛检查；基态 DFT 本身没有真实时间步进。",
      },
    ],
    equation: {
      formula: "E[n] = Tₛ[n] + ∫vₑₓₜ(r)n(r)dr + E_H[n] + E_xc[n]",
      explanation:
        "Tₛ 是辅助系统动能，vₑₓₜ 是外势，E_H 是经典库仑能，E_xc 包含剩余交换关联效应。满足 ∫n dr = N 的密度中，基态使能量最小。",
    },
    steps: [
      "确定原子结构、电子数与边界条件。",
      "选定基组、赝势与交换关联近似，构造初始密度。",
      "求解 Kohn–Sham 方程，由占据轨道重建密度并混合更新。",
      "检查能量和密度收敛，再比较结构或计算力。",
    ],
    code: '# 教学例：氢原子单个高斯轨道的变分能量；不是完整 DFT\nimport numpy as np\nalpha = np.linspace(0.05, 2.0, 500)\n# 原子单位：hbar = m_e = e = 4*pi*epsilon_0 = 1\nenergy = 1.5 * alpha - 2 * np.sqrt(2 * alpha / np.pi)\ni = np.argmin(energy)\nr = np.linspace(0, 4, 200)\ndensity = (2 * alpha[i] / np.pi)**1.5 * np.exp(-2 * alpha[i] * r*r)\nprint("最佳 alpha:", alpha[i], "能量 / Hartree:", energy[i])\nprint("精确氢原子基态为 -0.5 Hartree；高斯试探函数给出上界。")',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "让电子云找到合适的宽度",
      description:
        "用单电子氢样原子的高斯试探密度做能量最小化，调节核电荷 Z 和初始高斯指数 α，观察径向概率分布与优化过程。",
      observe: [
        "改变初始高斯指数，观察优化是否趋向相同能量最低点。",
        "核电荷增大时，径向概率峰值是否更靠近原子核？",
        "Z=1 时，对比最优变分能与精确氢原子基态 −0.5 Hartree；高斯基组不完备带来误差。",
      ],
      limitations:
        "这是单电子变分教学模型，不求解多电子 Kohn–Sham 方程，也不包含真实材料的交换关联、晶格与能带。动画中的迭代不是物理时间。",
    },
    applications: [
      "晶体稳定结构与相对能量",
      "缺陷形成能与表面吸附",
      "为原子间势和弹性常数提供数据",
    ],
    limitations: [
      "近似泛函可能误判强关联和弱相互作用。",
      "体系大小、基组与 k 点决定计算代价。",
      "静态基态计算不能直接表示扩散的秒级演化。",
    ],
    connections: [
      {
        id: "hf",
        reason: "对比交换如何处理，以及电子相关被省略或近似的方式。",
      },
      {
        id: "md",
        reason:
          "由能量对原子位置求导得到力；第一性原理 MD 在每步调用电子结构计算。",
      },
    ],
    references: [
      {
        title: "Density Functional Theory: A Practical Introduction",
        author: "D. Sholl & J. A. Steckel",
        url: "https://doi.org/10.1002/9780470447710",
      },
      {
        title:
          "Self-Consistent Equations Including Exchange and Correlation Effects",
        author: "W. Kohn & L. J. Sham (1965)",
        url: "https://doi.org/10.1103/PhysRev.140.A1133",
      },
    ],
  },
  {
    id: "hf",
    scale: "electronic",
    title: "Hartree–Fock 方法",
    english: "Hartree–Fock Method",
    short: "HF",
    tagline: "每个电子，都感受到其余电子的平均场。",
    description:
      "从多电子波函数出发，用单个 Slater 行列式实现反对称性，建立可自洽求解的平均场电子结构方法。",
    length: "Å – nm",
    time: "基态迭代，无固有时间尺度",
    difficulty: "进阶起点",
    prerequisites: ["线性代数", "电子轨道", "泡利不相容原理"],
    intuition:
      "一群电子互相排斥，很难同时准确描述每一对。先让一个电子在其他电子的平均场中运动，再更新所有轨道，直到彼此一致。与简单平均电荷不同，HF 还通过交换项保留电子不可区分带来的量子约束。",
    concepts: [
      {
        title: "01 · 用轨道搭建波函数",
        body: "把占据的自旋轨道放入 Slater 行列式。交换两个电子会使波函数变号，因此自动满足费米子反对称性。这个单行列式是 HF 最重要的近似。",
      },
      {
        title: "02 · 库仑与交换",
        body: "Fock 算符由单电子项、库仑项和交换项组成。库仑项对应平均静电排斥；交换项源于反对称性，只作用于同自旋电子，不能理解成额外的经典力。",
      },
      {
        title: "03 · 自洽与相关",
        body: "求得轨道后，密度矩阵又改变 Fock 矩阵，所以需要 SCF 迭代。HF 在所选基组的单行列式空间中变分最优，但没有包含该近似之外的电子相关。",
      },
    ],
    equation: {
      formula: "F C = S C ε；F = h + J − K",
      explanation:
        "C 为轨道系数，S 为基函数重叠矩阵，ε 为轨道能。J、K 的系数随自旋轨道或闭壳层空间轨道约定不同而变；实验采用简化正交基。",
    },
    steps: [
      "选择基函数并计算单电子与双电子积分。",
      "由初猜轨道生成密度矩阵。",
      "构建并对角化 Fock 矩阵，按电子数占据轨道。",
      "混合新旧密度直到收敛，并检查总能量与自旋状态。",
    ],
    code: '# 两位点 Hubbard 限制性 Hartree–Fock，2 电子；能量单位 t=1\nimport numpy as np\nU, bias, mix = 2.0, 1.0, 0.25\nh = np.array([[-bias/2, -1.0], [-1.0, bias/2]])\np = np.eye(2)\nfor iteration in range(300):\n    # 相反自旋占据产生 U*n_i/2；不是一般分子积分表达式\n    f = h + 0.5*U*np.diag(np.diag(p))\n    eps, c = np.linalg.eigh(f)\n    p_new = 2*np.outer(c[:,0],c[:,0])\n    error = np.linalg.norm(p_new-p)\n    p = (1-mix)*p + mix*p_new\n    if error < 1e-9: break\nprint("占据数:", np.diag(p), "总电子数:", np.trace(p))\nprint("自洽残差:", error)',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "看平均场逐步自洽",
      description:
        "用两位点、两个相反自旋电子的 Hubbard 限制性 Hartree–Fock 模型，调节在位排斥 U/t 和位点能量差 Δ/t，观察占据数与自洽残差。",
      observe: [
        "增大位点能量差，电子更偏好哪个位点？",
        "增大在位排斥，两个位点的占据是否趋于均衡？",
        "观察自洽残差下降，同时检查两个位点的电子数之和始终为 2。",
      ],
      limitations:
        "这是两位点 Hubbard 模型的限制性 Hartree–Fock 平均场：两个相反自旋电子共占一个空间轨道，包含简化在位相互作用；不使用真实分子的双电子积分，不等于第一性原理分子 HF。迭代次数没有物理时间含义。",
    },
    applications: [
      "分子轨道与化学键的入门理解",
      "后 HF 相关方法的参考态",
      "交换与平均场近似的基准",
    ],
    limitations: [
      "单行列式近似在强相关、断键附近可能失效。",
      "缺失动态电子相关，通常不能准确描述色散。",
      "收敛到一个解不保证找到最低能的电子态。",
    ],
    connections: [
      {
        id: "dft",
        reason:
          "同样常用自洽迭代；HF 以波函数为起点，DFT 以密度及其能量泛函为起点。",
      },
      {
        id: "md",
        reason: "电子结构能量面可转化为原子运动所需的力。",
      },
    ],
    references: [
      {
        title: "Modern Quantum Chemistry",
        author: "A. Szabo & N. S. Ostlund",
        url: "https://store.doverpublications.com/products/9780486691862",
      },
      {
        title: "Psi4: Self-Consistent Field Theory",
        author: "Psi4 documentation",
        url: "https://psicode.org/psi4manual/master/scf.html",
      },
    ],
  },
  {
    id: "md",
    scale: "atomistic",
    title: "分子动力学",
    english: "Molecular Dynamics",
    short: "MD",
    tagline: "让原子遵循牛顿定律，材料开始运动。",
    description:
      "给定原子间相互作用，通过时间积分追踪粒子轨迹，连接微观运动与温度、压力、扩散等宏观量。",
    length: "nm – μm",
    time: "fs 步长；ps – μs 轨迹",
    difficulty: "基础",
    prerequisites: ["牛顿第二定律", "势能与力", "基本数值积分"],
    intuition:
      "把原子想成会吸引、也会排斥的小球。靠得太近会强烈排斥，距离合适时彼此吸引。知道每个原子的位置和速度，就可以由力算出极短时间后的状态，再重复这个过程。",
    concepts: [
      {
        title: "01 · 势能给出力",
        body: "势函数 U(r) 描述原子构型的能量，力是能量对位置的负梯度。Lennard–Jones 势适合理解排斥与吸引，但不能通用地描述金属键、共价键或化学反应。",
      },
      {
        title: "02 · 积分与时间步",
        body: "Velocity Verlet 用旧力更新位置，再用新旧力更新速度。时间步必须小于最快振动的特征时间；仅仅看到动画稳定并不能证明积分精度足够。",
      },
      {
        title: "03 · 统计量需要采样",
        body: "温度来自去除整体运动后的动能，压力与动量和相互作用有关。应先平衡，再对相关时间足够长的轨迹做统计，并对比尺寸与时间步敏感性。",
      },
    ],
    equation: {
      formula: "mᵢ r̈ᵢ = −∇ᵢ U；U(r) = 4ε[(σ/r)¹² − (σ/r)⁶]",
      explanation:
        "ε 为能量尺度，σ 为长度尺度。LJ 约化单位下 m = ε = σ = 1，时间单位为 σ√(m/ε)。动画速度并不等于真实时间。",
    },
    steps: [
      "初始化粒子位置和速度，去除整体漂移。",
      "计算粒子对作用力，并施加边界条件。",
      "使用 Velocity Verlet 更新位置和速度。",
      "记录动能、势能和结构，验证能量与时间步收敛。",
    ],
    code: '# 1D LJ 双原子振动：约化单位，Velocity Verlet\nimport numpy as np\nx = np.array([-0.6, 0.6]); v = np.zeros(2)\ndt = 0.002\ndef force(x):\n    r = x[1] - x[0]\n    magnitude = 24 * (2/r**13 - 1/r**7)\n    return np.array([-magnitude, magnitude])\nf = force(x)\nfor _ in range(2000):\n    x += v*dt + 0.5*f*dt**2\n    f_new = force(x)\n    v += 0.5*(f + f_new)*dt\n    f = f_new\nr = x[1] - x[0]\nprint("间距:", r, "总能量:", 0.5*np.sum(v*v) + 4*(r**-12-r**-6))',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "观察 Lennard–Jones 粒子运动",
      description:
        "改变初始运动强度或相互作用参数，在 2D 粒子图与 3D 视图之间切换，观察局部结构和热运动。",
      observe: [
        "低运动强度下粒子是否保持近邻结构？",
        "增大初始动能，比较粒子运动幅度。",
        "关注能量变化，区分物理交换与数值漂移。",
      ],
      limitations:
        "有限粒子、简化势函数和教学边界条件的模型。它不代表指定真实材料；约化时间与温度需给定材料参数才能换算。3D 展示不自动代表完整三维分子模拟。",
    },
    applications: [
      "原子扩散与热输运",
      "裂纹尖端和纳米材料变形",
      "液体结构与相变机理",
    ],
    limitations: [
      "时间步受原子振动限制，很难直接跨越秒级。",
      "结果依赖势函数在目标材料与状态上的可靠性。",
      "小体系与短轨迹有明显有限尺寸和采样误差。",
    ],
    connections: [
      {
        id: "dft",
        reason: "利用电子结构计算标定原子间势或直接计算力。",
      },
      {
        id: "kmc",
        reason: "把罕见扩散事件提取为速率，跨越 MD 难以到达的长时间。",
      },
    ],
    references: [
      {
        title: "Computer Simulation of Liquids",
        author: "M. P. Allen & D. J. Tildesley",
        url: "https://doi.org/10.1093/oso/9780198803195.001.0001",
      },
      {
        title: "LAMMPS documentation",
        author: "LAMMPS developers",
        url: "https://docs.lammps.org/Manual.html",
      },
    ],
  },
  {
    id: "mc",
    scale: "atomistic",
    title: "蒙特卡洛方法",
    english: "Monte Carlo",
    short: "MC",
    tagline: "用随机尝试，找到平衡态的统计规律。",
    description:
      "根据目标概率分布接受或拒绝随机变化，估计能量、磁化、相变和其他热力学统计量。",
    length: "Å – μm（依模型而定）",
    time: "采样步，不等于真实时间",
    difficulty: "基础",
    prerequisites: ["概率", "能量", "指数函数"],
    intuition:
      "不必追踪每个粒子的真实运动路径，也可以问“系统在平衡时更常出现哪些状态”。Monte Carlo 像不断提出小修改：能量降低通常接受，能量升高也偶尔接受，温度决定这种冒险有多频繁。",
    concepts: [
      {
        title: "01 · 采样而非轨迹",
        body: "目标通常是正则系综的 Boltzmann 分布。Markov 链的状态序列是采样工具，不能把一个翻转尝试当成真实的一秒或一次原子振动。",
      },
      {
        title: "02 · Metropolis 接受率",
        body: "对称提议下，能量降低的改变直接接受；升高 ΔE 的改变以 exp(−ΔE/kBT) 的概率接受。更一般的提议需要 Metropolis–Hastings 修正。",
      },
      {
        title: "03 · 平衡与不确定性",
        body: "起始构型会影响前期结果，需要舍弃热化段。连续样本往往相关，临界点附近尤其明显；应估计自相关、误差条和尺寸效应。",
      },
    ],
    equation: {
      formula: "P_accept = min[1, exp(−ΔE / kBT)]；H = −J Σ⟨ij⟩ sᵢsⱼ",
      explanation:
        "Ising 模型中 sᵢ = ±1，J > 0 偏好相邻自旋同向。实验使用二维周期格点和无量纲温度 kBT/J。",
    },
    steps: [
      "初始化自旋格点并选择温度。",
      "随机选择一个自旋，计算翻转的能量差。",
      "按 Metropolis 准则接受或拒绝。",
      "经过热化后采样磁化和能量，并检查统计误差。",
    ],
    code: '# 二维 Ising，周期边界；一个 sweep = N*N 次尝试\nimport numpy as np\nrng = np.random.default_rng(7)\nn, temperature = 24, 2.0\ns = rng.choice([-1, 1], size=(n, n))\nfor _ in range(400*n*n):\n    i, j = rng.integers(n, size=2)\n    neighbors = s[(i+1)%n,j]+s[(i-1)%n,j]+s[i,(j+1)%n]+s[i,(j-1)%n]\n    dE = 2*s[i,j]*neighbors\n    if dE <= 0 or rng.random() < np.exp(-dE/temperature):\n        s[i,j] *= -1\nprint("最终磁化 / 自旋:", s.mean())\n# 单个末态不是可靠的系综平均；正式分析需热化、采样和误差估计。',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "磁畴如何从随机中出现",
      description:
        "对二维 Ising 自旋格点做 Metropolis 更新。调节温度，观察同向自旋区域与无序状态。",
      observe: [
        "低温时大块同向自旋是否逐渐形成？",
        "高温时磁化为何趋近零但仍然波动？",
        "二维零场无限方格 Ising 模型的临界温度约为 2.269 J/kB，小体系会抹平转变。",
      ],
      limitations:
        "图中演化为 Monte Carlo 采样过程，没有校准的物理时间。有限格点和有限采样不足以精确测量临界指数。",
    },
    applications: ["平衡相变与磁性", "合金构型和吸附统计", "自由能与概率积分"],
    limitations: [
      "一般 Metropolis MC 不提供真实动力学。",
      "低温和能垒会导致采样滞留。",
      "必须检查平衡、自相关和抽样误差。",
    ],
    connections: [
      {
        id: "kmc",
        reason: "KMC 根据物理事件速率推进时钟；平衡 MC 主要生成目标分布。",
      },
      {
        id: "phase-field",
        reason: "两者都能展示组织变化，但模型变量、时间解释与演化规律不同。",
      },
    ],
    references: [
      {
        title: "Equation of State Calculations by Fast Computing Machines",
        author: "N. Metropolis et al. (1953)",
        url: "https://doi.org/10.1063/1.1699114",
      },
      {
        title: "Monte Carlo Methods in Statistical Physics",
        author: "M. E. J. Newman & G. T. Barkema",
        url: "https://global.oup.com/academic/product/monte-carlo-methods-in-statistical-physics-9780198517979",
      },
    ],
  },
  {
    id: "dd",
    scale: "mesoscopic",
    title: "位错动力学",
    english: "Dislocation Dynamics",
    short: "DD",
    tagline: "不再追踪每个原子，而是追踪晶体中的缺陷线。",
    description:
      "把位错表示为线或离散线段，依据应力产生的驱动力与迁移率描述塑性变形。",
    length: "nm – μm",
    time: "ns – ms（依迁移率）",
    difficulty: "承上启下",
    prerequisites: ["弹性与剪应力", "晶体滑移", "向量"],
    intuition:
      "推动整张地毯很难，但推动一个褶皱就能让地毯逐渐移动。位错像晶格中的“褶皱”：位错线扫过晶体，留下一个柏氏矢量大小的相对滑移，于是材料可以在远低于理想强度的应力下塑性变形。",
    concepts: [
      {
        title: "01 · 线缺陷承载塑性",
        body: "柏氏矢量 b 表示位错造成的闭合失败，线方向 ξ 描述位错走向。刃型、螺型与混合位错有不同几何关系，滑移通常受晶体学平面约束。",
      },
      {
        title: "02 · 应力驱动位错",
        body: "Peach–Koehler 力把应力张量、柏氏矢量和线方向联系起来。位错之间的长程弹性相互作用、外应力与障碍物共同决定净力。",
      },
      {
        title: "03 · 从线运动到应变",
        body: "位错扫过的面积转化为塑性剪切。更完整的 DD 需要处理线张力、交滑移、反应、湮灭和结点拓扑；这些细节不是所有教学模型都具备。",
      },
    ],
    equation: {
      formula: "f_PK = (σ · b) × ξ；v = M f；γ̇ = ρ b v̄",
      explanation:
        "f_PK 为单位长度作用力，M 为迁移率。Orowan 关系把可动位错密度 ρ、柏氏矢量长度 b 和平均速度 v̄ 联系到剪切应变率。",
    },
    steps: [
      "指定滑移面、位错位置与符号。",
      "计算外应力及其他位错产生的分解剪应力。",
      "由迁移律计算速度，采用小时间步更新。",
      "处理边界和反应，并由扫掠面积累计塑性应变。",
    ],
    code: '# 钉扎位错线小斜率模型：dy/dt = stress + tension*d²y/dx²\nimport numpy as np\nn, tension, stress = 65, 1.0, 0.6\nx = np.linspace(0,1,n); dx = x[1]-x[0]\ny = np.zeros(n); dt = 0.2*dx*dx/tension\nfor _ in range(6000):\n    lap = (y[2:]-2*y[1:-1]+y[:-2])/dx**2\n    y[1:-1] += dt*(stress+tension*lap)\n    # 两端保持 y=0；约化迁移率 M=1\nexact = stress*x*(1-x)/(2*tension)\nprint("最大弓出:", y.max(), "静态极限:", exact.max())',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "被钉扎的位错如何弓出",
      description:
        "一段两端固定的位错在剪应力下弯曲，线张力试图把它拉直。调节驱动应力与线张力，观察平衡弓出形状。",
      observe: [
        "增大剪应力时，位错线弓出幅度如何变化？",
        "增大线张力时，位错是否更难弯曲？",
        "对比最大弓出量与小斜率静态极限 τL²/(8Γ)；这段模型不会发生位错环发射。",
      ],
      limitations:
        "二维小斜率、常线张力、过阻尼教学模型，固定两端，不包含位错之间的相互作用、线拓扑变化、攀移或交滑移。大斜率时近似失效，不能用于定量预测 Frank–Read 源临界应力。",
    },
    applications: [
      "微米尺度塑性与尺寸效应",
      "位错塞积和障碍强化",
      "为晶体塑性提供硬化规律",
    ],
    limitations: [
      "位错芯部不能由连续弹性精确描述。",
      "完整网络反应与自由表面处理复杂。",
      "迁移律与材料参数需由实验或更细尺度获得。",
    ],
    connections: [
      {
        id: "md",
        reason: "用原子模拟研究位错芯结构和迁移率。",
      },
      {
        id: "crystal-plasticity",
        reason: "由位错密度和运动建立滑移与硬化规律。",
      },
    ],
    references: [
      {
        title:
          "Forces Exerted on Dislocations and the Stress Fields Produced by Them",
        author: "M. Peach & J. S. Koehler (1950)",
        url: "https://doi.org/10.1103/PhysRev.80.436",
      },
      {
        title: "Computer Simulations of Dislocations",
        author: "V. V. Bulatov & W. Cai",
        url: "https://doi.org/10.1093/oso/9780198526148.001.0001",
      },
    ],
  },
  {
    id: "kmc",
    scale: "mesoscopic",
    title: "动力学蒙特卡洛",
    english: "Kinetic Monte Carlo",
    short: "KMC",
    tagline: "跳过无事发生的等待，直接跳到下一次事件。",
    description:
      "把热激活过程拆成离散事件，用事件速率选择发生什么以及何时发生，从而跨越原子振动时间尺度。",
    length: "nm – μm",
    time: "ns – s 或更久（依速率）",
    difficulty: "承上启下",
    prerequisites: ["概率分布", "热激活", "随机数"],
    intuition:
      "扩散原子大部分时间在晶格位点附近振动，偶尔才跨越能垒。KMC 把这些等待压缩为一个随机时间间隔，直接模拟下一次跳跃。只要事件表与速率合理，就能有效处理稀有事件。",
    concepts: [
      {
        title: "01 · 事件与能垒",
        body: "列出当前状态能发生的跳跃、反应或吸附事件。常用 Arrhenius 速率 k = ν exp(−Ea/kBT)，其中 ν 是尝试频率，Ea 是激活能。",
      },
      {
        title: "02 · 竞争的时钟",
        body: "全部事件速率相加得到总速率 R。下一事件 i 被选中的概率为 ki/R；等待时间服从参数 R 的指数分布，平均值为 1/R。",
      },
      {
        title: "03 · 有效模型的前提",
        body: "通常假设驻留态内快速平衡、事件近似无记忆，且事件集合足够完备。漏掉一个低能垒机制，可能远比随机误差更严重。",
      },
    ],
    equation: {
      formula: "kᵢ = νᵢ exp(−Eᵢ/kBT)；Δt = −ln(u) / Σᵢkᵢ",
      explanation:
        "u 是 (0,1) 内均匀随机数。事件选择再使用一个独立随机数。若 k 的单位为 s⁻¹，累计时间即为秒。",
    },
    steps: [
      "列出当前构型的所有允许事件与速率。",
      "按累积速率抽取下一事件。",
      "按指数分布抽取等待时间并推进物理时钟。",
      "执行事件、更新局部事件表并重复。",
    ],
    code: '# 1D 最近邻热激活扩散，距离单位为晶格间距\nimport numpy as np\nrng = np.random.default_rng(12)\nkB, temperature = 8.617333262e-5, 500.0  # eV/K, K\nbarrier, attempt = 0.5, 1e12             # eV, s^-1\nk = attempt*np.exp(-barrier/(kB*temperature))\nx, time = 0, 0.0\nfor _ in range(10000):\n    time += -np.log(max(rng.random(), 1e-15))/(2*k)\n    x += 1 if rng.random() < 0.5 else -1\nprint("位移 / 晶格间距:", x, "物理时间 / s:", time)\nprint("1D 理论扩散系数 / a²/s:", k)',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "空位的跳跃时钟",
      description:
        "观察周期方格中的单空位随机跳跃。调节温度和迁移势垒，比较同样跳跃次数对应的真实等待时间；橙色点表示空位。",
      observe: [
        "温度上升后，单次等待时间怎样变化？",
        "提高能垒时，路径看起来可能相似，物理时钟却会改变几个数量级。",
        "重复试验，区分单条随机路径与大量粒子的平均扩散。",
      ],
      limitations:
        "使用简化固定格点与预设 Arrhenius 速率，不包含动态重构和复杂相互作用。真实时间解释只对给定速率模型有效。",
    },
    applications: [
      "空位与表面扩散",
      "薄膜生长和吸附反应",
      "长期缺陷聚集与老化",
    ],
    limitations: [
      "需要已知且足够完整的事件目录。",
      "速率依赖能垒、尝试频率和温度的准确性。",
      "快速重复事件仍可能成为效率瓶颈。",
    ],
    connections: [
      {
        id: "md",
        reason: "用 MD 或过渡态方法识别事件和迁移机制。",
      },
      {
        id: "mc",
        reason: "对比平衡采样与带物理时钟的事件驱动动力学。",
      },
    ],
    references: [
      {
        title: "Introduction to the Kinetic Monte Carlo Method",
        author: "A. F. Voter (2007)",
        url: "https://doi.org/10.1007/978-1-4020-5295-8_1",
      },
      {
        title:
          "A new algorithm for Monte Carlo simulation of Ising spin systems",
        author: "A. B. Bortz, M. H. Kalos & J. L. Lebowitz (1975)",
        url: "https://doi.org/10.1016/0021-9991(75)90060-1",
      },
    ],
  },
  {
    id: "phase-field",
    scale: "microstructure",
    title: "相场方法",
    english: "Phase-field Method",
    short: "PF",
    tagline: "让界面从一个连续场中自然生长。",
    description:
      "用平滑变化的序参量表示不同相或组织，通过自由能驱动的偏微分方程描述界面运动与形貌演化。",
    length: "nm – mm",
    time: "μs – h（依物理参数）",
    difficulty: "承上启下",
    prerequisites: ["导数与梯度", "自由能", "扩散方程"],
    intuition:
      "不必在每一刻描出一条复杂界面。给材料的每个位置一个数：接近 +1 是一种相，接近 −1 是另一种相，中间是一层平滑过渡。让这个场沿降低自由能的方向变化，界面就会自行移动、合并和消失。",
    concepts: [
      {
        title: "01 · 弥散界面",
        body: "序参量 φ 把离散的相标签变成连续变量。双阱势让两个相稳定，梯度能惩罚剧烈空间变化，两者共同决定界面宽度和能量。",
      },
      {
        title: "02 · 先问守恒不守恒",
        body: "Allen–Cahn 方程用于非守恒序参量，允许各相体积分数改变。Cahn–Hilliard 方程用于守恒浓度场，通过化学势梯度输运物质；两者不能随意互换。",
      },
      {
        title: "03 · 自由能与动力学",
        body: "自由能可以耦合温度、应力、弹性和多组分化学。界面厚度、网格尺寸、时间步和迁移率需要共同校准；漂亮形貌不自动意味着定量预测。",
      },
    ],
    equation: {
      formula: "F[φ] = ∫[¼(φ²−1)² + ½κ|∇φ|²]dV；∂φ/∂t = −M δF/δφ",
      explanation:
        "实验采用 Allen–Cahn：∂φ/∂t = M[κ∇²φ − (φ³−φ)]。M > 0 为迁移率，κ > 0 为梯度能系数，周期边界下连续模型使自由能下降。",
    },
    steps: [
      "定义序参量、自由能和守恒性质。",
      "设置初始组织与边界条件。",
      "离散 Laplacian 并更新序参量。",
      "检查自由能、界面分辨率和时间步敏感性。",
    ],
    code: '# 无量纲 Allen–Cahn，2D 周期边界；dx=1\nimport numpy as np\nrng = np.random.default_rng(5)\nphi = 0.1*rng.standard_normal((48, 48))\nkappa, mobility, dt = 1.0, 1.0, 0.05\nfor _ in range(400):\n    lap = sum(np.roll(phi,s,axis=a) for a in (0,1) for s in (-1,1))-4*phi\n    phi += dt*mobility*(kappa*lap-phi**3+phi)\nprint("序参量范围:", phi.min(), phi.max())\nprint("平均序参量:", phi.mean(), "（本模型不要求守恒）")',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "看小畴消失、大畴长大",
      description:
        "从微小随机扰动出发演化 Allen–Cahn 场，观察分相图案与曲率驱动的界面运动。",
      observe: [
        "小区域为何往往先消失？",
        "调节迁移率，区分演化速度与自由能最低状态。",
        "切换 3D 高度图，观察平滑界面；高度表示序参量，不是材料表面高度。",
      ],
      limitations:
        "二维非守恒标量序参量，采用无量纲双阱自由能。它不代表守恒成分的 Cahn–Hilliard 分解，也没有定量材料参数或多晶取向。",
    },
    applications: [
      "凝固枝晶与相变",
      "晶粒长大和畴壁运动",
      "裂纹与损伤的弥散界面描述",
    ],
    limitations: [
      "模型选择必须匹配守恒性和物理机制。",
      "界面宽度需要由多个网格点解析。",
      "定量计算需要自由能与动力学参数校准。",
    ],
    connections: [
      {
        id: "fdm",
        reason: "有限差分是离散相场演化方程的一种常见方式。",
      },
      {
        id: "dft",
        reason: "电子结构与热力学数据可以帮助构建自由能。",
      },
    ],
    references: [
      {
        title: "Phase-Field Models for Microstructure Evolution",
        author: "L.-Q. Chen (2002)",
        url: "https://doi.org/10.1146/annurev.matsci.32.112001.132041",
      },
      {
        title: "A microscopic theory for antiphase boundary motion",
        author: "S. M. Allen & J. W. Cahn (1979)",
        url: "https://doi.org/10.1016/0001-6160(79)90196-2",
      },
    ],
  },
  {
    id: "crystal-plasticity",
    scale: "microstructure",
    title: "多晶塑性",
    english: "Polycrystal Plasticity",
    short: "CP",
    tagline: "晶粒朝向不同，材料的变形也不同。",
    description:
      "在晶体滑移系上构建塑性流动与硬化规律，再通过晶粒间约束预测多晶材料的各向异性响应。",
    length: "μm – mm",
    time: "μs – h（依加载过程）",
    difficulty: "承上启下",
    prerequisites: ["应力与应变", "晶体取向", "塑性屈服"],
    intuition:
      "一块金属由许多朝向不同的晶粒拼成。外力一样，有些晶粒的滑移面恰好顺着受力方向，容易滑动；另一些则需要更大外力。多晶塑性把这种微观方向性带入宏观力学。",
    concepts: [
      {
        title: "01 · 把应力投影到滑移系",
        body: "每个滑移系由滑移方向 s 与滑移面法向 n 决定。分解剪应力 τ = s·σ·n 驱动滑移；单轴加载下得到 Schmid 因子 m = cosλ cosφ。",
      },
      {
        title: "02 · 从滑移到塑性流动",
        body: "常用幂律把滑移速率与 τ/g 联系起来，其中 g 为滑移阻力。阻力随累计滑移改变，描述自硬化和潜硬化；有限变形还需处理晶格旋转。",
      },
      {
        title: "03 · 多晶不是简单平均",
        body: "真实晶粒之间必须满足变形协调与力平衡。Taylor 等应变、Sachs 等应力是不同极限近似，晶体塑性有限元则显式解析空间约束。",
      },
    ],
    equation: {
      formula: "τᵅ = sᵅ · σ · nᵅ；γ̇ᵅ = γ̇₀ |τᵅ/gᵅ|ⁿ sign(τᵅ)",
      explanation:
        "α 标识滑移系，gᵅ 是临界滑移阻力，n 控制速率敏感性。单滑移单轴近似下 σ_y = τ_c / |m|，且 |m| ≤ 0.5。",
    },
    steps: [
      "定义晶粒取向与允许滑移系。",
      "把外应力转换为各晶粒坐标系中的分解剪应力。",
      "计算滑移速率并更新硬化和晶格旋转。",
      "通过协调与平衡耦合晶粒，汇总宏观响应。",
    ],
    code: '# Schmid 定律：平面内单滑移示意，并非完整多晶求解器\nimport numpy as np\nangle = np.linspace(5, 85, 9)\ntheta = np.deg2rad(angle)\n# 滑移方向与面法向正交；单轴加载方向固定\nschmid = np.abs(np.cos(theta)*np.sin(theta))\ncritical_shear = 30.0  # MPa\nuniaxial_yield = critical_shear / schmid\nfor a, m, y in zip(angle, schmid, uniaxial_yield):\n    print(f"取向 {a:4.0f}°  Schmid {m:.3f}  屈服 {y:.1f} MPa")',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "为什么有些晶粒先屈服",
      description:
        "36 个独立取向晶粒在统一轴向应力下加载。调节目标应力与临界分切应力，观察哪些晶粒首先达到滑移启动条件。",
      observe: [
        "45° 附近为什么容易激活单滑移？",
        "增大目标应力，激活晶粒的比例怎样变化？",
        "提高临界分切应力后，同样载荷下的激活比例如何变化？",
      ],
      limitations:
        "采用简化取向与滑移激活模型，不求解完整晶体塑性有限元、真实 FCC/BCC 全部滑移系、晶粒协调或潜硬化。示意网格不是实际 EBSD 数据。",
    },
    applications: [
      "板材各向异性与成形",
      "织构对屈服和硬化的影响",
      "晶粒尺度应变集中和疲劳研究",
    ],
    limitations: [
      "材料滑移系、速率敏感性和硬化参数需要标定。",
      "晶粒边界效应不能仅由取向投影获得。",
      "单滑移演示不能代表完整多晶载荷分配。",
    ],
    connections: [
      {
        id: "dd",
        reason: "从位错机制构造滑移阻力、迁移率和硬化规律。",
      },
      {
        id: "fem",
        reason: "把晶体塑性本构装入有限元积分点，求解晶粒间协调。",
      },
    ],
    references: [
      {
        title:
          "Overview of constitutive laws, kinematics, homogenization and multiscale methods in crystal plasticity finite-element modeling",
        author: "F. Roters et al. (2010)",
        url: "https://doi.org/10.1016/j.actamat.2009.10.058",
      },
      {
        title: "DAMASK documentation",
        author: "DAMASK developers",
        url: "https://damask-multiphysics.org/",
      },
    ],
  },
  {
    id: "constitutive",
    scale: "continuum",
    title: "本构与速率状态方程",
    english: "Constitutive, Rate & State Equations",
    short: "STATE",
    tagline: "把微观机制压缩成工程可用的材料规律。",
    description:
      "用应力、应变、温度与内部状态变量建立材料响应方程，描述弹性、黏性、塑性与历史依赖。",
    length: "μm – m",
    time: "ms – h 或更久",
    difficulty: "基础",
    prerequisites: ["应力与应变", "常微分方程", "弹簧与阻尼器"],
    intuition:
      "相同形状的橡胶、钢和蜂蜜受力后表现完全不同。平衡方程告诉我们力如何平衡，本构方程告诉我们材料如何回应。引入内部状态变量后，材料还能“记住”之前发生过的变形。",
    concepts: [
      {
        title: "01 · 守恒方程不够",
        body: "质量、动量和能量守恒适用于许多材料，但不足以确定具体响应。本构关系连接应力、应变、温度等变量，是闭合连续体问题的必要材料信息。",
      },
      {
        title: "02 · 速率与历史",
        body: "弹簧描述即时弹性，阻尼器描述速率相关流动。两者串联形成 Maxwell 模型：保持总应变时，应力随时间衰减。更一般的塑性和损伤模型使用内部状态演化方程。",
      },
      {
        title: "03 · 参数必须有实验约束",
        body: "一般形式是 σ=σ(ε,q,T)，内部状态满足 q̇=g(ε̇,q,T)，例如塑性应变、硬化和损伤。摩擦学另有 Dieterich–Ruina 速率状态律 μ=μ₀+a ln(v/v₀)+b ln(θv₀/Dc)，常配 θ̇=1−vθ/Dc（v>0）；本章动画使用 Maxwell 黏弹松弛，未求解该摩擦模型。所有参数均需在目标加载与温度范围内标定。",
      },
    ],
    equation: {
      formula: "ε̇ = σ̇/E + σ/η；σ(t) = σ₀ exp(−t/τ)，τ = η/E",
      explanation:
        "Maxwell 模型中 E 为弹性模量，η 为黏度。后一式适用于施加瞬时应变后保持应变不变，σ₀ = Eε₀；τ 是应力松弛的特征时间。",
    },
    steps: [
      "明确材料、加载方式和所需时间尺度。",
      "选择弹性、黏性与内部变量的组合。",
      "由实验标定参数并积分状态演化方程。",
      "用未参与拟合的加载历史验证预测。",
    ],
    code: '# Maxwell 应力松弛，SI 单位；恒定应变保持\nimport numpy as np\nE, eta, strain = 100e6, 200e6, 0.02  # Pa, Pa*s, 无量纲\ntau = eta / E\ntime = np.linspace(0, 5*tau, 101)\nstress = E*strain*np.exp(-time/tau)\nprint("松弛时间 / s:", tau)\nprint("初始应力 / MPa:", stress[0]/1e6)\nprint("经过一个 tau 后保留比例:", np.exp(-1))',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "拉住材料，看应力慢慢消失",
      description:
        "施加并保持总应变 ε₀=0.02，调节弹性模量 E 和松弛时间 τ，观察 Maxwell 模型的应力衰减。对应黏度为 η=Eτ。",
      observe: [
        "经过一个松弛时间，应力为何剩下约 36.8%？",
        "保持 E 不变并提高 τ（等价于提高黏度），应力下降得更快还是更慢？",
        "保持应变与保持应力是不同实验，不能混淆松弛和蠕变。",
      ],
      limitations:
        "线性、小应变、等温单支 Maxwell 模型；无法完整表示聚合物宽松弛谱、金属屈服、损伤或摩擦速率状态律。",
    },
    applications: [
      "聚合物和软材料黏弹响应",
      "工程结构的材料子模型",
      "蠕变、塑性与损伤演化的建模入口",
    ],
    limitations: [
      "参数与模型的适用温度和加载速率有范围。",
      "单个 Maxwell 支路不能拟合所有松弛行为。",
      "本构关系需要配合边界条件与平衡方程使用。",
    ],
    connections: [
      {
        id: "fem",
        reason: "本构关系在有限元积分点把应变转成应力。",
      },
      {
        id: "crystal-plasticity",
        reason: "晶体塑性是一类以滑移机制和内部变量为基础的本构模型。",
      },
    ],
    references: [
      {
        title: "Viscoelastic Properties of Polymers",
        author: "J. D. Ferry",
        url: "https://www.wiley.com/en-us/Viscoelastic+Properties+of+Polymers%2C+3rd+Edition-p-9780471048947",
      },
      {
        title: "Introduction to the Mechanics of a Continuous Medium",
        author: "L. E. Malvern",
        url: "https://archive.org/details/introductiontome0000malv",
      },
      {
        title:
          "Modeling of rock friction: 1. Experimental results and constitutive equations",
        author: "J. H. Dieterich (1979)",
        url: "https://doi.org/10.1029/JB084iB05p02161",
      },
    ],
  },
  {
    id: "fem",
    scale: "continuum",
    title: "有限元方法",
    english: "Finite Element Method",
    short: "FEM",
    tagline: "把复杂结构分成小块，再把它们连接起来。",
    description:
      "将连续边值问题写成弱形式，在有限个单元上近似未知场，通过组装与边界条件求解整体响应。",
    length: "μm – m",
    time: "静态；或 μs – h",
    difficulty: "基础",
    prerequisites: ["线性代数", "力平衡", "应力与应变"],
    intuition:
      "一根复杂形状的杆很难一次求解，但每一小段可以看作有刚度的弹簧。有限元把局部响应组装起来，同时要求共享节点位移一致、内部节点力平衡，从而求出整体变形。",
    concepts: [
      {
        title: "01 · 用形函数近似连续场",
        body: "节点存储未知量，形函数在单元内部插值。对于一维线性杆单元，位移沿单元线性变化，应变和应力在单元内为常数。",
      },
      {
        title: "02 · 组装与边界条件",
        body: "单元刚度叠加到全局矩阵 K，得到 Ku = f。固定端消除刚体运动，自然边界条件施加力；没有足够约束时矩阵可能奇异。",
      },
      {
        title: "03 · 验证与收敛",
        body: "结果依赖网格、单元阶次、积分与材料模型。应检查反力平衡、解析基准和网格收敛。渲染的变形常被放大，必须与真实位移读数区分。",
      },
    ],
    equation: {
      formula: "K u = f；kₑ = (EA/Lₑ) [[1, −1], [−1, 1]]",
      explanation:
        "E 是杨氏模量，A 是截面积，Lₑ 是单元长度。对均匀杆左端固定、右端力 F，解析末端位移为 u(L) = FL/(EA)。",
    },
    steps: [
      "将几何划分为单元并定义材料与自由度。",
      "计算单元刚度和载荷，组装全局系统。",
      "施加位移边界条件并求解节点位移。",
      "恢复应变应力，检查反力与解析解或网格收敛。",
    ],
    code: '# 1D 轴向杆，左端固定、右端拉力；SI 单位\nimport numpy as np\nn, L, E, A, force = 20, 1.0, 100e9, 1e-4, 50.0\nK = np.zeros((n+1,n+1)); f = np.zeros(n+1); f[-1] = force\nke = E*A/(L/n)*np.array([[1.,-1.],[-1.,1.]])\nfor e in range(n):\n    K[e:e+2,e:e+2] += ke\nu = np.zeros(n+1)\nu[1:] = np.linalg.solve(K[1:,1:], f[1:])\nreaction = K@u-f\nprint("末端位移 / m:", u[-1], "解析值:", force*L/(E*A))\nprint("固定端反力 / N:", reaction[0])',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "把一根杆拆成有限单元",
      description:
        "固定 20 个线性杆单元，改变端部拉力与杨氏模量，观察节点位移和杆的拉伸，并与 u(L)=FL/(EA) 的解析结果比较。",
      observe: [
        "载荷加倍时，线性模型的位移是否加倍？",
        "弹性模量增大时，结构变得更硬还是更软？",
        "均匀杆端载荷产生线性位移场，线性单元可以精确表示它；这个特例不说明网格永远不重要。",
      ],
      limitations:
        "一维、小变形、线弹性轴向杆。3D 外观用于观察节点与放大后的位移，不是三维实体有限元求解。没有弯曲、屈曲、接触或塑性。",
    },
    applications: [
      "工程结构应力与变形",
      "热传导、振动和多物理场",
      "材料微结构的空间力学响应",
    ],
    limitations: [
      "FEM 是离散方法，不能替代可靠的材料本构。",
      "奇异应力、畸变网格与不恰当约束会误导结果。",
      "非线性和瞬态问题还需要迭代与时间积分。",
    ],
    connections: [
      {
        id: "constitutive",
        reason: "材料本构决定单元内部应力与切线刚度。",
      },
      {
        id: "fdm",
        reason: "对比基于弱形式的单元离散与直接替代导数的格点离散。",
      },
    ],
    references: [
      {
        title: "The Finite Element Method: Its Basis and Fundamentals",
        author: "O. C. Zienkiewicz, R. L. Taylor & J. Z. Zhu",
        url: "https://doi.org/10.1016/C2009-0-24909-9",
      },
      {
        title: "The FEniCSx tutorial",
        author: "J. S. Dokken",
        url: "https://jsdokken.com/dolfinx-tutorial/",
      },
    ],
  },
  {
    id: "fdm",
    scale: "continuum",
    title: "有限差分方法",
    english: "Finite Difference Method",
    short: "FDM",
    tagline: "用邻居之间的差，近似空间中的导数。",
    description:
      "在规则格点上把微分方程中的导数替换为差分，得到可直接推进或求解的离散方程。",
    length: "μm – m",
    time: "μs – h（依问题）",
    difficulty: "基础",
    prerequisites: ["导数", "网格", "热扩散"],
    intuition:
      "把一块热板分成许多小格子。一个格子的温度高于邻居，就向外散热；低于邻居，就从周围吸热。把这个局部规则应用到整张网格，热量扩散的宏观图像就出现了。",
    concepts: [
      {
        title: "01 · 导数来自局部差值",
        body: "中心差分用左右邻点逼近一阶或二阶导数。二维五点格式由中心与四个邻点构成，是离散 Laplacian 的经典形式。",
      },
      {
        title: "02 · 时间推进有稳定性要求",
        body: "显式 Euler 易于理解，但热方程要求时间步足够小。等距二维网格中 r = αΔt/Δx² ≤ 1/4 是经典稳定性条件；步长太大可产生非物理振荡和发散。",
      },
      {
        title: "03 · 边界条件改变答案",
        body: "固定温度、给定热流、绝热和周期边界对应不同物理情形。本实验边界固定为零温度，热量可以流出，因此域内平均温度下降；若改成周期或绝热边界且无热源，平均温度才应保持不变。",
      },
    ],
    equation: {
      formula:
        "∂T/∂t = α∇²T；Tᶰ⁺¹ᵢⱼ = Tᶰᵢⱼ + r( Tᶰᵢ₊₁,ⱼ + Tᶰᵢ₋₁,ⱼ + Tᶰᵢ,ⱼ₊₁ + Tᶰᵢ,ⱼ₋₁ − 4Tᶰᵢⱼ )",
      explanation:
        "α 为热扩散率，r = αΔt/Δx²。公式针对等距二维网格和显式时间推进；单位与边界条件必须在离散前确定。",
    },
    steps: [
      "设置计算域、网格与初始温度。",
      "用五点差分表示 Laplacian 并施加边界条件。",
      "选择满足稳定条件的时间步，推进温度场。",
      "检查守恒、极值与网格/时间步收敛。",
    ],
    code: '# 2D 热扩散，零温 Dirichlet 边界；与网页实验同类模型\nimport numpy as np\nn, alpha = 32, 0.5\nx, y = np.meshgrid(np.linspace(0,1,n),np.linspace(0,1,n))\nT = np.exp(-((x-0.5)**2+(y-0.5)**2)/0.02)\nT[[0,-1],:] = 0; T[:,[0,-1]] = 0\ndx = 1/(n-1); dt = 0.18*dx*dx; r = alpha*dt/dx**2\ninitial_mean = T.mean()\nfor _ in range(400):\n    lap = T[2:,1:-1]+T[:-2,1:-1]+T[1:-1,2:]+T[1:-1,:-2]-4*T[1:-1,1:-1]\n    T[1:-1,1:-1] += r*lap\nprint("稳定参数 r:", r, "应 <= 0.25")\nprint("初始/当前平均温度:", initial_mean, T.mean())\n# 均温下降：热量通过固定为零的边界流出。',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "一团热量如何铺开",
      description:
        "从高斯热斑开始，用显式差分推进二维热方程。正方形边界保持零温度；调节扩散率和初始峰值，在颜色图与 3D 温度曲面之间切换。",
      observe: [
        "峰值降低时，热量先向周围扩散，再通过零温边界流出。",
        "增大扩散率，温度场趋近边界温度的速度如何变化？",
        "提高初始热斑峰值，比较热量和温度曲面；这是一次性初始条件，不是持续热源。",
      ],
      limitations:
        "无量纲常系数二维热扩散，零温 Dirichlet 边界与稳定时间步。热量可流出边界，所以平均温度不守恒。3D 曲面高度表示温度，不是几何厚度；没有对流、辐射或温度相关材料参数。",
    },
    applications: [
      "热传导与扩散方程",
      "规则域上的波动和流动问题",
      "相场及其他演化 PDE 的快速原型",
    ],
    limitations: [
      "复杂几何与局部网格加密处理较繁琐。",
      "显式方法常受严格时间步限制。",
      "稳定不等于精确，仍需做离散收敛检查。",
    ],
    connections: [
      {
        id: "phase-field",
        reason: "在扩散项上加入自由能导数，就能构建基础相场演化。",
      },
      {
        id: "fem",
        reason: "复杂几何常采用有限元；规则域有限差分实现通常更直接。",
      },
    ],
    references: [
      {
        title:
          "Finite Difference Methods for Ordinary and Partial Differential Equations",
        author: "R. J. LeVeque",
        url: "https://doi.org/10.1137/1.9780898717839",
      },
      {
        title: "Finite Difference Computing with PDEs",
        author: "H. P. Langtangen & S. Linge",
        url: "https://doi.org/10.1007/978-3-319-55456-3",
      },
    ],
  },
];
