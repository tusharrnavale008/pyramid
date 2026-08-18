"use client";

import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, List as ListIcon, Search, Plus } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskList } from "@/components/tasks/task-list";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { FieldsDropdown } from "@/components/tasks/fields-dropdown";
import {
  listWorkspaceTasks,
  updateTask,
  createTask,
  getOrCreateDefaultProject,
} from "@/lib/tasks-api";
import { Task, TaskStatus, TaskPriority, FieldKey, FIELD_KEYS } from "@/lib/task-types";

type ViewMode = "board" | "list";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("board");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<Set<FieldKey>>(new Set(FIELD_KEYS));

  const loadTasks = useCallback(async () => {
    try {
      const data = await listWorkspaceTasks();
      setTasks(data);
    } catch {
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function toggleField(key: FieldKey) {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    try {
      await updateTask(taskId, { status });
    } catch {
      loadTasks();
    }
  }

  async function handleAddTask(title: string, priority: TaskPriority) {
    const projectId = await getOrCreateDefaultProject();
    const newTask = await createTask(projectId, { title, priority, status: "TODO" });
    setTasks((prev) => [...prev, newTask]);
  }

  const filteredTasks = search.trim()
    ? tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  return (
    <>
      <TopBar
        title="Tasks"
        actions={
          <>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background w-28 sm:w-40 outline-none focus:border-foreground-muted"
              />
            </div>

            <FieldsDropdown visible={visibleFields} onToggle={toggleField} />

            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setView("list")}
                className="p-1.5"
                style={{ background: view === "list" ? "var(--bg-secondary)" : "transparent" }}
                title="List view"
              >
                <ListIcon size={15} />
              </button>
              <button
                onClick={() => setView("board")}
                className="p-1.5"
                style={{ background: view === "board" ? "var(--bg-secondary)" : "transparent" }}
                title="Board view"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg"
              style={{ background: "var(--fg)", color: "var(--bg)" }}
            >
              <Plus size={14} />
              Add Task
            </button>
          </>
        }
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-foreground-muted">
          Loading tasks...
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-sm text-red-500">
          {error}
        </div>
      ) : view === "board" ? (
        <KanbanBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          visibleFields={visibleFields}
        />
      ) : (
        <TaskList tasks={filteredTasks} visibleFields={visibleFields} />
      )}

      <AddTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}