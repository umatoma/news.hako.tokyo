import type { HatenaConfig } from "@/config/sources";
import type { SourceId } from "@/lib/article";

import type { Clock } from "../lib/clock";
import type { HttpClient } from "../lib/http-client";
import type { Logger } from "../logger";
import { errorMessage, parseRss } from "./rss-mapping";
import type { FetchedArticle, SourceFetcher } from "./source-fetcher";

export interface HatenaRssFetcherDeps {
  http: HttpClient;
  logger: Logger;
  clock: Clock;
}

export class HatenaRssFetcher implements SourceFetcher<HatenaConfig> {
  readonly source: SourceId = "hatena";

  constructor(private readonly deps: HatenaRssFetcherDeps) {}

  async fetch(config: HatenaConfig): Promise<FetchedArticle[]> {
    if (!config.enabled) return [];

    const all: FetchedArticle[] = [];
    for (const url of config.feedUrls) {
      try {
        const response = await this.deps.http.get(url);
        if (response.status >= 400) {
          this.deps.logger.warn(this.source, "non-2xx response", {
            url,
            status: response.status,
          });
          continue;
        }
        const items = await parseRss(response.body, {
          source: this.source,
          logger: this.deps.logger,
          fallbackPublishedAt: () => this.deps.clock().toISOString(),
        });
        all.push(...items);
      } catch (err) {
        this.deps.logger.warn(this.source, "feed fetch failed, continuing", {
          url,
          error: errorMessage(err),
        });
      }
    }

    return all.slice(0, config.maxItemsPerRun);
  }
}
