# Multiscale Modeling

多尺度材料建模的**可扩展**入门站点：介绍、WebGL 可视化、浏览器端轻量计算。

## 技术选型

| 能力 | 选择 | 说明 |
|------|------|------|
| 界面 / 路由 | React + Vite + TypeScript | 模块页面壳与注册表 |
| 浏览器计算 | TypeScript（可后续换 WASM） | 统一 `ComputeDemo` 接口 |
| 渲染 | Three.js（WebGL） | 统一 `RenderDemo` / `mountSimpleScene` |
| 部署 | GitHub Pages | **仅**在打 `vX.Y` 类 tag 时部署 |

## 扩展一个新模块

1. 新建 `src/modules/<id>/index.ts`，导出符合 `ModelingModule` 的对象（`intro` 必填，`render` / `compute` 可选）。
2. 在 `src/modules/index.ts` 里 `registerModule(...)`。
3. 无需改路由、布局或 CI。

接口定义见 [`src/core/types.ts`](src/core/types.ts)。

当前内置：`dft` · `ms` · `neb` · `md` · `thermo` · `fem`。

## 本地开发

```bash
npm install
npm run dev
```

```bash
npm run build    # 类型检查 + 生产构建
npm run preview  # 预览 dist
```

若仓库以 GitHub Pages **项目站**发布，构建时设置：

```bash
VITE_BASE=/MultiscaleModeling/ npm run build
```

## 部署（仅 tag）

工作流：[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

- 触发条件：`push` 且 tag 匹配 `v[0-9]+.[0-9]+*`（如 `v0.1`、`v1.0.0`）
- **普通 commit / PR 不会部署**

```bash
git tag v0.1.0
git push origin v0.1.0
```

仓库 Settings → Pages → Source 选 **GitHub Actions**。

## 目录结构

```
src/
  core/           # 框架：类型、注册表、渲染宿主、计算工具
  components/     # 通用 Intro / Render / Compute 宿主 UI
  modules/        # 彼此独立的专题模块
  pages/          # 总览与模块页
  styles/         # 浅色主题全局样式
```

## License

GPL-3.0（见 [LICENSE](LICENSE)）
