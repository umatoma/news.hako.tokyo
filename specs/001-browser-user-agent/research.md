# Research: 収集時の User-Agent をブラウザ偽装値に調整

**Feature**: 001-browser-user-agent | **Date**: 2026-05-30

spec の Assumptions で plan フェーズに委ねられた唯一の未確定点
（具体的なブラウザ User-Agent 文字列の選定）を解決する。

## Decision 1: 採用する User-Agent 文字列

**Decision**: 実在する安定版デスクトップ Chrome（Windows 10/11, 64bit）相当の文字列を採用する。

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
```

**Rationale**:
- Windows + Chrome はデスクトップで最も一般的な組み合わせであり、bot 判定で最も「自然」な
  ヘッダーとして通りやすい。少数派の OS/ブラウザ構成より弾かれるリスクが低い。
- マイナーバージョンを `0.0.0` とするのは、実ブラウザが送る慣習的な簡略形であり、頻繁な
  バージョン追従なしに「十分に新しいブラウザ」を表現できる。
- 全収集元（Zenn / Hatena / Google News / Togetter）に同一値を一括適用する方針（FR-002）と
  整合する単一の汎用文字列である。

**Alternatives considered**:
- **macOS Safari の UA**: 利用者数は一定だが Chrome ほど多数派ではなく、Safari 特有の
  バージョン整合（Version/x.y Safari/...）を正しく綴る必要があり保守コストが高い。
- **収集元ごとに最適な UA を出し分け**: ユーザー確認で「全収集元に一括」と確定済みのため却下。
- **現状の collector 名乗りを維持しつつ括弧内に連絡先 URL を足す**: ブラウザ偽装の目的
  （bot 判定回避）を満たさないため却下。

## Decision 2: 値の保持形態（ハードコード継続 / 外部化）

**Decision**: 既存同様、`http-client.ts` 内の単一定数 `DEFAULT_USER_AGENT` としてハードコードする。

**Rationale**:
- spec の Assumptions で環境変数・設定ファイルによる外部化は明示的にスコープ外。
- 全収集元が単一の `DefaultHttpClient` を共有する現構造のままで FR-001・FR-002 を満たせるため、
  最小変更が最も低リスク（憲法 原則 I の単純性・原則 IV の無人パイプライン非破壊に整合）。

**Alternatives considered**:
- **環境変数化**: 運用時の差し替え自由度は上がるが、今回の目的（bot 回避）には不要で、
  GitHub Actions のシークレット/変数管理という新たな運用面を増やす。スコープ外として却下。

## Decision 3: バージョン陳腐化への対応

**Decision**: 採用バージョンは固定値とし、将来サイト側の bot 判定が厳格化して取得失敗が
再発した場合に、定数の更新（より新しい Chrome バージョン文字列への差し替え）で対応する運用とする。

**Rationale**:
- 自動でのバージョン追従機構は無人パイプラインに不確実性を持ち込み、原則 IV（パイプライン
  非破壊）に反するリスクがある。陳腐化は緩やかで、取得失敗の監視（既存のジョブサマリ）で
  検知してから手動更新すれば十分。
- これは将来の運用メモであり、本イテレーションの実装スコープ（定数差し替え + テスト）には含めない。

**Alternatives considered**:
- **UA を定期自動更新する仕組みの導入**: 過剰。今回の課題規模に対して複雑性が見合わない。
