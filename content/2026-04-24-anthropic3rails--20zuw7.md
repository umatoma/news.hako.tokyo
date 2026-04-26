---
id: 20zuw70gx21osz1t
title: Anthropicの3エージェントハーネスをRailsに取り入れる
url: 'https://zenn.dev/dely_jp/articles/a45bc3a9e69ab1'
source: zenn
published_at: '2026-04-24T07:50:06.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  はじめに

  こんにちは、クラシルでレシチャレの開発をしているkiyokuroです。

  前回の記事では、Claude CodeのHooksでSafety Hookを実装し、決定論的なガードレールを敷いた話を紹介しました。ルール設計、Safety
  Hook、サブエージェントによる設計調査の自動化と進めてきましたが、1つ残っていた課題がありました。「次にどのskillを実行するか」を人間が判断し、順番に起動していたことです。

  この記事では、Anthropicが公開した3エージェントハーネス（Planner / Generator /
  Evaluator）の設計を自分たちのRailsプロジェクト...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--jFQlSyZL--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Anthropic%25E3%2581%25AE3%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E3%2583%258F%25E3%2583%25BC%25E3%2583%258D%25E3%2582%25B9%25E3%2582%2592Rails%25E3%2581%25AB%25E5%258F%2596%25E3%2582%258A%25E5%2585%25A5%25E3%2582%258C%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:kiyokuro%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzM3MDYyNjhkNmMuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Kurashiru%2520Tech%2520Blog%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTG1YR05GVlBEbm1QdHJDM3U5NUxiLXAzZFJFM0gtWXpUcWxWTjVHbDBFeDdXWXhwQ2Jadz1zOTYtYw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Anthropicの3エージェントハーネスをRailsに取り入れる

はじめに
こんにちは、クラシルでレシチャレの開発をしているkiyokuroです。
前回の記事では、Claude CodeのHooksでSafety Hookを実装し、決定論的なガードレールを敷いた話を紹介しました。ルール設計、Safety Hook、サブエージェントによる設計調査の自動化と進めてきましたが、1つ残っていた課題がありました。「次にどのskillを実行するか」を人間が判断し、順番に起動していたことです。
この記事では、Anthropicが公開した3エージェントハーネス（Planner / Generator / Evaluator）の設計を自分たちのRailsプロジェクト...
