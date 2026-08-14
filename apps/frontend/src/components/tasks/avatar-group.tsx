import { PersonSummary } from "@/lib/task-types";

export function AvatarGroup({
  people,
  max = 3,
}: {
  people: PersonSummary[];
  max?: number;
}) {
  if (people.length === 0) return null;
  const visible = people.slice(0, max);
  const extra = people.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((p) => (
        <div
          key={p.id}
          title={p.fullName ?? "Unknown"}
          className="h-6 w-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-medium shrink-0"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          {(p.fullName ?? "?").charAt(0).toUpperCase()}
        </div>
      ))}
      {extra > 0 && (
        <div className="h-6 w-6 rounded-full border-2 border-card bg-background-tertiary flex items-center justify-center text-[10px] font-medium shrink-0">
          +{extra}
        </div>
      )}
    </div>
  );
}