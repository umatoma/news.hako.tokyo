# テストパターン

**分析日:** 2026-05-30

## テストフレームワーク

**ユニット/統合テストランナー:**
- vitest 2.x
- 設定ファイル: `next/vitest.config.ts`

**プロパティベーステスト (PBT):**
- fast-check 3.x

**E2E テスト:**
- @playwright/test 1.x
- 設定ファイル: `next/playwright.config.ts`

**アサーションライブラリ:**
- vitest 組み込み (`expect`)

**実行コマンド:**
```bash
cd next
npm test               # vitest (watch モード)
npm run test:run       # vitest run (CI 向け one-shot)
npm run test:watch     # vitest watch (明示的 watch)
npm run test:e2e       # playwright test
npm run test:e2e:install  # playwright の Chromium インストール
```

## テストファイルの配置

**ユニット/統合テスト:**
- テスト対象と同じディレクトリか、または `test/` サブディレクトリに配置
  - `next/lib/articles.test.ts` → `next/lib/articles.ts` と同階層
  - `next/scripts/collector/test/*.test.ts` → `next/scripts/collector/` 配下のソースに対応

**プロパティベーステスト (PBT):**
- ファイル名に `.pbt.test.ts` サフィックスを付けて通常テストと区別する
  - 例: `next/lib/articles.pbt.test.ts`, `next/scripts/collector/test/article.pbt.test.ts`

**E2E テスト:**
- `next/e2e/` ディレクトリに集約
- ファイル名: `{対象ページ}.spec.ts`（例: `next/e2e/home.spec.ts`）

**テストヘルパー・フィクスチャ:**
- `next/scripts/collector/test/` に共有ヘルパーを置く
  - `in-memory-file-system.ts`: `InMemoryFileSystem` クラス
  - `recording-http-client.ts`: `RecordingHttpClient` クラス
  - `generators/`: fast-check Arbitrary 生成関数（`article.gen.ts`, `rss-item.gen.ts`, `url.gen.ts`）

**ディレクトリ構成:**
```
next/
├── lib/
│   ├── articles.test.ts          # articles.ts のユニットテスト
│   └── articles.pbt.test.ts      # articles.ts の PBT
├── e2e/
│   └── home.spec.ts              # E2E テスト
└── scripts/collector/
    ├── test/
    │   ├── in-memory-file-system.ts   # テスト用 FileSystem 実装
    │   ├── recording-http-client.ts   # テスト用 HttpClient 実装
    │   ├── article.test.ts
    │   ├── article.pbt.test.ts
    │   ├── deduplicator.test.ts
    │   ├── deduplicator.pbt.test.ts
    │   ├── http-client.test.ts
    │   ├── markdown-writer.test.ts
    │   ├── markdown-writer.pbt.test.ts
    │   ├── runner.test.ts
    │   ├── slug-builder.test.ts
    │   ├── url-normalize.test.ts
    │   ├── url-normalize.pbt.test.ts
    │   ├── secret-scrubber.test.ts
    │   ├── article-id.test.ts
    │   ├── article-id.pbt.test.ts
    │   ├── sources/
    │   │   ├── zenn-rss-fetcher.test.ts
    │   │   ├── hatena-rss-fetcher.test.ts
    │   │   ├── togetter-scraper.test.ts
    │   │   └── google-news-rss-fetcher.test.ts
    │   └── generators/
    │       ├── article.gen.ts
    │       ├── rss-item.gen.ts
    │       └── url.gen.ts
```

## テスト構造

**スイート構成:**
```typescript
import { beforeEach, describe, expect, it } from "vitest";

describe("クラス名/関数名", () => {
  // ネストされた describe でサブケースをグループ化
  describe("メソッド名", () => {
    it("具体的な振る舞いの説明", () => {
      // arrange → act → assert
    });
  });
});
```

**セットアップ:**
```typescript
// beforeEach でテスト間の状態を初期化する
beforeEach(() => {
  fs = new InMemoryFileSystem();
  writer = new MarkdownWriter({
    contentDir: CONTENT_DIR,
    fileSystem: fs,
    slugBuilder: new SlugBuilder(),
  });
});
```

**テストデータ（サンプルオブジェクト）:**
```typescript
// モジュールレベルの定数として定義する
const sample: Article = ArticleSchema.parse({
  id: "k9xr2p1m3qaztb47",
  title: "Sample",
  url: "https://example.com/x",
  source: "zenn",
  publishedAt: "2026-04-25T07:00:00+09:00",
  collectedAt: "2026-04-25T22:05:12+09:00",
  summary: "S",
  tags: [],
  thumbnailUrl: null,
});
```

## モック

**フレームワーク:** vitest 組み込みの `vi`（グローバル置換）

**パターン:**

```typescript
// グローバルの fetch をモックする
beforeEach(() => {
  fetchMock = vi.fn(async () =>
    new Response("<rss/>", {
      status: 200,
      headers: { "content-type": "application/rss+xml" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```

**インターフェース差し替えパターン（推奨）:**
- `vi.mock()` よりも、インターフェースに対するフェイク実装クラスを使う
- `InMemoryFileSystem` (`test/in-memory-file-system.ts`): `FileSystem` インターフェースのインメモリ実装
- `RecordingHttpClient` (`test/recording-http-client.ts`): `HttpClient` インターフェースの記録付き実装
- `fixedClock` (`lib/clock.ts`): 固定時刻を返す `Clock` 関数ファクトリ

