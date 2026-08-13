"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  ThemeMode,
  ColorMode,
  DEFAULT_THEME,
  DEFAULT_COLOR,
  THEME_STORAGE_KEY,
  COLOR_STORAGE_KEY,
} from "@/lib/theme-config";

interface ThemeContextValue {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (color: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [colorMode, setColorModeState] = useState<ColorMode>(DEFAULT_COLOR);

  useEffect(() => {
    const root = document.documentElement;
    const domTheme = root.getAttribute("data-theme") as ThemeMode | null;
    const domAccent = root.getAttribute("data-accent") as ColorMode | null;
    if (domTheme) setThemeState(domTheme);
    if (domAccent) setColorModeState(domAccent);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const setColorMode = useCallback((next: ColorMode) => {
    setColorModeState(next);
    document.documentElement.setAttribute("data-accent", next);
    localStorage.setItem(COLOR_STORAGE_KEY, next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}