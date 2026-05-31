# Brief: theme-toggle

## Problem
サイト閲覧者（作者 umatoma 本人）が、配色テーマを自分の意思で選べない。現状テーマは OS のカラースキーム設定に追従するだけで、OS とは別に明示的にライト／ダークを選ぶ手段がない。

## Current State
- `next/app/globals.css` は `@import "tailwindcss";` と `@media (prefers-color-scheme: dark)` で `:root` の CSS 変数（`--background` / `--foreground`）を切替えている。テーマは **OS 設定追従のみ**。
- Tailwind CSS v4 を使用。デフォルトの `dark:` バリアントは `prefers-color-scheme` ベース。コンポーネントには `dark:` 記述（例: `page.tsx` の `dark:bg-black`）が一部あるが、変数切替が `@media` 直書きのため `dark:` ユーティリティは実質未使用。
- React Server Components 基盤。クライアントサイドの状態管理・永続化の仕組みは未導入。
- 環境: Next.js 16.2.4 / React 19.2.4 / Tailwind CSS 4.2.4。

## Desired Outcome
- ヘッダー右上の UI から **ライト / ダーク / システム** の3択でテーマを切り替えられる。
- 選択は localStorage に永続化され、再訪時も維持される。
- 初回訪問時の既定は「システム（OS 設定追従）」。
- ページ初期表示でテーマのちらつき（FOUC）が発生しない。
- 「システム」選択時は OS 設定の変更にリアルタイム追従する。

## Approach
自前実装（依存追加ゼロ）。

1. **Tailwind v4 を class ベースのダークモードへ切替**: `globals.css` の `@import "tailwindcss";` 直後に `@custom-variant dark (&:where(.dark, .dark *));` を追加。`@media (prefers-color-scheme: dark) { :root {...} }` を `.dark { --background: ...; --foreground: ...; }` セレクタへ書き換える。
2. **FOUC 回避**: `layout.tsx` の `<html>` に `suppressHydrationWarning` を付与し、`<body>` の前に素の `<script dangerouslySetInnerHTML>` を配置。ハイドレーション前に localStorage の保存値（system 時は `matchMedia` で OS 設定）を読み、`<html>` へ `.dark` クラスを付与する。
3. **トグル Client Component**: `"use client"` のトグルで、選択値の localStorage 更新・`<html>` の `.dark` クラス切替・system 選択時の `matchMedia('(prefers-color-scheme: dark)')` 購読（`useEffect` の cleanup でリスナー解除）を行う。ヘッダー右上に配置。

`next-themes` ライブラリ案も検討したが、スコープが小さく、プロジェクトの「最小インフラ・透明性・監査可能性」方針に照らして依存追加のメリットが薄いため不採用。

## Scope
- **In**: テーマ切替 UI（ライト/ダーク/システムの3択）、localStorage 永続化、FOUC 回避スクリプト、Tailwind v4 の class ベースダークモード化、`globals.css` の変数切替セレクタ移行、ヘッダーへのトグル組込み。
- **Out**: テーマごとの全コンポーネントの配色デザイン刷新（既存の背景/前景変数の枠内で対応。新規カラーパレット設計は含まない）。テーマ選択のサーバー側永続化（Cookie/DB）。複数テーマ（例: セピア等）の追加。

## Boundary Candidates
- テーマ状態の表現と永続化（localStorage 入出力・有効値の検証）
- DOM 反映層（`<html>` の class 操作・FOUC 回避インラインスクリプト）
- 表示 UI（ヘッダー内トグルコンポーネント）
- スタイル基盤（Tailwind v4 class ベース化・CSS 変数のセレクタ移行）

## Out of Boundary
- 記事収集パイプライン（`scripts/collector/`）— 一切関与しない
- 記事データのスキーマ・表示ロジック（`lib/articles.ts` 等）
- 新規カラーデザインシステムの策定

## Upstream / Downstream
- **Upstream**: 既存の `globals.css`（CSS 変数 `--background` / `--foreground`）、`layout.tsx`、`header.tsx`。
- **Downstream**: 今後ダーク配色を意識する全コンポーネント（`dark:` ユーティリティが正しく機能する基盤を提供する）。

## Existing Spec Touchpoints
- **Extends**: なし（新規・初の spec）
- **Adjacent**: なし

## Constraints
- Next.js 16 App Router / React 19 Server Components 構成を維持する（ルート全体を Client 化しない）。
- `<html suppressHydrationWarning>` が必須（React 19 のハイドレーション mismatch 警告回避）。
- FOUC 回避には `next/script` ではなく素の `<script dangerouslySetInnerHTML>` を使う。
- アプリ本体は `next/` 配下。`@/` 絶対インポート・ファイル kebab-case・テスト併置のプロジェクト規約に従う。
