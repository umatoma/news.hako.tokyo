# ディレクトリ構成

**分析日:** 2026-05-30

## ディレクトリレイアウト

```
news.hako.tokyo/               # リポジトリルート
├── content/                   # 記事データストア (git 管理、Collector が書き出す)
│   └── YYYY-MM-DD-<slug>--<id6>.md   # 記事 1 件 = 1 Markdown ファイル
├── next/                      # Next.js アプリケーション (Web + Collector 共存)
│   ├── app/                   # Next.js App Router (ページ・レイアウト)
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # トップページ (Server Component)
│   │   ├── globals.css        # グローバルスタイル (Tailwind)
│   │   └── favicon.ico
│   ├── components/            # 再利用可能 React コンポーネント
│   │   ├── article-list.tsx
│   │   ├── article-list-item.tsx
│   │   ├── empty-state.tsx
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── source-badge.tsx
│   ├── lib/                   # フロントエンド共有ライブラリ
│   │   ├── article.ts         # ドメインモデル (zod スキーマ + 型 + 変換関数)
│   │   ├── articles.ts        # リポジトリ層 + ビュー変換ユーティリティ
│   │   ├── articles.test.ts   # articles.ts のユニットテスト
│   │   └── articles.pbt.test.ts  # プロパティベーステスト
│   ├── config/
│   │   └── sources.ts         # ニュースソース設定 (zod スキーマ + 実設定値)
│   ├── scripts/
│   │   └── collector/         # Collector スクリプト (Node.js)
│   │       ├── index.ts       # エントリポイント
│   │       ├── runner.ts      # CollectorRunner クラス
│   │       ├── builder.ts     # DI 組み立て (buildRunner 関数)
│   │       ├── logger.ts      # Logger インタフェース + DefaultLogger
│   │       ├── lib/           # Collector 内部ライブラリ
│   │       │   ├── article-id.ts        # SHA-256 ベースの ID 生成
│   │       │   ├── clock.ts             # Clock 型 + systemClock
│   │       │   ├── deduplicator.ts      # URL 重複排除
│   │       │   ├── file-system.ts       # FileSystem / FileReader インタフェース
│   │       │   ├── http-client.ts       # HttpClient インタフェース + DefaultHttpClient
│   │       │   ├── job-summary-reporter.ts  # 実行結果レポート
│   │       │   ├── markdown-writer.ts   # Markdown ファイル書き出し
│   │       │   ├── secret-scrubber.ts   # ログのシークレットマスク
│   │       │   ├── slug-builder.ts      # URL-safe スラッグ生成
│   │       │   └── url-normalize.ts     # URL 正規化 (重複排除用)
│   │       ├── sources/       # ソース別フェッチャー
│   │       │   ├── source-fetcher.ts    # SourceFetcher<TConfig> インタフェース
│   │       │   ├── rss-mapping.ts       # RSS パース共通ロジック
│   │       │   ├── zenn-rss-fetcher.ts
│   │       │   ├── hatena-rss-fetcher.ts
│   │       │   ├── google-news-rss-fetcher.ts
│   │       │   └── togetter-scraper.ts  # HTML スクレイパー (cheerio)
│   │       ├── test/          # Collector テスト
│   │       │   ├── generators/          # fast-check Arbitrary ジェネレータ
│   │       │   ├── in-memory-file-system.ts  # テスト用 FileSystem 実装
│   │       │   ├── recording-http-client.ts  # テスト用 HttpClient 実装
│   │       │   ├── *.test.ts            # ユニットテスト
│   │       │   ├── *.pbt.test.ts        # プロパティベーステスト
│   │       │   └── sources/*.test.ts    # ソース別テスト
│   │       └── compose-commit-message.cjs  # コミットメッセージ生成 (CJS)
│   ├── e2e/
│   │   └── home.spec.ts       # Playwright E2E テスト
│   ├── public/                # 静的アセット (SVG 等)
│   ├── next.config.ts         # Next.js 設定
│   ├── tsconfig.json          # TypeScript 設定
│   ├── vitest.config.ts       # Vitest 設定
│   ├── playwright.config.ts   # Playwright 設定
│   ├── eslint.config.mjs      # ESLint 設定
│   ├── package.json
│   └── collector-result.json  # Collector 最終実行結果 (自動生成)
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI パイプライン (lint・test・build・E2E・セキュリティ)
│       └── collect.yml        # 毎日 UTC 22:00 の Collector 自動実行
├── specs/                     # 機能仕様書 (SpecKit)
├── aidlc-docs/                # AIDLC 設計ドキュメント
├── .planning/                 # GSD 計画ドキュメント
│   └── codebase/              # コードベースマップ (本ドキュメント等)
├── .nvmrc                     # Node.js バージョン固定
└── CLAUDE.md                  # AI エージェント向け指示
```

## ディレクトリの役割

**`content/`:**
- 役割: 記事データストア。git で管理される
- 含むもの: `YYYY-MM-DD-<slug>--<id6>.md` 形式の Markdown ファイル (約 880 件以上)
- 重要ファイル: frontmatter に `id`, `title`, `url`, `source`, `published_at`, `collected_at`, `summary`, `tags`, `thumbnail_url` を持つ

**`next/app/`:**
- 役割: Next.js App Router のページ定義
- 含むもの: Root Layout、トップページ (Server Component)
- 重要ファイル: `next/app/page.tsx` (唯一のページ)

**`next/components/`:**
- 役割: 再利用可能な React コンポーネント
- 含むもの: プレゼンテーション専用コンポーネント (ロジックなし)
- 命名: kebab-case ファイル名、PascalCase エクスポート

