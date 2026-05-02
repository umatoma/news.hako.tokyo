---
id: xu5stp2tcjxztxyc
title: Neovim 0.11 -> 0.12へアップデートする際の勘所とnvim-treesitterの扱い
url: 'https://zenn.dev/tttol/articles/2881b678ee005b'
source: zenn
published_at: '2026-05-01T12:48:15.000Z'
collected_at: '2026-05-02T22:19:46.960Z'
summary: |-
  !
  この記事はVim駅伝の2026-05-04の記事です。
  Vim駅伝は常に参加者を募集しています。詳しくはこちらのページをご覧ください。


   TL;DR
  Neovim 0.12系ではnvim-treesitter周辺の事情が大きく変わったので気をつけましょう。
  なんとなくでtreesitterを使ってる人（私）は改めてプラグインへの理解を深めるチャンスです。

   Neovim 0.12.2にアップデートするとnvim-treesitterの周辺でエラーが多発
  事の発端は自端末のNeovimを0.11系から0.12系にアップデートしたことでした。
  0.12.2にアップデートして、とある...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--VIH8uarv--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Neovim%25200.11%2520-%253E%25200.12%25E3%2581%25B8%25E3%2582%25A2%25E3%2583%2583%25E3%2583%2597%25E3%2583%2587%25E3%2583%25BC%25E3%2583%2588%25E3%2581%2599%25E3%2582%258B%25E9%259A%259B%25E3%2581%25AE%25E5%258B%2598%25E6%2589%2580%25E3%2581%25A8nvim-treesitter%25E3%2581%25AE%25E6%2589%25B1%25E3%2581%2584%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:tttol%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzk1ZTU0YmMwNzAuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Neovim 0.11 -> 0.12へアップデートする際の勘所とnvim-treesitterの扱い

!
この記事はVim駅伝の2026-05-04の記事です。
Vim駅伝は常に参加者を募集しています。詳しくはこちらのページをご覧ください。


 TL;DR
Neovim 0.12系ではnvim-treesitter周辺の事情が大きく変わったので気をつけましょう。
なんとなくでtreesitterを使ってる人（私）は改めてプラグインへの理解を深めるチャンスです。

 Neovim 0.12.2にアップデートするとnvim-treesitterの周辺でエラーが多発
事の発端は自端末のNeovimを0.11系から0.12系にアップデートしたことでした。
0.12.2にアップデートして、とある...
