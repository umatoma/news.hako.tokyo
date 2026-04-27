---
id: 4ahoa85oh19peezc
title: Matz の Ruby AOT コンパイラ Spinel を試してみました
url: 'https://zenn.dev/geeknees/articles/edc3cb36ea251c'
source: zenn
published_at: '2026-04-26T06:34:35.000Z'
collected_at: '2026-04-27T22:24:49.345Z'
summary: >-
  RubyKaigi 2026 に参加して、Matz のキーノートで Spinel の発表を聞きました。Spinel は Ruby の AOT
  コンパイラで、Ruby のコードを読み、C のコードを生成し、最後は native binary として実行できる形にします。Ruby
  を書いている人間としては、「Ruby の AOT コンパイラ」という言葉だけでテンションが上がります。

  Ruby
  はかなり動的な言語でもあります。メソッド呼び出し、クラスの再オープン、メタプログラミング、eval、実行時に変わるオブジェクトの形。普通に考えると、AOT
  コンパイルとは相性が悪そうに見えます。

  それで...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--nD6xnCDC--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Matz%2520%25E3%2581%25AE%2520Ruby%2520AOT%2520%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%2591%25E3%2582%25A4%25E3%2583%25A9%2520Spinel%2520%25E3%2582%2592%25E8%25A9%25A6%25E3%2581%2597%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%25BE%25E3%2581%2597%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:geeknees%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzA2MzFhY2QzYWIuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Matz の Ruby AOT コンパイラ Spinel を試してみました

RubyKaigi 2026 に参加して、Matz のキーノートで Spinel の発表を聞きました。Spinel は Ruby の AOT コンパイラで、Ruby のコードを読み、C のコードを生成し、最後は native binary として実行できる形にします。Ruby を書いている人間としては、「Ruby の AOT コンパイラ」という言葉だけでテンションが上がります。
Ruby はかなり動的な言語でもあります。メソッド呼び出し、クラスの再オープン、メタプログラミング、eval、実行時に変わるオブジェクトの形。普通に考えると、AOT コンパイルとは相性が悪そうに見えます。
それで...
