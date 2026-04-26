# NFR Design Patterns — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Design
**Created**: 2026-04-26

Unit 2 (Web Frontend) で採用する設計パターンを整理します。Unit 1 NFR Design / Application Design / Unit 2 Functional Design + NFR Requirements で多くが確定しているため、**Unit 2 固有のパターン** に焦点を当てます。

---

## 1. Resilience (回復性) パターン

### 1.1 Build-Time Fail-Fast
- **目的**: データ不整合 (frontmatter スキーマ違反等) を本番デプロイ前に検出
- **適用箇所**: `ArticleRepository.getAllArticles()` (`fromFrontmatter` の zod 検証失敗で throw)
- **効果**: Vercel ビルドが失敗 → **前回成功ビルドが残る** (運用継続性)
- **関連ルール**: U2-BR-04, NFR-01 (ビルド時間目標と整合)

### 1.2 Empty Tolerance
- **目的**: `content/` が存在しない / 0 件 でもビルドは成功する
- **適用箇所**: `ArticleRepository.getAllArticles()` + `EmptyState` UI
- **実装方針**: `FileSystem.listMarkdownFiles` が空配列を返した場合は throw せず、Home が `EmptyState` を描画
- **関連ルール**: U2-BR-05, U2-BR-21

### 1.3 No Runtime Failure (Static Site)
- **目的**: ランタイム JS の失敗ポイントを設けない
- **適用箇所**: 全コンポーネント (Server Component のみ、`useState` 等なし)
- **効果**: 静的 HTML として配信、ランタイム JS の異常系に関する設計が不要

---

## 2. Performance (性能) パターン

### 2.1 Static Site Generation (SSG)
- **目的**: ビルド時に HTML 確定、リクエスト時の I/O ゼロ
- **適用箇所**: `app/page.tsx` (Server Component、ビルド時に `await getAllArticles()`)
- **関連ルール**: U2-BR-43〜44, NFR-01, U2-NFR-PERF-01

### 2.2 Build-time Read-Once
- **目的**: 全 Markdown を 1 回読んで Article[] にして使い回す
- **適用箇所**: `Home` コンポーネント (`getAllArticles()` を 1 回呼出 → ソート → View 化 → 描画)
- **効果**: 重複 I/O なし、フィルタや派生表示も in-memory で完結

### 2.3 No Client-side Hydration State
- **目的**: SSG 出力をそのまま CDN 配信、クライアント JS 不要
- **適用箇所**: 全 UI コンポーネント
- **効果**: First Contentful Paint と Largest Contentful Paint がほぼ等価、Core Web Vitals 良好

### 2.4 No Premature Optimization
- **目的**: MVP 期間 1〜2 週間 (NFR-06) を遵守
- **適用箇所**: 100 件規模では追加の最適化 (chunk 分割、virtual scroll 等) は不要

---

## 3. Security (安全性) パターン

### 3.1 External Link Hardening
- **目的**: `target="_blank"` リンクの脆弱性 (リバースタブナビング等) 回避
- **適用箇所**: 全 `<a target="_blank">` (= 各記事のタイトルリンク)
- **実装**: 必ず `rel="noopener noreferrer"` を付与
- **関連ルール**: U2-BR-12, BR-06 (FR-01)

### 3.2 No User Input Surface
- **目的**: 入力フォーム / 検索フィールド等を持たないことで XSS 等の攻撃面をゼロにする
- **適用箇所**: Web 全体 (個人利用、閲覧専用)
- **効果**: CSRF / XSS / SQL Injection が論理的に発生しない

### 3.3 Search Engine Exclusion
- **目的**: 個人サイトを検索エンジンインデックスから除外
- **適用箇所**: `next/public/robots.txt` (`User-agent: * / Disallow: /`)
- **関連ルール**: U2-NFR-SEO-01, NFR-02

### 3.4 Minimal Metadata
- **目的**: OGP / 構造化データ等の SEO メタデータを設定しない
- **適用箇所**: `RootLayout.metadata`
- **関連ルール**: U2-BR-26〜28, U2-NFR-SEO-02

### 3.5 Vercel Authentication = OFF (Production)
- **目的**: 本番は誰でも閲覧可能にする (個人利用、閲覧専用、`robots.txt` で検索除外済み)
- **適用箇所**: Vercel Dashboard > Deployment Protection
- **関連ルール**: U2-NFR-DEPLOY-04

---

## 4. Accessibility (アクセシビリティ) パターン

### 4.1 Semantic HTML
- **目的**: スクリーンリーダー / 検索 (運用は除外しているが) 支援
- **適用箇所**: `<header>`, `<main>`, `<footer>`, `<article>`, `<time>`, `<h1>`, `<h2>`
- **関連ルール**: U2-BR-35〜36, U2-NFR-A11Y-03

### 4.2 Tailwind Default Focus Ring
- **目的**: キーボード操作可能性を維持
- **適用箇所**: 全リンク・ボタン (= 記事リンクのみ)
- **実装方針**: `outline-none` を独自に付けない、Tailwind の標準フォーカススタイルに任せる
- **関連ルール**: U2-NFR-A11Y-02

### 4.3 Contrast via Tailwind Palette
- **目的**: WCAG コントラスト比準拠
- **適用箇所**: 全テキスト
- **実装方針**: `text-zinc-900 / dark:text-zinc-100` 等の Tailwind 標準パレットを採用、独自薄色 (`text-gray-300` 等) は避ける
- **関連ルール**: U2-NFR-A11Y-01

