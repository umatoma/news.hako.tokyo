---
id: 596dwgglzyny59jp
title: GitHub のアップデートを、Youtube ショート感覚でダラダラ見られる動画にしてみた
url: 'https://zenn.dev/microsoft/articles/github-update-movie-agent'
source: zenn
published_at: '2026-04-25T20:02:09.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  ⚠️ 2026年4月時点の情報です。GitHub Copilot Agent Skills も Remotion
  も活発に更新されているので、最新仕様は公式ドキュメントを確認してください。


   記事のまとめ (TL;DR)

  GitHub Changelog の URL を渡すと、オリジナルキャラが解説する mp4 が出てくる仕組みを作りました

  構成は GitHub Copilot Agent Skills（台本生成） × VOICEVOX（音声合成） × Remotion（動画合成） の3段

  中核は GitHub Copilot Agent Skills。記事を読んで台本を書く工程...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--4_VuEHdM--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:GitHub%2520%25E3%2581%25AE%25E3%2582%25A2%25E3%2583%2583%25E3%2583%2597%25E3%2583%2587%25E3%2583%25BC%25E3%2583%2588%25E3%2582%2592%25E3%2580%2581Youtube%2520%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25BC%25E3%2583%2588%25E6%2584%259F%25E8%25A6%259A%25E3%2581%25A7%25E3%2583%2580%25E3%2583%25A9%25E3%2583%2580%25E3%2583%25A9%25E8%25A6%258B%25E3%2582%2589%25E3%2582%258C%25E3%2582%258B%25E5%258B%2595%25E7%2594%25BB%25E3%2581%25AB%25E3%2581%2597%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:marumaru1019%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2MzZDNiN2I3OGYuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:Microsoft%2520%2528%25E6%259C%2589%25E5%25BF%2597%2529%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzNlMDUxYjNhZWEuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# GitHub のアップデートを、Youtube ショート感覚でダラダラ見られる動画にしてみた

⚠️ 2026年4月時点の情報です。GitHub Copilot Agent Skills も Remotion も活発に更新されているので、最新仕様は公式ドキュメントを確認してください。


 記事のまとめ (TL;DR)

GitHub Changelog の URL を渡すと、オリジナルキャラが解説する mp4 が出てくる仕組みを作りました
構成は GitHub Copilot Agent Skills（台本生成） × VOICEVOX（音声合成） × Remotion（動画合成） の3段
中核は GitHub Copilot Agent Skills。記事を読んで台本を書く工程...
