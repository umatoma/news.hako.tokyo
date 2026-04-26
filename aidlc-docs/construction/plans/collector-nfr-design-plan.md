# NFR Design Plan — Unit 1: Collector

**Project**: news.hako.tokyo
**Unit**: U1 (News Collection Service / Collector)
**Stage**: CONSTRUCTION — NFR Design
**Created**: 2026-04-25

NFR Design は NFR Requirements を踏まえて **設計パターンと論理コンポーネント** に落とし込むステージです。本ユニットは MVP / 個人利用 / 静的サイトのため、Application Design + Functional Design + NFR Requirements で多くの判断が既に確定しており、本ステージでは **既存判断のパターン表現** + **数点の最終確認** に絞ります。

---

## Tracking Checklist

- [x] Step 1: Analyze NFR Requirements (`nfr-requirements.md` / `tech-stack-decisions.md` 読込)
- [x] Step 2: Create NFR design plan (this file)
- [x] Step 3: Generate context-appropriate questions (3 問に絞る)
- [x] Step 4: Store plan
- [ ] Step 5: Collect and analyze answers
- [ ] Step 6: Generate NFR design artifacts
- [ ] Step 7: Present completion message
- [ ] Step 8: Approval
- [ ] Step 9: Record approval and update progress

---

## 既に確定済みの設計判断 (再掲)

| カテゴリ | 確定内容 | 出典 |
|---|---|---|
| **Resilience** | Adapter 失敗継続 + リトライなし + Adapter HTTP タイムアウト 30 秒 | Q3=A、Q2=A、BR-50〜52 |
| **Scalability** | 個人利用 (1 日数十アクセス未満)、scale out 不要 | NFR-01 |
| **Performance** | 1 ジョブ 5 分予算、各 Adapter `maxItemsPerRun` 上限 | U1-NFR-PERF-01〜04 |
| **Security** | API キー不要 (将来用に Secrets 経路を整備)、User-Agent 明示、レート制御、gitleaks gate、npm audit 通知 | U1-NFR-SEC-01〜07 |
| **Architecture** | Adapter パターン (4 fetcher) + Repository / Service / Utility 層分離 | Application Design |
| **Logging** | stdout プレーン + collector-result.json + Job Summary + artifact、自作 Logger ヘルパ | Q6=C、Q9=A、Q7=C |
| **Testability** | DI 抽象 (`HttpClient` / `FileSystem`)、PBT (Partial)、example-based + PBT 分離 | Application Design § 6 / Functional Design § 6 |

---

## NFR Design Questions (3 問のみ)

回答方法は前回までと同じく **`[Answer]:`** タグの後にアルファベットを記入してください。「**D) おまかせ**」を選ぶと推奨案を採用します。

---

### Question 1: エラー伝播パターン (Adapter → CollectorRunner)

各 `SourceFetcher.fetch()` が失敗した時の伝播方式は?

A) **例外 throw + Runner で try/catch** — TypeScript / JS の自然な書き方。Functional Design Q4=A の失敗継続戦略と整合。
B) **Result 型 (`Ok | Err`) を返す** — 関数型風の明示エラー伝播。`fp-ts` 等の利用検討。
C) **両方併用** — 致命エラーは throw、回復可能エラーは Result 型
D) **おまかせ** — 推奨 (A の例外 throw) を採用、Runner 内で try/catch + ログ + failedSources に追加
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: 時刻注入 (Clock) 抽象

`collectedAt` の付与や時刻依存ロジックのテスタビリティのため、`Clock` 抽象 (`now(): Date` を返すインターフェイス) を導入しますか?

A) **導入する** — `CollectorRunner` のコンストラクタで `clock?: () => Date` を受け取る (デフォルト `() => new Date()`)。テストで `clock = () => new Date("2026-04-25T22:00:00Z")` のように固定可能。
B) **導入しない** — 直接 `new Date().toISOString()` を呼ぶ。MVP のテストではモックを使わない or 実時刻で OK。
C) **おまかせ** — 推奨 (A の導入) を採用、テスタビリティ確保
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3: 設定 (`config/sources.ts`) の読み込みパターン

`SourceConfig` を CollectorRunner に渡す方式は?

A) **静的 import** — `import sourceConfig from "@/config/sources"` で直接 import、CollectorRunner には config をコンストラクタで注入。テスト時は別 config を生成して注入。
B) **動的 import** — `await import("@/config/sources")` で遅延読み込み。設定パスを環境変数で切替可能に。
C) **環境変数で設定パスを指定 + 静的 import がデフォルト** — MVP は A、将来の拡張余地として B も開ける
D) **おまかせ** — 推奨 (A の静的 import) を採用、シンプル + テスト容易
X) その他 (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了しましたら「完了」「OK」など任意の合図をお願いします。
