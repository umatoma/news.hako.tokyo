# コーディング規約

**分析日:** 2026-05-30

## 命名パターン

**ファイル:**
- React コンポーネント: kebab-case（例: `article-list-item.tsx`, `source-badge.tsx`）
- ライブラリ・ユーティリティ: kebab-case（例: `articles.ts`, `http-client.ts`, `url-normalize.ts`）
- テストファイル: `{対象名}.test.ts`（ユニット）、`{対象名}.pbt.test.ts`（プロパティベース）
- E2E テスト: `{対象名}.spec.ts`

**関数・変数:**
- 関数名: camelCase（例: `formatPublishedAt`, `sortArticlesForDisplay`, `filterArticlesWithinDays`）
- 変数名: camelCase（例: `contentDir`, `fileReader`, `startedAtMs`）
- 定数（モジュールレベルの不変値）: UPPER_SNAKE_CASE（例: `MILLIS_PER_DAY`, `DEFAULT_TIMEOUT_MS`, `FILENAME_DATE_PREFIX`, `CONTENT_DIR`）
- 読み取り専用オブジェクト型定数: UPPER_SNAKE_CASE（例: `SOURCE_LABEL`, `ARTICLE_SOURCES`）

**型:**
- インターフェース: PascalCase + 末尾に `I` を付けない（例: `FileReader`, `HttpClient`, `Logger`, `PageStats`）
- クラス: PascalCase（例: `FsArticleRepository`, `DefaultHttpClient`, `DefaultLogger`, `CollectorRunner`）
- 型エイリアス: PascalCase（例: `SourceId`, `LogLevel`, `Clock`）
- Zod スキーマ: PascalCase + `Schema` サフィックス（例: `ArticleSchema`, `SourceIdSchema`）

**React コンポーネント:**
- コンポーネント関数: PascalCase（例: `ArticleListItem`, `SourceBadge`, `Header`）
- Props インターフェース: `{コンポーネント名}Props`（例: `ArticleListItemProps`, `HeaderProps`）

**クラス依存性注入パターン:**
- 依存オブジェクトをまとめる型: `{クラス名}Deps`（例: `CollectorRunnerDeps`, `ZennRssFetcherDeps`, `LoggerDeps`）
- コンストラクタ引数: `deps` という名前に統一

## コードスタイル

**フォーマッター:**
- 設定ファイルは未検出（Next.js デフォルト準拠と推定）
- インデント: スペース 2 文字
- 文字列リテラル: ダブルクォート

**リンター:**
- ESLint 9 + `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- 設定ファイル: `next/eslint.config.mjs`
- CommonJS スクリプト（`scripts/collector/compose-commit-message.cjs`）は ignore 対象

**TypeScript 設定:**
- `strict: true`（全厳格オプション有効）
- `target: ES2017`
- `module: esnext`, `moduleResolution: bundler`
- パスエイリアス: `@/*` → プロジェクトルートからの相対パス

## import の書き方

**順序（昇順）:**
1. Node.js 組み込みモジュール（`node:` プレフィックス付き）
2. サードパーティライブラリ
3. `@/` エイリアス（プロジェクト内絶対パス）
4. 相対パス（`./`, `../`）

**型 import:**
- 型のみを import する場合は必ず `import type` を使用
- 値と型を混在させる場合も `import type` で分離する（例: `runner.ts` では型 import を先にまとめ、値 import を後に置く）

**パスエイリアス:**
- `@/*`: `next/` ディレクトリ以下のすべてのファイルに使用可能（`tsconfig.json` の `paths` で定義）

```typescript
// 正しい import 順序の例
import path from "node:path";

import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import { ArticleSchema } from "@/lib/article";
import type { Article } from "@/lib/article";

import { SlugBuilder } from "../lib/slug-builder";
import { InMemoryFileSystem } from "./in-memory-file-system";
```

## エラーハンドリング

**パターン:**
- バリデーションには zod を使用し、`schema.parse()` によりランタイムで型を保証する
- エラーをキャッチする際は `err instanceof Error ? err.message : String(err)` でメッセージを取り出す
- サービス層（`SourceFetcher` 実装）では例外を `logger.warn` でログし処理を継続する
- 致命的なエラー（フロントマター不正など）は `throw new Error(contextualMessage)` で上位に伝播させる

```typescript
// エラーメッセージ取り出しのパターン（rss-mapping.ts から）
function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// バリデーションエラーの伝播パターン（articles.ts から）
try {
  articles.push(fromFrontmatter(parsed.data));
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  throw new Error(`Invalid frontmatter in ${filePath}: ${message}`);
}
```

## ログ

**フレームワーク:** カスタム `Logger` インターフェース（`next/scripts/collector/logger.ts`）

**パターン:**
- `logger.info / warn / error(source, message, context?)` の形式で呼び出す
- `source` は `SourceId`（`"zenn"` 等）または `"collector"` を使用
- `context` はキーバリューのプレーンオブジェクト（例: `{ url, status, count }`）
- ログ出力前に `SecretScrubber` でシークレット情報を自動マスク

```typescript
// ログ呼び出しパターン
logger.info("collector", "start");
logger.warn(this.source, "non-2xx response", { url, status: response.status });
logger.error(source, "fetch failed", { error: message });
```

## コメント

**コメントを書くタイミング:**
- 非自明なビジネスロジックに対してインラインコメントを使用
- TODOコメントは存在しない（コードベース全体で未検出）

**例:**
```typescript
// Deduplicator only inspects URL, so a placeholder collectedAt is fine.
const placeholder = "1970-01-01T00:00:00+00:00";
```

## 関数設計

**サイズ・責務:**
- 関数は単一の責務を持つ
- 純粋関数（副作用なし）を優先し、副作用はクラスのメソッドに閉じ込める

**パラメータ:**
- 依存を多く持つクラスのコンストラクタは `deps` オブジェクト一つで受け取る
- オプション引数にはデフォルト値を設定する（例: `now: Date = new Date()`）

**戻り値:**
- 変換系関数は元の配列を変異させない（`[...input].sort(...)` パターン）
- 空の結果には空配列 `[]` を返す（null / undefined を使わない）

## モジュール設計

**エクスポート:**
- Named export のみ使用（default export を避ける）
- ただし Next.js App Router の Page コンポーネントは default export（フレームワーク要求）

**インターフェース分離:**
- `FileReader`（読み取り専用）と `FileSystem`（読み書き）を別インターフェースで定義
  - `next/lib/articles.ts`: `FileReader`
  - `next/scripts/collector/lib/file-system.ts`: `FileReader` を継承した `FileSystem`
- `HttpClient` インターフェースを定義し、本番実装 (`DefaultHttpClient`) とテスト用 (`RecordingHttpClient`) を差し替え可能にする

**シングルトン（モジュールレベルのインスタンス）:**
- `defaultHttpClient` (`http-client.ts`)、`defaultFileSystem` (`file-system.ts`)、`articleRepository` (`articles.ts`) はモジュールレベルで定数として公開する

**Zod スキーマ駆動の型定義:**
```typescript
// スキーマを定義して型を推論させる
export const ArticleSchema = z.object({ ... });
export type Article = z.infer<typeof ArticleSchema>;
```

---

*規約分析: 2026-05-30*
