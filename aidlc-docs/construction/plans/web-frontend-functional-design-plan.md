# Functional Design Plan — Unit 2: Web Frontend

**Project**: news.hako.tokyo
**Unit**: U2 (News Listing Service / Web Frontend)
**Stage**: CONSTRUCTION — Functional Design
**Created**: 2026-04-26

このプランは Unit 2 (Web Frontend) の機能設計を確定するための計画書と質問群を兼ねます。Unit 1 で確定した `Article` 型 / `content/*.md` スキーマを入力として、SSG で一覧を生成します。

---

## Tracking Checklist

- [x] Step 1: Analyze unit context (Unit 1 成果物 + Application Design 読込)
- [x] Step 2: Create functional design plan (this file)
- [x] Step 3: Generate context-appropriate questions
- [x] Step 4: Store plan
- [ ] Step 5: Collect and analyze answers
- [ ] Step 6: Generate functional design artifacts
- [ ] Step 7: Present completion message
- [ ] Step 8: Approval
- [ ] Step 9: Record approval and update progress

---

## Scope of Functional Design (Unit 2)

| コンポーネント | 主要責務 |
|---|---|
| `Home` (`app/page.tsx`) | SSG: ArticleRepository から取得、`publishedAt` 降順ソート、`ArticleListItem` で描画 |
| `RootLayout` (`app/layout.tsx`) | HTML 骨格、メタデータ、Geist フォント、Tailwind ダークモード、`<html lang="ja">` |
| `ArticleListItem` (`components/article-list-item.tsx`) | 記事 1 件の表示 (タイトル + ソース + 公開日 + 外部リンク) |
| `ArticleRepository` (`lib/articles.ts`) | `<repo-root>/content/*.md` を再帰スキャン、frontmatter パース → `Article[]` |

### Next.js 16 確認 (OQ-05 解消)

`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` を確認した結果:
- **Turbopack デフォルト化**: `next dev` / `next build` で自動 (フラグ不要)。`package.json` 既に整合
- **Async Request APIs**: `params` / `searchParams` 等が breaking で async 化。**本プロジェクトは動的ルートなしのため影響なし**
- **Node.js 20.9+ / TypeScript 5+**: 既存環境 (24.13.1 / ^5) で OK
- **App Router の page/layout 規約**: 不変 (default export + RSC デフォルト)

### 関連する Open Questions
- ~~OQ-05~~ Next.js 16 breaking changes の影響: **解消** (動的ルートなしのため async params 影響なし)
- **OQ-03**: Vercel preview URL の E2E 取り回し → Infrastructure Design / Build and Test で確定 (本ステージでは扱わない)
- **新規**: `<repo-root>/content/` を `next/` ビルドから読む方法 (本プランで方針確定)

### PBT (Partial) — 本ユニットで適用予定
- PBT-02: `ArticleRepository` 経由のラウンドトリップは Unit 1 でカバー済み (markdown-writer ↔ fromFrontmatter)。Unit 2 では追加 PBT は最小限。
- PBT-09: vitest + fast-check (確定済)
- PBT-01 advisory: 本ユニットに追加するコンポーネント (`Home`, `ArticleListItem`, `ArticleRepository`) の Testable Properties を文書化

---

## Functional Design Questions

回答方法は前回までと同じく **`[Answer]:`** タグの後にアルファベットを記入してください。「**D) おまかせ**」を選ぶと推奨案を採用します。

---

### Question 1: `content/` ディレクトリのパス解決方法

`ArticleRepository` (`next/lib/articles.ts`) は `<repo-root>/content/*.md` を読みます。`next/` を Vercel の Root Directory とした場合、親ディレクトリへのアクセスをどう実装しますか?

A) **`process.cwd()` 基準で `path.resolve(process.cwd(), "..", "content")`** — シンプル。`next build` は通常 `next/` で実行されるため `..` で repo root に到達。
B) **環境変数 `CONTENT_DIR` で指定** — デフォルトは `path.resolve(process.cwd(), "..", "content")`、Vercel/CI で上書き可能。柔軟。
C) **コードに絶対パス直書き** — 不採用 (移植性なし)
D) **おまかせ** — 推奨 (B): `process.env.CONTENT_DIR ?? path.resolve(process.cwd(), "..", "content")` で環境変数オーバーライド可能とする
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2: 公開日 (`publishedAt`) の表示フォーマット

一覧ページで `publishedAt` (ISO 8601) をどう表示しますか?

A) **日本ロケール完全形** (例: `2026年4月25日 16:00`) — `Intl.DateTimeFormat("ja-JP", { dateStyle: "long", timeStyle: "short" })`
B) **シンプルな日付のみ** (例: `2026-04-25`) — `publishedAt.slice(0, 10)`
C) **相対時刻 + 日付** (例: `2 時間前 (2026-04-25)`) — UX 向き、ライブラリ追加 or 自作
D) **おまかせ** — 推奨 (A) を採用 (個人利用、視認性最優先)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3: ソース名 (source) のラベル表示

`Article.source` (`"zenn" | "hatena" | "googlenews" | "togetter"`) を一覧でどう表示しますか?

A) **日本語ラベル + バッジ風スタイル** — `"Zenn" / "はてブ" / "Google ニュース" / "Togetter"` をカテゴリチップとして表示
B) **小文字 ID そのまま** — `"zenn" / "hatena" / "googlenews" / "togetter"`
C) **省略 + ファビコン** — `"Z" / "H" / "G" / "T"` 等 (デザイン凝るならアイコン)
D) **おまかせ** — 推奨 (A) を採用、可読性重視
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4: 空状態 (`content/` が空) の UI

`content/*.md` が 1 件もない場合に表示する内容は?

A) **シンプルなメッセージ** — 例: 「まだ記事がありません」
B) **メッセージ + ヒント** — 例: 「まだ記事がありません。`npm run collect` で記事を収集してください」
C) **空のリスト (何も表示しない)**
D) **おまかせ** — 推奨 (B) を採用 (個人利用、開発時のヒント兼用)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5: ヘッダー / フッター の有無

ページレイアウトとして以下の追加 UI 要素はどうしますか?

A) **ヘッダー (タイトル + 件数表示) のみ** — 例: 「news.hako.tokyo (98 件)」をページ上部に表示、フッターなし
B) **ヘッダー + 簡易フッター** — フッターに「最終更新日 + サイト名」等
C) **ヘッダー / フッターなし、記事一覧のみ** — 最もミニマル
D) **おまかせ** — 推奨 (A) を採用
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 6: ソート時の同日記事の二次ソートキー

複数記事が同じ `publishedAt` (秒単位) を持った場合の二次ソートキーは?

A) **`collectedAt` 降順** — 最近収集したものを上位に
B) **`title` 昇順** — 安定ソート
C) **`source` 順 (zenn → hatena → googlenews → togetter)** — 主要ソース優先
D) **何もしない** (Array.sort の安定性に委ねる)
E) **おまかせ** — 推奨 (A) を採用
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。
