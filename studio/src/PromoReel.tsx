import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BRANDS } from "../brands";
import type { Brief } from "./types";
import { Background } from "./scenes/Background";
import { Hook } from "./scenes/Hook";
import { Offer } from "./scenes/Offer";
import { Points } from "./scenes/Points";
import { Cta } from "./scenes/Cta";
import { WordCaptions } from "./WordCaptions";
import { sceneFrames } from "./timing";
import { loadFonts } from "./fonts";

loadFonts();

const Mascot: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13 } });
  const bob = Math.sin(frame / fps * 2.4) * 10;
  return (
    <Img src={staticFile(src)} style={{
      position: "absolute", right: -40, bottom: 120, width: 560,
      transform: `translateX(${interpolate(s, [0, 1], [300, 0])}px) translateY(${bob}px)`,
    }} />
  );
};

export const PromoReel: React.FC<Brief> = (brief) => {
  const brand = BRANDS[brief.brand];
  if (!brand) throw new Error(`Unknown brand: ${brief.brand}. Register it in brands/index.ts.`);
  const { durationInFrames } = useVideoConfig();
  const f = sceneFrames(durationInFrames);
  const cta = brief.cta ?? brand.cta;
  const showMascot = brief.useMascot !== false && brand.mascot;
  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.bg }}>
      <Background brand={brand} />
      <Sequence durationInFrames={f.hook} name="Hook"><Hook brand={brand} text={brief.hook} /></Sequence>
      <Sequence from={f.hook} durationInFrames={f.offer} name="Offer"><Offer brand={brand} offer={brief.offer} /></Sequence>
      <Sequence from={f.hook + f.offer} durationInFrames={f.points} name="Points"><Points brand={brand} points={brief.points} /></Sequence>
      <Sequence from={f.hook + f.offer + f.points} durationInFrames={f.cta} name="CTA"><Cta brand={brand} cta={cta} lead={brief.ctaLead ?? brand.ctaLead} terms={brief.terms} /></Sequence>
      {showMascot ? <Sequence from={f.hook + f.offer + f.points} name="Mascot"><Mascot src={brand.mascot as string} /></Sequence> : null}
      {brief.captions && brief.captions.length ? <WordCaptions captions={brief.captions} locale={brand.locale} emphasize={brief.emphasize ?? []} highlightColor={brand.colors.accent} /> : null}
      {brief.voice ? <Audio src={staticFile(brief.voice)} /> : null}
      {brief.music ? <Audio src={staticFile(brief.music)} volume={brief.voice ? (brief.musicVolume ?? 0.18) : (brief.musicVolume ?? 0.6)} /> : null}
    </AbsoluteFill>
  );
};
