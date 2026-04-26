import { describe, expect, it } from "vitest";

import { fixedClock } from "../../lib/clock";
import { DefaultLogger } from "../../logger";
import { ZennRssFetcher } from "../../sources/zenn-rss-fetcher";
import { renderRssXml } from "../generators/rss-item.gen";
import { RecordingHttpClient } from "../recording-http-client";

describe("ZennRssFetcher", () => {
  it("returns articles parsed from RSS XML", async () => {
    const xml = renderRssXml(
      [
        {
          title: "First Article",
          link: "https://zenn.dev/foo/articles/first",
          isoDate: "2026-04-25T10:00:00Z",
          summary: "First summary",
          categories: ["typescript"],
        },
      ],
      "Zenn",
    );
    const http = new RecordingHttpClient({ "https://zenn.dev/feed": xml });
    const fetcher = new ZennRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });

    const items = await fetcher.fetch({
      enabled: true,
      feedUrls: ["https://zenn.dev/feed"],
      maxItemsPerRun: 50,
    });

    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("First Article");
    expect(items[0]?.url).toBe("https://zenn.dev/foo/articles/first");
    expect(items[0]?.source).toBe("zenn");
  });

  it("returns empty array when disabled", async () => {
    const http = new RecordingHttpClient({});
    const fetcher = new ZennRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await fetcher.fetch({
      enabled: false,
      feedUrls: ["https://zenn.dev/feed"],
      maxItemsPerRun: 50,
    });
    expect(items).toEqual([]);
    expect(http.calls).toHaveLength(0);
  });

  it("respects maxItemsPerRun", async () => {
    const xml = renderRssXml(
      Array.from({ length: 5 }, (_, i) => ({
        title: `Article ${i}`,
        link: `https://zenn.dev/foo/articles/x${i}`,
        isoDate: "2026-04-25T10:00:00Z",
        summary: `s${i}`,
        categories: [],
      })),
    );
    const http = new RecordingHttpClient({ "https://zenn.dev/feed": xml });
    const fetcher = new ZennRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await fetcher.fetch({
      enabled: true,
      feedUrls: ["https://zenn.dev/feed"],
      maxItemsPerRun: 2,
    });
    expect(items).toHaveLength(2);
  });
});
