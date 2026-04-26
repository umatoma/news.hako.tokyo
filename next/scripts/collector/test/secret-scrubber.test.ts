import { describe, expect, it } from "vitest";

import { SecretScrubber } from "../lib/secret-scrubber";

const scrubber = new SecretScrubber();

describe("SecretScrubber.scrub", () => {
  it("masks Bearer tokens", () => {
    expect(scrubber.scrub("Bearer abc123_DEF.456")).toBe("[REDACTED]");
  });

  it("masks Authorization values", () => {
    expect(scrubber.scrub("Authorization: secret-token-1")).toBe("[REDACTED]");
  });

  it("masks api_key style assignments", () => {
    const input = 'api_key="abc123_def"';
    expect(scrubber.scrub(input)).toBe("[REDACTED]");
  });

  it("masks password tokens", () => {
    const input = "password = mysecretpw";
    expect(scrubber.scrub(input)).toBe("[REDACTED]");
  });

  it("leaves plain text alone", () => {
    expect(scrubber.scrub("ordinary message")).toBe("ordinary message");
  });
});
