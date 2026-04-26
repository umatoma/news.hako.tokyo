# 要件確認のための質問 (Requirements Verification Questions)

## 回答方法

- 各質問の **[Answer]:** タグの後に、選択肢のアルファベット (例: `A`、`C`) を記入してください。
- 複数選択可と明記された質問は、カンマ区切りで複数記入できます (例: `A, C`)。
- 該当する選択肢が無い場合は **X) その他** を選び、`[Answer]:` の後に自由記述してください。
- すべての質問への回答が完了したら、「完了」「OK」など任意の合図でお知らせください。

> **メモ**: プロジェクト名は `news.hako.tokyo` で、現状は `npx create-next-app` 直後の Next.js 16 / React 19 / TypeScript / Tailwind v4 のスキャフォールドのみです。本ページはほぼ白紙の状態から方向性を確定するための質問群です。

---

## セクション 1: プロダクトの方向性

### Question 1
このプロジェクトで構築したいプロダクトの種類は何ですか?

A) ニュース記事の集約・配信サイト (個人運営の RSS/外部 API 統合型ニュースリーダー)
B) 自分自身がニュース記事を執筆・公開するブログ型ニュースサイト (CMS ベース)
C) 特定ジャンルに特化したキュレーションメディア (例: 技術ニュース、地域ニュース)
D) コミュニティ投稿型のニュース掲示板 (ユーザー投稿あり)
E) 上記の組み合わせ (回答欄に詳細を記載してください)
X) その他 (please describe after [Answer]: tag below)

[Answer]: E
Zenn・はてなブックマーク・X(Twitter)・一般ニュースなど指定したWebサイト・ジャンルのニュースを毎日収集し、
一覧で情報を元を立とれるようにする・その日の主要なニュースを要約して短時間で概要を把握できるようにする、
ことを実現するプロダクトを作りたいです。

---

### Question 2
このプロダクトを通じて達成したい主要なゴールは何ですか? (最も重要なものを 1 つ)

A) 個人の情報整理・記録 (主に自分のためのツール)
B) 公開メディアとして読者を獲得し、コンテンツを届ける
C) 技術検証・ポートフォリオとしての公開
D) 将来的な収益化 (広告・有料記事など) を視野に入れた本格運用
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3
最初のリリース (MVP) に含めたい機能はどれですか? (該当するものをすべてカンマ区切りで)

A) ニュース記事一覧ページ
B) ニュース記事の個別詳細ページ
C) カテゴリ・タグによる絞り込み
D) 全文検索
E) RSS フィードや外部ニュース API からの自動取込
F) 自分による記事の手動投稿・編集 (管理画面)
G) ユーザーログイン・コメント機能
H) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

## セクション 2: コンテンツの調達方法

### Question 4
記事コンテンツの主な調達方法はどれですか?

A) RSS フィードから自動収集
B) 外部ニュース API (例: NewsAPI, GNews) から自動収集
C) 自分で書いた記事を Markdown ファイルや CMS から投稿
D) ヘッドレス CMS (Contentful, microCMS, Sanity 等) から取得
E) Markdown ファイルをリポジトリにコミットして公開 (Git ベース)
F) 上記の組み合わせ
X) その他 (please describe after [Answer]: tag below)

[Answer]: A,B

---

### Question 5
コンテンツの更新頻度はどの程度を想定していますか?

A) リアルタイム (数分〜十数分間隔で外部から取得)
B) 1 日数回〜1 日 1 回の定期更新
C) 不定期 (自分が更新したいときだけ)
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

## セクション 3: ユーザーと公開対象

### Question 6
想定する閲覧者はどなたですか?

A) 自分のみ (限定公開・私的利用)
B) 不特定多数の一般読者 (完全公開)
C) 限定された読者 (パスワード制・招待制)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 7
ユーザー認証 (ログイン) は必要ですか?

A) 不要 (誰でも閲覧可、書き手は自分だけで運用画面でも認証なしで OK)
B) 管理画面のみ認証必要 (自分が記事を投稿・編集する用途)
C) 一般読者にも会員登録機能を提供 (お気に入り保存、コメント等)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

## セクション 4: 技術構成

### Question 8
データの永続化 (記事本文、メタデータの保存) はどう行いたいですか?

