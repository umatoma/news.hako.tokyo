---
id: 26ok6zovgsle8o0g
title: 'Claude Code の Dynamic Workflows を触ってみた: マルチエージェント並列オーケストレーションの概念と体験'
url: 'https://zenn.dev/canly/articles/45da96250c7028'
source: zenn
published_at: '2026-05-29T08:19:59.000Z'
collected_at: '2026-05-30T12:23:11.935Z'
summary: >-
  本記事は 2026/5/29(日本時間)時点の公式ブログ[1]と公式 X 告知[2]に基づきます。Dynamic Workflows は リサーチプレビュー
  段階のため、仕様・利用条件は今後変わりうる点にご注意ください


   はじめに
  2026/5/29(日本時間)、Claude Code v2.1.154 で Dynamic
  Workflows(動的ワークフロー)がリサーチプレビューとして追加されました。同じ v2.1.154 で Opus 4.8 も公開 されており、Opus
  4.8 と同時の登場です[3]。

  ひとことで言うと、Claude がオーケストレーション用のスクリプトをそ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--6plj0aX6--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%2520%25E3%2581%25AE%2520Dynamic%2520Workflows%2520%25E3%2582%2592%25E8%25A7%25A6%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%253A%2520%25E3%2583%259E%25E3%2583%25AB%25E3%2583%2581%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E4%25B8%25A6%25E5%2588%2597%25E3%2582%25AA%25E3%2583%25BC%25E3%2582%25B1%25E3%2582%25B9%25E3%2583%2588%25E3%2583%25AC...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:%25E3%2581%25B5%25E3%2581%258F%25E3%2581%25A0%25EF%25BC%2588fukuda%2520ryu%25EF%25BC%2589%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2EwYjI3NWVjYTkuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2582%25AB%25E3%2583%25B3%25E3%2583%25AA%25E3%2583%25BC%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzEyMjRmMTIyZTMuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACMTiGT
---
# Claude Code の Dynamic Workflows を触ってみた: マルチエージェント並列オーケストレーションの概念と体験

本記事は 2026/5/29(日本時間)時点の公式ブログ[1]と公式 X 告知[2]に基づきます。Dynamic Workflows は リサーチプレビュー 段階のため、仕様・利用条件は今後変わりうる点にご注意ください


 はじめに
2026/5/29(日本時間)、Claude Code v2.1.154 で Dynamic Workflows(動的ワークフロー)がリサーチプレビューとして追加されました。同じ v2.1.154 で Opus 4.8 も公開 されており、Opus 4.8 と同時の登場です[3]。
ひとことで言うと、Claude がオーケストレーション用のスクリプトをそ...
