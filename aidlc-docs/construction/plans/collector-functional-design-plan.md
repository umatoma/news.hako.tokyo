# Functional Design Plan — Unit 1: Collector

**Project**: news.hako.tokyo
**Unit**: U1 (News Collection Service / Collector)
**Stage**: CONSTRUCTION — Functional Design
**Created**: 2026-04-25

このプランは Unit 1 の機能設計 (詳細なビジネスロジック、ドメインモデル、ビジネスルール) を確定するための計画書と質問群を兼ねます。質問への回答後、機能設計成果物 (`business-logic-model.md` / `business-rules.md` / `domain-entities.md`) を生成します。

---

## Tracking Checklist

- [x] Step 1: Analyze unit context (unit-of-work.md / unit-of-work-story-map.md / Application Design 読込)
- [x] Step 2: Create functional design plan (this file)
- [x] Step 3: Generate context-appropriate questions
- [x] Step 4: Store plan
- [ ] Step 5: Collect and analyze answers
- [ ] Step 6: Generate functional design artifacts
- [ ] Step 7: Present completion message
- [ ] Step 8: Approval
- [ ] Step 9: Record approval and update progress

---

## Scope of Functional Design (Unit 1)

Application Design で確定した以下のコンポーネントの **詳細ビジネスロジック** を確定します:

| コンポーネント | 主要責務 |
|---|---|
| `CollectorRunner` | 4 Adapter の逐次実行 + 失敗継続 + 重複排除 + 書き出し |
| `SourceFetcher<TConfig>` (IF) | Adapter 共通契約 |
| `ZennRssFetcher` | Zenn RSS パース → Article |
| `HatenaRssFetcher` | はてブ RSS パース → Article |
| `GoogleNewsRssFetcher` | Google ニュース 非公式 RSS パース → Article |
| `TogetterScraper` | Togetter HTML パース → Article |
| `Deduplicator` | URL ベース重複排除 |
| `MarkdownWriter` | Article → Markdown ファイル書出し |
| `SlugBuilder` | タイトル → ASCII slug 生成 |

### 関連する Open Questions
- **OQ-01**: Togetter スクレイピングの規約・robots.txt 確認 → 本プランで方針を確定
- **OQ-04**: Markdown frontmatter スキーマ詳細 → 本プランで確定
- ~~**OQ-02**~~: Google ニュース RSS で確定済み

### PBT (Partial) — 本ユニットで適用予定
- PBT-02: ラウンドトリップ性 (`Article ↔ Markdown frontmatter` の往復)
- PBT-03: 不変条件 (`Deduplicator.filterNew` の URL 一意性、`SlugBuilder.build` の文字種・長さ)
- PBT-07: ドメイン型ジェネレータ (`Article` / 各 RSS XML のサンプル)
- PBT-08: shrinking + seed 再現性 (CI ログ)
- PBT-09: fast-check + Vitest (済)
- PBT-01 (Property identification) は advisory として明記

---

## Functional Design Questions

回答方法は前回までと同じく **`[Answer]:`** タグの後にアルファベットを記入してください。該当が無ければ **X) その他** を選び、自由記述してください。

---

### Question 1: RSS / XML パースライブラリの選定

3 つの RSS Adapter (Zenn / はてブ / Google ニュース) は同じ XML パーサを共有するのが望ましいです。どれを採用しますか?

A) **`rss-parser`** (npm) — RSS / Atom 両対応、TypeScript 型あり、メンテ活発、シンプル API。MVP 向きの定番。
B) **`fast-xml-parser`** (npm) — 汎用 XML パーサ。スキーマ細部のカスタムが効くが自前で RSS 構造を解釈する必要あり。
C) **`feedparser`** (npm) — Stream ベース。Node.js での古典。やや低レベル。
D) **おまかせ** — 推奨 (A の `rss-parser`) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: Frontmatter スキーマの厳密バリデーション

`Article` 型 ↔ Markdown frontmatter のバリデーションをどう行いますか? PBT-02 (ラウンドトリップ) の確実性に影響します。

A) **`zod`** (npm) — TypeScript 型推論と一体化、エラーメッセージが分かりやすい、業界標準。
B) **`valibot`** (npm) — `zod` 互換 API でバンドルサイズが小さい。
C) **手書きの type guard 関数** — 依存追加なし、ただし型と検証ロジックが二重管理に。
D) **おまかせ** — 推奨 (A の `zod`) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3: Frontmatter のキー命名規約

YAML frontmatter のキー名はどのケースを使いますか?

A) **camelCase** — TypeScript の Article 型と一致 (`publishedAt`, `collectedAt`, `thumbnailUrl` 等)
B) **snake_case** — Markdown / 静的サイト界隈で一般的 (`published_at`, `collected_at`, `thumbnail_url` 等)
C) **kebab-case** — YAML で見栄えが良い (`published-at` 等)。ただしオブジェクトキーとしては扱いづらい
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 4: SlugBuilder の日本語タイトル処理

ファイル名規約 `{publishedAt(YYYY-MM-DD)}-{slug-from-title}.md` の slug 部分について、**日本語タイトル** をどう ASCII 化しますか?

