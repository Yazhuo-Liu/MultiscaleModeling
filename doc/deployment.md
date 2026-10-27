# 开发、验证与显式发布

## 环境与目录

使用现有 `/workspace/MultiscaleModeling` checkout。云任务已经隔离，不需要额外 worktree。Node.js 24；通过已提交的 `package-lock.json` 执行 `npm ci`，避免无意升级。

```bash
cd /workspace/MultiscaleModeling
npm ci
npm test
node --test scripts/deploy.test.mjs
npm run build
npm run dev
```

开发服务器是本地验证入口。`npm run preview` 用于验证 `dist/` 生产产物。全部模拟在浏览器中执行，不依赖后台服务；新机器只需启动开发或静态预览服务器。

## 验证与发布分离

- `.github/workflows/ci.yml`：push 到 `main` / `work` 或 pull request 时运行测试和构建，不包含部署步骤。
- `.github/workflows/pages.yml`：接受 main push 与 `workflow_dispatch`，但只有提交消息以 `site: publish ` 开头或手动 dispatch 时才执行 build；deploy 依赖 build。普通提交使所有 Pages job 跳过，不重新构建或部署网站。
- `scripts/deploy.mjs`：`npm run deploy` 的专门发布入口。目标固定为 `main`；使用参数数组调用 Git，不执行 shell 字符串，不依赖 GitHub API 或 `gh`。
- 发布前检查工作区干净、当前 HEAD 与远程 main 一致、已有 Git 用户名和邮箱。它不改变作者配置。
- 检查通过后创建一条以现有用户身份署名的 `site: publish <当前完整 SHA>` 空提交并 push `HEAD:refs/heads/main`，不更改文件内容，不强推。
- `npm run deploy -- --dry-run` 只说明目标、检查和操作，不创建提交或请求发布。

`node --test scripts/deploy.test.mjs` 使用临时本地 bare 仓库测试发布保护、同身份空提交、推送失败后的保留与重试，不访问 GitHub。CI 和 Pages 构建都会执行这些检查。

这种方式把发布意图保存在明确的提交中，同时沿用 main 的 Pages 环境保护规则。每次正式发布会多一条空提交。不要把普通开发提交命名为 `site: publish ...`，因为这是保留的发布命令标记。

## 首次设置

仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。如使用 Pages 环境的分支限制，允许 `main`。仓库 Actions 必须启用，工作流需要 `pages: write` 与 `id-token: write`（已限制在部署 job 中）。

复用现有 HTTPS Git 认证。发布脚本不需要新增令牌；不要将凭据写入代码、文档或聊天。普通内容提交和发布标记都使用仓库所有者已有 Git 作者身份，不添加机器人共同作者。

## 一次发布流程

先运行测试和生产构建，完成浏览器检查，再按模块提交、push。最后：

```bash
npm run deploy -- --dry-run
npm run deploy
```

脚本输出 Actions 工作流地址。打开 **Publish website**，确认本次发布提交对应的运行完成。API 可访问并且已有授权时也可查询：

```bash
gh run list --repo Yazhuo-Liu/MultiscaleModeling --workflow pages.yml --limit 5
gh run watch RUN_ID --repo Yazhuo-Liu/MultiscaleModeling --exit-status
```

Actions 成功后打开工作流给出的 `page_url`，检查首页、章节 hash 路由及实验。预计标准 Pages 路径为 `https://yazhuo-liu.github.io/MultiscaleModeling/`；该地址在部署成功并实际检查之前只是预期地址。

## 失败后恢复

若发布提交已生成但 push 失败，它会留在本地，没有自动 reset、撤销或覆盖。检查网络、认证和远程状态后：

```bash
git push origin HEAD:refs/heads/main
```

再次运行 `npm run deploy` 遇到此状态会提示重试已有提交，不会不断生成空提交。如果远程 main 已有新提交，先正常整合变更并重新验证，再决定重新发布，不使用强推。

## 常见故障

| 现象                           | 处理                                                               |
| ------------------------------ | ------------------------------------------------------------------ |
| 工作区不干净                   | 完成检查、提交和普通 push，再执行发布命令                          |
| 当前 HEAD 与远程 main 不一致   | 先 push 待发布内容；若已有未推送发布标记，按脚本提示重试该 push    |
| Git 用户名或邮箱缺失           | 配置你自己的 Git 身份；脚本不会代设机器人身份                      |
| 设置了其他 `DEPLOY_REF`        | 当前发布入口固定为 main；其他分支不受支持                          |
| Pages configure 或 deploy 失败 | 检查 Pages source、Actions 权限、Pages 环境保护规则和部署 job 日志 |
| GitHub API 返回 Forbidden      | 命令式发布不使用 API；从仓库 Actions 网页查看结果即可              |
| 构建成功但某章节 404           | 使用站内 `#/method/...` hash 链接；不要把 hash 路由改为服务端路径  |

Actions → Publish website → Run workflow 是备用手动入口。脚本返回“发布标记已推送”只证明 Git 推送成功，不证明构建或部署完成。
