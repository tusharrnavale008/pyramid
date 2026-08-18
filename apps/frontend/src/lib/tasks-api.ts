import { apiFetch } from "./api-client";
import {
  Task,
  TaskDetail,
  TaskStatus,
  TaskPriority,
  Subtask,
  Comment,
  Label,
  TaskLabel,
  TaskResourceItem,
} from "./task-types";

export function listWorkspaceTasks() {
  return apiFetch<Task[]>("/tasks");
}

export function listProjects() {
  return apiFetch<{ id: string; name: string }[]>("/projects");
}

export function createProject(name: string) {
  return apiFetch<{ id: string; name: string }>("/projects", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export interface TaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  assigneeIds?: string[];
}

export function createTask(projectId: string, input: TaskInput) {
  return apiFetch<Task>(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTask(id: string) {
  return apiFetch<TaskDetail>(`/tasks/${id}`);
}

export function updateTask(taskId: string, input: TaskInput) {
  return apiFetch<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTask(taskId: string) {
  return apiFetch<{ success: boolean }>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export function addSubtask(taskId: string, title: string) {
  return apiFetch<Subtask>(`/tasks/${taskId}/subtasks`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function addComment(taskId: string, text: string) {
  return apiFetch<Comment>(`/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// --- Labels ---

export function listLabels() {
  return apiFetch<Label[]>("/labels");
}

export function createLabel(name: string, color: string) {
  return apiFetch<Label>("/labels", {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export function attachLabel(taskId: string, labelId: string) {
  return apiFetch<TaskLabel>(`/tasks/${taskId}/labels/${labelId}`, {
    method: "POST",
  });
}

export function detachLabel(taskId: string, labelId: string) {
  return apiFetch<{ success: boolean }>(`/tasks/${taskId}/labels/${labelId}`, {
    method: "DELETE",
  });
}

// --- Resources ---

export function addResource(taskId: string, label: string, url: string) {
  return apiFetch<TaskResourceItem>(`/tasks/${taskId}/resources`, {
    method: "POST",
    body: JSON.stringify({ label, url }),
  });
}

export function removeResource(taskId: string, resourceId: string) {
  return apiFetch<{ success: boolean }>(`/tasks/${taskId}/resources/${resourceId}`, {
    method: "DELETE",
  });
}

export async function getOrCreateDefaultProject(): Promise<string> {
  const projects = await listProjects();
  if (projects.length > 0) return projects[0].id;
  const created = await createProject("General");
  return created.id;
}