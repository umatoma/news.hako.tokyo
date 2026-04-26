import * as fc from "fast-check";
import { describe, it } from "vitest";

import { sortArticlesForDisplay } from "@/lib/articles";

import { articleArbitrary } from "../scripts/collector/test/generators/article.gen";

describe("sortArticlesForDisplay (PBT-03)", () => {
  it("output length equals input length", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        (articles) => sortArticlesForDisplay(articles).length === articles.length,
      ),
      { numRuns: 100 },
    );
  });

  it("output ids are a permutation of input ids", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        (articles) => {
          const out = sortArticlesForDisplay(articles);
          const inIds = articles.map((a) => a.id).sort();
          const outIds = out.map((a) => a.id).sort();
          return JSON.stringify(inIds) === JSON.stringify(outIds);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("publishedAt is non-increasing", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        (articles) => {
          const out = sortArticlesForDisplay(articles);
          for (let i = 1; i < out.length; i += 1) {
            if (out[i - 1]!.publishedAt < out[i]!.publishedAt) return false;
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });

  it("on equal publishedAt, collectedAt is non-increasing", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        (articles) => {
          const out = sortArticlesForDisplay(articles);
          for (let i = 1; i < out.length; i += 1) {
            if (
              out[i - 1]!.publishedAt === out[i]!.publishedAt &&
              out[i - 1]!.collectedAt < out[i]!.collectedAt
            ) {
              return false;
            }
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
