"use client";

import { MOOD_LABELS, MOOD_COLORS, MOOD_EMOJI } from "@/types";

interface MoodPickerProps {
  value: number | null;
  onChange: (mood: number | null) => void;
  readOnly?: boolean;
}

export default function MoodPicker({ value, onChange, readOnly = false }: MoodPickerProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((level) => {
        const isSelected = value === level;
        return (
          <button
            key={level}
            type="button"
            disabled={readOnly}
            title={MOOD_LABELS[level]}
            onClick={() => onChange(isSelected ? null : level)}
            className={`
              flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all
              ${readOnly ? "cursor-default" : "cursor-pointer"}
              ${isSelected
                ? "bg-journal-raised ring-1"
                : readOnly
                  ? ""
                  : "hover:bg-journal-raised opacity-50 hover:opacity-100"
              }
            `}
            style={isSelected ? { outline: `2px solid ${MOOD_COLORS[level]}`, outlineOffset: "-2px" } : undefined}
          >
            <span className="text-lg leading-none">{MOOD_EMOJI[level]}</span>
            <span
              className="font-medium"
              style={{ color: isSelected ? MOOD_COLORS[level] : "#8a8480" }}
            >
              {MOOD_LABELS[level]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MoodBadge({ mood }: { mood: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-journal-raised font-medium"
      style={{ color: MOOD_COLORS[mood] }}
    >
      {MOOD_EMOJI[mood]} {MOOD_LABELS[mood]}
    </span>
  );
}
