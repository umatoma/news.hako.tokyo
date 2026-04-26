# Business Rules — Unit 1 (Collector)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Functional Design
**Created**: 2026-04-25

このドキュメントは Unit 1 (Collector) の **業務ルール、検証ロジック、制約、ポリシー** を集約したリファレンスです。Code Generation 段階で実装に落とす際の判断基準として参照します。

---

## 1. データ完全性ルール (Article)

| ID | ルール | 検証手段 | 違反時の振る舞い |
|---|---|---|---|
| **BR-01** | `Article.title` は **1 文字以上 500 文字以下** | `zod` `min(1).max(500)` | 該当 Article をスキップ (Adapter は継続) |
| **BR-02** | `Article.url` は **妥当な URL** | `zod` `.url()` | 同上 |
| **BR-03** | `Article.source` は `SourceId` の列挙値のいずれか | `zod` enum | 同上 |
| **BR-04** | `Article.publishedAt` / `collectedAt` は **ISO 8601 (offset 必須)** | `zod` `.datetime({ offset: true })` | publishedAt は `now()` フォールバック (BR-13 参照)、collectedAt は Runner が常に有効値を付与 |
| **BR-05** | `Article.id` は **URL の正規化値からのハッシュ** で決定的に生成される (BR-31 と整合) | 単体テスト + PBT-03 (`articleId` 決定性) | 違反時はテスト失敗 (実装バグ) |
| **BR-06** | `Article.summary` は HTML タグを除去後、最大 1000 文字に切り詰める | 単体テスト | 切り詰め時は末尾に `…` (U+2026) を付与 |
| **BR-07** | `Article.tags` は **空配列許容**、各要素は前後空白トリム + 空文字除外 | 単体テスト | 違反時はテスト失敗 |
| **BR-08** | `Article.thumbnailUrl` は **URL または `null`** | `zod` `.url().nullable()` | 不正値は `null` フォールバック |

---

## 2. SourceConfig ルール

| ID | ルール | 検証手段 |
|---|---|---|
| **BR-09** | 各 SourceConfig には `enabled: boolean` を必須とする | `zod` |
| **BR-10** | `enabled: false` のソースは Adapter 呼び出しを **スキップ** し、ログ `[INFO][{source}] disabled, skipping` を出す | CollectorRunner ロジック |
| **BR-11** | `maxItemsPerRun` は **正の整数** (デフォルト Zenn/Hatena/Google ニュース 50、Togetter 30) | `zod` `int().positive()` |
| **BR-12** | `TogetterConfig.requestIntervalMs` は **0 以上の整数** (デフォルト 5000) | `zod` `int().nonnegative()` |

---

## 3. 取得時のフォールバック / 補完ルール

| ID | ルール |
|---|---|
| **BR-13** | RSS / HTML から `publishedAt` を取得できない場合、**Runner 開始時刻** をフォールバックとして付与する (要件 FR-01「公開日: 収集元から取得した日時、または収集日時」) |
| **BR-14** | `summary` 取得不能の場合は **空文字** を設定する (`null` ではなく) |
| **BR-15** | `tags` 取得不能の場合は **空配列** を設定する |
| **BR-16** | `thumbnailUrl` 取得不能の場合は **`null`** を設定する |
| **BR-17** | `title` の改行 (`\n`、`\r\n`) は **半角空白** に置換する |
| **BR-18** | `title` / `summary` の前後空白は **必ず trim** する |
| **BR-19** | `summary` 内の HTML タグは除去する (タグの中身テキストは残す)。HTML エンティティ (`&amp;` など) はデコードする |

---

## 4. 重複排除 (Deduplicator) ルール

| ID | ルール |
|---|---|
| **BR-20** | 重複判定キーは **正規化済み URL** (`normalizeUrlForDedup`) のみ (Q5 = B 軽い正規化) |
| **BR-21** | 既存 `content/*.md` を `Deduplicator.initialize()` で読み込み、frontmatter `url` を正規化して URL set に登録する |
| **BR-22** | `filterNew(candidates)` は以下を順に適用: (1) `knownUrls` に含まれる正規化 URL を除外、(2) バッチ内重複を除外 (出現順で最初の 1 件のみ残す) |
| **BR-23** | バッチ内重複が起きた場合、**最初の出現** を残す。後の出現で取得元 (`source`) が異なっていても、URL ベースでは同じものとして 1 件にまとめる |
| **BR-24** | 既存 frontmatter のスキーマ違反は **致命エラー**として throw (CollectorRunner exit code 1)。データ不整合を即時可視化するため |

---

## 5. URL 正規化ルール (`normalizeUrlForDedup`)

| ID | ルール |
|---|---|
| **BR-25** | ホスト名は **小文字** (URL コンストラクタの既定動作) |
| **BR-26** | 末尾スラッシュは除去 (root path `/` のみ例外) |
| **BR-27** | 以下のクエリパラメータは除去 (大小文字無視で比較): `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `mc_cid`, `mc_eid`, `yclid`, `msclkid` |
| **BR-28** | 残ったクエリパラメータは **キー名でソート** する (順序差を吸収) |
| **BR-29** | URL の `fragment` (`#...`) は **除去** する |
| **BR-30** | 入力が妥当な URL でなければ throw (Adapter 側でその記事をスキップ) |

