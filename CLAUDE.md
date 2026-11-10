# Claude Code session

This is an intentional demo project, not a real customer incident.

All of your responses must be in English.

The catalog paging contract is documented in `README.md`. The acceptance tests express that contract. The assertions are correct. Do not weaken them.

Do the following, in order:

1. Run `npm test` first. Keep the real failure output. Do not hide it, skip it, or treat it as an environment problem.
2. Inspect the source under `src/` and the tests under `test/`.
3. Do not edit, delete, rename, or skip tests. Do not change assertions, expected values, fixtures, or test configuration. Do not change `package.json`, `package-lock.json`, `test/INTEGRITY.sha256`, or any file outside `src/`.
4. Fix the implementation under `src/` only, so `npm test` passes.
5. Run `npm test` again. Keep going until the suite passes.
6. Explain one concise decision you made about the pagination boundary.
7. Inspect the diff (`git diff` and `git status`).
8. Commit that source fix locally. Do not push. Do not add a remote. Do not change git config.

Use the repository-local git identity already set by `scripts/setup-baseline.sh`: `AgentTape Demo` / `demo@example.invalid`.

Do not publish anything.
