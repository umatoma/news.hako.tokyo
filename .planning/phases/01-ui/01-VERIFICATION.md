---
phase: 01-ui
verified: 2026-05-31T00:05:00Z
status: human_needed
score: 5/5
overrides_applied: 0
human_verification:
  - test: "ブラウザでトップページを開き、タブの視覚的強調が意図通りか確認する"
    expected: "選択中タブに下線アクセント（zinc-900 ボーダー）が表示され、非選択タブは zinc-500 で薄く表示される"
    why_human: "Tailwind クラスの視覚的表現はコードグレップでは確認不可"
  - test: "タブをクリックして絞り込み後、ページをリロードし「すべて」タブに戻ることを確認する"
    expected: "リロード後は必ず「すべて」が選択状態（aria-selected=\"true\"）で表示される"
    why_human: "E2E テストは初回表示のみカバー。リロード後の挙動をブラウザ実機で目視確認"
  - test: "直近3日に記事がないソース（例: togetter）のタブをクリックし「まだ記事がありません」が表示されることを確認する"
    expected: "「まだ記事がありません」のテキストが画面中央に表示される"
    why_human: "E2E テストはデータ依存（togetter に記事があれば空表示パスを通らない）"
---

# フェーズ 1: ソース別タブ UI 検証レポート

**フェーズゴール:** ユーザーが画面上部のタブでニュースソースを切り替えて、そのソースの記事だけを閲覧できる
**検証日時:** 2026-05-31T00:05:00Z
**ステータス:** human_needed
**再検証:** いいえ（初回検証）

---

## ゴール達成状況

### 観察可能な真実（Observable Truths）

| # | 真実（Success Criteria） | ステータス | 証拠 |
|---|--------------------------|-----------|------|
| 1 | ユーザーはページ上部に「すべて / Zenn / はてブ / Google ニュース / Togetter」のタブを見ることができる（SRC-01） | ✓ VERIFIED | `SOURCE_TABS` に5要素（all/zenn/hatena/googlenews/togetter）定義済み。E2E テスト `shows all source tabs with 'all' selected by default` が PASS |
| 2 | タブをクリックするとそのソースの記事だけに絞り込まれ、他のソースは表示されない（SRC-02） | ✓ VERIFIED | `filterArticlesBySource` が `sourceId` 一致でフィルタ。E2E テスト `clicking a source tab filters articles without changing URL` が URL 不変 + 絞り込みを確認して PASS |
| 3 | ソースを絞り込んでも直近3日以内の記事のみ表示（SRC-03） | ✓ VERIFIED | `page.tsx` の RSC が `filterArticlesWithinDays(candidates, DISPLAY_WINDOW_DAYS, now)` を維持。Client Component はサーバー側で既に3日フィルタ済みの `views` を受け取るだけ |
| 4 | 初回表示・リロード後は「すべて」タブが選択された状態（SRC-04） | ✓ VERIFIED | `useState<SourceTabId>("all")` 初期値で担保。E2E テストが `aria-selected="true"` を確認して PASS |
| 5 | 選択ソースに直近3日の記事がない場合「記事がありません」メッセージ表示（SRC-05） | ✓ VERIFIED | `filtered.length === 0` のとき既存 `EmptyState`（`data-testid="empty-state-message"`、文言「まだ記事がありません」）を表示。コード実装・ユニットテスト（空配列ケース）の両方で確認 |

**スコア:** 5/5 真実を検証済み

---

### 必須成果物（Artifacts）

