---
id: 5swrkspvfa8ae4n5
title: AWS Security AgentでAIによるレビューとペネトレーションテストをやってみた
url: 'https://zenn.dev/kymx1983/articles/20260502-aws-security-agent-pentest'
source: zenn
published_at: '2026-05-02T13:28:46.000Z'
collected_at: '2026-05-03T22:20:50.855Z'
summary: >-
  1. はじめに

  この記事では、re:Invent 2025 でプレビュー発表され、2026年3月にペネトレーションテスト機能が GA となった AWS Security
  Agent を、意図的に脆弱な FastAPI アプリに対して動作させ、設計レビュー・コードレビュー・ペネトレーションテストの3機能で 何が起きるのか
  どんな結果が得られるのか を、画面と検出結果ベースで紹介します。

  !

  実際に手を動かしたい方へ: サンプルアプリのコード作成・CloudFormation テンプレート・git
  push・ペネトレーションテストの実行手順までを再現できる形でまとめた Zenn Book...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--v_RjM8Lc--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:AWS%2520Security%2520Agent%25E3%2581%25A7AI%25E3%2581%25AB%25E3%2582%2588%25E3%2582%258B%25E3%2583%25AC%25E3%2583%2593%25E3%2583%25A5%25E3%2583%25BC%25E3%2581%25A8%25E3%2583%259A%25E3%2583%258D%25E3%2583%2588%25E3%2583%25AC%25E3%2583%25BC%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25B3%25E3%2583%2586%25E3%2582%25B9%25E3%2583%2588%25E3%2582%2592%25E3%2582%2584%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E5%25B0%258F%25E5%25B1%25B1%25E9%259B%2584%25E5%25A4%25AA%25EF%25BC%2588%25E6%25A0%25AA%25E5%25BC%258F%25E4%25BC%259A%25E7%25A4%25BERE-HEART%25EF%25BC%2589%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzdkZDE3MmYyNzkuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# AWS Security AgentでAIによるレビューとペネトレーションテストをやってみた

1. はじめに
この記事では、re:Invent 2025 でプレビュー発表され、2026年3月にペネトレーションテスト機能が GA となった AWS Security Agent を、意図的に脆弱な FastAPI アプリに対して動作させ、設計レビュー・コードレビュー・ペネトレーションテストの3機能で 何が起きるのか どんな結果が得られるのか を、画面と検出結果ベースで紹介します。
!
実際に手を動かしたい方へ: サンプルアプリのコード作成・CloudFormation テンプレート・git push・ペネトレーションテストの実行手順までを再現できる形でまとめた Zenn Book...
