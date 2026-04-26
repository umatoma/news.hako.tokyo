# Infrastructure Design — Unit 1 (Collector)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Infrastructure Design (depth: minimal)
**Created**: 2026-04-25

このドキュメントは Unit 1 (News Collection Service / Collector) の **インフラサービスマッピング** を確定します。本ユニットのインフラは **GitHub Actions のみ** で完結します (Vercel 連携は Unit 2 / Build and Test で扱う)。

---

## 1. インフラサービス選定サマリー

| カテゴリ | 採用 | 用途 |
|---|---|---|
| Compute | **GitHub Actions** (`ubuntu-latest` runner) | Collector の cron / 手動実行 |
| Storage | **GitHub リポジトリ** (`content/*.md`、Git 管理) | 収集した Markdown の永続化 |
| Networking | **GitHub Actions Egress** (任意の外部 HTTPS) | Zenn / Hatena / Google ニュース / Togetter への HTTP GET |
| Monitoring | **GitHub Actions ログ + Job Summary + Artifacts** | 実行結果の記録・通知 |
| Secrets | **GitHub Actions Secrets** (将来拡張用、MVP では未使用) | API キー等の安全な管理 |
| Authentication | **GITHUB_TOKEN** (自動発行) | `contents: write` で `content/` への commit/push |

**採用しないインフラ**: AWS / GCP / Azure / 専用 VPS / DB / メッセージキュー / CDN (Web 側の Vercel は Unit 2)。

---

## 2. ファイル: `.github/workflows/collect.yml`

### 2.1 役割
- **schedule トリガ**: 毎日 22:00 UTC (= 翌 07:00 JST)、1 日 1 回 cron 実行 (U1-NFR-CI-01)
- **workflow_dispatch トリガ**: 手動実行 (FR-03, U1-NFR-CI-02)
- **処理**: Collector を実行 → 取得した Markdown を `content/` にコミット → main に push

### 2.2 ファイル仕様 (実装は Code Generation で確定)

```yaml
name: collect
run-name: "Collect news (${{ github.event_name }})"

on:
  schedule:
    - cron: "0 22 * * *"
  workflow_dispatch: {}

# Q1=B: 先行実行を待ち、後続はキューに入る (cancel-in-progress: false)
concurrency:
  group: collect
  cancel-in-progress: false

permissions:
  contents: write   # content/ への commit/push に必要 (U1-NFR-CI-03)

jobs:
  collect:
    runs-on: ubuntu-latest
    timeout-minutes: 10   # Q2=A: 5 分予算の保険 (10 分で強制切断)
    defaults:
      run:
        working-directory: next   # next/package.json + scripts/collector を持つ
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          # commit 戦略のため、main に push できる権限を持った状態で checkout
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: npm
          cache-dependency-path: next/package-lock.json

      - name: Install deps
        run: npm ci

      - name: Run collector
        run: npm run collect
        env:
          # MVP では未使用、将来 API キーが必要なソースが追加されたら ↓ を有効化
          # NEWSAPI_KEY: ${{ secrets.NEWSAPI_KEY }}
          GITHUB_STEP_SUMMARY: ${{ env.GITHUB_STEP_SUMMARY }}

      - name: Upload artifact (collector-result.json)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: collector-result-${{ github.run_id }}
          path: next/collector-result.json   # 出力先 (Code Generation で確定)
          if-no-files-found: warn
          retention-days: 30

      - name: Commit & push if changes exist
        # 0 件取得時はコミットせず終了 (U1-NFR-CI-06)
        run: |
          cd "${{ github.workspace }}"   # commit はリポジトリルートで実施
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add content/
          if git diff --cached --quiet; then
            echo "No changes to commit"
            exit 0
          fi
          # コミットメッセージは Code Generation で確定 (perSourceCount を埋めて生成)
          MESSAGE_FILE="$(mktemp)"
          node -e "/* compose chore(collector): add N articles (zenn=A, ...) */"
          git commit -F "$MESSAGE_FILE"
          git push origin main
```

> 上記は **設計の青写真** であり、`run` ブロックの細部スクリプト (commit メッセージ生成、collector-result.json から perSource を取り出す処理等) は **Code Generation 段階** で確定します。

### 2.3 環境変数 / Secrets
- **MVP では Secrets 不要** (採用ソースは API キー不要)。
- **将来用の経路**: 例えば NewsAPI を将来追加する場合は `NEWSAPI_KEY` を Secrets に登録、ワークフロー内で `secrets.NEWSAPI_KEY` で参照。コードへのハードコードは絶対禁止 (BR-75 / U1-NFR-SEC-02)。
- `GITHUB_STEP_SUMMARY` は GitHub Actions が自動的に提供する環境変数 (Markdown ファイルパス)。

