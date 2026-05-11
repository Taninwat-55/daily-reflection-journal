"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Minus,
  Link2,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content?: string;
  contentJson?: Record<string, unknown>;
  placeholder?: string;
  onUpdate: (data: { html: string; json: Record<string, unknown>; wordCount: number }) => void;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "text-journal-accent bg-journal-raised"
          : "text-journal-muted hover:text-journal-text hover:bg-journal-raised"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  content = "",
  contentJson,
  placeholder = "Write something...",
  onUpdate,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-journal-accent underline" } }),
    ],
    content: (contentJson ?? content) || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON() as Record<string, unknown>;
      const wordCount =
        (editor.storage.characterCount as { words: () => number }).words();
      onUpdate({ html, json, wordCount });
    },
  });

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap pb-3 mb-3 border-b border-journal-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading"
        >
          <Heading2 size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-journal-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link">
          <Link2 size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-journal-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={15} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
