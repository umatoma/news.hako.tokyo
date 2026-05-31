<!-- refreshed: 2026-05-30 -->
# アーキテクチャ

**分析日:** 2026-05-30

## システム概要

このプロジェクトは**2つの独立したサブシステム**で構成される個人用ニュース集約サイトである。

```text
┌──────────────────────────────────────────────────────────────┐
│                    コレクター (Node.js スクリプト)             │
│   `next/scripts/collector/`                                   │
│                                                              │
│  SourceFetchers → CollectorRunner → MarkdownWriter           │
│  (Zenn/Hatena/GoogleNews/Togetter)  → Deduplicator           │
└───────────────────────────────┬──────────────────────────────┘
                                │ Markdownファイルを書き出す
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    content/ (ファイルストア)                   │
│   `content/YYYY-MM-DD-<slug>.md`                             │
│   各ファイルにフロントマター(YAML) + 本文                       │
└───────────────────────────────┬──────────────────────────────┘
                                │ ファイルシステムから読み込む
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    Next.js フロントエンド                      │
│   `next/app/` + `next/lib/` + `next/components/`             │
│                                                              │
│  FsArticleRepository → page.tsx (RSC) → React コンポーネント  │
└──────────────────────────────────────────────────────────────┘
```

## コンポーネントの責務

| コンポーネント | 責務 | ファイル |
|----------------|------|---------|
| `Article` (ドメインモデル) | 記事エンティティの型定義・バリデーション・シリアライズ | `next/lib/article.ts` |
| `FsArticleRepository` | Markdownファイルを読み込みArticleオブジェクトに変換するリポジトリ | `next/lib/articles.ts` |
| `CollectorRunner` | 全ソースを順次取得・重複排除・書き込みを統括するオーケストレーター | `next/scripts/collector/runner.ts` |
| `SourceFetcher` (各実装) | 各ニュースソースからFetchedArticleを取得するアダプター | `next/scripts/collector/sources/` |
| `Deduplicator` | 既存コンテンツとの重複チェック (URL正規化ベース) | `next/scripts/collector/lib/deduplicator.ts` |
| `MarkdownWriter` | ArticleをMarkdownファイルとして`content/`に書き出す | `next/scripts/collector/lib/markdown-writer.ts` |
| `page.tsx` (RSC) | データ取得・フィルタリング・ビュー変換を行うServer Component | `next/app/page.tsx` |
| UIコンポーネント群 | ステートレスな表示専用コンポーネント | `next/components/` |

## パターン概要

**全体:** コレクターと表示系を**ファイルシステム(content/)でつなぐパイプライン + 静的サイトジェネレーター相当**のアーキテクチャ。

**主な特徴:**
- Next.js App Router の Server Component (`page.tsx`) がデータ取得を担い、クライアント側JSは最小限
- コレクターはすべての依存関係をインターフェースで抽象化し、DI (Constructor Injection) によってテスト可能にしている
- `Article` ドメインモデルを `zod` スキーマで定義し、バリデーションと型安全を両立
- `content/` ディレクトリが2サブシステム間の唯一の結合点 (疎結合)

## レイヤー

**ドメインモデル層:**
- 目的: `Article` の型定義・バリデーション・フロントマター変換
- 場所: `next/lib/article.ts`
- 含むもの: `ArticleSchema`, `SourceId`, `toFrontmatter()`, `fromFrontmatter()`
- 依存先: `zod`
- 使用者: コレクター・フロントエンド双方

**リポジトリ層 (フロントエンド側):**
- 目的: `content/` からMarkdownを読み込み、`Article[]` を返す
- 場所: `next/lib/articles.ts`
- 含むもの: `FsArticleRepository`, `FileReader` インターフェース, フィルタリング/ソート/統計ヘルパー
- 依存先: `gray-matter`, `next/lib/article.ts`
- 使用者: `next/app/page.tsx`

