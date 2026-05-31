# 外部連携

**分析日:** 2026-05-30

## API・外部サービス

**ニュースソース (RSS フィード):**
- Zenn (`https://zenn.dev/feed`) — 技術記事 RSS フィード
  - クライアント: `rss-parser` ライブラリ
  - 認証: なし (公開フィード)
  - 実装: `next/scripts/collector/sources/zenn-rss-fetcher.ts`
- はてなブックマーク (`https://b.hatena.ne.jp/hotentry.rss`) — ホットエントリ RSS フィード
  - クライアント: `rss-parser` ライブラリ
  - 認証: なし (公開フィード)
  - 実装: `next/scripts/collector/sources/hatena-rss-fetcher.ts`
- Google News RSS (`https://news.google.com/rss/search`, `https://news.google.com/news/rss/headlines/section/topic/...`) — トピック・クエリ・地域別フィード
  - クライアント: `rss-parser` ライブラリ (生の XML を Node.js `fetch` で取得後にパース)
  - 認証: なし (公開フィード)
  - 実装: `next/scripts/collector/sources/google-news-rss-fetcher.ts`

**Webスクレイピング:**
- Togetter ランキング (`https://togetter.com/ranking`) — HTML スクレイピングで記事リストを取得
  - クライアント: `cheerio` ライブラリ (HTML パース)、Node.js `fetch` (HTTP)
  - 認証: なし
  - レートリミット: リクエスト間隔 5000ms (設定値 `requestIntervalMs`)
  - 実装: `next/scripts/collector/sources/togetter-scraper.ts`

**フォント:**
- Google Fonts (Geist Sans / Geist Mono) — Next.js `next/font/google` によりビルド時にセルフホスト化
  - 実装: `next/app/layout.tsx`

## データストレージ

**データベース:**
- なし — すべての記事データはファイルシステム上の Markdown ファイルとして管理

**ファイルストレージ:**
- ローカルファイルシステム / Git リポジトリ上の `content/` ディレクトリ
  - 形式: YAML frontmatter 付き Markdown ファイル (`{publishedAt-date}-{slug}.md`)
  - 読み取り: `next/lib/articles.ts` の `FsArticleRepository`
  - 書き込み: `next/scripts/collector/lib/markdown-writer.ts` の `MarkdownWriter`
  - 環境変数: `CONTENT_DIR` (未設定時は `../content` を使用)

**キャッシュ:**
- なし

## 認証・アイデンティティ

**認証プロバイダ:**
- なし — 公開サイト、ユーザー認証機能なし

## 監視・オブザーバビリティ

**エラートラッキング:**
- なし

**ログ:**
- カスタム `Logger` インターフェース + `DefaultLogger` 実装 (`next/scripts/collector/logger.ts`) — collector スクリプト内でのみ使用
- 出力先: コンソール (stdout/stderr)

**GitHub Actions ジョブサマリー:**
- `GITHUB_STEP_SUMMARY` 環境変数が設定されている場合、`JobSummaryReporter` がコレクターの実行結果を Markdown でサマリーに書き込む
- 実装: `next/scripts/collector/lib/job-summary-reporter.ts`

**コレクター実行結果 JSON:**
- `next/collector-result.json` に実行結果を出力 (Git 管理外)
- GitHub Actions で `collector-result-{run_id}` アーティファクトとして 30 日間保存

## CI/CD・デプロイ

**ホスティング:**
- `.gitignore` に `.vercel` が含まれているため Vercel が候補だが、デプロイ設定ファイルは現時点で未コミット

**CI パイプライン (GitHub Actions):**
- `ci.yml` — push/PR 時に実行
  - `static-checks` ジョブ: `npm run lint` → `tsc --noEmit` → `npm run test:run`
  - `build` ジョブ: `npm run build` (static-checks 完了後)
  - `e2e` ジョブ: Playwright テスト (build 完了後、Chromium のみ)
  - `gitleaks` ジョブ: シークレット漏洩スキャン (`gitleaks/gitleaks-action@v2`)
  - `npm-audit` ジョブ: 脆弱性チェック (continue-on-error: true)
- `collect.yml` — 毎日 UTC 22:00 (JST 07:00) にスケジュール実行・手動実行可
  - `npm run collect` → `content/` に変更があれば自動 commit & push
  - `compose-commit-message.cjs` でコミットメッセージを生成

## Webhook・コールバック

**受信:**
- なし

**送信:**
- なし

## 環境変数

**必須:**
- なし (すべてデフォルト値あり)

**任意:**
- `CONTENT_DIR` — 記事ファイルの配置ディレクトリパス (デフォルト: `../content`)
- `GITHUB_STEP_SUMMARY` — GitHub Actions 提供変数、ジョブサマリーへの書き込みに使用

**シークレット:**
- GitHub Actions の `GITHUB_TOKEN` — `collect.yml` で `git push` 時に使用 (GitHub 自動提供)

---

*連携監査: 2026-05-30*
