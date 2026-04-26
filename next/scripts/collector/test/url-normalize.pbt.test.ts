import * as fc from "fast-check";
import { describe, it } from "vitest";

import { normalizeUrlForDedup } from "../lib/url-normalize";

import { urlArbitrary } from "./generators/url.gen";

const TRACKING_KEY_PATTERN = /\b(utm_[a-z]+|gclid|fbclid|mc_cid|mc_eid|yclid|msclkid)=/iu;

describe("normalizeUrlForDedup (PBT-03)", () => {
  it("is idempotent: f(f(x)) === f(x)", () => {
    fc.assert(
      fc.property(urlArbitrary, (url) => {
        const once = normalizeUrlForDedup(url);
        const twice = normalizeUrlForDedup(once);
        return once === twice;
      }),
      { numRuns: 200 },
    );
  });

  it("output never contains known tracking params", () => {
    fc.assert(
      fc.property(urlArbitrary, (url) => !TRACKING_KEY_PATTERN.test(normalizeUrlForDedup(url))),
      { numRuns: 200 },
    );
  });

  it("output never contains a fragment", () => {
    fc.assert(
      fc.property(urlArbitrary, (url) => !normalizeUrlForDedup(url).includes("#")),
      { numRuns: 200 },
    );
  });
});
