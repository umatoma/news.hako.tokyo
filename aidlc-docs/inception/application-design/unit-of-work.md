# Unit of Work

**Project**: news.hako.tokyo
**Stage**: INCEPTION — Units Generation
**Depth**: Minimal
**Created**: 2026-04-25

このドキュメントは、本プロジェクトを Construction フェーズで扱う **Unit of Work** に分解した結果と、コード組織戦略を定義します。

---

## 1. Units Overview

| Unit ID | 名称 | タイプ | 配置 | 担当範囲 |
|---|---|---|---|---|
| **U1** | News Collection Service (Collector) | Node.js script (Module) | `next/scripts/collector/` (Q3, Q4 回答) | 外部ソースから記事を収集し `content/` に Markdown としてコミット |
| **U2** | News Listing Service (Web Frontend) | Next.js Application (Service) | `next/app/`, `next/components/`, `next/lib/` | `content/*.md` を読み込み、SSG で一覧サイトとして配信 |

**Cross-cutting (両ユニットが利用する共通資源)**:
- `Article` 型定義 → `next/lib/article.ts`
- `SourceConfig` 型と設定値 → `next/config/sources.ts`
- データレイヤ → `<repo-root>/content/*.md` (Markdown 群)

**ユニット数**: 2

---

## 2. Unit 1: News Collection Service (Collector)

### Responsibilities
- `next/config/sources.ts` の設定を読み込み、各ソース (Zenn / Hatena / Google ニュース / Togetter) から記事を取得する
- 既存の `<repo-root>/content/` 内 Markdown を走査し、URL ベースで重複排除する
- 新規記事を `<repo-root>/content/` 配下に Markdown ファイル (frontmatter 付き) として書き出す
- 実行結果サマリー (取得件数 / 新規件数 / 重複件数 / 失敗ソース) を stdout に出力する

### Components (Application Design 準拠)
- Orchestrator: `CollectorRunner`
- Adapter IF: `SourceFetcher<TConfig>`
- Adapter 実装: `ZennRssFetcher` / `HatenaRssFetcher` / `GoogleNewsRssFetcher` / `TogetterScraper`
- 共通サービス: `Deduplicator` / `MarkdownWriter` / `SlugBuilder`
- DI 抽象: `HttpClient` / `FileSystem`
- 設定型: `SourceConfig` および各 `*Config` (cross-cutting だが Collector が主たる利用者)

### Execution Context
- **GitHub Actions** (`.github/workflows/collect.yml`)
  - cron: 毎朝 7:00 JST (`22 22 * * *` UTC、要 Construction で確定)
  - `workflow_dispatch` (手動トリガ)
- 実行ランタイム: Node.js v24.13.1 (`.nvmrc` 準拠)
- 実行コマンド (暫定): `npx tsx scripts/collector/index.ts` (Construction で確定)

### Inputs / Outputs
- **Input**:
  - 環境変数: 採用ソースは API キー不要のため、MVP 段階での Secrets 設定は不要 (将来 API キー必須のソースを追加する場合のみ Secrets を追加)
  - 設定: `next/config/sources.ts`
  - 既存 Markdown: `<repo-root>/content/**/*.md`
- **Output**:
  - 新規 Markdown: `<repo-root>/content/{publishedAt(YYYY-MM-DD)}-{slug}.md`
  - stdout サマリー (CollectorRunResult)
  - exit code (0 = success / 非 0 = 致命的エラー)

### 完了条件 (Construction で達成)
- 4 ソースすべてから 1 件以上取得 (AC-04)
- 重複排除が機能 (AC-05)
- 手動実行が成功 (AC-02)
- スケジュール実行が動作 (AC-03)

---

## 3. Unit 2: News Listing Service (Web Frontend)

### Responsibilities
- ビルド時 (SSG) に `<repo-root>/content/*.md` を再帰スキャン
- 各 Markdown の frontmatter を解析し `Article[]` を構築
- `publishedAt` 降順でソート
- 一覧 HTML を静的生成
- 元記事へのリンクは新規タブで開く (`target="_blank"`, `rel="noopener noreferrer"`)
- ライト / ダーク両対応 (システム設定追従)

### Components (Application Design 準拠)
- Page: `Home` (`next/app/page.tsx`)
- Layout: `RootLayout` (`next/app/layout.tsx`)
- Presentational: `ArticleListItem` (`next/components/article-list-item.tsx`)
- Data Access: `ArticleRepository` (`next/lib/articles.ts`)
- 共通型: `Article` (`next/lib/article.ts`)

