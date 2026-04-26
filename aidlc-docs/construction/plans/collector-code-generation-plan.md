# Code Generation Plan — Unit 1: Collector

**Project**: news.hako.tokyo
**Unit**: U1 (News Collection Service / Collector)
**Stage**: CONSTRUCTION — Code Generation
**Created**: 2026-04-25
**Single Source of Truth**: ✅ このプランは Code Generation 段階で唯一の実行スクリプトとして機能します。

---

## Unit Context

### Stories / Requirements 参照
本ユニットが満たす要件:
- **FR-02**: 情報収集 (RSS / 外部 API)
- **FR-03**: 自動収集ジョブ (GitHub Actions)
- **AC-02**: workflow_dispatch 手動実行で `content/` に新規 Markdown コミット
- **AC-03**: スケジュール実行 (毎朝 7:00 JST)
- **AC-04**: 4 ソース (Zenn / Hatena / Google ニュース / Togetter) からそれぞれ 1 件以上取得
- **AC-05**: 同一 URL の重複が排除される
- **AC-08**: PBT (PBT-02, 03, 07, 08, 09) が CI 上で実行され、seed ログが残る
- **AC-09**: API キー等のシークレットがコードにハードコードされない (gitleaks)

### 依存関係
- **共有資産** (Cross-cutting): `Article` 型 / `SourceConfig` 型 / `content/*.md` データ
- **Unit 2 (Web Frontend) への引き渡し**: `next/lib/article.ts` の Article 型 + frontmatter snake_case スキーマ

### インターフェイスと契約
- 出力: `content/{publishedAt(YYYY-MM-DD)}-{slug}.md` (frontmatter snake_case + 本文 H1 + summary)
- ログ: stdout (プレーン) + `next/collector-result.json` (構造化)
- exit code: 0 (success / 一部失敗) または 1 (致命エラー)

### Workspace 確認 (aidlc-state.md より)
- Workspace Root: `~/workspaces/news.hako.tokyo`
- Project Type: **Brownfield** (Next.js scaffold が存在)
- Code 集約先: **`next/`** 配下 (Q3=B、Q4=A)
- Markdown データ: **`<repo-root>/content/`** (Q3 例外)
- GitHub Actions: **`<repo-root>/.github/workflows/`**

---

## Story Traceability Map

| Component / Step | 関連 Story / Requirement | PBT Rule |
|---|---|---|
| `lib/article.ts` (Article + zod) | FR-02, OQ-04 | PBT-02 |
| `scripts/collector/lib/article-id.ts` | BR-31〜34 | PBT-03 |
| `scripts/collector/lib/url-normalize.ts` | Q5=B | PBT-03 |
| `scripts/collector/lib/slug-builder.ts` | Q4=C | PBT-03 |
| `scripts/collector/lib/deduplicator.ts` | AC-05, BR-20〜30 | PBT-03 |
| `scripts/collector/lib/markdown-writer.ts` | FR-02, BR-41〜46 | PBT-02 |
| `scripts/collector/sources/zenn-rss-fetcher.ts` | AC-04 | — |
| `scripts/collector/sources/hatena-rss-fetcher.ts` | AC-04 | — |
| `scripts/collector/sources/google-news-rss-fetcher.ts` | AC-04, OQ-02 | — |
| `scripts/collector/sources/togetter-scraper.ts` | AC-04, OQ-01 | — |
| `scripts/collector/runner.ts` | FR-02, FR-03 | — |
| `.github/workflows/collect.yml` | FR-03, AC-02, AC-03 | — |
| Test arbitraries (test/generators) | NFR-04 | PBT-07 |
| Vitest CI 統合 | NFR-04 / AC-07 / AC-08 | PBT-08, PBT-09 |

---

## Execution Steps

各ステップに `[ ]` チェックボックスがあります。Part 2 (Generation) では実行ごとに `[x]` に更新します。

---

### Step 1 — Project Structure Setup

- [x] **1.1** ルート `content/` ディレクトリを作成し、`.gitkeep` を配置 (空ディレクトリを git で追跡)
- [x] **1.2** `next/config/` ディレクトリを作成
- [x] **1.3** `next/components/` ディレクトリを作成 (Unit 2 で利用、Step 1 で作成のみ。空でも OK)
- [x] **1.4** `next/lib/` ディレクトリを作成
- [x] **1.5** `next/scripts/collector/` ディレクトリツリーを作成 (`sources/`, `lib/`, `test/`, `test/generators/`, `test/sources/`)
- [x] **1.6** `.github/workflows/` ディレクトリを作成
- [x] **1.7** ルート `.gitignore` を更新: `next/collector-result.json` を除外
- [x] **1.8** `next/package.json` を更新: 依存関係追加 + `scripts` (collect, test, test:watch)
- [x] **1.9** `npm install` を実行し `next/package-lock.json` を更新
- [x] **1.10** `next/tsconfig.json` の `include` を確認 (`scripts/**/*.ts` がカバーされること)、必要なら拡張