**プレゼンテーション層 (フロントエンド側):**
- 目的: RSCによるデータ取得とUIレンダリング
- 場所: `next/app/page.tsx`, `next/components/`
- 含むもの: `ArticleListItemView` (ViewObject), Tailwind CSSスタイルのコンポーネント
- 依存先: `next/lib/articles.ts`
- 使用者: Next.js ルーター

**コレクタービジネスロジック層:**
- 目的: 全ソース取得・重複排除・書き込みのオーケストレーション
- 場所: `next/scripts/collector/runner.ts`
- 含むもの: `CollectorRunner`, `CollectorRunnerDeps` (全依存のDIコンテナ)
- 依存先: Fetcher群, `Deduplicator`, `MarkdownWriter`, `Logger`, `Clock`
- 使用者: `next/scripts/collector/index.ts` (エントリポイント)

**ソースアダプター層:**
- 目的: 各ニュースソース固有のHTTP取得・パース処理
- 場所: `next/scripts/collector/sources/`
- 含むもの: `ZennRssFetcher`, `HatenaRssFetcher`, `GoogleNewsRssFetcher`, `TogetterScraper`
- 依存先: `HttpClient`, `Logger`, `Clock`, `rss-parser`, `cheerio`
- 使用者: `CollectorRunner`

**インフラ抽象化層 (コレクター):**
- 目的: IO依存を差し替え可能なインターフェースで包む
- 場所: `next/scripts/collector/lib/`
- 含むもの: `HttpClient`, `FileSystem`, `Clock`, `Deduplicator`, `MarkdownWriter`, `SlugBuilder`, `Logger`
- 使用者: `builder.ts` でインスタンス化

## データフロー

### コレクター実行パス (GitHub Actions スケジュール)

1. `collect.yml` → `npm run collect` → `next/scripts/collector/index.ts`
2. `buildRunner()` (`next/scripts/collector/builder.ts`) がすべての依存をDIで組み立て
3. `CollectorRunner.run()` (`next/scripts/collector/runner.ts`) が各ソースを順次取得
4. 各 `SourceFetcher.fetch()` → HTTP GET → RSS/HTMLパース → `FetchedArticle[]`
5. `Deduplicator.filterNew()` → 既存URLとの差分計算
6. `MarkdownWriter.write()` → `content/YYYY-MM-DD-<slug>.md` にフロントマター付きMarkdownを書き出し
7. `JobSummaryReporter.emit()` → `collector-result.json` + GitHub Step Summary を出力
8. GitHub Actions が `git add content/ && git commit && git push`

### フロントエンド表示パス (Next.js RSC)

1. ブラウザリクエスト → `next/app/page.tsx` (Server Component)
2. `articleRepository.getArticlesPublishedSince(thresholdDate)` → `FsArticleRepository`
3. `fs.readdir(content/)` → ファイル名によるプレフィルタ → `gray-matter` でパース → `fromFrontmatter()` で `Article[]`
4. `filterArticlesWithinDays()` → 直近3日に絞り込み
5. `sortArticlesForDisplay()` → `publishedAt` 降順ソート
6. `toListItemView()` → `ArticleListItemView[]` に変換
7. `<ArticleList>` → `<ArticleListItem>` → HTML出力

**状態管理:**
- サーバー側: RSCがリクエスト毎にファイルを読み直す (メモリキャッシュなし)
- クライアント側: ステートなし (純粋な表示のみ)

## 主な抽象化

**`SourceFetcher<TConfig>` インターフェース:**
- 目的: ソース種別を問わない統一的な取得インターフェース
- 実装例: `next/scripts/collector/sources/zenn-rss-fetcher.ts`, `togetter-scraper.ts`
- パターン: インターフェース + DI

**`FileSystem` / `FileReader` インターフェース:**
- 目的: Node.js `fs` モジュールをラップしてテスト用インメモリ実装に差し替え可能にする
- 実装: `next/scripts/collector/lib/file-system.ts`, `next/lib/articles.ts`
- テスト用: `next/scripts/collector/test/in-memory-file-system.ts`

