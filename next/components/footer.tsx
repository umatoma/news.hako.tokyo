import type { PageStats } from "@/lib/articles";

interface FooterProps {
  stats: PageStats;
}

export function Footer({ stats }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between px-4 py-4 text-sm text-zinc-500 dark:text-zinc-400">
        <p>news.hako.tokyo</p>
        <p data-testid="footer-last-updated">
          最終更新: {stats.lastUpdatedDisplay ?? "未収集"}
        </p>
      </div>
    </footer>
  );
}
