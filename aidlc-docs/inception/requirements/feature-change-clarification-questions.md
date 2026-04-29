# 機能変更 — Clarification 質問 (Iteration 2)

**Created**: 2026-04-29
**Trigger**: `feature-change-verification-questions.md` への回答を解析した結果、以下 2 件の矛盾 / 曖昧性を検出したため確認します。

回答方法: 各質問の `[Answer]:` タグの後に該当する選択肢のアルファベットを記入してください。「Other」を選んだ場合は補足説明を記述してください。

---

## Contradiction 1: 対象領域 (Q2 vs Q5)

Q2 では対象領域を **A) Collector のみ** と回答いただきましたが、Q5 の「表示する対象を直近 3 日分のニュースに絞りたい / タイミングはビルドした時点で OK」は、`next/app/page.tsx` (Server Component) と `next/lib/articles.ts` の **Web Frontend 側のロジック変更** に該当します。

参考:
- 過去記録として `content/*.md` をリポジトリに残す方針 (要件 2.1) のため、Collector 側で古い Markdown を削除するのは方針と合いません。
- 「ビルド時点で公開日 < 直近 3 日」のフィルタは Frontend Server Component (SSG) で実装するのが自然です。

### Clarification Question 1
今回の変更スコープに **Web Frontend (`next/app/`、`next/lib/`)** も含めて良いですか?

A) はい — Collector + Web Frontend の 2 領域を変更対象とする (フィルタは Frontend 側で実装、Markdown は全件保持)
B) いいえ — Frontend は触りたくない (この場合、3 日フィルタは Collector 側で「古い記事の Markdown を削除」する方針になりますが、過去記録方針と矛盾します)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Ambiguity 1: はてなブックマークの取得件数

Q5 では他 3 ソース (Zenn / Google ニュース / Togetter) は **上位 10 件** に揃える指定がありましたが、**はてなブックマーク** については「カテゴリに関係なく取得する形にしたい (総合?)」というカテゴリ変更指定のみで、件数の指定がありませんでした。

参考:
- はてブの現状: `https://b.hatena.ne.jp/hotentry/it.rss` (IT カテゴリ)、`maxItemsPerRun=50`
- 「総合 (カテゴリ無関係)」相当のフィードは `https://b.hatena.ne.jp/hotentry.rss`

### Clarification Question 2
はてなブックマークの **取得件数** はどうしますか?

A) 他ソースに揃えて **上位 10 件** にする (`maxItemsPerRun=10`、`https://b.hatena.ne.jp/hotentry.rss` に変更)
B) 件数は変えず **現状の 50 件のまま** (URL のみ総合カテゴリに変更)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

**完了したら**、「clarification 完了」「done」等とお知らせください。要件ドキュメントを更新します。
