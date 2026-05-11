"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, PenLine, Search, LogOut, Flame, Hash } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  initialStats?: { total: number; streak: number; tags: string[] };
}

export default function Sidebar({ initialStats }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [stats, setStats] = useState(initialStats ?? { total: 0, streak: 0, tags: [] });
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialStats) setStats(initialStats);
  }, [initialStats]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/");
    }
  }

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  const navItems = [
    { href: "/", label: "Journal", icon: BookOpen, exact: true },
    { href: "/new", label: "New Entry", icon: PenLine },
  ];

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col bg-journal-surface border-r border-journal-border">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <h1
          className="text-journal-accent text-xl"
          style={{ fontFamily: "var(--font-dm-serif), serif" }}
        >
          Reflect
        </h1>
        <p className="text-journal-muted text-xs mt-0.5">Your daily mirror</p>
      </div>

      {/* Search */}
      <div className="px-3 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center gap-2 bg-journal-raised border border-journal-border rounded-lg px-3 py-2">
            <Search size={13} className="text-journal-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries…"
              className="bg-transparent text-sm text-journal-text placeholder:text-journal-muted outline-none w-full"
            />
          </div>
        </form>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5 mb-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-journal-raised text-journal-text"
                  : "text-journal-muted hover:text-journal-text hover:bg-journal-raised"
              }`}
            >
              <Icon size={15} className={isActive ? "text-journal-accent" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Stats */}
      <div className="px-3 mb-4">
        <div className="bg-journal-raised border border-journal-border rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-journal-muted flex items-center gap-1.5">
              <Flame size={12} className="text-journal-accent" />
              Streak
            </span>
            <span className="text-journal-text font-semibold">
              {stats.streak} {stats.streak === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-journal-muted">Total entries</span>
            <span className="text-journal-text font-semibold">{stats.total}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {stats.tags.length > 0 && (
        <div className="px-3 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-journal-muted font-medium px-1 mb-2">
            Tags
          </p>
          <div className="space-y-0.5">
            {stats.tags.slice(0, 12).map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-journal-muted hover:text-journal-text hover:bg-journal-raised transition-colors"
              >
                <Hash size={11} />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="px-3 py-4 mt-auto border-t border-journal-border">
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-2 text-sm text-journal-muted hover:text-journal-danger transition-colors w-full rounded-lg hover:bg-journal-raised"
        >
          <LogOut size={14} />
          {isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
