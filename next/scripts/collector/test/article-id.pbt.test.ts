import * as fc from "fast-check";
import { describe, it } from "vitest";

import { generateArticleId } from "../lib/article-id";

import { urlArbitrary } from "./generators/url.gen";

describe("generateArticleId (PBT-03)", () => {
  it("output matches /^[0-9a-z]{16}$/", () => {
    fc.assert(
      fc.property(urlArbitrary, (url) => /^[0-9a-z]{16}$/u.test(generateArticleId(url))),
      { numRuns: 200 },
    );
  });

  it("is deterministic", () => {
    fc.assert(
      fc.property(urlArbitrary, (url) => generateArticleId(url) === generateArticleId(url)),
      { numRuns: 200 },
    );
  });
});
