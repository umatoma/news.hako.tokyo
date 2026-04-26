# Unit 1 (Collector) — Code Documentation

**Generated**: 2026-04-25
**Single source of truth**: `aidlc-docs/construction/plans/collector-code-generation-plan.md`

このドキュメントは Unit 1 (News Collection Service / Collector) で生成された全コードのインベントリと、開発・運用上の参考情報をまとめます。

---

## 1. ファイル インベントリ

### Application Code (workspace root)

```
news.hako.tokyo/
├── .github/workflows/collect.yml                            (Step 11)
├── content/.gitkeep                                          (Step 1)
├── .gitignore                                                (Step 1, updated)
└── next/
    ├── package.json                                          (Step 1, updated)
    ├── package-lock.json                                     (Step 1, updated by npm install)
    ├── tsconfig.json                                         (Step 1, no change required)
    ├── vitest.config.ts                                      (Step 10)
    ├── lib/
    │   └── article.ts                                        (Step 2)
    ├── config/
    │   └── sources.ts                                        (Step 2)
    └── scripts/collector/
        ├── index.ts                                          (Step 6)
        ├── runner.ts                                         (Step 6)
        ├── builder.ts                                        (Step 6)
        ├── logger.ts                                         (Step 4)
        ├── compose-commit-message.js                         (Step 11)
        ├── lib/
        │   ├── article-id.ts                                 (Step 3)
        │   ├── url-normalize.ts                              (Step 3)
        │   ├── slug-builder.ts                               (Step 3)
        │   ├── clock.ts                                      (Step 3)
        │   ├── secret-scrubber.ts                            (Step 3)
        │   ├── http-client.ts                                (Step 3)
        │   ├── file-system.ts                                (Step 3)
        │   ├── deduplicator.ts                               (Step 4)
        │   ├── markdown-writer.ts                            (Step 4)
        │   └── job-summary-reporter.ts                       (Step 4)
        ├── sources/
        │   ├── source-fetcher.ts                             (Step 5)
        │   ├── rss-mapping.ts                                (Step 5)
        │   ├── zenn-rss-fetcher.ts                           (Step 5)
        │   ├── hatena-rss-fetcher.ts                         (Step 5)
        │   ├── google-news-rss-fetcher.ts                    (Step 5)
        │   └── togetter-scraper.ts                           (Step 5)
        └── test/
            ├── generators/
            │   ├── url.gen.ts                                (Step 7)
            │   ├── article.gen.ts                            (Step 7)
            │   └── rss-item.gen.ts                           (Step 7)
            ├── in-memory-file-system.ts                      (Step 8 helper)
            ├── recording-http-client.ts                      (Step 8 helper)
            ├── article.test.ts                               (Step 8)
            ├── article.pbt.test.ts                           (Step 9)
            ├── article-id.test.ts                            (Step 8)
            ├── article-id.pbt.test.ts                        (Step 9)
            ├── url-normalize.test.ts                         (Step 8)
            ├── url-normalize.pbt.test.ts                     (Step 9)
            ├── slug-builder.test.ts                          (Step 8)
            ├── slug-builder.pbt.test.ts                      (Step 9)
            ├── deduplicator.test.ts                          (Step 8)
            ├── deduplicator.pbt.test.ts                      (Step 9)
            ├── markdown-writer.test.ts                       (Step 8)
            ├── markdown-writer.pbt.test.ts                   (Step 9)
            ├── secret-scrubber.test.ts                       (Step 8)
            ├── runner.test.ts                                (Step 8)
            └── sources/
                ├── zenn-rss-fetcher.test.ts                  (Step 8)
                ├── hatena-rss-fetcher.test.ts                (Step 8)
                ├── google-news-rss-fetcher.test.ts           (Step 8)
                └── togetter-scraper.test.ts                  (Step 8)
```

### Documentation (`aidlc-docs/construction/collector/code/`)
| File | 関連 Step |
|---|---|
| `README.md` (本ファイル) | Step 12 |
| `shared-types-summary.md` | Step 2 |
| `utility-library-summary.md` | Step 3 |
| `service-library-summary.md` | Step 4 |
| `source-fetchers-summary.md` | Step 5 |
| `runner-summary.md` | Step 6 |
| `tests-summary.md` | Step 10 |
| `deployment-artifacts-summary.md` | Step 11 |

---

## 2. 開発者向け操作手順

### 初回セットアップ
```bash
nvm use            # .nvmrc に従い Node.js v24.13.1 を選択
cd next
npm install
```

