---
id: 1xpswdhgjv307cbd
title: 今日のUITraitCollection
url: 'https://zenn.dev/tatsube/articles/92ecf68260d2fb'
source: zenn
published_at: '2026-04-26T11:21:13.000Z'
collected_at: '2026-04-27T22:24:49.345Z'
summary: >-
  SwiftUIの @Environment は、状態を環境変数として扱い、親ビューから子ビューへと効率的に流し込める非常に便利な仕組みです。

  実はUIKitにおいても、このコンセプトを体現する強力な仕組みは古くから備わっています。

  今回は、iOS 8から提供されている歴史あるAPIであり、iOS
  17での進化を経て開発者が独自の値を定義・伝播できる柔軟性を手に入れ、@Environmentのように任意の値を階層に流せる仕組みへと進化した
  UITraitCollection について解説します。

   UITraitCollectionとは？
  UITraitCollection は、いわば ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--W4vNFeKu--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_66:%25E4%25BB%258A%25E6%2597%25A5%25E3%2581%25AEUITraitCollection%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:tatsubee%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzNlODBlYTk4YzUuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 今日のUITraitCollection

SwiftUIの @Environment は、状態を環境変数として扱い、親ビューから子ビューへと効率的に流し込める非常に便利な仕組みです。
実はUIKitにおいても、このコンセプトを体現する強力な仕組みは古くから備わっています。
今回は、iOS 8から提供されている歴史あるAPIであり、iOS 17での進化を経て開発者が独自の値を定義・伝播できる柔軟性を手に入れ、@Environmentのように任意の値を階層に流せる仕組みへと進化した UITraitCollection について解説します。

 UITraitCollectionとは？
UITraitCollection は、いわば ...
