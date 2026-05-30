# Codebase Structure

**Analysis Date:** 2026-05-30

## Directory Layout

```
news.hako.tokyo/          # Repo root
├── content/              # Article data store — flat .md files (~878 files)
├── next/                 # All application code (Next.js + collector)
│   ├── app/              # Next.js App Router pages and layout
│   ├── components/       # React UI components
│   ├── config/           # Static source configuration (typed, Zod-validated)
│   ├── e2e/              # Playwright end-to-end tests
│   ├── lib/              # Shared domain types and repository
│   ├── public/           # Static assets served by Next.js
│   ├── scripts/
│   │   └── collector/    # News collector CLI script
│   │       ├── lib/      # Collector infrastructure (HTTP, FS, slug, dedup, etc.)
│   │       ├── sources/  # Per-source fetcher implementations
│   │       └── test/     # Collector unit/integration tests + test doubles
│   ├── next.config.ts    # Next.js config
│   ├── tsconfig.json     # TypeScript config (path alias @/* → next/*)
│   ├── vitest.config.ts  # Vitest config
│   ├── playwright.config.ts  # Playwright config
│   └── package.json      # npm scripts and dependencies
├── specs/                # SpecKit feature specifications
├── aidlc-docs/           # AI-assisted development lifecycle docs
├── .github/
│   └── workflows/
│       ├── ci.yml        # Lint + type-check + test + build + e2e
│       └── collect.yml   # Nightly collector cron + commit
├── .claude/              # Claude/GSD tooling (skills, agents, commands)
├── .planning/            # GSD planning artefacts
│   └── codebase/         # Codebase map documents (this directory)
├── .specify/             # SpecKit specification workflows
├── .aidlc-rule-details/  # AI development rules
├── .nvmrc                # Node version pin
├── CLAUDE.md             # Root-level Claude instructions
└── README.md             # Project overview
```

## Directory Purposes

**`content/`:**
- Purpose: Persistent article data store. Every collected article is a single `.md` file.
- Contains: Flat collection of Markdown files with YAML frontmatter (`id`, `title`, `url`, `source`, `published_at`, `collected_at`, `summary`, `tags`, `thumbnail_url`)
- Key files: Any file matching `YYYY-MM-DD-<slug>--<id>.md`
- Generated: Yes (by collector). Do not edit manually.
- Committed: Yes — this is the data layer committed to git by the GitHub Actions cron.

**`next/app/`:**
- Purpose: Next.js App Router root — pages and layout
- Contains: `layout.tsx` (HTML shell + fonts), `page.tsx` (home page Server Component), `globals.css`, `favicon.ico`
- Key files: `next/app/page.tsx`, `next/app/layout.tsx`

**`next/components/`:**
- Purpose: Reusable React UI components (all server-side, no client directives)
- Contains: `article-list.tsx`, `article-list-item.tsx`, `header.tsx`, `footer.tsx`, `empty-state.tsx`, `source-badge.tsx`

**`next/config/`:**
- Purpose: Static runtime configuration for news sources
- Contains: `sources.ts` — Zod-validated config object with enabled flags, feed URLs, and per-source limits
- Key files: `next/config/sources.ts`

**`next/lib/`:**
- Purpose: Domain types and the article repository (shared between app and collector via `@/lib/`)
- Contains: `article.ts` (core `Article` type + Zod schemas), `articles.ts` (`FsArticleRepository`, display helpers, `ArticleListItemView`)
- Key files: `next/lib/article.ts`, `next/lib/articles.ts`

**`next/scripts/collector/`:**
- Purpose: Standalone Node.js CLI that fetches news and writes to `content/`
- Key files: `index.ts` (entry), `builder.ts` (DI wiring), `runner.ts` (orchestrator), `logger.ts`

**`next/scripts/collector/lib/`:**
- Purpose: Collector infrastructure abstractions (all interface-driven for testability)
- Contains: `article-id.ts`, `clock.ts`, `deduplicator.ts`, `file-system.ts`, `http-client.ts`, `job-summary-reporter.ts`, `markdown-writer.ts`, `secret-scrubber.ts`, `slug-builder.ts`, `url-normalize.ts`

**`next/scripts/collector/sources/`:**
- Purpose: One file per news source; each implements `SourceFetcher<TConfig>`
- Contains: `zenn-rss-fetcher.ts`, `hatena-rss-fetcher.ts`, `google-news-rss-fetcher.ts`, `togetter-scraper.ts`, `rss-mapping.ts` (shared RSS parser), `source-fetcher.ts` (interface)

**`next/scripts/collector/test/`:**
- Purpose: Vitest unit/integration tests for the collector, plus test doubles
- Contains: Test files (`*.test.ts`, `*.pbt.test.ts`), test double implementations (`in-memory-file-system.ts`, `recording-http-client.ts`), generators (`generators/`)

