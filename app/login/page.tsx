"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/lib/actions/auth";
import { BookOpen, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await signInWithPassword(email, password);
        router.push("/");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid email or password");
      }
    });
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-journal-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-journal-surface border border-journal-border rounded-xl mb-4">
            <BookOpen size={22} className="text-journal-accent" />
          </div>
          <h1
            className="text-3xl text-journal-text"
            style={{ fontFamily: "var(--font-dm-serif), serif" }}
          >
            Reflect
          </h1>
          <p className="text-journal-muted text-sm mt-2">Your personal daily journal</p>
        </div>

        <div className="bg-journal-surface border border-journal-border rounded-xl p-6">
          <h2 className="text-journal-text font-semibold mb-5">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-journal-muted mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-journal-raised border border-journal-border rounded-lg px-3 py-2.5 text-sm text-journal-text placeholder:text-journal-muted outline-none focus:border-journal-accent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-journal-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-journal-raised border border-journal-border rounded-lg px-3 py-2.5 pr-10 text-sm text-journal-text placeholder:text-journal-muted outline-none focus:border-journal-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-journal-muted hover:text-journal-text transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <p className="text-journal-danger text-xs">{error}</p>}

            <button
              type="submit"
              disabled={isPending || !email || !password}
              className="w-full flex items-center justify-center gap-2 bg-journal-accent text-journal-bg font-medium text-sm py-2.5 rounded-lg hover:bg-journal-accent-light transition-colors disabled:opacity-50 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