A) **タイトルの URL ハッシュ短縮** — タイトル + URL の SHA-256 を Base36 で 8〜10 文字に短縮 (例: `2026-04-25-a1b2c3d4.md`)。決定的かつ衝突しにくいが、ファイル名から内容が読めない。
B) **タイトルのローマ字 transliteration** — `wanakana` 等で日本語をローマ字化 → ASCII slug (例: `2026-04-25-zenn-no-rss-feed-no-tsukaikata.md`)。可読性高いが依存ライブラリ追加 + 漢字の transliteration は不完全。
C) **A と B のハイブリッド** — まず ASCII 抽出 (英字・数字・既存の半角ハイフン)、足りなければ URL ハッシュをサフィックスとして付加。短く、衝突回避でき、英語タイトルなら読める。
D) **おまかせ** — 推奨 (C のハイブリッド) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 5: 重複排除の URL 正規化レベル

Q5 (Application Design) で「URL のみで重複排除」を選択済みですが、URL の比較は厳密一致 / 軽い正規化のどちらにしますか? RISK-05 とのバランスです。

A) **厳密一致** — URL 文字列完全一致。最もシンプル。`utm_source` 違い等で重複が残る可能性あり (許容)。
B) **軽い正規化** — 末尾スラッシュ削除 + 一般的な追跡パラメータ (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` 等) を除去してから比較。実用的。
C) **完全な URL 正規化** — `URL` API でホスト小文字化 + ポート省略 + 並び順正規化 + 既知パラメータ全除外。複雑度高め。
D) **おまかせ** — 推奨 (B の軽い正規化) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 6: エラーログのフォーマット

CollectorRunner / 各 Adapter のエラーログはどの形式で出力しますか? GitHub Actions ログでの可読性とパース容易性のバランスです。

A) **構造化 JSON** (1 行 1 JSON、`{level, source, message, error, timestamp}`) — パースしやすい、`jq` 等で検索可能。GitHub Actions の "Job Summary" にも貼りやすい。
B) **プレーンテキスト + プレフィックス** (`[ERROR][zenn] failed: ...` 等) — 視認性高い、パースには grep 程度。
C) **両方** — メイン stdout は B、構造化情報は別ファイル `collector-result.json` を生成 (CI で artifact 化可能)。
D) **おまかせ** — 推奨 (C の両方) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 7: Togetter スクレイピングの取得対象

RISK-01 (利用規約・robots.txt) を踏まえつつ、具体的にどこをスクレイピングしますか?

A) **「カテゴリ別人気まとめ」のトップページ** — 例: `https://togetter.com/category/news` 等。トップ N 件のまとめタイトル + URL + 公開日を取得。
B) **特定キーワードの検索結果ページ** — 興味のあるキーワードで検索した結果の上位 N 件。Q1 (要件) の趣旨に近い。
C) **特定の "タグ" ページ** — Togetter のタグ機能を使ったページ。
D) **MVP では Togetter を一時的にスキップ** (`TogetterConfig.enabled = false`)、規約確認後に有効化する Phase で実装
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 8: Markdown ファイル本文 (frontmatter 以外の中身) の扱い

Markdown ファイルの frontmatter の **下** の本文はどうしますか?

A) **空** (frontmatter のみ) — Markdown ファイルとしてはほぼメタデータの YAML データベース化。最もシンプル。
B) **`title` と `summary` を Markdown 本文として記載** — 元記事のタイトルと冒頭抜粋を見出し + 段落として書く。Git の diff で内容が見やすい。将来 Markdown ビューアで読む際に便利。
C) **`summary` のみを本文として記載** — タイトルは frontmatter にあるので重複させない、本文は要約だけ。
D) **おまかせ** — 推奨 (B) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 9: 取得件数の上限 (per source per run)

各 Adapter の 1 回の実行で取得する件数上限を設定しますか? 暴走 / 規約違反防止のため。

A) **設定可能 (デフォルトは各ソース 50 件)** — `*Config` に `maxItemsPerRun` を追加。Zenn 50 / Hatena 50 / Google ニュース 50 (queries × topics × geos の合計) / Togetter 30 など。
B) **設定なし** — RSS / API が返した分すべてを取得。シンプルだが想定外に大量取得する可能性あり。
C) **全体の上限のみ** — Adapter 別ではなく、CollectorRunner 全体で 1 回 200 件まで等の総量制限。
D) **おまかせ** — 推奨 (A) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 10: SourceConfig のサンプル設定値

MVP 起動時のデフォルト `config/sources.ts` の中身をどう設定しますか?

A) **全ソース有効、控えめなクエリ** — 例:
   - Zenn: `https://zenn.dev/feed`、はてブ: `https://b.hatena.ne.jp/hotentry/it.rss`
   - Google ニュース: `queries: ["AI"]`, `topics: ["TECHNOLOGY"]`
   - Togetter: `enabled: true, targetUrls: [<カテゴリページ>]`
B) **MVP 初回はすべて `enabled: false` に近い保守的な構成** — まず動作確認のため Zenn のみ有効、他は段階的に
C) **MVP では Togetter のみ無効** (規約確認待ち)、その他は控えめに有効
D) **おまかせ** — 推奨 (C) を採用。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。回答内容に矛盾や曖昧さが見られた場合、追加の確認質問をお出しします。
