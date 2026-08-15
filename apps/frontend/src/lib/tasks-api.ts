import { apiFetch } from "./api-client";
import { Task, TaskDetail, TaskStatus, TaskPriority, Subtask, Comment } from "./task-types";

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
  dueDate?: string;
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

export async function getOrCreateDefaultProject(): Promise<string> {
  const projects = await listProjects();
  if (projects.length > 0) return projects[0].id;
  const created = await createProject("General");
  return created.id;
}