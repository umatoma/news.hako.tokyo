# Tech Stack Decisions — Unit 1 (Collector)

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — NFR Requirements
**Created**: 2026-04-25

このドキュメントは Unit 1 (Collector) で採用する **具体的なライブラリ・ツール・バージョン** を確定します。Code Generation 段階の `package.json` 編集の参照点です。

---

## 1. ランタイム / 言語

| 項目 | 採用 | バージョン | 根拠 |
|---|---|---|---|
| ランタイム | Node.js | `v24.13.1` (`.nvmrc` 既定) | 既存設定。`scripts/collector/` も同じ Node で実行 |
| 言語 | TypeScript | `^5` | 既存 `next/package.json`。`strict: true` 維持 |
| 直接実行 | `tsx` | `^4` | TypeScript ファイルを直接実行 (`scripts/collector/index.ts`)。`ts-node` より高速・モダン |

> **コマンド例 (Code Generation で確定):**
> ```bash
> npx tsx scripts/collector/index.ts
> ```

---

## 2. Collector 実装の主要ライブラリ (Q4=A 採用)

| 用途 | ライブラリ | バージョン制約 | 用途詳細 |
|---|---|---|---|
| RSS / Atom パース | `rss-parser` | `^3` | Zenn / Hatena / Google ニュース 3 系統共通の XML→オブジェクト変換 |
| HTML スクレイピング | `cheerio` | `^1` | Togetter のカテゴリ別人気まとめページから記事一覧を抽出 |
| frontmatter 切り出し / シリアライズ | `gray-matter` | `^4` | YAML frontmatter + 本文の双方向操作 |
| スキーマ検証 (frontmatter / Article) | `zod` | `^3` | Frontmatter ↔ Article の型検証、PBT-02 ラウンドトリップ整合性 |
| ハッシュ生成 (Article id) | `node:crypto` | (Node.js 同梱) | 依存追加なし、SHA-256 を生成 |

### 副次的に必要になり得るもの (Code Generation 時に判断)
- HTTP クライアント: **Node.js 標準 `fetch` (Node.js 18+ で globals 対応)** を採用、追加依存なし
- 日付ユーティリティ: 標準 `Date` + ISO 文字列で十分。MVP では `date-fns` 等は不要

---

## 3. テスト関連

| 用途 | ライブラリ | バージョン制約 | 用途詳細 |
|---|---|---|---|
| 単体テストランナー | `vitest` | `^2` | Next.js 16 / Vite との親和性、watch モード高速 |
| Property-Based Testing | `fast-check` | `^3` | PBT-09 採用 (NFR-04)。Vitest と統合 (`vi.test` 内で `fc.assert` を呼ぶ) |
| (将来) E2E テスト | `@playwright/test` | (Unit 2 で確定) | 本ユニットでは未使用 |

### テストファイルの命名規則 (Code Generation で適用)
- example-based: `*.test.ts`
- property-based: `*.pbt.test.ts`
- ジェネレータ (PBT-07): `next/scripts/collector/test/generators/*.ts` に集約

---

## 4. Lint / Formatter

| 用途 | ツール | バージョン制約 | 用途詳細 |
|---|---|---|---|
| Lint | `eslint` | `^9` (既存) | Flat Config、`eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` を継続。`scripts/collector/**` も対象に追加 |
| Formatter | (採用しない) | — | MVP では Prettier を導入せず、ESLint のみで運用 (個人プロジェクトのため簡素化) |

> Code Generation 時に `eslint.config.mjs` の `globalIgnores` から `scripts/` を除外する設定が不要であることを確認します (= デフォルトで `scripts/` も lint 対象)。

---

## 5. CI / CD ツール

| 用途 | ツール | バージョン制約 | 用途詳細 |
|---|---|---|---|
| CI ランナー | GitHub Actions | (managed) | NFR-05 |
| `setup-node` | `actions/setup-node@v4` | — | `.nvmrc` から Node バージョン取得 |
| `checkout` | `actions/checkout@v4` | — | — |
| `upload-artifact` | `actions/upload-artifact@v4` | — | `collector-result.json` を upload (U1-NFR-OBS-02) |
| secrets 漏洩スキャン | `gitleaks/gitleaks-action@v2` | — | U1-NFR-SEC-06、CI gate |
| 依存脆弱性スキャン | npm 標準 `npm audit --audit-level=moderate` | — | U1-NFR-SEC-05、警告通知のみ (CI は緑のまま、`continue-on-error: true`) |
| デプロイ | Vercel 連携 | (managed) | Unit 2 で確定 |

### cron スケジュール (U1-NFR-CI-01)
```yaml
on:
  schedule:
    - cron: "0 22 * * *"   # 毎日 22:00 UTC = 翌 07:00 JST
  workflow_dispatch:
```

---

## 6. ロギング

