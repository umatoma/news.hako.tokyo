---
id: odjdbl6kvxqlywc2
title: ローカルLLM高速化：MTP最速！DDTree(効率版DFlash)を動画で理解
url: 'https://zenn.dev/katalab/articles/386df3380c2888'
source: zenn
published_at: '2026-05-04T14:29:48.000Z'
collected_at: '2026-05-05T22:27:46.009Z'
summary: >-
  前提

  まずローカルでLLMを使う場合、GPUの計算性能を最大限引き出すには

  同時処理リクエスト数を数十～数百に維持する必要があります

  同時リクエスト数が少ないと、LLMの重み等をGPUのSM（実際に計算を行う場所）に読みだす帯域幅がボトルネックとなってしまいます

  クラウドでLLMを動かしAPIを提供する事業者は、ユーザをたくさん集めればリクエストを飽和させられますが、個人ユーザが複数のLLMエージェントを並列に稼働して有効に活用できるのは、せいぜい1桁です

  またリクエスト数を増やしても、１リクエストあたりのスループット[token/s]は、上昇しません

  そこで、リクエスト単位でも高速...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--R7JsXI5B--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25AB%25E3%2583%25ABLLM%25E9%25AB%2598%25E9%2580%259F%25E5%258C%2596%25EF%25BC%259AMTP%25E6%259C%2580%25E9%2580%259F%25EF%25BC%2581DDTree%2528%25E5%258A%25B9%25E7%258E%2587%25E7%2589%2588DFlash%2529%25E3%2582%2592%25E5%258B%2595%25E7%2594%25BB%25E3%2581%25A7%25E7%2590%2586%25E8%25A7%25A3%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:meme_dayo%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly96ZW5uLmRldi9pbWFnZXMvZGVmYXVsdC1wdWJsaWNhdGlvbi1hdmF0YXIucG5n%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E7%2589%2587%25E6%25A1%2590%25E3%2583%25BB%25E6%2598%259F%25E9%2587%258E%25E7%25A0%2594%25E7%25A9%25B6%25E5%25AE%25A4%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2U2ODU0MzVkZDkuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# ローカルLLM高速化：MTP最速！DDTree(効率版DFlash)を動画で理解

前提
まずローカルでLLMを使う場合、GPUの計算性能を最大限引き出すには
同時処理リクエスト数を数十～数百に維持する必要があります
同時リクエスト数が少ないと、LLMの重み等をGPUのSM（実際に計算を行う場所）に読みだす帯域幅がボトルネックとなってしまいます
クラウドでLLMを動かしAPIを提供する事業者は、ユーザをたくさん集めればリクエストを飽和させられますが、個人ユーザが複数のLLMエージェントを並列に稼働して有効に活用できるのは、せいぜい1桁です
またリクエスト数を増やしても、１リクエストあたりのスループット[token/s]は、上昇しません
そこで、リクエスト単位でも高速...
