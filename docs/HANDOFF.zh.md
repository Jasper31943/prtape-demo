# 交接说明（演示项目）

这是一个**有意制作的演示项目**，不是真实客户事故。

目的：在 Mac 上用 Claude Code 录一段真实的英文过程：测试失败 → 查看源码并只改实现 → 测试通过 → 本地 git 提交。

请不要在启动 Claude 之前自己修复。初次 `npm test` 失败是故意留下的。修复提交必须由这次 Claude 会话实际完成。准备阶段的基线提交只包含当前源码和测试。

## 步骤

1. 把源码压缩包解压到一个**不在任何 git 仓库内部**的新目录，例如 `~/recordings/catalog-page-demo`。
2. 在该目录运行 `bash scripts/setup-baseline.sh`。脚本会拒绝嵌套在其他仓库里的目录，只在本目录建立仓库并做基线提交。它使用仓库本地身份 `AgentTape Demo` / `demo@example.invalid`，不修改全局 git 配置，不添加远程，也不 push。
3. 按 `docs/RECORDING.md` 开始录屏。在项目目录启动 Claude Code，并粘贴其中的英文提示词。要求 Claude 全部用英文回答。
4. 会话结束后，在 Finder 按 **Command+Shift+G**，打开 `~/.claude/projects`，按修改时间找到这次会话的 `.jsonl`。
5. 把该 `.jsonl` **私下**发给工程师。不要公开原始会话文件。

核对测试文件未被改动：

```sh
shasum -a 256 -c test/INTEGRITY.sha256
```

需要 Node.js 20 或更新版本。没有运行时依赖，不必 `npm install`。
