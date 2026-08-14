import { apiFetch } from "./api-client";
import { Task, TaskStatus, TaskPriority } from "./task-types";

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
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export function createTask(projectId: string, input: TaskInput) {
  return apiFetch<Task>(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(input),
  });
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

export async function getOrCreateDefaultProject(): Promise<string> {
  const projects = await listProjects();
  if (projects.length > 0) return projects[0].id;
  const created = await createProject("General");
  return created.id;
}