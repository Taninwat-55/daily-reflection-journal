"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Entry, TemplateKey } from "@/types";

export async function getEntries(search?: string, tag?: string, date?: string): Promise<Entry[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  if (date) {
    query = query.eq("entry_date", date);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Entry[];
}

export async function getEntry(id: string): Promise<Entry | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as Entry;
}

export async function getEntryDates(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("entries")
    .select("entry_date")
    .eq("user_id", user.id);

  if (!data) return [];
  return [...new Set(data.map((d) => d.entry_date as string))];
}

export async function getStats(): Promise<{
  total: number;
  streak: number;
  tags: string[];
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { total: 0, streak: 0, tags: [] };

  const { data } = await supabase
    .from("entries")
    .select("entry_date, tags")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false });

  if (!data) return { total: 0, streak: 0, tags: [] };

  const total = data.length;

  const uniqueDates = [...new Set(data.map((e) => e.entry_date as string))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i]);
    d.setHours(0, 0, 0, 0);
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (d.getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  const allTags = data.flatMap((e) => (e.tags as string[]) ?? []);
  const uniqueTags = [...new Set(allTags)];

  return { total, streak, tags: uniqueTags };
}

export async function createEntry(payload: {
  title: string;
  content: string;
  content_json: Record<string, unknown> | null;
  mood: number | null;
  tags: string[];
  images: string[];
  template: TemplateKey;
  word_count: number;
  entry_date: string;
}): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("entries")
    .insert({ ...payload, user_id: user.id })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data.id as string;
}

export async function updateEntry(
  id: string,
  payload: Partial<{
    title: string;
    content: string;
    content_json: Record<string, unknown> | null;
    mood: number | null;
    tags: string[];
    images: string[];
    word_count: number;
    entry_date: string;
  }>
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("entries")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath(`/${id}`);
}

export async function deleteEntry(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/");
  redirect("/");
}
