# Service Library — Code Summary

**Generated**: 2026-04-25
**Step**: 4.1〜4.5

## ファイル一覧

| Path | 役割 |
|---|---|
| `next/scripts/collector/logger.ts` | `Logger` interface + `DefaultLogger` (SecretScrubber 経由 + reports 蓄積) |
| `next/scripts/collector/lib/deduplicator.ts` | `Deduplicator` クラス (initialize / filterNew / 既存 frontmatter 走査) |
| `next/scripts/collector/lib/markdown-writer.ts` | `MarkdownWriter` クラス (Article → Markdown、衝突回避サフィックス) |
| `next/scripts/collector/lib/job-summary-reporter.ts` | `JobSummaryReporter` (collector-result.json + GITHUB_STEP_SUMMARY 書出) + `CollectorRunResult` 型 |

## 主要 API

### Logger
```typescript
logger.info("zenn", "fetched", { count: 23 });
// → stdout: [INFO][zenn] fetched count=23
// → reports: [{ level: "info", source: "zenn", message: "fetched", context: { count: 23 }, timestamp: "..." }]
```

### Deduplicator
```typescript
const d = new Deduplicator({ contentDir, fileReader });
await d.initialize();          // 既存 .md の frontmatter から URL set 構築
const newOnly = d.filterNew(candidates);
```

### MarkdownWriter
```typescript
const w = new MarkdownWriter({ contentDir, fileSystem, slugBuilder });
const { written, skipped } = await w.write(articles);
// → content/{date}-{slug}.md or content/{date}-{slug}-{N}.md (衝突時)
```

### JobSummaryReporter
```typescript
const reporter = new JobSummaryReporter({ resultJsonPath, jobSummaryPath: process.env.GITHUB_STEP_SUMMARY });
await reporter.emit(result);
// → resultJsonPath に JSON 書出し
// → jobSummaryPath が指定されていれば Markdown を append
```

## トレーサビリティ

- BR-20〜30 (重複排除ロジック): deduplicator.ts
- BR-41〜46 (Markdown ファイル形式 / snake_case frontmatter): markdown-writer.ts
- U1-NFR-OBS-01〜03 (stdout プレーン + 構造化レポート): logger.ts + job-summary-reporter.ts
- U1-NFR-OBS-02 (Job Summary + artifact): job-summary-reporter.ts
- BR-60 (ログサニタイズ): logger.ts (`SecretScrubber` 経由)

## PBT 適用

- PBT-03: `deduplicator.ts` (filterNew の境界性 / 一意性 / 除外性)
- PBT-02: `markdown-writer.ts` (Article → write → re-parse → Article ラウンドトリップ)