**`HttpClient` インターフェース:**
- 目的: `fetch` をラップし、テスト用の録音/再生モックに差し替え可能にする
- 実装: `next/scripts/collector/lib/http-client.ts`
- テスト用: `next/scripts/collector/test/recording-http-client.ts`

**`Clock` 型:**
- 目的: `new Date()` の依存を注入可能にし、テストの時刻制御を可能にする
- 実装: `next/scripts/collector/lib/clock.ts` (`type Clock = () => Date`)

**`ArticleRepository` インターフェース:**
- 目的: フロントエンド側のファイルアクセスをテスト可能に抽象化
- 実装: `FsArticleRepository` (`next/lib/articles.ts`)

## エントリポイント

**コレクター:**
- 場所: `next/scripts/collector/index.ts`
- トリガー: `npm run collect` / GitHub Actions `collect.yml`
- 責務: `buildRunner()` を呼び出し、`runner.run()` を実行し、エラー時に `process.exit(1)`

**フロントエンド:**
- 場所: `next/app/page.tsx`
- トリガー: Next.js App Router のHTTPリクエスト
- 責務: データ取得・フィルタリング・コンポーネントへのprops注入

**レイアウト:**
- 場所: `next/app/layout.tsx`
- 責務: フォント設定 (Geist)、HTMLルート、メタデータ定義

## アーキテクチャ上の制約

- **ランタイム:** Node.js (コレクター: `tsx` で実行, フロントエンド: Next.js 16.2.4 / React 19)
- **グローバル状態:** `articleRepository` のシングルトン (`next/lib/articles.ts` 末尾)、`defaultFileSystem` / `defaultHttpClient` のモジュールレベル定数
- **結合点:** `content/` ディレクトリのみ。コレクターとフロントエンドはそれ以外の依存を持たない
- **スレッドモデル:** シングルスレッドイベントループ。コレクターは各ソースを**逐次**処理 (並列フェッチなし)
- **重複排除の精度:** URLの正規化 (`next/scripts/collector/lib/url-normalize.ts`) に依存。正規化ロジックが変わると既存記事が再収集される可能性あり

## アンチパターン

### `content/` を直接Gitにコミットする設計

**何が起きているか:** コレクターが収集した記事Markdownをリポジトリの `content/` ディレクトリに直接コミットしている。

**なぜそうなっているか:** 外部データベースを持たず、Gitをコンテンツストアとして使うシンプルな設計選択。記事の変更履歴がGitログに残る。

**注意点:** `content/` のファイル数が増えるにつれ、リポジトリサイズとクローン時間が増大する。現時点では意図的な設計。

## エラーハンドリング

**戦略:** フォルトトレランス (ソース単位でエラーを吸収)

**パターン:**
- `SourceFetcher` の各実装: 1つのフィードURL失敗時は `warn` ログを出してスキップし、次のURLを継続 (`try/catch` + `continue`)
- `CollectorRunner`: 1つのソース全体が失敗しても `failedSources` に記録して残りのソースを継続
- `MarkdownWriter.write()`: ファイル1件の書き込み失敗は `skipped` カウントに加算して継続
- フロントエンド: `fromFrontmatter()` のパース失敗は `throw new Error(...)` でサーバー起動エラーにエスカレーション

## 横断的関心事

**ロギング:** `Logger` インターフェース + `DefaultLogger` 実装 (`next/scripts/collector/logger.ts`)。`SecretScrubber` でログ内のシークレット文字列を自動マスク。フォーマット: `[LEVEL][source] message key=value`

**バリデーション:** `zod` スキーマによるランタイムバリデーション。`Article`, `SourceConfig` 等の入力境界で使用。

**認証:** なし (公開サイト)

---

*アーキテクチャ分析: 2026-05-30*
