---
id: 432geeoh97hatobb
title: AndroidでClaude Code / Codex / Gemini CLIを動かすネイティブAIターミナルIDEを作った
url: 'https://zenn.dev/ryoitabashi/articles/744397718965f6'
source: zenn
published_at: '2026-05-01T14:57:21.000Z'
collected_at: '2026-05-02T22:19:46.960Z'
summary: |-
  前回、スマホだけで10万行規模のターミナルIDEを作った話を書いた。
  今回はその続きです。

  結論から言うと、Shellyは現在、Galaxy Z Fold6上で以下のAIコーディングCLIを実際に起動できるところまで来ました。

  Claude Code
  OpenAI Codex CLI
  Gemini CLI

  しかもTermuxやprootの中ではなく、AndroidアプリであるShelly自身の中で動いています。
  現在の検証環境では、以下の状態です。
  claude extracted         OK 2.1.126 (Claude Code)
  codex runtime    ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--iXD_PNz0--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Android%25E3%2581%25A7Claude%2520Code%2520%252F%2520Codex%2520%252F%2520Gemini%2520CLI%25E3%2582%2592%25E5%258B%2595%25E3%2581%258B%25E3%2581%2599%25E3%2583%258D%25E3%2582%25A4%25E3%2583%2586%25E3%2582%25A3%25E3%2583%2596AI%25E3%2582%25BF%25E3%2583%25BC%25E3%2583%259F%25E3%2583%258A%25E3%2583%25ABI...%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:RYO%2520ITABASHI%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzY4MDViNWQxYTYuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# AndroidでClaude Code / Codex / Gemini CLIを動かすネイティブAIターミナルIDEを作った

前回、スマホだけで10万行規模のターミナルIDEを作った話を書いた。
今回はその続きです。

結論から言うと、Shellyは現在、Galaxy Z Fold6上で以下のAIコーディングCLIを実際に起動できるところまで来ました。

Claude Code
OpenAI Codex CLI
Gemini CLI

しかもTermuxやprootの中ではなく、AndroidアプリであるShelly自身の中で動いています。
現在の検証環境では、以下の状態です。
claude extracted         OK 2.1.126 (Claude Code)
codex runtime    ...