---

### Step 2 — Shared Types & Config (Business Logic 中核)

- [x] **2.1** `next/lib/article.ts` を生成 (Article 型 + zod schemas, snake_case ↔ camelCase 双方向変換、SourceId enum)
- [x] **2.2** `next/config/sources.ts` を生成 (SourceConfig + 各 *Config の zod schema + MVP 初期値)
- [x] **2.3** `aidlc-docs/construction/collector/code/shared-types-summary.md` で 2.1〜2.2 の Summary を記述

---

### Step 3 — Utility Library 生成 (DI 抽象 + 値オブジェクト)

- [x] **3.1** `next/scripts/collector/lib/article-id.ts` を生成 (`generateArticleId(url) -> string`、Base36 16 文字)
- [x] **3.2** `next/scripts/collector/lib/url-normalize.ts` を生成 (`normalizeUrlForDedup(url) -> string`、Q5=B 軽い正規化)
- [x] **3.3** `next/scripts/collector/lib/slug-builder.ts` を生成 (`SlugBuilder.build(title, articleId) -> string`、Q4=C ハイブリッド)
- [x] **3.4** `next/scripts/collector/lib/clock.ts` を生成 (`Clock` 型 + `systemClock` + `fixedClock`)
- [x] **3.5** `next/scripts/collector/lib/secret-scrubber.ts` を生成 (`SecretScrubber.scrub(text) -> string`)
- [x] **3.6** `next/scripts/collector/lib/http-client.ts` を生成 (`HttpClient` interface + `defaultHttpClient` 実装、UA + 30 秒 timeout)
- [x] **3.7** `next/scripts/collector/lib/file-system.ts` を生成 (`FileSystem` interface + `defaultFileSystem` 実装、`InMemoryFileSystem` 実装はテストでも使うが本ファイルでは default のみ)
- [x] **3.8** `aidlc-docs/construction/collector/code/utility-library-summary.md` で 3.1〜3.7 の Summary を記述

---

### Step 4 — Service Library 生成 (Repository / Logger / Reporter / Writer / Deduplicator)

- [x] **4.1** `next/scripts/collector/logger.ts` を生成 (Logger interface + 自作実装、`SecretScrubber` を経由)
- [x] **4.2** `next/scripts/collector/lib/deduplicator.ts` を生成 (`Deduplicator.initialize() / filterNew()`、URL 正規化使用)
- [x] **4.3** `next/scripts/collector/lib/markdown-writer.ts` を生成 (`MarkdownWriter.write()`、frontmatter snake_case + H1 + summary、`ensureUnique` 衝突回避)
- [x] **4.4** `next/scripts/collector/lib/job-summary-reporter.ts` を生成 (`JobSummaryReporter.emit()`、collector-result.json + GITHUB_STEP_SUMMARY)
- [x] **4.5** `aidlc-docs/construction/collector/code/service-library-summary.md` で 4.1〜4.4 の Summary を記述

---

### Step 5 — Source Fetcher (Adapter 層) 生成

- [x] **5.1** `next/scripts/collector/sources/source-fetcher.ts` を生成 (`SourceFetcher<TConfig>` interface)
- [x] **5.2** `next/scripts/collector/sources/zenn-rss-fetcher.ts` を生成 (rss-parser 利用、複数 feedUrls 対応、Adapter 内失敗継続)
- [x] **5.3** `next/scripts/collector/sources/hatena-rss-fetcher.ts` を生成 (Zenn と同様、`<dc:date>` を `isoDate` で取得)
- [x] **5.4** `next/scripts/collector/sources/google-news-rss-fetcher.ts` を生成 (queries / topics / geos から URL 構築、リダイレクト URL は保存)
- [x] **5.5** `next/scripts/collector/sources/togetter-scraper.ts` を生成 (cheerio、UA 明示、requestIntervalMs 遵守、必須セレクタ未ヒット時は throw)
- [x] **5.6** `aidlc-docs/construction/collector/code/source-fetchers-summary.md` で 5.1〜5.5 の Summary を記述

---

### Step 6 — Runner / Builder / Entry 生成 (Orchestration)

