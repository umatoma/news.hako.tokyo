# Library — Code Summary (Unit 2)

**Generated**: 2026-04-26
**Step**: 2 (Code Generation Plan)

## ファイル

| Path | 役割 |
|---|---|
| `next/lib/articles.ts` | Repository (`FsArticleRepository`) + 純粋関数群 (`sortArticlesForDisplay`, `toListItemView`, `formatPublishedAt`, `computePageStats`, `resolveContentDir`) + 定数 (`SOURCE_LABEL`) |

## 主要 export

```typescript
export const SOURCE_LABEL: Record<SourceId, string>;
export function formatPublishedAt(iso: string): string;
export function resolveContentDir(): string;
export function toListItemView(article: Article): ArticleListItemView;
export function sortArticlesForDisplay(articles: ReadonlyArray<Article>): Article[];
export function computePageStats(articles: ReadonlyArray<Article>): PageStats;
export interface FileReader { ... }
export class FsArticleRepository implements ArticleRepository { ... }
export const articleRepository: ArticleRepository;
```

## トレーサビリティ

- FR-01 (一覧表示) / AC-06: `articleRepository.getAllArticles` + `sortArticlesForDisplay` + `toListItemView`
- BR-13 / U2-BR-13: `SOURCE_LABEL`
- U2-BR-14 / Q2=A: `formatPublishedAt` (Intl.DateTimeFormat ja-JP)
- U2-BR-06〜09 / Q6=A: `sortArticlesForDisplay` (publishedAt 降順 + collectedAt 降順)
- U2-BR-19〜20: `computePageStats`
- U2-BR-45〜47 / Q1=B: `resolveContentDir` (env 優先 + デフォルト)
- U2-BR-01〜05 / U2-BR-43〜44: `FsArticleRepository`
- PBT-03: `sortArticlesForDisplay` の不変条件は `articles.pbt.test.ts` で検証
