# Coding Conventions

**Analysis Date:** 2026-05-30

## Naming Patterns

**Files:**
- React components: kebab-case `.tsx` — e.g., `article-list-item.tsx`, `source-badge.tsx`
- Library modules: kebab-case `.ts` — e.g., `url-normalize.ts`, `slug-builder.ts`
- Test files: co-located with source suffix `.test.ts` — e.g., `deduplicator.test.ts`
- Property-based test files: `.pbt.test.ts` suffix — e.g., `articles.pbt.test.ts`
- Test generators: `*.gen.ts` suffix under `test/generators/` — e.g., `article.gen.ts`
- Test doubles: descriptive names under `test/` — e.g., `recording-http-client.ts`, `in-memory-file-system.ts`

**Functions:**
- camelCase for all functions and methods: `formatPublishedAt`, `normalizeUrlForDedup`, `generateArticleId`
- Factory functions (for test fixtures): camelCase prefixed with `make` or `render` — e.g., `makeArticle`, `renderRssXml`
- Async operations: async/await throughout, no Promise chains

**Variables:**
- camelCase for local variables: `thresholdDate`, `allFetched`, `startedAtMs`
- UPPER_SNAKE_CASE for module-level constants: `DISPLAY_WINDOW_DAYS`, `MAX_COLLISION_RETRY`, `CONTENT_DIR`, `MILLIS_PER_DAY`
- Readonly arrays typed as `ReadonlyArray<T>` at function boundaries

**Types:**
- PascalCase for interfaces and type aliases: `ArticleListItemView`, `CollectorRunnerDeps`, `WriteResult`
- `Schema` suffix for Zod schemas: `ArticleSchema`, `ZennConfigSchema`, `SourceConfigSchema`
- `Deps` suffix for dependency injection interfaces: `ZennRssFetcherDeps`, `MarkdownWriterDeps`, `LoggerDeps`
- Types inferred from Zod schemas with `z.infer<typeof XxxSchema>`: `type Article = z.infer<typeof ArticleSchema>`
- `Config` suffix for source configuration types: `ZennConfig`, `HatenaConfig`, `GoogleNewsConfig`

**Classes:**
- PascalCase: `DefaultHttpClient`, `FsArticleRepository`, `CollectorRunner`, `SlugBuilder`
- `Default` prefix for concrete implementations of interfaces: `DefaultHttpClient`, `DefaultFileSystem`, `DefaultLogger`
- `InMemory` prefix for in-memory test doubles: `InMemoryFileSystem`, `InMemoryFileReader`
- `Recording` prefix for recording/spy test doubles: `RecordingHttpClient`

## Code Style

**Formatting:**
- No Prettier config found; formatting appears to be handled via ESLint with Next.js rules (`eslint-config-next`)
- Single quotes for imports
- Trailing commas in multi-line structures
- Semicolons present

**Linting:**
- ESLint v9 flat config at `next/eslint.config.mjs`
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Scripts using CommonJS `require()` are explicitly excluded from linting: `scripts/collector/compose-commit-message.cjs`

**TypeScript:**
- Strict mode enabled (`"strict": true` in `next/tsconfig.json`)
- `noEmit: true` — TypeScript used for type-checking only, not transpilation
- Path alias `@/*` maps to `next/` root — use `@/lib/article`, `@/config/sources` for root-relative imports

## Import Organization

**Order (enforced by ESLint Next.js rules):**
1. Node.js built-ins with `node:` prefix — e.g., `import path from "node:path"`, `import { createHash } from "node:crypto"`
2. External packages — e.g., `import matter from "gray-matter"`, `import * as fc from "fast-check"`
3. Internal `@/` alias imports (cross-module) — e.g., `import type { Article } from "@/lib/article"`
4. Relative imports within the same module tree — e.g., `import { Deduplicator } from "../lib/deduplicator"`

**Type-only imports:**
- Always use `import type { ... }` for type-only imports — this pattern is used consistently throughout:
  ```typescript
  import type { Article } from "@/lib/article";
  import type { HttpClient } from "../lib/http-client";
  ```

**Path Aliases:**
- `@/*` maps to `next/` root (defined in `next/tsconfig.json` and `next/vitest.config.ts`)
- Use `@/lib/article` not relative `../../lib/article` when crossing into root-level modules

