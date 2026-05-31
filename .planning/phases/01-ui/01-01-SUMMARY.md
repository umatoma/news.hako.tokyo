---
phase: 01-ui
plan: "01"
subsystem: フロントエンド UI
tags:
  - source-tabs
  - client-component
  - filtering
dependency_graph:
  requires: []
  provides:
    - SourceTabs Client Component
    - SOURCE_TABS / filterArticlesBySource ヘルパー
  affects:
    - next/app/page.tsx
tech_stack:
  added:
    - next/lib/source-tabs-utils.ts（node:fs 非依存の純粋モジュール）
    - next/components/source-tabs.tsx（"use client" / useState）
  patterns:
    - RSC → Client Component の props 受け渡し（ArticleListItemView[] を serializable props として渡す）
    - node:fs 依存コードと純粋関数の分離（source-tabs-utils.ts バレル）
key_files:
  created:
    - next/components/source-tabs.tsx
    - next/components/source-tabs.test.tsx
    - next/lib/source-tabs-utils.ts
  modified:
    - next/lib/articles.ts
    - next/lib/articles.test.ts
    - next/app/page.tsx
    - next/e2e/home.spec.ts
    - next/vitest.config.ts
decisions:
  - articles.ts に node:fs があるため Client Component から直接 import できない → source-tabs-utils.ts を分離し articles.ts から re-export する構成を採用
  - source-tabs.test.tsx は @testing-library/react なし（既存環境に未インストール）でロジックテストとして実装、vitest include を *.test.{ts,tsx} に拡張
  - role="tab" / role="tablist" を付与して aria-selected の ESLint 警告を修正（アクセシビリティ対応）
metrics:
  duration: "約10分"
  completed_date: "2026-05-30"
---

# フェーズ 01 プラン 01: ソース別タブ UI Summary

**一言要約:** `useState` で選択タブを管理する `SourceTabs` Client Component を追加し、RSC から `ArticleListItemView[]` を受け取りクライアント内でソース別フィルタリングを実現（SRC-01〜SRC-05 成立）

## 完了したタスク

| タスク | 名前 | コミット | 主なファイル |
|--------|------|---------|------------|
| 1 | E2E happy path テスト追加（RED） | 4525db3 | next/e2e/home.spec.ts |
| 2 | タブ定義/フィルタヘルパー + SourceTabs + page.tsx 配線 | b653fe3 | next/lib/articles.ts, next/components/source-tabs.tsx, next/app/page.tsx |
| 3 | スタイル仕上げ・E2E グリーン・バンドル修正 | 2aad071 | next/components/source-tabs.tsx, next/lib/source-tabs-utils.ts |

## 成果物

### 新規作成ファイル

- **next/lib/source-tabs-utils.ts** — `SourceTabId` 型、`SOURCE_TABS`（5要素）、`filterArticlesBySource` を `node:fs` 非依存で定義。Client Component から安全に import できる純粋モジュール。
- **next/components/source-tabs.tsx** — `"use client"` + `useState<SourceTabId>("all")` でタブ選択を管理。`SOURCE_TABS` を `role="tablist"` + `role="tab"` ボタン群としてレンダリング。`filterArticlesBySource` でフィルタし、空なら `EmptyState`、それ以外は `ArticleList` を表示。
- **next/components/source-tabs.test.tsx** — `SOURCE_TABS` 構造・`filterArticlesBySource` の4ケース（all/特定ソース/該当なし/非変異）を Vitest でテスト。

### 変更ファイル

- **next/lib/articles.ts** — `SourceTabId`/`SOURCE_TABS`/`filterArticlesBySource` を `source-tabs-utils.ts` から re-export。
- **next/lib/articles.test.ts** — `SOURCE_TABS` の構造テスト・`filterArticlesBySource` の4ケースを追加（計 35 → 42 テスト）。
- **next/app/page.tsx** — `EmptyState`/`ArticleList` 直接呼び出しを `<SourceTabs views={views} />` に置き換え。RSC のデータ取得（`filterArticlesWithinDays`）は維持。
- **next/e2e/home.spec.ts** — ソースタブの happy path テストを追加（初期選択・タブ一覧・クリック後フィルタ・URL 不変）。
- **next/vitest.config.ts** — `include` を `**/*.test.{ts,tsx}` に拡張。

