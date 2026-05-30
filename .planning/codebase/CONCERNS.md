# Codebase Concerns

**Analysis Date:** 2026-05-30

## Tech Debt

**Flat content directory growing unboundedly:**
- Issue: All article markdown files are stored in a single flat directory (`content/`). As of analysis date there are 878 files, growing at ~38/day. The `NodeFileReader.walk()` in `next/lib/articles.ts` (line 155) and `Deduplicator.initialize()` in `next/scripts/collector/lib/deduplicator.ts` (line 25) both read all files on every run.
- Files: `next/lib/articles.ts`, `next/scripts/collector/lib/deduplicator.ts`
- Impact: Deduplicator reads every file's frontmatter on every collector run (O(n) parse of all 878+ files). At 10 runs/day this will degrade. At tens of thousands of files the 10-minute CI timeout for `collect.yml` becomes a risk.
- Fix approach: Partition content by year/month subdirectories (e.g., `content/2026/05/`). The `filterFileNamesByDatePrefix` pre-filter in `getArticlesPublishedSince` already limits page reads, but deduplicator has no equivalent shortcut.

**Source config is hardcoded in TypeScript:**
- Issue: `next/config/sources.ts` (line 57–84) contains the feed URLs, enabled flags, and `maxItemsPerRun` values as a hardcoded TypeScript object. Changing sources requires a code change and CI run.
- Files: `next/config/sources.ts`
- Impact: Cannot update feed configuration without a deploy. Cannot disable a broken source at runtime.
- Fix approach: Move source config to a JSON/YAML file (or environment variables), validated at startup via the existing Zod schemas.

**`compose-commit-message.cjs` is a CommonJS outlier:**
- Issue: `next/scripts/collector/compose-commit-message.cjs` is a plain CommonJS file while the rest of the collector uses ES modules with TypeScript. It is explicitly excluded from ESLint in `eslint.config.mjs`.
- Files: `next/scripts/collector/compose-commit-message.cjs`, `next/eslint.config.mjs`
- Impact: Not type-checked, not linted. A schema change to `collector-result.json` could silently produce a bad commit message.
- Fix approach: Convert to a TypeScript file compiled or run via `tsx`, consistent with the rest of the collector.

## Known Bugs

**Silent write failures in `MarkdownWriter` are unobservable:**
- Symptoms: When `MarkdownWriter.write()` (line 49 of `next/scripts/collector/lib/markdown-writer.ts`) catches any error writing an article, it increments `skipped` and continues — but the error is never logged and never surfaced in the `CollectorRunResult`.
- Files: `next/scripts/collector/lib/markdown-writer.ts`
- Trigger: Any I/O error or filename collision exceeding 99 retries silently discards an article.
- Workaround: None. The `result.totalNew` count will be lower than expected with no explanation.

**E2E tests implicitly require content within the 3-day display window:**
- Symptoms: `next/e2e/home.spec.ts` (lines 21, 31) calls `.first()` on `article-link` elements and asserts them visible. If the collector has not run recently or all content is older than 3 days, the page renders `EmptyState` and both tests fail with a timeout.
- Files: `next/e2e/home.spec.ts`, `next/app/page.tsx`
- Trigger: Running e2e tests in CI against a checkout with a stale or empty `content/` directory.
- Workaround: Currently the CI `e2e` job runs against the checked-out `content/` which always has recent articles. This will break if the repo is checked out on a branch without recent content, or if the collect schedule falls behind.

**`Deduplicator.initialize()` throws on any malformed frontmatter:**
- Symptoms: `Deduplicator.initialize()` in `next/scripts/collector/lib/deduplicator.ts` (line 33) calls `ArticleFrontmatterSchema.parse()` without a try/catch. If any existing content file has invalid frontmatter, the entire collector run aborts before fetching any new articles.
- Files: `next/scripts/collector/lib/deduplicator.ts`
- Trigger: A manually edited or corrupted `.md` file in `content/`.
- Workaround: None; the collect workflow will fail and nothing new is collected until the bad file is fixed.