A) データベース不要 (Markdown ファイル + Git で管理)
B) ヘッドレス CMS に委譲 (DB は CMS 側、本アプリは取得のみ)
C) PostgreSQL / MySQL 等のリレーショナル DB
D) DynamoDB / Firestore 等の NoSQL DB
E) SQLite (単一サーバー上で完結)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 9
デプロイ先として希望する環境は?

A) Vercel (Next.js の標準ホスティング)
B) Cloudflare Pages / Workers
C) AWS (Amplify / ECS / Lambda + API Gateway 等)
D) GCP (Cloud Run, App Engine 等)
E) 自前のサーバー (VPS, on-premise)
F) 未定・おまかせ (推奨を提案してほしい)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 10
レンダリング戦略の希望はありますか? (Next.js のレンダリングモード)

A) Static Site Generation (SSG) — ビルド時に静的生成
B) Incremental Static Regeneration (ISR) — 静的 + 一定間隔で再生成
C) Server-Side Rendering (SSR) — リクエストごとにサーバーレンダリング
D) 一部 Client-Side Rendering を含むハイブリッド
E) 未定・おまかせ (要件から最適なものを提案してほしい)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

## セクション 5: 非機能要件

### Question 11
想定する初期トラフィック規模は?

A) 1 日数十アクセス未満 (個人利用レベル)
B) 1 日数百〜数千アクセス (小規模公開)
C) 1 日数万アクセス以上 (本格運用)
D) わからない (現時点では予測不能)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 12
SEO・パフォーマンスへの優先度は?

A) 最優先 (Core Web Vitals 良好、構造化データ、メタタグ最適化)
B) 重要 (基本的な SEO 対策は欲しい)
C) 不要 (個人利用なので考慮しない)
X) その他 (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 13
多言語対応 (i18n) は必要ですか?

A) 日本語のみ
B) 日本語 + 英語の 2 言語
C) その他多言語 (回答欄に詳細を記載)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 14
ダークモード等のテーマ切替は必要ですか?

A) 必要 (ライト/ダーク切替 UI を含める)
B) システム設定に追従するのみ (切替 UI 不要)
C) 不要 (ライトのみ、またはダークのみ)
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

## セクション 6: 開発プロセス

### Question 15
テストの取り組み方針は?

A) しっかりやる (ユニット + 統合 + E2E、CI で自動実行)
B) 標準的 (主要機能のユニットテスト + 主要フローの E2E)
C) 最小限 (重要なロジックのみユニットテスト)
D) MVP 完成までは省略し、後追いで整備
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 16
CI/CD パイプラインの整備は MVP に含めますか?

A) はい (GitHub Actions 等で lint + typecheck + test + 自動デプロイを構築)
B) lint と typecheck のみの軽量 CI
C) MVP では不要 (手動デプロイで OK、後で整備)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 17
MVP の完成までに想定している期間感は?

A) 1 〜 2 週間
B) 1 ヶ月程度
C) 2 〜 3 ヶ月
D) 期間は決めず、段階的に進めたい
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

## セクション 7: 拡張機能 (Extension Opt-In)

### Question 18: Security Extensions
セキュリティ拡張機能のルールをこのプロジェクトに適用しますか?

A) はい — すべての SECURITY ルールをブロッキング制約として強制適用する (本番運用するアプリケーションに推奨)
B) いいえ — すべての SECURITY ルールをスキップする (PoC、プロトタイプ、実験プロジェクトに適する)
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 19: Property-Based Testing Extension
プロパティベーステスト (PBT) 拡張機能のルールをこのプロジェクトに適用しますか?

A) はい — すべての PBT ルールをブロッキング制約として強制適用する (ビジネスロジック、データ変換、シリアライゼーション、状態を持つコンポーネントを含むプロジェクトに推奨)
B) 部分的 — 純粋関数とシリアライゼーションのラウンドトリップにのみ PBT ルールを適用する (アルゴリズム的複雑性が限定的なプロジェクトに適する)
C) いいえ — すべての PBT ルールをスキップする (シンプルな CRUD アプリ、UI のみのプロジェクト、業務ロジックのない薄い統合層に適する)
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

## 自由記述欄 (任意)

ここまでの質問で表現しきれなかった要望、強い好みやこだわり、参考にしたい既存サイト、避けたい技術選定などがあれば、以下に自由に記入してください。

[Free Text]: 新着情報の収集はGitHubActionsなどで自動化することを想定しています

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。回答内容に矛盾や曖昧さが見られた場合、追加の確認質問をお出しします。
