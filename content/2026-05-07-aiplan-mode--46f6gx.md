---
id: 46f6gxgbhh9x9m4l
title: AIのPlan Modeをなんとなく承認しないために
url: 'https://zenn.dev/lv/articles/9438e1678c873a'
source: zenn
published_at: '2026-05-07T00:30:01.000Z'
collected_at: '2026-05-08T22:27:31.675Z'
summary: "TL;DR\n\nPlan Modeでも、Planを承認してよいかを判断する基準は人間側に必要\nその基準として、まず受け入れ条件を整理し、Planがそれを満たす内容かを見る\nAIには受け入れ条件を決めさせず、既存情報から候補を抽出させ、人間が根拠つきで整理する\n最後はAIの「\U0001F916 完了しました」ではなく、当初の受け入れ条件を満たしたかで判断する\n\n\n Plan Modeは便利だけど、そのPlanの正しさは別問題\nClaude CodeやCodexで実装するとき、Plan Modeを使う場面が増えてきました。\nいきなりファイルを書き換えられるより、先に実装計画を出してもらえるほうが安心です。..."
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--oPzi3cJR--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:AI%25E3%2581%25AEPlan%2520Mode%25E3%2582%2592%25E3%2581%25AA%25E3%2582%2593%25E3%2581%25A8%25E3%2581%25AA%25E3%2581%258F%25E6%2589%25BF%25E8%25AA%258D%25E3%2581%2597%25E3%2581%25AA%25E3%2581%2584%25E3%2581%259F%25E3%2582%2581%25E3%2581%25AB%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:oga_aiichiro%25EF%25BC%2588%25E5%25A4%25A7%25E8%25B3%2580%25E6%2584%259B%25E4%25B8%2580%25E9%2583%258E%25EF%25BC%2589%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzNhMDEwODY1NzkuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# AIのPlan Modeをなんとなく承認しないために

TL;DR

Plan Modeでも、Planを承認してよいかを判断する基準は人間側に必要
その基準として、まず受け入れ条件を整理し、Planがそれを満たす内容かを見る
AIには受け入れ条件を決めさせず、既存情報から候補を抽出させ、人間が根拠つきで整理する
最後はAIの「🤖 完了しました」ではなく、当初の受け入れ条件を満たしたかで判断する


 Plan Modeは便利だけど、そのPlanの正しさは別問題
Claude CodeやCodexで実装するとき、Plan Modeを使う場面が増えてきました。
いきなりファイルを書き換えられるより、先に実装計画を出してもらえるほうが安心です。...
