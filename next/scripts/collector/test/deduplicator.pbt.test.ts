import path from "node:path";

import * as fc from "fast-check";
import { describe, it } from "vitest";

import { Deduplicator } from "../lib/deduplicator";
import { normalizeUrlForDedup } from "../lib/url-normalize";

import { articleArbitrary } from "./generators/article.gen";
import { InMemoryFileSystem } from "./in-memory-file-system";

const CONTENT_DIR = path.join("/", "fake", "dedup");

describe("Deduplicator.filterNew (PBT-03)", () => {
  it("output count is at most input count", () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(articleArbitrary, { maxLength: 30 }),
        async (articles) => {
          const fs = new InMemoryFileSystem();
          const dedup = new Deduplicator({ contentDir: CONTENT_DIR, fileReader: fs });
          await dedup.initialize();
          const out = dedup.filterNew(articles);
          return out.length <= articles.length;
        },
      ),
      { numRuns: 100 },
    );
  });

  it("output URLs (normalized) are all unique", () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(articleArbitrary, { maxLength: 30 }),
        async (articles) => {
          const fs = new InMemoryFileSystem();
          const dedup = new Deduplicator({ contentDir: CONTENT_DIR, fileReader: fs });
          await dedup.initialize();
          const out = dedup.filterNew(articles);
          const set = new Set(out.map((a) => normalizeUrlForDedup(a.url)));
          return set.size === out.length;
        },
      ),
      { numRuns: 100 },
    );
  });
});
