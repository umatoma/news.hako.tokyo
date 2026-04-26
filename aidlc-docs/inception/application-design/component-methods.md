# Component Methods

**Project**: news.hako.tokyo
**Stage**: INCEPTION — Application Design
**Depth**: Standard

各コンポーネントのメソッドシグネチャと入出力型を定義します。**詳細なビジネスルール / エラーハンドリング戦略は CONSTRUCTION フェーズの Functional Design (per-unit) で確定** します。本ドキュメントは「形」を確定させるものです。

---

## 1. Shared Types

### 1.1 `Article`
```typescript
type SourceId = "zenn" | "hatena" | "googlenews" | "togetter";

interface Article {
  id: string;            // URL 由来の決定的 ID
  title: string;
  url: string;
  source: SourceId;
  publishedAt: string;   // ISO 8601, e.g. "2026-04-25T07:00:00+09:00"
  collectedAt: string;   // ISO 8601
  summary: string;       // ソース由来の冒頭抜粋。空文字許容。
  tags: string[];        // 取得不能なら []
  thumbnailUrl: string | null;
}
```

### 1.2 `SourceConfig` 系
```typescript
interface ZennConfig {
  feedUrls: string[];          // RSS フィード URL のリスト
}
interface HatenaConfig {
  feedUrls: string[];
}
interface GoogleNewsConfig {
  enabled: boolean;                       // false ならスキップ
  hl: string;                             // 言語コード (既定: "ja")
  gl: string;                             // 国/地域コード (既定: "JP")
  ceid: string;                           // 言語:地域 (既定: "JP:ja")
  queries: string[];                      // キーワード検索のクエリ群 (例: ["AI", "Web開発"])
  topics: GoogleNewsTopic[];              // トピック別フィードを使う場合
  geos: string[];                         // 地理検索を使う場合 (例: ["Tokyo"])
}
type GoogleNewsTopic =
  | "WORLD" | "NATION" | "BUSINESS" | "TECHNOLOGY"
  | "ENTERTAINMENT" | "SPORTS" | "SCIENCE" | "HEALTH";
interface TogetterConfig {
  enabled: boolean;            // 利用規約確認後に true
  targetUrls: string[];        // スクレイピング対象 URL リスト (例: ホットページ等)
  requestIntervalMs: number;   // リクエスト間隔 (例: 5000)
}

interface SourceConfig {
  zenn: ZennConfig;
  hatena: HatenaConfig;
  googlenews: GoogleNewsConfig;
  togetter: TogetterConfig;
}
```

### 1.3 `CollectorResult` (CollectorRunner 戻り値)
```typescript
interface CollectorRunResult {
  totalFetched: number;        // 全 fetcher が取得した記事数 (重複排除前)
  totalNew: number;            // 新規として書き出した記事数
  totalDuplicate: number;      // 既存と重複してスキップした件数
  failedSources: SourceId[];   // 取得に失敗したソース
  durationMs: number;
}
```

---

## 2. Web — Methods

### 2.1 `Home` (page component)
```typescript
async function Home(): Promise<JSX.Element>;
// - SSG で実行される React Server Component
// - getAllArticles() を呼び出し
// - publishedAt 降順でソートする
// - <ArticleListItem article={...} /> を map で展開
```

### 2.2 `RootLayout`
```typescript
function RootLayout(props: { children: React.ReactNode }): JSX.Element;
// - <html lang="ja"> を出力
// - Geist フォント変数を適用
// - メタデータは Next.js の `export const metadata` で別途宣言
```

### 2.3 `ArticleListItem`
```typescript
interface ArticleListItemProps { article: Article; }
function ArticleListItem(props: ArticleListItemProps): JSX.Element;
// - title をリンク (target="_blank", rel="noopener noreferrer")
// - source ラベル + publishedAt フォーマット表示
// - thumbnailUrl があれば画像表示 (将来)
```

### 2.4 `ArticleRepository` (`lib/articles.ts`)
```typescript
async function getAllArticles(): Promise<Article[]>;
// - content/ ディレクトリを再帰スキャン
// - 各 .md ファイルを fs で読み込み
// - frontmatter (YAML) を gray-matter 等でパース
// - Article へマップ (型バリデーション付き、Construction で zod 等を検討)
// - スキャン中の個別ファイルパースエラーは throw (ビルド失敗で即時検知)
// - 戻り値はソート/フィルタなしの生配列 (Q6 = A)
```

> 補助関数 (実装詳細、Construction で確定):
> - `parseArticleFile(filePath: string): Promise<Article>`
> - `validateArticle(raw: unknown): Article` — zod 等

---

## 3. Collector — Adapter Methods

### 3.1 `SourceFetcher<TConfig>` (interface)
```typescript
interface SourceFetcher<TConfig> {
  readonly source: SourceId;
  fetch(config: TConfig): Promise<Article[]>;
  // - 自分のソース固有の取得処理を実装
  // - 失敗時は Promise を reject
  // - 戻り値の Article は collectedAt をまだ持たなくてよい (Runner 側で付与)
}
```

### 3.2 `ZennRssFetcher implements SourceFetcher<ZennConfig>`
```typescript
class ZennRssFetcher implements SourceFetcher<ZennConfig> {
  readonly source: SourceId = "zenn";
  fetch(config: ZennConfig): Promise<Article[]>;
}
// 内部の補助 (実装詳細):
// - private async fetchOneFeed(url: string): Promise<Article[]>
// - private toArticle(item: RssItem): Article
```

### 3.3 `HatenaRssFetcher implements SourceFetcher<HatenaConfig>`
```typescript
class HatenaRssFetcher implements SourceFetcher<HatenaConfig> {
  readonly source: SourceId = "hatena";
  fetch(config: HatenaConfig): Promise<Article[]>;
}
```

