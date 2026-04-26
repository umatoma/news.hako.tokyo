import type { ArticleListItemView } from "@/lib/articles";

import { ArticleListItem } from "./article-list-item";

interface ArticleListProps {
  views: ArticleListItemView[];
}

export function ArticleList({ views }: ArticleListProps) {
  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {views.map((view) => (
        <ArticleListItem key={view.id} view={view} />
      ))}
    </ul>
  );
}
