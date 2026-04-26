import path from "node:path";

import * as fc from "fast-check";
import matter from "gray-matter";
import { describe, it } from "vitest";

import { fromFrontmatter } from "@/lib/article";

import { MarkdownWriter } from "../lib/markdown-writer";
import { SlugBuilder } from "../lib/slug-builder";

import { articleArbitrary } from "./generators/article.gen";
import { InMemoryFileSystem } from "./in-memory-file-system";

const CONTENT_DIR = path.join("/", "fake", "writer");

describe("MarkdownWriter PBT (PBT-02)", () => {
  it("write -> read -> fromFrontmatter round-trips to the original Article", () => {
    fc.assert(
      fc.asyncProperty(articleArbitrary, async (article) => {
        const fs = new InMemoryFileSystem();
        const writer = new MarkdownWriter({
          contentDir: CONTENT_DIR,
          fileSystem: fs,
          slugBuilder: new SlugBuilder(),
        });
        await writer.write([article]);
        const written = Array.from(fs.files.values())[0];
        if (!written) return false;
        const parsed = matter(written);
        const round = fromFrontmatter(parsed.data);
        return JSON.stringify(round) === JSON.stringify(article);
      }),
      { numRuns: 100 },
    );
  });
});
