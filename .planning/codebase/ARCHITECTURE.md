<!-- refreshed: 2026-05-30 -->
# Architecture

**Analysis Date:** 2026-05-30

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions (CI / Collect)                 │
│         `.github/workflows/collect.yml`  (scheduled daily)      │
└──────────────────┬──────────────────────────────────────────────┘
                   │ runs `npm run collect`
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Collector Script (Node.js CLI)                │
│    Entry: `next/scripts/collector/index.ts`                     │
│    Wiring: `next/scripts/collector/builder.ts`                  │
│    Orchestrator: `next/scripts/collector/runner.ts`             │
│                                                                  │
│  ┌──────────────────┐   ┌──────────────────┐                   │
│  │  Source Fetchers  │   │   Deduplicator   │                   │
│  │  (RSS / Scrape)   │   │  (URL-hash set)  │                   │
│  └────────┬─────────┘   └────────┬─────────┘                   │
│           │                      │                              │
│           ▼                      ▼                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               MarkdownWriter                               │ │
│  │   `next/scripts/collector/lib/markdown-writer.ts`         │ │
│  └───────────────────────────┬────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────┘
                               │ writes .md files
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              Content Store  (`content/`)                        │
│   Flat directory of Markdown files with YAML frontmatter        │
│   ~878+ files, named: `YYYY-MM-DD-<slug>--<id>.md`             │
└──────────────────────────────┬──────────────────────────────────┘
                               │ read at request time
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js App (Server Component)                     │
│   Entry: `next/app/page.tsx`  (async Server Component)         │
│   Reads via: `next/lib/articles.ts` → `FsArticleRepository`    │
│   Renders: `next/components/`                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `CollectorRunner` | Orchestrates all source fetches, dedup, write | `next/scripts/collector/runner.ts` |
| `buildRunner` | Dependency wiring (factory) for the collector | `next/scripts/collector/builder.ts` |
| `ZennRssFetcher` | Fetches Zenn RSS feeds | `next/scripts/collector/sources/zenn-rss-fetcher.ts` |
| `HatenaRssFetcher` | Fetches Hatena Bookmark RSS feeds | `next/scripts/collector/sources/hatena-rss-fetcher.ts` |
| `GoogleNewsRssFetcher` | Fetches Google News RSS feeds | `next/scripts/collector/sources/google-news-rss-fetcher.ts` |
| `TogetterScraper` | Scrapes Togetter ranking pages via HTML | `next/scripts/collector/sources/togetter-scraper.ts` |
| `parseRss` | Generic RSS-to-`FetchedArticle` parser | `next/scripts/collector/sources/rss-mapping.ts` |
| `Deduplicator` | Loads existing article URLs into a Set; filters new-only | `next/scripts/collector/lib/deduplicator.ts` |
| `MarkdownWriter` | Serialises `Article` to frontmatter `.md` with slug | `next/scripts/collector/lib/markdown-writer.ts` |
| `SlugBuilder` | Derives ASCII slug from article title | `next/scripts/collector/lib/slug-builder.ts` |
| `generateArticleId` | SHA-256 of normalised URL, encoded base-36 | `next/scripts/collector/lib/article-id.ts` |
| `DefaultHttpClient` | `fetch`-based HTTP GET with UA spoofing | `next/scripts/collector/lib/http-client.ts` |
| `DefaultLogger` | Structured console logger with secret scrubbing | `next/scripts/collector/logger.ts` |
| `JobSummaryReporter` | Writes `collector-result.json` + GitHub Step Summary | `next/scripts/collector/lib/job-summary-reporter.ts` |
| `FsArticleRepository` | Reads `.md` files from `content/`, parses frontmatter | `next/lib/articles.ts` |
| `Article` / `ArticleSchema` | Core domain type and Zod schemas | `next/lib/article.ts` |
| `Home` (page) | Next.js Server Component: fetches, filters, renders | `next/app/page.tsx` |
| `ArticleList` | React list component | `next/components/article-list.tsx` |
| `ArticleListItem` | Single article card | `next/components/article-list-item.tsx` |
| `Header` / `Footer` | Chrome components with page stats | `next/components/header.tsx`, `next/components/footer.tsx` |
| Source config | Per-source typed config (Zod-validated) | `next/config/sources.ts` |

## Pattern Overview

**Overall:** Two-phase pipeline — offline Collector writes data; online Next.js Server Component reads it.

**Key Characteristics:**
- No database: the filesystem (`content/`) is the data store
- Collector runs as a nightly GitHub Actions cron job; website is a static-rendered Next.js app
- All dependency injection is done through constructor-injected interfaces, enabling testability without mocks at the integration boundary
- Domain types defined once in `next/lib/article.ts` with Zod; shared by both collector and web app
- No client-side JS: the page is a pure React Server Component

