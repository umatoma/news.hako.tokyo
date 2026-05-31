# Research & Design Decisions

## Summary
- **Feature**: `theme-toggle`
- **Discovery Scope**: Extension（既存フロントエンドへの UI 追加）
- **Key Findings**:
  - 環境は Next.js 16.2.4 / React 19.2.4 / Tailwind CSS 4.2.4。`@custom-variant` ディレクティブをサポート。
  - 現状 `globals.css` は `@media (prefers-color-scheme: dark)` で `:root` の CSS 変数を切替えており、`dark:` ユーティリティの土台（class ベース）はまだ無い。class ベース化と変数セレクタ移行の両方が必須。
  - 既存の `source-tabs.tsx`（"use client" + useState + role/aria + data-testid）と `lib/source-tabs-utils.ts`（型 + 定数 + 純粋関数）が、新規 `theme-toggle.tsx` / `lib/theme.ts` の直接のパターンアナログになる。

## Research Log

### Tailwind v4 の class ベースダークモード化
- **Context**: 3択（system 含む）を実現するには `prefers-color-scheme` 追従だけでは不可。手動選択を `.dark` クラスで表現する必要がある。
- **Sources Consulted**: `next/node_modules/tailwindcss`（`@custom-variant` サポート確認）、Tailwind v4 ダークモード仕様。
- **Findings**:
  - `@import "tailwindcss";` の直後に `@custom-variant dark (&:where(.dark, .dark *));` を置くと、デフォルトの `prefers-color-scheme` ベース dark バリアントを class ベースへ上書きできる。
  - `@custom-variant` の宣言だけでは `:root` 変数のメディアクエリ切替は変わらない。`@media (prefers-color-scheme: dark) { :root {...} }` を `.dark { ... }` セレクタへ書き換える対応が別途必須。
- **Implications**: `globals.css` の修正は「`@custom-variant` 追加」＋「変数定義を `.dark` セレクタへ移行」の2点セット。

### FOUC 回避（ハイドレーション前のテーマ適用）
- **Context**: RSC 構成では初期 HTML はサーバー生成のため、クライアントのテーマ選択を反映できずちらつく。
- **Sources Consulted**: Next.js 16 docs（`script.md`、`upgrading/version-16.md`）。
- **Findings**:
  - `next/script` の `beforeInteractive` は外部スクリプトのプリロード最適化向け。FOUC 回避には素の `<script dangerouslySetInnerHTML>` を `<body>` 直前に配置するのが標準。
  - スクリプトが `<html>` に `class="dark"` を付与するとサーバー/クライアントで属性が食い違い、React 19 がハイドレーション mismatch 警告を出す。`<html suppressHydrationWarning>` が必須（1階層のみ抑制）。
  - Next.js 16 / React 19 の破壊的変更でこの計画に影響するものは無し。
- **Implications**: `layout.tsx` に `suppressHydrationWarning` ＋ インライン blocking script を追加。スクリプトは自己完結 JS（import 不可）のため、保存キー・値は `lib/theme.ts` の定数と一致させる責務がある。

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| 自前実装（採用） | lib の純粋ヘルパー + Client Component トグル + インライン FOUC スクリプト | 依存ゼロ、全挙動把握可、既存パターンと一致 | FOUC スクリプト・matchMedia 購読を自前実装 | steering の最小インフラ・透明性方針に合致 |
| next-themes | ライブラリで Provider + useTheme | エッジケースが枯れている | 依存追加、ルートを Client Provider でラップ | 小規模スコープに対し過剰 |

## Design Decisions

### Decision: テーマモデルとヘルパーを `lib/theme.ts` に集約
- **Context**: 選択値の検証（2.4）、既定フォールバック（2.3）、system→実効テーマの解決（4）といった純粋ロジックを一箇所に集約したい。
- **Alternatives Considered**:
  1. ロジックを Client Component に直書き — テスト容易性が低い、steering の「ロジックは lib に集約」に反する。
  2. lib に純粋関数として分離 — 既存 `source-tabs-utils.ts` と同じパターン。
- **Selected Approach**: `lib/theme.ts` に `Theme` 型・`THEME_OPTIONS`・`THEME_STORAGE_KEY`・`parseTheme`（不正値→既定）・`resolveEffectiveTheme`（theme + OS設定 → "light"|"dark"）を定義。`.test.ts` / `.pbt.test.ts` を併置。
- **Rationale**: 既存の lib パターンに一致し、純粋関数として単体・プロパティテスト可能。
- **Trade-offs**: FOUC インラインスクリプトは lib を import できないため、キー/値の一致を設計制約として明記する必要がある。
- **Follow-up**: インラインスクリプトの保存キー・正規化ロジックが `lib/theme.ts` と一致することをレビューで確認。

### Decision: DOM 反映は `<html>` の `.dark` クラス操作に一本化
- **Context**: Tailwind の `dark:` と CSS 変数の両方を、単一の真実源で切り替えたい。
- **Selected Approach**: 実効テーマが dark のとき `document.documentElement.classList` に `dark` を付与/除去。トグル（クライアント）と FOUC スクリプト（初期化）の双方が同じ DOM 操作を行う。
- **Rationale**: `.dark` クラスが `@custom-variant dark` と `.dark { --background... }` の両方を駆動するため、1操作で配色が一貫切替される。

## Risks & Mitigations
- FOUC スクリプトと `lib/theme.ts` のキー/値ドリフト — 設計制約として明記し、レビューで突合。E2E でちらつき不在を確認。
- `localStorage` 不在/例外（プライベートモード等） — スクリプトと読み書きを try/catch でガードし、既定「システム」へフォールバック（2.3 と整合）。
- system 選択時の `matchMedia` リスナー解放漏れ — `useEffect` の cleanup で必ず解除。

## References
- Tailwind CSS v4 Dark Mode（`@custom-variant`）— class ベースダークモードの公式手法
- Next.js 16 `app/api-reference/components/script` — スクリプト戦略
- Next.js 16 upgrading guide — 破壊的変更の非該当確認
