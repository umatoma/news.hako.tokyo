---
id: 3ucwp1164eo1a1lr
title: OpenClawとHermesの違いを思想から理解する
url: 'https://zenn.dev/mkj/articles/9431e342db202f'
source: zenn
published_at: '2026-04-27T02:50:05.000Z'
collected_at: '2026-04-27T22:24:49.345Z'
summary: >-
  松尾研究所シニアデータサイエンティストの太田です。普段はLLMの事後学習に関するプロジェクトに携わっています。

  現在松尾研究所では各種業務をメンバーに代わって自律的に代行するパーソナルエージェントの社内開発に取り組んでいます。この記事ではそうした開発のなかで調査をしたOpenClawとHermesについて、思想の違いとデザインチョイスを主に共有したいと思います。

  !

  この記事のターゲット


  OpenClawやHermesを名前は知っているが違いがよくわからない人

  AIエージェントの「アーキテクチャ」（あるいは「ハーネス」）に興味がある人

  組織内でClaw活用を検討している人


  なおこの記...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--cHl5tgFY--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:OpenClaw%25E3%2581%25A8Hermes%25E3%2581%25AE%25E9%2581%2595%25E3%2581%2584%25E3%2582%2592%25E6%2580%259D%25E6%2583%25B3%25E3%2581%258B%25E3%2582%2589%25E7%2590%2586%25E8%25A7%25A3%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:mikio%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2U2NGM3ZTBkMzIuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/g_south_west%2Ch_34%2Cl_default:og-publication-pro-mark-xcosax%2Cw_34%2Cx_217%2Cy_158/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E6%259D%25BE%25E5%25B0%25BE%25E7%25A0%2594%25E7%25A9%25B6%25E6%2589%2580%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_255%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlMzYUdUQi0wYTN2ZFRMNXJmd0hYR25lNzFVempxTlFMbFhrZDFRdE9ldWo5TlZsNTE9czk2LWM=%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# OpenClawとHermesの違いを思想から理解する

松尾研究所シニアデータサイエンティストの太田です。普段はLLMの事後学習に関するプロジェクトに携わっています。
現在松尾研究所では各種業務をメンバーに代わって自律的に代行するパーソナルエージェントの社内開発に取り組んでいます。この記事ではそうした開発のなかで調査をしたOpenClawとHermesについて、思想の違いとデザインチョイスを主に共有したいと思います。
!
この記事のターゲット

OpenClawやHermesを名前は知っているが違いがよくわからない人
AIエージェントの「アーキテクチャ」（あるいは「ハーネス」）に興味がある人
組織内でClaw活用を検討している人

なおこの記...
