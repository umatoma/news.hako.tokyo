# Technology Stack

## Programming Languages
- TypeScript — `^5` — App Router 配下の全コード。
- CSS (Tailwind v4) — `^4` — グローバルスタイル。

## Frameworks
- Next.js — 16.2.4 — Web フレームワーク (App Router、SSR、画像/フォント最適化)。
- React — 19.2.4 — UI ライブラリ。

## Infrastructure
- 未定 (Vercel デプロイがテンプレートで示唆されているが構成は未整備)。

## Build Tools
- npm — Node.js 同梱 — 依存解決とスクリプト実行。
- Next.js CLI — 16.2.4 — `dev` / `build` / `start`。
- PostCSS + `@tailwindcss/postcss` — `^4` — Tailwind v4 ビルドパイプライン。

## Testing Tools
- 未導入 (ユニット/統合/E2E いずれもセットアップなし)。

## Linting / Type Checking
- ESLint — `^9` (Flat Config) — `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`。
- TypeScript — `^5` — `strict: true`。

## Runtime
- Node.js — `v24.13.1` (`.nvmrc` 指定)。
