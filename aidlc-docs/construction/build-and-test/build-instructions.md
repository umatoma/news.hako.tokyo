# Build Instructions

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Build and Test
**Generated**: 2026-04-26

---

## Prerequisites

| 項目 | 値 |
|---|---|
| Build Tool | npm + Next.js CLI (Turbopack デフォルト) |
| Node.js | **24.13.1** (`.nvmrc` 指定、`actions/setup-node` で適用) |
| Dependencies | `next/package.json` の dependencies + devDependencies (Unit 1 + Unit 2) |
| 環境変数 | **必須なし** (MVP)。任意で `CONTENT_DIR` (デフォルト = `<repo-root>/content/`) |
| OS / 推奨スペック | macOS / Linux、メモリ 4GB+、ディスク 1GB+ |

主要依存:
- `next ^16.2.4`、`react ^19.2.4`、`tailwindcss ^4`
- `rss-parser`、`cheerio`、`gray-matter`、`zod`
- `vitest`、`fast-check`、`@playwright/test`、`tsx`

---

## Build Steps

### 1. Install Dependencies

```bash
nvm use            # .nvmrc に従って Node v24.13.1 を選択
cd next
npm ci             # ロックファイルに従って厳密インストール
```

**期待される出力**:
- `added X packages, ... in Ys`
- 警告: 7 件の moderate severity vulnerabilities (現状の Next.js 16.2.4 系統依存、`npm audit` で通知のみ)

### 2. (任意) 環境設定

通常は不要。特殊なパスを使う場合のみ:
```bash
export CONTENT_DIR=/path/to/custom/content
```

### 3. Build All Units

```bash
cd next
npm run build       # Next.js (Web Frontend) のビルド
```

> **注意**: Collector (Unit 1) は実行スクリプト (`tsx scripts/collector/index.ts`) のため、Build フェーズでのバンドル化は不要。GitHub Actions の cron で `npx tsx` で起動される。

### 4. (任意) Collector を 1 回手動実行

```bash
cd next
npm run collect     # tsx で Collector を起動、`<repo-root>/content/*.md` を更新
```

### 5. Verify Build Success

**Expected Output**:
```
▲ Next.js 16.2.4 (Turbopack)
✓ Compiled successfully in ~2s
✓ Generating static pages using 5 workers (4/4) in ~700ms

Route (app)
┌ ○ /            ← Home
└ ○ /_not-found
○ (Static) prerendered as static content
```

**Build Artifacts**:
- `next/.next/` (Next.js のビルド出力、`.gitignore` 済み)
- `next/.next/server/app/` 配下の静的 HTML (`/`、`/_not-found`)
- 各種 chunks / assets

**Build Time (実測値)**: 約 **9.4 秒** (`time npm run build`)、目標 30 秒以内 (U2-NFR-PERF-01) クリア

**Common Warnings (許容)**:
- `npm audit` の moderate severity vulnerabilities (Next.js 16.2.4 系統、Q6=B により通知のみ)
- (Vercel ビルド時) `whatwg-encoding` deprecated 警告 — 動作には影響なし

---

## Troubleshooting

### Build Fails with `Cannot find module '@/lib/articles'`
- **原因**: TypeScript の `paths: { "@/*": ["./*"] }` が機能していない
- **対処**: `next/tsconfig.json` の `paths` 設定を確認、`next` working directory で実行しているか確認

### Build Fails with `ENOENT: ../content`
- **原因**: `<repo-root>/content/` ディレクトリが存在しない、または Vercel で "Include Source Files Outside the Root Directory" が OFF
- **対処**:
  - ローカル: `mkdir -p ../content`、または collect を 1 回実行
  - Vercel: Dashboard で当該設定を ON
- **注意**: `content/` が空でも build は成功します (空状態 UI が表示される)

### Build Fails with `Invalid frontmatter in ...`
- **原因**: `content/*.md` のいずれかが Article schema (zod) に合わない
- **対処**: エラー出力のファイルパスを確認、不正な Markdown を `git rm` してから再ビルド

### Build Fails with TypeScript エラー
- **原因**: 型エラー
- **対処**: `npx tsc --noEmit` で詳細を確認、エラー箇所を修正

### Build が異常に遅い (30 秒超)
- **原因**: `content/*.md` が大量、または初回ビルド (Turbopack キャッシュなし)
- **対処**: 2 回目以降は Turbopack キャッシュで高速化。30 秒以上が継続する場合は `content/` の件数を確認 (4 桁を超えると要見直し、RISK-04 のローテーション検討)
