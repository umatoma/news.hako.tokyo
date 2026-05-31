# アジャイル型 SDLC と仕様駆動開発

アジャイル型 SDLC 上で実践する Kiro スタイルの仕様駆動開発（Spec-Driven Development）

## プロジェクトコンテキスト

### パス
- ステアリング: `.kiro/steering/`
- 仕様（Specs）: `.kiro/specs/`

### ステアリングと仕様の違い

**ステアリング**（`.kiro/steering/`） - プロジェクト全体のルールとコンテキストで AI を導く
**仕様**（`.kiro/specs/`） - 個別機能ごとの開発プロセスを形式化する

### アクティブな仕様
- アクティブな仕様は `.kiro/specs/` を確認する
- 進捗確認には `/kiro-spec-status [feature-name]` を使用する

## 開発ガイドライン
- 思考は英語で行い、応答は日本語で生成する。プロジェクトファイルに書き出すすべての Markdown コンテンツ（例: requirements.md、design.md、tasks.md、research.md、検証レポート）は、その仕様に設定された対象言語（spec.json.language を参照）で記述しなければならない。

## 最小ワークフロー
- フェーズ 0（任意）: `/kiro-steering`、`/kiro-steering-custom`
- ディスカバリー: `/kiro-discovery "idea"` — アクションパスを判定し、複数仕様プロジェクト向けに brief.md と roadmap.md を生成する
- フェーズ 1（仕様策定）:
  - 単一仕様: `/kiro-spec-quick {feature} [--auto]` もしくはステップごとに実行:
    - `/kiro-spec-init "description"`
    - `/kiro-spec-requirements {feature}`
    - `/kiro-validate-gap {feature}`（任意: 既存コードベース向け）
    - `/kiro-spec-design {feature} [-y]`
    - `/kiro-validate-design {feature}`（任意: 設計レビュー）
    - `/kiro-spec-tasks {feature} [-y]`
  - 複数仕様: `/kiro-spec-batch` — roadmap.md のすべての仕様を依存関係のウェーブごとに並列生成する
- フェーズ 2（実装）: `/kiro-impl {feature} [tasks]`
  - タスク番号なし: 自律モード（タスクごとのサブエージェント + 独立レビュー + 最終検証）
  - タスク番号あり: 手動モード（選択したタスクをメインコンテキストで実行。完了前にレビュアーによるゲートを通す）
  - `/kiro-validate-impl {feature}`（単独での再検証）
- 進捗確認: `/kiro-spec-status {feature}`（いつでも使用可能）

## スキル構成
スキルは `.claude/skills/kiro-*/SKILL.md` に配置されている
- 各スキルは `SKILL.md` ファイルを持つディレクトリである
- スキルは会話コンテキストにアクセスしながらインラインで実行される
- スキルは効率化のため並列リサーチをサブエージェントに委任できる
- 追加ファイル（テンプレート、サンプル）はスキルディレクトリに追加できる
- `kiro-review` — レビュアーのサブエージェントが使用するタスクローカルの敵対的レビュープロトコル
- `kiro-debug` — デバッガーのサブエージェントが使用する根本原因優先のデバッグプロトコル
- `kiro-verify-completion` — 成功・完了の主張前に新鮮な証拠を求めるゲート
- **スキルが現在のタスクに適用される可能性が 1% でもあれば、必ず呼び出す。** タスクが単純に見えるという理由でスキルをスキップしてはならない。

## 開発ルール
- 3 フェーズ承認ワークフロー: 要件 → 設計 → タスク → 実装
- 各フェーズで人間によるレビューが必須。意図的なファストトラックの場合のみ `-y` を使用する
- ステアリングを常に最新に保ち、`/kiro-spec-status` で整合性を確認する
- ユーザーの指示を正確に守り、その範囲内では自律的に行動する。必要なコンテキストを収集し、依頼された作業をこの実行内でエンドツーエンドで完遂する。質問は、必須情報が欠けている場合や指示が致命的に曖昧な場合に限って行う。

## ステアリング設定
- `.kiro/steering/` 全体をプロジェクトメモリとして読み込む
- デフォルトファイル: `product.md`、`tech.md`、`structure.md`
- カスタムファイルにも対応（`/kiro-steering-custom` で管理）