### 2.4 Permissions の最小化
- **デフォルト**: `permissions: { contents: write }` を job に付与
- **不要な権限**: `pull-requests`, `issues`, `actions` 等は **付与しない** (least privilege)。
- **GITHUB_TOKEN**: GitHub Actions が自動発行、上記 permissions に従ったスコープで `git push` 可能。

---

## 3. cron スケジュールの確認

| 項目 | 値 |
|---|---|
| cron 式 | `0 22 * * *` (毎日 22:00 UTC) |
| JST 換算 | 翌 07:00 JST |
| 想定実行時間 | 1〜2 分 (Adapter HTTP × 4 ソース、件数上限 50/30) |
| timeout | 10 分 (Q2=A) |
| 同時実行制御 | concurrency `group: collect, cancel-in-progress: false` (Q1=B) |

> **GitHub Actions の cron は理想時刻ぴったりではなく数分〜十数分の遅延** があり得る (公式ドキュメントで明記)。要件 FR-03 は「毎朝 7:00 JST」と表記しているが、許容範囲内 (個人利用、SLA なし)。

---

## 4. Workflow の失敗通知

- GitHub のデフォルト通知に依拠 (U1-NFR-REL-04)
- ユーザー (umatoma さん) のリポジトリ通知設定 (Settings > Notifications) で「Failed workflows」が有効であれば、メール/GitHub 通知が届く
- MVP では追加通知 (Slack / Discord / メール SMTP 等) を **設定しない**

---

## 5. リソース使用量 / GitHub Actions 無料枠の見積り

| 項目 | 値 |
|---|---|
| 1 回あたりの実行時間 (推定) | 1〜2 分 |
| 1 日あたり実行回数 | 1 (cron) + 不定回 (手動) |
| 1 ヶ月あたり実行時間 | ~30〜60 分 |
| GitHub Free プランの枠 | 月 2,000 分 (private repo)、public repo は **無制限** |
| 想定: ユーザーは public repo を選ぶ可能性が高い | 制約問題なし |

> RISK-03 (GitHub Actions 無料枠超過) は、本収集ジョブだけでは到達しない見込み。Unit 2 の CI ワークフロー追加分を含めても問題なし。

---

## 6. Storage 見積り

- 1 記事あたり Markdown ファイルサイズ: ~1〜5 KB (frontmatter + title + summary)
- 1 日あたり新規記事数: ~50〜140 件 (Adapter 別 maxItemsPerRun の合計、重複除外後はもっと少ない)
- 1 年あたり: ~18,000〜50,000 ファイル (~30〜250 MB)
- GitHub リポジトリの推奨上限: 5 GB (warn) / 100 GB (hard limit)
- → MVP の MVP 期間 (1〜2 週間) と中期運用 (1〜2 年) では **問題なし**
- RISK-04 (Markdown ファイル肥大化) は将来対応 (アーカイブ / ローテーション)。MVP では考慮不要 (要件 RISK-04 と整合)。

---

## 7. SECURITY コンプライアンス再確認

| ID | 対応 |
|---|---|
| U1-NFR-SEC-01〜02 (Secrets 管理) | 上記 §2.3 の方針 (MVP 不要、将来用経路確保) |
| U1-NFR-SEC-03 (`.env.local` ignore) | リポジトリの `.gitignore` で確認 (Code Generation で追加) |
| U1-NFR-SEC-04 (ログ secrets 排除) | `SecretScrubber` (NFR Design §7) を Logger で経由 |
| U1-NFR-SEC-05 (`npm audit`) | Unit 2 の CI ワークフロー (`ci.yml`) に組込 (Unit 2 Infrastructure Design で確定) |
| U1-NFR-SEC-06 (`gitleaks`) | 同上 |
| U1-NFR-SEC-07 (User-Agent / Rate) | Collector 実装内で対応 (HttpClient + TogetterScraper) |

---

## 8. 拡張機能コンプライアンス サマリー (本ステージ)

### Security Baseline
- 拡張機能 **無効** のため SECURITY-01〜15 すべて **N/A**
- ただし以下のルール群が実質的に類似のガード機能を提供:
  - Secrets 管理 (将来用): U1-NFR-SEC-01〜02
  - 最小権限: 上記 §2.4 の `contents: write` のみ
  - ロギング: U1-NFR-OBS-01〜03

### PBT (Partial)
- 本ステージ (Infrastructure Design) は PBT 適用対象外 (PBT は Code Generation / Build and Test 段階で評価)
- PBT-09 (Framework Selection) は既確定 (Vitest + fast-check)
