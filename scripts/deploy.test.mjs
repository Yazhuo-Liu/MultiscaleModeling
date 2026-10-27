import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  chmodSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const source = readFileSync(new URL("./deploy.mjs", import.meta.url), "utf8");
const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
};
delete env.DEPLOY_REF;

// All pushes below target a temporary local bare repository, never GitHub.
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "multiscale-deploy-"));
  const repo = join(root, "checkout");
  const remote = join(root, "remote.git");
  mkdirSync(repo);
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repo,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "--bare", remote);
  git("init", "--initial-branch=main");
  git("config", "user.name", "Yazhuo Liu");
  git("config", "user.email", "115053670+Yazhuo-Liu@users.noreply.github.com");
  mkdirSync(join(repo, "scripts"));
  writeFileSync(join(repo, "scripts/deploy.mjs"), source);
  git("add", ".");
  git("commit", "-m", "Fixture initial state");
  git("remote", "add", "origin", remote);
  git("push", "origin", "HEAD:refs/heads/main");
  const run = (args = [], extraEnv = {}) =>
    spawnSync(process.execPath, ["scripts/deploy.mjs", ...args], {
      cwd: repo,
      env: { ...env, ...extraEnv },
      encoding: "utf8",
    });
  return {
    root,
    repo,
    remote,
    git,
    run,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("dry run has no Git side effects and rejects unsupported arguments/ref", () => {
  const f = fixture();
  try {
    const before = f.git("rev-parse", "HEAD");
    assert.equal(f.run(["--dry-run"]).status, 0);
    assert.equal(f.git("rev-parse", "HEAD"), before);
    assert.equal(f.run(["--unknown"]).status, 1);
    assert.equal(f.run(["--dry-run"], { DEPLOY_REF: "other" }).status, 1);
  } finally {
    f.cleanup();
  }
});

test("dirty worktree, missing identity, and unpushed content block publication", () => {
  const f = fixture();
  try {
    const before = f.git("rev-parse", "HEAD");
    writeFileSync(join(f.repo, "draft.txt"), "unfinished");
    assert.match(f.run().stderr, /未提交修改/);
    rmSync(join(f.repo, "draft.txt"));
    f.git("config", "--unset", "user.email");
    assert.match(f.run().stderr, /user.email/);
    f.git(
      "config",
      "user.email",
      "115053670+Yazhuo-Liu@users.noreply.github.com",
    );
    assert.equal(f.git("rev-parse", "HEAD"), before);
    f.git("commit", "--allow-empty", "-m", "Unpushed development commit");
    const unpushed = f.git("rev-parse", "HEAD");
    assert.match(f.run().stderr, /不一致/);
    assert.equal(f.git("rev-parse", "HEAD"), unpushed);
  } finally {
    f.cleanup();
  }
});

test("publication creates exactly one empty commit with existing identity and pushes main", () => {
  const f = fixture();
  try {
    const before = f.git("rev-parse", "HEAD");
    const tree = f.git("rev-parse", "HEAD^{tree}");
    const identity = f.git("log", "-1", "--format=%an <%ae>");
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(f.git("rev-parse", "HEAD^"), before);
    assert.equal(f.git("rev-parse", "HEAD^{tree}"), tree);
    assert.equal(f.git("log", "-1", "--format=%s"), `site: publish ${before}`);
    assert.equal(f.git("log", "-1", "--format=%an <%ae>"), identity);
    assert.equal(
      f.git("ls-remote", "origin", "refs/heads/main").split(/\s+/)[0],
      f.git("rev-parse", "HEAD"),
    );
  } finally {
    f.cleanup();
  }
});

test("failed push retains release commit and rerun does not create another", () => {
  const f = fixture();
  try {
    const before = f.git("rev-parse", "HEAD");
    const hook = join(f.remote, "hooks/pre-receive");
    writeFileSync(hook, "#!/bin/sh\nexit 1\n");
    chmodSync(hook, 0o755);
    const first = f.run();
    assert.equal(first.status, 1);
    assert.match(first.stderr, /本地发布提交已保留/);
    const pending = f.git("rev-parse", "HEAD");
    assert.notEqual(pending, before);
    assert.equal(f.git("rev-parse", "HEAD^"), before);
    const second = f.run();
    assert.equal(second.status, 1);
    assert.match(second.stderr, /无需再次创建发布提交/);
    assert.equal(f.git("rev-parse", "HEAD"), pending);
    rmSync(hook);
    f.git("push", "origin", "HEAD:refs/heads/main");
    assert.equal(
      f.git("ls-remote", "origin", "refs/heads/main").split(/\s+/)[0],
      pending,
    );
  } finally {
    f.cleanup();
  }
});
