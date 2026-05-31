# プロジェクト構造

## 構成方針

Next.js App Router を基盤としたレイヤード／ドメイン駆動構成。中心ドメインは「ニュース記事の集約・表示」、副次ドメインは「記事収集パイプライン（ETL）」。プレゼンテーション・ビジネスロジック・データ収集・設定の各層を明確に分離する。

> アプリ本体は `next/` 配下にある。以下のパスはすべて `next/` を基点とする。

## ディレクトリパターン

### App（`app/`）
**目的**: Next.js App Router のページ／レイアウト
**パターン**: `layout.tsx` / `page.tsx` は最小限に保ち、データ取得を lib に、描画を components に委譲するオーケストレータに徹する

### Components（`components/`）
**目的**: 再利用可能な React コンポーネント（プレゼンテーション中心）
**パターン**: ファイルは kebab-case。ドメインロジックを持たず lib の関数を消費する。テストを併置（`source-tabs.tsx` + `source-tabs.test.tsx`）

### Lib（`lib/`）
**目的**: ドメイン型・ビジネスロジック・ユーティリティ
**パターン**: ドメイン型（Zod スキーマ）→ 純粋関数（フィルタ・整形）の順に依存。テストを併置（`articles.ts` + `articles.test.ts`、`articles.pbt.test.ts`）

### Collector（`scripts/collector/`）
**目的**: 記事収集 CLI（RSS フェッチャ・スクレイパ）。自己完結した副次ドメイン
**パターン**: 関心ごとに分割（`sources/`・`lib/`・`test/`）。`index.ts` をエントリ、`builder.ts` が依存注入で runner を構築

### Config（`config/`）
**目的**: 型安全な設定オブジェクト（収集ソース定義など）
**パターン**: Zod スキーマで定義し、デフォルトをシングルトンとしてエクスポート。ビジネスロジックは持たない

### E2E（`e2e/`）
**目的**: Playwright による E2E テスト（`.spec.ts`）

## 命名規則

- **ファイル**: kebab-case（`source-tabs.tsx`, `url-normalize.ts`）
- **コンポーネント**: PascalCase エクスポート（`export function SourceTabs(...)`）
- **型**: PascalCase（`Article`, `PageStats`）
- **Zod スキーマ**: PascalCase + `Schema` サフィックス（`ArticleSchema`, `SourceIdSchema`）
- **定数**: UPPER_SNAKE_CASE（`SOURCE_LABEL`, `DISPLAY_WINDOW_DAYS`）
- **収集スクリプトのクラス**: PascalCase（`SlugBuilder`, `Deduplicator`, `MarkdownWriter`）
- **データフィールド**: コードは camelCase、frontmatter は snake_case（`publishedAt` ↔ `published_at`）
- **テスト**: `.test.ts`（ユニット）／`.pbt.test.ts`（プロパティベース）／`.spec.ts`（E2E）

## インポート構成

```typescript
import { Article } from "@/lib/article";      // 絶対パス（@/ エイリアス）
import { Header } from "@/components/header";
import sourceConfig from "@/config/sources";
```

**パスエイリアス**:
- `@/`: `next/` 直下（`tsconfig.json` の `"@/*": ["./*"]`）

相対パス（`../..`）は使わず、`@/` の絶対インポートに統一する。

## コード構成の原則

- **層の依存方向**: app → components / lib、components → lib、lib → lib / 外部パッケージ。循環依存を作らない
- **ロジックの集約**: ドメインロジックは `lib/` に集約。components はステートレスな消費者に徹し、page は最小限のオーケストレーション
- **収集層の独立**: `scripts/collector/` は config を共有しつつアプリのロジックには依存しない自己完結ドメイン
- **テスト併置**: テストは対象ソースと同じ場所に置く（E2E のみ `e2e/`）

---
_ディレクトリツリーではなくパターンを記載する。パターンに沿った新規ファイルは更新を要さない_
