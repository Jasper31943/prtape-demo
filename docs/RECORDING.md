# Mac recording instructions

This is an **intentional demo project**, not a real customer incident.

This file is for the person recording the session. Claude Code's instructions are in `CLAUDE.md`.

The unzipped source is supposed to fail `npm test`. That failure is intentional. Do not repair the source yourself before you launch Claude Code. The baseline commit from the setup script is the commit before the recording. Claude has to make the source-fix commit during the session.

## Before you record

1. Unzip the source archive into a new folder that is not inside an existing git checkout. Example: `~/recordings/catalog-page-demo`.
2. Open Terminal and `cd` into that folder.
3. Check Node.js 20 or newer with `node -v`. You do not need `npm install`.
4. Run:

   ```sh
   bash scripts/setup-baseline.sh
   ```

   The script refuses to continue if this folder sits inside another git repository, if `GIT_DIR` or `GIT_WORK_TREE` is set, or if `.git` already exists. It sets a repository-local identity only (`AgentTape Demo` / `demo@example.invalid`). It does not change global git config, does not add a remote, and does not push.
5. You may run `npm test` once to see the failure. Leave the code unchanged after that.

## Record

1. Start the screen recording.
2. From the project directory, start Claude Code.
3. Paste the English prompt in `CLAUDE.md` (the same text is included below). Claude's replies must all be in English.
4. Let Claude run `npm test`, read the code, change only files under `src/`, run `npm test` again, explain one concise pagination-boundary decision, inspect the diff, and commit locally.
5. Stop after that local commit. Do not push.

## Prompt to paste

```text
All of your responses must be in English.

This is an intentional demo project, not a real customer incident. The catalog paging contract is in README.md. The acceptance tests express that contract. Do not weaken them.

1. Run `npm test` first and keep the real failure output.
2. Inspect the source under `src/` and the tests under `test/`.
3. Do not edit, delete, rename, or skip tests. Do not change assertions, expected values, fixtures, or test configuration. Do not change package.json, package-lock.json, test/INTEGRITY.sha256, or any file outside src/.
4. Fix the implementation under `src/` only.
5. Run `npm test` again and continue until the suite passes.
6. Explain one concise decision you made about the pagination boundary.
7. Inspect the diff.
8. Commit the source fix locally. Do not push. Do not add a remote. Do not change git config. Use the existing repository-local identity AgentTape Demo <demo@example.invalid>.
```

## After the session

Confirm the tests were not modified. From the project root:

```sh
shasum -a 256 -c test/INTEGRITY.sha256
```

In Finder, press **Command+Shift+G** and go to:

```text
~/.claude/projects
```

Open the project folder whose name matches this session and locate the session `.jsonl` (sort by Date Modified). Send that file privately to the engineer. Do not publish the raw session.

A short Chinese handoff is in `docs/HANDOFF.zh.md`.
