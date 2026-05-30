---
id: p9r2wf17xex8hvue
title: LiteLLMをやめて自作Goバイナリに置き換えたら一気に軽くなりました - 「実践 AI エージェント開発」を実装してみた
url: 'https://zenn.dev/okamyuji/articles/golang-litellm-alternative-single-binary'
source: zenn
published_at: '2026-05-28T22:02:24.000Z'
collected_at: '2026-05-30T12:23:11.935Z'
summary: >-
  !

  オライリー・ジャパンから「実践 AI エージェント開発」として日本語版が出版されたことを記念して、今年の春に英語版の"Building
  Applications with AI
  Agents"を読んでいたので、本書が示す本番運用要件をそのままGoの単一バイナリAIエージェントに実装してみました。本記事では、まず自分の手元用に書き上げた最小構成を紹介し、そのあとで書籍を読んで補ったプロダクション向け機能を、書籍の章立てに対応する実装順で解説します。


   できあがったもの
  Go 1.25で書いたgo-llm-agentというシングルバイナリのAIエージェントを公開しました。CGO_EN...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--CXf9exAw--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:LiteLLM%25E3%2582%2592%25E3%2582%2584%25E3%2582%2581%25E3%2581%25A6%25E8%2587%25AA%25E4%25BD%259CGo%25E3%2583%2590%25E3%2582%25A4%25E3%2583%258A%25E3%2583%25AA%25E3%2581%25AB%25E7%25BD%25AE%25E3%2581%258D%25E6%258F%259B%25E3%2581%2588%25E3%2581%259F%25E3%2582%2589%25E4%25B8%2580%25E6%25B0%2597%25E3%2581%25AB%25E8%25BB%25BD%25E3%2581%258F%25E3%2581%25AA%25E3%2582%258A%25E3%2581%25BE%25E3%2581%2597%25E3%2581%259F%2520-%2520%25E3%2580%258C%25E5%25AE%259F%25E8%25B7%25B5%2520AI%2520%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E9%2596%258B%25E7%2599%25BA%25E3%2580%258D%25E3%2582%2592%25E5%25AE%259F...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:okamyuji%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzY5YjFmNDYyYjkuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACMTiGT
---
# LiteLLMをやめて自作Goバイナリに置き換えたら一気に軽くなりました - 「実践 AI エージェント開発」を実装してみた

!
オライリー・ジャパンから「実践 AI エージェント開発」として日本語版が出版されたことを記念して、今年の春に英語版の"Building Applications with AI Agents"を読んでいたので、本書が示す本番運用要件をそのままGoの単一バイナリAIエージェントに実装してみました。本記事では、まず自分の手元用に書き上げた最小構成を紹介し、そのあとで書籍を読んで補ったプロダクション向け機能を、書籍の章立てに対応する実装順で解説します。


 できあがったもの
Go 1.25で書いたgo-llm-agentというシングルバイナリのAIエージェントを公開しました。CGO_EN...
