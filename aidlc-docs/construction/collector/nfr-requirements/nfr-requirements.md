# NFR Requirements — Unit 1 (Collector)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Requirements
**Created**: 2026-04-25

このドキュメントは Unit 1 (News Collection Service / Collector) の **非機能要件** を確定します。プロジェクト全体の NFR (`requirements.md` §4) を継承しつつ、Collector 固有の数値目標・運用方針を明示します。

---

## 1. 既存 NFR の継承

`requirements.md` §4 で定めた NFR-01〜08 は本ユニットでも有効。本ドキュメントは **Unit 1 固有の追加要件・具体化** を中心に記述します。

---

## 2. パフォーマンス要件 (Unit 1 固有)

| ID | 要件 | 目標値 | 検証手段 |
|---|---|---|---|
| **U1-NFR-PERF-01** | CollectorRunner 1 回の総実行時間 | **5 分以内** (Q2=A) | GitHub Actions の job 実行時間ログ |
| **U1-NFR-PERF-02** | Adapter ごとの HTTP タイムアウト | **30 秒** | HttpClient 抽象に組込 |
| **U1-NFR-PERF-03** | 全体タイムアウト | **未設定** (= 個別タイムアウトの累積で自然制限) | — |
| **U1-NFR-PERF-04** | 各 Adapter の取得件数上限 | **Zenn / Hatena / Google ニュース 50 件、Togetter 30 件** (BR-47 / Q9=A) | `*Config.maxItemsPerRun` で制御 |
| **U1-NFR-PERF-05** | Togetter のリクエスト間隔 | **5000ms 以上** (BR-49) | `TogetterConfig.requestIntervalMs` で制御 |

### 想定実行プロファイル
- Adapter 数: 4
- 各 Adapter の HTTP 件数: Zenn 1 / Hatena 1 / Google ニュース 2〜数件 (queries × topics × geos の数) / Togetter `targetUrls` 数 (MVP は 1)
- 1 リクエストあたり概ね 1〜3 秒の応答 + Togetter のみ間隔 5 秒
- 想定総時間: ≒ 1 分前後 (余裕を持って **5 分予算**)

---

## 3. 信頼性要件

| ID | 要件 | 仕様 |
|---|---|---|
| **U1-NFR-REL-01** | Adapter 失敗時の振る舞い | **失敗継続戦略** (Q3=A、BR-51〜52)。次の Adapter を継続、`failedSources` に記録、exit code 0 を維持 |
| **U1-NFR-REL-02** | リトライ戦略 | **リトライなし** (Q3=A)。1 日 1 回 cron で結果オーライ。一時障害は翌日の実行で吸収。 |
| **U1-NFR-REL-03** | 致命エラー条件 | (a) `Deduplicator.initialize()` の失敗 (= 既存 frontmatter の不整合)、(b) `MarkdownWriter.write()` の I/O 失敗。いずれも exit code 1 で終了 (BR-53〜54) |
| **U1-NFR-REL-04** | エラー通知 | GitHub Actions のデフォルト失敗通知 (= ジョブが exit code 非 0 で終了した場合の自動通知) を利用。MVP では追加通知なし |

---

## 4. セキュリティ要件 (NFR-03 の具体化)

| ID | 要件 | 仕様 |
|---|---|---|
| **U1-NFR-SEC-01** | API キー / シークレット | 採用ソース (Zenn / Hatena / Google ニュース / Togetter) はいずれも **API キー不要**。MVP では Secrets 設定なし。 |
| **U1-NFR-SEC-02** | 将来的な Secrets 管理 | 将来 API キー必須のソースを追加する場合は **GitHub Actions Secrets** で管理し、コードにハードコードしない (BR-75)。 |
| **U1-NFR-SEC-03** | `.env.local` 取扱 | `.gitignore` で除外する。 |
| **U1-NFR-SEC-04** | ログへの secrets 露出禁止 | ログ出力に API キー / セッションクッキー等を含めない (BR-60)。 |
| **U1-NFR-SEC-05** | 依存脆弱性スキャン (npm audit) | **CI で実行するが警告レベルのみ通知 (CI は緑のまま)** (Q6=B)。脆弱性は GitHub の dependency alerts でも通知される。 |
| **U1-NFR-SEC-06** | secrets 漏洩スキャン (gitleaks) | **CI で実行、検出時は CI 失敗として gate** (Q6=B)。 |
| **U1-NFR-SEC-07** | スクレイピングのマナー | User-Agent を明示 (例: `news.hako.tokyo collector (umatoma)`)、`requestIntervalMs` を遵守 (BR-68〜69)。 |

