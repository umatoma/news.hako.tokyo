# コードベースの懸念事項

**分析日:** 2026-05-30

---

## 技術的負債

### Togetter スクレイパーの公開日時が収集時刻の代用値

- **問題:** `parseCategoryPage` は RSS ではなく HTML をスクレイピングするため、記事の実際の公開日時を取得できない。代わりに `clock().toISOString()`（収集実行時刻）を `publishedAt` として使用している。
- **ファイル:** `next/scripts/collector/sources/togetter-scraper.ts`（行 103）
- **影響:** 表示ウィンドウのフィルタリング（`filterArticlesWithinDays`）が収集タイミングに依存してしまい、夜間バッチ以外のタイミングで実行すると記事が表示されない可能性がある。また、同一記事が複数回収集された場合に重複判定は URL ベースで正常動作するが、`publishedAt` の意味的な正確性が失われる。
- **修正方針:** Togetter の個別リストページの `<time>` 要素もしくは `og:article:published_time` メタタグをパースして実際の公開日時を取得する。取得できない場合のみ収集時刻にフォールバックする。

### `rss-mapping.ts` での `as never` 型アサーション

- **問題:** `rss-parser` の `customFields.item` に渡す配列を `as never` でキャストしている。これにより TypeScript の型チェックが無効化されている。
- **ファイル:** `next/scripts/collector/sources/rss-mapping.ts`（行 47）
- **影響:** `rss-parser` のバージョンアップや API 変更があっても型エラーで気付けない。
- **修正方針:** `rss-parser` の型定義を確認し、`CustomFields` 型を正しくキャストする。または型アサーションを `as unknown as CustomFields` 形式に変更して意図を明示する。

### `MarkdownWriter.write` のエラーが完全にサイレント

- **問題:** `write` メソッドの `catch {}` ブロックが例外を握りつぶし、`skipped += 1` するだけでエラー内容を記録しない。
- **ファイル:** `next/scripts/collector/lib/markdown-writer.ts`（行 49）
- **影響:** ファイル書き込みに失敗した記事の原因（権限エラー、ディスクフル等）が実行ログに出力されず、デバッグが困難になる。
- **修正方針:** `catch` 節でエラーをキャプチャし、`logger.warn` を通じて原因を記録する。`MarkdownWriter` は現在 `Logger` を持たないため、`deps` に `logger` を追加する必要がある。

### `compose-commit-message.cjs` が CommonJS のまま残存

- **問題:** コレクタースクリプト全体が TypeScript / ESM で統一されている中、コミットメッセージ生成スクリプトのみが CommonJS（`.cjs`）形式で書かれている。
- **ファイル:** `next/scripts/collector/compose-commit-message.cjs`
- **影響:** 技術スタックの二重管理、ESLint の `require()` ルールを明示的に除外する必要がある（`next/eslint.config.mjs` 参照）。
- **修正方針:** `tsx` 経由で実行できる TypeScript ファイルに移行する。

### `stripHtml` の HTML エンティティ処理が不完全

- **問題:** `rss-mapping.ts` の `stripHtml` は主要なエンティティ（`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`）のみをデコードしており、`&#160;`（数値参照）や `&mdash;`、`&hellip;` などの一般的なエンティティはデコードされない。
- **ファイル:** `next/scripts/collector/sources/rss-mapping.ts`（行 120–128）
- **影響:** summary フィールドに未デコードのエンティティ文字列がそのまま保存・表示される可能性がある。
- **修正方針:** Node.js の `html-entities` パッケージや `cheerio` の既存依存を利用してデコードするか、`DOMParser` 相当の処理を使用する。

### `__dirname` を TSX 実行環境で使用

- **問題:** `next/scripts/collector/index.ts` では `path.resolve(__dirname, "..", "..", "..")` でリポジトリルートを解決しているが、`__dirname` は CJS モジュール変数であり、ESM / `tsx` 実行環境での動作は `tsx` がポリフィルするため正常だが、ESM 標準では `import.meta.url` を使うべき。
- **ファイル:** `next/scripts/collector/index.ts`（行 7）
- **影響:** 現状は問題なく動作するが、将来的に `tsx` のポリフィル挙動が変わった場合にパス解決が壊れるリスクがある。
- **修正方針:** `import.meta.url` と `fileURLToPath` を使って書き換える。

---

## 既知のバグ

### Togetter 記事の重複 URL の `publishedAt` が異なる値になる

- **症状:** 収集バッチ間で同一の Togetter URL が収集されても deduplication（URL ベース）が正常に機能するが、初回収集時に収集時刻が `publishedAt` に入るため、再収集バッチのタイミングにより同一記事の `publishedAt` が異なる値として保存されていることがある（既存ファイルに上書きはしない設計なので問題はないが、意図した挙動ではない）。
- **ファイル:** `next/scripts/collector/sources/togetter-scraper.ts`（行 103）、`next/scripts/collector/lib/deduplicator.ts`
- **引き金:** Togetter が同一記事を異なる URL で公開した場合（例：リダイレクト前後の URL）には重複が通り抜ける可能性がある。
- **回避策:** なし（現状は上書き不可設計で実害は限定的）

