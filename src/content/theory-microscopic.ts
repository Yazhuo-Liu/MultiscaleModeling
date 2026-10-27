import type { TheorySet } from "./theory";

/** Additional theory accompanies, rather than replaces, the declared teaching models. */
export const microscopicTheory: TheorySet = {
  dft: {
    zh: {
      objectives: [
        "分清电子密度、电子轨道和原子轨迹，并理解基态问题为何是能量最小化。",
        "沿着“密度—有效势—轨道—新密度”解释一次自洽迭代。",
        "用一个可手算的变分例子，识别试探函数与交换关联近似带来的误差。",
      ],
      sections: [
        {
          title: "先固定原子核：我们究竟在求什么？",
          paragraphs: [
            "电子比原子核轻得多。在 Born–Oppenheimer 近似中，先把原子核位置 R 视为给定参数，再求这一结构下电子的基态能量。换一组核位置，就得到势能面上的另一个点；比较这些点能判断结构稳定性。只有进一步让原子核运动，才涉及分子动力学的真实时间。",
            "多电子波函数依赖所有电子坐标，而电子密度 n(r) 只依赖一个空间坐标，并满足积分为电子总数 N。Hohenberg–Kohn 定理说明，在适用条件下，基态密度足以确定外势及基态性质。但“密度足够”不等于“精确泛函已经知道”，实际计算仍需要近似。电子密度不是单个电子沿某条轨道留下的轨迹。",
          ],
          formula: "∫ n(r) d³r = N；E₀ = minₙ E[n]，约束 ∫n d³r = N",
          symbols: [
            {
              symbol: "n(r)",
              meaning: "电子数密度；在三维空间中单位是长度⁻³。",
            },
            { symbol: "N", meaning: "体系总电子数，是变分时必须保持的约束。" },
            { symbol: "R", meaning: "原子核坐标集合；求电子基态时暂时固定。" },
          ],
        },
        {
          title: "为什么要引入 Kohn–Sham 轨道？",
          paragraphs: [
            "直接把所有能量写成已知的密度表达式很困难，尤其是动能。Kohn–Sham 方法构造一个辅助的非相互作用电子系统，用轨道 φᵢ 计算其动能，同时要求它产生与真实系统相同的密度。经典电子排斥进入 Hartree 项，其余差别合并到交换关联能 E_xc。辅助轨道是计算工具，不能把所有轨道本征值都直接当作可测激发能。",
            "对轨道能量泛函做带正交约束的变分，会得到一组单电子形式的方程。问题仍是非线性的：有效势依赖密度，密度又由这些方程的解给出。LDA 用局部密度构造交换关联近似，GGA 还使用密度梯度；它们不是随意增加一个修正系数，而是改变能量泛函的物理近似。",
          ],
          formula:
            "[−½∇² + v_ext(r) + v_H[n](r) + v_xc[n](r)]φᵢ = εᵢφᵢ\nn(r) = Σᵢ fᵢ |φᵢ(r)|²",
          symbols: [
            {
              symbol: "φᵢ、fᵢ",
              meaning: "辅助轨道及其占据数；上式使用原子单位制。",
            },
            {
              symbol: "v_H、v_xc",
              meaning: "Hartree 势与交换关联势；后者是 E_xc 对密度的泛函导数。",
            },
            {
              symbol: "εᵢ",
              meaning: "保证轨道正交归一的本征值；通常不是完整激发谱。",
            },
          ],
        },
        {
          title: "自洽收敛与物理精度是两件事",
          paragraphs: [
            "从初始密度出发，构造有效势、求轨道、重新累加密度，然后检查输入和输出是否一致。直接替换密度有时会来回振荡，因此常把旧密度与新密度混合。自洽达到固定点，表示当前离散和近似下的方程求解完成；迭代次数并不是飞秒，也不是电子真的沿着图中的箭头运动。",
            "还需要独立检验基组大小、平面波截断、k 点和结构优化阈值。更严格的自洽容差无法补偿错误的泛函或不足的基组。本章高斯模型只保留一个可调宽度，以展示能量竞争与变分思想；它不实现 Kohn–Sham 自洽循环。波函数变分给出的能量上界，也不能不加条件地推广成“所有近似 DFT 能量都是真实能量的上界”。",
          ],
          formula: "n_next = (1−β)n_in + βn_out，0 < β ≤ 1",
          symbols: [
            {
              symbol: "β",
              meaning:
                "密度混合权重；较小权重可能缓和振荡，但通常需要更多迭代。",
            },
            {
              symbol: "n_out − n_in",
              meaning: "自洽残差，衡量当前密度是否为所选方程的固定点。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一个高斯函数能把氢原子描述到多好？",
        given:
          "取核电荷 Z=1，试探轨道 φ(r)=(2α/π)³⁄⁴exp(−αr²)，使用原子单位。它的归一化密度是 n(r)=|φ(r)|²。",
        steps: [
          "动能与核吸引能的期望值合起来为 E(α)=3α/2−2√(2α/π)。α 增大使密度更集中，但动能上升。",
          "令 dE/dα=3/2−√(2/π)/√α=0，得到 α*=8/(9π)≈0.28294 a₀⁻²。",
          "代回能量得 E*=−4/(3π)≈−0.42441 Ha；真实氢原子基态能量为 −0.5 Ha。",
          "高斯结果比精确值高约 0.07559 Ha。剩余误差来自仅允许单个高斯函数的形状限制，而不是优化尚未收敛。",
        ],
        result:
          "最小化做得再准确，也不能突破试探函数本身的表达能力。核电荷为 Z 时，最优 α 随 Z² 缩放，能量也随 Z² 缩放。",
      },
      pitfalls: [
        "把径向概率 4πr²n(r) 与密度 n(r) 混淆：前者还包含球壳体积因子，峰值位置通常不同。",
        "把自洽迭代当成真实时间演化，或把一个收敛解直接当成已验证的材料预测。",
        "认为 DFT 是完全“无近似”的方法；交换关联、基组、赝势和取样都可能引入误差。",
      ],
      question: {
        prompt:
          "两个计算都已自洽收敛，但给出了不同的结合能。是否说明其中一个程序一定有错？",
        answer:
          "不一定。先比较交换关联泛函、赝势、基组或截断、k 点、原子构型和能量参考。自洽收敛只保证各自近似问题内部一致，不保证两个近似问题相同。",
      },
      diagram: {
        title: "Kohn–Sham 自洽循环：密度既是输入，也是输出",
        caption:
          "箭头表示求解步骤而非时间轨迹。重复更新直到密度变化足够小，再进行独立的基组与取样收敛检查。",
        labels: [
          "初始密度 n_in",
          "构造有效势 v_eff",
          "求解轨道 φᵢ",
          "得到新密度 n_out",
          "混合与收敛检查",
        ],
      },
    },
    en: {
      objectives: [
        "Distinguish electron density, orbitals, and atomic trajectories, and explain why a ground-state problem is an energy minimization.",
        "Trace one self-consistent cycle from density to effective potential, orbitals, and updated density.",
        "Use a hand-calculable variational example to separate limitations of a trial function from other electronic-structure approximations.",
      ],
      sections: [
        {
          title: "Fix the nuclei first: what problem are we solving?",
          paragraphs: [
            "Electrons are much lighter than nuclei. In the Born–Oppenheimer approximation, nuclear positions R are first treated as given parameters, and the electronic ground-state energy is found for that structure. Changing R gives another point on a potential-energy surface; comparing these points helps identify stable structures. Physical time enters only when an additional dynamical problem, such as nuclear motion, is considered.",
            "A many-electron wavefunction depends on every electron coordinate, whereas the density n(r) depends on one spatial coordinate and integrates to the electron number N. Under its applicable assumptions, the Hohenberg–Kohn theorem connects ground-state density to the external potential and ground-state properties. It does not supply a known, exact, computationally convenient functional. Density is also not a track left by one electron moving along an orbit.",
          ],
          formula: "∫ n(r) d³r = N; E₀ = minₙ E[n], subject to ∫n d³r = N",
          symbols: [
            {
              symbol: "n(r)",
              meaning:
                "Electron number density; in three dimensions its unit is length⁻³.",
            },
            {
              symbol: "N",
              meaning:
                "Total electron number, held fixed during the minimization.",
            },
            {
              symbol: "R",
              meaning:
                "The collection of nuclear positions, fixed during an electronic ground-state calculation.",
            },
          ],
        },
        {
          title: "Why introduce Kohn–Sham orbitals?",
          paragraphs: [
            "Expressing every energy contribution as a known density formula is difficult, particularly the kinetic energy. Kohn–Sham theory introduces an auxiliary noninteracting system whose orbitals φᵢ provide a practical kinetic-energy expression while reproducing the interacting system’s density. Classical electron repulsion enters the Hartree term; the remaining differences enter the exchange-correlation energy E_xc. These auxiliary orbitals are a useful construction, not a license to interpret all orbital eigenvalues as measured excitation energies.",
            "Varying the orbital energy functional under orthonormality constraints produces equations with a single-electron form. They remain nonlinear because the effective potential depends on density and density depends on their solutions. LDA builds an exchange-correlation approximation from local density; GGA also uses its gradient. Choosing between them changes the physical approximation, rather than merely changing a numerical solver setting.",
          ],
          formula:
            "[−½∇² + v_ext(r) + v_H[n](r) + v_xc[n](r)]φᵢ = εᵢφᵢ\nn(r) = Σᵢ fᵢ |φᵢ(r)|²",
          symbols: [
            {
              symbol: "φᵢ, fᵢ",
              meaning:
                "Auxiliary orbitals and their occupation numbers; these equations use atomic units.",
            },
            {
              symbol: "v_H, v_xc",
              meaning:
                "Hartree and exchange-correlation potentials; v_xc is the functional derivative of E_xc.",
            },
            {
              symbol: "εᵢ",
              meaning:
                "Eigenvalues associated with orbital orthonormality; they are generally not a complete excitation spectrum.",
            },
          ],
        },
        {
          title: "Self-consistency and physical accuracy are different checks",
          paragraphs: [
            "Start with a density, construct the effective potential, solve for orbitals, and sum their occupations to obtain a new density. Test whether input and output agree. Replacing the old density outright can cause oscillation, so mixing old and new densities is common. A converged fixed point solves the chosen discretized, approximate equations. Iterations are not femtoseconds, and the arrows in a self-consistency diagram are not electron trajectories.",
            "Basis size, plane-wave cutoff, k-point sampling, and structural optimization tolerances require separate convergence studies. A tighter self-consistency tolerance cannot repair an unsuitable functional or inadequate basis. This chapter’s single-width Gaussian model isolates the competition of energy terms; it does not implement Kohn–Sham self-consistency. The upper-bound property of a wavefunction variational calculation should not be generalized to a claim that every approximate DFT energy bounds the exact energy from above.",
          ],
          formula: "n_next = (1−β)n_in + βn_out, 0 < β ≤ 1",
          symbols: [
            {
              symbol: "β",
              meaning:
                "Density-mixing weight; a smaller value may reduce oscillation while requiring more iterations.",
            },
            {
              symbol: "n_out − n_in",
              meaning:
                "Self-consistency residual, measuring whether the current density is a fixed point of the selected equations.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How well can one Gaussian describe hydrogen?",
        given:
          "Use nuclear charge Z=1 and the trial orbital φ(r)=(2α/π)³⁄⁴exp(−αr²) in atomic units. Its normalized density is n(r)=|φ(r)|².",
        steps: [
          "The kinetic and nuclear-attraction expectations give E(α)=3α/2−2√(2α/π). Increasing α concentrates the density but raises kinetic energy.",
          "Set dE/dα=3/2−√(2/π)/√α=0 to obtain α*=8/(9π)≈0.28294 a₀⁻².",
          "Substitution gives E*=−4/(3π)≈−0.42441 Ha, compared with the exact hydrogen ground-state energy of −0.5 Ha.",
          "The Gaussian energy lies about 0.07559 Ha above the exact result. The remaining error reflects the restricted shape of a single Gaussian, not unfinished minimization.",
        ],
        result:
          "An accurate optimizer cannot overcome the expressive limits of its trial functions. For nuclear charge Z, both the optimal α and the energy scale with Z².",
      },
      pitfalls: [
        "Confusing radial probability 4πr²n(r) with density n(r): the former includes the spherical-shell volume factor and generally peaks at a different radius.",
        "Treating self-consistent iterations as physical time, or treating convergence alone as validation of a materials prediction.",
        "Calling DFT completely approximation-free: the functional, basis, pseudopotential, and sampling can all affect the result.",
      ],
      question: {
        prompt:
          "Two calculations are self-consistent but predict different binding energies. Must one program be wrong?",
        answer:
          "No. Compare the functional, pseudopotentials, basis or cutoff, k-point sampling, geometry, and energy references first. Self-consistency establishes internal agreement within each approximate problem, not equivalence between the two problems.",
      },
      diagram: {
        title: "The Kohn–Sham cycle: density is both input and output",
        caption:
          "Arrows represent solution steps, not physical trajectories. Repeat until density changes are small, then check basis and sampling convergence independently.",
        labels: [
          "Input density n_in",
          "Effective potential v_eff",
          "Solve orbitals φᵢ",
          "New density n_out",
          "Mix and check convergence",
        ],
      },
    },
  },
  hf: {
    zh: {
      objectives: [
        "理解单个 Slater 行列式如何体现电子不可区分性与反对称性。",
        "区分经典库仑排斥、交换效应与 Hartree–Fock 遗漏的电子相关。",
        "用两位点模型解释轨道、占据数与平均场之间的自洽关系。",
      ],
      sections: [
        {
          title: "从独立轨道走向反对称波函数",
          paragraphs: [
            "最简单的想法是让每个电子占据一个单电子轨道，再把这些轨道相乘。但电子是不可区分的费米子：交换两个电子的全部坐标（含自旋）时，多电子波函数必须变号。普通乘积不能自动满足这一要求，而由正交归一自旋轨道构成的 Slater 行列式可以；如果两个电子占据同一自旋轨道，行列式会变成零。",
            "Hartree–Fock 在所有单行列式波函数中寻找能量最小者，因此它是对波函数形式的受限变分。对闭壳层体系，受限 Hartree–Fock 让每个空间轨道容纳自旋相反的两个电子。它不是说电子没有相互作用，而是把其他电子的影响归入由占据轨道共同决定的平均场。",
          ],
          formula: "Ψ(1,…,N) = det[χᵢ(j)] / √N!",
          symbols: [
            { symbol: "χᵢ", meaning: "自旋轨道，同时包含空间部分与自旋部分。" },
            { symbol: "j", meaning: "第 j 个电子的空间与自旋坐标。" },
            {
              symbol: "det",
              meaning: "行列式；交换两列使其变号，体现费米反对称性。",
            },
          ],
        },
        {
          title: "直接项与交换项：两种不同来源",
          paragraphs: [
            "对行列式求电子相互作用能，会同时出现直接库仑项 J 和交换项 K。直接项类似两团电荷密度之间的经典排斥；交换项来自反对称波函数中不同乘积项的干涉，并不是新增的一种经典作用力。对于自旋正交的轨道，自旋积分使相应交换项为零。",
            "同自旋电子的交换孔已在 Hartree–Fock 中体现，但电子仍可以通过更精细的相互避让进一步降低能量，这部分不在单行列式平均场之内。在同一非相对论哈密顿量下，通常把完整基组极限中的精确能量与 HF 能量之差称为相关能；有限基组下也可以比较二者在同一基组中的差值。尤其在断键、近简并或强关联问题中，单个行列式可能不再是好的起点。",
          ],
          formula: "Fχᵢ = εᵢχᵢ；F = h + Σⱼ(Jⱼ − Kⱼ)",
          symbols: [
            { symbol: "h", meaning: "单电子动能与电子—原子核吸引算符。" },
            {
              symbol: "Jⱼ",
              meaning: "第 j 个占据自旋轨道产生的直接库仑算符。",
            },
            { symbol: "Kⱼ", meaning: "交换算符；其作用依赖参与交换的轨道。" },
          ],
        },
        {
          title: "为什么平均场仍需要反复求解？",
          paragraphs: [
            "Fock 算符包含所有占据轨道，所以求轨道的方程又依赖它自身的解。实际流程是猜测轨道或密度矩阵，构造 Fock 矩阵，对角化，按电子数填充轨道，再重新构造平均场。混合或更高效的加速方法帮助迭代稳定下来；应同时检查密度残差、能量和所求解的电子态。",
            "本章实验用两个位点、两个相反自旋电子与一个占据空间轨道建立受限 Hubbard 平均场。参数 t 鼓励电子在位点间离域，Δ 偏向较低能的 A 位点，U 惩罚同一位点的双占据。这个模型能展示自洽与电荷重排，但没有真实原子的基函数积分，也不能用它直接研究完整的分子交换与相关效应。",
          ],
          formula:
            "F = [[−Δ/2 + Un_A/2, −t], [−t, Δ/2 + Un_B/2]]；n_A + n_B = 2",
          symbols: [
            {
              symbol: "t",
              meaning: "位点间跃迁能量；实验取 t=1 作为能量单位。",
            },
            { symbol: "Δ、U", meaning: "两位点能量差与在位相互作用强度。" },
            {
              symbol: "n_A、n_B",
              meaning: "两个位点的总电子占据数，包含两个自旋。",
            },
          ],
        },
      ],
      workedExample: {
        title: "没有相互作用时，两个电子如何分配？",
        given: "取 t=1、Δ=1、U=0。两个相反自旋电子占据同一最低能空间轨道。",
        steps: [
          "Fock 矩阵退化为 [[−0.5,−1],[−1,0.5]]，不再依赖占据数。",
          "其本征值为 ±√(t²+(Δ/2)²)=±√1.25，最低单电子能量约为 −1.11803t。",
          "占据最低轨道后，n_A=1+Δ/√(Δ²+4t²)≈1.44721，n_B≈0.55279；总数仍为 2。",
          "两个电子的总能量为 2×(−1.11803t)=−2.23607t。低能 A 位点更富电子，但有限的 t 使轨道仍然离域。",
        ],
        result:
          "平均占据数可以不是整数，它描述轨道在两个位点上的概率权重；这不意味着电子总数可以不守恒。",
      },
      pitfalls: [
        "把“平均场”理解为忽略所有电子相互作用：HF 包含直接库仑与单行列式交换。",
        "把交换等同于所有电子相关，或误以为相反自旋电子之间也有同样的交换积分。",
        "把分数位点占据误读成分数个电子实体，或把自洽迭代误读成电荷移动所用的真实时间。",
      ],
      question: {
        prompt:
          "若两位点完全等价（Δ=0），受限对称解的占据数应是什么？为什么 U 增大时不能单靠这一结果判断模型精度？",
        answer:
          "对称解满足 n_A=n_B=1。相同的平均占据数可能对应很不同的双占据概率与电子关联；大 U 下真实电子更倾向避免双占据，而受限单轨道平均场无法充分表达这种相关。",
      },
      diagram: {
        title: "直接与交换：同一相互作用的不同量子贡献",
        caption:
          "直接项联系两团电子密度；交换项来自同自旋波函数的反对称性。示意线不是电子的真实运动轨迹。",
        labels: [
          "轨道 i",
          "轨道 j",
          "直接库仑 J",
          "同自旋交换 K",
          "反对称组合",
        ],
      },
    },
    en: {
      objectives: [
        "Explain how a single Slater determinant represents indistinguishability and antisymmetry.",
        "Separate direct Coulomb repulsion, exchange, and the electron correlation omitted by Hartree–Fock.",
        "Use a two-site model to connect orbitals, occupations, and a self-consistent mean field.",
      ],
      sections: [
        {
          title: "From independent orbitals to an antisymmetric wavefunction",
          paragraphs: [
            "A first guess might place each electron in a single-particle orbital and multiply the orbitals together. Electrons, however, are indistinguishable fermions: exchanging the complete coordinates of two electrons, including spin, must reverse the sign of the many-electron wavefunction. A simple product does not enforce this requirement. A Slater determinant built from orthonormal spin orbitals does, and it vanishes if two electrons occupy the same spin orbital.",
            "Hartree–Fock minimizes energy within the family of single-determinant wavefunctions, making it a restricted variational approximation. For a closed-shell system, restricted Hartree–Fock places two electrons of opposite spin in each occupied spatial orbital. Their interactions are not discarded: the occupied orbitals collectively determine the mean field experienced by each electron.",
          ],
          formula: "Ψ(1,…,N) = det[χᵢ(j)] / √N!",
          symbols: [
            {
              symbol: "χᵢ",
              meaning:
                "A spin orbital, containing both a spatial and a spin part.",
            },
            {
              symbol: "j",
              meaning: "The spatial and spin coordinates of electron j.",
            },
            {
              symbol: "det",
              meaning:
                "A determinant; exchanging two columns reverses its sign and enforces fermionic antisymmetry.",
            },
          ],
        },
        {
          title: "Direct and exchange terms have different origins",
          paragraphs: [
            "Evaluating electron interaction energy with a determinant produces a direct Coulomb term J and an exchange term K. The direct term resembles classical repulsion between two charge distributions. Exchange arises from interference between the terms required to antisymmetrize the wavefunction; it is not an additional classical force. For orthogonal spin functions, the spin integral makes the corresponding exchange term vanish.",
            "Hartree–Fock includes the exchange hole between same-spin electrons, but more detailed coordinated avoidance can lower the energy further. This additional correlation is absent from a single-determinant mean field. For a given nonrelativistic Hamiltonian, correlation energy conventionally compares the exact and HF energies in the complete-basis limit; finite-basis comparisons should use the same basis for both. Bond breaking, near degeneracy, and strong correlation can make one determinant an inadequate starting point.",
          ],
          formula: "Fχᵢ = εᵢχᵢ; F = h + Σⱼ(Jⱼ − Kⱼ)",
          symbols: [
            {
              symbol: "h",
              meaning:
                "The one-electron kinetic-energy and electron–nucleus attraction operator.",
            },
            {
              symbol: "Jⱼ",
              meaning:
                "The direct Coulomb operator associated with occupied spin orbital j.",
            },
            {
              symbol: "Kⱼ",
              meaning:
                "The exchange operator, whose action depends on the orbitals being exchanged.",
            },
          ],
        },
        {
          title: "Why does a mean field need repeated solution?",
          paragraphs: [
            "The Fock operator contains all occupied orbitals, so the equations for the orbitals depend on their own solutions. One guesses orbitals or a density matrix, constructs the Fock matrix, diagonalizes it, fills the orbitals according to electron number, and reconstructs the mean field. Mixing and other acceleration schemes can stabilize this iteration. Density residuals, energy changes, and the identity of the electronic state all deserve checks.",
            "The experiment uses a restricted Hubbard mean field with two sites, two opposite-spin electrons, and one occupied spatial orbital. Hopping t favors delocalization, a site offset Δ favors lower-energy site A, and U penalizes double occupation of a site. This captures self-consistency and charge redistribution, but it contains neither realistic atomic basis integrals nor a complete molecular description of exchange and correlation.",
          ],
          formula:
            "F = [[−Δ/2 + Un_A/2, −t], [−t, Δ/2 + Un_B/2]]; n_A + n_B = 2",
          symbols: [
            {
              symbol: "t",
              meaning:
                "Inter-site hopping energy; the experiment sets t=1 as its energy unit.",
            },
            {
              symbol: "Δ, U",
              meaning:
                "Site-energy difference and on-site interaction strength.",
            },
            {
              symbol: "n_A, n_B",
              meaning:
                "Total electronic occupations of the two sites, including both spins.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Where do two noninteracting electrons go?",
        given:
          "Set t=1, Δ=1, and U=0. Two opposite-spin electrons occupy the same lowest-energy spatial orbital.",
        steps: [
          "The Fock matrix reduces to [[−0.5,−1],[−1,0.5]] and no longer depends on occupations.",
          "Its eigenvalues are ±√(t²+(Δ/2)²)=±√1.25. The lower one-electron energy is approximately −1.11803t.",
          "Filling that orbital gives n_A=1+Δ/√(Δ²+4t²)≈1.44721 and n_B≈0.55279. Their sum remains 2.",
          "The two-electron energy is 2×(−1.11803t)=−2.23607t. Site A carries more density, but finite hopping keeps the orbital delocalized.",
        ],
        result:
          "An average site occupation need not be an integer: it reflects orbital probability weights across sites. Total electron number still remains conserved.",
      },
      pitfalls: [
        "Reading “mean field” as neglecting every electron interaction: HF includes direct Coulomb repulsion and single-determinant exchange.",
        "Equating exchange with all correlation, or assuming opposite-spin orbitals have the same exchange contribution as same-spin orbitals.",
        "Interpreting fractional site populations as fractional electron objects, or interpreting self-consistent iteration count as physical charge-transfer time.",
      ],
      question: {
        prompt:
          "For equivalent sites (Δ=0), what occupations does the symmetric restricted solution have? Why does this alone not establish accuracy at large U?",
        answer:
          "The symmetric solution has n_A=n_B=1. Identical average populations can hide very different double-occupation probabilities and correlations. At large U, real electrons strongly avoid double occupation, a behavior the restricted single-orbital mean field cannot fully represent.",
      },
      diagram: {
        title: "Direct and exchange: distinct quantum contributions",
        caption:
          "The direct term couples charge densities; exchange follows from antisymmetry for same-spin electrons. Connecting lines are not physical electron trajectories.",
        labels: [
          "Orbital i",
          "Orbital j",
          "Direct Coulomb J",
          "Same-spin exchange K",
          "Antisymmetric combination",
        ],
      },
    },
  },
  md: {
    zh: {
      objectives: [
        "从势能曲线的斜率判断原子间的吸引、排斥和平衡间距。",
        "把牛顿方程与 velocity-Verlet 积分联系起来，理解时间步为何影响精度。",
        "分清初始温度、恒温控制与能量守恒，并认识边界条件的作用。",
      ],
      sections: [
        {
          title: "先给出能量，力才有来源",
          paragraphs: [
            "经典分子动力学把原子核近似为遵循牛顿方程的粒子。模型首先需要势能 U(r₁,…,r_N)，再通过对坐标求导得到力。Lennard–Jones 势用很短距离下陡峭的排斥和较长距离下的吸引，构成最经典的入门例子。它能帮助理解稀有气体式相互作用，但不能自动描述金属键、共价键或化学反应。",
            "两体势曲线下降的一侧对应将粒子推开的排斥，曲线上升的一侧对应把粒子拉近的吸引；势阱最低点处力为零。对多粒子系统，每个原子的总力是相关相互作用贡献的总和。势能值可以整体平移而不改变力，因此能量零点的选择与力学平衡的位置是不同问题。",
          ],
          formula:
            "U(r)=4ε[(σ/r)¹²−(σ/r)⁶]\nF_r=−dU/dr=(24ε/r)[2(σ/r)¹²−(σ/r)⁶]",
          symbols: [
            { symbol: "ε", meaning: "势阱深度，设置相互作用能量尺度。" },
            {
              symbol: "σ",
              meaning: "未截断 LJ 势的零点距离，不是势能最低点距离。",
            },
            {
              symbol: "F_r",
              meaning: "径向力分量；这里正值表示使间距增大的排斥。",
            },
          ],
        },
        {
          title: "让连续方程迈出离散的小步",
          paragraphs: [
            "牛顿方程是连续时间微分方程，计算时必须选取时间步 Δt。velocity-Verlet 先用旧力推进半步速度，再更新位置；由新位置重算力后，完成后半步速度。它具有时间可逆和辛结构等优点，适合长期研究保守体系；但这些优点并不意味着任意大的时间步都能保持准确。",
            "时间步需要解析系统中最快的运动。如果一步就跨过陡峭的排斥区域，数值力会剧烈变化，能量可能漂移甚至发散。实用检查是减小 Δt 后比较能量变化和关键统计量，而不是只看动画是否平滑。本章采用约化单位，时间单位为 τ_LJ=σ√(m/ε)；转换成秒需要给定材料相关的 m、σ 和 ε。",
          ],
          formula: "vₙ₊½=vₙ+FₙΔt/(2m)\nrₙ₊₁=rₙ+vₙ₊½Δt\nvₙ₊₁=vₙ₊½+Fₙ₊₁Δt/(2m)",
          symbols: [
            {
              symbol: "rₙ、vₙ",
              meaning: "第 n 步的粒子位置与速度；对每个原子分别更新。",
            },
            { symbol: "Fₙ₊₁", meaning: "必须由更新后的粒子位置重新计算的力。" },
            {
              symbol: "Δt",
              meaning: "数值时间步，本例为 0.002τ_LJ，不是播放速度。",
            },
          ],
        },
        {
          title: "温度不是贴在每个原子上的标签",
          paragraphs: [
            "在经典平衡统计中，温度通过许多自由度的平均动能与体系联系起来。瞬时温度会波动，单个原子的瞬时速度不能代表整个体系温度。初始化速度只规定起点的动能；若之后不使用恒温器，势能与动能会相互交换，温度就不会严格保持为初始输入值。",
            "本章模拟近似微正则 NVE 演化，二维周期边界使出右边界的粒子从左侧重新出现，目的是降低自由表面效应，不是粒子凭空消失。计算相互作用使用最近周期像，并在有限截断距离外忽略作用。有限体系、势函数选择和截断都会影响结果；稳定的积分不能替代势函数的物理验证。",
          ],
          formula:
            "K=Σᵢ ½mᵢ|vᵢ|²；T=2K/(f k_B)\n二维体系移除整体平动后：f=2N−2",
          symbols: [
            { symbol: "K", meaning: "去除整体漂移后粒子的总动能。" },
            { symbol: "f", meaning: "独立的动能自由度数，取决于维度和约束。" },
            {
              symbol: "NVE",
              meaning: "粒子数 N、体积 V 与总能量 E 给定的微正则描述。",
            },
          ],
        },
      ],
      workedExample: {
        title: "σ 是平衡间距吗？沿势阱算一次",
        given: "考虑未截断的 LJ 两体势，使用 ε=1、σ=1 的约化单位。",
        steps: [
          "在 r=σ 时，U=4(1−1)=0，但 F_r=24ε/σ，仍有明显排斥。",
          "令 F_r=0，得到 2(σ/r)¹²=(σ/r)⁶，因此 r_min=2¹⁄⁶σ≈1.12246σ。",
          "此时 (σ/r)⁶=1/2，代入得 U_min=4ε(1/4−1/2)=−ε。",
          "本章力场在 r_c=2.5σ 截断并平移势能：平移改变能量零点，不改变截断范围内的力或 r_min。",
        ],
        result:
          "势能为零不代表力为零；决定力的是斜率。这个区别同样适用于更复杂的原子间势。",
      },
      pitfalls: [
        "把初始温度滑块当成持续作用的恒温器，忽略动能与势能之间的交换。",
        "认为更平滑或更快的播放等于更准确的积分；精度应通过时间步与物理量检查。",
        "把二维 LJ 模型直接当作真实三维金属或聚合物；维度、势函数和约化单位都需要明确。",
      ],
      question: {
        prompt:
          "不加恒温器时，粒子靠近并落入势阱，势能下降。总能量近似守恒意味着动能和温度会怎样变化？",
        answer:
          "减少的势能会转化为动能，因此瞬时动能通常上升，对应的瞬时温度也上升。实际多粒子系统还会同时发生其他相互作用，长期统计需要观察足够长的轨迹。",
      },
      diagram: {
        title: "Lennard–Jones 势阱：斜率决定力的方向",
        caption:
          "r=σ 是能量零点；r=2¹⁄⁶σ 才是两体平衡间距。示意曲线表示未截断势，本章实验还采用有限截断与能量平移。",
        labels: ["短程排斥", "长程吸引", "平衡间距", "势能 U/ε", "间距 r/σ"],
      },
    },
    en: {
      objectives: [
        "Use the slope of a potential-energy curve to identify attraction, repulsion, and equilibrium spacing.",
        "Connect Newton’s equations to velocity-Verlet integration and explain why time step controls accuracy.",
        "Distinguish initial temperature, thermostatting, and energy conservation, and recognize the role of boundary conditions.",
      ],
      sections: [
        {
          title: "Specify an energy before calculating a force",
          paragraphs: [
            "Classical molecular dynamics approximates nuclei as particles obeying Newton’s equations. A model first supplies a potential U(r₁,…,r_N); forces follow from coordinate derivatives. The Lennard–Jones potential combines a steep short-range repulsion with a longer-range attraction, making it a classic introduction to atomic interactions. It is useful for noble-gas-like behavior but does not automatically describe metallic bonding, covalent bonds, or chemical reactions.",
            "On the descending side of the potential curve, the radial force pushes particles apart; on the rising side, it draws them together. At the minimum the force vanishes. In a many-particle system, an atom experiences the sum of relevant interaction forces. Adding a constant to the potential does not change its derivatives, so choosing an energy reference is distinct from locating mechanical equilibrium.",
          ],
          formula:
            "U(r)=4ε[(σ/r)¹²−(σ/r)⁶]\nF_r=−dU/dr=(24ε/r)[2(σ/r)¹²−(σ/r)⁶]",
          symbols: [
            {
              symbol: "ε",
              meaning: "The well depth, setting the interaction energy scale.",
            },
            {
              symbol: "σ",
              meaning:
                "The zero crossing of the untruncated LJ potential, not its minimum-energy separation.",
            },
            {
              symbol: "F_r",
              meaning:
                "The radial force; a positive value here denotes repulsion that increases separation.",
            },
          ],
        },
        {
          title: "Advance a continuous equation in discrete steps",
          paragraphs: [
            "Newton’s equations describe continuous time, but numerical integration selects a time step Δt. Velocity-Verlet first advances velocity by half a step using the old force, then updates positions. Forces are recalculated at those positions before completing the velocity step. Time reversibility and its symplectic structure make this method useful for conservative systems, but neither property makes an arbitrarily large step accurate.",
            "The time step must resolve the fastest motions. Jumping across a steep repulsive region in one step can produce large force errors, energy drift, or instability. A practical check reduces Δt and compares energy behavior and relevant statistics, instead of judging smoothness of the animation. The experiment uses reduced units with τ_LJ=σ√(m/ε); converting to seconds requires material-specific m, σ, and ε.",
          ],
          formula: "vₙ₊½=vₙ+FₙΔt/(2m)\nrₙ₊₁=rₙ+vₙ₊½Δt\nvₙ₊₁=vₙ₊½+Fₙ₊₁Δt/(2m)",
          symbols: [
            {
              symbol: "rₙ, vₙ",
              meaning:
                "Particle position and velocity at step n, updated for each atom.",
            },
            {
              symbol: "Fₙ₊₁",
              meaning:
                "The force that must be recalculated using the updated positions.",
            },
            {
              symbol: "Δt",
              meaning:
                "The numerical time step, 0.002τ_LJ in this example; it is distinct from playback speed.",
            },
          ],
        },
        {
          title: "Temperature is not a label attached to each atom",
          paragraphs: [
            "Classical equilibrium statistics relate temperature to kinetic energy averaged over many degrees of freedom. Instantaneous temperature fluctuates, and one atom’s speed is not the system temperature. Initializing velocities sets the starting kinetic energy only. Without a thermostat, potential and kinetic energy exchange during the motion, so temperature is not constrained to its initial input value.",
            "The experiment approximates microcanonical NVE evolution with two-dimensional periodic boundaries: a particle leaving the right edge reappears on the left. This reduces free-surface effects rather than destroying and recreating particles. Interactions use the nearest periodic image and a finite cutoff. Finite size, the potential model, and truncation all affect results; stable integration cannot substitute for validating the physical potential.",
          ],
          formula:
            "K=Σᵢ ½mᵢ|vᵢ|²; T=2K/(f k_B)\nIn 2D, after removing overall translation: f=2N−2",
          symbols: [
            {
              symbol: "K",
              meaning:
                "Total kinetic energy after removing center-of-mass drift.",
            },
            {
              symbol: "f",
              meaning:
                "Independent kinetic degrees of freedom, determined by dimension and constraints.",
            },
            {
              symbol: "NVE",
              meaning:
                "A microcanonical description with specified particle number N, volume V, and total energy E.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Is σ the equilibrium spacing? Calculate the minimum",
        given:
          "Consider the untruncated two-particle LJ potential in reduced units ε=1 and σ=1.",
        steps: [
          "At r=σ, U=4(1−1)=0, but F_r=24ε/σ: substantial repulsion remains.",
          "Setting F_r=0 gives 2(σ/r)¹²=(σ/r)⁶, hence r_min=2¹⁄⁶σ≈1.12246σ.",
          "Here (σ/r)⁶=1/2, so U_min=4ε(1/4−1/2)=−ε.",
          "The experiment truncates the potential at r_c=2.5σ and shifts its energy. This shift changes the reference energy, not forces inside the cutoff or the value of r_min.",
        ],
        result:
          "Zero potential energy does not mean zero force: force depends on slope. The same distinction applies to more complex interatomic potentials.",
      },
      pitfalls: [
        "Treating an initial-temperature control as a continuously acting thermostat and overlooking exchange between kinetic and potential energy.",
        "Equating smoother or faster playback with more accurate integration; accuracy needs time-step and physical-observable checks.",
        "Treating a two-dimensional LJ example as a realistic three-dimensional metal or polymer without specifying dimensionality, interactions, and units.",
      ],
      question: {
        prompt:
          "Without a thermostat, two particles move closer and descend into an attractive well. If total energy is approximately conserved, what happens to kinetic energy and temperature?",
        answer:
          "Lost potential energy becomes kinetic energy, so instantaneous kinetic energy and its associated temperature generally rise. Other interactions occur simultaneously in a many-particle system, and long-time statistics require a sufficiently long trajectory.",
      },
      diagram: {
        title: "The Lennard–Jones well: slope sets the force direction",
        caption:
          "r=σ is the energy zero crossing; r=2¹⁄⁶σ is the two-particle equilibrium separation. The curve represents an untruncated potential; the experiment additionally uses truncation and an energy shift.",
        labels: [
          "Short-range repulsion",
          "Long-range attraction",
          "Equilibrium separation",
          "Energy U/ε",
          "Separation r/σ",
        ],
      },
    },
  },
  mc: {
    zh: {
      objectives: [
        "理解为什么平衡态需要采样一组微观构型，而不是只找最低能量。",
        "从 Boltzmann 权重得到 Metropolis 接受率，并手算一次 Ising 翻转。",
        "区分平衡采样、统计误差、临界现象与真实时间动力学。",
      ],
      sections: [
        {
          title: "有限温度下，低能量重要，但不是唯一可能",
          paragraphs: [
            "若只做能量最小化，得到的是一个低能构型。有限温度下，热涨落使体系访问许多构型；我们关心的是这些构型按平衡概率加权后的平均值，例如平均能量、磁化强度和热容。正则系综中，构型的相对权重由 Boltzmann 因子控制，温度越高，高能构型受到的惩罚越弱。",
            "直接枚举构型通常不可行：一个 N 个二态自旋的 Ising 模型就有 2ᴺ 种状态。Monte Carlo 构造随机游走，让经常访问的状态与所需概率相匹配。它不是“随便随机”，而是通过精心设计的提议和接受规则，使长时间采样能够代表目标平衡分布。",
          ],
          formula: "P(C)=exp[−E(C)/(k_BT)]/Z\n⟨A⟩=Σ_C P(C)A(C)",
          symbols: [
            {
              symbol: "C",
              meaning: "一个完整的微观构型，例如整个晶格的自旋排布。",
            },
            {
              symbol: "Z",
              meaning: "所有构型 Boltzmann 因子的总和，即配分函数。",
            },
            { symbol: "⟨A⟩", meaning: "物理量 A 在目标平衡分布下的平均值。" },
          ],
        },
        {
          title: "为什么升高能量的移动有时也要接受？",
          paragraphs: [
            "对称提议下，从旧状态到新状态的平衡概率比只取决于能量差 ΔE，未知的配分函数会约掉。Metropolis 规则总是接受降低能量的移动，并以 exp(−ΔE/k_BT) 的概率接受升高能量的移动。后者让体系能够跨过局部能垒，保留有限温度涨落，而不只是贪心地向最低能状态下降。",
            "对于方格 Ising 模型，每个自旋只与四个近邻相互作用。翻转一个自旋时，只有它连接的四条键和外场项改变，因此无需重算所有能量。若提议概率并不对称，接受率还必须包含正反向提议概率之比；简单的 Metropolis 形式不能原样套用。",
          ],
          formula:
            "E=−JΣ_⟨ij⟩sᵢsⱼ−hΣᵢsᵢ\nΔE=2sᵢ(JΣ_nn sⱼ+h)\nP_accept=min[1,exp(−ΔE/k_BT)]",
          symbols: [
            { symbol: "sᵢ=±1", meaning: "晶格位点 i 的二态自旋。" },
            {
              symbol: "J>0、h",
              meaning: "使相邻自旋倾向同向的耦合能，以及外场能量系数。",
            },
            {
              symbol: "Σ_⟨ij⟩",
              meaning: "每对近邻只计一次；Σ_nn 只遍历被翻转自旋的近邻。",
            },
          ],
        },
        {
          title: "看见有序结构之后，还要检查什么？",
          paragraphs: [
            "初始构型通常不在平衡分布中，需要先丢弃一段平衡化过程，再统计观测量。相邻样本往往相关，连续得到一千张几乎相同的构型，并不等于一千个独立样本。可以检查分块平均、不同初态与不同随机种子，以判断统计结果是否稳定；临界点附近的慢涨落尤其容易造成误判。",
            "无限大、零外场的二维正方晶格 Ising 模型有精确临界温度 k_BT_c/J=2/ln(1+√2)≈2.269。本章有限晶格只能呈现被尺寸和采样长度平滑后的转变，不能把某次短动画读作精确临界点。常规 Metropolis 扫描次数也不是秒；若要描述已知事件率驱动的真实时间演化，应转向动力学 Monte Carlo 等方法。",
          ],
          formula: "m=(1/N)Σᵢsᵢ；每次扫描约进行 N 次翻转尝试",
          symbols: [
            {
              symbol: "m",
              meaning: "每个自旋的平均磁化强度，范围为 −1 到 1。",
            },
            {
              symbol: "扫描",
              meaning: "采样工作量单位，通常不具有真实时间单位。",
            },
            {
              symbol: "T_c",
              meaning:
                "这里的精确公式仅适用于无限大、零外场、最近邻二维正方晶格模型。",
            },
          ],
        },
      ],
      workedExample: {
        title: "手算一次自旋翻转的接受概率",
        given:
          "取中心自旋 sᵢ=+1，四个近邻中三个为 +1、一个为 −1，h=0，温度 k_BT=2J。",
        steps: [
          "近邻自旋和为 3×(+1)+(−1)=2。",
          "翻转的能量变化为 ΔE=2×(+1)×J×2=4J，属于升能移动。",
          "接受概率为 exp[−4J/(2J)]=exp(−2)≈0.1353，即约 13.5%。",
          "抽取 [0,1) 上均匀随机数 u：若 u=0.10 则接受，若 u=0.40 则拒绝；被拒绝时构型保持不变，也计入采样过程。",
        ],
        result:
          "相同提议可以有不同结果，但大量尝试的统计必须遵守正确接受率。若四个近邻都为 +1，则 ΔE=8J，在相同温度下接受率降至约 1.83%。",
      },
      pitfalls: [
        "把 Monte Carlo 扫描数直接换算为秒，或把随机采样轨迹当成粒子的真实运动。",
        "只接受降能移动却仍称之为有限温度平衡采样；这会丢失应有的热涨落。",
        "用一次短运行确定临界温度，或忽略平衡化、相关时间和有限尺寸对统计结果的影响。",
      ],
      question: {
        prompt:
          "一个自旋翻转使能量降低 2J。温度降低时，这个翻转在标准 Metropolis 算法中的接受概率会下降吗？",
        answer:
          "不会。在对称提议的 Metropolis 规则中，ΔE<0 的移动总是接受。温度主要改变升能移动的接受概率；低温下更难接受升能移动，但仍需要足够采样以检查是否达到平衡。",
      },
      diagram: {
        title: "一次局部翻转，如何改变四条近邻键？",
        caption:
          "中心自旋翻转后，四条相邻键的同向/反向关系都会改变。能量差决定接受率，随机数决定这一次是否接受。",
        labels: [
          "翻转前",
          "翻转后",
          "中心自旋",
          "近邻相互作用",
          "接受率 min(1,exp(−ΔE/kBT))",
        ],
      },
    },
    en: {
      objectives: [
        "Explain why equilibrium at finite temperature requires sampling configurations rather than finding only the lowest energy.",
        "Connect Boltzmann weights to the Metropolis acceptance rule and calculate one Ising spin-flip probability.",
        "Distinguish equilibrium sampling, statistical uncertainty, critical behavior, and physical-time dynamics.",
      ],
      sections: [
        {
          title:
            "At finite temperature, low energy matters—but is not everything",
          paragraphs: [
            "Energy minimization seeks a low-energy configuration. At finite temperature, thermal fluctuations allow many configurations, and we want averages over their equilibrium probabilities: energy, magnetization, heat capacity, and other observables. In the canonical ensemble, Boltzmann factors set relative weights. Raising temperature weakens the penalty assigned to higher-energy configurations.",
            "Enumerating all configurations is usually impossible: N two-state Ising spins already have 2ᴺ possible states. Monte Carlo constructs a random walk whose visit frequencies represent the required probabilities. This is not arbitrary randomness. Carefully chosen proposals and acceptance rules make a sufficiently sampled trajectory represent a target equilibrium distribution.",
          ],
          formula: "P(C)=exp[−E(C)/(k_BT)]/Z\n⟨A⟩=Σ_C P(C)A(C)",
          symbols: [
            {
              symbol: "C",
              meaning:
                "A complete microscopic configuration, such as the spin arrangement of the entire lattice.",
            },
            {
              symbol: "Z",
              meaning:
                "The partition function: the sum of Boltzmann factors over all configurations.",
            },
            {
              symbol: "⟨A⟩",
              meaning:
                "The equilibrium expectation of observable A under the target distribution.",
            },
          ],
        },
        {
          title: "Why sometimes accept a move that raises energy?",
          paragraphs: [
            "For symmetric proposals, the ratio of equilibrium probabilities for new and old states depends only on ΔE: the unknown partition function cancels. Metropolis always accepts a decrease in energy and accepts an increase with probability exp(−ΔE/k_BT). Uphill moves allow thermal fluctuations and escape from local barriers, instead of merely performing a greedy search for an energy minimum.",
            "Each spin in a square Ising lattice interacts with four nearest neighbors. Flipping one spin changes only its four incident bonds and its field contribution, so a complete energy recalculation is unnecessary. If forward and reverse proposal probabilities differ, the acceptance rule must include their ratio. The simple Metropolis expression is not valid unchanged for arbitrary asymmetric proposals.",
          ],
          formula:
            "E=−JΣ_⟨ij⟩sᵢsⱼ−hΣᵢsᵢ\nΔE=2sᵢ(JΣ_nn sⱼ+h)\nP_accept=min[1,exp(−ΔE/k_BT)]",
          symbols: [
            {
              symbol: "sᵢ=±1",
              meaning: "The two-state spin at lattice site i.",
            },
            {
              symbol: "J>0, h",
              meaning:
                "The coupling energy favoring aligned neighbors and the external-field energy coefficient.",
            },
            {
              symbol: "Σ_⟨ij⟩",
              meaning:
                "Count each neighboring pair once; Σ_nn includes only the neighbors of the selected spin.",
            },
          ],
        },
        {
          title: "What should you check after seeing ordered domains?",
          paragraphs: [
            "The initial configuration generally does not represent equilibrium. Discard an equilibration interval before measuring observables. Successive samples are often correlated: a thousand almost identical snapshots are not a thousand independent measurements. Block averages, different initial states, and different random seeds help assess stability. Slow fluctuations near a critical point make premature conclusions especially easy.",
            "For the infinite, zero-field, nearest-neighbor square-lattice Ising model, the exact critical temperature is k_BT_c/J=2/ln(1+√2)≈2.269. A finite lattice shows a rounded transition shaped by size and sampling length, so a short animation cannot identify an exact critical point. Ordinary Metropolis sweeps are not seconds. Physical-time evolution based on known event rates instead calls for methods such as kinetic Monte Carlo.",
          ],
          formula:
            "m=(1/N)Σᵢsᵢ; one sweep consists of approximately N attempted flips",
          symbols: [
            {
              symbol: "m",
              meaning: "Magnetization per spin, ranging from −1 to 1.",
            },
            {
              symbol: "Sweep",
              meaning:
                "A unit of sampling effort, generally without a physical-time unit.",
            },
            {
              symbol: "T_c",
              meaning:
                "The quoted exact formula applies only to the infinite, zero-field, nearest-neighbor square-lattice model.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Calculate one spin-flip acceptance probability",
        given:
          "Let the central spin be +1, with three +1 neighbors and one −1 neighbor. Set h=0 and k_BT=2J.",
        steps: [
          "The neighboring spins sum to 3×(+1)+(−1)=2.",
          "The flip changes energy by ΔE=2×(+1)×J×2=4J, so this is an uphill move.",
          "Its acceptance probability is exp[−4J/(2J)]=exp(−2)≈0.1353, or about 13.5%.",
          "Draw u uniformly from [0,1): accept if u=0.10, reject if u=0.40. A rejected proposal leaves the configuration unchanged but is still part of the sampling process.",
        ],
        result:
          "Identical proposals can have different individual outcomes, but their statistics must follow the correct acceptance rate. With four +1 neighbors, ΔE becomes 8J and the acceptance probability at the same temperature drops to about 1.83%.",
      },
      pitfalls: [
        "Converting ordinary Monte Carlo sweep counts directly into seconds or treating a sampling path as a physical particle trajectory.",
        "Accepting only energy-lowering moves while claiming finite-temperature equilibrium sampling, thereby removing necessary thermal fluctuations.",
        "Inferring a critical temperature from one short run while ignoring equilibration, correlation times, and finite-size effects.",
      ],
      question: {
        prompt:
          "A proposed spin flip lowers energy by 2J. Does cooling reduce its acceptance probability in standard Metropolis sampling?",
        answer:
          "No. With symmetric proposals, Metropolis always accepts moves with ΔE<0. Temperature changes the acceptance of uphill moves. Cooling makes those moves less likely, but adequate sampling is still needed to establish equilibrium.",
      },
      diagram: {
        title: "How does one local flip change four neighboring bonds?",
        caption:
          "Flipping the central spin reverses alignment on all four neighboring bonds. The energy difference sets the acceptance probability; a random draw determines the outcome of this attempt.",
        labels: [
          "Before the flip",
          "After the flip",
          "Central spin",
          "Neighbor interactions",
          "Accept: min(1,exp(−ΔE/kBT))",
        ],
      },
    },
  },
};
