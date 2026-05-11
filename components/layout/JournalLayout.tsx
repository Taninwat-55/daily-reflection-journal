import Sidebar from "./Sidebar";
import { getStats } from "@/lib/actions/entries";

export default async function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stats = await getStats();

  return (
    <div className="flex h-full bg-journal-bg">
      <Sidebar initialStats={stats} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
