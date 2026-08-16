import { apiFetch } from "./api-client";
import { ProjectSummary, ProjectDetail } from "./project-types";
import { TaskPriority } from "./task-types";

export function listProjectsFull() {
  return apiFetch<ProjectSummary[]>("/projects");
}

export interface ProjectInput {
  name?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export function createProjectFull(input: ProjectInput) {
  return apiFetch<ProjectSummary>("/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getProject(id: string) {
  return apiFetch<ProjectDetail>(`/projects/${id}`);
}

export function updateProjectFull(id: string, input: ProjectInput) {
  return apiFetch<ProjectSummary>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteProjectFull(id: string) {
  return apiFetch<{ success: boolean }>(`/projects/${id}`, {
    method: "DELETE",
  });
}