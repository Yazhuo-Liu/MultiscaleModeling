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
            "围绕理想晶体走一个闭合的晶格回路，再沿同样的步数绕过位错，回路会出现闭合差。Burgers 矢量 $b$ 描述这个差，也刻画位错扫过后留下的晶格滑移。它是晶体学信息，不是位错当前的运动速度或线段长度。",
          ],
          formula: "\\dot{\\gamma}=\\rho_{\\mathrm m}b\\bar v",
          symbols: [
            {
              symbol: "\\dot\\gamma",
              meaning:
                "简单单滑移条件下的塑性剪切应变率，单位 $\\mathrm{s^{-1}}$。",
            },
            {
              symbol: "\\rho_{\\mathrm m}",
              meaning: "可动位错线总长度除以体积，单位 $\\mathrm{m^{-2}}$。",
            },
            {
              symbol: "b",
              meaning: "Burgers 矢量的模，单位 $\\mathrm m$。",
            },
            {
              symbol: "\\bar v",
              meaning: "可动位错的平均滑移速度，单位 $\\mathrm{m/s}$。",
            },
          ],
        },
        {
          title: "应力推动，线张力拉回",
          paragraphs: [
            "位错在应力场中的单位长度受力由 Peach–Koehler 关系给出。对合适取向的单一滑移系，剪应力 $\\tau$ 产生的驱动力大小为 $\\tau b$。弯曲位错同时增加线长，因此线张力 $\\Gamma$ 倾向于拉直位错；曲率越大，回复力通常越大。",
            "在低惯性、阻力控制的近似下，可令速度与合力成正比。对于两端固定、只允许沿 $y$ 方向移动且斜率较小的位错，曲率约为 $\\frac{\\partial^2y}{\\partial x^2}$，得到一条受恒定载荷的弦方程。这里既忽略非局部弹性相互作用，也不包含位错相交、攀移和成核。",
          ],
          formula:
            "\\begin{aligned}\\mathbf f_{\\mathrm{PK}}&=(\\boldsymbol\\sigma\\cdot\\mathbf b)\\times\\boldsymbol\\xi\\\\B\\frac{\\partial y}{\\partial t}&=\\tau b+\\Gamma\\frac{\\partial^2y}{\\partial x^2}\\end{aligned}",
          symbols: [
            {
              symbol: "\\boldsymbol\\sigma",
              meaning: "应力张量，单位 Pa。",
            },
            {
              symbol: "\\boldsymbol\\xi",
              meaning: "沿位错线的单位切向量。",
            },
            {
              symbol: "\\Gamma",
              meaning: "线张力，单位 N；可理解为单位线长的能量。",
            },
            {
              symbol: "B",
              meaning:
                "拖曳系数，单位 $\\mathrm{Pa\\,s}$；使 $Bv$ 与单位长度的力具有相同单位。",
            },
          ],
        },
        {
          title: "从边界条件得到弓出曲线",
          paragraphs: [
            "当位错停止移动，时间导数变为零。对 $\\Gamma y^{\\prime\\prime}=-\\tau b$ 积分两次，并使用 $y(0)=y(L)=0$，就得到抛物线形的平衡弓出。最大位移出现在中点，随应力线性增加，随钉扎间距的平方增加；这解释了障碍间距为何强烈影响位错运动。",
            "真实的 Frank–Read 源可以在足够应力下继续弯曲并产生位错环。常数线张力的圆弧估计给出临界应力 $\\tau_c\\approx\\frac{2\\Gamma}{bL}$，但此时小斜率假设已经失效。本章的抛物线模型适合研究临界前的回复与弓出，不能从持续增大的挠度推断位错环已经形成。",
          ],
          formula:
            "\\begin{aligned}y(x)&=\\frac{\\tau b}{2\\Gamma}x(L-x)\\\\y_{\\max}&=\\frac{\\tau bL^2}{8\\Gamma}\\end{aligned}",
          symbols: [
            {
              symbol: "L",
              meaning: "两钉扎点之间的距离。",
            },
            {
              symbol: "y_{\\max}",
              meaning: "位错中点的最大静态挠度；公式要求小斜率。",
            },
            {
              symbol: "\\tau_c",
              meaning:
                "完整圆弧线张力估计中的临界应力，不是此小斜率模型的分岔点。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一段 100 nm 位错会弯出多少？",
        given:
          "取 $L=100\\,\\mathrm{nm}$、$b=0.25\\,\\mathrm{nm}$、$\\Gamma=1\\,\\mathrm{nN}$，施加 $\\tau=10\\,\\mathrm{MPa}$，位错两端固定。",
        steps: [
          "统一为 SI 单位：$L=10^{-7}\\,\\mathrm m$，$b=2.5\\times10^{-10}\\,\\mathrm m$，$\\Gamma=10^{-9}\\,\\mathrm N$，$\\tau=10^7\\,\\mathrm{Pa}$。",
          "单位长度驱动力 $\\tau b=2.5\\times10^{-3}\\,\\mathrm{N/m}$。代入 $y_{\\max}=\\frac{\\tau bL^2}{8\\Gamma}$。",
          "得到 $y_{\\max}=3.125\\times10^{-9}\\,\\mathrm m$。最大端点斜率为 $\\frac{\\tau bL}{2\\Gamma}=0.125$，支持小斜率近似。",
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
          "由 $y_{\\max}\\propto\\Gamma^{-1}$ 可知减半。更大的线张力使同样曲率产生更强回复力，因此在更小弯曲下就能平衡驱动力。",
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
      derivation: {
        title: "从一条直线到相互作用的位错网络",
        introduction:
          "先用直位错建立速度与应变率的关系，再把位错位置变成沿线变化的函数，最后看曲线几何与其他位错如何进入同一个受力框架。",
        stages: [
          {
            level: "simple",
            title: "直位错：从单位长度受力到塑性速率",
            assumptions: [
              "单一滑移系，均匀分解剪应力；忽略惯性、障碍和位错间相互作用。",
              "拖曳系数 $B>0$ 恒定，可动位错密度在所考察的短时间内不变。",
            ],
            steps: [
              {
                explanation:
                  "取长度为 $l$ 的直线段。应力产生的总滑移力正比于线长，除以线长得到驱动力密度。",
                formula:
                  "F_{\\mathrm{drive}}=\\tau bl\\quad\\Longrightarrow\\quad f_{\\mathrm{drive}}=\\frac{F_{\\mathrm{drive}}}{l}=\\tau b",
              },
              {
                explanation:
                  "低惯性下，驱动力由拖曳力平衡。于是速度和位移可以直接积分；这里的 $Bv$ 是单位长度的力。",
                formula:
                  "Bv=\\tau b\\quad\\Longrightarrow\\quad v=\\frac{\\tau b}{B},\\qquad y(t)=y_0+\\frac{\\tau b}{B}t",
              },
              {
                explanation:
                  "位错线在时间 $\\mathrm dt$ 内扫过面积。扫过面积乘滑移量再除以体积，得到 Orowan 关系。",
                formula:
                  "\\mathrm d\\gamma=\\frac{b(l_{\\mathrm{tot}}v\\,\\mathrm dt)}V\\quad\\Longrightarrow\\quad\\dot\\gamma=\\rho_{\\mathrm m}bv=\\frac{\\rho_{\\mathrm m}b^2\\tau}{B},\\qquad\\rho_{\\mathrm m}=\\frac{l_{\\mathrm{tot}}}V",
              },
            ],
            conclusion:
              "直线模型把应力转换成滑移速度，但没有恢复力，因此不能预测两端钉扎后的弓出。下一步需要让曲率进入受力。",
          },
          {
            level: "general",
            title: "钉扎曲线：从线能变分到抛物线",
            assumptions: [
              "位错由 $y(x,t)$ 描述，$y(0,t)=y(L,t)=0$；要求 $|\\partial_xy|\\ll1$。",
              "线张力 $\\Gamma$、应力和拖曳系数恒定；端点不做功。",
            ],
            steps: [
              {
                explanation:
                  "线长为曲线弧长。对平方根作小斜率展开，再扣除外力做功，得到位置场的势能。",
                formula:
                  "\\Pi[y]=\\Gamma\\!\\int_0^L\\!\\sqrt{1+y_x^2}\\,\\mathrm dx-\\tau b\\!\\int_0^L\\!y\\,\\mathrm dx\\simeq\\Gamma L+\\int_0^L\\!\\left(\\frac\\Gamma2y_x^2-\\tau by\\right)\\mathrm dx",
              },
              {
                explanation:
                  "让曲线发生任意微小扰动，分部积分。固定端点使边界项消失，负变分导数就是单位长度合力。",
                formula:
                  "\\delta\\Pi=\\int_0^L(-\\Gamma y_{xx}-\\tau b)\\,\\delta y\\,\\mathrm dx\\quad\\Longrightarrow\\quad B y_t=-\\frac{\\delta\\Pi}{\\delta y}=\\Gamma y_{xx}+\\tau b",
              },
              {
                explanation:
                  "平衡时令 $y_t=0$，积分两次并依次代入两端边界条件，确定两个积分常数。",
                formula:
                  "\\begin{aligned}y_{xx}&=-\\frac{\\tau b}{\\Gamma},\\qquad y=-\\frac{\\tau b}{2\\Gamma}x^2+C_1x+C_2\\\\y(0)=y(L)&=0\\quad\\Longrightarrow\\quad C_2=0,\\ C_1=\\frac{\\tau bL}{2\\Gamma}\\\\y(x)&=\\frac{\\tau b}{2\\Gamma}x(L-x),\\qquad y_{\\max}=\\frac{\\tau bL^2}{8\\Gamma}\\end{aligned}",
              },
            ],
            conclusion:
              "边界条件使直线自由运动变为有限的弓出。结果随 $L^2$ 增长；若端点斜率不再小，就要换用完整曲线几何。",
          },
          {
            level: "extension",
            title: "一般曲线与网络：加入几何和内部应力",
            assumptions: [
              "仍采用过阻尼运动；先用各向同性、常数线张力近似。",
              "真实网络还需指定滑移约束、位错芯正则化、结点反应和边界条件。",
            ],
            steps: [
              {
                explanation:
                  "用弧长参数 $s$ 描述一般曲线。切向量沿线的变化给出曲率矢量，线张力于是产生法向回复力。",
                formula:
                  "\\boldsymbol\\xi=\\frac{\\partial\\mathbf r}{\\partial s},\\qquad\\frac{\\partial\\boldsymbol\\xi}{\\partial s}=\\kappa_c\\mathbf n_c,\\qquad\\mathbf f_{\\mathrm{line}}=\\Gamma\\kappa_c\\mathbf n_c",
              },
              {
                explanation:
                  "把外加应力与其他位错的内部应力相加，再用 Peach–Koehler 关系求力。运动率张量应只允许所选机制的运动方向。",
                formula:
                  "\\begin{aligned}\\boldsymbol\\sigma_{\\mathrm{loc}}&=\\boldsymbol\\sigma_{\\mathrm{ext}}+\\sum_{j\\ne i}\\boldsymbol\\sigma_j\\\\\\dot{\\mathbf r}_i&=\\mathsf M_i\\!\\left[(\\boldsymbol\\sigma_{\\mathrm{loc}}\\cdot\\mathbf b_i)\\times\\boldsymbol\\xi_i+\\Gamma_i\\kappa_{c,i}\\mathbf n_{c,i}\\right]\\end{aligned}",
              },
              {
                explanation:
                  "作为完整曲率的简单应用，圆弧的曲率为 $1/R_c$。当钉扎段达到半圆时，得到 Frank–Read 临界应力的线张力估计。",
                formula:
                  "\\tau b=\\frac{\\Gamma}{R_c},\\qquad R_c=\\frac L2\\quad\\Longrightarrow\\quad\\tau_c\\simeq\\frac{2\\Gamma}{bL}",
              },
            ],
            conclusion:
              "网络形式保留了同一受力思想，却增加了非局部耦合与拓扑变化。自应力与线张力的近似必须一致，不能重复计算同一贡献；产生位错环还需要超越固定拓扑的弓出模型。",
          },
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
            "Draw a closed lattice circuit in a perfect crystal, then follow the same sequence of steps around a dislocation. The resulting closure mismatch defines a Burgers vector $b$. This vector records crystallographic slip information; it is neither the current velocity of the dislocation nor the length of a line segment.",
          ],
          formula: "\\dot{\\gamma}=\\rho_{\\mathrm m}b\\bar v",
          symbols: [
            {
              symbol: "\\dot\\gamma",
              meaning:
                "Plastic shear strain rate for a simple single-slip description, in $\\mathrm{s^{-1}}$.",
            },
            {
              symbol: "\\rho_{\\mathrm m}",
              meaning:
                "Mobile dislocation line length per unit volume, in $\\mathrm{m^{-2}}$.",
            },
            {
              symbol: "b",
              meaning: "Magnitude of the Burgers vector, in $\\mathrm m$.",
            },
            {
              symbol: "\\bar v",
              meaning:
                "Mean glide velocity of the mobile dislocations, in $\\mathrm{m/s}$.",
            },
          ],
        },
        {
          title: "Stress drives the line; tension pulls it back",
          paragraphs: [
            "The Peach–Koehler relation gives the force per unit length on a dislocation in a stress field. For a suitably oriented single slip system, a resolved shear stress $\\tau$ supplies a driving force of magnitude $\\tau b$. Bending also increases line length, so a line tension $\\Gamma$ tends to straighten the dislocation: stronger curvature produces a stronger restoring contribution.",
            "When inertia is negligible and drag controls the motion, velocity is proportional to the net force. For a line pinned at both ends, moving only in the $y$ direction and having small slopes, its curvature is approximately $\\frac{\\partial^2y}{\\partial x^2}$. This gives the equation of a driven, damped string. Nonlocal elastic interactions, junctions, climb, and nucleation are absent from this approximation.",
          ],
          formula:
            "\\begin{aligned}\\mathbf f_{\\mathrm{PK}}&=(\\boldsymbol\\sigma\\cdot\\mathbf b)\\times\\boldsymbol\\xi\\\\B\\frac{\\partial y}{\\partial t}&=\\tau b+\\Gamma\\frac{\\partial^2y}{\\partial x^2}\\end{aligned}",
          symbols: [
            {
              symbol: "\\boldsymbol\\sigma",
              meaning: "Stress tensor, in Pa.",
            },
            {
              symbol: "\\boldsymbol\\xi",
              meaning: "Unit tangent along the dislocation line.",
            },
            {
              symbol: "\\Gamma",
              meaning:
                "Line tension, in N, equivalent to energy per unit length.",
            },
            {
              symbol: "B",
              meaning:
                "Drag coefficient, in $\\mathrm{Pa\\,s}$; $Bv$ has the units of force per unit length.",
            },
          ],
        },
        {
          title: "Boundary conditions determine the bowed shape",
          paragraphs: [
            "At equilibrium the time derivative vanishes. Integrating $\\Gamma y^{\\prime\\prime}=-\\tau b$ twice and imposing $y(0)=y(L)=0$ gives a parabolic profile. The largest displacement occurs at the midpoint. It is proportional to stress and to the square of the pinning distance, showing why obstacle spacing strongly affects dislocation motion.",
            "A real Frank–Read source can keep bowing under sufficient stress and emit a dislocation loop. A circular-arc construction with constant line tension estimates a critical stress $\\tau_c\\approx\\frac{2\\Gamma}{bL}$, but that geometry lies beyond the small-slope assumption. The parabolic model describes bowing and recovery before this regime; a large computed deflection does not mean that a loop has been created.",
          ],
          formula:
            "\\begin{aligned}y(x)&=\\frac{\\tau b}{2\\Gamma}x(L-x)\\\\y_{\\max}&=\\frac{\\tau bL^2}{8\\Gamma}\\end{aligned}",
          symbols: [
            {
              symbol: "L",
              meaning: "Distance between the two pinning obstacles.",
            },
            {
              symbol: "y_{\\max}",
              meaning:
                "Maximum static displacement at the midpoint; the formula assumes small slopes.",
            },
            {
              symbol: "\\tau_c",
              meaning:
                "Critical stress estimated by the full circular-arc line-tension picture, not a bifurcation in this small-slope model.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How far does a 100 nm dislocation segment bow?",
        given:
          "Let $L=100\\,\\mathrm{nm}$, $b=0.25\\,\\mathrm{nm}$, $\\Gamma=1\\,\\mathrm{nN}$, and $\\tau=10\\,\\mathrm{MPa}$, with both ends pinned.",
        steps: [
          "Convert to SI: $L=10^{-7}\\,\\mathrm m$, $b=2.5\\times10^{-10}\\,\\mathrm m$, $\\Gamma=10^{-9}\\,\\mathrm N$, and $\\tau=10^7\\,\\mathrm{Pa}$.",
          "The driving force per unit length is $\\tau b=2.5\\times10^{-3}\\,\\mathrm{N/m}$. Substitute it into $y_{\\max}=\\frac{\\tau bL^2}{8\\Gamma}$.",
          "The result is $y_{\\max}=3.125\\times10^{-9}\\,\\mathrm m$. The largest endpoint slope is $\\frac{\\tau bL}{2\\Gamma}=0.125$, consistent with a small-slope approximation.",
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
          "It halves because $y_{\\max}\\propto\\Gamma^{-1}$. Greater line tension creates a stronger restoring force for the same curvature, so less bowing is needed to balance the drive.",
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
      derivation: {
        title: "From one straight line to an interacting network",
        introduction:
          "Start with the speed and strain rate of a straight dislocation. Then let its position vary along the line, before adding curved geometry and the stress fields of other dislocations.",
        stages: [
          {
            level: "simple",
            title:
              "Straight line: force per length, velocity, and plastic rate",
            assumptions: [
              "One slip system under uniform resolved shear stress; neglect inertia, obstacles, and interactions.",
              "The drag coefficient $B>0$ and mobile dislocation density are constant over the interval considered.",
            ],
            steps: [
              {
                explanation:
                  "For a straight segment of length $l$, the total glide force is proportional to length. Divide by length to obtain the driving force density.",
                formula:
                  "F_{\\mathrm{drive}}=\\tau bl\\quad\\Longrightarrow\\quad f_{\\mathrm{drive}}=\\frac{F_{\\mathrm{drive}}}{l}=\\tau b",
              },
              {
                explanation:
                  "With negligible inertia, drag balances the drive. Velocity is constant and displacement follows by integration; $Bv$ is a force per unit length.",
                formula:
                  "Bv=\\tau b\\quad\\Longrightarrow\\quad v=\\frac{\\tau b}{B},\\qquad y(t)=y_0+\\frac{\\tau b}{B}t",
              },
              {
                explanation:
                  "In time $\\mathrm dt$, dislocation lines sweep an area. Multiply that area by the slip magnitude and divide by volume to obtain the Orowan relation.",
                formula:
                  "\\mathrm d\\gamma=\\frac{b(l_{\\mathrm{tot}}v\\,\\mathrm dt)}V\\quad\\Longrightarrow\\quad\\dot\\gamma=\\rho_{\\mathrm m}bv=\\frac{\\rho_{\\mathrm m}b^2\\tau}{B},\\qquad\\rho_{\\mathrm m}=\\frac{l_{\\mathrm{tot}}}V",
              },
            ],
            conclusion:
              "This straight-line model converts stress into slip speed, but has no restoring force. Pinned bowing requires curvature to enter the force balance.",
          },
          {
            level: "general",
            title: "Pinned line: from an energy variation to a parabola",
            assumptions: [
              "Describe the line by $y(x,t)$ with $y(0,t)=y(L,t)=0$ and $|\\partial_xy|\\ll1$.",
              "Line tension $\\Gamma$, stress, and drag are constant; the fixed endpoints do no work.",
            ],
            steps: [
              {
                explanation:
                  "Expand the arc-length square root for small slopes, then subtract the work of the applied load to form the potential energy.",
                formula:
                  "\\Pi[y]=\\Gamma\\!\\int_0^L\\!\\sqrt{1+y_x^2}\\,\\mathrm dx-\\tau b\\!\\int_0^L\\!y\\,\\mathrm dx\\simeq\\Gamma L+\\int_0^L\\!\\left(\\frac\\Gamma2y_x^2-\\tau by\\right)\\mathrm dx",
              },
              {
                explanation:
                  "Perturb the line and integrate by parts. Fixed endpoints remove the boundary term; the negative variational derivative is the net force per length.",
                formula:
                  "\\delta\\Pi=\\int_0^L(-\\Gamma y_{xx}-\\tau b)\\,\\delta y\\,\\mathrm dx\\quad\\Longrightarrow\\quad B y_t=-\\frac{\\delta\\Pi}{\\delta y}=\\Gamma y_{xx}+\\tau b",
              },
              {
                explanation:
                  "At equilibrium set $y_t=0$, integrate twice, and use the two endpoint conditions to determine both integration constants.",
                formula:
                  "\\begin{aligned}y_{xx}&=-\\frac{\\tau b}{\\Gamma},\\qquad y=-\\frac{\\tau b}{2\\Gamma}x^2+C_1x+C_2\\\\y(0)=y(L)&=0\\quad\\Longrightarrow\\quad C_2=0,\\ C_1=\\frac{\\tau bL}{2\\Gamma}\\\\y(x)&=\\frac{\\tau b}{2\\Gamma}x(L-x),\\qquad y_{\\max}=\\frac{\\tau bL^2}{8\\Gamma}\\end{aligned}",
              },
            ],
            conclusion:
              "Boundary conditions turn unbounded translation into finite bowing. The result grows as $L^2$; large endpoint slopes require the full curved geometry.",
          },
          {
            level: "extension",
            title: "Curves and networks: add geometry and internal stress",
            assumptions: [
              "Motion remains overdamped; first use an isotropic constant-line-tension approximation.",
              "A real network also requires glide constraints, core regularization, junction reactions, and boundary conditions.",
            ],
            steps: [
              {
                explanation:
                  "Parameterize a general curve by arc length $s$. The change in tangent gives the curvature vector, so line tension provides a normal restoring force.",
                formula:
                  "\\boldsymbol\\xi=\\frac{\\partial\\mathbf r}{\\partial s},\\qquad\\frac{\\partial\\boldsymbol\\xi}{\\partial s}=\\kappa_c\\mathbf n_c,\\qquad\\mathbf f_{\\mathrm{line}}=\\Gamma\\kappa_c\\mathbf n_c",
              },
              {
                explanation:
                  "Add applied stress and the stresses of other dislocations, then evaluate the Peach–Koehler force. A mobility tensor restricts motion to the mechanisms being modeled.",
                formula:
                  "\\begin{aligned}\\boldsymbol\\sigma_{\\mathrm{loc}}&=\\boldsymbol\\sigma_{\\mathrm{ext}}+\\sum_{j\\ne i}\\boldsymbol\\sigma_j\\\\\\dot{\\mathbf r}_i&=\\mathsf M_i\\!\\left[(\\boldsymbol\\sigma_{\\mathrm{loc}}\\cdot\\mathbf b_i)\\times\\boldsymbol\\xi_i+\\Gamma_i\\kappa_{c,i}\\mathbf n_{c,i}\\right]\\end{aligned}",
              },
              {
                explanation:
                  "As a simple full-curvature application, a circular arc has curvature $1/R_c$. When a pinned arc becomes a semicircle, this gives the line-tension estimate for the Frank–Read critical stress.",
                formula:
                  "\\tau b=\\frac{\\Gamma}{R_c},\\qquad R_c=\\frac L2\\quad\\Longrightarrow\\quad\\tau_c\\simeq\\frac{2\\Gamma}{bL}",
              },
            ],
            conclusion:
              "The force-balance idea survives, but nonlocal coupling and topology changes enter. The self-stress and line-tension approximations must be consistent to avoid double counting; emitting a loop requires more than a fixed-topology bowing model.",
          },
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
          formula:
            "r_i=\\nu_i\\exp\\!\\left(-\\frac{E_i}{k_{\\mathrm B}T}\\right)",
          symbols: [
            {
              symbol: "r_i",
              meaning: "事件 i 的发生速率，单位 $\\mathrm{s^{-1}}$。",
            },
            {
              symbol: "\\nu_i",
              meaning: "尝试频率或有效速率前因子，单位 $\\mathrm{s^{-1}}$。",
            },
            {
              symbol: "E_i",
              meaning: "相对于当前状态的迁移能垒；本例用 eV。",
            },
            {
              symbol: "k_{\\mathrm B}",
              meaning:
                "Boltzmann 常数，采用 eV 时为 $8.61733\\times10^{-5}\\,\\mathrm{eV/K}$。",
            },
            {
              symbol: "T",
              meaning: "绝对温度，单位 K。",
            },
          ],
        },
        {
          title: "两次抽样：哪个事件，等多久？",
          paragraphs: [
            "若当前有多个可能事件，总离开速率为 $R=\\sum_i r_i$。系统等待时间的生存概率满足 $S(t)=\\exp(-Rt)$，对均匀随机数求逆就得到指数分布的时间增量。等待时间不是固定步长，也不是简单给每一次跳跃加上同样的时间。",
            "再用另一个独立随机数按 $\\frac{r_i}{R}$ 选择事件：累积速率越宽的区间，被选中的概率越大。执行事件后，构型可能改变，因此相关事件与速率也要重新计算。四个完全等价邻居的空位模型才允许始终等概率选择四个方向。",
          ],
          formula:
            "\\begin{aligned}R&=\\sum_i r_i,&P(i)&=\\frac{r_i}{R}\\\\\\Delta t&=-\\frac{\\ln u}{R},&0&<u<1\\end{aligned}",
          symbols: [
            {
              symbol: "R",
              meaning: "当前所有可发生事件的总速率，单位 $\\mathrm{s^{-1}}$。",
            },
            {
              symbol: "u",
              meaning: "用于抽取等待时间的均匀随机数。",
            },
            {
              symbol: "\\Delta t",
              meaning: "本次事件发生前经过的物理时间。",
            },
          ],
        },
        {
          title: "从跳跃统计得到扩散",
          paragraphs: [
            "对二维正方晶格的无偏随机游走，若每个方向的速率都为 $r$、步长为 a，则总跳跃速率是 $4r$。独立跳跃给出 $\\langle|\\Delta\\mathbf x|^2\\rangle=4Dt$，同时 $D=ra^2$。这里的 $r$ 是单方向速率；若用总速率 $R$，则应写成 $D=\\frac{Ra^2}{4}$。",
            "一条轨迹的位移平方会忽大忽小，并不是平滑的扩散曲线。要估计扩散系数，需要多个独立轨迹或合适的时间平均，并使用未被周期边界折回的位置。若存在势能差，正反速率应与所需平衡分布相容；遗漏低能垒通道会直接扭曲物理时钟。",
          ],
          formula:
            "\\left\\langle|\\Delta\\mathbf x|^2\\right\\rangle=2dDt,\\qquad D=ra^2\\quad(d=2,\\ R=4r)",
          symbols: [
            {
              symbol: "d",
              meaning: "空间维数；本例为 2。",
            },
            {
              symbol: "a",
              meaning: "每次跳跃的距离。",
            },
            {
              symbol: "D",
              meaning:
                "扩散系数，若距离用 $m$、时间用 $s$，则单位为 $\\mathrm{m^2/s}$。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一次空位跳跃要等多少纳秒？",
        given:
          "四个等价方向，$\\nu=10^{12}\\,\\mathrm{s^{-1}}$、$E=0.5\\,\\mathrm{eV}$、$T=600\\,\\mathrm K$，晶格步长 $a=0.25\\,\\mathrm{nm}$。",
        steps: [
          "热能 $k_{\\mathrm B}T\\approx0.05170\\,\\mathrm{eV}$，因此单方向速率 $r\\approx10^{12}\\exp(-0.5/0.05170)=6.31\\times10^7\\,\\mathrm{s^{-1}}$。",
          "总速率 $R=4r\\approx2.525\\times10^8\\,\\mathrm{s^{-1}}$，平均等待时间 $R^{-1}\\approx3.96\\,\\mathrm{ns}$。",
          "若此次抽到 $u=0.5$，则 $\\Delta t=-\\frac{\\ln(0.5)}R\\approx2.75\\,\\mathrm{ns}$；这一次的等待时间不必等于均值。",
          "扩散系数 $D=ra^2\\approx3.95\\times10^{-12}\\,\\mathrm{m^2/s}$；距离单位需要从 nm 转为 $m$ 后平方。",
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
          "概率 $\\frac{r_i}{R}$ 不变，因此在相同随机数下事件顺序不变；平均等待时间 1/$R$ 缩短为原来的十分之一。",
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
      derivation: {
        title: "从一次随机等待到连续扩散",
        introduction:
          "动力学蒙特卡洛的时间不是人为指定的步长。先从离开状态的概率推导物理时钟，再让多个事件竞争，最后把大量离散跳跃连接到扩散方程。",
        stages: [
          {
            level: "simple",
            title: "单一事件：为什么等待时间是指数分布？",
            assumptions: [
              "当前状态只有一个离开事件，恒定速率为 $r>0$。",
              "状态内已局部平衡，等待过程无记忆；当前状态不随等待自行变化。",
            ],
            steps: [
              {
                explanation:
                  "设 $S(t)$ 是等待至少到时间 $t$ 的概率。再生存一个很短的时间段，要乘以这段时间不发生事件的概率。",
                formula:
                  "S(t+\\mathrm dt)=S(t)(1-r\\,\\mathrm dt)+o(\\mathrm dt)\\quad\\Longrightarrow\\quad\\frac{\\mathrm dS}{\\mathrm dt}=-rS",
              },
              {
                explanation:
                  "用初始条件积分。对生存概率取负导数得到等待时间密度，再积分得到均值。",
                formula:
                  "S(0)=1\\quad\\Longrightarrow\\quad S(t)=e^{-rt},\\quad p(t)=re^{-rt},\\quad\\langle t\\rangle=\\int_0^\\infty tre^{-rt}\\,\\mathrm dt=\\frac1r",
              },
              {
                explanation:
                  "对均匀随机数作逆变换。若速率来自热激活，能垒通过指数函数进入等待时间，而不是改变一个任意的播放步长。",
                formula:
                  "u=e^{-r\\Delta t}\\quad\\Longrightarrow\\quad\\Delta t=-\\frac{\\ln u}{r},\\qquad r=\\nu e^{-E/(k_{\\mathrm B}T)},\\qquad0<u<1",
              },
            ],
            conclusion:
              "每次等待时间都不同，但平均值为 $1/r$。这个结论只对等待期间速率恒定且无记忆的当前状态成立。",
          },
          {
            level: "general",
            title: "多个事件：谁先发生，等待多久？",
            assumptions: [
              "当前构型的候选事件速率 $r_i$ 已知且非负，$R=\\sum_i r_i>0$。",
              "事件发生后重新更新受影响的速率；事件选择与等待时间使用独立随机数。",
            ],
            steps: [
              {
                explanation:
                  "短时间内至少一个事件发生的概率是一阶速率之和。所有候选事件都没有发生的生存概率，因此仍服从单一指数律。",
                formula:
                  "R=\\sum_i r_i,\\qquad S(t+\\mathrm dt)=S(t)(1-R\\,\\mathrm dt)+o(\\mathrm dt),\\qquad S(t)=e^{-Rt}",
              },
              {
                explanation:
                  "事件 $i$ 在时间 $t$ 首次发生的联合密度，是此前全部未发生乘上此刻的速率。对时间积分得到事件选择概率。",
                formula:
                  "p(i,t)=r_i e^{-Rt}\\quad\\Longrightarrow\\quad P(i)=\\int_0^\\infty r_i e^{-Rt}\\,\\mathrm dt=\\frac{r_i}{R}",
              },
              {
                explanation:
                  "把概率写成累积速率区间，用一个随机数挑选区间，再用另一个推进时间。两个分布都来自上面同一个联合密度。",
                formula:
                  "\\sum_{j<i}r_j\\le u_1R<\\sum_{j\\le i}r_j,\\qquad\\Delta t=-\\frac{\\ln u_2}{R},\\qquad u_1,u_2\\sim U(0,1)",
              },
            ],
            conclusion:
              "选中事件概率较大，并不意味着给它单独指定一个固定等待时间。若全部速率为零，当前状态是吸收态，不能继续使用对数除以总速率的公式。",
          },
          {
            level: "extension",
            title: "从晶格主方程到扩散方程",
            assumptions: [
              "先取无限或周期的一维均匀晶格，每个左右方向速率同为 $r$，跳距为 $a$。",
              "概率分布在很多晶格间距上缓慢变化；再推广到各向同性 $d$ 维最近邻跳跃。",
            ],
            steps: [
              {
                explanation:
                  "一个格点的概率变化等于相邻格点跳入的概率流减去从该格点跳出的概率流。这个离散守恒式是主方程。",
                formula:
                  "\\frac{\\mathrm dp_j}{\\mathrm dt}=r p_{j-1}+r p_{j+1}-2rp_j=r(p_{j-1}-2p_j+p_{j+1})",
              },
              {
                explanation:
                  "把格点概率写成连续概率密度乘以格距，代入后公共因子 $a$ 消去。对左右邻居作 Taylor 展开，奇数阶导数相消，保留最低非零项得到扩散方程及其系数。",
                formula:
                  "\\begin{aligned}p_j&\\simeq a\\,p(x_j,t)\\\\p(x\\pm a)&=p\\pm a p_x+\\frac{a^2}{2}p_{xx}\\pm\\frac{a^3}{6}p_{xxx}+O(a^4)\\\\\\frac{\\partial p}{\\partial t}&=ra^2\\frac{\\partial^2p}{\\partial x^2}+O(a^4),\\qquad D=ra^2\\end{aligned}",
              },
              {
                explanation:
                  "在 $d$ 维共有 $2d$ 个等价方向。用总跳跃速率与每次跳跃的平方长度，也可独立得到同一个扩散系数。",
                formula:
                  "R=2dr,\\qquad\\langle|\\Delta\\mathbf x|^2\\rangle=Ra^2t=2dDt\\quad\\Longrightarrow\\quad D=\\frac{Ra^2}{2d}=ra^2",
              },
            ],
            conclusion:
              "连续扩散是许多无偏、短程跳跃的长尺度极限。偏置、方向相关速率、陷阱或长跳跃可能引入漂移、扩散张量或非标准输运，不能继续直接套用 $D=ra^2$。",
          },
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
          formula:
            "r_i=\\nu_i\\exp\\!\\left(-\\frac{E_i}{k_{\\mathrm B}T}\\right)",
          symbols: [
            {
              symbol: "r_i",
              meaning: "Rate of event i, in $\\mathrm{s^{-1}}$.",
            },
            {
              symbol: "\\nu_i",
              meaning:
                "Attempt frequency or effective rate prefactor, in $\\mathrm{s^{-1}}$.",
            },
            {
              symbol: "E_i",
              meaning:
                "Migration barrier measured from the current state; expressed here in eV.",
            },
            {
              symbol: "k_{\\mathrm B}",
              meaning:
                "Boltzmann constant, $8.61733\\times10^{-5}\\,\\mathrm{eV/K}$ when energies are in eV.",
            },
            {
              symbol: "T",
              meaning: "Absolute temperature, in K.",
            },
          ],
        },
        {
          title: "Two draws: which event, and how long to wait?",
          paragraphs: [
            "For several available events, the total escape rate is $R=\\sum_i r_i$. The probability of remaining in the state for at least time t is $S(t)=\\exp(-Rt)$. Inverting this exponential distribution gives a random waiting time. It is neither a fixed integration step nor the same increment attached to every jump.",
            "A second, independent random number selects an event with probability $\\frac{r_i}{R}$. An event occupying a wider interval in the cumulative rate distribution is more likely to occur. After the event, the configuration may change, so affected events and rates must be updated. Only the special vacancy model with four equivalent neighbors allows the four directions to remain equally likely at every step.",
          ],
          formula:
            "\\begin{aligned}R&=\\sum_i r_i,&P(i)&=\\frac{r_i}{R}\\\\\\Delta t&=-\\frac{\\ln u}{R},&0&<u<1\\end{aligned}",
          symbols: [
            {
              symbol: "R",
              meaning:
                "Sum of all rates available in the current state, in $\\mathrm{s^{-1}}$.",
            },
            {
              symbol: "u",
              meaning: "Uniform random number used to sample the waiting time.",
            },
            {
              symbol: "\\Delta t",
              meaning:
                "Physical time elapsed before the selected event occurs.",
            },
          ],
        },
        {
          title: "From jump statistics to diffusion",
          paragraphs: [
            "For an unbiased random walk on a square lattice, let a be the jump distance and $r$ the rate in each of four directions. The total jump rate is $4r$. Independent jumps give $\\langle|\\Delta\\mathbf x|^2\\rangle=4Dt$ with $D=ra^2$. Here $r$ is the rate per direction; if the total rate $R$ is used instead, the correct relation is $D=\\frac{Ra^2}{4}$.",
            "The squared displacement of a single path fluctuates rather than tracing a smooth diffusion curve. Estimating diffusivity requires an ensemble of independent paths or an appropriate time average, using positions that are not folded back by periodic boundaries. If states differ in energy, forward and reverse rates must be compatible with the intended equilibrium distribution. Missing a low-barrier pathway directly distorts the physical clock.",
          ],
          formula:
            "\\left\\langle|\\Delta\\mathbf x|^2\\right\\rangle=2dDt,\\qquad D=ra^2\\quad(d=2,\\ R=4r)",
          symbols: [
            {
              symbol: "d",
              meaning: "Spatial dimension; $d=2$ in this example.",
            },
            {
              symbol: "a",
              meaning: "Distance traveled in one lattice jump.",
            },
            {
              symbol: "D",
              meaning:
                "Diffusion coefficient, in $\\mathrm{m^2/s}$ when distances are in $m$ and time in $s$.",
            },
          ],
        },
      ],
      workedExample: {
        title: "How many nanoseconds until a vacancy jumps?",
        given:
          "Take four equivalent directions, $\\nu=10^{12}\\,\\mathrm{s^{-1}}$, $E=0.5\\,\\mathrm{eV}$, $T=600\\,\\mathrm K$, and a lattice spacing $a=0.25\\,\\mathrm{nm}$.",
        steps: [
          "The thermal energy is $k_{\\mathrm B}T\\approx0.05170\\,\\mathrm{eV}$, so the rate in one direction is $r\\approx10^{12}\\exp(-0.5/0.05170)=6.31\\times10^7\\,\\mathrm{s^{-1}}$.",
          "The total rate is $R=4r\\approx2.525\\times10^8\\,\\mathrm{s^{-1}}$. Its reciprocal gives a mean waiting time of about 3.96 ns.",
          "For a particular random draw $u=0.5$, $\\Delta t=-\\frac{\\ln(0.5)}R\\approx2.75\\,\\mathrm{ns}$. An individual waiting time need not equal the mean.",
          "The diffusion coefficient is $D=ra^2\\approx3.95\\times10^{-12}\\,\\mathrm{m^2/s}$. Convert nm to $m$ before squaring the jump length.",
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
          "The ratios $\\frac{r_i}{R}$ are unchanged, so the same random numbers select the same sequence of events. The mean waiting time 1/$R$ becomes ten times shorter.",
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
      derivation: {
        title: "From one random waiting time to continuum diffusion",
        introduction:
          "Kinetic Monte Carlo does not prescribe an arbitrary time step. Derive its clock from escape probabilities, let several events compete, and then connect many discrete jumps to a diffusion equation.",
        stages: [
          {
            level: "simple",
            title: "One event: why is the waiting time exponential?",
            assumptions: [
              "The current state has one escape event with constant rate $r>0$.",
              "The state is locally equilibrated and escape is memoryless; it does not otherwise evolve while waiting.",
            ],
            steps: [
              {
                explanation:
                  "Let $S(t)$ be the probability of surviving without an event until $t$. Surviving a further short interval multiplies it by the no-event probability for that interval.",
                formula:
                  "S(t+\\mathrm dt)=S(t)(1-r\\,\\mathrm dt)+o(\\mathrm dt)\\quad\\Longrightarrow\\quad\\frac{\\mathrm dS}{\\mathrm dt}=-rS",
              },
              {
                explanation:
                  "Integrate using the initial condition. The negative derivative of survival gives the waiting-time density; its first moment gives the mean.",
                formula:
                  "S(0)=1\\quad\\Longrightarrow\\quad S(t)=e^{-rt},\\quad p(t)=re^{-rt},\\quad\\langle t\\rangle=\\int_0^\\infty tre^{-rt}\\,\\mathrm dt=\\frac1r",
              },
              {
                explanation:
                  "Invert the survival law using a uniform random number. For a thermally activated rate, the barrier controls the clock exponentially.",
                formula:
                  "u=e^{-r\\Delta t}\\quad\\Longrightarrow\\quad\\Delta t=-\\frac{\\ln u}{r},\\qquad r=\\nu e^{-E/(k_{\\mathrm B}T)},\\qquad0<u<1",
              },
            ],
            conclusion:
              "Individual waits fluctuate while their mean is $1/r$. This result assumes a memoryless current state whose rate stays constant during the wait.",
          },
          {
            level: "general",
            title: "Competing events: which event happens, and when?",
            assumptions: [
              "Candidate rates $r_i$ are known and nonnegative, with $R=\\sum_i r_i>0$.",
              "Update affected rates after each event; use independent random draws for event identity and waiting time.",
            ],
            steps: [
              {
                explanation:
                  "To first order in a short interval, the probabilities of the candidate events add. The probability that none has occurred therefore follows a single exponential survival law.",
                formula:
                  "R=\\sum_i r_i,\\qquad S(t+\\mathrm dt)=S(t)(1-R\\,\\mathrm dt)+o(\\mathrm dt),\\qquad S(t)=e^{-Rt}",
              },
              {
                explanation:
                  "The joint density for event $i$ to occur first at time $t$ is the survival probability multiplied by its rate. Integrating out time gives the event probability.",
                formula:
                  "p(i,t)=r_i e^{-Rt}\\quad\\Longrightarrow\\quad P(i)=\\int_0^\\infty r_i e^{-Rt}\\,\\mathrm dt=\\frac{r_i}{R}",
              },
              {
                explanation:
                  "Represent the probabilities as cumulative-rate intervals. One draw selects the interval and another advances time; both distributions follow from the same joint density.",
                formula:
                  "\\sum_{j<i}r_j\\le u_1R<\\sum_{j\\le i}r_j,\\qquad\\Delta t=-\\frac{\\ln u_2}{R},\\qquad u_1,u_2\\sim U(0,1)",
              },
            ],
            conclusion:
              "An event with a higher selection probability does not receive its own fixed waiting time. If every rate is zero, the state is absorbing and the logarithm-over-total-rate formula cannot advance the process.",
          },
          {
            level: "extension",
            title: "From a lattice master equation to diffusion",
            assumptions: [
              "Start with an infinite or periodic uniform one-dimensional lattice, rate $r$ in each direction, and spacing $a$.",
              "The probability varies smoothly over many lattice spacings; then generalize to isotropic nearest-neighbor jumps in $d$ dimensions.",
            ],
            steps: [
              {
                explanation:
                  "A site gains probability from its neighbors and loses probability to them. This discrete conservation statement is the master equation.",
                formula:
                  "\\frac{\\mathrm dp_j}{\\mathrm dt}=r p_{j-1}+r p_{j+1}-2rp_j=r(p_{j-1}-2p_j+p_{j+1})",
              },
              {
                explanation:
                  "Write each site probability as a density times spacing; the common factor $a$ cancels. Taylor-expand the two neighbors: odd derivatives cancel, and the leading remaining term gives the diffusion equation and its coefficient.",
                formula:
                  "\\begin{aligned}p_j&\\simeq a\\,p(x_j,t)\\\\p(x\\pm a)&=p\\pm a p_x+\\frac{a^2}{2}p_{xx}\\pm\\frac{a^3}{6}p_{xxx}+O(a^4)\\\\\\frac{\\partial p}{\\partial t}&=ra^2\\frac{\\partial^2p}{\\partial x^2}+O(a^4),\\qquad D=ra^2\\end{aligned}",
              },
              {
                explanation:
                  "In $d$ dimensions there are $2d$ equivalent directions. The total jump rate and squared jump length independently yield the same diffusion coefficient.",
                formula:
                  "R=2dr,\\qquad\\langle|\\Delta\\mathbf x|^2\\rangle=Ra^2t=2dDt\\quad\\Longrightarrow\\quad D=\\frac{Ra^2}{2d}=ra^2",
              },
            ],
            conclusion:
              "Continuum diffusion is the large-scale limit of many unbiased short jumps. Bias, directional rates, trapping, or long jumps may introduce drift, a diffusion tensor, or nonstandard transport; $D=ra^2$ then needs re-derivation.",
          },
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
            "若直接追踪每一条相界面，界面的合并、断裂和复杂形状都会增加几何处理难度。相场方法让一个连续变量 $\\phi$ 在空间中变化：$\\phi\\approx-1$ 和 $\\phi\\approx+1$ 表示两个稳定状态，中间的连续过渡表示界面。$\\phi$ 可以表示结构或取向的有序程度，不一定等于化学成分。",
            "自由能需要同时表达两件事：材料偏好稳定相，而界面本身有代价。双井局部能 $f(\\phi)$ 使 $\\pm1$ 成为能量低谷；梯度能惩罚过于陡峭的变化。二者竞争产生有限厚度界面，而不是随意把边界涂模糊。",
          ],
          formula:
            "F[\\phi]=\\int_\\Omega\\left[\\frac W4(\\phi^2-1)^2+\\frac\\kappa2|\\nabla\\phi|^2\\right]\\,\\mathrm dV",
          symbols: [
            {
              symbol: "\\phi",
              meaning: "无量纲序参量，用于区分两个状态。",
            },
            {
              symbol: "W",
              meaning: "双井势的能量密度尺度，决定偏离稳定相的代价。",
            },
            {
              symbol: "\\kappa",
              meaning: "梯度能系数；与 $W$ 一起决定界面厚度及能量。",
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
            "普通函数沿负梯度下降，相场则沿自由能泛函的负变分导数演化。对局部能求导得到 $W(\\phi^3-\\phi)$；对梯度能进行分部积分，在周期或适当无通量边界下得到 $-\\kappa\\nabla^2\\phi$。它们合在一起给出改变场值的热力学驱动力 $\\mu$。",
            "对不守恒的结构序参量，Allen–Cahn 动力学令 $\\frac{\\partial\\phi}{\\partial t}=-M\\mu$。当 $M>0$ 且没有外部做功时，连续方程满足 $\\frac{\\mathrm dF}{\\mathrm dt}=-\\int_\\Omega M\\mu^2\\,\\mathrm dV\\le0$，因此自由能不会上升。显式数值时间步仍需足够小；一个不稳定离散格式不会因为方程本身耗散就自动正确。",
          ],
          formula:
            "\\begin{aligned}\\mu=\\frac{\\delta F}{\\delta\\phi}&=W(\\phi^3-\\phi)-\\kappa\\nabla^2\\phi\\\\\\frac{\\partial\\phi}{\\partial t}&=-M\\mu\\end{aligned}",
          symbols: [
            {
              symbol: "\\mu",
              meaning:
                "自由能对序参量的变分导数；此处不必解释为某种原子的化学势。",
            },
            {
              symbol: "M",
              meaning: "正的迁移率，连接热力学驱动力与演化速率。",
            },
            {
              symbol: "\\nabla^2\\phi",
              meaning: "场的 Laplace 算子，描述邻域对局部值的影响。",
            },
          ],
        },
        {
          title: "界面宽度、粗化与守恒的区别",
          paragraphs: [
            "对平直、静止的一维界面，令 $\\mu=0$，可以得到 $\\phi(x)=\\tanh\\!\\left(x/\\sqrt{2\\kappa/W}\\right)$。因此宽度参数 $\\ell=\\sqrt{2\\kappa/W}$：提高 $\\kappa$ 会让界面更平缓，提高 $W$ 会把界面压窄。计算时需要足够多的网格点解析这个宽度，不能把网格粗糙造成的变化误判为材料行为。",
            "曲面界面的能量可以通过减少界面面积而降低，小畴因曲率较大往往先消失。但 Allen–Cahn 不保证空间平均 $\\phi$ 守恒。如果 $\\phi$ 实际代表封闭体系中的成分，应使用守恒的 Cahn–Hilliard 形式 $\\frac{\\partial\\phi}{\\partial t}=\\nabla\\cdot(M_c\\nabla\\mu)$。两种方程描述不同物理约束，不能仅因为图案相似就互换。",
          ],
          formula:
            "\\begin{aligned}\\phi_{\\mathrm{eq}}(x)&=\\tanh\\!\\left(\\frac{x}{\\ell}\\right),&\\ell&=\\sqrt{\\frac{2\\kappa}{W}}\\\\\\frac{\\partial\\phi}{\\partial t}&=\\nabla\\cdot(M_c\\nabla\\mu)&&\\text{(conserved field)}\\end{aligned}",
          symbols: [
            {
              symbol: "\\ell",
              meaning:
                "双曲正切剖面的宽度参数；并非任意阈值定义下的完整界面厚度。",
            },
            {
              symbol: "\\phi_{\\mathrm{eq}}",
              meaning: "两端趋向 $\\pm1$ 的平直平衡界面剖面。",
            },
            {
              symbol: "\\int_\\Omega\\phi\\,\\mathrm dV",
              meaning:
                "在无通量或周期边界下，Cahn–Hilliard 保持不变而 Allen–Cahn 一般不保持的总量。",
            },
            {
              symbol: "M_c",
              meaning:
                "守恒动力学的迁移率；其量纲与 Allen–Cahn 迁移率不同，不能直接复用相同数值。",
            },
          ],
        },
      ],
      workedExample: {
        title: "一个均匀区域会向哪一相演化？",
        given:
          "采用约化单位 $W=M=1$，区域内 $\\phi=0.2$ 且空间均匀，因此 $\\nabla^2\\phi=0$。显式步长取 $\\Delta t=0.025$。",
        steps: [
          "局部驱动力 $\\mu=\\phi^3-\\phi=0.008-0.2=-0.192$。",
          "因此 $\\frac{\\partial\\phi}{\\partial t}=-\\mu=+0.192$，场值向 +1 的能量低谷移动。",
          "一次显式更新给出 $\\phi_{\\mathrm{new}}=0.2+0.025\\times0.192=0.2048$。",
          "同时，平衡界面的宽度参数在 $\\kappa=1$ 时为 $\\sqrt2$；若 $\\kappa$ 增至 4、$W$ 不变，宽度参数变为 $2\\sqrt2$。",
        ],
        result:
          "局部势负责把区域推向稳定相，梯度项负责连接不同区域。增大 $\\kappa$ 会拓宽界面；增大 $M$ 主要加快同一自由能景观上的演化。",
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
          "封闭体系的溶质总量必须守恒，而 Allen–Cahn 允许每个位置直接改变场值，通常会改变 $\\int_\\Omega\\phi\\,\\mathrm dV$。对成分场应采用守恒通量形式，例如 Cahn–Hilliard，并设置相应边界条件。",
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
      derivation: {
        title: "从一个数的下降到一个场的演化",
        introduction:
          "先把整个体系压缩成一个均匀序参量，再允许不同位置取不同数值。最后施加守恒约束，亲手看出为什么 Allen–Cahn 与 Cahn–Hilliard 的微分阶数不同。",
        stages: [
          {
            level: "simple",
            title: "均匀区域：双井势中的梯度下降",
            assumptions: [
              "序参量在空间中均匀；没有界面或梯度能。",
              "取 $W>0$、$M>0$，没有外部驱动，序参量不要求守恒。",
            ],
            steps: [
              {
                explanation:
                  "选取在两个相中最低的双井势，对它求导得到局部能量坡度，再求二阶导数区分稳定极小值与不稳定极大值。",
                formula:
                  "f(\\phi)=\\frac W4(\\phi^2-1)^2,\\qquad f^{\\prime}(\\phi)=W(\\phi^3-\\phi),\\qquad f^{\\prime\\prime}(\\pm1)=2W>0,\\quad f^{\\prime\\prime}(0)=-W",
              },
              {
                explanation:
                  "让序参量沿能量的负梯度运动。用链式法则检查能量变化率，而不是仅凭曲线外观判断它是否耗散。",
                formula:
                  "\\dot\\phi=-Mf^{\\prime}(\\phi)\\quad\\Longrightarrow\\quad\\frac{\\mathrm df}{\\mathrm dt}=f^{\\prime}(\\phi)\\dot\\phi=-M[f^{\\prime}(\\phi)]^2\\le0",
              },
              {
                explanation:
                  "在稳定相附近写出微小偏离并线性化。偏离指数衰减，给出局部松弛时间；这比只给出一次数值更新更能解释参数作用。",
                formula:
                  "\\phi=1+\\delta,\\quad |\\delta|\\ll1\\quad\\Longrightarrow\\quad\\dot\\delta\\simeq-2MW\\delta,\\qquad\\delta(t)=\\delta_0e^{-2MWt},\\qquad\\tau_{\\mathrm{relax}}=\\frac1{2MW}",
              },
            ],
            conclusion:
              "这个极简模型解释稳定相与局部松弛，却无法描述相邻区域如何连接。为得到界面，必须加入空间变化的代价。",
          },
          {
            level: "general",
            title: "空间变化：变分导出 Allen–Cahn 方程",
            assumptions: [
              "允许 $\\phi(\\mathbf x,t)$ 随位置变化；$W$ 与 $\\kappa$ 为正常数。",
              "使用周期边界或使分部积分边界项消失的自然边界条件。",
            ],
            steps: [
              {
                explanation:
                  "把局部能与梯度能相加。令场产生任意扰动，保留扰动幅值的一阶项。",
                formula:
                  "F[\\phi]=\\int_\\Omega\\!\\left[f(\\phi)+\\frac\\kappa2|\\nabla\\phi|^2\\right]\\mathrm dV,\\qquad\\delta F=\\int_\\Omega\\!\\left[f^{\\prime}(\\phi)\\delta\\phi+\\kappa\\nabla\\phi\\cdot\\nabla\\delta\\phi\\right]\\mathrm dV",
              },
              {
                explanation:
                  "将扰动的梯度通过分部积分移到原场上。剩余乘在任意扰动前的系数，就是自由能的变分导数。",
                formula:
                  "\\delta F=\\int_\\Omega\\!\\left[f^{\\prime}(\\phi)-\\kappa\\nabla^2\\phi\\right]\\delta\\phi\\,\\mathrm dV\\quad\\Longrightarrow\\quad\\mu\\equiv\\frac{\\delta F}{\\delta\\phi}=W(\\phi^3-\\phi)-\\kappa\\nabla^2\\phi",
              },
              {
                explanation:
                  "沿泛函的负梯度演化。对总自由能应用链式法则，可验证空间耦合后仍满足能量耗散。",
                formula:
                  "\\begin{aligned}\\frac{\\partial\\phi}{\\partial t}&=-M\\mu=M\\left[\\kappa\\nabla^2\\phi-W(\\phi^3-\\phi)\\right]\\\\\\frac{\\mathrm dF}{\\mathrm dt}&=\\int_\\Omega\\mu\\frac{\\partial\\phi}{\\partial t}\\,\\mathrm dV=-\\int_\\Omega M\\mu^2\\,\\mathrm dV\\le0\\end{aligned}",
              },
            ],
            conclusion:
              "梯度项把孤立的局部松弛连接成界面演化。二阶空间导数来自梯度能的变分；总序参量一般不会守恒。",
          },
          {
            level: "extension",
            title: "守恒成分：从通量导出 Cahn–Hilliard 方程",
            assumptions: [
              "现在场变量代表封闭体系中的守恒成分；沿用同一自由能。",
              "边界无物质通量且无自由能边界功，或采用周期边界；迁移率非负。",
            ],
            steps: [
              {
                explanation:
                  "守恒意味着一个区域内的总量只能通过边界通量改变。用散度定理，将积分守恒写成局部连续性方程。",
                formula:
                  "\\frac{\\mathrm d}{\\mathrm dt}\\int_V\\phi\\,\\mathrm dV=-\\int_{\\partial V}\\mathbf J\\cdot\\mathbf n\\,\\mathrm dA\\quad\\Longrightarrow\\quad\\frac{\\partial\\phi}{\\partial t}+\\nabla\\cdot\\mathbf J=0",
              },
              {
                explanation:
                  "使物质沿化学势降低的方向流动。代入连续性方程后，再代入已求得的变分导数，出现四阶空间导数。",
                formula:
                  "\\begin{aligned}\\mathbf J&=-M_c\\nabla\\mu\\\\\\frac{\\partial\\phi}{\\partial t}&=\\nabla\\cdot(M_c\\nabla\\mu)\\\\&=M_c\\nabla^2\\!\\left[W(\\phi^3-\\phi)-\\kappa\\nabla^2\\phi\\right]\\quad\\text{(constant }M_c\\text{)}\\end{aligned}",
              },
              {
                explanation:
                  "分别积分场演化与自由能变化。在闭合边界下，一个积分严格为零，另一个非正：守恒与耗散是两条不同的检查。",
                formula:
                  "\\frac{\\mathrm d}{\\mathrm dt}\\int_\\Omega\\phi\\,\\mathrm dV=0,\\qquad\\frac{\\mathrm dF}{\\mathrm dt}=\\int_\\Omega\\mu\\nabla\\cdot(M_c\\nabla\\mu)\\,\\mathrm dV=-\\int_\\Omega M_c|\\nabla\\mu|^2\\,\\mathrm dV\\le0",
              },
            ],
            conclusion:
              "同一个自由能配上不同的动力学约束，会得到不同方程。守恒模型需要更多空间边界条件与更严格的显式步长限制，不能只把 Allen–Cahn 的名字换掉。 在相同的 $\\phi$ 与 $\\mu$ 定义下，$M_c$ 的量纲比 Allen–Cahn 的 $M$ 多一个长度平方因子，必须重新指定守恒动力学系数。",
          },
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
            "Explicitly tracking every interface becomes difficult when boundaries merge, split, or develop intricate shapes. Phase-field methods instead use a continuous field $\\phi$: values near −1 and +1 represent two stable states, and a smooth transition represents their interface. The field may describe structural or orientational order; it need not be chemical composition.",
            "A free energy must express both a preference for stable bulk phases and a cost for forming interfaces. A double-well local energy $f(\\phi)$ places minima at $\\pm1$, while a gradient term penalizes abrupt spatial changes. Their competition produces a finite interface width, rather than merely blurring an otherwise sharp line for display.",
          ],
          formula:
            "F[\\phi]=\\int_\\Omega\\left[\\frac W4(\\phi^2-1)^2+\\frac\\kappa2|\\nabla\\phi|^2\\right]\\,\\mathrm dV",
          symbols: [
            {
              symbol: "\\phi",
              meaning:
                "Dimensionless order parameter distinguishing the two states.",
            },
            {
              symbol: "W",
              meaning:
                "Energy-density scale of the double-well potential, controlling the penalty for departing from a stable phase.",
            },
            {
              symbol: "\\kappa",
              meaning:
                "Gradient-energy coefficient; together with $W$ it determines interface width and energy.",
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
            "A scalar function decreases along its negative gradient; a field decreases along the negative variational derivative of its free-energy functional. Differentiating the local energy gives $W(\\phi^3-\\phi)$. Integration by parts of the gradient contribution gives $-\\kappa\\nabla^2\\phi$ for periodic or appropriate no-flux boundary conditions. Their sum is the thermodynamic driving force $\\mu$.",
            "For a nonconserved structural order parameter, Allen–Cahn dynamics sets $\\frac{\\partial\\phi}{\\partial t}=-M\\mu$. With $M>0$ and no external work, the continuum equation satisfies $\\frac{\\mathrm dF}{\\mathrm dt}=-\\int_\\Omega M\\mu^2\\,\\mathrm dV\\le0$, so free energy cannot increase. An explicit numerical scheme still needs a sufficiently small time step: a dissipative differential equation does not make an unstable discretization correct.",
          ],
          formula:
            "\\begin{aligned}\\mu=\\frac{\\delta F}{\\delta\\phi}&=W(\\phi^3-\\phi)-\\kappa\\nabla^2\\phi\\\\\\frac{\\partial\\phi}{\\partial t}&=-M\\mu\\end{aligned}",
          symbols: [
            {
              symbol: "\\mu",
              meaning:
                "Variational derivative of free energy with respect to $\\phi$; it need not be the chemical potential of an atomic species here.",
            },
            {
              symbol: "M",
              meaning:
                "Positive mobility connecting the thermodynamic drive to the rate of change.",
            },
            {
              symbol: "\\nabla^2\\phi",
              meaning:
                "Laplacian of the field, expressing the influence of neighboring values.",
            },
          ],
        },
        {
          title: "Interface width, coarsening, and conservation",
          paragraphs: [
            "For a stationary planar interface in one dimension, setting $\\mu=0$ yields $\\phi(x)=\\tanh\\!\\left(x/\\sqrt{2\\kappa/W}\\right)$. Its width parameter is therefore $\\ell=\\sqrt{2\\kappa/W}$: larger $\\kappa$ smooths the interface, while larger $W$ narrows it. A numerical grid needs enough points across this width; grid artifacts should not be mistaken for material behavior.",
            "A curved interface can lower its energy by reducing interfacial area, so small, highly curved domains often disappear first. Allen–Cahn dynamics does not, however, conserve the spatial mean of $\\phi$. If $\\phi$ represents composition in a closed system, a conserved Cahn–Hilliard law, $\\frac{\\partial\\phi}{\\partial t}=\\nabla\\cdot(M_c\\nabla\\mu)$, is appropriate. Similar-looking patterns do not make these distinct physical constraints interchangeable.",
          ],
          formula:
            "\\begin{aligned}\\phi_{\\mathrm{eq}}(x)&=\\tanh\\!\\left(\\frac{x}{\\ell}\\right),&\\ell&=\\sqrt{\\frac{2\\kappa}{W}}\\\\\\frac{\\partial\\phi}{\\partial t}&=\\nabla\\cdot(M_c\\nabla\\mu)&&\\text{(conserved field)}\\end{aligned}",
          symbols: [
            {
              symbol: "\\ell",
              meaning:
                "Width parameter of the hyperbolic-tangent profile, not the full thickness under every possible threshold definition.",
            },
            {
              symbol: "\\phi_{\\mathrm{eq}}",
              meaning:
                "Planar equilibrium profile approaching −1 and +1 on its two sides.",
            },
            {
              symbol: "\\int_\\Omega\\phi\\,\\mathrm dV",
              meaning:
                "Integral conserved by Cahn–Hilliard with periodic or no-flux boundaries, but generally not by Allen–Cahn.",
            },
            {
              symbol: "M_c",
              meaning:
                "Conserved-dynamics mobility; its dimensions differ from Allen–Cahn mobility, so the same numerical coefficient cannot be reused unchanged.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Which phase does a uniform region move toward?",
        given:
          "Use reduced units with $W=M=1$ and an initially uniform $\\phi=0.2$, so $\\nabla^2\\phi=0$. Choose an explicit step $\\Delta t=0.025$.",
        steps: [
          "The local driving force is $\\mu=\\phi^3-\\phi=0.008-0.2=-0.192$.",
          "Thus $\\frac{\\partial\\phi}{\\partial t}=-\\mu=+0.192$: the field moves toward the +1 minimum.",
          "One explicit update gives $\\phi_{\\mathrm{new}}=0.2+0.025\\times0.192=0.2048$.",
          "Separately, the equilibrium interface width parameter is $\\sqrt2$ for $\\kappa=1$. Increasing $\\kappa$ to 4 at fixed $W$ changes it to $2\\sqrt2$.",
        ],
        result:
          "The local potential drives regions toward stable phases; the gradient term connects neighboring regions. Increasing $\\kappa$ broadens an interface, whereas increasing $M$ mainly accelerates evolution over the same free-energy landscape.",
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
          "The total solute amount must remain fixed. Allen–Cahn allows the field to change locally without a balancing flux and generally changes $\\int_\\Omega\\phi\\,\\mathrm dV$. A composition field needs a conserved flux law, such as Cahn–Hilliard, with appropriate boundary conditions.",
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
      derivation: {
        title: "From the descent of one number to the evolution of a field",
        introduction:
          "First represent the entire system by one uniform order parameter, then allow it to vary across space. Finally impose conservation to see why Allen–Cahn and Cahn–Hilliard have different differential orders.",
        stages: [
          {
            level: "simple",
            title: "Uniform region: gradient descent in a double well",
            assumptions: [
              "The order parameter is spatially uniform, so there is no interface or gradient energy.",
              "Take $W>0$ and $M>0$, with no external drive and no conservation constraint.",
            ],
            steps: [
              {
                explanation:
                  "Choose a double-well potential with minima in the two phases. Differentiate once for the slope and twice to distinguish stable minima from an unstable maximum.",
                formula:
                  "f(\\phi)=\\frac W4(\\phi^2-1)^2,\\qquad f^{\\prime}(\\phi)=W(\\phi^3-\\phi),\\qquad f^{\\prime\\prime}(\\pm1)=2W>0,\\quad f^{\\prime\\prime}(0)=-W",
              },
              {
                explanation:
                  "Move the order parameter down the energy gradient. Use the chain rule, rather than the visual appearance of a trajectory, to check dissipation.",
                formula:
                  "\\dot\\phi=-Mf^{\\prime}(\\phi)\\quad\\Longrightarrow\\quad\\frac{\\mathrm df}{\\mathrm dt}=f^{\\prime}(\\phi)\\dot\\phi=-M[f^{\\prime}(\\phi)]^2\\le0",
              },
              {
                explanation:
                  "Write a small perturbation around a stable phase and linearize. Its exponential decay identifies a local relaxation time and clarifies the roles of the parameters.",
                formula:
                  "\\phi=1+\\delta,\\quad |\\delta|\\ll1\\quad\\Longrightarrow\\quad\\dot\\delta\\simeq-2MW\\delta,\\qquad\\delta(t)=\\delta_0e^{-2MWt},\\qquad\\tau_{\\mathrm{relax}}=\\frac1{2MW}",
              },
            ],
            conclusion:
              "This minimal model explains stable phases and local relaxation but cannot connect neighboring regions. An interface requires an energetic cost for spatial variation.",
          },
          {
            level: "general",
            title: "Spatial variation: derive Allen–Cahn by variation",
            assumptions: [
              "Allow $\\phi(\\mathbf x,t)$ to vary spatially, with positive constants $W$ and $\\kappa$.",
              "Use periodic boundaries or natural conditions that eliminate the integration-by-parts boundary term.",
            ],
            steps: [
              {
                explanation:
                  "Add local and gradient energies. Perturb the field arbitrarily and retain the first-order change.",
                formula:
                  "F[\\phi]=\\int_\\Omega\\!\\left[f(\\phi)+\\frac\\kappa2|\\nabla\\phi|^2\\right]\\mathrm dV,\\qquad\\delta F=\\int_\\Omega\\!\\left[f^{\\prime}(\\phi)\\delta\\phi+\\kappa\\nabla\\phi\\cdot\\nabla\\delta\\phi\\right]\\mathrm dV",
              },
              {
                explanation:
                  "Integrate by parts to move the gradient off the perturbation. The coefficient multiplying an arbitrary perturbation is the variational derivative.",
                formula:
                  "\\delta F=\\int_\\Omega\\!\\left[f^{\\prime}(\\phi)-\\kappa\\nabla^2\\phi\\right]\\delta\\phi\\,\\mathrm dV\\quad\\Longrightarrow\\quad\\mu\\equiv\\frac{\\delta F}{\\delta\\phi}=W(\\phi^3-\\phi)-\\kappa\\nabla^2\\phi",
              },
              {
                explanation:
                  "Evolve down the functional gradient. Applying the chain rule to total free energy verifies that dissipation survives the spatial coupling.",
                formula:
                  "\\begin{aligned}\\frac{\\partial\\phi}{\\partial t}&=-M\\mu=M\\left[\\kappa\\nabla^2\\phi-W(\\phi^3-\\phi)\\right]\\\\\\frac{\\mathrm dF}{\\mathrm dt}&=\\int_\\Omega\\mu\\frac{\\partial\\phi}{\\partial t}\\,\\mathrm dV=-\\int_\\Omega M\\mu^2\\,\\mathrm dV\\le0\\end{aligned}",
              },
            ],
            conclusion:
              "The gradient term couples local relaxation into interface motion. The second spatial derivative comes from varying gradient energy; the total order parameter generally is not conserved.",
          },
          {
            level: "extension",
            title: "Conserved composition: derive Cahn–Hilliard from flux",
            assumptions: [
              "The field now represents a conserved composition in a closed system, using the same free energy.",
              "Use periodic boundaries, or no material flux and no boundary free-energy work; mobility is nonnegative.",
            ],
            steps: [
              {
                explanation:
                  "Conservation means that the amount inside a region changes only through boundary flux. The divergence theorem converts this to a local continuity equation.",
                formula:
                  "\\frac{\\mathrm d}{\\mathrm dt}\\int_V\\phi\\,\\mathrm dV=-\\int_{\\partial V}\\mathbf J\\cdot\\mathbf n\\,\\mathrm dA\\quad\\Longrightarrow\\quad\\frac{\\partial\\phi}{\\partial t}+\\nabla\\cdot\\mathbf J=0",
              },
              {
                explanation:
                  "Let material flow down the chemical-potential gradient. Substitute into continuity and then use the variational derivative already derived; a fourth spatial derivative appears.",
                formula:
                  "\\begin{aligned}\\mathbf J&=-M_c\\nabla\\mu\\\\\\frac{\\partial\\phi}{\\partial t}&=\\nabla\\cdot(M_c\\nabla\\mu)\\\\&=M_c\\nabla^2\\!\\left[W(\\phi^3-\\phi)-\\kappa\\nabla^2\\phi\\right]\\quad\\text{(constant }M_c\\text{)}\\end{aligned}",
              },
              {
                explanation:
                  "Integrate the field evolution and the energy rate separately. With closed boundaries, one integral vanishes and the other is nonpositive: conservation and dissipation are distinct checks.",
                formula:
                  "\\frac{\\mathrm d}{\\mathrm dt}\\int_\\Omega\\phi\\,\\mathrm dV=0,\\qquad\\frac{\\mathrm dF}{\\mathrm dt}=\\int_\\Omega\\mu\\nabla\\cdot(M_c\\nabla\\mu)\\,\\mathrm dV=-\\int_\\Omega M_c|\\nabla\\mu|^2\\,\\mathrm dV\\le0",
              },
            ],
            conclusion:
              "The same free energy yields a different equation when the kinetic constraint changes. The conserved model needs additional spatial boundary conditions and more restrictive explicit time steps; it is not merely a renamed Allen–Cahn model. With the same definitions of $\\phi$ and $\\mu$, the dimensions of $M_c$ include an extra length-squared factor relative to Allen–Cahn mobility $M$; the conserved kinetic coefficient must be specified independently.",
          },
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
            "在晶体内，塑性滑移通常沿特定晶面和晶向发生。一个滑移系由滑移面单位法向 $n$ 和面内单位滑移方向 $s$ 定义，二者互相垂直。外部拉力虽然沿试样轴线施加，真正驱动该滑移系的却是投影到滑移方向的剪应力。",
            "令拉伸轴与 $n$、$s$ 的夹角分别为 $\\varphi$、$\\lambda$，先把轴向力投影到滑移方向，再考虑倾斜滑移面的面积，就得到 Schmid 因子 $m=\\cos\\varphi\\cos\\lambda$。它不是任意两个角的独立乘积，因为 $n$ 与 $s$ 必须正交；在单轴应力下 $|m|\\le\\frac12$。",
          ],
          formula:
            "\\begin{aligned}\\tau^{(\\alpha)}&=\\mathbf s^{(\\alpha)}\\cdot\\boldsymbol\\sigma\\cdot\\mathbf n^{(\\alpha)}\\\\\\tau&=\\sigma_a\\cos\\varphi\\cos\\lambda=\\sigma_a m\\quad\\text{(uniaxial)}\\end{aligned}",
          symbols: [
            {
              symbol: "\\alpha",
              meaning: "滑移系编号，不是材料常数。",
            },
            {
              symbol: "\\mathbf s,\\mathbf n",
              meaning: "滑移方向和滑移面法向的单位向量，满足 $s$·$n$=0。",
            },
            {
              symbol: "\\sigma_a",
              meaning: "单轴外加拉应力。",
            },
            {
              symbol: "\\tau",
              meaning: "该滑移系上的分解剪应力。",
            },
            {
              symbol: "m",
              meaning: "Schmid 因子，单轴情形中绝对值不超过 0.5。",
            },
          ],
        },
        {
          title: "从启动阈值走向滑移速率",
          paragraphs: [
            "最简单的率无关判据是 $|\\tau|\\ge g$，其中 $g$ 是临界分解剪应力。相同材料、不同取向的晶粒具有不同 $m$，因此即使受到相同轴向应力，也可能在不同载荷下开始滑移。对给定滑移系，启动所需轴向应力为 $\\frac{g}{|m|}$；$m=0$ 时该单轴载荷不驱动此滑移系。",
            "完整晶体塑性不能只标记“已启动”。它需要计算每个滑移系的滑移速率，并描述位错累积造成的硬化。常见平滑幂律用较大的指数 $p$ 使 $|\\tau|$ 接近 $g$ 时速率迅速增加；硬化规律则让 $g$ 随累计滑移变化。具体函数和参数应由实验或微观机制约束。",
          ],
          formula:
            "\\begin{aligned}\\dot\\gamma^{(\\alpha)}&=\\dot\\gamma_0\\left|\\frac{\\tau^{(\\alpha)}}{g^{(\\alpha)}}\\right|^p\\operatorname{sign}\\!\\left(\\tau^{(\\alpha)}\\right)\\\\\\dot g^{(\\alpha)}&=\\sum_\\beta h_{\\alpha\\beta}\\left|\\dot\\gamma^{(\\beta)}\\right|\\end{aligned}",
          symbols: [
            {
              symbol: "\\dot\\gamma^{(\\alpha)}",
              meaning: "滑移系 $\\alpha$ 的剪切速率。",
            },
            {
              symbol: "g^{(\\alpha)}",
              meaning: "当前滑移阻力或临界分解剪应力。",
            },
            {
              symbol: "\\dot\\gamma_0,p",
              meaning:
                "参考滑移速率与速率敏感指数；此处 $p$ 与 Schmid 因子 $m$ 无关。",
            },
            {
              symbol: "h_{\\alpha\\beta}",
              meaning: "滑移系 $\\beta$ 的活动对 $\\alpha$ 硬化的影响。",
            },
          ],
        },
        {
          title: "把许多晶粒装回同一块材料",
          paragraphs: [
            "晶粒取向不同，就会倾向于产生不同的塑性变形。但相邻晶粒粘接在一起，必须满足相容与力平衡，不能各自独立伸长。因而真实多晶中的局部应力通常并不等于外加平均应力。晶体塑性有限元把各晶粒的滑移规律放入连续体求解中，求得相互约束后的局部场。",
            "在小变形下，可以把各滑移系贡献叠加为塑性应变率张量；大变形则需要更新晶格取向并处理弹塑性变形分解。本章的取向网格只比较固定取向、共同外加应力下的 Schmid 启动阈值，没有计算应变相容、硬化或取向旋转，因此不是完整的多晶应力–应变预测。",
          ],
          formula:
            "\\dot{\\boldsymbol\\varepsilon}^{p}=\\sum_\\alpha\\frac{\\dot\\gamma^{(\\alpha)}}2\\left(\\mathbf s^{(\\alpha)}\\otimes\\mathbf n^{(\\alpha)}+\\mathbf n^{(\\alpha)}\\otimes\\mathbf s^{(\\alpha)}\\right)",
          symbols: [
            {
              symbol: "\\dot{\\boldsymbol\\varepsilon}^{p}",
              meaning: "小变形下的塑性应变率张量。",
            },
            {
              symbol: "\\otimes",
              meaning: "向量外积，把方向信息组合成二阶张量。",
            },
            {
              symbol: "\\sum_\\alpha",
              meaning: "对晶体中考虑的所有滑移系求和。",
            },
          ],
        },
      ],
      workedExample: {
        title: "相同载荷，为什么一个晶粒先滑移？",
        given:
          "轴向应力 $\\sigma_a=120\\,\\mathrm{MPa}$，临界分解剪应力 $g=40\\,\\mathrm{MPa}$。考虑平面单滑移模型：$\\lambda=90^\\circ-\\varphi$。",
        steps: [
          "晶粒 A 取 $\\varphi=30^\\circ$，则 $m=\\cos30^\\circ\\sin30^\\circ\\approx0.433$，$\\tau\\approx52.0\\,\\mathrm{MPa}$，大于 40 MPa，达到启动阈值。",
          "晶粒 B 取 $\\varphi=10^\\circ$，则 $m\\approx0.171$，$\\tau\\approx20.5\\,\\mathrm{MPa}$，尚未达到阈值。",
          "A 的轴向启动应力为 $40/0.433\\approx92.4\\,\\mathrm{MPa}$。最有利的 $\\varphi=45^\\circ$ 取向给出 $m=0.5$，启动应力为 80 MPa。",
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
          "两个晶粒的 Schmid 因子分别为 $m=0.4$ 与 $m=0.2$，临界剪应力同为 $g=30\\,\\mathrm{MPa}$。哪个先滑移？",
        answer:
          "$m=0.4$ 的晶粒先启动，其轴向阈值为 $\\sigma_a=g/|m|=30/0.4=75\\,\\mathrm{MPa}$；$m=0.2$ 的晶粒需要 $150\\,\\mathrm{MPa}$。这是在相同单轴局部应力与单一滑移判据下的结论。",
      },
      diagram: {
        title: "把拉应力投影到滑移系",
        caption:
          "$n$ 是滑移面的法向，$s$ 是面内滑移方向。它们与拉伸轴的夹角决定分解剪应力；同一外加载荷对不同取向的晶粒有不同驱动效果。",
        labels: [
          "拉伸轴",
          "外加应力 σₐ",
          "滑移面",
          "法向 n",
          "滑移方向 s",
          "分解剪应力 τ",
        ],
      },
      derivation: {
        title: "从一个滑移系到多晶体的响应",
        introduction:
          "从力在斜面上的投影开始，推导滑移系的驱动力；再把各滑移系连接到应变率与硬化，最后说明晶粒之间为何必须共同满足力学约束。",
        stages: [
          {
            level: "simple",
            title: "单轴与单滑移：推导 Schmid 定律",
            assumptions: [
              "小变形单轴拉伸，轴向单位矢量为 $\\mathbf e$，应力为 $\\sigma_a$。",
              "滑移面法向 $\\mathbf n$ 与滑移方向 $\\mathbf s$ 均为单位矢量，且互相垂直。",
            ],
            steps: [
              {
                explanation:
                  "将单轴应力写成张量，再用 Cauchy 牵引关系得到滑移面上的单位面积受力。",
                formula:
                  "\\boldsymbol\\sigma=\\sigma_a\\mathbf e\\otimes\\mathbf e\\quad\\Longrightarrow\\quad\\mathbf t(\\mathbf n)=\\boldsymbol\\sigma\\mathbf n=\\sigma_a(\\mathbf e\\cdot\\mathbf n)\\mathbf e",
              },
              {
                explanation:
                  "牵引在滑移方向的分量就是分解剪应力。两个点积分别变为夹角余弦，得到 Schmid 因子。",
                formula:
                  "\\tau=\\mathbf s\\cdot\\mathbf t=\\sigma_a(\\mathbf s\\cdot\\mathbf e)(\\mathbf n\\cdot\\mathbf e)=\\sigma_a\\cos\\lambda\\cos\\varphi\\equiv\\sigma_a m",
              },
              {
                explanation:
                  "利用法向与滑移方向正交，两个投影平方和不超过一。由此证明 Schmid 因子上界，并求出给定临界剪应力下的轴向启动应力。",
                formula:
                  "\\begin{aligned}a&=\\mathbf e\\cdot\\mathbf s,\\quad c=\\mathbf e\\cdot\\mathbf n,\\quad a^2+c^2\\le1\\\\2|m|=2|ac|&\\le a^2+c^2\\le1\\quad\\Longrightarrow\\quad |m|\\le\\frac12\\\\|\\tau|\\ge g&\\quad\\Longrightarrow\\quad |\\sigma_a|\\ge\\frac g{|m|}\\qquad(m\\ne0)\\end{aligned}",
              },
            ],
            conclusion:
              "几何投影已经能解释相同材料的晶粒为何在不同载荷下启动，但启动判据并未给出滑移速率、应变或硬化。",
          },
          {
            level: "general",
            title: "多个滑移系：构造应变率与耗散",
            assumptions: [
              "采用小应变，暂时固定晶格取向；对所有滑移系叠加。",
              "每个滑移系的阻力 $g^{(\\alpha)}>0$，参考速率 $\\dot\\gamma_0>0$，幂律指数 $p>0$。",
            ],
            steps: [
              {
                explanation:
                  "沿滑移面切向的相对位移产生一个秩一的塑性速度梯度。取对称部分，得到各系统对应的塑性应变率。",
                formula:
                  "\\mathbf L^p=\\sum_\\alpha\\dot\\gamma^{(\\alpha)}\\mathbf s^{(\\alpha)}\\otimes\\mathbf n^{(\\alpha)}\\quad\\Longrightarrow\\quad\\dot{\\boldsymbol\\varepsilon}^p=\\sum_\\alpha\\dot\\gamma^{(\\alpha)}\\mathbf P^{(\\alpha)},\\quad\\mathbf P^{(\\alpha)}=\\frac{\\mathbf s^{(\\alpha)}\\otimes\\mathbf n^{(\\alpha)}+\\mathbf n^{(\\alpha)}\\otimes\\mathbf s^{(\\alpha)}}2",
              },
              {
                explanation:
                  "用应力与塑性应变率的双点积计算塑性功率。它自然分解成每个滑移系的剪应力乘滑移速率，这也说明分解剪应力为何是正确驱动力。",
                formula:
                  "\\boldsymbol\\sigma:\\dot{\\boldsymbol\\varepsilon}^p=\\sum_\\alpha\\underbrace{(\\boldsymbol\\sigma:\\mathbf P^{(\\alpha)})}_{\\tau^{(\\alpha)}}\\dot\\gamma^{(\\alpha)}=\\sum_\\alpha\\tau^{(\\alpha)}\\dot\\gamma^{(\\alpha)}",
              },
              {
                explanation:
                  "选择滑移方向与剪应力同号的幂律，再用累计滑移更新阻力。前者保证该滑移功率非负；若模型储存硬化能，还须单独核对完整热力学耗散。",
                formula:
                  "\\begin{aligned}\\dot\\gamma^{(\\alpha)}&=\\dot\\gamma_0\\left|\\frac{\\tau^{(\\alpha)}}{g^{(\\alpha)}}\\right|^p\\operatorname{sign}(\\tau^{(\\alpha)})\\\\\\dot g^{(\\alpha)}&=\\sum_\\beta h_{\\alpha\\beta}|\\dot\\gamma^{(\\beta)}|,\\qquad\\tau^{(\\alpha)}\\dot\\gamma^{(\\alpha)}\\ge0\\end{aligned}",
              },
            ],
            conclusion:
              "系统数增加后，未知量不再只是“是否启动”，而是所有滑移速率与内部阻力。大变形还要使用弹塑性分解与取向更新，不能直接延用固定小应变几何。",
          },
          {
            level: "extension",
            title: "多晶：从晶粒本构到整体平均",
            assumptions: [
              "取有代表性的体积，晶粒界面粘接；体积分数之和为一。",
              "以下先解释小应变下的 Taylor／Sachs 理想化，再指出场求解所需的约束。",
            ],
            steps: [
              {
                explanation:
                  "每个晶粒使用自己的取向和滑移系统。宏观应力与应变是体积平均，但平均符号本身并不能确定各晶粒的局部场。",
                formula:
                  "\\boldsymbol\\Sigma=\\langle\\boldsymbol\\sigma\\rangle=\\sum_g f_g\\boldsymbol\\sigma_g,\\qquad\\mathbf E=\\langle\\boldsymbol\\varepsilon\\rangle=\\sum_g f_g\\boldsymbol\\varepsilon_g,\\qquad\\sum_gf_g=1",
              },
              {
                explanation:
                  "为闭合平均问题，可以先作极端理想化：Taylor 给所有晶粒同一应变，Sachs 给所有晶粒同一应力。它们省略的局部约束不同，因此预测一般不同。",
                formula:
                  "\\begin{aligned}\\text{Taylor:}\\quad\\boldsymbol\\varepsilon_g&=\\mathbf E\\quad\\Longrightarrow\\quad\\boldsymbol\\Sigma=\\sum_gf_g\\boldsymbol\\sigma_g(\\mathbf E)\\\\\\text{Sachs:}\\quad\\boldsymbol\\sigma_g&=\\boldsymbol\\Sigma\\quad\\Longrightarrow\\quad\\mathbf E=\\sum_gf_g\\boldsymbol\\varepsilon_g(\\boldsymbol\\Sigma)\\end{aligned}",
              },
              {
                explanation:
                  "要更完整地确定局部场，需要求解平衡、应变相容与各点的滑移本构，再施加合适的代表性体积边界条件。能量一致的均匀化还应满足宏微观功率相等。",
                formula:
                  "\\begin{gathered}\\nabla\\cdot\\boldsymbol\\sigma=\\mathbf0,\\qquad\\boldsymbol\\varepsilon=\\operatorname{sym}\\nabla\\mathbf u,\\qquad\\boldsymbol\\sigma=\\mathsf C:(\\boldsymbol\\varepsilon-\\boldsymbol\\varepsilon^p)\\\\\\boldsymbol\\Sigma:\\dot{\\mathbf E}=\\left\\langle\\boldsymbol\\sigma:\\dot{\\boldsymbol\\varepsilon}\\right\\rangle\\quad\\text{(Hill--Mandel condition)}\\end{gathered}",
              },
            ],
            conclusion:
              "完整晶体塑性有限元通过空间场满足晶粒之间的约束。共同应力下的 Schmid 取向图只对应其中最简的启动比较，不能替代多晶应力—应变预测。",
          },
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
            "Plastic slip in a crystal usually occurs on specific planes and along specific directions. A slip system is defined by a unit plane normal $n$ and a unit slip direction $s$ lying in that plane, so the two vectors are perpendicular. Although a tensile load acts along the specimen axis, the shear component resolved along the slip direction is what drives this system.",
            "Let $\\varphi$ and $\\lambda$ be the angles between the loading axis and $n$ and $s$, respectively. Projecting the axial force along the slip direction and accounting for the area of the inclined plane gives the Schmid factor $m=\\cos\\varphi\\cos\\lambda$. These angles are not arbitrary independent choices because $n$ and $s$ must remain orthogonal; under uniaxial loading, $|m|\\le\\frac12$.",
          ],
          formula:
            "\\begin{aligned}\\tau^{(\\alpha)}&=\\mathbf s^{(\\alpha)}\\cdot\\boldsymbol\\sigma\\cdot\\mathbf n^{(\\alpha)}\\\\\\tau&=\\sigma_a\\cos\\varphi\\cos\\lambda=\\sigma_a m\\quad\\text{(uniaxial)}\\end{aligned}",
          symbols: [
            {
              symbol: "\\alpha",
              meaning: "Slip-system index, not a material constant.",
            },
            {
              symbol: "\\mathbf s,\\mathbf n",
              meaning:
                "Unit slip direction and unit slip-plane normal, with $s$·$n$=0.",
            },
            {
              symbol: "\\sigma_a",
              meaning: "Applied uniaxial tensile stress.",
            },
            {
              symbol: "\\tau",
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
            "The simplest rate-independent activation criterion is $|\\tau|\\ge g$, where $g$ is the critical resolved shear stress. Grains made of the same material can have different $m$ because their orientations differ. Consequently, they may begin to slip at different applied loads. For one slip system, the required axial stress is $\\frac{g}{|m|}$; a system with $m=0$ is not driven by this uniaxial load.",
            "A complete crystal-plasticity model must do more than mark a system as active. It calculates the slip rate on every system and represents hardening caused by accumulating dislocations. A common smooth power law uses a large exponent $p$ to make slip rates increase rapidly near $|\\tau|=g$. A hardening law then evolves $g$ with accumulated slip. These functions and parameters require experimental or micromechanical justification.",
          ],
          formula:
            "\\begin{aligned}\\dot\\gamma^{(\\alpha)}&=\\dot\\gamma_0\\left|\\frac{\\tau^{(\\alpha)}}{g^{(\\alpha)}}\\right|^p\\operatorname{sign}\\!\\left(\\tau^{(\\alpha)}\\right)\\\\\\dot g^{(\\alpha)}&=\\sum_\\beta h_{\\alpha\\beta}\\left|\\dot\\gamma^{(\\beta)}\\right|\\end{aligned}",
          symbols: [
            {
              symbol: "\\dot\\gamma^{(\\alpha)}",
              meaning: "Shear rate on slip system $\\alpha$.",
            },
            {
              symbol: "g^{(\\alpha)}",
              meaning:
                "Current slip resistance or critical resolved shear stress.",
            },
            {
              symbol: "\\dot\\gamma_0,p",
              meaning:
                "Reference slip rate and rate-sensitivity exponent; $p$ is distinct from the Schmid factor $m$.",
            },
            {
              symbol: "h_{\\alpha\\beta}",
              meaning:
                "Hardening of system $\\alpha$ induced by activity on system $\\beta$.",
            },
          ],
        },
        {
          title: "Putting the grains back into one material",
          paragraphs: [
            "Differently oriented grains tend to develop different plastic deformations. Neighboring grains are bonded, however, so they must satisfy compatibility and force balance rather than elongating independently. Local stress in a real polycrystal therefore usually differs from the applied average stress. Crystal-plasticity finite elements embed the slip laws within a continuum solution to determine these mutually constrained local fields.",
            "At small strains, contributions from all slip systems can be added to obtain a plastic strain-rate tensor. Large-deformation models must also update lattice orientation and treat elastic–plastic deformation decomposition. The orientation grid in this lesson compares Schmid activation thresholds at fixed orientations under a shared applied stress. It does not solve compatibility, hardening, or lattice rotation and is not a complete prediction of a polycrystal'$s$ stress–strain curve.",
          ],
          formula:
            "\\dot{\\boldsymbol\\varepsilon}^{p}=\\sum_\\alpha\\frac{\\dot\\gamma^{(\\alpha)}}2\\left(\\mathbf s^{(\\alpha)}\\otimes\\mathbf n^{(\\alpha)}+\\mathbf n^{(\\alpha)}\\otimes\\mathbf s^{(\\alpha)}\\right)",
          symbols: [
            {
              symbol: "\\dot{\\boldsymbol\\varepsilon}^{p}",
              meaning:
                "Plastic strain-rate tensor in a small-deformation description.",
            },
            {
              symbol: "\\otimes",
              meaning:
                "Vector outer product, combining directions into a second-order tensor.",
            },
            {
              symbol: "\\sum_\\alpha",
              meaning:
                "Sum over all slip systems included in the crystal model.",
            },
          ],
        },
      ],
      workedExample: {
        title: "Why does one grain slip first under the same load?",
        given:
          "Take an axial stress $\\sigma_a=120\\,\\mathrm{MPa}$ and a critical resolved shear stress $g=40\\,\\mathrm{MPa}$. In a planar single-slip geometry, $\\lambda=90^\\circ-\\varphi$.",
        steps: [
          "For grain A with $\\varphi=30^\\circ$, $m=\\cos30^\\circ\\sin30^\\circ\\approx0.433$ and $\\tau\\approx52.0\\,\\mathrm{MPa}$. This exceeds 40 MPa, so the activation criterion is met.",
          "For grain B with $\\varphi=10^\\circ$, $m\\approx0.171$ and $\\tau\\approx20.5\\,\\mathrm{MPa}$, below the threshold.",
          "Grain A'$s$ axial activation stress is $40/0.433\\approx92.4\\,\\mathrm{MPa}$. The most favorably oriented case, $\\varphi=45^\\circ$, has $m=0.5$ and activates at 80 MPa.",
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
          "Two grains have Schmid factors $m=0.4$ and $m=0.2$, with the same critical shear stress $g=30\\,\\mathrm{MPa}$. Which slips first?",
        answer:
          "The grain with $m=0.4$ activates first, at $\\sigma_a=g/|m|=30/0.4=75\\,\\mathrm{MPa}$. The grain with $m=0.2$ requires $150\\,\\mathrm{MPa}$. This comparison assumes the same uniaxial local stress and a single-slip activation criterion.",
      },
      diagram: {
        title: "Resolving tensile stress onto a slip system",
        caption:
          "$n$ is the slip-plane normal and $s$ the in-plane slip direction. Their angles to the loading axis determine resolved shear stress, so the same applied load drives differently oriented grains by different amounts.",
        labels: [
          "Loading axis",
          "Applied stress σₐ",
          "Slip plane",
          "Normal n",
          "Slip direction s",
          "Resolved shear τ",
        ],
      },
      derivation: {
        title: "From one slip system to a polycrystal",
        introduction:
          "Begin by projecting forces onto an inclined plane, then connect slip systems to strain rate and hardening. Finally, identify the mechanical constraints that couple neighboring grains.",
        stages: [
          {
            level: "simple",
            title: "Uniaxial single slip: derive Schmid’s law",
            assumptions: [
              "Small-strain uniaxial tension along unit vector $\\mathbf e$, with axial stress $\\sigma_a$.",
              "The unit slip-plane normal $\\mathbf n$ and slip direction $\\mathbf s$ are perpendicular.",
            ],
            steps: [
              {
                explanation:
                  "Write the uniaxial stress as a tensor, then use Cauchy’s traction relation to find the force per unit area on the slip plane.",
                formula:
                  "\\boldsymbol\\sigma=\\sigma_a\\mathbf e\\otimes\\mathbf e\\quad\\Longrightarrow\\quad\\mathbf t(\\mathbf n)=\\boldsymbol\\sigma\\mathbf n=\\sigma_a(\\mathbf e\\cdot\\mathbf n)\\mathbf e",
              },
              {
                explanation:
                  "Resolve that traction along the slip direction. The two dot products become angle cosines, giving the Schmid factor.",
                formula:
                  "\\tau=\\mathbf s\\cdot\\mathbf t=\\sigma_a(\\mathbf s\\cdot\\mathbf e)(\\mathbf n\\cdot\\mathbf e)=\\sigma_a\\cos\\lambda\\cos\\varphi\\equiv\\sigma_a m",
              },
              {
                explanation:
                  "Orthogonality means the squared projections sum to at most one. This bounds the Schmid factor and gives the axial onset stress for a prescribed critical shear stress.",
                formula:
                  "\\begin{aligned}a&=\\mathbf e\\cdot\\mathbf s,\\quad c=\\mathbf e\\cdot\\mathbf n,\\quad a^2+c^2\\le1\\\\2|m|=2|ac|&\\le a^2+c^2\\le1\\quad\\Longrightarrow\\quad |m|\\le\\frac12\\\\|\\tau|\\ge g&\\quad\\Longrightarrow\\quad |\\sigma_a|\\ge\\frac g{|m|}\\qquad(m\\ne0)\\end{aligned}",
              },
            ],
            conclusion:
              "Geometric projection explains different onset loads for grains of the same material, but an activation criterion does not yet specify slip rate, strain, or hardening.",
          },
          {
            level: "general",
            title:
              "Multiple slip systems: construct strain rate and dissipation",
            assumptions: [
              "Use small strains with temporarily fixed lattice orientations, and sum all slip systems.",
              "Each resistance $g^{(\\alpha)}>0$, reference rate $\\dot\\gamma_0>0$, and power-law exponent $p>0$.",
            ],
            steps: [
              {
                explanation:
                  "Tangential relative displacement across a slip plane produces a rank-one plastic velocity gradient. Its symmetric part gives the plastic strain-rate contribution.",
                formula:
                  "\\mathbf L^p=\\sum_\\alpha\\dot\\gamma^{(\\alpha)}\\mathbf s^{(\\alpha)}\\otimes\\mathbf n^{(\\alpha)}\\quad\\Longrightarrow\\quad\\dot{\\boldsymbol\\varepsilon}^p=\\sum_\\alpha\\dot\\gamma^{(\\alpha)}\\mathbf P^{(\\alpha)},\\quad\\mathbf P^{(\\alpha)}=\\frac{\\mathbf s^{(\\alpha)}\\otimes\\mathbf n^{(\\alpha)}+\\mathbf n^{(\\alpha)}\\otimes\\mathbf s^{(\\alpha)}}2",
              },
              {
                explanation:
                  "Contract stress with plastic strain rate to obtain plastic power. It separates into resolved shear stress times slip rate on every system, identifying the correct driving forces.",
                formula:
                  "\\boldsymbol\\sigma:\\dot{\\boldsymbol\\varepsilon}^p=\\sum_\\alpha\\underbrace{(\\boldsymbol\\sigma:\\mathbf P^{(\\alpha)})}_{\\tau^{(\\alpha)}}\\dot\\gamma^{(\\alpha)}=\\sum_\\alpha\\tau^{(\\alpha)}\\dot\\gamma^{(\\alpha)}",
              },
              {
                explanation:
                  "Choose a power law with slip rate having the sign of shear stress, then evolve resistance with accumulated slip. Slip power is nonnegative; any stored hardening energy requires a separate full thermodynamic check.",
                formula:
                  "\\begin{aligned}\\dot\\gamma^{(\\alpha)}&=\\dot\\gamma_0\\left|\\frac{\\tau^{(\\alpha)}}{g^{(\\alpha)}}\\right|^p\\operatorname{sign}(\\tau^{(\\alpha)})\\\\\\dot g^{(\\alpha)}&=\\sum_\\beta h_{\\alpha\\beta}|\\dot\\gamma^{(\\beta)}|,\\qquad\\tau^{(\\alpha)}\\dot\\gamma^{(\\alpha)}\\ge0\\end{aligned}",
              },
            ],
            conclusion:
              "With multiple systems, the unknowns are all slip rates and internal resistances, not just active flags. Large deformation additionally needs elastic–plastic decomposition and orientation updates.",
          },
          {
            level: "extension",
            title: "Polycrystals: from grain laws to macroscopic averages",
            assumptions: [
              "Use a representative volume with bonded grain interfaces and volume fractions summing to one.",
              "First consider small-strain Taylor/Sachs idealizations, then identify the constraints needed for a field solution.",
            ],
            steps: [
              {
                explanation:
                  "Each grain has its own orientation and slip systems. Macroscopic stress and strain are volume averages, but averaging alone does not determine the local fields.",
                formula:
                  "\\boldsymbol\\Sigma=\\langle\\boldsymbol\\sigma\\rangle=\\sum_g f_g\\boldsymbol\\sigma_g,\\qquad\\mathbf E=\\langle\\boldsymbol\\varepsilon\\rangle=\\sum_g f_g\\boldsymbol\\varepsilon_g,\\qquad\\sum_gf_g=1",
              },
              {
                explanation:
                  "A first closure can use contrasting idealizations: Taylor assigns a common strain, whereas Sachs assigns a common stress. They omit different local constraints and generally predict different responses.",
                formula:
                  "\\begin{aligned}\\text{Taylor:}\\quad\\boldsymbol\\varepsilon_g&=\\mathbf E\\quad\\Longrightarrow\\quad\\boldsymbol\\Sigma=\\sum_gf_g\\boldsymbol\\sigma_g(\\mathbf E)\\\\\\text{Sachs:}\\quad\\boldsymbol\\sigma_g&=\\boldsymbol\\Sigma\\quad\\Longrightarrow\\quad\\mathbf E=\\sum_gf_g\\boldsymbol\\varepsilon_g(\\boldsymbol\\Sigma)\\end{aligned}",
              },
              {
                explanation:
                  "A fuller solution imposes equilibrium, strain compatibility, and the slip constitutive law, with suitable representative-volume boundary conditions. Energy-consistent homogenization also equates macro and micro power.",
                formula:
                  "\\begin{gathered}\\nabla\\cdot\\boldsymbol\\sigma=\\mathbf0,\\qquad\\boldsymbol\\varepsilon=\\operatorname{sym}\\nabla\\mathbf u,\\qquad\\boldsymbol\\sigma=\\mathsf C:(\\boldsymbol\\varepsilon-\\boldsymbol\\varepsilon^p)\\\\\\boldsymbol\\Sigma:\\dot{\\mathbf E}=\\left\\langle\\boldsymbol\\sigma:\\dot{\\boldsymbol\\varepsilon}\\right\\rangle\\quad\\text{(Hill--Mandel condition)}\\end{gathered}",
              },
            ],
            conclusion:
              "Crystal-plasticity finite elements enforce grain interactions through spatial fields. A Schmid orientation map under common stress provides only a minimal onset comparison, not a polycrystalline stress–strain prediction.",
          },
        ],
      },
    },
  },
};
