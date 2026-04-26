# 要件ドキュメント (Requirements)

**Project**: news.hako.tokyo
**Owner / 想定ユーザー**: umatoma さん (個人利用)
**Created**: 2026-04-25
**Source**: `aidlc-docs/inception/requirements/requirement-verification-questions.md` および `requirement-clarification-questions.md` の回答結果。

---

## 1. Intent Analysis Summary

| 項目 | 内容 |
|---|---|
| **User Request** | "AI-DLC を使って開発を始めたいです" + 後続の質問群への回答 |
| **Request Type** | New Project (Next.js スキャフォールド上に機能をゼロから構築) |
| **Scope Estimate** | Single Component (単一の Next.js アプリ + GitHub Actions の収集ジョブ) |
| **Complexity Estimate** | Simple — Moderate (静的サイトだが複数の外部ソースからの収集ジョブを伴う) |
| **Requirements Depth** | **Standard** (要件分析の深度) |

---

## 2. プロダクトビジョン

Zenn / はてなブックマーク / Google ニュース / Togetter から興味のあるカテゴリのニュースを **毎日自動収集** し、**1 ページの一覧** で素早く情報源にアクセスできる、**個人用ニュースリーダー** を構築する。

### 主要価値
- 散在する情報源を 1 つのページに集約し、毎朝の情報収集時間を短縮する。
- データを Markdown + Git で管理することで、過去のニュースを検索・追跡可能な「個人記録」として残す。

### スコープ外 (将来フェーズ候補)
- ニュースの **要約機能** (LLM による日次サマリー、第 2 フェーズで追加予定)
- 個別記事 **詳細ページ** (MVP では一覧から外部 URL に直接遷移する)
- カテゴリ / タグ絞り込み、全文検索
- 認証、コメント、お気に入り
- 他者への公開 (個人利用のみ)

---

## 3. 機能要件 (Functional Requirements)

### FR-01: ニュース一覧表示
- ルート URL `/` に、収集済みニュース記事の一覧を **新着順** で表示する。
- 各記事の表示項目:
  - タイトル (必須)
  - ソース名 (Zenn / はてブ / Togetter / 一般ニュース等のラベル)
  - 公開日 (収集元から取得した日時、または収集日時)
  - 元記事への外部リンク (クリックで新しいタブで開く)
- **ページネーションは MVP 範囲外**。1 日分の収集記事 (数百件以下を想定) を 1 ページに表示する。
- **詳細ページは設けない**。一覧から元記事の外部 URL へ直接遷移する (Clarification Q3 = A)。

### FR-02: 情報収集 (RSS / 外部 API)
- 収集対象:
  - **Zenn**: RSS フィード (例: `https://zenn.dev/feed`、ユーザー / トピック単位 RSS も検討)
  - **はてなブックマーク**: RSS フィード (例: `https://b.hatena.ne.jp/hotentry/it.rss` 等のカテゴリ RSS)
  - **Google ニュース**: 非公式 RSS (API キー不要)
    - キーワード検索: `https://news.google.com/rss/search?q={query}&hl=ja&gl=JP&ceid=JP:ja`
    - トピック別: `https://news.google.com/news/rss/headlines/section/topic/{TOPIC}?hl=ja&gl=JP&ceid=JP:ja` (TOPIC = WORLD / NATION / BUSINESS / TECHNOLOGY / ENTERTAINMENT / SPORTS / SCIENCE / HEALTH)
    - 地理検索: `https://news.google.com/news/rss/headlines/section/geo/{geo}?hl=ja&gl=JP&ceid=JP:ja`
  - **Togetter**: Web スクレイピング (X の代替)
- 収集対象 (RSS URL リスト等) は **ソースコード内の設定ファイル** (`config/sources.ts` 等) に直接記述する (Clarification Q4 = A)。Git で管理することで変更履歴が残る。
- 取得結果は記事メタデータと共に **Markdown ファイル** として `content/` 等のディレクトリ配下に保存する。
- 重複排除: 同一 URL の記事は再収集時にスキップする。