**`next/lib/`:**
- 役割: フロントエンドとドメインロジック共有ライブラリ
- 含むもの: `article.ts` (ドメインモデル)、`articles.ts` (リポジトリ + ユーティリティ)、テストファイル
- 重要: `article.ts` は Collector スクリプトからも参照されるため両者の共有境界

**`next/config/`:**
- 役割: アプリケーション設定
- 含むもの: ニュースソース設定 (`sources.ts`)

**`next/scripts/collector/`:**
- 役割: ニュース収集バッチスクリプト
- 含むもの: Collector の全実装 (エントリポイント・Runner・DI・ライブラリ・ソース・テスト)
- 実行方法: `npm run collect` (tsx で直接実行)

**`next/e2e/`:**
- 役割: Playwright E2E テスト
- 含むもの: `home.spec.ts` (トップページのスモークテスト)

## 重要なファイルの場所

**エントリポイント:**
- `next/app/page.tsx`: Web フロントエンドのトップページ
- `next/scripts/collector/index.ts`: Collector バッチのエントリポイント
- `next/app/layout.tsx`: Next.js ルートレイアウト

**設定:**
- `next/config/sources.ts`: ニュースソース接続設定
- `next/tsconfig.json`: TypeScript 設定 (`@/*` エイリアスを `next/` にマップ)
- `next/next.config.ts`: Next.js 設定
- `.nvmrc`: Node.js バージョン
- `.github/workflows/collect.yml`: Collector の自動実行スケジュール

**コアロジック:**
- `next/lib/article.ts`: ドメインモデル (全コードの型的基盤)
- `next/lib/articles.ts`: `FsArticleRepository`、フィルタ・ソート・ビュー変換
- `next/scripts/collector/runner.ts`: Collector のオーケストレーションロジック
- `next/scripts/collector/builder.ts`: DI 組み立て

**テスト:**
- `next/lib/articles.test.ts`: リポジトリ層ユニットテスト
- `next/scripts/collector/test/`: Collector ユニットテスト群
- `next/e2e/home.spec.ts`: E2E テスト

## 命名規則

**ファイル:**
- TypeScript ソースファイル: kebab-case (例: `article-list-item.tsx`, `slug-builder.ts`)
- テストファイル: `<対象>.test.ts` または `<対象>.pbt.test.ts` (プロパティベース)
- E2E テスト: `<ページ>.spec.ts`

**ディレクトリ:**
- kebab-case (例: `scripts/collector/`, `article-list-item.tsx`)

**コード識別子:**
- クラス・型・インタフェース: PascalCase (例: `CollectorRunner`, `ArticleRepository`)
- 関数・変数: camelCase (例: `buildRunner`, `filterArticlesWithinDays`)
- 定数 (モジュールレベル): UPPER_SNAKE_CASE (例: `DISPLAY_WINDOW_DAYS`, `MILLIS_PER_DAY`)
- React コンポーネント: PascalCase (例: `ArticleList`, `SourceBadge`)

**content/ ファイル名:**
- `YYYY-MM-DD-<slug>--<id6>.md`
  - 日付: `published_at` の先頭 10 文字
  - スラッグ: タイトルの ASCII 部分 (最大 44 文字)
  - ID サフィックス: `article.id` の先頭 6 文字
  - 衝突時: `...-2.md`, `...-3.md` とサフィックスを追加

## 新規コード追加ガイド

**新しいニュースソースを追加する場合:**
1. `next/config/sources.ts` に `XxxConfigSchema` と設定値を追加
2. `next/lib/article.ts` の `ARTICLE_SOURCES` 配列に `sourceId` を追加
3. `next/scripts/collector/sources/xxx-fetcher.ts` に `SourceFetcher<XxxConfig>` 実装クラスを作成
4. `next/scripts/collector/builder.ts` の `fetchers` オブジェクトに追加
5. `next/scripts/collector/runner.ts` の `ordered` 配列に追加
6. `next/lib/articles.ts` の `SOURCE_LABEL` に表示ラベルを追加
7. `next/components/source-badge.tsx` の `BADGE_CLASS` に色クラスを追加

**新しい React コンポーネントを追加する場合:**
- 実装: `next/components/<component-name>.tsx`
- props 型はファイル内 `interface` で定義 (exported でなくて良い)

**新しいユーティリティ関数を追加する場合:**
- フロントエンド用: `next/lib/articles.ts` または新規 `next/lib/<feature>.ts`
- Collector 内部用: `next/scripts/collector/lib/<feature>.ts`

**テストを追加する場合:**
- フロントエンド lib: `next/lib/<対象>.test.ts`
- Collector lib: `next/scripts/collector/test/<対象>.test.ts`
- Collector sources: `next/scripts/collector/test/sources/<source>.test.ts`
- プロパティベーステスト: `<対象>.pbt.test.ts`
- fast-check ジェネレータ: `next/scripts/collector/test/generators/<対象>.gen.ts`

## 特殊ディレクトリ

**`next/.next/`:**
- 役割: Next.js ビルド成果物
- 自動生成: Yes
- git 管理: No (`.gitignore` に記載)

**`next/node_modules/`:**
- 役割: npm パッケージ
- 自動生成: Yes (`npm ci`)
- git 管理: No

**`content/`:**
- 役割: 記事データストア
- 自動生成: Collector が追記
- git 管理: Yes (記事の永続ストレージ)

**`.planning/codebase/`:**
- 役割: GSD コードベースマップ (本ドキュメント等)
- 自動生成: Yes (`/gsd-map-codebase` コマンド)
- git 管理: Yes

---

*構成分析: 2026-05-30*
