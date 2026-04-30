---
id: 6dd1szt5yo2y608t
title: 高品質音楽生成AI【ACE-Step-1.5】で「破綻の微修正」に特化した新機能を提案する【Retake】
url: 'https://zenn.dev/asap/articles/948526de2faa62'
source: zenn
published_at: '2026-04-29T17:11:45.000Z'
collected_at: '2026-04-30T22:26:14.310Z'
summary: |-
  ACE-Step-1.5で使える新機能を考案しました。
  高品質音楽生成AI【ACE-Step-1.5】で「破綻の微修正」に特化した新機能【Retake】を開発しました。
  ぜひ、既存のRepaint機能との違いを確認してください。最後がRetakeです。
  記事の後半でも、別の曲で比較していますので、ぜひご覧ください。
  https://youtu.be/FgBosNFs4VY

   はじめに
  前回、ACE-Step-1.5のText2MusicとRepaintをPythonスクリプトから使う話を書きました。
  あれはあれでかなり便利だったのですが、実際に曲を作っていると、どうしても最後に残る...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--Nnbo0k6F--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E9%25AB%2598%25E5%2593%2581%25E8%25B3%25AA%25E9%259F%25B3%25E6%25A5%25BD%25E7%2594%259F%25E6%2588%2590AI%25E3%2580%2590ACE-Step-1.5%25E3%2580%2591%25E3%2581%25A7%25E3%2580%258C%25E7%25A0%25B4%25E7%25B6%25BB%25E3%2581%25AE%25E5%25BE%25AE%25E4%25BF%25AE%25E6%25AD%25A3%25E3%2580%258D%25E3%2581%25AB%25E7%2589%25B9%25E5%258C%2596%25E3%2581%2597%25E3%2581%259F%25E6%2596%25B0%25E6%25A9%259F%25E8%2583%25BD%25E3%2582%2592%25E6%258F%2590%25E6%25A1%2588%25E3%2581%2599%25E3%2582%258B%25E3%2580%2590Retake%25E3%2580%2591%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:asap%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2VhYjVhYTQ1MTkuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 高品質音楽生成AI【ACE-Step-1.5】で「破綻の微修正」に特化した新機能を提案する【Retake】

ACE-Step-1.5で使える新機能を考案しました。
高品質音楽生成AI【ACE-Step-1.5】で「破綻の微修正」に特化した新機能【Retake】を開発しました。
ぜひ、既存のRepaint機能との違いを確認してください。最後がRetakeです。
記事の後半でも、別の曲で比較していますので、ぜひご覧ください。
https://youtu.be/FgBosNFs4VY

 はじめに
前回、ACE-Step-1.5のText2MusicとRepaintをPythonスクリプトから使う話を書きました。
あれはあれでかなり便利だったのですが、実際に曲を作っていると、どうしても最後に残る...
