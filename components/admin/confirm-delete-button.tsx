"use client";

export function ConfirmDeleteButton({ item }: { item: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(`Delete “${item}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="text-xs font-medium text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}