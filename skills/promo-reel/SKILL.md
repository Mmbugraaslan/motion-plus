---
name: promo-reel
description: Turn a short brief into a branded vertical promo video (15 or 30 sec, 1080x1920) with the Motion Plus Remotion template. Use for campaign, offer, product or bonus promo videos, Reels, Shorts and TikToks.
---

# Promo Reel

Builds a vertical promo from `studio/briefs/<name>.json` plus a brand preset in `studio/brands/`.
Scenes: Hook → Offer (animated number) → Points → CTA, over an ambient branded background.

## 1. Load the brand
Read `studio/brands/<brand>.json` before writing anything. Every brand has:
- `colors`, `locale` (e.g. `en`, `tr`), `cta`, `ctaLead`, optional `mascot` (path under `studio/public/`)
- `bannedPhrases`: never put these on screen or in a voiceover
- `rules`: house rules for this client; treat them as hard requirements

If the brand does not exist, create `studio/brands/<id>.json` with the same shape and register it in `studio/brands/index.ts`.

## 2. Write the brief
```json
{
  "brand": "demo",
  "duration": 15,
  "hook": "Write a brief get a video",
  "offer": { "label": "Render time", "value": 15, "prefix": "", "suffix": " sec" },
  "points": ["Brand presets", "Word-timed captions", "Built-in quality check"],
  "cta": "optional override of brand.cta",
  "ctaLead": "optional override of brand.ctaLead",
  "terms": "small print, quoted exactly as the client wrote it",
  "useMascot": true,
  "voice": "audio/voice.mp3",
  "music": "audio/music.mp3",
  "musicVolume": 0.18,
  "captions": [],
  "emphasize": ["15"]
}
```
Rules:
- Hook: max 6 words, a promise or a question. It is visible on frame 0 (the first frame is the cover on mobile).
- Points: 2-4 items, max ~5 words each.
- Numbers, prices, percentages and terms come from the client's source text, never invented. If the user gives tiers, use the example they ask for.
- Check every on-screen string and the voiceover script against `bannedPhrases`.
- Audio files go in `studio/public/audio/`. For word-timed captions of a voiceover, use the `word-captions` skill and paste the result into `captions`.

## 3. Render
```bash
cd studio && npm install          # first time only
bash ../scripts/render.sh briefs/<name>.json
```
For both cuts of a campaign, make `<name>-15.json` and `<name>-30.json`; the template scales every scene to `duration`.
If Remotion cannot download Chrome, set `REMOTION_CHROME=/path/to/chrome-headless-shell`.

## 4. Review before delivering
`render.sh` runs `scripts/check_export.sh`, which prints size/fps/duration and writes a contact sheet, a phone-size sheet and the first frame to `studio/out/review/`. Open them and run the `review-loop` skill. Deliver only 1080x1920, 30 fps.

## Changing the look
Scenes live in `studio/src/scenes/`. Follow the `motion-design` skill: ease-out entrances, ease-in exits, one accent color, primary + secondary + ambient motion layers, no linear movement.
