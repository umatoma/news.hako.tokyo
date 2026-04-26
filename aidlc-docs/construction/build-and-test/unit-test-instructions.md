# Unit Test Execution

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Build and Test
**Generated**: 2026-04-26

---

## Run Unit Tests

### 1. Execute All Unit + Property-Based Tests

```bash
cd next
npm run test:run     # CI / 単発実行
# または
npm test             # watch モード (開発中)
```

### 2. Review Test Results

**Expected**: **76 tests pass, 0 failures** (20 ファイル)

#### Unit 1 (Collector) のテスト
| ファイル | 種類 |
|---|---|
| `scripts/collector/test/article.test.ts` | example-based |
| `scripts/collector/test/article.pbt.test.ts` | PBT-02 (Round-trip) |
| `scripts/collector/test/article-id.test.ts` | example-based |
| `scripts/collector/test/article-id.pbt.test.ts` | PBT-03 |
| `scripts/collector/test/url-normalize.test.ts` | example-based |
| `scripts/collector/test/url-normalize.pbt.test.ts` | PBT-03 |
| `scripts/collector/test/slug-builder.test.ts` | example-based |
| `scripts/collector/test/slug-builder.pbt.test.ts` | PBT-03 |
| `scripts/collector/test/secret-scrubber.test.ts` | example-based |
| `scripts/collector/test/deduplicator.test.ts` | example-based |
| `scripts/collector/test/deduplicator.pbt.test.ts` | PBT-03 |
| `scripts/collector/test/markdown-writer.test.ts` | example-based |
| `scripts/collector/test/markdown-writer.pbt.test.ts` | PBT-02 |
| `scripts/collector/test/runner.test.ts` | Integration (in-process) |
| `scripts/collector/test/sources/zenn-rss-fetcher.test.ts` | example-based |
| `scripts/collector/test/sources/hatena-rss-fetcher.test.ts` | example-based |
| `scripts/collector/test/sources/google-news-rss-fetcher.test.ts` | example-based |
| `scripts/collector/test/sources/togetter-scraper.test.ts` | example-based |

#### Unit 2 (Web Frontend) のテスト
| ファイル | 種類 |
|---|---|
| `lib/articles.test.ts` | example-based (Repository / 純粋関数群) |
| `lib/articles.pbt.test.ts` | PBT-03 (sortArticlesForDisplay の 4 不変条件) |

### 3. PBT (Partial Mode) サマリー

| Rule | 適用箇所 | テスト数 |
|---|---|---|
| PBT-02 (Round-trip) | `Article` ↔ frontmatter / `MarkdownWriter` | 2 |
| PBT-03 (Invariant) | `article-id` / `url-normalize` / `slug-builder` / `Deduplicator.filterNew` / `sortArticlesForDisplay` | 13 |
| PBT-07 (Generator quality) | `test/generators/{article,rss-item,url}.gen.ts` | (継承利用) |
| PBT-08 (Reproducibility) | vitest verbose reporter で seed ログ出力 | (横断) |
| PBT-09 (Framework) | `vitest ^2` + `fast-check ^3` | ✅ 確定 |

### 4. Coverage

**目標**: 数値目標なし (Q8=A)、重要モジュールに集中。

カバレッジ計測を行いたい場合は (任意):
```bash
cd next
npx vitest run --coverage
```

### 5. Fix Failing Tests

テストが失敗する場合:
1. 出力で失敗テストを特定
2. PBT 失敗時は **seed 値** がログに出るので、再現可能。同 seed で `npx vitest run --reporter=verbose` 実行で再現
3. コード修正 → 再実行

---

## Linting / TypeChecking (Unit Test と並行で実行推奨)

```bash
cd next
npm run lint           # ESLint (Flat Config v9、eslint-config-next/typescript)
npx tsc --noEmit       # TypeScript 型チェック
```

両方とも **0 errors / 0 warnings** が期待値。
