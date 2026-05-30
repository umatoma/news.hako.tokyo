import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DefaultHttpClient } from "../lib/http-client";

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

function lastFetchHeaders(fetchMock: ReturnType<typeof vi.fn>): Headers {
  const init = fetchMock.mock.calls.at(-1)?.[1] as RequestInit | undefined;
  return new Headers(init?.headers);
}

describe("DefaultHttpClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () =>
      new Response("<rss/>", {
        status: 200,
        headers: { "content-type": "application/rss+xml" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a browser-like User-Agent on every request (FR-001/FR-002)", async () => {
    await new DefaultHttpClient().get("https://example.com/feed");

    expect(lastFetchHeaders(fetchMock).get("User-Agent")).toBe(BROWSER_USER_AGENT);
  });

  it("does not send the legacy collector User-Agent (regression guard)", async () => {
    await new DefaultHttpClient().get("https://example.com/feed");

    expect(lastFetchHeaders(fetchMock).get("User-Agent")).not.toContain(
      "news.hako.tokyo collector",
    );
  });

  it("lets a caller-provided User-Agent override the default (FR-003)", async () => {
    await new DefaultHttpClient().get("https://example.com/feed", {
      headers: { "User-Agent": "custom" },
    });

    expect(lastFetchHeaders(fetchMock).get("User-Agent")).toBe("custom");
  });

  it("returns status, body, and headers from the response (FR-004)", async () => {
    const response = await new DefaultHttpClient().get("https://example.com/feed");

    expect(response.status).toBe(200);
    expect(response.body).toBe("<rss/>");
    expect(response.headers["content-type"]).toBe("application/rss+xml");
  });
});
