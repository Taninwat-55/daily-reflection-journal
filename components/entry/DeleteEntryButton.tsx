"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { deleteEntry } from "@/lib/actions/entries";

interface DeleteEntryButtonProps {
  id: string;
}

export default function DeleteEntryButton({ id }: DeleteEntryButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteEntry(id);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-journal-muted hover:text-journal-danger transition-colors px-3 py-1.5 rounded-lg hover:bg-journal-raised"
      >
        <Trash2 size={13} />
        Delete
      </button>

      <Modal
        open={open}
        title="Delete entry?"
        description="This can't be undone. The entry will be permanently deleted."
        confirmLabel={isPending ? "Deleting…" : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        dangerous
      />
    </>
  );
}
