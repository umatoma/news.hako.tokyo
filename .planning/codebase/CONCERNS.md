# コードベース上の懸念事項

**分析日:** 2026-05-30

## 技術的負債

**Togetter スクレイパーの CSS セレクター依存:**
- 問題: `a[href*="/li/"]` という汎用的な href パターンマッチングに依存してページを解析している。Togetter がサイト構造を変更した場合、0 件抽出となりエラーがスローされる
- ファイル: `next/scripts/collector/sources/togetter-scraper.ts`
- 影響: 抽出件数が 0 件になった際は `throw new Error(...)` を発生させて warns として absorb されるが、**新しいコンテンツが収集されない静かな劣化**として現れる
- 修正方針: セレクターが変化しても機能するよう複数セレクターへのフォールバックを実装し、0 件時の通知・アラートを強化する

**`as never` による型安全の回避:**
- 問題: `rss-parser` の `customFields` に型不一致があり `as never` キャストで回避している
- ファイル: `next/scripts/collector/sources/rss-mapping.ts` (47行目)
- 影響: `rss-parser` の型定義が変更された場合、実行時エラーが型チェックで検出されない
- 修正方針: `rss-parser` の実際の型定義を確認し、適切な型エイリアスを定義して `as never` を除去する

**`collect.yml` の `git push origin HEAD:main` (競合リスク):**
- 問題: コレクターが毎日 22:00 UTC に実行され `content/` への変更を直接 main に push する。手動 push と同時実行された場合、push が失敗する（ただし force push ではないため破壊的ではない）
- ファイル: `.github/workflows/collect.yml` (61行目)
- 影響: 収集実行が失敗した場合、その日のニュースが収集されない
- 修正方針: push 失敗時のリトライロジックの追加、またはキュー方式（pull request 経由）の検討

**`Deduplicator.initialize()` の Zod `parse()` がエラー時に全体クラッシュ:**
- 問題: `ArticleFrontmatterSchema.parse(parsed.data)` は検証失敗時に例外をスローし、catch されない。既存の content ファイルのフロントマターが壊れていると、コレクター全体が起動不能になる
- ファイル: `next/scripts/collector/lib/deduplicator.ts` (32行目)
- 影響: 1 つの不正な content ファイルが全収集処理をブロックする
- 修正方針: `safeParse()` を使用してエラーをスキップし、不正ファイルを警告ログに記録するよう変更する

**`MarkdownWriter.write()` のエラーを無言で `skipped` カウントに集計:**
- 問題: `write()` メソッド内の `catch {}` ブロックはエラーを完全に無視して `skipped += 1` とカウントするだけで、エラー内容をログに記録しない
- ファイル: `next/scripts/collector/lib/markdown-writer.ts` (49行目)
- 影響: ファイルシステムエラーやエンコードエラーが静かに失われ、デバッグが困難になる
- 修正方針: `catch (err) { logger.warn(...); skipped += 1; }` のようにエラーを記録する（ただし `MarkdownWriter` は現在 `logger` 依存を持たないため引数追加が必要）

**`FileReader` インターフェースが `lib/articles.ts` と `lib/file-system.ts` に重複定義:**
- 問題: 同名・同シグネチャの `FileReader` インターフェースが 2 か所に独立して定義されている
- ファイル: `next/lib/articles.ts` (127-131行目), `next/scripts/collector/lib/file-system.ts` (4-8行目)
- 影響: どちらかを変更した際に片方が追従できず型不一致が生じる可能性がある
- 修正方針: 共通の型定義を `lib/article.ts` または専用の型ファイルに移動して単一定義にする

**`npm audit` が `continue-on-error: true` で非ブロッキング:**
- 問題: CI の `npm-audit` ジョブは `continue-on-error: true` で設定されており、脆弱性を検出しても CI はグリーンのままとなる
- ファイル: `.github/workflows/ci.yml` (85行目)
- 影響: moderate 以上の既知の脆弱性がサイレントに放置される
- 修正方針: `continue-on-error: false` にして CI を失敗させるか、定期的な audit レポート通知の仕組みを設ける

## 既知のバグ

