"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getMe, updateMe, UserProfile } from "@/lib/user-api";
import { useTheme } from "@/components/theme/theme-provider";
import {
  THEME_MODES,
  THEME_LABELS,
  COLOR_MODES,
  COLOR_SWATCHES,
} from "@/lib/theme-config";
import { clearSession } from "@/lib/auth-storage";

type Tab = "profile" | "theme" | "color";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((data) => {
      setProfile(data);
      setFullName(data.fullName ?? "");
      setUsername(data.username ?? "");
      setTitle(data.title ?? "");
      setLoading(false);
    });
  }, []);

  async function saveField(field: "fullName" | "username" | "title", value: string) {
    await updateMe({ [field]: value });
  }

  function handleLeaveWorkspace() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      <aside className="w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-border p-3">
        <button
          onClick={() => router.push("/tasks")}
          className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground mb-4 px-1"
        >
          <ArrowLeft size={14} /> Back to app
        </button>
        <nav className="flex flex-row lg:flex-col gap-0.5 overflow-x-auto">
          {(["profile", "theme", "color"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-left px-2 py-1.5 rounded-lg text-sm capitalize shrink-0"
              style={{ background: tab === t ? "var(--bg-secondary)" : "transparent" }}
            >
              {t}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 lg:overflow-y-auto p-6 sm:p-8">
        <div className="max-w-xl">
          {tab === "profile" && (
            <>
              <h1 className="text-lg font-semibold mb-6">Profile</h1>
              {loading ? (
                <p className="text-sm text-foreground-muted">Loading...</p>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="text-sm text-foreground-muted">Profile picture</span>
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                    >
                      {(fullName || "?").charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="text-sm text-foreground-muted">Email</span>
                    <span className="text-sm">{profile?.email}</span>
                  </div>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-foreground-muted">Full name</span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => saveField("fullName", fullName)}
                      className="rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm outline-none focus:border-foreground-muted"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-foreground-muted">
                      Title
                      <span className="block text-xs">Your job title or role</span>
                    </span>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => saveField("title", title)}
                      className="rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm outline-none focus:border-foreground-muted"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-foreground-muted">
                      Username
                      <span className="block text-xs">One word, like a nickname or first name</span>
                    </span>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() => saveField("username", username)}
                      className="rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm outline-none focus:border-foreground-muted"
                    />
                  </label>

                  <div className="mt-4 pt-4 border-t border-border">
                    <h2 className="text-sm font-medium mb-2">Workspace access</h2>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-foreground-muted">
                        Remove yourself from the workspace
                      </span>
                      <button
                        onClick={handleLeaveWorkspace}
                        className="text-sm px-3 py-1.5 rounded-lg font-medium text-red-600 border border-red-200 hover:bg-red-50"
                      >
                        Leave Workspace
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "theme" && (
            <>
              <h1 className="text-lg font-semibold mb-6">Theme</h1>
              <div className="flex flex-col gap-2 max-w-xs">
                {THEME_MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setTheme(m)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-border text-sm"
                    style={{ background: theme === m ? "var(--bg-secondary)" : "transparent" }}
                  >
                    {THEME_LABELS[m]}
                    {theme === m && <Check size={14} />}
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "color" && (
            <>
              <h1 className="text-lg font-semibold mb-6">Color Mode</h1>
              <div className="flex flex-col gap-2 max-w-xs">
                {COLOR_MODES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorMode(c)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-border text-sm"
                    style={{ background: colorMode === c ? "var(--bg-secondary)" : "transparent" }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: COLOR_SWATCHES[c].hex }}
                      />
                      {COLOR_SWATCHES[c].label}
                    </span>
                    {colorMode === c && <Check size={14} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}