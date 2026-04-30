---
id: 5ifqggya4o6o2h9u
title: UIの面倒、実はDBの問題だった ― Local-First と Instant が示す Web 開発の未来
url: 'https://zenn.dev/sc30gsw/articles/a39bd748caa861'
source: zenn
published_at: '2026-04-29T03:23:16.000Z'
collected_at: '2026-04-30T22:26:14.310Z'
summary: |-
  はじめに
  2026 年 4 月、開発開始から 4 年を経て Instant が v1.0 をリリースしました。
  https://x.com/stopachka/status/2042307808541188148
  アナウンスでは、次の 3 つが改めて押し出されています。


  Unlimited apps（多テナント Postgres なのでフリープランが止まらない）

  A sync engine in every app（Figma / Notion / Linear と同じ系譜のリアルタイム同期）

  Batteries included（Auth / File storage / ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--Y4PVJlTe--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:UI%25E3%2581%25AE%25E9%259D%25A2%25E5%2580%2592%25E3%2580%2581%25E5%25AE%259F%25E3%2581%25AFDB%25E3%2581%25AE%25E5%2595%258F%25E9%25A1%258C%25E3%2581%25A0%25E3%2581%25A3%25E3%2581%259F%2520%25E2%2580%2595%2520Local-First%2520%25E3%2581%25A8%2520Instant%2520%25E3%2581%258C%25E7%25A4%25BA%25E3%2581%2599%2520Web%2520%25E9%2596%258B%25E7%2599%25BA%25E3%2581%25AE%25E6%259C%25AA%25E6%259D%25A5%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:kaito%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2VmZDZhMGM5YWUuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# UIの面倒、実はDBの問題だった ― Local-First と Instant が示す Web 開発の未来

はじめに
2026 年 4 月、開発開始から 4 年を経て Instant が v1.0 をリリースしました。
https://x.com/stopachka/status/2042307808541188148
アナウンスでは、次の 3 つが改めて押し出されています。


Unlimited apps（多テナント Postgres なのでフリープランが止まらない）

A sync engine in every app（Figma / Notion / Linear と同じ系譜のリアルタイム同期）

Batteries included（Auth / File storage / ...
