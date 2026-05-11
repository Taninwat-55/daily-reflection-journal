import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MoodBadge } from "./MoodPicker";
import type { Entry } from "@/types";

interface EntryCardProps {
  entry: Entry;
  searchQuery?: string;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    `<mark class="bg-journal-accent/30 text-journal-text rounded">${text.slice(idx, idx + query.length)}</mark>` +
    text.slice(idx + query.length)
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function EntryCard({ entry, searchQuery }: EntryCardProps) {
  const preview = stripHtml(entry.content).slice(0, 160);
  const highlightedPreview = searchQuery ? highlight(preview, searchQuery) : null;
  const highlightedTitle = searchQuery && entry.title ? highlight(entry.title, searchQuery) : null;

  return (
    <Link
      href={`/${entry.id}`}
      className="block group p-4 bg-journal-surface border border-journal-border rounded-xl hover:border-journal-accent/30 transition-all hover:bg-journal-raised"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {entry.title ? (
            <h3
              className="font-semibold text-journal-text text-sm leading-snug truncate"
              dangerouslySetInnerHTML={{ __html: highlightedTitle ?? entry.title }}
            />
          ) : (
            <h3 className="text-journal-muted text-sm italic">Untitled</h3>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {entry.mood && <MoodBadge mood={entry.mood} />}
          <span className="text-[11px] text-journal-muted whitespace-nowrap">
            {format(parseISO(entry.entry_date), "MMM d")}
          </span>
        </div>
      </div>

      {preview && (
        <p
          className="text-journal-muted text-xs leading-relaxed line-clamp-2 mb-3"
          dangerouslySetInnerHTML={{ __html: highlightedPreview ?? preview }}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-journal-raised border border-journal-border rounded-full text-journal-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-journal-muted">
          {entry.word_count > 0 ? `${entry.word_count}w` : ""}
        </span>
      </div>
    </Link>
  );
}
