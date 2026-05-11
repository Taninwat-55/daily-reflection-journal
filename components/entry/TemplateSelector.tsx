"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { TEMPLATES, type TemplateKey } from "@/types";

const TEMPLATE_ICONS: Record<TemplateKey, string> = {
  freeform:  "✏️",
  morning:   "🌅",
  evening:   "🌙",
  wellbeing: "🫧",
  growth:    "🌱",
  simple321: "🔢",
};

interface TemplateSelectorProps {
  value: TemplateKey;
  onChange: (template: TemplateKey) => void;
  disabled?: boolean;
}

export default function TemplateSelector({ value, onChange, disabled }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(key: TemplateKey) {
    onChange(key);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-journal-raised border border-journal-border rounded-lg px-3 py-1.5 text-xs text-journal-text hover:border-journal-accent/40 transition-colors disabled:opacity-40"
      >
        <span>{TEMPLATE_ICONS[value]}</span>
        <span className="font-medium">{TEMPLATES[value].label}</span>
        <ChevronDown size={12} className={`text-journal-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-journal-surface border border-journal-border rounded-xl shadow-2xl z-50 overflow-hidden py-1">
          {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-journal-raised transition-colors text-left"
            >
              <span className="text-base leading-none">{TEMPLATE_ICONS[key]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-journal-text">{TEMPLATES[key].label}</p>
                <p className="text-[11px] text-journal-muted truncate">{TEMPLATES[key].description}</p>
              </div>
              {value === key && (
                <Check size={12} className="text-journal-accent shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
