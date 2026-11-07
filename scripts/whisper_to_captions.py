#!/usr/bin/env python3
"""Convert an openai-whisper JSON (run with --word_timestamps True) into Remotion Caption JSON.

Usage: python3 scripts/whisper_to_captions.py whisper.json captions.json
"""
import json, sys

src, dst = sys.argv[1], sys.argv[2]
data = json.load(open(src, encoding="utf-8"))
caps = []
for seg in data.get("segments", []):
    for w in seg.get("words", []):
        text = w["word"]
        start, end = round(w["start"] * 1000), round(w["end"] * 1000)
        if caps and not text.startswith(" ") and text.strip():
            # Sub-word piece (e.g. "oran" + "lar"): glue it to the previous word
            prev = caps[-1]
            prev["text"] += text
            prev["endMs"] = end
            prev["timestampMs"] = (prev["startMs"] + end) // 2
            continue
        text = " " + text.strip()
        caps.append({"text": text, "startMs": start, "endMs": end,
                     "timestampMs": (start + end) // 2, "confidence": w.get("probability")})
json.dump(caps, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"{len(caps)} words -> {dst}")
