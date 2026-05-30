<!-- refreshed: 2026-05-30 -->
# アーキテクチャ

**分析日:** 2026-05-30

## システム概要

```text
┌──────────────────────────────────────────────────────────────────┐
│                  GitHub Actions (collect.yml)                     │
│              毎日 UTC 22:00 にスケジュール実行                      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ npm run collect
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│              Collector スクリプト (Node.js / tsx)                  │
│   `next/scripts/collector/index.ts`                               │
│                                                                    │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │ ZennRssFetcher│ │HatenaRss     │ │ GoogleNewsRssFetcher /   │ │
│  │               │ │Fetcher       │ │ TogetterScraper          │ │
│  └───────┬───────┘ └──────┬───────┘ └───────────┬──────────────┘ │
│          └────────────────┼───────────────────────┘               │
│                           ▼                                        │
│              CollectorRunner (dedup → write)                       │
│              `next/scripts/collector/runner.ts`                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │ Markdown ファイル書き出し
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                  content/ ディレクトリ (git 管理)                   │
│  `content/YYYY-MM-DD-<slug>--<id6>.md`  (記事 1 件 = 1 ファイル)  │
└───────────────────────────┬──────────────────────────────────────┘
                            │ ファイルシステム読み取り (Next.js SSG)
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Next.js 16 フロントエンド                          │
│   `next/app/page.tsx`  (Server Component / SSG)                   │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │  Header      │  │  ArticleList │  │  Footer               │   │
│  │ (stats 表示) │  │  (一覧表示)  │  │ (最終更新日表示)      │   │
│  └──────────────┘  └──────────────┘  └───────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## コンポーネント責務

| コンポーネント | 責務 | ファイル |
|--------------|------|---------|
| Collector エントリポイント | 環境設定を解決し Runner を起動 | `next/scripts/collector/index.ts` |
| BuildRunner | 依存性の組み立て (DI ルート) | `next/scripts/collector/builder.ts` |
| CollectorRunner | ソース横断的なフェッチ・重複排除・書き出し制御 | `next/scripts/collector/runner.ts` |
| ZennRssFetcher / HatenaRssFetcher / GoogleNewsRssFetcher | RSS フィードの取得と記事マッピング | `next/scripts/collector/sources/` |
| TogetterScraper | HTML スクレイピングによる記事取得 | `next/scripts/collector/sources/togetter-scraper.ts` |
| Deduplicator | content/ を走査して既知 URL の Set を構築、重複をフィルタ | `next/scripts/collector/lib/deduplicator.ts` |
| MarkdownWriter | 記事を gray-matter frontmatter 付き Markdown に変換して保存 | `next/scripts/collector/lib/markdown-writer.ts` |
| SlugBuilder | 記事タイトルの ASCII 部分から URL-safe スラッグを生成 | `next/scripts/collector/lib/slug-builder.ts` |
| JobSummaryReporter | 実行結果を JSON と GitHub Actions ステップサマリに書き出し | `next/scripts/collector/lib/job-summary-reporter.ts` |
| FsArticleRepository | content/ を走査し gray-matter Markdown を Article[] に変換 | `next/lib/articles.ts` |
| Next.js Page (Home) | フィルタ・ソート・ビュー変換をサーバーサイドで実行 | `next/app/page.tsx` |
| Article* React コンポーネント | 記事一覧 UI | `next/components/` |

## パターン概要

**全体:** Git-as-Database + File-based Content Pattern

**主要な特徴:**
- データベースを持たず、`content/` ディレクトリ内の Markdown ファイルがデータストア
- Collector スクリプト (Node.js) と Web フロントエンド (Next.js) が同一リポジトリに共存
- フロントエンドは SSG (Static Site Generation) ── サーバーサイドのレンダリングを `npm run build` 時に解決
- Collector は GitHub Actions のスケジュール実行で毎日自動収集し、差分を git commit & push
- 依存性注入 (DI) パターンで全インフラ境界 (HTTP・ファイルシステム・クロック) がインタフェース抽象化されテスト可能

## レイヤー

**ドメインモデル層:**
- 目的: `Article` 型と `SourceId` の定義、frontmatter ↔ Article の変換
- 場所: `next/lib/article.ts`
- 含むもの: zod スキーマ、型定義、`toFrontmatter` / `fromFrontmatter`
- 依存先: zod のみ
- 利用元: Collector スクリプト、フロントエンド lib の両方

**ソース設定層:**
- 目的: 各ニュースソースの接続設定 (URL・件数上限など)
- 場所: `next/config/sources.ts`
- 含むもの: zod スキーマ、`SourceConfig` 型、実設定オブジェクト
- 依存先: zod のみ
- 利用元: Collector スクリプト

**Collector コア層:**
- 目的: フェッチ・重複排除・書き出しのオーケストレーション
- 場所: `next/scripts/collector/`
- 含むもの: `runner.ts`、`builder.ts`、`logger.ts`、`lib/`、`sources/`
- 依存先: ドメインモデル層、ソース設定層
- 利用元: GitHub Actions (CI/CD)

**リポジトリ層 (フロントエンド):**
- 目的: content/ ディレクトリを走査して Article[] を返す
- 場所: `next/lib/articles.ts`
- 含むもの: `FsArticleRepository`、フィルタ・ソート・ビュー変換ユーティリティ
- 依存先: ドメインモデル層、Node.js `fs`、gray-matter
- 利用元: Next.js Page

**プレゼンテーション層:**
- 目的: React Server Components による UI 描画
- 場所: `next/app/`、`next/components/`
- 含むもの: `page.tsx` (Server Component)、`layout.tsx`、各 UI コンポーネント
- 依存先: リポジトリ層
- 利用元: Next.js ビルド・リクエスト

## データフロー

### Collector 実行パス (GitHub Actions)

1. `collect.yml` スケジュールトリガー → `npm run collect`
2. `next/scripts/collector/index.ts`: `CONTENT_DIR` と `RESULT_JSON_PATH` を解決し `buildRunner` を呼び出す
3. `next/scripts/collector/builder.ts`: HTTP クライアント・FileSystem・Clock・Logger・各 Fetcher・Deduplicator・MarkdownWriter を構築して `CollectorRunner` に注入
4. `next/scripts/collector/runner.ts`(`CollectorRunner.run`):
   - `Deduplicator.initialize()` ── content/ の全 Markdown を走査し既知 URL を `Set<string>` に格納
   - 各ソースを順次フェッチ (`ZennRssFetcher` / `HatenaRssFetcher` / `GoogleNewsRssFetcher` / `TogetterScraper`)
   - `Deduplicator.filterNew()` ── 新規 URL のみ抽出
   - `MarkdownWriter.write()` ── `content/YYYY-MM-DD-<slug>.md` として書き出し
5. `JobSummaryReporter.emit()` ── `next/collector-result.json` と `$GITHUB_STEP_SUMMARY` に書き出し
6. GitHub Actions が `content/` の差分を git commit & push

### Web 表示パス (SSG / Next.js build)

1. `next/app/page.tsx`(`Home`): `computeDateThreshold(4)` で 4 日前の日付文字列を生成
2. `FsArticleRepository.getArticlesPublishedSince(thresholdDate)` ── content/ のファイル名を日付プレフィックスで事前絞り込みし、該当 Markdown を読み込んで `fromFrontmatter` で `Article[]` に変換
3. `filterArticlesWithinDays(candidates, 3, now)` ── 直近 3 日分のみ残す (DISPLAY_WINDOW_DAYS)
4. `sortArticlesForDisplay` ── `publishedAt` 降順、同じ場合は `collectedAt` 降順
5. `computePageStats` ── 件数と最終更新日時を集計
6. `toListItemView` ── `Article` → `ArticleListItemView` (表示専用ビューモデル)
7. React ツリーを静的 HTML として書き出し

**状態管理:**
- サーバーサイドのみ。クライアントサイドの状態は存在しない。全データは `next build` 時にファイルシステムから読み取り HTML に埋め込まれる。

## 主要な抽象化

**`SourceFetcher<TConfig>` インタフェース:**
- 目的: 各ニュースソースの取得ロジックを均一に扱う
- 実装: `ZennRssFetcher`、`HatenaRssFetcher`、`GoogleNewsRssFetcher`、`TogetterScraper`
- 場所: `next/scripts/collector/sources/source-fetcher.ts`

**`HttpClient` インタフェース:**
- 目的: HTTP 通信をモック可能にする
- 実装: `DefaultHttpClient` (fetch ラッパー)、テスト用 `RecordingHttpClient`
- 場所: `next/scripts/collector/lib/http-client.ts`

**`FileSystem` / `FileReader` インタフェース:**
- 目的: ファイル I/O をモック可能にする
- 実装: `DefaultFileSystem`、テスト用 `InMemoryFileSystem`
- 場所: `next/scripts/collector/lib/file-system.ts`

**`Clock` 型:**
- 目的: 現在時刻取得をモック可能にする
- 型: `() => Date`
- 場所: `next/scripts/collector/lib/clock.ts`

**`ArticleRepository` インタフェース:**
- 目的: フロントエンドのデータアクセスを抽象化
- 実装: `FsArticleRepository`
- 場所: `next/lib/articles.ts`

**`Article` / `ArticleFrontmatter` (zod スキーマ):**
- 目的: アプリケーション全体で共有するドメイン型
- 場所: `next/lib/article.ts`

## エントリポイント

**Collector エントリポイント:**
- 場所: `next/scripts/collector/index.ts`
- 起動方法: `npm run collect` (tsx で直接実行)
- 責務: パスを解決して `buildRunner` を呼び出し、エラーを process.exit(1) で伝播

**Web フロントエンド エントリポイント:**
- 場所: `next/app/page.tsx`
- 起動方法: `next build` (SSG) または `next start`
- 責務: データ取得・フィルタ・ソート・ビュー変換をサーバーサイドで実行し React ツリーを返す

**レイアウト:**
- 場所: `next/app/layout.tsx`
- 責務: HTML ルート要素・フォント定義・メタデータを定義

## アーキテクチャ上の制約

- **スレッディング:** シングルスレッドの Node.js イベントループ。Collector は各ソースを順次 (`for...of`) フェッチする (並列化なし)
- **グローバル状態:** `next/lib/articles.ts` の `articleRepository` はモジュールレベルシングルトン (`new FsArticleRepository()`)。`next/config/sources.ts` の `sourceConfig` も同様
- **データストア:** データベース不使用。git リポジトリ内の `content/` ディレクトリがデータストア
- **ビルド時データ:** フロントエンドは SSG のため、表示データはビルド時点のファイルシステム内容に固定される。ビルド後に追加された記事は再ビルドしない限り反映されない

## アンチパターン

### `articleRepository` の直接インポート

**内容:** `next/app/page.tsx` は `articleRepository` (モジュールレベルシングルトン) を直接インポートして使用している
**問題:** テスト環境でリポジトリの差し替えが困難
**代替:** `FsArticleRepository` をページのデフォルト引数またはコンテキスト経由で注入する

## エラーハンドリング

**戦略:** Collector は各ソースのエラーをキャッチしてログに記録し、残りのソースを継続処理する。フロントエンドはエラー時に例外をそのままスローし Next.js のエラーバウンダリに委ねる。

**パターン:**
- Collector fetcher: ソース単位で try/catch し `logger.error` → `failedSources` に追記。プロセスは終了しない
- Frontmatter パース: `fromFrontmatter` で zod バリデーション失敗時はファイルパス付きエラーをスロー
- HTTP レスポンス: ステータス 400 以上は `logger.warn` して `continue` (例外ではなく条件分岐)

## 横断的関心事

**ロギング:** `Logger` インタフェース + `DefaultLogger` (`next/scripts/collector/logger.ts`)。`SecretScrubber` でシークレットを自動マスク。フォーマット: `[LEVEL][source] message key=value...`

**バリデーション:** zod スキーマ (`ArticleSchema`、`ArticleFrontmatterSchema`、各 `SourceConfig` スキーマ) による実行時バリデーション

**認証:** なし (公開サイト)

---

*アーキテクチャ分析: 2026-05-30*
