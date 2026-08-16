"use client";

import { useState, FormEvent } from "react";
import { TaskPriority, TASK_PRIORITIES, PRIORITY_LABELS } from "@/lib/task-types";

export function AddProjectDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, priority: TaskPriority, dueDate?: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("NO_PRIORITY");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), priority, dueDate || undefined);
      setName("");
      setPriority("NO_PRIORITY");
      setDueDate("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card border border-border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-semibold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground-muted"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded-lg hover:bg-background-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="px-3 py-1.5 text-sm rounded-lg font-medium disabled:opacity-50"
              style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              {submitting ? "Adding..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}