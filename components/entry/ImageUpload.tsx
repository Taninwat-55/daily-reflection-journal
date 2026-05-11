"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  userId: string;
}

export default function ImageUpload({ images, onChange, userId }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const newPaths: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) {
        setError("Max image size is 10MB");
        continue;
      }

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("journal-images")
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
      } else {
        newPaths.push(path);
      }
    }

    onChange([...images, ...newPaths]);
    setUploading(false);
  }

  async function removeImage(path: string) {
    const supabase = createClient();
    await supabase.storage.from("journal-images").remove([path]);
    onChange(images.filter((p) => p !== path));
  }

  function getPublicUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from("journal-images").getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((path) => (
            <div key={path} className="relative group w-24 h-24">
              <Image
                src={getPublicUrl(path)}
                alt="Journal image"
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(path)}
                className="absolute -top-1.5 -right-1.5 bg-journal-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 text-sm text-journal-muted hover:text-journal-text transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ImagePlus size={16} />
        )}
        {uploading ? "Uploading…" : "Add images"}
      </button>

      {error && <p className="text-journal-danger text-xs">{error}</p>}
    </div>
  );
}