**`collector-result.json` is `.gitignore`d but gets written locally:**
- Symptoms: The `.gitignore` at repo root (last line) excludes `next/collector-result.json`, but the file exists in the working tree after a local `npm run collect`. There is no `.gitignore` inside `next/`. The file is not tracked but could be confusing.
- Files: `.gitignore`, `next/collector-result.json`
- Trigger: Running `npm run collect` locally.
- Workaround: The file is ignored correctly. The only issue is the file appearing as untracked noise in `git status`.

## Security Considerations

**Browser-like User-Agent spoofing:**
- Risk: `next/scripts/collector/lib/http-client.ts` (line 18) sends `Mozilla/5.0 ... Chrome/140.0.0.0` as the User-Agent for all HTTP requests. This impersonates a browser to bypass bot detection on Hatena, Google News, and Togetter.
- Files: `next/scripts/collector/lib/http-client.ts`
- Current mitigation: None. Requests are made from a GitHub Actions runner IP.
- Recommendations: Assess ToS compliance for each source. Consider a more honest agent string (e.g., `news-hako-collector/1.0`) while accepting that some sources may block it, and handle 403/429 responses explicitly.

**`SecretScrubber` patterns use stateful `RegExp` objects with the `g` flag:**
- Risk: `next/scripts/collector/lib/secret-scrubber.ts` (line 1–5) defines `SECRET_PATTERNS` as a `ReadonlyArray<RegExp>` with global flag (`/gi`). Global regexes in JavaScript maintain `lastIndex` state between calls. Since `scrub()` calls `replace()` (which resets `lastIndex`), this is currently safe — but it is a latent correctness hazard if `exec()` or `test()` is ever used on the same pattern objects.
- Files: `next/scripts/collector/lib/secret-scrubber.ts`
- Current mitigation: `String.replace()` resets `lastIndex`, so no active bug today.
- Recommendations: Either remove the `g` flag and use `replaceAll()`, or create new `RegExp` instances per `scrub()` call.

**Collect workflow pushes directly to `main` without branch protection bypass guard:**
- Risk: `collect.yml` (line 61) runs `git push origin HEAD:main` from a GitHub Actions job with `contents: write` permission. There is no check that the push succeeded or that `main` branch protection rules are satisfied. A force-push race with a developer PR merge could cause issues.
- Files: `.github/workflows/collect.yml`
- Current mitigation: The `concurrency: group: collect` block prevents two collect runs overlapping.
- Recommendations: Consider pushing to a dedicated `chore/collect` branch and merging via PR, or at minimum add `--force-with-lease` to detect unexpected divergence.

## Performance Bottlenecks

**Deduplicator reads and parses all content files on every collector run:**
- Problem: `Deduplicator.initialize()` in `next/scripts/collector/lib/deduplicator.ts` reads every markdown file, calls `matter()` on each, and extracts the URL. At 878 files this is approximately 878 file reads + 878 YAML parses per run.
- Files: `next/scripts/collector/lib/deduplicator.ts`
- Cause: No persistent seen-URL cache. The full initialization is required because article URLs are inside frontmatter, not derivable from file names alone.
- Improvement path: Maintain a separate `content/.url-index` file (newline-separated normalized URLs), updated by `MarkdownWriter` on each write. Deduplicator reads the index instead of all files. Alternatively, partition content by date and only read recent partitions.

**`FsArticleRepository` reads and parses all candidate files on every page request:**
- Problem: `page.tsx` calls `articleRepository.getArticlesPublishedSince()` on every server render. This reads all files with a matching date prefix (potentially all recent content) into memory, parses frontmatter, then filters in-process.
- Files: `next/lib/articles.ts`, `next/app/page.tsx`
- Cause: No in-memory cache, no ISR/static generation configuration in `next/next.config.ts`.
- Improvement path: Enable Next.js full-route static generation (the page renders with `now` server-side, making it time-dependent — but static export with a cron-triggered rebuild after each collect run would eliminate per-request file I/O entirely).

