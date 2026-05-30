# Technology Stack

**Analysis Date:** 2026-05-30

## Languages

**Primary:**
- TypeScript 5.x - All application code (`next/app/`, `next/lib/`, `next/components/`, `next/scripts/`, `next/config/`)

**Secondary:**
- CSS - Global styles (`next/app/globals.css`), Tailwind utility classes in components
- CommonJS JavaScript - Single standalone script (`next/scripts/collector/compose-commit-message.cjs`) intentionally excluded from ESLint TypeScript rules

## Runtime

**Environment:**
- Node.js v24.13.1 (pinned via `.nvmrc` at repo root)

**Package Manager:**
- npm 11.8.0
- Lockfile: present (`next/package-lock.json`)

## Frameworks

**Core:**
- Next.js 16.2.4 - Full-stack React framework, App Router, server components (`next/app/`)
- React 19.2.4 - UI component library (`next/components/`)
- React DOM 19.2.4 - DOM rendering

**CSS:**
- Tailwind CSS 4.x - Utility-first CSS (`next/postcss.config.mjs`, `@tailwindcss/postcss` plugin)
- PostCSS - CSS processing pipeline (`next/postcss.config.mjs`)

**Testing:**
- Vitest 2.1.8 - Unit and property-based test runner (`next/vitest.config.ts`)
- Playwright 1.48.x - E2E browser testing (`next/playwright.config.ts`)

**Build/Dev:**
- tsx 4.19.2 - TypeScript execution for collector script (`npm run collect` → `tsx scripts/collector/index.ts`)
- ESLint 9.x + eslint-config-next 16.2.4 - Linting (`next/eslint.config.mjs`)
- TypeScript compiler (tsc) - Type checking only (`noEmit: true`)

## Key Dependencies

**Critical:**
- `next` 16.2.4 - Application framework; note: this version has breaking changes vs. prior versions per `next/AGENTS.md`
- `react` / `react-dom` 19.2.4 - Required for all UI rendering
- `zod` 3.23.8 - Runtime schema validation for `Article`, `ArticleFrontmatter`, and all source config types (`next/lib/article.ts`, `next/config/sources.ts`)
- `gray-matter` 4.0.3 - Parses YAML frontmatter from content Markdown files (`next/lib/articles.ts`)

**Infrastructure (collector script):**
- `rss-parser` 3.13.0 - Parses RSS/Atom feeds from Zenn, Hatena, Google News (`next/scripts/collector/sources/rss-mapping.ts`)
- `cheerio` 1.0.0 - HTML scraping for Togetter category pages (`next/scripts/collector/sources/togetter-scraper.ts`)

**Dev/Testing:**
- `fast-check` 3.23.1 - Property-based testing (used in `*.pbt.test.ts` files throughout `next/scripts/collector/test/` and `next/lib/`)
- `@playwright/test` 1.48.x - E2E tests (`next/e2e/`)

## Configuration

**Environment:**
- No `.env` files present in repository
- `CONTENT_DIR` env var: overrides the default content directory path resolved in `next/lib/articles.ts`
- `GITHUB_STEP_SUMMARY` env var: GitHub Actions-injected path for writing job summaries, consumed in `next/scripts/collector/index.ts`
- `CI` env var: standard CI flag used by Playwright and ESLint config

**Build:**
- `next/next.config.ts` - Minimal Next.js config (no custom options set)
- `next/tsconfig.json` - TypeScript strict mode, `ES2017` target, path alias `@/*` maps to `next/`
- `next/postcss.config.mjs` - PostCSS with `@tailwindcss/postcss` plugin
- `next/vitest.config.ts` - Vitest with `node` environment, includes all `**/*.test.ts`
- `next/playwright.config.ts` - Playwright with Chromium only, `baseURL: http://localhost:3000`
- `next/eslint.config.mjs` - ESLint using Next.js core-web-vitals + TypeScript presets

## Platform Requirements

**Development:**
- Node.js v24.13.1 (see `.nvmrc`)
- npm for dependency management
- Chromium installation required for E2E tests (`npm run test:e2e:install`)

**Production:**
- Deployment target not explicitly configured; Next.js server deployment assumed
- GitHub Actions handles automated collection and CI (see `.github/workflows/`)
- Content stored as Markdown files in `content/` directory at repo root (filesystem-based, no database)

---

*Stack analysis: 2026-05-30*