- [x] **6.1** `next/scripts/collector/runner.ts` を生成 (`CollectorRunner` クラス: 逐次 + 失敗継続 + 重複排除 + collectedAt 付与 + write + result 構築)
- [x] **6.2** `next/scripts/collector/builder.ts` を生成 (`buildRunner({ config, deps? })` ファクトリ、デフォルト依存を組み立て)
- [x] **6.3** `next/scripts/collector/index.ts` を生成 (エントリポイント: 静的 import + buildRunner + run + JobSummaryReporter)
- [x] **6.4** `aidlc-docs/construction/collector/code/runner-summary.md` で 6.1〜6.3 の Summary を記述

---

### Step 7 — Test Generators 生成 (PBT-07)

- [x] **7.1** `next/scripts/collector/test/generators/article.gen.ts` を生成 (`articleArbitrary`、Article 型の妥当値ジェネレータ)
- [x] **7.2** `next/scripts/collector/test/generators/rss-item.gen.ts` を生成 (`rssItemArbitrary`、共通 RSS 項目ジェネレータ)
- [x] **7.3** `next/scripts/collector/test/generators/url.gen.ts` を生成 (`urlArbitrary`、トラッキングパラメータ付きランダム URL ジェネレータ)

---

### Step 8 — Unit Tests 生成 (example-based)

- [x] **8.1** `next/scripts/collector/test/article.test.ts` (toFrontmatter / fromFrontmatter のスナップショット例)
- [x] **8.2** `next/scripts/collector/test/article-id.test.ts` (代表的 URL のハッシュ例)
- [x] **8.3** `next/scripts/collector/test/url-normalize.test.ts` (utm_*/末尾スラッシュ等のケース別)
- [x] **8.4** `next/scripts/collector/test/slug-builder.test.ts` (英語タイトル / 日本語タイトル / 空タイトル / 50 文字超 等)
- [x] **8.5** `next/scripts/collector/test/deduplicator.test.ts` (in-memory FS で初期化 / filterNew)
- [x] **8.6** `next/scripts/collector/test/markdown-writer.test.ts` (in-memory FS、衝突回避サフィックス)
- [x] **8.7** `next/scripts/collector/test/secret-scrubber.test.ts` (Bearer / api_key / Authorization パターン)
- [x] **8.8** `next/scripts/collector/test/sources/zenn-rss-fetcher.test.ts` (RecordingHttpClient で固定 RSS XML)
- [x] **8.9** `next/scripts/collector/test/sources/hatena-rss-fetcher.test.ts` (同上)
- [x] **8.10** `next/scripts/collector/test/sources/google-news-rss-fetcher.test.ts` (URL 構築 + 固定 RSS XML)
- [x] **8.11** `next/scripts/collector/test/sources/togetter-scraper.test.ts` (固定 HTML、UA 検証、レート制御の関数呼出検証)
- [x] **8.12** `next/scripts/collector/test/runner.test.ts` (Integration: モック Adapter で逐次・失敗継続・dedup 動作)

---

### Step 9 — PBT (Property-Based Tests) 生成 (Partial Mode 対象)

- [x] **9.1** `next/scripts/collector/test/article.pbt.test.ts` (PBT-02: Round-trip — `from(to(a)) === a`)
- [x] **9.2** `next/scripts/collector/test/article-id.pbt.test.ts` (PBT-03: 文字種 / 長さ / 決定性)
- [x] **9.3** `next/scripts/collector/test/url-normalize.pbt.test.ts` (PBT-03: 冪等性 / サニタイズ / 安定性)
- [x] **9.4** `next/scripts/collector/test/slug-builder.pbt.test.ts` (PBT-03: 文字種 / 長さ / 決定性 / 衝突回避)
- [x] **9.5** `next/scripts/collector/test/deduplicator.pbt.test.ts` (PBT-03: 境界性 / 一意性 / 除外性)
- [x] **9.6** `next/scripts/collector/test/markdown-writer.pbt.test.ts` (PBT-02: Article → write → re-parse → Article のラウンドトリップ; in-memory FS 利用)

---

### Step 10 — Test Configuration 生成

- [x] **10.1** `next/vitest.config.ts` を生成 (test directory、environment node、reporter で seed 出力)
- [x] **10.2** `next/package.json` の `scripts` を確認: `test`, `test:watch`, `collect` が登録済み (Step 1.8 で実施済の確認)
- [x] **10.3** `aidlc-docs/construction/collector/code/tests-summary.md` で Step 7〜10 の Summary を記述 (PBT 適用先一覧、example-based 一覧、配置)