## Layers

**Domain (shared):**
- Purpose: Core `Article` type, Zod schemas, frontmatter serialisation
- Location: `next/lib/article.ts`
- Contains: `ArticleSchema`, `ArticleFrontmatterSchema`, `toFrontmatter()`, `fromFrontmatter()`
- Depends on: `zod`
- Used by: Collector and web app

**Web — Repository:**
- Purpose: Reads article `.md` files from `content/` into `Article[]`
- Location: `next/lib/articles.ts`
- Contains: `FsArticleRepository`, `ArticleListItemView`, filter/sort/display helpers
- Depends on: `next/lib/article.ts`, `gray-matter`, Node `fs`
- Used by: `next/app/page.tsx`

**Web — Presentation:**
- Purpose: React Server Component + UI components
- Location: `next/app/`, `next/components/`
- Contains: layout, page, `ArticleList`, `ArticleListItem`, `Header`, `Footer`, `SourceBadge`
- Depends on: `next/lib/articles.ts`
- Used by: Next.js runtime

**Collector — Sources:**
- Purpose: Fetch articles from external sources
- Location: `next/scripts/collector/sources/`
- Contains: `ZennRssFetcher`, `HatenaRssFetcher`, `GoogleNewsRssFetcher`, `TogetterScraper`, `parseRss`, `SourceFetcher<T>` interface
- Depends on: `HttpClient`, `Logger`, `Clock`, `next/lib/article.ts`, `next/config/sources.ts`
- Used by: `CollectorRunner`

**Collector — Infrastructure:**
- Purpose: I/O and utility abstractions
- Location: `next/scripts/collector/lib/`
- Contains: `HttpClient`, `FileSystem`, `FileReader`, `Clock`, `Deduplicator`, `MarkdownWriter`, `SlugBuilder`, `generateArticleId`, `SecretScrubber`, `url-normalize`
- Depends on: Node built-ins, `cheerio`, `rss-parser`, `gray-matter`
- Used by: Sources and `CollectorRunner`

**Collector — Orchestration:**
- Purpose: Wire dependencies and run the full collection pipeline
- Location: `next/scripts/collector/runner.ts`, `next/scripts/collector/builder.ts`, `next/scripts/collector/index.ts`
- Contains: `CollectorRunner`, `buildRunner`, `main()`
- Depends on: all collector layers
- Used by: `npm run collect` / GitHub Actions

## Data Flow

### Collector Pipeline (nightly)

1. `main()` entry point constructs deps via `buildRunner()` (`next/scripts/collector/index.ts`)
2. `Deduplicator.initialize()` scans `content/` and loads all known article URLs into a `Set<string>` (`next/scripts/collector/lib/deduplicator.ts`)
3. For each source (`zenn`, `hatena`, `googlenews`, `togetter`), source fetcher GETs remote feed/page and maps items to `FetchedArticle[]` (`next/scripts/collector/sources/`)
4. `CollectorRunner` aggregates fetched articles, calls `deduplicator.filterNew()` to remove duplicates (`next/scripts/collector/runner.ts`)
5. Surviving articles have `collectedAt` stamped and are passed to `MarkdownWriter.write()` (`next/scripts/collector/lib/markdown-writer.ts`)
6. Each article is serialised to YAML frontmatter `.md` and written to `content/<date>-<slug>.md`
7. `JobSummaryReporter.emit()` writes `next/collector-result.json` and appends to `GITHUB_STEP_SUMMARY` (`next/scripts/collector/lib/job-summary-reporter.ts`)
8. GitHub Actions commits changed `content/` files and pushes to `main`

### Web Request Path (Next.js SSR)

1. HTTP request arrives at Next.js (`next/app/page.tsx`)
2. `articleRepository.getArticlesPublishedSince(thresholdDate)` reads `.md` files from `content/`, parses frontmatter via `gray-matter`, validates via Zod (`next/lib/articles.ts`)
3. `filterArticlesWithinDays()` further filters to the display window (3 days)
4. `sortArticlesForDisplay()` sorts by `publishedAt` desc, then `collectedAt` desc
5. `toListItemView()` maps `Article` → `ArticleListItemView` (display-ready view model)
6. `Home` renders `<Header>`, `<ArticleList>` (or `<EmptyState>`), `<Footer>` with Tailwind CSS

**State Management:**
- No client-side state. All data is read server-side at render time from the filesystem.

## Key Abstractions

