"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Label } from "@/lib/task-types";

const LABEL_COLOR_OPTIONS = [
  "#6b7280",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function LabelsPicker({
  allLabels,
  selectedIds,
  onToggle,
  onCreate,
}: {
  allLabels: Label[];
  selectedIds: string[];
  onToggle: (labelId: string) => void;
  onCreate: (name: string, color: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(LABEL_COLOR_OPTIONS[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    await onCreate(name.trim(), color);
    setName("");
    setCreating(false);
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-dashed border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted"
      >
        <Plus size={11} /> Label
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-border bg-card shadow-lg py-1.5 z-20">
          <div className="max-h-40 overflow-y-auto">
            {allLabels.map((l) => (
              <label
                key={l.id}
                className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-background-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(l.id)}
                  onChange={() => onToggle(l.id)}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: l.color }}
                />
                <span className="truncate">{l.name}</span>
              </label>
            ))}
            {allLabels.length === 0 && (
              <p className="px-3 py-1.5 text-xs text-foreground-muted">No labels yet.</p>
            )}
          </div>

          <div className="border-t border-border mt-1 pt-1.5 px-3">
            {creating ? (
              <div className="flex flex-col gap-2 pb-1">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Label name"
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs outline-none"
                />
                <div className="flex items-center gap-1 flex-wrap">
                  {LABEL_COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="h-4 w-4 rounded-full shrink-0"
                      style={{
                        background: c,
                        outline: color === c ? "2px solid var(--fg)" : "none",
                        outlineOffset: "1px",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleCreate}
                  className="text-xs px-2 py-1 rounded-md font-medium"
                  style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground py-1.5"
              >
                <Plus size={12} /> Create label
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}