import type { Caption } from "@remotion/captions";

export type Brand = {
  id: string;
  name: string;
  locale: string;
  colors: { bg: string; bgDeep: string; ink: string; accent: string; dark: string };
  cta: string;
  ctaLead: string;
  mascot: string | null;
  bannedPhrases: string[];
  rules: string[];
};

export type Brief = {
  brand: string;
  duration: 15 | 30 | number;
  hook: string;
  offer: { label: string; value: number; prefix?: string; suffix?: string };
  points: string[];
  cta?: string;
  ctaLead?: string;
  terms?: string;
  useMascot?: boolean;
  voice?: string | null;
  music?: string | null;
  musicVolume?: number;
  captions?: Caption[];
  emphasize?: string[];
};
