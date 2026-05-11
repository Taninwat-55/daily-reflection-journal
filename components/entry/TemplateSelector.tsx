"use client";

import { TEMPLATES, type TemplateKey } from "@/types";

interface TemplateSelectorProps {
  value: TemplateKey;
  onChange: (template: TemplateKey) => void;
  disabled?: boolean;
}

export default function TemplateSelector({ value, onChange, disabled }: TemplateSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-journal-raised rounded-lg p-1">
      {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onChange(key)}
          className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
            value === key
              ? "bg-journal-surface text-journal-accent"
              : "text-journal-muted hover:text-journal-text"
          }`}
        >
          {TEMPLATES[key].label}
        </button>
      ))}
    </div>
  );
}