| 用途 | 実装 | 根拠 |
|---|---|---|
| stdout プレーンログ | **自作の薄い wrapper** (`logger.info(source, msg, extra?)` 等) | Q9=A、U1-NFR-OBS-03。依存追加なし |
| 構造化レポート | `collector-result.json` を `node:fs/promises` で書き出し | U1-NFR-OBS-01 |
| Job Summary | GitHub Actions の `$GITHUB_STEP_SUMMARY` に Markdown 整形して書き出し | Q7=C、U1-NFR-OBS-02 |

---

## 7. バージョン管理戦略 (Q5=A)

| 項目 | 方針 |
|---|---|
| `package.json` の依存 | **Caret (`^`)** を許容 (npm デフォルト) |
| `package-lock.json` | **コミット必須** (再現性の担保) |
| `package-lock.json` の更新 | `npm install` 実行時に自動更新 |
| 重要な major アップデート | 定期実行ではなく手動判断 (個人プロジェクトのため Renovate 等は MVP では未導入) |

---

## 8. 配置場所 (リポジトリ構成、unit-of-work.md と整合)

```text
next/
├── package.json                # 全依存を集約 (Web + Collector)
├── tsconfig.json               # paths の "@/*" を活用
├── eslint.config.mjs           # scripts/ も lint 対象
├── lib/article.ts              # Article 型 + zod schema (Web と Collector の共通)
├── config/sources.ts           # SourceConfig 値
└── scripts/
    └── collector/
        ├── index.ts            # CollectorRunner エントリ
        ├── runner.ts           # CollectorRunner 実装
        ├── logger.ts           # 自作 logger
        ├── sources/
        │   ├── source-fetcher.ts
        │   ├── zenn-rss-fetcher.ts
        │   ├── hatena-rss-fetcher.ts
        │   ├── google-news-rss-fetcher.ts
        │   └── togetter-scraper.ts
        ├── lib/
        │   ├── deduplicator.ts
        │   ├── markdown-writer.ts
        │   ├── slug-builder.ts
        │   ├── url-normalize.ts
        │   ├── http-client.ts
        │   └── file-system.ts
        └── test/
            ├── generators/
            │   ├── article.gen.ts
            │   └── rss-item.gen.ts
            ├── *.test.ts        # example-based
            └── *.pbt.test.ts    # property-based
```

> 詳細パスは Code Generation Plan で確定 (上記は提案)。

---

## 9. 採用しなかった選択肢と理由

| 候補 | 不採用の理由 |
|---|---|
| `feedparser` (RSS) | Stream API が低レベル。`rss-parser` の方が API がシンプルで TypeScript 型完備のため不要。 |
| `fast-xml-parser` (XML 汎用) | RSS / Atom の構造解釈を自前で書く必要があり、`rss-parser` で十分。 |
| `js-yaml` (frontmatter) | `gray-matter` が内部で `js-yaml` を使い、frontmatter 切り出しの便利機能を提供するため `gray-matter` を選択。 |
| `linkedom` (HTML) | DOM 標準互換は魅力だが、`cheerio` の jQuery 風 API の方が記述量が少なく実装しやすい。 |
| `valibot` (検証) | バンドルサイズの利点はクライアント向き。Collector はサーバ実行のため `zod` で十分。 |
| `pino` / `consola` (ロガー) | 個人プロジェクトでは過剰、自作ヘルパで足りる。 |
| `ts-node` (TS 実行) | `tsx` の方が高速で設定も少ない。 |
| Prettier | 個人プロジェクトでは ESLint のスタイルルールで十分。Construction の負担を減らすため不採用。 |

---

## 10. PBT (Partial) の Framework 選定 (PBT-09)

| 言語 | フレームワーク | バージョン |
|---|---|---|
| TypeScript | `fast-check` | `^3` |

**PBT-09 の検証**:
- カスタムジェネレータをサポート (`fc.record`, `fc.string`, `fc.constantFrom`, etc.) ✅
- 自動 shrinking 対応 ✅
- Seed ベース再現性 (`fc.assert` のオプション、CLI でも seed 指定可) ✅
- Vitest 統合 (テストランナー内で `fc.assert` を直接呼べる) ✅

→ **PBT-09 準拠**

---

## 11. 確定後の package.json 編集タスク (Code Generation 時の参照)

`next/package.json` の `dependencies` および `devDependencies` に以下を追加 (Code Generation で実施):

```jsonc
{
  "dependencies": {
    "rss-parser": "^3",
    "cheerio": "^1",
    "gray-matter": "^4",
    "zod": "^3"
  },
  "devDependencies": {
    "tsx": "^4",
    "vitest": "^2",
    "fast-check": "^3"
  },
  "scripts": {
    "collect": "tsx scripts/collector/index.ts",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

> 上記は最終的に Code Generation Plan で確定し、`npm install` を実行して `package-lock.json` を更新します。
