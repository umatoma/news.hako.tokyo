---
id: 3ivh8ku978unj0zl
title: Deno に DOMMatrix を入れるために Rust で CSS Values and Units の構文解析、計算をした話
url: 'https://zenn.dev/pixiv/articles/69638446455b0d'
source: zenn
published_at: '2026-04-28T17:22:24.000Z'
collected_at: '2026-04-29T22:27:13.456Z'
summary: >-
  趣味で Deno コントリビューターをやっている @petamoriken です。

  Deno の内部コード刷新を手伝いながら、2年以上かけてゆっくりと Geometry Interfaces
  の実装を進めていましたが、ようやくこの度マージされました。

  https://github.com/denoland/deno/pull/27527

  この記事ではその実装を進める中で得た知見として、特に CSS Values and Units の構文解析、計算部分にフォーカスして書いていこうと思います。

   背景
  Deno は Firefox と同じく wgpu クレートを使った WebGPU AP...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--CouWNfVa--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Deno%2520%25E3%2581%25AB%2520DOMMatrix%2520%25E3%2582%2592%25E5%2585%25A5%25E3%2582%258C%25E3%2582%258B%25E3%2581%259F%25E3%2582%2581%25E3%2581%25AB%2520Rust%2520%25E3%2581%25A7%2520CSS%2520Values%2520and%2520Units%2520%25E3%2581%25AE%25E6%25A7%258B%25E6%2596%2587%25E8%25A7%25A3...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:petamoriken%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzZhMDc3ZWRhZTMuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:pixiv%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzMzODlhMzQ2ZjQuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Deno に DOMMatrix を入れるために Rust で CSS Values and Units の構文解析、計算をした話

趣味で Deno コントリビューターをやっている @petamoriken です。
Deno の内部コード刷新を手伝いながら、2年以上かけてゆっくりと Geometry Interfaces の実装を進めていましたが、ようやくこの度マージされました。
https://github.com/denoland/deno/pull/27527
この記事ではその実装を進める中で得た知見として、特に CSS Values and Units の構文解析、計算部分にフォーカスして書いていこうと思います。

 背景
Deno は Firefox と同じく wgpu クレートを使った WebGPU AP...
