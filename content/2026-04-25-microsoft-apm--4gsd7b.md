---
id: 4gsd7bhcgsu3a6k7
title: ハーネスエンジニアリングを楽にする Microsoft 製の新ツール「APM」ハンズオン
url: 'https://zenn.dev/microsoft/articles/agent-package-manager-handson'
source: zenn
published_at: '2026-04-25T13:16:58.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  はじめに

  最近、AI エージェント（GitHub Copilot / Claude Code / Cursor / OpenCode / Codex
  …）に渡す「指示書」の種類が一気に増えました。


  GitHub Copilot → .github/instructions/*.md, .github/prompts/*.md


  Claude Code → .claude/commands/*.md, .claude/agents/*.md


  Cursor → .cursor/rules/*.mdc


  これに加えて MCP サーバー / hooks / skills …


  チーム内で...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--9ybui8kx--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2583%258F%25E3%2583%25BC%25E3%2583%258D%25E3%2582%25B9%25E3%2582%25A8%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%258B%25E3%2582%25A2%25E3%2583%25AA%25E3%2583%25B3%25E3%2582%25B0%25E3%2582%2592%25E6%25A5%25BD%25E3%2581%25AB%25E3%2581%2599%25E3%2582%258B%2520Microsoft%2520%25E8%25A3%25BD%25E3%2581%25AE%25E6%2596%25B0%25E3%2583%2584%25E3%2583%25BC%25E3%2583%25AB%25E3%2580%258CAPM%25E3%2580%258D%25E3%2583%258F%25E3%2583%25B3%25E3%2582%25BA%25E3%2582%25AA%25E3%2583%25B3%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:momosuke%2520%257C%2520Ryosuke...%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2MzZDNiN2I3OGYuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Microsoft%2520%2528%25E6%259C%2589%25E5%25BF%2597%2529%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2Q5ODc4NmI0NjguanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# ハーネスエンジニアリングを楽にする Microsoft 製の新ツール「APM」ハンズオン

はじめに
最近、AI エージェント（GitHub Copilot / Claude Code / Cursor / OpenCode / Codex …）に渡す「指示書」の種類が一気に増えました。

GitHub Copilot → .github/instructions/*.md, .github/prompts/*.md

Claude Code → .claude/commands/*.md, .claude/agents/*.md

Cursor → .cursor/rules/*.mdc

これに加えて MCP サーバー / hooks / skills …

チーム内で...
