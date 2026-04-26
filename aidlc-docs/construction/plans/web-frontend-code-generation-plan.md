# Code Generation Plan — Unit 2: Web Frontend

**Project**: news.hako.tokyo
**Unit**: U2 (Web Frontend / News Listing Service)
**Stage**: CONSTRUCTION — Code Generation
**Created**: 2026-04-26
**Single Source of Truth**: ✅

---

## Unit Context

### Stories / Requirements 参照
- **FR-01**: ニュース一覧表示
- **FR-04**: ビルドとデプロイ (SSG + Vercel)
- **FR-05**: UI / 表示 (日本語、システム設定追従ダーク、レスポンシブ)
- **AC-01**: main push → Vercel 自動デプロイ → 本番 URL 表示
- **AC-06**: タイトル/ソース/公開日/外部リンク表示・遷移
- **AC-07**: CI で lint + typecheck + unit + E2E 緑
- **AC-08**: PBT (PBT-03) が CI で実行
- **AC-10**: ライト/ダーク両 OS 設定でレイアウト崩れなし
- **U2-NFR-PERF-01**: ビルド 30 秒以内

### 依存
- Unit 1 で確定: `next/lib/article.ts` (Article 型 + zod schema)、`gray-matter`、`zod`、`vitest`、`fast-check`
- 新規追加: `@playwright/test`

---

## Story Traceability Map

| Step | 関連 |
|---|---|
| Step 2 (`lib/articles.ts`) | FR-01, AC-06, BR-13, U2-BR-01〜09, U2-BR-13〜15, U2-BR-19〜20 |
| Step 3 (Components) | FR-01, FR-05, AC-06, AC-10, U2-BR-10〜17, U2-BR-18〜24, U2-BR-30〜34 |
| Step 4 (`app/page.tsx` + `layout.tsx`) | FR-01, AC-01, U2-BR-25〜28, U2-BR-40〜44 |
| Step 5 (`public/robots.txt`) | NFR-02, U2-NFR-SEO-01 |
| Step 6 (Tests + PBT) | AC-07, AC-08, U2-NFR-TEST-01, PBT-03 |
| Step 7 (Playwright + E2E) | AC-07, U2-NFR-TEST-02〜04 |
| Step 8 (`.github/workflows/ci.yml`) | NFR-05, U2-NFR-CI-01〜07 |
| Step 9 (Documentation) | (本プランの完了確認) |
| Step 10 (Verification) | AC-01, AC-06, AC-07, AC-08, AC-10 を検証 |

---

## Execution Steps

### Step 1 — Project Structure Setup

- [x] **1.1** `next/e2e/` ディレクトリ作成
- [x] **1.2** `next/package.json` を更新: `@playwright/test` を devDependencies に追加、`test:e2e` / `test:e2e:install` scripts を追加
- [x] **1.3** `npm install` を実行 (`@playwright/test` を取り込み)

---

### Step 2 — Shared Lib (Repository + 純粋関数群) 生成

- [x] **2.1** `next/lib/articles.ts` を生成 (`ArticleRepository` interface + `FsArticleRepository` 実装、`sortArticlesForDisplay`、`toListItemView`、`formatPublishedAt`、`computePageStats`、`SOURCE_LABEL`、`resolveContentDir`、`articleRepository` default instance)
- [x] **2.2** `aidlc-docs/construction/web-frontend/code/lib-summary.md` を生成

---

### Step 3 — UI Components 生成

- [x] **3.1** `next/components/header.tsx`
- [x] **3.2** `next/components/footer.tsx`
- [x] **3.3** `next/components/empty-state.tsx`
- [x] **3.4** `next/components/source-badge.tsx`
- [x] **3.5** `next/components/article-list-item.tsx`
- [x] **3.6** `next/components/article-list.tsx`
- [x] **3.7** `aidlc-docs/construction/web-frontend/code/components-summary.md`

---

### Step 4 — App Pages (in-place 更新)

- [x] **4.1** `next/app/layout.tsx` を更新 (`<html lang="ja">`, metadata `news.hako.tokyo`)
- [x] **4.2** `next/app/page.tsx` を完全置換 (Home component が articleRepository から取得 → ソート → View 化 → Header/ArticleList or EmptyState/Footer 構成)
- [x] **4.3** `next/app/globals.css` を確認 (Tailwind v4 の dark variant 適用、不足があれば最小限の追記)

---

### Step 5 — robots.txt

- [x] **5.1** `next/public/robots.txt` を生成 (`User-agent: * / Disallow: /`)

