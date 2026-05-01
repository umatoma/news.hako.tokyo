---
id: 4rjodwvbhkkfm3df
title: terraform applyをGHAで実行してはいけない理由
url: 'https://zenn.dev/okazu_dm/articles/7d30c496c8fbb6'
source: zenn
published_at: '2026-04-30T12:02:19.000Z'
collected_at: '2026-05-01T22:24:05.089Z'
summary: >-
  terraform applyをGHAで実行してはいけない理由

  こんにちは、SREの@okazu_dmです。

  常日頃からGHAでterraform
  applyをするのはやめろと言い続けているのですが、最近GHAを起点とした攻撃が立て続けに起こっており、改めて文章の形でまとめておいた方がいいなと思ったので記事を書きました。

   はじめに
  2026年3月ごろから、GHAを攻撃の入り口として悪用する事例が目立っています。

  たとえば、以下のAeye Security Labの記事では、PRタイトル、ブランチ名、ファイル名など、外部から与えられる値をGHAの run
  ステップ内で不適切に展開し...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--sCv9zEKY--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:terraform%2520apply%25E3%2582%2592GHA%25E3%2581%25A7%25E5%25AE%259F%25E8%25A1%258C%25E3%2581%2597%25E3%2581%25A6%25E3%2581%25AF%25E3%2581%2584%25E3%2581%2591%25E3%2581%25AA%25E3%2581%2584%25E7%2590%2586%25E7%2594%25B1%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:okazu%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzJhNGI5MTMzNTcuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# terraform applyをGHAで実行してはいけない理由

terraform applyをGHAで実行してはいけない理由
こんにちは、SREの@okazu_dmです。
常日頃からGHAでterraform applyをするのはやめろと言い続けているのですが、最近GHAを起点とした攻撃が立て続けに起こっており、改めて文章の形でまとめておいた方がいいなと思ったので記事を書きました。

 はじめに
2026年3月ごろから、GHAを攻撃の入り口として悪用する事例が目立っています。
たとえば、以下のAeye Security Labの記事では、PRタイトル、ブランチ名、ファイル名など、外部から与えられる値をGHAの run ステップ内で不適切に展開し...
