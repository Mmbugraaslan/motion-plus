---
name: review-loop
description: Review a rendered video like a strict director before showing it to anyone, using contact sheets, a phone-size test, the first frame, loudness and a fix-the-worst-3 loop. Use after every render.
---

# Review Loop

## 1. Make the frames come to you
```bash
bash scripts/check_export.sh path/to/video.mp4
ffmpeg -hide_banner -i path/to/video.mp4 -af ebur128=framelog=quiet -f null - 2>&1 | grep -A2 Integrated
```
Open `*_contact.png` (1 fps), `*_phone.png` (360 px wide) and `*_first_frame.png`.

## 2. Critic pass
You did not make this video. Check:
- Spec: 1080x1920, 30/1 fps, planned duration; loudness around -14 LUFS.
- First frame: content visible (it is the cover on mobile). No black intro, no white flash.
- Readability at phone size: captions and key numbers readable at 360 px wide.
- Safe areas: nothing important in the bottom ~250 px or right ~120 px (platform UI).
- Overlays never cover the face or the captions.
- Text: no overflow, no wrong casing, no misheard words, no banned phrases (brand JSON).
- Facts: every number, price and term matches the source.
- Motion: no linear spatial moves, nothing static for more than ~3 sec without a new idea.

## 3. Fix the worst 3, repeat
List every problem with a timestamp. Fix the three worst, re-render (use `npx remotion still … --frame=<n>` for single-frame checks), and repeat until the list is empty or only taste notes remain.
Write each fix as WHERE (frames) / PROBLEM / CHANGE / KEEP so nothing else moves.
