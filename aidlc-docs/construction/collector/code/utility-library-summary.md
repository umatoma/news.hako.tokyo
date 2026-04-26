# Utility Library — Code Summary

**Generated**: 2026-04-25
**Step**: 3.1〜3.8

## ファイル一覧

| Path | 役割 |
|---|---|
| `next/scripts/collector/lib/article-id.ts` | `generateArticleId(url)` — SHA-256 → Base36 (16 文字) |
| `next/scripts/collector/lib/url-normalize.ts` | `normalizeUrlForDedup(url)` — Q5=B 軽い正規化 (utm_*, gclid 等を除外) |
| `next/scripts/collector/lib/slug-builder.ts` | `SlugBuilder.build(title, articleId)` — Q4=C ハイブリッド slug |
| `next/scripts/collector/lib/clock.ts` | `Clock` 型 + `systemClock` + `fixedClock` (時刻注入抽象) |
| `next/scripts/collector/lib/secret-scrubber.ts` | `SecretScrubber.scrub(text)` — Bearer/Authorization/api_key パターン除去 |
| `next/scripts/collector/lib/http-client.ts` | `HttpClient` interface + `DefaultHttpClient` (fetch + AbortSignal.timeout(30s) + UA) |
| `next/scripts/collector/lib/file-system.ts` | `FileSystem` interface + `DefaultFileSystem` (recursive markdown scan + ensureDir + writeText) |

## トレーサビリティ

- BR-31〜34 (id 生成): article-id.ts
- BR-25〜30 (URL 正規化): url-normalize.ts
- BR-35〜40 (slug 生成): slug-builder.ts
- U1-NFR-PERF-02 (HTTP timeout 30s): http-client.ts (`AbortSignal.timeout`)
- U1-NFR-SEC-07 (User-Agent): http-client.ts (`DEFAULT_USER_AGENT`)
- BR-60 / U1-NFR-SEC-04 (secret scrub): secret-scrubber.ts
- Q2=A (Clock 抽象): clock.ts

## PBT 適用

- PBT-03: `article-id.ts` (決定性 / 文字種 / 長さ)
- PBT-03: `url-normalize.ts` (冪等性 / サニタイズ / 安定性)
- PBT-03: `slug-builder.ts` (文字種 / 長さ / 決定性 / 衝突回避)

`http-client.ts`, `file-system.ts`, `clock.ts`, `secret-scrubber.ts` は副作用ベースのため、example-based テストで担保。
