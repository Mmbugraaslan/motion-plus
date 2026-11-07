---
name: word-captions
description: Add word-timed, TikTok-style captions to Remotion videos, from transcribing speech with faster-whisper (any language) to Caption JSON, the highlighted caption track and .srt import. Use for captions or subtitles on any video.
---

# Word Captions

All captions use the `Caption` type from `@remotion/captions`:
```ts
type Caption = { text: string; startMs: number; endMs: number; timestampMs: number | null; confidence: number | null };
```
`text` keeps a leading space before each word (`" hello"`).

## Transcribe
For talking-head clips, `scripts/talking_head.py` already transcribes and outputs caption groups.
For a standalone voiceover:
```python
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
segments, _ = m.transcribe("voice.wav", language="en", word_timestamps=True)
```
- Always pass `language`.
- Whisper splits some words into pieces; a piece without a leading space belongs to the previous word, so glue it on.
- Strip punctuation for TikTok-style captions.
- Fix brand names, numbers and English tech words by hand. Whisper often gets them wrong.

## Display
Use `studio/src/WordCaptions.tsx`:
```tsx
<WordCaptions captions={captions} locale="en" highlightColor="#3DF5C8" emphasize={["free"]} />
```
- Shows 1-2 words at a time (`combineWithinMs`: 200 ≈ one word, 400 ≈ 1-2, 1200 ≈ short phrase).
- The word being spoken turns `highlightColor`; `emphasize` words pop.
- `locale` drives uppercasing (Turkish `i → İ`); common English words keep English casing in Turkish videos.
- Render one `<WordCaptions>` per sentence so a page never spans two sentences.
- `bottom`: 300-420 on 1080x1920 keeps captions above platform UI.

## Keep video and captions together
Put each clip's video and its captions in the same `<Sequence>`; apply `trimBefore`/`playbackRate` to the shared parent, not only to the video.

## Import .srt
```ts
import { parseSrt } from "@remotion/captions";
const { captions } = parseSrt({ input: srtText });
```
Parse once in Node and save JSON, so rendering never fetches.
