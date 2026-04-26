# news.hako.tokyo

個人用ニュース集約サイト。Zenn / はてなブックマーク / Google ニュース / Togetter から記事を毎日自動収集し、Next.js (App Router, SSG) で 1 ページの一覧として表示する。

## 公開 URL

- 本番: <https://project-1czkr.vercel.app/> (カスタムドメイン取得後に変更予定)

## ディレクトリ構成

```
news.hako.tokyo/
├── .github/workflows/   # GitHub Actions (収集ジョブ + CI)
├── content/             # 収集済み Markdown (Git 管理、収集ジョブが書き出す)
├── next/                # Next.js アプリ + Collector スクリプト
│   ├── app/             # Web フロントエンド (Unit 2)
│   ├── lib/             # 共有型定義 + データ層
│   ├── config/          # 収集対象設定
│   └── scripts/collector/  # 収集ジョブ (Unit 1)
└── aidlc-docs/          # AI-DLC 設計ドキュメント
```

## セットアップ

```bash
nvm use            # .nvmrc で Node.js v24.13.1 を使用
cd next
npm install
```

## ローカル実行

### 収集ジョブを 1 回実行
```bash
cd next
npm run collect
```
→ `<repo-root>/content/{YYYY-MM-DD}-{slug}.md` に新規記事の Markdown が生成され、`<repo-root>/next/collector-result.json` に実行サマリーが書き出されます。

### テスト
```bash
cd next
npm run test:run        # 全テスト単発 (CI 相当)
npm test                # watch モード (開発中)
```

### Lint / 型チェック
```bash
cd next
npm run lint
npx tsc --noEmit
```

### 開発サーバ (Web Frontend)
```bash
cd next
npm run dev             # http://localhost:3000
```

## 自動運用

- **GitHub Actions の `collect` ワークフロー** が毎日 22:00 UTC (= 翌 07:00 JST) に収集ジョブを実行し、新規 Markdown を `main` ブランチに自動コミットします。
- main への push が **Vercel の自動デプロイ** をトリガし、`<repo-root>/content/*.md` を読み込んだ静的サイトが再ビルド・配信されます。

## ドキュメント

設計と実装に関する詳細ドキュメントは `aidlc-docs/` 配下を参照してください:
- `aidlc-docs/inception/requirements/requirements.md` — 要件
- `aidlc-docs/inception/application-design/` — アプリケーション設計
- `aidlc-docs/construction/collector/` — Unit 1 (Collector) の Functional / NFR / Infrastructure / Code 設計