### ローカル実行
```bash
cd next
npm run collect    # 一回の収集ジョブを実行 → ../content/*.md と ./collector-result.json を生成
```

### テスト
```bash
cd next
npm run test:run         # 全テスト単発 (CI 相当)
npm test                 # watch モード (開発中)
```

### Lint / TypeCheck
```bash
cd next
npm run lint
npx tsc --noEmit
```

---

## 3. 想定動作

### 正常系
1. `npm run collect` を実行
2. Logger が `[INFO][collector] start` 等を stdout 出力
3. Adapter (zenn → hatena → googlenews → togetter) が逐次実行
4. Deduplicator が重複排除
5. MarkdownWriter が `<repo-root>/content/{date}-{slug}.md` に書き出し
6. JobSummaryReporter が `<repo-root>/next/collector-result.json` を生成
7. exit code 0 で終了

### 一部 Adapter 失敗時
- 該当 Adapter のエラーログが出る
- `failedSources` に記録される
- `perSource[source].error` にメッセージが入る
- 他 Adapter は継続
- exit code は 0 (= ジョブ成功扱い)

### 全 Adapter 失敗時
- 0 件取得で終了、exit code 0
- ローカルなら何も書き出されない、CI ではコミットなし

### 致命エラー (Deduplicator init / Writer I/O 失敗)
- `process.exit(1)`
- GitHub Actions のデフォルト失敗通知が走る

---

## 4. トラブルシューティング

| 症状 | 確認事項 |
|---|---|
| `npm run collect` が `Cannot find module '@/config/sources'` で失敗 | `tsx` が tsconfig の paths を解決できているか。Node 24.13.1 + tsx 4 + 既存 `tsconfig.json` で動作するはず |
| Togetter から 0 件取得 + `selectors may have changed` warn | Togetter の HTML 構造が変わった可能性。`scripts/collector/sources/togetter-scraper.ts` の `parseCategoryPage` のセレクタを更新 |
| Google ニュース RSS から取得失敗 | RISK-02 (非公式仕様変更)。`buildGoogleNewsUrls` 出力 URL を実際にブラウザで叩いて確認、必要に応じて URL 形式を更新 |
| frontmatter スキーマ違反で致命エラー | 既存 `content/*.md` の中身を確認、不正なファイルがあれば `git rm` で削除 |
| ファイル名衝突で致命エラー | 99 通りすべて存在 = 通常はあり得ない。slug-builder のロジックを再検討 |

---

## 5. 拡張機能コンプライアンス

### Security Baseline
- 全 N/A (拡張機能 無効、Q18=B)
- 代替最小ガード:
  - API キー不要 (採用 4 ソースすべて)
  - User-Agent 明示 (DefaultHttpClient)
  - SecretScrubber でログ出力前にサニタイズ
  - permissions 最小化 (`contents: write` のみ)

### PBT (Partial)
- PBT-09 ✅: vitest 2 + fast-check 3 を採用
- PBT-01 ✅ (advisory): Functional Design / Business Rules で全コンポーネントの Testable Properties を文書化
- PBT-02 ✅: `article.pbt.test.ts`, `markdown-writer.pbt.test.ts`
- PBT-03 ✅: `article-id.pbt.test.ts`, `url-normalize.pbt.test.ts`, `slug-builder.pbt.test.ts`, `deduplicator.pbt.test.ts`
- PBT-07 ✅: `test/generators/` に集約
- PBT-08 ✅: vitest verbose reporter + fast-check デフォルト shrinking
- PBT-04, 05, 06, 10 → N/A (Partial mode)

---

## 6. Story / AC トレーサビリティ

| Story / Requirement | 実装場所 |
|---|---|
| FR-02 (情報収集) | `scripts/collector/sources/*` |
| FR-03 (自動収集ジョブ) | `.github/workflows/collect.yml` |
| AC-02 (手動実行) | `workflow_dispatch:` トリガ |
| AC-03 (cron) | `schedule: cron: "0 22 * * *"` |
| AC-04 (4 ソース取得) | 4 つの Adapter |
| AC-05 (重複排除) | `lib/deduplicator.ts` |
| AC-08 (PBT 実行) | `*.pbt.test.ts` + vitest verbose reporter |
| AC-09 (シークレット非ハードコード) | `secret-scrubber.ts` + 環境変数経路 (将来用) |
| OQ-04 (frontmatter スキーマ) | `lib/article.ts` |
| BR-01〜81 (全業務ルール) | 各実装ファイル (詳細は `business-rules.md`) |