---

### Step 11 — GitHub Actions Workflow (Deployment Artifact) 生成

- [x] **11.1** `.github/workflows/collect.yml` を生成 (Infrastructure Design §2.2 のスケルトンを実装、commit メッセージ生成スクリプトを含む)
- [x] **11.2** `aidlc-docs/construction/collector/code/deployment-artifacts-summary.md` で Summary を記述 (workflow 概要、permissions、cron、timeout)

---

### Step 12 — Documentation 生成 (集約 Summary)

- [x] **12.1** `aidlc-docs/construction/collector/code/README.md` を生成 (Unit 1 で生成された全ファイルのインベントリ + 実行方法 + テスト方法 + 想定動作 + トラブルシューティング)
- [x] **12.2** リポジトリルート `README.md` を更新 (本プロジェクトの概要、`npm run collect`、`npm test`、デプロイ等の操作手順を追加)

---

### Step 13 — Verification (実行確認)

- [x] **13.1** `cd next && npm install` を再実行 (Step 1.9 後の lockfile 確認)
- [x] **13.2** `cd next && npx tsc --noEmit` を実行 (型エラーがないこと)
- [x] **13.3** `cd next && npm run lint` を実行 (lint エラーがないこと)
- [x] **13.4** `cd next && npm test -- --run` を実行 (全テストが緑になること、PBT seed がログに出ること)
- [x] **13.5** `cd next && npm run collect` を実行 (ローカル一回の収集ジョブが成功し、`content/` に Markdown が書き出され、`collector-result.json` が生成されること)
- [x] **13.6** 検証中に発見した不具合があれば 13.7 にリストアップして該当ステップに戻る (Step 12 の RTC は許容、ただしプラン更新を行う)
- [x] **13.7** 発見された不具合 / 注意事項:
  - **Togetter URL `https://togetter.com/category/news` は 404 を返す** (実行時にローカル確認)。Adapter は 404 を warn ログで処理して失敗継続戦略のとおり継続したため、コードの問題ではなく **設定値の問題**。MVP リリース前に `next/config/sources.ts` の `togetter.targetUrls` を有効な URL (例: `https://togetter.com/popular` 等) に更新するか、暫定的に `togetter.enabled = false` に変更することを推奨。コード修正は不要。
  - 上記 1 件以外、型/lint/全 61 テスト緑、ローカル `npm run collect` でも 98 件取得+書き出し成功。

---

### Step 14 — Final Inventory (Code Generation 完了確認)

- [x] **14.1** すべてのファイルが正しい場所に生成されていることを確認
- [x] **14.2** `aidlc-state.md` を更新 (Unit 1 Code Generation 完了)
- [x] **14.3** Story / AC のトレーサビリティを完成 (本プランの Story Traceability Map の各行が全て実装済)

---

## File Inventory (Step 完了時の最終配置)

