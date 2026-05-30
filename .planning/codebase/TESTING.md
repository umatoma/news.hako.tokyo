# テストパターン

**分析日:** 2026-05-30

## テストフレームワーク

**ユニットテスト / 統合テストランナー:**
- Vitest 2.x
- 設定ファイル: `next/vitest.config.ts`
- 実行環境: `node`（ブラウザ環境ではない）
- `@` エイリアスは `next/` ディレクトリルートに解決

**プロパティベーステスト (PBT) ライブラリ:**
- fast-check 3.x

**E2E テストフレームワーク:**
- Playwright 1.48.x
- 設定ファイル: `next/playwright.config.ts`
- ブラウザ: Chromium のみ

**実行コマンド:**
```bash
npm run test          # watch モードで実行
npm run test:run      # 一度だけ実行（CI 用）
npm run test:watch    # watch モードで実行
npm run test:e2e      # Playwright E2E テスト
```

## テストファイルの構成

**ユニット／統合テストの配置:**
- ライブラリコード: `next/lib/` 直下にテストを同居
  - `next/lib/articles.test.ts`（通常テスト）
  - `next/lib/articles.pbt.test.ts`（プロパティベーステスト）
- Collector スクリプト: `next/scripts/collector/test/` ディレクトリに集約
  - 対象モジュール別に `{module}.test.ts` と `{module}.pbt.test.ts` を分離

**E2E テストの配置:**
- `next/e2e/` ディレクトリ
- ファイル拡張子: `.spec.ts`（例: `next/e2e/home.spec.ts`）

**テスト用ヘルパーの配置:**
- `next/scripts/collector/test/generators/` — fast-check アービトラリ（ランダムデータ生成器）
  - `article.gen.ts`, `rss-item.gen.ts`, `url.gen.ts`
- `next/scripts/collector/test/in-memory-file-system.ts` — `FileSystem` インターフェースのインメモリ実装
- `next/scripts/collector/test/recording-http-client.ts` — `HttpClient` インターフェースのスタブ実装

## テストの構造

**通常テスト（example-based）のパターン:**
```typescript
import { describe, expect, it, beforeEach } from "vitest";

describe("ClassName または functionName", () => {
  // テストダブルの準備（beforeEach で再初期化）
  let fs: InMemoryFileSystem;

  beforeEach(() => {
    fs = new InMemoryFileSystem();
  });

  it("動作を日本語または英語で説明する", () => {
    const result = functionUnderTest(input);
    expect(result).toEqual(expected);
  });

  it("throws when precondition violated", () => {
    expect(() => fn()).toThrow(/error pattern/);
  });
});
```

**グローバル beforeEach / afterEach の使用例:**
```typescript
// vi.stubGlobal を使う場合は afterEach でリセット
beforeEach(() => {
  fetchMock = vi.fn(async () => new Response(...));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```

## モック

**モック戦略:**
外部依存（HTTP・ファイルシステム・クロック）は **インターフェース差し替え** で対応する。`vi.mock()` によるモジュールモックは最小限。

**`vi.stubGlobal` の使用:**
グローバル `fetch` のみ `vi.stubGlobal` でモックする（`next/scripts/collector/test/http-client.test.ts`）:
```typescript
fetchMock = vi.fn(async () => new Response("<rss/>", { status: 200, ... }));
vi.stubGlobal("fetch", fetchMock);
// テスト後
vi.unstubAllGlobals();
```

**`RecordingHttpClient`（`next/scripts/collector/test/recording-http-client.ts`）:**
`HttpClient` インターフェースを実装したスタブ。URL→レスポンスのマップを事前登録し、呼び出し履歴を `calls` 配列に記録する:
```typescript
const http = new RecordingHttpClient({
  "https://zenn.dev/feed": zennXml,
  "https://b.hatena.ne.jp/hotentry/it.rss": { status: 500, body: "boom", headers: {} },
});
// 後から確認
expect(http.calls).toHaveLength(1);
```

**`InMemoryFileSystem`（`next/scripts/collector/test/in-memory-file-system.ts`）:**
`FileSystem` インターフェースを実装したインメモリ実装。`files` マップにファイル内容を直接セットできる:
```typescript
const fs = new InMemoryFileSystem();
fs.files.set("/fake/content/article.md", markdownContent);
```

**`fixedClock`（`next/scripts/collector/lib/clock.ts`）:**
テスト用の固定時刻クロック:
```typescript
const clock = fixedClock("2026-04-25T22:00:00Z");
```

**モックするもの:**
- HTTP クライアント（`RecordingHttpClient`）
- ファイルシステム（`InMemoryFileSystem`）
- クロック（`fixedClock`）
- グローバル `fetch`（`vi.stubGlobal`）
- ロガー出力（`new DefaultLogger({ out: () => undefined })`）

**モックしないもの:**
- ビジネスロジック関数（純粋関数はそのまま呼ぶ）
- Zod スキーマ
- 実装クラスの内部ロジック

## フィクスチャとファクトリ

**サンプルオブジェクトパターン:**
テストファイル先頭でスキーマ検証済みのサンプルオブジェクトを定義:
```typescript
const sampleArticle = ArticleSchema.parse({
  id: "k9xr2p1m3qaztb47",
  title: "Zenn の RSS フィードの使い方",
  url: "https://zenn.dev/foo/articles/bar",
  source: "zenn",
  publishedAt: "2026-04-25T07:00:00+09:00",
  collectedAt: "2026-04-25T22:05:12+09:00",
  summary: "...",
  tags: [],
  thumbnailUrl: null,
});
```