**`next/e2e/`:**
- Purpose: Playwright end-to-end browser tests
- Contains: `home.spec.ts`

**`specs/`:**
- Purpose: SpecKit feature specification documents
- Contains: One subdirectory per spec (e.g., `specs/001-browser-user-agent/`)

## Key File Locations

**Entry Points:**
- `next/scripts/collector/index.ts`: Collector CLI entry point
- `next/app/page.tsx`: Home page (Next.js Server Component)
- `next/app/layout.tsx`: Root layout

**Configuration:**
- `next/config/sources.ts`: Source-specific fetch configuration (feed URLs, limits, enabled flags)
- `next/next.config.ts`: Next.js config (currently minimal)
- `next/tsconfig.json`: TypeScript config; defines `@/*` → `./` path alias
- `next/vitest.config.ts`: Vitest test runner config
- `next/playwright.config.ts`: Playwright E2E config
- `.nvmrc`: Node.js version

**Core Domain:**
- `next/lib/article.ts`: `Article` type, `ArticleSchema`, `ArticleFrontmatterSchema`, serialisation helpers
- `next/lib/articles.ts`: `FsArticleRepository`, view model helpers, display formatting

**CI/CD:**
- `.github/workflows/ci.yml`: Static checks, build, E2E, secret scan, npm audit
- `.github/workflows/collect.yml`: Nightly collector run + git commit

## Naming Conventions

**Files:**
- TypeScript source: `kebab-case.ts` (e.g., `article-list-item.tsx`, `http-client.ts`)
- Test files: `<subject>.test.ts` for unit tests, `<subject>.pbt.test.ts` for property-based tests
- Test doubles: descriptive names in `test/` directory (e.g., `in-memory-file-system.ts`, `recording-http-client.ts`)

**Content files:**
- Pattern: `YYYY-MM-DD-<ascii-slug>--<6-char-id>.md`
- Example: `2026-04-23-ai-ai-bloggoogle--2wqz9b.md`
- Pure-id fallback (non-ASCII titles): `YYYY-MM-DD-<8-char-id>.md`

**Directories:**
- All `kebab-case`

**TypeScript exports:**
- Classes: `PascalCase` (e.g., `CollectorRunner`, `FsArticleRepository`)
- Interfaces: `PascalCase` with descriptive name (e.g., `SourceFetcher`, `HttpClient`)
- Functions: `camelCase` (e.g., `buildRunner`, `fromFrontmatter`, `sortArticlesForDisplay`)
- Zod schemas: `<Type>Schema` (e.g., `ArticleSchema`, `SourceConfigSchema`)
- Types inferred from Zod: matching name without `Schema` (e.g., `Article`, `SourceConfig`)

## Where to Add New Code

**New news source:**
- Implement `SourceFetcher<TConfig>` in: `next/scripts/collector/sources/<name>-fetcher.ts` (or `-scraper.ts`)
- Add config schema and type to: `next/config/sources.ts`
- Register in wiring: `next/scripts/collector/builder.ts` (`fetchers` object)
- Register in orchestrator: `next/scripts/collector/runner.ts` (`ordered` array, `perSource` initial state)
- Add source ID to: `next/lib/article.ts` (`ARTICLE_SOURCES` constant)
- Add source label to: `next/lib/articles.ts` (`SOURCE_LABEL` map)
- Tests: `next/scripts/collector/test/sources/<name>-fetcher.test.ts`

**New UI component:**
- Implementation: `next/components/<name>.tsx`
- No barrel `index.ts` — import directly by file path

**New shared utility:**
- Collector-only utilities: `next/scripts/collector/lib/<name>.ts`
- Web/domain utilities: `next/lib/<name>.ts`

**New page:**
- Add file under: `next/app/<route>/page.tsx` (Next.js App Router convention)

**Tests:**
- Unit tests for lib/components: co-located in `next/lib/<name>.test.ts` or `next/scripts/collector/test/<name>.test.ts`
- E2E tests: `next/e2e/<name>.spec.ts`

## Special Directories

**`content/`:**
- Purpose: Flat article data store — one `.md` per article
- Generated: Yes (by collector script / GitHub Actions)
- Committed: Yes — this IS the database

**`next/.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No (gitignored)

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents consumed by `/gsd-plan-phase` and `/gsd-execute-phase`
- Generated: Yes (by `/gsd-map-codebase`)
- Committed: Optionally — check team convention

**`.claude/`:**
- Purpose: Claude Code / GSD tooling (skills, agents, slash commands, hooks)
- Generated: Yes (by GSD installer)
- Committed: Yes

---

*Structure analysis: 2026-05-30*