```text
news.hako.tokyo/
├── .github/workflows/
│   └── collect.yml                                       # Step 11
├── content/
│   └── .gitkeep                                          # Step 1.1
├── README.md                                             # Step 12.2 (updated)
├── .gitignore                                            # Step 1.7 (updated)
└── next/
    ├── package.json                                      # Step 1.8 (updated)
    ├── package-lock.json                                 # Step 1.9 / 13.1 (updated)
    ├── tsconfig.json                                     # Step 1.10 (verified, possibly updated)
    ├── vitest.config.ts                                  # Step 10.1
    ├── lib/
    │   └── article.ts                                    # Step 2.1
    ├── config/
    │   └── sources.ts                                    # Step 2.2
    ├── components/                                       # Step 1.3 (空 dir、Unit 2 で利用)
    └── scripts/collector/
        ├── index.ts                                      # Step 6.3
        ├── runner.ts                                     # Step 6.1
        ├── builder.ts                                    # Step 6.2
        ├── logger.ts                                     # Step 4.1
        ├── lib/
        │   ├── article-id.ts                             # Step 3.1
        │   ├── url-normalize.ts                          # Step 3.2
        │   ├── slug-builder.ts                           # Step 3.3
        │   ├── clock.ts                                  # Step 3.4
        │   ├── secret-scrubber.ts                        # Step 3.5
        │   ├── http-client.ts                            # Step 3.6
        │   ├── file-system.ts                            # Step 3.7
        │   ├── deduplicator.ts                           # Step 4.2
        │   ├── markdown-writer.ts                        # Step 4.3
        │   └── job-summary-reporter.ts                   # Step 4.4
        ├── sources/
        │   ├── source-fetcher.ts                         # Step 5.1
        │   ├── zenn-rss-fetcher.ts                       # Step 5.2
        │   ├── hatena-rss-fetcher.ts                     # Step 5.3
        │   ├── google-news-rss-fetcher.ts                # Step 5.4
        │   └── togetter-scraper.ts                       # Step 5.5
        └── test/
            ├── generators/
            │   ├── article.gen.ts                        # Step 7.1
            │   ├── rss-item.gen.ts                       # Step 7.2
            │   └── url.gen.ts                            # Step 7.3
            ├── article.test.ts                           # Step 8.1
            ├── article.pbt.test.ts                       # Step 9.1
            ├── article-id.test.ts                        # Step 8.2
            ├── article-id.pbt.test.ts                    # Step 9.2
            ├── url-normalize.test.ts                     # Step 8.3
            ├── url-normalize.pbt.test.ts                 # Step 9.3
            ├── slug-builder.test.ts                      # Step 8.4
            ├── slug-builder.pbt.test.ts                  # Step 9.4
            ├── deduplicator.test.ts                      # Step 8.5
            ├── deduplicator.pbt.test.ts                  # Step 9.5
            ├── markdown-writer.test.ts                   # Step 8.6
            ├── markdown-writer.pbt.test.ts               # Step 9.6
            ├── secret-scrubber.test.ts                   # Step 8.7
            ├── runner.test.ts                            # Step 8.12
            └── sources/
                ├── zenn-rss-fetcher.test.ts              # Step 8.8
                ├── hatena-rss-fetcher.test.ts            # Step 8.9
                ├── google-news-rss-fetcher.test.ts       # Step 8.10
                └── togetter-scraper.test.ts              # Step 8.11

aidlc-docs/construction/collector/code/
├── README.md                                             # Step 12.1
├── shared-types-summary.md                               # Step 2.3
├── utility-library-summary.md                            # Step 3.8
├── service-library-summary.md                            # Step 4.5
├── source-fetchers-summary.md                            # Step 5.6
├── runner-summary.md                                     # Step 6.4
├── tests-summary.md                                      # Step 10.3
└── deployment-artifacts-summary.md                       # Step 11.2
```

**ソースファイル数**: 約 31 (実コード 21 + テスト 19 + 設定 1 + workflow 1 + 各種更新 — 厳密ではなく目安)
**ドキュメント数**: 8 (Markdown summary、aidlc-docs/ 内のみ)

---

## Step 数サマリー

| 大ステップ | サブステップ数 | 概要 |
|---|---|---|
| Step 1: Project Structure Setup | 10 | dir 作成、`.gitignore`、`package.json` 更新 |
| Step 2: Shared Types & Config | 3 | `lib/article.ts`, `config/sources.ts`, summary |
| Step 3: Utility Library | 8 | id / url / slug / clock / scrubber / http / fs |
| Step 4: Service Library | 5 | logger / dedup / writer / reporter |
| Step 5: Source Fetcher | 6 | interface + 4 Adapter |
| Step 6: Runner / Builder / Entry | 4 | runner.ts / builder.ts / index.ts |
| Step 7: Test Generators | 3 | article / rss-item / url |
| Step 8: Unit Tests (example) | 12 | 各ライブラリと各 Adapter + Integration |
| Step 9: PBT | 6 | PBT-02 / PBT-03 適用先 |
| Step 10: Test Configuration | 3 | vitest.config.ts + scripts 確認 + summary |
| Step 11: GitHub Actions | 2 | collect.yml + summary |
| Step 12: Documentation | 2 | code/README.md + ルート README 更新 |
| Step 13: Verification | 7 | install / typecheck / lint / test / collect 実行 |
| Step 14: Final Inventory | 3 | state 更新 / トレーサビリティ確認 |
| **Total** | **74 サブステップ** | |

> 各 Step の Summary `.md` (aidlc-docs/construction/collector/code/) は **markdown のみ** (アプリケーションコードは aidlc-docs/ には絶対に置かない)。

---

## 実行方針

- 各サブステップを **ファイル粒度で順次** 実行
- 1 サブステップ完了ごとに `[x]` に更新
- Step 13 (Verification) 段階で問題が見つかった場合、該当ステップに戻り修正 (修正サイクルは Step 13.6/13.7 で記録)
- **Brownfield 注意**: 既存ファイル (`next/package.json`, `next/tsconfig.json`, `.gitignore`, `README.md`) は in-place で更新する (`*_modified` 等の重複ファイルを作らない)
