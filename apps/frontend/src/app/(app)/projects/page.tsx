"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { AddProjectDialog } from "@/components/projects/add-project-dialog";
import { listProjectsFull, createProjectFull } from "@/lib/projects-api";
import { ProjectSummary } from "@/lib/project-types";
import { TaskPriority } from "@/lib/task-types";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await listProjectsFull();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(name: string, priority: TaskPriority, dueDate?: string) {
    const created = await createProjectFull({ name, priority, dueDate });
    setProjects((prev) => [{ ...created, lead: null, _count: { tasks: 0 } }, ...prev]);
  }

  return (
    <>
      <TopBar
        title="Projects"
        actions={
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            <Plus size={14} />
            Add Project
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm text-foreground-muted">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-foreground-muted text-center py-12">
            No projects yet — click &quot;Add Project&quot; to create one.
          </p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-foreground-muted border-b border-border bg-background-secondary">
                  <th className="text-left font-medium px-4 py-2">Projects</th>
                  <th className="text-left font-medium px-4 py-2 w-28">Priority</th>
                  <th className="text-left font-medium px-4 py-2 w-32">Lead</th>
                  <th className="text-left font-medium px-4 py-2 w-28">Due Date</th>
                  <th className="text-left font-medium px-4 py-2 w-20">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/projects/${p.id}`)}
                    className="border-b border-border last:border-0 hover:bg-background-secondary cursor-pointer"
                  >
                    <td className="px-4 py-2.5 font-medium">{p.name}</td>
                    <td className="px-4 py-2.5">
                      <PriorityBadge priority={p.priority} />
                    </td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      {p.lead?.fullName ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-foreground-muted">
                      {p.dueDate
                        ? new Date(p.dueDate).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-foreground-muted">{p._count.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  );
}