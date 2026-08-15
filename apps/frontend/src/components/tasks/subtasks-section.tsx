"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Subtask } from "@/lib/task-types";
import { PriorityBadge } from "./priority-badge";

export function SubtasksSection({
  subtasks,
  onAdd,
}: {
  subtasks: Subtask[];
  onAdd: (title: string) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    if (!title.trim()) {
      setAdding(false);
      return;
    }
    setSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle("");
      setAdding(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Subtasks</h3>

      {subtasks.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden mb-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-foreground-muted border-b border-border bg-background-secondary">
                <th className="text-left font-medium px-3 py-2">Task</th>
                <th className="text-left font-medium px-3 py-2 w-28">Priority</th>
                <th className="text-left font-medium px-3 py-2 w-28">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">{s.title}</td>
                  <td className="px-3 py-2">
                    <PriorityBadge priority={s.priority} />
                  </td>
                  <td className="px-3 py-2 text-foreground-muted">
                    {s.dueDate
                      ? new Date(s.dueDate).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Subtask title"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground-muted"
          />
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="text-sm px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            {submitting ? "..." : "Add"}
          </button>
          <button
            onClick={() => setAdding(false)}
            className="text-sm px-2 py-1.5 text-foreground-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
        >
          <Plus size={14} /> Add Subtasks
        </button>
      )}
    </div>
  );
}