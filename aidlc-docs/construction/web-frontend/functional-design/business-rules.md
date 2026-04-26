# Business Rules — Unit 2 (Web Frontend)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Functional Design
**Created**: 2026-04-26

Unit 2 の業務ルール集。ID は `U2-BR-NN` で採番 (Unit 1 の `BR-` と重複回避)。

---

## 1. データ取得ルール

| ID | ルール |
|---|---|
| **U2-BR-01** | `ArticleRepository.getAllArticles()` は `<repo-root>/content/*.md` を再帰スキャンする (Q1=B、`CONTENT_DIR` 環境変数で上書き可) |
| **U2-BR-02** | 各ファイルは `gray-matter` で frontmatter と本文に分離する。本文は **読み込まない** (一覧表示には不要) |
| **U2-BR-03** | frontmatter は Unit 1 で定義した `ArticleFrontmatterSchema` で validate (snake_case → camelCase 変換は `fromFrontmatter` ヘルパに委譲) |
| **U2-BR-04** | バリデーション失敗は **致命エラー** (throw)。ビルド失敗で Vercel が前回成功ビルドにフォールバック (要件 FR-04 と整合) |
| **U2-BR-05** | `content/` ディレクトリ自体が存在しない / 空 の場合は **エラーにせず** 空配列を返す (空状態 UI が描画される) |

---

## 2. ソートルール (Q6=A)

| ID | ルール |
|---|---|
| **U2-BR-06** | 一次キー: `publishedAt` 降順 (新しいほど上位) |
| **U2-BR-07** | 二次キー: `collectedAt` 降順 (publishedAt 同値時は最近取得した順) |
| **U2-BR-08** | ソートは ISO 8601 文字列の `localeCompare` で行う (時系列順と辞書順が一致) |
| **U2-BR-09** | ソート関数は **純粋関数** (入力配列を mutate しない、`[...articles].sort(...)`) |

---

## 3. 表示ルール

| ID | ルール |
|---|---|
| **U2-BR-10** | 一覧の各記事はタイトル + ソース + 公開日 + (任意で) サムネイル を表示する。本文は表示しない (FR-01) |
| **U2-BR-11** | タイトルは `<a href={url} target="_blank" rel="noopener noreferrer">` でラップする (BR-06 / FR-01) |
| **U2-BR-12** | `target="_blank"` には **必ず `rel="noopener noreferrer"`** を併記する (Web セキュリティの基本) |
| **U2-BR-13** | ソースラベルは Q3=A の SOURCE_LABEL に従う: `Zenn` / `はてブ` / `Google ニュース` / `Togetter` |
| **U2-BR-14** | 公開日は `Intl.DateTimeFormat("ja-JP", { dateStyle: "long", timeStyle: "short" })` で整形 (Q2=A) |
| **U2-BR-15** | 公開日表示は `<time dateTime={publishedAtIso}>` でラップ (アクセシビリティ + 機械可読) |
| **U2-BR-16** | サムネイル URL が `null` の場合、画像領域は出さない (画像枠だけが残らない) |
| **U2-BR-17** | 同 URL の記事は Unit 1 の Deduplicator で除外済み。Unit 2 では追加の重複排除を行わない (信頼) |

---

## 4. レイアウトルール (Q5=B)

| ID | ルール |
|---|---|
| **U2-BR-18** | ページ構造は `<header> + <main> + <footer>` の 3 領域 |
| **U2-BR-19** | ヘッダー: サイトタイトル "news.hako.tokyo" + 件数 (例: "98 件") |
| **U2-BR-20** | フッター: 最終更新日 (`computePageStats.lastUpdatedDisplay`、null なら "未収集") + サイト名 |
| **U2-BR-21** | 0 件取得時 (空状態): `<main>` 内に `<EmptyState>` のみ。ヘッダー / フッターは維持 (件数 0) |

---

## 5. 空状態ルール (Q4=A)

| ID | ルール |
|---|---|
| **U2-BR-22** | 表示文言: 「まだ記事がありません」 (シンプルなテキスト 1 行) |
| **U2-BR-23** | スタイル: 中央寄せ、ミュート色 (Tailwind の `text-zinc-500 dark:text-zinc-400` 程度) |
| **U2-BR-24** | リンク等の対話要素は含めない (個人利用、開発時の確認は別途) |

---

## 6. メタデータ / SEO ルール

| ID | ルール |
|---|---|
| **U2-BR-25** | `<html lang="ja">` (NFR-13 / 要件 FR-05 i18n 日本語のみと整合) |
| **U2-BR-26** | `metadata.title`: "news.hako.tokyo" |
| **U2-BR-27** | `metadata.description`: 簡潔 (例: "個人用ニュース集約サイト") |
| **U2-BR-28** | OGP / 構造化データは **設定しない** (NFR-02 SEO 不要) |
| **U2-BR-29** | `robots.txt` を `<repo-root>/next/public/robots.txt` に配置し `Disallow: /` をセット (NFR-02) |

