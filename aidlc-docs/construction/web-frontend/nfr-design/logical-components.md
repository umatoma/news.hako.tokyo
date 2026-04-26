# Logical Components — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Design
**Created**: 2026-04-26

Unit 2 は SSG 主体のため、新規に追加する論理コンポーネント (DI 抽象 / 横断的サービス) は最小限です。Application Design / Functional Design で確定した UI コンポーネントは `frontend-components.md` を参照してください。

---

## 1. Unit 2 で追加・確認する論理コンポーネント

| コンポーネント | カテゴリ | 役割 | NFR との対応 |
|---|---|---|---|
| `ArticleRepository` | Data Access (I/O 境界) | `<repo-root>/content/*.md` をスキャン → `Article[]` | U2-NFR-TEST-05、U2-BR-01〜05 |
| `sortArticlesForDisplay` | Pure Function | publishedAt / collectedAt 降順ソート | U2-NFR-TEST-06 (PBT-03)、U2-BR-06〜09 |
| `toListItemView` | Pure Function | Article → ArticleListItemView 整形 | U2-BR-13〜15 |
| `formatPublishedAt` | Pure Function | ISO 8601 → `ja-JP` ロケール文字列 | U2-BR-14 |
| `computePageStats` | Pure Function | Article[] → `PageStats` (件数 + 最終更新) | U2-BR-19〜20 |
| `resolveContentDir` | Path Resolver | `process.env.CONTENT_DIR` または既定パス | U2-BR-45〜47 |
| `SourceBadge` | Presentational | sourceId に応じたバッジ表示 | U2-BR-13 |

### Unit 1 から再利用する論理コンポーネント (差し替え不要)

- `FileSystem` (`next/scripts/collector/lib/file-system.ts`)
  - Unit 2 の `ArticleRepository` も同じ抽象を利用
- `fromFrontmatter` / `ArticleSchema` / `Article` 型 (`next/lib/article.ts`)
- `gray-matter`, `zod`, `vitest`, `fast-check`
- 一部テストヘルパ (`InMemoryFileSystem`, generators)

---

## 2. ArticleRepository — Interface

```typescript
// next/lib/articles.ts
export interface ArticleRepository {
  getAllArticles(): Promise<Article[]>;
}

export interface ArticleRepositoryDeps {
  contentDir?: string;
  fileSystem?: FileReader;  // Unit 1 で定義済み (subset)
}

export class FsArticleRepository implements ArticleRepository {
  constructor(deps?: ArticleRepositoryDeps) { ... }
  async getAllArticles(): Promise<Article[]> { ... }
}

// 既定インスタンス (Server Component から直接利用)
export const articleRepository: ArticleRepository = new FsArticleRepository();
```

### 利用イメージ

```tsx
// next/app/page.tsx
import { articleRepository, sortArticlesForDisplay, toListItemView, computePageStats } from "@/lib/articles";

export default async function Home() {
  const articles = await articleRepository.getAllArticles();
  const sorted = sortArticlesForDisplay(articles);
  const stats = computePageStats(sorted);
  const views = sorted.map(toListItemView);
  // ... JSX
}
```

---

## 3. Pure Function 群 — Signatures

```typescript
// next/lib/articles.ts (続き)

export function sortArticlesForDisplay(articles: ReadonlyArray<Article>): Article[];

export interface ArticleListItemView { /* domain-entities.md §2 参照 */ }
export function toListItemView(article: Article): ArticleListItemView;

export function formatPublishedAt(iso: string): string;

export interface PageStats { /* domain-entities.md §6 参照 */ }
export function computePageStats(articles: ReadonlyArray<Article>): PageStats;

export const SOURCE_LABEL: Record<SourceId, string>;

export function resolveContentDir(): string;
```

すべて純粋関数 / 純粋データ。テストでモック不要。

---

## 4. UI コンポーネント (Application Design / Functional Design 準拠)

詳細は `aidlc-docs/construction/web-frontend/functional-design/frontend-components.md` を参照。本書では NFR 対応の観点でのみ補足:

| コンポーネント | NFR 対応 |
|---|---|
| `RootLayout` | `<html lang="ja">`、metadata、Geist フォント、グローバル CSS (U2-BR-25〜28) |
| `Header` | サイトタイトル + 件数 (U2-BR-19) |
| `Footer` | 最終更新 + サイト名 (U2-BR-20) |
| `ArticleList` | `<ul>` に divide-y、`key={view.id}` (U2-BR-37) |
| `ArticleListItem` | `<article>` + `<a target="_blank" rel="noopener noreferrer">` + `<time dateTime>` + バッジ (U2-BR-10〜17) |
| `SourceBadge` | sourceId 別カラー (U2-BR-13) |
| `EmptyState` | 中央寄せ + 「まだ記事がありません」 (U2-BR-22〜24) |

