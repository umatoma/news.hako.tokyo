import { describe, expect, it } from "vitest";

import {
  parseTheme,
  resolveEffectiveTheme,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

describe("THEME_OPTIONS / THEME_STORAGE_KEY", () => {
  it("THEME_OPTIONS は light/dark/system の3択", () => {
    expect(THEME_OPTIONS).toEqual(["light", "dark", "system"]);
  });

  it('THEME_STORAGE_KEY は "theme"', () => {
    expect(THEME_STORAGE_KEY).toBe("theme");
  });
});

describe("parseTheme", () => {
  it('"light" / "dark" / "system" はそれぞれ自身を返す (1.1)', () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
    expect(parseTheme("system")).toBe("system");
  });

  it('null / undefined / "" は "system" を返す (2.3)', () => {
    expect(parseTheme(null)).toBe("system");
    expect(parseTheme(undefined)).toBe("system");
    expect(parseTheme("")).toBe("system");
  });

  it('未知値は "system" を返す (2.4)', () => {
    expect(parseTheme("invalid")).toBe("system");
    expect(parseTheme("LIGHT")).toBe("system");
    expect(parseTheme(" light ")).toBe("system");
    expect(parseTheme("0")).toBe("system");
  });
});

describe("resolveEffectiveTheme", () => {
  it('system のときは prefersDark に従う (4.1)', () => {
    expect(resolveEffectiveTheme("system", true)).toBe("dark");
    expect(resolveEffectiveTheme("system", false)).toBe("light");
  });

  it("light/dark 固定時は OS 非依存 (4.2)", () => {
    expect(resolveEffectiveTheme("light", true)).toBe("light");
    expect(resolveEffectiveTheme("light", false)).toBe("light");
    expect(resolveEffectiveTheme("dark", true)).toBe("dark");
    expect(resolveEffectiveTheme("dark", false)).toBe("dark");
  });
});
