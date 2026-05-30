---

description: "Task list for 収集時の User-Agent をブラウザ偽装値に調整"
---

# Tasks: 収集時の User-Agent をブラウザ偽装値に調整

**Input**: Design documents from `/specs/001-browser-user-agent/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: テストは必須（憲法 原則 II「テスト基準」は交渉不可。収集層の変更にはテストを伴う）。本機能はテスト先行で進める。

**Organization**: 本機能はユーザーストーリー1本（US1 / P1）のみ。Setup → US1 → Polish の最小構成。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並行実行可能（別ファイル・依存なし）
- **[Story]**: 対応するユーザーストーリー（US1）
- 各タスクに正確なファイルパスを明記

## Path Conventions

- 作業ルート: `next/`（2ユニット構成の Collector ユニット）
- 変更対象: `next/scripts/collector/lib/`、新規テスト: `next/scripts/collector/test/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 作業環境の確認（既存プロジェクトのため新規初期化は不要）

- [X] T001 ブランチ `001-browser-user-agent` 上で `next/` にて `nvm use`（Node v24.x）を実行し、既存の `npm run test:run` がグリーンであることを確認（変更前のベースライン確認）

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: なし

本機能はブロッキングな共通基盤を必要としない。全収集元が既に単一の `DefaultHttpClient`
（`next/scripts/collector/lib/http-client.ts`）を共有しており、追加の土台構築は不要。
Phase 3 へ直接進む。

---

## Phase 3: User Story 1 - bot 判定で弾かれる収集元から記事を取得できる (Priority: P1) 🎯 MVP

**Goal**: 全収集元（Zenn / Hatena / Google News / Togetter）が共有する HTTP クライアントの既定
User-Agent を実在ブラウザ相当の値へ差し替え、bot 判定で弾かれていた収集元からも記事を取得できるようにする。

**Independent Test**: `DefaultHttpClient.get` の送信ヘッダーを検証する単体テストがパスし、送信される
`User-Agent` がブラウザ相当（`Mozilla/5.0 ... Chrome/...`）で旧 collector 名乗りを含まず、呼び出し側の
明示上書きが優先されることを確認できれば単独でテスト可能。

### Tests for User Story 1 ⚠️

> **NOTE: 実装（T003）より先に書き、最初は FAIL することを確認する**

- [X] T002 [P] [US1] `next/scripts/collector/test/http-client.test.ts` を新規作成。global `fetch` をモックし、(a) `DefaultHttpClient.get` が `User-Agent` にブラウザ偽装値（`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36`）を設定して送信する（FR-001/FR-002）、(b) 送信 `User-Agent` が旧 collector 名乗り `"news.hako.tokyo collector (umatoma)"` を含まない（回帰固定）、(c) `get(url, { headers: { "User-Agent": "custom" } })` のとき `custom` が優先される（FR-003）、(d) ステータス・本文・ヘッダーの戻り値が従来どおり（FR-004）であることを検証。実装前は (a)(b) が FAIL することを確認する

### Implementation for User Story 1

- [X] T003 [US1] `next/scripts/collector/lib/http-client.ts` の定数 `DEFAULT_USER_AGENT` を `"news.hako.tokyo collector (umatoma)"` から `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"` へ差し替える（呼び出し側 `options.headers` による上書き挙動・タイムアウト・戻り値構造は変更しない）
- [X] T004 [US1] `cd next && npm run test:run` を実行し、T002 の新規テストおよび既存テスト群（`sources/*` 等）がすべてグリーンであることを確認（FR-004/SC-003 のリグレッション無を確認）

**Checkpoint**: この時点で US1 は単体テストで独立に検証可能。MVP として成立。

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: マージ前ゲートの通過と検証

- [X] T005 [P] `cd next && npm run lint` をエラーゼロで通過させる
- [X] T006 [P] `cd next && npx tsc --noEmit` をエラーゼロで通過させる
- [X] T007 `cd next && npm run build` を成功させる（SSG ビルドへの非影響を確認）
- [X] T008 `specs/001-browser-user-agent/quickstart.md` の検証手順に沿って受け入れ基準（FR-001〜FR-004）の充足を確認（新規テスト4件のグリーンで充足を確認）
- [X] T009 （任意・手動）`cd next && npm run collect` を実行し、bot 判定で弾かれていた収集元から記事が取得・蓄積されること（SC-002）、従来の収集元が継続成功すること（SC-003）を確認。ネットワーク依存のため CI 必須ゲートには含めない。手動実行結果: 全4収集元が count=10 取得、failedSources=none、totalNew=38（togetter スクレイピングも成功）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし。最初に実行可能
- **Foundational (Phase 2)**: 該当タスクなし
- **User Story 1 (Phase 3)**: Setup 完了後に開始
- **Polish (Phase 4)**: US1（T003/T004）完了後に実行

### Within User Story 1

- T002（テスト）は T003（実装）より先に書き、FAIL を確認する（テスト先行）
- T003（実装）→ T004（テスト全グリーン確認）の順
- T004 完了後に Phase 4 の各ゲートを実行

### Parallel Opportunities

- T005・T006 は別コマンドで相互依存がなく [P]（並行実行可）
- US1 は単一ファイルの実装のため、実装タスク内の並行化はなし
- T002 は他に同時着手するファイルがないが、ストーリー単位の独立テストとして [P] を付与

---

## Parallel Example: Polish ゲート

```bash
# US1（T004 まで）完了後、静的チェックを並行実行:
cd next && npm run lint
cd next && npx tsc --noEmit
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup（ベースライン確認）
2. Phase 3: US1 — T002（テスト先行・FAIL 確認）→ T003（定数差し替え）→ T004（全グリーン確認）
3. **STOP and VALIDATE**: US1 を単体テストで独立検証
4. Phase 4: マージ前ゲート（lint / tsc / build）通過 → 任意で実収集確認

### Notes

- [P] タスク = 別ファイル/別コマンドで依存なし
- 憲法 原則 II によりテスト先行（T002 を T003 より前に FAIL 確認）
- 各タスクまたは論理的なまとまりごとにコミット
- 同一ファイル競合・クロスストーリー依存は本機能では発生しない（単一ストーリー・単一実装ファイル）
