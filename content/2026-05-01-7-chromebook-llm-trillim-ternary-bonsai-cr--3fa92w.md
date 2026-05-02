---
id: 3fa92wb4hem66194
title: 7年前の Chromebook でローカルLLMは動くのか？ Trillim + Ternary Bonsai を Crostini で試す
url: 'https://zenn.dev/dateshim/articles/eb9b7bb8e53cc2'
source: zenn
published_at: '2026-05-01T12:30:56.000Z'
collected_at: '2026-05-02T22:19:46.960Z'
summary: >-
  !

  2026/5/2更新

  CLIチャットの様子、スロットリングの様子の動画を追加しました。


   記事の概要
  この記事は、Trillim v0.10.2 +
  Ternary-Bonsaiを、7年前のChromebook上のCrostini環境で動かした実機検証メモである。

  高性能GPUや新しいPCを使ったローカルLLM環境ではなく、低消費電力CPU・8GB
  RAM・サーマル制約のある古いChromebookで、どこまでローカルLLMチャットが成立するかを確認した。

   対象読者

  GPUなしPCでローカルLLMを動かしてみたい人

  古いChromebookや低消費電力PCの再活用に興味があ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--sXGjZxl5--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:7%25E5%25B9%25B4%25E5%2589%258D%25E3%2581%25AE%2520Chromebook%2520%25E3%2581%25A7%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25AB%25E3%2583%25ABLLM%25E3%2581%25AF%25E5%258B%2595%25E3%2581%258F%25E3%2581%25AE%25E3%2581%258B%25EF%25BC%259F%2520Trillim%2520%252B%2520Ternary%2520Bonsai%2520%25E3%2582%2592...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:Dateshim%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSXd5c2x5U0hqeU9qNU41dHo1TnJ6LXIxMXFpMHdxX0YzSUZ6UW9yenZicDFkUUhnPXM5Ni1j%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 7年前の Chromebook でローカルLLMは動くのか？ Trillim + Ternary Bonsai を Crostini で試す

!
2026/5/2更新
CLIチャットの様子、スロットリングの様子の動画を追加しました。


 記事の概要
この記事は、Trillim v0.10.2 + Ternary-Bonsaiを、7年前のChromebook上のCrostini環境で動かした実機検証メモである。
高性能GPUや新しいPCを使ったローカルLLM環境ではなく、低消費電力CPU・8GB RAM・サーマル制約のある古いChromebookで、どこまでローカルLLMチャットが成立するかを確認した。

 対象読者

GPUなしPCでローカルLLMを動かしてみたい人
古いChromebookや低消費電力PCの再活用に興味があ...