**Google News fetcher makes multiple HTTP requests with no inter-request delay:**
- Problem: `GoogleNewsRssFetcher.fetch()` in `next/scripts/collector/sources/google-news-rss-fetcher.ts` (line 31) loops over multiple URLs (queries + topics + geos) with no sleep between them. Currently only 2 URLs are configured (1 query + 1 topic) but config allows unlimited.
- Files: `next/scripts/collector/sources/google-news-rss-fetcher.ts`
- Cause: No `requestIntervalMs` config field for Google News, unlike `TogetterConfig` which has one.
- Improvement path: Add `requestIntervalMs` to `GoogleNewsConfigSchema` (mirroring `TogetterConfigSchema`) and add a sleep between requests in the fetch loop.

## Fragile Areas

**Togetter HTML scraper depends on a specific CSS selector:**
- Files: `next/scripts/collector/sources/togetter-scraper.ts`
- Why fragile: `parseCategoryPage()` (line 85) selects articles with `$('a[href*="/li/"]')`. This relies on Togetter's current URL structure. Any Togetter layout redesign or URL-scheme change would silently produce zero results, which then throws an error (`no items extracted from ${url} (selectors may have changed)`) — caught by the outer `try/catch` as a warning, not a failure. The entire `togetter` source would produce 0 articles silently.
- Safe modification: After changing selectors, run `npm run collect` with a test HTML fixture. The existing `next/scripts/collector/test/sources/togetter-scraper.test.ts` covers the happy path but not selector exhaustion.
- Test coverage: The "zero items returned" code path (line 55–56) is not unit-tested for the case where the HTML contains no matching elements.

**`FsArticleRepository` throws on any single corrupt file, crashing the page:**
- Files: `next/lib/articles.ts` (line 206–208)
- Why fragile: `readArticlesFromFiles()` re-throws on any `fromFrontmatter()` failure. One malformed file in `content/` will cause every page request to return a 500 error until the bad file is removed.
- Safe modification: Add a `continue` + error log on per-file parse failure instead of re-throwing, or validate files in the collector before committing.
- Test coverage: The throw path is tested in `next/lib/articles.test.ts` (line 258), but there is no test for the "continue on bad file" behavior because that behavior does not exist yet.

**Module-level `articleRepository` singleton assumes a fixed `CONTENT_DIR`:**
- Files: `next/lib/articles.ts` (line 215)
- Why fragile: `export const articleRepository: ArticleRepository = new FsArticleRepository()` is instantiated at module load time. The `CONTENT_DIR` is resolved once via `resolveContentDir()`, which reads `process.env["CONTENT_DIR"]` at that moment. In test or non-standard environments the content dir cannot be changed after import without module re-evaluation.
- Safe modification: Import `FsArticleRepository` class directly instead of using the singleton, or pass `contentDir` as a parameter at the call site.
- Test coverage: `lib/articles.test.ts` correctly avoids the singleton by constructing `FsArticleRepository` directly, so tests are unaffected.

## Scaling Limits

**Flat `content/` directory:**
- Current capacity: 878 files (as of 2026-05-30), growing ~38/day.
- Limit: Most filesystems handle thousands of files in a single directory, but `git add content/` in `collect.yml` becomes progressively slower as file count grows. `git status` and `git diff` over 10,000+ files may exceed the 10-minute workflow timeout.
- Scaling path: Partition into `content/YYYY/MM/` subdirectories. Update `NodeFileReader.walk()` and `Deduplicator.initialize()` accordingly.

