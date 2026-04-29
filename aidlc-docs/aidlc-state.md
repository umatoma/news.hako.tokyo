# AI-DLC State Tracking

## Project Information
- **Project Name**: news.hako.tokyo
- **Project Type**: Brownfield (Next.js scaffolding が存在)
- **Start Date**: 2026-04-25T08:46:47Z
- **Current Phase**: OPERATIONS (Placeholder)
- **Current Stage**: AI-DLC ワークフロー完了 (MVP スコープ)
- **Completion Date**: 2026-04-26T12:12:00Z

## Workspace State
- **Existing Code**: Yes (Next.js 16.2.4 ボイラープレートのみ)
- **Programming Languages**: TypeScript, CSS
- **Build System**: npm (package.json)
- **Project Structure**: Next.js App Router 単一プロジェクト (`next/` 配下)
- **Reverse Engineering Needed**: Yes (成果物が未存在)
- **Workspace Root**: ~/workspaces/news.hako.tokyo

## Code Location Rules
- **Application Code**: ワークスペースルート配下 (`next/` ディレクトリ — `aidlc-docs/` には決して置かない)
- **Documentation**: `aidlc-docs/` のみ
- **Structure patterns**: `code-generation.md` の Critical Rules を参照

## Extension Configuration
| Extension | Enabled | Decided At | Mode | Notes |
|---|---|---|---|---|
| security-baseline | No | Requirements Analysis | — | Q18=B (個人利用、PoC 相当のため強制適用しない)。ただし API キー漏洩防止等の最小限の配慮は要件として残す。 |
| property-based-testing | Yes (Partial) | Requirements Analysis | Partial | Q19=B (PBT-02, 03, 07, 08, 09 のみ強制適用)。Full ルールファイル読み込み済み。

## Stage Progress

### INCEPTION Phase
- [x] Workspace Detection
- [x] Reverse Engineering (2026-04-25T08:46:47Z 完了 — `aidlc-docs/inception/reverse-engineering/`)
- [x] Requirements Analysis (2026-04-25T08:46:47Z 完了 — `aidlc-docs/inception/requirements/requirements.md`)
- [x] User Stories — **SKIP** (個人利用 / 単独ステークホルダー / シンプルスコープのため)
- [x] Workflow Planning (2026-04-25T08:46:47Z 完了 — `aidlc-docs/inception/plans/execution-plan.md`、承認待ち)
- [x] Application Design (2026-04-25T08:46:47Z 完了 — `aidlc-docs/inception/application-design/`)
- [x] Units Generation (2026-04-25T08:46:47Z 完了 — `aidlc-docs/inception/application-design/unit-of-work*.md`、再承認待ち ※ニュースソースを Google ニュース RSS に変更)
  - Part 1 plan: `aidlc-docs/inception/plans/unit-of-work-plan.md`
  - Decision: 2 ユニット (U1 Collector / U2 Web Frontend)、U1→U2 sequential、コード `next/` 集約 + `content/` リポジトリルート、`next/package.json` 単一、完全逐次
  - Source change applied: NewsAPI → Google ニュース RSS (API キー不要、非公式仕様)。Requirements / Application Design / Units / Workflow Planning を一括更新済み。

### CONSTRUCTION Phase (Per-Unit Loop)
**判定**: Functional Design / NFR Requirements / NFR Design / Infrastructure Design (minimal) / Code Generation すべて **EXECUTE** をユニット毎に実行。

#### Unit 1: Collector (収集ジョブ)
- [x] Functional Design (2026-04-25 完了 — `aidlc-docs/construction/collector/functional-design/`、承認済み)
- [x] NFR Requirements (2026-04-25 完了 — `aidlc-docs/construction/collector/nfr-requirements/`、承認済み)
- [x] NFR Design (2026-04-25 完了 — `aidlc-docs/construction/collector/nfr-design/`、承認済み)
- [x] Infrastructure Design (minimal、2026-04-25 完了 — `aidlc-docs/construction/collector/infrastructure-design/`、承認済み)
- [x] Code Generation Part 1 (Plan 承認済み — `aidlc-docs/construction/plans/collector-code-generation-plan.md`)
- [x] Code Generation Part 2 (実装完了 — 全 76 サブステップ実行、61 tests 緑、`npm run collect` ローカル実行成功 / 承認済み)

#### Unit 2: Web Frontend (一覧表示)
- [x] Functional Design (2026-04-26 完了 — `aidlc-docs/construction/web-frontend/functional-design/`、承認済み)
- [x] NFR Requirements (2026-04-26 完了 — `aidlc-docs/construction/web-frontend/nfr-requirements/`、承認済み)
- [x] NFR Design (2026-04-26 完了 — `aidlc-docs/construction/web-frontend/nfr-design/`、承認済み)
- [x] Infrastructure Design (minimal、2026-04-26 完了 — `aidlc-docs/construction/web-frontend/infrastructure-design/`、承認済み)
- [x] Code Generation (2026-04-26 完了 — 全 33 サブステップ実行、76 tests 緑、ビルド 9.78 秒で成功 / 承認待ち)
- [ ] Infrastructure Design (minimal)
- [ ] Code Generation

