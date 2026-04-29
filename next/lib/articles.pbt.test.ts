import * as fc from "fast-check";
import { describe, it } from "vitest";

import { filterArticlesWithinDays, sortArticlesForDisplay } from "@/lib/articles";

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

describe("filterArticlesWithinDays (PBT-03)", () => {
  const fixedNow = new Date("2026-04-29T00:00:00+09:00");

  it("output ids are a subset of input ids", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        fc.integer({ min: 0, max: 365 }),
        (articles, days) => {
          const out = filterArticlesWithinDays(articles, days, fixedNow);
          const inIds = new Set(articles.map((a) => a.id));
          return out.every((o) => inIds.has(o.id));
        },
      ),
      { numRuns: 100 },
    );
  });

  it("output length is less than or equal to input length", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        fc.integer({ min: 0, max: 365 }),
        (articles, days) =>
          filterArticlesWithinDays(articles, days, fixedNow).length <=
          articles.length,
      ),
      { numRuns: 100 },
    );
  });

  it("every output article has publishedAt >= now - days", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        fc.integer({ min: 0, max: 365 }),
        (articles, days) => {
          const threshold =
            fixedNow.getTime() - days * 24 * 60 * 60 * 1000;
          const out = filterArticlesWithinDays(articles, days, fixedNow);
          return out.every((a) => Date.parse(a.publishedAt) >= threshold);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("monotonicity: increasing days never excludes previously-included articles", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        fc.integer({ min: 0, max: 30 }),
        fc.integer({ min: 0, max: 30 }),
        (articles, d1, d2) => {
          const small = Math.min(d1, d2);
          const large = Math.max(d1, d2);
          const idsSmall = new Set(
            filterArticlesWithinDays(articles, small, fixedNow).map(
              (a) => a.id,
            ),
          );
          const idsLarge = new Set(
            filterArticlesWithinDays(articles, large, fixedNow).map(
              (a) => a.id,
            ),
          );
          for (const id of idsSmall) {
            if (!idsLarge.has(id)) return false;
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
