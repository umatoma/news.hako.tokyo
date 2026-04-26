# NFR Design Patterns — Unit 1 (Collector)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Design
**Created**: 2026-04-25

このドキュメントは Unit 1 (Collector) で採用する **設計パターン** を、NFR カテゴリ別に整理します。多くは Application Design / Functional Design / NFR Requirements で確定済みのため、本ドキュメントは **パターン名と適用箇所の対応** を明示する位置付けです。

---

## 1. Resilience (回復性) パターン

### 1.1 Fail-Continue (失敗継続)
- **目的**: 1 ソース失敗が全体停止につながらない
- **適用箇所**: `CollectorRunner.run()` の Adapter 呼び出しループ
- **実装方針**: 例外 throw + try/catch (Q1=A)。失敗時はログ + `failedSources` に記録、次の Adapter へ継続。
- **関連ルール**: BR-51〜52、Q4=A (Functional Design)

```typescript
// 擬似コード
for (const fetcher of fetchers) {
  if (!config[fetcher.source].enabled) continue;
  try {
    const articles = await fetcher.fetch(config[fetcher.source]);
    allFetched.push(...articles.slice(0, config[fetcher.source].maxItemsPerRun));
  } catch (err) {
    failedSources.push(fetcher.source);
    logger.error(fetcher.source, "fetch failed", { error: serializeError(err) });
    // 次へ継続
  }
}
```

### 1.2 Fail-Fast (致命エラー時)
- **目的**: データ不整合 / I/O 失敗を早期に可視化する
- **適用箇所**: `Deduplicator.initialize()` の frontmatter スキーマ違反、`MarkdownWriter.write()` の I/O 失敗
- **実装方針**: throw → CollectorRunner が catch せず exit code 1 で終了
- **関連ルール**: BR-53〜55

### 1.3 Timeout
- **目的**: 1 リクエストが詰まっても全体時間に制限をかける
- **適用箇所**: `HttpClient` 抽象 (Adapter から呼び出される全 HTTP)
- **実装方針**: Node.js 標準 `fetch` + `AbortSignal.timeout(30_000)` (30 秒)
- **関連ルール**: U1-NFR-PERF-02

```typescript
// 擬似コード (HttpClient 実装)
async get(url, headers) {
  return await fetch(url, {
    headers,
    signal: AbortSignal.timeout(30_000),
  });
}
```

### 1.4 リトライなし (No-Retry)
- **目的**: シンプルさ優先、明日の cron 実行で自然回復
- **適用箇所**: 全 HTTP 呼び出し
- **実装方針**: 失敗時はそのままエラーとし、リトライしない
- **関連ルール**: Q3=A (NFR Requirements)、BR-50

---

## 2. Performance (性能) パターン

### 2.1 Sequential Execution (逐次実行)
- **目的**: 規約遵守 (Togetter のレート制御) と並列性管理の単純化
- **適用箇所**: `CollectorRunner.run()` の Adapter 呼び出しループ
- **実装方針**: `for...of` + `await` で逐次実行 (Promise.all 等の並列化はしない)
- **関連ルール**: Q4=A (Application Design)、BR-49

### 2.2 Per-Source Bounded Cap (取得件数上限)
- **目的**: 暴走 / 規約違反を防ぐ
- **適用箇所**: 各 Adapter の `*Config.maxItemsPerRun`
- **実装方針**: Adapter からの戻り値を `slice(0, maxItemsPerRun)` で切り詰め
- **関連ルール**: BR-47〜48、U1-NFR-PERF-04

### 2.3 Streaming-Free, In-Memory (シンプル化)
- **目的**: 1 回あたり高々 200 件程度の Article を扱うため、Stream 処理は不要
- **適用箇所**: `CollectorRunner` の Article 配列処理
- **実装方針**: 全件メモリ展開 (シンプル)。将来件数が増えたら見直し

### 2.4 No Premature Optimization
- **目的**: MVP 期間 1〜2 週間 (NFR-06) を遵守
- **適用箇所**: 全体
- **実装方針**: ベンチマーク不要、5 分以内に動けば OK

---

## 3. Security (安全性) パターン

### 3.1 Secret Management (将来拡張用)
- **目的**: シークレット漏洩を防ぐ
- **適用箇所**: 将来的に API キーが必要なソースを追加する場合
- **実装方針**: `process.env.{KEY_NAME}` から取得し、必要なクラスのコンストラクタで DI。`config/sources.ts` には絶対に含めない
- **関連ルール**: U1-NFR-SEC-01〜02、BR-75

