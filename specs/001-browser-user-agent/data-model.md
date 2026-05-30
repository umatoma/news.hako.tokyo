# Data Model: 収集時の User-Agent をブラウザ偽装値に調整

**Feature**: 001-browser-user-agent | **Date**: 2026-05-30

本機能は永続データ（Markdown / 型）を変更しない。唯一の「データ」は収集処理が外部へ送出する
HTTP リクエストの User-Agent ヘッダー既定値である。

## Entity: User-Agent 既定値（DEFAULT_USER_AGENT）

- **表すもの**: 全収集元の外部 HTTP リクエストに付与される、実在ブラウザ相当の User-Agent 文字列。
- **保持場所**: `next/scripts/collector/lib/http-client.ts` のモジュールスコープ定数。
- **多重度**: 収集処理全体で単一の値（収集元ごとの出し分けなし）。
- **値**（research.md Decision 1）:
  ```
  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
  ```

### 適用ルール（要件由来）

| ルール | 由来 | 内容 |
|--------|------|------|
| 全リクエストに付与 | FR-001 | `DefaultHttpClient.get` の全外部リクエストの `User-Agent` ヘッダーに既定値を設定する |
| 全収集元一括・同一値 | FR-002 | 単一定数を共有 `DefaultHttpClient` 経由で全収集元に適用する（出し分けなし） |
| 呼び出し側の上書き優先 | FR-003 | `options.headers` で `User-Agent` が指定された場合はその値が既定値を上書きする（既存挙動の維持） |
| 既存収集元の継続成功 | FR-004 | 既存の `HttpClient` インターフェース・戻り値・タイムアウト挙動は不変 |

### 状態遷移

なし（静的な定数。リクエストごとの状態は持たない）。
