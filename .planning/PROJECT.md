# news.hako.tokyo

## What This Is

複数のニュースソース（Zenn / はてな / Google News / Togetter）から記事を自動収集し、直近の記事を一覧表示する個人用ニュース集約サイト。コレクター（Node.js スクリプト）が記事を Markdown として `content/` に書き出し、Next.js フロントエンドがそれを読んで表示する。今回のマイルストーンでは、フロントエンドにニュースソース別のタブ切り替え表示を追加する。

## Core Value

直近のニュース記事を、見たいソースごとにすばやく切り替えて閲覧できること。

## Requirements

### Validated

<!-- 既存コードから推測した、すでに動作している機能 -->

- ✓ コレクターが Zenn / はてな / Google News / Togetter から記事を取得する — existing
- ✓ 取得記事を URL 正規化ベースで重複排除する — existing
- ✓ 記事をフロントマター付き Markdown として `content/` に書き出す — existing
- ✓ GitHub Actions のスケジュール実行で収集を自動化する — existing
- ✓ フロントエンドが直近3日の記事を `publishedAt` 降順で一覧表示する — existing

### Active

<!-- 今回のマイルストーンで構築するスコープ。出荷・検証されるまでは仮説。 -->

- [ ] ニュースソース別のタブ（すべて / Zenn / はてな / Google News / Togetter）を画面上部に表示する
- [ ] タブをクリックすると、そのソースの記事だけにクライアント内で絞り込まれる
- [ ] 絞り込み後も既存の「直近3日」表示期間を維持する
- [ ] デフォルト表示は「すべて」（リロード時も「すべて」に戻る）
- [ ] 選択したソースに該当記事がない場合は「記事がありません」メッセージを表示する

### Out of Scope

<!-- 明示的な境界。再追加を防ぐため理由を併記。 -->

- URL へのタブ状態の反映（`/?source=zenn` 等） — 今回はクライアント内切り替えのみで十分。ブックマーク/共有要件がないため
- タブの件数バッジ（例: Zenn (12)） — UI をシンプルに保つため見送り
- 複数ソースの同時選択（マルチセレクト） — 1ソースずつの切り替えで足りるため
- ソースごとの独立ページ/ルーティング — SPA 的なクライアント切り替えで要件を満たすため
- 表示期間（直近3日）の変更・ソース別の期間調整 — 既存挙動を維持し、今回のスコープ外

## Context

- 既存コードベースのマップは `.planning/codebase/` に存在する（2026-05-30 分析）。
- アーキテクチャ: コレクターと表示系を `content/` ディレクトリ（ファイルストア）でつなぐパイプライン。
- フロントエンドは Next.js 16 App Router + React 19。`next/app/page.tsx` が Server Component としてデータ取得・フィルタ・ビュー変換を担う。クライアント側 JS は最小限。
- 記事は `Article` ドメインモデル（`next/lib/article.ts`、`zod` スキーマ）で表現され、`SourceId` でソース種別を持つ。
- スタイリングは Tailwind CSS v4。UI コンポーネントは `next/components/` にステートレスな表示専用として配置。
- テスト基盤: Vitest（ユニット/PBT）、Playwright（E2E）。

## Constraints

- **Tech stack**: Next.js 16 / React 19 / TypeScript / Tailwind CSS v4 — 既存スタックを踏襲する
- **アーキテクチャ**: データ取得は RSC（`page.tsx`）が担い、タブ切り替えのインタラクションのみ Client Component に切り出す — 既存の「クライアント JS 最小限」方針を維持
- **データ源**: ソース種別は `Article` の `SourceId` を使う — 既存モデルに新フィールドを追加しない
- **挙動**: タブ状態はクライアント内のみで保持し、URL・サーバー状態は変更しない — Out of Scope の境界

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| タブUIで1ソースずつ切り替える | ユーザーの「ソース別に見たい」ニーズに最もシンプルに合致 | — Pending |
| クライアント内切り替え（URL非連携） | ブックマーク/共有要件がなく、実装をシンプルに保てる | — Pending |
| 直近3日フィルタを維持 | 既存の表示ロジックを変えず、スコープを最小化 | — Pending |
| 件数バッジなし・空はメッセージ | UI をシンプルに保つ | — Pending |

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
