---
id: 4hpqacb7ta7c9p3z
title: LLMから呼ばれるアプリをMCPファーストで設計するときの3つの原則
url: 'https://zenn.dev/ykenkou001/articles/mcp-first-regulatory-saas'
source: zenn
published_at: '2026-05-09T10:28:39.000Z'
collected_at: '2026-05-10T22:22:57.437Z'
summary: >-
  CLO（物流統括管理者）の意思決定支援アプリを個人開発する中で、設計を3回作り直しました。原因は、画面でもAPIでもなく、「LLMから呼ばれる」ことを最初の設計制約に入れていなかったことです。

  LLMから呼ばれることを前提にすると、業務アプリの設計順序はひっくり返ります。先にWeb画面を作ってからAPIを足し、最後にMCPサーバーを後付けする──という普通の順序ではうまくいきません。

  3回作り直した結果、MCPファーストで組むと判断ロジックが腐らないと分かってきました。この記事では、その過程で見えた3つの原則をまとめます。

  !

  この記事では、法対応・コンプライアンス・GRC・ESGのよう...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--Y79pAakr--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:LLM%25E3%2581%258B%25E3%2582%2589%25E5%2591%25BC%25E3%2581%25B0%25E3%2582%258C%25E3%2582%258B%25E3%2582%25A2%25E3%2583%2597%25E3%2583%25AA%25E3%2582%2592MCP%25E3%2583%2595%25E3%2582%25A1%25E3%2583%25BC%25E3%2582%25B9%25E3%2583%2588%25E3%2581%25A7%25E8%25A8%25AD%25E8%25A8%2588%25E3%2581%2599%25E3%2582%258B%25E3%2581%25A8%25E3%2581%258D%25E3%2581%25AE3%25E3%2581%25A4%25E3%2581%25AE%25E5%258E%259F%25E5%2589%2587%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:ykenk%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZnE1anY2R2lxTHlKNFExNm9mQ3ZZa1RpX1lqOGtjenUtSDNUZ1Rpd181PXM5Ni1j%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# LLMから呼ばれるアプリをMCPファーストで設計するときの3つの原則

CLO（物流統括管理者）の意思決定支援アプリを個人開発する中で、設計を3回作り直しました。原因は、画面でもAPIでもなく、「LLMから呼ばれる」ことを最初の設計制約に入れていなかったことです。
LLMから呼ばれることを前提にすると、業務アプリの設計順序はひっくり返ります。先にWeb画面を作ってからAPIを足し、最後にMCPサーバーを後付けする──という普通の順序ではうまくいきません。
3回作り直した結果、MCPファーストで組むと判断ロジックが腐らないと分かってきました。この記事では、その過程で見えた3つの原則をまとめます。
!
この記事では、法対応・コンプライアンス・GRC・ESGのよう...
