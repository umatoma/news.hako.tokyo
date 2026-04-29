import path from "node:path";

import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import { ArticleSchema } from "@/lib/article";
import type { Article } from "@/lib/article";
import {
  computeDateThreshold,
  computePageStats,
  filterArticlesWithinDays,
  filterFileNamesByDatePrefix,
  formatPublishedAt,
  FsArticleRepository,
  SOURCE_LABEL,
  sortArticlesForDisplay,
  toListItemView,
} from "@/lib/articles";
import type { FileReader } from "@/lib/articles";

class InMemoryFileReader implements FileReader {
  readonly files = new Map<string, string>();

  async listMarkdownFiles(dir: string): Promise<string[]> {
    const prefix = dir.endsWith(path.sep) ? dir : `${dir}${path.sep}`;
    return Array.from(this.files.keys())
      .filter((p) => (p === dir || p.startsWith(prefix)) && p.endsWith(".md"))
      .sort();
  }

  async readText(filePath: string): Promise<string> {
    const v = this.files.get(filePath);
    if (v === undefined) throw new Error(`ENOENT: ${filePath}`);
    return v;
  }

  async exists(filePath: string): Promise<boolean> {
    return this.files.has(filePath);
  }
}

const sample: Article = ArticleSchema.parse({
  id: "k9xr2p1m3qaztb47",
  title: "Sample",
  url: "https://example.com/x",
  source: "zenn",
  publishedAt: "2026-04-25T07:00:00+09:00",
  collectedAt: "2026-04-25T22:05:12+09:00",
  summary: "S",
  tags: [],
  thumbnailUrl: null,
});

describe("SOURCE_LABEL", () => {
  it("maps SourceId to Japanese labels", () => {
    expect(SOURCE_LABEL.zenn).toBe("Zenn");
    expect(SOURCE_LABEL.hatena).toBe("はてブ");
    expect(SOURCE_LABEL.googlenews).toBe("Google ニュース");
    expect(SOURCE_LABEL.togetter).toBe("Togetter");
  });
});

describe("formatPublishedAt", () => {
  it("formats ISO 8601 with ja-JP locale", () => {
    const out = formatPublishedAt("2026-04-25T07:00:00+09:00");
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/4月/);
    expect(out).toMatch(/25/);
  });

  it("returns the same string for the same input", () => {
    const a = formatPublishedAt(sample.publishedAt);
    const b = formatPublishedAt(sample.publishedAt);
    expect(a).toBe(b);
  });
});

describe("toListItemView", () => {
  it("preserves id / url / title and adds derived fields", () => {
    const v = toListItemView(sample);
    expect(v.id).toBe(sample.id);
    expect(v.url).toBe(sample.url);
    expect(v.title).toBe(sample.title);
    expect(v.sourceId).toBe("zenn");
    expect(v.sourceLabel).toBe("Zenn");
    expect(v.publishedAtIso).toBe(sample.publishedAt);
    expect(typeof v.publishedAtDisplay).toBe("string");
    expect(v.publishedAtDisplay.length).toBeGreaterThan(0);
  });
});

describe("sortArticlesForDisplay", () => {
  it("sorts by publishedAt descending, then collectedAt descending", () => {
    const a: Article = { ...sample, id: "a", publishedAt: "2026-04-25T01:00:00+09:00", collectedAt: "2026-04-25T22:00:00+09:00" };
    const b: Article = { ...sample, id: "b", publishedAt: "2026-04-26T01:00:00+09:00", collectedAt: "2026-04-26T22:00:00+09:00" };
    const c: Article = { ...sample, id: "c", publishedAt: "2026-04-25T01:00:00+09:00", collectedAt: "2026-04-25T23:00:00+09:00" };
    const out = sortArticlesForDisplay([a, b, c]);
    expect(out.map((x) => x.id)).toEqual(["b", "c", "a"]);
  });

  it("returns a new array (does not mutate input)", () => {
    const input = [sample];
    const out = sortArticlesForDisplay(input);
    expect(out).not.toBe(input);
  });
});

