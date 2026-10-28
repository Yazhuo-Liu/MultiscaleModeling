# 从现象开始：分层学习与材料演示

## 本次目标与阅读路径

十一种方法与八个基础章节都采用三个明确层次：先看懂现象（默认，无公式门槛）、理解模型（术语、假设与核心关系）、深入推导（完整数学、算例与扩展）。原有理论保留，但不在首次进入时全部铺开。入口用一个生活或材料问题、三个短步骤和一次观察任务建立直觉；按钮明确下一步。代码与参考资料仍可单独访问。

## 教学内容

新增独立双语入门数据，避免用删掉公式的旧段落冒充入门。每章解释观察对象、规则和所得结论，说明类比边界。基础章节的三维轨道与已有交互置于现象层，完整方程留在后续层次。方法演示提供一个清晰任务、材料语义和少量可直接点击的参数场景，数值指标与专家参数渐进展开。

## MC 演示

默认展示可旋转的三维简单立方晶格、空位、当前跳跃原子与空位轨迹。使用廉价格点空位交换和 Metropolis 接受规则；以教学俘获能改变接受概率，不计算真实原子势。动画插值展示单次跳跃，视图支持平面观察。只把尝试数、接受次数、轨迹作为观察量，不将 MC 步解释为物理时间或报告真实扩散系数。温度/俘获强度场景用于比较随机采样；KMC 章节承担具有事件速率与物理时钟的扩散教学。原 Ising 例子保留为进阶可选实验，并确保代码与实验名称明确对应。

## 文件职责

- `src/content/beginner.ts`：19 章双语无公式入门、观察任务和三步解释。
- `src/components/BeginnerIntro.tsx`：共享入门叙述与层次导航。
- `src/App.tsx` / `FoundationsPage.tsx`：按学习层次组织内容。
- 独立 MC 教学模型与视图：只负责格点规则、状态和动画，不改现有物理求解器。
- `SimulationLab.tsx`：实验场景、观察目标、进阶参数的统一呈现。
- 所有样式仍归 `src/theme.css`；不引入额外样式文件。

## 验证与发布

检查所有 19 章双语首次进入的内容、层次切换、完整数学仍可达、MC 原子/空位守恒和接受规则、实际三维视角与动画、暂停/重置/语言切换、移动端和减少动态效果。运行数值测试、生产构建和针对新学习路径的浏览器测试，再更新受路径变更影响的原有回归检查。以用户身份提交并推送；最后用既有专门发布命令发布一次。

## MC vacancy exchange teaching demo

- Finite 5×5×5 simple cubic lattice, 124 labelled identical atoms and one vacancy. This lattice is a teaching construction, not a claim about a specific crystal material.
- Each attempt proposes one of six signed Cartesian neighbour directions with probability 1/6. Out-of-domain proposals are rejected, preserving symmetric proposal probabilities at boundaries.
- Configuration energy depends only on vacancy site: E(s)=−A exp(−|s−(2,2,2)|²/1.5). Metropolis acceptance=min(1,exp(−ΔE/T)), with T expressed in teaching units. Trap A=0 gives equal-energy sites; temperature then has no effect on accepted interior proposals. No interatomic potential or diffusion coefficient is calculated.
- Free preset (T=1,A=0), cold trap (T=.25,A=2), warm trap (T=1.5,A=2). Presets reset the same seed. Higher T raises uphill acceptance, not necessarily an individual trajectory’s net distance. MC attempts do not represent elapsed physical time; the KMC link explains rate-based clocks.
- Full xyz spheres, real OrbitControls camera, eased atom/vacancy exchange and the latest 100 sites of the vacancy path. Only the atom participating in an accepted exchange is briefly emphasized; there is no permanently tagged atom. The gold vacancy and its path remain the observation focus.
- The Slice view shows the current vacancy's lattice layer. It hides trails rather than joining disjoint visits across layers. SVG slice fallback keeps the model usable without WebGL.
- Paused initial state. Play, pause (including mid-hop), one attempt, reset, scene presets,3D/slice. Visibility pauses animation without accumulating hidden time. Reduced-motion uses instantaneous single steps; explicit play opts into movement.
- Independent Python/NumPy snippet uses the same model and boundary rule (NumPy and JavaScript random generators differ, so trajectories need not match).
- Tests cover conservation/unique occupancy, deterministic initial exchange and opposite atom/vacancy displacement, reversibility probabilities, boundary rejection, copied snapshots and parameter bounds.
