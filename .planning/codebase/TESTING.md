# Testing Patterns

**Analysis Date:** 2026-05-30

## Test Framework

**Runner:**
- Vitest v2.1.8
- Config: `next/vitest.config.ts`
- Environment: `node` (not jsdom)
- TypeScript type-checking enabled in test runs via `typecheck.tsconfig`

**E2E Framework:**
- Playwright v1.48
- Config: `next/playwright.config.ts`
- Browser: Chromium only
- Test directory: `next/e2e/`

**Property-Based Testing:**
- fast-check v3.23.1
- Used extensively alongside example-based tests

**Run Commands:**
```bash
npm run test          # vitest (watch mode by default)
npm run test:run      # vitest run (single pass, CI)
npm run test:watch    # vitest watch
npm run test:e2e      # playwright test
npm run test:e2e:install  # install playwright chromium browser
```

## Test File Organization

**Location:**
- Unit/integration tests: co-located with source or in a sibling `test/` directory
  - `next/lib/articles.test.ts` — tests for `next/lib/articles.ts`
  - `next/scripts/collector/test/deduplicator.test.ts` — tests for `next/scripts/collector/lib/deduplicator.ts`
- Property-based tests: same directory as example-based tests, with `.pbt.test.ts` suffix
- E2E tests: `next/e2e/*.spec.ts`

**Naming:**
- Example-based unit tests: `{module-name}.test.ts`
- Property-based tests: `{module-name}.pbt.test.ts`
- E2E tests: `{page-name}.spec.ts`

**Structure:**
```
next/lib/
  articles.ts
  articles.test.ts       # example-based unit tests
  articles.pbt.test.ts   # property-based tests

next/scripts/collector/
  lib/
    deduplicator.ts
    markdown-writer.ts
    ...
  sources/
    zenn-rss-fetcher.ts
    ...
  test/
    deduplicator.test.ts
    markdown-writer.test.ts
    markdown-writer.pbt.test.ts
    runner.test.ts
    in-memory-file-system.ts   # shared test double
    recording-http-client.ts   # shared test double
    generators/
      article.gen.ts     # fast-check arbitrary for Article
      url.gen.ts         # fast-check arbitrary for URLs
      rss-item.gen.ts    # fast-check arbitrary + renderRssXml helper
    sources/
      zenn-rss-fetcher.test.ts
      hatena-rss-fetcher.test.ts
      google-news-rss-fetcher.test.ts
      togetter-scraper.test.ts

next/e2e/
  home.spec.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { beforeEach, describe, expect, it } from "vitest";

describe("ClassName", () => {
  let dependency: MockType;
  let subject: ClassName;

  beforeEach(() => {
    dependency = new InMemoryFileSystem();
    subject = new ClassName({ contentDir: CONTENT_DIR, fileReader: dependency });
  });

  it("does X when Y", async () => {
    // arrange
    dependency.files.set(path.join(CONTENT_DIR, "file.md"), content);
    // act
    const result = await subject.methodUnderTest();
    // assert
    expect(result).toHaveLength(1);
  });
});
```

**Patterns:**
- `beforeEach` for setup when multiple tests share mutable state (e.g., `InMemoryFileSystem`, subject under test)
- No `afterEach` cleanup for in-memory fakes (garbage collected); `afterEach` used only for global stubs (`vi.unstubAllGlobals()`)
- Test descriptions are plain sentences describing behavior: `"loads existing URLs from markdown files in initialize()"`
- Requirement cross-referencing in test descriptions: `"(FR-001/FR-002)"`, `"(regression guard)"`, `"(PBT-02)"`
- Nested `describe` for sub-method tests: `describe("getArticlesPublishedSince", () => { ... })`

## Mocking

**Framework:** Vitest built-in (`vi` from `"vitest"`)

**Global stub pattern (for `fetch`):**
```typescript
import { afterEach, beforeEach, vi } from "vitest";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () =>
    new Response("<rss/>", { status: 200, headers: { "content-type": "application/rss+xml" } }),
  );
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```
Used in: `next/scripts/collector/test/http-client.test.ts`

**What to Mock:**
- Global `fetch` (only when testing `DefaultHttpClient` directly) via `vi.stubGlobal`
- External I/O (filesystem, HTTP) via hand-written in-memory fakes

**What NOT to Mock:**
- Pure logic (URL normalization, slug building, date formatting) — test directly
- Domain validation (Zod schemas) — test directly via `.parse()`

## Fixtures and Factories

**Inline sample objects:**
```typescript
// Defined at module level, reused across tests in the same file
const sample: Article = ArticleSchema.parse({
  id: "k9xr2p1m3qaztb47",
  title: "Sample",
  url: "https://example.com/x",
  source: "zenn",
  publishedAt: "2026-04-25T07:00:00+09:00",
  collectedAt: "2026-04-25T22:05:12+09:00",
  summary: "S",
  tags: [],
  thumbnailUrl: null,
});
```