describe("computePageStats", () => {
  it("returns zero stats for empty input", () => {
    expect(computePageStats([])).toEqual({
      totalArticles: 0,
      lastUpdatedIso: null,
      lastUpdatedDisplay: null,
    });
  });

  it("returns count and latest collectedAt", () => {
    const a: Article = { ...sample, id: "a", collectedAt: "2026-04-25T01:00:00+09:00" };
    const b: Article = { ...sample, id: "b", collectedAt: "2026-04-26T05:00:00+09:00" };
    const stats = computePageStats([a, b]);
    expect(stats.totalArticles).toBe(2);
    expect(stats.lastUpdatedIso).toBe("2026-04-26T05:00:00+09:00");
    expect(stats.lastUpdatedDisplay).not.toBeNull();
  });
});

describe("filterArticlesWithinDays", () => {
  const now = new Date("2026-04-29T00:00:00+09:00");

  function withPublishedAt(iso: string, id: string): Article {
    return { ...sample, id, publishedAt: iso };
  }

  it("keeps articles published within the window", () => {
    const a = withPublishedAt("2026-04-28T10:00:00+09:00", "a"); // -1d
    const b = withPublishedAt("2026-04-26T01:00:00+09:00", "b"); // -3d (境界の少し前)
    const c = withPublishedAt("2026-04-25T23:59:59+09:00", "c"); // -3d 超 → 除外
    const out = filterArticlesWithinDays([a, b, c], 3, now);
    expect(out.map((x) => x.id).sort()).toEqual(["a", "b"]);
  });

  it("returns an empty array when none are within the window", () => {
    const a = withPublishedAt("2026-04-20T00:00:00+09:00", "a");
    expect(filterArticlesWithinDays([a], 3, now)).toEqual([]);
  });

  it("returns an empty array for an empty input", () => {
    expect(filterArticlesWithinDays([], 3, now)).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [withPublishedAt("2026-04-28T00:00:00+09:00", "a")];
    const snapshot = [...input];
    filterArticlesWithinDays(input, 3, now);
    expect(input).toEqual(snapshot);
  });

  it("includes articles published exactly at the threshold", () => {
    const exactly = withPublishedAt("2026-04-26T00:00:00+09:00", "exact"); // == now - 3d
    const out = filterArticlesWithinDays([exactly], 3, now);
    expect(out).toHaveLength(1);
  });

  it("uses the current time when 'now' is omitted", () => {
    // Just verify it runs without throwing and returns Article[]
    const a = withPublishedAt("2026-04-28T00:00:00+09:00", "a");
    const out = filterArticlesWithinDays([a], 3);
    expect(Array.isArray(out)).toBe(true);
  });
});

