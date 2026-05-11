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
    description: "A blank page, no structure",
    placeholder: "What's on your mind today?",
    content: "",
  },
  morning: {
    label: "Morning",
    description: "Set intentions for the day",
    placeholder: "What would make today meaningful?",
    content: `<h2>Morning Reflection</h2><p><strong>What would make today meaningful?</strong></p><p></p><p><strong>How can I show kindness to myself today?</strong></p><p></p><p><strong>What is my top priority for today?</strong></p><p></p><p><strong>How can I nurture my physical and mental health today?</strong></p><p></p>`,
  },
  evening: {
    label: "Evening",
    description: "Review and close the day",
    placeholder: "What was the best part of your day?",
    content: `<h2>Evening Reflection</h2><p><strong>What was the best part of my day?</strong></p><p></p><p><strong>What did I learn today, and what did I enjoy?</strong></p><p></p><p><strong>Did I act in accordance with my values?</strong></p><p></p><p><strong>What is one thing I would do differently tomorrow?</strong></p><p></p><p><strong>What challenged me, and how did I manage it?</strong></p><p></p>`,
  },
  wellbeing: {
    label: "Well-Being",
    description: "Check in with your emotions",
    placeholder: "How are you feeling right now?",
    content: `<h2>Emotional Well-Being</h2><p><strong>How am I feeling physically and emotionally right now?</strong></p><p></p><p><strong>What brought me joy, gratitude, or contentment today?</strong></p><p></p><p><strong>Did I encounter any negative self-talk today?</strong></p><p></p>`,
  },
  growth: {
    label: "Growth",
    description: "Track progress and challenges",
    placeholder: "What step did you take today?",
    content: `<h2>Growth &amp; Productivity</h2><p><strong>What is one small step I took toward a goal?</strong></p><p></p><p><strong>What distracted me or slowed my progress today?</strong></p><p></p><p><strong>Did I step out of my comfort zone today?</strong></p><p></p>`,
  },
  simple321: {
    label: "3-2-1",
    description: "Quick daily recap",
    placeholder: "Start your 3-2-1 reflection…",
    content: `<h2>3-2-1 Reflection</h2><p><strong>3 things I learned:</strong></p><ol><li><p></p></li><li><p></p></li><li><p></p></li></ol><p><strong>2 things I enjoyed:</strong></p><ol><li><p></p></li><li><p></p></li></ol><p><strong>1 thing I will focus on tomorrow:</strong></p><ol><li><p></p></li></ol>`,
  },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
