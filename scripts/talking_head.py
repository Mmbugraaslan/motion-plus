#!/usr/bin/env python3
"""Auto-edit a talking-head clip: normalize, transcribe, cut silences, build captions.

Usage:
  python3 scripts/talking_head.py input.mp4 [--name my-reel] [--lang en] [--model small]
                                   [--fix "wrong=right" ...] [--emphasize word ...]

Writes:
  studio/public/footage/<name>.mp4   (1080x1920, 30 fps, -14 LUFS)
  studio/edits/<name>.json           (cut list + word-timed caption groups)
Then render with:
  scripts/render.sh edits/<name>.json --comp TalkingReel
"""
import argparse, json, os, re, subprocess, sys, wave
import numpy as np

FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIO = os.path.join(ROOT, "studio")

def run(cmd):
    subprocess.run(cmd, check=True)

def preprocess(src, dst):
    run(["ffmpeg", "-v", "error", "-y", "-i", src,
         "-vf", "fps=30,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.5:5:5:0",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p",
         "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", dst])

def load_pcm(src):
    wav = src + ".16k.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "16000", wav])
    w = wave.open(wav)
    pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    os.remove(wav)
    return pcm

def speech_regions(pcm, min_gap=0.3):
    hop = 160  # 10 ms at 16 kHz
    n = len(pcm) // hop
    db = np.array([20 * np.log10(np.sqrt(np.mean(pcm[i*hop:(i+1)*hop] ** 2)) + 1e-9) for i in range(n)])
    thr = np.percentile(db, 10) + 12
    voiced = db >= thr
    regions, i = [], 0
    while i < n:
        if voiced[i]:
            j = i
            while j < n and voiced[j]:
                j += 1
            regions.append([i * 0.01, j * 0.01])
            i = j
        else:
            i += 1
    merged = []
    for r in regions:
        if merged and r[0] - merged[-1][1] < min_gap:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return [r for r in merged if r[1] - r[0] >= 0.15]

def transcribe(pcm, lang, model):
    from faster_whisper import WhisperModel
    m = WhisperModel(model, device="cpu", compute_type="int8")
    segs, _ = m.transcribe(pcm, language=lang, word_timestamps=True, beam_size=5)
    out = []
    for s in segs:
        out.append([{"word": w.word, "start": w.start, "end": w.end} for w in s.words])
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--name")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--model", default="small", help="faster-whisper model name or local CTranslate2 folder")
    ap.add_argument("--fix", action="append", default=[], help='caption correction, e.g. "kilavuz=Claude"')
    ap.add_argument("--emphasize", nargs="*", default=[])
    ap.add_argument("--pre", type=float, default=0.06)
    ap.add_argument("--post", type=float, default=0.12)
    a = ap.parse_args()

    name = a.name or re.sub(r"[^a-z0-9-]+", "-", os.path.splitext(os.path.basename(a.input))[0].lower()).strip("-")
    footage_rel = f"footage/{name}.mp4"
    footage = os.path.join(STUDIO, "public", footage_rel)
    os.makedirs(os.path.dirname(footage), exist_ok=True)
    print("1/4 normalizing video + audio")
    preprocess(a.input, footage)
    pcm = load_pcm(footage)

    print("2/4 detecting speech")
    regions = speech_regions(pcm)
    segs = []
    for i, (s, e) in enumerate(regions):
        s2, e2 = max(0.0, s - a.pre), e + a.post
        if i + 1 < len(regions):
            e2 = min(e2, regions[i + 1][0] - a.pre)
        segs.append({"srcFrom": round(s2 * FPS), "srcTo": round(e2 * FPS)})
    t = 0
    for sg in segs:
        sg["outFrom"] = t
        t += sg["srcTo"] - sg["srcFrom"]
    total = t

    def src2out(sec):
        f = sec * FPS
        for sg in segs:
            if sg["srcFrom"] <= f <= sg["srcTo"]:
                return (sg["outFrom"] + f - sg["srcFrom"]) / FPS
        for sg in segs:
            if f < sg["srcFrom"]:
                return sg["outFrom"] / FPS
        return total / FPS

    print("3/4 transcribing")
    fixes = dict(f.split("=", 1) for f in a.fix)
    groups = []
    for seg_words in transcribe(pcm, a.lang, a.model):
        caps = []
        for w in seg_words:
            raw = w["word"]
            if caps and not raw.startswith(" ") and raw.strip():
                caps[-1]["text"] += raw.strip()  # sub-word piece: glue to previous word
                caps[-1]["endMs"] = round(src2out(w["end"]) * 1000)
                continue
            word = re.sub(r"[.,!?;:]", "", raw.strip())
            word = fixes.get(word, word)
            st, en = src2out(w["start"]), src2out(w["end"])
            caps.append({"text": " " + word, "startMs": round(st * 1000),
                         "endMs": round(max(en, st + 0.12) * 1000),
                         "timestampMs": round((st + en) / 2 * 1000), "confidence": None})
        if caps:
            groups.append(caps)

    print("4/4 writing edit")
    edit = {"footage": footage_rel, "fps": FPS, "total": total, "segments": segs,
            "captionGroups": groups, "emphasize": a.emphasize, "locale": a.lang}
    out = os.path.join(STUDIO, "edits", f"{name}.json")
    json.dump(edit, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{total / FPS:.1f}s after cuts -> {os.path.relpath(out, ROOT)}")
    print("Transcript:", " | ".join(" ".join(c["text"].strip() for c in g) for g in groups))

if __name__ == "__main__":
    main()
