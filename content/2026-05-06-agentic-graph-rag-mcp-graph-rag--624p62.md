---
id: 624p62tfycg7q8qo
title: Agentic Graph RAG MCPのススメ — Graph RAGは「単発」ではなく「対話」になった
url: 'https://zenn.dev/aircloset/articles/341dffee42f454'
source: zenn
published_at: '2026-05-06T23:58:38.000Z'
collected_at: '2026-05-08T22:27:31.675Z'
summary: >-
  みなさまこんにちは！エアークローゼットでCTOをしている辻です。

  これまでに DB Graph MCP、社内MCP群の全体像、Biz Graph、Sandbox MCP
  と、社内向けに作っているMCPサーバーを順に紹介してきました。

  DB Graph は ORM 解析からのスキーマグラフ、Biz Graph は会議スライドからの施策抽出と Week ノード設計、Sandbox MCP
  はそもそもアプリ公開基盤 ── 目的も実装も全部違うのですが、自分でも書きながら気づいたのは、設計の根っこにある考え方は同じだということです。

  今回はその根っこの話をします。Agentic Graph RA...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--OzbfTItZ--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Agentic%2520Graph%2520RAG%2520MCP%25E3%2581%25AE%25E3%2582%25B9%25E3%2582%25B9%25E3%2583%25A1%2520%25E2%2580%2594%2520Graph%2520RAG%25E3%2581%25AF%25E3%2580%258C%25E5%258D%2598%25E7%2599%25BA%25E3%2580%258D%25E3%2581%25A7%25E3%2581%25AF%25E3%2581%25AA%25E3%2581%258F%25E3%2580%258C%25E5%25AF%25BE%25E8%25A9%25B1%25E3%2580%258D%25E3%2581%25AB%25E3%2581%25AA%25E3%2581%25A3%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:%25E8%25BE%25BB%2520%25E4%25BA%25AE%25E4%25BD%2591%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzkxZjY1NmYzNDQuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2582%25A8%25E3%2582%25A2%25E3%2583%25BC%25E3%2582%25AF%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25BC%25E3%2583%2583%25E3%2583%2588%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2EyNzdkMDFjYWQuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Agentic Graph RAG MCPのススメ — Graph RAGは「単発」ではなく「対話」になった

みなさまこんにちは！エアークローゼットでCTOをしている辻です。
これまでに DB Graph MCP、社内MCP群の全体像、Biz Graph、Sandbox MCP と、社内向けに作っているMCPサーバーを順に紹介してきました。
DB Graph は ORM 解析からのスキーマグラフ、Biz Graph は会議スライドからの施策抽出と Week ノード設計、Sandbox MCP はそもそもアプリ公開基盤 ── 目的も実装も全部違うのですが、自分でも書きながら気づいたのは、設計の根っこにある考え方は同じだということです。
今回はその根っこの話をします。Agentic Graph RA...
