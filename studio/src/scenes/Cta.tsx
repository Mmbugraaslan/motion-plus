import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Brand } from "../types";
import { FONT } from "../fonts";

export const Cta: React.FC<{ brand: Brand; cta: string; lead: string; terms?: string }> = ({ brand, cta, lead, terms }) => {
  // Keep long CTAs on one line: font size shrinks with text length
  const ctaSize = Math.min(78, Math.floor(1500 / Math.max(10, cta.length)));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 11, mass: 0.7 } });
  const pulse = 1 + Math.sin(Math.max(0, frame - 15) / fps * Math.PI * 2 * 0.9) * 0.035 * (frame > 15 ? 1 : 0);
  const shine = interpolate((frame % 45) / 45, [0, 1], [-120, 220]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 54, color: brand.colors.ink, opacity: enter, marginBottom: 46, letterSpacing: 3 }}>
        {lead.toLocaleUpperCase(brand.locale)}
      </div>
      <div style={{
        position: "relative", overflow: "hidden",
        padding: "44px 72px", borderRadius: 999, background: brand.colors.accent, whiteSpace: "nowrap", maxWidth: 960, boxSizing: "border-box",
        fontFamily: FONT, fontWeight: 700, fontSize: ctaSize, color: brand.colors.dark,
        transform: `scale(${interpolate(enter, [0, 1], [0.4, 1]) * pulse})`,
        boxShadow: `0 20px 0 ${brand.colors.dark}66, 0 30px 70px rgba(0,0,0,0.45)`,
      }}>
        {cta}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "30%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
      </div>
      {terms ? (
        <div style={{ position: "absolute", bottom: 150, left: 90, right: 90, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: brand.colors.ink, opacity: interpolate(frame, [10, 20], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {terms}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
