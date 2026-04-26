# NFR Requirements — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Requirements
**Created**: 2026-04-26

`requirements.md` §4 の NFR-01〜08 を継承し、Unit 2 (Web Frontend) 固有の追加要件・具体化を記述します。

---

## 1. 既存 NFR の継承

NFR-01〜08 は引き続き有効。Unit 2 が主担当となるのは特に NFR-01 / NFR-02 / NFR-07。

---

## 2. パフォーマンス要件 (Unit 2 固有)

| ID | 要件 | 目標 |
|---|---|---|
| **U2-NFR-PERF-01** | `next build` の所要時間 | **30 秒以内** (Q3=A) |
| **U2-NFR-PERF-02** | 静的 HTML 単一ページサイズ | 1 MB 未満 (Markdown 100 件想定で十分達成可能) |
| **U2-NFR-PERF-03** | 初回表示 (Vercel CDN 経由) | Core Web Vitals の LCP 2.5 秒以内 を目安 (NFR-02 で SEO 不要だが目安として) |

---

## 3. テスト要件 (Unit 2 固有 / NFR-04 の具体化)

| ID | 要件 | 仕様 |
|---|---|---|
| **U2-NFR-TEST-01** | 単体テストフレームワーク | **Vitest** (Unit 1 と共通、`next/vitest.config.ts` を再利用) |
| **U2-NFR-TEST-02** | E2E テストフレームワーク | **Playwright** (`@playwright/test`) |
| **U2-NFR-TEST-03** | E2E テストの実行対象 | **ローカルビルド + `next start`** (Q1=A、`localhost:3000`)。Vercel に依存しない |
| **U2-NFR-TEST-04** | E2E テストの観点 (MVP) | (Q2=A) **最小限** — 一覧ページ表示 / `target="_blank"` リンク確認 / 件数ヘッダー表示 / 空状態 UI |
| **U2-NFR-TEST-05** | E2E テストの fixtures | `<repo-root>/content/` を実データとして使用、必要に応じて in-memory な空 directory を使うシナリオを追加 |
| **U2-NFR-TEST-06** | PBT (Partial) | `sortArticlesForDisplay` に PBT-03 (Unit 1 と同じ fast-check 環境を再利用) |

---

## 4. アクセシビリティ要件 (NFR-07 の具体化)

| ID | 要件 | 仕様 |
|---|---|---|
| **U2-NFR-A11Y-01** | コントラスト | Tailwind の標準パレットの組み合わせ (例: `text-zinc-900 / dark:text-zinc-100`) を採用、独自の薄色は避ける |
| **U2-NFR-A11Y-02** | フォーカス可視性 | Tailwind デフォルトのフォーカスリングを維持 (独自 `outline-none` を付けない) |
| **U2-NFR-A11Y-03** | 意味的 HTML | `<header>`, `<main>`, `<footer>`, `<article>`, `<time>` を意味通りに使用 (U2-BR-35〜37) |
| **U2-NFR-A11Y-04** | アクセシビリティテスト | MVP では axe-core 等の自動スキャンは導入しない (Q2=A 最小限) |

---

## 5. SEO / メタデータ要件 (NFR-02 の具体化)

| ID | 要件 | 仕様 |
|---|---|---|
| **U2-NFR-SEO-01** | `robots.txt` | `next/public/robots.txt` を配置、内容は `User-agent: *\nDisallow: /` |
| **U2-NFR-SEO-02** | meta タグ | `metadata.title`、`metadata.description` のみ (OGP / 構造化データは設定しない) |
| **U2-NFR-SEO-03** | sitemap.xml | 設定しない (検索エンジン除外のため) |

---

## 6. デプロイ / インフラ要件 (Unit 2 固有)

| ID | 要件 | 仕様 |
|---|---|---|
| **U2-NFR-DEPLOY-01** | ホスティング | **Vercel** (Q9=A、要件 FR-04) |
| **U2-NFR-DEPLOY-02** | Root Directory (Vercel) | **`next/`** に設定 |
| **U2-NFR-DEPLOY-03** | 親ディレクトリの `content/` 参照 | Vercel は repo 全体を build context として持つため、`process.cwd()/../content` 経由でアクセス可能 |
| **U2-NFR-DEPLOY-04** | Deployment Protection | **本番公開、preview 無認証** (Q4=A) |
| **U2-NFR-DEPLOY-05** | デプロイトリガ | `main` ブランチへの push (collect ジョブの commit 含む) |
| **U2-NFR-DEPLOY-06** | preview デプロイ | PR 単位で自動生成 (Vercel デフォルト) |

---

## 7. CI/CD 要件 (Unit 2 固有 / NFR-05 の具体化)

`.github/workflows/ci.yml` を新設し、PR + main push 時に以下を実行 (詳細は Infrastructure Design):

| ID | 要件 | 仕様 |
|---|---|---|
| **U2-NFR-CI-01** | Lint | `npm run lint` (PR 時 + main push 時、CI gate) |
| **U2-NFR-CI-02** | TypeCheck | `npx tsc --noEmit` (CI gate) |
| **U2-NFR-CI-03** | Unit Tests + PBT | `npm run test:run` (CI gate) |
| **U2-NFR-CI-04** | Build | `npm run build` (CI gate、U2-NFR-PERF-01 の 30 秒目安) |
| **U2-NFR-CI-05** | E2E Tests (Playwright) | `npx playwright install` + `npm run test:e2e` (CI gate) |
| **U2-NFR-CI-06** | gitleaks | secrets 漏洩検知 (CI gate、Unit 1 で確定済) |
| **U2-NFR-CI-07** | npm audit | 脆弱性通知のみ (CI 緑のまま、Unit 1 で確定済) |

---

## 8. 拡張機能コンプライアンス サマリー

### Security Baseline
- 拡張機能 **無効** のため、SECURITY-01〜15 すべて **N/A**。
- 代替最小ガード:
  - `target="_blank"` には `rel="noopener noreferrer"` を併記 (U2-BR-12)
  - シークレットなし (本ユニットは API キー不要)
  - permissions 最小化 (Unit 2 では CI 用 workflow のみ)

### PBT (Partial)
- PBT-09 ✅: vitest + fast-check (Unit 1 と共通、Playwright を追加)
- PBT-01 ✅: Functional Design `business-logic-model.md §9` で Testable Properties を文書化
- PBT-03: `sortArticlesForDisplay` に適用 (Code Generation で実装)
- PBT-02 / 04 / 05 / 06 / 10: Unit 2 では適用箇所なし or N/A (Partial)
- PBT-07: Unit 1 のジェネレータを再利用

---

## 9. 受入基準 (Unit 2 DoD)

- AC-01 (Vercel デプロイ + 本番 URL 表示) を満たす
- AC-06 (一覧の表示 + 外部リンク遷移) を満たす
- AC-10 (ライト/ダーク 両 OS 設定でレイアウト崩れなし)
- U2-NFR-PERF-01 (ビルド 30 秒以内) を満たす
- U2-NFR-CI-01〜07 がすべて緑

---

## 10. 関連 Open Questions の状態

| OQ | 状態 |
|---|---|
| OQ-01 | 解消済 (Unit 1 NFR Requirements) |
| OQ-02 | 解消済 (Google ニュース RSS で確定) |
| OQ-03 | **本ステージで方針確定**: ローカル `next build && next start` で Playwright を実行。Vercel preview に依存しない (Q1=A) |
| OQ-04 | 解消済 (Application Design Article 型) |
| OQ-05 | 解消済 (Unit 2 Functional Design で Next.js 16 確認) |

**全 Open Questions が解消** しました。
