# 機能変更 — 意図確認質問 (Iteration 2)

**Workflow Iteration**: 2 (post-MVP feature change)
**Created**: 2026-04-29
**Source User Request**: "機能の変更を行いたいです"
**目的**: ユーザーリクエストが具体的機能を指定していないため、変更対象・種別・スコープを明確化し、要件深度 (Minimal / Standard / Comprehensive) と実行ステージ (Application Design や Functional Design の要否) を判定する。

回答方法: 各質問の `[Answer]:` タグの後に該当する選択肢の **アルファベット 1 文字** を記入してください。複数選択が必要な場合は `A,B` のようにカンマ区切りで記入できます。「Other」を選んだ場合は補足説明を `[Answer]:` の後ろに記述してください。Q5 と Q11 は自由記述です。

---

## Question 1
変更したい機能の **種別** は何ですか? (該当するものを 1 つ以上)

A) 既存機能の修正・改善 (Enhancement) — 例: 一覧表示の見た目変更、収集ロジックの調整
B) 新機能の追加 (New Feature) — 例: 検索機能、要約機能、カテゴリ絞り込み
C) バグ修正 (Bug Fix) — 既存の不具合を直したい
D) リファクタリング (Refactoring) — 動作を変えずにコード構造を改善
E) 依存ライブラリ等のアップグレード (Upgrade) — 例: Next.js 17 への更新
F) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
変更したい **対象領域** はどこですか? (該当するものを 1 つ以上)

A) Collector (ニュース収集ジョブ — `next/scripts/collector/`)
B) Web Frontend (一覧表示 — `next/app/`、`next/components/`、`next/lib/`)
C) ソース設定 (`next/config/sources.ts` — RSS URL や Togetter URL の管理)
D) GitHub Actions ワークフロー (`.github/workflows/collect.yml` / `ci.yml`)
E) コンテンツストレージ (`content/` ディレクトリの構造・スキーマ)
F) テスト基盤 (Vitest / Playwright / fast-check 設定)
G) 全体 (横断的な変更で複数領域に影響)
H) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
要件ドキュメント (`aidlc-docs/inception/requirements/requirements.md`) では以下が **MVP スコープ外 / 将来候補** として記載されています。今回変更したい機能はこれらに該当しますか?

A) **LLM による日次要約** (Phase 2 候補)
B) **個別記事詳細ページ** (Phase 2 候補)
C) **カテゴリ / タグ絞り込み**
D) **全文検索**
E) **ページネーション**
F) **管理画面 / 投稿機能 / 認証**
G) どれにも該当しない (まったく新しいアイデア / 既存機能修正)
H) Other (please describe after [Answer]: tag below)

[Answer]: G

---

## Question 4
変更の **規模感** はどのくらいを想定していますか?

A) Trivial — 1 ファイル・数行の変更で済む (例: ラベルの文言修正)
B) Simple — 1 コンポーネント内で完結 (例: 一覧の並び替えロジック追加)
C) Moderate — 複数コンポーネントに渡る (例: 検索機能を Collector + Frontend 横断で追加)
D) Complex — システム全体に影響 (例: データスキーマ変更、新ストレージ導入)
E) まだ分からない (これから一緒に検討したい)
F) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5
**変更したい機能の具体的内容** を自由に記述してください。「何を」「なぜ」「どのように振る舞ってほしいか」が分かると要件分析がスムーズになります。Q3 で選んだ将来候補や Q1〜Q4 で選んだ選択肢の補足としても構いません。

[Answer]:
各ニュースサイトのカテゴリ・取得件数を変更したい
・Zenn：上位10件に変更したい
・はてなブックマーク：カテゴリに関係なく取得する形にしたい（総合？）
・Googleニュース：上位10件に変更したい
・Togetter：上位10件に変更したい

表示する対象を直近3日分のニュースに絞りたい
・現状のままでは無制限に表示対象が増えてしまうのを回避することが目的
・直近3日とは公開日時をベースに判定してほしい、タイミングはビルドした時点でOK


---

## Question 6
**現状の不満点・課題** は何ですか? (任意 — あれば 1 つ以上)

A) 表示が見づらい / 情報過多
B) 収集対象が不足している / 不要なソースを除きたい
C) 収集頻度や収集タイミングを変えたい
D) 性能・ビルド時間が遅い
E) テスト・CI の安定性に問題がある
F) 不満は特になし、純粋な機能追加
G) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
**既存の受入基準 (AC-01〜AC-10)** に新たな受入基準を追加する想定はありますか?

A) はい — 新機能のために追加する
B) いいえ — 既存 AC で十分 (内部実装のみの変更等)
C) まだ判断できない (要件分析の中で確定したい)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 8
変更の **緊急度・タイミング** はどの程度ですか?

A) 緊急 — 今すぐ着手したい (バグ修正等)
B) 高 — 近日中 (1〜3 日以内) に完了したい
C) 中 — 1〜2 週間以内に完了したい
D) 低 — 調査・検討段階 (実装は急がない)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 9: Security Extensions (前回 Iteration から引き継ぎ確認)
Iteration 1 (MVP) では「No (個人利用、PoC 相当のため強制適用しない)」を選択しました。今回も同様の方針でよいですか?

A) Yes — Iteration 1 と同じ "No" (Security Baseline ルールは強制適用しない、最低限の配慮のみ継続)
B) 今回は "Yes" にしたい (Security Baseline ルールを全件ブロッキング制約として適用)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10: Property-Based Testing Extension (前回 Iteration から引き継ぎ確認)
Iteration 1 (MVP) では「Partial (PBT-02, 03, 07, 08, 09 のみ強制適用)」を選択しました。今回も同様の方針でよいですか?

A) Yes — Iteration 1 と同じ "Partial" (PBT-02, 03, 07, 08, 09 を強制適用)
B) "Yes" にしたい (全 PBT ルールを強制適用)
C) "No" にしたい (PBT ルールは適用しない — UI のみの変更等)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11
**その他、要件分析で考慮してほしい事項** があれば自由記述してください。例: 制約条件、参考にしたい既存実装、避けたいアプローチ、想定外のリスクなど。

[Answer]: なし

---

**完了したら**、「回答完了」「done」「終わりました」等とお知らせください。回答を解析して矛盾・曖昧性のチェック後、`requirements.md` を更新する形で要件ドキュメントに追記します。
