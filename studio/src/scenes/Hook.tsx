import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { Brand } from "../types";
import { FONT } from "../fonts";

// First frame is filled: text is visible at frame 0, only scale/position settle (no black intro)
export const Hook: React.FC<{ brand: Brand; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = text.split(" ");
  const out = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{
        fontFamily: FONT, fontWeight: 700, fontSize: 118, lineHeight: 1.04, color: brand.colors.ink,
        textAlign: "center", textTransform: "uppercase", letterSpacing: -2,
        transform: `translateY(${out * -120}px) scale(${1 + (frame / durationInFrames) * 0.05})`, opacity: 1 - out,
      }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - i * 2, fps, config: { damping: 14, mass: 0.6 } });
          const y = interpolate(s, [0, 1], [26, 0]);
          const sc = interpolate(s, [0, 1], [0.94, 1]);
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px) scale(${sc})`, marginRight: 26, textShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
              {w.toLocaleUpperCase(brand.locale)}
            </span>
          );
        })}
      </div>
      <div style={{
        position: "absolute", top: "64%", height: 14, borderRadius: 7, background: brand.colors.accent,
        width: interpolate(frame, [6, 22], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
        opacity: 1 - out,
      }} />
    </AbsoluteFill>
  );
};
