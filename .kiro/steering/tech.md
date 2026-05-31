# 技術スタック

## アーキテクチャ

Next.js App Router（React Server Components がデフォルト）によるサーバーサイドレンダリング／静的生成構成。`app/` ディレクトリのファイルベースルーティングを用い、非同期な Server Component 内でデータ取得を行う。

データはデータベースを持たず、Markdown（YAML frontmatter）ファイルとしてファイルシステムに保存する。記事収集はビルドとは独立した CLI スクリプト（`scripts/collector/`）が担い、GitHub Actions の cron で定期実行される。クライアントサイドのデータ取得ライブラリ（React Query・SWR 等）は使用しない。

> Next.js アプリ本体はリポジトリ直下ではなく `next/` ディレクトリに配置されている。

## コア技術

- **言語**: TypeScript（^5、strict モード）
- **フレームワーク**: Next.js 16（App Router）
- **UI**: React 19（Server Components）
- **ランタイム**: Node.js（CLI スクリプトは `tsx` で実行）
- **パッケージ管理**: npm（`package-lock.json`）

## 主要ライブラリ

開発パターンに影響する主要なもののみ:

- **Zod**: ランタイムスキーマ検証（型安全なパース。記事スキーマ・ソース設定に使用）
- **gray-matter**: Markdown frontmatter のパース
- **rss-parser / cheerio**: RSS パースと HTML スクレイピング（記事収集）
- **Tailwind CSS v4**: ユーティリティファーストのスタイリング（`@tailwindcss/postcss`）

## 開発標準

### 型安全性
TypeScript strict モードを有効化（`tsconfig.json`）。`@/*` パスエイリアスで絶対インポートを徹底。

### コード品質
ESLint 9（フラットコンフィグ `eslint.config.mjs`）。`eslint-config-next` の core-web-vitals + typescript を継承。Prettier は導入していない。

### テスト
- **ユニット／統合**: Vitest（Node 環境、`**/*.test.{ts,tsx}`）
- **プロパティベーステスト**: fast-check（`.pbt.test.ts` 命名）。エッジケース・データ検証を重視
- **E2E**: Playwright（Chromium、`e2e/`、`http://localhost:3000`）
- テストはソースと同じ場所に併置する

## 開発環境

### 主なコマンド

```bash
# 開発サーバ:   npm run dev      （localhost:3000）
# ビルド:       npm run build
# 本番起動:     npm start
# Lint:        npm run lint
# 記事収集:     npm run collect  （tsx scripts/collector/index.ts）
# テスト:       npm test         （watch）／ npm run test:run（単発）
# E2E:         npm run test:e2e
```

> いずれも `next/` ディレクトリ内で実行する。

## 主要な技術的判断

- **DB レス / Git ネイティブ**: 記事は Markdown + frontmatter で保存し、バックエンド API を持たない。バージョン管理・履歴監査が容易
- **フルスタック TypeScript**: アプリ（`app/`）も収集スクリプト（`scripts/collector/`）も TypeScript。スクリプトは `tsx` で実行
- **収集パイプラインのモジュール化**: ソースフェッチャをインターフェースベースでプラグイン化し、HTTP クライアント・重複排除・slug 生成・Markdown 書き出しを関心ごとに分離。テストダブル（記録型 HTTP クライアント、インメモリ FS）で高いテスト容易性を確保
- **サーバーサイド取得のみ**: 全データ取得を非同期 Server Component 内で行う

---
_標準とパターンを記載し、全依存関係を列挙しない_
