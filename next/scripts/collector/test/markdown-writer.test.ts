import path from "node:path";

import matter from "gray-matter";
import { beforeEach, describe, expect, it } from "vitest";

import { fromFrontmatter } from "@/lib/article";
import type { Article } from "@/lib/article";

import { MarkdownWriter, renderMarkdown } from "../lib/markdown-writer";
import { SlugBuilder } from "../lib/slug-builder";
import { InMemoryFileSystem } from "./in-memory-file-system";

const CONTENT_DIR = path.join("/", "fake", "content");

const article: Article = {
  id: "k9xr2p1m3qaztb47",
  title: "Hello World Example",
  url: "https://example.com/x",
  source: "zenn",
  publishedAt: "2026-04-25T07:00:00+09:00",
  collectedAt: "2026-04-25T22:05:12+09:00",
  summary: "Sample summary",
  tags: ["RSS"],
  thumbnailUrl: null,
};

describe("renderMarkdown", () => {
  it("produces snake_case frontmatter and H1 + summary body", () => {
    const md = renderMarkdown(article);
    expect(md).toContain("published_at: '2026-04-25T07:00:00+09:00'");
    expect(md).toContain("# Hello World Example");
    expect(md).toContain("Sample summary");
  });

  it("omits summary line when summary is empty", () => {
    const md = renderMarkdown({ ...article, summary: "" });
    expect(md).toMatch(/# Hello World Example\s*$/u);
  });
});

describe("MarkdownWriter.write", () => {
  let fs: InMemoryFileSystem;
  let writer: MarkdownWriter;

  beforeEach(() => {
    fs = new InMemoryFileSystem();
    writer = new MarkdownWriter({
      contentDir: CONTENT_DIR,
      fileSystem: fs,
      slugBuilder: new SlugBuilder(),
    });
  });

  it("writes a single article to {date}-{slug}.md and round-trips back to the same Article", async () => {
    const result = await writer.write([article]);
    expect(result.written).toBe(1);
    const [filePath] = Array.from(fs.files.keys());
    expect(filePath).toMatch(/2026-04-25-hello-world-example--k9xr2p\.md$/u);
    const parsed = matter(fs.files.get(filePath!)!);
    const round = fromFrontmatter(parsed.data);
    expect(round).toEqual(article);
  });

  it("appends -2 suffix when filename collides", async () => {
    const collidingId = "abcdef0000000000";
    const same = { ...article, id: collidingId };
    fs.files.set(
      path.join(CONTENT_DIR, "2026-04-25-hello-world-example--abcdef.md"),
      "existing",
    );
    await writer.write([same]);
    const newPath = Array.from(fs.files.keys()).find((p) => p.endsWith("-2.md"));
    expect(newPath).toBeDefined();
  });

  it("returns 0/0 when given no articles", async () => {
    const result = await writer.write([]);
    expect(result).toEqual({ written: 0, skipped: 0 });
  });
});
