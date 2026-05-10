---
id: 4bcuo0kgin8hckxc
title: CodexをローカルLLMで駆動する
url: 'https://zenn.dev/robustonian/articles/codex_with_local_llm'
source: zenn
published_at: '2026-05-10T07:47:08.000Z'
collected_at: '2026-05-10T22:22:57.437Z'
summary: >-
  はじめに

  本記事では、ローカルLLMを用いてCodex CLIを駆動するための方法についてまとめる。

  !

  検証環境はUbuntu 24.04 LTSで行っているが、一般的なLinuxや、Mac、WSL環境でもそのまま使えるかも。


   背景
  私は生成AIのベンチマーク評価をすることが趣味の一つなのだが、最近はLLMとClaude
  CodeやCodexなどのハーネスを組み合わせた際のエージェント性能を評価することが多い。

  一般的なハーネスはOpenAI Compatible、すなわちChat Completion APIで動くものが殆どで、それ以外としてClaude
  CodeはAnth...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s---3c-iGH---/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Codex%25E3%2582%2592%25E3%2583%25AD%25E3%2583%25BC%25E3%2582%25AB%25E3%2583%25ABLLM%25E3%2581%25A7%25E9%25A7%2586%25E5%258B%2595%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E9%2587%2591%25E3%2581%25AE%25E3%2583%258B%25E3%2583%25AF%25E3%2583%2588%25E3%2583%25AA%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzQ1NmVjZjczNWIuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# CodexをローカルLLMで駆動する

はじめに
本記事では、ローカルLLMを用いてCodex CLIを駆動するための方法についてまとめる。
!
検証環境はUbuntu 24.04 LTSで行っているが、一般的なLinuxや、Mac、WSL環境でもそのまま使えるかも。


 背景
私は生成AIのベンチマーク評価をすることが趣味の一つなのだが、最近はLLMとClaude CodeやCodexなどのハーネスを組み合わせた際のエージェント性能を評価することが多い。
一般的なハーネスはOpenAI Compatible、すなわちChat Completion APIで動くものが殆どで、それ以外としてClaude CodeはAnth...