---

## セキュリティの考慮事項

### `collect` ワークフローが `main` ブランチへの直接 push 権限を持つ

- **リスク:** `.github/workflows/collect.yml` は `permissions: contents: write` を設定し、スケジュール実行時に `git push origin HEAD:main` で直接 main へコミット・プッシュする。悪意のあるサードパーティ Action の侵害やワークフロートリガーの悪用（`workflow_dispatch` の不正利用）があった場合、main への任意コード書き込みが可能になる。
- **ファイル:** `.github/workflows/collect.yml`（行 14、61）
- **現在の緩和策:** `gitleaks` による秘密情報スキャンは CI で実施されている（`ci.yml`）。ただし `collect.yml` 自体には秘密情報スキャンはない。
- **推奨事項:** 可能であれば collect ワークフローからの直接 push を廃止し、Pull Request 経由のレビューフローへ移行する。最低限、`environment` 保護ルールで承認を必須にすることを検討する。

### `npm audit` が `continue-on-error: true` で運用されている

- **リスク:** CI の `npm-audit` ジョブは `continue-on-error: true` のため、脆弱な依存関係が検出されても CI が赤くならず、マージが止まらない。
- **ファイル:** `.github/workflows/ci.yml`（行 85）
- **現在の緩和策:** 検査自体は実行されており、GitHub の Security アラートで通知はされる。
- **推奨事項:** 既知の false positive がない場合は `continue-on-error` を削除して必須チェックにする。既知の問題がある場合は `npm audit --ignore` で個別除外する。

### `SecretScrubber` の正規表現パターンが限定的

- **リスク:** `SecretScrubber` が対象とするパターンは Authorization ヘッダーと一般的なキー名に限られており、Bearer 形式以外の API キーフォーマット（JWT のクレームや Base64 エンコードのシークレット等）はスクラブされない。
- **ファイル:** `next/scripts/collector/lib/secret-scrubber.ts`
- **現在の緩和策:** collector は現時点で認証を必要とする外部 API を使用していないため実害リスクは低い。
- **推奨事項:** 新しい認証付き API を追加する場合は `SecretScrubber` のパターンも同時に更新すること。

---

## パフォーマンスのボトルネック

### `Deduplicator.initialize()` が全 content ファイルを毎回読み込む

- **問題:** コレクター実行時に `content/` 以下の全 Markdown ファイルを読み込み、URL を Set に構築している。ファイル数が増加するほど初期化時間が増大する。
- **ファイル:** `next/scripts/collector/lib/deduplicator.ts`（行 25–38）
- **現状:** 878 ファイル時点での実行時間は `durationMs: 1797ms` と許容範囲内。
- **スケーリング上限:** ファイルが数万件を超えると初期化コストが顕著になる可能性がある。
- **改善パス:** SQLite や JSON インデックスファイルに既収集 URL をキャッシュする。または `content/` をサブディレクトリ（年月別）に分割し、`listMarkdownFiles` を直近数ヶ月分のみに限定する。

### `FsArticleRepository.getAllArticles` が全 content ファイルを読む

- **問題:** `page.tsx` では `getArticlesPublishedSince` を使い日付プレフィックスフィルタリングで I/O を削減しているが、`getAllArticles` は全ファイルを読む。現状は `getAllArticles` はテストでのみ利用されているが、ページ要件変更時に誤って使われるリスクがある。
- **ファイル:** `next/lib/articles.ts`（行 188–190）

### Next.js ページの `revalidate` 設定が未定義

- **問題:** `next/app/page.tsx` には `export const revalidate` の設定がない。Next.js のデフォルト動作（Full Route Cache + 静的レンダリング）に任せているが、コレクターが新しい記事を収集しても Next.js がキャッシュを自動で無効化しない可能性がある。
- **ファイル:** `next/app/page.tsx`
- **影響:** デプロイなしに最新記事が表示されないビルドになる可能性（デプロイがコンテンツ更新をトリガーする前提の場合は問題なし）。
- **推奨事項:** `export const revalidate = 0`（常に動的）または `export const revalidate = 3600`（1 時間 ISR）を明示的に設定する。

---

## 脆弱な箇所

### Togetter セレクター `a[href*="/li/"]` が HTML 構造変更に脆弱

- **ファイル:** `next/scripts/collector/sources/togetter-scraper.ts`（行 85）
- **壊れやすい理由:** CSS セレクターがサードパーティのサイト構造に依存しており、Togetter がナビゲーション構造やリンク形式を変更すると記事が 0 件になる。現在は `items.length === 0` の場合に例外をスローしてログに `warn` するが、収集失敗に気付くには CI/GitHub Actions のログを確認する必要がある。
- **安全な変更方法:** セレクターを変更する前に `togetter-scraper.test.ts` のフィクスチャ HTML を更新する。将来的に Togetter が公式 RSS を提供した場合はスクレイパーから RSS フェッチャーに移行する。
- **テストカバレッジ:** `next/scripts/collector/test/sources/togetter-scraper.test.ts` でセレクターのユニットテストは存在するが、Togetter の実際の HTML 構造変更は自動検知できない。

