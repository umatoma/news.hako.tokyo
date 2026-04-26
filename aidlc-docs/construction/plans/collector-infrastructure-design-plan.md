# Infrastructure Design Plan — Unit 1: Collector

**Project**: news.hako.tokyo
**Unit**: U1 (News Collection Service / Collector)
**Stage**: CONSTRUCTION — Infrastructure Design (depth: **minimal**)
**Created**: 2026-04-25

このプランは Unit 1 (Collector) のインフラ設計を確定するための計画書と質問群です。本ユニットのインフラは **GitHub Actions のみ** (Vercel 連携は Unit 2 で扱う) で、確定事項が多いため **質問は 2 問のみ** に絞ります。

---

## Tracking Checklist

- [x] Step 1: Analyze design artifacts (functional design + nfr design 読込)
- [x] Step 2: Create infrastructure design plan (this file)
- [x] Step 3: Generate context-appropriate questions (2 問のみ)
- [x] Step 4: Store plan
- [ ] Step 5: Collect and analyze answers
- [ ] Step 6: Generate infrastructure design artifacts
- [ ] Step 7: Present completion message
- [ ] Step 8: Approval
- [ ] Step 9: Record approval and update progress

---

## 既に確定済みのインフラ判断 (再掲)

| 項目 | 確定 | 出典 |
|---|---|---|
| Deployment Environment | GitHub Actions のみ (Collector)、Vercel は Unit 2 | requirements.md, NFR-05 |
| Compute | GitHub Actions ubuntu-latest runner (Node.js 24.13.1 via setup-node + .nvmrc) | tech-stack-decisions.md §1, §5 |
| Storage | リポジトリ自体 (`content/*.md`, Git 管理) | requirements.md FR-04 |
| Messaging | 不要 (1 ユニット内で完結) | — |
| Networking | GitHub Actions が外部 HTTPS を発信、追加設定なし | — |
| Monitoring | GitHub Actions ログ + Job Summary + artifact, 失敗通知はデフォルト | nfr-requirements.md U1-NFR-OBS-01〜05 |
| Secrets | MVP では不要 (将来拡張時に GitHub Actions Secrets) | nfr-requirements.md U1-NFR-SEC-01〜02 |
| cron 式 | `0 22 * * *` (毎日 22:00 UTC = 翌 07:00 JST) | Q10=A, U1-NFR-CI-01 |
| Manual trigger | `workflow_dispatch` 有効 | FR-03, U1-NFR-CI-02 |
| Permissions | `contents: write` (collected Markdown を `content/` にコミット) | U1-NFR-CI-03 |
| Git commit/push 戦略 | 直接 `main` に push (個人利用) | U1-NFR-CI-04 |
| Commit message | `chore(collector): add N articles (zenn=A, hatena=B, googlenews=C, togetter=D)` | U1-NFR-CI-05 |
| 0 件取得時 | コミットせず終了 | U1-NFR-CI-06 |
| `gitleaks` (CI 全般) | PR + main push 時、検出は CI 失敗 | U1-NFR-CI-08 |
| `npm audit` (CI 全般) | PR + main push 時、警告通知のみ | U1-NFR-CI-07 |
| artifact upload | `actions/upload-artifact@v4` で `collector-result.json` をアップ | tech-stack-decisions.md §5 |
| Job Summary | `$GITHUB_STEP_SUMMARY` に Markdown 整形して書き出し | U1-NFR-OBS-02 |

> **ファイル**: `.github/workflows/collect.yml` (新規作成、Code Generation で実装)

---

## Infrastructure Design Questions (2 問のみ)

### Question 1: Workflow の concurrency 制御

`collect.yml` (cron + workflow_dispatch) で同一ワークフローが重複実行された場合の挙動は?

A) **`concurrency: { group: collect, cancel-in-progress: true }`** — 後続実行が走ると先行実行をキャンセル。最新の状態を優先。
B) **`concurrency: { group: collect, cancel-in-progress: false }`** — 先行実行を完了まで待ち、後続はキューに入る。安全。
C) **concurrency 設定なし** — 並行実行を許容 (1 日 1 回 cron + 稀な手動実行のため衝突しにくい)。シンプル。
D) **おまかせ** — 推奨 (B) を採用、git push 時の競合を避けつつデータ欠損もない
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2: ジョブのタイムアウト (`timeout-minutes`)

CollectorRunner 1 回の実行時間予算は **5 分以内** (Q2=A) ですが、GitHub Actions 側の `timeout-minutes` を保険として何分に設定しますか?

A) **`timeout-minutes: 10`** — 5 分予算の 2 倍を上限 (CollectorRunner 内部で詰まっても最終的に切る)
B) **`timeout-minutes: 30`** — 余裕を持たせる
C) **設定なし** — GitHub Actions のデフォルト (6 時間) に委ねる
D) **おまかせ** — 推奨 (A の 10 分) を採用
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。
