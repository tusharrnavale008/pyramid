"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { guestLogin, ApiError } from "@/lib/api-client";
import { saveSession } from "@/lib/auth-storage";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin() {
    setLoading(true);
    setError(null);
    try {
      const { accessToken, user, workspace } = await guestLogin();
      saveSession(accessToken, user, workspace);
      router.push("/tasks");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not reach the server. Is the backend running?",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-4 py-3">
        <span className="text-sm font-semibold">Pyramid</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-lg font-semibold mb-1">
            Let&apos;s get back on track
          </h1>
          <p className="text-sm text-foreground-muted mb-6">
            Enter your email below to login to your account.
          </p>

          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-medium mb-2.5 disabled:opacity-60"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            {loading ? "Signing in..." : "Continue as Guest"}
          </button>

          <button
            disabled
            title="Google OAuth not wired up in this assessment build — see README"
            className="w-full rounded-lg py-2.5 text-sm font-medium border border-border flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
          >
            <GoogleIcon />
            Login with Google
          </button>

          {error && (
            <p className="text-xs text-red-500 mt-3" role="alert">
              {error}
            </p>
          )}

          <p className="text-xs text-foreground-muted mt-6">
            By clicking continue, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}