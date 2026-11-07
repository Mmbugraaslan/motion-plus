# Motion Plus: house rules

## Output
- Vertical 1080x1920, 30 fps, H.264. Render at size, never crop or upscale a render.
- Audio around -14 LUFS, voice always above music.
- The first frame is never empty: no black intro, no white flash (it is the cover on mobile).

## Brands
- Read `studio/brands/<brand>.json` before writing any copy.
- `bannedPhrases` never appear on screen or in a voiceover.
- `rules` are hard requirements for that client.
- Numbers, prices and terms come from the client's text, never invented.

## Motion
- Follow `skills/motion-design`: ease-out entrances, ease-in exits, no linear spatial movement, primary + secondary + ambient layers.
- One accent color per brand for highlights.

## Before showing anything
Run `scripts/check_export.sh` on the render and the `review-loop` skill. Fix the 3 worst problems, repeat.