---

## 7. テーマ (ライト/ダーク) ルール

| ID | ルール |
|---|---|
| **U2-BR-30** | OS 設定追従 (Q14=B、要件 FR-05) |
| **U2-BR-31** | Tailwind v4 の `dark:` バリアント (デフォルトで `prefers-color-scheme` 利用) |
| **U2-BR-32** | テーマ切替 UI / トグルボタンは **設けない** (Q14=B) |
| **U2-BR-33** | 既存の `app/globals.css` のダーク対応を尊重しつつ拡張する (置き換えない) |
| **U2-BR-34** | 主要要素はライト/ダーク両方のクラス指定で記述 (例: `bg-white dark:bg-black`) |

---

## 8. アクセシビリティ・ベースラインルール

| ID | ルール |
|---|---|
| **U2-BR-35** | 主要構造要素 (`<header>`, `<main>`, `<footer>`, `<article>`, `<time>`) を意味的に正しく使う |
| **U2-BR-36** | 各記事は `<article>` でラップ、タイトルは `<h2>` (`<h1>` はヘッダーのサイトタイトル) |
| **U2-BR-37** | `key` には `view.id` を使用 (React の警告回避) |
| **U2-BR-38** | キーボードフォーカス時の可視性は Tailwind デフォルトのフォーカスリングを維持 (NFR-07) |
| **U2-BR-39** | コントラスト比は Tailwind 既定の組み合わせ (例: `text-zinc-900 / dark:text-zinc-100`) を採用、独自の薄い色は避ける |

---

## 9. SSG / ビルド時のルール

| ID | ルール |
|---|---|
| **U2-BR-40** | `Home` は **Server Component** (デフォルト)。`"use client"` は追加しない |
| **U2-BR-41** | `Home` は async function として宣言可 (Server Component で許容) |
| **U2-BR-42** | 動的ルートは追加しない (`searchParams`/`params` の async 対応は不要) |
| **U2-BR-43** | `next build` 時に `content/*.md` を全件読み込む。リクエスト時の I/O は発生しない |
| **U2-BR-44** | ファイルシステム I/O は Server Component 内のみ (Client Component には絶対に持ち込まない) |

---

## 10. パス解決ルール (Q1=B)

| ID | ルール |
|---|---|
| **U2-BR-45** | `resolveContentDir()` は以下の優先順位で解決: (1) `process.env.CONTENT_DIR`、(2) `path.resolve(process.cwd(), "..", "content")` |
| **U2-BR-46** | Vercel 環境では Root Directory を `next/` に設定し、ビルド時の `process.cwd()` は `next/` となる前提。`..` で repo root に到達 |
| **U2-BR-47** | `CONTENT_DIR` が指定された場合、絶対パスを期待 (相対パスは解釈しない) |

---

## 11. テスト / 品質ルール

| ID | ルール |
|---|---|
| **U2-BR-48** | `sortArticlesForDisplay` には PBT-03 を適用 |
| **U2-BR-49** | `ArticleRepository.getAllArticles` には example-based + InMemoryFileSystem テストを書く |
| **U2-BR-50** | `toListItemView` / `formatPublishedAt` / `computePageStats` には example-based テストを書く |
| **U2-BR-51** | コンポーネント (`Home`, `ArticleListItem`) のテストは **レンダリングテストではなく React Server Component の戻り値型・children 構造の単純検証** に留める (MVP)。E2E (Playwright) は Build and Test 段階で扱う |

---

## 12. その他

| ID | ルール |
|---|---|
| **U2-BR-52** | 内部用 npm script (`collect`/`test`/`dev`/`build`) は変更しない (Unit 1 で確定済み)、必要に応じて追加するのみ |
| **U2-BR-53** | Unit 1 で生成された `content/*.md` (検証実行で生成された 98 ファイル) は Unit 2 のテスト fixture としても利用可能 |

---

## 13. ルール ID と工程の対応 (トレーサビリティ)

| 工程 | 適用ルール |
|---|---|
| ArticleRepository 実装 | U2-BR-01〜05、U2-BR-43〜44、U2-BR-45〜47 |
| ソート関数 | U2-BR-06〜09 |
| ArticleListItem | U2-BR-10〜17、U2-BR-35〜39 |
| Home / Header / Footer / EmptyState | U2-BR-18〜24、U2-BR-40〜42 |
| RootLayout | U2-BR-25〜28、U2-BR-30〜34 |
| robots.txt | U2-BR-29 |
| テスト | U2-BR-48〜51 |