### FR-03: 自動収集ジョブ (GitHub Actions)
- **GitHub Actions のスケジュール実行** で 1 日 1 回 (**毎朝 7:00 JST = 22:00 UTC**) に収集を実行する (Clarification Q5 = A)。
- 収集ジョブは:
  1. 設定ファイルに従って各ソースから記事を取得
  2. 重複排除と Markdown 化
  3. `content/` 配下に新規ファイルとしてコミット
  4. push 経由で Vercel が自動再ビルド・再デプロイ
- 手動実行 (`workflow_dispatch`) も可能とする。
- 収集失敗時のリトライ・エラー通知は MVP では最小限 (GitHub Actions のデフォルト失敗通知に頼る)。

### FR-04: ビルドとデプロイ
- Next.js の **Static Site Generation (SSG)** で全ページを静的生成する (Q10 = A)。
- ビルド時に `content/` 配下の Markdown を読み込み、一覧ページを生成する。
- **Vercel** にデプロイし、main ブランチへの push をトリガに自動再デプロイする (Q9 = A)。

### FR-05: UI / 表示
- **日本語のみ** (i18n は不要、Q13 = A)。
- ライト / ダークの切替 UI は設けず、**ブラウザ / OS のシステム設定に追従する** (Q14 = B)。Tailwind v4 のメディアクエリベース ダーク対応で実装する。
- レスポンシブ対応 (モバイル / デスクトップ閲覧)。

### MVP 範囲外 (将来候補)

| 機能 | フェーズ | 備考 |
|---|---|---|
| LLM による日次要約 (Phase 2) | 第 2 フェーズ | Clarification Q1 = C |
| 個別記事詳細ページ | 第 2 フェーズ以降 | Clarification Q3 = A (MVP は外部リンク) |
| カテゴリ / タグ絞り込み | 未定 | — |
| 全文検索 | 未定 | — |
| 管理画面 / 投稿機能 | 未計画 | 認証なし運用のため |

---

## 4. 非機能要件 (Non-Functional Requirements)

### NFR-01: パフォーマンスとトラフィック
- 想定トラフィック: **1 日数十アクセス未満** (個人利用、Q11 = A)
- ページレスポンスは Vercel CDN の標準で十分。
- ビルド時間: 1 回あたり **2 分以内** を目標 (記事数が増えても 5 分を超えない)。

### NFR-02: SEO
- **不要** (Q12 = C)。
- meta タグ等は最小限 (タイトル / 文字エンコーディング)。構造化データ・OGP 等は実装しない。
- ただし、`robots.txt` で `Disallow: /` をセットし、検索エンジンインデックスから除外する (個人利用の意図に沿う)。

### NFR-03: セキュリティ
- **Security Baseline 拡張機能は無効** (Q18 = B)。本サイトは個人利用かつ静的・閲覧専用のため、ブロッキング制約として強制適用しない。
- ただし、以下の **最低限のセキュリティ配慮** は要件として残す:
  - 採用ソースは Google ニュース RSS への切替により **API キーは不要**。将来的に API キーを要するソースを追加する場合は、**コードにハードコードしない** (GitHub Actions Secrets / Vercel 環境変数で管理) ことを徹底する。
  - `.env.local` は `.gitignore` 済みであることを保証する。
  - 公開 GitHub リポジトリの場合は、Secrets 漏洩スキャン (`gitleaks` 等) を CI に組み込む。
  - 依存ライブラリの脆弱性スキャン (`npm audit`) を CI で実行する。

### NFR-04: テスト
- 方針: **標準的** (Q15 = B) — 主要機能のユニットテスト + 主要フローの E2E。
- 推奨フレームワーク (NFR フェーズで確定):
  - ユニット: **Vitest** (Next.js 16 + Vite との親和性)
  - E2E: **Playwright** (Vercel デプロイのプレビュー URL 検証等)
- **PBT 拡張機能は Partial 適用** (Q19 = B) — PBT-02, 03, 07, 08, 09 のみ強制適用:
  - PBT-02: ラウンドトリップ性 (RSS / API JSON ↔ 内部記事モデル ↔ Markdown のシリアライズ ↔ デシリアライズ)
  - PBT-03: 不変条件 (収集処理で記事数・必須フィールドが保たれる、重複排除後の URL 一意性 等)
  - PBT-07: 生成器品質 (RSS フィードのドメイン型ジェネレータを定義)
  - PBT-08: shrinking + 再現性 (seed ログ、CI 統合)
  - PBT-09: フレームワーク選定 — **fast-check** (Vitest と統合)

