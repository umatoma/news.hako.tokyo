# Tests — Code Summary

**Generated**: 2026-04-25
**Step**: 7.1〜10.3

## ファイル一覧

### Test Generators (PBT-07)
| Path | 役割 |
|---|---|
| `next/scripts/collector/test/generators/url.gen.ts` | `urlArbitrary` (トラッキングパラメータ含む) + `cleanUrlArbitrary` (クリーン版) |
| `next/scripts/collector/test/generators/article.gen.ts` | `articleArbitrary` |
| `next/scripts/collector/test/generators/rss-item.gen.ts` | `rssItemArbitrary` + `renderRssXml(items)` ヘルパ |

### Test Helpers
| Path | 役割 |
|---|---|
| `next/scripts/collector/test/in-memory-file-system.ts` | `InMemoryFileSystem` (FileSystem 抽象のテスト用実装) |
| `next/scripts/collector/test/recording-http-client.ts` | `RecordingHttpClient` (HttpClient 抽象のテスト用実装、URL→レスポンスマップ) |

### Example-based Tests (`*.test.ts`)
| Path | 検証対象 |
|---|---|
| `article.test.ts` | toFrontmatter / fromFrontmatter ペア例、不正値の reject |
| `article-id.test.ts` | id 文字種、決定性、tracking 違いの吸収 |
| `url-normalize.test.ts` | trailing slash / tracking params / sort / fragment / 大文字 host |
| `slug-builder.test.ts` | ASCII / 日本語 / 短文 / 長文 / 文字種 / 決定性 |
| `secret-scrubber.test.ts` | Bearer / Authorization / api_key / password パターン |
| `deduplicator.test.ts` | initialize / filterNew (既存・バッチ内重複) / 未初期化エラー |
| `markdown-writer.test.ts` | renderMarkdown / write / 衝突回避 / 空入力 |
| `runner.test.ts` | 統合: 通常実行 / Adapter 失敗継続 / 既存重複 |
| `sources/zenn-rss-fetcher.test.ts` | 通常 RSS / disabled / maxItemsPerRun |
| `sources/hatena-rss-fetcher.test.ts` | 通常 RSS / 1 feed 失敗時の継続 |
| `sources/google-news-rss-fetcher.test.ts` | URL 構築 / 通常取得 / 設定空の場合 |
| `sources/togetter-scraper.test.ts` | HTML 抽出 / 複数 URL 間の sleep / disabled |

### PBT (`*.pbt.test.ts`)
| Path | 適用 PBT Rule |
|---|---|
| `article.pbt.test.ts` | PBT-02 (Round-trip) |
| `article-id.pbt.test.ts` | PBT-03 (文字種 / 決定性) |
| `url-normalize.pbt.test.ts` | PBT-03 (冪等性 / サニタイズ / fragment 除去) |
| `slug-builder.pbt.test.ts` | PBT-03 (文字種 / 長さ / 決定性 / 衝突回避) |
| `deduplicator.pbt.test.ts` | PBT-03 (境界性 / 一意性) |
| `markdown-writer.pbt.test.ts` | PBT-02 (write→read ラウンドトリップ) |

## 実行方法

```bash
cd next
npm test          # vitest watch モード
npm run test:run  # 単発実行 (CI 向け)
```

## Vitest 設定 (`next/vitest.config.ts`)

- `environment: "node"`
- `include: ["**/*.test.ts"]` (`*.pbt.test.ts` も `.test.ts` で終わるためマッチ)
- `reporters: "verbose"` (PBT の seed をログ出力 — PBT-08 要件)
- `alias: { "@": next/ ルート }` (TypeScript paths と一致)

## トレーサビリティ

- AC-07 (CI で lint + typecheck + unit + E2E が緑): test スクリプト + GitHub Actions
- AC-08 (PBT が CI で実行され seed ログが残る): PBT-* + verbose reporter
- PBT-09 (Framework Selection): vitest + fast-check (確定済)
- PBT-08 (Shrinking + Reproducibility): vitest verbose + fast-check デフォルト shrinking