---

### Step 6 — Unit Tests + PBT

- [x] **6.1** `next/lib/articles.test.ts` (example-based: sortArticlesForDisplay / toListItemView / formatPublishedAt / computePageStats / FsArticleRepository with InMemoryFileSystem)
- [x] **6.2** `next/lib/articles.pbt.test.ts` (PBT-03: sortArticlesForDisplay の不変条件)

---

### Step 7 — E2E Tests (Playwright)

- [x] **7.1** `next/playwright.config.ts` 生成
- [x] **7.2** `next/e2e/home.spec.ts` 生成 (Q2=A 最小限: 件数表示 / 各記事リンクの target=_blank + rel)

---

### Step 8 — GitHub Actions CI Workflow

- [x] **8.1** `.github/workflows/ci.yml` 生成 (Infrastructure Design §3.1 のスケルトンを実装)

---

### Step 9 — Documentation Summary

- [x] **9.1** `aidlc-docs/construction/web-frontend/code/README.md` (Unit 2 全成果物のインベントリ + 操作手順 + トラブルシューティング)
- [x] **9.2** ルート `README.md` の追記 (必要に応じて)

---

### Step 10 — Verification

- [x] **10.1** `cd next && npx tsc --noEmit` (型エラーなし)
- [x] **10.2** `cd next && npm run lint` (lint エラーなし)
- [x] **10.3** `cd next && npm run test:run` (Unit 1 + Unit 2 全テスト緑、PBT seed ログ)
- [x] **10.4** `cd next && npm run build` (ビルド成功、30 秒以内)
- [x] **10.5** `cd next && npm run dev` で `http://localhost:3000` にアクセスできることを軽く確認 (注: ターミナル経由のビジュアル確認は限定的なので、ビルドアウトプットの存在で代替する)
- [x] **10.6** Playwright E2E は CI 上での動作前提とし、ローカルでの実行はオプション (ブラウザバイナリの DL 時間が長い)
- [x] **10.7** 発見された不具合 / 注意事項を記録

---

### Step 11 — Final Inventory

- [x] **11.1** すべてのファイルが正しい場所にあることを確認
- [x] **11.2** `aidlc-state.md` を Unit 2 Code Generation 完了で更新
- [x] **11.3** Story / AC のトレーサビリティ完成

---

## File Inventory (実行後)

```text
news.hako.tokyo/
├── .github/workflows/
│   └── ci.yml                              (Step 8)
└── next/
    ├── package.json                        (Step 1, updated)
    ├── package-lock.json                   (Step 1, updated)
    ├── playwright.config.ts                (Step 7)
    ├── e2e/
    │   └── home.spec.ts                    (Step 7)
    ├── public/
    │   └── robots.txt                      (Step 5)
    ├── app/
    │   ├── layout.tsx                      (Step 4, updated)
    │   ├── page.tsx                        (Step 4, replaced)
    │   └── globals.css                     (Step 4, possibly updated)
    ├── components/
    │   ├── header.tsx                      (Step 3)
    │   ├── footer.tsx                      (Step 3)
    │   ├── empty-state.tsx                 (Step 3)
    │   ├── source-badge.tsx                (Step 3)
    │   ├── article-list-item.tsx           (Step 3)
    │   └── article-list.tsx                (Step 3)
    └── lib/
        ├── article.ts                      (Unit 1 確定済、変更なし)
        ├── articles.ts                     (Step 2)
        ├── articles.test.ts                (Step 6)
        └── articles.pbt.test.ts            (Step 6)

aidlc-docs/construction/web-frontend/code/
├── README.md                               (Step 9)
├── lib-summary.md                          (Step 2)
└── components-summary.md                   (Step 3)
```

---

## Step 数サマリー

| 大ステップ | サブステップ | 概要 |
|---|---|---|
| 1. Project Structure Setup | 3 | Playwright 追加、e2e dir |
| 2. Shared Lib | 2 | articles.ts + summary |
| 3. UI Components | 7 | 6 components + summary |
| 4. App Pages | 3 | layout + page + globals |
| 5. robots.txt | 1 | — |
| 6. Unit Tests + PBT | 2 | example + pbt |
| 7. E2E Tests | 2 | config + spec |
| 8. GitHub Actions CI | 1 | ci.yml |
| 9. Documentation | 2 | code README + root README |
| 10. Verification | 7 | typecheck / lint / test / build / dev / e2e / 不具合記録 |
| 11. Final Inventory | 3 | 確認 / state / トレーサビリティ |
| **Total** | **33** | |
