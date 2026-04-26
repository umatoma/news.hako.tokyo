# Unit of Work — FR / AC Mapping

**Project**: news.hako.tokyo
**Stage**: INCEPTION — Units Generation
**Depth**: Minimal

> **Note**: User Stories ステージはスキップしているため、本来の "story map" の代替として、要件ドキュメント (`requirements.md`) で定義した **機能要件 (FR)** および **受入基準 (AC)** をユニットにマッピングします。

---

## 1. Functional Requirements ↔ Units

| FR | 内容 | 担当ユニット | 補足 |
|---|---|---|---|
| **FR-01** | ニュース一覧表示 (新着順、外部リンク) | **U2** | Repository が読み込み、Page がソートして描画 |
| **FR-02** | 情報収集 (RSS / API / スクレイピング) | **U1** | Adapter 4 種を CollectorRunner が逐次起動。設定は `next/config/sources.ts`。 |
| **FR-03** | 自動収集ジョブ (GitHub Actions cron + workflow_dispatch) | **U1 + Cross-cutting (CI)** | `.github/workflows/collect.yml` (Infrastructure Design で確定) |
| **FR-04** | ビルドとデプロイ (SSG + Vercel 自動デプロイ) | **U2 + Cross-cutting (CI)** | Vercel 連携は git push 経由 |
| **FR-05** | UI / 表示 (日本語のみ、システム設定追従ダーク、レスポンシブ) | **U2** | RootLayout 更新、ArticleListItem スタイリング |

### MVP 範囲外 (将来候補)
| 候補機能 | 想定担当ユニット | 備考 |
|---|---|---|
| LLM 要約 (Phase 2) | U1 拡張 + U2 表示拡張 | Article.summary を再生成 |
| 個別記事詳細ページ | U2 拡張 | dynamic route を追加 |
| カテゴリ絞り込み / 全文検索 | U2 拡張 | Article.tags / 別途検索 index 検討 |

---

## 2. Acceptance Criteria ↔ Units

| AC | 内容 | 担当ユニット | 検証ステージ |
|---|---|---|---|
| **AC-01** | main push → Vercel 自動デプロイ → 本番 URL で一覧表示 | U2 (主) + Cross-cutting | Build and Test (E2E) |
| **AC-02** | `workflow_dispatch` で手動実行 → `content/` に新規 Markdown コミット | U1 (主) + Cross-cutting (CI) | Build and Test (運用テスト) |
| **AC-03** | スケジュール実行 (毎朝 7:00 JST) が 1 回以上動作 | U1 (主) + Cross-cutting (CI) | Build and Test (運用テスト) |
| **AC-04** | 4 ソース (Zenn / Hatena / Google ニュース / Togetter) からそれぞれ 1 件以上取得 | U1 | U1 Code Generation + Build and Test |
| **AC-05** | 同一 URL の重複が排除される | U1 (Deduplicator) | U1 Code Generation (PBT-03) + Build and Test |
| **AC-06** | 一覧で title / source / publishedAt / 外部リンクが正しく表示・遷移 | U2 | U2 Code Generation + Build and Test (Playwright) |
| **AC-07** | CI で lint + typecheck + unit + E2E が緑 | Cross-cutting (CI) | Build and Test |
| **AC-08** | PBT (PBT-02, 03, 07, 08, 09) が CI で実行され seed ログが残る | U1 + U2 + Cross-cutting (CI) | Build and Test |
| **AC-09** | API キー等のシークレットがコードにハードコードされない (`gitleaks` 相当のスキャン) | Cross-cutting (CI) | Build and Test |
| **AC-10** | ライト / ダーク両 OS 設定でレイアウト崩れなし | U2 | U2 Code Generation + Build and Test (手動 + Playwright) |

---

## 3. NFR ↔ Units

| NFR | 内容 | 担当ユニット |
|---|---|---|
| **NFR-01** (パフォーマンス・トラフィック) | ビルド 2〜5 分以内、1日数十アクセス | U2 (主) |
| **NFR-02** (SEO) | `robots.txt: Disallow: /` 設定、SEO 対策最小限 | U2 |
| **NFR-03** (セキュリティ最低限) | API キー Secrets 化、`.env.local` `.gitignore`、`gitleaks` / `npm audit` を CI に | U1 + Cross-cutting (CI) |
| **NFR-04** (テスト) | Vitest + fast-check (Partial) + Playwright | U1 + U2 + Cross-cutting (CI) |
| **NFR-05** (CI/CD) | GitHub Actions による完全自動化 | Cross-cutting (CI) |
| **NFR-06** (期間) | 1〜2 週間で MVP | プロジェクト全体 |
| **NFR-07** (アクセシビリティ) | Tailwind 標準のコントラスト・フォーカス維持 | U2 |
| **NFR-08** (保守性) | TypeScript strict 維持、ESLint で違反ブロック、設定単一ファイル集約 | U1 + U2 + Cross-cutting (CI) |

