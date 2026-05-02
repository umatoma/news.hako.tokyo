---
id: 3pjqdvyahrovpstf
title: 5年間のRails開発者がDDDに出会って考えが変わった話
url: 'https://zenn.dev/neoai/articles/b843fc78203295'
source: zenn
published_at: '2026-05-01T10:38:26.000Z'
collected_at: '2026-05-02T22:19:46.960Z'
summary: >-
  はじめに

  5年間、Ruby on RailsでMVC + Serviceパターンの
  API開発をしてきました。Railsの「規約に従えば爆速で動くものができる」という思想が好きで、その生産性の高さは強力な武器でした。

  そんな自分が、Python + FastAPIで構築されたDDDの実装パターン（Entity / Repository /
  UseCase）と、クリーンアーキテクチャをベースにしたプロダクトに関わることになりました。最初の印象は、正直に言って戸惑いでした。


  概念が難しい

  なんだか回りくどい

  1機能を追加するだけで変更ファイル数がやたらと多い


  「Railsならこれ、S...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--STN-aetr--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:5%25E5%25B9%25B4%25E9%2596%2593%25E3%2581%25AERails%25E9%2596%258B%25E7%2599%25BA%25E8%2580%2585%25E3%2581%258CDDD%25E3%2581%25AB%25E5%2587%25BA%25E4%25BC%259A%25E3%2581%25A3%25E3%2581%25A6%25E8%2580%2583%25E3%2581%2588%25E3%2581%258C%25E5%25A4%2589%25E3%2582%258F%25E3%2581%25A3%25E3%2581%259F%25E8%25A9%25B1%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:Kazuki%2520Ogushi%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2ZjZjY5YTdmZDIuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:neoAI%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2ZmNTkwNmNmN2QuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 5年間のRails開発者がDDDに出会って考えが変わった話

はじめに
5年間、Ruby on RailsでMVC + Serviceパターンの API開発をしてきました。Railsの「規約に従えば爆速で動くものができる」という思想が好きで、その生産性の高さは強力な武器でした。
そんな自分が、Python + FastAPIで構築されたDDDの実装パターン（Entity / Repository / UseCase）と、クリーンアーキテクチャをベースにしたプロダクトに関わることになりました。最初の印象は、正直に言って戸惑いでした。

概念が難しい
なんだか回りくどい
1機能を追加するだけで変更ファイル数がやたらと多い

「Railsならこれ、S...
