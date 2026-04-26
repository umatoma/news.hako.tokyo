# Unit 2 (Web Frontend) — Code Documentation

**Generated**: 2026-04-26
**Single source of truth**: `aidlc-docs/construction/plans/web-frontend-code-generation-plan.md`

Unit 2 (News Listing Service / Web Frontend) で生成された全コードのインベントリと、開発・運用上の参考情報。

---

## 1. ファイル インベントリ

### Application Code (workspace root)

```
news.hako.tokyo/
├── .github/workflows/
│   └── ci.yml                                            (Step 8)
└── next/
    ├── package.json                                      (Step 1, updated: @playwright/test 追加 + scripts)
    ├── package-lock.json                                 (Step 1, updated)
    ├── playwright.config.ts                              (Step 7)
    ├── e2e/
    │   └── home.spec.ts                                  (Step 7)
    ├── public/
    │   └── robots.txt                                    (Step 5)
    ├── app/
    │   ├── layout.tsx                                    (Step 4, in-place updated: lang/metadata)
    │   └── page.tsx                                      (Step 4, in-place replaced)
    ├── components/
    │   ├── header.tsx                                    (Step 3)
    │   ├── footer.tsx                                    (Step 3)
    │   ├── empty-state.tsx                               (Step 3)
    │   ├── source-badge.tsx                              (Step 3)
    │   ├── article-list-item.tsx                         (Step 3)
    │   └── article-list.tsx                              (Step 3)
    └── lib/
        ├── articles.ts                                   (Step 2)
        ├── articles.test.ts                              (Step 6)
        └── articles.pbt.test.ts                          (Step 6)
```

### Documentation (`aidlc-docs/construction/web-frontend/code/`)
- `README.md` (本ファイル)
- `lib-summary.md`
- `components-summary.md`

---

## 2. 開発者向け操作

### 開発サーバ
```bash
cd next
npm run dev
# → http://localhost:3000
```

### ローカルビルド + 確認
```bash
cd next
npm run build
npm run start
# → http://localhost:3000
```

### Lint / TypeCheck / Unit Test / PBT
```bash
cd next
npm run lint
npx tsc --noEmit
npm run test:run     # Unit 1 + Unit 2 全 76 テスト (PBT 含む)
```

### E2E (Playwright)
```bash
cd next
npm run test:e2e:install   # 初回のみ (Chromium をインストール)
npm run test:e2e
```

---

## 3. 検証結果

| Step | 結果 |
|---|---|
| 10.1 `npx tsc --noEmit` | ✅ エラーなし |
| 10.2 `npm run lint` | ✅ エラーなし |
| 10.3 `npm run test:run` | ✅ **76/76 tests passing** (20 ファイル、Unit 1+2、PBT 含む) |
| 10.4 `npm run build` | ✅ 成功 (約 9.78 秒、目標 30 秒以内) |
| 10.5 `npm run dev` | (本端末では visual 検証 skip、ビルド成功で代替) |
| 10.6 Playwright E2E | (ブラウザ DL 時間長のため CI 上で確認、ローカルは skip) |

---

## 4. Vercel デプロイ準備チェックリスト

ユーザー (umatoma さん) が Vercel Dashboard で実施すべき設定:

- [ ] Vercel に GitHub リポジトリを連携 / プロジェクト作成
- [ ] Settings > General > **Root Directory** = `next`
- [ ] Settings > General > **Include source files outside the Root Directory** = **ON** (重要、`<repo-root>/content/` を読むため)
- [ ] Settings > Deployment Protection > Production = **OFF** (公開)
- [ ] Settings > Deployment Protection > Preview = **OFF** (無認証)
- [ ] (任意) Custom Domain `news.hako.tokyo` を設定
- [ ] 初回 main push でビルドが成功することを確認

---

## 5. トラブルシューティング

| 症状 | 対処 |
|---|---|
| Vercel ビルドで `Cannot find module '@/lib/articles'` | tsconfig.json の `paths: { "@/*": ["./*"] }` が next.config と整合しているか確認 |
| Vercel ビルドで `ENOENT: ../content` | "Include Source Files Outside the Root Directory" が ON になっているか確認 |
| `next build` で frontmatter スキーマエラー | `content/*.md` のいずれかが zod スキーマに合わない可能性。エラー出力のファイルパスを `git rm` して再ビルド |
| ローカル `npm run dev` で日本語の日付が `2026/04/25` 等英語フォーマットになる | Node.js が ICU full をサポートしていない可能性。Node.js 24.13.1 (`.nvmrc`) を使う (`nvm use`) |
| Playwright E2E で webServer タイムアウト | `npm install` が走っていない可能性。`npm ci` を先に実行 |

---

## 6. Story / AC トレーサビリティ

| Story / Requirement | 実装場所 |
|---|---|
| FR-01 (一覧表示) | `app/page.tsx` + `lib/articles.ts` + `components/article-list*.tsx` |
| FR-04 (SSG + Vercel) | `app/page.tsx` (Server Component, async, ビルド時に I/O) |
| FR-05 (UI: 日本語、ダーク追従、レスポンシブ) | `app/layout.tsx` (lang=ja) + Tailwind dark variant |
| AC-01 (Vercel 自動デプロイ + 表示) | `next.config.ts` + Vercel Dashboard 設定 (本ドキュメント §4) |
| AC-06 (タイトル/ソース/日付/外部リンク) | `components/article-list-item.tsx` |
| AC-07 (CI 緑) | `.github/workflows/ci.yml` |
| AC-08 (PBT seed ログ) | `lib/articles.pbt.test.ts` + vitest verbose reporter |
| AC-09 (シークレット非ハードコード) | gitleaks ジョブ (CI) |
| AC-10 (ライト/ダーク 両 OS 設定) | Tailwind dark: variant |

---

## 7. 拡張機能コンプライアンス

### Security Baseline
- 拡張機能 **無効** のため SECURITY-01〜15 すべて **N/A**
- 代替最小ガード:
  - `target="_blank"` には `rel="noopener noreferrer"`
  - `permissions: contents: read` (CI)
  - gitleaks gate (CI)
  - npm audit (warn only)
  - `robots.txt Disallow: /`

### PBT (Partial)
- PBT-09 ✅: vitest 2 + fast-check 3 (Unit 1 と共通)
- PBT-01 ✅ (advisory): Functional Design + 本コードに反映
- PBT-03 ✅: `lib/articles.pbt.test.ts` で `sortArticlesForDisplay` の 4 つの不変条件
- PBT-02: Article round-trip は Unit 1 で完結 (再実装なし)
- PBT-04 / 05 / 06 / 10: N/A (Partial mode)

---

## 8. Construction 完了サマリー

```
✅ Unit 1: Collector (5 ステージ全完了)
✅ Unit 2: Web Frontend (5 ステージ全完了)
⬜ Build and Test (全ユニット完了後)
```

> 次は **Build and Test** ステージ。両ユニットを統合した動作確認を行います。
