# Frontend Components — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Functional Design
**Created**: 2026-04-26

Unit 2 はフロントエンド/UI を含むため、本ドキュメントは **コンポーネント階層・props・状態・対話フロー** を規定します。Application Design (`components.md` §3) で確定した骨格を、Functional Design レベルで詳細化したものです。

---

## 1. コンポーネント階層

```
RootLayout (app/layout.tsx)
└── Home (app/page.tsx)
    ├── Header (components/header.tsx)
    ├── ArticleList (components/article-list.tsx)        ← 1 件以上の場合
    │   └── ArticleListItem (components/article-list-item.tsx) × N
    ├── EmptyState (components/empty-state.tsx)          ← 0 件の場合
    └── Footer (components/footer.tsx)
```

すべて **Server Component** (デフォルト)。`"use client"` ディレクティブは追加しない。

---

## 2. コンポーネント定義

### 2.1 `RootLayout` (`next/app/layout.tsx`)

**役割**: HTML 骨格、メタデータ、フォント、グローバル CSS。

**Props**:
```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}
```

**実装の要点 (既存からの差分)**:
- `<html lang="ja">` (現状 `lang="en"`)
- `metadata.title`: `"news.hako.tokyo"`
- `metadata.description`: `"個人用ニュース集約サイト"`
- 既存の Geist フォント (`Geist`, `Geist_Mono`) と Tailwind 設定を維持
- `<body>` の `min-h-full flex flex-col` を維持

---

### 2.2 `Home` (`next/app/page.tsx`)

**役割**: SSG エントリ、データ取得・整形・組立。

**型**:
```typescript
export default async function Home(): Promise<JSX.Element>;
```

**処理 (擬似)**:
```typescript
const articles = await getAllArticles();
const sorted = sortArticlesForDisplay(articles);
const stats = computePageStats(sorted);
const views = sorted.map(toListItemView);

return (
  <>
    <Header stats={stats} />
    <main className="...">
      {views.length === 0 ? <EmptyState /> : <ArticleList views={views} />}
    </main>
    <Footer stats={stats} />
  </>
);
```

**注意**:
- 既存の `app/page.tsx` (Next.js デフォルトテンプレート) を **完全置き換え**
- 既存テンプレートのスタイル `flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black` の方向性 (中央寄せ + ダーク対応) を活かしつつ、リスト表示用に再構築

---

### 2.3 `Header` (`next/components/header.tsx`)

**Props**:
```typescript
interface HeaderProps {
  stats: PageStats;
}
```

**出力構造 (擬似)**:
```jsx
<header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
  <div className="mx-auto max-w-3xl px-4 py-4 flex items-baseline justify-between">
    <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">news.hako.tokyo</h1>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      {stats.totalArticles} 件
    </p>
  </div>
</header>
```

---

### 2.4 `ArticleList` (`next/components/article-list.tsx`)

**Props**:
```typescript
interface ArticleListProps {
  views: ArticleListItemView[];
}
```

**出力構造**:
```jsx
<ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
  {views.map((view) => (
    <ArticleListItem key={view.id} view={view} />
  ))}
</ul>
```

---

### 2.5 `ArticleListItem` (`next/components/article-list-item.tsx`)

**Props**:
```typescript
interface ArticleListItemProps {
  view: ArticleListItemView;
}
```

**出力構造**:
```jsx
<li>
  <article className="px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
    <a
      href={view.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      data-testid="article-link"
    >
      <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-50 group-hover:underline">
        {view.title}
      </h2>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <SourceBadge sourceId={view.sourceId} label={view.sourceLabel} />
        <time
          dateTime={view.publishedAtIso}
          className="text-zinc-500 dark:text-zinc-400"
        >
          {view.publishedAtDisplay}
        </time>
      </div>
    </a>
  </article>
</li>
```

**`SourceBadge`** (内部コンポーネント):
- `next/components/source-badge.tsx` として切り出し
- `sourceId` に応じて色クラスを切り替え (Tailwind の class lookup)
- `data-testid="source-badge-{sourceId}"` (E2E 用)

```jsx
const BADGE_CLASS: Record<SourceId, string> = {
  zenn: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200",
  hatena: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  googlenews: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  togetter: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
};
```

