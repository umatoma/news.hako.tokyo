# 技術スタック

**分析日:** 2026-05-30

## 言語

**主要:**
- TypeScript 5.x — フロントエンド (Next.js アプリ)、バックエンドスクリプト (collector)、テストコードすべて
- CSS — `next/app/globals.css` (Tailwind CSS のエントリポイント)

**補助:**
- CommonJS JavaScript — `next/scripts/collector/compose-commit-message.cjs` (GitHub Actions からスタンドアロンで実行されるスクリプト)

## ランタイム

**環境:**
- Node.js v24.13.1 (`.nvmrc` で固定)

**パッケージマネージャ:**
- npm
- ロックファイル: `next/package-lock.json` (lockfileVersion: 3) — 存在する

## フレームワーク

**コア:**
- Next.js 16.2.4 — SSR/SSG Web アプリケーション (`next/app/` — App Router 構成)
- React 19.2.4 — UI コンポーネント (`next/components/`, `next/app/`)

**テスト:**
- Vitest 2.1.8 — ユニットテスト・プロパティベーステスト (`next/vitest.config.ts`)
- Playwright 1.48 — E2E テスト (`next/playwright.config.ts`, `next/e2e/`)
- fast-check 3.23.1 — プロパティベーステスト用 (`*.pbt.test.ts`)

**ビルド/開発:**
- tsx 4.19.2 — TypeScript スクリプトの直接実行 (`npm run collect` → `tsx scripts/collector/index.ts`)
- Tailwind CSS v4 — ユーティリティファースト CSS
- PostCSS (`@tailwindcss/postcss`) — CSS 変換パイプライン (`next/postcss.config.mjs`)
- ESLint 9 + `eslint-config-next` — リンティング (`next/eslint.config.mjs`)

## 主要依存関係

**重要:**
- `zod` 3.23.8 — 記事スキーマ・ソース設定のバリデーション (`next/lib/article.ts`, `next/config/sources.ts`)
- `gray-matter` 4.0.3 — Markdown frontmatter の読み書き (`next/lib/articles.ts`, `next/scripts/collector/lib/markdown-writer.ts`)
- `rss-parser` 3.13.0 — RSS/Atom フィード解析 (`next/scripts/collector/sources/rss-mapping.ts`)
- `cheerio` 1.0.0 — HTML スクレイピング (Togetter ランキングページ) (`next/scripts/collector/sources/togetter-scraper.ts`)

**インフラ:**
- `next/font/google` — Google Fonts (Geist Sans / Geist Mono) のセルフホスト (`next/app/layout.tsx`)

## 設定

**環境変数:**
- `CONTENT_DIR` — 記事 Markdown ファイルの配置ディレクトリ (未設定時は `../content` に解決) (`next/lib/articles.ts`)
- `GITHUB_STEP_SUMMARY` — GitHub Actions ジョブサマリーファイルパス (CI 環境のみ) (`next/scripts/collector/index.ts`)

**ビルド設定ファイル:**
- `next/next.config.ts` — Next.js 設定 (現在はデフォルト)
- `next/tsconfig.json` — TypeScript 設定 (target: ES2017, strict: true, パスエイリアス `@/*` → `./`)
- `next/vitest.config.ts` — Vitest 設定 (環境: node、パスエイリアス `@` → `next/`)
- `next/playwright.config.ts` — Playwright 設定 (Chromium のみ、`http://localhost:3000`)
- `next/postcss.config.mjs` — PostCSS 設定 (`@tailwindcss/postcss`)
- `next/eslint.config.mjs` — ESLint 設定 (`eslint-config-next/core-web-vitals` + TypeScript)

## プラットフォーム要件

**開発:**
- Node.js v24.13.1 (`.nvmrc` 準拠)
- npm (ロックファイルあり)

**本番:**
- Next.js アプリ: デプロイ先は未定 (`.gitignore` に `.vercel` が含まれているため Vercel も候補)
- コレクター: GitHub Actions (スケジュール実行) で動作、収集結果を `content/` に書き込み git push

---

*スタック分析: 2026-05-30*