**`content/` grows without a TTL or pruning mechanism:**
- Current capacity: Files from 2017 onwards are present (e.g., `content/2017-10-20-u89zirmg.md`).
- Limit: No maximum age or article count is enforced. The repository will grow indefinitely.
- Scaling path: Add a cron-based pruning job that removes files older than N months and keeps the repository lean.

## Dependencies at Risk

**Next.js 16.2.4 — cutting-edge version with breaking changes:**
- Risk: The `next/AGENTS.md` file explicitly warns that this version of Next.js has breaking changes from training data. APIs, conventions, and file structure may differ from well-documented Next.js 14/15 patterns.
- Impact: Any code written following standard Next.js patterns may use deprecated or removed APIs. The `next/node_modules/next/dist/docs/` directory must be consulted before modifying `app/` code.
- Migration plan: Track Next.js 16 release notes carefully. Run `npm run build` and `npm run test:e2e` after any framework-touching changes.

**`npm-audit` job runs with `continue-on-error: true`:**
- Risk: `ci.yml` (line 85) marks the npm audit job as non-blocking. Moderate-severity vulnerabilities in dependencies will not block merges.
- Impact: Known CVEs in `cheerio`, `rss-parser`, or other dependencies could go unaddressed indefinitely.
- Migration plan: Set `continue-on-error: false` or add Dependabot/Renovate to auto-create upgrade PRs.

## Missing Critical Features

**No alerting when the collector partially or fully fails:**
- Problem: If all 4 sources fail in a single run, the collector exits 0 (only `process.exit(1)` on a fatal crash), the workflow succeeds, and no new articles are committed. There is no notification mechanism (Slack, email, GitHub issue) for degraded collection.
- Blocks: Detecting silent source failures in production without manually inspecting workflow run logs.

**No content expiry / TTL for old articles:**
- Problem: There is no mechanism to remove articles older than a configurable threshold from `content/`. Old articles accumulate forever, increasing repository size and initialization time.
- Blocks: Long-term repository hygiene and collector performance.

## Test Coverage Gaps

**`MarkdownWriter` silent `catch {}` path is not tested:**
- What's not tested: The `skipped += 1` branch in `MarkdownWriter.write()` (`next/scripts/collector/lib/markdown-writer.ts` line 50). No test exercises a write failure (e.g., `fileSystem.writeText` throwing) to verify `skipped` is incremented and the write continues.
- Files: `next/scripts/collector/test/markdown-writer.test.ts`
- Risk: A regression that silently drops all articles would not be caught by tests.
- Priority: Medium

**Togetter `parseCategoryPage` zero-results branch is not tested:**
- What's not tested: The `throw new Error('no items extracted...')` branch in `togetter-scraper.ts` (line 55). The test suite exercises parsing valid HTML but not HTML that produces zero `a[href*="/li/"]` matches.
- Files: `next/scripts/collector/test/sources/togetter-scraper.test.ts`
- Risk: A Togetter layout change silently produces 0 articles per run; the per-URL error is caught and logged as a warn, meaning the source appears "working" with 0 items.
- Priority: Medium

**E2E tests have no empty-state or near-empty-content coverage:**
- What's not tested: The `EmptyState` rendering path in `next/e2e/home.spec.ts`. Two of the four e2e tests (`article-link` tests) will time out when the page renders the empty state component.
- Files: `next/e2e/home.spec.ts`, `next/components/empty-state.tsx`
- Risk: A regression in the empty state path (e.g., crash instead of rendering `EmptyState`) would not be caught by any automated test.
- Priority: Low

**`Deduplicator.initialize()` malformed-frontmatter throw path is not tested:**
- What's not tested: Behavior of `Deduplicator.initialize()` when a content file has invalid frontmatter (the `ArticleFrontmatterSchema.parse()` at line 33 would throw, crashing the entire collector run).
- Files: `next/scripts/collector/test/deduplicator.test.ts`
- Risk: A corrupt content file could abort all future collector runs until manually fixed, with no automated detection.
- Priority: High

---

*Concerns audit: 2026-05-30*
