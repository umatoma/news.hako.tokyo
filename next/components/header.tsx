import type { PageStats } from "@/lib/articles";

interface HeaderProps {
  stats: PageStats;
}

export function Header({ stats }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between px-4 py-4">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          news.hako.tokyo
        </h1>
        <p
          className="text-sm text-zinc-500 dark:text-zinc-400"
          data-testid="header-article-count"
        >
          {stats.totalArticles} 件
        </p>
      </div>
    </header>
  );
}
