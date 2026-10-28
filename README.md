# 尺度之间 · Multiscale Modeling

面向材料、力学、机械专业初学者的中英文多尺度建模交互教材。从电子结构到工程连续体，以**长度与时间**为线索，连接理论、可操作实验与算法代码。

覆盖 11 种方法：DFT、Hartree–Fock、分子动力学、Monte Carlo、位错动力学、Kinetic Monte Carlo、相场、多晶塑性、本构 / 速率与状态方程、有限元、有限差分。每章提供直觉、核心概念、方程、交互实验、算法步骤、代码、模型边界与参考资料。新增的深入理论包括学习目标、3节详细推导与变量表、科学示意图、定量算例、常见误区与可展开自测。顶栏按钮切换中英文并记住语言，切换保留实验状态。

实验完全在浏览器本机计算。氢/铁轨道提供真正的三维密度等值面、概率云及可移动剖面；MD 和相场默认使用独立的三维求解器，可切换回二维教学模型。其他低维例子的旋转视图标为“立体图示”，与三维计算区分。网站不需要后端、数据库、密钥或付费服务。教学简化模型用于理解概念；其近似与适用范围在章节中明确说明，不应用于未经验证的工程预测。

新增 **8 个双语基础章节**：多尺度动机、各尺度局限、误差传播、电子结构、H/Fe 原子轨道、共价与金属成键、能带与带隙、形成能与相稳定性。每章包含递进讲解、推导、算例、误区、自检与公开参考。轨道可分层探索：氢为解析1s/2s/2p，铁为明确标注Slater屏蔽类氢近似的五个3d及4s。默认显示可旋转的三维等值面，支持调密度阈值、切换概率云和观察内部节点；另有相关误差、二聚化能带和形成能凸包交互。入口为 `#/foundations`，方法页也提供对应先修链接。

首页提供“构件 → 裂纹 → 晶粒 → 位错 → 原子”的连续缩放动画：选区随画面逐渐放大，到达原子后沿原路径缩小，循环往返。可暂停、点击选区或拖动进度；手机同样可操作。切换语言保留进度，实际画面离屏和后台暂停；减少动态效果偏好下默认静止，点击“播放动画”可主动观看。场景是明确标注的概念示意。实现与科学边界见 [逐层放大设计](doc/scale-journey.md)，生产构建后可运行 `npm run test:journey` 验证。

## 本地开发

需要 Node.js 24 与 npm，首次安装或更新依赖：

```bash
npm ci
npm run dev
```

在开发服务器输出的地址打开网站。生产构建与本地预览：

```bash
npm test
npm run build
npm run preview
```

`npm run test:spatial` 检查三维轨道、体数据、MD的xyz运动、相场剖切与手机回退，设计见 [真正三维模型](doc/true-3d.md)。`npm run test:browser` 在生产构建后检查全部章节与图形交互（需要系统 Chromium 或 Playwright Chromium）；`node --test scripts/deploy.test.mjs` 验证发布命令。详见 [验证记录](doc/validation.md)。

`npm test` 检查数值模型；`npm run build` 执行 TypeScript 检查并生成 `dist/`。网站采用 hash 路由和相对资源路径，适合 GitHub Pages 仓库子路径。纯静态托管时保留 `dist/` 的完整文件结构。

源码格式化命令：`npm run format`。网页配色、字号与布局集中在 `src/theme.css`，字体随站点打包，无外部字体服务请求。

## 内容与界面维护

| 文件                               | 用途                                     |
| ---------------------------------- | ---------------------------------------- |
| `src/theme.css`                    | 全站视觉变量与样式；修改 UI 从此文件开始 |
| `src/App.tsx`                      | 导航、尺度地图、课程页面与学习路径       |
| `src/content/methods.ts`           | 11 种方法的结构化课程内容与参考资料      |
| `src/simulations/`                 | 浏览器端数值模型与测试                   |
| `src/components/SimulationLab.tsx` | 2D / 3D 实验、参数、暂停与重置           |
| `src/types.ts`                     | 内容与模拟器共享接口                     |
| `doc/architecture.md`              | 架构、教学原则、实施与验证计划           |
| `doc/numerics.md`                  | 实现模型与数值验证说明                   |
| `doc/scientific-models.md`         | 科学边界与课程说明                       |
| `doc/deployment.md`                | 提交、手动发布与故障排查                 |

## 双语与理论维护

