import type { SourceId } from "@/lib/article";

interface SourceBadgeProps {
  sourceId: SourceId;
  label: string;
}

const BADGE_CLASS: Record<SourceId, string> = {
  zenn: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200",
  hatena: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  googlenews:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  togetter:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
};

export function SourceBadge({ sourceId, label }: SourceBadgeProps) {
  return (
    <span
      data-testid={`source-badge-${sourceId}`}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_CLASS[sourceId]}`}
    >
      {label}
    </span>
  );
}
