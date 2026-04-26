# Domain Entities — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Functional Design
**Created**: 2026-04-26

Unit 2 (Web Frontend) のドメインモデル。中核 entity (`Article`) は **Unit 1 で確定済** (`next/lib/article.ts`) を流用するため、ここでは Unit 2 固有の **表示用 ViewModel** および **設定** を定義します。

---

## 1. 流用する Entity (Unit 1 で確定済)

| 名称 | 場所 | 用途 |
|---|---|---|
| `Article` | `next/lib/article.ts` | 取得・保存・表示すべての層で共有 |
| `SourceId` | 同上 | enum |
| `ArticleSchema` / `ArticleFrontmatterSchema` | 同上 | バリデーション |
| `fromFrontmatter` | 同上 | Markdown frontmatter → Article (Unit 2 の Repository が利用) |

Unit 2 では **新規型を最小限** に抑え、表示直前の整形のみを担います。

---

## 2. View Model — `ArticleListItemView`

`Article` (純粋ドメイン) を **表示用に整形した形** を `ArticleListItemView` として定義します。これにより `ArticleListItem` コンポーネントは整形済みの値だけ受け取り、責務が明確になります。

```typescript
// next/lib/articles.ts (Repository) または専用ファイル
export interface ArticleListItemView {
  id: string;                  // = Article.id (key 用途)
  title: string;
  url: string;                 // 元記事 URL (外部リンク用)
  sourceLabel: string;         // 表示用ラベル (例: "Zenn")
  sourceId: SourceId;          // バッジのスタイル切替に使用
  publishedAtIso: string;      // 元の ISO 8601 (`<time dateTime={...}>` 用)
  publishedAtDisplay: string;  // 表示用整形済み (例: "2026年4月25日 16:00")
}
```

**ルール**:
- `ArticleListItemView` は **純粋関数** で `Article` から作成 (テスト容易)
- 関数: `toListItemView(article: Article): ArticleListItemView`

---

## 3. Source Label マッピング (Q3=A)

| `SourceId` | 表示ラベル |
|---|---|
| `"zenn"` | `Zenn` |
| `"hatena"` | `はてブ` |
| `"googlenews"` | `Google ニュース` |
| `"togetter"` | `Togetter` |

```typescript
// next/lib/articles.ts (or next/lib/source-label.ts)
export const SOURCE_LABEL: Record<SourceId, string> = {
  zenn: "Zenn",
  hatena: "はてブ",
  googlenews: "Google ニュース",
  togetter: "Togetter",
};
```

---

## 4. 日付フォーマッタ (Q2=A)

```typescript
const DATE_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "short",
  // SSG ビルド時に Node.js のロケールに依存しないよう明示
});

export function formatPublishedAt(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}
```

**期待出力例**: `2026年4月25日 16:00`

> **Note**: SSG ビルド時 (Vercel) は `Intl.DateTimeFormat("ja-JP", ...)` がロケール `ja-JP` で動作することを前提とします。Vercel の Node.js は ICU full をサポートしているため問題なく動作します。

---

## 5. ソート関数 (Q6=A)

```typescript
export function sortArticlesForDisplay(articles: ReadonlyArray<Article>): Article[] {
  return [...articles].sort((a, b) => {
    // 一次キー: publishedAt 降順
    const primary = b.publishedAt.localeCompare(a.publishedAt);
    if (primary !== 0) return primary;
    // 二次キー: collectedAt 降順
    return b.collectedAt.localeCompare(a.collectedAt);
  });
}
```

ISO 8601 文字列は辞書順比較で時系列順に等しいため、`localeCompare` で十分。

---

## 6. ページ統計 (HeaderProps の入力)

```typescript
export interface PageStats {
  totalArticles: number;       // 表示する記事数
  lastUpdatedIso: string | null;  // 最も新しい collectedAt
  lastUpdatedDisplay: string | null;
}

export function computePageStats(articles: ReadonlyArray<Article>): PageStats {
  if (articles.length === 0) {
    return { totalArticles: 0, lastUpdatedIso: null, lastUpdatedDisplay: null };
  }
  const latest = articles.reduce(
    (acc, a) => (a.collectedAt > acc ? a.collectedAt : acc),
    articles[0]!.collectedAt,
  );
  return {
    totalArticles: articles.length,
    lastUpdatedIso: latest,
    lastUpdatedDisplay: formatPublishedAt(latest),
  };
}
```

---

## 7. Repository 設定 — `RepositoryOptions`

```typescript
export interface RepositoryOptions {
  contentDir: string;
}

export function resolveContentDir(): string {
  // Q1=B: 環境変数オーバーライド可
  if (process.env["CONTENT_DIR"]) {
    return process.env["CONTENT_DIR"];
  }
  // デフォルト: next/ 直下から見て親ディレクトリの content/
  return path.resolve(process.cwd(), "..", "content");
}
```

---

## 8. データフロー (Entity の流れ)

```
content/{date}-{slug}.md  (Unit 1 が書き出した Markdown)
    ↓ readText
gray-matter で {data, content} 分離
    ↓ data
fromFrontmatter (Unit 1 で定義済み)
    ↓ Article (camelCase)
sortArticlesForDisplay
    ↓ Article[] (ソート済)
toListItemView each
    ↓ ArticleListItemView[]
<ArticleListItem view={...} />
    → 静的 HTML (Vercel CDN 配信)
```

---

## 9. PBT 適用 (Partial、本ユニットでは最小限)

| 関数 | PBT Rule | テスト戦略 |
|---|---|---|
| `sortArticlesForDisplay` | PBT-03 | 不変条件: 出力長 = 入力長 / publishedAt 降順 / 同 publishedAt 内で collectedAt 降順 / 入出力の集合一致 |
| `toListItemView` | PBT-02 (advisory) | Article → View → 復元できる範囲が一致 (sourceId / id / url / title / publishedAt が保持される) |
| `formatPublishedAt` | example-based | 代表的 ISO 入力 → 期待出力の照合 (PBT は ICU 依存性が高いため不適) |
| `ArticleRepository.getAllArticles` | example-based + InMemoryFileSystem | (Unit 1 で確立されたパターン再利用) |