- `src/i18n.tsx`：语言选择、持久化和文档语言；`src/content/ui-en.ts`：界面翻译。
- `src/content/methods.ts` / `methods.en.ts`：中英文课程基础内容。
- `src/content/theory-*.ts`：11章详细理论，含并列的 `zh` 与 `en` 数据。
- `src/components/TheoryFigure.tsx`：11张双语SVG科学示意图。
- `src/content/simulation-i18n.ts`：实验参数、读数与模型说明翻译，不改变数值计算。
- `src/theme.css` 中的 `--reading-size`、`--reading-leading`、`--reading-width` 控制正文；阅读样式仍集中在同一文件。

构建后运行 `npm run test:bilingual`，检查全部英文章节、切换时的实验连续性、语言记忆、手机布局和正文尺寸。`npm test` 同时包含数值与双语内容完整性检查。

基础课程数据位于 `src/content/foundations-*.ts`，轻量目录为 `foundation-index.ts`；`src/foundations/` 保存解析轨道和交互教学模型。阅读界面由 `FoundationsPage.tsx` 组合，图示与交互见 `FoundationFigure.tsx`、`OrbitalExplorer.tsx` 和 `FoundationExperiments.tsx`。布局与图示配色仍集中于 `theme.css`。详见 [基础课程架构](doc/foundations.md)。生产构建后运行 `npm run test:foundations`，验证全部16个语言/章节组合、数学显示、轨道层级、3D与降级、模型控件、语言持久化和手机布局。

## 公式与推导编辑

正文通过 Markdown 与 LaTeX 排版。行内数学使用 `$...$`，独立段落也支持 `$$...$$`。内容存放在 TypeScript 中时，推荐 `String.raw`，避免反斜线被 JavaScript 转义：

```ts
paragraphs: [String.raw`串联时总应变为 $\varepsilon=\varepsilon_e+\varepsilon_v$。`],
formula: String.raw`\dot{\sigma}+\frac{\sigma}{\tau}=E\dot{\varepsilon}`,
symbols: [{ symbol: String.raw`\tau`, meaning: String.raw`松弛时间，$\tau=\eta/E$。` }]
```

`formula` 和 `symbol` 字段只填写 LaTeX，不带美元分隔符；正文、算例、说明、答案和图注使用带分隔符的 Markdown。Python 示例保持代码文本，不参与公式转换。排版样式集中于 `theme.css`；字体随站点打包。

每章 `derivation.stages` 按 `simple` → `general` → `extension` 排列，每阶段分别记录假设、逐步解释与等式、结论。扩展阶段应说明新增自由度或近似条件，不能把不同适用范围的公式直接并列。

`npm test` 严格编译所有正文与公式，并检查推导结构；构建后运行 `npm run test:math`，检查中英文数学显示、MathML、手机布局和实验回归。公共 `MathMarkdown` 组件不解释原始 HTML，KaTeX 不启用受信任 HTML 命令。

## 显式发布

普通 push 只运行验证，**不会重新发布网站**。准备发布时，将修改提交并推送至 `main`，然后运行：

```bash
npm run deploy -- --dry-run  # 只查看发布目标
npm run deploy              # 唯一命令式发布入口
```

发布命令先检查工作区干净、当前 HEAD 与远程 `main` 一致、Git 用户名与邮箱已配置，然后以现有用户身份创建一条 `site: publish <SHA>` 空提交并推送到 `main`。该明确的发布标记才会运行 Pages 构建与部署；普通开发提交会跳过 Pages 的所有 job。命令仅使用 Git，不依赖 GitHub API 或额外令牌，不改变文件内容或作者配置。

在 GitHub 仓库 Settings → Pages 中选择 **GitHub Actions**，并允许 `main` 部署。也可在 Actions → **Publish website** → **Run workflow** 手动触发同一个流程。发布成功与否以 Actions 运行结果和实际页面响应为准。

发布目标固定为 `main`。如果推送失败，脚本保留已生成的发布提交；排除故障后直接运行 `git push origin HEAD:refs/heads/main` 重试，避免创建重复的空提交。

提交使用仓库所有者的 Git 身份，不附加机器人共同作者。Git 作者身份本身不代表 GitHub 写入权限；推送和发布仍使用用户授权的认证方式。

## 许可

沿用仓库的 [GNU GPL v3 许可证](LICENSE)。教材中引用的外部资料由其各自权利人所有；外部链接用于进一步学习。
