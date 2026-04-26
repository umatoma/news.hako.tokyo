# Application Design Plan

**Project**: news.hako.tokyo
**Depth**: Standard
**Created**: 2026-04-25

このプランは Application Design ステージで作成する成果物の計画書と、設計判断のための質問群を兼ねます。回答後に各成果物 (`components.md` / `component-methods.md` / `services.md` / `component-dependency.md` / `application-design.md`) を確定させます。

---

## Tracking Checklist

- [x] Step 1: Analyze context (requirements + execution plan loaded)
- [x] Step 2: Create application design plan (this file)
- [x] Step 3: Include mandatory artifacts in plan
- [x] Step 4: Generate context-appropriate questions
- [x] Step 5: Store plan
- [ ] Step 6: Request user input
- [ ] Step 7: Collect answers
- [ ] Step 8: Analyze answers for ambiguity
- [ ] Step 9: Follow-up questions (if needed)
- [ ] Step 10: Generate application design artifacts
- [ ] Step 11: Log approval prompt
- [ ] Step 12: Present completion message
- [ ] Step 13〜15: Approval, log, state update

## Scope of Application Design

要件分析および実行計画から、本プロジェクトのアプリケーションは以下のおおまかな構造を持ちます。Application Design ではこれをコンポーネント / メソッド / サービスのレベルで解像度を上げます。

| Layer | Members | Purpose |
|---|---|---|
| **Web (Unit 2)** | `app/page.tsx`, `app/layout.tsx`, `lib/articles.ts` | ビルド時に Markdown を読み込み、一覧 HTML を生成 |
| **Collector (Unit 1)** | `scripts/collector/index.ts` + 各 source の fetcher + 共通モジュール (重複排除、Markdown 書出し、型定義) | 外部から記事を取得し、Markdown としてリポジトリにコミット |
| **Shared** | `Article` 型定義、`config/sources.ts` | Web と Collector で共有 |

### Mandatory Artifacts (Step 10 で生成)
- [ ] `components.md` — コンポーネント定義と責務
- [ ] `component-methods.md` — メソッドシグネチャと入出力型
- [ ] `services.md` — サービス層の定義 (Collector のオーケストレーション含む)
- [ ] `component-dependency.md` — 依存関係マトリクスと通信パターン
- [ ] `application-design.md` — 上記を統合した設計サマリー

---

## Application Design Questions

回答方法は前回までと同じく **`[Answer]:`** タグの後に選択肢のアルファベットを記入してください。該当が無ければ **X) その他** を選び、自由記述してください。

### Question 1: Source Fetcher の抽象化方式

複数の情報源 (Zenn RSS / はてブ RSS / 一般ニュース RSS or NewsAPI / Togetter スクレイピング) からの取得は、それぞれ異なるプロトコル・パース処理を要します。コンポーネント設計をどうしますか?

A) **Adapter パターン** — 共通インターフェース `SourceFetcher` を定義し、`ZennRssFetcher` / `HatenaRssFetcher` / `NewsApiFetcher` / `TogetterScraper` 各実装を Adapter として提供する。新規ソース追加が容易。
B) **個別関数ベタ書き** — 抽象は持たず、`fetchZenn()` / `fetchHatena()` / `fetchNewsApi()` / `fetchTogetter()` のような独立関数群とする。シンプルだが拡張時に重複が出やすい。
C) **2 段階の抽象** — RSS 系 (Zenn / Hatena / 一般 RSS) は共通 RSS パーサで処理し、API / スクレイピングは別個の関数とする。ハイブリッド。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: `Article` 型に持たせるフィールド

Markdown frontmatter および TypeScript 型で記事 1 件に持たせるフィールドはどれですか? (該当するものをカンマ区切りで)

A) `id` — 記事の一意識別子 (URL ハッシュ等で生成)
B) `title` — 記事タイトル
C) `url` — 元記事の外部 URL
D) `source` — ソース名 (`"zenn"` / `"hatena"` / `"newsapi"` / `"togetter"` 等)
E) `publishedAt` — ソース由来の公開日時 (ISO 8601)
F) `collectedAt` — このプロジェクトが収集した日時 (ISO 8601)
G) `summary` — ソース由来の冒頭抜粋 / description (RSS の `<description>` 等)
H) `tags` / `categories` — タグ・カテゴリ (将来の絞り込み用)
I) `author` — 著者名 (取得可能な場合)
J) `thumbnailUrl` — サムネイル画像 URL (将来の表示用)
K) その他 (please describe after [Answer]: tag below)

[Answer]: A,B,C,D,E,F,G,H,J

---

### Question 3: Markdown ファイルのファイル名規約

`content/` 配下に保存する Markdown のファイル名はどうしますか? (新規記事 1 件 = 1 ファイル)

A) `{publishedAt(YYYY-MM-DD)}-{slug-from-title}.md` — 日付プレフィックス + タイトル由来 slug。可読性高。
B) `{source}/{publishedAt(YYYY-MM-DD)}/{id}.md` — ソース別ディレクトリ + 日付ディレクトリ + ID。整理しやすい。
C) `{collectedAt(YYYY-MM-DD)}/{source}-{id}.md` — 収集日ディレクトリ + ID。日次ジョブの出力単位を可視化しやすい。
D) `{id}.md` — フラット (ID のみ)。シンプルだが日付情報を frontmatter から取り出さないと並び替えできない。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4: Collector の実行戦略 (並列性とエラー処理)

複数ソースからの取得を Collector が回す際、どう振る舞わせますか?

A) **逐次実行 + 失敗継続** — 各ソースを 1 つずつ順に実行し、失敗してもログを残して次のソースへ進む。最終的に成功した記事のみコミット。
B) **並列実行 + 失敗継続** — `Promise.allSettled` で並列に取得し、失敗したソースはスキップ、成功分のみコミット。
C) **逐次実行 + 失敗即終了** — 1 つでも失敗したら全体を失敗扱いにし、コミットしない。デバッグしやすいが片方の障害で全体停止。
D) **並列実行 + 失敗即終了** — `Promise.all` で並列、いずれか失敗で全体停止。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5: 重複排除のキー設計

同一記事の重複コミットを避けるキーは何にしますか?

A) **`url` のみ** — 元記事 URL で一意性を判定。最もシンプル。RSS で `<link>` を提供するソースに有効。
B) **`url` を正規化した上で一意性判定** — クエリパラメータ (utm_source 等) を除去し、末尾スラッシュを統一してから比較。実用的。
C) **`source + sourceLocalId` の複合キー** — Zenn なら slug、はてブなら entry id、Togetter なら togetter id 等の各ソース固有 ID を採用。複雑だが衝突しにくい。
D) **コンテンツハッシュ** — タイトル + URL のハッシュ等を ID に。urlリダイレクトで URL が変わる場合に強い。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 6: Web 側の Markdown 読み込み層の責務範囲

Next.js ビルド時 (SSG) に Markdown を読み込む `lib/articles.ts` 相当のモジュールは、どこまでを責務とするべきですか?

A) **読み込み + パースのみ** — `getAllArticles(): Article[]` のみを公開し、ソート・フィルタは呼び出し側 (`app/page.tsx`) で行う。
B) **読み込み + パース + ソート (新着順)** — ソート済みの配列を返す。ページ側はそのまま map するだけ。
C) **読み込み + パース + ソート + 簡易フィルタ API** — 例: `getArticles({ source?, limit? })` のような問い合わせ I/F を提供。将来の絞り込み機能を見据える。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。回答内容に矛盾や曖昧さが見られた場合、追加の確認質問をお出しします。
