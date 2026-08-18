"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getTask,
  updateTask,
  addSubtask as apiAddSubtask,
  addComment as apiAddComment,
  listLabels,
  createLabel,
  attachLabel,
  detachLabel,
  addResource as apiAddResource,
  removeResource as apiRemoveResource,
} from "@/lib/tasks-api";
import { listWorkspaceMembers } from "@/lib/workspace-api";
import {
  TaskDetail,
  TaskStatus,
  TaskPriority,
  Label,
  WorkspaceMemberSummary,
} from "@/lib/task-types";
import { StatusSelect } from "@/components/tasks/status-select";
import { PrioritySelect } from "@/components/tasks/priority-select";
import { MembersPicker } from "@/components/tasks/members-picker";
import { LabelsPicker } from "@/components/tasks/labels-picker";
import { ResourcesSection } from "@/components/tasks/resources-section";
import { SubtasksSection } from "@/components/tasks/subtasks-section";
import { CommentsSection } from "@/components/tasks/comments-section";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [allMembers, setAllMembers] = useState<WorkspaceMemberSummary[]>([]);
  const [allLabels, setAllLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    try {
      const [taskData, membersData, labelsData] = await Promise.all([
        getTask(params.id),
        listWorkspaceMembers(),
        listLabels(),
      ]);
      setTask(taskData);
      setAllMembers(membersData);
      setAllLabels(labelsData);
      setTitle(taskData.title);
      setDescription(taskData.description ?? "");
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

  async function handleStartDateChange(value: string) {
    if (!task) return;
    setTask({ ...task, startDate: value || null });
    await updateTask(task.id, { startDate: value || undefined });
  }

  async function handleDueDateChange(value: string) {
    if (!task) return;
    setTask({ ...task, dueDate: value || null });
    await updateTask(task.id, { dueDate: value || undefined });
  }

  async function handleMembersChange(ids: string[]) {
    if (!task) return;
    const updated = await updateTask(task.id, { assigneeIds: ids });
    setTask({ ...task, assignees: updated.assignees });
  }

  async function handleToggleLabel(labelId: string) {
    if (!task) return;
    const isAttached = task.labels.some((l) => l.label.id === labelId);
    if (isAttached) {
      await detachLabel(task.id, labelId);
      setTask({ ...task, labels: task.labels.filter((l) => l.label.id !== labelId) });
    } else {
      const taskLabel = await attachLabel(task.id, labelId);
      setTask({ ...task, labels: [...task.labels, taskLabel] });
    }
  }

  async function handleCreateLabel(name: string, color: string) {
    if (!task) return;
    const newLabel = await createLabel(name, color);
    setAllLabels((prev) => [...prev, newLabel]);
    const taskLabel = await attachLabel(task.id, newLabel.id);
    setTask({ ...task, labels: [...task.labels, taskLabel] });
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

  async function handleAddResource(label: string, url: string) {
    if (!task) return;
    const newResource = await apiAddResource(task.id, label, url);
    setTask({ ...task, resources: [...task.resources, newResource] });
  }

  async function handleRemoveResource(resourceId: string) {
    if (!task) return;
    await apiRemoveResource(task.id, resourceId);
    setTask({ ...task, resources: task.resources.filter((r) => r.id !== resourceId) });
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

  const selectedLabelIds = task.labels.map((l) => l.label.id);
  const selectedMemberIds = task.assignees.map((a) => a.user.id);

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      {/* Main content */}
      <div className="flex-1 lg:overflow-y-auto p-4 sm:p-6">
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

        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {task.labels.map((l) => (
            <span
              key={l.label.id}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-border"
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: l.label.color }}
              />
              {l.label.name}
            </span>
          ))}
          <LabelsPicker
            allLabels={allLabels}
            selectedIds={selectedLabelIds}
            onToggle={handleToggleLabel}
            onCreate={handleCreateLabel}
          />
        </div>

        <ResourcesSection
          resources={task.resources}
          onAdd={handleAddResource}
          onRemove={handleRemoveResource}
        />

        <SubtasksSection subtasks={task.subtasks} onAdd={handleAddSubtask} />
        <CommentsSection comments={task.comments} onAdd={handleAddComment} />
      </div>

      {/* Right panel — Details */}
      <div className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-border p-4 lg:overflow-y-auto">
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
            <span className="text-foreground-muted">Members</span>
            <MembersPicker
              allMembers={allMembers}
              selectedIds={selectedMemberIds}
              onChange={handleMembersChange}
            />
          </div>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <span className="text-foreground-muted text-xs uppercase tracking-wide">Dates</span>
            <label className="flex items-center justify-between">
              <span className="text-foreground-muted text-xs">Start</span>
              <input
                type="date"
                value={task.startDate ? task.startDate.slice(0, 10) : ""}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="text-sm bg-transparent outline-none text-right"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-foreground-muted text-xs">Due</span>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className="text-sm bg-transparent outline-none text-right"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-foreground-muted">Reporter</span>
            <span className="truncate max-w-[120px]">{task.reporter?.fullName ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}