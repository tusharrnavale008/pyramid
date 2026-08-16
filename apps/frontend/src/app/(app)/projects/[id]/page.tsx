"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { LayoutGrid, List as ListIcon, Plus, ChevronRight } from "lucide-react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskList } from "@/components/tasks/task-list";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { getProject } from "@/lib/projects-api";
import { createTask, updateTask } from "@/lib/tasks-api";
import { ProjectDetail } from "@/lib/project-types";
import { TaskStatus, TaskPriority } from "@/lib/task-types";

type ViewMode = "board" | "list";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<ViewMode>("board");
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getProject(params.id);
      setProject(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    if (!project) return;
    setProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    });
    try {
      await updateTask(taskId, { status });
    } catch {
      load();
    }
  }

  async function handleAddTask(title: string, priority: TaskPriority) {
    if (!project) return;
    const newTask = await createTask(project.id, { title, priority, status: "TODO" });
    setProject({ ...project, tasks: [...project.tasks, newTask] });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-foreground-muted">
        Loading...
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm text-foreground-muted">
        <p>Project not found.</p>
        <button onClick={() => router.push("/projects")} className="underline">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5 text-sm">
          <button
            onClick={() => router.push("/projects")}
            className="text-foreground-muted hover:text-foreground"
          >
            Projects
          </button>
          <ChevronRight size={14} className="text-foreground-muted" />
          <span className="font-semibold">{project.name}</span>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </header>

      {view === "board" ? (
        <KanbanBoard tasks={project.tasks} onStatusChange={handleStatusChange} />
      ) : (
        <TaskList tasks={project.tasks} />
      )}

      <AddTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}