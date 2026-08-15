"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Comment } from "@/lib/task-types";

export function CommentsSection({
  comments,
  onAdd,
}: {
  comments: Comment[];
  onAdd: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">Comments</h3>

      <div className="flex flex-col gap-3 mb-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
              style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              {(c.user.fullName ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{c.user.fullName ?? "Unknown"}</span>
                <span className="text-xs text-foreground-muted">
                  {new Date(c.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground-muted">{c.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-foreground-muted">No comments yet.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Add a comment..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground-muted"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="p-2 rounded-lg disabled:opacity-40"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}