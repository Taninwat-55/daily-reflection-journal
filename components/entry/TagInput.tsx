"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  readOnly?: boolean;
}

export default function TagInput({ tags, onChange, readOnly = false }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-[36px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-journal-raised border border-journal-border rounded-full text-xs text-journal-muted"
        >
          #{tag}
          {!readOnly && (
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-journal-muted hover:text-journal-text transition-colors"
            >
              <X size={10} />
            </button>
          )}
        </span>
      ))}
      {!readOnly && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length === 0 ? "Add tags…" : ""}
          className="bg-transparent text-sm text-journal-text placeholder:text-journal-muted outline-none min-w-[80px] flex-1"
        />
      )}
    </div>
  );
}
