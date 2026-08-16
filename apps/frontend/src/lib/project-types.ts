import { TaskPriority, Task, PersonSummary } from "./task-types";

export interface ProjectSummary {
  id: string;
  name: string;
  priority: TaskPriority;
  dueDate: string | null;
  lead: PersonSummary | null;
  _count: { tasks: number };
}

export interface ProjectDetail {
  id: string;
  name: string;
  priority: TaskPriority;
  dueDate: string | null;
  lead: PersonSummary | null;
  tasks: Task[];
}