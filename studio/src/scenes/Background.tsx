import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Brand } from "../types";

// Ambient layer: slowly rotating gradient + floating shapes (seamless sine loops)
export const Background: React.FC<{ brand: Brand }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const angle = 160 + Math.sin(t * 0.6) * 12;
  const shapes = [
    { x: 12, y: 18, s: 260, sp: 0.5, ph: 0 },
    { x: 82, y: 30, s: 180, sp: 0.7, ph: 1.7 },
    { x: 70, y: 78, s: 320, sp: 0.4, ph: 3.1 },
    { x: 18, y: 72, s: 140, sp: 0.9, ph: 4.4 },
  ];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, ${brand.colors.bg} 0%, ${brand.colors.bgDeep} 100%)`, overflow: "hidden" }}>
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${s.x}%`,
          top: `${s.y + Math.sin(t * s.sp + s.ph) * 2.5}%`,
          width: s.s, height: s.s, borderRadius: "50%",
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(t * s.sp * 1.3 + s.ph) * 0.06})`,
          background: i % 2 ? brand.colors.accent : brand.colors.ink,
          opacity: i % 2 ? 0.14 : 0.07,
          filter: "blur(2px)",
        }} />
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(0,0,0,0.35), transparent 60%)" }} />
    </AbsoluteFill>
  );
};
