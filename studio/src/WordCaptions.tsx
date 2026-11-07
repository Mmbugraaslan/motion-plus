import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";

type Props = {
  captions: Caption[];
  combineWithinMs?: number;
  highlightColor?: string;
  emphasize?: string[];
  bottom?: number;
  fontSize?: number;
  locale?: string;
};

export const WordCaptions: React.FC<Props> = ({
  captions,
  combineWithinMs = 400,
  highlightColor = "#FFD400",
  emphasize = [],
  bottom = 380,
  fontSize = 84,
  locale = "en",
}) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: combineWithinMs }),
    [captions, combineWithinMs],
  );
  const emph = useMemo(() => new Set(emphasize.map((w) => w.toLocaleLowerCase(locale))), [emphasize]);

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : page.startMs + page.durationMs;
        const dur = Math.max(1, Math.round((endMs / 1000) * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Page tokens={page.tokens} pageStartMs={page.startMs} emph={emph}
              highlightColor={highlightColor} bottom={bottom} fontSize={fontSize} locale={locale} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Locale-aware uppercase (Turkish i -> İ), but keep common English/brand words in English casing
const LATIN = /^(motion|studio|claude|javascript|json|brief|skill|remotion|github|video|link)/i;
const upper = (text: string, locale: string) => {
  const lead = text.match(/^\s*/)?.[0] ?? "";
  const word = text.slice(lead.length);
  const m = locale.startsWith("tr") ? word.match(LATIN) : null;
  if (!m) return lead + word.toLocaleUpperCase(locale);
  return lead + m[0].toUpperCase() + word.slice(m[0].length).toLocaleUpperCase(locale);
};

const Page: React.FC<{
  tokens: { text: string; fromMs: number; toMs: number }[];
  pageStartMs: number;
  emph: Set<string>;
  highlightColor: string;
  bottom: number;
  fontSize: number;
  locale: string;
}> = ({ tokens, pageStartMs, emph, highlightColor, bottom, fontSize, locale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = pageStartMs + (frame / fps) * 1000;
  const stressed = tokens.some((t) => emph.has(t.text.trim().toLocaleLowerCase(locale).replace(/[.,!?]/g, "")));
  const scale = stressed
    ? interpolate(frame, [0, 4, 8], [0.8, 1.08, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
    : 1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom }}>
      <div style={{
        fontFamily: "Montserrat, Inter, Arial Black, sans-serif", fontWeight: 900, fontSize,
        color: "white", textAlign: "center", maxWidth: 900, lineHeight: 1.1,
        WebkitTextStroke: "10px black", paintOrder: "stroke fill",
        textShadow: "0 6px 18px rgba(0,0,0,0.55)", transform: `scale(${scale})`, whiteSpace: "pre-wrap", padding: "0 60px", boxSizing: "border-box",
      }}>
        {tokens.map((t, j) => (
          <span key={j} style={{ color: nowMs >= t.fromMs && nowMs < t.toMs ? highlightColor : "white" }}>
            {upper(j === 0 ? t.text.trimStart() : t.text, locale)}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