| 成果物 | 期待内容 | ステータス | 詳細 |
|--------|---------|-----------|------|
| `next/components/source-tabs.tsx` | `"use client"` + `useState` + SourceId フィルタ（min 30行） | ✓ VERIFIED | 56行。`"use client"` 先頭行。`useState<SourceTabId>("all")`。`filterArticlesBySource` 呼び出し。`data-testid` + `aria-selected` 付き |
| `next/lib/source-tabs-utils.ts` | `SOURCE_TABS`（5要素）と `filterArticlesBySource` 定義 | ✓ VERIFIED | 29行。`SOURCE_TABS` に `all` 先頭 + `ARTICLE_SOURCES` 4件。`filterArticlesBySource` は非変異実装 |
| `next/lib/articles.ts` | `SOURCE_TABS` / `filterArticlesBySource` を re-export | ✓ VERIFIED | `source-tabs-utils.ts` からの re-export が行 15 に確認済み |
| `next/app/page.tsx` | RSC が全ソース `views` を取得し `SourceTabs` に渡す | ✓ VERIFIED | `<SourceTabs views={views} />` が行 32 に存在。`filterArticlesWithinDays` 呼び出しも維持 |
| `next/components/source-tabs.test.tsx` | `SOURCE_TABS` 構造と `filterArticlesBySource` の4ケース | ✓ VERIFIED | 82行。4ケース（all/特定ソース/空配列/非変異）すべて実装。119 PASS |
| `next/e2e/home.spec.ts` | ソースタブ happy path（初期選択・絞り込み・URL 不変） | ✓ VERIFIED | `source-tab-(all|zenn|hatena|googlenews|togetter)` が8件以上ヒット。`page.url()` 確認が2件。6 PASS |

---

### キーリンク（Key Links）

| From | To | Via | ステータス | 詳細 |
|------|----|-----|-----------|------|
| `next/app/page.tsx` | `next/components/source-tabs.tsx` | `<SourceTabs views={views} />` props | ✓ WIRED | `page.tsx` 行1: import 確認。行32: `<SourceTabs views={views} />` 確認 |
| `next/components/source-tabs.tsx` | `next/lib/source-tabs-utils.ts` | `SOURCE_TABS` / `filterArticlesBySource` import | ✓ WIRED | `source-tabs.tsx` 行9-12 で import 確認。行21・行30 で実際に使用 |
| `next/lib/articles.ts` | `next/lib/source-tabs-utils.ts` | re-export | ✓ WIRED | `articles.ts` 行8-15 で import + `export { filterArticlesBySource, SOURCE_TABS }` 確認 |

---

### データフロートレース（Level 4）

| 成果物 | データ変数 | ソース | リアルデータを返すか | ステータス |
|--------|-----------|--------|---------------------|-----------|
| `SourceTabs` | `views: ArticleListItemView[]` | `page.tsx` RSC が `articleRepository.getArticlesPublishedSince` → `filterArticlesWithinDays` → `toListItemView` | ✓ FS ベースのリアルデータ（markdown ファイルから zod パース） | ✓ FLOWING |
| `filterArticlesBySource(views, selected)` | `filtered` | `views` props 経由 | ✓ props として受け取った全件をフィルタするのみ | ✓ FLOWING |

---

### テスト実行結果（Behavioral Spot-Checks）

| テスト種別 | コマンド | 結果 | ステータス |
|-----------|---------|------|-----------|
| ユニットテスト（全119件） | `npx vitest run` | 22 test files, 119 tests PASS | ✓ PASS |
| 型チェック | `npx tsc --noEmit` | エラーなし | ✓ PASS |
| E2E テスト（全6件） | `npx playwright test e2e/home.spec.ts` | 6 PASS | ✓ PASS |

---

### 要件カバレッジ

