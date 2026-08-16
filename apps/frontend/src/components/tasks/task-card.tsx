"use client";

import { useRouter } from "next/navigation";
import { Task, FieldKey } from "@/lib/task-types";
import { PriorityBadge } from "./priority-badge";
import { AvatarGroup } from "./avatar-group";

export function TaskCard({
  task,
  onDragStart,
  visibleFields,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  visibleFields: Set<FieldKey>;
}) {
  const router = useRouter();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => router.push(`/tasks/${task.id}`)}
      className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:border-foreground-muted transition-colors"
    >
      <p className="text-sm font-medium mb-2">{task.title}</p>

      {visibleFields.has("labels") && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((l) => (
            <span
              key={l.label.id}
              className="text-[10px] px-1.5 py-0.5 rounded-full border border-border"
            >
              {l.label.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {visibleFields.has("priority") && <PriorityBadge priority={task.priority} />}
        {visibleFields.has("dueDate") && task.dueDate && (
          <span className="text-xs text-foreground-muted">
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        )}
      </div>

      {visibleFields.has("members") && task.assignees.length > 0 && (
        <div className="mt-2">
          <AvatarGroup people={task.assignees.map((a) => a.user)} />
        </div>
      )}
    </div>
  );
}