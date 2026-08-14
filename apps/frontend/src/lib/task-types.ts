export const TASK_STATUSES = ["TODO", "DOING", "COMPLETED", "ON_HOLD"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

export const TASK_PRIORITIES = [
  "NO_PRIORITY",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  NO_PRIORITY: "No Priority",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  NO_PRIORITY: "#9ca3af",
  LOW: "#9ca3af",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  URGENT: "#ef4444",
};

export interface PersonSummary {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface TaskAssignee {
  user: PersonSummary;
}

export interface TaskLabel {
  label: { id: string; name: string; color: string };
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  assignees: TaskAssignee[];
  labels: TaskLabel[];
  project?: { id: string; name: string };
  _count?: { subtasks: number; comments: number };
}