## Error Handling

**Patterns:**
- Throw `new Error(message)` with descriptive messages including context — e.g., `throw new Error(\`Invalid frontmatter in ${filePath}: ${message}\`)`
- Catch `err`, extract message with helper: `const message = err instanceof Error ? err.message : String(err)`
- In source fetchers: catch per-feed errors and log as `warn`, continue processing remaining feeds
- In `CollectorRunner`: catch per-source failures, record in `failedSources`, continue to next source
- Zod schema validation: call `.parse()` which throws on invalid data — caller wraps in try/catch as needed
- Guard clauses before method calls: `if (!this.initialized) throw new Error("...")`
- Filesystem `exists()` checks return `false` via try/catch on `fs.access()`, not by checking error codes

**Error Message Convention:**
```typescript
// Extraction helper (used in runner.ts and source fetchers):
const message = err instanceof Error ? err.message : String(err);
```

## Logging

**Framework:** Custom `Logger` interface (`next/scripts/collector/logger.ts`) backed by `DefaultLogger` class.

**Interface:**
```typescript
interface Logger {
  info(source: LogSource, message: string, context?: LogContext): void;
  warn(source: LogSource, message: string, context?: LogContext): void;
  error(source: LogSource, message: string, context?: LogContext): void;
  getReports(): ReadonlyArray<ReportEntry>;
}
```

**Patterns:**
- Always pass `source` as first argument — either a `SourceId` (`"zenn"`, `"hatena"`, etc.) or `"collector"` for orchestration-level messages
- Pass structured context as the optional third argument: `logger.info("collector", "dedup", { knownUrls: count })`
- Context values are key-value pairs; strings with spaces are JSON-quoted automatically
- Secret scrubbing is applied automatically by `DefaultLogger` via `SecretScrubber`
- In tests, silence logger output with `new DefaultLogger({ out: () => undefined })`

## Comments

**When to Comment:**
- Inline comments for non-obvious implementation choices: `// Deduplicator only inspects URL, so a placeholder collectedAt is fine.`
- Comments cross-reference spec IDs in test descriptions: `"sends a browser-like User-Agent on every request (FR-001/FR-002)"`
- Regression guards noted in test descriptions: `"does not send the legacy collector User-Agent (regression guard)"`

**JSDoc/TSDoc:**
- Not used — no JSDoc comments found in the codebase; types convey intent instead

## Function Design

**Size:** Functions are kept small and single-purpose. Pure utility functions (e.g., `normalizeUrlForDedup`, `computeDateThreshold`, `filterFileNamesByDatePrefix`) have no side effects.

**Parameters:**
- Dependency injection via a single `deps` object for classes with multiple collaborators — e.g.:
  ```typescript
  export interface MarkdownWriterDeps {
    contentDir: string;
    fileSystem: FileSystem;
    slugBuilder: SlugBuilder;
  }
  export class MarkdownWriter {
    constructor(deps: MarkdownWriterDeps) { ... }
  }
  ```
- Pure functions take explicit parameters; optional `now: Date = new Date()` used for clock injection in pure functions

**Return Values:**
- Result objects for write operations: `{ written: number; skipped: number }`
- `ReadonlyArray<T>` for function parameters that must not be mutated
- Functions that filter arrays return new arrays and never mutate inputs (immutability is tested)
- Nullable values typed as `T | null`, never `undefined` for domain types

## Module Design

**Exports:**
- Named exports throughout — no default exports except for Next.js page/layout components (`export default function Home()`, `export default function RootLayout()`) and config objects (`export default sourceConfig`)
- Classes export their `Deps` interface alongside the class itself
- Zod schemas exported with their inferred types

**Barrel Files:** Not used — import directly from the source file

**Interface-First Design:**
- Collaborators are always typed to interfaces, never concrete classes:
  ```typescript
  // Correct — typed to interface
  private readonly fileSystem: FileSystem;
  // Not: DefaultFileSystem
  ```
- Production singletons exported as the interface type: `export const defaultHttpClient: HttpClient = new DefaultHttpClient()`

---

*Convention analysis: 2026-05-30*
