"use client";

import { useState, useRef, useEffect } from "react";
import { WorkspaceMemberSummary } from "@/lib/task-types";

export function MembersPicker({
  allMembers,
  selectedIds,
  onChange,
}: {
  allMembers: WorkspaceMemberSummary[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next);
  }

  const selected = allMembers.filter((m) => selectedIds.includes(m.id));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md hover:bg-background-secondary"
      >
        {selected.length === 0 ? (
          <span className="text-foreground-muted">Add members</span>
        ) : (
          <div className="flex items-center -space-x-1.5">
            {selected.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="h-5 w-5 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
              >
                {(m.fullName ?? "?").charAt(0).toUpperCase()}
              </div>
            ))}
            {selected.length > 3 && (
              <span className="text-xs text-foreground-muted pl-2">
                +{selected.length - 3}
              </span>
            )}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-card shadow-lg py-1.5 z-20 max-h-56 overflow-y-auto">
          {allMembers.length === 0 && (
            <p className="px-3 py-1.5 text-xs text-foreground-muted">No members yet.</p>
          )}
          {allMembers.map((m) => (
            <label
              key={m.id}
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-background-secondary cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(m.id)}
                onChange={() => toggle(m.id)}
              />
              <span className="truncate">{m.fullName ?? m.email}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}