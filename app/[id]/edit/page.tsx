import { notFound } from "next/navigation";
import JournalLayout from "@/components/layout/JournalLayout";
import EntryEditor from "@/components/entry/EntryEditor";
import { getEntry } from "@/lib/actions/entries";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: PageProps) {
  const { id } = await params;
  const [entry, supabase] = await Promise.all([
    getEntry(id),
    createClient(),
  ]);

  if (!entry) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <JournalLayout>
      <EntryEditor entry={entry} userId={user?.id ?? ""} />
    </JournalLayout>
  );
}
