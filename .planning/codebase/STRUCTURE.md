# コードベース構造

**分析日:** 2026-05-30

## ディレクトリ構成

```
news.hako.tokyo/           # リポジトリルート
├── content/               # 収集済み記事 Markdown (Gitで管理)
│   └── YYYY-MM-DD-<slug>.md
├── next/                  # Next.js アプリケーション (フロントエンド + コレクタースクリプト)
│   ├── app/               # Next.js App Router ルート
│   │   ├── layout.tsx     # ルートレイアウト (フォント・メタデータ)
│   │   ├── page.tsx       # ホームページ (Server Component)
│   │   ├── globals.css    # グローバルスタイル (Tailwind CSS)
│   │   └── favicon.ico
│   ├── components/        # React UIコンポーネント (表示専用)
│   ├── lib/               # フロントエンド共有ロジック (ドメインモデル・リポジトリ)
│   ├── config/            # ソース設定 (zod スキーマ + デフォルト値)
│   │   └── sources.ts
│   ├── scripts/
│   │   └── collector/     # ニュース収集スクリプト
│   │       ├── index.ts   # コレクターエントリポイント
│   │       ├── runner.ts  # 収集オーケストレーター
│   │       ├── builder.ts # DI組み立て
│   │       ├── logger.ts  # ロガー実装
│   │       ├── lib/       # インフラ抽象化 (HTTP/FS/Clock/Dedup/Slug)
│   │       ├── sources/   # ソース別フェッチャー/スクレイパー
│   │       └── test/      # テスト用フィクスチャ・モック・テストファイル
│   ├── e2e/               # Playwright E2Eテスト
│   ├── public/            # 静的アセット (SVG・robots.txt)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   └── eslint.config.mjs
├── specs/                 # 仕様ドキュメント (非コード)
├── .github/
│   └── workflows/
│       ├── collect.yml    # スケジュール収集 + git push
│       └── ci.yml         # テスト CI
├── .planning/             # GSD プランニングドキュメント
│   └── codebase/
├── .claude/               # Claude エージェント設定
└── .nvmrc                 # Node.js バージョン指定
```

## ディレクトリの目的

**`content/`:**
- 目的: コレクターが書き出す記事Markdownのストア
- 含むもの: `YYYY-MM-DD-<ascii-slug>--<id6>.md` 形式のファイル
- 重要ファイル例: `2026-05-30-ai-33-netkeiba--4ryy1s.md`
- 生成: コレクタースクリプトが自動生成
- Gitコミット: はい (コンテンツストアとして機能)

**`next/app/`:**
- 目的: Next.js App Router のページとレイアウト
- 含むもの: Server Component (`page.tsx`), ルートレイアウト, グローバルCSS
- 重要ファイル: `next/app/page.tsx` (唯一のページ)

**`next/components/`:**
- 目的: ステートレスなUIコンポーネント
- 含むもの: `ArticleList`, `ArticleListItem`, `Header`, `Footer`, `EmptyState`, `SourceBadge`
- パターン: `ArticleListItemView` ViewObjectを受け取り表示するだけ、クライアントJS不要

**`next/lib/`:**
- 目的: フロントエンドとコレクターが共有するドメインロジック
- 含むもの: `article.ts` (ドメインモデル・型定義), `articles.ts` (リポジトリ・ヘルパー)
- 重要ファイル:
  - `next/lib/article.ts` — `Article` 型, zod スキーマ, `fromFrontmatter()`/`toFrontmatter()`
  - `next/lib/articles.ts` — `FsArticleRepository`, `filterArticlesWithinDays()`, `toListItemView()`

**`next/config/`:**
- 目的: 収集ソースの設定定義
- 含むもの: `sources.ts` — `SourceConfig` zod スキーマとデフォルト値 (フィードURL・最大取得件数)

**`next/scripts/collector/lib/`:**
- 目的: コレクターのインフラ抽象化層
- 含むもの:
  - `article-id.ts` — SHA-256 + base36 によるID生成
  - `clock.ts` — `Clock = () => Date` 型とシステムクロック
  - `deduplicator.ts` — URL正規化ベースの重複排除
  - `file-system.ts` — `FileSystem` / `FileReader` インターフェース
  - `http-client.ts` — `HttpClient` インターフェースと `DefaultHttpClient`
  - `job-summary-reporter.ts` — 実行結果JSON + GitHub Step Summary
  - `markdown-writer.ts` — `MarkdownWriter` (ファイル書き出し)
  - `secret-scrubber.ts` — ログのシークレットマスク
  - `slug-builder.ts` — タイトルからASCIIスラッグ生成
  - `url-normalize.ts` — URL正規化 (重複排除用)

**`next/scripts/collector/sources/`:**
- 目的: ニュースソース別のフェッチャー/スクレイパー
- 含むもの:
  - `zenn-rss-fetcher.ts` — Zenn RSS
  - `hatena-rss-fetcher.ts` — はてなブックマーク RSS
  - `google-news-rss-fetcher.ts` — Google ニュース RSS
  - `togetter-scraper.ts` — Togetter HTMLスクレイピング (`cheerio`)
  - `rss-mapping.ts` — RSS アイテム → `FetchedArticle` 変換共通ロジック
  - `source-fetcher.ts` — `SourceFetcher<TConfig>` インターフェース定義