---

## 4. Risks ↔ Units

| RISK | 内容 | 担当ユニット | 検証ステージ |
|---|---|---|---|
| **RISK-01** | Togetter スクレイピング規約・robots.txt 整合 | U1 (TogetterScraper) | U1 NFR Requirements (OQ-01 解消) |
| **RISK-02** | Google ニュース RSS の非公式仕様変更リスク | U1 (GoogleNewsRssFetcher) | U1 NFR Requirements (運用時のエラー監視ポリシーを確定) |
| **RISK-03** | GitHub Actions 無料枠 | Cross-cutting (CI) | U1 Infrastructure Design |
| **RISK-04** | Markdown ファイル肥大化 | U1 + Cross-cutting | 将来 (OPERATIONS placeholder) |
| **RISK-05** | 重複排除キー設計 (URL のみで不十分な場合) | U1 (Deduplicator) | 将来。MVP 後の運用で再評価 |

---

## 5. Open Questions (Workflow Planning) ↔ Units

| OQ | 内容 | 担当ユニット (解消ステージ) |
|---|---|---|
| **OQ-01** | Togetter スクレイピングの規約・robots.txt 確認 | U1 NFR Requirements |
| **OQ-02** | 一般ニュースのソース選定 | **解消済み**: Google ニュース 非公式 RSS を採用 (Zenn・Hatena と同じ RSS パイプライン)。Functional Design では具体的なクエリ / トピック / 地理パラメータを確定。 |
| **OQ-03** | Vercel preview URL の E2E 取り回し | U2 Infrastructure Design / Build and Test |
| **OQ-04** | Markdown frontmatter スキーマ詳細 | **解消済み** (Application Design Article 型) |
| **OQ-05** | Next.js 16 breaking changes の影響 | U2 Functional Design (`node_modules/next/dist/docs/` を参照) |

---

## 6. ユニット完了定義 (Definition of Done)

### U1 (Collector) DoD
- [ ] FR-02, FR-03 の機能が実装され、ローカル/CI で動作
- [ ] AC-02, AC-04, AC-05 の合格 (PBT-03 含む)
- [ ] OQ-01, OQ-02 の解消 (NFR Requirements / Functional Design)
- [ ] CollectorRunner.run() が CollectorRunResult を返す
- [ ] `next/scripts/collector/` の単体テストが緑 (PBT-02, 03, 07, 08 含む)
- [ ] `.github/workflows/collect.yml` が PR レベルで動作確認済み

### U2 (Web Frontend) DoD
- [ ] FR-01, FR-04, FR-05 の機能が実装され、`next dev` で動作
- [ ] AC-01, AC-06, AC-10 の合格
- [ ] OQ-03, OQ-05 の解消
- [ ] `next/lib/articles.ts` が共有 Article 型と整合
- [ ] `next/app/page.tsx` がサンプル `content/*.md` を読み込んで一覧描画
- [ ] `.github/workflows/ci.yml` で lint + typecheck + unit + E2E が緑

### プロジェクト全体 (Build and Test) DoD
- [ ] AC-01〜AC-10 全項目が緑
- [ ] CI で `gitleaks` / `npm audit` が緑 (NFR-03, AC-09)
- [ ] Vercel 本番 URL で動作確認
- [ ] 1 日 cron が 1 回以上正常終了 (AC-03)

---

## 7. ユニット粒度の妥当性検証

| 観点 | 検証 |
|---|---|
| **凝集度** | U1 は「外部からのデータ取り込み」、U2 は「データの表示」。各々が単一責任を持つ。 |
| **結合度** | コード結合ゼロ、データ結合 (Markdown スキーマ) のみ → 良好 |
| **デプロイ単位** | U1 は GitHub Actions 上で実行、U2 は Vercel 上で実行 → 物理的にも分離 |
| **テスト独立性** | 各ユニットの単体テストは fixtures だけで完結 |
| **Construction での扱いやすさ** | per-unit ループの 2 周 (推定 5〜7 日) で完了見込み — NFR-06 (1〜2 週間) と整合 |
