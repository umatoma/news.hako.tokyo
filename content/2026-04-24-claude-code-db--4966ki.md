---
id: 4966ki2y8m2pwo8d
title: Claude Code と二人七脚 DB 設計
url: 'https://zenn.dev/techtrain_blog/articles/0991bc406b58e2'
source: zenn
published_at: '2026-04-24T12:06:07.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: |-
  はじめに
  弊社では開発において、コード生成・レビュー段階の9割以上を AI に一任しています。
  しかし仕様設計・DB 設計においては、人間が主体です。
  今回は DB 設計段階において、私が Claude Code を如何様にしてこき使っているか、一例を紹介したいと思います。

   二人七脚とは
  私 + Claude Code (Agent + subagent 4つ) 体制のことです。
  以下の 4 step を完走した暁には DB 設計が完了している、夢の体制です。

  仕様とコードベースからユースケース列挙
  ユースケースのブラッシュアップと起票
  各問いの壁打ち
  subagent による...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--Vzm0U3l1--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%2520%25E3%2581%25A8%25E4%25BA%258C%25E4%25BA%25BA%25E4%25B8%2583%25E8%2584%259A%2520DB%2520%25E8%25A8%25AD%25E8%25A8%2588%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:choclucy%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzAxM2RmM2ZiYjAuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:TechTrain%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzc2ZDk5ZmNhZWQuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Code と二人七脚 DB 設計

はじめに
弊社では開発において、コード生成・レビュー段階の9割以上を AI に一任しています。
しかし仕様設計・DB 設計においては、人間が主体です。
今回は DB 設計段階において、私が Claude Code を如何様にしてこき使っているか、一例を紹介したいと思います。

 二人七脚とは
私 + Claude Code (Agent + subagent 4つ) 体制のことです。
以下の 4 step を完走した暁には DB 設計が完了している、夢の体制です。

仕様とコードベースからユースケース列挙
ユースケースのブラッシュアップと起票
各問いの壁打ち
subagent による...
