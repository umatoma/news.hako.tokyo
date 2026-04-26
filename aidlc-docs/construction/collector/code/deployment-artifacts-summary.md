# Deployment Artifacts — Code Summary

**Generated**: 2026-04-25
**Step**: 11.1〜11.2

## ファイル一覧

| Path | 役割 |
|---|---|
| `.github/workflows/collect.yml` | 収集ジョブの GitHub Actions ワークフロー |
| `next/scripts/collector/compose-commit-message.js` | `collector-result.json` から commit メッセージを生成する Node.js スクリプト |

## `.github/workflows/collect.yml`

### トリガ
- `schedule: cron: "0 22 * * *"` (毎日 22:00 UTC = 翌 07:00 JST)
- `workflow_dispatch: {}` (手動)

### concurrency (Q1=B)
- `group: collect`、`cancel-in-progress: false`

### permissions (最小化)
- `contents: write`

### timeout (Q2=A)
- `timeout-minutes: 10`

### Steps
1. `actions/checkout@v4` (`fetch-depth: 0`)
2. `actions/setup-node@v4` (`.nvmrc` から Node.js バージョン取得、npm cache: `next/package-lock.json`)
3. `npm ci` (`working-directory: next`)
4. `npm run collect` (`working-directory: next` — 環境変数 `GITHUB_STEP_SUMMARY` は GitHub Actions が自動で渡す)
5. `actions/upload-artifact@v4` で `next/collector-result.json` を upload (30 日保持)
6. Commit & push (差分なしなら exit 0、差分あれば `chore(collector): add N articles (zenn=A, ...)` で commit + push)

## `compose-commit-message.js`

- Node.js 標準のみ (依存追加なし)
- `next/collector-result.json` を読込 (失敗時はフォールバックメッセージ)
- `totalNew` と `perSource.{source}.fetched` を埋めて文字列を生成
- stdout に出力 (workflow が `$()` で受け取る)

例:
```
chore(collector): add 42 articles (zenn=23, hatena=15, googlenews=4, togetter=0)
```

## トレーサビリティ

- FR-03 (自動収集ジョブ): collect.yml
- AC-02 / AC-03 (手動実行 / cron 実行): `workflow_dispatch` / `schedule`
- U1-NFR-CI-01 (cron 式): `0 22 * * *`
- U1-NFR-CI-03 (permissions): `contents: write` のみ
- U1-NFR-CI-04 (commit 戦略): main 直接 push、`github-actions[bot]` 名義
- U1-NFR-CI-05 (commit message): `compose-commit-message.js`
- U1-NFR-CI-06 (0 件時はコミットなし): `git diff --cached --quiet` で判定
- U1-NFR-OBS-02 (Job Summary + artifact): collector が `GITHUB_STEP_SUMMARY` に書き出し + `upload-artifact`

## 関連: CI ワークフロー (`ci.yml`)

PR 時 + main push 時の **lint + typecheck + test + gitleaks + npm audit** は **Unit 2 の Infrastructure Design** で `ci.yml` として作成予定。本ファイルは収集ジョブ専用。