---

## 6. ID 生成ルール (`generateArticleId`)

| ID | ルール |
|---|---|
| **BR-31** | `id` は **正規化済み URL の SHA-256 を Base36 で 16 文字に短縮** |
| **BR-32** | 同一の正規化 URL は **常に同じ id** を生成 (決定的) |
| **BR-33** | id は **`[0-9a-z]+`** の文字種に限定される (Base36) |
| **BR-34** | id 同士の衝突可能性は実用上ゼロ (16 文字 Base36 ≒ 82 bit) |

---

## 7. SlugBuilder ルール

| ID | ルール |
|---|---|
| **BR-35** | `slug` は **`[a-z0-9-]+`** のみで構成される (大文字や非 ASCII を含めない) |
| **BR-36** | `slug` の長さは **1〜50 文字** |
| **BR-37** | タイトルから抽出した ASCII 部が **3 文字未満** なら、id 先頭 8 文字を slug として使う (フォールバック) |
| **BR-38** | ASCII 部が 3 文字以上の場合、`{ascii}--{idSuffix(6文字)}` の形で連結する (衝突回避兼可読性) |
| **BR-39** | 連続ハイフン (`--`) は **`{ascii}--{idSuffix}`** の境界 1 箇所のみ許容 (`ascii` 内には現れない) |
| **BR-40** | 同じ `(title, articleId)` から **必ず同じ slug** を生成 (決定的) |

---

## 8. ファイル命名 / 衝突回避ルール

| ID | ルール |
|---|---|
| **BR-41** | ファイル名は **`{published_at(YYYY-MM-DD)}-{slug}.md`** 形式 |
| **BR-42** | 既に同名ファイルが存在する場合、**`-2.md`、`-3.md` … `-99.md`** の順に試す (BR-43 で 99 上限) |
| **BR-43** | 99 まで試して全て存在する場合は **致命エラー** (テストでは発生しない想定) |
| **BR-44** | ファイル本体は **frontmatter (YAML)** + 空行 + `# {title}` (H1) + 空行 + `summary` の構造 (Q3=B / Q8=B) |
| **BR-45** | frontmatter のキーは **snake_case** (`published_at`, `collected_at`, `thumbnail_url` 等) |
| **BR-46** | TypeScript 内部の Article 型は **camelCase**。`toFrontmatter` / `fromFrontmatter` で双方向変換する (PBT-02 でラウンドトリップ性を検証) |

---

## 9. 取得件数 / レート制御ルール

| ID | ルール |
|---|---|
| **BR-47** | 各 Adapter は **`maxItemsPerRun` 件まで** しか取得を許容しない (Q9 = A) |
| **BR-48** | 切り詰めは取得後の **新着順** (RSS のフィード順に従う、追加ソート無し) で先頭 N 件を取る |
| **BR-49** | Togetter Adapter は `requestIntervalMs` を遵守し、複数 URL の取得間に sleep を入れる |
| **BR-50** | Adapter 内で `feedUrls` / `targetUrls` / クエリ等の単位で失敗が出ても、**Adapter 全体は継続** (失敗単位はログに残し、成功した分だけ返す) |

---

## 10. 失敗時の振る舞いルール (Q4 = A 逐次 + 失敗継続)

| ID | ルール |
|---|---|
| **BR-51** | Adapter のスローが起きたら **`failedSources` に追加し、次の Adapter へ継続** (CollectorRunner レベル) |
| **BR-52** | 4 Adapter すべてが失敗しても、**exit code 0** (= Workflow 成功) で終了する。ログ + `collector-result.json` で失敗を記録 |
| **BR-53** | `Deduplicator.initialize()` の失敗 (例: 既存 frontmatter 不正) は **致命エラー** で exit code 1 |
| **BR-54** | `MarkdownWriter.write()` の I/O 失敗は **致命エラー** で exit code 1 |
| **BR-55** | 致命エラー時は GitHub Actions のデフォルト失敗通知を経由する (NFR-03 / FR-03 の方針) |

---

## 11. ロギングルール (Q6 = C)

| ID | ルール |
|---|---|
| **BR-56** | stdout には **プレーンテキスト形式のサマリー** を出す (`[LEVEL][source] message ...`) |
| **BR-57** | 致命エラー以外は exit code 0 を保つ。ログレベルだけで区別 |
| **BR-58** | Runner 完了時に **`collector-result.json`** をリポジトリルートに出力 (gitignore 対象) |
| **BR-59** | `collector-result.json` には `schemaVersion: 1` を含める (将来の互換性のため) |
| **BR-60** | ログに **シークレット (API キー / Cookie 等) を絶対に出力しない**。MVP では API キー不要だが将来の拡張に備える方針 |

