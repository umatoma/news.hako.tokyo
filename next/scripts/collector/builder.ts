import type { SourceConfig } from "@/config/sources";

import type { Clock } from "./lib/clock";
import { systemClock } from "./lib/clock";
import { Deduplicator } from "./lib/deduplicator";
import type { FileSystem } from "./lib/file-system";
import { defaultFileSystem } from "./lib/file-system";
import type { HttpClient } from "./lib/http-client";
import { defaultHttpClient } from "./lib/http-client";
import { JobSummaryReporter } from "./lib/job-summary-reporter";
import { MarkdownWriter } from "./lib/markdown-writer";
import { SlugBuilder } from "./lib/slug-builder";
import type { Logger } from "./logger";
import { DefaultLogger } from "./logger";
import { CollectorRunner } from "./runner";
import { GoogleNewsRssFetcher } from "./sources/google-news-rss-fetcher";
import { HatenaRssFetcher } from "./sources/hatena-rss-fetcher";
import { TogetterScraper } from "./sources/togetter-scraper";
import { ZennRssFetcher } from "./sources/zenn-rss-fetcher";

export interface BuildRunnerOptions {
  config: SourceConfig;
  contentDir: string;
  resultJsonPath: string;
  jobSummaryPath?: string | undefined;
  http?: HttpClient;
  fileSystem?: FileSystem;
  clock?: Clock;
  logger?: Logger;
}

export interface BuiltRunner {
  runner: CollectorRunner;
  reporter: JobSummaryReporter;
  logger: Logger;
}

export function buildRunner(options: BuildRunnerOptions): BuiltRunner {
  const http = options.http ?? defaultHttpClient;
  const fileSystem = options.fileSystem ?? defaultFileSystem;
  const clock = options.clock ?? systemClock;
  const logger = options.logger ?? new DefaultLogger();

  const slugBuilder = new SlugBuilder();
  const deduplicator = new Deduplicator({
    contentDir: options.contentDir,
    fileReader: fileSystem,
  });
  const writer = new MarkdownWriter({
    contentDir: options.contentDir,
    fileSystem,
    slugBuilder,
  });

  const fetchers = {
    zenn: new ZennRssFetcher({ http, logger, clock }),
    hatena: new HatenaRssFetcher({ http, logger, clock }),
    googlenews: new GoogleNewsRssFetcher({ http, logger, clock }),
    togetter: new TogetterScraper({ http, logger, clock }),
  };

  const runner = new CollectorRunner({
    config: options.config,
    fetchers,
    deduplicator,
    writer,
    logger,
    clock,
  });

  const reporter = new JobSummaryReporter({
    resultJsonPath: options.resultJsonPath,
    jobSummaryPath: options.jobSummaryPath,
  });

  return { runner, reporter, logger };
}
