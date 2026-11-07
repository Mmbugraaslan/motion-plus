import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { Brand, Brief } from "../types";
import { FONT } from "../fonts";

const fmt = (n: number, locale: string) => Math.round(n).toLocaleString(locale);

export const Offer: React.FC<{ brand: Brand; offer: Brief["offer"] }> = ({ brand, offer }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, mass: 0.7 } });
  const count = interpolate(frame, [4, 28], [0, offer.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const pop = interpolate(frame, [28, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - out, transform: `scale(${1 + out * 0.08})` }}>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 56, color: brand.colors.ink, opacity: interpolate(enter, [0, 1], [0, 0.92]), transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`, textTransform: "uppercase", letterSpacing: 4, textAlign: "center", padding: "0 80px" }}>
        {offer.label.toLocaleUpperCase(brand.locale)}
      </div>
      <div style={{
        fontFamily: FONT, fontWeight: 700, fontSize: 300, lineHeight: 1, color: brand.colors.accent,
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1]) + interpolate(pop, [0, 0.5, 1], [0, 0.08, 0])})`,
        textShadow: `0 18px 0 ${brand.colors.dark}55, 0 24px 60px rgba(0,0,0,0.4)`, marginTop: 10,
      }}>
        {offer.prefix ?? ""}{fmt(count, brand.locale)}{offer.suffix ?? ""}
      </div>
    </AbsoluteFill>
  );
};
