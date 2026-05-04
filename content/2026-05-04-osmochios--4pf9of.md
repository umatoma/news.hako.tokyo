---
id: 4pf9of2h2wx1hpa7
title: 中学生が趣味で開発しているOS、mochiOS
url: 'https://zenn.dev/nekogakure/articles/5d88b39258e144'
source: zenn
published_at: '2026-05-04T06:14:04.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: >-
  こんにちは。趣味で低レイヤいじいじしてる中三のたそです。

  ここでは、自分が趣味で開発しているOSであるmochiOSを、今どこまでできているのか、他の自作OSと何が違うのか、アーキテクチャ、そしてこれから改善していきたいところをまとめています。

  mochiOSは、Rustを使用しておもに開発しているx86_64向けのOSです。名前の由来はこのOSでは「できるかぎりクラッシュしないこと」を目標にしていて、餅は柔らかくて伸びてもすぐにはちぎれたりしないのでmochiOSになりました。

  当たり前ですが、現時点で本当にクラッシュしないOSが完成しているわけではありません。むしろ今は、そのために必...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--G1Q6NnrQ--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E4%25B8%25AD%25E5%25AD%25A6%25E7%2594%259F%25E3%2581%258C%25E8%25B6%25A3%25E5%2591%25B3%25E3%2581%25A7%25E9%2596%258B%25E7%2599%25BA%25E3%2581%2597%25E3%2581%25A6%25E3%2581%2584%25E3%2582%258BOS%25E3%2580%2581mochiOS%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%259F%25E3%2581%259D%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzZjYjUyN2ZmYWYuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 中学生が趣味で開発しているOS、mochiOS

こんにちは。趣味で低レイヤいじいじしてる中三のたそです。
ここでは、自分が趣味で開発しているOSであるmochiOSを、今どこまでできているのか、他の自作OSと何が違うのか、アーキテクチャ、そしてこれから改善していきたいところをまとめています。
mochiOSは、Rustを使用しておもに開発しているx86_64向けのOSです。名前の由来はこのOSでは「できるかぎりクラッシュしないこと」を目標にしていて、餅は柔らかくて伸びてもすぐにはちぎれたりしないのでmochiOSになりました。
当たり前ですが、現時点で本当にクラッシュしないOSが完成しているわけではありません。むしろ今は、そのために必...
