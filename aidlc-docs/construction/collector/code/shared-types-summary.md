# Shared Types & Config — Code Summary

**Generated**: 2026-04-25
**Step**: 2.1〜2.3 (Code Generation Plan)

## ファイル一覧

| Path | 役割 |
|---|---|
| `next/lib/article.ts` | Article 型 + zod schemas (camelCase / snake_case) + 双方向変換ヘルパ |
| `next/config/sources.ts` | SourceConfig 型 + 各 *Config の zod schema + MVP 初期値 |

## `next/lib/article.ts` の主要 export

- `ARTICLE_SOURCES`: `["zenn", "hatena", "googlenews", "togetter"]` (const tuple)
- `SourceIdSchema` / `SourceId` (`z.enum`)
- `ArticleSchema` / `Article` (camelCase 型)
- `ArticleFrontmatterSchema` / `ArticleFrontmatter` (snake_case 型)
- `toFrontmatter(article: Article): ArticleFrontmatter`
- `fromFrontmatter(raw: unknown): Article`

## `next/config/sources.ts` の主要 export

- `ZennConfigSchema` / `ZennConfig`
- `HatenaConfigSchema` / `HatenaConfig`
- `GoogleNewsTopicSchema` / `GoogleNewsTopic` (8 種)
- `GoogleNewsConfigSchema` / `GoogleNewsConfig` (queries / topics / geos / hl / gl / ceid)
- `TogetterConfigSchema` / `TogetterConfig`
- `SourceConfigSchema` / `SourceConfig`
- **default export**: MVP 初期値 (Q10=A、全ソース有効、控えめなクエリ)

## MVP 初期値の詳細

| Source | enabled | 初期値 |
|---|---|---|
| zenn | true | feedUrls: `https://zenn.dev/feed`、maxItemsPerRun: 50 |
| hatena | true | feedUrls: `https://b.hatena.ne.jp/hotentry/it.rss`、maxItemsPerRun: 50 |
| googlenews | true | queries: `["AI"]`、topics: `["TECHNOLOGY"]`、geos: `[]`、hl/gl/ceid: ja/JP/JP:ja、maxItemsPerRun: 50 |
| togetter | true | targetUrls: `https://togetter.com/category/news`、requestIntervalMs: 5000、maxItemsPerRun: 30 |

## トレーサビリティ

- FR-02: 情報収集 (4 ソース) ✅ SourceConfig で網羅
- BR-01〜BR-08 (Article データ完全性) ✅ zod schema で強制
- BR-45〜BR-46 (frontmatter snake_case + camelCase 双方向変換) ✅ toFrontmatter / fromFrontmatter
- PBT-02 (Round-trip property) → `*.pbt.test.ts` で検証 (Step 9)