**`SourceFetcher<TConfig>` interface:**
- Purpose: Uniform contract for all news sources
- Examples: `next/scripts/collector/sources/zenn-rss-fetcher.ts`, `hatena-rss-fetcher.ts`, `google-news-rss-fetcher.ts`, `togetter-scraper.ts`
- Pattern: `fetch(config: TConfig): Promise<FetchedArticle[]>`

**`HttpClient` interface:**
- Purpose: Abstracts HTTP GET, enabling recording/replay in tests
- Examples: `next/scripts/collector/lib/http-client.ts` (production), `next/scripts/collector/test/recording-http-client.ts` (test double)
- Pattern: Interface injection via constructor

**`FileSystem` / `FileReader` interface:**
- Purpose: Abstracts filesystem I/O for both collector and repository
- Examples: `next/scripts/collector/lib/file-system.ts`, `next/scripts/collector/test/in-memory-file-system.ts`
- Pattern: Interface injection

**`Clock` type:**
- Purpose: Abstracts time for deterministic testing
- Location: `next/scripts/collector/lib/clock.ts`
- Pattern: `type Clock = () => Date` — a zero-arg factory returning a `Date`

**`Article` / `FetchedArticle`:**
- Purpose: Core article domain types
- Location: `next/lib/article.ts`
- Pattern: `FetchedArticle = Omit<Article, "collectedAt">` — collector returns articles without timestamp; runner stamps them

**`ArticleListItemView`:**
- Purpose: Display-oriented view model decoupled from domain type
- Location: `next/lib/articles.ts`
- Pattern: `toListItemView(article: Article): ArticleListItemView` — explicit mapping function

## Entry Points

**Collector CLI:**
- Location: `next/scripts/collector/index.ts`
- Triggers: `npm run collect` (via `tsx`), nightly GitHub Actions cron
- Responsibilities: Resolves paths, calls `buildRunner`, runs pipeline, emits report

**Next.js Home Page:**
- Location: `next/app/page.tsx`
- Triggers: HTTP GET `/` via Next.js runtime
- Responsibilities: Reads articles from filesystem, computes display window, renders page

**Next.js Root Layout:**
- Location: `next/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: HTML shell, fonts, global CSS

## Architectural Constraints

- **Threading:** Single-threaded Node.js event loop. No worker threads. Collector sources are fetched sequentially (one source at a time) to respect rate limits.
- **Global state:** `articleRepository` is a module-level singleton (`next/lib/articles.ts:215`). `defaultHttpClient` and `defaultFileSystem` are module-level singletons in their respective files — production-only, never used in tests.
- **Circular imports:** None detected.
- **Content size:** `content/` is a flat directory (no subdirectories). Currently ~878 files. All files must be read on each web request to compute `listMarkdownFiles`, then filtered by filename prefix.
- **No API routes:** The Next.js app has no API routes — it is a pure server-rendered display layer.
- **Filesystem as DB:** No query capabilities. Deduplication is O(n) over all files on every collector run.

## Anti-Patterns

### Calling `articleRepository` directly in the page

**What happens:** `next/app/page.tsx` imports the module-level singleton `articleRepository` directly.
**Why it's wrong:** Makes the page impossible to unit test without filesystem access; couples the page to a concrete implementation.
**Do this instead:** Accept the repository as a prop or use Next.js's test utilities to inject a fake; or extract an async function that accepts a repository parameter.

### Repeated `FileReader` / `FileSystem` duplication

**What happens:** `next/lib/articles.ts` defines its own `FileReader` interface and `NodeFileReader` class that duplicate the nearly identical interfaces in `next/scripts/collector/lib/file-system.ts`.
**Why it's wrong:** Two diverging implementations of the same abstraction increase maintenance burden.
**Do this instead:** Promote the shared `FileReader` interface to `next/lib/` and import it from both the collector and the repository.

## Error Handling

**Strategy:** Errors in individual sources are caught and logged; the runner continues to process remaining sources. Fatal errors in `main()` cause `process.exit(1)`.

**Patterns:**
- Source fetchers catch per-feed errors and log with `logger.warn`, continuing to next feed
- `CollectorRunner` catches per-source errors, records them in `failedSources`, logs with `logger.error`
- `MarkdownWriter` catches per-article write errors silently (increments `skipped` counter)
- `fromFrontmatter()` throws `Error` with file path on invalid frontmatter; propagates to caller

## Cross-Cutting Concerns

**Logging:** `DefaultLogger` in `next/scripts/collector/logger.ts` — structured key=value format with level tags. All log values are passed through `SecretScrubber` before output.
**Validation:** Zod schemas at all data boundaries — article domain (`next/lib/article.ts`), source config (`next/config/sources.ts`), frontmatter parsing (`fromFrontmatter`).
**Authentication:** None — all sources are public.

---

*Architecture analysis: 2026-05-30*