### NFR-05: CI/CD
- 方針: **GitHub Actions による完全自動化** (Q16 = A)
- パイプライン項目 (PR 時 / main push 時 / スケジュール時):
  - lint (`next lint`)
  - typecheck (`tsc --noEmit`)
  - unit test (Vitest, fast-check 含む)
  - E2E test (Playwright、必要に応じて Vercel preview URL に対して実行)
  - 自動デプロイ (Vercel 連携 — main push 時)
  - 収集ジョブ (毎朝 7:00 JST にスケジュール実行)

### NFR-06: 開発期間
- **1 〜 2 週間で MVP 完成** を目標 (Q17 = A)。
- スコープを「収集 + 一覧表示 + 自動デプロイ」に絞り込んでいるため達成可能な見込み。

### NFR-07: アクセシビリティ
- 個人利用のため厳密な要求はない。Tailwind の標準的なコントラスト・フォーカス表示を維持する程度に留める。

### NFR-08: 保守性
- TypeScript `strict: true` を維持 (既存設定)。
- ESLint (`eslint-config-next`) を維持し、CI で違反をブロックする。
- 設定 (収集対象 RSS URL 等) は単一ファイルに集約することで、追加・削除を容易にする。

---

## 5. 技術前提 (Technical Context)

| 項目 | 採用技術 | 根拠 |
|---|---|---|
| フレームワーク | Next.js 16.2.4 | 既存スキャフォールド。App Router + SSG。 |
| UI | React 19.2.4 + Tailwind CSS v4 | 既存スキャフォールド。 |
| 言語 | TypeScript 5 (`strict: true`) | 既存スキャフォールド。 |
| ランタイム | Node.js v24.13.1 | `.nvmrc` 指定。 |
| データ永続化 | Markdown + Git | Q8 = A。DB を持ち込まずインフラ最小化。 |
| ホスティング | Vercel | Q9 = A。Next.js との親和性が最高。 |
| レンダリング | SSG | Q10 = A。トラフィック小、コンテンツ更新は 1 日 1 回。 |
| 自動収集 | GitHub Actions (`schedule` + `workflow_dispatch`) | Free Text 指定。 |
| ユニットテスト | Vitest + fast-check (PBT) | NFR-04 で確定 (NFR フェーズで再確認)。 |
| E2E テスト | Playwright | NFR-04 で確定 (NFR フェーズで再確認)。 |
| Lint / Typecheck | ESLint v9 (Flat Config) + tsc | 既存 + CI 強制。 |

### Next.js 16 の留意点
- `next/AGENTS.md` に「Next.js 16 はトレーニング後の breaking changes を含む可能性があるため、コード生成前に `node_modules/next/dist/docs/` を必ず参照」との指示あり。Construction フェーズではこの指示を遵守する。

---

## 6. 主要なリスクと前提

| ID | リスク / 前提 | 影響 | 対応方針 |
|---|---|---|---|
| RISK-01 | **Togetter スクレイピング** の規約・robots.txt 整合 | スクレイピング不可となれば代替手段が必要 | Construction 開始前に Togetter の **利用規約** と **robots.txt** を確認。問題があればソースから除外する。User-Agent / リクエスト頻度を控えめにする。 |
| RISK-02 | **Google ニュース RSS の非公式仕様** | 仕様変更で取得不能になる可能性 (例: 2019 時点で `site:` フィルタ機能停止例)。Google による正式提供ではなく、サードパーティ記事から経験的に判明している URL 形式に依存。 | 取得失敗時のエラーログを残し、運用で気づけるようにする (Q4 = A 失敗継続戦略と整合)。仕様変更時は Adapter (`GoogleNewsRssFetcher`) を差し替え。長期的には公式 RSS を提供する代替ソース (例: NHK / 日経電子版各社の RSS) への切替を検討。 |
| RISK-03 | **GitHub Actions 無料枠** 超過 | 1 日 1 回の cron なら問題なし | 監視のみ。スケジュール頻度の見直しが必要なら NFR フェーズで再評価。 |
| RISK-04 | **Markdown ファイルの肥大化** | 長期運用で git リポジトリが肥大化 | 古い記事のローテーション (例: 90 日経過後にアーカイブ) は将来フェーズで検討。MVP では考慮しない。 |
| RISK-05 | **重複排除のキー設計** | URL ベースの重複排除のみでは不十分な場合 | 第一段階は URL 一意性で対応。実運用で問題が出れば追加対策を講じる。 |

