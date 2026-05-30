# External Integrations

**Analysis Date:** 2026-05-30

## APIs & External Services

**RSS/Atom Feed Sources (read-only, no auth):**
- Zenn.dev - Fetches technology articles via RSS
  - SDK/Client: `rss-parser` npm package
  - Feed URL: `https://zenn.dev/feed` (configured in `next/config/sources.ts`)
  - Auth: None required
  - Fetcher: `next/scripts/collector/sources/zenn-rss-fetcher.ts`

- Hatena Bookmark - Fetches popular bookmarked articles via RSS
  - SDK/Client: `rss-parser` npm package
  - Feed URL: `https://b.hatena.ne.jp/hotentry.rss` (configured in `next/config/sources.ts`)
  - Auth: None required
  - Fetcher: `next/scripts/collector/sources/hatena-rss-fetcher.ts`

- Google News - Fetches news articles via RSS search/topic/geo feeds
  - SDK/Client: `rss-parser` npm package
  - Feed URL pattern: `https://news.google.com/rss/search?q=...` and `https://news.google.com/news/rss/headlines/section/topic/...`
  - Auth: None required
  - Locale params: `hl=ja`, `gl=JP`, `ceid=JP:ja`
  - Fetcher: `next/scripts/collector/sources/google-news-rss-fetcher.ts`

**Web Scraping (read-only, no auth):**
- Togetter - Scrapes ranking/category pages for thread links using CSS selectors
  - SDK/Client: `cheerio` npm package
  - Target URL: `https://togetter.com/ranking` (configured in `next/config/sources.ts`)
  - Auth: None required
  - Rate limiting: `requestIntervalMs: 5000` between page requests (configurable)
  - Scraper: `next/scripts/collector/sources/togetter-scraper.ts`
  - HTTP client: `next/scripts/collector/lib/http-client.ts` (browser-like User-Agent: Chrome/140)

**Font CDN:**
- Google Fonts - Served via Next.js `next/font/google` integration
  - Fonts: Geist and Geist_Mono
  - Usage: `next/app/layout.tsx`
  - No API key required; loaded at build time by Next.js

## Data Storage

**Databases:**
- None. No database used.

**Content Store (Filesystem):**
- Markdown files in `content/` directory at repository root
  - One `.md` file per collected article
  - Frontmatter fields: `id`, `title`, `url`, `source`, `published_at`, `collected_at`, `summary`, `tags`, `thumbnail_url`
  - Filename pattern: `YYYY-MM-DD-{slug}--{id-prefix}.md` (e.g., `content/2026-04-20-aws-amazon-web-services--3cip7v.md`)
  - Read by: `next/lib/articles.ts` (`FsArticleRepository`)
  - Written by: `next/scripts/collector/lib/markdown-writer.ts`
  - `CONTENT_DIR` env var overrides default resolution logic in `next/lib/articles.ts`

**Run Result JSON:**
- `next/collector-result.json` - Written after each collector run by `JobSummaryReporter`
  - Schema defined in `next/scripts/collector/lib/job-summary-reporter.ts`
  - Also uploaded as GitHub Actions artifact (30-day retention)

**File Storage:**
- Local filesystem only; no cloud object storage

**Caching:**
- None (no Redis, Memcached, or CDN cache configuration detected)

## Authentication & Identity

**Auth Provider:**
- None. The site has no user authentication.

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, or similar)

**Logs:**
- Structured console logging via `DefaultLogger` (`next/scripts/collector/logger.ts`)
  - Format: `[LEVEL][source] message {...meta}` written to stdout/stderr
  - Severity levels: `info`, `warn`, `error`
  - Used only in the collector script; no application-level logging in the Next.js frontend

**CI Job Summaries:**
- `JobSummaryReporter` appends Markdown summary to `$GITHUB_STEP_SUMMARY` when env var is set
  - Implementation: `next/scripts/collector/lib/job-summary-reporter.ts`

**Secret Scanning:**
- Gitleaks scans repository on every CI run (`.github/workflows/ci.yml`, `gitleaks/gitleaks-action@v2`)

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured; no Vercel, Netlify, or server config files detected

**CI Pipeline:**
- GitHub Actions
  - `ci.yml`: Runs on push to `main` and PRs
    - Jobs: `static-checks` (lint + typecheck + unit tests), `build`, `e2e` (Playwright), `gitleaks`, `npm-audit`
    - Node version from `.nvmrc`, npm cache keyed to `next/package-lock.json`
  - `collect.yml`: Scheduled daily at `0 22 * * *` UTC (07:00 JST) + manual dispatch
    - Runs collector script, commits changed `content/` files to `main`
    - Push uses default `GITHUB_TOKEN` with `contents: write` permission

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None (collector fetches data via HTTP GET; no webhook notifications sent)

## Environment Configuration

**Required env vars:**
- None strictly required; all defaults are hardcoded

**Optional env vars:**
- `CONTENT_DIR` - Override content directory path (used in `next/lib/articles.ts`)
- `GITHUB_STEP_SUMMARY` - GitHub Actions-injected path for CI job summary Markdown output
- `CI` - Standard CI flag affecting Playwright config (retries, workers, reporter)

**Secrets location:**
- No secrets in use. All external services (RSS feeds, Google News, Togetter) are public and unauthenticated.
- Gitleaks enforces no accidental secret commits via CI.

---

*Integration audit: 2026-05-30*
