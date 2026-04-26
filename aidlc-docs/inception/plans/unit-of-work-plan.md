# Unit of Work Plan

**Project**: news.hako.tokyo
**Depth**: Minimal
**Created**: 2026-04-25

このプランは Units Generation ステージ Part 1 (Planning) の成果物です。Application Design で既に 2 ユニット構成 (Collector / Web Frontend) が論理的に確定済みのため、本ステージでは **確認と細部の確定** に絞ります。

---

## Tracking Checklist

### Part 1: Planning
- [x] Step 1: Create unit of work plan (this file)
- [x] Step 2: Include mandatory unit artifacts in plan
- [x] Step 3: Generate context-appropriate questions
- [x] Step 4: Store UOW plan
- [ ] Step 5: Request user input
- [ ] Step 6: Collect answers
- [ ] Step 7: Analyze answers for ambiguity
- [ ] Step 8: Follow-up questions (if needed)
- [ ] Step 9: Request approval to proceed to generation
- [ ] Step 10: Log approval
- [ ] Step 11: Update progress

### Part 2: Generation
- [ ] Step 12〜15: Execute approved plan to generate `unit-of-work.md`, `unit-of-work-dependency.md`, `unit-of-work-story-map.md` (acceptance-criteria-map に置換)
- [ ] Step 16: Present completion message
- [ ] Step 17〜19: Approval, log, state update

---

## Mandatory Artifacts (Part 2 で生成)

- [ ] `aidlc-docs/inception/application-design/unit-of-work.md` — ユニット定義と責務 (+ greenfield/multi-unit のためのコード組織戦略)
- [ ] `aidlc-docs/inception/application-design/unit-of-work-dependency.md` — ユニット間依存マトリクス
- [ ] `aidlc-docs/inception/application-design/unit-of-work-story-map.md` — User Stories はスキップしているため、**FR / AC ↔ Unit のマッピング** に置換して作成

---

## Pre-confirmed Tentative Decomposition (Application Design 準拠)

| Unit ID | 名称 | 含むコンポーネント (Application Design 由来) | 役割 |
|---|---|---|---|
| **U1** | News Collection Service (Collector) | `CollectorRunner`, `SourceFetcher` IF, `ZennRssFetcher`, `HatenaRssFetcher`, `GoogleNewsRssFetcher`, `TogetterScraper`, `Deduplicator`, `MarkdownWriter`, `SlugBuilder`, `SourceConfig` | 外部ソースから記事を収集し `content/` に Markdown としてコミット |
| **U2** | News Listing Service (Web Frontend) | `Home`, `RootLayout`, `ArticleListItem`, `ArticleRepository` | `content/*.md` を読み込み静的サイトとして配信 |
| (Shared) | 横断 | `Article` 型定義 | Cross-cutting type |

**実装順序の素案**: U1 → U2 (sequential)。`Article` 型と Markdown スキーマが先に確定するため。

---

## Unit of Work Questions

回答方法は前回までと同じく **`[Answer]:`** タグの後にアルファベットを記入してください。該当が無ければ **X) その他** を選び、自由記述してください。

### Question 1: ユニット分解方針の確認

Application Design で提案している **2 ユニット構成 (U1 Collector / U2 Web Frontend)** で進めますか?

A) **そのまま 2 ユニットで進める** (推奨。Application Design と整合)
B) **3 ユニット以上に細分化する** — 例: Collector を「Adapter 層」「Orchestration 層」に分割。詳細は自由記述で。
C) **1 ユニットに統合する** — Collector と Web を 1 単位で扱う (Construction の per-unit ループが 1 周になる)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: Construction フェーズでの実装順序

Construction フェーズの per-unit ループは、どのユニットから着手しますか?

A) **U1 (Collector) → U2 (Web Frontend) の順** (推奨。Markdown スキーマが先に確定するため、U2 で迷いが少ない)
B) **U2 (Web Frontend) → U1 (Collector) の順** — 一覧 UI を先に組み、サンプル Markdown で動かしながら U1 を実装
C) **並列着手** — 共有 Article 型と frontmatter スキーマだけ先に固め、それ以降は並行して進める
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3: ディレクトリ構成 (リポジトリレイアウト)

現状 Next.js は `next/` 配下に配置されています。Collector のコードと共有資源 (Article 型、設定、コンテンツ) はどこに置きますか?

A) **次のリポジトリルート構成を採用する**
```
news.hako.tokyo/
├── next/                    # Web フロントエンド (Unit 2、既存)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── scripts/collector/       # Collector (Unit 1、新規)
│   ├── index.ts
│   ├── sources/
│   └── lib/
├── shared/                  # Cross-cutting (Article 型、設定)
│   ├── article.ts
│   └── sources.ts
├── content/                 # 収集済み Markdown (新規)
└── .github/workflows/       # GitHub Actions (新規)
```
B) **すべて `next/` 配下に集約** — Next.js プロジェクト内の `src/lib/`, `src/scripts/` 等を活用 (`next/` を実質ルートとする)
C) **モノレポツール** (npm workspaces / pnpm 等) を導入し、`packages/web/`, `packages/collector/`, `packages/shared/` のように分離
X) その他 (please describe after [Answer]: tag below)

[Answer]: B（ただし、Markdownはnext/配下に入れない）

---

### Question 4: package.json / tsconfig の取り扱い

選択した構成 (Q3 の回答) を実装するときの `package.json` と `tsconfig.json` の構成は?

A) **既存の `next/package.json` を 1 つだけ使い、Collector も同じ依存関係で動かす** — `next/scripts/` 等に Collector を置く形ならこちら。または `next/` 配下に Collector のコードもまとめて置く。
B) **ルート `package.json` を新規作成し、Collector の依存 (例: `tsx`, `rss-parser`, `cheerio`, `fast-check` 等) を追加。Web 側は `next/package.json` を継続利用** — Q3 = A 構成と整合
C) **モノレポ (npm workspaces) を採用し、Web と Collector で workspace を分ける** — Q3 = C 構成と整合
D) **Q3 への回答に合わせておまかせで決めてほしい** — おすすめを採用
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5: Construction で許容するユニット並行作業

per-unit ループは原則 1 ユニットずつ完結 (機能設計 → NFR → コード生成) してから次へ移りますが、特定ステージのみ並行で進めたいものはありますか?

A) **完全に逐次** — 1 ユニットの全ステージを完了してから次へ進む (CLAUDE.md 既定動作)
B) **共有資産 (Article 型 / Markdown スキーマ) のみ U1 と U2 の Functional Design を一括で確定し、それ以降は逐次** — 二度手間を避ける
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。回答内容に矛盾や曖昧さが見られた場合、追加の確認質問をお出しします。
