import { describe, expect, it } from "vitest";

import { normalizeUrlForDedup } from "../lib/url-normalize";

describe("normalizeUrlForDedup", () => {
  it("removes trailing slash for non-root paths", () => {
    expect(normalizeUrlForDedup("https://example.com/foo/")).toBe("https://example.com/foo");
  });

  it("keeps root slash", () => {
    expect(normalizeUrlForDedup("https://example.com/")).toBe("https://example.com/");
  });

  it("strips known tracking params", () => {
    const out = normalizeUrlForDedup(
      "https://example.com/x?utm_source=a&utm_medium=b&q=keep",
    );
    expect(out).toContain("q=keep");
    expect(out).not.toContain("utm_source");
    expect(out).not.toContain("utm_medium");
  });

  it("sorts remaining query params", () => {
    const a = normalizeUrlForDedup("https://example.com/x?b=2&a=1");
    const b = normalizeUrlForDedup("https://example.com/x?a=1&b=2");
    expect(a).toBe(b);
  });

  it("removes fragments", () => {
    expect(normalizeUrlForDedup("https://example.com/x#section")).toBe(
      "https://example.com/x",
    );
  });

  it("lowercases host", () => {
    expect(normalizeUrlForDedup("https://Example.COM/x")).toBe("https://example.com/x");
  });
});
