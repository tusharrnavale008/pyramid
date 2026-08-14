import { TaskPriority, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/task-types";

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  if (priority === "NO_PRIORITY") {
    return <span className="text-xs text-foreground-muted">No Priority</span>;
  }
  return (
    <span
      className="text-xs font-medium inline-flex items-center gap-1"
      style={{ color: PRIORITY_COLORS[priority] }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: PRIORITY_COLORS[priority] }}
      />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}