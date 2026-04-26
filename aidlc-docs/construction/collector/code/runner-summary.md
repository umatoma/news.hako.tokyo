# Runner / Builder / Entry — Code Summary

**Generated**: 2026-04-25
**Step**: 6.1〜6.4

## ファイル一覧

| Path | 役割 |
|---|---|
| `next/scripts/collector/runner.ts` | `CollectorRunner` クラス (オーケストレーション本体) |
| `next/scripts/collector/builder.ts` | `buildRunner({ config, ... })` ファクトリ (DI ツリー組立) |
| `next/scripts/collector/index.ts` | エントリポイント (静的 import + main 実行 + エラーで exit 1) |

## CollectorRunner.run() の流れ

1. `clock()` で開始時刻を記録 → log "start"
2. `deduplicator.initialize()` で既存 URL set 構築 → log "dedup initialized"
3. **逐次** で各 Adapter の `fetch(config[source])` を呼出 (Q4=A 失敗継続):
   - `enabled=false` ならスキップ + log "disabled, skipping"
   - 成功 → `perSource[source].fetched` に件数記録 + log "fetched"
   - 失敗 → `failedSources` 追加 + `perSource[source].error` に格納 + log "fetch failed"
4. `deduplicator.filterNew(allFetched)` で重複排除 → log "dedup"
5. 残った Article に `collectedAt = clock().toISOString()` 付与
6. `writer.write(stamped)` で Markdown 書出し → log "write"
7. `CollectorRunResult` 構築 → log "done"

## buildRunner の責務

- 全依存をデフォルト実装で組み立てる (`defaultHttpClient` / `defaultFileSystem` / `systemClock` / `DefaultLogger`)
- 任意の依存はオプションで上書き可能 (テスト時に注入)
- 戻り値: `{ runner, reporter, logger }`
- `runner.run()` の結果を `reporter.emit()` に渡すと、`collector-result.json` を書き出し、`GITHUB_STEP_SUMMARY` 環境変数があれば Job Summary 用 Markdown も append

## index.ts の責務

- リポジトリルート (3 階層上) を `path.resolve` で計算
- `CONTENT_DIR = <repo-root>/content`
- `RESULT_JSON_PATH = <repo-root>/next/collector-result.json` (.gitignore 済)
- `jobSummaryPath = process.env.GITHUB_STEP_SUMMARY` (CI 環境のみ設定される)
- 致命エラーで `process.exit(1)`

## トレーサビリティ

- FR-02 / FR-03 (情報収集 + 自動収集ジョブ): runner.ts (オーケストレーション)
- BR-50〜52 (失敗継続 / exit code 0 維持): runner.ts (`for ... try/catch`)
- BR-53〜54 (致命エラーで exit 1): index.ts (`main().catch`) + Deduplicator/Writer 失敗時の throw 伝播
- Q3=A (静的 import): index.ts で `import sourceConfig from "@/config/sources"`
- Q1=A / Q2=A / Q3=A (NFR Design): builder.ts で DI、runner.ts で try/catch、`Clock` を内部参照