**Factory functions (within test files):**
```typescript
function makeArticle(url: string, source: Article["source"] = "zenn"): Article {
  return {
    id: "abc",
    title: "title",
    url,
    source,
    publishedAt: "2026-04-25T07:00:00+09:00",
    collectedAt: "2026-04-25T22:05:12+09:00",
    summary: "",
    tags: [],
    thumbnailUrl: null,
  };
}
```

**fast-check Arbitraries (reusable generators in `test/generators/`):**

`next/scripts/collector/test/generators/article.gen.ts` — exports `articleArbitrary: fc.Arbitrary<Article>`
`next/scripts/collector/test/generators/url.gen.ts` — exports `cleanUrlArbitrary`
`next/scripts/collector/test/generators/rss-item.gen.ts` — exports `rssItemArbitrary` and `renderRssXml(items)`

**Location:**
- File-local sample objects and factory functions live at the top of the test file
- Shared generators live in `next/scripts/collector/test/generators/`

## Shared Test Doubles

**`InMemoryFileSystem`** (`next/scripts/collector/test/in-memory-file-system.ts`):
- Implements `FileSystem` interface (read + write)
- Backed by `Map<string, string>` — `files` property is public for test setup
- Used in: `deduplicator.test.ts`, `markdown-writer.test.ts`, `runner.test.ts`, `markdown-writer.pbt.test.ts`

**`InMemoryFileReader`** (defined inline in `next/lib/articles.test.ts`):
- Implements `FileReader` interface (read-only subset of FileSystem)
- Used in: `next/lib/articles.test.ts` only — not exported as a shared double

**`RecordingHttpClient`** (`next/scripts/collector/test/recording-http-client.ts`):
- Implements `HttpClient` interface
- Constructor takes `responses: Record<string, HttpResponse | string>` (url → response map)
- Records all calls in `calls: RecordedCall[]` for assertion
- Falls back to 404 for unmapped URLs by default
- Used in: all source fetcher tests, `runner.test.ts`

**Clock injection via `fixedClock`** (`next/scripts/collector/lib/clock.ts`):
```typescript
export function fixedClock(iso: string): Clock {
  const date = new Date(iso);
  return () => date;
}
// Usage:
const clock = fixedClock("2026-04-25T22:00:00Z");
```

## Coverage

**Requirements:** None enforced (no coverage threshold configured in `vitest.config.ts`)

**View Coverage:**
```bash
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Scope: Single class or pure function
- Location: Co-located or in sibling `test/` directory
- Approach: Use in-memory fakes for I/O dependencies, no network calls

**Integration Tests:**
- Scope: Multiple collaborators wired together end-to-end (e.g., `runner.test.ts` wires `CollectorRunner` with all real collaborators except HTTP/FS)
- Location: `next/scripts/collector/test/runner.test.ts`
- Approach: `InMemoryFileSystem` + `RecordingHttpClient` replace all I/O

**Property-Based Tests:**
- Scope: Invariants of pure functions and round-trip serialization
- Files: `*.pbt.test.ts`
- Framework: fast-check with `fc.assert(fc.property(...))` or `fc.asyncProperty`
- Run count: 100 or 200 runs per property (`{ numRuns: 100 }`)
- Generators defined in `test/generators/` and shared across PBT files

**E2E Tests:**
- Framework: Playwright
- Location: `next/e2e/`
- Scope: Browser-level rendering and DOM assertions on the running Next.js app
- Selectors: `data-testid` attributes used exclusively — e.g., `page.getByTestId("header-article-count")`
- Approach: webServer configured to start `npm start` against `http://localhost:3000`

## Common Patterns

**Async Testing:**
```typescript
it("parses markdown files and returns Article[]", async () => {
  const reader = new InMemoryFileReader();
  reader.files.set(file, content);
  const repo = new FsArticleRepository({ contentDir: dir, fileReader: reader });
  const articles = await repo.getAllArticles();
  expect(articles).toHaveLength(1);
});
```

**Error Testing:**
```typescript
// Async rejection:
await expect(repo.getAllArticles()).rejects.toThrow(/Invalid frontmatter/);

// Sync throw:
expect(() => dedup.filterNew([])).toThrow();

// Zod validation failure:
expect(() => fromFrontmatter({ id: "x", title: "t", url: "not-a-url", ... })).toThrow();
```

**Immutability Testing:**
```typescript
it("does not mutate the input array", () => {
  const input = [withPublishedAt("2026-04-28T00:00:00+09:00", "a")];
  const snapshot = [...input];
  filterArticlesWithinDays(input, 3, now);
  expect(input).toEqual(snapshot);
});
```

**PBT round-trip testing:**
```typescript
import * as fc from "fast-check";
import { describe, it } from "vitest";

describe("Article frontmatter round-trip (PBT-02)", () => {
  it("fromFrontmatter(toFrontmatter(a)) === a for any valid Article", () => {
    fc.assert(
      fc.property(articleArbitrary, (article) => {
        const round = fromFrontmatter(toFrontmatter(article));
        return JSON.stringify(round) === JSON.stringify(article);
      }),
      { numRuns: 200 },
    );
  });
});
```

---

*Testing analysis: 2026-05-30*
