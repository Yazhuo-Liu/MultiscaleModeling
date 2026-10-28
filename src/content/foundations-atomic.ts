import type { Locale } from "../i18n";
import type { FoundationId, FoundationLesson } from "./foundations-types";

export const atomicFoundations = {
  "electronic-structure": {
    zh: {
      title: "电子结构：从概率到材料的能量",
      subtitle: "波函数、电子密度、多电子作用，以及电子问题怎样给出力",
      lead: "原子为什么能够结合？晶体改变形状为什么需要能量？电子结构研究电子在给定原子核构型下允许处于哪些状态、如何占据这些状态，以及由此产生的能量和密度。它为成键、磁性与原子间作用提供起点；宏观变形还需要结构、温度和动力学等信息。",
      readMinutes: 18,
      objectives: [
        "分清多电子波函数、电子密度和单电子轨道，知道各自描述什么。",
        "辨认动能、电子—核吸引、电子—电子排斥与核—核排斥。",
        "用一个可手算的氢原子例子理解变分，并说明电子能量如何传递为原子受力。",
      ],
      sections: [
        {
          id: "quantum-state",
          title: "1. 为什么原子中的电子需要量子描述？",
          paragraphs: [
            "在经典图景中，带电粒子绕核加速运动会辐射能量，不能解释原子稳定性与离散光谱。量子力学以状态和概率振幅描述电子。定态的空间概率分布可以保持不变，但这不表示电子沿着某一条固定圆周运动。",
            "把电子限制在更小区域，会增大它的典型动量与动能；靠近正电原子核又会降低库仑势能。这两种趋势的竞争给出原子的有限尺度。海森堡关系是理解这一竞争的入口，但定量能级需要求解 Schrödinger 方程或使用有控制的近似。",
          ],
          equation:
            "\\Delta x\\,\\Delta p_x\\ge\\frac{\\hbar}{2},\\qquad\\hat H\\psi=E\\psi",
          equationNote:
            "$\\Delta x$ 和 $\\Delta p_x$ 是同一量子态的位置与动量标准差；$\\hbar$ 是约化普朗克常数。这里的 $E$ 是定态能量，不是电子绕轨道的经典机械能。",
        },
        {
          id: "wavefunction-density-orbitals",
          title: "2. 波函数、密度和轨道不是同一个对象",
          paragraphs: [
            "单电子波函数 $\\psi(\\mathbf r)$ 是概率振幅：在小体积 $d^3r$ 中发现电子的概率为 $|\\psi(\\mathbf r)|^2d^3r$。振幅可以有正负号或复相位，概率密度始终非负。对一个归一化单电子态，概率积分为 1。",
            "有 $N_e$ 个电子时，完整波函数 $\\Psi$ 同时依赖所有电子的空间与自旋坐标。电子数密度 $n(\\mathbf r)$ 则是把其他电子坐标积分掉后得到的单点统计量，积分为 $N_e$。轨道 $\\phi_i$ 是单电子形式的函数；多电子方法常用轨道构造近似波函数或辅助系统，不能把一组轨道当成各个可区分电子的真实运动路线。",
          ],
          equation:
            "\\int |\\psi(\\mathbf r)|^2\\,d^3r=1,\\qquad\\int n(\\mathbf r)\\,d^3r=N_e,\\qquad n(\\mathbf r)=\\sum_i f_i|\\phi_i(\\mathbf r)|^2",
          equationNote:
            "最后一个式子适用于相应的轨道占据表示；若 $\\phi_i$ 是空间轨道，$f_i$ 可计入两个自旋。密度的单位是长度的负三次方，电子数本身无量纲。",
          table: {
            headers: ["对象", "自变量", "最直接的意义"],
            rows: [
              [
                "多电子波函数 $\\Psi$",
                "全部电子的位置与自旋",
                "给出联合概率振幅，并满足费米子反对称性",
              ],
              [
                "电子密度 $n$",
                "一个空间位置",
                "单位体积的平均电子数；积分给出总电子数",
              ],
              [
                "单电子轨道 $\\phi_i$",
                "一个位置，必要时含自旋",
                "构造近似状态或有效单电子描述的函数",
              ],
            ],
          },
        },
        {
          id: "energy-terms",
          title: "3. 能量中有哪些相互作用？",
          paragraphs: [
            "先把核位置 $\\mathbf R_A$ 固定。非相对论电子 Hamiltonian 包含电子动能、电子—核吸引和电子—电子排斥。前者惩罚波函数过度局域化；两个库仑项的符号来自电荷异号或同号。求和 $i<j$ 保证每一对电子只计算一次，也不会让电子与自己相互作用。",
            "固定核构型下，核—核排斥是电子求解中的常数；比较不同核位置、计算结构稳定性与原子受力时必须加回来。忽略这一项，会把电子能量降低误读为整个材料能量降低。",
          ],
          equation:
            "\\begin{aligned}\\hat H_e(\\mathbf R)&=-\\sum_i\\frac{\\hbar^2}{2m_e}\\nabla_i^2-\\sum_{i,A}\\frac{Z_Ae^2}{4\\pi\\varepsilon_0|\\mathbf r_i-\\mathbf R_A|}+\\sum_{i<j}\\frac{e^2}{4\\pi\\varepsilon_0|\\mathbf r_i-\\mathbf r_j|}\\\\E_{\\mathrm{NN}}(\\mathbf R)&=\\sum_{A<B}\\frac{Z_AZ_Be^2}{4\\pi\\varepsilon_0|\\mathbf R_A-\\mathbf R_B|}\\end{aligned}",
          equationNote:
            "$m_e$ 为电子质量，$e>0$ 为元电荷，$Z_A$ 为核电荷数，$\\varepsilon_0$ 为真空介电常数。本式未加入外场、相对论与自旋—轨道项。",
        },
        {
          id: "many-electron-occupancy",
          title: "4. 多个电子怎样占据状态？",
          paragraphs: [
            "电子是不可区分的费米子。交换任意两个电子的完整坐标后，多电子波函数必须变号；这导致一个自旋轨道最多被一个电子占据。一个空间轨道则可容纳两个相反自旋电子。Pauli 原理约束允许的量子态，不是另加一项经典排斥力。",
            "对近简并的原子轨道，Hund 规则帮助判断低能原子组态：先尽可能形成平行自旋的单占据，再配对。实际能量还取决于轨道间库仑作用、交换与关联。Hartree–Fock 用一个 Slater 行列式处理反对称性与交换；常用 DFT 通过电子密度及交换关联近似处理基态问题。二者都需要说明自己的近似范围。",
          ],
          equation:
            "\\Psi(\\ldots,x_i,\\ldots,x_j,\\ldots)=-\\Psi(\\ldots,x_j,\\ldots,x_i,\\ldots),\\qquad x_i=(\\mathbf r_i,\\sigma_i)",
          equationNote:
            "$\\sigma_i$ 是自旋坐标。Hund 规则不能单独决定晶体的磁性；晶场、杂化和电子相互作用都可能改变占据与自旋状态。",
        },
        {
          id: "electrons-to-forces",
          title: "5. 从自洽电子态到原子运动",
          paragraphs: [
            "在有效单电子方法中，先猜密度或轨道，再构造有效作用、求解新轨道、更新密度，直到输入与输出一致。这是自洽迭代。迭代编号不是物理时间；自洽收敛只说明选定方程内部一致，还需检查基组、取样、泛函、磁态和可能的其他解。",
            "Born–Oppenheimer 近似利用电子通常比原子核运动更快的尺度分离：在每组核位置求电子能量，形成核的势能面，再由势能面对位置的导数计算力。这样电子信息可用于分子动力学、势函数与弹性参数。当电子与核显著非绝热耦合，例如接近某些电子态交叉时，单一基态势能面可能不够。",
          ],
          equation:
            "E_{\\mathrm{BO}}(\\mathbf R)=E_{e,0}(\\mathbf R)+E_{\\mathrm{NN}}(\\mathbf R),\\qquad\\mathbf F_A=-\\nabla_{\\mathbf R_A}E_{\\mathrm{BO}}",
          equationNote:
            "“先固定核”是分步求解的近似，不等于核永不运动。数值计算力时还必须包含所用基组和离散表示要求的导数项。",
        },
      ],
      derivation: {
        title: "从氢原子的一个长度参数，到多电子能量面",
        intro:
          "先取孤立氢原子、固定无限重质子、无外场及非相对论近似。用一个归一化函数展示动能与吸引的竞争，再看哪些步骤能够推广到材料。",
        steps: [
          {
            title: "简单情形：用一个宽度表示电子态",
            explanation:
              "取球对称指数试探函数，参数 $a>0$ 控制空间尺度。对所有空间积分为 1；它给出概率分布，不是一条轨迹。",
            formula:
              "\\psi_a(r)=\\frac{e^{-r/a}}{\\sqrt{\\pi a^3}},\\qquad\\int_0^\\infty4\\pi r^2|\\psi_a(r)|^2\\,dr=1",
          },
          {
            title: "分别计算压缩的代价与吸引的收益",
            explanation:
              "将同一个归一化函数代入动能与核吸引能期望值。随着 $a$ 变小，动能按 $a^{-2}$ 增长，吸引能只按 $-a^{-1}$ 降低。",
            formula:
              "E(a)=\\langle T\\rangle+\\langle V\\rangle=\\frac{\\hbar^2}{2m_ea^2}-\\frac{e^2}{4\\pi\\varepsilon_0a}",
          },
          {
            title: "能量最小化给出玻尔半径与基态能量",
            explanation:
              "令导数为零，找到有限的最优尺度。这个试探函数族恰好包含氢原子 1s 真解，因此在这里得到精确的非相对论、无限核质量结果；换用更受限的函数族时，最小值通常仍有变分误差。",
            formula:
              "\\begin{aligned}\\frac{dE}{da}&=-\\frac{\\hbar^2}{m_ea^3}+\\frac{e^2}{4\\pi\\varepsilon_0a^2}=0\\\\a_*&=a_0=\\frac{4\\pi\\varepsilon_0\\hbar^2}{m_ee^2}\\approx0.529\\,\\text{\\AA}\\\\E(a_0)&=-\\frac{\\hbar^2}{2m_ea_0^2}\\approx-13.6\\,\\mathrm{eV}\\end{aligned}",
            note: "约化质量、精细结构和其他小修正会改变实验能级的更精确数值。",
          },
          {
            title: "一般情形：最小化满足反对称性的多电子状态",
            explanation:
              "多个电子之间有排斥，不能简单复制独立氢原子解。原则上应在归一且反对称的多电子波函数中最小化电子能量；维数随电子数增加，使直接求解迅速变得昂贵。",
            formula:
              "E_{e,0}(\\mathbf R)=\\min_{\\substack{\\langle\\Psi|\\Psi\\rangle=1\\\\\\Psi\\ \\text{antisymmetric}}}\\langle\\Psi|\\hat H_e(\\mathbf R)|\\Psi\\rangle",
            note: "HF 限制允许的波函数形式；DFT 改用密度及相应能量泛函。近似不同，误差来源也不同。",
          },
          {
            title: "扩展：把电子解变成原子核的势能面",
            explanation:
              "对每组核位置求解电子问题并加入核排斥。对核坐标求导得到力，再用于核的运动方程或结构优化；这是电子尺度向原子尺度传递信息的一种方式。",
            formula:
              "E_{\\mathrm{BO}}=E_{e,0}+E_{\\mathrm{NN}},\\qquad\\mathbf F_A=-\\nabla_AE_{\\mathrm{BO}},\\qquad M_A\\ddot{\\mathbf R}_A=\\mathbf F_A",
            note: "最后一个式子还采用经典核运动近似。轻原子、低温或非绝热过程可能需要额外物理。",
          },
        ],
      },
      example: {
        title: "He 的 1s²：一条空间轨道为什么可以有两个电子？",
        problem:
          "在闭壳层独立轨道模型中，两个电子都占据归一化的空间轨道 $\\phi_{1s}$。空间轨道、自旋轨道和总电子数分别是多少？",
        solution: [
          "只有一个被占据的空间轨道，但它与两种自旋函数组合成两个不同的自旋轨道：$\\phi_{1s}\\alpha$ 与 $\\phi_{1s}\\beta$。",
          "每个自旋轨道各占一个电子，因此 $n(\\mathbf r)=2|\\phi_{1s}(\\mathbf r)|^2$，且 $\\int n(\\mathbf r)\\,d^3r=2$。",
          "两个电子不能同时占据完全相同的空间与自旋状态；构造反对称的 Slater 行列式可满足这一要求。",
          "He 的电子—电子作用会改变轨道形状和能量，所以不能直接把氢原子的 1s 函数复制两次就当成精确 He 解。真实电子关联也超出这个单轨道图景。",
        ],
        result:
          "“一条空间轨道”不等于“一个电子”。数电子时要说明是否计入自旋；描述精度时要说明采用了什么多电子近似。",
      },
      misconceptions: [
        {
          myth: "电子云必须由许多电子堆积出来。",
          correction:
            "即使只有一个电子，也可以定义概率密度。大量相同状态的重复位置测量，其统计分布才对应图上的浓淡；图中每一个点不是同时存在的另一颗电子。",
        },
        {
          myth: "自洽收敛就说明得到了精确材料性质。",
          correction:
            "收敛不消除泛函、基组、取样和结构选择的误差，也不保证找到所有可能电子态中的最低能解。需要独立的收敛检查与物理验证。",
        },
        {
          myth: "固定原子核求电子，意味着模型忽略了一切原子运动。",
          correction:
            "Born–Oppenheimer 方法先在给定核构型下求电子，再用得到的势能面研究核的运动。它忽略的是特定电子—核动态耦合，而非所有核运动。",
        },
      ],
      questions: [
        {
          question: "对中性 Fe 的全电子密度积分，应该得到 1 还是 26？",
          answer:
            "得到 26。归一化单电子波函数的模方积分为 1，电子数密度的积分则为总电子数。若计算使用只显式处理价电子的赝势，必须另外说明价电子计数与冻结芯电子。",
        },
        {
          question: "为什么电子—核项为负，而电子—电子项为正？",
          answer:
            "在把无限分离电荷的势能取为零时，异号电荷相互吸引会降低势能，同号电荷相互排斥会提高势能。总能量仍需与动能及其他所有项一起比较。",
        },
        {
          question: "一次结构变化让电子能量降低，能否立即判定结构更稳定？",
          answer:
            "不能。至少还要加入核—核排斥，并使用一致的电子数和参考条件；若比较有限温度下的平衡稳定性，还要考虑相关自由能贡献。",
        },
      ],
      connections: [
        { method: "dft", reason: "继续学习密度、Kohn–Sham 轨道与自洽循环。" },
        {
          method: "hf",
          reason: "用 Slater 行列式理解反对称性、交换和关联的边界。",
        },
        { method: "md", reason: "把势能面的导数作为原子运动方程中的力。" },
      ],
      references: [
        {
          label: "OpenStax Chemistry 2e · 6.3 Development of Quantum Theory",
          url: "https://openstax.org/books/chemistry-2e/pages/6-3-development-of-quantum-theory",
          detail: "量子状态、波粒二象性及不确定性关系的开放教材入口。",
        },
        {
          label: "OpenStax University Physics Vol. 3 · 8.1 The Hydrogen Atom",
          url: "https://openstax.org/books/university-physics-volume-3/pages/8-1-the-hydrogen-atom",
          detail: "氢原子 Schrödinger 方程、量子数和概率分布。",
        },
        {
          label:
            "Kohn & Sham (1965), Self-Consistent Equations Including Exchange and Correlation Effects",
          url: "https://doi.org/10.1103/PhysRev.140.A1133",
          detail: "进阶原始文献：有效单电子描述与交换关联项。",
        },
      ],
    },
    en: {
      title: "Electronic structure: from probability to material energy",
      subtitle:
        "Wavefunctions, electron density, many-electron interactions, and forces",
      lead: "Why can atoms bind, and why does changing a crystal's shape cost energy? Electronic structure asks which states electrons can occupy for a given nuclear arrangement, and what energies and densities those states produce. It provides a starting point for bonding, magnetism, and atomic interactions; macroscopic deformation also requires structure, temperature, and kinetics.",
      readMinutes: 18,
      objectives: [
        "Distinguish a many-electron wavefunction, electron density, and a single-electron orbital.",
        "Identify kinetic energy, electron–nucleus attraction, electron–electron repulsion, and nucleus–nucleus repulsion.",
        "Use a hydrogen example to understand variation and explain how electronic energy becomes an atomic force.",
      ],
      sections: [
        {
          id: "quantum-state",
          title: "1. Why do atomic electrons need a quantum description?",
          paragraphs: [
            "A classical charged particle accelerating around a nucleus would radiate energy. That picture cannot explain stable atoms and discrete spectra. Quantum mechanics describes electrons using states and probability amplitudes. A stationary state's spatial probability distribution can remain unchanged without describing an electron moving around a fixed circular path.",
            "Confining an electron more tightly increases its typical momentum and kinetic energy; bringing it closer to a positive nucleus lowers its Coulomb potential energy. Competition between these trends produces a finite atomic size. The uncertainty relation offers intuition, while quantitative energy levels require the Schrödinger equation or a controlled approximation.",
          ],
          equation:
            "\\Delta x\\,\\Delta p_x\\ge\\frac{\\hbar}{2},\\qquad\\hat H\\psi=E\\psi",
          equationNote:
            "$\\Delta x$ and $\\Delta p_x$ are position and momentum standard deviations for the same quantum state; $\\hbar$ is the reduced Planck constant. Here $E$ is a stationary-state energy, not the classical mechanical energy of an orbiting electron.",
        },
        {
          id: "wavefunction-density-orbitals",
          title:
            "2. Wavefunctions, densities, and orbitals are different objects",
          paragraphs: [
            "A one-electron wavefunction $\\psi(\\mathbf r)$ is a probability amplitude: the probability of detecting the electron in a small volume $d^3r$ is $|\\psi(\\mathbf r)|^2d^3r$. The amplitude can have a sign or a complex phase, while probability density is nonnegative. A normalized one-electron state's probability integrates to 1.",
            "For $N_e$ electrons, the full wavefunction $\\Psi$ depends on every electron's spatial and spin coordinates. The electron number density $n(\\mathbf r)$ is a one-position statistic obtained by integrating out the other coordinates; it integrates to $N_e$. Orbitals $\\phi_i$ are functions of a single electron's coordinates. Many-electron methods use them to construct approximate states or auxiliary systems, not trajectories assigned to distinguishable electrons.",
          ],
          equation:
            "\\int |\\psi(\\mathbf r)|^2\\,d^3r=1,\\qquad\\int n(\\mathbf r)\\,d^3r=N_e,\\qquad n(\\mathbf r)=\\sum_i f_i|\\phi_i(\\mathbf r)|^2",
          equationNote:
            "The last expression applies to the corresponding orbital-occupation representation. If $\\phi_i$ are spatial orbitals, $f_i$ can include both spins. Density has units of inverse volume; electron number is dimensionless.",
          table: {
            headers: ["Object", "Coordinates", "Main meaning"],
            rows: [
              [
                "Many-electron wavefunction $\\Psi$",
                "All electron positions and spins",
                "Joint probability amplitude with fermionic antisymmetry",
              ],
              [
                "Electron density $n$",
                "One spatial position",
                "Mean electron number per volume; integrates to the total electron number",
              ],
              [
                "Single-electron orbital $\\phi_i$",
                "One position, with spin if required",
                "A function used to construct a state or an effective one-electron description",
              ],
            ],
          },
        },
        {
          id: "energy-terms",
          title: "3. Which interactions contribute to the energy?",
          paragraphs: [
            "First hold the nuclear positions $\\mathbf R_A$ fixed. The nonrelativistic electronic Hamiltonian contains electron kinetic energy, electron–nucleus attraction, and electron–electron repulsion. Kinetic energy penalizes excessive localization; the signs of the Coulomb terms follow from opposite or equal charges. The sum over $i<j$ counts each electron pair once and excludes an electron interacting with itself.",
            "At fixed nuclear positions, nucleus–nucleus repulsion is a constant in the electronic problem. It must be included when comparing different nuclear arrangements, evaluating stability, or calculating atomic forces. Lower electronic energy alone does not establish lower total material energy.",
          ],
          equation:
            "\\begin{aligned}\\hat H_e(\\mathbf R)&=-\\sum_i\\frac{\\hbar^2}{2m_e}\\nabla_i^2-\\sum_{i,A}\\frac{Z_Ae^2}{4\\pi\\varepsilon_0|\\mathbf r_i-\\mathbf R_A|}+\\sum_{i<j}\\frac{e^2}{4\\pi\\varepsilon_0|\\mathbf r_i-\\mathbf r_j|}\\\\E_{\\mathrm{NN}}(\\mathbf R)&=\\sum_{A<B}\\frac{Z_AZ_Be^2}{4\\pi\\varepsilon_0|\\mathbf R_A-\\mathbf R_B|}\\end{aligned}",
          equationNote:
            "$m_e$ is the electron mass, $e>0$ the elementary charge, $Z_A$ the nuclear charge number, and $\\varepsilon_0$ the vacuum permittivity. External fields, relativistic effects, and spin–orbit terms are omitted here.",
        },
        {
          id: "many-electron-occupancy",
          title: "4. How do several electrons occupy states?",
          paragraphs: [
            "Electrons are indistinguishable fermions. Exchanging the complete coordinates of any two electrons must change the many-electron wavefunction's sign. A spin orbital can therefore contain at most one electron; a spatial orbital can contain two electrons with opposite spins. The Pauli principle constrains allowed quantum states rather than adding a classical repulsive force.",
            "For nearly degenerate atomic orbitals, Hund's rules help identify low-energy configurations: maximize parallel-spin single occupations before pairing. Actual energies also depend on Coulomb interactions, exchange, and correlation. Hartree–Fock uses one Slater determinant to enforce antisymmetry and include exchange; common DFT calculations use density and exchange–correlation approximations for the ground state. Each approach needs a stated range of validity.",
          ],
          equation:
            "\\Psi(\\ldots,x_i,\\ldots,x_j,\\ldots)=-\\Psi(\\ldots,x_j,\\ldots,x_i,\\ldots),\\qquad x_i=(\\mathbf r_i,\\sigma_i)",
          equationNote:
            "$\\sigma_i$ denotes a spin coordinate. Hund's rules alone do not determine a crystal's magnetism: crystal fields, hybridization, and interactions can change occupations and spin states.",
        },
        {
          id: "electrons-to-forces",
          title: "5. From self-consistent electrons to moving nuclei",
          paragraphs: [
            "An effective one-electron calculation guesses a density or orbitals, builds the effective interaction, solves for new orbitals, and updates the density until input and output agree. This is self-consistency. Iteration number is not physical time. Convergence establishes internal consistency of the chosen equations; basis size, sampling, functional, magnetic state, and alternative solutions still require checks.",
            "The Born–Oppenheimer approximation uses the usual separation between faster electronic and slower nuclear motion. Solve for electronic energy at each nuclear arrangement to obtain a nuclear potential-energy surface, then differentiate that surface to obtain forces. This connects electronic information to molecular dynamics, interatomic potentials, and elastic parameters. Strong nonadiabatic coupling, for example near certain electronic-state crossings, can invalidate a single ground-state surface.",
          ],
          equation:
            "E_{\\mathrm{BO}}(\\mathbf R)=E_{e,0}(\\mathbf R)+E_{\\mathrm{NN}}(\\mathbf R),\\qquad\\mathbf F_A=-\\nabla_{\\mathbf R_A}E_{\\mathrm{BO}}",
          equationNote:
            "Holding nuclei fixed for the electronic step does not mean they never move. Numerical forces must also include derivative terms required by the chosen basis and discretization.",
        },
      ],
      derivation: {
        title:
          "From one length parameter in hydrogen to a many-electron energy surface",
        intro:
          "Assume isolated hydrogen, an infinitely heavy fixed proton, no external field, and nonrelativistic physics. A normalized trial function reveals the competition between kinetic energy and attraction, then shows how the idea extends to materials.",
        steps: [
          {
            title: "Simple case: describe the state with one width",
            explanation:
              "Choose a spherical exponential trial function with spatial scale $a>0$. Its probability integrates to 1 over all space. It describes a distribution, not a trajectory.",
            formula:
              "\\psi_a(r)=\\frac{e^{-r/a}}{\\sqrt{\\pi a^3}},\\qquad\\int_0^\\infty4\\pi r^2|\\psi_a(r)|^2\\,dr=1",
          },
          {
            title:
              "Separate the cost of confinement from the gain in attraction",
            explanation:
              "Evaluate kinetic and nuclear-attraction energies using the same normalized function. As $a$ decreases, kinetic energy grows as $a^{-2}$, while attraction decreases only as $-a^{-1}$.",
            formula:
              "E(a)=\\langle T\\rangle+\\langle V\\rangle=\\frac{\\hbar^2}{2m_ea^2}-\\frac{e^2}{4\\pi\\varepsilon_0a}",
          },
          {
            title:
              "Minimize energy to obtain the Bohr radius and ground-state energy",
            explanation:
              "Set the derivative to zero to find a finite optimal size. This trial family happens to contain the exact hydrogen 1s state, so its minimum is exact within the nonrelativistic, infinite-nuclear-mass assumptions. A more restrictive family generally retains variational error after optimization.",
            formula:
              "\\begin{aligned}\\frac{dE}{da}&=-\\frac{\\hbar^2}{m_ea^3}+\\frac{e^2}{4\\pi\\varepsilon_0a^2}=0\\\\a_*&=a_0=\\frac{4\\pi\\varepsilon_0\\hbar^2}{m_ee^2}\\approx0.529\\,\\text{\\AA}\\\\E(a_0)&=-\\frac{\\hbar^2}{2m_ea_0^2}\\approx-13.6\\,\\mathrm{eV}\\end{aligned}",
            note: "Reduced mass, fine structure, and other small corrections matter for more precise experimental levels.",
          },
          {
            title: "General case: vary an antisymmetric many-electron state",
            explanation:
              "Electron–electron repulsion prevents solving a many-electron atom by copying independent hydrogen solutions. In principle, minimize electronic energy over normalized antisymmetric wavefunctions. The rapidly growing number of coordinates makes direct solution expensive.",
            formula:
              "E_{e,0}(\\mathbf R)=\\min_{\\substack{\\langle\\Psi|\\Psi\\rangle=1\\\\\\Psi\\ \\text{antisymmetric}}}\\langle\\Psi|\\hat H_e(\\mathbf R)|\\Psi\\rangle",
            note: "HF restricts the wavefunction form; DFT reformulates the problem using density and an energy functional. Their approximations introduce different errors.",
          },
          {
            title: "Extension: build the potential-energy surface for nuclei",
            explanation:
              "Solve the electronic problem at each nuclear arrangement and add nuclear repulsion. Differentiate with respect to nuclear coordinates to obtain forces for nuclear motion or structure optimization. This is one route for passing information from electronic to atomistic scales.",
            formula:
              "E_{\\mathrm{BO}}=E_{e,0}+E_{\\mathrm{NN}},\\qquad\\mathbf F_A=-\\nabla_AE_{\\mathrm{BO}},\\qquad M_A\\ddot{\\mathbf R}_A=\\mathbf F_A",
            note: "The final equation also assumes classical nuclei. Light atoms, low temperatures, or nonadiabatic processes may require additional physics.",
          },
        ],
      },
      example: {
        title: "He 1s²: how can one spatial orbital contain two electrons?",
        problem:
          "In a closed-shell independent-orbital model, two electrons occupy the normalized spatial orbital $\\phi_{1s}$. How many occupied spatial orbitals, spin orbitals, and electrons are there?",
        solution: [
          "There is one occupied spatial orbital. Combining it with two spin functions produces two distinct spin orbitals, $\\phi_{1s}\\alpha$ and $\\phi_{1s}\\beta$.",
          "Each spin orbital contains one electron, so $n(\\mathbf r)=2|\\phi_{1s}(\\mathbf r)|^2$ and $\\int n(\\mathbf r)\\,d^3r=2$.",
          "The electrons cannot occupy exactly the same spatial and spin state. An antisymmetric Slater determinant enforces this requirement.",
          "Electron–electron interactions change the helium orbital and its energy. Copying the hydrogen 1s function twice does not give exact helium; genuine electron correlation also goes beyond this single-orbital picture.",
        ],
        result:
          "One spatial orbital does not mean one electron. State whether spin is included when counting states, and specify the many-electron approximation when discussing accuracy.",
      },
      misconceptions: [
        {
          myth: "An electron cloud requires many electrons piled together.",
          correction:
            "A single electron also has a probability density. Repeated position measurements on identically prepared states reproduce the plotted distribution; each displayed point is not another simultaneously present electron.",
        },
        {
          myth: "Self-consistency guarantees exact material properties.",
          correction:
            "Convergence does not remove functional, basis, sampling, or structural errors, and does not guarantee the lowest-energy solution among all possible electronic states. Independent convergence checks and physical validation remain necessary.",
        },
        {
          myth: "Fixing nuclei for an electronic calculation removes all atomic motion.",
          correction:
            "Born–Oppenheimer methods first solve electrons at a given nuclear arrangement, then study nuclear motion on the resulting surface. The approximation neglects specific dynamical electron–nucleus coupling, not every form of nuclear motion.",
        },
      ],
      questions: [
        {
          question:
            "Does the all-electron density of neutral Fe integrate to 1 or 26?",
          answer:
            "It integrates to 26. The squared magnitude of a normalized one-electron wavefunction integrates to 1; electron number density integrates to the total electron count. A valence-only pseudopotential calculation must separately identify its explicit valence count and frozen core.",
        },
        {
          question:
            "Why is the electron–nucleus term negative and the electron–electron term positive?",
          answer:
            "With zero potential energy at infinite charge separation, attraction between opposite charges lowers potential energy and repulsion between like charges raises it. Compare total energy only after including kinetic energy and all other terms.",
        },
        {
          question:
            "Does a structural change that lowers electronic energy necessarily improve stability?",
          answer:
            "No. At minimum, include nuclear repulsion and compare consistent electron numbers and reference conditions. Equilibrium stability at finite temperature can also require relevant free-energy contributions.",
        },
      ],
      connections: [
        {
          method: "dft",
          reason:
            "Develop density, Kohn–Sham orbitals, and self-consistent iteration.",
        },
        {
          method: "hf",
          reason:
            "Use Slater determinants to understand antisymmetry, exchange, and missing correlation.",
        },
        {
          method: "md",
          reason:
            "Use potential-energy derivatives as forces in atomic equations of motion.",
        },
      ],
      references: [
        {
          label: "OpenStax Chemistry 2e · 6.3 Development of Quantum Theory",
          url: "https://openstax.org/books/chemistry-2e/pages/6-3-development-of-quantum-theory",
          detail:
            "An open introduction to quantum states, wave–particle duality, and uncertainty.",
        },
        {
          label: "OpenStax University Physics Vol. 3 · 8.1 The Hydrogen Atom",
          url: "https://openstax.org/books/university-physics-volume-3/pages/8-1-the-hydrogen-atom",
          detail:
            "Hydrogen's Schrödinger equation, quantum numbers, and probability distributions.",
        },
        {
          label:
            "Kohn & Sham (1965), Self-Consistent Equations Including Exchange and Correlation Effects",
          url: "https://doi.org/10.1103/PhysRev.140.A1133",
          detail:
            "Advanced primary reference for the effective one-electron description and exchange–correlation terms.",
        },
      ],
    },
  },
  "atomic-orbitals": {
    zh: {
      title: "原子轨道：从氢到 Fe 的分层图景",
      subtitle: "电子层与占据、真正的三维轨道、节点与概率",
      lead: "从电子层展开到亚层，再旋转、剖切一个三维轨道，可以逐步读懂原子图示。氢展示可解析的单电子波函数；Fe 展示带有屏蔽近似的 3d 与 4s 空间分布。图上的每个位置对应三个空间坐标，但三维图形的完整性不等于多电子模型的精确性。轨道也不是电子运动路线。",
      readMinutes: 27,
      objectives: [
        "沿“原子→电子层→亚层→轨道”解释量子数与容纳电子数。",
        "用 1s、2s 和 2p 区分相位、节点、空间概率密度与径向概率。",
        "读懂自由中性 Fe 的电子组态，并辨认它与金属 Fe 能带的区别。",
        "区分三维密度、剖切面、等值阈值与包围概率，并说明 Fe 屏蔽模型的边界。",
      ],
      sections: [
        {
          id: "hierarchy",
          title: "1. 先看层级：一层电子不只是一条轨道",
          paragraphs: [
            "主量子数 $n$ 标记电子层；角动量量子数 $l=0,1,2,3$ 对应 s、p、d、f 亚层。给定 $l$ 有 $2l+1$ 个空间轨道，每个可容纳两个相反自旋电子。因此 s、p、d 亚层最多容纳 2、6、10 个电子，而不是每个亚层只有一个电子。",
            "这些量子数在球对称单电子问题中有清楚的定义；多电子原子的组态符号延续了这一有用的描述。电子层的容量与实际占据不同。多电子原子的能量不只取决于 $n$，所以不能按“第一层装满，再把第二、第三层全部装满”的规则推断所有基态。",
          ],
          equation:
            "n=1,2,\\ldots;\\quad l=0,\\ldots,n-1;\\quad m_l=-l,\\ldots,l;\\quad m_s=\\pm\\frac12",
          equationNote:
            "$m_l$ 区分同一亚层中的角向状态；$m_s$ 是自旋投影量子数。熟悉的实 p、d 轨道可以由相应角向态的线性组合构成。",
          table: {
            headers: ["层级", "例子", "数量或容量"],
            rows: [
              ["电子层", "$n=3$", "含 3s、3p、3d；最多 $2n^2=18$ 个电子"],
              ["亚层", "3d：$n=3,\\ l=2$", "五个空间轨道，最多 10 个电子"],
              ["空间轨道", "$3d_{xy}$", "最多两个相反自旋电子"],
              ["自旋轨道", "$3d_{xy}\\alpha$", "最多一个电子"],
            ],
          },
        },
        {
          id: "hydrogen-shapes",
          title: "2. 氢轨道：形状、相位与节点",
          paragraphs: [
            "对于无外场、固定质子的非相对论氢原子，1s、2s、2p 可以解析求出。1s 球对称且没有节点；2s 在 $r=2a_0$ 有一个球形径向节点。$2p_x,2p_y,2p_z$ 分别沿三个坐标方向，具有两个异相位叶瓣，节点分别为 $x=0,y=0,z=0$ 平面。下式中 $r=\\sqrt{x^2+y^2+z^2}$，$a_0$ 为玻尔半径；函数直接定义在三维空间，而不是把一个截面拉伸。",
            "两种轨道颜色通常表示波函数的相对正负相位，而不是正负电荷。一个轨道整体乘以 $-1$ 不改变密度；不同轨道叠加时，相对相位却会影响干涉和成键。若用等值面显示轨道，等值面的阈值由人为选定，不是电子云的硬边界。",
          ],
          equation:
            "\\begin{aligned}\\psi_{1s}&=\\frac{e^{-r/a_0}}{\\sqrt{\\pi a_0^3}}\\\\\\psi_{2s}&=\\frac{(2-r/a_0)e^{-r/(2a_0)}}{4\\sqrt{2\\pi a_0^3}}\\\\\\psi_{2p_\\alpha}&=\\frac{(x_\\alpha/a_0)e^{-r/(2a_0)}}{4\\sqrt{2\\pi a_0^3}},\\quad x_\\alpha\\in\\{x,y,z\\}\\end{aligned}",
          equationNote:
            "这些函数都归一化为单电子概率 1。对该氢模型，$E_n=-13.6\\,\\mathrm{eV}/n^2$；相对论、有限质子质量和外场会修正更精确能级。三种实 2p 轨道在无外场时简并，可以选择其他等价的方向基。",
          bullets: [
            "对这里展示的实氢轨道，径向节点数为 $n-l-1$；角节点数为 $l$。这里不把无穷远或由体积因子产生的 $r=0$ 径向概率零点算成径向节点。",
            "$d_{z^2}$ 的角节点是锥面，图形包含轴向叶瓣与赤道环；不是所有 d 轨道都长成相同的四叶形。",
            "在无外场的球对称问题中，选取 x、y、z 方向是选择坐标和轨道基，不是发现原子自带三根固定方向的轴。",
          ],
        },
        {
          id: "radial-probability",
          title: "3. 为什么 1s 密度在核处最大，最可能半径却是 a₀？",
          paragraphs: [
            "空间概率密度比较的是相同小体积中的概率。径向概率则把半径 $r$ 到 $r+dr$ 的整个薄球壳加起来：球壳越远，包含的体积通常越大。因此“每单位体积最密”与“同样厚度球壳内最可能”是两个不同问题。",
            "1s 的密度 $|\\psi_{1s}|^2$ 在核处最大，但其径向概率 $P_{1s}(r)$ 在 $r=a_0$ 最大。对非球对称的 p、d 轨道，必须先对方向积分，不能把某条射线上的密度直接乘 $4\\pi r^2$。连续分布在一个精确半径或单个点上的概率为零，实际比较的是有限范围。",
          ],
          equation:
            "P(r)=r^2\\int|\\psi(r,\\theta,\\varphi)|^2\\,d\\Omega,\\qquad P_{1s}(r)=\\frac{4r^2}{a_0^3}e^{-2r/a_0},\\qquad\\int_0^\\infty P(r)\\,dr=1",
          equationNote:
            "$P$ 的单位是长度的负一次方，$P(r)dr$ 才是无量纲概率。对球对称 1s，角积分才简化为 $4\\pi|\\psi|^2$。",
          table: {
            headers: ["氢轨道", "径向节点", "角节点", "径向概率特征"],
            rows: [
              ["1s", "无", "无", "峰在 $a_0$"],
              ["2s", "$r=2a_0$", "无", "节点两侧各有一个峰"],
              [
                "$2p_z$",
                "无",
                "$z=0$ 平面",
                "峰在 $4a_0$；核处为零不额外算径向节点",
              ],
            ],
          },
        },
        {
          id: "iron-occupancy",
          title: "4. 展开 Fe：26 个电子如何分层与占据？",
          paragraphs: [
            "自由中性 Fe 原子的基态组态写作 $[\\mathrm{Ar}]\\,3d^6 4s^2$。展开后为 $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^6\\,4s^2$，四个电子层的占据依次是 2、8、14、2。第三层仍有未占满的 3d 状态，第四层已经有电子，这说明层号不是一个固定的填充能量排序。",
            "在常用的原子占据示意中，五个 d 轨道先各放一个同自旋电子，第六个电子与其中一个配对，留下四个未配对电子。图中把配对画在某个盒子里只是选取一种表示；无外场的自由原子没有唯一指定的某个实 d 轨道必须先配对。完整原子态还涉及不同组态和角动量的组合。",
          ],
          equation:
            "\\mathrm{Fe}:\\ [\\mathrm{Ar}]\\,3d^6 4s^2,\\qquad N_e=18+6+2=26,\\qquad (N_1,N_2,N_3,N_4)=(2,8,14,2)",
          equationNote:
            "这是自由中性原子的组态入口，不是 Fe 离子或晶体的完整描述。占据、屏蔽与电离会改变有效轨道能量；4s 与 3d 不存在适用于所有环境的固定先后顺序。",
          table: {
            headers: ["电子层", "已占据亚层", "电子数"],
            rows: [
              ["$n=1$", "$1s^2$", "2"],
              ["$n=2$", "$2s^2\\,2p^6$", "8"],
              ["$n=3$", "$3s^2\\,3p^6\\,3d^6$", "14"],
              ["$n=4$", "$4s^2$", "2"],
            ],
          },
        },
        {
          id: "iron-radial-model",
          title: "5. Fe 的三维近似：角向形状还需要径向函数",
          paragraphs: [
            "只有 $r_{\\mathrm{surface}}\\propto|Y_{2m}|$ 的叶瓣图展示的是角向振幅，不是完整轨道。本实验对五个实 3d 轨道及 4s 使用归一化的氢样径向函数乘球谐函数，得到可在任意 $(x,y,z)$ 处求值的 $\\psi=R_{nl}Y_{lm}$。这是带屏蔽的孤立原子教学模型；五个 3d 轨道有相同径向函数而方向不同，4s 为球对称分布。",
            "屏蔽电荷按 Slater 分组规则估算。对一个 3d 电子，18 个内层电子各屏蔽 1，同组其余 5 个电子各屏蔽 0.35，故 $Z_{\\mathrm{eff}}=6.25$。对一个 4s 电子，前两层的 10 个电子各贡献 1，第三层 14 个电子各贡献 0.85，另一个 4s 电子贡献 0.35，得到 $Z_{\\mathrm{eff}}=3.75$。这些数是模型参数，不是测得的原子核电荷。",
            "氢样模型保留 $n-l-1$ 个径向节点：3d 没有内部径向节点，4s 有三个球形径向节点。4s 的内层结构较细，球对称性允许直接求等密度半径并形成球面；3d 则在完整三维采样网格上提取等值面。二者都根据三维函数构造，不将二维图片旋转或拉伸当作计算。",
          ],
          equation:
            "\\begin{aligned}\\psi_{nlm}(\\mathbf r)&=R_{nl}^{(Z_{\\mathrm{eff}})}(r)Y_{lm}(\\theta,\\varphi),\\qquad \\rho=\\frac{2Z_{\\mathrm{eff}}r}{na_0}\\\\R_{nl}(r)&=\\left(\\frac{2Z_{\\mathrm{eff}}}{na_0}\\right)^{3/2}\\sqrt{\\frac{(n-l-1)!}{2n(n+l)!}}\\ e^{-\\rho/2}\\rho^l L_{n-l-1}^{2l+1}(\\rho)\\end{aligned}",
          equationNote:
            "$L_{n-l-1}^{2l+1}$ 是关联 Laguerre 多项式，$Y_{lm}$ 取归一化实角函数。这里把 Slater 的屏蔽估计用于氢样径向函数，并非直接使用无径向节点的 Slater 型基函数。归一化描述单个轨道，不把这一个轨道当成 Fe 的全部 26 个电子。",
          table: {
            headers: ["模型轨道", "有效核电荷", "径向节点", "角节点"],
            rows: [
              ["五个 3d", "$6.25$", "0", "2；平面或锥面取决于实轨道"],
              ["4s", "$3.75$", "3 个球面", "0"],
            ],
          },
        },
        {
          id: "reading-3d",
          title: "6. 如何读三维轨道：等值面、概率云与剖切",
          paragraphs: [
            "等值面连接密度相同的空间位置。控制中的阈值 $\\eta$ 是相对最大密度 $n_{\\max}$ 的比例；例如 $\\eta=0.05$ 表示表面处密度为最大值的 5%，不表示表面包住 5% 或 95% 的电子概率。改变阈值会改变表面大小，某些较弱叶瓣或内外层表面可能出现、合并或消失。颜色仍只表示实波函数的正负相位。",
            "概率云按 $|\\psi|^2$ 在有限绘图区内采样；点多的区域更可能找到电子，点不是一组同时存在的电子，也不描画轨迹。图形的计算范围会截去很小的远端尾部。密度等值面本身不携带“里面总共有多少概率”的答案，后者必须对体积积分。",
            "xy、xz、yz 剖切面固定一个坐标，另外两个坐标仍来自同一个三维波函数。移动剖切位置可以穿过节点、叶瓣和球壳。例如 $2p_z$ 的中心 xy 截面恰好位于角节点，整面为零；把剖面沿 z 移开才出现密度。4s 的径向节点则在过核截面中成为三个圆，而离核截面未必穿过全部节点。",
          ],
          equation:
            "\\mathcal S_\\eta=\\{\\mathbf r:|\\psi(\\mathbf r)|^2=\\eta\\,n_{\\max}\\},\\qquad P_\\eta=\\int_{|\\psi|^2\\geq\\eta n_{\\max}}|\\psi(\\mathbf r)|^2\\,d^3r",
          equationNote:
            "$P_\\eta$ 是对满足阈值条件的全部区域积分，可能包含不连通的叶瓣或球壳；一般不等于 $\\eta$ 或 $1-\\eta$。显示框与有限网格还带来截断、采样和网格误差。",
        },
        {
          id: "atom-to-solid",
          title: "7. 从自由 Fe 原子到金属 Fe：哪些图景必须改变？",
          paragraphs: [
            "Fe 有 26 个相互作用电子，不能把氢公式中的核电荷换成 26，就宣称得到了真实 Fe 的能级与径向分布。即使引入这里的常数 $Z_{\\mathrm{eff}}$，屏蔽仍只是粗略平均，交换、关联和自洽轨道弛豫也没有求解。当前 Fe 图形是完整三维的近似单轨道密度，却不是精确 Fe 原子的 HF/DFT 结果，更不是金属 Fe 的总电子密度。",
            "很多 Fe 原子组成晶体后，邻近轨道发生耦合，原子的 3d、4s 等成分进入延展的、相互杂化的能带。能量依赖波矢和自旋，费米能级附近的占据关系到导电与磁性。孤立原子有几个未配对电子，不能直接当成金属中每个原子的磁矩；需要在实际晶体结构和电子态中求解。",
          ],
          equation:
            "\\psi_{nlm}^{\\mathrm{atom}}\\approx R_{nl}^{\\mathrm{eff}}(r)Y_{lm}(\\theta,\\varphi),\\qquad\\psi_{\\nu\\mathbf k}^{\\mathrm{crystal}}(\\mathbf r)=e^{i\\mathbf k\\cdot\\mathbf r}u_{\\nu\\mathbf k}(\\mathbf r)",
          equationNote:
            "左式是中心场原子轨道近似，径向函数必须由适当模型得到；右式是周期晶体的 Bloch 形式，$u$ 具有晶格周期性，$\\nu$ 是能带编号。两者中的标签不应机械对应。",
        },
      ],
      derivation: {
        title: "从空间概率到径向分布，再到多电子轨道",
        intro:
          "沿着“一个小体积→整个薄球壳→可测的范围概率”推导。这样可以理解图上浓淡、节点与半径曲线分别在展示什么。",
        steps: [
          {
            title: "简单情形：先写出小体积的概率",
            explanation:
              "在球坐标中，体积元包含 $r^2\\sin\\theta$。半径相同、厚度相同的薄球壳，其体积会随半径改变。",
            formula:
              "d\\mathcal P=|\\psi(r,\\theta,\\varphi)|^2r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi",
          },
          {
            title: "对所有方向求和，得到径向概率",
            explanation:
              "若 $\\psi=R_{nl}Y_{lm}$ 且角函数归一，角积分等于 1。径向分布因此是 $r^2|R_{nl}|^2$；只有球对称密度才可直接写成 $4\\pi r^2|\\psi|^2$。",
            formula:
              "\\int|Y_{lm}|^2\\,d\\Omega=1\\quad\\Longrightarrow\\quad P_{nl}(r)=r^2|R_{nl}(r)|^2",
          },
          {
            title: "代入 1s，定位同厚度球壳的概率峰",
            explanation:
              "对径向概率求导，非零内部极值在 $a_0$。核处的密度虽最大，但球壳体积趋于零，所以径向概率在 $r=0$ 为零。",
            formula:
              "\\begin{aligned}P_{1s}(r)&=\\frac{4r^2}{a_0^3}e^{-2r/a_0}\\\\\\frac{dP_{1s}}{dr}&=\\frac{8r}{a_0^3}e^{-2r/a_0}\\left(1-\\frac r{a_0}\\right)\\quad\\Rightarrow\\quad r_{\\mathrm{peak}}=a_0\\end{aligned}",
          },
          {
            title: "一般情形：径向节点与角节点各自留下什么痕迹？",
            explanation:
              "2s 的径向函数在 $2a_0$ 变号，径向概率也在这里为零。2p 的径向分布没有内部零点；它的节点来自角向部分，不能只凭径向曲线看到那个节点平面。",
            formula:
              "P_{2s}(r)=\\frac{r^2}{8a_0^3}\\left(2-\\frac r{a_0}\\right)^2e^{-r/a_0},\\qquad P_{2p}(r)=\\frac{r^4}{24a_0^5}e^{-r/a_0}",
            note: "两条曲线都对 $r\\in[0,\\infty)$ 积分为 1。$2p_z$ 在 $z=0$ 的角节点仍存在，但方向积分将角向信息合并了。",
          },
          {
            title: "扩展到 Fe：保留角向语言，重新求径向与占据",
            explanation:
              "中心场近似保留球谐函数的角向分类，却要通过包含屏蔽和多电子效应的有效势求径向函数。不能用轨道轮廓图替代这种求解，也不能把自由原子占据直接搬到晶体能带。",
            formula:
              "\\left[-\\frac{\\hbar^2}{2m_e}\\frac{d^2}{dr^2}+\\frac{\\hbar^2l(l+1)}{2m_er^2}+V_{\\mathrm{eff}}(r)\\right]u_{nl}(r)=\\varepsilon_{nl}u_{nl}(r),\\qquad u_{nl}=rR_{nl}",
            note: "这是局域球对称有效势模型的径向方程，不是精确 Fe 多电子方程。完整 HF 交换等作用也不能总写成同一个局域势。",
          },
          {
            title: "一个可计算的近似：先估计屏蔽，再构造完整轨道",
            explanation:
              "用自由中性 Fe 的占据数计算屏蔽常数，得到轨道依赖的 $Z_{\\mathrm{eff}}$。将其代入前面的归一化 $R_{nl}$，再乘实球谐函数，即可计算任意三维位置的振幅。常数屏蔽并不恢复完整多电子相互作用。",
            formula:
              "\\begin{aligned}Z_{\\mathrm{eff}}(3d)&=26-[18+5(0.35)]=6.25\\\\Z_{\\mathrm{eff}}(4s)&=26-[10+14(0.85)+1(0.35)]=3.75\\end{aligned}",
            note: "对 4s，径向多项式为 $L_3^1(\\rho)=4-6\\rho+2\\rho^2-\\rho^3/6$，三个正根给出三个径向节点；3d 的径向多项式为常数，因此没有内部径向节点。",
          },
        ],
      },
      example: {
        title: "玻尔半径以内，找到氢 1s 电子的概率有多大？",
        problem:
          "已知 $P_{1s}(r)=4r^2e^{-2r/a_0}/a_0^3$。径向概率峰在 $a_0$，是否意味着大部分概率都包含在半径 $a_0$ 以内？",
        solution: [
          "范围概率要对径向分布积分，而不是读取曲线峰值：$\\mathcal P(r<a_0)=\\int_0^{a_0}P_{1s}(r)\\,dr$。",
          "令 $x=r/a_0$，积分变为 $\\int_0^1 4x^2e^{-2x}\\,dx$。一个原函数是 $-e^{-2x}(2x^2+2x+1)$。",
          "代入上下限得 $\\mathcal P(r<a_0)=1-5e^{-2}\\approx0.323$，外侧概率约为 0.677。",
        ],
        result:
          "玻尔半径是 1s 径向概率的峰位置，不是包住整个原子的边界，也不是包含大部分概率的半径。改变等值面阈值会改变画出的“轨道大小”。",
      },
      misconceptions: [
        {
          myth: "轨道上的两种颜色代表正电子和负电子。",
          correction:
            "它们通常标记实波函数的相对相位。两处的电子电荷都为负，概率密度都非负；相位影响叠加干涉，并不是电荷符号。",
        },
        {
          myth: "既然 1s 的径向概率在核处为零，核处的波函数也一定为零。",
          correction:
            "1s 波函数在核处非零。径向概率含有 $r^2$ 体积因子，球壳体积趋零导致径向概率为零；这不是 1s 的径向节点。",
        },
        {
          myth: "Fe 的轨道与氢相同，只需把核电荷改成 26。",
          correction:
            "这会忽略屏蔽、电子间相互作用与占据对能量的影响。角向对称性示意可复用，定量径向分布、能级及金属 Fe 的能带必须使用相应多电子模型。",
        },
      ],
      questions: [
        {
          question:
            "Fe 第三层只有 14 个电子，与第三层最多容纳 18 个电子矛盾吗？",
          answer:
            "不矛盾。18 是该层的容量，14 是自由中性 Fe 基态的实际占据。3s²、3p⁶、3d⁶ 共 14 个电子；同时 4s 已占据两个电子，能量排序不等于层号排序。",
        },
        {
          question: "2s 在径向节点两侧变号，概率密度也会变成负数吗？",
          answer:
            "不会。概率密度是模方；节点处为零，两侧均非负。波函数相位改变会影响与其他函数的叠加，但不会让单个态的位置概率变负。",
        },
        {
          question: "为什么一条 2p 径向概率曲线看不出 p 轨道的两个叶瓣？",
          answer:
            "径向分布已经对所有方向积分，只保留半径信息。两个叶瓣和它们之间的节点平面来自角函数；要同时观察空间图与径向图才能区分二者。",
        },
        {
          question: "把等值面阈值设为最大密度的 5%，是否表示包住 95% 的概率？",
          answer:
            "不是。阈值约束的是表面上的局部密度，概率是对三维体积的积分。必须计算 $P_\\eta=\\int_{|\\psi|^2\\geq\\eta n_{\\max}}|\\psi|^2\\,d^3r$ 才能判断对应概率，二者没有简单的 5% 与 95% 关系。",
        },
      ],
      connections: [
        {
          method: "hf",
          reason: "将单电子轨道与占据扩展成反对称的多电子状态。",
        },
        {
          method: "dft",
          reason: "在有效势中求轨道与密度，并区分原子态和周期晶体态。",
        },
      ],
      references: [
        {
          label: "OpenStax University Physics Vol. 3 · 8.1 The Hydrogen Atom",
          url: "https://openstax.org/books/university-physics-volume-3/pages/8-1-the-hydrogen-atom",
          detail: "氢原子量子数、概率密度与径向概率的开放教材。",
        },
        {
          label: "OpenStax Chemistry 2e · 6.4 Electronic Structure of Atoms",
          url: "https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations",
          detail: "电子组态、Pauli 原理与 Hund 规则的入门解释。",
        },
        {
          label: "NIST Handbook · Iron Atomic Data",
          url: "https://physics.nist.gov/PhysRefData/Handbook/Tables/irontable1.htm",
          detail:
            "自由中性 Fe 与离子的基态组态和原子数据；不要与金属 Fe 的能带混同。",
        },
        {
          label: "J. C. Slater · Atomic Shielding Constants (1930)",
          url: "https://doi.org/10.1103/PhysRev.36.57",
          detail:
            "有效核电荷的经验屏蔽分组规则。此处将屏蔽估计与氢样径向函数组合，是教学近似，不等同于真实 Fe 的自洽电子结构。",
        },
      ],
    },
    en: {
      title: "Atomic orbitals: a layered view from hydrogen to Fe",
      subtitle:
        "Shells and occupations, full 3D orbitals, nodes, and probability",
      lead: "Open an atom into shells and subshells, then rotate and slice a three-dimensional orbital. Hydrogen supplies analytic one-electron wavefunctions; Fe illustrates screened approximations to 3d and 4s spatial distributions. Every displayed location has three spatial coordinates, but a complete 3D shape does not make a many-electron model exact. An orbital is not an electron trajectory.",
      readMinutes: 27,
      objectives: [
        "Use atom → shell → subshell → orbital to explain quantum numbers and electron capacities.",
        "Distinguish phase, nodes, spatial probability density, and radial probability using 1s, 2s, and 2p.",
        "Read the configuration of free neutral Fe and distinguish it from the bands of metallic Fe.",
        "Distinguish a 3D density, a section, an isovalue, and enclosed probability, and explain the limits of the screened Fe model.",
      ],
      sections: [
        {
          id: "hierarchy",
          title:
            "1. Start with the hierarchy: a shell contains several orbitals",
          paragraphs: [
            "The principal quantum number $n$ labels a shell; angular-momentum quantum numbers $l=0,1,2,3$ correspond to s, p, d, and f subshells. A given $l$ has $2l+1$ spatial orbitals, each accommodating two opposite-spin electrons. Thus s, p, and d subshells can contain 2, 6, and 10 electrons.",
            "These quantum numbers have precise meanings in a spherical one-electron problem, and many-electron configurations retain their useful classification. A shell's capacity is different from its actual occupation. Many-electron energies depend on more than $n$, so ground states cannot generally be inferred by filling every shell completely before opening the next.",
          ],
          equation:
            "n=1,2,\\ldots;\\quad l=0,\\ldots,n-1;\\quad m_l=-l,\\ldots,l;\\quad m_s=\\pm\\frac12",
          equationNote:
            "$m_l$ distinguishes angular states within a subshell; $m_s$ labels spin projection. Familiar real p and d orbitals can be formed as linear combinations of the corresponding angular states.",
          table: {
            headers: ["Level", "Example", "Count or capacity"],
            rows: [
              [
                "Shell",
                "$n=3$",
                "Contains 3s, 3p, 3d; up to $2n^2=18$ electrons",
              ],
              [
                "Subshell",
                "3d: $n=3,\\ l=2$",
                "Five spatial orbitals; up to 10 electrons",
              ],
              [
                "Spatial orbital",
                "$3d_{xy}$",
                "Up to two opposite-spin electrons",
              ],
              ["Spin orbital", "$3d_{xy}\\alpha$", "Up to one electron"],
            ],
          },
        },
        {
          id: "hydrogen-shapes",
          title: "2. Hydrogen orbitals: shapes, phases, and nodes",
          paragraphs: [
            "For nonrelativistic hydrogen with a fixed proton and no external field, 1s, 2s, and 2p have analytic solutions. The spherical 1s state has no nodes; 2s has a radial nodal sphere at $r=2a_0$. The $2p_x,2p_y,2p_z$ states lie along the three coordinate directions, each with two opposite-phase lobes and a nodal plane at $x=0,y=0,z=0$, respectively. Below, $r=\\sqrt{x^2+y^2+z^2}$ and $a_0$ is the Bohr radius: these are functions of three spatial coordinates, not extruded sections.",
            "Two orbital colors usually indicate relative wavefunction phase, not positive and negative electric charge. Multiplying an entire orbital by $-1$ leaves its density unchanged, but relative phase affects interference and bonding when orbitals are combined. An isosurface uses a chosen threshold; it is not a hard edge of an electron cloud.",
          ],
          equation:
            "\\begin{aligned}\\psi_{1s}&=\\frac{e^{-r/a_0}}{\\sqrt{\\pi a_0^3}}\\\\\\psi_{2s}&=\\frac{(2-r/a_0)e^{-r/(2a_0)}}{4\\sqrt{2\\pi a_0^3}}\\\\\\psi_{2p_\\alpha}&=\\frac{(x_\\alpha/a_0)e^{-r/(2a_0)}}{4\\sqrt{2\\pi a_0^3}},\\quad x_\\alpha\\in\\{x,y,z\\}\\end{aligned}",
          equationNote:
            "Each function is normalized to one-electron probability 1. For this hydrogen model, $E_n=-13.6\\,\\mathrm{eV}/n^2$; relativity, finite proton mass, and external fields modify precise levels. The three real 2p states are degenerate without external fields, and equivalent directional bases may be chosen.",
          bullets: [
            "For the real hydrogen orbitals shown here, there are $n-l-1$ radial nodes and $l$ angular nodes. Infinity and the zero of radial probability at $r=0$ caused by the volume factor are not counted as radial nodes.",
            "The angular nodes of $d_{z^2}$ are cones; its shape includes axial lobes and an equatorial ring. Not every d orbital is the same four-lobed shape.",
            "In a spherical problem without an external field, choosing x, y, and z selects coordinates and an orbital basis; it does not identify three built-in physical axes of the atom.",
          ],
        },
        {
          id: "radial-probability",
          title:
            "3. Why does 1s peak at the nucleus in density, but at a₀ in radius?",
          paragraphs: [
            "Spatial probability density compares probabilities in equal small volumes. Radial probability instead sums over the entire thin spherical shell between $r$ and $r+dr$. More distant shells generally contain more volume. The highest probability per unit volume and the most probable equal-thickness shell therefore answer different questions.",
            "The 1s density $|\\psi_{1s}|^2$ is largest at the nucleus, while its radial distribution $P_{1s}(r)$ is largest at $r=a_0$. For nonspherical p or d orbitals, integrate over directions rather than multiplying the density on an arbitrary ray by $4\\pi r^2$. In a continuous distribution, an exact radius or single point has zero probability; meaningful probability comparisons use finite intervals or volumes.",
          ],
          equation:
            "P(r)=r^2\\int|\\psi(r,\\theta,\\varphi)|^2\\,d\\Omega,\\qquad P_{1s}(r)=\\frac{4r^2}{a_0^3}e^{-2r/a_0},\\qquad\\int_0^\\infty P(r)\\,dr=1",
          equationNote:
            "$P$ has units of inverse length, while $P(r)dr$ is dimensionless probability. For spherical 1s, the angular integral simplifies to $4\\pi|\\psi|^2$.",
          table: {
            headers: [
              "Hydrogen orbital",
              "Radial nodes",
              "Angular nodes",
              "Radial distribution",
            ],
            rows: [
              ["1s", "None", "None", "Peak at $a_0$"],
              ["2s", "$r=2a_0$", "None", "One peak on each side of the node"],
              [
                "$2p_z$",
                "None",
                "The $z=0$ plane",
                "Peak at $4a_0$; the origin adds no radial node",
              ],
            ],
          },
        },
        {
          id: "iron-occupancy",
          title: "4. Open up Fe: where do its 26 electrons go?",
          paragraphs: [
            "The ground-state configuration of a free neutral Fe atom is $[\\mathrm{Ar}]\\,3d^6 4s^2$. Expanded, this is $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^6\\,4s^2$, giving shell occupations 2, 8, 14, and 2. The fourth shell is occupied while the third still has available 3d states: shell number is not a universal filling-energy order.",
            "In the familiar atomic occupation sketch, place one parallel-spin electron in each of five d orbitals before pairing the sixth electron, leaving four unpaired electrons. Drawing the pair in a particular box is a representation choice; a field-free atom does not uniquely select one real d orbital that must pair first. The full atomic state also involves combinations of configurations and angular momenta.",
          ],
          equation:
            "\\mathrm{Fe}:\\ [\\mathrm{Ar}]\\,3d^6 4s^2,\\qquad N_e=18+6+2=26,\\qquad (N_1,N_2,N_3,N_4)=(2,8,14,2)",
          equationNote:
            "This describes a free neutral atom, not a complete Fe-ion or crystal model. Occupation, screening, and ionization alter effective orbital energies; there is no fixed 4s-versus-3d ordering valid in every environment.",
          table: {
            headers: ["Shell", "Occupied subshells", "Electrons"],
            rows: [
              ["$n=1$", "$1s^2$", "2"],
              ["$n=2$", "$2s^2\\,2p^6$", "8"],
              ["$n=3$", "$3s^2\\,3p^6\\,3d^6$", "14"],
              ["$n=4$", "$4s^2$", "2"],
            ],
          },
        },
        {
          id: "iron-radial-model",
          title:
            "5. A 3D Fe approximation: angular shape needs a radial function",
          paragraphs: [
            "A lobe plot with $r_{\\mathrm{surface}}\\propto|Y_{2m}|$ displays angular amplitude, not a full orbital. For five real 3d states and 4s, this experiment multiplies a normalized hydrogenic radial function by a spherical harmonic, giving $\\psi=R_{nl}Y_{lm}$ at any $(x,y,z)$. This is a screened, isolated-atom teaching model. The five 3d states share a radial function but have different orientations; 4s is spherical.",
            "Screening is estimated with Slater grouping rules. For a 3d electron, 18 inner electrons contribute 1 each and the other five electrons in its group contribute 0.35 each, giving $Z_{\\mathrm{eff}}=6.25$. For a 4s electron, the 10 electrons in the first two shells contribute 1 each, the 14 third-shell electrons contribute 0.85 each, and the other 4s electron contributes 0.35, giving $Z_{\\mathrm{eff}}=3.75$. These are model parameters, not measured nuclear charges.",
            "The hydrogenic model retains $n-l-1$ radial nodes: 3d has no interior radial node, while 4s has three spherical radial nodes. The fine inner structure of 4s can be resolved by directly finding equal-density radii and constructing spherical surfaces; 3d surfaces are extracted from a full three-dimensional sampling grid. Both representations come from spatial wavefunctions rather than rotating or extruding a two-dimensional picture.",
          ],
          equation:
            "\\begin{aligned}\\psi_{nlm}(\\mathbf r)&=R_{nl}^{(Z_{\\mathrm{eff}})}(r)Y_{lm}(\\theta,\\varphi),\\qquad \\rho=\\frac{2Z_{\\mathrm{eff}}r}{na_0}\\\\R_{nl}(r)&=\\left(\\frac{2Z_{\\mathrm{eff}}}{na_0}\\right)^{3/2}\\sqrt{\\frac{(n-l-1)!}{2n(n+l)!}}\\ e^{-\\rho/2}\\rho^l L_{n-l-1}^{2l+1}(\\rho)\\end{aligned}",
          equationNote:
            "$L_{n-l-1}^{2l+1}$ is an associated Laguerre polynomial and $Y_{lm}$ is a normalized real angular function. Slater screening estimates are used inside hydrogenic radial functions; these are not nodeless Slater-type basis functions. Normalization describes one orbital, not all 26 electrons of Fe.",
          table: {
            headers: [
              "Model orbital",
              "Effective charge",
              "Radial nodes",
              "Angular nodes",
            ],
            rows: [
              [
                "Five 3d states",
                "$6.25$",
                "0",
                "2; planes or cones depending on the real orbital",
              ],
              ["4s", "$3.75$", "3 spherical surfaces", "0"],
            ],
          },
        },
        {
          id: "reading-3d",
          title:
            "6. Read a 3D orbital: isosurfaces, probability clouds, and slices",
          paragraphs: [
            "An isosurface joins positions having equal density. The control threshold $\\eta$ is a fraction of maximum density $n_{\\max}$: $\\eta=0.05$ places the surface at 5% of peak density, not around 5% or 95% of electron probability. Changing the threshold changes apparent size; weaker lobes or inner and outer shells may appear, merge, or disappear. Color continues to indicate the sign of the real wavefunction.",
            "A probability cloud samples $|\\psi|^2$ inside a finite drawing region. Denser point clusters indicate more likely positions, not many simultaneously present electrons or trajectories. A small amount of probability in distant tails lies beyond the drawing region. An isosurface alone does not give the probability enclosed; that requires a volume integral.",
            "An xy, xz, or yz section fixes one coordinate and evaluates the same three-dimensional wavefunction along the other two. Moving a section reveals nodes, lobes, and shells. For example, the central xy section of $2p_z$ lies exactly on its angular node and vanishes everywhere; moving the plane along z reveals density. The three radial nodal spheres of 4s become three circles in a section through the nucleus, while an offset section may miss some of them.",
          ],
          equation:
            "\\mathcal S_\\eta=\\{\\mathbf r:|\\psi(\\mathbf r)|^2=\\eta\\,n_{\\max}\\},\\qquad P_\\eta=\\int_{|\\psi|^2\\geq\\eta n_{\\max}}|\\psi(\\mathbf r)|^2\\,d^3r",
          equationNote:
            "$P_\\eta$ integrates over every region satisfying the density threshold, potentially including disconnected lobes or shells. It generally equals neither $\\eta$ nor $1-\\eta$. Finite drawing bounds and grids also introduce truncation, sampling, and discretization errors.",
        },
        {
          id: "atom-to-solid",
          title: "7. From a free Fe atom to metallic Fe: what must change?",
          paragraphs: [
            "Fe has 26 interacting electrons. Replacing hydrogen nuclear charge by 26 does not produce accurate Fe energies or radial distributions. Even the constant $Z_{\\mathrm{eff}}$ used here provides only averaged screening; exchange, correlation, and self-consistent orbital relaxation are not solved. The Fe graphic is a full three-dimensional approximate single-orbital density, not an accurate atomic HF/DFT result or the total electron density of metallic Fe.",
            "In a crystal, neighboring orbitals couple, and atomic 3d, 4s, and other character contributes to extended, hybridized bands. Energies depend on wavevector and spin; occupation near the Fermi level affects conduction and magnetism. The number of unpaired electrons in an isolated atom cannot simply be identified with the magnetic moment per atom in a metal. The actual crystal structure and electronic state must be considered.",
          ],
          equation:
            "\\psi_{nlm}^{\\mathrm{atom}}\\approx R_{nl}^{\\mathrm{eff}}(r)Y_{lm}(\\theta,\\varphi),\\qquad\\psi_{\\nu\\mathbf k}^{\\mathrm{crystal}}(\\mathbf r)=e^{i\\mathbf k\\cdot\\mathbf r}u_{\\nu\\mathbf k}(\\mathbf r)",
          equationNote:
            "The left expression is a central-field atomic-orbital approximation with a model-dependent radial function. The right is Bloch's form for a periodic crystal: $u$ has lattice periodicity and $\\nu$ labels a band. The labels do not have a simple one-to-one identification.",
        },
      ],
      derivation: {
        title:
          "From spatial probability to a radial distribution and many-electron orbitals",
        intro:
          "Move from a small volume to a whole thin shell, then to a probability over a finite range. This separates what shading, nodes, and radial curves actually show.",
        steps: [
          {
            title: "Simple case: write the probability in a small volume",
            explanation:
              "The spherical-coordinate volume element contains $r^2\\sin\\theta$. Equal-thickness spherical shells therefore have different volumes at different radii.",
            formula:
              "d\\mathcal P=|\\psi(r,\\theta,\\varphi)|^2r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi",
          },
          {
            title: "Sum over all directions to obtain radial probability",
            explanation:
              "With $\\psi=R_{nl}Y_{lm}$ and a normalized angular function, the angular integral is 1. The radial distribution is $r^2|R_{nl}|^2$. Only spherical density permits the direct form $4\\pi r^2|\\psi|^2$.",
            formula:
              "\\int|Y_{lm}|^2\\,d\\Omega=1\\quad\\Longrightarrow\\quad P_{nl}(r)=r^2|R_{nl}(r)|^2",
          },
          {
            title: "Insert 1s and find the most probable equal-thickness shell",
            explanation:
              "Differentiate the radial distribution. Its nonzero interior maximum is at $a_0$. Density is greatest at the nucleus, but vanishing shell volume makes radial probability zero at $r=0$.",
            formula:
              "\\begin{aligned}P_{1s}(r)&=\\frac{4r^2}{a_0^3}e^{-2r/a_0}\\\\\\frac{dP_{1s}}{dr}&=\\frac{8r}{a_0^3}e^{-2r/a_0}\\left(1-\\frac r{a_0}\\right)\\quad\\Rightarrow\\quad r_{\\mathrm{peak}}=a_0\\end{aligned}",
          },
          {
            title: "General case: distinguish radial from angular nodes",
            explanation:
              "The 2s radial function changes sign at $2a_0$, where its radial probability also vanishes. The 2p radial distribution has no internal zero; its node comes from the angular function. A radial curve alone cannot reveal the nodal plane.",
            formula:
              "P_{2s}(r)=\\frac{r^2}{8a_0^3}\\left(2-\\frac r{a_0}\\right)^2e^{-r/a_0},\\qquad P_{2p}(r)=\\frac{r^4}{24a_0^5}e^{-r/a_0}",
            note: "Both curves integrate to 1 over $r\\in[0,\\infty)$. The $z=0$ angular node of $2p_z$ still exists, but angular integration removes directional information.",
          },
          {
            title:
              "Extension to Fe: retain angular classification, solve radial functions and occupation",
            explanation:
              "A central-field approximation retains spherical-harmonic angular classification while obtaining radial functions from an effective potential that includes screening and many-electron effects. A shape sketch does not replace that calculation, and free-atom occupation does not directly specify crystal bands.",
            formula:
              "\\left[-\\frac{\\hbar^2}{2m_e}\\frac{d^2}{dr^2}+\\frac{\\hbar^2l(l+1)}{2m_er^2}+V_{\\mathrm{eff}}(r)\\right]u_{nl}(r)=\\varepsilon_{nl}u_{nl}(r),\\qquad u_{nl}=rR_{nl}",
            note: "This radial equation assumes a local spherical effective potential; it is not the exact Fe many-electron equation. Full HF exchange, for example, cannot generally be represented by one common local potential.",
          },
          {
            title:
              "A computable approximation: estimate screening, then build the full orbital",
            explanation:
              "Use the occupation of free neutral Fe to obtain an orbital-dependent $Z_{\\mathrm{eff}}$. Insert it into the normalized $R_{nl}$ above and multiply by a real spherical harmonic to evaluate amplitude at any three-dimensional location. Constant screening does not recover the full many-electron interaction.",
            formula:
              "\\begin{aligned}Z_{\\mathrm{eff}}(3d)&=26-[18+5(0.35)]=6.25\\\\Z_{\\mathrm{eff}}(4s)&=26-[10+14(0.85)+1(0.35)]=3.75\\end{aligned}",
            note: "For 4s, the radial polynomial is $L_3^1(\\rho)=4-6\\rho+2\\rho^2-\\rho^3/6$; its three positive roots give three radial nodes. The 3d radial polynomial is constant, so there is no interior radial node.",
          },
        ],
      },
      example: {
        title:
          "How likely is a hydrogen 1s electron to be inside the Bohr radius?",
        problem:
          "Given $P_{1s}(r)=4r^2e^{-2r/a_0}/a_0^3$, the radial peak lies at $a_0$. Does this mean most probability lies inside that radius?",
        solution: [
          "A range probability requires an integral rather than the curve's peak height: $\\mathcal P(r<a_0)=\\int_0^{a_0}P_{1s}(r)\\,dr$.",
          "Set $x=r/a_0$ to obtain $\\int_0^1 4x^2e^{-2x}\\,dx$. An antiderivative is $-e^{-2x}(2x^2+2x+1)$.",
          "Evaluating the bounds gives $\\mathcal P(r<a_0)=1-5e^{-2}\\approx0.323$, leaving about 0.677 outside.",
        ],
        result:
          "The Bohr radius is the peak location of the 1s radial distribution, not a boundary enclosing the atom or even most of its probability. Changing an isosurface threshold changes the apparent orbital size.",
      },
      misconceptions: [
        {
          myth: "Two orbital colors represent positive and negative electrons.",
          correction:
            "They usually mark relative phase of a real wavefunction. Electron charge is negative in both regions and probability density is nonnegative. Phase affects interference, not the charge sign.",
        },
        {
          myth: "Zero radial probability at the nucleus means the 1s wavefunction vanishes there.",
          correction:
            "The 1s wavefunction is nonzero at the nucleus. Its radial distribution contains the $r^2$ volume factor, so vanishing shell volume makes the distribution zero. This is not a radial node of 1s.",
        },
        {
          myth: "Fe is just hydrogen with nuclear charge changed to 26.",
          correction:
            "That ignores screening, electron interactions, and occupation-dependent energies. Angular symmetry sketches remain useful, but quantitative radial distributions, atomic levels, and metallic Fe bands require appropriate many-electron models.",
        },
      ],
      questions: [
        {
          question:
            "Does Fe's third-shell count of 14 contradict a third-shell capacity of 18?",
          answer:
            "No. Capacity and actual occupation are different. The free neutral ground state has 3s², 3p⁶, and 3d⁶, totaling 14 electrons in that shell, while 4s contains two more. Energy ordering is not simply shell-number ordering.",
        },
        {
          question:
            "If 2s changes sign across its radial node, does probability density become negative?",
          answer:
            "No. Probability density is the squared magnitude: zero at the node and nonnegative on both sides. The phase change affects superposition with other functions, not the positivity of position probability.",
        },
        {
          question:
            "Why does a 2p radial curve not show the orbital's two lobes?",
          answer:
            "The radial distribution has already integrated over all directions. The lobes and their separating nodal plane belong to the angular function. Inspect both spatial and radial views to distinguish these features.",
        },
        {
          question:
            "Does an isovalue of 5% of peak density enclose 95% of the probability?",
          answer:
            "No. The threshold specifies local density on a surface, while probability is a volume integral. Evaluate $P_\\eta=\\int_{|\\psi|^2\\geq\\eta n_{\\max}}|\\psi|^2\\,d^3r$ to find the probability of that region; there is no general 5%-to-95% relationship.",
        },
      ],
      connections: [
        {
          method: "hf",
          reason:
            "Build antisymmetric many-electron states from orbitals and occupations.",
        },
        {
          method: "dft",
          reason:
            "Solve orbitals and density in an effective potential, distinguishing atoms from periodic solids.",
        },
      ],
      references: [
        {
          label: "OpenStax University Physics Vol. 3 · 8.1 The Hydrogen Atom",
          url: "https://openstax.org/books/university-physics-volume-3/pages/8-1-the-hydrogen-atom",
          detail:
            "Open treatment of hydrogen quantum numbers, spatial density, and radial probability.",
        },
        {
          label: "OpenStax Chemistry 2e · 6.4 Electronic Structure of Atoms",
          url: "https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations",
          detail:
            "Introductory electron configurations, the Pauli principle, and Hund's rules.",
        },
        {
          label: "NIST Handbook · Iron Atomic Data",
          url: "https://physics.nist.gov/PhysRefData/Handbook/Tables/irontable1.htm",
          detail:
            "Ground configurations and atomic data for free neutral Fe and ions, distinct from bands in metallic Fe.",
        },
        {
          label: "J. C. Slater · Atomic Shielding Constants (1930)",
          url: "https://doi.org/10.1103/PhysRev.36.57",
          detail:
            "Empirical grouping rules for atomic screening. Here their effective charges are combined with hydrogenic radial functions for teaching, not a self-consistent electronic-structure calculation of Fe.",
        },
      ],
    },
  },
} satisfies Partial<Record<FoundationId, Record<Locale, FoundationLesson>>>;
