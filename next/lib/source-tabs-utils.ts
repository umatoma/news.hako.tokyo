import type { SourceId } from "@/lib/article";
import { ARTICLE_SOURCES } from "@/lib/article";

import type { ArticleListItemView } from "@/lib/articles";

// SOURCE_LABEL のクライアント向けコピー（node:fs に依存しない）
const LABEL: Record<SourceId, string> = {
  zenn: "Zenn",
  hatena: "はてブ",
  googlenews: "Google ニュース",
  togetter: "Togetter",
};

export type SourceTabId = "all" | SourceId;

export const SOURCE_TABS: ReadonlyArray<{ id: SourceTabId; label: string }> = [
  { id: "all", label: "すべて" },
  ...ARTICLE_SOURCES.map((id) => ({ id, label: LABEL[id] })),
];

export function filterArticlesBySource(
  views: ReadonlyArray<ArticleListItemView>,
  tabId: SourceTabId,
): ArticleListItemView[] {
  if (tabId === "all") {
    return [...views];
  }
  return [...views].filter((v) => v.sourceId === tabId);
}