**`next/scripts/collector/test/`:**
- 目的: テスト専用のモック・フィクスチャ・テストファイル
- 含むもの:
  - `in-memory-file-system.ts` — `FileSystem` のインメモリ実装
  - `recording-http-client.ts` — `HttpClient` の録音/再生モック
  - `generators/` — `fast-check` 用のアービトラリジェネレーター

**`next/e2e/`:**
- 目的: Playwright E2Eテスト
- 含むもの: `home.spec.ts`

## 主要ファイルの場所

**エントリポイント:**
- `next/app/page.tsx` — フロントエンドのページ (Next.js App Router)
- `next/app/layout.tsx` — ルートレイアウト
- `next/scripts/collector/index.ts` — コレクター実行エントリポイント

**設定:**
- `next/config/sources.ts` — ニュースソース設定 (フィードURL・有効/無効・最大件数)
- `next/next.config.ts` — Next.js ビルド設定
- `next/tsconfig.json` — TypeScript 設定 (`@/` エイリアスを `next/` にマップ)
- `next/vitest.config.ts` — Vitest 設定
- `next/playwright.config.ts` — Playwright 設定

**コアロジック:**
- `next/lib/article.ts` — ドメインモデル (Article 型・zod スキーマ)
- `next/lib/articles.ts` — リポジトリ・ビジネスロジック (フィルタリング・ソート・統計)
- `next/scripts/collector/runner.ts` — コレクターオーケストレーター
- `next/scripts/collector/builder.ts` — DI組み立て

**テスト:**
- `next/lib/articles.test.ts`, `next/lib/articles.pbt.test.ts` — リポジトリ・ヘルパーのユニットテスト
- `next/scripts/collector/test/` — コレクター各コンポーネントのテスト
- `next/e2e/home.spec.ts` — E2Eテスト

## 命名規則

**ファイル:**
- コンポーネント: `kebab-case.tsx` (例: `article-list-item.tsx`)
- ライブラリ: `kebab-case.ts` (例: `slug-builder.ts`)
- テスト: `<対象>.test.ts` または `<対象>.pbt.test.ts` (プロパティベーステスト)
- Markdownコンテンツ: `YYYY-MM-DD-<ascii-slug>--<id6>.md`

**ディレクトリ:**
- すべて `kebab-case`

**TypeScript識別子:**
- クラス/型/インターフェース: `PascalCase`
- 関数/変数/メソッド: `camelCase`
- 定数 (モジュールレベル): `UPPER_SNAKE_CASE` (例: `DISPLAY_WINDOW_DAYS`, `MILLIS_PER_DAY`)
- React コンポーネント: `PascalCase` の名前付きエクスポート

**import パスエイリアス:**
- `@/` → `next/` (tsconfig.json の `paths` 設定)
  - 例: `@/lib/article` → `next/lib/article.ts`
  - 例: `@/config/sources` → `next/config/sources.ts`

## 新規コードの追加先

**新しいニュースソースを追加する場合:**
1. `next/config/sources.ts` に設定スキーマと型を追加
2. `next/scripts/collector/sources/<source-name>-fetcher.ts` または `<source-name>-scraper.ts` を作成し `SourceFetcher<TConfig>` を実装
3. `next/scripts/collector/builder.ts` の `fetchers` オブジェクトに追加
4. `next/scripts/collector/runner.ts` の `ordered` 配列に追加
5. `next/lib/article.ts` の `ARTICLE_SOURCES` に `SourceId` を追加
6. `next/lib/articles.ts` の `SOURCE_LABEL` に表示名を追加
7. テスト: `next/scripts/collector/test/sources/<source-name>-fetcher.test.ts`

**新しいUIコンポーネントを追加する場合:**
- 実装: `next/components/<component-name>.tsx`
- テスト: 現状E2Eのみ。必要に応じて `next/e2e/` または Vitest でレンダリングテスト

**新しいビジネスロジック (フロントエンド側) を追加する場合:**
- ドメインロジック: `next/lib/articles.ts` に関数を追加
- 新しい型定義が必要な場合: `next/lib/article.ts`

**コレクターのインフラ抽象化を追加する場合:**
- 実装: `next/scripts/collector/lib/<名前>.ts`
- インターフェースと実装クラスをセットで定義し、`builder.ts` でDI

## 特殊ディレクトリ

**`content/`:**
- 目的: コレクター出力の記事Markdownストア
- 生成: コレクタースクリプト + GitHub Actions による自動コミット
- Gitコミット: はい

**`next/.next/`:**
- 目的: Next.js ビルド出力
- 生成: `npm run build`
- Gitコミット: いいえ (`.gitignore` 対象)

**`.planning/codebase/`:**
- 目的: GSD コードベースマッピングドキュメント
- Gitコミット: はい

**`next/scripts/collector/test/`:**
- 目的: テスト専用のモック・フィクスチャ
- 含むもの: `in-memory-file-system.ts`, `recording-http-client.ts`, `generators/`
- 本番コードからimportしない

---

*構造分析: 2026-05-30*
