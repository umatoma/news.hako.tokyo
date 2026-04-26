import * as fc from "fast-check";
import { describe, it } from "vitest";

import { fromFrontmatter, toFrontmatter } from "@/lib/article";

import { articleArbitrary } from "./generators/article.gen";

describe("Article frontmatter round-trip (PBT-02)", () => {
  it("fromFrontmatter(toFrontmatter(a)) === a for any valid Article", () => {
    fc.assert(
      fc.property(articleArbitrary, (article) => {
        const round = fromFrontmatter(toFrontmatter(article));
        return JSON.stringify(round) === JSON.stringify(article);
      }),
      { numRuns: 200 },
    );
  });
});
