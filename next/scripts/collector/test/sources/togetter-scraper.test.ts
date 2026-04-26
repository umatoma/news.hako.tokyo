import { describe, expect, it } from "vitest";

import { fixedClock } from "../../lib/clock";
import { DefaultLogger } from "../../logger";
import { TogetterScraper } from "../../sources/togetter-scraper";
import { RecordingHttpClient } from "../recording-http-client";

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<body>
<a href="/li/1234567" title="まとめの概要1">タイトル1</a>
<a href="/li/2345678" title="まとめの概要2">タイトル2</a>
<a href="/category/news">カテゴリリンク (除外される)</a>
</body>
</html>`;

describe("TogetterScraper", () => {
  it("extracts matome titles and URLs from category page", async () => {
    const url = "https://togetter.com/category/news";
    const http = new RecordingHttpClient({ [url]: SAMPLE_HTML });

    const sleeps: number[] = [];
    const scraper = new TogetterScraper({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
      sleep: async (ms) => {
        sleeps.push(ms);
      },
    });

    const items = await scraper.fetch({
      enabled: true,
      targetUrls: [url],
      requestIntervalMs: 5000,
      maxItemsPerRun: 30,
    });

    expect(items).toHaveLength(2);
    expect(items[0]?.title).toBe("タイトル1");
    expect(items[0]?.url).toBe("https://togetter.com/li/1234567");
    expect(items[0]?.source).toBe("togetter");
    expect(items[0]?.tags).toEqual(["news"]);
  });

  it("sleeps between multiple target URLs", async () => {
    const url1 = "https://togetter.com/category/news";
    const url2 = "https://togetter.com/category/it";
    const http = new RecordingHttpClient({
      [url1]: SAMPLE_HTML,
      [url2]: SAMPLE_HTML,
    });
    const sleeps: number[] = [];
    const scraper = new TogetterScraper({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
      sleep: async (ms) => {
        sleeps.push(ms);
      },
    });

    await scraper.fetch({
      enabled: true,
      targetUrls: [url1, url2],
      requestIntervalMs: 5000,
      maxItemsPerRun: 30,
    });

    expect(sleeps).toEqual([5000]);
  });

  it("returns empty array when disabled", async () => {
    const http = new RecordingHttpClient({});
    const scraper = new TogetterScraper({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await scraper.fetch({
      enabled: false,
      targetUrls: ["https://togetter.com/category/news"],
      requestIntervalMs: 5000,
      maxItemsPerRun: 30,
    });
    expect(items).toEqual([]);
  });
});
