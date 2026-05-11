"use client";

import { useState, useTransition } from "react";
import { signInWithMagicLink } from "@/lib/actions/auth";
import { BookOpen, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await signInWithMagicLink(email);
        setSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-journal-bg px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
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

        {sent ? (
          <div className="bg-journal-surface border border-journal-border rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📬</div>
            <h2 className="text-journal-text font-semibold mb-2">Check your email</h2>
            <p className="text-journal-muted text-sm">
              We sent a magic link to{" "}
              <span className="text-journal-text">{email}</span>. Click it to
              sign in — no password needed.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 text-xs text-journal-muted hover:text-journal-text transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="bg-journal-surface border border-journal-border rounded-xl p-6">
            <h2 className="text-journal-text font-semibold mb-1">Sign in</h2>
            <p className="text-journal-muted text-xs mb-5">
              We&apos;ll send a magic link to your email — no password required.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs text-journal-muted mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="you@example.com"
                  className="w-full bg-journal-raised border border-journal-border rounded-lg px-3 py-2.5 text-sm text-journal-text placeholder:text-journal-muted outline-none focus:border-journal-accent transition-colors"
                />
              </div>

              {error && (
                <p className="text-journal-danger text-xs">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending || !email}
                className="w-full flex items-center justify-center gap-2 bg-journal-accent text-journal-bg font-medium text-sm py-2.5 rounded-lg hover:bg-journal-accent-light transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send magic link"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
