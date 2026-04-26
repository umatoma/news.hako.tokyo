import path from "node:path";

import { describe, expect, it } from "vitest";

import type { SourceConfig } from "@/config/sources";

import { fixedClock } from "../lib/clock";
import { Deduplicator } from "../lib/deduplicator";
import { MarkdownWriter } from "../lib/markdown-writer";
import { SlugBuilder } from "../lib/slug-builder";
import { DefaultLogger } from "../logger";
import { CollectorRunner } from "../runner";
import { GoogleNewsRssFetcher } from "../sources/google-news-rss-fetcher";
import { HatenaRssFetcher } from "../sources/hatena-rss-fetcher";
import { TogetterScraper } from "../sources/togetter-scraper";
import { ZennRssFetcher } from "../sources/zenn-rss-fetcher";
import { renderRssXml } from "./generators/rss-item.gen";
import { InMemoryFileSystem } from "./in-memory-file-system";
import { RecordingHttpClient } from "./recording-http-client";

const CONTENT_DIR = path.join("/", "fake", "runner");

const config: SourceConfig = {
  zenn: {
    enabled: true,
    feedUrls: ["https://zenn.dev/feed"],
    maxItemsPerRun: 50,
  },
  hatena: {
    enabled: true,
    feedUrls: ["https://b.hatena.ne.jp/hotentry/it.rss"],
    maxItemsPerRun: 50,
  },
  googlenews: {
    enabled: false,
    hl: "ja",
    gl: "JP",
    ceid: "JP:ja",
    queries: [],
    topics: [],
    geos: [],
    maxItemsPerRun: 50,
  },
  togetter: {
    enabled: false,
    targetUrls: [],
    requestIntervalMs: 0,
    maxItemsPerRun: 30,
  },
};

function makeRunner(http: RecordingHttpClient, fs: InMemoryFileSystem): CollectorRunner {
  const clock = fixedClock("2026-04-25T22:00:00Z");
  const logger = new DefaultLogger({ out: () => undefined });
  const slugBuilder = new SlugBuilder();
  const dedup = new Deduplicator({ contentDir: CONTENT_DIR, fileReader: fs });
  const writer = new MarkdownWriter({
    contentDir: CONTENT_DIR,
    fileSystem: fs,
    slugBuilder,
  });
  const fetchers = {
    zenn: new ZennRssFetcher({ http, logger, clock }),
    hatena: new HatenaRssFetcher({ http, logger, clock }),
    googlenews: new GoogleNewsRssFetcher({ http, logger, clock }),
    togetter: new TogetterScraper({ http, logger, clock }),
  };
  return new CollectorRunner({
    config,
    fetchers,
    deduplicator: dedup,
    writer,
    logger,
    clock,
  });
}

describe("CollectorRunner.run", () => {
  it("collects from enabled sources, dedupes, and writes Markdown", async () => {
    const zennXml = renderRssXml([
      {
        title: "Zenn Post",
        link: "https://zenn.dev/foo/articles/x",
        isoDate: "2026-04-25T07:00:00Z",
        summary: "Zenn s",
        categories: [],
      },
    ]);
    const hatenaXml = renderRssXml([
      {
        title: "Hatena Entry",
        link: "https://example.com/hatena-entry",
        isoDate: "2026-04-25T08:00:00Z",
        summary: "Hatena s",
        categories: [],
      },
    ]);
    const http = new RecordingHttpClient({
      "https://zenn.dev/feed": zennXml,
      "https://b.hatena.ne.jp/hotentry/it.rss": hatenaXml,
    });
    const fs = new InMemoryFileSystem();

    const runner = makeRunner(http, fs);
    const result = await runner.run();

    expect(result.totalFetched).toBe(2);
    expect(result.totalNew).toBe(2);
    expect(result.totalDuplicate).toBe(0);
    expect(result.failedSources).toEqual([]);
    expect(result.perSource.zenn.fetched).toBe(1);
    expect(result.perSource.hatena.fetched).toBe(1);
    expect(result.perSource.googlenews.skipped).toBe(true);
    expect(result.perSource.togetter.skipped).toBe(true);
    expect(fs.files.size).toBe(2);
  });

  it("continues when one Adapter throws", async () => {
    const zennXml = renderRssXml([
      {
        title: "Zenn Post",
        link: "https://zenn.dev/foo/articles/x",
        isoDate: "2026-04-25T07:00:00Z",
        summary: "",
        categories: [],
      },
    ]);
    const http = new RecordingHttpClient({
      "https://zenn.dev/feed": zennXml,
      "https://b.hatena.ne.jp/hotentry/it.rss": {
        status: 500,
        body: "boom",
        headers: {},
      },
    });
    const fs = new InMemoryFileSystem();

    const runner = makeRunner(http, fs);
    const result = await runner.run();

    expect(result.totalFetched).toBe(1);
    expect(result.totalNew).toBe(1);
    // The hatena Adapter logs warn but does not throw on non-2xx; failedSources should be empty.
    expect(result.perSource.hatena.fetched).toBe(0);
  });

  it("dedupes against existing content/", async () => {
    const zennXml = renderRssXml([
      {
        title: "Zenn Post",
        link: "https://zenn.dev/foo/articles/x",
        isoDate: "2026-04-25T07:00:00Z",
        summary: "",
        categories: [],
      },
    ]);
    const http = new RecordingHttpClient({
      "https://zenn.dev/feed": zennXml,
      "https://b.hatena.ne.jp/hotentry/it.rss": renderRssXml([]),
    });
    const fs = new InMemoryFileSystem();
    fs.files.set(
      path.join(CONTENT_DIR, "existing.md"),
      `---
id: existing
title: Existing
url: https://zenn.dev/foo/articles/x
source: zenn
published_at: '2026-04-25T07:00:00+09:00'
collected_at: '2026-04-25T22:00:00+09:00'
summary: ''
tags: []
thumbnail_url: null
---

# Existing
`,
    );

    const runner = makeRunner(http, fs);
    const result = await runner.run();

    expect(result.totalDuplicate).toBe(1);
    expect(result.totalNew).toBe(0);
  });
});
