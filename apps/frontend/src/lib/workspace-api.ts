import { apiFetch } from "./api-client";
import { WorkspaceMemberSummary } from "./task-types";

export function listWorkspaceMembers() {
  return apiFetch<WorkspaceMemberSummary[]>("/workspace/members");
}