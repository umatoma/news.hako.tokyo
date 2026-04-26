# NFR Requirements Plan — Unit 2: Web Frontend

**Project**: news.hako.tokyo
**Unit**: U2 (Web Frontend / News Listing Service)
**Stage**: CONSTRUCTION — NFR Requirements
**Created**: 2026-04-26

プロジェクト全体の NFR-01〜08 (`requirements.md` §4) と Unit 1 の NFR は既に確定しています。本ステージでは **Unit 2 固有の追加 NFR / 残り Open Questions の解消 / 具体ライブラリ選定** に絞り、**質問は 4 問のみ** とします。

---

## Tracking Checklist

- [x] Step 1: Analyze functional design (`aidlc-docs/construction/web-frontend/functional-design/` 読込)
- [x] Step 2: Create NFR requirements plan (this file)
- [x] Step 3: Generate context-appropriate questions (4 問のみ)
- [x] Step 4: Store plan
- [ ] Step 5: Collect and analyze answers
- [ ] Step 6: Generate NFR requirements artifacts
- [ ] Step 7: Present completion message
- [ ] Step 8: Approval
- [ ] Step 9: Record approval and update progress

---

## 既に確定済みの NFR (再掲)

| ID | 概要 | Unit 2 への適用 |
|---|---|---|
| NFR-01 | パフォーマンス: ビルド 2〜5 分以内、トラフィック 1 日数十アクセス | ✅ Unit 2 が主担当 |
| NFR-02 | SEO: 不要、`robots.txt: Disallow: /` | ✅ Unit 2 で `next/public/robots.txt` を配置 |
| NFR-04 | テスト: Vitest + fast-check (Partial) + Playwright | ✅ Vitest は Unit 1 確定済、Playwright は本ステージで導入 |
| NFR-05 | CI/CD: GitHub Actions 完全自動化 | ✅ `.github/workflows/ci.yml` (lint + typecheck + test + E2E) を Unit 2 Infrastructure Design で確定 |
| NFR-07 | アクセシビリティ: Tailwind 標準維持 | ✅ Unit 2 で実装 |
| NFR-08 | 保守性: TypeScript strict、ESLint、設定単一ファイル集約 | ✅ 既存設定を継続 |

## 関連する Open Questions

- **OQ-03**: Vercel preview URL の E2E 取り回し → **本ステージ + Infrastructure Design で確定**
- 既に解消済: OQ-01, OQ-02, OQ-04, OQ-05

---

## NFR Requirements Questions (4 問のみ)

回答方法は前回までと同じく **`[Answer]:`** タグの後にアルファベットを記入してください。「**D) おまかせ**」を選ぶと推奨案を採用します。

---

### Question 1: E2E テストの実行対象 (OQ-03 の主要部分)

Playwright で E2E テストを実行する際、どこに対して実行しますか?

A) **ローカルビルド + `next start`** — CI で `next build && next start &` を立てて Playwright が `localhost:3000` をテスト。Vercel に依存せず最速・確実。
B) **Vercel preview URL** — PR 時に Vercel が発行する preview URL を Playwright が叩く。本番に近いが、Vercel 連携のセットアップが必要。
C) **両方** — 通常は A、main ブランチ push 後に B でも検証
D) **おまかせ** — 推奨 (A) を採用 (シンプル + 確実、MVP で必要十分)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: E2E テストの観点

MVP の E2E テストはどの範囲をカバーしますか?

A) **最小限** — 一覧ページが表示される / 各記事のリンクが `target="_blank"` で開く / 件数ヘッダーが表示される
B) **標準** — A + 空状態 UI / ダーク / ライトテーマ確認 / 50 件以上のスクロール表示
C) **広範** — B + アクセシビリティスキャン (axe-core 連携) / Lighthouse スコア閾値
D) **おまかせ** — 推奨 (A) を採用 (個人利用、MVP)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3: ビルド時間目標

`next build` の所要時間目標は?

A) **30 秒以内** — 既存テンプレ + 100 件程度の Markdown を読み込むだけなのでこの範囲で収まる想定
B) **2 分以内** — NFR-01 の 2〜5 分以内と整合する余裕枠
C) **計測のみ、目標なし** — MVP では計測ログを残すのみ
D) **おまかせ** — 推奨 (A) を採用 (記事数 ~100 では十分早い)
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4: Vercel デプロイの認証設定

Vercel の Deployment Protection (preview / production) はどう設定しますか?

A) **本番 (production) は公開、preview は無認証** — 個人利用、内容は閲覧専用なので公開で問題なし
B) **本番は公開、preview は Vercel Authentication で保護** — preview をチームメンバーのみ閲覧可能に
C) **本番・preview 両方を Vercel Authentication で保護** — 個人ダッシュボード化
D) **おまかせ** — 推奨 (A): 個人利用かつ閲覧専用、`robots.txt Disallow: /` で検索除外しているため事実上見つかりにくい
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。
