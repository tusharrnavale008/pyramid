import { TopBar } from "@/components/layout/topbar";

export default function TasksPage() {
  return (
    <>
      <TopBar title="Tasks" />
      <main className="flex-1 p-6">
        <p className="text-sm text-foreground-muted">
          Board/List view comes in Step 5 — this page just proves the
          Sidebar + TopBar shell and guest-login guard are working.
        </p>
      </main>
    </>
  );
}