### 3.4 `GoogleNewsRssFetcher implements SourceFetcher<GoogleNewsConfig>`
```typescript
class GoogleNewsRssFetcher implements SourceFetcher<GoogleNewsConfig> {
  readonly source: SourceId = "googlenews";
  constructor(deps: { httpClient?: HttpClient });
  fetch(config: GoogleNewsConfig): Promise<Article[]>;
}
// - API キー不要 (Google ニュース非公式 RSS)
// - URL ビルダー (private buildSearchUrl / buildTopicUrl / buildGeoUrl) を内部に持つ
// - hl/gl/ceid のデフォルト値は config から取得 (既定: ja/JP/JP:ja)
```

### 3.5 `TogetterScraper implements SourceFetcher<TogetterConfig>`
```typescript
class TogetterScraper implements SourceFetcher<TogetterConfig> {
  readonly source: SourceId = "togetter";
  constructor(deps: { httpClient?: HttpClient });
  fetch(config: TogetterConfig): Promise<Article[]>;
}
// - User-Agent を明示
// - requestIntervalMs を遵守してレート制限
```

---

## 4. Collector — Orchestration Methods

### 4.1 `CollectorRunner`
```typescript
interface CollectorRunnerDeps {
  config: SourceConfig;
  fetchers: SourceFetcher<unknown>[]; // 並びが実行順
  deduplicator: Deduplicator;
  writer: MarkdownWriter;
  clock?: () => Date;                  // 時刻注入 (テスト用、デフォルト: () => new Date())
}

class CollectorRunner {
  constructor(deps: CollectorRunnerDeps);
  run(): Promise<CollectorRunResult>;
  // 流れ (Q4 = A 逐次 + 失敗継続):
  //   1. await deduplicator.initialize()  // content/ から既存 URL セットを構築
  //   2. for (fetcher of fetchers): try-catch で fetch、失敗ソースを failedSources に追加
  //   3. 全 fetched 配列を deduplicator.filterNew() で絞り込み
  //   4. 各 new article に collectedAt = clock() を付与
  //   5. writer.write(articles) で書き出し
  //   6. CollectorRunResult を返す
}
```

### 4.2 `Deduplicator`
```typescript
class Deduplicator {
  constructor(deps: { contentDir: string; reader?: FileReader });
  initialize(): Promise<void>;
  // - content/ 配下の Markdown frontmatter を読み、url → Set<string> を構築

  filterNew(candidates: Article[]): Article[];
  // - candidates のうち、URL セットに含まれないものだけを返す
  // - 同一バッチ内の URL 重複も除去 (URL 単位で 1 件のみ残す、出現順優先)
}
```

### 4.3 `MarkdownWriter`
```typescript
class MarkdownWriter {
  constructor(deps: { contentDir: string; slugBuilder: SlugBuilder; fs?: FileSystem });
  write(articles: Article[]): Promise<WriteResult>;
  // - 各 Article について:
  //     filename = `${publishedAt(YYYY-MM-DD)}-${slugBuilder.build(title)}.md`
  //     既存ファイルがあれば短いハッシュを append して回避
  //     YAML frontmatter + 空本文の Markdown を書き出す
  // - 戻り値: { written: number; skipped: number; }
}

interface WriteResult { written: number; skipped: number; }
```

### 4.4 `SlugBuilder`
```typescript
class SlugBuilder {
  build(title: string): string;
  // - 入力: 任意の文字列 (日本語含む)
  // - 出力: ASCII 安全な小文字 + ハイフン区切り、最大 50 文字
  // - 取り得る文字: [a-z0-9-]
  // - 詳細アルゴリズム (transliteration vs ハッシュフォールバック等) は Construction で確定
}
```

---

## 5. 共通インフラ系の補助インターフェイス (DI 用、実装は Construction)

```typescript
interface HttpClient {
  get(url: string, headers?: Record<string, string>): Promise<HttpResponse>;
}
interface HttpResponse {
  status: number;
  body: string;
  headers: Record<string, string>;
}

interface FileReader {
  listMarkdownFiles(dir: string): Promise<string[]>;
  readText(filePath: string): Promise<string>;
}
interface FileSystem extends FileReader {
  ensureDir(dir: string): Promise<void>;
  writeText(filePath: string, content: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
}
```

> 上記抽象により、PBT / 単体テストで I/O をモック可能になります。実体は Node 標準 `node:fs/promises` と `fetch` を採用予定 (Construction で確定)。

---

## 6. Notes for Functional Design (per-unit)

Construction フェーズの Functional Design では、本ドキュメントで定めたシグネチャを基に以下を確定させます:

- **Unit 1 (Collector)**:
  - 各 Adapter のフィールドマッピング詳細 (RSS の `<pubDate>` → `publishedAt` 変換ルール、欠損時の振る舞い等)
  - PBT パターン適用先 (PBT-02: RSS XML ↔ Article ↔ Markdown のラウンドトリップ、PBT-03: filterNew の不変条件 = 出力 URL 一意性、PBT-07: ドメイン型ジェネレータ定義)
  - エラーログのフォーマットと粒度
  - SlugBuilder のアルゴリズム詳細

- **Unit 2 (Web)**:
  - frontmatter スキーマの厳密バリデーション (zod 等の選定)
  - レイアウト・スタイリング (FR-05 のレスポンシブ仕様)
  - PBT パターン適用先 (PBT-02: Article ↔ Markdown のラウンドトリップは ArticleRepository ↔ MarkdownWriter で重複しないよう調整)
