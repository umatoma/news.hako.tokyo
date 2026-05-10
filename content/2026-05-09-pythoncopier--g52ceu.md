---
id: g52ceuqmrfsnswxa
title: Pythonプロジェクトを作るたびに同じ設定をコピペするのをやめたい（Copier使ってみた）
url: 'https://zenn.dev/zaspa/articles/adf4230e859665'
source: zenn
published_at: '2026-05-09T16:21:53.000Z'
collected_at: '2026-05-10T22:22:57.437Z'
summary: >-
  1. はじめに

  最近は、Claude CodeやCodexなどを使うことで、色々なアプリを作るハードルが下がってきました。

  一方で、毎回Pythonプロジェクトの初期設定をするのは、地味に面倒です。

  例えば、pyproject.toml に Ruff
  などの設定を書き、.editorconfig、Taskfile.yaml、.gitignore、README.md
  なども過去のプロジェクトからコピーして、プロジェクト名やパッケージ名だけ直す、という面倒な作業を繰り返していました。

  そのせいで、少し試したいことがあっても「また初期設定するのか」と感じ、新しい環境を作るハードルになってい...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--i_YqUfdI--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Python%25E3%2583%2597%25E3%2583%25AD%25E3%2582%25B8%25E3%2582%25A7%25E3%2582%25AF%25E3%2583%2588%25E3%2582%2592%25E4%25BD%259C%25E3%2582%258B%25E3%2581%259F%25E3%2581%25B3%25E3%2581%25AB%25E5%2590%258C%25E3%2581%2598%25E8%25A8%25AD%25E5%25AE%259A%25E3%2582%2592%25E3%2582%25B3%25E3%2583%2594%25E3%2583%259A%25E3%2581%2599%25E3%2582%258B%25E3%2581%25AE%25E3%2582%2592%25E3%2582%2584%25E3%2582%2581%25E3%2581%259F%25E3%2581%2584%25EF%25BC%2588Copier%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%25EF%25BC%2589%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:zaspa%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzliMTM1NzFhMTYuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Pythonプロジェクトを作るたびに同じ設定をコピペするのをやめたい（Copier使ってみた）

1. はじめに
最近は、Claude CodeやCodexなどを使うことで、色々なアプリを作るハードルが下がってきました。
一方で、毎回Pythonプロジェクトの初期設定をするのは、地味に面倒です。
例えば、pyproject.toml に Ruff などの設定を書き、.editorconfig、Taskfile.yaml、.gitignore、README.md なども過去のプロジェクトからコピーして、プロジェクト名やパッケージ名だけ直す、という面倒な作業を繰り返していました。
そのせいで、少し試したいことがあっても「また初期設定するのか」と感じ、新しい環境を作るハードルになってい...
