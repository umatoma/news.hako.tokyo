import type { Article, SourceId } from "@/lib/article";

export type FetchedArticle = Omit<Article, "collectedAt">;

export interface SourceFetcher<TConfig> {
  readonly source: SourceId;
  fetch(config: TConfig): Promise<FetchedArticle[]>;
}