**ファクトリ関数パターン:**
テスト内でサンプルオブジェクトをスプレッドして部分的に変更:
```typescript
function makeArticle(url: string): Article {
  return { ...sample, url };
}
function articleAt(date: string, idSuffix: string): Article {
  return ArticleSchema.parse({ ...sample, publishedAt: `${date}T07:00:00+09:00` });
}
```

**`InMemoryFileReader`（`next/lib/articles.test.ts`）:**
`FileReader` インターフェースのインメモリ実装（テストファイル内にローカルで定義）。

## プロパティベーステスト (PBT)

**フレームワーク:** fast-check 3.x

**ファイル命名:** `{対象}.pbt.test.ts`（通常テストとは分離）

**テストスイート名に `(PBT-02)` / `(PBT-03)` などのルール ID を付ける:**
```typescript
describe("Article frontmatter round-trip (PBT-02)", () => { ... });
describe("sortArticlesForDisplay (PBT-03)", () => { ... });
```

**使用パターン:**

同期プロパティ:
```typescript
fc.assert(
  fc.property(articleArbitrary, (article) => {
    const round = fromFrontmatter(toFrontmatter(article));
    return JSON.stringify(round) === JSON.stringify(article);
  }),
  { numRuns: 100 },
);
```

非同期プロパティ:
```typescript
fc.assert(
  fc.asyncProperty(articleArbitrary, async (article) => {
    // ...
    return condition;
  }),
  { numRuns: 100 },
);
```

**アービトラリ（乱数生成器）の配置:**
- `next/scripts/collector/test/generators/article.gen.ts` — `articleArbitrary`
- `next/scripts/collector/test/generators/rss-item.gen.ts` — `rssItemArbitrary`, `renderRssXml`
- `next/scripts/collector/test/generators/url.gen.ts` — `urlArbitrary`, `cleanUrlArbitrary`
- lib テスト用のアービトラリは同じファイル内にインラインで定義することもある

**PBT で検証する性質の種別:**
| 種別 | 説明 | 実装例 |
|------|------|--------|
| ラウンドトリップ (PBT-02) | `f_inverse(f(x)) = x` | `fromFrontmatter(toFrontmatter(a)) === a` |
| 不変条件 (PBT-03) | 操作後も成立する性質 | `sort` 後の長さ保存、順序保証 |
| 冪等性 (PBT-04) | `f(f(x)) = f(x)` | `normalizeUrlForDedup` の冪等性 |
| 単調性 | 条件が緩くなれば結果が増えない | 日数を増やすと記事が除外されない |

**numRuns:**
- 通常テスト: 100 回
- 重要な性質: 200 回（URL / ID 生成など）

## E2E テスト

**フレームワーク:** Playwright

**テストファイルの場所:** `next/e2e/*.spec.ts`

**構造パターン:**
```typescript
import { expect, test } from "@playwright/test";

test.describe("ページ名 (パス)", () => {
  test("期待する動作の説明", async ({ page }) => {
    await page.goto("/");
    const element = page.getByTestId("data-testid-value");
    await expect(element).toBeVisible();
  });
});
```

**ロケータ:**
- `getByTestId(...)` を優先して使用
- `data-testid` 属性はソースコードで付与（例: `next/components/header.tsx`, `next/components/article-list-item.tsx`）

**Web サーバー:**
- `npm start` で起動したサーバーに対してテストを実行
- CI 以外では既存サーバーを再利用（`reuseExistingServer: !process.env["CI"]`）
- ベース URL: `http://localhost:3000`

## カバレッジ

**要件:** 明示的なカバレッジ目標は設定されていない

**カバレッジ確認:**
```bash
# vitest にはカバレッジコマンドが別途設定されていない
# 必要に応じて以下を使用:
npx vitest run --coverage
```

## テストの種別と範囲

**ユニットテスト:**
- 純粋関数（ビジネスロジック、データ変換）を単独でテスト
- 対象: `next/lib/articles.ts`, `next/scripts/collector/lib/` 以下の各モジュール
- インターフェース差し替えにより I/O を排除

**統合テスト:**
- 複数のコンポーネントを協調動作させてテスト
- 対象: `next/scripts/collector/test/runner.test.ts`（CollectorRunner の end-to-end フロー）
- インメモリ実装で外部 I/O を除外しつつ、実際のクラスを組み合わせる

**E2E テスト:**
- 実際のブラウザとサーバーを使用
- 対象: `next/e2e/home.spec.ts`（ホームページの主要な表示要件）

## 非同期テストパターン

**`async/await` を使用:**
```typescript
it("reads articles from file system", async () => {
  const result = await repo.getAllArticles();
  expect(result).toHaveLength(1);
});
```

**Promise を reject することの確認:**
```typescript
await expect(repo.getAllArticles()).rejects.toThrow(/Invalid frontmatter/);
```

## エラーのテストパターン

**同期例外:**
```typescript
expect(() => dedup.filterNew([])).toThrow();
expect(() => fromFrontmatter(invalidData)).toThrow();
```

**非同期例外:**
```typescript
await expect(repo.getAllArticles()).rejects.toThrow(/Invalid frontmatter in/);
```

---

*テスト分析日: 2026-05-30*