---

### 2.6 `EmptyState` (`next/components/empty-state.tsx`)

**Props**: なし

**出力構造** (Q4=A シンプルメッセージ):
```jsx
<div className="px-4 py-16 text-center">
  <p className="text-zinc-500 dark:text-zinc-400">まだ記事がありません</p>
</div>
```

---

### 2.7 `Footer` (`next/components/footer.tsx`)

**Props**:
```typescript
interface FooterProps {
  stats: PageStats;
}
```

**出力構造**:
```jsx
<footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
  <div className="mx-auto max-w-3xl px-4 py-4 flex items-baseline justify-between text-sm text-zinc-500 dark:text-zinc-400">
    <p>news.hako.tokyo</p>
    <p>
      最終更新: {stats.lastUpdatedDisplay ?? "未収集"}
    </p>
  </div>
</footer>
```

---

## 3. ユーザ対話フロー

本サイトはほぼ閲覧専用 (個人利用) のため、対話は最小:

| 操作 | 結果 |
|---|---|
| 記事タイトルをクリック | 元記事の外部 URL が新規タブで開く (`target="_blank"`) |
| キーボード Tab | フォーカスが各記事リンクへ移動 (Tailwind デフォルトのフォーカスリング) |
| ライト/ダーク切替 (OS 設定変更) | 自動でテーマが切り替わる (`prefers-color-scheme`) |

フォーム入力 / ログイン / 検索 / フィルタ等の **対話的機能は MVP では存在しない**。

---

## 4. 状態管理

- **ステート不要**: すべて Server Component で SSG 時にレンダリング、ランタイム JS で書き換える状態を持たない
- **Client Component なし**: `useState` / `useEffect` / `onClick` 等は使わない

---

## 5. フォーム検証ルール

本ユニットには入力フォームが存在しないため、フォーム検証は **N/A**。

---

## 6. API 統合ポイント

本ユニットは **バックエンド API を呼ばない**。データは:
- ビルド時: ファイルシステム経由で `<repo-root>/content/*.md` を読み込む
- ランタイム: 静的 HTML を CDN から配信するのみ

---

## 7. data-testid 一覧 (E2E 自動化対応)

| Element | data-testid | 用途 |
|---|---|---|
| 各記事のリンク | `article-link` | クリック・href 検証 |
| ソースバッジ | `source-badge-{sourceId}` | 表示・スタイル検証 |
| ヘッダーの件数表示 | `header-article-count` | カウント検証 |
| 空状態のメッセージ | `empty-state-message` | 0 件時の文言検証 |
| フッターの最終更新 | `footer-last-updated` | 値検証 |

> Code Generation 時に各コンポーネントへ `data-testid` 属性を埋め込みます。

---

## 8. レスポンシブ・ブレークポイント

MVP ではシンプルに **常に 1 カラム** で表示:
- `max-w-3xl mx-auto` でコンテナ幅を制限
- 各記事は縦並び (`<ul class="divide-y...">`)
- 将来 2 カラム化したい場合は `md:grid md:grid-cols-2` 等に拡張可能 (本 MVP では不要)

---

## 9. PBT 適用 (本ユニットでの最小限)

UI コンポーネント自体は副作用ベースのため PBT 適用なし。`sortArticlesForDisplay` 等の純粋関数のみ PBT 対象 (詳細は `domain-entities.md` §9 参照)。

---

## 10. Construction Code Generation への引き継ぎ

Code Generation 段階で以下を実装する:

### 新規作成ファイル
- `next/lib/articles.ts` (Repository + 整形関数群)
- `next/lib/source-label.ts` (or articles.ts に集約)
- `next/components/header.tsx`
- `next/components/article-list.tsx`
- `next/components/article-list-item.tsx`
- `next/components/source-badge.tsx`
- `next/components/empty-state.tsx`
- `next/components/footer.tsx`
- `next/public/robots.txt`

### 既存ファイル更新 (in-place)
- `next/app/page.tsx` (Home の中身を完全に書き換え)
- `next/app/layout.tsx` (lang / metadata 更新)

### テスト
- `next/lib/articles.test.ts` (example-based)
- `next/lib/articles.pbt.test.ts` (PBT-03: ソート不変条件)
