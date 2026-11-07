import { continueRender, delayRender } from "remotion";
// Poppins via @fontsource (OFL-1.1). latin-ext covers Turkish and most European characters.
import latin500 from "@fontsource/poppins/files/poppins-latin-500-normal.woff2";
import latin700 from "@fontsource/poppins/files/poppins-latin-700-normal.woff2";
import ext500 from "@fontsource/poppins/files/poppins-latin-ext-500-normal.woff2";
import ext700 from "@fontsource/poppins/files/poppins-latin-ext-700-normal.woff2";

export const FONT = "StudioPoppins";
let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fonts");
  const latin = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
  const ext = "U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";
  const faces = [
    new FontFace(FONT, `url(${latin500})`, { weight: "500", unicodeRange: latin }),
    new FontFace(FONT, `url(${latin700})`, { weight: "700", unicodeRange: latin }),
    new FontFace(FONT, `url(${ext500})`, { weight: "500", unicodeRange: ext }),
    new FontFace(FONT, `url(${ext700})`, { weight: "700", unicodeRange: ext }),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((list) => {
      list.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch(() => continueRender(handle));
};
