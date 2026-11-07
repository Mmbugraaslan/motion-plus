#!/usr/bin/env bash
# Pre-delivery check: size, fps, duration + contact sheet, phone test and first frame
set -euo pipefail
F="${1:?video path}"
DIR="$(dirname "$F")/review"; mkdir -p "$DIR"
NAME="$(basename "${F%.*}")"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate:format=duration -of default=nw=1 "$F"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
N=$(python3 -c "import math; print(max(1, math.ceil(float('$DUR'))))")
ffmpeg -v error -y -i "$F" -vf "fps=1,scale=240:-1,tile=8x$(( (N + 7) / 8 ))" -frames:v 1 "$DIR/${NAME}_contact.png"
ffmpeg -v error -y -i "$F" -vf "fps=1/3,scale=360:-1,tile=6x$(( (N / 3 + 6) / 6 ))" -frames:v 1 "$DIR/${NAME}_phone.png"
ffmpeg -v error -y -i "$F" -vf "select=eq(n\,0)" -frames:v 1 "$DIR/${NAME}_first_frame.png"
echo "Review sheets: $DIR/${NAME}_contact.png  $DIR/${NAME}_phone.png  $DIR/${NAME}_first_frame.png"