**古い `published_at` を持つ content ファイルが表示窓に混入する可能性:**
- 症状: `content/` には `published_at: '2017-10-20T00:16:15.000Z'` など数年前の日付を持つファイルが存在する（6 件確認）。`filterFileNamesByDatePrefix` はファイル名の日付プレフィックスでスクリーニングするが、ファイル名の日付と `published_at` メタデータの日付が一致しない場合、意図しないアーティクルが表示される可能性がある
- ファイル: `next/lib/articles.ts` (88-98行目), `content/2017-10-20-u89zirmg.md` ほか
- 発生条件: ファイル名日付が閾値以内だが内部の `published_at` が数年前であるアーティクルが存在した場合（現在は実害なし）
- 対処: `filterFileNamesByDatePrefix` のスクリーニングは最適化用途であるため、`filterArticlesWithinDays` での二重フィルタリングが実際の防衛線となっている。ただし古いファイルのメンテナンス手順が未定

## セキュリティ上の考慮事項

**HTTP Security Headers が未設定:**
- リスク: `next.config.ts` が空の設定オブジェクトのみで、`Content-Security-Policy`、`X-Frame-Options`、`X-Content-Type-Options`、`Referrer-Policy` などのセキュリティヘッダーが設定されていない
- ファイル: `next/next.config.ts`
- 現在の緩和措置: サイトは個人用静的コンテンツサイトで認証不要のため、直接的なリスクは低い
- 推奨対応: `next.config.ts` の `headers()` 関数でセキュリティヘッダーを設定する

**OGP / SNS メタデータが未設定:**
- リスク: `app/layout.tsx` の `metadata` はタイトルと description のみで、`og:image`、`og:url`、`twitter:card` などが設定されていない
- ファイル: `next/app/layout.tsx`
- 影響: SNS シェア時の外観が意図通りにならない（セキュリティ上の直接リスクではないが関連事項として記録）

**`DEFAULT_USER_AGENT` がブラウザ偽装 User-Agent を使用:**
- リスク: `DefaultHttpClient` は `Mozilla/5.0 ... Chrome/140.0.0.0 ...` をデフォルト User-Agent として使用する。これは Togetter スクレイピングのためのブラウザ偽装であり、対象サービスの利用規約に抵触する可能性がある
- ファイル: `next/scripts/collector/lib/http-client.ts` (17-18行目)
- 現在の緩和措置: なし
- 推奨対応: ソース種別ごとに適切な User-Agent を設定できる仕組みを検討する

**`SecretScrubber` のパターンが限定的:**
- リスク: `SECRET_PATTERNS` は Bearer トークン、Authorization ヘッダー、一般的なシークレットキーをスクラブするが、Google News API URL に含まれる `ceid` / `hl` / `gl` パラメータや RSS フィード URL 自体はスクラブされない（これらは公開情報であるため実害は低い）
- ファイル: `next/scripts/collector/lib/secret-scrubber.ts`
- 現在の緩和措置: 現在の設定に機密情報は含まれていない

## パフォーマンスボトルネック

**`Deduplicator.initialize()` がコレクター起動時に全 content ファイルを逐次読み込み:**
- 問題: 現在 878 件のファイルを 1 件ずつ読み込んで gray-matter パースと Zod 検証を行う。ファイル数増加とともに起動時間が線形に増大する
- ファイル: `next/scripts/collector/lib/deduplicator.ts` (25-38行目)
- 現在の影響: 878 件で約 1〜3 秒程度と推定（GitHub Actions の 10 分タイムアウトには余裕あり）
- スケーリング限界: 数万件規模になると顕著な遅延が生じる
- 改善方針: 既知 URL のキャッシュファイル（例: `known-urls.json`）を維持することでフル再スキャンを回避する、またはコンテンツ DB への移行を検討する

**`FsArticleRepository` が毎リクエストにファイルシステムを完全スキャン:**
- 問題: `getArticlesPublishedSince()` は `filterFileNamesByDatePrefix` でファイル名をフィルタリングするが、その前に `listMarkdownFiles` で全ファイルの一覧取得が必要。Next.js のビルドキャッシュや `revalidate` 設定がないため、デプロイのたびに（または ISR なしの場合は都度）全スキャンが実行される
- ファイル: `next/lib/articles.ts` (193-212行目), `next/app/page.tsx`
- 現在の影響: Static Site Generation（ビルド時 1 回の実行）であれば問題なし
- リスク: SSR モードに切り替えた場合はリクエストごとにフルスキャンが発生する

## 脆弱な領域

**Togetter HTML パーサーの外部依存:**
- ファイル: `next/scripts/collector/sources/togetter-scraper.ts`
- 脆弱な理由: HTML 構造を CSS セレクターで解析しており、Togetter のサイトリニューアルや A/B テストによるマークアップ変更で即座に機能停止する。0 件抽出の場合のみエラーとなり、部分的なマークアップ変更は検出されない可能性がある
- 安全な変更方法: `parseCategoryPage` の単体テストを充実させ、実際の HTML スナップショットをフィクスチャとして保持する
- テストカバレッジ: `next/scripts/collector/test/sources/togetter-scraper.test.ts` に基本テストが存在するが、フィクスチャ HTML は限定的

