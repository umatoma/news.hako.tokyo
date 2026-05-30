<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

## コミュニケーション

ユーザーとのやり取りはすべて日本語で行う。

## ドキュメント記述言語

SpecKit（`/speckit.*` コマンド）が生成・更新するドキュメントの記述内容は、すべて日本語で書く。
対象: `.specify/memory/constitution.md`、`specs/**/spec.md`・`plan.md`・`tasks.md`・`research.md`・
`data-model.md`・`quickstart.md`・`checklist.md`、その他 SpecKit が出力する成果物。

- 説明文・要件（FR-xxx）・受け入れシナリオ・タスク説明・根拠などの**本文は日本語**で記述する。
- 構造の見出しや定型ラベル（`## Requirements`、`### Functional Requirements`、
  `## Success Criteria`、`## Constitution Check`、`Acceptance Scenarios`、`Given/When/Then`、
  `MUST`/`SHOULD` 等の要件キーワード）は、SpecKit スキルの解析・整合性チェックが前提とするため
  **英語のまま維持する**。
- 識別子・コマンド・パス・コード（`npm run build`、`next/lib/` など）は原文のまま。
