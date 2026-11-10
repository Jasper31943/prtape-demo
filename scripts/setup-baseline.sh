#!/usr/bin/env bash
# Intentional demo project. Initialize a local baseline commit only.
# Does not push, does not add a remote, and does not change global git config.

set -euo pipefail

if [ -n "${GIT_DIR:-}" ] || [ -n "${GIT_WORK_TREE:-}" ]; then
  echo "setup-baseline: refusing to run because GIT_DIR or GIT_WORK_TREE is set." >&2
  echo "Unset both so this script cannot operate on another repository." >&2
  exit 1
fi

SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SOURCE" ]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  case "$SOURCE" in
    /*) ;;
    *) SOURCE="$DIR/$SOURCE" ;;
  esac
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
ROOT="$(cd -P "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT"

if [ ! -f "$ROOT/package.json" ] || [ ! -d "$ROOT/src" ] || [ ! -d "$ROOT/test" ]; then
  echo "setup-baseline: $ROOT does not look like the catalog-page-demo project root." >&2
  exit 1
fi

node -e "const fs=require('node:fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8')); if (p.name!=='catalog-page-demo') { console.error('setup-baseline: unexpected package name'); process.exit(2); }"

PARENT="$(dirname "$ROOT")"
if [ "$PARENT" != "$ROOT" ]; then
  if ENCLOSING="$(git -C "$PARENT" rev-parse --show-toplevel 2>/dev/null)"; then
    echo "setup-baseline: refusing to run inside an enclosing git repository:" >&2
    echo "  $ENCLOSING" >&2
    echo "Unzip the project to a directory that is not inside a git checkout." >&2
    exit 1
  fi
fi

if [ -e "$ROOT/.git" ]; then
  echo "setup-baseline: $ROOT already has .git. Refusing to modify it." >&2
  exit 1
fi

git init --quiet
git symbolic-ref HEAD refs/heads/main
git config --local user.name "AgentTape Demo"
git config --local user.email "demo@example.invalid"
git config --local commit.gpgsign false
git config --local tag.gpgsign false

TOP="$(git rev-parse --show-toplevel)"
if [ "$TOP" != "$ROOT" ]; then
  echo "setup-baseline: git toplevel is $TOP, expected $ROOT. Aborting without adding files." >&2
  exit 1
fi

git add -- \
  .gitattributes \
  .gitignore \
  package.json \
  package-lock.json \
  README.md \
  CLAUDE.md \
  docs \
  scripts \
  src \
  test

unstaged="$(git diff --name-only)"
untracked="$(git ls-files --others --exclude-standard)"
staged="$(git diff --cached --name-only)"
if [ -n "$unstaged" ] || [ -n "$untracked" ] || [ -z "$staged" ]; then
  echo "setup-baseline: refusing to commit a partial tree." >&2
  if [ -n "$unstaged" ]; then
    echo "unstaged:" >&2
    printf '%s\n' "$unstaged" >&2
  fi
  if [ -n "$untracked" ]; then
    echo "untracked:" >&2
    printf '%s\n' "$untracked" >&2
  fi
  if [ -z "$staged" ]; then
    echo "nothing staged" >&2
  fi
  exit 1
fi

git -c user.name="AgentTape Demo" -c user.email="demo@example.invalid" \
  commit -m "$(cat <<'EOF'
Add catalog page listing and acceptance tests.

EOF
)"

if git remote >/dev/null 2>&1 && [ -n "$(git remote)" ]; then
  echo "setup-baseline: a remote is present after init. Refusing to continue." >&2
  exit 1
fi

echo "Baseline commit created in $ROOT"
echo "Identity: AgentTape Demo <demo@example.invalid> (this repository only)"
echo "No remote was added. Do not push."
echo "The initial npm test failure is intentional. Do not repair the source before Claude Code does."
git log -1 --format='commit %H%nAuthor: %an <%ae>'
git status --short --branch
