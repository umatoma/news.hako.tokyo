import { describe, expect, it } from "vitest";

import { SlugBuilder } from "../lib/slug-builder";

const builder = new SlugBuilder();
const id = "k9xr2p1m3qaztb47";

describe("SlugBuilder.build", () => {
  it("uses ASCII title with id suffix when title contains ASCII", () => {
    const slug = builder.build("Hello World Article", id);
    expect(slug).toMatch(/^hello-world-article--k9xr2p$/u);
  });

  it("falls back to id prefix when title has no ASCII letters", () => {
    const slug = builder.build("こんにちは世界", id);
    expect(slug).toBe(id.slice(0, 8));
  });

  it("falls back when ASCII portion shorter than 3 characters", () => {
    const slug = builder.build("a!", id);
    expect(slug).toBe(id.slice(0, 8));
  });

  it("produces only allowed characters", () => {
    const slug = builder.build("Hello, World!", id);
    expect(slug).toMatch(/^[a-z0-9-]+$/u);
  });

  it("respects max length 50", () => {
    const longTitle = "A".repeat(200);
    const slug = builder.build(longTitle, id);
    expect(slug.length).toBeLessThanOrEqual(50);
  });

  it("is deterministic", () => {
    expect(builder.build("Some Title", id)).toBe(builder.build("Some Title", id));
  });
});
