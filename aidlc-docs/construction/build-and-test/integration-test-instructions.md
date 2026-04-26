# Integration Test Instructions

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Build and Test
**Generated**: 2026-04-26

---

## Purpose

Unit 1 (Collector) と Unit 2 (Web Frontend) の連携を検証します。両ユニットは **`<repo-root>/content/*.md` の Markdown** を介して連携するため、統合テストは以下を確認します:

1. **Collector が出力した Markdown を Web Frontend が正しく読み込める**
2. **frontmatter スキーマ (snake_case) が両者で一致する**
3. **Vercel ビルドで `<repo-root>/content/` を正しく取得できる**

---

## Test Scenarios

### Scenario 1: Collector → Markdown → Web Frontend の往復

- **目的**: Collector が出力した実 Markdown を Web Frontend がエラーなく Article 配列にできる
- **Setup**:
  1. クリーンな `content/` 状態を作る (任意): `git stash` または別ブランチ
  2. `npm run collect` を実行 (Unit 1 が `<repo-root>/content/` に Markdown を書き出す)
- **Test Steps**:
  1. `npm run build` を実行 (Unit 2 の `Home` が `getAllArticles()` を呼び、frontmatter を `fromFrontmatter` でパース)
  2. ビルド成功 + 静的 HTML が生成されること
  3. `<repo-root>/next/.next/server/app/index.html` (または相当) に **ヘッダーの件数** が反映されていること
- **Expected Results**:
  - ビルドが exit code 0 で終了
  - 生成される静的 HTML の `<title>` が `news.hako.tokyo`、`<html lang="ja">`
  - ヘッダー件数 = `<repo-root>/content/*.md` の数
- **Cleanup**: 通常不要 (`content/` は永続)

### Scenario 2: 不正 frontmatter での Build Fail

- **目的**: 不正 Markdown が混在するとビルドが fail-fast でエラーになる
- **Setup**: `<repo-root>/content/bad.md` を以下の内容で作成
  ```
  ---
  id: x
  title: bad
  ---

  本文
  ```
  (zod schema 必須フィールドが不足)
- **Test Steps**: `npm run build`
- **Expected Results**:
  - ビルドが exit code 非 0 で失敗
  - エラーメッセージに `Invalid frontmatter in <path>` が含まれる
- **Cleanup**: `rm content/bad.md`

### Scenario 3: 0 件の content/ で Build 成功 + 空状態 UI

- **目的**: `content/` が空でもビルドが通り、`EmptyState` UI が表示される
- **Setup**: 一時的に `content/*.md` を削除 (`mkdir empty-content && export CONTENT_DIR=$(pwd)/empty-content`)
- **Test Steps**: `cd next && npm run build`
- **Expected Results**:
  - ビルド成功
  - HTML 内に「まだ記事がありません」が含まれる
- **Cleanup**: `unset CONTENT_DIR && rmdir empty-content`

---

## 実行コマンド (簡易シーケンス)

```bash
# 1. 環境準備
cd /path/to/news.hako.tokyo
nvm use

# 2. 依存セットアップ
cd next
npm ci

# 3. Collector 実行 (Scenario 1)
npm run collect

# 4. Build (Web Frontend が content/ を読む)
npm run build

# 5. (任意) ローカル起動して動作確認
npm run start
# → http://localhost:3000 で一覧表示を確認
```

---

## サービス間結合の確認ポイント

| 観点 | 期待値 |
|---|---|
| frontmatter キー命名 | snake_case (両者一致、`published_at`, `collected_at`, `thumbnail_url`) |
| Article 型のフィールド | id / title / url / source / publishedAt / collectedAt / summary / tags / thumbnailUrl |
| URL 重複排除キー | `normalizeUrlForDedup` で正規化済み URL (Unit 1 / Unit 2 とも `next/scripts/collector/lib/url-normalize.ts` を参照) |
| ファイル配置 | `<repo-root>/content/{date}-{slug}[-N].md` |
| Source ID | `"zenn"`, `"hatena"`, `"googlenews"`, `"togetter"` のいずれか |

これらは **Unit 1 と Unit 2 の唯一のインターフェース契約** です。違反するとビルドが fail-fast で停止します。

---

## CI 上の統合テスト

GitHub Actions の `ci.yml` の以下のジョブが実質的な統合テストの役割を担います:

- `static-checks` ジョブ: Unit 1 + Unit 2 の全 76 テスト (vitest + PBT)
- `build` ジョブ: 実 `content/*.md` を読み込んで `next build` 成功
- `e2e` ジョブ: 起動した Web Frontend に対して Playwright で E2E

これら 3 ジョブが緑になることで、統合シナリオが網羅されます。
