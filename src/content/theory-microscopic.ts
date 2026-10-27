import type { TheorySet } from "./theory";

/** Explicit Markdown/LaTeX; formulas and glossary symbols contain delimiter-free TeX. */
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
            "电子比原子核轻得多。在 Born–Oppenheimer 近似中，先把原子核位置 $\\mathbf R$ 视为给定参数，再求电子基态能量 $E_{\\mathrm{elec}}(\\mathbf R)$。比较不同核构型的稳定性时，还必须加上核—核排斥能 $E_{\\mathrm{II}}(\\mathbf R)$：总势能面是 $E_{\\mathrm{BO}}=E_{\\mathrm{elec}}+E_{\\mathrm{II}}$。核排斥在固定构型的电子变分中只是常数，但随构型变化，不能在比较结构时遗漏。只有进一步让原子核运动，才涉及真实动力学时间。",
            "多电子波函数依赖所有电子坐标，而电子密度 $n(\\mathbf r)$ 只依赖一个空间坐标，并满足积分为电子总数 $N$。Hohenberg–Kohn 定理说明，在适用条件下，基态密度足以确定外势及基态性质。但“密度足够”不等于“精确泛函已经知道”，实际计算仍需要近似。电子密度不是单个电子沿某条轨道留下的轨迹。",
          ],
          formula:
            "\\begin{aligned}\\int n(\\mathbf r)\\,d^3r&=N,\\qquad E_{\\mathrm{elec},0}=\\min_{n\\to N}E[n]\\\\E_{\\mathrm{BO}}(\\mathbf R)&=E_{\\mathrm{elec},0}(\\mathbf R)+E_{\\mathrm{II}}(\\mathbf R)\\end{aligned}",
          symbols: [
            {
              symbol: "n(\\mathbf r)",
              meaning:
                "电子数密度；在三维空间中单位是$\\mathrm{length}^{-3}$。",
            },
            {
              symbol: "N",
              meaning: "体系总电子数，是变分时必须保持的约束。",
            },
            {
              symbol: "\\mathbf R",
              meaning: "原子核坐标集合；求电子基态时暂时固定。",
            },
          ],
        },
        {
          title: "为什么要引入 Kohn–Sham 轨道？",
          paragraphs: [
            "直接把所有能量写成已知的密度表达式很困难，尤其是动能。Kohn–Sham 方法构造一个辅助的非相互作用电子系统，用轨道 $\\phi_i$ 计算其动能，同时要求它产生与真实系统相同的密度。经典电子排斥进入 Hartree 项，其余差别合并到交换关联能 $E_{\\mathrm{xc}}$。辅助轨道是计算工具，不能把所有轨道本征值都直接当作可测激发能。",
            "对轨道能量泛函做带正交约束的变分，会得到一组单电子形式的方程。问题仍是非线性的：有效势依赖密度，密度又由这些方程的解给出。LDA 用局部密度构造交换关联近似，GGA 还使用密度梯度；它们不是随意增加一个修正系数，而是改变能量泛函的物理近似。",
          ],
          formula:
            "\\begin{aligned}\\left[-\\frac12\\nabla^2+v_{\\mathrm{ext}}(\\mathbf r)+v_H[n](\\mathbf r)+v_{\\mathrm{xc}}[n](\\mathbf r)\\right]\\phi_i&=\\varepsilon_i\\phi_i\\\\n(\\mathbf r)&=\\sum_i f_i|\\phi_i(\\mathbf r)|^2\\end{aligned}",
          symbols: [
            {
              symbol: "\\phi_i,\\ f_i",
              meaning: "辅助轨道及其占据数；上式使用原子单位制。",
            },
            {
              symbol: "v_H,\\ v_{\\mathrm{xc}}",
              meaning:
                "Hartree 势与交换关联势；后者是 $E_{\\mathrm{xc}}$ 对密度的泛函导数。",
            },
            {
              symbol: "\\varepsilon_i",
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
          formula:
            "n_{\\mathrm{next}}=(1-\\beta)n_{\\mathrm{in}}+\\beta n_{\\mathrm{out}},\\qquad0<\\beta\\le1",
          symbols: [
            {
              symbol: "\\beta",
              meaning:
                "密度混合权重；较小权重可能缓和振荡，但通常需要更多迭代。",
            },
            {
              symbol: "n_{\\mathrm{out}}-n_{\\mathrm{in}}",
              meaning: "自洽残差，衡量当前密度是否为所选方程的固定点。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一个高斯函数能把氢原子描述到多好？",
        given:
          "取核电荷 $Z=1$，试探轨道 $\\phi(r)=(2\\alpha/\\pi)^{3/4}\\exp(-\\alpha r^2)$，使用原子单位。它的归一化密度是 $n(r)=|\\phi(r)|^2$。",
        steps: [
          "动能与核吸引能的期望值合起来为 $E(\\alpha)=\\frac{3\\alpha}{2}-2\\sqrt{\\frac{2\\alpha}{\\pi}}$。$\\alpha$ 增大使密度更集中，但动能上升。",
          "令 $\\frac{dE}{d\\alpha}=\\frac32-\\sqrt{\\frac2\\pi}\\frac1{\\sqrt\\alpha}=0$，得到 $\\alpha_*=\\frac8{9\\pi}\\approx0.28294\\,a_0^{-2}$。",
          "代回能量得 $E_*=-\\frac4{3\\pi}\\approx-0.42441\\,\\mathrm{Ha}$；真实氢原子基态能量为 $-0.5\\,\\mathrm{Ha}$。",
          "高斯结果比精确值高约 $0.07559\\,\\mathrm{Ha}$。剩余误差来自仅允许单个高斯函数的形状限制，而不是优化尚未收敛。",
        ],
        result:
          "最小化做得再准确，也不能突破试探函数本身的表达能力。核电荷为 $Z$ 时，最优 $\\alpha$ 随 $Z^2$ 缩放，能量也随 $Z^2$ 缩放。",
      },
      pitfalls: [
        "把径向概率 $4\\pi r^2n(r)$ 与密度 $n(\\mathbf r)$ 混淆：前者还包含球壳体积因子，峰值位置通常不同。",
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
          "初始密度 $n_{\\mathrm{in}}$",
          "构造有效势 $v_{\\mathrm{eff}}$",
          "求解轨道 $\\phi_i$",
          "得到新密度 $n_{\\mathrm{out}}$",
          "混合与收敛检查",
        ],
      },
      derivation: {
        title: "从一个宽度参数，到密度泛函方程",
        introduction:
          "先把氢样原子的无限维波函数问题限制成一个参数的最小化，再放开轨道自由度得到 Kohn–Sham 方程，最后辨认交换关联近似怎样进入方程。第一步是变分入门模型，并不是完整的 DFT。",
        stages: [
          {
            level: "simple",
            title: "简单情形：单电子高斯试探函数",
            assumptions: [
              "原子核固定，核电荷为 $Z>0$；采用原子单位，忽略相对论效应。",
              "试探轨道为 $\\phi_\\alpha(r)=A\\exp(-\\alpha r^2)$，且 $\\alpha>0$。",
            ],
            steps: [
              {
                explanation:
                  "先由电子数守恒求归一化系数；密度是轨道模方，不是径向概率。",
                formula:
                  "1=A^2\\int e^{-2\\alpha r^2}\\,d^3r=A^2\\left(\\frac{\\pi}{2\\alpha}\\right)^{3/2}\\quad\\Rightarrow\\quad A=\\left(\\frac{2\\alpha}{\\pi}\\right)^{3/4}",
              },
              {
                explanation:
                  "用归一化密度计算动能与库仑吸引能。前者随压缩增大，后者因靠近原子核而降低。",
                formula:
                  "\\begin{aligned}T&=\\frac12\\int|\\nabla\\phi_\\alpha|^2\\,d^3r=\\frac{3\\alpha}{2}\\\\V&=-Z\\int\\frac{|\\phi_\\alpha|^2}{r}\\,d^3r=-2Z\\sqrt{\\frac{2\\alpha}{\\pi}}\\\\E(\\alpha)&=\\frac{3\\alpha}{2}-2Z\\sqrt{\\frac{2\\alpha}{\\pi}}\\end{aligned}",
              },
              {
                explanation:
                  "令能量对宽度参数的导数为零，再代回得到最优能量；这只在所选高斯函数族内最优。",
                formula:
                  "\\begin{aligned}\\frac{dE}{d\\alpha}&=\\frac32-Z\\sqrt{\\frac2\\pi}\\alpha^{-1/2}=0\\\\\\alpha_*&=\\frac{8Z^2}{9\\pi},\\qquad E_*=-\\frac{4Z^2}{3\\pi}\\end{aligned}",
              },
            ],
            conclusion:
              "对 $Z=1$，得到 $E_*\\approx-0.42441\\,\\mathrm{Ha}$，高于精确值 $-0.5\\,\\mathrm{Ha}$。继续收紧优化容差不能消除函数形状限制。",
          },
          {
            level: "general",
            title: "一般情形：允许多个轨道共同变化",
            assumptions: [
              "固定原子核，采用基态 Kohn–Sham 构造；轨道正交归一，电子数与占据约定给定。",
              "下面用原子单位；占据数 $f_i$ 含所采用的自旋计数。",
              "固定构型的核排斥 $E_{\\mathrm{II}}$ 为常数，省略于电子变分；比较不同构型时须重新加上。",
            ],
            steps: [
              {
                explanation:
                  "把一个试探宽度推广为一组轨道，并由占据轨道重建密度。归一化约束保证电子数不变。",
                formula:
                  "n(\\mathbf r)=\\sum_i f_i|\\phi_i(\\mathbf r)|^2,\\qquad\\langle\\phi_i|\\phi_j\\rangle=\\delta_{ij},\\qquad\\sum_i f_i=N",
              },
              {
                explanation:
                  "分离辅助非相互作用动能、外势、经典排斥和剩余交换关联能，再加入正交约束的拉格朗日乘子。",
                formula:
                  "\\begin{aligned}E[\\{\\phi_i\\}]&=T_s+\\int v_{\\mathrm{ext}}n\\,d^3r+E_H[n]+E_{\\mathrm{xc}}[n]\\\\\\mathcal L&=E-\\sum_{ij}\\Lambda_{ij}\\bigl(\\langle\\phi_i|\\phi_j\\rangle-\\delta_{ij}\\bigr)\\end{aligned}",
              },
              {
                explanation:
                  "对轨道共轭作变分，在占据子空间中选取使乘子矩阵对角的轨道，得到单电子形式的有效方程。密度依赖使它仍然是非线性问题。",
                formula:
                  "\\left[-\\frac12\\nabla^2+v_{\\mathrm{ext}}+v_H[n]+v_{\\mathrm{xc}}[n]\\right]\\phi_i=\\varepsilon_i\\phi_i,\\qquad v_{\\mathrm{xc}}=\\frac{\\delta E_{\\mathrm{xc}}}{\\delta n}",
              },
              {
                explanation:
                  "于是需要反复更新密度，直到输入与输出一致。密度混合是求解手段，不是电子的真实运动。",
                formula:
                  "n^{(k+1)}=(1-\\beta)n^{(k)}+\\beta n_{\\mathrm{out}}^{(k)},\\qquad\\|n_{\\mathrm{out}}^{(k)}-n^{(k)}\\|\\longrightarrow0",
              },
            ],
            conclusion:
              "变分思路从一个参数扩展为轨道函数；自洽求解只保证所选泛函与离散表示内部一致，仍需独立检验基组和物理近似。",
          },
          {
            level: "extension",
            title: "扩展：局部密度如何变成梯度依赖",
            assumptions: [
              "把交换关联近似写为可微泛函；边界处的变分项消失，例如使用周期边界。",
              "此处讨论半局域泛函；杂化泛函的非局域交换还会改变有效算符。",
            ],
            steps: [
              {
                explanation:
                  "最简单的局部近似把每一点看作均匀电子气，其交换关联能密度只依赖当地密度。",
                formula:
                  "E_{\\mathrm{xc}}^{\\mathrm{LDA}}[n]=\\int n(\\mathbf r)\\,\\epsilon_{\\mathrm{xc}}(n(\\mathbf r))\\,d^3r",
              },
              {
                explanation:
                  "用乘积求导可得到局部势。若能量形式改变，进入轨道方程的势也必须随之改变。",
                formula:
                  "v_{\\mathrm{xc}}^{\\mathrm{LDA}}(\\mathbf r)=\\epsilon_{\\mathrm{xc}}(n)+n\\frac{d\\epsilon_{\\mathrm{xc}}}{dn}",
              },
              {
                explanation:
                  "允许能量密度依赖密度梯度，对变分中的梯度项分部积分，就得到额外的散度项。",
                formula:
                  "\\begin{aligned}E_{\\mathrm{xc}}^{\\mathrm{GGA}}&=\\int f(n,\\nabla n)\\,d^3r\\\\\\delta E_{\\mathrm{xc}}&=\\int\\left[\\frac{\\partial f}{\\partial n}-\\nabla\\cdot\\frac{\\partial f}{\\partial(\\nabla n)}\\right]\\delta n\\,d^3r\\\\v_{\\mathrm{xc}}^{\\mathrm{GGA}}&=\\frac{\\partial f}{\\partial n}-\\nabla\\cdot\\frac{\\partial f}{\\partial(\\nabla n)}\\end{aligned}",
              },
            ],
            conclusion:
              "GGA 增加的是对非均匀密度的物理描述，而不只是更多迭代。更复杂泛函仍需对目标材料性质验证，精度不会仅由名称保证。",
          },
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
            "Electrons are much lighter than nuclei. In the Born–Oppenheimer approximation, nuclear positions $\\mathbf R$ are held fixed while solving for the electronic ground-state energy $E_{\\mathrm{elec}}(\\mathbf R)$. Comparing different geometries also requires nuclear–nuclear repulsion $E_{\\mathrm{II}}(\\mathbf R)$: the total potential-energy surface is $E_{\\mathrm{BO}}=E_{\\mathrm{elec}}+E_{\\mathrm{II}}$. Nuclear repulsion is constant in a fixed-geometry electronic variation but changes between geometries and must not be omitted when comparing structures. Physical dynamical time enters when nuclear motion is additionally considered.",
            "A many-electron wavefunction depends on every electron coordinate, whereas the density $n(\\mathbf r)$ depends on one spatial coordinate and integrates to the electron number $N$. Under its applicable assumptions, the Hohenberg–Kohn theorem connects ground-state density to the external potential and ground-state properties. It does not supply a known, exact, computationally convenient functional. Density is also not a track left by one electron moving along an orbit.",
          ],
          formula:
            "\\begin{aligned}\\int n(\\mathbf r)\\,d^3r&=N,\\qquad E_{\\mathrm{elec},0}=\\min_{n\\to N}E[n]\\\\E_{\\mathrm{BO}}(\\mathbf R)&=E_{\\mathrm{elec},0}(\\mathbf R)+E_{\\mathrm{II}}(\\mathbf R)\\end{aligned}",
          symbols: [
            {
              symbol: "n(\\mathbf r)",
              meaning:
                "Electron number density; in three dimensions its unit is $\\mathrm{length}^{-3}$.",
            },
            {
              symbol: "N",
              meaning:
                "Total electron number, held fixed during the minimization.",
            },
            {
              symbol: "\\mathbf R",
              meaning:
                "The collection of nuclear positions, fixed during an electronic ground-state calculation.",
            },
          ],
        },
        {
          title: "Why introduce Kohn–Sham orbitals?",
          paragraphs: [
            "Expressing every energy contribution as a known density formula is difficult, particularly the kinetic energy. Kohn–Sham theory introduces an auxiliary noninteracting system whose orbitals $\\phi_i$ provide a practical kinetic-energy expression while reproducing the interacting system’s density. Classical electron repulsion enters the Hartree term; the remaining differences enter the exchange-correlation energy $E_{\\mathrm{xc}}$. These auxiliary orbitals are a useful construction, not a license to interpret all orbital eigenvalues as measured excitation energies.",
            "Varying the orbital energy functional under orthonormality constraints produces equations with a single-electron form. They remain nonlinear because the effective potential depends on density and density depends on their solutions. LDA builds an exchange-correlation approximation from local density; GGA also uses its gradient. Choosing between them changes the physical approximation, rather than merely changing a numerical solver setting.",
          ],
          formula:
            "\\begin{aligned}\\left[-\\frac12\\nabla^2+v_{\\mathrm{ext}}(\\mathbf r)+v_H[n](\\mathbf r)+v_{\\mathrm{xc}}[n](\\mathbf r)\\right]\\phi_i&=\\varepsilon_i\\phi_i\\\\n(\\mathbf r)&=\\sum_i f_i|\\phi_i(\\mathbf r)|^2\\end{aligned}",
          symbols: [
            {
              symbol: "\\phi_i,\\ f_i",
              meaning:
                "Auxiliary orbitals and their occupation numbers; these equations use atomic units.",
            },
            {
              symbol: "v_H,\\ v_{\\mathrm{xc}}",
              meaning:
                "Hartree and exchange-correlation potentials; $v_{\\mathrm{xc}}$ is the functional derivative of $E_{\\mathrm{xc}}$.",
            },
            {
              symbol: "\\varepsilon_i",
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
          formula:
            "n_{\\mathrm{next}}=(1-\\beta)n_{\\mathrm{in}}+\\beta n_{\\mathrm{out}},\\qquad0<\\beta\\le1",
          symbols: [
            {
              symbol: "\\beta",
              meaning:
                "Density-mixing weight; a smaller value may reduce oscillation while requiring more iterations.",
            },
            {
              symbol: "n_{\\mathrm{out}}-n_{\\mathrm{in}}",
              meaning:
                "Self-consistency residual, measuring whether the current density is a fixed point of the selected equations.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How well can one Gaussian describe hydrogen?",
        given:
          "Use nuclear charge $Z=1$ and the trial orbital $\\phi(r)=(2\\alpha/\\pi)^{3/4}\\exp(-\\alpha r^2)$ in atomic units. Its normalized density is $n(r)=|\\phi(r)|^2$.",
        steps: [
          "The kinetic and nuclear-attraction expectations give $E(\\alpha)=\\frac{3\\alpha}{2}-2\\sqrt{\\frac{2\\alpha}{\\pi}}$. Increasing $\\alpha$ concentrates the density but raises kinetic energy.",
          "Set $\\frac{dE}{d\\alpha}=\\frac32-\\sqrt{\\frac2\\pi}\\frac1{\\sqrt\\alpha}=0$ to obtain $\\alpha_*=\\frac8{9\\pi}\\approx0.28294\\,a_0^{-2}$.",
          "Substitution gives $E_*=-\\frac4{3\\pi}\\approx-0.42441\\,\\mathrm{Ha}$, compared with the exact hydrogen ground-state energy of $-0.5\\,\\mathrm{Ha}$.",
          "The Gaussian energy lies about $0.07559\\,\\mathrm{Ha}$ above the exact result. The remaining error reflects the restricted shape of a single Gaussian, not unfinished minimization.",
        ],
        result:
          "An accurate optimizer cannot overcome the expressive limits of its trial functions. For nuclear charge $Z$, both the optimal $\\alpha$ and the energy scale with $Z^2$.",
      },
      pitfalls: [
        "Confusing radial probability $4\\pi r^2n(r)$ with density $n(\\mathbf r)$: the former includes the spherical-shell volume factor and generally peaks at a different radius.",
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
          "Input density $n_{\\mathrm{in}}$",
          "Effective potential $v_{\\mathrm{eff}}$",
          "Solve orbitals $\\phi_i$",
          "New density $n_{\\mathrm{out}}$",
          "Mix and check convergence",
        ],
      },
      derivation: {
        title: "From one width parameter to density-functional equations",
        introduction:
          "Begin by restricting a hydrogen-like wavefunction to one adjustable parameter. Then release the orbital degrees of freedom to obtain the Kohn–Sham equations, and identify how exchange-correlation approximations enter them. The first stage teaches variation; it is not a complete DFT calculation.",
        stages: [
          {
            level: "simple",
            title: "Simple case: a one-electron Gaussian",
            assumptions: [
              "Fix a nucleus of charge $Z>0$, use atomic units, and neglect relativistic effects.",
              "Restrict the trial orbital to $\\phi_\\alpha(r)=A\\exp(-\\alpha r^2)$ with $\\alpha>0$.",
            ],
            steps: [
              {
                explanation:
                  "Normalize the orbital by conserving electron number. Density is its squared magnitude, not radial probability.",
                formula:
                  "1=A^2\\int e^{-2\\alpha r^2}\\,d^3r=A^2\\left(\\frac{\\pi}{2\\alpha}\\right)^{3/2}\\quad\\Rightarrow\\quad A=\\left(\\frac{2\\alpha}{\\pi}\\right)^{3/4}",
              },
              {
                explanation:
                  "Evaluate kinetic and nuclear-attraction energies with the normalized density. Compression raises kinetic energy while making nuclear attraction more favorable.",
                formula:
                  "\\begin{aligned}T&=\\frac12\\int|\\nabla\\phi_\\alpha|^2\\,d^3r=\\frac{3\\alpha}{2}\\\\V&=-Z\\int\\frac{|\\phi_\\alpha|^2}{r}\\,d^3r=-2Z\\sqrt{\\frac{2\\alpha}{\\pi}}\\\\E(\\alpha)&=\\frac{3\\alpha}{2}-2Z\\sqrt{\\frac{2\\alpha}{\\pi}}\\end{aligned}",
              },
              {
                explanation:
                  "Set the width derivative to zero and substitute the optimum into the energy. This is optimal only within the chosen Gaussian family.",
                formula:
                  "\\begin{aligned}\\frac{dE}{d\\alpha}&=\\frac32-Z\\sqrt{\\frac2\\pi}\\alpha^{-1/2}=0\\\\\\alpha_*&=\\frac{8Z^2}{9\\pi},\\qquad E_*=-\\frac{4Z^2}{3\\pi}\\end{aligned}",
              },
            ],
            conclusion:
              "For $Z=1$, the result $E_*\\approx-0.42441\\,\\mathrm{Ha}$ lies above the exact $-0.5\\,\\mathrm{Ha}$. Tightening optimization tolerances cannot remove the restriction on functional shape.",
          },
          {
            level: "general",
            title: "General case: vary multiple orbitals",
            assumptions: [
              "Use a ground-state Kohn–Sham construction at fixed nuclei, with orthonormal orbitals and prescribed electron number and occupation convention.",
              "Use atomic units; occupations $f_i$ include the chosen spin counting.",
              "Nuclear repulsion $E_{\\mathrm{II}}$ is constant and omitted in the fixed-geometry electronic variation; restore it when comparing geometries.",
            ],
            steps: [
              {
                explanation:
                  "Replace one trial width by a set of orbitals and reconstruct the density from occupied states. Orthonormality preserves the electron count.",
                formula:
                  "n(\\mathbf r)=\\sum_i f_i|\\phi_i(\\mathbf r)|^2,\\qquad\\langle\\phi_i|\\phi_j\\rangle=\\delta_{ij},\\qquad\\sum_i f_i=N",
              },
              {
                explanation:
                  "Separate auxiliary kinetic energy, external potential, classical repulsion, and remaining exchange-correlation energy; then impose orbital orthonormality with Lagrange multipliers.",
                formula:
                  "\\begin{aligned}E[\\{\\phi_i\\}]&=T_s+\\int v_{\\mathrm{ext}}n\\,d^3r+E_H[n]+E_{\\mathrm{xc}}[n]\\\\\\mathcal L&=E-\\sum_{ij}\\Lambda_{ij}\\bigl(\\langle\\phi_i|\\phi_j\\rangle-\\delta_{ij}\\bigr)\\end{aligned}",
              },
              {
                explanation:
                  "Vary the conjugate orbitals and choose a basis that diagonalizes the multiplier matrix in the occupied subspace. The effective equations look one-electron-like but remain nonlinear through the density.",
                formula:
                  "\\left[-\\frac12\\nabla^2+v_{\\mathrm{ext}}+v_H[n]+v_{\\mathrm{xc}}[n]\\right]\\phi_i=\\varepsilon_i\\phi_i,\\qquad v_{\\mathrm{xc}}=\\frac{\\delta E_{\\mathrm{xc}}}{\\delta n}",
              },
              {
                explanation:
                  "Iterate until input and output densities agree. Mixing is a solution strategy, not the physical motion of electrons.",
                formula:
                  "n^{(k+1)}=(1-\\beta)n^{(k)}+\\beta n_{\\mathrm{out}}^{(k)},\\qquad\\|n_{\\mathrm{out}}^{(k)}-n^{(k)}\\|\\longrightarrow0",
              },
            ],
            conclusion:
              "Variation has expanded from one parameter to orbital functions. Self-consistency solves the selected functional and discretization; basis convergence and the physical approximation still need independent checks.",
          },
          {
            level: "extension",
            title: "Extension: from local density to gradient dependence",
            assumptions: [
              "Assume differentiable exchange-correlation approximations and vanishing boundary variation terms, as under periodic boundaries.",
              "Consider semilocal functionals here; nonlocal exchange in hybrids further changes the effective operator.",
            ],
            steps: [
              {
                explanation:
                  "The local approximation treats each point using a uniform-electron-gas energy that depends only on its local density.",
                formula:
                  "E_{\\mathrm{xc}}^{\\mathrm{LDA}}[n]=\\int n(\\mathbf r)\\,\\epsilon_{\\mathrm{xc}}(n(\\mathbf r))\\,d^3r",
              },
              {
                explanation:
                  "Differentiate the product to obtain the local potential. Changing the energy expression requires changing the potential used in the orbital equations.",
                formula:
                  "v_{\\mathrm{xc}}^{\\mathrm{LDA}}(\\mathbf r)=\\epsilon_{\\mathrm{xc}}(n)+n\\frac{d\\epsilon_{\\mathrm{xc}}}{dn}",
              },
              {
                explanation:
                  "Allow the energy density to depend on the density gradient. Integration by parts of the gradient variation produces an additional divergence term.",
                formula:
                  "\\begin{aligned}E_{\\mathrm{xc}}^{\\mathrm{GGA}}&=\\int f(n,\\nabla n)\\,d^3r\\\\\\delta E_{\\mathrm{xc}}&=\\int\\left[\\frac{\\partial f}{\\partial n}-\\nabla\\cdot\\frac{\\partial f}{\\partial(\\nabla n)}\\right]\\delta n\\,d^3r\\\\v_{\\mathrm{xc}}^{\\mathrm{GGA}}&=\\frac{\\partial f}{\\partial n}-\\nabla\\cdot\\frac{\\partial f}{\\partial(\\nabla n)}\\end{aligned}",
              },
            ],
            conclusion:
              "GGA adds a description of density inhomogeneity, not merely more iterations. More elaborate functionals still require validation for the target property; a label alone does not guarantee accuracy.",
          },
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
          formula: "\\Psi(1,\\ldots,N)=\\frac{1}{\\sqrt{N!}}\\det[\\chi_i(j)]",
          symbols: [
            {
              symbol: "\\chi_i",
              meaning: "自旋轨道，同时包含空间部分与自旋部分。",
            },
            {
              symbol: "j",
              meaning: "第 $j$ 个电子的空间与自旋坐标。",
            },
            {
              symbol: "\\det",
              meaning: "行列式；交换两列使其变号，体现费米反对称性。",
            },
          ],
        },
        {
          title: "直接项与交换项：两种不同来源",
          paragraphs: [
            "对行列式求电子相互作用能，会同时出现直接库仑项 $J$ 和交换项 $K$。直接项类似两团电荷密度之间的经典排斥；交换项来自反对称波函数中不同乘积项的干涉，并不是新增的一种经典作用力。对于自旋正交的轨道，自旋积分使相应交换项为零。",
            "同自旋电子的交换孔已在 Hartree–Fock 中体现，但电子仍可以通过更精细的相互避让进一步降低能量，这部分不在单行列式平均场之内。在同一非相对论哈密顿量下，通常把完整基组极限中的精确能量与 HF 能量之差称为相关能；有限基组下也可以比较二者在同一基组中的差值。尤其在断键、近简并或强关联问题中，单个行列式可能不再是好的起点。",
          ],
          formula:
            "\\hat F\\chi_i=\\varepsilon_i\\chi_i,\\qquad\\hat F=\\hat h+\\sum_j(\\hat J_j-\\hat K_j)",
          symbols: [
            {
              symbol: "\\hat h",
              meaning: "单电子动能与电子—原子核吸引算符。",
            },
            {
              symbol: "\\hat J_j",
              meaning: "第 $j$ 个占据自旋轨道产生的直接库仑算符。",
            },
            {
              symbol: "\\hat K_j",
              meaning: "交换算符；其作用依赖参与交换的轨道。",
            },
          ],
        },
        {
          title: "为什么平均场仍需要反复求解？",
          paragraphs: [
            "Fock 算符包含所有占据轨道，所以求轨道的方程又依赖它自身的解。实际流程是猜测轨道或密度矩阵，构造 Fock 矩阵，对角化，按电子数填充轨道，再重新构造平均场。混合或更高效的加速方法帮助迭代稳定下来；应同时检查密度残差、能量和所求解的电子态。",
            "本章实验用两个位点、两个相反自旋电子与一个占据空间轨道建立受限 Hubbard 平均场。参数 $t$ 鼓励电子在位点间离域，$\\Delta$ 偏向较低能的 A 位点，$U$ 惩罚同一位点的双占据。这个模型能展示自洽与电荷重排，但没有真实原子的基函数积分，也不能用它直接研究完整的分子交换与相关效应。",
          ],
          formula:
            "\\mathbf F=\\begin{bmatrix}-\\Delta/2+Un_A/2&-t\\\\-t&\\Delta/2+Un_B/2\\end{bmatrix},\\qquad n_A+n_B=2",
          symbols: [
            {
              symbol: "t",
              meaning: "位点间跃迁能量；实验取 $t=1$ 作为能量单位。",
            },
            {
              symbol: "\\Delta,\\ U",
              meaning: "两位点能量差与在位相互作用强度。",
            },
            {
              symbol: "n_A,\\ n_B",
              meaning: "两个位点的总电子占据数，包含两个自旋。",
            },
          ],
        },
      ],
      workedExample: {
        title: "没有相互作用时，两个电子如何分配？",
        given:
          "取 $t=1$、$\\Delta=1$、$U=0$。两个相反自旋电子占据同一最低能空间轨道。",
        steps: [
          "Fock 矩阵退化为 $\\begin{bmatrix}-0.5&-1\\\\-1&0.5\\end{bmatrix}$，不再依赖占据数。",
          "其本征值为 $\\pm\\sqrt{t^2+(\\Delta/2)^2}=\\pm\\sqrt{1.25}$，最低单电子能量约为 $-1.11803t$。",
          "占据最低轨道后，$n_A=1+\\frac{\\Delta}{\\sqrt{\\Delta^2+4t^2}}\\approx1.44721$，$n_B\\approx0.55279$；总数仍为 2。",
          "两个电子的总能量为 $2(-1.11803t)=-2.23607t$。低能 A 位点更富电子，但有限的 $t$ 使轨道仍然离域。",
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
          "若两位点完全等价（$\\Delta=0$），受限对称解的占据数应是什么？为什么 $U$ 增大时不能单靠这一结果判断模型精度？",
        answer:
          "对称解满足 $n_A=n_B=1$。相同的平均占据数可能对应很不同的双占据概率与电子关联；大 $U$ 下真实电子更倾向避免双占据，而受限单轨道平均场无法充分表达这种相关。",
      },
      diagram: {
        title: "直接与交换：同一相互作用的不同量子贡献",
        caption:
          "直接项联系两团电子密度；交换项来自同自旋波函数的反对称性。示意线不是电子的真实运动轨迹。",
        labels: [
          "轨道 $i$",
          "轨道 $j$",
          "直接库仑 $J$",
          "同自旋交换 $K$",
          "反对称组合",
        ],
      },
      derivation: {
        title: "从两电子反对称性，到自洽平均场与相关",
        introduction:
          "先由交换两个电子时波函数变号这一要求写出最小行列式，再求能量并推广到矩阵自洽方程。最后用两位点模型说明放宽自旋约束能改进什么、又遗漏什么。",
        stages: [
          {
            level: "simple",
            title: "简单情形：两个正交自旋轨道",
            assumptions: [
              "自旋轨道 $a$ 与 $b$ 正交归一；完整坐标包含空间与自旋。",
              "哈密顿量为两项单电子算符加库仑排斥，采用原子单位。",
            ],
            steps: [
              {
                explanation:
                  "普通轨道乘积不满足反对称性。相减并归一化后，交换两个坐标只改变符号。",
                formula:
                  "\\Psi(1,2)=\\frac{a(1)b(2)-b(1)a(2)}{\\sqrt2},\\qquad\\Psi(2,1)=-\\Psi(1,2)",
              },
              {
                explanation:
                  "将它代入相互作用能期望值。两个平方项给出直接积分，两个交叉项给出交换积分。",
                formula:
                  "\\begin{aligned}J_{ab}&=\\iint\\frac{|a(1)|^2|b(2)|^2}{r_{12}}\\,d1\\,d2\\\\K_{ab}&=\\iint\\frac{a^*(1)b(1)b^*(2)a(2)}{r_{12}}\\,d1\\,d2\\\\\\langle\\Psi|r_{12}^{-1}|\\Psi\\rangle&=J_{ab}-K_{ab}\\end{aligned}",
              },
              {
                explanation:
                  "加上单电子能量。若两个轨道自旋正交，自旋积分让交换项为零，但直接排斥仍然存在。",
                formula:
                  "E=h_{aa}+h_{bb}+J_{ab}-K_{ab},\\qquad\\langle\\alpha|\\beta\\rangle=0\\ \\Rightarrow\\ K_{a\\alpha,b\\beta}=0",
              },
            ],
            conclusion:
              "交换来自波函数反对称性，并非额外引入的经典力。相反自旋电子没有该交换项，但仍可有超出平均场的相关运动。",
          },
          {
            level: "general",
            title: "一般情形：多个轨道与有限基组",
            assumptions: [
              "在单 Slater 行列式内变分，自旋轨道保持正交归一。",
              "用一组给定基函数展开轨道；基函数本身可以不正交。",
            ],
            steps: [
              {
                explanation:
                  "把两电子能量推广到全部占据轨道，二分之一因子避免把每对相互作用计算两次。",
                formula:
                  "E_{\\mathrm{HF}}=\\sum_i h_{ii}+\\frac12\\sum_{ij}(J_{ij}-K_{ij})",
              },
              {
                explanation:
                  "对轨道作带约束的能量变分。能量导数中出现的直接与交换算符共同构成 Fock 算符。",
                formula:
                  "\\delta\\!\\left[E_{\\mathrm{HF}}-\\sum_{ij}\\Lambda_{ij}(\\langle\\chi_i|\\chi_j\\rangle-\\delta_{ij})\\right]=0\\quad\\Rightarrow\\quad\\hat F\\chi_i=\\sum_j\\Lambda_{ij}\\chi_j",
              },
              {
                explanation:
                  "展开轨道后左乘基函数并积分，把函数方程变成广义本征值问题；重叠矩阵来自非正交基。",
                formula:
                  "\\chi_i=\\sum_\\mu C_{\\mu i}b_\\mu,\\qquad\\mathbf F[\\mathbf P]\\mathbf C=\\mathbf S\\mathbf C\\boldsymbol\\varepsilon,\\qquad S_{\\mu\\nu}=\\langle b_\\mu|b_\\nu\\rangle",
              },
              {
                explanation:
                  "由占据轨道构造密度矩阵，再重建 Fock 矩阵。闭壳层空间轨道的系数二表示两种自旋占据。",
                formula:
                  "P_{\\mu\\nu}=2\\sum_{i\\in\\mathrm{occ}}C_{\\mu i}C_{\\nu i}^*,\\qquad\\mathbf P^{(k)}\\to\\mathbf F[\\mathbf P^{(k)}]\\to\\mathbf C^{(k+1)}\\to\\mathbf P^{(k+1)}",
              },
            ],
            conclusion:
              "这就是自洽场结构；它解决单行列式近似，而不是所有电子相关。非线性方程可能有多个解，应检查解的稳定性与电子态。",
          },
          {
            level: "extension",
            title: "扩展：放宽自旋限制仍不等于精确相关",
            assumptions: [
              "考虑两个等价位点、两个电子的 Hubbard 模型，跃迁 $t>0$，在位排斥 $U\\ge0$。",
              "忽略核能等共同常数，比较同一哈密顿量下的受限平均场与精确单重态。",
            ],
            steps: [
              {
                explanation:
                  "受限解让两个相反自旋电子共用成键轨道，每个位点有相同自旋平均占据。由此得到有限的双占据概率。",
                formula:
                  "n_{A\\uparrow}=n_{A\\downarrow}=n_{B\\uparrow}=n_{B\\downarrow}=\\frac12,\\qquad E_{\\mathrm{RHF}}=-2t+\\frac U2",
              },
              {
                explanation:
                  "允许两种自旋有不同的轨道后，某一自旋感受到另一自旋的局部平均占据，而不再强制自旋平衡。这扩大了变分空间，但可能破坏自旋对称性。",
                formula:
                  "\\mathbf F_\\sigma=\\begin{bmatrix}U n_{A\\bar\\sigma}&-t\\\\-t&U n_{B\\bar\\sigma}\\end{bmatrix},\\qquad E_{\\mathrm{UHF}}^{\\min}\\le E_{\\mathrm{RHF}}",
              },
              {
                explanation:
                  "真正的单重态还需要叠加“各居一位点”与“双占据”构型。对这个二维子空间直接对角化，可看到强相互作用下的关联能量尺度。",
                formula:
                  "\\mathbf H_{\\mathrm{singlet}}=\\begin{bmatrix}0&-2t\\\\-2t&U\\end{bmatrix},\\quad E_0=\\frac{U-\\sqrt{U^2+16t^2}}2\\underset{U\\gg t}{\\simeq}-\\frac{4t^2}{U}",
              },
            ],
            conclusion:
              "大 $U$ 时受限能量随 $U/2$ 上升，而精确能量由虚跃迁产生的小能量尺度控制。多行列式、配置相互作用或其他相关方法针对的是这种平均场之外的结构。",
          },
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
          formula: "\\Psi(1,\\ldots,N)=\\frac{1}{\\sqrt{N!}}\\det[\\chi_i(j)]",
          symbols: [
            {
              symbol: "\\chi_i",
              meaning:
                "A spin orbital, containing both a spatial and a spin part.",
            },
            {
              symbol: "j",
              meaning: "The spatial and spin coordinates of electron $j$.",
            },
            {
              symbol: "\\det",
              meaning:
                "A determinant; exchanging two columns reverses its sign and enforces fermionic antisymmetry.",
            },
          ],
        },
        {
          title: "Direct and exchange terms have different origins",
          paragraphs: [
            "Evaluating electron interaction energy with a determinant produces a direct Coulomb term $J$ and an exchange term $K$. The direct term resembles classical repulsion between two charge distributions. Exchange arises from interference between the terms required to antisymmetrize the wavefunction; it is not an additional classical force. For orthogonal spin functions, the spin integral makes the corresponding exchange term vanish.",
            "Hartree–Fock includes the exchange hole between same-spin electrons, but more detailed coordinated avoidance can lower the energy further. This additional correlation is absent from a single-determinant mean field. For a given nonrelativistic Hamiltonian, correlation energy conventionally compares the exact and HF energies in the complete-basis limit; finite-basis comparisons should use the same basis for both. Bond breaking, near degeneracy, and strong correlation can make one determinant an inadequate starting point.",
          ],
          formula:
            "\\hat F\\chi_i=\\varepsilon_i\\chi_i,\\qquad\\hat F=\\hat h+\\sum_j(\\hat J_j-\\hat K_j)",
          symbols: [
            {
              symbol: "\\hat h",
              meaning:
                "The one-electron kinetic-energy and electron–nucleus attraction operator.",
            },
            {
              symbol: "\\hat J_j",
              meaning:
                "The direct Coulomb operator associated with occupied spin orbital $j$.",
            },
            {
              symbol: "\\hat K_j",
              meaning:
                "The exchange operator, whose action depends on the orbitals being exchanged.",
            },
          ],
        },
        {
          title: "Why does a mean field need repeated solution?",
          paragraphs: [
            "The Fock operator contains all occupied orbitals, so the equations for the orbitals depend on their own solutions. One guesses orbitals or a density matrix, constructs the Fock matrix, diagonalizes it, fills the orbitals according to electron number, and reconstructs the mean field. Mixing and other acceleration schemes can stabilize this iteration. Density residuals, energy changes, and the identity of the electronic state all deserve checks.",
            "The experiment uses a restricted Hubbard mean field with two sites, two opposite-spin electrons, and one occupied spatial orbital. Hopping $t$ favors delocalization, a site offset $\\Delta$ favors lower-energy site A, and $U$ penalizes double occupation of a site. This captures self-consistency and charge redistribution, but it contains neither realistic atomic basis integrals nor a complete molecular description of exchange and correlation.",
          ],
          formula:
            "\\mathbf F=\\begin{bmatrix}-\\Delta/2+Un_A/2&-t\\\\-t&\\Delta/2+Un_B/2\\end{bmatrix},\\qquad n_A+n_B=2",
          symbols: [
            {
              symbol: "t",
              meaning:
                "Inter-site hopping energy; the experiment sets $t=1$ as its energy unit.",
            },
            {
              symbol: "\\Delta,\\ U",
              meaning:
                "Site-energy difference and on-site interaction strength.",
            },
            {
              symbol: "n_A,\\ n_B",
              meaning:
                "Total electronic occupations of the two sites, including both spins.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Where do two noninteracting electrons go?",
        given:
          "Set $t=1$, $\\Delta=1$, and $U=0$. Two opposite-spin electrons occupy the same lowest-energy spatial orbital.",
        steps: [
          "The Fock matrix reduces to $\\begin{bmatrix}-0.5&-1\\\\-1&0.5\\end{bmatrix}$ and no longer depends on occupations.",
          "Its eigenvalues are $\\pm\\sqrt{t^2+(\\Delta/2)^2}=\\pm\\sqrt{1.25}$. The lower one-electron energy is approximately $-1.11803t$.",
          "Filling that orbital gives $n_A=1+\\frac{\\Delta}{\\sqrt{\\Delta^2+4t^2}}\\approx1.44721$ and $n_B\\approx0.55279$. Their sum remains 2.",
          "The two-electron energy is $2(-1.11803t)=-2.23607t$. Site A carries more density, but finite hopping keeps the orbital delocalized.",
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
          "For equivalent sites ($\\Delta=0$), what occupations does the symmetric restricted solution have? Why does this alone not establish accuracy at large $U$?",
        answer:
          "The symmetric solution has $n_A=n_B=1$. Identical average populations can hide very different double-occupation probabilities and correlations. At large $U$, real electrons strongly avoid double occupation, a behavior the restricted single-orbital mean field cannot fully represent.",
      },
      diagram: {
        title: "Direct and exchange: distinct quantum contributions",
        caption:
          "The direct term couples charge densities; exchange follows from antisymmetry for same-spin electrons. Connecting lines are not physical electron trajectories.",
        labels: [
          "Orbital $i$",
          "Orbital $j$",
          "Direct Coulomb $J$",
          "Same-spin exchange $K$",
          "Antisymmetric combination",
        ],
      },
      derivation: {
        title:
          "From two-electron antisymmetry to self-consistent fields and correlation",
        introduction:
          "Begin with the sign change required when two electrons are exchanged, evaluate the smallest determinant, and generalize to self-consistent matrix equations. A two-site example then shows what relaxing spin restrictions can and cannot repair.",
        stages: [
          {
            level: "simple",
            title: "Simple case: two orthonormal spin orbitals",
            assumptions: [
              "Spin orbitals $a$ and $b$ are orthonormal; each full coordinate includes position and spin.",
              "Use two one-electron Hamiltonians plus Coulomb repulsion, in atomic units.",
            ],
            steps: [
              {
                explanation:
                  "An orbital product is not antisymmetric. Subtract the exchanged product and normalize; swapping coordinates now reverses the sign.",
                formula:
                  "\\Psi(1,2)=\\frac{a(1)b(2)-b(1)a(2)}{\\sqrt2},\\qquad\\Psi(2,1)=-\\Psi(1,2)",
              },
              {
                explanation:
                  "Insert the determinant into the interaction-energy expectation. The two squared terms yield a direct integral; the two cross terms yield an exchange integral.",
                formula:
                  "\\begin{aligned}J_{ab}&=\\iint\\frac{|a(1)|^2|b(2)|^2}{r_{12}}\\,d1\\,d2\\\\K_{ab}&=\\iint\\frac{a^*(1)b(1)b^*(2)a(2)}{r_{12}}\\,d1\\,d2\\\\\\langle\\Psi|r_{12}^{-1}|\\Psi\\rangle&=J_{ab}-K_{ab}\\end{aligned}",
              },
              {
                explanation:
                  "Add the one-electron contributions. For orthogonal spins, the spin integral makes exchange vanish while direct repulsion remains.",
                formula:
                  "E=h_{aa}+h_{bb}+J_{ab}-K_{ab},\\qquad\\langle\\alpha|\\beta\\rangle=0\\ \\Rightarrow\\ K_{a\\alpha,b\\beta}=0",
              },
            ],
            conclusion:
              "Exchange follows from antisymmetry, not an extra classical force. Opposite-spin electrons lack this exchange term but can still display correlation beyond a mean field.",
          },
          {
            level: "general",
            title: "General case: many orbitals in a finite basis",
            assumptions: [
              "Vary a single Slater determinant while keeping its spin orbitals orthonormal.",
              "Expand orbitals in a specified basis whose functions need not be orthogonal.",
            ],
            steps: [
              {
                explanation:
                  "Sum over occupied orbitals; the factor of one half avoids counting each pair interaction twice.",
                formula:
                  "E_{\\mathrm{HF}}=\\sum_i h_{ii}+\\frac12\\sum_{ij}(J_{ij}-K_{ij})",
              },
              {
                explanation:
                  "Vary the orbitals under orthonormality constraints. The direct and exchange operators arising in the derivative form the Fock operator.",
                formula:
                  "\\delta\\!\\left[E_{\\mathrm{HF}}-\\sum_{ij}\\Lambda_{ij}(\\langle\\chi_i|\\chi_j\\rangle-\\delta_{ij})\\right]=0\\quad\\Rightarrow\\quad\\hat F\\chi_i=\\sum_j\\Lambda_{ij}\\chi_j",
              },
              {
                explanation:
                  "Expand each orbital, multiply by a basis function, and integrate. The functional equation becomes a generalized eigenproblem, with an overlap matrix for a nonorthogonal basis.",
                formula:
                  "\\chi_i=\\sum_\\mu C_{\\mu i}b_\\mu,\\qquad\\mathbf F[\\mathbf P]\\mathbf C=\\mathbf S\\mathbf C\\boldsymbol\\varepsilon,\\qquad S_{\\mu\\nu}=\\langle b_\\mu|b_\\nu\\rangle",
              },
              {
                explanation:
                  "Build a density matrix from occupied orbitals, then rebuild the Fock matrix. The factor two here denotes opposite-spin occupation of each closed-shell spatial orbital.",
                formula:
                  "P_{\\mu\\nu}=2\\sum_{i\\in\\mathrm{occ}}C_{\\mu i}C_{\\nu i}^*,\\qquad\\mathbf P^{(k)}\\to\\mathbf F[\\mathbf P^{(k)}]\\to\\mathbf C^{(k+1)}\\to\\mathbf P^{(k+1)}",
              },
            ],
            conclusion:
              "This is the self-consistent-field structure. It solves the single-determinant approximation, not all electron correlation. Nonlinear equations may have multiple solutions, so state identity and stability matter.",
          },
          {
            level: "extension",
            title:
              "Extension: releasing spin restrictions is not exact correlation",
            assumptions: [
              "Consider the half-filled, two-site Hubbard model with equivalent sites, hopping $t>0$, and on-site repulsion $U\\ge0$.",
              "Omit shared constant terms and compare the restricted mean field with the exact singlet of the same Hamiltonian.",
            ],
            steps: [
              {
                explanation:
                  "The restricted solution places opposite-spin electrons in the same bonding orbital. Equal spin populations on each site imply a finite double-occupation probability.",
                formula:
                  "n_{A\\uparrow}=n_{A\\downarrow}=n_{B\\uparrow}=n_{B\\downarrow}=\\frac12,\\qquad E_{\\mathrm{RHF}}=-2t+\\frac U2",
              },
              {
                explanation:
                  "Allow different orbitals for the two spins. Each spin now feels the other spin’s local average population rather than an enforced balance. This enlarges the variational space but can break spin symmetry.",
                formula:
                  "\\mathbf F_\\sigma=\\begin{bmatrix}U n_{A\\bar\\sigma}&-t\\\\-t&U n_{B\\bar\\sigma}\\end{bmatrix},\\qquad E_{\\mathrm{UHF}}^{\\min}\\le E_{\\mathrm{RHF}}",
              },
              {
                explanation:
                  "The exact singlet also superposes singly occupied and doubly occupied configurations. Diagonalizing this two-dimensional subspace reveals the correlation energy scale at strong interaction.",
                formula:
                  "\\mathbf H_{\\mathrm{singlet}}=\\begin{bmatrix}0&-2t\\\\-2t&U\\end{bmatrix},\\quad E_0=\\frac{U-\\sqrt{U^2+16t^2}}2\\underset{U\\gg t}{\\simeq}-\\frac{4t^2}{U}",
              },
            ],
            conclusion:
              "At large $U$, restricted energy rises as $U/2$, while the exact energy is governed by a small virtual-hopping scale. Multideterminant, configuration-interaction, and other correlation methods address this structure beyond a single mean field.",
          },
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
            "经典分子动力学把原子核近似为遵循牛顿方程的粒子。模型首先需要势能 $U(\\mathbf r_1,\\ldots,\\mathbf r_N)$，再通过对坐标求导得到力。Lennard–Jones 势用很短距离下陡峭的排斥和较长距离下的吸引，构成最经典的入门例子。它能帮助理解稀有气体式相互作用，但不能自动描述金属键、共价键或化学反应。",
            "两体势曲线下降的一侧对应将粒子推开的排斥，曲线上升的一侧对应把粒子拉近的吸引；势阱最低点处力为零。对多粒子系统，每个原子的总力是相关相互作用贡献的总和。势能值可以整体平移而不改变力，因此能量零点的选择与力学平衡的位置是不同问题。",
          ],
          formula:
            "\\begin{aligned}U(r)&=4\\epsilon\\left[\\left(\\frac\\sigma r\\right)^{12}-\\left(\\frac\\sigma r\\right)^6\\right]\\\\F_r=-\\frac{dU}{dr}&=\\frac{24\\epsilon}{r}\\left[2\\left(\\frac\\sigma r\\right)^{12}-\\left(\\frac\\sigma r\\right)^6\\right]\\end{aligned}",
          symbols: [
            {
              symbol: "\\epsilon",
              meaning: "势阱深度，设置相互作用能量尺度。",
            },
            {
              symbol: "\\sigma",
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
            "牛顿方程是连续时间微分方程，计算时必须选取时间步 $\\Delta t$。velocity-Verlet 先用旧力推进半步速度，再更新位置；由新位置重算力后，完成后半步速度。它具有时间可逆和辛结构等优点，适合长期研究保守体系；但这些优点并不意味着任意大的时间步都能保持准确。",
            "时间步需要解析系统中最快的运动。如果一步就跨过陡峭的排斥区域，数值力会剧烈变化，能量可能漂移甚至发散。实用检查是减小 $\\Delta t$ 后比较能量变化和关键统计量，而不是只看动画是否平滑。本章采用约化单位，时间单位为 $\\tau_{\\mathrm{LJ}}=\\sigma\\sqrt{m/\\epsilon}$；转换成秒需要给定材料相关的 $m$、$\\sigma$ 和 $\\epsilon$。",
          ],
          formula:
            "\\begin{aligned}\\mathbf v_{n+1/2}&=\\mathbf v_n+\\frac{\\mathbf F_n\\Delta t}{2m}\\\\\\mathbf r_{n+1}&=\\mathbf r_n+\\mathbf v_{n+1/2}\\Delta t\\\\\\mathbf v_{n+1}&=\\mathbf v_{n+1/2}+\\frac{\\mathbf F_{n+1}\\Delta t}{2m}\\end{aligned}",
          symbols: [
            {
              symbol: "\\mathbf r_n,\\ \\mathbf v_n",
              meaning: "第 $n$ 步的粒子位置与速度；对每个原子分别更新。",
            },
            {
              symbol: "\\mathbf F_{n+1}",
              meaning: "必须由更新后的粒子位置重新计算的力。",
            },
            {
              symbol: "\\Delta t",
              meaning:
                "数值时间步，本例为 $0.002\\tau_{\\mathrm{LJ}}$，不是播放速度。",
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
            "K=\\sum_i\\frac12m_i|\\mathbf v_i|^2,\\qquad T=\\frac{2K}{fk_B},\\qquad f=2N-2\\quad(d=2)",
          symbols: [
            {
              symbol: "K",
              meaning: "去除整体漂移后粒子的总动能。",
            },
            {
              symbol: "f",
              meaning: "独立的动能自由度数，取决于维度和约束。",
            },
            {
              symbol: "\\mathrm{NVE}",
              meaning: "粒子数 $N$、体积 $V$ 与总能量 $E$ 给定的微正则描述。",
            },
          ],
        },
      ],
      workedExample: {
        title: "LJ 长度参数是平衡间距吗？沿势阱算一次",
        given:
          "考虑未截断的 LJ 两体势，使用 $\\epsilon=1$、$\\sigma=1$ 的约化单位。",
        steps: [
          "在 $r=\\sigma$ 时，$U=4(1-1)=0$，但 $F_r=24\\epsilon/\\sigma$，仍有明显排斥。",
          "令 $F_r=0$，得到 $2(\\sigma/r)^{12}=(\\sigma/r)^6$，因此 $r_{\\min}=2^{1/6}\\sigma\\approx1.12246\\sigma$。",
          "此时 $(\\sigma/r)^6=1/2$，代入得 $U_{\\min}=4\\epsilon(1/4-1/2)=-\\epsilon$。",
          "本章力场在 $r_c=2.5\\sigma$ 截断并平移势能：平移改变能量零点，不改变截断范围内的力或 $r_{\\min}$。",
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
          "$r=\\sigma$ 是能量零点；$r=2^{1/6}\\sigma$ 才是两体平衡间距。示意曲线表示未截断势，本章实验还采用有限截断与能量平移。",
        labels: [
          "短程排斥",
          "长程吸引",
          "平衡间距",
          "势能 $U/\\epsilon$",
          "间距 $r/\\sigma$",
        ],
      },
      derivation: {
        title: "从一个弹簧，到多原子动力学与恒温扩展",
        introduction:
          "用解析可解的振子学习时间离散，再把力推广为多粒子势能的梯度；最后加入热浴，明确哪些量不再逐轨迹守恒。",
        stages: [
          {
            level: "simple",
            title: "简单情形：一个粒子的谐振动",
            assumptions: [
              "一维质量 $m$ 与弹簧常数 $k>0$，无摩擦、无外部随机力。",
              "使用均匀时间步 $\\Delta t$，先以解析解作为数值参考。",
            ],
            steps: [
              {
                explanation:
                  "势能的负导数给出回复力；代入牛顿第二定律确定振动频率。",
                formula:
                  "U(x)=\\frac12kx^2,\\quad F=-kx,\\quad\\ddot x+\\omega^2x=0,\\quad\\omega=\\sqrt{k/m}",
              },
              {
                explanation:
                  "分别向前、向后作 Taylor 展开并相加，消去奇数阶项，得到位置 Verlet 更新。",
                formula:
                  "\\begin{aligned}x(t+\\Delta t)+x(t-\\Delta t)&=2x(t)+\\ddot x(t)\\Delta t^2+O(\\Delta t^4)\\\\x_{n+1}&=(2-\\omega^2\\Delta t^2)x_n-x_{n-1}\\end{aligned}",
              },
              {
                explanation:
                  "设离散解每步乘以放大因子，要求特征根位于单位圆上。稳定不等于精确，实际时间步通常远小于稳定上限。",
                formula:
                  "x_n=z^n\\ \\Rightarrow\\ z^2-(2-\\omega^2\\Delta t^2)z+1=0,\\qquad0<\\omega\\Delta t<2",
              },
            ],
            conclusion:
              "这个最简单例子已经说明时间步必须解析最快振动。稳定区间的边界不是推荐设置，也不保证复杂多粒子体系始终稳定。",
          },
          {
            level: "general",
            title: "一般情形：多粒子势能与 velocity-Verlet",
            assumptions: [
              "采用经典、光滑且无显式时间依赖的势能；下面先写成两体势之和。",
              "周期边界和截断属于力模型的一部分；每对相互作用仅计算一次。",
            ],
            steps: [
              {
                explanation:
                  "距离依赖的两体能量经链式法则产生向量力，同一对粒子的两力相反。",
                formula:
                  "U=\\sum_{i<j}u(r_{ij}),\\quad\\mathbf F_i=-\\sum_{j\\ne i}u^\\prime(r_{ij})\\frac{\\mathbf r_i-\\mathbf r_j}{r_{ij}},\\quad\\mathbf F_{ij}=-\\mathbf F_{ji}",
              },
              {
                explanation:
                  "将每步分成半步加速、整步平移和半步加速；第二次加速必须使用新位置的力。",
                formula:
                  "\\begin{aligned}\\mathbf v_i^{n+1/2}&=\\mathbf v_i^n+\\frac{\\Delta t}{2m_i}\\mathbf F_i(\\mathbf r^n)\\\\\\mathbf r_i^{n+1}&=\\mathbf r_i^n+\\Delta t\\,\\mathbf v_i^{n+1/2}\\\\\\mathbf v_i^{n+1}&=\\mathbf v_i^{n+1/2}+\\frac{\\Delta t}{2m_i}\\mathbf F_i(\\mathbf r^{n+1})\\end{aligned}",
              },
              {
                explanation:
                  "连续方程中动能变化与势能变化逐项抵消。数值轨迹只能近似保持这一关系，因此应监测总能量并缩小时间步复核。",
                formula:
                  "\\frac{d(K+U)}{dt}=\\sum_i\\left(m_i\\mathbf v_i\\cdot\\dot{\\mathbf v}_i+\\nabla_iU\\cdot\\mathbf v_i\\right)=0",
              },
            ],
            conclusion:
              "把两体能改成多体能时，核心原则仍是从同一个能量表达式一致求力；简单地沿用两体力公式会漏掉多体导数。",
          },
          {
            level: "extension",
            title: "扩展：与热浴交换能量",
            assumptions: [
              "以 Langevin 恒温器为例，热浴温度 $T_0$ 固定，摩擦系数用频率 $\\gamma>0$ 表示。",
              "随机力为零均值高斯白噪声；它是新增物理/统计模型，不是原始无恒温实验。",
            ],
            steps: [
              {
                explanation:
                  "在保守力上增加黏性阻力与随机力。只有阻力会持续冷却，只有噪声会持续加热，因此两者必须配对。",
                formula:
                  "m_i\\dot{\\mathbf v}_i=\\mathbf F_i-m_i\\gamma\\mathbf v_i+\\boldsymbol\\xi_i(t)",
              },
              {
                explanation:
                  "对自由粒子的一维速度平方求平均，噪声使方差增长，阻力使方差衰减。平衡时两者抵消，得到涨落耗散关系。",
                formula:
                  "\\begin{aligned}\\langle\\xi_{i\\alpha}(t)\\xi_{j\\beta}(t^\\prime)\\rangle&=2m_i\\gamma k_BT_0\\,\\delta_{ij}\\delta_{\\alpha\\beta}\\delta(t-t^\\prime)\\\\\\frac{d\\langle v_{i\\alpha}^2\\rangle}{dt}&=-2\\gamma\\langle v_{i\\alpha}^2\\rangle+\\frac{2\\gamma k_BT_0}{m_i}\\end{aligned}",
              },
              {
                explanation:
                  "令方差变化率为零，恢复每个独立动能自由度的等分配结果。粒子系统本身的瞬时总能量不再守恒。",
                formula:
                  "\\langle v_{i\\alpha}^2\\rangle_{\\mathrm{eq}}=\\frac{k_BT_0}{m_i},\\qquad\\langle K\\rangle=\\frac f2k_BT_0",
              },
            ],
            conclusion:
              "热浴可以控制平衡温度，却也改变动力学相关函数和扩散行为。应根据研究目标选择恒温方法与耦合强度，并使用与随机方程一致的积分器。",
          },
        ],
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
            "Classical molecular dynamics approximates nuclei as particles obeying Newton’s equations. A model first supplies a potential $U(\\mathbf r_1,\\ldots,\\mathbf r_N)$; forces follow from coordinate derivatives. The Lennard–Jones potential combines a steep short-range repulsion with a longer-range attraction, making it a classic introduction to atomic interactions. It is useful for noble-gas-like behavior but does not automatically describe metallic bonding, covalent bonds, or chemical reactions.",
            "On the descending side of the potential curve, the radial force pushes particles apart; on the rising side, it draws them together. At the minimum the force vanishes. In a many-particle system, an atom experiences the sum of relevant interaction forces. Adding a constant to the potential does not change its derivatives, so choosing an energy reference is distinct from locating mechanical equilibrium.",
          ],
          formula:
            "\\begin{aligned}U(r)&=4\\epsilon\\left[\\left(\\frac\\sigma r\\right)^{12}-\\left(\\frac\\sigma r\\right)^6\\right]\\\\F_r=-\\frac{dU}{dr}&=\\frac{24\\epsilon}{r}\\left[2\\left(\\frac\\sigma r\\right)^{12}-\\left(\\frac\\sigma r\\right)^6\\right]\\end{aligned}",
          symbols: [
            {
              symbol: "\\epsilon",
              meaning: "The well depth, setting the interaction energy scale.",
            },
            {
              symbol: "\\sigma",
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
            "Newton’s equations describe continuous time, but numerical integration selects a time step $\\Delta t$. Velocity-Verlet first advances velocity by half a step using the old force, then updates positions. Forces are recalculated at those positions before completing the velocity step. Time reversibility and its symplectic structure make this method useful for conservative systems, but neither property makes an arbitrarily large step accurate.",
            "The time step must resolve the fastest motions. Jumping across a steep repulsive region in one step can produce large force errors, energy drift, or instability. A practical check reduces $\\Delta t$ and compares energy behavior and relevant statistics, instead of judging smoothness of the animation. The experiment uses reduced units with $\\tau_{\\mathrm{LJ}}=\\sigma\\sqrt{m/\\epsilon}$; converting to seconds requires material-specific $m$, $\\sigma$, and $\\epsilon$.",
          ],
          formula:
            "\\begin{aligned}\\mathbf v_{n+1/2}&=\\mathbf v_n+\\frac{\\mathbf F_n\\Delta t}{2m}\\\\\\mathbf r_{n+1}&=\\mathbf r_n+\\mathbf v_{n+1/2}\\Delta t\\\\\\mathbf v_{n+1}&=\\mathbf v_{n+1/2}+\\frac{\\mathbf F_{n+1}\\Delta t}{2m}\\end{aligned}",
          symbols: [
            {
              symbol: "\\mathbf r_n,\\ \\mathbf v_n",
              meaning:
                "Particle position and velocity at step $n$, updated for each atom.",
            },
            {
              symbol: "\\mathbf F_{n+1}",
              meaning:
                "The force that must be recalculated using the updated positions.",
            },
            {
              symbol: "\\Delta t",
              meaning:
                "The numerical time step, $0.002\\tau_{\\mathrm{LJ}}$ in this example; it is distinct from playback speed.",
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
            "K=\\sum_i\\frac12m_i|\\mathbf v_i|^2,\\qquad T=\\frac{2K}{fk_B},\\qquad f=2N-2\\quad(d=2)",
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
              symbol: "\\mathrm{NVE}",
              meaning:
                "A microcanonical description with specified particle number $N$, volume $V$, and total energy $E$.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Is the LJ length parameter the equilibrium spacing?",
        given:
          "Consider the untruncated two-particle LJ potential in reduced units $\\epsilon=1$ and $\\sigma=1$.",
        steps: [
          "At $r=\\sigma$, $U=4(1-1)=0$, but $F_r=24\\epsilon/\\sigma$: substantial repulsion remains.",
          "Setting $F_r=0$ gives $2(\\sigma/r)^{12}=(\\sigma/r)^6$, hence $r_{\\min}=2^{1/6}\\sigma\\approx1.12246\\sigma$.",
          "Here $(\\sigma/r)^6=1/2$, so $U_{\\min}=4\\epsilon(1/4-1/2)=-\\epsilon$.",
          "The experiment truncates the potential at $r_c=2.5\\sigma$ and shifts its energy. This shift changes the reference energy, not forces inside the cutoff or the value of $r_{\\min}$.",
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
          "$r=\\sigma$ is the energy zero crossing; $r=2^{1/6}\\sigma$ is the two-particle equilibrium separation. The curve represents an untruncated potential; the experiment additionally uses truncation and an energy shift.",
        labels: [
          "Short-range repulsion",
          "Long-range attraction",
          "Equilibrium separation",
          "Energy $U/\\epsilon$",
          "Separation $r/\\sigma$",
        ],
      },
      derivation: {
        title: "From one spring to many-atom dynamics and thermostats",
        introduction:
          "Use an analytically solvable oscillator to understand time discretization, generalize force to the gradient of a many-particle potential, then add a heat bath and identify which trajectory-level conservation laws change.",
        stages: [
          {
            level: "simple",
            title: "Simple case: one harmonic oscillator",
            assumptions: [
              "A one-dimensional mass $m$ and spring constant $k>0$, without friction or random forcing.",
              "Use a uniform time step $\\Delta t$ and an analytic solution as a numerical reference.",
            ],
            steps: [
              {
                explanation:
                  "The negative potential derivative gives the restoring force. Newton’s second law then sets the oscillation frequency.",
                formula:
                  "U(x)=\\frac12kx^2,\\quad F=-kx,\\quad\\ddot x+\\omega^2x=0,\\quad\\omega=\\sqrt{k/m}",
              },
              {
                explanation:
                  "Add forward and backward Taylor expansions. Odd-order terms cancel, leaving the position-Verlet update.",
                formula:
                  "\\begin{aligned}x(t+\\Delta t)+x(t-\\Delta t)&=2x(t)+\\ddot x(t)\\Delta t^2+O(\\Delta t^4)\\\\x_{n+1}&=(2-\\omega^2\\Delta t^2)x_n-x_{n-1}\\end{aligned}",
              },
              {
                explanation:
                  "Insert an amplification-factor ansatz and require the roots to lie on the unit circle. Stability is not accuracy; useful steps are usually well below the stability limit.",
                formula:
                  "x_n=z^n\\ \\Rightarrow\\ z^2-(2-\\omega^2\\Delta t^2)z+1=0,\\qquad0<\\omega\\Delta t<2",
              },
            ],
            conclusion:
              "Even this simple example shows why time steps must resolve the fastest vibration. A stability boundary is not a recommended setting and does not guarantee stability in a complex many-particle system.",
          },
          {
            level: "general",
            title:
              "General case: a many-particle potential and velocity-Verlet",
            assumptions: [
              "Assume a classical smooth potential with no explicit time dependence; write it first as a sum of pair interactions.",
              "Periodic images and cutoffs are part of the force model; count each interacting pair once.",
            ],
            steps: [
              {
                explanation:
                  "Apply the chain rule to a distance-dependent pair energy. The two forces for each pair are equal and opposite.",
                formula:
                  "U=\\sum_{i<j}u(r_{ij}),\\quad\\mathbf F_i=-\\sum_{j\\ne i}u^\\prime(r_{ij})\\frac{\\mathbf r_i-\\mathbf r_j}{r_{ij}},\\quad\\mathbf F_{ij}=-\\mathbf F_{ji}",
              },
              {
                explanation:
                  "Split each step into a half acceleration, full drift, and half acceleration. The final acceleration must use forces at the new positions.",
                formula:
                  "\\begin{aligned}\\mathbf v_i^{n+1/2}&=\\mathbf v_i^n+\\frac{\\Delta t}{2m_i}\\mathbf F_i(\\mathbf r^n)\\\\\\mathbf r_i^{n+1}&=\\mathbf r_i^n+\\Delta t\\,\\mathbf v_i^{n+1/2}\\\\\\mathbf v_i^{n+1}&=\\mathbf v_i^{n+1/2}+\\frac{\\Delta t}{2m_i}\\mathbf F_i(\\mathbf r^{n+1})\\end{aligned}",
              },
              {
                explanation:
                  "In the continuous equations, kinetic and potential energy changes cancel term by term. Numerical trajectories only approximate this relation, motivating energy monitoring and time-step refinement.",
                formula:
                  "\\frac{d(K+U)}{dt}=\\sum_i\\left(m_i\\mathbf v_i\\cdot\\dot{\\mathbf v}_i+\\nabla_iU\\cdot\\mathbf v_i\\right)=0",
              },
            ],
            conclusion:
              "For a many-body energy, the same principle applies: derive forces consistently from that energy. Reusing a pair-force expression blindly would omit many-body derivatives.",
          },
          {
            level: "extension",
            title: "Extension: exchanging energy with a heat bath",
            assumptions: [
              "Use a Langevin thermostat at fixed bath temperature $T_0$, with friction rate $\\gamma>0$.",
              "Use zero-mean Gaussian white noise. This adds a statistical model beyond the original unthermostatted experiment.",
            ],
            steps: [
              {
                explanation:
                  "Add friction and noise to the conservative force. Friction alone cools continuously; noise alone heats continuously, so their strengths must be paired.",
                formula:
                  "m_i\\dot{\\mathbf v}_i=\\mathbf F_i-m_i\\gamma\\mathbf v_i+\\boldsymbol\\xi_i(t)",
              },
              {
                explanation:
                  "For a free particle, average the evolution of one velocity component squared. Noise increases its variance while friction decreases it. Balancing both at equilibrium yields fluctuation–dissipation.",
                formula:
                  "\\begin{aligned}\\langle\\xi_{i\\alpha}(t)\\xi_{j\\beta}(t^\\prime)\\rangle&=2m_i\\gamma k_BT_0\\,\\delta_{ij}\\delta_{\\alpha\\beta}\\delta(t-t^\\prime)\\\\\\frac{d\\langle v_{i\\alpha}^2\\rangle}{dt}&=-2\\gamma\\langle v_{i\\alpha}^2\\rangle+\\frac{2\\gamma k_BT_0}{m_i}\\end{aligned}",
              },
              {
                explanation:
                  "Set the variance derivative to zero to recover equipartition for each independent kinetic degree of freedom. The particle system’s instantaneous total energy is no longer conserved.",
                formula:
                  "\\langle v_{i\\alpha}^2\\rangle_{\\mathrm{eq}}=\\frac{k_BT_0}{m_i},\\qquad\\langle K\\rangle=\\frac f2k_BT_0",
              },
            ],
            conclusion:
              "A heat bath controls equilibrium temperature but also affects dynamical correlations and diffusion. Choose thermostat and coupling strength for the observable of interest, and use an integrator consistent with the stochastic equation.",
          },
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
            "直接枚举构型通常不可行：一个 $N$ 个二态自旋的 Ising 模型就有 $2^N$ 种状态。Monte Carlo 构造随机游走，让经常访问的状态与所需概率相匹配。它不是“随便随机”，而是通过精心设计的提议和接受规则，使长时间采样能够代表目标平衡分布。",
          ],
          formula:
            "P(C)=\\frac{e^{-E(C)/(k_BT)}}{Z},\\qquad\\langle A\\rangle=\\sum_C P(C)A(C)",
          symbols: [
            {
              symbol: "C",
              meaning: "一个完整的微观构型，例如整个晶格的自旋排布。",
            },
            {
              symbol: "Z",
              meaning: "所有构型 Boltzmann 因子的总和，即配分函数。",
            },
            {
              symbol: "\\langle A\\rangle",
              meaning: "物理量 A 在目标平衡分布下的平均值。",
            },
          ],
        },
        {
          title: "为什么升高能量的移动有时也要接受？",
          paragraphs: [
            "对称提议下，从旧状态到新状态的平衡概率比只取决于能量差 $\\Delta E$，未知的配分函数会约掉。Metropolis 规则总是接受降低能量的移动，并以 $\\exp[-\\Delta E/(k_BT)]$ 的概率接受升高能量的移动。后者让体系能够跨过局部能垒，保留有限温度涨落，而不只是贪心地向最低能状态下降。",
            "对于方格 Ising 模型，每个自旋只与四个近邻相互作用。翻转一个自旋时，只有它连接的四条键和外场项改变，因此无需重算所有能量。若提议概率并不对称，接受率还必须包含正反向提议概率之比；简单的 Metropolis 形式不能原样套用。",
          ],
          formula:
            "\\begin{aligned}E&=-J\\sum_{\\langle ij\\rangle}s_is_j-h\\sum_i s_i\\\\\\Delta E&=2s_i\\left(J\\sum_{j\\in\\mathrm{nn}(i)}s_j+h\\right)\\\\A(C\\to C^\\prime)&=\\min\\!\\left\\{1,e^{-\\Delta E/(k_BT)}\\right\\}\\end{aligned}",
          symbols: [
            {
              symbol: "s_i=\\pm1",
              meaning: "晶格位点 $i$ 的二态自旋。",
            },
            {
              symbol: "J>0,\\ h",
              meaning: "使相邻自旋倾向同向的耦合能，以及外场能量系数。",
            },
            {
              symbol: "\\sum_{\\langle ij\\rangle}",
              meaning:
                "每对近邻只计一次；$\\sum_{j\\in\\mathrm{nn}(i)}$ 只遍历被翻转自旋的近邻。",
            },
          ],
        },
        {
          title: "看见有序结构之后，还要检查什么？",
          paragraphs: [
            "初始构型通常不在平衡分布中，需要先丢弃一段平衡化过程，再统计观测量。相邻样本往往相关，连续得到一千张几乎相同的构型，并不等于一千个独立样本。可以检查分块平均、不同初态与不同随机种子，以判断统计结果是否稳定；临界点附近的慢涨落尤其容易造成误判。",
            "无限大、零外场的二维正方晶格 Ising 模型有精确临界温度 $\\frac{k_BT_c}{J}=\\frac2{\\ln(1+\\sqrt2)}\\approx2.269$。本章有限晶格只能呈现被尺寸和采样长度平滑后的转变，不能把某次短动画读作精确临界点。常规 Metropolis 扫描次数也不是秒；若要描述已知事件率驱动的真实时间演化，应转向动力学 Monte Carlo 等方法。",
          ],
          formula: "m=\\frac1N\\sum_i s_i,\\qquad -1\\le m\\le1",
          symbols: [
            {
              symbol: "m",
              meaning: "每个自旋的平均磁化强度，范围为 $-1$ 到 1。",
            },
            {
              symbol: "\\mathrm{sweep}",
              meaning:
                "一次扫描约尝试 $N$ 次翻转，是采样工作量单位，通常不具有真实时间单位。",
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
          "取中心自旋 $s_i=+1$，四个近邻中三个为 $+1$、一个为 $-1$，$h=0$，温度 $k_BT=2J$。",
        steps: [
          "近邻自旋和为 $3(+1)+(-1)=2$。",
          "翻转的能量变化为 $\\Delta E=2(+1)J(2)=4J$，属于升能移动。",
          "接受概率为 $\\exp[-4J/(2J)]=e^{-2}\\approx0.1353$，即约 13.5%。",
          "抽取 $[0,1)$ 上均匀随机数 $u$：若 $u=0.10$ 则接受，若 $u=0.40$ 则拒绝；被拒绝时构型保持不变，也计入采样过程。",
        ],
        result:
          "相同提议可以有不同结果，但大量尝试的统计必须遵守正确接受率。若四个近邻都为 $+1$，则 $\\Delta E=8J$，在相同温度下接受率降至约 1.83%。",
      },
      pitfalls: [
        "把 Monte Carlo 扫描数直接换算为秒，或把随机采样轨迹当成粒子的真实运动。",
        "只接受降能移动却仍称之为有限温度平衡采样；这会丢失应有的热涨落。",
        "用一次短运行确定临界温度，或忽略平衡化、相关时间和有限尺寸对统计结果的影响。",
      ],
      question: {
        prompt:
          "一个自旋翻转使能量降低 $2J$。温度降低时，这个翻转在标准 Metropolis 算法中的接受概率会下降吗？",
        answer:
          "不会。在对称提议的 Metropolis 规则中，$\\Delta E<0$ 的移动总是接受。温度主要改变升能移动的接受概率；低温下更难接受升能移动，但仍需要足够采样以检查是否达到平衡。",
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
          "接受率 $\\min\\{1,\\exp[-\\Delta E/(k_BT)]\\}$",
        ],
      },
      derivation: {
        title: "从一次翻转，到平衡采样与非对称提议",
        introduction:
          "从两个自旋的能量差开始，先推导对称提议的 Metropolis 接受率，再把局部更新推广到整张晶格，最后扩展到非对称提议的 Metropolis–Hastings 规则。",
        stages: [
          {
            level: "simple",
            title: "简单情形：两个耦合自旋的一次翻转",
            assumptions: [
              "两个自旋 $s_1,s_2=\\pm1$，能量 $E=-Js_1s_2$，其中 $J>0$；温度 $T>0$。",
              "正向与反向翻转具有相同提议概率；目标是正则平衡分布，不是真实时间轨迹。",
            ],
            steps: [
              {
                explanation:
                  "只翻转第一个自旋，相互作用项变号，因此能量差只取决于原来是否同向。",
                formula:
                  "E(C)=-Js_1s_2,\\quad E(C^\\prime)=+Js_1s_2,\\quad\\Delta E=2Js_1s_2",
              },
              {
                explanation:
                  "写出两个构型的平衡概率之比，未知的配分函数约掉。这就是无需枚举所有状态也能决定局部接受率的关键。",
                formula:
                  "\\frac{\\pi(C^\\prime)}{\\pi(C)}=\\frac{e^{-E(C^\\prime)/(k_BT)}/Z}{e^{-E(C)/(k_BT)}/Z}=e^{-\\Delta E/(k_BT)}",
              },
              {
                explanation:
                  "要求正反向概率流相等，并利用对称提议，选择满足这一比值且不超过一的接受率。",
                formula:
                  "\\begin{aligned}\\pi(C)A(C\\to C^\\prime)&=\\pi(C^\\prime)A(C^\\prime\\to C)\\\\A(C\\to C^\\prime)&=\\min\\{1,e^{-\\Delta E/(k_BT)}\\}\\end{aligned}",
              },
            ],
            conclusion:
              "同向变反向时 $\\Delta E=2J$，接受率是 $e^{-2J/(k_BT)}$；反向变同向总是接受。允许升能移动才能保留有限温度涨落。",
          },
          {
            level: "general",
            title: "一般情形：方格晶格上的局部更新",
            assumptions: [
              "最近邻 Ising 模型，耦合 $J$、外场能量系数 $h$；每次随机选择一个位点。",
              "每条键在总能量中只计一次，边界条件在计算近邻时一致处理。",
            ],
            steps: [
              {
                explanation:
                  "把总能量分成与被选自旋有关的局部项和完全不变的其余项。只有前者需要重算。",
                formula:
                  "E=E_{\\mathrm{rest}}-s_i\\left(J\\sum_{j\\in\\mathrm{nn}(i)}s_j+h\\right)",
              },
              {
                explanation:
                  "翻转后局部项变号，相减得到局部能量差。代入前一阶段的接受规则即可更新整个体系。",
                formula:
                  "\\Delta E=2s_i\\left(J\\sum_{j\\in\\mathrm{nn}(i)}s_j+h\\right),\\qquad s_i^\\prime=\\begin{cases}-s_i,&u<A\\\\s_i,&u\\ge A\\end{cases}",
              },
              {
                explanation:
                  "通过平衡化后的构型估计系综平均；相邻样本相关时，独立信息量少于样本总数。",
                formula:
                  "\\overline A=\\frac1M\\sum_{k=1}^M A(C_k),\\qquad\\operatorname{Var}(\\overline A)\\simeq\\frac{2\\tau_{\\mathrm{int}}}{M}\\operatorname{Var}(A),\\qquad\\tau_{\\mathrm{int}}=\\frac12+\\sum_{\\ell\\ge1}\\rho(\\ell)",
              },
            ],
            conclusion:
              "局部计算降低了每次更新的代价，但不能消除临界慢化或有限尺寸误差。这里相关时间的单位是采样步，不是秒。",
          },
          {
            level: "extension",
            title: "扩展：提议不对称时必须修正接受率",
            assumptions: [
              "在离散或连续构型空间中选择提议概率或概率密度 $q(C^\\prime|C)$，目标密度为 $\\pi(C)$。",
              "可接受的移动需要有反向路径，并应检查遍历性；密度都相对于相同基准测度定义。",
            ],
            steps: [
              {
                explanation:
                  "概率流现在包含提议概率。若正反向提议不一样，只比较能量差会破坏平衡。",
                formula:
                  "\\pi(C)q(C^\\prime|C)A(C\\to C^\\prime)=\\pi(C^\\prime)q(C|C^\\prime)A(C^\\prime\\to C)",
              },
              {
                explanation:
                  "将目标密度比和提议密度比一起放入接受率，得到通用的 Metropolis–Hastings 形式。对称提议只是它的特例。",
                formula:
                  "A(C\\to C^\\prime)=\\min\\!\\left\\{1,\\frac{\\pi(C^\\prime)q(C|C^\\prime)}{\\pi(C)q(C^\\prime|C)}\\right\\}",
              },
              {
                explanation:
                  "例如两个状态能量相等，但向新状态的提议概率比反向大一倍，前向接受率必须减半，才能恢复等概率平衡。",
                formula:
                  "\\pi(A)=\\pi(B),\\quad q(B|A)=\\frac12,\\quad q(A|B)=\\frac14\\quad\\Rightarrow\\quad A(A\\to B)=\\frac12,\\quad A(B\\to A)=1",
              },
            ],
            conclusion:
              "这个扩展允许设计偏置移动、连续粒子位移和更高效提议，但需要同步维护正确接受率。改变采样规则仍不自动赋予算法真实时间；事件率动力学需要另行建模。",
          },
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
            "Enumerating all configurations is usually impossible: $N$ two-state Ising spins already have $2^N$ possible states. Monte Carlo constructs a random walk whose visit frequencies represent the required probabilities. This is not arbitrary randomness. Carefully chosen proposals and acceptance rules make a sufficiently sampled trajectory represent a target equilibrium distribution.",
          ],
          formula:
            "P(C)=\\frac{e^{-E(C)/(k_BT)}}{Z},\\qquad\\langle A\\rangle=\\sum_C P(C)A(C)",
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
              symbol: "\\langle A\\rangle",
              meaning:
                "The equilibrium expectation of observable A under the target distribution.",
            },
          ],
        },
        {
          title: "Why sometimes accept a move that raises energy?",
          paragraphs: [
            "For symmetric proposals, the ratio of equilibrium probabilities for new and old states depends only on $\\Delta E$: the unknown partition function cancels. Metropolis always accepts a decrease in energy and accepts an increase with probability $\\exp[-\\Delta E/(k_BT)]$. Uphill moves allow thermal fluctuations and escape from local barriers, instead of merely performing a greedy search for an energy minimum.",
            "Each spin in a square Ising lattice interacts with four nearest neighbors. Flipping one spin changes only its four incident bonds and its field contribution, so a complete energy recalculation is unnecessary. If forward and reverse proposal probabilities differ, the acceptance rule must include their ratio. The simple Metropolis expression is not valid unchanged for arbitrary asymmetric proposals.",
          ],
          formula:
            "\\begin{aligned}E&=-J\\sum_{\\langle ij\\rangle}s_is_j-h\\sum_i s_i\\\\\\Delta E&=2s_i\\left(J\\sum_{j\\in\\mathrm{nn}(i)}s_j+h\\right)\\\\A(C\\to C^\\prime)&=\\min\\!\\left\\{1,e^{-\\Delta E/(k_BT)}\\right\\}\\end{aligned}",
          symbols: [
            {
              symbol: "s_i=\\pm1",
              meaning: "The two-state spin at lattice site $i$.",
            },
            {
              symbol: "J>0,\\ h",
              meaning:
                "The coupling energy favoring aligned neighbors and the external-field energy coefficient.",
            },
            {
              symbol: "\\sum_{\\langle ij\\rangle}",
              meaning:
                "Count each neighboring pair once; $\\sum_{j\\in\\mathrm{nn}(i)}$ includes only the neighbors of the selected spin.",
            },
          ],
        },
        {
          title: "What should you check after seeing ordered domains?",
          paragraphs: [
            "The initial configuration generally does not represent equilibrium. Discard an equilibration interval before measuring observables. Successive samples are often correlated: a thousand almost identical snapshots are not a thousand independent measurements. Block averages, different initial states, and different random seeds help assess stability. Slow fluctuations near a critical point make premature conclusions especially easy.",
            "For the infinite, zero-field, nearest-neighbor square-lattice Ising model, the exact critical temperature is $\\frac{k_BT_c}{J}=\\frac2{\\ln(1+\\sqrt2)}\\approx2.269$. A finite lattice shows a rounded transition shaped by size and sampling length, so a short animation cannot identify an exact critical point. Ordinary Metropolis sweeps are not seconds. Physical-time evolution based on known event rates instead calls for methods such as kinetic Monte Carlo.",
          ],
          formula: "m=\\frac1N\\sum_i s_i,\\qquad -1\\le m\\le1",
          symbols: [
            {
              symbol: "m",
              meaning: "Magnetization per spin, ranging from $-1$ to 1.",
            },
            {
              symbol: "\\mathrm{sweep}",
              meaning:
                "One sweep attempts approximately $N$ flips; it measures sampling effort, generally not physical time.",
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
          "Let the central spin be $+1$, with three $+1$ neighbors and one $-1$ neighbor. Set $h=0$ and $k_BT=2J$.",
        steps: [
          "The neighboring spins sum to $3(+1)+(-1)=2$.",
          "The flip changes energy by $\\Delta E=2(+1)J(2)=4J$, so this is an uphill move.",
          "Its acceptance probability is $\\exp[-4J/(2J)]=e^{-2}\\approx0.1353$, or about 13.5%.",
          "Draw $u$ uniformly from $[0,1)$: accept if $u=0.10$, reject if $u=0.40$. A rejected proposal leaves the configuration unchanged but is still part of the sampling process.",
        ],
        result:
          "Identical proposals can have different individual outcomes, but their statistics must follow the correct acceptance rate. With four $+1$ neighbors, $\\Delta E$ becomes $8J$ and the acceptance probability at the same temperature drops to about 1.83%.",
      },
      pitfalls: [
        "Converting ordinary Monte Carlo sweep counts directly into seconds or treating a sampling path as a physical particle trajectory.",
        "Accepting only energy-lowering moves while claiming finite-temperature equilibrium sampling, thereby removing necessary thermal fluctuations.",
        "Inferring a critical temperature from one short run while ignoring equilibration, correlation times, and finite-size effects.",
      ],
      question: {
        prompt:
          "A proposed spin flip lowers energy by $2J$. Does cooling reduce its acceptance probability in standard Metropolis sampling?",
        answer:
          "No. With symmetric proposals, Metropolis always accepts moves with $\\Delta E<0$. Temperature changes the acceptance of uphill moves. Cooling makes those moves less likely, but adequate sampling is still needed to establish equilibrium.",
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
          "Accept: $\\min\\{1,\\exp[-\\Delta E/(k_BT)]\\}$",
        ],
      },
      derivation: {
        title: "From one flip to equilibrium sampling and asymmetric proposals",
        introduction:
          "Start with the energy difference for two spins. Derive Metropolis acceptance for symmetric proposals, extend local updates to a lattice, and then generalize to asymmetric proposals through Metropolis–Hastings.",
        stages: [
          {
            level: "simple",
            title: "Simple case: flipping one of two coupled spins",
            assumptions: [
              "Two spins $s_1,s_2=\\pm1$ have energy $E=-Js_1s_2$ with $J>0$ at temperature $T>0$.",
              "Forward and reverse flips are proposed equally often. The target is canonical equilibrium, not a physical-time trajectory.",
            ],
            steps: [
              {
                explanation:
                  "Flip only the first spin. Its interaction term changes sign, so the energy difference depends on whether the pair was aligned.",
                formula:
                  "E(C)=-Js_1s_2,\\quad E(C^\\prime)=+Js_1s_2,\\quad\\Delta E=2Js_1s_2",
              },
              {
                explanation:
                  "Take the equilibrium probability ratio. The unknown partition function cancels, allowing a local acceptance decision without enumerating every state.",
                formula:
                  "\\frac{\\pi(C^\\prime)}{\\pi(C)}=\\frac{e^{-E(C^\\prime)/(k_BT)}/Z}{e^{-E(C)/(k_BT)}/Z}=e^{-\\Delta E/(k_BT)}",
              },
              {
                explanation:
                  "Require equal forward and reverse probability flux. With symmetric proposals, choose acceptance probabilities that satisfy the ratio and never exceed one.",
                formula:
                  "\\begin{aligned}\\pi(C)A(C\\to C^\\prime)&=\\pi(C^\\prime)A(C^\\prime\\to C)\\\\A(C\\to C^\\prime)&=\\min\\{1,e^{-\\Delta E/(k_BT)}\\}\\end{aligned}",
              },
            ],
            conclusion:
              "For aligned-to-antialigned flips, $\\Delta E=2J$ and acceptance is $e^{-2J/(k_BT)}$; the reverse move is always accepted. Uphill moves are essential to finite-temperature fluctuations.",
          },
          {
            level: "general",
            title: "General case: local updates on a square lattice",
            assumptions: [
              "Use nearest-neighbor Ising coupling $J$ and field-energy coefficient $h$, choosing one site at random per attempt.",
              "Count each bond once in total energy and apply boundary conditions consistently to the neighbor list.",
            ],
            steps: [
              {
                explanation:
                  "Separate total energy into a local contribution involving the selected spin and an unchanged remainder. Only the local contribution needs updating.",
                formula:
                  "E=E_{\\mathrm{rest}}-s_i\\left(J\\sum_{j\\in\\mathrm{nn}(i)}s_j+h\\right)",
              },
              {
                explanation:
                  "The local term changes sign on flipping. Subtracting old from new gives a local energy difference, which plugs directly into the acceptance rule derived above.",
                formula:
                  "\\Delta E=2s_i\\left(J\\sum_{j\\in\\mathrm{nn}(i)}s_j+h\\right),\\qquad s_i^\\prime=\\begin{cases}-s_i,&u<A\\\\s_i,&u\\ge A\\end{cases}",
              },
              {
                explanation:
                  "Estimate ensemble averages after equilibration. Correlated consecutive samples contain fewer independent observations than their raw count suggests.",
                formula:
                  "\\overline A=\\frac1M\\sum_{k=1}^M A(C_k),\\qquad\\operatorname{Var}(\\overline A)\\simeq\\frac{2\\tau_{\\mathrm{int}}}{M}\\operatorname{Var}(A),\\qquad\\tau_{\\mathrm{int}}=\\frac12+\\sum_{\\ell\\ge1}\\rho(\\ell)",
              },
            ],
            conclusion:
              "Local calculations reduce update cost but do not remove critical slowing down or finite-size error. Correlation time here is measured in sampling steps, not seconds.",
          },
          {
            level: "extension",
            title: "Extension: correcting asymmetric proposals",
            assumptions: [
              "Choose a proposal probability or density $q(C^\\prime|C)$ in discrete or continuous configuration space, targeting $\\pi(C)$.",
              "Accepted moves need a reverse path, and ergodicity must be checked. Densities must refer to a consistent base measure.",
            ],
            steps: [
              {
                explanation:
                  "Probability flux now explicitly includes the proposal. If forward and reverse proposals differ, an energy-only acceptance rule generally breaks balance.",
                formula:
                  "\\pi(C)q(C^\\prime|C)A(C\\to C^\\prime)=\\pi(C^\\prime)q(C|C^\\prime)A(C^\\prime\\to C)",
              },
              {
                explanation:
                  "Combine the target-density and proposal-density ratios to obtain Metropolis–Hastings. Symmetric proposals are its special case.",
                formula:
                  "A(C\\to C^\\prime)=\\min\\!\\left\\{1,\\frac{\\pi(C^\\prime)q(C|C^\\prime)}{\\pi(C)q(C^\\prime|C)}\\right\\}",
              },
              {
                explanation:
                  "For example, if two states have equal energy but the forward proposal is twice as likely as the reverse, forward acceptance must be halved to recover equal equilibrium weights.",
                formula:
                  "\\pi(A)=\\pi(B),\\quad q(B|A)=\\frac12,\\quad q(A|B)=\\frac14\\quad\\Rightarrow\\quad A(A\\to B)=\\frac12,\\quad A(B\\to A)=1",
              },
            ],
            conclusion:
              "This extension supports biased moves, continuous particle displacements, and more efficient proposals while preserving the required acceptance correction. Changing sampling moves still does not create physical time; rate-based dynamics requires a separate model.",
          },
        ],
      },
    },
  },
};
