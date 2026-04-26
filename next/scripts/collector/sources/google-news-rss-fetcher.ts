import type { GoogleNewsConfig } from "@/config/sources";
import type { SourceId } from "@/lib/article";

import type { Clock } from "../lib/clock";
import type { HttpClient } from "../lib/http-client";
import type { Logger } from "../logger";
import { errorMessage, parseRss } from "./rss-mapping";
import type { FetchedArticle, SourceFetcher } from "./source-fetcher";

export interface GoogleNewsRssFetcherDeps {
  http: HttpClient;
  logger: Logger;
  clock: Clock;
}

export class GoogleNewsRssFetcher implements SourceFetcher<GoogleNewsConfig> {
  readonly source: SourceId = "googlenews";

  constructor(private readonly deps: GoogleNewsRssFetcherDeps) {}

  async fetch(config: GoogleNewsConfig): Promise<FetchedArticle[]> {
    if (!config.enabled) return [];

    const urls = buildGoogleNewsUrls(config);
    if (urls.length === 0) {
      this.deps.logger.info(this.source, "no queries/topics/geos configured, skipping");
      return [];
    }

    const all: FetchedArticle[] = [];
    for (const url of urls) {
      try {
        const response = await this.deps.http.get(url);
        if (response.status >= 400) {
          this.deps.logger.warn(this.source, "non-2xx response", {
            url,
            status: response.status,
            length: response.body.length,
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

export function buildGoogleNewsUrls(config: GoogleNewsConfig): string[] {
  const common = `hl=${encodeURIComponent(config.hl)}&gl=${encodeURIComponent(config.gl)}&ceid=${encodeURIComponent(config.ceid)}`;
  const urls: string[] = [];

  for (const query of config.queries) {
    urls.push(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${common}`);
  }
  for (const topic of config.topics) {
    urls.push(`https://news.google.com/news/rss/headlines/section/topic/${topic}?${common}`);
  }
  for (const geo of config.geos) {
    urls.push(`https://news.google.com/news/rss/headlines/section/geo/${encodeURIComponent(geo)}?${common}`);
  }

  return urls;
}
