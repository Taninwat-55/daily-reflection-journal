import JournalLayout from "@/components/layout/JournalLayout";
import EntryEditor from "@/components/entry/EntryEditor";
import { createClient } from "@/lib/supabase/server";

export default async function NewEntryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <JournalLayout>
      <EntryEditor userId={user?.id ?? ""} />
    </JournalLayout>
  );
}