### 3.2 User-Agent Identification (スクレイピング作法)
- **目的**: 規約遵守、スクレイピングであることを明示
- **適用箇所**: `TogetterScraper` (および将来 Web スクレイピングする全 Adapter)
- **実装方針**: HTTP リクエスト時に `User-Agent: news.hako.tokyo collector (umatoma)` を必ず付与
- **関連ルール**: BR-68、U1-NFR-SEC-07

### 3.3 Rate Limiting (レート制御)
- **目的**: 連続リクエストでサーバに負荷をかけない
- **適用箇所**: `TogetterScraper` の複数 URL 取得
- **実装方針**: 各リクエスト間に `requestIntervalMs` (デフォルト 5000ms) の sleep
- **関連ルール**: BR-49、U1-NFR-PERF-05

### 3.4 Secret Scrubbing (ログサニタイズ)
- **目的**: ログにシークレットが混入しないようにする
- **適用箇所**: 全ログ出力 (`logger.*`)
- **実装方針**: ログ出力前にメッセージから既知の secret パターン (`Bearer ...`, `Authorization: ...`, `api_key=...`) を `[REDACTED]` に置換するヘルパを通す。MVP では API キー使用なしのため実害は無いが、将来追加時の事故を防ぐためのルール。
- **関連ルール**: BR-60、U1-NFR-SEC-04

### 3.5 CI Gate (Secrets スキャン)
- **目的**: コードに secrets がコミットされない
- **適用箇所**: PR 時 + main push 時の GitHub Actions ワークフロー
- **実装方針**: `gitleaks/gitleaks-action@v2` を CI に組込、検出時は CI 失敗 (gate)
- **関連ルール**: U1-NFR-SEC-06、Q6=B

### 3.6 Dependency Scan (Advisory)
- **目的**: 既知脆弱性を持つ依存を検知
- **適用箇所**: PR 時 + main push 時
- **実装方針**: `npm audit --audit-level=moderate` を実行、結果はログに残すが `continue-on-error: true` で CI gate にはしない (警告通知のみ)
- **関連ルール**: U1-NFR-SEC-05、Q6=B

---

## 4. Observability (観測性) パターン

### 4.1 Structured Logging (Hybrid)
- **目的**: 視認性 (人) とパース容易性 (機械) を両立
- **適用箇所**: `CollectorRunner` の各フェーズ + Adapter のログ
- **実装方針**: stdout は **`[LEVEL][source] message extra=value ...`** 形式のプレーンテキスト + `collector-result.json` に構造化サマリー
- **関連ルール**: BR-56〜59、U1-NFR-OBS-01〜02、Q6=C

### 4.2 Job Summary (GitHub Actions 統合)
- **目的**: GitHub Actions の Web UI で結果を可視化
- **適用箇所**: 収集ジョブの最終ステップ
- **実装方針**: `collector-result.json` を Markdown 整形して `$GITHUB_STEP_SUMMARY` ファイルに append
- **関連ルール**: Q7=C、U1-NFR-OBS-02

### 4.3 Artifact Upload (長期保管)
- **目的**: 失敗解析時にいつでも結果を確認可能にする
- **適用箇所**: 収集ジョブの最終ステップ
- **実装方針**: `actions/upload-artifact@v4` で `collector-result.json` をアップロード (90 日保持)
- **関連ルール**: Q7=C、U1-NFR-OBS-04

### 4.4 No External Telemetry
- **目的**: シンプルさ優先、外部 SaaS 不使用
- **適用箇所**: 全体
- **実装方針**: Datadog / Sentry 等の APM は MVP では導入しない。GitHub Actions のデフォルト機能で十分

---

## 5. Testability (テスト容易性) パターン

### 5.1 Dependency Injection
- **目的**: I/O 抽象 + ロジック単体のテストを可能にする
- **適用箇所**: `CollectorRunner` / `MarkdownWriter` / `Deduplicator` / 各 `*Fetcher`
- **実装方針**: コンストラクタで `HttpClient` / `FileSystem` / `Clock` / `Logger` 等の依存を受け取る (デフォルト実装は本番用、テストはモック差し替え)
- **関連ルール**: Application Design Component-dependency.md §6

