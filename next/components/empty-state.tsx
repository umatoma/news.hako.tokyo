export function EmptyState() {
  return (
    <div className="px-4 py-16 text-center">
      <p
        className="text-zinc-500 dark:text-zinc-400"
        data-testid="empty-state-message"
      >
        まだ記事がありません
      </p>
    </div>
  );
}
