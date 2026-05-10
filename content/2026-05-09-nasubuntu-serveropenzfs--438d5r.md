---
id: 438d5r2rzjkjzc00
title: 自作NASを構築した（Ubuntu Server+OpenZFS）
url: 'https://zenn.dev/neet/articles/903f811223936a'
source: zenn
published_at: '2026-05-09T15:24:13.000Z'
collected_at: '2026-05-10T22:22:57.437Z'
summary: >-
  こんにちは。みなさんはどんなストレージを使っていますか？

  筆者は主としてApple製品を使っているため、iCloud上のストレージ200GBのために、毎月1200円も支払っています[1]。このまま毎月1200円も支払い続けたら、1年で1.5万円、10年で15万円も、自分のものではないストレージのために支払い続けることになります。

  というわけで、一念発起して、NASサーバーを導入することにしました。この記事では、NASを組み立てるまでの流れと、その後のソフトウェア面での構築について説明します。

   サーバとして使うマシンを用意する
  自作PCをNASとする、いわば自作NASを作るにあたって、...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--f3xJ7Odt--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E8%2587%25AA%25E4%25BD%259CNAS%25E3%2582%2592%25E6%25A7%258B%25E7%25AF%2589%25E3%2581%2597%25E3%2581%259F%25EF%25BC%2588Ubuntu%2520Server%252BOpenZFS%25EF%25BC%2589%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:Ry%25C5%258D%2520Igarashi%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzViNmY4MzRlMDUuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 自作NASを構築した（Ubuntu Server+OpenZFS）

こんにちは。みなさんはどんなストレージを使っていますか？
筆者は主としてApple製品を使っているため、iCloud上のストレージ200GBのために、毎月1200円も支払っています[1]。このまま毎月1200円も支払い続けたら、1年で1.5万円、10年で15万円も、自分のものではないストレージのために支払い続けることになります。
というわけで、一念発起して、NASサーバーを導入することにしました。この記事では、NASを組み立てるまでの流れと、その後のソフトウェア面での構築について説明します。

 サーバとして使うマシンを用意する
自作PCをNASとする、いわば自作NASを作るにあたって、...
