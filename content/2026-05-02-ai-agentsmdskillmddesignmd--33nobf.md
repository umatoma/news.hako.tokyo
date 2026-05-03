---
id: 33nobf75jzulff91
title: 'AIに渡す指示書の役割分担: AGENTS.md/SKILL.md/DESIGN.mdと仕様駆動開発の現在地'
url: 'https://zenn.dev/genda_jp/articles/f71d3ed7d4d7e8'
source: zenn
published_at: '2026-05-02T21:25:13.000Z'
collected_at: '2026-05-03T22:20:50.855Z'
summary: >-
  2026年4月、Google Labsが DESIGN.md という仕様を公開しました。AIエージェントが読めるデザインシステムの仕様で、npx
  @google/design.md lint というCLI検証ツールがセットになっています。

  DESIGN.md の登場で、AIエージェントに渡す指示書ファイルが3種類目に揃いました。2025年から業界標準として広がってきた
  AGENTS.md（OpenAI・Google・Sourcegraph・Cursor・Factoryらが共同で策定、2025年12月にLinux
  Foundationへ寄贈）、Anthropic Claude Skills...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--AAdmHSSt--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:AI%25E3%2581%25AB%25E6%25B8%25A1%25E3%2581%2599%25E6%258C%2587%25E7%25A4%25BA%25E6%259B%25B8%25E3%2581%25AE%25E5%25BD%25B9%25E5%2589%25B2%25E5%2588%2586%25E6%258B%2585%253A%2520AGENTS.md%252FSKILL.md%252FDESIGN.md%25E3%2581%25A8%25E4%25BB%2595%25E6%25A7%2598%25E9%25A7%2586%25E5%258B%2595%25E9%2596%258B%25E7%2599%25BA%25E3%2581%25AE%25E7%258F%25BE%25E5%259C%25A8%25E5%259C%25B0%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:ikenyal%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzNiM2M1MjhkNjguanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:GENDA%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2I5MzI2NGQ4NzcuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# AIに渡す指示書の役割分担: AGENTS.md/SKILL.md/DESIGN.mdと仕様駆動開発の現在地

2026年4月、Google Labsが DESIGN.md という仕様を公開しました。AIエージェントが読めるデザインシステムの仕様で、npx @google/design.md lint というCLI検証ツールがセットになっています。
DESIGN.md の登場で、AIエージェントに渡す指示書ファイルが3種類目に揃いました。2025年から業界標準として広がってきた AGENTS.md（OpenAI・Google・Sourcegraph・Cursor・Factoryらが共同で策定、2025年12月にLinux Foundationへ寄贈）、Anthropic Claude Skills...
