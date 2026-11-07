---
name: talking-head-edit
description: Auto-edit a raw talking-head recording into a social-ready vertical video, with silence cuts, punch-in zooms, word-by-word captions and loudness at -14 LUFS. Use when the user sends a selfie/face-cam clip to edit for Instagram, TikTok or Shorts.
---

# Talking-Head Edit

## 1. Inspect the clip
```bash
ffprobe -v error -show_entries stream=codec_type,width,height,avg_frame_rate:format=duration -of default=nw=1 input.mp4
```
Tell the user if the clip is lower than 1080x1920: messaging apps (Telegram, WhatsApp) compress video, so ask for the original file. Keep going with what you have; the script upscales.

## 2. Auto-cut + transcribe
```bash
pip install faster-whisper --break-system-packages   # first time
python3 scripts/talking_head.py input.mp4 --name my-reel --lang en
```
- `--lang`: spoken language (`en`, `tr`, `es`…). Always set it.
- `--model`: faster-whisper model name (`small` default, `medium` for better accuracy) or a local CTranslate2 folder.
- `--fix "wrong=right"`: correct misheard words (repeatable). Brand names, product names and English tech words are the usual suspects.
- `--emphasize word …`: words that get a pop animation.

This writes `studio/public/footage/my-reel.mp4` (1080x1920, 30 fps, -14 LUFS) and `studio/edits/my-reel.json` (cut list + caption groups, one per sentence). Read the printed transcript, compare it with what the user meant to say and fix words with `--fix` or by editing the JSON.

## 3. Render
```bash
bash scripts/render.sh edits/my-reel.json --comp TalkingReel
```

## 4. Overlays (optional)
For callouts, badges, code cards, B-roll or a comment-style CTA, add `<Sequence>` blocks on top of `TalkingReel` timed to caption word times (`startMs` in the edit JSON). Keep overlays out of the face area (top ~55% of frame on a typical selfie) and above the captions.

## 5. Review
Run the `review-loop` skill. Also check:
- First frame: eyes open, face visible. If not, suggest picking a cover frame in the app.
- No caption page spans two sentences.
- Cuts land between words, not mid-word (adjust `--pre` / `--post`).
