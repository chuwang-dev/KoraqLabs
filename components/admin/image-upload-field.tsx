"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * A text field holding the image URL, plus an Upload button. Uploading
 * fills the field with the hosted URL; pasting an external URL still works.
 * The input keeps its `name`, so it submits with the surrounding form
 * exactly like the plain URL field it replaces.
 */
export function ImageUploadField({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (file.size > MAX_BYTES) {
      setError("Image is too large (max 2 MB).");
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as { ok: boolean; url?: string; error?: string } | null;
      if (!response.ok || !data?.ok || !data.url) {
        setError(data?.error ?? "Upload failed. Please try again.");
      } else {
        setValue(data.url);
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="admin-input min-w-0 flex-1"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded border border-ink-900/15 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-900/5 disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="h-16 w-16 rounded border border-ink-900/10 object-cover" />
      ) : null}
    </div>
  );
}
