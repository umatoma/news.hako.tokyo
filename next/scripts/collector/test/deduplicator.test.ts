import path from "node:path";

import matter from "gray-matter";
import { beforeEach, describe, expect, it } from "vitest";

import type { Article } from "@/lib/article";

import { Deduplicator } from "../lib/deduplicator";
import { InMemoryFileSystem } from "./in-memory-file-system";

const CONTENT_DIR = path.join("/", "fake", "content");

function makeArticle(url: string, source: Article["source"] = "zenn"): Article {
  return {
    id: "abc",
    title: "title",
    url,
    source,
    publishedAt: "2026-04-25T07:00:00+09:00",
    collectedAt: "2026-04-25T22:05:12+09:00",
    summary: "",
    tags: [],
    thumbnailUrl: null,
  };
}

function existingMarkdown(url: string): string {
  return matter.stringify("# Existing\n", {
    id: "existing",
    title: "Existing",
    url,
    source: "zenn",
    published_at: "2026-04-25T07:00:00+09:00",
    collected_at: "2026-04-25T22:05:12+09:00",
    summary: "",
    tags: [],
    thumbnail_url: null,
  });
}

describe("Deduplicator", () => {
  let fs: InMemoryFileSystem;
  let dedup: Deduplicator;

  beforeEach(() => {
    fs = new InMemoryFileSystem();
    dedup = new Deduplicator({ contentDir: CONTENT_DIR, fileReader: fs });
  });

  it("loads existing URLs from markdown files in initialize()", async () => {
    fs.files.set(
      path.join(CONTENT_DIR, "existing.md"),
      existingMarkdown("https://example.com/a"),
    );
    await dedup.initialize();
    expect(dedup.getKnownUrlCount()).toBe(1);
  });

  it("filterNew removes already-known URLs (after normalization)", async () => {
    fs.files.set(
      path.join(CONTENT_DIR, "existing.md"),
      existingMarkdown("https://example.com/a"),
    );
    await dedup.initialize();
    const newOnly = dedup.filterNew([
      makeArticle("https://example.com/a?utm_source=x"),
      makeArticle("https://example.com/b"),
    ]);
    expect(newOnly).toHaveLength(1);
    expect(newOnly[0]!.url).toBe("https://example.com/b");
  });

  it("filterNew dedupes within the batch", async () => {
    await dedup.initialize();
    const newOnly = dedup.filterNew([
      makeArticle("https://example.com/x"),
      makeArticle("https://example.com/x"),
      makeArticle("https://example.com/y"),
    ]);
    expect(newOnly.map((a) => a.url)).toEqual([
      "https://example.com/x",
      "https://example.com/y",
    ]);
  });

  it("throws if filterNew called before initialize", () => {
    expect(() => dedup.filterNew([])).toThrow();
  });
});
