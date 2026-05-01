---
id: ajmzhy1tpcmsijqj
title: TypeScript で実装したワークフローの「正しさ」を Lean とランダムテストで検証する
url: 'https://zenn.dev/aishift/articles/a4bdf225a348e5'
source: zenn
published_at: '2026-04-30T14:00:05.000Z'
collected_at: '2026-05-01T22:24:05.089Z'
summary: >-
  TypeScript は、ワークフローのような処理を少量のコードで書けます。

  たとえば「あるノードから次のノードへ進む」という処理だけなら、数十行で実装できます。

  一方で、実装の規模が大きくなると、次のような不安が出てきます。


  ワークフローを扱う関数の間で、ワークフローに期待する意味がずれていないか

  テストしていない入力で、想定外の振る舞いをしないか

  実装を変更したとき、以前満たしていた性質を壊していないか


  この記事では、非常に小さなワークフローを題材にして、定理証明支援系 Lean を使い、TypeScript 実装が Lean
  で書いた基準となるモデルと一致するかを検査する方法を...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--dMeziMBm--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:TypeScript%2520%25E3%2581%25A7%25E5%25AE%259F%25E8%25A3%2585%25E3%2581%2597%25E3%2581%259F%25E3%2583%25AF%25E3%2583%25BC%25E3%2582%25AF%25E3%2583%2595%25E3%2583%25AD%25E3%2583%25BC%25E3%2581%25AE%25E3%2580%258C%25E6%25AD%25A3%25E3%2581%2597%25E3%2581%2595%25E3%2580%258D%25E3%2582%2592%2520Lean%2520%25E3%2581%25A8%25E3%2583%25A9%25E3%2583%25B3%25E3%2583%2580%25E3%2583%25A0%25E3%2583%2586%25E3%2582%25B9%25E3%2583%2588%25E3%2581%25A7%25E6%25A4%259C%25E8%25A8%25BC%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:amata1219%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzhhNDQwNmNlMGUuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:AI%2520Shift%2520Tech%2520Blog%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzEzZTlmM2JjMTYuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# TypeScript で実装したワークフローの「正しさ」を Lean とランダムテストで検証する

TypeScript は、ワークフローのような処理を少量のコードで書けます。
たとえば「あるノードから次のノードへ進む」という処理だけなら、数十行で実装できます。
一方で、実装の規模が大きくなると、次のような不安が出てきます。

ワークフローを扱う関数の間で、ワークフローに期待する意味がずれていないか
テストしていない入力で、想定外の振る舞いをしないか
実装を変更したとき、以前満たしていた性質を壊していないか

この記事では、非常に小さなワークフローを題材にして、定理証明支援系 Lean を使い、TypeScript 実装が Lean で書いた基準となるモデルと一致するかを検査する方法を...
