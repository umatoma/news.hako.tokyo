import type { SourceConfig } from "@/config/sources";
import type { Article, SourceId } from "@/lib/article";

import type { Clock } from "./lib/clock";
import type { Deduplicator } from "./lib/deduplicator";
import type {
  CollectorRunResult,
  PerSourceStat,
} from "./lib/job-summary-reporter";
import type { MarkdownWriter } from "./lib/markdown-writer";
import type { Logger } from "./logger";
import type { GoogleNewsRssFetcher } from "./sources/google-news-rss-fetcher";
import type { HatenaRssFetcher } from "./sources/hatena-rss-fetcher";
import type { FetchedArticle } from "./sources/source-fetcher";
import type { TogetterScraper } from "./sources/togetter-scraper";
import type { ZennRssFetcher } from "./sources/zenn-rss-fetcher";

import { errorMessage } from "./sources/rss-mapping";

export interface CollectorFetchers {
  zenn: ZennRssFetcher;
  hatena: HatenaRssFetcher;
  googlenews: GoogleNewsRssFetcher;
  togetter: TogetterScraper;
}

export interface CollectorRunnerDeps {
  config: SourceConfig;
  fetchers: CollectorFetchers;
  deduplicator: Deduplicator;
  writer: MarkdownWriter;
  logger: Logger;
  clock: Clock;
}

export class CollectorRunner {
  constructor(private readonly deps: CollectorRunnerDeps) {}

  async run(): Promise<CollectorRunResult> {
    const { config, fetchers, deduplicator, writer, logger, clock } = this.deps;
    const startedAtMs = clock().getTime();
    logger.info("collector", "start");

    await deduplicator.initialize();
    logger.info("collector", "dedup initialized", {
      knownUrls: deduplicator.getKnownUrlCount(),
    });

    const ordered: Array<[SourceId, () => Promise<FetchedArticle[]>]> = [
      ["zenn", () => fetchers.zenn.fetch(config.zenn)],
      ["hatena", () => fetchers.hatena.fetch(config.hatena)],
      ["googlenews", () => fetchers.googlenews.fetch(config.googlenews)],
      ["togetter", () => fetchers.togetter.fetch(config.togetter)],
    ];

    const allFetched: FetchedArticle[] = [];
    const failedSources: SourceId[] = [];
    const perSource: Record<SourceId, PerSourceStat> = {
      zenn: { fetched: 0, skipped: false, error: null },
      hatena: { fetched: 0, skipped: false, error: null },
      googlenews: { fetched: 0, skipped: false, error: null },
      togetter: { fetched: 0, skipped: false, error: null },
    };

    for (const [source, run] of ordered) {
      const sourceConfig = config[source];
      if (!sourceConfig.enabled) {
        perSource[source].skipped = true;
        logger.info(source, "disabled, skipping");
        continue;
      }
      try {
        const items = await run();
        perSource[source].fetched = items.length;
        allFetched.push(...items);
        logger.info(source, "fetched", { count: items.length });
      } catch (err) {
        const message = errorMessage(err);
        perSource[source].error = message;
        failedSources.push(source);
        logger.error(source, "fetch failed", { error: message });
      }
    }

    const newOnly = deduplicator.filterNew(toArticlesWithoutCollectedAt(allFetched));
    logger.info("collector", "dedup", {
      candidates: allFetched.length,
      new: newOnly.length,
      duplicate: allFetched.length - newOnly.length,
    });

    const collectedAt = clock().toISOString();
    const stamped: Article[] = newOnly.map((item) => ({
      ...item,
      collectedAt,
    }));

    const writeResult = await writer.write(stamped);
    logger.info("collector", "write", {
      written: writeResult.written,
      skipped: writeResult.skipped,
    });

    const durationMs = clock().getTime() - startedAtMs;
    const result: CollectorRunResult = {
      schemaVersion: 1,
      ranAt: new Date(startedAtMs).toISOString(),
      totalFetched: allFetched.length,
      totalNew: writeResult.written,
      totalDuplicate: allFetched.length - newOnly.length,
      failedSources,
      perSource,
      durationMs,
    };

    logger.info("collector", "done", {
      totalFetched: result.totalFetched,
      totalNew: result.totalNew,
      totalDuplicate: result.totalDuplicate,
      failedSources: failedSources.join(",") || "none",
      durationMs,
    });

    return result;
  }
}

function toArticlesWithoutCollectedAt(items: FetchedArticle[]): Article[] {
  // Deduplicator only inspects URL, so a placeholder collectedAt is fine.
  const placeholder = "1970-01-01T00:00:00+00:00";
  return items.map((item) => ({ ...item, collectedAt: placeholder }));
}
