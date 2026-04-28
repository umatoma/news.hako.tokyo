---
id: 1uqteildvngzee5j
title: 非エンジニアの「作りたい」と「安全に公開したい」を両立する Sandbox MCP を作った
url: 'https://zenn.dev/aircloset/articles/65efe9614f8e73'
source: zenn
published_at: '2026-04-27T23:02:32.000Z'
collected_at: '2026-04-28T22:27:18.688Z'
summary: >-
  みなさまこんにちは！エアークローゼットでCTOをしている辻です。

  これまでに DB Graph MCP、社内MCP群の全体像、Biz Graph MCP と、社内向けに作っている MCP サーバーを順に紹介してきました。

  今回はその中でもちょっと毛色が違うものを取り上げます。Sandbox MCP ── 非エンジニアの社員が AI
  と一緒に作ったアプリを、ワンコマンドで社内に安全に公開できるプラットフォームです。

  「Claude Code でアプリを作れるなら、それをそのまま社内に出せばいいじゃん」という話を、安全に実現する仕組みです。

   背景：作るのは簡単になったが、公開は難しいまま...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--qgnqq5qt--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E9%259D%259E%25E3%2582%25A8%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%258B%25E3%2582%25A2%25E3%2581%25AE%25E3%2580%258C%25E4%25BD%259C%25E3%2582%258A%25E3%2581%259F%25E3%2581%2584%25E3%2580%258D%25E3%2581%25A8%25E3%2580%258C%25E5%25AE%2589%25E5%2585%25A8%25E3%2581%25AB%25E5%2585%25AC%25E9%2596%258B%25E3%2581%2597%25E3%2581%259F%25E3%2581%2584%25E3%2580%258D%25E3%2582%2592%25E4%25B8%25A1%25E7%25AB%258B%25E3%2581%2599%25E3%2582%258B%2520Sandbox%2520MCP%2520%25E3%2582%2592%25E4%25BD%259C%25E3%2581%25A3%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:%25E8%25BE%25BB%2520%25E4%25BA%25AE%25E4%25BD%2591%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzkxZjY1NmYzNDQuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2582%25A8%25E3%2582%25A2%25E3%2583%25BC%25E3%2582%25AF%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25BC%25E3%2583%2583%25E3%2583%2588%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2EyNzdkMDFjYWQuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 非エンジニアの「作りたい」と「安全に公開したい」を両立する Sandbox MCP を作った

みなさまこんにちは！エアークローゼットでCTOをしている辻です。
これまでに DB Graph MCP、社内MCP群の全体像、Biz Graph MCP と、社内向けに作っている MCP サーバーを順に紹介してきました。
今回はその中でもちょっと毛色が違うものを取り上げます。Sandbox MCP ── 非エンジニアの社員が AI と一緒に作ったアプリを、ワンコマンドで社内に安全に公開できるプラットフォームです。
「Claude Code でアプリを作れるなら、それをそのまま社内に出せばいいじゃん」という話を、安全に実現する仕組みです。

 背景：作るのは簡単になったが、公開は難しいまま...
