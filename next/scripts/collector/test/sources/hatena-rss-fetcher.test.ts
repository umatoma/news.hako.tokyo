import { describe, expect, it } from "vitest";

import { fixedClock } from "../../lib/clock";
import { DefaultLogger } from "../../logger";
import { HatenaRssFetcher } from "../../sources/hatena-rss-fetcher";
import { renderRssXml } from "../generators/rss-item.gen";
import { RecordingHttpClient } from "../recording-http-client";

describe("HatenaRssFetcher", () => {
  it("returns articles parsed from hatena RSS XML", async () => {
    const url = "https://b.hatena.ne.jp/hotentry/it.rss";
    const xml = renderRssXml(
      [
        {
          title: "Hatena Entry",
          link: "https://example.com/hatena-entry",
          isoDate: "2026-04-25T08:00:00Z",
          summary: "summary",
          categories: ["it"],
        },
      ],
      "はてなブックマーク",
    );
    const http = new RecordingHttpClient({ [url]: xml });
    const fetcher = new HatenaRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await fetcher.fetch({
      enabled: true,
      feedUrls: [url],
      maxItemsPerRun: 50,
    });
    expect(items.map((i) => i.source)).toEqual(["hatena"]);
  });

  it("continues when one feed fails", async () => {
    const okUrl = "https://b.hatena.ne.jp/hotentry/it.rss";
    const okXml = renderRssXml([
      {
        title: "OK",
        link: "https://example.com/ok",
        isoDate: "2026-04-25T08:00:00Z",
        summary: "",
        categories: [],
      },
    ]);
    const http = new RecordingHttpClient({
      [okUrl]: okXml,
      "https://b.hatena.ne.jp/hotentry/general.rss": {
        status: 503,
        body: "down",
        headers: {},
      },
    });
    const fetcher = new HatenaRssFetcher({
      http,
      logger: new DefaultLogger({ out: () => undefined }),
      clock: fixedClock("2026-04-25T22:00:00Z"),
    });
    const items = await fetcher.fetch({
      enabled: true,
      feedUrls: [
        "https://b.hatena.ne.jp/hotentry/general.rss",
        okUrl,
      ],
      maxItemsPerRun: 50,
    });
    expect(items).toHaveLength(1);
  });
});
