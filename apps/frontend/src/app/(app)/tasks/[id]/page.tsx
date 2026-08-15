"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getTask,
  updateTask,
  addSubtask as apiAddSubtask,
  addComment as apiAddComment,
} from "@/lib/tasks-api";
import { TaskDetail, TaskStatus, TaskPriority } from "@/lib/task-types";
import { StatusSelect } from "@/components/tasks/status-select";
import { PrioritySelect } from "@/components/tasks/priority-select";
import { SubtasksSection } from "@/components/tasks/subtasks-section";
import { CommentsSection } from "@/components/tasks/comments-section";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await getTask(params.id);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description ?? "");
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveTitle() {
    if (!task || title === task.title) return;
    await updateTask(task.id, { title });
    setTask({ ...task, title });
  }

  async function saveDescription() {
    if (!task || description === (task.description ?? "")) return;
    await updateTask(task.id, { description });
    setTask({ ...task, description });
  }

  async function handleStatusChange(status: TaskStatus) {
    if (!task) return;
    setTask({ ...task, status });
    await updateTask(task.id, { status });
  }

  async function handlePriorityChange(priority: TaskPriority) {
    if (!task) return;
    setTask({ ...task, priority });
    await updateTask(task.id, { priority });
  }

  async function handleAddSubtask(subtaskTitle: string) {
    if (!task) return;
    const newSubtask = await apiAddSubtask(task.id, subtaskTitle);
    setTask({ ...task, subtasks: [...task.subtasks, newSubtask] });
  }

  async function handleAddComment(text: string) {
    if (!task) return;
    const newComment = await apiAddComment(task.id, text);
    setTask({ ...task, comments: [...task.comments, newComment] });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-foreground-muted">
        Loading...
      </div>
    );
  }

  if (notFound || !task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm text-foreground-muted">
        <p>Task not found.</p>
        <button onClick={() => router.push("/tasks")} className="underline">
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <button
          onClick={() => router.push("/tasks")}
          className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground mb-4"
        >
          <ArrowLeft size={14} /> Tasks
        </button>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className="w-full text-xl font-semibold outline-none bg-transparent mb-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={saveDescription}
          placeholder="Add a description..."
          rows={2}
          className="w-full text-sm text-foreground-muted outline-none bg-transparent resize-none mb-4"
        />

        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {task.labels.map((l) => (
              <span
                key={l.label.id}
                className="text-xs px-2 py-0.5 rounded-full border border-border"
              >
                {l.label.name}
              </span>
            ))}
          </div>
        )}

        <SubtasksSection subtasks={task.subtasks} onAdd={handleAddSubtask} />
        <CommentsSection comments={task.comments} onAdd={handleAddComment} />
      </div>

      <div className="w-64 shrink-0 border-l border-border p-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">
          Details
        </h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Status</span>
            <StatusSelect value={task.status} onChange={handleStatusChange} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Priority</span>
            <PrioritySelect value={task.priority} onChange={handlePriorityChange} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Reporter</span>
            <span className="truncate max-w-[120px]">{task.reporter?.fullName ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}