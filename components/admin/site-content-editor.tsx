"use client";

import { useActionState, useState } from "react";
import { FormStatusBanner, SaveButton } from "@/components/admin/form-status";
import { initialSaveFormState } from "@/lib/admin-form-state";
import type { SiteContent } from "@/lib/site-content";
import { saveContent } from "@/app/admin/(shell)/content/actions";

type PathPart = string | number;

function labelFor(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function setAtPath(value: unknown, path: PathPart[], nextValue: unknown): unknown {
  if (path.length === 0) return nextValue;
  const [part, ...rest] = path;

  if (Array.isArray(value) && typeof part === "number") {
    return value.map((item, index) =>
      index === part ? setAtPath(item, rest, nextValue) : item
    );
  }
  if (value && typeof value === "object" && typeof part === "string") {
    const record = value as Record<string, unknown>;
    return { ...record, [part]: setAtPath(record[part], rest, nextValue) };
  }
  return value;
}

function emptyLike(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, emptyLike(child)])
    );
  }
  return "";
}

function valueAtPath(value: unknown, path: PathPart[]): unknown {
  return path.reduce<unknown>((current, part) => {
    if (Array.isArray(current) && typeof part === "number") return current[part];
    if (current && typeof current === "object" && typeof part === "string") {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, value);
}

export function SiteContentEditor({
  content: initialContent,
  templates,
}: {
  content: SiteContent;
  templates: SiteContent;
}) {
  const [state, formAction] = useActionState(saveContent, initialSaveFormState);
  const [content, setContent] = useState(initialContent);

  function renderField(value: unknown, path: PathPart[], key: string): React.ReactNode {
    if (Array.isArray(value)) {
      return (
        <details key={path.join(".")} open={path.length < 2} className="rounded border border-ink-900/10 bg-paper-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink-800">
            {labelFor(key)} <span className="font-normal text-ink-400">({value.length})</span>
          </summary>
          <div className="mt-4 space-y-3">
            {value.map((item, index) => (
              <div key={`${path.join(".")}-${index}`} className="rounded border border-ink-900/10 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-ink-500">{labelFor(key)} {index + 1}</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const items = [...value];
                        [items[index - 1], items[index]] = [items[index], items[index - 1]];
                        setContent(setAtPath(content, path, items) as SiteContent);
                      }}
                      className="text-xs font-medium text-ink-600 hover:underline disabled:opacity-30"
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      disabled={index === value.length - 1}
                      onClick={() => {
                        const items = [...value];
                        [items[index], items[index + 1]] = [items[index + 1], items[index]];
                        setContent(setAtPath(content, path, items) as SiteContent);
                      }}
                      className="text-xs font-medium text-ink-600 hover:underline disabled:opacity-30"
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(setAtPath(content, path, value.filter((_, itemIndex) => itemIndex !== index)) as SiteContent)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {renderField(item, [...path, index], String(index))}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const template = valueAtPath(templates, path);
                const shape = value[0] ?? (Array.isArray(template) ? template[0] : template);
                setContent(setAtPath(content, path, [...value, emptyLike(shape)]) as SiteContent);
              }}
              className="rounded border border-ink-900/15 px-3 py-2 text-xs font-medium text-ink-700 hover:bg-ink-900/5"
            >
              Add {labelFor(key)}
            </button>
          </div>
        </details>
      );
    }

    if (value && typeof value === "object") {
      return (
        <details key={path.join(".")} open={path.length < 2} className="rounded border border-ink-900/10 bg-paper-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink-800">{labelFor(key)}</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.entries(value).map(([childKey, childValue]) =>
              renderField(childValue, [...path, childKey], childKey)
            )}
          </div>
        </details>
      );
    }

    if (typeof value === "boolean") {
      return (
        <label key={path.join(".")} className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => setContent(setAtPath(content, path, event.target.checked) as SiteContent)}
            className="h-4 w-4 accent-ink-900"
          />
          {labelFor(key)}
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <label key={path.join(".")} className="block text-xs font-medium text-ink-600">
          {labelFor(key)}
          <input
            type="number"
            value={value}
            onChange={(event) => setContent(setAtPath(content, path, Number(event.target.value)) as SiteContent)}
            className="admin-input mt-1"
          />
        </label>
      );
    }

    if (typeof value === "string") {
      const multiline = value.length > 90 || /description|supporting|headline|note|answer/i.test(key);
      return (
        <label key={path.join(".")} className="block text-xs font-medium text-ink-600">
          {labelFor(key)}
          {multiline ? (
            <textarea
              value={value}
              rows={3}
              onChange={(event) => setContent(setAtPath(content, path, event.target.value) as SiteContent)}
              className="admin-input mt-1"
            />
          ) : (
            <input
              value={value}
              onChange={(event) => setContent(setAtPath(content, path, event.target.value) as SiteContent)}
              className="admin-input mt-1"
            />
          )}
        </label>
      );
    }

    return null;
  }

  return (
    <form action={formAction} className="space-y-5">
      <FormStatusBanner state={state} />
      <input type="hidden" name="contentJson" value={JSON.stringify(content)} />
      {Object.entries(content).map(([key, value]) => renderField(value, [key], key))}
      <div className="sticky bottom-3 flex items-center gap-3 rounded border border-ink-900/10 bg-paper-white/95 p-3 shadow-lg backdrop-blur">
        <SaveButton label="Save and publish" savingLabel="Saving…" />
        <span className="text-xs text-ink-400">Publishing updates the public pages.</span>
      </div>
    </form>
  );
}