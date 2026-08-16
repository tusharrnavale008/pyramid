"use client";

import { useState, useRef, useEffect } from "react";
import { Columns3 } from "lucide-react";
import { FieldKey, FIELD_KEYS, FIELD_LABELS } from "@/lib/task-types";

export function FieldsDropdown({
  visible,
  onToggle,
}: {
  visible: Set<FieldKey>;
  onToggle: (key: FieldKey) => void;
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-background-secondary"
      >
        <Columns3 size={14} />
        Fields
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-lg py-1.5 z-20">
          {FIELD_KEYS.map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-background-secondary cursor-pointer"
            >
              <input
                type="checkbox"
                checked={visible.has(key)}
                onChange={() => onToggle(key)}
              />
              {FIELD_LABELS[key]}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}