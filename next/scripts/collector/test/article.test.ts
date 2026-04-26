import { describe, expect, it } from "vitest";

import {
  ArticleSchema,
  fromFrontmatter,
  toFrontmatter,
} from "@/lib/article";

const sampleArticle = ArticleSchema.parse({
  id: "k9xr2p1m3qaztb47",
  title: "Zenn の RSS フィードの使い方",
  url: "https://zenn.dev/foo/articles/bar",
  source: "zenn",
  publishedAt: "2026-04-25T07:00:00+09:00",
  collectedAt: "2026-04-25T22:05:12+09:00",
  summary: "Zenn の RSS フィード URL の構造",
  tags: ["RSS", "Zenn"],
  thumbnailUrl: "https://zenn.dev/images/og.png",
});

describe("toFrontmatter", () => {
  it("converts camelCase Article to snake_case frontmatter", () => {
    const fm = toFrontmatter(sampleArticle);
    expect(fm).toEqual({
      id: "k9xr2p1m3qaztb47",
      title: "Zenn の RSS フィードの使い方",
      url: "https://zenn.dev/foo/articles/bar",
      source: "zenn",
      published_at: "2026-04-25T07:00:00+09:00",
      collected_at: "2026-04-25T22:05:12+09:00",
      summary: "Zenn の RSS フィード URL の構造",
      tags: ["RSS", "Zenn"],
      thumbnail_url: "https://zenn.dev/images/og.png",
    });
  });
});

describe("fromFrontmatter", () => {
  it("converts snake_case frontmatter back to Article", () => {
    const fm = toFrontmatter(sampleArticle);
    const round = fromFrontmatter(fm);
    expect(round).toEqual(sampleArticle);
  });

  it("rejects invalid frontmatter (missing required fields)", () => {
    expect(() =>
      fromFrontmatter({
        id: "x",
        title: "t",
        url: "not-a-url",
        source: "zenn",
        published_at: "2026-04-25T07:00:00+09:00",
        collected_at: "2026-04-25T07:00:00+09:00",
        summary: "",
        tags: [],
        thumbnail_url: null,
      }),
    ).toThrow();
  });
});
