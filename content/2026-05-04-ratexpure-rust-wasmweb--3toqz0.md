---
id: 3toqz0qxif91269s
title: RaTeX（Pure Rust × WASM）で数式をWebに表示する
url: 'https://zenn.dev/dannchu/articles/ratex-wasm-math-renderer'
source: zenn
published_at: '2026-05-04T01:14:06.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: >-
  RaTeX とは

  RaTeX は Pure Rust で書かれた KaTeX 互換の数式レンダラーです。WebAssembly（WASM）にコンパイルされ、ブラウザ上で
  LaTeX 数式を canvas に描画する Web Component として使えます。


  KaTeX の LaTeX 構文をほぼそのまま使える


  \ce{} による化学式、\pu{} による単位表記にも対応

  npm CDN から1行で読み込むだけで利用可能


  デモサイトを公開しています：

  https://shimizudan.github.io/20260504ratex/


   基本的な使い方
  <!-- ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--j4GAHDBe--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:RaTeX%25EF%25BC%2588Pure%2520Rust%2520%25C3%2597%2520WASM%25EF%25BC%2589%25E3%2581%25A7%25E6%2595%25B0%25E5%25BC%258F%25E3%2582%2592Web%25E3%2581%25AB%25E8%25A1%25A8%25E7%25A4%25BA%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E6%25B8%2585%25E6%25B0%25B4%25E5%259B%25A3%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzFkNzg2OWJhNjcuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# RaTeX（Pure Rust × WASM）で数式をWebに表示する

RaTeX とは
RaTeX は Pure Rust で書かれた KaTeX 互換の数式レンダラーです。WebAssembly（WASM）にコンパイルされ、ブラウザ上で LaTeX 数式を canvas に描画する Web Component として使えます。

KaTeX の LaTeX 構文をほぼそのまま使える

\ce{} による化学式、\pu{} による単位表記にも対応
npm CDN から1行で読み込むだけで利用可能

デモサイトを公開しています：
https://shimizudan.github.io/20260504ratex/


 基本的な使い方
<!-- ...
