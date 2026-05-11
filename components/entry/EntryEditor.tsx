"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import MoodPicker from "./MoodPicker";
import TagInput from "./TagInput";
import TemplateSelector from "./TemplateSelector";
import ImageUpload from "./ImageUpload";
import { createEntry, updateEntry } from "@/lib/actions/entries";
import { TEMPLATES, type Entry, type TemplateKey } from "@/types";

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[320px] flex items-center justify-center text-journal-muted text-sm">
      Loading editor…
    </div>
  ),
});

interface EntryEditorProps {
  entry?: Entry;
  userId: string;
}

export default function EntryEditor({ entry, userId }: EntryEditorProps) {
  const router = useRouter();
  const isEditing = !!entry;

  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [contentJson, setContentJson] = useState<Record<string, unknown> | null>(
    entry?.content_json ?? null
  );
  const [wordCount, setWordCount] = useState(entry?.word_count ?? 0);
  const [mood, setMood] = useState<number | null>(entry?.mood ?? null);
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [images, setImages] = useState<string[]>(entry?.images ?? []);
  const [template, setTemplate] = useState<TemplateKey>(entry?.template ?? "freeform");
  const [entryDate, setEntryDate] = useState(
    entry?.entry_date ?? format(new Date(), "yyyy-MM-dd")
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleTemplateChange(newTemplate: TemplateKey) {
    if (content && content !== TEMPLATES[template].content) {
      if (!window.confirm("Switching templates will replace the current content. Continue?")) return;
    }
    setTemplate(newTemplate);
    setContent(TEMPLATES[newTemplate].content);
    setContentJson(null);
  }

  function handleEditorUpdate(data: {
    html: string;
    json: Record<string, unknown>;
    wordCount: number;
  }) {
    setContent(data.html);
    setContentJson(data.json);
    setWordCount(data.wordCount);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          title,
          content,
          content_json: contentJson,
          mood,
          tags,
          images,
          template,
          word_count: wordCount,
          entry_date: entryDate,
        };

        if (isEditing) {
          await updateEntry(entry.id, payload);
          router.push(`/${entry.id}`);
        } else {
          const id = await createEntry(payload);
          router.push(`/${id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-journal-border">
        <Link
          href={isEditing ? `/${entry.id}` : "/"}
          className="flex items-center gap-2 text-sm text-journal-muted hover:text-journal-text transition-colors"
        >
          <ArrowLeft size={15} />
          {isEditing ? "Back to entry" : "All entries"}
        </Link>

        <div className="flex items-center gap-3">
          <TemplateSelector
            value={template}
            onChange={handleTemplateChange}
            disabled={isEditing}
          />

          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="bg-journal-raised border border-journal-border rounded-lg px-2.5 py-1.5 text-xs text-journal-text outline-none focus:border-journal-accent transition-colors"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-journal-accent text-journal-bg text-sm font-medium px-4 py-2 rounded-lg hover:bg-journal-accent-light transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent text-2xl font-semibold text-journal-text placeholder:text-journal-muted outline-none mb-4"
          style={{ fontFamily: "var(--font-dm-serif), serif" }}
        />

        {/* Rich text editor */}
        <RichTextEditor
          content={!contentJson ? (content || TEMPLATES[template].content || undefined) : undefined}
          contentJson={contentJson ?? undefined}
          placeholder={TEMPLATES[template].placeholder}
          onUpdate={handleEditorUpdate}
        />

        <div className="mt-8 pt-6 border-t border-journal-border space-y-5">
          {/* Mood */}
          <div>
            <p className="text-xs text-journal-muted mb-2">How are you feeling?</p>
            <MoodPicker value={mood} onChange={setMood} />
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs text-journal-muted mb-2">Tags</p>
            <div className="bg-journal-raised border border-journal-border rounded-lg px-3 py-2">
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </div>

          {/* Images */}
          <div>
            <p className="text-xs text-journal-muted mb-2">Photos</p>
            <ImageUpload images={images} onChange={setImages} userId={userId} />
          </div>
        </div>

        {/* Word count + error */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-journal-muted">
            {wordCount > 0 ? `${wordCount} words` : ""}
          </span>
          {error && <p className="text-journal-danger text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
}
