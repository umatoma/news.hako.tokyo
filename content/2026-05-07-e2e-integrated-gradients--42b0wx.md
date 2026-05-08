---
id: 42b0wxsf8vw0fx8s
title: 自動運転E2Eモデルは何を見ているのか — Integrated Gradientsによる解釈
url: 'https://zenn.dev/turing_motors/articles/5d0e3e86c91c46'
source: zenn
published_at: '2026-05-07T06:08:20.000Z'
collected_at: '2026-05-08T22:27:31.675Z'
summary: >-
  はじめに


  Integrated GradientsによるE2E自動運転モデルの判断根拠の可視化の様子。

  深層学習モデルは画像認識、自然言語処理、自動運転における行動予測など幅広い分野で人間を超える精度を達成しつつありますが、その判断根拠は依然としてブラックボックスです。「なぜこの予測になったのか？」をモデル自身に説明させる技術は
  XAI（Explainable AI / 説明可能なAI） と呼ばれ、モデルのデバッグ・信頼性向上・安全性担保の観点でますます重要性が高まっています。

  本記事では、XAI手法の中でも理論的な裏付けが明確で、実装もシンプルな Integrated Gradi...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--kdc2JKZk--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E8%2587%25AA%25E5%258B%2595%25E9%2581%258B%25E8%25BB%25A2E2E%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AF%25E4%25BD%2595%25E3%2582%2592%25E8%25A6%258B%25E3%2581%25A6%25E3%2581%2584%25E3%2582%258B%25E3%2581%25AE%25E3%2581%258B%2520%25E2%2580%2594%2520Integrated%2520Gradients%25E3%2581%25AB%25E3%2582%2588%25E3%2582%258B%25E8%25A7%25A3%25E9%2587%2588%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:tmori%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2VhNmQ4MDk1OGQuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Tech%2520Blog%2520-%2520Turing%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Zk5XalFySktHaWFtVzZkZTFwLTV4TGJjdlBZenBOazJDdnlxU3FLdjhpPXM5Ni1j%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 自動運転E2Eモデルは何を見ているのか — Integrated Gradientsによる解釈

はじめに

Integrated GradientsによるE2E自動運転モデルの判断根拠の可視化の様子。
深層学習モデルは画像認識、自然言語処理、自動運転における行動予測など幅広い分野で人間を超える精度を達成しつつありますが、その判断根拠は依然としてブラックボックスです。「なぜこの予測になったのか？」をモデル自身に説明させる技術は XAI（Explainable AI / 説明可能なAI） と呼ばれ、モデルのデバッグ・信頼性向上・安全性担保の観点でますます重要性が高まっています。
本記事では、XAI手法の中でも理論的な裏付けが明確で、実装もシンプルな Integrated Gradi...
