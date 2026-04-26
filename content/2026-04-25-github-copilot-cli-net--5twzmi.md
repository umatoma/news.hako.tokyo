---
id: 5twzmi80qm42hqnc
title: 最近使っている GitHub Copilot CLI + .NET 向けのカスタムエージェントとスキル
url: 'https://zenn.dev/microsoft/articles/github-copilot-dotnet-project'
source: zenn
published_at: '2026-04-25T10:45:03.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  はじめに

  GitHub Copilot CLI や VS Code の Agent モードでコードを書くとき、copilot-instructions.md
  やカスタムエージェント、スキルを使ってプロジェクト固有の知識を教えておくと、Copilot
  が文脈を理解した上で動いてくれるので開発の精度がかなり上がります。

  自分は以前からこういった仕組みを活用して開発をしていて、以下の記事ではタスク管理の仕組みを紹介しました。

  https://zenn.dev/microsoft/articles/copilot-task-management

  今回は、最近自分が .NET プロジェクトの開...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--kNllfHR6--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E6%259C%2580%25E8%25BF%2591%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%2584%25E3%2582%258B%2520GitHub%2520Copilot%2520CLI%2520%252B%2520.NET%2520%25E5%2590%2591%25E3%2581%2591%25E3%2581%25AE%25E3%2582%25AB%25E3%2582%25B9%25E3%2582%25BF%25E3%2583%25A0%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E3%2581%25A8%25E3%2582%25B9%25E3%2582%25AD%25E3%2583%25AB%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:Kazuki%2520Ota%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2MzZDNiN2I3OGYuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Microsoft%2520%2528%25E6%259C%2589%25E5%25BF%2597%2529%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzhmNzg3NDJjNDQuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 最近使っている GitHub Copilot CLI + .NET 向けのカスタムエージェントとスキル

はじめに
GitHub Copilot CLI や VS Code の Agent モードでコードを書くとき、copilot-instructions.md やカスタムエージェント、スキルを使ってプロジェクト固有の知識を教えておくと、Copilot が文脈を理解した上で動いてくれるので開発の精度がかなり上がります。
自分は以前からこういった仕組みを活用して開発をしていて、以下の記事ではタスク管理の仕組みを紹介しました。
https://zenn.dev/microsoft/articles/copilot-task-management
今回は、最近自分が .NET プロジェクトの開...