| 要件 | ソースプラン | 説明 | ステータス | 証拠 |
|------|------------|------|-----------|------|
| SRC-01 | 01-01-PLAN.md | 全タブ表示（すべて/Zenn/はてブ/Google ニュース/Togetter） | ✓ SATISFIED | `SOURCE_TABS` 5要素定義、E2E PASS |
| SRC-02 | 01-01-PLAN.md | URL 非変更のクライアント内フィルタ | ✓ SATISFIED | `useState` + `filterArticlesBySource`、E2E `page.url()` 不変確認 |
| SRC-03 | 01-01-PLAN.md | 直近3日フィルタ維持 | ✓ SATISFIED | RSC の `filterArticlesWithinDays` 呼び出し継続 |
| SRC-04 | 01-01-PLAN.md | 初回/リロード後「すべて」選択 | ✓ SATISFIED | `useState("all")` 初期値、E2E PASS |
| SRC-05 | 01-01-PLAN.md | 記事なし時の「記事がありません」表示 | ✓ SATISFIED | `filtered.length === 0` で `EmptyState` 表示、ユニットテスト空配列ケース PASS |

**カバレッジ:** SRC-01〜SRC-05 すべて SATISFIED（5/5）

---

### アンチパターンスキャン

| ファイル | 行 | パターン | 深刻度 | 影響 |
|---------|---|---------|--------|-----|
| 対象5ファイル | - | TBD/FIXME/XXX | なし | - |
| 対象5ファイル | - | placeholder/stub パターン | なし | - |

スキャン対象ファイル: `source-tabs.tsx`, `source-tabs-utils.ts`, `articles.ts`, `page.tsx`, `home.spec.ts`
検出されたデットマーカー・スタブパターン: **0件**

---

### 実装上の注目事項（プランからの逸脱・INFO）

`articles.ts` が `node:fs` に依存しているため、Client Component から直接 import できない問題が発生した。`source-tabs-utils.ts` を純粋モジュールとして分離し、`articles.ts` から re-export する構成で解決している。プランの `must_haves.artifacts` では `articles.ts` が `SOURCE_TABS` を「提供する」と記載されているが、実際は `source-tabs-utils.ts` が定義元で `articles.ts` は re-export 経由。機能的には等価であり、外部 import パス（`@/lib/articles`）は変わらない。

---

### 人手検証が必要な項目

#### 1. タブの視覚的強調スタイル

**テスト:** ブラウザ（`npm run dev`）でトップページを開き、各タブをクリックして視覚的強調を確認する
**期待値:** 選択中タブに下線アクセント（`border-zinc-900`/ダーク `border-zinc-50`）が表示され、非選択タブは `text-zinc-500` で薄く表示される。既存のサイトトーン（zinc 系）と調和している
**人手が必要な理由:** Tailwind クラスの視覚的表現はコードグレップでは確認不可。レスポンシブ・ダークモードも含めた目視確認が必要

#### 2. リロード後「すべて」タブへの復帰

**テスト:** ブラウザで Zenn タブをクリックして絞り込み後、ページをリロードする
**期待値:** リロード後は「すべて」タブが選択状態（`aria-selected="true"`）で全記事が表示される
**人手が必要な理由:** E2E テストは初回表示（`page.goto("/")`）のみカバー。リロード（F5 / Ctrl+R）後の挙動をブラウザ実機で確認する必要がある。`useState` 初期値は実装上担保されているが、実際のブラウザ動作で確認する

#### 3. 直近3日に記事がないソースでの空表示（SRC-05）

**テスト:** 直近3日に記事がないソースのタブをクリックする（togetter または記事が少ない場合 googlenews）
**期待値:** 「まだ記事がありません」テキストが画面中央に表示される
**人手が必要な理由:** E2E テストはデータ依存（実際に記事がゼロのソースが存在しないとブランチを通らない）。ユニットテストでロジックは確認済みだが、実ブラウザでの表示確認を推奨

---

## ギャップサマリー

自動検証可能な5つの成功基準はすべて VERIFIED。コード実装・型チェック・ユニットテスト（119件 PASS）・E2E テスト（6件 PASS）がすべてクリーン。

未解決ギャップ: **0件**

上記3件は視覚/体験品質の確認であり、コードのブロッカーではない。人手確認後に `status: passed` へ更新可能。

---

_検証日時: 2026-05-31T00:05:00Z_
_検証者: Claude (gsd-verifier)_
