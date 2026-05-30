# コーディング規約

**分析日:** 2026-05-30

## 命名規則

**ファイル名:**
- TypeScript ソースファイル: `kebab-case.ts` / `kebab-case.tsx`（例: `article-list-item.tsx`, `slug-builder.ts`）
- テストファイル: `{対象ファイル名}.test.ts`（例: `articles.test.ts`）
- プロパティベーステスト: `{対象ファイル名}.pbt.test.ts`（例: `articles.pbt.test.ts`）
- ジェネレータ: `{名前}.gen.ts`（例: `article.gen.ts`, `rss-item.gen.ts`）
- テスト用フェイク実装: `{名前}-{種別}.ts`（例: `in-memory-file-system.ts`, `recording-http-client.ts`）

**関数・変数:**
- キャメルケース: `formatPublishedAt`, `generateArticleId`, `filterArticlesWithinDays`
- 定数（モジュールスコープ）: `UPPER_SNAKE_CASE`（例: `MILLIS_PER_DAY`, `ARTICLE_SOURCES`, `SOURCE_LABEL`, `DEFAULT_TIMEOUT_MS`）

**クラス・インターフェース・型:**
- PascalCase: `ArticleSchema`, `FsArticleRepository`, `DefaultHttpClient`, `CollectorRunner`
- インターフェース名に `I` プレフィックスは使わない（例: `FileReader`, `HttpClient`, `Logger`）
- Deps サフィックスを依存オブジェクト型に使用: `MarkdownWriterDeps`, `DeduplicatorDeps`, `LoggerDeps`
- Zod スキーマには `Schema` サフィックス: `ArticleSchema`, `SourceConfigSchema`
- Zod スキーマから型を `z.infer<>` で導出: `export type Article = z.infer<typeof ArticleSchema>`

## コードスタイル

**フォーマット:**
- ESLint 使用: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`（設定: `next/eslint.config.mjs`）
- `prettier` の設定ファイルは存在しない（ESLint のみ）
- TypeScript strict モード有効（`next/tsconfig.json` の `"strict": true`）

**型注釈:**
- 値のインポートと型のインポートを分離: `import type { Article } from "@/lib/article"` + `import { fromFrontmatter } from "@/lib/article"`
- 読み取り専用コレクションには `ReadonlyArray<T>` を使用: `filterArticlesWithinDays(articles: ReadonlyArray<Article>, ...)`
- プライベートフィールドには `private readonly` を使用

## import の構成

**順序（ブランク行で区切る）:**
1. Node.js 組み込み（`node:` プレフィックス付き）: `import path from "node:path";`
2. 外部ライブラリ: `import matter from "gray-matter";`
3. プロジェクト内エイリアス（`@/` から始まる）: `import type { Article } from "@/lib/article";`
4. 相対パス（同一モジュール内）: `import { SlugBuilder } from "./slug-builder";`

**パスエイリアス:**
- `@/*` は `next/` ディレクトリルートを指す（`next/tsconfig.json` で定義）
- 例: `@/lib/article`, `@/config/sources`, `@/components/article-list`

## インターフェース設計（依存性注入）

**Deps パターン:**
クラスコンストラクタは単一の `Deps` インターフェースを受け取る。これによりテストでの差し替えが容易になる。

```typescript
// 実装例: next/scripts/collector/lib/markdown-writer.ts
export interface MarkdownWriterDeps {
  contentDir: string;
  fileSystem: FileSystem;
  slugBuilder: SlugBuilder;
}

export class MarkdownWriter {
  constructor(deps: MarkdownWriterDeps) { ... }
}
```

**デフォルト実装:**
モジュールレベルのシングルトンとして `default*` 名のインスタンスをエクスポート:
- `next/scripts/collector/lib/http-client.ts`: `export const defaultHttpClient: HttpClient = new DefaultHttpClient();`
- `next/scripts/collector/lib/file-system.ts`: `export const defaultFileSystem: FileSystem = new DefaultFileSystem();`
- `next/lib/articles.ts`: `export const articleRepository: ArticleRepository = new FsArticleRepository();`

## バリデーションパターン

**Zod を使用したスキーマ定義:**
入力データは必ず zod スキーマで検証する。

```typescript
// 実装例: next/lib/article.ts
export const ArticleSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  publishedAt: z.string().datetime({ offset: true }),
  ...
});
export type Article = z.infer<typeof ArticleSchema>;
```

スキーマは設定ファイル（`next/config/sources.ts`）でも同様に使用する。

## エラーハンドリング

**戦略:**
- I/O エラーは原則として呼び出し元に伝播させる（`throw`）
- 複数ソースの処理ループでは、1 ソースのエラーが他に影響しないよう `try/catch` で囲む（`next/scripts/collector/runner.ts`）
- ファイル存在確認に `try/catch` パターン使用（`DefaultFileSystem.exists`）

**エラーメッセージ:**
```typescript
// ファイルパスを含めた詳細なエラーメッセージ
throw new Error(`Invalid frontmatter in ${filePath}: ${message}`);

// 状態チェックエラー
throw new Error("Deduplicator must be initialized before filterNew()");
```

**`errorMessage` ヘルパー:**
- `next/scripts/collector/sources/rss-mapping.ts` に `errorMessage(err: unknown): string` 関数を定義
- `unknown` 型の例外を安全に文字列化

## ロギング

**Logger インターフェース:**
- `next/scripts/collector/logger.ts` に `Logger` インターフェースを定義
- `info`, `warn`, `error` の 3 レベル
- 構造化コンテキスト: `logger.info("collector", "dedup initialized", { knownUrls: 42 })`
- `DefaultLogger` はログ行をフォーマットして出力し、`getReports()` でログ一覧を取得可能

**シークレットのスクラビング:**
- `DefaultLogger` は内部で `SecretScrubber`（`next/scripts/collector/lib/secret-scrubber.ts`）を使用
- Bearer トークン・API キーなどをログに出力する前に `[REDACTED]` に置換

## React コンポーネント

**Props インターフェース:**
ファイル内のみで使用する場合は `export` しない:
```typescript
// 実装例: next/components/header.tsx
interface HeaderProps {
  stats: PageStats;
}
export function Header({ stats }: HeaderProps) { ... }
```

**データ取得:**
- Next.js の Server Component で直接 `async` 関数として実装（`next/app/page.tsx`）
- クライアントコンポーネントは存在しない（現時点では全て Server Component）

**テスト属性:**
E2E テスト用に `data-testid` 属性を付与:
- `data-testid="header-article-count"`
- `data-testid="footer-last-updated"`
- `data-testid="article-link"`

## モジュール構成

**エクスポートパターン:**
- named export を使用（default export は React コンポーネントと設定ファイルのみ）
- バレルファイル（`index.ts`）は使用しない

**定数の配置:**
モジュールスコープの定数は関数定義の上に配置:
```typescript
const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const FILENAME_DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})-/;
```

**イミュータビリティ:**
- 入力配列は変更しない（`[...articles].sort(...)`）
- クラスフィールドは `private readonly` または `readonly`

---

*規約分析日: 2026-05-30*
