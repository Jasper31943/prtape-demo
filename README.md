# Catalog page demo

This repository is a **Demo project for AgentTape**. It is an intentional demo, not a customer incident.

The pagination fix was recorded in a **real Claude Code session**. The pull request applies the **same diff, re-committed** under the demo identity `AgentTape Demo <demo@example.invalid>`. It is not the original session commit.

This GitHub repository is **private**. Do not make it public. Do not publish it to npm.

It is a small in-memory catalog with a page API and acceptance tests. The tests describe the contract below. They are the acceptance criteria. Do not change, delete, or skip them to match the current implementation.

## Contract

`createCatalog(records).page({ page, pageSize })` returns one page of records in stored order.

- `page` is a 1-based integer greater than or equal to 1. Page 1 is the first page.
- `pageSize` is an integer greater than or equal to 1. It is the maximum number of records in `items`.
- `totalItems` is the number of records stored in the catalog.
- `totalPages` is `0` when the catalog is empty. Otherwise it is `Math.ceil(totalItems / pageSize)`.
- When the catalog is empty, page 1 returns `items: []`, `totalItems: 0`, and `totalPages: 0`.
- A valid `page` greater than `totalPages` returns `items: []`. It does not repeat records from earlier pages. `totalPages` is still reported.
- When at least `pageSize` records remain at the start of the requested page, `items` contains exactly those `pageSize` records.
- When fewer than `pageSize` records remain, `items` contains every remaining record, including the last record in the catalog.
- When `totalItems` is an exact multiple of `pageSize`, every page through `totalPages` contains exactly `pageSize` records, and the last page includes the final record.
- Concatenating `items` from page 1 through `totalPages`, in order, reproduces the catalog exactly: no missing records and no duplicates.
- A `page` or `pageSize` that is not an integer greater than or equal to 1 throws `TypeError`.
- Returned records are copies of the stored records.

`planPageQuery(totalItems, { page, pageSize })` plans that window. `offset` is the zero-based index `(page - 1) * pageSize`. `limit` equals `pageSize`.

## Requirements

- Node.js 20 or newer
- No runtime dependencies. `npm install` is not required.
- macOS or Linux

## Run the tests

```sh
npm test
```

The test runner is Node's built-in `node:test` module. The acceptance tests stay as they are. `docs/RECORDING.md` is for the person recording a repair session. `CLAUDE.md` is the session brief.

## Local baseline commit

From a freshly unzipped copy that is **not** inside another git repository:

```sh
bash scripts/setup-baseline.sh
```

The script checks that this directory is the project root and refuses to run when a parent directory belongs to a different git repository, when `GIT_DIR` or `GIT_WORK_TREE` is set, or when this directory already has `.git`. It then creates a repository-local baseline commit containing the source and tests.

Repository-local identity used by that commit:

- Name: `AgentTape Demo`
- Email: `demo@example.invalid`

The script does not change global git config, does not add a remote, and does not push.

## Test integrity

`test/INTEGRITY.sha256` is a SHA-256 manifest of the acceptance tests. After a repair session, from the project root:

```sh
shasum -a 256 -c test/INTEGRITY.sha256
```

On Linux, `sha256sum -c test/INTEGRITY.sha256` checks the same file. The tests are not gitignored.

## Layout

- `src/page-query.js` plans a page window
- `src/catalog.js` returns one page from the stored records
- `test/catalog-pages.test.js` is the acceptance suite
