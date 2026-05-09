---
id: 53omvodkny0f7mu3
title: Claude Codeの失敗をチームルールに昇格させる仕組み
url: 'https://zenn.dev/dely_jp/articles/5bc3e9cf62d776'
source: zenn
published_at: '2026-05-07T07:35:04.000Z'
collected_at: '2026-05-09T22:22:03.353Z'
summary: >-
  はじめに

  こんにちは、クラシルのレシチャレを開発しているkiyokuroです。

  これまで、ルール設計・Safety
  Hook・サブエージェント・3エージェントハーネスのブログを書いてきました。前回の記事では3エージェントハーネスを取り入れて、実装のchunkを連鎖的に回すループまで辿り着きました。

  ただし、回り始めたループから出てくる「失敗」をどう活かすかには触れていませんでした。この記事では、Evaluatorが拾った失敗を個人ローカルに蓄積し、3件以上たまればチームルールに昇格させ、さらにセッション全体を振り返る仕組みを紹介します。

  Mitchell HashimotoがMy A...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--6QYB9B6M--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%25E3%2581%25AE%25E5%25A4%25B1%25E6%2595%2597%25E3%2582%2592%25E3%2583%2581%25E3%2583%25BC%25E3%2583%25A0%25E3%2583%25AB%25E3%2583%25BC%25E3%2583%25AB%25E3%2581%25AB%25E6%2598%2587%25E6%25A0%25BC%25E3%2581%2595%25E3%2581%259B%25E3%2582%258B%25E4%25BB%2595%25E7%25B5%2584%25E3%2581%25BF%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:kiyokuro%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzM3MDYyNjhkNmMuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Kurashiru%2520Tech%2520Blog%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTG1YR05GVlBEbm1QdHJDM3U5NUxiLXAzZFJFM0gtWXpUcWxWTjVHbDBFeDdXWXhwQ2Jadz1zOTYtYw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Codeの失敗をチームルールに昇格させる仕組み

はじめに
こんにちは、クラシルのレシチャレを開発しているkiyokuroです。
これまで、ルール設計・Safety Hook・サブエージェント・3エージェントハーネスのブログを書いてきました。前回の記事では3エージェントハーネスを取り入れて、実装のchunkを連鎖的に回すループまで辿り着きました。
ただし、回り始めたループから出てくる「失敗」をどう活かすかには触れていませんでした。この記事では、Evaluatorが拾った失敗を個人ローカルに蓄積し、3件以上たまればチームルールに昇格させ、さらにセッション全体を振り返る仕組みを紹介します。
Mitchell HashimotoがMy A...
