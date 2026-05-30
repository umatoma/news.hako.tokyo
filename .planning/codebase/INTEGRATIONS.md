# 外部連携

**分析日:** 2026-05-30

## API・外部サービス

**ニュースソース（コレクター）:**

- **Zenn RSS** — `https://zenn.dev/feed`
  - 利用目的: 技術記事のフィード取得
  - クライアント: `rss-parser` ライブラリ
  - 実装: `next/scripts/collector/sources/zenn-rss-fetcher.ts`
  - 設定: `next/config/sources.ts`（`zenn.feedUrls`）
  - 認証: 不要

- **はてなブックマーク RSS** — `https://b.hatena.ne.jp/hotentry.rss`
  - 利用目的: ホットエントリー記事の取得
  - クライアント: `rss-parser` ライブラリ
  - 実装: `next/scripts/collector/sources/hatena-rss-fetcher.ts`
  - 設定: `next/config/sources.ts`（`hatena.feedUrls`）
  - 認証: 不要

- **Google News RSS** — `https://news.google.com/rss/search?q=...` / `https://news.google.com/news/rss/headlines/section/topic/...`
  - 利用目的: 検索クエリ・トピック・地域別ニュースの取得
  - クライアント: `rss-parser` ライブラリ
  - 実装: `next/scripts/collector/sources/google-news-rss-fetcher.ts`
  - 設定: `next/config/sources.ts`（`googlenews.queries`, `googlenews.topics`, `googlenews.geos`）
  - 認証: 不要（公開 RSS エンドポイント）

- **Togetter** — `https://togetter.com/ranking`
  - 利用目的: ランキングページからまとめ記事をスクレイピング
  - クライアント: `cheerio` ライブラリ（HTML スクレイピング）
  - 実装: `next/scripts/collector/sources/togetter-scraper.ts`
  - 設定: `next/config/sources.ts`（`togetter.targetUrls`）
  - 認証: 不要
  - 備考: リクエスト間隔制御あり（デフォルト 5000ms）

**フォント:**

- **Google Fonts (Geist / Geist Mono)** — `next/font/google` 経由
  - 利用目的: UI フォント
  - 実装: `next/app/layout.tsx`
  - 認証: 不要

## データストレージ

**データベース:**
- 使用なし（データベース不採用）

**ファイルストレージ:**
- ローカルファイルシステム — `content/` ディレクトリ（Markdown ファイル形式で記事を永続化）
  - ファイル名パターン: `YYYY-MM-DD-<slug>.md`
  - フロントマター形式: `gray-matter` ライブラリで読み書き
  - 書き込み: `next/scripts/collector/lib/markdown-writer.ts`
  - 読み込み: `next/lib/articles.ts`（`FsArticleRepository` クラス）

**キャッシュ:**
- 使用なし（明示的なキャッシュ層なし）

**コレクター実行結果 JSON:**
- `next/collector-result.json` — 直近実行の統計情報（フォーマット: `CollectorRunResult`）
  - `next/scripts/collector/lib/job-summary-reporter.ts` で書き出し
  - GitHub Actions アーティファクトとして 30 日間保持（`.github/workflows/collect.yml`）

## 認証・ID 管理

- 認証プロバイダー: 使用なし（認証機能なし）
- ユーザー管理: なし（個人用ニュース集約サイト）

## モニタリング・オブザーバビリティ

**エラートラッキング:**
- 外部サービスなし

**ログ:**
- コレクターは独自の `Logger` インターフェースを使用（`next/scripts/collector/logger.ts`）
- `DefaultLogger` が `console.info` / `console.warn` / `console.error` へ書き出し
- GitHub Actions ジョブサマリーへの Markdown レポート出力（`GITHUB_STEP_SUMMARY` 環境変数経由）

## CI/CD・デプロイ

**ホスティング:**
- 明示的なデプロイ設定なし（Next.js 標準の出力形式）

**CI パイプライン:**
- GitHub Actions
  - `ci.yml` — push/PR 時に静的チェック（lint・型チェック・ユニットテスト）→ ビルド → E2E テストを順次実行
  - `collect.yml` — 毎日 UTC 22:00（JST 07:00）に定期実行、もしくは手動トリガーでコレクターを起動し `content/` の変更を自動コミット＆プッシュ
  - gitleaks によるシークレットスキャン（`ci.yml`）
  - `npm audit` によるセキュリティ脆弱性チェック（`ci.yml`、`continue-on-error: true`）

**GitHub Actions 利用シークレット・権限:**
- `GITHUB_TOKEN`（gitleaks アクション向け）
- `collect.yml` は `contents: write` 権限を使用（自動コミットプッシュのため）

## Webhook・コールバック

**受信:**
- なし

**送信:**
- なし（外部への Webhook 送信はない）

## 環境変数一覧

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `CONTENT_DIR` | コンテンツディレクトリパスの上書き | 任意（デフォルト: `../content`） |
| `GITHUB_STEP_SUMMARY` | GitHub Actions ジョブサマリーファイルパス | CI のみ |
| `CI` | CI 環境判定フラグ（Playwright 挙動切り替え） | CI のみ |

---

*外部連携監査: 2026-05-30*
