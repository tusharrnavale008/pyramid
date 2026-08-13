import { ReactNode } from "react";

export function TopBar({
  title,
  actions,
}: {
  title: string;
  actions?: ReactNode;
}) {
  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}