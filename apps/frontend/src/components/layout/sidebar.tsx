"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderKanban, ChevronsUpDown } from "lucide-react";
import { ProfileMenu } from "@/components/theme/profile-menu";
import { StoredUser, StoredWorkspace } from "@/lib/auth-storage";

const NAV_ITEMS = [
  { href: "/tasks", label: "Tasks", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

export function Sidebar({
  user,
  workspace,
}: {
  user: StoredUser;
  workspace: StoredWorkspace;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-screen border-r border-border bg-background flex flex-col p-3">
      <div className="flex items-center gap-2 mb-1">
        <ProfileMenu name={user.fullName ?? "Guest"} email={user.email} />
      </div>

      <button className="flex items-center justify-between px-2 py-2 mt-2 text-xs font-medium text-foreground-muted rounded-lg hover:bg-background-secondary">
        <span className="truncate">{workspace.name}</span>
        <ChevronsUpDown size={13} className="shrink-0" />
      </button>

      <nav className="mt-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                background: active ? "var(--bg-secondary)" : "transparent",
                fontWeight: active ? 500 : 400,
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}