## 要件充足

| 要件 | 状態 | 確認方法 |
|------|------|---------|
| SRC-01: 全タブ表示 | ✓ | E2E: `source-tab-all/zenn/hatena/googlenews/togetter` 表示確認 |
| SRC-02: URL 非変更クライアント切り替え | ✓ | E2E: クリック後 `page.url()` 不変確認 |
| SRC-03: 直近3日フィルタ維持 | ✓ | `filterArticlesWithinDays` を RSC で継続使用 |
| SRC-04: 初回「すべて」選択 | ✓ | `useState("all")` 初期値 |
| SRC-05: 記事なし時の空表示 | ✓ | 既存 `EmptyState` コンポーネント再利用 |

## プランからの逸脱

### 自動修正した問題

**1. [Rule 3 - ブロッカー] Client Component バンドルエラー修正**
- **発見時:** Task 3 の `npm run build` 時
- **問題:** `source-tabs.tsx`（`"use client"`）が `articles.ts` を import しており、`articles.ts` が `node:fs` を使用しているためバンドルエラーが発生
- **修正:** `source-tabs-utils.ts` を新規作成（`node:fs` 非依存）し、`articles.ts` からは re-export する構成に変更
- **変更ファイル:** `next/lib/source-tabs-utils.ts`（新規）、`next/lib/articles.ts`（re-export 追加）、`next/components/source-tabs.tsx`（import 先変更）
- **コミット:** 2aad071

**2. [Rule 2 - アクセシビリティ] aria-selected の ESLint 警告修正**
- **発見時:** Task 3 の ESLint 実行時
- **問題:** `<button>` に `aria-selected` を使用すると `role="tab"` が必要という警告
- **修正:** `<nav>` に `role="tablist"`、各ボタンに `role="tab"` を付与
- **変更ファイル:** `next/components/source-tabs.tsx`
- **コミット:** 2aad071

**3. [Rule 3 - ブロッカー] vitest の include パターン拡張**
- **発見時:** Task 2 の `source-tabs.test.tsx` 実行時
- **問題:** `vitest.config.ts` の `include: ["**/*.test.ts"]` が `.tsx` ファイルを対象外にしていた
- **修正:** `include` を `["**/*.test.{ts,tsx}"]` に拡張
- **変更ファイル:** `next/vitest.config.ts`
- **コミット:** b653fe3

**4. [Rule 3 - ブロッカー] @testing-library/react 不使用の代替実装**
- **発見時:** Task 2 の `source-tabs.test.tsx` 実装時
- **問題:** `@testing-library/react` および jsdom が未インストール（`environment: "node"`）でコンポーネントの DOM テストが不可
- **修正:** `source-tabs.test.tsx` をコンポーネントロジック（`SOURCE_TABS`/`filterArticlesBySource`）の統合テストとして実装（プランの acceptance_criteria「SOURCE_TABS 構造・filterArticlesBySource の4ケース」を満たす）
- **コミット:** b653fe3

## 検証結果

```
全ユニットテスト: 119 passed (22 test files)
全 E2E テスト:   6 passed (1 test file)
型チェック:      エラーなし
ESLint:          エラーなし
ビルド:          成功（Static ページとして生成）
```

## 既知のスタブ

なし — 全データフローは RSC から `ArticleListItemView[]` としてリアルデータが渡される。

## 脅威フラグ

なし — 新規ネットワークエンドポイント・認証パス・信頼境界変更なし。クライアント側表示フィルタのみ。

## セルフチェック: 合格

- [x] `next/components/source-tabs.tsx` 存在確認 → 作成済み
- [x] `next/lib/source-tabs-utils.ts` 存在確認 → 作成済み
- [x] コミット 4525db3 / b653fe3 / 2aad071 存在確認 → git log 確認済み
- [x] 全テスト PASS 確認済み
