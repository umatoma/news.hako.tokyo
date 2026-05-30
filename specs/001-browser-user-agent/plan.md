# Implementation Plan: 収集時の User-Agent をブラウザ偽装値に調整

**Branch**: `001-browser-user-agent` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-browser-user-agent/spec.md`

## Summary

収集処理が外部サイトへ送る HTTP User-Agent を、現在の collector 名乗り
（`"news.hako.tokyo collector (umatoma)"`）から実在ブラウザ相当の値に変更し、bot 判定で
弾かれていた収集元からも記事を取得できるようにする。技術的アプローチは、全収集元が共有する
単一の HTTP クライアント（`next/scripts/collector/lib/http-client.ts` の `DefaultHttpClient`）の
既定 User-Agent 定数を差し替える最小変更とし、既存のリクエスト単位上書き挙動は維持する。
回帰防止のため `DefaultHttpClient` の Vitest 単体テストを新設する。

## Technical Context

**Language/Version**: TypeScript (strict) / Node.js v24.x（`.nvmrc` 固定）

**Primary Dependencies**: Node.js 標準 `fetch`（HTTP 送信）。`rss-parser` / `cheerio` は本文パース用で本変更とは無関係（変更なし）。

**Storage**: N/A（Git 上の Markdown が信頼できる唯一の情報源。本変更は書き出し内容に影響しない）

**Testing**: Vitest 単体テスト（`npm run test:run`）。`DefaultHttpClient` の送信ヘッダー検証を新規追加。

**Target Platform**: Node.js（Collector スクリプト。`npm run collect` および日次 GitHub Actions で実行）

**Project Type**: Web（Next.js SSG フロントエンド + Collector スクリプトの2ユニット構成）。本変更は Collector ユニットのみに閉じる。

**Performance Goals**: N/A（HTTP ヘッダー文字列の変更のみ。ビルド時間・ページ重量・SSG 挙動に影響なし）

**Constraints**: マージ前ゲート（`npm run lint` / `npx tsc --noEmit` / `npm run test:run` / `npm run build`）をすべて通過すること。無人の収集パイプラインを壊さないこと。

**Scale/Scope**: 極小。変更対象は実質1定数 + 新規単体テスト1ファイル。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. コード品質と型安全性**: PASS — 変更は単一の文字列定数差し替えと型付き単体テストの追加のみ。`HttpClient` インターフェースや型は変更せず、`next/lib/` の共有型にも影響しない。`any` や未検証キャストは導入しない。デッドコードを残さない。
- **II. テスト基準 (交渉不可)**: PASS — 収集層（HTTP クライアント）の変更にあたり、`DefaultHttpClient` が実在ブラウザ相当の User-Agent を送信すること、および呼び出し側の明示上書きが優先されることを検証する Vitest 単体テストを新設する。変更前に「collector 名乗りを送る」前提が崩れる点を回帰テストで固定する。
- **III. ユーザー体験の一貫性**: N/A — UI・表示パス・日付フォーマットに変更なし。ユーザー向けテキストにも影響しない。
- **IV. パフォーマンス要件**: N/A — SSG・ビルド時のファイル読込量・収集件数上限に変更なし。アーカイブ総量に比例する負荷増は発生しない。

**判定**: 違反なし。Complexity Tracking への記載は不要。

## Project Structure

### Documentation (this feature)

```text
specs/001-browser-user-agent/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output（採用する User-Agent 文字列の決定）
├── data-model.md        # Phase 1 output（User-Agent 既定値エンティティ）
├── quickstart.md        # Phase 1 output（変更の検証手順）
├── checklists/
│   └── requirements.md  # /speckit-specify が生成済み
└── tasks.md             # Phase 2 output（/speckit-tasks で生成。本コマンドでは作らない）
```

contracts/ は生成しない。Collector は外部に公開インターフェースを持たない内部ユニットであり、
本変更が関与する「送出 HTTP リクエストの User-Agent」は内部の振る舞いであるため。
当該振る舞いの期待値は data-model.md と quickstart.md に記載する。

### Source Code (repository root)

```text
next/scripts/collector/
├── lib/
│   └── http-client.ts                 # 変更: DEFAULT_USER_AGENT をブラウザ偽装値へ
└── test/
    └── http-client.test.ts            # 新規: DefaultHttpClient の送信ヘッダー検証
```

**Structure Decision**: 既存の2ユニット構成を踏襲し、変更は Collector ユニット
（`next/scripts/collector/`）に閉じる。全収集元（Zenn / Hatena / Google News / Togetter）は
既に単一の `DefaultHttpClient` を共有しているため、定数1箇所の差し替えで FR-001・FR-002
（全収集元一括・同一値）を満たす。新規テストは既存テスト配置慣習に合わせ
`scripts/collector/test/` 配下に置く。

## Complexity Tracking

> Constitution Check に違反がないため記載なし。
