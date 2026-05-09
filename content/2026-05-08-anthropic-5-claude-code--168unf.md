---
id: 168unf824mtio2el
title: Anthropic の 5 パターンで Claude Code エージェント設計を分類する
url: >-
  https://zenn.dev/motowo/articles/anthropic-multi-agent-coordination-patterns-guide
source: zenn
published_at: '2026-05-08T09:00:09.000Z'
collected_at: '2026-05-09T22:22:03.353Z'
summary: >-
  はじめに

  マルチエージェント設計の議論で「これは Orchestrator パターン？　それとも Agent
  Teams？」と意見が割れた経験はありませんか。Anthropic 公式の 5 つの協調パターン（Generator-Verifier /
  Orchestrator-Subagent / Agent Teams / Message Bus / Shared State）を Claude Code
  視点で解説し、サブエージェント設計やエージェントオーケストレーションの共通語彙として使えるかたちに整理します。協調パターンを指す共通の語彙がないと、設計レビューはすぐに各人の経験談...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--PI8gBBPy--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Anthropic%2520%25E3%2581%25AE%25205%2520%25E3%2583%2591%25E3%2582%25BF%25E3%2583%25BC%25E3%2583%25B3%25E3%2581%25A7%2520Claude%2520Code%2520%25E3%2582%25A8%25E3%2583%25BC%25E3%2582%25B8%25E3%2582%25A7%25E3%2583%25B3%25E3%2583%2588%25E8%25A8%25AD%25E8%25A8%2588%25E3%2582%2592%25E5%2588%2586%25E9%25A1%259E%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2582%25BF%25E3%2582%25AB%25E3%2582%25B7%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUVkRlRwNFVrcjBsNS12cTB1VFlTZnFvdUt6QklsaGNTM2o5cmtCT1VWMjM9czk2LWM=%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Anthropic の 5 パターンで Claude Code エージェント設計を分類する

はじめに
マルチエージェント設計の議論で「これは Orchestrator パターン？　それとも Agent Teams？」と意見が割れた経験はありませんか。Anthropic 公式の 5 つの協調パターン（Generator-Verifier / Orchestrator-Subagent / Agent Teams / Message Bus / Shared State）を Claude Code 視点で解説し、サブエージェント設計やエージェントオーケストレーションの共通語彙として使えるかたちに整理します。協調パターンを指す共通の語彙がないと、設計レビューはすぐに各人の経験談...
