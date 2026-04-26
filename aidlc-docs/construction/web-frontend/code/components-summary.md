# Components — Code Summary (Unit 2)

**Generated**: 2026-04-26
**Step**: 3 (Code Generation Plan)

## ファイル

| Path | コンポーネント | 主な役割 | data-testid |
|---|---|---|---|
| `next/components/header.tsx` | `Header` | サイトタイトル + 件数 (Q5=B) | `header-article-count` |
| `next/components/footer.tsx` | `Footer` | サイト名 + 最終更新表示 (Q5=B) | `footer-last-updated` |
| `next/components/empty-state.tsx` | `EmptyState` | 0 件時の「まだ記事がありません」(Q4=A) | `empty-state-message` |
| `next/components/source-badge.tsx` | `SourceBadge` | sourceId に応じた色のバッジ (Q3=A) | `source-badge-{sourceId}` |
| `next/components/article-list-item.tsx` | `ArticleListItem` | 1 記事の表示 (タイトル外部リンク + バッジ + 日付) | `article-link` |
| `next/components/article-list.tsx` | `ArticleList` | `<ul>` で `ArticleListItem` を map | — |

## 共通方針
- すべて Server Component (`"use client"` なし)
- Tailwind v4 の `dark:` バリアントでライト/ダーク両対応
- `next/lib/article.ts` の `SourceId` 型 / `next/lib/articles.ts` の View 型を利用
- `target="_blank"` には `rel="noopener noreferrer"` を併記 (U2-BR-12)

## トレーサビリティ
- FR-01 / FR-05 / AC-06 / AC-10
- U2-BR-10〜17 (表示)
- U2-BR-18〜24 (レイアウト + 空状態)
- U2-BR-30〜34 (テーマ)
- U2-BR-35〜39 (アクセシビリティ)