```typescript
// テスト用フェイクの使い方
const http = new RecordingHttpClient({
  "https://zenn.dev/feed": zennXml,  // URL → レスポンスのマッピング
});
const fs = new InMemoryFileSystem();
const clock = fixedClock("2026-04-25T22:00:00Z");
const logger = new DefaultLogger({ out: () => undefined }); // 出力を抑制
```

**モックすべき対象:**
- 外部 HTTP リクエスト（`fetch` グローバル、または `HttpClient` インターフェース）
- ファイルシステム操作（`FileSystem` インターフェース）
- システム時刻（`Clock` 型）
- ログ出力（`DefaultLogger` に `out: () => undefined` を渡す）

**モックしない対象:**
- ドメインロジック（純粋関数）
- zod スキーマバリデーション
- アルゴリズム系ユーティリティ（URL 正規化、slug 生成など）

## フィクスチャとジェネレータ

**fast-check Arbitrary:**
```typescript
// next/scripts/collector/test/generators/article.gen.ts
export const articleArbitrary: fc.Arbitrary<Article> = fc
  .record({
    title: titleArbitrary,
    url: cleanUrlArbitrary,
    source: fc.constantFrom(...ARTICLE_SOURCES),
    publishedAt: isoDateArbitrary,
    collectedAt: isoDateArbitrary,
    // ...
  })
  .map(({ title, url, source, ... }) => ({
    id: generateArticleId(url),
    // ...
  }));
```

**ジェネレータの場所:**
- `next/scripts/collector/test/generators/article.gen.ts`
- `next/scripts/collector/test/generators/rss-item.gen.ts`
- `next/scripts/collector/test/generators/url.gen.ts`

**共有フィクスチャの使い方:**
- 複数のテストファイルから `articleArbitrary` を import して再利用する（例: `lib/articles.pbt.test.ts` と `scripts/collector/test/article.pbt.test.ts`）

## カバレッジ

**要件:** 明示的な閾値設定なし

**カバレッジ確認:**
```bash
cd next
npx vitest run --coverage
```

## テスト種別

**ユニットテスト:**
- 単一の関数・クラスを対象とする
- 依存はすべてフェイク/モックで置き換える
- `describe("関数名") > it("具体的な振る舞い")` の構造

**プロパティベーステスト (PBT):**
- `*.pbt.test.ts` ファイルに分離する
- fast-check の `fc.property` / `fc.asyncProperty` を使用する
- `numRuns: 100` 以上を設定する
- テストケース名に `(PBT-XX)` サフィックスを付けて識別する（例: `PBT-02`, `PBT-03`）
- 検証すべきプロパティ（不変条件）:
  - 出力が入力のサブセットであること
  - 変換がラウンドトリップ可能であること（`fromFrontmatter(toFrontmatter(a)) === a`）
  - ソート後の順序不変条件
  - 単調性（より緩い条件で除外されなかったアイテムはより厳しい条件でも除外されない等）

```typescript
// PBT の基本パターン
describe("sortArticlesForDisplay (PBT-03)", () => {
  it("output ids are a permutation of input ids", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 30 }),
        (articles) => {
          const out = sortArticlesForDisplay(articles);
          const inIds = articles.map((a) => a.id).sort();
          const outIds = out.map((a) => a.id).sort();
          return JSON.stringify(inIds) === JSON.stringify(outIds);
        },
      ),
      { numRuns: 100 },
    );
  });
});
```

**統合テスト:**
- 複数のコンポーネントを組み合わせてテストする（例: `runner.test.ts` では `CollectorRunner` + `Deduplicator` + `MarkdownWriter` を組み合わせる）
- インフラ層のみフェイクで置き換え（HTTP、FS、Clock）、ドメイン層は実装を使用する

**E2E テスト:**
- `@playwright/test` を使用
- `next/e2e/` に配置
- `page.goto("/")` でページを表示し、`data-testid` 属性でロケータを取得する
- 対象ブラウザ: Chromium のみ
- CI ではワーカー数を 1 に制限、リトライ 1 回

```typescript
// E2E テストのパターン
test.describe("Home page (/)", () => {
  test("renders header with article count", async ({ page }) => {
    await page.goto("/");
    const count = page.getByTestId("header-article-count");
    await expect(count).toBeVisible();
    await expect(count).toContainText("件");
  });
});
```

## 非同期テスト

```typescript
// async/await を使う（コールバックスタイルは使わない）
it("parses markdown files and returns Article[]", async () => {
  const repo = new FsArticleRepository({ contentDir: dir, fileReader: reader });
  const articles = await repo.getAllArticles();
  expect(articles).toHaveLength(1);
});

// rejects の検証
await expect(repo.getAllArticles()).rejects.toThrow(/Invalid frontmatter/);
```

## エラーテスト

```typescript
// 同期的な例外の検証
expect(() => dedup.filterNew([])).toThrow();

// 非同期例外の検証
await expect(repo.getAllArticles()).rejects.toThrow(/Invalid frontmatter/);

// バリデーションエラー（zod）の検証
expect(() =>
  fromFrontmatter({ id: "x", title: "t", url: "not-a-url", /* ... */ }),
).toThrow();
```

---

*テスト分析: 2026-05-30*
