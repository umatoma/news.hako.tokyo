# Tech Stack Decisions — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Requirements
**Created**: 2026-04-26

Unit 2 で採用する具体的なライブラリ・ツール・バージョンを確定します。Unit 1 で確定済の依存は再利用、Unit 2 で新規追加するのは Playwright のみ。

---

## 1. ランタイム / 言語 (既存)

| 項目 | 採用 | バージョン | 根拠 |
|---|---|---|---|
| ランタイム | Node.js | 24.13.1 | `.nvmrc` 既存 |
| 言語 | TypeScript | ^5 | 既存 |
| Next.js | next | 16.2.4 | 既存 |
| React | react / react-dom | 19.2.4 | 既存 |
| Tailwind CSS | tailwindcss / @tailwindcss/postcss | ^4 | 既存 |

---

## 2. Unit 1 で確定済み (Unit 2 でも再利用)

| 用途 | ライブラリ | バージョン |
|---|---|---|
| frontmatter パース | gray-matter | ^4.0.3 |
| スキーマ検証 | zod | ^3.23.8 |
| ファイルシステム抽象 | (Unit 1 の `next/scripts/collector/lib/file-system.ts` を再利用 or 専用化) | — |
| 単体テスト | vitest | ^2.1.8 |
| PBT | fast-check | ^3.23.1 |

---

## 3. Unit 2 で新規追加するライブラリ

| 用途 | ライブラリ | バージョン制約 | 用途詳細 |
|---|---|---|---|
| E2E テスト | `@playwright/test` | ^1.48 | Q1=A: `next start` 後に `localhost:3000` を Playwright がブラウザで叩く |

### Playwright のインストール手順 (Code Generation 時)
```bash
cd next
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium  # CI で実行する想定
```

---

## 4. 既存スクリプトへの追記 (`next/package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "collect": "tsx scripts/collector/index.ts",
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium"
  }
}
```

---

## 5. ファイル / ディレクトリ追加 (Unit 2)

### Application
- `next/lib/articles.ts` (Repository + 整形関数)
- `next/lib/source-label.ts` (or articles.ts に集約)
- `next/components/header.tsx`
- `next/components/article-list.tsx`
- `next/components/article-list-item.tsx`
- `next/components/source-badge.tsx`
- `next/components/empty-state.tsx`
- `next/components/footer.tsx`
- `next/public/robots.txt`

### 既存更新 (in-place)
- `next/app/page.tsx` (内容を完全置き換え)
- `next/app/layout.tsx` (lang, metadata 更新)

### Test
- `next/lib/articles.test.ts`
- `next/lib/articles.pbt.test.ts`
- `next/components/*.test.ts` (必要に応じて)
- `next/e2e/home.spec.ts` (Playwright)
- `next/playwright.config.ts`

---

## 6. CI/CD ツール

| 用途 | ツール | バージョン |
|---|---|---|
| CI ランナー | GitHub Actions | (managed) |
| `setup-node` / `checkout` / `upload-artifact` | actions/* | v4 |
| Playwright Browsers | `npx playwright install --with-deps chromium` | (managed) |
| gitleaks | `gitleaks/gitleaks-action@v2` | v2 (Unit 1 確定) |
| Vercel | (managed by Vercel) | — |

---

## 7. 採用しなかった選択肢と理由

| 候補 | 不採用の理由 |
|---|---|
| Cypress (E2E) | Playwright が NFR-04 で先に確定済み、シンプルさ優先 |
| axe-core (a11y 自動スキャン) | Q2=A で最小限を選択 (個人利用、MVP) |
| Lighthouse CI | 同上、Q2=A |
| Vercel preview を E2E target | Q1=A: ローカル `next start` で十分。Vercel 連携は不要 |
| MSW (Mock Service Worker) | Server Component 主体で API 呼出なし、不要 |
| storybook | コンポーネント数が少なく不要 |

---

## 8. PBT (Partial) の Framework 確認

PBT-09 (Framework Selection) は Unit 1 と共通:
- TypeScript: **fast-check ^3** + **vitest ^2** ✅
- Custom generators / shrinking / seed-based reproducibility / 単一 test runner との統合 すべて満たす

---

## 9. 確定後の package.json 編集タスク (Code Generation 時の参照)

```jsonc
{
  "devDependencies": {
    "@playwright/test": "^1.48"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium"
  }
}
```

> Unit 1 で確定済の依存はそのまま維持。`@playwright/test` のみ devDependencies に追加。