---

## 5. 規約 / コンプライアンス

| ID | 要件 | 仕様 |
|---|---|---|
| **U1-NFR-COMP-01** | Togetter 利用規約・robots.txt | **確認済み・問題なし** (Q1=A、OQ-01 解消)。`requestIntervalMs: 5000ms` 程度を遵守し User-Agent を明示すれば許容範囲。MVP に含める。RSS 等の公式提供がない代替手段としてスクレイピングを採用。今後規約変更があった場合は即時 `enabled: false` に切替。 |
| **U1-NFR-COMP-02** | Google ニュース RSS 非公式仕様 | RISK-02 のとおり仕様変更リスクあり。エラーログには HTTP ステータス + レスポンス長を記録 (BR-67) し、運用で気づける状態にする。仕様変更時は `GoogleNewsRssFetcher` を差し替え。 |
| **U1-NFR-COMP-03** | Zenn / はてなブックマーク RSS | 公式提供のためコンプライアンス上の特記事項なし。 |

---

## 6. 観測性 (Observability) / ロギング

| ID | 要件 | 仕様 |
|---|---|---|
| **U1-NFR-OBS-01** | ログ出力先 | **stdout (プレーンテキスト)** + **`collector-result.json` (構造化レポート)** (Q6=C / Functional Design BR-56〜59) |
| **U1-NFR-OBS-02** | `collector-result.json` の取扱 | **GitHub Actions Job Summary (`$GITHUB_STEP_SUMMARY`) に整形して書き出し** + **artifact として upload** (Q7=C) |
| **U1-NFR-OBS-03** | ロガー実装 | **シンプルな自作ヘルパ関数** (`logger.info(source, msg, extra?)` 等の薄い wrapper、依存追加なし) (Q9=A) |
| **U1-NFR-OBS-04** | ログ保持 | GitHub Actions のデフォルト保持期間 (90 日)。MVP では追加設定なし。 |
| **U1-NFR-OBS-05** | アラート | MVP では追加なし (デフォルトの GitHub Actions 失敗通知のみ)。 |

---

## 7. 保守性 / テスト要件

| ID | 要件 | 仕様 |
|---|---|---|
| **U1-NFR-MAINT-01** | TypeScript 設定 | 既存 `next/tsconfig.json` の `strict: true` を維持。`paths: { "@/*": ["./*"] }` を活用し、`scripts/collector/` から `@/lib/article` 等で import 可能に整える (Code Generation 段階で `tsconfig` の `include` 拡張を確認) |
| **U1-NFR-MAINT-02** | ESLint 設定 | 既存 `eslint.config.mjs` を維持。`scripts/collector/**` も lint 対象に含める (Code Generation 時に `include` を拡張) |
| **U1-NFR-MAINT-03** | テストカバレッジ目標 | **数値目標なし、重要モジュールに集中** (Q8=A)。Adapter / Deduplicator / SlugBuilder / MarkdownWriter / 変換ヘルパは厚め、Runner は統合テストで担保。 |
| **U1-NFR-MAINT-04** | テストの分離 | example-based テストと PBT を分離 (PBT-10 advisory)。命名規則: `*.test.ts` (example-based) / `*.pbt.test.ts` (property-based) を Code Generation で確定。 |
| **U1-NFR-MAINT-05** | 設定単一ファイル集約 | 収集対象設定は `next/config/sources.ts` に集約 (NFR-08 / BR の方針)。 |

---

## 8. CI/CD 要件

