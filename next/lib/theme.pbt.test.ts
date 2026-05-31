import * as fc from "fast-check";
import { describe, it } from "vitest";

import { parseTheme, resolveEffectiveTheme, THEME_OPTIONS } from "@/lib/theme";

describe("parseTheme (PBT・全域性)", () => {
  it("任意文字列入力でも戻り値は必ず THEME_OPTIONS のいずれか (2.4)", () => {
    fc.assert(
      fc.property(fc.string(), (value) => THEME_OPTIONS.includes(parseTheme(value))),
      { numRuns: 200 },
    );
  });

  it("null / undefined / 任意文字列を含む入力でも有効 Theme を返す (2.3, 2.4)", () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string(), fc.constant(null), fc.constant(undefined)),
        (value) => THEME_OPTIONS.includes(parseTheme(value)),
      ),
      { numRuns: 200 },
    );
  });

  it("有効 Theme 文字列は冪等に自身を返す (1.1)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...THEME_OPTIONS), (theme) => parseTheme(theme) === theme),
      { numRuns: 100 },
    );
  });
});

describe("resolveEffectiveTheme (PBT・全域性)", () => {
  it("任意の Theme と prefersDark に対し戻り値は light/dark のいずれか (4.2)", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...THEME_OPTIONS),
        fc.boolean(),
        (theme, prefersDark) => {
          const result = resolveEffectiveTheme(theme, prefersDark);
          return result === "light" || result === "dark";
        },
      ),
      { numRuns: 100 },
    );
  });

  it("light/dark 固定は prefersDark に依存しない (4.2)", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("light" as const, "dark" as const),
        fc.boolean(),
        (theme, prefersDark) => resolveEffectiveTheme(theme, prefersDark) === theme,
      ),
      { numRuns: 100 },
    );
  });
});
