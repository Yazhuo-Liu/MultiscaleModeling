# 初版验证记录

验证环境：Node.js 24、Linux Chromium、静态构建部署于 `/MultiscaleModeling/` 子路径。测试脚本保留在仓库，可重复执行。

## 已完成

- `npm ci`：使用提交的 lockfile 重新安装成功。
- `npm test`：22 项数值检查通过，0 失败、0 跳过。包括全 11 模型参数端点有限性与可重复重置，以及变分能量下降、粒子/电子数、MD 能量漂移、Ising 冷却、位错端点、KMC 物理时钟、相场能量、Schmid 阈值、Maxwell 解析松弛、杆 FEM 解析解、热方程最大值原理。
- `node --test scripts/deploy.test.mjs`：4 项真实临时 Git 集成测试通过，验证显式发布、用户身份、拒绝脏工作区与失败恢复。
- `npm run build`：TypeScript 与 Vite 生产构建通过。Three.js 实验按需加载，构建器会提示该实验 chunk 超过 500 kB；压缩传输约 138 kB，不影响首页按需加载。
- `npm run test:browser`：11 章理论/代码/参考入口、运行/暂停/单步/重置、参数、2D/3D、代码与 CSV 下载、搜索/筛选、学习路径/比较/参考页、390px 移动端导航与无横向溢出，静态子路径资源加载，无 JavaScript 错误。
- 全部 11 段独立 Python / NumPy 教学示例实际执行成功。
- MD 另在四组温度/密度端点各积分 20,000 步，最坏能量漂移约 0.0351%；详见 numerics.md。

## 复现浏览器检查

```bash
npm ci
npm run build
npx playwright install chromium  # 如没有系统 Chromium 或已安装的 Playwright 浏览器
npm run test:browser
```

脚本优先使用 `/usr/bin/chromium`，也可设 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`；截图保存在被 Git 忽略的 `test-results/`。浏览器脚本自动提供临时静态服务器并关闭自己启动的进程。

## 解释边界

这些检查验证教材交互和已声明的教学模型，不等同于真实材料的预测精度验证。DFT/HF、Schmid 激活等示例的简化在课程与科学说明中明确。网站发布是否完成应以对应 Actions 运行及线上响应为准，不以本地构建成功代替。

## 首次发布

2026-10-27 已通过 `npm run deploy` 发布提交 `7f6cb11`。

- [Pages workflow](https://github.com/Yazhuo-Liu/MultiscaleModeling/actions/runs/40457840939)：build / deploy 成功。
- [线上网站](https://yazhuoliu.com/MultiscaleModeling/)：HTTPS 200，标题正确；主脚本、样式和 Three.js 实验脚本的 SHA256 与发布前测试产物逐一一致。
- GitHub contributor API 仅返回 `Yazhuo-Liu`；所有提交沿用初始提交的用户作者邮箱。
- 发布后只整理源码格式和记录，没有再次触发部署。后续需要更新线上版本时再运行专门发布命令。

浏览器检查还实际拖拽三维相机并比较渲染结果，验证 WebGL 不可用时二维降级，以及减少动态效果偏好下的初始暂停状态。

## 中英文与理论深化版本

- 11 章均提供完整中英文基础内容与详细理论，共 33 个深入理论小节（每节两种语言）。
- 11 张独立 SVG 科学示意图，双语变量、图注与可访问说明；图形对应实际公式或明确标注的示意关系。
- `npm test`：35 项检查，包括原有 22 项数值检查与 13 项双语内容完整性检查。
- `npm run test:bilingual`：11 章英文理论/代码/参考/实验无中文遗漏，图示/算例/自测完整；语言偏好刷新保留；切换保留路由、章节标签、参数、读数、进度、运行状态及三维画布。
- 手机 390px 中英文无文档横向溢出；理论正文 16px；图示自身可横向查看，正文不随图缩小。
- 所有英文 Python 示例实际运行成功，并与中文示例比较了去除注释/字符串后的数值算法 AST。
- 保留科学边界和必要操作提示，移除本机计算、浏览器实现等重复产品文案。
