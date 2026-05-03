---
id: 1rg6gw8ozg1op6pv
title: GPT-5.5 にも『指示の型』を ─ 3 モード Agent Skill とコスト最適化ルーティング
url: 'https://zenn.dev/shinyay/articles/gpt-5-5-prompt-optimization-copilot-skill'
source: zenn
published_at: '2026-05-02T06:36:30.000Z'
collected_at: '2026-05-03T22:20:50.855Z'
summary: >-
  はじめに

  少し前に、GitHub Copilot から Claude Opus 4.7 を使うときに「モデルが変われば指示も変わる」というテーマで記事を書きました
  (モデルが変われば指示も変わる ─ Opus 4.7 向け Agent Skill を作った)。そこで作った claude-prompt-optimizer
  は、4.7 の特性を踏まえた「5 スロットブリーフ」を Agent Skill として再利用できるようにしたものでした。

  今度は同じ問題を、OpenAI GPT-5.5 で考えます。

  GPT-5.5 にも公式の GPT-5.5 prompting guide がありま...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--XBMcvAOe--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:GPT-5.5%2520%25E3%2581%25AB%25E3%2582%2582%25E3%2580%258E%25E6%258C%2587%25E7%25A4%25BA%25E3%2581%25AE%25E5%259E%258B%25E3%2580%258F%25E3%2582%2592%2520%25E2%2594%2580%25203%2520%25E3%2583%25A2%25E3%2583%25BC%25E3%2583%2589%2520Agent%2520Skill%2520%25E3%2581%25A8%25E3%2582%25B3%25E3%2582%25B9%25E3%2583%2588%25E6%259C%2580%25E9%2581%25A9%25E5%258C%2596%25E3%2583%25AB%25E3%2583%25BC%25E3%2583%2586%25E3%2582%25A3%25E3%2583%25B3%25E3%2582%25B0%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:shinyay%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzI3YzVmM2E1OTYuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# GPT-5.5 にも『指示の型』を ─ 3 モード Agent Skill とコスト最適化ルーティング

はじめに
少し前に、GitHub Copilot から Claude Opus 4.7 を使うときに「モデルが変われば指示も変わる」というテーマで記事を書きました (モデルが変われば指示も変わる ─ Opus 4.7 向け Agent Skill を作った)。そこで作った claude-prompt-optimizer は、4.7 の特性を踏まえた「5 スロットブリーフ」を Agent Skill として再利用できるようにしたものでした。
今度は同じ問題を、OpenAI GPT-5.5 で考えます。
GPT-5.5 にも公式の GPT-5.5 prompting guide がありま...
