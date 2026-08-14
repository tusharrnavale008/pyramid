"use client";

import { useState } from "react";
import { Task, TaskStatus, TASK_STATUSES, STATUS_LABELS } from "@/lib/task-types";
import { TaskCard } from "./task-card";

export function KanbanBoard({
  tasks,
  onStatusChange,
}: {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("text/plain", taskId);
  }

  function handleDrop(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onStatusChange(taskId, status);
    setDragOverColumn(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-6 flex-1">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumn(status);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, status)}
            className="w-72 shrink-0 rounded-xl p-2 transition-colors"
            style={{
              background: dragOverColumn === status ? "var(--bg-secondary)" : "transparent",
            }}
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                {STATUS_LABELS[status]}
              </h3>
              <span className="text-xs text-foreground-muted">{columnTasks.length}</span>
            </div>
            <div className="flex flex-col gap-2 min-h-[40px]">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}