---

## 5. テスト関連の論理コンポーネント

| コンポーネント | 種類 | 用途 |
|---|---|---|
| `playwright.config.ts` | 設定 | E2E ランナー設定。`baseURL: http://localhost:3000`、`webServer` に `npm start` を指定 |
| `e2e/home.spec.ts` | E2E テスト | Q2=A の最小限スコープ (一覧表示 / target=_blank / 件数ヘッダー / 空状態は別 spec) |
| `articles.test.ts` | example-based | InMemoryFileSystem でケース別テスト |
| `articles.pbt.test.ts` | PBT (PBT-03) | `sortArticlesForDisplay` の不変条件 |

### Playwright の組み立て

```typescript
// next/playwright.config.ts (擬似)
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 1 : 0,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
});
```

---

## 6. デプロイ / インフラ関連の論理要素

詳細は次ステージの Infrastructure Design で扱うが、NFR Design レベルで明示しておく要素:

| 要素 | 役割 |
|---|---|
| `vercel.json` (任意) | Root Directory / Include Source Files Outside Root Directory 等の設定。Vercel ダッシュボードで同等設定が可能なら不要 |
| `.github/workflows/ci.yml` | PR + main push で lint + typecheck + test + build + e2e + gitleaks + npm audit を実行 |
| `next/public/robots.txt` | 検索エンジン除外 (U2-NFR-SEO-01) |

---

## 7. 全体配置 (Code Generation 時の参照)

```text
news.hako.tokyo/
├── content/                       (既存、Unit 1 の出力)
├── .github/workflows/
│   ├── collect.yml                (Unit 1)
│   └── ci.yml                     (新設、Unit 2 Infrastructure Design で実装)
├── vercel.json                    (任意、Unit 2 Infrastructure Design で判断)
└── next/
    ├── package.json               (in-place 更新: @playwright/test 追加)
    ├── playwright.config.ts       (新設)
    ├── e2e/
    │   └── home.spec.ts           (新設)
    ├── public/
    │   └── robots.txt             (新設、Disallow: /)
    ├── app/
    │   ├── layout.tsx             (in-place 更新: lang/metadata)
    │   ├── page.tsx               (in-place 完全置換)
    │   └── globals.css            (既存維持 or 微調整)
    ├── components/
    │   ├── header.tsx             (新設)
    │   ├── article-list.tsx       (新設)
    │   ├── article-list-item.tsx  (新設)
    │   ├── source-badge.tsx       (新設)
    │   ├── empty-state.tsx        (新設)
    │   └── footer.tsx             (新設)
    └── lib/
        ├── article.ts             (Unit 1 で確定済、変更なし)
        ├── articles.ts            (新設: Repository + 純粋関数群)
        ├── articles.test.ts       (新設)
        └── articles.pbt.test.ts   (新設)
```

---

## 8. NFR ID と論理コンポーネントの対応マトリクス

| NFR ID | 関連論理コンポーネント |
|---|---|
| U2-NFR-PERF-01 (build 30 秒以内) | (横断、特定コンポーネント無し、`next build` 全体) |
| U2-NFR-PERF-02 (HTML サイズ) | UI コンポーネント全体 |
| U2-NFR-TEST-01〜02 (Vitest + Playwright) | `articles.test.ts`, `articles.pbt.test.ts`, `e2e/home.spec.ts`, `playwright.config.ts` |
| U2-NFR-TEST-03 (E2E target ローカル) | `playwright.config.ts` の `webServer` |
| U2-NFR-A11Y-01〜04 | UI コンポーネント全体 (Tailwind の標準色 / focus / semantic HTML) |
| U2-NFR-SEO-01 | `next/public/robots.txt` |
| U2-NFR-SEO-02〜03 | `RootLayout.metadata` (限定的内容) |
| U2-NFR-DEPLOY-01〜06 | `vercel.json` (任意) + Vercel ダッシュボード設定 |
| U2-NFR-CI-01〜07 | `.github/workflows/ci.yml` |

---

## 9. PBT 適用 / 非適用の境界

| 対象 | PBT 適用 | 理由 |
|---|---|---|
| `sortArticlesForDisplay` | ✅ PBT-03 | 純粋関数、不変条件が明確 |
| `toListItemView` / `formatPublishedAt` / `computePageStats` | ❌ (example-based のみ) | 入力空間が小さく、example-based で十分 |
| `ArticleRepository.getAllArticles` | ❌ (example-based + InMemoryFS) | 副作用ベース |
| UI コンポーネント | ❌ (example-based or E2E) | 副作用ベース、レンダリング検証 |
