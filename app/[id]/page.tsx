import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import JournalLayout from "@/components/layout/JournalLayout";
import { MoodBadge } from "@/components/entry/MoodPicker";
import DeleteEntryButton from "@/components/entry/DeleteEntryButton";
import { getEntry } from "@/lib/actions/entries";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getPublicImageUrl(path: string, supabaseUrl: string) {
  return `${supabaseUrl}/storage/v1/object/public/journal-images/${path}`;
}

export default async function EntryPage({ params }: PageProps) {
  const { id } = await params;
  const entry = await getEntry(id);

  if (!entry) notFound();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return (
    <JournalLayout>
      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* Back nav */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-journal-muted hover:text-journal-text transition-colors"
          >
            <ArrowLeft size={15} />
            All entries
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/${entry.id}/edit`}
              className="flex items-center gap-1.5 text-sm text-journal-muted hover:text-journal-text transition-colors px-3 py-1.5 rounded-lg hover:bg-journal-raised"
            >
              <Pencil size={13} />
              Edit
            </Link>
            <DeleteEntryButton id={entry.id} />
          </div>
        </div>

        {/* Entry header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 text-xs text-journal-muted">
            <time>{format(parseISO(entry.entry_date), "EEEE, MMMM d, yyyy")}</time>
            {entry.template !== "freeform" && (
              <span className="px-2 py-0.5 bg-journal-raised border border-journal-border rounded-full capitalize">
                {entry.template}
              </span>
            )}
            {entry.word_count > 0 && (
              <span>{entry.word_count} words</span>
            )}
          </div>

          {entry.title && (
            <h1
              className="text-3xl text-journal-text mb-3 leading-tight"
              style={{ fontFamily: "var(--font-dm-serif), serif" }}
            >
              {entry.title}
            </h1>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {entry.mood && <MoodBadge mood={entry.mood} />}
            {entry.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2.5 py-1 bg-journal-raised border border-journal-border rounded-full text-journal-muted hover:text-journal-text transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-journal-border mb-6" />

        {/* Content */}
        <div
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />

        {/* Images */}
        {entry.images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            {entry.images.map((path) => (
              <div key={path} className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={getPublicImageUrl(path, supabaseUrl)}
                  alt="Journal photo"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-journal-border text-xs text-journal-muted">
          Last updated {format(parseISO(entry.updated_at), "MMM d, yyyy 'at' h:mm a")}
        </div>
      </div>
    </JournalLayout>
  );
}
