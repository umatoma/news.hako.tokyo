# NFR Requirements Plan — Unit 1: Collector

**Project**: news.hako.tokyo
**Unit**: U1 (News Collection Service / Collector)
**Stage**: CONSTRUCTION — NFR Requirements
**Created**: 2026-04-25

このプランは Unit 1 (Collector) の **非機能要件 (NFR) と技術スタック選定** を確定するための計画書と質問群を兼ねます。本プロジェクト全体の NFR (`requirements.md` §4) は既に確定していますので、本ステージでは **Collector 固有の追加 NFR / 残り Open Questions の解消 / 具体ライブラリ選定** に絞ります。

---

## Tracking Checklist

- [x] Step 1: Analyze functional design (`aidlc-docs/construction/collector/functional-design/` 読込)
- [x] Step 2: Create NFR requirements plan (this file)
- [x] Step 3: Generate context-appropriate questions
- [x] Step 4: Store plan
- [ ] Step 5: Collect and analyze answers
- [ ] Step 6: Generate NFR requirements artifacts
- [ ] Step 7: Present completion message
- [ ] Step 8: Approval
- [ ] Step 9: Record approval and update progress

---

## 既存の確定済み NFR (再掲: 変更なし)

| ID | 概要 |
|---|---|
| NFR-01 | パフォーマンス: ビルド 2〜5 分以内、トラフィック 1 日数十アクセス |
| NFR-02 | SEO: 不要、`robots.txt: Disallow: /` |
| NFR-03 | セキュリティ最低限: API キー Secrets 化、`.env.local` `.gitignore`、`gitleaks`、`npm audit` |
| NFR-04 | テスト: Vitest + fast-check (Partial) + Playwright |
| NFR-05 | CI/CD: GitHub Actions 完全自動化 |
| NFR-06 | 期間: 1〜2 週間で MVP |
| NFR-07 | アクセシビリティ: Tailwind 標準維持 |
| NFR-08 | 保守性: TypeScript strict、ESLint、設定単一ファイル集約 |

## 関連する Open Questions

- **OQ-01**: Togetter スクレイピングの規約・robots.txt 確認 → **本ステージで方針確定**
- **RISK-02**: Google ニュース RSS 非公式仕様 → 本ステージで運用上の対応方針を確定

## PBT (Partial) — 本ステージでの再確認

- PBT-09 (Framework Selection): Vitest + fast-check ✅ 既確定。本ステージでは具体バージョン確定。

---

## NFR Requirements Questions

回答方法は前回までと同じく **`[Answer]:`** タグの後にアルファベットを記入してください。**「D) おまかせ」または「D に類する選択肢」を選ぶと推奨案を採用** します。

---

### Question 1: Togetter 利用規約・robots.txt の確認結果 (OQ-01 / RISK-01)

Togetter のスクレイピング (Functional Design Q7=A: カテゴリ別人気まとめページ) について、利用規約および `https://togetter.com/robots.txt` の確認結果はどうでしたか?

A) **確認済み・問題なし** — スクレイピング可。`requestIntervalMs: 5000ms` 程度を遵守し User-Agent を明示すれば許容範囲。MVP に含める。
B) **確認済み・条件付き OK** — 限定的に可 (例: 特定カテゴリのみ、件数を絞る)。詳細は自由記述で指示してください。
C) **未確認・MVP では除外** — 規約確認に時間がかかるため、`TogetterConfig.enabled = false` で MVP リリース。確認後の Phase 2 で有効化。
D) **未確認・自分で確認したい** — このやり取りを一旦保留し、後ほど確認結果を伝える。
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: CollectorRunner 1 回の実行時間予算

GitHub Actions 上での 1 回の収集ジョブにかける時間の目安は?

A) **5 分以内** (既定で十分。各 Adapter から計 ~140 件取得 + I/O が主。タイムアウトは Adapter ごと 30 秒で設定)
B) **10 分以内** (大量取得時の余裕)
C) **GitHub Actions の cron job のデフォルト 6 時間まで許容** (極端な余裕、現実には不要)
D) **おまかせ** — 推奨 (A の 5 分以内) を採用、Adapter ごと HTTP タイムアウト 30 秒 / 全体タイムアウトは設定なし
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3: 失敗時のリトライ戦略

Adapter / HTTP リクエストの失敗時、リトライしますか?

A) **リトライなし** (MVP 方針: BR-50 の失敗継続戦略と整合、シンプルさ優先。1 日 1 回 cron なので、明日の実行で結果オーライ)
B) **HTTP 取得のみ 1 回だけ retry** (一時的なネットワーク不調を吸収、指数バックオフは無し)
C) **HTTP 取得を最大 3 回 retry + 指数バックオフ** (より堅牢、ただし複雑度増)
D) **おまかせ** — 推奨 (A のリトライなし) を採用
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4: 依存ライブラリの選定確認

