import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { Brand } from "../types";
import { FONT } from "../fonts";

export const Points: React.FC<{ brand: Brand; points: string[] }> = ({ brand, points }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const gap = Math.min(8, Math.floor((durationInFrames * 0.4) / Math.max(1, points.length)));
  const out = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px", opacity: 1 - out }}>
      {points.map((p, i) => {
        const s = spring({ frame: frame - i * gap, fps, config: { damping: 15, mass: 0.6 } });
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 34, marginBottom: 46,
            transform: `translateX(${interpolate(s, [0, 1], [-140, 0])}px)`, opacity: s,
          }}>
            <div style={{
              width: 84, height: 84, borderRadius: 24, background: brand.colors.accent, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT, fontWeight: 700, fontSize: 48, color: brand.colors.dark,
              transform: `rotate(${interpolate(s, [0, 1], [-25, 0])}deg)`,
            }}>✓</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.12, color: brand.colors.ink, textShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
              {p}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