#### Post-Units
- [x] Build and Test (2026-04-26 完了 — `aidlc-docs/construction/build-and-test/`、76 tests 緑、ビルド 9.4 秒、承認待ち)

### OPERATIONS Phase
- [x] Operations (Placeholder — 将来拡張用、MVP では実質的に Construction で完結)

---

## Iteration 2 — Feature Change (2026-04-29 開始)

**Trigger**: User request "機能の変更を行いたいです" (2026-04-29T11:30:00Z)
**Project Type**: Brownfield (既存 MVP 上の機能変更)
**Current Phase**: INCEPTION
**Current Stage**: Requirements Analysis (意図確認質問発行中)

### Stage Progress (Iteration 2)
- [x] Workspace Detection (2026-04-29 完了 — 既存成果物が現行と判定、Reverse Engineering スキップ)
- [x] Reverse Engineering — **SKIP** (`aidlc-docs/inception/reverse-engineering/` 成果物が最新)
- [x] Requirements Analysis (2026-04-29 完了 — `aidlc-docs/inception/requirements/requirements.md` Section 11、承認済み)
- [x] User Stories — **SKIP** (個人利用 / 単独ステークホルダー / 小規模 Enhancement、Iteration 1 と同条件)
- [x] Workflow Planning (2026-04-29 完了 — `aidlc-docs/inception/plans/execution-plan-iteration-2.md`、承認待ち)
- [x] Application Design — **SKIP** (新コンポーネントなし、既存ファイル修正のみ)
- [x] Units Generation — **SKIP** (単一作業単位で完結)

### CONSTRUCTION Phase (Iteration 2 — Single Logical Unit: `iteration-2-feature-change`)
- [x] Functional Design — **SKIP** (シンプルなフィルタ関数 + 設定値変更、要件に詳細仕様あり)
- [x] NFR Requirements — **SKIP** (既存 NFR を継承、新規 NFR なし)
- [x] NFR Design — **SKIP** (NFR Requirements がスキップされるため)
- [x] Infrastructure Design — **SKIP** (インフラ変更なし)
- [x] Code Generation (2026-04-29 完了 — Plan: `aidlc-docs/construction/plans/iteration-2-code-generation-plan.md`、実装 5 ファイル + ドキュメント追加)
- [x] Build and Test (2026-04-29 完了 — typecheck ✅ / lint ✅ / 86 tests 緑 / build 2.4 秒 + SSG プリレンダリング成功)
- [x] Git push (commit `2eb50f3` to `origin/main`)
- [x] Manual workflow trigger (Run ID `25089188899`、24 秒で success、`7a84358` で 26 articles 追加: zenn=10/hatena=10/googlenews=10/togetter=10)

### Iteration 2 完了サマリ
- **AC-11 ✅**: 各ソース `maxItemsPerRun=10` (collect ジョブ実行で実証 — zenn=10/hatena=10/googlenews=10/togetter=10)
- **AC-12 ✅**: はてブ URL `https://b.hatena.ne.jp/hotentry.rss` (総合) に変更
- **AC-13 ✅**: ページに `filterArticlesWithinDays(articles, 3)` を適用 (build 時、SSG プリレンダリング)
- **AC-14 ✅**: `content/` の Markdown は全件保持 (削除処理なし、新規追加のみ)
- **AC-15 ✅**: PBT-03 (`filterArticlesWithinDays` の 4 不変条件) が CI で緑
- **AC-16 ✅**: 既存 76 tests + 新規 10 tests = 86 tests すべて緑

### Vercel デプロイ
- main への push (commit `2eb50f3` および `7a84358`) を webhook トリガに自動再ビルド (Vercel Dashboard で実行状況確認)

### Iteration 2 Extension Configuration
| Extension | Enabled | Decided At | Mode | Notes |
|---|---|---|---|---|
| security-baseline | No | Iteration 2 Requirements | — | Q9=A、Iteration 1 を継続 |
| property-based-testing | Yes (Partial) | Iteration 2 Requirements | Partial | Q10=A、Iteration 1 を継続。PBT-02, 03, 07, 08, 09 強制適用。新フィルタ関数に PBT-03 を追加 |

### Iteration 2 Requirement Summary
- 対象領域: Collector 設定 + Web Frontend
- Sources 全 4 件 `maxItemsPerRun=10`、はてブを総合 (`hotentry.rss`) に変更
- 一覧表示フィルタ: 公開日が直近 3 日以内のもののみ (ビルド時判定、Markdown は全件保持)
- 新規 AC-11 〜 AC-16 を追加
- 緊急度: 1〜3 日以内 (Q8=B)