### `filterFileNamesByDatePrefix` が日付なしファイルを safe-include する

- **ファイル:** `next/lib/articles.ts`（行 92–98）
- **壊れやすい理由:** 日付プレフィックスを持たない Markdown ファイルがコンテンツディレクトリに置かれた場合、フィルタリング対象から除外されず常に読み込まれる。誤ったフロントマターを持つファイルが置かれると `readArticlesFromFiles` が例外をスローしてページ全体がクラッシュする。
- **安全な変更方法:** `content/` ディレクトリに日付プレフィックスのないファイルを置かない運用ルールを守る。

### ファイル名コリジョンのリトライが 99 回で停止

- **ファイル:** `next/scripts/collector/lib/markdown-writer.ts`（行 11、66–73）
- **壊れやすい理由:** 同一スラグのファイルが 99 件以上存在する（タイトルが ASCII 文字を持たない記事が大量に来た場合など）と `Error: Filename collision exceeded retry limit` で書き込みをスキップする。現状の `ID_FALLBACK_LENGTH = 8` だと衝突確率は低いが、理論上は発生しうる。
- **安全な変更方法:** 現状は `skipped += 1` でカウントされるがエラーログがないため発生しても気づけない（前述の「サイレント catch」問題に関連）。

---

## スケーリング上の制約

### `content/` ディレクトリが単一フラットディレクトリ

- **現状:** 878 ファイルが単一ディレクトリに存在する。
- **上限:** ファイルシステムによるが、数万件を超えると `readdir` の遅延や git の追跡コストが増大する。
- **スケーリングパス:** 年月別サブディレクトリ（例: `content/2026/05/`）に分割し、`listMarkdownFiles` のウォーキングロジックと `filterFileNamesByDatePrefix` を適応させる。

### コレクターが逐次実行（ソース間の並列化なし）

- **現状:** `runner.ts` の `for...of` ループでソースを逐次フェッチしている。
- **影響:** ソース数が増えると実行時間が線形増加する（現状 4 ソースで約 1.8 秒は許容範囲）。
- **改善パス:** 独立したソース間は `Promise.allSettled` を使って並列実行できる（Togetter の `requestIntervalMs` は自ソース内のみ適用）。

---

## 依存関係のリスク

### `rss-parser` のカスタムフィールド型が `as never` に依存

- **パッケージ:** `rss-parser@^3.13.0`
- **リスク:** メジャーバージョンアップで型定義が変わった場合、`as never` キャストにより型エラーを検出できずランタイムエラーになる可能性がある。
- **影響:** RSS の `media:content` / `media:thumbnail` フィールドの取得が壊れると `thumbnailUrl` が常に `null` になる。
- **移行計画:** メジャーバージョンアップ時は `rss-mapping.ts` のキャストをレビューする。

### `next@16.2.4` が最新の Next.js とは異なる可能性

- **パッケージ:** `next@16.2.4`（`next/AGENTS.md` に「This version has breaking changes」との注記あり）
- **リスク:** 標準的な Next.js 15 系の知識や慣習が適用できないため、新規開発者がドキュメントを参照せずに作業すると非互換な実装をする可能性がある。
- **現在の緩和策:** `next/AGENTS.md` で明示的な警告が記載されている。

---

## テストカバレッジのギャップ

### `builder.ts` の統合組み立てがテストされていない

- **未テストの領域:** `buildRunner` 関数が各依存オブジェクトを正しく組み立てることの統合テストが存在しない。
- **ファイル:** `next/scripts/collector/builder.ts`
- **リスク:** 新しいソースや依存を追加した際の配線ミスがランタイムまで検出されない。
- **優先度:** 低（個別コンポーネントはテスト済みで、実際の配線はシンプル）

### `JobSummaryReporter` の GitHub Actions サマリー出力がテストされていない

- **未テストの領域:** `appendSummary` が `GITHUB_STEP_SUMMARY` に実際に書き込む部分は本番環境でのみ実行される。
- **ファイル:** `next/scripts/collector/lib/job-summary-reporter.ts`（行 53–57）
- **リスク:** Markdown フォーマットの変更で GitHub の UI 表示が崩れても CI では検出できない。
- **優先度:** 低（`renderJobSummary` の単体テストは有効）

### フロントエンドコンポーネントの単体テストが存在しない

- **未テストの領域:** `next/components/` 以下の 6 コンポーネントはすべて E2E テスト（Playwright）のみで検証されており、コンポーネント単体テスト（Vitest + React Testing Library 等）が存在しない。
- **ファイル:** `next/components/*.tsx`
- **リスク:** E2E テストは起動コストが高くフィードバックが遅い。コンポーネントのロジック変更時に迅速に検出できない。
- **優先度:** 中（現状のコンポーネントは表示専用で複雑なロジックはないが、今後の機能追加時にリスクが高まる）

---

*懸念事項の監査: 2026-05-30*
