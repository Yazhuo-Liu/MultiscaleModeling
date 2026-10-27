import type { Locale } from "../i18n";
import type { FoundationId, FoundationLesson } from "./foundations-types";

export const materialFoundations = {
  bonding: {
    zh: {
      title: "从原子到键：电子如何连接材料",
      subtitle: "共价键、金属键，以及键能如何变成材料刚度",
      lead: "原子靠近后，电子态会重新组合。理解这种重组带来的能量变化，才能把电子结构、原子间作用和材料的变形联系起来。先从只有一个电子的分子开始，再走向包含许多原子的金属。",
      readMinutes: 17,
      objectives: [
        "用轨道叠加解释成键态、反键态和核间电子密度。",
        "区分共价键的方向性、金属中的延展态及简单图像的适用边界。",
        "从势能曲线的斜率和曲率得到原子力与局部刚度。",
      ],
      sections: [
        {
          id: "energy-balance",
          title: "1 · 为什么两个中性原子也能结合？",
          paragraphs: [
            "中性不代表内部没有电荷。两个原子靠近时，电子同时受到多个原子核的吸引，电子之间和原子核之间也存在排斥。电子的动能同样随波函数形状而变化。因此，成键不是只把某一种吸引力加起来，而是在给定核位置下寻找电子总能量，再把核间排斥计入。",
            String.raw`在 Born–Oppenheimer 近似下，把核间距 $R$ 暂时固定，求电子基态能量，再得到势能曲线 $U(R)$。若曲线的最低点低于分离原子的能量，且在某个有限 $R_0$ 处达到最低值，就存在相应的结合状态。过近时的排斥、电子态重排和量子约束会阻止原子无限塌缩。`,
          ],
          equation: String.raw`U(R)=E_{\mathrm{electronic}}(R)+E_{\mathrm{nuclei}}(R),\qquad U(R_0)<U(\infty)`,
          equationNote:
            "这里只讨论固定电子态上的势能；真实分子还存在核振动、转动和零点能。",
        },
        {
          id: "two-orbitals",
          title: "2 · 最小模型：一个电子、两个原子核",
          paragraphs: [
            String.raw`氢分子离子 $\mathrm{H}_2^+$ 只有一个电子，是观察成键最清楚的起点。取分别位于 A、B 核附近的归一化 $1s$ 轨道 $\phi_A$ 和 $\phi_B$，把它们相加或相减。叠加发生在波函数上，概率密度最后才由模平方得到。`,
            String.raw`选择两个 $1s$ 轨道相同的相位后，对称组合通常在核间增加电子密度，成为这个模型中的成键态；反对称组合在两核之间产生节点，成为反键态。图中的两种颜色表示波函数相位，并不表示电子带着不同符号的电荷。整个波函数同时变号，不会改变任何概率密度。`,
          ],
          equation: String.raw`\psi_{\pm}=\frac{\phi_A\pm\phi_B}{\sqrt{2(1\pm S)}},\qquad S=\int\phi_A^*(\mathbf r)\phi_B(\mathbf r)\,d^3r`,
          equationNote: String.raw`这里选择实轨道，$S$ 是无量纲重叠积分。分母不能简单地始终写成 $\sqrt2$；只有轨道重叠可以忽略时，才有这一近似。`,
        },
        {
          id: "covalent",
          title: "3 · 共价键：占据哪些态，与态的方向都重要",
          paragraphs: [
            String.raw`从 $\mathrm{H}_2^+$ 走向 $\mathrm H_2$ 时，增加了一个电子。最简单的分子轨道图像让两个相反自旋电子占据成键轨道，符合 Pauli 原理。不过，两个电子之间现在有库仑作用；精确能量不能直接把单电子能量乘以二，电子关联在键被拉长、接近断裂时尤其重要。`,
            String.raw`在简单分子轨道占据模型中，可以用键级 $(N_b-N_a)/2$ 比较成键轨道与反键轨道的占据。共价键的方向性来自轨道对称性和重叠随几何方向的变化；$s$、$p$ 轨道的线性组合能够帮助描述这些方向，但“杂化轨道”是描述电子态的一种选择，并不是原子先执行的一项独立运动。`,
          ],
          equation: String.raw`B=\frac{N_b-N_a}{2},\qquad B(\mathrm H_2)=\frac{2-0}{2}=1`,
          equationNote:
            "键级是简化模型中的比较指标，不是适用于所有固体、所有电子关联情形的精确键强度。",
          bullets: [
            "成键态增加占据，通常有利于结合；反键态增加占据，通常削弱相应的键。",
            "键的方向性会影响弹性各向异性、滑移阻力和断裂路径。",
            "强键、易导电、容易塑性变形是不同性质，不能只用一种键的标签同时解释。",
          ],
        },
        {
          id: "metallic",
          title: "4 · 金属键：从两个组合态到许多延展态",
          paragraphs: [
            String.raw`把两个原子扩展为 $N$ 个原子，每个原子提供一个轨道，耦合后就得到 $N$ 个空间态；若计入两个自旋方向，每个空间态最多容纳两个电子。原子很多时，允许能量变得密集并形成能带。周期晶体中的态可以延展在许多原子上，电子不再只属于某一对原子。`,
            "“正离子实浸在电子海中”有助于理解电荷屏蔽和电子的延展性，但只是起点。真实金属仍有特定的晶体对称性、轨道成分和费米面。对 Fe，3d 态和 4s 态参与成带、杂化与磁性；把所有价电子都看成完全自由的粒子，会丢掉重要的成键和磁相互作用。自由 Fe 原子的轨道占据也不能直接当成金属 Fe 的能带占据。",
          ],
          equation: String.raw`\psi_{n\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{n\mathbf k}(\mathbf r)`,
          equationNote: String.raw`这是周期单电子或有效单电子势中 Bloch 态的形式，$u_{n\mathbf k}$ 具有晶格周期。电子相互作用可以通过有效势近似计入；这不是完整多电子波函数的表达式。`,
          table: {
            headers: ["入门图像", "帮助理解什么", "还需要补充什么"],
            rows: [
              [
                "局域的共价键",
                "轨道重叠、方向性、局部化学环境",
                "电子关联、离子性与更大范围的电子重排",
              ],
              [
                "金属中的延展电子",
                "屏蔽、能带占据和集体结合",
                "真实能带、d 态、磁性及电子散射",
              ],
            ],
          },
        },
        {
          id: "forces",
          title: "5 · 从键的能量到力和刚度",
          paragraphs: [
            String.raw`沿核间距求势能的负导数得到力。平衡间距 $R_0$ 处斜率为零；稳定平衡还要求附近的曲率为正。把曲线在最低点附近展开，最先出现的非零项是二次项，于是得到类似弹簧的线性恢复力。`,
            "这条连接是多尺度建模的一个入口：电子结构给出不同构型的能量和力，原子势近似这些关系，许多原子组成的晶格再产生宏观弹性响应。一个键的曲率还不是材料的杨氏模量；晶格几何、原子密度、多个相互作用方向和内部松弛都要计入。偏离平衡较远时，还必须考虑非谐性、键重排和断裂。",
          ],
          equation: String.raw`\begin{aligned}F_R&=-\frac{dU}{dR},&U'(R_0)&=0,\\U(R)&\approx U(R_0)+\frac12\kappa(R-R_0)^2,&\kappa&=U''(R_0)>0,\\F_R&\approx-\kappa(R-R_0).\end{aligned}`,
          equationNote: String.raw`$U$ 用 J、$R$ 用 m 时，$\kappa$ 的单位为 N/m；宏观弹性模量的单位是 Pa，两者不能直接等同。`,
        },
      ],
      derivation: {
        title: "从两个原子轨道，推到一条近似弹簧规律",
        intro:
          "先用固定核、单电子和两个实 1s 基函数建立最小模型，再加入重叠归一化与核间排斥，最后把能量曲线扩展为力学关系。",
        steps: [
          {
            title: "写出变分试探态",
            explanation: String.raw`以 $\phi_A,\phi_B$ 为基，未知量是两个组合系数。因基函数不正交，需要同时保留哈密顿矩阵和重叠矩阵。`,
            formula: String.raw`\psi=c_A\phi_A+c_B\phi_B,\qquad \mathbf H\mathbf c=\varepsilon\mathbf S\mathbf c,\qquad \mathbf S=\begin{pmatrix}1&S\\S&1\end{pmatrix}`,
          },
          {
            title: "利用两个相同原子核的对称性",
            explanation: String.raw`令 $H_{AA}=H_{BB}=\alpha$、$H_{AB}=H_{BA}=\beta$。对称与反对称系数分别满足 $c_B=\pm c_A$，代入广义本征方程即可求能量。`,
            formula: String.raw`\begin{pmatrix}\alpha&\beta\\\beta&\alpha\end{pmatrix}\begin{pmatrix}1\\\pm1\end{pmatrix}=\varepsilon_{\pm}\begin{pmatrix}1&S\\S&1\end{pmatrix}\begin{pmatrix}1\\\pm1\end{pmatrix}\quad\Longrightarrow\quad\varepsilon_{\pm}=\frac{\alpha\pm\beta}{1\pm S}`,
            note: String.raw`$\alpha,\beta,S$ 都随核间距变化，且 $\alpha$ 包含另一原子核对电子的作用，不能把它始终视为孤立氢原子的固定能量。`,
          },
          {
            title: "从概率幅得到概率密度",
            explanation:
              "归一化后平方，出现交叉项。正负组合改变核间密度的方式来自这个交叉项，而不是给电子改变电荷。",
            formula: String.raw`|\psi_{\pm}|^2=\frac{\phi_A^2+\phi_B^2\pm2\phi_A\phi_B}{2(1\pm S)}`,
          },
          {
            title: "补上原子核之间的排斥",
            explanation: String.raw`电子本征值只是一部分。对 $\mathrm H_2^+$ 的两个质子，加入核间库仑排斥后，才能寻找总能量最低点和结合能。`,
            formula: String.raw`U_{\pm}(R)=\varepsilon_{\pm}(R)+\frac{e^2}{4\pi\epsilon_0R},\qquad U'(R_0)=0`,
            note: "两个基函数的结果是变分近似；改进基组可以改善它，但多电子分子还需要处理电子之间的作用。",
          },
          {
            title: "在稳定最低点附近展开",
            explanation:
              "一阶项因平衡而消失。保留二阶项，再求负导数，便得到小位移范围的线性恢复力。",
            formula: String.raw`U(R_0+\Delta R)=U(R_0)+\frac12U''(R_0)(\Delta R)^2+O((\Delta R)^3)\quad\Longrightarrow\quad F_R\approx-\kappa\Delta R`,
            note: "这一步把电子能量问题连接到力学；它只在选定能量最低点附近的小扰动范围有效。",
          },
        ],
      },
      example: {
        title: "把键拉长一点，需要多少能量？",
        problem: String.raw`某个教学势能曲线在平衡处的曲率为 $\kappa=40\,\mathrm{N/m}$。在谐近似仍有效的范围内，把核间距增加 $\Delta R=0.01\,\mathrm{nm}$，求恢复力和能量增量。此数值不代表某种特定材料。`,
        solution: [
          String.raw`先换单位：$\Delta R=10^{-11}\,\mathrm m$。`,
          String.raw`恢复力 $F_R=-\kappa\Delta R=-4.0\times10^{-10}\,\mathrm N=-0.40\,\mathrm{nN}$，负号表示力使间距减小。`,
          String.raw`能量增量 $\Delta U=\kappa(\Delta R)^2/2=2.0\times10^{-21}\,\mathrm J\approx0.0125\,\mathrm{eV}$。`,
          "若位移增大为两倍，谐近似中的力增大为两倍、能量增量增大为四倍；是否仍处于谐近似范围，需要回到完整势能曲线检查。",
        ],
        result:
          "小位移下，能量与位移的平方成正比，力与位移成正比；这两个关系都来自同一条势能曲线。",
      },
      misconceptions: [
        {
          myth: "轨道图的两种颜色表示正电子和负电子。",
          correction:
            "颜色通常表示波函数相位。所有电子电荷相同；成键和反键的区别来自概率幅的相对相位及其干涉。",
        },
        {
          myth: "金属键意味着所有电子都是完全自由的。",
          correction:
            "电子仍受到晶格势和电子相互作用影响。Fe 的 d 态、能带结构和磁性尤其不能由自由电子模型完整描述。",
        },
        {
          myth: "知道一个键的曲率，就直接知道材料的杨氏模量。",
          correction:
            "键曲率的单位是 N/m，模量的单位是 Pa。还需要晶格几何、体积归一化、多方向相互作用和内部松弛。",
        },
      ],
      questions: [
        {
          question: "为什么叠加两个轨道后，不能直接把两个概率密度相加？",
          answer: String.raw`因为要先叠加概率幅，再取模平方：$|\phi_A+\phi_B|^2$ 包含 $2\operatorname{Re}(\phi_A^*\phi_B)$ 交叉项。这个干涉项正是核间密度增加或出现节点的原因。`,
        },
        {
          question: "势能曲线的斜率为零，就一定是稳定平衡吗？",
          answer: String.raw`不一定。极大值的斜率也为零。对一维非退化最低点还需 $U''(R_0)>0$；多维构型需要检查除平移、转动等零模之外的相关曲率。`,
        },
        {
          question: "向反键轨道中增加电子，通常会怎样改变相应的键？",
          answer:
            "在简单分子轨道占据图像中，键级下降，相关键通常减弱。真实体系可能同时改变几何、自旋态或其他轨道占据，因此仍需比较自洽总能量。",
        },
      ],
      connections: [
        {
          method: "hf",
          reason:
            "用自旋轨道、Slater 行列式和交换作用构建多电子成键近似，并理解缺失关联的影响。",
        },
        {
          method: "dft",
          reason: "从电子密度计算不同原子构型的总能量、平衡键长和原子力。",
        },
        {
          method: "md",
          reason:
            "把原子间作用表示为势能和力，观察许多原子如何振动、重排和变形。",
        },
      ],
      references: [
        {
          label: "OpenStax · Chemistry 2e, 8.4 Molecular Orbital Theory",
          url: "https://openstax.org/books/chemistry-2e/pages/8-4-molecular-orbital-theory",
          detail: "分子轨道、成键与反键、轨道占据和键级的开放教材。",
        },
        {
          label:
            "OpenStax · University Physics Vol. 3, 9.3 Bonding in Crystalline Solids",
          url: "https://openstax.org/books/university-physics-volume-3/pages/9-3-bonding-in-crystalline-solids",
          detail: "从相互作用能与固体结构理解不同成键类型。",
        },
        {
          label: "David Tong · Solid State Physics",
          url: "https://www.damtp.cam.ac.uk/user/tong/solidstate.html",
          detail: "进一步学习晶格、紧束缚、能带和金属电子。",
        },
      ],
    },
    en: {
      title: "From atoms to bonds: how electrons hold materials together",
      subtitle: "Covalent bonds, metallic bonds, and the origin of stiffness",
      lead: "When atoms approach, their electronic states reorganize. The resulting energy changes connect electronic structure to atomic interactions and mechanical response. Start with a molecule containing just one electron, then extend the picture to a metal containing many atoms.",
      readMinutes: 17,
      objectives: [
        "Explain bonding states, antibonding states, and internuclear electron density through orbital superposition.",
        "Distinguish directional covalent bonding from extended metallic states and recognize the limits of each simple picture.",
        "Obtain atomic forces and local stiffness from the slope and curvature of an energy curve.",
      ],
      sections: [
        {
          id: "energy-balance",
          title: "1 · Why can two neutral atoms bind?",
          paragraphs: [
            "Neutrality does not mean an atom contains no charges. As two atoms approach, electrons feel attractions from multiple nuclei, while electrons repel one another and nuclei repel one another. Electronic kinetic energy also changes with the wavefunction. Bonding therefore requires an energy balance, rather than adding up a single attractive interaction.",
            String.raw`In the Born–Oppenheimer approximation, temporarily fix the internuclear separation $R$, solve for the electronic ground state, and include nuclear repulsion to obtain a potential-energy curve $U(R)$. A minimum at a finite distance $R_0$ below the separated-atom energy indicates a bound configuration on that surface. Short-range repulsion, changes of electronic state, and quantum constraints prevent indefinite collapse.`,
          ],
          equation: String.raw`U(R)=E_{\mathrm{electronic}}(R)+E_{\mathrm{nuclei}}(R),\qquad U(R_0)<U(\infty)`,
          equationNote:
            "This is a potential-energy description on a selected electronic surface. Real molecules also have nuclear vibration, rotation, and zero-point energy.",
        },
        {
          id: "two-orbitals",
          title: "2 · The smallest model: one electron and two nuclei",
          paragraphs: [
            String.raw`The hydrogen molecular ion $\mathrm{H}_2^+$ has only one electron, making it a clear starting point. Take normalized $1s$ orbitals $\phi_A$ and $\phi_B$ centered on nuclei A and B, then add or subtract them. Superposition acts on wavefunctions; the probability density is obtained only after taking the absolute square.`,
            String.raw`With the two $1s$ orbitals assigned the same phase, the symmetric combination usually enhances internuclear density and forms the bonding state in this model. The antisymmetric combination has a node between the nuclei and forms the antibonding state. Two colors in an orbital diagram represent wavefunction phase, not opposite electric charges. Reversing the sign of the entire wavefunction changes no probability density.`,
          ],
          equation: String.raw`\psi_{\pm}=\frac{\phi_A\pm\phi_B}{\sqrt{2(1\pm S)}},\qquad S=\int\phi_A^*(\mathbf r)\phi_B(\mathbf r)\,d^3r`,
          equationNote: String.raw`Real orbitals are chosen here, and $S$ is the dimensionless overlap integral. The denominator reduces approximately to $\sqrt2$ only when overlap is negligible.`,
        },
        {
          id: "covalent",
          title: "3 · Covalent bonding: occupation and direction both matter",
          paragraphs: [
            String.raw`Moving from $\mathrm{H}_2^+$ to $\mathrm H_2$ adds a second electron. In the simplest molecular-orbital picture, two electrons with opposite spins occupy the bonding orbital, consistent with the Pauli principle. Electron–electron repulsion must now be included: the exact energy is not simply twice a one-electron energy. Correlation becomes especially important as the bond stretches toward dissociation.`,
            String.raw`A simple occupation model uses the bond order $(N_b-N_a)/2$ to compare bonding and antibonding occupation. Directionality follows from orbital symmetry and the dependence of overlap on geometry. Linear combinations of $s$ and $p$ orbitals can describe those directions, but hybrid orbitals are a choice of representation, not a separate physical motion an atom first performs.`,
          ],
          equation: String.raw`B=\frac{N_b-N_a}{2},\qquad B(\mathrm H_2)=\frac{2-0}{2}=1`,
          equationNote:
            "Bond order is a useful comparison within a simplified model, not an exact bond-strength measure for every solid or correlated electronic state.",
          bullets: [
            "Increasing bonding-state occupation usually favors binding; increasing antibonding-state occupation usually weakens the associated bond.",
            "Bond directionality influences elastic anisotropy, resistance to slip, and fracture paths.",
            "Strong bonding, high conductivity, and easy plastic deformation are different properties and cannot all be inferred from one bonding label.",
          ],
        },
        {
          id: "metallic",
          title:
            "4 · Metallic bonding: from two combinations to many extended states",
          paragraphs: [
            String.raw`Extend the system to $N$ atoms, each contributing one orbital. Coupling produces $N$ spatial states; including two spin directions allows up to two electrons per spatial state. For many atoms, the allowed energies become closely spaced and form bands. States in a periodic crystal can extend over many atoms, so an electron need not belong to a particular pair.`,
            "A sea of electrons surrounding positive ion cores gives useful intuition for screening and delocalization, but real metals also have crystal symmetry, orbital character, and a Fermi surface. In Fe, 3d and 4s states contribute to bands, hybridization, and magnetism. Treating all valence electrons as completely free loses important physics. The orbital occupations of a free Fe atom are not the band occupations of metallic Fe.",
          ],
          equation: String.raw`\psi_{n\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{n\mathbf k}(\mathbf r)`,
          equationNote: String.raw`This is the Bloch form for a periodic single-electron or effective single-electron potential, with lattice-periodic $u_{n\mathbf k}$. An effective potential can approximate interactions; this is not the complete many-electron wavefunction.`,
          table: {
            headers: [
              "Introductory picture",
              "What it helps explain",
              "What must be added",
            ],
            rows: [
              [
                "Localized covalent bonds",
                "Orbital overlap, directionality, and local chemistry",
                "Correlation, ionic character, and longer-range electronic rearrangement",
              ],
              [
                "Extended metallic electrons",
                "Screening, band occupation, and collective binding",
                "Real bands, d states, magnetism, and scattering",
              ],
            ],
          },
        },
        {
          id: "forces",
          title: "5 · From bond energy to force and stiffness",
          paragraphs: [
            String.raw`The negative derivative of potential energy with respect to separation gives the force. The slope vanishes at an equilibrium distance $R_0$, and a stable, nondegenerate minimum has positive curvature. A Taylor expansion around that minimum begins with a quadratic energy change, giving a spring-like restoring force for small displacements.`,
            "This provides an entry into multiscale modeling: electronic structure supplies energies and forces, an interatomic potential approximates those relations, and an assembly of atoms produces macroscopic elasticity. A single bond curvature is not a Young’s modulus. Lattice geometry, atomic density, multiple interaction directions, and internal relaxation also matter. Farther from equilibrium, anharmonicity, bond rearrangement, and fracture must be considered.",
          ],
          equation: String.raw`\begin{aligned}F_R&=-\frac{dU}{dR},&U'(R_0)&=0,\\U(R)&\approx U(R_0)+\frac12\kappa(R-R_0)^2,&\kappa&=U''(R_0)>0,\\F_R&\approx-\kappa(R-R_0).\end{aligned}`,
          equationNote: String.raw`With $U$ in J and $R$ in m, $\kappa$ has units N/m. A macroscopic elastic modulus has units Pa, so the two quantities cannot be directly equated.`,
        },
      ],
      derivation: {
        title: "From two atomic orbitals to an approximate spring law",
        intro:
          "Begin with fixed nuclei, one electron, and two real 1s basis functions. Include overlap and nuclear repulsion, then turn the resulting energy curve into a mechanical relation.",
        steps: [
          {
            title: "Choose a variational trial state",
            explanation: String.raw`The unknowns are the coefficients of $\phi_A$ and $\phi_B$. Because the basis functions are not orthogonal, both a Hamiltonian matrix and an overlap matrix are needed.`,
            formula: String.raw`\psi=c_A\phi_A+c_B\phi_B,\qquad \mathbf H\mathbf c=\varepsilon\mathbf S\mathbf c,\qquad \mathbf S=\begin{pmatrix}1&S\\S&1\end{pmatrix}`,
          },
          {
            title: "Use the symmetry of identical nuclei",
            explanation: String.raw`Set $H_{AA}=H_{BB}=\alpha$ and $H_{AB}=H_{BA}=\beta$. Symmetric and antisymmetric coefficients have $c_B=\pm c_A$. Substitute these into the generalized eigenvalue problem.`,
            formula: String.raw`\begin{pmatrix}\alpha&\beta\\\beta&\alpha\end{pmatrix}\begin{pmatrix}1\\\pm1\end{pmatrix}=\varepsilon_{\pm}\begin{pmatrix}1&S\\S&1\end{pmatrix}\begin{pmatrix}1\\\pm1\end{pmatrix}\quad\Longrightarrow\quad\varepsilon_{\pm}=\frac{\alpha\pm\beta}{1\pm S}`,
            note: String.raw`All three quantities $\alpha,\beta,S$ depend on separation. In particular, $\alpha$ includes attraction to the other nucleus and is not a fixed isolated-hydrogen energy.`,
          },
          {
            title: "Turn amplitudes into density",
            explanation:
              "Squaring the normalized state produces a cross term. The change in internuclear density comes from interference, not a change in electron charge.",
            formula: String.raw`|\psi_{\pm}|^2=\frac{\phi_A^2+\phi_B^2\pm2\phi_A\phi_B}{2(1\pm S)}`,
          },
          {
            title: "Add nuclear repulsion",
            explanation: String.raw`The electronic eigenvalue is only part of the total energy. Add the repulsion between the two protons of $\mathrm H_2^+$ before locating the minimum or evaluating binding.`,
            formula: String.raw`U_{\pm}(R)=\varepsilon_{\pm}(R)+\frac{e^2}{4\pi\epsilon_0R},\qquad U'(R_0)=0`,
            note: "Two basis functions give a variational approximation. Improving the basis helps, while a many-electron molecule also requires electron–electron interactions.",
          },
          {
            title: "Expand about a stable minimum",
            explanation:
              "Equilibrium removes the first-order term. Keeping the second-order term and taking a negative derivative gives the small-displacement restoring force.",
            formula: String.raw`U(R_0+\Delta R)=U(R_0)+\frac12U''(R_0)(\Delta R)^2+O((\Delta R)^3)\quad\Longrightarrow\quad F_R\approx-\kappa\Delta R`,
            note: "This connects electronic energy to mechanics locally around the chosen stable configuration.",
          },
        ],
      },
      example: {
        title: "How much energy does a small stretch require?",
        problem: String.raw`An illustrative potential-energy curve has curvature $\kappa=40\,\mathrm{N/m}$ at equilibrium. Increase the separation by $\Delta R=0.01\,\mathrm{nm}$ within the harmonic regime. Find the restoring force and energy change. These numbers do not represent a specific material.`,
        solution: [
          String.raw`Convert the displacement: $\Delta R=10^{-11}\,\mathrm m$.`,
          String.raw`The restoring force is $F_R=-\kappa\Delta R=-4.0\times10^{-10}\,\mathrm N=-0.40\,\mathrm{nN}$. The minus sign points toward smaller separation.`,
          String.raw`The energy change is $\Delta U=\kappa(\Delta R)^2/2=2.0\times10^{-21}\,\mathrm J\approx0.0125\,\mathrm{eV}$.`,
          "Doubling the displacement doubles the force magnitude and quadruples the energy change in this approximation. Check the complete curve before assuming the larger displacement remains harmonic.",
        ],
        result:
          "The linear force and quadratic energy are two consequences of the same local energy curve.",
      },
      misconceptions: [
        {
          myth: "The two orbital colors indicate positive and negative electrons.",
          correction:
            "They usually indicate wavefunction phase. All electrons have the same charge; relative phases and interference distinguish the combinations.",
        },
        {
          myth: "Metallic bonding means every electron is completely free.",
          correction:
            "Electrons still respond to the crystal potential and interactions. Fe d states, band structure, and magnetism are particularly important counterexamples to a complete free-electron description.",
        },
        {
          myth: "A bond curvature directly gives the Young’s modulus.",
          correction:
            "Curvature has units N/m, while modulus has units Pa. Geometry, volume normalization, multiple interaction directions, and internal relaxation are also required.",
        },
      ],
      questions: [
        {
          question: "Why can we not simply add the two orbital densities?",
          answer: String.raw`Amplitudes must be combined before squaring. The expression $|\phi_A+\phi_B|^2$ contains the cross term $2\operatorname{Re}(\phi_A^*\phi_B)$, which changes the internuclear density and can create a node.`,
        },
        {
          question: "Does a zero energy slope guarantee stability?",
          answer: String.raw`No. A maximum also has zero slope. A nondegenerate one-dimensional minimum additionally needs $U''(R_0)>0$. In multiple dimensions, inspect the relevant curvatures after accounting for zero modes such as translations and rotations.`,
        },
        {
          question:
            "What usually happens when an antibonding orbital gains an electron?",
          answer:
            "The simple occupation model predicts lower bond order and weaker associated bonding. Geometry, spin, and other occupations can also change, so the real system requires a self-consistent total-energy comparison.",
        },
      ],
      connections: [
        {
          method: "hf",
          reason:
            "Build many-electron approximations with spin orbitals, determinants, and exchange, then examine missing correlation.",
        },
        {
          method: "dft",
          reason:
            "Obtain energies, equilibrium separations, and atomic forces from an electronic-density calculation.",
        },
        {
          method: "md",
          reason:
            "Use potential energies and forces to follow collective atomic vibration, rearrangement, and deformation.",
        },
      ],
      references: [
        {
          label: "OpenStax · Chemistry 2e, 8.4 Molecular Orbital Theory",
          url: "https://openstax.org/books/chemistry-2e/pages/8-4-molecular-orbital-theory",
          detail:
            "An open introduction to bonding, antibonding, occupation, and bond order.",
        },
        {
          label:
            "OpenStax · University Physics Vol. 3, 9.3 Bonding in Crystalline Solids",
          url: "https://openstax.org/books/university-physics-volume-3/pages/9-3-bonding-in-crystalline-solids",
          detail:
            "Interaction energies and the main bonding pictures used for solids.",
        },
        {
          label: "David Tong · Solid State Physics",
          url: "https://www.damtp.cam.ac.uk/user/tong/solidstate.html",
          detail:
            "Further reading on lattices, tight binding, bands, and metallic electrons.",
        },
      ],
    },
  },
  "band-structure": {
    zh: {
      title: "能带与带隙：哪些电子态可以被占据？",
      subtitle: "从密集的原子能级到金属、半导体与不同带隙定义",
      lead: "带隙不是原子外面的一道空间裂缝，而是一段没有相应体相电子态的能量区间。理解它，需要同时看允许的能量、电子占据和晶体中的动量标签。",
      readMinutes: 19,
      objectives: [
        "说明离散原子态如何在周期体系中形成能带。",
        "读懂价带顶、导带底、费米能级与直接或间接带隙。",
        "区分基本带隙、Kohn–Sham 带隙和光学吸收能量。",
      ],
      sections: [
        {
          id: "from-atoms",
          title: "1 · 一个原子、一对原子、一整块晶体",
          paragraphs: [
            String.raw`一个孤立原子的束缚电子态具有离散能量。把两个原子耦合起来，一对相似轨道可以组合成能量不同的两个态。扩展为 $N$ 个原子时，每个原子提供的一个轨道可以组合成 $N$ 个空间态。宏观样品中的 $N$ 极大，相邻能量非常接近，看起来成为连续的能带。`,
            "这不意味着原子能级简单变宽后就结束了。不同轨道之间可以杂化，晶体对称性可以保护简并或允许能隙打开，电子相互作用也会改变谱。金属 Fe 的 d 带和 s 成分是晶体电子态的一部分，不是把自由 Fe 原子的电子排布图原样复制很多次。",
          ],
          equation: String.raw`N\ \text{atomic orbitals}\ \longrightarrow\ N\ \text{spatial states}\ \longrightarrow\ \text{a band}`,
          equationNote:
            "在不破坏自旋简并的简单模型中，每个空间态可容纳两个相反自旋电子。磁性材料需要分别处理自旋通道。",
        },
        {
          id: "periodic-states",
          title: "2 · 横轴为什么是波矢？",
          paragraphs: [
            String.raw`周期势满足 $V(\mathbf r+\mathbf R)=V(\mathbf r)$，其中 $\mathbf R$ 是晶格平移矢量。对应的单电子或有效单电子态可写成 Bloch 形式：平面波因子乘以晶格周期函数。能量由能带编号 $n$ 和晶体波矢 $\mathbf k$ 标记，于是能带图画的是 $E_n(\mathbf k)$。`,
            String.raw`横轴不是电子离原子核的距离，也不是电子在晶体中的轨迹。$\hbar\mathbf k$ 是晶体动量，等价关系涉及倒格矢；通常只需研究第一布里渊区。真实三维能带图常沿高对称路径取样，一条路径可能遗漏别处的极值，所以精确带隙还需要充分搜索整个布里渊区。`,
          ],
          equation: String.raw`\psi_{n\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{n\mathbf k}(\mathbf r),\qquad u_{n\mathbf k}(\mathbf r+\mathbf R)=u_{n\mathbf k}(\mathbf r)`,
          equationNote:
            "Bloch 形式建立在周期性上。无序、表面和有限体系需要相应调整描述。",
        },
        {
          id: "gap-occupation",
          title: "3 · 带隙、占据与费米能级一起看",
          paragraphs: [
            String.raw`对常规带绝缘体或半导体，价带顶 VBM 是最高价带能量，导带底 CBM 是最低导带能量，两者之差定义带隙 $E_g$。在零温独立电子图像中，价带占满而导带为空，跨越这个能量区间才能产生相应的电子与空穴激发。`,
            String.raw`电子占据由化学势和温度决定，常以费米–狄拉克分布表示。金属的费米能级穿过允许的能带，因此附近存在可改变占据的态；具有正带隙的材料也可能因掺杂而使费米能级进入某条能带。反过来，带隙闭合只说明没有这一能量间隔，并不自动保证普通金属式的电导；载流子密度、色散、散射及相互作用仍然重要。`,
          ],
          equation: String.raw`E_g=E_{\mathrm{CBM}}-E_{\mathrm{VBM}},\qquad f(E)=\frac{1}{\exp[(E-\mu)/(k_BT)]+1}`,
          equationNote: String.raw`这里先讨论带边不重叠的情况。若价带和导带发生能量重叠，通常按半金属的能带占据来讨论，而不把它简单叫“负的绝缘带隙”。零温时 $\mu$ 位于理想禁带中的具体位置也不能由“所有价带占满”唯一确定。`,
        },
        {
          id: "direct-indirect",
          title: "4 · 为什么有的带隙适合发光，有的需要声子？",
          paragraphs: [
            String.raw`如果 VBM 和 CBM 出现在同一 $\mathbf k$，称为直接带隙；若出现在不同 $\mathbf k$，称为间接带隙。常见光子的动量相对布里渊区尺度很小，光学跃迁在能带图中近似竖直：能量变化明显，晶体动量变化很小。`,
            "间接带边之间的跃迁通常需要声子参与以补偿晶体动量，所以它的吸收和发光机制不同。但“直接”并不意味着任意跃迁都强烈允许；轨道对称性、自旋选择定则、激子和缺陷也会影响光谱。读图时先寻找带边的位置，再讨论跃迁是否满足能量和动量条件。",
          ],
          equation: String.raw`\begin{aligned}\text{direct:}&\quad\mathbf k_{\mathrm{CBM}}=\mathbf k_{\mathrm{VBM}},\\\text{indirect:}&\quad\mathbf k_{\mathrm{CBM}}\ne\mathbf k_{\mathrm{VBM}}\quad(\text{modulo reciprocal vectors}).\end{aligned}`,
          equationNote:
            "本章二聚化链交互展示一个直接带隙的最小模型；真实材料可以有多个谷、多个价带和更复杂的跃迁。",
        },
        {
          id: "which-gap",
          title: "5 · 计算报告里的 band gap，究竟是哪一种？",
          paragraphs: [
            String.raw`基本带隙是电离能 $I$ 与电子亲和能 $A$ 之差。令 $E(N)$ 为固定核构型下、含 $N$ 个电子的基态总能量，则 $I=E(N-1)-E(N)$，$A=E(N)-E(N+1)$。移走电子的能量代价为 $I$，加入电子的能量变化为 $-A$，两者相加得到 $E_g^{\mathrm{fund}}=I-A$。在周期计算中，带电体系还需要正确处理边界条件和有限尺寸效应。`,
            String.raw`Kohn–Sham 带隙来自辅助单电子本征值。对精确、局域乘法势的 Kohn–Sham 理论，基本带隙还包含交换关联导数不连续项 $\Delta_{\mathrm{xc}}$。实际半局域泛函常低估许多材料的带隙，但不存在对所有材料适用的统一补偿值。光学激发还会受到电子–空穴吸引影响：对于直接带隙体系中的光学允许束缚激子，忽略声子时，吸收能量可以近似写成基本带隙减去激子结合能。`,
          ],
          equation: String.raw`\begin{aligned}E_g^{\mathrm{fund}}&=E(N-1)+E(N+1)-2E(N),\\E_g^{\mathrm{fund}}&=E_g^{\mathrm{KS}}+\Delta_{\mathrm{xc}}\quad(\text{exact local KS}),\\E_{\mathrm{opt}}&\approx E_g^{\mathrm{fund}}-E_b^{\mathrm{exc}}\quad(\text{allowed direct exciton}).\end{aligned}`,
          equationNote:
            "比较计算与实验前，应核对带隙定义、温度、结构、磁态和测量方式。上式最后一行不是间接吸收、所有激子或所有光谱的通用公式。",
          table: {
            headers: ["能量", "回答的问题", "主要注意点"],
            rows: [
              [
                "Kohn–Sham 带隙",
                "辅助有效单电子能级相隔多少？",
                "依赖泛函与理论框架，不直接等于光学吸收边",
              ],
              [
                "基本带隙",
                "电离能与电子亲和能相差多少？",
                "涉及带电激发、极化与边界处理",
              ],
              [
                "光学激发能",
                "光能以多大能量激发允许的中性跃迁？",
                "受到激子、选择定则、声子与温度影响",
              ],
            ],
          },
        },
      ],
      derivation: {
        title: "从一条原子链到可调的带隙",
        intro:
          "采用一维、每个原子一个正交轨道、只保留最近邻跃迁的教学模型。忽略电子相互作用和自旋分裂，先看均匀链，再让两个相邻键交替不同。",
        steps: [
          {
            title: "均匀链先产生一条能带",
            explanation: String.raw`每个格点的局域能量为 $\varepsilon_0$，相邻格点耦合为 $-t$。把 Bloch 系数代入离散方程，得到余弦色散；这一步本身只有一条带。`,
            formula: String.raw`\varepsilon_0c_j-t(c_{j-1}+c_{j+1})=Ec_j,\quad c_j=e^{ikjd}\quad\Longrightarrow\quad E(k)=\varepsilon_0-2t\cos(kd)`,
            note: String.raw`$d$ 是这条均匀链的格点间距；接下来的 $a$ 表示双原子原胞长度。`,
          },
          {
            title: "把交替键放进一个双原子原胞",
            explanation: String.raw`现在每个原胞有 A、B 两个轨道，胞内与胞间耦合分别为 $t_1,t_2>0$，原胞长度为 $a$。平移一个原胞产生相位因子。`,
            formula: String.raw`H(k)=\begin{pmatrix}\varepsilon_0&-(t_1+t_2e^{-ika})\\-(t_1+t_2e^{ika})&\varepsilon_0\end{pmatrix},\qquad -\frac\pi a\le k\le\frac\pi a`,
          },
          {
            title: "求两个本征值",
            explanation:
              "令二阶行列式为零。非对角元的模平方把胞内、胞间跃迁与干涉项组合在一起。",
            formula: String.raw`\det[H(k)-EI]=(\varepsilon_0-E)^2-|t_1+t_2e^{ika}|^2=0\quad\Longrightarrow\quad E_{\pm}(k)=\varepsilon_0\pm\sqrt{t_1^2+t_2^2+2t_1t_2\cos(ka)}`,
          },
          {
            title: "找到最近的两个带边",
            explanation: String.raw`对正的 $t_1,t_2$，根号在布里渊区边界 $ka=\pm\pi$ 最小。上带最低点与下带最高点位于同一波矢。`,
            formula: String.raw`E_{\mathrm{CBM}}=\varepsilon_0+|t_1-t_2|,\qquad E_{\mathrm{VBM}}=\varepsilon_0-|t_1-t_2|,\qquad E_g=2|t_1-t_2|`,
          },
          {
            title: "加入电子数，才得到占据图像",
            explanation: String.raw`若每个原胞有两个电子并保留自旋简并，零温时下带刚好占满，上带为空。交替键不同则开隙，两个耦合相同则闭隙；模型中的中隙能量取 $\varepsilon_0$。`,
            formula: String.raw`n_e=2\ \text{per cell},\quad t_1\ne t_2\Rightarrow E_g>0,\qquad t_1=t_2\Rightarrow E_g=0`,
            note: "模型不含磁性、电子关联或散射。不要仅从闭隙就给真实材料贴上普通金属的标签。",
          },
        ],
      },
      example: {
        title: "交替两个键，带隙会有多大？",
        problem: String.raw`在上述半填充教学链中，取 $\varepsilon_0=0$、$t_1=1.0\,\mathrm{eV}$、$t_2=0.6\,\mathrm{eV}$。求带边、带隙，并比较两个耦合都为 $1.0\,\mathrm{eV}$ 的情况。`,
        solution: [
          String.raw`在区边界 $ka=\pi$，根号为 $|t_1-t_2|=0.4\,\mathrm{eV}$。`,
          String.raw`下带最高点为 $-0.4\,\mathrm{eV}$，上带最低点为 $+0.4\,\mathrm{eV}$，所以 $E_g=0.8\,\mathrm{eV}$。`,
          String.raw`在区中心 $k=0$，两带能量为 $\pm(t_1+t_2)=\pm1.6\,\mathrm{eV}$，不能把它们之间的 $3.2\,\mathrm{eV}$ 误当成最小带隙。`,
          String.raw`若改成 $t_1=t_2=1.0\,\mathrm{eV}$，区边界的两条带接触，$E_g=0$。这是所选模型的闭隙结果，不是对某种真实材料的电导预测。`,
        ],
        result:
          "带隙由整个布里渊区内相邻带边的最近能量差决定；挑选某一个横坐标处的能量差，可能得到错误答案。",
      },
      misconceptions: [
        {
          myth: "能带图横轴表示电子在原子之间走过的路线。",
          correction:
            "横轴通常是倒空间中的波矢路径；每个点标记一种周期电子态，不是实时运动轨迹。",
        },
        {
          myth: "带隙为零，就可以直接预测金属的电导率。",
          correction:
            "闭隙、带重叠和部分填充需要区分，电导还依赖载流子、群速度、散射及相互作用。",
        },
        {
          myth: "DFT 输出的本征值带隙应与光学吸收边完全相同。",
          correction:
            "Kohn–Sham、基本与光学带隙的定义不同；泛函近似、激子、声子和选择定则都可能改变比较。",
        },
      ],
      questions: [
        {
          question: "为什么直接带隙和间接带隙不能只比较数值大小？",
          answer:
            "两者的分类依据是价带顶和导带底的波矢是否相同。相同大小的带隙也可以具有不同动量条件和不同光学跃迁机制。",
        },
        {
          question: String.raw`在教学链中同时将 $t_1,t_2$ 乘以二，会发生什么？`,
          answer: String.raw`相对 $\varepsilon_0$ 的两条色散和带隙都放大两倍，因为平方根整体乘以二。若原来 $t_1=t_2$，带隙仍然为零。`,
        },
        {
          question: "一个正带隙材料一定没有自由载流子吗？",
          answer:
            "不一定。有限温度、掺杂、缺陷或光照都可能产生载流子；足够强的掺杂还可能使费米能级进入能带。讨论电导需要同时看占据和散射。",
        },
      ],
      connections: [
        {
          method: "dft",
          reason:
            "学习周期电子结构、自洽势与 Kohn–Sham 本征态，并理解带隙预测的近似来源。",
        },
        {
          method: "hf",
          reason:
            "比较交换作用和缺失关联如何影响有效单电子能级，避免把所有本征值都直接当作实验激发能。",
        },
      ],
      references: [
        {
          label:
            "OpenStax · University Physics Vol. 3, 9.5 Band Theory of Solids",
          url: "https://openstax.org/books/university-physics-volume-3/pages/9-5-band-theory-of-solids",
          detail: "能带、占据和导体/半导体/绝缘体的开放教材入门。",
        },
        {
          label: "David Tong · Solid State Physics",
          url: "https://www.damtp.cam.ac.uk/user/tong/solidstate.html",
          detail: "Bloch 定理、紧束缚与一维晶格模型的进一步推导。",
        },
        {
          label:
            "Perdew & Levy (1983) · Band gaps and derivative discontinuities",
          url: "https://doi.org/10.1103/PhysRevLett.51.1884",
          detail: "精确 Kohn–Sham 本征值与基本带隙之间的区别。",
        },
        {
          label: "Materials Project · Electronic Structure",
          url: "https://docs.materialsproject.org/methodology/materials-methodology/electronic-structure",
          detail: "了解实际材料数据库中的能带计算、带隙定义和方法限制。",
        },
      ],
    },
    en: {
      title: "Bands and band gaps: which electronic states can be occupied?",
      subtitle:
        "From closely spaced atomic levels to metals, semiconductors, and different gap definitions",
      lead: "A band gap is an interval in energy without the corresponding bulk electronic states, not a spatial crack around an atom. To understand it, consider allowed energies, electron occupation, and the momentum labels of a crystal together.",
      readMinutes: 19,
      objectives: [
        "Explain how discrete atomic states form bands in a periodic system.",
        "Read valence and conduction edges, the Fermi level, and direct or indirect gaps.",
        "Distinguish the fundamental gap, the Kohn–Sham gap, and optical excitation energies.",
      ],
      sections: [
        {
          id: "from-atoms",
          title: "1 · One atom, two atoms, and an entire crystal",
          paragraphs: [
            String.raw`An isolated atom has discrete bound-state energies. Coupling two similar atomic orbitals produces two combinations with different energies. For $N$ atoms, one orbital per atom produces $N$ spatial states. In a macroscopic sample, $N$ is enormous and neighboring energies become extremely close, forming what appears to be a continuous band.`,
            "This is more than simply broadening every atomic level. Different orbital characters can hybridize, crystal symmetry can protect degeneracies or permit gaps, and interactions can alter the spectrum. The d bands and s character of metallic Fe belong to crystal states, not a repeated copy of the free-atom occupation diagram.",
          ],
          equation: String.raw`N\ \text{atomic orbitals}\ \longrightarrow\ N\ \text{spatial states}\ \longrightarrow\ \text{a band}`,
          equationNote:
            "In a simple spin-degenerate model, each spatial state accommodates two opposite-spin electrons. Magnetic materials require separate treatment of spin channels.",
        },
        {
          id: "periodic-states",
          title: "2 · Why is the horizontal axis a wavevector?",
          paragraphs: [
            String.raw`A periodic potential satisfies $V(\mathbf r+\mathbf R)=V(\mathbf r)$ for lattice translations $\mathbf R$. Its single-electron or effective single-electron states have Bloch form: a plane-wave factor multiplied by a lattice-periodic function. Energies are labeled by band index $n$ and crystal wavevector $\mathbf k$, giving the dispersion $E_n(\mathbf k)$.`,
            String.raw`The horizontal axis is neither distance from a nucleus nor an electron trajectory. The quantity $\hbar\mathbf k$ is crystal momentum, with equivalence modulo reciprocal lattice vectors. Usually one studies the first Brillouin zone. A three-dimensional band plot often follows selected high-symmetry paths, which can miss extrema elsewhere; an accurate gap requires adequate sampling of the full zone.`,
          ],
          equation: String.raw`\psi_{n\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{n\mathbf k}(\mathbf r),\qquad u_{n\mathbf k}(\mathbf r+\mathbf R)=u_{n\mathbf k}(\mathbf r)`,
          equationNote:
            "The Bloch description relies on periodicity. Disorder, surfaces, and finite systems require corresponding changes to the description.",
        },
        {
          id: "gap-occupation",
          title: "3 · Read the gap, occupation, and Fermi level together",
          paragraphs: [
            String.raw`For a conventional band insulator or semiconductor, the valence-band maximum, VBM, is the highest valence energy and the conduction-band minimum, CBM, the lowest conduction energy. Their difference defines $E_g$. In the zero-temperature independent-electron picture, the valence bands are filled and the conduction bands empty, so the corresponding electron–hole excitation must bridge that interval.`,
            "Occupation depends on chemical potential and temperature through the Fermi–Dirac distribution. In a metal, the Fermi level crosses an allowed band, leaving nearby states whose occupations can change. Doping can also move the Fermi level into a band of a positive-gap material. Conversely, closing a gap does not alone guarantee ordinary metallic conductivity: carrier density, dispersion, scattering, and interactions still matter.",
          ],
          equation: String.raw`E_g=E_{\mathrm{CBM}}-E_{\mathrm{VBM}},\qquad f(E)=\frac{1}{\exp[(E-\mu)/(k_BT)]+1}`,
          equationNote: String.raw`This initially assumes nonoverlapping band edges. Overlapping valence and conduction bands are usually discussed through semimetallic occupation, rather than as a negative insulating gap. At zero temperature, filled valence bands alone also do not uniquely fix $\mu$ within an ideal gap.`,
        },
        {
          id: "direct-indirect",
          title: "4 · Why do some transitions need a phonon?",
          paragraphs: [
            String.raw`A direct gap has its VBM and CBM at the same $\mathbf k$; an indirect gap has them at different wavevectors. Ordinary photon momenta are small on the Brillouin-zone scale, so optical transitions are approximately vertical in a band plot: energy changes substantially while crystal momentum changes very little.`,
            "A transition between indirect band edges usually needs a phonon to supply or remove crystal momentum. Its absorption and emission mechanisms therefore differ. Direct does not mean every transition is strongly allowed: orbital symmetry, spin selection rules, excitons, and defects also affect spectra. First locate the band edges, then examine energy and momentum requirements.",
          ],
          equation: String.raw`\begin{aligned}\text{direct:}&\quad\mathbf k_{\mathrm{CBM}}=\mathbf k_{\mathrm{VBM}},\\\text{indirect:}&\quad\mathbf k_{\mathrm{CBM}}\ne\mathbf k_{\mathrm{VBM}}\quad(\text{modulo reciprocal vectors}).\end{aligned}`,
          equationNote:
            "The interactive dimerized chain is a minimal direct-gap model. Real materials may contain multiple valleys, several valence bands, and more complicated transitions.",
        },
        {
          id: "which-gap",
          title: "5 · Which band gap does a calculation report?",
          paragraphs: [
            String.raw`The fundamental gap is ionization energy $I$ minus electron affinity $A$. Let $E(N)$ be the ground-state total energy with $N$ electrons at fixed nuclear geometry. Then $I=E(N-1)-E(N)$ and $A=E(N)-E(N+1)$. Removing an electron costs $I$; adding one changes the energy by $-A$. Adding these changes gives $E_g^{\mathrm{fund}}=I-A$. Charged periodic calculations also require appropriate boundary conditions and finite-size treatment.`,
            String.raw`A Kohn–Sham gap instead comes from auxiliary one-electron eigenvalues. In exact Kohn–Sham theory with a local multiplicative potential, the fundamental gap also includes the exchange–correlation derivative discontinuity $\Delta_{\mathrm{xc}}$. Practical semilocal functionals underestimate many gaps, but no universal correction fits every material. Optical excitation also includes electron–hole attraction: for an optically allowed bound exciton in a direct-gap system, neglecting phonons, its energy can be approximated by the fundamental gap minus the exciton binding energy.`,
          ],
          equation: String.raw`\begin{aligned}E_g^{\mathrm{fund}}&=E(N-1)+E(N+1)-2E(N),\\E_g^{\mathrm{fund}}&=E_g^{\mathrm{KS}}+\Delta_{\mathrm{xc}}\quad(\text{exact local KS}),\\E_{\mathrm{opt}}&\approx E_g^{\mathrm{fund}}-E_b^{\mathrm{exc}}\quad(\text{allowed direct exciton}).\end{aligned}`,
          equationNote:
            "Before comparing with experiment, match the gap definition, temperature, structure, magnetic state, and measurement. The last line is not a universal formula for indirect absorption or every optical spectrum.",
          table: {
            headers: ["Energy", "Question it answers", "Key qualification"],
            rows: [
              [
                "Kohn–Sham gap",
                "How far apart are the auxiliary one-electron edges?",
                "Depends on the functional and framework; not directly the optical absorption edge",
              ],
              [
                "Fundamental gap",
                "What is ionization energy minus electron affinity?",
                "Involves charged excitations, polarization, and boundary treatment",
              ],
              [
                "Optical excitation",
                "What photon energy excites an allowed neutral transition?",
                "Affected by excitons, selection rules, phonons, and temperature",
              ],
            ],
          },
        },
      ],
      derivation: {
        title: "From an atomic chain to a tunable gap",
        intro:
          "Use a one-dimensional teaching model with one orthogonal orbital per site and nearest-neighbor hopping. Neglect interactions and spin splitting. Begin with a uniform chain, then alternate the two neighboring bonds.",
        steps: [
          {
            title: "A uniform chain gives one band",
            explanation: String.raw`Each site has energy $\varepsilon_0$ and couples to its neighbors by $-t$. Substituting Bloch coefficients into the discrete equation gives a cosine dispersion. This first step has only one band.`,
            formula: String.raw`\varepsilon_0c_j-t(c_{j-1}+c_{j+1})=Ec_j,\quad c_j=e^{ikjd}\quad\Longrightarrow\quad E(k)=\varepsilon_0-2t\cos(kd)`,
            note: String.raw`Here $d$ is the uniform-chain site spacing; $a$ below denotes the two-site unit-cell length.`,
          },
          {
            title: "Place alternating bonds in a two-site cell",
            explanation: String.raw`Each cell now contains orbitals A and B, with positive intracell and intercell hoppings $t_1,t_2$ and cell length $a$. Translation by one cell produces a phase factor.`,
            formula: String.raw`H(k)=\begin{pmatrix}\varepsilon_0&-(t_1+t_2e^{-ika})\\-(t_1+t_2e^{ika})&\varepsilon_0\end{pmatrix},\qquad -\frac\pi a\le k\le\frac\pi a`,
          },
          {
            title: "Solve for two eigenvalues",
            explanation:
              "Set the two-by-two determinant to zero. The squared off-diagonal magnitude combines the two hoppings and their interference.",
            formula: String.raw`\det[H(k)-EI]=(\varepsilon_0-E)^2-|t_1+t_2e^{ika}|^2=0\quad\Longrightarrow\quad E_{\pm}(k)=\varepsilon_0\pm\sqrt{t_1^2+t_2^2+2t_1t_2\cos(ka)}`,
          },
          {
            title: "Locate the closest band edges",
            explanation: String.raw`For positive $t_1,t_2$, the square root is smallest at $ka=\pm\pi$. The upper-band minimum and lower-band maximum occur at the same wavevector.`,
            formula: String.raw`E_{\mathrm{CBM}}=\varepsilon_0+|t_1-t_2|,\qquad E_{\mathrm{VBM}}=\varepsilon_0-|t_1-t_2|,\qquad E_g=2|t_1-t_2|`,
          },
          {
            title: "Specify electron number to determine occupation",
            explanation: String.raw`With two electrons per cell and spin degeneracy, the lower band is filled and the upper band empty at zero temperature. Unequal hoppings open the gap; equal hoppings close it. The model uses $\varepsilon_0$ as the midgap energy.`,
            formula: String.raw`n_e=2\ \text{per cell},\quad t_1\ne t_2\Rightarrow E_g>0,\qquad t_1=t_2\Rightarrow E_g=0`,
            note: "The model omits magnetism, correlation, and scattering. A gap closing alone does not establish ordinary metallic behavior in a real material.",
          },
        ],
      },
      example: {
        title: "How large a gap do alternating bonds create?",
        problem: String.raw`In the half-filled teaching chain, set $\varepsilon_0=0$, $t_1=1.0\,\mathrm{eV}$, and $t_2=0.6\,\mathrm{eV}$. Find the edges and gap, then compare equal hoppings of $1.0\,\mathrm{eV}$.`,
        solution: [
          String.raw`At the zone boundary $ka=\pi$, the square root equals $|t_1-t_2|=0.4\,\mathrm{eV}$.`,
          String.raw`The lower-band maximum is $-0.4\,\mathrm{eV}$ and the upper-band minimum is $+0.4\,\mathrm{eV}$, giving $E_g=0.8\,\mathrm{eV}$.`,
          String.raw`At the zone center $k=0$, the energies are $\pm(t_1+t_2)=\pm1.6\,\mathrm{eV}$. Their $3.2\,\mathrm{eV}$ separation is not the minimum gap.`,
          String.raw`Setting $t_1=t_2=1.0\,\mathrm{eV}$ makes the bands touch at the zone boundary, so $E_g=0$. This is a property of the model, not a conductivity prediction for a particular material.`,
        ],
        result:
          "A gap is determined by the closest relevant band edges over the whole Brillouin zone. Reading a separation at an arbitrary horizontal coordinate can give the wrong answer.",
      },
      misconceptions: [
        {
          myth: "The horizontal axis shows an electron’s route between atoms.",
          correction:
            "It usually follows a reciprocal-space wavevector path. Each point labels a periodic electronic state, not a real-time trajectory.",
        },
        {
          myth: "A zero gap directly determines metallic conductivity.",
          correction:
            "Gap closing, band overlap, and partial filling are distinct. Conductivity also depends on carriers, group velocities, scattering, and interactions.",
        },
        {
          myth: "A DFT eigenvalue gap must equal the optical absorption edge.",
          correction:
            "Kohn–Sham, fundamental, and optical gaps have different definitions. Functional approximations, excitons, phonons, and selection rules affect the comparison.",
        },
      ],
      questions: [
        {
          question:
            "Why cannot direct and indirect gaps be distinguished just by their size?",
          answer:
            "The distinction concerns whether the valence maximum and conduction minimum share a wavevector. Equal gap sizes can have different momentum requirements and optical mechanisms.",
        },
        {
          question: String.raw`What happens if both $t_1$ and $t_2$ are doubled?`,
          answer: String.raw`Both dispersions relative to $\varepsilon_0$ and the gap double, since the square root scales by two. If the hoppings were equal, the gap remains zero.`,
        },
        {
          question:
            "Must a material with a positive gap have no mobile carriers?",
          answer:
            "No. Temperature, doping, defects, or illumination can create carriers, and sufficiently strong doping can move the Fermi level into a band. Conductivity requires occupation and scattering information.",
        },
      ],
      connections: [
        {
          method: "dft",
          reason:
            "Study periodic electronic structure, self-consistent potentials, Kohn–Sham states, and approximations in gap predictions.",
        },
        {
          method: "hf",
          reason:
            "Examine how exchange and missing correlation affect effective one-electron energies without identifying every eigenvalue with an experimental excitation.",
        },
      ],
      references: [
        {
          label:
            "OpenStax · University Physics Vol. 3, 9.5 Band Theory of Solids",
          url: "https://openstax.org/books/university-physics-volume-3/pages/9-5-band-theory-of-solids",
          detail:
            "An open introduction to bands, occupation, metals, semiconductors, and insulators.",
        },
        {
          label: "David Tong · Solid State Physics",
          url: "https://www.damtp.cam.ac.uk/user/tong/solidstate.html",
          detail:
            "Further derivations of Bloch’s theorem, tight binding, and one-dimensional lattices.",
        },
        {
          label:
            "Perdew & Levy (1983) · Band gaps and derivative discontinuities",
          url: "https://doi.org/10.1103/PhysRevLett.51.1884",
          detail:
            "The distinction between exact Kohn–Sham eigenvalues and fundamental gaps.",
        },
        {
          label: "Materials Project · Electronic Structure",
          url: "https://docs.materialsproject.org/methodology/materials-methodology/electronic-structure",
          detail:
            "Band calculations, gap definitions, and practical limitations in a materials database.",
        },
      ],
    },
  },
  "formation-energy": {
    zh: {
      title: "形成能：相对于什么，材料更稳定？",
      subtitle: "参考态、凝聚能、竞争相与缺陷形成",
      lead: "一个很负的总能量本身几乎不能说明材料是否稳定。形成能把问题改写为明确的反应：从哪些参考物质出发，形成目标结构时能量改变多少？随后还要与其他可能的分解方式比较。",
      readMinutes: 19,
      objectives: [
        "明确形成能的参考态、原子数和每原子或每化学式单元的单位。",
        "区分形成能与凝聚能，并用竞争相凸包判断热力学稳定性。",
        "把形成能扩展到空位、化学势和有限温度自由能。",
      ],
      sections: [
        {
          id: "reference-reaction",
          title: "1 · 先把反应和参考态写出来",
          paragraphs: [
            String.raw`考虑由 $m$ 个 A 原子和 $n$ 个 B 原子组成的 $\mathrm A_m\mathrm B_n$。在静态、接近零温的总能量比较中，从化合物能量减去相同数量元素参考态的能量，得到形成能。$\mu_A^{\mathrm{ref}}$、$\mu_B^{\mathrm{ref}}$ 是各参考态每个原子的能量，不能把每个分子的能量不加换算地代入。`,
            String.raw`参考态通常选指定条件下稳定的元素相，并使用一致的计算设置、能量修正和磁态处理。负形成能表示相对这些参考态形成目标结构有利。按相同参考定义，参考相本身的元素形成能为零：例如把某个 Fe 稳定元素相选为参考时，这个相的形成能为零，并不意味着它没有结合能，也不意味着所有 Fe 结构都具有零形成能。`,
          ],
          equation: String.raw`\Delta E_f(\mathrm A_m\mathrm B_n)=E(\mathrm A_m\mathrm B_n)-m\mu_A^{\mathrm{ref}}-n\mu_B^{\mathrm{ref}},\qquad \Delta e_f=\frac{\Delta E_f}{m+n}`,
          equationNote: String.raw`前一个量按这里的定义是 eV/化学式单元，后一个是 eV/atom。计算超胞包含多个化学式单元时，还需先按原子数或化学式数统一归一化。`,
        },
        {
          id: "cohesion",
          title: "2 · 形成能和凝聚能为什么不同？",
          paragraphs: [
            "凝聚能把固体与彼此分离的中性原子比较，形成能通常把化合物与稳定的元素物质比较。这些元素物质本身已经通过金属键、共价键或分子键结合，因此两种参考能量一般不同。总能量很低、凝聚能很大、形成能为负，是三个不同的陈述。",
            "本章约定凝聚能取正值表示结合有利，即分离原子的能量减去固体能量。有些文献采用相反符号，阅读时要先查定义。对于 Fe 元素参考固体，其形成能按定义为零，凝聚能却不为零。计算孤立 Fe 原子时还要正确处理原子自旋态，不能随便用一个无自旋原子能量作为参考。",
          ],
          equation: String.raw`E_{\mathrm{coh}}=\sum_i n_iE_i^{\mathrm{isolated\ atom}}-E_{\mathrm{solid}}`,
          equationNote:
            "这里仍是相应组成单元的能量；若报告 eV/atom，需要除以总原子数。凝聚能采用正的结合能约定。",
          table: {
            headers: ["量", "参考物质", "本章的有利符号"],
            rows: [
              [
                "形成能",
                "指定条件下的元素参考相",
                "负：相对这些元素参考相有利",
              ],
              ["凝聚能", "彼此分离的中性原子", "正：结合成固体降低能量"],
              [
                "高于凸包的能量",
                "相同组成下最有利的竞争相组合",
                "零：在所考虑相集合中位于凸包上",
              ],
            ],
          },
        },
        {
          id: "convex-hull",
          title: "3 · 负形成能为什么还不够？",
          paragraphs: [
            "目标材料可以分解成元素，也可以分解成其他化合物。把所有候选相的每原子形成能对组成作图，在保持总组成的约束下，任意两相混合物的能量位于连接两相的线段上。所有可行混合物的最低能量形成下凸包。高于这条边界的相存在更低能量的分解组合。",
            String.raw`高于凸包的能量 $E_{\mathrm{hull}}$ 衡量相对于这些竞争相的能量劣势，但它不是分解速率或合成难度。高于凸包的相仍可能被动力学阻碍而保留；位于凸包上也不能保证实际制备过程一定得到该相。图中只考虑列出的相，遗漏竞争相会改变结论。`,
          ],
          equation: String.raw`e_{\mathrm{hull}}(x)=\min_{\{\lambda_j\}}\sum_j\lambda_je_j,\qquad \lambda_j\ge0,\quad\sum_j\lambda_j=1,\quad\sum_j\lambda_jx_j=x`,
          equationNote: String.raw`$x$ 是 B 的原子分数，$e_j$ 是每原子形成能，$\lambda_j$ 是分配到各相的原子数比例。候选相加入相集合后，其高于凸包的能量为 $E_{\mathrm{hull}}=e_{\mathrm{candidate}}-e_{\mathrm{hull}}(x)\ge0$。`,
        },
        {
          id: "defects",
          title: "4 · 造一个空位，移走的原子去了哪里？",
          paragraphs: [
            String.raw`在含 $N$ 个 Fe 原子的完整超胞中移走一个原子，缺陷超胞只剩 $N-1$ 个原子，不能只比较两个超胞总能量。被移走的原子进入一个原子库，其每原子化学势为 $\mu_{\mathrm{Fe}}$；把这个原子库的能量变化加回，才得到中性空位形成能。`,
            String.raw`对于一般中性缺陷，令 $n_i>0$ 表示加入缺陷超胞的第 $i$ 种原子数，则形成能中的原子库项为 $-\sum_i n_i\mu_i$。化学势描述原子交换环境，不能任意选择：它必须满足宿主和竞争相的稳定性条件。带电缺陷还涉及电子库、费米能级、势能对齐和有限尺寸校正，不能直接套用中性空位公式。`,
          ],
          equation: String.raw`\begin{aligned}E_f(V_{\mathrm{Fe}})&=E_{\mathrm{defective}}-E_{\mathrm{perfect}}+\mu_{\mathrm{Fe}},\\E_f(D^0)&=E_{\mathrm{defective}}-E_{\mathrm{perfect}}-\sum_i n_i\mu_i.\end{aligned}`,
          equationNote:
            "移走一个 Fe 原子意味着对应原子数变化为 −1，所以空位公式中化学势项为正。缺陷能还需要检查超胞尺寸、结构松弛和相互作用误差。",
        },
        {
          id: "finite-temperature",
          title: "5 · 从零温能量到真实条件下的稳定性",
          paragraphs: [
            String.raw`静态 DFT 总能量常作为低温起点，但有限温度和平衡压力下应比较适当的热力学势。Gibbs 自由能 $G=H-TS$ 可以包含电子、振动、构型和磁性贡献，以及体积变化。两个相的静态能量差很小时，熵项可能改变相稳定顺序；零点振动也可能需要纳入。`,
            String.raw`形成能是多个较大总能量的差，因此必须关注误差如何相消或累积。若 $E_f=\mathbf a^{\mathsf T}\mathbf E$，其方差为 $\mathbf a^{\mathsf T}\Sigma_E\mathbf a$。共享泛函、赝势和计算设置可能产生相关误差，忽略相关性会误判不确定度；但一致设置也不保证近似误差完全抵消。最终应同时报告参考态、温度条件、竞争相范围及收敛情况。`,
          ],
          equation: String.raw`\Delta G_f(T,p)=G_{\mathrm{compound}}(T,p)-\sum_i n_i\mu_i(T,p),\qquad \operatorname{Var}(E_f)=\mathbf a^{\mathsf T}\Sigma_E\mathbf a`,
          equationNote:
            "热力学势决定给定约束下的平衡比较；成核、扩散和能垒决定达到平衡的途径与时间。两类问题需要分别建模。",
        },
      ],
      derivation: {
        title: "从一个形成反应，推到竞争相凸包",
        intro:
          "先计算相对元素参考态的能量差，再统一成每原子单位。最后加入组成守恒，比较一个候选相与所有允许的相组合。",
        steps: [
          {
            title: "写出组成守恒的形成反应",
            explanation:
              "反应左右的 A、B 原子数必须一致。参考物质的能量以每原子化学势表示。",
            formula: String.raw`m\mathrm A_{\mathrm{ref}}+n\mathrm B_{\mathrm{ref}}\longrightarrow\mathrm A_m\mathrm B_n,\qquad\Delta E_f=E(\mathrm A_m\mathrm B_n)-m\mu_A^{\mathrm{ref}}-n\mu_B^{\mathrm{ref}}`,
          },
          {
            title: "把不同化学式放到同一坐标系",
            explanation:
              "不同相包含不同数量的原子。用 B 原子分数和每原子能量，才能在同一组成图上公平比较。",
            formula: String.raw`x_B=\frac{n}{m+n},\qquad e_f=\frac{\Delta E_f}{m+n}`,
          },
          {
            title: "求两相混合的组成与能量",
            explanation: String.raw`设两相组成分别为 $x_1,x_2$，其中 $x_1<x<x_2$。按原子数计的第二相比例为 $\lambda$，用组成守恒解出它，能量按同一比例加权。`,
            formula: String.raw`x=(1-\lambda)x_1+\lambda x_2\quad\Longrightarrow\quad\lambda=\frac{x-x_1}{x_2-x_1},\qquad e_{\mathrm{mix}}=(1-\lambda)e_1+\lambda e_2`,
          },
          {
            title: "比较所有竞争组合",
            explanation:
              "对允许相集合中的所有满足组成约束的组合取最低值，得到竞争相的下边界。候选相若比它低，加入候选后会改变凸包。",
            formula: String.raw`e_{\mathrm{comp}}(x)=\min\sum_j\lambda_je_j,\qquad\Delta e=e_{\mathrm{candidate}}-e_{\mathrm{comp}}(x),\qquad E_{\mathrm{hull}}=\max(0,\Delta e)`,
            note: "最后一式针对一个候选相与给定竞争相集合：候选加入后，低于原边界的候选位于新的凸包上。不可把负的竞争能量差标成负的高于凸包能量。",
          },
          {
            title: "把线性能量差连接到误差传播",
            explanation:
              "形成能和固定组成混合物能量都是总能量的线性组合。保留各项协方差，可检验相关误差是否抵消。",
            formula: String.raw`E_f=\sum_i a_iE_i,\qquad\operatorname{Var}(E_f)=\sum_i a_i^2\operatorname{Var}(E_i)+2\sum_{i<j}a_ia_j\operatorname{Cov}(E_i,E_j)`,
            note: "这描述给定线性组合的随机不确定度。未知模型偏差和竞争相遗漏仍需单独评估，不能仅靠这一方差公式消除。",
          },
        ],
      },
      example: {
        title: "形成能为负的 A₃B，为什么仍会分解？",
        problem: String.raw`假想二元体系中，A、AB、B 的每原子形成能分别为 $0$、$-0.30$、$0\,\mathrm{eV/atom}$。候选 $\mathrm A_3\mathrm B$ 的形成能为 $-0.10\,\mathrm{eV/atom}$。仅比较这些相，判断候选相是否在零温静态能量凸包上。`,
        solution: [
          String.raw`候选组成 $x_B=1/(3+1)=0.25$。A 的组成是 0，AB 的组成是 0.5。`,
          String.raw`混合 A 与 AB 时，AB 相所占原子数比例为 $\lambda=(0.25-0)/(0.5-0)=0.5$；另一半原子位于 A 相。`,
          String.raw`竞争混合物能量 $e_{\mathrm{mix}}=0.5\times0+0.5\times(-0.30)=-0.15\,\mathrm{eV/atom}$。`,
          String.raw`候选高出 $-0.10-(-0.15)=0.05\,\mathrm{eV/atom}$，因此存在 $\mathrm A_3\mathrm B\rightarrow2\mathrm A+\mathrm{AB}$ 的降能分解通道。每个四原子化学式单元的能量差为 $0.20\,\mathrm{eV}$。`,
        ],
        result:
          "候选相相对纯元素有利，却不如 A 与 AB 的混合物有利。此例只比较假想静态能量；它不预测分解时间，也不代表真实材料数据库。",
      },
      misconceptions: [
        {
          myth: "形成能小于零，就证明材料是稳定相。",
          correction:
            "只证明它相对选定元素参考态有利；还需比较所有相关竞争相，并考虑温度、压力和模型误差。",
        },
        {
          myth: "元素 Fe 的形成能为零，所以 Fe 原子之间没有结合。",
          correction:
            "零值来自把该元素相选为参考。凝聚能以分离原子为参考，衡量的是另一个能量差。",
        },
        {
          myth: "高于凸包的能量越大，分解就一定越快。",
          correction:
            "凸包给出热力学驱动力，速率还取决于能垒、扩散、界面和成核条件。动力学稳定与平衡稳定不同。",
        },
      ],
      questions: [
        {
          question: String.raw`若候选 $\mathrm A_3\mathrm B$ 的能量降到 $-0.20\,\mathrm{eV/atom}$，还高于本例的凸包吗？`,
          answer: String.raw`它比原竞争混合物 $-0.15\,\mathrm{eV/atom}$ 更低。加入该候选后，新的凸包通过它，故其高于凸包能量为零；相对旧竞争边界的能量差为 $-0.05\,\mathrm{eV/atom}$。仍需检查是否遗漏其他相。`,
        },
        {
          question: "为什么中性空位公式中的原子化学势前面是加号？",
          answer:
            "缺陷超胞比完整超胞少一个原子，被移走的原子进入原子库。完整反应的能量变化等于缺陷超胞能量加上原子库得到该原子的能量，再减去完整超胞能量。",
        },
        {
          question: "两个文献报告的形成能数值不同，比较前应先检查什么？",
          answer:
            "先核对组成、每原子或每化学式单位、元素参考相、磁态、温度和压力，再核对泛函、赝势、修正方案及收敛设置；参考与归一化不同的数值不能直接比较。",
        },
      ],
      connections: [
        {
          method: "dft",
          reason:
            "提供不同结构、元素参考相和缺陷超胞的总能量，并检查收敛与能量差的可靠性。",
        },
        {
          method: "kmc",
          reason:
            "把稳定态与缺陷能量放进事件模型，同时区分形成能、迁移能垒和实际跃迁速率。",
        },
        {
          method: "phase-field",
          reason: "把热力学自由能与界面、动力学结合，描述相分离和组织演化。",
        },
      ],
      references: [
        {
          label: "Materials Project · Phase Diagrams",
          url: "https://docs.materialsproject.org/methodology/materials-methodology/thermodynamic-stability/phase-diagrams-pds",
          detail: "形成能、竞争相与高于凸包能量的实际材料计算定义。",
        },
        {
          label:
            "Freysoldt et al. (2014) · First-principles calculations for point defects in solids",
          url: "https://doi.org/10.1103/RevModPhys.86.253",
          detail: "缺陷形成能、化学势、带电缺陷与有限尺寸校正的综述。",
        },
        {
          label: "OpenStax · Chemistry 2e, 16.4 Free Energy",
          url: "https://openstax.org/books/chemistry-2e/pages/16-4-free-energy",
          detail: "自由能、温度与平衡条件的基础热力学背景。",
        },
      ],
    },
    en: {
      title: "Formation energy: more stable relative to what?",
      subtitle: "Reference states, cohesion, competing phases, and defects",
      lead: "A very negative total energy says little by itself about stability. Formation energy poses a specific reaction: starting from which reference substances, how much does the energy change when the target structure forms? Other possible decomposition routes must then be compared.",
      readMinutes: 19,
      objectives: [
        "Specify reference states, atom counts, and per-atom or per-formula-unit normalization.",
        "Distinguish formation energy from cohesive energy and use a competing-phase convex hull.",
        "Extend the bookkeeping to vacancies, chemical potentials, and finite-temperature free energies.",
      ],
      sections: [
        {
          id: "reference-reaction",
          title: "1 · Write the reaction and references first",
          paragraphs: [
            String.raw`Consider $\mathrm A_m\mathrm B_n$, containing $m$ A atoms and $n$ B atoms. In a static, approximately zero-temperature comparison, subtract the energies of the same atom counts in elemental reference states from the compound energy. The quantities $\mu_A^{\mathrm{ref}},\mu_B^{\mathrm{ref}}$ are energies per reference atom; a molecular energy must be converted before being used here.`,
            "References usually use stable elemental phases under specified conditions, with consistent computational settings, energy corrections, and magnetic treatment. Negative formation energy favors formation relative to those references. The chosen elemental reference phase itself has zero formation energy by definition. If a stable Fe phase is the reference, its zero value does not imply zero binding or zero formation energy for every other Fe structure.",
          ],
          equation: String.raw`\Delta E_f(\mathrm A_m\mathrm B_n)=E(\mathrm A_m\mathrm B_n)-m\mu_A^{\mathrm{ref}}-n\mu_B^{\mathrm{ref}},\qquad \Delta e_f=\frac{\Delta E_f}{m+n}`,
          equationNote:
            "With these definitions the first quantity is in eV per formula unit and the second in eV/atom. A supercell containing multiple formula units needs the corresponding atom-count or formula-count normalization.",
        },
        {
          id: "cohesion",
          title: "2 · Why is cohesive energy different?",
          paragraphs: [
            "Cohesive energy compares a solid with separated neutral atoms. Formation energy usually compares a compound with stable elemental substances, which already contain metallic, covalent, or molecular bonding. These are different reference energies. A low total energy, a large cohesive energy, and a negative formation energy are therefore different statements.",
            "Here cohesive energy is positive for favorable binding: separated-atom energies minus the solid energy. Some literature uses the opposite sign, so check the definition first. An elemental Fe reference solid has zero formation energy but nonzero cohesive energy. Its isolated-atom calculation also requires a suitable atomic spin state rather than an arbitrary nonmagnetic atom.",
          ],
          equation: String.raw`E_{\mathrm{coh}}=\sum_i n_iE_i^{\mathrm{isolated\ atom}}-E_{\mathrm{solid}}`,
          equationNote:
            "This is the energy for the chosen composition unit. Divide by total atom count for eV/atom. The sign convention is positive binding energy.",
          table: {
            headers: ["Quantity", "Reference", "Favorable sign used here"],
            rows: [
              [
                "Formation energy",
                "Elemental reference phases under specified conditions",
                "Negative: favored over those elemental references",
              ],
              [
                "Cohesive energy",
                "Separated neutral atoms",
                "Positive: binding lowers energy",
              ],
              [
                "Energy above hull",
                "Lowest-energy competing mixture at the same composition",
                "Zero: on the hull of the phases considered",
              ],
            ],
          },
        },
        {
          id: "convex-hull",
          title: "3 · Why is a negative formation energy insufficient?",
          paragraphs: [
            "A material may decompose into elements or into other compounds. Plot each candidate phase’s per-atom formation energy against composition. At fixed overall composition, the energy of any two-phase mixture lies on the line connecting those phases. The lowest energies of all feasible mixtures form the lower convex hull. A phase above this boundary has a lower-energy decomposition route.",
            String.raw`Energy above hull, $E_{\mathrm{hull}}$, measures an energetic disadvantage relative to those competing phases. It does not measure decomposition rate or synthesis difficulty. Kinetic barriers can preserve a phase above the hull, while being on the hull does not guarantee that a preparation route will produce it. Missing competing phases can also change the conclusion.`,
          ],
          equation: String.raw`e_{\mathrm{hull}}(x)=\min_{\{\lambda_j\}}\sum_j\lambda_je_j,\qquad \lambda_j\ge0,\quad\sum_j\lambda_j=1,\quad\sum_j\lambda_jx_j=x`,
          equationNote: String.raw`Here $x$ is the B atomic fraction, $e_j$ is formation energy per atom, and $\lambda_j$ is the fraction of all atoms assigned to phase $j$. After including the candidate, its energy above hull is $E_{\mathrm{hull}}=e_{\mathrm{candidate}}-e_{\mathrm{hull}}(x)\ge0$.`,
        },
        {
          id: "defects",
          title: "4 · When a vacancy forms, where does the removed atom go?",
          paragraphs: [
            String.raw`Removing one Fe atom from a perfect $N$-atom supercell leaves a defective cell with $N-1$ atoms. Subtracting their total energies alone compares different atom counts. The removed atom enters a reservoir with per-atom chemical potential $\mu_{\mathrm{Fe}}$; its reservoir contribution completes the neutral-vacancy reaction.`,
            String.raw`For a general neutral defect, define $n_i>0$ as atoms of species $i$ added to the defective cell. The reservoir contribution is then $-\sum_i n_i\mu_i$. Chemical potentials describe the exchange environment and must satisfy host and competing-phase stability constraints. Charged defects additionally involve an electron reservoir, Fermi level, potential alignment, and finite-size corrections, so the neutral-vacancy formula cannot be used unchanged.`,
          ],
          equation: String.raw`\begin{aligned}E_f(V_{\mathrm{Fe}})&=E_{\mathrm{defective}}-E_{\mathrm{perfect}}+\mu_{\mathrm{Fe}},\\E_f(D^0)&=E_{\mathrm{defective}}-E_{\mathrm{perfect}}-\sum_i n_i\mu_i.\end{aligned}`,
          equationNote:
            "Removing one Fe atom means its atom-count change is −1, giving the positive chemical-potential term. Defect calculations also need supercell-size, relaxation, and interaction-error checks.",
        },
        {
          id: "finite-temperature",
          title: "5 · From zero-temperature energies to real conditions",
          paragraphs: [
            String.raw`Static DFT energies often provide a low-temperature starting point. At finite temperature and prescribed pressure, compare the appropriate thermodynamic potential. Gibbs free energy $G=H-TS$ may include electronic, vibrational, configurational, and magnetic contributions, as well as volume changes. Entropy can reverse stability when static energies are close, and zero-point vibration may also matter.`,
            String.raw`Formation energy is a difference between larger total energies, so error cancellation and accumulation require care. For $E_f=\mathbf a^{\mathsf T}\mathbf E$, its variance is $\mathbf a^{\mathsf T}\Sigma_E\mathbf a$. Shared functionals, pseudopotentials, and settings can produce correlated errors. Ignoring correlations can misestimate uncertainty, but consistent settings do not guarantee complete cancellation of approximation error. Report references, conditions, competing phases, and convergence.`,
          ],
          equation: String.raw`\Delta G_f(T,p)=G_{\mathrm{compound}}(T,p)-\sum_i n_i\mu_i(T,p),\qquad \operatorname{Var}(E_f)=\mathbf a^{\mathsf T}\Sigma_E\mathbf a`,
          equationNote:
            "Thermodynamic potentials determine equilibrium comparisons under specified constraints. Nucleation, diffusion, and barriers determine pathways and timescales. These require distinct modeling information.",
        },
      ],
      derivation: {
        title: "From a formation reaction to a competing-phase convex hull",
        intro:
          "First calculate an energy difference relative to elements and normalize per atom. Then enforce composition conservation and compare a candidate with every allowed phase combination.",
        steps: [
          {
            title: "Balance the formation reaction",
            explanation:
              "Both sides must contain equal A and B atom counts. Reference energies are expressed as chemical potentials per atom.",
            formula: String.raw`m\mathrm A_{\mathrm{ref}}+n\mathrm B_{\mathrm{ref}}\longrightarrow\mathrm A_m\mathrm B_n,\qquad\Delta E_f=E(\mathrm A_m\mathrm B_n)-m\mu_A^{\mathrm{ref}}-n\mu_B^{\mathrm{ref}}`,
          },
          {
            title: "Place different formulas on the same axes",
            explanation:
              "Different phases contain different atom counts. B atomic fraction and per-atom energy provide a common basis for comparison.",
            formula: String.raw`x_B=\frac{n}{m+n},\qquad e_f=\frac{\Delta E_f}{m+n}`,
          },
          {
            title: "Find the composition and energy of a mixture",
            explanation: String.raw`For phases at $x_1<x<x_2$, let $\lambda$ be the fraction of atoms assigned to the second phase. Solve composition conservation, then use the same weights for energy.`,
            formula: String.raw`x=(1-\lambda)x_1+\lambda x_2\quad\Longrightarrow\quad\lambda=\frac{x-x_1}{x_2-x_1},\qquad e_{\mathrm{mix}}=(1-\lambda)e_1+\lambda e_2`,
          },
          {
            title: "Compare every competing combination",
            explanation:
              "Minimize over mixtures satisfying the composition constraint to find the competing boundary. A candidate below this boundary changes the hull when it is included.",
            formula: String.raw`e_{\mathrm{comp}}(x)=\min\sum_j\lambda_je_j,\qquad\Delta e=e_{\mathrm{candidate}}-e_{\mathrm{comp}}(x),\qquad E_{\mathrm{hull}}=\max(0,\Delta e)`,
            note: "The final expression compares one candidate with a specified competitor set. A candidate below the old boundary lies on the new hull; a negative competitor energy difference is not a negative energy above hull.",
          },
          {
            title: "Connect energy differences to uncertainty propagation",
            explanation:
              "Formation energies and fixed-composition mixture energies are linear combinations of total energies. Covariances show whether shared errors cancel.",
            formula: String.raw`E_f=\sum_i a_iE_i,\qquad\operatorname{Var}(E_f)=\sum_i a_i^2\operatorname{Var}(E_i)+2\sum_{i<j}a_ia_j\operatorname{Cov}(E_i,E_j)`,
            note: "This concerns random uncertainty in a specified linear combination. Unknown model bias and missing competing phases need separate assessment.",
          },
        ],
      },
      example: {
        title: "Why can negative-formation-energy A₃B still decompose?",
        problem: String.raw`In an illustrative binary system, A, AB, and B have formation energies of $0$, $-0.30$, and $0\,\mathrm{eV/atom}$. A candidate $\mathrm A_3\mathrm B$ has $-0.10\,\mathrm{eV/atom}$. Considering only these phases, determine whether it lies on the zero-temperature static-energy hull.`,
        solution: [
          String.raw`The candidate has $x_B=1/(3+1)=0.25$. A is at 0 and AB at 0.5.`,
          String.raw`In an A–AB mixture, the fraction of atoms assigned to AB is $\lambda=(0.25-0)/(0.5-0)=0.5$. The other half of the atoms belongs to the A phase.`,
          String.raw`The competing mixture has $e_{\mathrm{mix}}=0.5\times0+0.5\times(-0.30)=-0.15\,\mathrm{eV/atom}$.`,
          String.raw`The candidate is higher by $-0.10-(-0.15)=0.05\,\mathrm{eV/atom}$. The reaction $\mathrm A_3\mathrm B\rightarrow2\mathrm A+\mathrm{AB}$ lowers energy by $0.20\,\mathrm{eV}$ per four-atom formula unit.`,
        ],
        result:
          "The candidate is favored over pure elements but not over A plus AB. These illustrative static energies neither predict decomposition time nor represent a real materials database.",
      },
      misconceptions: [
        {
          myth: "Negative formation energy proves a phase is stable.",
          correction:
            "It only favors formation relative to the chosen elemental references. Competing phases, temperature, pressure, and model error must also be considered.",
        },
        {
          myth: "Fe has zero formation energy, so its atoms do not bind.",
          correction:
            "The zero follows from selecting that elemental phase as the reference. Cohesive energy uses separated atoms and measures a different energy difference.",
        },
        {
          myth: "A larger energy above hull guarantees faster decomposition.",
          correction:
            "The hull concerns thermodynamic driving force. Rates also depend on barriers, diffusion, interfaces, and nucleation. Kinetic persistence differs from equilibrium stability.",
        },
      ],
      questions: [
        {
          question: String.raw`If the candidate $\mathrm A_3\mathrm B$ drops to $-0.20\,\mathrm{eV/atom}$, is it still above this hull?`,
          answer: String.raw`It is below the old competing mixture at $-0.15\,\mathrm{eV/atom}$. Including it creates a new hull through the candidate, so its energy above hull is zero. Its difference from the old competitor boundary is $-0.05\,\mathrm{eV/atom}$. Other missing phases must still be checked.`,
        },
        {
          question:
            "Why does the neutral-vacancy expression add the atomic chemical potential?",
          answer:
            "The defective cell has one fewer atom, and the removed atom enters a reservoir. The reaction energy is the defective-cell energy plus the reservoir contribution, minus the perfect-cell energy.",
        },
        {
          question:
            "What should be checked before comparing formation energies from two papers?",
          answer:
            "First match composition, per-atom or per-formula-unit normalization, reference phases, magnetism, temperature, and pressure. Then compare functionals, pseudopotentials, corrections, and convergence. Different references or normalizations cannot be compared directly.",
        },
      ],
      connections: [
        {
          method: "dft",
          reason:
            "Calculate structures, elemental references, and defect-cell energies while assessing convergence and reliable energy differences.",
        },
        {
          method: "kmc",
          reason:
            "Use stable-state and defect energetics in event models while distinguishing formation energy from migration barriers and rates.",
        },
        {
          method: "phase-field",
          reason:
            "Combine thermodynamic free energies with interfaces and kinetics to describe phase separation and microstructure evolution.",
        },
      ],
      references: [
        {
          label: "Materials Project · Phase Diagrams",
          url: "https://docs.materialsproject.org/methodology/materials-methodology/thermodynamic-stability/phase-diagrams-pds",
          detail:
            "Practical definitions of formation energy, competing phases, and energy above hull.",
        },
        {
          label:
            "Freysoldt et al. (2014) · First-principles calculations for point defects in solids",
          url: "https://doi.org/10.1103/RevModPhys.86.253",
          detail:
            "A review of defect formation energies, chemical potentials, charged defects, and finite-size corrections.",
        },
        {
          label: "OpenStax · Chemistry 2e, 16.4 Free Energy",
          url: "https://openstax.org/books/chemistry-2e/pages/16-4-free-energy",
          detail:
            "Thermodynamic background on free energy, temperature, and equilibrium.",
        },
      ],
    },
  },
} satisfies Partial<Record<FoundationId, Record<Locale, FoundationLesson>>>;
