---
id: 18d4du6m51xjrwba
title: C#でJavaScriptEngine+ブラウザ自作した
url: 'https://zenn.dev/aakei/articles/my-scratch-browser'
source: zenn
published_at: '2026-05-05T08:17:48.000Z'
collected_at: '2026-05-06T22:24:05.668Z'
summary: >-
  !

  この記事の内容は2026/5/5時点のものです。

  文章を書くのが苦手なので、本文は半分以上AIに書いてもらいました。


   はじめに
  C# で JavaScript エンジンを書いていたら、最終的に簡単な Web サイトを表示して JavaScript
  も少し動くブラウザのようなものができました。

  WebView2 や Chromium Embedded Framework を使ったものではありません。JavaScript エンジン、DOM と
  JavaScript の接続、HTML/CSS から描画データへの変換、レイアウト、入力、HTTP リクエストまわりをほぼ C# で実装して...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--6WCiM8KZ--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:C%2523%25E3%2581%25A7JavaScriptEngine%252B%25E3%2583%2596%25E3%2583%25A9%25E3%2582%25A6%25E3%2582%25B6%25E8%2587%25AA%25E4%25BD%259C%25E3%2581%2597%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:akeit0%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzYzZWQ3M2RmOWEuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# C#でJavaScriptEngine+ブラウザ自作した

!
この記事の内容は2026/5/5時点のものです。
文章を書くのが苦手なので、本文は半分以上AIに書いてもらいました。


 はじめに
C# で JavaScript エンジンを書いていたら、最終的に簡単な Web サイトを表示して JavaScript も少し動くブラウザのようなものができました。
WebView2 や Chromium Embedded Framework を使ったものではありません。JavaScript エンジン、DOM と JavaScript の接続、HTML/CSS から描画データへの変換、レイアウト、入力、HTTP リクエストまわりをほぼ C# で実装して...
