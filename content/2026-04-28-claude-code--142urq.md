---
id: 142urqbaca7zvfr2
title: Claude Code に仕事を譲った日——残ったのは「判断」と「責任」だった
url: 'https://zenn.dev/tokium_dev/articles/ca6f30192f6379'
source: zenn
published_at: '2026-04-28T04:37:45.000Z'
collected_at: '2026-04-30T22:26:14.310Z'
summary: >-
  はじめに

  私はもともとIS（インサイドセールス）、いわゆる営業サイドの人間だった。

  コードは書けない。SQLも知らない。ターミナルを開いたこともなかった。そんな自分が、ある日開発部のCRE（Customer Reliability
  Engineering）チームに異動した。

  CREの仕事は、お客様からの技術的な問い合わせを調査して回答すること。「承認フローが変わってしまった」「エクスポートが終わらない」「メールが届かない」——毎日そういった問い合わせがJiraに積まれていく。

  調査には、本番DBへのクエリ実行、Rails/Reactのコードリーディング、ログの解析が必要になる。正直に...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--l8sXEJ5n--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%2520%25E3%2581%25AB%25E4%25BB%2595%25E4%25BA%258B%25E3%2582%2592%25E8%25AD%25B2%25E3%2581%25A3%25E3%2581%259F%25E6%2597%25A5%25E2%2580%2594%25E2%2580%2594%25E6%25AE%258B%25E3%2581%25A3%25E3%2581%259F%25E3%2581%25AE%25E3%2581%25AF%25E3%2580%258C%25E5%2588%25A4%25E6%2596%25AD%25E3%2580%258D%25E3%2581%25A8%25E3%2580%258C%25E8%25B2%25AC%25E4%25BB%25BB%25E3%2580%258D%25E3%2581%25A0%25E3%2581%25A3%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:Kokoichi%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzViNTEwYjI5ZjEuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/g_south_west%2Ch_34%2Cl_default:og-publication-pro-mark-xcosax%2Cw_34%2Cx_217%2Cy_158/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:TOKIUM%25E3%2583%2597%25E3%2583%25AD%25E3%2583%2580%25E3%2582%25AF%25E3%2583%2588%25E3%2583%2581%25E3%2583%25BC%25E3%2583%25A0%2520%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_255%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzVkNjg4YzM2Y2MuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Code に仕事を譲った日——残ったのは「判断」と「責任」だった

はじめに
私はもともとIS（インサイドセールス）、いわゆる営業サイドの人間だった。
コードは書けない。SQLも知らない。ターミナルを開いたこともなかった。そんな自分が、ある日開発部のCRE（Customer Reliability Engineering）チームに異動した。
CREの仕事は、お客様からの技術的な問い合わせを調査して回答すること。「承認フローが変わってしまった」「エクスポートが終わらない」「メールが届かない」——毎日そういった問い合わせがJiraに積まれていく。
調査には、本番DBへのクエリ実行、Rails/Reactのコードリーディング、ログの解析が必要になる。正直に...
