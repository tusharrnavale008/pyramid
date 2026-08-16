"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import {
  THEME_MODES,
  THEME_LABELS,
  COLOR_MODES,
  COLOR_SWATCHES,
} from "@/lib/theme-config";

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type SubmenuKey = "theme" | "color" | null;

export function ProfileMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<SubmenuKey>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSubmenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          setSubmenu(null);
        }}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-background-secondary transition-colors w-full text-left"
      >
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-foreground-muted truncate">{email}</p>
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-border bg-card shadow-lg py-1.5 z-50">
          <div className="relative" onMouseEnter={() => setSubmenu("theme")}>
            <button
              onClick={() => setSubmenu(submenu === "theme" ? null : "theme")}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-background-secondary rounded-md mx-1"
              style={{ width: "calc(100% - 8px)" }}
            >
              <span>Change Theme</span>
              <ChevronRightIcon />
            </button>

            {submenu === "theme" && (
              <div className="absolute left-full top-0 ml-1 w-36 rounded-xl border border-border bg-card shadow-lg py-1.5">
                {THEME_MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-background-secondary rounded-md mx-1"
                    style={{ width: "calc(100% - 8px)" }}
                  >
                    <span>{THEME_LABELS[mode]}</span>
                    {theme === mode && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setSubmenu("color")}>
            <button
              onClick={() => setSubmenu(submenu === "color" ? null : "color")}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-background-secondary rounded-md mx-1"
              style={{ width: "calc(100% - 8px)" }}
            >
              <span>Color Mode</span>
              <ChevronRightIcon />
            </button>

            {submenu === "color" && (
              <div className="absolute left-full top-0 ml-1 w-40 rounded-xl border border-border bg-card shadow-lg py-1.5">
                {COLOR_MODES.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColorMode(color)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-background-secondary rounded-md mx-1"
                    style={{ width: "calc(100% - 8px)" }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ background: COLOR_SWATCHES[color].hex }}
                      />
                      {COLOR_SWATCHES[color].label}
                    </span>
                    {colorMode === color && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="my-1 border-t border-border" />

          <button
            onClick={() => {
              router.push("/settings");
              setOpen(false);
            }}
            className="w-full flex items-center px-3 py-2 text-sm hover:bg-background-secondary rounded-md mx-1"
            style={{ width: "calc(100% - 8px)" }}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
}