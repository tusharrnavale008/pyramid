"use client";

import { useState } from "react";
import { Plus, Link2, X } from "lucide-react";
import { TaskResourceItem } from "@/lib/task-types";

export function ResourcesSection({
  resources,
  onAdd,
  onRemove,
}: {
  resources: TaskResourceItem[];
  onAdd: (label: string, url: string) => Promise<void>;
  onRemove: (resourceId: string) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    if (!label.trim() || !url.trim()) return;

    setSubmitting(true);

    try {
      await onAdd(label.trim(), url.trim());
      setLabel("");
      setUrl("");
      setAdding(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-medium">Resources</h3>

      {resources.length > 0 && (
        <div className="mb-2 flex flex-col gap-1.5">
          {resources.map((r) => (
            <div
              key={r.id}
              className="group flex items-center gap-2 text-sm"
            >
              <Link2
                size={13}
                className="shrink-0 text-foreground-muted"
              />

              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-600 hover:underline"
              >
                {r.label}
              </a>

              <button
                type="button"
                onClick={() => onRemove(r.id)}
                className="shrink-0 text-foreground-muted opacity-0 hover:text-red-500 group-hover:opacity-100"
                aria-label={`Remove ${r.label}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="flex max-w-sm flex-col gap-2">
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Link title"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground-muted"
          />

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground-muted"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={submitting}
              className="rounded-lg px-3 py-1.5 text-sm font-medium"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              {submitting ? "..." : "Add"}
            </button>

            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-2 py-1.5 text-sm text-foreground-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
        >
          <Plus size={14} />
          Add document or link
        </button>
      )}
    </div>
  );
}