---

## 5. Theming (テーマ) パターン

### 5.1 OS Setting Follow (`prefers-color-scheme`)
- **目的**: ライト/ダーク切替を OS 設定に委譲
- **適用箇所**: 全コンポーネント (Tailwind v4 の `dark:` バリアント)
- **実装方針**: トグル UI を持たない、CSS のメディアクエリで自動切替
- **関連ルール**: U2-BR-30〜32, FR-05, Q14=B

### 5.2 Dual-Class Pattern
- **目的**: 各要素にライト/ダーク両用のクラスを並記
- **例**: `bg-white dark:bg-black`, `text-zinc-900 dark:text-zinc-100`
- **関連ルール**: U2-BR-34

---

## 6. Testability (テスト容易性) パターン

### 6.1 Pure Function Extraction
- **目的**: テスト容易性、PBT 適用可能性
- **適用箇所**: `sortArticlesForDisplay` / `toListItemView` / `formatPublishedAt` / `computePageStats`
- **実装方針**: 副作用なし (I/O なし)、決定的、単体テストで完結

### 6.2 Repository = I/O Boundary
- **目的**: I/O を `ArticleRepository` の中に閉じ込める
- **適用箇所**: `next/lib/articles.ts`
- **テスト戦略**: `FileSystem` 抽象を Unit 1 から再利用、`InMemoryFileSystem` でテスト

### 6.3 data-testid Stable Naming
- **目的**: E2E テストの安定性
- **適用箇所**: 全 Interactive 要素 (記事リンク / バッジ / 件数表示 / 空状態 / 最終更新)
- **命名規約**: `{component}-{role}` (例: `article-link`, `source-badge-zenn`, `header-article-count`, `empty-state-message`, `footer-last-updated`)
- **関連ルール**: Code Generation Rules (Automation Friendly Code Rules)

### 6.4 E2E Target = Local `next start`
- **目的**: Vercel 連携不要、CI 内で完結
- **適用箇所**: `playwright.config.ts` (`baseURL: http://localhost:3000`、`webServer: { command: "npm start", url: "http://localhost:3000" }`)
- **関連ルール**: U2-NFR-TEST-03, Q1=A (NFR Requirements)

### 6.5 PBT = Pure Functions Only
- **目的**: Partial モードでのコスト最小化
- **適用箇所**: `sortArticlesForDisplay` のみ (PBT-03)
- **PBT 非適用 (副作用ベース)**: コンポーネント / Repository (例: example-based + InMemoryFS で担保)
- **関連ルール**: U2-NFR-TEST-06

---

## 7. Architecture (構造) パターンの再確認

| パターン | 適用 |
|---|---|
| **Server Component (Default)** | 全 UI コンポーネント。`"use client"` を一切使わない |
| **View Model** | `ArticleListItemView` で表示用整形を Repository / Home 側に閉じ込める |
| **Container vs Presentation** | `Home` (Container) + `Header` / `ArticleList` / `ArticleListItem` / `EmptyState` / `Footer` (Presentation) |
| **Repository** | `ArticleRepository` (I/O 境界) |
| **Pure Function** | ソート / フォーマット / View 変換 |

---

## 8. Anti-Patterns (避ける)

| アンチパターン | 理由 |
|---|---|
| **`"use client"` の濫用** | 不必要な Client JS 増、SSG の利点を失う |
| **`useEffect` での I/O** | Server Component でビルド時に完結すべき I/O をクライアント実行する誤用 |
| **動的ルート / params の追加** | 動的ルートを増やすと Next.js 16 async params の影響を受ける、MVP に不要 |
| **独自 outline / focus 削除** | アクセシビリティ低下 |
| **OGP / 構造化データの追加** | 検索エンジン除外方針 (`robots.txt Disallow: /`) と矛盾 |
| **MockServiceWorker / API モック** | API 呼出が無いため不要 |
| **テーマ切替トグル** | Q14=B により OS 設定追従、UI 不要 |
| **Lighthouse / axe-core CI 統合** | Q2=A により MVP では最小限 (個人利用) |

---

## 9. PBT (Partial) パターン適用先 — 本ユニット

| Function | Rule | Pattern |
|---|---|---|
| `sortArticlesForDisplay` | PBT-03 | Length / Permutation / Primary order / Secondary order Invariants |
| (継承) Article generators | PBT-07 | Unit 1 の `test/generators/article.gen.ts` を再利用 |
| 全 PBT | PBT-08 | vitest verbose reporter + fast-check 標準 shrinking (Unit 1 と共通) |
| Framework | PBT-09 | vitest ^2 + fast-check ^3 (Unit 1 と共通) |

---

## 10. Unit 1 から再利用する設計パターン

| Unit 1 のパターン | Unit 2 での再利用 |
|---|---|
| DI (`FileSystem` 抽象) | `ArticleRepository` で同じ抽象を利用 (実装は default 共通) |
| Pure Function 切り出し | ソート / フォーマット関数で踏襲 |
| Test Generators (PBT-07) | `articleArbitrary` を Unit 2 のソート PBT で利用 |
| 命名規則 (`*.test.ts` / `*.pbt.test.ts`) | 同じ規約を Unit 2 でも適用 |
| 自作 Logger | Unit 2 では SSG ビルド時のみ必要、`console.error` 等で十分なため自作 Logger は不要 (Unit 1 の Logger は Adapter 等で使うため Unit 2 では呼ばない) |
