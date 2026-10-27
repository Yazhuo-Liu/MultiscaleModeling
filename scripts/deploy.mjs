#!/usr/bin/env node
/** Explicit publication entry point. No GitHub API or CLI authentication needed. */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('..', import.meta.url));
const repository = 'Yazhuo-Liu/MultiscaleModeling';
const ref = 'main';
const marker = 'site: publish ';
const dryRun = process.argv.slice(2).includes('--dry-run');
const unknown = process.argv.slice(2).filter((arg) => arg !== '--dry-run');

function fail(message) {
  console.error(message);
  process.exit(1);
}
function run(command, args, { inherit = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
    shell: false,
  });
  if (result.error) fail(`无法运行 ${command}：${result.error.message}`);
  return result;
}
function git(args) {
  const result = run('git', args);
  if (result.status !== 0) fail(`Git 检查失败：${args[0]}。请检查仓库与网络连接。`);
  return result.stdout.trim();
}

if (unknown.length) fail('支持的参数：--dry-run。发布目标固定为 main。');
if (process.env.DEPLOY_REF && process.env.DEPLOY_REF !== ref) {
  fail('发布工作流只接受 main。请先把待发布内容提交并推送到 main；不支持其他 DEPLOY_REF。');
}
if (dryRun) {
  console.log(`发布仓库：${repository}\n发布分支：${ref}`);
  console.log('正式执行前检查：工作区干净、当前 HEAD 等于远程 main、现有 Git 用户名和邮箱已配置。');
  console.log('正式执行：git commit --allow-empty -m "site: publish <当前完整 SHA>"');
  console.log('随后执行：git push origin HEAD:refs/heads/main');
  console.log('检查模式：没有创建提交、推送或触发发布。');
  process.exit(0);
}
if (git(['status', '--porcelain']).length) {
  fail('工作区有未提交修改。请先完成检查、提交并推送，再执行 npm run deploy。');
}
for (const key of ['user.name', 'user.email']) {
  const result = run('git', ['config', '--get', key]);
  if (result.status !== 0 || !result.stdout.trim()) {
    fail(`请先配置你自己的 Git ${key}。发布脚本不会替换作者身份。`);
  }
}
const localCommit = git(['rev-parse', 'HEAD']);
const remoteLines = git(['ls-remote', '--exit-code', 'origin', `refs/heads/${ref}`]);
const remoteCommit = remoteLines.split(/\s+/)[0];
if (localCommit !== remoteCommit) {
  const subject = git(['log', '-1', '--format=%s']);
  const parent = run('git', ['rev-parse', 'HEAD^']);
  if (subject.startsWith(marker) && parent.status === 0 && parent.stdout.trim() === remoteCommit) {
    fail('本地保留了尚未推送的发布提交。请检查后重试 git push origin HEAD:refs/heads/main；无需再次创建发布提交。');
  }
  fail(`当前 HEAD 与远程 ${ref} 不一致。请先将待发布提交推送到该分支。`);
}
console.log(`创建 ${repository} 的发布标记：${localCommit.slice(0, 8)}`);
const commit = run('git', ['commit', '--allow-empty', '-m', `${marker}${localCommit}`], { inherit: true });
if (commit.status !== 0) fail('发布标记提交失败；尚未推送。请检查 Git 输出。');
const push = run('git', ['push', 'origin', `HEAD:refs/heads/${ref}`], { inherit: true });
if (push.status !== 0) {
  fail('推送失败；本地发布提交已保留，没有撤销任何工作。检查网络/远程状态后，重试 git push origin HEAD:refs/heads/main。不要再次创建发布提交。');
}
console.log('发布标记已推送，GitHub Actions 将执行 Publish website；尚不表示部署完成。');
console.log(`查看进度：https://github.com/${repository}/actions/workflows/pages.yml`);
console.log('发布不调用 GitHub API。也可在 Actions 页面使用 Run workflow 手动重发。');
