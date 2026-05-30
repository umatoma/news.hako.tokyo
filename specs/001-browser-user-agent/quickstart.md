# Quickstart: 収集時の User-Agent をブラウザ偽装値に調整

**Feature**: 001-browser-user-agent | **Date**: 2026-05-30

## 前提

- Node.js v24.x（`nvm use`）
- 作業ディレクトリ: `next/`

## 変更点（実装の要約）

1. `next/scripts/collector/lib/http-client.ts` の `DEFAULT_USER_AGENT` を
   ブラウザ偽装値（research.md Decision 1）へ差し替える。
2. `next/scripts/collector/test/http-client.test.ts` を新設し、`DefaultHttpClient` の
   送信ヘッダーを検証する（global `fetch` をモック）。

## 検証手順

### 1. 単体テスト（送信ヘッダーの検証）

```bash
cd next
npm run test:run
```

期待：以下を満たす `http-client.test.ts` がパスする。

- `DefaultHttpClient.get` が `User-Agent` にブラウザ偽装値を設定して `fetch` を呼ぶ（FR-001 / FR-002）。
- 送信される `User-Agent` がブラウザ相当（`Mozilla/5.0 ... Chrome/...`）であり、旧来の
  collector 名乗りを含まない（回帰固定）。
- `get(url, { headers: { "User-Agent": "custom" } })` のとき `custom` が優先される（FR-003）。

### 2. マージ前ゲート

```bash
cd next
npm run lint
npx tsc --noEmit
npm run test:run
npm run build
```

すべてエラーなく完了すること（憲法 開発ワークフロー）。

### 3. 実収集での確認（任意・手動）

```bash
cd next
npm run collect
```

期待：bot 判定で記事を取得できていなかった収集元から記事が取得・蓄積される（SC-002）。
従来取得できていた収集元の取得が継続して成功する（SC-003）。
※ ネットワーク・外部サイトの状態に依存するため、CI 必須ゲートには含めない。

## 受け入れ基準との対応

| 受け入れ | 確認方法 |
|----------|----------|
| FR-001 / FR-002（全リクエストに同一ブラウザ UA） | 単体テスト（送信ヘッダー検証） |
| FR-003（呼び出し側上書き優先） | 単体テスト（override ケース） |
| FR-004 / SC-003（既存収集元の継続成功） | 既存テスト群 + 任意の実収集 |
| SC-002（弾かれていた収集元の取得） | 任意の実収集（`npm run collect`） |
