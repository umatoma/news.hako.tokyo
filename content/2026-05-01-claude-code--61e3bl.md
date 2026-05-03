---
id: 61e3bli4vwib4xe3
title: Claude Codeにオレたち流のコードを書かせる（前編）— プロジェクトの流儀を自動抽出する
url: 'https://zenn.dev/sonicgarden/articles/claude-code-custom-rules-part1'
source: zenn
published_at: '2026-05-01T15:00:06.000Z'
collected_at: '2026-05-03T22:20:50.855Z'
summary: >-
  この記事は Claude on SonicGarden の記事です。ソニックガーデンのプログラマが、Claude
  Codeの活用について書いています。#claude_on_sonicgarden


   きっかけ
  Claude
  Code、もはやない人生は考えられないくらいお世話になっているのですが、ここはこう書いてほしいんだよなーみたいなのはどうしてもちょいちょい発生します。

  なので.claude/rules/を整備していかないとなーと思うのですが、ルールファイルをコードを眺めながら自分で一から書いていくのはなかなかモチベーションが上がりません。

  そこでコードベースやClaude Cod...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--1ot3RQ8X--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%25E3%2581%25AB%25E3%2582%25AA%25E3%2583%25AC%25E3%2581%259F%25E3%2581%25A1%25E6%25B5%2581%25E3%2581%25AE%25E3%2582%25B3%25E3%2583%25BC%25E3%2583%2589%25E3%2582%2592%25E6%259B%25B8%25E3%2581%258B%25E3%2581%259B%25E3%2582%258B%25EF%25BC%2588%25E5%2589%258D%25E7%25B7%25A8%25EF%25BC%2589%25E2%2580%2594%2520%25E3%2583%2597%25E3%2583%25AD%25E3%2582%25B8%25E3%2582%25A7%25E3%2582%25AF%25E3%2583%2588%25E3%2581%25AE%25E6%25B5%2581%25E5%2584%2580%25E3%2582%2592%25E8%2587%25AA%25E5%258B%2595%25E6%258A%25BD%25E5%2587%25BA%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:hiropon%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzQ3ZjRiNGZjZmIuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E6%25A0%25AA%25E5%25BC%258F%25E4%25BC%259A%25E7%25A4%25BE%25E3%2582%25BD%25E3%2583%258B%25E3%2583%2583%25E3%2582%25AF%25E3%2582%25AC%25E3%2583%25BC%25E3%2583%2587%25E3%2583%25B3%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzkwNWViODQ2NzMuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Codeにオレたち流のコードを書かせる（前編）— プロジェクトの流儀を自動抽出する

この記事は Claude on SonicGarden の記事です。ソニックガーデンのプログラマが、Claude Codeの活用について書いています。#claude_on_sonicgarden


 きっかけ
Claude Code、もはやない人生は考えられないくらいお世話になっているのですが、ここはこう書いてほしいんだよなーみたいなのはどうしてもちょいちょい発生します。
なので.claude/rules/を整備していかないとなーと思うのですが、ルールファイルをコードを眺めながら自分で一から書いていくのはなかなかモチベーションが上がりません。
そこでコードベースやClaude Cod...
