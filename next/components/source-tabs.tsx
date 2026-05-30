"use client";

import { useState } from "react";

import { ArticleList } from "@/components/article-list";
import { EmptyState } from "@/components/empty-state";
import type { ArticleListItemView } from "@/lib/articles";
import {
  filterArticlesBySource,
  SOURCE_TABS,
} from "@/lib/source-tabs-utils";
import type { SourceTabId } from "@/lib/source-tabs-utils";

interface SourceTabsProps {
  views: ArticleListItemView[];
}

export function SourceTabs({ views }: SourceTabsProps) {
  const [selected, setSelected] = useState<SourceTabId>("all");

  const filtered = filterArticlesBySource(views, selected);

  return (
    <div>
      <nav
        role="tablist"
        data-testid="source-tabs"
        className="flex gap-1 overflow-x-auto border-b border-zinc-200 px-4 dark:border-zinc-800"
      >
        {SOURCE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-testid={`source-tab-${tab.id}`}
            aria-selected={selected === tab.id}
            onClick={() => setSelected(tab.id)}
            className={[
              "shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              selected === tab.id
                ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ArticleList views={filtered} />
      )}
    </div>
  );
}
