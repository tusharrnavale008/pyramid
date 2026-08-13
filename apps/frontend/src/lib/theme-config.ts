export const THEME_MODES = ["light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const COLOR_MODES = [
  "amber",
  "blue",
  "pink",
  "rose",
  "emerald",
  "black",
] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

export const DEFAULT_THEME: ThemeMode = "light";
export const DEFAULT_COLOR: ColorMode = "blue";

export const THEME_STORAGE_KEY = "pyramid-theme";
export const COLOR_STORAGE_KEY = "pyramid-color";

export const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
};

export const COLOR_SWATCHES: Record<ColorMode, { label: string; hex: string }> = {
  amber: { label: "Amber", hex: "#f59e0b" },
  blue: { label: "Blue", hex: "#3b82f6" },
  pink: { label: "Pink", hex: "#ec4899" },
  rose: { label: "Rose", hex: "#f43f5e" },
  emerald: { label: "Emerald", hex: "#10b981" },
  black: { label: "Black", hex: "#171717" },
};