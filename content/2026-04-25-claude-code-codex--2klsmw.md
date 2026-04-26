---
id: 2klsmwbj5wemksmy
title: Claude Code の設定を Codex にどう対応づけるか
url: 'https://zenn.dev/ryok/articles/claude-code-to-codex-settings'
source: zenn
published_at: '2026-04-25T20:11:29.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  はじめに

  Claude Code を日常的に使っていると、同じ開発環境を Codex でもできるだけ再現したくなります。

  Codex は OpenAI が提供するターミナルベースのコーディングエージェントで、Claude Code と同じカテゴリのツールです。

  ただし、Claude Code と Codex
  は似ている部分もある一方で、設定モデルや拡張方法が完全に一致しているわけではありません。単純な置き換えではなく、どこまでを共通化し、どこからを別物として扱うかを決める必要があります。

  この記事では、実際に dotfiles 上で Claude Code 向けの設定を Codex ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--XRXFYSCR--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%2520%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A%25E3%2582%2592%2520Codex%2520%25E3%2581%25AB%25E3%2581%25A9%25E3%2581%2586%25E5%25AF%25BE%25E5%25BF%259C%25E3%2581%25A5%25E3%2581%2591%25E3%2582%258B%25E3%2581%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:ryok%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzc3MjU0NDY4YzUuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Code の設定を Codex にどう対応づけるか

はじめに
Claude Code を日常的に使っていると、同じ開発環境を Codex でもできるだけ再現したくなります。
Codex は OpenAI が提供するターミナルベースのコーディングエージェントで、Claude Code と同じカテゴリのツールです。
ただし、Claude Code と Codex は似ている部分もある一方で、設定モデルや拡張方法が完全に一致しているわけではありません。単純な置き換えではなく、どこまでを共通化し、どこからを別物として扱うかを決める必要があります。
この記事では、実際に dotfiles 上で Claude Code 向けの設定を Codex ...
