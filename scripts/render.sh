#!/usr/bin/env bash
# Usage: scripts/render.sh <props.json> [--comp PromoReel|TalkingReel] [--out out/file.mp4]
#   scripts/render.sh briefs/demo-15.json
#   scripts/render.sh edits/my-reel.json --comp TalkingReel
set -euo pipefail
cd "$(dirname "$0")/../studio"
PROPS="${1:?pass a props file, e.g. briefs/demo-15.json}"; shift
COMP="PromoReel"; OUT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --comp) COMP="$2"; shift 2 ;;
    --out) OUT="$2"; shift 2 ;;
    *) echo "unknown option: $1"; exit 1 ;;
  esac
done
OUT="${OUT:-out/$(basename "${PROPS%.json}").mp4}"
mkdir -p "$(dirname "$OUT")"
ARGS=()
if [[ -n "${REMOTION_CHROME:-}" ]]; then
  ARGS+=(--browser-executable="$REMOTION_CHROME")
fi
npx remotion render src/index.ts "$COMP" "$OUT" --props="$PROPS" --codec=h264 --crf=18 "${ARGS[@]}"
bash ../scripts/check_export.sh "$OUT"
