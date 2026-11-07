---
name: cartoon-studio
description: Make a vertical 2.5D animated short, with flat 2D characters inside lit 3D Blender sets, telling a true story. Use for history or science shorts, animated explainers or story episodes.
---

# Cartoon Studio (2.5D shorts)

Format: 1080x1920, 30 fps, 55-70 sec. Round-headed, thick-outlined, flat-colored 2D characters standing inside warmly lit 3D sets with depth of field. One narrator, one true story, a new shot roughly every 2 seconds.

## Episode folder
```
ep-<slug>/
  script.md  sources.md  shotlist.md  cues.md
  assets/  episode.blend  captions/  review/  out/
```

## Pipeline
1. **Pitch**: 5 true stories that fit "The [object] that [did something surprising]" or "Why [thing] always [does X]". One line each, why both a 12- and a 50-year-old would retell it, 2 sources each. Wait for the pick.
2. **Script**: 150-170 words, short spoken sentences. Line 1 is the hook and makes a promise; a twist around second 40; the last line pays off the hook. Every factual claim gets a source in `sources.md`. Wait for approval and remind the user to check the sources.
3. **Shot list**: one shot per idea, 1.5-3 sec: id, words covered, duration, SET, CAMERA (framing + push-in/dolly/static + reason), CHARACTER (pose, expression), PROP (hero object is always 3D), SOUND (only for physical events). Reuse 3-5 sets. Key beats in global frame numbers at 30 fps. Falling objects obey physics (~30 cm fall ≈ 7-8 frames).
4. **Sets (Blender)**: with a Blender MCP server, work through it and look through each camera after every pass; otherwise run Blender headless (`blender -b … --python build.py`) and render stills to check. Three passes, stop after each:
   BLOCK (grey primitives, all cameras placed) → LIGHT (one motivated key, warm practicals, HDRI fill, no 3-point studio lighting) → DRESS (worn, varied materials, small props, depth of field focused where the character stands). Render at exactly 1080x1920.
5. **Hero prop**: real-world scale, bevelled edges, wear in crevices, 6-angle look sheet before placing.
6. **Characters**: separate SVG parts (head, body, arms, legs, costume), flat color, one thick dark outline, no gradients. Expression set as separate files (eyes: neutral/wide/narrow/closed/side; mouth: closed/small/wide/frown/grin; extras). Export 2x PNG, import as planes with an emission/shadeless shader so set lights never shade them, add a soft contact shadow under the feet.
7. **Acting**: per shot write thought, anticipation (eyes move ~4 frames first), action (on which word), hold (8-12 frames). No idle bouncing; mouths change only on stressed words.
8. **Voice + captions**: the user's own voice when possible. Word timestamps and captions via the `word-captions` skill. Cuts line up with words. Sound effects in `cues.md` on the same frame numbers as picture events; align the transient, not the file start. Voice on top, music under, music resolves on the last frame.
9. **Review**: run the `review-loop` skill plus: does every character sit on the floor? Is any character lit like a 3D object? Is every on-screen claim in `sources.md`?
10. **Deliver**: `ffprobe` must show 1080x1920, 30/1 and the planned duration.

## Hard rules
- Render at size; never crop or upscale.
- Characters never get realistic shading; sets are always richly lit.
- Only claims that are in `sources.md` go on screen.
- Learn the grammar of a format, never copy another channel's characters, designs or scripts.
- If anything could be mistaken for real footage, remind the user about the platform's AI-content label.
