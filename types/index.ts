export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_json: Record<string, unknown> | null;
  mood: number | null;
  tags: string[];
  images: string[];
  template: "morning" | "evening" | "freeform";
  word_count: number;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export const MOOD_LABELS: Record<number, string> = {
  1: "Rough",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const MOOD_COLORS: Record<number, string> = {
  1: "#e05555",
  2: "#d4824a",
  3: "#d4a853",
  4: "#8ab55a",
  5: "#5a9a5a",
};

export const MOOD_EMOJI: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

export const TEMPLATES = {
  freeform: {
    label: "Free Write",
    placeholder: "What's on your mind today?",
    content: "",
  },
  morning: {
    label: "Morning",
    placeholder: "How are you feeling as the day begins?",
    content: `<h2>Morning Reflection</h2><p><strong>Grateful for:</strong></p><ul><li><p></p></li><li><p></p></li><li><p></p></li></ul><p><strong>Today's intention:</strong></p><p></p><p><strong>What would make today great?</strong></p><p></p>`,
  },
  evening: {
    label: "Evening",
    placeholder: "How did today go?",
    content: `<h2>Evening Review</h2><p><strong>Highlights of today:</strong></p><p></p><p><strong>What I learned:</strong></p><p></p><p><strong>What I'd do differently:</strong></p><p></p><p><strong>Tomorrow I want to:</strong></p><p></p>`,
  },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