---

## 7. 受入基準 (Acceptance Criteria)

MVP 完了の判定基準:

- [ ] AC-01: `main` ブランチに push すると、Vercel が自動的にビルド・デプロイし、本番 URL で一覧ページが表示される。
- [ ] AC-02: GitHub Actions の収集ジョブが手動実行 (`workflow_dispatch`) で正常完了し、`content/` 配下に新規 Markdown ファイルがコミットされる。
- [ ] AC-03: GitHub Actions のスケジュール実行 (毎朝 7:00 JST) が動作することを、最低 1 日連続稼働 (= 1 回の実行) で確認できる。
- [ ] AC-04: 収集対象は最低 **Zenn (RSS) + はてなブックマーク (RSS) + Google ニュース (非公式 RSS) + Togetter (スクレイピング)** の 4 系統からそれぞれ 1 件以上の記事を取得できる。
- [ ] AC-05: 同一 URL の重複が排除されている (再収集ジョブ実行後に同一 URL のファイルが増えない)。
- [ ] AC-06: 一覧ページ上で各記事のタイトル / ソース / 公開日 / 外部リンクが正しく表示され、リンククリックで元記事 (外部) が新規タブで開く。
- [ ] AC-07: GitHub Actions CI で lint + typecheck + unit test + E2E test が緑になる。
- [ ] AC-08: PBT (PBT-02, 03, 07, 08, 09) が CI 上で実行され、seed ログが残る。
- [ ] AC-09: API キー等のシークレットがコードにハードコードされていないことを `gitleaks` 相当のスキャンで確認できる。
- [ ] AC-10: ライト / ダーク双方の OS 設定でレイアウト崩れが無いこと (手動確認)。

---

## 8. Stakeholder

| Role | Person | Notes |
|---|---|---|
| Product Owner / Developer / Reviewer | umatoma さん | 単独運用 (個人利用)。ステークホルダーは本人のみ。 |
| External Services | Zenn / はてなブックマーク / Google ニュース / Togetter / Vercel / GitHub | 各サービスの規約遵守が前提。Google ニュース RSS は非公式仕様のため運用上の注意が必要。 |

---

## 9. 用語集 (Glossary)

| 用語 | 定義 |
|---|---|
| MVP | Minimum Viable Product。最小限の機能で価値を提供する初期リリース。 |
| SSG | Static Site Generation。ビルド時に HTML を生成する方式。 |
| RSS | Really Simple Syndication。Web サイトの更新情報を配信する XML フォーマット。 |
| Google ニュース RSS | Google ニュースが提供する非公式 RSS フィード (`news.google.com/rss/...`)。API キー不要。トピック / 地理 / キーワード検索の 3 種類のエンドポイント。 |
| PBT | Property-Based Testing。性質ベースのテスト手法。 |
| 収集ジョブ | GitHub Actions により定期実行される、外部ソースから記事を取得し Markdown 化するジョブ。 |
| `content/` | 収集済み記事が Markdown として保存されるディレクトリ (実装時に確定)。 |

---

## 10. 主要要件サマリー

- **個人用** ニュース集約サイトを **Next.js 16 + SSG + Vercel** で構築
- 収集源: **Zenn (RSS) / はてブ (RSS) / Google ニュース (非公式 RSS) / Togetter (スクレイピング)**
- 自動収集: **GitHub Actions (毎朝 7:00 JST cron + 手動実行)**
- データ: **Markdown + Git** (DB なし)
- 一覧ページのみ。詳細ページなし、要約機能なし (両者とも第 2 フェーズ候補)
- テスト: **Vitest (PBT Partial: fast-check) + Playwright** + GitHub Actions CI/CD
- 拡張機能: Security 無効 / PBT 部分適用
- MVP 完成目標: **1 〜 2 週間**
