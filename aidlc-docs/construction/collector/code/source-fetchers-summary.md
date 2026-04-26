# Source Fetchers — Code Summary

**Generated**: 2026-04-25
**Step**: 5.1〜5.6

## ファイル一覧

| Path | 役割 |
|---|---|
| `next/scripts/collector/sources/source-fetcher.ts` | `SourceFetcher<TConfig>` interface + `FetchedArticle` 型 (Article without `collectedAt`) |
| `next/scripts/collector/sources/rss-mapping.ts` | RSS 共通パース + Article マッピング (Zenn / Hatena / Google ニュースで再利用) |
| `next/scripts/collector/sources/zenn-rss-fetcher.ts` | Zenn 用 Adapter (`feedUrls` 順次取得 + RSS パース) |
| `next/scripts/collector/sources/hatena-rss-fetcher.ts` | はてブ用 Adapter (同上、`<dc:date>` を `isoDate` で扱う) |
| `next/scripts/collector/sources/google-news-rss-fetcher.ts` | Google ニュース用 Adapter (`buildGoogleNewsUrls` で URL 構築) |
| `next/scripts/collector/sources/togetter-scraper.ts` | Togetter 用 Adapter (cheerio でカテゴリ別人気まとめページ抽出 + UA + sleep) |

## Adapter パターン

すべての Fetcher は `SourceFetcher<TConfig>` interface を実装:
- `readonly source: SourceId`
- `fetch(config: TConfig): Promise<FetchedArticle[]>`

### 共通仕様
- `enabled: false` ならスキップ (空配列を返す)
- `maxItemsPerRun` で上限切り詰め
- フィード単位 / URL 単位の失敗は warn ログ + 継続 (Adapter 全体は throw しない方針、ただし重大時は throw)
- `collectedAt` は付与しない (Runner 側で付与、`FetchedArticle = Omit<Article, "collectedAt">`)

### Google ニュース URL 構築 (`buildGoogleNewsUrls`)
```
hl=ja&gl=JP&ceid=JP:ja  (共通)
queries → /rss/search?q={query}&{common}
topics  → /news/rss/headlines/section/topic/{TOPIC}?{common}
geos    → /news/rss/headlines/section/geo/{geo}?{common}
```

### Togetter スクレイピング (`parseCategoryPage`)
- セレクタ: `a[href*="/li/"]` (まとめへのリンク)
- 抽出: title (anchor text), URL (`/li/...`), summary (anchor `title` 属性), tags (URL の `/category/{name}/` から)
- 必須セレクタが 0 件ヒットの場合は throw (HTML 構造変化検知、BR-72)
- リクエスト間隔: `requestIntervalMs` (Q7 / BR-49)
- User-Agent: `news.hako.tokyo collector (umatoma)` (DefaultHttpClient で付与、BR-68)

## トレーサビリティ

- AC-04 (4 ソース取得): すべての Adapter
- BR-13〜19 (フォールバック / 補完): rss-mapping.ts (publishedAt fallback、HTML 除去)
- BR-31〜34 (id 生成): 各 Adapter で `generateArticleId(url)` を呼び出す
- BR-65〜67 (Google ニュース仕様): google-news-rss-fetcher.ts
- BR-68〜72 (Togetter スクレイピング): togetter-scraper.ts
- U1-NFR-COMP-02 (Google ニュース仕様変更検知): warn ログに status + length を記録 (google-news-rss-fetcher.ts)

## PBT 適用 (Partial)

Adapter 自体は副作用 (HTTP) を含むため、PBT は適用しない (advisory)。代わりに:
- `rss-mapping.ts` の純粋関数部分は example-based テストでカバー
- `buildGoogleNewsUrls` は決定的なため URL ジェネレータと組み合わせた PBT も将来検討可能 (MVP では example-based のみ)
- `parseCategoryPage` は cheerio 経由の決定的処理だが、HTML 入力空間の探索は example-based で行う
