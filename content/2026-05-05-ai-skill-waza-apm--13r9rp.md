---
id: 13r9rp6genykr0eh
title: AIエージェントの Skill は書くだけでは足りない ⇒ Waza で評価して APM で配ろう!【ハーネスエンジニアリング】
url: 'https://zenn.dev/microsoft/articles/b081f3ddb93040'
source: zenn
published_at: '2026-05-05T18:41:11.000Z'
collected_at: '2026-05-06T22:24:05.668Z'
summary: >-
  はじめに

  こんにちは、Matsumoto です。

  GitHub Copilot などの Agentic なCoding ツールを日常で使っていると、SKILL.md
  で繰り返しの作業手順やレビュー観点をスキルとして渡せるのが便利だなと思います。

  一方で、 SKill
  は書くだけでは足りません。本当に意図どおりに発火するのか、書き換えたあとにデグレしていないのか、別モデルでも同じ品質で動くのかは、確認・評価しないと分かりません。

  そこで Microsoft の GitHub org で公開されている 2 つの OSS を触ってみました。



  microsoft/apm：AI エージェン...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--VPKhlSw4--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:AI%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E3%2581%25AE%2520Skill%2520%25E3%2581%25AF%25E6%259B%25B8%25E3%2581%258F%25E3%2581%25A0%25E3%2581%2591%25E3%2581%25A7%25E3%2581%25AF%25E8%25B6%25B3%25E3%2582%258A%25E3%2581%25AA%25E3%2581%2584%2520%25E2%2587%2592%2520Waza%2520%25E3%2581%25A7%25E8%25A9%2595%25E4%25BE%25A1%25E3%2581%2597%25E3%2581%25A6%2520APM%2520%25E3%2581%25A7%25E9%2585%258D%25E3%2582%258D%25E3%2581%2586%2521%25E3%2580%2590%25E3%2583%258F%25E3%2583%25BC%25E3%2583%258D%25E3%2582%25B9%25E3%2582%25A8%25E3%2583%25B3...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:Naoki%2520Matsumoto%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2MzZDNiN2I3OGYuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Microsoft%2520%2528%25E6%259C%2589%25E5%25BF%2597%2529%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2YxMjVkOWVmNWEuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# AIエージェントの Skill は書くだけでは足りない ⇒ Waza で評価して APM で配ろう!【ハーネスエンジニアリング】

はじめに
こんにちは、Matsumoto です。
GitHub Copilot などの Agentic なCoding ツールを日常で使っていると、SKILL.md で繰り返しの作業手順やレビュー観点をスキルとして渡せるのが便利だなと思います。
一方で、 SKill は書くだけでは足りません。本当に意図どおりに発火するのか、書き換えたあとにデグレしていないのか、別モデルでも同じ品質で動くのかは、確認・評価しないと分かりません。
そこで Microsoft の GitHub org で公開されている 2 つの OSS を触ってみました。


microsoft/apm：AI エージェン...
