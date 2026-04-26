# E2E Test Instructions

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Build and Test
**Generated**: 2026-04-26

---

## Purpose

ブラウザレベルでの動作確認 (Playwright)。`next start` で起動した本番ビルドに対して E2E テストを実行します (Q1=A、U2-NFR-TEST-03)。

---

## Test Scope (Q2=A 最小限)

| 観点 | 検証内容 |
|---|---|
| ヘッダー件数表示 | `data-testid="header-article-count"` が表示され、テキストに「件」を含む |
| フッター最終更新 | `data-testid="footer-last-updated"` が表示される |
| 記事リンクの target | 全 `data-testid="article-link"` の最初の要素に `target="_blank"` が設定 |
| 記事リンクの rel | `rel` 属性に `noopener` と `noreferrer` を含む |
| 記事リンクの href | `https?://` で始まる絶対 URL |

> 空状態 UI / ダーク・ライトテーマ / レスポンシブ等は MVP では対象外 (将来拡張可能)。

---

## Setup E2E Test Environment

### 1. (初回のみ) Playwright ブラウザのインストール

```bash
cd next
npm run test:e2e:install   # = playwright install --with-deps chromium
```

### 2. ローカルでの実行 (任意)

```bash
cd next
npm run build              # 本番ビルドを作る
npm run test:e2e           # webServer (`npm start`) を自動起動 → e2e/*.spec.ts を実行
```

`playwright.config.ts` の `webServer` で `npm start` (= `next start`) を自動起動・停止します。

### 3. CI での実行

`.github/workflows/ci.yml` の `e2e` ジョブで自動実行:
1. `npm ci`
2. `npm run test:e2e:install` (Chromium インストール)
3. `npm run build`
4. `npm run test:e2e`

---

## Run E2E Tests

```bash
cd next
npm run test:e2e
```

**Expected**: 全 4 テストが緑 (Home page スイート内)

```
Running 4 tests using 1 worker

  ✓ Home page (/) > renders header with article count
  ✓ Home page (/) > renders footer with last-updated indicator
  ✓ Home page (/) > article links open in a new tab with safe rel attributes
  ✓ Home page (/) > article link href is an absolute URL

  4 passed (Xs)
```

---

## Troubleshooting

| 症状 | 対処 |
|---|---|
| `webServer timed out`  | `npm install` 未実行の可能性。`npm ci` を先に実行 |
| `Browser not installed`  | `npm run test:e2e:install` を実行 |
| 記事リンクが 0 件で fail | `<repo-root>/content/*.md` が空の可能性。`npm run collect` を 1 回実行してから再実行 |
| Production ビルド未生成 | `npm run build` を先に実行 |
| Playwright trace を見たい | テスト失敗時 `next/test-results/` 配下に trace が出力 (config の `trace: "on-first-retry"`) |

---

## CI Artifact (失敗時)

CI で失敗した場合、Playwright の trace は GitHub Actions Artifact として保存されます (デフォルト設定では未保存。必要に応じて `actions/upload-artifact@v4` を `e2e` ジョブに追加可能)。

将来的に追加する場合の例:
```yaml
- if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-traces
    path: next/test-results/
    retention-days: 7
```

(MVP では未実装、必要に応じて Operations フェーズで追加)
