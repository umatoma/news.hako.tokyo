# news.hako.tokyo

## What This Is

技術ニュースアグリゲーター。Zenn・はてな・Google News（RSS）と Togetter（スクレイピング）から技術記事を毎日収集し、重複排除して Markdown として保存、Next.js の SSG で一覧表示する。本マイルストーンでは、その日の記事を AI がまとめた「日刊ダイジェスト（ビジュアル＋要約の1枚画像）」と、記事の AI 自動分類・タグ付けを加え、収集基盤の強化と合わせてフロント体験を一体的に高める。読者は日本の技術コミュニティ。

## Core Value

毎日、その日の技術ニュースを AI がまとめた **「日刊ダイジェスト（ビジュアル＋要約テキストの1枚画像）」** を提供し、記事は AI 分類・タグで探しやすくする。

## Requirements

### Validated

<!-- 既存コードベースから推論（/gsd-map-codebase の結果に基づく） -->

- ✓ Zenn・はてな・Google News の RSS フィードから記事を収集 — existing（`next/scripts/collector/sources/`）
- ✓ Togetter の HTML スクレイピングで記事を収集 — existing（`togetter-scraper.ts`）
- ✓ 既知 URL の Set による収集記事の重複排除 — existing（`lib/deduplicator.ts`）
- ✓ 記事を gray-matter frontmatter 付き Markdown として `content/` に保存（1記事=1ファイル） — existing（`lib/markdown-writer.ts`）
- ✓ Next.js 16 SSG で記事一覧を表示（Header / ArticleList / Footer） — existing（`next/app/page.tsx`）
- ✓ GitHub Actions による定期収集（毎日スケジュール実行） — existing（`.github/workflows`）
- ✓ 実行結果のジョブサマリ出力 — existing（`lib/job-summary-reporter.ts`）

### Active

<!-- 今回のマイルストーンで構築する。出荷・検証までは仮説。 -->

**AI 日刊ダイジェスト（中心）**
- [ ] その日の記事一覧から、AI 生成ビジュアル（絵）＋要約テキストを組み合わせた1枚の「日刊ダイジェスト画像」を生成
- [ ] 日刊ダイジェストをサイトのトップに掲載
- [ ] 日別アーカイブページを用意し、日付ごとに日刊ダイジェストを掲載

**AI 分類・要約**
- [ ] 記事を AI でカテゴリ自動分類（フロント/インフラ/AI/キャリア 等）
- [ ] 記事に AI でタグ付け（複数トピックタグ）
- [ ] 記事および日次まとめの要約を AI で生成

**収集基盤の強化**
- [ ] リンク先の本文を取得し、要約・分類の入力に活用
- [ ] 新しい収集ソースの追加（候補: Qiita / dev.to / GitHub Trending / 公式ブログ 等）
- [ ] 重複排除の改善（URL 正規化・類似タイトル検出）
- [ ] 収集頻度・ソースごとの件数などのチューニング

**フロント体験**
- [ ] カテゴリ／タグによる一覧の絞り込み
- [ ] ソース別ページ（および可能なら RSS 購読配信）

### Out of Scope

<!-- 明示的な境界。再追加を防ぐため理由を併記。 -->

- 関連記事・重複クラスタリング表示 — 今回は日刊ダイジェスト＋分類に集中するため次回以降に回す
- 人気順並び替え — クリック/閲覧などの指標計測基盤が未整備で、指標なしには成立しない
- キーワード全文検索 — 今回はカテゴリ/タグ絞り込みを優先（将来の候補）
- ユーザー認証・パーソナライズ — 静的サイトの性質上スコープ外

## Context

- 既存アーキテクチャは「収集（GitHub Actions / Node.js tsx）→ `content/` に Markdown 保存（git 管理）→ Next.js SSG で表示」の一方向パイプライン。DB は持たない。
- AI で生成する派生データ（要約・カテゴリ・タグ・日刊ダイジェスト画像）も、この Markdown / 静的アセット中心の構成に無理なく載せる必要がある。
- AI 処理（要約・分類・画像生成）は、収集パイプライン（毎日の GitHub Actions 実行）に組み込むのが自然。日刊ダイジェストは1日1回生成。
- TypeScript strict、Vitest + fast-check（プロパティベース）、Playwright（E2E）のテスト文化が既にある。
- 既存の型安全性は zod スキーマで担保されている。

## Constraints

- **Tech stack**: Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS v4 を継続 — 既存スタックとの一貫性
- **Architecture**: 記事・派生データは git 管理の Markdown / 静的ファイルで扱う（DB なし） — 既存のデプロイ/運用モデルを維持
- **Infra**: 収集と AI 処理の起点は GitHub Actions の定期実行 — サーバーレス/静的運用を維持
- **Cost**: AI API（要約・分類・画像生成）の利用コストを抑える設計が必要 — 毎日全記事を処理するため
- **Quality**: 新規ロジックは既存のテスト文化（Vitest / fast-check / Playwright）に沿う

## Key Decisions

<!-- 将来の作業を制約する決定。ライフサイクルを通じて追記。 -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 日刊ダイジェストは「絵＋要約テキスト」を1枚画像に統合 | ユーザー要望。トップ/アーカイブ/SNS で訴求力が高い | — Pending |
| AI 分類はカテゴリ自動分類＋タグ付けの両方を実施 | フロントの絞り込みを成立させるため | — Pending |
| 日刊ダイジェストの掲載先はトップ＋日別アーカイブページ | 当日訴求と過去の見返しの両立 | — Pending |
| 派生データ（要約/分類/タグ/画像）も git 管理の静的構成に載せる | 既存の DB なし・静的運用モデルを維持 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-30 after initialization*
