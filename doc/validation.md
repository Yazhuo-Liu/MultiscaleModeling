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
