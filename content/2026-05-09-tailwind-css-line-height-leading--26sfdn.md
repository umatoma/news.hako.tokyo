---
id: 26sfdn93rh1ke8fa
title: なぜ Tailwind CSS は line-height を leading と呼ぶのか？ 由来や経緯を調べてみた
url: 'https://zenn.dev/y_ta/articles/why-tailwind-leading-tracking'
source: zenn
published_at: '2026-05-09T12:58:38.000Z'
collected_at: '2026-05-10T22:22:57.437Z'
summary: >-
  Tailwind CSSを使っていると、いつも直面する問題があります。それは、行間と文字間の指定方法を毎回忘れてしまうことです。

  CSSでは、行間はline-height、文字間はletter-spacingで指定します。ところがTailwind
  CSSでは、それぞれleadingとtrackingという、どこから出てきたのかまるでわからない名前を使用します。

    Tailwind CSS

  最近はAIが出てきて別に忘れてしまったからと言って特段困るということはありませんが、以前は毎回...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--p4G5Yh2x--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2581%25AA%25E3%2581%259C%2520Tailwind%2520CSS%2520%25E3%2581%25AF%2520line-height%2520%25E3%2582%2592%2520leading%2520%25E3%2581%25A8%25E5%2591%25BC%25E3%2581%25B6%25E3%2581%25AE%25E3%2581%258B%25EF%25BC%259F%2520%25E7%2594%25B1%25E6%259D%25A5%25E3%2582%2584%25E7%25B5%258C%25E7%25B7%25AF%25E3%2582%2592%25E8%25AA%25BF%25E3%2581%25B9%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:y_ta%2540%25E9%25A7%2586%25E3%2581%2591%25E5%2587%25BA%25E3%2581%2597Web%25E3%2582%25A8%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%258B%25E3%2582%25A2%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzAyMGI4MDJjZDUuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# なぜ Tailwind CSS は line-height を leading と呼ぶのか？ 由来や経緯を調べてみた

Tailwind CSSを使っていると、いつも直面する問題があります。それは、行間と文字間の指定方法を毎回忘れてしまうことです。
CSSでは、行間はline-height、文字間はletter-spacingで指定します。ところがTailwind CSSでは、それぞれleadingとtrackingという、どこから出てきたのかまるでわからない名前を使用します。

  Tailwind CSS

最近はAIが出てきて別に忘れてしまったからと言って特段困るということはありませんが、以前は毎回...
