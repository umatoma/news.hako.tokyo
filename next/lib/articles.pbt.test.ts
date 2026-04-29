import * as fc from "fast-check";
import { describe, it } from "vitest";

import {
  filterArticlesWithinDays,
  filterFileNamesByDatePrefix,
  sortArticlesForDisplay,
} from "@/lib/articles";

import { articleArbitrary } from "../scripts/collector/test/generators/article.gen";

const datePrefixArb = fc
  .date({
    min: new Date("2024-01-01T00:00:00Z"),
    max: new Date("2027-12-31T00:00:00Z"),
  })
  .map((d) => d.toISOString().slice(0, 10));

const fileNameArb = fc.tuple(datePrefixArb, fc.hexaString({ minLength: 4, maxLength: 10 }))
  .map(([date, suffix]) => `/c/${date}-${suffix}.md`);

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

describe("filterFileNamesByDatePrefix (PBT-03)", () => {
  it("output is a subset of input", () => {
    fc.assert(
      fc.property(
        fc.array(fileNameArb, { maxLength: 30 }),
        datePrefixArb,
        (files, threshold) => {
          const out = filterFileNamesByDatePrefix(files, threshold);
          const inSet = new Set(files);
          return out.every((p) => inSet.has(p));
        },
      ),
      { numRuns: 100 },
    );
  });

  it("output length is less than or equal to input length", () => {
    fc.assert(
      fc.property(
        fc.array(fileNameArb, { maxLength: 30 }),
        datePrefixArb,
        (files, threshold) =>
          filterFileNamesByDatePrefix(files, threshold).length <= files.length,
      ),
      { numRuns: 100 },
    );
  });

  it("every output file's prefix is >= threshold (when prefix matches)", () => {
    fc.assert(
      fc.property(
        fc.array(fileNameArb, { maxLength: 30 }),
        datePrefixArb,
        (files, threshold) => {
          const out = filterFileNamesByDatePrefix(files, threshold);
          return out.every((p) => {
            const base = p.slice(p.lastIndexOf("/") + 1);
            const m = /^(\d{4}-\d{2}-\d{2})-/.exec(base);
            return m === null || m[1]! >= threshold;
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it("monotonicity: looser threshold never excludes previously-included files", () => {
    fc.assert(
      fc.property(
        fc.array(fileNameArb, { maxLength: 30 }),
        datePrefixArb,
        datePrefixArb,
        (files, t1, t2) => {
          const stricter = t1 > t2 ? t1 : t2;
          const looser = t1 > t2 ? t2 : t1;
          const sStrict = new Set(filterFileNamesByDatePrefix(files, stricter));
          const sLoose = new Set(filterFileNamesByDatePrefix(files, looser));
          for (const p of sStrict) {
            if (!sLoose.has(p)) return false;
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