Functional Design で選んだ依存ライブラリを最終確認します。以下の **全て** を採用で良いですか?

| 用途 | ライブラリ |
|---|---|
| RSS パース | `rss-parser` (Q1=A) |
| frontmatter (YAML) シリアライズ / パース | `gray-matter` |
| frontmatter スキーマ検証 | `zod` (Q2=A) |
| HTML スクレイピング | `cheerio` |
| TypeScript 直接実行 (collector エントリ) | `tsx` |
| ハッシュ生成 (Article id) | Node.js 標準 `node:crypto` (依存追加なし) |
| 単体テスト | `vitest` (NFR-04) |
| Property-Based Testing | `fast-check` (NFR-04) |

A) **そのまま採用** — 上記の組み合わせで OK
B) **gray-matter ではなく `js-yaml` を直接使う** — frontmatter は `--- ... ---` を自前で切り出して `js-yaml` でパース。依存が少なく済む
C) **cheerio ではなく `linkedom` を採用** — DOM 標準互換、より軽量
D) **個別に変更したい** — 自由記述で指示
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5: 依存ライブラリのバージョン管理戦略

`package.json` の依存ライブラリのバージョン指定をどうしますか?

A) **既定の Caret (^) — 互換 minor / patch を許容** (npm のデフォルト挙動、新規依存追加時に十分)
B) **完全固定 (^なし) — 厳密一致** (再現性最優先、ただし手動更新が必要)
C) **Tilde (~) — patch のみ許容** (バランス案)
D) **おまかせ** — 推奨 (A) を採用、`package-lock.json` をコミットするので実質再現性は確保
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 6: CI で実行する追加セキュリティチェック (NFR-03 の具体化)

要件 NFR-03 で挙げた `gitleaks` / `npm audit` を CI で具体的にどう運用しますか?

A) **両方を毎 CI で実行 (PR 時 + main push 時) — 違反は CI 失敗とする** (厳密)
B) **両方を毎 CI で実行するが、`npm audit` は警告レベルのみ通知 (CI は緑のまま)** (バランス。脆弱性は通知されるが PR ブロックしない)
C) **`gitleaks` のみ毎 CI、`npm audit` は週次のスケジュール job** (頻度を分ける)
D) **おまかせ** — 推奨 (B) を採用 (= secrets リークのみ厳格、依存脆弱性は通知)
X) その他 (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 7: collector-result.json の保存先と扱い

Functional Design Q6=C で確定した `collector-result.json` をどう取り回しますか?

A) **リポジトリルートに出力、`.gitignore` で除外、GitHub Actions の artifact として upload** — 後から CI 上で結果確認可能。MVP 推奨。
B) **リポジトリルートに出力するが、artifact upload なし** — ローカル実行時のデバッグ用のみ
C) **GitHub Actions の `$GITHUB_STEP_SUMMARY` に整形して書く** (Job Summary に表示) + artifact upload
D) **おまかせ** — 推奨 (C) を採用 (Job Summary で視認 + artifact で保管)
X) その他 (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 8: テストの目標カバレッジ

Unit 1 のテストカバレッジの目標は?

A) **数値目標なし、重要モジュールに集中** (Adapter / Deduplicator / SlugBuilder / MarkdownWriter は厚め、Runner は統合テストで担保)
B) **行カバレッジ 70% 以上を目標、CI で測定するが gate にはしない**
C) **行カバレッジ 80% 以上を目標、CI で gate にする**
D) **おまかせ** — 推奨 (A) を採用 (個人プロジェクトでは数値より質)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 9: ロガー実装の選定

Q6=C のロギング (stdout プレーン + collector-result.json) を実装するロガーは?

A) **シンプルな自作ヘルパ関数** (`logger.info(source, msg, extra?)` 等の薄い wrapper) — 依存追加なし、要件に十分
B) **`pino`** — 高速 JSON ロガー、ecosystem 豊富 (やや過剰の可能性)
C) **`consola`** — ハンディな CLI 向けロガー
D) **おまかせ** — 推奨 (A の自作) を採用 (依存最小化)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 10: GitHub Actions cron の細かいスケジュール

毎朝 7:00 JST = 22:00 UTC (前日) の cron 式について以下のいずれを採用しますか?

A) **`0 22 * * *`** (毎日 22:00 UTC = 翌 07:00 JST) — シンプルかつ要件 FR-03 と一致
B) **`*/30 22 * * *`** (22:00〜22:30 UTC の間に 1 回) — Actions のキュー混雑時を考慮し時間幅を持たせる
C) **`0 22,23 * * *`** (1 日 2 回 — 22:00 + 23:00 UTC) — 念のため
D) **おまかせ** — 推奨 (A の `0 22 * * *`) を採用
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。回答内容に矛盾や曖昧さが見られた場合、追加の確認質問をお出しします。