---

## 12. ソース別の業務ルール

### 12.1 Zenn (RSS)
- **BR-61**: `feedUrls` の各 URL を順に取得する。1 つが失敗しても他の URL は継続する。
- **BR-62**: 取得項目は (BR-13〜BR-19 の共通ルールに従い) Article へマップ。

### 12.2 Hatena (RSS)
- **BR-63**: `<dc:date>` (rss-parser の `isoDate`) を `publishedAt` に使う。
- **BR-64**: はてな独自要素 (`<hatena:bookmarkcount>` 等) は MVP では使用しない。

### 12.3 Google News (非公式 RSS)
- **BR-65**: `queries` / `topics` / `geos` から URL を構築する (詳細は business-logic-model.md §2.4)。
- **BR-66**: Google News 経由のリダイレクト URL (`https://news.google.com/articles/...`) を **そのまま `Article.url` に保存する**。元 URL の解決は MVP では行わない。
- **BR-67**: 仕様変更 (RISK-02) を検知するため、取得失敗時のログには **HTTP ステータス / レスポンス長** を含める (Code Generation 時に実装)。

### 12.4 Togetter (HTML スクレイピング)
- **BR-68**: User-Agent を明示する (例: `news.hako.tokyo collector (umatoma)`)。
- **BR-69**: `requestIntervalMs` (デフォルト 5000ms) を必ず遵守する。
- **BR-70**: スクレイピング対象は **カテゴリ別人気まとめページ** (Q7=A、例: `https://togetter.com/category/news`)。
- **BR-71**: 規約・robots.txt の確認は **NFR Requirements 段階で実施** (OQ-01 / RISK-01)。確認結果次第で `enabled: false` または対象 URL を変更する。
- **BR-72**: HTML 構造の変化を検知するため、必須セレクタ (例: まとめ一覧コンテナ) のヒット数が 0 の場合は **Adapter 失敗** として throw する (= 静かに 0 件取得しない)。

---

## 13. 規約・コンプライアンスルール

| ID | ルール |
|---|---|
| **BR-73** | Google ニュース RSS は **非公式仕様** であることを `business-logic-model.md` および本 `business-rules.md` で明示する。仕様変更時は `GoogleNewsRssFetcher` を差し替えできるよう、Adapter インターフェイス内に閉じ込める。 |
| **BR-74** | Togetter 利用規約・robots.txt の遵守は MVP の前提。NFR Requirements 段階で確認し、設定 (`TogetterConfig.enabled`、`targetUrls`、`requestIntervalMs`) で調整する。 |
| **BR-75** | NewsAPI 等の API キーが将来必要になった場合、**コードにハードコードしない**。GitHub Actions Secrets / Vercel 環境変数で管理する (NFR-03)。 |

---

## 14. PBT 関連ルール (PBT-01 advisory として明示)

| ID | ルール |
|---|---|
| **BR-76** | `toFrontmatter` / `fromFrontmatter` は **PBT-02 (Round-trip)** で検証する (任意の妥当な Article について `from(to(a)) === a`) |
| **BR-77** | `normalizeUrlForDedup` は **冪等性** (`f(f(x)) === f(x)`)、サニタイズ性 (BR-27 のパラメータが出力に現れない)、安定性 (順序によらず同じ正規形) を PBT-03 で検証する |
| **BR-78** | `Deduplicator.filterNew` は **境界性** (`output.length ≤ input.length`)、**一意性** (出力 URL 一意)、**除外性** (knownUrls に含まれない)、**包含性** (既知でない最初の出現は出力に含まれる) を PBT-03 で検証する |
| **BR-79** | `SlugBuilder.build` は **文字種** (`[a-z0-9-]+`)、**長さ** (1〜50)、**決定性**、**衝突回避** を PBT-03 で検証する |
| **BR-80** | `Article` / RSS XML 共通の **fast-check arbitrary** を `next/scripts/collector/test/generators/` (Construction Code Generation で配置) に集約し、全 PBT で再利用する (PBT-07) |
| **BR-81** | CI で seed をログ出力 (`vitest --reporter=verbose` 程度を想定)、失敗時に再現できる状態を保つ (PBT-08) |

---

## 15. ルール ID と工程の対応 (トレーサビリティ)

| 工程 | 適用ルール |
|---|---|
| Adapter 実装 (各 Fetcher) | BR-01〜BR-08, BR-10〜BR-19, BR-47〜BR-50, BR-61〜BR-72 |
| Deduplicator 実装 | BR-20〜BR-30 |
| ID 生成 / SlugBuilder | BR-25〜BR-40 |
| MarkdownWriter | BR-41〜BR-46, BR-19 (frontmatter 書出し時の HTML 除去は不要 — Adapter 側で済) |
| CollectorRunner | BR-09〜BR-12, BR-50〜BR-60 |
| ロギング | BR-56〜BR-60 |
| PBT (Code Generation) | BR-76〜BR-81 |
