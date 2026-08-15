"use client";

import { useRouter } from "next/navigation";
import { Task } from "@/lib/task-types";
import { PriorityBadge } from "./priority-badge";
import { AvatarGroup } from "./avatar-group";

export function TaskCard({
  task,
  onDragStart,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
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
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-foreground-muted">
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        )}
      </div>
      {task.assignees.length > 0 && (
        <div className="mt-2">
          <AvatarGroup people={task.assignees.map((a) => a.user)} />
        </div>
      )}
    </div>
  );
}