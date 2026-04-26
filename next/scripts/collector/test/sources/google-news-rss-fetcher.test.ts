import { describe, expect, it } from "vitest";

import { fixedClock } from "../../lib/clock";
import { DefaultLogger } from "../../logger";
import {
  buildGoogleNewsUrls,
  GoogleNewsRssFetcher,
} from "../../sources/google-news-rss-fetcher";
import { renderRssXml } from "../generators/rss-item.gen";
import { RecordingHttpClient } from "../recording-http-client";

describe("buildGoogleNewsUrls", () => {
  it("builds URLs for queries, topics, and geos with hl/gl/ceid", () => {
    const urls = buildGoogleNewsUrls({
      enabled: true,
      hl: "ja",
      gl: "JP",
      ceid: "JP:ja",
      queries: ["AI"],
      topics: ["TECHNOLOGY"],
      geos: ["Tokyo"],
      maxItemsPerRun: 50,
    });
    expect(urls).toEqual([
      "https://news.google.com/rss/search?q=AI&hl=ja&gl=JP&ceid=JP%3Aja",
      "https://news.google.com/news/rss/headlines/section/topic/TECHNOLOGY?hl=ja&gl=JP&ceid=JP%3Aja",
      "https://news.google.com/news/rss/headlines/section/geo/Tokyo?hl=ja&gl=JP&ceid=JP%3Aja",
    ]);
  });

  it("returns empty list when no queries/topics/geos", () => {
    const urls = buildGoogleNewsUrls({
      enabled: true,
      hl: "ja",
      gl: "JP",
      ceid: "JP:ja",
      queries: [],
      topics: [],
      geos: [],
      maxItemsPerRun: 50,
    });
    expect(urls).toEqual([]);
  });
});

describe("GoogleNewsRssFetcher", () => {
  it("fetches and parses Google News style RSS", async () => {
    const xml = renderRssXml(
      [
        {
          title: "Google News headline",
          link: "https://news.google.com/articles/abc123",
          isoDate: "2026-04-25T05:00:00Z",
          summary: "Headline summary",
          categories: [],
        },
      ],
      "Google ニュース",
    );
    const http = new RecordingHttpClient({
      "https://news.google.com/rss/search": xml,
    });
    const fetcher = new GoogleNewsRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await fetcher.fetch({
      enabled: true,
      hl: "ja",
      gl: "JP",
      ceid: "JP:ja",
      queries: ["AI"],
      topics: [],
      geos: [],
      maxItemsPerRun: 50,
    });
    expect(items).toHaveLength(1);
    expect(items[0]?.source).toBe("googlenews");
    expect(items[0]?.url).toBe("https://news.google.com/articles/abc123");
  });

  it("returns empty when no queries/topics/geos configured", async () => {
    const http = new RecordingHttpClient({});
    const fetcher = new GoogleNewsRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await fetcher.fetch({
      enabled: true,
      hl: "ja",
      gl: "JP",
      ceid: "JP:ja",
      queries: [],
      topics: [],
      geos: [],
      maxItemsPerRun: 50,
    });
    expect(items).toEqual([]);
    expect(http.calls).toHaveLength(0);
  });
});