### Execution Context
- **Next.js ビルド** (Vercel 上で実行)
  - トリガ: `main` ブランチへの push (Vercel 連携)
  - レンダリング: SSG
- 実行コマンド: `next build` (`next/package.json` の `scripts.build`)

### Vercel 設定の注意点
- Vercel の **Root Directory** は `next/` (Construction で `vercel.json` または Vercel ダッシュボードで設定)
- `<repo-root>/content/` は `next/` の親ディレクトリにあるため、ビルド時にアクセスできるよう **Vercel の "Include Source Files Outside the Root Directory"** オプション有効化、または **ビルドステップで `content/` をシンボリックリンク / コピー** が必要
- 詳細は U2 の Infrastructure Design (minimal) で確定

### Inputs / Outputs
- **Input**:
  - 共有 Markdown: `<repo-root>/content/**/*.md`
  - `Article` 型 / `ArticleRepository`
- **Output**:
  - 静的 HTML / CSS / JS (Vercel CDN へデプロイ)

### 完了条件 (Construction で達成)
- 一覧ページが本番 URL で表示される (AC-01)
- 各記事のタイトル / ソース / 公開日 / 外部リンクが表示される (AC-06)
- ライト / ダーク両対応 (AC-10)

---

## 4. Code Organization Strategy

Q3 = B (例外あり) / Q4 = A の回答に基づく **確定構成**:

```text
news.hako.tokyo/                    # リポジトリルート
├── .nvmrc                          # Node.js v24.13.1 (既存)
├── .gitignore                      # 既存
├── README.md                       # 既存 (リポジトリ全体)
├── CLAUDE.md                       # AI-DLC ワークフロー指示書 (既存)
├── .aidlc-rule-details/            # AI-DLC ルール (既存)
├── aidlc-docs/                     # AI-DLC 成果物 (既存)
├── content/                        # 🆕 収集済み Markdown (Git 管理対象)
│   └── 2026-04-25-example.md       # 例: {YYYY-MM-DD}-{slug}.md
├── .github/                        # 🆕 GitHub Actions
│   └── workflows/
│       ├── ci.yml                  # 🆕 lint + typecheck + test (PR 時 / push 時)
│       └── collect.yml             # 🆕 cron 収集ジョブ (毎朝 7:00 JST)
└── next/                           # アプリ全体 (Web + Collector)
    ├── package.json                # 既存 (全依存をここに追加)
    ├── package-lock.json           # 既存
    ├── tsconfig.json               # 既存 (paths と include 範囲は Construction で要調整)
    ├── eslint.config.mjs           # 既存
    ├── postcss.config.mjs          # 既存
    ├── next.config.ts              # 既存 (要調整: 親ディレクトリの content/ 参照)
    ├── next-env.d.ts               # 既存 (自動生成)
    ├── public/                     # 既存
    ├── app/                        # Web (Unit 2)
    │   ├── layout.tsx              # 既存 (要更新)
    │   ├── page.tsx                # 既存 (要更新)
    │   ├── globals.css             # 既存
    │   └── favicon.ico             # 既存
    ├── components/                 # 🆕 Web (Unit 2) Presentational
    │   └── article-list-item.tsx
    ├── lib/                        # 🆕 共有型 + Web Data Access
    │   ├── article.ts              # Article 型定義
    │   └── articles.ts             # ArticleRepository
    ├── config/                     # 🆕 共有 Config
    │   └── sources.ts              # SourceConfig 値
    └── scripts/                    # 🆕 Collector (Unit 1)
        └── collector/
            ├── index.ts            # CollectorRunner エントリ
            ├── sources/
            │   ├── source-fetcher.ts
            │   ├── zenn-rss-fetcher.ts
            │   ├── hatena-rss-fetcher.ts
            │   ├── google-news-rss-fetcher.ts
            │   └── togetter-scraper.ts
            └── lib/
                ├── deduplicator.ts
                ├── markdown-writer.ts
                ├── slug-builder.ts
                ├── http-client.ts  # HttpClient 抽象 + デフォルト実装
                └── file-system.ts  # FileSystem 抽象 + デフォルト実装
```

