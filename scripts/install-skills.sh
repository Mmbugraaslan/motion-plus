#!/usr/bin/env bash
# Copy the skills into your personal Claude skills folder (~/.claude/skills)
set -euo pipefail
SRC="$(cd "$(dirname "$0")/../skills" && pwd)"
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
mkdir -p "$DEST"
for d in "$SRC"/*/; do
  name="$(basename "$d")"
  rm -rf "$DEST/$name"
  cp -r "$d" "$DEST/$name"
  echo "installed $name"
done
