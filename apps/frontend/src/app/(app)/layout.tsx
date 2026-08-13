"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getToken, getUser, getWorkspace, StoredUser, StoredWorkspace } from "@/lib/auth-storage";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: StoredUser;
    workspace: StoredWorkspace;
  } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    const workspace = getWorkspace();

    if (!token || !user || !workspace) {
      router.replace("/login");
      return;
    }

    setSession({ user, workspace });
    setChecked(true);
  }, [router]);

  if (!checked || !session) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={session.user} workspace={session.workspace} />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}