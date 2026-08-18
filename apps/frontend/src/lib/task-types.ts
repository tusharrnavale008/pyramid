export const TASK_STATUSES = ["TODO", "DOING", "COMPLETED", "ON_HOLD"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "#9ca3af",
  DOING: "#3b82f6",
  COMPLETED: "#10b981",
  ON_HOLD: "#f59e0b",
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

export interface WorkspaceMemberSummary extends PersonSummary {
  email: string;
}

export interface TaskAssignee {
  user: PersonSummary;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface TaskLabel {
  label: Label;
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

export interface Subtask {
  id: string;
  title: string;
  priority: TaskPriority;
  memberId: string | null;
  dueDate: string | null;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: PersonSummary;
}

export interface TaskResourceItem {
  id: string;
  label: string;
  url: string;
}

export interface TaskDetail extends Task {
  subtasks: Subtask[];
  comments: Comment[];
  resources: TaskResourceItem[];
  reporter: PersonSummary | null;
}

export const FIELD_KEYS = ["priority", "members", "dueDate", "labels"] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];

export const FIELD_LABELS: Record<FieldKey, string> = {
  priority: "Priority",
  members: "Members",
  dueDate: "Due Date",
  labels: "Labels",
};