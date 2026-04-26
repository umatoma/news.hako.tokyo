import { describe, expect, it } from "vitest";

import { generateArticleId } from "../lib/article-id";

describe("generateArticleId", () => {
  it("returns 16 character Base36 string", () => {
    const id = generateArticleId("https://example.com/article");
    expect(id).toMatch(/^[0-9a-z]{16}$/u);
  });

  it("is deterministic for the same URL", () => {
    const a = generateArticleId("https://example.com/x");
    const b = generateArticleId("https://example.com/x");
    expect(a).toBe(b);
  });

  it("collapses URLs differing only in tracking params to the same id", () => {
    const a = generateArticleId("https://example.com/x?utm_source=x");
    const b = generateArticleId("https://example.com/x");
    expect(a).toBe(b);
  });

  it("differs for distinct URLs", () => {
    const a = generateArticleId("https://example.com/x");
    const b = generateArticleId("https://example.com/y");
    expect(a).not.toBe(b);
  });
});
