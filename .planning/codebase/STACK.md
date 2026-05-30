# 技術スタック

**分析日:** 2026-05-30

## 言語

**主要言語:**
- TypeScript 5.x — アプリケーション全体（フロントエンド・コレクター・スクリプト）
- CSS — スタイリング（Tailwind CSS v4 経由）

**補助言語:**
- JavaScript (CommonJS) — `next/scripts/collector/compose-commit-message.cjs`（GitHub Actions から node で直接実行）

## ランタイム

**実行環境:**
- Node.js v24.13.1（`.nvmrc` で固定）

**パッケージマネージャー:**
- npm
- ロックファイル: `next/package-lock.json`（コミット済み）

## フレームワーク

**コア:**
- Next.js 16.2.4 — App Router ベースの SSR フロントエンド（`next/app/`）
- React 19.2.4 / react-dom 19.2.4 — UI ライブラリ

**テスト:**
- Vitest ^2.1.8 — ユニット・プロパティベーステスト（設定: `next/vitest.config.ts`）
- Playwright ^1.48 — E2E テスト（設定: `next/playwright.config.ts`）
- fast-check ^3.23.1 — プロパティベーステスト用アービトラリ

**ビルド・開発:**
- TypeScript tsc 5.x（型チェック: `next/tsconfig.json`）
- ESLint 9 + eslint-config-next 16.2.4（設定: `next/eslint.config.mjs`）
- Tailwind CSS ^4 + `@tailwindcss/postcss` ^4（設定: `next/postcss.config.mjs`）
- tsx ^4.19.2 — TypeScript スクリプトを直接実行（コレクター起動用）

## 主要な依存ライブラリ

**クリティカル:**
- `zod` ^3.23.8 — スキーマ定義・バリデーション（記事モデル・ソース設定の型安全性）
- `gray-matter` ^4.0.3 — Markdown フロントマターの読み書き（`next/lib/articles.ts`、`next/scripts/collector/lib/markdown-writer.ts`）
- `rss-parser` ^3.13.0 — RSS/Atom フィードの解析（`next/scripts/collector/sources/rss-mapping.ts`）
- `cheerio` ^1.0.0 — HTML スクレイピング（Togetter ページ解析: `next/scripts/collector/sources/togetter-scraper.ts`）

**インフラ:**
- `next/font/google` — Geist / Geist Mono フォント（CDN 経由: `next/app/layout.tsx`）

## 設定

**環境変数:**
- `CONTENT_DIR` — コンテンツディレクトリのパス上書き（未設定時は `../content` を使用: `next/lib/articles.ts`）
- `GITHUB_STEP_SUMMARY` — GitHub Actions ジョブサマリーパス（コレクター: `next/scripts/collector/index.ts`）
- `CI` — CI 判定フラグ（Playwright 設定で使用: `next/playwright.config.ts`）

**ビルド設定ファイル:**
- `next/next.config.ts` — Next.js 設定（現時点では空のデフォルト設定）
- `next/tsconfig.json` — TypeScript 設定（strict モード、パスエイリアス `@/*` → `./`）
- `next/postcss.config.mjs` — PostCSS 設定（Tailwind CSS プラグイン）
- `next/eslint.config.mjs` — ESLint flat config（next core-web-vitals + typescript ルール）
- `next/vitest.config.ts` — Vitest 設定（`@` エイリアス、`**/*.test.ts` 対象）
- `next/playwright.config.ts` — Playwright 設定（chromium のみ、baseURL: http://localhost:3000）

## プラットフォーム要件

**開発:**
- Node.js v24.13.1（`.nvmrc` 参照）
- npm（`next/` ディレクトリで `npm install`）

**本番:**
- デプロイ先は明示的に設定されていない（Vercel 等への静的/SSR デプロイを想定できる構成）
- CI: GitHub Actions（`.github/workflows/ci.yml`）

---

*スタック分析: 2026-05-30*
