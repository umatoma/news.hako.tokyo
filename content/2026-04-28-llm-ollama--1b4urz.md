---
id: 1b4urzhinsrv6016
title: エージェントコスト対策としてローカルLLMはアリ？— Ollamaで試してみた
url: 'https://zenn.dev/headwaters/articles/509a1f83c693ce'
source: zenn
published_at: '2026-04-28T08:45:05.000Z'
collected_at: '2026-04-30T22:26:14.310Z'
summary: >-
  はじめに

  AIエージェントが発達した昨今、頭の中で想像したものを実際にアプリとして落とし込むことは障壁がかなり低くなったと思います。

  しかし、一方でこの先エージェント自体を今までのように安易に利用することが難しくなってくるかもしれません。

  GitHub Copilotが2026年6月1日より従量課金制へ移行すると発表しました。

  これまでの「プレミアムリクエスト」方式が廃止され、「GitHub
  AIクレジット」という実使用量ベースの課金に切り替わります。GitHubはその背景として、Copilotがエディタ内のアシスタントから複数ステップをこなすエージェント型プラットフォームへ進化した...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--r0mlXcQ2--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E3%2582%25B3%25E3%2582%25B9%25E3%2583%2588%25E5%25AF%25BE%25E7%25AD%2596%25E3%2581%25A8%25E3%2581%2597%25E3%2581%25A6%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25AB%25E3%2583%25ABLLM%25E3%2581%25AF%25E3%2582%25A2%25E3%2583%25AA%25EF%25BC%259F%25E2%2580%2594%2520Ollama%25E3%2581%25A7%25E8%25A9%25A6%25E3%2581%2597%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:Renly%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzZjNGExY2UxMDYuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/g_south_west%2Ch_34%2Cl_default:og-publication-pro-mark-xcosax%2Cw_34%2Cx_217%2Cy_158/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2583%2598%25E3%2583%2583%25E3%2583%2589%25E3%2582%25A6%25E3%2582%25A9%25E3%2583%25BC%25E3%2582%25BF%25E3%2583%25BC%25E3%2582%25B9%2Cx_255%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2QwOTUyODRjOTMuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# エージェントコスト対策としてローカルLLMはアリ？— Ollamaで試してみた

はじめに
AIエージェントが発達した昨今、頭の中で想像したものを実際にアプリとして落とし込むことは障壁がかなり低くなったと思います。
しかし、一方でこの先エージェント自体を今までのように安易に利用することが難しくなってくるかもしれません。
GitHub Copilotが2026年6月1日より従量課金制へ移行すると発表しました。
これまでの「プレミアムリクエスト」方式が廃止され、「GitHub AIクレジット」という実使用量ベースの課金に切り替わります。GitHubはその背景として、Copilotがエディタ内のアシスタントから複数ステップをこなすエージェント型プラットフォームへ進化した...
