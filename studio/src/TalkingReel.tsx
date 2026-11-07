import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Caption } from "@remotion/captions";
import { WordCaptions } from "./WordCaptions";
import { loadFonts } from "./fonts";

loadFonts();

export type TalkingEdit = {
  footage: string;
  fps: number;
  total: number;
  segments: { srcFrom: number; srcTo: number; outFrom: number }[];
  captionGroups: Caption[][];
  emphasize?: string[];
  locale?: string;
  highlightColor?: string;
};

const ZOOMS = [1.0, 1.14, 1.04, 1.18];

const Shot: React.FC<{ src: string; srcFrom: number; len: number; zoom: number }> = ({ src, srcFrom, len, zoom }) => {
  const frame = useCurrentFrame();
  // Punch-in cuts: scale changes on every cut, slow push-in within the cut
  const s = zoom + interpolate(frame, [0, len], [0, 0.025]);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 30%" }}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={srcFrom}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        volume={(f) => interpolate(f, [0, 2, len - 2, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

export const TalkingReel: React.FC<TalkingEdit> = (edit) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {edit.segments.map((sg, i) => {
      const len = sg.srcTo - sg.srcFrom;
      return (
        <Sequence key={i} from={sg.outFrom} durationInFrames={len} name={`Cut ${i + 1}`}>
          <Shot src={edit.footage} srcFrom={sg.srcFrom} len={len} zoom={ZOOMS[i % ZOOMS.length]} />
        </Sequence>
      );
    })}
    {/* One caption track per sentence so pages never merge across sentences */}
    {edit.captionGroups.map((g, i) => (
      <WordCaptions key={i} captions={g} combineWithinMs={350} bottom={300} fontSize={80}
        locale={edit.locale ?? "en"} highlightColor={edit.highlightColor ?? "#FFD400"} emphasize={edit.emphasize ?? []} />
    ))}
  </AbsoluteFill>
);