### 5.2 Clock Abstraction (Q2=A)
- **目的**: `collectedAt` 等の時刻依存ロジックを決定的にテストできるようにする
- **適用箇所**: `CollectorRunner`、(将来 publishedAt フォールバック生成箇所)
- **実装方針**:
  ```typescript
  type Clock = () => Date;
  // CollectorRunner の DI
  constructor(deps: { ..., clock?: Clock; }) {
    this.clock = deps.clock ?? (() => new Date());
  }
  ```
- **テスト時**: `clock: () => new Date("2026-04-25T22:00:00Z")` を注入

### 5.3 Static Import + Constructor Injection (Q3=A)
- **目的**: 設定 (`config/sources.ts`) の差し替えを簡単にしつつ、依存を明示
- **適用箇所**: `CollectorRunner` のエントリポイント
- **実装方針**:
  ```typescript
  // next/scripts/collector/index.ts
  import sourceConfig from "@/config/sources";  // 静的 import
  import { buildRunner } from "./runner";
  const runner = buildRunner({ config: sourceConfig });
  await runner.run();
  ```
- テスト時は `buildRunner({ config: testFixture })` で別 config を注入

### 5.4 Generators for PBT (PBT-07)
- **目的**: ドメイン型のジェネレータを共通化、PBT で再利用
- **適用箇所**: `next/scripts/collector/test/generators/`
- **実装方針**: `articleArbitrary`, `rssItemArbitrary`, `urlArbitrary` 等を 1 ファイルにまとめ、各 PBT テストから import
- **関連ルール**: BR-80、U1-NFR-MAINT-04

### 5.5 Test Naming Convention (PBT-10 advisory)
- **目的**: example-based と PBT を分離、可読性確保
- **適用箇所**: 全テストファイル
- **実装方針**: `*.test.ts` (example-based) / `*.pbt.test.ts` (property-based)

---

## 6. Architecture (構造) パターンの再確認

| パターン | 適用 | 関連ドキュメント |
|---|---|---|
| **Adapter** | `SourceFetcher<TConfig>` interface + 4 実装 | components.md §4 |
| **Repository** | `ArticleRepository` (ただし Unit 2 側、Unit 1 では `Deduplicator` が読込側) | components.md §3.4 |
| **Strategy** | 各 Adapter は自分のソース固有戦略を保持 | — |
| **Builder** | URL ビルダー (`buildSearchUrl` 等)、SlugBuilder | business-logic-model.md §2.4, §5 |
| **Value Object** | URL 正規化値、Slug、Article id | domain-entities.md §4, §5, §2.4 |
| **DI Container (mini)** | `runner.ts` の `buildRunner({ deps })` 関数で集約 | (Code Generation で実装) |

---

## 7. PBT (Partial) パターン適用先

| Component | PBT Rule | パターン |
|---|---|---|
| `toFrontmatter` / `fromFrontmatter` | PBT-02 | Round-trip Property |
| `normalizeUrlForDedup` | PBT-03 | Idempotence + Sanitation Invariants |
| `Deduplicator.filterNew` | PBT-03 | Boundedness + Uniqueness + Exclusion Invariants |
| `SlugBuilder.build` | PBT-03 | Format + Length + Determinism + Discrimination Invariants |
| Article / RssItem ジェネレータ | PBT-07 | Domain-typed Generators (再利用可能) |
| 全 PBT 実行 | PBT-08 | Shrinking + Seed Reproducibility (CI ログ) |
| Framework | PBT-09 | fast-check + Vitest |

---

## 8. Anti-Patterns (避ける)

| アンチパターン | 理由 |
|---|---|
| **Eager Optimization** | MVP 期間に合わない。5 分以内に動けば十分 |
| **Smart Retry without Idempotency** | 規約違反のリスク (Togetter 等)、複雑度増 |
| **Tight Coupling to Specific RSS Library** | 将来切替えしやすいよう、`SourceFetcher` IF を経由 |
| **Hardcoded Secrets / URLs** | `config/sources.ts` 集約 (NFR-08) |
| **Silent Failures** | Adapter 失敗は必ずログ + `failedSources` に残す (BR-51) |
| **Stateful Singletons** | Logger は機能分離して関数注入。Test 時にモック容易 |
| **Mixing example-based and PBT in same file** | PBT-10 advisory (Partial では非ブロッキング) |