describe("computeDateThreshold", () => {
  it("returns YYYY-MM-DD for now - days", () => {
    const now = new Date("2026-04-29T12:00:00Z");
    expect(computeDateThreshold(3, now)).toBe("2026-04-26");
    expect(computeDateThreshold(0, now)).toBe("2026-04-29");
    expect(computeDateThreshold(30, now)).toBe("2026-03-30");
  });

  it("returns a 10-character ISO date string", () => {
    const out = computeDateThreshold(3, new Date());
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("filterFileNamesByDatePrefix", () => {
  it("keeps files whose YYYY-MM-DD prefix is >= threshold", () => {
    const files = [
      "/c/2026-04-25-a.md",
      "/c/2026-04-26-b.md",
      "/c/2026-04-28-c.md",
    ];
    expect(filterFileNamesByDatePrefix(files, "2026-04-26")).toEqual([
      "/c/2026-04-26-b.md",
      "/c/2026-04-28-c.md",
    ]);
  });

  it("includes files with malformed names (safe-include)", () => {
    const files = ["/c/no-date.md", "/c/2026-04-28-x.md"];
    expect(filterFileNamesByDatePrefix(files, "2026-04-29")).toEqual([
      "/c/no-date.md",
    ]);
  });

  it("returns empty array when nothing passes", () => {
    expect(
      filterFileNamesByDatePrefix(["/c/2026-01-01-x.md"], "2026-04-26"),
    ).toEqual([]);
  });

  it("does not mutate the input", () => {
    const input = ["/c/2026-04-28-a.md"];
    const snapshot = [...input];
    filterFileNamesByDatePrefix(input, "2026-04-26");
    expect(input).toEqual(snapshot);
  });
});

describe("FsArticleRepository", () => {
  it("returns empty array when content directory is empty", async () => {
    const reader = new InMemoryFileReader();
    const repo = new FsArticleRepository({
      contentDir: "/fake/empty",
      fileReader: reader,
    });
    const articles = await repo.getAllArticles();
    expect(articles).toEqual([]);
  });

  it("parses markdown files and returns Article[]", async () => {
    const reader = new InMemoryFileReader();
    const dir = "/fake/content";
    const file = path.join(dir, "x.md");
    reader.files.set(
      file,
      matter.stringify("# title\n\nbody\n", {
        id: sample.id,
        title: sample.title,
        url: sample.url,
        source: sample.source,
        published_at: sample.publishedAt,
        collected_at: sample.collectedAt,
        summary: sample.summary,
        tags: sample.tags,
        thumbnail_url: sample.thumbnailUrl,
      }),
    );
    const repo = new FsArticleRepository({
      contentDir: dir,
      fileReader: reader,
    });
    const articles = await repo.getAllArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0]).toEqual(sample);
  });

  it("throws when frontmatter is invalid", async () => {
    const reader = new InMemoryFileReader();
    const dir = "/fake/content";
    reader.files.set(path.join(dir, "bad.md"), "---\nid: x\ntitle: t\n---\n\n");
    const repo = new FsArticleRepository({
      contentDir: dir,
      fileReader: reader,
    });
    await expect(repo.getAllArticles()).rejects.toThrow(/Invalid frontmatter/);
  });

  describe("getArticlesPublishedSince", () => {
    function frontmatterFor(article: Article): string {
      return matter.stringify("# t\n\nb\n", {
        id: article.id,
        title: article.title,
        url: article.url,
        source: article.source,
        published_at: article.publishedAt,
        collected_at: article.collectedAt,
        summary: article.summary,
        tags: article.tags,
        thumbnail_url: article.thumbnailUrl,
      });
    }

    function articleAt(date: string, idSuffix: string): Article {
      return ArticleSchema.parse({
        ...sample,
        id: `${"a".repeat(15)}${idSuffix}`,
        url: `https://example.com/${idSuffix}`,
        publishedAt: `${date}T07:00:00+09:00`,
      });
    }

    it("only reads files whose date prefix is >= threshold", async () => {
      const reader = new InMemoryFileReader();
      const dir = "/fake/content";
      const old = articleAt("2026-04-20", "1");
      const recent = articleAt("2026-04-28", "2");
      reader.files.set(path.join(dir, "2026-04-20-old.md"), frontmatterFor(old));
      reader.files.set(path.join(dir, "2026-04-28-recent.md"), frontmatterFor(recent));
      const repo = new FsArticleRepository({ contentDir: dir, fileReader: reader });
      const out = await repo.getArticlesPublishedSince("2026-04-26");
      expect(out).toHaveLength(1);
      expect(out[0]!.publishedAt).toBe(recent.publishedAt);
    });

    it("includes files whose prefix equals the threshold", async () => {
      const reader = new InMemoryFileReader();
      const dir = "/fake/content";
      const exact = articleAt("2026-04-26", "1");
      reader.files.set(path.join(dir, "2026-04-26-exact.md"), frontmatterFor(exact));
      const repo = new FsArticleRepository({ contentDir: dir, fileReader: reader });
      const out = await repo.getArticlesPublishedSince("2026-04-26");
      expect(out).toHaveLength(1);
    });

    it("returns empty array when content directory is empty", async () => {
      const reader = new InMemoryFileReader();
      const repo = new FsArticleRepository({
        contentDir: "/fake/empty",
        fileReader: reader,
      });
      const out = await repo.getArticlesPublishedSince("2026-04-26");
      expect(out).toEqual([]);
    });

    it("does not read files whose prefix is older than the threshold", async () => {
      const reader = new InMemoryFileReader();
      const dir = "/fake/content";
      const old = articleAt("2026-04-20", "1");
      reader.files.set(path.join(dir, "2026-04-20-x.md"), frontmatterFor(old));
      // Spy on readText to verify it is not called
      let readCount = 0;
      const wrapped: FileReader = {
        listMarkdownFiles: (d) => reader.listMarkdownFiles(d),
        readText: async (p) => {
          readCount += 1;
          return reader.readText(p);
        },
        exists: (p) => reader.exists(p),
      };
      const repo = new FsArticleRepository({ contentDir: dir, fileReader: wrapped });
      await repo.getArticlesPublishedSince("2026-04-28");
      expect(readCount).toBe(0);
    });
  });
});
