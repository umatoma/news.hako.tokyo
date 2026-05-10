---
id: 3blzlxt6f7f1b9je
title: 人間がMarkdownを書いたり修正しない時代に、Claude Code hookでドキュメントを自動でファンシーHTML化する
url: 'https://zenn.dev/uehaj/articles/claude-code-fancy-html-hook'
source: zenn
published_at: '2026-05-09T23:35:10.000Z'
collected_at: '2026-05-10T22:22:57.437Z'
summary: >-
  はじめに

  X 上で見かけた 「もう Markdown じゃなくて HTML でドキュメント書いた方がよくない？」 系の議論（@trq212
  のポスト等）には、まったく同感です。

  というのも、自分は もう半年ほど前から、Claude
  CodeにHTMLでドキュメント生成させています。エージェントを使えばつかうほど、その生成物を直接人間が修正することが減るからです。プランファイルがその典型で、プランがまちがっていたらそれはAIに指示して修正させるべきで手動修正するべきではないのです。その理由は手間を減らしたいからではなく、「なぜそう出力されたか」の理由にたちもどって指示しないとAIは同じ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--9w3zRqV5--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E4%25BA%25BA%25E9%2596%2593%25E3%2581%258CMarkdown%25E3%2582%2592%25E6%259B%25B8%25E3%2581%2584%25E3%2581%259F%25E3%2582%258A%25E4%25BF%25AE%25E6%25AD%25A3%25E3%2581%2597%25E3%2581%25AA%25E3%2581%2584%25E6%2599%2582%25E4%25BB%25A3%25E3%2581%25AB%25E3%2580%2581Claude%2520Code%2520hook%25E3%2581%25A7%25E3%2583%2589%25E3%2582%25AD%25E3%2583%25A5%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%25E3%2582%2592%25E8%2587%25AA%25E5%258B%2595%25E3%2581%25A7%25E3%2583%2595%25E3%2582%25A1%25E3%2583%25B3%25E3%2582%25B7%25E3%2583%25BC...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:Junji%2520Uehara%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2pxNHd0RGFSTVNVZHhYUHk1dmVfYWpnOWlqUkhyOHlwT2hEUUREPXMyNTAtYw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 人間がMarkdownを書いたり修正しない時代に、Claude Code hookでドキュメントを自動でファンシーHTML化する

はじめに
X 上で見かけた 「もう Markdown じゃなくて HTML でドキュメント書いた方がよくない？」 系の議論（@trq212 のポスト等）には、まったく同感です。
というのも、自分は もう半年ほど前から、Claude CodeにHTMLでドキュメント生成させています。エージェントを使えばつかうほど、その生成物を直接人間が修正することが減るからです。プランファイルがその典型で、プランがまちがっていたらそれはAIに指示して修正させるべきで手動修正するべきではないのです。その理由は手間を減らしたいからではなく、「なぜそう出力されたか」の理由にたちもどって指示しないとAIは同じ...
