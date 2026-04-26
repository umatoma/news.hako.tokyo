---
id: 19o16cymmpq3vvuw
title: GeminiやChatGPTで画像生成できる時代に、わざわざローカルで動かす理由
url: 'https://zenn.dev/acntechjp/articles/a7c12b3114f56a'
source: zenn
published_at: '2026-04-24T06:45:41.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  執筆者：Hideyuki Goto

  2026年3月現在、画像生成AIを利用するハードルは、もうほぼゼロに近いと言っていいでしょう。GeminiやChatGPTを開き、ブラウザから自然言語のプロンプトを投げれば、わずか数秒で画像が返ってきます。

  それでも私は、趣味の個人開発やクリエイティブワークにおいて、あえて「ComfyUI」というツールを使い、ローカル環境で画像生成を動かし続けています。数十秒から数分かけて1枚の画像を生成しながら。

  なぜ、わざわざそんな面倒なことをするのか。一言で言えば、マネージドなクラウドサービスでは「意図通りに細部を制御する」ことに明確な天井があるからです。

  本記...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--WzgL-kjB--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Gemini%25E3%2582%2584ChatGPT%25E3%2581%25A7%25E7%2594%25BB%25E5%2583%258F%25E7%2594%259F%25E6%2588%2590%25E3%2581%25A7%25E3%2581%258D%25E3%2582%258B%25E6%2599%2582%25E4%25BB%25A3%25E3%2581%25AB%25E3%2580%2581%25E3%2582%258F%25E3%2581%2596%25E3%2582%258F%25E3%2581%2596%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25AB%25E3%2583%25AB%25E3%2581%25A7%25E5%258B%2595%25E3%2581%258B%25E3%2581%2599%25E7%2590%2586%25E7%2594%25B1%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:TGP_CDAI%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2U2ZDA4MDY5ODcuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/g_south_west%2Ch_34%2Cl_default:og-publication-pro-mark-xcosax%2Cw_34%2Cx_217%2Cy_158/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Accenture%2520Japan%2520%2528%25E6%259C%2589%25E5%25BF%2597%2529%2Cx_255%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlkwTVEwWDE5WE1COHdLc3Rtak1kbnNnYV9ZeHQ1RmxrRFNUR01kb3pxU3h4dHpnPXMyNTAtYw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# GeminiやChatGPTで画像生成できる時代に、わざわざローカルで動かす理由

執筆者：Hideyuki Goto
2026年3月現在、画像生成AIを利用するハードルは、もうほぼゼロに近いと言っていいでしょう。GeminiやChatGPTを開き、ブラウザから自然言語のプロンプトを投げれば、わずか数秒で画像が返ってきます。
それでも私は、趣味の個人開発やクリエイティブワークにおいて、あえて「ComfyUI」というツールを使い、ローカル環境で画像生成を動かし続けています。数十秒から数分かけて1枚の画像を生成しながら。
なぜ、わざわざそんな面倒なことをするのか。一言で言えば、マネージドなクラウドサービスでは「意図通りに細部を制御する」ことに明確な天井があるからです。
本記...
