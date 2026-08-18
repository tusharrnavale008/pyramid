"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Task, TaskStatus, TASK_STATUSES, STATUS_LABELS, FieldKey } from "@/lib/task-types";
import { PriorityBadge } from "./priority-badge";
import { AvatarGroup } from "./avatar-group";

export function TaskList({
  tasks,
  visibleFields,
}: {
  tasks: Task[];
  visibleFields: Set<FieldKey>;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<Set<TaskStatus>>(new Set());

  function toggle(status: TaskStatus) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }

  const hasAnyTasks = tasks.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {TASK_STATUSES.map((status) => {
        const groupTasks = tasks.filter((t) => t.status === status);
        if (groupTasks.length === 0) return null;
        const isCollapsed = collapsed.has(status);

        return (
          <div key={status} className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => toggle(status)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-background-secondary text-sm font-medium"
            >
              <ChevronDown
                size={14}
                style={{
                  transform: isCollapsed ? "rotate(-90deg)" : "none",
                  transition: "transform 0.15s",
                }}
              />
              {STATUS_LABELS[status]}
              <span className="text-foreground-muted font-normal">{groupTasks.length}</span>
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-foreground-muted border-b border-border">
                    <th className="text-left font-medium px-4 py-2">Task</th>
                    {visibleFields.has("priority") && (
                      <th className="text-left font-medium px-4 py-2 w-28">Priority</th>
                    )}
                    {visibleFields.has("members") && (
                      <th className="text-left font-medium px-4 py-2 w-24">Members</th>
                    )}
                    {visibleFields.has("dueDate") && (
                      <th className="text-left font-medium px-4 py-2 w-28">Due Date</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {groupTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => router.push(`/tasks/${task.id}`)}
                      className="border-b border-border last:border-0 hover:bg-background-secondary cursor-pointer"
                    >
                      <td className="px-4 py-2.5">{task.title}</td>
                      {visibleFields.has("priority") && (
                        <td className="px-4 py-2.5">
                          <PriorityBadge priority={task.priority} />
                        </td>
                      )}
                      {visibleFields.has("members") && (
                        <td className="px-4 py-2.5">
                          <AvatarGroup people={task.assignees.map((a) => a.user)} />
                        </td>
                      )}
                      {visibleFields.has("dueDate") && (
                        <td className="px-4 py-2.5 text-foreground-muted">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        );
      })}

      {!hasAnyTasks && (
        <p className="text-sm text-foreground-muted text-center py-12">
          No tasks yet — click &quot;Add Task&quot; to create one.
        </p>
      )}
    </div>
  );
}