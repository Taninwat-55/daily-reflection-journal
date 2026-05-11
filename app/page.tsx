import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PenLine, Search as SearchIcon } from "lucide-react";
import JournalLayout from "@/components/layout/JournalLayout";
import EntryCard from "@/components/entry/EntryCard";
import JournalCalendar from "@/components/calendar/JournalCalendar";
import { getEntries, getEntryDates } from "@/lib/actions/entries";

interface PageProps {
  searchParams: Promise<{ search?: string; tag?: string; date?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { search, tag, date } = params;

  const [entries, entryDates] = await Promise.all([
    getEntries(search, tag, date),
    getEntryDates(),
  ]);

  const today = format(new Date(), "EEEE, MMMM d");
  const hasFilter = search || tag || date;

  return (
    <JournalLayout>
      <div className="flex gap-0 h-full">
        {/* Entry list */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-journal-text font-semibold text-lg leading-tight">
                {date
                  ? format(new Date(date + "T00:00:00"), "EEEE, MMMM d")
                  : tag
                    ? `#${tag}`
                    : search
                      ? `"${search}"`
                      : today}
              </h2>
              <p className="text-journal-muted text-xs mt-0.5">
                {entries.length === 0
                  ? "No entries found"
                  : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
              </p>
            </div>
            <Link
              href="/new"
              className="flex items-center gap-2 bg-journal-accent text-journal-bg text-sm font-medium px-4 py-2 rounded-lg hover:bg-journal-accent-light transition-colors"
            >
              <PenLine size={14} />
              New entry
            </Link>
          </div>

          {/* Active filters */}
          {hasFilter && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-journal-muted">Filtering by:</span>
              {search && (
                <span className="flex items-center gap-1 text-xs bg-journal-raised border border-journal-border px-2.5 py-1 rounded-full text-journal-text">
                  <SearchIcon size={10} />
                  {search}
                  <Link href="/" className="ml-1 text-journal-muted hover:text-journal-text">×</Link>
                </span>
              )}
              {tag && (
                <span className="flex items-center gap-1 text-xs bg-journal-raised border border-journal-border px-2.5 py-1 rounded-full text-journal-text">
                  #{tag}
                  <Link href="/" className="ml-1 text-journal-muted hover:text-journal-text">×</Link>
                </span>
              )}
              {date && (
                <span className="flex items-center gap-1 text-xs bg-journal-raised border border-journal-border px-2.5 py-1 rounded-full text-journal-text">
                  {format(new Date(date + "T00:00:00"), "MMM d, yyyy")}
                  <Link href="/" className="ml-1 text-journal-muted hover:text-journal-text">×</Link>
                </span>
              )}
            </div>
          )}

          {/* Entries */}
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-journal-text font-medium mb-2">
                {hasFilter ? "No entries match" : "Start your first entry"}
              </h3>
              <p className="text-journal-muted text-sm mb-6 max-w-xs">
                {hasFilter
                  ? "Try a different search or clear the filter."
                  : "Reflection is how ideas become clarity. Write something today."}
              </p>
              {!hasFilter && (
                <Link
                  href="/new"
                  className="flex items-center gap-2 bg-journal-accent text-journal-bg text-sm font-medium px-4 py-2 rounded-lg hover:bg-journal-accent-light transition-colors"
                >
                  <PenLine size={14} />
                  Write your first entry
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} searchQuery={search} />
              ))}
            </div>
          )}
        </div>

        {/* Calendar panel */}
        <div className="w-56 shrink-0 border-l border-journal-border px-4 py-6 overflow-y-auto">
          <Suspense fallback={null}>
            <JournalCalendar entryDates={entryDates} />
          </Suspense>
        </div>
      </div>
    </JournalLayout>
  );
}