| ID | 要件 | 仕様 |
|---|---|---|
| **U1-NFR-CI-01** | 収集ジョブの cron 式 | **`0 22 * * *`** (毎日 22:00 UTC = 翌 07:00 JST) (Q10=A) |
| **U1-NFR-CI-02** | 手動実行 | `workflow_dispatch` を有効化 (FR-03) |
| **U1-NFR-CI-03** | 収集 workflow に必要な permissions | `contents: write` (collected Markdown を `content/` にコミットする必要があるため)。`pull-requests: read`、その他は既定 |
| **U1-NFR-CI-04** | git commit 戦略 | 収集後、追加された Markdown ファイル (および `content/` の差分) をコミットして `main` に直接 push する (個人利用、PR レビュー不要)。`git config user.name = "github-actions[bot]"`、`user.email = "41898282+github-actions[bot]@users.noreply.github.com"` で commit |
| **U1-NFR-CI-05** | コミットメッセージ | 例: `chore(collector): add N articles (zenn=A, hatena=B, googlenews=C, togetter=D)` (実数値を埋める) |
| **U1-NFR-CI-06** | 0 件取得時の振る舞い | 新規 Markdown が 0 件の場合は **コミットせず終了** (空コミットを避ける) |
| **U1-NFR-CI-07** | npm audit (CI) | PR 時 + main push 時に実行。**警告レベルのみ通知**、CI は緑のまま (Q6=B、U1-NFR-SEC-05) |
| **U1-NFR-CI-08** | gitleaks (CI) | PR 時 + main push 時に実行。**検出時は CI 失敗** (Q6=B、U1-NFR-SEC-06) |
| **U1-NFR-CI-09** | バージョン管理戦略 | **Caret (`^`)** を許容、`package-lock.json` をコミット (Q5=A) |

---

## 9. PBT 適用要件 (NFR レベルでの再確認)

PBT (Partial) の本ユニットでの適用は Functional Design `business-logic-model.md §6` で詳細化済み。本ステージでは要件レベルで以下を再確認:

| Rule | 適用箇所 | NFR レベル要件 |
|---|---|---|
| **PBT-01** (advisory) | 全コンポーネント | Functional Design に Testable Properties を記述済み (達成) |
| **PBT-02** | `toFrontmatter` / `fromFrontmatter` | Code Generation で `*.pbt.test.ts` を作成 |
| **PBT-03** | `normalizeUrlForDedup` / `Deduplicator.filterNew` / `SlugBuilder.build` | 同上 |
| **PBT-07** | Article / RssItem ジェネレータを `next/scripts/collector/test/generators/` に集約 | Code Generation で実装 |
| **PBT-08** | seed ログ | Vitest の reporter で seed 出力、CI ログに含める |
| **PBT-09** | Vitest + fast-check 採用 | ✅ 確定済 (バージョンは `tech-stack-decisions.md` 参照) |
| **PBT-04 / 05 / 06 / 10** | N/A (Partial mode) | — |

---

## 10. 受入基準 (Unit 1 DoD への寄与)

本 NFR Requirements に違反していないことの確認は、以下のタイミングで行う:

- **Code Generation** 完了時: U1-NFR-MAINT-04 (テスト分離)、U1-NFR-OBS-03 (自作ロガー) が実装されている
- **Build and Test** 段階: U1-NFR-PERF-01 (5 分以内)、U1-NFR-CI-07/08 (gitleaks / npm audit 動作) が CI 上で確認できる
- **本番初回実行**: U1-NFR-OBS-02 (Job Summary 表示) を確認

---

## 11. 拡張機能コンプライアンス サマリー

### Security Baseline
- 拡張機能が **無効** のため、SECURITY-01〜15 すべて **N/A**。ただし NFR-03 / U1-NFR-SEC-01〜07 が実質的な代替最小ガードとして機能する。

### PBT (Partial)
- PBT-09: ✅ 準拠 (Vitest + fast-check 確定)
- PBT-01: ✅ advisory として Functional Design で記述済
- PBT-02 / 03 / 07 / 08: 後続の Code Generation / Build and Test で評価
- PBT-04 / 05 / 06 / 10: N/A (Partial mode)
