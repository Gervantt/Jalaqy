import type { Dictionary } from "@/i18n";

export type ColorKey = keyof Dictionary["styleguide"]["colors"];

export interface PaletteColor {
  key: ColorKey;
  /** CSS-переменная из src/styles/tokens.css */
  token: `--${string}`;
  hex: string;
}

/** Цвета из задания. Совпадение с tokens.css проверяет palette.test.ts. */
export const brandPalette: PaletteColor[] = [
  { key: "ink", token: "--ink", hex: "#0F2A24" },
  { key: "primary", token: "--primary", hex: "#1F6B52" },
  { key: "accent", token: "--accent", hex: "#F2C14E" },
  { key: "paper", token: "--paper", hex: "#F3F5F0" },
  { key: "surface", token: "--surface", hex: "#FFFFFF" },
  { key: "muted", token: "--muted", hex: "#55625C" },
  { key: "border", token: "--border", hex: "#D5DCD6" },
  { key: "successBg", token: "--success-bg", hex: "#E2ECE6" },
  { key: "warningBg", token: "--warning-bg", hex: "#FBEFC9" },
  { key: "warningText", token: "--warning-text", hex: "#4A3600" },
];

/** Встречаются в дизайне, но не названы в задании; danger и primaryHover — наше решение. */
export const extraPalette: PaletteColor[] = [
  { key: "primaryHover", token: "--primary-hover", hex: "#185A45" },
  { key: "text2", token: "--text-2", hex: "#33413B" },
  { key: "borderStrong", token: "--border-strong", hex: "#CBD5CE" },
  { key: "divider", token: "--divider", hex: "#E7ECE8" },
  { key: "successText", token: "--success-text", hex: "#174F3D" },
  { key: "warningIcon", token: "--warning-icon", hex: "#6B4E00" },
  { key: "danger", token: "--danger", hex: "#B42318" },
  { key: "dangerBg", token: "--danger-bg", hex: "#FBE5E2" },
  { key: "onInk", token: "--on-ink", hex: "#F3F5F0" },
  { key: "onInkSoft", token: "--on-ink-soft", hex: "#C9D6D0" },
  { key: "onInkMuted", token: "--on-ink-muted", hex: "#A9BDB4" },
  { key: "inkHover", token: "--ink-hover", hex: "#1D4038" },
  { key: "inkDivider", token: "--ink-divider", hex: "#2B4A42" },
];

export const landingPalette: PaletteColor[] = [
  { key: "cream", token: "--cream", hex: "#FBF8F1" },
  { key: "mint", token: "--mint", hex: "#DCEBE2" },
  { key: "mintLine", token: "--mint-line", hex: "#C2D9CB" },
  { key: "sand", token: "--sand", hex: "#EFEADD" },
  { key: "sandLine", token: "--sand-line", hex: "#ECE8DE" },
  { key: "sandBorder", token: "--sand-border", hex: "#D9D3C3" },
];

export const WHITE = "#FFFFFF";
export const PAPER = "#F3F5F0";
export const INK = "#0F2A24";
