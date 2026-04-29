---
id: 48l742f7jqdcx3fa
title: DIDP の Rust インターフェース RPID で柔軟な数理最適化モデリング + Wasm
url: 'https://zenn.dev/espeon011/articles/3022342eb6f2ba'
source: zenn
published_at: '2026-04-28T10:04:54.000Z'
collected_at: '2026-04-29T22:27:13.456Z'
summary: >-
  はじめに

  皆さん DIDP はご存じでしょうか?

  国立情報学研究所の黒岩稜先生が開発された動的計画法ベースの数理最適化ソルバーで,
  特殊な定式化が求められる代わりに一部の問題では商用の数理最適化ソルバーを上回る性能を発揮します.

  DIDP は Rust, Python, YAML の形式で最適化問題を定義することができ, それぞれ次のような名前のライブラリとなっています.


  Rust: dypdl

  Python: DIDPPy

  YAML: didp-yaml


  DIDPPy を用いた最短共通超配列問題の定式化については okaduki 氏による詳細な解説をぜひ読んでください. また,...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--mpv7K6Gc--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:DIDP%2520%25E3%2581%25AE%2520Rust%2520%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25BF%25E3%2583%25BC%25E3%2583%2595%25E3%2582%25A7%25E3%2583%25BC%25E3%2582%25B9%2520RPID%2520%25E3%2581%25A7%25E6%259F%2594%25E8%25BB%259F%25E3%2581%25AA%25E6%2595%25B0%25E7%2590%2586%25E6%259C%2580%25E9%2581%25A9%25E5%258C%2596%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AA%25E3%2583%25B3%25E3%2582%25B0%2520%252B%2520Wasm%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:espeon011%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2YyNzQ3ZmEwODEuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# DIDP の Rust インターフェース RPID で柔軟な数理最適化モデリング + Wasm

はじめに
皆さん DIDP はご存じでしょうか?
国立情報学研究所の黒岩稜先生が開発された動的計画法ベースの数理最適化ソルバーで, 特殊な定式化が求められる代わりに一部の問題では商用の数理最適化ソルバーを上回る性能を発揮します.
DIDP は Rust, Python, YAML の形式で最適化問題を定義することができ, それぞれ次のような名前のライブラリとなっています.

Rust: dypdl
Python: DIDPPy
YAML: didp-yaml

DIDPPy を用いた最短共通超配列問題の定式化については okaduki 氏による詳細な解説をぜひ読んでください. また,...
