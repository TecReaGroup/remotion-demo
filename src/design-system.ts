import {loadFont} from "@remotion/google-fonts/NotoSansSC";

const {fontFamily} = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["chinese-simplified", "latin"],
});

export const design = {
  color: {
    canvas: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceMuted: "#F7F7F7",
    ink: "#1A1A1A",
    muted: "#666666",
    faint: "#8F8F8F",
    border: "#E6E6E6",
    borderStrong: "#D4D4D4",
    accent: "#006FEE",
    accentSoft: "#EAF4FF",
    success: "#16815D",
    successSoft: "#E8F5EF",
    warning: "#B75D00",
    inverse: "#FFFFFF",
    code: "#111111",
  },
  font: {
    sans: fontFamily,
    mono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
    weight: {regular: 400, medium: 400, semibold: 600, bold: 600},
  },
  space: {1: 8, 2: 16, 3: 24, 4: 32, 5: 40, 6: 48, 8: 64, 12: 96},
  radius: {small: 8, medium: 12, large: 16, pill: 999},
  layout: {
    pageInset: 96,
    headerHeight: 80,
    titleTop: 112,
    contentTop: 224,
    contentHeight: 720,
    stageWidth: 1248,
    sidebarLeft: 1376,
    sidebarWidth: 448,
  },
} as const;
