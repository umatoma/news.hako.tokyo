---
id: 3piueq0nqrcawmnl
title: Custom Agents と Subagents で始める自律オーケストレーション入門
url: 'https://zenn.dev/tomokusaba/articles/8d9f4b3cdd996e'
source: zenn
published_at: '2026-04-24T12:28:16.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  はじめに

  少し前に、私は次の記事を書きました。

  https://zenn.dev/tomokusaba/articles/838cdac8d71e52

  そこでは「GitHub Copilot CLI は機能全体の実装に強く、VS Code Agent Mode
  は小さな修正に強い」という、作業粒度での使い分けを整理しました。それ自体は有効だと感じています。

  ただ、最近の VS Code 側のアップデートで Custom Agents と Subagents（サブエージェント）
  が一段と使いやすくなり、私の運用は少し進化しました。やりたいことが明確なときは、自然言語でメインエージェント...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--Lj8zuRHM--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Custom%2520Agents%2520%25E3%2581%25A8%2520Subagents%2520%25E3%2581%25A7%25E5%25A7%258B%25E3%2582%2581%25E3%2582%258B%25E8%2587%25AA%25E5%25BE%258B%25E3%2582%25AA%25E3%2583%25BC%25E3%2582%25B1%25E3%2582%25B9%25E3%2583%2588%25E3%2583%25AC%25E3%2583%25BC%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25B3%25E5%2585%25A5%25E9%2596%2580%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%258F%25E3%2581%2595%25E3%2581%25B0%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WUJDVlplMms4MC1qdlNsSzlTS3cwN21GdDU5aF91dmx5VDJ4NUVyQT1zOTYtYw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Custom Agents と Subagents で始める自律オーケストレーション入門

はじめに
少し前に、私は次の記事を書きました。
https://zenn.dev/tomokusaba/articles/838cdac8d71e52
そこでは「GitHub Copilot CLI は機能全体の実装に強く、VS Code Agent Mode は小さな修正に強い」という、作業粒度での使い分けを整理しました。それ自体は有効だと感じています。
ただ、最近の VS Code 側のアップデートで Custom Agents と Subagents（サブエージェント） が一段と使いやすくなり、私の運用は少し進化しました。やりたいことが明確なときは、自然言語でメインエージェント...
