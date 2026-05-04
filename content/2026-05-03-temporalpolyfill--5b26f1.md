---
id: 5b26f1im8qgbc19f
title: Temporalのpolyfillをゼロから実装した
url: 'https://zenn.dev/fabon/articles/84f7696cd8a2fb'
source: zenn
published_at: '2026-05-03T19:31:36.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: |-
  自作した理由は単純で、既存のpolyfillに満足できなかったからです。
  !
  この記事は自分のブログに投稿した英語版の日本語訳で、内容はだいたい同じです。


   要約
  https://npmx.dev/package/temporal-polyfill-lite

  軽量なTemporalのpolyfillであるtemporal-polyfill-liteを実装しました。
  最終版（最新）の仕様を実装しており、TypeScript公式の型定義とも互換性があります。
  大半の（グレゴリオ暦しか使わない）開発者にとっては、2026年4月現在これが一番バンドルサイズの小さいpolyfillとなってい...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--NHegBCSZ--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Temporal%25E3%2581%25AEpolyfill%25E3%2582%2592%25E3%2582%25BC%25E3%2583%25AD%25E3%2581%258B%25E3%2582%2589%25E5%25AE%259F%25E8%25A3%2585%25E3%2581%2597%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%25B5%25E3%2581%2581%25E3%2581%25BC%25E3%2582%2593%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzVlMThiZjIwMDEuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Temporalのpolyfillをゼロから実装した

自作した理由は単純で、既存のpolyfillに満足できなかったからです。
!
この記事は自分のブログに投稿した英語版の日本語訳で、内容はだいたい同じです。


 要約
https://npmx.dev/package/temporal-polyfill-lite

軽量なTemporalのpolyfillであるtemporal-polyfill-liteを実装しました。
最終版（最新）の仕様を実装しており、TypeScript公式の型定義とも互換性があります。
大半の（グレゴリオ暦しか使わない）開発者にとっては、2026年4月現在これが一番バンドルサイズの小さいpolyfillとなってい...
