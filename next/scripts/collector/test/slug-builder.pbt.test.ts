import * as fc from "fast-check";
import { describe, it } from "vitest";

import { SlugBuilder } from "../lib/slug-builder";

const builder = new SlugBuilder();

const titleArb = fc.string({ minLength: 0, maxLength: 200 });
const idArb = fc.stringMatching(/^[0-9a-z]{16}$/u);

describe("SlugBuilder.build (PBT-03)", () => {
  it("output matches /^[a-z0-9-]+$/", () => {
    fc.assert(
      fc.property(titleArb, idArb, (title, id) => {
        const slug = builder.build(title, id);
        return /^[a-z0-9-]+$/u.test(slug);
      }),
      { numRuns: 200 },
    );
  });

  it("output length is between 1 and 50", () => {
    fc.assert(
      fc.property(titleArb, idArb, (title, id) => {
        const slug = builder.build(title, id);
        return slug.length >= 1 && slug.length <= 50;
      }),
      { numRuns: 200 },
    );
  });

  it("is deterministic for the same (title, id)", () => {
    fc.assert(
      fc.property(titleArb, idArb, (title, id) => builder.build(title, id) === builder.build(title, id)),
      { numRuns: 200 },
    );
  });

  it("different ids with same title yield different slugs (when ASCII portion >= 3)", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[A-Za-z]{3,20}$/u),
        idArb,
        idArb,
        (title, idA, idB) => {
          if (idA === idB) return true;
          return builder.build(title, idA) !== builder.build(title, idB);
        },
      ),
      { numRuns: 100 },
    );
  });
});
