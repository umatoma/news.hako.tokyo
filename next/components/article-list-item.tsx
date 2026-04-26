import type { ArticleListItemView } from "@/lib/articles";

import { SourceBadge } from "./source-badge";

interface ArticleListItemProps {
  view: ArticleListItemView;
}

export function ArticleListItem({ view }: ArticleListItemProps) {
  return (
    <li>
      <article className="px-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
        <a
          href={view.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          data-testid="article-link"
        >
          <h2 className="text-base font-medium text-zinc-900 group-hover:underline dark:text-zinc-50">
            {view.title}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <SourceBadge sourceId={view.sourceId} label={view.sourceLabel} />
            <time
              dateTime={view.publishedAtIso}
              className="text-zinc-500 dark:text-zinc-400"
            >
              {view.publishedAtDisplay}
            </time>
          </div>
        </a>
      </article>
    </li>
  );
}