### 設計判断のメモ
- **`next/` をコードのルートとする**: Q3=B により Web も Collector もすべて `next/` 配下。`package.json` は `next/package.json` 1 つだけ運用 (Q4=A)。
- **`content/` のみリポジトリルートに置く**: Q3 の例外指定。**理由**: 「コード」と「データ (Markdown)」を物理的に分離し、リポジトリルートで `content/` の更新履歴を視認しやすくする。GitHub Actions の Collector ジョブからも `next/` を経由せず素直に書ける。
- **Vercel デプロイの調整必要**: 上記 Markdown 配置のため、Vercel の Root Directory を `next/` に設定しつつ、親ディレクトリ `../content/` を SSG ビルドから読めるようにする (Vercel の "Include Source Files Outside the Root Directory" オプション)。Construction の U2 Infrastructure Design で確定。
- **Collector の依存追加**: `next/package.json` の `devDependencies` に `tsx`, `rss-parser` (or 同等), `cheerio` (Togetter スクレイピング用), `gray-matter` (frontmatter), `fast-check` (PBT) 等を追加 (Construction 各ステージで具体決定)。
- **TypeScript path mapping**: `next/tsconfig.json` の `"paths": { "@/*": ["./*"] }` を維持し、scripts/collector からも `@/lib/article` 等で参照可能。

### 既存 vs 新規ファイルの区別

| 種別 | 場所 | 状態 |
|---|---|---|
| Existing | `next/app/layout.tsx`, `next/app/page.tsx`, `next/app/globals.css`, `next/app/favicon.ico`, `next/public/*.svg`, `next/{tsconfig,eslint.config.mjs,postcss.config.mjs,next.config.ts,package.json,package-lock.json,next-env.d.ts}`, `next/AGENTS.md`, `next/CLAUDE.md`, `next/README.md` | 一部更新あり |
| New | `next/components/`, `next/lib/`, `next/config/`, `next/scripts/`, `<root>/content/`, `<root>/.github/workflows/`, (必要なら) `<root>/vercel.json` | すべて Construction で新規作成 |

---

## 5. Construction フェーズへの引き継ぎ

### 実装順序 (Q2 = A 確定)
1. **Unit 1: Collector** の Functional Design → NFR Requirements → NFR Design → Infrastructure Design (minimal) → Code Generation
2. **Unit 2: Web Frontend** の Functional Design → NFR Requirements → NFR Design → Infrastructure Design (minimal) → Code Generation
3. **Build and Test** (全ユニット完了後)

### 並行作業 (Q5 = A 確定)
- 完全逐次。共有資産 (`Article` 型 / Markdown スキーマ) は U1 の Functional Design / Code Generation で確定し、U2 はその確定済み資産を読み込んで進める。

### Per-Unit ステージへの引き継ぎ事項
- **U1 Functional Design**: 各 Adapter のフィールドマッピング詳細、frontmatter YAML スキーマ、PBT-01 advisory ノート、エラーログフォーマット、SlugBuilder アルゴリズム
- **U1 NFR Requirements**: ライブラリ選定 (Vitest, fast-check, rss-parser, cheerio, gray-matter, tsx)、Togetter 規約確認 (OQ-01)、Google ニュース RSS 仕様の再確認・代替プラン (RISK-02 更新版)
- **U1 NFR Design**: PBT-02/03/07/08 のテストパターン適用先
- **U1 Infrastructure Design (minimal)**: `.github/workflows/collect.yml` の cron / permissions / secrets / commit 戦略
- **U1 Code Generation**: 全 U1 コンポーネント実装
- **U2 Functional Design**: ArticleRepository の `content/` パス解決、空状態 UI、Next.js 16 SSG 仕様確認 (OQ-05)
- **U2 NFR Requirements**: Playwright / Tailwind v4 ダーク確認
- **U2 NFR Design**: PBT-02 (frontmatter ↔ Article ラウンドトリップ) の Repository 側パターン
- **U2 Infrastructure Design (minimal)**: Vercel Root Directory / "Include Source Files Outside the Root Directory" 設定、CI ワークフロー (`.github/workflows/ci.yml`)
- **U2 Code Generation**: 全 U2 コンポーネント実装

---

## 6. Greenfield / Multi-unit Note

本プロジェクトは形式上 Brownfield (Next.js スキャフォールドが存在) ですが、業務コードはゼロからの実装に近いため、コード組織戦略を上記のように明示しました。これは `units-generation.md` の Step 2 における **「Greenfield only: Document code organization strategy」** に相当する記述です。
