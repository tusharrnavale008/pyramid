"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { TaskPriority, TASK_PRIORITIES, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/task-types";

export function PrioritySelect({
  value,
  onChange,
}: {
  value: TaskPriority;
  onChange: (v: TaskPriority) => void;
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md hover:bg-background-secondary"
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_COLORS[value] }} />
        {PRIORITY_LABELS[value]}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card shadow-lg py-1.5 z-20">
          {TASK_PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-background-secondary"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_COLORS[p] }} />
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}