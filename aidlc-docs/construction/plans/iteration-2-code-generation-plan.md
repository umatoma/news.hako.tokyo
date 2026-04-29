# Code Generation Plan — Iteration 2 (Feature Change)

**Unit**: `iteration-2-feature-change` (single logical unit)
**Created**: 2026-04-29
**Source**: `aidlc-docs/inception/plans/execution-plan-iteration-2.md` + `requirements.md` Section 11

---

## Pre-Approval Note

ユーザーは以下を一括承認済み (2026-04-29T12:05:00Z):
> "承認します、実装してプッシュ、その後はニュース取得用の Workflow を手動トリガー、まで進めておいて下さい"

これにより Code Generation Part 1 (Plan) → Part 2 (Generate) → Build & Test → Git push → `gh workflow run collect.yml` を連続実行する。Part 1/Part 2 間の追加ゲートは事前承認で代替する。

---

## Implementation Checklist

### Step 1: Source config update (`next/config/sources.ts`)
- [x] 1.1 `zenn.maxItemsPerRun`: 50 → **10**
- [x] 1.2 `hatena.maxItemsPerRun`: 50 → **10**
- [x] 1.3 `hatena.feedUrls`: `["https://b.hatena.ne.jp/hotentry/it.rss"]` → **`["https://b.hatena.ne.jp/hotentry.rss"]`** (総合)
- [x] 1.4 `googlenews.maxItemsPerRun`: 50 → **10**
- [x] 1.5 `togetter.maxItemsPerRun`: 30 → **10**
- [x] 1.6 `queries` / `topics` / `targetUrls` などその他は無変更

### Step 2: Filter function (`next/lib/articles.ts`)
- [x] 2.1 `filterArticlesWithinDays(articles, days, now?)` を新規 export 追加
  - 純粋関数。`days` は非負整数を想定。`now` はテスト用に省略可、デフォルトは `new Date()`
  - `Date.parse(article.publishedAt)` を使い、`reference - days * 86_400_000 ≤ parsed` の記事のみ返す
  - 入力配列は不変 (新配列を返す)

### Step 3: Page integration (`next/app/page.tsx`)
- [x] 3.1 import に `filterArticlesWithinDays` を追加
- [x] 3.2 `await articleRepository.getAllArticles()` の結果を **`filterArticlesWithinDays(articles, 3)`** でフィルタしてから `sortArticlesForDisplay` に渡す
- [x] 3.3 `computePageStats` および `views` もフィルタ後の配列ベースに変更 (FR-NEW-01: 表示対象 = 直近 3 日)

### Step 4: Unit tests (`next/lib/articles.test.ts`)
- [x] 4.1 `filterArticlesWithinDays` の単体テスト 4 件以上:
  - 範囲内のみ通過
  - 境界値 (now ちょうどの publishedAt は通過)
  - 空配列で空配列
  - 入力を破壊しない (非ミューテーション)

### Step 5: PBT (`next/lib/articles.pbt.test.ts`)
- [x] 5.1 PBT-03 不変条件 4 件:
  - フィルタ結果の `id` 集合は入力の `id` 集合の部分集合
  - 件数 ≤ 入力件数
  - 全要素が `now - days * 86_400_000` 以降の publishedAt
  - days をフィットさせると monotonicity (大 days ⇒ 小 days の結果を包含)

### Step 6: 検証 (Build & Test)
- [x] 6.1 `npx tsc --noEmit` (typecheck)
- [x] 6.2 `npm run lint` (eslint)
- [x] 6.3 `npm run test:run` (vitest unit + PBT)
- [x] 6.4 `npm run build` (Next.js production build)
- [ ] 6.5 (skip: e2e はローカルブラウザ DL 不要なら CI に委ねる)

### Step 7: Commit & push
- [x] 7.1 `git add` for the 5 changed source files
- [x] 7.2 `git commit -m "feat: limit collection to 10 items per source and filter list to last 3 days"`
- [x] 7.3 `git push origin main`

### Step 8: Trigger collect workflow
- [x] 8.1 `gh workflow run collect.yml`
- [x] 8.2 `gh run list --workflow=collect.yml --limit=1` で即座にトリガ確認

---

## Acceptance Criteria Mapping

| AC | カバー Step |
|---|---|
| AC-11 (`maxItemsPerRun=10` × 4 ソース) | Step 1 |
| AC-12 (はてブ総合 URL) | Step 1.3 |
| AC-13 (公開日 3 日以内のみ表示) | Step 2, 3 |
| AC-14 (Markdown 全件保持) | Step 1〜3 (削除処理は追加しない) |
| AC-15 (PBT 緑) | Step 5, 6.3 |
| AC-16 (既存 76 tests 緑) | Step 6.3 |

---

## Risk Assessment

| 項目 | 評価 |
|---|---|
| Scope | Single package (`next/`) |
| Reversibility | Easy — 単一 commit revert |
| Test coverage | 既存 76 tests + 新規 unit + PBT |
| Side effects | None on infra/CI/cron |

---

## Out-of-scope (再掲)

- フィルタ閾値のユーザー設定化
- カテゴリ別 / ソース別の絞り込み UI
- E2E スペックの大幅変更 (既存 `home.spec.ts` は記事件数の固定アサーションを持たないため変更不要と判定)
