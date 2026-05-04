---
id: 1bq38yhm629qfb4d
title: GitHubに機密情報をpushしてしまった日のために — 無効化、履歴除去、多層防御の組み立て方
url: 'https://zenn.dev/okamyuji/articles/github-secret-removal-multi-layer-defense'
source: zenn
published_at: '2026-05-03T19:08:44.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: >-
  はじめに

  GitHubに機密情報が混入してしまったとき、最初に取るべき行動は履歴削除ではありません。漏れたものが何なのかで対応の順序が大きく変わります。本記事では、GitHub
  Enterprise CloudやGitHub Enterprise
  Serverを前提に、機密情報の混入を止める仕組みと、混入してしまったあとに残存物を取り除くための作業を、コマンドが手元で再現できる粒度で整理します。

  GitHub
  Docsの該当ページは、漏えいしたものが認証情報であれば、まず無効化やローテーションを行うべきだとしています。無効化できれば履歴の書き換えまで踏み込まなくてよい場合もあります。...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--pyD28Upq--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:GitHub%25E3%2581%25AB%25E6%25A9%259F%25E5%25AF%2586%25E6%2583%2585%25E5%25A0%25B1%25E3%2582%2592push%25E3%2581%2597%25E3%2581%25A6%25E3%2581%2597%25E3%2581%25BE%25E3%2581%25A3%25E3%2581%259F%25E6%2597%25A5%25E3%2581%25AE%25E3%2581%259F%25E3%2582%2581%25E3%2581%25AB%2520%25E2%2580%2594%2520%25E7%2584%25A1%25E5%258A%25B9%25E5%258C%2596%25E3%2580%2581%25E5%25B1%25A5%25E6%25AD%25B4%25E9%2599%25A4%25E5%258E%25BB%25E3%2580%2581%25E5%25A4%259A%25E5%25B1%25A4%25E9%2598%25B2%25E5%25BE%25A1%25E3%2581%25AE%25E7%25B5%2584%25E3%2581%25BF%25E7%25AB%258B%25E3%2581%25A6%25E6%2596%25B9%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:okamyuji%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzY5YjFmNDYyYjkuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# GitHubに機密情報をpushしてしまった日のために — 無効化、履歴除去、多層防御の組み立て方

はじめに
GitHubに機密情報が混入してしまったとき、最初に取るべき行動は履歴削除ではありません。漏れたものが何なのかで対応の順序が大きく変わります。本記事では、GitHub Enterprise CloudやGitHub Enterprise Serverを前提に、機密情報の混入を止める仕組みと、混入してしまったあとに残存物を取り除くための作業を、コマンドが手元で再現できる粒度で整理します。
GitHub Docsの該当ページは、漏えいしたものが認証情報であれば、まず無効化やローテーションを行うべきだとしています。無効化できれば履歴の書き換えまで踏み込まなくてよい場合もあります。...