**コレクターワークフローの直接 main push:**
- ファイル: `.github/workflows/collect.yml`
- 脆弱な理由: コレクターが main ブランチに直接 push するため、バグのあるアーティクルデータや壊れた frontmatter が直接本番に反映される可能性がある
- 安全な変更方法: プルリクエスト経由のレビュープロセスの追加を検討（ただし自動収集の性質上トレードオフあり）

**`content/` ディレクトリのサイズ増大によるリポジトリ肥大化:**
- ファイル: `content/` (現在 878 件、3.4MB)
- 脆弱な理由: コレクターが日次で実行され `content/` に無期限に追記される。削除ポリシーが存在しない。git リポジトリのサイズが際限なく増大し、clone 時間と CI 実行時間が長くなる
- 現在の影響: `fetch-depth: 0` で全履歴フェッチしているため、リポジトリ肥大化は collect ワークフローの実行時間に直接影響する
- 修正方針: 一定期間（例: 90 日）以前のコンテンツを自動削除するワークフローの追加、または shallow clone の活用

## スケーリング上の制約

**GitHub Actions の無料枠依存:**
- 現在の容量: 日次 1 回収集、最大 10 分のタイムアウト設定
- 限界: 収集頻度を上げたい場合（例: 1 時間ごと）は GitHub Actions の無料枠を超過する可能性がある
- スケーリング方針: 有料プランへの移行、または別のスケジューラー（AWS Lambda, Cloudflare Workers など）への移行

**`content/` ファイルベースのアーキテクチャの限界:**
- 現在の容量: 878 ファイル、3.4MB
- 限界: ファイル数が増加すると `listMarkdownFiles` の実行時間が増大する。数万件規模では実用的でなくなる可能性がある
- スケーリング方針: SQLite または外部データベースへの移行

## 欠落している重要な機能

**コンテンツ保持ポリシーの欠如:**
- 問題: `content/` ディレクトリへの追記のみで、古いコンテンツを削除する仕組みがない
- ブロッキング: リポジトリの長期的な肥大化を防げない
- 優先度: 中（現状では影響が少ないが、将来的に問題になる）

**記事の詳細ページが未実装:**
- 問題: アプリケーションはトップページ 1 ページのみで、記事詳細ページが存在しない。`summary`、`tags`、`thumbnailUrl` フィールドがコレクターで収集されるが UI では一切表示されていない
- ファイル: `next/app/page.tsx`, `next/components/article-list-item.tsx`
- ブロッキング: 収集データの活用が制限される

**フロントエンドの `revalidate` / ISR 設定が未構成:**
- 問題: `next/app/page.tsx` に `export const revalidate` が設定されていない。デプロイごとにビルドが必要で、コレクターが新コンテンツを push してもビルドが再実行されるまでページは更新されない（Vercel 等のデプロイ連動が前提）
- ファイル: `next/app/page.tsx`
- 影響: コレクター実行後に自動デプロイ連携がない場合、最新のニュースが反映されない

## テストカバレッジのギャップ

**`FsArticleRepository` の統合テスト欠如:**
- 未テスト内容: `FsArticleRepository.getAllArticles()` と `getArticlesPublishedSince()` の実ファイルシステムを使った動作
- ファイル: `next/lib/articles.ts` (179-215行目)
- リスク: `NodeFileReader` と `FsArticleRepository` の統合部分での回帰バグを検出できない
- 優先度: 中

**`app/page.tsx` のサーバーコンポーネントロジックのテスト欠如:**
- 未テスト内容: `DISPLAY_WINDOW_DAYS`、`PREFETCH_MARGIN_DAYS` の定数値と `filterArticlesWithinDays` の連携動作
- ファイル: `next/app/page.tsx`
- リスク: 表示窓の変更が意図しない動作を引き起こしても E2E テスト以外で検出できない
- 優先度: 低（ロジックの大部分は `lib/articles.ts` のテストでカバー済み）

**Togetter スクレイパーのリアル HTML フィクスチャが限定的:**
- 未テスト内容: Togetter のマークアップ変更シナリオ（ランキングページ vs カテゴリページの構造差異）
- ファイル: `next/scripts/collector/test/sources/togetter-scraper.test.ts`
- リスク: サイト変更時の検出が遅れる
- 優先度: 高（最も壊れやすいコンポーネント）

---

*懸念事項監査: 2026-05-30*
